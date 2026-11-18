# Sylvinia Studio : modifier et publier un chapitre

Sylvinia Studio est l'éditeur des chapitres du Mode Histoire. Il s'ouvre dans le navigateur, sans rien installer :

- en ligne : **https://val1615.github.io/SylviniaVN/studio/**
- en local : lancer un petit serveur à la racine du dépôt (`python3 -m http.server`), puis ouvrir `http://localhost:8000/studio/`. Le Studio ne fonctionne pas en ouvrant le fichier directement (adresse `file://`).

Un lien « Ouvrir Sylvinia Studio » apparaît aussi dans les outils du mode développeur du jeu.

## 1. Ouvrir un chapitre
1. Onglet **Chapitres** (colonne de gauche sur ordinateur) : les 22 chapitres du jeu sont listés avec leurs scènes, répliques, choix et leur état (Publié, Modifié, Brouillon).
2. Touchez **Éditer**, puis une scène. Une scène regroupe les répliques qui portent le même titre.

## 2. Écrire
- Chaque carte est une réplique du jeu : personnage, texte, indication de mise en scène.
- **+ Réplique** / **+ Narration** insèrent après la réplique sélectionnée. **Insérer avant** existe aussi.
- **▲ ▼**, la poignée **⋮⋮** (souris) ou **Déplacer après…** réordonnent les répliques.
- Cochez plusieurs cartes puis **Copier** ; **Coller** insère les répliques copiées, ou un passage entier (un paragraphe par réplique, « Nom : texte » pour un personnage).
- **Rechercher** remplace un mot dans la scène, le chapitre ou tout le Mode Histoire.
- **↶ ↷** annulent et rétablissent (Ctrl+Z, Ctrl+Y hors zone de texte).
- **Détails** : sous-titre, effet sonore, condition de visibilité (statistiques, drapeaux ET / OU / NON), note d'auteur.

Les identifiants (ex. `c10_01`) ne changent jamais. Une réplique « retirée » n'est plus atteinte par le récit, mais reste connue du jeu : une sauvegarde arrêtée dessus continue de fonctionner.

## 3. Branches, conditions, visuels
- **Branches** : graphe des scènes du chapitre (traits dorés = choix, pointillés = choix sous condition, liseré bleu = convergence), liste des problèmes (destination introuvable, fin sans suite, passage sans lien entrant), et éditeur des réponses : libellé, note, destination, effets (Audace +1…), drapeaux posés, prérequis (Lucidité ≥ 20, drapeaux exigés, au moins un drapeau), souvenirs et objets. Seuls les noms internes existants sont proposés.
- **Visuels** : décor (recherche par nom), personnages (expression, position gauche, centre, droite, arrière plan, assombri, ordre), musique, effet sonore, zoom et masquage. Sur la scène miniature, glissez un personnage ou touchez le puis touchez une zone.

## 4. Tester
**▶ Tester cette scène** lance le vrai moteur du jeu à cet endroit, avec vos modifications. **État de test** règle les statistiques, drapeaux, scènes déjà vues, souvenirs et objets. L'aperçu se met à jour pendant que vous écrivez. Il utilise un état isolé : vos sauvegardes de joueur ne sont jamais lues ni écrites.

## 5. Enregistrer
Tout est enregistré automatiquement dans ce navigateur (IndexedDB, avec une copie de secours). **Versions** garde un historique restaurable (automatique toutes les 5 minutes de travail, et à la demande). Le brouillon reste propre à l'appareil : exportez une **sauvegarde complète (.json)** pour le reprendre ailleurs (bouton **Publier**, puis **Importer**).

## 6. Publier dans le jeu
Le jeu lit au démarrage le fichier **`studio/data/modifications.js`** et applique ces changements par-dessus les scènes d'origine. Aucun dialogue n'est à recopier.

Deux façons de publier (bouton **Publier**) :
1. **Exporter pour le jeu** télécharge `modifications.js`. Sur GitHub, ouvrez le dossier `studio/data/`, **Add file › Upload files**, déposez le fichier (il remplace l'ancien) et validez. GitHub Pages met le jeu à jour en quelques minutes.
2. **Publier sur GitHub** crée une branche de travail et une demande de fusion qui ne touche que ce fichier. Relisez-la puis fusionnez. Il faut un jeton GitHub « fine-grained » limité au dépôt SylviniaVN, avec les droits *Contents* et *Pull requests* en lecture et écriture (GitHub › Settings › Developer settings › Fine-grained tokens). Le jeton n'est jamais écrit dans le code ; il reste dans ce navigateur seulement si vous cochez « Mémoriser ».

La publication est bloquée seulement si une erreur casserait le jeu (destination introuvable, donnée mal formée). Si la version en ligne a changé depuis le début de votre brouillon, le Studio vous propose de l'intégrer d'abord : vos répliques modifiées sont gardées.

## 7. Revenir en arrière
- Annuler une publication : remettre l'ancien `modifications.js` (historique GitHub), ou vider le fichier (`"nodes": {}` et `"chapters": {}`) pour retrouver exactement le jeu d'origine.
- Les scènes d'origine dans `index.html` ne sont jamais modifiées par le Studio.
- Ne supprimez pas du fichier une réplique ajoutée déjà publiée : un joueur arrêté dessus serait renvoyé au début. Retirez la plutôt dans le Studio.

# Espace Chroniques Alternatives

Ouvrir : bouton « Chroniques Alternatives » en haut de la liste des chapitres du Studio, ou `studio/ca.html`, ou dans la Chronique Alternative : Options, Session, mode développeur actif, « Ouvrir Sylvinia Studio » (nouvel onglet). Les données, brouillons, versions et sauvegardes de la CA restent séparés de ceux du Mode Histoire.

## 1. Trouver un contenu
Le Catalogue range les 134 modules réels en 18 catégories (temps libres, confidences, fils personnels, relations, quêtes, quêtes croisées, rendez-vous, scènes domestiques, scènes intimes, rencontres, activités, événements du monde, lettres, lieux, événements spéciaux, calendrier, objets). Filtres par personnage et par état (modifié, publié). « Rechercher dans tous les textes » cherche une phrase dans toute la CA et ouvre directement la scène.

## 2. Modifier
Dans une scène : chaque réplique, titre, ouverture, réponse ou description a sa zone de texte, avec le locuteur. « Texte d'origine » et « Rétablir l'original » sous chaque texte modifié. Les repères `{1}`, `{2}` remplacent des parties calculées par le jeu : gardez les. Les seuils (confiance minimale, stade, désir...) et les effets (affection, confiance, statistiques...) sont des cases numériques. Annuler et rétablir : flèches en haut, ou Ctrl+Z et Ctrl+Y.

## 3. Créer
Chaque liste réelle a un bouton « + Ajouter » ; chaque module avec une collection a « + Créer ». Le Studio copie un élément existant choisi par vous (même structure, mêmes conditions, nouvel identifiant), puis vous réécrivez tout : textes, seuils, lieux, connaissance révélée, choix. Exemples testés : une réponse ajoutée à un moment de Naïah, une confidence d'Hylee avec un seuil de confiance et une nouvelle connaissance, une étape de Remerii à deux choix, une scène croisée Allenna et Lineva, un rendez-vous, une activité quotidienne jouable dans le jeu. « Masquer... » retire un élément d'une liste interne sans le supprimer. Rien n'est inventé à votre place : aucun texte n'est généré.

## 4. Contrôles
Erreurs bloquantes (identifiant en double, valeur invalide), avertissements (texte orphelin après une modification du code, référence vers un contenu créé supprimé, règles des personnages), liste des modifications non publiées avec « Annuler », et recherche de références (identifiant, drapeau, liste).

## 5. Tester
« Tester dans le jeu » lance la vraie Chronique Alternative avec votre brouillon, dans un état de test isolé : nouvelle partie, copie de votre partie (lue seulement) ou sauvegarde importée, avec jour, relations (affection, confiance, désir, stade), drapeaux, mode développeur et déverrouillage réglables. Les textes modifiés affichés sont entourés d'or et marqués « vu dans l'aperçu » dans l'éditeur. Vos vraies sauvegardes ne sont jamais lues ni écrites par l'aperçu. Il n'y a pas de saut direct vers une scène : placez la partie de test au bon jour, au bon lieu et avec les bonnes relations, puis jouez jusqu'à la scène.

## 6. Enregistrer
Enregistrement automatique sur l'appareil, version automatique toutes les 5 minutes de travail, « Versions » pour créer, lister et restaurer.

## 7. Publier
« Publier » : 1) « Exporter pour le jeu » produit `modifications-ca.js`, à déposer dans `studio/data/` du dépôt ; 2) sauvegarde complète et import (fusion ou remplacement) ; 3) « Publier sur une branche de travail » crée une demande de fusion GitHub qui ne change que `studio/data/modifications-ca.js`. Si la version en ligne a changé depuis votre brouillon, le Studio vous propose de l'intégrer avant de publier. Le jeton GitHub n'est jamais écrit dans le code ; il reste dans le navigateur seulement si vous cochez « Mémoriser ». Rien n'est fusionné automatiquement.

## 8. Revenir en arrière
Remettre `studio/data/modifications-ca.js` dans son état vide rend la Chronique Alternative d'origine. Vos sauvegardes de joueur ne sont jamais modifiées.
