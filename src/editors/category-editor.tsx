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
 * Der Reiter „Kategorien“: Name, Farbe, Reihenfolge, löschen.
 *
 * Die Reihenfolge hier ist die der Legende auf der Seite. Eine gelöschte
 * Kategorie nimmt keine Einträge mit — die stehen danach „ohne Kategorie“ da,
 * und die Rückfrage sagt, wie viele das sind.
 */

import * as React from "react";
import { ReactElement, useRef, useState } from "react";

import { Category, LIMITS, Plan } from "../plan-model";
import { ColorField } from "./color-field";
import { ConfirmDialog } from "./confirm-dialog";
import { EntityRow } from "./entity-row";
import { addCategory, moveCategory, removeCategory, updateCategory } from "./plan-edits";
import { countInCategory, countLabel } from "./plan-queries";

export interface CategoryEditorProps {
  plan: Plan;
  onPlanChange: (plan: Plan) => void;
}

function removalMessage(count: number): string {
  if (count === 0) return "Kein Eintrag gehört zu dieser Kategorie.";
  return `${countLabel(count)} ${count === 1 ? "steht" : "stehen"} danach ohne Kategorie da.`;
}

export function CategoryEditor({ plan, onPlanChange }: CategoryEditorProps): ReactElement {
  const [focusId, setFocusId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const addRef = useRef<HTMLButtonElement>(null);
  const full = plan.categories.length >= LIMITS.categories;
  const removing = plan.categories.find((category) => category.id === removingId);

  const add = (): void => {
    const { plan: next, id } = addCategory(plan);
    if (id === null) return;
    onPlanChange(next);
    setFocusId(id);
  };

  const change = (category: Category, changes: Partial<Pick<Category, "title" | "color">>): void =>
    onPlanChange(updateCategory(plan, category.id, changes));

  return (
    <div className="man-pt-editor__entities">
      <p className="man-pt-editor__hint">
        In dieser Reihenfolge stehen die Kategorien in der Legende. Die Farbe tragen Symbole und Balken, nie
        der Text.
      </p>
      {plan.categories.length === 0 ? (
        <p className="man-pt-editor__hint">Noch keine Kategorien. Einträge ohne Kategorie erscheinen grau.</p>
      ) : (
        <ol className="man-pt-editor__entity-list" aria-label="Kategorien">
          {plan.categories.map((category, index) => (
            <EntityRow
              key={category.id}
              noun="Kategorie"
              position={index + 1}
              title={category.title}
              count={countInCategory(plan, category.id)}
              isFirst={index === 0}
              isLast={index === plan.categories.length - 1}
              autoFocus={category.id === focusId}
              onRename={(title) => change(category, { title })}
              onMove={(offset) => onPlanChange(moveCategory(plan, category.id, offset))}
              onRemove={() => setRemovingId(category.id)}
            >
              <ColorField
                label={`Farbe von „${category.title}“`}
                value={category.color}
                onChange={(color) => change(category, { color })}
              />
            </EntityRow>
          ))}
        </ol>
      )}
      <div className="man-pt-editor__actions">
        <button ref={addRef} type="button" className="man-pt-editor__button" disabled={full} onClick={add}>
          Neue Kategorie
        </button>
      </div>
      {full && <p className="man-pt-editor__hint">Mehr als {LIMITS.categories} Kategorien trägt ein Plan nicht.</p>}
      {removing !== undefined && (
        <ConfirmDialog
          title={`Kategorie „${removing.title}“ löschen?`}
          message={removalMessage(countInCategory(plan, removing.id))}
          confirmLabel="Löschen"
          onConfirm={() => {
            onPlanChange(removeCategory(plan, removing.id));
            setRemovingId(null);
          }}
          onCancel={() => setRemovingId(null)}
          fallbackFocus={() => addRef.current}
        />
      )}
    </div>
  );
}
