# Instellingen

Het configuratiedialoog van de widget heeft drie velden. "Plan" wordt weergegeven in de
Plan Editor, die zichzelf verschijnt bij het openen van de instellingen; 
Het tekstveld erachter is de technische, ruwe versie en mag niet met de hand worden gemaakt.
kan worden bewerkt. De overige twee velden staan direct in de dialoog. De
De kop van het plan is geen veld in de dialoog, maar wordt weergegeven in de planeditor
(zie hieronder). 

| Attribuut | Label in dialoog | Beschrijving |
| --- | --- | --- |
| 'plan' | Plan | Kop, niveaus, categorieën, entries en de startweergave. Behouden in de planeditor. Standaard: leeg. |
| 'show-today' | Show Today lijn | Een donkere verticale lijn met "Today" op de as markeert vandaag, als deze in het zichtbare gedeelte valt. Standaard: aan. |
| 'toelaten-exporteren' | Excel-export aanbieden | Toont lezers de **Export**-knop, waarmee ze de vermeldingen als Excel-spreadsheet downloaden. Standaard: aan. |

## De Planredacteur

De planeditor vult het hele scherm. Bovenaan staat de headerbalk, daaronder
de **Preview** en drie tabbladen. Tussen Preview en tabbladen, en ertussen
Invoerlijst en formulier hebben elk een trekhendel waarmee de hoogte van de
en de breedte van de lijst te wijzigen (muis- of pijltjestoetsen, 
Dubbelklikken herstelt de standaardinstelling; de browser onthoudt de groottes). 

### Header

| Besturingselement | Beschrijving |
| --- | --- |
| Kop | Staat boven het plan en geeft het Excel-bestand zijn naam. Optioneel: Laat het leeg als de pagina al een geschikte kop heeft; het bestand wordt dan 'Projektplan_JJJJ-MM-TT.xlsx' genoemd. |
| "42 / 300 vermeldingen" | Hoeveel vermeldingen het plan bevat, gemeten tegen de bovengrens. |
| "Niet-opgeslagen wijzigingen" | Verschijnt zodra het plan in de editor verschilt van het opgeslagen. |
| Annuleren | Sluit de editor; in het geval van niet-opgeslagen wijzigingen vraagt hij vooraf of deze moeten worden verwijderd. |
| Toepassen | Schrijf het plan in de instellingen en sluit de editor. Het wordt opgeslagen met de pagina. |

### Snel zicht

| Besturingselement | Beschrijving |
| --- | --- |
| Voorbeeldweergave | Dezelfde tijdlijn als op de pagina, met zoom, zonder filter en export. Door op een item te klikken, selecteert je deze in het tabblad "Items" en wordt deze in de lijst zichtbaar. Door op **Preview** te klikken, wordt deze ingeklapt; als je het uitvouwt, is de laatste hoogte getekend. |
| Deze sectie als startweergave | Slaat het zichtbare gedeelte van de preview, tot aan de maand, op als een weergave wanneer de pagina laadt. |
| Start View verwijderen | Verwijdert de homeweergave; de widget toont het hele plan opnieuw bij het laden. |
| Begin met sjabloon | Alleen als het plan leeg is: toont de sjablonen waaruit je kunt kiezen ("Product Roadmap", "Rescheduling"). Door op een kaart te klikken, vult de editor deze kaart; **Retourneren** komt zonder wijziging terug. |
| Start leeg | Alleen als het plan leeg is: maak een laag "Niveau 1". |

### Tab "Invoeren" 

Links staat de lijst met vermeldingen, gesorteerd op datum. Daarboven staan
**Blader door vermeldingen** en daaronder een schakelaar voor het type — 
**Mijlpalen**, **Periodes**, **Deadlines**, elk met een nummer (indien actief)
zoeken: raakt); de knop **+** ernaast maakt een dergelijke invoer, 
en de zoektocht werkt binnen de soort. 
Wanneer je met de muis over een regel gaat, verschijnt er rechts een recyclebak voor verwijdering (met
Query). 

Rechts de vorm van de geselecteerde intekening; erboven staat de titel en
de **Duplicaat**- en **Verwijderen**-knoppen, waaronder de **Algemeen**-tabbladen staan 
(Type, Titel, Beschrijving), **Classificatie** (Niveau, Categorie, Serie), 
**Datum** (datum of begin en einde, voor de puntpijl aan het einde, voorlopig)
**Afhankelijkheden** en **Inhoud** (gelinkte pagina of nieuwsbericht). A
Rode stip op het tabblad toont een ongeldige invoer erin; voor belangrijke data
Geëlimineerde **Afhankelijkheden**: 

| Veld | Van toepassing op | Beschrijving |
| --- | --- | --- |
| Typ | Alle | Mijlpaal, Periode of Deadline. Als je de deadline overneemt, wordt het niveau weggelaten. |
| Titel | Alles | Verplicht. Geschreven op de vermelding en in de details. |
| Beschrijving | Alle | Optioneel, meerregelig. Verschijnt alleen in de details en in de Excel-export. |
| Niveau | Mijlpaal, Periode | Het niveau waarop de invoer zich bevindt. **Nieuwe laag ...** maakt er een (naam) aan en wijst deze onmiddellijk toe. |
| Categorie | alle | Bepaalt de kleur en voor mijlpalen de vorm. "Zonder categorie" verschijnt grijs, mijlpalen als een diamant. **Nieuwe categorie ...** maakt er een aan (naam, kleur en vorm) en wijst deze onmiddellijk toe. |
| Datum | Mijlpaal, deadline | De datum. |
| Start, einde | Periode | Eerste en laatste dag; beide behoren tot de periode. |
| Pijl aan het einde | Punt | De balk eindigt in een pijlpunt — "loopt door". |
| Serie | Mijlpaal, Periode | Inzendingen van hetzelfde niveau met dezelfde serienaam staan op één regel. Het veld breidt de reeks van dit niveau uit met het aantal van hun inzendingen; een getypte nieuwe naam wordt overgenomen via ""..." create as a new series", **Geen serie** verwijdert de inzending. |
| Voorlopig | alle | De datum is nog niet vastgesteld; de vermelding verschijnt als een omtrek of met een gestreepte rand. |
| Hangt af van | Mijlpaal, Punt | De voorgangers van de intekening; op de pagina als een stippellijn met een pijl. |
| Link | alle | **Geen**, **Pagina** of **Nieuwsartikel**. Een wijziging breekt een bestaande link. Op de pagina wordt de inscriptie van de vermelding onderstreept, en een klik opent de inhoud in een venster boven het plan. |
| Pagina | Alle | De Staffbase-pagina uit de lijst van pagina's (de 100 meest recent bewerkte). **Nieuwe pagina ...** maakt deze aan in de Staffbase-editor, die de planeditor overstijgt; na het aanmaken wordt deze gekoppeld. |
| Kanaal, Bericht | alle | Eerst het nieuwskanaal (met het type: artikel, kort bericht, afbeeldingsbericht), daarna het bericht. Concepten zijn selecteerbaar en gemarkeerd met "(concept)" — lezers zien ze pas na publicatie. **Nieuw bericht ...** maakt er een aan in het geselecteerde kanaal; na het opslaan wordt het gelinkt. **Openen in nieuw tabblad** toont de gelinkte inhoud. |
| Bijlagen | Alle | Tot tien bestanden of afbeeldingen uit de mediabibliotheek, elk met optioneel bijschrift (anders de bestandsnaam). **Voeg bestand of afbeelding toe ...** opent de bibliotheek; **↑**/**↓** rangschikken, **×** verwijderd. Bijlagen blijven achter de login. Op de pagina staan ze naast de gelinkte inhoud of in de details, in de Excel-export in de kolom "Bijlagen". |
| Duplicaat | Alles | Maak een kopie van de invoer. |
| Verwijderen | alle | Vraagt om en verwijdert vervolgens de invoer en alle afhankelijkheden die ernaar wijzen; de zoekopdracht benoemt de afhankelijke vermeldingen. |

### Lagen-tabblad 

| Besturingselement | Beschrijving |
| --- | --- |
| Nieuwe laag | Rechtsboven in het tabblad. Maak een nieuwe laag aan. |
| Naam | De naam van de laag, links van zijn baan. Moet uniek zijn. Daarnaast staat hoeveel elementen het bevat. |
| Omhoog/Omlaag pijlen | Bestel op de pagina en exporteer in Excel. |
| Verwijderen | Verwijdert de laag. Als het vermeldingen bevat, vraagt de editor of deze naar een andere laag moeten worden verplaatst (selecteer **Doellaag**) of dat ze ook verwijderd moeten worden. |

### Tabblad "Categorieën" 

| Besturingselement | Beschrijving |
| --- | --- |
| Nieuwe categorie | Rechtsboven in het tabblad. Maak een nieuwe categorie aan. |
| Kleurveld | Voor de naam; toont de kleur. Eén klik vergroot de twaalf kleuren en het **Hex Waarde**-veld; Esc of een klik ernaast sluit zich. |
| Hex-waarde | Een aangepaste kleur in het formaat '#RRGGBB', bijvoorbeeld '#E40045'. |
| Vormknop | Naast het kleurveld; toont de vorm waarmee de mijlpalen van de categorie verschijnen. Met een klik opent je de acht vormen: ruit, driehoek, driehoek met de punt naar beneden, vierkant, cirkel, zeshoek, ster of kruis. Pijltjestoetsen veranderen de vorm. |
| Naam | De naam in de legende en in de details. Moet uniek zijn. Daarnaast staat hoeveel vermeldingen de categorie is toegewezen. |
| Pijlen omhoog / omlaag | Volgorde van de legende. |
| Verwijderen | Verwijdert de categorie; de vermeldingen worden "zonder categorie". De zoekopdracht geeft het nummer. |

## Grenzen

- Een plan heeft maximaal **300 ingangen**, **20 niveaus** en
  **24 categorieën**. Verder accepteert de redacteur niets meer. 
- Afspraken zijn **hele dagen** zonder tijd. De startweergave is
  **Maandelijks**. 
- Tekst is nooit in de kleur van de categorie — felle kleuren zoals geel bleven bestaan
  anders onleesbaar op wit. De kleur wordt alleen gedragen door de vorm, de strepen en
  legend point; de tekst in de balk is zwart of wit, afhankelijk van wat
  is makkelijker te lezen. 
- **Zonder vermeldingen toont de widget niets** — noch een leeg frame, noch
  Een boodschap. 

## Afhankelijkheden tussen instellingen

- **Vandaag tonen** werkt alleen als vandaag in de zichtbare staat
  fragment. In het geval van een plan dat volledig in het verleden ligt of
  in de toekomst is de lijn dus pas zichtbaar nadat deze is verplaatst. 
- De **kop** bepaalt ook de naam van het Excel-bestand; zonder
  Het werkt alleen als een kop. 
- **Kop** en **Homeweergave** zijn ingesteld in de planeditor, niet in de
  dialoog; beide maken deel uit van het plan.