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
 * Die Rückfrage vor dem Löschen eines Eintrags, am Knopf, der sie öffnet —
 * in der Liste am Papierkorb, im Formular an „Löschen“. Eine Komponente für
 * beide, damit dieselbe Handlung überall gleich nachfragt. Der Fokus steht
 * beim Öffnen auf „Abbrechen“, damit ein unbedachtes Enter nichts löscht.
 */

import * as React from "react";
import { ReactElement, useId, useRef } from "react";

import { AnchoredPopover } from "./anchored-popover";

export interface DeleteConfirmProps {
  /** Titel des Eintrags. */
  title: string;
  /** Wie viele Einträge ihn als Vorgänger nennen. */
  dependents: number;
  onConfirm: () => void;
  onCancel: () => void;
}

function dependentsMessage(count: number): string {
  return count === 1
    ? "1 Eintrag hängt davon ab; die Verbindung wird entfernt."
    : `${count} Einträge hängen davon ab; die Verbindungen werden entfernt.`;
}

export function DeleteConfirm({
  title,
  dependents,
  onConfirm,
  onCancel,
}: DeleteConfirmProps): ReactElement {
  const titleId = useId();
  const messageId = useId();
  const cancelRef = useRef<HTMLButtonElement>(null);

  return (
    <AnchoredPopover
      labelledBy={titleId}
      describedBy={dependents > 0 ? messageId : undefined}
      onClose={onCancel}
      initialFocus={cancelRef}
      className="man-pt-editor__confirm"
    >
      {({ close }) => (
        <>
          <p id={titleId} className="man-pt-editor__popover-title">
            „{title}“ löschen?
          </p>
          {dependents > 0 && (
            <p id={messageId} className="man-pt-editor__hint">
              {dependentsMessage(dependents)}
            </p>
          )}
          <div className="man-pt-editor__popover-actions">
            <button
              ref={cancelRef}
              type="button"
              className="man-pt-editor__button"
              onClick={() => close(true)}
            >
              Abbrechen
            </button>
            <button
              type="button"
              className="man-pt-editor__button man-pt-editor__button--danger"
              onClick={onConfirm}
            >
              Löschen
            </button>
          </div>
        </>
      )}
    </AnchoredPopover>
  );
}
