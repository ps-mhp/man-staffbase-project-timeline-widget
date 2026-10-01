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

import { comboboxOptions, findMatch, resolveTyped } from "./combobox-options";

const suggestions = [
  { value: "TG Assist MY26", count: 3 },
  { value: "eTGL", count: 4 },
  { value: "Série Été", count: 1 },
];

describe("findMatch", () => {
  it("findet ohne Rücksicht auf Groß- und Kleinschreibung", () => {
    expect(findMatch("TG Assist MY26", "assist")).toEqual([3, 9]);
  });

  it("findet ohne Rücksicht auf Akzente und trifft die ursprünglichen Zeichen", () => {
    expect(findMatch("Série Été", "ete")).toEqual([6, 9]);
  });

  it("meldet nichts ohne Treffer oder ohne Suche", () => {
    expect(findMatch("eTGL", "xyz")).toBeNull();
    expect(findMatch("eTGL", "  ")).toBeNull();
  });
});

describe("comboboxOptions", () => {
  it("zeigt vor dem Tippen alle Vorschläge, mit „Keine Serie“, wenn eine gesetzt ist", () => {
    expect(
      comboboxOptions("eTGL", false, "eTGL", suggestions).map((o) => o.type),
    ).toEqual(["none", "existing", "existing", "existing"]);
    expect(comboboxOptions("", false, "", suggestions)[0].type).toBe(
      "existing",
    );
  });

  it("filtert beim Tippen und bietet einen neuen Namen an", () => {
    expect(comboboxOptions("tg", true, "", suggestions)).toEqual([
      { type: "create", value: "tg" },
      { type: "existing", value: "TG Assist MY26", count: 3, match: [0, 2] },
      { type: "existing", value: "eTGL", count: 4, match: [1, 3] },
    ]);
  });

  it("bietet keinen neuen Namen an, wenn es ihn schon gibt", () => {
    expect(comboboxOptions(" etgl ", true, "", suggestions)).toEqual([
      { type: "existing", value: "eTGL", count: 4, match: [0, 4] },
    ]);
  });
});

describe("resolveTyped", () => {
  it("entfernt bei leerem Text", () => {
    expect(resolveTyped("  ", suggestions)).toBe("");
  });

  it("übernimmt einen vorhandenen Namen in seiner Schreibweise", () => {
    expect(resolveTyped("etgl", suggestions)).toBe("eTGL");
  });

  it("legt einen neuen Namen getrimmt an", () => {
    expect(resolveTyped("  Neue Serie ", suggestions)).toBe("Neue Serie");
  });
});
