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
 * Der verknüpfte Inhalt eines Eintrags über dem Plan: eine Seite im iFrame
 * oder ein Beitrag, geladen mit der Sitzung der lesenden Person — ohne
 * API-Key, also mit genau den Rechten, die sie ohnehin hat. Im Kopf stehen
 * Titel, Art, Termin und Kategorie des Eintrags und immer „In neuem Tab
 * öffnen“: auch wenn der Beitrag hier nicht lädt, führt der Link weiter.
 * Anhänge stehen daneben, auf schmalen Bildschirmen darunter.
 */

import * as React from "react";
import { ReactElement, useCallback, useEffect, useState } from "react";

import { AttachmentList } from "@shared/content-modal/attachment-list";
import { ContentModal } from "@shared/content-modal/content-modal";
import { PageFrame } from "@shared/content-modal/page-frame";
import { PostBody } from "@shared/staffbase/post-body";
import { ensurePostStyles } from "@shared/staffbase/post-styles";
import { Post, PostContent, pickLocalizedContent, requestPost, userLocales } from "@shared/staffbase/posts";

import { kindAndTerm } from "./item-text";
import { attachmentEntries, contentHref } from "./linked-content";
import { Plan, PlanItem, categoryOf } from "./plan-model";

const LOADING = "Beitrag wird geladen …";
const UNAVAILABLE = "Dieser Beitrag ist nicht verfügbar oder nicht freigegeben.";
const UNREACHABLE = "Der Beitrag konnte nicht geladen werden.";
const EMPTY = "Der Beitrag enthält keine anzeigbaren Inhalte.";

type NewsState =
  | { status: "loading" }
  | { status: "ready"; post: Post; content: PostContent }
  | { status: "error"; message: string };

function NewsContent({ postId }: { postId: string }): ReactElement {
  const [state, setState] = useState<NewsState>({ status: "loading" });

  // Das Stylesheet gehört in die Wurzel, in der der Beitrag steht — das Modal
  // hängt an `document.body` oder im Vollbild am Widget.
  const anchorStyles = useCallback((element: HTMLElement | null) => {
    if (element !== null) ensurePostStyles(element);
  }, []);

  useEffect(() => {
    let current = true;
    setState({ status: "loading" });
    void Promise.all([requestPost(postId), userLocales()]).then(([response, locales]) => {
      if (!current) return;
      if (response.post === null) {
        // 403 und 404 heißen für Leser:innen dasselbe: hier gibt es nichts zu lesen.
        setState({ status: "error", message: response.status === null ? UNREACHABLE : UNAVAILABLE });
        return;
      }
      const content = pickLocalizedContent(response.post.contents, locales);
      setState(content === null ? { status: "error", message: EMPTY } : { status: "ready", post: response.post, content });
    });
    return () => {
      current = false;
    };
  }, [postId]);

  return (
    <div ref={anchorStyles} className="post-display man-cm__padded">
      {state.status === "loading" && <p className="post-display__status">{LOADING}</p>}
      {state.status === "error" && <p className="post-display__error">{state.message}</p>}
      {state.status === "ready" && <PostBody post={state.post} content={state.content} withMedia />}
    </div>
  );
}

export interface LinkedContentModalProps {
  plan: Plan;
  item: PlanItem;
  locale: string;
  onClose: () => void;
  /** Im Vollbild das Vollbild-Element, sonst `document.body`. */
  container?: Element | null;
}

export function LinkedContentModal({ plan, item, locale, onClose, container }: LinkedContentModalProps): ReactElement | null {
  const content = item.content;
  if (content === undefined) return null;
  const href = contentHref(content);
  const meta = [kindAndTerm(item, locale), categoryOf(plan, item)?.title].filter(Boolean).join(" · ");
  const attachments = attachmentEntries(item.attachments);

  return (
    <ContentModal
      title={item.title}
      meta={meta}
      href={href}
      onClose={onClose}
      container={container}
      aside={attachments.length > 0 ? <AttachmentList entries={attachments} /> : undefined}
    >
      {content.kind === "page" ? <PageFrame href={href} title={item.title} /> : <NewsContent postId={content.id} />}
    </ContentModal>
  );
}
