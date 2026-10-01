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
 * Was der Editor am Plan ändern kann — als reine Funktionen.
 *
 * Jede nimmt einen Plan und gibt einen neuen zurück; das Original bleibt
 * unberührt. Der Dialog vergleicht Entwurf und gespeicherten Stand und muss
 * sich darauf verlassen können, dass eine Änderung nie den gespeicherten
 * Stand mitverändert.
 *
 * Jede Änderung hält das Modell gültig: was hier herauskommt, liest
 * `readPlanAttribute` ohne Verlust zurück. Was das nicht erfüllte — ein
 * leerer Titel, eine Ebene ohne Namen —, lassen die Funktionen gar nicht erst
 * durch und geben den Plan unverändert zurück. Es gibt also keinen
 * Zwischenzustand, den das Speichern stillschweigend verwerfen müsste.
 *
 * `now` ist nur für Tests da: jede Änderung setzt `updatedAt` auf heute.
 *
 * Hier stehen die Einträge und was alle Änderungen teilen; Ebenen,
 * Kategorien, Startansicht und der Beginn eines leeren Plans stehen in
 * `plan-structure-edits.ts`.
 */

import {
  Viewport,
  dayFromParts,
  formatIsoDate,
  lastDayOfMonth,
  monthOfDay,
  parseIsoDate,
  partsFromDay,
} from "../calendar";
import {
  BarItem,
  DeadlineItem,
  ItemKind,
  LIMITS,
  MilestoneItem,
  Plan,
  PlanItem,
  isLaneItem,
  newId,
  todayIso,
} from "../plan-model";

export const NEW_ITEM_TITLES: Readonly<Record<ItemKind, string>> = {
  milestone: "Neuer Meilenstein",
  bar: "Neuer Zeitraum",
  deadline: "Neuer Stichtag",
};

/** Ergebnis einer Änderung, die etwas anlegt: `id` ist `null`, wenn nichts angelegt wurde. */
export interface Created {
  plan: Plan;
  id: string | null;
}

/** Die gemeinsamen Felder aller Arten — was beim Wechsel der Art erhalten bleibt. */
type ItemCommon = Omit<DeadlineItem, "kind" | "date">;

const KIND_FIELDS = new Set([
  "kind",
  "lane",
  "date",
  "start",
  "end",
  "symbol",
  "arrow",
  "series",
]);

/** Ohne die genannten Felder — als neues Objekt. */
export function without<T extends object, K extends keyof T>(
  value: T,
  ...keys: K[]
): Omit<T, K> {
  const drop = new Set<PropertyKey>(keys);
  return Object.fromEntries(
    Object.entries(value).filter(([key]) => !drop.has(key)),
  ) as Omit<T, K>;
}

/**
 * Setzt ein optionales Feld oder lässt es ganz weg. Ein leeres Feld ist im
 * Attribut kein leerer Wert, sondern gar keiner — das Lesen verwürfe ihn
 * ohnehin, und das Attribut bliebe kleiner.
 */
export function withOptional<T extends object, K extends keyof T>(
  item: T,
  key: K,
  value: T[K] | undefined,
): T {
  return value === undefined
    ? (without(item, key) as T)
    : { ...item, [key]: value };
}

/** Stempelt das Stand-Datum; das Widget zeigt es als „Stand: …“. */
export function touch(plan: Plan, now: Date = new Date()): Plan {
  return { ...plan, updatedAt: todayIso(now) };
}

/**
 * Setzt die Überschrift über dem Plan. Ohne Leerraum am Rand, weil das Lesen
 * ihn ohnehin abschneidet; leer fällt sie ganz weg — dann steht keine da.
 */
export function setTitle(
  plan: Plan,
  title: string,
  now: Date = new Date(),
): Plan {
  const trimmed = title.trim();
  return touch(
    withOptional(plan, "title", trimmed === "" ? undefined : trimmed),
    now,
  );
}

/**
 * Das Ende eines neuen Zeitraums: einen Monat nach dem Beginn, einschließlich
 * gezählt, also ein Monat später minus ein Tag. Gibt es den Tag im Folgemonat
 * nicht (31. Januar), endet er am Monatsletzten — sonst liefe er über
 * `Date.UTC` bis in den März.
 */
export function defaultBarEnd(start: string): string {
  const { year, month, day } = partsFromDay(parseIsoDate(start) as number);
  const sameDayNextMonth = dayFromParts(year, month + 1, day);
  const nextMonth = monthOfDay(dayFromParts(year, month + 1, 1));
  return formatIsoDate(
    Math.min(sameDayNextMonth - 1, lastDayOfMonth(nextMonth)),
  );
}

/** Das Datum eines neuen Eintrags: die Mitte der Vorschau, damit er gleich zu sehen ist. */
export function newItemDate(
  viewport: Viewport | null,
  now: Date = new Date(),
): string {
  return viewport === null
    ? todayIso(now)
    : formatIsoDate(Math.floor((viewport.start + viewport.end) / 2));
}

// ---------------------------------------------------------------------------
// Einträge

/** Streicht die genannten Einträge aus allen Vorgängerlisten; eine leere Liste fällt weg. */
export function stripReferences(
  items: PlanItem[],
  removed: ReadonlySet<string>,
): PlanItem[] {
  return items.map((item) => {
    if (
      item.dependsOn === undefined ||
      !item.dependsOn.some((id) => removed.has(id))
    )
      return item;
    const kept = item.dependsOn.filter((id) => !removed.has(id));
    return withOptional(item, "dependsOn", kept.length > 0 ? kept : undefined);
  });
}

function createItem(
  kind: ItemKind,
  lane: string | undefined,
  date: string,
): PlanItem | null {
  const id = newId("item");
  const title = NEW_ITEM_TITLES[kind];
  if (kind === "deadline") return { id, kind, title, date };
  if (lane === undefined) return null;
  if (kind === "milestone") return { id, kind, lane, title, date };
  return { id, kind, lane, title, start: date, end: defaultBarEnd(date) };
}

/** Legt einen gültigen Eintrag an: Titel nach Art, in der ersten Ebene. */
export function addItem(
  plan: Plan,
  kind: ItemKind,
  date: string,
  now: Date = new Date(),
): Created {
  if (plan.items.length >= LIMITS.items) return { plan, id: null };
  const item = createItem(kind, plan.lanes[0]?.id, date);
  if (item === null) return { plan, id: null };
  return {
    plan: touch({ ...plan, items: [...plan.items, item] }, now),
    id: item.id,
  };
}

export function updateItem(
  plan: Plan,
  item: PlanItem,
  now: Date = new Date(),
): Plan {
  return touch(
    {
      ...plan,
      items: plan.items.map((entry) => (entry.id === item.id ? item : entry)),
    },
    now,
  );
}

/** Kopiert einen Eintrag gleich hinter das Original — dort sucht die Redaktion ihn. */
export function duplicateItem(
  plan: Plan,
  id: string,
  now: Date = new Date(),
): Created {
  const index = plan.items.findIndex((item) => item.id === id);
  if (index === -1 || plan.items.length >= LIMITS.items)
    return { plan, id: null };
  const original = plan.items[index];
  const copy: PlanItem = {
    ...original,
    id: newId("item"),
    title: `${original.title} (Kopie)`,
  };
  const items = [
    ...plan.items.slice(0, index + 1),
    copy,
    ...plan.items.slice(index + 1),
  ];
  return { plan: touch({ ...plan, items }, now), id: copy.id };
}

/** Löscht einen Eintrag samt allen Verweisen darauf; sonst zeigten Linien ins Leere. */
export function removeItem(
  plan: Plan,
  id: string,
  now: Date = new Date(),
): Plan {
  const items = plan.items.filter((item) => item.id !== id);
  return touch({ ...plan, items: stripReferences(items, new Set([id])) }, now);
}

function convert(
  item: PlanItem,
  kind: ItemKind,
  firstLane: string | undefined,
): PlanItem | null {
  const common = Object.fromEntries(
    Object.entries(item).filter(([key]) => !KIND_FIELDS.has(key)),
  ) as ItemCommon;
  const date = item.kind === "bar" ? item.start : item.date;
  if (kind === "deadline") {
    // Ein Stichtag hat keine Vorgänger: er läuft durch alle Ebenen und ist
    // mit keinem Eintrag verbunden.
    return { ...without(common, "dependsOn"), kind, date };
  }
  const lane = isLaneItem(item) ? item.lane : firstLane;
  if (lane === undefined) return null;
  const series = isLaneItem(item) ? item.series : undefined;
  const next: MilestoneItem | BarItem =
    kind === "milestone"
      ? { ...common, kind, lane, date }
      : {
          ...common,
          kind,
          lane,
          start: date,
          end: item.kind === "bar" ? item.end : defaultBarEnd(date),
        };
  return withOptional(next, "series", series);
}

/**
 * Wechselt die Art eines Eintrags und nimmt mit, was die neue Art kennt.
 *
 * Aus einem Meilenstein wird ein Zeitraum von einem Monat, aus einem Zeitraum
 * ein Meilenstein an seinem Beginn. Ein Stichtag verliert Ebene, Serie und
 * Vorgänger und verschwindet aus fremden Vorgängerlisten; umgekehrt landet er
 * in der ersten Ebene. Ohne Ebene bleibt ein Stichtag, was er ist.
 */
export function changeKind(
  plan: Plan,
  id: string,
  kind: ItemKind,
  now: Date = new Date(),
): Plan {
  const item = plan.items.find((entry) => entry.id === id);
  if (item === undefined || item.kind === kind) return plan;
  const converted = convert(item, kind, plan.lanes[0]?.id);
  if (converted === null) return plan;
  const items = plan.items.map((entry) =>
    entry.id === id ? converted : entry,
  );
  return touch(
    {
      ...plan,
      items:
        kind === "deadline" ? stripReferences(items, new Set([id])) : items,
    },
    now,
  );
}
