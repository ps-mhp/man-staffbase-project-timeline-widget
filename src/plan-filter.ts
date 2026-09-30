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
 * Was Leser:innen vom Plan sehen wollen.
 *
 * Frei von DOM und React, damit Ansicht, Listenansicht und Export-Dialog
 * dieselbe Antwort bekommen — sonst zählte der Dialog „12 Einträge" und die
 * Datei enthielte elf.
 *
 * Die Suche steht bewusst neben den übrigen Filtern: Treffer werden in der
 * Ansicht nur hervorgehoben, nicht entfernt, damit der Plan beim Tippen nicht
 * springt. Erst der Export der aktuellen Ansicht nimmt nur die Treffer.
 */

import { DayRange, Viewport } from "./calendar";
import { formatMonthYear } from "./format";
import { Plan, PlanItem, categoryOf, isLaneItem, itemEndDay, itemStartDay } from "./plan-model";

/**
 * Schlüssel für „ohne Kategorie" in `hiddenCategories`. Leer, weil keine
 * gültige Kategorie eine leere `id` haben kann — das Lesen verwirft sie.
 */
export const NO_CATEGORY = "";

export interface PlanFilter {
  hiddenCategories: readonly string[];
  hiddenLanes: readonly string[];
  /** Einschließlich; null = kein Zeitraum-Filter. */
  period: DayRange | null;
  query: string;
}

export const EMPTY_FILTER: PlanFilter = Object.freeze({
  hiddenCategories: Object.freeze([]),
  hiddenLanes: Object.freeze([]),
  period: null,
  query: "",
});

export type ExportScope = "view" | "all";

const NO_CATEGORY_LABEL = "Ohne Kategorie";

/** Wie viele Filter aktiv sind — je Dimension einer, für die Zahl am Filter-Knopf. */
export function activeFilterCount(filter: PlanFilter): number {
  return [
    filter.hiddenCategories.length > 0,
    filter.hiddenLanes.length > 0,
    filter.period !== null,
    normalizeText(filter.query) !== "",
  ].filter(Boolean).length;
}

/**
 * Macht Text vergleichbar: ohne Akzente, klein, Leerraum gefaltet. Wer „Cafe"
 * tippt, soll „Café" finden; Umlaute zerfallen in NFD ebenso in Grundbuchstabe
 * und Zeichen, „Öl" findet sich also auch als „ol".
 */
export function normalizeText(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

/** Die Kategorie eines Eintrags als Filter-Schlüssel; unbekannte zählen als „ohne". */
const categoryKey = (plan: Plan, item: PlanItem): string => categoryOf(plan, item)?.id ?? NO_CATEGORY;

/**
 * Kategorie, Ebene und Zeitraum — ohne Suche. Stichtage gehören zu keiner
 * Ebene und laufen durch alle; ein Ebenen-Filter ließe sie sonst mit der
 * letzten Ebene verschwinden, obwohl sie für jede gelten.
 */
export function itemPassesFilter(plan: Plan, item: PlanItem, filter: PlanFilter): boolean {
  if (filter.hiddenCategories.includes(categoryKey(plan, item))) return false;
  if (isLaneItem(item) && filter.hiddenLanes.includes(item.lane)) return false;
  if (filter.period !== null) {
    const { start, end } = filter.period;
    if (itemStartDay(item) > end || itemEndDay(item) < start) return false;
  }
  return true;
}

export function filterItems(plan: Plan, filter: PlanFilter): PlanItem[] {
  return plan.items.filter((item) => itemPassesFilter(plan, item, filter));
}

/** Alles, worin die Suche schaut, als ein vergleichbarer Text. */
function haystack(plan: Plan, item: PlanItem): string {
  const parts = [item.title, item.description ?? "", categoryOf(plan, item)?.title ?? ""];
  if (isLaneItem(item)) {
    parts.push(plan.lanes.find((lane) => lane.id === item.lane)?.title ?? "", item.series ?? "");
  }
  // Getrennt durch Leerraum, damit kein Wort über eine Feldgrenze hinweg entsteht.
  return normalizeText(parts.join("\n"));
}

/** Leere Suche → true. Alle Wörter müssen vorkommen, in welchem Feld auch immer. */
export function matchesQuery(plan: Plan, item: PlanItem, query: string): boolean {
  const words = normalizeText(query).split(" ").filter((word) => word !== "");
  if (words.length === 0) return true;
  const text = haystack(plan, item);
  return words.every((word) => text.includes(word));
}

/**
 * Überschneidet [itemStart, itemEnd + 1) den halboffenen Ausschnitt? Ein
 * Eintrag belegt seinen letzten Tag ganz; ein Ausschnitt, der mittags an
 * diesem Tag beginnt, zeigt ihn also noch.
 */
export function itemIntersects(item: PlanItem, range: Viewport): boolean {
  return itemStartDay(item) < range.end && itemEndDay(item) + 1 > range.start;
}

/** view: filterItems ∩ Ausschnitt ∩ Suchtreffer (falls Suche aktiv); all: alle. */
export function exportItems(plan: Plan, filter: PlanFilter, viewport: Viewport, scope: ExportScope): PlanItem[] {
  if (scope === "all") return [...plan.items];
  return filterItems(plan, filter).filter(
    (item) => itemIntersects(item, viewport) && matchesQuery(plan, item, filter.query),
  );
}

/**
 * Die Titel der ausgeblendeten Einträge einer Liste, in der Reihenfolge des
 * Plans — so, wie die Chips und Kästchen im Widget stehen, nicht in der
 * Reihenfolge, in der jemand geklickt hat.
 */
const hiddenTitles = (list: readonly { id: string; title: string }[], hidden: readonly string[]): string[] =>
  list.filter((entry) => hidden.includes(entry.id)).map((entry) => entry.title);

/** Aktive Filter in Worten für Blatt „Info"; leer ohne Filter. */
export function describeFilter(plan: Plan, filter: PlanFilter, locale: string): string[] {
  const lines: string[] = [];

  const categories = hiddenTitles(plan.categories, filter.hiddenCategories);
  // „Ohne Kategorie" steht als eigener Chip hinter den Kategorien des Plans.
  const allCategories = filter.hiddenCategories.includes(NO_CATEGORY) ? [...categories, NO_CATEGORY_LABEL] : categories;
  if (allCategories.length > 0) lines.push(`Ausgeblendete Kategorien: ${allCategories.join(", ")}`);

  const lanes = hiddenTitles(plan.lanes, filter.hiddenLanes);
  if (lanes.length > 0) lines.push(`Ausgeblendete Ebenen: ${lanes.join(", ")}`);

  if (filter.period !== null) {
    const from = formatMonthYear(filter.period.start, locale);
    const to = formatMonthYear(filter.period.end, locale);
    lines.push(`Zeitraum: ${from} bis ${to}`);
  }

  // Die Suche so, wie sie getippt wurde, nur mit gefaltetem Leerraum; ob sie
  // aktiv ist, entscheidet dieselbe Prüfung wie bei der Zahl am Filter-Knopf.
  if (normalizeText(filter.query) !== "") lines.push(`Suche: „${filter.query.replace(/\s+/g, " ").trim()}“`);

  return lines;
}
