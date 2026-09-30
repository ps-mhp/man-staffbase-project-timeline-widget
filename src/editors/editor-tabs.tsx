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
 * Reiter nach dem WAI-ARIA-Muster „Tabs“: ein Tab-Stopp für die ganze Leiste,
 * die Pfeiltasten wechseln den Reiter und nehmen den Fokus mit. Drei Knöpfe,
 * die nur wie Reiter aussähen, kosteten Tastaturnutzer:innen je einen Tab-Stopp
 * und verschwiegen dem Screenreader, welcher Bereich gerade offen ist.
 */

import * as React from "react";
import { KeyboardEvent, ReactElement, ReactNode, useId, useRef } from "react";

export interface TabDefinition<T extends string> {
  id: T;
  label: string;
}

export interface EditorTabsProps<T extends string> {
  tabs: readonly TabDefinition<T>[];
  active: T;
  onChange: (tab: T) => void;
  /** Name der Reiterleiste für Screenreader. */
  label: string;
  /** Der Inhalt des aktiven Reiters. */
  children: ReactNode;
}

function targetIndex(key: string, index: number, count: number): number | null {
  switch (key) {
    case "ArrowRight":
      return (index + 1) % count;
    case "ArrowLeft":
      return (index - 1 + count) % count;
    case "Home":
      return 0;
    case "End":
      return count - 1;
    default:
      return null;
  }
}

export function EditorTabs<T extends string>({
  tabs,
  active,
  onChange,
  label,
  children,
}: EditorTabsProps<T>): ReactElement {
  const base = useId();
  const buttons = useRef(new Map<T, HTMLButtonElement>());
  const tabId = (tab: T): string => `${base}-tab-${tab}`;
  const panelId = `${base}-panel`;

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    const index = tabs.findIndex((tab) => tab.id === active);
    const next = targetIndex(event.key, index, tabs.length);
    if (next === null) return;
    event.preventDefault();
    const tab = tabs[next].id;
    onChange(tab);
    buttons.current.get(tab)?.focus();
  };

  return (
    <div className="man-pt-editor__tabs">
      <div role="tablist" aria-label={label} className="man-pt-editor__tablist" onKeyDown={onKeyDown}>
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
              id={tabId(tab.id)}
              aria-selected={selected}
              aria-controls={selected ? panelId : undefined}
              tabIndex={selected ? 0 : -1}
              className={`man-pt-editor__tab${selected ? " man-pt-editor__tab--active" : ""}`}
              onClick={() => onChange(tab.id)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div role="tabpanel" id={panelId} aria-labelledby={tabId(active)} className="man-pt-editor__tabpanel">
        {children}
      </div>
    </div>
  );
}
