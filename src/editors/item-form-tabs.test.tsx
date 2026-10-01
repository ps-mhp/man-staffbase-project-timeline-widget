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

import { FormHarness as Harness, openTab } from "./item-form.fixture";

describe("ItemForm: Unterreiter", () => {
  it("gliedert die Felder in vier Reiter der zweiten Ebene", () => {
    render(<Harness id="b1" />);
    const list = screen.getByRole("tablist", { name: "Felder des Eintrags" });
    expect(
      within(list)
        .getAllByRole("tab")
        .map((tab) => tab.textContent),
    ).toEqual(["Allgemein", "Einordnung", "Termin", "Abhängigkeiten (1)"]);
    expect(
      screen.getByRole("tabpanel", { name: "Allgemein" }),
    ).toContainElement(screen.getByLabelText("Titel"));
  });

  it("wechselt mit den Pfeiltasten und nimmt den Fokus mit", () => {
    render(<Harness id="m1" />);
    const general = screen.getByRole("tab", { name: "Allgemein" });
    general.focus();
    fireEvent.keyDown(general, { key: "ArrowRight" });
    expect(screen.getByRole("tab", { name: "Einordnung" })).toHaveFocus();
    expect(screen.getByRole("tab", { name: "Einordnung" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("behält Entwürfe beim Wechsel und markiert den Reiter mit dem Fehler", () => {
    render(<Harness id="m1" tab="term" />);
    fireEvent.change(screen.getByLabelText("Datum"), { target: { value: "" } });
    openTab("Allgemein");
    expect(
      screen.getByRole("tab", { name: "Termin, enthält Fehler" }),
    ).toBeInTheDocument();
    openTab(/^Termin/);
    expect(screen.getByLabelText("Datum")).toHaveValue("");
    expect(screen.getByLabelText("Datum")).toHaveAccessibleDescription(
      "Bitte ein Datum angeben.",
    );
    fireEvent.change(screen.getByLabelText("Datum"), {
      target: { value: "2025-05-01" },
    });
    expect(screen.getByRole("tab", { name: "Termin" })).toBeInTheDocument();
  });

  it("zeigt die Zahl der Vorgänger am Reiter und passt sie an", () => {
    render(<Harness id="m2" tab="dependencies" />);
    expect(
      screen.getByRole("tab", { name: "Abhängigkeiten" }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("checkbox", { name: /Bauma/ }));
    expect(
      screen.getByRole("tab", { name: "Abhängigkeiten (1)" }),
    ).toBeInTheDocument();
  });

  it("fällt bei einem Stichtag von „Abhängigkeiten“ auf „Allgemein“ zurück", () => {
    render(<Harness id="d1" tab="dependencies" />);
    expect(screen.getByRole("tab", { name: "Allgemein" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });
});

describe("ItemForm: Löschen", () => {
  it("fragt nach, nennt die abhängigen Einträge und setzt den Fokus auf „Abbrechen“", () => {
    render(<Harness id="m1" />);
    const remove = screen.getByRole("button", { name: "Löschen" });
    expect(remove).toHaveAttribute("aria-haspopup", "dialog");
    remove.focus();
    fireEvent.click(remove);
    expect(remove).toHaveAttribute("aria-expanded", "true");
    const dialog = screen.getByRole("dialog", { name: "„Bauma“ löschen?" });
    expect(dialog).toHaveAccessibleDescription(
      "1 Eintrag hängt davon ab; die Verbindung wird entfernt.",
    );
    expect(
      within(dialog).getByRole("button", { name: "Abbrechen" }),
    ).toHaveFocus();
  });

  it("schließt mit Esc, löscht nichts und gibt den Fokus zurück", () => {
    const onRemove = jest.fn();
    render(<Harness id="m1" onRemove={onRemove} />);
    const remove = screen.getByRole("button", { name: "Löschen" });
    remove.focus();
    fireEvent.click(remove);
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(onRemove).not.toHaveBeenCalled();
    expect(remove).toHaveFocus();
  });

  it("schließt bei einem Klick daneben", () => {
    render(<Harness id="m1" />);
    fireEvent.click(screen.getByRole("button", { name: "Löschen" }));
    fireEvent.pointerDown(screen.getByLabelText("Titel"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("nennt ohne abhängige Einträge keinen Zusatz", () => {
    render(<Harness id="m2" />);
    fireEvent.click(screen.getByRole("button", { name: "Löschen" }));
    expect(
      screen.getByRole("dialog", { name: "„SOP“ löschen?" }),
    ).not.toHaveAttribute("aria-describedby");
  });
});
