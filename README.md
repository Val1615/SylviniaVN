# Les Chroniques de Sylvinia — Visual Novel

**État du projet : Bêta**  
**Version de travail : v0.206**  
**Fichier principal : `index.html`**

Ce README accompagne la version HTML actuelle du Visual Novel. Il remplace les anciens fichiers de suivi restés centrés sur les chapitres précédents.

---

## Lancement

Ouvrir simplement :

```text
index.html
```

Le projet est pensé pour fonctionner comme un Visual Novel web statique. Les assets doivent conserver les chemins appelés par le HTML, principalement dans le dossier :

```text
assets/
```

Déploiement recommandé : GitHub Pages ou tout hébergement statique équivalent.

---

## Contenu jouable actuel

Le VN contient actuellement :

| Clé | Affichage | Titre / fonction | État |
|---|---|---|---|
| `intro` | Introduction | L’Auberge du Forestier | Jouable |
| `ch1` | Chapitre I | Une convocation impériale | Jouable |
| `ch2` | Chapitre II | Sur la route d’Al’Gratal | Jouable |
| `ch3` | Chapitre III | Préparatifs pour une nouvelle aventure | Jouable |
| `ch4` | Chapitre IV | Croisée des récits | Jouable, double approche Valurn / Draven |
| `ch5` | Chapitre V | Une rencontre hors du temps | Jouable |
| `ch6` | Chapitre VI | Parenthèse à Mir’Aldas | Jouable |
| `ch7` | Chapitre VII | Du Chaos aux Ombres | Jouable |
| `ch8` | Chapitre VIII | Un sombre conseiller | Jouable |
| `ch9` | Chapitre IX | L’heure du départ | Jouable |
| `ch10` | Chapitre X | Deux perspectives | Jouable, choix définitif entre Route Iriana et Route Groupe |
| `ch11_i` | Chapitre XI_I | Amie ou ennemie ? | En développement, accessible seulement après la Route Iriana |
| `ch11_g` | Chapitre XI_G | Le Bal des Élus | En développement, accessible seulement après la Route Groupe |

---

## Architecture des routes

### Chapitre X

Le Chapitre X est structuré en deux perspectives incompatibles hors mode développeur.

- **Route Iriana** : `c10_...`, intitulée **Chapitre X-I · L’Impératrice Noire**.
- **Route Groupe** : `c10g_...`, intitulée **Chapitre X-G · Les Geôles de la Cité Noire**.

Hors mode développeur, le choix de route verrouille la suite de l’aventure. En mode développeur, les deux routes restent consultables pour test.

### Chapitre XI_I

**Chapitre XI_I · Amie ou ennemie ?** est réservé à la Route Iriana.

Il doit être accessible uniquement si la Route Iriana du Chapitre X a été choisie et terminée.

Ce chapitre poursuit la relation Iriana / Amanea dans Akuhn’Nabad et exploite notamment le flag :

```text
amanea_respecte_lucidite_iriana
```

Ce chapitre est marqué **EN DÉVELOPPEMENT** dans l’écran de sélection et affiche un disclaimer au lancement.

### Chapitre XI_G

**Chapitre XI_G · Le Bal des Élus** est réservé à la Route Groupe.

Il doit être accessible uniquement si la Route Groupe du Chapitre X a été choisie et terminée.

Ce chapitre poursuit le retour à la cour sylvinienne, la tension Hylee / Remerii, la préparation du bal et les jeux politiques autour des Élus.

Ce chapitre est marqué **EN DÉVELOPPEMENT** dans l’écran de sélection et affiche un disclaimer au lancement.

---

## Règles de design des choix

Les règles suivantes doivent être conservées pour les prochains ajouts :

- Ne pas raccourcir le texte canonique du Tome 1.
- Les choix doivent ajouter des dialogues, variations, approfondissements ou opportunités, sans remplacer le canon.
- Les choix à prérequis ne doivent pas être de simples reformulations d’un choix libre.
- Dans une salve de 4 à 5 choix, éviter d’enfermer le joueur avec trop de choix verrouillés.
- Les choix stratégiques doivent rester rares et difficiles.
- Un choix stratégique doit apporter au moins une récompense forte : souvenir / flag futur, item, ou vraie scène bonus conséquente sur plusieurs scènes.
- En cas de double valeur, la seconde valeur doit représenter 50 % de la première.
- Le Lien Remerii ne doit plus être affiché dans le HUD principal. Il appartient à l’onglet **Regard de Remerii**.

---

## Systèmes principaux

### Valeurs

Valeurs permanentes :

```text
Audace
Sang-froid
Lucidité
Résonance
```

Le moteur conserve aussi un suivi relationnel de Remerii, mais il doit rester dans la Progression, pas dans l’interface de jeu principale.

### Progression

La page Progression regroupe :

```text
Valeurs d’Hylee
Regard de Remerii
Inventaire
Souvenirs marquants
Le Carnet du Némésis
```

### Codex

Le Codex contient des entrées, images et musiques, organisées par catégories et chapitres. Le mode développeur doit permettre de tout consulter pour test.

### Modes

Le projet contient :

- mode normal ;
- mode facile ;
- mode développeur ;
- mode mobile ;
- sauvegarde locale ;
- bouton de signalement de bug.

---

## Notes de version récentes

### v0.199

Ajout du **Chapitre XI_I · Amie ou ennemie ?**, réservé à la Route Iriana.

### v0.200

Ajout du **Chapitre XI_G · Le Bal des Élus**, réservé à la Route Groupe.

### v0.201

Correction de la mise en forme des dialogues : incises en italique, répliques avec guillemets, correction de locuteurs cassés.

### v0.202

Rééquilibrage des choix stratégiques et des choix à prérequis. Les stratégiques deviennent plus rares et plus impactants.

### v0.203

Découpage plus fin de la Route Iriana du Chapitre X pour rapprocher sa granularité de la Route Groupe.

### v0.204

Ajout d’un disclaimer au lancement de XI_I et XI_G pour signaler que ces chapitres sont en développement et incomplets.

### v0.205

Retour à un style neutre dans l’écran de sélection des chapitres : suppression des couleurs spécifiques appliquées au Chapitre X, XI_I et XI_G. Le badge **EN DÉVELOPPEMENT** reste présent sur XI_I et XI_G.

### v0.206

Mise à jour de **La complainte impériale** dans **Chapitre XI_I · Amie ou ennemie ?** :

- remplacement des paroles selon la nouvelle répartition Iriana / Amanea ;
- découpage des paroles en scènes VN plus lisibles ;
- lancement de `La complainte impériale · Instrumental` à `c11i_004` ;
- lancement de `La complainte impériale · Chantée` à `c11i_011` ;
- ajout des deux pistes dans le Codex musical du Chapitre XI_I.

---

## Fichiers attendus dans cette archive

Cette archive contient :

```text
index.html
README.md
assets/audio/chapter11/la_complainte_imperiale_instru.mp3
assets/audio/chapter11/la_complainte_imperiale.mp3
```

Les autres assets du projet doivent rester conservés dans le projet déjà en place.
