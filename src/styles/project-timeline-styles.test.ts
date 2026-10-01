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
 * Wacht über die eckige Form des Widgets auf der Seite.
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

const plain = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, "");

describe("Eckige Form auf der Seite", () => {
  it("setzt die Rundung aller Elemente im Widget mit Nachdruck auf 0", () => {
    const guard = plain(timelineCss).match(/\.man-pt\.man-pt\.man-pt\.man-pt\.man-pt,[^{]*\*[^{]*\{([^}]*)\}/);
    expect(guard?.[1]).toMatch(/border-radius:\s*0\s*!important/);
  });

  it.each(["man-pt__help-icon"])(
    "nimmt nur %s bewusst aus",
    (className) => {
      const escaped = className.replace(/-/g, "\\-");
      const rule = new RegExp(`\\.man-pt(\\.man-pt){4}[^{]*\\.${escaped}[^{]*\\{[^}]*border-radius:\\s*var\\(--man-radius-round, 50%\\)\\s*!important`);
      expect(plain(timelineCss)).toMatch(rule);
    },
  );

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
