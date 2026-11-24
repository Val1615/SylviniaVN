# Divergences et points sensibles · Final du Tome I

## 1. Scène 5 : Naïah sous les traits de Tia

**Manuscrit du dépôt (source n° 1)**, § 10601–10783 : trois silhouettes s’approchent, « Tia » supplie, frappe et tranche la gorge d’Amanea. L’illusion se dissipe ensuite (« Ce ne sont pas les yeux de Tia… Naïah. Sa fille. »), et Valurn murmure « je t’avais dit que je te l’offrirais ».

**Cahier de production** (pages 321 à 325 de l’édition imprimée) : la scène montre une Tia distincte.

**Choix retenu et validé par l’auteur (24 novembre 2026) : la VN suit le manuscrit du dépôt.** Dans ses mots : « Dans l’histoire, on a l’illusion de suivre Tia. Et on découvre en même temps qu’Amanea, à la toute fin, que c’était Naïah. » Le joueur suit donc l’illusion de Tia jusqu’au bout et découvre Naïah au même instant qu’Amanea. C’est cohérent avec la suite du texte : Tia et Iriana arrivent « trop tard » (§ 10897), la culpabilité de Tia s’explique, Allenna croit qu’une lame sylvinienne a tué sa mère (Épilogue) et Ellion porte Naïah disparue.

Mise en scène :

- de `c17_trois` à `c17_dernier_souffle`, rien ne trahit Naïah : aucune silhouette (il n’existe pas non plus de sprite de Tia adulte), et ni les sous-titres (« Trois silhouettes », « Tia… écoute-moi… », « Une Farae ne pardonne jamais », « L’acier sur la pierre », « Pourquoi… ? », « Dernier souffle »), ni les identifiants de scène affichés sur la tranche de la boîte de dialogue ne la nomment ou ne parlent d’illusion ;
- la révélation est découpée en deux scènes :
  - `c17_dernier_souffle` (§ 10747–10757, « Les sons. » jusqu’à « …qu’elle a protégé sans qu’elle ne le sache. ») : pas de silhouette, sous-titre « Dernier souffle » ;
  - `c17_naiah_revelee` (§ 10758–10761, « Naïah. Sa fille. Son propre sang. » jusqu’à « Sans un regret. ») : sous-titre « L’illusion se dissipe », la silhouette de Naïah (`naiah_neutral`) apparaît à l’instant exact où le texte la nomme ;
- l’image clé CG-08 est prévue sur `c17_gorge` (Tia apparente) puis `c17_naiah_revelee` (révélation).

## 2. Hylee transformée

À la fin, Hylee apparaît dans sa forme entièrement transformée. Il n’existe pas encore de sprite pour cette forme : le dépôt contient seulement `hylee_*`, `hylee2_*` et « Hylee apprentie mage.png ». Pour ne pas la montrer avec son ancienne apparence :

- les silhouettes habituelles servent jusqu’à la canalisation (`c18_conduit`) ;
- à partir de `c18_remerii_tombe`, aucune silhouette d’Hylee ne s’affiche (Épilogue compris) ;
- la révélation `c18_reflet` (« Deux saphirs ») garde un vrai décor de scène : les portes d’Al’Gratal (`bg_algratal_portes`), comme `c18_algratal` et `c18_ne_me_laisse_pas` (« sol de pierre », Sylviniens qui s’affairent). Le panorama `c2_algratal_panorama_cg` a été retiré de ces scènes, car on y voit de dos une Hylee aux cheveux roux. La fiche d’Hylee n’y est jamais affichée ;
- l’emplacement prévu pour les futurs sprites est `assets/sprites/hylee_finale_*.png`.

## 3. Naïah

Aucune scène ajoutée ne lui prête de désir, et son orientation n’est jamais nommée. Dans le roman, sa seule présence est le regard qu’elle échange avec Iriana au portail, puis l’illusion.

## 4. Carrefour du Chapitre XVIII : trois branches séparées (v0.419)

Conformément au cahier de production, le carrefour ouvre trois vraies branches :

- **S06 · Draven** (facultative, si débloquée) : carton « Pendant ce temps, dans la crevasse… », puis uniquement le texte du roman centré sur Draven (§ 10801–10894) et son duel de survie. Fin : flag `c18PlayedDraven`, carton « Pendant ce temps, face au portail… », retour direct à S08, sans passer par Iriana.
- **S07 · Iriana** (facultative, si débloquée) : carton « Pendant ce temps, près du corps d’Amanea… », puis le deuil avec Tia (§ 10896–11044), la confrontation avec Alamma, le pacte de Valurn, le duel, le renversement et le saut dans le portail (§ 11182–11408). Aucune scène de Draven. Fin : flag `c18PlayedIriana`, carton, retour direct à S08.
- **S08 · Remerii, Hylee, Bhaal** (obligatoire) : carton « Au même moment, face au portail… », ouverture du portail et Bhaal (§ 11046–11179), puis le blizzard jusqu’à Al’Gratal (§ 11411–11823), et l’Épilogue.

**Règle d’or.** L’union S01–S05 + S06 + S07 + S08 + S09 couvre les 1 365 paragraphes du roman, sans doublon (contrôle automatique de `gen.py`). Conséquence du découpage voulu par le cahier : un joueur qui n’a débloqué ni Draven ni Iriana ne lit pas les passages S06 et S07 ; un joueur Draven lit S06 mais pas S07, et inversement. Les deux branches se rejouent depuis la carte « Chapitre XVIII » du menu des chapitres, sans toucher à la vraie partie (voir § 6). **Point à valider par l’auteur.**

## 4 bis. Duels et Game Over (v0.419)

Quatre vrais duels réutilisent la grammaire native (classe `combatMode`, voile `#combatTransition`, cartouche de jauges, secousse et son, QTE chronométré) :

| Duel | Jauges | Pivot QTE | Game Over | Reprise |
|---|---|---|---|---|
| S04 Valurn / Amanea | Phase A : `Posture · Flammes noires` contre `Vitalité · Garde`. Phase B : jauge nommée `Puissance révélée`, qui part de 0 et se remplit d’un coup (`c17_revelation`) ; la parade des manches I–III est brisée en phase B. | « Esquive · riposte » (`c17_qte`) | Phase A : Valurn s’effondre ou n’amène pas Amanea au seuil (garde ≤ 6) → `c17_gameover_a`. Phase B : Valurn tombe trop tôt ou QTE manqué → `c17_gameover_b`. Sinon défaite canonique, sortie du mode combat, S05 sans combat. | `c17_duel_intro` |
| S06 Draven | `Endurance de Draven`, `Pression de la horde` | « Frapper la voûte » (`c18_dp_voute`) | Endurance à 0 ou horde à 10 (`c18_dp_gameover_horde`), QTE de l’effondrement manqué (`c18_dp_gameover_voute`). La pause Lineva n’a ni HUD ni chrono. | `c18_dp_crevasse` |
| S07 Iriana / Alamma | `Arcane d’Iriana`, `Emprise d’Alamma`, puis `Chaos filtré (Ombre · Chaos · Mort)` | « Stabiliser le flux » (`c18_ip_flux`) | Arcane à 0 sous la domination (`c18_ip_gameover_brisee`), flux du Chaos manqué (`c18_ip_gameover_chaos`). | `c18_ip_maitrise` |
| S08 Remerii + Hylee / Bhaal | `Pression de Bhaal`, `Blizzard · Résistance`, `Flux d’Arcane (Hylee)` | « Synchronisation » (`c18_bh_sync`), durée allongée par `s08Reponse`, `s02Adieu = confiance` et un lien ≥ 8 | Blizzard épuisé (`c18_bh_gameover_blizzard`), synchronisation manquée (`c18_bh_gameover_sync`), Bhaal qui submerge la ligne (`c18_bh_gameover_bhaal`). Victoire : Bhaal repoussé, portail affaibli mais pas refermé. | `c18_bh_blizzard` |

Chaque Game Over propose « Réessayer le duel » et « Retour au menu ». La reprise relance **la scène de départ du duel en cours**, jamais le début du chapitre ni une ancienne sauvegarde : seuls les flags de ce duel sont remis à zéro, tous les choix et flags antérieurs, l’inventaire et les stats sont conservés. Les jauges sont recalculées à partir des flags : une sauvegarde ou un rechargement en plein duel restitue l’état exact. Les QTE se mettent en pause quand le joueur quitte l’écran de jeu (menu, journal, onglet masqué) ; aucun QTE pendant la pause Lineva, S05 ou la transformation de S03.

## 5. Ajouts écrits pour le jeu

Toutes les scènes interactives (`c17_choix_*`, `c17_regard_*`, `c17_adieu_*`, le duel, `c18_dp_*`, `c18_ip_*`, `c18_choix_*`, `c18_reponse_hylee`, `c18_arcane_brule`, `c19_promesse`, écrans de fin) sont écrites au présent, en guillemets avec incise. Elles n’ajoutent aucun fait qui contredise le roman.

Deux points à valider par l’auteur :

- Démendras : le salut sans un mot dans `c17_regard_demendras` reprend son masque et ses lunettes décrits au § 9688 ;
- Valurn : la réplique « Encore une minute, très chère. » vient du cahier.

## 6. Interface

- L’en-tête des boutons de choix suit le personnage joué : « Le choix de Valurn » (S04), « Le choix de Draven » (S06), « Le choix d’Iriana » (S07), « Le choix de Remerii » (blizzard, dragon) et « Le choix d’Hylee » (réponse, Arcane, synchronisation), « Après la défaite » sur les Game Over. `adapter.js` (v51) appelle le crochet `sylviniaChoiceHeader` ; sans valeur, le libellé historique est conservé, si bien que les chapitres I à XVI ne changent pas. La pagination n’est pas modifiée.
- Relecture : la carte « Chapitre XVIII » d’une partie terminée ramène au carrefour, déblocages conservés, branches déjà jouées marquées « (déjà jouée) ». La vraie partie est mise de côté (`finaleReplay`) puis restaurée à la fin de la branche (« Terminer la relecture ») : aucun choix rejoué n’écrase la sauvegarde réelle, et aucune stat n’est gagnée.
- Pour l’interface, l’Épilogue est rangé sous « Chapitre XIX » (`getSceneChapterLabel`). À l’écran, son titre reste « Épilogue · Tome I ».

## Fichiers fournis par l’auteur (24/11/2026)

- **Quatre décors, affichés en jeu**, copiés à l’identique sous `assets/images/backgrounds/finale/` : la Porte Noire (`BG_PORTE`), la Porte sous le blizzard (`BG_GIVRE`), le champ de bataille (`BG_CHAMP`) et le ravin (`BG_CREVASSE`, crevasse et grotte de Draven). `BG_AKUHN` garde la citadelle `c4v_akuhn_citadel` : le texte du rassemblement décrit la cité vue de loin, que le ravin ne montre pas.
- **Quatre fiches personnages (Hylee forme finale, Alamma, Bhaal, Amanea forme finale) : référence de design uniquement, non affichées en jeu.** Consigne de l’auteur : « Les fiches sont à titre indicatif ». Elles sont rangées à l’identique dans `Ressource lore/Charactersheet/finale/`, à côté des autres fiches du dépôt. Aucune scène, ni le Codex, ni une galerie ne les charge, et elles ne figurent pas dans le registre d’assets `A`.
- Détail et sha256 : [finale_assets_manifest.json](finale_assets_manifest.json).
