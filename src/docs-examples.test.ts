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
import type { DocsManifest } from "@shared/docs/types";

import manifestJson from "../docs/manifest.json";
import { PLAN_ATTRIBUTE, configurationSchema } from "./configuration-schema";
import { examplePlan } from "./example-plan";
import { parsePlan } from "./plan-model";

const manifest = manifestJson as DocsManifest;

const resolve = async (): Promise<Record<string, string>> => {
  const resolver = getDocsExamplesResolver("project-timeline-widget");
  expect(resolver).toBeDefined();
  return resolver!();
};

describe("Live-Beispiel der Dokumentation", () => {
  it("liefert den Beispielplan als Attribut, so wie der Dialog ihn speichert", async () => {
    const attributes = await resolve();
    expect(parsePlan(attributes[PLAN_ATTRIBUTE])).toEqual(examplePlan());
  });

  it("liefert jedes Attribut, das das Manifest auflösen lässt", async () => {
    // Fehlt eines, zeigt die Dokumentation statt des Plans nur den Hinweis
    // „kein Live-Datensatz" — ohne jeden Fehler, an dem man es merkte.
    const attributes = await resolve();
    const examples = manifest.examples ?? [];
    expect(examples.length).toBeGreaterThan(0);
    for (const example of examples) {
      for (const key of example.resolve ?? []) {
        expect(attributes[key]).toEqual(expect.any(String));
      }
    }
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
