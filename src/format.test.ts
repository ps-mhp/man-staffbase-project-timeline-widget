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

import { dayFromParts, parseIsoDate } from "./calendar";
import { formatDate, formatDuration, formatMonthYear, formatShortDate, intlLocale } from "./format";

const day = (text: string): number => parseIsoDate(text) as number;

describe("format", () => {
  it.each([
    ["de_DE", "de-DE"],
    ["en_US", "en-US"],
    [undefined, "de-DE"],
    ["", "de-DE"],
    ["kein Locale !!", "de-DE"],
  ])("macht aus %p die Intl-Sprache %p", (input, expected) => {
    expect(intlLocale(input)).toBe(expected);
  });

  it("formatiert in der Sprache der Seite", () => {
    expect(formatDate(day("2025-10-01"), "de-DE")).toBe("1. Oktober 2025");
    expect(formatDate(day("2025-10-01"), "en-US")).toBe("October 1, 2025");
    expect(formatShortDate(day("2025-10-01"), "de-DE")).toBe("01.10.2025");
    expect(formatMonthYear(day("2025-10-01"), "de-DE")).toBe("Oktober 2025");
  });

  it("verschiebt keinen Tag, auch nicht am Jahresanfang", () => {
    expect(formatShortDate(dayFromParts(2026, 1, 1), "de-DE")).toBe("01.01.2026");
  });

  it.each([
    ["2028-01-01", "2030-06-30", "2 Jahre 6 Monate"],
    ["2025-01-01", "2025-12-31", "1 Jahr"],
    ["2025-01-15", "2025-02-14", "1 Monat"],
    ["2025-01-15", "2025-02-13", "30 Tage"],
    ["2025-03-03", "2025-03-23", "3 Wochen"],
    ["2025-03-03", "2025-03-03", "1 Tag"],
    ["2025-03-03", "2025-03-05", "3 Tage"],
  ])("nennt die Dauer von %s bis %s „%s“", (start, end, expected) => {
    expect(formatDuration(day(start), day(end))).toBe(expected);
  });
});
