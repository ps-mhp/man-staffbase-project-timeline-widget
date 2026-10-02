# Décors

La boîte de dialogue de configuration du widget comporte trois champs. « Plan » est affiché dans le
l’éditeur de plans, qui s’affiche en ouvrant les paramètres ; 
Le champ texte derrière est la version technique brute et ne doit pas être fait à la main.
peuvent être modifiés. Les deux champs restants sont directement dans le dialogue. Le
L’en-tête du plan n’est pas un champ du dialogue, mais est affiché dans l’éditeur de plans
(voir ci-dessous). 

| Attribut | Étiquette dans la boîte de dialogue | Description |
| --- | --- | --- |
| 'plan' | Plan | Titre, niveaux, catégories, entrées et la vue de départ. Maintenu dans l’éditeur de plans. Par défaut : vide. |
| 'montre-aujourd’hui' | Ligne Afficher aujourd’hui | Une ligne verticale sombre avec « Aujourd’hui » dans l’axe marque aujourd’hui, si elle est dans la section visible. Par défaut : activé. |
| 'autoriser-export' | Proposer l’exportation Excel | Montre aux lecteurs le bouton **Exporter**, qu’ils utilisent pour télécharger les entrées sous forme de tableau Excel. Par défaut : activé. |

## Le rédacteur en chef des plans

L’éditeur de plans occupe tout l’écran. En haut se trouve la barre d’en-tête, en dessous
le **Aperçu** et trois onglets. Entre l’aperçu et les onglets, et entre
La liste d’entrée et le formulaire ont chacun une poignée à tirer avec laquelle la hauteur du
et changer la largeur de la liste (souris ou flèches, 
Le double-clic rétablit la valeur par défaut ; le navigateur se souvient des tailles). 

### En-tête

| Élément de contrôle | Description |
| --- | --- |
| En-tête | Se situe au-dessus du plan et donne son nom au fichier Excel. Optionnel : Laisser vide si la page a déjà un titre approprié ; le fichier est alors appelé « Projektplan_JJJJ-MM-TT.xlsx ». |
| « 42 / 300 entrées » | Combien d’entrées contient le plan, mesurées par rapport à la limite supérieure. |
| « Modifications non enregistrées » | Apparaît dès que le plan dans l’éditeur diffère de celui enregistré. |
| Annuler | Ferme l’éditeur ; dans le cas des modifications non enregistrées, il demande à l’avance s’il faut les défausser. |
| Appliquer | Écris le plan dans les paramètres et ferme l’éditeur. Il est sauvegardé avec la page. |

### Vue rapide

| Élément de contrôle | Description |
| --- | --- |
| Aperçu | La même chronologie que sur la page, avec zoom, sans filtre ni exportation. Cliquer sur une entrée, elle est sélectionnée dans l’onglet « Entrées » et la fait apparaître dans la liste. Cliquer sur **Aperçu** la fait retomber ; dépliée, la dernière hauteur est dessinée. |
| Cette section en tant que vue de démarrage | Sauvegarde la section visible de l’aperçu, jusqu’au mois, comme vue lors du chargement de la page. |
| Supprimer la vue Start | Supprime la vue d’accueil ; le widget affiche à nouveau le plan complet lors du chargement. |
| Commencez par Modèle | Seulement si le plan est vide : affiche les modèles à choisir (« Feuille de route produit », « Reprogrammation »). Cliquer sur une carte remplit l’éditeur de celle-ci ; **Revenir** revient sans modification. |
| Commencez vide | Seulement si le plan est vide : créez une couche « Niveau 1 ». |

### Onglet « Entrées » 

À gauche se trouve la liste des entrées, triées par date. Au-dessus se trouvent
**Parcourez les entrées** et en dessous un bouton pour le type — 
**Jalons**, **Points**, **Échéances**, chacun avec un numéro (si actif
search : hits) ; le bouton **+** à côté crée une entrée de ce type, 
et la recherche fonctionne au sein de l’espèce. 
En survolant une ligne, une corbeille de recyclage apparaît à droite pour suppression (avec
Requête). 

À droite, la forme de l’entrée sélectionnée ; au-dessus, son titre et
les boutons **Dupliquer** et **Supprimer**, en dessous desquels se trouvent les onglets **Généraux** 
(type, titre, description), **classification** (niveau, catégorie, série), 
**Date** (date ou début et fin, pour la flèche de point à la fin, provisoire)
**Dépendances** et **Contenu** (page liée ou article d’actualité). A
un point rouge sur l’onglet indique une entrée invalide ; pour les dates clés
**Dépendances** éliminées : 

| Champ | S’applique à | Description |
| --- | --- | --- |
| Type | Tous | Jalon, période ou échéance. Si vous changez à la date limite, le niveau est omis. |
| Titre | Tous | Obligatoire. Écrit sur l’entrée et dans les détails. |
| Description | Tous | Optionnel, multilignes. Apparaît uniquement dans les détails et dans l’export Excel. |
| Niveau | Jalon, Période | Le niveau dans lequel se trouve l’entrée. **Nouvelle couche ...** en crée un (nom) et l’assigne immédiatement. |
| Catégorie | tous | Détermine la couleur et, pour les jalons, la forme. « Sans catégorie » apparaît gris, les jalons sont en losange. **Nouvelle catégorie ...** en crée un (nom, couleur et forme) et l’assigne immédiatement. |
| Date | Jalon, échéance | La date. |
| Début, fin | Période | Premier et dernier jour ; tous deux appartiennent à cette période. |
| Flèche à la fin | Point | La barre se termine par une pointe de flèche — « continue ». |
| Série | Jalon, Période | Les entrées du même niveau avec le même nom de série sont sur une ligne. Le champ élargit la série de ce niveau avec le nombre de leurs entrées ; un nouveau nom tapé est repris via « « ... » créer comme une nouvelle série », **Aucune série** supprime l’entrée. |
| Provisoire | tous | La date n’a pas encore été fixée ; l’entrée apparaît sous forme de contour ou avec une bordure pointillée. |
| Cela dépend de | Jalon, Période | Les prédécesseurs de l’entrée ; sur la page sous forme de pointillée avec une flèche. |
| Lien | tous | **Aucun**, **Page** ou **Article de nouvelles**. Un changement casse un lien existant. Sur la page, l’inscription de l’entrée est alors soulignée, et un clic ouvre le contenu dans une fenêtre au-dessus du plan. |
| Page | Tous | La page Staffbase de la liste des pages (les 100 les plus récemment modifiées). **Nouvelle page ...** la crée dans l’éditeur Staffbase, qui superpose l’éditeur de plans ; après sa création, elle est liée. |
| Chaîne, Publication | tous | D’abord la chaîne d’information (avec son type : article, court message, image post), puis la publication. Les brouillons sont sélectionnables et marqués par « (brouillon) » — les lecteurs ne les voient qu’après publication. **Nouveau post ...** en crée un dans le canal sélectionné ; après l’enregistrement, il est lié. **Ouvrir dans un nouvel onglet** affiche le contenu lié. |
| Pièces jointes | Tous | Jusqu’à dix fichiers ou images provenant de la bibliothèque multimédia, chacun avec une légende optionnelle (sinon le nom du fichier). **Ajouter un fichier ou une image ...** ouvre la bibliothèque ; **↑**/**↓** organiser, **×** supprimé. Les pièces jointes restent derrière la connexion. Sur la page, elles sont à côté du contenu lié ou dans les détails, dans l’export Excel dans la colonne « Pièces jointes ». |
| Duplique | Tous | Créez une copie de l’entrée. |
| Supprimer | tous | Demande puis supprime l’entrée et toutes les dépendances qui y pointent ; la requête nomme les entrées dépendantes. |

### Onglet Calques 

| Élément de contrôle | Description |
| --- | --- |
| Nouvelle couche | Dans le coin supérieur droit de l’onglet. Créez une nouvelle couche. |
| Nom | Le nom de la couche, à gauche de son orbite. Doit être unique. À côté indique le nombre d’entrées qu’elle contient. |
| Flèches haut / bas | Ordre sur la page et exportation dans Excel. |
| Supprimer | Supprime le calque. S’il contient des entrées, l’éditeur demande s’il faut les déplacer vers un autre calque (sélectionner **Couche cible**) ou s’il faut aussi les supprimer. |

### Onglet « Catégories » 

| Élément de contrôle | Description |
| --- | --- |
| Nouvelle catégorie | En haut à droite de l’onglet. Créez une nouvelle catégorie. |
| Champ de couleur | Devant le nom ; affiche la couleur. Un clic développe les douze couleurs et le champ **Valeur hexadécimale** ; Échap ou un clic à côté se ferme. |
| Valeur hexadécimale | Une couleur personnalisée au format « #RRGGBB », par exemple « #E40045 ». |
| Bouton Forme | À côté du champ de couleur ; montre la forme avec laquelle apparaissent les jalons de la catégorie. Un clic ouvre les huit formes : losange, triangle, triangle avec la pointe vers le bas, carré, cercle, hexagone, étoile ou croix. Les touches fléchées modifient la forme. |
| Nom | Le nom dans la légende et dans les détails. Doit être unique. À côté indique le nombre d’entrées à lesquelles la catégorie est attribuée. |
| Flèches haut / bas | Ordre de la légende. |
| Supprimer | Supprime la catégorie ; ses entrées deviennent « sans catégorie ». La requête donne son numéro. |

## Frontières

- Un plan a un maximum de **300 entrées**, **20 niveaux** et
  **24 catégories**. Au-delà de cela, l’éditeur n’accepte plus rien. 
- Les rendez-vous durent **des journées entières** sans temps libre. La vue de départ est
  **Mensuelle**. 
- Le texte n’est jamais de la couleur de la catégorie — des couleurs vives comme le jaune sont restées
  sinon illisible sur blanc. La couleur n’est portée que par la forme, les barres et
  point de légende ; l’écriture dans le bar est noire ou blanche, selon la raison
  est plus facile à lire. 
- **Sans entrées, le widget n’affiche rien** — ni une image vide ni
  Un message. 

## Dépendances entre les univers

- **La ligne Afficher aujourd’hui** ne fonctionne que si aujourd’hui est visible
  extrait. Dans le cas d’un plan qui appartient entièrement au passé ou
  Future, la ligne ne peut donc être vue qu’après avoir été déplacée. 
- L'**en-tête** détermine également le nom du fichier Excel ; sans
  Ça ne sert que de titre. 
- **Heading** et **Home view** sont définis dans l’éditeur de plans, pas dans le
  dialogue ; les deux font partie du plan.