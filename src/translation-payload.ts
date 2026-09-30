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
 * Wie der Text des Plans durch Staffbases Inhaltsübersetzung reist.
 *
 * `POST /api/translations` übersetzt Textknoten und lässt Attribute
 * unangetastet. Die Überschrift, die Titel von Ebenen, Kategorien und
 * Einträgen sowie die Beschreibungen stecken aber im Attribut `plan` — sie
 * werden deshalb in ein
 * kleines Dokument verpackt, in dem jeder Teil ein eigener Knoten mit
 * `data-plan-part`/`data-id` und jedes Feld einer mit `data-field` ist, und
 * danach wieder herausgelesen. Vorbild: `hotspot-image-widget/src/translation-payload.ts`.
 *
 * Kennungen, Termine, Farben, Verweise und `series` reisen nicht mit. Das ist
 * keine Sprache — und `series` ist ein Schlüssel: zwei verschieden übersetzte
 * Fassungen desselben Namens rissen eine Serie auseinander.
 */

import { Category, Lane, Plan, PlanItem } from "./plan-model";

/** Kennzeichnet die Teile des Dokuments; zugleich der Beleg, dass eine Antwort von hier stammt. */
const PART_ATTRIBUTE = "data-plan-part";
const ID_ATTRIBUTE = "data-id";
const FIELD_ATTRIBUTE = "data-field";

type PartName = "plan" | "lane" | "category" | "item";

/** Die Überschrift gibt es nur einmal; ihr Teil braucht trotzdem eine Kennung. */
const PLAN_ID = "plan";

/** Die Felder, die je Teil übersetzt werden. */
type FieldName = "title" | "description";

type Fields = ReadonlyMap<FieldName, string>;

/** Ebene und Eintrag dürfen dieselbe Kennung tragen; erst mit dem Teil ist der Schlüssel eindeutig. */
const partKey = (part: PartName, id: string): string => `${part}\u0000${id}`;

/**
 * Schreibt Text als Knoten, Zeilenumbrüche als `<br>`.
 *
 * Der Dienst übersetzt HTML und fasst rohe Zeilenumbrüche dabei wie jeder
 * HTML-Leser zu Leerzeichen zusammen; eine mehrzeilige Beschreibung käme
 * sonst einzeilig zurück.
 */
function appendText(target: HTMLElement, text: string): void {
  text.split("\n").forEach((line, index) => {
    if (index > 0) target.appendChild(document.createElement("br"));
    if (line !== "") target.appendChild(document.createTextNode(line));
  });
}

/**
 * Baut das übersetzbare Dokument über `document.createElement` statt über
 * einen zusammengesetzten String: der Browser übernimmt damit das Maskieren
 * von `<`, `&` und Anführungszeichen. Ein Titel mit `<` reißt so das Dokument
 * nicht auf.
 *
 * @returns leeren Text, wenn der Plan nichts zu übersetzen hat.
 */
export function planToTranslatable(plan: Plan): string {
  const container = document.createElement("div");

  const addPart = (part: PartName, id: string, fields: ReadonlyArray<[FieldName, string | undefined]>): void => {
    const section = document.createElement("section");
    section.setAttribute(PART_ATTRIBUTE, part);
    section.setAttribute(ID_ATTRIBUTE, id);
    for (const [name, text] of fields) {
      if (text === undefined || text.trim() === "") continue;
      const field = document.createElement("p");
      field.setAttribute(FIELD_ATTRIBUTE, name);
      appendText(field, text);
      section.appendChild(field);
    }
    if (section.childNodes.length > 0) container.appendChild(section);
  };

  addPart("plan", PLAN_ID, [["title", plan.title]]);
  plan.lanes.forEach((lane) => addPart("lane", lane.id, [["title", lane.title]]));
  plan.categories.forEach((category) => addPart("category", category.id, [["title", category.title]]));
  plan.items.forEach((item) =>
    addPart("item", item.id, [
      ["title", item.title],
      ["description", item.description],
    ]),
  );

  return container.innerHTML;
}

/** Text eines Knotens, `<br>` wieder als Zeilenumbruch — die Umkehrung von {@link appendText}. */
function readText(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent ?? "";
  if (node.nodeName === "BR") return "\n";
  return Array.from(node.childNodes, readText).join("");
}

const isPartName = (value: string | null): value is PartName =>
  value === "plan" || value === "lane" || value === "category" || value === "item";

const isFieldName = (value: string | null): value is FieldName => value === "title" || value === "description";

/**
 * Alle übersetzten Felder, nach Teil und Kennung.
 *
 * Einmal geparst statt je Teil: ein Plan trägt bis zu 300 Einträge, und je
 * Eintrag ein eigenes Dokument zu bauen, kostete spürbar Zeit, während die
 * Redaktion auf die Übersetzung wartet. Taucht ein Teil doppelt auf, gilt der
 * erste — so wie beim Lesen des Plans eine doppelte Kennung den späteren
 * Eintrag verwirft.
 */
function readParts(html: string): ReadonlyMap<string, Fields> {
  const parts = new Map<string, Map<FieldName, string>>();
  const doc = new DOMParser().parseFromString(`<body>${html}</body>`, "text/html");

  doc.body.querySelectorAll(`[${PART_ATTRIBUTE}]`).forEach((section) => {
    const part = section.getAttribute(PART_ATTRIBUTE);
    const id = section.getAttribute(ID_ATTRIBUTE);
    if (!isPartName(part) || id === null) return;
    const key = partKey(part, id);
    if (parts.has(key)) return;

    const fields = new Map<FieldName, string>();
    section.querySelectorAll(`[${FIELD_ATTRIBUTE}]`).forEach((element) => {
      const name = element.getAttribute(FIELD_ATTRIBUTE);
      if (isFieldName(name) && !fields.has(name)) fields.set(name, readText(element));
    });
    parts.set(key, fields);
  });

  return parts;
}

const NO_FIELDS: Fields = new Map();

/**
 * Nimmt den übersetzten Text an, außer der Dienst hat ihn verloren.
 *
 * Fremder Text ist nicht vertrauenswürdig: fehlt ein Feld oder ein ganzer Teil
 * im übersetzten Dokument, bleibt das Original stehen statt einer Lücke im
 * Plan — ein leerer Titel verwürfe den Eintrag beim nächsten Lesen sogar.
 */
function pick(fields: Fields, name: FieldName, source: string): string {
  const translated = fields.get(name);
  return translated === undefined || translated.trim() === "" ? source : translated;
}

const translateLane = (lane: Lane, fields: Fields): Lane => ({ ...lane, title: pick(fields, "title", lane.title) });

const translateCategory = (category: Category, fields: Fields): Category => ({
  ...category,
  title: pick(fields, "title", category.title),
});

/** Nur was vorher da war, wird übersetzt: eine Beschreibung, die der Dienst erfindet, fällt weg. */
function translateItem(item: PlanItem, fields: Fields): PlanItem {
  const title = pick(fields, "title", item.title);
  return item.description === undefined
    ? { ...item, title }
    : { ...item, title, description: pick(fields, "description", item.description) };
}

/** Wie bei der Beschreibung: eine Überschrift, die der Dienst erfindet, fällt weg. */
function translateTitle(plan: Plan, fields: Fields): Plan {
  return plan.title === undefined ? plan : { ...plan, title: pick(fields, "title", plan.title) };
}

/**
 * Liest den übersetzten Plan zurück.
 *
 * `plan` ist das Original, aus dem alles außer den Texten unverändert
 * übernommen wird — ein unbekannter Teil im übersetzten Dokument erfindet
 * deshalb nichts, ein fehlender löscht nichts.
 */
export function planFromTranslated(html: string, plan: Plan): Plan {
  const parts = readParts(html);
  const fieldsOf = (part: PartName, id: string): Fields => parts.get(partKey(part, id)) ?? NO_FIELDS;

  return {
    ...translateTitle(plan, fieldsOf("plan", PLAN_ID)),
    lanes: plan.lanes.map((lane) => translateLane(lane, fieldsOf("lane", lane.id))),
    categories: plan.categories.map((category) => translateCategory(category, fieldsOf("category", category.id))),
    items: plan.items.map((item) => translateItem(item, fieldsOf("item", item.id))),
  };
}

/** Stammt die Antwort aus {@link planToTranslatable}? */
export const isTranslatedPlanHtml = (html: string): boolean => html.includes(PART_ATTRIBUTE);
