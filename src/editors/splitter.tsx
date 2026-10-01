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
 * Ein Ziehgriff zwischen zwei Bereichen, nach dem WAI-ARIA-Muster
 * „Window Splitter“: `role="separator"` mit Wert, fokussierbar, Pfeiltasten
 * verschieben, Pos1/Ende springen an die Grenzen, Doppelklick stellt die
 * Vorgabe wieder her.
 *
 * Kein `button`: die Staffbase-App färbt jeden Knopf bei Fokus und Überfahren
 * blau (siehe `_plan-editor-tokens.scss`), ein Griff ist aber kein Knopf.
 */

import * as React from "react";
import {
  KeyboardEvent,
  PointerEvent,
  ReactElement,
  useRef,
  useState,
} from "react";

import { keyboardSize } from "./split-size";
import { SplitSize } from "./use-split-size";

export interface SplitterProps {
  /**
   * Lage der Trennlinie: `horizontal` liegt zwischen oben und unten und
   * verstellt eine Höhe, `vertical` liegt zwischen links und rechts und
   * verstellt eine Breite.
   */
  orientation: "horizontal" | "vertical";
  label: string;
  /** `id` des Bereichs, dessen Größe der Griff verstellt. */
  controls: string;
  split: SplitSize;
}

export function Splitter({
  orientation,
  label,
  controls,
  split,
}: SplitterProps): ReactElement {
  const drag = useRef<{ start: number; size: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const coordinate = (event: PointerEvent<HTMLDivElement>): number =>
    orientation === "horizontal" ? event.clientY : event.clientX;

  const onPointerDown = (event: PointerEvent<HTMLDivElement>): void => {
    if (event.button !== 0) return;
    // Sonst begänne der Browser beim Ziehen eine Textauswahl quer über den Editor.
    event.preventDefault();
    event.currentTarget.focus();
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { start: coordinate(event), size: split.size };
    setDragging(true);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>): void => {
    if (drag.current === null) return;
    split.set(drag.current.size + coordinate(event) - drag.current.start);
  };

  const endDrag = (event: PointerEvent<HTMLDivElement>): void => {
    if (drag.current === null) return;
    drag.current = null;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    const next = keyboardSize(split.size, event.key, event.shiftKey, split);
    if (next === null) return;
    event.preventDefault();
    split.set(next);
  };

  return (
    <div
      role="separator"
      tabIndex={0}
      aria-orientation={orientation}
      aria-label={label}
      aria-controls={controls}
      aria-valuenow={Math.round(split.size)}
      aria-valuemin={split.min}
      // Ohne gemessenen Platz gibt es keine Obergrenze; dann ist der Wert selbst die höchste bekannte.
      aria-valuemax={
        Number.isFinite(split.max)
          ? Math.round(split.max)
          : Math.round(split.size)
      }
      className={`man-pt-editor__splitter man-pt-editor__splitter--${orientation}${
        dragging ? " man-pt-editor__splitter--dragging" : ""
      }`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onDoubleClick={split.reset}
      onKeyDown={onKeyDown}
    />
  );
}
