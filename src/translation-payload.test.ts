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

import { examplePlan } from "./example-plan";
import { Plan, emptyPlan } from "./plan-model";
import { isTranslatedPlanHtml, planFromTranslated, planToTranslatable } from "./translation-payload";

const plan: Plan = {
  version: 1,
  title: "Sales Truck Launch",
  updatedAt: "2024-11-27",
  view: { start: "2025-01", end: "2026-12" },
  lanes: [
    { id: "lane-sop", title: "Launches / SOPs" },
    { id: "lane-fairs", title: "Messen", unknown: { collapsed: true } },
  ],
  categories: [{ id: "cat-my26", title: "MY26 TG Assist", color: "#7B2FA0" }],
  items: [
    {
      id: "i-c4s",
      kind: "milestone",
      lane: "lane-sop",
      category: "cat-my26",
      title: "C4S",
      date: "2025-03-01",
      series: "Serienschlüssel TG",
    },
    {
      id: "i-sop1",
      kind: "milestone",
      lane: "lane-sop",
      category: "cat-my26",
      title: "1. SOP <TG> & \"Assist\"",
      description: "Erste Zeile\nZweite Zeile",
      date: "2025-10-01",
      symbol: "diamond",
      series: "Serienschlüssel TG",
      tentative: true,
      dependsOn: ["i-c4s"],
      unknown: { owner: "Team A" },
    },
    {
      id: "i-tms1",
      kind: "bar",
      lane: "lane-sop",
      title: "TMS1",
      start: "2028-01-01",
      end: "2030-06-30",
      arrow: true,
    },
    { id: "i-co2", kind: "deadline", category: "cat-my26", title: "Verschärfung CO2", date: "2025-07-01" },
  ],
  unknown: { theme: "dark" },
};

/** Ersetzt Text, wie es der Übersetzungsdienst täte — im Markup, nicht im Plan. */
const translate = (html: string, pairs: Record<string, string>): string =>
  Object.entries(pairs).reduce((text, [from, to]) => text.split(from).join(to), html);

describe("Übersetzung des Plans", () => {
  it("verpackt jeden Text als eigenen Knoten — Attribute übersetzt das System nicht", () => {
    const html = planToTranslatable(plan);
    expect(html).toContain("Sales Truck Launch");
    expect(html).toContain("Launches / SOPs");
    expect(html).toContain("Messen");
    expect(html).toContain("MY26 TG Assist");
    expect(html).toContain("C4S");
    expect(html).toContain("Erste Zeile");
    expect(html).toContain("Verschärfung CO2");
    expect(isTranslatedPlanHtml(html)).toBe(true);
  });

  it("lässt Serien, Termine und Farben draußen", () => {
    // `series` ist ein Schlüssel: zwei verschieden übersetzte Fassungen
    // desselben Namens rissen eine Serie auseinander.
    const html = planToTranslatable(plan);
    expect(html).not.toContain("Serienschlüssel");
    expect(html).not.toContain("2025-10-01");
    expect(html).not.toContain("#7B2FA0");
    expect(html).not.toContain("Team A");
  });

  it("maskiert Sonderzeichen, statt das Dokument aufzureißen", () => {
    const html = planToTranslatable(plan);
    expect(html).toContain("&lt;TG&gt; &amp;");
  });

  it("hat für einen leeren Plan nichts zu übersetzen", () => {
    expect(planToTranslatable(emptyPlan())).toBe("");
  });

  it("überlebt den Rundlauf unverändert, wenn nichts übersetzt wurde", () => {
    expect(planFromTranslated(planToTranslatable(plan), plan)).toEqual(plan);
  });

  it("überlebt den Rundlauf auch mit dem Beispielplan", () => {
    const example = examplePlan();
    expect(planFromTranslated(planToTranslatable(example), example)).toEqual(example);
  });

  it("übernimmt die übersetzten Texte und lässt alles andere stehen", () => {
    const html = translate(planToTranslatable(plan), {
      "Sales Truck Launch": "Lancement Sales Truck",
      "Launches / SOPs": "Launches and SOPs",
      Messen: "Fairs",
      "MY26 TG Assist": "MY26 TG Assist EN",
      "Erste Zeile": "First line",
      "Zweite Zeile": "Second line",
      "Verschärfung CO2": "CO2 tightening",
    });

    const next = planFromTranslated(html, plan);

    expect(next.title).toBe("Lancement Sales Truck");
    expect(next.lanes.map((lane) => lane.title)).toEqual(["Launches and SOPs", "Fairs"]);
    expect(next.lanes[1].unknown).toEqual({ collapsed: true });
    expect(next.categories[0]).toEqual({ ...plan.categories[0], title: "MY26 TG Assist EN" });
    expect(next.items[1]).toEqual({ ...plan.items[1], description: "First line\nSecond line" });
    expect(next.items[3]).toEqual({ ...plan.items[3], title: "CO2 tightening" });
    expect(next.items[0]).toEqual(plan.items[0]);
    expect(next.unknown).toEqual(plan.unknown);
    expect(next.view).toEqual(plan.view);
  });

  it("behält die Zeilenumbrüche einer Beschreibung", () => {
    // Der Dienst übersetzt HTML und fasst rohe Zeilenumbrüche zu Leerzeichen
    // zusammen; nur als `<br>` kommen sie sicher zurück.
    const html = planToTranslatable(plan);
    expect(html).toContain("Erste Zeile<br>Zweite Zeile");
  });

  it("behält den Originaltext, wenn im übersetzten Dokument ein Teil fehlt", () => {
    expect(planFromTranslated("<div></div>", plan)).toEqual(plan);
  });

  it("behält den Originaltext, wenn der Dienst einen Text leer zurückgibt", () => {
    const html = translate(planToTranslatable(plan), { ">TMS1<": "><" });
    expect(planFromTranslated(html, plan).items[2].title).toBe("TMS1");
  });

  it("verwechselt Ebene und Eintrag mit gleicher Kennung nicht", () => {
    const clash: Plan = {
      ...plan,
      lanes: [{ id: "x", title: "Ebene X" }],
      items: [{ id: "x", kind: "milestone", lane: "x", title: "Eintrag X", date: "2025-01-01" }],
    };
    const html = translate(planToTranslatable(clash), { "Ebene X": "Lane X", "Eintrag X": "Item X" });
    const next = planFromTranslated(html, clash);
    expect(next.lanes[0].title).toBe("Lane X");
    expect(next.items[0].title).toBe("Item X");
  });

  it("erfindet keine Überschrift, wo keine war", () => {
    const untitled: Plan = { ...plan };
    delete untitled.title;
    expect(planToTranslatable(untitled)).not.toContain("Sales Truck Launch");
    const next = planFromTranslated(planToTranslatable(plan), untitled);
    expect(next).not.toHaveProperty("title");
    expect(next).toEqual(untitled);
  });

  it("erfindet keine Beschreibung, wo keine war", () => {
    const html =
      '<section data-plan-part="item" data-id="i-c4s">' +
      '<p data-field="title">C4S</p><p data-field="description">Neu</p></section>';
    expect(planFromTranslated(html, plan).items[0]).not.toHaveProperty("description");
  });

  it("lässt den übergebenen Plan unangetastet", () => {
    const before = JSON.parse(JSON.stringify(plan)) as Plan;
    planFromTranslated(translate(planToTranslatable(plan), { Messen: "Fairs" }), plan);
    expect(plan).toEqual(before);
  });

  it("erkennt fremde Antworten", () => {
    expect(isTranslatedPlanHtml("<p>Ein Artikel</p>")).toBe(false);
  });
});

describe("Übersetzung der Anhänge", () => {
  const withAttachments: Plan = {
    ...plan,
    items: plan.items.map((item, index) =>
      index === 0
        ? {
            ...item,
            attachments: [
              { mediaId: "m1", url: "/api/media/secure/a.pdf", fileName: "a.pdf", kind: "file" as const, label: "Ablaufplan" },
              { mediaId: "m2", url: "/api/media/secure/b.pdf", fileName: "b.pdf", kind: "file" as const },
            ],
          }
        : item,
    ),
  };

  it("verpackt die Beschriftung eines Anhangs, nicht aber Dateiname und Adresse", () => {
    const html = planToTranslatable(withAttachments);
    expect(html).toContain("Ablaufplan");
    expect(html).not.toContain("a.pdf");
    expect(html).not.toContain("/api/media");
  });

  it("übernimmt die übersetzte Beschriftung am richtigen Anhang", () => {
    const translated = planFromTranslated(translate(planToTranslatable(withAttachments), { Ablaufplan: "Schedule" }), withAttachments);
    expect(translated.items[0].attachments).toEqual([
      { ...withAttachments.items[0].attachments![0], label: "Schedule" },
      withAttachments.items[0].attachments![1],
    ]);
  });

  it("erfindet keine Beschriftung, wo keine war", () => {
    const html = planToTranslatable(withAttachments).replace(
      "</section>",
      '</section><section data-plan-part="attachment" data-id="i-c4s" data-media="m2"><p data-field="label">Erfunden</p></section>',
    );
    expect(planFromTranslated(html, withAttachments).items[0].attachments![1]).not.toHaveProperty("label");
  });

  it("überlebt den Rundlauf unverändert, wenn nichts übersetzt wurde", () => {
    expect(planFromTranslated(planToTranslatable(withAttachments), withAttachments)).toEqual(withAttachments);
  });
});
