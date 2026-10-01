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
 * Die Werkzeugleiste: Suche, Filter, Zoom, Ansicht, Export.
 *
 * Im Editor bleibt nur der Zoom — filtern und exportieren gehört auf die Seite.
 * Auf schmalen Bildschirmen wandern Ansicht und Export in „Mehr", und die
 * Kategorien stehen im Filter-Menü statt als eigene Legende darüber.
 */

import React, { ReactElement, ReactNode, useId } from "react";

import { DayRange } from "./calendar";
import { Disclosure } from "./disclosure";
import { PeriodField } from "./period-field";
import { Lane } from "./plan-model";

export type TimelineView = "timeline" | "list";

export interface TimelineToolbarProps {
  mode: "page" | "editor";
  narrow: boolean;
  locale: string;
  // Suche
  query: string;
  matchCount: number;
  /** Der wievielte Treffer gerade angesprungen ist; `null` vor dem ersten Enter. */
  matchPosition: number | null;
  onQuery: (query: string) => void;
  onNextMatch: () => void;
  // Filter
  lanes: readonly Lane[];
  hiddenLanes: readonly string[];
  onToggleLane: (laneId: string) => void;
  period: DayRange | null;
  extent: DayRange | null;
  onPeriod: (period: DayRange | null) => void;
  activeFilterCount: number;
  onResetFilters: () => void;
  /** Die Legende, im Filter-Menü gezeigt, wenn der Bildschirm schmal ist. */
  legend: ReactNode;
  // Zoom
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFit: () => void;
  // Ansicht und Export
  view: TimelineView;
  onView: (view: TimelineView) => void;
  allowExport: boolean;
  onExport: () => void;
  /** Kleinere Knöpfe, etwa in der Kopfzeile der Editor-Vorschau. */
  compact?: boolean;
  /** Öffnet die Hilfe; nur auf der Seite. */
  onHelp?: () => void;
  /** Schaltet das Vollbild um; nur auf der Seite. */
  onToggleExpanded?: () => void;
  expanded?: boolean;
}

function matchText(query: string, count: number, position: number | null): string {
  if (query.trim() === "") return "";
  return position === null ? `${count} Treffer` : `${position} von ${count} Treffern`;
}

function SearchField(
  props: Pick<TimelineToolbarProps, "query" | "matchCount" | "matchPosition" | "onQuery" | "onNextMatch">,
): ReactElement {
  const id = useId();
  return (
    <div className="man-pt__search" role="search">
      <label htmlFor={id} className="man-pt__visually-hidden">
        Einträge durchsuchen
      </label>
      <input
        id={id}
        type="search"
        className="man-pt__input"
        placeholder="Suchen …"
        value={props.query}
        onChange={(event) => props.onQuery(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            props.onNextMatch();
          } else if (event.key === "Escape" && props.query !== "") {
            event.stopPropagation();
            props.onQuery("");
          }
        }}
      />
      <span className="man-pt__match-count" aria-live="polite">
        {matchText(props.query, props.matchCount, props.matchPosition)}
      </span>
    </div>
  );
}

function FilterPanel(props: TimelineToolbarProps): ReactElement {
  return (
    <div className="man-pt__filter-panel">
      {props.narrow && (
        <section className="man-pt__filter-section">
          <h3 className="man-pt__filter-heading">Kategorien</h3>
          {props.legend}
        </section>
      )}
      <fieldset className="man-pt__filter-section">
        <legend className="man-pt__filter-heading">Ebenen</legend>
        {props.lanes.map((lane) => (
          <label key={lane.id} className="man-pt__check">
            <input
              type="checkbox"
              checked={!props.hiddenLanes.includes(lane.id)}
              onChange={() => props.onToggleLane(lane.id)}
            />
            {lane.title}
          </label>
        ))}
      </fieldset>
      {props.extent !== null && (
        <section className="man-pt__filter-section">
          <h3 className="man-pt__filter-heading">Zeitraum</h3>
          <PeriodField period={props.period} extent={props.extent} locale={props.locale} onChange={props.onPeriod} />
        </section>
      )}
      {props.activeFilterCount > 0 && (
        <button type="button" className="man-pt__button man-pt__button--quiet" onClick={props.onResetFilters}>
          Filter zurücksetzen
        </button>
      )}
    </div>
  );
}

function ZoomButtons(props: Pick<TimelineToolbarProps, "onZoomIn" | "onZoomOut" | "onFit" | "compact">): ReactElement {
  const button = `man-pt__button${props.compact ? " man-pt__button--compact" : ""}`;
  return (
    <div className="man-pt__zoom" role="group" aria-label="Zoom">
      <button type="button" className={`${button} man-pt__button--icon`} aria-label="Verkleinern" onClick={props.onZoomOut}>
        −
      </button>
      <button type="button" className={`${button} man-pt__button--icon`} aria-label="Vergrößern" onClick={props.onZoomIn}>
        +
      </button>
      <button type="button" className={button} onClick={props.onFit}>
        Alles zeigen
      </button>
    </div>
  );
}

function ViewSwitch({ view, onView }: Pick<TimelineToolbarProps, "view" | "onView">): ReactElement {
  return (
    <div className="man-pt__switch" role="group" aria-label="Ansicht">
      {(["timeline", "list"] as const).map((option) => (
        <button
          key={option}
          type="button"
          className={`man-pt__button${view === option ? " is-active" : ""}`}
          aria-pressed={view === option}
          onClick={() => onView(option)}
        >
          {option === "timeline" ? "Zeitstrahl" : "Liste"}
        </button>
      ))}
    </div>
  );
}

export function TimelineToolbar(props: TimelineToolbarProps): ReactElement {
  if (props.mode === "editor") {
    return (
      <div className="man-pt__toolbar">
        <ZoomButtons {...props} />
      </div>
    );
  }

  const filterLabel = props.activeFilterCount > 0 ? `Filter (${props.activeFilterCount})` : "Filter";
  const exportButton = props.allowExport && (
    <button type="button" className="man-pt__button" onClick={props.onExport}>
      Exportieren
    </button>
  );

  const helpButton = props.onHelp !== undefined && (
    <button
      type="button"
      className={`man-pt__button man-pt__button--help${props.narrow ? " man-pt__button--icon" : ""}`}
      aria-label={props.narrow ? "Hilfe" : undefined}
      aria-haspopup="dialog"
      onClick={props.onHelp}
    >
      <span className="man-pt__help-icon" aria-hidden="true">
        ?
      </span>
      {!props.narrow && "Hilfe"}
    </button>
  );

  const expandLabel = props.expanded ? "Vollbild beenden" : "Vollbild";
  const expandButton = props.onToggleExpanded !== undefined && (
    <button
      type="button"
      data-expand-toggle=""
      className={`man-pt__button${props.narrow ? " man-pt__button--icon" : ""}`}
      aria-label={props.narrow ? expandLabel : undefined}
      onClick={props.onToggleExpanded}
    >
      <ExpandIcon expanded={props.expanded === true} />
      {!props.narrow && expandLabel}
    </button>
  );

  return (
    <div className="man-pt__toolbar">
      <SearchField {...props} />
      <Disclosure
        label={filterLabel}
        ariaLabel={props.activeFilterCount > 0 ? `Filter, ${props.activeFilterCount} aktiv` : "Filter"}
        panelClassName="man-pt__panel--filter"
      >
        <FilterPanel {...props} />
      </Disclosure>
      {props.view === "timeline" && <ZoomButtons {...props} />}
      {props.narrow ? (
        <Disclosure label="Mehr" panelClassName="man-pt__panel--more">
          {(close) => (
            <div className="man-pt__more">
              <ViewSwitch
                view={props.view}
                onView={(view) => {
                  props.onView(view);
                  close();
                }}
              />
              {props.allowExport && (
                <button
                  type="button"
                  className="man-pt__button"
                  onClick={() => {
                    close();
                    props.onExport();
                  }}
                >
                  Exportieren
                </button>
              )}
            </div>
          )}
        </Disclosure>
      ) : (
        <>
          <ViewSwitch view={props.view} onView={props.onView} />
          {exportButton}
        </>
      )}
      {expandButton}
      {helpButton}
    </div>
  );
}

/** Vier Ecken nach außen (öffnen) bzw. nach innen (schließen). */
function ExpandIcon({ expanded }: { expanded: boolean }): ReactElement {
  const d = expanded
    ? "M6 1v5H1M10 1v5h5M6 15v-5H1M10 15v-5h5"
    : "M1 6V1h5M15 6V1h-5M1 10v5h5M15 10v5h-5";
  return (
    <svg className="man-pt__icon" width="14" height="14" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d={d} fill="none" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}
