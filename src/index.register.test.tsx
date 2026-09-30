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

import type { BlockDefinition, ExternalBlockDefinition } from "widget-sdk";

import type { ProjectTimelineProps } from "./project-timeline";

const mockStartWidget = jest.fn().mockResolvedValue(undefined);
const mockStartInjector = jest.fn(() => () => undefined);
const mockRegisterTranslation = jest.fn(() => () => undefined);
const mockTimeline = jest.fn((_props: ProjectTimelineProps) => null);

jest.mock("@shared/dev-mode/start-widget", () => ({ startWidget: mockStartWidget }));
jest.mock("@shared/translation/registry", () => ({
  getTranslationRegistry: () => ({ register: mockRegisterTranslation }),
}));
// `virtual`, weil der Editor-Injektor parallel entsteht und die Datei beim
// Schreiben dieses Tests noch fehlen kann; greift auch, sobald sie da ist.
jest.mock("./plan-editor-injector", () => ({ startPlanEditorInjector: mockStartInjector }), { virtual: true });
jest.mock("./project-timeline", () => ({
  ProjectTimeline: (props: ProjectTimelineProps) => mockTimeline(props),
}));

interface Host {
  defineBlock: jest.Mock;
}

/** Lädt das Modul frisch und löst die Anmeldung aus, wie es `startWidget` täte. */
async function loadAndRegister(): Promise<{ host: Host; definition: BlockDefinition }> {
  const host = window as unknown as Host;
  host.defineBlock = jest.fn();
  mockStartWidget.mockClear();
  mockStartInjector.mockClear();
  mockRegisterTranslation.mockClear();

  jest.resetModules();
  await import("./index");

  expect(mockStartInjector).not.toHaveBeenCalled();
  expect(mockRegisterTranslation).not.toHaveBeenCalled();

  const options = mockStartWidget.mock.calls[0][0] as { name: string; register: () => void };
  expect(options.name).toBe("project-timeline-widget");
  options.register();

  const external = host.defineBlock.mock.calls[0][0] as ExternalBlockDefinition;
  return { host, definition: external.blockDefinition };
}

describe("Anmeldung des Widgets", () => {
  it("startet Editor und Übersetzung erst beim Anmelden, nicht schon beim Laden des Moduls", async () => {
    // Auf Modulebene gestartet belegte der Beobachter des installierten
    // Bundles das Feld, bevor überhaupt gefragt war, ob ein lokaler Server
    // übernimmt -- der Entwicklungsmodus lieferte dann die Ansicht, aber den
    // Editor der veröffentlichten Fassung. Live nachgewiesen am 02.09.2026 im
    // Hero-Slider-Widget.
    const { host } = await loadAndRegister();

    expect(mockStartInjector).toHaveBeenCalledTimes(1);
    expect(mockRegisterTranslation).toHaveBeenCalledWith(
      expect.objectContaining({ id: "project-timeline-widget/plan" }),
    );
    expect(host.defineBlock).toHaveBeenCalledTimes(1);
  });

  it("meldet den Baustein unter seinem Namen, mit Label und allen Attributen an", async () => {
    const { definition } = await loadAndRegister();

    expect(definition).toMatchObject({
      name: "project-timeline-widget",
      label: "Projektplan",
      blockLevel: "block",
      attributes: ["plan", "show-today", "allow-export"],
    });
  });

  it("gibt dem Element die Sprache der Seite mit, die nicht in den Attributen steht", async () => {
    const { definition } = await loadAndRegister();

    // Ein Stellvertreter der Basisklasse des SDK: liefert die Attribute so,
    // wie `parseAttributes` sie liefert — Wahrheitswerte schon umgewandelt.
    class FakeBase extends HTMLElement {
      public contentLanguage = "fr_FR";
      public parseAttributes(): Record<string, unknown> {
        return { "show-today": false };
      }
      public attributeChangedCallback(): void {}
    }
    const Block = definition.factory(
      FakeBase as unknown as Parameters<BlockDefinition["factory"]>[0],
      {} as Parameters<BlockDefinition["factory"]>[1],
    );
    customElements.define("project-timeline-probe", Block);
    const element = new Block() as HTMLElement & { renderBlock(container: HTMLElement): void };

    // `act` aus der React-Instanz, die das frisch geladene Modul benutzt: nach
    // `jest.resetModules()` ist das nicht mehr die von Testing Library.
    const { act } = await import("react");
    const container = document.createElement("div");
    await act(async () => element.renderBlock(container));

    expect(mockTimeline).toHaveBeenLastCalledWith(
      expect.objectContaining({ locale: "fr-FR", showToday: false, allowExport: true }),
    );
    expect((Block as unknown as { observedAttributes: string[] }).observedAttributes).toEqual(definition.attributes);
  });
});
