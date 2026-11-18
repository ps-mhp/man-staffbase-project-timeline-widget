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
 * Eine Ebene oder Kategorie anlegen, ohne das Formular des Eintrags zu
 * verlassen: ein Popover am Auswahlfeld mit den Pflichtfeldern. Wer beim
 * Einordnen merkt, dass die passende Ebene fehlt, soll nicht erst in einen
 * anderen Reiter wechseln und den Eintrag danach wiederfinden müssen.
 */

import * as React from "react";
import { KeyboardEvent, ReactElement, useId, useRef, useState } from "react";

import { Field } from "@man/config-ui/form/field";
import { Button } from "@man/config-ui/primitives/button";
import { Input } from "@man/config-ui/primitives/input";

import { MilestoneSymbol, UNCATEGORIZED_COLOR } from "../plan-model";
import { AnchoredPopover } from "./anchored-popover";
import { ColorField } from "./color-field";
import { validateName } from "./entity-names";
import { SymbolField } from "./symbol-field";

/** Was angelegt werden soll; Farbe und Form nur bei Kategorien. */
export interface NewEntity {
  title: string;
  color?: string;
  symbol?: MilestoneSymbol;
}

export interface CreateEntityPopoverProps {
  noun: "Ebene" | "Kategorie";
  /** Die Namen, die es schon gibt — ein neuer muss sich unterscheiden. */
  existing: readonly string[];
  /** Nur bei Kategorien: die vorgeschlagene Farbe. */
  initialColor?: string;
  /** Nur bei Kategorien: die vorgeschlagene Form ihrer Meilensteine. */
  initialSymbol?: MilestoneSymbol;
  onCreate: (entity: NewEntity) => void;
  onCancel: () => void;
}

export function CreateEntityPopover({
  noun,
  existing,
  initialColor,
  initialSymbol,
  onCreate,
  onCancel,
}: CreateEntityPopoverProps): ReactElement {
  const titleId = useId();
  const nameRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [color, setColor] = useState(initialColor);
  const [symbol, setSymbol] = useState(initialSymbol);
  // Die Meldung erst nach dem ersten Tippen oder Versuch: ein leeres Feld
  // beim Öffnen ist noch kein Fehler.
  const [touched, setTouched] = useState(false);
  const validate = validateName(noun, existing);
  const error = touched ? validate(name) : null;

  const submit = (close: (returnFocus: boolean) => void): void => {
    setTouched(true);
    if (validate(name) !== null) {
      nameRef.current?.focus();
      return;
    }
    onCreate({ title: name.trim(), color, symbol });
    close(true);
  };

  return (
    <AnchoredPopover
      align="start"
      labelledBy={titleId}
      onClose={onCancel}
      initialFocus={nameRef}
      className="w-[280px]"
    >
      {({ close }) => (
        <>
          <p id={titleId} className="font-semibold text-foreground">
            Neue {noun}
          </p>
          <Field label="Name" error={error}>
            <Input
              ref={nameRef}
              type="text"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setTouched(true);
              }}
              onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
                if (event.key !== "Enter") return;
                event.preventDefault();
                submit(close);
              }}
            />
          </Field>
          {color !== undefined && (
            <ColorField label="Farbe" value={color} onChange={setColor} />
          )}
          {symbol !== undefined && (
            <SymbolField
              label="Form"
              value={symbol}
              color={color ?? UNCATEGORIZED_COLOR}
              onChange={setSymbol}
            />
          )}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => close(true)}>
              Abbrechen
            </Button>
            <Button type="button" onClick={() => submit(close)}>
              Anlegen
            </Button>
          </div>
        </>
      )}
    </AnchoredPopover>
  );
}
