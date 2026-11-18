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
 * Was der Rahmen vom Plan-Editor wissen muss, ohne den Editor zu laden:
 * die Beschreibung der Änderungen für den Status und die Prüfung vor dem
 * Übernehmen. Liegt im Seitenbündel — deshalb nichts Schweres importieren.
 */

import type { ValidationIssue } from "@man/config-ui/shell/shell-context";

import { Plan, PlanItem } from "./plan-model";

/** Was der Editor von den alten Feldern lesen konnte; fehlt ein Schlüssel, war das Feld nicht lesbar. */
export interface LegacyFlags {
  showToday?: boolean;
  allowExport?: boolean;
}

/**
 * Was der Editor bearbeitet: der Plan, die Zahl der Einträge, die beim Lesen
 * verworfen wurden, und was die alten Schalter des Dialogs sagten. Die Zahlen
 * reisen mit, damit der Editor warnen kann, dass sie beim Speichern endgültig
 * verloren gehen; geschrieben werden sie nie.
 */
export interface PlanEditorValue {
  plan: Plan;
  dropped: number;
  /** Verknüpfungen und Anhänge, die beim Lesen wegfielen; ihr Eintrag blieb. */
  droppedLinks?: number;
  /**
   * Was die alten Felder `show-today` und `allow-export` des Dialogs beim
   * Öffnen trugen, soweit lesbar. Nur zur Anzeige der Schalter; der Plan
   * bekommt den Wert erst, wenn jemand einen Schalter umlegt.
   */
  legacy?: LegacyFlags;
}

/** Die Schalter, wie sie jetzt gelten: Plan vor altem Feld vor Vorgabe (an). */
export function effectiveFlags(value: PlanEditorValue): { showToday: boolean; allowExport: boolean } {
  return {
    showToday: value.plan.showToday ?? value.legacy?.showToday ?? true,
    allowExport: value.plan.allowExport ?? value.legacy?.allowExport ?? true,
  };
}

const sameJson = (a: unknown, b: unknown): boolean => JSON.stringify(a) === JSON.stringify(b);

/** Wie viele Einträge neu, geändert oder weg sind. */
function changedItems(draft: readonly PlanItem[], saved: readonly PlanItem[]): number {
  const before = new Map(saved.map((item) => [item.id, item]));
  const now = new Set(draft.map((item) => item.id));
  const touched = draft.filter((item) => !sameJson(before.get(item.id), item)).length;
  const removed = saved.filter((item) => !now.has(item.id)).length;
  return touched + removed;
}

const entriesText = (count: number): string => `${count} ${count === 1 ? "Eintrag" : "Einträge"} geändert`;

/**
 * „3 Einträge geändert · Ebenen · Einstellungen“ — was sich gegenüber dem
 * zuletzt übernommenen Stand unterscheidet; `undefined`, wenn nichts.
 */
export function planChangesStatus(draft: PlanEditorValue, saved: PlanEditorValue): string | undefined {
  const a = draft.plan;
  const b = saved.plan;
  const items = changedItems(a.items, b.items);
  const parts = [
    ...(items > 0 ? [entriesText(items)] : []),
    ...(sameJson(a.lanes, b.lanes) ? [] : ["Ebenen"]),
    ...(sameJson(a.categories, b.categories) ? [] : ["Kategorien"]),
    ...(a.title !== b.title || !sameJson(a.view, b.view) || a.showToday !== b.showToday || a.allowExport !== b.allowExport
      ? ["Einstellungen"]
      : []),
  ];
  return parts.length === 0 ? undefined : parts.join(" · ");
}

/**
 * Gründe, den Plan nicht zu übernehmen. Der Editor erzeugt nur gültige Pläne;
 * das hier ist das Netz darunter: ein Meilenstein oder Zeitraum in einer
 * Ebene, die es nicht gibt, würde beim nächsten Lesen verworfen.
 */
export function validatePlan(draft: PlanEditorValue): readonly ValidationIssue[] {
  const lanes = new Set(draft.plan.lanes.map((lane) => lane.id));
  return draft.plan.items.flatMap((item) =>
    item.kind !== "deadline" && !lanes.has(item.lane)
      ? [{ id: item.id, message: `„${item.title}“: Die Ebene fehlt.` }]
      : [],
  );
}
