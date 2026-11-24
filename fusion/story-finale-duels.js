/* Mode Histoire · Final du Tome I · Moteur des duels S04, S06, S07, S08 (v2 : mise en scène épique).
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
      // Duel « ontologique » : en phase I, Amanea se lit (intention visible, tours alternés) ;
      // à la révélation, elle devient illisible, joue deux fois, et son nom même vacille dans l’interface.
      phaseOf: (id, step) => (/^c17_(m5|qte)/.test(id) ? 3 : step >= 4 ? 2 : 1),
      whoOf: (g, phase) => (phase >= 2 && (g.k === 'amanea' || g.k === 'power') ? '<s>Amanea</s> Reine Noire' : g.who),
      tactics: (id, v, step) => {
        const ph = DUELS.s04.phaseOf(id, step);
        const names = { 1: 'Phase I · Ce qu’il lit', 2: 'Phase II · Ce qu’elle est', 3: 'Phase III · Le temps volé' };
        const I = {
          c17_duel_intro: ['◎', 'lire son geste avant chaque échange'],
          c17_m1_lecture: ['◎', 'elle guette les bords du brasier'], c17_m1: ['◎', 'elle guette les bords du brasier'],
          c17_m2_lecture: ['▼', 'frapper le sol, pas lui'], c17_m2: ['▼', 'frapper le sol, pas lui'],
          c17_m3_lecture: ['◐', 'flanc gauche couvert · garde haute ouverte'], c17_m3: ['◐', 'flanc gauche couvert · garde haute ouverte'],
          c17_revelation: ['✕', 'illisible', 1],
          c17_m4_lecture: ['✕', 'ses coups ne se lisent plus', 1], c17_m4: ['✕', 'ses coups ne se lisent plus', 1], c17_m4_r: ['✕', 'illisible', 1],
          c17_m5_lecture: ['⟶', 'le portail · en finir'], c17_m5: ['⟶', 'le portail · en finir'],
          c17_qte: ['⚡', `la griffe vers la gorge · fenêtre ${(DUELS.s04.qteMs(v) / 1000).toFixed(1)} s`],
        };
        const choice = /^c17_m\d$|^c17_qte$/.test(id), lecture = /_lecture$|_intro$|^c17_revelation$/.test(id);
        const R = ph === 1 ? 'a' : 'r';
        let order;
        if (ph === 1) order = choice ? ['v*', 'a', 'v', 'a', 'v'] : ['a*', 'v', 'a', 'v', 'a'];
        else if (ph === 2) order = choice ? ['v*', 'r', 'r', 'v', 'r'] : ['r*', 'r', 'v', 'r', 'r'];
        else order = id === 'c17_qte' ? ['v*', 't'] : id === 'c17_qte_ok' ? ['t*'] : choice ? ['v*', 'r', 'r', 'r', 't'] : ['r*', 'r', 'r', 'v', 't'];
        void lecture; void R;
        return { phase: ph, name: names[ph], intent: I[id] || null, order };
      },
      qteMs: (v) => 4200 + v.valurn * 250 + (v.temps || 0) * 300,
      stamps: {
        c17_m1_r: (f) => ({ good: 'Lecture juste', mid: 'Échange', bad: 'Lu par elle' })[f.s04M1],
        c17_m2_r: (f) => ({ good: 'Lecture juste', mid: 'Échange', bad: 'Lu par elle' })[f.s04M2],
        c17_m3_r: (f, v) => (v.amanea <= 6 && v.valurn > 0 ? 'Garde rompue' : 'Seuil manqué'),
        c17_m4_r: (f) => ({ good: 'Temps volé +2 s', mid: 'Piège à moitié', bad: 'Parade brisée' })[f.s04M4],
        c17_m5_r: (f) => ({ good: 'Une minute', mid: 'Elle saigne', bad: 'Retrouvé' })[f.s04M5],
      },
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
.fdHud{position:relative}
.fdHud .combatBox{position:relative;transition:opacity 1.2s ease,filter 1.2s ease}
.fdHud[data-mood=urgence][data-int=intense]{animation:fdJit 2.6s steps(1) infinite}
.fdHud[data-mood=urgence][data-qte][data-int=intense]{animation:fdJit .32s steps(1) infinite}
.fdHud[data-mood=urgence] .fdLow .combatTrack{animation:fdLowBeat .8s ease-in-out infinite}
.fdHud[data-mood=desespoir] .combatBox{opacity:.8;filter:saturate(.5) brightness(.9)}
.fdHud[data-mood=desespoir] .combatFill{animation-duration:2.6s;animation-timing-function:cubic-bezier(.5,0,.6,1)}
.fdHud[data-mood=desespoir] .combatBox::after,.fdHud[data-mood=gameover] .combatBox::after{content:"";position:absolute;inset:0;pointer-events:none;opacity:.55;border-radius:inherit;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 40' preserveAspectRatio='none'%3E%3Cpath d='M120 0 L112 11 L124 17 L108 28 L114 40 M112 11 L96 9 M124 17 L140 22 L150 19 M108 28 L92 33' fill='none' stroke='%23e8dcc8' stroke-width='.9' stroke-opacity='.75'/%3E%3C/svg%3E") center/100% 100% no-repeat}
.fdHud[data-mood=gameover]{opacity:.5;filter:grayscale(.85);transition:opacity 2s ease,filter 2s ease}
.fdHud[data-mood=gameover] .combatFill{animation-duration:3s}
.fdHud[data-mood=apaisement]{opacity:.78;transition:opacity 2s ease}
.fdFxBtn{font:inherit;font-size:10.5px;letter-spacing:.06em;color:#f3e6c8;background:rgba(6,8,18,.35);border:1px solid rgba(233,201,133,.35);border-radius:999px;padding:1px 8px;cursor:pointer;pointer-events:auto}
.fdFxBtn:hover,.fdFxBtn:focus-visible{border-color:#e9c985;outline:none}
.fdFxBtn[disabled]{opacity:.6;cursor:default}
.fdQte.fdQteLast{border-color:rgba(255,80,80,.9);background:rgba(70,0,10,.55)}
.fdQte.fdQteLast b{color:#ff8a8a}
.fdQte.fdQteLast .fdQteTrack i{background:linear-gradient(90deg,#ff1a1a,#ff7a3d)}
.fdQteOn[data-int=intense] .fdQte.fdQteLast{animation:fdLowBeat .45s ease-in-out infinite}
.fdTac{display:flex;align-items:center;gap:9px;margin-top:6px;font-size:11.5px;line-height:1.2;min-width:0}
.fdPhase{font-family:"Cinzel",serif;font-size:10px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#e9c985;white-space:nowrap;padding:3px 8px;border:1px solid rgba(233,201,133,.5);background:rgba(6,8,18,.4);transform:skewX(-12deg)}
.fdTac[data-phase="2"] .fdPhase{color:#d9c2ff;border-color:rgba(155,77,255,.7);box-shadow:0 0 10px rgba(110,255,150,.18)}
.fdTac[data-phase="3"] .fdPhase{color:#ffe3a0;border-color:rgba(255,120,60,.8);background:rgba(60,10,0,.45)}
.fdIntent{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#e8dcc8;opacity:.95}
.fdIntent i{font-style:normal;color:#ff9a6a;margin-right:5px}
.fdIntent b{font-weight:600;color:#fff8ea}
.fdIllisible i{color:#8cff9e}
.fdIllisible b{color:#c9b3ee;letter-spacing:.2em;filter:blur(.5px);text-shadow:2px 0 rgba(120,255,160,.45),-2px 0 rgba(200,60,255,.45)}
.fdTac[data-int=intense] .fdIllisible b{animation:fdGlitch 1.7s steps(2) infinite}
.fdOrder{display:flex;gap:3px;flex:none}
.fdOrder span{width:19px;height:19px;display:grid;place-items:center;font:700 10px/1 "Cinzel",serif;transform:skewX(-12deg);background:rgba(6,8,18,.55);border:1px solid rgba(255,255,255,.22);color:#ddd;opacity:.72}
.fdOrder .v{border-color:#9b4dff;color:#e3c2ff}
.fdOrder .a{border-color:#e2384d;color:#ffb3bd}
.fdOrder .r{border-color:#58e08a;color:#c8ffd8;background:rgba(30,0,40,.7)}
.fdOrder .t{border-color:#e9c985;color:#ffe3a0;font-size:9px}
.fdOrder .now{opacity:1;box-shadow:0 0 9px currentColor;transform:skewX(-12deg) scale(1.16)}
.fdHud .fdWho s{opacity:.5;margin-right:4px;text-decoration-thickness:1px}
.fdHud[data-phase="2"] .combatBox,.fdHud[data-phase="3"] .combatBox{border-color:rgba(155,77,255,.42);box-shadow:inset 0 0 16px rgba(90,255,150,.07)}
.fdHud[data-phase="2"] .fd-amanea,.fdHud[data-phase="2"] .fd-power,.fdHud[data-phase="3"] .fd-amanea,.fdHud[data-phase="3"] .fd-power{border-color:rgba(88,224,138,.5);background:rgba(20,0,30,.5)}
.fdHud[data-phase="3"] .fd-valurn{border-color:rgba(255,120,60,.6)}
.fdHud[data-phase="2"] .fd-valurn::after,.fdHud[data-phase="3"] .fd-valurn::after{content:"";position:absolute;inset:0;pointer-events:none;opacity:.4;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 40' preserveAspectRatio='none'%3E%3Cpath d='M30 0 L38 14 L26 22 L40 40 M38 14 L56 12' fill='none' stroke='%23d9c2ff' stroke-width='.9'/%3E%3C/svg%3E") center/100% 100% no-repeat}
.fdHud .fdFlip .fdWho{animation:fdFlipName 1.6s ease both .3s}
@keyframes fdGlitch{0%{transform:translateX(0)}50%{transform:translateX(1px) skewX(-6deg)}}
@keyframes fdFlipName{0%{opacity:1;filter:none}30%{opacity:0;filter:blur(3px)}55%{opacity:0}100%{opacity:1;filter:none}}
@keyframes fdJit{0%,88%,100%{transform:none}90%{transform:translate(1.5px,-1px)}93%{transform:translate(-2px,1px)}96%{transform:translate(1px,1px)}}
@keyframes fdLowBeat{50%{box-shadow:0 0 0 1px #ff5a5a,0 0 16px rgba(255,60,60,.8)}}
@media (prefers-reduced-motion:reduce){.fdHud,.fdHud *,.fdQte{animation:none!important}}
@media (max-height:600px){.fdTac{margin-top:3px;font-size:10px;gap:6px}.fdPhase{font-size:8.5px;padding:2px 5px;letter-spacing:.06em}.fdOrder span{width:14px;height:14px;font-size:8px}}
@media (max-width:560px){.fdOrder{display:none}}
@media (max-width:900px) and (max-height:600px){.fdFxBtn{font-size:9.5px;padding:0 6px}.fdHud .combatTop{font-size:9.5px;letter-spacing:.04em}.fdHud .fdWho{display:none}.fdHud .combatBox{padding:4px 7px 5px}.fdMeta{font-size:10.5px!important;margin-top:3px!important}.fdQte{margin-top:4px;padding:3px 8px}}`;
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
      const noise = (t0, dur, freq, vol) => { const b = audio.createBuffer(1, Math.floor(audio.sampleRate * dur), audio.sampleRate), dd = b.getChannelData(0); for (let i = 0; i < dd.length; i++) dd[i] = (Math.random() * 2 - 1) * (1 - i / dd.length); const s = audio.createBufferSource(); s.buffer = b; const f = audio.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = freq; const g = audio.createGain(); g.gain.value = vol; s.connect(f).connect(g).connect(audio.destination); s.start(now + t0); };
      if (type === 'hit') { tone(90, 0, .25, 'sawtooth', .09, 45); tone(220, .02, .08, 'square', .04); }
      else if (type === 'ok') { tone(520, 0, .12, 'triangle', .06, 780); tone(780, .1, .2, 'sine', .05, 1040); }
      else if (type === 'tick') tone(880, 0, .04, 'square', .025);
      else if (type === 'start') { tone(110, 0, .6, 'sawtooth', .06, 220); tone(330, .2, .5, 'triangle', .05, 660); }
      else if (type === 'coeur') { tone(62, 0, .16, 'sine', .16, 44); tone(58, .24, .2, 'sine', .11, 40); }
      else if (type === 'impact') { noise(0, .22, 900, .08); tone(70, 0, .3, 'sine', .14, 38); }
      else if (type === 'bascule') { tone(48, 0, 1.1, 'sawtooth', .07, 30); noise(.05, .7, 300, .06); tone(330, .42, .9, 'triangle', .045, 990); tone(495, .55, .8, 'sine', .035, 1320); }
    } catch {}
  };
  const pulse = (cls) => {
    if (cls === 'fd-shake') hitFx();
    if (intensity() !== 'intense') return;
    const j = jeu(); const st = document.getElementById('stage');
    if (j) { j.classList.remove(cls); void j.offsetWidth; j.classList.add(cls); setTimeout(() => j.classList.remove(cls), 600); }
    if (st && cls === 'fd-shake') { st.classList.remove('fdShake'); void st.offsetWidth; st.classList.add('fdShake'); setTimeout(() => st.classList.remove('fdShake'), 500); }
  };

  // ───── HUD ─────
  const TOK = { v: ['V', 'Valurn'], a: ['A', 'Amanea'], r: ['R', 'La Reine Noire'], t: ['⌛', 'Le temps volé'] };
  const tacHtml = (t, it) => {
    const order = t.order.map((o) => { const k = o[0]; const now = o.endsWith('*'); return `<span class="${k}${now ? ' now' : ''}" title="${TOK[k][1]}">${TOK[k][0]}</span>`; }).join('');
    const intent = t.intent ? `<span class="fdIntent${t.intent[2] ? ' fdIllisible' : ''}"><i>${t.intent[0]}</i>Intention : <b>${t.intent[1]}</b></span>` : '<span class="fdIntent"></span>';
    return `<div class="fdTac" data-phase="${t.phase}" data-int="${it}"><span class="fdPhase">${t.name}</span>${intent}<span class="fdOrder" aria-label="Ordre des tours">${order}</span></div>`;
  };
  let last = { key: '', vals: null };
  const hudHtml = (sc, id, opts = {}) => {
    const d = DUELS[sc.fduel]; const step = sc.fstep || 0; const v = calc(sc.fduel, step);
    const prevStep = sc.fprev != null ? sc.fprev : Math.max(0, step - 1);
    const prev = opts.static ? v : (last.key === id && last.vals ? last.vals : calc(sc.fduel, prevStep));
    const shown = d.gauges.filter((g) => g.from == null || step >= g.from || sc.freveal === g.k);
    const tac = d.tactics && !sc.fgameover ? d.tactics(id, v, step) : null;
    const phase = tac ? tac.phase : 0;
    const boxes = shown.map((g) => {
      const reveal = sc.freveal === g.k && !opts.static;
      const from = reveal ? 0 : (prev[g.k] != null ? prev[g.k] : v[g.k]);
      const delta = v[g.k] - (opts.static ? v[g.k] : from);
      const low = g.bad === 'up' ? (g.k !== 'amanea' && v[g.k] >= 8) : g.bad === 'down' && v[g.k] <= 2;
      const flip = !opts.static && id === 'c17_revelation' && (g.k === 'amanea' || g.k === 'power');
      return `<div class="combatBox fd-${g.k}${reveal ? ' fdReveal' : ''}${low ? ' fdLow' : ''}${flip ? ' fdFlip' : ''}"><div class="combatTop"><span><i class="fdWho">${d.whoOf ? d.whoOf(g, phase) : g.who}</i>${g.name}</span><b>${v[g.k]}/10${delta && !reveal ? `<span class="fdDelta${delta < 0 ? ' neg' : ''}">${delta > 0 ? '+' : ''}${delta}</span>` : ''}</b></div><div class="combatTrack"><div class="combatFill" style="width:${v[g.k] * 10}%;--from:${from * 10}%;background:${g.fill};${g.glow ? `box-shadow:0 0 12px ${g.glow};` : ''}${opts.static ? 'animation:none;' : ''}"></div></div></div>`;
    }).join('');
    const meta = d.meta(v, step);
    const mood = moodOf(sc, id); const it = intensity();
    const qte = opts.qte ? `<div class="fdQte${opts.qte.left < 2.2 ? ' fdQteLast' : ''}"><span class="fdQteLab">⚡ ${opts.qte.label}</span><span class="fdQteTrack"><i style="width:${opts.qte.pct}%"></i></span><b id="fdQteTimer">${opts.qte.left.toFixed(1)} s</b></div>` : '';
    return { html: `<style>${CSS}</style><div class="combatHud fdHud" data-mood="${mood}" data-int="${it}"${phase ? ` data-phase="${phase}"` : ''}${opts.qte ? ' data-qte="1"' : ''} style="--fd-n:${shown.length}">${boxes}</div>${tac ? tacHtml(tac, it) : ''}<div class="combatMeta fdMeta${opts.qte ? ' fdQteOn' : ''}" data-int="${it}"><span>${d.mini} · ${meta[0]}</span><span>${meta[1]} <button type="button" class="fdFxBtn" data-fdfx="1"${it === 'reduit' ? ' disabled title="Animations réduites (réglage du système ou de la Bibliothèque)"' : ' title="Flashs, secousses et tremblements : intenses ou doux"'}>✦ ${fxLabel()}</button></span></div>${qte}`, v, prev };
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
      if (Date.now() < cutUntil) { qte.delay -= dt; return; } // le bandeau de bascule suspend le chrono (le délai d’armement court en même temps)
      if (qte.delay > 0) { qte.delay -= dt; return; }
      const before = Math.ceil(qte.left / 1000);
      qte.left -= dt;
      if (qte.left <= 0) { expire(); return; }
      if (Math.ceil(qte.left / 1000) < before && qte.left < 3500) sfx('tick');
      const hh = fxHost(); if (hh && !hh.dataset.fdQte && fxState) { hh.dataset.fdQte = '1'; }
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

  // ───── Mise en scène épique (v2) : urgence, désespoir, bascules ─────
  // Chaque scène de duel reçoit une humeur. URGENCE : bords qui battent, HUD qui tremble, braises/éclats, impacts.
  // DÉSESPOIR : désaturation, lueur qui faiblit, HUD fissuré, jauges qui se vident lentement, cendres/neige, battement sourd, musique en retrait.
  // BASCULE : coupure noire, éclair, bandeau de titre d’attaque, montée de la musique. Rien d’opaque : tout reste sous le texte et le HUD.
  const FX = {
    s04: { theme: 'flammes', base: 'urgence',
      moods: { c17_m4_lecture: 'desespoir', c17_m4: 'desespoir', c17_m4_r: 'desespoir' },
      bursts: {
        c17_revelation: { who: 'Amanea → la Reine Noire', title: 'Puissance révélée', sub: 'Ce qu’il a pris pour sa force n’était que sa retenue', mood: 'urgence' },
        c17_qte_ok: { who: 'Valurn', title: 'Une minute volée', sub: 'Flammes noires · riposte', mood: 'urgence', court: true },
      } },
    s06: { theme: 'roche', base: 'urgence',
      moods: { c18_dp_grotte: 'desespoir', c18_dp_grotte_r: 'desespoir' },
      bursts: {
        c18_dp_voute_r: { who: 'Draven', title: 'Effondrement', sub: 'La voûte cède sur les morts', mood: 'desespoir' },
      } },
    s07: { theme: 'arcane', base: 'urgence',
      moods: { c18_ip_domination: 'desespoir', c18_ip_domination_r: 'desespoir' },
      bursts: {
        c18_ip_flux: { who: 'Valurn → Iriana', title: 'Chaos filtré', sub: 'Ombre · Chaos · Mort', mood: 'urgence', court: true },
        c18_ip_renversement_r: { who: 'Iriana', title: 'Renversement', sub: 'Les vrilles noires se referment', mood: 'urgence', court: true },
      } },
    s08: { theme: 'givre', base: 'urgence',
      moods: { c18_bh_blizzard_r: 'desespoir', c18_bh_fin: 'apaisement' },
      bursts: {
        c18_bh_sync: { who: 'Remerii · Hylee', title: 'Synchronisation', sub: 'Le blizzard et l’Arcane ne font qu’un', mood: 'urgence', court: true },
        c18_bh_dragon: { who: 'Remerii', title: 'Dragon de glace', sub: 'Le blizzard prend forme', mood: 'urgence' },
      } },
  };
  const THEMES = {
    flammes: { edge: '150,20,70', glow: '#b46bff', hot: '255,90,40', cold: '170,160,190', dark: '22,6,30' },
    roche: { edge: '150,60,20', glow: '#d9a83a', hot: '210,160,90', cold: '190,170,140', dark: '24,16,8' },
    arcane: { edge: '160,20,90', glow: '#8f7dff', hot: '127,184,255', cold: '150,20,60', dark: '10,6,26' },
    givre: { edge: '60,140,220', glow: '#7fd3ff', hot: '235,248,255', cold: '210,230,245', dark: '6,16,32' },
  };
  const moodOf = (sc, id) => {
    if (sc.fgameover) return 'gameover';
    const f = FX[sc.fduel]; if (!f) return 'urgence';
    if (f.bursts[id]) return f.bursts[id].mood;
    return f.moods[id] || f.base;
  };
  const FXKEY = 'sylvinia_fd_fx';
  const reduced = () => {
    try { if (matchMedia('(prefers-reduced-motion: reduce)').matches) return true; } catch {}
    try { return !!(window.BibliothequeAstrale && BibliothequeAstrale.reg && BibliothequeAstrale.reg.reduit); } catch { return false; }
  };
  const intensity = () => { if (reduced()) return 'reduit'; try { return localStorage.getItem(FXKEY) === 'doux' ? 'doux' : 'intense'; } catch { return 'intense'; } };
  const fxLabel = () => ({ intense: 'Effets : intenses', doux: 'Effets : doux', reduit: 'Effets : réduits' })[intensity()];

  const FX_CSS = `.fdFx{position:absolute;inset:0;pointer-events:none;overflow:hidden;contain:strict}
.fdFx canvas{position:absolute;inset:0;width:100%;height:100%}
.fdFxEdge,.fdFxFlash,.fdFxCut{position:absolute;inset:0}
.fdFxEdge{opacity:0;transition:opacity 1.2s ease,background 1.2s ease}
[data-fd-mood=urgence] .fdFxEdge{opacity:.6;background:radial-gradient(ellipse 72% 66% at 50% 45%,transparent 54%,rgba(var(--fd-edge),.62) 84%,rgba(var(--fd-edge),.95) 100%);animation:fdBeat 1.15s ease-in-out infinite}
[data-fd-mood=urgence][data-fd-crit] .fdFxEdge{animation-duration:.8s}
[data-fd-mood=urgence][data-fd-qte] .fdFxEdge{animation-duration:.55s;background:radial-gradient(ellipse 78% 72% at 50% 45%,transparent 64%,rgba(220,30,40,.4) 88%,rgba(255,40,40,.78) 100%)}
[data-fd-mood=desespoir] .fdFxEdge{opacity:.9;background:radial-gradient(ellipse 70% 64% at 50% 42%,transparent 38%,rgba(var(--fd-dark),.62) 78%,rgba(0,0,0,.92) 100%);animation:fdFaiblit 6s ease-in-out infinite alternate}
[data-fd-mood=gameover] .fdFxEdge{opacity:1;background:radial-gradient(ellipse 66% 58% at 50% 42%,rgba(0,0,0,.08) 30%,rgba(0,0,0,.7) 74%,rgba(0,0,0,.96) 100%)}
[data-fd-mood=apaisement] .fdFxEdge{opacity:.6;background:radial-gradient(ellipse 75% 70% at 50% 40%,transparent 60%,rgba(var(--fd-edge),.35) 100%)}
[data-fd-mood=desespoir] .jeu-bg,[data-fd-mood=desespoir]>.bg{filter:saturate(.38) brightness(.78) contrast(1.04);transition:filter 2.4s ease}
[data-fd-mood=gameover] .jeu-bg,[data-fd-mood=gameover]>.bg{filter:saturate(.12) brightness(.58);transition:filter 3s ease}
[data-fd-mood=urgence] .jeu-bg,[data-fd-mood=urgence]>.bg{filter:saturate(1.12) contrast(1.05);transition:filter .8s ease}
[data-fd-mood=apaisement] .jeu-bg,[data-fd-mood=apaisement]>.bg{filter:saturate(.8) brightness(.95);transition:filter 3s ease}
[data-fd-mood=desespoir] .sprites,[data-fd-mood=gameover] .sprites{filter:saturate(.55) brightness(.86);transition:filter 2.4s ease}
.fdFxFlash{opacity:0}
.fdFxFlash.hit{animation:fdHit .42s ease-out}
.fdFxFlash.cut{animation:fdCutFlash .62s ease-out}
.fdFxCut{display:flex;align-items:center;justify-content:center;opacity:0}
.fdFxCut.on{opacity:1}
.fdCutBand{position:absolute;left:-6%;right:-6%;top:22%;padding:clamp(8px,1.6vh,16px) 12%;transform:skewY(-4deg);display:flex;flex-direction:column;align-items:center;gap:2px;
 background:linear-gradient(90deg,transparent,rgba(var(--fd-dark),.66) 14%,rgba(var(--fd-dark),.66) 86%,transparent);border-top:1px solid rgba(233,201,133,.75);border-bottom:1px solid rgba(233,201,133,.75);
 box-shadow:0 0 34px rgba(var(--fd-edge),.45);backdrop-filter:blur(1.5px);animation:fdBandIn 2.2s cubic-bezier(.2,.9,.2,1) both}
.fdFxCut.court .fdCutBand{animation-duration:1.4s}
.fdCutBand::before{content:"";position:absolute;left:0;right:0;top:50%;height:2px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.9),transparent);transform:scaleX(0);animation:fdSlash .5s .12s ease-out both;opacity:.8}
.fdCutWho{font:600 clamp(10px,1.5vw,14px)/1 "Cinzel",serif;letter-spacing:.32em;text-transform:uppercase;color:#e9c985;font-style:normal;opacity:.95}
.fdCutTitle{font:700 clamp(26px,5.6vw,64px)/1.05 "Cinzel Decorative","Cinzel",serif;letter-spacing:.06em;text-transform:uppercase;font-style:italic;color:#fff8ea;
 text-shadow:0 0 18px var(--fd-glow),0 0 2px #000,3px 3px 0 rgba(var(--fd-edge),.85);transform:skewX(-10deg);animation:fdTitleIn 2.2s cubic-bezier(.2,.9,.2,1) both}
.fdFxCut.court .fdCutTitle{animation-duration:1.4s}
.fdCutSub{font:italic 500 clamp(13px,1.9vw,19px)/1.2 "Cormorant Garamond",serif;color:#f3e6c8;opacity:.92}
[data-fd-int=doux] .fdCutBand,[data-fd-int=reduit] .fdCutBand,[data-fd-int=doux] .fdCutTitle,[data-fd-int=reduit] .fdCutTitle{animation-name:fdFadeBand}
[data-fd-int=reduit] .fdFxEdge{animation:none!important}
[data-fd-int=reduit] .fdCutBand::before{display:none}
.fdFxStamp{position:absolute;right:5%;top:clamp(150px,30%,300px);opacity:0}
.fdFxStamp.on{animation:fdStamp 1.5s cubic-bezier(.2,1.4,.3,1) both}
.fdFxStamp b{display:block;font:700 italic clamp(18px,3.2vw,34px)/1 "Cinzel Decorative","Cinzel",serif;letter-spacing:.04em;text-transform:uppercase;color:#fff8ea;padding:6px 16px;transform:skewX(-14deg) rotate(-6deg);
 background:linear-gradient(90deg,rgba(var(--fd-dark),.78),rgba(var(--fd-edge),.62));border-left:3px solid #e9c985;text-shadow:0 0 10px var(--fd-glow),2px 2px 0 #000}
.fdFxStamp.mal b{border-left-color:#ff4a4a;background:linear-gradient(90deg,rgba(20,0,0,.8),rgba(160,20,30,.6))}
[data-fd-int=doux] .fdFxStamp.on,[data-fd-int=reduit] .fdFxStamp.on{animation-name:fdFadeBand}
@keyframes fdStamp{0%{opacity:0;transform:scale(1.8)}12%{opacity:1;transform:scale(.95)}20%{transform:scale(1)}80%{opacity:1}100%{opacity:0;transform:translateY(-8px)}}
@media (max-height:600px){.fdFxStamp{top:26%}}
@keyframes fdBeat{0%,100%{opacity:.38}12%{opacity:.9}24%{opacity:.5}36%{opacity:.78}60%{opacity:.4}}
@keyframes fdFaiblit{from{opacity:.78}to{opacity:.97}}
@keyframes fdHit{0%{opacity:1;background:radial-gradient(ellipse at 50% 45%,rgba(var(--fd-hot),.32),rgba(var(--fd-edge),.3) 70%)}100%{opacity:0}}
@keyframes fdCutFlash{0%{opacity:1;background:rgba(0,0,0,.86)}38%{opacity:1;background:rgba(0,0,0,.86)}48%{opacity:1;background:rgba(var(--fd-hot),.36)}100%{opacity:0;background:rgba(var(--fd-hot),0)}}
@keyframes fdBandIn{0%,16%{transform:skewY(-4deg) translateX(-110%);opacity:0}30%{transform:skewY(-4deg) translateX(0);opacity:1}82%{transform:skewY(-4deg) translateX(1.5%);opacity:1}100%{transform:skewY(-4deg) translateX(110%);opacity:0}}
@keyframes fdTitleIn{0%,22%{transform:skewX(-10deg) translateX(-40px);opacity:0}36%{transform:skewX(-10deg) translateX(0);opacity:1}100%{transform:skewX(-10deg) translateX(14px)}}
@keyframes fdSlash{to{transform:scaleX(1);opacity:0}}
@keyframes fdFadeBand{0%{opacity:0}18%,80%{opacity:1}100%{opacity:0}}
@media (prefers-reduced-motion:reduce){.fdFxEdge{animation:none!important}.fdCutBand,.fdCutTitle{animation-name:fdFadeBand!important}.fdCutBand::before{display:none}}
@media (max-height:600px){.fdCutBand{top:34%;padding-top:4px;padding-bottom:4px}}`;

  const injectFx = (root, holder) => {
    if (!root || root.querySelector?.('#fdFxCss')) return;
    const st = document.createElement('style'); st.id = 'fdFxCss'; st.textContent = FX_CSS; (holder || root).appendChild(st);
  };
  const biblio = () => document.body.classList.contains('ui-biblio') && !!jeu();
  const fxHost = () => (biblio() ? jeu() : document.getElementById('stage'));
  const ensureLayer = (h) => {
    if (!h) return null;
    let L = h.querySelector(':scope > .fdFx');
    if (!L) {
      L = document.createElement('div'); L.className = 'fdFx'; L.setAttribute('aria-hidden', 'true');
      L.innerHTML = '<canvas></canvas><div class="fdFxEdge"></div><div class="fdFxFlash"></div><div class="fdFxStamp"></div><div class="fdFxCut"></div>';
      const sp = h.querySelector(':scope > .sprites');
      if (sp) sp.after(L); else h.appendChild(L);
      if (h.id === 'stage' && getComputedStyle(h).position === 'static') h.style.position = 'relative';
    }
    return L;
  };
  let fxState = null; // { id, duel, mood, theme, crit, qte }
  const setHostAttrs = (h) => {
    if (!h || !fxState) return;
    const t = THEMES[fxState.theme];
    h.dataset.fdMood = fxState.mood; h.dataset.fdTheme = fxState.theme; h.dataset.fdInt = intensity();
    if (fxState.crit) h.dataset.fdCrit = '1'; else delete h.dataset.fdCrit;
    if (qte && qte.id === fxState.id) h.dataset.fdQte = '1'; else delete h.dataset.fdQte;
    h.style.setProperty('--fd-edge', t.edge); h.style.setProperty('--fd-glow', t.glow); h.style.setProperty('--fd-hot', t.hot); h.style.setProperty('--fd-dark', t.dark);
  };
  const clearHost = (h) => {
    if (!h) return;
    ['fdMood', 'fdTheme', 'fdInt', 'fdCrit', 'fdQte'].forEach((k) => delete h.dataset[k]);
    const L = h.querySelector(':scope > .fdFx'); if (L) L.remove();
  };
  const syncFx = () => {
    const R = window.BibliothequeAstrale && BibliothequeAstrale.racine;
    if (R) injectFx(R); if (!document.getElementById('fdFxCss')) injectFx(document, document.head);
    const h = fxHost();
    [jeu(), document.getElementById('stage')].forEach((x) => { if (x && x !== h) clearHost(x); });
    if (!fxState) { clearHost(h); return null; }
    const L = ensureLayer(h); setHostAttrs(h); return L;
  };

  // Particules légères (canvas) : braises, cendres, poussière, éclats d’arcane, neige.
  let parts = [], raf = 0, cv = null, cx = null, lastT = 0, partKey = '';
  const spawn = (W, H, init) => {
    const th = fxState.theme, m = fxState.mood, T = THEMES[th];
    const r = Math.random;
    const p = { x: r() * W, y: init ? r() * H : 0, s: 1 + r() * 2.2, a: .25 + r() * .55, ph: r() * 6.28 };
    const calm = m === 'desespoir' || m === 'gameover' || m === 'apaisement';
    if (th === 'flammes') {
      if (calm) { p.vx = (r() - .5) * .25; p.vy = .25 + r() * .35; p.c = T.cold; p.y = init ? p.y : -6; }
      else { p.vx = (r() - .5) * .6; p.vy = -(.7 + r() * 1.4); p.c = r() < .55 ? T.hot : '180,107,255'; p.y = init ? p.y : H + 6; p.glow = 1; }
    } else if (th === 'roche') {
      if (calm) { p.vx = (r() - .3) * .3; p.vy = .08 + r() * .25; p.c = T.cold; p.a *= .6; p.s += 1.5; p.y = init ? p.y : -6; }
      else { p.vx = (r() - .5) * .5; p.vy = 1.2 + r() * 2.2; p.c = r() < .3 ? '120,95,70' : T.hot; p.y = init ? p.y : -6; }
    } else if (th === 'arcane') {
      if (calm) { p.vx = (r() - .5) * .3; p.vy = .2 + r() * .3; p.c = r() < .6 ? '140,15,50' : '60,40,70'; p.y = init ? p.y : -6; p.s += 1; }
      else { p.vx = (r() - .5) * .9; p.vy = -(.2 + r() * .7); p.c = r() < .5 ? T.hot : '200,120,255'; p.glow = 1; p.y = init ? p.y : H + 6; p.wob = 1; }
    } else {
      if (calm) { p.vx = -.2 - r() * .3; p.vy = .45 + r() * .5; p.c = T.cold; p.y = init ? p.y : -6; }
      else { p.vx = -1.4 - r() * 1.6; p.vy = 2 + r() * 2; p.c = T.hot; p.x = init ? p.x : r() * W * 1.4; p.y = init ? p.y : -6; }
    }
    return p;
  };
  const countFor = (W, H) => {
    const it = intensity(); if (it === 'reduit' || !fxState) return 0;
    const m = fxState.mood; const base = m === 'urgence' ? 46 : m === 'apaisement' ? 22 : 34;
    const area = Math.max(.5, Math.min(1.3, (W * H) / (1024 * 880)));
    return Math.round(base * area * (it === 'doux' ? .6 : 1) * (fxState.theme === 'givre' && m === 'urgence' ? 1.6 : 1));
  };
  const frame = (t) => {
    raf = 0;
    if (!fxState || document.hidden) { if (cx && cv) cx.clearRect(0, 0, cv.width, cv.height); return; }
    const L = syncFx(); if (!L) return;
    const c = L.querySelector('canvas');
    const W = L.clientWidth, H = L.clientHeight;
    if (!W || !H) { raf = requestAnimationFrame(frame); return; }
    const dpr = Math.min(1.5, window.devicePixelRatio || 1);
    if (c !== cv || c.width !== Math.round(W * dpr)) { cv = c; cx = c.getContext('2d'); c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); parts = []; }
    const key = fxState.theme + fxState.mood + intensity();
    const n = countFor(W, H);
    if (key !== partKey) { partKey = key; parts = []; }
    while (parts.length < n) parts.push(spawn(W, H, true));
    if (parts.length > n) parts.length = n;
    const dt = Math.min(3, lastT ? (t - lastT) / 16.7 : 1); lastT = t;
    cx.setTransform(dpr, 0, 0, dpr, 0, 0); cx.clearRect(0, 0, W, H);
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      p.ph += .03 * dt; p.x += (p.vx + (p.wob ? Math.sin(p.ph) * .6 : 0)) * dt; p.y += p.vy * dt;
      if (p.y < -10 || p.y > H + 10 || p.x < -20 || p.x > W + 20) { parts[i] = spawn(W, H, false); continue; }
      const a = p.a * (.75 + .25 * Math.sin(p.ph * 2));
      cx.fillStyle = `rgba(${p.c},${a.toFixed(3)})`;
      if (p.glow) { cx.shadowColor = `rgba(${p.c},.9)`; cx.shadowBlur = 6; } else cx.shadowBlur = 0;
      cx.beginPath(); cx.arc(p.x, p.y, p.s, 0, 6.283); cx.fill();
    }
    raf = requestAnimationFrame(frame);
  };
  const loop = () => { if (!raf) raf = requestAnimationFrame(frame); };

  // Musique : retrait dans le désespoir, coupure puis montée à la bascule (volume relatif au réglage du joueur).
  let volRaf = 0, volMult = 1;
  const baseVol = () => { const v = parseFloat((document.getElementById('volume') || {}).value); return isFinite(v) ? v : .65; };
  const rampMusic = (to, ms, from) => {
    const a = document.getElementById('music'); if (!a) return;
    cancelAnimationFrame(volRaf);
    const start = performance.now(); const m0 = from != null ? from : volMult;
    const step = (now) => {
      const k = Math.min(1, (now - start) / ms); volMult = m0 + (to - m0) * (k * k * (3 - 2 * k));
      try { a.volume = Math.max(0, Math.min(1, baseVol() * volMult)); } catch {}
      if (k < 1) volRaf = requestAnimationFrame(step);
    };
    volRaf = requestAnimationFrame(step);
  };
  const moodVol = (m) => (m === 'desespoir' ? .62 : m === 'gameover' ? .85 : 1);

  // Bascule épique : coupure noire, éclair, bandeau de titre d’attaque.
  let cutUntil = 0;
  const burst = (b) => {
    const L = syncFx(); if (!L) return;
    const it = intensity();
    const cut = L.querySelector('.fdFxCut'), fl = L.querySelector('.fdFxFlash');
    cut.className = 'fdFxCut'; cut.innerHTML = `<div class="fdCutBand" role="presentation"><i class="fdCutWho">${b.who}</i><b class="fdCutTitle">${b.title}</b><span class="fdCutSub">${b.sub}</span></div>`;
    void cut.offsetWidth; cut.classList.add('on'); if (b.court) cut.classList.add('court');
    if (it === 'intense') { fl.className = 'fdFxFlash'; void fl.offsetWidth; fl.classList.add('cut'); }
    const dur = b.court ? 1450 : 2250;
    cutUntil = Date.now() + dur;
    clearTimeout(burst.t); burst.t = setTimeout(() => { cut.classList.remove('on'); cut.innerHTML = ''; }, dur);
    sfx('bascule');
    rampMusic(.3, 160); setTimeout(() => rampMusic(moodVol(fxState ? fxState.mood : 'urgence') * 1.0, 1500, .3), 420);
  };
  const stamp = (txt, bad) => {
    const L = syncFx(); if (!L) return; const el = L.querySelector('.fdFxStamp'); if (!el) return;
    el.className = 'fdFxStamp'; el.innerHTML = `<b>${txt}</b>`; void el.offsetWidth; el.classList.add('on'); if (bad) el.classList.add('mal');
    clearTimeout(stamp.t); stamp.t = setTimeout(() => { el.className = 'fdFxStamp'; el.innerHTML = ''; }, 1600);
  };
  const BAD_STAMPS = ['Lu par elle', 'Seuil manqué', 'Parade brisée', 'Retrouvé'];
  const hitFx = () => {
    if (intensity() !== 'intense') return;
    const L = syncFx(); if (!L) return; const fl = L.querySelector('.fdFxFlash');
    if (fl.classList.contains('cut') && Date.now() < cutUntil) return;
    fl.className = 'fdFxFlash'; void fl.offsetWidth; fl.classList.add('hit');
  };

  const setFx = (sc, id, entering, v) => {
    const f = FX[sc.fduel]; const d = DUELS[sc.fduel];
    const mood = moodOf(sc, id);
    const crit = d.gauges.some((g) => g.bad === 'down' ? (g.from == null || (sc.fstep || 0) >= g.from) && v[g.k] <= 2 && g.k !== 'flux' : g.bad === 'up' && g.k !== 'amanea' && v[g.k] >= 8);
    const prevMood = fxState && fxState.mood;
    fxState = { id, duel: sc.fduel, mood, theme: f ? f.theme : 'flammes', crit };
    syncFx(); loop();
    requestAnimationFrame(syncFx); setTimeout(syncFx, 160); setTimeout(syncFx, 600);
    if (!entering) return;
    const b = f && f.bursts[id];
    if (b) setTimeout(() => burst(b), sc.fintro ? 1100 : 60);
    const st = d.stamps && d.stamps[id] && d.stamps[id](flags(), v);
    if (st && !b) setTimeout(() => stamp(st, BAD_STAMPS.includes(st)), 320);
    else if (mood !== prevMood) rampMusic(moodVol(mood), mood === 'desespoir' ? 2600 : 900);
    if ((mood === 'desespoir' || mood === 'gameover') && mood !== prevMood) { setTimeout(() => sfx('coeur'), 380); setTimeout(() => sfx('coeur'), 1650); }
  };
  const leaveFx = () => {
    if (!fxState) return;
    fxState = null; cutUntil = 0; syncFx(); if (volMult !== 1) rampMusic(1, 900);
  };

  // Bouton « Effets » du HUD (délégué : le HUD est recopié dans l’interface Bibliothèque).
  document.addEventListener('click', (e) => {
    const path = e.composedPath ? e.composedPath() : [e.target];
    const b = path.find((n) => n && n.dataset && n.dataset.fdfx);
    if (!b) return;
    e.stopPropagation(); e.preventDefault();
    if (reduced()) return;
    try { localStorage.setItem(FXKEY, intensity() === 'intense' ? 'doux' : 'intense'); } catch {}
    const lab = fxLabel();
    const R = window.BibliothequeAstrale && BibliothequeAstrale.racine;
    [document, R].forEach((root) => root && root.querySelectorAll && root.querySelectorAll('[data-fdfx]').forEach((x) => { x.textContent = '✦ ' + lab; }));
    const st = document.getElementById('stats'); if (st) st.querySelectorAll('.fdHud').forEach((x) => { x.dataset.int = intensity(); });
    if (R) R.querySelectorAll('.fdHud').forEach((x) => { x.dataset.int = intensity(); });
    partKey = ''; syncFx();
  }, true);

  const apply = () => {
    const id = state && state.scene; const sc = typeof S !== 'undefined' && S[id]; const stage = document.getElementById('stage');
    if (!stage) return;
    if (!qte || qte.id !== id) stopQte();
    if (!sc || !sc.fduel || !DUELS[sc.fduel]) { stage.classList.remove('fdActive'); lastScene = id; last = { key: '', vals: null }; leaveFx(); return; }
    injectShadow();
    const d = DUELS[sc.fduel];
    stage.classList.add('combatMode', 'fdActive');
    const entering = lastScene !== id;
    const q0 = !sc.fqte ? undefined : (qte && qte.id === id) ? { label: sc.fqte.label, pct: Math.max(0, qte.left / qte.total * 100), left: Math.max(0, qte.left) / 1000 }
      : { label: sc.fqte.label, pct: 100, left: durationOf(sc) / 1000 };
    const { html, v, prev } = hudHtml(sc, id, { static: !entering, qte: q0 });
    const st = document.getElementById('stats'); if (st) st.innerHTML = html;
    if (entering) {
      if (sc.fintro) transition({ title: d.title, mini: d.mini, sub: sc.sub });
      const moved = (g, dir) => (dir === 'down' ? v[g.k] < prev[g.k] : v[g.k] > prev[g.k]);
      const hurt = d.gauges.some((g) => g.bad && moved(g, g.bad));
      const good = d.gauges.some((g) => g.bad && moved(g, g.bad === 'down' ? 'up' : 'down'));
      if (sc.fgameover || hurt) { setTimeout(() => { sfx(moodOf(sc, id) === 'urgence' ? 'impact' : 'hit'); pulse('fd-shake'); }, 250); }
      else if (good) setTimeout(() => sfx('ok'), 250);
    }
    last = { key: id, vals: v };
    setFx(sc, id, entering, v);
    lastScene = id;
    if (sc.fqte) startQte(sc, id);
  };

  const previousRender = render;
  render = window.render = function () {
    const r = previousRender.apply(this, arguments);
    try { apply(); } catch (e) { console.warn('[finale-duels]', e); }
    return r;
  };

  window.SylviniaFinaleDuels = { DUELS, calc, expire, qteActive: () => (qte ? { id: qte.id, left: qte.left, total: qte.total } : null), hudHtml, durationOf, FX, moodOf, fx: () => (fxState ? { ...fxState, intensity: intensity(), cut: Date.now() < cutUntil } : null) };
})();
