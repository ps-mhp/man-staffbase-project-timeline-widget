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

import { LaneItem } from "../plan-model";
import { DependencyField } from "./dependency-field";
import { findItem, testPlan } from "./test-plan.fixture";

const plan = testPlan();

const renderField = (id: string, onChange = jest.fn()) =>
  render(
    <DependencyField
      plan={plan}
      item={findItem(plan, id) as LaneItem}
      locale="de-DE"
      onChange={onChange}
    />,
  );

describe("DependencyField", () => {
  it("bietet die anderen Meilensteine und Zeiträume an, keine Stichtage", () => {
    renderField("b1");
    const group = screen.getByRole("group", { name: "Hängt ab von" });
    const boxes = within(group).getAllByRole("checkbox");
    expect(boxes.map((box) => box.closest("label")?.textContent)).toEqual([
      "Bauma07.04.2025",
      "SOP15.01.2026",
    ]);
    expect(
      within(group).getByRole("checkbox", { name: /Bauma/ }),
    ).toBeChecked();
  });

  it("fügt einen Vorgänger hinzu und nimmt einen weg", () => {
    const onChange = jest.fn();
    renderField("b1", onChange);
    fireEvent.click(screen.getByRole("checkbox", { name: /SOP/ }));
    expect(onChange).toHaveBeenLastCalledWith(["m1", "m2"]);
    fireEvent.click(screen.getByRole("checkbox", { name: /Bauma/ }));
    expect(onChange).toHaveBeenLastCalledWith([]);
  });

  it("filtert die Auswahl über die Suche", () => {
    renderField("b1");
    fireEvent.change(screen.getByLabelText("Vorgänger suchen"), {
      target: { value: "sop" },
    });
    expect(
      screen.queryByRole("checkbox", { name: /Bauma/ }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: /SOP/ })).toBeInTheDocument();
  });

  it("sagt, wenn die Suche nichts findet, und zählt die gewählten", () => {
    renderField("b1");
    expect(screen.getByText("1 gewählt")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Vorgänger suchen"), {
      target: { value: "gibt es nicht" },
    });
    expect(
      screen.getByText("Kein Eintrag passt zur Suche."),
    ).toBeInTheDocument();
  });

  it("sagt, wenn es noch keinen möglichen Vorgänger gibt", () => {
    const lonely = {
      ...plan,
      items: [findItem(plan, "m1"), findItem(plan, "d1")],
    };
    render(
      <DependencyField
        plan={lonely}
        item={findItem(lonely, "m1") as LaneItem}
        locale="de-DE"
        onChange={jest.fn()}
      />,
    );
    expect(
      screen.getByText(/noch keine anderen Meilensteine oder Zeiträume/),
    ).toBeInTheDocument();
    expect(screen.queryByLabelText("Vorgänger suchen")).not.toBeInTheDocument();
  });
});
