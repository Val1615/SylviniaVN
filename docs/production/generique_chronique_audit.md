# Générique de fin du Tome I · Catalogue « Votre Chronique »

Document généré depuis `fusion/story-generique-chronique.js` (souvenirs illustrés, 99 souvenirs, 42 groupes exclusifs). Chaque condition a été vérifiée contre l’index : le flag et sa valeur sont posés par un choix de la scène indiquée (audit automatisé : 0 condition sans source). Test : `node test/story-generique.test.cjs`.

## Règles de sélection (catalogue v2, v0.431)

Deux lectures du même parcours prouvé :

- **Ma Chronique** (onglet Progression, `capture.complet`) : tout le parcours prouvé, rangé par chapitre, sans filtre ni plafond.
- **Générique** (`capture.chapters`, durée visée ≈ 6 min à ×1) : mêmes chapitres, tous les souvenirs illustrés et souvenirs de Progression, mais seulement les **choix marquants**. Poids déterministe d’une décision (`markWeight`) :

  | Trace laissée par le choix | Poids |
  | --- | --- |
  | branche de route (mène à un autre volume alors que l’écran se divise, ou flag `…route…` / `…Started`) | +100 |
  | souvenir de Progression accordé | +40 |
  | flag narratif à variantes (valeur texte : réponse, posture, regard…) | +30 |
  | choix du final (chapitres XVII, XVIII, Épilogue) | +20 |
  | flag narratif simple | +10 |

  Poids nul (aucun flag durable, aucun souvenir) : choix mineur ou cosmétique, écarté. Par chapitre, les `MAX_DECISIONS_PER_CHAPTER` = 3 décisions les plus lourdes (égalité : ordre du livre). **Repère de chapitre** : un chapitre traversé sans choix marquant ni souvenir garde sa première décision prouvée, pour que la structure chapitre par chapitre reste entière ; son en-tête est court (sans vignette). Rien sans preuve : un chapitre sans décision prouvée n’apparaît pas.
- Chronique v0.430 (sans `complet`) : son parcours entier devient `complet`, le générique est recalculé sur ses preuves figées.
- Sources, de la plus forte à la plus faible :
  1. souvenirs illustrés du catalogue ci-dessous, tous ceux dont la condition exacte est remplie, un par groupe exclusif ;
  2. décisions réellement cliquées (journal de parcours `sylvinia_vn_parcours_v1`, écrans à au moins deux choix) ;
  3. décisions reconstituées : un flag de la sauvegarde que **un seul libellé** de choix du jeu peut poser (index calculé sur `S` au moment de la capture) ;
  4. journal de lecture de la Bibliothèque Astrale (choix récents), en appoint ;
  5. souvenirs de Progression (`state.memories`, textes de `PROGRESSION_MEMORIES`), rangés au chapitre du choix qui les accorde.
- Un souvenir illustré remplace la ligne de choix de la même scène. Une décision par écran.
- Ne prouvent rien et sont ignorés : flags `…Complete`, `c18Played*`, `finaleSeen*`, manches `s04M*` / `s04Qte`, `tome1Complete`, `finaleReplay`, flags de développement, flags posés par plusieurs libellés différents.
- Exclus de la transcription : navigation (« Continuer », « Retour au menu », « Réessayer »…), Game Over, écrans « terminé », portes de développement, manches de duel.
- Branches du final : S06 exige `s06DravenComplete`, S07 `s07IrianaComplete`, S08 `s08BlizzardComplete`.
- Moins de 6 rubriques prouvées : ajout des souvenirs communs (Porte Noire, blizzard), eux aussi conditionnés. Aucune preuve : texte neutre.
- Capture v2 figée à `go('c19_bilan')` dans `state.tome1Chronicle` (hors flags) + copie `localStorage.sylvinia_vn_chronique_tome1_v1`, avec chapitres et textes résolus. Jamais réécrite par une rejouabilité de chapitre, le mode développeur, `finaleReplay`, la CA ou une reprise de duel. Chronique v0.429 : mise à niveau à partir de ses preuves (`mise-a-niveau-v0.429`). Partie terminée sans capture : `sauvegarde-anterieure`. Mode développeur : aperçu calculé, non enregistré.

## Exclusions volontaires

- Bellirith : images trop suggestives pour un générique.
- Scènes intimes du chapitre XIII (route de groupe, secret et nuit douce) : non retenues.
- Synthèse de valeurs (stats) : non affichée, aucune phrase inventée sur la personnalité.
- Portrait `hylee2_teasing.png` : pourrait divulguer le Tome II, remplacé par la carte « À suivre… ».

## Mapping

| Identifiant | Catégorie | Condition exacte | Scène | Fonds |
|---|---|---|---|---|
| c2_ruisseau_fear | Les premiers pas | `streamAngle="fear"` | c2_05 | `clairiere_magique.png` |
| c2_ruisseau_alone | Les premiers pas | `streamAngle="alone"` | c2_05 | `clairiere_magique.png` |
| c2_ruisseau_strength | Les premiers pas | `streamAngle="strength"` | c2_05 | `clairiere_magique.png` |
| c2_gardien_still | Les premiers pas | `wolfApproach="still"` | c2_07 | `keyscenes/c2_forest_intro.png` |
| c2_gardien_trust | Les premiers pas | `wolfApproach="trust"` | c2_07 | `keyscenes/c2_forest_intro.png` |
| c2_gardien_hand | Les premiers pas | `wolfApproach="hand"` | c2_07 | `keyscenes/c2_forest_intro.png` |
| c2_gardien_barrier | Les premiers pas | `wolfApproach="barrier"` | c2_07 | `keyscenes/c2_forest_intro.png` |
| c2_portes_down | Les premiers pas | `gateReaction="down"` | c2_12 | `keyscenes/c2_algratal_gate.png` |
| c2_portes_fists | Les premiers pas | `gateReaction="fists"` | c2_12 | `keyscenes/c2_algratal_gate.png` |
| c2_portes_ask | Les premiers pas | `gateReaction="ask"` | c2_12 | `keyscenes/c2_algratal_gate.png` |
| c2_portes_intervene | Les premiers pas | `gateReaction="intervene"` | c2_12 | `keyscenes/c2_algratal_gate.png` |
| c2_valurn_fascine | Les premiers pas | `valurnRead="fascine"` | c2_23 | `catacombes_sanctuaire.png` |
| c2_valurn_mistrust | Les premiers pas | `valurnRead="mistrust"` | c2_23 | `catacombes_sanctuaire.png` |
| c2_valurn_remerii | Les premiers pas | `valurnRead="remerii"` | c2_23 | `catacombes_sanctuaire.png` |
| c3_robe | Les liens tissés | `remeriiSeSouviendraAssurance=true` | c3_07 | `chapter3/c3_key_robe_miroir.png` |
| c3_baton | Les premiers pas | `batonCerisierAccorde=true` + `remeriiSeSouviendraBaton=true` | c3_10 | `chapter3/c3_atelier_arcanique.png` |
| c3_clairiere | Les épreuves | `remeriiSeSouviendraMaitrise=true` | c3_25 | `chapter3/c3_key_test_remerii.png` |
| c3_medig | Les liens tissés | `medigSerment=true` | c3_30 | `chapter3/c3_camp_nuit.png` |
| c3_patience | Les liens tissés | `remeriiSeSouviendraPatience=true` | c3_35 | `chapter3/c3_camp_nuit.png` |
| c4_route_valurn (rare) | Les destins croisés | `route4VStarted=true` | c4_03 | `keyscenes/c4_key_03.png`<br>`chapter4/c4v_ruins_circle.png` |
| c4_route_draven (rare) | Les destins croisés | `route4DStarted=true` | c4_03 | `keyscenes/c4_key_03.png`<br>`chapter4/c4d_warroom_sunset.png` |
| c4v_bhaal_defie (rare) | Les destins croisés | `valurn_defie_bhaal=true` | c4v_50 | `keyscenes/c4v_key_50.png`<br>`chapter4/c4v_infernal_throne.png` |
| c4v_bhaal_masque (rare) | Les destins croisés | `valurn_masque_bhaal=true` | c4v_50 | `keyscenes/c4v_key_50.png`<br>`chapter4/c4v_infernal_throne.png` |
| c4d_pere_pere (rare) | Les destins croisés | `draven_pere_dabord=true` | c4d_07 | `keyscenes/c4d_key_07.png` |
| c4d_pere_amiral (rare) | Les destins croisés | `draven_amiral_dabord=true` | c4d_07 | `keyscenes/c4d_key_07.png` |
| c4d_pere_crainte (rare) | Les destins croisés | `draven_avoue_crainte=true` | c4d_07 | `keyscenes/c4d_key_07.png` |
| c4d_lineva_pere (rare) | Les destins croisés | `draven_pere_lineva=true` | c4d_18 | `keyscenes/c4d_key_19.png` |
| c4d_lineva_amiral (rare) | Les destins croisés | `lineva_durcie=true` | c4d_18 | `keyscenes/c4d_key_19.png` |
| c4d_lineva_verite (rare) | Les destins croisés | `draven_ne_ment_pas=true` | c4d_18 | `keyscenes/c4d_key_19.png` |
| c5_reflet | Les épreuves | `c5_reflet_grave=true` | c5_30 | `chapter5/c5_salle_miroirs.png` |
| c9_confidentes | Les liens tissés | `naiah_hylee_confidentes_reconnues=true` | c9_29 | `keyscenes/chapter9/c9_key_confidentes_retrouvailles.png` |
| c9_chaines_glace | Les épreuves | `rem_c9_force_chains=true` | c9_39 | `keyscenes/chapter9/c9_key_chaines_ombre.png` |
| c9_chaines_runes | Les épreuves | `rem_c9_read_runes=true` | c9_39 | `keyscenes/chapter9/c9_key_chaines_ombre.png` |
| c9_chaines_regard | Les épreuves | `rem_c9_shared_gaze=true` | c9_39 | `keyscenes/chapter9/c9_key_chaines_ombre.png` |
| c10i_culte (rare) | Les destins croisés | `amanea_respecte_lucidite_iriana=true` | c10_19_beat2 | `backgrounds/iriana/iriana_corridor.png` |
| c11i_respect (rare) | Les destins croisés | `c11iAmaneaLuciBonus=true` | c11i_choice_lucidite_bonus | `backgrounds/iriana/iriana_music_room.png` |
| c12i_meche (rare) | Les destins croisés | `c12iAnchoredInMemory=true` | c12i_choice_meche | `backgrounds/chapter12/x12i_tia_hall_before_02.png` |
| c13i_verite_pacte (rare) | Les destins croisés | `c13iWantedBloodlessPact=true` | c13i_choice_truth | `backgrounds/iriana/iriana_music_room.png` |
| c13i_verite_doute (rare) | Les destins croisés | `c13iAdmittedUncertainty=true` | c13i_choice_truth | `backgrounds/iriana/iriana_music_room.png` |
| c13i_verite_avant (rare) | Les destins croisés | `c13iAdmittedPriorChoice=true` | c13i_choice_truth | `backgrounds/iriana/iriana_music_room.png` |
| c13i_verite_monstre (rare) | Les destins croisés | `c13iTruthWithoutDefense=true` | c13i_choice_truth | `backgrounds/iriana/iriana_music_room.png` |
| c13i_depart_silence (rare) | Les destins croisés | `c13iLeftInSilence=true` | c13i_choice_depart | `keyscenes/chapter13_i/c13i_key_portal_departure.png` |
| c13i_depart_pardon (rare) | Les destins croisés | `c13iApologizedWithoutDemand=true` | c13i_choice_depart | `keyscenes/chapter13_i/c13i_key_portal_departure.png` |
| c13i_depart_regard (rare) | Les destins croisés | `c13iReadFinalSilence=true` | c13i_choice_depart | `keyscenes/chapter13_i/c13i_key_portal_departure.png` |
| c13i_depart_promesse (rare) | Les destins croisés | `c13iPromisedNotToForget=true` | c13i_choice_depart | `keyscenes/chapter13_i/c13i_key_portal_departure.png` |
| c10g_iriana_confiance (rare) | Les destins croisés | `c10gTrustIriana=true` | c10g_choice_iriana | `backgrounds/chapter10/group_v2/c10g_prison.png` |
| c10g_iriana_isolement (rare) | Les destins croisés | `c10gSuspectsAmaneaManipulation=true` | c10g_choice_iriana | `backgrounds/chapter10/group_v2/c10g_prison.png` |
| c10g_iriana_remerii (rare) | Les destins croisés | `c10gAnchoredToRemerii=true` | c10g_choice_iriana | `backgrounds/chapter10/group_v2/c10g_prison.png` |
| c10g_iriana_vide (rare) | Les destins croisés | `c10gFeltIrianaAbsence=true` | c10g_choice_iriana | `backgrounds/chapter10/group_v2/c10g_prison.png` |
| c10g_naiah_promesse (rare) | Les liens tissés | `c10gProtectNaiah=true` | c10g_choice_naiah | `backgrounds/chapter10/group_v2/c10g_archives_profondes.png` |
| c10g_naiah_lucide (rare) | Les liens tissés | `c10gNaiahPragmaticReturn=true` | c10g_choice_naiah | `backgrounds/chapter10/group_v2/c10g_archives_profondes.png` |
| c10g_naiah_ecoute (rare) | Les liens tissés | `c10gHearsNaiahFear=true` | c10g_choice_naiah | `backgrounds/chapter10/group_v2/c10g_archives_profondes.png` |
| c10g_naiah_choix (rare) | Les liens tissés | `c10gNaiahKeepsChoice=true` | c10g_choice_naiah | `backgrounds/chapter10/group_v2/c10g_archives_profondes.png` |
| c11g_tenue (rare) | Les liens tissés | `c11gTenueHyleeAssumee=true` | c11g_choice_tenue | `keyscenes/chapter11_g/c11g_key_hylee_tenue.png` |
| c11g_pacte (rare) | Les liens tissés | `c11gPacteSilencieuxRemerii=true` | c11g_choice_glace | `backgrounds/chapter11/group_vn/c11g_quartiers_suite.png` |
| c13g_danse_cercle (rare) | Les liens tissés | `c13gHyleeSharedRhythm=true` | c13g_choice_danse | `backgrounds/chapter12/group/c12g_bg_bal_grand.png` |
| c13g_danse_defi (rare) | Les liens tissés | `c13gHyleeChallengedValurnDance=true` | c13g_choice_danse | `backgrounds/chapter12/group/c12g_bg_bal_grand.png` |
| c13g_danse_regard (rare) | Les liens tissés | `c13gHyleeRecenteredRemerii=true` | c13g_choice_danse | `backgrounds/chapter12/group/c12g_bg_bal_grand.png` |
| c13g_danse_cadence (rare) | Les liens tissés | `c13gHyleeWoveGroupCadence=true` | c13g_choice_danse | `backgrounds/chapter12/group/c12g_bg_bal_grand.png` |
| c13g_discours_preparation (rare) | Les épreuves | `c13gHyleeAcceptedWarPreparation=true` | c13g_choice_discours | `keyscenes/chapter12/group/c12g_key_tia_entree.png` |
| c13g_discours_place (rare) | Les épreuves | `c13gHyleeClaimedPlaceInWar=true` | c13g_choice_discours | `keyscenes/chapter12/group/c12g_key_tia_entree.png` |
| c13g_discours_banniere (rare) | Les épreuves | `c13gHyleeReadTiaCoalition=true` | c13g_choice_discours | `keyscenes/chapter12/group/c12g_key_tia_entree.png` |
| c13g_discours_salle (rare) | Les épreuves | `c13gHyleeFeltBallroomResolve=true` | c13g_choice_discours | `keyscenes/chapter12/group/c12g_key_tia_entree.png` |
| c13g_nuit_simple (rare) | Les liens tissés | `c13gHyleeAskedNightPlainly=true` | c13g_choice_nuit | `backgrounds/chapter12/group/c12g_bg_bal_grand.png` |
| c13g_nuit_porte (rare) | Les liens tissés | `c13gHyleeRefusedClosedDoor=true` | c13g_choice_nuit | `backgrounds/chapter12/group/c12g_bg_bal_grand.png` |
| c13g_nuit_attente (rare) | Les liens tissés | `c13gHyleeReadRemeriiWaiting=true` | c13g_choice_nuit | `backgrounds/chapter12/group/c12g_bg_bal_grand.png` |
| c13g_nuit_presence (rare) | Les liens tissés | `c13gHyleeFollowedRemeriiPresence=true` | c13g_choice_nuit | `backgrounds/chapter12/group/c12g_bg_bal_grand.png` |
| c14g_prep_remerii (rare) | Les liens tissés | `c14GroupPreparedWithRemerii=true` | c14_g_choice_prep | `keyscenes/chapter14/c14_cg_group_remerii.png` |
| c14g_prep_draven (rare) | Les liens tissés | `c14GroupRetreatPlan=true` | c14_g_choice_prep | `keyscenes/chapter14/c14_cg_group_draven.png` |
| c14g_prep_naiah (rare) | Les liens tissés | `c14GroupNaiahScouting=true` | c14_g_choice_prep | `keyscenes/chapter14/c14_cg_group_naiah.png` |
| c14g_prep_repos (rare) | Les liens tissés | `c14GroupRested=true` | c14_g_choice_prep | `keyscenes/chapter14/c14_cg_group_rest.png` |
| c15_passe_riposte | Les épreuves | `c15TrainingRiposte=true` | c15_train_choice | `keyscenes/chapter15/c15_training_02_duel.png` |
| c15_passe_feinte | Les épreuves | `c15TrainingFeint=true` | c15_train_choice | `keyscenes/chapter15/c15_training_03_feinte.png` |
| c15_passe_attente | Les épreuves | `c15TrainingWait=true` | c15_train_choice | `keyscenes/chapter15/c15_training_02_duel.png` |
| c15_colonne_draven | Les liens tissés | `c15WalkedWithDraven=true` | c15_walk_choice | `chemin_ensorcele_foret.png` |
| c15_colonne_naiah | Les liens tissés | `c15AskedNaiahRoute=true` | c15_walk_choice | `chemin_ensorcele_foret.png` |
| c15_colonne_remerii | Les liens tissés | `c15WalkedWithRemerii=true` | c15_walk_choice | `chemin_ensorcele_foret.png` |
| c16_ligne_repli | Les épreuves | `s01AssaultTactic="repli"` | c16_choix_assaut | `backgrounds/chapter16/c16_lisiere_assaut.webp` |
| c16_ligne_breche | Les épreuves | `s01AssaultTactic="breche"` | c16_choix_assaut | `backgrounds/chapter16/c16_lisiere_assaut.webp` |
| c16_ancrage_etoile | Les liens tissés | `s01HyleeAnchor="etoile"` | c16_choix_ancrage | `keyscenes/chapter16/c16_etoile_detail.webp` |
| c16_ancrage_voix | Les liens tissés | `s01HyleeAnchor="voix"` | c16_choix_ancrage | `keyscenes/chapter16/c16_etoile_detail.webp` |
| c17_regard_demendras | Les derniers choix | `s02Regard="demendras"` | c17_choix_regard | `chapter4/c4v_akuhn_citadel.png` |
| c17_regard_remerii | Les derniers choix | `s02Regard="remerii"` | c17_choix_regard | `chapter4/c4v_akuhn_citadel.png` |
| c17_adieu_confiance | Les derniers choix | `s02Adieu="confiance"` | c17_choix_adieu | `backgrounds/finale/bg_porte_noire_plaine.png` |
| c17_adieu_peur | Les derniers choix | `s02Adieu="peur"` | c17_choix_adieu | `backgrounds/finale/bg_porte_noire_plaine.png` |
| s06_lineva_promesse (rare) | Les derniers choix | `s06LinevaWords="promesse"` + `s06DravenComplete=true` | c18_dp_lineva | `keyscenes/chapter18-s06/s06_04_je_rentre_bientot.webp`<br>`keyscenes/chapter18-s06/s06_05_epee_relevee.webp` |
| s06_lineva_mere (rare) | Les derniers choix | `s06LinevaWords="mere"` + `s06DravenComplete=true` | c18_dp_lineva | `keyscenes/chapter18-s06/s06_04_je_rentre_bientot.webp`<br>`keyscenes/chapter18-s06/s06_05_epee_relevee.webp` |
| s06_lineva_fierte (rare) | Les derniers choix | `s06LinevaWords="fierte"` + `s06DravenComplete=true` | c18_dp_lineva | `keyscenes/chapter18-s06/s06_04_je_rentre_bientot.webp`<br>`keyscenes/chapter18-s06/s06_05_epee_relevee.webp` |
| s07_renversement_retenir (rare) | Les derniers choix | `s07Renversement="retenir"` + `s07IrianaComplete=true` | c18_ip_renversement | `keyscenes/chapter18-s07/s07_21_victoire_pyrrhique.webp`<br>`keyscenes/chapter18-s07/s07_23_le_saut.webp` |
| s07_renversement_mort (rare) | Les derniers choix | `s07Renversement="mort"` + `s07IrianaComplete=true` | c18_ip_renversement | `keyscenes/chapter18-s07/s07_21_victoire_pyrrhique.webp`<br>`keyscenes/chapter18-s07/s07_23_le_saut.webp` |
| s07_renversement_question (rare) | Les derniers choix | `s07Renversement="question"` + `s07IrianaComplete=true` | c18_ip_renversement | `keyscenes/chapter18-s07/s07_21_victoire_pyrrhique.webp`<br>`keyscenes/chapter18-s07/s07_23_le_saut.webp` |
| s07_renversement_tresse (rare) | Les derniers choix | `s07Renversement="tresse"` + `s07IrianaComplete=true` | c18_ip_renversement | `keyscenes/chapter18-s07/s07_21_victoire_pyrrhique.webp`<br>`keyscenes/chapter18-s07/s07_23_le_saut.webp` |
| s08_reponse_seule | Les derniers choix | `s08Reponse="seule"` + `s08BlizzardComplete=true` | c18_choix_hylee | `backgrounds/finale/bg_porte_noire_blizzard.png`<br>`keyscenes/chapter18-s08/s08_20_hylee_soutient_remerii.webp` |
| s08_reponse_main | Les derniers choix | `s08Reponse="main"` + `s08BlizzardComplete=true` | c18_choix_hylee | `backgrounds/finale/bg_porte_noire_blizzard.png`<br>`keyscenes/chapter18-s08/s08_20_hylee_soutient_remerii.webp` |
| s08_dragon_portail | Les derniers choix | `s08Dragon="portail"` + `s08BlizzardComplete=true` | c18_bh_dragon | `keyscenes/chapter18-s08/s08_19_le_choc_des_colosses.webp` |
| s08_dragon_gorge | Les derniers choix | `s08Dragon="gorge"` + `s08BlizzardComplete=true` | c18_bh_dragon | `keyscenes/chapter18-s08/s08_19_le_choc_des_colosses.webp` |
| s08_dragon_tenir | Les derniers choix | `s08Dragon="tenir"` + `s08BlizzardComplete=true` | c18_bh_dragon | `keyscenes/chapter18-s08/s08_19_le_choc_des_colosses.webp` |
| commun_porte_noire (commun) | Les épreuves | `s02PorteNoireComplete=true` | c17_moisson | `backgrounds/finale/bg_porte_noire_plaine.png` |
| commun_blizzard (commun) | Les derniers choix | `s08BlizzardComplete=true` | c18_fin | `keyscenes/chapter18-s08/s08_18_le_dragon_prend_forme.webp` |

## Conditions non vérifiées

- Aucune condition de sélection n’est hypothétique : toutes ont une source dans un choix de l’index actuel. Les flags `s0xComplete` sont posés à la sortie victorieuse de chaque branche du final.
- Non vérifiable automatiquement : la justesse littéraire de chaque phrase face au ressenti de l’auteur. Les textes sont modifiables dans le catalogue sans toucher au code (augmenter `CATALOG_VERSION` si les conditions changent).
