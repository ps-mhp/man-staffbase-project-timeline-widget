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

import { dayFromParts } from "../calendar";
import { LIMITS, MilestoneItem, Plan } from "../plan-model";
import {
  addItem,
  changeKind,
  defaultBarEnd,
  duplicateItem,
  newItemDate,
  removeItem,
  setTitle,
  touch,
  updateItem,
  withOptional,
} from "./plan-edits";
import {
  NOW,
  TODAY,
  basePlan,
  expectReadable,
  itemById,
} from "./plan-edits.fixture";

describe("touch", () => {
  it("setzt das Stand-Datum, ohne das Original anzufassen", () => {
    const plan = basePlan();
    const next = touch(plan, NOW);
    expect(next.updatedAt).toBe(TODAY);
    expect(plan.updatedAt).toBe("2024-11-27");
  });
});

describe("setTitle", () => {
  it("setzt die Überschrift ohne Leerraum am Rand", () => {
    const next = setTitle(basePlan(), "  Sales Truck Launch ", NOW);
    expect(next.title).toBe("Sales Truck Launch");
    expect(next.updatedAt).toBe(TODAY);
    expectReadable(next);
  });

  it("entfernt eine leere Überschrift ganz", () => {
    const withTitle = setTitle(basePlan(), "Launch", NOW);
    expect(setTitle(withTitle, "   ", NOW)).not.toHaveProperty("title");
    expect(withTitle.title).toBe("Launch");
  });
});

describe("withOptional", () => {
  it("setzt einen Wert und lässt einen leeren ganz weg", () => {
    const item = basePlan().items[0] as MilestoneItem;
    expect(withOptional(item, "series", "Neu")).toEqual({
      ...item,
      series: "Neu",
    });
    const without = withOptional(item, "series", undefined);
    expect("series" in without).toBe(false);
    expect(item.series).toBe("Messen");
  });
});

describe("defaultBarEnd", () => {
  it.each([
    ["2025-01-15", "2025-02-14"],
    ["2025-12-10", "2026-01-09"],
    // Ein Monat ab dem 31. endet am Ende des Folgemonats, nicht im übernächsten.
    ["2025-01-31", "2025-02-28"],
    ["2024-01-31", "2024-02-29"],
    ["2025-03-01", "2025-03-31"],
  ])("lässt einen Zeitraum ab %s einen Monat dauern: bis %s", (start, end) => {
    expect(defaultBarEnd(start)).toBe(end);
  });
});

describe("newItemDate", () => {
  it("nimmt die Mitte des Ausschnitts", () => {
    const start = dayFromParts(2025, 1, 1);
    expect(newItemDate({ start, end: start + 10 }, NOW)).toBe("2025-01-06");
  });

  it("nimmt ohne Ausschnitt den heutigen Tag", () => {
    expect(newItemDate(null, NOW)).toBe(TODAY);
  });
});

describe("addItem", () => {
  it("legt einen gültigen Meilenstein in der ersten Ebene an", () => {
    const plan = basePlan();
    const { plan: next, id } = addItem(plan, "milestone", "2026-03-01", NOW);
    expect(id).not.toBeNull();
    expect(itemById(next, id as string)).toEqual({
      id,
      kind: "milestone",
      lane: "l1",
      title: "Neuer Meilenstein",
      date: "2026-03-01",
    });
    expect(next.updatedAt).toBe(TODAY);
    expect(plan.items).toHaveLength(4);
    expectReadable(next);
  });

  it("legt einen Zeitraum von einem Monat an", () => {
    const { plan, id } = addItem(basePlan(), "bar", "2026-03-10", NOW);
    expect(itemById(plan, id as string)).toMatchObject({
      kind: "bar",
      title: "Neuer Zeitraum",
      start: "2026-03-10",
      end: "2026-04-09",
    });
  });

  it("legt einen Stichtag ohne Ebene an", () => {
    const { plan, id } = addItem(basePlan(), "deadline", "2026-03-10", NOW);
    const item = itemById(plan, id as string);
    expect(item).toMatchObject({
      kind: "deadline",
      title: "Neuer Stichtag",
      date: "2026-03-10",
    });
    expect(item && "lane" in item).toBe(false);
  });

  it("legt ohne Ebene keinen Meilenstein und keinen Zeitraum an", () => {
    const plan = { ...basePlan(), lanes: [], items: [] };
    expect(addItem(plan, "milestone", "2026-03-10", NOW)).toEqual({
      plan,
      id: null,
    });
    expect(addItem(plan, "bar", "2026-03-10", NOW)).toEqual({ plan, id: null });
    expect(addItem(plan, "deadline", "2026-03-10", NOW).id).not.toBeNull();
  });

  it("nimmt an der Obergrenze nichts mehr an", () => {
    const full: Plan = {
      ...basePlan(),
      items: Array.from({ length: LIMITS.items }, (_, index) => ({
        id: `d${index}`,
        kind: "deadline" as const,
        title: `Stichtag ${index}`,
        date: "2026-01-01",
      })),
    };
    expect(addItem(full, "deadline", "2026-03-10", NOW)).toEqual({
      plan: full,
      id: null,
    });
  });
});

describe("updateItem", () => {
  it("ersetzt den Eintrag mit derselben id", () => {
    const plan = basePlan();
    const changed = { ...plan.items[0], title: "Bauma 2025" };
    const next = updateItem(plan, changed, NOW);
    expect(next.items[0]).toBe(changed);
    expect(next.updatedAt).toBe(TODAY);
    expect(plan.items[0].title).toBe("Bauma");
  });
});

describe("duplicateItem", () => {
  it("legt eine Kopie gleich hinter dem Original an", () => {
    const { plan, id } = duplicateItem(basePlan(), "b1", NOW);
    expect(id).not.toBeNull();
    expect(id).not.toBe("b1");
    expect(plan.items[2]).toEqual({
      ...basePlan().items[1],
      id,
      title: "TMS1 (Kopie)",
    });
    expect(plan.updatedAt).toBe(TODAY);
    expectReadable(plan);
  });

  it("nimmt an der Obergrenze nichts mehr an und kennt keine fremde id", () => {
    const full: Plan = {
      ...basePlan(),
      items: Array.from({ length: LIMITS.items }, (_, index) => ({
        id: `d${index}`,
        kind: "deadline" as const,
        title: `Stichtag ${index}`,
        date: "2026-01-01",
      })),
    };
    expect(duplicateItem(full, "d1", NOW)).toEqual({ plan: full, id: null });
    const plan = basePlan();
    expect(duplicateItem(plan, "gibt-es-nicht", NOW)).toEqual({
      plan,
      id: null,
    });
  });
});

describe("removeItem", () => {
  it("löscht den Eintrag und streicht ihn aus allen Vorgängerlisten", () => {
    const next = removeItem(basePlan(), "b1", NOW);
    expect(itemById(next, "b1")).toBeUndefined();
    expect(itemById(next, "m2")).toMatchObject({ dependsOn: ["m1"] });
    expect(next.updatedAt).toBe(TODAY);
    expectReadable(next);
  });

  it("lässt eine leer gewordene Vorgängerliste ganz weg", () => {
    const next = removeItem(removeItem(basePlan(), "b1", NOW), "m1", NOW);
    expect(itemById(next, "m2")).not.toHaveProperty("dependsOn");
  });
});

describe("changeKind", () => {
  it("macht aus einem Meilenstein einen Zeitraum von einem Monat", () => {
    const next = changeKind(basePlan(), "m1", "bar", NOW);
    expect(itemById(next, "m1")).toEqual({
      id: "m1",
      kind: "bar",
      lane: "l1",
      category: "c1",
      title: "Bauma",
      start: "2025-04-07",
      end: "2025-05-06",
      series: "Messen",
    });
    expect(next.updatedAt).toBe(TODAY);
    expectReadable(next);
  });

  it("macht aus einem Zeitraum einen Meilenstein am Beginn", () => {
    const next = changeKind(basePlan(), "b1", "milestone", NOW);
    expect(itemById(next, "b1")).toEqual({
      id: "b1",
      kind: "milestone",
      lane: "l2",
      category: "c2",
      title: "TMS1",
      date: "2028-01-01",
      dependsOn: ["m1"],
    });
    expectReadable(next);
  });

  it("nimmt einem Stichtag Ebene, Serie, Symbol und Vorgänger", () => {
    const next = changeKind(basePlan(), "m1", "deadline", NOW);
    expect(itemById(next, "m1")).toEqual({
      id: "m1",
      kind: "deadline",
      category: "c1",
      title: "Bauma",
      date: "2025-04-07",
    });
    expectReadable(next);
  });

  it("streicht einen neuen Stichtag aus fremden Vorgängerlisten — ein Stichtag ist nie Vorgänger", () => {
    const next = changeKind(basePlan(), "m1", "deadline", NOW);
    expect(itemById(next, "b1")).not.toHaveProperty("dependsOn");
    expect(itemById(next, "m2")).toMatchObject({ dependsOn: ["b1"] });
  });

  it("macht aus einem Zeitraum einen Stichtag ohne Pfeil und ohne eigene Vorgänger", () => {
    const next = changeKind(basePlan(), "b1", "deadline", NOW);
    expect(itemById(next, "b1")).toEqual({
      id: "b1",
      kind: "deadline",
      category: "c2",
      title: "TMS1",
      date: "2028-01-01",
    });
    expect(itemById(next, "m2")).toMatchObject({ dependsOn: ["m1"] });
  });

  it("setzt einen Stichtag in die erste Ebene", () => {
    const toMilestone = changeKind(basePlan(), "d1", "milestone", NOW);
    expect(itemById(toMilestone, "d1")).toEqual({
      id: "d1",
      kind: "milestone",
      lane: "l1",
      category: "c1",
      title: "Euro 7",
      date: "2027-07-01",
    });
    const toBar = changeKind(basePlan(), "d1", "bar", NOW);
    expect(itemById(toBar, "d1")).toMatchObject({
      kind: "bar",
      lane: "l1",
      start: "2027-07-01",
      end: "2027-07-31",
    });
    expectReadable(toBar);
  });

  it("lässt einen Stichtag ohne Ebenen, was er ist", () => {
    const plan = { ...basePlan(), lanes: [], items: [basePlan().items[2]] };
    expect(changeKind(plan, "d1", "milestone", NOW)).toBe(plan);
  });

  it("ändert nichts, wenn die Art dieselbe bleibt", () => {
    const plan = basePlan();
    expect(changeKind(plan, "m1", "milestone", NOW)).toBe(plan);
  });

  it("behält die Felder, die diese Version nicht kennt", () => {
    const plan = basePlan();
    const withUnknown: Plan = {
      ...plan,
      items: plan.items.map((item) =>
        item.id === "m1" ? { ...item, unknown: { owner: "PM" } } : item,
      ),
    };
    expect(
      itemById(changeKind(withUnknown, "m1", "bar", NOW), "m1")?.unknown,
    ).toEqual({ owner: "PM" });
  });
});
