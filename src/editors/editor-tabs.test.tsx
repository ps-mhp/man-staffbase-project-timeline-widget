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
import { fireEvent, render, screen } from "@testing-library/react";

import { EditorTabs, TabDefinition } from "./editor-tabs";

type Tab = "items" | "lanes" | "categories";

const TABS: readonly TabDefinition<Tab>[] = [
  { id: "items", label: "Einträge" },
  { id: "lanes", label: "Ebenen" },
  { id: "categories", label: "Kategorien" },
];

function Harness(): React.ReactElement {
  const [active, setActive] = useState<Tab>("items");
  return (
    <EditorTabs tabs={TABS} active={active} onChange={setActive} label="Bereiche des Plans">
      <p>Inhalt {active}</p>
    </EditorTabs>
  );
}

describe("EditorTabs", () => {
  it("zeigt echte Reiter mit zugehörigem Bereich", () => {
    render(<Harness />);
    expect(screen.getByRole("tablist", { name: "Bereiche des Plans" })).toBeInTheDocument();
    const tab = screen.getByRole("tab", { name: "Einträge" });
    expect(tab).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel", { name: "Einträge" })).toHaveTextContent("Inhalt items");
  });

  it("hält nur den aktiven Reiter in der Tab-Reihenfolge", () => {
    render(<Harness />);
    expect(screen.getByRole("tab", { name: "Einträge" })).toHaveAttribute("tabindex", "0");
    expect(screen.getByRole("tab", { name: "Ebenen" })).toHaveAttribute("tabindex", "-1");
  });

  it("wechselt per Klick", () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole("tab", { name: "Kategorien" }));
    expect(screen.getByRole("tabpanel", { name: "Kategorien" })).toHaveTextContent("Inhalt categories");
  });

  it.each([
    ["ArrowRight", "Ebenen"],
    ["ArrowLeft", "Kategorien"],
    ["End", "Kategorien"],
    ["Home", "Einträge"],
  ])("wechselt mit %s und nimmt den Fokus mit", (key, expected) => {
    render(<Harness />);
    const first = screen.getByRole("tab", { name: "Einträge" });
    first.focus();
    fireEvent.keyDown(first, { key });
    const target = screen.getByRole("tab", { name: expected });
    expect(target).toHaveAttribute("aria-selected", "true");
    expect(target).toHaveFocus();
  });
});
