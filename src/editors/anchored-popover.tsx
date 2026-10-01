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
 * Ein kleines Dialogfeld, verankert an dem Element, das es öffnet: die
 * Rückfrage beim Löschen, das Anlegen einer Ebene oder Kategorie am
 * Auswahlfeld.
 *
 * Ohne Portal: das Modal um den Editor hält Klicks nur für seinen eigenen
 * Teilbaum vom Staffbase-Dialog fern (siehe `confirm-dialog.tsx`). Das
 * Popover bleibt deshalb im DOM am Anker, steht aber `position: fixed` in
 * Bildschirmkoordinaten (`popover-position.ts`): so schneidet es kein rollender
 * Bereich ab, und es kippt nach oben, wo unten im Editor kein Platz ist. Beim
 * Rollen und bei Größenänderungen läuft es mit. Esc schließt und gibt den
 * Fokus zurück, ein Klick daneben schließt nur.
 */

import * as React from "react";
import {
  KeyboardEvent,
  ReactElement,
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { Box, PopoverPosition, popoverPosition } from "./popover-position";

/** Die Fläche, in der Popover ganz bleiben sollen: der Editor, sonst das Fenster. */
function boundsOf(element: HTMLElement): Box {
  const editor = element.closest<HTMLElement>(".man-pt-editor");
  if (editor !== null) return editor.getBoundingClientRect();
  return {
    top: 0,
    left: 0,
    right: window.innerWidth,
    bottom: window.innerHeight,
  };
}

export interface PopoverControls {
  /** Schließt; mit `true` kehrt der Fokus zu dem Element zurück, das es geöffnet hat. */
  close: (returnFocus: boolean) => void;
}

export interface AnchoredPopoverProps {
  /** `id` der Überschrift — der Name des Dialogs. */
  labelledBy: string;
  describedBy?: string;
  /** Wird aufgerufen, wenn das Popover schließt — gleich aus welchem Grund. */
  onClose: () => void;
  /** Worauf der Fokus beim Öffnen fällt. */
  initialFocus: RefObject<HTMLElement | null>;
  /** `end`: rechts bündig am Anker (Knopf in der Zeile), `start`: links (Auswahlfeld). */
  align?: "start" | "end";
  className?: string;
  children: (controls: PopoverControls) => ReactNode;
}

export function AnchoredPopover({
  labelledBy,
  describedBy,
  onClose,
  initialFocus,
  align = "end",
  className,
  children,
}: AnchoredPopoverProps): ReactElement {
  const ref = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const [position, setPosition] = useState<PopoverPosition | null>(null);

  const place = useCallback((): void => {
    const popover = ref.current;
    const anchor = popover?.parentElement;
    if (!popover || !anchor) return;
    setPosition(
      popoverPosition({
        anchor: anchor.getBoundingClientRect(),
        // Die natürliche Höhe, nicht die schon begrenzte: sonst schrumpfte es
        // bei jedem Nachrechnen weiter.
        size: { width: popover.offsetWidth, height: popover.scrollHeight },
        bounds: boundsOf(anchor),
        align,
      }),
    );
  }, [align]);

  useLayoutEffect(() => {
    // Wohin der Fokus zurückkehrt: das Element im Anker, das den Fokus hatte,
    // sonst sein erstes Bedienelement. Nicht einfach `activeElement` — Safari
    // fokussiert Knöpfe beim Klick nicht, dann stünde dort `body`.
    const anchor = ref.current?.parentElement ?? null;
    const active = document.activeElement;
    opener.current =
      active instanceof HTMLElement && anchor?.contains(active) === true
        ? active
        : (anchor?.querySelector<HTMLElement>("button, select, input") ?? null);
    place();
    // Ohne Rollen: der Bereich hat sich eben erst eingerichtet.
    initialFocus.current?.focus({ preventScroll: true });
    // Nur beim Öffnen.
  }, []);

  // Rollt der Bereich darunter oder ändert sich das Fenster, wandert der Anker —
  // das Popover folgt ihm. `scroll` steigt nicht auf, also in der Einfangphase.
  useEffect(() => {
    window.addEventListener("resize", place);
    document.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      document.removeEventListener("scroll", place, true);
    };
  }, [place]);

  useEffect(() => {
    // In der Einfangphase: das Modal hält `pointerdown` auf dem Weg nach
    // oben an `document.body` an, beim Dokument käme es sonst nie an.
    const closeOutside = (event: PointerEvent): void => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      // Der Anker zählt mit: ein Klick auf den auslösenden Knopf schaltet
      // selbst um und soll nicht erst schließen, dann wieder öffnen.
      if (ref.current?.parentElement?.contains(target)) return;
      onCloseRef.current();
    };
    document.addEventListener("pointerdown", closeOutside, true);
    return () =>
      document.removeEventListener("pointerdown", closeOutside, true);
  }, []);

  const close = (returnFocus: boolean): void => {
    onClose();
    if (returnFocus) opener.current?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.key !== "Escape") return;
    // Sonst schlösse dieselbe Taste auch das Modal dahinter.
    event.stopPropagation();
    close(true);
  };

  return (
    <div
      ref={ref}
      role="dialog"
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      className={`man-pt-editor__popover man-pt-editor__popover--${position?.side ?? "below"}${className ? ` ${className}` : ""}`}
      // Bis zur ersten Messung unsichtbar, sonst blitzte es oben links auf.
      style={
        position === null
          ? { visibility: "hidden", top: 0, left: 0 }
          : {
              top: position.top,
              left: position.left,
              maxHeight: position.maxHeight,
            }
      }
      onKeyDown={onKeyDown}
    >
      {children({ close })}
    </div>
  );
}
