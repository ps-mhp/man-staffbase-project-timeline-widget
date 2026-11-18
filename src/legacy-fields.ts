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
 * Die Schalter älterer Fassungen im Staffbase-Dialog: lesen und ausblenden.
 *
 * `show-today` und `allow-export` bleiben im Schema, damit der Dialog ihre
 * Werte weiter führt und alte Blöcke sie behalten. Zu sehen sollen sie nicht
 * mehr sein: der Vollbild-Editor pflegt beide im Plan, und zwei Wege zum
 * selben Wert laden zu Widersprüchen ein.
 *
 * Gefunden wird jedes Feld über das, was RJSF und der Content Designer gleich
 * vergeben: `id="root_<key>"` am Eingabeelement oder `for="root_<key>"` an
 * seiner Beschriftung. Ausgeblendet wird die ganze Zeile: der größte Vorfahre,
 * der kein anderes Feld enthält.
 *
 * Nur im eigenen Dialog, dem Formular, das das Feld `plan` führt: Studio lädt
 * alle Widget-Bündel in dasselbe Dokument, und `root_<key>` ist
 * widgetübergreifend — `allow-export` hat auch ein anderes Widget.
 */

import { configFieldSelector } from "@shared/config-field-injector";

import { LEGACY_ATTRIBUTES, PLAN_ATTRIBUTE } from "./configuration-schema";

/** Was der Editor von den alten Feldern lesen konnte; fehlt ein Schlüssel, war das Feld nicht lesbar. */
export interface LegacyFlags {
  showToday?: boolean;
  allowExport?: boolean;
}

const FIELD_MARK = '[id^="root_"], label[for^="root_"]';

const fieldKeyOf = (element: Element): string => (element instanceof HTMLLabelElement ? element.htmlFor : element.id);

function rowOf(anchor: Element): HTMLElement {
  const key = fieldKeyOf(anchor);
  let row = anchor as HTMLElement;
  while (row.parentElement !== null && row.parentElement.tagName !== "FORM") {
    const parent = row.parentElement;
    const foreign = Array.from(parent.querySelectorAll(FIELD_MARK)).some((node) => fieldKeyOf(node) !== key);
    if (foreign) break;
    row = parent;
  }
  return row;
}

function anchorOf(root: ParentNode, key: string): Element | null {
  const id = `root_${key}`;
  return root.querySelector(`[id="${id}"]`) ?? root.querySelector(`label[for="${id}"]`);
}

/** Die Formulare, die das eigene Feld führen — nur dort wird gelesen und ausgeblendet. */
function ownForms(root: ParentNode): HTMLFormElement[] {
  const forms = Array.from(root.querySelectorAll(`[id="root_${PLAN_ATTRIBUTE}"]`)).map((field) => field.closest("form"));
  return Array.from(new Set(forms.filter((form): form is HTMLFormElement => form !== null)));
}

/**
 * Hält die Zeilen der alten Schalter verborgen, solange der eigene Dialog sie zeigt.
 * @param root der zu beobachtende Teilbaum; offengelegt für Tests.
 * @returns eine Funktion, die aufhört und die Zeilen wieder zeigt.
 */
export function startHiddenLegacyFields(root: ParentNode = document): () => void {
  const hidden = new Set<HTMLElement>();

  const apply = (): void => {
    for (const form of ownForms(root)) {
      for (const key of LEGACY_ATTRIBUTES) {
        const anchor = anchorOf(form, key);
        if (anchor === null) continue;
        const row = rowOf(anchor);
        if (row.style.display !== "none") row.style.display = "none";
        hidden.add(row);
      }
    }
  };

  apply();
  const observer = new MutationObserver(apply);
  observer.observe(root === document ? document.body : (root as Node), { childList: true, subtree: true });

  return () => {
    observer.disconnect();
    hidden.forEach((row) => {
      row.style.display = "";
    });
    hidden.clear();
  };
}

/**
 * Der Wert eines Schalters, wenn er lesbar ist. Ein echtes Kontrollkästchen
 * (`checked`) ist es; im Content Designer trägt der Schalter womöglich ein
 * Element ohne lesbaren Zustand — dann `undefined`, und es gilt weiter das
 * alte Attribut des Blocks.
 */
function readSwitch(form: ParentNode, key: string): boolean | undefined {
  const element = form.querySelector(configFieldSelector(key)) ?? form.querySelector(`[name="root_${key}"]`);
  return element instanceof HTMLInputElement && element.type === "checkbox" ? element.checked : undefined;
}

/** Die alten Schalter, wie der eigene Dialog sie gerade führt; leer ohne eigenen Dialog. */
export function readLegacyFlagsFromDialog(root: ParentNode = document): LegacyFlags {
  const [form] = ownForms(root);
  if (form === undefined) return {};
  const showToday = readSwitch(form, LEGACY_ATTRIBUTES[0]);
  const allowExport = readSwitch(form, LEGACY_ATTRIBUTES[1]);
  return {
    ...(showToday === undefined ? {} : { showToday }),
    ...(allowExport === undefined ? {} : { allowExport }),
  };
}
