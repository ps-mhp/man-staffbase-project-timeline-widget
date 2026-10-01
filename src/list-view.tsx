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
 * Der Plan als Tabelle.
 *
 * Die vollwertige Alternative zum Zeitstrahl: für Screenreader, für schmale
 * Bildschirme und zum Drucken. Sie zeigt dieselben Zeilen wie der Export,
 * nur nach Termin sortiert.
 */

import React, { ReactElement } from "react";

import { formatShortDate } from "./format";
import { Plan, PlanItem } from "./plan-model";
import { PlanRow, rowsByDate } from "./plan-rows";
import { SymbolGlyph } from "./symbol-glyph";
import { DEFAULT_SYMBOL, symbolOf } from "./symbols";

export interface ListViewProps {
  plan: Plan;
  items: readonly PlanItem[];
  locale: string;
  /** Bei aktiver Suche die Treffer; `null`, solange nicht gesucht wird. */
  matches: ReadonlySet<string> | null;
  /** Öffnet den verknüpften Inhalt eines Eintrags im Modal. */
  onOpenContent?: (id: string) => void;
}

function term(row: PlanRow, locale: string): string {
  const start = formatShortDate(row.start, locale);
  return row.end === null ? start : `${start} – ${formatShortDate(row.end, locale)}`;
}

export function ListView({ plan, items, locale, matches, onOpenContent }: ListViewProps): ReactElement {
  const shown = matches === null ? items : items.filter((item) => matches.has(item.id));
  const rows = rowsByDate(plan, shown);
  const symbols = new Map(shown.map((item) => [item.id, symbolOf(plan, item)]));
  return (
    <div className="man-pt__list-wrap">
      <table className="man-pt__list">
        <caption className="man-pt__visually-hidden">Einträge des Plans, nach Termin sortiert</caption>
        <thead>
          <tr>
            <th scope="col">Termin</th>
            <th scope="col">Titel</th>
            <th scope="col">Kategorie</th>
            <th scope="col">Ebene</th>
            <th scope="col">Art</th>
            <th scope="col">Inhalt</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td className="man-pt__list-term">{term(row, locale)}</td>
              <th scope="row">
                {row.title}
                {row.tentative && <span className="man-pt__tag">vorläufig</span>}
              </th>
              <td>
                <SymbolGlyph symbol={symbols.get(row.id) ?? DEFAULT_SYMBOL} color={row.color} className="man-pt__legend-symbol" />
                {row.category === "" ? "Ohne Kategorie" : row.category}
              </td>
              <td>{row.lane}</td>
              <td>{row.kindLabel}</td>
              <td>
                {row.content !== null && onOpenContent !== undefined && (
                  <button
                    type="button"
                    className="man-pt__button man-pt__button--compact"
                    aria-label={`${row.content.label} öffnen: ${row.title}`}
                    onClick={() => onOpenContent(row.id)}
                  >
                    {row.content.label} öffnen
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && <p className="man-pt__empty">Keine Einträge für diese Filter</p>}
    </div>
  );
}
