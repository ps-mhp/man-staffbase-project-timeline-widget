# Projektplan

Dieses Widget zeigt einen Projektplan als **Zeitstrahl** — etwa den Fahrplan
eines Fahrzeug-Launches mit Messen, Serienanläufen (SOPs) und
Projekt-Meilensteinen über mehrere Jahre. Es ersetzt die PowerPoint-Folie,
die für solche Pläne bisher gepflegt und als Bild eingebunden wurde: Der Plan
steht direkt auf der Seite, lässt sich jederzeit ändern, und Leser:innen
können ihn selbst erkunden, filtern und als Excel-Tabelle herunterladen.

Gepflegt wird der ganze Plan im **Plan-Editor**, der sich beim Öffnen der
Einstellungen von selbst zeigt.

## Woraus ein Plan besteht

- **Überschrift** — optional; steht über dem Plan und gibt der Excel-Datei
  ihren Namen.
- **Ebenen** — waagerechte Bahnen untereinander, zum Beispiel „Messen“,
  „Launches / SOPs“ und „Projekt-Meilensteine“. Links steht jeweils ihr Titel.
- **Kategorien** — geben den Einträgen ihre Farbe und erscheinen als Legende
  über dem Plan, zum Beispiel „MY26 TG Assist“ in Violett.
- **Einträge** in drei Arten:
  - **Meilenstein** — ein einzelner Termin, gezeigt als Symbol (Raute,
    Dreieck, Quadrat oder Kreis) mit dem Titel darunter.
  - **Zeitraum** — ein Balken von Beginn bis Ende, auf Wunsch mit einer
    Pfeilspitze am Ende für „läuft weiter“.
  - **Stichtag** — ein Termin, der für alle Ebenen gilt, etwa eine neue
    Vorschrift. Er erscheint als gestrichelte senkrechte Linie durch den ganzen
    Plan, mit dem Titel darunter.
- **Serien** — Meilensteine und Zeiträume derselben Ebene mit gleichem
  Seriennamen stehen auf einer gemeinsamen Zeile. Gehört ein Zeitraum dazu,
  sitzen die Meilensteine auf seinem Balken; sonst verbindet eine schmale
  Leiste den ersten mit dem letzten.
- **Abhängigkeiten** — gestrichelte Linien mit Pfeil vom Vorgänger zum
  Nachfolger, zum Beispiel von „C4S“ zum zugehörigen SOP.
- **Vorläufig** — ein Eintrag, dessen Termin noch nicht feststeht. Er
  erscheint nur als Umriss beziehungsweise hell gefüllt mit gestricheltem Rand.

## Was Leser:innen sehen

Von oben nach unten:

1. **Überschrift** (falls gesetzt) und **„Stand: …“** — das Datum der letzten
   Änderung am Plan, im Datumsformat der Seitensprache.
2. **Werkzeugleiste** — Suche, **Filter**, Zoom (**−**, **+**, **Alles
   zeigen**), der Umschalter **Zeitstrahl | Liste** und **Exportieren**.
3. **Legende** — die Kategorien mit ihrer Farbe. Ein Klick blendet eine
   Kategorie aus oder wieder ein.
4. **Der Plan** — links die Titel der Ebenen, rechts die Zeitachse mit den
   Einträgen, unter der letzten Ebene die Titel der Stichtage.
5. **Übersicht** — ein schmaler Streifen über den ganzen Zeitraum. Ein Rahmen
   zeigt, welcher Ausschnitt gerade zu sehen ist.

Außerdem:

- **Zoomen** geht stufenlos: über die Knöpfe **−** und **+**, mit gedrückter
  Strg-Taste (Mac: ⌘) und dem Mausrad oder mit zwei Fingern auf Trackpad und
  Touchscreen. Die Achse wechselt dabei von Jahren über Quartale und Monate bis
  zu Kalenderwochen und einzelnen Tagen.
- **Verschieben** geht durch Ziehen mit der Maus, mit Shift und dem Mausrad,
  durch waagerechtes Wischen oder durch Ziehen des Rahmens in der Übersicht.
- Ein **Klick auf einen Eintrag** öffnet seine Details: Art und Termin,
  Kategorie, Ebene, Serie, Beschreibung sowie Vorgänger und Nachfolger.
- **Filter** und **Suche** gelten nur für den eigenen Besuch; gespeichert oder
  an andere weitergegeben wird nichts.
- **Liste** zeigt dieselben Einträge als Tabelle, nach Termin sortiert — der
  bequemere Weg für Screenreader, schmale Bildschirme und zum Drucken.
- **Exportieren** lädt die Einträge als Excel-Datei herunter, sofern der
  Export in den Einstellungen eingeschaltet ist.
- Eine dunkle Linie **„Heute“** markiert den heutigen Tag, sofern sie
  eingeschaltet ist und der Tag im sichtbaren Ausschnitt liegt.
- Die Bedienung funktioniert auch ohne Maus: Tab springt in den Plan, die
  Pfeiltasten wechseln zwischen den Einträgen, Enter öffnet die Details,
  **+** und **−** zoomen, **0** zeigt alles.
- Auf schmalen Bildschirmen (unter 768 Pixel Breite) öffnen sich Filter und
  Details als Blatt vom unteren Rand, und **Liste** und **Exportieren** stehen
  im Menü **Mehr**.
- **Ohne Einträge zeigt das Widget gar nichts** — keinen leeren Rahmen und
  keine Fehlermeldung.

## Was Sie im CMS-Editor sehen

Der Plan-Editor enthält oben eine **Vorschau**: derselbe Zeitstrahl wie auf
der Seite, mit Zoom, aber ohne Filter, Liste und Export. Ein Klick auf einen
Eintrag in der Vorschau wählt ihn zum Bearbeiten aus. Wie Leser:innen den Plan
mit allen Filtern und dem Export erleben, prüfen Sie in der Vorschau der Seite.
