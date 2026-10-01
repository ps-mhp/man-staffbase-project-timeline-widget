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
import { LaneEditor } from "./lane-editor";
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
    <LaneEditor
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

describe("LaneEditor", () => {
  it("listet die Ebenen mit Namen und Zahl der Einträge", () => {
    render(<Harness />);
    expect(screen.getByLabelText("Name der Ebene 1")).toHaveValue("Messen");
    expect(screen.getByLabelText("Name der Ebene 2")).toHaveValue("SOPs");
    expect(screen.getByText("2 Einträge")).toBeInTheDocument();
    expect(screen.getByText("1 Eintrag")).toBeInTheDocument();
  });

  it("benennt eine Ebene um, aber nicht in einen leeren Namen", () => {
    const spy = jest.fn();
    render(<Harness spy={spy} />);
    const name = screen.getByLabelText("Name der Ebene 1");
    fireEvent.change(name, { target: { value: "Ausstellungen" } });
    expect(lastPlan(spy).lanes[0].title).toBe("Ausstellungen");
    fireEvent.change(name, { target: { value: "" } });
    expect(spy).toHaveBeenCalledTimes(1);
    expect(name).toHaveAccessibleDescription("Bitte einen Namen angeben.");
  });

  it("weist beim Umbenennen einen Namen zurück, den es schon gibt", () => {
    const spy = jest.fn();
    render(<Harness spy={spy} />);
    const name = screen.getByLabelText("Name der Ebene 1");
    fireEvent.change(name, { target: { value: " sops " } });
    expect(spy).not.toHaveBeenCalled();
    expect(name).toHaveAccessibleDescription(
      "Eine Ebene „sops“ gibt es schon.",
    );
    // Der eigene Name, anders geschrieben, ist kein Doppel.
    fireEvent.change(name, { target: { value: "MESSEN" } });
    expect(lastPlan(spy).lanes[0].title).toBe("MESSEN");
  });

  it("legt eine neue Ebene an und setzt den Fokus in ihren Namen", () => {
    const spy = jest.fn();
    render(<Harness spy={spy} />);
    fireEvent.click(screen.getByRole("button", { name: "Neue Ebene" }));
    expect(lastPlan(spy).lanes[2].title).toBe("Neue Ebene");
    expect(screen.getByLabelText("Name der Ebene 3")).toHaveFocus();
  });

  it("legt über die Obergrenze hinaus keine Ebene an", () => {
    const plan: Plan = {
      ...testPlan(),
      lanes: Array.from({ length: LIMITS.lanes }, (_, index) => ({
        id: `x${index}`,
        title: `Ebene ${index}`,
      })),
      items: [],
    };
    render(<Harness initial={plan} />);
    expect(screen.getByRole("button", { name: "Neue Ebene" })).toBeDisabled();
    expect(
      screen.getByText(`Mehr als ${LIMITS.lanes} Ebenen trägt ein Plan nicht.`),
    ).toBeInTheDocument();
  });

  it("verschiebt eine Ebene", () => {
    const spy = jest.fn();
    render(<Harness spy={spy} />);
    expect(
      screen.getByRole("button", { name: "Ebene „Messen“ nach oben" }),
    ).toBeDisabled();
    fireEvent.click(
      screen.getByRole("button", { name: "Ebene „Messen“ nach unten" }),
    );
    expect(lastPlan(spy).lanes.map((lane) => lane.id)).toEqual(["l2", "l1"]);
  });

  it("fragt beim Löschen einer leeren Ebene nur nach", () => {
    const spy = jest.fn();
    const plan: Plan = {
      ...testPlan(),
      lanes: [...testPlan().lanes, { id: "l3", title: "Leer" }],
    };
    render(<Harness initial={plan} spy={spy} />);
    fireEvent.click(
      screen.getByRole("button", { name: "Ebene „Leer“ löschen" }),
    );
    const dialog = screen.getByRole("dialog", {
      name: "Ebene „Leer“ löschen?",
    });
    expect(dialog).toHaveAccessibleDescription(
      "Die Ebene enthält keine Einträge.",
    );
    expect(within(dialog).queryByRole("radio")).not.toBeInTheDocument();
    fireEvent.click(within(dialog).getByRole("button", { name: "Löschen" }));
    expect(lastPlan(spy).lanes.map((lane) => lane.id)).toEqual(["l1", "l2"]);
  });

  it("verschiebt die Einträge einer belegten Ebene in die gewählte", () => {
    const spy = jest.fn();
    render(<Harness spy={spy} />);
    fireEvent.click(
      screen.getByRole("button", { name: "Ebene „SOPs“ löschen" }),
    );
    const dialog = screen.getByRole("dialog", {
      name: "Ebene „SOPs“ löschen?",
    });
    expect(dialog).toHaveAccessibleDescription("Die Ebene enthält 2 Einträge.");
    const move = within(dialog).getByRole("radio", {
      name: "2 Einträge verschieben nach",
    });
    expect(move).toBeChecked();
    expect(move).toHaveFocus();
    expect(within(dialog).getByLabelText("Ziel-Ebene")).toHaveValue("l1");
    fireEvent.click(within(dialog).getByRole("button", { name: "Löschen" }));

    const next = lastPlan(spy);
    expect(next.lanes.map((lane) => lane.id)).toEqual(["l1"]);
    expect(findItem(next, "b1")).toMatchObject({ lane: "l1" });
    expect(findItem(next, "m2")).toMatchObject({ lane: "l1" });
  });

  it("löscht auf Wunsch die Einträge mit", () => {
    const spy = jest.fn();
    render(<Harness spy={spy} />);
    fireEvent.click(
      screen.getByRole("button", { name: "Ebene „Messen“ löschen" }),
    );
    const dialog = screen.getByRole("dialog");
    fireEvent.click(
      within(dialog).getByRole("radio", { name: "Mit Einträgen löschen" }),
    );
    fireEvent.click(within(dialog).getByRole("button", { name: "Löschen" }));

    const next = lastPlan(spy);
    expect(next.items.map((item) => item.id)).toEqual(["b1", "d1", "m2"]);
    expect(findItem(next, "b1")).not.toHaveProperty("dependsOn");
  });

  it("bietet ohne andere Ebene nur das Mitlöschen an", () => {
    const plan: Plan = {
      ...testPlan(),
      lanes: [testPlan().lanes[0]],
      items: [findItem(testPlan(), "m1")],
    };
    render(<Harness initial={plan} />);
    fireEvent.click(
      screen.getByRole("button", { name: "Ebene „Messen“ löschen" }),
    );
    const dialog = screen.getByRole("dialog");
    expect(
      within(dialog).queryByRole("radio", { name: /verschieben/ }),
    ).not.toBeInTheDocument();
    expect(
      within(dialog).getByRole("radio", { name: "Mit Einträgen löschen" }),
    ).toBeChecked();
  });

  it("lässt beim Abbrechen alles, wie es war, und gibt den Fokus zurück", () => {
    const spy = jest.fn();
    render(<Harness spy={spy} />);
    const remove = screen.getByRole("button", {
      name: "Ebene „Messen“ löschen",
    });
    remove.focus();
    fireEvent.click(remove);
    fireEvent.click(
      within(screen.getByRole("dialog")).getByRole("button", {
        name: "Abbrechen",
      }),
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(spy).not.toHaveBeenCalled();
    expect(remove).toHaveFocus();
  });

  it("setzt den Fokus nach dem Löschen auf „Neue Ebene“", () => {
    render(<Harness />);
    const remove = screen.getByRole("button", {
      name: "Ebene „Messen“ löschen",
    });
    remove.focus();
    fireEvent.click(remove);
    fireEvent.click(
      within(screen.getByRole("dialog")).getByRole("button", {
        name: "Löschen",
      }),
    );
    expect(screen.getByRole("button", { name: "Neue Ebene" })).toHaveFocus();
  });
});
