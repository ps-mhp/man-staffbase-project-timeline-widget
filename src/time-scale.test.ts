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

import { Viewport, dayFromParts } from "./calendar";
import { formatShortMonth } from "./format";
import {
  MAX_PX_PER_DAY,
  MIN_CELL_PX,
  axisTiers,
  chooseUnits,
  clampViewport,
  createScale,
  describeViewport,
  padViewport,
  unpadViewport,
  panViewport,
  viewportFromView,
  worldFromExtent,
  worldFromPeriod,
  zoomViewport,
} from "./time-scale";

const d = dayFromParts;

/** Der Plan der Vorlage: 2025 bis 2031, auf ganze Quartale gerundet. */
const WORLD: Viewport = { start: d(2025, 1, 1), end: d(2032, 1, 1) };
const WIDTH = 1000;
/** Die schmalste Spanne bei 1000 px: 25 Tage. */
const MIN_SPAN = WIDTH / MAX_PX_PER_DAY;

const span = (viewport: Viewport): number => viewport.end - viewport.start;

describe("createScale", () => {
  it("rechnet Tage in Pixel und zurück", () => {
    const scale = createScale({ start: 100, end: 200 }, 500);
    expect(scale.pxPerDay).toBe(5);
    expect(scale.x(100)).toBe(0);
    expect(scale.x(150)).toBe(250);
    expect(scale.x(200)).toBe(500);
    expect(scale.dayAt(250)).toBe(150);
    expect(scale.dayAt(scale.x(123.25))).toBeCloseTo(123.25);
  });

  it("teilt ungemessen nicht durch null", () => {
    const scale = createScale({ start: 100, end: 200 }, 0);
    expect(scale.pxPerDay).toBe(0);
    expect(scale.x(150)).toBe(0);
    expect(scale.dayAt(40)).toBe(100);
  });
});

describe("chooseUnits", () => {
  // Die Schwellen ergeben sich aus MIN_CELL_PX und der Nennlänge der Einheit.
  const threshold = (days: number): number => MIN_CELL_PX / days;

  it.each([
    [MAX_PX_PER_DAY, "day", "month"],
    [threshold(1), "day", "month"],
    [threshold(1) - 0.01, "week", "month"],
    [threshold(7), "week", "month"],
    [threshold(7) - 0.01, "month", "year"],
    [threshold(365.25 / 12), "month", "year"],
    [threshold(365.25 / 12) - 0.01, "quarter", "year"],
    [threshold(365.25 / 4), "quarter", "year"],
    [threshold(365.25 / 4) - 0.01, "year", null],
    [threshold(365.25), "year", null],
    // Reicht selbst das Jahr nicht, bleibt es beim Jahr — gröber wird die Achse nicht.
    [0.001, "year", null],
    [0, "year", null],
  ])("wählt bei %p px je Tag unten %p und oben %p", (pxPerDay, lower, upper) => {
    expect(chooseUnits(pxPerDay)).toEqual({ lower, upper });
  });
});

describe("axisTiers", () => {
  it("beschriftet Jahre, ohne obere Stufe", () => {
    const viewport = { start: d(2025, 1, 1), end: d(2028, 1, 1) };
    const scale = createScale(viewport, 100);
    const tiers = axisTiers(scale, "de-DE");

    expect(tiers.upper).toBeNull();
    expect(tiers.lower.unit).toBe("year");
    expect(tiers.lower.cells.map((cell) => cell.label)).toEqual(["2025", "2026", "2027"]);
    const [first, second] = tiers.lower.cells;
    expect(first.start).toBe(d(2025, 1, 1));
    expect(first.end).toBe(d(2026, 1, 1));
    expect(first.x).toBe(0);
    expect(first.width).toBeCloseTo(365 * scale.pxPerDay);
    expect(second.x).toBeCloseTo(first.width);
  });

  it("beschriftet Quartale, darüber das Jahr", () => {
    const scale = createScale({ start: d(2025, 1, 1), end: d(2026, 1, 1) }, 200);
    const tiers = axisTiers(scale, "de-DE");

    expect(tiers.lower.unit).toBe("quarter");
    expect(tiers.lower.cells.map((cell) => cell.label)).toEqual(["Q1", "Q2", "Q3", "Q4"]);
    expect(tiers.lower.cells[1].start).toBe(d(2025, 4, 1));
    expect(tiers.upper).toEqual({
      unit: "year",
      cells: [{ start: d(2025, 1, 1), end: d(2026, 1, 1), label: "2025", x: 0, width: 200 }],
    });
  });

  it("beschriftet Monate in der Sprache der Seite, darüber das Jahr", () => {
    const scale = createScale({ start: d(2025, 1, 1), end: d(2026, 1, 1) }, 600);
    const tiers = axisTiers(scale, "de-DE");

    expect(tiers.lower.unit).toBe("month");
    expect(tiers.lower.cells).toHaveLength(12);
    expect(tiers.lower.cells[2].label).toBe(formatShortMonth(d(2025, 3, 1), "de-DE"));
    expect(tiers.lower.cells[2].end).toBe(d(2025, 4, 1));
    expect(tiers.upper?.cells.map((cell) => cell.label)).toEqual(["2025"]);
  });

  it("zählt ISO-Wochen über den Jahreswechsel, darüber die Monate", () => {
    // 2020 hat 53 ISO-Wochen; der 04.01.2021 beginnt KW 1.
    const scale = createScale({ start: d(2020, 12, 21), end: d(2021, 1, 18) }, 400);
    const tiers = axisTiers(scale, "de-DE");

    expect(tiers.lower.unit).toBe("week");
    expect(tiers.lower.cells.map((cell) => cell.label)).toEqual(["KW 52", "KW 53", "KW 1", "KW 2"]);
    expect(tiers.lower.cells.map((cell) => cell.start)).toEqual([
      d(2020, 12, 21),
      d(2020, 12, 28),
      d(2021, 1, 4),
      d(2021, 1, 11),
    ]);
    expect(tiers.upper?.unit).toBe("month");
    expect(tiers.upper?.cells.map((cell) => cell.label)).toEqual(["Dezember 2020", "Januar 2021"]);
  });

  it("nennt die Woche außerhalb des Deutschen „W“", () => {
    const scale = createScale({ start: d(2020, 12, 21), end: d(2021, 1, 18) }, 400);
    expect(axisTiers(scale, "en-US").lower.cells.map((cell) => cell.label)).toEqual([
      "W 52",
      "W 53",
      "W 1",
      "W 2",
    ]);
  });

  it("beschriftet Tage, darüber den Monat", () => {
    const scale = createScale({ start: d(2025, 3, 1), end: d(2025, 3, 11) }, 400);
    const tiers = axisTiers(scale, "de-DE");

    expect(tiers.lower.unit).toBe("day");
    expect(tiers.lower.cells.map((cell) => cell.label)).toEqual(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]);
    expect(tiers.lower.cells[3]).toMatchObject({ start: d(2025, 3, 4), end: d(2025, 3, 5), x: 120, width: 40 });
    expect(tiers.upper?.cells.map((cell) => cell.label)).toEqual(["März 2025"]);
  });

  it("nimmt angeschnittene Zellen an beiden Rändern mit", () => {
    // Mittwoch bis Mittwoch: die erste und die letzte Woche ragen hinaus.
    const scale = createScale({ start: d(2025, 1, 8) + 0.5, end: d(2025, 2, 5) + 0.5 }, 400);
    const cells = axisTiers(scale, "de-DE").lower.cells;

    expect(cells[0].start).toBe(d(2025, 1, 6));
    expect(cells[0].x).toBeLessThan(0);
    expect(cells[cells.length - 1].start).toBe(d(2025, 2, 3));
    expect(cells[cells.length - 1].x + cells[cells.length - 1].width).toBeGreaterThan(400);
  });

  it("lässt die Zelle weg, die erst am exklusiven Ende beginnt", () => {
    const scale = createScale({ start: d(2025, 1, 1), end: d(2025, 4, 1) }, 300);
    const cells = axisTiers(scale, "de-DE").lower.cells;
    expect(cells[cells.length - 1].start).toBe(d(2025, 3, 1));
  });

  it.each([7, 30, 200, 900, 2557])("bleibt bei %p Tagen auf 1000 px bei wenigen Zellen", (days) => {
    const scale = createScale({ start: d(2025, 1, 1) + 0.3, end: d(2025, 1, 1) + 0.3 + days }, 1000);
    const tiers = axisTiers(scale, "de-DE");
    // Kurze Monate (Februar) werden etwas schmaler als MIN_CELL_PX; der Puffer deckt sie.
    expect(tiers.lower.cells.length).toBeLessThanOrEqual(Math.ceil(1000 / 30) + 2);
    expect(tiers.upper?.cells.length ?? 0).toBeLessThanOrEqual(tiers.lower.cells.length);
  });
});

describe("worldFromExtent", () => {
  it("rundet auf ganze Quartale", () => {
    expect(worldFromExtent({ start: d(2025, 2, 10), end: d(2031, 11, 5) })).toEqual({
      start: d(2025, 1, 1),
      end: d(2032, 1, 1),
    });
  });

  it("schließt den letzten Tag eines Quartals ein, ohne ein weiteres anzuhängen", () => {
    expect(worldFromExtent({ start: d(2025, 1, 1), end: d(2025, 3, 31) })).toEqual({
      start: d(2025, 1, 1),
      end: d(2025, 4, 1),
    });
    expect(worldFromExtent({ start: d(2025, 4, 1), end: d(2025, 4, 1) })).toEqual({
      start: d(2025, 4, 1),
      end: d(2025, 7, 1),
    });
  });
});

describe("worldFromPeriod", () => {
  it("macht aus dem eingeschlossenen Ende ein exklusives", () => {
    expect(worldFromPeriod({ start: d(2026, 1, 1), end: d(2026, 6, 30) })).toEqual({
      start: d(2026, 1, 1),
      end: d(2026, 7, 1),
    });
  });
});

describe("clampViewport", () => {
  it("lässt einen gültigen Ausschnitt, wie er ist", () => {
    const viewport = { start: d(2026, 1, 1), end: d(2027, 1, 1) };
    expect(clampViewport(viewport, WORLD, WIDTH)).toEqual(viewport);
  });

  it("zoomt nicht weiter hinein als MAX_PX_PER_DAY, um die Mitte", () => {
    const center = d(2026, 6, 1);
    const result = clampViewport({ start: center - 2, end: center + 2 }, WORLD, WIDTH);
    expect(span(result)).toBeCloseTo(MIN_SPAN);
    expect((result.start + result.end) / 2).toBeCloseTo(center);
  });

  it("zoomt nicht weiter hinaus als die Welt", () => {
    expect(clampViewport({ start: d(2020, 1, 1), end: d(2040, 1, 1) }, WORLD, WIDTH)).toEqual(WORLD);
  });

  it("schiebt einen Ausschnitt links außerhalb in die Welt, ohne ihn zu verbreitern", () => {
    const result = clampViewport({ start: d(2024, 7, 1), end: d(2025, 7, 1) }, WORLD, WIDTH);
    expect(result.start).toBe(WORLD.start);
    expect(span(result)).toBe(d(2025, 7, 1) - d(2024, 7, 1));
  });

  it("schiebt einen Ausschnitt rechts außerhalb in die Welt", () => {
    const result = clampViewport({ start: d(2031, 7, 1), end: d(2032, 7, 1) }, WORLD, WIDTH);
    expect(result.end).toBe(WORLD.end);
    expect(span(result)).toBe(d(2032, 7, 1) - d(2031, 7, 1));
  });

  it("zeigt eine Welt, die schmaler als die Mindestspanne ist, mittig mit der Mindestspanne", () => {
    const world = { start: d(2025, 1, 1), end: d(2025, 1, 11) };
    const result = clampViewport({ start: d(2025, 1, 3), end: d(2025, 1, 5) }, world, WIDTH);
    expect(span(result)).toBeCloseTo(MIN_SPAN);
    expect((result.start + result.end) / 2).toBeCloseTo(d(2025, 1, 6));
  });

  it("macht aus einem leeren oder kaputten Ausschnitt die Welt", () => {
    expect(clampViewport({ start: 10, end: 10 }, WORLD, WIDTH)).toEqual(WORLD);
    expect(clampViewport({ start: NaN, end: 10 }, WORLD, WIDTH)).toEqual(WORLD);
  });
});

describe("zoomViewport", () => {
  const viewport = { start: d(2026, 1, 1), end: d(2028, 1, 1) };

  it("hält den Ankertag an derselben Bildschirmstelle", () => {
    const anchor = d(2026, 9, 15);
    const before = createScale(viewport, WIDTH).x(anchor);
    const zoomed = zoomViewport(viewport, 2, anchor, WORLD, WIDTH);

    expect(span(zoomed)).toBeCloseTo(span(viewport) / 2);
    expect(createScale(zoomed, WIDTH).x(anchor)).toBeCloseTo(before);
  });

  it("zoomt mit einem Faktor unter 1 hinaus, ebenfalls um den Anker", () => {
    const anchor = d(2027, 2, 1);
    const before = createScale(viewport, WIDTH).x(anchor);
    const zoomed = zoomViewport(viewport, 1 / 1.5, anchor, WORLD, WIDTH);

    expect(span(zoomed)).toBeCloseTo(span(viewport) * 1.5);
    expect(createScale(zoomed, WIDTH).x(anchor)).toBeCloseTo(before);
  });

  it("bleibt an der Höchstvergrößerung stehen, der Anker weiter am Platz", () => {
    const anchor = d(2027, 1, 1) + 0.5;
    const before = createScale(viewport, WIDTH).x(anchor);
    const zoomed = zoomViewport(viewport, 1000, anchor, WORLD, WIDTH);

    expect(span(zoomed)).toBeCloseTo(MIN_SPAN);
    expect(createScale(zoomed, WIDTH).pxPerDay).toBeCloseTo(MAX_PX_PER_DAY);
    expect(createScale(zoomed, WIDTH).x(anchor)).toBeCloseTo(before);
  });

  it("zoomt nicht über die Welt hinaus", () => {
    expect(zoomViewport(viewport, 0.001, d(2027, 1, 1), WORLD, WIDTH)).toEqual(WORLD);
  });

  it("schiebt beim Hinauszoomen am Rand in die Welt zurück", () => {
    const edge = { start: WORLD.start, end: WORLD.start + 100 };
    const zoomed = zoomViewport(edge, 0.5, WORLD.start + 90, WORLD, WIDTH);
    expect(zoomed.start).toBe(WORLD.start);
    expect(span(zoomed)).toBeCloseTo(200);
  });
});

describe("panViewport", () => {
  const viewport = { start: d(2026, 1, 1), end: d(2027, 1, 1) };

  it("verschiebt um die Tage, ohne die Spanne zu ändern", () => {
    expect(panViewport(viewport, 31, WORLD, WIDTH)).toEqual({ start: viewport.start + 31, end: viewport.end + 31 });
    expect(panViewport(viewport, -10.5, WORLD, WIDTH)).toEqual({
      start: viewport.start - 10.5,
      end: viewport.end - 10.5,
    });
  });

  it("hält am Rand der Welt an", () => {
    const left = panViewport(viewport, -10_000, WORLD, WIDTH);
    expect(left).toEqual({ start: WORLD.start, end: WORLD.start + span(viewport) });

    const right = panViewport(viewport, 10_000, WORLD, WIDTH);
    expect(right).toEqual({ start: WORLD.end - span(viewport), end: WORLD.end });
  });
});

describe("viewportFromView", () => {
  it("macht aus der Startansicht (Monate eingeschlossen) einen Ausschnitt", () => {
    expect(viewportFromView({ start: "2026-01", end: "2026-12" }, WORLD, WIDTH)).toEqual({
      start: d(2026, 1, 1),
      end: d(2027, 1, 1),
    });
  });

  it("zeigt ohne Startansicht die Welt", () => {
    expect(viewportFromView(undefined, WORLD, WIDTH)).toEqual(WORLD);
  });

  it("zeigt die Welt, wenn die Startansicht ganz außerhalb liegt oder unlesbar ist", () => {
    expect(viewportFromView({ start: "2040-01", end: "2041-06" }, WORLD, WIDTH)).toEqual(WORLD);
    expect(viewportFromView({ start: "2020-01", end: "2024-12" }, WORLD, WIDTH)).toEqual(WORLD);
    expect(viewportFromView({ start: "kaputt", end: "2026-12" }, WORLD, WIDTH)).toEqual(WORLD);
  });

  it("schneidet eine teils überstehende Startansicht auf die Welt zu", () => {
    expect(viewportFromView({ start: "2030-01", end: "2033-12" }, WORLD, WIDTH)).toEqual({
      start: d(2030, 1, 1),
      end: WORLD.end,
    });
  });

  it("verträgt vertauschte Monate", () => {
    expect(viewportFromView({ start: "2026-12", end: "2026-01" }, WORLD, WIDTH)).toEqual({
      start: d(2026, 1, 1),
      end: d(2027, 1, 1),
    });
  });

  it("weitet eine zu kurze Startansicht auf die Mindestspanne", () => {
    const result = viewportFromView({ start: "2026-02", end: "2026-02" }, WORLD, 2000);
    expect(span(result)).toBeCloseTo(2000 / MAX_PX_PER_DAY);
  });
});

describe("describeViewport", () => {
  it("nennt den ersten und den letzten sichtbaren Monat", () => {
    expect(describeViewport(WORLD, "de-DE")).toBe("Januar 2025 bis Dezember 2031");
  });

  it("rechnet mit dem letzten Tag, den der Ausschnitt noch berührt", () => {
    expect(describeViewport({ start: d(2025, 1, 31) + 0.5, end: d(2025, 3, 1) + 0.25 }, "de-DE")).toBe(
      "Januar 2025 bis März 2025",
    );
    expect(describeViewport({ start: d(2025, 1, 1), end: d(2025, 3, 1) }, "de-DE")).toBe(
      "Januar 2025 bis Februar 2025",
    );
  });

  it("nennt einen einzigen Monat nur einmal", () => {
    expect(describeViewport({ start: d(2025, 3, 3), end: d(2025, 3, 20) }, "de-DE")).toBe("März 2025");
  });
});

describe("padViewport", () => {
  it("lässt bei der gegebenen Breite genau den Rand in Pixeln", () => {
    const padded = padViewport({ start: 0, end: 1000 }, 1032, 16);
    const scale = createScale(padded, 1032);
    expect(scale.x(0)).toBeCloseTo(16);
    expect(scale.x(1000)).toBeCloseTo(1016);
  });

  it("hebt sich mit `unpadViewport` auf", () => {
    const view = { start: 100, end: 1200 };
    const back = unpadViewport(padViewport(view, 900), 900);
    expect(back.start).toBeCloseTo(view.start);
    expect(back.end).toBeCloseTo(view.end);
  });

  it("lässt einen Ausschnitt in einer zu schmalen Fläche unverändert", () => {
    expect(padViewport({ start: 0, end: 10 }, 20, 16)).toEqual({ start: 0, end: 10 });
  });
});
