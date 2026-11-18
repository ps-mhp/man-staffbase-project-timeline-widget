# Instellingen

Het configuratievenster van Staffbase bevat alleen het veld „Plan“. Dit wordt bijgewerkt in
de plan-editor, die automatisch verschijnt wanneer je de instellingen opent;
het tekstveld erachter is de technische ruwe versie en mag niet handmatig
worden bewerkt. De vroegere velden **Vandaag-regel weergeven** en
**Excel-export aanbieden** zijn in het dialoogvenster verborgen en staan in de
Plan-editor onder **Instellingen**; hun waarden staan in het plan. Een blok
waarvoor ze nooit in de editor zijn gewijzigd, behoudt wat het eerder weergeeft. Ook de
koptekst van het plan is geen veld van het dialoogvenster, maar wordt in de plan-editor
onderhouden.

| Attribuut | Label | Beschrijving |
| --- | --- | --- |
| `plan` | Plan | Koptekst, niveaus, categorieën, items, startweergave en de schakelaars voor de ‘Vandaag’-lijn en export. Wordt bijgewerkt in de plan-editor. Standaard: leeg. |
| `show-today` | Vandaag-lijn weergeven | Alleen nog een terugvaloptie voor plannen die de schakelaar niet bevatten. In de editor als **Vandaag-lijn weergeven** onder **Instellingen**: Een donkere verticale lijn met „Vandaag“ op de as markeert de huidige dag, mits deze binnen het zichtbare gedeelte valt. Standaard: aan. |
| `allow-export` | Excel-export aanbieden | Alleen nog als terugvaloptie zoals hierboven. In de editor als **Excel-export aanbieden**: toont lezers de knop **Exporteren**, waarmee ze de gegevens als Excel-tabel kunnen downloaden. Standaard: aan. |

## De plan-editor

De plan-editor vult het hele scherm. Bovenaan staat de koptekst van het
gemeenschappelijke kader, daaronder links de **vermeldingen**, in het midden het
formulier van de geselecteerde vermelding en rechts het paneel **Plan**.

### Koptekst

| Bedieningselement | Beschrijving |
| --- | --- |
| Editor · Desktop · Tablet · Mobiel | **Editor** toont het formulier. De apparaatweergaven tonen in plaats daarvan het plan op apparaatbreedte — dezelfde weergave als op de pagina, met zoom, zonder filters en export; een klik op een item selecteert het. |
| Status | „3 items gewijzigd · niveaus” — wat verschilt van de laatst opgeslagen status. Een item waarvan het niveau ontbreekt, verhindert het opslaan. |
| Ongedaan maken / Opnieuw | Maakt wijzigingen stap voor stap ongedaan of herstelt ze (⌘/Ctrl Z, ⇧⌘/Ctrl Z). |
| Help | Legt de bediening uit (F1). |
| Annuleren | Sluit de editor; bij niet-opgeslagen wijzigingen wordt eerst gevraagd of deze moeten worden verwijderd. |
| Toepassen | Slaat het plan op in de instellingen (⌘/Ctrl S); **Toepassen en sluiten** ook met ⌘/Ctrl ↵. Het wordt samen met de pagina opgeslagen. |

### Zijbalk „Vermeldingen“

Links de lijst met items, gesorteerd op datum, met het aantal („12 van
300“). **Nieuw** maakt een **mijlpaal**, **periode** of **peildatum** aan;
zonder niveau is alleen de peildatum mogelijk. Daaronder staan **Verzoeken doorzoeken** en
de selectie van het type (**Alle typen**, **Mijlpalen**, **Periodes**,
**Deadlines**, elk met het aantal; bij actieve zoekopdracht: resultaten).

### Formulier van het verzoek

Boven het formulier staat „Vermelding 4 van 12“, het type en de knoppen **Vermelding
dupliceren** en **Vermelding verwijderen**, daaronder de tabbladen **Algemeen**
(Type, Titel, Beschrijving, Voorlopig), **Indeling** (niveau, categorie,
serie), **Datum** (datum of begin en einde, bij tijdsperiode een pijl aan het einde),
**Afhankelijkheden** en **Inhoud** (gekoppelde pagina of nieuwsbericht,
bijlagen). „(Fout)“ achter een tabblad duidt op een ongeldige invoer daarin;
bij peildata vervalt **Afhankelijkheden**:

| Veld | Geldt voor | Beschrijving |
| --- | --- | --- |
| Type | alle | Mijlpaal, periode of peildatum. Bij overschakeling naar peildatum vervalt het niveau. Zonder niveau blijft een peildatum wat hij is. |
| Titel | alle | Verplicht. Wordt weergegeven bij het item en in de details. |
| Beschrijving | alle | Optioneel, meerdere regels. Verschijnt alleen in de details en in de Excel-export. |
| Voorlopig | alle | De datum staat nog niet vast; het item verschijnt als een omtrek of met een gestreepte rand. |
| Niveau | Mijlpaal, periode | Het niveau waarin het item zich bevindt. **Nieuw niveau …** maakt er een aan (naam) en wijst het direct toe. |
| Categorie | alle | Bepaalt de kleur en bij mijlpalen de vorm. „Zonder categorie“ wordt grijs weergegeven, mijlpalen als ruit. **Nieuwe categorie …** maakt er een aan (naam, kleur en vorm) en wijst deze direct toe. |
| Reeks | Mijlpaal, periode | Vermeldingen van hetzelfde niveau met dezelfde reeksnaam staan op één regel. Het veld vouwt de reeksen van dit niveau uit met het aantal vermeldingen; een ingetypte nieuwe naam wordt via „„…“ als nieuwe reeks aanmaken“ overgenomen, **Geen reeks** verwijdert de vermelding. |
| Datum | Mijlpaal, peildatum | De datum. |
| Begin, Einde | Periode | Eerste en laatste dag; beide behoren tot de periode. |
| Pijl aan het einde | Periode | De balk eindigt in een pijlpunt — „loopt door“. |
| Afhankelijk van | Mijlpaal, periode | De voorgangers van het item; op de pagina weergegeven als een stippellijn met pijl. |
| Koppeling | alle | **Geen**, **Pagina** of **Nieuwsbericht**. Een wijziging verbreekt een bestaande koppeling. Op de pagina wordt de tekst van het item dan onderstreept en met een klik wordt de inhoud geopend in een venster boven het plan. |
| Pagina | alle | De Staffbase-pagina uit de lijst met pagina’s (de 100 laatst bewerkte). **Nieuwe pagina …** maakt deze aan in de Staffbase-editor, die over de plattegrond-editor heen ligt; na het aanmaken is deze gekoppeld. |
| Kanaal, bericht | alle | Eerst het nieuwskanaal (met het type: artikel, kort bericht, fotobericht), daarna het bericht. Concepten kunnen worden geselecteerd en worden gemarkeerd met „(concept)“ — lezers zien ze pas na publicatie. **Nieuw bericht …** maakt er een aan in het geselecteerde kanaal; na het opslaan is het gekoppeld. **In nieuw tabblad openen** toont de gekoppelde inhoud. |
| Bijlagen | alle | Maximaal tien bestanden of afbeeldingen uit de mediabibliotheek, elk met een optionele bijschrift (anders de bestandsnaam). **Bestand of afbeelding toevoegen …** opent de bibliotheek; de pijltjes sorteren, het kruisje verwijdert. Bijlagen blijven bewaard na het uitloggen. Op de pagina staan ze naast de gekoppelde inhoud of in de details, in de Excel-export in de kolom „Bijlagen“. |
| Vermelding dupliceren | alle | Maakt een kopie van de vermelding aan. |
| Vermelding verwijderen | alle | Vraagt om bevestiging en verwijdert vervolgens de vermelding en alle afhankelijkheden die ernaar verwijzen; de bevestigingsvraag noemt de afhankelijke vermeldingen. |

### Paneel „Plan“: Instellingen

| Bedieningselement | Beschrijving |
| --- | --- |
| Titel van het plan | Staat boven het plan en geeft het Excel-bestand zijn naam. Optioneel: laat leeg als de pagina al een passende koptekst heeft; het bestand heet dan `Projectplan_JJJJ-MM-TT.xlsx`. |
| Vandaag-lijn weergeven | Schakelaar, zie hierboven. Zolang deze in de editor nog nooit is gebruikt, staat er dat het blok zijn huidige instelling behoudt. |
| Excel-export aanbieden | Schakelaar, zie hierboven; idem. |
| Dit gedeelte overnemen | Slaat het zichtbare gedeelte van het voorbeeld (weergave desktop, tablet of mobiel) op, per maand, als weergave bij het laden van de pagina. Geblokkeerd als er geen gedeelte is geselecteerd. |
| Startweergave verwijderen | Verwijdert de startweergave; de widget toont bij het laden weer de volledige planning. |
| Beginnen met sjabloon | Alleen bij een lege planning, in het midden: toont de sjablonen waaruit gekozen kan worden („Product-roadmap“, „Uitstel“). Een klik op een kaart vult de editor ermee; **Terug** keert terug zonder wijzigingen. Op een plan met items is dit niet mogelijk — het sjabloon zou deze vervangen. |
| Leeg beginnen | Alleen bij een leeg plan: maakt een laag „Laag 1“ aan. |

### Paneel „Plan“: lagen

| Bedieningselement | Beschrijving |
| --- | --- |
| Nieuwe laag | Maakt een nieuwe laag aan. |
| Naam | De naam van de laag, links naast de baan ervan. Moet uniek zijn. Daaronder staat hoeveel items de laag bevat. |
| Pijltjes omhoog / omlaag | Volgorde op de pagina en in de Excel-export. |
| Verwijderen | Verwijdert het niveau. Als het items bevat, vraagt de editor of deze naar een ander niveau moeten worden verplaatst (selectie **Doelniveau**) of dat ze mee moeten worden verwijderd. |

### Paneel „Plan“: Categorieën

| Bedieningselement | Beschrijving |
| --- | --- |
| Nieuwe categorie | Maakt een nieuwe categorie aan. |
| Kleurveld | Voor de naam; toont de kleur. Een klik opent de twaalf kleuren en het veld **Hex-waarde**; Esc of een klik ernaast sluit het. |
| Hex-waarde | Een eigen kleur in het formaat `#RRGGBB`, bijvoorbeeld `#E40045`. |
| Vormknop | Naast het kleurveld; toont de vorm waarin de mijlpalen van de categorie worden weergegeven. Een klik opent de acht vormen: ruit, driehoek, driehoek met de punt naar beneden, vierkant, cirkel, zeshoek, ster of kruis. Met de pijltjestoetsen kun je van vorm wisselen. |
| Naam | De naam in de legenda en in de details. Moet uniek zijn. Daaronder staat aan hoeveel items de categorie is toegewezen. |
| Pijltjes omhoog / omlaag | Volgorde in de legenda. |
| Verwijderen | Verwijdert de categorie; de bijbehorende items worden „zonder categorie“. De pop-up geeft het aantal weer. |

## Beperkingen

- Een plan bevat maximaal **300 items**, **20 niveaus** en
  **24 categorieën**. Meer dan dat accepteert de editor niet.
- Afspraken zijn **hele dagen** zonder tijdstip. Het startscherm is
  **per maand**.
- Tekst heeft nooit de kleur van de categorie — lichte kleuren zoals geel zouden
  anders onleesbaar zijn op wit. Alleen de vorm, de balk en
  het legenda-punt hebben een kleur; het lettertype in de balk is zwart of wit, afhankelijk van wat
  beter leesbaar is.
- **Zonder vermeldingen toont de widget niets** — noch een leeg kader, noch
  een melding.

## Afhankelijkheden tussen de instellingen

- **Vandaag-lijn weergeven** werkt alleen als de huidige dag binnen het zichtbare
  gedeelte valt. Bij een planning die volledig in het verleden of
  de toekomst ligt, daarom is de lijn pas zichtbaar nadat deze is verplaatst.
- De **koptekst** bepaalt ook de naam van het Excel-bestand; als
  de exportfunctie niet is ingeschakeld, fungeert deze alleen als koptekst.
- **Titel van het plan**, **Startweergave**, **Vandaag-lijn** en **Exporteren** worden ingesteld in de
  plan-editor, niet in het dialoogvenster; ze maken allemaal deel uit van het plan.
