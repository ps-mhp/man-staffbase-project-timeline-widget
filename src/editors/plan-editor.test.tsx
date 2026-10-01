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

jest.mock("../project-timeline", () =>
  jest.requireActual("./project-timeline.mock"),
);

beforeEach(() => {
  mockTimelineProps.current = null;
});

afterEach(() => window.localStorage.clear());

describe("PlanEditor: Rahmen und Vorschau", () => {
  it("trägt Titel, Zähler und die Knöpfe zum Beenden in der Kopfleiste", () => {
    render(<Harness />);
    const bar = screen.getByTestId("plan-editor-bar");
    expect(
      within(bar).getByRole("heading", { name: "Projektplan bearbeiten" }),
    ).toBeInTheDocument();
    expect(within(bar).getByLabelText("Überschrift")).toBeInTheDocument();
    expect(
      within(bar).getByText(`4 / ${LIMITS.items} Einträge`),
    ).toBeInTheDocument();
    expect(
      within(bar).getByRole("button", { name: "Abbrechen" }),
    ).toBeInTheDocument();
    expect(
      within(bar).getByRole("button", { name: "Übernehmen" }),
    ).toBeInTheDocument();
  });

  it("sagt in der Kopfleiste, wenn es ungespeicherte Änderungen gibt", () => {
    const { rerender } = render(<Harness />);
    expect(
      screen.queryByText("Ungespeicherte Änderungen"),
    ).not.toBeInTheDocument();
    rerender(<Harness dirty />);
    expect(
      within(screen.getByTestId("plan-editor-bar")).getByText(
        "Ungespeicherte Änderungen",
      ),
    ).toBeInTheDocument();
  });

  it("verstellt die Höhe der Vorschau mit dem Griff darunter und behält sie beim Ein- und Ausklappen", () => {
    render(<Harness />);
    const handle = screen.getByRole("separator", {
      name: "Höhe der Vorschau ändern",
    });
    const stage = document.getElementById(
      handle.getAttribute("aria-controls") ?? "",
    ) as HTMLElement;
    const before = Number(handle.getAttribute("aria-valuenow"));
    expect(stage.style.height).toBe(`${before}px`);
    // Darunter bliebe für die Bühne des Zeitstrahls nichts übrig.
    expect(handle).toHaveAttribute("aria-valuemin", "300");

    fireEvent.keyDown(handle, { key: "ArrowDown", shiftKey: true });
    expect(stage.style.height).toBe(`${before + 64}px`);

    fireEvent.click(screen.getByRole("button", { name: "Vorschau" }));
    expect(
      screen.queryByRole("separator", { name: "Höhe der Vorschau ändern" }),
    ).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Vorschau" }));
    expect(
      screen.getByRole("separator", { name: "Höhe der Vorschau ändern" }),
    ).toHaveAttribute("aria-valuenow", String(before + 64));
  });

  it("verstellt die Breite der Liste mit dem Griff daneben", () => {
    const { container } = render(<Harness />);
    // Über den Selektor, nicht die Rolle: jsdom wertet
    // `@media (min-width: 900px)` nicht aus, und darunter blendet das
    // Stylesheet den Griff aus — für die Rollenabfrage wäre er unsichtbar.
    const handle = container.querySelector(
      '[role="separator"][aria-label="Breite der Liste ändern"]',
    ) as HTMLElement;
    expect(handle).toHaveAttribute("aria-orientation", "vertical");
    expect(
      document.getElementById(handle.getAttribute("aria-controls") ?? ""),
    ).toContainElement(screen.getByLabelText("Einträge durchsuchen"));
    fireEvent.keyDown(handle, { key: "ArrowRight" });
    const entries = container.querySelector(
      ".man-pt-editor__entries",
    ) as HTMLElement;
    expect(entries.style.getPropertyValue("--pt-list-width")).toBe("356px");
  });

  it("markiert einen in der Vorschau gewählten Eintrag in der Liste", () => {
    render(<Harness />);
    fireEvent.click(
      screen.getByRole("button", { name: "Vorschau: Bauma wählen" }),
    );
    expect(screen.getByRole("button", { name: /^Bauma/ })).toHaveAttribute(
      "aria-current",
      "true",
    );
  });

  it("zeigt die Vorschau im Editor-Modus, ohne Export, auf Deutsch", () => {
    render(<Harness />);
    expect(screen.getByTestId("timeline")).toBeInTheDocument();
    expect(mockTimelineProps.current).toMatchObject({
      mode: "editor",
      allowExport: false,
      showToday: true,
      locale: "de-DE",
      selectedId: null,
    });
  });

  it("sagt in der Vorschau, dass sie mit dem ersten Eintrag erscheint", () => {
    const plan: Plan = {
      ...emptyPlan(),
      lanes: [{ id: "l1", title: "Ebene 1" }],
    };
    render(<Harness initial={{ plan, dropped: 0 }} />);
    expect(screen.queryByTestId("timeline")).not.toBeInTheDocument();
    expect(
      screen.getByText("Die Vorschau erscheint mit dem ersten Eintrag."),
    ).toBeInTheDocument();
  });

  it("gibt dem Zeitstrahl im Kopf der Vorschau Platz für seine Zoom-Knöpfe", () => {
    render(<Harness />);
    const host = screen.getByTestId("preview-tools");
    expect(mockTimelineProps.current?.toolbarTarget).toBe(host);
    fireEvent.click(screen.getByRole("button", { name: "Vorschau" }));
    expect(screen.queryByTestId("preview-tools")).not.toBeInTheDocument();
  });

  it("klappt die Vorschau ein und wieder aus", () => {
    render(<Harness />);
    const toggle = screen.getByRole("button", { name: "Vorschau" });
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByTestId("timeline")).not.toBeInTheDocument();
    fireEvent.click(toggle);
    expect(screen.getByTestId("timeline")).toBeInTheDocument();
  });

  it("wählt einen Eintrag aus der Vorschau im Formular — auch aus einem anderen Reiter", () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole("tab", { name: "Ebenen" }));
    fireEvent.click(
      screen.getByRole("button", { name: "Vorschau: Bauma wählen" }),
    );
    expect(screen.getByRole("tab", { name: "Einträge" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByLabelText("Titel")).toHaveValue("Bauma");
    expect(mockTimelineProps.current?.selectedId).toBe("m1");
  });

  it("setzt den gemeldeten Ausschnitt als Startansicht", () => {
    const onChange = jest.fn();
    render(<Harness onChange={onChange} />);
    const setView = screen.getByRole("button", {
      name: "Diesen Ausschnitt als Startansicht",
    });
    expect(setView).toBeDisabled();
    expect(
      screen.queryByRole("button", { name: "Startansicht entfernen" }),
    ).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Vorschau: Ausschnitt 2025" }),
    );
    fireEvent.click(setView);
    expect(lastPlan(onChange).view).toEqual({
      start: "2025-01",
      end: "2025-12",
    });
    expect(
      screen.getByText("Startansicht: Januar 2025 bis Dezember 2025"),
    ).toBeInTheDocument();
  });

  it("entfernt die Startansicht", () => {
    const onChange = jest.fn();
    const plan = { ...testPlan(), view: { start: "2025-01", end: "2031-12" } };
    render(<Harness initial={{ plan, dropped: 0 }} onChange={onChange} />);
    fireEvent.click(
      screen.getByRole("button", { name: "Startansicht entfernen" }),
    );
    expect(lastPlan(onChange)).not.toHaveProperty("view");
    expect(
      screen.queryByRole("button", { name: "Startansicht entfernen" }),
    ).not.toBeInTheDocument();
  });

  it.each([
    [
      1,
      "1 Eintrag konnte nicht gelesen werden und geht beim Speichern verloren.",
    ],
    [
      3,
      "3 Einträge konnten nicht gelesen werden und gehen beim Speichern verloren.",
    ],
  ])(
    "warnt, wenn beim Lesen %i Einträge verworfen wurden",
    (dropped, message) => {
      render(<Harness initial={{ plan: testPlan(), dropped }} />);
      expect(screen.getByText(message)).toBeInTheDocument();
    },
  );

  it("warnt nicht ohne verworfene Einträge", () => {
    render(<Harness />);
    expect(screen.queryByText(/nicht gelesen werden/)).not.toBeInTheDocument();
  });

  it("setzt die Überschrift und entfernt sie, wenn sie leer wird", () => {
    const onChange = jest.fn();
    render(<Harness onChange={onChange} />);
    const title = screen.getByLabelText("Überschrift");
    fireEvent.change(title, { target: { value: "Sales Truck Launch" } });
    expect(lastPlan(onChange).title).toBe("Sales Truck Launch");
    fireEvent.change(title, { target: { value: " " } });
    expect(lastPlan(onChange)).not.toHaveProperty("title");
  });

  it("zeigt das Feld „Überschrift“ auch im Leerzustand", () => {
    render(
      <Harness
        initial={{ plan: { ...emptyPlan(), title: "Launch" }, dropped: 0 }}
      />,
    );
    expect(screen.getByLabelText("Überschrift")).toHaveValue("Launch");
  });

  it("zählt die Einträge gegen die Obergrenze", () => {
    render(<Harness />);
    expect(
      screen.getByText(`4 / ${LIMITS.items} Einträge`),
    ).toBeInTheDocument();
  });
});
