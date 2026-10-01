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
 * Eine Größe, die ein Ziehgriff verstellt: gewünscht, gemerkt, geklemmt.
 *
 * Gemerkt wird der Wunsch, geklemmt erst beim Anzeigen. Wird das Fenster
 * kleiner, weicht der Bereich; wird es wieder größer, kehrt er zur gezogenen
 * Größe zurück, statt auf der geklemmten stehen zu bleiben.
 */

import { RefObject, useLayoutEffect, useRef, useState } from "react";

import {
  SplitBounds,
  clampSize,
  forgetSize,
  readStoredSize,
  splitBounds,
  storeSize,
} from "./split-size";

export interface SplitSizeOptions {
  /** Schlüssel im Speicher des Browsers, ohne Präfix. */
  storageKey: string;
  /** Die Vorgabe, solange nichts gezogen oder gemerkt ist. */
  fallback: () => number;
  min: number;
  /** So viel behält der andere Bereich mindestens. */
  reserve: number;
  /** Ändert dieses Element seine Größe, wird neu gemessen. */
  observe: RefObject<HTMLElement | null>;
  /** Der Platz für beide Bereiche zusammen; `null`, solange er sich nicht messen lässt. */
  measure: () => number | null;
  /** Ändert sich dieser Wert, wird ebenfalls neu gemessen — etwa beim Ausklappen. */
  remeasureKey?: unknown;
}

export interface SplitSize extends SplitBounds {
  size: number;
  set: (size: number) => void;
  /** Zurück zur Vorgabe, auch im Speicher. */
  reset: () => void;
}

export function useSplitSize({
  storageKey,
  fallback,
  min,
  reserve,
  observe,
  measure,
  remeasureKey,
}: SplitSizeOptions): SplitSize {
  const [wanted, setWanted] = useState<number | null>(() =>
    readStoredSize(storageKey),
  );
  const [available, setAvailable] = useState<number | null>(null);
  const measureRef = useRef(measure);
  measureRef.current = measure;

  useLayoutEffect(() => {
    const update = (): void => {
      const measured = measureRef.current();
      // Null oder weniger heißt: noch nicht gezeichnet (oder jsdom) — dann
      // lieber gar nicht klemmen als alles aufs Minimum.
      setAvailable(measured !== null && measured > 0 ? measured : null);
    };
    update();
    const target = observe.current;
    const observer =
      typeof ResizeObserver === "undefined" || target === null
        ? null
        : new ResizeObserver(update);
    if (observer !== null && target !== null) observer.observe(target);
    window.addEventListener("resize", update);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [observe, remeasureKey]);

  const bounds = splitBounds(available, min, reserve);
  const size = clampSize(wanted ?? fallback(), bounds);

  const set = (next: number): void => {
    const clamped = Math.round(clampSize(next, bounds));
    setWanted(clamped);
    storeSize(storageKey, clamped);
  };

  const reset = (): void => {
    setWanted(null);
    forgetSize(storageKey);
  };

  return { ...bounds, size, set, reset };
}
