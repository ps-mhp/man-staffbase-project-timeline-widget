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

import { setPublicPathFromBundle } from "@shared/public-path";

// Muss vor jedem dynamischen `import()` laufen, damit nachgeladene Teile —
// hier ExcelJS für den Export — von dem CDN kommen, von dem das Bundle
// stammt, und nicht von der Wirtsseite.
setPublicPathFromBundle("project-timeline-widget.js");
import React, { ReactElement } from "react";
import ReactDOM from "react-dom/client";

import {
  BlockAttributes,
  BlockFactory,
  BlockDefinition,
  ExternalBlockDefinition,
  BaseBlock,
} from "widget-sdk";
import { startWidget } from "@shared/dev-mode/start-widget";
import { getTranslationRegistry } from "@shared/translation/registry";
import {
  ALLOW_EXPORT_ATTRIBUTE,
  PLAN_ATTRIBUTE,
  SHOW_TODAY_ATTRIBUTE,
  configurationSchema,
  readBooleanAttribute,
  uiSchema,
} from "./configuration-schema";
import { intlLocale } from "./format";
import { parsePlan } from "./plan-model";
import { startPlanEditorInjector } from "./plan-editor-injector";
import { ProjectTimeline } from "./project-timeline";
import { PROJECT_TIMELINE_TAG, planTranslationProvider } from "./translation-provider";
import icon from "../resources/project-timeline-widget.svg";
import pkg from "../package.json";

/**
 * Die Attribute, wie `parseAttributes` sie liefert. Die Namen tragen
 * Bindestriche, wie im Schema. Die Schalter sind bewusst weit getypt: das
 * SDK wandelt „true" in `true` — gelesen wird deshalb über
 * `readBooleanAttribute`, nie direkt.
 */
export type ProjectTimelineWidgetProps = BlockAttributes & {
  [PLAN_ATTRIBUTE]?: string;
  [SHOW_TODAY_ATTRIBUTE]?: string | boolean;
  [ALLOW_EXPORT_ATTRIBUTE]?: string | boolean;
};

/**
 * Die Leseansicht, aus den Attributen gespeist. Die Überschrift steht im Plan
 * (`plan.title`), nicht in einem eigenen Attribut — siehe `configuration-schema.ts`.
 */
export const ProjectTimelineWidget = (props: ProjectTimelineWidgetProps): ReactElement => {
  const rawPlan = props[PLAN_ATTRIBUTE];
  return (
    <ProjectTimeline
      plan={parsePlan(typeof rawPlan === "string" ? rawPlan : "")}
      showToday={readBooleanAttribute(props[SHOW_TODAY_ATTRIBUTE], true)}
      allowExport={readBooleanAttribute(props[ALLOW_EXPORT_ATTRIBUTE], true)}
      locale={intlLocale(props.contentLanguage)}
    />
  );
};

/** Attribute aus den gleichen Konstanten wie das Konfigurationsschema, um
 *  Abweichungen zu vermeiden: Ein Tippfehler würde sonst zur Laufzeit zu einem
 *  stumm leeren Attribut führen. */
const widgetAttributes: string[] = [PLAN_ATTRIBUTE, SHOW_TODAY_ATTRIBUTE, ALLOW_EXPORT_ATTRIBUTE];

const factory: BlockFactory = (BaseBlockClass, _widgetApi) => {
  return class ProjectTimelineWidgetBlock extends BaseBlockClass implements BaseBlock {
    private _root: ReactDOM.Root | null = null;

    private get props(): ProjectTimelineWidgetProps {
      const attrs = this.parseAttributes<ProjectTimelineWidgetProps>();
      // Die Sprache steht nicht in den Attributen, sondern am Block selbst.
      // Ohne sie stünden Monatsnamen und Termine immer auf Deutsch.
      return { ...attrs, contentLanguage: this.contentLanguage };
    }

    public renderBlock(container: HTMLElement): void {
      this._root ??= ReactDOM.createRoot(container);
      this._root.render(<ProjectTimelineWidget {...this.props} />);
    }

    public unmountBlock(_container: HTMLElement): void {
      this._root?.unmount();
      this._root = null;
    }

    public static get observedAttributes(): string[] {
      return widgetAttributes;
    }

    public attributeChangedCallback(...args: [string, string | undefined, string | undefined]): void {
      super.attributeChangedCallback.apply(this, args);
    }
  };
};

const blockDefinition: BlockDefinition = {
  name: PROJECT_TIMELINE_TAG,
  factory: factory,
  attributes: widgetAttributes,
  blockLevel: "block",
  configurationSchema: configurationSchema,
  uiSchema: uiSchema,
  label: "Projektplan",
  iconUrl: icon,
};

const externalBlockDefinition: ExternalBlockDefinition = {
  blockDefinition,
  author: pkg.author,
  version: pkg.version,
};

/**
 * Meldet den Baustein bei der Wirtsseite an.
 *
 * Der Weg über `startWidget` fragt zuerst, ob ein lokaler
 * Entwicklungsserver dieses Widget ausliefert. In fast jedem Browser lautet
 * die Antwort nein, und es wird sofort angemeldet; auf dem Rechner der
 * Entwicklung übernimmt das lokale Bundle und meldet an seiner Stelle an.
 * Immer nur eines von beiden — ein Bausteinname lässt sich nicht zweimal
 * belegen.
 *
 * Die Abfrage davor lässt das Modul in Jest laden, wo es keine Wirtsseite
 * gibt: ohne sie bräche schon der bloße Import der Datei jeden Test.
 *
 * Editor und Übersetzung hängen am Anmelden, nicht am Laden. Auf Modulebene
 * gestartet belegte der Beobachter des installierten Bundles das `plan`-Feld,
 * bevor es überhaupt fragte, ob ein lokaler Server übernimmt — der
 * Entwicklungsmodus lieferte dann die Ansicht, aber den Editor der
 * veröffentlichten Fassung. Live nachgewiesen am 02.09.2026 im
 * Hero-Slider-Widget.
 */
if (typeof window.defineBlock === "function") {
  void startWidget({
    name: PROJECT_TIMELINE_TAG,
    version: pkg.version,
    register: () => {
      startPlanEditorInjector();
      getTranslationRegistry().register(planTranslationProvider);
      window.defineBlock(externalBlockDefinition);
    },
  });
}
