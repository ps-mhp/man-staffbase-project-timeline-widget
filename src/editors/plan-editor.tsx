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
 * Der Redaktionsdialog des Projektplans.
 *
 * Setzt die Teile zusammen: Vorschau, Reiter für Einträge, Ebenen und
 * Kategorien, Leerzustand, Fußleiste. Fachlichen Zustand außer Auswahl,
 * Reiter und letztem Ausschnitt trägt er nicht — der Plan steckt im Entwurf
 * des Dialogs (`value`), und jede Änderung geht über die reinen Funktionen in
 * `plan-edits.ts`.
 */

import * as React from "react";
import { ReactElement, useCallback, useEffect, useId, useRef, useState } from "react";

import { FieldModalContentProps } from "@shared/config-modal";
import { useHotStyle } from "@shared/hot-style";

import { Viewport } from "../calendar";
import { LIMITS, Plan } from "../plan-model";
import type { PlanEditorValue } from "../plan-editor-injector";
import { CategoryEditor } from "./category-editor";
import { EditorTabs, TabDefinition } from "./editor-tabs";
import { EntriesTab } from "./entries-tab";
import { LaneEditor } from "./lane-editor";
import { DraftField } from "./draft-field";
import { clearStartView, newItemDate, setStartView, setTitle, startEmpty, startWithExample } from "./plan-edits";
import { PlanPreview } from "./plan-preview";
import planEditorCss from "../styles/plan-editor.scss";
import planEditorFormsCss from "../styles/plan-editor-forms.scss";

// Ein Alias statt `interface … extends … {}`: eine leere Schnittstelle wäre
// nach der hiesigen ESLint-Regel `no-empty-object-type` ein Fehler.
export type PlanEditorProps = FieldModalContentProps<PlanEditorValue>;

type EditorTab = "items" | "lanes" | "categories";

const TABS: readonly TabDefinition<EditorTab>[] = [
  { id: "items", label: "Einträge" },
  { id: "lanes", label: "Ebenen" },
  { id: "categories", label: "Kategorien" },
];

function droppedMessage(dropped: number): string {
  return dropped === 1
    ? "1 Eintrag konnte nicht gelesen werden und geht beim Speichern verloren."
    : `${dropped} Einträge konnten nicht gelesen werden und gehen beim Speichern verloren.`;
}

const sameViewport = (a: Viewport | null, b: Viewport): boolean =>
  a !== null && a.start === b.start && a.end === b.end;

function EmptyState({ onExample, onEmpty }: { onExample: () => void; onEmpty: () => void }): ReactElement {
  const headingId = useId();
  return (
    <section className="man-pt-editor__empty" aria-labelledby={headingId}>
      <h3 id={headingId} className="man-pt-editor__empty-title">
        Der Plan ist noch leer
      </h3>
      <p className="man-pt-editor__hint">
        Der Beispielplan bringt drei Ebenen, sieben Kategorien und jede Art von Eintrag mit — nach der Vorlage
        „Sales Truck Launch“. Er lässt sich danach frei umbauen.
      </p>
      <div className="man-pt-editor__actions">
        <button type="button" className="man-pt-editor__button man-pt-editor__button--primary" onClick={onExample}>
          Mit Beispielplan beginnen
        </button>
        <button type="button" className="man-pt-editor__button" onClick={onEmpty}>
          Leer beginnen
        </button>
      </div>
    </section>
  );
}

export function PlanEditor({ value, onChange, onSave, onClose }: PlanEditorProps): ReactElement {
  const css = useHotStyle(planEditorCss, "project-timeline-widget", "styles/plan-editor.scss");
  const formsCss = useHotStyle(planEditorFormsCss, "project-timeline-widget", "styles/plan-editor-forms.scss");
  const { plan, dropped } = value;
  const rootRef = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<EditorTab>("items");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewport, setViewport] = useState<Viewport | null>(null);
  const [focusTabs, setFocusTabs] = useState(false);

  const changePlan = (next: Plan): void => onChange({ plan: next, dropped });

  // Beständig, damit eine Vorschau, die in einem Effekt meldet, nicht bei
  // jedem Rendern neu meldet — und ein gleicher Ausschnitt rendert nichts neu.
  const onViewportChange = useCallback(
    (next: Viewport) => setViewport((previous) => (sameViewport(previous, next) ? previous : next)),
    [],
  );
  const onSelectItem = useCallback((id: string) => {
    setSelectedId(id);
    setTab("items");
  }, []);

  // Nach dem Beginn verschwinden die Knöpfe des Leerzustands samt Fokus; er
  // gehört dann auf die Reiter, die an ihre Stelle treten.
  useEffect(() => {
    if (!focusTabs) return;
    rootRef.current?.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]')?.focus();
    setFocusTabs(false);
  }, [focusTabs]);

  const begin = (next: Plan): void => {
    changePlan(next);
    setTab("items");
    setFocusTabs(true);
  };

  /**
   * Nach dem Speichern steht im Feld der Plan ohne die verworfenen Einträge;
   * der Hinweis auf sie wäre danach falsch. `onSave` schreibt den Plan aus
   * dem Entwurf dieses Renderns — die Zahl daneben zählt dafür nicht.
   */
  const save = (): void => {
    onChange({ plan, dropped: 0 });
    onSave();
  };

  const empty = plan.lanes.length === 0 && plan.items.length === 0;
  const selected = plan.items.some((item) => item.id === selectedId) ? selectedId : null;

  const panel =
    tab === "items" ? (
      <EntriesTab
        plan={plan}
        selectedId={selected}
        onSelect={setSelectedId}
        onPlanChange={changePlan}
        newDate={() => newItemDate(viewport)}
      />
    ) : tab === "lanes" ? (
      <LaneEditor plan={plan} onPlanChange={changePlan} />
    ) : (
      <CategoryEditor plan={plan} onPlanChange={changePlan} />
    );

  return (
    <div ref={rootRef} className="man-pt-editor">
      <style>{css}</style>
      <style>{formsCss}</style>
      <div className="man-pt-editor__header">
        <h2 className="man-pt-editor__title">Projektplan</h2>
        {/* Die Überschrift steht im Plan, nicht in einem eigenen Attribut —
            siehe `Plan.title`. Leer steht über dem Plan keine. */}
        <DraftField
          label="Überschrift"
          value={plan.title ?? ""}
          normalize={(text) => text.trim()}
          onCommit={(title) => changePlan(setTitle(plan, title))}
          className="man-pt-editor__heading-field"
        />
        <p className="man-pt-editor__count">{`${plan.items.length} / ${LIMITS.items} Einträge`}</p>
      </div>
      <div className="man-pt-editor__body">
        {dropped > 0 && (
          <p className="man-pt-editor__warning" role="alert">
            {droppedMessage(dropped)}
          </p>
        )}
        {empty ? (
          <EmptyState onExample={() => begin(startWithExample(plan))} onEmpty={() => begin(startEmpty(plan))} />
        ) : (
          <>
            <PlanPreview
              plan={plan}
              selectedId={selected}
              viewport={viewport}
              onSelectItem={onSelectItem}
              onViewportChange={onViewportChange}
              onSetStartView={() => viewport !== null && changePlan(setStartView(plan, viewport))}
              onClearStartView={() => changePlan(clearStartView(plan))}
            />
            <EditorTabs tabs={TABS} active={tab} onChange={setTab} label="Bereiche des Plans">
              {panel}
            </EditorTabs>
          </>
        )}
      </div>
      <div className="man-pt-editor__footer">
        <button type="button" className="man-pt-editor__button" onClick={onClose}>
          Abbrechen
        </button>
        <button type="button" className="man-pt-editor__button man-pt-editor__button--primary" onClick={save}>
          Übernehmen
        </button>
      </div>
    </div>
  );
}
