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
 * Rechnen mit Kalendertagen.
 *
 * Ein Termin im Plan ist ein Kalendertag ohne Uhrzeit und ohne Zeitzone. Als
 * `Date` behandelt, verschöbe ihn die Zeitzone der Leser:innen oder ein
 * Sommerzeitwechsel um einen Tag. Gerechnet wird deshalb in ganzen Tagen seit
 * dem 01.01.1970, ermittelt über `Date.UTC` — dort gibt es weder Zonen noch
 * Sommerzeit.
 */

/** Tage seit dem 01.01.1970. Im Plan ganzzahlig; die Skala rechnet auch mit Bruchteilen. */
export type DayNumber = number;

/** Tage einschließlich beider Enden — ein Zeitraum, wie Redaktion und Filter ihn meinen. */
export interface DayRange {
  start: DayNumber;
  end: DayNumber;
}

/**
 * Ein sichtbarer Ausschnitt der Zeitachse in Tagen, halboffen [start, end).
 * Bruchteile sind erlaubt: beim Zoomen liegt eine Kante selten auf Mitternacht.
 */
export interface Viewport {
  start: number;
  end: number;
}

const MS_PER_DAY = 86_400_000;

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const ISO_MONTH = /^(\d{4})-(\d{2})$/;

export interface DayParts {
  year: number;
  /** 1 bis 12. */
  month: number;
  day: number;
  /** 1 = Montag … 7 = Sonntag, wie in ISO 8601. */
  weekday: number;
}

export function dayFromParts(year: number, month: number, day: number): DayNumber {
  return Math.floor(Date.UTC(year, month - 1, day) / MS_PER_DAY);
}

export function partsFromDay(day: DayNumber): DayParts {
  const date = new Date(Math.floor(day) * MS_PER_DAY);
  const weekday = date.getUTCDay();
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
    weekday: weekday === 0 ? 7 : weekday,
  };
}

/**
 * Der Bereich, in dem ein Termin plausibel ist. Das Datumsfeld des Browsers
 * durchläuft beim Tippen von „2025" die Jahre 0002, 0020 und 0202 — ohne
 * Grenze würde jedes davon übernommen und die Achse für einen Augenblick
 * 1800 Jahre breit. Vor 1900 kann Excel zudem kein Datum zeigen.
 */
export const MIN_YEAR = 1900;
export const MAX_YEAR = 2199;

/**
 * Liest `JJJJ-MM-TT` streng: ein 31. Februar ist kein Datum, sondern ein
 * Tippfehler, und würde von `Date.UTC` stillschweigend in den März gerollt.
 */
export function parseIsoDate(text: string): DayNumber | null {
  const match = ISO_DATE.exec(text.trim());
  if (match === null) return null;
  const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])];
  if (year < MIN_YEAR || year > MAX_YEAR || month < 1 || month > 12 || day < 1) return null;
  const result = dayFromParts(year, month, day);
  const back = partsFromDay(result);
  return back.year === year && back.month === month && back.day === day ? result : null;
}

const pad = (value: number, length: number): string => String(value).padStart(length, "0");

export function formatIsoDate(day: DayNumber): string {
  const { year, month, day: date } = partsFromDay(day);
  return `${pad(year, 4)}-${pad(month, 2)}-${pad(date, 2)}`;
}

export interface MonthRef {
  year: number;
  /** 1 bis 12. */
  month: number;
}

/** Liest `JJJJ-MM`, wie in der Startansicht und im Zeitraum-Filter. */
export function parseIsoMonth(text: string): MonthRef | null {
  const match = ISO_MONTH.exec(text.trim());
  if (match === null) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  return month >= 1 && month <= 12 ? { year, month } : null;
}

export function formatIsoMonth({ year, month }: MonthRef): string {
  return `${pad(year, 4)}-${pad(month, 2)}`;
}

export function monthOfDay(day: DayNumber): MonthRef {
  const { year, month } = partsFromDay(day);
  return { year, month };
}

/** Der erste Tag des Monats. */
export function firstDayOfMonth({ year, month }: MonthRef): DayNumber {
  return dayFromParts(year, month, 1);
}

/** Der letzte Tag des Monats — `Date.UTC` mit Tag 0 ist der Vortag des Folgemonats. */
export function lastDayOfMonth({ year, month }: MonthRef): DayNumber {
  return dayFromParts(year, month + 1, 0);
}

export function startOfMonth(day: DayNumber): DayNumber {
  return firstDayOfMonth(monthOfDay(day));
}

export function startOfQuarter(day: DayNumber): DayNumber {
  const { year, month } = partsFromDay(day);
  return dayFromParts(year, month - ((month - 1) % 3), 1);
}

export function startOfYear(day: DayNumber): DayNumber {
  return dayFromParts(partsFromDay(day).year, 1, 1);
}

/** Der Montag der Woche, in der `day` liegt. */
export function startOfIsoWeek(day: DayNumber): DayNumber {
  const whole = Math.floor(day);
  return whole - (partsFromDay(whole).weekday - 1);
}

/**
 * Verschiebt um ganze Monate und landet immer auf einem Monatsersten.
 * Die Achse braucht nur Grenzen, keine Tagesarithmetik über Monatsenden.
 */
export function addMonths(day: DayNumber, months: number): DayNumber {
  const { year, month } = partsFromDay(day);
  return dayFromParts(year, month + months, 1);
}

/** Die Kalenderwoche nach ISO 8601: Woche 1 enthält den ersten Donnerstag. */
export function isoWeek(day: DayNumber): { year: number; week: number } {
  const thursday = startOfIsoWeek(day) + 3;
  const year = partsFromDay(thursday).year;
  const firstThursdayWeek = startOfIsoWeek(dayFromParts(year, 1, 4));
  return { year, week: Math.floor((startOfIsoWeek(day) - firstThursdayWeek) / 7) + 1 };
}

/**
 * Heute, wie die Leser:innen es an ihrer Uhr sehen: aus dem lokalen Datum,
 * nicht aus UTC — sonst stünde die Heute-Linie am Abend in New York schon
 * auf morgen.
 */
export function todayDay(now: Date = new Date()): DayNumber {
  return dayFromParts(now.getFullYear(), now.getMonth() + 1, now.getDate());
}
