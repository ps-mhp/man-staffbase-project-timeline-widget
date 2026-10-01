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

import { Box, popoverPosition } from "./popover-position";

const bounds: Box = { top: 0, right: 1000, bottom: 800, left: 0 };
const anchorAt = (top: number, left = 400, width = 200, height = 32): Box => ({
  top,
  bottom: top + height,
  left,
  right: left + width,
});

describe("popoverPosition", () => {
  it("steht unter dem Anker, wenn dort Platz ist", () => {
    expect(
      popoverPosition({
        anchor: anchorAt(100),
        size: { width: 280, height: 290 },
        bounds,
        align: "start",
      }),
    ).toEqual({
      top: 136,
      left: 400,
      side: "below",
    });
  });

  it("kippt nach oben, wenn es unten nicht passt, oben aber schon", () => {
    const position = popoverPosition({
      anchor: anchorAt(600),
      size: { width: 280, height: 290 },
      bounds,
      align: "start",
    });
    expect(position).toEqual({ top: 306, left: 400, side: "above" });
  });

  it("richtet am Knopf die rechten Kanten aneinander aus", () => {
    const position = popoverPosition({
      anchor: anchorAt(100, 700, 28),
      size: { width: 240, height: 100 },
      bounds,
      align: "end",
    });
    expect(position.left).toBe(728 - 240);
  });

  it("bleibt seitlich in der Fläche", () => {
    expect(
      popoverPosition({
        anchor: anchorAt(100, 900),
        size: { width: 280, height: 100 },
        bounds,
        align: "start",
      }).left,
    ).toBe(712);
    expect(
      popoverPosition({
        anchor: anchorAt(100, 10, 28),
        size: { width: 240, height: 100 },
        bounds,
        align: "end",
      }).left,
    ).toBe(8);
  });

  it("begrenzt die Höhe auf der größeren Seite, wenn es nirgends ganz passt", () => {
    const small: Box = { top: 0, right: 1000, bottom: 400, left: 0 };
    const position = popoverPosition({
      anchor: anchorAt(150),
      size: { width: 280, height: 500 },
      bounds: small,
      align: "start",
    });
    expect(position).toEqual({
      top: 186,
      left: 400,
      side: "below",
      maxHeight: 400 - 8 - 186,
    });
  });
});
