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

import { Plan } from "../plan-model";
import { FormHarness as Harness, lastPlan, openTab } from "./item-form.fixture";
import { findItem, testPlan } from "./test-plan.fixture";

describe("ItemForm: Felder", () => {
  it("zeigt für einen Meilenstein Datum, Serie und Vorgänger — die Form nicht", () => {
    render(<Harness id="m1" />);
    expect(screen.getByLabelText("Art")).toHaveValue("milestone");
    expect(screen.getByLabelText("Titel")).toHaveValue("Bauma");
    openTab("Einordnung");
    expect(screen.getByLabelText("Ebene")).toHaveValue("l1");
    expect(screen.getByLabelText("Kategorie")).toHaveValue("c1");
    expect(screen.getByRole("combobox", { name: "Serie" })).toHaveValue(
      "Messen 2025",
    );
    openTab("Termin");
    expect(screen.getByLabelText("Datum")).toHaveValue("2025-04-07");
    // Die Form gehört der Kategorie; am Meilenstein gibt es kein Feld dafür.
    expect(screen.queryByLabelText("Symbol")).not.toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", { name: "Vorläufig" }),
    ).not.toBeChecked();
    openTab("Abhängigkeiten");
    expect(
      screen.getByRole("group", { name: "Hängt ab von" }),
    ).toBeInTheDocument();
  });

  it("zeigt für einen Zeitraum Beginn, Ende und den Pfeil", () => {
    render(<Harness id="b1" tab="term" />);
    expect(screen.getByLabelText("Beginn")).toHaveValue("2028-01-01");
    expect(screen.getByLabelText("Ende")).toHaveValue("2030-06-30");
    expect(
      screen.getByRole("checkbox", { name: "Pfeil am Ende" }),
    ).toBeChecked();
    expect(screen.queryByLabelText("Symbol")).not.toBeInTheDocument();
  });

  it("zeigt für einen Stichtag weder Ebene noch Serie noch den Reiter „Abhängigkeiten“", () => {
    render(<Harness id="d1" />);
    expect(
      screen.queryByRole("tab", { name: /Abhängigkeiten/ }),
    ).not.toBeInTheDocument();
    openTab("Einordnung");
    expect(screen.queryByLabelText("Ebene")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("combobox", { name: "Serie" }),
    ).not.toBeInTheDocument();
    openTab("Termin");
    expect(screen.getByLabelText("Datum")).toHaveValue("2027-07-01");
  });

  it("übernimmt einen neuen Titel und setzt das Stand-Datum", () => {
    const onPlanChange = jest.fn();
    render(<Harness id="m1" onPlanChange={onPlanChange} />);
    fireEvent.change(screen.getByLabelText("Titel"), {
      target: { value: "Bauma 2025" },
    });
    expect(findItem(lastPlan(onPlanChange), "m1").title).toBe("Bauma 2025");
    expect(lastPlan(onPlanChange).updatedAt).not.toBe("2024-11-27");
  });

  it("hält einen leeren Titel als Entwurf mit Fehler am Feld", () => {
    const onPlanChange = jest.fn();
    render(<Harness id="m1" onPlanChange={onPlanChange} />);
    const title = screen.getByLabelText("Titel");
    fireEvent.change(title, { target: { value: "" } });
    expect(onPlanChange).not.toHaveBeenCalled();
    expect(title).toHaveAttribute("aria-invalid", "true");
    expect(title).toHaveAccessibleDescription("Bitte einen Titel angeben.");
  });

  it("hält ein leeres Datum als Entwurf mit Fehler am Feld", () => {
    const onPlanChange = jest.fn();
    render(<Harness id="m1" tab="term" onPlanChange={onPlanChange} />);
    const date = screen.getByLabelText("Datum");
    fireEvent.change(date, { target: { value: "" } });
    expect(onPlanChange).not.toHaveBeenCalled();
    expect(date).toHaveAccessibleDescription("Bitte ein Datum angeben.");
  });

  it("lässt das Ende nicht vor den Beginn", () => {
    const onPlanChange = jest.fn();
    render(<Harness id="b1" tab="term" onPlanChange={onPlanChange} />);
    const end = screen.getByLabelText("Ende");
    fireEvent.change(end, { target: { value: "2027-12-31" } });
    expect(onPlanChange).not.toHaveBeenCalled();
    expect(end).toHaveAccessibleDescription("Das Ende liegt vor dem Beginn.");

    const start = screen.getByLabelText("Beginn");
    fireEvent.change(start, { target: { value: "2031-01-01" } });
    expect(onPlanChange).not.toHaveBeenCalled();
    expect(start).toHaveAccessibleDescription(
      "Der Beginn liegt nach dem Ende.",
    );
  });

  it("übernimmt einen gültigen Zeitraum", () => {
    const onPlanChange = jest.fn();
    render(<Harness id="b1" tab="term" onPlanChange={onPlanChange} />);
    fireEvent.change(screen.getByLabelText("Ende"), {
      target: { value: "2029-12-31" },
    });
    expect(findItem(lastPlan(onPlanChange), "b1")).toMatchObject({
      start: "2028-01-01",
      end: "2029-12-31",
    });
  });

  it("wechselt die Art: aus dem Meilenstein wird ein Zeitraum", () => {
    const onPlanChange = jest.fn();
    render(<Harness id="m1" onPlanChange={onPlanChange} />);
    fireEvent.change(screen.getByLabelText("Art"), {
      target: { value: "bar" },
    });
    expect(findItem(lastPlan(onPlanChange), "m1")).toMatchObject({
      kind: "bar",
      start: "2025-04-07",
      end: "2025-05-06",
    });
    openTab("Termin");
    expect(screen.getByLabelText("Beginn")).toHaveValue("2025-04-07");
  });

  it("sperrt Meilenstein und Zeitraum für einen Stichtag, solange es keine Ebene gibt", () => {
    const plan: Plan = {
      ...testPlan(),
      lanes: [],
      items: [findItem(testPlan(), "d1")],
    };
    render(<Harness id="d1" initial={plan} />);
    const kind = screen.getByLabelText("Art");
    expect(
      within(kind).getByRole("option", { name: "Meilenstein" }),
    ).toBeDisabled();
    expect(
      within(kind).getByRole("option", { name: "Zeitraum" }),
    ).toBeDisabled();
  });

  it("setzt Ebene und Kategorie, auch „Ohne Kategorie“", () => {
    const onPlanChange = jest.fn();
    render(<Harness id="m1" tab="placement" onPlanChange={onPlanChange} />);
    fireEvent.change(screen.getByLabelText("Ebene"), {
      target: { value: "l2" },
    });
    expect(findItem(lastPlan(onPlanChange), "m1")).toMatchObject({
      lane: "l2",
    });
    fireEvent.change(screen.getByLabelText("Kategorie"), {
      target: { value: "" },
    });
    expect(findItem(lastPlan(onPlanChange), "m1")).not.toHaveProperty(
      "category",
    );
  });

  it("sagt unter „Kategorie“, woher Form und Farbe kommen", () => {
    const { container } = render(<Harness id="m1" tab="placement" />);
    expect(
      screen.getByText("Form und Farbe kommen von der Kategorie."),
    ).toBeInTheDocument();
    // Die Form der Kategorie „General“, in ihrer Farbe.
    const glyph = container.querySelector(".man-pt-editor__look svg");
    expect(glyph).toHaveAttribute("data-symbol", "square");
    expect(glyph?.querySelector("path")).toHaveAttribute("fill", "#E40045");
    fireEvent.change(screen.getByLabelText("Kategorie"), {
      target: { value: "" },
    });
    expect(
      screen.getByText("Ohne Kategorie: graue Raute."),
    ).toBeInTheDocument();
  });

  it("setzt „Vorläufig“", () => {
    const onPlanChange = jest.fn();
    render(<Harness id="m1" tab="term" onPlanChange={onPlanChange} />);
    fireEvent.click(screen.getByRole("checkbox", { name: "Vorläufig" }));
    expect(findItem(lastPlan(onPlanChange), "m1")).toMatchObject({
      tentative: true,
    });
    fireEvent.click(screen.getByRole("checkbox", { name: "Vorläufig" }));
    expect(findItem(lastPlan(onPlanChange), "m1")).not.toHaveProperty(
      "tentative",
    );
  });

  it("nimmt dem Zeitraum den Pfeil", () => {
    const onPlanChange = jest.fn();
    render(<Harness id="b1" tab="term" onPlanChange={onPlanChange} />);
    fireEvent.click(screen.getByRole("checkbox", { name: "Pfeil am Ende" }));
    expect(findItem(lastPlan(onPlanChange), "b1")).not.toHaveProperty("arrow");
  });

  it("lässt eine leere Beschreibung ganz weg", () => {
    const onPlanChange = jest.fn();
    render(<Harness id="m1" onPlanChange={onPlanChange} />);
    const description = screen.getByLabelText("Beschreibung");
    fireEvent.change(description, { target: { value: "Neu" } });
    expect(findItem(lastPlan(onPlanChange), "m1")).toMatchObject({
      description: "Neu",
    });
    fireEvent.change(description, { target: { value: " " } });
    expect(findItem(lastPlan(onPlanChange), "m1")).not.toHaveProperty(
      "description",
    );
  });

  it("dupliziert direkt und löscht erst nach der Rückfrage", () => {
    const onDuplicate = jest.fn();
    const onRemove = jest.fn();
    render(<Harness id="m1" onDuplicate={onDuplicate} onRemove={onRemove} />);
    fireEvent.click(screen.getByRole("button", { name: "Duplizieren" }));
    expect(onDuplicate).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole("button", { name: "Löschen" }));
    expect(onRemove).not.toHaveBeenCalled();
    const dialog = screen.getByRole("dialog", { name: "„Bauma“ löschen?" });
    fireEvent.click(within(dialog).getByRole("button", { name: "Löschen" }));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });
});
