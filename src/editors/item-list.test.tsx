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

import { LIMITS, Plan } from "../plan-model";
import { ItemList, ItemListProps } from "./item-list";
import { testPlan } from "./test-plan.fixture";

const renderList = (overrides: Partial<ItemListProps> = {}) =>
  render(
    <ItemList
      plan={testPlan()}
      selectedId={null}
      locale="de-DE"
      onSelect={jest.fn()}
      onAdd={jest.fn()}
      {...overrides}
    />,
  );

const entries = (): HTMLElement[] => within(screen.getByRole("list", { name: "Einträge" })).getAllByRole("button");

describe("ItemList", () => {
  it("listet die Einträge nach Termin mit Art, Ebene und Termin", () => {
    renderList();
    expect(entries().map((entry) => entry.textContent)).toEqual([
      "BaumaMeilenstein · Messen · 07.04.2025",
      "SOPMeilenstein · SOPs · 15.01.2026",
      "Euro 7Stichtag · Alle Ebenen · 01.07.2027",
      "TMS1Zeitraum · SOPs · 01.01.2028 – 30.06.2030",
    ]);
  });

  it("markiert den gewählten Eintrag und wählt per Klick", () => {
    const onSelect = jest.fn();
    renderList({ selectedId: "d1", onSelect });
    expect(screen.getByRole("button", { name: /Euro 7/ })).toHaveAttribute("aria-current", "true");
    fireEvent.click(screen.getByRole("button", { name: /Bauma/ }));
    expect(onSelect).toHaveBeenCalledWith("m1");
  });

  it("durchsucht die Einträge ohne Rücksicht auf Groß- und Kleinschreibung", () => {
    renderList();
    fireEvent.change(screen.getByLabelText("Einträge durchsuchen"), { target: { value: "tms" } });
    expect(entries().map((entry) => entry.textContent)).toEqual(["TMS1Zeitraum · SOPs · 01.01.2028 – 30.06.2030"]);
  });

  it("sagt, wenn die Suche nichts findet", () => {
    renderList();
    fireEvent.change(screen.getByLabelText("Einträge durchsuchen"), { target: { value: "gibt es nicht" } });
    expect(screen.getByText("Kein Eintrag passt zur Suche.")).toBeInTheDocument();
  });

  it("legt jede Art an", () => {
    const onAdd = jest.fn();
    renderList({ onAdd });
    fireEvent.click(screen.getByRole("button", { name: "Meilenstein hinzufügen" }));
    fireEvent.click(screen.getByRole("button", { name: "Zeitraum hinzufügen" }));
    fireEvent.click(screen.getByRole("button", { name: "Stichtag hinzufügen" }));
    expect(onAdd.mock.calls).toEqual([["milestone"], ["bar"], ["deadline"]]);
  });

  it("sperrt ohne Ebene Meilenstein und Zeitraum und sagt, warum", () => {
    const plan: Plan = { ...testPlan(), lanes: [], items: [] };
    renderList({ plan });
    expect(screen.getByRole("button", { name: "Meilenstein hinzufügen" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Zeitraum hinzufügen" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Stichtag hinzufügen" })).toBeEnabled();
    expect(screen.getByText(/brauchen eine Ebene/)).toBeInTheDocument();
    expect(screen.getByText("Noch keine Einträge.")).toBeInTheDocument();
  });

  it("nimmt an der Obergrenze nichts mehr an", () => {
    const plan: Plan = {
      ...testPlan(),
      items: Array.from({ length: LIMITS.items }, (_, index) => ({
        id: `d${index}`,
        kind: "deadline" as const,
        title: `Stichtag ${index}`,
        date: "2026-01-01",
      })),
    };
    renderList({ plan });
    expect(screen.getByRole("button", { name: "Stichtag hinzufügen" })).toBeDisabled();
    expect(screen.getByText(`Mehr als ${LIMITS.items} Einträge trägt ein Plan nicht.`)).toBeInTheDocument();
  });
});
