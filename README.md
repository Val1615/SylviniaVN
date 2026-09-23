# Les Chroniques de Sylvinia — Visual Novel · v0.412

**Sylvinia VN** (Tome 1) — visual novel HTML/JS en **bêta**, basé sur l’univers de Sylvinia imaginé, supervisé et validé par **le Chroniqueur Vagabond**.

Tu incarnes **Hylee** dans un récit où **Remerii** occupe une place centrale. Quatre valeurs façonnent les choix : **Audace**, **Lucidité**, **Sang-froid** et **Résonance** (plus le **Regard de Remerii**).

## Jouer

- **En ligne (GitHub Pages)** : [https://val1615.github.io/SylviniaVN/](https://val1615.github.io/SylviniaVN/)
- **En local** : ouvrir `index.html` dans un navigateur moderne (Chrome / Firefox / Edge recommandés).

Aucune installation n’est requise pour le Mode Histoire. La Chronique Alternative est déjà construite en version statique sous `chronique-alternative/`.

## Deux modes

| Mode | Accès | Contenu |
|------|--------|---------|
| **Mode Histoire** | Écran d’accueil → Mode Histoire, ou `index.html` | Récit canonique d’Hylee (chapitres), périodes libres entre chapitres, Codex, progression, sauvegarde VN |
| **Chronique Alternative** (*Mode libre*) | Écran d’accueil → Chroniques Alternatives, ou bouton **Mode libre** du menu, ou `chronique-alternative/` | Dating sim React exporté en site statique : création de personnage, carte, voyages, relations, romances, logement, sauvegarde séparée |

Les deux modes sont reliés par `fusion/game-modes.js`. La Chronique Alternative **ne modifie pas** la sauvegarde canonique d’Hylee (clés locales `sylvinia-liens-*`).

Détails d’architecture : [FUSION_ARCHITECTURE.md](FUSION_ARCHITECTURE.md) · Mode libre : [chronique-alternative/README.md](chronique-alternative/README.md).

## Contenu du Mode Histoire (fusion)

Couverture documentée dans `FUSION_ARCHITECTURE.md` :

| Élément | Quantité |
|---------|---------:|
| Périodes libres | 19 |
| Sous-lieux contextuels | 62 |
| Scènes facultatives (scripts VN dédiés) | 145 |
| Confidences relationnelles | 21 |
| Retours sur les chapitres | 12 |
| Mini-jeux contextuels | 4 |

Les périodes libres réutilisent décors et sprites du VN ; l’interface reste en plein écran (HUD narratif en bas, tiroir latéral pour lieux / relations / journal). Les sprites du Dating Sim restent réservés à la Chronique Alternative.

Le build actuel (`index.html`) intègre le récit jusqu’au **Chapitre XV · L’heure du départ**, avec branches (notamment Valurn / Draven, Iriana / Groupe) et contenus associés (Codex, musiques, images clés, duels / QTE selon les chapitres).

## Chronique Alternative (aperçu)

Version statique du Dating Sim d’origine (React + Vite) :

- 9 personnages romançables, routes selon le sexe du protagoniste ;
- système de **Biens** (inventaire + patrimoine immobilier) sur plusieurs villes ;
- sauvegarde indépendante du Mode Histoire.

Voir le README du dossier pour les chiffres détaillés (routes, logements, scènes domestiques).

## Technique

- **Mode Histoire** : visual novel monolithique en HTML / CSS / JavaScript (`index.html`), enrichi par les scripts de `fusion/`.
- **Chronique Alternative** : app React (`chronique-alternative/source/`), build Vite publié dans `chronique-alternative/build/` + `chronique-alternative/index.html`.
- **Assets** : `assets/` (images, sprites, audio, vidéo, intro, etc.).
- **Tests fusion** : `tests/` (`story-world.test.cjs`, etc.).

## Structure du dépôt

```text
index.html                 # VN jouable (build courant)
fusion/                    # Moteur Mode Histoire / périodes libres / navigation des modes
  game-modes.js
  story-world.js / .css
  story-periods.js
  story-moments.js
  story-authored-scenes.js
  story-dialogues.js
chronique-alternative/     # Mode libre (statique + sources React)
assets/                    # Médias du VN
tests/                     # Tests automatisés de la fusion
FUSION_ARCHITECTURE.md     # Architecture des deux modes
Ressource lore/            # Documents de lore (Bible, Tomes…)
SylviniaVN_v0219.html      # Ancienne capture HTML (historique) — le jeu courant est index.html
```

## Lore et design des choix

- Quatre valeurs + Regard de Remerii : guide d’écriture dans [README_valeurs_comportements_VN.md](README_valeurs_comportements_VN.md).
- Documents étendus (Bible, Tomes) dans `Ressource lore/`.

## Développement

### Mode Histoire

Éditer `index.html` et/ou les fichiers de `fusion/`, puis recharger la page. Les scripts fusion sont inclus en fin de `index.html` :

```html
<link rel="stylesheet" href="fusion/story-world.css?v=…">
<script src="fusion/story-moments.js?v=…"></script>
<script src="fusion/story-authored-scenes.js?v=…"></script>
<script src="fusion/story-dialogues.js?v=…"></script>
<script src="fusion/story-periods.js?v=…"></script>
<script src="fusion/story-world.js?v=…"></script>
<script src="fusion/game-modes.js"></script>
```

Un **mode développeur** (Options) expose des outils de test (recherche de scène, réglage des valeurs, révélation temporaire du Codex, etc.).

### Chronique Alternative

```bash
cd chronique-alternative/source
npm install
npm test
npm run build
```

Le build adapte les chemins d’assets pour un serveur local ou GitHub Pages (`/SylviniaVN/`).

## Statut

- **Version affichée / derniers correctifs dans `index.html`** : **v0.412** (Chapitre XV · visuels recalés).
- **État** : bêta publique via GitHub Pages (`main` → `/`).
- Le titre historique du README (`v0.91`) et le fichier `SylviniaVN_v0219.html` ne reflètent plus le build courant.

## Liens

- Jouer : [https://val1615.github.io/SylviniaVN/](https://val1615.github.io/SylviniaVN/)
- Dépôt : [https://github.com/Val1615/SylviniaVN](https://github.com/Val1615/SylviniaVN)
- Architecture fusion : [FUSION_ARCHITECTURE.md](FUSION_ARCHITECTURE.md)
- Chronique Alternative : [chronique-alternative/README.md](chronique-alternative/README.md)
