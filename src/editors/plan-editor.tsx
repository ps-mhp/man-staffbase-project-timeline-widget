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
 * Der Redaktionsdialog des Projektplans, im Rahmen von `@man/config-ui`.
 *
 * Links die Einträge (nach Termin, mit Suche und Auswahl der Art), in der
 * Mitte das Formular des gewählten, rechts das Panel „Plan“ mit
 * Einstellungen, Ebenen und Kategorien. In Desktop, Tablet und Mobil steht
 * statt des Formulars die Vorschau in Gerätebreite; ein Klick dort wählt den
 * Eintrag.
 *
 * Er schreibt nichts selbst zurück und zeichnet keine Knöpfe zum Übernehmen
 * oder Abbrechen: Kopf, Status, Rückgängig und Rückfrage kommen aus dem
 * Rahmen, das Zurückschreiben ins Formularfeld aus `@shared/config-modal`.
 * Fachlichen Zustand außer Auswahl, Reiter, Filter und letztem Ausschnitt
 * trägt er nicht — der Plan steckt im Entwurf des Rahmens (`value`), und jede
 * Änderung geht über die reinen Funktionen in `plan-edits.ts`.
 */

import * as React from "react";
import { ReactElement, useCallback, useEffect, useRef, useState } from "react";

import { ConfigWorkspace } from "@man/config-ui/layout/config-workspace";

import { Viewport } from "../calendar";
import { PlanEditorValue, effectiveFlags } from "../plan-editor-rules";
import { ItemKind, Plan } from "../plan-model";
import { EmptyState } from "./empty-state";
import { EntryMain } from "./entry-main";
import { EntrySidebar } from "./entry-sidebar";
import { useEntriesView } from "./entries-view";
import { addItem, duplicateItem, newItemDate, removeItem } from "./plan-edits";
import { PlanInspector } from "./plan-inspector";
import { PlanPreview } from "./plan-preview";
import { EDITOR_LOCALE, visibleItems } from "./plan-queries";
import { startEmpty, startWithTemplate } from "./plan-structure-edits";

export interface PlanEditorProps {
  value: PlanEditorValue;
  onChange: (value: PlanEditorValue) => void;
}

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

const sameViewport = (a: Viewport | null, b: Viewport): boolean => a !== null && a.start === b.start && a.end === b.end;

export function PlanEditor({ value, onChange }: PlanEditorProps): ReactElement {
  const { plan, dropped, droppedLinks = 0 } = value;
  const rootRef = useRef<HTMLDivElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewport, setViewport] = useState<Viewport | null>(null);
  // Der Eintrag, dessen Titel beim Erscheinen den Fokus bekommt: nur ein
  // gerade angelegter. Wer einen bestehenden wählt, will erst lesen.
  const [focusId, setFocusId] = useState<string | null>(null);
  // Zählt die Löschungen: danach gehört der Fokus auf die gewählte Zeile.
  const [removals, setRemovals] = useState(0);
  const empty = plan.lanes.length === 0 && plan.items.length === 0;

  const changePlan = (next: Plan): void => onChange({ ...value, plan: next });

  // Beständig, damit eine Vorschau, die in einem Effekt meldet, nicht bei
  // jedem Rendern neu meldet — und ein gleicher Ausschnitt rendert nichts neu.
  const onViewportChange = useCallback(
    (next: Viewport) => setViewport((previous) => (sameViewport(previous, next) ? previous : next)),
    [],
  );

  // Gewählt ist immer etwas, solange es Einträge gibt: das Formular wäre
  // sonst leer. Ohne Wahl (oder nach dem Löschen) der erste der Liste.
  const [view, setView] = useEntriesView(plan, selectedId);
  const visible = visibleItems(plan, view.kind, view.query);
  const chosen = plan.items.some((item) => item.id === selectedId)
    ? selectedId
    : (visible[0]?.id ?? plan.items[0]?.id ?? null);
  const selected = plan.items.find((item) => item.id === chosen);
  if (focusId !== null && focusId !== chosen) setFocusId(null);

  useEffect(() => {
    if (removals === 0) return;
    rootRef.current?.querySelector<HTMLElement>('[role="row"][aria-selected="true"]')?.focus();
  }, [removals]);

  // Nach dem Anlegen: „Allgemein“, Fokus im Titel. Die Suche weicht, sonst
  // stünde der neue Eintrag nicht in der Liste.
  const created = (next: Plan, id: string | null, kind: ItemKind): void => {
    if (id === null) return;
    changePlan(next);
    setSelectedId(id);
    setFocusId(id);
    setView({ formTab: "general", query: "", kind: view.kind === "all" ? "all" : kind });
  };

  const remove = (id: string): void => {
    const order = visible.map((item) => item.id);
    const index = order.indexOf(id);
    const neighbor = index === -1 ? null : (order[index + 1] ?? order[index - 1] ?? null);
    changePlan(removeItem(plan, id));
    setSelectedId(neighbor);
    setRemovals((count) => count + 1);
  };

  const begin = (next: Plan): void => {
    changePlan(next);
    setSelectedId(next.items[0]?.id ?? null);
  };

  const flags = effectiveFlags(value);
  const notice =
    dropped > 0 || droppedLinks > 0
      ? [dropped > 0 ? droppedMessage(dropped) : null, droppedLinks > 0 ? droppedLinksMessage(droppedLinks) : null]
          .filter((message) => message !== null)
          .join(" ")
      : null;

  return (
    // `man-pt-editor` ist die Bezugsfläche der Popover (`anchored-popover.tsx`)
    // und der Rückfragen (`confirm-dialog.tsx`), die über dem Editor liegen.
    <div ref={rootRef} className="man-pt-editor relative flex h-full min-h-0 w-full flex-col" data-testid="plan-editor">
      {notice !== null && (
        <p className="shrink-0 border-b border-warning/30 bg-warning/10 px-5 py-2 text-[13px] text-foreground" role="alert">
          {notice}
        </p>
      )}
      <div className="min-h-0 flex-1">
        <ConfigWorkspace
          sidebar={
            <EntrySidebar
              plan={plan}
              selectedId={chosen}
              kind={view.kind}
              query={view.query}
              onKindChange={(kind) => setView({ kind })}
              onQueryChange={(query) => setView({ query })}
              onSelect={setSelectedId}
              onAdd={(kind) => {
                const result = addItem(plan, kind, newItemDate(viewport));
                created(result.plan, result.id, kind);
              }}
            />
          }
          inspector={<PlanInspector value={value} viewport={viewport} onPlanChange={changePlan} />}
          preview={
            <PlanPreview
              plan={plan}
              showToday={flags.showToday}
              selectedId={chosen}
              onSelectItem={(id) => {
                setSelectedId(id);
              }}
              onViewportChange={onViewportChange}
            />
          }
        >
          {empty ? (
            <EmptyState
              onTemplate={(template) => begin(startWithTemplate(plan, template))}
              onEmpty={() => begin(startEmpty(plan))}
            />
          ) : selected === undefined ? (
            <p className="px-10 py-6 text-sm text-muted-foreground">Links einen Eintrag wählen oder einen neuen anlegen.</p>
          ) : (
            <EntryMain
              // Je Eintrag eine eigene Instanz: ein Feld hält eine noch
              // ungültige Eingabe fest, und die gehört nicht in den nächsten.
              key={selected.id}
              plan={plan}
              item={selected}
              locale={EDITOR_LOCALE}
              onPlanChange={changePlan}
              onDuplicate={() => {
                const result = duplicateItem(plan, selected.id);
                created(result.plan, result.id, selected.kind);
              }}
              onRemove={() => remove(selected.id)}
              tab={view.formTab}
              onTabChange={(formTab) => setView({ formTab })}
              autoFocusTitle={selected.id === focusId}
            />
          )}
        </ConfigWorkspace>
      </div>
    </div>
  );
}
