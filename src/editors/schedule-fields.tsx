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
 * Was vom Termin eines Eintrags abhängt: Datum bzw. Beginn und Ende, beim
 * Zeitraum der Pfeil. Je nach Art erscheinen andere Felder. Die Form eines
 * Meilensteins gehört seiner Kategorie (siehe `symbols.ts`), nicht ihm.
 *
 * Ein Zeitraum, dessen Ende vor dem Beginn liegt, wird nicht übernommen. Das
 * Lesen vertauschte ihn zwar stillschweigend — aber die Redaktion sähe dann
 * einen anderen Zeitraum, als sie eingegeben hat, und merkte es nicht.
 */

import * as React from "react";
import { ReactElement } from "react";

import { parseIsoDate } from "../calendar";
import { BarItem, PlanItem } from "../plan-model";
import { DraftField, Validator } from "./draft-field";
import { withOptional } from "./plan-edits";

export const validateDate: Validator = (text) => {
  if (text.trim() === "") return "Bitte ein Datum angeben.";
  return parseIsoDate(text) === null
    ? "Bitte ein gültiges Datum angeben."
    : null;
};

/** Prüft das Datum und danach, ob es zum anderen Ende des Zeitraums passt. */
const validateAgainst =
  (
    other: string,
    fits: (day: number, otherDay: number) => boolean,
    message: string,
  ): Validator =>
  (text) =>
    validateDate(text) ??
    (fits(parseIsoDate(text) as number, parseIsoDate(other) as number)
      ? null
      : message);

export interface ScheduleFieldsProps {
  item: PlanItem;
  onChange: (item: PlanItem) => void;
}

function BarDates({
  item,
  onChange,
}: {
  item: BarItem;
  onChange: (item: PlanItem) => void;
}): ReactElement {
  return (
    <>
      <DraftField
        label="Beginn"
        type="date"
        value={item.start}
        validate={validateAgainst(
          item.end,
          (day, end) => day <= end,
          "Der Beginn liegt nach dem Ende.",
        )}
        onCommit={(start) => onChange({ ...item, start })}
      />
      <DraftField
        label="Ende"
        type="date"
        value={item.end}
        validate={validateAgainst(
          item.start,
          (day, start) => day >= start,
          "Das Ende liegt vor dem Beginn.",
        )}
        onCommit={(end) => onChange({ ...item, end })}
      />
    </>
  );
}

export function ScheduleFields({
  item,
  onChange,
}: ScheduleFieldsProps): ReactElement {
  return (
    <>
      <div className="man-pt-editor__row">
        {item.kind === "bar" ? (
          <BarDates item={item} onChange={onChange} />
        ) : (
          <DraftField
            label="Datum"
            type="date"
            value={item.date}
            validate={validateDate}
            onCommit={(date) => onChange({ ...item, date })}
          />
        )}
      </div>
      {item.kind === "bar" && (
        <label className="man-pt-editor__check">
          <input
            type="checkbox"
            checked={item.arrow === true}
            onChange={(event) =>
              onChange(
                withOptional(
                  item,
                  "arrow",
                  event.target.checked ? true : undefined,
                ),
              )
            }
          />
          Pfeil am Ende
        </label>
      )}
    </>
  );
}
