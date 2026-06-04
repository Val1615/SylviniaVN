# Les Chroniques de Sylvinia · Visual Novel

README technique et narratif généré après audit du fichier `SylviniaVN_progression_v085_index.html`.

Dernier fichier analysé : `SylviniaVN_progression_v085_index.html`  
Version affichée dans le menu : `v0.85.0`  
Moteur : HTML/CSS/JavaScript en fichier unique, avec assets externes dans `assets/`.

---

## 1. Objectif du projet

Le Visual Novel adapte le Tome 1 des **Chroniques de Sylvinia** en expérience interactive. Le scénario principal doit rester fidèle au roman. Les divergences doivent venir surtout de :

- choix de ton et d’attitude d’Hylee ;
- valeurs accumulées ;
- choix stratégiques verrouillés par des prérequis élevés ;
- récompenses persistantes : objets, souvenirs, flags ;
- scènes bonus ou dialogues différés.

La philosophie actuelle : le joueur ne doit pas seulement choisir une réponse immédiate. Il construit une version d’Hylee, et cette trajectoire doit ouvrir des serrures narratives plus tard.

---

## 2. Règle de livraison importante

Quand une modification ne touche que le HTML, ne fournir que le fichier `index.html` modifié. Ne pas renvoyer un ZIP complet si les assets ne changent pas.

---

## 3. Structure générale du fichier

Le projet est actuellement contenu dans un seul fichier HTML principal.

### 3.1. Grandes zones du fichier

- `<style>` : toute l’interface visuelle, y compris le menu, le codex, le mode mobile, le duel et la page Progression.
- `<body>` : écrans principaux du VN.
- `<script>` : assets, état du jeu, scènes, codex, duel, progression, sauvegarde et navigation.

### 3.2. Écrans principaux

Les écrans sont gérés par `setScreen(name)`, qui masque tout puis affiche l’écran demandé.

Écrans reconnus :

```js
['disclaimer', 'title', 'game', 'codex', 'progression']
```

IDs HTML importants :

- `disclaimer` : écran d’avertissement bêta.
- `title` : menu principal.
- `game` : écran VN.
- `codex` : grimoire/codex.
- `progression` : valeurs, inventaire, souvenirs.
- `lightbox` : affichage agrandi des images du codex.
- `music` : lecteur audio principal.

---

## 4. Menu principal

Le menu principal utilise des boutons d’action et des panneaux coulissants.

### 4.1. Bouton coulissant Aventure

Le bouton coulissant **Aventure** doit contenir :

- Introduction
- Commencer
- Reprendre
- Progression
- Chapitre I
- Chapitre II
- Chapitre III

Boutons liés :

- `introBtn` → `startIntro()`
- `startBtn` → `newGame()`
- `resumeBtn` → `resume()`
- `progressionBtn` → `openProgression()`
- `startCh1Btn` → `startChapter1()`
- `startCh2Btn` → `startChapter2()`
- `startCh3Btn` → `startChapter3()`

### 4.2. Autres entrées du menu

- `codexBtn` : ouvre le codex.
- `menuMusicBtn` : active/désactive la musique du menu.
- `devModeBtn` : active/désactive le mode développeur.
- `resetBtn` : réinitialise la progression.

---

## 5. Assets

Les assets sont centralisés dans l’objet `A`.

Nombre d’assets référencés lors de l’audit : **106**.

Types principaux :

- décors : `bg_*`
- images clés / CG : `cg_*`, `c2_*`, `duel_*`, `intro_cg_*`
- sprites : `hylee_*`, `remerii_*`, `iriana_*`, `valurn_*`, `draven_*`, `intro_hylee_*`, `intro_remerii_*`
- musiques : `music_*`, `intro_music_*`

Important : toute scène utilise les clés de `A`, pas directement les chemins. Exemple :

```js
bg: 'bg_camp_decor'
music: 'music_confessions'
chars: [['hylee', 'hylee_soft', 'left']]
```

---

## 6. État global du jeu

L’état central est l’objet `state`.

Champs principaux :

```js
state = {
  scene: 'p01',
  stats: {...START_STATS},
  introStats: {...INTRO_STATS},
  flags: {},
  inventory: [],
  memories: [],
  sceneRewards: [],
  musicOn: true,
  menuMusicOn: true,
  mobileUI: false,
  lastScreen: 'title',
  seenEnding: false,
  duel: null,
  duelResult: null,
  duelIntroPlayed: false,
  duelIntroPending: false,
  devMode: false,
  history: [],
  codexTab: 'entries',
  codexUnlocked: ['hylee', 'remerii'],
  codexUnlockedImages: [],
  codexUnlockedMusic: ['music_menu']
}
```

### 6.1. Valeurs principales de l’aventure

```js
const START_STATS = {
  audace: 0,
  sangfroid: 0,
  lien: 0,
  lucidite: 0,
  resonance: 0
};
```

Noms affichés :

```js
const statNames = {
  audace: 'Audace',
  sangfroid: 'Sang-froid',
  lien: 'Lien Remerii',
  lucidite: 'Lucidité',
  resonance: 'Résonance'
};
```

### 6.2. Valeurs séparées pour l’Introduction

L’Introduction possède ses propres valeurs :

```js
const INTRO_STATS = {
  courage: 0,
  discretion: 0,
  trust: 0,
  suspicion: 0,
  instability: 0,
  hope: 0
};
```

Ces valeurs sont plafonnées à `INTRO_VALUE_MAX = 5`.

Point crucial : les scènes dont l’ID commence par `intro_` utilisent `introStats`, pas `stats`.

---

## 7. Système de sauvegarde

La sauvegarde principale utilise actuellement :

```js
localStorage.setItem('sylvinia_vn_v82', JSON.stringify(state));
```

La sauvegarde de l’introduction utilise :

```js
localStorage.setItem('sylvinia_vn_intro_v82', JSON.stringify({ scene, introStats }));
```

Le fichier affiche pourtant `v0.85.0`. C’est une dette technique : la version visuelle et la clé de sauvegarde ne sont pas alignées.

### 7.1. Recommandation

Créer des constantes :

```js
const SAVE_KEY = 'sylvinia_vn_v85';
const INTRO_SAVE_KEY = 'sylvinia_vn_intro_v85';
const DISCLAIMER_KEY = 'sylvinia_disclaimer_seen_v85';
```

Puis remplacer les occurrences directes de `v82`. Cela évite la brume des anciennes versions dans le localStorage.

---

## 8. Système de scènes

Les scènes sont stockées dans l’objet `S`.

Audit après correction temporaire du bloc Medig : **230 scènes**.

Répartition :

| Bloc | Nombre de scènes |
|---|---:|
| Chapitre I | 52 |
| Duel | 2 scènes passerelles + système `DUEL_STEPS` |
| Fin Chapitre I | 1 |
| Chapitre II | 78 |
| Chapitre III | 97 |

Le moteur principal est :

```js
render()
choose(ch)
go(next)
```

### 8.1. Schéma d’une scène

Une scène peut contenir :

```js
sceneId: {
  title: 'Titre affiché',
  sub: 'Sous-titre affiché',
  bg: 'cle_asset_background',
  music: 'cle_asset_music',
  speaker: 'Nom du locuteur',
  text: 'Texte affiché',
  chars: [
    ['hylee', 'hylee_soft', 'left'],
    ['remerii', 'remerii_sad', 'right']
  ],
  choices: [...],
  next: 'scene_suivante',
  zoom: true,
  hideChars: true,
  clearChars: true,
  combat: true,
  ending: true,
  duelResult: true,
  items: [...],
  memories: [...]
}
```

### 8.2. Rendu du texte

Dans les scènes principales, le texte est rendu avec :

```js
textEl.textContent = sceneText;
```

Dans l’Introduction, le texte est rendu avec :

```js
textEl.innerHTML = sceneText;
```

Conséquence : dans les chapitres principaux, les balises HTML écrites dans `text` ne seront pas interprétées. Il faut utiliser du texte brut, ou changer la logique si on veut du HTML dans l’aventure principale.

---

## 9. Système de choix

La fonction helper :

```js
function c(label, next, effects = {}, note = '', flags = {}) {
  return { label, next, effects, note, flags };
}
```

Mais les choix peuvent aussi contenir manuellement :

```js
requires: { lucidite: 12, lien: 10, resonance: 7 },
items: ['plume_medig'],
memories: ['medig_serment'],
introEffects: {...},
skipHistory: true
```

### 9.1. Effets de choix

Pour les scènes principales :

```js
if (ch.effects) {
  for (const [k, v] of Object.entries(ch.effects)) {
    state.stats[k] = (state.stats[k] || 0) + v;
  }
}
```

Pour l’Introduction :

```js
if (ch.introEffects || isIntroScene()) {
  state.introStats[k] = clamp(...);
}
```

Attention : dans une scène `intro_`, un choix avec `effects` mais sans `introEffects` n’ajoutera rien, car `applyChoiceEffects()` ne lit que `introEffects` pour l’intro.

### 9.2. Choix verrouillés

Un choix avec `requires` est affiché verrouillé si les valeurs ne sont pas suffisantes.

Fonctions :

```js
choiceAvailable(ch)
statReqText(req)
choiceNote(ch)
```

Le bouton affiche :

```txt
🔒 Choix stratégique...
Requis : Lucidité 8/12 · Lien Remerii 7/10
```

---

## 10. Structure narrative actuelle

### 10.1. Introduction

Préfixe : `intro_`

L’Introduction est indépendante de l’aventure principale. Elle se déroule deux ans avant le Chapitre I et possède ses propres sprites, CG, musiques et valeurs.

La fonction `resume()` empêche actuellement de reprendre directement une scène d’introduction : si `state.scene` commence par `intro_`, elle renvoie vers `p01`.

### 10.2. Chapitre I

Préfixes : `p*`, `s*`, puis `duel`.

Contenu principal : entraînement de Hylee par Remerii, arrivée d’Iriana, convocation aux Catacombes du Croissant.

Scène de duel : `duel` puis `duel_after`.

Fin : `ending`, qui marque :

```js
state.seenEnding = true;
state.flags.chapter1Complete = true;
```

### 10.3. Chapitre II

Préfixe : `c2_`

Contenu principal : route vers Al’Gratal, forêt vivante, gardien, entrée dans la capitale, catacombes, rencontre avec Draven, Valurn et Iriana, plan vers les Obscurcis et Mir’Aldas.

La scène `c2_45` marque la fin du chapitre :

```js
state.flags.chapter2Complete = true;
```

### 10.4. Chapitre III

Préfixe : `c3_`

Titre : **Préparatif pour une nouvelle aventure**.

Contenu adapté :

- dernier jour à Al’Gratal ;
- boutique enchantée ;
- robe bleue ;
- Atelier Arcanique ;
- bâton en cerisier noir ;
- grimoires et parchemins ;
- évocation de l’Arcatraz ;
- départ d’Al’Gratal ;
- test brutal de Remerii ;
- Glacialis Absoluta ;
- mèche blanche et traces physiques ;
- Medig ;
- confession de Remerii ;
- cauchemar du petit frère ;
- demande de protection nocturne ;
- fragment du vieux journal ;
- fin vers Mir’Aldas.

La scène `c3_55` marque :

```js
state.flags.chapter3Complete = true;
```

---

## 11. Déverrouillage des chapitres

### 11.1. Chapitre II

Déverrouillé si :

- mode développeur actif ;
- `chapter1Complete` ;
- `seenEnding` ;
- scène actuelle ou sauvegardée en `c2_` ou `c3_` ;
- scène de fin du Chapitre I.

Fonctions :

```js
chapter1CompletedFrom(saveObj)
canStartChapter2()
```

### 11.2. Chapitre III

Déverrouillé si :

- mode développeur actif ;
- `chapter2Complete` ;
- scène `c2_45` ;
- scène actuelle ou sauvegardée en `c3_`.

Fonctions :

```js
chapter2CompletedFrom(saveObj)
canStartChapter3()
```

---

## 12. Mode développeur

Fonction :

```js
toggleDevMode()
```

Effets actuels :

- active `state.devMode` ;
- marque `chapter1Complete: true` ;
- met `seenEnding: true` ;
- déverrouille tout le codex ;
- affiche le bouton retour `devBackBtn` si un historique existe ;
- permet de démarrer les chapitres II et III grâce aux `canStartChapterX()`.

Le mode développeur ne donne pas automatiquement toutes les valeurs, ni les objets, ni les souvenirs. C’est plutôt un passe de navigation et de codex.

---

## 13. Système de duel

Le duel n’est pas géré comme une scène classique. Il utilise :

```js
DUEL_STEPS
state.duel
initDuel()
renderDuel(scene)
duelOutcome()
```

### 13.1. État du duel

```js
state.duel = {
  step: 0,
  waiting: false,
  last: null,
  stability: 6,
  fatigue: 1,
  read: 0,
  audace: 0,
  sangfroid: 0,
  resonance: 0,
  lien: 0,
  lucidite: 0,
  warnings: 0,
  history: []
};
```

### 13.2. Les 5 manches

| Manche | Titre | Nombre de choix |
|---|---|---:|
| 1 | Le cristal brisé | 4 |
| 2 | Le tempo imposé | 4 |
| 3 | Fragments en orbite | 4 |
| 4 | La glace répond trop vite | 4 |
| 5 | Ce que tu dois retenir | 4 |

Chaque choix modifie les valeurs globales et les métriques internes du duel.

### 13.3. Résultats possibles

Priorité des issues dans `duelOutcome()` :

1. **Interruption de Remerii** : trop d’avertissements ou stabilité trop basse.
2. **Éclat incontrôlé** : Résonance trop volatile.
3. **Résonance** : magie d’Hylee accordée, stable et personnelle.
4. **Leçon assimilée** : lecture de Remerii et compréhension du duel.
5. **Maîtrise froide** : contrôle élevé et stabilité forte.
6. **Audace dangereuse** : instinct offensif prometteur mais risqué.
7. **Progression fragile** : issue par défaut.

---

## 14. Codex

Le codex est divisé en onglets :

- Entrées
- Images
- Musiques
- Encyclopédie

Constantes principales :

```js
CODEX_ENTRIES
CODEX_ORDER
CODEX_BY_SCENE
CODEX_IMAGES
CODEX_IMAGE_ORDER
CODEX_IMAGE_GROUPS
CODEX_IMAGES_BY_SCENE
CODEX_MUSIC
CODEX_MUSIC_ORDER
CODEX_MUSIC_BY_SCENE
```

Fonctions importantes :

```js
ensureCodexDefaults()
checkCodexForScene(id)
unlockList(...)
unlockCodexImageKey(key)
renderCodex()
```

À chaque rendu de scène, `checkCodexForScene(state.scene)` peut déverrouiller :

- entrées de lore ;
- images ;
- musiques.

---

## 15. Page Progression

La page `progression` a été ajoutée pour servir de journal mécanique et narratif.

Elle affiche :

- valeurs actuelles ;
- inventaire d’Hylee ;
- souvenirs marquants ;
- chapitre/scène actuelle.

Fonctions :

```js
ensureProgressDefaults()
unlockProgressItems(keys)
unlockProgressMemories(keys)
applySceneProgressRewards(sceneId, scene)
progressTier(key, value)
renderProgression()
openProgression()
backFromProgression()
```

### 15.1. Inventaire

Défini par :

```js
PROGRESSION_ITEMS
```

Objets actuels :

| Clé | Titre | Type |
|---|---|---|
| `jeton_imperial` | Jeton impérial | Autorisation |
| `baton_cerisier_noir` | Bâton en cerisier noir | Catalyseur |
| `grimoire_sombre` | Grimoire sombre et parchemins renforcés | Matériel d’étude |
| `plume_medig` | Plume blanche de Medig | Lien spirituel |

### 15.2. Souvenirs

Définis par :

```js
PROGRESSION_MEMORIES
```

Souvenirs actuels :

| Clé | Titre | Personnage |
|---|---|---|
| `medig_serment` | Medig se souviendra de cette confiance | Medig |
| `remerii_medig_respect` | Remerii se souviendra de ce moment | Remerii |

### 15.3. Récompenses automatiques par scène

Définies par :

```js
SCENE_PROGRESS_REWARDS
```

Actuellement :

```js
s16: { items: ['jeton_imperial'] },
c3_12: { items: ['baton_cerisier_noir'] },
c3_16: { items: ['grimoire_sombre'] }
```

Les récompenses de scène sont protégées par `state.sceneRewards`, afin d’éviter qu’un retour ou rechargement redonne plusieurs fois le même objet.

---

## 16. Choix stratégiques

Les choix stratégiques doivent devenir des récompenses de parcours, pas de simples variations de texte.

### 16.1. Échelle recommandée au Chapitre III

Les maxima estimés à l’entrée du Chapitre III sont environ :

| Valeur | Maximum possible approximatif |
|---|---:|
| Audace | 19 |
| Sang-froid | 23 |
| Lien Remerii | 22 |
| Lucidité | 25 |
| Résonance | 14 |

Donc les prérequis de Chapitre III doivent être exigeants :

| Type | Seuil recommandé |
|---|---:|
| Choix stratégique standard | 10 à 15 |
| Choix rare | 16+ |
| Résonance standard | 7 à 9 |
| Résonance rare | 10 à 14 |

### 16.2. Règle de récompense

Un choix stratégique doit donner au moins une récompense durable :

- objet dans l’inventaire ;
- souvenir visible dans Progression ;
- flag narratif invisible ;
- dialogue futur ;
- scène bonus ;
- résolution améliorée d’une scène future.

### 16.3. Exemple validé : Le serment de Medig

Scène : `c3_30`

Choix :

```txt
Choix stratégique : prendre la présence de Medig au sérieux
```

Pré-requis :

```js
requires: {
  lucidite: 12,
  lien: 10,
  resonance: 7
}
```

Récompenses :

```js
items: ['plume_medig'],
memories: ['medig_serment', 'remerii_medig_respect'],
flags: {
  medigSerment: true,
  remeriiSeSouviendraMedig: true
}
```

Conséquence future prévue : lorsque Medig ouvre une brèche vers Al’Gratal, la Plume blanche de Medig peut stabiliser le passage quelques secondes, réduire la perte d’énergie d’Hylee et ouvrir un dialogue bonus avec Remerii.

---

## 17. Chapitre III : choix stratégiques actuels à rééquilibrer

À l’audit, plusieurs choix marqués “stratégiques” ont encore des prérequis trop faibles pour le Chapitre III. Ils doivent être relevés vers l’échelle 10-15.

Exemples actuels trop faciles :

| Scène | Choix | Requis actuel | Recommandation |
|---|---|---:|---:|
| `c3_04` | Montrer ton jeton impérial | Sang-froid 2 + Lucidité 1 | Sang-froid 10 + Lucidité 8 |
| `c3_04` | Répondre au nom de Mir’Aldas | Audace 2 | Audace 10 + Résonance 5 |
| `c3_10` | Lire les runes des supports | Lucidité 3 | Lucidité 12 + Résonance 6 |
| `c3_10` | Canaliser sans forcer | Résonance 2 + Sang-froid 2 | Résonance 7 + Sang-froid 10 |
| `c3_14` | Présenter toi-même l’approbation | Sang-froid 3 + Lucidité 2 | Sang-froid 11 + Lucidité 9 |
| `c3_16` | Mesurer le risque de l’Arcatraz | Sang-froid 3 | Sang-froid 12 + Lucidité 8 |
| `c3_19` | Chercher une trace magique | Lucidité 3 | Lucidité 11 + Résonance 6 |
| `c3_22` | Respirer avant d’élargir le sort | Sang-froid 4 | Sang-froid 13 + Résonance 7 |
| `c3_22` | Lire la faille des ombres | Lucidité 5 | Lucidité 14 + Sang-froid 10 |
| `c3_22` | Prendre Remerii comme ancrage mental | Lien 5 | Lien 13 + Sang-froid 9 |
| `c3_32` | Relier son histoire à ton abandon | Lien 4 + Lucidité 3 | Lien 12 + Lucidité 10 |
| `c3_35` | Admettre que tu avais besoin d’être sauvée | Lien 5 | Lien 14 + Sang-froid 8 |
| `c3_40` | Reconnaître une trace ancienne | Lucidité 5 + Sang-froid 4 | Lucidité 13 + Sang-froid 11 |
| `c3_43` | Respirer avec elle | Sang-froid 5 + Lien 3 | Sang-froid 13 + Lien 10 |
| `c3_45` | Demander son aide sans détour | Lien 5 + Lucidité 3 | Lien 12 + Lucidité 10 |
| `c3_47` | Lui demander si elle a déjà eu peur d’elle-même | Lien 4 | Lien 14 + Lucidité 10 |
| `c3_49` | Demander directement, sans t’excuser | Lien 5 | Lien 13 + Sang-froid 9 |

Le choix Medig est déjà bien calibré : Lucidité 12 + Lien 10 + Résonance 7.

---

## 18. Comment ajouter un nouvel objet de progression

1. Ajouter l’objet dans `PROGRESSION_ITEMS` :

```js
const PROGRESSION_ITEMS = {
  ...,
  nouvelle_cle: {
    title: 'Nom affiché',
    type: 'Type',
    icon: '✦',
    body: `Description de l’objet et de son usage futur.`
  }
};
```

2. Le donner via un choix :

```js
items: ['nouvelle_cle']
```

ou automatiquement via une scène :

```js
SCENE_PROGRESS_REWARDS = {
  ...,
  c4_12: { items: ['nouvelle_cle'] }
};
```

3. Le réutiliser plus tard :

```js
if (state.inventory.includes('nouvelle_cle')) {
  // ouvrir dialogue/scène/choix bonus
}
```

---

## 19. Comment ajouter un souvenir de personnage

1. Ajouter le souvenir :

```js
const PROGRESSION_MEMORIES = {
  ...,
  remerii_scene_x: {
    title: 'Remerii se souviendra de ce moment',
    type: 'Remerii',
    icon: '❄',
    body: `Description de ce qui a marqué Remerii.`
  }
};
```

2. Le donner via un choix :

```js
memories: ['remerii_scene_x']
```

3. Ajouter un flag lisible :

```js
flags: {
  remeriiSeSouviendraSceneX: true
}
```

4. Plus tard, tester :

```js
if (state.memories.includes('remerii_scene_x')) {
  // variante de dialogue
}
```

---

## 20. Comment ajouter une scène

1. Choisir un ID cohérent :

- `intro_...` pour l’introduction ;
- `c2_...` pour le chapitre II ;
- `c3_...` pour le chapitre III ;
- `c4_...` pour le futur chapitre IV.

2. Ajouter la scène dans `S` :

```js
c4_01: {
  title: 'Chapitre IV',
  sub: 'Titre du passage',
  bg: 'bg_x',
  music: 'music_x',
  speaker: 'Narrateur',
  text: `Texte de la scène.`,
  chars: [['hylee', 'hylee_thinking', 'left']],
  next: 'c4_02'
}
```

3. Vérifier que la scène précédente pointe vers elle :

```js
next: 'c4_01'
```

4. Pour un choix :

```js
choices: [
  c('Réponse normale', 'c4_02', { sangfroid: 1 }, 'Note affichée.'),
  {
    label: 'Choix stratégique : ...',
    next: 'c4_bonus',
    effects: { lucidite: 1 },
    note: 'Récompense de parcours.',
    requires: { lucidite: 14, lien: 10 },
    memories: ['remerii_scene_x'],
    flags: { remeriiSeSouviendraSceneX: true }
  }
]
```

---

## 21. Points d’attention et bugs connus

### 21.1. Bug critique dans `c3_30_serment`

Dans le fichier `v0.85`, la scène `c3_30_serment` contient un champ :

```js
"text": "Hylee cesse de sourire...
...
[Remerii se souviendra de ce moment.]",
```

Le texte est écrit entre guillemets doubles mais contient des retours ligne bruts. En JavaScript, c’est une erreur de syntaxe. Le jeu risque de ne pas se lancer.

Correction recommandée : transformer en template literal :

```js
text: `Hylee cesse de sourire.

Elle garde Medig contre elle...

[Objet obtenu : Plume blanche de Medig]
[Medig se souviendra de cette confiance.]
[Remerii se souviendra de ce moment.]`,
```

ou remplacer les retours ligne par `\n\n`.

### 21.2. Clés de sauvegarde encore en `v82`

Le menu affiche `v0.85.0`, mais les clés localStorage restent en `v82`. Cela fonctionne, mais ce n’est pas propre pour la maintenance.

À corriger avec des constantes `SAVE_KEY`, `INTRO_SAVE_KEY`, `DISCLAIMER_KEY`.

### 21.3. Scène legacy `s08` probablement morte

La scène `s07` envoie vers `duel`. Une ancienne scène `s08` existe encore avec trois choix : esquive, barrière, contre-attaque. Elle semble ne plus être atteinte dans le flux normal.

Décision possible :

- supprimer `s08` et ses sous-scènes ;
- ou la garder comme fallback de test ;
- ou la reconnecter ailleurs si souhaité.

### 21.4. `render()` modifie parfois les scènes

Dans `render()` :

```js
if (scene.ending) scene.text = endingText();
if (scene.duelResult) scene.text = duelResultText();
```

Cela modifie l’objet scène directement. Ce n’est pas dangereux ici, mais à long terme il vaut mieux éviter de muter les scènes sources.

Préférer :

```js
const sceneText = scene.ending ? endingText() : scene.duelResult ? duelResultText() : scene.text;
```

### 21.5. `textContent` bloque le HTML dans l’aventure principale

Si une scène principale contient `<strong>`, `<br>`, etc., les balises seront affichées comme texte. C’est normal avec `textContent`.

### 21.6. Reset incomplet si la clé de sauvegarde évolue

`resetProgress()` supprime une liste d’anciennes versions jusqu’à `v82`. Si on passe à `v85`, il faudra ajouter la nouvelle clé ou utiliser une constante.

---

## 22. Checklist avant de livrer une nouvelle version

### 22.1. Syntaxe

- Vérifier qu’aucun champ `text: "..."` ne contient de retours ligne bruts.
- Préférer les backticks pour les textes longs.
- Vérifier les virgules entre scènes.
- Vérifier que chaque `next` pointe vers une scène existante ou vers `menu`.

### 22.2. Sauvegarde

- Tester une nouvelle partie.
- Tester reprendre.
- Tester Introduction puis retour menu.
- Tester Chapitre II verrouillé/déverrouillé.
- Tester Chapitre III verrouillé/déverrouillé.
- Tester mode développeur.

### 22.3. Progression

- Vérifier que les valeurs s’affichent.
- Vérifier que les objets apparaissent une seule fois.
- Vérifier que les souvenirs apparaissent une seule fois.
- Vérifier que la page Progression revient au bon écran.

### 22.4. Mobile

- Tester le disclaimer.
- Tester les choix longs.
- Tester le codex scrollable.
- Tester la page Progression.
- Tester les boutons de la barre supérieure.

### 22.5. Narration

- Vérifier fidélité au Tome 1.
- Réduire les choix stratégiques faibles.
- Conserver les écarts pour les choix, dialogues bonus et conséquences différées.
- Noter chaque objet/souvenir dans Progression.

---

## 23. Priorités recommandées pour la prochaine passe

1. Corriger le bug de syntaxe de `c3_30_serment`.
2. Relever tous les prérequis stratégiques du Chapitre III vers 10-15, avec échelle séparée pour Résonance.
3. Transformer les choix stratégiques faibles en choix normaux ou leur donner une vraie récompense persistante.
4. Ajouter des objets/souvenirs pour 3 à 5 choix stratégiques majeurs du Chapitre III.
5. Préparer les hooks du Chapitre IV pour payer les récompenses : Medig, bâton, grimoire, relation Remerii.
6. Remplacer les clés `v82` par des constantes de sauvegarde.
7. Nettoyer la scène legacy `s08`.

---

## 24. Résumé ultracourt pour reprise future

Le VN est un moteur HTML/CSS/JS en fichier unique. Les scènes sont dans `S`, les assets dans `A`, les valeurs dans `state.stats`, l’introduction utilise `state.introStats`. Les chapitres sont séparés par préfixe : `intro_`, `c2_`, `c3_`. La page Progression affiche valeurs, inventaire et souvenirs via `PROGRESSION_ITEMS`, `PROGRESSION_MEMORIES` et `SCENE_PROGRESS_REWARDS`. Les choix stratégiques doivent demander 10-15 dans les valeurs classiques, et environ 7-9 en Résonance. Le modèle validé est le serment de Medig : Lucidité 12 + Lien Remerii 10 + Résonance 7, donne la Plume blanche de Medig et deux souvenirs. Bug critique actuel : `c3_30_serment` contient un texte multiligne entre guillemets doubles, à convertir en backticks.
