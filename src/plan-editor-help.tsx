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
 * Die Hilfe des Plan-Editors in der Leiste des Rahmens. Tasten und den Satz
 * zu „Übernehmen“ ergänzt der Rahmen selbst; hier steht nur, was es nur in
 * diesem Widget gibt.
 */

import * as React from "react";

import { LIMITS } from "./plan-model";

export const PLAN_EDITOR_HELP = (
  <ul className="flex list-disc flex-col gap-2 pl-5">
    <li>
      Links stehen die <strong>Einträge</strong> nach Termin. Über „Neu“ entsteht ein Meilenstein, ein Zeitraum oder ein
      Stichtag; die Suche und die Auswahl der Art grenzen die Liste ein. Höchstens {LIMITS.items} Einträge.
    </li>
    <li>
      Das Formular in der Mitte hat fünf Reiter: <strong>Allgemein</strong> (Art, Titel, Beschreibung, vorläufig),{" "}
      <strong>Einordnung</strong> (Ebene, Kategorie, Serie), <strong>Termin</strong>, <strong>Abhängigkeiten</strong> und{" "}
      <strong>Inhalt</strong> (verknüpfte Seite oder Beitrag, Anhänge).
    </li>
    <li>
      Rechts stehen die Einstellungen des <strong>Plans</strong>: Überschrift, Startansicht, Heute-Linie und Export;
      in den Reitern <strong>Ebenen</strong> und <strong>Kategorien</strong> Reihenfolge, Farbe und Form der Meilensteine.
    </li>
    <li>
      In <strong>Desktop</strong>, <strong>Tablet</strong> und <strong>Mobil</strong> steht der Plan statt des Formulars:
      ein Klick auf einen Eintrag wählt ihn, Zoomen und Verschieben wie auf der Seite. Dort legt „Diesen Ausschnitt
      übernehmen“ die Startansicht fest.
    </li>
    <li>Löschen nimmt die Verbindungen zu anderen Einträgen mit; die Rückfrage nennt, wie viele es sind.</li>
    <li>
      Heute-Linie und Export stehen rechts unter „Einstellungen“. Ein Block, an dem sie nie geändert wurden, behält,
      was bisher für ihn galt.
    </li>
  </ul>
);
