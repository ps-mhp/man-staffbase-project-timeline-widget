# Paramètres

La boîte de dialogue de configuration de Staffbase ne comporte que le champ « Plan ». Celui-ci est géré dans l’
éditeur de plan, qui s’affiche automatiquement à l’ouverture des paramètres ;
le champ de texte situé derrière correspond à la version brute technique et ne doit pas être modifié manuellement
. Les anciens champs **Afficher la ligne « Aujourd’hui »** et
**Proposer l’exportation vers Excel** sont masqués dans la boîte de dialogue et se trouvent dans l’
éditeur de plan sous **Paramètres** ; leurs valeurs sont enregistrées dans le plan. Un bloc dans
lequel ces éléments n’ont jamais été déplacés dans l’éditeur conserve ce qu’il affichait auparavant. De même, l’
en-tête du plan n’est pas un champ de la boîte de dialogue, mais est géré dans l’éditeur de plan
.

| Attribut | Libellé | Description |
| --- | --- | --- |
| `plan` | Plan | En-tête, niveaux, catégories, entrées, vue d'accueil et boutons pour la ligne « Aujourd’hui » et l’exportation. Géré dans l’éditeur de plan. Par défaut : vide. |
| `show-today` | Afficher la ligne « Aujourd’hui » | Ne sert plus que de solution de repli pour les plans qui ne comportent pas ce bouton. Dans l’éditeur, sous **Paramètres**, option **Afficher la ligne « Aujourd’hui »** : Une ligne verticale sombre portant la mention « Aujourd’hui » sur l’axe marque le jour actuel, à condition qu’il se trouve dans la partie visible de l’écran. Par défaut : activé. |
| `allow-export` | Proposer l’exportation vers Excel | Uniquement en tant que solution de secours, comme ci-dessus. Dans l’éditeur, sous **Proposer l’exportation vers Excel** : affiche aux lecteurs le bouton **Exporter**, qui leur permet de télécharger les entrées sous forme de tableau Excel. Par défaut : activé. |

## L’éditeur de plan

L’éditeur de plan occupe tout l’écran. En haut se trouve l’en-tête du
cadre commun, en dessous à gauche les **entrées**, au centre le
formulaire de l’entrée sélectionnée et à droite le panneau **Plan**.

### En-tête

| Élément de commande | Description |
| --- | --- |
| Éditeur · Ordinateur de bureau · Tablette · Mobile | **Éditeur** affiche le formulaire. Les vues « Appareil » affichent à la place le plan en largeur d’écran — la même vue que sur la page, avec zoom, sans filtre ni exportation ; un clic sur une entrée la sélectionne. |
| Statut | « 3 entrées modifiées · niveaux » — ce qui diffère de la dernière version enregistrée. Une entrée dont le niveau est manquant empêche l’enregistrement. |
| Annuler / Rétablir | Annule ou rétablit les modifications étape par étape (⌘/Ctrl Z, ⇧⌘/Ctrl Z). |
| Aide | Explique le fonctionnement (F1). |
| Annuler | Ferme l'éditeur ; si des modifications n'ont pas été enregistrées, il demande au préalable si elles doivent être ignorées. |
| Enregistrer | Enregistre le plan dans les paramètres (⌘/Ctrl S) ; **Enregistrer et fermer** également avec ⌘/Ctrl ↵. Il est enregistré avec la page. |

### Barre latérale « Entrées »

À gauche, la liste des entrées, triée par date, avec le nombre (« 12 sur
300 »). **Nouveau** permet de créer un **jalon**, une **période** ou une **date butoir** ;
sans niveau, seule la date butoir est possible. En dessous se trouvent **Parcourir les entrées** et
la sélection du type (**Tous les types**, **Jalons**, **Périodes**,
**Dates butoirs**, chacun avec son nombre ; lorsque la recherche est active : résultats).

### Formulaire de l’entrée

Au-dessus du formulaire figurent « Entrée 4 sur 12 », le type et les boutons **Dupliquer l'entrée**
et **Supprimer l'entrée** ; en dessous, les onglets **Général**
(Type, Titre, Description, Provisoire), **Classification** (niveau, catégorie,
série), **Date** (date ou début et fin ; pour les périodes, une flèche à la fin),
**Dépendances** et **Contenu** (page ou article d'actualité lié,
pièces jointes). « (Erreur) » derrière un onglet indique une saisie non valide dans celui-ci ;
pour les dates butoirs, l’onglet **Dépendances** n’apparaît pas :

| Champ | S’applique à | Description |
| --- | --- | --- |
| Type | tous | Jalon, période ou date butoir. En cas de passage à la date butoir, le niveau est supprimé. Sans niveau, une date butoir reste ce qu’elle est. |
| Titre | tous | Obligatoire. Apparaît dans l’entrée et dans les détails. |
| Description | tous | Facultative, sur plusieurs lignes. N'apparaît que dans les détails et dans l'exportation Excel. |
| Provisoire | tous | La date n'est pas encore fixée ; l'entrée apparaît en contour ou avec un cadre en pointillés. |
| Niveau | Jalon, Période | Le niveau dans lequel se trouve l’entrée. **Nouveau niveau…** en crée un (nom) et l’attribue immédiatement. |
| Catégorie | toutes | Détermine la couleur et, pour les jalons, la forme. « Sans catégorie » s'affiche en gris, les jalons sous forme de losange. **Nouvelle catégorie…** en crée une (nom, couleur et forme) et l'attribue immédiatement. |
| Série | Jalon, période | Les entrées d'un même niveau portant le même nom de série apparaissent sur une même ligne. Le champ déplie les séries de ce niveau en indiquant le nombre de leurs entrées ; un nouveau nom saisi est enregistré via « Créer une nouvelle série avec « … » », **Aucune série** supprime l’entrée. |
| Date | Étape, date de référence | La date. |
| Début, Fin | Période | Premier et dernier jour ; les deux font partie de la période. |
| Flèche à la fin | Période | La barre se termine par une pointe de flèche — « se poursuit ». |
| Dépend de | Étape, période | Les prédécesseurs de l’entrée ; représentés sur la page par une ligne pointillée avec une flèche. |
| Lien | tous | **Aucun**, **Page** ou **Article d’actualité**. Un changement rompt un lien existant. Sur la page, le libellé de l’entrée est alors souligné, et un clic ouvre le contenu dans une fenêtre au-dessus du plan. |
| Page | toutes | La page Staffbase issue de la liste des pages (les 100 dernières modifiées). **Nouvelle page…** la crée dans l’éditeur Staffbase, qui s’affiche par-dessus l’éditeur de plan ; une fois créée, elle est liée. |
| Canal, publication | toutes | D’abord le canal d’actualités (avec son type : article, brève, publication avec image), puis la publication. Les brouillons sont sélectionnables et signalés par « (Brouillon) » — les lecteurs ne les voient qu’après publication. **Nouvelle publication…** en crée une dans la chaîne sélectionnée ; une fois enregistrée, elle est liée. **Ouvrir dans un nouvel onglet** affiche le contenu lié. |
| Pièces jointes | toutes | Jusqu’à dix fichiers ou images issus de la médiathèque, chacun pouvant comporter une légende facultative (sinon, le nom du fichier s’affiche). **Ajouter un fichier ou une image…** ouvre la médiathèque ; les flèches permettent de les réorganiser, la croix de les supprimer. Les pièces jointes sont conservées après la connexion. Sur la page, elles apparaissent à côté du contenu lié ou dans les détails ; dans l’exportation Excel, elles figurent dans la colonne « Pièces jointes ». |
| Dupliquer l’entrée | toutes | Crée une copie de l’entrée. |
| Supprimer l’entrée | toutes | Demande confirmation, puis supprime l’entrée et toutes les dépendances qui y font référence ; la demande de confirmation indique les entrées dépendantes. |

### Panneau « Plan » : paramètres

| Élément de commande | Description |
| --- | --- |
| Titre du plan | Apparaît au-dessus du plan et donne son nom au fichier Excel. Facultatif : laisser vide si la page comporte déjà un en-tête approprié ; le fichier s’appellera alors `Plan_du_projet_AAAA-MM-JJ.xlsx`. |
| Afficher la ligne « Aujourd’hui » | Bouton, voir ci-dessus. Tant qu’il n’a jamais été actionné dans l’éditeur, il est indiqué que le bloc conserve son paramétrage actuel. |
| Proposer l’exportation vers Excel | Bouton, voir ci-dessus ; idem. |
| Enregistrer cette section | Enregistre la section visible de l’aperçu (mode Bureau, Tablette ou Mobile), au mois près, comme vue par défaut au chargement de la page. Désactivé si aucune section n’est spécifiée. |
| Supprimer la vue d’accueil | Supprime la vue d’accueil ; le widget affiche à nouveau l’intégralité du plan lors du chargement. |
| Commencer avec un modèle | Uniquement si le plan est vide, au centre : affiche les modèles disponibles (« Feuille de route produit », « Report de date »). Un clic sur une carte la fait apparaître dans l’éditeur ; **Retour** permet de revenir en arrière sans modification. Cette option n’est pas disponible sur un plan comportant déjà des entrées — le modèle les remplacerait. |
| Commencer à vide | Uniquement lorsque le plan est vide : crée un calque « Calque 1 ». |

### Panneau « Plan » : niveaux

| Élément de commande | Description |
| --- | --- |
| Nouveau niveau | Crée un nouveau niveau. |
| Nom | Le nom du niveau, à gauche de sa ligne. Doit être unique. En dessous figure le nombre d’entrées qu’il contient. |
| Flèches vers le haut / vers le bas | Ordre d’affichage sur la page et dans l’exportation Excel. |
| Supprimer | Supprime le niveau. S’il contient des entrées, l’éditeur demande si celles-ci doivent être déplacées vers un autre niveau (sélection de la ****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************

### Panneau « Plan » : catégories

| Élément de commande | Description |
| --- | --- |
| Nouvelle catégorie | Crée une nouvelle catégorie. |
| Champ de couleur | Situé devant le nom ; affiche la couleur. Un clic affiche les douze couleurs et le champ **Valeur hexadécimale** ; la touche Échap ou un clic à côté ferme la fenêtre. |
| Valeur hexadécimale | Une couleur personnalisée au format `#RRGGBB`, par exemple `#E40045`. |
| Bouton de forme | À côté du champ de couleur ; affiche la forme sous laquelle apparaissent les jalons de la catégorie. Un clic fait apparaître les huit formes : losange, triangle, triangle pointant vers le bas, carré, cercle, hexagone, étoile ou croix. Les touches fléchées permettent de changer de forme. |
| Nom | Le nom qui apparaît dans la légende et dans les détails. Doit être unique. En dessous figure le nombre d’entrées attribuées à la catégorie. |
| Flèches vers le haut / vers le bas | Ordre d’affichage dans la légende. |
| Supprimer | Supprime la catégorie ; ses entrées deviennent « sans catégorie ». La fenêtre de confirmation indique leur nombre. |

## Limites

- Un plan peut contenir au maximum **300 entrées**, **20 niveaux** et
  **24 catégories**. L’éditeur n’accepte rien de plus.
- Les rendez-vous correspondent à des **journées entières** sans heure précise. La vue initiale est
  **au mois près**.
- Le texte n’apparaît jamais dans la couleur de la catégorie — les couleurs claires comme le jaune resteraient
  sinon illisibles sur fond blanc. Seules la forme, la barre et
  le point de légende sont colorés ; le texte dans la barre est noir ou blanc, selon ce qui
  est le plus lisible.
- **Sans entrées, le widget n’affiche rien** — ni cadre vide, ni
  message.

## Interdépendances entre les paramètres

- **Afficher la ligne « Aujourd’hui »** ne fonctionne que si la date du jour se trouve dans la
  zone visible. Dans le cas d’un planning se situant entièrement dans le passé ou
  dans le futur, C'est pourquoi la ligne n'apparaît qu'après avoir été déplacée.
- Le **titre** détermine également le nom du fichier Excel ; si
  l'exportation n'est pas activée, il ne sert que de titre.
- Le **titre du plan**, la **vue d'accueil**, la **ligne « Aujourd'hui »** et l'**exportation** sont définis dans l'
  éditeur de plan, et non dans la boîte de dialogue ; tous font partie intégrante du plan.
