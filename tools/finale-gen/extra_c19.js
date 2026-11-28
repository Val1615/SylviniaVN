/* Mode Histoire · Épilogue du Tome I (séquence S09) */
(() => {
  'use strict';

  const title = 'Épilogue';
  const chapter = 'Épilogue · Tome I';
  const start = 'c19_trone';

  const BG_TRONE = 'iriana_throneroom';
  const BG_CHAMBRE = 'c13g_bg_chambre';
  // Décors fournis par l’auteur pour le final (copiés à l’identique, voir docs/production/finale_assets_manifest.json).
  Object.assign(A, {
    finale_bg_porte_noire_plaine: 'assets/images/backgrounds/finale/bg_porte_noire_plaine.png',
    finale_bg_porte_noire_blizzard: 'assets/images/backgrounds/finale/bg_porte_noire_blizzard.png',
    finale_bg_champ_bataille: 'assets/images/backgrounds/finale/bg_champ_bataille.png',
    finale_bg_akuhn_nabad_ravin: 'assets/images/backgrounds/finale/bg_akuhn_nabad_ravin.png',
  });
  const BG_CHAMP = 'finale_bg_champ_bataille';
  const M_CONSEIL = 'music_c14_council_v0340';
  const M_CHAMBRE = 'music_c13g_une_nuit_soft';
  const M_REINE = 'music_c13i_amanea_reine_noire';
  const M_END = 'music_end';

  const saidinDown = ['saidin', 'saidin_downcast', 'right'];
  // Tia adulte et Allenna : sprites de la Chronique Alternative. Hylee garde sa forme finale.
  const tia = (e, pos = 'center') => ['tia', 'finale_tia_' + e, pos, 'finale-k'];
  const allenna = (e, pos = 'center') => ['allenna', 'finale_allenna_' + e, pos, 'finale-k'];
  const hyleeF = (e, pos = 'left') => ['hylee', 'hylee_finale_' + e, pos, 'finale-k'];

  const scene = (sub, bg, music, speaker, text, next, chars = []) => ({
    title: chapter, sub, bg, music, speaker, text, next, chars,
  });
  const flags = () => state.flags || {};

  Object.assign(S, {
/*@SCENES@*/

    // Variante issue des choix « Je reviendrai » (S02) et « Dans la tempête » (S08).
    c19_promesse: scene('Au chevet', BG_CHAMBRE, M_CHAMBRE, 'Narrateur',
      () => {
        const f = flags();
        const vow = {
          confiance: '« Tu as dit que tu reviendrais, souffle Hylee. Alors reviens. »',
          peur: '« Je n’ai pas eu le temps de te dire de revenir, souffle Hylee. Je te le dis maintenant. »',
        }[f.s02Adieu] || '« Reviens », souffle Hylee.';
        const hand = {
          seule: 'Elle avait promis de ne pas la laisser seule. Elle tient parole, heure après heure.',
          main: 'Sa main n’a pas quitté celle de Remerii. Elle l’a tendue dans la tempête ; elle ne la reprendra pas.',
        }[f.s08Reponse] || 'Sa main ne quitte pas celle de Remerii.';
        return `Les heures passent. Hylee se penche vers le visage endormi.

${vow}

${hand}`;
      },
      'c19_allenna', [hyleeF('triste', 'center')]),

    c19_bilan: scene('Fin du Tome I', BG_CHAMP, M_END, 'Narrateur',
        () => {
          const f = flags();
          const seen = ['Remerii et Hylee'];
          if (f.finaleSeenDraven) seen.push('Draven');
          if (f.finaleSeenIriana) seen.push('Iriana');
          return `Fin du Tome I · Les Chroniques de Sylvinia.

Points de vue vécus : ${seen.join(', ')}.

L’histoire continue dans le Tome II.`;
        }, 'c19_fin', [hyleeF('calme', 'left'), allenna('neutral', 'right')]),
    c19_fin: {
      ...scene('Fin du Tome I', BG_CHAMP, M_END, 'Narrateur', `Fin du Tome I.`, null, [hyleeF('calme', 'center')]),
      chapterEnd: true,
      choices: [{ label: 'Retour au menu', next: 'menu', flags: { tome1Complete: true } }],
    },
  });
  // Répliques des écrans écrits à la main : l’interface met en avant la silhouette du locuteur.
  Object.entries({
    c19_promesse: [['« Tu as dit que tu reviendrais', 'Hylee'], ['« Je n’ai pas eu le temps', 'Hylee'], ['« Reviens », souffle Hylee', 'Hylee']],
  }).forEach(([k, v]) => { if (S[k]) S[k].voices = v; });
/*@ALIASES@*/

  // La scène « Au chevet » s’intercale entre Saidin et Allenna.
  if (S.c19_saidin) {
    let id = 'c19_saidin';
    while (S[id] && S[id].next && S[id].next !== 'c19_allenna') id = S[id].next;
    if (S[id]) S[id].next = 'c19_promesse';
  }


  // Plans clés S09 (Épilogue), copiés à l’identique (voir tools/finale-gen/shots.py) : décor, codex, cadrage.
  const SHOTS = [
/*@SHOTS@*/
  ];
  const DUEL_SHOTS = [
/*@DUEL_SHOTS@*/
  ];
  for (const [key, path, name, body] of SHOTS) {
    A[key] = path;
    CODEX_IMAGES[key] = { title: 'Épilogue · ' + name, body, src: path };
    CODEX_IMAGE_ORDER.push(key);
    window.SylviniaStoryCamera?.illustrate(key);
  }
  for (const [sid, key, camera] of DUEL_SHOTS) if (S[sid]) Object.assign(S[sid], { bg: key, hideChars: true, camera });
  CODEX_IMAGE_GROUPS.push({
    id: 'chapter19',
    title: chapter,
    sections: [{ title: 'Le poids du deuil', keys: SHOTS.map(([k]) => k) }],
  });

  const previousGo = go;
  go = window.go = function (next) {
    if (next === 'c19_bilan' || next === 'c19_fin') state.flags = { ...state.flags, tome1Complete: true };
    return previousGo.apply(this, arguments);
  };

  const available = (s) => Boolean(s && (s.devMode || String(s.scene).startsWith('c19_') || s.flags?.chapter18Complete));

  CHAPTER_SELECT_DATA.push({
    key: 'ch19',
    label: 'Épilogue',
    title: 'Tome I',
    subtitle: 'Al’Gratal',
    image: A[BG_TRONE],
    tags: ['Deuil', 'Allenna'],
    body: 'Al’Gratal compte ses morts. Hylee veille Remerii, et Allenna jure de retrouver la lame qui a tué sa mère.',
    action: 'Ouvrir l’Épilogue',
  });

  const previousUnlock = chapterSelectUnlocked;
  chapterSelectUnlocked = window.chapterSelectUnlocked = (key) =>
    key === 'ch19' ? available(readMainSave()) || available(state) : previousUnlock(key);

  const previousLaunch = launchChapterSelect;
  launchChapterSelect = window.launchChapterSelect = function (key) {
    if (key !== 'ch19') return previousLaunch.apply(this, arguments);
    const saved = readMainSave();
    if (!available(saved || state)) return;
    if (saved) load();
    if (String(state.scene).startsWith('c19_') && state.scene !== 'c19_fin') {
      setScreen('game');
      return render();
    }
    state.history = [];
    return go(start, { skipHistory: true });
  };

  const previousRenderChapters = renderChapterSelect;
  renderChapterSelect = window.renderChapterSelect = function () {
    const result = previousRenderChapters.apply(this, arguments);
    const hint = document.querySelector('[data-chapter-launch="ch19"]')?.closest('.chapterSelectCard')?.querySelector('.chapterLockHint');
    if (hint) hint.textContent = 'Termine le Chapitre XVIII.';
    return result;
  };

  const previousLabel = getSceneChapterLabel;
  getSceneChapterLabel = window.getSceneChapterLabel = (id = state.scene) =>
    String(id).startsWith('c19_') ? 'Chapitre XIX · ' + chapter : previousLabel(id);  // « XIX » sert seulement au rangement de l’interface (carte ch19).

  const update = document.querySelector('.menuUpdateBubble');
  if (update) update.textContent = 'Mise à jour · v0.432 · Générique : la course de Hylee';
})();
