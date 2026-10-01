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
 * keiner davon. Der Editor wird deshalb neben das Feld gehängt, sobald der
 * Dialog erscheint. Das Feld selbst bleibt stehen: geht der Einbau schief,
 * ist die Konfiguration noch von Hand zu retten.
 */

import * as React from "react";

import { startFieldModalInjector } from "@shared/config-modal";

import { PLAN_ATTRIBUTE } from "./configuration-schema";
import { PlanEditor } from "./editors/plan-editor";
import { Plan, encodePlanAttribute, readPlanAttribute } from "./plan-model";

/**
 * Was der Editor bearbeitet: der Plan und die Zahl der Einträge, die beim
 * Lesen verworfen wurden. Die Zahl reist mit, damit der Editor warnen kann,
 * dass sie beim Speichern endgültig verloren gehen; geschrieben wird sie nie.
 */
export interface PlanEditorValue {
  plan: Plan;
  dropped: number;
  /** Verknüpfungen und Anhänge, die beim Lesen wegfielen; ihr Eintrag blieb. */
  droppedLinks?: number;
}

const FULL_SCREEN_PANEL: React.CSSProperties = {
  width: "100vw",
  height: "100vh",
  maxWidth: "none",
  maxHeight: "none",
  padding: 0,
  borderRadius: 0,
  boxShadow: "none",
};

export function startPlanEditorInjector(): () => void {
  return startFieldModalInjector<PlanEditorValue>({
    fieldKey: PLAN_ATTRIBUTE,
    root: document,
    reopenLabel: "Plan bearbeiten …",
    parse: readPlanAttribute,
    serialize: (value) => encodePlanAttribute(value.plan),
    render: (props) => React.createElement(PlanEditor, props),
    modalTestId: "plan-editor-modal",
    reopenTestId: "plan-editor-reopen",
    // Vollbild: Vorschau, Liste und Formular brauchen Breite und Höhe, und
    // ein Plan mit Hunderten Einträgen ist Arbeit für eine ganze Sitzung. Die
    // Leiste des Staffbase-Studios darüber verschwindet dabei — gewollt, der
    // Dialog ist ohnehin modal. Rahmen und Abstand zeichnet der Editor selbst.
    panelStyle: FULL_SCREEN_PANEL,
  });
}
