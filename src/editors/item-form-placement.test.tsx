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
import { FormHarness as Harness, lastPlan } from "./item-form.fixture";
import { findItem, testPlan } from "./test-plan.fixture";

const openCreate = (field: string, option: string): HTMLElement => {
  const select = screen.getByLabelText(field);
  select.focus();
  fireEvent.change(select, { target: { value: "__create__" } });
  expect(
    within(select).getByRole("option", { name: option }),
  ).toBeInTheDocument();
  return select;
};

describe("ItemForm: Einordnung — neue Ebene oder Kategorie", () => {
  it("legt eine Ebene aus dem Auswahlfeld an und weist sie dem Eintrag zu", () => {
    const onPlanChange = jest.fn();
    render(<Harness id="m1" tab="placement" onPlanChange={onPlanChange} />);
    const select = openCreate("Ebene", "Neue Ebene …");
    const dialog = screen.getByRole("dialog", { name: "Neue Ebene" });
    const name = within(dialog).getByLabelText("Name");
    expect(name).toHaveFocus();
    fireEvent.change(name, { target: { value: " Montage " } });
    fireEvent.keyDown(name, { key: "Enter" });

    const plan = lastPlan(onPlanChange);
    const lane = plan.lanes[plan.lanes.length - 1];
    expect(lane.title).toBe("Montage");
    expect(findItem(plan, "m1")).toMatchObject({ lane: lane.id });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(select).toHaveValue(lane.id);
    expect(select).toHaveFocus();
  });

  it("verlangt einen neuen, eindeutigen Namen", () => {
    const onPlanChange = jest.fn();
    render(<Harness id="m1" tab="placement" onPlanChange={onPlanChange} />);
    openCreate("Ebene", "Neue Ebene …");
    const dialog = screen.getByRole("dialog", { name: "Neue Ebene" });
    fireEvent.click(within(dialog).getByRole("button", { name: "Anlegen" }));
    const name = within(dialog).getByLabelText("Name");
    expect(name).toHaveAccessibleDescription("Bitte einen Namen angeben.");
    fireEvent.change(name, { target: { value: " MESSEN" } });
    expect(name).toHaveAttribute("aria-invalid", "true");
    expect(name).toHaveAccessibleDescription(
      "Eine Ebene „MESSEN“ gibt es schon.",
    );
    fireEvent.click(within(dialog).getByRole("button", { name: "Anlegen" }));
    expect(onPlanChange).not.toHaveBeenCalled();
  });

  it("behält beim Abbrechen den bisherigen Wert", () => {
    const onPlanChange = jest.fn();
    render(<Harness id="m1" tab="placement" onPlanChange={onPlanChange} />);
    const select = openCreate("Ebene", "Neue Ebene …");
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(select).toHaveValue("l1");
    expect(select).toHaveFocus();
    expect(onPlanChange).not.toHaveBeenCalled();
  });

  it("legt eine Kategorie mit Farbe an, vorgeschlagen die erste freie", () => {
    const onPlanChange = jest.fn();
    render(<Harness id="m2" tab="placement" onPlanChange={onPlanChange} />);
    openCreate("Kategorie", "Neue Kategorie …");
    const dialog = screen.getByRole("dialog", { name: "Neue Kategorie" });
    expect(
      within(dialog).getByRole("radio", { name: "#303C49" }),
    ).toBeChecked();
    // Die erste Form, die noch keine Kategorie trägt: „General“ hat das Quadrat.
    const shapes = within(dialog).getByRole("radiogroup", { name: "Form" });
    expect(
      within(shapes).getByRole("radio", { name: "Raute" }),
    ).toHaveAttribute("aria-checked", "true");
    fireEvent.click(within(shapes).getByRole("radio", { name: "Stern" }));
    fireEvent.click(within(dialog).getByRole("radio", { name: "#4B96D2" }));
    fireEvent.change(within(dialog).getByLabelText("Name"), {
      target: { value: "eTruck" },
    });
    fireEvent.click(within(dialog).getByRole("button", { name: "Anlegen" }));

    const plan = lastPlan(onPlanChange);
    const category = plan.categories[plan.categories.length - 1];
    expect(category).toMatchObject({
      title: "eTruck",
      color: "#4B96D2",
      symbol: "star",
    });
    expect(findItem(plan, "m2")).toMatchObject({ category: category.id });
  });

  it("sperrt „Neue …“ an der Obergrenze", () => {
    const plan: Plan = {
      ...testPlan(),
      lanes: [
        ...testPlan().lanes,
        ...Array.from({ length: LIMITS.lanes - 2 }, (_, index) => ({
          id: `x${index}`,
          title: `Ebene ${index}`,
        })),
      ],
    };
    render(<Harness id="m1" tab="placement" initial={plan} />);
    expect(
      within(screen.getByLabelText("Ebene")).getByRole("option", {
        name: "Neue Ebene … (Obergrenze erreicht)",
      }),
    ).toBeDisabled();
  });
});

describe("ItemForm: Serie", () => {
  it("wählt eine Serie derselben Ebene aus den Vorschlägen", () => {
    const onPlanChange = jest.fn();
    render(<Harness id="m2" tab="placement" onPlanChange={onPlanChange} />);
    const input = screen.getByRole("combobox", { name: "Serie" });
    fireEvent.focus(input);
    const listbox = screen.getByRole("listbox", { name: "Serie" });
    expect(
      within(listbox)
        .getAllByRole("option")
        .map((option) => option.textContent),
    ).toEqual(["Keine Serie", "TG Assist · 1 Eintrag", "TMS · 1 Eintrag"]);
    fireEvent.click(
      within(listbox).getByRole("option", { name: "TMS · 1 Eintrag" }),
    );
    expect(findItem(lastPlan(onPlanChange), "m2")).toMatchObject({
      series: "TMS",
    });
  });

  it("entfernt die Serie über „Keine Serie“", () => {
    const onPlanChange = jest.fn();
    render(<Harness id="m2" tab="placement" onPlanChange={onPlanChange} />);
    fireEvent.focus(screen.getByRole("combobox", { name: "Serie" }));
    fireEvent.click(screen.getByRole("option", { name: "Keine Serie" }));
    expect(findItem(lastPlan(onPlanChange), "m2")).not.toHaveProperty("series");
  });
});
