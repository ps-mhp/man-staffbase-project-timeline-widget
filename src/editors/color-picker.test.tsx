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

import { ColorPicker } from "./color-picker";

const renderPicker = (onChange = jest.fn()) =>
  render(
    <>
      <ColorPicker title="TMS" value="#91B900" onChange={onChange} />
      <button type="button">Daneben</button>
    </>,
  );

const trigger = (): HTMLElement =>
  screen.getByRole("button", { name: "Farbe von „TMS“: #91B900" });

describe("ColorPicker", () => {
  it("zeigt die Farbe als Knopf mit sprechendem Namen, zugeklappt", () => {
    renderPicker();
    expect(trigger()).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.queryByRole("group", { name: "Farbe von „TMS“" }),
    ).not.toBeInTheDocument();
  });

  it("klappt die zwölf Farben samt Hex-Feld auf und setzt den Fokus auf die gewählte", () => {
    renderPicker();
    fireEvent.click(trigger());
    expect(trigger()).toHaveAttribute("aria-expanded", "true");
    const group = screen.getByRole("group", { name: "Farbe von „TMS“" });
    expect(within(group).getAllByRole("radio")).toHaveLength(12);
    expect(within(group).getByLabelText("Hex-Wert")).toBeInTheDocument();
    expect(within(group).getByRole("radio", { name: "#91B900" })).toHaveFocus();
  });

  it("gibt eine gewählte Farbe weiter und bleibt offen — die Pfeiltasten wählen bei jedem Schritt", () => {
    const onChange = jest.fn();
    renderPicker(onChange);
    fireEvent.click(trigger());
    fireEvent.click(screen.getByRole("radio", { name: "#E40045" }));
    expect(onChange).toHaveBeenCalledWith("#E40045");
    expect(
      screen.getByRole("group", { name: "Farbe von „TMS“" }),
    ).toBeInTheDocument();
  });

  it("schließt mit Esc und gibt den Fokus an den Knopf zurück", () => {
    renderPicker();
    fireEvent.click(trigger());
    fireEvent.keyDown(screen.getByRole("radio", { name: "#91B900" }), {
      key: "Escape",
    });
    expect(
      screen.queryByRole("group", { name: "Farbe von „TMS“" }),
    ).not.toBeInTheDocument();
    expect(trigger()).toHaveFocus();
  });

  it("schließt bei einem Klick daneben", () => {
    renderPicker();
    fireEvent.click(trigger());
    fireEvent.pointerDown(screen.getByRole("button", { name: "Daneben" }));
    expect(
      screen.queryByRole("group", { name: "Farbe von „TMS“" }),
    ).not.toBeInTheDocument();
  });

  it("bleibt bei einem Klick in das Feld offen", () => {
    renderPicker();
    fireEvent.click(trigger());
    fireEvent.pointerDown(screen.getByLabelText("Hex-Wert"));
    expect(
      screen.getByRole("group", { name: "Farbe von „TMS“" }),
    ).toBeInTheDocument();
  });
});
