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

De planeditor bestaat uit het **Heading**-veld, het **Preview** en
Drie tabbladen. Rechtsboven staat hoeveel vermeldingen de kaart bevat, voor de
Voorbeeld "42 / 300 inzendingen". 

### Koers

| Veld | Beschrijving |
| --- | --- |
| Kop | Bovenaan de planeditor. Staat boven het plan en geeft het Excel-bestand zijn naam. Optioneel: Laat leeg als de pagina al een geschikte kop heeft; het bestand wordt dan 'Projektplan_JJJJ-MM-TT.xlsx' genoemd. |

### Snel zicht

| Besturingselement | Beschrijving |
| --- | --- |
| Voorbeeldweergave | Dezelfde tijdlijn als op de pagina, met zoom, zonder filters en export. Door op een invoer te klikken selecteert je deze in het tabblad "Vermeldingen". Kan worden ingeklapt. |
| Deze sectie als startweergave | Slaat het zichtbare gedeelte van de preview, tot aan de maand, op als een weergave wanneer de pagina laadt. |
| Start View verwijderen | Verwijdert de homeweergave; de widget toont het hele plan opnieuw bij het laden. |
| Begin met Voorbeeldplan | Alleen wanneer het plan leeg is: vult de editor met een kop, drie niveaus, zeven categorieën en voorbeelditems. |

### Tab "Invoeren" 

Links de lijst van alle inzendingen, gesorteerd op datum en via **Vermeldingen
blader** doorzoekbaar; daarboven, onder **Voeg toe**, een knop voor
**Mijlpaal**, **Punt** en **Deadline**. Rechts, de vorm van de
Geselecteerde inzending: 

| Veld | Van toepassing op | Beschrijving |
| --- | --- | --- |
| Typ | Alle | Mijlpaal, Periode of Deadline. Als je de deadline overneemt, wordt het niveau weggelaten. |
| Titel | Alles | Verplicht. Geschreven op de vermelding en in de details. |
| Beschrijving | Alle | Optioneel, meerregelig. Verschijnt alleen in de details en in de Excel-export. |
| Niveau | Mijlpaal, Periode | Het niveau waarin de ingang zich bevindt. |
| Categorie | Alle | Bepaalt de kleur. "Zonder categorie" verschijnt grijs. |
| Datum | Mijlpaal, deadline | De datum. |
| Start, einde | Periode | Eerste en laatste dag; beide behoren tot de periode. |
| Symbool | Mijlpaal | Rhombus (standaard), driehoek, vierkant of cirkel. |
| Pijl aan het einde | Punt | De balk eindigt in een pijlpunt — "loopt door". |
| Serie | Mijlpaal, Periode | Entries van hetzelfde niveau met dezelfde serienaam staan op een lijn. Het veld suggereert de serie van dit niveau. |
| Voorlopig | alle | De datum is nog niet vastgesteld; de vermelding verschijnt als een omtrek of met een gestreepte rand. |
| Hangt af van | Mijlpaal, Punt | De voorgangers van de intekening; op de pagina als een stippellijn met een pijl. |
| Duplicaat | Alles | Maak een kopie van de invoer. |
| Verwijderen | Alle | Verwijdert de vermelding en alle afhankelijkheden die ernaar wijzen. |

### Lagen-tabblad 

| Besturingselement | Beschrijving |
| --- | --- |
| Nieuwe laag | Maak een nieuwe laag aan. |
| Naam | De naam van de laag, links van zijn baan. Daarnaast staat hoeveel elementen deze bevat. |
| Omhoog/Omlaag pijlen | Bestel op de pagina en exporteer in Excel. |
| Verwijderen | Verwijdert de laag. Als het vermeldingen bevat, vraagt de editor of deze naar een andere laag moeten worden verplaatst (selecteer **Doellaag**) of dat ze ook verwijderd moeten worden. |

### Tabblad "Categorieën" 

| Besturingselement | Beschrijving |
| --- | --- |
| Nieuwe categorie | Maak een nieuwe categorie aan. |
| Naam | De naam in de legende en in de details. |
| Kleur | Een van de twaalf kleurvelden. |
| Hex-waarde | Een aangepaste kleur in het formaat '#RRGGBB', bijvoorbeeld '#E40045'. |
| Pijlen omhoog / omlaag | Volgorde van de legende. |
| Verwijderen | Verwijdert de categorie; de vermeldingen worden "zonder categorie". De zoekopdracht geeft het nummer. |

## Grenzen

- Een plan heeft maximaal **300 ingangen**, **20 niveaus** en
  **24 categorieën**. Verder accepteert de redacteur niets meer. 
- Afspraken zijn **hele dagen** zonder tijd. De startweergave is
  **Maandelijks**. 
- Tekst is nooit in de kleur van de categorie — felle kleuren zoals geel bleven bestaan
  anders onleesbaar op wit. De kleur wordt alleen gedragen door het symbool, de streep en
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