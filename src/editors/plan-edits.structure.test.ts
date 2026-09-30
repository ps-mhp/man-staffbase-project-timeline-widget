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
import { examplePlan } from "../example-plan";
import { LIMITS, Plan } from "../plan-model";
import {
  CATEGORY_PALETTE,
  addCategory,
  addLane,
  clearStartView,
  moveCategory,
  moveLane,
  removeCategory,
  removeLane,
  renameLane,
  setStartView,
  startEmpty,
  startWithExample,
  updateCategory,
  viewFromViewport,
} from "./plan-edits";
import { NOW, TODAY, basePlan, expectReadable, itemById } from "./plan-edits.fixture";

describe("Ebenen", () => {
  it("legt eine neue Ebene hinten an", () => {
    const { plan, id } = addLane(basePlan(), NOW);
    expect(plan.lanes[2]).toEqual({ id, title: "Neue Ebene" });
    expect(plan.updatedAt).toBe(TODAY);
  });

  it("legt über die Obergrenze hinaus keine Ebene an", () => {
    const full: Plan = {
      ...basePlan(),
      lanes: Array.from({ length: LIMITS.lanes }, (_, index) => ({ id: `l${index}`, title: `Ebene ${index}` })),
    };
    expect(addLane(full, NOW)).toEqual({ plan: full, id: null });
  });

  it("benennt eine Ebene um, aber nicht in einen leeren Namen", () => {
    const plan = basePlan();
    expect(renameLane(plan, "l1", "Ausstellungen", NOW).lanes[0]).toEqual({ id: "l1", title: "Ausstellungen" });
    // Eine Ebene ohne Titel verwirft das Lesen — und mit ihr alle ihre Einträge.
    expect(renameLane(plan, "l1", "   ", NOW)).toBe(plan);
  });

  it("verschiebt eine Ebene, aber nicht über den Rand", () => {
    const plan = basePlan();
    expect(moveLane(plan, "l2", -1, NOW).lanes.map((lane) => lane.id)).toEqual(["l2", "l1"]);
    expect(moveLane(plan, "l1", 1, NOW).lanes.map((lane) => lane.id)).toEqual(["l2", "l1"]);
    expect(moveLane(plan, "l1", -1, NOW)).toBe(plan);
    expect(moveLane(plan, "l2", 1, NOW)).toBe(plan);
  });

  it("verschiebt beim Löschen die Einträge in die Ziel-Ebene", () => {
    const next = removeLane(basePlan(), "l2", "l1", NOW);
    expect(next.lanes.map((lane) => lane.id)).toEqual(["l1"]);
    expect(itemById(next, "b1")).toMatchObject({ lane: "l1", dependsOn: ["m1"] });
    expect(itemById(next, "m2")).toMatchObject({ lane: "l1", dependsOn: ["m1", "b1"] });
    expect(itemById(next, "d1")).toEqual(basePlan().items[2]);
    expect(next.updatedAt).toBe(TODAY);
    expectReadable(next);
  });

  it("löscht die Einträge mit der Ebene und bereinigt die Verweise", () => {
    const next = removeLane(basePlan(), "l1", null, NOW);
    expect(next.items.map((item) => item.id)).toEqual(["b1", "d1", "m2"]);
    expect(itemById(next, "b1")).not.toHaveProperty("dependsOn");
    expect(itemById(next, "m2")).toMatchObject({ dependsOn: ["b1"] });
    expectReadable(next);
  });
});

describe("Kategorien", () => {
  it("bietet zwölf Farben an", () => {
    expect(CATEGORY_PALETTE).toHaveLength(12);
    expect(new Set(CATEGORY_PALETTE).size).toBe(12);
  });

  it("legt eine Kategorie in der ersten noch freien Farbe an", () => {
    const { plan, id } = addCategory(basePlan(), NOW);
    expect(plan.categories[2]).toEqual({ id, title: "Neue Kategorie", color: "#303C49" });
    expect(plan.updatedAt).toBe(TODAY);
  });

  it("legt über die Obergrenze hinaus keine Kategorie an", () => {
    const full: Plan = {
      ...basePlan(),
      categories: Array.from({ length: LIMITS.categories }, (_, index) => ({
        id: `c${index}`,
        title: `Kategorie ${index}`,
        color: "#E40045",
      })),
    };
    expect(addCategory(full, NOW)).toEqual({ plan: full, id: null });
  });

  it("ändert Name und Farbe", () => {
    const next = updateCategory(basePlan(), "c2", { title: "TMS neu", color: "#00786E" }, NOW);
    expect(next.categories[1]).toEqual({ id: "c2", title: "TMS neu", color: "#00786E" });
    expect(next.updatedAt).toBe(TODAY);
  });

  it("verwirft einen leeren Namen und eine ungültige Farbe", () => {
    const plan = basePlan();
    expect(updateCategory(plan, "c2", { title: " " }, NOW)).toBe(plan);
    expect(updateCategory(plan, "c2", { color: "grün" }, NOW)).toBe(plan);
  });

  it("verschiebt eine Kategorie — die Reihenfolge ist die der Legende", () => {
    const plan = basePlan();
    expect(moveCategory(plan, "c2", -1, NOW).categories.map((category) => category.id)).toEqual(["c2", "c1"]);
    expect(moveCategory(plan, "c2", 1, NOW)).toBe(plan);
  });

  it("lässt die Einträge einer gelöschten Kategorie ohne Kategorie zurück", () => {
    const next = removeCategory(basePlan(), "c1", NOW);
    expect(next.categories.map((category) => category.id)).toEqual(["c2"]);
    expect(itemById(next, "m1")).not.toHaveProperty("category");
    expect(itemById(next, "d1")).not.toHaveProperty("category");
    expect(itemById(next, "b1")).toMatchObject({ category: "c2" });
    expectReadable(next);
  });
});

describe("Startansicht", () => {
  it("nimmt die Monate des Ausschnitts, das Ende ausschließlich", () => {
    const viewport = { start: dayFromParts(2025, 1, 1), end: dayFromParts(2032, 1, 1) };
    expect(viewFromViewport(viewport)).toEqual({ start: "2025-01", end: "2031-12" });
  });

  it("rechnet mit Bruchteilen eines Tages", () => {
    // Ein halber Tag Juni am rechten Rand macht den Juni nicht zur Startansicht;
    // sonst fügte schon Rundungsrauschen an einer Monatsgrenze einen Monat an.
    const viewport = { start: dayFromParts(2025, 3, 15) + 0.4, end: dayFromParts(2025, 6, 1) + 0.5 };
    expect(viewFromViewport(viewport)).toEqual({ start: "2025-03", end: "2025-05" });
  });

  it("macht aus einem Ausschnitt unter einem Tag einen Monat", () => {
    const day = dayFromParts(2025, 3, 15);
    expect(viewFromViewport({ start: day + 0.2, end: day + 0.6 })).toEqual({ start: "2025-03", end: "2025-03" });
  });

  it("setzt und entfernt die Startansicht", () => {
    const viewport = { start: dayFromParts(2025, 1, 1), end: dayFromParts(2026, 1, 1) };
    const withView = setStartView(basePlan(), viewport, NOW);
    expect(withView.view).toEqual({ start: "2025-01", end: "2025-12" });
    expect(withView.updatedAt).toBe(TODAY);
    expectReadable(withView);
    const cleared = clearStartView(withView, NOW);
    expect(cleared).not.toHaveProperty("view");
  });
});

describe("Beginn eines leeren Plans", () => {
  it("beginnt mit dem Beispielplan", () => {
    const plan = startWithExample({ version: 1, lanes: [], categories: [], items: [] }, NOW);
    expect(plan).toEqual({ ...examplePlan(), updatedAt: TODAY });
  });

  it("beginnt leer mit einer Ebene", () => {
    const plan = startEmpty({ version: 1, lanes: [], categories: [], items: [] }, NOW);
    expect(plan.lanes).toEqual([{ id: expect.any(String), title: "Ebene 1" }]);
    expect(plan.updatedAt).toBe(TODAY);
  });

  it("behält beim Beispielplan die schon eingegebene Überschrift", () => {
    const empty: Plan = { version: 1, title: "Mein Plan", lanes: [], categories: [], items: [] };
    expect(startWithExample(empty, NOW).title).toBe("Mein Plan");
    expect(startEmpty(empty, NOW).title).toBe("Mein Plan");
  });

  it("behält beim Beginn, was diese Version nicht kennt", () => {
    const empty: Plan = { version: 1, lanes: [], categories: [], items: [], unknown: { theme: "dark" } };
    expect(startWithExample(empty, NOW).unknown).toEqual({ theme: "dark" });
    expect(startEmpty(empty, NOW).unknown).toEqual({ theme: "dark" });
  });
});
