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
 * Ein Eingabefeld mit eigenem Entwurf.
 *
 * Der Plan im Editor ist immer gültig — es gibt keinen Zwischenzustand, den
 * das Speichern verwerfen müsste. Beim Tippen entsteht aber zwangsläufig
 * Ungültiges: ein kurz leerer Titel, ein halb eingegebenes Datum. Das bleibt
 * hier im Feld stehen, samt Fehlermeldung daneben; im Plan steht weiter der
 * letzte gültige Wert. Erst eine gültige Eingabe geht per `onCommit` hinaus.
 */

import * as React from "react";
import { ReactElement, useEffect, useId, useRef, useState } from "react";

import { useReportValidity } from "./field-validity";

/** Liefert die Fehlermeldung, oder `null`, wenn die Eingabe gültig ist. */
export type Validator = (text: string) => string | null;

export const requireText =
  (message: string): Validator =>
  (text) =>
    text.trim() === "" ? message : null;

interface Draft {
  text: string;
  setText: (text: string) => void;
  /** Merkt sich, welchen Wert das Modell gleich annehmen wird. */
  expect: (value: string) => void;
}

/**
 * Der Entwurf folgt dem Modell, sobald sich dieses von außen ändert — etwa
 * weil der Eintrag die Art gewechselt hat. Solange das Modell steht, gehört
 * das Feld den Tippenden, auch mit ungültigem Inhalt.
 *
 * Was das Feld selbst weitergibt, ist keine Änderung von außen: sonst ersetzte
 * der bereinigte Wert („TMS“) sofort den Entwurf („TMS “), und das Leerzeichen
 * vor dem zweiten Wort verschwände beim Tippen.
 */
function useDraft(value: string): Draft {
  const [text, setText] = useState(value);
  const [synced, setSynced] = useState(value);
  if (value !== synced) {
    setSynced(value);
    setText(value);
  }
  return { text, setText, expect: setSynced };
}

export interface DraftFieldProps {
  label: string;
  /** Der gültige Wert aus dem Plan. */
  value: string;
  /** Erhält nur Eingaben, die `validate` gelten lässt — bereinigt durch `normalize`. */
  onCommit: (text: string) => void;
  validate?: Validator;
  /** Bereinigt eine gültige Eingabe, bevor sie ins Modell geht, etwa ohne Leerraum am Rand. */
  normalize?: (text: string) => string;
  type?: "text" | "date";
  multiline?: boolean;
  /** `id` einer `<datalist>` mit Vorschlägen. */
  list?: string;
  /** Verbirgt das Label optisch; Screenreader lesen es weiter vor. */
  hideLabel?: boolean;
  className?: string;
  /**
   * Fokus beim Erscheinen, Inhalt markiert: nach dem Anlegen steht dort
   * „Neuer Meilenstein“, und das erste Tippen soll ihn ersetzen.
   */
  autoFocus?: boolean;
}

export function DraftField({
  label,
  value,
  onCommit,
  validate,
  normalize = (text) => text,
  type = "text",
  multiline = false,
  list,
  hideLabel = false,
  className,
  autoFocus = false,
}: DraftFieldProps): ReactElement {
  const id = useId();
  const errorId = `${id}-error`;
  const draft = useDraft(value);
  const error = validate?.(draft.text) ?? null;
  const fieldRef = useRef<HTMLInputElement & HTMLTextAreaElement>(null);
  useReportValidity(id, error !== null);

  useEffect(() => {
    if (!autoFocus) return;
    fieldRef.current?.focus();
    fieldRef.current?.select();
    // Nur beim Erscheinen; ein späteres Rendern soll den Fokus nicht holen.
  }, []);

  const change = (text: string): void => {
    draft.setText(text);
    if ((validate?.(text) ?? null) !== null) return;
    const committed = normalize(text);
    draft.expect(committed);
    onCommit(committed);
  };

  // Ohne diese Verknüpfung läse ein Screenreader die Meldung neben dem Feld
  // beim Betreten nicht mit vor.
  const shared = {
    id,
    ref: fieldRef,
    value: draft.text,
    "aria-invalid": error !== null,
    "aria-describedby": error !== null ? errorId : undefined,
  };

  return (
    <div className={`man-pt-editor__field${className ? ` ${className}` : ""}`}>
      <label
        className={
          hideLabel ? "man-pt-editor__sr-only" : "man-pt-editor__label"
        }
        htmlFor={id}
      >
        {label}
      </label>
      {multiline ? (
        <textarea
          {...shared}
          className="man-pt-editor__textarea"
          onChange={(event) => change(event.target.value)}
        />
      ) : (
        <input
          {...shared}
          type={type}
          list={list}
          className="man-pt-editor__input"
          onChange={(event) => change(event.target.value)}
        />
      )}
      {error !== null && (
        <p id={errorId} className="man-pt-editor__error">
          {error}
        </p>
      )}
    </div>
  );
}
