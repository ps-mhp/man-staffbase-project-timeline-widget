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

L’éditeur de plan se compose du champ **Titre**, de l'**Aperçu** et
Trois onglets. En haut à droite, il est indiqué combien d’entrées contient la carte, pour le
Exemple « 42 / 300 entrées ». 

### Tête

| Champ | Description |
| --- | --- |
| En-tête | En haut de l’éditeur de plans. Se place au-dessus du plan et donne son nom au fichier Excel. Optionnel : Laissez vide si la page a déjà un titre approprié ; le fichier sera alors appelé « Projektplan_JJJJ-MM-TT.xlsx ». |

### Vue rapide

| Élément de contrôle | Description |
| --- | --- |
| Aperçu | La même chronologie que sur la page, avec zoom, sans filtres ni exportation. Cliquer sur une entrée la sélectionne dans l’onglet « Entrées ». Peut être repliée. |
| Cette section en tant que vue de démarrage | Sauvegarde la section visible de l’aperçu, jusqu’au mois, comme vue lors du chargement de la page. |
| Supprimer la vue Start | Supprime la vue d’accueil ; le widget affiche à nouveau le plan complet lors du chargement. |
| Commencez par Plan Exemple | Seulement lorsque le plan est vide : remplissez l’éditeur avec un titre, trois niveaux, sept catégories et des entrées d’exemple. |

### Onglet « Entrées » 

À gauche se trouve la liste de toutes les entrées, triées par date et via **Entrées
naviguer** recherchable ; au-dessus, sous **Ajouter**, un bouton pour
**Jalon**, **Point** et **Deadline**. À droite, la forme de la
Entrée sélectionnée : 

| Champ | S’applique à | Description |
| --- | --- | --- |
| Type | Tous | Jalon, période ou échéance. Si vous changez à la date limite, le niveau est omis. |
| Titre | Tous | Obligatoire. Écrit sur l’entrée et dans les détails. |
| Description | Tous | Optionnel, multilignes. Apparaît uniquement dans les détails et dans l’export Excel. |
| Niveau | Jalon, Période | Le niveau dans lequel se trouve l’entrée. |
| Catégorie | Tous | Détermine la couleur. « Sans catégorie » apparaît en gris. |
| Date | Jalon, échéance | La date. |
| Début, fin | Période | Premier et dernier jour ; tous deux appartiennent à cette période. |
| Symbole | Jalon | Losange (par défaut), triangle, carré ou cercle. |
| Flèche à la fin | Point | La barre se termine par une pointe de flèche — « continue ». |
| Série | Jalon, Période | Les entrées du même niveau portant le même nom de série sont sur une ligne. Le champ suggère la série de ce niveau. |
| Provisoire | tous | La date n’a pas encore été fixée ; l’entrée apparaît sous forme de contour ou avec une bordure pointillée. |
| Cela dépend de | Jalon, Période | Les prédécesseurs de l’entrée ; sur la page sous forme de pointillée avec une flèche. |
| Duplique | Tous | Créez une copie de l’entrée. |
| Supprimer | Tous | Supprime l’entrée et toutes les dépendances qui y sont référées. |

### Onglet Calques 

| Élément de contrôle | Description |
| --- | --- |
| Nouvelle couche | Créez une nouvelle couche. |
| Nom | Le nom de la couche, à gauche de son orbite. À côté indique le nombre d’entrées qu’elle contient. |
| Flèches haut / bas | Ordre sur la page et exportation dans Excel. |
| Supprimer | Supprime le calque. S’il contient des entrées, l’éditeur demande s’il faut les déplacer vers un autre calque (sélectionner **Couche cible**) ou s’il faut aussi les supprimer. |

### Onglet « Catégories » 

| Élément de contrôle | Description |
| --- | --- |
| Nouvelle catégorie | Créer une nouvelle catégorie. |
| Nom | Le nom dans la légende et dans les détails. |
| Couleur | L’un des douze champs de couleur. |
| Valeur hexadécimale | Une couleur personnalisée au format « #RRGGBB », par exemple « #E40045 ». |
| Flèches haut / bas | Ordre de la légende. |
| Supprimer | Supprime la catégorie ; ses entrées deviennent « sans catégorie ». La requête donne son numéro. |

## Frontières

- Un plan a un maximum de **300 entrées**, **20 niveaux** et
  **24 catégories**. Au-delà de cela, l’éditeur n’accepte plus rien. 
- Les rendez-vous durent **des journées entières** sans temps libre. La vue de départ est
  **Mensuelle**. 
- Le texte n’est jamais de la couleur de la catégorie — des couleurs vives comme le jaune sont restées
  sinon illisible sur blanc. La couleur n’est portée que par le symbole, la barre et
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