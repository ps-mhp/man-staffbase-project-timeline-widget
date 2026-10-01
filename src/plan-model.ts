/*!
 * Copyright 2026, MHP Management und IT-Beratung GmbH and contributors.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Was das Widget speichert, und wie es in das Attribut `plan` kommt.
 *
 * Frei von DOM und React: die Regeln — was ein gültiger Eintrag ist, was beim
 * Lesen verworfen wird — sollen ohne Renderer prüfbar bleiben.
 *
 * Der Plan steht in einem Attribut, weil seine Teile aufeinander verweisen:
 * Einträge nennen Ebene, Kategorie und Vorgänger per `id`. Auf mehrere
 * Attribute verteilt könnten diese Verweise beim Speichern auseinanderlaufen.
 */

import { decodePayload, encodePayload, isPayload } from "@shared/payload";

import { DayNumber, formatIsoDate, parseIsoDate, parseIsoMonth, todayDay } from "./calendar";

export type ItemKind = "milestone" | "bar" | "deadline";

/** Die Form der Meilensteine einer Kategorie; siehe `symbols.ts` für Namen und Zeichnung. */
export type MilestoneSymbol =
  | "diamond"
  | "triangle"
  | "triangle-down"
  | "square"
  | "circle"
  | "hexagon"
  | "star"
  | "plus";

export const MILESTONE_SYMBOLS: readonly MilestoneSymbol[] = [
  "diamond",
  "triangle",
  "triangle-down",
  "square",
  "circle",
  "hexagon",
  "star",
  "plus",
];

/**
 * Alles, was eine spätere Version geschrieben hat und diese nicht kennt.
 * Ohne diesen Beutel löschte eine Redaktion mit älterem Bundle beim ersten
 * Speichern fremde Felder.
 */
type Unknown = Record<string, unknown>;

export interface Lane {
  id: string;
  title: string;
  unknown?: Unknown;
}

export interface Category {
  id: string;
  title: string;
  /** `#RRGGBB`. */
  color: string;
  /**
   * Die Form ihrer Meilensteine. Farbe und Form gehören zur Kategorie — sonst
   * trüge dieselbe Kategorie mal ein Dreieck, mal eine Raute.
   */
  symbol?: MilestoneSymbol;
  unknown?: Unknown;
}

interface ItemBase {
  id: string;
  title: string;
  description?: string;
  /** Fehlt oder zeigt ins Leere: „ohne Kategorie". */
  category?: string;
  /** Vorläufig, noch nicht fest — „tbd" in der Vorlage. */
  tentative?: boolean;
  /** Die `id`s der Vorgänger. Nur Meilensteine und Zeiträume. */
  dependsOn?: string[];
  unknown?: Unknown;
}

export interface MilestoneItem extends ItemBase {
  kind: "milestone";
  lane: string;
  /** `JJJJ-MM-TT`. */
  date: string;
  /**
   * Nur noch gelesen, nicht mehr gepflegt: die Form kommt von der Kategorie.
   * Pläne vor dem 30.09.2026 trugen sie am Meilenstein; beim Lesen erbt eine
   * Kategorie ohne eigene Form die häufigste ihrer Meilensteine, und ohne
   * Kategorie gilt sie weiter.
   */
  symbol?: MilestoneSymbol;
  series?: string;
}

export interface BarItem extends ItemBase {
  kind: "bar";
  lane: string;
  /** `JJJJ-MM-TT`, einschließlich. */
  start: string;
  /** `JJJJ-MM-TT`, einschließlich. */
  end: string;
  /** Endet in einer Pfeilspitze — „läuft weiter" in der Vorlage. */
  arrow?: boolean;
  series?: string;
}

export interface DeadlineItem extends ItemBase {
  kind: "deadline";
  /** `JJJJ-MM-TT`. Ein Stichtag gehört zu keiner Ebene, er läuft durch alle. */
  date: string;
}

export type PlanItem = MilestoneItem | BarItem | DeadlineItem;

/** Ein Eintrag, der in einer Ebene steht. */
export type LaneItem = MilestoneItem | BarItem;

/** Die Startansicht, monatsgenau, beide Monate eingeschlossen. */
export interface PlanView {
  /** `JJJJ-MM`. */
  start: string;
  /** `JJJJ-MM`. */
  end: string;
}

export interface Plan {
  version: 1;
  /**
   * Überschrift über dem Plan und Name der Excel-Datei. Steht im Plan und nicht
   * in einem eigenen Attribut: `title` ist ein globales HTML-Attribut (der
   * Browser zeigte es als Tooltip über dem ganzen Widget), und die geteilte
   * Übersetzung trägt je Widget genau ein Attribut — im Plan reist die
   * Überschrift mit.
   */
  title?: string;
  /** `JJJJ-MM-TT`; der Editor setzt es bei jeder Änderung. */
  updatedAt?: string;
  view?: PlanView;
  lanes: Lane[];
  categories: Category[];
  items: PlanItem[];
  unknown?: Unknown;
}

/** Was beim Lesen herauskommt — samt der Zahl der verworfenen Einträge für den Editor. */
export interface PlanReadResult {
  plan: Plan;
  dropped: number;
}

/** Mehr trägt ein Plan nicht; der Editor nimmt darüber hinaus nichts an. */
export const LIMITS = { items: 300, lanes: 20, categories: 24 } as const;

/** Die Farbe von Einträgen ohne Kategorie; entspricht `man("text-subtle")`. */
export const UNCATEGORIZED_COLOR = "#71787F";

export function emptyPlan(): Plan {
  return { version: 1, lanes: [], categories: [], items: [] };
}

/**
 * Erzeugt eine Kennung, die auch dann eindeutig ist, wenn `crypto.randomUUID`
 * fehlt — der Konfigurationsdialog läuft in fremden Seiten, und in einem
 * unsicheren Kontext (http) stellt der Browser die Web-Crypto-API nicht.
 */
export function newId(prefix: string): string {
  const uuid = globalThis.crypto?.randomUUID;
  if (typeof uuid === "function") return `${prefix}-${uuid.call(globalThis.crypto)}`;
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export const isLaneItem = (item: PlanItem): item is LaneItem => item.kind !== "deadline";

/** Der erste Tag eines Eintrags. */
export function itemStartDay(item: PlanItem): DayNumber {
  return parseIsoDate(item.kind === "bar" ? item.start : item.date) as DayNumber;
}

/** Der letzte Tag eines Eintrags, einschließlich; bei Meilenstein und Stichtag derselbe. */
export function itemEndDay(item: PlanItem): DayNumber {
  return parseIsoDate(item.kind === "bar" ? item.end : item.date) as DayNumber;
}

/** Die Spanne aller Einträge, erster bis letzter Tag; `null` ohne Einträge. */
export function planExtent(items: readonly PlanItem[]): { start: DayNumber; end: DayNumber } | null {
  if (items.length === 0) return null;
  let start = Infinity;
  let end = -Infinity;
  for (const item of items) {
    start = Math.min(start, itemStartDay(item));
    end = Math.max(end, itemEndDay(item));
  }
  return { start, end };
}

/** Die Kategorie eines Eintrags, oder `undefined`, wenn er keine hat. */
export function categoryOf(plan: Plan, item: PlanItem): Category | undefined {
  return item.category === undefined ? undefined : plan.categories.find((c) => c.id === item.category);
}

export function colorOf(plan: Plan, item: PlanItem): string {
  return categoryOf(plan, item)?.color ?? UNCATEGORIZED_COLOR;
}

/** Heute als `JJJJ-MM-TT`, für `updatedAt`. */
export function todayIso(now: Date = new Date()): string {
  return formatIsoDate(todayDay(now));
}

// ---------------------------------------------------------------------------
// Lesen

const KNOWN_PLAN_KEYS = new Set(["version", "title", "updatedAt", "view", "lanes", "categories", "items"]);
const KNOWN_LANE_KEYS = new Set(["id", "title"]);
const KNOWN_CATEGORY_KEYS = new Set(["id", "title", "color", "symbol"]);
const KNOWN_ITEM_KEYS = new Set([
  "id",
  "kind",
  "title",
  "description",
  "category",
  "tentative",
  "dependsOn",
  "lane",
  "date",
  "start",
  "end",
  "symbol",
  "arrow",
  "series",
]);

const HEX_COLOR = /^#[0-9a-f]{6}$/i;

type Raw = Record<string, unknown>;

const isRecord = (value: unknown): value is Raw =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const asText = (value: unknown): string | undefined =>
  typeof value === "string" && value.trim() !== "" ? value : undefined;

const asDate = (value: unknown): string | undefined =>
  typeof value === "string" && parseIsoDate(value) !== null ? value.trim() : undefined;

function unknownOf(raw: Raw, known: Set<string>): Unknown | undefined {
  const rest = Object.fromEntries(Object.entries(raw).filter(([key]) => !known.has(key)));
  return Object.keys(rest).length > 0 ? rest : undefined;
}

/** Der Rohtext eines Attributs, kodiert oder nicht. */
function readRaw(raw: string): unknown {
  if (raw.trim() === "") return null;
  const json = isPayload(raw) ? decodePayload(raw) : raw;
  if (json === null) return null;
  try {
    return JSON.parse(json) as unknown;
  } catch {
    // Ein kaputtes Attribut ist kein Grund, die Seite scheitern zu lassen:
    // die Leseansicht zeigt dann nichts, der Editor beginnt leer.
    return null;
  }
}

/**
 * Liest eine Liste von Objekten mit eindeutiger `id`. Eine doppelte `id`
 * verwirft den späteren Eintrag: sonst zeigten Verweise auf zwei Ziele.
 */
function readList<T extends { id: string }>(
  value: unknown,
  read: (raw: Raw) => T | null,
  limit: number,
): { list: T[]; dropped: number } {
  if (!Array.isArray(value)) return { list: [], dropped: 0 };
  const list: T[] = [];
  const seen = new Set<string>();
  for (const entry of value) {
    const item = isRecord(entry) ? read(entry) : null;
    if (item === null || seen.has(item.id) || list.length >= limit) continue;
    seen.add(item.id);
    list.push(item);
  }
  return { list, dropped: value.length - list.length };
}

function readLane(raw: Raw): Lane | null {
  const id = asText(raw.id);
  const title = asText(raw.title);
  if (id === undefined || title === undefined) return null;
  const lane: Lane = { id, title };
  const unknown = unknownOf(raw, KNOWN_LANE_KEYS);
  if (unknown !== undefined) lane.unknown = unknown;
  return lane;
}

function readCategory(raw: Raw): Category | null {
  const id = asText(raw.id);
  const title = asText(raw.title);
  if (id === undefined || title === undefined) return null;
  const color = typeof raw.color === "string" && HEX_COLOR.test(raw.color) ? raw.color.toUpperCase() : UNCATEGORIZED_COLOR;
  const category: Category = { id, title, color };
  if (MILESTONE_SYMBOLS.includes(raw.symbol as MilestoneSymbol)) category.symbol = raw.symbol as MilestoneSymbol;
  const unknown = unknownOf(raw, KNOWN_CATEGORY_KEYS);
  if (unknown !== undefined) category.unknown = unknown;
  return category;
}

/** Liest einen Eintrag ohne die Verweise; die prüft {@link resolveReferences}. */
function readItem(raw: Raw): PlanItem | null {
  const id = asText(raw.id);
  const title = asText(raw.title);
  if (id === undefined || title === undefined) return null;

  const base: ItemBase = { id, title };
  const description = asText(raw.description);
  if (description !== undefined) base.description = description;
  const category = asText(raw.category);
  if (category !== undefined) base.category = category;
  if (raw.tentative === true) base.tentative = true;
  if (Array.isArray(raw.dependsOn)) {
    const ids = raw.dependsOn.filter((entry): entry is string => asText(entry) !== undefined);
    if (ids.length > 0) base.dependsOn = [...new Set(ids)];
  }
  const unknown = unknownOf(raw, KNOWN_ITEM_KEYS);
  if (unknown !== undefined) base.unknown = unknown;

  const series = asText(raw.series)?.trim();

  switch (raw.kind) {
    case "milestone": {
      const lane = asText(raw.lane);
      const date = asDate(raw.date);
      if (lane === undefined || date === undefined) return null;
      const item: MilestoneItem = { ...base, kind: "milestone", lane, date };
      if (MILESTONE_SYMBOLS.includes(raw.symbol as MilestoneSymbol)) item.symbol = raw.symbol as MilestoneSymbol;
      if (series) item.series = series;
      return item;
    }
    case "bar": {
      const lane = asText(raw.lane);
      const first = asDate(raw.start);
      const second = asDate(raw.end);
      if (lane === undefined || first === undefined || second === undefined) return null;
      // Ein vertauschter Zeitraum ist ein Versehen, kein Grund zum Verwerfen.
      const [start, end] =
        (parseIsoDate(first) as number) <= (parseIsoDate(second) as number) ? [first, second] : [second, first];
      const item: BarItem = { ...base, kind: "bar", lane, start, end };
      if (raw.arrow === true) item.arrow = true;
      if (series) item.series = series;
      return item;
    }
    case "deadline": {
      const date = asDate(raw.date);
      if (date === undefined) return null;
      return { ...base, kind: "deadline", date };
    }
    default:
      return null;
  }
}

/**
 * Prüft die Verweise zwischen den Teilen.
 *
 * Eine unbekannte Ebene verwirft den Eintrag: stillschweigend in eine andere
 * verschoben stünde er an falscher Stelle, und niemand merkte es. Eine
 * unbekannte Kategorie dagegen macht ihn nur grau. Vorgänger, die es nicht
 * gibt, die auf sich selbst zeigen oder Stichtage sind, werden gestrichen.
 */
function resolveReferences(items: PlanItem[], lanes: Lane[], categories: Category[]): PlanItem[] {
  const laneIds = new Set(lanes.map((lane) => lane.id));
  const categoryIds = new Set(categories.map((category) => category.id));
  const kept = items.filter((item) => item.kind === "deadline" || laneIds.has(item.lane));
  const linkable = new Set(kept.filter(isLaneItem).map((item) => item.id));

  return kept.map((item) => {
    const next: PlanItem = { ...item };
    if (next.category !== undefined && !categoryIds.has(next.category)) delete next.category;
    if (next.dependsOn !== undefined) {
      const valid = next.kind === "deadline" ? [] : next.dependsOn.filter((id) => id !== next.id && linkable.has(id));
      if (valid.length > 0) next.dependsOn = valid;
      else delete next.dependsOn;
    }
    return next;
  });
}

function readView(value: unknown): PlanView | undefined {
  if (!isRecord(value)) return undefined;
  const start = typeof value.start === "string" ? parseIsoMonth(value.start) : null;
  const end = typeof value.end === "string" ? parseIsoMonth(value.end) : null;
  if (start === null || end === null) return undefined;
  const startKey = start.year * 12 + start.month;
  const endKey = end.year * 12 + end.month;
  const [first, second] = startKey <= endKey ? [value.start as string, value.end as string] : [value.end as string, value.start as string];
  return { start: first.trim(), end: second.trim() };
}

/**
 * Gibt jeder Kategorie ohne eigene Form die häufigste Form ihrer Meilensteine
 * — so sehen Pläne, die ihre Formen noch am Meilenstein trugen, nach dem
 * Umstieg gleich aus. Bei Gleichstand gewinnt die zuerst genannte.
 */
function inheritSymbols(categories: Category[], items: PlanItem[]): Category[] {
  return categories.map((category) => {
    if (category.symbol !== undefined) return category;
    const counts = new Map<MilestoneSymbol, number>();
    for (const item of items) {
      if (item.kind === "milestone" && item.category === category.id && item.symbol !== undefined) {
        counts.set(item.symbol, (counts.get(item.symbol) ?? 0) + 1);
      }
    }
    let best: MilestoneSymbol | undefined;
    for (const [symbol, count] of counts) {
      if (best === undefined || count > (counts.get(best) ?? 0)) best = symbol;
    }
    return best === undefined ? category : { ...category, symbol: best };
  });
}

/** Liest das Attribut `plan`. Scheitert nie; was unbrauchbar ist, fällt weg und wird gezählt. */
export function readPlanAttribute(raw: string): PlanReadResult {
  const value = readRaw(raw);
  if (!isRecord(value)) return { plan: emptyPlan(), dropped: 0 };

  const lanes = readList(value.lanes, readLane, LIMITS.lanes);
  const categories = readList(value.categories, readCategory, LIMITS.categories);
  const items = readList(value.items, readItem, LIMITS.items);
  const resolved = resolveReferences(items.list, lanes.list, categories.list);

  const plan: Plan = {
    version: 1,
    lanes: lanes.list,
    categories: inheritSymbols(categories.list, resolved),
    items: resolved,
  };
  const title = asText(value.title)?.trim();
  if (title) plan.title = title;
  const updatedAt = asDate(value.updatedAt);
  if (updatedAt !== undefined) plan.updatedAt = updatedAt;
  const view = readView(value.view);
  if (view !== undefined) plan.view = view;
  const unknown = unknownOf(value, KNOWN_PLAN_KEYS);
  if (unknown !== undefined) plan.unknown = unknown;

  return { plan, dropped: items.dropped + (items.list.length - resolved.length) };
}

/** Nur der Plan, für die Leseansicht. */
export function parsePlan(raw: string): Plan {
  return readPlanAttribute(raw).plan;
}

// ---------------------------------------------------------------------------
// Schreiben

const flatten = <T extends { unknown?: Unknown }>({ unknown, ...rest }: T): Raw => ({ ...unknown, ...rest });

/** Schreibt das Attribut `plan`; die `unknown`-Beutel werden wieder flach eingemischt. */
export function encodePlanAttribute(plan: Plan): string {
  const { unknown, lanes, categories, items, ...rest } = plan;
  const plain = {
    ...unknown,
    ...rest,
    lanes: lanes.map(flatten),
    categories: categories.map(flatten),
    items: items.map(flatten),
  };
  return encodePayload(JSON.stringify(plain));
}
