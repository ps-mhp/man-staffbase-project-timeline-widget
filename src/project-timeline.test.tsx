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

import React from "react";
import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";

import { dayFromParts } from "./calendar";
import { examplePlan } from "./example-plan";
import { emptyPlan } from "./plan-model";
import { ProjectTimeline, ProjectTimelineProps } from "./project-timeline";

jest.mock("./excel-export", () => ({ downloadExport: jest.fn().mockResolvedValue(undefined) }));

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { downloadExport } = require("./excel-export") as { downloadExport: jest.Mock };

function renderTimeline(overrides: Partial<ProjectTimelineProps> = {}) {
  return render(
    <ProjectTimeline
      plan={examplePlan()}
      showToday
      allowExport
      locale="de-DE"
      {...overrides}
    />,
  );
}

const item = (name: RegExp) => screen.getByRole("button", { name });

beforeEach(() => downloadExport.mockClear());

describe("ProjectTimeline", () => {
  it("zeigt Titel, Stand, Ebenen und Einträge", () => {
    renderTimeline();
    expect(screen.getByRole("heading", { name: "Sales Truck Launch" })).toBeInTheDocument();
    expect(screen.getByText("Stand: 27. November 2024")).toBeInTheDocument();
    expect(screen.getByText("Launches / SOPs")).toBeInTheDocument();
    expect(item(/^Meilenstein: 1\. SOP TG Assist MY26, 1\. Oktober 2025, Kategorie MY26 TG Assist$/)).toBeInTheDocument();
    expect(item(/^Zeitraum: MILES, .*vorläufig$/)).toBeInTheDocument();
    expect(item(/^Stichtag: § Euro 7/)).toBeInTheDocument();
  });

  it("rendert ohne Einträge auf der Seite nichts", () => {
    const { container } = renderTimeline({ plan: emptyPlan() });
    expect(container).toBeEmptyDOMElement();
  });

  it("sagt im Editor, dass die Vorschau mit dem ersten Eintrag kommt", () => {
    renderTimeline({ plan: emptyPlan(), mode: "editor" });
    expect(screen.getByText(/Noch keine Einträge/)).toBeInTheDocument();
  });

  it("öffnet die Details mit Vorgängern und schließt sie mit Esc", async () => {
    renderTimeline();
    const sop = item(/^Meilenstein: 1\. SOP eTGL,/);
    fireEvent.click(sop);

    const dialog = await screen.findByRole("dialog", { name: "1. SOP eTGL" });
    expect(within(dialog).getByText("Meilenstein · 1. Januar 2026")).toBeInTheDocument();
    expect(within(dialog).getByRole("button", { name: "eTGL C4S" })).toBeInTheDocument();
    expect(sop).toHaveAttribute("aria-expanded", "true");

    fireEvent.keyDown(dialog, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(sop).toHaveFocus();
  });

  it("wechselt aus den Details zum Vorgänger", async () => {
    renderTimeline();
    fireEvent.click(item(/^Meilenstein: 1\. SOP eTGL,/));
    fireEvent.click(within(await screen.findByRole("dialog")).getByRole("button", { name: "eTGL C4S" }));
    expect(await screen.findByRole("dialog", { name: "eTGL C4S" })).toBeInTheDocument();
  });

  it("blendet eine Kategorie über die Legende aus und wieder ein", () => {
    renderTimeline();
    const chip = screen.getByRole("button", { name: "TMS" });
    expect(chip).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(chip);
    expect(screen.queryByRole("button", { name: /^Zeitraum: TMS1/ })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Filter, 1 aktiv" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Alle" }));
    expect(item(/^Zeitraum: TMS1/)).toBeInTheDocument();
  });

  it("blendet eine Ebene über das Filter-Menü aus", () => {
    renderTimeline();
    fireEvent.click(screen.getByRole("button", { name: "Filter" }));
    fireEvent.click(screen.getByRole("checkbox", { name: "Messen" }));
    expect(screen.queryByRole("button", { name: /^Meilenstein: Bauma/ })).not.toBeInTheDocument();
    // Stichtage gehören zu keiner Ebene und bleiben.
    expect(item(/^Stichtag: § Euro 7/)).toBeInTheDocument();
  });

  describe("Alle Ebenen ein- und ausklappen", () => {
    const laneToggles = () => screen.getAllByRole("button", { name: /^(Messen|Launches \/ SOPs|Projekt-Meilensteine) (ein|auf)klappen$/ });

    it("klappt mit einem Knopf alle Ebenen ein und wieder aus", () => {
      renderTimeline();
      fireEvent.click(screen.getByRole("button", { name: "Alle einklappen" }));
      expect(laneToggles().map((toggle) => toggle.getAttribute("aria-expanded"))).toEqual(["false", "false", "false"]);

      fireEvent.click(screen.getByRole("button", { name: "Alle aufklappen" }));
      expect(laneToggles().map((toggle) => toggle.getAttribute("aria-expanded"))).toEqual(["true", "true", "true"]);
      expect(screen.getByRole("button", { name: "Alle einklappen" })).toBeInTheDocument();
    });

    it("klappt ein, solange noch eine Ebene offen ist", () => {
      renderTimeline();
      fireEvent.click(screen.getByRole("button", { name: "Messen einklappen" }));
      fireEvent.click(screen.getByRole("button", { name: "Launches / SOPs einklappen" }));
      fireEvent.click(screen.getByRole("button", { name: "Alle einklappen" }));
      expect(laneToggles().every((toggle) => toggle.getAttribute("aria-expanded") === "false")).toBe(true);
    });

    it("zählt nur die sichtbaren Ebenen", () => {
      renderTimeline();
      fireEvent.click(screen.getByRole("button", { name: "Messen einklappen" }));
      fireEvent.click(screen.getByRole("button", { name: "Launches / SOPs einklappen" }));
      fireEvent.click(screen.getByRole("button", { name: "Filter" }));
      fireEvent.click(screen.getByRole("checkbox", { name: "Projekt-Meilensteine" }));
      expect(screen.getByRole("button", { name: "Alle aufklappen" })).toBeInTheDocument();
    });

    it("fehlt bei nur einer Ebene — dort genügt ihr eigener Pfeil", () => {
      const plan = examplePlan();
      const lane = plan.lanes[0];
      renderTimeline({
        plan: { ...plan, lanes: [lane], items: plan.items.filter((entry) => entry.kind === "deadline" || entry.lane === lane.id) },
      });
      expect(screen.queryByRole("button", { name: /^Alle (ein|auf)klappen$/ })).not.toBeInTheDocument();
    });
  });

  it("blendet bei der Suche alles außer den Treffern ab", () => {
    renderTimeline();
    fireEvent.change(screen.getByRole("searchbox", { name: "Einträge durchsuchen" }), { target: { value: "iaa" } });
    expect(screen.getByText("3 Treffer")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /^Meilenstein: IAA/ })[0]).not.toHaveClass("is-dimmed");
    expect(item(/^Meilenstein: SOP Core MY25/)).toHaveClass("is-dimmed");
  });

  it("zeigt die Liste statt des Zeitstrahls", () => {
    renderTimeline();
    fireEvent.click(screen.getByRole("button", { name: "Liste" }));
    const table = screen.getByRole("table");
    expect(within(table).getAllByRole("row")).toHaveLength(examplePlan().items.length + 1);
    expect(within(table).getAllByRole("row")[1]).toHaveTextContent("SOP Core MY25");
  });

  it("exportiert den ganzen Plan als Excel", async () => {
    renderTimeline();
    fireEvent.click(screen.getByRole("button", { name: "Exportieren" }));
    const dialog = screen.getByRole("dialog", { name: "Als Excel exportieren" });
    const total = examplePlan().items.length;
    fireEvent.click(within(dialog).getByRole("radio", { name: `Ganzer Plan (${total} Einträge)` }));
    await act(async () => {
      fireEvent.click(within(dialog).getByRole("button", { name: "Excel herunterladen" }));
    });
    expect(downloadExport).toHaveBeenCalledWith(
      expect.objectContaining({ scope: "all", title: "Sales Truck Launch", filterDescription: [] }),
    );
    expect(downloadExport.mock.calls[0][0].rows).toHaveLength(total);
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("meldet einen gescheiterten Export im Dialog", async () => {
    downloadExport.mockRejectedValueOnce(new Error("kaputt"));
    renderTimeline();
    fireEvent.click(screen.getByRole("button", { name: "Exportieren" }));
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Excel herunterladen" }));
    });
    expect(await screen.findByRole("alert")).toHaveTextContent("Der Export ist fehlgeschlagen. Bitte erneut versuchen.");
  });

  it("bietet ohne `allow-export` keinen Export an", () => {
    renderTimeline({ allowExport: false });
    expect(screen.queryByRole("button", { name: "Exportieren" })).not.toBeInTheDocument();
  });

  it("zeigt die Heute-Linie nur, wenn sie eingeschaltet ist", () => {
    jest.useFakeTimers({ now: new Date(2026, 8, 30, 12), doNotFake: ["requestAnimationFrame", "queueMicrotask"] });
    try {
      const { unmount } = renderTimeline();
      expect(screen.getByText("Heute")).toBeInTheDocument();
      unmount();
      renderTimeline({ showToday: false });
      expect(screen.queryByText("Heute")).not.toBeInTheDocument();
    } finally {
      jest.useRealTimers();
    }
  });

  it("wandert mit den Pfeiltasten zum nächsten Eintrag der Ebene", () => {
    renderTimeline();
    // Der eine Tab-Stopp sitzt auf dem ersten Eintrag der ersten Ebene.
    const first = item(/^Meilenstein: Bauma, 7\. April 2025/);
    expect(first).toHaveAttribute("tabindex", "0");
    expect(item(/^Meilenstein: SOP Core MY25/)).toHaveAttribute("tabindex", "-1");
    first.focus();
    fireEvent.keyDown(first, { key: "ArrowRight" });
    expect(item(/^Meilenstein: Trucknology Festival/)).toHaveFocus();
    fireEvent.keyDown(document.activeElement as HTMLElement, { key: "ArrowDown" });
    expect(item(/^Meilenstein: SOP eTruck/)).toHaveFocus();
  });

  it("wählt im Editor, statt Details zu öffnen", () => {
    const onSelectItem = jest.fn();
    renderTimeline({ mode: "editor", onSelectItem, selectedId: "bar-tms1" });
    expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Exportieren" })).not.toBeInTheDocument();
    expect(item(/^Zeitraum: TMS1/)).toHaveClass("is-selected");

    fireEvent.click(item(/^Meilenstein: IAA, 15\. September 2026/));
    expect(onSelectItem).toHaveBeenCalledWith("fair-iaa-26");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("setzt die Zoom-Steuerung im Editor dorthin, wohin er sie haben will", () => {
    const target = document.createElement("div");
    document.body.appendChild(target);
    const { container } = renderTimeline({ mode: "editor", toolbarTarget: target });
    expect(within(target).getByRole("button", { name: "Vergrößern" })).toHaveClass("man-pt__button--compact");
    expect(within(container).queryByRole("button", { name: "Vergrößern" })).not.toBeInTheDocument();
    target.remove();
  });

  it("öffnet die Hilfe über den Knopf und gibt den Fokus beim Schließen zurück", () => {
    renderTimeline();
    const button = screen.getByRole("button", { name: /Hilfe/ });
    button.focus();
    fireEvent.click(button);
    const dialog = screen.getByRole("dialog", { name: "Hilfe zum Projektplan" });
    expect(within(dialog).getByText("TMS")).toBeInTheDocument();
    fireEvent.keyDown(dialog, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(button).toHaveFocus();
  });

  it("öffnet die Hilfe mit ? aus dem Plan heraus", () => {
    renderTimeline();
    const first = item(/^Meilenstein: Bauma, 7\. April 2025/);
    first.focus();
    fireEvent.keyDown(first, { key: "?", shiftKey: true });
    expect(screen.getByRole("dialog", { name: "Hilfe zum Projektplan" })).toBeInTheDocument();
  });

  it("bietet im Editor keine Hilfe an — dort hat der Editor seine eigene", () => {
    renderTimeline({ mode: "editor" });
    expect(screen.queryByRole("button", { name: /Hilfe/ })).not.toBeInTheDocument();
  });

  // Am 30.09.2026 auf der Seite: `onetruck-css` zeichnet vor jedes `li` im
  // Inhaltsbereich einen roten Strich — neben den Farbpunkten der Kategorien
  // sah das aus wie ein Fehler. Listen sind deshalb `role="list"` auf `div`.
  it("rendert keine ul/ol/li, auch nicht in Details und Hilfe", async () => {
    const { container } = renderTimeline();
    fireEvent.click(item(/^Meilenstein: 1\. SOP eTGL,/));
    await screen.findByRole("dialog", { name: "1. SOP eTGL" });
    expect(container.querySelectorAll("ul, ol, li")).toHaveLength(0);
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });

    fireEvent.click(screen.getByRole("button", { name: /Hilfe/ }));
    expect(screen.getByRole("list", { name: "Kategorien dieses Plans" })).toBeInTheDocument();
    expect(document.querySelectorAll(".man-pt ul, .man-pt ol, .man-pt li")).toHaveLength(0);
  });

  it("rendert auch im Editor keine ul/li", () => {
    const { container } = renderTimeline({ mode: "editor" });
    expect(screen.getByRole("list", { name: "Kategorien" })).toBeInTheDocument();
    expect(container.querySelectorAll("ul, ol, li")).toHaveLength(0);
  });

  describe("Vollbild", () => {
    afterEach(() => {
      delete (HTMLElement.prototype as { requestFullscreen?: unknown }).requestFullscreen;
    });

    it("legt sich ohne Fullscreen-API als Ebene über die Seite und kehrt mit Esc zurück", () => {
      renderTimeline();
      fireEvent.click(screen.getByRole("button", { name: "Vollbild" }));

      const section = document.querySelector(".man-pt--expanded") as HTMLElement;
      expect(section).toHaveClass("man-pt--overlay");
      expect(section.parentElement).toBe(document.body);
      expect(document.documentElement.style.overflow).toBe("hidden");
      const exit = screen.getByRole("button", { name: "Vollbild beenden" });
      expect(exit).toHaveFocus();

      fireEvent.keyDown(exit, { key: "Escape" });
      expect(document.querySelector(".man-pt--expanded")).toBeNull();
      expect(document.documentElement.style.overflow).toBe("");
      expect(screen.getByRole("button", { name: "Vollbild" })).toHaveFocus();
    });

    it("nutzt die Fullscreen-API, wo es sie gibt, und folgt ihrem Ende", async () => {
      let fullscreen: Element | null = null;
      Object.defineProperty(document, "fullscreenElement", { configurable: true, get: () => fullscreen });
      const request = jest.fn((element: HTMLElement) => {
        fullscreen = element;
        return Promise.resolve();
      });
      HTMLElement.prototype.requestFullscreen = function requestFullscreen(this: HTMLElement) {
        return request(this);
      };
      renderTimeline();
      await act(async () => {
        fireEvent.click(screen.getByRole("button", { name: "Vollbild" }));
      });
      const section = document.querySelector(".man-pt--expanded") as HTMLElement;
      expect(section).not.toHaveClass("man-pt--overlay");
      expect(request).toHaveBeenCalledWith(section);

      // Der Browser beendet das Vollbild selbst, etwa per Esc.
      fullscreen = null;
      act(() => {
        document.dispatchEvent(new Event("fullscreenchange"));
      });
      expect(document.querySelector(".man-pt--expanded")).toBeNull();
      delete (document as { fullscreenElement?: unknown }).fullscreenElement;
    });

    it("bietet im Editor kein Vollbild an", () => {
      renderTimeline({ mode: "editor" });
      expect(screen.queryByRole("button", { name: "Vollbild" })).not.toBeInTheDocument();
    });
  });

  it("zoomt über die Knöpfe", () => {
    renderTimeline();
    const window = screen.getByRole("slider", { name: "Sichtbarer Zeitraum" });
    const before = window.getAttribute("aria-valuetext");
    act(() => {
      fireEvent.click(screen.getByRole("button", { name: "Vergrößern" }));
    });
    return waitFor(() => expect(window.getAttribute("aria-valuetext")).not.toBe(before));
  });

  describe("nach dem Review", () => {
    it("misst die Breite auch, wenn der Plan erst später Einträge bekommt", () => {
      const original = HTMLElement.prototype.getBoundingClientRect;
      HTMLElement.prototype.getBoundingClientRect = function (this: HTMLElement) {
        const width = this.classList.contains("man-pt__body") ? 600 : 0;
        return { width, height: 0, top: 0, left: 0, right: width, bottom: 0, x: 0, y: 0, toJSON: () => ({}) } as DOMRect;
      };
      try {
        const { rerender, container } = renderTimeline({ plan: emptyPlan() });
        rerender(<ProjectTimeline plan={examplePlan()} showToday allowExport locale="de-DE" />);
        expect(container.querySelector(".man-pt__overlay")).toHaveAttribute("width", "600");
      } finally {
        HTMLElement.prototype.getBoundingClientRect = original;
      }
    });

    it("holt einen Eintrag nur bei Tastaturfokus heran, nicht bei Zeigerfokus", async () => {
      renderTimeline();
      const window = screen.getByRole("slider", { name: "Sichtbarer Zeitraum" });
      const whole = window.getAttribute("aria-valuetext");
      for (let step = 0; step < 3; step += 1) fireEvent.click(screen.getByRole("button", { name: "Vergrößern" }));
      // Die Knöpfe animieren; gemessen wird, wenn die Animation ruht.
      await act(() => new Promise((resolve) => setTimeout(resolve, 400)));
      const before = window.getAttribute("aria-valuetext");
      expect(before).not.toBe(whole);

      // „SOP Core MY25“ (Januar 2025) liegt nach dem Zoom links außerhalb.
      const early = item(/^Meilenstein: SOP Core MY25/);
      fireEvent.pointerDown(early);
      act(() => early.focus());
      expect(window.getAttribute("aria-valuetext")).toBe(before);

      act(() => early.blur());
      fireEvent.keyDown(early, { key: "Tab" });
      act(() => early.focus());
      expect(window.getAttribute("aria-valuetext")).not.toBe(before);
    });

    it("meldet der Vorschau den Ausschnitt ohne Rand, damit die Startansicht nicht wandert", () => {
      const onViewportChange = jest.fn();
      renderTimeline({ mode: "editor", onViewportChange });
      const reported = onViewportChange.mock.calls.at(-1)[0];
      expect(reported.start).toBeCloseTo(dayFromParts(2025, 1, 1), 0);
      expect(reported.end).toBeCloseTo(dayFromParts(2032, 1, 1), 0);
    });

    it("lässt den Fokus beim Springen zum nächsten Treffer im Suchfeld", () => {
      renderTimeline();
      const search = screen.getByRole("searchbox", { name: "Einträge durchsuchen" });
      search.focus();
      fireEvent.change(search, { target: { value: "iaa" } });
      fireEvent.keyDown(search, { key: "Enter" });
      expect(search).toHaveFocus();
      expect(screen.getByText("1 von 3 Treffern")).toBeInTheDocument();
      expect(item(/^Meilenstein: IAA, 15\. September 2026/)).toHaveClass("is-current");
      fireEvent.keyDown(search, { key: "Enter" });
      expect(screen.getByText("2 von 3 Treffern")).toBeInTheDocument();
    });

    it("gibt den Fokus nach dem Export-Dialog an den Knopf zurück", () => {
      renderTimeline();
      const button = screen.getByRole("button", { name: "Exportieren" });
      button.focus();
      fireEvent.click(button);
      fireEvent.click(within(screen.getByRole("dialog")).getByRole("button", { name: "Abbrechen" }));
      expect(button).toHaveFocus();
    });

    it("behält den Fokus in den Details, wenn zum Vorgänger gewechselt wird", async () => {
      renderTimeline();
      fireEvent.click(item(/^Meilenstein: 1\. SOP eTGL,/));
      fireEvent.click(within(await screen.findByRole("dialog")).getByRole("button", { name: "eTGL C4S" }));
      const dialog = await screen.findByRole("dialog", { name: "eTGL C4S" });
      await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true));
    });
  });
});

describe("verknüpfte Inhalte in der Leseansicht", () => {
  const MENU_ID = "6abe2602f70f4a552a0470c4";
  const POST_ID = "6a7b213404bf7d770c9d579a";

  const linkedPlan = () => {
    const plan = examplePlan();
    return {
      ...plan,
      items: plan.items.map((entry) => {
        if (entry.id === "fair-iaa-26") return { ...entry, content: { kind: "page" as const, id: "6abe2602f70f4a552a0470c3", menuId: MENU_ID } };
        if (entry.id === "fair-bauma-25") return { ...entry, content: { kind: "news" as const, id: POST_ID } };
        return entry;
      }),
    };
  };

  const respond = (post: { status: number; body?: unknown }) =>
    jest.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
      const url = String(input);
      if (url === "/api/users/me") return new Response(JSON.stringify({ config: { locale: "de_DE" } }), { status: 200 });
      if (url === `/api/posts/${POST_ID}`) return new Response(post.body === undefined ? "" : JSON.stringify(post.body), { status: post.status });
      return new Response("", { status: 404 });
    });

  afterEach(() => jest.restoreAllMocks());

  it("sagt im Namen eines Eintrags, dass er einen Inhalt öffnet", () => {
    renderTimeline({ plan: linkedPlan() });
    expect(item(/^Meilenstein: IAA, 15\. September 2026, .* – öffnet verknüpfte Seite$/)).toBeInTheDocument();
    expect(item(/^Meilenstein: Bauma, 7\. April 2025, .* – öffnet verknüpften Beitrag$/)).toBeInTheDocument();
    expect(item(/^Meilenstein: IAA, 15\. September 2026/)).toHaveAttribute("aria-haspopup", "dialog");
  });

  it("öffnet eine verknüpfte Seite im Modal statt der Details", () => {
    renderTimeline({ plan: linkedPlan() });
    fireEvent.click(item(/^Meilenstein: IAA, 15\. September 2026/));

    const dialog = screen.getByRole("dialog", { name: "IAA" });
    expect(screen.getAllByRole("dialog")).toHaveLength(1);
    expect(within(dialog).getByTitle("IAA")).toHaveAttribute("src", `/content/page/${MENU_ID}`);
    expect(within(dialog).getByRole("link", { name: /neuem Tab/i })).toHaveAttribute("href", `/content/page/${MENU_ID}`);
    expect(within(dialog).getByText(/^Meilenstein · 15\. September 2026/)).toBeInTheDocument();
  });

  it("lädt einen verknüpften Beitrag mit der Sitzung der Leser:in und zeigt ihn", async () => {
    const fetchMock = respond({
      status: 200,
      body: { id: POST_ID, contentType: "articles", contents: { de_DE: { title: "Bauma-News", content: "<p>Der Text</p>" } } },
    });
    renderTimeline({ plan: linkedPlan() });
    fireEvent.click(item(/^Meilenstein: Bauma, 7\. April 2025/));

    const dialog = screen.getByRole("dialog", { name: "Bauma" });
    expect(await within(dialog).findByText("Der Text")).toBeInTheDocument();
    expect(within(dialog).getByText("Bauma-News")).toBeInTheDocument();
    expect(within(dialog).getByRole("link", { name: /neuem Tab/i })).toHaveAttribute("href", `/content/news/article/${POST_ID}`);
    expect(fetchMock).toHaveBeenCalledWith(`/api/posts/${POST_ID}`, expect.objectContaining({ credentials: "same-origin" }));
  });

  it.each([403, 404])("sagt bei HTTP %i, dass der Beitrag nicht verfügbar ist — der Link bleibt", async (status) => {
    respond({ status });
    renderTimeline({ plan: linkedPlan() });
    fireEvent.click(item(/^Meilenstein: Bauma, 7\. April 2025/));

    const dialog = screen.getByRole("dialog", { name: "Bauma" });
    expect(await within(dialog).findByText(/nicht verfügbar oder nicht freigegeben/)).toBeInTheDocument();
    expect(within(dialog).getByRole("link", { name: /neuem Tab/i })).toBeInTheDocument();
  });

  it("schließt mit Escape und gibt den Fokus an den Eintrag zurück", () => {
    renderTimeline({ plan: linkedPlan() });
    const iaa = item(/^Meilenstein: IAA, 15\. September 2026/);
    iaa.focus();
    fireEvent.click(iaa);
    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(iaa).toHaveFocus();
  });

  it("öffnet den Inhalt auch aus der Listenansicht", () => {
    renderTimeline({ plan: linkedPlan() });
    fireEvent.click(screen.getByRole("button", { name: "Liste" }));

    const table = screen.getByRole("table");
    expect(within(table).getByRole("columnheader", { name: "Inhalt" })).toBeInTheDocument();
    fireEvent.click(within(table).getByRole("button", { name: "Seite öffnen: IAA" }));
    expect(screen.getByRole("dialog", { name: "IAA" })).toBeInTheDocument();
    expect(within(table).getByRole("button", { name: "Beitrag öffnen: Bauma" })).toBeInTheDocument();
  });

  const ATTACHMENTS = [
    { mediaId: "m1", url: "/api/media/secure/external/v2/raw/upload/plan.pdf", fileName: "plan.pdf", kind: "file" as const, label: "Ablaufplan" },
    { mediaId: "m2", url: "/api/media/secure/external/v2/image/upload/bild.png", fileName: "bild.png", kind: "image" as const },
  ];

  const withAttachments = (id: string) => {
    const plan = linkedPlan();
    return { ...plan, items: plan.items.map((entry) => (entry.id === id ? { ...entry, attachments: ATTACHMENTS } : entry)) };
  };

  it("zeigt die Anhänge im Modal neben dem Inhalt", () => {
    renderTimeline({ plan: withAttachments("fair-iaa-26") });
    fireEvent.click(item(/^Meilenstein: IAA, 15\. September 2026/));

    const aside = within(screen.getByRole("dialog", { name: "IAA" })).getByRole("complementary");
    expect(within(aside).getByRole("link", { name: /Ablaufplan/ })).toHaveAttribute("download", "plan.pdf");
    expect(within(aside).getByRole("img", { name: "bild.png" })).toHaveAttribute("src", ATTACHMENTS[1].url);
  });

  it("zeigt die Anhänge eines Eintrags ohne Inhalt in seinen Details", () => {
    renderTimeline({ plan: withAttachments("fair-iaa-28") });
    fireEvent.click(item(/^Meilenstein: IAA, 19\. September 2028/));

    const details = screen.getByRole("dialog", { name: "IAA" });
    expect(within(details).getByRole("list", { name: "Anhänge" })).toBeInTheDocument();
    expect(within(details).getByRole("link", { name: /Ablaufplan/ })).toHaveAttribute("href", ATTACHMENTS[0].url);
  });

  it("wählt im Editor den Eintrag aus, statt etwas zu öffnen", () => {
    const onSelectItem = jest.fn();
    renderTimeline({ plan: linkedPlan(), mode: "editor", onSelectItem });
    const iaa = item(/^Meilenstein: IAA, 15\. September 2026/);

    expect(iaa.getAttribute("aria-label")).not.toMatch(/öffnet verknüpfte/);
    fireEvent.click(iaa);
    expect(onSelectItem).toHaveBeenCalledWith("fair-iaa-26");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
