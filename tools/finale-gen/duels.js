/* Mode Histoire · Final du Tome I · Moteur des duels S04, S06, S07, S08.
   Réutilise la grammaire native : classe combatMode du #stage, cartouche .combatHud/.combatBox/.combatTrack/.combatFill
   (repris par l’interface Bibliothèque dans .combat-hud), voile #combatTransition, chronomètre « …Timer » pour les QTE.
   Les jauges sont calculées à partir des flags du joueur : une sauvegarde ou un rechargement en plein duel restitue l’état exact. */
(() => {
  'use strict';

  const DUELS = {
    s04: {
      title: 'Valurn contre Amanea', mini: 'Duel central', pov: 'valurn',
      reset: ['s04M1', 's04M2', 's04M3', 's04M4', 's04M5', 's04Qte'],
      gauges: [
        { k: 'valurn', bad: 'down', name: 'Posture · Flammes noires', who: 'Valurn', start: 10, fill: 'linear-gradient(90deg,#2a0d47,#9b4dff 70%,#e3c2ff)' },
        { k: 'amanea', bad: 'up', name: 'Vitalité · Garde', who: 'Amanea', start: 10, fill: 'linear-gradient(90deg,#5c0b18,#e2384d 75%,#ffb3bd)' },
        { k: 'power', bad: 'up', name: 'Puissance révélée', who: 'Amanea', start: 0, from: 4, fill: 'linear-gradient(90deg,#ff3d00,#ffb23e 70%,#fff1c2)', glow: '#ff7a1a' },
      ],
      extra: { temps: 0 },
      events: [
        { key: 's04M1', map: { good: { amanea: -2 }, mid: { amanea: -1, valurn: -1 }, bad: { valurn: -4 } } },
        { key: 's04M2', map: { good: { amanea: -2 }, mid: { amanea: -1, valurn: -1 }, bad: { valurn: -4 } } },
        { key: 's04M3', map: { good: { amanea: -2 }, parade: { amanea: -2 }, mid: { amanea: -1, valurn: -1 }, bad: { valurn: -4 } } },
        { auto: { power: 7 } },
        { key: 's04M4', map: { good: { valurn: -1, power: 1, temps: 2 }, mid: { valurn: -2, power: 1, temps: 1 }, bad: { valurn: -4, power: 1 } } },
        { key: 's04M5', map: { good: { valurn: -1, power: 1, temps: 2 }, mid: { valurn: -2, amanea: -1, power: 1, temps: 1 }, bad: { valurn: -4, power: 1 } } },
        { key: 's04Qte', map: { ok: { amanea: -1, temps: 2, power: 1 } } },
      ],
      meta: (v, step) => [step < 4 ? 'Phase A · égalité trompeuse' : 'Phase B · puissance révélée',
        step < 4 ? `Seuil de rupture : garde ≤ 6` : `Temps gagné : ${v.temps} s`],
    },
    s06: {
      title: 'Draven dans la crevasse', mini: 'Survie', pov: 'draven',
      reset: ['s06Posture', 's06LinevaWords', 's06Plan', 's06Voute'],
      gauges: [
        { k: 'endurance', bad: 'down', name: 'Endurance de Draven', who: 'Draven', start: 10, fill: 'linear-gradient(90deg,#5a3d0c,#d9a83a 70%,#fff0b8)' },
        { k: 'horde', bad: 'up', name: 'Pression de la horde', who: 'Morts', start: 2, fill: 'linear-gradient(90deg,#1d2b19,#6f8f52 70%,#c9e3a5)', danger: true },
      ],
      events: [
        { key: 's06Posture', map: { tenir: { endurance: -2, horde: 1 }, reculer: { endurance: -1, horde: 2 }, charger: { endurance: -6 } } },
        { key: 's06LinevaWords', any: { endurance: 1 } },
        { auto: { endurance: -2, horde: 3 } },
        { key: 's06Plan', map: { combattre: { endurance: -3, horde: 1 }, courir: { endurance: -1, horde: 3 } } },
        { key: 's06Voute', map: { ok: { horde: -10 } } },
      ],
      meta: (v) => [v.horde >= 10 ? 'La horde déborde' : 'Survie sous pression', 'Horde à 10 : submergé'],
    },
    s07: {
      title: 'Iriana contre Alamma', mini: 'Duel arcanique', pov: 'iriana',
      reset: ['s07Maitrise', 's07Garde', 's07Flux', 's07Renversement'],
      gauges: [
        { k: 'arcane', bad: 'down', name: 'Arcane d’Iriana', who: 'Iriana', start: 8, fill: 'linear-gradient(90deg,#1c3f7a,#7fb8ff 70%,#e6dcff)' },
        { k: 'emprise', bad: 'up', name: 'Emprise d’Alamma', who: 'Alamma', start: 5, fill: 'linear-gradient(90deg,#2b2b33,#8a0f2a 70%,#ff8fa6)', danger: true },
        { k: 'chaos', bad: null, name: 'Chaos filtré (Ombre · Chaos · Mort)', who: 'Valurn', start: 0, from: 4, fill: 'linear-gradient(90deg,#12001c,#7a0f8f 55%,#ff3d7f)', glow: '#c0207a' },
      ],
      events: [
        { key: 's07Maitrise', map: { lire: { emprise: -2 }, frapper: { emprise: -1, arcane: -1 }, attendre: { emprise: 2, arcane: -2 } } },
        { auto: { emprise: 10, arcane: -6 } },
        { key: 's07Garde', map: { esprit: { arcane: 1 }, lacher: { arcane: -2 } } },
        { auto: { chaos: 6 } },
        { key: 's07Flux', map: { accord: { chaos: -2, arcane: 6, emprise: -3 } } },
        { auto: { emprise: -2 } },
        { key: 's07Renversement', map: { retenir: { emprise: -4 }, mort: { emprise: -5 }, tresse: { emprise: -6 }, question: { emprise: -2 } } },
      ],
      meta: (v, step) => [step < 2 ? 'Maîtrise' : step < 5 ? 'Domination subie' : 'Renversement', 'Arcane à 0 : brisée'],
    },
    s08: {
      title: 'Remerii et Hylee contre Bhaal', mini: 'Final coopératif', pov: 'remerii',
      reset: ['s08Gardien', 's08Reponse', 's08Brulure', 's08Arcane', 's08Sync', 's08Dragon'],
      gauges: [
        { k: 'pression', bad: 'up', name: 'Pression de Bhaal', who: 'Bhaal', start: 10, fill: 'linear-gradient(90deg,#3a0000,#d43a00 70%,#ffb070)', danger: true },
        { k: 'blizzard', bad: 'down', name: 'Blizzard · Résistance', who: 'Remerii', start: 9, fill: 'linear-gradient(90deg,#3a6f9a,#a8e4ff 70%,#ffffff)' },
        { k: 'flux', bad: 'down', name: 'Flux d’Arcane (Hylee)', who: 'Hylee', start: 0, from: 2, fill: 'linear-gradient(90deg,#1d3c8f,#6fb6ff 65%,#e9fbff)', glow: '#7fd3ff' },
      ],
      events: [
        { key: 's08Gardien', map: { assaut: { pression: -2, blizzard: -3 }, rempart: { pression: -1, blizzard: -2 }, tout: { pression: -4, blizzard: -7 } } },
        { auto: { blizzard: -2 } },
        { key: 's08Sync', map: { ok: { flux: 10, blizzard: 3, pression: -2 } } },
        { key: 's08Dragon', map: { gorge: { pression: -3, blizzard: -2 }, portail: { pression: -4, blizzard: -3 }, tenir: { pression: 0, blizzard: 1 } } },
        { auto: { pression: -10 } },
      ],
      meta: (v) => [v.pression <= 0 ? 'Bhaal repoussé · portail affaibli' : 'Retenir Bhaal', 'Résistance à 0 : le blizzard cède'],
    },
  };

  const flags = () => (typeof state !== 'undefined' && state && state.flags) || {};
  const clamp = (n) => Math.max(0, Math.min(10, n));
  const calc = (id, step) => {
    const d = DUELS[id]; const f = flags(); const v = { ...(d.extra || {}) };
    d.gauges.forEach((g) => { v[g.k] = g.start; });
    d.events.slice(0, step).forEach((ev) => {
      let fx = null;
      if (ev.auto) fx = ev.auto;
      else if (ev.any) fx = f[ev.key] != null ? ev.any : null;
      else fx = f[ev.key] != null ? ev.map[f[ev.key]] : null;
      if (fx) Object.entries(fx).forEach(([k, n]) => { v[k] = (v[k] || 0) + n; });
    });
    d.gauges.forEach((g) => { v[g.k] = clamp(v[g.k]); });
    return v;
  };

  const POV = { valurn: 'Le choix de Valurn', draven: 'Le choix de Draven', iriana: 'Le choix d’Iriana', hylee: 'Le choix d’Hylee', remerii: 'Le choix de Remerii', gameover: 'Après la défaite' };
  const povOf = (id) => { const s = typeof S !== 'undefined' && S[id]; if (!s) return null; return s.pov || (s.fduel && DUELS[s.fduel] && DUELS[s.fduel].pov) || null; };
  window.sylviniaChoiceHeader = (id) => { const p = povOf(id); return p ? POV[p] : ''; };

  const CSS = `.fdHud{grid-template-columns:repeat(var(--fd-n,3),minmax(0,1fr))!important;gap:10px!important}
.fdHud .combatBox{min-width:0;background:rgba(6,8,18,.38);border:1px solid rgba(255,255,255,.10);border-radius:10px;padding:6px 9px 7px;backdrop-filter:blur(2px)}
.fdHud .combatTop{display:flex;justify-content:space-between;gap:6px;align-items:baseline;font-size:11px;letter-spacing:.08em;text-transform:uppercase;line-height:1.15}
.fdHud .combatTop span:first-child{white-space:normal;min-width:0;line-height:1.12}
.fdHud[style*="--fd-n:3"] .combatTop{letter-spacing:.03em;font-size:10.5px}
.fdHud .combatTop b{font-variant-numeric:tabular-nums;color:#fff3cf}
.fdHud .fdWho{display:block;font-size:9.5px;letter-spacing:.18em;opacity:.7;text-transform:uppercase;margin-bottom:1px}
.fdHud .combatTrack{height:8px;border-radius:2px;overflow:hidden;background:rgba(0,0,0,.5);margin-top:4px}
.fdHud .combatFill{height:100%;animation:fdFill .75s cubic-bezier(.2,.8,.2,1) both}
.fdHud .fdReveal .combatFill{animation:fdFill 1.1s cubic-bezier(.7,0,.2,1) .7s both}
.fdHud .fdReveal{animation:fdPop .6s ease both}
.fdHud .fdLow .combatTrack{box-shadow:0 0 0 1px #ff5a5a,0 0 10px rgba(255,60,60,.55)}
.fdHud .fdDelta{font-size:10px;margin-left:4px;color:#ffd27a}.fdHud .fdDelta.neg{color:#ff8a8a}
.fdMeta{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-top:6px!important;font-size:12px!important;opacity:.88}
.fdQte{display:flex;align-items:center;gap:10px;margin-top:7px;padding:6px 10px;border-radius:10px;background:rgba(40,0,10,.45);border:1px solid rgba(255,190,120,.5)}
.fdQte .fdQteLab{font-weight:800;letter-spacing:.12em;text-transform:uppercase;font-size:12px;color:#ffd9a0;white-space:nowrap}
.fdQte .fdQteTrack{flex:1;height:7px;border-radius:4px;background:rgba(0,0,0,.55);overflow:hidden}
.fdQte .fdQteTrack i{display:block;height:100%;background:linear-gradient(90deg,#ff3d00,#ffd27a)}
.fdQte b{font-variant-numeric:tabular-nums;color:#fff;min-width:44px;text-align:right}
@keyframes fdFill{from{width:var(--from)}}
@keyframes fdPop{0%{opacity:0;transform:scale(.92)}60%{opacity:1;transform:scale(1.04)}100%{transform:none}}
@media (max-width:900px) and (max-height:600px){.fdHud .combatTop{font-size:9.5px;letter-spacing:.04em}.fdHud .fdWho{display:none}.fdHud .combatBox{padding:4px 7px 5px}.fdMeta{font-size:10.5px!important;margin-top:3px!important}.fdQte{margin-top:4px;padding:3px 8px}}`;
  const SHADOW_CSS = `.jeu.fd-shake .jeu-bg{animation:fdShake .45s cubic-bezier(.36,.07,.19,.97)}
.jeu.fd-flash .jeu-voile{animation:fdFlash .5s ease}
.jeu.fd-qte .choix .ch{animation:fdPulse 1s ease-in-out infinite;box-shadow:0 0 0 2px rgba(255,190,120,.8),0 0 22px rgba(255,120,40,.55)}
@keyframes fdShake{10%,90%{transform:translate3d(-2px,0,0)}20%,80%{transform:translate3d(4px,1px,0)}30%,50%,70%{transform:translate3d(-7px,-1px,0)}40%,60%{transform:translate3d(7px,1px,0)}}
@keyframes fdFlash{0%{background:rgba(255,80,40,.35)}100%{}}
@keyframes fdPulse{50%{transform:scale(1.03)}}`;
  const LIGHT_CSS = `#stage.fdShake .bg{animation:fdShakeL .45s}@keyframes fdShakeL{20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}`;

  const injectShadow = () => {
    const R = window.BibliothequeAstrale && BibliothequeAstrale.racine;
    if (R && !R.getElementById?.('fdShadowCss') && !R.querySelector('#fdShadowCss')) {
      const st = document.createElement('style'); st.id = 'fdShadowCss'; st.textContent = SHADOW_CSS; R.appendChild(st);
    }
    if (!document.getElementById('fdLightCss')) { const st = document.createElement('style'); st.id = 'fdLightCss'; st.textContent = LIGHT_CSS; document.head.appendChild(st); }
  };
  const jeu = () => window.BibliothequeAstrale && BibliothequeAstrale.racine && BibliothequeAstrale.racine.querySelector('.jeu');

  let audio;
  const sfx = (type) => {
    try {
      if (window.BibliothequeAstrale && BibliothequeAstrale.reg && BibliothequeAstrale.reg.sons === false) return;
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      if (audio.state === 'suspended') audio.resume().catch(() => {});
      const now = audio.currentTime;
      const tone = (f, t0, dur, typ, vol, f2) => { const o = audio.createOscillator(), g = audio.createGain(); o.type = typ; o.frequency.setValueAtTime(f, now + t0); if (f2) o.frequency.exponentialRampToValueAtTime(f2, now + t0 + dur); g.gain.setValueAtTime(.0001, now + t0); g.gain.exponentialRampToValueAtTime(vol, now + t0 + .01); g.gain.exponentialRampToValueAtTime(.0001, now + t0 + dur); o.connect(g).connect(audio.destination); o.start(now + t0); o.stop(now + t0 + dur + .05); };
      if (type === 'hit') { tone(90, 0, .25, 'sawtooth', .09, 45); tone(220, .02, .08, 'square', .04); }
      else if (type === 'ok') { tone(520, 0, .12, 'triangle', .06, 780); tone(780, .1, .2, 'sine', .05, 1040); }
      else if (type === 'tick') tone(880, 0, .04, 'square', .025);
      else if (type === 'start') { tone(110, 0, .6, 'sawtooth', .06, 220); tone(330, .2, .5, 'triangle', .05, 660); }
    } catch {}
  };
  const pulse = (cls) => {
    const j = jeu(); const st = document.getElementById('stage');
    if (j) { j.classList.remove(cls); void j.offsetWidth; j.classList.add(cls); setTimeout(() => j.classList.remove(cls), 600); }
    if (st && cls === 'fd-shake') { st.classList.remove('fdShake'); void st.offsetWidth; st.classList.add('fdShake'); setTimeout(() => st.classList.remove('fdShake'), 500); }
  };

  // ───── HUD ─────
  let last = { key: '', vals: null };
  const hudHtml = (sc, id, opts = {}) => {
    const d = DUELS[sc.fduel]; const step = sc.fstep || 0; const v = calc(sc.fduel, step);
    const prevStep = sc.fprev != null ? sc.fprev : Math.max(0, step - 1);
    const prev = opts.static ? v : (last.key === id && last.vals ? last.vals : calc(sc.fduel, prevStep));
    const shown = d.gauges.filter((g) => g.from == null || step >= g.from || sc.freveal === g.k);
    const boxes = shown.map((g) => {
      const reveal = sc.freveal === g.k && !opts.static;
      const from = reveal ? 0 : (prev[g.k] != null ? prev[g.k] : v[g.k]);
      const delta = v[g.k] - (opts.static ? v[g.k] : from);
      const low = g.bad === 'up' ? (g.k !== 'amanea' && v[g.k] >= 8) : g.bad === 'down' && v[g.k] <= 2;
      return `<div class="combatBox fd-${g.k}${reveal ? ' fdReveal' : ''}${low ? ' fdLow' : ''}"><div class="combatTop"><span><i class="fdWho">${g.who}</i>${g.name}</span><b>${v[g.k]}/10${delta && !reveal ? `<span class="fdDelta${delta < 0 ? ' neg' : ''}">${delta > 0 ? '+' : ''}${delta}</span>` : ''}</b></div><div class="combatTrack"><div class="combatFill" style="width:${v[g.k] * 10}%;--from:${from * 10}%;background:${g.fill};${g.glow ? `box-shadow:0 0 12px ${g.glow};` : ''}${opts.static ? 'animation:none;' : ''}"></div></div></div>`;
    }).join('');
    const meta = d.meta(v, step);
    const qte = opts.qte ? `<div class="fdQte"><span class="fdQteLab">⚡ ${opts.qte.label}</span><span class="fdQteTrack"><i style="width:${opts.qte.pct}%"></i></span><b id="fdQteTimer">${opts.qte.left.toFixed(1)} s</b></div>` : '';
    return { html: `<style>${CSS}</style><div class="combatHud fdHud" style="--fd-n:${shown.length}">${boxes}</div><div class="combatMeta fdMeta"><span>${d.mini} · ${meta[0]}</span><span>${meta[1]}</span></div>${qte}`, v, prev };
  };

  // ───── QTE ─────
  let qte = null;
  const stopQte = () => { if (qte) { clearInterval(qte.t); qte = null; } const j = jeu(); if (j) j.classList.remove('fd-qte'); };
  const paused = () => {
    if (document.hidden) return true;
    const g = document.getElementById('game'); if (g && g.classList.contains('hidden')) return true;
    const BA = window.BibliothequeAstrale;
    if (BA && document.body.classList.contains('ui-biblio')) {
      try { const e = BA.etat(); if (e && !e.passe && e.ecran !== 'jeu') return true; } catch {}
      try { if (BA.racine.querySelector('#couche.ouverte')) return true; } catch {}
    }
    if (document.querySelector('#combatTransition.active')) return true;
    return false;
  };
  const expire = () => {
    if (!qte) return false;
    const { id, sc } = qte; stopQte();
    if (state.scene !== id) return false;
    sfx('hit'); pulse('fd-shake');
    if (sc.fqte.failFlags) state.flags = { ...(state.flags || {}), ...sc.fqte.failFlags };
    go(sc.fqte.fail);
    return true;
  };
  const durationOf = (sc) => { const q = sc.fqte; const ms = typeof q.ms === 'function' ? q.ms() : q.ms; return Math.max(2500, ms || 6000); };
  const startQte = (sc, id) => {
    if (qte && qte.id === id) return;
    stopQte();
    const total = durationOf(sc);
    qte = { id, sc, total, left: total, delay: 900, t: 0 };
    let lastTick = Date.now();
    const tick = () => {
      if (!qte || state.scene !== id) { stopQte(); return; }
      const now = Date.now(); const dt = now - lastTick; lastTick = now;
      if (paused()) return;
      if (qte.delay > 0) { qte.delay -= dt; return; }
      qte.left -= dt;
      if (qte.left <= 0) { expire(); return; }
      const st = document.getElementById('stats');
      const { html } = hudHtml(sc, id, { static: true, qte: { label: sc.fqte.label, pct: Math.max(0, qte.left / qte.total * 100), left: qte.left / 1000 } });
      if (st) st.innerHTML = html;
      const j = jeu(); if (j && !j.classList.contains('fd-qte')) j.classList.add('fd-qte');
    };
    qte.t = setInterval(tick, 150);
  };

  // ───── Voile d’entrée (native #combatTransition) ─────
  let lastScene = '';
  const transition = (d) => {
    const overlay = document.getElementById('combatTransition'); if (!overlay) return;
    const t = overlay.querySelector('.combatTitle'), s = overlay.querySelector('.combatSub'), m = overlay.querySelector('.combatMini');
    if (t) t.textContent = d.title; if (s) s.textContent = d.sub || ''; if (m) m.textContent = 'Mode combat · ' + d.mini;
    overlay.classList.remove('hidden', 'active'); void overlay.offsetWidth; overlay.classList.add('active');
    sfx('start');
    clearTimeout(window.__fdTransitionTimer);
    window.__fdTransitionTimer = setTimeout(() => { overlay.classList.add('hidden'); overlay.classList.remove('active'); }, 1050);
  };

  const apply = () => {
    const id = state && state.scene; const sc = typeof S !== 'undefined' && S[id]; const stage = document.getElementById('stage');
    if (!stage) return;
    if (!qte || qte.id !== id) stopQte();
    if (!sc || !sc.fduel || !DUELS[sc.fduel]) { stage.classList.remove('fdActive'); lastScene = id; last = { key: '', vals: null }; return; }
    injectShadow();
    const d = DUELS[sc.fduel];
    stage.classList.add('combatMode', 'fdActive');
    const entering = lastScene !== id;
    const { html, v, prev } = hudHtml(sc, id, { static: !entering });
    const st = document.getElementById('stats'); if (st) st.innerHTML = html;
    if (entering) {
      if (sc.fintro) transition({ title: d.title, mini: d.mini, sub: sc.sub });
      const moved = (g, dir) => (dir === 'down' ? v[g.k] < prev[g.k] : v[g.k] > prev[g.k]);
      const hurt = d.gauges.some((g) => g.bad && moved(g, g.bad));
      const good = d.gauges.some((g) => g.bad && moved(g, g.bad === 'down' ? 'up' : 'down'));
      if (sc.fgameover || hurt) { setTimeout(() => { sfx('hit'); pulse('fd-shake'); }, 250); }
      else if (good) setTimeout(() => sfx('ok'), 250);
    }
    last = { key: id, vals: v };
    lastScene = id;
    if (sc.fqte) startQte(sc, id);
  };

  const previousRender = render;
  render = window.render = function () {
    const r = previousRender.apply(this, arguments);
    try { apply(); } catch (e) { console.warn('[finale-duels]', e); }
    return r;
  };

  window.SylviniaFinaleDuels = { DUELS, calc, expire, qteActive: () => (qte ? { id: qte.id, left: qte.left, total: qte.total } : null), hudHtml, durationOf };
})();
