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
 * Die Vorlagen, mit denen ein leerer Plan beginnen kann.
 *
 * Eine Liste für zwei Stellen: die Galerie im leeren Editor und die
 * Live-Beispiele der Dokumentation, die eine Vorlage über ihre `id` als
 * `variant` im Manifest wählen. Die erste ist der Beispielplan — sie zeigt die
 * Dokumentation, wenn kein Beispiel eine Variante nennt.
 */

import { examplePlan } from "./example-plan";
import { Plan } from "./plan-model";
import { postponementPlan } from "./postponement-plan";

export interface PlanTemplate {
  /** Stabil: steht als `variant` im Manifest der Dokumentation. */
  id: string;
  title: string;
  description: string;
  /** Bei jedem Aufruf ein frischer Plan — der Editor ändert, was er bekommt. */
  create(): Plan;
}

export const PLAN_TEMPLATES: readonly PlanTemplate[] = [
  {
    id: "roadmap",
    title: "Produkt-Roadmap",
    description:
      "Mehrere Jahre, mehrere Produktlinien: Messen, SOPs und Projekt-Meilensteine mit jeder Art von Eintrag, " +
      "Serien und Abhängigkeiten. Nach der Vorlage „Sales Truck Launch“.",
    create: examplePlan,
  },
  {
    id: "postponement",
    title: "Terminverschiebung",
    description:
      "Ein Termin rückt nach hinten: alter und neuer Stichtag über alle Ebenen, je betroffener Funktion ein " +
      "Zeitraum bis zum neuen Termin. Am Beispiel eines erfundenen Software-Releases.",
    create: postponementPlan,
  },
];

export function findTemplate(id: string | undefined): PlanTemplate | undefined {
  return PLAN_TEMPLATES.find((template) => template.id === id);
}
