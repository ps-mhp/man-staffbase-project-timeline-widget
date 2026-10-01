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
 * Wo ein Popover am Anker steht — reine Rechnung in Bildschirmkoordinaten.
 *
 * Die Popover des Editors stehen `position: fixed`: absolut im rollenden
 * Bereich wurden sie von dessen Rand abgeschnitten, sobald weder darunter noch
 * darüber Platz war — und hinrollen ließ es sich nicht, weil ein absolut
 * gesetztes Kind die Rollhöhe nicht verlängert (am 30.09.2026 im Studio: das
 * Anlegen einer Kategorie war unten abgeschnitten). Gerechnet wird gegen die
 * Fläche des Editors, nicht gegen den rollenden Bereich.
 */

export interface Box {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface PopoverPositionInput {
  anchor: Box;
  size: { width: number; height: number };
  /** Die Fläche, in der das Popover ganz bleiben soll — der Editor. */
  bounds: Box;
  /** `end`: rechte Kanten bündig (Knopf rechts in der Zeile); `start`: linke (Auswahlfeld). */
  align: "start" | "end";
  /** Abstand zum Anker. */
  gap?: number;
  /** Mindestabstand zum Rand der Fläche. */
  margin?: number;
}

export interface PopoverPosition {
  top: number;
  left: number;
  side: "below" | "above";
  /** Gesetzt, wenn es weder unten noch oben ganz passt; dann rollt es selbst. */
  maxHeight?: number;
}

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), Math.max(min, max));

export function popoverPosition({
  anchor,
  size,
  bounds,
  align,
  gap = 4,
  margin = 8,
}: PopoverPositionInput): PopoverPosition {
  const spaceBelow = bounds.bottom - margin - (anchor.bottom + gap);
  const spaceAbove = anchor.top - gap - (bounds.top + margin);

  const preferred = align === "end" ? anchor.right - size.width : anchor.left;
  const left = clamp(
    preferred,
    bounds.left + margin,
    bounds.right - margin - size.width,
  );

  // Unten ist die Regel; nach oben nur, wenn es unten nicht passt, oben aber schon.
  if (size.height <= spaceBelow)
    return { top: anchor.bottom + gap, left, side: "below" };
  if (size.height <= spaceAbove)
    return { top: anchor.top - gap - size.height, left, side: "above" };

  // Passt nirgends ganz: auf die größere Seite, dort begrenzt und selbst rollend.
  if (spaceBelow >= spaceAbove)
    return {
      top: anchor.bottom + gap,
      left,
      side: "below",
      maxHeight: spaceBelow,
    };
  return {
    top: bounds.top + margin,
    left,
    side: "above",
    maxHeight: spaceAbove,
  };
}
