# Instellingen

Het configuratievenster van de widget bevat drie velden. „Plan“ wordt bijgewerkt in de
plan-editor, die automatisch verschijnt wanneer je de instellingen opent;
het tekstveld erachter is de technische ruwe versie en mag niet handmatig
worden bewerkt. De overige twee velden staan direct in het dialoogvenster. De
koptekst van het plan is geen veld in het dialoogvenster, maar wordt in de plan-editor
onderhouden (zie hieronder).

| Attribuut | Label in het dialoogvenster | Beschrijving |
| --- | --- | --- |
| `plan` | Plan | Koptekst, lagen, categorieën, items en het startscherm. Wordt bijgewerkt in de plan-editor. Standaard: leeg. |
| `show-today` | Lijn ‘Vandaag’ weergeven | Een donkere verticale lijn met ‘Vandaag’ op de as markeert de huidige dag, mits deze binnen het zichtbare gedeelte valt. Standaard: aan. |
| `allow-export` | Excel-export aanbieden | Toont lezers de knop **Exporteren**, waarmee ze de items als Excel-tabel kunnen downloaden. Standaard: aan. |

## De plan-editor

De plan-editor vult het hele scherm. Bovenaan bevindt zich de kopbalk, daaronder
het **voorbeeld** en drie tabbladen. Tussen het voorbeeld en de tabbladen, en tussen
de lijst met vermeldingen en het formulier, bevindt zich telkens een versleepgreep waarmee de hoogte van het
voorvertoning en de breedte van de lijst kan worden aangepast (met de muis of de pijltjestoetsen;
dubbelklikken herstelt de standaardinstelling; de browser onthoudt de afmetingen).

### Kopbalk

| Bedieningselement | Beschrijving |
| --- | --- |
| Koptekst | Staat boven het plan en geeft het Excel-bestand zijn naam. Optioneel: laat leeg als de pagina al een passende koptekst heeft; het bestand heet dan `Projectplan_JJJJ-MM-TT.xlsx`. |
| „42 / 300 vermeldingen“ | Hoeveel vermeldingen het plan bevat, gemeten aan de hand van de bovengrens. |
| „Niet-opgeslagen wijzigingen“ | Verschijnt zodra het plan in de editor afwijkt van de opgeslagen versie. |
| Annuleren | Sluit de editor; bij niet-opgeslagen wijzigingen wordt eerst gevraagd of deze moeten worden genegeerd. |
| Toepassen | Slaat het plan op in de instellingen en sluit de editor. Het wordt samen met de pagina opgeslagen. |

### Voorbeeld

| Bedieningselement | Beschrijving |
| --- | --- |
| Voorbeeld | Dezelfde tijdlijn als op de pagina, met zoomfunctie, zonder filters en export. Een klik op een item selecteert het in het tabblad „Items“ en brengt het in de lijst in beeld. Een klik op **Voorbeeld** vouwt de tijdlijn in; wanneer deze weer wordt uitgeklapt, heeft deze de laatst ingestelde hoogte. |
| Dit gedeelte als startweergave | Slaat het zichtbare gedeelte van het voorbeeld, per maand, op als weergave bij het laden van de pagina. |
| Startweergave verwijderen | Verwijdert de startweergave; de widget toont bij het laden weer het volledige plan. |
| Beginnen met sjabloon | Alleen bij een leeg plan: toont de sjablonen waaruit je kunt kiezen („Product-roadmap“, „Uitstel“). Een klik op een kaart vult de editor ermee; **Terug** keert terug zonder wijzigingen. |
| Leeg beginnen | Alleen bij een leeg plan: maakt een laag „Laag 1“ aan. |

### Tabblad „Items“

Links de lijst met items, gesorteerd op datum. Daarboven staat
**Items doorzoeken** en daaronder een schakelaar voor het type —
**Mijlpalen**, **Periodes**, **Deadlines**, elk met het aantal (bij actieve
zoekopdracht: treffers); de knop **+** ernaast maakt een item van dit type aan,
en de zoekopdracht werkt binnen het type.
Als je met de muis over een regel gaat, verschijnt rechts een prullenbak om te verwijderen (met
bevestigingsvraag).

Rechts het formulier van het geselecteerde item; daarboven staan de titel en
de knoppen **Dupliceren** en **Verwijderen**, daaronder de tabbladen **Algemeen**
(type, titel, beschrijving), **Indeling** (niveau, categorie, serie),
**Datum** (datum of begin en einde, bij een periode een pijl aan het einde, Voorlopig)
**Afhankelijkheden** en **Inhoud** (gekoppelde pagina of nieuwsbericht). Een
rode stip op het tabblad duidt op een ongeldige invoer daarin; bij streefdata
valt **Afhankelijkheden** weg:

| Veld | Geldt voor | Beschrijving |
| --- | --- | --- |
| Type | alle | Mijlpaal, periode of streefdatum. Bij overschakeling naar streefdatum vervalt het niveau. |
| Titel | alle | Verplicht. Wordt bij het item en in de details weergegeven. |
| Beschrijving | alle | Optioneel, meerdere regels. Wordt alleen in de details en in de Excel-export weergegeven. |
| Niveau | Mijlpaal, periode | Het niveau waarin het item zich bevindt. **Nieuw niveau …** maakt er een aan (naam) en wijst deze direct toe. |
| Categorie | alle | Bepaalt de kleur en bij mijlpalen de vorm. „Zonder categorie“ verschijnt grijs, mijlpalen als ruit. **Nieuwe categorie …** maakt er een aan (naam, kleur en vorm) en wijst deze direct toe. |
| Datum | Mijlpaal, peildatum | De datum. |
| Begin, Einde | Periode | Eerste en laatste dag; beide behoren tot de periode. |
| Pijl aan het einde | Periode | De balk eindigt in een pijlpunt — „loopt door“. |
| Reeks | Mijlpaal, Periode | Invoer op hetzelfde niveau met dezelfde reeksnaam staan op één regel. Het veld vouwt de reeksen van dit niveau uit met het aantal invoeren; een ingevoerde nieuwe naam wordt overgenomen via „„…“ als nieuwe reeks aanmaken“, **Geen reeks** verwijdert het item. |
| Voorlopig | alle | De datum staat nog niet vast; het item verschijnt als een omtrek of met een gestreepte rand. |
| Afhankelijk van | Mijlpaal, periode | De voorgangers van het item; op de pagina weergegeven als een stippellijn met pijl. |
| Koppeling | alle | **Geen**, **Pagina** of **Nieuwsbericht**. Een wijziging verbreekt een bestaande koppeling. Op de pagina wordt de tekst van het item dan onderstreept en met een klik wordt de inhoud geopend in een venster boven het plan. |
| Pagina | alle | De Staffbase-pagina uit de lijst met pagina’s (de 100 laatst bewerkte). **Nieuwe pagina …** maakt deze aan in de Staffbase-editor, die over de plattegrond-editor heen ligt; na het aanmaken is deze gekoppeld. |
| Kanaal, bericht | alle | Eerst het nieuwskanaal (met het type: artikel, kort bericht, fotobericht), daarna het bericht. Concepten kunnen worden geselecteerd en zijn gemarkeerd met „(concept)“ — lezers zien ze pas na publicatie. **Nieuw bericht …** maakt er een aan in het geselecteerde kanaal; na het opslaan is het gekoppeld. **In nieuw tabblad openen** toont de gekoppelde inhoud. |
| Bijlagen | alle | Maximaal tien bestanden of afbeeldingen uit de mediabibliotheek, elk met een optionele bijschrift (anders de bestandsnaam). **Bestand of afbeelding toevoegen …** opent de bibliotheek; **↑**/**↓** om te sorteren, **×** om te verwijderen. Bijlagen blijven bewaard na het uitloggen. Op de pagina staan ze naast de gekoppelde inhoud of in de details; bij de Excel-export in de kolom „Bijlagen“. |
| Dupliceren | alle | Maakt een kopie van het item aan. |
| Verwijderen | alle | Vraagt om bevestiging en verwijdert vervolgens het item en alle afhankelijkheden die ernaar verwijzen; de bevestigingsvraag noemt de afhankelijke items. |

### Tabblad „Lagen“

| Bedieningselement | Beschrijving |
| --- | --- |
| Nieuw niveau | Rechtsboven in het tabblad. Maakt een nieuw niveau aan. |
| Naam | De naam van het niveau, links naast de baan ervan. Moet uniek zijn. Ernaast staat hoeveel vermeldingen het bevat. |
| Pijltjes omhoog / omlaag | Volgorde op de pagina en in de Excel-export. |
| Verwijderen | Verwijdert het niveau. Als het items bevat, vraagt de editor of deze naar een ander niveau moeten worden verplaatst (selectie **Doelniveau**) of dat ze mee moeten worden verwijderd. |

### Tabblad „Categorieën“

| Bedieningselement | Beschrijving |
| --- | --- |
| Nieuwe categorie | Rechtsboven op het tabblad. Maakt een nieuwe categorie aan. |
| Kleurvak | Voor de naam; toont de kleur. Een klik opent de twaalf kleuren en het veld **Hex-waarde**; Esc of een klik ernaast sluit het. |
| Hex-waarde | Een eigen kleur in het formaat `#RRGGBB`, bijvoorbeeld `#E40045`. |
| Vormknop | Naast het kleurveld; toont de vorm waarin de mijlpalen van de categorie worden weergegeven. Een klik opent de acht vormen: ruit, driehoek, driehoek met de punt naar beneden, vierkant, cirkel, zeshoek, ster of kruis. Met de pijltjestoetsen kun je van vorm wisselen. |
| Naam | De naam in de legenda en in de details. Moet uniek zijn. Ernaast staat aan hoeveel items de categorie is toegewezen. |
| Pijltjes omhoog / omlaag | Volgorde in de legenda. |
| Verwijderen | Verwijdert de categorie; de bijbehorende items worden „zonder categorie“. De pop-up geeft het aantal weer. |

## Beperkingen

- Een plan bevat maximaal **300 items**, **20 niveaus** en
  **24 categorieën**. Meer dan dat accepteert de editor niet.
- Afspraken zijn **hele dagen** zonder tijdstip. Het startscherm is
  **per maand**.
- Tekst heeft nooit de kleur van de categorie — lichte kleuren zoals geel zouden
  anders onleesbaar zijn op wit. Alleen de vorm, de balk en
  het legenda-punt hebben kleur; de tekst in de balk is zwart of wit, afhankelijk van wat
  beter leesbaar is.
- **Zonder vermeldingen toont de widget niets** — noch een leeg kader, noch
  een melding.

## Afhankelijkheden tussen de instellingen

- **Lijn van vandaag weergeven** werkt alleen als de huidige dag binnen het zichtbare
  gedeelte valt. Bij een planning die volledig in het verleden of
  de toekomst ligt, is de lijn daarom pas zichtbaar nadat deze is verschoven.
- De **koptekst** bepaalt ook de naam van het Excel-bestand; zonder
  ingeschakelde export fungeert deze alleen als koptekst.
- **Koptekst** en **startweergave** worden ingesteld in de plan-editor, niet in het
  dialoogvenster; beide maken deel uit van het plan.
