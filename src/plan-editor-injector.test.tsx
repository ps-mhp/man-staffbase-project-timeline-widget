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


/**
 * Der Plan-Editor im gemeinsamen Rahmen von `@man/config-ui`: Kopf, Status,
 * Übernehmen und Rückfrage kommen vom Rahmen, die Prüfung und die Hilfe vom
 * Widget. Geprüft wird vor allem, dass alte Blöcke unberührt bleiben: Öffnen
 * und Übernehmen ändern das Feld nicht, und die alten Schalter des Dialogs
 * sind ausgeblendet, ihre Werte aber gelesen.
 */

import * as React from "react";
import { act, render } from "@testing-library/react";
import Form from "@rjsf/mui";
import validator from "@rjsf/validator-ajv8";
import { JSONSchema7 } from "json-schema";

import { modalRoot, clickElement, settleEditor } from "@shared/ui/config-modal.testing";

import { examplePlan } from "./example-plan";
import { encodePlanAttribute, parsePlan } from "./plan-model";
import { planEditorShell, startPlanEditorInjector } from "./plan-editor-injector";
import { PlanEditorValue } from "./plan-editor-rules";

const EDITOR_SELECTOR = '[data-testid="plan-editor"]';
const EDITOR_ROUNDS = 6;

jest.mock("./project-timeline", () => jest.requireActual("./editors/project-timeline.mock"));

const schema: JSONSchema7 = {
  properties: {
    plan: { type: "string", title: "Plan" },
    "show-today": { type: "boolean", title: "Heute-Linie zeigen", default: true },
    "allow-export": { type: "boolean", title: "Excel-Export anbieten", default: true },
  },
};

const field = (container: HTMLElement): HTMLInputElement => container.querySelector<HTMLInputElement>("#root_plan")!;

async function open(
  plan: string,
  flags: Record<string, boolean> = {},
): Promise<{ container: HTMLElement; stop: () => void }> {
  const { container } = render(<Form schema={schema} validator={validator} formData={{ plan, ...flags }} />);
  let stop = (): void => {};
  await act(async () => {
    stop = startPlanEditorInjector(container);
  });
  await settleEditor(EDITOR_SELECTOR, EDITOR_ROUNDS);
  return { container, stop };
}

const inModal = (selector: string): HTMLElement | null => modalRoot()?.querySelector<HTMLElement>(selector) ?? null;

/** Steht die Zeile des Feldes verborgen? Irgendein Vorfahr bis zum Formular trägt `display: none`. */
function isHidden(container: HTMLElement, key: string): boolean {
  let node: HTMLElement | null = container.querySelector<HTMLElement>(`#root_${key}`);
  while (node !== null && node.tagName !== "FORM") {
    if (node.style.display === "none") return true;
    node = node.parentElement;
  }
  return false;
}

describe("startPlanEditorInjector", () => {
  it("öffnet den Editor im gemeinsamen Rahmen mit Vorschau-Umschalter", async () => {
    const { stop } = await open(encodePlanAttribute(examplePlan()));

    expect(modalRoot()!.textContent).toContain("Projektplan");
    expect(modalRoot()!.querySelector("h1")).toHaveTextContent("Plan bearbeiten");
    expect(inModal('[data-testid="plan-editor"]')).not.toBeNull();
    expect(inModal('[role="grid"][aria-label="Einträge"]')).not.toBeNull();
    expect(inModal('[aria-label="Ansicht"]')).not.toBeNull();

    await act(async () => stop());
  });

  it("lässt das Feld beim Öffnen und Übernehmen ohne Änderung, wie es war", async () => {
    const raw = encodePlanAttribute(examplePlan());
    const { container, stop } = await open(raw);

    await clickElement(inModal('[data-testid="config-shell-apply"]'));

    expect(field(container).value).toBe(raw);

    await act(async () => stop());
  });

  it("schreibt nach dem Umlegen der Heute-Linie den Schalter in den Plan — und sonst nichts Neues", async () => {
    const raw = encodePlanAttribute(examplePlan());
    const { container, stop } = await open(raw);

    await clickElement(inModal('[role="switch"][aria-labelledby]:not([aria-checked="false"])'));
    await clickElement(inModal('[data-testid="config-shell-apply"]'));

    const written = parsePlan(field(container).value);
    expect(written.showToday).toBe(false);
    expect(written).not.toHaveProperty("allowExport");
    expect(written.items).toEqual(examplePlan().items);

    await act(async () => stop());
  });

  it("zeigt die Schalter so, wie die alten Felder des Dialogs sie trugen", async () => {
    const { stop } = await open(encodePlanAttribute(examplePlan()), { "show-today": false, "allow-export": true });

    const switches = Array.from(modalRoot()!.querySelectorAll<HTMLElement>('[role="switch"]'));
    // Zuerst „Vorläufig“ des Eintrags, dann Heute-Linie und Export des Plans.
    expect(switches.map((entry) => entry.getAttribute("aria-checked"))).toEqual(["false", "false", "true"]);

    await act(async () => stop());
  });

  it("blendet die alten Schalter im Dialog aus, solange der Editor da ist", async () => {
    const { container, stop } = await open(encodePlanAttribute(examplePlan()));

    expect(isHidden(container, "show-today")).toBe(true);
    expect(isHidden(container, "allow-export")).toBe(true);
    expect(isHidden(container, "plan")).toBe(true);

    await act(async () => stop());
    expect(isHidden(container, "show-today")).toBe(false);
  });
});

describe("planEditorShell", () => {
  const value = (plan = examplePlan()): PlanEditorValue => ({ plan, dropped: 0 });

  it("prüft, dass jeder Eintrag seine Ebene hat", () => {
    const plan = examplePlan();
    const broken = { ...plan, lanes: plan.lanes.slice(1) };
    const issues = planEditorShell.validate?.(value(broken)) ?? [];
    expect(issues.length).toBeGreaterThan(0);
    expect(issues[0].message).toMatch(/Die Ebene fehlt/);
    expect(planEditorShell.validate?.(value())).toEqual([]);
  });

  it("zählt im Status, was sich gegenüber dem übernommenen Stand geändert hat", () => {
    const plan = examplePlan();
    const [first, ...rest] = plan.items;
    const edited = { ...plan, items: [{ ...first, title: "Anders" }, ...rest], showToday: false };
    expect(planEditorShell.statusText?.(value(edited), value(plan))).toBe("1 Eintrag geändert · Einstellungen");
    expect(planEditorShell.statusText?.(value(plan), value(plan))).toBeUndefined();
  });

  it("erklärt in der Hilfe Liste, Formular, Panel und Vorschau", () => {
    const { container } = render(<>{planEditorShell.help}</>);
    expect(container).toHaveTextContent("Einträge");
    expect(container).toHaveTextContent("Allgemein");
    expect(container).toHaveTextContent("Ebenen");
    expect(container).toHaveTextContent("Desktop");
  });
});
