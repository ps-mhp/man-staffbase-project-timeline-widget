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

import { isValidElement } from "react";

import { FieldModalInjectorOptions } from "@shared/config-modal";

import { examplePlan } from "./example-plan";
import { PlanEditor } from "./editors/plan-editor";
import { encodePlanAttribute } from "./plan-model";
import { PlanEditorValue, startPlanEditorInjector } from "./plan-editor-injector";

const mockStart = jest.fn((_options: unknown) => () => undefined);
jest.mock("@shared/config-modal", () => ({
  startFieldModalInjector: (options: unknown) => mockStart(options),
}));
// Der Editor selbst zählt hier nicht; nur, dass er es ist, der gerendert wird.
jest.mock("./editors/plan-editor", () => ({ PlanEditor: () => null }));

const options = (): FieldModalInjectorOptions<PlanEditorValue> => {
  startPlanEditorInjector();
  return mockStart.mock.calls[mockStart.mock.calls.length - 1][0] as FieldModalInjectorOptions<PlanEditorValue>;
};

afterEach(() => mockStart.mockClear());

describe("startPlanEditorInjector", () => {
  it("setzt den Editor an die Stelle des Felds `plan`", () => {
    expect(options()).toMatchObject({
      fieldKey: "plan",
      reopenLabel: "Plan bearbeiten …",
      modalTestId: "plan-editor-modal",
      reopenTestId: "plan-editor-reopen",
    });
    expect(options().panelStyle?.maxWidth).toBe("1280px");
  });

  it("gibt die Aufräumfunktion des Injektors zurück", () => {
    const stop = jest.fn();
    mockStart.mockReturnValueOnce(stop);
    expect(startPlanEditorInjector()).toBe(stop);
  });

  it("liest das Attribut samt der Zahl verworfener Einträge", () => {
    const raw = JSON.stringify({ ...examplePlan(), items: [...examplePlan().items, { id: "x", kind: "unbekannt" }] });
    const value = options().parse(raw);
    expect(value.plan.items).toHaveLength(examplePlan().items.length);
    expect(value.dropped).toBe(1);
  });

  it("schreibt nur den Plan, verpackt", () => {
    const plan = examplePlan();
    expect(options().serialize({ plan, dropped: 3 })).toBe(encodePlanAttribute(plan));
  });

  it("rendert den Plan-Editor", () => {
    const element = options().render({
      value: { plan: examplePlan(), dropped: 0 },
      onChange: jest.fn(),
      onSave: jest.fn(),
      onClose: jest.fn(),
      dirty: false,
    });
    expect(isValidElement(element) && element.type).toBe(PlanEditor);
  });
});
