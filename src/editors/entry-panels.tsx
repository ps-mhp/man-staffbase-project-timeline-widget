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
 * Die Inhalte der Reiter im Formular eines Eintrags: Allgemein, Einordnung,
 * Termin. Jede gültige Eingabe landet sofort im Plan, damit die Vorschau
 * mitgeht; Ungültiges bleibt im Feld stehen (`DraftField`), und der Plan
 * behält den letzten gültigen Wert.
 */

import * as React from "react";
import { ReactElement } from "react";

import { SegmentedField } from "@man/config-ui/form/segmented-field";
import { SwitchRow } from "@man/config-ui/form/switch-row";

import { ItemKind, LIMITS, Plan, PlanItem, categoryOf, colorOf, isLaneItem } from "../plan-model";
import { SymbolGlyph } from "../symbol-glyph";
import { DEFAULT_SYMBOL, SYMBOL_LABELS, symbolOf } from "../symbols";
import { DraftField, requireText } from "./draft-field";
import { EntitySelect } from "./entity-select";
import { changeKind, updateItem, withOptional } from "./plan-edits";
import { KIND_LABELS } from "./plan-queries";
import { ScheduleFields } from "./schedule-fields";
import { SeriesField } from "./series-field";
import { createCategory, createLane, nextFreeColor, nextFreeSymbol } from "./plan-structure-edits";

const KINDS: readonly ItemKind[] = ["milestone", "bar", "deadline"];

export interface PanelProps {
  plan: Plan;
  item: PlanItem;
  onPlanChange: (plan: Plan) => void;
}

export function GeneralFields({
  plan,
  item,
  onPlanChange,
  autoFocusTitle,
}: PanelProps & { autoFocusTitle: boolean }): ReactElement {
  const update = (next: PlanItem): void => onPlanChange(updateItem(plan, next));
  // Ohne Ebene kann ein Stichtag weder Meilenstein noch Zeitraum werden: beide
  // brauchen eine Ebene, in der sie stehen. Der Wechsel tut dann nichts, und
  // der Hinweis sagt, warum.
  const needsLane = plan.lanes.length === 0;
  return (
    <>
      <SegmentedField
        label="Art"
        options={KINDS.map((kind) => ({ id: kind, label: KIND_LABELS[kind] }))}
        value={item.kind}
        onChange={(kind) => onPlanChange(changeKind(plan, item.id, kind))}
        hint={
          needsLane && item.kind === "deadline"
            ? "Meilensteine und Zeiträume brauchen eine Ebene. Ebenen entstehen rechts im Reiter „Ebenen“."
            : undefined
        }
      />
      <DraftField
        label="Titel"
        required
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
      <SwitchRow
        label="Vorläufig"
        hint="Erscheint im Plan als noch nicht bestätigt, bis der Termin feststeht."
        checked={item.tentative === true}
        onCheckedChange={(checked) => update(withOptional(item, "tentative", checked ? true : undefined))}
        className="max-w-[520px]"
      />
    </>
  );
}

/**
 * Wie der Eintrag im Zeitstrahl aussieht und woher das kommt: Form und Farbe
 * gehören der Kategorie, nicht dem Eintrag. Das Feld „Symbol“ am Meilenstein
 * gibt es nicht mehr; ohne diesen Hinweis suchte man es vergeblich.
 */
function CategoryLook({ plan, item }: Pick<PanelProps, "plan" | "item">): ReactElement {
  const hasCategory = categoryOf(plan, item) !== undefined;
  const color = colorOf(plan, item);
  const symbol = symbolOf(plan, item);
  const milestone = item.kind === "milestone";
  let text: string;
  if (hasCategory) text = milestone ? "Form und Farbe kommen von der Kategorie." : "Die Farbe kommt von der Kategorie.";
  else if (!milestone) text = "Ohne Kategorie: grau.";
  else if (symbol === DEFAULT_SYMBOL) text = "Ohne Kategorie: graue Raute.";
  else text = `Ohne Kategorie: grau, Form „${SYMBOL_LABELS[symbol]}“.`;
  return (
    <p className="flex items-center gap-2 text-[13px] text-muted-foreground">
      {milestone ? (
        <SymbolGlyph symbol={symbol} color={color} size={12} />
      ) : (
        <span aria-hidden="true" className="inline-block h-2.5 w-4 rounded-sm" style={{ backgroundColor: color }} />
      )}
      {text}
    </p>
  );
}

export function PlacementFields({ plan, item, onPlanChange }: PanelProps): ReactElement {
  const update = (next: PlanItem): void => onPlanChange(updateItem(plan, next));
  const setCategory = (category: string): void =>
    update(withOptional(item, "category", category === "" ? undefined : category));

  return (
    <>
      <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
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
              onPlanChange(updateItem(created.plan, { ...item, lane: created.id }));
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
            onPlanChange(updateItem(created.plan, { ...item, category: created.id }));
          }}
        />
      </div>
      <CategoryLook plan={plan} item={item} />
      {isLaneItem(item) && <SeriesField plan={plan} item={item} onChange={update} />}
    </>
  );
}

export function TermFields({ plan, item, onPlanChange }: PanelProps): ReactElement {
  const update = (next: PlanItem): void => onPlanChange(updateItem(plan, next));
  return <ScheduleFields item={item} onChange={update} />;
}
