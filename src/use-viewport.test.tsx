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
import { useRef } from "react";
import { act, fireEvent, render, renderHook, screen } from "@testing-library/react";

import { Viewport } from "./calendar";
import { Scale, createScale } from "./time-scale";
import { ViewportController, useTimelineGestures, useViewport } from "./use-viewport";

const WORLD: Viewport = { start: 0, end: 1000 };
/** Bei 400 px ist die schmalste Spanne 10 Tage. */
const WIDTH = 400;

const span = (viewport: Viewport): number => viewport.end - viewport.start;

interface HookProps {
  world: Viewport;
  width: number;
  initial: Viewport;
}

const renderViewport = (initial: Viewport = { start: 100, end: 300 }) =>
  renderHook((props: HookProps) => useViewport(props), {
    initialProps: { world: WORLD, width: WIDTH, initial },
  });

/** Stellt „weniger Bewegung" ein; jsdom kennt `matchMedia` gar nicht. */
const setReducedMotion = (reduce: boolean) => {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: (query: string) => ({
      matches: reduce && query === "(prefers-reduced-motion: reduce)",
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }),
  });
};

describe("useViewport", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => {
    jest.useRealTimers();
    delete (window as { matchMedia?: unknown }).matchMedia;
  });

  it("beginnt mit dem geklemmten Startausschnitt, auch als ruhenden", () => {
    const { result } = renderViewport({ start: -50, end: 150 });
    expect(result.current.viewport).toEqual({ start: 0, end: 200 });
    expect(result.current.settled).toEqual({ start: 0, end: 200 });
  });

  it("verschiebt sofort und lässt den ruhenden Ausschnitt 150 ms nachziehen", () => {
    const { result } = renderViewport();

    act(() => result.current.panBy(50));
    expect(result.current.viewport).toEqual({ start: 150, end: 350 });
    expect(result.current.settled).toEqual({ start: 100, end: 300 });

    act(() => jest.advanceTimersByTime(149));
    expect(result.current.settled).toEqual({ start: 100, end: 300 });

    act(() => jest.advanceTimersByTime(1));
    expect(result.current.settled).toEqual({ start: 150, end: 350 });
  });

  it("wartet mit dem ruhenden Ausschnitt, bis die Geste 150 ms ruht", () => {
    const { result } = renderViewport();

    act(() => result.current.panBy(10));
    act(() => jest.advanceTimersByTime(100));
    act(() => result.current.panBy(10));
    act(() => jest.advanceTimersByTime(100));
    expect(result.current.settled).toEqual({ start: 100, end: 300 });

    act(() => jest.advanceTimersByTime(50));
    expect(result.current.settled).toEqual({ start: 120, end: 320 });
  });

  it("setzt zwei Aufrufe in einem Ereignis aufeinander, nicht nebeneinander", () => {
    const { result } = renderViewport();
    act(() => {
      result.current.panBy(10);
      result.current.panBy(10);
    });
    expect(result.current.viewport).toEqual({ start: 120, end: 320 });
  });

  it("klemmt beim Setzen", () => {
    const { result } = renderViewport();
    act(() => result.current.setViewport({ start: 900, end: 1100 }));
    expect(result.current.viewport).toEqual({ start: 800, end: 1000 });

    act(() => result.current.setViewport({ start: 500, end: 501 }));
    expect(span(result.current.viewport)).toBeCloseTo(10);
  });

  it("zoomt mit Anker sofort, der Ankertag bleibt an seiner Stelle", () => {
    const { result } = renderViewport();
    const before = createScale(result.current.viewport, WIDTH).x(150);

    act(() => result.current.zoomBy(2, 150));

    expect(span(result.current.viewport)).toBeCloseTo(100);
    expect(createScale(result.current.viewport, WIDTH).x(150)).toBeCloseTo(before);
  });

  it("animiert den Zoom der Knöpfe um die Mitte über 150 ms", () => {
    const { result } = renderViewport();

    act(() => result.current.zoomBy(2));
    // Der erste Schritt kommt erst mit dem nächsten Frame.
    expect(result.current.viewport).toEqual({ start: 100, end: 300 });

    act(() => jest.advanceTimersByTime(80));
    const midway = span(result.current.viewport);
    expect(midway).toBeLessThan(200);
    expect(midway).toBeGreaterThan(100);

    act(() => jest.advanceTimersByTime(200));
    expect(result.current.viewport.start).toBeCloseTo(150);
    expect(result.current.viewport.end).toBeCloseTo(250);
  });

  it("setzt schnell aufeinanderfolgende Knopfdrücke auf das Ziel, nicht auf den Zwischenstand", () => {
    const { result } = renderViewport();

    act(() => result.current.zoomBy(2));
    act(() => jest.advanceTimersByTime(40));
    act(() => result.current.zoomBy(2));
    act(() => jest.advanceTimersByTime(300));

    expect(result.current.viewport.start).toBeCloseTo(175);
    expect(result.current.viewport.end).toBeCloseTo(225);
  });

  it("springt bei „weniger Bewegung“ ohne Animation", () => {
    setReducedMotion(true);
    const { result } = renderViewport();

    act(() => result.current.zoomBy(2));
    expect(result.current.viewport).toEqual({ start: 150, end: 250 });
  });

  it("zeigt mit fit die ganze Welt, animiert", () => {
    const { result } = renderViewport();

    act(() => result.current.fit());
    expect(result.current.viewport).toEqual({ start: 100, end: 300 });

    act(() => jest.advanceTimersByTime(300));
    expect(result.current.viewport).toEqual(WORLD);
  });

  it("bricht eine laufende Animation ab, sobald eine Geste übernimmt", () => {
    const { result } = renderViewport();

    act(() => result.current.fit());
    act(() => jest.advanceTimersByTime(40));
    const during = result.current.viewport;
    act(() => result.current.panBy(1));
    act(() => jest.advanceTimersByTime(300));

    expect(result.current.viewport.start).toBeCloseTo(Math.max(0, during.start + 1));
    expect(span(result.current.viewport)).toBeCloseTo(span(during));
  });

  it("klemmt den Ausschnitt nur, wenn sich die Welt ändert, statt ihn zurückzusetzen", () => {
    const { result, rerender } = renderViewport();
    act(() => result.current.panBy(100));
    expect(result.current.viewport).toEqual({ start: 200, end: 400 });

    rerender({ world: { start: 0, end: 2000 }, width: WIDTH, initial: { start: 100, end: 300 } });
    expect(result.current.viewport).toEqual({ start: 200, end: 400 });

    rerender({ world: { start: 300, end: 2000 }, width: WIDTH, initial: { start: 100, end: 300 } });
    expect(result.current.viewport).toEqual({ start: 300, end: 500 });
  });

  it("klemmt den Ausschnitt, wenn die Fläche breiter wird", () => {
    const { result, rerender } = renderViewport({ start: 100, end: 110 });
    rerender({ world: WORLD, width: 800, initial: { start: 100, end: 110 } });
    expect(result.current.viewport.start).toBeCloseTo(95);
    expect(result.current.viewport.end).toBeCloseTo(115);
  });

  it("räumt beim Abbau Animation und Zeitgeber weg", () => {
    const { result, unmount } = renderViewport();
    act(() => result.current.zoomBy(2));
    act(() => result.current.panBy(5));
    unmount();
    expect(() => act(() => jest.advanceTimersByTime(500))).not.toThrow();
  });
});

// ---------------------------------------------------------------------------

/** Bei 1000 px über 100 Tage sind es 10 px je Tag. */
const SCALE = createScale({ start: 0, end: 100 }, 1000);
/** Die Fläche beginnt 100 px vom linken Rand. */
const LEFT = 100;

/**
 * Ein Controller zum Mitschreiben. `peek` spiegelt wie der echte einen Zoom
 * sofort wider — Gesten rechnen nach dem Zoom mit dem neuen Maßstab.
 */
const mockController = (): jest.Mocked<ViewportController> => {
  let latest = { start: 0, end: 100 };
  return {
    viewport: { start: 0, end: 100 },
    settled: { start: 0, end: 100 },
    zoomBy: jest.fn((factor: number, anchor: number = (latest.start + latest.end) / 2) => {
      latest = { start: anchor - (anchor - latest.start) / factor, end: anchor + (latest.end - anchor) / factor };
    }),
    panBy: jest.fn(),
    fit: jest.fn(),
    setViewport: jest.fn(),
    peek: jest.fn(() => latest),
  };
};

interface SurfaceProps {
  controller: ViewportController;
  scale?: Scale;
  onWheelHint?: () => void;
  onItemClick?: () => void;
}

function Surface({ controller, scale = SCALE, onWheelHint, onItemClick }: SurfaceProps) {
  const ref = useRef<HTMLDivElement>(null);
  useTimelineGestures(ref, controller, scale, { onWheelHint });
  return (
    <div data-testid="surface" ref={ref}>
      <button type="button" onClick={onItemClick}>
        Eintrag
      </button>
      <div data-testid="free" onClick={onItemClick} />
    </div>
  );
}

const renderSurface = (props: Partial<SurfaceProps> = {}) => {
  const controller = props.controller ?? (mockController() as ViewportController);
  const view = render(<Surface controller={controller} {...props} />);
  const surface = screen.getByTestId("surface");
  surface.getBoundingClientRect = () =>
    ({ left: LEFT, top: 0, width: 1000, height: 200, right: LEFT + 1000, bottom: 200, x: LEFT, y: 0 }) as DOMRect;
  return { ...view, surface, controller: controller as jest.Mocked<ViewportController> };
};

/**
 * Ein Zeigerereignis mit Kennung. Der PointerEvent-Ersatz aus jest-setup
 * trägt `pointerId` nicht; für zwei Finger braucht es sie aber.
 */
const pointer = (type: string, init: { pointerId: number; clientX: number; clientY?: number; pointerType?: string }) => {
  const event = new PointerEvent(type, {
    bubbles: true,
    cancelable: true,
    button: 0,
    clientY: 50,
    pointerType: "mouse",
    ...init,
  });
  Object.defineProperty(event, "pointerId", { value: init.pointerId });
  return event;
};

/** Safaris GestureEvent gibt es nur dort; ein Event mit `scale` genügt. */
const gesture = (type: string, scale: number, clientX: number) =>
  Object.assign(new Event(type, { bubbles: true, cancelable: true }), { scale, clientX, clientY: 50 });

describe("useTimelineGestures", () => {
  it("rechnet den Tag unter dem Zeiger mit dem jüngsten Ausschnitt, nicht mit dem letzten Bild", () => {
    // Das letzte Bild zeigt Tag 0–100, der Controller ist schon bei 50–100:
    // ein zweites Rad-Ereignis vor dem nächsten Bild muss sich darauf beziehen.
    const controller = mockController();
    controller.peek.mockReturnValue({ start: 50, end: 100 });
    const { surface } = renderSurface({ controller });
    fireEvent.wheel(surface, { deltaY: -10, ctrlKey: true, clientX: LEFT + 500 });
    expect(controller.zoomBy).toHaveBeenCalledWith(expect.any(Number), 75);
  });

  describe("Mausrad", () => {
    it("zoomt mit Strg um den Tag unter dem Zeiger und hält die Seite an", () => {
      const { surface, controller } = renderSurface();
      const notPrevented = fireEvent.wheel(surface, { ctrlKey: true, deltaY: -100, clientX: LEFT + 200 });

      expect(notPrevented).toBe(false);
      expect(controller.zoomBy).toHaveBeenCalledTimes(1);
      const [factor, anchor] = controller.zoomBy.mock.calls[0];
      expect(factor).toBeCloseTo(Math.exp(1));
      expect(anchor).toBeCloseTo(20);
    });

    it("zoomt ebenso mit ⌘, hinaus bei positivem deltaY", () => {
      const { surface, controller } = renderSurface();
      fireEvent.wheel(surface, { metaKey: true, deltaY: 50, clientX: LEFT + 500 });
      const [factor, anchor] = controller.zoomBy.mock.calls[0];
      expect(factor).toBeCloseTo(Math.exp(-0.5));
      expect(anchor).toBeCloseTo(50);
    });

    it("rechnet Zeilen in Pixel um", () => {
      const { surface, controller } = renderSurface();
      fireEvent.wheel(surface, { ctrlKey: true, deltaY: 3, deltaMode: 1, clientX: LEFT });
      expect(controller.zoomBy.mock.calls[0][0]).toBeCloseTo(Math.exp(-0.48));
    });

    it("verschiebt mit Shift um deltaY", () => {
      const { surface, controller } = renderSurface();
      const notPrevented = fireEvent.wheel(surface, { shiftKey: true, deltaY: 50 });
      expect(notPrevented).toBe(false);
      expect(controller.panBy).toHaveBeenCalledWith(5);
      expect(controller.zoomBy).not.toHaveBeenCalled();
    });

    it("verschiebt mit Shift auch, wenn der Browser das Rad schon waagerecht meldet", () => {
      const { surface, controller } = renderSurface();
      fireEvent.wheel(surface, { shiftKey: true, deltaX: 30 });
      expect(controller.panBy).toHaveBeenCalledWith(3);
    });

    it("verschiebt beim waagerechten Wischen", () => {
      const { surface, controller } = renderSurface();
      const notPrevented = fireEvent.wheel(surface, { deltaX: -40, deltaY: 5 });
      expect(notPrevented).toBe(false);
      expect(controller.panBy).toHaveBeenCalledWith(-4);
    });

    it("lässt die Seite beim senkrechten Rad scrollen und gibt einmal den Hinweis", () => {
      const onWheelHint = jest.fn();
      const { surface, controller } = renderSurface({ onWheelHint });

      expect(fireEvent.wheel(surface, { deltaY: 100 })).toBe(true);
      expect(fireEvent.wheel(surface, { deltaY: 100 })).toBe(true);

      expect(onWheelHint).toHaveBeenCalledTimes(1);
      expect(controller.zoomBy).not.toHaveBeenCalled();
      expect(controller.panBy).not.toHaveBeenCalled();
    });

    it("hört nach dem Abbau nicht mehr zu", () => {
      const { surface, controller, unmount } = renderSurface();
      unmount();
      fireEvent.wheel(surface, { ctrlKey: true, deltaY: -100 });
      expect(controller.zoomBy).not.toHaveBeenCalled();
    });
  });

  describe("Safari-Gesten", () => {
    it("zoomt mit dem Verhältnis zum vorigen Schritt und hält die Seite an", () => {
      const { surface, controller } = renderSurface();

      expect(fireEvent(surface, gesture("gesturestart", 1, LEFT + 200))).toBe(false);
      expect(fireEvent(surface, gesture("gesturechange", 2, LEFT + 200))).toBe(false);
      fireEvent(surface, gesture("gesturechange", 3, LEFT + 200));
      fireEvent(surface, gesture("gestureend", 3, LEFT + 200));

      expect(controller.zoomBy.mock.calls.map(([factor]) => factor)).toEqual([2, 1.5]);
      expect(controller.zoomBy.mock.calls[0][1]).toBeCloseTo(20);
    });

    it("überlässt den Pinch mit zwei Fingern den Zeigerereignissen, damit iOS nicht doppelt zoomt", () => {
      const { controller } = renderSurface();
      const free = screen.getByTestId("free");
      const touch = { pointerType: "touch" };

      fireEvent(free, pointer("pointerdown", { pointerId: 1, clientX: LEFT + 300, ...touch }));
      fireEvent(free, pointer("pointerdown", { pointerId: 2, clientX: LEFT + 500, ...touch }));
      fireEvent(free, gesture("gesturestart", 1, LEFT + 400));
      const notPrevented = fireEvent(free, gesture("gesturechange", 2, LEFT + 400));

      expect(notPrevented).toBe(false);
      expect(controller.zoomBy).not.toHaveBeenCalled();
    });
  });

  describe("Ziehen", () => {
    it("verschiebt erst jenseits von 3 px und folgt dann dem Zeiger", () => {
      const { controller } = renderSurface();
      const free = screen.getByTestId("free");

      fireEvent(free, pointer("pointerdown", { pointerId: 1, clientX: 500 }));
      fireEvent(free, pointer("pointermove", { pointerId: 1, clientX: 502 }));
      expect(controller.panBy).not.toHaveBeenCalled();

      fireEvent(free, pointer("pointermove", { pointerId: 1, clientX: 520 }));
      fireEvent(free, pointer("pointermove", { pointerId: 1, clientX: 530 }));
      fireEvent(free, pointer("pointerup", { pointerId: 1, clientX: 530 }));

      expect(controller.panBy.mock.calls.map(([days]) => days)).toEqual([-2, -1]);
    });

    it("schluckt den Klick nach dem Ziehen genau einmal", () => {
      const onItemClick = jest.fn();
      renderSurface({ onItemClick });
      const free = screen.getByTestId("free");

      fireEvent(free, pointer("pointerdown", { pointerId: 1, clientX: 500 }));
      fireEvent(free, pointer("pointermove", { pointerId: 1, clientX: 540 }));
      fireEvent(free, pointer("pointerup", { pointerId: 1, clientX: 540 }));
      fireEvent.click(free, { detail: 1 });
      expect(onItemClick).not.toHaveBeenCalled();

      fireEvent.click(free, { detail: 1 });
      expect(onItemClick).toHaveBeenCalledTimes(1);
    });

    it("lässt einen Klick ohne Ziehen durch", () => {
      const onItemClick = jest.fn();
      renderSurface({ onItemClick });
      const free = screen.getByTestId("free");

      fireEvent(free, pointer("pointerdown", { pointerId: 1, clientX: 500 }));
      fireEvent(free, pointer("pointermove", { pointerId: 1, clientX: 501 }));
      fireEvent(free, pointer("pointerup", { pointerId: 1, clientX: 501 }));
      fireEvent.click(free, { detail: 1 });

      expect(onItemClick).toHaveBeenCalledTimes(1);
    });

    it("zieht nicht, wenn der Druck auf einem Eintrag beginnt", () => {
      const { controller } = renderSurface();
      const item = screen.getByRole("button", { name: "Eintrag" });

      fireEvent(item, pointer("pointerdown", { pointerId: 1, clientX: 500 }));
      fireEvent(item, pointer("pointermove", { pointerId: 1, clientX: 560 }));

      expect(controller.panBy).not.toHaveBeenCalled();
    });

    it("zieht nur mit der Haupttaste der Maus", () => {
      const { controller } = renderSurface();
      const free = screen.getByTestId("free");
      const down = pointer("pointerdown", { pointerId: 1, clientX: 500 });
      Object.defineProperty(down, "button", { value: 2 });

      fireEvent(free, down);
      fireEvent(free, pointer("pointermove", { pointerId: 1, clientX: 560 }));

      expect(controller.panBy).not.toHaveBeenCalled();
    });

    it("hält den Zeiger fest, sobald gezogen wird", () => {
      const { surface } = renderSurface();
      const capture = jest.fn();
      surface.setPointerCapture = capture;
      const free = screen.getByTestId("free");

      fireEvent(free, pointer("pointerdown", { pointerId: 7, clientX: 500 }));
      fireEvent(free, pointer("pointermove", { pointerId: 7, clientX: 560 }));

      expect(capture).toHaveBeenCalledWith(7);
    });
  });

  describe("Pinch", () => {
    it("zoomt mit dem Abstandsverhältnis um die Mitte der Finger", () => {
      const { controller } = renderSurface();
      const free = screen.getByTestId("free");
      const touch = { pointerType: "touch" };

      fireEvent(free, pointer("pointerdown", { pointerId: 1, clientX: LEFT + 300, ...touch }));
      fireEvent(free, pointer("pointerdown", { pointerId: 2, clientX: LEFT + 500, ...touch }));
      // Beide Finger gehen gleich weit auseinander: die Mitte (Tag 40) bleibt.
      fireEvent(free, pointer("pointermove", { pointerId: 1, clientX: LEFT + 200, ...touch }));
      fireEvent(free, pointer("pointermove", { pointerId: 2, clientX: LEFT + 600, ...touch }));

      const factors = controller.zoomBy.mock.calls.map(([factor]) => factor);
      // 200 → 300 → 400 px Abstand.
      expect(factors[0]).toBeCloseTo(1.5);
      expect(factors[1]).toBeCloseTo(4 / 3);
      for (const [, anchor] of controller.zoomBy.mock.calls) expect(anchor).toBeDefined();
      expect(controller.zoomBy.mock.calls[0][1]).toBeCloseTo(40);
    });

    it("verschiebt nicht als Ziehen, solange zwei Finger liegen", () => {
      const { controller } = renderSurface();
      const free = screen.getByTestId("free");
      const touch = { pointerType: "touch" };

      fireEvent(free, pointer("pointerdown", { pointerId: 1, clientX: LEFT + 300, ...touch }));
      fireEvent(free, pointer("pointerdown", { pointerId: 2, clientX: LEFT + 500, ...touch }));
      // Nur Finger 2 geht nach rechts: der Abstand wächst, die Mitte wandert mit.
      fireEvent(free, pointer("pointermove", { pointerId: 2, clientX: LEFT + 700, ...touch }));

      expect(controller.zoomBy).toHaveBeenCalledTimes(1);
      expect(controller.zoomBy.mock.calls[0][0]).toBeCloseTo(2);
      // Die Mitte wandert um 100 px; nach dem Zoom sind das 100 / (10 · 2) Tage.
      expect(controller.panBy).toHaveBeenCalledTimes(1);
      expect(controller.panBy.mock.calls[0][0]).toBeCloseTo(-5);
    });

    it("verschiebt nach dem Abheben eines Fingers ohne Sprung weiter", () => {
      const { controller } = renderSurface();
      const free = screen.getByTestId("free");
      const touch = { pointerType: "touch" };

      fireEvent(free, pointer("pointerdown", { pointerId: 1, clientX: LEFT + 300, ...touch }));
      fireEvent(free, pointer("pointerdown", { pointerId: 2, clientX: LEFT + 500, ...touch }));
      fireEvent(free, pointer("pointerup", { pointerId: 2, clientX: LEFT + 500, ...touch }));
      controller.panBy.mockClear();

      fireEvent(free, pointer("pointermove", { pointerId: 1, clientX: LEFT + 320, ...touch }));
      expect(controller.panBy).toHaveBeenCalledWith(-2);
    });
  });
});
