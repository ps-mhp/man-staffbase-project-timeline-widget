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
 * Die Liste der Einträge: nach Art umschalten, suchen, anlegen, wählen,
 * löschen.
 *
 * Nach Termin sortiert, nicht in der Reihenfolge des Attributs — so steht ein
 * Eintrag dort, wo die Redaktion ihn aus dem Zeitstrahl kennt. Umschalter,
 * „+“ und Suche stehen im festen Kopf; nur die Liste rollt.
 */

import * as React from "react";
import { ReactElement, useEffect, useId, useRef, useState } from "react";

import { ItemKind, LIMITS, Plan, colorOf } from "../plan-model";
import { SymbolGlyph } from "../symbol-glyph";
import { symbolOf } from "../symbols";
import { DeleteConfirm } from "./delete-confirm";
import { tabId } from "./editor-tabs";
import { Pane, PaneEmpty } from "./pane";
import { PillTabs } from "./pill-tabs";
import {
  ITEM_KINDS,
  KIND_LABELS,
  KIND_PLURALS,
  countDependents,
  kindCounts,
  laneLabel,
  scheduleLabel,
  visibleItems,
} from "./plan-queries";
import { scrollIntoContainer } from "./scroll-into-container";

/** Wohin der Fokus nach dem Löschen geht: eine Zeile oder, bei `null`, die Suche. */
export interface FocusRequest {
  id: string | null;
}

export interface ItemListProps {
  /** `id` des Bereichs — der Ziehgriff daneben nennt sie in `aria-controls`. */
  id?: string;
  plan: Plan;
  selectedId: string | null;
  locale: string;
  kind: ItemKind;
  onKindChange: (kind: ItemKind) => void;
  query: string;
  onQueryChange: (query: string) => void;
  onSelect: (id: string) => void;
  /** Legt einen Eintrag der gewählten Art an. */
  onAdd: () => void;
  /** Nach der Rückfrage: der Eintrag soll weg. */
  onRemove: (id: string) => void;
  focusRequest: FocusRequest | null;
  onFocusDone: () => void;
}

function TrashIcon(): ReactElement {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M6.5 1.5h3l.5 1H13V4H3V2.5h3l.5-1ZM4 5h8l-.6 8.6a1.5 1.5 0 0 1-1.5 1.4H6.1a1.5 1.5 0 0 1-1.5-1.4L4 5Zm2.3 1.5.3 6.5h1.1L7.5 6.5H6.3Zm2.2 0-.2 6.5h1.1l.3-6.5H8.5Z"
      />
    </svg>
  );
}

function addBlocker(plan: Plan, kind: ItemKind): string | null {
  if (plan.items.length >= LIMITS.items)
    return `Mehr als ${LIMITS.items} Einträge trägt ein Plan nicht.`;
  if (kind !== "deadline" && plan.lanes.length === 0)
    return "Meilensteine und Zeiträume brauchen eine Ebene. Ebenen entstehen im Reiter „Ebenen“.";
  return null;
}

function SearchField({
  query,
  onQueryChange,
  searchRef,
}: Pick<ItemListProps, "query" | "onQueryChange"> & {
  searchRef: React.RefObject<HTMLInputElement | null>;
}): ReactElement {
  const searchId = useId();
  return (
    <div className="man-pt-editor__field man-pt-editor__search">
      <label className="man-pt-editor__sr-only" htmlFor={searchId}>
        Einträge durchsuchen
      </label>
      <input
        ref={searchRef}
        id={searchId}
        type="search"
        className="man-pt-editor__input"
        placeholder="Einträge durchsuchen"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
      />
    </div>
  );
}

/** Die zweite Kopfzeile: die Arten als Pillen und „+“ für die gewählte. */
function KindBar({
  plan,
  kind,
  onKindChange,
  query,
  onAdd,
  listId,
  pillBase,
}: Pick<ItemListProps, "plan" | "kind" | "onKindChange" | "query" | "onAdd"> & {
  listId: string;
  pillBase: string;
}): ReactElement {
  const counts = kindCounts(plan, query);
  const action = `${KIND_LABELS[kind]} anlegen`;
  return (
    <div className="man-pt-editor__list-bar">
      <PillTabs
        base={pillBase}
        tabs={ITEM_KINDS.map((id) => ({
          id,
          label: KIND_PLURALS[id],
          count: counts[id],
        }))}
        active={kind}
        onChange={onKindChange}
        label="Art der Einträge"
        controls={listId}
      />
      <button
        type="button"
        className="man-pt-editor__button man-pt-editor__button--icon man-pt-editor__add"
        aria-label={action}
        title={action}
        disabled={addBlocker(plan, kind) !== null}
        onClick={onAdd}
      >
        <span aria-hidden="true">+</span>
      </button>
    </div>
  );
}

export function ItemList(props: ItemListProps): ReactElement {
  const {
    id,
    plan,
    selectedId,
    locale,
    kind,
    query,
    onSelect,
    onRemove,
    focusRequest,
    onFocusDone,
  } = props;
  const listId = useId();
  const pillBase = useId();
  const bodyRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const visible = visibleItems(plan, kind, query);
  const hasKind = plan.items.some((item) => item.kind === kind);
  const blocker = addBlocker(plan, kind);

  const rowButton = (itemId: string | null): HTMLElement | undefined => {
    if (itemId === null || bodyRef.current === null) return undefined;
    return [
      ...bodyRef.current.querySelectorAll<HTMLElement>("[data-item-id]"),
    ].find((element) => element.dataset.itemId === itemId);
  };

  // Gewählt wird auch in der Vorschau oder durch Anlegen; der Eintrag soll
  // dann in der Liste zu sehen sein, nicht irgendwo darunter.
  useEffect(() => {
    const entry = rowButton(selectedId);
    if (entry !== undefined && bodyRef.current !== null)
      scrollIntoContainer(bodyRef.current, entry);
  }, [selectedId, kind]);

  // Nach dem Löschen: die Zeile darunter, sonst darüber, sonst die Suche.
  useEffect(() => {
    if (focusRequest === null) return;
    const entry = rowButton(focusRequest.id);
    if (entry !== undefined && bodyRef.current !== null) {
      entry.focus({ preventScroll: true });
      scrollIntoContainer(bodyRef.current, entry);
    } else {
      searchRef.current?.focus();
    }
    onFocusDone();
  }, [focusRequest]);

  return (
    <Pane
      id={id}
      className="man-pt-editor__items"
      bodyRef={bodyRef}
      // Oben die Suche, darunter die Arten: so stehen beide Zeilen auf der
      // Höhe von Titel und Unterreitern des Formulars daneben.
      lead={
        <SearchField
          query={query}
          onQueryChange={props.onQueryChange}
          searchRef={searchRef}
        />
      }
      toolbar={<KindBar {...props} listId={listId} pillBase={pillBase} />}
    >
      {blocker !== null && (
        <p className="man-pt-editor__hint man-pt-editor__list-hint">
          {blocker}
        </p>
      )}
      <div role="tabpanel" id={listId} aria-labelledby={tabId(pillBase, kind)}>
        {!hasKind && (
          <PaneEmpty>
            Noch keine {KIND_PLURALS[kind]}.
            {/* Ist „+“ gesperrt, sagt der Kopf schon, warum. */}
            {blocker === null && " Der Knopf „+“ legt einen an."}
          </PaneEmpty>
        )}
        {hasKind && visible.length === 0 && (
          <PaneEmpty>Kein Eintrag passt zur Suche.</PaneEmpty>
        )}
        {visible.length > 0 && (
          <ul className="man-pt-editor__list" aria-label="Einträge">
            {visible.map((item) => {
              const selected = item.id === selectedId;
              const confirming = item.id === confirmId;
              return (
                <li key={item.id} className="man-pt-editor__list-row">
                  <button
                    type="button"
                    data-item-id={item.id}
                    className={`man-pt-editor__list-item${selected ? " man-pt-editor__list-item--active" : ""}`}
                    aria-current={selected ? "true" : undefined}
                    onClick={() => onSelect(item.id)}
                  >
                    <span className="man-pt-editor__list-title">
                      {/* Form und Farbe der Kategorie, damit man den Eintrag
                          aus dem Zeitstrahl wiedererkennt. */}
                      <SymbolGlyph
                        symbol={symbolOf(plan, item)}
                        color={colorOf(plan, item)}
                        size={11}
                        className="man-pt-editor__list-glyph"
                      />
                      {item.title}
                    </span>
                    <span className="man-pt-editor__meta">
                      {[
                        KIND_LABELS[item.kind],
                        laneLabel(plan, item),
                        scheduleLabel(item, locale),
                      ].join(" · ")}
                    </span>
                  </button>
                  <div
                    className={`man-pt-editor__row-tools${confirming ? " man-pt-editor__row-tools--open" : ""}`}
                  >
                    <button
                      type="button"
                      className="man-pt-editor__button man-pt-editor__button--icon man-pt-editor__row-delete"
                      aria-label={`„${item.title}“ löschen`}
                      aria-haspopup="dialog"
                      aria-expanded={confirming}
                      onClick={() => setConfirmId(confirming ? null : item.id)}
                    >
                      <TrashIcon />
                    </button>
                    {confirming && (
                      <DeleteConfirm
                        title={item.title}
                        dependents={countDependents(plan, item.id)}
                        onConfirm={() => {
                          setConfirmId(null);
                          onRemove(item.id);
                        }}
                        onCancel={() => setConfirmId(null)}
                      />
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Pane>
  );
}
