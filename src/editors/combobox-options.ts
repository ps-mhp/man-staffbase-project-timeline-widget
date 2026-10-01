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
 * Die Rechnung hinter dem Auswahlfeld mit Vorschlägen: welche Optionen es
 * gibt, wo der Treffer im Namen steht, und was ein getippter Text bedeutet.
 */

import { nameKey } from "./entity-names";

export interface Suggestion {
  value: string;
  /** Wie viele Einträge diesen Wert tragen. */
  count: number;
}

export type ComboboxOption =
  | { type: "none" }
  | { type: "create"; value: string }
  | {
      type: "existing";
      value: string;
      count: number;
      match: [number, number] | null;
    };

/** Ein Zeichen ohne Akzent und klein — „É“ wird „e“. */
const fold = (char: string): string =>
  char
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

/**
 * Wo `query` in `text` steht, ohne Rücksicht auf Groß- und Kleinschreibung
 * und Akzente — als Anfang und Ende im ursprünglichen Text, damit die
 * Hervorhebung die richtigen Zeichen trifft.
 */
export function findMatch(
  text: string,
  query: string,
): [number, number] | null {
  const needle = [...query.trim()].map(fold).join("");
  if (needle === "") return null;
  const chars = [...text];
  const folded = chars.map(fold);
  for (let start = 0; start < chars.length; start += 1) {
    let joined = "";
    for (let end = start; end < chars.length; end += 1) {
      joined += folded[end];
      if (joined === needle) {
        const from = chars.slice(0, start).join("").length;
        return [from, from + chars.slice(start, end + 1).join("").length];
      }
      if (!needle.startsWith(joined)) break;
    }
  }
  return null;
}

/** Derselbe Name, nur anders geschrieben? Akzente zählen: „Série“ ist nicht „Serie“. */
const sameName = (a: string, b: string): boolean => nameKey(a) === nameKey(b);

/**
 * Die Optionen zu einem Stand des Feldes. `typed` ist wahr, sobald getippt
 * wurde — vorher zeigt das Feld alle Vorschläge, auch wenn der aktuelle Wert
 * darin steht.
 */
export function comboboxOptions(
  text: string,
  typed: boolean,
  current: string,
  suggestions: readonly Suggestion[],
): ComboboxOption[] {
  const query = typed ? text.trim() : "";
  const options: ComboboxOption[] = [];
  if (current !== "") options.push({ type: "none" });
  if (
    query !== "" &&
    !suggestions.some((entry) => sameName(entry.value, query))
  ) {
    options.push({ type: "create", value: query });
  }
  for (const entry of suggestions) {
    const match = findMatch(entry.value, query);
    if (query === "" || match !== null) {
      options.push({
        type: "existing",
        value: entry.value,
        count: entry.count,
        match,
      });
    }
  }
  return options;
}

/**
 * Was ein getippter Text bedeutet, wenn niemand einen Vorschlag gewählt hat:
 * leer entfernt den Wert, ein vorhandener Name wird in seiner Schreibweise
 * übernommen, alles andere ist ein neuer Wert.
 */
export function resolveTyped(
  text: string,
  suggestions: readonly Suggestion[],
): string {
  const trimmed = text.trim();
  if (trimmed === "") return "";
  return (
    suggestions.find((entry) => sameName(entry.value, trimmed))?.value ??
    trimmed
  );
}
