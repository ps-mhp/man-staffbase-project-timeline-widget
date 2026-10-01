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
 * Maße und Messungen der beiden Ziehgriffe: Höhe der Vorschau, Breite der
 * Liste. Die Zahlen hier und die in `_plan-editor-tokens.scss` gehören
 * zusammen — der Griff ist so breit wie der Abstand, den er ersetzt.
 */

/** Breite der Griffzone eines Ziehgriffs; sichtbar ist nur die Haarlinie darin. */
export const SPLITTER_SIZE = 7;

export const PREVIEW = {
  storageKey: "preview-height",
  /**
   * Werkzeugleiste, Legende, Achse und Übersicht des Zeitstrahls brauchen
   * zusammen gut 180 px; darunter bliebe für die Bühne nichts. 300 lassen
   * ihr gut 120.
   */
  min: 300,
  /** So viel behalten Reiter und Arbeitsbereich darunter mindestens. */
  reserve: 220,
} as const;

export const LIST = {
  storageKey: "list-width",
  fallback: 340,
  min: 240,
  /** So viel behält das Formular daneben mindestens. */
  reserve: 360,
} as const;

/** Die Vorgabe der Vorschau: gut ein Drittel des Fensters, nie unter dem Minimum und nie über 520 px. */
export function defaultPreviewHeight(): number {
  return Math.round(
    Math.min(520, Math.max(PREVIEW.min, window.innerHeight * 0.38)),
  );
}

/**
 * Der Platz, den sich die Fläche der Vorschau mit dem Arbeitsbereich teilt:
 * die Innenhöhe des Hauptbereichs ohne den Kopf der Vorschau und den Griff.
 */
export function previewSpace(
  main: HTMLElement | null,
  preview: HTMLElement | null,
  stage: HTMLElement | null,
): number | null {
  if (main === null || preview === null || stage === null) return null;
  const style = window.getComputedStyle(main);
  const inner =
    main.clientHeight -
    parseFloat(style.paddingTop || "0") -
    parseFloat(style.paddingBottom || "0");
  const previewChrome = preview.offsetHeight - stage.offsetHeight;
  return inner - previewChrome - SPLITTER_SIZE;
}

/** Der Platz, den sich Liste und Formular teilen. */
export function listSpace(entries: HTMLElement | null): number | null {
  return entries === null ? null : entries.clientWidth - SPLITTER_SIZE;
}
