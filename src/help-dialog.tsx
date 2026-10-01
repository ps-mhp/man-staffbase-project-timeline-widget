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
 * Die Hilfe zum Projektplan: was die Zeichen bedeuten und wie man ihn bedient.
 *
 * Ein Zeitstrahl mit Serien, Abhängigkeiten, Stichtagen und stufenlosem Zoom
 * erklärt sich nicht von selbst — und die Tastenkürzel sieht niemand. Die
 * Hilfe steht deshalb auf der Seite, nicht nur in der Redakteurs-Doku.
 */

import React, { KeyboardEvent, ReactElement, ReactNode, useEffect, useId, useRef, useState } from "react";

import { trapTab, useReturnFocus } from "./focus-trap";
import { HelpLegend } from "./help-legend";
import { Plan } from "./plan-model";

export interface HelpDialogProps {
  plan: Plan;
  allowExport: boolean;
  onClose: () => void;
}

type HelpTab = "legend" | "controls";

const TABS: { id: HelpTab; label: string }[] = [
  { id: "legend", label: "Legende" },
  { id: "controls", label: "Bedienung" },
];

/** „⌘" auf Apple-Geräten, sonst „Strg" — so steht es auf der Tastatur. */
export function zoomModifier(platform: string = currentPlatform()): string {
  return /Mac|iPhone|iPad|iPod/i.test(platform) ? "⌘" : "Strg";
}

function currentPlatform(): string {
  const navigatorWithData = globalThis.navigator as (Navigator & { userAgentData?: { platform?: string } }) | undefined;
  return navigatorWithData?.userAgentData?.platform ?? navigatorWithData?.platform ?? "";
}

const Keys = ({ children }: { children: ReactNode }) => <kbd className="man-pt__kbd">{children}</kbd>;

function Group({ title, rows }: { title: string; rows: [ReactNode, string][] }): ReactElement {
  return (
    <section className="man-pt__help-section">
      <h4 className="man-pt__help-heading">{title}</h4>
      <dl className="man-pt__help-keys">
        {rows.map(([keys, text], index) => (
          <div key={index} className="man-pt__help-key">
            <dt>{keys}</dt>
            <dd>{text}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function HelpControls({ allowExport }: { allowExport: boolean }): ReactElement {
  const mod = zoomModifier();
  const filterRows: [ReactNode, string][] = [
    ["Kategorien in der Legende", "Ein Klick blendet eine Kategorie aus und wieder ein; „Alle“ zeigt wieder alle."],
    ["Filter", "Ebenen ausblenden und den Zeitraum eingrenzen. Die Zahl am Knopf nennt die aktiven Filter."],
    ["Suche", "Blendet alles außer den Treffern ab; Enter springt zum nächsten Treffer."],
    ["Liste", "Zeigt die sichtbaren Einträge als Tabelle, nach Termin sortiert."],
    ["Pfeil am Ebenennamen", "Klappt die Ebene ein und wieder aus; „Alle einklappen“ über den Ebenen klappt alle auf einmal."],
    ["Vollbild", "Zeigt den Plan über den ganzen Bildschirm; Esc oder „Vollbild beenden“ kehrt zurück."],
  ];
  if (allowExport) {
    filterRows.push(["Exportieren", "Lädt die aktuelle Ansicht oder den ganzen Plan als Excel-Tabelle herunter."]);
  }

  return (
    <>
      <Group
        title="Maus und Trackpad"
        rows={[
          [
            <>
              <Keys>{mod}</Keys> + Mausrad, Pinch
            </>,
            "Zoomt an der Stelle unter dem Zeiger — von Jahren bis auf einzelne Tage.",
          ],
          ["Ziehen", "Verschiebt den Plan, wenn man auf freie Fläche drückt."],
          [
            <>
              <Keys>Shift</Keys> + Mausrad, waagerecht wischen
            </>,
            "Verschiebt den Plan nach links oder rechts.",
          ],
          ["−  +  Alles zeigen", "Zoomt in Stufen; „Alles zeigen“ zeigt den ganzen Zeitraum."],
          [
            "Klick auf einen Eintrag",
            "Öffnet die Details mit Termin, Ebene und Serie; Vorgänger und Nachfolger sind darin anklickbar. Ist die Beschriftung unterstrichen, öffnet er stattdessen die verknüpfte Seite oder den Beitrag.",
          ],
          ["Übersicht unter dem Plan", "Fenster ziehen verschiebt, seine Ränder ziehen ändert den Zeitraum, ein Klick daneben springt dorthin."],
        ]}
      />
      <Group
        title="Touch"
        rows={[
          ["Zwei Finger spreizen", "Zoomt hinein, zusammenziehen zoomt heraus."],
          ["Waagerecht wischen", "Verschiebt den Plan; senkrecht rollt die Seite wie gewohnt."],
          ["Tippen", "Öffnet die Details eines Eintrags — oder, ist er unterstrichen, die verknüpfte Seite oder den Beitrag."],
        ]}
      />
      <Group
        title="Tastatur"
        rows={[
          [<Keys key="tab">Tab</Keys>, "Springt in den Plan — er ist ein einziger Halt."],
          [
            <>
              <Keys>←</Keys> <Keys>→</Keys>
            </>,
            "Voriger und nächster Eintrag der Ebene; der Plan folgt.",
          ],
          [
            <>
              <Keys>↑</Keys> <Keys>↓</Keys>
            </>,
            "Zeitlich nächster Eintrag der Ebene darüber oder darunter.",
          ],
          [
            <>
              <Keys>Pos1</Keys> <Keys>Ende</Keys>
            </>,
            "Erster und letzter Eintrag der Ebene.",
          ],
          [<Keys key="enter">Enter</Keys>, "Öffnet die Details."],
          [<Keys key="esc">Esc</Keys>, "Schließt Details und Dialoge."],
          [
            <>
              <Keys>+</Keys> <Keys>−</Keys> <Keys>0</Keys>
            </>,
            "Zoomt hinein, heraus, zeigt alles.",
          ],
          [
            <>
              <Keys>Shift</Keys> + <Keys>←</Keys> <Keys>→</Keys>
            </>,
            "Verschiebt den Plan, ohne den Eintrag zu wechseln.",
          ],
          [<Keys key="help">?</Keys>, "Öffnet diese Hilfe."],
        ]}
      />
      <Group title="Filter und Ansicht" rows={filterRows} />
    </>
  );
}

export function HelpDialog({ plan, allowExport, onClose }: HelpDialogProps): ReactElement {
  const [tab, setTab] = useState<HelpTab>("legend");
  const titleId = useId();
  const tabBase = useId();
  const tabRefs = useRef<Record<HelpTab, HTMLButtonElement | null>>({ legend: null, controls: null });
  useReturnFocus();

  useEffect(() => {
    tabRefs.current.legend?.focus();
  }, []);

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const next: HelpTab = tab === "legend" ? "controls" : "legend";
    setTab(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <div className="man-pt__dialog-backdrop" onPointerDown={(event) => event.target === event.currentTarget && onClose()}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="man-pt__dialog man-pt__help"
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.stopPropagation();
            onClose();
          }
          trapTab(event);
        }}
      >
        <div className="man-pt__help-head">
          <h3 id={titleId} className="man-pt__dialog-title">
            Hilfe zum Projektplan
          </h3>
          <button type="button" className="man-pt__button man-pt__button--icon" aria-label="Schließen" onClick={onClose}>
            ×
          </button>
        </div>
        <div role="tablist" aria-label="Hilfe" className="man-pt__help-tabs">
          {TABS.map((entry) => (
            <button
              key={entry.id}
              ref={(element) => {
                tabRefs.current[entry.id] = element;
              }}
              type="button"
              role="tab"
              id={`${tabBase}-${entry.id}`}
              aria-controls={`${tabBase}-${entry.id}-panel`}
              aria-selected={tab === entry.id}
              tabIndex={tab === entry.id ? 0 : -1}
              className={`man-pt__help-tab${tab === entry.id ? " is-active" : ""}`}
              onClick={() => setTab(entry.id)}
              onKeyDown={onTabKeyDown}
            >
              {entry.label}
            </button>
          ))}
        </div>
        {TABS.map((entry) => (
          <div
            key={entry.id}
            role="tabpanel"
            id={`${tabBase}-${entry.id}-panel`}
            aria-labelledby={`${tabBase}-${entry.id}`}
            hidden={tab !== entry.id}
            className="man-pt__help-panel"
          >
            {entry.id === "legend" ? <HelpLegend plan={plan} /> : <HelpControls allowExport={allowExport} />}
          </div>
        ))}
      </div>
    </div>
  );
}
