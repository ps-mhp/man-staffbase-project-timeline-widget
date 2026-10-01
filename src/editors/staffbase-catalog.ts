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
 * Was der Reiter „Inhalt“ aus Staffbase zur Auswahl braucht: Seiten, News-
 * Kanäle und deren Beiträge samt Entwürfen. Alles mit der Sitzung der
 * Redakteur:in, ohne API-Key.
 *
 * Einmal je Editor-Sitzung geladen: das Formular wird für jeden gewählten
 * Eintrag neu aufgebaut, und jeder Wechsel fragte sonst dieselben Listen neu.
 * Ein Fehler ist eine leere Liste — die Kataloge werfen nie.
 */

import { useEffect, useState } from "react";

import { fetchEntityCatalog } from "@shared/entity-picker/entity-catalog";
import { ChannelType, NewsChannel, fetchChannelPosts, fetchNewsChannels } from "@shared/staffbase/channels";
import { PageOption, pageCatalogSource } from "@shared/staffbase/pages";
import { Post, documentLocales, pickLocalizedContent } from "@shared/staffbase/posts";

/** So viele Beiträge zeigt die Auswahl je Kanal. */
const POST_LIMIT = 100;
/** Länger wird ein Name in der Auswahl nicht — eine Kurznachricht ist sonst ein Absatz. */
const MAX_LABEL = 80;

export type Loaded<T> = { status: "loading"; items: readonly T[] } | { status: "ready"; items: readonly T[] };

let pages: Promise<PageOption[]> | null = null;
let channels: Promise<NewsChannel[]> | null = null;
const postsByChannel = new Map<string, Promise<Post[]>>();

/** Für Tests: jede Prüfung beginnt ohne geladene Listen. */
export function resetStaffbaseCatalogs(): void {
  pages = null;
  channels = null;
  postsByChannel.clear();
}

const isPageOption = (option: { id: string }): option is PageOption =>
  typeof (option as Partial<PageOption>).menuId === "string";

const loadPages = (): Promise<PageOption[]> =>
  (pages ??= fetchEntityCatalog(pageCatalogSource).then((options) => options.filter(isPageOption)));

const loadChannels = (): Promise<NewsChannel[]> => (channels ??= fetchNewsChannels());

function loadPosts(channelId: string): Promise<Post[]> {
  let posts = postsByChannel.get(channelId);
  if (posts === undefined) {
    posts = fetchChannelPosts(channelId, POST_LIMIT, { drafts: true });
    postsByChannel.set(channelId, posts);
  }
  return posts;
}

/** Lädt eine Liste; ohne Schlüssel (`null`) gibt es nichts zu laden. */
function useLoaded<T>(key: string | null, load: () => Promise<T[]>): Loaded<T> {
  const [state, setState] = useState<{ key: string | null; items: readonly T[] } | null>(null);
  useEffect(() => {
    if (key === null) return;
    let current = true;
    void load().then((items) => {
      if (current) setState({ key, items });
    });
    return () => {
      current = false;
    };
    // Nur der Schlüssel: `load` ist bei jedem Rendern neu, lädt aber für
    // denselben Schlüssel dasselbe (und aus dem Zwischenspeicher).
  }, [key]);
  return state !== null && state.key === key ? { status: "ready", items: state.items } : { status: "loading", items: [] };
}

export const usePages = (): Loaded<PageOption> => useLoaded("pages", loadPages);

export const useNewsChannels = (): Loaded<NewsChannel> => useLoaded("channels", loadChannels);

export const useChannelPosts = (channelId: string): Loaded<Post> =>
  useLoaded(channelId === "" ? null : channelId, () => loadPosts(channelId));

export const CHANNEL_TYPE_LABELS: Readonly<Record<ChannelType, string>> = {
  articles: "Artikel",
  updates: "Kurznachricht",
  pictures: "Bildbeitrag",
};

/** Text aus dem HTML eines Beitrags. `DOMParser` führt nichts aus, er liest nur. */
function textOf(html: string | undefined): string {
  if (html === undefined || html.trim() === "") return "";
  const text = new DOMParser().parseFromString(html, "text/html").body.textContent ?? "";
  return text.replace(/\s+/g, " ").trim();
}

/**
 * Wie ein Beitrag in der Auswahl heißt: sein Titel, sonst — bei einer
 * Kurznachricht ohne Titel — der Anfang seines Texts.
 */
export function postTitle(post: Post): string {
  const content = pickLocalizedContent(post.contents, documentLocales());
  const text = textOf(content?.title) || textOf(content?.content) || textOf(content?.teaser);
  if (text === "") return post.id;
  return text.length <= MAX_LABEL ? text : `${text.slice(0, MAX_LABEL - 1).trimEnd()}…`;
}

/** Noch nicht veröffentlicht: Leser:innen sehen ihn nicht. */
export const isDraft = (post: Post): boolean => post.published === undefined || post.published === null || post.published === "";
