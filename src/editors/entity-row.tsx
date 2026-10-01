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
 * Eine Zeile im Reiter „Ebenen“ oder „Kategorien“, einzeilig:
 * [Farbe] · Name · Zahl der Einträge · ↑ · ↓ · Löschen. Beide Reiter sehen
 * gleich aus und bedienen sich gleich; der Unterschied steckt in dem, was sie
 * mit den Knöpfen tun.
 */

import * as React from "react";
import { ReactElement, ReactNode } from "react";

import { DraftField } from "./draft-field";
import { validateName } from "./entity-names";
import { countLabel } from "./plan-queries";

export interface EntityRowProps {
  /** „Ebene“ oder „Kategorie“ — für die zugänglichen Namen der Knöpfe. */
  noun: "Ebene" | "Kategorie";
  /** Die Namen aller Geschwister — ein neuer Name muss sich unterscheiden. */
  existing: readonly string[];
  /** Position ab 1, damit die Namensfelder unterscheidbar heißen. */
  position: number;
  title: string;
  count: number;
  isFirst: boolean;
  isLast: boolean;
  autoFocus: boolean;
  onRename: (title: string) => void;
  onMove: (offset: -1 | 1) => void;
  onRemove: () => void;
  /** Was vor dem Namen steht, etwa die Farbe einer Kategorie. */
  leading?: ReactNode;
}

export function EntityRow({
  noun,
  existing,
  position,
  title,
  count,
  isFirst,
  isLast,
  autoFocus,
  onRename,
  onMove,
  onRemove,
  leading,
}: EntityRowProps): ReactElement {
  const name = `${noun} „${title}“`;
  return (
    <li className="man-pt-editor__entity">
      {leading}
      <DraftField
        label={`Name der ${noun} ${position}`}
        hideLabel
        value={title}
        validate={validateName(noun, existing, title)}
        onCommit={onRename}
        autoFocus={autoFocus}
        className="man-pt-editor__entity-name"
      />
      <span className="man-pt-editor__entity-count">{countLabel(count)}</span>
      {/* Pfeile statt „Nach oben“: drei Wörter je Zeile drängten den Namen
          zusammen. Der zugängliche Name sagt, was sie tun und woran. */}
      <button
        type="button"
        className="man-pt-editor__button man-pt-editor__button--icon"
        aria-label={`${name} nach oben`}
        disabled={isFirst}
        onClick={() => onMove(-1)}
      >
        <span aria-hidden="true">↑</span>
      </button>
      <button
        type="button"
        className="man-pt-editor__button man-pt-editor__button--icon"
        aria-label={`${name} nach unten`}
        disabled={isLast}
        onClick={() => onMove(1)}
      >
        <span aria-hidden="true">↓</span>
      </button>
      <button
        type="button"
        className="man-pt-editor__button"
        aria-label={`${name} löschen`}
        onClick={onRemove}
      >
        Löschen
      </button>
    </li>
  );
}
