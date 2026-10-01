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
 * Die Inhalte der Unterreiter im Formular eines Eintrags: Allgemein,
 * Einordnung, Termin. Jede gültige Eingabe landet sofort im Plan, damit die
 * Vorschau mitgeht; Ungültiges bleibt im Feld stehen (`DraftField`), und der
 * Plan behält den letzten gültigen Wert.
 */

import * as React from "react";
import { ReactElement, ReactNode, useId } from "react";

import {
  ItemKind,
  LIMITS,
  Plan,
  PlanItem,
  categoryOf,
  colorOf,
  isLaneItem,
} from "../plan-model";
import { SymbolGlyph } from "../symbol-glyph";
import { DEFAULT_SYMBOL, SYMBOL_LABELS, symbolOf } from "../symbols";
import { DraftField, requireText } from "./draft-field";
import { EntitySelect } from "./entity-select";
import { changeKind, updateItem, withOptional } from "./plan-edits";
import { KIND_LABELS } from "./plan-queries";
import { ScheduleFields } from "./schedule-fields";
import { SeriesField } from "./series-field";
import {
  createCategory,
  createLane,
  nextFreeColor,
  nextFreeSymbol,
} from "./plan-structure-edits";

const KINDS: readonly ItemKind[] = ["milestone", "bar", "deadline"];

export interface PanelProps {
  plan: Plan;
  item: PlanItem;
  onPlanChange: (plan: Plan) => void;
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
      <select
        id={id}
        className="man-pt-editor__select"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {children}
      </select>
    </div>
  );
}

export function GeneralFields({
  plan,
  item,
  onPlanChange,
  autoFocusTitle,
}: PanelProps & { autoFocusTitle: boolean }): ReactElement {
  const update = (next: PlanItem): void => onPlanChange(updateItem(plan, next));
  const needsLane = plan.lanes.length === 0;
  return (
    <>
      <SelectField
        label="Art"
        value={item.kind}
        onChange={(kind) =>
          onPlanChange(changeKind(plan, item.id, kind as ItemKind))
        }
      >
        {KINDS.map((kind) => (
          // Ohne Ebene kann ein Stichtag weder Meilenstein noch Zeitraum
          // werden: beide brauchen eine Ebene, in der sie stehen.
          <option
            key={kind}
            value={kind}
            disabled={kind !== "deadline" && needsLane}
          >
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
        onCommit={(text) =>
          update(
            withOptional(item, "description", text === "" ? undefined : text),
          )
        }
      />
    </>
  );
}

/**
 * Wie der Eintrag im Zeitstrahl aussieht und woher das kommt: Form und Farbe
 * gehören der Kategorie, nicht dem Eintrag. Das Feld „Symbol“ am Meilenstein
 * gibt es nicht mehr; ohne diesen Hinweis suchte man es vergeblich.
 */
function CategoryLook({
  plan,
  item,
}: Pick<PanelProps, "plan" | "item">): ReactElement {
  const hasCategory = categoryOf(plan, item) !== undefined;
  const color = colorOf(plan, item);
  const symbol = symbolOf(plan, item);
  const milestone = item.kind === "milestone";
  let text: string;
  if (hasCategory)
    text = milestone
      ? "Form und Farbe kommen von der Kategorie."
      : "Die Farbe kommt von der Kategorie.";
  else if (!milestone) text = "Ohne Kategorie: grau.";
  else if (symbol === DEFAULT_SYMBOL) text = "Ohne Kategorie: graue Raute.";
  else text = `Ohne Kategorie: grau, Form „${SYMBOL_LABELS[symbol]}“.`;
  return (
    <p className="man-pt-editor__hint man-pt-editor__look">
      {milestone ? (
        <SymbolGlyph symbol={symbol} color={color} size={12} />
      ) : (
        <span
          className="man-pt-editor__look-chip"
          style={{ backgroundColor: color }}
          aria-hidden="true"
        />
      )}
      {text}
    </p>
  );
}

export function PlacementFields({
  plan,
  item,
  onPlanChange,
}: PanelProps): ReactElement {
  const update = (next: PlanItem): void => onPlanChange(updateItem(plan, next));
  const setCategory = (category: string): void =>
    update(
      withOptional(item, "category", category === "" ? undefined : category),
    );

  return (
    <>
      <div className="man-pt-editor__row">
        {isLaneItem(item) && (
          <EntitySelect
            label="Ebene"
            noun="Ebene"
            value={item.lane}
            entities={plan.lanes}
            canCreate={plan.lanes.length < LIMITS.lanes}
            onChange={(lane) => update({ ...item, lane })}
            onCreate={({ title }) => {
              const created = createLane(plan, title);
              if (created.id === null) return;
              onPlanChange(
                updateItem(created.plan, { ...item, lane: created.id }),
              );
            }}
          />
        )}
        <EntitySelect
          label="Kategorie"
          noun="Kategorie"
          value={item.category ?? ""}
          leading={<option value="">Ohne Kategorie</option>}
          entities={plan.categories}
          canCreate={plan.categories.length < LIMITS.categories}
          initialColor={nextFreeColor(plan)}
          initialSymbol={nextFreeSymbol(plan)}
          onChange={setCategory}
          onCreate={({ title, color, symbol }) => {
            const created = createCategory(plan, {
              title,
              color: color ?? nextFreeColor(plan),
              symbol: symbol ?? nextFreeSymbol(plan),
            });
            if (created.id === null) return;
            onPlanChange(
              updateItem(created.plan, { ...item, category: created.id }),
            );
          }}
        />
      </div>
      <CategoryLook plan={plan} item={item} />
      {isLaneItem(item) && (
        <SeriesField plan={plan} item={item} onChange={update} />
      )}
    </>
  );
}

export function TermFields({
  plan,
  item,
  onPlanChange,
}: PanelProps): ReactElement {
  const update = (next: PlanItem): void => onPlanChange(updateItem(plan, next));
  return (
    <>
      <ScheduleFields item={item} onChange={update} />
      <label className="man-pt-editor__check">
        <input
          type="checkbox"
          checked={item.tentative === true}
          onChange={(event) =>
            update(
              withOptional(
                item,
                "tentative",
                event.target.checked ? true : undefined,
              ),
            )
          }
        />
        Vorläufig
      </label>
    </>
  );
}
