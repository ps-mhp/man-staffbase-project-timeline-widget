# Paramètres

La boîte de dialogue de configuration du widget comporte trois champs. Le champ « Plan » est renseigné dans l’
éditeur de plan, qui s’affiche automatiquement à l’ouverture des paramètres ;
le champ de texte situé juste derrière correspond à la version brute technique et ne doit pas être modifié manuellement
. Les deux autres champs se trouvent directement dans la boîte de dialogue. Le
titre du plan n’est pas un champ de la boîte de dialogue, mais est géré dans l’éditeur de plan
(voir ci-dessous).

| Attribut | Libellé dans la boîte de dialogue | Description |
| --- | --- | --- |
| `plan` | Plan | Titre, niveaux, catégories, entrées et vue d'accueil. Géré dans l'éditeur de plan. Par défaut : vide. |
| `show-today` | Afficher la ligne « Aujourd’hui » | Une ligne verticale sombre portant la mention « Aujourd’hui » sur l’axe marque le jour actuel, à condition qu’il se trouve dans la section visible. Par défaut : activé. |
| `allow-export` | Proposer l’exportation vers Excel | Affiche aux lecteurs le bouton **Exporter**, qui leur permet de télécharger les entrées sous forme de tableau Excel. Par défaut : activé. |

## L’éditeur de plan

L’éditeur de plan occupe tout l’écran. En haut se trouve la barre d’en-tête, en dessous
l’**aperçu** et trois onglets. Entre l’aperçu et les onglets, ainsi qu’entre
la liste des entrées et le formulaire, se trouve une poignée de redimensionnement permettant de modifier la hauteur de l’
aperçu et la largeur de la liste (à l’aide de la souris ou des touches fléchées ;
un double-clic rétablit les valeurs par défaut ; le navigateur mémorise ces dimensions).

### Barre d’en-tête

| Élément de commande | Description |
| --- | --- |
| Titre | Situé au-dessus du plan, il donne son nom au fichier Excel. Facultatif : laisser vide si la page porte déjà un titre approprié ; le fichier s’appellera alors `Plan_du_projet_AAA-MM-JJ.xlsx`. |
| « 42 / 300 entrées » | Nombre d’entrées que comporte le plan, par rapport à la limite maximale. |
| « Modifications non enregistrées » | Apparaît dès que le plan dans l’éditeur diffère de celui qui a été enregistré. |
| Annuler | Ferme l’éditeur ; s’il y a des modifications non enregistrées, il demande au préalable si celles-ci doivent être ignorées. |
| Appliquer | Enregistre le plan dans les paramètres et ferme l’éditeur. Il est enregistré avec la page. |

### Aperçu

| Commande | Description |
| --- | --- |
| Aperçu | La même chronologie que sur la page, avec zoom, sans filtre ni exportation. Un clic sur une entrée la sélectionne dans l’onglet « Entrées » et l’affiche dans la liste. Un clic sur **Aperçu** la replie ; une fois dépliée, elle reprend la hauteur à laquelle elle a été déplacée en dernier. |
| Utiliser cet extrait comme vue d’accueil | Enregistre l’extrait visible de l’aperçu, au mois près, comme vue par défaut au chargement de la page. |
| Supprimer la vue d’accueil | Supprime la vue d’accueil ; le widget affiche à nouveau l’intégralité du plan lors du chargement. |
| Commencer avec un modèle | Uniquement si le plan est vide : affiche les modèles disponibles (« Feuille de route du produit », « Report de date »). Un clic sur une carte la fait apparaître dans l’éditeur ; **Retour** permet de revenir en arrière sans modification. |
| Commencer à vide | Uniquement lorsque le plan est vide : crée un niveau « Niveau 1 ». |

### Onglet « Entrées »

À gauche, la liste des entrées, triée par date. Au-dessus se trouvent
**Parcourir les entrées** et, en dessous, un bouton pour basculer entre les types —
**Jalons**, **Périodes**, **Dates butoirs**, chacun avec son nombre (en cas de
recherche : nombre de résultats) ; le bouton **+** à côté permet de créer une entrée de ce type,
et la recherche s'effectue au sein de ce type.
En survolant une ligne, une corbeille apparaît à droite pour la suppression (avec
confirmation).

À droite se trouve le formulaire de l’entrée sélectionnée ; au-dessus figurent son titre et
les boutons **Dupliquer** et **Supprimer**, en dessous les onglets **Général**
(Type, Titre, Description), **Classification** (Niveau, Catégorie, Série),
**Date** (date ou début et fin ; pour une période, une flèche à la fin ; provisoire)
**Dépendances** et **Contenu** (page ou article d'actualité lié). Un
point rouge sur l'onglet indique une saisie non valide dans celui-ci ; pour les dates butoirs,
l’onglet **Dépendances** n’est pas disponible :

| Champ | S’applique à | Description |
| --- | --- | --- |
| Type | tous | Jalon, période ou date butoir. En cas de passage à la date butoir, le niveau n’est plus pris en compte. |
| Titre | tous | Obligatoire. Apparaît dans l’entrée et dans les détails. |
| Description | tous | Facultative, sur plusieurs lignes. N’apparaît que dans les détails et dans l’exportation Excel. |
| Niveau | jalon, période | Le niveau dans lequel se trouve l’entrée. **Nouveau niveau…** en crée un (nom) et l’attribue immédiatement. |
| Catégorie | toutes | Détermine la couleur et, pour les jalons, la forme. « Sans catégorie » s’affiche en gris, les jalons sous forme de losange. **Nouvelle catégorie…** en crée une (nom, couleur et forme) et l’attribue immédiatement. |
| Date | Jalon, date de référence | La date. |
| Début, Fin | Période | Premier et dernier jour ; les deux font partie de la période. |
| Flèche à l’extrémité | Période | La barre se termine par une pointe de flèche — « se poursuit ». |
| Série | Jalon, Période | Les entrées d’un même niveau portant le même nom de série apparaissent sur une même ligne. Le champ déplie les séries de ce niveau en indiquant le nombre de leurs entrées ; un nouveau nom saisi est enregistré via « Créer une nouvelle série avec « … » », **Aucune série** supprime l’entrée. |
| Provisoire | tous | La date n’est pas encore fixée ; l’entrée apparaît en contour ou avec un bord en pointillés. |
| Dépend de | jalon, période | Les prédécesseurs de l’entrée ; représentés sur la page par une ligne pointillée avec une flèche. |
| Lien | tous | **Aucun**, **page** ou **article d’actualité**. Un changement rompt un lien existant. Sur la page, le libellé de l’entrée est alors souligné, et un clic ouvre le contenu dans une fenêtre au-dessus du plan. |
| Page | toutes | La page Staffbase issue de la liste des pages (les 100 dernières modifiées). **Nouvelle page…** la crée dans l’éditeur Staffbase, qui se superpose à l’éditeur de plan ; une fois créée, elle est liée. |
| Canal, publication | toutes | D’abord le canal d’actualités (avec son type : article, brève, publication avec image), puis la publication. Les brouillons sont sélectionnables et signalés par « (brouillon) » — les lectrices et lecteurs ne les voient qu’après publication. **Nouvelle publication…** en crée une dans la chaîne sélectionnée ; une fois enregistrée, elle est liée. **Ouvrir dans un nouvel onglet** affiche le contenu lié. |
| Pièces jointes | toutes | Jusqu’à dix fichiers ou images issus de la médiathèque, chacun pouvant comporter une légende facultative (sinon, le nom du fichier s’affiche). **Ajouter un fichier ou une image…** ouvre la médiathèque ; **↑**/**↓** permettent de les réorganiser, **×** les supprime. Les pièces jointes sont conservées après la connexion. Sur la page, elles apparaissent à côté du contenu lié ou dans les détails ; dans l’exportation Excel, elles figurent dans la colonne « Pièces jointes ». |
| Dupliquer | toutes | Crée une copie de l’entrée. |
| Supprimer | tout | Demande confirmation puis supprime l’entrée et toutes les dépendances qui y font référence ; la fenêtre de confirmation indique les entrées dépendantes. |

### Onglet « Niveaux »

| Commande | Description |
| --- | --- |
| Nouveau niveau | En haut à droite de l'onglet. Crée un nouveau niveau. |
| Nom | Le nom du niveau, à gauche de sa piste. Doit être unique. À côté figure le nombre d'entrées qu'il contient. |
| Flèches vers le haut / vers le bas | Ordre d'affichage sur la page et dans l'exportation Excel. |
| Supprimer | Supprime le niveau. S’il contient des entrées, l’éditeur demande si celles-ci doivent être déplacées vers un autre niveau (sélection **Niveau de destination**) ou si elles doivent être supprimées également. |

### Onglet « Catégories »

| Élément de commande | Description |
| --- | --- |
| Nouvelle catégorie | En haut à droite de l’onglet. Crée une nouvelle catégorie. |
| Champ de couleur | Devant le nom ; affiche la couleur. Un clic affiche les douze couleurs et le champ **Valeur hexadécimale** ; la touche Échap ou un clic à côté ferme la fenêtre. |
| Valeur hexadécimale | Une couleur personnalisée au format `#RRGGBB`, par exemple `#E40045`. |
| Bouton de forme | À côté du champ de couleur ; affiche la forme sous laquelle apparaissent les jalons de la catégorie. Un clic fait apparaître les huit formes : losange, triangle, triangle pointant vers le bas, carré, cercle, hexagone, étoile ou croix. Les touches fléchées permettent de changer de forme. |
| Nom | Le nom qui apparaît dans la légende et dans les détails. Doit être unique. À côté, le nombre d’entrées attribuées à la catégorie est indiqué. |
| Flèches vers le haut / vers le bas | Ordre d’affichage dans la légende. |
| Supprimer | Supprime la catégorie ; ses entrées deviennent « sans catégorie ». La fenêtre de confirmation indique leur nombre. |

## Limites

- Un plan peut contenir au maximum **300 entrées**, **20 niveaux** et
  **24 catégories**. L'éditeur n'accepte rien de plus.
- Les rendez-vous correspondent à des **journées entières** sans heure précise. La vue initiale est
  **au niveau du mois**.
- Le texte n’apparaît jamais dans la couleur de la catégorie — les couleurs claires comme le jaune resteraient
  sinon illisibles sur fond blanc. Seules la forme, la barre et
  le point de légende sont colorés ; le texte dans la barre est noir ou blanc, selon ce qui
  est le plus lisible.
- **Sans entrées, le widget n’affiche rien** — ni cadre vide, ni
  message.

## Interdépendances entre les paramètres

- **Afficher la ligne « Aujourd’hui »** ne fonctionne que si la date du jour se trouve dans la
  partie visible. Dans le cas d’un planning se situant entièrement dans le passé ou
  dans le futur, la ligne n’apparaîtra donc qu’après avoir déplacé le graphique.
- L’**en-tête** détermine également le nom du fichier Excel ; si l’
exportation n’est pas activée, il sert uniquement d’en-tête.
- L’**en-tête** et la **vue de démarrage** sont définis dans l’éditeur de plan, et non dans la
boîte de dialogue ; tous deux font partie intégrante du plan.
