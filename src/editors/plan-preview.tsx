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
 * Die Vorschau in den Geräteansichten (Desktop · Tablet · Mobil): derselbe
 * Zeitstrahl wie auf der Seite, im Editor-Modus — ohne Filter, Liste und
 * Export, und ein Klick wählt den Eintrag, statt Details oder den verknüpften
 * Inhalt zu öffnen. Es entsteht also nichts, was die Seite oder Staffbase
 * berührt.
 *
 * Gezoomt und verschoben wird wie auf der Seite; der Ausschnitt geht an den
 * Editor zurück und wird dort zur Startansicht (`PlanSettings`).
 */

import * as React from "react";
import { ReactElement } from "react";

import { Viewport } from "../calendar";
import { Plan } from "../plan-model";
import { ProjectTimeline } from "../project-timeline";
import { EDITOR_LOCALE } from "./plan-queries";

export interface PlanPreviewProps {
  plan: Plan;
  showToday: boolean;
  selectedId: string | null;
  onSelectItem: (id: string) => void;
  onViewportChange: (viewport: Viewport) => void;
}

export function PlanPreview({
  plan,
  showToday,
  selectedId,
  onSelectItem,
  onViewportChange,
}: PlanPreviewProps): ReactElement {
  // Die Fläche hat eine feste Höhe: der Zeitstrahl füllt im Editor-Modus die
  // Höhe seines Elternteils und rollt nur seine Bühne selbst.
  return (
    <div className="h-[min(72vh,680px)] min-h-[360px] text-foreground" data-testid="plan-preview">
      {/* Ohne Einträge zeichnet der Zeitstrahl nichts — wie auf der Seite.
          Eine leere Fläche sähe hier aber nach einem Fehler aus. */}
      {plan.items.length === 0 ? (
        <p className="px-8 py-10 text-sm text-muted-foreground">Die Vorschau erscheint mit dem ersten Eintrag.</p>
      ) : (
        <ProjectTimeline
          plan={plan}
          mode="editor"
          selectedId={selectedId}
          onSelectItem={onSelectItem}
          onViewportChange={onViewportChange}
          showToday={showToday}
          allowExport={false}
          locale={EDITOR_LOCALE}
        />
      )}
    </div>
  );
}
