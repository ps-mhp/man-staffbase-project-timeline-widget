# Projectplan

Deze widget toont een projectplan in de vorm van een **tijdlijn** — bijvoorbeeld het tijdschema
van de lancering van een voertuig, met beurzen, start van de serieproductie (SOP’s) en
projectmijlpalen verspreid over meerdere jaren. Het vervangt de PowerPoint-dia
die tot nu toe voor dergelijke plannen werd bijgehouden en als afbeelding werd ingevoegd: het plan
staat direct op de pagina, kan op elk moment worden gewijzigd en lezers
kunnen het zelf verkennen, filteren en als Excel-tabel downloaden.

Het hele plan wordt bijgewerkt in de **Plan-editor**, die automatisch verschijnt bij het openen van de
instellingen.

## Waaruit een plan bestaat

- **Koptekst** — optioneel; staat boven het plan en geeft het Excel-bestand
  zijn naam.
- **Niveaus** — horizontale rijen onder elkaar, bijvoorbeeld „Beurzen“,
  „Lanceringen / SOP’s“ en „Projectmijlpalen“. Links staat telkens de titel ervan.
- **Categorieën** — geven de items hun kleur en verschijnen als legenda
  boven het plan, bijvoorbeeld „MY26 TG Assist“ in paars.
- **Items** in drie soorten:
  - **Mijlpaal** — een enkele datum, weergegeven als symbool (ruit,
    driehoek, vierkant of cirkel) met de titel eronder.
  - **Tijdsperiode** — een balk van begin tot eind, desgewenst met een
    pijlpunt aan het einde voor „loopt door“.
  - **Streefdatum** — een datum die voor alle niveaus geldt, bijvoorbeeld een nieuwe
    voorschrift. Deze verschijnt als een gestreepte verticale lijn door het hele
    plan, met de titel eronder.
- **Series** — mijlpalen en periodes van hetzelfde niveau met dezelfde
  serienaam staan op een gemeenschappelijke regel. Als er een periode bij hoort,
  staan de mijlpalen op de balk daarvan; anders verbindt een smalle
  balk de eerste met de laatste.
- **Afhankelijkheden** — gestreepte lijnen met een pijl van de voorganger naar de
  opvolger, bijvoorbeeld van „C4S“ naar de bijbehorende SOP.
- **Voorlopig** — een item waarvan de datum nog niet vaststaat. Het
  verschijnt alleen als omtrek of licht ingekleurd met een gestreepte rand.

## Wat lezers zien

Van boven naar beneden:

1. **Koptekst** (indien ingesteld) en **„Stand: …“** — de datum van de laatste
   wijziging in het plan, in de datumnotatie van de paginataal.
2. **Werkbalk** — Zoeken, **Filter**, Zoomen (**−**, **+**, **Alles
   weergeven**), de schakelaar **Tijdlijn | Lijst**, **Exporteren**,
   **Volledig scherm** en **Help**.
3. **Legenda** — de categorieën met hun kleur. Met één klik wordt een
   categorie verborgen of weer weergegeven.
4. **Het plan** — links de titels van de lagen, rechts de tijdlijn met de
   vermeldingen, onder de laatste laag de titels van de peildata. De pijl bij de
   titel vouwt een laag in; **Alles inklappen** boven de titels vouwt
   ze allemaal in één keer in en daarna weer uit.
5. **Overzicht** — een smalle strook over de gehele periode. Een kader
   geeft aan welk gedeelte momenteel te zien is.

Bovendien:

- **Zoomen** gaat traploos: via de knoppen **−** en **+**, met ingedrukte
  Ctrl-toets (Mac: ⌘) en het muiswiel of met twee vingers op het trackpad en
  het touchscreen. De as wisselt daarbij van jaren via kwartalen en maanden tot
  kalenderweken en afzonderlijke dagen.
- **Verschuiven** kan door te slepen met de muis, met Shift en het muiswiel,
  door horizontaal te vegen of door het kader in het overzicht te verslepen.
- Een **klik op een item** opent de details ervan: type en datum,
  categorie, niveau, reeks, beschrijving, evenals voorganger en opvolger.
- **Filters** en **zoeken** gelden alleen voor je eigen bezoek; er wordt niets opgeslagen of
  aan anderen doorgegeven.
- **Lijst** toont dezelfde vermeldingen als tabel, gesorteerd op datum — de
  handigere manier voor schermlezers, smalle schermen en om af te drukken.
- **Exporteren** downloadt de vermeldingen als Excel-bestand, mits de
  exportfunctie in de instellingen is ingeschakeld.
- Een donkere lijn **„Vandaag“** markeert de huidige dag, mits deze
  is ingeschakeld en de dag zich in het zichtbare gedeelte bevindt.
- De bediening werkt ook zonder muis: met Tab spring je naar het schema, de
  pijltjestoetsen schakelen tussen de vermeldingen, Enter opent de details,
  **+** en **−** zoomen in en uit, **0** toont alles.
- Op smalle schermen (minder dan 768 pixels breed) begint het schema in de
  **lijst** — als kaarten in plaats van als tabel, omdat de tijdlijn daar geen
  breedte heeft; de schakelaar in het menu **Meer** leidt op elk moment naar de tijdlijn.
  Ook worden filters en details als een venster vanaf de onderrand geopend, en
  **Lijst** en **Exporteren** staan in het menu **Meer**.
- **Volledig scherm** toont het plan over het hele scherm, met dezelfde
  bediening; alleen het plan zelf scrolt, de as en het overzicht blijven op hun plaats.
  Met **Esc** of **Volledig scherm afsluiten** keer je terug naar de pagina. Wanneer de browser geen
  echt volledig scherm toestaat (zoals Safari op de iPhone), wordt het plan over
  de hele pagina weergegeven.
- **Help** legt lezers direct op de pagina uit wat de symbolen
  betekenen (tabblad **Legenda**, met de categorieën van dit plan) en hoe je het
  plan bedient met muis, trackpad, touchscreen en toetsenbord (tabblad **Bediening**).
  Vanuit de tijdlijn opent ook de knop **?** de hulp. In de tijdlijn-editor is
  deze knop niet aanwezig.
- **Zonder invoer toont de widget helemaal niets** — geen leeg kader en
  geen foutmelding.

## Wat u in de CMS-editor ziet

De plan-editor bevat bovenaan een **voorbeeld**: dezelfde tijdlijn als op
de pagina, met zoomfunctie, maar zonder filters, lijst en export. Als u op een
item in het voorbeeld klikt, wordt dit geselecteerd om te bewerken. Hoe lezers het plan
met alle filters en de exportfunctie zien, kunt u controleren in het voorbeeld van de pagina.
