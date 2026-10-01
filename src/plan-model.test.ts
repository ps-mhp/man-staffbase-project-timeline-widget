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

import { decodePayload, encodePayload, isPayload } from "@shared/payload";

import { dayFromParts } from "./calendar";
import {
  LIMITS,
  Plan,
  UNCATEGORIZED_COLOR,
  colorOf,
  encodePlanAttribute,
  parsePlan,
  planExtent,
  readPlanAttribute,
} from "./plan-model";

const basePlan = (): Record<string, unknown> => ({
  version: 1,
  lanes: [
    { id: "l1", title: "Messen" },
    { id: "l2", title: "SOPs" },
  ],
  categories: [{ id: "c1", title: "General", color: "#e40045" }],
  items: [
    { id: "m1", kind: "milestone", lane: "l1", title: "IAA", date: "2026-09-15", category: "c1" },
    { id: "b1", kind: "bar", lane: "l2", title: "TMS1", start: "2028-01-01", end: "2030-06-30", arrow: true },
    { id: "d1", kind: "deadline", title: "Euro 7", date: "2029-05-01" },
  ],
});

const read = (value: unknown) => readPlanAttribute(JSON.stringify(value));

describe("readPlanAttribute", () => {
  it("liest einen gültigen Plan vollständig", () => {
    const { plan, dropped } = read(basePlan());
    expect(dropped).toBe(0);
    expect(plan.lanes).toHaveLength(2);
    expect(plan.categories[0].color).toBe("#E40045");
    expect(plan.items.map((item) => item.kind)).toEqual(["milestone", "bar", "deadline"]);
  });

  it("liest rohes JSON und verpackte Payloads gleich", () => {
    const raw = JSON.stringify(basePlan());
    expect(readPlanAttribute(encodePayload(raw))).toEqual(readPlanAttribute(raw));
  });

  it.each(["", "   ", "{", "[]", "null", "42", encodePayload("kaputt")])("macht aus %p einen leeren Plan", (raw) => {
    const { plan, dropped } = readPlanAttribute(raw);
    expect(plan.items).toEqual([]);
    expect(plan.lanes).toEqual([]);
    expect(dropped).toBe(0);
  });

  it.each([
    ["ohne Titel", { id: "x", kind: "milestone", lane: "l1", date: "2026-01-01" }],
    ["mit leerem Titel", { id: "x", kind: "milestone", lane: "l1", title: "  ", date: "2026-01-01" }],
    ["mit ungültigem Datum", { id: "x", kind: "milestone", lane: "l1", title: "X", date: "2026-02-30" }],
    ["mit unbekannter Art", { id: "x", kind: "task", lane: "l1", title: "X", date: "2026-01-01" }],
    ["ohne Ebene", { id: "x", kind: "bar", title: "X", start: "2026-01-01", end: "2026-02-01" }],
    ["mit unbekannter Ebene", { id: "x", kind: "milestone", lane: "nope", title: "X", date: "2026-01-01" }],
    ["ohne id", { kind: "deadline", title: "X", date: "2026-01-01" }],
    ["als Zeichenkette", "Meilenstein"],
  ])("verwirft einen Eintrag %s und zählt ihn", (_label, entry) => {
    const value = basePlan();
    value.items = [...(value.items as unknown[]), entry];
    const { plan, dropped } = read(value);
    expect(plan.items).toHaveLength(3);
    expect(dropped).toBe(1);
  });

  it("verwirft doppelte ids, damit Verweise eindeutig bleiben", () => {
    const value = basePlan();
    value.items = [...(value.items as unknown[]), { id: "m1", kind: "deadline", title: "Zweiter", date: "2026-01-01" }];
    const { plan, dropped } = read(value);
    expect(plan.items.filter((item) => item.id === "m1")).toHaveLength(1);
    expect(plan.items.find((item) => item.id === "m1")?.title).toBe("IAA");
    expect(dropped).toBe(1);
  });

  it("macht eine unbekannte Kategorie zu „ohne Kategorie“", () => {
    const value = basePlan();
    (value.items as Record<string, unknown>[])[0].category = "weg";
    const { plan, dropped } = read(value);
    expect(plan.items[0].category).toBeUndefined();
    expect(colorOf(plan, plan.items[0])).toBe(UNCATEGORIZED_COLOR);
    expect(dropped).toBe(0);
  });

  it("vertauscht Beginn und Ende eines verdrehten Zeitraums", () => {
    const value = basePlan();
    (value.items as Record<string, unknown>[])[1] = {
      id: "b1",
      kind: "bar",
      lane: "l2",
      title: "TMS1",
      start: "2030-06-30",
      end: "2028-01-01",
    };
    const bar = read(value).plan.items[1];
    expect(bar).toMatchObject({ start: "2028-01-01", end: "2030-06-30" });
  });

  it("streicht Vorgänger, die es nicht gibt, die auf sich zeigen oder Stichtage sind", () => {
    const value = basePlan();
    (value.items as Record<string, unknown>[])[1].dependsOn = ["m1", "m1", "b1", "d1", "nope"];
    (value.items as Record<string, unknown>[])[2].dependsOn = ["m1"];
    const { plan } = read(value);
    expect(plan.items[1].dependsOn).toEqual(["m1"]);
    expect(plan.items[2].dependsOn).toBeUndefined();
  });

  it("nimmt nur bekannte Symbole und lässt leere Serien weg", () => {
    const value = basePlan();
    Object.assign((value.items as Record<string, unknown>[])[0], { symbol: "pentagram", series: "   " });
    const item = read(value).plan.items[0];
    expect(item).not.toHaveProperty("symbol");
    expect(item).not.toHaveProperty("series");
  });

  it("ersetzt eine unbrauchbare Farbe durch Grau", () => {
    const value = basePlan();
    (value.categories as Record<string, unknown>[])[0].color = "red";
    expect(read(value).plan.categories[0].color).toBe(UNCATEGORIZED_COLOR);
  });

  it("kappt an den Obergrenzen", () => {
    const value = basePlan();
    value.items = Array.from({ length: LIMITS.items + 5 }, (_, index) => ({
      id: `d${index}`,
      kind: "deadline",
      title: `Stichtag ${index}`,
      date: "2026-01-01",
    }));
    const { plan, dropped } = read(value);
    expect(plan.items).toHaveLength(LIMITS.items);
    expect(dropped).toBe(5);
  });

  it("liest die Überschrift und lässt eine leere weg", () => {
    expect(read({ ...basePlan(), title: "  Sales Truck Launch " }).plan.title).toBe("Sales Truck Launch");
    expect(read({ ...basePlan(), title: "   " }).plan).not.toHaveProperty("title");
    expect(read({ ...basePlan(), title: 2025 }).plan).not.toHaveProperty("title");
  });

  it("liest die Startansicht und vertauscht verdrehte Monate", () => {
    const value = { ...basePlan(), view: { start: "2031-12", end: "2025-01" } };
    expect(read(value).plan.view).toEqual({ start: "2025-01", end: "2031-12" });
    expect(read({ ...basePlan(), view: { start: "2025-13", end: "2026-01" } }).plan.view).toBeUndefined();
  });
});

describe("encodePlanAttribute", () => {
  it("schreibt eine Payload, die im Rundlauf gleich bleibt", () => {
    const plan = parsePlan(JSON.stringify(basePlan()));
    const encoded = encodePlanAttribute(plan);
    expect(isPayload(encoded)).toBe(true);
    expect(parsePlan(encoded)).toEqual(plan);
  });

  it("gibt Felder einer späteren Version unverändert zurück", () => {
    const value = basePlan();
    value.theme = "dunkel";
    (value.lanes as Record<string, unknown>[])[0].collapsed = true;
    (value.categories as Record<string, unknown>[])[0].icon = "truck";
    (value.items as Record<string, unknown>[])[0].progress = 40;

    const written = JSON.parse(decodePayload(encodePlanAttribute(parsePlan(JSON.stringify(value)))) as string);
    expect(written.theme).toBe("dunkel");
    expect(written.lanes[0].collapsed).toBe(true);
    expect(written.categories[0].icon).toBe("truck");
    expect(written.items[0].progress).toBe(40);
    expect(written.items[0]).not.toHaveProperty("unknown");
  });

  it("lässt bekannte Felder vor gleichnamigen aus dem Beutel gewinnen", () => {
    const plan: Plan = parsePlan(JSON.stringify(basePlan()));
    plan.items[0] = { ...plan.items[0], unknown: { title: "alt" } };
    const written = JSON.parse(decodePayload(encodePlanAttribute(plan)) as string);
    expect(written.items[0].title).toBe("IAA");
  });
});

describe("planExtent", () => {
  it("reicht vom ersten bis zum letzten Tag aller Einträge", () => {
    const plan = parsePlan(JSON.stringify(basePlan()));
    expect(planExtent(plan.items)).toEqual({ start: dayFromParts(2026, 9, 15), end: dayFromParts(2030, 6, 30) });
    expect(planExtent([])).toBeNull();
  });
});
