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

import { parseIsoDate } from "./calendar";
import { GEOMETRY, LayoutInput, PlacedBar, PlacedMilestone, layoutTimeline } from "./lane-layout";
import { Plan, PlanItem } from "./plan-model";

const day = (text: string): number => parseIsoDate(text) as number;

/** 2 px je Tag ab dem 01.01.2025 — genug Platz, dass nur echte Nähe kollidiert. */
const ORIGIN = day("2025-01-01");
const scaleOf =
  (pxPerDay: number) =>
  (d: number): number =>
    (d - ORIGIN) * pxPerDay;

/** Jede Beschriftung 7 px je Zeichen, wie die Schätzung ohne Canvas. */
const measure = (text: string): number => text.length * 7;

const plan = (items: PlanItem[]): Plan => ({
  version: 1,
  lanes: [
    { id: "a", title: "Ebene A" },
    { id: "b", title: "Ebene B" },
  ],
  categories: [{ id: "c", title: "Kat", color: "#7B2FA0" }],
  items,
});

const milestone = (id: string, date: string, extra: Partial<PlanItem> = {}): PlanItem =>
  ({ id, kind: "milestone", lane: "a", title: id, date, ...extra }) as PlanItem;

const bar = (id: string, start: string, end: string, extra: Partial<PlanItem> = {}): PlanItem =>
  ({ id, kind: "bar", lane: "a", title: id, start, end, ...extra }) as PlanItem;

function layout(items: PlanItem[], overrides: Partial<LayoutInput> = {}) {
  const p = plan(items);
  return layoutTimeline({
    plan: p,
    lanes: p.lanes,
    items: p.items,
    collapsed: new Set(),
    x: scaleOf(2),
    rowX: scaleOf(2),
    measure,
    ...overrides,
  });
}

const placed = (result: ReturnType<typeof layout>, id: string) =>
  result.lanes.flatMap((lane) => lane.items).find((entry) => entry.item.id === id);

describe("layoutTimeline", () => {
  it("setzt Einträge mit Abstand auf eine Zeile", () => {
    const result = layout([milestone("m1", "2025-01-10"), milestone("m2", "2025-06-10")]);
    expect(result.lanes[0].rowCount).toBe(1);
  });

  it("verteilt sich überdeckende Einträge auf Zeilen", () => {
    const one = layout([milestone("m1", "2025-01-10")]);
    const two = layout([milestone("m1", "2025-01-10"), milestone("m2", "2025-01-12")]);
    expect(two.lanes[0].rowCount).toBe(2);
    expect(two.lanes[0].height).toBeGreaterThan(one.lanes[0].height);
    const [first, second] = ["m1", "m2"].map((id) => placed(two, id) as PlacedMilestone);
    expect(second.cy).toBeGreaterThan(first.cy);
  });

  it("zentriert einen Meilenstein auf seinem Tag", () => {
    const result = layout([milestone("m1", "2025-01-11")]);
    expect((placed(result, "m1") as PlacedMilestone).cx).toBe(10.5 * 2);
  });

  it("hält eine Serie auf einer Zeile und verbindet sie mit einer Leiste", () => {
    const result = layout([
      milestone("s1", "2025-01-10", { series: "S", category: "c" }),
      milestone("s2", "2025-01-12", { series: "S" }),
      milestone("s3", "2025-01-14", { series: "S" }),
    ]);
    const lane = result.lanes[0];
    expect(lane.rowCount).toBe(1);
    const centers = ["s1", "s2", "s3"].map((id) => (placed(result, id) as PlacedMilestone).cx);
    expect(lane.connectors).toEqual([
      expect.objectContaining({ left: centers[0], width: centers[2] - centers[0], color: "#7B2FA0" }),
    ]);
  });

  it("staffelt die Beschriftungen einer dichten Serie untereinander", () => {
    const result = layout([
      milestone("Erster Termin", "2025-01-10", { series: "S" }),
      milestone("Zweiter Termin", "2025-01-12", { series: "S" }),
    ]);
    const [first, second] = ["Erster Termin", "Zweiter Termin"].map(
      (id) => (placed(result, id) as PlacedMilestone).label!,
    );
    expect(second.top).toBeGreaterThan(first.top);
  });

  it("setzt die Meilensteine einer Serie auf deren Balken", () => {
    const result = layout([
      bar("TMS1", "2025-01-01", "2025-12-31", { series: "T" }),
      milestone("BEV", "2025-03-01", { series: "T" }),
    ]);
    const tms = placed(result, "TMS1") as PlacedBar;
    const bev = placed(result, "BEV") as PlacedMilestone;
    expect(result.lanes[0].rowCount).toBe(1);
    expect(bev.cy).toBe(tms.top + tms.height / 2);
    expect(bev.label!.top).toBeGreaterThanOrEqual(tms.top + tms.height);
    expect(result.lanes[0].connectors).toEqual([]);
  });

  it("schreibt in den Balken, wenn die Beschriftung passt, sonst daneben", () => {
    const wide = layout([bar("TMS1", "2025-01-01", "2025-12-31")]);
    const narrow = layout([bar("Ein langer Zeitraum", "2025-01-01", "2025-01-05")]);
    expect((placed(wide, "TMS1") as PlacedBar).labelInside).toBe(true);
    const outside = placed(narrow, "Ein langer Zeitraum") as PlacedBar;
    expect(outside.labelInside).toBe(false);
    expect(outside.label!.left).toBeGreaterThan(outside.left + outside.width);
  });

  it("rechnet mit der Beschriftung neben dem Balken, wenn es um Überdeckung geht", () => {
    const result = layout([
      bar("Ein langer Zeitraum", "2025-01-01", "2025-01-05"),
      milestone("m", "2025-02-10"),
    ]);
    expect(result.lanes[0].rowCount).toBe(2);
  });

  it("verteilt nach der ruhenden Skala, nicht nach der laufenden Geste", () => {
    const items = [milestone("m1", "2025-01-10"), milestone("m2", "2025-03-10")];
    const settled = layout(items, { x: scaleOf(0.1), rowX: scaleOf(2) });
    expect(settled.lanes[0].rowCount).toBe(1);
    expect((placed(settled, "m2") as PlacedMilestone).cx).toBeCloseTo((day("2025-03-10") - ORIGIN + 0.5) * 0.1);
  });

  it("zeigt eine eingeklappte Ebene auf einer Zeile ohne Beschriftungen", () => {
    const result = layout([milestone("m1", "2025-01-10"), milestone("m2", "2025-01-11"), bar("b", "2025-01-01", "2025-02-01")], {
      collapsed: new Set(["a"]),
    });
    const lane = result.lanes[0];
    expect(lane.collapsed).toBe(true);
    expect(lane.rowCount).toBe(1);
    expect(lane.items.every((entry) => entry.label === null)).toBe(true);
    expect(lane.height).toBe(GEOMETRY.minLaneHeight);
  });

  it("stapelt die Ebenen in der gegebenen Reihenfolge und lässt fehlende weg", () => {
    const p = plan([milestone("m1", "2025-01-10"), { ...milestone("m2", "2025-01-10"), lane: "b" } as PlanItem]);
    const result = layoutTimeline({
      plan: p,
      lanes: [p.lanes[1]],
      items: p.items,
      collapsed: new Set(),
      x: scaleOf(2),
      rowX: scaleOf(2),
      measure,
    });
    expect(result.lanes.map((lane) => lane.lane.id)).toEqual(["b"]);
    expect(result.lanes[0].top).toBe(0);
    expect(placed(result, "m1")).toBeUndefined();
  });

  it("gibt leeren Ebenen eine Mindesthöhe", () => {
    const result = layout([]);
    expect(result.lanes.map((lane) => lane.height)).toEqual([GEOMETRY.minLaneHeight, GEOMETRY.minLaneHeight]);
    expect(result.lanes[1].top).toBe(GEOMETRY.minLaneHeight);
  });

  it("setzt Stichtage in ein eigenes Band unter die Ebenen", () => {
    const without = layout([milestone("m1", "2025-01-10")]);
    expect(without.deadlineBand.height).toBe(0);

    const result = layout([
      { id: "d1", kind: "deadline", title: "Euro 7", date: "2025-02-01" } as PlanItem,
      { id: "d2", kind: "deadline", title: "CO2", date: "2025-02-02" } as PlanItem,
    ]);
    expect(result.deadlineBand.top).toBe(result.lanesHeight);
    expect(result.deadlines).toHaveLength(2);
    const [first, second] = result.deadlines;
    expect(second.markerTop).toBeGreaterThan(first.markerTop);
    expect(result.height).toBe(result.lanesHeight + result.deadlineBand.height);
  });

  it("schiebt den Balkentext hinter aufsitzende Symbole", () => {
    const result = layout([
      bar("TMS1", "2025-01-01", "2025-12-31", { series: "T" }),
      milestone("BEV", "2025-01-03", { series: "T" }),
    ]);
    const tms = placed(result, "TMS1") as PlacedBar;
    const bev = placed(result, "BEV") as PlacedMilestone;
    expect(tms.textOffset).toBeGreaterThanOrEqual(bev.cx + GEOMETRY.markerSize / 2 - tms.left);
    const plain = placed(layout([bar("TMS1", "2025-01-01", "2025-12-31")]), "TMS1") as PlacedBar;
    expect(plain.textOffset).toBe(GEOMETRY.barLabelPadding);
  });

  it("rastet Beschriftungen am Rand der Zeitfläche ein, solange das Symbol sichtbar ist", () => {
    const edge = layout([milestone("Eine lange Beschriftung", "2025-01-02")], { width: 400 });
    const label = (placed(edge, "Eine lange Beschriftung") as PlacedMilestone).label!;
    expect(label.left).toBe(0);

    const right = layout([milestone("Eine lange Beschriftung", "2025-07-15")], { width: 400 });
    const rightLabel = (placed(right, "Eine lange Beschriftung") as PlacedMilestone).label!;
    expect(rightLabel.left + rightLabel.width).toBe(400);

    // Ist das Symbol selbst draußen, bleibt auch die Beschriftung draußen —
    // sonst stapelten sich am Rand die Namen unsichtbarer Einträge.
    const outside = layout([milestone("Eine lange Beschriftung", "2025-01-02")], { width: 400, x: (d) => scaleOf(2)(d) - 100 });
    expect((placed(outside, "Eine lange Beschriftung") as PlacedMilestone).label!.left).toBeLessThan(0);
  });

  it("rechnet beim Verteilen mit der eingerasteten Beschriftung", () => {
    // Links eingerastet reicht „Eine lange Beschriftung" bis x = 120 und träfe „m2".
    const items = [milestone("Eine lange Beschriftung", "2025-01-02"), milestone("m2", "2025-02-20")];
    expect(layout(items).lanes[0].rowCount).toBe(1);
    expect(layout(items, { width: 400 }).lanes[0].rowCount).toBe(2);
  });

  it("liefert Anker für Abhängigkeiten", () => {
    const result = layout([bar("b", "2025-01-01", "2025-01-10"), milestone("m", "2025-06-01")]);
    const b = placed(result, "b") as PlacedBar;
    const m = placed(result, "m") as PlacedMilestone;
    expect(result.anchors.get("b")).toEqual({ inX: b.left, outX: b.left + b.width, y: b.top + b.height / 2 });
    expect(result.anchors.get("m")).toEqual({ inX: m.cx, outX: m.cx, y: m.cy });
  });
});
