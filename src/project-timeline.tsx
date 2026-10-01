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
 * Der Projektplan: Zustand und Zusammenbau.
 *
 * Hier liegt, was sich während des Lesens ändert — Ausschnitt, Filter,
 * eingeklappte Ebenen, offene Details, Ansicht. Gerechnet wird in den reinen
 * Modulen (`lane-layout`, `time-scale`, `plan-filter`, `timeline-model`),
 * gezeichnet in den Blättern; diese Datei verbindet beides.
 *
 * Im Editor (`mode="editor"`) ist dieselbe Komponente die Vorschau: ohne
 * Filter, Liste und Export, und ein Klick wählt den Eintrag im Formular statt
 * Details zu öffnen.
 */

import React, { KeyboardEvent, ReactElement, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { useHotStyle } from "@shared/hot-style";

import { DayRange, Viewport, parseIsoDate, todayDay } from "./calendar";
import { CategoryLegend } from "./category-legend";
import { ExportDialog } from "./export-dialog";
import { HelpDialog } from "./help-dialog";
import { formatDate } from "./format";
import { ItemDetails } from "./item-details";
import { LinkedContentModal } from "./linked-content-modal";
import { placeLayout, prepareLayout } from "./lane-layout";
import { ListView } from "./list-view";
import { OverviewStrip } from "./overview-strip";
import { EMPTY_FILTER, ExportScope, PlanFilter, activeFilterCount, describeFilter, exportItems, filterItems } from "./plan-filter";
import { Plan, itemEndDay, itemStartDay, planExtent } from "./plan-model";
import { planRows } from "./plan-rows";
import {
  axisTiers,
  createScale,
  padViewport,
  unpadViewport,
  viewportFromView,
  worldFromExtent,
  worldFromPeriod,
} from "./time-scale";
import {
  dependenciesOf,
  dimmedOf,
  focusRowsOf,
  matchesOf,
  orderedMatches,
  relatedTo,
  visibleLanesOf,
} from "./timeline-model";
import { TimelineStage } from "./timeline-stage";
import { TimelineToolbar, TimelineView } from "./timeline-toolbar";
import { Measure, createMeasure } from "./text-measure";
import { useElementWidth } from "./use-element-width";
import { useExpanded } from "./use-expanded";
import { useNarrowViewport } from "./use-narrow-viewport";
import { useRovingFocus } from "./use-roving-focus";
import { useTimelineGestures, useViewport } from "./use-viewport";
import timelineCss from "./styles/project-timeline.scss";

export interface ProjectTimelineProps {
  /** Der Plan samt Überschrift (`plan.title`). */
  plan: Plan;
  showToday: boolean;
  allowExport: boolean;
  /** Intl-Sprache, siehe `intlLocale`. */
  locale: string;
  /** "editor": ohne Filter, Liste und Export; Klick wählt statt Details zu öffnen. */
  mode?: "page" | "editor";
  selectedId?: string | null;
  onSelectItem?: (id: string) => void;
  onViewportChange?: (viewport: Viewport) => void;
  /**
   * Nur Editor: wohin die Zoom-Steuerung gerendert wird, etwa in die
   * Kopfzeile der Vorschau neben „Vorschau". Fehlt es, steht sie über dem Plan.
   */
  toolbarTarget?: HTMLElement | null;
}

/** Um so viel zoomen die Knöpfe und die Tasten + und −. */
const ZOOM_STEP = 1.5;
/** Um diesen Anteil der Spanne verschieben Shift + ← / →. */
const PAN_STEP = 0.1;
/** So lange steht der Hinweis zum Zoomen mit Strg/⌘. */
const HINT_MS = 2500;

/** Ohne Einträge gibt es keine Spanne; die Hooks brauchen trotzdem eine Welt. */
const FALLBACK_WORLD: Viewport = { start: todayDay() - 180, end: todayDay() + 180 };

/** Misst Beschriftungen; nach dem Laden der Schriften neu, die alten Breiten gehörten zur Ersatzschrift. */
function useLabelMeasure(): Measure {
  const [measure, setMeasure] = useState<Measure>(() => createMeasure());
  useEffect(() => {
    let alive = true;
    void globalThis.document?.fonts?.ready.then(() => {
      if (alive) setMeasure(() => createMeasure());
    });
    return () => {
      alive = false;
    };
  }, []);
  return measure;
}

function worldOf(plan: Plan, period: DayRange | null): Viewport | null {
  if (period !== null) return worldFromPeriod(period);
  const extent = planExtent(plan.items);
  return extent === null ? null : worldFromExtent(extent);
}

export function ProjectTimeline(props: ProjectTimelineProps): ReactElement | null {
  const { plan, showToday, allowExport, locale, onSelectItem, onViewportChange } = props;
  const title = plan.title;
  const mode = props.mode ?? "page";
  const isEditor = mode === "editor";
  const css = useHotStyle(timelineCss, "project-timeline-widget", "styles/project-timeline.scss");
  const narrow = useNarrowViewport();

  const [filterState, setFilter] = useState<PlanFilter>(EMPTY_FILTER);
  const [collapsed, setCollapsed] = useState<ReadonlySet<string>>(new Set());
  const [view, setView] = useState<TimelineView>("timeline");
  const [detailsId, setDetailsId] = useState<string | null>(null);
  /** Der Eintrag, dessen verknüpfter Inhalt im Modal offen ist. */
  const [contentId, setContentId] = useState<string | null>(null);
  const [anchor, setAnchor] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [hint, setHint] = useState(false);
  const [matchIndex, setMatchIndex] = useState(-1);
  /** Ob der letzte Anstoß ein Zeiger war — dann holt ein Fokus den Eintrag nicht in den Ausschnitt. */
  const pointerInput = useRef(false);

  const rootRef = useRef<HTMLElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const expanded = useExpanded(rootRef);
  // Neu messen, wenn die Fläche entsteht oder die Vollbild-Ebene sie umhängt.
  const width = useElementWidth(bodyRef, `${plan.items.length > 0}|${expanded.mode}`);
  const measure = useLabelMeasure();

  const filter = isEditor ? EMPTY_FILTER : filterState;
  const extent = useMemo(() => planExtent(plan.items), [plan.items]);
  // Mit Rand, damit Einträge an den Enden ganz erscheinen; der Rand hängt an der Breite.
  const world = useMemo(() => padViewport(worldOf(plan, filter.period) ?? FALLBACK_WORLD, width), [plan, filter.period, width]);
  const lanes = useMemo(() => visibleLanesOf(plan, filter), [plan, filter]);
  const allLanesCollapsed = lanes.length > 0 && lanes.every((lane) => collapsed.has(lane.id));
  const items = useMemo(() => filterItems(plan, filter), [plan, filter]);
  const matches = useMemo(() => matchesOf(plan, items, filter.query), [plan, items, filter.query]);
  const dimmed = useMemo(() => dimmedOf(items, matches), [items, matches]);
  const dependencies = useMemo(() => dependenciesOf(items), [items]);

  // Die Startansicht gilt beim ersten Aufbau; danach gehört der Ausschnitt den Lesenden.
  const [initial] = useState(() => padViewport(viewportFromView(plan.view, world, width), width));
  const controller = useViewport({ world, width, initial });
  const scale = createScale(controller.viewport, width);
  useTimelineGestures(bodyRef, controller, scale, { onWheelHint: () => setHint(true) });

  // Abhängig von den Zahlen, nicht von der Identität der Ausschnitte: gleiche
  // Grenzen sind derselbe Ausschnitt, auch wenn ein neues Objekt sie trägt.
  const { start: liveStart, end: liveEnd } = controller.viewport;
  const { start: settledStart, end: settledEnd } = controller.settled;
  // Verteilt wird nur, wenn der Ausschnitt ruht; platziert wird mit jedem Bild.
  const prepared = useMemo(() => {
    const settled = createScale({ start: settledStart, end: settledEnd }, width);
    return prepareLayout({ plan, lanes, items, collapsed, rowX: settled.x, measure, width });
  }, [plan, lanes, items, collapsed, settledStart, settledEnd, width, measure]);
  const layout = useMemo(
    () => placeLayout(prepared, createScale({ start: liveStart, end: liveEnd }, width).x),
    [prepared, liveStart, liveEnd, width],
  );
  const tiers = axisTiers(scale, locale);

  const selectedId = isEditor ? (props.selectedId ?? null) : detailsId;
  const related = useMemo(() => relatedTo(dependencies, selectedId), [dependencies, selectedId]);
  const focusRows = useMemo(() => focusRowsOf(lanes, items), [lanes, items]);
  const byId = useMemo(() => new Map(plan.items.map((item) => [item.id, item])), [plan.items]);
  const roving = useRovingFocus(bodyRef, focusRows, (id) => itemStartDay(byId.get(id)!));

  const today = todayDay();
  const todayRaw = scale.x(today + 0.5);
  const todayX = showToday && todayRaw >= 0 && todayRaw <= width ? todayRaw : null;

  // Ein neuer Zeitraum-Filter ist eine neue Welt: sie wird ganz gezeigt.
  const previousPeriod = useRef(filter.period);
  useEffect(() => {
    if (previousPeriod.current !== filter.period) controller.fit();
    previousPeriod.current = filter.period;
  }, [filter.period, controller]);

  // Über eine Ref: eine neue Rückruf-Funktion je Render des Editors darf keinen
  // neuen Aufruf auslösen — sonst schaukeln sich Vorschau und Editor hoch.
  const viewportListener = useRef(onViewportChange);
  viewportListener.current = onViewportChange;
  // Ohne den Rand gemeldet: was die Redaktion als Startansicht übernimmt, ist
  // der Ausschnitt innerhalb des Rands. Beim Laden kommt der Rand wieder dazu,
  // und ein Rundlauf ändert nichts.
  useEffect(() => {
    viewportListener.current?.(unpadViewport({ start: settledStart, end: settledEnd }, width));
  }, [settledStart, settledEnd, width]);

  // Nach dem Umschalten steht der Fokus wieder auf dem Knopf — als Ebene wird
  // der ganze Abschnitt neu gebaut, und der Fokus fiele sonst ins Leere.
  const expandedBefore = useRef(expanded.mode);
  useEffect(() => {
    if (expandedBefore.current === expanded.mode) return;
    expandedBefore.current = expanded.mode;
    rootRef.current?.querySelector<HTMLElement>("[data-expand-toggle]")?.focus({ preventScroll: true });
  }, [expanded.mode]);

  useEffect(() => {
    if (!hint) return;
    const timer = setTimeout(() => setHint(false), HINT_MS);
    return () => clearTimeout(timer);
  }, [hint]);

  // Die Details hängen am Eintrag; wandert der beim Zoomen, wandert das Popover mit.
  useLayoutEffect(() => {
    if (detailsId === null || rootRef.current === null) return setAnchor(null);
    const element = findItem(bodyRef.current, detailsId);
    if (element === undefined) return setAnchor(null);
    const root = rootRef.current.getBoundingClientRect();
    const rect = element.getBoundingClientRect();
    const next = { x: rect.left + rect.width / 2 - root.left, y: rect.bottom - root.top, width: root.width, height: root.height };
    // Unverändert heißt: kein zweites Rendern in diesem Bild.
    setAnchor((current) =>
      current !== null &&
      current.x === next.x &&
      current.y === next.y &&
      current.width === next.width &&
      current.height === next.height
        ? current
        : next,
    );
  }, [detailsId, layout]);

  // Ein Klick neben die Details schließt sie — außer auf einen anderen Eintrag, der sie übernimmt.
  useEffect(() => {
    if (detailsId === null) return;
    const onPointerDown = (event: PointerEvent) => {
      const path = event.composedPath();
      const inside = path.some(
        (node) => node instanceof HTMLElement && (node.classList.contains("man-pt__details") || node.dataset.itemId !== undefined),
      );
      if (!inside) setDetailsId(null);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [detailsId]);

  // Filter, Ebenen oder Plan können den offenen Eintrag verschwinden lassen.
  useEffect(() => {
    if (detailsId !== null && !items.some((item) => item.id === detailsId)) setDetailsId(null);
  }, [items, detailsId]);

  if (plan.items.length === 0) {
    return isEditor ? (
      <section className="man-pt man-pt--editor">
        <style>{css}</style>
        <p className="man-pt__empty">Noch keine Einträge — die Vorschau erscheint mit dem ersten Eintrag.</p>
      </section>
    ) : null;
  }

  const ensureVisible = (id: string) => {
    const item = byId.get(id);
    if (item === undefined) return;
    const start = itemStartDay(item);
    const end = itemEndDay(item) + 1;
    const { start: from, end: to } = controller.peek();
    // Ein Zeitraum gilt als sichtbar, sobald ein Stück von ihm zu sehen ist —
    // sonst spränge die Ansicht bei jedem Balken, der breiter ist als sie.
    const visible = item.kind === "bar" ? start < to && end > from : start >= from && end <= to;
    if (visible) return;
    const span = to - from;
    const center = end - start >= span ? start + span / 2 - span * 0.05 : (start + end) / 2;
    controller.setViewport({ start: center - span / 2, end: center + span / 2 });
  };

  /** Macht einen Eintrag zum Tab-Stopp und holt ihn in den Ausschnitt, ohne den Fokus zu nehmen. */
  const reveal = (id: string) => {
    roving.setFocusId(id);
    ensureVisible(id);
  };

  const activate = (id: string) => {
    if (isEditor) {
      onSelectItem?.(id);
      return;
    }
    // Ein Eintrag mit Inhalt öffnet ihn gleich — die Details stünden nur davor.
    if (plan.items.some((entry) => entry.id === id && entry.content !== undefined)) {
      setDetailsId(null);
      setContentId(id);
      return;
    }
    setDetailsId((current) => (current === id ? null : id));
  };

  // Zurück an den Eintrag, wie beim Schließen der Details: Safari fokussiert
  // einen Button beim Klick nicht, das Modal fände sonst keinen Ursprung.
  const closeContent = () => {
    const id = contentId;
    setContentId(null);
    if (id !== null) findItem(bodyRef.current, id)?.focus({ preventScroll: true });
  };

  const closeDetails = () => {
    const id = detailsId;
    setDetailsId(null);
    if (id !== null) findItem(bodyRef.current, id)?.focus({ preventScroll: true });
  };

  const onStageKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    const moved = roving.onKeyDown(event);
    if (moved !== null) ensureVisible(moved);
    if (event.defaultPrevented) return;
    const span = controller.viewport.end - controller.viewport.start;
    const actions: Record<string, () => void> = {
      "+": () => controller.zoomBy(ZOOM_STEP),
      "=": () => controller.zoomBy(ZOOM_STEP),
      "-": () => controller.zoomBy(1 / ZOOM_STEP),
      "0": () => controller.fit(),
      "?": () => setHelpOpen(true),
    };
    if (event.shiftKey && (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
      event.preventDefault();
      controller.panBy((event.key === "ArrowLeft" ? -1 : 1) * span * PAN_STEP);
    } else if (actions[event.key] !== undefined && !event.ctrlKey && !event.metaKey) {
      event.preventDefault();
      actions[event.key]();
    }
  };

  const updateFilter = (patch: Partial<PlanFilter>) => setFilter((current) => ({ ...current, ...patch }));
  const toggle = (list: readonly string[], id: string) => (list.includes(id) ? list.filter((entry) => entry !== id) : [...list, id]);

  // Enter im Suchfeld springt weiter, der Fokus bleibt im Feld — sonst träfe
  // das nächste Enter den Eintrag und öffnete dessen Details.
  const ordered = orderedMatches(items, matches);
  const currentMatch = matchIndex >= 0 && matchIndex < ordered.length ? ordered[matchIndex] : null;
  const nextMatch = () => {
    if (ordered.length === 0) return;
    const next = (matchIndex + 1) % ordered.length;
    setMatchIndex(next);
    if (view === "timeline") reveal(ordered[next]);
  };

  const runExport = async (scope: ExportScope) => {
    const chosen = exportItems(plan, filter, controller.viewport, scope);
    const { downloadExport } = await import(/* webpackChunkName: "project-timeline-excel" */ "./excel-export");
    await downloadExport({
      title: title ?? "",
      updatedAt: plan.updatedAt,
      scope,
      rows: planRows(plan, chosen),
      filterDescription: scope === "view" ? describeFilter(plan, filter, locale) : [],
      locale,
      now: new Date(),
    });
  };

  const legend = (
    <CategoryLegend
      plan={plan}
      hidden={filter.hiddenCategories}
      interactive={!isEditor}
      onToggle={(id) => updateFilter({ hiddenCategories: toggle(filter.hiddenCategories, id) })}
      onShowAll={() => updateFilter({ hiddenCategories: [] })}
    />
  );
  const detailsItem = detailsId === null ? undefined : byId.get(detailsId);
  const contentItem = contentId === null ? undefined : byId.get(contentId);
  const filtersActive = activeFilterCount(filter);

  const toolbar = (compact: boolean) => (
        <TimelineToolbar
        compact={compact}
          mode={mode}
          narrow={narrow}
          locale={locale}
          query={filter.query}
          matchCount={matches?.size ?? 0}
          matchPosition={currentMatch === null ? null : matchIndex + 1}
          onQuery={(query) => {
            setMatchIndex(-1);
            updateFilter({ query });
          }}
          onNextMatch={nextMatch}
          lanes={plan.lanes}
          hiddenLanes={filter.hiddenLanes}
          onToggleLane={(id) => updateFilter({ hiddenLanes: toggle(filter.hiddenLanes, id) })}
          period={filter.period}
          extent={extent}
          onPeriod={(period) => updateFilter({ period })}
          activeFilterCount={filtersActive}
          onResetFilters={() => setFilter(EMPTY_FILTER)}
          legend={legend}
          onZoomIn={() => controller.zoomBy(ZOOM_STEP)}
          onZoomOut={() => controller.zoomBy(1 / ZOOM_STEP)}
          onFit={() => controller.fit()}
          view={view}
          onView={setView}
          allowExport={allowExport && !isEditor}
          onExport={() => setExportOpen(true)}
          onHelp={isEditor ? undefined : () => setHelpOpen(true)}
          onToggleExpanded={isEditor ? undefined : expanded.toggle}
          expanded={expanded.mode !== null}
        />
  );
  // Im Editor sitzt die Zoom-Steuerung in der Kopfzeile der Vorschau; `.man-pt`
  // um sie herum, weil sie dort außerhalb dieses Abschnitts steht und sonst
  // die Farben (`--pt-*`) nicht erbte.
  const externalToolbar = isEditor && props.toolbarTarget ? props.toolbarTarget : null;

  const sectionClass = [
    "man-pt",
    isEditor ? "man-pt--editor" : "",
    expanded.mode !== null ? "man-pt--expanded" : "",
    expanded.mode === "overlay" ? "man-pt--overlay" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <section
      ref={rootRef}
      lang={locale}
      className={sectionClass}
      onPointerDownCapture={() => {
        pointerInput.current = true;
      }}
      onKeyDownCapture={() => {
        pointerInput.current = false;
      }}
      // Als Ebene beendet Esc das Vollbild; im echten Vollbild tut das der
      // Browser. Dialoge und Details fangen ihr Esc vorher selbst ab.
      onKeyDown={(event) => {
        if (event.key === "Escape" && expanded.mode === "overlay" && !event.defaultPrevented) expanded.exit();
      }}
      aria-label={title || "Projektplan"}
    >
      <style>{css}</style>

      {!isEditor && (title || plan.updatedAt) && (
        <header className="man-pt__head">
          {title && <h2 className="man-pt__title">{title}</h2>}
          {plan.updatedAt && <p className="man-pt__stand">{`Stand: ${formatDate(parseIsoDate(plan.updatedAt) as number, locale)}`}</p>}
        </header>
      )}

      {externalToolbar === null && toolbar(false)}
      {externalToolbar !== null &&
        createPortal(<div className="man-pt man-pt--controls">{toolbar(true)}</div>, externalToolbar)}

      {!(narrow && !isEditor) && legend}

      {items.length === 0 && (
        <div className="man-pt__empty">
          <p>Keine Einträge für diese Filter</p>
          <button type="button" className="man-pt__button" onClick={() => setFilter(EMPTY_FILTER)}>
            Filter zurücksetzen
          </button>
        </div>
      )}

      {view === "list" && !isEditor && <ListView
          plan={plan}
          items={items}
          locale={locale}
          matches={matches}
          onOpenContent={(id) => {
            setDetailsId(null);
            setContentId(id);
          }}
        />}

      <div className="man-pt__timeline" hidden={view === "list" && !isEditor}>
        <TimelineStage
          plan={plan}
          locale={locale}
          mode={mode}
          layout={layout}
          tiers={tiers}
          width={width}
          todayX={todayX}
          dependencies={dependencies}
          selectedId={selectedId}
          currentId={currentMatch}
          relatedIds={related}
          dimmedIds={dimmed}
          focusId={roving.focusId}
          bodyRef={bodyRef}
          hint={hint}
          allLanesCollapsed={allLanesCollapsed}
          onToggleLane={(id) => setCollapsed((current) => new Set(toggle([...current], id)))}
          onToggleAllLanes={
            lanes.length > 1
              ? () => setCollapsed(allLanesCollapsed ? new Set() : new Set(plan.lanes.map((lane) => lane.id)))
              : undefined
          }
          onActivate={activate}
          onFocusItem={(id) => {
            roving.setFocusId(id);
            // Nur Tastaturfokus holt den Eintrag heran; ein Klick darf den Plan
            // nicht unter dem Zeiger verschieben.
            if (!pointerInput.current) ensureVisible(id);
          }}
          onKeyDown={onStageKeyDown}
        />
        <OverviewStrip
          plan={plan}
          lanes={lanes}
          items={items}
          world={world}
          viewport={controller.viewport}
          locale={locale}
          onChange={controller.setViewport}
        />
      </div>

      {detailsItem !== undefined && anchor !== null && (
        <ItemDetails
          plan={plan}
          item={detailsItem}
          locale={locale}
          narrow={narrow}
          anchor={anchor}
          stage={{ width: anchor.width, height: anchor.height }}
          onClose={closeDetails}
          onSelect={(id) => {
            // Der Fokus bleibt in den Details (sie fokussieren sich beim Wechsel selbst).
            setDetailsId(id);
            reveal(id);
          }}
        />
      )}

      {contentItem?.content !== undefined && (
        <LinkedContentModal
          plan={plan}
          item={contentItem}
          locale={locale}
          onClose={closeContent}
          container={expanded.mode === "fullscreen" ? rootRef.current : undefined}
        />
      )}

      {helpOpen && <HelpDialog plan={plan} allowExport={allowExport} onClose={() => setHelpOpen(false)} />}

      {exportOpen && (
        <ExportDialog
          counts={{ view: exportItems(plan, filter, controller.viewport, "view").length, all: plan.items.length }}
          onExport={runExport}
          onClose={() => setExportOpen(false)}
        />
      )}
    </section>
  );

  return expanded.mode === "overlay" ? createPortal(content, document.body) : content;
}

/** Der Button eines Eintrags; über `dataset`, weil `CSS.escape` nicht überall bereitsteht. */
function findItem(container: HTMLElement | null, id: string): HTMLElement | undefined {
  return Array.from(container?.querySelectorAll<HTMLElement>("[data-item-id]") ?? []).find(
    (element) => element.dataset.itemId === id,
  );
}
