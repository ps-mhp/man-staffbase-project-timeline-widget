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
import { render } from "@testing-library/react";

import type { ProjectTimelineProps } from "./project-timeline";

// Die Ansicht entsteht getrennt; geprüft wird hier nur, was der Einstieg aus
// den Attributen macht und an sie weiterreicht.
const mockTimeline = jest.fn((_props: ProjectTimelineProps) => null);
jest.mock("./project-timeline", () => ({
  ProjectTimeline: (props: ProjectTimelineProps) => mockTimeline(props),
}));
// `virtual`, weil der Editor-Injektor parallel entsteht und die Datei beim
// Schreiben dieses Tests noch fehlen kann; greift auch, sobald sie da ist.
jest.mock("./plan-editor-injector", () => ({ startPlanEditorInjector: () => () => undefined }), {
  virtual: true,
});

import { ProjectTimelineWidget } from "./index";
import {
  ALLOW_EXPORT_ATTRIBUTE,
  PLAN_ATTRIBUTE,
  SHOW_TODAY_ATTRIBUTE,
  configurationSchema,
  uiSchema,
} from "./configuration-schema";
import { examplePlan } from "./example-plan";
import { encodePlanAttribute } from "./plan-model";

const ALL_ATTRIBUTES = [PLAN_ATTRIBUTE, SHOW_TODAY_ATTRIBUTE, ALLOW_EXPORT_ATTRIBUTE];

const lastProps = (): ProjectTimelineProps => {
  const calls = mockTimeline.mock.calls;
  return calls[calls.length - 1][0];
};

beforeEach(() => {
  mockTimeline.mockClear();
});

describe("Namen der Attribute", () => {
  it("sind genau die Schlüssel, unter denen der Dialog speichert", () => {
    // Die Wirtsseite schreibt den Wert unter dem Schlüssel des Schemas, und der
    // DOM macht Attributnamen klein. Ein Großbuchstabe hier, und das Widget
    // liest einen Namen, den niemand schreibt — die Konfiguration bliebe stumm
    // weg, ohne Fehlermeldung.
    expect(Object.keys(configurationSchema.properties!)).toEqual(ALL_ATTRIBUTES);
  });

  it("sind durchweg klein geschrieben", () => {
    for (const name of ALL_ATTRIBUTES) {
      expect(name).toBe(name.toLowerCase());
    }
  });

  it("sind auch die Schlüssel, unter denen die Hinweise des Dialogs liegen", () => {
    // Ein Hinweis unter einem Schlüssel, den das Schema nicht kennt, wird still
    // verworfen — die Redaktion verlöre den Hilfetext, ohne dass es auffällt.
    for (const name of Object.keys(uiSchema)) {
      expect(Object.keys(configurationSchema.properties!)).toContain(name);
    }
  });
});

describe("ProjectTimelineWidget", () => {
  it("liest den Plan samt Überschrift aus dem Attribut", () => {
    render(<ProjectTimelineWidget contentLanguage="de_DE" plan={encodePlanAttribute(examplePlan())} />);
    expect(lastProps().plan).toEqual(examplePlan());
    expect(lastProps().plan.title).toBe(examplePlan().title);
  });

  it("reicht Schalter und Sprache weiter", () => {
    render(<ProjectTimelineWidget contentLanguage="en_US" plan="" show-today="false" allow-export="false" />);
    expect(lastProps()).toMatchObject({ showToday: false, allowExport: false, locale: "en-US" });
  });

  it("zeigt Heute-Linie und Export, solange niemand sie abschaltet", () => {
    render(<ProjectTimelineWidget contentLanguage="de_DE" />);
    expect(lastProps()).toMatchObject({ showToday: true, allowExport: true, locale: "de-DE" });
  });

  it("versteht die Schalter auch als echte Wahrheitswerte", () => {
    render(<ProjectTimelineWidget contentLanguage="de_DE" show-today={false} allow-export={true} />);
    expect(lastProps()).toMatchObject({ showToday: false, allowExport: true });
  });

  it("scheitert ohne Attribute nicht, sondern reicht einen leeren Plan weiter", () => {
    render(<ProjectTimelineWidget contentLanguage="de_DE" />);
    expect(lastProps().plan).toMatchObject({ lanes: [], categories: [], items: [] });
  });
});
