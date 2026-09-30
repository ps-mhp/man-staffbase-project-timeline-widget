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
 * Die Übersicht unter dem Plan.
 *
 * Wer tief hineingezoomt hat, verliert leicht, wo im Plan er steht. Der
 * Streifen zeigt immer den ganzen Gesamtzeitraum, und das Fenster darauf den
 * sichtbaren Ausschnitt: ziehen verschiebt, an den Kanten ziehen zoomt, ein
 * Druck daneben springt dorthin. Für die Tastatur ist das Fenster ein
 * Schieberegler.
 */

import * as React from "react";
import { CSSProperties, ReactElement, memo, useRef } from "react";

import { useHotStyle } from "@shared/hot-style";

import { Viewport } from "./calendar";
import { Lane, Plan, PlanItem, colorOf, itemEndDay, itemStartDay } from "./plan-model";
import overviewCss from "./styles/overview.scss";
import { MAX_PX_PER_DAY, clampViewport, describeViewport, panViewport } from "./time-scale";
import { useElementWidth } from "./use-element-width";

export interface OverviewStripProps {
  plan: Plan;
  /** Die sichtbaren Ebenen in Reihenfolge. */
  lanes: Lane[];
  /** Die sichtbaren Einträge (nach Filter). */
  items: PlanItem[];
  world: Viewport;
  viewport: Viewport;
  locale: string;
  onChange(viewport: Viewport): void;
}

const WINDOW_LABEL = "Sichtbarer Zeitraum";

/** Ein Tastendruck verschiebt um ein Zehntel des Ausschnitts — genug, um voranzukommen, ohne den Faden zu verlieren. */
const KEY_STEP = 0.1;

type DragMode = "move" | "start" | "end";

interface Drag {
  mode: DragMode;
  pointerId: number;
  /** Wo der Zeiger aufsetzte; gerechnet wird immer von hier aus, nicht vom letzten Schritt. */
  originX: number;
  origin: Viewport;
  /** Breite des Streifens beim Aufsetzen, in px. */
  stripWidth: number;
}

const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max);

/** Tag → Anteil der Welt in Prozent. Prozent statt Pixel: so braucht das Zeichnen keine Messung. */
function percentIn(world: Viewport): (day: number) => number {
  const span = world.end - world.start;
  return (day) => (span > 0 ? ((day - world.start) / span) * 100 : 0);
}

/** Der Ausschnitt, der aus einem Zug um `deltaDays` hervorgeht. */
function dragged(drag: Drag, deltaDays: number, world: Viewport, width: number): Viewport {
  const { origin } = drag;
  // An einer Kante wird nur diese Kante bewegt; die andere bleibt stehen.
  // `clampViewport` allein dehnte eine zu schmale Spanne um die Mitte und
  // zöge dabei die festgehaltene Kante mit.
  const minSpan = width / MAX_PX_PER_DAY;
  switch (drag.mode) {
    case "move":
      return panViewport(origin, deltaDays, world, width);
    case "start":
      return clampViewport(
        { start: clamp(origin.start + deltaDays, world.start, origin.end - minSpan), end: origin.end },
        world,
        width,
      );
    case "end":
      return clampViewport(
        { start: origin.start, end: clamp(origin.end + deltaDays, origin.start + minSpan, world.end) },
        world,
        width,
      );
  }
}

/** Wohin eine Taste das Fenster schiebt; `null` für Tasten, die es nicht betreffen. */
function keyTarget(key: string, viewport: Viewport, world: Viewport, width: number): Viewport | null {
  const span = viewport.end - viewport.start;
  switch (key) {
    case "ArrowLeft":
      return panViewport(viewport, -span * KEY_STEP, world, width);
    case "ArrowRight":
      return panViewport(viewport, span * KEY_STEP, world, width);
    case "Home":
      return clampViewport({ start: world.start, end: world.start + span }, world, width);
    case "End":
      return clampViewport({ start: world.end - span, end: world.end }, world, width);
    default:
      return null;
  }
}

/**
 * Die Werte des Schiebereglers in Tagen. Der Regler steht für den Beginn des
 * Fensters; am rechten Anschlag ist das die Welt minus die Spanne.
 */
function sliderValues(viewport: Viewport, world: Viewport): { min: number; max: number; now: number } {
  const min = Math.round(world.start);
  const max = Math.max(min, Math.round(world.end - (viewport.end - viewport.start)));
  return { min, max, now: clamp(Math.round(viewport.start), min, max) };
}

function markStyle(plan: Plan, item: PlanItem, percent: (day: number) => number): CSSProperties {
  const backgroundColor = colorOf(plan, item);
  if (item.kind === "bar") {
    const start = percent(itemStartDay(item));
    // Der letzte Tag gehört dazu: der Balken endet erst an seinem Ende.
    return { left: `${start}%`, width: `${percent(itemEndDay(item) + 1) - start}%`, backgroundColor };
  }
  // Ein Zeitpunkt steht mitten auf seinem Tag, der das Intervall [d, d + 1) belegt.
  return { left: `${percent(itemStartDay(item) + 0.5)}%`, backgroundColor };
}

interface MarksProps {
  plan: Plan;
  lanes: Lane[];
  items: PlanItem[];
  world: Viewport;
}

/**
 * Die Spuren mit ihren Strichen. Eigene, gemerkte Komponente: beim Ziehen
 * ändert sich nur das Fenster, und bis zu 300 Striche neu zu vergleichen
 * brächte dabei nichts.
 */
const OverviewMarks = memo(function OverviewMarks({ plan, lanes, items, world }: MarksProps): ReactElement {
  const percent = percentIn(world);
  const deadlines = items.filter((item) => item.kind === "deadline");
  const mark = (item: PlanItem) => (
    <span
      key={item.id}
      data-id={item.id}
      className={`man-pt-overview__mark man-pt-overview__mark--${item.kind}`}
      style={markStyle(plan, item, percent)}
    />
  );

  return (
    <>
      <div className="man-pt-overview__tracks" aria-hidden="true">
        {lanes.map((lane) => (
          <div key={lane.id} className="man-pt-overview__track">
            {items.filter((item) => item.kind !== "deadline" && item.lane === lane.id).map(mark)}
          </div>
        ))}
      </div>
      <div className="man-pt-overview__deadlines" aria-hidden="true">
        {deadlines.map(mark)}
      </div>
    </>
  );
});

export function OverviewStrip({ plan, lanes, items, world, viewport, locale, onChange }: OverviewStripProps): ReactElement {
  const css = useHotStyle(overviewCss, "project-timeline-widget", "styles/overview.scss");
  const rootRef = useRef<HTMLDivElement>(null);
  // Die eigene Breite begrenzt, wie schmal das Fenster gezogen werden darf;
  // die Übersicht steht unter der Zeitfläche und ist so breit wie sie.
  const width = useElementWidth(rootRef);
  const dragRef = useRef<Drag | null>(null);

  const worldSpan = world.end - world.start;
  const percent = percentIn(world);
  const slider = sliderValues(viewport, world);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (!(rect.width > 0) || !(worldSpan > 0)) return;

    const target = event.target instanceof Element ? event.target : null;
    const edge = target?.closest("[data-edge]")?.getAttribute("data-edge");
    const onWindow = target?.closest("[role=slider]") != null;
    const mode: DragMode = edge === "start" || edge === "end" ? edge : "move";

    // Daneben gedrückt: das Fenster springt mittig dorthin und hängt dann am
    // Zeiger, damit Springen und Nachziehen ein Griff sind.
    const day = world.start + ((event.clientX - rect.left) / rect.width) * worldSpan;
    const span = viewport.end - viewport.start;
    const origin = onWindow ? viewport : clampViewport({ start: day - span / 2, end: day + span / 2 }, world, width);
    if (!onWindow) onChange(origin);

    dragRef.current = { mode, pointerId: event.pointerId, originX: event.clientX, origin, stripWidth: rect.width };
    // Ohne Capture verlöre der Streifen den Zeiger, sobald er ihn verlässt.
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (drag === null || drag.pointerId !== event.pointerId) return;
    const deltaDays = ((event.clientX - drag.originX) / drag.stripWidth) * worldSpan;
    // Vor der ersten Messung hilft die Breite beim Aufsetzen; sonst gäbe es
    // keine Mindestspanne und das Fenster ließe sich auf null zusammenziehen.
    onChange(dragged(drag, deltaDays, world, width > 0 ? width : drag.stripWidth));
  };

  const endDrag = () => {
    dragRef.current = null;
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const next = keyTarget(event.key, viewport, world, width);
    if (next === null) return;
    event.preventDefault();
    onChange(next);
  };

  return (
    <div
      ref={rootRef}
      className="man-pt-overview"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onLostPointerCapture={endDrag}
    >
      <style>{css}</style>
      <OverviewMarks plan={plan} lanes={lanes} items={items} world={world} />
      <div
        className="man-pt-overview__window"
        role="slider"
        tabIndex={0}
        aria-label={WINDOW_LABEL}
        aria-valuemin={slider.min}
        aria-valuemax={slider.max}
        aria-valuenow={slider.now}
        aria-valuetext={describeViewport(viewport, locale)}
        style={{
          left: `${percent((viewport.start + viewport.end) / 2)}%`,
          width: `${worldSpan > 0 ? ((viewport.end - viewport.start) / worldSpan) * 100 : 100}%`,
        }}
        onKeyDown={onKeyDown}
      >
        <span className="man-pt-overview__handle man-pt-overview__handle--start" data-edge="start" />
        <span className="man-pt-overview__handle man-pt-overview__handle--end" data-edge="end" />
      </div>
    </div>
  );
}
