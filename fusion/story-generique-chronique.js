/* Mode Histoire · Générique de fin du Tome I · « Votre Chronique »
   Catalogue des souvenirs et sélection locale, déterministe, sans appel réseau.
   Module séparé du lecteur : il se charge aussi dans Node pour les tests (test/story-generique.test.cjs).

   Règle d’or : aucun souvenir n’est affiché sans preuve qu’il appartient à la partie.
   Une preuve, ici, est un flag posé par un choix du joueur (valeur exacte), jamais un flag de chapitre
   « Complete » que la carte des chapitres peut accorder sans que la scène ait été vécue.
   Le tableau de correspondance lisible est dans docs/production/generique_chronique_audit.md. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.SylviniaChronique = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  const CATALOG_VERSION = 1;

  const CATEGORIES = {
    premiers_pas: 'Les premiers pas',
    liens: 'Les liens tissés',
    epreuves: 'Les épreuves',
    destins: 'Les destins croisés',
    derniers: 'Les derniers choix',
  };
  // Équilibre de départ : 3 + 4 + 3 + 3 + 4, plafonné à 16. Ajustable sans toucher au lecteur.
  const QUOTAS = { premiers_pas: 3, liens: 4, epreuves: 3, destins: 3, derniers: 4 };
  const MAX_ENTRIES = 16;
  const MIN_TARGET = 10;

  const IMG = {
    clairiere: 'assets/images/clairiere_magique.png',
    loup: 'assets/images/keyscenes/c2_forest_intro.png',
    portes: 'assets/images/keyscenes/c2_algratal_gate.png',
    catacombes: 'assets/images/catacombes_sanctuaire.png',
    robe: 'assets/images/chapter3/c3_key_robe_miroir.png',
    atelier: 'assets/images/chapter3/c3_atelier_arcanique.png',
    testRemerii: 'assets/images/chapter3/c3_key_test_remerii.png',
    campNuit: 'assets/images/chapter3/c3_camp_nuit.png',
    croisee: 'assets/images/keyscenes/c4_key_03.png',
    ruines: 'assets/images/chapter4/c4v_ruins_circle.png',
    warroom: 'assets/images/chapter4/c4d_warroom_sunset.png',
    bhaalOmbre: 'assets/images/keyscenes/c4v_key_50.png',
    troneInfernal: 'assets/images/chapter4/c4v_infernal_throne.png',
    dravenLineva: 'assets/images/keyscenes/c4d_key_07.png',
    dravenReponse: 'assets/images/keyscenes/c4d_key_19.png',
    miroirs: 'assets/images/chapter5/c5_salle_miroirs.png',
    confidentes: 'assets/images/keyscenes/chapter9/c9_key_confidentes_retrouvailles.png',
    chaines: 'assets/images/keyscenes/chapter9/c9_key_chaines_ombre.png',
    irianaCouloir: 'assets/images/backgrounds/iriana/iriana_corridor.png',
    prison: 'assets/images/backgrounds/chapter10/group_v2/c10g_prison.png',
    archives: 'assets/images/backgrounds/chapter10/group_v2/c10g_archives_profondes.png',
    quartiers: 'assets/images/backgrounds/chapter11/group_vn/c11g_quartiers_suite.png',
    tenue: 'assets/images/keyscenes/chapter11_g/c11g_key_hylee_tenue.png',
    salleMusique: 'assets/images/backgrounds/iriana/iriana_music_room.png',
    meche: 'assets/images/backgrounds/chapter12/x12i_tia_hall_before_02.png',
    bal: 'assets/images/backgrounds/chapter12/group/c12g_bg_bal_grand.png',
    tiaEntree: 'assets/images/keyscenes/chapter12/group/c12g_key_tia_entree.png',
    depart: 'assets/images/keyscenes/chapter13_i/c13i_key_portal_departure.png',
    prepRemerii: 'assets/images/keyscenes/chapter14/c14_cg_group_remerii.png',
    prepDraven: 'assets/images/keyscenes/chapter14/c14_cg_group_draven.png',
    prepNaiah: 'assets/images/keyscenes/chapter14/c14_cg_group_naiah.png',
    prepRepos: 'assets/images/keyscenes/chapter14/c14_cg_group_rest.png',
    entrainement: 'assets/images/keyscenes/chapter15/c15_training_02_duel.png',
    feinte: 'assets/images/keyscenes/chapter15/c15_training_03_feinte.png',
    foret: 'assets/images/chemin_ensorcele_foret.png',
    lisiere: 'assets/images/backgrounds/chapter16/c16_lisiere_assaut.webp',
    etoile: 'assets/images/keyscenes/chapter16/c16_etoile_detail.webp',
    citadelle: 'assets/images/chapter4/c4v_akuhn_citadel.png',
    porteNoire: 'assets/images/backgrounds/finale/bg_porte_noire_plaine.png',
    jeRentre: 'assets/images/keyscenes/chapter18-s06/s06_04_je_rentre_bientot.webp',
    epeeRelevee: 'assets/images/keyscenes/chapter18-s06/s06_05_epee_relevee.webp',
    victoirePyrrhique: 'assets/images/keyscenes/chapter18-s07/s07_21_victoire_pyrrhique.webp',
    leSaut: 'assets/images/keyscenes/chapter18-s07/s07_23_le_saut.webp',
    blizzard: 'assets/images/backgrounds/finale/bg_porte_noire_blizzard.png',
    soutient: 'assets/images/keyscenes/chapter18-s08/s08_20_hylee_soutient_remerii.webp',
    colosses: 'assets/images/keyscenes/chapter18-s08/s08_19_le_choc_des_colosses.webp',
    dragon: 'assets/images/keyscenes/chapter18-s08/s08_18_le_dragon_prend_forme.webp',
  };

  const ENTRIES = [];
  // e(id, ordre narratif, groupe exclusif, catégorie, flags exigés, titre, texte, fonds, options)
  // options.scene : scène où le choix est fait (preuve et contexte de l’image) ; options.chars : personnages concernés.
  const e = (id, chapterOrder, group, category, flags, title, text, backgrounds, opt = {}) => ENTRIES.push({
    id, chapterOrder, group, category, requires: { flags }, title, text, backgrounds,
    priority: opt.prio ?? 50, rare: !!opt.rare, common: !!opt.common, chars: opt.chars || [], scene: opt.scene || '', adult: false, validated: true,
  });
  // Variantes exclusives d’un même choix : une entrée par valeur, même groupe.
  const variants = (base, order, group, category, flag, map, title, backgrounds, opt) => {
    for (const [value, text] of Object.entries(map)) e(`${base}_${value}`, order, group, category, { [flag]: value }, title, text, backgrounds, opt);
  };
  const quand = (_unused, prefix, map, order, group, category, title, backgrounds, opt) => {
    for (const [suffix, [flagKey, text]] of Object.entries(map)) e(`${prefix}_${suffix}`, order, group, category, { [flagKey]: true }, title, text, backgrounds, opt);
  };

  /* ---------- Chapitre II : la route d’Al’Gratal ---------- */
  variants('c2_ruisseau', 205, 'c2_ruisseau', 'premiers_pas', 'streamAngle', {
    fear: 'Au bord du ruisseau scintillant, vous avez avoué votre peur à Remerii, sans la laisser décider à votre place.',
    alone: 'Au bord du ruisseau scintillant, vous avez demandé à Remerii comment on apprend la magie quand on est seule.',
    strength: 'Au bord du ruisseau scintillant, vous avez confié à Remerii que vous vouliez simplement devenir plus forte.',
  }, 'Le ruisseau scintillant', [IMG.clairiere], { prio: 40, chars: ['remerii'], scene: 'c2_05' });

  variants('c2_gardien', 207, 'c2_gardien', 'premiers_pas', 'wolfApproach', {
    still: 'Face au loup sylvain, gardien de la forêt, vous l’avez laissé respirer le premier, parfaitement immobile.',
    trust: 'Face au loup sylvain, gardien de la forêt, vous avez cherché le regard de Remerii.',
    hand: 'Face au loup sylvain, gardien de la forêt, vous avez tendu une main apaisante.',
    barrier: 'Face au loup sylvain, gardien de la forêt, vous avez dressé une barrière sans attaquer.',
  }, 'Le gardien de la forêt', [IMG.loup], { prio: 78, chars: ['remerii'], scene: 'c2_07' });

  variants('c2_portes', 212, 'c2_portes', 'premiers_pas', 'gateReaction', {
    down: 'Devant les portes d’Al’Gratal, sous les regards qui humiliaient, vous avez baissé les yeux pour traverser.',
    fists: 'Devant les portes d’Al’Gratal, sous les regards qui humiliaient, vous avez serré les poings sans un mot.',
    ask: 'Devant les portes d’Al’Gratal, sous les regards qui humiliaient, vous avez demandé pourquoi Remerii ne faisait rien.',
    intervene: 'Devant les portes d’Al’Gratal, sous les regards qui humiliaient, vous avez fait un pas pour intervenir.',
  }, 'Les portes d’Al’Gratal', [IMG.portes], { prio: 72, chars: ['remerii'], scene: 'c2_12' });

  variants('c2_valurn', 223, 'c2_valurn', 'premiers_pas', 'valurnRead', {
    fascine: 'À votre première rencontre avec Valurn Sael, vous avez senti le danger derrière son sourire.',
    mistrust: 'À votre première rencontre avec Valurn Sael, vous vous êtes méfiée de lui sur-le-champ.',
    remerii: 'À votre première rencontre avec Valurn Sael, vous avez observé la réaction de Remerii plutôt que la sienne.',
  }, 'Le sourire de Valurn', [IMG.catacombes], { prio: 55, chars: ['valurn'], scene: 'c2_23' });

  /* ---------- Chapitre III : préparatifs (« Remerii se souviendra ») ---------- */
  e('c3_robe', 307, 'c3_robe', 'liens', { remeriiSeSouviendraAssurance: true }, 'La robe bleue',
    'Dans la boutique enchantée, vous vous êtes tenue droite dans la robe bleue, sans chercher à disparaître. Remerii en a gardé le souvenir.',
    [IMG.robe], { prio: 70, chars: ['remerii'], scene: 'c3_07' });
  e('c3_baton', 310, 'c3_baton', 'premiers_pas', { batonCerisierAccorde: true, remeriiSeSouviendraBaton: true }, 'Le bâton de cerisier',
    'À l’Atelier Arcanique, vous avez écouté le bâton avant de le choisir, et le bois de cerisier vous a répondu.',
    [IMG.atelier], { prio: 74, chars: ['remerii'], scene: 'c3_10' });
  e('c3_clairiere', 325, 'c3_clairiere', 'epreuves', { remeriiSeSouviendraMaitrise: true }, 'La clairière gelée',
    'Après le test brutal de Remerii, vous avez compris qu’elle éprouvait votre survie, pas votre obéissance.',
    [IMG.testRemerii], { prio: 72, chars: ['remerii'], scene: 'c3_25' });
  e('c3_medig', 330, 'c3_medig', 'liens', { medigSerment: true }, 'La messagère entre les mondes',
    'Près du feu de camp, vous avez pris au sérieux la présence de Medig, la chouette messagère entre les mondes.',
    [IMG.campNuit], { prio: 58, chars: ['remerii', 'medig'], scene: 'c3_30' });
  e('c3_patience', 335, 'c3_patience', 'liens', { remeriiSeSouviendraPatience: true }, 'Pourquoi m’aider ?',
    'Au camp de nuit, vous avez respecté le silence de Remerii au lieu de lui arracher la vérité.',
    [IMG.campNuit], { prio: 66, chars: ['remerii'], scene: 'c3_35' });

  /* ---------- Chapitre IV : croisée des récits ---------- */
  e('c4_route_valurn', 403, 'c4_route_valurn', 'destins', { route4VStarted: true }, 'Croisée des récits',
    'Quand le fil s’est divisé, vous avez suivi Valurn vers les secrets d’Akuhn’Nabad.',
    [IMG.croisee, IMG.ruines], { prio: 62, rare: true, chars: ['valurn'], scene: 'c4_03' });
  e('c4_route_draven', 403.5, 'c4_route_draven', 'destins', { route4DStarted: true }, 'Croisée des récits',
    'Quand le fil s’est divisé, vous avez suivi Draven jusqu’aux quartiers sylviniens et à Lineva.',
    [IMG.croisee, IMG.warroom], { prio: 62, rare: true, chars: ['draven'], scene: 'c4_03' });
  quand(null, 'c4v_bhaal', {
    defie: ['valurn_defie_bhaal', 'Dans la peau de Valurn, face à l’ombre de son père, vous avez déclaré que Bhaal n’était pas votre maître.'],
    masque: ['valurn_masque_bhaal', 'Dans la peau de Valurn, face à l’ombre de son père, vous avez répondu que l’obéissance n’exclut pas la stratégie.'],
  }, 450, 'c4v_bhaal', 'destins', 'L’ombre paternelle', [IMG.bhaalOmbre, IMG.troneInfernal], { prio: 64, rare: true, chars: ['valurn'], scene: 'c4v_50' });
  quand(null, 'c4d_pere', {
    pere: ['draven_pere_dabord', 'Dans la peau de Draven, vous avez d’abord demandé à Lineva comment elle tenait.'],
    amiral: ['draven_amiral_dabord', 'Dans la peau de Draven, vous avez d’abord exigé de Lineva le rapport militaire.'],
    crainte: ['draven_avoue_crainte', 'Dans la peau de Draven, vous avez avoué à Lineva que vous craigniez son silence.'],
  }, 407, 'c4d_pere', 'destins', 'Père ou amiral ?', [IMG.dravenLineva], { prio: 64, rare: true, chars: ['draven', 'lineva'], scene: 'c4d_07' });
  quand(null, 'c4d_lineva', {
    pere: ['draven_pere_lineva', 'Dans la peau de Draven, vous avez répondu à Lineva en père : « Toi aussi, tu me manques. »'],
    amiral: ['lineva_durcie', 'Dans la peau de Draven, vous avez répondu à Lineva en amiral : « Tiens jusqu’à mon retour. »'],
    verite: ['draven_ne_ment_pas', 'Dans la peau de Draven, vous avez refusé de mentir à Lineva sur les renforts.'],
  }, 418, 'c4d_lineva', 'destins', 'Répondre à Lineva', [IMG.dravenReponse], { prio: 60, rare: true, chars: ['draven', 'lineva'], scene: 'c4d_18' });

  /* ---------- Chapitres V et IX ---------- */
  e('c5_reflet', 530, 'c5_reflet', 'epreuves', { c5_reflet_grave: true }, 'Un de vos avenirs',
    'Dans la salle des miroirs de Mir’Aldas, vous avez gravé dans votre mémoire le reflet d’un de vos avenirs.',
    [IMG.miroirs], { prio: 66, chars: ['saidin'], scene: 'c5_30' });
  e('c9_confidentes', 929, 'c9_confidentes', 'liens', { naiah_hylee_confidentes_reconnues: true }, 'Les confidentes de l’Auberge',
    'Devant Naïah et son royaume d’ombres, vous avez rappelé les nuits où vous vous confiiez l’une à l’autre.',
    [IMG.confidentes], { prio: 76, chars: ['naiah'], scene: 'c9_29' });
  quand(null, 'c9_chaines', {
    glace: ['rem_c9_force_chains', 'Prise dans les chaînes d’ombre, vous avez tenté de les geler malgré tout.'],
    runes: ['rem_c9_read_runes', 'Prise dans les chaînes d’ombre, vous avez observé les runes qui buvaient votre magie.'],
    regard: ['rem_c9_shared_gaze', 'Prise dans les chaînes d’ombre, vous avez cherché Remerii du regard.'],
  }, 939, 'c9_chaines', 'epreuves', 'Magie étouffée', [IMG.chaines], { prio: 60, chars: ['remerii', 'naiah'], scene: 'c9_39' });

  /* ---------- Route Iriana (X à XIII) ---------- */
  e('c10i_culte', 1019, 'c10i_culte', 'destins', { amanea_respecte_lucidite_iriana: true }, 'Nommer le culte',
    'Dans la peau d’Iriana, vous avez reconnu qu’un équilibre peut employer l’Ombre sans lui obéir.',
    [IMG.irianaCouloir], { prio: 60, rare: true, chars: ['iriana', 'amanea'], scene: 'c10_19_beat2' });
  e('c11i_respect', 1110, 'c11i_respect', 'destins', { c11iAmaneaLuciBonus: true }, 'Ce qu’elle respecte',
    'Dans la peau d’Iriana, vous avez rappelé à Amanea que vous n’aviez pas confondu usage et adoration.',
    [IMG.salleMusique], { prio: 56, rare: true, chars: ['iriana', 'amanea'], scene: 'c11i_choice_lucidite_bonus' });
  e('c12i_meche', 1201, 'c12i_meche', 'destins', { c12iAnchoredInMemory: true }, 'La mèche ancienne',
    'Dans la peau d’Iriana, vous vous êtes ancrée dans le présent avant de toucher la mèche et le souvenir d’Amanea.',
    [IMG.meche], { prio: 66, rare: true, chars: ['iriana', 'amanea'], scene: 'c12i_choice_meche' });
  quand(null, 'c13i_verite', {
    pacte: ['c13iWantedBloodlessPact', 'Face à Amanea, vous avez avoué : « Je voulais un pacte sans sacrifice ni bain de sang. »'],
    doute: ['c13iAdmittedUncertainty', 'Face à Amanea, vous avez avoué ne plus distinguer ce que vous vouliez de ce qu’on attendait de vous.'],
    avant: ['c13iAdmittedPriorChoice', 'Face à Amanea, vous avez avoué : « J’avais déjà choisi avant de te connaître. »'],
    monstre: ['c13iTruthWithoutDefense', 'Face à Amanea, vous avez avoué : « Je voulais que tu sois un monstre, pour que te trahir reste propre. »'],
  }, 1320, 'c13i_verite', 'destins', 'Ce qu’elle voulait vraiment', [IMG.salleMusique], { prio: 80, rare: true, chars: ['iriana', 'amanea'], scene: 'c13i_choice_truth' });
  quand(null, 'c13i_depart', {
    silence: ['c13iLeftInSilence', 'Au dernier pas, vous êtes partie sans imposer à Amanea une dernière parole.'],
    pardon: ['c13iApologizedWithoutDemand', 'Au dernier pas, vous avez seulement dit à Amanea : « Je suis désolée. »'],
    regard: ['c13iReadFinalSilence', 'Au dernier pas, vous avez observé ce qu’Amanea choisissait de ne plus montrer.'],
    promesse: ['c13iPromisedNotToForget', 'Au dernier pas, vous avez promis à Amanea : « Je n’oublierai pas ce que j’ai fait ici. »'],
  }, 1330, 'c13i_depart', 'destins', 'Le dernier pas', [IMG.depart], { prio: 74, rare: true, chars: ['iriana', 'amanea'], scene: 'c13i_choice_depart' });

  /* ---------- Route Groupe (X à XIV) ---------- */
  quand(null, 'c10g_iriana', {
    confiance: ['c10gTrustIriana', 'Dans les geôles de la Cité Noire, vous avez refusé de croire qu’Iriana céderait.'],
    isolement: ['c10gSuspectsAmaneaManipulation', 'Dans les geôles de la Cité Noire, vous avez compris que l’isolement d’Iriana était une arme.'],
    remerii: ['c10gAnchoredToRemerii', 'Dans les geôles de la Cité Noire, séparée d’Iriana, vous avez cherché le regard de Remerii.'],
    vide: ['c10gFeltIrianaAbsence', 'Dans les geôles de la Cité Noire, vous avez écouté le vide laissé par la magie d’Iriana.'],
  }, 1030, 'c10g_iriana', 'destins', 'Iriana derrière une autre porte', [IMG.prison], { prio: 52, rare: true, chars: ['iriana'], scene: 'c10g_choice_iriana' });
  quand(null, 'c10g_naiah', {
    promesse: ['c10gProtectNaiah', 'Dans les archives profondes, vous avez promis à Naïah qu’elle ne serait pas abandonnée.'],
    lucide: ['c10gNaiahPragmaticReturn', 'Dans les archives profondes, vous avez rappelé à Naïah que personne ne serait en sécurité à Al’Gratal.'],
    ecoute: ['c10gHearsNaiahFear', 'Dans les archives profondes, vous avez reconnu la peur de Naïah sans la corriger.'],
    choix: ['c10gNaiahKeepsChoice', 'Dans les archives profondes, vous avez laissé Naïah choisir au dernier instant.'],
  }, 1040, 'c10g_naiah', 'liens', 'La peur de Naïah', [IMG.archives], { prio: 64, rare: true, chars: ['naiah'], scene: 'c10g_choice_naiah' });
  e('c11g_tenue', 1126, 'c11g_tenue', 'liens', { c11gTenueHyleeAssumee: true }, 'Le pavillon d’apparat',
    'Pour le Bal des Élus, vous avez choisi une tenue qui ne trahissait pas qui vous étiez.',
    [IMG.tenue], { prio: 54, rare: true, chars: [], scene: 'c11g_choice_tenue' });
  e('c11g_pacte', 1117, 'c11g_pacte', 'liens', { c11gPacteSilencieuxRemerii: true }, 'Un pacte silencieux',
    'Quand le silence avec Remerii avait l’épaisseur d’une porte fermée, vous l’avez changé en pacte silencieux.',
    [IMG.quartiers], { prio: 78, rare: true, chars: ['remerii'], scene: 'c11g_choice_glace' });
  quand(null, 'c13g_danse', {
    cercle: ['c13gHyleeSharedRhythm', 'Au bal, vous avez ralenti juste assez pour ramener Remerii dans le cercle.'],
    defi: ['c13gHyleeChallengedValurnDance', 'Au bal, vous vous êtes interposée et avez défié Valurn de suivre vraiment.'],
    regard: ['c13gHyleeRecenteredRemerii', 'Au bal, vous avez vu que Remerii riait, mais qu’elle avait déjà été rejetée hors du duel.'],
    cadence: ['c13gHyleeWoveGroupCadence', 'Au bal, vous avez écouté les pas jusqu’à trouver un rythme où personne ne disparaissait.'],
  }, 1310, 'c13g_danse', 'liens', 'Le rythme de la danse', [IMG.bal], { prio: 70, rare: true, chars: ['remerii', 'valurn', 'naiah'], scene: 'c13g_choice_danse' });
  quand(null, 'c13g_discours', {
    preparation: ['c13gHyleeAcceptedWarPreparation', 'Quand l’Impératrice a étendu la guerre à toutes les nations, vous avez accepté les deux jours comme une préparation, pas comme un répit.'],
    place: ['c13gHyleeClaimedPlaceInWar', 'Quand l’Impératrice a étendu la guerre à toutes les nations, vous avez murmuré qu’il n’était plus besoin de vous convaincre de vous battre.'],
    banniere: ['c13gHyleeReadTiaCoalition', 'Quand l’Impératrice a étendu la guerre à toutes les nations, vous avez compris que Tia construisait une bannière.'],
    salle: ['c13gHyleeFeltBallroomResolve', 'Quand l’Impératrice a étendu la guerre à toutes les nations, vous avez senti la peur et la défiance traverser la salle.'],
  }, 1320, 'c13g_discours', 'epreuves', 'Ce que la guerre réclame', [IMG.tiaEntree], { prio: 58, rare: true, chars: ['tia'], scene: 'c13g_choice_discours' });
  quand(null, 'c13g_nuit', {
    simple: ['c13gHyleeAskedNightPlainly', 'Deux nuits avant la guerre, vous avez formulé une demande simple à Remerii, sans cacher votre nervosité.'],
    porte: ['c13gHyleeRefusedClosedDoor', 'Deux nuits avant la guerre, vous avez décidé de ne plus laisser une porte se refermer entre Remerii et vous.'],
    attente: ['c13gHyleeReadRemeriiWaiting', 'Deux nuits avant la guerre, vous avez compris que Remerii attendait que vous preniez l’initiative.'],
    presence: ['c13gHyleeFollowedRemeriiPresence', 'Deux nuits avant la guerre, vous avez suivi dans le couloir le calme familier de la magie de Remerii.'],
  }, 1340, 'c13g_nuit', 'liens', 'Ce que vous avez demandé à la nuit', [IMG.bal], { prio: 74, rare: true, chars: ['remerii'], scene: 'c13g_choice_nuit' });
  quand(null, 'c14g_prep', {
    remerii: ['c14GroupPreparedWithRemerii', 'Avant l’aube du départ, vous vous êtes entraînée une dernière fois avec Remerii.'],
    draven: ['c14GroupRetreatPlan', 'Avant l’aube du départ, vous avez aidé Draven à préparer des voies de repli.'],
    naiah: ['c14GroupNaiahScouting', 'Avant l’aube du départ, vous avez demandé à Naïah de vérifier discrètement le passage.'],
    repos: ['c14GroupRested', 'Avant l’aube du départ, vous avez choisi de dormir et de garder vos forces.'],
  }, 1420, 'c14g_prep', 'liens', 'Avant l’aube', null, { prio: 50, rare: true, scene: 'c14_g_choice_prep' });

  /* ---------- Chapitres XV et XVI ---------- */
  quand(null, 'c15_passe', {
    riposte: ['c15TrainingRiposte', 'Pour la dernière passe, vous avez glissé sous l’attaque de Remerii et rendu le coup aussitôt.'],
    feinte: ['c15TrainingFeint', 'Pour la dernière passe, vous avez gelé le sol sous les pieds de Remerii au lieu de la viser.'],
    attente: ['c15TrainingWait', 'Pour la dernière passe, vous avez attendu une fraction de seconde de trop, pour voir ce que Remerii préparait.'],
  }, 1505, 'c15_passe', 'epreuves', 'Une dernière passe', null, { prio: 56, chars: ['remerii'], scene: 'c15_train_choice' });
  quand(null, 'c15_colonne', {
    draven: ['c15WalkedWithDraven', 'Dans la colonne vers la Forêt Interdite, vous avez ralenti jusqu’à Draven.'],
    naiah: ['c15AskedNaiahRoute', 'Dans la colonne vers la Forêt Interdite, vous avez demandé à Naïah ce qu’elle pensait du chemin.'],
    remerii: ['c15WalkedWithRemerii', 'Dans la colonne vers la Forêt Interdite, vous êtes restée avec Remerii, à économiser votre souffle.'],
  }, 1530, 'c15_colonne', 'liens', 'Dans la colonne', [IMG.foret], { prio: 48, scene: 'c15_walk_choice' });
  variants('c16_ligne', 1610, 'c16_ligne', 'epreuves', 's01AssaultTactic', {
    repli: 'Quand la ligne s’est ouverte face aux morts-vivants, vous avez guidé le soldat derrière le mur.',
    breche: 'Quand la ligne s’est ouverte face aux morts-vivants, vous avez tendu la main au soldat.',
  }, 'Une ouverture dans la ligne', [IMG.lisiere], { prio: 64, scene: 'c16_choix_assaut' });
  variants('c16_ancrage', 1640, 'c16_ancrage', 'liens', 's01HyleeAnchor', {
    etoile: 'Après l’assaut, pour reprendre pied, vous avez gardé l’étoile serrée au creux de la main.',
    voix: 'Après l’assaut, pour reprendre pied, vous vous êtes calée sur la voix de Remerii.',
  }, 'Reprendre pied', [IMG.etoile], { prio: 68, chars: ['remerii'], scene: 'c16_choix_ancrage' });

  /* ---------- Chapitre XVII, XVIII : la Porte Noire et Bhaal ---------- */
  variants('c17_regard', 1705, 'c17_regard', 'derniers', 's02Regard', {
    demendras: 'Un instant avant la marche vers la Porte Noire, vous avez observé Démendras.',
    remerii: 'Un instant avant la marche vers la Porte Noire, vous êtes restée près de Remerii.',
  }, 'Un instant avant la marche', [IMG.citadelle], { prio: 50, scene: 'c17_choix_regard' });
  variants('c17_adieu', 1720, 'c17_adieu', 'derniers', 's02Adieu', {
    confiance: 'Devant la Porte Noire, vous avez serré l’étoile et cru à la promesse de Remerii.',
    peur: 'Devant la Porte Noire, vous avez murmuré le nom de Remerii, trop tard.',
  }, 'Ce que vous n’avez pas dit', [IMG.porteNoire], { prio: 90, chars: ['remerii'], scene: 'c17_choix_adieu' });
  // Points de vue du carrefour : la variante ET l’achèvement de la branche, restaurés de la vraie partie après une relecture.
  for (const [value, text] of Object.entries({
    promesse: 'Dans la peau de Draven, à la dernière seconde, vous avez promis à Lineva ce qu’elle voulait entendre.',
    mere: 'Dans la peau de Draven, à la dernière seconde, vous avez confié à Lineva le souvenir de sa mère.',
    fierte: 'Dans la peau de Draven, à la dernière seconde, vous avez dit à Lineva que vous étiez fier d’elle.',
  })) e(`s06_lineva_${value}`, 1806, 's06_lineva', 'derniers', { s06LinevaWords: value, s06DravenComplete: true }, 'Je rentre bientôt', text,
    [IMG.jeRentre, IMG.epeeRelevee], { prio: 84, rare: true, chars: ['draven', 'lineva'], scene: 'c18_dp_lineva' });
  for (const [value, text] of Object.entries({
    retenir: 'Dans la peau d’Iriana, face à Alamma qui reculait vers la faille, vous l’avez enserré d’ombres.',
    mort: 'Dans la peau d’Iriana, face à Alamma qui reculait vers la faille, vous avez lancé un trait de magie mortifère.',
    question: 'Dans la peau d’Iriana, face à Alamma qui reculait vers la faille, vous avez exigé une réponse.',
    tresse: 'Dans la peau d’Iriana, face à Alamma qui reculait vers la faille, vous avez tressé les trois forces autour de votre Arcane.',
  })) e(`s07_renversement_${value}`, 1807, 's07_renversement', 'derniers', { s07Renversement: value, s07IrianaComplete: true }, 'Le renversement', text,
    [IMG.victoirePyrrhique, IMG.leSaut], { prio: 84, rare: true, chars: ['iriana', 'alamma'], scene: 'c18_ip_renversement' });
  for (const [value, text] of Object.entries({
    seule: 'Face à la tempête, vous avez dit à Remerii : « Je ne te laisse pas seule. »',
    main: 'Face à la tempête, vous avez tendu la main à Remerii, sans un mot.',
  })) e(`s08_reponse_${value}`, 1808, 's08_reponse', 'derniers', { s08Reponse: value, s08BlizzardComplete: true }, 'Dans la tempête', text,
    [IMG.blizzard, IMG.soutient], { prio: 92, chars: ['remerii'], scene: 'c18_choix_hylee' });
  for (const [value, text] of Object.entries({
    portail: 'Quand le dragon de glace et le démon se sont affrontés, vous avez repoussé Bhaal vers le portail.',
    gorge: 'Quand le dragon de glace et le démon se sont affrontés, vous avez visé la gorge de Bhaal.',
    tenir: 'Quand le dragon de glace et le démon se sont affrontés, vous avez ménagé Remerii pour tenir la ligne.',
  })) e(`s08_dragon_${value}`, 1812, 's08_dragon', 'derniers', { s08Dragon: value, s08BlizzardComplete: true }, 'Le dragon de glace', text,
    [IMG.colosses], { prio: 76, chars: ['remerii', 'bhaal'], scene: 'c18_bh_dragon' });

  /* ---------- Repères communs confirmés (scènes du final effectivement traversées) ---------- */
  e('commun_porte_noire', 1701, 'commun_porte_noire', 'epreuves', { s02PorteNoireComplete: true }, 'La Porte Noire',
    'Vous avez marché jusqu’à la Porte Noire, aux côtés de ceux qui avaient choisi de la fermer.',
    [IMG.porteNoire], { prio: 20, common: true, scene: 'c17_moisson' });
  e('commun_blizzard', 1810, 'commun_blizzard', 'derniers', { s08BlizzardComplete: true }, 'Le blizzard',
    'Vous avez traversé le blizzard de Remerii jusqu’au bout de la nuit.',
    [IMG.dragon], { prio: 22, common: true, scene: 'c18_fin' });

  // Fonds par défaut des groupes qui varient (une image propre à chaque variante).
  const VARIANT_BG = {
    c14g_prep_remerii: [IMG.prepRemerii], c14g_prep_draven: [IMG.prepDraven], c14g_prep_naiah: [IMG.prepNaiah], c14g_prep_repos: [IMG.prepRepos],
    c15_passe_riposte: [IMG.entrainement], c15_passe_feinte: [IMG.feinte], c15_passe_attente: [IMG.entrainement],
  };
  for (const entry of ENTRIES) if (!entry.backgrounds) entry.backgrounds = VARIANT_BG[entry.id] || [];

  /* ---------- Sélection ---------- */
  const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);

  // 1. Capture immuable et normalisée : seuls les flags lus par le catalogue sont copiés.
  const EVIDENCE_KEYS = [...new Set(ENTRIES.flatMap((x) => Object.keys(x.requires.flags || {})))].sort();
  function normalize(source) {
    const flags = isObj(source && source.flags) ? source.flags : {};
    const out = {};
    for (const k of EVIDENCE_KEYS) {
      const v = flags[k];
      if (v === undefined || v === null || v === false || v === '') continue; // absente ≠ négative : on n’en déduit rien
      if (typeof v === 'string' || v === true) out[k] = v;
    }
    return Object.freeze(out);
  }

  // 2. Filtre sur valeurs exactes.
  const eligible = (entry, ev) => entry.validated && Object.entries(entry.requires.flags || {}).every(([k, v]) => ev[k] === v);

  // 4. Score : pertinence et importance, rareté établie, diversité des personnages. Jamais la morale.
  const score = (entry, picked) => {
    const main = entry.chars[0];
    const repeats = main ? picked.filter((p) => p.chars[0] === main).length : 0;
    return entry.priority + (entry.rare ? 6 : 0) - repeats * 8;
  };
  const byScore = (picked) => (a, b) => (score(b, picked) - score(a, picked)) || (a.id < b.id ? -1 : 1);

  function select(source, opts = {}) {
    // Accepte un état du moteur ({ flags }) ou une preuve déjà normalisée (capture relue).
    const ev = normalize(isObj(source) && isObj(source.flags) ? source : { flags: source || {} });
    const max = opts.max || MAX_ENTRIES;
    // 3. Une seule variante par groupe d’événements (la plus prioritaire, puis l’identifiant).
    const bestByGroup = new Map();
    for (const entry of ENTRIES) {
      if (!eligible(entry, ev)) continue;
      const cur = bestByGroup.get(entry.group);
      if (!cur || entry.priority > cur.priority || (entry.priority === cur.priority && entry.id < cur.id)) bestByGroup.set(entry.group, entry);
    }
    const pool = [...bestByGroup.values()];
    const personal = pool.filter((x) => !x.common);
    const commons = pool.filter((x) => x.common);
    const picked = [];
    // 5. Répartition par catégorie, puis complément jusqu’à la cible si des souvenirs prouvés restent.
    for (const cat of Object.keys(CATEGORIES)) {
      const candidates = personal.filter((x) => x.category === cat);
      for (let i = 0; i < QUOTAS[cat] && candidates.length; i++) {
        candidates.sort(byScore(picked));
        picked.push(candidates.shift());
      }
    }
    let rest = personal.filter((x) => !picked.includes(x));
    while (picked.length < MIN_TARGET && rest.length) { rest.sort(byScore(picked)); picked.push(rest.shift()); }
    // 7. Partie peu documentée : quelques repères communs confirmés, sans jamais inventer de choix.
    if (picked.length < 6) for (const c of commons.sort((a, b) => a.chapterOrder - b.chapterOrder)) picked.push(c);
    while (picked.length > max) { picked.sort(byScore([])); picked.pop(); }
    // 6. Ordre narratif.
    picked.sort((a, b) => (a.chapterOrder - b.chapterOrder) || (a.id < b.id ? -1 : 1));
    return picked.map((x) => ({ id: x.id, group: x.group, category: x.category, categoryLabel: CATEGORIES[x.category], title: x.title, text: x.text, backgrounds: x.backgrounds.slice(0, 3), order: x.chapterOrder, common: x.common }));
  }

  function capture(source, meta = {}) {
    const evidence = normalize(source);
    const entries = select({ flags: evidence });
    return {
      v: 1,
      catalog: CATALOG_VERSION,
      game: meta.game || '',
      at: meta.at || '',
      provenance: meta.provenance || 'partie',
      evidence: { ...evidence },
      entries,
    };
  }

  return { CATALOG_VERSION, CATEGORIES, QUOTAS, MAX_ENTRIES, ENTRIES, EVIDENCE_KEYS, IMG, normalize, select, capture };
});
