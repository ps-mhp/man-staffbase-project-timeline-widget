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
 * Wo jeder Eintrag steht.
 *
 * Innerhalb einer Ebene werden die Einträge auf Zeilen verteilt, damit sich
 * weder Symbole noch Beschriftungen überdecken. Eine Einheit ist ein einzelner
 * Eintrag oder eine ganze Serie; sie wird der ersten Zeile zugeteilt, deren
 * letzte Einheit weit genug links endet (erste passende Zeile, gierig).
 *
 * Zwei Skalen: `rowX` ist die ruhende, nach ihr wird verteilt; `x` ist die
 * laufende, nach ihr wird gezeichnet. Während einer Zoom-Geste bleiben so
 * Zeilen und Höhen stehen und nur die waagerechten Lagen folgen — nichts
 * springt unter den Fingern. Alles Senkrechte hängt deshalb nur an `rowX`.
 *
 * Senkrechte Lagen sind relativ zur Oberkante der ersten Ebene.
 */

import { Measure } from "./text-measure";
import {
  BarItem,
  DeadlineItem,
  Lane,
  LaneItem,
  MilestoneItem,
  Plan,
  PlanItem,
  colorOf,
  isLaneItem,
  itemEndDay,
  itemStartDay,
} from "./plan-model";

/** Maße in Pixeln; das Stylesheet zeichnet dieselben Größen. */
export const GEOMETRY = {
  markerSize: 14,
  barHeight: 22,
  connectorHeight: 8,
  arrowWidth: 10,
  labelMaxWidth: 120,
  labelLineHeight: 16,
  labelMaxLines: 3,
  labelGap: 4,
  labelTierGap: 2,
  unitGap: 8,
  rowGap: 8,
  lanePadding: 12,
  minLaneHeight: 48,
  barLabelPadding: 6,
  outsideLabelGap: 6,
  outsideLabelMaxWidth: 200,
  deadlineMarker: 12,
  deadlineBandPadding: 8,
} as const;

/**
 * Wörter brechen nicht dort, wo die Breite endet, sondern davor. Um diesen
 * Anteil wird die Zeilenbreite bei der Schätzung der Zeilenzahl gekürzt.
 */
const WRAP_EFFICIENCY = 0.85;

export interface LabelBox {
  left: number;
  top: number;
  width: number;
  lines: number;
  align: "center" | "start";
}

export interface PlacedMilestone {
  kind: "milestone";
  item: MilestoneItem;
  cx: number;
  cy: number;
  label: LabelBox | null;
}

export interface PlacedBar {
  kind: "bar";
  item: BarItem;
  left: number;
  width: number;
  top: number;
  height: number;
  /** Die Beschriftung neben dem Balken; `null`, wenn sie im Balken steht oder die Ebene eingeklappt ist. */
  label: LabelBox | null;
  labelInside: boolean;
  /** Wo der Text im Balken beginnt, ab seiner linken Kante — hinter Symbolen, die auf ihm sitzen. */
  textOffset: number;
}

export type PlacedLaneItem = PlacedMilestone | PlacedBar;

/** Die Leiste einer Serie ohne Balken, vom ersten bis zum letzten Meilenstein. */
export interface PlacedConnector {
  key: string;
  left: number;
  width: number;
  cy: number;
  color: string;
}

export interface LaneLayout {
  lane: Lane;
  top: number;
  height: number;
  collapsed: boolean;
  rowCount: number;
  items: PlacedLaneItem[];
  connectors: PlacedConnector[];
}

export interface PlacedDeadline {
  item: DeadlineItem;
  cx: number;
  /** Oberkante des Dreiecks; bis dahin reicht die Linie. */
  markerTop: number;
  label: LabelBox;
}

/** Wo eine Abhängigkeitslinie ansetzt: als Nachfolger bei `inX`, als Vorgänger bei `outX`. */
export interface Anchor {
  inX: number;
  outX: number;
  y: number;
}

export interface TimelineLayout {
  lanes: LaneLayout[];
  lanesHeight: number;
  deadlines: PlacedDeadline[];
  deadlineBand: { top: number; height: number };
  height: number;
  anchors: ReadonlyMap<string, Anchor>;
}

export interface LayoutInput {
  plan: Plan;
  /** Die sichtbaren Ebenen in Reihenfolge. */
  lanes: readonly Lane[];
  /** Die sichtbaren Einträge. */
  items: readonly PlanItem[];
  collapsed: ReadonlySet<string>;
  /** Die laufende Skala: Tag → x. */
  x: (day: number) => number;
  /** Die ruhende Skala, nach der verteilt wird. */
  rowX: (day: number) => number;
  measure: Measure;
  /**
   * Die Breite der Zeitfläche. Ist sie bekannt, rasten Beschriftungen sichtbarer
   * Symbole am Rand ein, statt halb abgeschnitten zu werden.
   */
  width?: number;
}

// ---------------------------------------------------------------------------
// Beschriftungen

interface LabelSize {
  width: number;
  lines: number;
}

function labelSize(text: string, measure: Measure): LabelSize {
  const natural = measure(text);
  const max = GEOMETRY.labelMaxWidth;
  if (natural <= max) return { width: natural, lines: 1 };
  return { width: max, lines: Math.min(GEOMETRY.labelMaxLines, Math.ceil(natural / (max * WRAP_EFFICIENCY))) };
}

const tierHeight = (lines: number): number => lines * GEOMETRY.labelLineHeight;

/** Die Mitte eines Tages; dort stehen Meilensteine und Stichtage. */
const pointX = (scale: (day: number) => number, day: number): number => scale(day + 0.5);

/** Linke und rechte Kante eines Zeitraums; das Ende ist einschließlich, also bis Mitternacht danach. */
const barEdges = (scale: (day: number) => number, item: BarItem): [number, number] => {
  const left = scale(itemStartDay(item));
  return [left, Math.max(scale(itemEndDay(item) + 1), left + 2)];
};

/**
 * Hält eine Beschriftung in der Zeitfläche, solange ihr Symbol darin steht.
 * Ist das Symbol hinausgewandert, bleibt sie mit ihm draußen — sonst stapelten
 * sich am Rand die Namen von Einträgen, die man gar nicht sieht.
 */
function clampLabel(box: LabelBox, anchorX: number, width: number | undefined): LabelBox {
  if (width === undefined || anchorX < 0 || anchorX > width || box.width >= width) return box;
  return { ...box, left: Math.min(Math.max(box.left, 0), width - box.width) };
}

/**
 * Wo der Text in einem Balken beginnt: hinter jedem Symbol der Serie, das
 * sonst auf dem Anfang des Textes säße („TMS1" unter „SOP 1. ALG BEV").
 */
function barTextOffset(bar: { left: number; width: number }, textWidth: number, markers: number[]): number {
  const half = GEOMETRY.markerSize / 2;
  let offset: number = GEOMETRY.barLabelPadding;
  for (const cx of [...markers].sort((a, b) => a - b)) {
    if (cx < bar.left || cx > bar.left + bar.width) continue;
    const textLeft = bar.left + offset;
    if (cx - half <= textLeft + textWidth && cx + half >= textLeft) offset = cx + half + GEOMETRY.labelGap - bar.left;
  }
  return offset;
}

/**
 * Staffelt zentrierte Beschriftungen so, dass keine die andere überdeckt:
 * jede kommt in die erste Stufe, in der links von ihr Platz ist.
 */
function packTiers(entries: { key: string; left: number; size: LabelSize }[]): {
  tierOf: Map<string, number>;
  heights: number[];
} {
  const rights: number[] = [];
  const heights: number[] = [];
  const tierOf = new Map<string, number>();
  const sorted = [...entries].sort((a, b) => a.left - b.left);
  for (const entry of sorted) {
    const left = entry.left;
    let tier = rights.findIndex((right) => right + GEOMETRY.labelGap <= left);
    if (tier === -1) {
      tier = rights.length;
      rights.push(-Infinity);
      heights.push(0);
    }
    rights[tier] = left + entry.size.width;
    heights[tier] = Math.max(heights[tier], tierHeight(entry.size.lines));
    tierOf.set(entry.key, tier);
  }
  return { tierOf, heights };
}

const tierOffsets = (heights: number[]): number[] =>
  heights.map((_, index) => heights.slice(0, index).reduce((sum, h) => sum + h + GEOMETRY.labelTierGap, 0));

const tiersHeight = (heights: number[]): number =>
  heights.length === 0 ? 0 : GEOMETRY.labelGap + heights.reduce((sum, h) => sum + h, 0) + GEOMETRY.labelTierGap * (heights.length - 1);

// ---------------------------------------------------------------------------
// Einheiten

interface Unit {
  key: string;
  items: LaneItem[];
  hasBar: boolean;
  /** Waagerechte Ausdehnung auf der ruhenden Skala, samt Beschriftungen. */
  left: number;
  right: number;
  height: number;
  topBand: number;
  /** Beschriftungsstufe je Meilenstein. */
  tierOf: Map<string, number>;
  tierOffsets: number[];
  /** Beschriftung der Zeiträume: im Balken oder daneben. */
  inside: Map<string, boolean>;
}

function groupUnits(items: LaneItem[]): LaneItem[][] {
  const series = new Map<string, LaneItem[]>();
  const units: LaneItem[][] = [];
  for (const item of items) {
    if (item.series === undefined) {
      units.push([item]);
      continue;
    }
    const group = series.get(item.series);
    if (group === undefined) {
      const created = [item];
      series.set(item.series, created);
      units.push(created);
    } else {
      group.push(item);
    }
  }
  return units;
}

function barFitsLabel(item: BarItem, width: number, measure: Measure): boolean {
  const room = width - 2 * GEOMETRY.barLabelPadding - (item.arrow ? GEOMETRY.arrowWidth : 0);
  return measure(item.title) <= room;
}

/** Die linke Kante einer zentrierten Beschriftung, eingerastet wie beim Zeichnen. */
function labelLeftAt(center: number, labelWidth: number, width: number | undefined): number {
  const box: LabelBox = { left: center - labelWidth / 2, top: 0, width: labelWidth, lines: 1, align: "center" };
  return clampLabel(box, center, width).left;
}

function measureUnit(
  items: LaneItem[],
  rowX: (day: number) => number,
  measure: Measure,
  collapsed: boolean,
  width: number | undefined,
): Unit {
  const hasBar = items.some((item) => item.kind === "bar");
  const topBand = hasBar || collapsed ? GEOMETRY.barHeight : GEOMETRY.markerSize;
  let left = Infinity;
  let right = -Infinity;
  const inside = new Map<string, boolean>();
  const labels: { key: string; left: number; size: LabelSize }[] = [];

  for (const item of items) {
    if (item.kind === "bar") {
      const [barLeft, barRight] = barEdges(rowX, item);
      const fits = collapsed || barFitsLabel(item, barRight - barLeft, measure);
      inside.set(item.id, fits);
      left = Math.min(left, barLeft);
      const labelRight = fits
        ? barRight
        : barRight + GEOMETRY.outsideLabelGap + Math.min(measure(item.title), GEOMETRY.outsideLabelMaxWidth);
      right = Math.max(right, labelRight);
    } else {
      const center = pointX(rowX, itemStartDay(item));
      left = Math.min(left, center - GEOMETRY.markerSize / 2);
      right = Math.max(right, center + GEOMETRY.markerSize / 2);
      if (!collapsed) {
        // Eingerastet wie beim Zeichnen — sonst ragte eine am Rand verschobene
        // Beschriftung in die Nachbarin, mit der die Verteilung nicht rechnete.
        const size = labelSize(item.title, measure);
        const labelLeft = labelLeftAt(center, size.width, width);
        labels.push({ key: item.id, left: labelLeft, size });
        left = Math.min(left, labelLeft);
        right = Math.max(right, labelLeft + size.width);
      }
    }
  }

  const { tierOf, heights } = packTiers(labels);
  return {
    key: items[0].series === undefined ? items[0].id : `${items[0].lane}\u0000${items[0].series}`,
    items,
    hasBar,
    left,
    right,
    height: topBand + tiersHeight(heights),
    topBand,
    tierOf,
    tierOffsets: tierOffsets(heights),
    inside,
  };
}

/** Teilt jede Einheit der ersten Zeile zu, in der sie Platz hat. Eingeklappt: alles auf eine Zeile. */
function assignRows(units: Unit[], collapsed: boolean): Unit[][] {
  if (collapsed) return units.length === 0 ? [] : [units];
  const rows: { right: number; units: Unit[] }[] = [];
  const sorted = [...units].sort((a, b) => a.left - b.left || a.key.localeCompare(b.key));
  for (const unit of sorted) {
    const row = rows.find((candidate) => candidate.right + GEOMETRY.unitGap <= unit.left);
    if (row === undefined) {
      rows.push({ right: unit.right, units: [unit] });
    } else {
      row.right = unit.right;
      row.units.push(unit);
    }
  }
  return rows.map((row) => row.units);
}

// ---------------------------------------------------------------------------
// Zeichnen

function placeUnit(
  plan: Plan,
  unit: Unit,
  rowTop: number,
  input: Pick<LayoutInput, "x" | "measure" | "width">,
  collapsed: boolean,
): { items: PlacedLaneItem[]; connector: PlacedConnector | null } {
  const { x, measure, width } = input;
  const bandCenter = rowTop + unit.topBand / 2;
  const labelsTop = rowTop + unit.topBand + GEOMETRY.labelGap;
  const markers = unit.items
    .filter((item): item is MilestoneItem => item.kind === "milestone")
    .map((item) => pointX(x, itemStartDay(item)));

  const items = unit.items.map((item): PlacedLaneItem => {
    if (item.kind === "bar") {
      const [left, right] = barEdges(x, item);
      const labelInside = unit.inside.get(item.id) ?? true;
      const label: LabelBox | null =
        collapsed || labelInside
          ? null
          : {
              left: right + GEOMETRY.outsideLabelGap,
              top: bandCenter - GEOMETRY.labelLineHeight / 2,
              width: Math.min(measure(item.title), GEOMETRY.outsideLabelMaxWidth),
              lines: 1,
              align: "start",
            };
      const inside = labelInside && !collapsed;
      const textOffset = inside
        ? barTextOffset({ left, width: right - left }, measure(item.title), markers)
        : GEOMETRY.barLabelPadding;
      return { kind: "bar", item, left, width: right - left, top: rowTop, height: GEOMETRY.barHeight, label, labelInside: inside, textOffset };
    }
    const cx = pointX(x, itemStartDay(item));
    const tier = unit.tierOf.get(item.id);
    const size = labelSize(item.title, measure);
    const label: LabelBox | null =
      collapsed || tier === undefined
        ? null
        : clampLabel(
            { left: cx - size.width / 2, top: labelsTop + unit.tierOffsets[tier], width: size.width, lines: size.lines, align: "center" },
            cx,
            width,
          );
    return { kind: "milestone", item, cx, cy: bandCenter, label };
  });

  const milestones = items.filter((entry): entry is PlacedMilestone => entry.kind === "milestone");
  const needsConnector = !collapsed && !unit.hasBar && milestones.length > 1;
  if (!needsConnector) return { items, connector: null };

  const byDate = [...milestones].sort((a, b) => a.cx - b.cx);
  const first = byDate[0];
  const last = byDate[byDate.length - 1];
  return {
    items,
    connector: { key: unit.key, left: first.cx, width: last.cx - first.cx, cy: bandCenter, color: colorOf(plan, first.item) },
  };
}

// ---------------------------------------------------------------------------
// Vorbereiten (ruhende Skala) und Platzieren (laufende Skala)
//
// Getrennt, weil beides verschieden oft anfällt: Zeilen, Stufen und Höhen
// hängen nur an der ruhenden Skala und ändern sich erst, wenn eine Geste
// ruht; die waagerechten Lagen folgen jedem Bild. Während eines Zooms wird so
// nur platziert, nicht jedes Mal neu verteilt.

interface PreparedRow {
  top: number;
  units: Unit[];
}

interface PreparedLane {
  lane: Lane;
  top: number;
  height: number;
  collapsed: boolean;
  rows: PreparedRow[];
}

interface PreparedDeadlineRow {
  top: number;
  items: DeadlineItem[];
}

/** Zeilen, Stufen und Höhen — alles, was nur an der ruhenden Skala hängt. */
export interface PreparedLayout {
  plan: Plan;
  measure: Measure;
  width: number | undefined;
  lanes: PreparedLane[];
  lanesHeight: number;
  deadlineRows: PreparedDeadlineRow[];
  deadlineBand: { top: number; height: number };
}

export type PrepareInput = Omit<LayoutInput, "x">;

function prepareLane(input: PrepareInput, lane: Lane, top: number): PreparedLane {
  const collapsed = input.collapsed.has(lane.id);
  const laneItems = input.items
    .filter(isLaneItem)
    .filter((item) => item.lane === lane.id)
    .sort((a, b) => itemStartDay(a) - itemStartDay(b) || a.id.localeCompare(b.id));
  const units = groupUnits(laneItems).map((group) => measureUnit(group, input.rowX, input.measure, collapsed, input.width));

  const rows: PreparedRow[] = [];
  let rowTop = top + GEOMETRY.lanePadding;
  assignRows(units, collapsed).forEach((row, index) => {
    if (index > 0) rowTop += GEOMETRY.rowGap;
    rows.push({ top: rowTop, units: row });
    rowTop += Math.max(...row.map((unit) => unit.height));
  });

  return { lane, top, height: Math.max(GEOMETRY.minLaneHeight, rowTop + GEOMETRY.lanePadding - top), collapsed, rows };
}

function prepareDeadlines(input: PrepareInput, top: number): { rows: PreparedDeadlineRow[]; height: number } {
  const deadlines = input.items
    .filter((item): item is DeadlineItem => item.kind === "deadline")
    .sort((a, b) => itemStartDay(a) - itemStartDay(b) || a.id.localeCompare(b.id));
  if (deadlines.length === 0) return { rows: [], height: 0 };

  const packed: { right: number; height: number; items: DeadlineItem[] }[] = [];
  for (const item of deadlines) {
    const center = pointX(input.rowX, itemStartDay(item));
    const size = labelSize(item.title, input.measure);
    const labelLeft = labelLeftAt(center, size.width, input.width);
    const unitLeft = Math.min(labelLeft, center - GEOMETRY.deadlineMarker / 2);
    const unitRight = Math.max(labelLeft + size.width, center + GEOMETRY.deadlineMarker / 2);
    const height = GEOMETRY.deadlineMarker + GEOMETRY.labelGap + tierHeight(size.lines);
    const row = packed.find((candidate) => candidate.right + GEOMETRY.unitGap <= unitLeft);
    if (row === undefined) {
      packed.push({ right: unitRight, height, items: [item] });
    } else {
      row.right = unitRight;
      row.height = Math.max(row.height, height);
      row.items.push(item);
    }
  }

  const rows: PreparedDeadlineRow[] = [];
  let rowTop = top + GEOMETRY.deadlineBandPadding;
  packed.forEach((row, index) => {
    if (index > 0) rowTop += GEOMETRY.rowGap;
    rows.push({ top: rowTop, items: row.items });
    rowTop += row.height;
  });
  return { rows, height: rowTop + GEOMETRY.deadlineBandPadding - top };
}

/** Verteilt auf Zeilen; teuer, deshalb nur mit der ruhenden Skala. */
export function prepareLayout(input: PrepareInput): PreparedLayout {
  const lanes: PreparedLane[] = [];
  let top = 0;
  for (const lane of input.lanes) {
    const prepared = prepareLane(input, lane, top);
    lanes.push(prepared);
    top += prepared.height;
  }
  const band = prepareDeadlines(input, top);
  return {
    plan: input.plan,
    measure: input.measure,
    width: input.width,
    lanes,
    lanesHeight: top,
    deadlineRows: band.rows,
    deadlineBand: { top, height: band.height },
  };
}

function placeLane(prepared: PreparedLayout, lane: PreparedLane, x: (day: number) => number): LaneLayout {
  const items: PlacedLaneItem[] = [];
  const connectors: PlacedConnector[] = [];
  const input = { x, measure: prepared.measure, width: prepared.width };
  for (const row of lane.rows) {
    for (const unit of row.units) {
      const placed = placeUnit(prepared.plan, unit, row.top, input, lane.collapsed);
      items.push(...placed.items);
      if (placed.connector !== null) connectors.push(placed.connector);
    }
  }
  return {
    lane: lane.lane,
    top: lane.top,
    height: lane.height,
    collapsed: lane.collapsed,
    rowCount: lane.rows.length,
    items,
    connectors,
  };
}

function placeDeadlines(prepared: PreparedLayout, x: (day: number) => number): PlacedDeadline[] {
  return prepared.deadlineRows.flatMap((row) =>
    row.items.map((item) => {
      const cx = pointX(x, itemStartDay(item));
      const size = labelSize(item.title, prepared.measure);
      return {
        item,
        cx,
        markerTop: row.top,
        label: clampLabel(
          {
            left: cx - size.width / 2,
            top: row.top + GEOMETRY.deadlineMarker + GEOMETRY.labelGap,
            width: size.width,
            lines: size.lines,
            align: "center",
          },
          cx,
          prepared.width,
        ),
      };
    }),
  );
}

function anchorsOf(lanes: LaneLayout[]): Map<string, Anchor> {
  const anchors = new Map<string, Anchor>();
  for (const entry of lanes.flatMap((lane) => lane.items)) {
    anchors.set(
      entry.item.id,
      entry.kind === "bar"
        ? { inX: entry.left, outX: entry.left + entry.width, y: entry.top + entry.height / 2 }
        : { inX: entry.cx, outX: entry.cx, y: entry.cy },
    );
  }
  return anchors;
}

/** Setzt einen vorbereiteten Plan auf die laufende Skala; billig genug für jedes Bild. */
export function placeLayout(prepared: PreparedLayout, x: (day: number) => number): TimelineLayout {
  const lanes = prepared.lanes.map((lane) => placeLane(prepared, lane, x));
  return {
    lanes,
    lanesHeight: prepared.lanesHeight,
    deadlines: placeDeadlines(prepared, x),
    deadlineBand: prepared.deadlineBand,
    height: prepared.lanesHeight + prepared.deadlineBand.height,
    anchors: anchorsOf(lanes),
  };
}

export function layoutTimeline(input: LayoutInput): TimelineLayout {
  return placeLayout(prepareLayout(input), input.x);
}
