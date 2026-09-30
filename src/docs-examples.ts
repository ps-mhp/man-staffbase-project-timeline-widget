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
 * Das Live-Beispiel für das Dokumentations-Widget: der Beispielplan nach der
 * Vorlage, derselbe, mit dem der leere Editor anbietet zu beginnen.
 *
 * Über einen Resolver statt als festes Attribut im Manifest, weil der Plan
 * verpackt (`b64:…`) gespeichert wird: im Manifest stünde ein unlesbarer,
 * mehrere Kilobyte langer Wert, der bei jeder Änderung von `example-plan.ts`
 * von Hand nachgezogen werden müsste — und still veraltete.
 */

import { registerDocsExamples } from "@shared/docs/register-docs-examples";

import { PLAN_ATTRIBUTE } from "./configuration-schema";
import { examplePlan } from "./example-plan";
import { encodePlanAttribute } from "./plan-model";

// Der Name steht hier als Literal statt aus `translation-provider.ts`: dieses
// Bündel lädt das Dokumentations-Widget eigens, und der Import zöge die ganze
// Übersetzung mit hinein.
registerDocsExamples("project-timeline-widget", async () => ({
  [PLAN_ATTRIBUTE]: encodePlanAttribute(examplePlan()),
}));
