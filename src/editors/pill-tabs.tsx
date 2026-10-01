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
 * Ein Umschalter aus Pillen, je mit einer Zahl — über der Eintragsliste für
 * Meilensteine, Zeiträume und Stichtage.
 *
 * Er zeigt einen von mehreren Ausschnitten derselben Liste und ist deshalb
 * semantisch eine Reiterleiste: `tablist`/`tab`, jede Pille verweist auf die
 * Liste, die Pfeiltasten wechseln wie bei den übrigen Reitern. Nur das
 * Aussehen ist das von Pillen.
 */

import * as React from "react";
import { ReactElement } from "react";

import { tabId, useTabKeys } from "./editor-tabs";

export interface PillTab<T extends string> {
  id: T;
  label: string;
  count: number;
}

export interface PillTabsProps<T extends string> {
  /** Gemeinsamer Anfang der `id`s — die Liste nennt die aktive Pille in `aria-labelledby`. */
  base: string;
  tabs: readonly PillTab<T>[];
  active: T;
  onChange: (tab: T) => void;
  /** Name des Umschalters für Screenreader. */
  label: string;
  /** `id` der Liste, die der Umschalter filtert. */
  controls: string;
}

export function PillTabs<T extends string>({
  base,
  tabs,
  active,
  onChange,
  label,
  controls,
}: PillTabsProps<T>): ReactElement {
  const ids = tabs.map((tab) => tab.id);
  const { buttons, onKeyDown } = useTabKeys(ids, active, onChange);

  return (
    <div
      role="tablist"
      aria-label={label}
      className="man-pt-editor__pills"
      onKeyDown={onKeyDown}
    >
      {tabs.map((tab) => {
        const selected = tab.id === active;
        return (
          <button
            key={tab.id}
            ref={(element) => {
              if (element === null) buttons.current.delete(tab.id);
              else buttons.current.set(tab.id, element);
            }}
            type="button"
            role="tab"
            id={tabId(base, tab.id)}
            aria-selected={selected}
            aria-controls={controls}
            tabIndex={selected ? 0 : -1}
            className={`man-pt-editor__pill${selected ? " man-pt-editor__pill--active" : ""}`}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}{" "}
            <span className="man-pt-editor__pill-count">{tab.count}</span>
          </button>
        );
      })}
    </div>
  );
}
