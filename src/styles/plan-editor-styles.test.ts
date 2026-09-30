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
 * Wacht über die Abwehr des Plan-Editors gegen das Stylesheet der
 * Staffbase-App.
 *
 * Am 30.09.2026 zeigte die Sichtprüfung im Dev-Harness (dort ist
 * `resources/css/app.css` eine Kopie des App-Stylesheets) die Farbfelder als
 * leere native Kreise und jeden fokussierten oder überfahrenen Knopf grellblau.
 * Keine der Komponentenprüfungen merkte etwas davon: jsdom kennt das fremde
 * Stylesheet nicht, und Aussehen ist dort ohnehin nicht prüfbar.
 *
 * Prüfbar ist die Abwehr selbst: dass die Regeln mit genügend Gewicht dastehen
 * und kein Knopf seinen Hintergrund an ihnen vorbei setzt. Das fängt den
 * Rückfall, nicht das Aussehen.
 */

import editorCss from "./plan-editor.scss";
import formsCss from "./plan-editor-forms.scss";

interface Rule {
  selectors: string[];
  body: string;
}

/** Die Regeln eines übersetzten Stylesheets; `@media` wird übersprungen, seine Regeln nicht. */
function rules(css: string): Rule[] {
  return [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((match) => ({
    selectors: match[1]
      .split(",")
      .map((selector) => selector.trim())
      .filter((selector) => selector !== ""),
    body: match[2],
  }));
}

const withSelector = (css: string, selector: string): Rule[] =>
  rules(css).filter((rule) => rule.selectors.includes(selector));

const BUTTONS: readonly [string, string][] = [
  ["man-pt-editor__button", editorCss],
  ["man-pt-editor__tab", editorCss],
  ["man-pt-editor__disclosure", editorCss],
  ["man-pt-editor__list-item", formsCss],
];

describe("Stylesheets des Plan-Editors", () => {
  // Die App: `button:focus{…}` (0,1,1), `.mouse button:hover{…}` (0,2,1),
  // `.mouse button:active{…}` (0,2,1). Unter `.man-pt-editor` stehen die
  // Zustände mit (0,3,0) darüber.
  it.each(BUTTONS)("hält %s in Fokus, beim Überfahren und Drücken bei der eigenen Farbe", (className, css) => {
    const scoped = `.man-pt-editor .${className}`;
    const [states] = withSelector(css, `${scoped}:focus`);
    expect(states?.selectors).toEqual(
      expect.arrayContaining([scoped, `${scoped}:focus`, `${scoped}:active`, `${scoped}:hover`]),
    );
    expect(states?.body).toMatch(/background-color:\s*var\(--pt-button-bg\)/);

    const [hover] = withSelector(css, `${scoped}:hover:not(:disabled)`);
    expect(hover?.body).toMatch(/background-color:\s*var\(--pt-button-bg-hover/);
  });

  it.each(BUTTONS)("belegt für %s die Farbe über die Variable", (className, css) => {
    const [base] = withSelector(css, `.${className}`);
    expect(base?.body).toMatch(/--pt-button-bg:/);
  });

  // Ein `background` an der Variable vorbei stünde wieder unter den Regeln
  // der App — genau der Rückfall, den die Variable verhindern soll.
  it("setzt an keinem Knopf den Hintergrund an der Variable vorbei", () => {
    const buttonRule = /\.man-pt-editor__(button|tab|disclosure|list-item)\b/;
    const bypasses = [...rules(editorCss), ...rules(formsCss)]
      .filter((rule) => rule.selectors.some((selector) => buttonRule.test(selector)))
      .flatMap((rule) => [...rule.body.matchAll(/background(-color)?:\s*([^;]+)/g)].map((match) => match[2].trim()))
      .filter((value) => !value.startsWith("var(--pt-button-bg"));
    expect(bypasses).toEqual([]);
  });

  // `.button,button{…;min-height:40px;…}` der App machte Reiter und
  // Listeneinträge höher als ihren Inhalt.
  it.each([
    ["man-pt-editor__tab", editorCss],
    ["man-pt-editor__disclosure", editorCss],
    ["man-pt-editor__list-item", formsCss],
  ])("nimmt %s die Mindesthöhe der App", (className, css) => {
    const [base] = withSelector(css, `.${className}`);
    expect(base?.body).toMatch(/min-height:\s*0/);
  });

  // `input[type=radio]{…;appearance:radio}` (0,1,1) machte die Farbfelder zu
  // leeren Kreisen.
  it("zeichnet die Farbfelder selbst, auch gegen die Optionsfeld-Regel der App", () => {
    const [swatch] = withSelector(formsCss, ".man-pt-editor .man-pt-editor__swatch");
    expect(swatch?.body).toMatch(/-webkit-appearance:\s*none/);
    expect(swatch?.body).toMatch(/(^|[^-])appearance:\s*none/);
  });

  it("lässt die Optionsfelder der Rückfrage nicht über die ganze Zeile laufen", () => {
    const [radio] = withSelector(formsCss, ".man-pt-editor .man-pt-editor__check input");
    expect(radio?.body).toMatch(/width:\s*auto/);
  });

  it("gibt den Auswahllisten den Pfeil zurück", () => {
    const selects = withSelector(formsCss, ".man-pt-editor__select");
    expect(selects.some((rule) => /(^|[^-])appearance:\s*auto/.test(rule.body))).toBe(true);
  });

  it("hält die Ebenen der Vorschau unter der Rückfrage", () => {
    const [body] = withSelector(editorCss, ".man-pt-editor__preview-body");
    expect(body?.body).toMatch(/isolation:\s*isolate/);
  });

  it("kommt ohne !important aus", () => {
    expect(editorCss).not.toContain("!important");
    expect(formsCss).not.toContain("!important");
  });
});
