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
 * Wacht über die eckige Form des Widgets auf der Seite und über Craft (MAN
 * Design System) in den Seiten-Stylesheets.
 *
 * Am 30.09.2026 zeigte das Frontend die Übersicht unter dem Plan und ihr
 * Fenster mit runden Ecken, obwohl das eigene Stylesheet dort `0` setzt: eine
 * Regel der Seite war stärker. Prüfbar ist die Abwehr, nicht das Aussehen.
 */

import timelineCss from "./project-timeline.scss";
import overviewCss from "./overview.scss";
import editorCss from "./plan-editor.scss";
import controlsCss from "./plan-editor-controls.scss";
import formsCss from "./plan-editor-forms.scss";
import listsCss from "./plan-editor-lists.scss";
import overlaysCss from "./plan-editor-overlays.scss";
import { LABEL_FONT } from "../text-measure";

const plain = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, "");

describe("Eckige Form auf der Seite", () => {
  it("setzt die Rundung aller Elemente im Widget mit Nachdruck auf 0", () => {
    const guard = plain(timelineCss).match(/\.man-pt\.man-pt\.man-pt\.man-pt\.man-pt,[^{]*\*[^{]*\{([^}]*)\}/);
    expect(guard?.[1]).toMatch(/border-radius:\s*0\s*!important/);
  });

  // Rund nur, was Craft rund zeichnet: Kreis, Pille (Chip, Tag), Reiter 2px oben.
  it.each([
    ["man-pt__help-icon", String.raw`var\(--man-radius-round, 50%\)`],
    ["man-pt__chip", String.raw`var\(--man-radius-pill, 24px\)`],
    ["man-pt__tag", String.raw`var\(--man-radius-pill, 24px\)`],
    ["man-pt__help-tab", String.raw`var\(--man-radius-soft, 2px\) var\(--man-radius-soft, 2px\) 0 0`],
  ])("nimmt nur %s bewusst aus", (className, radius) => {
    const escaped = className.replace(/-/g, "\\-");
    const rule = new RegExp(`\\.man-pt(\\.man-pt){4}[^{]*\\.${escaped}[^{\\w-][^{]*\\{[^}]*border-radius:\\s*${radius}\\s*!important`);
    expect(plain(timelineCss)).toMatch(rule);
  });

  it.each([
    "man-pt-overview",
    "man-pt-overview__track",
    "man-pt-overview__window",
    "man-pt-overview__handle",
  ])("setzt %s gegen die Regeln der Seite eckig durch", (className) => {
    const selector = `\\.${className.replace(/-/g, "\\-")}`.repeat(5);
    expect(plain(overviewCss)).toMatch(new RegExp(`${selector}\\s*\\{[^}]*border-radius:\\s*0\\s*!important`));
  });

  // `man-outshine-host` hängt den Selektor fünfmal an sich selbst. Mit einer
  // Liste `.a, .b` entsteht daraus `.a.a.a.a.b` — ein Selektor, der nichts
  // trifft. So hatten die Auswahllisten bis 30.09.2026 nie ihre Form.
  it.each([
    ["project-timeline.scss", timelineCss],
    ["overview.scss", overviewCss],
    ["plan-editor.scss", editorCss],
    ["plan-editor-controls.scss", controlsCss],
    ["plan-editor-forms.scss", formsCss],
    ["plan-editor-lists.scss", listsCss],
    ["plan-editor-overlays.scss", overlaysCss],
  ])("vermischt in %s keine Selektorliste mit man-outshine-host", (_name, css) => {
    const mixed = [...plain(css).matchAll(/^([^{}\n@][^{}]*)\{/gm)]
      .flatMap((match) => match[1].split(",").map((part) => part.trim()))
      .filter((part) => {
        const head = /^((\.[\w-]+))\2\2\2(\.[\w-]+)/.exec(part);
        return head !== null && head[3] !== head[1];
      });
    expect(mixed).toEqual([]);
  });
});

describe("Craft auf der Seite", () => {
  const page = [
    ["project-timeline.scss", timelineCss],
    ["overview.scss", overviewCss],
  ] as const;

  it.each(page)("%s setzt keine Versalien", (_name, css) => {
    expect(plain(css)).not.toMatch(/text-transform:\s*uppercase/);
  });

  it.each(page)("%s setzt keine Laufweite", (_name, css) => {
    const values = [...plain(css).matchAll(/letter-spacing:\s*([^;!}]+)/g)].map((match) => match[1].trim());
    expect(values.filter((value) => value !== "normal" && value !== "0")).toEqual([]);
  });

  it.each(page)("%s nennt nur die Craft-Schriften und -Gewichte", (_name, css) => {
    expect(plain(css)).not.toMatch(/MANEurope|MAN Europe/);
    expect(plain(css)).not.toMatch(/font-weight:\s*(300|500|600)\b|font:\s*(300|500|600)\s/);
  });

  it.each(page)("%s zeichnet den Fokus als Craft-Linie, nicht als box-shadow", (_name, css) => {
    expect(plain(css)).not.toMatch(/box-shadow:\s*var\(--man-focus\b/);
    expect(plain(css)).toMatch(/:focus-visible\s*\{[^}]*outline:\s*var\(--man-focus-width, 2px\) solid var\(--man-focus-color, #3875b2\)/);
  });

  it.each(["man-pt__panel", "man-pt__details", "man-pt__dialog"])("trennt das Overlay %s ohne Schatten über die Haarlinie", (className) => {
    const rule = new RegExp(`\\.${className.replace(/-/g, "\\-")}\\s*\\{([^}]*)\\}`).exec(plain(timelineCss));
    expect(rule?.[1]).toMatch(/box-shadow:\s*none/);
    expect(rule?.[1]).toMatch(/border:\s*var\(--man-border-width, 1px\) solid var\(--man-border, #cbd3dc\)/);
  });

  it("schreibt Fehler in Craft-Fehlerschrift, nicht im Markenrot", () => {
    const rule = /\.man-pt__error\s*\{([^}]*)\}/.exec(plain(timelineCss));
    expect(rule?.[1]).toMatch(/color:\s*var\(--man-error-ink, #990000\)/);
  });

  // Das Layout misst die Beschriftungen mit `LABEL_FONT`, bevor sie im DOM
  // stehen; weicht die Schrift im Stylesheet ab, überlappen sie.
  it("misst Beschriftungen in der Schrift, mit der .man-pt__label sie setzt", () => {
    const rule = /\.man-pt__label\s*\{([^}]*)\}/.exec(plain(timelineCss))?.[1] ?? "";
    const font = /font:\s*(\d+)\s+(\d+px)\/\d+px\s+var\(--man-font-body,\s*([^)]*)\)/.exec(rule);
    expect(font).not.toBeNull();
    const unquote = (value: string) => value.replace(/["']/g, "");
    const [, weight, size, family] = font ?? [];
    expect(unquote(LABEL_FONT)).toBe(unquote(`${weight} ${size} ${family}`));
  });
});
