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
 * Was der Editor am Plan ändern kann — als reine Funktionen.
 *
 * Jede nimmt einen Plan und gibt einen neuen zurück; das Original bleibt
 * unberührt. Der Dialog vergleicht Entwurf und gespeicherten Stand und muss
 * sich darauf verlassen können, dass eine Änderung nie den gespeicherten
 * Stand mitverändert.
 *
 * Jede Änderung hält das Modell gültig: was hier herauskommt, liest
 * `readPlanAttribute` ohne Verlust zurück. Was das nicht erfüllte — ein
 * leerer Titel, eine Ebene ohne Namen —, lassen die Funktionen gar nicht erst
 * durch und geben den Plan unverändert zurück. Es gibt also keinen
 * Zwischenzustand, den das Speichern stillschweigend verwerfen müsste.
 *
 * `now` ist nur für Tests da: jede Änderung setzt `updatedAt` auf heute.
 */

import { Viewport, dayFromParts, formatIsoDate, formatIsoMonth, lastDayOfMonth, monthOfDay, parseIsoDate, partsFromDay } from "../calendar";
import { examplePlan } from "../example-plan";
import {
  BarItem,
  Category,
  DeadlineItem,
  ItemKind,
  LIMITS,
  MilestoneItem,
  Plan,
  PlanItem,
  PlanView,
  isLaneItem,
  newId,
  todayIso,
} from "../plan-model";

export const NEW_ITEM_TITLES: Readonly<Record<ItemKind, string>> = {
  milestone: "Neuer Meilenstein",
  bar: "Neuer Zeitraum",
  deadline: "Neuer Stichtag",
};

export const NEW_LANE_TITLE = "Neue Ebene";
export const FIRST_LANE_TITLE = "Ebene 1";
export const NEW_CATEGORY_TITLE = "Neue Kategorie";

/** MAN-Farben plus die Töne der Vorlage; die ersten sieben sind die des Beispielplans. */
export const CATEGORY_PALETTE: readonly string[] = [
  "#E40045",
  "#303C49",
  "#7B2FA0",
  "#F5B800",
  "#4B96D2",
  "#00786E",
  "#91B900",
  "#71787F",
  "#C10039",
  "#2D6A9F",
  "#8A6D00",
  "#4D6300",
];

const HEX_COLOR = /^#[0-9A-F]{6}$/i;

/** Ergebnis einer Änderung, die etwas anlegt: `id` ist `null`, wenn nichts angelegt wurde. */
export interface Created {
  plan: Plan;
  id: string | null;
}

/** Die gemeinsamen Felder aller Arten — was beim Wechsel der Art erhalten bleibt. */
type ItemCommon = Omit<DeadlineItem, "kind" | "date">;

const KIND_FIELDS = new Set(["kind", "lane", "date", "start", "end", "symbol", "arrow", "series"]);

function without<T extends object, K extends keyof T>(value: T, ...keys: K[]): Omit<T, K> {
  const drop = new Set<PropertyKey>(keys);
  return Object.fromEntries(Object.entries(value).filter(([key]) => !drop.has(key))) as Omit<T, K>;
}

/**
 * Setzt ein optionales Feld oder lässt es ganz weg. Ein leeres Feld ist im
 * Attribut kein leerer Wert, sondern gar keiner — das Lesen verwürfe ihn
 * ohnehin, und das Attribut bliebe kleiner.
 */
export function withOptional<T extends object, K extends keyof T>(item: T, key: K, value: T[K] | undefined): T {
  return value === undefined ? (without(item, key) as T) : { ...item, [key]: value };
}

/** Stempelt das Stand-Datum; das Widget zeigt es als „Stand: …“. */
export function touch(plan: Plan, now: Date = new Date()): Plan {
  return { ...plan, updatedAt: todayIso(now) };
}

/**
 * Setzt die Überschrift über dem Plan. Ohne Leerraum am Rand, weil das Lesen
 * ihn ohnehin abschneidet; leer fällt sie ganz weg — dann steht keine da.
 */
export function setTitle(plan: Plan, title: string, now: Date = new Date()): Plan {
  const trimmed = title.trim();
  return touch(withOptional(plan, "title", trimmed === "" ? undefined : trimmed), now);
}

/**
 * Das Ende eines neuen Zeitraums: einen Monat nach dem Beginn, einschließlich
 * gezählt, also ein Monat später minus ein Tag. Gibt es den Tag im Folgemonat
 * nicht (31. Januar), endet er am Monatsletzten — sonst liefe er über
 * `Date.UTC` bis in den März.
 */
export function defaultBarEnd(start: string): string {
  const { year, month, day } = partsFromDay(parseIsoDate(start) as number);
  const sameDayNextMonth = dayFromParts(year, month + 1, day);
  const nextMonth = monthOfDay(dayFromParts(year, month + 1, 1));
  return formatIsoDate(Math.min(sameDayNextMonth - 1, lastDayOfMonth(nextMonth)));
}

/** Das Datum eines neuen Eintrags: die Mitte der Vorschau, damit er gleich zu sehen ist. */
export function newItemDate(viewport: Viewport | null, now: Date = new Date()): string {
  return viewport === null ? todayIso(now) : formatIsoDate(Math.floor((viewport.start + viewport.end) / 2));
}

// ---------------------------------------------------------------------------
// Einträge

/** Streicht die genannten Einträge aus allen Vorgängerlisten; eine leere Liste fällt weg. */
function stripReferences(items: PlanItem[], removed: ReadonlySet<string>): PlanItem[] {
  return items.map((item) => {
    if (item.dependsOn === undefined || !item.dependsOn.some((id) => removed.has(id))) return item;
    const kept = item.dependsOn.filter((id) => !removed.has(id));
    return withOptional(item, "dependsOn", kept.length > 0 ? kept : undefined);
  });
}

function createItem(kind: ItemKind, lane: string | undefined, date: string): PlanItem | null {
  const id = newId("item");
  const title = NEW_ITEM_TITLES[kind];
  if (kind === "deadline") return { id, kind, title, date };
  if (lane === undefined) return null;
  if (kind === "milestone") return { id, kind, lane, title, date };
  return { id, kind, lane, title, start: date, end: defaultBarEnd(date) };
}

/** Legt einen gültigen Eintrag an: Titel nach Art, in der ersten Ebene. */
export function addItem(plan: Plan, kind: ItemKind, date: string, now: Date = new Date()): Created {
  if (plan.items.length >= LIMITS.items) return { plan, id: null };
  const item = createItem(kind, plan.lanes[0]?.id, date);
  if (item === null) return { plan, id: null };
  return { plan: touch({ ...plan, items: [...plan.items, item] }, now), id: item.id };
}

export function updateItem(plan: Plan, item: PlanItem, now: Date = new Date()): Plan {
  return touch({ ...plan, items: plan.items.map((entry) => (entry.id === item.id ? item : entry)) }, now);
}

/** Kopiert einen Eintrag gleich hinter das Original — dort sucht die Redaktion ihn. */
export function duplicateItem(plan: Plan, id: string, now: Date = new Date()): Created {
  const index = plan.items.findIndex((item) => item.id === id);
  if (index === -1 || plan.items.length >= LIMITS.items) return { plan, id: null };
  const original = plan.items[index];
  const copy: PlanItem = { ...original, id: newId("item"), title: `${original.title} (Kopie)` };
  const items = [...plan.items.slice(0, index + 1), copy, ...plan.items.slice(index + 1)];
  return { plan: touch({ ...plan, items }, now), id: copy.id };
}

/** Löscht einen Eintrag samt allen Verweisen darauf; sonst zeigten Linien ins Leere. */
export function removeItem(plan: Plan, id: string, now: Date = new Date()): Plan {
  const items = plan.items.filter((item) => item.id !== id);
  return touch({ ...plan, items: stripReferences(items, new Set([id])) }, now);
}

function convert(item: PlanItem, kind: ItemKind, firstLane: string | undefined): PlanItem | null {
  const common = Object.fromEntries(Object.entries(item).filter(([key]) => !KIND_FIELDS.has(key))) as ItemCommon;
  const date = item.kind === "bar" ? item.start : item.date;
  if (kind === "deadline") {
    // Ein Stichtag hat keine Vorgänger: er läuft durch alle Ebenen und ist
    // mit keinem Eintrag verbunden.
    return { ...without(common, "dependsOn"), kind, date };
  }
  const lane = isLaneItem(item) ? item.lane : firstLane;
  if (lane === undefined) return null;
  const series = isLaneItem(item) ? item.series : undefined;
  const next: MilestoneItem | BarItem =
    kind === "milestone"
      ? { ...common, kind, lane, date }
      : { ...common, kind, lane, start: date, end: item.kind === "bar" ? item.end : defaultBarEnd(date) };
  return withOptional(next, "series", series);
}

/**
 * Wechselt die Art eines Eintrags und nimmt mit, was die neue Art kennt.
 *
 * Aus einem Meilenstein wird ein Zeitraum von einem Monat, aus einem Zeitraum
 * ein Meilenstein an seinem Beginn. Ein Stichtag verliert Ebene, Serie und
 * Vorgänger und verschwindet aus fremden Vorgängerlisten; umgekehrt landet er
 * in der ersten Ebene. Ohne Ebene bleibt ein Stichtag, was er ist.
 */
export function changeKind(plan: Plan, id: string, kind: ItemKind, now: Date = new Date()): Plan {
  const item = plan.items.find((entry) => entry.id === id);
  if (item === undefined || item.kind === kind) return plan;
  const converted = convert(item, kind, plan.lanes[0]?.id);
  if (converted === null) return plan;
  const items = plan.items.map((entry) => (entry.id === id ? converted : entry));
  return touch({ ...plan, items: kind === "deadline" ? stripReferences(items, new Set([id])) : items }, now);
}

// ---------------------------------------------------------------------------
// Ebenen und Kategorien

function moveEntry<T extends { id: string }>(list: readonly T[], id: string, offset: -1 | 1): T[] | null {
  const index = list.findIndex((entry) => entry.id === id);
  const target = index + offset;
  if (index === -1 || target < 0 || target >= list.length) return null;
  const next = [...list];
  next[index] = list[target];
  next[target] = list[index];
  return next;
}

export function addLane(plan: Plan, now: Date = new Date()): Created {
  if (plan.lanes.length >= LIMITS.lanes) return { plan, id: null };
  const lane = { id: newId("lane"), title: NEW_LANE_TITLE };
  return { plan: touch({ ...plan, lanes: [...plan.lanes, lane] }, now), id: lane.id };
}

/** Ein leerer Name bleibt draußen: das Lesen verwürfe die Ebene und mit ihr alle ihre Einträge. */
export function renameLane(plan: Plan, id: string, title: string, now: Date = new Date()): Plan {
  if (title.trim() === "") return plan;
  return touch({ ...plan, lanes: plan.lanes.map((lane) => (lane.id === id ? { ...lane, title } : lane)) }, now);
}

export function moveLane(plan: Plan, id: string, offset: -1 | 1, now: Date = new Date()): Plan {
  const lanes = moveEntry(plan.lanes, id, offset);
  return lanes === null ? plan : touch({ ...plan, lanes }, now);
}

/**
 * Löscht eine Ebene. Mit `target` wandern ihre Einträge dorthin; ohne werden
 * sie mitgelöscht, und mit ihnen alle Verweise auf sie.
 */
export function removeLane(plan: Plan, id: string, target: string | null, now: Date = new Date()): Plan {
  const lanes = plan.lanes.filter((lane) => lane.id !== id);
  const inLane = (item: PlanItem): boolean => isLaneItem(item) && item.lane === id;
  if (target !== null && lanes.some((lane) => lane.id === target)) {
    const items = plan.items.map((item) => (inLane(item) ? { ...item, lane: target } : item));
    return touch({ ...plan, lanes, items }, now);
  }
  const removed = new Set(plan.items.filter(inLane).map((item) => item.id));
  const items = stripReferences(
    plan.items.filter((item) => !removed.has(item.id)),
    removed,
  );
  return touch({ ...plan, lanes, items }, now);
}

/** Eine neue Kategorie bekommt die erste Farbe, die noch keine andere trägt. */
export function addCategory(plan: Plan, now: Date = new Date()): Created {
  if (plan.categories.length >= LIMITS.categories) return { plan, id: null };
  const used = new Set(plan.categories.map((category) => category.color.toUpperCase()));
  const color =
    CATEGORY_PALETTE.find((entry) => !used.has(entry)) ??
    CATEGORY_PALETTE[plan.categories.length % CATEGORY_PALETTE.length];
  const category: Category = { id: newId("cat"), title: NEW_CATEGORY_TITLE, color };
  return { plan: touch({ ...plan, categories: [...plan.categories, category] }, now), id: category.id };
}

/** Ändert Name oder Farbe; ein leerer Name oder eine ungültige Farbe ändern nichts. */
export function updateCategory(
  plan: Plan,
  id: string,
  changes: Partial<Pick<Category, "title" | "color">>,
  now: Date = new Date(),
): Plan {
  if (changes.title !== undefined && changes.title.trim() === "") return plan;
  if (changes.color !== undefined && !HEX_COLOR.test(changes.color)) return plan;
  const normalized = changes.color === undefined ? changes : { ...changes, color: changes.color.toUpperCase() };
  const categories = plan.categories.map((category) => (category.id === id ? { ...category, ...normalized } : category));
  return touch({ ...plan, categories }, now);
}

export function moveCategory(plan: Plan, id: string, offset: -1 | 1, now: Date = new Date()): Plan {
  const categories = moveEntry(plan.categories, id, offset);
  return categories === null ? plan : touch({ ...plan, categories }, now);
}

/** Löscht eine Kategorie; ihre Einträge stehen danach „ohne Kategorie“ da. */
export function removeCategory(plan: Plan, id: string, now: Date = new Date()): Plan {
  const categories = plan.categories.filter((category) => category.id !== id);
  const items = plan.items.map((item) => (item.category === id ? without(item, "category") : item)) as PlanItem[];
  return touch({ ...plan, categories, items }, now);
}

// ---------------------------------------------------------------------------
// Startansicht und Beginn

/**
 * Die Monate eines Ausschnitts. Das Ende ist ausschließlich: ein Bruchteil des
 * Folgemonats am rechten Rand zählt nicht, sonst hängte schon Rundungsrauschen
 * an einer Monatsgrenze einen ganzen Monat an.
 */
export function viewFromViewport(viewport: Viewport): PlanView {
  const first = Math.floor(viewport.start);
  const last = Math.max(first, Math.floor(viewport.end - 1));
  return { start: formatIsoMonth(monthOfDay(first)), end: formatIsoMonth(monthOfDay(last)) };
}

export function setStartView(plan: Plan, viewport: Viewport, now: Date = new Date()): Plan {
  return touch({ ...plan, view: viewFromViewport(viewport) }, now);
}

export function clearStartView(plan: Plan, now: Date = new Date()): Plan {
  return touch(without(plan, "view"), now);
}

/**
 * Ersetzt einen leeren Plan durch den Beispielplan. Was die Redaktion schon
 * eingegeben hat — die Überschrift — und Unbekanntes aus späteren Versionen
 * bleiben.
 */
export function startWithExample(plan: Plan, now: Date = new Date()): Plan {
  const example = examplePlan();
  const withTitle = withOptional(example, "title", plan.title ?? example.title);
  return touch(withOptional(withTitle, "unknown", plan.unknown), now);
}

/** Beginnt leer, aber mit einer Ebene — ohne sie ließe sich kein Meilenstein anlegen. */
export function startEmpty(plan: Plan, now: Date = new Date()): Plan {
  return touch({ ...plan, lanes: [{ id: newId("lane"), title: FIRST_LANE_TITLE }] }, now);
}
