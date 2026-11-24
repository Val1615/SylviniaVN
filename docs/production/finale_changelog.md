# Journal · Final du Tome I

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
