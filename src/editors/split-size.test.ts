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

import {
  clampSize,
  forgetSize,
  keyboardSize,
  readStoredSize,
  splitBounds,
  storeSize,
} from "./split-size";

describe("splitBounds", () => {
  it("lässt dem anderen Bereich seine Reserve", () => {
    expect(splitBounds(800, 160, 220)).toEqual({ min: 160, max: 580 });
  });

  it("fällt nie unter das Minimum, auch wenn der Platz nicht reicht", () => {
    expect(splitBounds(300, 160, 220)).toEqual({ min: 160, max: 160 });
  });

  it("kennt ohne gemessenen Platz keine Obergrenze", () => {
    expect(splitBounds(null, 160, 220)).toEqual({ min: 160, max: Infinity });
  });
});

describe("clampSize", () => {
  it.each([
    [100, 160],
    [300, 300],
    [900, 580],
  ])("klemmt %p auf %p", (size, expected) => {
    expect(clampSize(size, { min: 160, max: 580 })).toBe(expected);
  });
});

describe("keyboardSize", () => {
  const bounds = { min: 160, max: 580 };

  it.each([
    ["ArrowDown", false, 316],
    ["ArrowRight", false, 316],
    ["ArrowUp", false, 284],
    ["ArrowLeft", false, 284],
    ["ArrowDown", true, 364],
    ["ArrowUp", true, 236],
    ["Home", false, 160],
    ["End", false, 580],
  ])("macht aus 300 mit %s (Shift: %p) %p", (key, shift, expected) => {
    expect(keyboardSize(300, key, shift, bounds)).toBe(expected);
  });

  it("bleibt in den Grenzen", () => {
    expect(keyboardSize(170, "ArrowUp", true, bounds)).toBe(160);
    expect(keyboardSize(570, "ArrowDown", true, bounds)).toBe(580);
  });

  it("überlässt andere Tasten dem Browser", () => {
    expect(keyboardSize(300, "Enter", false, bounds)).toBeNull();
  });

  it("springt ohne bekannte Obergrenze nicht ins Unendliche", () => {
    expect(
      keyboardSize(300, "End", false, { min: 160, max: Infinity }),
    ).toBeNull();
  });
});

describe("gemerkte Größen", () => {
  afterEach(() => window.localStorage.clear());

  it("merkt sich eine Größe unter dem Präfix des Widgets", () => {
    storeSize("preview-height", 312.4);
    expect(
      window.localStorage.getItem(
        "project-timeline-widget:editor:preview-height",
      ),
    ).toBe("312");
    expect(readStoredSize("preview-height")).toBe(312);
  });

  it("vergisst eine Größe wieder", () => {
    storeSize("list-width", 400);
    forgetSize("list-width");
    expect(readStoredSize("list-width")).toBeNull();
  });

  it("nimmt Unsinn im Speicher nicht als Größe", () => {
    window.localStorage.setItem(
      "project-timeline-widget:editor:list-width",
      "breit",
    );
    expect(readStoredSize("list-width")).toBeNull();
  });

  it("kommt ohne Speicher aus", () => {
    const getItem = jest
      .spyOn(Storage.prototype, "getItem")
      .mockImplementation(() => {
        throw new Error("gesperrt");
      });
    const setItem = jest
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new Error("gesperrt");
      });
    expect(readStoredSize("list-width")).toBeNull();
    expect(() => storeSize("list-width", 400)).not.toThrow();
    getItem.mockRestore();
    setItem.mockRestore();
  });
});
