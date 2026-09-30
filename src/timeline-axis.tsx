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
 * Die zweistufige Achse über der Zeitfläche.
 *
 * Eine obere Zelle, die links aus dem Ausschnitt ragt — das Jahr 2025, wenn
 * schon im Mai begonnen wird —, behält ihre Beschriftung an der linken Kante,
 * statt sie mit hinauszuschieben. Sonst stünde dort oft kein Jahr.
 */

import React, { ReactElement } from "react";

import { AxisCell, AxisTiers, AxisUnit } from "./time-scale";

export interface TimelineAxisProps {
  tiers: AxisTiers;
  width: number;
  todayX: number | null;
}

/**
 * Unter dieser sichtbaren Breite bleibt eine Zelle unbeschriftet. Ein Stummel
 * am Rand — etwa der Rand vor dem ersten Quartal — zeigte sonst „2…" oder „Q".
 */
const MIN_LABEL_WIDTH = 28;

/** Darunter wird ein Jahr zweistellig: „’25" statt eines abgeschnittenen „2…". */
const FULL_YEAR_WIDTH = 44;

function labelOf(cell: AxisCell, unit: AxisUnit, visible: number): string {
  return unit === "year" && visible < FULL_YEAR_WIDTH && /^\d{4}$/.test(cell.label) ? `’${cell.label.slice(2)}` : cell.label;
}

function Cells({ cells, unit, width, tier }: { cells: AxisCell[]; unit: AxisUnit; width: number; tier: "upper" | "lower" }) {
  return (
    <div className={`man-pt__axis-row man-pt__axis-row--${tier}`}>
      {cells.map((cell) => {
        const labelLeft = Math.max(cell.x, 0);
        const labelRight = Math.min(cell.x + cell.width, width);
        const visible = labelRight - labelLeft;
        return (
          <div key={cell.start} className="man-pt__axis-cell" style={{ left: cell.x, width: cell.width }}>
            {visible >= MIN_LABEL_WIDTH && (
              <span className="man-pt__axis-label" style={{ left: labelLeft - cell.x, maxWidth: visible }}>
                {labelOf(cell, unit, visible)}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function TimelineAxis({ tiers, width, todayX }: TimelineAxisProps): ReactElement {
  return (
    <div className="man-pt__axis" aria-hidden="true">
      {tiers.upper !== null && <Cells cells={tiers.upper.cells} unit={tiers.upper.unit} width={width} tier="upper" />}
      <Cells cells={tiers.lower.cells} unit={tiers.lower.unit} width={width} tier="lower" />
      {todayX !== null && todayX >= 0 && todayX <= width && (
        <span className="man-pt__today-tag" style={{ left: todayX }}>
          Heute
        </span>
      )}
    </div>
  );
}
