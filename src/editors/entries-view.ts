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
 * Wie der Reiter „Einträge“ gerade eingestellt ist: welche Art die Liste
 * zeigt, wonach gesucht wird, welcher Unterreiter des Formulars offen ist.
 *
 * Der Editor hält das, nicht der Reiter — so bleibt es beim Wechsel in
 * „Ebenen“ und zurück erhalten.
 *
 * Die Art folgt dem gewählten Eintrag: wählt die Vorschau einen Stichtag,
 * während die Liste Meilensteine zeigt, springt sie auf „Stichtage“, sonst
 * stünde der gewählte Eintrag nirgends in der Liste. Nur bei einer neuen
 * Auswahl oder wenn der Eintrag seine Art wechselt — wer danach selbst eine
 * andere Pille wählt, wird nicht zurückgeholt.
 */

import { useCallback, useState } from "react";

import { ItemKind, Plan } from "../plan-model";
import type { FormTab } from "./item-form";
import { ITEM_KINDS } from "./plan-queries";

export interface EntriesView {
  kind: ItemKind;
  query: string;
  formTab: FormTab;
}

/** Die erste Art, von der es Einträge gibt — sonst Meilensteine. */
function initialKind(plan: Plan): ItemKind {
  return (
    ITEM_KINDS.find((kind) => plan.items.some((item) => item.kind === kind)) ??
    "milestone"
  );
}

export function useEntriesView(
  plan: Plan,
  selectedId: string | null,
): [EntriesView, (patch: Partial<EntriesView>) => void] {
  const [view, setView] = useState<EntriesView>(() => ({
    kind: initialKind(plan),
    query: "",
    formTab: "general",
  }));
  const selected = plan.items.find((item) => item.id === selectedId);
  const followKey =
    selected === undefined ? "" : `${selected.id}|${selected.kind}`;
  const [followed, setFollowed] = useState(followKey);
  if (followKey !== followed) {
    setFollowed(followKey);
    if (selected !== undefined && selected.kind !== view.kind) {
      setView({ ...view, kind: selected.kind });
    }
  }

  const update = useCallback(
    (patch: Partial<EntriesView>) =>
      setView((previous) => ({ ...previous, ...patch })),
    [],
  );
  return [view, update];
}
