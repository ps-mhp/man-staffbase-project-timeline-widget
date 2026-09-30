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
 * Der sichtbare Ausschnitt und die Gesten, die ihn bewegen.
 *
 * Gerechnet wird in `time-scale.ts`; hier liegt nur, was Zustand und DOM
 * braucht: der Ausschnitt samt seinem ruhenden Nachzügler, die Animation der
 * Knöpfe und die Übersetzung von Mausrad, Safari-Gesten, Ziehen und Pinch in
 * Aufrufe am Controller.
 */

import * as React from "react";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import { Viewport } from "./calendar";
import { Scale, clampViewport, createScale, panViewport, zoomViewport } from "./time-scale";

export interface ViewportController {
  /** Folgt jeder Geste unmittelbar. */
  viewport: Viewport;
  /** Zieht 150 ms nach der letzten Änderung nach; danach wird die Zeilenverteilung neu berechnet. */
  settled: Viewport;
  /**
   * Ohne Anker: um die Mitte und animiert — so zoomen Knöpfe und Tastatur.
   * Mit Anker: sofort — so zoomen Gesten, die dem Finger unmittelbar folgen müssen.
   */
  zoomBy(factor: number, anchorDay?: number): void;
  panBy(deltaDays: number): void;
  /** Ganze Welt, animiert. */
  fit(): void;
  /** Geklemmt. */
  setViewport(viewport: Viewport): void;
  /**
   * Der jüngste Ausschnitt, auch wenn er noch nicht gezeichnet ist. Gesten
   * rechnen damit: kommen zwei Rad-Ereignisse vor dem nächsten Bild, bezöge
   * sich das zweite sonst auf den alten Ausschnitt, und der Tag unter dem
   * Zeiger verrutschte.
   */
  peek(): Viewport;
}

/** So lange ruht eine Geste, bevor die Zeilen neu verteilt werden; siehe Spec „Ebenen und Zeilen". */
const SETTLE_MS = 150;

/** Dauer der Knopf-Animation; deckungsgleich mit `man("duration")`. */
const ANIMATION_MS = 150;

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/** jsdom und alte Einbettungen kennen `matchMedia` nicht; dort gilt: keine Vorliebe. */
function prefersReducedMotion(): boolean {
  return globalThis.matchMedia?.(REDUCED_MOTION_QUERY)?.matches === true;
}

/** Verlangsamt zum Ende hin, wie `man("ease")`: der Ausschnitt setzt weich auf. */
const easeOut = (t: number): number => 1 - (1 - t) ** 3;

const lerp = (from: number, to: number, t: number): number => from + (to - from) * t;

const sameViewport = (a: Viewport, b: Viewport): boolean => a.start === b.start && a.end === b.end;

interface Animation {
  frame: number;
  target: Viewport;
}

export function useViewport(options: { world: Viewport; width: number; initial: Viewport }): ViewportController {
  const { world, width, initial } = options;
  const [raw, setRaw] = useState<Viewport>(() => clampViewport(initial, world, width));

  // Ändern sich Welt oder Breite, wird der Ausschnitt nur geklemmt, nicht
  // zurückgesetzt: wer in einen Monat gezoomt hat und dann einen Filter setzt,
  // soll nicht wieder vor dem ganzen Plan stehen. Abgeleitet statt in einem
  // Effekt nachgezogen, damit kein Bild mit ungeklemmtem Ausschnitt entsteht.
  const viewport = useMemo(
    () => clampViewport(raw, { start: world.start, end: world.end }, width),
    [raw, world.start, world.end, width],
  );

  /**
   * Der jüngste Ausschnitt, auch wenn React ihn noch nicht gezeichnet hat.
   * Zwei Aufrufe im selben Ereignis — Pinch zoomt und verschiebt zugleich —
   * sollen aufeinander aufbauen, nicht beide auf dem letzten Bild.
   */
  const current = useRef(viewport);
  const bounds = useRef({ world, width });
  const animation = useRef<Animation | null>(null);

  useLayoutEffect(() => {
    current.current = viewport;
    bounds.current = { world, width };
  });

  const commit = useCallback((next: Viewport) => {
    // Am Rand der Welt liefe jedes weitere Rad-Ereignis sonst in ein neues
    // Rendern mit demselben Ausschnitt.
    if (sameViewport(current.current, next)) return;
    current.current = next;
    setRaw(next);
  }, []);

  const stopAnimation = useCallback(() => {
    if (animation.current === null) return;
    globalThis.cancelAnimationFrame?.(animation.current.frame);
    animation.current = null;
  }, []);

  const animateTo = useCallback(
    (target: Viewport) => {
      stopAnimation();
      if (prefersReducedMotion() || typeof globalThis.requestAnimationFrame !== "function") {
        commit(target);
        return;
      }
      const from = current.current;
      const startedAt = performance.now();
      const step = () => {
        const t = Math.min(1, (performance.now() - startedAt) / ANIMATION_MS);
        if (t >= 1) {
          animation.current = null;
          commit(target);
          return;
        }
        // Zwischen zwei gültigen Ausschnitten ist jeder Zwischenstand gültig —
        // Spanne und Lage wandern linear —, geklemmt werden muss hier nichts.
        const eased = easeOut(t);
        commit({ start: lerp(from.start, target.start, eased), end: lerp(from.end, target.end, eased) });
        animation.current = { frame: requestAnimationFrame(step), target };
      };
      animation.current = { frame: requestAnimationFrame(step), target };
    },
    [commit, stopAnimation],
  );

  const zoomBy = useCallback(
    (factor: number, anchorDay?: number) => {
      const { world: w, width: px } = bounds.current;
      if (anchorDay !== undefined) {
        stopAnimation();
        commit(zoomViewport(current.current, factor, anchorDay, w, px));
        return;
      }
      // Wer schnell zweimal „+" drückt, meint zweimal 1,5 — gerechnet wird
      // deshalb vom Ziel der laufenden Animation aus, nicht vom Zwischenbild.
      const base = animation.current?.target ?? current.current;
      animateTo(zoomViewport(base, factor, (base.start + base.end) / 2, w, px));
    },
    [animateTo, commit, stopAnimation],
  );

  const panBy = useCallback(
    (deltaDays: number) => {
      stopAnimation();
      const { world: w, width: px } = bounds.current;
      commit(panViewport(current.current, deltaDays, w, px));
    },
    [commit, stopAnimation],
  );

  const fit = useCallback(() => {
    const { world: w, width: px } = bounds.current;
    animateTo(clampViewport(w, w, px));
  }, [animateTo]);

  const setViewport = useCallback(
    (next: Viewport) => {
      stopAnimation();
      const { world: w, width: px } = bounds.current;
      commit(clampViewport(next, w, px));
    },
    [commit, stopAnimation],
  );

  useEffect(() => stopAnimation, [stopAnimation]);

  // Die Zeilenverteilung hängt am Zoom. Folgte sie jedem Rad-Ereignis,
  // sprängen die Einträge unter den Fingern; sie folgt deshalb erst, wenn die
  // Geste ruht.
  const [settled, setSettled] = useState(viewport);
  useEffect(() => {
    const timer = setTimeout(() => setSettled(viewport), SETTLE_MS);
    return () => clearTimeout(timer);
  }, [viewport]);

  const peek = useCallback(() => current.current, []);

  return useMemo(
    () => ({ viewport, settled, zoomBy, panBy, fit, setViewport, peek }),
    [viewport, settled, zoomBy, panBy, fit, setViewport, peek],
  );
}

// ---------------------------------------------------------------------------
// Gesten

/** Ab dieser Strecke ist ein Druck ein Ziehen und kein Klick mehr. */
const DRAG_THRESHOLD_PX = 3;

/** Empfindlichkeit von Strg + Rad: 100 px Rad ≈ Faktor e. */
const WHEEL_ZOOM_PER_PX = 0.01;

/** `deltaMode` 1 zählt Zeilen; eine Zeile sind rund 16 px. */
const LINE_PX = 16;

/** Wo ein Druck bedient statt verschiebt: Einträge, Links, Felder, das Fenster der Übersicht. */
const INTERACTIVE = "button, a, input, [role=slider]";

/** Safaris `GestureEvent` steht in keiner DOM-Typbibliothek. */
interface GestureLike extends Event {
  scale: number;
  clientX: number;
}

interface GestureContext {
  controller: ViewportController;
  scale: Scale;
  onWheelHint?: () => void;
}

interface Point {
  x: number;
  y: number;
}

interface Drag {
  pointerId: number;
  start: Point;
  lastX: number;
  /** Erst jenseits der Schwelle; davor ist es womöglich noch ein Klick. */
  active: boolean;
}

interface Pinch {
  distance: number;
  midX: number;
}

/**
 * Hängt die Zuhörer an und gibt zurück, wie man sie wieder abnimmt.
 *
 * Die Zustände hier (gedrückte Zeiger, laufendes Ziehen) leben nur zwischen
 * zwei DOM-Ereignissen und gehören keinem Rendern; deshalb Variablen in der
 * Closure statt React-Zustand.
 */
function attachGestures(element: HTMLElement, latest: React.RefObject<GestureContext>): () => void {
  let hinted = false;
  let pointers: ReadonlyMap<number, Point> = new Map();
  let drag: Drag | null = null;
  let pinch: Pinch | null = null;
  let swallowClick = false;
  let gestureScale = 1;

  const localX = (clientX: number): number => clientX - element.getBoundingClientRect().left;
  /** Die Skala des jüngsten Ausschnitts, nicht die des letzten Bildes. */
  const liveScale = (): Scale => {
    const { controller, scale } = latest.current;
    return createScale(controller.peek(), scale.width);
  };
  const dayAtClient = (clientX: number): number => liveScale().dayAt(localX(clientX));

  const panPixels = (px: number) => {
    const { controller } = latest.current;
    const { pxPerDay } = liveScale();
    if (px !== 0 && pxPerDay > 0) controller.panBy(px / pxPerDay);
  };

  const onWheel = (event: WheelEvent) => {
    const { controller, scale, onWheelHint } = latest.current;
    const unit = event.deltaMode === 1 ? LINE_PX : event.deltaMode === 2 ? scale.width : 1;
    const deltaX = event.deltaX * unit;
    const deltaY = event.deltaY * unit;

    // Chromium und Firefox melden den Pinch auf dem Trackpad als Rad mit Strg.
    if (event.ctrlKey || event.metaKey) {
      event.preventDefault();
      if (deltaY !== 0) controller.zoomBy(Math.exp(-deltaY * WHEEL_ZOOM_PER_PX), dayAtClient(event.clientX));
      return;
    }
    // Manche Browser machen aus Shift + Rad schon selbst ein waagerechtes Rad.
    if (event.shiftKey) {
      event.preventDefault();
      panPixels(deltaY !== 0 ? deltaY : deltaX);
      return;
    }
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      event.preventDefault();
      panPixels(deltaX);
      return;
    }
    // Das senkrechte Rad gehört der Seite: wer an einem Zeitstrahl vorbei
    // scrollt, darf nicht in ihm hängen bleiben. Einmal gibt es den Hinweis,
    // wie man zoomt.
    if (deltaY !== 0 && !hinted) {
      hinted = true;
      onWheelHint?.();
    }
  };

  // Safari meldet den Pinch nicht als Rad, sondern als eigene Gesten. `scale`
  // zählt dort ab Gestenbeginn; gezoomt wird um das Verhältnis zum Vorschritt.
  const onGestureStart = (event: Event) => {
    event.preventDefault();
    gestureScale = 1;
  };
  const onGestureChange = (event: Event) => {
    event.preventDefault();
    const { scale: next, clientX } = event as GestureLike;
    // iOS meldet einen Pinch mit zwei Fingern zusätzlich als Zeiger; dort
    // zoomt schon der Pinch unten, und beides zusammen zoomte doppelt.
    if (!(next > 0) || pointers.size >= 2) return;
    const factor = next / gestureScale;
    gestureScale = next;
    latest.current.controller.zoomBy(factor, dayAtClient(clientX));
  };
  const onGestureEnd = (event: Event) => {
    event.preventDefault();
    gestureScale = 1;
  };

  const pinchOf = (points: ReadonlyMap<number, Point>): Pinch => {
    const [a, b] = [...points.values()];
    return { distance: Math.hypot(a.x - b.x, a.y - b.y), midX: (a.x + b.x) / 2 };
  };

  const onPointerDown = (event: PointerEvent) => {
    // Neu bei jedem Druck, auch auf einem Eintrag: sonst schluckte ein nie
    // abgeholter Merker aus einem Touch-Ziehen den nächsten echten Klick.
    swallowClick = false;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    if (event.target instanceof Element && event.target.closest(INTERACTIVE) !== null) return;

    // Eine Maus hat nur einen Zeiger; ein verwaister Eintrag aus einem
    // abgebrochenen Zug machte sonst aus dem nächsten Druck einen Pinch.
    const base = event.pointerType === "mouse" ? new Map<number, Point>() : new Map(pointers);
    pointers = base.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pointers.size === 1) {
      drag = { pointerId: event.pointerId, start: { x: event.clientX, y: event.clientY }, lastX: event.clientX, active: false };
      pinch = null;
    } else if (pointers.size === 2) {
      drag = null;
      pinch = pinchOf(pointers);
      element.setPointerCapture?.(event.pointerId);
    }
  };

  const movePinch = (current: Pinch) => {
    const next = pinchOf(pointers);
    pinch = next;
    if (!(current.distance > 0) || !(next.distance > 0)) return;
    swallowClick = true;
    const { controller } = latest.current;
    const factor = next.distance / current.distance;
    if (factor !== 1) controller.zoomBy(factor, dayAtClient(current.midX));
    // Wandern beide Finger gemeinsam, wandert der Plan mit — umgerechnet mit
    // dem Maßstab nach dem Zoom, den `liveScale` schon kennt.
    const shift = next.midX - current.midX;
    const { pxPerDay } = liveScale();
    if (shift !== 0 && pxPerDay > 0) controller.panBy(-shift / pxPerDay);
  };

  const onPointerMove = (event: PointerEvent) => {
    if (!pointers.has(event.pointerId)) return;
    pointers = new Map(pointers).set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pinch !== null && pointers.size >= 2) {
      movePinch(pinch);
      return;
    }
    if (drag === null || drag.pointerId !== event.pointerId) return;
    if (!drag.active) {
      const distance = Math.hypot(event.clientX - drag.start.x, event.clientY - drag.start.y);
      if (distance < DRAG_THRESHOLD_PX) return;
      drag = { ...drag, active: true };
      swallowClick = true;
      // Ohne Capture verlöre das Ziehen den Zeiger, sobald er die Fläche verlässt.
      element.setPointerCapture?.(event.pointerId);
    }
    panPixels(drag.lastX - event.clientX);
    drag = { ...drag, lastX: event.clientX };
  };

  const onPointerEnd = (event: PointerEvent) => {
    if (!pointers.has(event.pointerId)) return;
    const rest = new Map(pointers);
    rest.delete(event.pointerId);
    pointers = rest;

    if (pointers.size === 1) {
      // Hebt ein Finger vom Pinch ab, verschiebt der andere nahtlos weiter —
      // ab seiner jetzigen Stelle, sonst spränge der Plan um die Pinch-Strecke.
      const [[pointerId, point]] = [...pointers];
      drag = { pointerId, start: point, lastX: point.x, active: pinch !== null || drag?.active === true };
      pinch = null;
    } else if (pointers.size === 0) {
      drag = null;
      pinch = null;
    }
  };

  const onPointerCancel = (event: PointerEvent) => {
    onPointerEnd(event);
    // Nach einem Abbruch folgt kein Klick, den es zu schlucken gäbe.
    swallowClick = false;
  };

  // In der Capture-Phase, damit der Klick am Ende eines Ziehens gar nicht erst
  // bei einem Eintrag ankommt und dort Details öffnet. Tastatur-Klicks
  // (`detail === 0`) gehen immer durch.
  const onClickCapture = (event: MouseEvent) => {
    if (!swallowClick) return;
    swallowClick = false;
    if (event.detail === 0) return;
    event.preventDefault();
    event.stopPropagation();
  };

  // React meldet `onWheel` passiv an; `preventDefault` bliebe dort wirkungslos
  // und die Seite zoomte bzw. scrollte mit.
  const wheelOptions: AddEventListenerOptions = { passive: false };
  element.addEventListener("wheel", onWheel, wheelOptions);
  element.addEventListener("gesturestart", onGestureStart);
  element.addEventListener("gesturechange", onGestureChange);
  element.addEventListener("gestureend", onGestureEnd);
  element.addEventListener("pointerdown", onPointerDown);
  element.addEventListener("pointermove", onPointerMove);
  element.addEventListener("pointerup", onPointerEnd);
  element.addEventListener("pointercancel", onPointerCancel);
  element.addEventListener("lostpointercapture", onPointerEnd);
  element.addEventListener("click", onClickCapture, true);

  return () => {
    element.removeEventListener("wheel", onWheel, wheelOptions);
    element.removeEventListener("gesturestart", onGestureStart);
    element.removeEventListener("gesturechange", onGestureChange);
    element.removeEventListener("gestureend", onGestureEnd);
    element.removeEventListener("pointerdown", onPointerDown);
    element.removeEventListener("pointermove", onPointerMove);
    element.removeEventListener("pointerup", onPointerEnd);
    element.removeEventListener("pointercancel", onPointerCancel);
    element.removeEventListener("lostpointercapture", onPointerEnd);
    element.removeEventListener("click", onClickCapture, true);
  };
}

/** Hängt Mausrad (Strg/⌘ zoomt am Zeiger, Shift/deltaX verschiebt, sonst nichts),
 *  Safari-`gesture*`, Ziehen mit der Maus und Zwei-Finger-Pinch an `target`.
 *  `onWheelHint` feuert beim ersten Mausrad ohne Taste.
 *
 *  `target` ist die Zeitfläche: ihre linke Kante ist x = 0 der Skala. Damit ein
 *  Finger waagerecht verschieben kann, ohne dass die Seite senkrecht festsitzt,
 *  braucht sie `touch-action: pan-y` im Stylesheet. */
export function useTimelineGestures(
  target: React.RefObject<HTMLElement | null>,
  controller: ViewportController,
  scale: Scale,
  options: { onWheelHint?: () => void },
): void {
  // Die Zuhörer bleiben über viele Renderings hängen; sie lesen Controller
  // und Skala deshalb frisch aus dieser Ref statt aus einer alten Closure.
  const latest = useRef<GestureContext>({ controller, scale, onWheelHint: options.onWheelHint });
  useLayoutEffect(() => {
    latest.current = { controller, scale, onWheelHint: options.onWheelHint };
  });

  // Nach jedem Rendern geprüft statt einmal beim Einhängen: wechselt die
  // Ansicht (Zeitstrahl ↔ Liste), kommt die Fläche als neues Element zurück.
  const attached = useRef<{ element: HTMLElement; detach: () => void } | null>(null);
  useEffect(() => {
    const element = target.current;
    if (attached.current?.element === element) return;
    attached.current?.detach();
    attached.current = element === null ? null : { element, detach: attachGestures(element, latest) };
  });
  useEffect(
    () => () => {
      attached.current?.detach();
      attached.current = null;
    },
    [],
  );
}
