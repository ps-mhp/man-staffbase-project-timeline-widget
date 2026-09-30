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
 * Termine als Text.
 *
 * Das Format folgt der Sprache der Seite; die Bedienelemente des Widgets
 * sprechen Deutsch, wie in allen Widgets dieses Repos. Formatiert wird in
 * UTC, weil ein {@link DayNumber} UTC-Mitternacht meint — in der Zone der
 * Leser:innen formatiert, stünde westlich von Greenwich der Vortag da.
 */

import { DayNumber, partsFromDay } from "./calendar";

const MS_PER_DAY = 86_400_000;

const FALLBACK_LOCALE = "de-DE";

/**
 * Macht aus der Staffbase-Sprache (`de_DE`) eine Intl-Sprache (`de-DE`).
 * Was Intl nicht kennt, wird Deutsch.
 */
export function intlLocale(contentLanguage: string | undefined): string {
  const candidate = (contentLanguage ?? "").trim().replace(/_/g, "-");
  if (candidate === "") return FALLBACK_LOCALE;
  try {
    return Intl.DateTimeFormat.supportedLocalesOf([candidate])[0] ?? FALLBACK_LOCALE;
  } catch {
    return FALLBACK_LOCALE;
  }
}

const formatters = new Map<string, Intl.DateTimeFormat>();

function formatter(locale: string, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  const key = `${locale}|${JSON.stringify(options)}`;
  let cached = formatters.get(key);
  if (cached === undefined) {
    cached = new Intl.DateTimeFormat(locale, { ...options, timeZone: "UTC" });
    formatters.set(key, cached);
  }
  return cached;
}

const asDate = (day: DayNumber): Date => new Date(Math.floor(day) * MS_PER_DAY);

/** „1. Oktober 2025". */
export function formatDate(day: DayNumber, locale: string): string {
  return formatter(locale, { day: "numeric", month: "long", year: "numeric" }).format(asDate(day));
}

/** „01.10.2025". */
export function formatShortDate(day: DayNumber, locale: string): string {
  return formatter(locale, { day: "2-digit", month: "2-digit", year: "numeric" }).format(asDate(day));
}

/** „Oktober 2025". */
export function formatMonthYear(day: DayNumber, locale: string): string {
  return formatter(locale, { month: "long", year: "numeric" }).format(asDate(day));
}

/** „Okt." bzw. „Oct" — die Beschriftung einer Monatszelle. */
export function formatShortMonth(day: DayNumber, locale: string): string {
  return formatter(locale, { month: "short" }).format(asDate(day));
}

const plural = (count: number, one: string, many: string): string => `${count} ${count === 1 ? one : many}`;

/**
 * Die Dauer eines Zeitraums, beide Tage eingeschlossen: „2 Jahre 6 Monate",
 * „3 Wochen", „1 Tag". Ganze Monate zählen, sobald der Zeitraum mindestens
 * einen umfasst; darunter Wochen, darunter Tage.
 */
export function formatDuration(start: DayNumber, endInclusive: DayNumber): string {
  const first = partsFromDay(start);
  const after = partsFromDay(endInclusive + 1);
  let months = (after.year - first.year) * 12 + (after.month - first.month);
  if (after.day < first.day) months -= 1;

  if (months >= 1) {
    const years = Math.floor(months / 12);
    const rest = months % 12;
    const parts: string[] = [];
    if (years > 0) parts.push(plural(years, "Jahr", "Jahre"));
    if (rest > 0) parts.push(plural(rest, "Monat", "Monate"));
    return parts.join(" ");
  }

  const days = endInclusive - start + 1;
  if (days >= 7 && days % 7 === 0) return plural(days / 7, "Woche", "Wochen");
  return plural(days, "Tag", "Tage");
}
