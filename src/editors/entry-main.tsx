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
 * Die Hauptfläche im Editor: Kopf mit „Eintrag 4 von 12“, Art und Aktionen,
 * darunter die fünf Reiter des Formulars auf Lesebreite (720 px).
 *
 * Alle Reiter bleiben gemountet und nur verborgen: sonst gingen beim Wechsel
 * Entwürfe und Feldfehler verloren. Hält ein Reiter eine ungültige Eingabe,
 * trägt er einen Marker — der Fehler läge sonst unsichtbar hinter einem
 * anderen Reiter.
 *
 * Verschieben gibt es nicht: die Liste steht nach Termin, nicht in der
 * Reihenfolge des Attributs (siehe `plan-queries.ts`). Löschen fragt nach —
 * ein Eintrag kann Vorgänger anderer sein.
 */

import * as React from "react";
import { ReactElement, useEffect, useState } from "react";

import { ItemActions } from "@man/config-ui/sidebar/item-actions";
import { ToolTabs } from "@man/config-ui/toolbar/tool-tabs";

import { LIMITS, Plan, PlanItem, isLaneItem } from "../plan-model";
import { ConfirmDialog } from "./confirm-dialog";
import { ContentPanel } from "./content-panel";
import { DependencyField } from "./dependency-field";
import { GeneralFields, PlacementFields, TermFields } from "./entry-panels";
import { FieldValidityContext, useGroupValidity } from "./field-validity";
import { updateItem, withOptional } from "./plan-edits";
import { KIND_LABELS, countDependents, itemsByDate } from "./plan-queries";

export type FormTab = "general" | "placement" | "term" | "dependencies" | "content";

const FORM_TABS: readonly FormTab[] = ["general", "placement", "term", "dependencies", "content"];

const FORM_TAB_LABELS: Readonly<Record<FormTab, string>> = {
  general: "Allgemein",
  placement: "Einordnung",
  term: "Termin",
  dependencies: "Abhängigkeiten",
  content: "Inhalt",
};

export interface EntryMainProps {
  plan: Plan;
  item: PlanItem;
  locale: string;
  onPlanChange: (plan: Plan) => void;
  onDuplicate: () => void;
  /** Nach der Rückfrage: der Eintrag soll weg. */
  onRemove: () => void;
  /** Der Reiter; er bleibt beim Wechsel zu einem anderen Eintrag. */
  tab: FormTab;
  onTabChange: (tab: FormTab) => void;
  /** Setzt den Fokus in den Titel — nach dem Anlegen will man ihn als Erstes ändern. */
  autoFocusTitle?: boolean;
}

function dependentsMessage(count: number): string {
  if (count === 0) return "Der Eintrag wird aus dem Plan entfernt.";
  return count === 1
    ? "1 Eintrag hängt davon ab; die Verbindung wird entfernt."
    : `${count} Einträge hängen davon ab; die Verbindungen werden entfernt.`;
}

export function EntryMain({
  plan,
  item,
  locale,
  onPlanChange,
  onDuplicate,
  onRemove,
  tab,
  onTabChange,
  autoFocusTitle = false,
}: EntryMainProps): ReactElement {
  const [confirming, setConfirming] = useState(false);
  const validity = useGroupValidity(FORM_TABS);
  // Stichtage haben keine Vorgänger und deshalb keinen Reiter dafür.
  const available = FORM_TABS.filter((entry) => entry !== "dependencies" || isLaneItem(item));
  const active = available.includes(tab) ? tab : "general";
  useEffect(() => {
    if (active !== tab) onTabChange(active);
  }, [active, tab, onTabChange]);

  const position = itemsByDate(plan.items).findIndex((entry) => entry.id === item.id) + 1;
  const predecessors = item.dependsOn?.length ?? 0;
  const tabs = available.map((id) => {
    const count = id === "dependencies" && predecessors > 0 ? ` (${predecessors})` : "";
    return {
      id,
      label: `${FORM_TAB_LABELS[id]}${count}${validity.invalid.has(id) ? " (Fehler)" : ""}`,
    };
  });

  const panel = (id: FormTab, content: ReactElement): ReactElement => (
    <div key={id} hidden={active !== id} className="flex flex-col gap-5">
      <FieldValidityContext.Provider value={validity.reporters[id]}>{content}</FieldValidityContext.Provider>
    </div>
  );

  const shared = { plan, item, onPlanChange };
  return (
    // Kein `<form>`: Enter in einem Feld löste sonst ein Absenden aus, das
    // hier niemand erwartet — gespeichert wird nur über „Übernehmen“.
    <div className="px-10 pt-6 pb-12 max-lg:px-6" data-testid="entry-main">
      <div className="flex max-w-[720px] flex-col gap-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h2 className="text-xl font-semibold text-foreground">{`Eintrag ${position} von ${plan.items.length}`}</h2>
          <span className="text-[13px] text-muted-foreground" data-testid="entry-kind">
            {KIND_LABELS[item.kind]}
          </span>
          <ItemActions
            className="ml-auto"
            noun="Eintrag"
            onDuplicate={onDuplicate}
            // Voll heißt: keine Kopie. Gesperrt statt weggelassen, damit die
            // Knöpfe nicht springen; „Neu“ nennt die Grenze.
            canDuplicate={plan.items.length < LIMITS.items}
            onDelete={() => setConfirming(true)}
          />
        </div>
        <ToolTabs
          aria-label="Felder des Eintrags"
          tabs={tabs}
          value={active}
          onChange={onTabChange}
          className="-mt-2 [&>div:first-child]:px-0 [&>div:last-child]:pt-5"
        >
          {panel("general", <GeneralFields {...shared} autoFocusTitle={autoFocusTitle} />)}
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
                  onPlanChange(updateItem(plan, withOptional(item, "dependsOn", ids.length > 0 ? ids : undefined)))
                }
              />,
            )}
          {panel("content", <ContentPanel {...shared} />)}
        </ToolTabs>
      </div>
      {confirming && (
        <ConfirmDialog
          title={`„${item.title}“ löschen?`}
          message={dependentsMessage(countDependents(plan, item.id))}
          confirmLabel="Löschen"
          onConfirm={() => {
            setConfirming(false);
            onRemove();
          }}
          onCancel={() => setConfirming(false)}
        />
      )}
    </div>
  );
}
