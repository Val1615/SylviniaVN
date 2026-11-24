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
  const M_BHAAL = 'music_c10_culte';
  const M_IRIANA = 'music_iriana';
  const M_VALURN = 'music_c8_valurn_pacte';
  const M_BLIZZARD = 'music_x12i_glace_brisee';
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

  const carrefourChoices = () => {
    const list = [{ label: 'Poursuivre : Remerii / Hylee', next: 'c18_draven_seul', flags: { finalePerspective: 'remerii' } }];
    if (dravenUnlocked(state)) list.push({ label: 'Point de vue : Draven', next: 'c18_dp_intro', flags: { finalePerspective: 'draven', finaleSeenDraven: true } });
    if (irianaUnlocked(state)) list.push({ label: 'Point de vue : Iriana', next: 'c18_ip_intro', flags: { finalePerspective: 'iriana', finaleSeenIriana: true } });
    return list;
  };

  Object.assign(S, {
    c18_carrefour_intro: scene('Carrefour', BG_CHAMP, M_TENSION, 'Narrateur',
        () => {
          const extra = dravenUnlocked(state) || irianaUnlocked(state)
            ? '\n\nLes liens tissés en chemin ouvrent un autre regard sur cette nuit. Le récit reste le même ; un seul point de vue peut l’accompagner, l’autre pourra être revécu depuis le menu des chapitres.'
            : '';
          return `Chapitre XVIII · Début de la fin

La Reine Noire est tombée. Le portail brûle encore. Sur le champ de bataille, plusieurs destins se jouent au même instant, à quelques lieues les uns des autres.${extra}`;
        }, 'c18_carrefour'),
    c18_carrefour: {
      ...scene('Carrefour', BG_CHAMP, M_TENSION, 'Narrateur', `Quel regard porter sur cette nuit ?`),
      choices: carrefourChoices(),
    },

    // ───── Point de vue : Draven (S06) ─────
    c18_dp_intro: scene('Point de vue · Draven', BG_CREVASSE, M_DRAVEN, 'Narrateur',
      `Pendant ce temps, loin du portail, l’Amiral de Forthaven se bat encore. Cette nuit, c’est à travers ses yeux qu’elle se vit, et ce sont ses gestes qui la décident.`,
      'c18_draven_seul', [dravenSoot]),
    c18_dp_crevasse: {
      ...scene('Point de vue · Draven', BG_CREVASSE, M_DRAVEN, 'Narrateur',
        `Deux parois, une entrée, une grotte dans son dos.`,
        null, [dravenSoot]),
      choices: [
        { label: 'Tenir l’entrée de la crevasse', next: 'c18_dp_crevasse_r', flags: { s06Posture: 'tenir' } },
        { label: 'Reculer pas à pas vers la grotte', next: 'c18_dp_crevasse_r', flags: { s06Posture: 'reculer' } },
      ],
    },
    c18_dp_crevasse_r: scene('Point de vue · Draven', BG_CREVASSE, M_DRAVEN, 'Narrateur',
      () => flags().s06Posture === 'reculer'
        ? `Les morts ne tiennent aucun compte de la fatigue ; lui, si. Il cède du terrain, un pas par mort tombé. La paroi se rapproche dans son dos, froide, et il sent dans la roche une veine fendue qui court jusqu’au plafond de la grotte. Il s’en souviendra.`
        : `Les morts ne tiennent aucun compte de la fatigue ; lui, si. Il plante ses bottes dans la caillasse. Ici, ils ne passent qu’à trois de front. Il en abat trois. Puis trois autres. Il sait déjà que l’arithmétique ne sera pas de son côté.`,
      'c18_pere', [dravenSoot]),
    c18_dp_lineva: {
      ...scene('Point de vue · Draven', BG_CREVASSE, M_LINEVA, 'Narrateur',
        `La voix grésille encore. Il a une seconde. Une seule.`,
        null, [dravenLineva]),
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
      ...scene('Point de vue · Draven', BG_CREVASSE, M_DRAVEN, 'Narrateur',
        `Plus de place pour reculer. Reste à choisir comment entrer dans la grotte.`,
        null, [dravenAngry]),
      choices: [
        { label: 'Courir sans se retourner', next: 'c18_dp_grotte_r', flags: { s06Plan: 'courir' } },
        { label: 'Reculer en combattant', next: 'c18_dp_grotte_r', flags: { s06Plan: 'combattre' } },
      ],
    },
    c18_dp_grotte_r: scene('Point de vue · Draven', BG_CREVASSE, M_DRAVEN, 'Narrateur',
      () => (flags().s06Posture === 'reculer' ? 'Au-dessus de l’entrée, la veine fendue est là, exactement où il l’avait sentie. ' : '') + (flags().s06Plan === 'combattre'
        ? `Il entre à reculons, la lame devant lui. Chaque mort qui franchit le seuil en entraîne trois autres derrière lui. C’est exactement ce qu’il veut.`
        : `Il ne compte plus. Il court, l’épaule en avant, et les morts s’engouffrent derrière lui comme l’eau dans une écluse.`),
      'c18_temporise', [dravenAngry]),
    c18_dp_adieu: scene('Point de vue · Draven', BG_CREVASSE, M_PLAINTE_I, 'Narrateur',
      () => {
        const words = {
          promesse: 'Ses derniers mots à Lineva étaient une promesse. Il l’a laissée à d’autres le soin de la tenir.',
          mere: 'Ses derniers mots à Lineva lui confiaient sa mère. Ce soir, à Forthaven, deux femmes attendent le même homme.',
          fierte: 'Ses derniers mots à Lineva disaient sa fierté. C’est la seule chose qu’il n’ait jamais eu de mal à lui donner.',
        }[flags().s06LinevaWords] || '';
        return `Les plaques dans une main. Le médaillon dans l’autre. Entre les deux, toute une vie qu’il a tenue jusqu’au bout.${words ? '\n\n' + words : ''}

Le récit reprend auprès de ceux qui restent.`;
      },
      'c18_trop_tard'),

    // ───── Point de vue : Iriana (S07) ─────
    c18_ip_intro: scene('Point de vue · Iriana', BG_PORTE, M_IRIANA, 'Narrateur',
      `La nuit d’Iriana commence au pied du corps d’Amanea et se poursuit là où personne ne pourra la suivre. Ce qu’ont vécu Draven, Tia et Remerii reste le même. Au portail, ce sont ses gestes à elle qui décident.`,
      'c18_draven_seul', [irianaStern]),
    c18_ip_maitrise: {
      ...scene('Point de vue · Iriana', BG_PORTE, M_IRIANA, 'Narrateur',
        `L’air se resserre autour d’Iriana. Ce sort porte la signature de son père.`,
        null, [irianaStern]),
      choices: [
        { label: 'Défaire le sort avant qu’il ne se referme', next: 'c18_ip_maitrise_r', flags: { s07Maitrise: 'lire' } },
        { label: 'Frapper la première', next: 'c18_ip_maitrise_r', flags: { s07Maitrise: 'frapper' } },
      ],
    },
    c18_ip_maitrise_r: scene('Point de vue · Iriana', BG_PORTE, M_IRIANA, 'Narrateur',
      () => `${flags().s07Maitrise === 'frapper'
        ? 'Elle l’a vu dans les livres de son enfance. Un trait d’Arcane pure jaillit de sa paume. Alamma le dévie d’un revers, mais il a dû le dévier. Iriana gagne un pas, puis un autre.'
        : 'Elle l’a vu dans les livres de son enfance. Ses doigts tracent le contre-glyphe à l’envers, comme il le lui avait appris sans le savoir. L’étreinte se dénoue. Alamma hausse un sourcil : sa fille vient de le surprendre.'}

Le deuxième sort, elle le brise encore. Le troisième ne lui laisse rien à briser. Il tombe sur elle de tout son poids, et l’Arcane d’Iriana se tait.`,
      'c18_pacte_valurn', [irianaStern]),
    c18_ip_flux: {
      ...scene('Point de vue · Iriana', BG_PORTE, M_IRIANA, 'Narrateur',
        `Le fragment est en elle, sombre et lourd. Qu’en fait-elle ?`,
        null, [irianaTroubled]),
      choices: [
        { label: 'Le laisser se modeler à l’Arcane', next: 'c18_ip_flux_r', flags: { s07Flux: 'accord' } },
        { label: 'S’en emparer de force', next: 'c18_ip_flux_r', flags: { s07Flux: 'force' } },
      ],
    },
    c18_ip_flux_r: scene('Point de vue · Iriana', BG_PORTE, M_IRIANA, 'Narrateur',
      () => flags().s07Flux === 'force'
        ? `Elle referme son esprit dessus comme une main sur une lame. Le pouvoir répond, brutal, et lui laisse au creux des paumes une brûlure qui ne s’effacera pas avant longtemps.`
        : `Elle ne saisit rien. Elle laisse la chose trouver sa place, comme une eau trouve sa pente. Le halo sombre s’adoucit. La douleur reste, mais elle a une forme.`,
      'c18_peu_importe', [irianaTroubled]),
    c18_ip_renversement: {
      ...scene('Point de vue · Iriana', BG_PORTE, M_IRIANA, 'Narrateur',
        `Il recule vers la faille. Encore un pas, et il sera hors d’atteinte.`,
        null, [irianaStern]),
      choices: [
        { label: 'L’enserrer d’ombres', next: 'c18_ip_renversement_r', flags: { s07Renversement: 'retenir' } },
        { label: 'Exiger une réponse', next: 'c18_ip_renversement_r', flags: { s07Renversement: 'question' } },
      ],
    },
    c18_ip_renversement_r: scene('Point de vue · Iriana', BG_PORTE, M_IRIANA, 'Narrateur',
      () => `${flags().s07Renversement === 'question'
        ? '« Le pacte ! crie-t-elle. Dis-moi comment le briser ! »\n\nAlamma la regarde, et pour la première fois, il hésite. Il ne répond pas.'
        : 'Les vrilles noires jaillissent, plus vite que tout à l’heure. Elles se referment sur son poignet, sur sa cheville. Pendant une seconde, Iriana tient son père.'}

${flags().s07Flux === 'force'
        ? 'Le Chaos murmure plus fort, à présent. Il lui souffle de serrer. De détruire.'
        : 'L’Arcane tient le reste en bride. Pour l’instant.'}`,
      'c18_chute_alamma', [irianaStern]),

    // ───── S08 · Tronc commun : Remerii, Hylee, Bhaal ─────
    c18_choix_hylee: {
      ...scene('Dans la tempête', BG_GIVRE, M_BLIZZARD, 'Narrateur',
        `Le vent arrache les mots d’Hylee avant qu’elle ne les forme. Lesquels garder ?`,
        null, [hylee, remeriiSad]),
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
      choices: [
        { label: 'L’attraper au vol', next: 'c18_arcane_brule', flags: { s08Brulure: true } },
        { label: 'La laisser venir', next: 'c18_conduit', flags: { s08Arcane: 'accueillie' } },
      ],
    },
    c18_arcane_brule: scene('Trop vite', BG_GIVRE, M_BLIZZARD, 'Narrateur',
      `Ses doigts se referment sur le vide. Le froid la mord jusqu’au coude, l’Arcane lui file entre les doigts comme une eau brûlante.

Si tu refermes la main trop vite, elle te brûlera.

Hylee rouvre la main, haletante. La leçon de Remerii est encore là, au creux de sa paume.`,
      'c18_choix_arcane', [hylee]),

    c18_fin: {
      ...scene('Fin du Chapitre XVIII', BG_ALGRATAL, M_ALGRATAL, 'Narrateur',
        `Fin du Chapitre XVIII · Début de la fin.`),
      chapterEnd: true,
      choices: [
        { label: 'Continuer', next: 'c19_trone' },
        { label: 'Retour au menu', next: 'menu' },
      ],
    },

/*@SCENES@*/
  });

  // Insertion des scènes de point de vue dans le récit commun (le texte du roman reste identique pour tous).
  const INSERTS = [
    ['draven', 'c18_pere', 'c18_dp_crevasse', ['c18_dp_crevasse', 'c18_dp_crevasse_r']],
    ['draven', 'c18_je_rentre', 'c18_dp_lineva', ['c18_dp_lineva']],
    ['draven', 'c18_grotte', 'c18_dp_echo', ['c18_dp_echo']],
    ['draven', 'c18_temporise', 'c18_dp_grotte', ['c18_dp_grotte', 'c18_dp_grotte_r']],
    ['draven', 'c18_trop_tard', 'c18_dp_adieu', ['c18_dp_adieu']],
    ['iriana', 'c18_pacte_valurn', 'c18_ip_maitrise', ['c18_ip_maitrise', 'c18_ip_maitrise_r']],
    ['iriana', 'c18_peu_importe', 'c18_ip_flux', ['c18_ip_flux', 'c18_ip_flux_r']],
    ['iriana', 'c18_chute_alamma', 'c18_ip_renversement', ['c18_ip_renversement', 'c18_ip_renversement_r']],
  ];
  const ENTER_FLAGS = {
    c18_gardien: { s06DravenComplete: true, s07IrianaComplete: true },
    c18_fin: { s08BlizzardComplete: true, chapter18Complete: true },
  };
  const refreshCarrefour = () => { S.c18_carrefour.choices = carrefourChoices(); };

  const previousGo = go;
  go = window.go = function (next) {
    const args = Array.from(arguments);
    if (next === 'c18_carrefour') refreshCarrefour();
    for (const [who, target, insert, own] of INSERTS) {
      if (next === target && perspective() === who && !own.includes(state.scene)) {
        args[0] = insert;
        break;
      }
    }
    if (ENTER_FLAGS[args[0]]) state.flags = { ...state.flags, ...ENTER_FLAGS[args[0]] };
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
    if (String(state.scene).startsWith('c18_') && !['c18_fin', 'c18_carrefour', 'c18_carrefour_intro'].includes(state.scene)) {
      setScreen('game');
      return render();
    }
    state.history = [];
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
