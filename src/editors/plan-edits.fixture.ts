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
 * Der Plan, an dem die Tests von `plan-edits.ts` arbeiten, und was sie dazu
 * brauchen. Kein Test selbst; geteilt von `plan-edits.test.ts` und
 * `plan-edits.structure.test.ts`.
 */

import { encodePlanAttribute, Plan, PlanItem, readPlanAttribute } from "../plan-model";

// Lokale Mitternacht, weil `todayIso` das Datum an der Uhr der Redaktion abliest.
export const NOW = new Date(2026, 8, 30);
export const TODAY = "2026-09-30";

export const basePlan = (): Plan => ({
  version: 1,
  updatedAt: "2024-11-27",
  lanes: [
    { id: "l1", title: "Messen" },
    { id: "l2", title: "SOPs" },
  ],
  categories: [
    { id: "c1", title: "General", color: "#E40045" },
    { id: "c2", title: "TMS", color: "#91B900" },
  ],
  items: [
    {
      id: "m1",
      kind: "milestone",
      lane: "l1",
      category: "c1",
      title: "Bauma",
      date: "2025-04-07",
      symbol: "square",
      series: "Messen",
    },
    {
      id: "b1",
      kind: "bar",
      lane: "l2",
      category: "c2",
      title: "TMS1",
      start: "2028-01-01",
      end: "2030-06-30",
      arrow: true,
      dependsOn: ["m1"],
    },
    { id: "d1", kind: "deadline", category: "c1", title: "Euro 7", date: "2027-07-01" },
    { id: "m2", kind: "milestone", lane: "l2", title: "SOP", date: "2026-01-15", dependsOn: ["m1", "b1"] },
  ],
});

export const itemById = (plan: Plan, id: string): PlanItem | undefined => plan.items.find((item) => item.id === id);

/** Das Modell bleibt gültig: was der Editor schreibt, liest das Widget ohne Verlust zurück. */
export const expectReadable = (plan: Plan): void => {
  const { plan: back, dropped } = readPlanAttribute(encodePlanAttribute(plan));
  expect(dropped).toBe(0);
  expect(back).toEqual(plan);
};

