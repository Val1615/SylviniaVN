# Sylvinia Studio : architecture et points d'intégration

## Ce que l'audit du Mode Histoire a montré

1. **Chapitres et scènes.** Tout le récit est un unique objet `S` déclaré dans le grand script de `index.html` (`const S={ p01:{…}, s01:{…}, c2_01:{…} }`), enrichi ensuite par environ 150 scripts correctifs (`Object.assign(S, …)`, réécritures ciblées) et par `fusion/`. Au chargement, `S` contient 3 252 entrées. Une entrée de `S` correspond à **une réplique** (un écran de texte). Il n'existe pas d'objet « chapitre » : le chapitre se déduit du préfixe de l'identifiant (`intro_`, `s`/`p` pour le chapitre I, `c2_`, `c4v_`, `c10g_`, `c12i_`, `x12i_`…) et son titre vient de `getSceneChapterLabel()`. Le Studio appelle « scène » une suite de répliques qui portent le même `title`.
2. **Dialogues.** Chaque entrée porte `speaker`, `text` (parfois une fonction : textes calculés, échos des temps libres via `__storyWorldOriginalTextV2`), `direction` (indication en italique), `title`, `sub`.
3. **Choix et conséquences.** `choices:[{label, next, effects, note, flags, requires, requiresFlags, requiresAnyFlags, items, memories, …}]`. `choose()` applique `effects` (statistiques internes `audace`, `sangfroid`, `lien` = Regard de Remerii, `lucidite`, `resonance`), pose `flags`, débloque objets et souvenirs. `choiceAvailable()` (enrichie par deux correctifs) vérifie `requires` (≥, ET), `requiresFlags` (égalité exacte, ET) et `requiresAnyFlags` (OU). Il n'y a pas de « NON » natif pour les choix.
4. **Liens entre scènes.** `next` (suite unique) ou `choices[].next`. `go()` est enveloppée par `fusion/story-world.js` : une destination `story_world_*` ouvre un temps libre. Certaines entrées sont lancées par le code (début de chapitre `startChapterN()`, sorties de duel, `restart_c7`, `menu`).
5. **Décors et sprites.** `bg` et `music` sont des clés de l'objet `A` (978 ressources). `chars:[[personnage, clé_sprite, 'left'|'center'|'right', classes]]` où les classes `back`, `dim`, `projection` modifient l'affichage ; l'expression fait partie de la clé du sprite (`hylee_thinking`). Des correctifs remplacent certains sprites à l'affichage (tenues de fête, Hylee après Glacialis). L'interface « Bibliothèque astrale » relit le DOM du moteur après chaque `render()`.
6. **Sauvegardes.** `save()` écrit tout `state` dans `localStorage.sylvinia_vn_v82` à chaque rendu (intro : `sylvinia_vn_intro_v82`) ; la Bibliothèque astrale garde journal et signets dans `sylvinia_biblio_astrale_v2`. Une sauvegarde ne contient que l'identifiant de la réplique courante et l'historique : garder les identifiants stables suffit à préserver les sauvegardes.
7. **Duels, QTE, événements.** Déclenchés par des champs de l'entrée lus dans `render()` : `combat`, `c3ShadowCombat`, `c5SageDuel`, `c7NaiahDuel`, `c7PacteEval`, `x12iDuel`, `keySlides`, `bgCycle`, `ending`, `duelResult`, plus des drapeaux posés en dur (fin de chapitre, journal).

## Ce que le Studio ajoute (sans réécrire le moteur)

| Fichier | Rôle |
|---|---|
| `studio/runtime/sandbox.js` | Chargé en tête d'`index.html`. Inactif en jeu normal. Avec `?studio=preview` ou `?studio=extract`, toutes les écritures `localStorage` restent en mémoire et les clés de sauvegarde du joueur sont masquées : l'aperçu ne peut ni lire ni écraser une vraie partie. |
| `studio/runtime/schema.js` | Format des modifications, partagé par le jeu et le Studio : champs modifiables, validation, conditions de visibilité. |
| `studio/data/modifications.js` | **La source commune.** Pour chaque identifiant de réplique, uniquement les champs modifiés. Vide par défaut. |
| `studio/runtime/runtime.js` | Chargé en dernier. Applique `modifications.js` par-dessus `S` (en mémorisant les valeurs d'origine), revérifie la réplique courante juste avant chaque `render()` pour couvrir les correctifs tardifs, gère la condition de visibilité (`studioIf`) et l'effet sonore (`sfx`). En aperçu, applique le brouillon reçu du Studio et prépare l'état de test. En extraction, expose les scènes d'origine. |
| `studio/index.html`, `studio/js/*`, `studio/css/*` | L'éditeur, en JavaScript sans compilation (rien à construire avant publication). |

Chaîne complète : **édition → brouillon IndexedDB → validation → `modifications.js` (export ou demande de fusion GitHub) → le jeu lit le fichier au démarrage.** Le Studio lit lui-même les chapitres dans le jeu (iframe d'extraction) : il n'existe pas de seconde copie des dialogues.

Retour arrière : vider `modifications.js` (ou retirer ses trois balises d'`index.html`) rend le jeu d'origine à l'identique.

## Migration progressive

Les chapitres restent dans `index.html`. Le Studio n'en convertit aucun : il superpose des différences. Si un jour l'auteur veut sortir un chapitre d'`index.html`, il suffira de « figer » ses modifications dans le code source, chapitre par chapitre, puis de vider les entrées correspondantes du fichier.

## Limites connues de cette première version

- Les temps libres (`fusion/story-*.js`) et les textes calculés par fonction sont lisibles et préservés mais pas encore modifiables. La Chronique Alternative a son propre espace (voir plus bas).
- Position des personnages : uniquement les emplacements du moteur (gauche, centre, droite, arrière plan) ; pas de coordonnées libres, pour ne pas déformer les sprites ni contourner la mise en page de la Bibliothèque astrale.
- Les duels et QTE sont des blocs conservés tels quels ; seul le rythme des décors en cycle (`bgCycleMs`) est réglable.
- Le titre des chapitres d'origine vient du moteur ; seuls les chapitres créés dans le Studio se renomment.
- Une réplique sans lien entrant peut être lancée par le code (début de chapitre, sortie de duel) : le Studio la signale sans la considérer comme une erreur.

## Espace Chroniques Alternatives

La Chronique Alternative (CA) est une application React construite par Vite (`chronique-alternative/source`). Ses contenus sont des modules TypeScript (146 fichiers `src/*.ts`). Le Studio ne réécrit ni ces fichiers ni le moteur : il superpose des différences, comme pour le Mode Histoire, avec des données et des sauvegardes séparées.

| Fichier | Rôle |
|---|---|
| `chronique-alternative/source/scripts/studio-ca-strings.mjs` | Module Vite `sylvinia-studio-ca`. À la construction, lit chaque module de contenu avec le compilateur TypeScript et entoure, sans rien changer d'autre : les textes en prose (`__caT`), les textes à parties calculées (`__caTag`, repères `{1}`, `{2}`), les seuils et effets (`__caN` : `affection`, `trust`, `desire`, `confluence`, `coins`, statistiques, `minX`, `maxX`, `unlockStage`, `requires.value`, y compris passés en argument comme `secret(id, titre, palier, minTrust, ...)`) et les listes de contenu (`__caArr`). Les identifiants, drapeaux, clés, comparaisons et textes servant de clé ailleurs dans le code ne sont jamais touchés. |
| `studio/data/ca/*.json` | Catalogue produit à chaque construction : pour chaque module, ses scènes, ses textes, ses nombres et ses listes, avec un identifiant stable (`module:sHASH`, `module:nHASH`, `module:aHASH`). |
| `studio/data/modifications-ca.js` | **La source commune de la CA.** `entries` (identifiant vers texte ou nombre) et `lists` (éléments ajoutés et éléments masqués par liste). Vide par défaut. Lu par `chronique-alternative/index.html` avant le jeu. |
| `studio/runtime/ca-boot.js` | En aperçu, remplace le fichier publié par le brouillon, ouvre la partie de test, entoure d'or les textes modifiés affichés et le signale au Studio. En extraction, renvoie au Studio le contenu réel des listes (pour copier un élément existant). |
| `studio/runtime/sandbox.js` | Même bac à sable que pour le Mode Histoire, étendu aux clés de sauvegarde de la CA (`sylvinia-liens-autosave`, emplacements, préférences). La partie de test vit en mémoire. |
| `studio/ca.html`, `studio/js/ca/*` | L'éditeur CA : catalogue en 18 catégories, écriture, contrôles, aperçu, versions et publication. |

Fonctionnement : si un identifiant figure dans `entries`, le jeu affiche la valeur publiée ; sinon le texte d'origine. Les ajouts sont insérés dans la liste réelle que le jeu parcourt (moments, confidences, connaissances, activités, rendez-vous, scènes croisées, lettres, choix, répliques), donc ils obéissent aux mêmes conditions que le contenu d'origine. Les éléments de premier niveau d'une collection ne se masquent pas (le code peut les chercher par identifiant) ; seuls les éléments de listes internes (répliques, choix) peuvent être masqués.

Un identifiant de texte dépend du texte d'origine : si le code source change ce texte, l'ancienne modification devient orpheline. Le Studio la signale dans Contrôles et le jeu l'ignore sans erreur.

Retour arrière : remettre `modifications-ca.js` dans son état vide (`"entries": {}` et `"lists": {}`).

Limites :
- Le code d'interface de `page.tsx` (libellés du lieu, menus) et les machines à états écrites en dur (étapes de quêtes croisées avec points de contrôle codés) ne sont pas modifiables ; leurs textes de contenu, seuils et effets le sont quand ils viennent des modules.
- Modules exclus : `chatgpt-auth`, `sprite-system`, `intimate-sprite-system`, `music-data`, `intimate-cg` (techniques).
- Une valeur calculée par une fonction dans un élément copié n'est pas reprise dans la copie (le Studio le signale).
- Le fichier publié est mis en cache par le navigateur quelques minutes après un déploiement.
- Le paquet du jeu passe de 5,15 Mo à 6,68 Mo (1,57 à 1,99 Mo compressé) à cause des enveloppes.
