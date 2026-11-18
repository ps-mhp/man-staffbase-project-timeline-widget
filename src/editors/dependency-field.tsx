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
import { ReactElement, useState } from "react";

import { Checkbox } from "@man/config-ui/primitives/checkbox";
import { SearchField } from "@man/config-ui/form/search-field";

import { LaneItem, Plan } from "../plan-model";
import { dependencyCandidates, matchesSearch, scheduleLabel } from "./plan-queries";

export interface DependencyFieldProps {
  plan: Plan;
  item: LaneItem;
  locale: string;
  onChange: (ids: string[]) => void;
}

export function DependencyField({ plan, item, locale, onChange }: DependencyFieldProps): ReactElement {
  const [query, setQuery] = useState("");
  const candidates = dependencyCandidates(plan, item.id);
  const selected = item.dependsOn ?? [];
  const visible = candidates.filter((candidate) => matchesSearch(plan, candidate, query));

  const toggle = (id: string, checked: boolean): void => {
    onChange(checked ? [...selected, id] : selected.filter((entry) => entry !== id));
  };

  return (
    <fieldset className="flex min-w-0 flex-col gap-3">
      <legend className="mb-1.5 text-[13px] font-semibold text-foreground">Hängt ab von</legend>
      {candidates.length === 0 ? (
        <p className="text-[13px] text-muted-foreground">Es gibt noch keine anderen Meilensteine oder Zeiträume.</p>
      ) : (
        <>
          <SearchField aria-label="Vorgänger suchen" placeholder="Vorgänger suchen" value={query} onValueChange={setQuery} />
          {visible.length === 0 ? (
            <p className="text-[13px] text-muted-foreground">Kein Eintrag passt zur Suche.</p>
          ) : (
            <ul className="flex max-h-[360px] flex-col gap-0.5 overflow-auto rounded-md border p-1">
              {visible.map((candidate) => (
                <li key={candidate.id}>
                  <label className="flex min-h-10 cursor-pointer items-center gap-3 rounded-md px-2 hover:bg-muted">
                    <Checkbox
                      checked={selected.includes(candidate.id)}
                      onCheckedChange={(checked) => toggle(candidate.id, checked === true)}
                    />
                    <span className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">{candidate.title}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">{scheduleLabel(candidate, locale)}</span>
                  </label>
                </li>
              ))}
            </ul>
          )}
          <p className="text-[13px] text-muted-foreground" aria-live="polite">
            {selected.length} gewählt
          </p>
        </>
      )}
    </fieldset>
  );
}
