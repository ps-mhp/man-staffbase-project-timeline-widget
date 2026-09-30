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
 * Was die Ansicht aus Plan und Filter ableitet — ohne React, damit es ohne
 * Renderer prüfbar ist: welche Ebenen und Linien sichtbar sind, wer mit dem
 * gewählten Eintrag verbunden ist, in welcher Reihenfolge die Tastatur wandert.
 */

import { Lane, Plan, PlanItem, isLaneItem, itemStartDay } from "./plan-model";
import { PlanFilter, matchesQuery } from "./plan-filter";
import { Dependency } from "./timeline-overlay";
import { FocusRows } from "./use-roving-focus";

export function visibleLanesOf(plan: Plan, filter: PlanFilter): Lane[] {
  return plan.lanes.filter((lane) => !filter.hiddenLanes.includes(lane.id));
}

/** Nur Linien, deren beide Enden sichtbar sind; eine halbe Linie ins Leere sagte nichts. */
export function dependenciesOf(items: readonly PlanItem[]): Dependency[] {
  const visible = new Set(items.map((item) => item.id));
  return items.flatMap((item) =>
    (item.dependsOn ?? []).filter((from) => visible.has(from)).map((from) => ({ from, to: item.id })),
  );
}

/** Die direkten Vorgänger und Nachfolger von `id`. */
export function relatedTo(dependencies: readonly Dependency[], id: string | null): Set<string> {
  if (id === null) return new Set();
  return new Set(
    dependencies.flatMap(({ from, to }) => (from === id ? [to] : to === id ? [from] : [])),
  );
}

/** Suchtreffer unter den sichtbaren Einträgen; `null`, solange nicht gesucht wird. */
export function matchesOf(plan: Plan, items: readonly PlanItem[], query: string): Set<string> | null {
  if (query.trim() === "") return null;
  return new Set(items.filter((item) => matchesQuery(plan, item, query)).map((item) => item.id));
}

/** Alles, was kein Treffer ist, solange gesucht wird. */
export function dimmedOf(items: readonly PlanItem[], matches: ReadonlySet<string> | null): Set<string> {
  if (matches === null) return new Set();
  return new Set(items.filter((item) => !matches.has(item.id)).map((item) => item.id));
}

/**
 * Je Ebene die Einträge nach Beginn, zuletzt die Stichtage — die Wege der
 * Pfeiltasten. Aus Ebenen und Einträgen, nicht aus dem Layout: die Reihenfolge
 * ändert sich beim Zoomen nicht und muss deshalb nicht mit jedem Bild neu
 * sortiert werden.
 */
export function focusRowsOf(lanes: readonly Lane[], items: readonly PlanItem[]): FocusRows {
  const byStart = (entries: PlanItem[]) =>
    [...entries].sort((a, b) => itemStartDay(a) - itemStartDay(b) || a.title.localeCompare(b.title)).map((item) => item.id);
  return [
    ...lanes.map((lane) => byStart(items.filter((item) => isLaneItem(item) && item.lane === lane.id))),
    byStart(items.filter((item) => item.kind === "deadline")),
  ].filter((row) => row.length > 0);
}

/** Die Treffer in zeitlicher Folge, für „Enter springt zum nächsten Treffer". */
export function orderedMatches(items: readonly PlanItem[], matches: ReadonlySet<string> | null): string[] {
  if (matches === null) return [];
  return items
    .filter((item) => matches.has(item.id))
    .sort((a, b) => itemStartDay(a) - itemStartDay(b) || a.title.localeCompare(b.title))
    .map((item) => item.id);
}
