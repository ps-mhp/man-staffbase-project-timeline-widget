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
 * Ein Knopf in einer Zeile, der ein kleines Feld darunter aufklappt — für
 * Farbe und Form einer Kategorie.
 *
 * Aufgeklappt liegt das Feld in der Zeile, nicht in einem Portal: das Modal
 * um den Editor hält Klicks nur für seinen eigenen Teilbaum vom
 * Staffbase-Dialog fern (siehe `confirm-dialog.tsx`). Eine Wahl schließt das
 * Feld nicht — die Pfeiltasten wählen bei jedem Schritt, und wer sich so
 * durch die Möglichkeiten bewegt, soll nicht nach dem ersten Schritt draußen
 * stehen. Es schließt mit Esc oder einem Klick daneben.
 */

import * as React from "react";
import {
  KeyboardEvent,
  ReactElement,
  ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import { Button } from "@man/config-ui/primitives/button";

/** Worauf der Fokus beim Aufklappen fällt: die gewählte Möglichkeit, sonst die erste. */
const CHOSEN =
  'input[type="radio"]:checked, [role="radio"][aria-checked="true"]';
const ANY = 'input[type="radio"], [role="radio"]';

export interface InlinePickerProps {
  /** Zugänglicher Name des Knopfs, mit dem aktuellen Wert. */
  label: string;
  /** Was der Knopf zeigt, etwa ein Farbfleck oder eine Form. */
  face: ReactNode;
  className?: string;
  /** Das aufgeklappte Feld. */
  children: ReactNode;
}

export function InlinePicker({
  label,
  face,
  className,
  children,
}: InlinePickerProps): ReactElement {
  const popoverId = useId();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const root = rootRef.current;
    const popover = root?.querySelector("[data-picker-popover]");
    (
      popover?.querySelector<HTMLElement>(CHOSEN) ??
      popover?.querySelector<HTMLElement>(ANY)
    )?.focus();

    // In der Einfangphase: das Modal hält `pointerdown` auf dem Weg nach
    // oben an `document.body` an, beim Dokument käme es sonst nie an.
    const closeOutside = (event: PointerEvent): void => {
      if (event.target instanceof Node && !root?.contains(event.target))
        setOpen(false);
    };
    document.addEventListener("pointerdown", closeOutside, true);
    return () =>
      document.removeEventListener("pointerdown", closeOutside, true);
  }, [open]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.key !== "Escape") return;
    // Sonst schlösse dieselbe Taste auch eine Rückfrage oder das Modal dahinter.
    event.stopPropagation();
    setOpen(false);
    buttonRef.current?.focus();
  };

  return (
    <div
      ref={rootRef}
      className={`relative shrink-0${className ? ` ${className}` : ""}`}
    >
      <Button
        ref={buttonRef}
        type="button"
        variant="outline"
        size="icon"
        aria-label={label}
        aria-expanded={open}
        aria-controls={open ? popoverId : undefined}
        onClick={() => setOpen(!open)}
      >
        {face}
      </Button>
      {open && (
        <div
          id={popoverId}
          data-picker-popover=""
          className="absolute top-[calc(100%+4px)] left-0 z-20 w-max rounded-md border bg-popover p-3 shadow-md"
          onKeyDown={onKeyDown}
        >
          {children}
        </div>
      )}
    </div>
  );
}
