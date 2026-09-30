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
  addMonths,
  dayFromParts,
  formatIsoDate,
  formatIsoMonth,
  isoWeek,
  lastDayOfMonth,
  parseIsoDate,
  parseIsoMonth,
  partsFromDay,
  startOfIsoWeek,
  startOfQuarter,
  startOfYear,
  todayDay,
} from "./calendar";

describe("calendar", () => {
  it("zählt Tage seit 1970", () => {
    expect(dayFromParts(1970, 1, 1)).toBe(0);
    expect(dayFromParts(1970, 1, 2)).toBe(1);
    expect(dayFromParts(1969, 12, 31)).toBe(-1);
  });

  it("liest und schreibt ISO-Daten im Rundlauf", () => {
    for (const text of ["2024-02-29", "2025-01-01", "2031-12-31", "1999-07-15"]) {
      const day = parseIsoDate(text);
      expect(day).not.toBeNull();
      expect(formatIsoDate(day as number)).toBe(text);
    }
  });

  it.each(["2025-02-29", "2025-13-01", "2025-00-10", "2025-04-31", "25-01-01", "2025-1-1", "", "0202-01-01", "1899-12-31", "2200-01-01"])(
    "verwirft %p statt es zu rollen",
    (text) => {
      expect(parseIsoDate(text)).toBeNull();
    },
  );

  it("kennt Schaltjahre", () => {
    expect(lastDayOfMonth({ year: 2024, month: 2 })).toBe(dayFromParts(2024, 2, 29));
    expect(lastDayOfMonth({ year: 2100, month: 2 })).toBe(dayFromParts(2100, 2, 28));
    expect(lastDayOfMonth({ year: 2000, month: 2 })).toBe(dayFromParts(2000, 2, 29));
  });

  it("liest Monate", () => {
    expect(parseIsoMonth("2025-07")).toEqual({ year: 2025, month: 7 });
    expect(parseIsoMonth("2025-13")).toBeNull();
    expect(formatIsoMonth({ year: 2025, month: 7 })).toBe("2025-07");
  });

  it("findet Anfänge von Quartal, Jahr und Woche", () => {
    const day = dayFromParts(2025, 8, 20); // Mittwoch
    expect(startOfQuarter(day)).toBe(dayFromParts(2025, 7, 1));
    expect(startOfYear(day)).toBe(dayFromParts(2025, 1, 1));
    expect(startOfIsoWeek(day)).toBe(dayFromParts(2025, 8, 18));
    expect(partsFromDay(startOfIsoWeek(day)).weekday).toBe(1);
  });

  it("rechnet Monate über den Jahreswechsel", () => {
    expect(addMonths(dayFromParts(2025, 11, 15), 3)).toBe(dayFromParts(2026, 2, 1));
    expect(addMonths(dayFromParts(2025, 1, 31), -1)).toBe(dayFromParts(2024, 12, 1));
  });

  it.each([
    ["2020-12-31", 2020, 53],
    ["2021-01-03", 2020, 53],
    ["2021-01-04", 2021, 1],
    ["2024-12-30", 2025, 1],
    ["2026-01-01", 2026, 1],
    ["2026-12-31", 2026, 53],
    ["2025-06-15", 2025, 24],
  ])("setzt %s in KW %i/%i", (text, year, week) => {
    expect(isoWeek(parseIsoDate(text) as number)).toEqual({ year, week });
  });

  it("nimmt für heute das lokale Datum", () => {
    // 23:30 Ortszeit am 30.09. ist in jeder Zone der 30.09. — egal, was UTC sagt.
    expect(formatIsoDate(todayDay(new Date(2026, 8, 30, 23, 30)))).toBe("2026-09-30");
    expect(formatIsoDate(todayDay(new Date(2026, 8, 30, 0, 15)))).toBe("2026-09-30");
  });
});
