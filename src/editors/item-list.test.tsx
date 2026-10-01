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

import { ItemKind, LIMITS, Plan } from "../plan-model";
import { FocusRequest, ItemList } from "./item-list";
import { testPlan } from "./test-plan.fixture";

interface HarnessProps {
  plan?: Plan;
  kind?: ItemKind;
  selectedId?: string | null;
  onSelect?: jest.Mock;
  onAdd?: jest.Mock;
  onRemove?: jest.Mock;
  focusRequest?: FocusRequest | null;
}

/** Hält Art und Suche wie der Editor. */
function Harness({
  plan = testPlan(),
  kind: initialKind = "milestone",
  selectedId = null,
  onSelect = jest.fn(),
  onAdd = jest.fn(),
  onRemove = jest.fn(),
  focusRequest = null,
}: HarnessProps): React.ReactElement {
  const [kind, setKind] = useState<ItemKind>(initialKind);
  const [query, setQuery] = useState("");
  return (
    <ItemList
      plan={plan}
      selectedId={selectedId}
      locale="de-DE"
      kind={kind}
      onKindChange={setKind}
      query={query}
      onQueryChange={setQuery}
      onSelect={onSelect}
      onAdd={onAdd}
      onRemove={onRemove}
      focusRequest={focusRequest}
      onFocusDone={jest.fn()}
    />
  );
}

/** Die Knöpfe, die einen Eintrag wählen — ohne die Papierkörbe. */
const entries = (): string[] =>
  within(screen.getByRole("list", { name: "Einträge" }))
    .getAllByRole("button")
    .filter((button) => button.hasAttribute("data-item-id"))
    .map((button) => button.textContent ?? "");

describe("ItemList: Arten", () => {
  it("zeigt die Arten als Pillen mit Zahl und filtert die Liste", () => {
    render(<Harness />);
    const pills = screen.getByRole("tablist", { name: "Art der Einträge" });
    expect(
      within(pills)
        .getAllByRole("tab")
        .map((tab) => tab.textContent),
    ).toEqual(["Meilensteine 2", "Zeiträume 1", "Stichtage 1"]);
    expect(entries()).toEqual([
      "BaumaMeilenstein · Messen · 07.04.2025",
      "SOPMeilenstein · SOPs · 15.01.2026",
    ]);
    fireEvent.click(screen.getByRole("tab", { name: "Zeiträume 1" }));
    expect(entries()).toEqual([
      "TMS1Zeitraum · SOPs · 01.01.2028 – 30.06.2030",
    ]);
  });

  it("wechselt die Art mit den Pfeiltasten", () => {
    render(<Harness />);
    const first = screen.getByRole("tab", { name: "Meilensteine 2" });
    first.focus();
    fireEvent.keyDown(first, { key: "End" });
    expect(screen.getByRole("tab", { name: "Stichtage 1" })).toHaveFocus();
    expect(entries()).toEqual(["Euro 7Stichtag · Alle Ebenen · 01.07.2027"]);
  });

  it("zeigt vor jedem Titel Form und Farbe der Kategorie", () => {
    render(<Harness />);
    const bauma = screen.getByRole("button", { name: /^Bauma/ });
    const glyph = bauma.querySelector("svg");
    expect(glyph).toHaveAttribute("data-symbol", "square");
    expect(glyph).toHaveAttribute("aria-hidden", "true");
    expect(glyph?.querySelector("path")).toHaveAttribute("fill", "#E40045");
  });

  it("verbindet die Pillen mit der Liste", () => {
    render(<Harness />);
    const tab = screen.getByRole("tab", { name: "Meilensteine 2" });
    const panel = screen.getByRole("tabpanel", { name: "Meilensteine 2" });
    expect(tab).toHaveAttribute("aria-controls", panel.id);
    expect(panel).toContainElement(
      screen.getByRole("list", { name: "Einträge" }),
    );
  });

  it("zählt bei aktiver Suche die Treffer je Art", () => {
    render(<Harness />);
    fireEvent.change(screen.getByLabelText("Einträge durchsuchen"), {
      target: { value: "sop" },
    });
    expect(
      screen.getByRole("tab", { name: "Meilensteine 1" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: "Zeiträume 1" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: "Stichtage 0" }),
    ).toBeInTheDocument();
    expect(entries()).toEqual(["SOPMeilenstein · SOPs · 15.01.2026"]);
  });

  it("sagt, wenn die Suche in dieser Art nichts findet", () => {
    render(<Harness />);
    fireEvent.change(screen.getByLabelText("Einträge durchsuchen"), {
      target: { value: "gibt es nicht" },
    });
    expect(
      screen.getByText("Kein Eintrag passt zur Suche."),
    ).toBeInTheDocument();
  });

  it("zeigt für eine leere Art einen Leerzustand mit Hinweis auf „+“", () => {
    const plan: Plan = {
      ...testPlan(),
      items: testPlan().items.filter((item) => item.kind !== "deadline"),
    };
    render(<Harness plan={plan} kind="deadline" />);
    expect(
      screen.getByText("Noch keine Stichtage. Der Knopf „+“ legt einen an."),
    ).toBeInTheDocument();
  });
});

describe("ItemList: Anlegen und Wählen", () => {
  it("legt über „+“ einen Eintrag der gewählten Art an; der Name wechselt mit", () => {
    const onAdd = jest.fn();
    render(<Harness onAdd={onAdd} />);
    const add = screen.getByRole("button", { name: "Meilenstein anlegen" });
    expect(add).toHaveAttribute("title", "Meilenstein anlegen");
    fireEvent.click(add);
    expect(onAdd).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole("tab", { name: "Stichtage 1" }));
    expect(
      screen.getByRole("button", { name: "Stichtag anlegen" }),
    ).toBeEnabled();
  });

  it("sperrt „+“ ohne Ebene für Meilensteine und Zeiträume und sagt, warum", () => {
    const plan: Plan = { ...testPlan(), lanes: [], items: [] };
    render(<Harness plan={plan} />);
    expect(
      screen.getByRole("button", { name: "Meilenstein anlegen" }),
    ).toBeDisabled();
    expect(screen.getByText(/brauchen eine Ebene/)).toBeInTheDocument();
    // Kein Verweis auf den gesperrten Knopf im Leerzustand.
    expect(screen.getByText("Noch keine Meilensteine.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("tab", { name: "Stichtage 0" }));
    expect(
      screen.getByRole("button", { name: "Stichtag anlegen" }),
    ).toBeEnabled();
  });

  it("sperrt „+“ an der Obergrenze", () => {
    const plan: Plan = {
      ...testPlan(),
      items: Array.from({ length: LIMITS.items }, (_, index) => ({
        id: `d${index}`,
        kind: "deadline" as const,
        title: `Stichtag ${index}`,
        date: "2026-01-01",
      })),
    };
    render(<Harness plan={plan} kind="deadline" />);
    expect(
      screen.getByRole("button", { name: "Stichtag anlegen" }),
    ).toBeDisabled();
    expect(
      screen.getByText(
        `Mehr als ${LIMITS.items} Einträge trägt ein Plan nicht.`,
      ),
    ).toBeInTheDocument();
  });

  it("markiert den gewählten Eintrag und wählt per Klick", () => {
    const onSelect = jest.fn();
    render(<Harness selectedId="m2" onSelect={onSelect} />);
    expect(screen.getByRole("button", { name: /^SOP/ })).toHaveAttribute(
      "aria-current",
      "true",
    );
    fireEvent.click(screen.getByRole("button", { name: /^Bauma/ }));
    expect(onSelect).toHaveBeenCalledWith("m1");
  });

  it("holt den gewählten Eintrag in der Liste in Sicht, ohne die Umgebung zu rollen", () => {
    const { rerender } = render(<Harness />);
    const body = screen
      .getByRole("list", { name: "Einträge" })
      .closest(".man-pt-editor__pane-body") as HTMLElement;
    Object.defineProperty(body, "clientHeight", { value: 100 });
    body.getBoundingClientRect = () => ({ top: 0, height: 100 }) as DOMRect;
    screen.getByRole("button", { name: /^SOP/ }).getBoundingClientRect = () =>
      ({ top: 300, height: 40 }) as DOMRect;
    rerender(<Harness selectedId="m2" />);
    expect(body.scrollTop).toBe(240);
  });
});

describe("ItemList: Löschen", () => {
  it("fragt am Papierkorb nach, ohne die Zeile zu wählen", () => {
    const onSelect = jest.fn();
    const onRemove = jest.fn();
    render(<Harness onSelect={onSelect} onRemove={onRemove} />);
    const trash = screen.getByRole("button", { name: "„Bauma“ löschen" });
    expect(trash).toHaveAttribute("aria-haspopup", "dialog");
    trash.focus();
    fireEvent.click(trash);
    expect(trash).toHaveAttribute("aria-expanded", "true");
    expect(onSelect).not.toHaveBeenCalled();
    const dialog = screen.getByRole("dialog", { name: "„Bauma“ löschen?" });
    expect(
      within(dialog).getByRole("button", { name: "Abbrechen" }),
    ).toHaveFocus();
    fireEvent.click(within(dialog).getByRole("button", { name: "Löschen" }));
    expect(onRemove).toHaveBeenCalledWith("m1");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("nennt die Einträge, die davon abhängen", () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole("button", { name: "„Bauma“ löschen" }));
    expect(screen.getByRole("dialog")).toHaveAccessibleDescription(
      "1 Eintrag hängt davon ab; die Verbindung wird entfernt.",
    );
  });

  it("bricht mit „Abbrechen“ ab und gibt den Fokus an den Papierkorb zurück", () => {
    const onRemove = jest.fn();
    render(<Harness onRemove={onRemove} />);
    const trash = screen.getByRole("button", { name: "„Bauma“ löschen" });
    trash.focus();
    fireEvent.click(trash);
    fireEvent.click(
      within(screen.getByRole("dialog")).getByRole("button", {
        name: "Abbrechen",
      }),
    );
    expect(onRemove).not.toHaveBeenCalled();
    expect(trash).toHaveFocus();
  });

  it("setzt den Fokus auf die verlangte Zeile, ohne Zeile auf die Suche", () => {
    const { rerender } = render(<Harness />);
    rerender(<Harness focusRequest={{ id: "m2" }} />);
    expect(screen.getByRole("button", { name: /^SOP/ })).toHaveFocus();
    rerender(<Harness focusRequest={{ id: null }} />);
    expect(screen.getByLabelText("Einträge durchsuchen")).toHaveFocus();
  });
});
