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
 * Die Rückfrage vor dem Löschen einer Ebene oder Kategorie.
 *
 * Bewusst ohne Portal: der Editor steckt selbst in einem Overlay, das Klicks
 * und Fokuswechsel nur für seinen eigenen Teilbaum vom Staffbase-Dialog
 * fernhält (`useStopOutsideDismissPropagation` in `@shared/config-modal`). Ein
 * eigenes Portal an `document.body` läge außerhalb davon, und jeder Klick
 * hinein schlösse den ganzen Konfigurationsdialog.
 */

import * as React from "react";
import {
  KeyboardEvent,
  ReactElement,
  ReactNode,
  useEffect,
  useId,
  useRef,
} from "react";

const FOCUSABLE =
  "button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])";

export interface ConfirmDialogProps {
  title: string;
  /** Was auf dem Spiel steht; zugleich die Beschreibung des Dialogs. */
  message: ReactNode;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  /** Auswahl im Dialog, etwa wohin die Einträge einer Ebene wandern. */
  children?: ReactNode;
  /**
   * Wohin der Fokus geht, wenn der auslösende Knopf danach nicht mehr steht —
   * nach dem Löschen einer Ebene gibt es ihre Zeile nicht mehr.
   */
  fallbackFocus?: () => HTMLElement | null;
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
  children,
  fallbackFocus,
}: ConfirmDialogProps): ReactElement {
  const titleId = useId();
  const messageId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const fallbackRef = useRef(fallbackFocus);

  useEffect(() => {
    // Woher der Fokus kam — dorthin gehört er beim Schließen zurück, sonst
    // stünde er am Anfang des Dialogs und die Tastaturbedienung begänne von vorn.
    const opener =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    // Gibt es eine Auswahl, ist sie das Erste, was zu entscheiden ist; sonst
    // steht der Fokus auf dem harmlosen Knopf, damit Enter nichts löscht.
    const choice = dialogRef.current?.querySelector<HTMLElement>(
      ".man-pt-editor__dialog-choices " + FOCUSABLE,
    );
    (choice ?? cancelRef.current)?.focus();
    return () => {
      if (opener !== null && opener.isConnected) opener.focus();
      else fallbackRef.current?.()?.focus();
    };
  }, []);

  /** Hält den Fokus im Dialog; sonst wanderte er in den Editor dahinter. */
  const trapTab = (event: KeyboardEvent<HTMLDivElement>): void => {
    const focusable =
      dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (first === undefined || last === undefined) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === "Escape") {
      event.stopPropagation();
      onCancel();
    } else if (event.key === "Tab") {
      trapTab(event);
    }
  };

  return (
    <div className="man-pt-editor__scrim">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={messageId}
        className="man-pt-editor__dialog"
        onKeyDown={onKeyDown}
      >
        <h3 id={titleId} className="man-pt-editor__dialog-title">
          {title}
        </h3>
        <p id={messageId} className="man-pt-editor__dialog-message">
          {message}
        </p>
        {children !== undefined && (
          <div className="man-pt-editor__dialog-choices">{children}</div>
        )}
        <div className="man-pt-editor__dialog-actions">
          <button
            ref={cancelRef}
            type="button"
            className="man-pt-editor__button"
            onClick={onCancel}
          >
            Abbrechen
          </button>
          <button
            type="button"
            className="man-pt-editor__button man-pt-editor__button--danger"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
