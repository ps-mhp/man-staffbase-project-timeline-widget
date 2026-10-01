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
 * Die Farbe einer Kategorie als Knopf, der die zwölf Felder und das Hex-Feld
 * aufklappt (siehe `inline-picker.tsx`).
 */

import * as React from "react";
import { ReactElement } from "react";

import { ColorField } from "./color-field";
import { InlinePicker } from "./inline-picker";

export interface ColorPickerProps {
  /** Name der Kategorie — für die zugänglichen Namen. */
  title: string;
  value: string;
  onChange: (color: string) => void;
}

export function ColorPicker({
  title,
  value,
  onChange,
}: ColorPickerProps): ReactElement {
  return (
    <InlinePicker
      label={`Farbe von „${title}“: ${value.toUpperCase()}`}
      face={
        <span
          className="man-pt-editor__color-chip"
          style={{ backgroundColor: value }}
          aria-hidden="true"
        />
      }
    >
      <ColorField
        label={`Farbe von „${title}“`}
        value={value}
        onChange={onChange}
      />
    </InlinePicker>
  );
}
