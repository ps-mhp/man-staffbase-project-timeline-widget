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
 * Die Bühne des Zeitstrahls: links die Titel der Ebenen, rechts die Achse und
 * darunter die Zeitfläche mit Linien und Einträgen.
 *
 * Ein Raster aus vier Zellen, damit Achse und Zeitfläche dieselbe Breite haben
 * und die Achse beim Scrollen der Seite oben stehen bleibt (`sticky`). Die
 * Zeitfläche schneidet waagerecht mit `overflow-x: clip` ab statt mit
 * `hidden` — `hidden` machte sie zum Scroll-Container, und `sticky` hinge dann
 * an ihr statt an der Seite.
 */

import React, { CSSProperties, KeyboardEvent, ReactElement, RefObject } from "react";

import { TimelineAxis } from "./timeline-axis";
import { BarItemView, DeadlineMarker, ItemState, MilestoneMarker } from "./timeline-item";
import { Dependency, TimelineOverlay } from "./timeline-overlay";
import { GEOMETRY, LaneLayout, TimelineLayout } from "./lane-layout";
import { Plan } from "./plan-model";
import { AxisTiers } from "./time-scale";

export interface TimelineStageProps {
  plan: Plan;
  locale: string;
  mode: "page" | "editor";
  layout: TimelineLayout;
  tiers: AxisTiers;
  width: number;
  todayX: number | null;
  dependencies: readonly Dependency[];
  selectedId: string | null;
  /** Der zuletzt angesprungene Suchtreffer. */
  currentId: string | null;
  relatedIds: ReadonlySet<string>;
  dimmedIds: ReadonlySet<string>;
  focusId: string | null;
  bodyRef: RefObject<HTMLDivElement | null>;
  hint: boolean;
  onToggleLane: (laneId: string) => void;
  onActivate: (id: string, element: HTMLElement) => void;
  onFocusItem: (id: string) => void;
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
}

function LaneHead({ lane, onToggle }: { lane: LaneLayout; onToggle: () => void }): ReactElement {
  return (
    <div className="man-pt__lane-head" style={{ top: lane.top, height: lane.height }}>
      <button
        type="button"
        className="man-pt__lane-toggle"
        aria-expanded={!lane.collapsed}
        aria-label={`${lane.lane.title} ${lane.collapsed ? "aufklappen" : "einklappen"}`}
        onClick={onToggle}
      >
        <span className="man-pt__lane-chevron" aria-hidden="true" />
      </button>
      <span className="man-pt__lane-title">{lane.lane.title}</span>
    </div>
  );
}

export function TimelineStage(props: TimelineStageProps): ReactElement {
  const { plan, locale, layout, tiers, width, todayX, selectedId, relatedIds, dimmedIds, focusId } = props;

  const stateOf = (id: string): ItemState => ({
    focusable: id === focusId,
    selected: id === selectedId,
    current: id === props.currentId,
    related: relatedIds.has(id),
    dimmed: dimmedIds.has(id),
    expanded: props.mode === "page" ? id === selectedId : undefined,
  });
  const common = { plan, locale, onActivate: props.onActivate, onFocusItem: props.onFocusItem };

  return (
    <div className="man-pt__stage" style={{ "--pt-body-height": `${layout.height}px` } as CSSProperties}>
      <div className="man-pt__corner" aria-hidden="true" />
      <div className="man-pt__axis-host">
        <TimelineAxis tiers={tiers} width={width} todayX={todayX} />
      </div>

      <div className="man-pt__heads">
        {layout.lanes.map((lane) => (
          <LaneHead key={lane.lane.id} lane={lane} onToggle={() => props.onToggleLane(lane.lane.id)} />
        ))}
        {layout.deadlineBand.height > 0 && (
          <div className="man-pt__lane-head man-pt__lane-head--deadlines" style={{ top: layout.deadlineBand.top, height: layout.deadlineBand.height }}>
            <span className="man-pt__lane-title">Stichtage</span>
          </div>
        )}
      </div>

      <div
        ref={props.bodyRef}
        className="man-pt__body"
        role="group"
        aria-label="Zeitstrahl. Pfeiltasten wechseln zwischen Einträgen, Plus und Minus zoomen. Die Listenansicht zeigt dieselben Einträge als Tabelle."
        onKeyDown={props.onKeyDown}
      >
        <TimelineOverlay
          plan={plan}
          width={width}
          layout={layout}
          tiers={tiers}
          todayX={todayX}
          dependencies={props.dependencies}
          selectedId={selectedId}
          dimmedIds={dimmedIds}
        />

        {layout.lanes.flatMap((lane) =>
          lane.connectors.map((connector) => (
            <span
              key={connector.key}
              className="man-pt__connector"
              aria-hidden="true"
              style={
                {
                  left: connector.left,
                  width: connector.width,
                  top: connector.cy - GEOMETRY.connectorHeight / 2,
                  "--pt-color": connector.color,
                } as CSSProperties
              }
            />
          )),
        )}

        {layout.lanes.flatMap((lane) =>
          lane.items.map((placed) =>
            placed.kind === "bar" ? (
              <BarItemView key={placed.item.id} {...common} placed={placed} state={stateOf(placed.item.id)} />
            ) : (
              <MilestoneMarker key={placed.item.id} {...common} placed={placed} state={stateOf(placed.item.id)} />
            ),
          ),
        )}

        {layout.deadlines.map((placed) => (
          <DeadlineMarker key={placed.item.id} {...common} placed={placed} state={stateOf(placed.item.id)} />
        ))}

        {props.hint && (
          <p className="man-pt__hint" role="status">
            Zum Zoomen Strg/⌘ gedrückt halten
          </p>
        )}
      </div>
    </div>
  );
}
