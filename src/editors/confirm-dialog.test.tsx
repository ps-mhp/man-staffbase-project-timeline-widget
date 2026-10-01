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

import { ConfirmDialog } from "./confirm-dialog";

function Harness({
  withChoice = false,
}: {
  withChoice?: boolean;
}): React.ReactElement {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Löschen
      </button>
      {open && (
        <ConfirmDialog
          title="Ebene löschen?"
          confirmLabel="Löschen"
          onConfirm={() => setOpen(false)}
          onCancel={() => setOpen(false)}
          message="Die Ebene ist leer."
        >
          {withChoice && (
            <label>
              <input type="radio" name="choice" /> Verschieben
            </label>
          )}
        </ConfirmDialog>
      )}
    </>
  );
}

const openDialog = (): HTMLElement => {
  const opener = screen.getByRole("button", { name: "Löschen" });
  opener.focus();
  fireEvent.click(opener);
  return opener;
};

describe("ConfirmDialog", () => {
  it("ist ein modaler Dialog mit Namen und Beschreibung", () => {
    render(<Harness />);
    openDialog();
    const dialog = screen.getByRole("dialog", { name: "Ebene löschen?" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAccessibleDescription("Die Ebene ist leer.");
  });

  it("setzt den Fokus auf den harmlosen Knopf, ohne Auswahl im Dialog", () => {
    render(<Harness />);
    openDialog();
    expect(screen.getByRole("button", { name: "Abbrechen" })).toHaveFocus();
  });

  it("setzt den Fokus auf die erste Auswahl, wenn es eine gibt", () => {
    render(<Harness withChoice />);
    openDialog();
    expect(screen.getByRole("radio", { name: "Verschieben" })).toHaveFocus();
  });

  it("schließt mit Esc und gibt den Fokus zurück", () => {
    render(<Harness />);
    const opener = openDialog();
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(opener).toHaveFocus();
  });

  it("hält den Fokus im Dialog", () => {
    render(<Harness />);
    openDialog();
    const dialog = screen.getByRole("dialog");
    const [cancel, confirm] = [
      screen.getByRole("button", { name: "Abbrechen" }),
      screen.getAllByRole("button", { name: "Löschen" })[1],
    ];
    confirm.focus();
    fireEvent.keyDown(dialog, { key: "Tab" });
    expect(cancel).toHaveFocus();
    fireEvent.keyDown(dialog, { key: "Tab", shiftKey: true });
    expect(confirm).toHaveFocus();
  });
});
