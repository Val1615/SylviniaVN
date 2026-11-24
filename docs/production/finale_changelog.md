# Journal · Final du Tome I

## v0.426 (branche `feat/hud-combat-discret`)

- Retour de l’auteur : le cartouche de duel masquait l’image clé (capture Fold, `c18_bh_dragon`). Le HUD des 4 duels (S04, S06, S07, S08) devient une barre fine et semi-transparente, collée sous l’en-tête et arrêtée avant les onglets.
- Barre : une rangée de jauges fines (porteur, nom court, valeur), boutons « ? » (règles, met le chrono en pause) et « ▾ » (détails). Le nom complet de chaque jauge reste en infobulle.
- Consigne « Ce tour », intention (S04) et conséquences : une seule ligne sous la barre. Toucher la ligne ou « ▾ » déplie la carte S06, les runes S07, le tandem S08, les seuils et le réglage des effets. L’état replié/déplié est mémorisé (`sylvinia_fd_hud_details`).
- QTE : barre du chrono compacte dans le HUD ; sur écran bas (≤ 600 px), la consigne redondante se masque pendant le réflexe.
- Interfaces épurée et cinématique : la barre suit (tout en haut en cinématique). Interface classique : même barre compacte.
- Persistance v0.424 conservée (HUD tenu pendant les interludes « Duel en suspens »), panneau de règles à l’entrée de chaque duel inchangé.
- Nouveau test `tools/finale-gen/hud_discret.py` (géométrie aux 3 formats Fold, ▾, ?, modes, règles à l’entrée). `duels_e2e.py` lit aussi les infobulles des jauges.
- Bulle de mise à jour : « v0.426 · Interface de combat discrète ».

## v0.425 (branche `feat/finale-lot3-s08-s09`)

- Images clés du lot 3 livrées par l’auteur : 56 plans (S08 : 34, S09 : 22), dans `assets/images/keyscenes/chapter18-s08/` et `chapter19-s09/` (dossiers `chapter16-s08/s09` de l’archive renommés). Copie à l’identique (sha256 vérifié). Les 16 PNG joints, variantes des mêmes plans, ne sont pas intégrés.
- Placement selon la structure du VN, pas selon le découpage du livre :
  - S08 sur le chemin Remerii, après le carrefour (`c18_ouverture` et la suite). `s08_05` (cercle d’évacuation de Saidin) est à `c18_fuir`, avant Bhaal, et non au moment plus tardif du manuscrit.
  - Hylee apparaît en forme finale à partir de `s08_26` / `c18_remerii_tombe`, comme les sprites `hylee_finale_*`.
  - Le duel du blizzard (`c18_bh_blizzard`) porte `s08_07` (le Gardien, conservé tel quel). Les duels de synchronisation, du dragon et de la fin portent `s08_15`, `s08_19` et `s08_25`.
  - S09 dans l’Épilogue (`c19_trone` à `c19_serment`). `s09_14` illustre aussi `c19_promesse`.
- Codex : section « Remerii et Hylee face à Bhaal » ajoutée au Chapitre XVIII, nouveau groupe Épilogue (« Le poids du deuil »). Clés `c18_cg_s08_*` et `c19_cg_s09_*`.
- La Porte de S08 et S09 est l’œil rouge dans le massif d’épines du lot 1, pas l’arche du lot 2 en S07.
- Couverture du roman, duels, Game Over, branches, sauvegardes `sylvinia_vn_v82`, CA et Studio inchangés.
- Bulle de mise à jour : « v0.425 · Images clés S08 et S09 ».


## v0.424 (branche `feat/finale-vn-combats-clairs`)

VN
- Cause du locuteur jamais mis en avant : tous les écrans générés du final portaient le locuteur « Narrateur » (les répliques sont dans le texte du roman), donc l’interface ne trouvait aucune silhouette à éclairer ; et même dans les anciens chapitres, `.sprite.parle` ne changeait que la luminosité.
- Nouveau `tools/finale-gen/voices.py` : locuteur de chacune des 149 répliques du roman. Les écrans générés portent `voices` (début de réplique, locuteur) ; l’interface choisit, page par page, la dernière réplique d’un personnage visible, affiche son nom sur la plaque et met sa silhouette en avant. Écrans écrits à la main : table `voices` dans `extra_c17/18/19.js`.
- Le locuteur s’avance (échelle 1,07, lumière, premier plan) ; les autres reculent (0,95, pénombre). L’échelle propre des sprites (`finale-k`) est conservée (multiplication). Valable dans tout le Mode Histoire.
- Écrans sans silhouette ni image clé : 51 → 0. Scènes du roman complétées avec des sprites existants (Tia et Allenna en CA png, Hylee forme finale seulement à partir de `c18_remerii_tombe`), plans clés tenus plus longtemps (`HOLD` : jusqu’au plan suivant, et reprise du dernier plan de la scène précédente), cartons de fin et Game Over habillés.
- Personnages ajoutés là où ils parlent : Tia (`c17_fuyards`, `c18_remerii_avance`, `c18_premier_choc`), Allenna (`c17_fermer`, `c17_double_jeu`), Iriana (`c18_pacte_valurn`), Hylee (`c18_valurn_renvoi`).
- Sans sprite (plans clés uniquement) : Amanea transformée, Alamma, Bhaal, Démendras, Ellion ; Lineva reste une voix hors champ (parchemin).
- Les anciens identifiants d’écran v0.423 restent valides (alias vers le premier paragraphe).

Combats
- Cause du HUD qui disparaît : les duels alternent écrans de combat et passages du roman. Sur ces passages (sans `fduel`), le moteur quittait `combatMode` et l’interface masquait le HUD, puis le réaffichait au tour suivant (11 coupures sur les 4 duels, jusqu’à 18 s). Ces passages sont maintenant des interludes : HUD compact « Duel en suspens », toujours visible jusqu’à la fin du duel.
- Panneau de règles avant chaque duel (objectif, 4 règles, défaite), style bandeau incliné, rappelable par « ? Règles » dans le HUD ; il met le chrono des QTE en pause. Pas de réaffichage automatique à la reprise après un Game Over.
- Consigne de tour (« Ce tour »), conséquences du tour précédent (« Conséquences », jauge par jauge), et sous chaque choix ce qu’il fait (S04 : nature du geste ; S06, S07, S08 : coût).
- Ambiances propres à chaque duel inchangées. Game Over, reprise au début du duel, branches, sauvegardes `sylvinia_vn_v82`, CA et Studio inchangés.

Tests : `vn_audit.py` (fond nu, locuteur), `test_locuteur.py` (mise en avant page par page), `hud_persist.py` (HUD tenu sur tout le duel, règles, consigne).
- Bulle de mise à jour : « v0.424 · VN et combats plus lisibles ».

## v0.423 (branche `feat/cinematique-metamorphose`)

- Cinématique de la métamorphose d’Amanea, fichier fourni par l’auteur, copié à l’identique dans `assets/video/finale/amanea_metamorphose.mp4` (sha256 `8f154599d9cc31911eeb3dbb172484cd7f7d0b2a26b389ac951596fd5359379a`, 852×480, 1 min 07, h264+aac).
- Lecture plein écran au début du beat `c17_metamorphose`, avec bouton « Passer » discret. Le texte de la scène reprend juste après (passer, fin de la vidéo, ou erreur de lecture).
- Musique du jeu fondue puis coupée le temps de la vidéo (la bande-son est dans le fichier) ; elle reprend ensuite (à ce moment du récit : `music_c10_horreur` ; « Amanea, Final destination » commence plus tard, à la bascule du duel).
- Une seule lecture par passage : un `render()` sur la même scène ne la relance pas ; y revenir (relecture du Chapitre XVII, ou nouvel arrivage sur le beat) la rejoue. API `SylviniaFinaleCinema.replay()` pour un rejeu manuel.
- Autoplay bloqué (mobile) : écran « Toucher pour lancer », le bouton « Passer » reste disponible. Formats Fold (830×525, 1024×880, 880×1024) en letterbox, sans recadrage (`object-fit: contain`). `prefers-reduced-motion` et « Effets : doux » n’empêchent pas la lecture.
- Nouveau fichier `fusion/story-finale-cinema.js`. Sauvegardes `sylvinia_vn_v82`, Game Over, duels, CA et Studio inchangés.
- Bulle de mise à jour : « v0.423 · Cinématique de la métamorphose ».

## v0.422 (branche `assets/finale-lot2`)

- Images clés du lot 2 livrées par l’auteur : 67 plans (S05 : 22, S06 : 21, S07 : 24), dans `assets/images/keyscenes/chapter17-s05/`, `chapter18-s06/`, `chapter18-s07/` (dossiers `chapter16-s0x` de l’archive renommés). Copie à l’identique (sha256 vérifié), sauf s06_17 et s06_20 : retouches validées par l’auteur (les plaques sont dans la main droite de Draven, raccord avec s06_18 et `c18_dp_adieu`).
- Placement selon la structure du VN, pas selon le découpage du livre :
  - S05 dans le tronc du Chapitre XVII, de `c17_trois` à `c17_brasier`.
  - S06 dans la branche Draven, de `c18_draven_seul` à `c18_remerii_draven` (Remerii trouve Draven), avant `c18_dp_adieu`. s06_08 (« Dans la grotte ») et s06_10 (« Regagner le seuil ») illustrent les scènes de duel `c18_dp_grotte_r` et `c18_dp_voute`, qui portent ce passage du roman.
  - S07 dans la branche Iriana, de `c18_alamma` à `c18_saut`. L’aiguillage « À quelques lieux de là » du découpage S06 est ignoré : Draven → S08, Iriana → S08.
- Un paragraphe porte au plus un plan : s05_20 (regard de Naïah) passe au § 10766 et s05_21 (la terre) au § 10768, le § 10764 portant déjà le drainage.
- Codex : section « La dernière main tendue » ajoutée au Chapitre XVII, nouveau groupe Chapitre XVIII (« Le dernier adieu à Draven », « Iriana face à Alamma »). Clés `c18_cg_*` pour S06 et S07, clés `c17_cg_*` inchangées.
- Fin de S06 (`c18_s06_fin`) : « Remerii laisse Draven à son dernier silence et rejoint les siens. Là-bas, la nuit bascule. », cohérent avec la découverte qui précède, et plus court pour tenir sans défilement à 830x525.
- À signaler : s05_16 et s06_19 sont intégrés tels quels (plans « à trancher » au tri) ; en S07, la Porte est une arche à côtes dorées, et non l’œil rouge dans le massif d’épines de S02 à S05.
- Couverture du roman inchangée : 1365/1365, 293 écrans.
- Bulle de mise à jour : « v0.422 · Images clés S05 à S07 ».

## v0.421 (branche `feat/finale-duels-epiques`)

- Mise en scène épique des quatre duels du final, entièrement dans `tools/finale-gen/duels.js` (copié vers `fusion/story-finale-duels.js` v2). Chaque scène de duel reçoit une humeur :
  - **Urgence** : bords de l’écran qui battent comme un pouls (plus vite si une jauge est critique, encore plus pendant un QTE), HUD qui tressaille, braises / éclats / neige rapides, flash coloré et son d’impact quand une jauge chute, compte à rebours qui rougit et cliquette dans les 3 dernières secondes.
  - **Désespoir** : décor et sprites désaturés, vignettage sombre dont la lueur faiblit lentement, HUD fissuré et pâli, jauges qui se vident lentement, cendres / poussière / neige lentes, double battement de cœur sourd, musique en retrait (62 %).
  - **Bascule épique** : coupure noire, éclair aux couleurs du duel, titre d’attaque propre à chaque duel (bandeau incliné pour S04, bloc de pierre pour S06, sceau d’encre pour S07, bandeau de glace pour S08), montée de la musique ; le QTE éventuel attend la fin du bandeau.
  - Game Over : l’interface se retire (HUD gris et effacé), décor presque monochrome. Fin du combat contre Bhaal : apaisement (neige lente, HUD qui s’efface).
- Thèmes : flammes noires et violet (Amanea), roche et poussière (Draven), arcane bleu et chaos pourpre (Iriana / Alamma), blizzard et glace (Bhaal).
- Bascules : « Puissance révélée » (c17_revelation), « Une minute volée » (c17_qte_ok), « Effondrement » (c18_dp_voute_r), « Chaos filtré » (c18_ip_flux), « Renversement » (c18_ip_renversement_r), « Synchronisation » (c18_bh_sync), « Dragon de glace » (c18_bh_dragon).
- Accessibilité : `prefers-reduced-motion` et le réglage « Animations réduites » de la Bibliothèque coupent particules, secousses, tremblements, flashs et glissements (bandeau en simple fondu). Bouton « ✦ Effets : intenses / doux » dans le HUD (mémorisé dans `sylvinia_fd_fx`) : « doux » retire flashs, secousses et tremblements et allège les particules. Flashs ≤ 36 % d’opacité, jamais plus d’un par seconde.
- La barre du QTE s’affiche dès l’entrée de la scène (en pause pendant le voile ou le bandeau).
- Sons : Web Audio synthétisée (impact, battement de cœur, bascule, tic du compte à rebours), coupés si les sons sont désactivés. Aucun nouvel asset.
- Duel S04 « ontologique » (Valurn contre Amanea) : l’interface raconte ce qu’Amanea est en train de devenir.
  - Trois phases nommées dans le HUD : « Phase I · Ce qu’il lit » (manches I à III), « Phase II · Ce qu’elle est » (révélation, manche IV), « Phase III · Le temps volé » (manche V et riposte).
  - Intention d’Amanea affichée avant chaque échange en phase I (« elle guette les bords du brasier », « frapper le sol, pas lui », « flanc gauche couvert · garde haute ouverte »), comme le texte l’annonce (« c’est lui qu’il faut lire »). À la révélation, l’intention devient illisible (texte brouillé), en accord avec « Ses coups n’ont plus besoin d’être lus ».
  - Ordre des tours : alterné en phase I (V / A), puis la Reine Noire agit deux fois (R R V R R), puis le sablier du temps volé.
  - Le nom vacille : à partir de la révélation, les jauges d’Amanea portent « ~~Amanea~~ Reine Noire » ; cadre du HUD qui vire au violet et vert, cases de Valurn fissurées.
  - Tampons de résultat après chaque manche (« Lecture juste », « Lu par elle », « Garde rompue », « Temps volé +2 s », « Une minute »…).
  - Ressource réelle : chaque seconde gagnée en phase II élargit de 300 ms la fenêtre de la riposte finale (QTE `c17_qte`).
- Sources d’inspiration et emprunts : voir `docs/production/finale_duels_inspirations.md`.
- **Chaque duel a sa propre boucle** (rien de répété d’un combat à l’autre) :
  - S04 garde intentions, ruban de tours, tampons et trois phases.
  - S06 Draven : plan de terrain (Dehors · Crevasse · Couloir · Grotte), horde case par case, « Tenir · vague N/5 », veine de la voûte repérée en reculant ; dalles de pierre, tambour lent, bascule « pierre ».
  - S07 Iriana : sceau de runes (Arcane, Ombre, Chaos, Mort) à défaire puis à combiner ; recettes du Renversement qui dépensent le Chaos filtré (Enserrer 1, Trait 2, Tresse 3) ; HUD inversé sous l’emprise ; encre, carillons, bascule en sceau.
  - S08 Remerii et Hylee : tandem à rôles alternés, lien qui s’allume, terrain qui change avec le blizzard, fenêtre de synchronisation détaillée (main brûlée : −0,6 s), dragon de glace qui coûte l’Arcane d’Hylee ; verre de givre, souffle, bascule de glace.
- Bulle de mise à jour : « v0.421 · Duels épiques ».

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
