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

import { Attachment, LIMIT_ATTACHMENTS, LinkedContent, contentHref, readAttachments, readContent } from "./linked-content";

const PAGE_ID = "6abe2602f70f4a552a0470c3";
const MENU_ID = "6abe2602f70f4a552a0470c4";
const POST_ID = "6a7b213404bf7d770c9d579a";
const CHANNEL_ID = "6a7c1c3995be7a202d6116b8";
const MEDIA_URL = "/api/media/secure/external/v2/raw/upload/abc.pdf";

describe("readContent", () => {
  it("liest eine Seite samt menuId und Titel", () => {
    expect(readContent({ kind: "page", id: PAGE_ID, menuId: MENU_ID, title: "Release 3.4" })).toEqual({
      content: { kind: "page", id: PAGE_ID, menuId: MENU_ID, title: "Release 3.4" },
      dropped: 0,
    });
  });

  it("liest einen Beitrag, der Kanal ist freiwillig", () => {
    expect(readContent({ kind: "news", id: POST_ID, channelId: CHANNEL_ID })).toEqual({
      content: { kind: "news", id: POST_ID, channelId: CHANNEL_ID },
      dropped: 0,
    });
    expect(readContent({ kind: "news", id: POST_ID, channelId: "kaputt" })).toEqual({
      content: { kind: "news", id: POST_ID },
      dropped: 0,
    });
  });

  it("zählt nichts, wenn es keine Verknüpfung gibt", () => {
    expect(readContent(undefined)).toEqual({ dropped: 0 });
  });

  it.each([
    ["unbekannte Art", { kind: "url", id: PAGE_ID }],
    ["Seite ohne menuId", { kind: "page", id: PAGE_ID }],
    ["menuId mit Pfad", { kind: "page", id: PAGE_ID, menuId: "../../admin" }],
    ["Beitrag ohne gültige ID", { kind: "news", id: "javascript:alert(1)" }],
    ["keine Struktur", "https://evil.example"],
  ])("verwirft %s und zählt sie", (_label, raw) => {
    expect(readContent(raw)).toEqual({ dropped: 1 });
  });

  it("übernimmt nur geprüfte Felder — Fremdes reist nicht mit", () => {
    const { content } = readContent({ kind: "page", id: PAGE_ID, menuId: MENU_ID, href: "javascript:alert(1)" });
    expect(content).toEqual({ kind: "page", id: PAGE_ID, menuId: MENU_ID });
  });
});

describe("readAttachments", () => {
  const file: Attachment = { mediaId: "m1", url: MEDIA_URL, fileName: "Info.pdf", kind: "file" };

  it("liest Dateien und Bilder in ihrer Reihenfolge", () => {
    const image = { mediaId: "m2", url: "/api/media/secure/external/v2/image/upload/b.png", fileName: "b.png", kind: "image", width: 800, height: 600, label: "Ablauf" };
    expect(readAttachments([file, image])).toEqual({ attachments: [file, image], dropped: 0 });
  });

  it("lässt die Liste weg, wenn nichts bleibt", () => {
    expect(readAttachments([])).toEqual({ dropped: 0 });
    expect(readAttachments(undefined)).toEqual({ dropped: 0 });
  });

  it.each([
    ["fremde Herkunft", { ...file, url: "https://evil.example/api/media/x.pdf" }],
    ["anderer Pfad", { ...file, url: "/api/users/me" }],
    ["ohne Dateinamen", { ...file, fileName: "" }],
    ["unbekannte Art", { ...file, kind: "video" }],
    ["ID mit Leerzeichen", { ...file, mediaId: "a b" }],
  ])("verwirft einen Anhang mit %s und zählt ihn", (_label, raw) => {
    expect(readAttachments([raw, file])).toEqual({ attachments: [file], dropped: 1 });
  });

  it("verwirft doppelte Anhänge und alles über der Grenze", () => {
    const many = Array.from({ length: LIMIT_ATTACHMENTS + 2 }, (_, index) => ({ ...file, mediaId: `m${index}` }));
    const { attachments, dropped } = readAttachments([...many, many[0]]);
    expect(attachments).toHaveLength(LIMIT_ATTACHMENTS);
    expect(dropped).toBe(3);
  });

  it("nimmt Maße nur als positive Zahlen und eine Beschriftung nur mit Inhalt", () => {
    const { attachments } = readAttachments([{ ...file, width: -1, height: "10", label: "  " }]);
    expect(attachments).toEqual([file]);
  });
});

describe("contentHref", () => {
  it("bildet die Leseadresse aus der menuId der Seite bzw. der ID des Beitrags", () => {
    const page: LinkedContent = { kind: "page", id: PAGE_ID, menuId: MENU_ID };
    const news: LinkedContent = { kind: "news", id: POST_ID };
    expect(contentHref(page)).toBe(`/content/page/${MENU_ID}`);
    expect(contentHref(news)).toBe(`/content/news/article/${POST_ID}`);
  });
});
