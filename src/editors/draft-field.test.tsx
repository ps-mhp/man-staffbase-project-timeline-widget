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

import { DraftField, requireText } from "./draft-field";

/** Hält den Modellwert wie der Editor: nur gültige Eingaben kommen an. */
function Harness({
  initial,
  onCommit,
}: {
  initial: string;
  onCommit: jest.Mock;
}): React.ReactElement {
  const [value, setValue] = useState(initial);
  return (
    <>
      <DraftField
        label="Titel"
        value={value}
        validate={requireText("Bitte einen Titel angeben.")}
        onCommit={(text) => {
          onCommit(text);
          setValue(text);
        }}
      />
      <output data-testid="model">{value}</output>
      <button type="button" onClick={() => setValue("Von außen")}>
        Außen ändern
      </button>
    </>
  );
}

describe("DraftField", () => {
  it("gibt eine gültige Eingabe sofort weiter", () => {
    const onCommit = jest.fn();
    render(<Harness initial="Bauma" onCommit={onCommit} />);
    fireEvent.change(screen.getByLabelText("Titel"), {
      target: { value: "IAA" },
    });
    expect(onCommit).toHaveBeenCalledWith("IAA");
    expect(screen.getByTestId("model")).toHaveTextContent("IAA");
  });

  it("hält eine ungültige Eingabe als Entwurf und meldet den Fehler am Feld", () => {
    const onCommit = jest.fn();
    render(<Harness initial="Bauma" onCommit={onCommit} />);
    const input = screen.getByLabelText("Titel");
    fireEvent.change(input, { target: { value: "  " } });

    expect(onCommit).not.toHaveBeenCalled();
    expect(input).toHaveValue("  ");
    expect(screen.getByTestId("model")).toHaveTextContent("Bauma");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Bitte einen Titel angeben.");
  });

  it("übernimmt eine Änderung von außen in das Feld", () => {
    render(<Harness initial="Bauma" onCommit={jest.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: "Außen ändern" }));
    expect(screen.getByLabelText("Titel")).toHaveValue("Von außen");
  });

  it("ist ohne Fehler nicht als ungültig markiert", () => {
    render(<Harness initial="Bauma" onCommit={jest.fn()} />);
    expect(screen.getByLabelText("Titel")).not.toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("gibt bereinigt weiter und lässt den Entwurf stehen", () => {
    const onCommit = jest.fn();
    function Trimmed(): React.ReactElement {
      const [value, setValue] = useState("TMS");
      return (
        <DraftField
          label="Serie"
          value={value}
          normalize={(text) => text.trim()}
          onCommit={(text) => {
            onCommit(text);
            setValue(text);
          }}
        />
      );
    }
    render(<Trimmed />);
    fireEvent.change(screen.getByLabelText("Serie"), {
      target: { value: "TG " },
    });
    expect(onCommit).toHaveBeenCalledWith("TG");
    expect(screen.getByLabelText("Serie")).toHaveValue("TG ");
  });

  it("rendert auf Wunsch ein mehrzeiliges Feld", () => {
    render(
      <DraftField
        label="Beschreibung"
        value="Zeile"
        multiline
        onCommit={jest.fn()}
      />,
    );
    expect(screen.getByLabelText("Beschreibung").tagName).toBe("TEXTAREA");
  });
});
