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
 * Der Redaktionsdialog des Projektplans, im Vollbild.
 *
 * Von oben: Kopfleiste mit Überschrift, Zähler und „Übernehmen“ · Hinweis auf
 * verworfene Einträge · Hauptbereich mit Vorschau und Arbeitsbereich (Reiter
 * für Einträge, Ebenen und Kategorien). Jede Stufe reicht ihre Höhe per
 * `min-height: 0` nach unten durch, damit am Ende jeder Bereich selbst rollt:
 * das Modal um den Editor rollt absichtlich nicht.
 *
 * Fachlichen Zustand außer Auswahl, Reiter und letztem Ausschnitt trägt er
 * nicht — der Plan steckt im Entwurf des Dialogs (`value`), und jede Änderung
 * geht über die reinen Funktionen in `plan-edits.ts`.
 */

import * as React from "react";
import {
  ReactElement,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import { FieldModalContentProps } from "@shared/config-modal";
import { useHotStyle } from "@shared/hot-style";

import { Viewport } from "../calendar";
import { Plan } from "../plan-model";
import type { PlanEditorValue } from "../plan-editor-injector";
import { CategoryEditor } from "./category-editor";
import { EditorHeader } from "./editor-header";
import { EditorTabs, TabDefinition } from "./editor-tabs";
import { EmptyState } from "./empty-state";
import { EntriesTab } from "./entries-tab";
import { useEntriesView } from "./entries-view";
import { LaneEditor } from "./lane-editor";
import { newItemDate, setTitle } from "./plan-edits";
import {
  clearStartView,
  setStartView,
  startEmpty,
  startWithTemplate,
} from "./plan-structure-edits";
import { PREVIEW, defaultPreviewHeight, previewSpace } from "./editor-layout";
import { PlanPreview } from "./plan-preview";
import { Splitter } from "./splitter";
import { useSplitSize } from "./use-split-size";
import planEditorCss from "../styles/plan-editor.scss";
import planEditorControlsCss from "../styles/plan-editor-controls.scss";
import planEditorFormsCss from "../styles/plan-editor-forms.scss";
import planEditorListsCss from "../styles/plan-editor-lists.scss";
import planEditorOverlaysCss from "../styles/plan-editor-overlays.scss";

// Ein Alias statt `interface … extends … {}`: eine leere Schnittstelle wäre
// nach der hiesigen ESLint-Regel `no-empty-object-type` ein Fehler.
export type PlanEditorProps = FieldModalContentProps<PlanEditorValue>;

type EditorTab = "items" | "lanes" | "categories";

const WIDGET = "project-timeline-widget";

const TABS: readonly TabDefinition<EditorTab>[] = [
  { id: "items", label: "Einträge" },
  { id: "lanes", label: "Ebenen" },
  { id: "categories", label: "Kategorien" },
];

function droppedLinksMessage(droppedLinks: number): string {
  return droppedLinks === 1
    ? "1 Verknüpfung konnte nicht gelesen werden und geht beim Speichern verloren."
    : `${droppedLinks} Verknüpfungen konnten nicht gelesen werden und gehen beim Speichern verloren.`;
}

function droppedMessage(dropped: number): string {
  return dropped === 1
    ? "1 Eintrag konnte nicht gelesen werden und geht beim Speichern verloren."
    : `${dropped} Einträge konnten nicht gelesen werden und gehen beim Speichern verloren.`;
}

const sameViewport = (a: Viewport | null, b: Viewport): boolean =>
  a !== null && a.start === b.start && a.end === b.end;

export function PlanEditor({
  value,
  onChange,
  onSave,
  onClose,
  dirty,
}: PlanEditorProps): ReactElement {
  const sheets = [
    useHotStyle(planEditorCss, WIDGET, "styles/plan-editor.scss"),
    useHotStyle(
      planEditorControlsCss,
      WIDGET,
      "styles/plan-editor-controls.scss",
    ),
    useHotStyle(planEditorFormsCss, WIDGET, "styles/plan-editor-forms.scss"),
    useHotStyle(planEditorListsCss, WIDGET, "styles/plan-editor-lists.scss"),
    useHotStyle(
      planEditorOverlaysCss,
      WIDGET,
      "styles/plan-editor-overlays.scss",
    ),
  ];
  const { plan, dropped, droppedLinks = 0 } = value;
  const rootRef = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<EditorTab>("items");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewport, setViewport] = useState<Viewport | null>(null);
  const [focusTabs, setFocusTabs] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(true);
  const mainRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const stageId = useId();
  const empty = plan.lanes.length === 0 && plan.items.length === 0;

  // Eingeklappt merkt sich die Vorschau ihre Höhe; ausgeklappt kehrt sie zu ihr zurück.
  const previewHeight = useSplitSize({
    storageKey: PREVIEW.storageKey,
    fallback: defaultPreviewHeight,
    min: PREVIEW.min,
    reserve: PREVIEW.reserve,
    observe: mainRef,
    measure: () =>
      previewSpace(mainRef.current, previewRef.current, stageRef.current),
    remeasureKey: previewOpen && !empty,
  });

  const changePlan = (next: Plan): void => onChange({ plan: next, dropped, droppedLinks });

  // Beständig, damit eine Vorschau, die in einem Effekt meldet, nicht bei
  // jedem Rendern neu meldet — und ein gleicher Ausschnitt rendert nichts neu.
  const onViewportChange = useCallback(
    (next: Viewport) =>
      setViewport((previous) =>
        sameViewport(previous, next) ? previous : next,
      ),
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
    rootRef.current
      ?.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]')
      ?.focus();
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
    onChange({ plan, dropped: 0, droppedLinks: 0 });
    onSave();
  };

  const selected = plan.items.some((item) => item.id === selectedId)
    ? selectedId
    : null;
  const [entriesView, setEntriesView] = useEntriesView(plan, selected);

  const panel =
    tab === "items" ? (
      <EntriesTab
        plan={plan}
        selectedId={selected}
        onSelect={setSelectedId}
        onPlanChange={changePlan}
        newDate={() => newItemDate(viewport)}
        view={entriesView}
        onViewChange={setEntriesView}
      />
    ) : tab === "lanes" ? (
      <LaneEditor plan={plan} onPlanChange={changePlan} />
    ) : (
      <CategoryEditor plan={plan} onPlanChange={changePlan} />
    );

  return (
    <div ref={rootRef} className="man-pt-editor">
      {sheets.map((sheet, index) => (
        <style key={index}>{sheet}</style>
      ))}
      <EditorHeader
        plan={plan}
        dirty={dirty}
        onTitleChange={(title) => changePlan(setTitle(plan, title))}
        onCancel={onClose}
        onSave={save}
      />
      {(dropped > 0 || droppedLinks > 0) && (
        <p className="man-pt-editor__notice" role="alert">
          {[
            dropped > 0 ? droppedMessage(dropped) : null,
            droppedLinks > 0 ? droppedLinksMessage(droppedLinks) : null,
          ]
            .filter((message) => message !== null)
            .join(" ")}
        </p>
      )}
      <div ref={mainRef} className="man-pt-editor__main">
        {empty ? (
          <EmptyState
            onTemplate={(template) => begin(startWithTemplate(plan, template))}
            onEmpty={() => begin(startEmpty(plan))}
          />
        ) : (
          <>
            <PlanPreview
              plan={plan}
              open={previewOpen}
              onToggle={() => setPreviewOpen(!previewOpen)}
              stageHeight={previewHeight.size}
              stageId={stageId}
              rootRef={previewRef}
              stageRef={stageRef}
              selectedId={selected}
              viewport={viewport}
              onSelectItem={onSelectItem}
              onViewportChange={onViewportChange}
              onSetStartView={() =>
                viewport !== null && changePlan(setStartView(plan, viewport))
              }
              onClearStartView={() => changePlan(clearStartView(plan))}
            />
            {previewOpen && (
              <Splitter
                orientation="horizontal"
                label="Höhe der Vorschau ändern"
                controls={stageId}
                split={previewHeight}
              />
            )}
            <EditorTabs
              tabs={TABS}
              active={tab}
              onChange={setTab}
              label="Bereiche des Plans"
            >
              {panel}
            </EditorTabs>
          </>
        )}
      </div>
    </div>
  );
}
