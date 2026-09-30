# Einstellungen

Der Konfigurationsdialog des Widgets führt drei Felder. „Plan“ wird im
Plan-Editor gepflegt, der sich beim Öffnen der Einstellungen von selbst zeigt;
das Textfeld dahinter ist die technische Rohfassung und sollte nicht von Hand
bearbeitet werden. Die übrigen zwei Felder stehen direkt im Dialog. Die
Überschrift des Plans ist kein Feld des Dialogs, sondern wird im Plan-Editor
gepflegt (siehe unten).

| Attribut | Beschriftung im Dialog | Beschreibung |
| --- | --- | --- |
| `plan` | Plan | Überschrift, Ebenen, Kategorien, Einträge und die Startansicht. Wird im Plan-Editor gepflegt. Voreingestellt: leer. |
| `show-today` | Heute-Linie zeigen | Eine dunkle senkrechte Linie mit „Heute“ in der Achse markiert den heutigen Tag, sofern er im sichtbaren Ausschnitt liegt. Voreingestellt: an. |
| `allow-export` | Excel-Export anbieten | Zeigt Leser:innen den Knopf **Exportieren**, über den sie die Einträge als Excel-Tabelle herunterladen. Voreingestellt: an. |

## Der Plan-Editor

Der Plan-Editor besteht aus dem Feld **Überschrift**, der **Vorschau** und
drei Reitern. Oben rechts steht, wie viele Einträge der Plan trägt, zum
Beispiel „42 / 300 Einträge“.

### Überschrift

| Feld | Beschreibung |
| --- | --- |
| Überschrift | Oben im Plan-Editor. Steht über dem Plan und gibt der Excel-Datei ihren Namen. Optional: Leer lassen, wenn die Seite schon eine passende Überschrift trägt; die Datei heißt dann `Projektplan_JJJJ-MM-TT.xlsx`. |

### Vorschau

| Bedienelement | Beschreibung |
| --- | --- |
| Vorschau | Derselbe Zeitstrahl wie auf der Seite, mit Zoom, ohne Filter und Export. Ein Klick auf einen Eintrag wählt ihn im Reiter „Einträge“ aus. Lässt sich einklappen. |
| Diesen Ausschnitt als Startansicht | Speichert den sichtbaren Ausschnitt der Vorschau, monatsgenau, als Ansicht beim Laden der Seite. |
| Startansicht entfernen | Löscht die Startansicht; das Widget zeigt beim Laden wieder den ganzen Plan. |
| Mit Beispielplan beginnen | Nur bei leerem Plan: füllt den Editor mit einer Überschrift, drei Ebenen, sieben Kategorien und Beispiel-Einträgen. |

### Reiter „Einträge“

Links die Liste aller Einträge, nach Termin sortiert und über **Einträge
durchsuchen** durchsuchbar; darüber unter **Hinzufügen** je ein Knopf für
**Meilenstein**, **Zeitraum** und **Stichtag**. Rechts das Formular des
gewählten Eintrags:

| Feld | Gilt für | Beschreibung |
| --- | --- | --- |
| Art | alle | Meilenstein, Zeitraum oder Stichtag. Beim Wechsel zum Stichtag entfällt die Ebene. |
| Titel | alle | Pflicht. Steht am Eintrag und in den Details. |
| Beschreibung | alle | Optional, mehrzeilig. Erscheint nur in den Details und im Excel-Export. |
| Ebene | Meilenstein, Zeitraum | Die Ebene, in der der Eintrag steht. |
| Kategorie | alle | Bestimmt die Farbe. „Ohne Kategorie“ erscheint grau. |
| Datum | Meilenstein, Stichtag | Der Termin. |
| Beginn, Ende | Zeitraum | Erster und letzter Tag; beide gehören zum Zeitraum. |
| Symbol | Meilenstein | Raute (Vorgabe), Dreieck, Quadrat oder Kreis. |
| Pfeil am Ende | Zeitraum | Der Balken endet in einer Pfeilspitze — „läuft weiter“. |
| Serie | Meilenstein, Zeitraum | Einträge derselben Ebene mit gleichem Seriennamen stehen auf einer Zeile. Das Feld schlägt die Serien dieser Ebene vor. |
| Vorläufig | alle | Der Termin steht noch nicht fest; der Eintrag erscheint als Umriss bzw. mit gestricheltem Rand. |
| Hängt ab von | Meilenstein, Zeitraum | Die Vorgänger des Eintrags; auf der Seite als gestrichelte Linie mit Pfeil. |
| Duplizieren | alle | Legt eine Kopie des Eintrags an. |
| Löschen | alle | Entfernt den Eintrag und alle Abhängigkeiten, die auf ihn zeigen. |

### Reiter „Ebenen“

| Bedienelement | Beschreibung |
| --- | --- |
| Neue Ebene | Legt eine neue Ebene an. |
| Name | Der Name der Ebene, links neben ihrer Bahn. Daneben steht, wie viele Einträge sie enthält. |
| Pfeile nach oben / nach unten | Reihenfolge auf der Seite und im Excel-Export. |
| Löschen | Entfernt die Ebene. Enthält sie Einträge, fragt der Editor, ob diese in eine andere Ebene verschoben werden sollen (Auswahl **Ziel-Ebene**) oder ob sie mitgelöscht werden. |

### Reiter „Kategorien“

| Bedienelement | Beschreibung |
| --- | --- |
| Neue Kategorie | Legt eine neue Kategorie an. |
| Name | Der Name in der Legende und in den Details. |
| Farbe | Eines von zwölf Farbfeldern. |
| Hex-Wert | Eine eigene Farbe im Format `#RRGGBB`, zum Beispiel `#E40045`. |
| Pfeile nach oben / nach unten | Reihenfolge der Legende. |
| Löschen | Entfernt die Kategorie; ihre Einträge werden „ohne Kategorie“. Die Rückfrage nennt ihre Zahl. |

## Grenzen

- Ein Plan trägt höchstens **300 Einträge**, **20 Ebenen** und
  **24 Kategorien**. Darüber hinaus nimmt der Editor nichts mehr an.
- Termine sind **ganze Tage** ohne Uhrzeit. Die Startansicht ist
  **monatsgenau**.
- Text steht nie in der Farbe der Kategorie — helle Farben wie Gelb blieben
  auf Weiß sonst unlesbar. Die Farbe tragen nur Symbol, Balken und
  Legendenpunkt; die Schrift im Balken ist schwarz oder weiß, je nachdem, was
  besser lesbar ist.
- **Ohne Einträge zeigt das Widget nichts** — weder einen leeren Rahmen noch
  eine Meldung.

## Abhängigkeiten zwischen den Einstellungen

- **Heute-Linie zeigen** wirkt nur, wenn der heutige Tag im sichtbaren
  Ausschnitt liegt. Bei einem Plan, der ganz in der Vergangenheit oder
  Zukunft liegt, ist die Linie deshalb erst nach dem Verschieben zu sehen.
- Die **Überschrift** bestimmt auch den Namen der Excel-Datei; ohne
  eingeschalteten Export wirkt sie nur als Überschrift.
- **Überschrift** und **Startansicht** werden im Plan-Editor gesetzt, nicht im
  Dialog; beide sind Teil des Plans.
