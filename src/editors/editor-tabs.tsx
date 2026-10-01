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
 *
 * `EditorTabs` ist die Hauptebene: Leiste und der Inhalt des aktiven Reiters.
 * `TabList` und `TabPanel` einzeln braucht das Formular des Eintrags: dort
 * steht die Leiste im festen Kopf, die Inhalte rollen darunter, und alle
 * bleiben gemountet — sonst gingen beim Wechsel Entwürfe und Fehler verloren.
 */

import * as React from "react";
import {
  KeyboardEvent,
  ReactElement,
  ReactNode,
  RefObject,
  useId,
  useRef,
} from "react";

export interface TabDefinition<T extends string> {
  id: T;
  label: string;
  /**
   * Hält der Reiter eine ungültige Eingabe? Dann trägt er einen Marker, und
   * sein zugänglicher Name sagt es.
   */
  invalid?: boolean;
}

export const tabId = (base: string, tab: string): string =>
  `${base}-tab-${tab}`;
export const panelId = (base: string, tab: string): string =>
  `${base}-panel-${tab}`;

/** Wohin eine Taste in einer Reihe von `count` Reitern führt, oder `null`. */
export function targetIndex(
  key: string,
  index: number,
  count: number,
): number | null {
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

/**
 * Pfeiltasten, Pos1 und Ende für eine Reiterleiste: wechselt den Reiter und
 * nimmt den Fokus mit.
 */
export function useTabKeys<T extends string>(
  ids: readonly T[],
  active: T,
  onChange: (tab: T) => void,
): {
  buttons: RefObject<Map<T, HTMLButtonElement>>;
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
} {
  const buttons = useRef(new Map<T, HTMLButtonElement>());
  const onKeyDown = (event: KeyboardEvent<HTMLElement>): void => {
    const next = targetIndex(event.key, ids.indexOf(active), ids.length);
    if (next === null) return;
    event.preventDefault();
    onChange(ids[next]);
    buttons.current.get(ids[next])?.focus();
  };
  return { buttons, onKeyDown };
}

export interface TabListProps<T extends string> {
  /** Gemeinsamer Anfang der `id`s von Reitern und Inhalten. */
  base: string;
  tabs: readonly TabDefinition<T>[];
  active: T;
  onChange: (tab: T) => void;
  /** Name der Reiterleiste für Screenreader. */
  label: string;
  /** `sub`: die kleinere zweite Ebene im Formular. */
  variant?: "main" | "sub";
  /** Sind alle Inhalte gemountet? Nur dann verweist jeder Reiter auf seinen. */
  allPanels?: boolean;
}

export function TabList<T extends string>({
  base,
  tabs,
  active,
  onChange,
  label,
  variant = "main",
  allPanels = false,
}: TabListProps<T>): ReactElement {
  const ids = tabs.map((tab) => tab.id);
  const { buttons, onKeyDown } = useTabKeys(ids, active, onChange);
  const modifier = variant === "sub" ? " man-pt-editor__tablist--sub" : "";

  return (
    <div
      role="tablist"
      aria-label={label}
      className={`man-pt-editor__tablist${modifier}`}
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
            aria-controls={
              selected || allPanels ? panelId(base, tab.id) : undefined
            }
            tabIndex={selected ? 0 : -1}
            // Der Marker allein wäre nur zu sehen; der Name sagt es in Worten.
            aria-label={
              tab.invalid === true ? `${tab.label}, enthält Fehler` : undefined
            }
            className={`man-pt-editor__tab${selected ? " man-pt-editor__tab--active" : ""}`}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
            {tab.invalid === true && (
              <span className="man-pt-editor__tab-marker" aria-hidden="true" />
            )}
          </button>
        );
      })}
    </div>
  );
}

export interface TabPanelProps {
  base: string;
  tab: string;
  active: boolean;
  className?: string;
  children: ReactNode;
}

/** Der Inhalt eines Reiters; verborgen, aber gemountet, solange er nicht aktiv ist. */
export function TabPanel({
  base,
  tab,
  active,
  className,
  children,
}: TabPanelProps): ReactElement {
  return (
    <div
      role="tabpanel"
      id={panelId(base, tab)}
      aria-labelledby={tabId(base, tab)}
      hidden={!active}
      className={className}
    >
      {children}
    </div>
  );
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

export function EditorTabs<T extends string>({
  tabs,
  active,
  onChange,
  label,
  children,
}: EditorTabsProps<T>): ReactElement {
  const base = useId();
  return (
    <div className="man-pt-editor__tabs">
      <TabList
        base={base}
        tabs={tabs}
        active={active}
        onChange={onChange}
        label={label}
      />
      <TabPanel
        base={base}
        tab={active}
        active
        className="man-pt-editor__tabpanel"
      >
        {children}
      </TabPanel>
    </div>
  );
}
