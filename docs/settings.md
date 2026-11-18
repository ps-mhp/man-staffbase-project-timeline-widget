# Einstellungen

Der Konfigurationsdialog von Staffbase führt nur das Feld „Plan“. Es wird im
Plan-Editor gepflegt, der sich beim Öffnen der Einstellungen von selbst zeigt;
das Textfeld dahinter ist die technische Rohfassung und sollte nicht von Hand
bearbeitet werden. Die früheren Felder **Heute-Linie zeigen** und
**Excel-Export anbieten** sind im Dialog ausgeblendet und stehen im
Plan-Editor unter **Einstellungen**; ihre Werte liegen im Plan. Ein Block, an
dem sie nie im Editor umgelegt wurden, behält, was er vorher zeigte. Auch die
Überschrift des Plans ist kein Feld des Dialogs, sondern wird im Plan-Editor
gepflegt.

| Attribut | Beschriftung | Beschreibung |
| --- | --- | --- |
| `plan` | Plan | Überschrift, Ebenen, Kategorien, Einträge, Startansicht und die Schalter für Heute-Linie und Export. Wird im Plan-Editor gepflegt. Voreingestellt: leer. |
| `show-today` | Heute-Linie zeigen | Nur noch Rückfall für Pläne, die den Schalter nicht tragen. Im Editor als **Heute-Linie zeigen** unter **Einstellungen**: Eine dunkle senkrechte Linie mit „Heute“ in der Achse markiert den heutigen Tag, sofern er im sichtbaren Ausschnitt liegt. Voreingestellt: an. |
| `allow-export` | Excel-Export anbieten | Nur noch Rückfall wie oben. Im Editor als **Excel-Export anbieten**: Zeigt Leser:innen den Knopf **Exportieren**, über den sie die Einträge als Excel-Tabelle herunterladen. Voreingestellt: an. |

## Der Plan-Editor

Der Plan-Editor füllt den ganzen Bildschirm. Oben steht der Kopf des
gemeinsamen Rahmens, darunter links die **Einträge**, in der Mitte das
Formular des gewählten Eintrags und rechts das Panel **Plan**.

### Kopf

| Bedienelement | Beschreibung |
| --- | --- |
| Editor · Desktop · Tablet · Mobil | **Editor** zeigt das Formular. Die Geräteansichten zeigen statt seiner den Plan in Gerätebreite — dieselbe Ansicht wie auf der Seite, mit Zoom, ohne Filter und Export; ein Klick auf einen Eintrag wählt ihn. |
| Status | „3 Einträge geändert · Ebenen“ — was sich gegenüber dem zuletzt übernommenen Stand unterscheidet. Ein Eintrag, dessen Ebene fehlt, verhindert das Übernehmen. |
| Rückgängig / Wiederholen | Nehmen Änderungen schrittweise zurück oder stellen sie wieder her (⌘/Strg Z, ⇧⌘/Strg Z). |
| Hilfe | Erklärt die Bedienung (F1). |
| Abbrechen | Schließt den Editor; bei nicht übernommenen Änderungen fragt er vorher, ob sie verworfen werden. |
| Übernehmen | Schreibt den Plan in die Einstellungen (⌘/Strg S); **Übernehmen und schließen** auch mit ⌘/Strg ↵. Gespeichert wird er mit der Seite. |

### Seitenleiste „Einträge“

Links die Liste der Einträge, nach Termin sortiert, mit der Zahl („12 von
300“). **Neu** legt einen **Meilenstein**, **Zeitraum** oder **Stichtag** an;
ohne Ebene geht nur der Stichtag. Darunter stehen **Einträge durchsuchen** und
die Auswahl der Art (**Alle Arten**, **Meilensteine**, **Zeiträume**,
**Stichtage**, je mit Anzahl; bei aktiver Suche: Treffer).

### Formular des Eintrags

Über dem Formular stehen „Eintrag 4 von 12“, die Art und die Knöpfe **Eintrag
duplizieren** und **Eintrag löschen**, darunter die Reiter **Allgemein**
(Art, Titel, Beschreibung, Vorläufig), **Einordnung** (Ebene, Kategorie,
Serie), **Termin** (Datum bzw. Beginn und Ende, beim Zeitraum Pfeil am Ende),
**Abhängigkeiten** und **Inhalt** (verknüpfte Seite oder News-Beitrag,
Anhänge). „(Fehler)“ hinter einem Reiter zeigt eine ungültige Eingabe darin;
bei Stichtagen entfällt **Abhängigkeiten**:

| Feld | Gilt für | Beschreibung |
| --- | --- | --- |
| Art | alle | Meilenstein, Zeitraum oder Stichtag. Beim Wechsel zum Stichtag entfällt die Ebene. Ohne Ebene bleibt ein Stichtag, was er ist. |
| Titel | alle | Pflicht. Steht am Eintrag und in den Details. |
| Beschreibung | alle | Optional, mehrzeilig. Erscheint nur in den Details und im Excel-Export. |
| Vorläufig | alle | Der Termin steht noch nicht fest; der Eintrag erscheint als Umriss bzw. mit gestricheltem Rand. |
| Ebene | Meilenstein, Zeitraum | Die Ebene, in der der Eintrag steht. **Neue Ebene …** legt eine an (Name) und weist sie gleich zu. |
| Kategorie | alle | Bestimmt die Farbe und bei Meilensteinen die Form. „Ohne Kategorie“ erscheint grau, Meilensteine als Raute. **Neue Kategorie …** legt eine an (Name, Farbe und Form) und weist sie gleich zu. |
| Serie | Meilenstein, Zeitraum | Einträge derselben Ebene mit gleichem Seriennamen stehen auf einer Zeile. Das Feld klappt die Serien dieser Ebene mit der Zahl ihrer Einträge auf; ein getippter neuer Name wird über „„…“ als neue Serie anlegen“ übernommen, **Keine Serie** nimmt den Eintrag heraus. |
| Datum | Meilenstein, Stichtag | Der Termin. |
| Beginn, Ende | Zeitraum | Erster und letzter Tag; beide gehören zum Zeitraum. |
| Pfeil am Ende | Zeitraum | Der Balken endet in einer Pfeilspitze — „läuft weiter“. |
| Hängt ab von | Meilenstein, Zeitraum | Die Vorgänger des Eintrags; auf der Seite als gestrichelte Linie mit Pfeil. |
| Verknüpfung | alle | **Keine**, **Seite** oder **News-Beitrag**. Ein Wechsel löst eine bestehende Verknüpfung. Auf der Seite ist die Beschriftung des Eintrags dann unterstrichen, und ein Klick öffnet den Inhalt in einem Fenster über dem Plan. |
| Seite | alle | Die Staffbase-Seite aus der Liste der Seiten (die 100 zuletzt bearbeiteten). **Neue Seite …** legt sie im Staffbase-Editor an, der sich über den Plan-Editor legt; nach dem Erstellen ist sie verknüpft. |
| Kanal, Beitrag | alle | Erst der News-Kanal (mit seinem Typ: Artikel, Kurznachricht, Bildbeitrag), dann der Beitrag. Entwürfe sind wählbar und mit „(Entwurf)“ gekennzeichnet — Leser:innen sehen sie erst nach dem Veröffentlichen. **Neuer Beitrag …** legt im gewählten Kanal einen an; nach dem Speichern ist er verknüpft. **In neuem Tab öffnen** zeigt den verknüpften Inhalt. |
| Anhänge | alle | Bis zu zehn Dateien oder Bilder aus der Medienbibliothek, je mit optionaler Beschriftung (sonst der Dateiname). **Datei oder Bild hinzufügen …** öffnet die Bibliothek; die Pfeile ordnen, das Kreuz entfernt. Anhänge bleiben hinter der Anmeldung. Auf der Seite stehen sie neben dem verknüpften Inhalt bzw. in den Details, im Excel-Export in der Spalte „Anhänge“. |
| Eintrag duplizieren | alle | Legt eine Kopie des Eintrags an. |
| Eintrag löschen | alle | Fragt nach und entfernt dann den Eintrag und alle Abhängigkeiten, die auf ihn zeigen; die Rückfrage nennt die abhängigen Einträge. |

### Panel „Plan“: Einstellungen

| Bedienelement | Beschreibung |
| --- | --- |
| Titel des Plans | Steht über dem Plan und gibt der Excel-Datei ihren Namen. Optional: Leer lassen, wenn die Seite schon eine passende Überschrift trägt; die Datei heißt dann `Projektplan_JJJJ-MM-TT.xlsx`. |
| Heute-Linie zeigen | Schalter, siehe oben. Solange er im Editor nie bedient wurde, steht dabei, dass der Block seine bisherige Einstellung behält. |
| Excel-Export anbieten | Schalter, siehe oben; ebenso. |
| Diesen Ausschnitt übernehmen | Speichert den sichtbaren Ausschnitt der Vorschau (Ansicht Desktop, Tablet oder Mobil), monatsgenau, als Ansicht beim Laden der Seite. Ohne gemeldeten Ausschnitt gesperrt. |
| Startansicht entfernen | Löscht die Startansicht; das Widget zeigt beim Laden wieder den ganzen Plan. |
| Mit Vorlage beginnen | Nur bei leerem Plan, in der Mitte: zeigt die Vorlagen zur Wahl („Produkt-Roadmap“, „Terminverschiebung“). Ein Klick auf eine Karte füllt den Editor mit ihr; **Zurück** kehrt ohne Änderung zurück. Auf einem Plan mit Einträgen gibt es das nicht — die Vorlage würde sie ersetzen. |
| Leer beginnen | Nur bei leerem Plan: legt eine Ebene „Ebene 1“ an. |

### Panel „Plan“: Ebenen

| Bedienelement | Beschreibung |
| --- | --- |
| Neue Ebene | Legt eine neue Ebene an. |
| Name | Der Name der Ebene, links neben ihrer Bahn. Muss eindeutig sein. Darunter steht, wie viele Einträge sie enthält. |
| Pfeile nach oben / nach unten | Reihenfolge auf der Seite und im Excel-Export. |
| Löschen | Entfernt die Ebene. Enthält sie Einträge, fragt der Editor, ob diese in eine andere Ebene verschoben werden sollen (Auswahl **Ziel-Ebene**) oder ob sie mitgelöscht werden. |

### Panel „Plan“: Kategorien

| Bedienelement | Beschreibung |
| --- | --- |
| Neue Kategorie | Legt eine neue Kategorie an. |
| Farbfeld | Vor dem Namen; zeigt die Farbe. Ein Klick klappt die zwölf Farben und das Feld **Hex-Wert** auf; Esc oder ein Klick daneben schließt. |
| Hex-Wert | Eine eigene Farbe im Format `#RRGGBB`, zum Beispiel `#E40045`. |
| Formknopf | Neben dem Farbfeld; zeigt die Form, mit der die Meilensteine der Kategorie erscheinen. Ein Klick klappt die acht Formen auf: Raute, Dreieck, Dreieck mit der Spitze nach unten, Quadrat, Kreis, Sechseck, Stern oder Kreuz. Pfeiltasten wechseln die Form. |
| Name | Der Name in der Legende und in den Details. Muss eindeutig sein. Darunter steht, wie vielen Einträgen die Kategorie zugeordnet ist. |
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
- **Titel des Plans**, **Startansicht**, **Heute-Linie** und **Export** werden im
  Plan-Editor gesetzt, nicht im Dialog; alle gehören zum Plan.
