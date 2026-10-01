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
 * Die Serie eines Eintrags: ein Auswahlfeld mit den Serien derselben Ebene,
 * in das sich auch ein neuer Name tippen lässt.
 *
 * Eine Serie ist ein Schlüssel, keine eigene Liste: „neu anlegen“ setzt nur
 * den Namen. Gespeichert wird er ohne Leerraum am Rand — „TMS“ und „TMS “
 * stünden sonst auf zwei Zeilen.
 */

import * as React from "react";
import { ReactElement } from "react";

import { LaneItem, Plan, PlanItem } from "../plan-model";
import { Combobox } from "./combobox";
import { withOptional } from "./plan-edits";
import { countLabel, seriesSuggestions } from "./plan-queries";

export interface SeriesFieldProps {
  plan: Plan;
  item: LaneItem;
  onChange: (item: PlanItem) => void;
}

export function SeriesField({
  plan,
  item,
  onChange,
}: SeriesFieldProps): ReactElement {
  return (
    <Combobox
      label="Serie"
      value={item.series ?? ""}
      suggestions={seriesSuggestions(plan, item.lane)}
      onChange={(series) =>
        onChange(
          withOptional(item, "series", series === "" ? undefined : series),
        )
      }
      noneLabel="Keine Serie"
      createLabel={(text) => `„${text}“ als neue Serie anlegen`}
      describe={(suggestion) => countLabel(suggestion.count)}
      hint="Einträge derselben Ebene mit gleicher Serie stehen auf einer gemeinsamen Zeile."
    />
  );
}
