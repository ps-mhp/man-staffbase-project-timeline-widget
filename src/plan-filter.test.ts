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
import {
  EMPTY_FILTER,
  NO_CATEGORY,
  PlanFilter,
  activeFilterCount,
  describeFilter,
  exportItems,
  filterItems,
  itemIntersects,
  itemPassesFilter,
  matchesQuery,
  normalizeText,
} from "./plan-filter";
import { Plan, PlanItem } from "./plan-model";

const day = (text: string): number => parseIsoDate(text) as number;

const plan: Plan = {
  version: 1,
  lanes: [
    { id: "l1", title: "Messen" },
    { id: "l2", title: "Launches / SOPs" },
  ],
  categories: [
    { id: "c1", title: "General", color: "#E40045" },
    { id: "c2", title: "Café Crème", color: "#303C49" },
  ],
  items: [
    { id: "m1", kind: "milestone", lane: "l1", category: "c1", title: "IAA", date: "2026-09-15" },
    {
      id: "m2",
      kind: "milestone",
      lane: "l2",
      title: "SOP eTruck",
      date: "2025-05-15",
      series: "TMS1",
      description: "Erster\nKunde",
    },
    { id: "b1", kind: "bar", lane: "l2", category: "c2", title: "TMS1", start: "2028-01-01", end: "2030-06-30" },
    { id: "d1", kind: "deadline", category: "c1", title: "Euro 7", date: "2029-05-01" },
    // Die Kategorie gibt es nicht (mehr): der Eintrag gilt als „ohne Kategorie".
    { id: "m3", kind: "milestone", lane: "l1", category: "weg", title: "Bauma", date: "2025-04-07" },
  ],
};

const item = (id: string): PlanItem => plan.items.find((entry) => entry.id === id) as PlanItem;
const ids = (items: readonly PlanItem[]): string[] => items.map((entry) => entry.id);
const filter = (patch: Partial<PlanFilter>): PlanFilter => ({ ...EMPTY_FILTER, ...patch });

describe("activeFilterCount", () => {
  it("zählt ohne Filter nichts", () => {
    expect(activeFilterCount(EMPTY_FILTER)).toBe(0);
  });

  it("zählt je Dimension einmal, egal wie viel darin ausgeblendet ist", () => {
    expect(activeFilterCount(filter({ hiddenCategories: ["c1", "c2", NO_CATEGORY] }))).toBe(1);
    expect(activeFilterCount(filter({ hiddenLanes: ["l1", "l2"] }))).toBe(1);
    expect(activeFilterCount(filter({ period: { start: 0, end: 10 } }))).toBe(1);
    expect(activeFilterCount(filter({ query: "iaa" }))).toBe(1);
    expect(
      activeFilterCount({ hiddenCategories: ["c1"], hiddenLanes: ["l1"], period: { start: 0, end: 1 }, query: "x" }),
    ).toBe(4);
  });

  it("zählt eine Suche aus Leerraum nicht", () => {
    expect(activeFilterCount(filter({ query: "  \t " }))).toBe(0);
  });
});

describe("normalizeText", () => {
  it("entfernt Akzente, schreibt klein und faltet Leerraum", () => {
    expect(normalizeText("  Café\tCRÈME \n x  ")).toBe("cafe creme x");
    expect(normalizeText("Ärger über Öl")).toBe("arger uber ol");
    expect(normalizeText("")).toBe("");
  });
});

describe("itemPassesFilter / filterItems", () => {
  it("lässt ohne Filter alles durch", () => {
    expect(ids(filterItems(plan, EMPTY_FILTER))).toEqual(["m1", "m2", "b1", "d1", "m3"]);
  });

  it("blendet Kategorien aus, auch für Stichtage", () => {
    expect(ids(filterItems(plan, filter({ hiddenCategories: ["c1"] })))).toEqual(["m2", "b1", "m3"]);
  });

  it("zählt Einträge ohne oder mit unbekannter Kategorie als „ohne Kategorie“", () => {
    expect(ids(filterItems(plan, filter({ hiddenCategories: [NO_CATEGORY] })))).toEqual(["m1", "b1", "d1"]);
  });

  it("blendet Ebenen aus, Stichtage aber nicht", () => {
    expect(ids(filterItems(plan, filter({ hiddenLanes: ["l1"] })))).toEqual(["m2", "b1", "d1"]);
    expect(ids(filterItems(plan, filter({ hiddenLanes: ["l1", "l2"] })))).toEqual(["d1"]);
  });

  it("lässt im Zeitraum nur, was ihn berührt — beide Grenzen eingeschlossen", () => {
    const period = { start: day("2026-01-01"), end: day("2028-01-01") };
    expect(ids(filterItems(plan, filter({ period })))).toEqual(["m1", "b1"]);
    expect(itemPassesFilter(plan, item("m2"), filter({ period: { start: day("2025-05-15"), end: day("2025-05-15") } }))).toBe(
      true,
    );
    expect(itemPassesFilter(plan, item("m2"), filter({ period: { start: day("2025-05-16"), end: day("2026-01-01") } }))).toBe(
      false,
    );
  });

  it("lässt einen Zeitraum durch, der die Filtergrenzen ganz umfasst", () => {
    const period = { start: day("2029-01-01"), end: day("2029-02-01") };
    expect(ids(filterItems(plan, filter({ period })))).toEqual(["b1"]);
  });

  it("verbindet die Filter mit „und“ und kümmert sich nicht um die Suche", () => {
    const combined = filter({
      hiddenCategories: ["c2"],
      hiddenLanes: ["l1"],
      period: { start: day("2025-01-01"), end: day("2029-12-31") },
      query: "gibt es nicht",
    });
    expect(ids(filterItems(plan, combined))).toEqual(["m2", "d1"]);
  });
});

describe("matchesQuery", () => {
  it.each(["", "   "])("findet bei leerer Suche %p alles", (query) => {
    expect(plan.items.every((entry) => matchesQuery(plan, entry, query))).toBe(true);
  });

  it.each([
    ["iaa", ["m1"]],
    ["IAA", ["m1"]],
    ["kunde", ["m2"]],
    ["cafe", ["b1"]],
    ["CAFÉ crème", ["b1"]],
    ["launches", ["m2", "b1"]],
    ["tms1", ["m2", "b1"]],
    ["general", ["m1", "d1"]],
    ["messen iaa", ["m1"]],
    ["sop kunde", ["m2"]],
    ["sop iaa", []],
    ["euro", ["d1"]],
  ])("findet für %p die Einträge %p", (query, expected) => {
    expect(ids(plan.items.filter((entry) => matchesQuery(plan, entry, query)))).toEqual(expected);
  });

  it("sucht bei Stichtagen in keiner Ebene", () => {
    expect(matchesQuery(plan, item("d1"), "messen")).toBe(false);
  });
});

describe("itemIntersects", () => {
  const milestone = item("m1");
  const start = day("2026-09-15");

  it("prüft den Tag des Meilensteins gegen den halboffenen Ausschnitt", () => {
    expect(itemIntersects(milestone, { start, end: start + 1 })).toBe(true);
    expect(itemIntersects(milestone, { start: start + 0.5, end: start + 3 })).toBe(true);
    expect(itemIntersects(milestone, { start: start - 3, end: start })).toBe(false);
    expect(itemIntersects(milestone, { start: start + 1, end: start + 3 })).toBe(false);
    expect(itemIntersects(milestone, { start: start - 3, end: start + 0.25 })).toBe(true);
  });

  it("nimmt den letzten Tag eines Zeitraums ganz mit", () => {
    const bar = item("b1");
    const end = day("2030-06-30");
    expect(itemIntersects(bar, { start: end + 0.5, end: end + 10 })).toBe(true);
    expect(itemIntersects(bar, { start: end + 1, end: end + 10 })).toBe(false);
    expect(itemIntersects(bar, { start: day("2029-01-01"), end: day("2029-02-01") })).toBe(true);
  });
});

describe("exportItems", () => {
  const everything = { start: day("2020-01-01"), end: day("2040-01-01") };

  it("gibt für den ganzen Plan alles, ohne Filter und Ausschnitt", () => {
    const narrow = filter({ hiddenLanes: ["l1", "l2"], query: "euro" });
    expect(ids(exportItems(plan, narrow, { start: 0, end: 1 }, "all"))).toEqual(["m1", "m2", "b1", "d1", "m3"]);
  });

  it("gibt für die Ansicht, was die Filter erfüllt und im Ausschnitt liegt", () => {
    const viewport = { start: day("2025-01-01"), end: day("2027-01-01") };
    expect(ids(exportItems(plan, filter({ hiddenLanes: ["l1"] }), viewport, "view"))).toEqual(["m2"]);
    expect(ids(exportItems(plan, EMPTY_FILTER, viewport, "view"))).toEqual(["m1", "m2", "m3"]);
  });

  it("nimmt bei aktiver Suche nur die Treffer", () => {
    expect(ids(exportItems(plan, filter({ query: "euro" }), everything, "view"))).toEqual(["d1"]);
    expect(ids(exportItems(plan, filter({ query: "  " }), everything, "view"))).toHaveLength(5);
  });
});

describe("describeFilter", () => {
  it("sagt ohne Filter nichts", () => {
    expect(describeFilter(plan, EMPTY_FILTER, "de-DE")).toEqual([]);
  });

  it("beschreibt jeden aktiven Filter, Namen in der Reihenfolge des Plans", () => {
    const active: PlanFilter = {
      hiddenCategories: [NO_CATEGORY, "c2", "c1"],
      hiddenLanes: ["l2", "l1"],
      period: { start: day("2025-01-01"), end: day("2026-03-31") },
      query: "  foo \t bar ",
    };
    expect(describeFilter(plan, active, "de-DE")).toEqual([
      "Ausgeblendete Kategorien: General, Café Crème, Ohne Kategorie",
      "Ausgeblendete Ebenen: Messen, Launches / SOPs",
      "Zeitraum: Januar 2025 bis März 2026",
      "Suche: „foo bar“",
    ]);
  });

  it("nennt die Monate in der Sprache der Seite", () => {
    const period = { start: day("2025-01-01"), end: day("2026-03-31") };
    expect(describeFilter(plan, filter({ period }), "en-US")).toEqual(["Zeitraum: January 2025 bis March 2026"]);
  });

  it("übergeht Kennungen, die der Plan nicht kennt", () => {
    expect(describeFilter(plan, filter({ hiddenCategories: ["weg", "c1"], hiddenLanes: ["weg"] }), "de-DE")).toEqual([
      "Ausgeblendete Kategorien: General",
    ]);
  });
});
