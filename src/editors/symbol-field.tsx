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
 * Die Form der Meilensteine einer Kategorie: acht Formen als Optionsgruppe
 * nach dem WAI-ARIA-Muster „Radio Group“ — ein Tab-Stopp, die Pfeiltasten
 * wählen die nächste Form.
 *
 * Knöpfe mit `role="radio"` statt Optionsfeldern: gezeichnet wird die Form
 * selbst (`SymbolGlyph`), und ein Knopf lässt sich dafür frei gestalten. Die
 * Knöpfe tragen die Klasse der Editor-Knöpfe und damit ihre Abwehr gegen die
 * Knopffarben der Staffbase-App.
 */

import * as React from "react";
import { KeyboardEvent, ReactElement, useId, useRef } from "react";

import { MILESTONE_SYMBOLS, MilestoneSymbol } from "../plan-model";
import { SymbolGlyph } from "../symbol-glyph";
import { SYMBOL_LABELS } from "../symbols";

export interface SymbolFieldProps {
  label: string;
  value: MilestoneSymbol;
  /** Die Farbe, in der die Formen gezeichnet werden — die der Kategorie. */
  color: string;
  onChange: (symbol: MilestoneSymbol) => void;
}

const STEPS: Readonly<Record<string, number>> = {
  ArrowRight: 1,
  ArrowDown: 1,
  ArrowLeft: -1,
  ArrowUp: -1,
};

export function SymbolField({
  label,
  value,
  color,
  onChange,
}: SymbolFieldProps): ReactElement {
  const labelId = useId();
  const buttons = useRef(new Map<MilestoneSymbol, HTMLButtonElement>());

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    const count = MILESTONE_SYMBOLS.length;
    const index = MILESTONE_SYMBOLS.indexOf(value);
    let next: number | null = null;
    if (event.key in STEPS) next = (index + STEPS[event.key] + count) % count;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = count - 1;
    if (next === null) return;
    event.preventDefault();
    const symbol = MILESTONE_SYMBOLS[next];
    onChange(symbol);
    buttons.current.get(symbol)?.focus();
  };

  return (
    <div className="man-pt-editor__symbols-field">
      <span id={labelId} className="man-pt-editor__label">
        {label}
      </span>
      <div
        role="radiogroup"
        aria-labelledby={labelId}
        className="man-pt-editor__symbols"
        onKeyDown={onKeyDown}
      >
        {MILESTONE_SYMBOLS.map((symbol) => {
          const checked = symbol === value;
          return (
            <button
              key={symbol}
              ref={(element) => {
                if (element === null) buttons.current.delete(symbol);
                else buttons.current.set(symbol, element);
              }}
              type="button"
              role="radio"
              aria-checked={checked}
              aria-label={SYMBOL_LABELS[symbol]}
              title={SYMBOL_LABELS[symbol]}
              tabIndex={checked ? 0 : -1}
              className={`man-pt-editor__button man-pt-editor__button--icon man-pt-editor__symbol${checked ? " man-pt-editor__symbol--checked" : ""}`}
              onClick={() => onChange(symbol)}
            >
              <SymbolGlyph symbol={symbol} color={color} size={16} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
