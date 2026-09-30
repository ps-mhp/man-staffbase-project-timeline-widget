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
