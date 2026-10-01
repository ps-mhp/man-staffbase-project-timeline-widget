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
 * Die Legende der Hilfe: jedes Element des Zeitstrahls als kleines Muster mit
 * einem Satz dazu, darunter die Kategorien dieses Plans.
 *
 * Die Muster sind gezeichnet, nicht beschrieben — wer „gestrichelter Rand"
 * liest, muss es erst im Plan suchen. Farben kommen aus denselben Variablen
 * wie der Plan (`--pt-strong`, `--pt-accent`), die Formen folgen den Maßen des
 * Stylesheets.
 */

import React, { ReactElement, ReactNode, useId } from "react";

import { NO_CATEGORY } from "./plan-filter";
import { MilestoneSymbol, Plan, UNCATEGORIZED_COLOR } from "./plan-model";
import { SymbolGlyph } from "./symbol-glyph";
import { DEFAULT_SYMBOL, symbolPath } from "./symbols";

const DIAMOND = "M 7 1 L 13 7 L 7 13 L 1 7 Z";

function Sample({ width = 56, children }: { width?: number; children: ReactNode }): ReactElement {
  return (
    <svg
      className="man-pt__help-sample"
      width={width}
      height={16}
      viewBox={`0 0 ${width} 16`}
      // Links bündig in der festen Musterspalte, damit die Begriffe fluchten.
      preserveAspectRatio="xMinYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

const at = (x: number, y = 1) => `translate(${x} ${y})`;

/** Sechs der Formen, verkleinert nebeneinander — jede Kategorie trägt eine davon. */
const SAMPLE_SYMBOLS: readonly MilestoneSymbol[] = ["diamond", "triangle", "square", "circle", "hexagon", "star"];

function MilestoneSample() {
  return (
    <Sample width={72}>
      {SAMPLE_SYMBOLS.map((symbol, index) => (
        <path
          key={symbol}
          className="man-pt__help-fill"
          d={symbolPath(symbol)}
          transform={`translate(${index * 12} 2.5) scale(0.78)`}
        />
      ))}
    </Sample>
  );
}

function BarSample() {
  return (
    <Sample width={72}>
      <rect className="man-pt__help-fill" x={0} y={2} width={30} height={12} />
      <path className="man-pt__help-fill" d="M 38 2 H 64 L 71 8 L 64 14 H 38 Z" />
    </Sample>
  );
}

function TentativeSample() {
  return (
    <Sample width={72}>
      <path className="man-pt__help-fill man-pt__help-fill--soft man-pt__help-stroke" d={DIAMOND} transform={at(0)} />
      <rect className="man-pt__help-fill man-pt__help-fill--soft man-pt__help-stroke man-pt__help-stroke--dashed" x={22} y={2} width={48} height={12} />
    </Sample>
  );
}

function SeriesSample() {
  return (
    <Sample width={72}>
      <rect className="man-pt__help-fill man-pt__help-fill--faint" x={7} y={4} width={56} height={8} />
      <path className="man-pt__help-fill" d={DIAMOND} transform={at(0)} />
      <path className="man-pt__help-fill" d={DIAMOND} transform={at(28)} />
      <path className="man-pt__help-fill" d={DIAMOND} transform={at(56)} />
    </Sample>
  );
}

function DependencySample() {
  const marker = `${useId().replace(/:/g, "")}-arrow`;
  return (
    <Sample width={72}>
      <defs>
        <marker id={marker} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M 0 0 L 8 4 L 0 8 z" className="man-pt__help-fill man-pt__help-fill--muted" />
        </marker>
      </defs>
      <path className="man-pt__help-fill" d={DIAMOND} transform={at(0)} />
      <line className="man-pt__help-line man-pt__help-line--dashed" x1={14} y1={8} x2={52} y2={8} markerEnd={`url(#${marker})`} />
      <path className="man-pt__help-fill" d={DIAMOND} transform={at(56)} />
    </Sample>
  );
}

function DeadlineSample() {
  return (
    <Sample width={24}>
      <line className="man-pt__help-line man-pt__help-line--accent man-pt__help-line--dashed" x1={12} y1={0} x2={12} y2={10} />
      <path className="man-pt__help-accent" d="M 12 8 L 17 15 L 7 15 Z" />
    </Sample>
  );
}

function TodaySample() {
  return (
    <Sample width={24}>
      <line className="man-pt__help-line man-pt__help-line--strong" x1={12} y1={0} x2={12} y2={16} />
    </Sample>
  );
}

function CollapsedSample() {
  return (
    <Sample width={72}>
      <path className="man-pt__help-line man-pt__help-line--strong man-pt__help-line--open" d="M 2 4 L 6 8 L 2 12" />
      <path className="man-pt__help-fill" d={DIAMOND} transform={at(16)} />
      <path className="man-pt__help-fill" d={DIAMOND} transform={at(26)} />
      <rect className="man-pt__help-fill" x={44} y={3} width={26} height={10} />
    </Sample>
  );
}

interface Entry {
  term: string;
  sample: ReactElement;
  text: string;
}

const ENTRIES: readonly Entry[] = [
  {
    term: "Meilenstein",
    sample: <MilestoneSample />,
    text: "Ein Termin. Form und Farbe nennen seine Kategorie; der Name steht darunter.",
  },
  {
    term: "Zeitraum",
    sample: <BarSample />,
    text: "Von–bis als Balken. Endet er in einer Spitze, läuft der Zeitraum über das gezeigte Ende hinaus weiter.",
  },
  {
    term: "Vorläufig",
    sample: <TentativeSample />,
    text: "Blass mit kräftigem Rand: der Termin steht noch nicht fest.",
  },
  {
    term: "Serie",
    sample: <SeriesSample />,
    text: "Eine Leiste verbindet zusammengehörige Termine auf einer Zeile; Meilensteine einer Serie mit Zeitraum sitzen auf dessen Balken.",
  },
  {
    term: "Abhängigkeit",
    sample: <DependencySample />,
    text: "Der gestrichelte Pfeil führt vom Vorgänger zum Nachfolger. Ist ein Eintrag gewählt, treten seine Verbindungen hervor.",
  },
  {
    term: "Stichtag",
    sample: <DeadlineSample />,
    text: "Eine gestrichelte Linie durch alle Ebenen, beschriftet am unteren Rand — etwa eine Regelung, die ab diesem Tag gilt.",
  },
  {
    term: "Heute",
    sample: <TodaySample />,
    text: "Die durchgezogene Linie markiert den heutigen Tag.",
  },
  {
    term: "Eingeklappte Ebene",
    sample: <CollapsedSample />,
    text: "Der Pfeil am Namen einer Ebene klappt sie ein: dann zeigt sie nur Symbole und Balken, ohne Beschriftung.",
  },
];

function categoriesOf(plan: Plan): { id: string; title: string; color: string; symbol: MilestoneSymbol }[] {
  const known = new Set(plan.categories.map((category) => category.id));
  const entries = plan.categories.map(({ id, title, color, symbol }) => ({ id, title, color, symbol: symbol ?? DEFAULT_SYMBOL }));
  const hasUncategorized = plan.items.some((item) => item.category === undefined || !known.has(item.category));
  return hasUncategorized
    ? [...entries, { id: NO_CATEGORY, title: "Ohne Kategorie", color: UNCATEGORIZED_COLOR, symbol: DEFAULT_SYMBOL }]
    : entries;
}

export function HelpLegend({ plan }: { plan: Plan }): ReactElement {
  const categories = categoriesOf(plan);
  return (
    <>
      <dl className="man-pt__help-list">
        {ENTRIES.map((entry) => (
          <div key={entry.term} className="man-pt__help-entry">
            <dt>
              {entry.sample}
              {entry.term}
            </dt>
            <dd>{entry.text}</dd>
          </div>
        ))}
      </dl>
      {categories.length > 0 && (
        <section className="man-pt__help-section">
          <h4 className="man-pt__help-heading">Kategorien</h4>
          <p className="man-pt__help-text">
            Farbe und Form eines Symbols nennen seine Kategorie, die Farbe auch die eines Balkens. Ein Klick auf eine Kategorie in der Legende über dem
            Plan blendet sie aus und wieder ein.
          </p>
          <div className="man-pt__legend" role="list" aria-label="Kategorien dieses Plans">
            {categories.map((category) => (
              <span key={category.id} role="listitem" className="man-pt__legend-entry">
                <SymbolGlyph symbol={category.symbol} color={category.color} className="man-pt__legend-symbol" />
                {category.title}
              </span>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
