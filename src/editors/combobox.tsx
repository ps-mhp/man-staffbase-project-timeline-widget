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
 * Ein Auswahlfeld mit Vorschlägen nach dem ARIA-1.2-Muster „Combobox“:
 * ein Eingabefeld, das eine Liste aufklappt, und ein Pfeil daneben, der sie
 * auch öffnet. Man wählt einen Vorschlag oder tippt einen neuen Wert.
 *
 * `<datalist>` konnte beides nicht richtig: ohne Pfeil sah es nicht wie eine
 * Auswahl aus, und die Vorschläge erschienen je nach Browser erst beim Tippen.
 *
 * Tab und ein Klick daneben übernehmen den getippten Text, nicht den gerade
 * markierten Vorschlag — wer weiterspringt, soll nicht stillschweigend etwas
 * anderes gespeichert finden, als dasteht. Esc stellt den vorherigen Wert
 * wieder her. Die Liste liegt im Modal, nicht in einem Portal (siehe
 * `confirm-dialog.tsx`), und kippt nach oben, wenn unten kein Platz ist.
 */

import * as React from "react";
import {
  FocusEvent,
  KeyboardEvent,
  ReactElement,
  ReactNode,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import {
  ComboboxOption,
  Suggestion,
  comboboxOptions,
  resolveTyped,
} from "./combobox-options";
import { scrollIntoContainer } from "./scroll-into-container";

export interface ComboboxProps {
  label: string;
  /** Der gespeicherte Wert; leer heißt: keiner. */
  value: string;
  suggestions: readonly Suggestion[];
  /** Erhält den neuen Wert, leer zum Entfernen. */
  onChange: (value: string) => void;
  /** Die Option, die den Wert entfernt, etwa „Keine Serie“. */
  noneLabel: string;
  /** Die Option für einen neuen Wert, etwa „„X“ als neue Serie anlegen“. */
  createLabel: (text: string) => string;
  /** Der Zusatz hinter einem Vorschlag, etwa „3 Einträge“. */
  describe: (suggestion: Suggestion) => string;
  hint?: string;
}

function highlight(text: string, match: [number, number] | null): ReactNode {
  if (match === null) return text;
  const [start, end] = match;
  return (
    <>
      {text.slice(0, start)}
      <mark className="man-pt-editor__match">{text.slice(start, end)}</mark>
      {text.slice(end)}
    </>
  );
}

function optionContent(
  option: ComboboxOption,
  props: ComboboxProps,
): ReactNode {
  if (option.type === "none") return props.noneLabel;
  if (option.type === "create") return props.createLabel(option.value);
  return (
    <>
      {highlight(option.value, option.match)}
      <span className="man-pt-editor__meta">
        {" · "}
        {props.describe(option)}
      </span>
    </>
  );
}

interface ListFit {
  placement: "below" | "above";
  /** Nur gesetzt, wenn die Liste auf keiner Seite ganz Platz hat. */
  maxHeight?: number;
}

/** So niedrig wird die Liste nie — drei Vorschläge sollen zu sehen sein. */
const MIN_LIST_HEIGHT = 96;

/**
 * Wohin die Liste klappt: nach unten, wenn sie dort Platz hat, sonst nach
 * oben; passt sie nirgends ganz, auf die Seite mit mehr Platz und so niedrig,
 * dass sie hineinpasst — sie rollt dann selbst. Gemessen am rollenden
 * Bereich, der sie sonst abschnitte.
 */
function fitList(list: HTMLElement): ListFit {
  const scroller = list.closest<HTMLElement>(".man-pt-editor__pane-body");
  const anchor = list.parentElement;
  if (scroller === null || anchor === null) return { placement: "below" };
  const box = scroller.getBoundingClientRect();
  const field = anchor.getBoundingClientRect();
  const wanted = list.getBoundingClientRect().height;
  const below = box.bottom - field.bottom - 4;
  const above = field.top - box.top - 4;
  if (below >= wanted) return { placement: "below" };
  if (above >= wanted) return { placement: "above" };
  const placement = below >= above ? "below" : "above";
  return {
    placement,
    maxHeight: Math.max(MIN_LIST_HEIGHT, placement === "below" ? below : above),
  };
}

/** Der Text im Feld: folgt dem gespeicherten Wert, solange niemand tippt. */
function useFieldText(value: string): [string, (text: string) => void] {
  const [text, setText] = useState(value);
  const [synced, setSynced] = useState(value);
  if (value !== synced) {
    setSynced(value);
    setText(value);
  }
  return [text, setText];
}

export function Combobox(props: ComboboxProps): ReactElement {
  const { label, value, suggestions, onChange, hint } = props;
  const inputId = useId();
  const listId = useId();
  const hintId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [text, setText] = useFieldText(value);
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState(false);
  const [active, setActive] = useState(-1);
  const [fit, setFit] = useState<ListFit>({ placement: "below" });

  const options = comboboxOptions(text, typed, value, suggestions);
  const expanded = open && options.length > 0;
  const optionId = (index: number): string => `${listId}-option-${index}`;

  useLayoutEffect(() => {
    setFit(
      expanded && listRef.current !== null
        ? fitList(listRef.current)
        : { placement: "below" },
    );
  }, [expanded]);

  useEffect(() => {
    const list = listRef.current;
    const option =
      active >= 0 ? document.getElementById(optionId(active)) : null;
    if (list !== null && option !== null) scrollIntoContainer(list, option);
  });

  const openList = (): void => {
    if (open) return;
    setOpen(true);
    setTyped(false);
    setActive(-1);
  };

  const close = (): void => {
    setOpen(false);
    setTyped(false);
    setActive(-1);
  };

  const commit = (next: string): void => {
    setText(next);
    if (next !== value) onChange(next);
    close();
  };

  const choose = (option: ComboboxOption): void =>
    commit(option.type === "none" ? "" : option.value);

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!open) openList();
        setActive(Math.min(options.length - 1, active + 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        setActive(Math.max(0, active - 1));
        break;
      case "Enter":
        event.preventDefault();
        if (expanded && active >= 0) choose(options[active]);
        else commit(resolveTyped(text, suggestions));
        break;
      case "Escape":
        if (!open) return;
        // Sonst schlösse dieselbe Taste auch das Modal dahinter.
        event.preventDefault();
        event.stopPropagation();
        setText(value);
        close();
        break;
      default:
    }
  };

  // Tab und Klick daneben: der Text zählt, wie er dasteht.
  const onBlur = (event: FocusEvent<HTMLInputElement>): void => {
    const next = event.relatedTarget;
    if (next instanceof Node && rootRef.current?.contains(next)) return;
    commit(resolveTyped(text, suggestions));
  };

  return (
    <div className="man-pt-editor__field">
      <label className="man-pt-editor__label" htmlFor={inputId}>
        {label}
      </label>
      <div ref={rootRef} className="man-pt-editor__combobox">
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          role="combobox"
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={expanded}
          aria-controls={listId}
          aria-activedescendant={
            expanded && active >= 0 ? optionId(active) : undefined
          }
          aria-describedby={hint === undefined ? undefined : hintId}
          className="man-pt-editor__input man-pt-editor__combobox-input"
          value={text}
          onFocus={openList}
          onClick={openList}
          onChange={(event) => {
            setText(event.target.value);
            setTyped(true);
            setOpen(true);
            setActive(-1);
          }}
          onKeyDown={onKeyDown}
          onBlur={onBlur}
        />
        <button
          type="button"
          tabIndex={-1}
          aria-label={`Vorschläge für „${label}“ zeigen`}
          className="man-pt-editor__button man-pt-editor__button--icon man-pt-editor__combobox-toggle"
          // Der Fokus bleibt im Feld; sonst übernähme sein Verlassen den Text.
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => {
            inputRef.current?.focus();
            if (open) close();
            else openList();
          }}
        >
          <span aria-hidden="true" className="man-pt-editor__chevron" />
        </button>
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label={label}
          hidden={!expanded}
          className={`man-pt-editor__listbox man-pt-editor__listbox--${fit.placement}`}
          style={
            fit.maxHeight === undefined
              ? undefined
              : { maxHeight: fit.maxHeight }
          }
        >
          {options.map((option, index) => (
            <li
              key={
                option.type === "none"
                  ? "none"
                  : `${option.type}:${option.value}`
              }
              id={optionId(index)}
              role="option"
              aria-selected={index === active}
              className={`man-pt-editor__option man-pt-editor__option--${option.type}${index === active ? " man-pt-editor__option--active" : ""}`}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => choose(option)}
            >
              {optionContent(option, props)}
            </li>
          ))}
        </ul>
      </div>
      {hint !== undefined && (
        <p id={hintId} className="man-pt-editor__hint">
          {hint}
        </p>
      )}
    </div>
  );
}
