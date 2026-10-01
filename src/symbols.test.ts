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

import { MILESTONE_SYMBOLS, Plan, PlanItem, readPlanAttribute } from "./plan-model";
import { SYMBOL_LABELS, symbolOf, symbolPath } from "./symbols";

const plan = (categorySymbol?: string): Plan =>
  readPlanAttribute(
    JSON.stringify({
      lanes: [{ id: "l", title: "L" }],
      categories: [{ id: "c", title: "C", color: "#E40045", ...(categorySymbol ? { symbol: categorySymbol } : {}) }],
      items: [
        { id: "a", kind: "milestone", lane: "l", title: "A", date: "2026-01-01", category: "c", symbol: "square" },
        { id: "b", kind: "milestone", lane: "l", title: "B", date: "2026-02-01", category: "c", symbol: "triangle" },
        { id: "c", kind: "milestone", lane: "l", title: "C", date: "2026-03-01", category: "c", symbol: "square" },
        { id: "d", kind: "milestone", lane: "l", title: "D", date: "2026-04-01", symbol: "star" },
        { id: "e", kind: "milestone", lane: "l", title: "E", date: "2026-05-01" },
      ],
    }),
  ).plan;

const item = (p: Plan, id: string): PlanItem => p.items.find((entry) => entry.id === id)!;

describe("symbols", () => {
  it("benennt und zeichnet jede Form", () => {
    for (const symbol of MILESTONE_SYMBOLS) {
      expect(SYMBOL_LABELS[symbol]).toBeTruthy();
      expect(symbolPath(symbol)).toMatch(/^M.*Z$/);
    }
  });

  it("nimmt die Form der Kategorie, nicht die am Meilenstein", () => {
    const p = plan("hexagon");
    expect(symbolOf(p, item(p, "a"))).toBe("hexagon");
    expect(symbolOf(p, item(p, "b"))).toBe("hexagon");
  });

  it("gibt einer Kategorie ohne Form beim Lesen die häufigste ihrer Meilensteine", () => {
    const p = plan();
    expect(p.categories[0].symbol).toBe("square");
    expect(symbolOf(p, item(p, "b"))).toBe("square");
  });

  it("lässt Meilensteine ohne Kategorie bei ihrer alten Form, sonst bei der Raute", () => {
    const p = plan();
    expect(symbolOf(p, item(p, "d"))).toBe("star");
    expect(symbolOf(p, item(p, "e"))).toBe("diamond");
  });

  it("verwirft unbekannte Formen an der Kategorie", () => {
    expect(plan("pentagram").categories[0].symbol).toBe("square");
  });
});
