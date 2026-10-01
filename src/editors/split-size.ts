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
 * Die Rechnung hinter den Ziehgriffen: Grenzen, Klemmen, Tastaturschritte —
 * und das Merken der gezogenen Größen je Browser.
 */

export interface SplitBounds {
  min: number;
  /** `Infinity`, solange der verfügbare Platz nicht gemessen ist. */
  max: number;
}

/** Ein Tastendruck verschiebt um so viel, mit Shift um das Vierfache. */
export const KEY_STEP = 16;
export const KEY_STEP_LARGE = 64;

/**
 * Die Grenzen einer Größe, die sich `available` Pixel mit einem anderen
 * Bereich teilt; der andere behält mindestens `reserve`. Reicht der Platz
 * nicht, gilt das Minimum — ein Bereich von null Pixeln wäre nicht wieder zu
 * greifen.
 */
export function splitBounds(
  available: number | null,
  min: number,
  reserve: number,
): SplitBounds {
  return {
    min,
    max: available === null ? Infinity : Math.max(min, available - reserve),
  };
}

export function clampSize(size: number, { min, max }: SplitBounds): number {
  return Math.min(Math.max(size, min), max);
}

/** Die Größe nach einem Tastendruck, oder `null`, wenn die Taste nichts verschiebt. */
export function keyboardSize(
  size: number,
  key: string,
  shift: boolean,
  bounds: SplitBounds,
): number | null {
  const step = shift ? KEY_STEP_LARGE : KEY_STEP;
  switch (key) {
    case "ArrowDown":
    case "ArrowRight":
      return clampSize(size + step, bounds);
    case "ArrowUp":
    case "ArrowLeft":
      return clampSize(size - step, bounds);
    case "Home":
      return bounds.min;
    case "End":
      return Number.isFinite(bounds.max) ? bounds.max : null;
    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// Merken

const STORAGE_PREFIX = "project-timeline-widget:editor:";

// Jeder Zugriff auf den Speicher darf scheitern — im privaten Fenster, bei
// gesperrten Website-Daten, in manchen eingebetteten Ansichten. Dann gelten
// einfach die Vorgaben; ein Fehler ist das nicht und wird deshalb auch nicht
// gemeldet.

export function readStoredSize(key: string): number | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + key);
    const size = raw === null ? NaN : Number(raw);
    return Number.isFinite(size) && size > 0 ? size : null;
  } catch {
    return null;
  }
}

export function storeSize(key: string, size: number): void {
  try {
    window.localStorage.setItem(STORAGE_PREFIX + key, String(Math.round(size)));
  } catch {
    // Ohne Speicher gilt beim nächsten Öffnen wieder die Vorgabe.
  }
}

export function forgetSize(key: string): void {
  try {
    window.localStorage.removeItem(STORAGE_PREFIX + key);
  } catch {
    // Ohne Speicher gibt es nichts zu vergessen.
  }
}
