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
 * Das Formular des gewählten Eintrags.
 *
 * Jede gültige Eingabe landet sofort im Plan, damit die Vorschau darüber
 * mitgeht. Ungültiges bleibt im Feld stehen (`DraftField`); der Plan behält
 * dann den letzten gültigen Wert.
 */

import * as React from "react";
import { ReactElement, ReactNode, useId } from "react";

import { ItemKind, LIMITS, Plan, PlanItem, isLaneItem } from "../plan-model";
import { DependencyField } from "./dependency-field";
import { DraftField, requireText } from "./draft-field";
import { changeKind, updateItem, withOptional } from "./plan-edits";
import { KIND_LABELS, seriesInLane } from "./plan-queries";
import { ScheduleFields } from "./schedule-fields";

const KINDS: readonly ItemKind[] = ["milestone", "bar", "deadline"];

export interface ItemFormProps {
  plan: Plan;
  item: PlanItem;
  locale: string;
  onPlanChange: (plan: Plan) => void;
  onDuplicate: () => void;
  onRemove: () => void;
  /** Setzt den Fokus in den Titel — nach dem Anlegen will man ihn als Erstes ändern. */
  autoFocusTitle?: boolean;
}

function SelectField({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}): ReactElement {
  const id = useId();
  return (
    <div className="man-pt-editor__field">
      <label className="man-pt-editor__label" htmlFor={id}>
        {label}
      </label>
      <select id={id} className="man-pt-editor__select" value={value} onChange={(event) => onChange(event.target.value)}>
        {children}
      </select>
    </div>
  );
}

export function ItemForm({
  plan,
  item,
  locale,
  onPlanChange,
  onDuplicate,
  onRemove,
  autoFocusTitle = false,
}: ItemFormProps): ReactElement {
  const update = (next: PlanItem): void => onPlanChange(updateItem(plan, next));
  const needsLane = plan.lanes.length === 0;

  return (
    // Kein `<form>`: Enter in einem Feld löste sonst ein Absenden aus, das
    // hier niemand erwartet — gespeichert wird nur über „Übernehmen“.
    <section className="man-pt-editor__form" aria-label={`Eintrag „${item.title}“`}>
      <SelectField
        label="Art"
        value={item.kind}
        onChange={(kind) => onPlanChange(changeKind(plan, item.id, kind as ItemKind))}
      >
        {KINDS.map((kind) => (
          // Ohne Ebene kann ein Stichtag weder Meilenstein noch Zeitraum werden:
          // beide brauchen eine Ebene, in der sie stehen.
          <option key={kind} value={kind} disabled={kind !== "deadline" && needsLane}>
            {KIND_LABELS[kind]}
          </option>
        ))}
      </SelectField>

      <DraftField
        label="Titel"
        value={item.title}
        validate={requireText("Bitte einen Titel angeben.")}
        onCommit={(title) => update({ ...item, title })}
        autoFocus={autoFocusTitle}
      />
      <DraftField
        label="Beschreibung"
        value={item.description ?? ""}
        multiline
        // Nur Leerraum ist keine Beschreibung; das Lesen verwürfe sie ohnehin.
        normalize={(text) => (text.trim() === "" ? "" : text)}
        onCommit={(text) => update(withOptional(item, "description", text === "" ? undefined : text))}
      />

      <div className="man-pt-editor__row">
        {isLaneItem(item) && (
          <SelectField label="Ebene" value={item.lane} onChange={(lane) => update({ ...item, lane })}>
            {plan.lanes.map((lane) => (
              <option key={lane.id} value={lane.id}>
                {lane.title}
              </option>
            ))}
          </SelectField>
        )}
        <SelectField
          label="Kategorie"
          value={item.category ?? ""}
          onChange={(category) => update(withOptional(item, "category", category === "" ? undefined : category))}
        >
          <option value="">Ohne Kategorie</option>
          {plan.categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.title}
            </option>
          ))}
        </SelectField>
      </div>

      <ScheduleFields
        item={item}
        seriesSuggestions={isLaneItem(item) ? seriesInLane(plan, item.lane) : []}
        onChange={update}
      />

      <label className="man-pt-editor__check">
        <input
          type="checkbox"
          checked={item.tentative === true}
          onChange={(event) => update(withOptional(item, "tentative", event.target.checked ? true : undefined))}
        />
        Vorläufig
      </label>

      {isLaneItem(item) && (
        <DependencyField
          plan={plan}
          item={item}
          locale={locale}
          onChange={(ids) => update(withOptional(item, "dependsOn", ids.length > 0 ? ids : undefined))}
        />
      )}

      <div className="man-pt-editor__actions">
        <button
          type="button"
          className="man-pt-editor__button"
          disabled={plan.items.length >= LIMITS.items}
          onClick={onDuplicate}
        >
          Duplizieren
        </button>
        <button type="button" className="man-pt-editor__button man-pt-editor__button--danger" onClick={onRemove}>
          Löschen
        </button>
      </div>
    </section>
  );
}
