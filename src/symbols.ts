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
 * Die Formen der Meilensteine: Namen, Zeichnung, und welche Form ein Eintrag
 * trägt.
 *
 * Gezeichnet wird überall dieselbe SVG-Figur — im Zeitstrahl, in der Legende,
 * in der Hilfe und im Editor. Mit CSS-Formen gäbe es für jede Fläche eine
 * eigene Nachbildung, und die liefen auseinander.
 */

import { MilestoneSymbol, Plan, PlanItem, categoryOf } from "./plan-model";

/** Die Zeichenfläche jeder Form. */
export const SYMBOL_BOX = 14;

export const SYMBOL_LABELS: Readonly<Record<MilestoneSymbol, string>> = {
  diamond: "Raute",
  triangle: "Dreieck",
  "triangle-down": "Dreieck, Spitze unten",
  square: "Quadrat",
  circle: "Kreis",
  hexagon: "Sechseck",
  star: "Stern",
  plus: "Kreuz",
};

const PATHS: Readonly<Record<MilestoneSymbol, string>> = {
  diamond: "M7 0L14 7L7 14L0 7Z",
  triangle: "M7 0.5L13.5 13H0.5Z",
  "triangle-down": "M0.5 1H13.5L7 13.5Z",
  square: "M1 1H13V13H1Z",
  circle: "M7 0.5A6.5 6.5 0 1 1 7 13.5A6.5 6.5 0 1 1 7 0.5Z",
  hexagon: "M3.5 0.9H10.5L14 7L10.5 13.1H3.5L0 7Z",
  star: "M7 0.4L8.7 5.05L13.66 5.24L9.76 8.3L11.11 13.06L7 10.3L2.89 13.06L4.24 8.3L0.34 5.24L5.3 5.05Z",
  plus: "M5 0H9V5H14V9H9V14H5V9H0V5H5Z",
};

export const DEFAULT_SYMBOL: MilestoneSymbol = "diamond";

export function symbolPath(symbol: MilestoneSymbol): string {
  return PATHS[symbol];
}

/**
 * Die Form, die ein Meilenstein zeigt: die seiner Kategorie; ohne Kategorie
 * eine alte Angabe am Meilenstein; sonst die Raute.
 */
export function symbolOf(plan: Plan, item: PlanItem): MilestoneSymbol {
  const category = categoryOf(plan, item);
  if (category?.symbol !== undefined) return category.symbol;
  return (item.kind === "milestone" ? item.symbol : undefined) ?? DEFAULT_SYMBOL;
}
