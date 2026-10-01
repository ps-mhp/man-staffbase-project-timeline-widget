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

import { LIMITS, Plan, todayIso } from "../plan-model";
import { PLAN_TEMPLATES } from "../plan-templates";
import { Harness, emptyPlan, lastPlan } from "./plan-editor.fixture";
import { mockTimelineProps } from "./project-timeline.mock";
import { findItem, testPlan } from "./test-plan.fixture";

jest.mock("../project-timeline", () =>
  jest.requireActual("./project-timeline.mock"),
);

beforeEach(() => {
  mockTimelineProps.current = null;
});

afterEach(() => window.localStorage.clear());

describe("PlanEditor: Einträge und Beginn", () => {
  it("legt einen Meilenstein in der Mitte der Vorschau an und wählt ihn", () => {
    const onChange = jest.fn();
    render(<Harness onChange={onChange} />);
    fireEvent.click(
      screen.getByRole("button", { name: "Vorschau: Ausschnitt 2025" }),
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Meilenstein anlegen" }),
    );

    const plan = lastPlan(onChange);
    const created = plan.items[plan.items.length - 1];
    expect(created).toMatchObject({
      kind: "milestone",
      title: "Neuer Meilenstein",
      date: "2025-07-02",
      lane: "l1",
    });
    const title = screen.getByLabelText("Titel") as HTMLInputElement;
    expect(title).toHaveValue("Neuer Meilenstein");
    expect(title).toHaveFocus();
    // Markiert: das erste Tippen ersetzt den Platzhalter.
    expect([title.selectionStart, title.selectionEnd]).toEqual([0, 17]);
    expect(screen.getByRole("tab", { name: "Allgemein" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(
      screen.getByText(`5 / ${LIMITS.items} Einträge`),
    ).toBeInTheDocument();
  });

  it("legt ohne gemeldeten Ausschnitt heute an", () => {
    const onChange = jest.fn();
    render(<Harness onChange={onChange} />);
    fireEvent.click(screen.getByRole("tab", { name: /^Stichtage/ }));
    fireEvent.click(screen.getByRole("button", { name: "Stichtag anlegen" }));
    const plan = lastPlan(onChange);
    expect(plan.items[plan.items.length - 1]).toMatchObject({
      kind: "deadline",
      date: todayIso(),
    });
  });

  it("dupliziert und löscht den gewählten Eintrag", () => {
    const onChange = jest.fn();
    render(<Harness onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: /^Bauma/ }));
    fireEvent.click(screen.getByRole("button", { name: "Duplizieren" }));
    expect(screen.getByLabelText("Titel")).toHaveValue("Bauma (Kopie)");

    fireEvent.click(screen.getByRole("button", { name: "Löschen" }));
    fireEvent.click(
      within(screen.getByRole("dialog")).getByRole("button", {
        name: "Löschen",
      }),
    );
    const plan = lastPlan(onChange);
    expect(plan.items.map((item) => item.title)).not.toContain("Bauma (Kopie)");
    // Die Auswahl rückt auf den nächsten Eintrag, der Fokus auf seine Zeile.
    expect(screen.getByLabelText("Titel")).toHaveValue("SOP");
    expect(screen.getByRole("button", { name: /^SOP/ })).toHaveFocus();
  });

  it("löscht einen Eintrag samt Verweisen", () => {
    const onChange = jest.fn();
    render(<Harness onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "„Bauma“ löschen" }));
    fireEvent.click(
      within(screen.getByRole("dialog")).getByRole("button", {
        name: "Löschen",
      }),
    );
    expect(findItem(lastPlan(onChange), "b1")).not.toHaveProperty("dependsOn");
  });

  it("zeigt die Ebenen und Kategorien in ihren Reitern", () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole("tab", { name: "Ebenen" }));
    expect(screen.getByRole("tabpanel", { name: "Ebenen" })).toContainElement(
      screen.getByLabelText("Name der Ebene 1"),
    );
    fireEvent.click(screen.getByRole("tab", { name: "Kategorien" }));
    expect(screen.getByLabelText("Name der Kategorie 1")).toHaveValue(
      "General",
    );
  });

  it("zeigt zum Beginnen mit einer Vorlage alle Vorlagen zur Wahl", () => {
    const onChange = jest.fn();
    render(
      <Harness
        initial={{ plan: emptyPlan(), dropped: 0 }}
        onChange={onChange}
      />,
    );
    expect(screen.queryByRole("tablist")).not.toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: "Mit Vorlage beginnen" }),
    );
    const gallery = screen.getByRole("list", { name: "Vorlagen" });
    const cards = within(gallery).getAllByRole("button");
    expect(cards).toHaveLength(PLAN_TEMPLATES.length);
    for (const template of PLAN_TEMPLATES) {
      expect(
        within(gallery).getByRole("button", { name: template.title }),
      ).toHaveAccessibleDescription(expect.stringContaining(template.description));
    }
    // Die Wahl allein ändert den Plan noch nicht.
    expect(onChange).not.toHaveBeenCalled();
    expect(cards[0]).toHaveFocus();
  });

  it.each(PLAN_TEMPLATES.map((template) => [template.title, template] as const))(
    "beginnt einen leeren Plan mit der Vorlage „%s“",
    (title, template) => {
      const onChange = jest.fn();
      render(
        <Harness
          initial={{ plan: emptyPlan(), dropped: 0 }}
          onChange={onChange}
        />,
      );
      fireEvent.click(
        screen.getByRole("button", { name: "Mit Vorlage beginnen" }),
      );
      fireEvent.click(screen.getByRole("button", { name: title }));
      expect(lastPlan(onChange)).toEqual({
        ...template.create(),
        updatedAt: todayIso(),
      });
      expect(screen.getByRole("tab", { name: "Einträge" })).toHaveFocus();
    },
  );

  it("kehrt aus der Vorlagenwahl ohne Änderung zurück", () => {
    const onChange = jest.fn();
    render(
      <Harness
        initial={{ plan: emptyPlan(), dropped: 0 }}
        onChange={onChange}
      />,
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Mit Vorlage beginnen" }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Zurück" }));
    expect(screen.queryByRole("list", { name: "Vorlagen" })).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Mit Vorlage beginnen" }),
    ).toHaveFocus();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("beginnt einen leeren Plan leer mit einer Ebene", () => {
    const onChange = jest.fn();
    render(
      <Harness
        initial={{ plan: emptyPlan(), dropped: 0 }}
        onChange={onChange}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Leer beginnen" }));
    expect(lastPlan(onChange).lanes).toEqual([
      { id: expect.any(String), title: "Ebene 1" },
    ]);
    expect(
      screen.getByRole("button", { name: "Meilenstein anlegen" }),
    ).toBeEnabled();
  });

  it("zeigt auch einen Plan nur mit Stichtagen, ohne Leerzustand", () => {
    const plan: Plan = {
      ...emptyPlan(),
      items: [
        { id: "d1", kind: "deadline", title: "Euro 7", date: "2027-07-01" },
      ],
    };
    render(<Harness initial={{ plan, dropped: 0 }} />);
    expect(
      screen.queryByRole("button", { name: "Leer beginnen" }),
    ).not.toBeInTheDocument();
    // Die Liste beginnt mit der ersten Art, von der es Einträge gibt.
    expect(screen.getByRole("tab", { name: "Stichtage 1" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    fireEvent.click(screen.getByRole("tab", { name: "Meilensteine 0" }));
    expect(
      screen.getByRole("button", { name: "Meilenstein anlegen" }),
    ).toBeDisabled();
  });

  it("springt auf die Art des Eintrags, den die Vorschau wählt", () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole("tab", { name: /^Stichtage/ }));
    fireEvent.click(
      screen.getByRole("button", { name: "Vorschau: Bauma wählen" }),
    );
    expect(screen.getByRole("tab", { name: /^Meilensteine/ })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("button", { name: /^Bauma/ })).toHaveAttribute(
      "aria-current",
      "true",
    );
  });

  it("behält die gewählte Art beim Wechsel der Hauptreiter", () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole("tab", { name: /^Zeiträume/ }));
    fireEvent.click(screen.getByRole("tab", { name: "Ebenen" }));
    fireEvent.click(screen.getByRole("tab", { name: "Einträge" }));
    expect(screen.getByRole("tab", { name: /^Zeiträume/ })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("behält den Unterreiter beim Wechsel zu einem anderen Eintrag", () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole("button", { name: /^Bauma/ }));
    fireEvent.click(screen.getByRole("tab", { name: "Termin" }));
    fireEvent.click(screen.getByRole("button", { name: /^SOP/ }));
    expect(screen.getByRole("tab", { name: "Termin" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByLabelText("Datum")).toHaveValue("2026-01-15");
  });

  it("nennt im leeren Formularbereich, dass kein Eintrag gewählt ist", () => {
    render(<Harness />);
    expect(
      screen.getByRole("heading", { name: "Kein Eintrag gewählt" }),
    ).toBeInTheDocument();
  });

  it("übernimmt und vergisst dabei die verworfenen Einträge — sie sind dann gespeichert weg", () => {
    const onChange = jest.fn();
    const onSave = jest.fn();
    render(
      <Harness
        initial={{ plan: testPlan(), dropped: 2 }}
        onChange={onChange}
        onSave={onSave}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Übernehmen" }));
    expect(onChange).toHaveBeenLastCalledWith({ plan: testPlan(), dropped: 0, droppedLinks: 0 });
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
    const sheets = [...container.querySelectorAll("style")].map(
      (style) => style.textContent ?? "",
    );
    expect(sheets.some((css) => css.includes(".man-pt-editor__bar"))).toBe(
      true,
    );
    expect(sheets.some((css) => css.includes(".man-pt-editor__button"))).toBe(
      true,
    );
    expect(sheets.some((css) => css.includes(".man-pt-editor__input"))).toBe(
      true,
    );
    expect(screen.queryByText(/man-pt-editor__/)).not.toBeInTheDocument();
  });

  it("wechselt die Art im Formular und zeigt die passenden Felder", () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole("button", { name: /^Bauma/ }));
    fireEvent.change(screen.getByLabelText("Art"), {
      target: { value: "deadline" },
    });
    const form = screen.getByRole("region", { name: "Eintrag „Bauma“" });
    expect(within(form).queryByLabelText("Ebene")).not.toBeInTheDocument();
    expect(within(form).getByLabelText("Datum")).toHaveValue("2025-04-07");
  });
});
