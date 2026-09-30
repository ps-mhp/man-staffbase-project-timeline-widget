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

import { parseIsoDate } from "./calendar";
import { examplePlan } from "./example-plan";
import { Plan, PlanItem, UNCATEGORIZED_COLOR } from "./plan-model";
import { ALL_LANES_LABEL, KIND_LABELS, PlanRow, planRows, rowsByDate } from "./plan-rows";

const day = (text: string): number => parseIsoDate(text) as number;

const plan: Plan = {
  version: 1,
  lanes: [
    { id: "l1", title: "Messen" },
    { id: "l2", title: "SOPs" },
  ],
  categories: [{ id: "c1", title: "General", color: "#E40045" }],
  items: [
    {
      id: "beta",
      kind: "milestone",
      lane: "l2",
      category: "c1",
      title: "Beta",
      date: "2025-03-01",
      dependsOn: ["iaa", "gibt-es-nicht", "alpha"],
    },
    {
      id: "alpha",
      kind: "bar",
      lane: "l2",
      title: "Alpha",
      start: "2025-03-01",
      end: "2025-06-30",
      tentative: true,
      series: "S1",
      description: "Erste\nPhase",
    },
    { id: "sop-10", kind: "milestone", lane: "l2", title: "10. SOP", date: "2025-03-01" },
    { id: "sop-2", kind: "milestone", lane: "l2", title: "2. SOP", date: "2025-03-01" },
    { id: "iaa", kind: "milestone", lane: "l1", category: "weg", title: "IAA", date: "2026-01-01" },
    { id: "bauma", kind: "milestone", lane: "l1", title: "Bauma", date: "2025-12-01" },
    { id: "zulassung", kind: "milestone", lane: "l1", title: "Zulassung", date: "2025-03-01" },
    { id: "euro7", kind: "deadline", category: "c1", title: "Euro 7", date: "2025-01-01" },
    { id: "co2", kind: "deadline", title: "CO2", date: "2024-06-01" },
    { id: "abgabe", kind: "deadline", title: "Abgabe", date: "2025-12-01" },
  ],
};

const titles = (rows: readonly PlanRow[]): string[] => rows.map((row) => row.title);
const rowOf = (rows: readonly PlanRow[], id: string): PlanRow => rows.find((row) => row.id === id) as PlanRow;

describe("KIND_LABELS", () => {
  it("benennt jede Art", () => {
    expect(KIND_LABELS).toEqual({ milestone: "Meilenstein", bar: "Zeitraum", deadline: "Stichtag" });
    expect(ALL_LANES_LABEL).toBe("Alle Ebenen");
  });
});

describe("planRows", () => {
  const rows = planRows(plan, plan.items);

  it("beschreibt einen Zeitraum vollständig", () => {
    expect(rowOf(rows, "alpha")).toEqual({
      id: "alpha",
      lane: "SOPs",
      kind: "bar",
      kindLabel: "Zeitraum",
      title: "Alpha",
      category: "",
      color: UNCATEGORIZED_COLOR,
      start: day("2025-03-01"),
      end: day("2025-06-30"),
      series: "S1",
      tentative: true,
      predecessors: [],
      description: "Erste\nPhase",
    });
  });

  it("beschreibt einen Meilenstein ohne Ende, mit Kategorie und Vorgängern in ihrer Reihenfolge", () => {
    expect(rowOf(rows, "beta")).toEqual({
      id: "beta",
      lane: "SOPs",
      kind: "milestone",
      kindLabel: "Meilenstein",
      title: "Beta",
      category: "General",
      color: "#E40045",
      start: day("2025-03-01"),
      end: null,
      series: "",
      tentative: false,
      predecessors: ["IAA", "Alpha"],
      description: "",
    });
  });

  it("macht aus einer unbekannten Kategorie „ohne Kategorie“", () => {
    expect(rowOf(rows, "iaa")).toMatchObject({ category: "", color: UNCATEGORIZED_COLOR });
  });

  it("stellt Stichtage in alle Ebenen, ohne Ende", () => {
    expect(rowOf(rows, "euro7")).toMatchObject({
      lane: ALL_LANES_LABEL,
      kind: "deadline",
      kindLabel: "Stichtag",
      category: "General",
      start: day("2025-01-01"),
      end: null,
      series: "",
    });
  });

  it("sortiert nach Ebene, darin nach Beginn, dann Titel; Stichtage zuletzt nach Datum", () => {
    expect(titles(rows)).toEqual([
      // Messen
      "Zulassung",
      "Bauma",
      "IAA",
      // SOPs — gleicher Beginn, Titel mit Zahlen in natürlicher Folge
      "2. SOP",
      "10. SOP",
      "Alpha",
      "Beta",
      // Stichtage
      "CO2",
      "Euro 7",
      "Abgabe",
    ]);
  });

  it("nennt Vorgänger auch dann, wenn sie selbst nicht in der Auswahl stehen", () => {
    const beta = plan.items.find((entry) => entry.id === "beta") as PlanItem;
    expect(planRows(plan, [beta])[0].predecessors).toEqual(["IAA", "Alpha"]);
  });

  it("liefert nur Zeilen für die übergebenen Einträge und lässt die Eingabe unberührt", () => {
    const subset = Object.freeze(plan.items.filter((entry) => entry.kind === "deadline"));
    const before = subset.map((entry) => entry.id);
    expect(titles(planRows(plan, subset))).toEqual(["CO2", "Euro 7", "Abgabe"]);
    expect(subset.map((entry) => entry.id)).toEqual(before);
  });

  it("kommt mit dem Beispielplan zurecht", () => {
    const example = examplePlan();
    const exampleRows = planRows(example, example.items);
    expect(exampleRows).toHaveLength(example.items.length);
    expect(exampleRows[0].lane).toBe("Messen");
    expect(exampleRows.slice(-4).map((row) => row.kind)).toEqual(["deadline", "deadline", "deadline", "deadline"]);
    expect(rowOf(exampleRows, "sop-etgl-1").predecessors).toEqual(["eTGL C4S", "eTGL 0-Serie"]);
  });
});

describe("rowsByDate", () => {
  it("sortiert nach Beginn, dann Ebenen-Reihenfolge, dann Titel; Stichtage hinter den Ebenen", () => {
    expect(titles(rowsByDate(plan, plan.items))).toEqual([
      "CO2",
      "Euro 7",
      "Zulassung",
      "2. SOP",
      "10. SOP",
      "Alpha",
      "Beta",
      "Bauma",
      "Abgabe",
      "IAA",
    ]);
  });

  it("baut dieselben Zeilen wie der Export", () => {
    const byDate = rowsByDate(plan, plan.items);
    expect(rowOf(byDate, "beta")).toEqual(rowOf(planRows(plan, plan.items), "beta"));
  });

  it("gibt für keine Einträge keine Zeilen", () => {
    expect(rowsByDate(plan, [])).toEqual([]);
    expect(planRows(plan, [])).toEqual([]);
  });
});
