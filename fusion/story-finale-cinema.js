/* Mode Histoire · Cinématique de la métamorphose d’Amanea (c17_metamorphose).
   Le fichier vidéo est celui fourni par l’auteur, copié à l’identique
   (assets/video/finale/amanea_metamorphose.mp4). */
(() => {
  'use strict';

  const SCENE = 'c17_metamorphose';
  const SRC = 'assets/video/finale/amanea_metamorphose.mp4';
  const PRELOAD = new Set(['c17_sacrifiable', 'c17_sacrifiable_2', 'c17_sacrifiable_3', SCENE]);
  const OVERLAY_ID = 'finaleCinemaOverlay';
  const STYLE_ID = 'finale-cinema-style';

  A.video_finale_amanea_metamorphose = SRC;

  const CSS = `
    #${OVERLAY_ID}{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;background:#000;color:#f3e6c8}
    #${OVERLAY_ID}[hidden]{display:none!important}
    #${OVERLAY_ID} video{width:100%;height:100%;object-fit:contain;object-position:center;background:#000}
    #${OVERLAY_ID} .fcinema-skip{position:absolute;top:max(14px,env(safe-area-inset-top));right:max(14px,env(safe-area-inset-right));font:600 12px/1 Georgia,"Palatino Linotype",serif;letter-spacing:.08em;color:rgba(243,230,200,.82);background:rgba(8,10,18,.38);border:1px solid rgba(233,201,133,.32);border-radius:999px;padding:7px 14px;cursor:pointer;opacity:.72;pointer-events:auto}
    #${OVERLAY_ID} .fcinema-skip:hover,#${OVERLAY_ID} .fcinema-skip:focus-visible{opacity:1;border-color:rgba(233,201,133,.7);outline:none}
    #${OVERLAY_ID} .fcinema-prompt{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.42);pointer-events:auto}
    #${OVERLAY_ID} .fcinema-prompt[hidden]{display:none!important}
    #${OVERLAY_ID} .fcinema-play{font:600 15px/1.2 Georgia,"Palatino Linotype",serif;letter-spacing:.06em;color:#f3e6c8;background:rgba(8,10,18,.55);border:1px solid rgba(233,201,133,.55);border-radius:999px;padding:12px 22px;cursor:pointer}
    #${OVERLAY_ID} .fcinema-play:hover,#${OVERLAY_ID} .fcinema-play:focus-visible{border-color:#e9c985;outline:none}
    @media (prefers-reduced-motion:reduce){
      #${OVERLAY_ID},#${OVERLAY_ID} video,#${OVERLAY_ID} .fcinema-skip,#${OVERLAY_ID} .fcinema-prompt{animation:none!important;transition:none!important}
    }
  `;

  let playing = false;
  let visitDone = false;
  let token = 0;
  let fadeTimer = 0;
  let onKey = null;

  const game = () => (typeof state === 'undefined' ? null : state);
  const scenes = () => (typeof S === 'undefined' ? null : S);

  const musicEl = () => document.getElementById('music');
  const sliderVolume = () => {
    const el = document.getElementById('volume');
    const v = el ? parseFloat(el.value || '0.65') : 0.65;
    return Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : 0.65;
  };
  const musicWanted = () => !(game() && game().musicOn === false);

  const stopFade = () => { if (fadeTimer) { window.clearInterval(fadeTimer); fadeTimer = 0; } };

  const fadeTo = (target, ms, then) => {
    const m = musicEl();
    stopFade();
    if (!m) { then && then(); return; }
    const from = m.volume;
    const steps = Math.max(1, Math.round(ms / 40));
    let i = 0;
    fadeTimer = window.setInterval(() => {
      i += 1;
      try { m.volume = from + (target - from) * (i / steps); } catch (_e) { /* volume bloqué */ }
      if (i >= steps) {
        stopFade();
        try { m.volume = target; } catch (_e) { /* volume bloqué */ }
        then && then();
      }
    }, 40);
  };

  const cutGameMusic = (mine, then) => {
    const m = musicEl();
    if (!m || m.paused) { then && then(); return; }
    fadeTo(0, 420, () => {
      if (mine !== token) return;
      try { m.pause(); } catch (_e) { /* déjà en pause */ }
      then && then();
    });
  };

  const restoreMusicVolume = () => {
    const m = musicEl();
    if (m) try { m.volume = sliderVolume(); } catch (_e) { /* volume bloqué */ }
  };

  const resumeGameMusic = () => {
    const m = musicEl();
    restoreMusicVolume();
    if (!m || !musicWanted()) return;
    const st = game();
    const sc = st && scenes() && S[st.scene];
    const key = (sc && sc.music) || '';
    try { m.volume = 0; } catch (_e) { /* volume bloqué */ }
    if (key && typeof playMusic === 'function') playMusic(key);
    else if (m.src) m.play().catch(() => {});
    fadeTo(sliderVolume(), 650);
  };

  const ensureStyle = () => {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = CSS;
    document.head.append(style);
  };

  const ensureOverlay = () => {
    ensureStyle();
    let root = document.getElementById(OVERLAY_ID);
    if (root) return root;
    root = document.createElement('div');
    root.id = OVERLAY_ID;
    root.hidden = true;
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');
    root.setAttribute('aria-label', 'Cinématique · La métamorphose d’Amanea');
    root.innerHTML = `<video playsinline preload="auto"></video>
      <div class="fcinema-prompt" hidden><button type="button" class="fcinema-play">Toucher pour lancer</button></div>
      <button type="button" class="fcinema-skip">Passer</button>`;
    document.body.append(root);
    const video = root.querySelector('video');
    const skip = root.querySelector('.fcinema-skip');
    const playBtn = root.querySelector('.fcinema-play');
    skip.addEventListener('click', (ev) => { ev.preventDefault(); ev.stopPropagation(); finish('skip'); });
    playBtn.addEventListener('click', (ev) => { ev.preventDefault(); ev.stopPropagation(); tryPlay(true); });
    video.addEventListener('ended', () => finish('ended'));
    video.addEventListener('error', () => finish('error'));
    root.addEventListener('click', (ev) => ev.stopPropagation());
    root.addEventListener('pointerdown', (ev) => ev.stopPropagation());
    return root;
  };

  const applyVolume = (video) => {
    const vol = musicWanted() ? sliderVolume() : 0;
    video.muted = vol === 0;
    video.volume = vol;
  };

  const showPrompt = (on) => {
    const prompt = document.querySelector(`#${OVERLAY_ID} .fcinema-prompt`);
    if (prompt) prompt.hidden = !on;
  };

  const tryPlay = () => {
    const root = document.getElementById(OVERLAY_ID);
    const video = root && root.querySelector('video');
    if (!video) return;
    applyVolume(video);
    const run = video.play();
    if (run && typeof run.then === 'function') {
      run.then(() => showPrompt(false)).catch(() => showPrompt(true));
    }
  };

  const bindKeys = (on) => {
    if (onKey) { document.removeEventListener('keydown', onKey, true); onKey = null; }
    if (!on) return;
    onKey = (ev) => {
      if (!playing) return;
      if (ev.key === 'Escape' || ev.key === 'Esc') {
        ev.preventDefault();
        ev.stopPropagation();
        finish('skip');
      }
    };
    document.addEventListener('keydown', onKey, true);
  };

  const finish = (reason) => {
    if (!playing && !document.getElementById(OVERLAY_ID)) return;
    const staying = game() && game().scene === SCENE;
    token += 1;
    playing = false;
    visitDone = staying;
    stopFade();
    bindKeys(false);
    const root = document.getElementById(OVERLAY_ID);
    const video = root && root.querySelector('video');
    if (video) {
      try { video.pause(); } catch (_e) { /* déjà arrêtée */ }
    }
    if (root) {
      root.hidden = true;
      showPrompt(false);
    }
    if (staying) {
      const st = game();
      if (st && st.flags) st.flags.c17MetamorphoseCinemaSeen = true;
      resumeGameMusic();
    } else {
      restoreMusicVolume();
    }
    try { if (reason && reason !== 'leave') window.SylviniaFinaleCinema && (window.SylviniaFinaleCinema.lastEnd = reason); } catch (_e) { /* ignore */ }
  };

  const startCinema = (opts = {}) => {
    if (playing) return;
    if (!opts.force && visitDone) return;
    const st = game();
    if (!st || st.scene !== SCENE) return;
    const mine = ++token;
    playing = true;
    visitDone = false;
    const root = ensureOverlay();
    const video = root.querySelector('video');
    showPrompt(false);
    bindKeys(true);
    cutGameMusic(mine, () => {
      if (mine !== token || !game() || game().scene !== SCENE) return;
      root.hidden = false;
      try {
        if (video.getAttribute('src') !== SRC) video.src = SRC;
        video.currentTime = 0;
      } catch (_e) { /* currentTime indisponible tant que les métadonnées manquent */ }
      applyVolume(video);
      tryPlay();
    });
  };

  const preload = () => {
    try {
      if ([...document.querySelectorAll('link[rel="preload"]')].some((l) => l.href && l.href.endsWith(SRC))) return;
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'video';
      link.href = SRC;
      document.head.append(link);
    } catch (_e) { /* preload facultatif */ }
    const root = ensureOverlay();
    const video = root.querySelector('video');
    if (video && video.getAttribute('src') !== SRC) {
      video.preload = 'auto';
      video.src = SRC;
    }
  };

  const onScene = (from, to) => {
    if (PRELOAD.has(to)) preload();
    if (to !== SCENE) {
      if (playing || (document.getElementById(OVERLAY_ID) && !document.getElementById(OVERLAY_ID).hidden)) finish('leave');
      visitDone = false;
      return;
    }
    if (from !== SCENE) startCinema();
  };

  if (typeof go === 'function') {
    const previousGo = go;
    go = window.go = function (next) {
      const st = game();
      const from = st ? st.scene : null;
      const result = previousGo.apply(this, arguments);
      try { onScene(from, (game() && game().scene) || next); } catch (err) { console.error('[Sylvinia] Cinématique de la métamorphose', err); }
      return result;
    };
  }

  if (typeof playMusic === 'function') {
    const previousPlayMusic = playMusic;
    playMusic = window.playMusic = function () {
      const result = previousPlayMusic.apply(this, arguments);
      if (playing) {
        const m = musicEl();
        if (m) { try { m.pause(); m.volume = 0; } catch (_e) { /* déjà en pause */ } }
      }
      return result;
    };
  }

  const update = document.querySelector('.menuUpdateBubble');
  if (update) update.textContent = 'Mise à jour · v0.427 · Images clés S07';

  window.SylviniaFinaleCinema = {
    src: SRC,
    scene: SCENE,
    playing: () => playing,
    visitDone: () => visitDone,
    replay() {
      const st = game();
      if (st) st.scene = SCENE;
      visitDone = false;
      startCinema({ force: true });
    },
  };
})();
