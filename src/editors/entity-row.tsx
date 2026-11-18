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
 * Eine Zeile im Reiter „Ebenen“ oder „Kategorien“ des Panels: oben
 * [Farbe] [Form] · Name, darunter die Zahl der Einträge und die Knöpfe
 * ↑ · ↓ · Löschen. Beide Reiter sehen gleich aus und bedienen sich gleich; der
 * Unterschied steckt in dem, was sie mit den Knöpfen tun.
 */

import * as React from "react";
import { ReactElement, ReactNode } from "react";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";

import { Button } from "@man/config-ui/primitives/button";

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

const ICON_BUTTON = "text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-ring/40";

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
    <li className="flex flex-col gap-1.5 rounded-lg border bg-background p-2.5">
      <div className="flex items-center gap-2">
        {leading}
        <DraftField
          label={`Name der ${noun} ${position}`}
          hideLabel
          value={title}
          validate={validateName(noun, existing, title)}
          onCommit={onRename}
          autoFocus={autoFocus}
          className="flex-1"
        />
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[13px] text-muted-foreground">{countLabel(count)}</span>
        {/* Pfeile statt „Nach oben“: der zugängliche Name sagt, was sie tun und woran. */}
        <div className="flex items-center gap-0.5">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className={ICON_BUTTON}
            aria-label={`${name} nach oben`}
            title={`${name} nach oben`}
            disabled={isFirst}
            onClick={() => onMove(-1)}
          >
            <ChevronUp aria-hidden />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className={ICON_BUTTON}
            aria-label={`${name} nach unten`}
            title={`${name} nach unten`}
            disabled={isLast}
            onClick={() => onMove(1)}
          >
            <ChevronDown aria-hidden />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className={`${ICON_BUTTON} text-destructive hover:text-destructive`}
            aria-label={`${name} löschen`}
            title={`${name} löschen`}
            onClick={onRemove}
          >
            <Trash2 aria-hidden />
          </Button>
        </div>
      </div>
    </li>
  );
}
