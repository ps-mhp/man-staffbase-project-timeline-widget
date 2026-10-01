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
 * Die Anhänge eines Eintrags: Dateien und Bilder aus Staffbase Media, die
 * die Leseansicht neben dem verknüpften Inhalt bzw. in den Details zeigt.
 *
 * Gewählt wird in der Medienbibliothek, ohne zu veröffentlichen: ein Anhang
 * behält die geschützte Adresse, und Staffbase prüft beim Abruf weiter die
 * Rechte der lesenden Person. Die Reihenfolge ändern zwei Knöpfe je Zeile —
 * mit Tastatur und Screenreader so gut bedienbar wie mit der Maus.
 */

import * as React from "react";
import { ReactElement, useId, useMemo, useState } from "react";

import { createMediaClient, extensionOf } from "@shared/media/media-client";
import { MediaPicker, PickedMedia } from "@shared/media/media-picker";

import { Attachment, LIMITS } from "../plan-model";
import { DraftField } from "./draft-field";
import { PanelProps } from "./item-form-panels";
import { addAttachment, moveAttachment, removeAttachment, setAttachmentLabel } from "./link-edits";

const kindLabel = (attachment: Attachment): string =>
  attachment.kind === "image" ? "Bild" : (extensionOf(attachment.fileName)?.toUpperCase() ?? "Datei");

function toAttachment(media: PickedMedia): Attachment {
  const attachment: Attachment = { mediaId: media.id, url: media.url, fileName: media.fileName, kind: media.kind };
  if (media.width !== undefined) attachment.width = media.width;
  if (media.height !== undefined) attachment.height = media.height;
  return attachment;
}

export function AttachmentsField({ plan, item, onPlanChange }: PanelProps): ReactElement {
  const headingId = useId();
  const client = useMemo(() => createMediaClient(), []);
  const [picking, setPicking] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const attachments = item.attachments ?? [];
  const full = attachments.length >= LIMITS.attachments;

  const pick = (media: PickedMedia): void => {
    setPicking(false);
    const next = addAttachment(plan, item.id, toAttachment(media));
    // Derselbe Plan zurück heißt: nichts angehängt — schon da oder voll.
    if (next === plan) {
      setNotice(
        attachments.some((entry) => entry.mediaId === media.id)
          ? `„${media.fileName}“ hängt schon an.`
          : `Höchstens ${LIMITS.attachments} Anhänge je Eintrag.`,
      );
      return;
    }
    setNotice(null);
    onPlanChange(next);
  };

  return (
    <section className="man-pt-editor__attachments" aria-labelledby={headingId}>
      <h4 id={headingId} className="man-pt-editor__subheading">
        Anhänge
      </h4>
      {attachments.length === 0 ? (
        <p className="man-pt-editor__hint">Keine Anhänge.</p>
      ) : (
        // `role="list"`: ohne Aufzählungszeichen nähme Safari der Liste sonst die Rolle.
        <ul className="man-pt-editor__attachment-list" role="list" aria-label="Anhänge">
          {attachments.map((attachment, index) => (
            <li key={attachment.mediaId} className="man-pt-editor__attachment">
              <span className="man-pt-editor__attachment-kind">{kindLabel(attachment)}</span>
              <span className="man-pt-editor__attachment-name">{attachment.fileName}</span>
              <DraftField
                label={`Beschriftung von „${attachment.fileName}“`}
                hideLabel
                placeholder="Beschriftung (optional)"
                value={attachment.label ?? ""}
                className="man-pt-editor__attachment-label"
                onCommit={(text) => onPlanChange(setAttachmentLabel(plan, item.id, attachment.mediaId, text))}
              />
              <span className="man-pt-editor__attachment-actions">
                <button
                  type="button"
                  className="man-pt-editor__button man-pt-editor__button--icon"
                  aria-label={`„${attachment.fileName}“ nach oben`}
                  disabled={index === 0}
                  onClick={() => onPlanChange(moveAttachment(plan, item.id, attachment.mediaId, index - 1))}
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="man-pt-editor__button man-pt-editor__button--icon"
                  aria-label={`„${attachment.fileName}“ nach unten`}
                  disabled={index === attachments.length - 1}
                  onClick={() => onPlanChange(moveAttachment(plan, item.id, attachment.mediaId, index + 1))}
                >
                  ↓
                </button>
                <button
                  type="button"
                  className="man-pt-editor__button man-pt-editor__button--icon"
                  aria-label={`„${attachment.fileName}“ entfernen`}
                  onClick={() => onPlanChange(removeAttachment(plan, item.id, attachment.mediaId))}
                >
                  ×
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}
      <div className="man-pt-editor__actions">
        <button
          type="button"
          className="man-pt-editor__button"
          disabled={full}
          onClick={() => {
            setNotice(null);
            setPicking(true);
          }}
        >
          Datei oder Bild hinzufügen …
        </button>
      </div>
      {full && <p className="man-pt-editor__hint">Höchstens {LIMITS.attachments} Anhänge je Eintrag.</p>}
      {notice !== null && (
        <p className="man-pt-editor__hint" role="status">
          {notice}
        </p>
      )}
      {picking && (
        <MediaPicker client={client} accept="all" publish={false} onSelect={pick} onClose={() => setPicking(false)} />
      )}
    </section>
  );
}
