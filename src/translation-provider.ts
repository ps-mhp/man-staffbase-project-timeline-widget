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
 * Wie der Plan dieses Widgets durch Staffbases Inhaltsübersetzung reist.
 *
 * Der Plan liegt im Attribut `plan`, weil ein Attribut die einzige Ablage ist,
 * die das Widget-SDK anbietet — und `POST /api/translations` übersetzt
 * Textknoten und lässt Attribute unangetastet. Die geteilte Registry schickt
 * den Text deshalb als eigene Anfrage neben der des Editors los und schreibt
 * das Ergebnis ins Attribut zurück, bevor der Editor die Antwort überhaupt
 * sieht.
 *
 * Die Überschrift steht deshalb im Plan (`plan.title`) und reist mit ihm:
 * ein zweiter Provider auf demselben Tag ginge nicht gut. Der Rückweg im
 * klassischen Editor baut das ganze Tag aus der Anfrage neu auf, ein zweiter
 * Provider setzte also den übersetzten Plan wieder auf die Ausgangssprache
 * zurück.
 */

import { TranslationProvider } from "@shared/translation/carriers";

import { PLAN_ATTRIBUTE } from "./configuration-schema";
import { encodePlanAttribute, parsePlan } from "./plan-model";
import { isTranslatedPlanHtml, planFromTranslated, planToTranslatable } from "./translation-payload";

/** Muss dem Tag entsprechen, unter dem `index.tsx` das Widget anmeldet. */
export const PROJECT_TIMELINE_TAG = "project-timeline-widget";

export const planTranslationProvider: TranslationProvider = {
  id: `${PROJECT_TIMELINE_TAG}/plan`,
  label: "Projektplan",
  ref: { tagName: PROJECT_TIMELINE_TAG, attribute: PLAN_ATTRIBUTE },

  // `stored` ist `string | null`: das Attribut kann ganz fehlen. `null`
  // zurückzugeben heißt „hier gibt es nichts zu übersetzen" — die Alternative
  // wäre, ein leeres Dokument durch die Übersetzung zu schicken.
  toTranslatable: (stored) => {
    if (stored === null) return null;
    const html = planToTranslatable(parsePlan(stored));
    return html === "" ? null : html;
  },

  // Zurück geht der Plan so, wie ihn das Widget liest: was schon beim Lesen
  // verworfen wird, schreibt auch die Übersetzung nicht wieder hinein. Die
  // Verpackung per `encodePlanAttribute` ist Pflicht, nicht Vorsicht — der
  // Rückweg setzt den Wert unmaskiert ins Tag (`withValue`).
  fromTranslated: (html, stored) => {
    if (stored === null) return null;
    return encodePlanAttribute(planFromTranslated(html, parsePlan(stored)));
  },

  acceptsTranslated: isTranslatedPlanHtml,
};
