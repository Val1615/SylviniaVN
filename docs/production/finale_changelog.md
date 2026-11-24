# Journal · Final du Tome I

## v0.420 (branche `feat/finale-mise-en-scene`)

- Mise en scène du Chapitre XVII : 72 plans clés fournis par l’auteur (S02 à S04), copiés à l’identique dans `assets/images/keyscenes/chapter17-s02/03/04/`, branchés au paragraphe qu’ils illustrent, avec mouvement de caméra, cadrage portrait et entrée au Codex. Huit plans livrés restent écartés (s02_02, s02_24, s04_06, s04_11, s04_12, s04_14, s04_16, s04_18).
- Hylee dans sa forme finale : cinq sprites (`assets/sprites/hylee_finale_*.png`) à partir de `c18_remerii_tombe`, Épilogue compris.
- Tia adulte et Allenna : sprites de la Chronique Alternative, référencés tels quels.
- Musiques dédiées : « Amanea, Final destination » (bascule du duel S04 → fin du Chapitre XVII) et « Ensemble » (combat contre Bhaal), copiées à l’identique dans `assets/audio/finale/`.
- Nouveau fichier `fusion/story-finale-media.js` (musiques, sprites, échelle) ; `story-finale-s01.js` expose le cadrage des plans clés aux chapitres suivants.
- Correctif : ligne vide rétablie avant « Valurn succombe avant de forcer Amanea à se révéler. » (`c17_gameover_a`).
- Bulle de mise à jour : « v0.420 · Mise en scène du final ».

## v0.419 (branche `feat/finale-duels-branches`)

- Mise en conformité avec le cahier de production : le carrefour du Chapitre XVIII ouvre trois branches séparées (S06 Draven, S07 Iriana, S08 Remerii / Hylee / Bhaal) avec cartons « Pendant ce temps… » / « Au même moment… ». S06 et S07 reviennent directement à S08.
- Quatre vrais duels (S04, S06, S07, S08) : jauges nommées, voile de combat natif, secousses et sons, QTE sur les pivots majeurs.
- Game Over réels en fin de duel, avec « Réessayer le duel » qui relance la scène de départ du duel en cours (pas le début du chapitre) en ne remettant à zéro que l’état du duel.
- Relecture du Chapitre XVIII depuis le menu des chapitres : retour au carrefour, « (déjà jouée) », vraie partie restaurée à la fin.
- En-tête de choix dynamique (« Le choix de Valurn / Draven / d’Iriana / d’Hylee ») via `adapter.js` v51.
- Nouveau fichier `fusion/story-finale-duels.js` (généré depuis `tools/finale-gen/duels.js`).
- Bulle de mise à jour : « v0.419 · Fin du Tome I ».

## v0.418 (branche `content/finale-suite`)

- Ajout du Chapitre XVII « La Porte Noire » (S02 à S05), du Chapitre XVIII « Début de la fin » (S06 à S08) et de l’Épilogue du Tome I (S09) : 178 scènes.
- `c16_s01_fin` : « À suivre : Chapitre XVII · La Porte Noire. », avec un bouton **Continuer**.
- Cartes de chapitre `ch17`, `ch18` et `ch19` dans le menu Chapitres.
- Duel jouable Valurn contre Amanea : jauges en texte, défaite obligatoire.
- Carrefour avec points de vue optionnels Draven et Iriana, débloqués par les routes précédentes.
- Bulle de mise à jour : « v0.418 · Fin du Tome I ».
- Documentation : `finale-suite.md`, `finale_concordance_roman_vn.md`, `finale_flags_audit.md`, `finale_assets_manifest.json`, `finale_divergences.md`.
- Scène 5 validée par l’auteur : révélation découpée en `c17_dernier_souffle` (sans silhouette) puis `c17_naiah_revelee` (silhouette de Naïah au moment où elle est nommée).
- Décors fournis par l’auteur branchés à l’identique : Porte Noire (`BG_PORTE`), blizzard (`BG_GIVRE`), champ de bataille (`BG_CHAMP`), ravin de Draven (`BG_CREVASSE`). Fiches personnages rangées en référence dans `Ressource lore/Charactersheet/finale/`, non affichées en jeu. Al’Gratal (dont `c18_reflet`) passe sur `bg_algratal_portes`.
