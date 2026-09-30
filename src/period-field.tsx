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
 * Der Zeitraum-Filter: „Von" und „Bis", monatsgenau.
 *
 * Je eine Auswahl für Monat und Jahr statt `<input type="month">` — das kennt
 * Safari auf dem Desktop nicht und zeigt dort ein nacktes Textfeld.
 */

import React, { ReactElement, useId } from "react";

import { DayRange, MonthRef, firstDayOfMonth, lastDayOfMonth, monthOfDay } from "./calendar";

export interface PeriodFieldProps {
  /** Der aktive Zeitraum; `null` = der ganze Plan. */
  period: DayRange | null;
  /** Die Spanne des Plans; bestimmt die angebotenen Jahre und die Vorbelegung. */
  extent: DayRange;
  locale: string;
  onChange: (period: DayRange | null) => void;
}

const MONTHS = Array.from({ length: 12 }, (_, index) => index + 1);

function monthNames(locale: string): string[] {
  const format = new Intl.DateTimeFormat(locale, { month: "long", timeZone: "UTC" });
  return MONTHS.map((month) => format.format(new Date(Date.UTC(2000, month - 1, 1))));
}

const key = ({ year, month }: MonthRef): number => year * 12 + month;

function MonthPicker(props: {
  label: string;
  value: MonthRef;
  years: number[];
  names: string[];
  onChange: (value: MonthRef) => void;
}): ReactElement {
  const id = useId();
  return (
    <fieldset className="man-pt__period-part">
      <legend className="man-pt__field-label">{props.label}</legend>
      <label className="man-pt__visually-hidden" htmlFor={`${id}-m`}>
        {`${props.label}: Monat`}
      </label>
      <select
        id={`${id}-m`}
        className="man-pt__select"
        value={props.value.month}
        onChange={(event) => props.onChange({ ...props.value, month: Number(event.target.value) })}
      >
        {MONTHS.map((month) => (
          <option key={month} value={month}>
            {props.names[month - 1]}
          </option>
        ))}
      </select>
      <label className="man-pt__visually-hidden" htmlFor={`${id}-y`}>
        {`${props.label}: Jahr`}
      </label>
      <select
        id={`${id}-y`}
        className="man-pt__select"
        value={props.value.year}
        onChange={(event) => props.onChange({ ...props.value, year: Number(event.target.value) })}
      >
        {props.years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </fieldset>
  );
}

export function PeriodField({ period, extent, locale, onChange }: PeriodFieldProps): ReactElement {
  const names = monthNames(locale);
  const first = monthOfDay(extent.start);
  const last = monthOfDay(extent.end);
  const years = Array.from({ length: last.year - first.year + 3 }, (_, index) => first.year - 1 + index);

  const from = period === null ? first : monthOfDay(period.start);
  const to = period === null ? last : monthOfDay(period.end);

  // Wer „Von" hinter „Bis" stellt, meint den Zeitraum andersherum — kein Grund für eine Fehlermeldung.
  const apply = (nextFrom: MonthRef, nextTo: MonthRef) => {
    const [start, end] = key(nextFrom) <= key(nextTo) ? [nextFrom, nextTo] : [nextTo, nextFrom];
    onChange({ start: firstDayOfMonth(start), end: lastDayOfMonth(end) });
  };

  return (
    <div className="man-pt__period">
      <MonthPicker label="Von" value={from} years={years} names={names} onChange={(value) => apply(value, to)} />
      <MonthPicker label="Bis" value={to} years={years} names={names} onChange={(value) => apply(from, value)} />
      {period !== null && (
        <button type="button" className="man-pt__link-button" onClick={() => onChange(null)}>
          Ganzer Zeitraum
        </button>
      )}
    </div>
  );
}
