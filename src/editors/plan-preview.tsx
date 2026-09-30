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
 * Die Vorschau über dem Formular: derselbe Zeitstrahl wie auf der Seite, im
 * Editor-Modus — ein Klick wählt den Eintrag, statt Details zu öffnen.
 *
 * Einklappbar, weil sie auf kleinen Bildschirmen die halbe Höhe braucht und
 * wer gerade Kategorien pflegt, sie nicht vor Augen haben muss.
 */

import * as React from "react";
import { ReactElement, useId, useState } from "react";

import { Viewport, firstDayOfMonth, parseIsoMonth } from "../calendar";
import { formatMonthYear } from "../format";
import { Plan, PlanView } from "../plan-model";
import { ProjectTimeline } from "../project-timeline";
import { EDITOR_LOCALE } from "./plan-queries";

export interface PlanPreviewProps {
  plan: Plan;
  selectedId: string | null;
  /** Der zuletzt von der Vorschau gemeldete Ausschnitt. */
  viewport: Viewport | null;
  onSelectItem: (id: string) => void;
  onViewportChange: (viewport: Viewport) => void;
  onSetStartView: () => void;
  onClearStartView: () => void;
}

const monthLabel = (month: string): string => {
  const parsed = parseIsoMonth(month);
  return parsed === null ? month : formatMonthYear(firstDayOfMonth(parsed), EDITOR_LOCALE);
};

function describeView(view: PlanView | undefined): string {
  if (view === undefined) return "Ohne Startansicht zeigt das Widget beim Laden den ganzen Plan.";
  return `Startansicht: ${monthLabel(view.start)} bis ${monthLabel(view.end)}`;
}

export function PlanPreview({
  plan,
  selectedId,
  viewport,
  onSelectItem,
  onViewportChange,
  onSetStartView,
  onClearStartView,
}: PlanPreviewProps): ReactElement {
  const bodyId = useId();
  const [open, setOpen] = useState(true);

  return (
    <div className="man-pt-editor__preview">
      <div className="man-pt-editor__preview-head">
        <button
          type="button"
          className="man-pt-editor__disclosure"
          aria-expanded={open}
          aria-controls={bodyId}
          onClick={() => setOpen(!open)}
        >
          Vorschau
        </button>
        <p className="man-pt-editor__meta">{describeView(plan.view)}</p>
        <div className="man-pt-editor__actions">
          {/* Eingeklappt ist nicht zu sehen, was als Startansicht gespeichert würde. */}
          <button
            type="button"
            className="man-pt-editor__button"
            disabled={!open || viewport === null}
            onClick={onSetStartView}
          >
            Diesen Ausschnitt als Startansicht
          </button>
          {plan.view !== undefined && (
            <button type="button" className="man-pt-editor__button" onClick={onClearStartView}>
              Startansicht entfernen
            </button>
          )}
        </div>
      </div>
      <div id={bodyId} className="man-pt-editor__preview-body" hidden={!open}>
        {/* Ohne Einträge zeichnet der Zeitstrahl nichts — wie auf der Seite.
            Eine leere Fläche sähe hier aber nach einem Fehler aus. */}
        {open && plan.items.length === 0 && (
          <p className="man-pt-editor__hint">Die Vorschau erscheint mit dem ersten Eintrag.</p>
        )}
        {open && plan.items.length > 0 && (
          <ProjectTimeline
            plan={plan}
            mode="editor"
            selectedId={selectedId}
            onSelectItem={onSelectItem}
            onViewportChange={onViewportChange}
            showToday
            allowExport={false}
            locale={EDITOR_LOCALE}
          />
        )}
      </div>
    </div>
  );
}
