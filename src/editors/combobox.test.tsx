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

import { Combobox } from "./combobox";

const suggestions = [
  { value: "TG Assist MY26", count: 3 },
  { value: "eTGL", count: 4 },
  { value: "Série Été", count: 1 },
];

function Harness({
  initial = "",
  spy = jest.fn(),
}: {
  initial?: string;
  spy?: jest.Mock;
}): React.ReactElement {
  const [value, setValue] = useState(initial);
  return (
    <>
      <Combobox
        label="Serie"
        value={value}
        suggestions={suggestions}
        onChange={(next) => {
          spy(next);
          setValue(next);
        }}
        noneLabel="Keine Serie"
        createLabel={(text) => `„${text}“ als neue Serie anlegen`}
        describe={(entry) => `${entry.count} Einträge`}
        hint="Einträge derselben Ebene mit gleicher Serie stehen auf einer gemeinsamen Zeile."
      />
      <button type="button">Weiter</button>
    </>
  );
}

const input = (): HTMLElement =>
  screen.getByRole("combobox", { name: "Serie" });
const options = (): string[] =>
  within(screen.getByRole("listbox", { name: "Serie" }))
    .getAllByRole("option")
    .map((option) => option.textContent ?? "");

describe("Combobox", () => {
  it("klappt beim Fokus alle Vorschläge auf, mit Zahl der Einträge", () => {
    render(<Harness initial="eTGL" />);
    expect(input()).toHaveAttribute("aria-expanded", "false");
    fireEvent.focus(input());
    expect(input()).toHaveAttribute("aria-expanded", "true");
    expect(options()).toEqual([
      "Keine Serie",
      "TG Assist MY26 · 3 Einträge",
      "eTGL · 4 Einträge",
      "Série Été · 1 Einträge",
    ]);
    expect(input()).toHaveAccessibleDescription(/gemeinsamen Zeile/);
  });

  it("filtert beim Tippen ohne Rücksicht auf Akzente und hebt den Treffer hervor", () => {
    const { container } = render(<Harness />);
    fireEvent.change(input(), { target: { value: "ete" } });
    expect(options()).toEqual([
      "„ete“ als neue Serie anlegen",
      "Série Été · 1 Einträge",
    ]);
    expect(container.querySelector("mark")?.textContent).toBe("Été");
  });

  it("bewegt sich mit den Pfeiltasten und nennt die aktive Option", () => {
    render(<Harness />);
    fireEvent.focus(input());
    fireEvent.keyDown(input(), { key: "ArrowDown" });
    fireEvent.keyDown(input(), { key: "ArrowDown" });
    const active = screen.getByRole("option", { name: "eTGL · 4 Einträge" });
    expect(active).toHaveAttribute("aria-selected", "true");
    expect(input()).toHaveAttribute("aria-activedescendant", active.id);
    fireEvent.keyDown(input(), { key: "ArrowUp" });
    expect(
      screen.getByRole("option", { name: "TG Assist MY26 · 3 Einträge" }),
    ).toHaveAttribute("aria-selected", "true");
  });

  it("übernimmt mit Enter die aktive Option", () => {
    const spy = jest.fn();
    render(<Harness spy={spy} />);
    fireEvent.focus(input());
    fireEvent.keyDown(input(), { key: "ArrowDown" });
    fireEvent.keyDown(input(), { key: "Enter" });
    expect(spy).toHaveBeenLastCalledWith("TG Assist MY26");
    expect(input()).toHaveValue("TG Assist MY26");
    expect(input()).toHaveAttribute("aria-expanded", "false");
  });

  it("legt einen neuen Namen getrimmt an", () => {
    const spy = jest.fn();
    render(<Harness spy={spy} />);
    fireEvent.change(input(), { target: { value: "  Neue Serie " } });
    fireEvent.click(
      screen.getByRole("option", {
        name: "„Neue Serie“ als neue Serie anlegen",
      }),
    );
    expect(spy).toHaveBeenLastCalledWith("Neue Serie");
  });

  it("stellt mit Esc den vorherigen Wert wieder her", () => {
    const spy = jest.fn();
    render(<Harness initial="eTGL" spy={spy} />);
    fireEvent.change(input(), { target: { value: "anders" } });
    fireEvent.keyDown(input(), { key: "Escape" });
    expect(input()).toHaveValue("eTGL");
    expect(spy).not.toHaveBeenCalled();
  });

  it("übernimmt beim Verlassen den Text, wie er dasteht — nicht die markierte Option", () => {
    const spy = jest.fn();
    render(<Harness spy={spy} />);
    fireEvent.change(input(), { target: { value: "etgl" } });
    fireEvent.keyDown(input(), { key: "ArrowDown" });
    fireEvent.blur(input(), {
      relatedTarget: screen.getByRole("button", { name: "Weiter" }),
    });
    expect(spy).toHaveBeenLastCalledWith("eTGL");
  });

  it("entfernt die Serie, wenn das Feld beim Verlassen leer ist", () => {
    const spy = jest.fn();
    render(<Harness initial="eTGL" spy={spy} />);
    fireEvent.change(input(), { target: { value: "" } });
    fireEvent.blur(input());
    expect(spy).toHaveBeenLastCalledWith("");
  });

  it("öffnet und schließt über den Pfeil im Feld", () => {
    render(<Harness />);
    const toggle = screen.getByRole("button", {
      name: "Vorschläge für „Serie“ zeigen",
    });
    fireEvent.click(toggle);
    expect(input()).toHaveAttribute("aria-expanded", "true");
    expect(input()).toHaveFocus();
    fireEvent.click(toggle);
    expect(input()).toHaveAttribute("aria-expanded", "false");
  });
});
