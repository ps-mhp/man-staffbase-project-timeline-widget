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
 * Wie breit eine Beschriftung wird.
 *
 * Die Verteilung auf Zeilen braucht die Breite jeder Beschriftung, bevor sie
 * im DOM steht — sonst müsste jede Beschriftung erst gerendert und gemessen
 * werden, und die Ebenen sprängen dabei. Ein Canvas misst ohne Layout.
 *
 * Wo kein Canvas misst (jsdom, alte Umgebungen), wird geschätzt. Die Schätzung
 * ist großzügig: eine zu breit geschätzte Beschriftung kostet eine Zeile, eine
 * zu schmal geschätzte überdeckt die Nachbarin.
 */

/** Die Schrift der Beschriftungen; muss zu `.man-pt__label` im Stylesheet passen. */
export const LABEL_FONT = '300 13px "MANEurope Light", "MAN Europe", Arial, sans-serif';

/** Durchschnittliche Zeichenbreite der Schätzung bei 13 px. */
const ESTIMATED_CHAR_WIDTH = 7;

export type Measure = (text: string) => number;

export const estimateWidth: Measure = (text) => text.length * ESTIMATED_CHAR_WIDTH;

function canvasContext(): CanvasRenderingContext2D | null {
  // jsdom meldet für `getContext` einen lauten „Not implemented"-Fehler auf
  // der Konsole, statt nur `null` zu liefern; dort wird deshalb gar nicht erst
  // gefragt.
  if (typeof document === "undefined" || /jsdom/i.test(globalThis.navigator?.userAgent ?? "")) return null;
  try {
    return document.createElement("canvas").getContext("2d");
  } catch {
    return null;
  }
}

/**
 * Ein Messer mit eigenem Gedächtnis. Nach dem Laden der Schriften wird ein
 * neues angelegt — die gemerkten Breiten gehörten zur Ersatzschrift.
 */
export function createMeasure(font: string = LABEL_FONT): Measure {
  const context = canvasContext();
  if (context === null) return estimateWidth;
  context.font = font;
  const cache = new Map<string, number>();
  return (text) => {
    let width = cache.get(text);
    if (width === undefined) {
      width = Math.ceil(context.measureText(text).width);
      cache.set(text, width);
    }
    return width;
  };
}
