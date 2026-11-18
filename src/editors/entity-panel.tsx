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
 * Der Rahmen der Reiter „Ebenen“ und „Kategorien“ im Panel rechts: ein Satz
 * Erklärung, „Neu …“ und die Liste der Zeilen.
 */

import * as React from "react";
import { ReactElement, ReactNode, RefObject } from "react";
import { Plus } from "lucide-react";

import { Button } from "@man/config-ui/primitives/button";

export interface EntityPanelProps {
  hint: string;
  addLabel: string;
  addRef: RefObject<HTMLButtonElement | null>;
  /** Obergrenze erreicht: „Neu …“ ist gesperrt. */
  full: boolean;
  onAdd: () => void;
  /** Der Text, solange es keine Zeile gibt. */
  empty?: string;
  listLabel: string;
  /** Eine offene Rückfrage; sie legt sich über den Editor. */
  dialog?: ReactNode;
  /** Die Zeilen. */
  children: ReactNode;
}

export function EntityPanel({
  hint,
  addLabel,
  addRef,
  full,
  onAdd,
  empty,
  listLabel,
  dialog,
  children,
}: EntityPanelProps): ReactElement {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-[13px] text-muted-foreground">{hint}</p>
      <div>
        <Button ref={addRef} type="button" variant="outline" disabled={full} onClick={onAdd}>
          <Plus aria-hidden />
          {addLabel}
        </Button>
      </div>
      {empty !== undefined ? (
        <p className="text-[13px] text-muted-foreground">{empty}</p>
      ) : (
        <ol className="flex flex-col gap-2" aria-label={listLabel}>
          {children}
        </ol>
      )}
      {dialog}
    </div>
  );
}
