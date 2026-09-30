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

import { examplePlan } from "./example-plan";
import { EMPTY_FILTER } from "./plan-filter";
import {
  dependenciesOf,
  dimmedOf,
  focusRowsOf,
  matchesOf,
  orderedMatches,
  relatedTo,
  visibleLanesOf,
} from "./timeline-model";

const plan = examplePlan();

describe("timeline-model", () => {
  it("blendet ausgeblendete Ebenen aus und hält die Reihenfolge", () => {
    const lanes = visibleLanesOf(plan, { ...EMPTY_FILTER, hiddenLanes: ["lane-sop"] });
    expect(lanes.map((lane) => lane.id)).toEqual(["lane-fairs", "lane-milestones"]);
  });

  it("zeichnet nur Abhängigkeiten, deren beide Enden sichtbar sind", () => {
    const all = dependenciesOf(plan.items);
    expect(all).toContainEqual({ from: "ms-c4s-tga", to: "sop-tga-1" });

    const withoutMilestones = dependenciesOf(plan.items.filter((item) => item.id !== "ms-c4s-tga"));
    expect(withoutMilestones).not.toContainEqual(expect.objectContaining({ from: "ms-c4s-tga" }));
  });

  it("kennt Vorgänger und Nachfolger des gewählten Eintrags", () => {
    const dependencies = dependenciesOf(plan.items);
    expect(relatedTo(dependencies, "sop-etgl-1")).toEqual(new Set(["ms-etgl-c4s", "ms-etgl-0"]));
    expect(relatedTo(dependencies, "ms-etgl-0")).toEqual(new Set(["sop-etgl-1"]));
    expect(relatedTo(dependencies, null)).toEqual(new Set());
  });

  it("blendet ohne Suche nichts ab und mit Suche alles außer den Treffern", () => {
    expect(matchesOf(plan, plan.items, "  ")).toBeNull();
    expect(dimmedOf(plan.items, null).size).toBe(0);

    const matches = matchesOf(plan, plan.items, "iaa");
    expect(matches).toEqual(new Set(["fair-iaa-26", "fair-iaa-28", "fair-iaa-30"]));
    expect(dimmedOf(plan.items, matches).size).toBe(plan.items.length - 3);
  });

  it("ordnet die Treffer zeitlich", () => {
    expect(orderedMatches(plan.items, matchesOf(plan, plan.items, "iaa"))).toEqual([
      "fair-iaa-26",
      "fair-iaa-28",
      "fair-iaa-30",
    ]);
  });

  it("führt die Tastatur Ebene für Ebene und zuletzt über die Stichtage", () => {
    const rows = focusRowsOf(plan.lanes, plan.items);
    expect(rows).toHaveLength(4);
    expect(rows[0][0]).toBe("fair-bauma-25");
    expect(rows[3]).toEqual(["dl-co2-15", "dl-direct-vision", "dl-euro7", "dl-co2-45"]);
  });

  it("lässt ausgeblendete Ebenen und leere Zeilen aus", () => {
    const rows = focusRowsOf([plan.lanes[0]], plan.items.filter((item) => item.kind !== "deadline"));
    expect(rows).toHaveLength(1);
    expect(rows[0].every((id) => id.startsWith("fair-"))).toBe(true);
  });
});
