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
 * „Hängt ab von“: eine durchsuchbare Liste von Kontrollkästchen.
 *
 * Ein Plan trägt bis zu 300 Einträge; eine Mehrfachauswahl per `<select
 * multiple>` wäre dafür mit Strg-Klicks kaum zu bedienen und verlöre bei
 * einem Fehlklick die ganze Auswahl. Kästchen behalten jede Wahl einzeln.
 */

import * as React from "react";
import { ReactElement, useId, useState } from "react";

import { LaneItem, Plan } from "../plan-model";
import { dependencyCandidates, matchesSearch, scheduleLabel } from "./plan-queries";

export interface DependencyFieldProps {
  plan: Plan;
  item: LaneItem;
  locale: string;
  onChange: (ids: string[]) => void;
}

export function DependencyField({ plan, item, locale, onChange }: DependencyFieldProps): ReactElement {
  const searchId = useId();
  const [query, setQuery] = useState("");
  const candidates = dependencyCandidates(plan, item.id);
  const selected = item.dependsOn ?? [];
  const visible = candidates.filter((candidate) => matchesSearch(plan, candidate, query));

  const toggle = (id: string, checked: boolean): void => {
    onChange(checked ? [...selected, id] : selected.filter((entry) => entry !== id));
  };

  return (
    <fieldset className="man-pt-editor__deps">
      <legend className="man-pt-editor__label">Hängt ab von</legend>
      {candidates.length === 0 ? (
        <p className="man-pt-editor__hint">Es gibt noch keine anderen Meilensteine oder Zeiträume.</p>
      ) : (
        <>
          <label className="man-pt-editor__sr-only" htmlFor={searchId}>
            Vorgänger suchen
          </label>
          <input
            id={searchId}
            type="search"
            className="man-pt-editor__input"
            placeholder="Vorgänger suchen"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          {visible.length === 0 ? (
            <p className="man-pt-editor__hint">Kein Eintrag passt zur Suche.</p>
          ) : (
            <ul className="man-pt-editor__checklist">
              {visible.map((candidate) => (
                <li key={candidate.id}>
                  <label className="man-pt-editor__check">
                    <input
                      type="checkbox"
                      checked={selected.includes(candidate.id)}
                      onChange={(event) => toggle(candidate.id, event.target.checked)}
                    />
                    <span className="man-pt-editor__check-title">{candidate.title}</span>
                    <span className="man-pt-editor__meta">{scheduleLabel(candidate, locale)}</span>
                  </label>
                </li>
              ))}
            </ul>
          )}
          <p className="man-pt-editor__hint" aria-live="polite">
            {selected.length} gewählt
          </p>
        </>
      )}
    </fieldset>
  );
}
