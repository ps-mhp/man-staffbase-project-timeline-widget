# Plan de projet

Ce widget affiche un plan de projet sous forme de **chronologie** — comme la feuille de route
un lancement de véhicules avec foires commerciales, démarrages en série (SOP) et
jalons du projet sur plusieurs années. Il remplace la diapositive PowerPoint, 
qui a jusqu’à présent été maintenu pour ces plans et intégré comme image : Le Plan
est directement sur la page, peut être modifié à tout moment, et les lecteurs
Tu peux l’explorer toi-même, le filtrer et le télécharger sous forme de tableau Excel. 

L’ensemble du plan est maintenu dans l'**Éditeur de plan**, qui s’affiche lorsque le
Paramètres à lui seul. 

## En quoi consiste un plan

- **En-tête** — optionnel ; se place au-dessus du plan et donne le fichier Excel
  leur nom. 
- **Niveaux** — chemins horizontaux entre eux, par exemple « Mesurer », 
  « Lancements / SOP » et « Jalons du projet ». À gauche se trouve leur titre. 
- **Catégories** — donnent leur couleur aux entrées et apparaissent comme une légende
  au-dessus du plan, par exemple « MY26 TG Assist » en violet. 
- **Entrées** en trois types : 
  - **Jalon** — une date unique, représentée comme un symbole (losange, 
    triangle, carré ou cercle) avec le titre ci-dessous. 
  - **Point** — une barre du début à la fin, avec un
    Pointe de flèche à la fin pour « continue de courir ». 
  - **Date limite** — une date applicable à tous les niveaux, comme un nouveau
    régulation. Il apparaît comme une ligne verticale pointillée traversant l’ensemble
    Un plan, avec le titre ci-dessous. 
- **Série** — Jalons et périodes du même niveau avec le même niveau
  Les noms des séries sont sur une même ligne. Si elle inclut une période temporelle, 
  les jalons-jalons reposent sur sa poutre ; sinon étroit
  Faites la première avec la dernière. 
- **Dépendances** — lignes pointillées avec flèche depuis le prédécesseur du
  successeur, par exemple de « C4S » à la SOP associée. 
- **Préliminaire** — une entrée dont la date n’a pas encore été déterminée. Elle
  n’apparaît que sous forme de contour ou de bordure pointillée de façon vive. 

## Ce que voient les lecteurs

De haut en bas : 

1. **Titre** (si défini) et **« Statut : ...»** — la date du dernier
   Changement du plan, dans le format de date de la langue de la page. 
2. **Barre d’Outil** — Recherche, **Filtre**, Zoom (**−**, **+**, **Tous
   montrer**), le bouton **Chronologie | Liste** et **Exporter**. 
3. **Légende** — catégories avec leur couleur. Un clic affiche un
   Catégorie éteinte ou réactivée. 
4. **Le plan** — à gauche les titres des calques, à droite la chronologie avec le
   entrées, sous le dernier niveau les titres des dates clés. 
5. **Aperçu** — une bande étroite couvrant toute la période. Un cadre
   montre quelle section est actuellement vue. 

Aussi : 

- **Zoom** est infiniment variable : via les boutons **−** et **+**, avec le
  touche Ctrl (Mac : ⌘) et la molette de la souris ou avec deux doigts sur le pavé tactile et
  écran tactile. L’axe change d’années en quarts et de mois en
  aux semaines et jours individuels. 
- **Déplacer** se fait en glissant avec la souris, avec Maj et la molette de la souris, 
  en effaçant horizontalement ou en faisant glisser le cadre dans l’aperçu. 
- Un **clic sur une entrée** ouvre ses détails : type et date, 
  Catégorie, niveau, série, description, ainsi que prédécesseurs et successeurs. 
- **Filtres** et **Recherche** ne s’appliquent qu’à votre propre visite ; sauvegardé ou
  rien n’est transmis aux autres. 
- **List** affiche les mêmes entrées qu’un tableau, triées par date — le
  Un moyen plus pratique pour les lecteurs d’écran, les écrans étroits et pour l’impression. 
- **Export** télécharge les entrées sous forme de fichier Excel, à condition que le
  L’exportation est activée dans les Paramètres. 
- Une ligne sombre **« Aujourd’hui »** marque aujourd’hui, si elle
  est activé et l’étiquette est dans la section visible. 
- L’opération fonctionne aussi sans souris : Tab saute dans le plan, le
  Les flèches passent d’une entrée à l’autre, Entrée ouvre les détails, 
  **+** et **−** zoom, **0** montre tout. 
- Sur des écrans étroits (moins de 768 pixels de large), filtres et
  Les détails sont disponibles sous forme de feuille à partir du bas, ainsi que **List** et **Export**
  dans le menu **Plus**. 
- **Sans entrées, le widget n’affiche rien** — pas de cadre vide et
  Aucun message d’erreur. 

## Ce que vous voyez dans l’éditeur CMS

L’éditeur de plans inclut un **aperçu** en haut : la même chronologie que sur
de la page, avec zoom, mais sans filtres, lister et exporter. Cliquez sur un
L’entrée dans l’aperçu le sélectionne pour l’édition. Comment les lecteurs utilisent le plan
Avec tous les filtres et l’exportation, vérifiez dans l’aperçu de la page.