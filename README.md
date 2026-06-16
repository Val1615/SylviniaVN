# Les Chroniques de Sylvinia — Visual Novel

**État du projet : Bêta**  
**README remis à jour depuis `index.html`**  
**Dernier patch repéré dans le HTML : v0.198**  
**Fichier principal : `index.html`**

Ce README remplace l’ancien fichier resté centré sur la v0.91 / v0.104 et le Chapitre III.  
Le HTML actuel contient désormais l’Introduction, les Chapitres I à X, un Codex complet par catégories, une Progression enrichie, le Carnet du Némésis, le Regard de Remerii, le mode développeur, le mode facile, le mode mobile et le Chapitre X à double perspective.

---

## 1. Lancement

Ouvrir simplement :

```text
index.html
```

Le projet est pensé pour fonctionner comme un Visual Novel web statique.  
Les chemins d’assets doivent rester identiques à ceux appelés dans le HTML, principalement dans le dossier :

```text
assets/
```

Déploiement recommandé :

```text
GitHub Pages
```

ou tout hébergement statique équivalent.

---

## 2. Fichiers et dossiers importants

Structure attendue :

```text
index.html
README.md
assets/
  audio/
  images/
  intro/
  sprites/
  video/
```

Le HTML référence actuellement plusieurs centaines d’assets externes : décors, images clés, sprites et musiques.

Résumé d’analyse du HTML fourni :

| Type | Quantité repérée |
|---|---:|
| Assets référencés dans le moteur | 414 |
| Images PNG | 374 |
| Images JPG | 7 |
| Musiques MP3 | 33 |
| Entrées de Codex | 58 |
| Images / CG de Codex | 208 |
| Musiques de Codex | 37 |

Ces nombres sont indicatifs : ils correspondent aux clés et chemins repérés dans le HTML actuel.

---

## 3. Contenu jouable actuel

Le VN contient l’Introduction et les Chapitres I à X.

| Clé | Affichage | Titre | État / contenu |
|---|---|---|---|
| `intro` | Introduction | L’Auberge du Forestier | Prologue deux ans avant le récit principal. Hylee, l’auberge, Remerii, choix de départ et fins alternatives. |
| `ch1` | Chapitre I | Une convocation impériale | Deux ans plus tard. Entraînement, premier duel interactif, projection d’Iriana. |
| `ch2` | Chapitre II | Sur la route d’Al’Gratal | Voyage vers l’Empire, première approche d’Al’Gratal, tensions politiques et catacombes. |
| `ch3` | Chapitre III | Préparatifs pour une nouvelle aventure | Marché, robe bleue, Atelier Arcanique, bâton, duel des Ombres, Glacialis Absoluta, Medig, cauchemar. |
| `ch4` | Chapitre IV | Croisée des récits | Choix de route entre Valurn et Draven. Route Valurn orientée Calciterres / Bellirith ; route Draven orientée Forthaven / Lineva. |
| `ch5` | Chapitre V | Une rencontre hors du temps | Arrivée à Mir’Aldas, Saidin, bibliothèque, Épreuve du Cadran, dilemme moral. |
| `ch6` | Chapitre VI | Une Parenthèse au Cœur de Mir’Aldas | Chapitre plus intime entre Hylee et Remerii : ruelles, pâtisserie, cristal de navigation, terrasse, relationnel. |
| `ch7` | Chapitre VII | Du Chaos aux Ombres | Valurn dans la Forêt Interdite, rencontre avec Naïah, pacte, duels mentaux et santé mentale. |
| `ch8` | Chapitre VIII | Un sombre conseiller | Forthaven, rapport de Caldran, conseiller masqué, tensions Iriana / Valurn, révélation autour de Naïah et Amanea. |
| `ch9` | Chapitre IX | L’heure du départ | Départ vers la Forêt Interdite, Naïah guide, Akuhn’Nabad, Obscurcis, Alamma, capture du groupe et séparation d’Iriana. |
| `ch10` | Chapitre X | Deux perspectives | Choix entre Route Iriana et Route Groupe. Hors mode développeur, la perspective est définitive pour l’aventure. |

---

## 4. Chapitre X : double route

Le Chapitre X est désormais structuré en deux perspectives incompatibles hors mode développeur.

### Route Iriana — `c10_...`

Titre interne :

```text
Chapitre X-I · L’Impératrice Noire
```

Contenu principal :

- Iriana isolée dans les geôles d’Akuhn’Nabad.
- Premiers signes de l’horreur des extractions d’âme.
- Rencontre directe avec Amanea.
- Visite de la cité obscurcie.
- Découverte d’un peuple organisé, religieux et politique, et non d’une simple caricature impériale.
- Déblocage du fragment `ch10` du Carnet du Némésis : **Journal d’Amanea – Cellule 17**.

### Route Groupe — `c10g_...`

Titre interne :

```text
Chapitre X-G · Les Geôles de la Cité Noire
```

Contenu principal :

- Hylee, Remerii, Valurn, Draven et Naïah prisonniers dans les geôles runiques.
- Valurn négocie avec un Obscurci.
- Bellirith visite la cellule et déstabilise le groupe.
- Fracture émotionnelle entre Hylee et Remerii.
- Progression dans Akuhn’Nabad, archives obscurcies, révélation sur le portail et retour vers le palais.
- Face-à-face final avec Tia Farae.
- La route Groupe ne déverrouille pas le fragment `ch10`, réservé à la Route Iriana.

### Choix de perspective

Le choix de perspective a été réparé et sécurisé :

- le joueur voit explicitement le choix entre Iriana et le groupe ;
- hors mode développeur, la route choisie est verrouillée ;
- en mode développeur, les routes peuvent être prévisualisées sans verrouiller définitivement la sauvegarde ;
- la carte du Chapitre X dans la sélection change selon la route choisie.

---

## 5. Systèmes principaux

### Valeurs d’Hylee

Valeurs permanentes :

```text
Audace
Sang-froid
Lucidité
Résonance
```

Le **Lien Remerii** existe encore techniquement, mais il ne doit plus apparaître dans le HUD principal pendant le jeu.  
Il est affiché dans la Progression, section **Regard de Remerii**.

Les valeurs ne sont plus limitées à l’ancien plafond de 45.  
Le moteur utilise une logique de valeurs ouvertes, avec `VALUE_CAP = 999` côté code.

### Choix

Le VN gère plusieurs types de choix :

- choix simples ;
- choix à valeur ;
- choix à prérequis ;
- choix à double prérequis ;
- choix stratégiques ;
- choix de route ;
- choix de duel ;
- choix contextuels ajoutés dans la Route Groupe.

Règle importante conservée :

- les choix à prérequis doivent produire une vraie variation de scène ;
- ils ne doivent pas être une reformulation faible d’un choix libre ;
- les transitions après les choix doivent rester lisibles et naturelles.

### Choix supplémentaires du Chapitre X-G

La Route Groupe contient désormais des interventions ponctuelles d’Hylee, ajoutées pour mieux rythmer la route.

Choix ajoutés :

| Moment | Choix | Valeur requise |
|---|---|---:|
| Négociation Valurn / Obscurci | Ajouter une pression calme | Sang-froid 40 |
| Tension Draven / Valurn | Se placer entre eux | Audace 41 |
| Absence de Saidin | Sentir le contour du vide | Résonance 26 |
| Révélation du portail | Nommer la menace | Lucidité 42 |
| Arrivée face à Tia | Rester droite malgré la Lumière | Sang-froid 43 |

Ces choix ont reçu un polissage de transition en v0.198 afin d’éviter les reprises brutales ou les impressions de scène doublée.

---

## 6. Progression

L’écran **Progression** contient :

```text
Valeurs d’Hylee
Regard de Remerii
Inventaire
Souvenirs marquants
Le Carnet du Némésis
```

### Inventaire

Objets importants repérés :

- `jeton_imperial`
- `baton_apprenti_renforce`
- `baton_cerisier_noir`
- `baton_cerisier_noir_accorde`
- `carnet_voyage_renforce`
- `grimoire_sombre`
- `plume_medig`
- `fragment_thazran`
- `marque_calciterres`
- `sceau_forthaven_fissure`
- `eclat_chronal_saidin`

### Souvenirs

Le système conserve des souvenirs marquants pour Hylee, Remerii, Medig, Valurn, Bellirith, Lineva, Draven, Naïah, Saidin et les perspectives du Chapitre X.

Exemples :

- Remerii se souviendra de cette assurance.
- Remerii se souviendra de cette intuition.
- Medig se souviendra de cette confiance.
- Thazran se souviendra de cette audace.
- Lineva a accepté par loyauté.
- Naïah se souviendra de ce jeu partagé.
- Perspective choisie : Iriana.
- Perspective choisie : le groupe.

---

## 7. Regard de Remerii

Le **Lien Remerii** n’est plus affiché comme une valeur standard du HUD.

Il est déplacé dans :

```text
Progression > Regard de Remerii
```

Cette section contient deux blocs distincts :

```text
Ce que Remerii remarque chez Hylee
Souvenirs marquants pour Remerii
```

Règle d’écriture / interface :

- les observations de Remerii doivent être liées aux valeurs et à la posture d’Hylee ;
- les souvenirs précis doivent rester dans **Souvenirs marquants pour Remerii** ;
- les changements de lien doivent passer par notifications discrètes du type :
  - `Remerii a apprécié ça`
  - `Remerii a détesté ça`
  - `Lien Remerii −15`

### Fracture Hylee / Remerii en Chapitre X-G

La scène `c10g_choice_blessure` a été renforcée.

État actuel :

- Hylee ressent réellement l’impact de la phrase de Remerii.
- Remerii ne sait pas comment répondre.
- Plusieurs réactions sont jouables : distance, aveu blessé, froideur, report de l’explication.
- Une perte unique de **Lien Remerii −15** est appliquée lorsque la fracture est atteinte.

---

## 8. Carnet du Némésis

Le Carnet du Némésis remplace l’ancien affichage des fragments du mystérieux journal.

Texte d’interface actuel :

```text
À chaque fin de chapitre (Introduction compris), Hylee peut mettre la main sur un mystérieux fragment. Ils restent cependant illisibles pour le moment. Du moins, pour le moment...
```

Fragments techniques repérés :

```text
intro
ch1
ch2
ch3
ch4v
ch4d
ch5
ch7
ch8
ch9
ch10
```

Notes :

- certaines clés techniques ne correspondent pas exactement au numéro affiché du chapitre, car les fragments ont été ajoutés par vagues ;
- `ch10` correspond à la Route Iriana du Chapitre X ;
- la Route Groupe du Chapitre X retire le fragment `ch10` si elle est choisie hors mode développeur.

---

## 9. Codex

Le Codex contient quatre onglets :

```text
Entrées
Images
Musiques
Site
```

### Organisation

Les entrées, images et musiques sont regroupées par chapitres et sections.

Groupes repérés :

- Introduction
- Chapitre I
- Chapitre II
- Chapitre III
- Chapitre IV / Routes Valurn et Draven
- Chapitre V
- Chapitre VI
- Chapitre VII
- Chapitre VIII
- Chapitre IX
- Chapitre X
- Chapitre X-G
- Général / annexes

### Images

Les images du Codex utilisent des groupes par chapitre, puis parfois par sous-scène.

Exemples de sections :

- Chapitre III : Al’Gratal, duel des Ombres, Medig, cauchemar.
- Chapitre VIII : rapport de Caldran, conseiller masqué, pacte et révélation de Naïah.
- Chapitre IX : route, Forêt Interdite, Akuhn’Nabad, capture.
- Chapitre X-I : Iriana, Amanea, cité obscurcie.
- Chapitre X-G : geôles, Bellirith, archives, palais.

### Musiques

Les musiques sont également codées comme éléments de Codex déverrouillables.

Pistes importantes repérées :

- Thème du menu
- Introduction : Auberge, Remerii, décision finale
- Chapitre III : Shopping dans la capitale, Combat des Ombres, The Unborn
- Chapitre IV : Valurn Lullaby, Infernal Trade, Bellirith, Forthaven / Draven
- Chapitre V : Mir’Aldas, duel de Saidin
- Chapitre VI : cité des mages, nuit sous les étoiles
- Chapitre VII : rencontre Naïah, duel Naïah 1, duel Naïah 2
- Chapitre VIII : Un sombre conseiller, Pacte et révélation
- Chapitre IX : départ, Forêt Interdite, capture
- Chapitre X : captivité, Akuhn’Nabad, infiltration

---

## 10. Mode développeur

Code développeur :

```text
161598
```

Fonctions du mode développeur :

- déverrouille tout le Codex ;
- ouvre tous les chapitres ;
- ignore les prérequis de valeurs ;
- ignore les prérequis internes des duels ;
- affiche les gains de valeurs sur les choix ;
- ajoute un bouton Retour pendant les chapitres ;
- permet de prévisualiser les routes du Chapitre X sans figer définitivement la route.

---

## 11. Mode facile

Le mode facile affiche des indications de lecture sur les choix.

Utilité :

- indiquer la valeur ou l’orientation narrative d’un choix ;
- mieux comprendre les effets sans passer en mode développeur ;
- conserver une expérience moins opaque sans tout dévoiler comme le mode dev.

Le mode facile est conservé en `localStorage` via :

```text
sylvinia_vn_easy_mode
```

---

## 12. Mode mobile

Le mode mobile adapte :

- l’écran titre ;
- les menus ;
- la topbar ;
- la zone de dialogue ;
- les choix ;
- le Codex ;
- la Progression ;
- les scènes avec sprites ;
- les éléments scrollables.

Objectif :

- garder le visuel visible autant que possible ;
- éviter que les choix ou dialogues longs deviennent inaccessibles ;
- rendre Codex et Progression consultables sur écran étroit.

---

## 13. Sauvegarde

Sauvegarde principale :

```text
sylvinia_vn_v82
```

Sauvegarde Introduction :

```text
sylvinia_vn_intro_v82
```

Le moteur tente encore de relire plusieurs anciennes clés de sauvegarde pour compatibilité.

Le bouton **Nouveau départ** supprime les anciennes sauvegardes listées dans le code, puis réinitialise :

- scène ;
- valeurs ;
- choix ;
- flags ;
- inventaire ;
- souvenirs ;
- fragments ;
- Codex ;
- états de duel ;
- progression.

---

## 14. Règles d’intégration à conserver

Lors d’une prochaine mise à jour de chapitre, vérifier systématiquement :

1. **Navigation**
   - bouton de transition depuis le chapitre précédent ;
   - chapitre ajouté à la sélection ;
   - verrouillage / déverrouillage correct ;
   - mode développeur compatible.

2. **Progression**
   - valeurs ;
   - inventaire ;
   - souvenirs ;
   - Regard de Remerii ;
   - Carnet du Némésis ;
   - fragments ;
   - variables de route.

3. **Codex**
   - entrées ;
   - images ;
   - musiques ;
   - groupes par chapitre ;
   - déverrouillage par scène.

4. **Assets**
   - sprites retirés pendant les CG ;
   - images clés placées au bon moment narratif ;
   - chemins non cassés ;
   - musiques branchées sur les bonnes scènes.

5. **Choix**
   - pas de doublons ;
   - pas de choix à prérequis qui ne sont que des variantes faibles ;
   - transitions naturelles vers la scène suivante ;
   - effets persistants quand le choix est important.

6. **Mobile**
   - dialogue scrollable ;
   - Codex scrollable ;
   - Progression scrollable ;
   - topbar compacte ;
   - choix lisibles.

---

## 15. Derniers correctifs importants

### v0.152
Lien Remerii rendu discret : il n’apparaît plus comme valeur de HUD principale.

### v0.153
Pré-requis doubles harmonisés : la seconde valeur vaut environ la moitié de la première.

### v0.168 à v0.177
Intégration et stabilisation du Chapitre VIII :

- sélection ajoutée ;
- accès après Chapitre VII ;
- décors ;
- images clés ;
- Codex complet ;
- musiques rangées ;
- choix et dialogues réécrits au format VN.

### v0.178 à v0.186
Intégration et polissage du Chapitre IX :

- départ vers la Forêt Interdite ;
- Naïah / Hylee ;
- Akuhn’Nabad ;
- images clés ;
- musiques ;
- Regard de Remerii clarifié ;
- OST III du Chapitre IX corrigée avec `infernal_trade.mp3`.

### v0.187
Intégration de la Route Iriana du Chapitre X : **L’Impératrice Noire**.

### v0.190 à v0.193
Réparation du choix de perspective du Chapitre X :

- choix réellement explicite ;
- route verrouillée hors mode développeur ;
- sélection visuelle corrigée ;
- carte du Chapitre X adaptée selon l’état.

### v0.194
Repositionnement des images Valurn / Obscurci dans la Route Groupe :

```text
c10g_065 → c10g_081
```

Les sprites sont retirés pendant ces images clés pour garder les CG lisibles.

### v0.195
Valeurs déplafonnées : fin de l’ancien plafond à 45.

### v0.196
Fracture Hylee / Remerii renforcée dans la Route Groupe, avec perte unique de Lien Remerii −15.

### v0.197
Ajout de choix supplémentaires dans la Route Groupe pour faire intervenir Hylee plus souvent.

### v0.198
Polissage des transitions après les choix supplémentaires du Chapitre X-G.

---

## 16. Points de vigilance connus

- Le projet est encore en bêta.
- Le HTML est très volumineux et contient beaucoup de patches successifs.
- Plusieurs systèmes historiques coexistent encore dans le fichier.
- Le prochain gros nettoyage idéal serait une séparation en modules :
  - `engine.js`
  - `scenes/`
  - `codex.js`
  - `progression.js`
  - `assets.js`
  - `styles.css`

Cette refactorisation n’est pas obligatoire pour jouer, mais elle rendrait le projet plus facile à maintenir.

---

## 17. Résumé rapide

Version actuelle du README :

```text
Bêta · HTML v0.198 · Introduction + Chapitres I à X · Chapitre X double route
```

Systèmes actifs :

```text
Sauvegarde
Sélection de chapitres
Codex groupé
Progression
Regard de Remerii
Carnet du Némésis
Inventaire
Souvenirs
Mode développeur
Mode facile
Mode mobile
Duel interactif
Choix stratégiques
Choix à prérequis
Routes définitives
```

Dernier point narratif majeur :

```text
Chapitre X : choisir entre suivre Iriana auprès d’Amanea ou rester avec le groupe dans les geôles d’Akuhn’Nabad.
```
