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
