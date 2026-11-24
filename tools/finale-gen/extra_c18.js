/* Mode Histoire · Chapitre XVIII · Début de la fin (séquences S06 à S08) */
(() => {
  'use strict';

  const title = 'Début de la fin';
  const chapter = 'Chapitre XVIII · ' + title;
  const start = 'c18_carrefour_intro';

  // Décors fournis par l’auteur pour le final (copiés à l’identique, voir docs/production/finale_assets_manifest.json).
  Object.assign(A, {
    finale_bg_porte_noire_plaine: 'assets/images/backgrounds/finale/bg_porte_noire_plaine.png',
    finale_bg_porte_noire_blizzard: 'assets/images/backgrounds/finale/bg_porte_noire_blizzard.png',
    finale_bg_champ_bataille: 'assets/images/backgrounds/finale/bg_champ_bataille.png',
    finale_bg_akuhn_nabad_ravin: 'assets/images/backgrounds/finale/bg_akuhn_nabad_ravin.png',
  });
  const BG_PORTE = 'finale_bg_porte_noire_plaine';
  const BG_CHAMP = 'finale_bg_champ_bataille';
  const BG_CREVASSE = 'finale_bg_akuhn_nabad_ravin';
  const BG_GIVRE = 'finale_bg_porte_noire_blizzard';
  const BG_SOURCE = 'bg_clearing_decor';
  // Arrivée à Al’Gratal (« sol de pierre », Sylviniens qui s’affairent). Pas de panorama avec des silhouettes d’Hylee non transformée.
  const BG_ALGRATAL = 'bg_algratal_portes';

  const M_TENSION = 'music_tension';
  const M_HORREUR = 'music_c10_horreur';
  const M_DRAVEN = 'music_draven_storm';
  const M_LINEVA = 'music_draven_bond';
  const M_PLAINTE = 'music_c11_complainte';
  const M_PLAINTE_I = 'music_c11_complainte_instru';
  // « Ensemble » (OST fournie par l’auteur) : tout le combat contre Bhaal, de son apparition au dragon de glace.
  // Le souvenir de la leçon d’Arcane garde sa musique (M_SOURCE).
  const M_BHAAL = 'music_finale_ensemble';
  const M_IRIANA = 'music_iriana';
  const M_VALURN = 'music_c8_valurn_pacte';
  const M_BLIZZARD = M_BHAAL;
  const M_SOURCE = 'music_c6_nuit_etoiles';
  const M_ALGRATAL = 'music_algratal';

  // Hylee garde ses sprites habituels jusqu’à la canalisation ; ensuite, aucune silhouette tant que la forme finale n’a pas de sprite.
  const hylee = ['hylee', 'hylee2_determined', 'left'];
  const hyleeYoung = ['hylee', 'hylee_soft', 'left'];
  const remerii = ['remerii', 'remerii_strict', 'right'];
  const remeriiSad = ['remerii', 'remerii_sad', 'right'];
  const remeriiSoft = ['remerii', 'remerii_soft', 'right'];
  const remeriiStrict = ['remerii', 'remerii_strict', 'right'];
  const remeriiSurprised = ['remerii', 'remerii_surprised', 'right'];
  const saidin = ['saidin', 'saidin_mysterious', 'center'];
  const irianaTroubled = ['iriana', 'iriana_troubled_alone', 'left'];
  const irianaSad = ['iriana', 'iriana_sad', 'left'];
  const irianaStern = ['iriana', 'iriana_stern', 'left'];
  const valurnAway = ['valurn', 'valurn_away', 'right'];
  const valurnAnnoyed = ['valurn', 'valurn_annoyed', 'right'];
  const dravenSoot = ['draven', 'draven_gruff', 'left'];
  const dravenAngry = ['draven', 'draven_angry', 'left'];
  const dravenLineva = ['draven', 'draven_gruff', 'left'];
  // Tia adulte (Chronique Alternative) et Hylee dans sa forme finale (dès c18_remerii_tombe, jamais avant).
  const tia = (e, pos = 'right') => ['tia', 'finale_tia_' + e, pos, 'finale-k'];
  const hyleeF = (e, pos = 'left') => ['hylee', 'hylee_finale_' + e, pos, 'finale-k'];

  const scene = (sub, bg, music, speaker, text, next, chars = []) => ({
    title: chapter, sub, bg, music, speaker, text, next, chars,
  });
  const flags = () => state.flags || {};
  const perspective = () => flags().finalePerspective || 'remerii';

  // Routes optionnelles : mêmes conditions que les parcours Draven et Iriana des chapitres précédents.
  const dravenUnlocked = (s) => Boolean(s?.devMode || (s?.flags?.chapter4DComplete &&
    (s.flags.c10gHyleeBetweenDravenValurn || s.flags.c11gSeenDravenCourt || s.flags.c15WalkedWithDraven)));
  const irianaUnlocked = (s) => Boolean(s?.devMode || (s?.flags?.chapter13IComplete &&
    (s.flags.c13iReadTiaNarrative || s.flags.c13iRepeatedTiaPattern || s.flags.c13iHeldAmaneaWhole ||
      s.flags.c13iPromisedNotToForget || s.flags.c13iTruthWithoutDefense)));
  window.SylviniaFinale = Object.assign(window.SylviniaFinale || {}, { dravenUnlocked, irianaUnlocked });

  const played = (k) => (flags()[k] ? ' (déjà jouée)' : '');
  const carrefourChoices = () => {
    const list = [{ label: 'Poursuivre : Remerii / Hylee' + played('c18PlayedRemerii'), next: 'c18_s08_intro', flags: { finalePerspective: 'remerii' } }];
    if (dravenUnlocked(state)) list.push({ label: 'Point de vue : Draven' + played('c18PlayedDraven'), next: 'c18_dp_intro', flags: { finalePerspective: 'draven', finaleSeenDraven: true } });
    if (irianaUnlocked(state)) list.push({ label: 'Point de vue : Iriana' + played('c18PlayedIriana'), next: 'c18_ip_intro', flags: { finalePerspective: 'iriana', finaleSeenIriana: true } });
    return list;
  };

  // Duels S06, S07, S08 : jauges et QTE gérés par fusion/story-finale-duels.js.
  const calc = (id, step) => window.SylviniaFinaleDuels ? window.SylviniaFinaleDuels.calc(id, step) : {};
  const RESET = {
    s06: { s06Posture: null, s06LinevaWords: null, s06Plan: null, s06Voute: null },
    s07: { s07Maitrise: null, s07Garde: null, s07Flux: null, s07Renversement: null },
    s08: { s08Gardien: null, s08Reponse: null, s08Brulure: null, s08Arcane: null, s08Sync: null, s08Dragon: null },
  };
  const START = { s06: 'c18_dp_crevasse', s07: 'c18_ip_maitrise', s08: 'c18_bh_blizzard' };
  const POV = { s06: 'draven', s07: 'iriana', s08: 'remerii' };
  const duelScene = (id, step, sub, bg, music, text, next, chars, extra = {}) => ({
    ...scene(sub, bg, music, 'Narrateur', text, next, chars), fduel: id, fstep: step, pov: POV[id], ...extra,
  });
  const withNext = (o, ok, test) => {
    Object.defineProperty(o, 'next', { enumerable: true, configurable: true, get: () => test() || ok });
    return o;
  };
  // Game Over : la silhouette de celui ou celle qui tombe reste à l’écran (pas de décor nu).
  const GO_CHARS = { s06: [dravenSoot], s07: [irianaTroubled], s08: [hylee, remeriiSad] };
  const gameOver = (id, step, sub, bg, text) => ({
    ...scene(sub, bg, M_PLAINTE_I, 'Narrateur', text, null, GO_CHARS[id] || []), title: 'Game Over', fduel: id, fstep: step, fgameover: true, pov: 'gameover',
    choices: [
      { label: 'Réessayer le duel', next: START[id], flags: RESET[id], skipHistory: true },
      { label: 'Retour au menu', next: 'menu' },
    ],
  });
  const pick = (key, texts) => () => texts[flags()[key]] || Object.values(texts)[0];

  // Fin d’une perspective facultative : carton temporel, retour automatique vers S08.
  const branchEnd = (sub, text, chars = [], bg = BG_PORTE) => {
    const o = scene(sub, bg, M_TENSION, 'Narrateur', text, null, chars);
    if (bg !== BG_PORTE) o.hideChars = true;
    Object.defineProperty(o, 'choices', {
      enumerable: true, configurable: true,
      get: () => flags().finaleReplay
        ? [{ label: 'Poursuivre : Remerii / Hylee', next: 'c18_ouverture' }, { label: 'Terminer la relecture', next: '__finale_replay_end' }]
        : [{ label: 'Poursuivre : Remerii / Hylee', next: 'c18_ouverture' }],
    });
    return o;
  };

  // Carrefour : les deux regards possibles sur la nuit (Draven, Iriana) plutôt qu’un champ de bataille vide.
  const CARREFOUR_CHARS = [['draven', 'draven_gruff', 'left'], ['iriana', 'iriana_troubled_alone', 'right']];

  Object.assign(S, {
    c18_carrefour_intro: scene('Carrefour', BG_CHAMP, M_TENSION, 'Narrateur',
        () => {
          const extra = dravenUnlocked(state) || irianaUnlocked(state)
            ? '\n\nLes liens tissés en chemin ouvrent d’autres regards sur cette nuit. Un seul point de vue facultatif peut être suivi avant de rejoindre Remerii et Hylee ; l’autre pourra être revécu depuis le menu des chapitres.'
            : '';
          return `Chapitre XVIII · Début de la fin

La Reine Noire est tombée. Le portail brûle encore. Sur le champ de bataille, plusieurs destins se jouent au même instant, à quelques lieues les uns des autres.${extra}`;
        }, 'c18_carrefour', CARREFOUR_CHARS),
    c18_carrefour: {
      ...scene('Carrefour', BG_CHAMP, M_TENSION, 'Narrateur', `Quel regard porter sur cette nuit ?`, null, CARREFOUR_CHARS),
      choices: carrefourChoices(),
    },
    c18_s08_intro: scene('Au même moment', BG_PORTE, M_TENSION, 'Narrateur',
      `Au même moment, face au portail…

La Reine Noire gît sur la terre brûlée. Autour du portail, ceux qui restent reprennent leur souffle sans savoir que la nuit n’a pas fini de réclamer son dû.`,
      'c18_ouverture', [irianaTroubled, tia('sad')]),

    // ───── S06 · Draven (facultatif) ─────
    c18_dp_intro: scene('Pendant ce temps', BG_CREVASSE, M_DRAVEN, 'Narrateur',
      `Pendant ce temps, dans la crevasse…

Loin du portail, l’Amiral de Forthaven se bat encore. Cette nuit, c’est à travers ses yeux qu’elle se vit, et ce sont ses gestes qui la décident.`,
      'c18_draven_seul', [dravenSoot]),
    c18_dp_crevasse: {
      ...duelScene('s06', 0, 'Survie · La crevasse', BG_CREVASSE, M_DRAVEN,
        `Deux parois, une entrée, une grotte dans son dos. Les morts avancent en rangs serrés : ici, ils ne passent qu’à trois de front.`,
        null, [dravenSoot], { fintro: true }),
      choices: [
        { label: 'Tenir l’entrée de la crevasse', next: 'c18_dp_crevasse_r', flags: { s06Posture: 'tenir' }, best: true },
        { label: 'Reculer pas à pas vers la grotte', next: 'c18_dp_crevasse_r', flags: { s06Posture: 'reculer' } },
        { label: 'Charger le premier rang', next: 'c18_dp_crevasse_r', flags: { s06Posture: 'charger' } },
      ],
    },
    c18_dp_crevasse_r: duelScene('s06', 1, 'Survie · La crevasse', BG_CREVASSE, M_DRAVEN,
      pick('s06Posture', {
        tenir: 'Il plante ses bottes dans la caillasse. Trois morts : il en abat trois. Puis trois autres. L’entrée tient, mais chaque parade lui coûte un peu plus que la précédente.',
        reculer: 'Il cède du terrain, un pas par mort tombé. La paroi se rapproche dans son dos, froide, et il sent dans la roche une veine fendue qui court jusqu’au plafond de la grotte. Il s’en souviendra. Derrière les premiers, les autres s’engouffrent.',
        charger: 'Il fond sur le premier rang avant qu’il ne se forme. Le choc renverse quatre cadavres et lui arrache un cri de l’épaule. La horde recule d’un pas. Lui y laisse des forces qu’il n’a plus.',
      }),
      'c18_pere', [dravenSoot]),
    c18_dp_lineva: {
      ...scene('Point de vue · Draven', BG_CREVASSE, M_LINEVA, 'Narrateur',
        `La voix grésille encore. Il a une seconde. Une seule.`,
        null, [dravenLineva]),
      pov: 'draven',
      choices: [
        { label: 'Lui promettre ce qu’elle veut entendre', next: 'c18_je_rentre', flags: { s06LinevaWords: 'promesse' } },
        { label: 'Lui confier sa mère', next: 'c18_je_rentre', flags: { s06LinevaWords: 'mere' } },
        { label: 'Lui dire qu’il est fier d’elle', next: 'c18_je_rentre', flags: { s06LinevaWords: 'fierte' } },
      ],
    },
    c18_dp_echo: scene('Point de vue · Draven', BG_CREVASSE, M_LINEVA, 'Narrateur',
      () => (flags().chapter4DComplete ? 'Derrière la voix, il devine la maison. Il revoit la cour de Forthaven, la lame d’entraînement trop lourde pour elle, son menton levé malgré tout.\n\n' : '') + ({
        mere: `Avant que le parchemin ne se taise, il ajoute, plus bas :

« Veille sur ta mère. »

Il n’entend pas la réponse. Il n’en a pas besoin.`,
        fierte: `Avant que le parchemin ne se taise, il ajoute, plus bas :

« Je suis fier de toi, Lineva. »

Le grésillement avale la fin du nom. Il espère qu’elle l’a entendu.`,
      })[flags().s06LinevaWords] || `Il ne dit rien de plus. Une promesse, une seule, c’est déjà plus qu’il n’en peut tenir.`,
      'c18_grotte', [dravenLineva]),
    c18_dp_grotte: {
      ...duelScene('s06', 3, 'Survie · L’usure', BG_CREVASSE, M_DRAVEN,
        `Chaque parade coûte désormais ce qu’un assaut coûtait tout à l’heure. Plus de place pour reculer. Reste à choisir comment entrer dans la grotte.`,
        null, [dravenAngry], { fprev: 1 }),
      choices: [
        { label: 'Reculer en combattant', next: 'c18_dp_grotte_r', flags: { s06Plan: 'combattre' }, best: true },
        { label: 'Courir sans se retourner', next: 'c18_dp_grotte_r', flags: { s06Plan: 'courir' } },
      ],
    },
    c18_dp_grotte_r: withNext(duelScene('s06', 4, 'Survie · L’usure', BG_CREVASSE, M_DRAVEN,
      () => (flags().s06Posture === 'reculer' ? 'Au-dessus de l’entrée, la veine fendue est là, exactement où il l’avait sentie. ' : '') + (flags().s06Plan === 'courir'
        ? 'Il ne compte plus. Il court, l’épaule en avant, et les morts s’engouffrent derrière lui comme l’eau dans une écluse.'
        : 'Il entre à reculons, la lame devant lui. Chaque mort qui franchit le seuil en entraîne trois autres derrière lui. C’est exactement ce qu’il veut, et il les fait payer, un par un.'),
      null, [dravenAngry]), 'c18_temporise', () => { const v = calc('s06', 4); return v.horde >= 10 || v.endurance <= 0 ? 'c18_dp_gameover_horde' : null; }),
    c18_dp_voute: {
      ...duelScene('s06', 4, 'Pivot · La voûte', BG_CREVASSE, M_DRAVEN,
        `Il a regagné l’entrée. Derrière lui, la grotte grouille. Au-dessus, la roche n’attend qu’un coup juste.`,
        null, [dravenAngry]),
      fqte: { label: 'Frapper la voûte', ms: () => 3500 + calc('s06', 4).endurance * 300 + (flags().s06Posture === 'reculer' ? 1200 : 0), fail: 'c18_dp_gameover_voute' },
      choices: [{ label: '⚡ Frapper la paroi au point de rupture', next: 'c18_dp_voute_r', flags: { s06Voute: 'ok' }, best: true }],
    },
    c18_dp_voute_r: duelScene('s06', 5, 'Pivot · La voûte', BG_CREVASSE, M_DRAVEN,
      `Sa lame trouve la faille. La roche répond par un gémissement profond, quelque part au-dessus de sa tête. Il sait où frapper, à présent. Il ne lui reste qu’à frapper assez fort.`,
      'c18_effondrement', [dravenAngry]),
    c18_dp_gameover_horde: gameOver('s06', 4, 'La horde passe', BG_CREVASSE,
      `La horde le submerge avant qu’il n’atteigne la grotte. Il frappe encore, puis il ne frappe plus. Les morts passent la crevasse et se déversent vers l’arrière du front, là où personne ne les attend.

La manœuvre de la grotte n’aura jamais lieu.`),
    c18_dp_gameover_voute: gameOver('s06', 4, 'La voûte tient', BG_CREVASSE,
      `Le coup glisse sur la roche. La voûte tremble, gronde… et tient. Les morts referment le cercle avant qu’il ne puisse frapper de nouveau.

La horde passe, et la grotte reste debout.`),
    c18_dp_adieu: scene('Point de vue · Draven', BG_CREVASSE, M_PLAINTE_I, 'Narrateur',
      () => {
        const words = {
          promesse: 'Ses derniers mots à Lineva étaient une promesse. Il a laissé à d’autres le soin de la tenir.',
          mere: 'Ses derniers mots à Lineva lui confiaient sa mère. Ce soir, à Forthaven, deux femmes attendent le même homme.',
          fierte: 'Ses derniers mots à Lineva disaient sa fierté. C’est la seule chose qu’il n’ait jamais eu de mal à lui donner.',
        }[flags().s06LinevaWords] || '';
        return `Les plaques dans une main. Le médaillon dans l’autre. Entre les deux, toute une vie qu’il a tenue jusqu’au bout.${words ? '\n\n' + words : ''}`;
      },
      'c18_s06_fin', [dravenSoot]),
    c18_s06_fin: branchEnd('Pendant ce temps', `Pendant ce temps, face au portail…

Remerii laisse Draven à son dernier silence et rejoint les siens. Là-bas, la nuit bascule.`, [remeriiSad]),

    // ───── S07 · Iriana (facultatif) ─────
    c18_ip_intro: scene('Pendant ce temps', BG_PORTE, M_IRIANA, 'Narrateur',
      `Pendant ce temps, près du corps d’Amanea…

Iriana et Tia ont couru jusqu’au bout de la nuit. Cette nuit, c’est à travers les yeux d’Iriana qu’elle se vit, et ce sont ses gestes qui la décident.`,
      'c18_trop_tard', [irianaStern]),
    c18_ip_portail: scene('Pendant ce temps', BG_PORTE, M_IRIANA, 'Narrateur',
      `Plus tard, le portail s’ouvre. Dans le chaos qui suit, quand chacun cherche à fuir ou à se battre, Iriana s’éloigne seule, sans un mot.

Elle sait qui l’attend devant la faille.`,
      'c18_alamma', [irianaStern]),
    c18_ip_maitrise: {
      ...duelScene('s07', 0, 'Duel · La signature d’Alamma', BG_PORTE, M_IRIANA,
        `L’air se resserre autour d’Iriana. Ce sort porte la signature de son père : elle l’a vu se tisser cent fois dans les livres de son enfance.`,
        null, [irianaStern], { fintro: true }),
      choices: [
        { label: 'Défaire le sort avant qu’il ne se referme', next: 'c18_ip_maitrise_r', flags: { s07Maitrise: 'lire' }, best: true },
        { label: 'Frapper la première', next: 'c18_ip_maitrise_r', flags: { s07Maitrise: 'frapper' } },
        { label: 'Attendre qu’il frappe le premier', next: 'c18_ip_maitrise_r', flags: { s07Maitrise: 'attendre' } },
      ],
    },
    c18_ip_maitrise_r: duelScene('s07', 1, 'Duel · La signature d’Alamma', BG_PORTE, M_IRIANA,
      pick('s07Maitrise', {
        lire: 'Ses doigts tracent le contre-glyphe à l’envers, comme il le lui avait appris sans le savoir. L’étreinte se dénoue. Alamma hausse un sourcil : sa fille vient de le surprendre, et son emprise a reculé.',
        frapper: 'Un trait d’Arcane pure jaillit de sa paume. Alamma le dévie d’un revers, mais il a dû le dévier. Iriana gagne un pas, puis un autre.',
        attendre: 'Elle attend. Il ne frappe pas : il serre. Le sort se referme sur elle avant qu’elle ne comprenne qu’il était déjà lancé.',
      }),
      'c18_ip_domination', [irianaStern]),
    c18_ip_domination: {
      ...duelScene('s07', 2, 'Duel · Domination', BG_PORTE, M_IRIANA,
        `Le troisième sort ne lui laisse rien à briser. Il tombe sur elle de tout son poids ; l’air se fissure autour d’elle. Son père n’a même pas levé la voix. Il lui reste un fil.`,
        null, [irianaTroubled]),
      choices: [
        { label: 'Garder un fil d’Arcane au fond de soi', next: 'c18_ip_domination_r', flags: { s07Garde: 'esprit' }, best: true },
        { label: 'Soutenir son regard', next: 'c18_ip_domination_r', flags: { s07Garde: 'regard' } },
        { label: 'Lâcher prise pour reprendre souffle', next: 'c18_ip_domination_r', flags: { s07Garde: 'lacher' } },
      ],
    },
    c18_ip_domination_r: withNext(duelScene('s07', 3, 'Duel · Domination', BG_PORTE, M_IRIANA,
      pick('s07Garde', {
        esprit: 'Elle replie ce qui lui reste d’Arcane au creux de sa poitrine, minuscule, têtu. Il peut l’écraser. Il ne peut pas le trouver.',
        regard: 'Elle lève les yeux vers lui. Elle ne gagnera pas ce duel-là, pas maintenant, mais elle ne lui donnera pas la satisfaction de baisser la tête.',
        lacher: 'Elle relâche tout pour reprendre son souffle. C’est l’ouverture qu’il attendait : l’emprise s’engouffre dans le vide qu’elle a laissé.',
      }),
      null, [irianaTroubled]), 'c18_pacte_valurn', () => (calc('s07', 3).arcane <= 0 ? 'c18_ip_gameover_brisee' : null)),
    c18_ip_flux: {
      ...duelScene('s07', 4, 'Pivot · Le flux de Valurn', BG_PORTE, M_IRIANA,
        `Le fragment de Valurn coule en elle : Ombre, Chaos, Mort. Il faut l’accueillir sans le saisir, avant qu’il ne la déchire.`,
        null, [irianaTroubled], { freveal: 'chaos', fprev: 3 }),
      fqte: { label: 'Stabiliser le flux', ms: () => 4500 + calc('s07', 3).arcane * 400 + (flags().s07Garde === 'esprit' ? 1000 : 0), fail: 'c18_ip_gameover_chaos' },
      choices: [{ label: '⚡ Ouvrir l’Arcane au flux', next: 'c18_ip_flux_r', flags: { s07Flux: 'accord' }, best: true }],
    },
    c18_ip_flux_r: duelScene('s07', 5, 'Pivot · Le flux de Valurn', BG_PORTE, M_IRIANA,
      `Elle ne saisit rien. Elle laisse la chose trouver sa place, comme une eau trouve sa pente. Le halo sombre s’adoucit et se modèle à son Arcane. La douleur reste, mais elle a une forme. L’emprise de son père vient de se fendre.`,
      'c18_peu_importe', [irianaTroubled]),
    c18_ip_renversement: {
      ...duelScene('s07', 6, 'Duel · Renversement', BG_PORTE, M_IRIANA,
        `Il recule vers la faille. Ombre, Chaos et Mort répondent à sa main. Encore un pas, et il sera hors d’atteinte.`,
        null, [irianaStern]),
      get choices() {
        const list = [
          { label: 'L’enserrer d’ombres', next: 'c18_ip_renversement_r', flags: { s07Renversement: 'retenir' }, best: true },
          { label: 'Un trait de magie mortifère', next: 'c18_ip_renversement_r', flags: { s07Renversement: 'mort' } },
          { label: 'Exiger une réponse', next: 'c18_ip_renversement_r', flags: { s07Renversement: 'question' } },
        ];
        if (flags().s07Garde === 'esprit') list.unshift({ label: 'Tresser les trois forces autour de son Arcane', next: 'c18_ip_renversement_r', flags: { s07Renversement: 'tresse' } });
        return list;
      },
    },
    c18_ip_renversement_r: duelScene('s07', 7, 'Duel · Renversement', BG_PORTE, M_IRIANA,
      () => `${({
        question: '« Le pacte ! crie-t-elle. Dis-moi comment le briser ! »\n\nAlamma la regarde, et pour la première fois, il hésite. Il ne répond pas.',
        mort: 'Le trait mortifère part plus vite que sa pensée. Alamma l’arrête d’un mur d’énergie, mais le mur se fend, et lui avec, d’un pouce.',
        tresse: 'Elle tresse les trois forces autour du fil d’Arcane qu’elle a gardé. Pour la première fois, elles lui obéissent ensemble. Alamma recule sous le choc, et son emprise se brise net.',
      })[flags().s07Renversement] || 'Les vrilles noires jaillissent, plus vite que tout à l’heure. Elles se referment sur son poignet, sur sa cheville. Pendant une seconde, Iriana tient son père.'}

Le Chaos murmure plus fort, à présent. Il lui souffle de serrer. De détruire.`,
      'c18_chute_alamma', [irianaStern]),
    c18_ip_gameover_brisee: gameOver('s07', 3, 'Le fil se rompt', BG_PORTE,
      `Le fil se rompt. L’Arcane d’Iriana s’éteint sous l’emprise de son père, et avec elle, ce qu’elle était. Alamma la relève avec douceur, comme on relève une chose qui vous appartient.

Quand le fragment de Valurn arrive enfin, il ne trouve plus personne pour l’accueillir.`),
    c18_ip_gameover_chaos: gameOver('s07', 4, 'Consumée', BG_PORTE,
      `Elle referme son esprit sur le flux, trop tard, trop fort. Ombre, Chaos et Mort s’engouffrent dans chaque faille de son Arcane et la consument de l’intérieur.

Alamma la regarde tomber sans un mot. Puis il se retourne vers le portail.`),
    c18_s07_fin: branchEnd('Pendant ce temps', `Pendant ce temps, face au portail…

Ce qu’Iriana laisse derrière elle continue sans elle. Là-bas, la nuit bascule, et le récit rejoint ceux qui s’y tiennent encore.`, [], 'c18_cg_s07_24_la_foret_sans_iriana'),

    // ───── S08 · Remerii, Hylee, Bhaal (obligatoire) ─────
    c18_bh_blizzard: {
      ...duelScene('s08', 0, 'Final · Le Gardien de Givre', BG_GIVRE, M_BLIZZARD,
        `Le Gardien de Givre attend sa volonté. Chaque rafale qu’elle lui donne, la cicatrice sous son cœur la lui fera payer.`,
        null, [remeriiStrict], { fintro: true }),
      choices: [
        { label: 'Dresser le Gardien en rempart', next: 'c18_bh_blizzard_r', flags: { s08Gardien: 'rempart' }, best: true },
        { label: 'Lancer le Gardien droit sur Bhaal', next: 'c18_bh_blizzard_r', flags: { s08Gardien: 'assaut' } },
        { label: 'Tout jeter dans la tempête', next: 'c18_bh_blizzard_r', flags: { s08Gardien: 'tout' } },
      ],
    },
    c18_bh_blizzard_r: withNext(duelScene('s08', 1, 'Final · Le Gardien de Givre', BG_GIVRE, M_BLIZZARD,
      pick('s08Gardien', {
        rempart: 'Le Gardien se dresse entre elle et le démon, un mur de glace vivante. Bhaal le frappe, et le mur tient. Il ne recule pas, mais il ne passe pas.',
        assaut: 'Le Gardien s’élance. Ses poings de givre heurtent Bhaal en pleine poitrine et le font plier d’un genou. Remerii, elle, sent le prix monter dans sa poitrine.',
        tout: 'Elle jette tout dans la tempête. Le Gardien rugit, Bhaal recule sous l’assaut, et quelque chose cède sous les côtes de Remerii, quelque chose qui n’aurait jamais dû céder.',
      }),
      null, [remeriiStrict]), 'c18_sceau', () => (calc('s08', 2).blizzard <= 0 ? 'c18_bh_gameover_blizzard' : null)),
    c18_choix_hylee: {
      ...scene('Dans la tempête', BG_GIVRE, M_BLIZZARD, 'Narrateur',
        `Le vent arrache les mots d’Hylee avant qu’elle ne les forme. Lesquels garder ?`,
        null, [hylee, remeriiSad]),
      pov: 'hylee',
      choices: [
        { label: '« Je ne te laisse pas seule. »', next: 'c18_reponse_hylee', flags: { s08Reponse: 'seule' } },
        { label: 'Tendre la main, sans un mot', next: 'c18_reponse_hylee', flags: { s08Reponse: 'main' } },
      ],
    },
    c18_reponse_hylee: scene('Dans la tempête', BG_GIVRE, M_BLIZZARD, 'Narrateur',
      () => ({
        confiance: 'Remerii avait dit qu’elle reviendrait. Hylee est venue la chercher, voilà tout.\n\n',
        peur: 'Cette fois, Hylee ne laissera pas un nom mourir au bord de ses lèvres.\n\n',
      }[flags().s02Adieu] || '') + (flags().s08Reponse === 'main'
        ? `Hylee ne dit rien. Elle tend la main, paume ouverte, et Remerii reconnaît le geste avant même de comprendre d’où il vient.`
        : `« Je ne te laisse pas seule », dit Hylee.

Les mots sont minuscules dans la tempête. Remerii les entend quand même.`),
      'c18_souvenir_lien', [hylee, remeriiSurprised]),
    c18_choix_arcane: {
      ...scene('L’Arcane', BG_GIVRE, M_BLIZZARD, 'Narrateur',
        () => `${flags().s08Brulure ? 'Ses doigts brûlent encore. ' : ''}L’Arcane gronde de partout. Hylee tend la main.`,
        null, [hylee]),
      pov: 'hylee',
      choices: [
        { label: 'L’attraper au vol', next: 'c18_arcane_brule', flags: { s08Brulure: true } },
        { label: 'La laisser venir', next: 'c18_bh_sync', flags: { s08Arcane: 'accueillie' }, best: true },
      ],
    },
    c18_arcane_brule: scene('Trop vite', BG_GIVRE, M_BLIZZARD, 'Narrateur',
      `Ses doigts se referment sur le vide. Le froid la mord jusqu’au coude, l’Arcane lui file entre les doigts comme une eau brûlante.

Si tu refermes la main trop vite, elle te brûlera.

Hylee rouvre la main, haletante. La leçon de Remerii est encore là, au creux de sa paume.`,
      'c18_choix_arcane', [hylee]),
    c18_bh_sync: {
      ...duelScene('s08', 2, 'Pivot · Synchronisation', BG_GIVRE, M_BLIZZARD,
        `Le blizzard hurle. Entre chaque flocon, l’Arcane danse. Il faut s’accorder au souffle de Remerii, ni trop tôt ni trop tard.`,
        null, [hylee, remeriiSad], { freveal: 'flux', fprev: 2, pov: 'hylee' }),
      fqte: {
        label: 'Synchronisation',
        ms: () => { const f = flags(); return 5000 + (f.s08Reponse ? 800 : 0) + (f.s02Adieu === 'confiance' ? 800 : 0) + (((state.stats || {}).lien || 0) >= 8 ? 800 : 0) - (f.s08Brulure ? 600 : 0); }, // une main refermée trop tôt se paie (cf. panneau tandem)
        fail: 'c18_bh_gameover_sync',
      },
      choices: [{ label: '⚡ S’accorder au souffle de Remerii', next: 'c18_bh_sync_r', flags: { s08Sync: 'ok' }, best: true }],
    },
    c18_bh_sync_r: duelScene('s08', 3, 'Pivot · Synchronisation', BG_GIVRE, M_BLIZZARD,
      () => `${flags().s08Reponse === 'main' ? 'Sa main est toujours tendue. ' : flags().s08Reponse === 'seule' ? 'Je ne te laisse pas seule. ' : ''}Le courant passe d’elle à Remerii sans un heurt. Pour la première fois de la nuit, le blizzard reprend des forces au lieu d’en prendre.`,
      'c18_conduit', [hylee, remeriiSurprised], { pov: 'hylee' }),
    c18_bh_dragon: {
      ...duelScene('s08', 3, 'Final · Le dragon de glace', BG_GIVRE, M_BLIZZARD,
        `Le dragon et le démon s’affrontent. Remerii vacille ; Hylee la tient. Où porter le dernier assaut ?`,
        null, [remeriiStrict], { fprev: 3 }),
      choices: [
        { label: 'Repousser Bhaal vers le portail', next: 'c18_bh_dragon_r', flags: { s08Dragon: 'portail' }, best: true },
        { label: 'Viser la gorge du démon', next: 'c18_bh_dragon_r', flags: { s08Dragon: 'gorge' } },
        { label: 'Ménager Remerii, tenir la ligne', next: 'c18_bh_dragon_r', flags: { s08Dragon: 'tenir' } },
      ],
    },
    c18_bh_dragon_r: withNext(duelScene('s08', 4, 'Final · Le dragon de glace', BG_GIVRE, M_BLIZZARD,
      pick('s08Dragon', {
        portail: 'Le dragon charge et pousse, et Bhaal recule d’un pas vers la faille, puis d’un autre. Remerii paie chaque pas d’un souffle qu’elle n’a plus.',
        gorge: 'Le dragon plonge sur la gorge du démon et y plante ses crocs. Bhaal rugit, plie, mais ses griffes trouvent la gorge du dragon en retour.',
        tenir: 'Hylee resserre sa prise. Le courant ralentit, s’apaise ; le dragon tient la ligne sans s’épuiser. Bhaal ne recule pas, mais il n’avance plus.',
      }),
      null, [remeriiStrict]), 'c18_valurn_renvoi', () => { const v = calc('s08', 4); return v.blizzard <= 0 ? 'c18_bh_gameover_blizzard' : v.pression > 5 ? 'c18_bh_gameover_bhaal' : null; }),
    c18_bh_fin: duelScene('s08', 5, 'Final · Bhaal repoussé', BG_GIVRE, M_BHAAL,
      `La pression de Bhaal retombe à rien. Le démon suprême est repoussé, mais le portail tient encore, affaibli, ouvert sur ce qui attend de l’autre côté.`,
      'c18_remerii_tombe', [hylee, remeriiStrict]),
    c18_bh_gameover_blizzard: gameOver('s08', 4, 'Le blizzard cède', BG_GIVRE,
      `Le sceau se réveille avant la fin. La tempête se brise sur Remerii elle-même, le Gardien s’effondre en poussière de givre, et Bhaal enjambe ce qui reste du blizzard.

Il passe le portail dans l’autre sens. Plus rien ne le retient.`),
    c18_bh_gameover_bhaal: gameOver('s08', 4, 'Bhaal passe', BG_GIVRE,
      `Le dragon tient la ligne, mais la ligne ne suffit plus. Bhaal pèse de tout son poids contre la tempête, pas après pas, jusqu’à ce que le blizzard s’ouvre devant lui comme une porte.

Il franchit le portail. Derrière lui, l’Ombre se déverse sur Medig.`),
    c18_bh_gameover_sync: gameOver('s08', 2, 'Le courant se rompt', BG_GIVRE,
      `Hylee referme la main trop tôt. L’Arcane lui file entre les doigts, le courant se rompt, et le blizzard de Remerii s’éteint d’un coup.

Bhaal franchit la tempête morte et passe le portail.`),

    c18_fin: {
      ...scene('Fin du Chapitre XVIII', BG_ALGRATAL, M_ALGRATAL, 'Narrateur',
        `Fin du Chapitre XVIII · Début de la fin.`, null, [hyleeF('calme', 'center')]),
      chapterEnd: true,
      get choices() {
        return flags().finaleReplay
          ? [{ label: 'Terminer la relecture', next: '__finale_replay_end' }, { label: 'Continuer', next: 'c19_trone' }]
          : [{ label: 'Continuer', next: 'c19_trone' }, { label: 'Retour au menu', next: 'menu' }];
      },
    },

/*@SCENES@*/
  });
  // Répliques des écrans écrits à la main : l’interface met en avant la silhouette du locuteur.
  Object.entries({
    c18_reponse_hylee: [['« Je ne te laisse pas seule', 'Hylee']],
  }).forEach(([k, v]) => { if (S[k]) S[k].voices = v; });
/*@ALIASES@*/

  // Plans clés S06 (branche Draven), S07 (branche Iriana) et S08 (chemin Remerii), copiés à l’identique (voir tools/finale-gen/shots.py) : décor, codex, cadrage.
  const SHOTS = [
/*@SHOTS@*/
  ];
  // Plans portés par une scène de duel : l’illustration remplace le décor, la silhouette s’efface.
  const DUEL_SHOTS = [
/*@DUEL_SHOTS@*/
  ];
  const SECTIONS = [['s06_', 'Le dernier adieu à Draven'], ['s07_', 'Iriana face à Alamma'], ['s08_', 'Remerii et Hylee face à Bhaal']];
  for (const [key, path, name, body] of SHOTS) {
    A[key] = path;
    CODEX_IMAGES[key] = { title: 'Chapitre XVIII · ' + name, body, src: path };
    CODEX_IMAGE_ORDER.push(key);
    window.SylviniaStoryCamera?.illustrate(key);
  }
  for (const [sid, key, camera] of DUEL_SHOTS) if (S[sid]) Object.assign(S[sid], { bg: key, hideChars: true, camera });
  CODEX_IMAGE_GROUPS.push({
    id: 'chapter18',
    title: chapter,
    sections: SECTIONS.map(([p, t]) => ({ title: t, keys: SHOTS.filter(([k]) => k.startsWith('c18_cg_' + p)).map(([k]) => k) })),
  });

  const ENTER_FLAGS = {
    c18_s06_fin: { c18PlayedDraven: true, s06DravenComplete: true },
    c18_s07_fin: { c18PlayedIriana: true, s07IrianaComplete: true },
    c18_fin: { c18PlayedRemerii: true, s08BlizzardComplete: true, chapter18Complete: true },
  };
  const REPLAY_RESTORE = ['c18_s06_fin', 'c18_s07_fin', 'c18_fin'];
  const refreshCarrefour = () => { S.c18_carrefour.choices = carrefourChoices(); };

  // Relecture depuis le menu des chapitres : les choix rejoués ne remplacent pas ceux de la vraie partie.
  const restoreReplay = (extra) => {
    const snap = flags().finaleReplay; if (!snap) return;
    state.flags = { ...snap.flags, ...extra, finaleReplay: snap };
  };

  const previousGo = go;
  go = window.go = function (next) {
    const args = Array.from(arguments);
    if (next === '__finale_replay_end') {
      const snap = flags().finaleReplay;
      if (snap) {
        const keep = { c18PlayedDraven: flags().c18PlayedDraven, c18PlayedIriana: flags().c18PlayedIriana, c18PlayedRemerii: flags().c18PlayedRemerii };
        state.flags = { ...snap.flags, ...Object.fromEntries(Object.entries(keep).filter(([, v]) => v)) };
        delete state.flags.finaleReplay;
        state.scene = snap.scene || 'c19_fin';
        state.history = [];
      }
      save();
      setScreen('title');
      return;
    }
    if (next === 'c18_carrefour') refreshCarrefour();
    if (ENTER_FLAGS[next]) {
      if (flags().finaleReplay && REPLAY_RESTORE.includes(next)) restoreReplay(ENTER_FLAGS[next]);
      else state.flags = { ...state.flags, ...ENTER_FLAGS[next] };
    }
    if (next === 'c19_trone' && flags().finaleReplay) {
      const f = flags(); const snap = f.finaleReplay;
      const keep = Object.fromEntries(['c18PlayedDraven', 'c18PlayedIriana', 'c18PlayedRemerii'].filter((k) => f[k]).map((k) => [k, true]));
      state.flags = { ...snap.flags, ...keep };
    }
    return previousGo.apply(this, args);
  };
  const previousRender = render;
  render = window.render = function () {
    if (state?.scene === 'c18_carrefour') refreshCarrefour();
    return previousRender.apply(this, arguments);
  };

  const available = (s) => Boolean(s && (
    s.devMode || String(s.scene).startsWith('c18_') || s.flags?.chapter17Complete
  ));

  CHAPTER_SELECT_DATA.push({
    key: 'ch18',
    label: 'Chapitre XVIII',
    title,
    subtitle: 'Bhaal',
    image: A[BG_GIVRE],
    tags: ['Draven', 'Iriana', 'Blizzard'],
    body: 'Le portail s’ouvre. Draven tient une crevasse, Iriana affronte son père, et Remerii se dresse seule devant Bhaal.',
    action: 'Ouvrir le Chapitre XVIII',
  });

  const previousUnlock = chapterSelectUnlocked;
  chapterSelectUnlocked = window.chapterSelectUnlocked = (key) =>
    key === 'ch18' ? available(readMainSave()) || available(state) : previousUnlock(key);

  const previousLaunch = launchChapterSelect;
  launchChapterSelect = window.launchChapterSelect = function (key) {
    if (key !== 'ch18') return previousLaunch.apply(this, arguments);
    const saved = readMainSave();
    if (!available(saved || state)) return;
    if (saved) load();
    const inProgress = String(state.scene).startsWith('c18_') && !['c18_fin', 'c18_carrefour', 'c18_carrefour_intro'].includes(state.scene);
    if (inProgress && !(flags().chapter18Complete && !flags().finaleReplay)) {
      setScreen('game');
      return render();
    }
    state.history = [];
    if (flags().chapter18Complete) {
      // Relecture : on revient au carrefour, déblocages conservés, la vraie progression est mise de côté.
      const snapFlags = { ...state.flags }; delete snapFlags.finaleReplay;
      const prior = flags().finaleReplay;
      state.flags = { ...state.flags, finaleReplay: prior || { scene: state.scene, flags: snapFlags } };
      setScreen('game');
      return go('c18_carrefour', { skipHistory: true });
    }
    return go(start, { skipHistory: true });
  };

  const previousRenderChapters = renderChapterSelect;
  renderChapterSelect = window.renderChapterSelect = function () {
    const result = previousRenderChapters.apply(this, arguments);
    const hint = document.querySelector('[data-chapter-launch="ch18"]')?.closest('.chapterSelectCard')?.querySelector('.chapterLockHint');
    if (hint) hint.textContent = 'Termine le Chapitre XVII.';
    return result;
  };

  const previousLabel = getSceneChapterLabel;
  getSceneChapterLabel = window.getSceneChapterLabel = (id = state.scene) =>
    String(id).startsWith('c18_') ? chapter : previousLabel(id);
})();
