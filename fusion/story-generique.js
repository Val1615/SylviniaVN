/* Mode Histoire · Générique de fin du Tome I (lecteur)
   Déclencheur : le choix « Retour au menu » de c19_fin, après la dernière ligne de l’épilogue.
   Écran dédié, hors moteur de scènes : ne touche ni aux stats, ni aux flags narratifs, ni à l’inventaire.
   Données : fusion/story-generique-credits.js (contenu fixe) et fusion/story-generique-chronique.js (souvenirs). */
(() => {
  'use strict';

  const D = window.SylviniaGeneriqueData;
  const C = window.SylviniaChronique;
  if (!D || !C) return;

  const GAME_VERSION = 'v0.429';
  const STATE_KEY = 'tome1Chronicle';                     // capture versionnée, rangée à côté des flags (jamais dedans)
  const MIRROR_KEY = 'sylvinia_vn_chronique_tome1_v1';     // copie de la dernière chronique terminée (relectures de chapitre, Ma Chronique)
  const ROOT_ID = 'sylviniaGenerique';
  const STYLE_ID = 'sylvinia-generique-style';
  const T = D.timing;

  const game = () => (typeof state === 'undefined' ? null : state);
  const flags = () => (game() && game().flags) || {};
  const musicEl = () => document.getElementById('music');
  const sliderVolume = () => {
    const el = document.getElementById('volume');
    const v = el ? parseFloat(el.value || '0.65') : 0.65;
    return Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : 0.65;
  };
  const reducedMotion = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ======================= Capture de la chronique ======================= */
  const readMirror = () => { try { const o = JSON.parse(localStorage.getItem(MIRROR_KEY) || 'null'); return o && o.v === 1 && Array.isArray(o.entries) ? o : null; } catch (_e) { return null; } };
  const writeMirror = (cap) => { try { localStorage.setItem(MIRROR_KEY, JSON.stringify(cap)); } catch (_e) { /* stockage plein : la copie dans la sauvegarde suffit */ } };
  const validCapture = (o) => Boolean(o && o.v === 1 && Array.isArray(o.entries));

  function makeCapture(provenance) {
    const cap = C.capture(game() || {}, { game: GAME_VERSION, at: new Date().toISOString(), provenance });
    cap.run = Math.random().toString(36).slice(2, 10);
    return cap;
  }
  function storeCapture(cap) {
    const st = game(); if (!st) return;
    st[STATE_KEY] = cap;
    writeMirror(cap);
    try { if (typeof save === 'function') save(); } catch (_e) { /* sauvegarde indisponible */ }
  }
  // Une vraie partie qui valide le Tome I (entrée dans c19_bilan) écrit sa propre chronique.
  // Jamais en mode développeur ni pendant une relecture : la chronique d’origine reste intacte.
  function recordAtValidation(wasComplete) {
    const st = game(); if (!st || st.devMode || flags().finaleReplay) return;
    if (!wasComplete) { storeCapture(makeCapture('partie')); return; }
    ensureChronicle();
  }
  // Partie déjà terminée : on reprend sa chronique ; sinon (sauvegarde antérieure à v0.429), on la reconstitue
  // à partir des seuls flags de choix présents, marqués comme tels, sans rien inventer.
  function ensureChronicle() {
    const st = game(); if (!st) return null;
    if (validCapture(st[STATE_KEY])) return st[STATE_KEY];
    if (st.devMode || flags().finaleReplay) return readMirror();
    if (!flags().tome1Complete) return readMirror();
    const mirror = readMirror();
    if (mirror) { st[STATE_KEY] = mirror; try { save(); } catch (_e) { /* ignore */ } return mirror; }
    const cap = makeCapture('sauvegarde-anterieure');
    storeCapture(cap);
    return cap;
  }
  const currentChronicle = () => { const st = game(); return (st && validCapture(st[STATE_KEY]) && st[STATE_KEY]) || readMirror(); };

  /* ======================= Style ======================= */
  const CSS = `
#${ROOT_ID}{position:fixed;inset:0;z-index:2147482500;overflow:hidden;background:#050407;color:#efe6cf;opacity:0;transition:opacity 1.4s ease;font-family:"Cormorant Garamond",Georgia,"Palatino Linotype",serif;-webkit-user-select:none;user-select:none;cursor:default}
#${ROOT_ID}.on{opacity:1}
#${ROOT_ID}.out{opacity:0;transition:opacity ${T.outro}s ease}
#${ROOT_ID} *{box-sizing:border-box}
.gq-bg,.gq-layer,.gq-fill,.gq-veil,.gq-motes{position:absolute;inset:0}
.gq-layer{opacity:0;transition:opacity ${T.crossfade}s ease}
.gq-layer.vis{opacity:1}
.gq-fill{background-size:cover;background-position:center;filter:blur(22px) brightness(.32) saturate(.9);transform:scale(1.15);display:none}
.gq-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:var(--focus,60% 45%);filter:saturate(.92) brightness(.86);transform-origin:var(--focus,60% 45%)}
.gq-layer.vis .gq-img{animation:gqDrift 26s ease-out forwards}
@keyframes gqDrift{from{transform:scale(1.075) translate3d(.6%,0,0)}to{transform:scale(1.0) translate3d(0,0,0)}}
.gq-veil{pointer-events:none;background:
  linear-gradient(90deg,rgba(5,4,8,.94) 0%,rgba(5,4,8,.82) 30%,rgba(5,4,8,.42) 50%,rgba(5,4,8,.08) 72%,rgba(5,4,8,0) 100%),
  linear-gradient(180deg,rgba(5,4,8,.55) 0%,rgba(5,4,8,0) 22%,rgba(5,4,8,0) 74%,rgba(5,4,8,.7) 100%)}
.gq-motes{pointer-events:none;width:100%;height:100%}
.gq-opening{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;opacity:0;padding:max(24px,env(safe-area-inset-top)) 24px max(24px,env(safe-area-inset-bottom));pointer-events:none;background:radial-gradient(ellipse at center,rgba(20,14,10,.0) 0%,rgba(5,4,7,.55) 70%)}
.gq-opening.in{opacity:1;transition:opacity ${T.openingIn}s ease}
.gq-opening.gone{opacity:0;transition:opacity ${T.openingOut}s ease}
.gq-o1{font:italic 500 clamp(18px,3.2vmin,30px)/1.2 "Cormorant Garamond",Georgia,serif;letter-spacing:.14em;color:rgba(239,230,207,.82);margin:0 0 .2em}
.gq-o2{margin:0;font:900 clamp(46px,13vmin,148px)/1 "Cinzel Decorative","Cinzel",Georgia,serif;letter-spacing:.06em;text-transform:uppercase;background:linear-gradient(180deg,#fff3cf 0%,#e9c985 42%,#9b7838 78%,#d8b46b 100%);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 0 22px rgba(233,201,133,.25)) drop-shadow(0 2px 0 rgba(0,0,0,.6))}
.gq-o3{margin:.55em 0 0;font:600 clamp(13px,2.3vmin,20px)/1 "Cinzel",Georgia,serif;letter-spacing:.5em;text-indent:.5em;color:rgba(233,201,133,.78);text-transform:uppercase}
.gq-orn{display:block;width:min(62vmin,440px);height:auto;color:rgba(233,201,133,.62);margin:.9em auto}
.gq-orn.top{margin:0 auto .9em}
.gq-view{position:absolute;top:0;bottom:0;left:0;width:45%;overflow:hidden;
  -webkit-mask-image:linear-gradient(180deg,transparent 0,#000 13%,#000 85%,transparent 100%);mask-image:linear-gradient(180deg,transparent 0,#000 13%,#000 85%,transparent 100%)}
.gq-strip{position:absolute;left:0;right:0;top:0;will-change:transform;padding:0 max(5%,env(safe-area-inset-left)) 0 max(7%,env(safe-area-inset-left));text-align:center;text-shadow:0 1px 2px rgba(0,0,0,.85),0 0 18px rgba(0,0,0,.55)}
.gq-block{padding:0;margin:0 auto}
.gq-block + .gq-block{margin-top:var(--gap,15vh)}
.gq-act{padding-top:6vh}
.gq-act .gq-num{display:block;font:600 clamp(13px,1.9vmin,18px)/1 "Cinzel",Georgia,serif;letter-spacing:.45em;text-indent:.45em;color:rgba(233,201,133,.7);margin-bottom:.9em}
.gq-act h2{margin:0;font:700 clamp(30px,6.2vmin,74px)/1.08 "Cinzel Decorative","Cinzel",Georgia,serif;letter-spacing:.03em;background:linear-gradient(180deg,#fff1c9 0%,#e3c07a 55%,#a9853f 100%);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 2px 6px rgba(0,0,0,.7))}
.gq-sep{display:block;width:min(78%,320px);height:auto;margin:1.1em auto;color:rgba(233,201,133,.55)}
.gq-dept{margin:0 0 1.1em;font:600 clamp(19px,3.4vmin,36px)/1.15 "Cinzel",Georgia,serif;letter-spacing:.14em;text-transform:uppercase;color:#e9c985}
.gq-sub{display:block;margin-top:.45em;font:italic 500 clamp(14px,2.1vmin,20px)/1.3 "Cormorant Garamond",Georgia,serif;letter-spacing:.04em;text-transform:none;color:rgba(239,230,207,.66)}
.gq-credit{margin:0 auto 2.2em;max-width:34em}
.gq-role{display:block;font:600 clamp(11px,1.65vmin,15px)/1.35 "Cinzel",Georgia,serif;letter-spacing:.16em;text-transform:uppercase;color:rgba(214,196,160,.78)}
.gq-name{display:block;margin:.28em 0 .32em;font:600 clamp(24px,4.2vmin,40px)/1.1 "Cormorant Garamond",Georgia,serif;color:#fbf3dc;letter-spacing:.02em}
.gq-name.big{font-size:clamp(30px,5.4vmin,52px);color:#fff4d6}
.gq-desc{display:block;font:italic 400 clamp(15px,2.15vmin,20px)/1.45 "Cormorant Garamond",Georgia,serif;color:rgba(222,211,189,.8)}
.gq-line{margin:.5em auto;max-width:30em;font:500 clamp(17px,2.6vmin,23px)/1.4 "Cormorant Garamond",Georgia,serif;color:rgba(239,230,207,.9)}
.gq-line.strong{font-weight:600;font-size:clamp(19px,3vmin,27px);color:#f7ecd2}
.gq-line.italic{font-style:italic;color:rgba(239,230,207,.82)}
.gq-kicker{display:block;margin-bottom:.8em;font:600 clamp(10px,1.5vmin,13px)/1 "Cinzel",Georgia,serif;letter-spacing:.32em;text-indent:.32em;text-transform:uppercase;color:rgba(233,201,133,.72)}
.gq-quote{margin:.7em auto;max-width:28em;font:italic 500 clamp(17px,2.6vmin,24px)/1.5 "Cormorant Garamond",Georgia,serif;color:rgba(244,236,216,.93)}
.gq-signature{display:block;margin-top:1em;font:600 clamp(13px,1.9vmin,17px)/1 "Cinzel",Georgia,serif;letter-spacing:.2em;color:rgba(233,201,133,.75)}
.gq-merci{margin:.5em 0 0;font:700 clamp(30px,5.8vmin,60px)/1 "Cinzel Decorative","Cinzel",Georgia,serif;color:#ecd08f}
.gq-intro p{margin:.35em auto;max-width:26em;font:italic 500 clamp(19px,3vmin,28px)/1.45 "Cormorant Garamond",Georgia,serif;color:#f4ead2}
.gq-mem{max-width:32em;margin-left:auto;margin-right:auto}
.gq-mem h3{margin:0 0 .45em;font:600 clamp(19px,3.1vmin,30px)/1.2 "Cinzel",Georgia,serif;letter-spacing:.06em;color:#f0d79c}
.gq-mem p{margin:0;font:italic 500 clamp(17px,2.6vmin,24px)/1.5 "Cormorant Garamond",Georgia,serif;color:rgba(246,239,222,.94)}
.gq-mem .gq-dot{display:block;width:6px;height:6px;margin:1.1em auto 0;transform:rotate(45deg);background:rgba(233,201,133,.55)}
.gq-conclusion p{margin:0;font:600 italic clamp(22px,3.8vmin,36px)/1.3 "Cormorant Garamond",Georgia,serif;color:#f7e7bf}
.gq-final{padding-bottom:2vh}
.gq-fin{margin:0;font:700 clamp(30px,6.4vmin,72px)/1.05 "Cinzel Decorative","Cinzel",Georgia,serif;letter-spacing:.05em;text-transform:uppercase;background:linear-gradient(180deg,#fff1c9 0%,#e3c07a 55%,#a9853f 100%);-webkit-background-clip:text;background-clip:text;color:transparent}
.gq-suite{display:block;margin-top:1.6em;font:600 clamp(12px,1.9vmin,16px)/1 "Cinzel",Georgia,serif;letter-spacing:.42em;text-indent:.42em;color:rgba(233,201,133,.7);text-transform:uppercase}
.gq-ctrl{position:absolute;right:max(14px,env(safe-area-inset-right));bottom:max(14px,env(safe-area-inset-bottom));display:flex;gap:8px;opacity:0;transform:translateY(6px);transition:opacity .45s ease,transform .45s ease;pointer-events:none}
#${ROOT_ID}.ctrl .gq-ctrl{opacity:1;transform:none;pointer-events:auto}
.gq-ctrl button,.gq-confirm button{font:600 12px/1 "Cinzel",Georgia,serif;letter-spacing:.1em;color:rgba(243,230,200,.86);background:rgba(8,8,16,.42);border:1px solid rgba(233,201,133,.3);border-radius:999px;padding:8px 14px;cursor:pointer;backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px)}
.gq-ctrl button:hover,.gq-ctrl button:focus-visible,.gq-confirm button:hover,.gq-confirm button:focus-visible{border-color:rgba(233,201,133,.75);color:#fff6dc;outline:none}
.gq-ctrl .dev{border-style:dashed}
.gq-confirm{position:absolute;right:max(14px,env(safe-area-inset-right));bottom:calc(max(14px,env(safe-area-inset-bottom)) + 44px);display:flex;align-items:center;gap:8px;padding:8px 10px 8px 14px;background:rgba(8,8,16,.62);border:1px solid rgba(233,201,133,.28);border-radius:14px;font:italic 500 15px/1.2 "Cormorant Garamond",Georgia,serif;color:#efe6cf}
.gq-confirm[hidden]{display:none}
.gq-paused{position:absolute;left:50%;top:max(16px,env(safe-area-inset-top));transform:translateX(-50%);font:600 11px/1 "Cinzel",Georgia,serif;letter-spacing:.3em;color:rgba(233,201,133,.7);opacity:0;transition:opacity .3s}
#${ROOT_ID}.paused .gq-paused{opacity:1}
/* ---- Au-delà des cendres : écran vertical ---- */
#${ROOT_ID}.portrait .gq-fill{display:block}
#${ROOT_ID}.portrait .gq-img{top:5%;bottom:auto;height:min(60%,75vw);object-fit:cover;-webkit-mask-image:linear-gradient(180deg,transparent 0,#000 14%,#000 68%,transparent 100%);mask-image:linear-gradient(180deg,transparent 0,#000 14%,#000 68%,transparent 100%);filter:saturate(.85) brightness(.66)}
#${ROOT_ID}.portrait .gq-veil{background:radial-gradient(ellipse 120% 70% at 50% 45%,rgba(5,4,8,.28) 0%,rgba(5,4,8,.66) 70%,rgba(5,4,8,.86) 100%),linear-gradient(180deg,rgba(5,4,8,.4) 0%,rgba(5,4,8,0) 25%,rgba(5,4,8,.35) 60%,rgba(5,4,8,.78) 100%)}
#${ROOT_ID}.portrait .gq-view{left:0;right:0;width:100%;-webkit-mask-image:linear-gradient(180deg,transparent 0,#000 11%,#000 87%,transparent 100%);mask-image:linear-gradient(180deg,transparent 0,#000 11%,#000 87%,transparent 100%)}
#${ROOT_ID}.portrait .gq-strip{max-width:min(36rem,100%);margin:0 auto;padding:0 max(7vw,env(safe-area-inset-left)) 0 max(7vw,env(safe-area-inset-right))}
#${ROOT_ID}.lite .gq-layer.vis .gq-img{animation:none}
@media (prefers-reduced-motion:reduce){#${ROOT_ID} .gq-layer.vis .gq-img{animation:none}#${ROOT_ID} .gq-layer{transition-duration:.8s}}
`;
  const ORN = (cls) => `<svg class="${cls}" viewBox="0 0 320 18" aria-hidden="true"><path d="M2 9h118M200 9h118" stroke="currentColor" stroke-width=".8" fill="none"/><path d="M128 9c10-8 22-8 32 0c10 8 22 8 32 0M128 9c10 8 22 8 32 0c10-8 22-8 32 0" stroke="currentColor" stroke-width=".9" fill="none"/><path d="M160 3l3 6-3 6-3-6z" fill="currentColor"/><circle cx="120" cy="9" r="1.6" fill="currentColor"/><circle cx="200" cy="9" r="1.6" fill="currentColor"/></svg>`;

  const ensureStyle = () => {
    if (document.getElementById(STYLE_ID)) return;
    const s = document.createElement('style'); s.id = STYLE_ID; s.textContent = CSS; document.head.append(s);
    if (![...document.querySelectorAll('link[rel="stylesheet"]')].some((l) => /biblio-astrale\/fonts\.css/.test(l.href))) {
      const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = 'assets/ui/biblio-astrale/fonts.css'; document.head.append(l);
    }
  };

  /* ======================= Construction de la bande ======================= */
  const bgAttr = (bg) => {
    if (bg === null) return ' data-bg="" data-focus=""';
    if (!bg) return '';
    const list = Array.isArray(bg) ? bg : [bg];
    const srcs = list.map((b) => (typeof b === 'string' ? b : b.src)).filter(Boolean).slice(0, 3);
    const focus = (typeof list[0] === 'object' && list[0].focus) || '';
    return ` data-bg="${esc(srcs.join('|'))}" data-focus="${esc(focus)}"`;
  };
  const item = (it) => {
    switch (it.type) {
      case 'dept': return `<h3 class="gq-dept">${esc(it.title)}${it.sub ? `<span class="gq-sub">${esc(it.sub)}</span>` : ''}</h3>`;
      case 'credit': return `<div class="gq-credit"><span class="gq-role">${esc(it.role)}</span><span class="gq-name">${esc(it.name)}</span>${it.desc ? `<span class="gq-desc">${esc(it.desc)}</span>` : ''}</div>`;
      case 'role': return `<span class="gq-role">${esc(it.text)}</span>`;
      case 'name': return `<span class="gq-name${it.big ? ' big' : ''}">${esc(it.text)}</span>`;
      case 'line': return `<p class="gq-line${it.strong ? ' strong' : ''}${it.italic ? ' italic' : ''}">${esc(it.text)}</p>`;
      case 'kicker': return `<span class="gq-kicker">${esc(it.text)}</span>`;
      case 'quote': return `<p class="gq-quote">${esc(it.text)}</p>`;
      case 'sign': return `<span class="gq-signature">${esc(it.text)}</span>`;
      case 'merci': return `<p class="gq-merci">${esc(it.text)}</p>`;
      case 'fin': return `<h2 class="gq-fin">${esc(it.text)}</h2>`;
      case 'suite': return `<span class="gq-suite">${esc(it.text)}</span>`;
      default: return '';
    }
  };
  function buildStrip(chronicle, mode) {
    const parts = [];
    const actHead = (a) => `<section class="gq-block gq-act" data-id="${a.id}" data-act="${a.id}"${bgAttr(a.bg)} style="--gap:40vh"><span class="gq-num">${a.numeral}</span><h2>${esc(a.title)}</h2>${ORN('gq-sep')}</section>`;
    for (const act of D.acts) {
      if (mode === 'chronique' && !act.personal) continue;
      parts.push(actHead(act));
      if (act.personal) {
        parts.push(`<section class="gq-block gq-intro" data-id="chronique-intro" style="--gap:18vh">${act.intro.map((l) => `<p>${esc(l)}</p>`).join('')}</section>`);
        const entries = (chronicle && chronicle.entries) || [];
        if (!entries.length) parts.push(`<section class="gq-block gq-mem" data-id="chronique-vide" style="--gap:12vh"><p>${esc(act.empty)}</p></section>`);
        for (const m of entries) {
          parts.push(`<section class="gq-block gq-mem" data-id="mem-${esc(m.id)}"${bgAttr(m.backgrounds)} data-memory="${esc(m.id)}" style="--gap:34vh"><span class="gq-kicker">${esc(m.categoryLabel || '')}</span><h3>${esc(m.title)}</h3><p>${esc(m.text)}</p><i class="gq-dot" aria-hidden="true"></i></section>`);
        }
        parts.push(`<section class="gq-block gq-conclusion" data-id="chronique-fin"${bgAttr(act.outro.bg)} style="--gap:32vh"><p>${esc(act.outro.text)}</p>${ORN('gq-sep')}</section>`);
        continue;
      }
      for (const b of act.blocks) {
        parts.push(`<section class="gq-block${b.final ? ' gq-final' : ''}" data-id="${b.id}"${bgAttr(b.bg)}${b.final ? ' data-final="1"' : ''} style="--gap:${b.final ? 36 : 22}vh">${b.items.map(item).join('')}</section>`);
      }
    }
    if (mode === 'chronique') parts.push(`<section class="gq-block gq-final" data-id="chronique-retour" data-final="1" style="--gap:30vh">${ORN('gq-sep')}<span class="gq-suite">Ma Chronique</span></section>`);
    return parts.join('');
  }

  /* ======================= Lecteur ======================= */
  let P = null;          // projection en cours
  let intercepting = false;

  function wantMusic() {
    const st = game(); if (!st || st.musicOn === false) return false;
    if (D.track === 'music_menu' && st.menuMusicOn === false) return false; // même sémantique que le menu
    return true;
  }
  const stopFade = () => { if (P && P.fadeT) { clearInterval(P.fadeT); P.fadeT = 0; } };
  function applyGain() { const m = musicEl(); if (!m || !P) return; try { m.volume = sliderVolume() * P.gain; } catch (_e) { /* volume bloqué */ } }
  function fadeGain(target, ms, then) {
    if (!P) { then && then(); return; }
    stopFade();
    const from = P.gain, steps = Math.max(1, Math.round(ms / 40)); let i = 0;
    P.fadeT = setInterval(() => {
      if (!P) return;
      i += 1; P.gain = from + (target - from) * (i / steps); applyGain();
      if (i >= steps) { stopFade(); then && then(); }
    }, 40);
  }

  function orientation() { return window.innerHeight > window.innerWidth * 1.02 ? 'portrait' : 'landscape'; }
  function lite() { return reducedMotion() || Math.min(window.innerWidth, window.innerHeight) < 420 || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2); }

  function mount(mode, chronicle) {
    ensureStyle();
    document.getElementById(ROOT_ID)?.remove();
    const root = document.createElement('div');
    root.id = ROOT_ID;
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');
    root.setAttribute('aria-label', mode === 'chronique' ? 'Ma Chronique' : 'Générique de fin du Tome I');
    const op = D.opening;
    root.innerHTML = `
      <div class="gq-bg"><div class="gq-layer"><div class="gq-fill"></div><img class="gq-img" alt="" decoding="async"></div><div class="gq-layer"><div class="gq-fill"></div><img class="gq-img" alt="" decoding="async"></div></div>
      <div class="gq-veil"></div>
      <canvas class="gq-motes" aria-hidden="true"></canvas>
      <div class="gq-view" aria-live="off"><div class="gq-strip">${buildStrip(chronicle, mode)}</div></div>
      <div class="gq-opening">${ORN('gq-orn top')}<p class="gq-o1">${esc(op.line1)}</p><h1 class="gq-o2">${esc(op.title)}</h1><p class="gq-o3">${esc(mode === 'chronique' ? 'Ma Chronique' : op.tome)}</p>${ORN('gq-orn')}</div>
      <div class="gq-paused">Pause</div>
      <div class="gq-confirm" hidden><span>${mode === 'chronique' ? 'Refermer votre chronique ?' : 'Passer le générique ?'}</span><button type="button" data-gq="skip-yes">Passer</button><button type="button" data-gq="skip-no">Continuer</button></div>
      <div class="gq-ctrl">
        <button type="button" data-gq="pause">Pause</button>
        ${document.fullscreenEnabled ? '<button type="button" data-gq="fs">Plein écran</button>' : ''}
        <button type="button" data-gq="skip">${mode === 'chronique' ? 'Fermer' : 'Passer'}</button>
      </div>`;
    document.body.append(root);
    if (game() && game().devMode) {
      const ctrl = root.querySelector('.gq-ctrl');
      ctrl.insertAdjacentHTML('afterbegin', `<button type="button" class="dev" data-gq="speed">×1</button>${D.acts.filter((a) => mode !== 'chronique' || a.personal).map((a) => `<button type="button" class="dev" data-gq="act" data-act="${a.id}">${a.numeral}</button>`).join('')}`);
    }
    return root;
  }

  function layout() {
    const p = P; if (!p) return;
    p.root.classList.toggle('portrait', p.orient === 'portrait');
    p.root.classList.toggle('lite', lite());
    p.viewH = p.view.clientHeight || window.innerHeight;
    p.speed = Math.max(22, Math.min(46, p.viewH * 0.044)) * (p.devSpeed || 1);
    p.blocks = [...p.strip.querySelectorAll('.gq-block')].map((el) => ({ el, id: el.dataset.id, top: el.offsetTop, h: el.offsetHeight, bg: el.dataset.bg, focus: el.dataset.focus, final: el.dataset.final === '1' }));
    const fin = p.blocks.find((b) => b.final) || p.blocks[p.blocks.length - 1];
    p.stopAt = fin ? fin.top + fin.h / 2 + p.viewH / 2 : p.viewH;
    p.reading = p.viewH * 0.56;
    sizeMotes();
  }
  const screenTop = (b) => P.viewH - P.offset + b.top;
  function anchorNow() {
    const p = P; if (!p || !p.blocks.length) return null;
    let cur = p.blocks[0];
    for (const b of p.blocks) if (screenTop(b) <= p.reading) cur = b;
    return { id: cur.id, rel: (p.reading - screenTop(cur)) / Math.max(1, cur.h) };
  }
  function relayout() {
    const p = P; if (!p) return;
    const anchor = p.started ? anchorNow() : null;
    p.orient = orientation();
    layout();
    if (anchor) {
      const b = p.blocks.find((x) => x.id === anchor.id);
      if (b) p.offset = b.top + anchor.rel * b.h + p.viewH - p.reading;
      p.offset = Math.max(0, Math.min(p.offset, p.stopAt));
      paintStrip();
    }
  }
  const paintStrip = () => { if (P) P.strip.style.transform = `translate3d(0,${(P.viewH - P.offset).toFixed(1)}px,0)`; };

  /* ---- Fonds : un fond par bloc de sens, fondu enchaîné, hystérésis, préchargement léger ---- */
  const loaded = new Map(); // src -> Promise<boolean>
  function preload(src) {
    if (!src) return Promise.resolve(false);
    if (loaded.has(src)) return loaded.get(src);
    const pr = new Promise((res) => { const im = new Image(); im.decoding = 'async'; im.onload = () => res(true); im.onerror = () => res(false); im.src = src; });
    loaded.set(src, pr);
    if (loaded.size > 14) { const first = loaded.keys().next().value; loaded.delete(first); } // libère les anciens médias
    return pr;
  }
  function showBg(src, focus) {
    const p = P; if (!p) return;
    if (src === p.bgSrc) return;
    const token = ++p.bgToken;
    const go = (ok) => {
      if (!P || token !== p.bgToken) return;
      if (src && !ok) return; // asset manquant : on garde le fond valide
      const layers = p.layers; const next = layers[p.bgIdx ^ 1], cur = layers[p.bgIdx];
      const img = next.querySelector('.gq-img'), fill = next.querySelector('.gq-fill');
      if (src) { img.src = src; img.style.setProperty('--focus', focus || '60% 45%'); img.style.visibility = ''; fill.style.backgroundImage = `url("${src.replace(/"/g, '%22')}")`; }
      else { img.removeAttribute('src'); img.style.visibility = 'hidden'; fill.style.backgroundImage = 'none'; }
      // relance la dérive de caméra
      img.style.animation = 'none'; void img.offsetWidth; img.style.animation = '';
      next.classList.add('vis'); cur.classList.remove('vis');
      p.bgIdx ^= 1; p.bgSrc = src; p.bgSince = p.clock;
    };
    if (!src) go(true); else preload(src).then(go);
  }
  function syncBg() {
    const p = P; if (!p || !p.blocks.length) return;
    // bloc de sens actif : dernier bloc porteur d’un fond dont le haut a franchi la ligne de lecture (marge d’hystérésis)
    let target = null, idx = -1;
    p.blocks.forEach((b, i) => { if (b.bg !== undefined && screenTop(b) <= p.reading + p.viewH * 0.08) { target = b; idx = i; } });
    if (!target) return;
    if (p.clock - p.bgSince < T.minHold && p.bgSrc !== undefined) return;
    const list = target.bg ? target.bg.split('|').filter(Boolean) : [];
    let src = list[0] || '';
    if (list.length > 1) {
      // plusieurs images pour un souvenir : la suivante seulement après un maintien suffisant
      const since = p.blockSince[target.id] ?? (p.blockSince[target.id] = p.clock);
      const per = Math.max(7, target.h / p.speed / list.length);
      src = list[Math.min(list.length - 1, Math.floor((p.clock - since) / per))];
    }
    showBg(src, target.focus);
    // précharge le petit groupe suivant
    for (const b of p.blocks.slice(idx + 1, idx + 4)) if (b.bg) b.bg.split('|').slice(0, 1).forEach(preload);
  }

  /* ---- Cendres et poussières ---- */
  function sizeMotes() {
    const p = P; if (!p) return;
    const c = p.canvas, r = Math.min(2, window.devicePixelRatio || 1);
    c.width = Math.round(window.innerWidth * r); c.height = Math.round(window.innerHeight * r);
    const n = lite() ? 14 : (p.orient === 'portrait' ? 46 : 30);
    p.motes = Array.from({ length: n }, (_, i) => ({ x: Math.random(), y: Math.random(), s: 0.6 + Math.random() * 1.8, v: 0.006 + Math.random() * 0.018, w: Math.random() * 6.28, ember: p.orient === 'portrait' ? i % 3 === 0 : i % 7 === 0 }));
  }
  function drawMotes(dt) {
    const p = P; if (!p || !p.motes) return;
    const c = p.canvas, g = c.getContext('2d'); if (!g) return;
    g.clearRect(0, 0, c.width, c.height);
    const r = c.width / Math.max(1, window.innerWidth);
    for (const m of p.motes) {
      if (!p.paused) { m.y -= m.v * dt; m.w += dt * 0.6; m.x += Math.sin(m.w) * 0.0004; if (m.y < -0.05) { m.y = 1.05; m.x = Math.random(); } }
      const a = 0.18 + 0.32 * Math.abs(Math.sin(m.w));
      g.fillStyle = m.ember ? `rgba(255,${150 + Math.round(60 * a)},90,${(a * 0.85).toFixed(3)})` : `rgba(233,214,170,${(a * 0.5).toFixed(3)})`;
      g.beginPath(); g.arc(m.x * c.width, m.y * c.height, m.s * r * (m.ember ? 1.15 : 1), 0, 6.283); g.fill();
    }
  }

  /* ---- Horloge : temps réel écoulé, arrêtée en pause ou hors de l’écran ---- */
  function frame(now) {
    const p = P; if (!p) return;
    const dt = Math.min(0.25, Math.max(0, (now - (p.last || now)) / 1000));
    p.last = now;
    const running = !p.paused && !document.hidden;
    if (running) {
      p.clock += dt;
      if (p.phase === 'opening') {
        if (p.clock >= p.openEnd) startStrip();
      } else if (p.phase === 'strip') {
        p.offset = Math.min(p.stopAt, p.offset + p.speed * dt);
        paintStrip();
        syncBg();
        if (p.offset >= p.stopAt) { p.phase = 'hold'; p.holdEnd = p.clock + T.finalHold; }
      } else if (p.phase === 'hold') {
        syncBg();
        if (p.clock >= p.holdEnd) finish('fin');
      }
    }
    drawMotes(running ? dt : 0);
    p.raf = requestAnimationFrame(frame);
  }
  function startStrip() {
    const p = P; if (!p) return;
    p.opening.classList.add('gone');
    p.phase = 'strip'; p.started = true; p.offset = 0;
    layout(); paintStrip();
  }

  /* ---- Contrôles discrets ---- */
  function poke() {
    const p = P; if (!p) return;
    p.root.classList.add('ctrl'); clearTimeout(p.ctrlT);
    p.ctrlT = setTimeout(() => { if (P && P.confirm.hidden) P.root.classList.remove('ctrl'); }, 3200);
    const m = musicEl();
    // autoplay bloqué : la musique démarre au premier geste autorisé
    if (m && wantMusic() && !p.paused && m.paused && p.musicStarted) m.play().then(applyGain).catch(() => {});
  }
  function setPaused(on) {
    const p = P; if (!p) return;
    p.paused = on; p.root.classList.toggle('paused', on);
    const b = p.root.querySelector('[data-gq="pause"]'); if (b) b.textContent = on ? 'Reprendre' : 'Pause';
    const m = musicEl();
    if (on) { p.musicWasPlaying = !!(m && !m.paused); if (p.musicWasPlaying) try { m.pause(); } catch (_e) { /* déjà en pause */ } }
    else if (p.musicWasPlaying && m && wantMusic()) m.play().then(applyGain).catch(() => {});
  }
  function askSkip(on) { const p = P; if (!p) return; p.confirm.hidden = !on; if (on) { p.root.classList.add('ctrl'); p.confirm.querySelector('[data-gq="skip-no"]').focus({ preventScroll: true }); } }
  function onClick(ev) {
    const b = ev.target.closest('[data-gq]'); poke();
    if (!b) return;
    ev.preventDefault();
    const a = b.dataset.gq;
    if (a === 'pause') setPaused(!P.paused);
    else if (a === 'skip') askSkip(P.confirm.hidden);
    else if (a === 'skip-no') askSkip(false);
    else if (a === 'skip-yes') finish('passe');
    else if (a === 'fs') { try { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen(); } catch (_e) { /* indisponible */ } }
    else if (a === 'speed') { P.devSpeed = P.devSpeed === 6 ? 1 : 6; b.textContent = '×' + P.devSpeed; P.speed = Math.max(22, Math.min(46, P.viewH * 0.044)) * P.devSpeed; }
    else if (a === 'act') jumpTo(b.dataset.act);
  }
  function jumpTo(actId) {
    const p = P; if (!p) return;
    if (p.phase === 'opening') { p.clock = p.openEnd; startStrip(); }
    const blk = p.blocks.find((x) => x.el.dataset.act === actId); if (!blk) return;
    p.phase = 'strip'; p.offset = Math.min(p.stopAt, blk.top + p.viewH - p.reading); p.bgSince = -99; paintStrip(); syncBg();
  }
  function onKey(ev) {
    if (!P) return;
    if (ev.key === ' ' || ev.key === 'Spacebar') { ev.preventDefault(); ev.stopPropagation(); setPaused(!P.paused); poke(); }
    else if (ev.key === 'Escape' || ev.key === 'Esc') { ev.preventDefault(); ev.stopPropagation(); askSkip(P.confirm.hidden); }
    else { ev.stopPropagation(); }
  }
  function onVisibility() { if (P) P.last = performance.now(); }
  let resizeT = 0;
  function onResize() { clearTimeout(resizeT); resizeT = setTimeout(relayout, 140); }

  /* ---- Ouverture / fermeture ---- */
  function open(mode, chronicle, opts = {}) {
    if (P) return false;
    const root = mount(mode, chronicle);
    P = {
      mode, root, chronicle, opts,
      view: root.querySelector('.gq-view'), strip: root.querySelector('.gq-strip'), opening: root.querySelector('.gq-opening'),
      layers: [...root.querySelectorAll('.gq-layer')], canvas: root.querySelector('.gq-motes'), confirm: root.querySelector('.gq-confirm'),
      orient: orientation(), clock: 0, offset: 0, phase: 'opening', paused: false, started: false, gain: 0, bgIdx: 0, bgToken: 0, bgSince: -99, bgSrc: undefined, blockSince: {}, devSpeed: 1,
      prevMusicKey: (musicEl() && musicEl().dataset.currentKey) || '', prevMusicPaused: !musicEl() || musicEl().paused,
    };
    P.openEnd = T.openingIn + T.openingHold + (mode === 'chronique' ? -1.5 : 0);
    layout();
    paintStrip();
    root.addEventListener('click', onClick);
    root.addEventListener('pointermove', poke, { passive: true });
    root.addEventListener('pointerdown', (ev) => { ev.stopPropagation(); poke(); }, { passive: true });
    ['dblclick', 'contextmenu', 'wheel', 'touchmove'].forEach((t) => root.addEventListener(t, (ev) => { ev.stopPropagation(); }, { passive: true }));
    document.addEventListener('keydown', onKey, true);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    requestAnimationFrame(() => { root.classList.add('on'); requestAnimationFrame(() => P && P.opening.classList.add('in')); });
    // premier fond derrière le titre : celui du premier acte, discret
    const firstAct = D.acts.find((a) => mode !== 'chronique' || a.personal);
    if (firstAct && firstAct.bg) showBg(firstAct.bg.src, firstAct.bg.focus);
    P.raf = requestAnimationFrame(frame);
    return true;
  }
  function startMusic() {
    const p = P; if (!p) return;
    p.musicStarted = true;
    const m = musicEl();
    if (!wantMusic()) { if (m && !m.paused) try { m.pause(); } catch (_e) { /* ignore */ } return; }
    p.gain = 0; applyGain();
    try { if (typeof playMusic === 'function') playMusic(D.track); } catch (_e) { /* piste indisponible : générique silencieux */ }
    if (m && m.dataset.currentKey !== D.track) { try { m.pause(); } catch (_e) { /* ignore */ } return; }
    if (m && m.paused) m.play().catch(() => {});
    fadeGain(1, 2600);
  }
  function finish(reason) {
    const p = P; if (!p || p.closing) return;
    p.closing = true;
    p.root.classList.add('out');
    const done = () => {
      cancelAnimationFrame(p.raf);
      document.removeEventListener('keydown', onKey, true);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
      clearTimeout(p.ctrlT); stopFade();
      p.root.remove();
      P = null;
      const m = musicEl();
      if (m) try { m.volume = sliderVolume(); } catch (_e) { /* ignore */ }
      if (p.mode === 'chronique') {
        // retour à l’écran d’origine : on rend la piste qui jouait avant
        if (p.prevMusicKey && p.prevMusicKey !== D.track && typeof playMusic === 'function') { try { playMusic(p.prevMusicKey); } catch (_e) { /* ignore */ } }
        else if (p.prevMusicPaused && m) try { m.pause(); } catch (_e) { /* ignore */ }
      } else {
        // fin de projection : retour au menu principal, thème du menu conservé sans doublon
        try { if (typeof setScreen === 'function') setScreen('title'); } catch (_e) { /* ignore */ }
        try { if (document.body.classList.contains('ui-biblio') && window.BibliothequeAstrale) window.BibliothequeAstrale.route('#/titre'); } catch (_e) { /* ignore */ }
      }
      try { window.SylviniaGenerique.lastEnd = reason; } catch (_e) { /* ignore */ }
    };
    // fondu de fin de la musique vers le menu : on revient au volume du menu (ou on se tait si la piste ne doit pas jouer)
    const m = musicEl();
    if (p.mode === 'chronique' && m && !m.paused && p.prevMusicKey !== D.track) fadeGain(0, T.outro * 1000 * 0.9);
    setTimeout(done, T.outro * 1000);
  }

  /* ---- Déclencheur réel : fin de l’épilogue ---- */
  function fromEpilogue(prevGo, ctx, args) {
    intercepting = true;
    let chronicle = null;
    try { chronicle = ensureChronicle(); } catch (err) { console.error('[Sylvinia] Chronique', err); }
    let opened = false;
    try { opened = open('generique', chronicle); } catch (err) { console.error('[Sylvinia] Générique', err); }
    if (!opened) { intercepting = false; return prevGo.apply(ctx, args); }
    // transition audio douce depuis l’épilogue, puis le moteur rejoint le menu (sauvegarde comprise) sous le voile
    const m = musicEl();
    const after = () => {
      try { prevGo.apply(ctx, args); } catch (err) { console.error('[Sylvinia] Retour au menu', err); }
      intercepting = false;
      startMusic();
    };
    if (m && !m.paused) { P.gain = 1; fadeGain(0, 1300, after); } else setTimeout(after, 300);
    return undefined;
  }

  if (typeof go === 'function') {
    const previousGo = go;
    go = window.go = function (next) {
      const st = game();
      const from = st ? st.scene : null;
      if (next === 'menu' && from === 'c19_fin' && !P && !intercepting) return fromEpilogue(previousGo, this, arguments);
      if (P && P.mode === 'generique' && next === 'menu') return undefined; // double clic pendant le générique
      const wasComplete = Boolean(st && st.flags && st.flags.tome1Complete);
      const result = previousGo.apply(this, arguments);
      if (next === 'c19_bilan') { try { recordAtValidation(wasComplete); } catch (err) { console.error('[Sylvinia] Capture de la chronique', err); } }
      return result;
    };
  }

  // Le choix « Retour au menu » passe par choose(), qui rejoint le menu sans appeler go().
  if (typeof choose === 'function') {
    const previousChoose = choose;
    choose = window.choose = function (ch) {
      const st = game();
      if (ch && ch.next === 'menu' && st && st.scene === 'c19_fin') {
        if (P && P.mode === 'generique') return undefined;
        if (!P && !intercepting) return fromEpilogue(previousChoose, this, arguments);
      }
      return previousChoose.apply(this, arguments);
    };
  }

  // Une seule piste : pendant la projection, aucune autre musique ne peut s’imposer.
  if (typeof playMusic === 'function') {
    const previousPlayMusic = playMusic;
    playMusic = window.playMusic = function (key) {
      if (P && !P.closing && key !== D.track) return undefined;
      const r = previousPlayMusic.apply(this, arguments);
      if (P && !P.closing) applyGain();
      return r;
    };
  }

  // « Nouveau départ » efface toutes les sauvegardes : la copie de la chronique suit.
  if (typeof resetProgress === 'function') {
    const previousReset = resetProgress;
    resetProgress = window.resetProgress = function () {
      const before = game();
      const r = previousReset.apply(this, arguments);
      if (game() !== before) { try { localStorage.removeItem(MIRROR_KEY); } catch (_e) { /* ignore */ } }
      return r;
    };
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn && resetBtn.onclick === previousReset) resetBtn.onclick = resetProgress;
  }

  /* ---- Ma Chronique : Progression (interface classique) ---- */
  function openChronicle() {
    const cap = currentChronicle();
    if (!cap) return false;
    return open('chronique', cap);
  }
  if (typeof renderProgression === 'function') {
    const previousRender = renderProgression;
    renderProgression = window.renderProgression = function () {
      const r = previousRender.apply(this, arguments);
      try {
        const back = document.getElementById('progressBackBtn');
        let btn = document.getElementById('maChroniqueBtn');
        if (currentChronicle()) {
          if (!btn && back) {
            btn = document.createElement('button'); btn.id = 'maChroniqueBtn'; btn.type = 'button'; btn.className = 'topBtn backWide'; btn.textContent = 'Ma Chronique';
            btn.addEventListener('click', (ev) => { ev.stopPropagation(); openChronicle(); });
            back.parentNode.insertBefore(btn, back);
          }
        } else if (btn) btn.remove();
      } catch (_e) { /* ignore */ }
      return r;
    };
  }

  const update = document.querySelector('.menuUpdateBubble');
  if (update) update.textContent = 'Mise à jour · ' + GAME_VERSION + ' · Générique de fin du Tome I';

  window.SylviniaGenerique = {
    version: GAME_VERSION,
    get active() { return Boolean(P); },
    hasChronicle: () => Boolean(currentChronicle()),
    chronicle: () => currentChronicle(),
    ouvrirChronique: openChronicle,
    // Outils de développement et de recette (aucun effet sur la sauvegarde).
    jouer: (opts = {}) => open(opts.mode || 'generique', opts.chronicle || currentChronicle(), opts) && (startMusic(), true),
    apercu: (flagsObj) => C.select({ flags: flagsObj || flags() }),
    etat: () => P && { mode: P.mode, phase: P.phase, offset: Math.round(P.offset), stopAt: Math.round(P.stopAt), clock: +P.clock.toFixed(2), orient: P.orient, paused: P.paused, bg: P.bgSrc, anchor: anchorNow(), speed: P.speed },
    vitesse: (n = 1) => { if (P) { P.devSpeed = n; P.speed = Math.max(22, Math.min(46, P.viewH * 0.044)) * n; } },
    passer: () => finish('passe'),
    pause: (on = true) => setPaused(on),
  };
})();
