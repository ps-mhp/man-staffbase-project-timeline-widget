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
 * Der Unterreiter „Inhalt“: welche Staffbase-Seite oder welchen News-Beitrag
 * die Leseansicht beim Klick auf den Eintrag öffnet, darunter die Anhänge.
 *
 * Erst die Art, dann die Auswahl — bei News erst der Kanal, dann der Beitrag.
 * Ein Wechsel der Art löst eine bestehende Verknüpfung gleich: sonst zeigte
 * der Reiter „News“, während der Eintrag noch auf eine Seite verwiese.
 * Entwürfe sind wählbar, die Redaktion verknüpft oft vor dem Veröffentlichen;
 * ein Hinweis sagt, dass Leser:innen sie erst danach sehen.
 *
 * Was es noch nicht gibt, legt „Neue Seite …“ bzw. „Neuer Beitrag …“ im
 * Staffbase-Editor an, der sich über den Plan-Editor legt; das Ergebnis ist
 * danach schon verknüpft.
 */

import * as React from "react";
import { ReactElement, useMemo, useState } from "react";

import { postTitle } from "@shared/staffbase/posts";
import { Created } from "@shared/studio-create/created";
import { StudioCreateLayer } from "@shared/studio-create/studio-create-layer";
import { CreateTarget } from "@shared/studio-create/studio-paths";

import { contentHref } from "../linked-content";
import { LinkedContent } from "../plan-model";
import { AttachmentsField } from "./attachments-field";
import { PanelProps, SelectField } from "./item-form-panels";
import { setContent } from "./link-edits";
import {
  CHANNEL_TYPE_LABELS,
  isDraft,
  refreshAfterCreate,
  useChannelPosts,
  useNewsChannels,
  usePages,
} from "./staffbase-catalog";

type Kind = "none" | LinkedContent["kind"];

const KIND_LABELS: Readonly<Record<Kind, string>> = {
  none: "Keine",
  page: "Seite",
  news: "News-Beitrag",
};

/** Eine Wahl, die nicht (mehr) in der Liste steht, bleibt sichtbar statt leer. */
function stale(id: string, title: string | undefined, ready: boolean, where: string): ReactElement {
  return (
    <option value={id}>
      {title ?? id}
      {ready ? ` (nicht ${where})` : ""}
    </option>
  );
}

/** Der Knopf, der den Staffbase-Editor zum Anlegen öffnet. */
function CreateButton({ label, onClick }: { label: string; onClick: () => void }): ReactElement {
  return (
    <div className="man-pt-editor__actions">
      <button type="button" className="man-pt-editor__button" onClick={onClick}>
        {label}
      </button>
    </div>
  );
}

function PagePicker({
  selected,
  onPick,
  onCreate,
}: {
  selected?: Extract<LinkedContent, { kind: "page" }>;
  onPick: (content: LinkedContent) => void;
  onCreate: () => void;
}) {
  const pages = usePages();
  const ready = pages.status === "ready";
  const listed = selected !== undefined && pages.items.some((page) => page.id === selected.id);
  return (
    <>
      <SelectField
        label="Seite"
        value={selected?.id ?? ""}
        onChange={(id) => {
          const page = pages.items.find((entry) => entry.id === id);
          if (page !== undefined) onPick({ kind: "page", id: page.id, menuId: page.menuId, title: page.title });
        }}
      >
        <option value="" disabled>
          {ready ? "Seite wählen …" : "Seiten werden geladen …"}
        </option>
        {selected !== undefined && !listed && stale(selected.id, selected.title, ready, "im Katalog")}
        {pages.items.map((page) => (
          <option key={page.id} value={page.id}>
            {page.title}
          </option>
        ))}
      </SelectField>
      {ready && pages.items.length === 0 && <p className="man-pt-editor__hint">Keine Seiten gefunden.</p>}
      <CreateButton label="Neue Seite …" onClick={onCreate} />
    </>
  );
}

function NewsPicker({
  selected,
  channelId,
  onChannel,
  onPick,
  onCreate,
}: {
  selected?: Extract<LinkedContent, { kind: "news" }>;
  channelId: string;
  onChannel: (id: string) => void;
  onPick: (content: LinkedContent) => void;
  onCreate: () => void;
}) {
  const channels = useNewsChannels();
  const posts = useChannelPosts(channelId);
  const channelsReady = channels.status === "ready";
  const postsReady = posts.status === "ready";
  const current = selected !== undefined && selected.channelId === channelId ? selected : undefined;
  const listed = current !== undefined && posts.items.some((post) => post.id === current.id);
  return (
    <>
      <SelectField label="Kanal" value={channelId} onChange={onChannel}>
        <option value="" disabled>
          {channelsReady ? "Kanal wählen …" : "Kanäle werden geladen …"}
        </option>
        {channels.items.map((channel) => (
          <option key={channel.id} value={channel.id}>
            {channel.type === undefined ? channel.title : `${channel.title} (${CHANNEL_TYPE_LABELS[channel.type]})`}
          </option>
        ))}
      </SelectField>
      {channelsReady && channels.items.length === 0 && <p className="man-pt-editor__hint">Keine News-Kanäle gefunden.</p>}
      {channelId !== "" && (
        <SelectField
          label="Beitrag"
          value={current?.id ?? ""}
          onChange={(id) => {
            const post = posts.items.find((entry) => entry.id === id);
            if (post !== undefined) onPick({ kind: "news", id: post.id, channelId, title: postTitle(post) });
          }}
        >
          <option value="" disabled>
            {postsReady ? "Beitrag wählen …" : "Beiträge werden geladen …"}
          </option>
          {current !== undefined && !listed && stale(current.id, current.title, postsReady, "im Kanal")}
          {posts.items.map((post) => (
            <option key={post.id} value={post.id}>
              {isDraft(post) ? `${postTitle(post)} (Entwurf)` : postTitle(post)}
            </option>
          ))}
        </SelectField>
      )}
      {/* Ein Beitrag entsteht immer in einem Kanal — erst der, dann der Knopf. */}
      {channelId !== "" && <CreateButton label="Neuer Beitrag …" onClick={onCreate} />}
    </>
  );
}

/** Wohin die Verknüpfung führt, und ob Leser:innen dort schon etwas sehen. */
function Summary({ content }: { content: LinkedContent }): ReactElement {
  const posts = useChannelPosts(content.kind === "news" ? (content.channelId ?? "") : "");
  const draft = content.kind === "news" && posts.items.some((post) => post.id === content.id && isDraft(post));
  return (
    <p className="man-pt-editor__hint">
      {draft && "Entwurf — Leser:innen sehen ihn erst nach dem Veröffentlichen. "}
      <a href={contentHref(content)} target="_blank" rel="noopener noreferrer">
        In neuem Tab öffnen
      </a>
    </p>
  );
}

export function ContentPanel({ plan, item, onPlanChange }: PanelProps): ReactElement {
  const content = item.content;
  const [kind, setKind] = useState<Kind>(content?.kind ?? "none");
  const [channelId, setChannelId] = useState(content?.kind === "news" ? (content.channelId ?? "") : "");

  const [creating, setCreating] = useState<CreateTarget | null>(null);
  // Was im Plan schon verknüpft ist, gilt beim Anlegen nie als neu — sonst
  // böte die Rückfallebene an, was eben erst an einem anderen Eintrag hängt.
  const linkedIds = useMemo(
    () => new Set(plan.items.flatMap((entry) => (entry.content === undefined ? [] : [entry.content.id]))),
    [plan.items],
  );

  const link = (next: LinkedContent | undefined): void => onPlanChange(setContent(plan, item.id, next));

  const linkCreated = (created: Created): void => {
    refreshAfterCreate(created);
    link(created);
  };

  const changeKind = (next: Kind): void => {
    setKind(next);
    if (content !== undefined && content.kind !== next) link(undefined);
  };

  return (
    <>
      <SelectField label="Verknüpfung" value={kind} onChange={(value) => changeKind(value as Kind)}>
        {(Object.keys(KIND_LABELS) as Kind[]).map((entry) => (
          <option key={entry} value={entry}>
            {KIND_LABELS[entry]}
          </option>
        ))}
      </SelectField>
      {kind === "page" && (
        <PagePicker
          selected={content?.kind === "page" ? content : undefined}
          onPick={link}
          onCreate={() => setCreating({ kind: "page" })}
        />
      )}
      {kind === "news" && (
        <NewsPicker
          selected={content?.kind === "news" ? content : undefined}
          channelId={channelId}
          onChannel={setChannelId}
          onPick={link}
          onCreate={() => setCreating({ kind: "news", channelId })}
        />
      )}
      {creating !== null && (
        <StudioCreateLayer
          target={creating}
          exclude={linkedIds}
          onCreated={linkCreated}
          onClose={() => setCreating(null)}
        />
      )}
      {content !== undefined && <Summary content={content} />}
      <AttachmentsField plan={plan} item={item} onPlanChange={onPlanChange} />
    </>
  );
}
