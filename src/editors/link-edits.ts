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
 * Bearbeitet, was an einem Eintrag hängt: den verknüpften Inhalt und die
 * Anhänge. Wie alles in `plan-edits.ts` rein und unveränderlich; jede
 * Änderung stempelt das Stand-Datum. Gibt es Eintrag oder Anhang nicht, kommt
 * derselbe Plan zurück — so erkennt der Aufrufer „nichts geschehen“ an der
 * Identität, und React rendert nicht umsonst.
 */

import { Attachment, LIMITS, LinkedContent, Plan, PlanItem } from "../plan-model";
import { touch, withOptional } from "./plan-edits";

/** Ändert genau einen Eintrag; `null` aus `change` heißt: nichts zu tun. */
function changeItem(
  plan: Plan,
  itemId: string,
  change: (item: PlanItem) => PlanItem | null,
  now: Date,
): Plan {
  const index = plan.items.findIndex((item) => item.id === itemId);
  if (index === -1) return plan;
  const next = change(plan.items[index]);
  if (next === null) return plan;
  const items = plan.items.map((item, position) => (position === index ? next : item));
  return touch({ ...plan, items }, now);
}

/** Setzt die Liste der Anhänge; eine leere fällt ganz weg. */
const withAttachments = (item: PlanItem, attachments: Attachment[]): PlanItem =>
  withOptional(item, "attachments", attachments.length > 0 ? attachments : undefined);

/** Verknüpft einen Inhalt oder löst ihn (`undefined`). */
export function setContent(
  plan: Plan,
  itemId: string,
  content: LinkedContent | undefined,
  now: Date = new Date(),
): Plan {
  return changeItem(plan, itemId, (item) => withOptional(item, "content", content), now);
}

/** Hängt ein Medium an — nicht doppelt und nicht über die Grenze hinaus. */
export function addAttachment(
  plan: Plan,
  itemId: string,
  attachment: Attachment,
  now: Date = new Date(),
): Plan {
  return changeItem(
    plan,
    itemId,
    (item) => {
      const current = item.attachments ?? [];
      if (current.length >= LIMITS.attachments) return null;
      if (current.some((entry) => entry.mediaId === attachment.mediaId)) return null;
      return withAttachments(item, [...current, attachment]);
    },
    now,
  );
}

/** Beschriftet einen Anhang; leer gilt wieder der Dateiname. */
export function setAttachmentLabel(
  plan: Plan,
  itemId: string,
  mediaId: string,
  label: string,
  now: Date = new Date(),
): Plan {
  return changeItem(
    plan,
    itemId,
    (item) => {
      const current = item.attachments ?? [];
      if (!current.some((entry) => entry.mediaId === mediaId)) return null;
      const trimmed = label.trim();
      return withAttachments(
        item,
        current.map((entry) =>
          entry.mediaId === mediaId ? withOptional(entry, "label", trimmed === "" ? undefined : trimmed) : entry,
        ),
      );
    },
    now,
  );
}

/** Schiebt einen Anhang an die Stelle `to`, begrenzt auf die Liste. */
export function moveAttachment(
  plan: Plan,
  itemId: string,
  mediaId: string,
  to: number,
  now: Date = new Date(),
): Plan {
  return changeItem(
    plan,
    itemId,
    (item) => {
      const current = item.attachments ?? [];
      const from = current.findIndex((entry) => entry.mediaId === mediaId);
      if (from === -1) return null;
      const rest = current.filter((_, index) => index !== from);
      const target = Math.min(Math.max(to, 0), rest.length);
      return withAttachments(item, [...rest.slice(0, target), current[from], ...rest.slice(target)]);
    },
    now,
  );
}

/** Entfernt einen Anhang; der letzte nimmt die Liste mit. */
export function removeAttachment(
  plan: Plan,
  itemId: string,
  mediaId: string,
  now: Date = new Date(),
): Plan {
  return changeItem(
    plan,
    itemId,
    (item) => {
      const current = item.attachments ?? [];
      if (!current.some((entry) => entry.mediaId === mediaId)) return null;
      return withAttachments(
        item,
        current.filter((entry) => entry.mediaId !== mediaId),
      );
    },
    now,
  );
}
