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
 * Der Reiter „Ebenen“: anlegen, umbenennen, umsortieren, löschen.
 *
 * Eine belegte Ebene zu löschen, fragt, wohin ihre Einträge sollen. Einfach
 * mitzulöschen wäre schnell, aber ein Fehlklick nähme Dutzende Einträge mit;
 * einfach zu verschieben wüsste nicht, wohin.
 */

import * as React from "react";
import { ReactElement, useId, useRef, useState } from "react";

import { LIMITS, Lane, Plan } from "../plan-model";
import { ConfirmDialog } from "./confirm-dialog";
import { EntityRow } from "./entity-row";
import { addLane, moveLane, removeLane, renameLane } from "./plan-edits";
import { countInLane, countLabel } from "./plan-queries";

export interface LaneEditorProps {
  plan: Plan;
  onPlanChange: (plan: Plan) => void;
}

interface RemoveLaneDialogProps {
  plan: Plan;
  lane: Lane;
  /** `target`: Ziel-Ebene der Einträge, oder `null` zum Mitlöschen. */
  onConfirm: (target: string | null) => void;
  onCancel: () => void;
  fallbackFocus: () => HTMLElement | null;
}

function RemoveLaneDialog({ plan, lane, onConfirm, onCancel, fallbackFocus }: RemoveLaneDialogProps): ReactElement {
  const choiceName = useId();
  const targetId = useId();
  const count = countInLane(plan, lane.id);
  const others = plan.lanes.filter((entry) => entry.id !== lane.id);
  const [mode, setMode] = useState<"move" | "delete">(others.length > 0 ? "move" : "delete");
  const [target, setTarget] = useState(others[0]?.id ?? "");

  const choices =
    count === 0 ? undefined : (
      <>
        {others.length > 0 && (
          <div className="man-pt-editor__choice">
            <label className="man-pt-editor__check">
              <input
                type="radio"
                name={choiceName}
                checked={mode === "move"}
                onChange={() => setMode("move")}
              />
              {countLabel(count)} verschieben nach
            </label>
            <label className="man-pt-editor__sr-only" htmlFor={targetId}>
              Ziel-Ebene
            </label>
            <select
              id={targetId}
              className="man-pt-editor__select"
              value={target}
              onChange={(event) => {
                setTarget(event.target.value);
                setMode("move");
              }}
            >
              {others.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.title}
                </option>
              ))}
            </select>
          </div>
        )}
        <label className="man-pt-editor__check">
          <input type="radio" name={choiceName} checked={mode === "delete"} onChange={() => setMode("delete")} />
          Mit Einträgen löschen
        </label>
      </>
    );

  return (
    <ConfirmDialog
      title={`Ebene „${lane.title}“ löschen?`}
      message={count === 0 ? "Die Ebene enthält keine Einträge." : `Die Ebene enthält ${countLabel(count)}.`}
      confirmLabel="Löschen"
      onConfirm={() => onConfirm(count > 0 && mode === "move" ? target : null)}
      onCancel={onCancel}
      fallbackFocus={fallbackFocus}
    >
      {choices}
    </ConfirmDialog>
  );
}

export function LaneEditor({ plan, onPlanChange }: LaneEditorProps): ReactElement {
  const [focusId, setFocusId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const addRef = useRef<HTMLButtonElement>(null);
  const full = plan.lanes.length >= LIMITS.lanes;
  const removing = plan.lanes.find((lane) => lane.id === removingId);

  const add = (): void => {
    const { plan: next, id } = addLane(plan);
    if (id === null) return;
    onPlanChange(next);
    setFocusId(id);
  };

  return (
    <div className="man-pt-editor__entities">
      <p className="man-pt-editor__hint">Die Ebenen stehen im Plan in dieser Reihenfolge untereinander.</p>
      {plan.lanes.length === 0 ? (
        <p className="man-pt-editor__hint">Noch keine Ebenen.</p>
      ) : (
        <ol className="man-pt-editor__entity-list" aria-label="Ebenen">
          {plan.lanes.map((lane, index) => (
            <EntityRow
              key={lane.id}
              noun="Ebene"
              position={index + 1}
              title={lane.title}
              count={countInLane(plan, lane.id)}
              isFirst={index === 0}
              isLast={index === plan.lanes.length - 1}
              autoFocus={lane.id === focusId}
              onRename={(title) => onPlanChange(renameLane(plan, lane.id, title))}
              onMove={(offset) => onPlanChange(moveLane(plan, lane.id, offset))}
              onRemove={() => setRemovingId(lane.id)}
            />
          ))}
        </ol>
      )}
      <div className="man-pt-editor__actions">
        <button ref={addRef} type="button" className="man-pt-editor__button" disabled={full} onClick={add}>
          Neue Ebene
        </button>
      </div>
      {full && <p className="man-pt-editor__hint">Mehr als {LIMITS.lanes} Ebenen trägt ein Plan nicht.</p>}
      {removing !== undefined && (
        <RemoveLaneDialog
          plan={plan}
          lane={removing}
          onConfirm={(target) => {
            onPlanChange(removeLane(plan, removing.id, target));
            setRemovingId(null);
          }}
          onCancel={() => setRemovingId(null)}
          fallbackFocus={() => addRef.current}
        />
      )}
    </div>
  );
}
