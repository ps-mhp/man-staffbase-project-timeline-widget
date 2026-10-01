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

import * as React from "react";
import { render } from "@testing-library/react";

import { examplePlan } from "../example-plan";
import { Plan } from "../plan-model";
import { describeTemplatePlan } from "./template-gallery";
import { TemplateThumbnail } from "./template-thumbnail";

const tiny: Plan = {
  version: 1,
  lanes: [{ id: "l1", title: "Ebene" }],
  categories: [{ id: "c1", title: "Kategorie", color: "#E40045" }],
  items: [
    { id: "m1", kind: "milestone", lane: "l1", category: "c1", title: "M", date: "2026-03-10" },
    { id: "b1", kind: "bar", lane: "l1", category: "c1", title: "B", start: "2026-04-01", end: "2026-05-31" },
    { id: "d1", kind: "deadline", category: "c1", title: "D", date: "2026-06-01" },
  ],
};

describe("Beschreibung einer Vorlage", () => {
  it("nennt Ebenen, Kategorien, Einträge und den Zeitraum der Startansicht", () => {
    const plan = examplePlan();
    expect(describeTemplatePlan(plan)).toBe(
      `3 Ebenen · 7 Kategorien · ${plan.items.length} Einträge · Januar 2025 – Dezember 2031`,
    );
  });

  it("zählt in der Einzahl und nimmt ohne Startansicht die Spanne der Einträge", () => {
    expect(describeTemplatePlan(tiny)).toBe("1 Ebene · 1 Kategorie · 3 Einträge · März 2026 – Juni 2026");
  });

  it("lässt den Zeitraum weg, wenn es keinen gibt", () => {
    expect(describeTemplatePlan({ version: 1, lanes: [], categories: [], items: [] })).toBe(
      "0 Ebenen · 0 Kategorien · 0 Einträge",
    );
  });
});

describe("Vorschaubild einer Vorlage", () => {
  it("zeichnet je Zeitraum ein Rechteck, je Meilenstein einen Punkt und je Stichtag eine Linie", () => {
    const { container } = render(<TemplateThumbnail plan={tiny} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelectorAll(".man-pt-editor__thumb-bar")).toHaveLength(1);
    expect(container.querySelectorAll(".man-pt-editor__thumb-milestone")).toHaveLength(1);
    expect(container.querySelectorAll(".man-pt-editor__thumb-deadline")).toHaveLength(1);
    expect(container.querySelector(".man-pt-editor__thumb-bar")).toHaveAttribute("fill", "#E40045");
  });

  it("bleibt in seiner Fläche, auch für Einträge außerhalb der Startansicht", () => {
    const outside: Plan = { ...tiny, view: { start: "2026-04", end: "2026-04" } };
    const { container } = render(<TemplateThumbnail plan={outside} />);
    const width = Number(container.querySelector("svg")?.getAttribute("viewBox")?.split(" ")[2]);
    const xs = [...container.querySelectorAll("circle, rect, line")].flatMap((node) =>
      ["cx", "x", "x1"].map((name) => node.getAttribute(name)).filter((value) => value !== null).map(Number),
    );
    expect(xs.length).toBeGreaterThan(0);
    for (const x of xs) {
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThanOrEqual(width);
    }
  });
});
