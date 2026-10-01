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
 * Ein Eintrag auf der Zeitfläche: Meilenstein, Zeitraum oder Stichtag.
 *
 * Jeder ist ein echter Button — mit Tastatur erreichbar, mit sprechendem Namen.
 * Die Beschriftung ist ein Kind des Buttons, damit auch ein Klick auf den Text
 * die Details öffnet; ihre Lage kommt aus dem Layout und wird hier nur auf die
 * linke obere Ecke des Buttons umgerechnet.
 */

import React, { CSSProperties, ReactElement } from "react";

import { inkFor } from "./color";
import { GEOMETRY, LabelBox, PlacedBar, PlacedDeadline, PlacedMilestone } from "./lane-layout";
import { accessibleName } from "./item-text";
import { Plan, PlanItem, colorOf } from "./plan-model";
import { symbolOf, symbolPath } from "./symbols";

export interface ItemState {
  /** Der eine Tab-Stopp der Zeitfläche. */
  focusable: boolean;
  selected: boolean;
  /** Der Suchtreffer, zu dem Enter zuletzt gesprungen ist. */
  current: boolean;
  /** Mit dem gewählten Eintrag über eine Abhängigkeit verbunden. */
  related: boolean;
  /** Kein Suchtreffer, solange gesucht wird. */
  dimmed: boolean;
  /** Ob die Details dieses Eintrags offen sind; `undefined`, wo es keine Details gibt (Editor). */
  expanded?: boolean;
}

interface CommonProps {
  plan: Plan;
  locale: string;
  state: ItemState;
  onActivate: (id: string, element: HTMLElement) => void;
  onFocusItem: (id: string) => void;
}

type Style = CSSProperties & Record<`--${string}`, string | number>;

function classes(base: string, item: PlanItem, state: ItemState, extra: string[] = []): string {
  return [
    "man-pt__item",
    base,
    ...extra,
    item.tentative ? "is-tentative" : "",
    state.selected ? "is-selected" : "",
    state.current ? "is-current" : "",
    state.related ? "is-related" : "",
    state.dimmed ? "is-dimmed" : "",
  ]
    .filter(Boolean)
    .join(" ");
}

/** Die Beschriftung, relativ zur linken oberen Ecke des Buttons. */
function Label({ box, originX, originY, text }: { box: LabelBox; originX: number; originY: number; text: string }) {
  const style: Style = {
    left: box.left - originX,
    top: box.top - originY,
    width: Math.ceil(box.width) + 2,
    "--pt-lines": box.lines,
  };
  return (
    <span className={`man-pt__label man-pt__label--${box.align}`} style={style} aria-hidden="true">
      {text}
    </span>
  );
}

function buttonProps(item: PlanItem, props: CommonProps) {
  return {
    type: "button" as const,
    "data-item-id": item.id,
    "aria-label": accessibleName(props.plan, item, props.locale),
    "aria-expanded": props.state.expanded,
    tabIndex: props.state.focusable ? 0 : -1,
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => props.onActivate(item.id, event.currentTarget),
    onFocus: () => props.onFocusItem(item.id),
  };
}

export function MilestoneMarker(props: CommonProps & { placed: PlacedMilestone }): ReactElement {
  const { placed, plan } = props;
  const { item, cx, cy, label } = placed;
  const half = GEOMETRY.markerSize / 2;
  const style: Style = { left: cx - half, top: cy - half, "--pt-color": colorOf(plan, item) };
  // Die Form kommt von der Kategorie, wie die Farbe (`symbols.ts`).
  const symbol = symbolOf(plan, item);
  return (
    <button
      {...buttonProps(item, props)}
      className={classes("man-pt__milestone", item, props.state, [`man-pt__milestone--${symbol}`])}
      style={style}
    >
      <svg className="man-pt__symbol" viewBox="0 0 14 14" aria-hidden="true" focusable="false">
        <path d={symbolPath(symbol)} />
      </svg>
      {label !== null && <Label box={label} originX={cx - half} originY={cy - half} text={item.title} />}
    </button>
  );
}

export function BarItemView(props: CommonProps & { placed: PlacedBar }): ReactElement {
  const { placed, plan } = props;
  const { item, left, top, width, height, label, labelInside, textOffset } = placed;
  const color = colorOf(plan, item);
  const style: Style = { left, top, width, height, "--pt-color": color, "--pt-ink": inkFor(color) };
  return (
    <button
      {...buttonProps(item, props)}
      className={classes("man-pt__bar", item, props.state, item.arrow ? ["man-pt__bar--arrow"] : [])}
      style={style}
    >
      <span className="man-pt__bar-fill" aria-hidden="true" />
      {labelInside && (
        <span className="man-pt__bar-text" style={{ paddingLeft: textOffset }} aria-hidden="true">
          {item.title}
        </span>
      )}
      {label !== null && <Label box={label} originX={left} originY={top} text={item.title} />}
    </button>
  );
}

export function DeadlineMarker(props: CommonProps & { placed: PlacedDeadline }): ReactElement {
  const { placed, plan } = props;
  const { item, cx, markerTop, label } = placed;
  const half = GEOMETRY.deadlineMarker / 2;
  const style: Style = { left: cx - half, top: markerTop, "--pt-color": colorOf(plan, item) };
  return (
    <button {...buttonProps(item, props)} className={classes("man-pt__deadline", item, props.state)} style={style}>
      <span className="man-pt__symbol" aria-hidden="true" />
      <Label box={label} originX={cx - half} originY={markerTop} text={item.title} />
    </button>
  );
}
