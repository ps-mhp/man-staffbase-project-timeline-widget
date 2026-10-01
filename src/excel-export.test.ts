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

// ExcelJS läuft hier echt, nicht gemockt: nur ein wieder eingelesenes
// Arbeitsblatt belegt, dass Datumszellen, Format und Kopfzeile in der Datei
// so ankommen, wie Excel sie braucht.
import ExcelJS from "exceljs";

import { parseIsoDate } from "./calendar";
import { ExportRequest, buildWorkbookBuffer, downloadExport, exportFileName } from "./excel-export";
import { PlanRow } from "./plan-rows";

const XLSX_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

const day = (text: string): number => parseIsoDate(text) as number;
const utc = (text: string): Date => new Date(`${text}T00:00:00.000Z`);

const baseRow: Omit<PlanRow, "id" | "kind" | "kindLabel" | "title" | "start" | "end"> = {
  lane: "Launches / SOPs",
  category: "",
  color: "#71787F",
  series: "",
  tentative: false,
  predecessors: [],
  description: "",
  content: null,
  attachments: [],
};

const rows: PlanRow[] = [
  {
    ...baseRow,
    id: "m1",
    kind: "milestone",
    kindLabel: "Meilenstein",
    title: "1. SOP TG Assist MY26",
    category: "MY26 TG Assist",
    color: "#7B2FA0",
    start: day("2025-10-01"),
    end: null,
    series: "TG Assist MY26",
    tentative: true,
    predecessors: ["C4S TG Assist", "0-Serie"],
    description: "Erste\nZeile",
  },
  { ...baseRow, id: "b1", kind: "bar", kindLabel: "Zeitraum", title: "TMS1", start: day("2028-01-01"), end: day("2030-06-30") },
  {
    ...baseRow,
    id: "d1",
    lane: "Alle Ebenen",
    kind: "deadline",
    kindLabel: "Stichtag",
    title: "§ Euro 7",
    category: "General",
    start: day("2029-05-01"),
    end: null,
  },
];

const request = (patch: Partial<ExportRequest> = {}): ExportRequest => ({
  title: "Sales Truck Launch",
  updatedAt: "2024-11-27",
  scope: "view",
  rows,
  filterDescription: ["Ausgeblendete Ebenen: Messen", "Suche: „sop“"],
  locale: "de-DE",
  now: new Date(2026, 8, 30, 10, 15),
  ...patch,
});

async function readBack(buffer: ArrayBuffer): Promise<ExcelJS.Workbook> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  return workbook;
}

const sheetOf = (workbook: ExcelJS.Workbook, name: string): ExcelJS.Worksheet =>
  workbook.getWorksheet(name) as ExcelJS.Worksheet;

/** Die Werte eines Blatts als Tabelle, leere Zellen als null. */
function valuesOf(sheet: ExcelJS.Worksheet, columns: number): ExcelJS.CellValue[][] {
  const table: ExcelJS.CellValue[][] = [];
  for (let row = 1; row <= sheet.rowCount; row += 1) {
    table.push(Array.from({ length: columns }, (_, index) => sheet.getCell(row, index + 1).value));
  }
  return table;
}

/** Die Spaltenbreite, die ExcelJS nicht schreibt (siehe „gibt jeder Spalte eine Breite …“). */
const EXCELJS_DEFAULT_WIDTH = 9;

const HEADER = ["Ebene", "Art", "Titel", "Kategorie", "Beginn", "Ende", "Serie", "Vorläufig", "Vorgänger", "Beschreibung", "Inhalt", "Anhänge"];

describe("buildWorkbookBuffer", () => {
  it("liefert einen ArrayBuffer mit den Blättern „Planung“ und „Info“", async () => {
    const buffer = await buildWorkbookBuffer(request());
    expect(Object.prototype.toString.call(buffer)).toBe("[object ArrayBuffer]");
    const workbook = await readBack(buffer);
    expect(workbook.worksheets.map((sheet) => sheet.name)).toEqual(["Planung", "Info"]);
  });

  describe("Blatt „Planung“", () => {
    let sheet: ExcelJS.Worksheet;

    beforeAll(async () => {
      sheet = sheetOf(await readBack(await buildWorkbookBuffer(request())), "Planung");
    });

    it("schreibt eine Zeile je Eintrag unter die Kopfzeile, leere Felder als leere Zellen", () => {
      expect(valuesOf(sheet, HEADER.length)).toEqual([
        HEADER,
        [
          "Launches / SOPs",
          "Meilenstein",
          "1. SOP TG Assist MY26",
          "MY26 TG Assist",
          utc("2025-10-01"),
          null,
          "TG Assist MY26",
          "ja",
          "C4S TG Assist; 0-Serie",
          "Erste\nZeile",
          null,
          null,
        ],
        ["Launches / SOPs", "Zeitraum", "TMS1", null, utc("2028-01-01"), utc("2030-06-30"), null, null, null, null, null, null],
        ["Alle Ebenen", "Stichtag", "§ Euro 7", "General", utc("2029-05-01"), null, null, null, null, null, null, null],
      ]);
    });

    it("schreibt Beginn und Ende als echte Datumszellen im Format TT.MM.JJJJ", () => {
      for (const address of ["E2", "E3", "F3", "E4"]) {
        const cell = sheet.getCell(address);
        expect(cell.type).toBe(ExcelJS.ValueType.Date);
        expect(cell.numFmt).toBe("dd.mm.yyyy");
      }
    });

    it("macht die Kopfzeile fett, fixiert sie und legt den Autofilter darüber", () => {
      HEADER.forEach((_, index) => expect(sheet.getCell(1, index + 1).font?.bold).toBe(true));
      expect(sheet.getCell("A2").font?.bold).not.toBe(true);
      expect(sheet.views).toEqual([expect.objectContaining({ state: "frozen", ySplit: 1 })]);
      expect(sheet.autoFilter).toBe("A1:L4");
    });

    it("gibt jeder Spalte eine Breite, die Datumswerte fasst und nicht ausufert", () => {
      HEADER.forEach((_, index) => {
        // Breite 9 ist die Vorgabe von ExcelJS und wird nicht geschrieben —
        // zurückgelesen fehlt sie dann; Excel zeigt die Spalte in Standardbreite.
        const width = sheet.getColumn(index + 1).width ?? EXCELJS_DEFAULT_WIDTH;
        expect(width).toBeGreaterThanOrEqual(8);
        expect(width).toBeLessThanOrEqual(60);
      });
      expect(sheet.getColumn(5).width).toBeGreaterThanOrEqual(11);
      expect(sheet.getColumn(6).width).toBeGreaterThanOrEqual(11);
      expect(sheet.getColumn(3).width).toBeGreaterThan(sheet.getColumn(2).width as number);
    });

    it("kommt ohne Farben und Grafik aus", () => {
      sheet.eachRow((row) =>
        row.eachCell((cell) => expect((cell.fill as ExcelJS.FillPattern | undefined)?.pattern ?? "none").toBe("none")),
      );
      expect(sheet.getImages()).toEqual([]);
    });
  });

  it("verlinkt einen verknüpften Inhalt mit seiner vollen Adresse", async () => {
    const linked: PlanRow = {
      ...rows[1],
      content: { kind: "page", label: "Seite", href: "/content/page/6abe2602f70f4a552a0470c4" },
    };
    const sheet = sheetOf(await readBack(await buildWorkbookBuffer(request({ rows: [linked] }))), "Planung");
    const url = `${window.location.origin}/content/page/6abe2602f70f4a552a0470c4`;
    expect(sheet.getCell(2, HEADER.indexOf("Inhalt") + 1).value).toEqual({ text: url, hyperlink: url });
  });

  it("nennt die Anhänge zeilenweise mit voller Adresse", async () => {
    const linked: PlanRow = {
      ...rows[1],
      attachments: [
        { name: "Ablaufplan", href: "/api/media/secure/a.pdf" },
        { name: "b.png", href: "/api/media/secure/b.png" },
      ],
    };
    const sheet = sheetOf(await readBack(await buildWorkbookBuffer(request({ rows: [linked] }))), "Planung");
    const origin = window.location.origin;
    expect(sheet.getCell(2, HEADER.indexOf("Anhänge") + 1).value).toBe(
      `Ablaufplan (${origin}/api/media/secure/a.pdf)\nb.png (${origin}/api/media/secure/b.png)`,
    );
  });

  it("begrenzt die Breite auch bei sehr langem Text", async () => {
    const long = { ...rows[0], description: "x".repeat(500) };
    const sheet = sheetOf(await readBack(await buildWorkbookBuffer(request({ rows: [long] }))), "Planung");
    expect(sheet.getColumn(10).width).toBeLessThanOrEqual(60);
  });

  it("kürzt überlange Texte auf die Grenze einer Excel-Zelle, ohne ein Emoji zu teilen", async () => {
    // 16 384 Emoji sind 32 768 UTF-16-Einheiten — eine über der Grenze.
    const long = { ...rows[0], description: "😀".repeat(16_384) };
    const sheet = sheetOf(await readBack(await buildWorkbookBuffer(request({ rows: [long] }))), "Planung");
    const value = String(sheet.getRow(2).getCell(10).value);
    expect(value.length).toBeLessThanOrEqual(32_767);
    expect(value.endsWith("😀")).toBe(true);
  });

  it("schreibt ohne Einträge nur die Kopfzeile", async () => {
    const sheet = sheetOf(await readBack(await buildWorkbookBuffer(request({ rows: [] }))), "Planung");
    expect(valuesOf(sheet, HEADER.length)).toEqual([HEADER]);
    expect(sheet.autoFilter).toBe("A1:L1");
  });

  describe("Blatt „Info“", () => {
    const infoOf = async (patch: Partial<ExportRequest>): Promise<ExcelJS.CellValue[][]> =>
      valuesOf(sheetOf(await readBack(await buildWorkbookBuffer(request(patch))), "Info"), 2);

    it("nennt Titel, Stand, Exportdatum, Umfang und je Zeile einen Filter", async () => {
      expect(await infoOf({})).toEqual([
        ["Titel", "Sales Truck Launch"],
        ["Stand", "27.11.2024"],
        ["Exportiert am", "30.09.2026"],
        ["Umfang", "Aktuelle Ansicht"],
        ["Filter", "Ausgeblendete Ebenen: Messen"],
        [null, "Suche: „sop“"],
      ]);
    });

    it("fällt ohne Titel, Stand und Filter auf Vorgaben zurück", async () => {
      expect(await infoOf({ title: "  ", updatedAt: undefined, scope: "all", filterDescription: [] })).toEqual([
        ["Titel", "Projektplan"],
        ["Stand", null],
        ["Exportiert am", "30.09.2026"],
        ["Umfang", "Ganzer Plan"],
        ["Filter", "keine"],
      ]);
    });

    it("lässt einen unlesbaren Stand leer", async () => {
      expect((await infoOf({ updatedAt: "kaputt" }))[1]).toEqual(["Stand", null]);
    });
  });
});

describe("exportFileName", () => {
  const now = new Date(2026, 8, 30, 10, 15);

  it.each([
    ["Sales Truck Launch", "Sales Truck Launch"],
    ['a\\b/c:d*e?f"g<h>i|j', "abcdefghij"],
    ["Plan\u0000\u0007\u007f!", "Plan!"],
    ["Plan\u202egnaL\u2028X", "PlangnaL X"],
    ["  Sales \t\n Truck  ", "Sales Truck"],
    ["A / B", "A B"],
    ["Übersicht Größe", "Übersicht Größe"],
    ["", "Projektplan"],
    ["   ", "Projektplan"],
    ["///", "Projektplan"],
  ])("macht aus %p den Namen %p", (title, expected) => {
    expect(exportFileName(title, now)).toBe(`${expected}_2026-09-30.xlsx`);
  });

  it("kürzt auf 80 Zeichen, ohne Leerraum am Ende und ohne Zeichen zu zerteilen", () => {
    expect(exportFileName("x".repeat(100), now)).toBe(`${"x".repeat(80)}_2026-09-30.xlsx`);
    expect(exportFileName(`${"a".repeat(79)} bbb`, now)).toBe(`${"a".repeat(79)}_2026-09-30.xlsx`);
    expect(exportFileName("😀".repeat(81), now)).toBe(`${"😀".repeat(80)}_2026-09-30.xlsx`);
  });

  it("nimmt das lokale Datum, nicht das in UTC", () => {
    expect(exportFileName("Plan", new Date(2026, 0, 1, 0, 30))).toBe("Plan_2026-01-01.xlsx");
    expect(exportFileName("Plan", new Date(2025, 11, 31, 23, 30))).toBe("Plan_2025-12-31.xlsx");
  });
});

describe("downloadExport", () => {
  const original = { create: URL.createObjectURL, revoke: URL.revokeObjectURL };
  let createObjectURL: jest.Mock<string, [Blob]>;
  let revokeObjectURL: jest.Mock<void, [string]>;
  let clicks: { href: string | null; download: string; attached: boolean }[];

  const stubUrl = (name: "createObjectURL" | "revokeObjectURL", value: unknown): void => {
    Object.defineProperty(URL, name, { configurable: true, writable: true, value });
  };

  beforeEach(() => {
    // jsdom kennt weder Object-URLs noch Downloads; beides wird hier beobachtet statt ausgeführt.
    createObjectURL = jest.fn((_blob: Blob) => "blob:projektplan");
    revokeObjectURL = jest.fn((_url: string) => undefined);
    stubUrl("createObjectURL", createObjectURL);
    stubUrl("revokeObjectURL", revokeObjectURL);
    clicks = [];
    jest.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (this: HTMLAnchorElement) {
      clicks.push({ href: this.getAttribute("href"), download: this.download, attached: document.body.contains(this) });
    });
    // Die Uhr läuft mit, damit ExcelJS beim Packen nicht stehen bleibt; vorspulen lässt sie sich trotzdem.
    jest.useFakeTimers({ advanceTimers: true });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
    stubUrl("createObjectURL", original.create);
    stubUrl("revokeObjectURL", original.revoke);
  });

  it("lädt die Arbeitsmappe als Blob über <a download> herunter und räumt danach auf", async () => {
    await downloadExport(request());

    expect(createObjectURL).toHaveBeenCalledTimes(1);
    const blob = createObjectURL.mock.calls[0][0];
    expect(blob.type).toBe(XLSX_TYPE);
    expect(blob.size).toBeGreaterThan(0);
    expect(clicks).toEqual([
      { href: "blob:projektplan", download: "Sales Truck Launch_2026-09-30.xlsx", attached: true },
    ]);
    expect(document.querySelectorAll("a")).toHaveLength(0);

    // Safari bricht den Download ab, wenn die URL sofort verschwindet.
    expect(revokeObjectURL).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1000);
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:projektplan");
  });

  it("räumt auch auf, wenn der Klick scheitert", async () => {
    jest.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {
      throw new Error("blockiert");
    });

    await expect(downloadExport(request())).rejects.toThrow("blockiert");
    expect(document.querySelectorAll("a")).toHaveLength(0);
    jest.advanceTimersByTime(1000);
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:projektplan");
  });
});
