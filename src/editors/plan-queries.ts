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
 * Was der Editor über den Plan wissen will, ohne ihn zu ändern: Reihenfolge,
 * Suche, Vorschläge, Zahlen und Beschriftungen.
 *
 * Getrennt von `plan-edits.ts`, damit dort nur steht, was den Plan verändert.
 */

import { shortTermText } from "../item-text";
import { matchesQuery } from "../plan-filter";
import { LaneItem, Plan, PlanItem, isLaneItem, itemEndDay, itemStartDay } from "../plan-model";
import { ALL_LANES_LABEL } from "../plan-rows";

// Dieselben Wörter wie auf der Seite und im Export — aus einer Quelle, damit
// Editor, Liste und Excel nie verschieden heißen.
export { ALL_LANES_LABEL, KIND_LABELS } from "../plan-rows";

/**
 * Die Sprache des Editors. Seine Bedienelemente sprechen Deutsch wie in allen
 * Widgets dieses Repos; die Termine folgen dem.
 */
export const EDITOR_LOCALE = "de-DE";

const collator = new Intl.Collator("de", { sensitivity: "base", numeric: true });

/** Nach Beginn, dann Ende, dann Titel — dieselbe Reihenfolge wie auf der Zeitachse. */
export function itemsByDate(items: readonly PlanItem[]): PlanItem[] {
  return [...items].sort(
    (a, b) =>
      itemStartDay(a) - itemStartDay(b) || itemEndDay(a) - itemEndDay(b) || collator.compare(a.title, b.title),
  );
}

/** Durchsucht Titel, Beschreibung, Serie, Ebene und Kategorie wie die Suche auf der Seite. */
export function matchesSearch(plan: Plan, item: PlanItem, query: string): boolean {
  return matchesQuery(plan, item, query);
}

/** Die Serien einer Ebene, je einmal — eine Serie gilt nur innerhalb ihrer Ebene. */
export function seriesInLane(plan: Plan, laneId: string): string[] {
  const names = plan.items
    .filter((item): item is LaneItem => isLaneItem(item) && item.lane === laneId)
    .map((item) => item.series)
    .filter((series): series is string => series !== undefined);
  return [...new Set(names)].sort(collator.compare);
}

/** Mögliche Vorgänger: alle anderen Meilensteine und Zeiträume. Stichtage sind nie Vorgänger. */
export function dependencyCandidates(plan: Plan, itemId: string): LaneItem[] {
  return itemsByDate(plan.items.filter((item) => isLaneItem(item) && item.id !== itemId)) as LaneItem[];
}

export function countInLane(plan: Plan, laneId: string): number {
  return plan.items.filter((item) => isLaneItem(item) && item.lane === laneId).length;
}

export function countInCategory(plan: Plan, categoryId: string): number {
  return plan.items.filter((item) => item.category === categoryId).length;
}

export function countLabel(count: number): string {
  return count === 1 ? "1 Eintrag" : `${count} Einträge`;
}

export function laneLabel(plan: Plan, item: PlanItem): string {
  if (!isLaneItem(item)) return ALL_LANES_LABEL;
  return plan.lanes.find((lane) => lane.id === item.lane)?.title ?? "";
}

/** „07.04.2025“ bzw. „01.01.2028 – 30.06.2030“. */
export function scheduleLabel(item: PlanItem, locale: string): string {
  return shortTermText(item, locale);
}
