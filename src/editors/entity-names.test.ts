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

import { nameKey, validateName } from "./entity-names";

describe("nameKey", () => {
  it("vergleicht ohne Groß- und Kleinschreibung und ohne Leerraum am Rand", () => {
    expect(nameKey("  Launches   /  SOPs ")).toBe(nameKey("launches / sops"));
  });
});

describe("validateName", () => {
  const validate = validateName("Ebene", ["Messen", "SOPs"]);

  it("verlangt einen Namen", () => {
    expect(validate("   ")).toBe("Bitte einen Namen angeben.");
  });

  it("weist einen vorhandenen Namen zurück, auch anders geschrieben", () => {
    expect(validate(" messen ")).toBe("Eine Ebene „messen“ gibt es schon.");
    expect(validateName("Kategorie", ["TMS"])("tms")).toBe(
      "Eine Kategorie „tms“ gibt es schon.",
    );
  });

  it("nimmt einen neuen Namen an", () => {
    expect(validate("Launches")).toBeNull();
  });

  it("lässt beim Umbenennen den eigenen Namen gelten", () => {
    expect(
      validateName("Ebene", ["Messen", "SOPs"], "Messen")("messen"),
    ).toBeNull();
  });
});
