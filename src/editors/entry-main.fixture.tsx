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
 * Das Formular eines Eintrags in einem Halter, der Plan und Unterreiter trägt
 * wie der Editor — damit Eingaben nacheinander wirken. Geteilt von den Tests
 * des Formulars.
 */

import * as React from "react";
import { useState } from "react";
import { fireEvent, screen } from "@testing-library/react";

import { Plan } from "../plan-model";
import { FormTab, ItemForm } from "./item-form";
import { findItem, testPlan } from "./test-plan.fixture";

export interface FormHarnessProps {
  id: string;
  initial?: Plan;
  tab?: FormTab;
  onPlanChange?: jest.Mock;
  onDuplicate?: jest.Mock;
  onRemove?: jest.Mock;
}

export function FormHarness({
  id,
  initial = testPlan(),
  tab: initialTab = "general",
  onPlanChange = jest.fn(),
  onDuplicate = jest.fn(),
  onRemove = jest.fn(),
}: FormHarnessProps): React.ReactElement {
  const [plan, setPlan] = useState(initial);
  const [tab, setTab] = useState<FormTab>(initialTab);
  return (
    <ItemForm
      plan={plan}
      item={findItem(plan, id)}
      locale="de-DE"
      onPlanChange={(next) => {
        onPlanChange(next);
        setPlan(next);
      }}
      onDuplicate={onDuplicate}
      onRemove={onRemove}
      tab={tab}
      onTabChange={setTab}
    />
  );
}

export const lastPlan = (spy: jest.Mock): Plan =>
  spy.mock.calls[spy.mock.calls.length - 1][0];

/** Öffnet einen Unterreiter, wie die Redaktion es täte. */
export const openTab = (name: RegExp | string): void => {
  fireEvent.click(screen.getByRole("tab", { name }));
};
