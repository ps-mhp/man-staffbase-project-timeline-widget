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

import { MilestoneSymbol } from "../plan-model";
import { SymbolPicker } from "./symbol-picker";

function Harness({ spy = jest.fn() }: { spy?: jest.Mock }): React.ReactElement {
  const [symbol, setSymbol] = useState<MilestoneSymbol>("diamond");
  return (
    <>
      <SymbolPicker
        title="TMS"
        value={symbol}
        color="#91B900"
        onChange={(next) => {
          spy(next);
          setSymbol(next);
        }}
      />
      <button type="button">Daneben</button>
    </>
  );
}

const trigger = (name: string): HTMLElement =>
  screen.getByRole("button", { name });

describe("SymbolPicker", () => {
  it("zeigt die Form als Knopf mit sprechendem Namen, in der Farbe der Kategorie", () => {
    const { container } = render(<Harness />);
    const button = trigger("Form von „TMS“: Raute");
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(container.querySelector("svg path")).toHaveAttribute(
      "fill",
      "#91B900",
    );
  });

  it("klappt die acht Formen als Optionsgruppe auf, der Fokus auf der gewählten", () => {
    render(<Harness />);
    fireEvent.click(trigger("Form von „TMS“: Raute"));
    const group = screen.getByRole("radiogroup", { name: "Form von „TMS“" });
    const radios = within(group).getAllByRole("radio");
    expect(radios.map((radio) => radio.getAttribute("aria-label"))).toEqual([
      "Raute",
      "Dreieck",
      "Dreieck, Spitze unten",
      "Quadrat",
      "Kreis",
      "Sechseck",
      "Stern",
      "Kreuz",
    ]);
    const diamond = within(group).getByRole("radio", { name: "Raute" });
    expect(diamond).toHaveAttribute("aria-checked", "true");
    expect(diamond).toHaveAttribute("title", "Raute");
    expect(diamond).toHaveFocus();
  });

  it("wählt mit Klick und mit den Pfeiltasten", () => {
    const spy = jest.fn();
    render(<Harness spy={spy} />);
    fireEvent.click(trigger("Form von „TMS“: Raute"));
    fireEvent.click(screen.getByRole("radio", { name: "Stern" }));
    expect(spy).toHaveBeenLastCalledWith("star");
    const star = screen.getByRole("radio", { name: "Stern" });
    star.focus();
    fireEvent.keyDown(star, { key: "ArrowRight" });
    expect(spy).toHaveBeenLastCalledWith("plus");
    expect(screen.getByRole("radio", { name: "Kreuz" })).toHaveFocus();
    fireEvent.keyDown(screen.getByRole("radio", { name: "Kreuz" }), {
      key: "ArrowRight",
    });
    expect(spy).toHaveBeenLastCalledWith("diamond");
    expect(screen.getByRole("radio", { name: "Raute" })).toHaveAttribute(
      "tabindex",
      "0",
    );
  });

  it("schließt mit Esc und gibt den Fokus zurück", () => {
    render(<Harness />);
    fireEvent.click(trigger("Form von „TMS“: Raute"));
    fireEvent.keyDown(screen.getByRole("radio", { name: "Raute" }), {
      key: "Escape",
    });
    expect(screen.queryByRole("radiogroup")).not.toBeInTheDocument();
    expect(trigger("Form von „TMS“: Raute")).toHaveFocus();
  });

  it("schließt bei einem Klick daneben", () => {
    render(<Harness />);
    fireEvent.click(trigger("Form von „TMS“: Raute"));
    fireEvent.pointerDown(screen.getByRole("button", { name: "Daneben" }));
    expect(screen.queryByRole("radiogroup")).not.toBeInTheDocument();
  });
});
