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

import * as React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";

import { LIMITS, Plan } from "../plan-model";
import { Harness, emptyPlan, lastPlan } from "./plan-editor.fixture";
import { mockTimelineProps } from "./project-timeline.mock";
import { testPlan } from "./test-plan.fixture";

jest.mock("../project-timeline", () => jest.requireActual("./project-timeline.mock"));

beforeEach(() => {
  mockTimelineProps.current = null;
});

describe("PlanEditor: Rahmen", () => {
  it("zeigt links die Einträge nach Termin mit Zähler, in der Mitte das Formular des ersten", () => {
    render(<Harness />);
    const side = screen.getByRole("complementary", { name: /^Einträge/ });
    expect(within(side).getByText(`4 von ${LIMITS.items}`)).toBeInTheDocument();
    const rows = within(within(side).getByRole("grid", { name: "Einträge" })).getAllByRole("row");
    expect(rows.map((row) => within(row).getByText(/^(Bauma|SOP|Euro 7|TMS1)$/).textContent)).toEqual([
      "Bauma",
      "SOP",
      "Euro 7",
      "TMS1",
    ]);
    expect(screen.getByRole("heading", { name: "Eintrag 1 von 4" })).toBeInTheDocument();
    expect(screen.getByLabelText(/^Titel \*/)).toHaveValue("Bauma");
    expect(screen.getByTestId("entry-kind")).toHaveTextContent("Meilenstein");
  });

  it("zeigt rechts das Panel „Plan“ mit drei Reitern", () => {
    render(<Harness />);
    const panel = screen.getByRole("complementary", { name: "Plan" });
    expect(
      within(panel)
        .getAllByRole("tab")
        .map((tab) => tab.textContent),
    ).toEqual(["Einstellungen", "Ebenen2", "Kategorien2"]);
  });

  it("verändert den Plan nicht, solange niemand etwas tut", () => {
    const onChange = jest.fn();
    render(<Harness onChange={onChange} />);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("zeigt die Vorschau nur in den Geräteansichten, im Editor-Modus, ohne Export, auf Deutsch", () => {
    const { rerender } = render(<Harness />);
    expect(screen.queryByTestId("timeline")).not.toBeInTheDocument();
    rerender(<Harness view="tablet" />);
    expect(screen.getByRole("region", { name: "Vorschau Tablet" })).toContainElement(screen.getByTestId("timeline"));
    expect(mockTimelineProps.current).toMatchObject({
      mode: "editor",
      allowExport: false,
      showToday: true,
      locale: "de-DE",
      selectedId: "m1",
    });
  });

  it("sagt in der Vorschau, dass sie mit dem ersten Eintrag erscheint", () => {
    const plan: Plan = { ...emptyPlan(), lanes: [{ id: "l1", title: "Ebene 1" }] };
    render(<Harness initial={{ plan, dropped: 0 }} view="desktop" />);
    expect(screen.queryByTestId("timeline")).not.toBeInTheDocument();
    expect(screen.getByText("Die Vorschau erscheint mit dem ersten Eintrag.")).toBeInTheDocument();
  });

  it("wählt einen Eintrag aus der Vorschau im Formular", () => {
    const { rerender } = render(<Harness view="desktop" />);
    fireEvent.click(screen.getByRole("button", { name: "Vorschau: Bauma wählen" }));
    expect(mockTimelineProps.current?.selectedId).toBe("m1");
    rerender(<Harness view="editor" />);
    expect(screen.getByLabelText(/^Titel \*/)).toHaveValue("Bauma");
    expect(screen.getByRole("row", { selected: true })).toHaveTextContent("Bauma");
  });

  it.each([
    [1, "1 Eintrag konnte nicht gelesen werden und geht beim Speichern verloren."],
    [3, "3 Einträge konnten nicht gelesen werden und gehen beim Speichern verloren."],
  ])("warnt, wenn beim Lesen %i Einträge verworfen wurden", (dropped, message) => {
    render(<Harness initial={{ plan: testPlan(), dropped }} />);
    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it.each([
    [1, "1 Verknüpfung konnte nicht gelesen werden und geht beim Speichern verloren."],
    [2, "2 Verknüpfungen konnten nicht gelesen werden und gehen beim Speichern verloren."],
  ])("warnt, wenn beim Lesen %i Verknüpfungen verworfen wurden", (droppedLinks, message) => {
    render(<Harness initial={{ plan: testPlan(), dropped: 0, droppedLinks }} />);
    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it("nennt verworfene Einträge und Verknüpfungen zusammen", () => {
    render(<Harness initial={{ plan: testPlan(), dropped: 1, droppedLinks: 1 }} />);
    expect(screen.getByRole("alert")).toHaveTextContent(
      "1 Eintrag konnte nicht gelesen werden und geht beim Speichern verloren. 1 Verknüpfung konnte nicht gelesen werden und geht beim Speichern verloren.",
    );
  });

  it("nimmt den Hinweis zurück, sobald der übernommene Stand nichts Verworfenes mehr hat", () => {
    const withDropped = { plan: testPlan(), dropped: 2, droppedLinks: 1 };
    const { rerender } = render(<Harness initial={withDropped} saved={withDropped} />);
    expect(screen.getByRole("alert")).toBeInTheDocument();

    // Nach dem Übernehmen liest `parse` das Feld neu: nichts ist mehr verworfen.
    rerender(<Harness initial={withDropped} saved={{ ...withDropped, dropped: 0, droppedLinks: 0 }} />);
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("warnt nicht ohne verworfene Einträge", () => {
    render(<Harness />);
    expect(screen.queryByText(/nicht gelesen werden/)).not.toBeInTheDocument();
  });
});

describe("PlanEditor: Seitenleiste", () => {
  it("sucht und filtert nach Art", () => {
    render(<Harness />);
    const list = (): string[] =>
      within(screen.getByRole("grid", { name: "Einträge" }))
        .getAllByRole("row")
        .map((row) => row.textContent ?? "");
    fireEvent.change(screen.getByLabelText("Einträge durchsuchen"), { target: { value: "sop" } });
    // Die Suche kennt auch die Ebene: „SOPs“ trägt neben „SOP“ den Zeitraum „TMS1“.
    expect(list()).toHaveLength(2);
    expect(list()[0]).toContain("SOP");
    fireEvent.change(screen.getByLabelText("Einträge durchsuchen"), { target: { value: "" } });
    fireEvent.change(screen.getByLabelText("Art filtern"), { target: { value: "milestone" } });
    expect(list()).toHaveLength(2);
    fireEvent.change(screen.getByLabelText("Art filtern"), { target: { value: "deadline" } });
    expect(list()).toHaveLength(1);
    expect(list()[0]).toContain("Euro 7");
  });

  it("nennt, wenn nichts zur Suche passt", () => {
    render(<Harness />);
    fireEvent.change(screen.getByLabelText("Einträge durchsuchen"), { target: { value: "gibt es nicht" } });
    expect(screen.getByText("Kein Eintrag passt zur Suche.")).toBeInTheDocument();
  });

  it("legt über „Neu“ einen Meilenstein heute an, wählt ihn und setzt den Fokus in den markierten Titel", () => {
    const onChange = jest.fn();
    render(<Harness onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Neu" }));
    fireEvent.click(screen.getByRole("menuitem", { name: /^Meilenstein/ }));

    const plan = lastPlan(onChange);
    const created = plan.items[plan.items.length - 1];
    expect(created).toMatchObject({ kind: "milestone", title: "Neuer Meilenstein", lane: "l1" });
    const title = screen.getByLabelText(/^Titel \*/) as HTMLInputElement;
    expect(title).toHaveValue("Neuer Meilenstein");
    expect(title).toHaveFocus();
    expect([title.selectionStart, title.selectionEnd]).toEqual([0, 17]);
    expect(screen.getByRole("tab", { name: "Allgemein" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText(`5 von ${LIMITS.items}`)).toBeInTheDocument();
  });

  it("legt in der Mitte des Ausschnitts an, den die Vorschau gemeldet hat", () => {
    const onChange = jest.fn();
    const { rerender } = render(<Harness view="desktop" onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Vorschau: Ausschnitt 2025" }));
    rerender(<Harness view="editor" onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Neu" }));
    fireEvent.click(screen.getByRole("menuitem", { name: /^Stichtag/ }));
    const plan = lastPlan(onChange);
    expect(plan.items[plan.items.length - 1]).toMatchObject({ kind: "deadline", date: "2025-07-02" });
  });

  it("bietet ohne Ebene nur den Stichtag an und sagt, wo Ebenen entstehen", () => {
    const plan: Plan = {
      ...emptyPlan(),
      items: [{ id: "d1", kind: "deadline", title: "Euro 7", date: "2027-07-01" }],
    };
    render(<Harness initial={{ plan, dropped: 0 }} />);
    expect(screen.getAllByText(/brauchen eine Ebene/).length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole("button", { name: "Neu" }));
    expect(screen.getAllByRole("menuitem").map((item) => item.textContent)).toEqual([
      expect.stringMatching(/^Stichtag/),
    ]);
  });

  it("dupliziert und löscht den gewählten Eintrag; die Auswahl rückt nach, der Fokus auf seine Zeile", () => {
    const onChange = jest.fn();
    render(<Harness onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Eintrag duplizieren" }));
    expect(screen.getByLabelText(/^Titel \*/)).toHaveValue("Bauma (Kopie)");

    fireEvent.click(screen.getByRole("button", { name: "Eintrag löschen" }));
    fireEvent.click(within(screen.getByRole("dialog")).getByRole("button", { name: "Löschen" }));
    expect(lastPlan(onChange).items.map((item) => item.title)).not.toContain("Bauma (Kopie)");
    expect(screen.getByLabelText(/^Titel \*/)).toHaveValue("SOP");
    expect(screen.getByRole("row", { selected: true })).toHaveTextContent("SOP");
  });

  it("nimmt beim Löschen die Verweise anderer Einträge mit", () => {
    const onChange = jest.fn();
    render(<Harness onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Eintrag löschen" }));
    fireEvent.click(within(screen.getByRole("dialog")).getByRole("button", { name: "Löschen" }));
    const tms = lastPlan(onChange).items.find((item) => item.id === "b1");
    expect(tms).not.toHaveProperty("dependsOn");
  });

  it("behält den Reiter des Formulars beim Wechsel zu einem anderen Eintrag", () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole("tab", { name: "Termin" }));
    fireEvent.click(within(screen.getByRole("grid", { name: "Einträge" })).getByRole("row", { name: /SOP/ }));
    expect(screen.getByRole("tab", { name: "Termin" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByLabelText("Datum")).toHaveValue("2026-01-15");
  });

  it("wechselt die Art im Formular und zeigt die passenden Felder", () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole("radio", { name: "Stichtag" }));
    fireEvent.click(screen.getByRole("tab", { name: "Einordnung" }));
    expect(screen.queryByLabelText("Ebene")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("tab", { name: "Termin" }));
    expect(screen.getByLabelText("Datum")).toHaveValue("2025-04-07");
  });
});

describe("PlanEditor: Leerzustand", () => {
  const empty = (): { plan: Plan; dropped: number } => ({ plan: emptyPlan(), dropped: 0 });

  it("zeigt zum Beginnen mit einer Vorlage alle Vorlagen zur Wahl", () => {
    const onChange = jest.fn();
    render(<Harness initial={empty()} onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Mit Vorlage beginnen" }));
    const gallery = screen.getByRole("list", { name: "Vorlagen" });
    expect(within(gallery).getAllByRole("button").length).toBeGreaterThan(0);
    // Die Wahl allein ändert den Plan noch nicht.
    expect(onChange).not.toHaveBeenCalled();
  });

  it("beginnt einen leeren Plan leer mit einer Ebene", () => {
    const onChange = jest.fn();
    render(<Harness initial={empty()} onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Leer beginnen" }));
    expect(lastPlan(onChange).lanes).toEqual([{ id: expect.any(String), title: "Ebene 1" }]);
    expect(screen.queryByRole("button", { name: "Leer beginnen" })).not.toBeInTheDocument();
  });

  it("nennt im Formular, dass kein Eintrag gewählt ist, solange es nur eine Ebene gibt", () => {
    const plan: Plan = { ...emptyPlan(), lanes: [{ id: "l1", title: "Ebene 1" }] };
    render(<Harness initial={{ plan, dropped: 0 }} />);
    expect(screen.getByText("Links einen Eintrag wählen oder einen neuen anlegen.")).toBeInTheDocument();
  });
});
