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

import { ColorField, normalizeHex } from "./color-field";

describe("ColorField", () => {
  it("bietet zwölf Farben an und markiert die gewählte", () => {
    render(<ColorField label="Farbe von „TMS“" value="#91B900" onChange={jest.fn()} />);
    const group = screen.getByRole("group", { name: "Farbe von „TMS“" });
    const swatches = within(group).getAllByRole("radio");
    expect(swatches).toHaveLength(12);
    expect(within(group).getByRole("radio", { name: "#91B900" })).toBeChecked();
  });

  it("wählt eine Farbe aus der Palette", () => {
    const onChange = jest.fn();
    render(<ColorField label="Farbe" value="#91B900" onChange={onChange} />);
    fireEvent.click(screen.getByRole("radio", { name: "#E40045" }));
    expect(onChange).toHaveBeenCalledWith("#E40045");
  });

  it("nimmt einen gültigen Hex-Wert an, auch ohne Raute und klein geschrieben", () => {
    const onChange = jest.fn();
    render(<ColorField label="Farbe" value="#91B900" onChange={onChange} />);
    fireEvent.change(screen.getByLabelText("Hex-Wert"), { target: { value: "12ab9f" } });
    expect(onChange).toHaveBeenCalledWith("#12AB9F");
  });

  it("weist einen ungültigen Hex-Wert am Feld zurück", () => {
    const onChange = jest.fn();
    render(<ColorField label="Farbe" value="#91B900" onChange={onChange} />);
    const input = screen.getByLabelText("Hex-Wert");
    fireEvent.change(input, { target: { value: "#12AB" } });
    expect(onChange).not.toHaveBeenCalled();
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription(/#RRGGBB/);
  });

  it("markiert keine Palettenfarbe bei einer eigenen Farbe", () => {
    render(<ColorField label="Farbe" value="#123456" onChange={jest.fn()} />);
    expect(screen.getAllByRole("radio").filter((radio) => (radio as HTMLInputElement).checked)).toHaveLength(0);
  });
});

describe("normalizeHex", () => {
  it.each([
    ["#e40045", "#E40045"],
    ["e40045", "#E40045"],
    [" #E40045 ", "#E40045"],
    ["#E4004", null],
    ["rot", null],
  ])("macht aus %p %p", (input, expected) => {
    expect(normalizeHex(input)).toBe(expected);
  });
});
