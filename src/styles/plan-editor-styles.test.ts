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
import controlsCss from "./plan-editor-controls.scss";
import formsCss from "./plan-editor-forms.scss";
import listsCss from "./plan-editor-lists.scss";
import overlaysCss from "./plan-editor-overlays.scss";

interface Rule {
  selectors: string[];
  body: string;
}

/** Die Regeln eines übersetzten Stylesheets; `@media` wird übersprungen, seine Regeln nicht. */
function rules(css: string): Rule[] {
  // Ohne Kommentare: der Lizenzkopf stünde sonst vor dem Selektor der ersten Regel.
  const plain = css.replace(/\/\*[\s\S]*?\*\//g, "");
  return [...plain.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((match) => ({
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
  ["man-pt-editor__button", controlsCss],
  ["man-pt-editor__tab", controlsCss],
  ["man-pt-editor__disclosure", controlsCss],
  ["man-pt-editor__pill", controlsCss],
  ["man-pt-editor__template", controlsCss],
  ["man-pt-editor__list-item", listsCss],
];

const SHEETS = [editorCss, controlsCss, formsCss, listsCss, overlaysCss];

describe("Stylesheets des Plan-Editors", () => {
  // Die App: `button:focus{…}` (0,1,1), `.mouse button:hover{…}` (0,2,1),
  // `.mouse button:active{…}` (0,2,1). Unter `.man-pt-editor` stehen die
  // Zustände mit (0,3,0) darüber.
  it.each(BUTTONS)(
    "hält %s in Fokus, beim Überfahren und Drücken bei der eigenen Farbe",
    (className, css) => {
      const scoped = `.man-pt-editor .${className}`;
      const [states] = withSelector(css, `${scoped}:focus`);
      expect(states?.selectors).toEqual(
        expect.arrayContaining([
          scoped,
          `${scoped}:focus`,
          `${scoped}:active`,
          `${scoped}:hover`,
        ]),
      );
      expect(states?.body).toMatch(/background-color:\s*var\(--pt-button-bg\)/);

      const [hover] = withSelector(css, `${scoped}:hover:not(:disabled)`);
      expect(hover?.body).toMatch(
        /background-color:\s*var\(--pt-button-bg-hover/,
      );
    },
  );

  it.each(BUTTONS)(
    "belegt für %s die Farbe über die Variable",
    (className, css) => {
      const [base] = withSelector(css, `.${className}`);
      expect(base?.body).toMatch(/--pt-button-bg:/);
    },
  );

  // Ein `background` an der Variable vorbei stünde wieder unter den Regeln
  // der App — genau der Rückfall, den die Variable verhindern soll.
  it("setzt an keinem Knopf den Hintergrund an der Variable vorbei", () => {
    const buttonRule =
      /\.man-pt-editor__(button|tab|disclosure|list-item|pill|template)(?![\w-])/;
    const bypasses = SHEETS.flatMap(rules)
      .filter((rule) =>
        rule.selectors.some((selector) => buttonRule.test(selector)),
      )
      .flatMap((rule) =>
        [...rule.body.matchAll(/background(-color)?:\s*([^;]+)/g)].map(
          (match) => match[2].trim(),
        ),
      )
      .filter((value) => !value.startsWith("var(--pt-button-bg"));
    expect(bypasses).toEqual([]);
  });

  // `.button,button{…;min-height:40px;…}` der App machte Reiter und
  // Listeneinträge höher als ihren Inhalt.
  it.each([
    ["man-pt-editor__tab", controlsCss],
    ["man-pt-editor__disclosure", controlsCss],
    ["man-pt-editor__list-item", listsCss],
  ])("nimmt %s die Mindesthöhe der App", (className, css) => {
    const [base] = withSelector(css, `.${className}`);
    expect(base?.body).toMatch(/min-height:\s*0/);
  });

  // `input[type=radio]{…;appearance:radio}` (0,1,1) machte die Farbfelder zu
  // leeren Kreisen.
  it("zeichnet die Farbfelder selbst, auch gegen die Optionsfeld-Regel der App", () => {
    const [swatch] = withSelector(
      formsCss,
      ".man-pt-editor .man-pt-editor__swatch",
    );
    expect(swatch?.body).toMatch(/-webkit-appearance:\s*none/);
    expect(swatch?.body).toMatch(/(^|[^-])appearance:\s*none/);
  });

  it("lässt die Optionsfelder der Rückfrage nicht über die ganze Zeile laufen", () => {
    const [radio] = withSelector(
      formsCss,
      ".man-pt-editor .man-pt-editor__check input",
    );
    expect(radio?.body).toMatch(/width:\s*auto/);
  });

  it("gibt den Auswahllisten den Pfeil zurück", () => {
    const selects = withSelector(formsCss, ".man-pt-editor__select");
    expect(
      selects.some((rule) => /(^|[^-])appearance:\s*auto/.test(rule.body)),
    ).toBe(true);
  });

  // Am 30.09.2026 im Studio: die Trennlinie der nächsten Listenzeile lief durch
  // die Knöpfe der Lösch-Rückfrage. Das Popover sitzt in der Werkzeughülle der
  // Zeile, und die bildet mit `transform` eine eigene Stapelebene — sein
  // `z-index` gilt nur darin, spätere Zeilen malen darüber.
  it("hebt die Zeile bzw. den Anker mit offenem Popover über alles Folgende", () => {
    const lifted = rules(overlaysCss).filter((rule) =>
      rule.selectors.some(
        (selector) =>
          selector.includes(":has(") &&
          selector.includes("man-pt-editor__popover"),
      ),
    );
    const selectors = lifted.flatMap((rule) => rule.selectors);
    expect(
      selectors.some((selector) =>
        selector.startsWith(".man-pt-editor__list-row"),
      ),
    ).toBe(true);
    expect(
      selectors.some((selector) =>
        selector.startsWith(".man-pt-editor__anchor"),
      ),
    ).toBe(true);
    lifted.forEach((rule) => expect(rule.body).toMatch(/z-index:\s*[1-9]/));
  });

  it("hält die Ebenen der Vorschau unter der Rückfrage", () => {
    const [body] = withSelector(editorCss, ".man-pt-editor__preview-stage");
    expect(body?.body).toMatch(/isolation:\s*isolate/);
  });

  // Das Modal rollt nicht („an editor scrolls its own body“). Jeder Bereich
  // braucht deshalb einen eigenen Rollbereich, und jede Stufe darüber muss
  // schrumpfen dürfen — sonst schneidet der Rand den Inhalt ab (am 30.09.2026
  // im Studio beanstandet: in keinem Reiter liess sich rollen).
  it("lässt jeden Bereich selbst rollen", () => {
    const [body] = withSelector(editorCss, ".man-pt-editor__pane-body");
    expect(body?.body).toMatch(/overflow-y:\s*auto/);
    expect(body?.body).toMatch(/min-height:\s*0/);
  });

  it.each([
    [".man-pt-editor", editorCss],
    [".man-pt-editor__main", editorCss],
    [".man-pt-editor__pane", editorCss],
    [".man-pt-editor__tabs", editorCss],
    [".man-pt-editor__tabpanel", editorCss],
    [".man-pt-editor__entries", listsCss],
  ])(
    "lässt %s schrumpfen, damit die Höhe bis zu den Rollbereichen durchreicht",
    (selector, css) => {
      const [rule] = withSelector(css, selector);
      expect(rule?.body).toMatch(/min-height:\s*0/);
    },
  );

  it("gibt der Vorschau eine feste Höhe, die der Zeitstrahl füllt", () => {
    const [stage] = withSelector(editorCss, ".man-pt-editor__preview-stage");
    expect(stage?.body).toMatch(/height:\s*clamp\(/);
  });

  // Ein Zeichen jenseits von ASCII lässt Sass dem gepressten Stylesheet ein
  // Byte-Order-Mark voranstellen; im `<style>` hängt es am ersten Selektor,
  // und die erste Regel greift nicht mehr.
  it("bleibt bei ASCII, damit kein Byte-Order-Mark die erste Regel bricht", () => {
    SHEETS.forEach((css) => {
      const code = css
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/@charset "UTF-8";/, "");
      const beyondAscii = [...code].filter((char) => char.charCodeAt(0) > 0x7f);
      expect(beyondAscii).toEqual([]);
    });
  });

  it("macht die Ziehgriffe greifbar: eigener Zeiger, kein Rollen und keine Textauswahl beim Ziehen", () => {
    const [base] = withSelector(editorCss, ".man-pt-editor__splitter");
    expect(base?.body).toMatch(/touch-action:\s*none/);
    expect(base?.body).toMatch(/user-select:\s*none/);
    expect(
      withSelector(editorCss, ".man-pt-editor__splitter--horizontal")[0]?.body,
    ).toMatch(/cursor:\s*row-resize/);
    expect(
      withSelector(editorCss, ".man-pt-editor__splitter--vertical")[0]?.body,
    ).toMatch(/cursor:\s*col-resize/);
  });

  // Flach und bündig (am 30.09.2026 gewünscht): Bereiche sind durch
  // Haarlinien getrennt, nicht als runde Karten mit Schatten.
  it.each([
    ".man-pt-editor__bar",
    ".man-pt-editor__notice",
    ".man-pt-editor__main",
    ".man-pt-editor__pane",
    ".man-pt-editor__pane-head",
    ".man-pt-editor__pane-body",
    ".man-pt-editor__preview",
    ".man-pt-editor__preview-stage",
    ".man-pt-editor__tabs",
    ".man-pt-editor__tabpanel",
    ".man-pt-editor__tablist",
    ".man-pt-editor__entries",
    ".man-pt-editor__entities",
    ".man-pt-editor__list-row",
    ".man-pt-editor__entity",
    ".man-pt-editor__empty",
  ])("zeichnet %s ohne Rundung und ohne Schatten", (selector) => {
    const found = SHEETS.flatMap((css) => withSelector(css, selector));
    expect(found.length).toBeGreaterThan(0);
    for (const rule of found) {
      const radius = [...rule.body.matchAll(/border-radius:\s*([^;]+)/g)].map(
        (match) => match[1].trim(),
      );
      expect(radius.filter((value) => !/^0(px)?$/.test(value))).toEqual([]);
      expect(rule.body).not.toMatch(/box-shadow/);
    }
  });

  // Der Papierkorb ist nur beim Überfahren zu sehen — und muss es auch bei
  // Tastaturfokus in der Zeile und auf Geräten ohne Überfahren sein.
  it("zeigt den Papierkorb beim Überfahren, bei Fokus in der Zeile und auf Touch-Geräten", () => {
    const [hidden] = withSelector(listsCss, ".man-pt-editor__row-delete");
    expect(hidden?.body).toMatch(/opacity:\s*0/);
    const shown = rules(listsCss).find((rule) =>
      rule.selectors.includes(
        ".man-pt-editor__list-row:hover .man-pt-editor__row-delete",
      ),
    );
    expect(shown?.selectors).toContain(
      ".man-pt-editor__list-row:focus-within .man-pt-editor__row-delete",
    );
    expect(shown?.body).toMatch(/opacity:\s*1/);
    expect(listsCss).toMatch(
      /@media \(hover: none\)\s*\{\s*\.man-pt-editor__row-delete\s*\{\s*opacity:\s*1/,
    );
  });

  // Eine Fluchtlinie für alles: Kopfleiste, Reiter, Bereichsköpfe, Zeilen
  // und die Vorschau (die die Variable erbt) stehen an derselben Kante.
  it("setzt die Fluchtlinie als Variable am Editor und nutzt sie überall", () => {
    const [root] = withSelector(editorCss, ".man-pt-editor");
    expect(root?.body).toMatch(/--pt-ed-gutter:\s*16px/);
    const uses = [
      [editorCss, ".man-pt-editor__bar"],
      [editorCss, ".man-pt-editor__pane-row"],
      [editorCss, ".man-pt-editor__pane-body"],
      [controlsCss, ".man-pt-editor__tablist"],
      [listsCss, ".man-pt-editor__list-item"],
      [listsCss, ".man-pt-editor__entity"],
    ] as const;
    for (const [css, selector] of uses) {
      const [rule] = withSelector(css, selector);
      expect(`${selector}: ${rule?.body}`).toMatch(/var\(--pt-ed-gutter\)/);
    }
  });

  // Liste und Formular stehen nebeneinander; ihre Kopfzeilen sollen an
  // denselben Linien enden. Aus dem Inhalt ergäben sich verschiedene Höhen.
  it("gibt den Kopfzeilen feste Höhen aus gemeinsamen Variablen", () => {
    const [root] = withSelector(editorCss, ".man-pt-editor");
    expect(root?.body).toMatch(/--pt-ed-head-h:\s*\d+px/);
    expect(root?.body).toMatch(/--pt-ed-subhead-h:\s*\d+px/);
    expect(
      withSelector(editorCss, ".man-pt-editor__pane-row")[0]?.body,
    ).toMatch(/min-height:\s*var\(--pt-ed-head-h\)/);
    expect(
      withSelector(editorCss, ".man-pt-editor__pane-row--sub")[0]?.body,
    ).toMatch(/height:\s*var\(--pt-ed-subhead-h\)/);
  });

  it("kommt ohne !important aus", () => {
    SHEETS.forEach((css) => expect(css).not.toContain("!important"));
  });
});
