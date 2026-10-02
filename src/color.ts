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
 * Welche Schrift auf einer Kategoriefarbe lesbar ist.
 *
 * Die Farben wählt die Redaktion frei; ob Weiß oder Schwarz darauf steht, darf
 * deshalb nicht im Stylesheet festgelegt sein. Entschieden wird nach dem
 * Kontrastverhältnis der WCAG — das größere von beiden reicht für jede Farbe
 * mindestens für 4,5 : 1.
 */

/**
 * `man("slate-700")` (Craft anthracite-900) und `man("white")`; fest, weil der
 * Kontrast mit genau diesen Werten gerechnet ist. Nicht `man("text")`
 * (#303C49): darauf käme das Blau #4B96D2 der Vorlagen nur auf 3,5 : 1.
 */
export const DARK_INK = "#1E2832";
export const LIGHT_INK = "#FFFFFF";

function channel(value: number): number {
  const srgb = value / 255;
  return srgb <= 0.04045 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
}

/** Relative Leuchtdichte nach WCAG 2.x; `#RRGGBB`. */
export function luminance(hex: string): number {
  const value = Number.parseInt(hex.slice(1), 16);
  const [r, g, b] = [(value >> 16) & 255, (value >> 8) & 255, value & 255].map(channel);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a: string, b: string): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

/** Die Schriftfarbe mit dem höheren Kontrast auf `background`. */
export function inkFor(background: string): string {
  return contrast(background, LIGHT_INK) >= contrast(background, DARK_INK) ? LIGHT_INK : DARK_INK;
}
