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
 * Der Editor in einem Halter, der den Entwurf trägt wie das Modal — damit
 * Eingaben nacheinander wirken — und im Rahmen von `@man/config-ui` sitzt:
 * die Ansicht (Editor, Desktop …) lässt sich vorgeben. Geteilt von den Tests
 * des Editors.
 */

import * as React from "react";
import { useState } from "react";
import { ConfigShellProvider, type ConfigView } from "@man/config-ui";

import { Plan } from "../plan-model";
import { PlanEditorValue } from "../plan-editor-rules";
import { PlanEditor } from "./plan-editor";
import { testPlan } from "./test-plan.fixture";

export interface HarnessProps {
  initial?: PlanEditorValue;
  view?: ConfigView;
  onChange?: jest.Mock;
}

export function Harness({
  initial = { plan: testPlan(), dropped: 0 },
  view = "editor",
  onChange = jest.fn(),
}: HarnessProps): React.ReactElement {
  const [value, setValue] = useState(initial);
  return (
    <ConfigShellProvider value={{ view, setView: () => undefined, preview: true, issuesVisible: false }}>
      <PlanEditor
        value={value}
        onChange={(next) => {
          onChange(next);
          setValue(next);
        }}
      />
    </ConfigShellProvider>
  );
}

export const lastPlan = (spy: jest.Mock): Plan => (spy.mock.calls[spy.mock.calls.length - 1][0] as PlanEditorValue).plan;

export const emptyPlan = (): Plan => ({
  version: 1,
  lanes: [],
  categories: [],
  items: [],
});
