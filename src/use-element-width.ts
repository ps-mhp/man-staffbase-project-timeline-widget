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
 * Die Breite eines Elements, nachgeführt.
 *
 * Die Zeitfläche rechnet in Pixeln; ändert sich ihre Breite (Fenster, Spalte,
 * Editor-Vorschau), muss die Skala mit. Ohne `ResizeObserver` (jsdom, sehr alte
 * Browser) wird einmal gemessen und bei `resize` erneut.
 */

import { RefObject, useLayoutEffect, useState } from "react";

/** Solange nichts gemessen ist — etwa im ersten Render —, wird mit dieser Breite gerechnet. */
export const FALLBACK_WIDTH = 960;

const read = (element: HTMLElement): number => {
  const width = element.getBoundingClientRect().width || element.clientWidth;
  return width > 0 ? Math.round(width) : FALLBACK_WIDTH;
};

/**
 * @param remountKey ändert sich, wenn das Element neu entsteht — der Plan hatte
 * beim ersten Aufbau keine Einträge, oder die Vollbild-Ebene hängt ihn um. Die
 * Ref selbst ändert sich dabei nicht und löste nichts aus.
 */
export function useElementWidth(ref: RefObject<HTMLElement | null>, remountKey: unknown = true): number {
  const [width, setWidth] = useState(FALLBACK_WIDTH);

  useLayoutEffect(() => {
    const element = ref.current;
    if (element === null) return;
    const update = () => setWidth(read(element));
    update();

    if (typeof ResizeObserver === "function") {
      const observer = new ResizeObserver(update);
      observer.observe(element);
      return () => observer.disconnect();
    }
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [ref, remountKey]);

  return width;
}
