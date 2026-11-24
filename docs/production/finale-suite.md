# S02 à S09 · Final du Tome I

**Version v0.418 · Chapitres XVII, XVIII et Épilogue · Mode Histoire**

La suite part de l’écran de fin de S01 (`c16_s01_fin`), qui gagne un bouton **Continuer**. Elle mène sans interruption jusqu’à la dernière phrase du Tome I, « Mère… nous rentrons. », puis à l’écran **Fin du Tome I**. Une sauvegarde arrêtée sur `c15_end` ou sur `c16_s01_fin` continue normalement.

## Règle d’or : le roman en entier

Les 1365 paragraphes du roman entre « Tia se place devant ses hommes » (fin du chapitre 20) et « Mère… nous rentrons. » (Épilogue) sont repris dans leur ordre, sans coupe ni résumé. Le texte est au présent, comme le manuscrit. Les répliques sont en guillemets « … » avec l’incise après, comme aux chapitres XIII à XVI. Les fautes de frappe et d’accord sont corrigées sans toucher au style.

La concordance complète, scène par scène, est dans [finale_concordance_roman_vn.md](finale_concordance_roman_vn.md). Le contrôle de couverture est automatique : le générateur échoue s’il manque un paragraphe, et un test joue 75 parcours complets en vérifiant que chacun affiche les 1365 paragraphes. **Couverture : 100 %.** Les choix ajoutent des scènes entre les paragraphes du roman, sans jamais en retirer aucun.

## Lots livrés

| Lot | Contenu | Chapitre VN | Scènes | Roman |
|---|---|---|---|---|
| S02 | Bataille de la Porte Noire | XVII · La Porte Noire | 33 | ch. 20, § 9682–10126 |
| S03 | Transformation d’Amanea | XVII | 16 | ch. 20, § 10128–10470 |
| S04 | Valurn contre Amanea, duel jouable | XVII | 25 | ch. 20, § 10472–10599 |
| S05 | La figure de Tia, Amanea et Naïah, puis carrefour | XVII et XVIII | 12 | ch. 20, § 10601–10783 |
| S06 | Draven, point de vue optionnel | XVIII · Début de la fin | 16 | ch. 21, § 10796–10894 |
| S06-S07 | Tronc commun : deuil de Tia, ouverture du portail, Bhaal | XVIII | 13 | ch. 21, § 10896–11179 |
| S07 | Iriana, point de vue optionnel | XVIII | 20 | ch. 21, § 11180–11408 |
| S08 | Remerii, Hylee, Bhaal (obligatoire) | XVIII | 29 | ch. 21, § 11411–11823 |
| S09 | Épilogue du Tome I | Épilogue | 14 | Épilogue, § 11843–12094 |

Total : 178 scènes, dont 128 portent le texte du roman et 50 sont écrites pour le jeu.

| Fichier | Contenu |
|---|---|
| [story-finale-s02.js](../../fusion/story-finale-s02.js) | Chapitre XVII (S02 à S05), duel, carte de chapitre `ch17`. |
| [story-finale-s06.js](../../fusion/story-finale-s06.js) | Chapitre XVIII (carrefour, S06 à S08), points de vue, carte `ch18`. |
| [story-finale-s09.js](../../fusion/story-finale-s09.js) | Épilogue, écran de fin, carte `ch19`. |
| [tools/finale-gen](../../tools/finale-gen/) | Générateur : texte extrait du DOCX, corrections, découpage, scènes jouables, test de parcours. |

Les trois scripts suivent l’architecture de S01. Ils sont chargés après `story-finale-s01.js` et avant `adapter.js?v=50`, et leur `?v=` sert au cache. Le Studio (`studio/runtime`, `modifications.js`), le Codex, la Chronique alternative et la pagination ne sont pas modifiés. Le texte des scènes du roman reste du texte simple, modifiable dans le Studio.

## Ce que le joueur choisit

| Moment | Choix | Effet |
|---|---|---|
| Avant la marche (`c17_choix_regard`) | Observer Démendras ou rester près de Remerii | Une scène de regard. Démendras, masqué, salue sans s’arrêter. Remerii vérifie les sangles d’Hylee : « Tu restes derrière moi. » |
| Après « Je reviendrai » (`c17_choix_adieu`) | Serrer l’étoile ou murmurer son nom trop tard | Le flag `s02Adieu` revient dans la tempête (S08) et au chevet de Remerii (Épilogue). |
| Duel (S04) | Cinq manches où le joueur dirige Valurn | Voir ci-dessous. |
| Carrefour (`c18_carrefour`) | « Poursuivre : Remerii / Hylee », toujours affiché. « Point de vue : Draven » et « Point de vue : Iriana » s’affichent seulement si la route correspondante a été suivie. | Un seul point de vue optionnel par partie. L’autre se rejoue depuis le menu Chapitres. |
| Draven | Tenir ou reculer dans la crevasse. Ce qu’il dit à Lineva : la promesse du roman, puis s’il le souhaite « Veille sur ta mère » ou « Je suis fier de toi ». Comment entrer dans la grotte. | Variantes de trois à cinq lignes. « Je rentre bientôt… » est toujours dit. |
| Iriana | Défaire le sort d’Alamma ou frapper la première. Laisser le fragment de Valurn se modeler à l’Arcane ou s’en emparer de force. Retenir Alamma ou exiger une réponse. | La voie de force laisse une brûlure et fait parler le Chaos plus fort. |
| Dans la tempête (`c18_choix_hylee`) | « Je ne te laisse pas seule. » ou tendre la main sans un mot | Écho au chevet. |
| L’Arcane (`c18_choix_arcane`) | L’attraper au vol ou la laisser venir | L’attraper la brûle, comme dans la leçon de Remerii, et ramène au choix sans jamais bloquer. La laisser venir mène à la suite du roman. |

### Duel Valurn contre Amanea

Le joueur dirige Valurn. Avant chaque manche, une scène décrit le geste d’Amanea et la bonne réponse se lit dans ce geste :

| Manche | Ce que fait Amanea | Bonne lecture |
|---|---|---|
| I · Le mur de feu | Elle guette les bords du brasier. | Traverser le mur en son centre. |
| II · L’onde | Son poing vise le sol. | Bondir hors du sol. |
| III · La garde | Elle couvre son flanc blessé, la garde haute reste ouverte. | Frapper la garde haute. |
| IV · Retarder | Ses coups ne se parent plus. | Céder du terrain pas à pas. |
| V · Encore une minute | Elle frappe pour en finir. | La provoquer : « Encore une minute, très chère. » |

La jauge **Vitalité d’Amanea** (10 points) baisse de 2 pour une bonne lecture et de 1 pour une lecture moyenne. Après la manche III, une seconde jauge, **Puissance révélée**, apparaît vide puis se remplit d’un coup (`c17_revelation`). Les manches IV et V remplissent **Temps gagné**. La défaite reste obligatoire : toutes les issues rejoignent le texte du roman (« Alors, elle le brise… »). `c17_duel_bilan` dit seulement si Valurn a volé beaucoup ou peu de temps.

## Sensibilités et divergences

Voir [finale_divergences.md](finale_divergences.md). En résumé :

- **Scène 5 (validée par l’auteur) :** le joueur suit l’illusion de Tia et découvre Naïah en même temps qu’Amanea. Aucune silhouette ni aucun titre ne la trahit avant `c17_naiah_revelee`, où sa silhouette apparaît avec son nom.
- **Hylee transformée :** aucune silhouette après la canalisation, tant que le sprite de sa forme finale n’existe pas.
- **Naïah :** aucune scène ajoutée ne lui prête de désir, et rien ne nomme son orientation.

## Visuels et musique

Aucune image ni musique n’a été générée. Les décors et les pistes sont ceux du dépôt, réutilisés tels quels. Le détail des emplacements prévus est dans [finale_assets_manifest.json](finale_assets_manifest.json) : images BG-01 à BG-10 et CG-02 à CG-15 du cahier, musiques MU-01 à MU-08.

Les huit fichiers fournis par l’auteur sont intégrés à l’identique (même sha256) :

- les quatre décors sont affichés en jeu depuis `assets/images/backgrounds/finale/` : `BG_PORTE` (Porte Noire), `BG_GIVRE` (blizzard), `BG_CHAMP` (champ de bataille, Épilogue) et `BG_CREVASSE` (ravin de Draven) ;
- les quatre fiches personnages (Hylee forme finale, Alamma, Bhaal, Amanea forme finale) sont **à titre indicatif** : rangées dans `Ressource lore/Charactersheet/finale/`, elles ne sont affichées nulle part dans le jeu.

## Vérifications

| Contrôle | Résultat |
|---|---|
| Couverture roman → scènes (générateur) | 1365 / 1365 paragraphes, 0 doublon |
| Parcours de toutes les branches depuis une sauvegarde v82 sur `c16_s01_fin` | 75 parcours (aucun déblocage, Draven, Iriana, les deux, mode dev × 15 politiques de choix). Aucune impasse : 178 scènes et tous les choix visités, chaque parcours affiche les 1365 paragraphes et revient au menu. |
| Liens, décors, musiques, sprites | Toutes les cibles existent. Aucun 404 sur les ressources des nouvelles scènes. |
| Console | Aucune nouvelle erreur. Seules restent les erreurs connues : `C13G_SCENES`, le 404 déjà présent. |
| Pagination 830×525, 1024×880, 880×1024 | 884, 723 et 716 pages parcourues sur les 177 scènes de la première version, puis les scènes de la révélation (`c17_gorge`, `c17_dernier_souffle`, `c17_naiah_revelee`, `c17_regard_satisfait`) revérifiées après le découpage : aucun débordement. Sur les 19 scènes de choix à 830×525, le texte (une ou deux lignes) reste entier au-dessus des boutons, contrôlé à l’œil et en mesurant le dernier paragraphe (`choiceshots.py`). |
| `studio-overrides`, `studio-ca` | ok |
| `story-world.test.cjs` | 4 !== 3, échec déjà présent sur `main` |
