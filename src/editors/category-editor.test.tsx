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

import { LIMITS, Plan } from "../plan-model";
import { CategoryEditor } from "./category-editor";
import { findItem, testPlan } from "./test-plan.fixture";

function Harness({
  initial = testPlan(),
  spy = jest.fn(),
}: {
  initial?: Plan;
  spy?: jest.Mock;
}): React.ReactElement {
  const [plan, setPlan] = useState(initial);
  return (
    <CategoryEditor
      plan={plan}
      onPlanChange={(next) => {
        spy(next);
        setPlan(next);
      }}
    />
  );
}

const lastPlan = (spy: jest.Mock): Plan =>
  spy.mock.calls[spy.mock.calls.length - 1][0];

describe("CategoryEditor", () => {
  it("listet die Kategorien einzeilig mit Farbknopf, Name und Zahl", () => {
    render(<Harness />);
    expect(screen.getByLabelText("Name der Kategorie 1")).toHaveValue(
      "General",
    );
    expect(
      screen.getByRole("button", { name: "Farbe von „TMS“: #91B900" }),
    ).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByText("2 Einträge")).toBeInTheDocument();
  });

  it("benennt um und färbt um", () => {
    const spy = jest.fn();
    render(<Harness spy={spy} />);
    fireEvent.change(screen.getByLabelText("Name der Kategorie 2"), {
      target: { value: "TMS neu" },
    });
    expect(lastPlan(spy).categories[1].title).toBe("TMS neu");
    fireEvent.click(
      screen.getByRole("button", { name: "Farbe von „TMS neu“: #91B900" }),
    );
    const colors = screen.getByRole("group", { name: "Farbe von „TMS neu“" });
    fireEvent.click(within(colors).getByRole("radio", { name: "#00786E" }));
    expect(lastPlan(spy).categories[1]).toEqual({
      id: "c2",
      title: "TMS neu",
      color: "#00786E",
    });
    expect(
      screen.getByRole("button", { name: "Farbe von „TMS neu“: #00786E" }),
    ).toBeInTheDocument();
  });

  it("setzt die Form der Meilensteine über den Formknopf der Zeile", () => {
    const spy = jest.fn();
    render(<Harness spy={spy} />);
    fireEvent.click(
      screen.getByRole("button", { name: "Form von „General“: Quadrat" }),
    );
    fireEvent.click(screen.getByRole("radio", { name: "Sechseck" }));
    expect(lastPlan(spy).categories[0]).toMatchObject({
      id: "c1",
      symbol: "hexagon",
    });
    expect(
      screen.getByRole("button", { name: "Form von „General“: Sechseck" }),
    ).toBeInTheDocument();
  });

  it("hält einen leeren Namen als Entwurf mit Fehler", () => {
    const spy = jest.fn();
    render(<Harness spy={spy} />);
    const name = screen.getByLabelText("Name der Kategorie 1");
    fireEvent.change(name, { target: { value: " " } });
    expect(spy).not.toHaveBeenCalled();
    expect(name).toHaveAccessibleDescription("Bitte einen Namen angeben.");
  });

  it("weist beim Umbenennen einen Namen zurück, den es schon gibt", () => {
    const spy = jest.fn();
    render(<Harness spy={spy} />);
    const name = screen.getByLabelText("Name der Kategorie 2");
    fireEvent.change(name, { target: { value: "general" } });
    expect(spy).not.toHaveBeenCalled();
    expect(name).toHaveAccessibleDescription(
      "Eine Kategorie „general“ gibt es schon.",
    );
  });

  it("legt eine Kategorie an und setzt den Fokus in ihren Namen", () => {
    const spy = jest.fn();
    render(<Harness spy={spy} />);
    fireEvent.click(screen.getByRole("button", { name: "Neue Kategorie" }));
    expect(lastPlan(spy).categories[2]).toMatchObject({
      title: "Neue Kategorie",
    });
    expect(screen.getByLabelText("Name der Kategorie 3")).toHaveFocus();
  });

  it("legt über die Obergrenze hinaus keine Kategorie an", () => {
    const plan: Plan = {
      ...testPlan(),
      categories: Array.from({ length: LIMITS.categories }, (_, index) => ({
        id: `x${index}`,
        title: `Kategorie ${index}`,
        color: "#E40045",
      })),
    };
    render(<Harness initial={plan} />);
    expect(
      screen.getByRole("button", { name: "Neue Kategorie" }),
    ).toBeDisabled();
    expect(
      screen.getByText(
        `Mehr als ${LIMITS.categories} Kategorien trägt ein Plan nicht.`,
      ),
    ).toBeInTheDocument();
  });

  it("verschiebt eine Kategorie — so steht sie in der Legende", () => {
    const spy = jest.fn();
    render(<Harness spy={spy} />);
    expect(
      screen.getByRole("button", { name: "Kategorie „TMS“ nach unten" }),
    ).toBeDisabled();
    fireEvent.click(
      screen.getByRole("button", { name: "Kategorie „TMS“ nach oben" }),
    );
    expect(lastPlan(spy).categories.map((category) => category.id)).toEqual([
      "c2",
      "c1",
    ]);
  });

  it("nennt beim Löschen die Zahl der betroffenen Einträge", () => {
    const spy = jest.fn();
    render(<Harness spy={spy} />);
    fireEvent.click(
      screen.getByRole("button", { name: "Kategorie „General“ löschen" }),
    );
    const dialog = screen.getByRole("dialog", {
      name: "Kategorie „General“ löschen?",
    });
    expect(dialog).toHaveAccessibleDescription(
      "2 Einträge stehen danach ohne Kategorie da.",
    );
    fireEvent.click(within(dialog).getByRole("button", { name: "Löschen" }));

    const next = lastPlan(spy);
    expect(next.categories.map((category) => category.id)).toEqual(["c2"]);
    expect(findItem(next, "m1")).not.toHaveProperty("category");
    expect(findItem(next, "d1")).not.toHaveProperty("category");
  });

  it("sagt beim Löschen einer ungenutzten Kategorie, dass kein Eintrag betroffen ist", () => {
    const plan: Plan = { ...testPlan(), items: [] };
    render(<Harness initial={plan} />);
    fireEvent.click(
      screen.getByRole("button", { name: "Kategorie „TMS“ löschen" }),
    );
    expect(screen.getByRole("dialog")).toHaveAccessibleDescription(
      "Kein Eintrag gehört zu dieser Kategorie.",
    );
  });

  it("sagt, wenn es noch keine Kategorie gibt", () => {
    render(<Harness initial={{ ...testPlan(), categories: [] }} />);
    expect(screen.getByText(/Noch keine Kategorien/)).toBeInTheDocument();
  });
});
