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
 * Eine Attrappe des Zeitstrahls für die Tests des Editors. Der echte misst
 * Breiten, die jsdom nicht kennt; die Attrappe zeigt, was der Editor ihr
 * gibt, und meldet wie er: eine Auswahl und einen Ausschnitt.
 *
 * Einbinden mit
 * `jest.mock("../project-timeline", () => jest.requireActual("./project-timeline.mock"))`.
 */

import * as React from "react";
import { ReactElement } from "react";

import { dayFromParts } from "../calendar";
import { ProjectTimelineProps } from "../project-timeline";

/** Was der Editor zuletzt übergeben hat. */
export const mockTimelineProps: { current: ProjectTimelineProps | null } = {
  current: null,
};

export function ProjectTimeline(props: ProjectTimelineProps): ReactElement {
  mockTimelineProps.current = props;
  return (
    <div data-testid="timeline">
      <button type="button" onClick={() => props.onSelectItem?.("m1")}>
        Vorschau: Bauma wählen
      </button>
      <button
        type="button"
        onClick={() =>
          props.onViewportChange?.({
            start: dayFromParts(2025, 1, 1),
            end: dayFromParts(2026, 1, 1),
          })
        }
      >
        Vorschau: Ausschnitt 2025
      </button>
    </div>
  );
}
