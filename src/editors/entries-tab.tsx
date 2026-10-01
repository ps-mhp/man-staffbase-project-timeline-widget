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
 * Der Reiter „Einträge“: links die Liste, rechts das Formular des gewählten —
 * zwei Bereiche, die jeder für sich rollen, dazwischen ein Ziehgriff.
 *
 * Hier liegt, was Liste und Formular gemeinsam angeht — anlegen, duplizieren,
 * löschen samt der Auswahl und des Fokus danach.
 */

import * as React from "react";
import { CSSProperties, ReactElement, useId, useRef, useState } from "react";

import { Plan } from "../plan-model";
import { LIST, listSpace } from "./editor-layout";
import type { EntriesView } from "./entries-view";
import { ItemForm } from "./item-form";
import { FocusRequest, ItemList } from "./item-list";
import { Pane, PaneEmpty } from "./pane";
import { addItem, duplicateItem, removeItem } from "./plan-edits";
import { EDITOR_LOCALE, visibleItems } from "./plan-queries";
import { Splitter } from "./splitter";
import { useSplitSize } from "./use-split-size";

export interface EntriesTabProps {
  plan: Plan;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onPlanChange: (plan: Plan) => void;
  /** Das Datum neuer Einträge: die Mitte der Vorschau, sonst heute. */
  newDate: () => string;
  view: EntriesView;
  onViewChange: (patch: Partial<EntriesView>) => void;
}

export function EntriesTab({
  plan,
  selectedId,
  onSelect,
  onPlanChange,
  newDate,
  view,
  onViewChange,
}: EntriesTabProps): ReactElement {
  const entriesRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const listWidth = useSplitSize({
    storageKey: LIST.storageKey,
    fallback: () => LIST.fallback,
    min: LIST.min,
    reserve: LIST.reserve,
    observe: entriesRef,
    measure: () => listSpace(entriesRef.current),
  });
  const [focusRequest, setFocusRequest] = useState<FocusRequest | null>(null);
  // Der Eintrag, dessen Titel beim Erscheinen den Fokus bekommt: nur ein
  // gerade angelegter. Wer einen bestehenden wählt, will erst lesen.
  const [focusId, setFocusId] = useState<string | null>(null);
  if (focusId !== null && focusId !== selectedId) setFocusId(null);

  const selected = plan.items.find((item) => item.id === selectedId);

  // Nach dem Anlegen: „Allgemein“, Fokus im Titel. Die Suche weicht, sonst
  // stünde der neue Eintrag nicht in der Liste.
  const created = (next: Plan, id: string | null): void => {
    if (id === null) return;
    onPlanChange(next);
    onSelect(id);
    setFocusId(id);
    onViewChange({ formTab: "general", query: "" });
  };

  const remove = (id: string): void => {
    const order = visibleItems(plan, view.kind, view.query).map(
      (item) => item.id,
    );
    const index = order.indexOf(id);
    const neighbor =
      index === -1 ? null : (order[index + 1] ?? order[index - 1] ?? null);
    onPlanChange(removeItem(plan, id));
    if (selectedId === id) onSelect(neighbor);
    setFocusRequest({ id: neighbor });
  };

  return (
    // Die Breite als Variable, nicht als `width`: unter 900 px stehen Liste
    // und Formular untereinander, und dort soll das Stylesheet sie übergehen.
    <div
      ref={entriesRef}
      className="man-pt-editor__entries"
      style={{ "--pt-list-width": `${listWidth.size}px` } as CSSProperties}
    >
      <ItemList
        id={listId}
        plan={plan}
        selectedId={selectedId}
        locale={EDITOR_LOCALE}
        kind={view.kind}
        onKindChange={(kind) => onViewChange({ kind })}
        query={view.query}
        onQueryChange={(query) => onViewChange({ query })}
        onSelect={onSelect}
        onAdd={() => {
          const result = addItem(plan, view.kind, newDate());
          created(result.plan, result.id);
        }}
        onRemove={remove}
        focusRequest={focusRequest}
        onFocusDone={() => setFocusRequest(null)}
      />
      <Splitter
        orientation="vertical"
        label="Breite der Liste ändern"
        controls={listId}
        split={listWidth}
      />
      {selected === undefined ? (
        // Die leere zweite Zeile hält die Linien auf der Höhe der Liste.
        <Pane
          className="man-pt-editor__form"
          title="Kein Eintrag gewählt"
          toolbar={null}
        >
          <PaneEmpty>
            Links einen Eintrag wählen oder einen neuen anlegen.
          </PaneEmpty>
        </Pane>
      ) : (
        <ItemForm
          key={selected.id}
          plan={plan}
          item={selected}
          locale={EDITOR_LOCALE}
          onPlanChange={onPlanChange}
          onDuplicate={() => {
            const result = duplicateItem(plan, selected.id);
            created(result.plan, result.id);
          }}
          onRemove={() => remove(selected.id)}
          tab={view.formTab}
          onTabChange={(formTab) => onViewChange({ formTab })}
          autoFocusTitle={selected.id === focusId}
        />
      )}
    </div>
  );
}
