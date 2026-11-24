/* Mode Histoire · Chapitre XVII · La Porte Noire (séquences S02 à S05) */
(() => {
  'use strict';

  const title = 'La Porte Noire';
  const chapter = 'Chapitre XVII · ' + title;
  const start = 'c17_rassemblement';

  // Décors fournis par l’auteur pour le final (copiés à l’identique, voir docs/production/finale_assets_manifest.json).
  Object.assign(A, {
    finale_bg_porte_noire_plaine: 'assets/images/backgrounds/finale/bg_porte_noire_plaine.png',
    finale_bg_porte_noire_blizzard: 'assets/images/backgrounds/finale/bg_porte_noire_blizzard.png',
    finale_bg_champ_bataille: 'assets/images/backgrounds/finale/bg_champ_bataille.png',
    finale_bg_akuhn_nabad_ravin: 'assets/images/backgrounds/finale/bg_akuhn_nabad_ravin.png',
  });
  const BG_AKUHN = 'c4v_akuhn_citadel';
  const BG_FOREST = 'c7_bg_foret_racines';
  const BG_PORTE = 'finale_bg_porte_noire_plaine';
  const BG_CHAMP = 'finale_bg_champ_bataille';

  const M_TENSION = 'music_tension';
  const M_HORREUR = 'music_c10_horreur';
  const M_PORTAIL = 'music_c10_group_portal';
  const M_AMANEA = 'music_c13i_amanea_reine_noire';
  const M_COMBAT = 'music_c3_combat_ombres';
  const M_DUEL = 'music_duel';
  const M_TRAGEDIE = 'music_c10_amanea';
  // « Amanea, Final destination » (OST fournie par l’auteur, copiée à l’identique) : de la bascule du duel
  // (Puissance révélée, c17_revelation) jusqu’à la fin du Chapitre XVII. Le Game Over garde M_TRAGEDIE.
  // Fichier et codex : fusion/story-finale-media.js.
  const M_FINAL_AMANEA = 'music_finale_amanea';

  const hyleeShaken = ['hylee', 'hylee2_sad', 'left'];
  const hylee = ['hylee', 'hylee2_determined', 'left'];
  const remerii = ['remerii', 'remerii_strict', 'right'];
  const remeriiSad = ['remerii', 'remerii_sad', 'right'];
  const remeriiSoft = ['remerii', 'remerii_soft', 'right'];
  const saidin = ['saidin', 'saidin_mysterious', 'center'];
  const iriana = ['iriana', 'iriana_stern', 'left'];
  const irianaTroubled = ['iriana', 'iriana_troubled_alone', 'left'];
  const valurn = ['valurn', 'valurn_neutral', 'right'];
  const valurnAmused = ['valurn', 'valurn_amused', 'right'];
  const valurnAnnoyed = ['valurn', 'valurn_annoyed', 'right'];
  const draven = ['draven', 'draven_stern', 'left'];
  const dravenAngry = ['draven', 'draven_angry', 'left'];
  const dravenSoot = ['draven', 'draven_gruff', 'left'];
  const amanea = ['amanea', 'amanea_menacing', 'right'];
  const amaneaAngry = ['amanea', 'amanea_angry', 'right'];
  const amaneaTerrifying = ['amanea', 'amanea_terrifying', 'right'];
  const naiahHard = ['naiah', 'naiah_menacing', 'right'];
  const naiahCold = ['naiah', 'naiah_neutral', 'center'];
  // Tia adulte : sprites de la Chronique Alternative (fichiers CA référencés tels quels).
  const tia = (e, pos = 'right') => ['tia', 'finale_tia_' + e, pos, 'finale-k'];

  const scene = (sub, bg, music, speaker, text, next, chars = []) => ({
    title: chapter, sub, bg, music, speaker, text, next, chars,
  });
  const flags = () => state.flags || {};

  // Duel S04 : jauges et QTE gérés par fusion/story-finale-duels.js (calculés depuis les flags s04M1…s04Qte).
  const calc = (step) => window.SylviniaFinaleDuels ? window.SylviniaFinaleDuels.calc('s04', step) : { valurn: 10, amanea: 10, power: 0, temps: 0 };
  const RESET_S04 = { s04M1: null, s04M2: null, s04M3: null, s04M4: null, s04M5: null, s04Qte: null };
  const ds = (sub, text, next, chars, step, extra = {}) => ({
    ...scene(sub, BG_PORTE, step >= 4 ? M_FINAL_AMANEA : M_DUEL, 'Narrateur', text, next, chars), fduel: 's04', fstep: step, pov: 'valurn', ...extra,
  });
  const dsNext = (sub, text, step, chars, ok, test) => {
    const o = ds(sub, text, null, chars, step);
    Object.defineProperty(o, 'next', { enumerable: true, configurable: true, get: () => test(calc(step)) || ok });
    return o;
  };
  const gameOver = (sub, text, step) => ({
    ...scene(sub, BG_PORTE, M_TRAGEDIE, 'Narrateur', text, null, []), title: 'Game Over', fduel: 's04', fstep: step, fgameover: true, pov: 'gameover',
    choices: [
      { label: 'Réessayer le duel', next: 'c17_duel_intro', flags: RESET_S04, skipHistory: true },
      { label: 'Retour au menu', next: 'menu' },
    ],
  });
  window.SylviniaFinale = Object.assign(window.SylviniaFinale || {}, { s04: calc });

  const outcome = (key, texts) => () => texts[flags()[key]] || texts.good;

  Object.assign(S, {
/*@SCENES@*/

    // S02 · Avant la marche : un regard (flag s02Regard)
    c17_choix_regard: {
      ...scene('Un instant avant la marche', BG_AKUHN, M_TENSION, 'Narrateur',
        `Les officiers se dispersent. Hylee a une seconde pour elle avant que la colonne ne s’ébranle.`,
        null, [hylee, remerii]),
      choices: [
        { label: 'Observer Démendras', next: 'c17_regard_demendras', flags: { s02Regard: 'demendras' } },
        { label: 'Rester près de Remerii', next: 'c17_regard_remerii', flags: { s02Regard: 'remerii' } },
      ],
    },
    c17_regard_demendras: scene('Le conseiller', BG_AKUHN, M_TENSION, 'Narrateur',
      `Démendras ne regarde pas les visages. Il replie la carte avec une lenteur exacte, coin contre coin, comme on referme un livre dont on connaît déjà la fin. Ses lunettes renvoient un instant le ciel couvert ; son masque, lui, ne laisse rien paraître.

Quand il passe près d’elle, il ne s’arrête pas. Il incline à peine la tête, un salut poli, presque distrait, puis rejoint l’Impératrice.

Hylee garde de cette seconde une impression qu’elle ne sait pas nommer. Celle d’avoir été comptée.`,
      'c17_marche', [hylee]),
    c17_regard_remerii: scene('Derrière moi', BG_AKUHN, M_TENSION, 'Narrateur',
      `Remerii ne dit rien d’abord. Elle vérifie les sangles du sac d’Hylee, puis la boucle de sa cape, puis l’étoile à son cou, comme si chaque geste pouvait encore retarder la marche.

« Tu restes derrière moi, dit-elle enfin. Quoi qu’il arrive. »

Hylee hoche la tête. Elle ne sait pas encore à quel point cette promesse va peser.`,
      'c17_marche', [hylee, remeriiSoft]),

    // S02 · Après « Je reviendrai » (flag s02Adieu, rappelé au Chapitre XVIII et dans l’Épilogue)
    c17_choix_adieu: {
      ...scene('Ce qu’elle n’a pas dit', BG_PORTE, M_COMBAT, 'Narrateur',
        `Il lui reste le goût du baiser, et une phrase qu’elle n’a pas eu le temps de dire.`,
        null, [hyleeShaken]),
      choices: [
        { label: 'Serrer l’étoile et croire à sa promesse', next: 'c17_adieu_confiance', flags: { s02Adieu: 'confiance' } },
        { label: 'Murmurer son nom, trop tard', next: 'c17_adieu_peur', flags: { s02Adieu: 'peur' } },
      ],
    },
    c17_adieu_confiance: scene('Je reviendrai', BG_PORTE, M_COMBAT, 'Narrateur',
      `Les doigts d’Hylee se referment sur le pendentif. Je reviendrai. Elle se répète les deux mots jusqu’à ce qu’ils couvrent le fracas, jusqu’à ce qu’ils deviennent un rythme, quelque chose à quoi s’accrocher quand tout le reste se dérobe.`,
      'c17_bouclier', [hyleeShaken, saidin]),
    c17_adieu_peur: scene('Un nom dans le tumulte', BG_PORTE, M_COMBAT, 'Narrateur',
      `« Remerii… »

Le nom se perd dans le tumulte. Hylee la regarde partir sans elle, ce nom qu’elle n’a pas crié à temps au bord des lèvres, et la peur qui lui serre la gorge prend la forme exacte d’un regret.`,
      'c17_bouclier', [hyleeShaken, saidin]),

    // S04 · Duel : Valurn contre Amanea. Phase A (3 manches), Phase B (2 manches + QTE). Défaite canonique, Game Over si Valurn tombe trop tôt.
    c17_duel_intro: ds('Duel · Valurn contre la Reine Noire',
      `Valurn se place entre la Reine Noire et le portail. Les flammes noires lui montent le long des bras.

Avant chaque échange, le geste d’Amanea se dessine : c’est lui qu’il faut lire. Une bonne lecture entame sa garde. Une mauvaise se paie en posture.`,
      'c17_mur_de_feu', [valurn], 0, { fintro: true }),

    c17_m1_lecture: ds('Manche I · Le mur de feu',
      `Le mur de feu crépite entre eux. Amanea ne regarde pas les flammes. Ses yeux glissent d’un bord à l’autre du brasier, guettant l’endroit par lequel il va le contourner.`,
      'c17_m1', [valurn], 0),
    c17_m1: {
      ...ds('Manche I · Le mur de feu', `Elle guette les bords du brasier.`, null, [valurn], 0),
      choices: [
        { label: 'Traverser le mur en son centre', next: 'c17_m1_r', flags: { s04M1: 'good' }, best: true },
        { label: 'Lancer une sphère à travers les flammes', next: 'c17_m1_r', flags: { s04M1: 'mid' } },
        { label: 'Le contourner par la gauche', next: 'c17_m1_r', flags: { s04M1: 'bad' } },
      ],
    },
    c17_m1_r: dsNext('Manche I · Le mur de feu',
      outcome('s04M1', {
        good: 'Valurn plonge là où elle ne regarde pas. Les flammes noires le couvrent une fraction de seconde, assez pour que la griffe d’Amanea arrive trop tard. Sa lame mord la garde de la reine.',
        mid: 'La sphère traverse le brasier et éclate contre son épaule. Elle encaisse sans un cri. Le mur, lui, ne cache plus rien.',
        bad: 'Elle l’attendait sur le bord. La griffe lui ouvre le flanc avant qu’il ne change d’angle. Il se jette dans les flammes, une seconde trop tard pour la surprendre.',
      }), 1, [valurn], 'c17_tu_sais', (v) => (v.valurn <= 0 ? 'c17_gameover_a' : null)),

    c17_m2_lecture: ds('Manche II · L’onde',
      `Le poing d’Amanea descend. L’énergie s’y concentre, le sol se creuse déjà sous elle. Le coup ne vise pas Valurn : il vise la terre sur laquelle il se tient.`,
      'c17_m2', [valurnAmused], 1),
    c17_m2: {
      ...ds('Manche II · L’onde', `Le coup vise le sol, pas lui.`, null, [valurnAmused], 1),
      choices: [
        { label: 'Bondir hors du sol', next: 'c17_m2_r', flags: { s04M2: 'good' }, best: true },
        { label: 'Rompre d’un pas', next: 'c17_m2_r', flags: { s04M2: 'mid' } },
        { label: 'Encaisser sur place', next: 'c17_m2_r', flags: { s04M2: 'bad' } },
      ],
    },
    c17_m2_r: dsNext('Manche II · L’onde',
      outcome('s04M2', {
        good: 'Il quitte le sol avant que l’onde ne parte. Elle passe sous lui, et d’en haut, il voit la faille dans sa garde, là où le revers de sa griffe a laissé son flanc ouvert. Il y plante sa lame en retombant.',
        mid: 'Un pas ne suffit pas tout à fait. L’onde lui fauche une jambe ; il roule dans les cendres, mais sa lame a trouvé le bras d’Amanea au passage.',
        bad: 'L’onde le soulève comme une feuille et le jette contre la roche. Il se relève en crachant de la cendre. Elle n’a pas eu besoin de bouger.',
      }), 2, [valurnAmused], 'c17_pourquoi', (v) => (v.valurn <= 0 ? 'c17_gameover_a' : null)),

    c17_m3_lecture: ds('Manche III · La garde',
      `Entre deux échanges, Amanea ramène toujours son bras difforme contre son flanc gauche, celui que la lame a mordu. Sa garde haute, elle, reste ouverte. Et son revers arrive toujours du même côté.`,
      'c17_m3', [valurnAnnoyed], 2),
    c17_m3: {
      ...ds('Manche III · La garde', `Son flanc est couvert. Sa garde haute, non.`, null, [valurnAnnoyed], 2),
      choices: [
        { label: 'Frapper la garde haute laissée ouverte', next: 'c17_m3_r', flags: { s04M3: 'good' }, best: true },
        { label: 'Parer le revers de flammes noires et riposter', next: 'c17_m3_r', flags: { s04M3: 'parade' } },
        { label: 'Lancer une sphère entropique à bout portant', next: 'c17_m3_r', flags: { s04M3: 'bad' } },
      ],
    },
    c17_m3_r: dsNext('Manche III · La garde',
      outcome('s04M3', {
        good: 'La lame passe au-dessus du bras levé et ouvre une entaille sous la clavicule de la reine. Le sang noir fume dans l’air brûlant.',
        parade: 'Le revers arrive là où il l’attendait. La parade de flammes noires l’encaisse de plein fouet et tient. Il glisse dessous et frappe : la reine recule d’un pas.',
        bad: 'La sphère éclate contre sa paume ouverte. Amanea referme les doigts sur l’entropie comme sur une braise, et la lui renvoie en pleine poitrine.',
      }), 3, [valurnAnnoyed], 'c17_revelation', (v) => (v.valurn <= 0 || v.amanea > 6 ? 'c17_gameover_a' : null)),

    c17_revelation: ds('Une seconde jauge',
      () => {
        const { amanea } = calc(3);
        const lead = amanea <= 4
          ? 'Valurn la tient au seuil qu’il visait. Pour la première fois depuis le début du duel, la Reine Noire recule.'
          : 'Valurn l’a amenée au seuil. Sa garde se fendille. Elle ne recule pas encore.';
        return `${lead}

Puis, à côté de sa vitalité, une seconde jauge s’éveille : Puissance révélée. Elle est vide. Elle se remplit d’un coup.

Ce qu’il a pris pour sa force n’était que sa retenue.`;
      },
      'c17_cede', [valurnAnnoyed], 4, { freveal: 'power', fprev: 3 }),

    c17_m4_lecture: ds('Manche IV · Retarder',
      `Ses coups n’ont plus besoin d’être lus : ils sont trop lourds pour être parés. Chaque fois que Valurn tient sa position, la griffe l’en arrache. Chaque fois qu’il cède, elle doit le suivre.`,
      'c17_m4', [valurnAnnoyed], 4),
    c17_m4: {
      ...ds('Manche IV · Retarder', `Chaque pas qu’il cède, elle doit le suivre.`, null, [valurnAnnoyed], 4),
      choices: [
        { label: 'Céder du terrain pas à pas', next: 'c17_m4_r', flags: { s04M4: 'good' }, best: true },
        { label: 'L’attirer loin du portail', next: 'c17_m4_r', flags: { s04M4: 'mid' } },
        { label: 'Parer de flammes noires, comme tout à l’heure', next: 'c17_m4_r', flags: { s04M4: 'bad' } },
      ],
    },
    c17_m4_r: dsNext('Manche IV · Retarder',
      outcome('s04M4', {
        good: 'Il recule, encore, toujours d’un pas de moins qu’elle n’avance. Chaque pas lui coûte une seconde. Chaque seconde est pour lui.',
        mid: 'Il l’entraîne de quelques foulées vers les ruines. Elle le suit, puis s’arrête net et regarde le portail. Elle a compris la moitié du piège.',
        bad: 'La parade qui l’avait sauvé tout à l’heure se brise net. La griffe lui ouvre l’épaule. Il se relève, mais il a perdu ce que la manche aurait dû lui rapporter.',
      }), 5, [valurnAnnoyed], 'c17_m5_lecture', (v) => (v.valurn <= 0 ? 'c17_gameover_b' : null)),

    c17_m5_lecture: ds('Manche V · Encore une minute',
      `Amanea ne frappe plus pour le blesser. Elle frappe pour en finir. Ses yeux ne quittent plus le portail que pour revenir sur lui, et chaque fois, la colère y gagne sur la lucidité.`,
      'c17_m5', [valurnAnnoyed], 5),
    c17_m5: {
      ...ds('Manche V · Encore une minute', `Elle frappe pour en finir.`, null, [valurnAnnoyed], 5),
      choices: [
        { label: 'La provoquer pour l’attirer encore', next: 'c17_m5_r', flags: { s04M5: 'good' }, best: true },
        { label: 'Riposter avant qu’elle ne frappe', next: 'c17_m5_r', flags: { s04M5: 'mid' } },
        { label: 'Disparaître dans les cendres', next: 'c17_m5_r', flags: { s04M5: 'bad' } },
      ],
    },
    c17_m5_r: dsNext('Manche V · Encore une minute',
      outcome('s04M5', {
        good: '« Encore une minute, très chère. Rien qu’une. »\n\nLe sourire de Valurn la mord plus sûrement que sa lame. Elle perd un battement à vouloir l’effacer.',
        mid: 'Sa lame mord la jointure du bras difforme. Le sang noir gicle. Pour la première fois, Amanea gronde de douleur.',
        bad: 'Il se fond dans les cendres. Elle ne le cherche même pas. Elle frappe l’endroit où il va réapparaître.',
      }), 6, [valurnAnnoyed], 'c17_qte', (v) => (v.valurn <= 0 ? 'c17_gameover_b' : null)),

    c17_qte: {
      ...ds('Pivot · Le dernier coup',
        `Amanea arme le coup qui doit en finir. La griffe descend vers sa gorge, plus vite que tout ce qu’il a vu cette nuit.`,
        null, [valurnAnnoyed], 6),
      fqte: { label: 'Esquive · riposte', ms: () => 4200 + calc(6).valurn * 250, fail: 'c17_gameover_b' },
      choices: [{ label: '⚡ Esquiver et riposter', next: 'c17_qte_ok', flags: { s04Qte: 'ok' }, best: true }],
    },
    c17_qte_ok: ds('Pivot · Le dernier coup',
      `Il glisse sous la griffe d’un cheveu. Sa lame mord le poignet difforme ; Amanea recule d’un pas, un seul.

« Tu vois ? Même toi, tu saignes. »

Il a tenu. Assez longtemps pour ce qu’il attendait du portail.`,
      'c17_brise', [valurnAmused], 7),

    c17_gameover_a: gameOver('Valurn succombe',
      `Valurn n’a pas su la forcer à se révéler. La griffe d’Amanea le cloue contre la pierre noire bien avant que la reine n’ait eu besoin de puiser au fond d’elle-même.

Valurn succombe avant de forcer Amanea à se révéler.`, 3),
    c17_gameover_b: gameOver('La griffe arrive trop tôt',
      `Il voit le coup trop tard. La griffe traverse sa garde, puis sa poitrine. Il n’a pas tenu la minute qu’il lui fallait : Amanea se détourne de lui avant même qu’il ne touche le sol, et marche vers le portail.

Sans ce temps volé, rien de ce qui suit n’aura lieu.`, 6),

    c17_duel_bilan: scene('Le temps volé', BG_PORTE, M_FINAL_AMANEA, 'Narrateur',
      () => {
        const { temps } = calc(7);
        const line = temps >= 6
          ? 'Valurn lui a volé de longues secondes. Assez, peut-être, pour ce qu’il attend du portail.'
          : 'Valurn n’a gagné que peu de temps. Le portail, pourtant, n’en demandait pas davantage.';
        return `Le duel est perdu. Il devait l’être.

${line}`;
      },
      'c17_trois'),

    c17_fin: {
      ...scene('Fin du Chapitre XVII', BG_PORTE, M_FINAL_AMANEA, 'Narrateur',
        `Fin du Chapitre XVII · La Porte Noire.`),
      chapterEnd: true,
      choices: [
        { label: 'Continuer', next: 'c18_carrefour_intro' },
        { label: 'Retour au menu', next: 'menu' },
      ],
    },
  });

/*@ALIASES@*/

  // Plans clés S02 à S04 (copiés à l’identique, voir tools/finale-gen/shots.py) : décor, codex, cadrage.
  const SHOTS = [
/*@SHOTS@*/
  ];
  const SECTIONS = [['s02_', 'La bataille de la Porte Noire'], ['s03_', 'La métamorphose d’Amanea'], ['s04_', 'Valurn contre Amanea']];
  for (const [key, path, name, body] of SHOTS) {
    A[key] = path;
    CODEX_IMAGES[key] = { title: 'Chapitre XVII · ' + name, body, src: path };
    CODEX_IMAGE_ORDER.push(key);
    window.SylviniaStoryCamera?.illustrate(key);
  }
  CODEX_IMAGE_GROUPS.push({
    id: 'chapter17',
    title: chapter,
    sections: SECTIONS.map(([p, t]) => ({ title: t, keys: SHOTS.filter(([k]) => k.startsWith('c17_cg_' + p)).map(([k]) => k) })),
  });

  // Fin du lot S01 : la suite s’ouvre.
  const s01End = S.c16_s01_fin;
  if (s01End) {
    s01End.text = 'À suivre : Chapitre XVII · La Porte Noire.';
    s01End.choices = [{ label: 'Continuer', next: start }, ...(s01End.choices || [])];
  }

  const ENTER_FLAGS = {
    c17_moisson: { s02PorteNoireComplete: true },
    c17_valurn_surgit: { s03TransformationComplete: true },
    c17_trois: { s04DuelComplete: true },
    c17_fin: { s05TragedieComplete: true, chapter17Complete: true },
  };
  const previousGo = go;
  go = window.go = function (next) {
    if (ENTER_FLAGS[next]) state.flags = { ...state.flags, ...ENTER_FLAGS[next] };
    return previousGo.apply(this, arguments);
  };

  const available = (s) => Boolean(s && (
    s.devMode || s.scene === 'c16_s01_fin' || String(s.scene).startsWith('c17_') ||
    s.flags?.s01AssaultComplete || s.flags?.chapter17Complete
  ));

  CHAPTER_SELECT_DATA.push({
    key: 'ch17',
    label: 'Chapitre XVII',
    title,
    subtitle: 'Akuhn’Nabad',
    image: A.c17_cg_s02_05_porte_maitre || A[BG_PORTE],
    tags: ['Porte Noire', 'Amanea'],
    body: 'L’armée atteint le portail d’Akuhn’Nabad. Amanea s’y tient, et Valurn s’interpose.',
    action: 'Ouvrir le Chapitre XVII',
  });

  const previousUnlock = chapterSelectUnlocked;
  chapterSelectUnlocked = window.chapterSelectUnlocked = (key) =>
    key === 'ch17' ? available(readMainSave()) || available(state) : previousUnlock(key);

  const previousLaunch = launchChapterSelect;
  launchChapterSelect = window.launchChapterSelect = function (key) {
    if (key !== 'ch17') return previousLaunch.apply(this, arguments);
    const saved = readMainSave();
    if (!available(saved || state)) return;
    if (saved) load();
    if (String(state.scene).startsWith('c17_') && state.scene !== 'c17_fin') {
      setScreen('game');
      return render();
    }
    state.history = [];
    return go(start, { skipHistory: true });
  };

  const previousRenderChapters = renderChapterSelect;
  renderChapterSelect = window.renderChapterSelect = function () {
    const result = previousRenderChapters.apply(this, arguments);
    const hint = document.querySelector('[data-chapter-launch="ch17"]')?.closest('.chapterSelectCard')?.querySelector('.chapterLockHint');
    if (hint) hint.textContent = 'Termine le Chapitre XVI.';
    return result;
  };

  const previousLabel = getSceneChapterLabel;
  getSceneChapterLabel = window.getSceneChapterLabel = (id = state.scene) =>
    String(id).startsWith('c17_') ? chapter : previousLabel(id);

  const update = document.querySelector('.menuUpdateBubble');
  if (update) update.textContent = 'Mise à jour · v0.420 · La Porte Noire';
})();
