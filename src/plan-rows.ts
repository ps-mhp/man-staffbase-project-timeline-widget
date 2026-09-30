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
 * Der Plan als Tabelle — eine Zeile je Eintrag.
 *
 * Listenansicht und Excel-Export zeigen dieselben Zeilen; stünden sie in zwei
 * Komponenten getrennt, liefe früher oder später die Spalte „Kategorie" hier
 * anders als dort. Verweise (Ebene, Kategorie, Vorgänger) sind hier schon in
 * Titel aufgelöst, damit keine der beiden Ausgaben den Plan noch kennen muss.
 */

import { DayNumber } from "./calendar";
import { ItemKind, Plan, PlanItem, categoryOf, colorOf, isLaneItem, itemEndDay, itemStartDay } from "./plan-model";

export const KIND_LABELS: Record<ItemKind, string> = {
  milestone: "Meilenstein",
  bar: "Zeitraum",
  deadline: "Stichtag",
};

/** Die „Ebene" eines Stichtags — er gehört zu keiner und gilt für alle. */
export const ALL_LANES_LABEL = "Alle Ebenen";

export interface PlanRow {
  id: string;
  /** Titel der Ebene bzw. {@link ALL_LANES_LABEL}. */
  lane: string;
  kind: ItemKind;
  kindLabel: string;
  title: string;
  /** Titel oder "". */
  category: string;
  /** {@link colorOf}. */
  color: string;
  start: DayNumber;
  /** null bei Meilenstein/Stichtag. */
  end: DayNumber | null;
  series: string;
  tentative: boolean;
  /** Titel, in der Reihenfolge von `dependsOn`. */
  predecessors: string[];
  description: string;
}

/**
 * Titel mit Zahlen stehen in natürlicher Folge: „2. SOP" vor „10. SOP", wie
 * die Redaktion sie gezählt hat, nicht wie eine Zeichenkette sie ordnet.
 */
const collator = new Intl.Collator("de", { numeric: true });

/** Eine Zeile samt ihrem Rang in der Ebenen-Reihenfolge, nur zum Sortieren. */
interface RankedRow {
  row: PlanRow;
  laneRank: number;
}

/**
 * Baut die Zeilen in der Reihenfolge der Eingabe. Vorgänger werden im ganzen
 * Plan gesucht, nicht nur in `items`: ein Export der aktuellen Ansicht soll
 * auch einen Vorgänger nennen, der gerade außerhalb des Ausschnitts liegt.
 */
function rankedRows(plan: Plan, items: readonly PlanItem[]): RankedRow[] {
  const titleById = new Map(plan.items.map((item) => [item.id, item.title]));
  const lanes = new Map(plan.lanes.map((lane, index) => [lane.id, { title: lane.title, index }]));
  // Stichtage stehen hinter allen Ebenen — auch hinter einer, die es nicht
  // (mehr) gibt; das Lesen verwirft solche Einträge, die Rechnung bleibt dennoch heil.
  const deadlineRank = plan.lanes.length + 1;

  return items.map((item) => {
    const lane = isLaneItem(item) ? lanes.get(item.lane) : undefined;
    const predecessors = (item.dependsOn ?? []).flatMap((id) => {
      const title = titleById.get(id);
      return title === undefined ? [] : [title];
    });
    const row: PlanRow = {
      id: item.id,
      lane: isLaneItem(item) ? (lane?.title ?? "") : ALL_LANES_LABEL,
      kind: item.kind,
      kindLabel: KIND_LABELS[item.kind],
      title: item.title,
      category: categoryOf(plan, item)?.title ?? "",
      color: colorOf(plan, item),
      start: itemStartDay(item),
      end: item.kind === "bar" ? itemEndDay(item) : null,
      series: isLaneItem(item) ? (item.series ?? "") : "",
      tentative: item.tentative === true,
      predecessors,
      description: item.description ?? "",
    };
    return { row, laneRank: isLaneItem(item) ? (lane?.index ?? plan.lanes.length) : deadlineRank };
  });
}

const byLane = (a: RankedRow, b: RankedRow): number => a.laneRank - b.laneRank;
const byStart = (a: RankedRow, b: RankedRow): number => a.row.start - b.row.start;
const byTitle = (a: RankedRow, b: RankedRow): number => collator.compare(a.row.title, b.row.title);

function sortRows(ranked: RankedRow[], order: readonly ((a: RankedRow, b: RankedRow) => number)[]): PlanRow[] {
  return [...ranked]
    .sort((a, b) => order.reduce((result, compare) => (result !== 0 ? result : compare(a, b)), 0))
    .map(({ row }) => row);
}

/** Export-Reihenfolge: Ebenen-Reihenfolge, darin Beginn, dann Titel; Stichtage zuletzt nach Datum. */
export function planRows(plan: Plan, items: readonly PlanItem[]): PlanRow[] {
  return sortRows(rankedRows(plan, items), [byLane, byStart, byTitle]);
}

/** Listenansicht: nach Beginn, dann Ebenen-Reihenfolge, dann Titel. */
export function rowsByDate(plan: Plan, items: readonly PlanItem[]): PlanRow[] {
  return sortRows(rankedRows(plan, items), [byStart, byLane, byTitle]);
}
