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

import { todayIso } from "../plan-model";
import { Harness, lastPlan } from "./plan-editor.fixture";
import { mockTimelineProps } from "./project-timeline.mock";
import { testPlan } from "./test-plan.fixture";

jest.mock("../project-timeline", () => jest.requireActual("./project-timeline.mock"));

beforeEach(() => {
  mockTimelineProps.current = null;
});

const panel = (): HTMLElement => screen.getByRole("complementary", { name: "Plan" });

describe("PlanEditor: Einstellungen des Plans", () => {
  it("setzt die Überschrift und entfernt sie, wenn sie leer wird", () => {
    const onChange = jest.fn();
    render(<Harness onChange={onChange} />);
    const title = within(panel()).getByLabelText("Titel des Plans");
    fireEvent.change(title, { target: { value: "Sales Truck Launch" } });
    expect(lastPlan(onChange).title).toBe("Sales Truck Launch");
    fireEvent.change(title, { target: { value: " " } });
    expect(lastPlan(onChange)).not.toHaveProperty("title");
  });

  it("zeigt die Überschrift auch im Leerzustand", () => {
    render(<Harness initial={{ plan: { version: 1, title: "Launch", lanes: [], categories: [], items: [] }, dropped: 0 }} />);
    expect(within(panel()).getByLabelText("Titel des Plans")).toHaveValue("Launch");
  });

  it("setzt den gemeldeten Ausschnitt als Startansicht", () => {
    const onChange = jest.fn();
    const { rerender } = render(<Harness view="desktop" onChange={onChange} />);
    const setView = within(panel()).getByRole("button", { name: "Diesen Ausschnitt übernehmen" });
    expect(setView).toBeDisabled();
    expect(within(panel()).queryByRole("button", { name: "Startansicht entfernen" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Vorschau: Ausschnitt 2025" }));
    rerender(<Harness view="desktop" onChange={onChange} />);
    fireEvent.click(within(panel()).getByRole("button", { name: "Diesen Ausschnitt übernehmen" }));
    expect(lastPlan(onChange).view).toEqual({ start: "2025-01", end: "2025-12" });
    expect(screen.getByText("Startansicht: Januar 2025 bis Dezember 2025")).toBeInTheDocument();
  });

  it("entfernt die Startansicht", () => {
    const onChange = jest.fn();
    const plan = { ...testPlan(), view: { start: "2025-01", end: "2031-12" } };
    render(<Harness initial={{ plan, dropped: 0 }} onChange={onChange} />);
    fireEvent.click(within(panel()).getByRole("button", { name: "Startansicht entfernen" }));
    expect(lastPlan(onChange)).not.toHaveProperty("view");
    expect(within(panel()).queryByRole("button", { name: "Startansicht entfernen" })).not.toBeInTheDocument();
  });
});

describe("PlanEditor: Heute-Linie und Export", () => {
  const today = (): HTMLElement => within(panel()).getByRole("switch", { name: "Heute-Linie zeigen" });
  const exporting = (): HTMLElement => within(panel()).getByRole("switch", { name: "Excel-Export anbieten" });

  it("zeigt ohne Wert im Plan und ohne lesbares altes Feld beide an und sagt, dass noch nichts festgelegt ist", () => {
    render(<Harness />);
    expect(today()).toBeChecked();
    expect(exporting()).toBeChecked();
    expect(today()).toHaveAccessibleDescription(/Noch nicht im Editor festgelegt/);
  });

  it("zeigt, was die alten Felder des Dialogs trugen, und schreibt es nicht von selbst in den Plan", () => {
    const onChange = jest.fn();
    render(<Harness initial={{ plan: testPlan(), dropped: 0, legacy: { showToday: false } }} onChange={onChange} />);
    expect(today()).not.toBeChecked();
    expect(exporting()).toBeChecked();
    expect(onChange).not.toHaveBeenCalled();
    // Lesbar war das alte Feld: nichts ist offen.
    expect(today()).not.toHaveAccessibleDescription(/Noch nicht im Editor festgelegt/);
  });

  it("schreibt erst beim Umlegen den Wert in den Plan — ohne den Stand zu verschieben", () => {
    const onChange = jest.fn();
    render(<Harness onChange={onChange} />);
    fireEvent.click(today());
    expect(lastPlan(onChange).showToday).toBe(false);
    expect(lastPlan(onChange)).not.toHaveProperty("allowExport");
    expect(lastPlan(onChange).updatedAt).toBe("2024-11-27");
    expect(today()).not.toBeChecked();
    expect(today()).not.toHaveAccessibleDescription(/Noch nicht im Editor festgelegt/);
  });

  it("gibt den Schalter an die Vorschau weiter", () => {
    const { rerender } = render(<Harness view="desktop" />);
    expect(mockTimelineProps.current?.showToday).toBe(true);
    fireEvent.click(today());
    rerender(<Harness view="desktop" />);
    expect(mockTimelineProps.current?.showToday).toBe(false);
    expect(mockTimelineProps.current?.allowExport).toBe(false);
    expect(todayIso()).toEqual(expect.any(String));
  });
});

describe("PlanEditor: Ebenen und Kategorien", () => {
  it("zeigt Ebenen und Kategorien in ihren Reitern des Panels", () => {
    render(<Harness />);
    fireEvent.click(within(panel()).getByRole("tab", { name: /^Ebenen/ }));
    expect(screen.getByLabelText("Name der Ebene 1")).toHaveValue("Messen");
    fireEvent.click(within(panel()).getByRole("tab", { name: /^Kategorien/ }));
    expect(screen.getByLabelText("Name der Kategorie 1")).toHaveValue("General");
  });
});
