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
 * Das Vorschaubild einer Vorlage in der Galerie: je Ebene eine Zeile, darin
 * Zeiträume als Balken und Meilensteine als Punkte, Stichtage als Linien über
 * alle Zeilen — in den Farben ihrer Kategorien.
 *
 * Bewusst nicht der Zeitstrahl selbst: der misst Text, legt Beschriftungen in
 * Stufen und zöge für zwei Kärtchen den ganzen Renderer samt Styles herein.
 * Hier zählt nur der Eindruck — wie dicht, wie lang, welche Farben.
 */

import * as React from "react";
import { ReactElement } from "react";

import { DayRange, firstDayOfMonth, lastDayOfMonth, parseIsoMonth } from "../calendar";
import { Plan, colorOf, isLaneItem, itemEndDay, itemStartDay, planExtent } from "../plan-model";

// Feste Maße für jede Vorlage: sonst stünden Name und Beschreibung in
// Karten mit wenigen Ebenen höher als nebenan. Die Zeilen teilen sich die Höhe.
const WIDTH = 240;
const HEIGHT = 72;
const PAD_X = 8;
const PAD_Y = 6;
const BAR_HEIGHT = 6;
const MILESTONE_RADIUS = 2.5;
/** Vorläufiges tritt zurück, wie im Zeitstrahl. */
const TENTATIVE_OPACITY = 0.45;

const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max);

/**
 * Der Zeitraum, den eine Vorlage zeigt: ihre Startansicht, sonst die Spanne
 * ihrer Einträge — beide Tage eingeschlossen; `null` ohne beides.
 */
export function templateRange(plan: Plan): DayRange | null {
  const start = plan.view && parseIsoMonth(plan.view.start);
  const end = plan.view && parseIsoMonth(plan.view.end);
  if (start && end) return { start: firstDayOfMonth(start), end: lastDayOfMonth(end) };
  return planExtent(plan.items);
}

/** Tag → x, auf die Fläche begrenzt: Einträge außerhalb der Startansicht kleben am Rand. */
function scaleX(range: DayRange): (day: number) => number {
  const span = Math.max(1, range.end + 1 - range.start);
  return (day) => clamp(PAD_X + ((day - range.start) / span) * (WIDTH - 2 * PAD_X), 0, WIDTH);
}

export function TemplateThumbnail({ plan }: { plan: Plan }): ReactElement {
  const row = (HEIGHT - 2 * PAD_Y) / Math.max(1, plan.lanes.length);
  const barHeight = Math.min(BAR_HEIGHT, row * 0.6);
  const radius = Math.min(MILESTONE_RADIUS, row * 0.3);
  const range = templateRange(plan);
  const rowOf = new Map(plan.lanes.map((lane, index) => [lane.id, index]));
  const centerOf = (index: number): number => PAD_Y + index * row + row / 2;
  const x = range === null ? null : scaleX(range);

  return (
    <svg
      className="man-pt-editor__template-thumb"
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      aria-hidden="true"
      focusable="false"
    >
      {plan.lanes.slice(1).map((lane, index) => (
        <line
          key={lane.id}
          className="man-pt-editor__thumb-rule"
          x1={0}
          x2={WIDTH}
          y1={PAD_Y + (index + 1) * row}
          y2={PAD_Y + (index + 1) * row}
        />
      ))}
      {x !== null &&
        plan.items.map((item) => {
          const color = colorOf(plan, item);
          const opacity = item.tentative ? TENTATIVE_OPACITY : undefined;
          if (!isLaneItem(item)) {
            const at = x(itemStartDay(item));
            return (
              <line
                key={item.id}
                className="man-pt-editor__thumb-deadline"
                x1={at}
                x2={at}
                y1={0}
                y2={HEIGHT}
                stroke={color}
                opacity={opacity}
              />
            );
          }
          const lane = rowOf.get(item.lane);
          if (lane === undefined) return null;
          if (item.kind === "milestone") {
            return (
              <circle
                key={item.id}
                className="man-pt-editor__thumb-milestone"
                cx={x(itemStartDay(item))}
                cy={centerOf(lane)}
                r={radius}
                fill={color}
                opacity={opacity}
              />
            );
          }
          const left = x(itemStartDay(item));
          const right = x(itemEndDay(item) + 1);
          return (
            <rect
              key={item.id}
              className="man-pt-editor__thumb-bar"
              x={left}
              y={centerOf(lane) - barHeight / 2}
              width={Math.max(1, right - left)}
              height={barHeight}
              rx={1}
              fill={color}
              opacity={opacity}
            />
          );
        })}
    </svg>
  );
}
