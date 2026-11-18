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
 * Bewusst ohne Portal: der Editor steckt im Shadow Root des Config-Modals,
 * dessen Host Klicks und Fokuswechsel vom Staffbase-Dialog fernhält
 * (`@shared/ui/config-modal`). Ein eigenes Portal an `document.body` läge
 * außerhalb davon, und jeder Klick hinein schlösse den ganzen
 * Konfigurationsdialog.
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

import { Button } from "@man/config-ui/primitives/button";
import { activeElementOf } from "@shared/shadow-dom";

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
    // In der Wurzel des Dialogs gefragt: im Shadow Root des Config-Modals
    // wäre `document.activeElement` nur der Host.
    const active =
      dialogRef.current === null
        ? document.activeElement
        : activeElementOf(dialogRef.current);
    const opener = active instanceof HTMLElement ? active : null;
    // Gibt es eine Auswahl, ist sie das Erste, was zu entscheiden ist; sonst
    // steht der Fokus auf dem harmlosen Knopf, damit Enter nichts löscht.
    const choice = dialogRef.current?.querySelector<HTMLElement>(
      "[data-dialog-choices] " + FOCUSABLE,
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
    const current = activeElementOf(first);
    if (event.shiftKey && current === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && current === last) {
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
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/55 p-4">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={messageId}
        className="flex w-full max-w-[460px] flex-col gap-3 rounded-lg bg-background p-5 shadow-xl"
        onKeyDown={onKeyDown}
      >
        <h3 id={titleId} className="text-base font-semibold text-foreground">
          {title}
        </h3>
        <p id={messageId} className="text-sm text-muted-foreground">
          {message}
        </p>
        {children !== undefined && (
          <div data-dialog-choices="" className="flex flex-col gap-2">
            {children}
          </div>
        )}
        <div className="flex justify-end gap-2 pt-2">
          <Button ref={cancelRef} type="button" variant="outline" size="lg" onClick={onCancel}>
            Abbrechen
          </Button>
          <Button type="button" variant="destructive" size="lg" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
