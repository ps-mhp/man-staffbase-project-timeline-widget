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
 * Namen von Ebenen und Kategorien: Pflicht und eindeutig.
 *
 * Zwei Ebenen „Messen“ und „messen “ wären in den Auswahlfeldern, in der
 * Legende und im Excel-Export nicht zu unterscheiden. Verglichen wird deshalb
 * ohne Rücksicht auf Groß- und Kleinschreibung und auf Leerraum.
 */

import type { Validator } from "./draft-field";

/** Die Form, in der zwei Namen verglichen werden. */
export function nameKey(name: string): string {
  return name.trim().replace(/\s+/g, " ").toLowerCase();
}

export const NAME_REQUIRED = "Bitte einen Namen angeben.";

/**
 * Prüft einen Namen gegen die vorhandenen. `own` ist der bisherige Name beim
 * Umbenennen — er zählt nicht als Doppel.
 */
export function validateName(
  noun: "Ebene" | "Kategorie",
  existing: readonly string[],
  own?: string,
): Validator {
  const taken = new Set(
    existing.filter((name) => own === undefined || name !== own).map(nameKey),
  );
  return (text) => {
    if (text.trim() === "") return NAME_REQUIRED;
    return taken.has(nameKey(text))
      ? `Eine ${noun} „${text.trim()}“ gibt es schon.`
      : null;
  };
}
