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
 * Die Details eines Eintrags: auf dem Desktop als Popover am Eintrag, auf
 * schmalen Bildschirmen als Blatt vom unteren Rand.
 *
 * Vorgänger und Nachfolger sind Knöpfe — die gestrichelten Linien sagen nur,
 * dass es eine Verbindung gibt; hier steht, mit wem, und man kommt hin.
 */

import React, { CSSProperties, ReactElement, useEffect, useId, useLayoutEffect, useRef, useState } from "react";

import { AttachmentList } from "@shared/content-modal/attachment-list";
import { Placement, placePopover } from "@shared/popover-placement";

import { trapTab } from "./focus-trap";
import { kindAndTerm } from "./item-text";
import { attachmentEntries } from "./linked-content";
import { SymbolGlyph } from "./symbol-glyph";
import { symbolOf } from "./symbols";
import { Plan, PlanItem, categoryOf, colorOf, isLaneItem } from "./plan-model";

export interface ItemDetailsProps {
  plan: Plan;
  item: PlanItem;
  locale: string;
  narrow: boolean;
  /** Der Ankerpunkt am Eintrag, relativ zur Bühne. */
  anchor: { x: number; y: number };
  stage: { width: number; height: number };
  onClose: () => void;
  onSelect: (id: string) => void;
}

function Links({ title, items, onSelect }: { title: string; items: PlanItem[]; onSelect: (id: string) => void }) {
  if (items.length === 0) return null;
  return (
    <div className="man-pt__details-links">
      <span className="man-pt__details-key">{title}</span>
      {/* `role="list"` statt `ul`: das Seiten-Stylesheet setzt vor jedes `li` einen roten Strich. */}
      <div role="list" className="man-pt__details-list">
        {items.map((linked) => (
          <div key={linked.id} role="listitem">
            <button type="button" className="man-pt__link-button" onClick={() => onSelect(linked.id)}>
              {linked.title}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Body({ plan, item, locale, onSelect }: Pick<ItemDetailsProps, "plan" | "item" | "locale" | "onSelect">) {
  const category = categoryOf(plan, item);
  const lane = isLaneItem(item) ? plan.lanes.find((candidate) => candidate.id === item.lane) : undefined;
  const byId = new Map(plan.items.map((entry) => [entry.id, entry]));
  const predecessors = (item.dependsOn ?? []).map((id) => byId.get(id)).filter((entry): entry is PlanItem => !!entry);
  const successors = plan.items.filter((entry) => entry.dependsOn?.includes(item.id));

  return (
    <>
      <p className="man-pt__details-meta">
        <SymbolGlyph symbol={symbolOf(plan, item)} color={colorOf(plan, item)} className="man-pt__legend-symbol" />
        {category?.title ?? "Ohne Kategorie"}
        {item.tentative && <span className="man-pt__tag">vorläufig</span>}
      </p>
      <p className="man-pt__details-term">{kindAndTerm(item, locale)}</p>
      <dl className="man-pt__details-facts">
        <dt>Ebene</dt>
        <dd>{lane?.title ?? "Alle Ebenen"}</dd>
        {isLaneItem(item) && item.series !== undefined && (
          <>
            <dt>Serie</dt>
            <dd>{item.series}</dd>
          </>
        )}
      </dl>
      {item.description !== undefined && <p className="man-pt__details-description">{item.description}</p>}
      <Links title="Vorgänger" items={predecessors} onSelect={onSelect} />
      <Links title="Nachfolger" items={successors} onSelect={onSelect} />
      <AttachmentList entries={attachmentEntries(item.attachments)} flush />
    </>
  );
}

export function ItemDetails(props: ItemDetailsProps): ReactElement {
  const { item, narrow, anchor, stage, onClose } = props;
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const [placement, setPlacement] = useState<Placement | null>(null);

  useLayoutEffect(() => {
    if (narrow || panelRef.current === null) return;
    const rect = panelRef.current.getBoundingClientRect();
    setPlacement(
      placePopover({
        point: { x: (anchor.x / Math.max(stage.width, 1)) * 100, y: (anchor.y / Math.max(stage.height, 1)) * 100 },
        stage,
        popover: { width: rect.width, height: rect.height },
      }),
    );
  }, [narrow, anchor.x, anchor.y, stage.width, stage.height, item.id]);

  useEffect(() => {
    panelRef.current?.focus();
  }, [item.id]);

  const style: CSSProperties | undefined =
    narrow || placement === null ? undefined : { left: placement.left, top: placement.top };

  const panel = (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal={narrow}
      aria-labelledby={titleId}
      tabIndex={-1}
      className={`man-pt__details${narrow ? " man-pt__details--sheet" : ""}${placement ? ` is-${placement.side}` : ""}`}
      style={style}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.stopPropagation();
          onClose();
        }
        // Als Blatt ist es modal (`aria-modal`): dann bleibt Tab darin.
        if (narrow) trapTab(event);
      }}
    >
      <div className="man-pt__details-head">
        <h3 id={titleId} className="man-pt__details-title">
          {item.title}
        </h3>
        <button type="button" className="man-pt__button man-pt__button--icon" aria-label="Schließen" onClick={onClose}>
          ×
        </button>
      </div>
      <Body {...props} />
    </div>
  );

  if (!narrow) return panel;
  return (
    <div className="man-pt__sheet-backdrop" onPointerDown={(event) => event.target === event.currentTarget && onClose()}>
      {panel}
    </div>
  );
}
