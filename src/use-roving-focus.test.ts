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

import { moveFocus } from "./use-roving-focus";

const rows = [
  ["a1", "a2", "a3"],
  ["b1", "b2"],
  ["c1"],
];
const days: Record<string, number> = { a1: 0, a2: 10, a3: 20, b1: 2, b2: 19, c1: 11 };
const dayOf = (id: string) => days[id];

describe("moveFocus", () => {
  it.each([
    ["a1", "ArrowRight", "a2"],
    ["a3", "ArrowRight", null],
    ["a2", "ArrowLeft", "a1"],
    ["a1", "ArrowLeft", null],
    ["a2", "Home", "a1"],
    ["a1", "End", "a3"],
    ["a3", "ArrowDown", "b2"],
    ["a1", "ArrowDown", "b1"],
    ["b2", "ArrowDown", "c1"],
    ["c1", "ArrowDown", null],
    ["c1", "ArrowUp", "b2"],
    ["b1", "ArrowUp", "a1"],
    ["a1", "ArrowUp", null],
    ["a1", "Enter", null],
    ["unbekannt", "ArrowRight", null],
  ])("von %s mit %s nach %p", (from, key, expected) => {
    expect(moveFocus(rows, from, key, dayOf)).toBe(expected);
  });
});
