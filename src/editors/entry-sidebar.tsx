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
 * Die Seitenleiste: „Einträge 12 von 300“ mit „Neu“ als Menü (Meilenstein,
 * Zeitraum, Stichtag), darunter Suche und Auswahl der Art, dann die Liste
 * nach Termin.
 *
 * Nach Termin sortiert, nicht in der Reihenfolge des Attributs — so steht ein
 * Eintrag dort, wo die Redaktion ihn aus dem Zeitstrahl kennt. Deshalb ohne
 * Sortieren per Ziehen.
 */

import * as React from "react";
import { ReactElement, useId } from "react";
import { ArrowLeftRight, Diamond, Flag, Search } from "lucide-react";

import { Input } from "@man/config-ui/primitives/input";
import { ItemList, type ListItem } from "@man/config-ui/sidebar/item-list";
import { SidebarPanel, type SidebarAddOption } from "@man/config-ui/sidebar/sidebar-panel";

import { ItemKind, LIMITS, Plan, PlanItem, colorOf } from "../plan-model";
import { SymbolGlyph } from "../symbol-glyph";
import { symbolOf } from "../symbols";
import {
  EDITOR_LOCALE,
  ITEM_KINDS,
  KIND_LABELS,
  KIND_PLURALS,
  KindFilter,
  kindCounts,
  scheduleLabel,
  visibleItems,
} from "./plan-queries";
import { SelectBox } from "./select-field";

export interface EntrySidebarProps {
  plan: Plan;
  selectedId: string | null;
  kind: KindFilter;
  query: string;
  onKindChange: (kind: KindFilter) => void;
  onQueryChange: (query: string) => void;
  onSelect: (id: string) => void;
  /** Legt einen Eintrag der Art an. */
  onAdd: (kind: ItemKind) => void;
}

const ADD_OPTIONS: Readonly<Record<ItemKind, { description: string; icon: SidebarAddOption["icon"] }>> = {
  milestone: { description: "Ein Termin an einem Tag", icon: Diamond },
  bar: { description: "Von – bis, als Balken", icon: ArrowLeftRight },
  deadline: { description: "Läuft durch alle Ebenen", icon: Flag },
};

function describe(item: PlanItem): string {
  return [KIND_LABELS[item.kind], scheduleLabel(item, EDITOR_LOCALE), item.tentative === true ? "vorläufig" : null]
    .filter((part) => part !== null)
    .join(" · ");
}

function listItems(plan: Plan, items: readonly PlanItem[]): ListItem[] {
  return items.map((item) => ({
    id: item.id,
    label: item.title,
    description: describe(item),
    // Form und Farbe der Kategorie, damit man den Eintrag aus dem Zeitstrahl wiedererkennt.
    thumbnail: <SymbolGlyph symbol={symbolOf(plan, item)} color={colorOf(plan, item)} size={14} />,
  }));
}

export function EntrySidebar({
  plan,
  selectedId,
  kind,
  query,
  onKindChange,
  onQueryChange,
  onSelect,
  onAdd,
}: EntrySidebarProps): ReactElement {
  const searchId = useId();
  const needsLane = plan.lanes.length === 0;
  const visible = visibleItems(plan, kind, query);
  const counts = kindCounts(plan, query);
  const total = counts.milestone + counts.bar + counts.deadline;

  // Meilensteine und Zeiträume brauchen eine Ebene, in der sie stehen.
  const addMenu: SidebarAddOption[] = ITEM_KINDS.filter((entry) => entry === "deadline" || !needsLane).map((entry) => ({
    id: entry,
    label: KIND_LABELS[entry],
    description: ADD_OPTIONS[entry].description,
    icon: ADD_OPTIONS[entry].icon,
    onSelect: () => onAdd(entry),
  }));

  return (
    <SidebarPanel title="Einträge" count={plan.items.length} max={LIMITS.items} addMenu={addMenu}>
      <div className="sticky top-0 z-10 flex flex-col gap-2 bg-muted px-2 pt-1 pb-2">
        <div className="relative">
          <label htmlFor={searchId} className="sr-only">
            Einträge durchsuchen
          </label>
          <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id={searchId}
            type="search"
            className="h-10 bg-background pl-9"
            placeholder="Einträge durchsuchen"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
          />
        </div>
        <div className="flex items-center justify-between gap-3">
          <SelectBox
            aria-label="Art filtern"
            className="min-w-[150px]"
            value={kind}
            onChange={(event) => onKindChange(event.target.value as KindFilter)}
          >
            <option value="all">{`Alle Arten (${total})`}</option>
            {ITEM_KINDS.map((entry) => (
              <option key={entry} value={entry}>{`${KIND_PLURALS[entry]} (${counts[entry]})`}</option>
            ))}
          </SelectBox>
          <span className="shrink-0 text-[13px] text-muted-foreground">nach Datum</span>
        </div>
        {needsLane && (
          <p className="text-[13px] text-muted-foreground">
            Meilensteine und Zeiträume brauchen eine Ebene. Ebenen entstehen rechts im Reiter „Ebenen“.
          </p>
        )}
      </div>
      <ItemList
        aria-label="Einträge"
        items={listItems(plan, visible)}
        selectedId={selectedId}
        onSelect={onSelect}
        emptyState={plan.items.length === 0 ? "Noch keine Einträge. „Neu“ legt einen an." : "Kein Eintrag passt zur Suche."}
      />
    </SidebarPanel>
  );
}
