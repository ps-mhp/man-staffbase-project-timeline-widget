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

import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";

import { examplePlan } from "./example-plan";
import { HelpDialog, zoomModifier } from "./help-dialog";

const renderHelp = (allowExport = true, onClose = jest.fn()) =>
  render(<HelpDialog plan={examplePlan()} allowExport={allowExport} onClose={onClose} />);

describe("HelpDialog", () => {
  it("erklärt zuerst die Legende mit jedem Element und den Kategorien des Plans", () => {
    renderHelp();
    const dialog = screen.getByRole("dialog", { name: "Hilfe zum Projektplan" });
    expect(within(dialog).getByRole("tab", { name: "Legende" })).toHaveAttribute("aria-selected", "true");
    for (const term of ["Meilenstein", "Zeitraum", "Vorläufig", "Serie", "Abhängigkeit", "Stichtag", "Heute", "Eingeklappte Ebene"]) {
      expect(within(dialog).getByText(term, { selector: "dt" })).toBeInTheDocument();
    }
    expect(within(dialog).getByText("MY26 TG Assist")).toBeInTheDocument();
  });

  it("erklärt auf dem zweiten Reiter die Bedienung", () => {
    renderHelp();
    fireEvent.click(screen.getByRole("tab", { name: "Bedienung" }));
    const panel = screen.getByRole("tabpanel", { name: "Bedienung" });
    for (const heading of ["Maus und Trackpad", "Touch", "Tastatur", "Filter und Ansicht"]) {
      expect(within(panel).getByRole("heading", { name: heading })).toBeInTheDocument();
    }
    expect(within(panel).getByText(/Excel/)).toBeInTheDocument();
  });

  it("verschweigt den Export, wenn es ihn nicht gibt", () => {
    renderHelp(false);
    fireEvent.click(screen.getByRole("tab", { name: "Bedienung" }));
    expect(screen.queryByText(/Excel/)).not.toBeInTheDocument();
  });

  it("wechselt die Reiter mit den Pfeiltasten", () => {
    renderHelp();
    fireEvent.keyDown(screen.getByRole("tab", { name: "Legende" }), { key: "ArrowRight" });
    expect(screen.getByRole("tab", { name: "Bedienung" })).toHaveFocus();
    expect(screen.getByRole("tab", { name: "Bedienung" })).toHaveAttribute("aria-selected", "true");
  });

  it("schließt mit Esc und mit dem Knopf", () => {
    const onClose = jest.fn();
    renderHelp(true, onClose);
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    fireEvent.click(screen.getByRole("button", { name: "Schließen" }));
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it("nennt die Zoom-Taste der Plattform", () => {
    expect(zoomModifier("MacIntel")).toBe("⌘");
    expect(zoomModifier("iPad")).toBe("⌘");
    expect(zoomModifier("Win32")).toBe("Strg");
    expect(zoomModifier("")).toBe("Strg");
  });
});
