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
 * Der Reiter „Einträge“: links die Liste, rechts das Formular des gewählten.
 *
 * Hier liegt, was Liste und Formular gemeinsam angeht — anlegen, duplizieren,
 * löschen samt der Auswahl und des Fokus danach.
 */

import * as React from "react";
import { ReactElement, useRef, useState } from "react";

import { ItemKind, Plan } from "../plan-model";
import { ItemForm } from "./item-form";
import { ItemList } from "./item-list";
import { addItem, duplicateItem, removeItem } from "./plan-edits";
import { EDITOR_LOCALE } from "./plan-queries";

export interface EntriesTabProps {
  plan: Plan;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onPlanChange: (plan: Plan) => void;
  /** Das Datum neuer Einträge: die Mitte der Vorschau, sonst heute. */
  newDate: () => string;
}

export function EntriesTab({ plan, selectedId, onSelect, onPlanChange, newDate }: EntriesTabProps): ReactElement {
  const searchRef = useRef<HTMLInputElement>(null);
  // Der Eintrag, dessen Titel beim Erscheinen den Fokus bekommt: nur ein
  // gerade angelegter. Wer einen bestehenden wählt, will erst lesen.
  const [focusId, setFocusId] = useState<string | null>(null);
  if (focusId !== null && focusId !== selectedId) setFocusId(null);

  const selected = plan.items.find((item) => item.id === selectedId);

  const created = (next: Plan, id: string | null): void => {
    if (id === null) return;
    onPlanChange(next);
    onSelect(id);
    setFocusId(id);
  };

  const add = (kind: ItemKind): void => {
    const result = addItem(plan, kind, newDate());
    created(result.plan, result.id);
  };

  const duplicate = (id: string): void => {
    const result = duplicateItem(plan, id);
    created(result.plan, result.id);
  };

  const remove = (id: string): void => {
    // Das Formular verschwindet mit dem Eintrag, und mit ihm der Fokus. Die
    // Suche ist der nächste sinnvolle Halt: von dort geht es in die Liste.
    searchRef.current?.focus();
    onPlanChange(removeItem(plan, id));
    onSelect(null);
  };

  return (
    <div className="man-pt-editor__entries">
      <ItemList
        plan={plan}
        selectedId={selectedId}
        locale={EDITOR_LOCALE}
        onSelect={onSelect}
        onAdd={add}
        searchRef={searchRef}
      />
      <div className="man-pt-editor__detail">
        {selected === undefined ? (
          <p className="man-pt-editor__hint">Links einen Eintrag wählen oder einen neuen anlegen.</p>
        ) : (
          <ItemForm
            key={selected.id}
            plan={plan}
            item={selected}
            locale={EDITOR_LOCALE}
            onPlanChange={onPlanChange}
            onDuplicate={() => duplicate(selected.id)}
            onRemove={() => remove(selected.id)}
            autoFocusTitle={selected.id === focusId}
          />
        )}
      </div>
    </div>
  );
}
