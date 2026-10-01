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
 * Der Plan als Excel-Datei.
 *
 * Diese Datei wird nur per `import()` geladen: ExcelJS ist groß, und die
 * wenigsten Leser:innen exportieren je etwas. So bleibt das Bundle auf der
 * Seite klein, wie beim Import im Table-Widget.
 *
 * Die Tabelle ist bewusst schlicht — keine Formen, keine Grafik, keine
 * Farben. Wer sie öffnet, will filtern, sortieren und weiterrechnen; dafür
 * zählen echte Datumszellen, eine fixierte Kopfzeile und der Autofilter.
 */

import ExcelJS from "exceljs";

import { DayNumber, formatIsoDate, parseIsoDate, todayDay } from "./calendar";
import { formatShortDate } from "./format";
import { ExportScope } from "./plan-filter";
import { PlanRow } from "./plan-rows";

export interface ExportRequest {
  title: string;
  updatedAt?: string;
  scope: ExportScope;
  rows: PlanRow[];
  filterDescription: string[];
  locale: string;
  now: Date;
}

const XLSX_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

/** Name der Datei und Titel im Blatt „Info", wenn das Widget keinen Titel hat. */
const DEFAULT_TITLE = "Projektplan";

const SCOPE_LABELS: Record<ExportScope, string> = {
  view: "Aktuelle Ansicht",
  all: "Ganzer Plan",
};

const MS_PER_DAY = 86_400_000;

/** Excel speichert Formatcodes englisch; ein deutsches Excel zeigt daraus „TT.MM.JJJJ". */
const DATE_FORMAT = "dd.mm.yyyy";

/** „31.12.2030" plus etwas Luft, damit Excel nicht „####" zeigt. */
const DATE_WIDTH = 12;
const MIN_WIDTH = 8;
const MAX_WIDTH = 60;

/** Mehr Zeichen fasst eine Excel-Zelle nicht; darüber meldet Excel eine beschädigte Datei. */
const MAX_CELL_TEXT = 32_767;

/** Länger wird der Titel im Dateinamen nicht — Pfade unter Windows sind knapp. */
const MAX_NAME_LENGTH = 80;

/** Zeichen, die Windows oder macOS in Dateinamen ablehnen. */
const FORBIDDEN_IN_FILE_NAME = new Set(["\\", "/", ":", "*", "?", '"', "<", ">", "|"]);

/**
 * Safari bricht den Download ab, wenn die Object-URL im selben Takt
 * verschwindet, in dem der Klick ihn startet.
 */
const REVOKE_DELAY_MS = 1000;

/** Ein Link, den Excel als anklickbar zeigt. */
interface Hyperlink {
  text: string;
  hyperlink: string;
}

type CellInput = string | Date | Hyperlink | null;

interface Column {
  header: string;
  value(row: PlanRow): CellInput;
  /** Datumsspalten bekommen Format und feste Breite. */
  date?: boolean;
}

/**
 * Ein Tag als `Date` um Mitternacht UTC. ExcelJS rechnet ein `Date` über UTC
 * in die Seriennummer um; so wird daraus ein glatter Tag, gleich in welcher
 * Zeitzone exportiert wird.
 */
const excelDate = (day: DayNumber): Date => new Date(day * MS_PER_DAY);

/** Die volle Adresse: die Datei verlässt die App, ein Pfad allein führte nirgendwohin. */
const absolute = (href: string): string => new URL(href, window.location.origin).href;

const link = (href: string): Hyperlink => {
  const url = absolute(href);
  return { text: url, hyperlink: url };
};

/** Leerer Text wird eine leere Zelle — sonst zeigte der Autofilter zwei Arten von „leer". */
const text = (value: string): string | null => {
  if (value === "") return null;
  if (value.length <= MAX_CELL_TEXT) return value;
  // Die Grenze zählt UTF-16-Einheiten; gekürzt wird trotzdem nur zwischen
  // Zeichen, damit kein halbes Emoji übrig bleibt.
  let cut = MAX_CELL_TEXT;
  const code = value.charCodeAt(cut - 1);
  if (code >= 0xd800 && code <= 0xdbff) cut -= 1;
  return value.slice(0, cut);
};

const COLUMNS: readonly Column[] = [
  { header: "Ebene", value: (row) => text(row.lane) },
  { header: "Art", value: (row) => text(row.kindLabel) },
  { header: "Titel", value: (row) => text(row.title) },
  { header: "Kategorie", value: (row) => text(row.category) },
  { header: "Beginn", value: (row) => excelDate(row.start), date: true },
  { header: "Ende", value: (row) => (row.end === null ? null : excelDate(row.end)), date: true },
  { header: "Serie", value: (row) => text(row.series) },
  { header: "Vorläufig", value: (row) => (row.tentative ? "ja" : null) },
  { header: "Vorgänger", value: (row) => text(row.predecessors.join("; ")) },
  { header: "Beschreibung", value: (row) => text(row.description) },
  { header: "Inhalt", value: (row) => (row.content === null ? null : link(row.content.href)) },
  // Mehrere Anhänge in einer Zelle, je Zeile einer: Excel kennt je Zelle nur einen Link.
  {
    header: "Anhänge",
    value: (row) => text(row.attachments.map((entry) => `${entry.name} (${absolute(entry.href)})`).join("\n")),
  },
];

/** Die längste Zeile eines Texts in Zeichen — ein Umbruch in der Zelle macht sie nicht breiter. */
const longestLine = (value: string): number => Math.max(...value.split("\n").map((line) => Array.from(line).length));

/** Breit genug für den längsten Inhalt, aber gedeckelt: eine lange Beschreibung soll nicht alles sprengen. */
function fitWidth(texts: readonly string[]): number {
  const longest = Math.max(0, ...texts.map(longestLine));
  return Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, longest + 2));
}

function columnWidth(column: Column, rows: readonly PlanRow[]): number {
  if (column.date) return DATE_WIDTH;
  const values = rows
    .map((row) => column.value(row))
    .map((value) => (value !== null && typeof value === "object" && "hyperlink" in value ? value.text : value))
    .filter((value): value is string => typeof value === "string");
  return fitWidth([column.header, ...values]);
}

function addPlanSheet(workbook: ExcelJS.Workbook, rows: readonly PlanRow[]): void {
  const sheet = workbook.addWorksheet("Planung", { views: [{ state: "frozen", ySplit: 1 }] });
  sheet.columns = COLUMNS.map((column) => ({ header: column.header, width: columnWidth(column, rows) }));
  sheet.getRow(1).font = { bold: true };

  for (const row of rows) {
    const added = sheet.addRow(COLUMNS.map((column) => column.value(row)));
    COLUMNS.forEach((column, index) => {
      const cell = added.getCell(index + 1);
      if (column.date && cell.value !== null) cell.numFmt = DATE_FORMAT;
    });
  }

  sheet.autoFilter = { from: { row: 1, column: 1 }, to: { row: rows.length + 1, column: COLUMNS.length } };
}

function infoRows(request: ExportRequest): [string | null, string | null][] {
  const updated = request.updatedAt === undefined ? null : parseIsoDate(request.updatedAt);
  const filters = request.filterDescription.length > 0 ? request.filterDescription : ["keine"];
  return [
    ["Titel", request.title.trim() || DEFAULT_TITLE],
    ["Stand", updated === null ? null : formatShortDate(updated, request.locale)],
    // Das Datum, das die Leser:innen an ihrer Uhr sehen, nicht das in UTC.
    ["Exportiert am", formatShortDate(todayDay(request.now), request.locale)],
    ["Umfang", SCOPE_LABELS[request.scope]],
    // Je Filter eine Zeile: in einer Zelle zusammengefasst wären sie kaum lesbar.
    ...filters.map((line, index): [string | null, string | null] => [index === 0 ? "Filter" : null, text(line)]),
  ];
}

function addInfoSheet(workbook: ExcelJS.Workbook, request: ExportRequest): void {
  const sheet = workbook.addWorksheet("Info");
  const rows = infoRows(request);
  sheet.columns = [
    { width: fitWidth(rows.map(([label]) => label ?? "")) },
    { width: fitWidth(rows.map(([, value]) => value ?? "")) },
  ];
  sheet.addRows(rows);
  sheet.getColumn(1).font = { bold: true };
}

/**
 * ExcelJS verspricht im Typ einen `ArrayBuffer`, liefert aber eine Sicht
 * darauf (im Browser wie in Node ein `Uint8Array`). In Node liegt sie oft in
 * einem größeren, geteilten Puffer — kopiert wird deshalb genau ihr Ausschnitt.
 */
function toArrayBuffer(data: ArrayBuffer | ArrayBufferView): ArrayBuffer {
  if (!ArrayBuffer.isView(data)) return data;
  return new Uint8Array(data.buffer, data.byteOffset, data.byteLength).slice().buffer;
}

export async function buildWorkbookBuffer(request: ExportRequest): Promise<ArrayBuffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.created = request.now;
  workbook.modified = request.now;
  addPlanSheet(workbook, request.rows);
  addInfoSheet(workbook, request);
  return toArrayBuffer(await workbook.xlsx.writeBuffer());
}

/**
 * Steuer- und Formatzeichen: C0, C1, dazu Richtungs- und Zeilentrenner
 * (`\p{Cf}`, U+2028/U+2029). Ein U+202E im Titel drehte sonst die Anzeige
 * des Dateinamens um.
 */
const isControlCharacter = (character: string): boolean => {
  const code = character.codePointAt(0) ?? 0;
  return code < 0x20 || (code >= 0x7f && code <= 0x9f) || code === 0x2028 || code === 0x2029 || /\p{Cf}/u.test(character);
};

/**
 * `<Titel>_<JJJJ-MM-TT>.xlsx`, ohne Titel `Projektplan_…`. Das Datum ist das
 * lokale — wer abends in New York exportiert, erwartet nicht schon morgen.
 */
export function exportFileName(title: string, now: Date): string {
  const cleaned = Array.from(title.replace(/\s+/g, " "))
    .filter((character) => !FORBIDDEN_IN_FILE_NAME.has(character) && !isControlCharacter(character))
    .join("")
    .replace(/ {2,}/g, " ")
    .trim();
  // Nach Zeichen, nicht nach UTF-16-Einheiten gekürzt: ein halbes Emoji wäre ein kaputter Name.
  const name = Array.from(cleaned).slice(0, MAX_NAME_LENGTH).join("").trim();
  return `${name === "" ? DEFAULT_TITLE : name}_${formatIsoDate(todayDay(now))}.xlsx`;
}

/** Baut, verpackt als Blob, klickt `<a download>`, räumt die Object-URL wieder weg. */
export async function downloadExport(request: ExportRequest): Promise<void> {
  const buffer = await buildWorkbookBuffer(request);
  const url = URL.createObjectURL(new Blob([buffer], { type: XLSX_TYPE }));
  const link = document.createElement("a");
  link.href = url;
  link.download = exportFileName(request.title, request.now);
  link.style.display = "none";
  // Firefox startet den Download nur für Links, die im Dokument hängen.
  document.body.appendChild(link);
  try {
    link.click();
  } finally {
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), REVOKE_DELAY_MS);
  }
}
