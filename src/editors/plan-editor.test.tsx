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
import { useState } from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";

import { examplePlan } from "../example-plan";
import { LIMITS, Plan, todayIso } from "../plan-model";
import { ProjectTimelineProps } from "../project-timeline";
import { PlanEditorValue } from "../plan-editor-injector";
import { PlanEditor } from "./plan-editor";
import { findItem, testPlan } from "./test-plan.fixture";

// Die echte Zeitleiste entsteht parallel und misst Breiten, die jsdom nicht
// kennt. Die Attrappe zeigt, was der Editor ihr gibt, und meldet wie sie.
const mockTimelineProps: { current: ProjectTimelineProps | null } = { current: null };
jest.mock("../project-timeline", () => {
  const { dayFromParts } = jest.requireActual("../calendar");
  return {
    ProjectTimeline: (props: ProjectTimelineProps) => {
      mockTimelineProps.current = props;
      return (
        <div data-testid="timeline">
          <button type="button" onClick={() => props.onSelectItem?.("m1")}>
            Vorschau: Bauma wählen
          </button>
          <button
            type="button"
            onClick={() => props.onViewportChange?.({ start: dayFromParts(2025, 1, 1), end: dayFromParts(2026, 1, 1) })}
          >
            Vorschau: Ausschnitt 2025
          </button>
        </div>
      );
    },
  };
});

interface HarnessProps {
  initial?: PlanEditorValue;
  onChange?: jest.Mock;
  onSave?: jest.Mock;
  onClose?: jest.Mock;
}

function Harness({
  initial = { plan: testPlan(), dropped: 0 },
  onChange = jest.fn(),
  onSave = jest.fn(),
  onClose = jest.fn(),
}: HarnessProps): React.ReactElement {
  const [value, setValue] = useState(initial);
  return (
    <PlanEditor
      value={value}
      onChange={(next) => {
        onChange(next);
        setValue(next);
      }}
      onSave={onSave}
      onClose={onClose}
      dirty={false}
    />
  );
}

const lastPlan = (spy: jest.Mock): Plan => (spy.mock.calls[spy.mock.calls.length - 1][0] as PlanEditorValue).plan;

const emptyPlan = (): Plan => ({ version: 1, lanes: [], categories: [], items: [] });

beforeEach(() => {
  mockTimelineProps.current = null;
});

describe("PlanEditor", () => {
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
    const plan: Plan = { ...emptyPlan(), lanes: [{ id: "l1", title: "Ebene 1" }] };
    render(<Harness initial={{ plan, dropped: 0 }} />);
    expect(screen.queryByTestId("timeline")).not.toBeInTheDocument();
    expect(screen.getByText("Die Vorschau erscheint mit dem ersten Eintrag.")).toBeInTheDocument();
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
    fireEvent.click(screen.getByRole("button", { name: "Vorschau: Bauma wählen" }));
    expect(screen.getByRole("tab", { name: "Einträge" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByLabelText("Titel")).toHaveValue("Bauma");
    expect(mockTimelineProps.current?.selectedId).toBe("m1");
  });

  it("setzt den gemeldeten Ausschnitt als Startansicht", () => {
    const onChange = jest.fn();
    render(<Harness onChange={onChange} />);
    const setView = screen.getByRole("button", { name: "Diesen Ausschnitt als Startansicht" });
    expect(setView).toBeDisabled();
    expect(screen.queryByRole("button", { name: "Startansicht entfernen" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Vorschau: Ausschnitt 2025" }));
    fireEvent.click(setView);
    expect(lastPlan(onChange).view).toEqual({ start: "2025-01", end: "2025-12" });
    expect(screen.getByText("Startansicht: Januar 2025 bis Dezember 2025")).toBeInTheDocument();
  });

  it("entfernt die Startansicht", () => {
    const onChange = jest.fn();
    const plan = { ...testPlan(), view: { start: "2025-01", end: "2031-12" } };
    render(<Harness initial={{ plan, dropped: 0 }} onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Startansicht entfernen" }));
    expect(lastPlan(onChange)).not.toHaveProperty("view");
    expect(screen.queryByRole("button", { name: "Startansicht entfernen" })).not.toBeInTheDocument();
  });

  it.each([
    [1, "1 Eintrag konnte nicht gelesen werden und geht beim Speichern verloren."],
    [3, "3 Einträge konnten nicht gelesen werden und gehen beim Speichern verloren."],
  ])("warnt, wenn beim Lesen %i Einträge verworfen wurden", (dropped, message) => {
    render(<Harness initial={{ plan: testPlan(), dropped }} />);
    expect(screen.getByText(message)).toBeInTheDocument();
  });

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
    render(<Harness initial={{ plan: { ...emptyPlan(), title: "Launch" }, dropped: 0 }} />);
    expect(screen.getByLabelText("Überschrift")).toHaveValue("Launch");
  });

  it("zählt die Einträge gegen die Obergrenze", () => {
    render(<Harness />);
    expect(screen.getByText(`4 / ${LIMITS.items} Einträge`)).toBeInTheDocument();
  });

  it("legt einen Meilenstein in der Mitte der Vorschau an und wählt ihn", () => {
    const onChange = jest.fn();
    render(<Harness onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Vorschau: Ausschnitt 2025" }));
    fireEvent.click(screen.getByRole("button", { name: "Meilenstein hinzufügen" }));

    const plan = lastPlan(onChange);
    const created = plan.items[plan.items.length - 1];
    expect(created).toMatchObject({ kind: "milestone", title: "Neuer Meilenstein", date: "2025-07-02", lane: "l1" });
    expect(screen.getByLabelText("Titel")).toHaveValue("Neuer Meilenstein");
    expect(screen.getByLabelText("Titel")).toHaveFocus();
    expect(screen.getByText(`5 / ${LIMITS.items} Einträge`)).toBeInTheDocument();
  });

  it("legt ohne gemeldeten Ausschnitt heute an", () => {
    const onChange = jest.fn();
    render(<Harness onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Stichtag hinzufügen" }));
    const plan = lastPlan(onChange);
    expect(plan.items[plan.items.length - 1]).toMatchObject({ kind: "deadline", date: todayIso() });
  });

  it("dupliziert und löscht den gewählten Eintrag", () => {
    const onChange = jest.fn();
    render(<Harness onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: /^Bauma/ }));
    fireEvent.click(screen.getByRole("button", { name: "Duplizieren" }));
    expect(screen.getByLabelText("Titel")).toHaveValue("Bauma (Kopie)");

    fireEvent.click(screen.getByRole("button", { name: "Löschen" }));
    const plan = lastPlan(onChange);
    expect(plan.items.map((item) => item.title)).not.toContain("Bauma (Kopie)");
    expect(screen.queryByLabelText("Titel")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Einträge durchsuchen")).toHaveFocus();
  });

  it("löscht einen Eintrag samt Verweisen", () => {
    const onChange = jest.fn();
    render(<Harness onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: /^Bauma/ }));
    fireEvent.click(screen.getByRole("button", { name: "Löschen" }));
    expect(findItem(lastPlan(onChange), "b1")).not.toHaveProperty("dependsOn");
  });

  it("zeigt die Ebenen und Kategorien in ihren Reitern", () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole("tab", { name: "Ebenen" }));
    expect(screen.getByRole("tabpanel", { name: "Ebenen" })).toContainElement(screen.getByLabelText("Name der Ebene 1"));
    fireEvent.click(screen.getByRole("tab", { name: "Kategorien" }));
    expect(screen.getByLabelText("Name der Kategorie 1")).toHaveValue("General");
  });

  it("beginnt einen leeren Plan mit dem Beispielplan", () => {
    const onChange = jest.fn();
    render(<Harness initial={{ plan: emptyPlan(), dropped: 0 }} onChange={onChange} />);
    expect(screen.queryByRole("tablist")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Mit Beispielplan beginnen" }));
    expect(lastPlan(onChange)).toEqual({ ...examplePlan(), updatedAt: todayIso() });
    expect(screen.getByRole("tab", { name: "Einträge" })).toHaveFocus();
  });

  it("beginnt einen leeren Plan leer mit einer Ebene", () => {
    const onChange = jest.fn();
    render(<Harness initial={{ plan: emptyPlan(), dropped: 0 }} onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Leer beginnen" }));
    expect(lastPlan(onChange).lanes).toEqual([{ id: expect.any(String), title: "Ebene 1" }]);
    expect(screen.getByRole("button", { name: "Meilenstein hinzufügen" })).toBeEnabled();
  });

  it("zeigt auch einen Plan nur mit Stichtagen, ohne Leerzustand", () => {
    const plan: Plan = { ...emptyPlan(), items: [{ id: "d1", kind: "deadline", title: "Euro 7", date: "2027-07-01" }] };
    render(<Harness initial={{ plan, dropped: 0 }} />);
    expect(screen.queryByRole("button", { name: "Leer beginnen" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Meilenstein hinzufügen" })).toBeDisabled();
  });

  it("übernimmt und vergisst dabei die verworfenen Einträge — sie sind dann gespeichert weg", () => {
    const onChange = jest.fn();
    const onSave = jest.fn();
    render(<Harness initial={{ plan: testPlan(), dropped: 2 }} onChange={onChange} onSave={onSave} />);
    fireEvent.click(screen.getByRole("button", { name: "Übernehmen" }));
    expect(onChange).toHaveBeenLastCalledWith({ plan: testPlan(), dropped: 0 });
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(screen.queryByText(/nicht gelesen werden/)).not.toBeInTheDocument();
  });

  it("bricht ab", () => {
    const onClose = jest.fn();
    render(<Harness onClose={onClose} />);
    fireEvent.click(screen.getByRole("button", { name: "Abbrechen" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("legt das Stylesheet als Stil an, nicht als Text ins Fenster", () => {
    const { container } = render(<Harness />);
    const sheets = [...container.querySelectorAll("style")].map((style) => style.textContent ?? "");
    expect(sheets.some((css) => css.includes(".man-pt-editor__footer"))).toBe(true);
    expect(sheets.some((css) => css.includes(".man-pt-editor__input"))).toBe(true);
    expect(screen.queryByText(/man-pt-editor__/)).not.toBeInTheDocument();
  });

  it("wechselt die Art im Formular und zeigt die passenden Felder", () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole("button", { name: /^Bauma/ }));
    fireEvent.change(screen.getByLabelText("Art"), { target: { value: "deadline" } });
    const form = screen.getByRole("region", { name: "Eintrag „Bauma“" });
    expect(within(form).queryByLabelText("Ebene")).not.toBeInTheDocument();
    expect(within(form).getByLabelText("Datum")).toHaveValue("2025-04-07");
  });
});
