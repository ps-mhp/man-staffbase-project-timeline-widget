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
 * Ein Bereich des Editors: fester Kopf, darunter ein Rumpf, der selbst rollt.
 *
 * Das Modal von `@shared/config-modal` rollt absichtlich nicht (`overflow:
 * hidden`, „an editor scrolls its own body“). Jeder Bereich, dessen Inhalt
 * wachsen kann — Liste, Formular, Ebenen, Kategorien —, braucht deshalb einen
 * eigenen Rollbereich; fehlte er, schnitte der Rand des Modals den Rest ab,
 * und kein Mausrad käme heran. Alle Bereiche nehmen diesen einen Baustein,
 * damit Kopf, Abstände und Rollverhalten überall gleich sind.
 */

import * as React from "react";
import { ReactElement, ReactNode, Ref } from "react";

export interface PaneHeadProps {
  /** Links: der Titel des Bereichs. */
  title?: ReactNode;
  /** Neben dem Titel: ein Hinweis in kleiner Schrift. */
  hint?: ReactNode;
  /** Statt Titel und Hinweis: eigener Inhalt der ersten Zeile, etwa die Suche. */
  lead?: ReactNode;
  /** Rechts: die Handlungen des Bereichs. */
  actions?: ReactNode;
  /**
   * Die zweite Zeile, etwa Unterreiter oder Pillen. `null` hält sie leer,
   * aber gleich hoch — damit Liste und Formular nebeneinander an denselben
   * Linien enden, auch wenn rechts kein Eintrag gewählt ist.
   */
  toolbar?: ReactNode;
}

/**
 * Der Kopf eines Bereichs in festen Zeilen: oben Titel (oder eigener Inhalt)
 * links und Handlungen rechts, darunter wahlweise eine zweite Zeile. Die
 * Höhen kommen aus `--pt-ed-head-h` und `--pt-ed-subhead-h`, nicht aus dem
 * Inhalt: so laufen die Trennlinien benachbarter Bereiche durch.
 */
export function PaneHead({
  title,
  hint,
  lead,
  actions,
  toolbar,
}: PaneHeadProps): ReactElement {
  const hasBar =
    title !== undefined ||
    hint !== undefined ||
    lead !== undefined ||
    actions !== undefined;
  return (
    <div className="man-pt-editor__pane-head">
      {hasBar && (
        <div className="man-pt-editor__pane-row">
          <div className="man-pt-editor__pane-lead">
            {lead}
            {title !== undefined && (
              <h3 className="man-pt-editor__pane-title">{title}</h3>
            )}
            {hint !== undefined && (
              <div className="man-pt-editor__hint">{hint}</div>
            )}
          </div>
          {actions !== undefined && (
            <div className="man-pt-editor__pane-actions">{actions}</div>
          )}
        </div>
      )}
      {toolbar !== undefined && (
        <div className="man-pt-editor__pane-row man-pt-editor__pane-row--sub">
          {toolbar}
        </div>
      )}
    </div>
  );
}

export interface PaneProps extends PaneHeadProps {
  /** Zugänglicher Name; macht den Bereich zu einer Landmarke. */
  label?: string;
  /** Für `aria-controls` eines Ziehgriffs. */
  id?: string;
  className?: string;
  /** Der rollende Rumpf — für Bereiche, die einen Eintrag in Sicht holen. */
  bodyRef?: Ref<HTMLDivElement>;
  children: ReactNode;
}

export function Pane({
  label,
  id,
  className,
  bodyRef,
  children,
  ...head
}: PaneProps): ReactElement {
  const classes = `man-pt-editor__pane${className ? ` ${className}` : ""}`;
  const content = (
    <>
      <PaneHead {...head} />
      <div ref={bodyRef} className="man-pt-editor__pane-body">
        {children}
      </div>
    </>
  );
  return label === undefined ? (
    <div id={id} className={classes}>
      {content}
    </div>
  ) : (
    <section id={id} className={classes} aria-label={label}>
      {content}
    </section>
  );
}

/** Der Leerzustand eines Bereichs: ein Satz, mittig. */
export function PaneEmpty({ children }: { children: ReactNode }): ReactElement {
  return <p className="man-pt-editor__pane-empty">{children}</p>;
}
