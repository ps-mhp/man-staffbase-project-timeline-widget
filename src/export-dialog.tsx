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
 * Der Dialog vor dem Excel-Export: welcher Umfang, dann herunterladen.
 *
 * Die Zahlen stehen an den Optionen, damit niemand von der Menge überrascht
 * wird — eine „aktuelle Ansicht" mit drei Einträgen ist ein anderer Export als
 * erwartet, wenn man nicht mehr weiß, dass ein Filter aktiv ist.
 *
 * ExcelJS kommt erst mit dem Klick (`import()`); das Bundle auf der Seite
 * bleibt klein.
 */

import React, { ReactElement, useEffect, useId, useRef, useState } from "react";

import { trapTab, useReturnFocus } from "./focus-trap";
import { ExportScope } from "./plan-filter";

export interface ExportDialogProps {
  counts: Record<ExportScope, number>;
  /** Baut und lädt herunter; wirft, wenn es scheitert. */
  onExport: (scope: ExportScope) => Promise<void>;
  onClose: () => void;
}

export const EXPORT_FAILED_MESSAGE = "Der Export ist fehlgeschlagen. Bitte erneut versuchen.";

const OPTIONS: { scope: ExportScope; label: string }[] = [
  { scope: "view", label: "Aktuelle Ansicht" },
  { scope: "all", label: "Ganzer Plan" },
];

export function ExportDialog({ counts, onExport, onClose }: ExportDialogProps): ReactElement {
  const [scope, setScope] = useState<ExportScope>("view");
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const titleId = useId();
  const firstRef = useRef<HTMLInputElement>(null);
  // Zurück zum Knopf „Exportieren", wer auch immer den Dialog schließt.
  useReturnFocus();

  useEffect(() => {
    firstRef.current?.focus();
  }, []);

  const run = async () => {
    setBusy(true);
    setFailed(false);
    try {
      await onExport(scope);
      onClose();
    } catch {
      setFailed(true);
      setBusy(false);
    }
  };

  return (
    <div className="man-pt__dialog-backdrop" onPointerDown={(event) => event.target === event.currentTarget && !busy && onClose()}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="man-pt__dialog"
        onKeyDown={(event) => {
          if (event.key === "Escape" && !busy) {
            event.stopPropagation();
            onClose();
          }
          trapTab(event);
        }}
      >
        <h3 id={titleId} className="man-pt__dialog-title">
          Als Excel exportieren
        </h3>
        <fieldset className="man-pt__dialog-options">
          <legend className="man-pt__visually-hidden">Umfang</legend>
          {OPTIONS.map((option, index) => (
            <label key={option.scope} className="man-pt__radio">
              <input
                ref={index === 0 ? firstRef : undefined}
                type="radio"
                name={`${titleId}-scope`}
                value={option.scope}
                checked={scope === option.scope}
                disabled={busy}
                onChange={() => setScope(option.scope)}
              />
              {`${option.label} (${counts[option.scope]} ${counts[option.scope] === 1 ? "Eintrag" : "Einträge"})`}
            </label>
          ))}
        </fieldset>
        {failed && (
          <p className="man-pt__error" role="alert">
            {EXPORT_FAILED_MESSAGE}
          </p>
        )}
        <div className="man-pt__dialog-actions">
          <button type="button" className="man-pt__button man-pt__button--quiet" disabled={busy} onClick={onClose}>
            Abbrechen
          </button>
          <button
            type="button"
            className="man-pt__button man-pt__button--primary"
            disabled={busy || counts[scope] === 0}
            aria-busy={busy}
            onClick={() => void run()}
          >
            {busy ? "Wird erstellt …" : "Excel herunterladen"}
          </button>
        </div>
      </div>
    </div>
  );
}
