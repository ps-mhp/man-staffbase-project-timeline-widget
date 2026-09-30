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
 * Die Farbe einer Kategorie: zwölf Felder aus der Palette plus ein Hex-Feld.
 *
 * Die Felder sind echte Optionsfelder. So bringt der Browser die Bedienung mit
 * den Pfeiltasten und das Vorlesen „ausgewählt“ selbst mit; gezeichnet wird
 * nur ihr Aussehen.
 */

import * as React from "react";
import { ReactElement, useId } from "react";

import { CATEGORY_PALETTE } from "./plan-edits";
import { DraftField } from "./draft-field";

const HEX = /^#?([0-9a-f]{6})$/i;

/** `#RRGGBB` in Großbuchstaben, oder `null`. Die Raute darf fehlen. */
export function normalizeHex(text: string): string | null {
  const match = HEX.exec(text.trim());
  return match === null ? null : `#${match[1].toUpperCase()}`;
}

const validateHex = (text: string): string | null =>
  normalizeHex(text) === null ? "Bitte eine Farbe als #RRGGBB angeben, etwa #E40045." : null;

export interface ColorFieldProps {
  /** Name der Gruppe; nennt die Kategorie, damit mehrere Felder unterscheidbar bleiben. */
  label: string;
  value: string;
  onChange: (color: string) => void;
}

export function ColorField({ label, value, onChange }: ColorFieldProps): ReactElement {
  const name = useId();
  const current = value.toUpperCase();

  return (
    <fieldset className="man-pt-editor__colors">
      <legend className="man-pt-editor__label">{label}</legend>
      <div className="man-pt-editor__swatches">
        {CATEGORY_PALETTE.map((color) => (
          <input
            key={color}
            type="radio"
            name={name}
            className="man-pt-editor__swatch"
            style={{ backgroundColor: color }}
            aria-label={color}
            checked={current === color}
            onChange={() => onChange(color)}
          />
        ))}
      </div>
      <DraftField
        label="Hex-Wert"
        value={current}
        validate={validateHex}
        normalize={(text) => normalizeHex(text) as string}
        onCommit={onChange}
        className="man-pt-editor__hex"
      />
    </fieldset>
  );
}
