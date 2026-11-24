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

  const scene = (sub, bg, music, speaker, text, next, chars = []) => ({
    title: chapter, sub, bg, music, speaker, text, next, chars,
  });
  const flags = () => state.flags || {};

  // Duel S04 : jauges affichées dans le texte des scènes de choix.
  const duel = () => {
    const f = flags();
    let vit = 10;
    for (const k of ['s04M1', 's04M2', 's04M3']) vit -= f[k] === 'good' ? 2 : f[k] === 'mid' ? 1 : 0;
    let temps = 0;
    for (const k of ['s04M4', 's04M5']) temps += f[k] === 'good' ? 2 : f[k] === 'mid' ? 1 : 0;
    return { vit, temps };
  };
  const bar = (n, max = 10) => '▰'.repeat(Math.max(0, n)) + '▱'.repeat(Math.max(0, max - n));
  const gauges = (power) => {
    const { vit, temps } = duel();
    const lines = [`Vitalité d’Amanea  ${bar(vit)}  ${vit}/10`];
    if (power !== undefined) {
      lines.push(`Puissance révélée  ${bar(power)}  ${power}/10`);
      lines.push(`Temps gagné  ${bar(temps, 4)}  ${temps}`);
    }
    return lines.join('\n\n');
  };
  const compact = (power) => {
    const { vit, temps } = duel();
    return power === undefined
      ? `Vitalité d’Amanea  ${bar(vit)}  ${vit}/10`
      : `Puissance ${power}/10 · Temps gagné ${temps}`;
  };
  window.SylviniaFinale = Object.assign(window.SylviniaFinale || {}, { duel, bar });

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

    // S04 · Duel : Valurn contre Amanea. Le joueur lit les gestes d’Amanea ; la défaite reste obligatoire.
    c17_duel_intro: scene('Duel · Valurn contre la Reine Noire', BG_PORTE, M_DUEL, 'Narrateur',
      () => `${gauges()}

Valurn se place entre la Reine Noire et le portail. Avant chaque échange, le récit décrit le geste d’Amanea : c’est lui qu’il faut lire. Une bonne lecture entame sa vitalité. Plus tard, elle fera gagner du temps.`,
      'c17_mur_de_feu', [valurn]),

    c17_m1_lecture: scene('Manche I · Le mur de feu', BG_PORTE, M_DUEL, 'Narrateur',
      () => `${gauges()}

Le mur de feu crépite entre eux. Amanea ne regarde pas les flammes. Ses yeux glissent d’un bord à l’autre du brasier, guettant l’endroit par lequel il va le contourner.`,
      'c17_m1', [valurn]),
    c17_m1: {
      ...scene('Manche I · Le mur de feu', BG_PORTE, M_DUEL, 'Narrateur',
        () => `${compact()}

Elle guette les bords du brasier.`,
        null, [valurn]),
      choices: [
        { label: 'Traverser le mur en son centre', next: 'c17_m1_r', flags: { s04M1: 'good' } },
        { label: 'Lancer une sphère à travers les flammes', next: 'c17_m1_r', flags: { s04M1: 'mid' } },
        { label: 'Le contourner par la gauche', next: 'c17_m1_r', flags: { s04M1: 'bad' } },
      ],
    },
    c17_m1_r: scene('Manche I · Le mur de feu', BG_PORTE, M_DUEL, 'Narrateur',
      () => `${gauges()}

${outcome('s04M1', {
  good: 'Valurn plonge là où elle ne regarde pas. Les flammes noires le couvrent une fraction de seconde, assez pour que la griffe d’Amanea arrive trop tard.',
  mid: 'La sphère traverse le brasier et éclate contre son épaule. Elle encaisse sans un cri. Le mur, lui, ne cache plus rien.',
  bad: 'Elle l’attendait sur le bord. La griffe fend l’air à un doigt de sa gorge. Valurn rompt, change d’angle et se jette dans les flammes, une seconde trop tard pour la surprendre.',
})()}`,
      'c17_tu_sais', [valurn]),

    c17_m2_lecture: scene('Manche II · L’onde', BG_PORTE, M_DUEL, 'Narrateur',
      () => `${gauges()}

Le poing d’Amanea descend. L’énergie s’y concentre, le sol se creuse déjà sous elle. Le coup ne vise pas Valurn : il vise la terre sur laquelle il se tient.`,
      'c17_m2', [valurnAmused]),
    c17_m2: {
      ...scene('Manche II · L’onde', BG_PORTE, M_DUEL, 'Narrateur',
        () => `${compact()}

Le coup vise le sol, pas lui.`,
        null, [valurnAmused]),
      choices: [
        { label: 'Bondir hors du sol', next: 'c17_m2_r', flags: { s04M2: 'good' } },
        { label: 'Rompre d’un pas', next: 'c17_m2_r', flags: { s04M2: 'mid' } },
        { label: 'Dresser une parade de flammes noires', next: 'c17_m2_r', flags: { s04M2: 'bad' } },
      ],
    },
    c17_m2_r: scene('Manche II · L’onde', BG_PORTE, M_DUEL, 'Narrateur',
      () => `${gauges()}

${outcome('s04M2', {
  good: 'Il quitte le sol avant que l’onde ne parte. Elle passe sous lui, et d’en haut, il voit la faille dans sa garde, là où le revers de sa griffe a laissé son flanc ouvert.',
  mid: 'Un pas ne suffit pas tout à fait. L’onde lui fauche une jambe ; il roule dans les cendres, mais sa lame a trouvé le bras d’Amanea au passage.',
  bad: 'La parade tient un battement de cœur. Puis l’onde la traverse comme une vitre et le soulève. Il en profite, à moitié sonné, pour se laisser porter.',
})()}`,
      'c17_pourquoi', [valurnAmused]),

    c17_m3_lecture: scene('Manche III · La garde', BG_PORTE, M_DUEL, 'Narrateur',
      () => `${gauges()}

Entre deux échanges, Amanea ramène toujours son bras difforme contre son flanc gauche, celui que la lame a mordu. Sa garde haute, elle, reste ouverte.`,
      'c17_m3', [valurnAnnoyed]),
    c17_m3: {
      ...scene('Manche III · La garde', BG_PORTE, M_DUEL, 'Narrateur',
        () => `${compact()}

Son flanc est couvert. Sa garde haute, non.`,
        null, [valurnAnnoyed]),
      choices: [
        { label: 'Frapper la garde haute laissée ouverte', next: 'c17_m3_r', flags: { s04M3: 'good' } },
        { label: 'Feinter sur le flanc gauche', next: 'c17_m3_r', flags: { s04M3: 'mid' } },
        { label: 'Lancer une sphère entropique à bout portant', next: 'c17_m3_r', flags: { s04M3: 'bad' } },
      ],
    },
    c17_m3_r: scene('Manche III · La garde', BG_PORTE, M_DUEL, 'Narrateur',
      () => `${gauges()}

${outcome('s04M3', {
  good: 'La lame passe au-dessus du bras levé et ouvre une entaille sous la clavicule de la reine. Le sang noir fume dans l’air brûlant.',
  mid: 'Elle couvre le flanc par réflexe. Le vrai coup arrive ailleurs, moins profond qu’il ne l’espérait, mais il arrive.',
  bad: 'La sphère éclate contre sa paume ouverte. Amanea referme les doigts sur l’entropie comme sur une braise, et la regarde s’éteindre.',
})()}`,
      'c17_revelation', [valurnAnnoyed]),

    c17_revelation: scene('Une seconde jauge', BG_PORTE, M_DUEL, 'Narrateur',
      () => {
        const { vit } = duel();
        const lead = vit <= 4
          ? 'Valurn la tient au seuil qu’il visait. Pour la première fois depuis le début du duel, la Reine Noire recule.'
          : vit < 10 ? 'Valurn l’a touchée, pas assez pour la faire plier. Elle ne recule pas.'
          : 'Pas une entaille. Amanea n’a pas reculé d’un pouce.';
        return `${gauges()}

${lead}

Puis, sous la première, une seconde jauge s’éveille, vide.

Puissance révélée  ${bar(0)}  0/10

Elle se remplit d’un coup.

${gauges(6)}

Tout ce qu’Amanea a retenu jusque-là se déverse dans ses gestes. Ce qu’il a pris pour sa force n’était que sa retenue.`;
      },
      'c17_cede', [valurnAnnoyed]),

    c17_m4_lecture: scene('Manche IV · Retarder', BG_PORTE, M_DUEL, 'Narrateur',
      () => `${gauges(6)}

Ses coups n’ont plus besoin d’être lus : ils sont trop lourds pour être parés. Chaque fois que Valurn tient sa position, la griffe l’en arrache. Chaque fois qu’il cède, elle doit le suivre.`,
      'c17_m4', [valurnAnnoyed]),
    c17_m4: {
      ...scene('Manche IV · Retarder', BG_PORTE, M_DUEL, 'Narrateur',
        () => `${compact(6)}

Chaque pas qu’il cède, elle doit le suivre.`,
        null, [valurnAnnoyed]),
      choices: [
        { label: 'Céder du terrain pas à pas', next: 'c17_m4_r', flags: { s04M4: 'good' } },
        { label: 'L’attirer loin du portail', next: 'c17_m4_r', flags: { s04M4: 'mid' } },
        { label: 'Lui faire face et parer', next: 'c17_m4_r', flags: { s04M4: 'bad' } },
      ],
    },
    c17_m4_r: scene('Manche IV · Retarder', BG_PORTE, M_DUEL, 'Narrateur',
      () => `${gauges(8)}

${outcome('s04M4', {
  good: 'Il recule, encore, toujours d’un pas de moins qu’elle n’avance. Chaque pas lui coûte une seconde. Chaque seconde est pour lui.',
  mid: 'Il l’entraîne de quelques foulées vers les ruines. Elle le suit, puis s’arrête net et regarde le portail. Elle a compris la moitié du piège.',
  bad: 'La parade qui l’avait sauvé tout à l’heure se brise net. La griffe lui ouvre l’épaule. Il se relève, mais il a perdu ce que la manche aurait dû lui rapporter.',
})()}`,
      'c17_m5_lecture', [valurnAnnoyed]),

    c17_m5_lecture: scene('Manche V · Encore une minute', BG_PORTE, M_DUEL, 'Narrateur',
      () => `${gauges(8)}

Amanea ne frappe plus pour le blesser. Elle frappe pour en finir. Ses yeux ne quittent plus le portail que pour revenir sur lui, et chaque fois, la colère y gagne sur la lucidité.`,
      'c17_m5', [valurnAnnoyed]),
    c17_m5: {
      ...scene('Manche V · Encore une minute', BG_PORTE, M_DUEL, 'Narrateur',
        () => `${compact(8)}

Elle frappe pour en finir.`,
        null, [valurnAnnoyed]),
      choices: [
        { label: 'La provoquer pour l’attirer encore', next: 'c17_m5_r', flags: { s04M5: 'good' } },
        { label: 'Riposter avant qu’elle ne frappe', next: 'c17_m5_r', flags: { s04M5: 'mid' } },
        { label: 'Disparaître dans les cendres', next: 'c17_m5_r', flags: { s04M5: 'bad' } },
      ],
    },
    c17_m5_r: scene('Manche V · Encore une minute', BG_PORTE, M_DUEL, 'Narrateur',
      () => `${gauges(10)}

${outcome('s04M5', {
  good: '« Encore une minute, très chère. Rien qu’une. »\n\nLe sourire de Valurn la mord plus sûrement que sa lame. Elle perd un battement à vouloir l’effacer.',
  mid: 'Sa lame mord la jointure du bras difforme. Le sang noir gicle. Pour la première fois, Amanea gronde de douleur, et pour la dernière fois, il l’a touchée.',
  bad: 'Il se fond dans les cendres. Elle ne le cherche même pas. Elle frappe l’endroit où il va réapparaître.',
})()}`,
      'c17_brise', [valurnAnnoyed]),

    c17_duel_bilan: scene('Le temps volé', BG_PORTE, M_TRAGEDIE, 'Narrateur',
      () => {
        const { temps } = duel();
        const line = temps >= 3
          ? 'Valurn lui a volé de longues secondes. Assez, peut-être, pour ce qu’il attend du portail.'
          : 'Valurn n’a gagné que peu de temps. Le portail, pourtant, n’en demandait pas davantage.';
        return `Le duel est perdu. Il devait l’être.

${line}`;
      },
      'c17_trois'),

    c17_fin: {
      ...scene('Fin du Chapitre XVII', BG_PORTE, M_TRAGEDIE, 'Narrateur',
        `Fin du Chapitre XVII · La Porte Noire.`),
      chapterEnd: true,
      choices: [
        { label: 'Continuer', next: 'c18_carrefour_intro' },
        { label: 'Retour au menu', next: 'menu' },
      ],
    },
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
    image: A[BG_PORTE],
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
  if (update) update.textContent = 'Mise à jour · v0.418 · La Porte Noire';
})();
