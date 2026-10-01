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
 * Was über einen Eintrag gesagt wird — im zugänglichen Namen, in den Details
 * und in der Liste gleich. Farbe trägt nie allein: die Kategorie steht immer
 * auch im Text.
 */

import { formatDate, formatDuration, formatShortDate } from "./format";
import { Plan, PlanItem, categoryOf, itemEndDay, itemStartDay } from "./plan-model";
import { KIND_LABELS } from "./plan-rows";

/** „1. Oktober 2025" bzw. „1. Januar 2028 – 30. Juni 2030". */
export function termText(item: PlanItem, locale: string): string {
  const start = formatDate(itemStartDay(item), locale);
  return item.kind === "bar" ? `${start} – ${formatDate(itemEndDay(item), locale)}` : start;
}

/** „01.10.2025" bzw. „01.01.2028 – 30.06.2030", für die Liste. */
export function shortTermText(item: PlanItem, locale: string): string {
  const start = formatShortDate(itemStartDay(item), locale);
  return item.kind === "bar" ? `${start} – ${formatShortDate(itemEndDay(item), locale)}` : start;
}

/** „Zeitraum · 1. Januar 2028 – 30. Juni 2030 (2 Jahre 6 Monate)". */
export function kindAndTerm(item: PlanItem, locale: string): string {
  const base = `${KIND_LABELS[item.kind]} · ${termText(item, locale)}`;
  return item.kind === "bar" ? `${base} (${formatDuration(itemStartDay(item), itemEndDay(item))})` : base;
}

/** „Meilenstein: 1. SOP TG Assist MY26, 1. Oktober 2025, Kategorie MY26 TG Assist, vorläufig". */
export function accessibleName(plan: Plan, item: PlanItem, locale: string): string {
  const parts = [`${KIND_LABELS[item.kind]}: ${item.title}`, termText(item, locale)];
  const category = categoryOf(plan, item);
  if (category !== undefined) parts.push(`Kategorie ${category.title}`);
  if (item.tentative) parts.push("vorläufig");
  return parts.join(", ");
}

/** Was ein Klick auf einen Eintrag mit Inhalt öffnet — Zusatz zum zugänglichen Namen. */
export function contentHint(item: PlanItem): string | undefined {
  if (item.content === undefined) return undefined;
  return item.content.kind === "page" ? "öffnet verknüpfte Seite" : "öffnet verknüpften Beitrag";
}
