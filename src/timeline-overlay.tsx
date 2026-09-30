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
 * Die Linien der Zeitfläche: Gitter, Stichtage, Heute und Abhängigkeiten.
 *
 * Eine SVG-Ebene hinter den Einträgen — Linien sind in SVG billig und scharf,
 * und hinter den Symbolen verdecken sie keines. Sie ist rein darstellend
 * (`aria-hidden`): was die Linien sagen, steht in den Details der Einträge.
 */

import React, { ReactElement, useId } from "react";

import { Anchor, TimelineLayout } from "./lane-layout";
import { Plan, PlanItem, colorOf } from "./plan-model";
import { AxisTiers } from "./time-scale";

export interface Dependency {
  from: string;
  to: string;
}

export interface TimelineOverlayProps {
  plan: Plan;
  width: number;
  layout: TimelineLayout;
  tiers: AxisTiers;
  todayX: number | null;
  dependencies: readonly Dependency[];
  selectedId: string | null;
  dimmedIds: ReadonlySet<string>;
}

function gridLines(tiers: AxisTiers, height: number): ReactElement[] {
  const strong = new Set((tiers.upper?.cells ?? []).map((cell) => Math.round(cell.x)));
  return tiers.lower.cells.map((cell) => {
    const x = Math.round(cell.x) + 0.5;
    const className = strong.has(Math.round(cell.x)) ? "man-pt__grid man-pt__grid--strong" : "man-pt__grid";
    return <line key={`g${cell.start}`} className={className} x1={x} x2={x} y1={0} y2={height} />;
  });
}

function dependencyPath(from: Anchor, to: Anchor): string {
  return `M ${from.outX} ${from.y} L ${to.inX} ${to.y}`;
}

export function TimelineOverlay(props: TimelineOverlayProps): ReactElement {
  const { plan, width, layout, tiers, todayX, dependencies, selectedId, dimmedIds } = props;
  const arrowId = `${useId().replace(/:/g, "")}-arrow`;
  const itemsById = new Map<string, PlanItem>(plan.items.map((item) => [item.id, item]));

  return (
    <svg className="man-pt__overlay" width={width} height={layout.height} aria-hidden="true" focusable="false">
      <defs>
        <marker id={arrowId} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
          <path d="M 0 0 L 8 4 L 0 8 z" className="man-pt__arrowhead" />
        </marker>
      </defs>

      <g>{gridLines(tiers, layout.lanesHeight)}</g>

      {layout.lanes.slice(1).map((lane) => (
        <line key={`l${lane.lane.id}`} className="man-pt__lane-rule" x1={0} x2={width} y1={lane.top + 0.5} y2={lane.top + 0.5} />
      ))}

      {layout.deadlines.map((deadline) => (
        <line
          key={`d${deadline.item.id}`}
          className={`man-pt__deadline-line${dimmedIds.has(deadline.item.id) ? " is-dimmed" : ""}`}
          style={{ stroke: colorOf(plan, deadline.item) }}
          x1={deadline.cx}
          x2={deadline.cx}
          y1={0}
          y2={deadline.markerTop}
        />
      ))}

      {todayX !== null && <line className="man-pt__today-line" x1={todayX} x2={todayX} y1={0} y2={layout.height} />}

      {dependencies.map(({ from, to }) => {
        const start = layout.anchors.get(from);
        const end = layout.anchors.get(to);
        if (start === undefined || end === undefined) return null;
        const touched = selectedId !== null && (selectedId === from || selectedId === to);
        const faded = (selectedId !== null && !touched) || dimmedIds.has(from) || dimmedIds.has(to);
        const className = ["man-pt__dependency", touched ? "is-active" : "", faded ? "is-faded" : ""].filter(Boolean).join(" ");
        return (
          <path
            key={`${from}>${to}`}
            className={className}
            d={dependencyPath(start, end)}
            markerEnd={`url(#${arrowId})`}
            data-dependency={`${itemsById.get(from)?.title ?? from} → ${itemsById.get(to)?.title ?? to}`}
          />
        );
      })}
    </svg>
  );
}
