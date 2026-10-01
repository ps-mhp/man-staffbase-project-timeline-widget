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
 * Die Kopfleiste des Editors: Titel, Überschrift des Plans, Zähler und die
 * beiden Knöpfe, die den Dialog beenden.
 *
 * „Übernehmen“ und „Abbrechen“ stehen oben, nicht in einer Fußleiste: im
 * Vollbild läge eine Fußleiste am unteren Bildschirmrand, weit weg von der
 * Arbeit, und auf kleinen Bildschirmen unter der Falz.
 */

import * as React from "react";
import { ReactElement } from "react";

import { LIMITS, Plan } from "../plan-model";
import { DraftField } from "./draft-field";

export interface EditorHeaderProps {
  plan: Plan;
  /** Hält der Entwurf Änderungen, die noch nicht im Feld stehen? */
  dirty: boolean;
  onTitleChange: (title: string) => void;
  onCancel: () => void;
  onSave: () => void;
}

export function EditorHeader({
  plan,
  dirty,
  onTitleChange,
  onCancel,
  onSave,
}: EditorHeaderProps): ReactElement {
  return (
    <div className="man-pt-editor__bar" data-testid="plan-editor-bar">
      <h2 className="man-pt-editor__bar-title">Projektplan bearbeiten</h2>
      {/* Die Überschrift steht im Plan, nicht in einem eigenen Attribut —
          siehe `Plan.title`. Leer steht über dem Plan keine. */}
      <DraftField
        label="Überschrift"
        value={plan.title ?? ""}
        normalize={(text) => text.trim()}
        onCommit={onTitleChange}
        className="man-pt-editor__bar-heading"
      />
      <div className="man-pt-editor__bar-end">
        <span className="man-pt-editor__count">{`${plan.items.length} / ${LIMITS.items} Einträge`}</span>
        {dirty && (
          <span className="man-pt-editor__dirty">
            Ungespeicherte Änderungen
          </span>
        )}
        <button
          type="button"
          className="man-pt-editor__button man-pt-editor__button--bar"
          onClick={onCancel}
        >
          Abbrechen
        </button>
        <button
          type="button"
          className="man-pt-editor__button man-pt-editor__button--bar man-pt-editor__button--primary"
          onClick={onSave}
        >
          Übernehmen
        </button>
      </div>
    </div>
  );
}
