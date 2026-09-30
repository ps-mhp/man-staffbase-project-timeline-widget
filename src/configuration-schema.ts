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

import { UiSchema } from "@rjsf/utils";
import { JSONSchema7 } from "json-schema";

export const PLAN_ATTRIBUTE = "plan";
export const SHOW_TODAY_ATTRIBUTE = "show-today";
export const ALLOW_EXPORT_ATTRIBUTE = "allow-export";

/**
 * Das Schema des Konfigurationsdialogs.
 *
 * `plan` steht als gewöhnliches Textfeld, obwohl es niemand von Hand
 * ausfüllen soll: Staffbase rendert den Dialog selbst und kennt nur die
 * Feldtypen von RJSF. Der Plan-Editor tritt zur Laufzeit an seine Stelle
 * (`plan-editor-injector.ts`). Fällt er aus, bleibt das Textfeld sichtbar und
 * die Konfiguration damit reparierbar statt unerreichbar.
 *
 * Heute-Linie und Export steuern nur die Darstellung und sind deshalb echte
 * Felder des Dialogs, nicht Teil des Plans — bedienbar auch dann, wenn der
 * Editor einmal nicht greift.
 *
 * Die Überschrift dagegen steht im Plan (`plan.title`), nicht in einem
 * eigenen Attribut: `title` ist ein globales HTML-Attribut, am Element des
 * Bausteins zeigte der Browser es als Tooltip über dem ganzen Plan. Und die
 * Übersetzung kennt je Tag nur einen Provider für ein Attribut — im Plan
 * reist die Überschrift mit dessen übrigem Text.
 *
 * @see https://rjsf-team.github.io/react-jsonschema-form/docs/
 */
export const configurationSchema: JSONSchema7 = {
  properties: {
    [PLAN_ATTRIBUTE]: {
      type: "string",
      title: "Plan",
      default: "",
    },
    [SHOW_TODAY_ATTRIBUTE]: {
      type: "boolean",
      title: "Heute-Linie zeigen",
      default: true,
    },
    [ALLOW_EXPORT_ATTRIBUTE]: {
      type: "boolean",
      title: "Excel-Export anbieten",
      default: true,
    },
  },
};

/**
 * @see https://rjsf-team.github.io/react-jsonschema-form/docs/api-reference/uiSchema
 */
export const uiSchema: UiSchema = {
  [PLAN_ATTRIBUTE]: {
    "ui:help":
      "Überschrift, Ebenen, Kategorien und Einträge des Plans. Der Plan-Editor öffnet sich von selbst; " +
      "das Textfeld dahinter ist die Rohfassung und muss nicht angefasst werden.",
  },
  [SHOW_TODAY_ATTRIBUTE]: {
    "ui:help":
      "Eine dunkle senkrechte Linie markiert den heutigen Tag, sofern er im sichtbaren Zeitraum liegt. " +
      "Abschalten, wenn der Plan abgeschlossen ist und „Heute“ nichts mehr aussagt.",
  },
  [ALLOW_EXPORT_ATTRIBUTE]: {
    "ui:help":
      "Leser:innen können die Einträge als Excel-Tabelle herunterladen — " +
      "wahlweise die aktuelle Ansicht oder den ganzen Plan. " +
      "Abschalten, wenn der Plan die Seite nicht verlassen soll.",
  },
};

/**
 * Liest einen Schalter des Dialogs.
 *
 * Staffbase liefert Wahrheitswerte je nach Weg als Zeichenkette („true",
 * „false") oder — über `parseAttributes` — als echten `boolean`. Nur diese
 * vier Werte zählen; alles andere, auch ein fehlendes Attribut, bedeutet die
 * Vorgabe. So kippt ein leeres oder veraltetes Attribut keinen Schalter, der
 * vorab an ist.
 */
export function readBooleanAttribute(raw: unknown, fallback: boolean): boolean {
  if (raw === true || raw === "true") return true;
  if (raw === false || raw === "false") return false;
  return fallback;
}
