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
 * Die Legende — zugleich der Kategorien-Filter.
 *
 * Wer wissen will, wofür eine Farbe steht, schaut ohnehin hierher; dort auch
 * ausblenden zu können, spart ein Menü. Jeder Chip ist ein Umschalter
 * (`aria-pressed` = sichtbar). Im Editor ist die Legende nur Legende.
 */

import React, { ReactElement } from "react";

import { NO_CATEGORY } from "./plan-filter";
import { MilestoneSymbol, Plan, UNCATEGORIZED_COLOR } from "./plan-model";
import { SymbolGlyph } from "./symbol-glyph";
import { DEFAULT_SYMBOL } from "./symbols";

export interface CategoryLegendProps {
  plan: Plan;
  hidden: readonly string[];
  interactive: boolean;
  onToggle: (categoryId: string) => void;
  onShowAll: () => void;
}

interface Entry {
  id: string;
  title: string;
  color: string;
  symbol: MilestoneSymbol;
}

function entriesOf(plan: Plan): Entry[] {
  const known = new Set(plan.categories.map((category) => category.id));
  const entries: Entry[] = plan.categories.map(({ id, title, color, symbol }) => ({
    id,
    title,
    color,
    symbol: symbol ?? DEFAULT_SYMBOL,
  }));
  const hasUncategorized = plan.items.some((item) => item.category === undefined || !known.has(item.category));
  return hasUncategorized
    ? [...entries, { id: NO_CATEGORY, title: "Ohne Kategorie", color: UNCATEGORIZED_COLOR, symbol: DEFAULT_SYMBOL }]
    : entries;
}

export function CategoryLegend({ plan, hidden, interactive, onToggle, onShowAll }: CategoryLegendProps): ReactElement | null {
  const entries = entriesOf(plan);
  if (entries.length === 0) return null;

  // Form und Farbe zeigen, was der Plan zeigt — ein Punkt nennte nur die Farbe.
  const dot = (entry: Entry) => <SymbolGlyph symbol={entry.symbol} color={entry.color} className="man-pt__legend-symbol" />;

  if (!interactive) {
    return (
      // `role="list"` statt `ul`: das Seiten-Stylesheet zeichnet vor jedes `li`
      // einen roten Strich, der neben den Farbpunkten wie ein Fehler aussah.
      <div className="man-pt__legend" role="list" aria-label="Kategorien">
        {entries.map((entry) => (
          <span key={entry.id} role="listitem" className="man-pt__legend-entry">
            {dot(entry)}
            {entry.title}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="man-pt__legend" role="group" aria-label="Kategorien ein- und ausblenden">
      {entries.map((entry) => {
        const visible = !hidden.includes(entry.id);
        return (
          <button
            key={entry.id}
            type="button"
            className={`man-pt__chip${visible ? "" : " is-off"}`}
            aria-pressed={visible}
            onClick={() => onToggle(entry.id)}
          >
            {dot(entry)}
            {entry.title}
          </button>
        );
      })}
      {hidden.length > 0 && (
        <button type="button" className="man-pt__chip man-pt__chip--reset" onClick={onShowAll}>
          Alle
        </button>
      )}
    </div>
  );
}
