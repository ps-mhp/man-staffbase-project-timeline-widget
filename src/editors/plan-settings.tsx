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
 * Die Einstellungen des Plans im Panel rechts: Überschrift, Startansicht,
 * Heute-Linie und Excel-Export.
 *
 * Heute-Linie und Export liegen im Plan (`plan.showToday`, `plan.allowExport`).
 * Solange dort nichts steht und das alte Feld des Studio-Dialogs nicht lesbar
 * war, gilt für den Block weiter, was er bisher zeigt — der Schalter sagt das,
 * statt eine Vorgabe vorzutäuschen. Erst das Umlegen schreibt den Wert.
 */

import * as React from "react";
import { ReactElement } from "react";

import { FormSection } from "@man/config-ui/form/form-section";
import { SwitchRow } from "@man/config-ui/form/switch-row";
import { Button } from "@man/config-ui/primitives/button";

import { Viewport, firstDayOfMonth, parseIsoMonth } from "../calendar";
import { formatMonthYear } from "../format";
import { Plan, PlanView } from "../plan-model";
import { DraftField } from "./draft-field";
import { PlanEditorValue, effectiveFlags } from "../plan-editor-rules";
import { setTitle } from "./plan-edits";
import { EDITOR_LOCALE } from "./plan-queries";
import { clearStartView, setDisplayFlag, setStartView } from "./plan-structure-edits";

export interface PlanSettingsProps {
  value: PlanEditorValue;
  /** Der zuletzt von der Vorschau gemeldete Ausschnitt; `null`, solange sie nicht zu sehen war. */
  viewport: Viewport | null;
  onPlanChange: (plan: Plan) => void;
}

const monthLabel = (month: string): string => {
  const parsed = parseIsoMonth(month);
  return parsed === null ? month : formatMonthYear(firstDayOfMonth(parsed), EDITOR_LOCALE);
};

function describeView(view: PlanView | undefined): string {
  if (view === undefined) return "Ohne Startansicht zeigt das Widget beim Laden den ganzen Plan.";
  return `Startansicht: ${monthLabel(view.start)} bis ${monthLabel(view.end)}`;
}

const NOT_SET = "Noch nicht im Editor festgelegt: der Block behält seine bisherige Einstellung, bis der Schalter bedient wird.";

export function PlanSettings({ value, viewport, onPlanChange }: PlanSettingsProps): ReactElement {
  const { plan, legacy } = value;
  const flags = effectiveFlags(value);
  const todayUnset = plan.showToday === undefined && legacy?.showToday === undefined;
  const exportUnset = plan.allowExport === undefined && legacy?.allowExport === undefined;

  return (
    <div className="flex flex-col gap-5">
      {/* Die Überschrift steht im Plan, nicht in einem eigenen Attribut —
          siehe `Plan.title`. Leer steht über dem Plan keine. */}
      <DraftField
        label="Titel des Plans"
        value={plan.title ?? ""}
        normalize={(text) => text.trim()}
        onCommit={(title) => onPlanChange(setTitle(plan, title))}
        hint="Steht über dem Plan und gibt der Excel-Datei ihren Namen."
      />
      <SwitchRow
        label="Heute-Linie zeigen"
        hint={
          todayUnset
            ? `Eine senkrechte Linie markiert den heutigen Tag. ${NOT_SET}`
            : "Eine senkrechte Linie markiert den heutigen Tag, sofern er im sichtbaren Zeitraum liegt."
        }
        checked={flags.showToday}
        onCheckedChange={(checked) => onPlanChange(setDisplayFlag(plan, "showToday", checked))}
      />
      <SwitchRow
        label="Excel-Export anbieten"
        hint={
          exportUnset
            ? `Leser:innen laden die Einträge als Excel-Tabelle herunter. ${NOT_SET}`
            : "Leser:innen laden die Einträge als Excel-Tabelle herunter — die Ansicht oder den ganzen Plan."
        }
        checked={flags.allowExport}
        onCheckedChange={(checked) => onPlanChange(setDisplayFlag(plan, "allowExport", checked))}
      />
      <FormSection title="Startansicht" description={describeView(plan.view)}>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={viewport === null}
            onClick={() => viewport !== null && onPlanChange(setStartView(plan, viewport))}
          >
            Diesen Ausschnitt übernehmen
          </Button>
          {plan.view !== undefined && (
            <Button type="button" variant="outline" size="sm" onClick={() => onPlanChange(clearStartView(plan))}>
              Startansicht entfernen
            </Button>
          )}
        </div>
        {viewport === null && (
          <p className="text-[13px] text-muted-foreground">
            Der Ausschnitt kommt aus der Vorschau: in Desktop, Tablet oder Mobil zoomen und verschieben, dann hier
            übernehmen.
          </p>
        )}
      </FormSection>
    </div>
  );
}
