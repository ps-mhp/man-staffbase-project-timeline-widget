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
import { PLAN_TEMPLATES, findTemplate } from "./plan-templates";

describe("Vorlagen", () => {
  it("bietet mindestens zwei Vorlagen, die mit dem Beispielplan zuerst", () => {
    expect(PLAN_TEMPLATES.length).toBeGreaterThanOrEqual(2);
    expect(PLAN_TEMPLATES[0].create()).toEqual(examplePlan());
  });

  it("trägt je Vorlage eine eindeutige Kennung, einen Namen und eine Beschreibung", () => {
    const ids = PLAN_TEMPLATES.map((template) => template.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const template of PLAN_TEMPLATES) {
      expect(template.title.trim()).not.toBe("");
      expect(template.description.trim()).not.toBe("");
    }
  });

  it.each(PLAN_TEMPLATES.map((template) => [template.id, template] as const))(
    "übersteht mit „%s“ das Lesen ohne Verlust",
    (_id, template) => {
      // Eine Vorlage, die beim Lesen Einträge verlöre, zeigte im Editor gleich
      // nach dem Beginnen die Warnung über verworfene Einträge.
      const plan = template.create();
      const { plan: back, dropped } = readPlanAttribute(encodePlanAttribute(plan));
      expect(dropped).toBe(0);
      expect(back).toEqual(plan);
    },
  );

  it("gibt bei jedem Beginn einen frischen Plan heraus", () => {
    // Teilten sich zwei Starts ein Objekt, schlüge eine Änderung im ersten
    // Editor auf die Vorlage durch.
    for (const template of PLAN_TEMPLATES) {
      expect(template.create()).not.toBe(template.create());
      expect(template.create().items).not.toBe(template.create().items);
    }
  });

  it("findet eine Vorlage über ihre Kennung und sonst keine", () => {
    expect(findTemplate(PLAN_TEMPLATES[1].id)).toBe(PLAN_TEMPLATES[1]);
    expect(findTemplate("gibt-es-nicht")).toBeUndefined();
    expect(findTemplate(undefined)).toBeUndefined();
    expect(findTemplate("constructor")).toBeUndefined();
  });
});
