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
import { useRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";

import { Splitter } from "./splitter";
import { useSplitSize } from "./use-split-size";

const KEY = "project-timeline-widget:editor:test-height";

/** Ein Bereich, der sich 800 px mit einem anderen teilt; der andere behält 220. */
function Harness({
  available = 800,
}: {
  available?: number | null;
}): React.ReactElement {
  const ref = useRef<HTMLDivElement>(null);
  const split = useSplitSize({
    storageKey: "test-height",
    fallback: () => 300,
    min: 160,
    reserve: 220,
    observe: ref,
    measure: () => available,
  });
  return (
    <div ref={ref}>
      <div id="bereich" style={{ height: split.size }} data-testid="bereich" />
      <Splitter
        orientation="horizontal"
        label="Höhe der Vorschau ändern"
        controls="bereich"
        split={split}
      />
    </div>
  );
}

const handle = (): HTMLElement =>
  screen.getByRole("separator", { name: "Höhe der Vorschau ändern" });

afterEach(() => window.localStorage.clear());

describe("Splitter", () => {
  it("ist ein fokussierbarer Trenner mit Wert und Grenzen", () => {
    render(<Harness />);
    expect(handle()).toHaveAttribute("tabindex", "0");
    expect(handle()).toHaveAttribute("aria-orientation", "horizontal");
    expect(handle()).toHaveAttribute("aria-controls", "bereich");
    expect(handle()).toHaveAttribute("aria-valuenow", "300");
    expect(handle()).toHaveAttribute("aria-valuemin", "160");
    expect(handle()).toHaveAttribute("aria-valuemax", "580");
  });

  it.each([
    [{ key: "ArrowDown" }, "316"],
    [{ key: "ArrowUp" }, "284"],
    [{ key: "ArrowUp", shiftKey: true }, "236"],
    [{ key: "Home" }, "160"],
    [{ key: "End" }, "580"],
  ])("verstellt mit der Tastatur: %p → %s", (init, expected) => {
    render(<Harness />);
    fireEvent.keyDown(handle(), init);
    expect(handle()).toHaveAttribute("aria-valuenow", expected);
    expect(screen.getByTestId("bereich").style.height).toBe(`${expected}px`);
  });

  it("folgt dem Zeiger und hört beim Loslassen auf", () => {
    render(<Harness />);
    fireEvent.pointerDown(handle(), { clientY: 100, button: 0 });
    fireEvent.pointerMove(handle(), { clientY: 150 });
    expect(handle()).toHaveAttribute("aria-valuenow", "350");
    fireEvent.pointerUp(handle(), { clientY: 150 });
    fireEvent.pointerMove(handle(), { clientY: 400 });
    expect(handle()).toHaveAttribute("aria-valuenow", "350");
  });

  it("klemmt beim Ziehen an die Grenzen", () => {
    render(<Harness />);
    fireEvent.pointerDown(handle(), { clientY: 100, button: 0 });
    fireEvent.pointerMove(handle(), { clientY: 900 });
    expect(handle()).toHaveAttribute("aria-valuenow", "580");
    fireEvent.pointerMove(handle(), { clientY: -500 });
    expect(handle()).toHaveAttribute("aria-valuenow", "160");
  });

  it("merkt sich die Größe im Browser und nimmt sie beim nächsten Mal", () => {
    const { unmount } = render(<Harness />);
    fireEvent.keyDown(handle(), { key: "ArrowDown" });
    expect(window.localStorage.getItem(KEY)).toBe("316");
    unmount();
    render(<Harness />);
    expect(handle()).toHaveAttribute("aria-valuenow", "316");
  });

  it("stellt per Doppelklick die Vorgabe wieder her und vergisst die gemerkte Größe", () => {
    window.localStorage.setItem(KEY, "400");
    render(<Harness />);
    expect(handle()).toHaveAttribute("aria-valuenow", "400");
    fireEvent.doubleClick(handle());
    expect(handle()).toHaveAttribute("aria-valuenow", "300");
    expect(window.localStorage.getItem(KEY)).toBeNull();
  });

  it("klemmt eine gemerkte Größe, die nicht mehr passt", () => {
    window.localStorage.setItem(KEY, "700");
    render(<Harness available={600} />);
    expect(handle()).toHaveAttribute("aria-valuenow", "380");
  });

  it("klemmt nicht, solange der Platz unbekannt ist", () => {
    render(<Harness available={null} />);
    fireEvent.keyDown(handle(), { key: "ArrowDown", shiftKey: true });
    expect(handle()).toHaveAttribute("aria-valuenow", "364");
  });
});
