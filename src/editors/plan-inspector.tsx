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
 * Das Panel rechts: „Plan“ mit den Reitern Einstellungen · Ebenen ·
 * Kategorien. Ebenen und Kategorien tragen die Zahl als Marke, damit man sie
 * sieht, ohne den Reiter zu öffnen.
 */

import * as React from "react";
import { ReactElement } from "react";

import { InspectorPanel } from "@man/config-ui/inspector/inspector-panel";

import { Viewport } from "../calendar";
import { PlanEditorValue } from "../plan-editor-rules";
import { Plan } from "../plan-model";
import { CategoryEditor } from "./category-editor";
import { LaneEditor } from "./lane-editor";
import { PlanSettings } from "./plan-settings";

export interface PlanInspectorProps {
  value: PlanEditorValue;
  viewport: Viewport | null;
  onPlanChange: (plan: Plan) => void;
}

const badge = (count: number): ReactElement => (
  <span className="rounded-full bg-muted px-1.5 text-xs font-semibold text-muted-foreground">{count}</span>
);

export function PlanInspector({ value, viewport, onPlanChange }: PlanInspectorProps): ReactElement {
  const { plan } = value;
  return (
    <InspectorPanel
      title="Plan"
      tabs={[
        {
          id: "settings",
          label: "Einstellungen",
          content: <PlanSettings value={value} viewport={viewport} onPlanChange={onPlanChange} />,
        },
        {
          id: "lanes",
          label: "Ebenen",
          badge: badge(plan.lanes.length),
          content: <LaneEditor plan={plan} onPlanChange={onPlanChange} />,
        },
        {
          id: "categories",
          label: "Kategorien",
          badge: badge(plan.categories.length),
          content: <CategoryEditor plan={plan} onPlanChange={onPlanChange} />,
        },
      ]}
    />
  );
}
