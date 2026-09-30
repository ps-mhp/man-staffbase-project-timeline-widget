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

import { Plan } from "../plan-model";
import {
  countInCategory,
  countInLane,
  countLabel,
  dependencyCandidates,
  itemsByDate,
  laneLabel,
  matchesSearch,
  scheduleLabel,
  seriesInLane,
} from "./plan-queries";

const plan: Plan = {
  version: 1,
  lanes: [
    { id: "l1", title: "Messen" },
    { id: "l2", title: "SOPs" },
  ],
  categories: [{ id: "c1", title: "Général", color: "#E40045" }],
  items: [
    { id: "b1", kind: "bar", lane: "l2", title: "TMS1", start: "2028-01-01", end: "2030-06-30", series: "TMS" },
    { id: "m2", kind: "milestone", lane: "l2", title: "SOP B", date: "2026-01-15", series: "TG Assist" },
    { id: "d1", kind: "deadline", category: "c1", title: "Euro 7", date: "2027-07-01" },
    { id: "m1", kind: "milestone", lane: "l1", title: "Bauma", date: "2025-04-07", description: "Messe in München" },
    { id: "m3", kind: "milestone", lane: "l2", title: "SOP A", date: "2026-01-15", series: "TG Assist" },
  ],
};

describe("itemsByDate", () => {
  it("sortiert nach Beginn, bei Gleichstand nach Titel", () => {
    expect(itemsByDate(plan.items).map((item) => item.id)).toEqual(["m1", "m3", "m2", "d1", "b1"]);
  });
});

describe("matchesSearch", () => {
  it.each([
    ["", "m1", true],
    ["bauma", "m1", true],
    ["MUNCHEN", "m1", true],
    ["messen", "m1", true],
    ["general", "d1", true],
    ["tg assist", "m2", true],
    ["euro", "m1", false],
  ])("findet mit %p den Eintrag %s: %p", (query, id, expected) => {
    const item = plan.items.find((entry) => entry.id === id)!;
    expect(matchesSearch(plan, item, query)).toBe(expected);
  });
});

describe("seriesInLane", () => {
  it("nennt die Serien einer Ebene je einmal, sortiert", () => {
    expect(seriesInLane(plan, "l2")).toEqual(["TG Assist", "TMS"]);
    expect(seriesInLane(plan, "l1")).toEqual([]);
  });
});

describe("dependencyCandidates", () => {
  it("bietet andere Meilensteine und Zeiträume an, keine Stichtage und nicht sich selbst", () => {
    expect(dependencyCandidates(plan, "m2").map((item) => item.id)).toEqual(["m1", "m3", "b1"]);
  });
});

describe("Zählen", () => {
  it("zählt die Einträge einer Ebene und einer Kategorie", () => {
    expect(countInLane(plan, "l2")).toBe(3);
    expect(countInCategory(plan, "c1")).toBe(1);
  });

  it("spricht von einem Eintrag und von mehreren Einträgen", () => {
    expect(countLabel(1)).toBe("1 Eintrag");
    expect(countLabel(3)).toBe("3 Einträge");
  });
});

describe("Beschriftung", () => {
  it("nennt die Ebene, bei Stichtagen alle", () => {
    expect(laneLabel(plan, plan.items[0])).toBe("SOPs");
    expect(laneLabel(plan, plan.items[2])).toBe("Alle Ebenen");
  });

  it("nennt den Termin, bei Zeiträumen von–bis", () => {
    expect(scheduleLabel(plan.items[3], "de-DE")).toBe("07.04.2025");
    expect(scheduleLabel(plan.items[0], "de-DE")).toBe("01.01.2028 – 30.06.2030");
  });
});
