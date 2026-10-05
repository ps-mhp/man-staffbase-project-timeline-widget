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
 * Was der Editor am Gerüst des Plans ändern kann: Ebenen, Kategorien,
 * Startansicht und der Beginn eines leeren Plans. Dieselben Regeln wie in
 * `plan-edits.ts`: rein, unveränderlich, das Modell bleibt gültig, und jede
 * Änderung setzt `updatedAt`.
 */

import { Viewport, formatIsoMonth, monthOfDay } from "../calendar";
import {
  Category,
  LIMITS,
  MILESTONE_SYMBOLS,
  MilestoneSymbol,
  Plan,
  PlanItem,
  PlanView,
  isLaneItem,
  newId,
} from "../plan-model";
import type { PlanTemplate } from "../plan-templates";
import { nameKey } from "./entity-names";
import {
  Created,
  stripReferences,
  touch,
  without,
  withOptional,
} from "./plan-edits";

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
  // Das neutrale Grau ist das von „Ohne Kategorie“ (Craft `text-soft`).
  "#5B6F85",
  "#C10039",
  "#2D6A9F",
  "#8A6D00",
  "#4D6300",
];

const HEX_COLOR = /^#[0-9A-F]{6}$/i;

// ---------------------------------------------------------------------------
// Ebenen und Kategorien

function moveEntry<T extends { id: string }>(
  list: readonly T[],
  id: string,
  offset: -1 | 1,
): T[] | null {
  const index = list.findIndex((entry) => entry.id === id);
  const target = index + offset;
  if (index === -1 || target < 0 || target >= list.length) return null;
  const next = [...list];
  next[index] = list[target];
  next[target] = list[index];
  return next;
}

/**
 * Ein Name, den es noch nicht gibt: „Neue Ebene“, sonst „Neue Ebene 2“ usw.
 * Zwei gleichnamige Ebenen wären in Auswahlfeldern und Legende nicht zu
 * unterscheiden.
 */
export function uniqueTitle(base: string, existing: readonly string[]): string {
  const taken = new Set(existing.map(nameKey));
  if (!taken.has(nameKey(base))) return base;
  let number = 2;
  while (taken.has(nameKey(`${base} ${number}`))) number += 1;
  return `${base} ${number}`;
}

/** Legt eine Ebene mit diesem Namen hinten an; ein leerer Name legt nichts an. */
export function createLane(
  plan: Plan,
  title: string,
  now: Date = new Date(),
): Created {
  if (plan.lanes.length >= LIMITS.lanes || title.trim() === "")
    return { plan, id: null };
  const lane = { id: newId("lane"), title: title.trim() };
  return {
    plan: touch({ ...plan, lanes: [...plan.lanes, lane] }, now),
    id: lane.id,
  };
}

export function addLane(plan: Plan, now: Date = new Date()): Created {
  const title = uniqueTitle(
    NEW_LANE_TITLE,
    plan.lanes.map((lane) => lane.title),
  );
  return createLane(plan, title, now);
}

/** Ein leerer Name bleibt draußen: das Lesen verwürfe die Ebene und mit ihr alle ihre Einträge. */
export function renameLane(
  plan: Plan,
  id: string,
  title: string,
  now: Date = new Date(),
): Plan {
  if (title.trim() === "") return plan;
  return touch(
    {
      ...plan,
      lanes: plan.lanes.map((lane) =>
        lane.id === id ? { ...lane, title } : lane,
      ),
    },
    now,
  );
}

export function moveLane(
  plan: Plan,
  id: string,
  offset: -1 | 1,
  now: Date = new Date(),
): Plan {
  const lanes = moveEntry(plan.lanes, id, offset);
  return lanes === null ? plan : touch({ ...plan, lanes }, now);
}

/**
 * Löscht eine Ebene. Mit `target` wandern ihre Einträge dorthin; ohne werden
 * sie mitgelöscht, und mit ihnen alle Verweise auf sie.
 */
export function removeLane(
  plan: Plan,
  id: string,
  target: string | null,
  now: Date = new Date(),
): Plan {
  const lanes = plan.lanes.filter((lane) => lane.id !== id);
  const inLane = (item: PlanItem): boolean =>
    isLaneItem(item) && item.lane === id;
  if (target !== null && lanes.some((lane) => lane.id === target)) {
    const items = plan.items.map((item) =>
      inLane(item) ? { ...item, lane: target } : item,
    );
    return touch({ ...plan, lanes, items }, now);
  }
  const removed = new Set(plan.items.filter(inLane).map((item) => item.id));
  const items = stripReferences(
    plan.items.filter((item) => !removed.has(item.id)),
    removed,
  );
  return touch({ ...plan, lanes, items }, now);
}

/** Die erste Farbe der Palette, die noch keine Kategorie trägt. */
export function nextFreeColor(plan: Plan): string {
  const used = new Set(
    plan.categories.map((category) => category.color.toUpperCase()),
  );
  return (
    CATEGORY_PALETTE.find((entry) => !used.has(entry)) ??
    CATEGORY_PALETTE[plan.categories.length % CATEGORY_PALETTE.length]
  );
}

/**
 * Die erste Form, die noch keine Kategorie trägt, sonst die Raute. Wie bei
 * der Farbe: zwei Kategorien sollen sich auf den ersten Blick unterscheiden.
 */
export function nextFreeSymbol(plan: Plan): MilestoneSymbol {
  const used = new Set(plan.categories.map((category) => category.symbol));
  return MILESTONE_SYMBOLS.find((symbol) => !used.has(symbol)) ?? "diamond";
}

export interface NewCategory {
  title: string;
  color: string;
  /** Die Form ihrer Meilensteine. */
  symbol: MilestoneSymbol;
}

/** Legt eine Kategorie mit Name, Farbe und Form hinten an; Ungültiges legt nichts an. */
export function createCategory(
  plan: Plan,
  { title, color, symbol }: NewCategory,
  now: Date = new Date(),
): Created {
  if (
    plan.categories.length >= LIMITS.categories ||
    title.trim() === "" ||
    !HEX_COLOR.test(color) ||
    !MILESTONE_SYMBOLS.includes(symbol)
  )
    return { plan, id: null };
  const category: Category = {
    id: newId("cat"),
    title: title.trim(),
    color: color.toUpperCase(),
    symbol,
  };
  return {
    plan: touch({ ...plan, categories: [...plan.categories, category] }, now),
    id: category.id,
  };
}

/** Eine neue Kategorie bekommt die erste Farbe und Form, die noch keine andere trägt. */
export function addCategory(plan: Plan, now: Date = new Date()): Created {
  const title = uniqueTitle(
    NEW_CATEGORY_TITLE,
    plan.categories.map((category) => category.title),
  );
  return createCategory(
    plan,
    { title, color: nextFreeColor(plan), symbol: nextFreeSymbol(plan) },
    now,
  );
}

/** Setzt die Form der Meilensteine einer Kategorie; eine unbekannte ändert nichts. */
export function setCategorySymbol(
  plan: Plan,
  id: string,
  symbol: MilestoneSymbol,
  now: Date = new Date(),
): Plan {
  if (!MILESTONE_SYMBOLS.includes(symbol)) return plan;
  const categories = plan.categories.map((category) =>
    category.id === id ? { ...category, symbol } : category,
  );
  return touch({ ...plan, categories }, now);
}

/** Ändert Name oder Farbe; ein leerer Name oder eine ungültige Farbe ändern nichts. */
export function updateCategory(
  plan: Plan,
  id: string,
  changes: Partial<Pick<Category, "title" | "color">>,
  now: Date = new Date(),
): Plan {
  if (changes.title !== undefined && changes.title.trim() === "") return plan;
  if (changes.color !== undefined && !HEX_COLOR.test(changes.color))
    return plan;
  const normalized =
    changes.color === undefined
      ? changes
      : { ...changes, color: changes.color.toUpperCase() };
  const categories = plan.categories.map((category) =>
    category.id === id ? { ...category, ...normalized } : category,
  );
  return touch({ ...plan, categories }, now);
}

export function moveCategory(
  plan: Plan,
  id: string,
  offset: -1 | 1,
  now: Date = new Date(),
): Plan {
  const categories = moveEntry(plan.categories, id, offset);
  return categories === null ? plan : touch({ ...plan, categories }, now);
}

/** Löscht eine Kategorie; ihre Einträge stehen danach „ohne Kategorie“ da. */
export function removeCategory(
  plan: Plan,
  id: string,
  now: Date = new Date(),
): Plan {
  const categories = plan.categories.filter((category) => category.id !== id);
  const items = plan.items.map((item) =>
    item.category === id ? without(item, "category") : item,
  ) as PlanItem[];
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
  return {
    start: formatIsoMonth(monthOfDay(first)),
    end: formatIsoMonth(monthOfDay(last)),
  };
}

export function setStartView(
  plan: Plan,
  viewport: Viewport,
  now: Date = new Date(),
): Plan {
  return touch({ ...plan, view: viewFromViewport(viewport) }, now);
}

export function clearStartView(plan: Plan, now: Date = new Date()): Plan {
  return touch(without(plan, "view"), now);
}

/**
 * Ersetzt einen leeren Plan durch eine Vorlage. Was die Redaktion schon
 * eingegeben hat — die Überschrift — und Unbekanntes aus späteren Versionen
 * bleiben.
 */
export function startWithTemplate(
  plan: Plan,
  template: PlanTemplate,
  now: Date = new Date(),
): Plan {
  const example = template.create();
  const withTitle = withOptional(example, "title", plan.title ?? example.title);
  return touch(withOptional(withTitle, "unknown", plan.unknown), now);
}

/** Beginnt leer, aber mit einer Ebene — ohne sie ließe sich kein Meilenstein anlegen. */
export function startEmpty(plan: Plan, now: Date = new Date()): Plan {
  return touch(
    { ...plan, lanes: [{ id: newId("lane"), title: FIRST_LANE_TITLE }] },
    now,
  );
}
