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

import { DARK_INK, LIGHT_INK, contrast, inkFor } from "./color";
import { PLAN_TEMPLATES } from "./plan-templates";

describe("inkFor", () => {
  it.each([
    ["#303C49", LIGHT_INK],
    ["#7B2FA0", LIGHT_INK],
    ["#F5B800", DARK_INK],
    ["#91B900", DARK_INK],
    ["#FFFFFF", DARK_INK],
    ["#000000", LIGHT_INK],
  ])("schreibt auf %s in %s", (background, ink) => {
    expect(inkFor(background)).toBe(ink);
  });

  it("erreicht auf jeder Farbe jeder Vorlage 4,5 : 1", () => {
    for (const { color } of PLAN_TEMPLATES.flatMap((template) => template.create().categories)) {
      expect(contrast(color, inkFor(color))).toBeGreaterThanOrEqual(4.5);
    }
  });
});
