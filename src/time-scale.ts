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
 * Zeit ↔ Pixel, die Grenzen des Zooms und die Stufen der Achse.
 *
 * Frei von DOM und React: Zoom um einen Ankerpunkt, Klemmen an die Welt und
 * die Wahl der Achsenstufe sind die fehleranfälligen Stellen des Zeitstrahls
 * und sollen ohne Renderer prüfbar bleiben.
 *
 * Ein Tag `d` belegt auf der Achse das Intervall [d, d + 1). Deshalb ist ein
 * Ausschnitt halboffen, und der letzte sichtbare Tag ist `ceil(end) - 1`.
 */

import {
  DayNumber,
  DayRange,
  Viewport,
  addMonths,
  dayFromParts,
  firstDayOfMonth,
  isoWeek,
  lastDayOfMonth,
  monthOfDay,
  parseIsoMonth,
  partsFromDay,
  startOfIsoWeek,
  startOfMonth,
  startOfQuarter,
  startOfYear,
} from "./calendar";
import { formatMonthYear, formatShortMonth } from "./format";
import { PlanView } from "./plan-model";

export type AxisUnit = "year" | "quarter" | "month" | "week" | "day";

/** Schmaler wird eine Zelle der unteren Stufe nicht; darunter wäre „KW 53" nicht mehr lesbar. */
export const MIN_CELL_PX = 36;

/** Weiter hinein geht der Zoom nicht: bei 40 px je Tag ist ein Tag schon eine breite Zelle. */
export const MAX_PX_PER_DAY = 40;

export interface Scale {
  viewport: Viewport;
  /** Breite der Zeitfläche in px. */
  width: number;
  pxPerDay: number;
  /** Tag → x in px relativ zur linken Kante der Zeitfläche. */
  x(day: number): number;
  /** x → Tag (Bruchteil). */
  dayAt(x: number): number;
}

export function createScale(viewport: Viewport, width: number): Scale {
  const span = viewport.end - viewport.start;
  // Vor der ersten Messung ist die Breite 0; eine Skala ohne Ausdehnung darf
  // dann nicht durch null teilen, sonst stünden NaN-Koordinaten im DOM.
  const usable = span > 0 && width > 0;
  const pxPerDay = usable ? width / span : 0;
  return {
    viewport,
    width,
    pxPerDay,
    // Erst multiplizieren, dann teilen: so landen ganze Tage auf ganzen
    // Pixeln, wo es aufgeht, und Zellgrenzen fransen nicht um 1e-14 aus.
    x: (day) => (usable ? ((day - viewport.start) * width) / span : 0),
    dayAt: (x) => (usable ? viewport.start + (x * span) / width : viewport.start),
  };
}

/** Nennlänge in Tagen — für die Stufenwahl genügt der Durchschnitt. */
const NOMINAL_DAYS: Record<AxisUnit, number> = {
  day: 1,
  week: 7,
  month: 365.25 / 12,
  quarter: 365.25 / 4,
  year: 365.25,
};

const FINE_TO_COARSE: readonly AxisUnit[] = ["day", "week", "month", "quarter", "year"];

/** Welche gröbere Einheit über der feineren steht; siehe Spec, Tabelle „Zeitachse". */
const UPPER_UNIT: Record<AxisUnit, AxisUnit | null> = {
  day: "month",
  week: "month",
  month: "year",
  quarter: "year",
  year: null,
};

/** Feinste Einheit mit Zellbreite ≥ MIN_CELL_PX; obere Stufe nach Spec-Tabelle. */
export function chooseUnits(pxPerDay: number): { lower: AxisUnit; upper: AxisUnit | null } {
  // Verglichen wird mit der Schwelle je Einheit statt mit dem Produkt: so
  // entscheidet genau `MIN_CELL_PX / Nennlänge`, ohne Rundungsrest.
  const lower = FINE_TO_COARSE.find((unit) => pxPerDay >= MIN_CELL_PX / NOMINAL_DAYS[unit]) ?? "year";
  return { lower, upper: UPPER_UNIT[lower] };
}

export interface AxisCell {
  start: DayNumber;
  /** exklusiv */
  end: DayNumber;
  label: string;
  x: number;
  width: number;
}

export interface AxisTiers {
  lower: { unit: AxisUnit; cells: AxisCell[] };
  upper: { unit: AxisUnit; cells: AxisCell[] } | null;
}

interface UnitCalendar {
  /** Der Beginn der Zelle, in der `day` liegt. */
  floor(day: DayNumber): DayNumber;
  /** Der Beginn der nächsten Zelle. */
  next(start: DayNumber): DayNumber;
}

const CALENDARS: Record<AxisUnit, UnitCalendar> = {
  day: { floor: (day) => Math.floor(day), next: (start) => start + 1 },
  week: { floor: startOfIsoWeek, next: (start) => start + 7 },
  month: { floor: startOfMonth, next: (start) => addMonths(start, 1) },
  quarter: { floor: startOfQuarter, next: (start) => addMonths(start, 3) },
  year: { floor: startOfYear, next: (start) => dayFromParts(partsFromDay(start).year + 1, 1, 1) },
};

/**
 * Mehr Zellen braucht keine sinnvolle Achse; die Obergrenze schützt nur davor,
 * dass ein kaputter Ausschnitt die Schleife unendlich laufen lässt.
 */
const MAX_CELLS = 2000;

function weekLabel(day: DayNumber, locale: string): string {
  // „KW" ist deutsch; anderswo ist „W" die gebräuchliche Abkürzung für die ISO-Woche.
  const prefix = locale.toLowerCase().startsWith("de") ? "KW" : "W";
  return `${prefix} ${isoWeek(day).week}`;
}

function lowerLabel(unit: AxisUnit, start: DayNumber, locale: string): string {
  const parts = partsFromDay(start);
  switch (unit) {
    case "year":
      return String(parts.year);
    case "quarter":
      return `Q${Math.floor((parts.month - 1) / 3) + 1}`;
    case "month":
      return formatShortMonth(start, locale);
    case "week":
      return weekLabel(start, locale);
    case "day":
      return String(parts.day);
  }
}

function upperLabel(unit: AxisUnit, start: DayNumber, locale: string): string {
  // Oben steht nur Jahr oder Monat; der Monat braucht dort sein Jahr, weil
  // über Tagen und Wochen keine weitere Stufe mehr folgt, die es nennte.
  return unit === "month" ? formatMonthYear(start, locale) : String(partsFromDay(start).year);
}

function cellsFor(scale: Scale, unit: AxisUnit, label: (start: DayNumber) => string): AxisCell[] {
  const { start: from, end: to } = scale.viewport;
  if (!Number.isFinite(from) || !Number.isFinite(to) || to <= from) return [];
  const calendar = CALENDARS[unit];
  const cells: AxisCell[] = [];
  for (let start = calendar.floor(from); start < to && cells.length < MAX_CELLS; ) {
    const end = calendar.next(start);
    const x = scale.x(start);
    cells.push({ start, end, label: label(start), x, width: scale.x(end) - x });
    start = end;
  }
  return cells;
}

/** Zellen, die den Ausschnitt berühren. Beschriftung: Jahr „2025", Quartal „Q1",
 *  Monat `formatShortMonth`, Woche „KW 3" (ISO), Tag „12"; obere Stufe Jahr
 *  „2025" bzw. Monat `formatMonthYear`. */
export function axisTiers(scale: Scale, locale: string): AxisTiers {
  const { lower, upper } = chooseUnits(scale.pxPerDay);
  return {
    lower: { unit: lower, cells: cellsFor(scale, lower, (start) => lowerLabel(lower, start, locale)) },
    upper:
      upper === null
        ? null
        : { unit: upper, cells: cellsFor(scale, upper, (start) => upperLabel(upper, start, locale)) },
  };
}

/** Gesamtzeitraum aus der Spanne der Einträge, auf ganze Quartale gerundet. */
export function worldFromExtent(extent: DayRange): Viewport {
  // Ganze Quartale, weil die Vorlage so gegliedert ist: ein Plan, der mitten
  // im Februar begänne, zeigte links eine angeschnittene, unbeschriftete Zelle.
  return { start: startOfQuarter(extent.start), end: addMonths(startOfQuarter(extent.end), 3) };
}

/** Rand links und rechts der Welt; so viel braucht ein Symbol am Ende, um ganz zu erscheinen. */
export const WORLD_PADDING_PX = 16;

/**
 * Weitet einen Ausschnitt so, dass bei `width` Pixeln links und rechts genau
 * `px` Pixel Rand bleiben. Ohne ihn stünde ein Meilenstein am ersten Tag des
 * Plans halb abgeschnitten an der Kante.
 */
export function padViewport(viewport: Viewport, width: number, px: number = WORLD_PADDING_PX): Viewport {
  if (width <= 2 * px) return viewport;
  const days = ((viewport.end - viewport.start) * px) / (width - 2 * px);
  return { start: viewport.start - days, end: viewport.end + days };
}

/**
 * Die Umkehrung von {@link padViewport}: der Ausschnitt innerhalb des Rands.
 * So meldet die Vorschau, was die Redaktion als Startansicht meint — und beim
 * Laden kommt mit dem Rand genau derselbe Ausschnitt heraus, statt dass jeder
 * Rundlauf einen Rand mehr ansetzt.
 */
export function unpadViewport(viewport: Viewport, width: number, px: number = WORLD_PADDING_PX): Viewport {
  if (width <= 2 * px) return viewport;
  const days = ((viewport.end - viewport.start) * px) / width;
  return { start: viewport.start + days, end: viewport.end - days };
}

/** Gesamtzeitraum aus dem Zeitraum-Filter: [start, end + 1). */
export function worldFromPeriod(period: DayRange): Viewport {
  return { start: period.start, end: period.end + 1 };
}

const isUsable = (viewport: Viewport): boolean =>
  Number.isFinite(viewport.start) && Number.isFinite(viewport.end) && viewport.end > viewport.start;

/** Spanne zwischen width / MAX_PX_PER_DAY und der Welt; in die Welt geschoben.
 *  Ist die Welt schmaler als die Mindestspanne: Mindestspanne, mittig auf der Welt. */
export function clampViewport(viewport: Viewport, world: Viewport, width: number): Viewport {
  const minSpan = Math.max(width, 0) / MAX_PX_PER_DAY;
  const worldSpan = world.end - world.start;

  if (!(worldSpan > minSpan)) {
    // Ein Plan über wenige Tage ließe sich sonst nie so weit hinauszoomen, dass
    // er die Fläche füllt — die Achse ragt dann links und rechts über ihn hinaus.
    const center = (world.start + world.end) / 2;
    return { start: center - minSpan / 2, end: center + minSpan / 2 };
  }

  if (!isUsable(viewport) || viewport.end - viewport.start >= worldSpan) {
    return { start: world.start, end: world.end };
  }

  let { start, end } = viewport;
  const span = end - start;
  if (span < minSpan) {
    // Um die Mitte, damit ein zu kurz geratener Ausschnitt nicht zur Seite kippt.
    const center = (start + end) / 2;
    start = center - minSpan / 2;
    end = center + minSpan / 2;
  }
  // Nur schieben, nie stauchen: die Spanne steht hier schon fest.
  if (start < world.start) return { start: world.start, end: world.start + (end - start) };
  if (end > world.end) return { start: world.end - (end - start), end: world.end };
  return { start, end };
}

/** factor > 1 zoomt hinein; anchorDay bleibt an derselben Bildschirmstelle. */
export function zoomViewport(
  viewport: Viewport,
  factor: number,
  anchorDay: number,
  world: Viewport,
  width: number,
): Viewport {
  const span = viewport.end - viewport.start;
  if (!(factor > 0) || !Number.isFinite(factor) || !(span > 0)) return clampViewport(viewport, world, width);

  // Die Spanne wird zuerst begrenzt und erst dann um den Anker gelegt. Klemmte
  // man hinterher, dehnte `clampViewport` um die Mitte — und der Tag unter dem
  // Zeiger rutschte an der Zoomgrenze weg.
  const minSpan = Math.max(width, 0) / MAX_PX_PER_DAY;
  const worldSpan = world.end - world.start;
  const nextSpan = Math.min(Math.max(span / factor, minSpan), Math.max(worldSpan, minSpan));
  const ratio = (anchorDay - viewport.start) / span;
  const start = anchorDay - ratio * nextSpan;
  return clampViewport({ start, end: start + nextSpan }, world, width);
}

export function panViewport(viewport: Viewport, deltaDays: number, world: Viewport, width: number): Viewport {
  return clampViewport({ start: viewport.start + deltaDays, end: viewport.end + deltaDays }, world, width);
}

/** Startansicht (Monate) → Ausschnitt; ohne oder außerhalb der Welt: die Welt. */
export function viewportFromView(view: PlanView | undefined, world: Viewport, width: number): Viewport {
  const whole = clampViewport(world, world, width);
  if (view === undefined) return whole;
  const first = parseIsoMonth(view.start);
  const last = parseIsoMonth(view.end);
  if (first === null || last === null) return whole;

  // Beide Monate eingeschlossen; vertauscht eingegeben meint die Redaktion
  // trotzdem denselben Zeitraum.
  const a = firstDayOfMonth(first);
  const b = firstDayOfMonth(last);
  const start = Math.min(a, b);
  const end = lastDayOfMonth(monthOfDay(Math.max(a, b))) + 1;

  if (end <= world.start || start >= world.end) return whole;
  // Ragt die Startansicht über die Welt hinaus, zeigt sie nur ihren Teil darin —
  // hineingeschoben zeigte sie Monate, die niemand ausgewählt hat.
  return clampViewport({ start: Math.max(start, world.start), end: Math.min(end, world.end) }, world, width);
}

/** „Januar 2025 bis Dezember 2031" — für aria-valuetext. */
export function describeViewport(viewport: Viewport, locale: string): string {
  const firstDay = Math.floor(viewport.start);
  const lastDay = Math.max(firstDay, Math.ceil(viewport.end) - 1);
  const first = formatMonthYear(firstDay, locale);
  const last = formatMonthYear(lastDay, locale);
  // „März 2025 bis März 2025" läse ein Screenreader als Versprecher vor.
  return first === last ? first : `${first} bis ${last}`;
}
