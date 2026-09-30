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

import { isPayload } from "@shared/payload";

import { PLAN_ATTRIBUTE } from "./configuration-schema";
import { examplePlan } from "./example-plan";
import { emptyPlan, encodePlanAttribute, parsePlan } from "./plan-model";
import { planTranslationProvider as provider } from "./translation-provider";

const plan = examplePlan();
const stored = encodePlanAttribute(plan);

describe("planTranslationProvider", () => {
  it("zeigt auf das Attribut, in dem der Plan wirklich steht", () => {
    expect(provider.ref).toEqual({ tagName: "project-timeline-widget", attribute: PLAN_ATTRIBUTE });
  });

  it("macht aus dem gespeicherten Wert Markup, das der Dienst übersetzt", () => {
    const html = provider.toTranslatable(stored) as string;
    expect(html).toContain("Launches / SOPs");
    expect(provider.acceptsTranslated(html)).toBe(true);
  });

  it("überspringt ein Widget ohne Attribut", () => {
    expect(provider.toTranslatable(null)).toBeNull();
  });

  it("überspringt einen leeren Plan", () => {
    expect(provider.toTranslatable(encodePlanAttribute(emptyPlan()))).toBeNull();
    expect(provider.toTranslatable("")).toBeNull();
  });

  it("schreibt den übersetzten Text zurück und lässt Termine, Farben und Serien stehen", () => {
    const html = provider.toTranslatable(stored) as string;
    const answer = html
      .replace("Launches / SOPs", "Launches and SOPs")
      .replace(">Messen<", ">Fairs<")
      .replace(`>${plan.title}<`, ">Sales Truck Launch EN<");

    const next = parsePlan(provider.fromTranslated(answer, stored) as string);

    expect(next.title).toBe("Sales Truck Launch EN");
    expect(next.lanes.map((lane) => lane.title)).toEqual(["Fairs", "Launches and SOPs", "Projekt-Meilensteine"]);
    expect(next.categories).toEqual(plan.categories);
    expect(next.items).toEqual(plan.items);
    expect(next.view).toEqual(plan.view);
    expect(next.updatedAt).toBe(plan.updatedAt);
  });

  it("schreibt verpackt zurück, weil der Rückweg den Wert unmaskiert ins Tag setzt", () => {
    const html = provider.toTranslatable(stored) as string;
    expect(isPayload(provider.fromTranslated(html, stored) as string)).toBe(true);
  });

  it("lässt den Plan im Rundlauf unverändert, wenn nichts übersetzt wurde", () => {
    const html = provider.toTranslatable(stored) as string;
    expect(parsePlan(provider.fromTranslated(html, stored) as string)).toEqual(plan);
  });

  it("schreibt nichts, wenn es kein gespeichertes Attribut gab", () => {
    expect(provider.fromTranslated("<p></p>", null)).toBeNull();
  });

  it("weist eine Antwort ab, die nicht von dieser Anfrage stammt", () => {
    expect(provider.acceptsTranslated("<p>Ein Artikel</p>")).toBe(false);
  });
});
