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
import { fireEvent, render, screen } from "@testing-library/react";

import { Viewport, dayFromParts } from "./calendar";
import { OverviewStrip, OverviewStripProps } from "./overview-strip";
import { Plan } from "./plan-model";
import overviewStyles from "./styles/overview.scss";
import { MAX_PX_PER_DAY } from "./time-scale";

const d = dayFromParts;

const PLAN: Plan = {
  version: 1,
  lanes: [
    { id: "l1", title: "Messen" },
    { id: "l2", title: "SOPs" },
    { id: "l3", title: "Ausgeblendet" },
  ],
  categories: [
    { id: "c1", title: "General", color: "#E40045" },
    { id: "c2", title: "TMS", color: "#91B900" },
  ],
  items: [
    { id: "m1", kind: "milestone", lane: "l1", category: "c1", title: "IAA", date: "2026-09-15" },
    { id: "b1", kind: "bar", lane: "l2", category: "c2", title: "TMS1", start: "2027-01-01", end: "2027-12-31" },
    { id: "d1", kind: "deadline", category: "c1", title: "Euro 7", date: "2028-01-01" },
    { id: "u1", kind: "milestone", lane: "l2", title: "Ohne Kategorie", date: "2029-03-01" },
    { id: "x1", kind: "milestone", lane: "l3", title: "Versteckt", date: "2026-01-01" },
  ],
};

const WORLD: Viewport = { start: d(2025, 1, 1), end: d(2032, 1, 1) };
const WORLD_SPAN = WORLD.end - WORLD.start;
const VIEWPORT: Viewport = { start: d(2026, 1, 1), end: d(2027, 1, 1) };
const SPAN = VIEWPORT.end - VIEWPORT.start;
/** Der Streifen ist 1000 px breit und beginnt bei x = 0. */
const STRIP_WIDTH = 1000;

const percent = (day: number): number => ((day - WORLD.start) / WORLD_SPAN) * 100;
/** Pixel im Streifen → Tage. */
const daysOf = (px: number): number => (px / STRIP_WIDTH) * WORLD_SPAN;

let rectSpy: jest.SpyInstance;

beforeEach(() => {
  // jsdom misst nicht — jedes Element bekommt die Maße des Streifens.
  rectSpy = jest.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
    left: 0,
    top: 0,
    width: STRIP_WIDTH,
    height: 40,
    right: STRIP_WIDTH,
    bottom: 40,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  } as DOMRect);
});

afterEach(() => rectSpy.mockRestore());

const renderStrip = (overrides: Partial<OverviewStripProps> = {}) => {
  const onChange = jest.fn();
  const view = render(
    <OverviewStrip
      plan={PLAN}
      lanes={PLAN.lanes.slice(0, 2)}
      items={PLAN.items}
      world={WORLD}
      viewport={VIEWPORT}
      locale="de-DE"
      onChange={onChange}
      {...overrides}
    />,
  );
  return { ...view, onChange, slider: screen.getByRole("slider", { name: "Sichtbarer Zeitraum" }) };
};

const pointer = (type: string, clientX: number) =>
  new PointerEvent(type, { bubbles: true, cancelable: true, button: 0, clientX, clientY: 20, pointerType: "mouse" });

const lastChange = (onChange: jest.Mock): Viewport => onChange.mock.calls[onChange.mock.calls.length - 1][0];

describe("OverviewStrip", () => {
  describe("Zeichnung", () => {
    it("zeichnet je sichtbarer Ebene eine Spur", () => {
      const { container } = renderStrip();
      expect(container.querySelectorAll(".man-pt-overview__track")).toHaveLength(2);
    });

    it("zeichnet Meilensteine als Striche und Zeiträume als Rechtecke in ihrer Farbe", () => {
      const { container } = renderStrip();
      const tracks = container.querySelectorAll(".man-pt-overview__track");

      const milestone = tracks[0].querySelector<HTMLElement>('[data-id="m1"]');
      expect(milestone).toHaveClass("man-pt-overview__mark--milestone");
      expect(milestone).toHaveStyle({ backgroundColor: "#E40045" });
      expect(parseFloat(milestone?.style.left ?? "")).toBeCloseTo(percent(d(2026, 9, 15) + 0.5));

      const bar = tracks[1].querySelector<HTMLElement>('[data-id="b1"]');
      expect(bar).toHaveClass("man-pt-overview__mark--bar");
      expect(bar).toHaveStyle({ backgroundColor: "#91B900" });
      expect(parseFloat(bar?.style.left ?? "")).toBeCloseTo(percent(d(2027, 1, 1)));
      expect(parseFloat(bar?.style.width ?? "")).toBeCloseTo(percent(d(2028, 1, 1)) - percent(d(2027, 1, 1)));
    });

    it("färbt Einträge ohne Kategorie neutral", () => {
      const { container } = renderStrip();
      expect(container.querySelector('[data-id="u1"]')).toHaveStyle({ backgroundColor: "#71787F" });
    });

    it("zieht Stichtage über alle Spuren statt in eine Spur", () => {
      const { container } = renderStrip();
      const deadline = container.querySelector<HTMLElement>('[data-id="d1"]');
      expect(deadline).toHaveClass("man-pt-overview__mark--deadline");
      expect(deadline?.closest(".man-pt-overview__track")).toBeNull();
      expect(deadline?.closest(".man-pt-overview__deadlines")).not.toBeNull();
    });

    it("lässt Einträge ausgeblendeter Ebenen weg", () => {
      const { container } = renderStrip();
      expect(container.querySelector('[data-id="x1"]')).toBeNull();
    });

    it("hält die Zeichnung vor Screenreadern verborgen", () => {
      const { container } = renderStrip();
      expect(container.querySelector(".man-pt-overview__tracks")).toHaveAttribute("aria-hidden", "true");
      expect(container.querySelector(".man-pt-overview__deadlines")).toHaveAttribute("aria-hidden", "true");
    });

    it("bringt sein Stylesheet mit", () => {
      const { container } = renderStrip();
      expect(container.querySelector("style")?.textContent).toContain(".man-pt-overview");
    });
  });

  describe("Fenster", () => {
    it("ist ein fokussierbarer Schieberegler mit dem Zeitraum in Worten", () => {
      const { slider } = renderStrip();
      expect(slider).toHaveAttribute("tabindex", "0");
      expect(slider).toHaveAttribute("aria-valuetext", "Januar 2026 bis Dezember 2026");
      expect(slider).toHaveAttribute("aria-valuemin", String(WORLD.start));
      expect(slider).toHaveAttribute("aria-valuemax", String(WORLD.end - SPAN));
      expect(slider).toHaveAttribute("aria-valuenow", String(VIEWPORT.start));
    });

    it("liegt über dem sichtbaren Ausschnitt", () => {
      const { slider } = renderStrip();
      const center = (VIEWPORT.start + VIEWPORT.end) / 2;
      expect(parseFloat(slider.style.left)).toBeCloseTo(percent(center));
      expect(parseFloat(slider.style.width)).toBeCloseTo((SPAN / WORLD_SPAN) * 100);
    });

    it.each([
      ["ArrowRight", SPAN * 0.1],
      ["ArrowLeft", -SPAN * 0.1],
    ])("verschiebt mit %s um ein Zehntel der Spanne", (key, delta) => {
      const { slider, onChange } = renderStrip();
      fireEvent.keyDown(slider, { key });
      expect(lastChange(onChange).start).toBeCloseTo(VIEWPORT.start + delta);
      expect(lastChange(onChange).end).toBeCloseTo(VIEWPORT.end + delta);
    });

    it("springt mit Pos1 und Ende an die Grenzen der Welt", () => {
      const { slider, onChange } = renderStrip();
      fireEvent.keyDown(slider, { key: "Home" });
      expect(lastChange(onChange)).toEqual({ start: WORLD.start, end: WORLD.start + SPAN });

      fireEvent.keyDown(slider, { key: "End" });
      expect(lastChange(onChange)).toEqual({ start: WORLD.end - SPAN, end: WORLD.end });
    });

    it("lässt andere Tasten in Ruhe", () => {
      const { slider, onChange } = renderStrip();
      expect(fireEvent.keyDown(slider, { key: "Tab" })).toBe(true);
      expect(onChange).not.toHaveBeenCalled();
    });

    it("hält den Wert im Bereich, auch wenn der Ausschnitt über eine schmale Welt ragt", () => {
      const world = { start: d(2025, 1, 1), end: d(2025, 1, 11) };
      const { slider } = renderStrip({ world, viewport: { start: world.start - 7.5, end: world.end + 7.5 } });
      const now = Number(slider.getAttribute("aria-valuenow"));
      expect(now).toBeGreaterThanOrEqual(Number(slider.getAttribute("aria-valuemin")));
      expect(now).toBeLessThanOrEqual(Number(slider.getAttribute("aria-valuemax")));
    });
  });

  describe("Zeiger", () => {
    it("verschiebt den Ausschnitt beim Ziehen am Fenster", () => {
      const { slider, onChange } = renderStrip();

      fireEvent(slider, pointer("pointerdown", 200));
      fireEvent(slider, pointer("pointermove", 300));
      fireEvent(slider, pointer("pointerup", 300));

      expect(lastChange(onChange).start).toBeCloseTo(VIEWPORT.start + daysOf(100));
      expect(lastChange(onChange).end).toBeCloseTo(VIEWPORT.end + daysOf(100));
    });

    it("rechnet vom Beginn des Ziehens aus, nicht vom letzten Schritt", () => {
      const { slider, onChange } = renderStrip();

      fireEvent(slider, pointer("pointerdown", 200));
      fireEvent(slider, pointer("pointermove", 250));
      fireEvent(slider, pointer("pointermove", 260));

      expect(lastChange(onChange).start).toBeCloseTo(VIEWPORT.start + daysOf(60));
    });

    it("hört nach dem Loslassen auf", () => {
      const { slider, onChange } = renderStrip();

      fireEvent(slider, pointer("pointerdown", 200));
      fireEvent(slider, pointer("pointerup", 200));
      onChange.mockClear();
      fireEvent(slider, pointer("pointermove", 400));

      expect(onChange).not.toHaveBeenCalled();
    });

    it("ändert an der linken Kante nur den Beginn", () => {
      const { container, onChange } = renderStrip();
      const handle = container.querySelector('[data-edge="start"]') as HTMLElement;

      fireEvent(handle, pointer("pointerdown", 150));
      fireEvent(handle, pointer("pointermove", 100));

      expect(lastChange(onChange).start).toBeCloseTo(VIEWPORT.start - daysOf(50));
      expect(lastChange(onChange).end).toBe(VIEWPORT.end);
    });

    it("ändert an der rechten Kante nur das Ende, höchstens bis zur Mindestspanne", () => {
      const { container, onChange } = renderStrip();
      const handle = container.querySelector('[data-edge="end"]') as HTMLElement;

      fireEvent(handle, pointer("pointerdown", 300));
      fireEvent(handle, pointer("pointermove", 0));

      const result = lastChange(onChange);
      expect(result.start).toBe(VIEWPORT.start);
      expect(result.end - result.start).toBeCloseTo(STRIP_WIDTH / MAX_PX_PER_DAY);
    });

    it("zieht die Kante nicht über den Rand der Welt", () => {
      const { container, onChange } = renderStrip();
      const handle = container.querySelector('[data-edge="start"]') as HTMLElement;

      fireEvent(handle, pointer("pointerdown", 150));
      fireEvent(handle, pointer("pointermove", -500));

      expect(lastChange(onChange)).toEqual({ start: WORLD.start, end: VIEWPORT.end });
    });

    it("setzt den Ausschnitt beim Druck daneben mittig auf die Stelle und zieht von dort weiter", () => {
      const { container, onChange } = renderStrip();
      const strip = container.querySelector(".man-pt-overview") as HTMLElement;

      fireEvent(strip, pointer("pointerdown", 600));
      const center = WORLD.start + daysOf(600);
      expect(lastChange(onChange).start).toBeCloseTo(center - SPAN / 2);
      expect(lastChange(onChange).end).toBeCloseTo(center + SPAN / 2);

      fireEvent(strip, pointer("pointermove", 610));
      expect(lastChange(onChange).start).toBeCloseTo(center - SPAN / 2 + daysOf(10));
    });

    it("klemmt den Sprung an den Rand der Welt", () => {
      const { container, onChange } = renderStrip();
      const strip = container.querySelector(".man-pt-overview") as HTMLElement;

      fireEvent(strip, pointer("pointerdown", 995));
      expect(lastChange(onChange)).toEqual({ start: WORLD.end - SPAN, end: WORLD.end });
    });

    it("reagiert nur auf die Haupttaste der Maus", () => {
      const { slider, onChange } = renderStrip();
      const down = pointer("pointerdown", 200);
      Object.defineProperty(down, "button", { value: 2 });

      fireEvent(slider, down);
      fireEvent(slider, pointer("pointermove", 300));

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe("Stylesheet", () => {
    it("färbt nur mit MAN-Tokens", () => {
      // Alles, was über `man(...)` kommt, steht als `var(--man-…, Fallback)` da.
      // Ohne diese Stellen darf keine Farbe übrig bleiben.
      const withoutTokens = overviewStyles.replace(/var\(--man-[^()]*(\([^()]*\)[^()]*)*\)/g, "");
      expect(withoutTokens).not.toMatch(/#[0-9a-f]{3,8}\b/i);
      expect(withoutTokens).not.toMatch(/\brgba?\(/i);
    });

    it("rundet nur nach den MAN-Tokens", () => {
      const invented = [...overviewStyles.matchAll(/border-radius:\s*([^;}]+)/g)]
        .map((match) => match[1].trim())
        .filter((value) => !value.startsWith("var(--man-radius") && !value.startsWith("0"));
      expect(invented).toEqual([]);
    });

    it("zeigt den Fokus mit dem Fokusring der Marke", () => {
      expect(overviewStyles).toMatch(/\.man-pt-overview__window:focus-visible\s*\{[^}]*var\(--man-focus/);
    });

    it("lässt die Seite beim senkrechten Wischen scrollen", () => {
      expect(overviewStyles).toMatch(/touch-action:\s*pan-y/);
    });
  });
});
