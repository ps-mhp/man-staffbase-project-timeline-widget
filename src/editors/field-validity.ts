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
 * Welche Gruppe von Feldern gerade eine ungültige Eingabe hält.
 *
 * Der Entwurf eines Feldes lebt im Feld selbst (`DraftField`); das Formular
 * erfährt sonst nicht, dass in einem verborgenen Reiter ein Datum fehlt. Die
 * Felder melden ihren Zustand deshalb über diesen Kontext nach oben, und der
 * Reiter zeigt einen Marker — sonst läge der Fehler unsichtbar hinter einem
 * anderen Reiter, und die Redaktion wunderte sich, warum eine Änderung nicht
 * ankommt.
 */

import { createContext, useContext, useEffect, useMemo, useState } from "react";

/** Meldet, ob das Feld `fieldId` gerade ungültig ist. */
export type ReportValidity = (fieldId: string, invalid: boolean) => void;

export const FieldValidityContext = createContext<ReportValidity | null>(null);

/** Für ein Feld: meldet seinen Zustand, und beim Verschwinden „gültig“. */
export function useReportValidity(fieldId: string, invalid: boolean): void {
  const report = useContext(FieldValidityContext);
  useEffect(() => {
    report?.(fieldId, invalid);
  }, [report, fieldId, invalid]);
  useEffect(() => () => report?.(fieldId, false), [report, fieldId]);
}

export interface GroupValidity<G extends string> {
  /** Die Gruppen mit mindestens einem ungültigen Feld. */
  invalid: ReadonlySet<G>;
  /** Je Gruppe die Meldestelle für ihre Felder. */
  reporters: Readonly<Record<G, ReportValidity>>;
}

/** Für ein Formular mit Gruppen: sammelt die Meldungen je Gruppe. */
export function useGroupValidity<G extends string>(
  groups: readonly G[],
): GroupValidity<G> {
  const [keys, setKeys] = useState<ReadonlySet<string>>(() => new Set());

  // Beständig, sonst meldeten alle Felder bei jedem Rendern neu.
  const reporters = useMemo(() => {
    const entries = groups.map((group) => {
      const report: ReportValidity = (fieldId, invalid) =>
        setKeys((previous) => {
          const key = `${group}|${fieldId}`;
          if (previous.has(key) === invalid) return previous;
          const next = new Set(previous);
          if (invalid) next.add(key);
          else next.delete(key);
          return next;
        });
      return [group, report] as const;
    });
    return Object.fromEntries(entries) as Record<G, ReportValidity>;
    // Die Gruppen sind je Formular fest; neu gebaut würden die Meldestellen
    // nur, damit alle Felder ihren Zustand noch einmal melden.
  }, []);

  const invalid = new Set(
    groups.filter((group) =>
      [...keys].some((key) => key.startsWith(`${group}|`)),
    ),
  );
  return { invalid, reporters };
}
