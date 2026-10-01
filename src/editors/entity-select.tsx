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
 * Ein Auswahlfeld für Ebene oder Kategorie, dessen letzte Option eine neue
 * anlegt. Die Option setzt keinen Wert: sie öffnet das Popover, und das Feld
 * zeigt bis zum Anlegen weiter den bisherigen — bricht man ab, bleibt er.
 */

import * as React from "react";
import { ReactElement, ReactNode, useId, useState } from "react";

import { MilestoneSymbol } from "../plan-model";
import { CreateEntityPopover, NewEntity } from "./create-entity-popover";

/**
 * Der Wert der Option „Neue …“. Die `id`s im Plan entstehen per `newId` mit
 * Präfix und Bindestrich; so lautet keine.
 */
const CREATE = "__create__";

export interface EntitySelectProps {
  label: string;
  noun: "Ebene" | "Kategorie";
  value: string;
  /** Die Optionen vor den Einträgen, etwa „Ohne Kategorie“. */
  leading?: ReactNode;
  entities: readonly { id: string; title: string }[];
  /** Unter der Obergrenze? Sonst ist „Neue …“ gesperrt. */
  canCreate: boolean;
  /** Nur bei Kategorien: die vorgeschlagene Farbe. */
  initialColor?: string;
  /** Nur bei Kategorien: die vorgeschlagene Form. */
  initialSymbol?: MilestoneSymbol;
  onChange: (value: string) => void;
  onCreate: (entity: NewEntity) => void;
}

export function EntitySelect({
  label,
  noun,
  value,
  leading,
  entities,
  canCreate,
  initialColor,
  initialSymbol,
  onChange,
  onCreate,
}: EntitySelectProps): ReactElement {
  const id = useId();
  const [creating, setCreating] = useState(false);

  return (
    <div className="man-pt-editor__field man-pt-editor__anchor">
      <label className="man-pt-editor__label" htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        className="man-pt-editor__select"
        value={value}
        aria-haspopup="dialog"
        aria-expanded={creating}
        onChange={(event) => {
          if (event.target.value === CREATE) setCreating(true);
          else onChange(event.target.value);
        }}
      >
        {leading}
        {entities.map((entity) => (
          <option key={entity.id} value={entity.id}>
            {entity.title}
          </option>
        ))}
        <optgroup label="Anlegen">
          <option value={CREATE} disabled={!canCreate}>
            {canCreate
              ? `Neue ${noun} …`
              : `Neue ${noun} … (Obergrenze erreicht)`}
          </option>
        </optgroup>
      </select>
      {creating && (
        <CreateEntityPopover
          noun={noun}
          existing={entities.map((entity) => entity.title)}
          initialColor={initialColor}
          initialSymbol={initialSymbol}
          onCreate={onCreate}
          onCancel={() => setCreating(false)}
        />
      )}
    </div>
  );
}
