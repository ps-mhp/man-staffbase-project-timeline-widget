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

Der Plan-Editor füllt den ganzen Bildschirm. Oben steht die Kopfleiste, darunter
die **Vorschau** und drei Reiter. Zwischen Vorschau und Reitern sowie zwischen
Eintragsliste und Formular sitzt je ein Ziehgriff, mit dem sich die Höhe der
Vorschau und die Breite der Liste ändern lassen (Maus oder Pfeiltasten,
Doppelklick stellt die Vorgabe wieder her; der Browser merkt sich die Größen).

### Kopfleiste

| Bedienelement | Beschreibung |
| --- | --- |
| Überschrift | Steht über dem Plan und gibt der Excel-Datei ihren Namen. Optional: Leer lassen, wenn die Seite schon eine passende Überschrift trägt; die Datei heißt dann `Projektplan_JJJJ-MM-TT.xlsx`. |
| „42 / 300 Einträge“ | Wie viele Einträge der Plan trägt, gemessen an der Obergrenze. |
| „Ungespeicherte Änderungen“ | Erscheint, sobald der Plan im Editor vom gespeicherten abweicht. |
| Abbrechen | Schließt den Editor; bei ungespeicherten Änderungen fragt er vorher, ob sie verworfen werden sollen. |
| Übernehmen | Schreibt den Plan in die Einstellungen und schließt den Editor. Gespeichert wird er mit der Seite. |

### Vorschau

| Bedienelement | Beschreibung |
| --- | --- |
| Vorschau | Derselbe Zeitstrahl wie auf der Seite, mit Zoom, ohne Filter und Export. Ein Klick auf einen Eintrag wählt ihn im Reiter „Einträge“ aus und holt ihn in der Liste in Sicht. Ein Klick auf **Vorschau** klappt sie ein; ausgeklappt hat sie wieder die zuletzt gezogene Höhe. |
| Diesen Ausschnitt als Startansicht | Speichert den sichtbaren Ausschnitt der Vorschau, monatsgenau, als Ansicht beim Laden der Seite. |
| Startansicht entfernen | Löscht die Startansicht; das Widget zeigt beim Laden wieder den ganzen Plan. |
| Mit Vorlage beginnen | Nur bei leerem Plan: zeigt die Vorlagen zur Wahl („Produkt-Roadmap“, „Terminverschiebung“). Ein Klick auf eine Karte füllt den Editor mit ihr; **Zurück** kehrt ohne Änderung zurück. |
| Leer beginnen | Nur bei leerem Plan: legt eine Ebene „Ebene 1“ an. |

### Reiter „Einträge“

Links die Liste der Einträge, nach Termin sortiert. Darüber stehen oben
**Einträge durchsuchen** und darunter ein Umschalter für die Art —
**Meilensteine**, **Zeiträume**, **Stichtage**, je mit Anzahl (bei aktiver
Suche: Treffer); der Knopf **+** daneben legt einen Eintrag dieser Art an,
und die Suche wirkt innerhalb der Art.
Beim Überfahren einer Zeile erscheint rechts ein Papierkorb zum Löschen (mit
Rückfrage).

Rechts das Formular des gewählten Eintrags; über ihm stehen sein Titel und
die Knöpfe **Duplizieren** und **Löschen**, darunter die Reiter **Allgemein**
(Art, Titel, Beschreibung), **Einordnung** (Ebene, Kategorie, Serie),
**Termin** (Datum bzw. Beginn und Ende, beim Zeitraum Pfeil am Ende, Vorläufig)
**Abhängigkeiten** und **Inhalt** (verknüpfte Seite oder News-Beitrag). Ein
roter Punkt am Reiter zeigt eine ungültige Eingabe darin; bei Stichtagen
entfällt **Abhängigkeiten**:

| Feld | Gilt für | Beschreibung |
| --- | --- | --- |
| Art | alle | Meilenstein, Zeitraum oder Stichtag. Beim Wechsel zum Stichtag entfällt die Ebene. |
| Titel | alle | Pflicht. Steht am Eintrag und in den Details. |
| Beschreibung | alle | Optional, mehrzeilig. Erscheint nur in den Details und im Excel-Export. |
| Ebene | Meilenstein, Zeitraum | Die Ebene, in der der Eintrag steht. **Neue Ebene …** legt eine an (Name) und weist sie gleich zu. |
| Kategorie | alle | Bestimmt die Farbe und bei Meilensteinen die Form. „Ohne Kategorie“ erscheint grau, Meilensteine als Raute. **Neue Kategorie …** legt eine an (Name, Farbe und Form) und weist sie gleich zu. |
| Datum | Meilenstein, Stichtag | Der Termin. |
| Beginn, Ende | Zeitraum | Erster und letzter Tag; beide gehören zum Zeitraum. |
| Pfeil am Ende | Zeitraum | Der Balken endet in einer Pfeilspitze — „läuft weiter“. |
| Serie | Meilenstein, Zeitraum | Einträge derselben Ebene mit gleichem Seriennamen stehen auf einer Zeile. Das Feld klappt die Serien dieser Ebene mit der Zahl ihrer Einträge auf; ein getippter neuer Name wird über „„…“ als neue Serie anlegen“ übernommen, **Keine Serie** nimmt den Eintrag heraus. |
| Vorläufig | alle | Der Termin steht noch nicht fest; der Eintrag erscheint als Umriss bzw. mit gestricheltem Rand. |
| Hängt ab von | Meilenstein, Zeitraum | Die Vorgänger des Eintrags; auf der Seite als gestrichelte Linie mit Pfeil. |
| Verknüpfung | alle | **Keine**, **Seite** oder **News-Beitrag**. Ein Wechsel löst eine bestehende Verknüpfung. Auf der Seite ist die Beschriftung des Eintrags dann unterstrichen, und ein Klick öffnet den Inhalt in einem Fenster über dem Plan. |
| Seite | alle | Die Staffbase-Seite aus der Liste der Seiten (die 100 zuletzt bearbeiteten). |
| Kanal, Beitrag | alle | Erst der News-Kanal (mit seinem Typ: Artikel, Kurznachricht, Bildbeitrag), dann der Beitrag. Entwürfe sind wählbar und mit „(Entwurf)“ gekennzeichnet — Leser:innen sehen sie erst nach dem Veröffentlichen. **In neuem Tab öffnen** zeigt den verknüpften Inhalt. |
| Anhänge | alle | Bis zu zehn Dateien oder Bilder aus der Medienbibliothek, je mit optionaler Beschriftung (sonst der Dateiname). **Datei oder Bild hinzufügen …** öffnet die Bibliothek; **↑**/**↓** ordnen, **×** entfernt. Anhänge bleiben hinter der Anmeldung. Auf der Seite stehen sie neben dem verknüpften Inhalt bzw. in den Details, im Excel-Export in der Spalte „Anhänge“. |
| Duplizieren | alle | Legt eine Kopie des Eintrags an. |
| Löschen | alle | Fragt nach und entfernt dann den Eintrag und alle Abhängigkeiten, die auf ihn zeigen; die Rückfrage nennt die abhängigen Einträge. |

### Reiter „Ebenen“

| Bedienelement | Beschreibung |
| --- | --- |
| Neue Ebene | Oben rechts im Reiter. Legt eine neue Ebene an. |
| Name | Der Name der Ebene, links neben ihrer Bahn. Muss eindeutig sein. Daneben steht, wie viele Einträge sie enthält. |
| Pfeile nach oben / nach unten | Reihenfolge auf der Seite und im Excel-Export. |
| Löschen | Entfernt die Ebene. Enthält sie Einträge, fragt der Editor, ob diese in eine andere Ebene verschoben werden sollen (Auswahl **Ziel-Ebene**) oder ob sie mitgelöscht werden. |

### Reiter „Kategorien“

| Bedienelement | Beschreibung |
| --- | --- |
| Neue Kategorie | Oben rechts im Reiter. Legt eine neue Kategorie an. |
| Farbfeld | Vor dem Namen; zeigt die Farbe. Ein Klick klappt die zwölf Farben und das Feld **Hex-Wert** auf; Esc oder ein Klick daneben schließt. |
| Hex-Wert | Eine eigene Farbe im Format `#RRGGBB`, zum Beispiel `#E40045`. |
| Formknopf | Neben dem Farbfeld; zeigt die Form, mit der die Meilensteine der Kategorie erscheinen. Ein Klick klappt die acht Formen auf: Raute, Dreieck, Dreieck mit der Spitze nach unten, Quadrat, Kreis, Sechseck, Stern oder Kreuz. Pfeiltasten wechseln die Form. |
| Name | Der Name in der Legende und in den Details. Muss eindeutig sein. Daneben steht, wie vielen Einträgen die Kategorie zugeordnet ist. |
| Pfeile nach oben / nach unten | Reihenfolge der Legende. |
| Löschen | Entfernt die Kategorie; ihre Einträge werden „ohne Kategorie“. Die Rückfrage nennt ihre Zahl. |

## Grenzen

- Ein Plan trägt höchstens **300 Einträge**, **20 Ebenen** und
  **24 Kategorien**. Darüber hinaus nimmt der Editor nichts mehr an.
- Termine sind **ganze Tage** ohne Uhrzeit. Die Startansicht ist
  **monatsgenau**.
- Text steht nie in der Farbe der Kategorie — helle Farben wie Gelb blieben
  auf Weiß sonst unlesbar. Die Farbe tragen nur Form, Balken und
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
