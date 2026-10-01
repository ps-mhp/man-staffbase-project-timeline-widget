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

import "./docs-examples";
import { getDocsExamplesResolver } from "@shared/docs/register-docs-examples";
import type { DocsExample, DocsManifest } from "@shared/docs/types";

import manifestJson from "../docs/manifest.json";
import { PLAN_ATTRIBUTE, configurationSchema } from "./configuration-schema";
import { examplePlan } from "./example-plan";
import { parsePlan } from "./plan-model";
import { PLAN_TEMPLATES, findTemplate } from "./plan-templates";

const manifest = manifestJson as DocsManifest;

const resolve = async (example?: DocsExample): Promise<Record<string, string>> => {
  const resolver = getDocsExamplesResolver("project-timeline-widget");
  expect(resolver).toBeDefined();
  return resolver!(example);
};

describe("Live-Beispiel der Dokumentation", () => {
  it("liefert den Beispielplan als Attribut, so wie der Dialog ihn speichert", async () => {
    const attributes = await resolve();
    expect(parsePlan(attributes[PLAN_ATTRIBUTE])).toEqual(examplePlan());
  });

  it.each(PLAN_TEMPLATES.map((template) => [template.id, template] as const))(
    "liefert für die Variante „%s“ den Plan dieser Vorlage",
    async (id, template) => {
      const attributes = await resolve({ title: "", attributes: {}, resolve: [PLAN_ATTRIBUTE], variant: id });
      expect(parsePlan(attributes[PLAN_ATTRIBUTE])).toEqual(template.create());
    },
  );

  it("fällt bei unbekannter Variante auf den Beispielplan zurück", async () => {
    // Ein älteres Dokumentations-Widget reicht gar kein Beispiel durch; ein
    // Tippfehler im Manifest soll ebenso einen Plan zeigen statt keinen.
    const attributes = await resolve({ title: "", attributes: {}, variant: "gibt-es-nicht" });
    expect(parsePlan(attributes[PLAN_ATTRIBUTE])).toEqual(examplePlan());
  });

  it("liefert jedes Attribut, das das Manifest auflösen lässt", async () => {
    // Fehlt eines, zeigt die Dokumentation statt des Plans nur den Hinweis
    // „kein Live-Datensatz" — ohne jeden Fehler, an dem man es merkte.
    const examples = manifest.examples ?? [];
    expect(examples.length).toBeGreaterThan(0);
    for (const example of examples) {
      const attributes = await resolve(example);
      for (const key of example.resolve ?? []) {
        expect(attributes[key]).toEqual(expect.any(String));
      }
    }
  });

  it("nennt als Variante nur Vorlagen, die es gibt — und zeigt jede außer der ersten", () => {
    // Ein Tippfehler fiele sonst nicht auf: die Dokumentation zeigte still
    // den Beispielplan unter dem Titel der gemeinten Vorlage.
    const variants = (manifest.examples ?? []).map((example) => example.variant).filter((variant) => variant !== undefined);
    for (const variant of variants) {
      expect(findTemplate(variant)).toBeDefined();
    }
    expect(new Set(variants)).toEqual(new Set(PLAN_TEMPLATES.slice(1).map((template) => template.id)));
  });

  it("setzt in den Beispielen nur Attribute, die das Widget kennt", () => {
    const known = Object.keys(configurationSchema.properties ?? {});
    for (const example of manifest.examples ?? []) {
      for (const key of [...Object.keys(example.attributes), ...(example.resolve ?? [])]) {
        expect(known).toContain(key);
      }
    }
  });
});
