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
 * Der Beispielplan nach der Vorlage „Sales Truck Launch – 27.11.2024".
 *
 * Er dient dreimal: als Angebot „Mit Beispielplan beginnen" im leeren Editor,
 * als Live-Beispiel der Dokumentation und als Prüfstück der Darstellung — er
 * enthält jede Art von Eintrag, Serien mit und ohne Balken, vorläufige
 * Einträge und Abhängigkeiten über Ebenen hinweg.
 *
 * Die Termine sind aus der Folie abgelesen, also quartalsgenau geschätzt.
 */

import { Plan } from "./plan-model";

export function examplePlan(): Plan {
  return {
    version: 1,
    title: "Sales Truck Launch",
    updatedAt: "2024-11-27",
    view: { start: "2025-01", end: "2031-12" },
    lanes: [
      { id: "lane-fairs", title: "Messen" },
      { id: "lane-sop", title: "Launches / SOPs" },
      { id: "lane-milestones", title: "Projekt-Meilensteine" },
    ],
    categories: [
      { id: "cat-general", title: "General", color: "#E40045" },
      { id: "cat-my25", title: "MY25 / FPP", color: "#303C49" },
      { id: "cat-my26", title: "MY26 TG Assist", color: "#7B2FA0" },
      { id: "cat-my28", title: "MY28 TG Vision / FPP", color: "#F5B800" },
      { id: "cat-etruck", title: "eTruck (TruE)", color: "#4B96D2" },
      { id: "cat-etgl", title: "eTGL (Speed)", color: "#00786E" },
      { id: "cat-tms", title: "TMS", color: "#91B900" },
    ],
    items: [
      // Messen
      { id: "fair-bauma-25", kind: "milestone", lane: "lane-fairs", category: "cat-general", title: "Bauma", date: "2025-04-07", symbol: "square" },
      {
        id: "fair-trucknology",
        kind: "milestone",
        lane: "lane-fairs",
        category: "cat-general",
        title: "Trucknology Festival",
        date: "2025-06-26",
        symbol: "square",
        tentative: true,
        description: "Termin noch nicht bestätigt.",
      },
      { id: "fair-iaa-26", kind: "milestone", lane: "lane-fairs", category: "cat-general", title: "IAA", date: "2026-09-15", symbol: "square" },
      { id: "fair-bauma-28", kind: "milestone", lane: "lane-fairs", category: "cat-general", title: "Bauma", date: "2028-04-03", symbol: "square" },
      { id: "fair-iaa-28", kind: "milestone", lane: "lane-fairs", category: "cat-general", title: "IAA", date: "2028-09-19", symbol: "square" },
      { id: "fair-iaa-30", kind: "milestone", lane: "lane-fairs", category: "cat-general", title: "IAA", date: "2030-09-17", symbol: "square" },
      { id: "fair-bauma-31", kind: "milestone", lane: "lane-fairs", category: "cat-general", title: "Bauma", date: "2031-04-07", symbol: "square" },

      // Launches / SOPs
      { id: "sop-core-my25", kind: "milestone", lane: "lane-sop", category: "cat-my25", title: "SOP Core MY25", date: "2025-01-06" },
      { id: "sop-fpp-my25", kind: "milestone", lane: "lane-sop", category: "cat-my25", title: "SOP FPP MY25", date: "2025-04-01" },
      { id: "sop-etruck", kind: "milestone", lane: "lane-sop", category: "cat-etruck", title: "SOP eTruck", date: "2025-05-15" },
      {
        id: "sop-tga-1",
        kind: "milestone",
        lane: "lane-sop",
        category: "cat-my26",
        title: "1. SOP TG Assist MY26",
        date: "2025-10-01",
        symbol: "triangle",
        series: "TG Assist MY26",
        dependsOn: ["ms-c4s-tga"],
      },
      { id: "sop-tga-2", kind: "milestone", lane: "lane-sop", category: "cat-my26", title: "2. SOP TG Assist MY26", date: "2026-01-15", symbol: "triangle", series: "TG Assist MY26" },
      { id: "sop-tga-3", kind: "milestone", lane: "lane-sop", category: "cat-my26", title: "3. SOP TG Assist MY26", date: "2026-04-01", symbol: "triangle", series: "TG Assist MY26" },
      {
        id: "sop-etgl-1",
        kind: "milestone",
        lane: "lane-sop",
        category: "cat-etgl",
        title: "1. SOP eTGL",
        date: "2026-01-01",
        series: "eTGL",
        dependsOn: ["ms-etgl-c4s", "ms-etgl-0"],
      },
      { id: "sop-etgl-2", kind: "milestone", lane: "lane-sop", category: "cat-etgl", title: "2. SOP eTGL", date: "2026-04-01", series: "eTGL" },
      { id: "sop-etgm", kind: "milestone", lane: "lane-sop", category: "cat-etgl", title: "SOP eTGM", date: "2026-07-01", series: "eTGL" },
      { id: "sop-etgl-3", kind: "milestone", lane: "lane-sop", category: "cat-etgl", title: "3. SOP eTGL", date: "2026-10-01", series: "eTGL" },
      {
        id: "sop-tg-vision",
        kind: "milestone",
        lane: "lane-sop",
        category: "cat-my28",
        title: "SOP TG Vision",
        date: "2027-07-01",
        dependsOn: ["ms-tgv-c4s", "ms-tgv-0"],
      },
      {
        id: "sop-my28-ab",
        kind: "milestone",
        lane: "lane-sop",
        category: "cat-my28",
        title: "SOP MY28 EU7 A+B",
        date: "2028-04-01",
        series: "MY28",
        dependsOn: ["ms-my28-ab"],
      },
      {
        id: "sop-my28-cd",
        kind: "milestone",
        lane: "lane-sop",
        category: "cat-my28",
        title: "SOP MY28 EU7 C+D",
        date: "2028-07-01",
        series: "MY28",
        dependsOn: ["ms-my28-cd"],
      },
      {
        id: "sop-my28-row",
        kind: "milestone",
        lane: "lane-sop",
        category: "cat-my28",
        title: "SOP MY28 ROW",
        date: "2028-10-01",
        series: "MY28",
        dependsOn: ["ms-my28-row"],
      },
      {
        id: "bar-tms1",
        kind: "bar",
        lane: "lane-sop",
        category: "cat-tms",
        title: "TMS1",
        start: "2028-01-01",
        end: "2030-06-30",
        arrow: true,
        series: "TMS1",
      },
      { id: "sop-alg-bev", kind: "milestone", lane: "lane-sop", category: "cat-my25", title: "SOP 1. ALG BEV", date: "2028-02-01", series: "TMS1" },
      { id: "sop-alg-diesel", kind: "milestone", lane: "lane-sop", category: "cat-my25", title: "SOP 1. ALG Diesel", date: "2028-08-01", series: "TMS1" },
      {
        id: "bar-miles",
        kind: "bar",
        lane: "lane-sop",
        category: "cat-tms",
        title: "MILES",
        start: "2030-01-01",
        end: "2031-12-31",
        arrow: true,
        tentative: true,
        series: "MILES",
        description: "SOCOP 02/2030, Projektstart 01/2025.",
      },
      { id: "sop-miles-alg", kind: "milestone", lane: "lane-sop", category: "cat-my25", title: "SOP 1. ALG", date: "2030-01-15", symbol: "triangle", series: "MILES" },

      // Projekt-Meilensteine
      { id: "ms-etgl-c4s", kind: "milestone", lane: "lane-milestones", category: "cat-etgl", title: "eTGL C4S", date: "2025-04-01" },
      { id: "ms-etgl-0", kind: "milestone", lane: "lane-milestones", category: "cat-etgl", title: "eTGL 0-Serie", date: "2025-10-01" },
      { id: "ms-c4s-tga", kind: "milestone", lane: "lane-milestones", category: "cat-my26", title: "C4S TG Assist", date: "2025-10-01" },
      { id: "ms-tgv-c4s", kind: "milestone", lane: "lane-milestones", category: "cat-my28", title: "TG Vision C4S", date: "2027-04-01" },
      { id: "ms-tgv-0", kind: "milestone", lane: "lane-milestones", category: "cat-my28", title: "TG Vision 0-Serie", date: "2027-07-01" },
      { id: "ms-my28-ab", kind: "milestone", lane: "lane-milestones", category: "cat-my28", title: "MY28 A+B C4S", date: "2028-01-01" },
      { id: "ms-my28-cd", kind: "milestone", lane: "lane-milestones", category: "cat-my28", title: "MY28 C+D C4S", date: "2028-04-01" },
      { id: "ms-my28-row", kind: "milestone", lane: "lane-milestones", category: "cat-my28", title: "MY28 ROW C4S", date: "2028-07-01" },

      // Stichtage
      { id: "dl-co2-15", kind: "deadline", category: "cat-general", title: "Verschärfung CO2 −15 %", date: "2025-07-01" },
      { id: "dl-direct-vision", kind: "deadline", category: "cat-general", title: "§ Direct Vision", date: "2029-01-01" },
      { id: "dl-euro7", kind: "deadline", category: "cat-general", title: "§ Euro 7", date: "2029-05-01" },
      { id: "dl-co2-45", kind: "deadline", category: "cat-general", title: "Verschärfung CO2 −45 %", date: "2030-07-01" },
    ],
  };
}
