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
 * Was an einem Eintrag hängt: höchstens ein Inhalt (eine Staffbase-Seite oder
 * ein News-Beitrag), den die Leseansicht im Modal zeigt, und Anhänge aus
 * Staffbase Media.
 *
 * Gespeichert werden IDs, keine Adressen: ein gespeicherter Wert landet als
 * `src` eines iFrames oder `href` eines Links, und dort soll nur eine Adresse
 * der eigenen App ankommen können. Die Adressen entstehen in
 * `@shared/staffbase/ids`. Gelesen wird nur, was geprüft ist; Fremdes in einer
 * Verknüpfung reist nicht mit — anders als bei Einträgen, deren unbekannte
 * Felder eine spätere Version geschrieben haben kann.
 */

import { isMediaUrl, isStaffbaseId, pageHref, postHref } from "@shared/staffbase/ids";

export type LinkedContent =
  | { kind: "page"; id: string; menuId: string; title?: string }
  | { kind: "news"; id: string; channelId?: string; title?: string };

export interface Attachment {
  /** Die Kennung in der Medienbibliothek; auch Schlüssel in Liste und Übersetzung. */
  mediaId: string;
  /** Eine Medien-URL der eigenen Herkunft (`/api/media/…`). */
  url: string;
  fileName: string;
  kind: "image" | "file";
  /** Beschriftung; fehlt sie, gilt der Dateiname. */
  label?: string;
  width?: number;
  height?: number;
}

/** Mehr Anhänge nimmt ein Eintrag nicht. */
export const LIMIT_ATTACHMENTS = 10;

/** Medien-IDs sind undurchsichtig; geprüft wird nur, dass nichts Unerwartetes darin steht. */
const MEDIA_ID = /^[A-Za-z0-9_.:-]{1,128}$/;

type Raw = Record<string, unknown>;

const isRecord = (value: unknown): value is Raw => typeof value === "object" && value !== null && !Array.isArray(value);

const asText = (value: unknown): string | undefined =>
  typeof value === "string" && value.trim() !== "" ? value.trim() : undefined;

const asPositive = (value: unknown): number | undefined =>
  typeof value === "number" && Number.isFinite(value) && value > 0 ? value : undefined;

/** Liest den Inhalt eines Eintrags; `dropped` ist 1, wenn einer da war, aber nicht taugte. */
export function readContent(value: unknown): { content?: LinkedContent; dropped: number } {
  if (value === undefined || value === null) return { dropped: 0 };
  if (!isRecord(value) || !isStaffbaseId(value.id)) return { dropped: 1 };
  const title = asText(value.title);

  if (value.kind === "page") {
    if (!isStaffbaseId(value.menuId)) return { dropped: 1 };
    const content: LinkedContent = { kind: "page", id: value.id, menuId: value.menuId };
    return { content: title === undefined ? content : { ...content, title }, dropped: 0 };
  }
  if (value.kind === "news") {
    const content: LinkedContent = { kind: "news", id: value.id };
    if (isStaffbaseId(value.channelId)) content.channelId = value.channelId;
    if (title !== undefined) content.title = title;
    return { content, dropped: 0 };
  }
  return { dropped: 1 };
}

function readAttachment(raw: unknown): Attachment | null {
  if (!isRecord(raw)) return null;
  const mediaId = asText(raw.mediaId);
  const url = asText(raw.url);
  const fileName = asText(raw.fileName);
  if (mediaId === undefined || !MEDIA_ID.test(mediaId)) return null;
  if (url === undefined || !isMediaUrl(url)) return null;
  if (fileName === undefined) return null;
  if (raw.kind !== "image" && raw.kind !== "file") return null;

  const attachment: Attachment = { mediaId, url, fileName, kind: raw.kind };
  const label = asText(raw.label);
  if (label !== undefined) attachment.label = label;
  const width = asPositive(raw.width);
  const height = asPositive(raw.height);
  if (width !== undefined) attachment.width = width;
  if (height !== undefined) attachment.height = height;
  return attachment;
}

/** Liest die Anhänge; doppelte, ungültige und solche über der Grenze fallen weg und zählen. */
export function readAttachments(value: unknown): { attachments?: Attachment[]; dropped: number } {
  if (!Array.isArray(value)) return { dropped: value === undefined || value === null ? 0 : 1 };
  const attachments: Attachment[] = [];
  const seen = new Set<string>();
  for (const raw of value) {
    const attachment = readAttachment(raw);
    if (attachment === null || seen.has(attachment.mediaId) || attachments.length >= LIMIT_ATTACHMENTS) continue;
    seen.add(attachment.mediaId);
    attachments.push(attachment);
  }
  const dropped = value.length - attachments.length;
  return attachments.length === 0 ? { dropped } : { attachments, dropped };
}

/** Die Leseadresse eines Inhalts — für „In neuem Tab öffnen“ und den Export. */
export function contentHref(content: LinkedContent): string {
  return content.kind === "page" ? pageHref(content.menuId) : postHref(content.id);
}
