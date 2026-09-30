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
import { encodePlanAttribute, readPlanAttribute } from "./plan-model";

describe("examplePlan", () => {
  // Ein Beispiel, das beim Lesen Einträge verlöre, zeigte im Editor gleich
  // beim ersten Öffnen die Warnung über verworfene Einträge.
  it("übersteht das Lesen ohne Verlust", () => {
    const plan = examplePlan();
    const { plan: back, dropped } = readPlanAttribute(encodePlanAttribute(plan));
    expect(dropped).toBe(0);
    expect(back).toEqual(plan);
  });

  it("enthält jede Art von Eintrag", () => {
    const kinds = new Set(examplePlan().items.map((item) => item.kind));
    expect(kinds).toEqual(new Set(["milestone", "bar", "deadline"]));
  });
});
