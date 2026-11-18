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
 * Setzt den Plan-Editor an die Stelle des Feldes `plan`.
 *
 * Staffbase baut den Konfigurationsdialog selbst und kennt nur die Feldtypen
 * von RJSF; ein Zeitstrahl mit Ebenen, Kategorien und Abhängigkeiten ist
 * keiner davon. Der Editor wird deshalb im gemeinsamen Vollbild-Rahmen
 * (`@man/config-ui`) neben das Feld gehängt, sobald der Dialog erscheint. Das
 * Feld selbst bleibt stehen: geht der Einbau schief, ist die Konfiguration
 * noch von Hand zu retten.
 *
 * Die alten Schalter `show-today` und `allow-export` sind im eigenen Dialog
 * ausgeblendet; der Editor pflegt sie im Plan (`@shared/legacy-fields`).
 */

import * as React from "react";
import { CalendarRange } from "lucide-react";

import { FieldModalShellOptions, startFieldModalInjector } from "@shared/config-modal";
import { LegacyFieldSpec, readLegacyFields, startHiddenFields } from "@shared/legacy-fields";

import { ALLOW_EXPORT_ATTRIBUTE, LEGACY_ATTRIBUTES, PLAN_ATTRIBUTE, SHOW_TODAY_ATTRIBUTE } from "./configuration-schema";
import { encodePlanAttribute, readPlanAttribute } from "./plan-model";
import { PLAN_EDITOR_HELP } from "./plan-editor-help";
import { LegacyFlags, PlanEditorValue, planChangesStatus, validatePlan } from "./plan-editor-rules";

const LEGACY_FIELDS: Record<string, LegacyFieldSpec> = {
  [SHOW_TODAY_ATTRIBUTE]: { kind: "boolean" },
  [ALLOW_EXPORT_ATTRIBUTE]: { kind: "boolean" },
};

/** Die alten Schalter, wie der eigene Dialog sie gerade führt; nicht Lesbares fehlt. */
function readLegacyFlagsFromDialog(root: ParentNode): LegacyFlags {
  const { values } = readLegacyFields(LEGACY_FIELDS, PLAN_ATTRIBUTE, root);
  const showToday = values[SHOW_TODAY_ATTRIBUTE];
  const allowExport = values[ALLOW_EXPORT_ATTRIBUTE];
  return {
    ...(typeof showToday === "boolean" ? { showToday } : {}),
    ...(typeof allowExport === "boolean" ? { allowExport } : {}),
  };
}

export type { PlanEditorValue } from "./plan-editor-rules";

/**
 * Der Editor kommt erst, wenn ein Dialog ihn zeigt: er baut auf
 * `@man/config-ui` und damit auf react-aria, und das hat im Seitenbündel,
 * das jede Leserin lädt, nichts verloren. Hier bleiben nur Prüfung, Status
 * und Hilfe — sie braucht der Rahmen, bevor der Editor da ist.
 */
const LazyPlanEditor = React.lazy(() => import("./editors/plan-editor").then((module) => ({ default: module.PlanEditor })));

const LOADING = React.createElement(
  "p",
  { className: "p-6 text-sm text-muted-foreground" },
  "Editor wird geladen …",
);

/** Was der gemeinsame Rahmen vom Projektplan wissen muss. Offengelegt für Tests. */
export const planEditorShell: FieldModalShellOptions<PlanEditorValue> = {
  widgetName: "Projektplan",
  title: "Plan bearbeiten",
  icon: CalendarRange,
  preview: true,
  help: PLAN_EDITOR_HELP,
  statusText: planChangesStatus,
  validate: validatePlan,
};

/**
 * @param root der zu beobachtende Teilbaum; standardmäßig das Dokument.
 * Offengelegt, damit Tests den Beobachter auf einen Container begrenzen.
 * @returns eine Funktion, die die Beobachtung beendet und alles abbaut.
 */
export function startPlanEditorInjector(root: ParentNode = document): () => void {
  const stopModal = startFieldModalInjector<PlanEditorValue>({
    fieldKey: PLAN_ATTRIBUTE,
    root,
    reopenLabel: "Plan bearbeiten …",
    modalTestId: "plan-editor-modal",
    reopenTestId: "plan-editor-reopen",
    parse: (raw) => ({ ...readPlanAttribute(raw), legacy: readLegacyFlagsFromDialog(root) }),
    serialize: (value) => encodePlanAttribute(value.plan),
    shell: planEditorShell,
    render: ({ value, saved, onChange }) =>
      React.createElement(
        React.Suspense,
        { fallback: LOADING },
        React.createElement(LazyPlanEditor, { value, saved, onChange }),
      ),
  });
  const stopHiding = startHiddenFields(LEGACY_ATTRIBUTES, PLAN_ATTRIBUTE, root);
  return () => {
    stopModal();
    stopHiding();
  };
}
