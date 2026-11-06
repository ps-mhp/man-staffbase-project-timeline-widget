# Plan de projet

Ce widget affiche un plan de projet sous forme de **frise chronologique** — par exemple, le calendrier
du lancement d'un véhicule, avec les salons, les démarrages de production en série (SOP) et
les étapes clés du projet sur plusieurs années. Il remplace la diapositive PowerPoint
qui était jusqu’à présent utilisée pour ce type de plans et intégrée sous forme d’image : le plan
figure directement sur la page, peut être modifié à tout moment, et les lecteurs et lectrices
peuvent l’explorer eux-mêmes, le filtrer et le télécharger sous forme de tableau Excel.

L’ensemble du plan est géré dans l’**éditeur de plan**, qui s’affiche automatiquement à l’ouverture des
paramètres.

## Les éléments constitutifs d’un plan

- **Titre** — facultatif ; il figure au-dessus du plan et donne son nom au fichier Excel
 .
- **Niveaux** — des lignes horizontales les unes sous les autres, par exemple « Mesures »,
  « Lancement / SOP » et « Étapes clés du projet ». Leur titre apparaît à gauche de chacune d’elles.
- **Catégories** — elles attribuent une couleur aux entrées et apparaissent sous forme de légende
  au-dessus du plan, par exemple « MY26 TG Assist » en violet.
- **Entrées** de trois types :
  - **Jalon** — une date unique, représentée par une icône (losange,
    triangle, carré ou cercle) avec le titre en dessous.
  - **Période** — une barre allant du début à la fin, avec, si souhaité, une
    pointe de flèche à son extrémité pour indiquer « en cours ».
  - **Date butoir** — une date applicable à tous les niveaux, par exemple une nouvelle
    réglementation. Elle apparaît sous la forme d’une ligne verticale en pointillés traversant l’ensemble du
    plan, avec le titre en dessous.
- **Séries** — les jalons et les périodes d’un même niveau portant le même
  nom de série figurent sur une même ligne. Si une période en fait partie,
  les jalons se trouvent sur sa barre ; sinon, une fine
  barre relie le premier au dernier.
- **Dépendances** — des lignes pointillées avec une flèche reliant le prédécesseur au
  successeur, par exemple de « C4S » au SOP correspondant.
- **Provisoire** — une entrée dont la date n’est pas encore fixée. Elle
  apparaît uniquement sous forme de contour ou en couleur claire avec un bord en pointillés.

## Ce que voient les lecteurs et lectrices

De haut en bas :

1. **Titre** (le cas échéant) et **« État au : … »** — la date de la dernière
   modification apportée au plan, au format de date de la langue de la page.
2. **Barre d’outils** — Recherche, **Filtres**, Zoom (**−**, **+**, **Tout
   afficher**), le bouton de basculement **Chronologie | Liste**, **Exporter**,
   **Plein écran** et **Aide**.
3. **Légende** — les catégories et leurs couleurs. Un clic masque une
   catégorie ou la réaffiche.
4. **Le plan** — à gauche, les titres des calques ; à droite, la chronologie avec les
   entrées ; sous le dernier calque, les titres des dates clés. La flèche située à côté du
   titre permet de réduire un niveau ; **Tout réduire**, au-dessus des titres, permet de
   tous les réduire d’un seul coup, puis de les afficher à nouveau.
5. **Aperçu** — une fine bande couvrant toute la période. Un cadre
   indique la partie actuellement visible.

De plus :

- Le **zoom** est continu : à l’aide des boutons **−** et **+**, en maintenant enfoncée la
  touche Ctrl (Mac : ⌘) et en utilisant la molette de la souris, ou avec deux doigts sur le trackpad et
  l’écran tactile. L’axe passe alors des années aux trimestres et aux mois, puis
  aux semaines calendaires et aux jours individuels.
- Le **déplacement** s’effectue en faisant glisser avec la souris, avec la touche Maj et la molette de la souris,
  par un balayage horizontal ou en faisant glisser le cadre dans la vue d’ensemble.
- Un **clic sur une entrée** ouvre ses détails : type et date,
  catégorie, niveau, série, description ainsi que les événements précédents et suivants.
- Les **filtres** et la **recherche** ne s’appliquent qu’à votre propre visite ; rien n’est enregistré ni
  partagé avec d’autres.
- **Liste** affiche les mêmes entrées sous forme de tableau, triées par date — la
  solution la plus pratique pour les lecteurs d'écran, les écrans étroits et l'impression.
- **Exporter** permet de télécharger les entrées sous forme de fichier Excel, à condition que l’
  exportation soit activée dans les paramètres.
- Une ligne sombre **« Aujourd’hui »** met en évidence la date du jour, à condition qu’elle
  soit activée et que la date se trouve dans la partie visible de l’écran.
- L'utilisation est également possible sans souris : la touche Tab permet d'accéder à l'agenda, les
  touches fléchées permettent de passer d'une entrée à l'autre, la touche Entrée ouvre les détails,
  **+** et **−** permettent de zoomer, **0** affiche tout.
- Sur les écrans étroits (moins de 768 pixels de largeur), le planning s’affiche dans la
  **liste** — sous forme de cartes plutôt que de tableau, car la chronologie n’y a pas
  de largeur ; le bouton de basculement dans le menu **Plus** permet d’accéder à tout moment à la chronologie.
  De même, les filtres et les détails s’ouvrent sous forme de volet depuis le bas de l’écran, et
  **Liste** et **Exporter** se trouvent dans le menu **Plus**.
- **Plein écran** affiche le plan sur tout l’écran, avec les mêmes
  commandes ; seul le plan défile, tandis que l’axe et l’aperçu restent fixes.
  **Échap** ou **Quitter le plein écran** permet de revenir à la page. Lorsque le navigateur ne
  permet pas un véritable plein écran (comme Safari sur l’iPhone), le plan s’affiche sur
  toute la page.
- **Aide** explique aux lecteurs et lectrices, directement sur la page, la signification des symboles
  (onglet **Légende**, avec les catégories de ce plan) et comment utiliser le
  plan avec la souris, le trackpad, l'écran tactile et le clavier (onglet **Utilisation**).
  Depuis le plan, la touche **?** permet également d’ouvrir l’aide. Dans l’éditeur de plan,
  ce bouton n’existe pas.
- **Sans entrées, le widget n’affiche absolument rien** — ni cadre vide, ni
  message d’erreur.

## Ce que vous voyez dans l’éditeur CMS

L’éditeur de plan comporte en haut un **aperçu** : la même frise chronologique que sur
la page, avec le zoom, mais sans filtre, liste ni exportation. Un clic sur une
entrée dans l’aperçu la sélectionne pour la modifier. Pour vérifier comment les lecteurs et lectrices perçoivent le plan
avec tous les filtres et la fonction d’exportation, consultez l’aperçu de la page.
