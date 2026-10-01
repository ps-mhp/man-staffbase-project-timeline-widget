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
 * Ein kleiner Plan für die Tests der Editor-Komponenten: zwei Ebenen, zwei
 * Kategorien, je Art ein Eintrag, Serien und Abhängigkeiten. Nur für Tests;
 * der Build nimmt ihn nicht mit, weil ihn keine Komponente importiert.
 */

import { Plan, PlanItem } from "../plan-model";

export function testPlan(): Plan {
  return {
    version: 1,
    updatedAt: "2024-11-27",
    lanes: [
      { id: "l1", title: "Messen" },
      { id: "l2", title: "SOPs" },
    ],
    categories: [
      { id: "c1", title: "General", color: "#E40045", symbol: "square" },
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
        series: "Messen 2025",
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
        series: "TMS",
        dependsOn: ["m1"],
      },
      {
        id: "d1",
        kind: "deadline",
        category: "c1",
        title: "Euro 7",
        date: "2027-07-01",
      },
      {
        id: "m2",
        kind: "milestone",
        lane: "l2",
        title: "SOP",
        date: "2026-01-15",
        series: "TG Assist",
      },
    ],
  };
}

export function findItem(plan: Plan, id: string): PlanItem {
  const item = plan.items.find((entry) => entry.id === id);
  if (item === undefined) throw new Error(`Kein Eintrag ${id}`);
  return item;
}
