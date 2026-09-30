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
 * Die Liste der Einträge: anlegen, suchen, wählen.
 *
 * Nach Termin sortiert, nicht in der Reihenfolge des Attributs — so steht ein
 * Eintrag dort, wo die Redaktion ihn aus dem Zeitstrahl kennt.
 */

import * as React from "react";
import { ReactElement, Ref, useId, useState } from "react";

import { ItemKind, LIMITS, Plan } from "../plan-model";
import { KIND_LABELS, itemsByDate, laneLabel, matchesSearch, scheduleLabel } from "./plan-queries";

const KINDS: readonly ItemKind[] = ["milestone", "bar", "deadline"];

export interface ItemListProps {
  plan: Plan;
  selectedId: string | null;
  locale: string;
  onSelect: (id: string) => void;
  onAdd: (kind: ItemKind) => void;
  /** Das Suchfeld — dorthin geht der Fokus, wenn der gewählte Eintrag gelöscht wurde. */
  searchRef?: Ref<HTMLInputElement>;
}

function AddButtons({ plan, onAdd }: Pick<ItemListProps, "plan" | "onAdd">): ReactElement {
  const labelId = useId();
  const full = plan.items.length >= LIMITS.items;
  const needsLane = plan.lanes.length === 0;
  return (
    <div className="man-pt-editor__add" role="group" aria-labelledby={labelId}>
      <span id={labelId} className="man-pt-editor__label">
        Hinzufügen
      </span>
      <div className="man-pt-editor__actions">
        {KINDS.map((kind) => (
          <button
            key={kind}
            type="button"
            className="man-pt-editor__button"
            aria-label={`${KIND_LABELS[kind]} hinzufügen`}
            disabled={full || (kind !== "deadline" && needsLane)}
            onClick={() => onAdd(kind)}
          >
            {/* Der Abstand kommt aus `gap`: ein Leerzeichen am Ende des
                Spans fiele im Flex-Knopf weg. */}
            <span aria-hidden="true">+</span>
            {KIND_LABELS[kind]}
          </button>
        ))}
      </div>
      {full && <p className="man-pt-editor__hint">Mehr als {LIMITS.items} Einträge trägt ein Plan nicht.</p>}
      {!full && needsLane && (
        <p className="man-pt-editor__hint">
          Meilensteine und Zeiträume brauchen eine Ebene. Ebenen entstehen im Reiter „Ebenen“.
        </p>
      )}
    </div>
  );
}

export function ItemList({ plan, selectedId, locale, onSelect, onAdd, searchRef }: ItemListProps): ReactElement {
  const searchId = useId();
  const [query, setQuery] = useState("");
  const visible = itemsByDate(plan.items).filter((item) => matchesSearch(plan, item, query));

  return (
    <div className="man-pt-editor__items">
      <AddButtons plan={plan} onAdd={onAdd} />
      <div className="man-pt-editor__field">
        <label className="man-pt-editor__sr-only" htmlFor={searchId}>
          Einträge durchsuchen
        </label>
        <input
          ref={searchRef}
          id={searchId}
          type="search"
          className="man-pt-editor__input"
          placeholder="Einträge durchsuchen"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      {plan.items.length === 0 && <p className="man-pt-editor__hint">Noch keine Einträge.</p>}
      {plan.items.length > 0 && visible.length === 0 && (
        <p className="man-pt-editor__hint">Kein Eintrag passt zur Suche.</p>
      )}
      {visible.length > 0 && (
        <ul className="man-pt-editor__list" aria-label="Einträge">
          {visible.map((item) => {
            const selected = item.id === selectedId;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  className={`man-pt-editor__list-item${selected ? " man-pt-editor__list-item--active" : ""}`}
                  aria-current={selected ? "true" : undefined}
                  onClick={() => onSelect(item.id)}
                >
                  <span className="man-pt-editor__list-title">{item.title}</span>
                  <span className="man-pt-editor__meta">
                    {[KIND_LABELS[item.kind], laneLabel(plan, item), scheduleLabel(item, locale)].join(" · ")}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
