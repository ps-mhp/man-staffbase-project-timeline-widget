# project-timeline-widget

Staffbase-Custom-Widget **„Projektplan"**: ein Projektplan als Zeitstrahl.
Ebenen untereinander, darin Meilensteine und Zeiträume, darüber Stichtage, die
durch alle Ebenen laufen, dazwischen Abhängigkeiten als gestrichelte Linien.
Leser:innen zoomen stufenlos von mehreren Jahren bis auf einzelne Tage,
filtern nach Kategorie, Ebene, Zeitraum und Text und laden das Ergebnis als
Excel-Tabelle herunter. Gepflegt wird der Plan in einem eigenen Editor, der im
Konfigurationsdialog an die Stelle des Felds `plan` tritt.

| Attribut       | Typ     | Bedeutung                                                            |
| -------------- | ------- | -------------------------------------------------------------------- |
| `plan`         | JSON, verpackt als `b64:`-Payload | Überschrift, Ebenen, Kategorien, Einträge, Startansicht |
| `show-today`   | Boolean | Heute-Linie zeigen; Vorgabe an                                       |
| `allow-export` | Boolean | Excel-Export für Leser:innen anbieten; Vorgabe an                    |

Die Überschrift steht im Plan (`plan.title`), nicht in einem eigenen
Attribut: `title` ist ein globales HTML-Attribut (Tooltip über dem ganzen
Widget), und die Übersetzung verträgt nur einen Provider je Tag. Übersetzt
werden deshalb in einem Zug Überschrift, Titel von Ebenen und Kategorien sowie
Titel und Beschreibung der Einträge (`translation-provider.ts`); `series`
bleibt als Schlüssel unübersetzt. Entwurf:
`docs/superpowers/specs/2026-09-30-project-timeline-widget-design.md` im Meta-Repo.
Die Redakteurs-Doku liegt unter `docs/`, das Live-Beispiel dafür in
`src/docs-examples.ts`.

Entwickelt, gebaut und released wird es aus dem
Meta-Repo [`ps-mhp/man-staffbase-cms-extensions`](https://github.com/ps-mhp/man-staffbase-cms-extensions);
dieses Repo enthält nur Quellcode und das ausgelieferte Bundle unter `dist/`.

```bash
scripts/sync.sh project-timeline-widget
npm run build -- --env widget=project-timeline-widget
npm test -- src/widgets/project-timeline-widget
scripts/release.sh project-timeline-widget
```
