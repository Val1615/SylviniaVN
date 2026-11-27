/* Mode Histoire · Générique de fin du Tome I · « Votre Chronique »
   Catalogue des souvenirs et sélection locale, déterministe, sans appel réseau.
   Module séparé du lecteur : il se charge aussi dans Node pour les tests (test/story-generique.test.cjs).

   Règle d’or : aucun souvenir n’est affiché sans preuve qu’il appartient à la partie.
   Une preuve, ici, est un flag posé par un choix du joueur (valeur exacte), jamais un flag de chapitre
   « Complete » que la carte des chapitres peut accorder sans que la scène ait été vécue.
   Le tableau de correspondance lisible est dans docs/production/generique_chronique_audit.md.

   v2 (v0.430) : la chronique retranscrit la totalité du parcours prouvé, chapitre par chapitre :
   souvenirs illustrés du catalogue (sans plafond), choix réellement cliqués (journal de parcours),
   choix reconstitués à partir des flags qu’un seul choix du jeu peut poser, souvenirs de Progression. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.SylviniaChronique = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  const CATALOG_VERSION = 2;

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


  /* ---------- v2 : le parcours complet, chapitre par chapitre ---------- */
  // Copie de repli de la carte des chapitres (le jeu fournit CHAPTER_SELECT_DATA, prioritaire).
  const CHAPTERS = [
    ['intro', 'Introduction', 'L’Auberge du Forestier', 'assets/images/chapter_select/chapter_intro.png'],
    ['ch1', 'Chapitre I', 'Une convocation impériale', 'assets/images/chapter_select/chapter_1.png'],
    ['ch2', 'Chapitre II', 'Sur la route d’Al’Gratal', 'assets/images/chapter_select/chapter_2.png'],
    ['ch3', 'Chapitre III', 'Préparatifs pour une nouvelle aventure', 'assets/images/chapter_select/chapter_3.png'],
    ['ch4', 'Chapitre IV', 'Croisée des récits', 'assets/images/chapter_select/chapter_4.png'],
    ['ch5', 'Chapitre V', 'Une rencontre hors du temps', 'assets/images/chapter_select/chapter_5.png'],
    ['ch6', 'Chapitre VI', 'Une Parenthèse au Cœur de Mir’Aldas', 'assets/images/chapter_select/chapter_6.png'],
    ['ch7', 'Chapitre VII', 'Du Chaos aux Ombres', 'assets/images/chapter_select/chapter_7.png'],
    ['ch8', 'Chapitre VIII', 'Un sombre conseiller', 'assets/images/chapter_select/chapter_8.png'],
    ['ch9', 'Chapitre IX', 'L’heure du départ', 'assets/images/chapter_select/chapter_9.png'],
    ['ch10', 'Chapitre X', 'Deux perspectives', 'assets/images/chapter_select/ch10_routes.png'],
    ['ch11_i', 'Chapitre XI_I', 'Amie ou ennemie ?', 'assets/images/chapter_select/chapter_11_i.png'],
    ['ch11_g', 'Chapitre XI_G', 'Le Bal des Élus', 'assets/images/chapter_select/chapter_11_g.png'],
    ['ch12_i', 'Chapitre XII_I', 'Le souvenir d’Amanea', 'assets/images/chapter_select/chapter_12_i.png'],
    ['ch12_g', 'Chapitre XII_G', 'La fête bat son plein', 'assets/images/chapter_select/chapter_12_g.png'],
    ['ch13_i', 'Chapitre XIII_I', 'Une dernière trahison', 'assets/images/chapter_select/ch13_i_piano.png'],
    ['ch13_g', 'Chapitre XIII_G', 'Le Bal des Élus : Dénouement', 'assets/images/chapter_select/ch13_g_romance.png'],
    ['ch14', 'Chapitre XIV', 'Le Conseil de Guerre', 'assets/images/chapter_select/ch14_conseil.png'],
    ['ch15', 'Chapitre XV', 'L’heure du départ', 'assets/images/keyscenes/chapter15/c15_briefing_01_camp.png'],
    ['ch16', 'Chapitre XVI', 'L’assaut des morts-vivants', 'assets/images/keyscenes/chapter16/c16_premier_choc.webp'],
    ['ch17', 'Chapitre XVII', 'La Porte Noire', 'assets/images/keyscenes/chapter17-s02/s02_05_porte_maitre.webp'],
    ['ch18', 'Chapitre XVIII', 'Début de la fin', 'assets/images/backgrounds/finale/bg_porte_noire_blizzard.png'],
    ['ch19', 'Épilogue', 'Tome I', 'assets/images/backgrounds/iriana/iriana_throneroom.png'],
  ].map(([key, label, title, image]) => ({ key, label, title, image }));
  const CHAPTER_KEYS = CHAPTERS.map((c) => c.key);
  const MEMORY_BUCKET = { key: 'souvenirs', label: 'Ils se souviendront', title: 'Ce que les autres ont retenu', image: '' };
  const OTHER_BUCKET = { key: 'autres', label: 'Hors des chapitres', title: 'Autres pages de votre voyage', image: '' };

  function chapterOf(sceneId) {
    const sid = String(sceneId || '');
    if (/^intro/.test(sid)) return 'intro';
    if (/^(p\d|s\d|duel|ending)/.test(sid)) return 'ch1';
    if (/^x12i/.test(sid)) return 'ch12_i';
    const m = /^c(\d+)([a-z])?/.exec(sid);
    if (!m) return null;
    const n = Number(m[1]);
    const key = n >= 11 && n <= 13 && (m[2] === 'g' || m[2] === 'i') ? `ch${n}_${m[2]}` : `ch${n}`;
    return CHAPTER_KEYS.includes(key) ? key : null;
  }

  // Ne prouvent pas un choix : marqueurs de chapitre, relectures, manches de duel réinitialisées, outils.
  const IGNORED_FLAG = /(Complete|Played|Seen|Unlocked|Available)$|^c18Played|^finaleSeen|^s04(M\d|Qte)|^tome1|^finaleReplay|^dev/i;
  // Ne sont pas des décisions : navigation, reprises, Game Over, portes de développement, manches de duel.
  const TRIVIAL_LABEL = /^(continuer|poursuivre|commencer|recommencer|réessayer|retour|retourner|revenir|rejouer|passer|forcer la variante|voir cette nuit depuis)/i;
  const IGNORED_SCENE = /gameover|game_over|_bad_|_dev_|dev_gate|_retry|_qte|duel_|_m\d+$|^duel/i;
  const IGNORED_TITLE = /game over|terminé$/i;

  const cleanText = (v) => String(v == null ? '' : v).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const resolve = (v, ctx) => { try { return cleanText(typeof v === 'function' ? v.call(ctx) : v); } catch (_e) { return ''; } };
  const cleanLabel = (label) => cleanText(label).replace(/^Choix (stratégique|bonus|secret|rare)\s*:\s*/i, '');
  const sceneContext = (scene) => {
    const t = resolve(scene && scene.title, scene);
    if (!t || IGNORED_TITLE.test(t)) return '';
    if (/^(Chapitre|Introduction|Épilogue)\b/i.test(t)) { const parts = t.split(' · '); return parts.length > 1 ? '' : ''; }
    return t;
  };
  const isDecisionScene = (sid, scene) => Boolean(scene && Array.isArray(scene.choices) && scene.choices.length >= 2 && !IGNORED_SCENE.test(sid) && !IGNORED_TITLE.test(resolve(scene.title, scene)));

  /* Choix marquants (v0.431, durée visée ≈ 6 min) : une décision n’entre dans la chronique que si elle a laissé
     une trace durable. Poids déterministe :
       branche de route (le choix mène à un autre volume, ou flag de route)  +100
       souvenir de Progression accordé                                         +40
       flag narratif à variantes (valeur texte : réponse, posture, regard…)   +30
       choix du final (chapitres XVII à l’Épilogue)                            +20
       flag narratif simple (vrai)                                             +10
     Poids nul (aucun flag durable, aucun souvenir) : choix mineur, écarté. Puis, par chapitre, on garde
     les MAX_DECISIONS_PER_CHAPTER plus lourdes (égalité : ordre du livre).
     Repère de chapitre : un chapitre traversé qui n’a ni choix marquant ni souvenir garde sa première décision
     prouvée (ordre du livre), pour que la structure chapitre par chapitre reste entière. Rien sans preuve :
     un chapitre sans aucune décision prouvée n’apparaît pas. */
  const MAX_DECISIONS_PER_CHAPTER = 3;
  const FINAL_CHAPTERS = new Set(['ch17', 'ch18', 'ch19']);
  function markWeight(sid, scene, label) {
    const c = (scene.choices || []).find((x) => x && cleanLabel(resolve(x.label, x)) === label);
    if (!c) return 0;
    const flagsSet = isObj(c.flags) ? Object.entries(c.flags).filter(([k, v]) => !IGNORED_FLAG.test(k) && v !== false && v !== null && v !== undefined && v !== '' && v !== 0) : [];
    const mems = c.memories ? [].concat(c.memories).filter(Boolean) : [];
    if (!flagsSet.length && !mems.length) return 0;
    let w = 0;
    const here = chapterOf(sid);
    const there = typeof c.next === 'string' ? chapterOf(c.next) : null;
    const branches = new Set((scene.choices || []).map((x) => (x && typeof x.next === 'string' ? chapterOf(x.next) : null)).filter(Boolean));
    if ((there && there !== here && branches.size > 1) || flagsSet.some(([k]) => /route|Started$/i.test(k))) w += 100;
    if (mems.length) w += 40;
    if (flagsSet.some(([, v]) => typeof v === 'string')) w += 30;
    if (FINAL_CHAPTERS.has(here)) w += 20;
    if (flagsSet.length) w += 10;
    return w;
  }

  // Index des flags posés par un seul libellé de choix du jeu : flag=valeur -> { sid, label }.
  function choiceIndex(scenes) {
    const byPair = new Map();
    for (const [sid, scene] of Object.entries(scenes || {})) {
      if (!isDecisionScene(sid, scene)) continue;
      for (const c of scene.choices) {
        if (!c || !isObj(c.flags)) continue;
        const label = cleanLabel(resolve(c.label, c));
        if (!label || TRIVIAL_LABEL.test(label)) continue;
        for (const [k, v] of Object.entries(c.flags)) {
          if (IGNORED_FLAG.test(k) || v === false || v === null || v === undefined || v === '' || v === 0) continue;
          const pair = k + '=' + JSON.stringify(v);
          const list = byPair.get(pair) || [];
          list.push({ sid, label, memories: c.memories });
          byPair.set(pair, list);
        }
      }
    }
    const out = new Map();
    for (const [pair, list] of byPair) if (new Set(list.map((x) => x.label)).size === 1) out.set(pair, list[0]);
    return out;
  }
  // Scène du choix qui accorde chaque souvenir de Progression.
  function memorySources(scenes) {
    const out = new Map();
    for (const [sid, scene] of Object.entries(scenes || {})) {
      if (!scene || !Array.isArray(scene.choices)) continue;
      for (const c of scene.choices) {
        const keys = c && c.memories ? (Array.isArray(c.memories) ? c.memories : [c.memories]) : [];
        for (const k of keys) if (!out.has(k)) out.set(k, sid);
      }
    }
    return out;
  }

  // Preuves gardées dans la capture : flags de choix (valeurs simples) et souvenirs de Progression.
  function evidenceOf(source) {
    const flags = isObj(source && source.flags) ? source.flags : {};
    const out = {};
    for (const [k, v] of Object.entries(flags)) {
      if (IGNORED_FLAG.test(k) && !EVIDENCE_KEYS.includes(k)) continue;
      if (v === undefined || v === null || v === false || v === '' || v === 0) continue;
      if (typeof v === 'string' || typeof v === 'number' || v === true) out[k] = v;
    }
    return out;
  }

  function selectAll(source) {
    const ev = normalize(isObj(source) && isObj(source.flags) ? source : { flags: source || {} });
    const bestByGroup = new Map();
    for (const entry of ENTRIES) {
      if (!eligible(entry, ev)) continue;
      const cur = bestByGroup.get(entry.group);
      if (!cur || entry.priority > cur.priority || (entry.priority === cur.priority && entry.id < cur.id)) bestByGroup.set(entry.group, entry);
    }
    return [...bestByGroup.values()].sort((a, b) => (a.chapterOrder - b.chapterOrder) || (a.id < b.id ? -1 : 1));
  }

  /* chronicle(source, ctx)
     source : { flags, memories }  (état du moteur ou preuve figée)
     ctx    : { scenes (S), memoryDefs (PROGRESSION_MEMORIES), chapters (CHAPTER_SELECT_DATA), trail [[sid, libellé]], journal [[sid, libellé]] }
     Rend : [{ key, label, title, image, items: [souvenir | choix | memoire] }] dans l’ordre du livre. */
  function chronicle(source, ctx = {}, opts = {}) {
    const complet = Boolean(opts.complet); // Ma Chronique (Progression) : toutes les décisions prouvées, sans filtre ni plafond
    const scenes = ctx.scenes || {};
    const order = new Map(Object.keys(scenes).map((k, i) => [k, i]));
    const pos = (sid) => (order.has(sid) ? order.get(sid) : 1e6);
    const flagsEv = evidenceOf(source);
    const buckets = new Map();
    const push = (key, item) => { key = key || OTHER_BUCKET.key; if (!buckets.has(key)) buckets.set(key, []); buckets.get(key).push(item); };
    const coveredScenes = new Set();
    const coveredPairs = new Set();

    // 1. Souvenirs illustrés du catalogue : tous ceux que la sauvegarde prouve, un par groupe.
    const curated = selectAll({ flags: flagsEv });
    const personal = curated.filter((x) => !x.common);
    for (const x of personal) {
      coveredScenes.add(x.scene);
      for (const [k, v] of Object.entries(x.requires.flags || {})) coveredPairs.add(k + '=' + JSON.stringify(v));
      push(chapterOf(x.scene), { kind: 'souvenir', id: x.id, group: x.group, category: x.category, categoryLabel: CATEGORIES[x.category], title: x.title, text: x.text, backgrounds: x.backgrounds.slice(0, 3), scene: x.scene, at: pos(x.scene), order: x.chapterOrder });
    }

    // 2. Choix réellement cliqués (journal de parcours), puis 3. choix prouvés par un flag qu’un seul libellé peut poser.
    const seen = new Set();
    const addChoice = (sid, label, how) => {
      label = cleanLabel(label);
      if (!sid || !label || TRIVIAL_LABEL.test(label)) return;
      const scene = scenes[sid];
      if (scene && !isDecisionScene(sid, scene)) return;
      if (!scene && IGNORED_SCENE.test(sid)) return;
      if (coveredScenes.has(sid)) return;
      const weight = scene ? markWeight(sid, scene, label) : (how === 'flag' ? 10 : 0);
      const key = sid + '|' + label;
      if (seen.has(key)) return;
      if ([...seen].some((s) => s.startsWith(sid + '|'))) return; // une décision par écran (la dernière connue)
      seen.add(key);
      push(chapterOf(sid), { kind: 'choix', scene: sid, context: sceneContext(scene), label, how, at: pos(sid), weight });
    };
    const trail = Array.isArray(ctx.trail) ? ctx.trail : [];
    for (let i = trail.length - 1; i >= 0; i--) { const t = trail[i]; if (Array.isArray(t)) addChoice(t[0], t[1], 'parcours'); }
    const index = choiceIndex(scenes);
    for (const [k, v] of Object.entries(flagsEv)) {
      const pair = k + '=' + JSON.stringify(v);
      if (coveredPairs.has(pair)) continue;
      const hit = index.get(pair);
      if (hit) addChoice(hit.sid, hit.label, 'flag');
    }
    const journal = Array.isArray(ctx.journal) ? ctx.journal : [];
    for (let i = journal.length - 1; i >= 0; i--) { const t = journal[i]; if (Array.isArray(t)) addChoice(t[0], t[1], 'journal'); }

    // 4. Souvenirs de Progression gagnés dans la partie (textes du jeu).
    const defs = ctx.memoryDefs || {};
    const mems = Array.isArray(source && source.memories) ? source.memories : [];
    const memSrc = memorySources(scenes);
    for (const k of [...new Set(mems)]) {
      const d = defs[k]; if (!d) continue;
      const sid = memSrc.get(k);
      push(chapterOf(sid) || MEMORY_BUCKET.key, { kind: 'memoire', id: k, title: cleanText(d.title), text: cleanText(d.body), type: cleanText(d.type), at: sid ? pos(sid) + 0.5 : 1e6 });
    }

    // Plafond par chapitre des décisions (les souvenirs illustrés et de Progression restent tous).
    // Choix mineurs (poids nul) écartés, sauf le repère d’un chapitre qui n’aurait sinon plus rien.
    if (!complet) for (const [k, list] of buckets) {
      const choices = list.filter((x) => x.kind === 'choix');
      const marked = choices.filter((x) => x.weight > 0).sort((a, b) => (b.weight - a.weight) || (a.at - b.at));
      const keep = new Set(marked.slice(0, MAX_DECISIONS_PER_CHAPTER));
      if (!keep.size && choices.length && !list.some((x) => x.kind !== 'choix')) {
        const first = choices.slice().sort((a, b) => a.at - b.at)[0];
        first.repere = true; keep.add(first);
      }
      buckets.set(k, list.filter((x) => x.kind !== 'choix' || keep.has(x)));
      if (!buckets.get(k).length) buckets.delete(k);
    }

    // 7. Partie peu documentée : repères communs confirmés.
    const total = [...buckets.values()].reduce((n, l) => n + l.length, 0);
    if (total < 6) for (const x of curated.filter((y) => y.common)) push(chapterOf(x.scene), { kind: 'souvenir', id: x.id, group: x.group, category: x.category, categoryLabel: CATEGORIES[x.category], title: x.title, text: x.text, backgrounds: x.backgrounds.slice(0, 3), scene: x.scene, at: pos(x.scene), order: x.chapterOrder, common: true });

    const meta = new Map(CHAPTERS.map((c) => [c.key, c]));
    for (const c of Array.isArray(ctx.chapters) ? ctx.chapters : []) if (c && c.key && meta.has(c.key)) meta.set(c.key, { key: c.key, label: cleanText(c.label) || meta.get(c.key).label, title: cleanText(c.title) || meta.get(c.key).title, image: c.image || meta.get(c.key).image });
    meta.set(MEMORY_BUCKET.key, MEMORY_BUCKET); meta.set(OTHER_BUCKET.key, OTHER_BUCKET);
    const kindRank = { souvenir: 0, choix: 1, memoire: 2 };
    return [...CHAPTER_KEYS, OTHER_BUCKET.key, MEMORY_BUCKET.key].filter((k) => buckets.has(k)).map((k) => ({
      ...meta.get(k),
      items: buckets.get(k).sort((a, b) => (a.at - b.at) || (kindRank[a.kind] - kindRank[b.kind]) || ((a.order || 0) - (b.order || 0))),
    }));
  }

  function captureV2(source, ctx = {}, meta = {}) {
    const evidence = evidenceOf(source);
    const memories = [...new Set(Array.isArray(source && source.memories) ? source.memories : [])];
    const chapters = chronicle({ flags: evidence, memories }, ctx);
    const complet = chronicle({ flags: evidence, memories }, ctx, { complet: true });
    return {
      v: 2,
      catalog: CATALOG_VERSION,
      game: meta.game || '',
      at: meta.at || '',
      provenance: meta.provenance || 'partie',
      evidence,
      memories,
      chapters,
      entries: chapters.flatMap((c) => c.items.filter((x) => x.kind === 'souvenir')),
      counts: { chapitres: chapters.length, rubriques: chapters.reduce((n, c) => n + c.items.length, 0) },
      complet,
      countsComplet: { chapitres: complet.length, rubriques: complet.reduce((n, c) => n + c.items.length, 0) },
    };
  }

  return { MAX_DECISIONS_PER_CHAPTER, markWeight, CATALOG_VERSION, CATEGORIES, QUOTAS, MAX_ENTRIES, ENTRIES, EVIDENCE_KEYS, IMG, CHAPTERS, normalize, select, selectAll, capture, captureV2, chronicle, chapterOf, choiceIndex, evidenceOf };
});
