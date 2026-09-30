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
 * Der Fokus zwischen den Einträgen.
 *
 * Mit bis zu 300 Einträgen wäre jeder ein eigener Tab-Stopp eine Zumutung:
 * wer hinter den Plan will, drückte 300-mal Tab. Die Zeitfläche ist deshalb
 * ein einziger Tab-Stopp (roving tabindex); zwischen den Einträgen bewegen
 * die Pfeiltasten — waagerecht innerhalb der Ebene, senkrecht zur zeitlich
 * nächsten in der Ebene darüber oder darunter.
 */

import { KeyboardEvent, RefObject, useCallback, useState } from "react";

/** Zeilen der Navigation: je Ebene die Einträge nach Beginn, zuletzt die Stichtage. */
export type FocusRows = readonly (readonly string[])[];

const NAVIGATION_KEYS = new Set(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"]);

function locate(rows: FocusRows, id: string): { row: number; column: number } | null {
  for (let row = 0; row < rows.length; row += 1) {
    const column = rows[row].indexOf(id);
    if (column !== -1) return { row, column };
  }
  return null;
}

function nearest(ids: readonly string[], day: number, dayOf: (id: string) => number): string {
  return ids.reduce((best, id) => (Math.abs(dayOf(id) - day) < Math.abs(dayOf(best) - day) ? id : best));
}

/** Wohin der Fokus mit `key` wandert; `null`, wenn es dort nicht weitergeht. */
export function moveFocus(rows: FocusRows, current: string, key: string, dayOf: (id: string) => number): string | null {
  const at = locate(rows, current);
  if (at === null) return null;
  const row = rows[at.row];

  switch (key) {
    case "ArrowRight":
      return row[at.column + 1] ?? null;
    case "ArrowLeft":
      return at.column > 0 ? row[at.column - 1] : null;
    case "Home":
      return row[0];
    case "End":
      return row[row.length - 1];
    case "ArrowDown":
    case "ArrowUp": {
      const step = key === "ArrowDown" ? 1 : -1;
      for (let index = at.row + step; index >= 0 && index < rows.length; index += step) {
        if (rows[index].length > 0) return nearest(rows[index], dayOf(current), dayOf);
      }
      return null;
    }
    default:
      return null;
  }
}

export interface RovingFocus {
  /** Der Eintrag, der den Tab-Stopp trägt. */
  focusId: string | null;
  setFocusId: (id: string) => void;
  /**
   * Für `onKeyDown` der Zeitfläche; behandelt nur Tasten auf einem Eintrag.
   * Gibt den Eintrag zurück, zu dem der Fokus gewandert ist — die Ansicht holt
   * ihn in den Ausschnitt.
   */
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => string | null;
}

export function useRovingFocus(
  container: RefObject<HTMLElement | null>,
  rows: FocusRows,
  dayOf: (id: string) => number,
): RovingFocus {
  const [chosen, setChosen] = useState<string | null>(null);

  // Verschwindet der Eintrag mit dem Tab-Stopp (Filter), geht er an den ersten
  // sichtbaren — sonst wäre die Zeitfläche mit der Tastatur nicht mehr erreichbar.
  const all = rows.flat();
  const focusId = chosen !== null && all.includes(chosen) ? chosen : (all[0] ?? null);

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>): string | null => {
      if (!NAVIGATION_KEYS.has(event.key) || event.shiftKey || event.altKey || event.metaKey || event.ctrlKey) return null;
      const current = (event.target as HTMLElement).closest<HTMLElement>("[data-item-id]")?.dataset.itemId;
      if (current === undefined) return null;
      const next = moveFocus(rows, current, event.key, dayOf);
      event.preventDefault();
      if (next === null) return null;
      setChosen(next);
      const target = Array.from(container.current?.querySelectorAll<HTMLElement>("[data-item-id]") ?? []).find(
        (element) => element.dataset.itemId === next,
      );
      target?.focus();
      return next;
    },
    [container, rows, dayOf],
  );

  return { focusId, setFocusId: setChosen, onKeyDown };
}
