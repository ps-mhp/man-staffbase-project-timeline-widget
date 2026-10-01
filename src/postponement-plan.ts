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
 * Die Vorlage „Terminverschiebung“: ein Software-Release, das sich verschiebt.
 * Release, Termine, Funktionen und Codes sind frei erfunden — die Vorlage
 * steckt im öffentlichen Bundle.
 *
 * Zeigt, was der Beispielplan nicht zeigt: keinen Langfristplan, sondern eine
 * Verschiebung auf wenigen Monaten. Die beiden Stichtage spannen alten und
 * neuen Termin über alle Ebenen; je betroffener Funktion eine Ebene, in der
 * ein Zeitraum vom alten Termin bis an die rote Linie reicht. Die Farben stehen
 * für den Stand, nicht für die Funktion — so liest die Legende sich als
 * „alt / Lücke / neu“.
 *
 * Bewusst ohne Serien: in einer Serie teilen sich Einträge eine Zeile, und
 * schmal überdeckte der Folgeeintrag die nach rechts ausweichende
 * Beschriftung eines kurzen Zeitraums.
 */

import { Plan } from "./plan-model";

const ORIGINAL = "2027-03-15";
const LAST_DAY_BEFORE_RELEASE = "2027-04-25";
const RELEASE = "2027-04-26";
/** Offenes Ende der Nachparametrierung; der Pfeil sagt „läuft weiter“. */
const AFTERCARE_UNTIL = "2027-07-31";

export function postponementPlan(): Plan {
  return {
    version: 1,
    title: "Verschiebung Software-Release 3.4",
    updatedAt: "2026-12-10",
    view: { start: "2026-12", end: "2027-08" },
    lanes: [
      { id: "lane-communication", title: "Kommunikation" },
      { id: "lane-platform", title: "Plattform A" },
      { id: "lane-assist", title: "Fahrerassistenz" },
      { id: "lane-charging", title: "Ladeplanung" },
      { id: "lane-navigation", title: "Navigation" },
      { id: "lane-fleet", title: "Flottenanbindung" },
    ],
    categories: [
      { id: "cat-shift", title: "Verschiebung", color: "#F5B800", symbol: "triangle" },
      { id: "cat-release", title: "Neuer Termin", color: "#E40045", symbol: "triangle" },
      { id: "cat-without", title: "Auslieferung ohne Funktion", color: "#7B2FA0", symbol: "square" },
      { id: "cat-aftercare", title: "Nachparametrierung", color: "#00786E", symbol: "hexagon" },
      { id: "cat-communication", title: "Kommunikation", color: "#4B96D2", symbol: "circle" },
    ],
    items: [
      // Kommunikation
      {
        id: "info-shift",
        kind: "milestone",
        lane: "lane-communication",
        category: "cat-communication",
        title: "Information zur Verschiebung",
        date: "2026-12-10",
        description:
          "Kund:innen aktiv informieren: Fahrzeuge mit betroffenen Ausstattungen laufen erst ab dem neuen Termin " +
          "vom Band — Liefertermine ändern sich.",
      },
      {
        id: "info-service",
        kind: "milestone",
        lane: "lane-communication",
        category: "cat-communication",
        title: "Technische Information an den Service",
        date: RELEASE,
        tentative: true,
        description: "Geht rechtzeitig vor der Nachparametrierung hinaus; der genaue Termin steht noch aus.",
      },

      // Plattform A, Fahrerassistenz, Ladeplanung: je ein Pfeil vom alten Termin zur roten Linie
      {
        id: "platform-shift",
        kind: "bar",
        lane: "lane-platform",
        category: "cat-shift",
        title: "SOP verschoben",
        start: ORIGINAL,
        end: LAST_DAY_BEFORE_RELEASE,
        arrow: true,
        description: "Der Produktionsstart von Plattform A rückt vom alten auf den neuen Termin des Releases.",
      },
      {
        id: "assist-shift",
        kind: "bar",
        lane: "lane-assist",
        category: "cat-shift",
        title: "Anlauf verschoben",
        start: ORIGINAL,
        end: LAST_DAY_BEFORE_RELEASE,
        arrow: true,
        description:
          "Ausstattung SW-1101 und SW-1102: Produktion erst ab dem neuen Termin. Fahrzeuge ohne diese Ausstattung " +
          "laufen weiter und lassen sich später per Parametrierung nachrüsten.",
      },
      {
        id: "charging-shift",
        kind: "bar",
        lane: "lane-charging",
        category: "cat-shift",
        title: "Anlauf verschoben",
        start: ORIGINAL,
        end: LAST_DAY_BEFORE_RELEASE,
        arrow: true,
        description:
          "Ausstattung SW-1201: Produktion erst ab dem neuen Termin. Fahrzeuge ohne diese Ausstattung laufen weiter " +
          "und lassen sich später per Parametrierung nachrüsten.",
      },

      // Navigation
      {
        id: "navigation-without",
        kind: "bar",
        lane: "lane-navigation",
        category: "cat-without",
        title: "ohne Funktion",
        start: ORIGINAL,
        end: LAST_DAY_BEFORE_RELEASE,
        description: "Ausstattung SW-1301: Fahrzeuge gehen zunächst ohne diese Funktion in Produktion und Auslieferung.",
      },
      {
        id: "navigation-aftercare",
        kind: "bar",
        lane: "lane-navigation",
        category: "cat-aftercare",
        title: "Nachparametrierung",
        start: RELEASE,
        end: AFTERCARE_UNTIL,
        arrow: true,
        description: "Nach dem Release parametriert der Service die betroffenen Fahrzeuge nach.",
      },

      // Flottenanbindung
      {
        id: "fleet-without",
        kind: "bar",
        lane: "lane-fleet",
        category: "cat-without",
        title: "ohne Funktion",
        start: ORIGINAL,
        end: LAST_DAY_BEFORE_RELEASE,
        description:
          "Ausstattung SW-1401 und SW-1402: Fahrzeuge gehen zunächst ohne diese Funktionen in Produktion und " +
          "Auslieferung.",
      },
      {
        id: "fleet-aftercare",
        kind: "bar",
        lane: "lane-fleet",
        category: "cat-aftercare",
        title: "Nachparametrierung",
        start: RELEASE,
        end: AFTERCARE_UNTIL,
        arrow: true,
        description: "Nach dem Release parametriert der Service die betroffenen Fahrzeuge nach.",
      },

      // Stichtage
      {
        id: "dl-original",
        kind: "deadline",
        category: "cat-shift",
        title: "Ursprünglicher Termin",
        date: ORIGINAL,
        description: "Ursprünglich geplanter Termin des Software-Releases 3.4.",
      },
      {
        id: "dl-release",
        kind: "deadline",
        category: "cat-release",
        title: "Software-Release 3.4",
        date: RELEASE,
        description: "Neuer Termin. Ab hier laufen die gekoppelten Anläufe und Funktionen.",
      },
    ],
  };
}
