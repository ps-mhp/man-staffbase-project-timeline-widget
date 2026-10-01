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
 * Das Formular des gewählten Eintrags. Im festen Kopf stehen Titel, Art und
 * die Handlungen, darunter die Unterreiter Allgemein · Einordnung · Termin ·
 * Abhängigkeiten; nur ihr Inhalt rollt.
 *
 * Alle Unterreiter bleiben gemountet und nur verborgen: sonst gingen beim
 * Wechsel Entwürfe und Feldfehler verloren. Hält ein Reiter eine ungültige
 * Eingabe, zeigt er einen Marker — der Fehler läge sonst unsichtbar hinter
 * einem anderen Reiter.
 */

import * as React from "react";
import { ReactElement, useEffect, useId, useState } from "react";

import { LIMITS, Plan, PlanItem, isLaneItem } from "../plan-model";
import { DeleteConfirm } from "./delete-confirm";
import { DependencyField } from "./dependency-field";
import { TabList, TabPanel } from "./editor-tabs";
import { FieldValidityContext, useGroupValidity } from "./field-validity";
import { GeneralFields, PlacementFields, TermFields } from "./item-form-panels";
import { updateItem, withOptional } from "./plan-edits";
import { Pane } from "./pane";
import { KIND_LABELS, countDependents } from "./plan-queries";

export type FormTab = "general" | "placement" | "term" | "dependencies";

const FORM_TABS: readonly FormTab[] = [
  "general",
  "placement",
  "term",
  "dependencies",
];

const FORM_TAB_LABELS: Readonly<Record<FormTab, string>> = {
  general: "Allgemein",
  placement: "Einordnung",
  term: "Termin",
  dependencies: "Abhängigkeiten",
};

export interface ItemFormProps {
  plan: Plan;
  item: PlanItem;
  locale: string;
  onPlanChange: (plan: Plan) => void;
  onDuplicate: () => void;
  /** Nach der Rückfrage: der Eintrag soll weg. */
  onRemove: () => void;
  /** Der Unterreiter; er bleibt beim Wechsel zu einem anderen Eintrag. */
  tab: FormTab;
  onTabChange: (tab: FormTab) => void;
  /** Setzt den Fokus in den Titel — nach dem Anlegen will man ihn als Erstes ändern. */
  autoFocusTitle?: boolean;
}

export function ItemForm({
  plan,
  item,
  locale,
  onPlanChange,
  onDuplicate,
  onRemove,
  tab,
  onTabChange,
  autoFocusTitle = false,
}: ItemFormProps): ReactElement {
  const base = useId();
  const [confirming, setConfirming] = useState(false);
  const validity = useGroupValidity(FORM_TABS);
  // Stichtage haben keine Vorgänger und deshalb keinen Reiter dafür.
  const available = FORM_TABS.filter(
    (entry) => entry !== "dependencies" || isLaneItem(item),
  );
  const active = available.includes(tab) ? tab : "general";
  useEffect(() => {
    if (active !== tab) onTabChange(active);
  }, [active, tab, onTabChange]);

  const predecessors = item.dependsOn?.length ?? 0;
  const tabs = available.map((id) => ({
    id,
    label:
      id === "dependencies" && predecessors > 0
        ? `${FORM_TAB_LABELS[id]} (${predecessors})`
        : FORM_TAB_LABELS[id],
    invalid: validity.invalid.has(id),
  }));

  const actions = (
    <>
      <button
        type="button"
        className="man-pt-editor__button"
        disabled={plan.items.length >= LIMITS.items}
        onClick={onDuplicate}
      >
        Duplizieren
      </button>
      <div className="man-pt-editor__anchor">
        <button
          type="button"
          className="man-pt-editor__button man-pt-editor__button--danger"
          aria-haspopup="dialog"
          aria-expanded={confirming}
          onClick={() => setConfirming(!confirming)}
        >
          Löschen
        </button>
        {confirming && (
          <DeleteConfirm
            title={item.title}
            dependents={countDependents(plan, item.id)}
            onConfirm={onRemove}
            onCancel={() => setConfirming(false)}
          />
        )}
      </div>
    </>
  );

  const panel = (id: FormTab, content: ReactElement): ReactElement => (
    <TabPanel
      key={id}
      base={base}
      tab={id}
      active={active === id}
      className="man-pt-editor__form-panel"
    >
      <FieldValidityContext.Provider value={validity.reporters[id]}>
        {content}
      </FieldValidityContext.Provider>
    </TabPanel>
  );

  const shared = { plan, item, onPlanChange };
  return (
    // Kein `<form>`: Enter in einem Feld löste sonst ein Absenden aus, das
    // hier niemand erwartet — gespeichert wird nur über „Übernehmen“.
    <Pane
      label={`Eintrag „${item.title}“`}
      className="man-pt-editor__form"
      title={item.title}
      hint={KIND_LABELS[item.kind]}
      actions={actions}
      toolbar={
        <TabList
          base={base}
          tabs={tabs}
          active={active}
          onChange={onTabChange}
          label="Felder des Eintrags"
          variant="sub"
          allPanels
        />
      }
    >
      {panel(
        "general",
        <GeneralFields {...shared} autoFocusTitle={autoFocusTitle} />,
      )}
      {panel("placement", <PlacementFields {...shared} />)}
      {panel("term", <TermFields {...shared} />)}
      {isLaneItem(item) &&
        panel(
          "dependencies",
          <DependencyField
            plan={plan}
            item={item}
            locale={locale}
            onChange={(ids) =>
              onPlanChange(
                updateItem(
                  plan,
                  withOptional(
                    item,
                    "dependsOn",
                    ids.length > 0 ? ids : undefined,
                  ),
                ),
              )
            }
          />,
        )}
    </Pane>
  );
}
