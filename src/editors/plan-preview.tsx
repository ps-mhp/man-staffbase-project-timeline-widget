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
import { ReactElement, Ref, useState } from "react";

import { Viewport, firstDayOfMonth, parseIsoMonth } from "../calendar";
import { formatMonthYear } from "../format";
import { Plan, PlanView } from "../plan-model";
import { ProjectTimeline } from "../project-timeline";
import { PaneEmpty, PaneHead } from "./pane";
import { EDITOR_LOCALE } from "./plan-queries";

export interface PlanPreviewProps {
  plan: Plan;
  /** Ausgeklappt? Der Zustand liegt beim Editor, der den Ziehgriff darunter nur ausgeklappt zeigt. */
  open: boolean;
  onToggle: () => void;
  /** Die Höhe der Fläche mit dem Zeitstrahl, vom Ziehgriff darunter verstellt. */
  stageHeight: number;
  /** `id` der Fläche — der Ziehgriff nennt sie in `aria-controls`. */
  stageId: string;
  rootRef?: Ref<HTMLDivElement>;
  stageRef?: Ref<HTMLDivElement>;
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
  return parsed === null
    ? month
    : formatMonthYear(firstDayOfMonth(parsed), EDITOR_LOCALE);
};

function describeView(view: PlanView | undefined): string {
  if (view === undefined)
    return "Ohne Startansicht zeigt das Widget beim Laden den ganzen Plan.";
  return `Startansicht: ${monthLabel(view.start)} bis ${monthLabel(view.end)}`;
}

export function PlanPreview({
  plan,
  open,
  onToggle,
  stageHeight,
  stageId,
  rootRef,
  stageRef,
  selectedId,
  viewport,
  onSelectItem,
  onViewportChange,
  onSetStartView,
  onClearStartView,
}: PlanPreviewProps): ReactElement {
  // Der Platz für die Zoom-Knöpfe des Zeitstrahls im Kopf: ein Callback-Ref
  // über den State, damit der Zeitstrahl neu rendert, sobald es ihn gibt.
  const [toolbarHost, setToolbarHost] = useState<HTMLElement | null>(null);
  const toggle = (
    <button
      type="button"
      className="man-pt-editor__disclosure"
      aria-expanded={open}
      aria-controls={stageId}
      onClick={onToggle}
    >
      Vorschau
    </button>
  );
  const actions = (
    <>
      {/* Eingeklappt gibt es keinen Zeitstrahl, der hier zoomen könnte. */}
      {open && (
        <div
          ref={setToolbarHost}
          className="man-pt-editor__preview-tools"
          data-testid="preview-tools"
        />
      )}
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
        <button
          type="button"
          className="man-pt-editor__button"
          onClick={onClearStartView}
        >
          Startansicht entfernen
        </button>
      )}
    </>
  );

  return (
    <div ref={rootRef} className="man-pt-editor__pane man-pt-editor__preview">
      <PaneHead
        title={toggle}
        hint={describeView(plan.view)}
        actions={actions}
      />
      {/* Die Fläche hat eine feste Höhe: der Zeitstrahl füllt im Editor-Modus
          die Höhe seines Elternteils und rollt nur seine Bühne selbst. */}
      <div
        ref={stageRef}
        id={stageId}
        className="man-pt-editor__preview-stage"
        style={{ height: stageHeight }}
        hidden={!open}
      >
        {/* Ohne Einträge zeichnet der Zeitstrahl nichts — wie auf der Seite.
            Eine leere Fläche sähe hier aber nach einem Fehler aus. */}
        {open && plan.items.length === 0 && (
          <PaneEmpty>Die Vorschau erscheint mit dem ersten Eintrag.</PaneEmpty>
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
            toolbarTarget={toolbarHost}
          />
        )}
      </div>
    </div>
  );
}
