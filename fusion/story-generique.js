/* Mode Histoire · Générique de fin du Tome I (lecteur)
   Déclencheur : le choix « Retour au menu » de c19_fin, après la dernière ligne de l’épilogue.
   Écran dédié, hors moteur de scènes : ne touche ni aux stats, ni aux flags narratifs, ni à l’inventaire.
   Données : fusion/story-generique-credits.js (contenu fixe) et fusion/story-generique-chronique.js (souvenirs). */
(() => {
  'use strict';

  const D = window.SylviniaGeneriqueData;
  const C = window.SylviniaChronique;
  if (!D || !C) return;

  const GAME_VERSION = 'v0.433';
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

  /* ======================= Journal de parcours ======================= */
  // Chaque décision réellement cliquée (écran à plusieurs choix) est notée à part de la sauvegarde principale,
  // pour survivre aux reconstructions d’état des lancements de chapitre. Une décision par écran (la dernière).
  const TRAIL_KEY = 'sylvinia_vn_parcours_v1';
  const TRAIL_MAX = 900;
  const readTrail = () => { try { const o = JSON.parse(localStorage.getItem(TRAIL_KEY) || 'null'); return o && Array.isArray(o.list) ? o.list : []; } catch (_e) { return []; } };
  const writeTrail = (list) => { try { localStorage.setItem(TRAIL_KEY, JSON.stringify({ v: 1, list: list.slice(-TRAIL_MAX) })); } catch (_e) { /* stockage plein : le repli par flags suffit */ } };
  const clearTrail = () => { try { localStorage.removeItem(TRAIL_KEY); } catch (_e) { /* ignore */ } };
  const labelText = (c) => { try { const l = typeof c.label === 'function' ? c.label() : c.label; return String(l || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim(); } catch (_e) { return ''; } };
  function recordChoice(ch) {
    const st = game(); if (!st || !ch || P) return;
    const sid = st.scene;
    const scene = (typeof S !== 'undefined' && S) ? S[sid] : null;
    if (!scene || !Array.isArray(scene.choices) || scene.choices.length < 2) return;
    try { if (typeof choiceAvailable === 'function' && !choiceAvailable(ch)) return; } catch (_e) { /* ignore */ }
    const label = labelText(ch); if (!label) return;
    const list = readTrail().filter((t) => t[0] !== sid);
    list.push([sid, label]);
    writeTrail(list);
  }
  // Journal de lecture de la Bibliothèque Astrale (choix récents) : preuve d’appoint pour les anciennes parties.
  const readBiblioJournal = () => {
    try { const g = JSON.parse(localStorage.getItem('sylvinia_biblio_astrale_v2') || '{}'); return (Array.isArray(g.journal) ? g.journal : []).filter((e) => e && e.choix && e.id).map((e) => [String(e.id), String(e.choix)]); } catch (_e) { return []; }
  };
  const chronicleContext = () => ({
    scenes: (typeof S !== 'undefined' && S) || {},
    memoryDefs: (typeof PROGRESSION_MEMORIES !== 'undefined' && PROGRESSION_MEMORIES) || {},
    chapters: (typeof CHAPTER_SELECT_DATA !== 'undefined' && CHAPTER_SELECT_DATA) || [],
    trail: readTrail(),
    journal: readBiblioJournal(),
  });

  /* ======================= Capture de la chronique ======================= */
  const readMirror = () => { try { const o = JSON.parse(localStorage.getItem(MIRROR_KEY) || 'null'); return o && (o.v === 1 || o.v === 2) ? o : null; } catch (_e) { return null; } };
  const writeMirror = (cap) => { try { localStorage.setItem(MIRROR_KEY, JSON.stringify(cap)); } catch (_e) { /* stockage plein : la copie dans la sauvegarde suffit */ } };
  const validCapture = (o) => Boolean(o && o.v === 2 && Array.isArray(o.chapters));
  const legacyCapture = (o) => Boolean(o && o.v === 1 && Array.isArray(o.entries));

  function makeCapture(provenance, extraEvidence) {
    const st = game() || {};
    const source = { flags: { ...(st.flags || {}), ...(extraEvidence || {}) }, memories: st.memories || [] };
    const cap = C.captureV2(source, chronicleContext(), { game: GAME_VERSION, at: new Date().toISOString(), provenance });
    cap.run = Math.random().toString(36).slice(2, 10);
    return cap;
  }
  function storeCapture(cap) {
    const st = game(); if (!st) return;
    st[STATE_KEY] = cap;
    writeMirror(cap);
    try { if (typeof save === 'function') save(); } catch (_e) { /* sauvegarde indisponible */ }
  }
  const replaying = () => { const st = game(); return Boolean(!st || st.devMode || flags().finaleReplay); };
  // Une vraie partie qui valide le Tome I (entrée dans c19_bilan) écrit sa propre chronique.
  // Jamais en mode développeur ni pendant une relecture : la chronique d’origine reste intacte.
  function recordAtValidation(wasComplete) {
    if (replaying()) return;
    if (!wasComplete) { storeCapture(makeCapture('partie')); return; }
    ensureChronicle();
  }
  // Partie déjà terminée : on reprend sa chronique. Sinon (sauvegarde antérieure, ou chronique v0.429 plafonnée
  // à 16 souvenirs), on la reconstitue à partir des preuves présentes, marquées comme telles, sans rien inventer.
  // Capture v0.430 (tout le parcours dans le générique) : le parcours complet passe dans « complet »
  // (Ma Chronique, Progression) et le générique ne garde que les choix marquants, recalculés sur les preuves figées.
  function upgrade(cap) {
    if (!validCapture(cap) || Array.isArray(cap.complet)) return cap;
    const chapters = C.chronicle({ flags: cap.evidence || {}, memories: cap.memories || [] }, chronicleContext());
    return { ...cap, complet: cap.chapters, countsComplet: cap.counts, chapters,
      entries: chapters.flatMap((c) => c.items.filter((x) => x.kind === 'souvenir')),
      counts: { chapitres: chapters.length, rubriques: chapters.reduce((n, c) => n + c.items.length, 0) }, upgraded: GAME_VERSION };
  }
  function ensureChronicle() {
    const st = game(); if (!st) return null;
    if (validCapture(st[STATE_KEY])) {
      const up = upgrade(st[STATE_KEY]);
      if (up !== st[STATE_KEY] && !replaying()) storeCapture(up);
      return up;
    }
    const mirror = upgrade(readMirror());
    if (replaying() || !flags().tome1Complete) return validCapture(mirror) ? mirror : null;
    if (validCapture(mirror)) { storeCapture(mirror); return mirror; }
    const legacy = legacyCapture(st[STATE_KEY]) ? st[STATE_KEY] : (legacyCapture(mirror) ? mirror : null);
    const cap = legacy ? makeCapture('mise-a-niveau-v0.429', legacy.evidence) : makeCapture('sauvegarde-anterieure');
    storeCapture(cap);
    return cap;
  }
  // Chronique à projeter : la capture figée, sinon (mode développeur, relecture, partie non validée)
  // un aperçu calculé sur l’état courant, jamais enregistré.
  function chronicleForCredits() {
    const cap = ensureChronicle();
    if (cap) return cap;
    return makeCapture('apercu');
  }
  const currentChronicle = () => {
    const st = game(); if (st && validCapture(st[STATE_KEY]) && Array.isArray(st[STATE_KEY].complet)) return st[STATE_KEY];
    if (!replaying() && flags().tome1Complete) { try { return ensureChronicle(); } catch (_e) { /* ignore */ } }
    if (st && validCapture(st[STATE_KEY])) return upgrade(st[STATE_KEY]);
    const m = upgrade(readMirror()); return validCapture(m) ? m : null;
  };
  // Ma Chronique et « Revoir le générique » se débloquent en finissant le Tome I (le mode développeur les ouvre en aperçu).
  const unlocked = () => { const st = game(); if (!st) return false; if (st.devMode) return true; return Boolean(flags().tome1Complete && currentChronicle()); };
  function registre() {
    if (!unlocked()) return null;
    let cap = currentChronicle(); let apercu = false;
    if (!cap) { cap = makeCapture('apercu'); apercu = true; }
    const chapters = Array.isArray(cap.complet) ? cap.complet : C.chronicle({ flags: cap.evidence || {}, memories: cap.memories || [] }, chronicleContext(), { complet: true });
    return { apercu, provenance: cap.provenance, chapters, counts: { chapitres: chapters.length, rubriques: chapters.reduce((n, c) => n + c.items.length, 0) } };
  }
  function replayCredits() {
    if (!unlocked() || P) return false;
    const cap = currentChronicle() || makeCapture('apercu');
    const ok = open('generique', cap, { replay: true });
    if (ok) startMusic();
    return ok;
  }

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
.gq-confirm{position:absolute;left:max(14px,env(safe-area-inset-left));z-index:3;bottom:calc(max(14px,env(safe-area-inset-bottom)) + 44px);display:flex;align-items:center;gap:8px;padding:8px 10px 8px 14px;background:rgba(8,8,16,.62);border:1px solid rgba(233,201,133,.28);border-radius:14px;font:italic 500 15px/1.2 "Cormorant Garamond",Georgia,serif;color:#efe6cf}
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
/* ---- Votre Chronique : rubriques par chapitre ---- */
.gq-chap{padding-top:2vh}
.gq-chap-court .gq-chap-title{font-size:clamp(18px,3vmin,30px)}
.gq-cover{display:block;width:clamp(58px,9vmin,92px);aspect-ratio:2/3;margin:0 auto .9em;border-radius:3px 6px 6px 3px;overflow:hidden;border:1px solid rgba(233,201,133,.45);box-shadow:0 8px 22px rgba(0,0,0,.55),inset 6px 0 0 rgba(0,0,0,.35);opacity:.92}
.gq-cover img{width:100%;height:100%;object-fit:cover;display:block;filter:saturate(.85) brightness(.85)}
.gq-chap-label{display:block;font:600 clamp(11px,1.7vmin,15px)/1 "Cinzel",Georgia,serif;letter-spacing:.38em;text-indent:.38em;text-transform:uppercase;color:rgba(233,201,133,.78)}
.gq-chap-title{margin:.45em 0 0;font:700 clamp(21px,3.7vmin,38px)/1.15 "Cinzel",Georgia,serif;letter-spacing:.04em;color:#f3dca2}
.gq-sep.small{width:min(56%,200px);margin:.8em auto 0}
.gq-choices ul{list-style:none;margin:0 auto;padding:0;max-width:30em}
.gq-rub{margin:0 0 1.05em}
.gq-rub.tight{margin-top:-.45em}
.gq-ctx{display:block;margin-bottom:.22em;font:600 clamp(10px,1.45vmin,13px)/1.3 "Cinzel",Georgia,serif;letter-spacing:.18em;text-transform:uppercase;color:rgba(214,196,160,.66)}
.gq-said{display:block;font:italic 500 clamp(16px,2.35vmin,22px)/1.38 "Cormorant Garamond",Georgia,serif;color:rgba(246,239,222,.93)}
.gq-souv .gq-ctx{color:rgba(233,201,133,.82);letter-spacing:.08em;text-transform:none;font:600 italic clamp(14px,2vmin,18px)/1.3 "Cormorant Garamond",Georgia,serif}
.gq-body{display:block;font:400 clamp(14px,2vmin,18px)/1.42 "Cormorant Garamond",Georgia,serif;color:rgba(226,215,192,.78)}
/* ---- Transition depuis l’épilogue : voile tombant du haut, deux lignes, lancement ---- */
#${ROOT_ID}.prelude{background:transparent}
#${ROOT_ID}.prelude .gq-bg,#${ROOT_ID}.prelude .gq-veil,#${ROOT_ID}.prelude .gq-view,#${ROOT_ID}.prelude .gq-motes{opacity:0}
.gq-bg,.gq-veil,.gq-view,.gq-motes{transition:opacity 2.4s ease}
.gq-curtain{position:absolute;left:0;right:0;top:0;height:150%;transform:translate3d(0,-100%,0);background:linear-gradient(180deg,#050407 0%,#050407 66%,rgba(5,4,7,.85) 78%,rgba(5,4,7,0) 100%);pointer-events:none;transition:transform var(--curtain,3s) cubic-bezier(.55,.06,.35,1)}
#${ROOT_ID}.prelude .gq-curtain.down,#${ROOT_ID} .gq-curtain.down{transform:translate3d(0,0,0)}
#${ROOT_ID}.played .gq-curtain{opacity:0;transition:opacity 1.2s ease}
.gq-prelude{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.9em;padding:24px;text-align:center;pointer-events:none}
.gq-prelude p{margin:0;max-width:26em;font:italic 500 clamp(19px,3.3vmin,32px)/1.4 "Cormorant Garamond",Georgia,serif;color:#f1e4c4;opacity:0;transform:translateY(8px);transition:opacity 1.4s ease,transform 1.8s ease;text-shadow:0 0 18px rgba(0,0,0,.8)}
.gq-prelude p.in{opacity:1;transform:none}
.gq-prelude p.out{opacity:0;transform:translateY(-6px)}
.gq-launch{position:absolute;left:50%;top:50%;width:min(70vmin,560px);height:2px;transform:translate(-50%,-50%) scaleX(0);background:linear-gradient(90deg,rgba(233,201,133,0),#f3d58e 50%,rgba(233,201,133,0));box-shadow:0 0 18px rgba(243,213,142,.7),0 0 46px rgba(243,213,142,.35);opacity:0;pointer-events:none}
.gq-launch.go{animation:gqLaunch var(--launch,2.2s) cubic-bezier(.3,.7,.2,1) forwards}
@keyframes gqLaunch{0%{opacity:0;transform:translate(-50%,-50%) scaleX(0)}35%{opacity:1;transform:translate(-50%,-50%) scaleX(1)}70%{opacity:1;transform:translate(-50%,-50%) scaleX(1.05) scaleY(1)}100%{opacity:0;transform:translate(-50%,-50%) scaleX(1.4) scaleY(160)}}
/* ---- Boutons discrets toujours présents : Accélérer, Passer ---- */
.gq-quick{position:absolute;left:max(14px,env(safe-area-inset-left));bottom:max(14px,env(safe-area-inset-bottom));display:flex;gap:7px;opacity:.38;transition:opacity .4s ease;z-index:2}
.gq-quick:hover,.gq-quick:focus-within,#${ROOT_ID}.ctrl .gq-quick{opacity:.92}
.gq-quick button{font:600 11px/1 "Cinzel",Georgia,serif;letter-spacing:.12em;color:rgba(243,230,200,.9);background:rgba(8,8,16,.34);border:1px solid rgba(233,201,133,.28);border-radius:999px;padding:7px 12px;cursor:pointer;backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px)}
.gq-quick button.on{border-color:rgba(233,201,133,.8);color:#fff3d0;background:rgba(60,44,18,.42)}
.gq-quick button:focus-visible{outline:1px solid rgba(233,201,133,.8);outline-offset:2px}
#${ROOT_ID}.prelude .gq-quick,#${ROOT_ID}.gate .gq-quick,#${ROOT_ID}.gate .gq-ctrl{display:none}
/* ---- Passerelle de fin ---- */
.gq-gate{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity 1.8s ease}
#${ROOT_ID}.gate .gq-gate{opacity:1;pointer-events:auto}
#${ROOT_ID}.gate .gq-view,#${ROOT_ID}.gate .gq-opening{opacity:0;transition:opacity 1.2s ease}
.gq-gate video,.gq-gate .gq-gate-poster{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:saturate(.85) brightness(.5)}
.gq-gate-veil{position:absolute;inset:0;background:radial-gradient(ellipse 60% 42% at 50% 50%,rgba(5,4,8,.62) 0%,rgba(5,4,8,.38) 60%,rgba(5,4,8,0) 100%),radial-gradient(ellipse 90% 75% at 50% 55%,rgba(5,4,8,.15) 0%,rgba(5,4,8,.7) 78%,rgba(5,4,8,.9) 100%)}
.gq-gate-card{position:relative;max-width:min(92vw,40rem);padding:clamp(18px,4vmin,40px);text-align:center;text-shadow:0 1px 3px rgba(0,0,0,.85)}
.gq-gate-card{isolation:isolate}
.gq-gate-card::before{content:"";position:absolute;inset:-6% -14% -2%;z-index:-1;background:radial-gradient(closest-side,rgba(6,5,10,.62) 0%,rgba(6,5,10,.42) 55%,rgba(6,5,10,0) 100%);pointer-events:none}
.gq-gate-card h2{margin:.25em 0 .35em;font:700 clamp(30px,6.4vmin,64px)/1.05 "Cinzel Decorative","Cinzel",Georgia,serif;color:#f7e3a8;text-shadow:0 0 2px rgba(0,0,0,.95),0 2px 6px rgba(0,0,0,.9),0 0 22px rgba(0,0,0,.8),0 0 2px rgba(255,236,190,.35)}
.gq-gate-card .gq-kicker{color:rgba(246,226,170,.95);text-shadow:0 0 6px rgba(0,0,0,.95)}
.gq-gate-card p{margin:.2em 0;font:italic 500 clamp(16px,2.6vmin,23px)/1.4 "Cormorant Garamond",Georgia,serif;color:rgba(244,236,216,.92)}
.gq-gate-actions{display:flex;flex-wrap:wrap;gap:clamp(10px,2vmin,18px);justify-content:center;margin-top:clamp(16px,3.6vmin,34px)}
.gq-gate-actions button{flex:1 1 15rem;max-width:19rem;display:flex;flex-direction:column;gap:.35em;align-items:center;padding:clamp(11px,2vmin,16px) 18px;border-radius:14px;border:1px solid rgba(233,201,133,.38);background:rgba(10,9,18,.5);color:#f6ead0;cursor:pointer;backdrop-filter:blur(5px);-webkit-backdrop-filter:blur(5px);transition:border-color .3s,background .3s,transform .3s}
.gq-gate-actions button b{font:600 clamp(13px,1.9vmin,16px)/1.2 "Cinzel",Georgia,serif;letter-spacing:.08em}
.gq-gate-actions button small{font:italic 500 clamp(13px,1.8vmin,15px)/1.3 "Cormorant Garamond",Georgia,serif;color:rgba(226,214,190,.78)}
.gq-gate-actions button:hover,.gq-gate-actions button:focus-visible{border-color:rgba(233,201,133,.85);background:rgba(40,30,14,.55);transform:translateY(-2px);outline:none}
.gq-gate-actions button.ca{border-color:rgba(190,150,255,.45)}
.gq-gate-actions button.ca:hover,.gq-gate-actions button.ca:focus-visible{border-color:rgba(205,175,255,.9);background:rgba(36,20,58,.55)}
@media (max-height:560px){.gq-gate-card h2{font-size:clamp(26px,7vmin,44px)}.gq-gate-actions{margin-top:12px}}
@media (prefers-reduced-motion:reduce){#${ROOT_ID} .gq-layer.vis .gq-img{animation:none}#${ROOT_ID} .gq-layer{transition-duration:.8s}}
/* ==== Composition en trois couches : 01 course de Hylee, 02 illustrations, 03 texte et interface ==== */
#${ROOT_ID}{isolation:isolate}
.gq-score{position:absolute;width:0;height:0;overflow:hidden;pointer-events:none}
.gq-course{position:absolute;inset:0;z-index:0;pointer-events:none;overflow:hidden;background:#050407}
.gq-bg{z-index:1;pointer-events:none}
.gq-veil{z-index:2}.gq-motes{z-index:3}.gq-view{z-index:4}.gq-cartons{z-index:4}.gq-opening{z-index:5}
.gq-curtain,.gq-prelude,.gq-launch{z-index:6}.gq-gate{z-index:7}.gq-paused,.gq-quick,.gq-ctrl,.gq-confirm{z-index:8}
.gq-vid,.gq-still{position:absolute;inset:0;width:100%;height:100%;object-fit:var(--vfit,cover);object-position:var(--vpos,50% 62%);opacity:0;transition:opacity var(--xfade,1.4s) ease;pointer-events:none}
.gq-vid.vis,.gq-still.vis{opacity:1}
.gq-still{object-fit:cover;object-position:var(--focus,50% 45%);filter:saturate(.9) brightness(.82)}
.gq-mist{position:absolute;inset:-10%;opacity:0;pointer-events:none;background:radial-gradient(ellipse 60% 45% at 50% 70%,rgba(214,206,190,.32) 0%,rgba(150,150,150,.12) 45%,rgba(0,0,0,0) 72%);transition:opacity calc(var(--xfade,1.4s) * .5) ease}
.gq-mist.on{opacity:1}
.gq-warm{position:absolute;inset:0;opacity:0;pointer-events:none;background:radial-gradient(ellipse 80% 70% at 50% 45%,rgba(255,214,150,.38) 0%,rgba(255,190,120,.14) 50%,rgba(0,0,0,0) 80%);mix-blend-mode:screen;transition:opacity 1.6s ease}
.gq-warm.on{opacity:1}
/* Course active : les illustrations deviennent des souvenirs latéraux, la course reste visible */
#${ROOT_ID}.course-on{background:transparent}
#${ROOT_ID}.course-on .gq-layer{inset:auto;top:7%;right:1%;width:48%;height:78%;opacity:0}
#${ROOT_ID}.course-on .gq-layer.vis{opacity:var(--illus,.96)}
#${ROOT_ID}.course-on .gq-fill{display:none}
#${ROOT_ID}.course-on .gq-layer .gq-img{-webkit-mask-image:radial-gradient(ellipse 78% 72% at 52% 46%,#000 40%,rgba(0,0,0,.82) 62%,transparent 100%);mask-image:radial-gradient(ellipse 78% 72% at 52% 46%,#000 40%,rgba(0,0,0,.82) 62%,transparent 100%);filter:saturate(.96) brightness(.96)}
#${ROOT_ID}.course-on[data-cote="droite"] .gq-layer{right:auto;left:1%}
#${ROOT_ID}.course-on .gq-cover{display:none}
#${ROOT_ID}.course-on .gq-veil{background:
  linear-gradient(90deg,rgba(5,4,8,var(--v-texte,.72)) 0%,rgba(5,4,8,calc(var(--v-texte,.72) * .7)) 28%,rgba(5,4,8,calc(var(--v-texte,.72) * .25)) 46%,rgba(5,4,8,0) 60%),
  linear-gradient(180deg,rgba(5,4,8,var(--v-haut,.4)) 0%,rgba(5,4,8,0) 20%,rgba(5,4,8,0) 82%,rgba(5,4,8,var(--v-bas,.28)) 100%)}
#${ROOT_ID}.course-on.cartons-on .gq-veil{background:linear-gradient(180deg,rgba(5,4,8,var(--v-haut,.4)) 0%,rgba(5,4,8,.12) 30%,rgba(5,4,8,.12) 70%,rgba(5,4,8,var(--v-bas,.28)) 100%)}
/* Portraits des faux crédits : buste détouré entier, ou carte aux bords estompés */
#${ROOT_ID} .gq-layer.kind-sprite,#${ROOT_ID} .gq-layer.kind-carte{inset:auto;top:7%;right:5%;width:40%;height:72%}
#${ROOT_ID} .gq-layer.kind-sprite .gq-fill,#${ROOT_ID} .gq-layer.kind-carte .gq-fill{display:none}
#${ROOT_ID} .gq-layer.kind-sprite .gq-img,#${ROOT_ID} .gq-layer.kind-carte .gq-img{top:0;height:100%}
#${ROOT_ID} .gq-layer.kind-sprite .gq-img{object-fit:contain;object-position:50% 100%;filter:drop-shadow(0 10px 26px rgba(0,0,0,.6)) brightness(.95);-webkit-mask-image:linear-gradient(180deg,#000 72%,transparent 100%);mask-image:linear-gradient(180deg,#000 72%,transparent 100%)}
#${ROOT_ID} .gq-layer.kind-carte .gq-img{-webkit-mask-image:radial-gradient(ellipse 50% 50% at 50% 50%,#000 55%,transparent 100%);mask-image:radial-gradient(ellipse 50% 50% at 50% 50%,#000 55%,transparent 100%)}
#${ROOT_ID} .gq-layer.kind-sprite.vis .gq-img,#${ROOT_ID} .gq-layer.kind-carte.vis .gq-img{animation:none}
#${ROOT_ID}.course-on .gq-layer.kind-sprite,#${ROOT_ID}.course-on .gq-layer.kind-carte{top:6%;right:2%;width:44%;height:80%}
/* Acte I : cartons individuels, côtés alternés */
.gq-cartons{position:absolute;inset:0;pointer-events:none}
.gq-carton{position:absolute;top:24%;max-width:min(42%,30rem);padding:0 2vw;opacity:0;transform:translateY(6px);transition:opacity var(--c-out,.7s) ease,transform var(--c-out,.7s) ease;text-shadow:0 1px 3px rgba(0,0,0,.9),0 0 22px rgba(0,0,0,.65)}
.gq-carton.on{opacity:1;transform:none;transition:opacity var(--c-in,.8s) ease,transform var(--c-in,.8s) ease}
.gq-carton.gauche{left:max(6%,env(safe-area-inset-left));text-align:left}
.gq-carton.droite{right:max(6%,env(safe-area-inset-right));text-align:right}
.gq-carton.centre{left:50%;top:50%;transform:translate(-50%,-46%);max-width:min(88%,40rem);text-align:center}
.gq-carton.centre.on{transform:translate(-50%,-50%)}
.gq-carton .gq-c-role{display:block;font:600 clamp(12px,1.9vmin,17px)/1.3 "Cinzel",Georgia,serif;letter-spacing:.28em;text-transform:uppercase;color:rgba(233,201,133,.86)}
.gq-carton .gq-c-name{display:block;margin-top:.35em;font:600 clamp(30px,6vmin,62px)/1.05 "Cormorant Garamond",Georgia,serif;color:#fff4d6;letter-spacing:.01em}
.gq-carton .gq-c-titre{display:block;font:700 clamp(28px,5.6vmin,64px)/1.08 "Cinzel Decorative","Cinzel",Georgia,serif;color:#f3dca2}
.gq-carton .gq-c-un{display:block;font:600 clamp(14px,2.4vmin,22px)/1 "Cinzel",Georgia,serif;letter-spacing:.5em;text-indent:.5em;text-transform:uppercase;color:rgba(233,201,133,.86)}
.gq-carton .gq-c-big{display:block;margin-top:.3em;font:900 clamp(30px,7vmin,78px)/1.04 "Cinzel Decorative","Cinzel",Georgia,serif;letter-spacing:.04em;text-transform:uppercase;color:#f6e0a4}
#${ROOT_ID}.portrait .gq-carton{top:16%;max-width:80%}
#${ROOT_ID}.portrait .gq-carton.centre{top:42%}
/* Portrait · Au-delà des cendres, avec la course */
#${ROOT_ID}.portrait.course-on .gq-layer{top:3%;left:6%;right:6%;width:auto;height:40%}
#${ROOT_ID}.portrait.course-on .gq-layer.kind-sprite,#${ROOT_ID}.portrait.course-on .gq-layer.kind-carte{top:2%;left:16%;right:16%;width:auto;height:42%}
#${ROOT_ID}.portrait.course-on .gq-layer .gq-img{top:0;height:100%}
#${ROOT_ID}.portrait.course-on .gq-view{top:38%;bottom:12%}
#${ROOT_ID}.portrait.course-on .gq-veil{background:radial-gradient(ellipse 110% 60% at 50% 46%,rgba(5,4,8,var(--v-centre,.5)) 0%,rgba(5,4,8,calc(var(--v-centre,.5) * .55)) 60%,rgba(5,4,8,.15) 100%),linear-gradient(180deg,rgba(5,4,8,var(--v-haut,.42)) 0%,rgba(5,4,8,0) 18%,rgba(5,4,8,0) 80%,rgba(5,4,8,var(--v-bas,.3)) 100%)}
#${ROOT_ID}.portrait.course-on.cartons-on .gq-veil{background:linear-gradient(180deg,rgba(5,4,8,var(--v-haut,.42)) 0%,rgba(5,4,8,.2) 35%,rgba(5,4,8,.08) 75%,rgba(5,4,8,var(--v-bas,.3)) 100%)}
#${ROOT_ID}.portrait .gq-layer.kind-sprite,#${ROOT_ID}.portrait .gq-layer.kind-carte{top:4%;left:20%;right:20%;width:auto;height:40%}
/* Finale · Le dernier sourire : seules restent la course et la lumière */
#${ROOT_ID}.finale .gq-bg,#${ROOT_ID}.finale .gq-veil,#${ROOT_ID}.finale .gq-view,#${ROOT_ID}.finale .gq-motes,#${ROOT_ID}.finale .gq-cartons{opacity:0;transition:opacity 2s ease}
#${ROOT_ID}.finale .gq-quick{opacity:0}
#${ROOT_ID}.finale.ctrl .gq-quick{opacity:.92}
#${ROOT_ID}.gate .gq-course{opacity:0;transition:opacity 1.6s ease}
#${ROOT_ID}.prelude .gq-course{opacity:0}
.gq-course{transition:opacity 2.4s ease}
#${ROOT_ID}.cartons-on:not(.course-on) .gq-veil{background:radial-gradient(ellipse 80% 70% at 50% 45%,rgba(5,4,8,.55) 0%,rgba(5,4,8,.72) 70%,rgba(5,4,8,.88) 100%)}
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
    const kind = (typeof list[0] === 'object' && list[0].kind) || '';
    return ` data-bg="${esc(srcs.join('|'))}" data-focus="${esc(focus)}"${kind ? ` data-kind="${esc(kind)}"` : ''}`;
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
  // Une rubrique par chapitre vécu : couverture du volume, souvenirs illustrés, puis décisions et souvenirs du chapitre.
  const CHOICES_PER_BLOCK = 5;
  function chapterBlocks(chap) {
    const out = [];
    const items = Array.isArray(chap.items) ? chap.items : [];
    const firstBg = (items.find((x) => x.kind === 'souvenir' && x.backgrounds && x.backgrounds.length) || {}).backgrounds;
    const chapBg = firstBg ? firstBg[0] : (chap.image ? { src: chap.image, focus: '50% 32%' } : undefined);
    const cid = 'chap-' + esc(chap.key);
    // Chapitre sans souvenir (seulement son ou ses choix marquants) : en-tête court, sans vignette ; le volume reste en fond.
    const court = !items.some((x) => x.kind !== 'choix');
    out.push(`<section class="gq-block gq-chap${court ? ' gq-chap-court' : ''}" data-id="${cid}" data-chapter="${esc(chap.key)}"${bgAttr(chapBg)} style="--gap:${court ? 8 : 11}vh">${chap.image && !court ? `<span class="gq-cover"><img src="${esc(chap.image)}" alt="" loading="lazy" decoding="async"></span>` : ''}<span class="gq-chap-label">${esc(String(chap.label || '').replace(/_(G|I)\b/g, ''))}</span><h3 class="gq-chap-title">${esc(chap.title)}</h3>${ORN('gq-sep small')}</section>`);
    let pending = [];
    let n = 0;
    let lastCtx = '';
    const flush = () => {
      if (!pending.length) return;
      n += 1;
      out.push(`<section class="gq-block gq-choices" data-id="${cid}-c${n}" data-rubrique-count="${pending.length}" style="--gap:${n === 1 ? 4 : 2.5}vh"><ul>${pending.join('')}</ul></section>`);
      pending = [];
    };
    for (const it of items) {
      if (it.kind === 'souvenir') {
        flush(); lastCtx = '';
        out.push(`<section class="gq-block gq-mem" data-id="mem-${esc(it.id)}"${bgAttr(it.backgrounds)} data-memory="${esc(it.id)}" data-rubrique="souvenir" style="--gap:8vh"><span class="gq-kicker">${esc(it.categoryLabel || '')}</span><h3>${esc(it.title)}</h3><p>${esc(it.text)}</p><i class="gq-dot" aria-hidden="true"></i></section>`);
      } else if (it.kind === 'choix') {
        const ctxHtml = it.context && it.context !== lastCtx ? `<span class="gq-ctx">${esc(it.context)}</span>` : '';
        lastCtx = it.context || lastCtx;
        pending.push(`<li class="gq-rub gq-choice${ctxHtml ? '' : ' tight'}" data-rubrique="choix" data-scene="${esc(it.scene)}">${ctxHtml}<span class="gq-said">${/[«“"]/.test(it.label) ? esc(it.label) : `« ${esc(it.label)} »`}</span></li>`);
      } else if (it.kind === 'memoire') {
        pending.push(`<li class="gq-rub gq-souv" data-rubrique="memoire"><span class="gq-ctx">✧ ${esc(it.title)}</span><span class="gq-body">${esc(it.text)}</span></li>`);
      }
      if (pending.length >= CHOICES_PER_BLOCK) flush();
    }
    flush();
    return out;
  }
  function buildStrip(chronicle, mode) {
    const parts = [];
    const actHead = (a) => `<section class="gq-block gq-act" data-id="${a.id}" data-act="${a.id}"${bgAttr(a.bg)} style="--gap:26vh"><span class="gq-num">${a.numeral}</span><h2>${esc(a.title)}</h2>${ORN('gq-sep')}</section>`;
    for (const act of D.acts) {
      if (mode === 'chronique' && !act.personal) continue;
      parts.push(actHead(act));
      if (act.personal) {
        parts.push(`<section class="gq-block gq-intro" data-id="chronique-intro" style="--gap:12vh">${act.intro.map((l) => `<p>${esc(l)}</p>`).join('')}</section>`);
        const chapters = (chronicle && Array.isArray(chronicle.chapters)) ? chronicle.chapters : [];
        if (!chapters.length) parts.push(`<section class="gq-block gq-mem" data-id="chronique-vide" style="--gap:12vh"><p>${esc(act.empty)}</p></section>`);
        for (const chap of chapters) parts.push(...chapterBlocks(chap));
        parts.push(`<section class="gq-block gq-conclusion" data-id="chronique-fin"${bgAttr(act.outro.bg)} style="--gap:20vh"><p>${esc(act.outro.text)}</p>${ORN('gq-sep')}</section>`);
        continue;
      }
      for (const b of act.blocks) {
        parts.push(`<section class="gq-block${b.final ? ' gq-final' : ''}" data-id="${b.id}"${bgAttr(b.bg)}${b.final ? ' data-final="1"' : ''} style="--gap:${b.gap || (b.final ? 24 : 15)}vh">${b.items.map(item).join('')}</section>`);
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
    if (D.track === 'music_menu' && st.menuMusicOn === false) return false;
    return true;
  }
  function wantMenuMusic() {
    const st = game(); return Boolean(st && st.musicOn !== false && st.menuMusicOn !== false);
  }
  const scoreCfg = () => Object.assign({ fadeIn: 2.6, fadeOut: 2.4, menuFadeIn: 1.8, loopCrossfade: 4, loopTail: 5.5, loopOffset: 0.5 }, D.music || {});
  function trackSrc() {
    const key = D.track;
    try { if (typeof getAudioCandidates === 'function') { const c = getAudioCandidates(key); if (c && c[0]) return c[0]; } } catch (_e) { /* ignore */ }
    try { if (typeof A !== 'undefined' && A[key]) return A[key]; } catch (_e) { /* ignore */ }
    return (D.music && D.music.src) || '';
  }
  const stopFade = () => { if (P && P.fadeT) { clearInterval(P.fadeT); P.fadeT = 0; } };
  const stopMenuFade = () => { if (P && P.menuFadeT) { clearInterval(P.menuFadeT); P.menuFadeT = 0; } };
  const stopLoopFade = () => { if (P && P.score && P.score.xfadeT) { clearInterval(P.score.xfadeT); P.score.xfadeT = 0; } };
  function applyGain() {
    const p = P; if (!p) return;
    if (p.score && p.score.started && !p.score.stopped) scoreVolume();
    const m = musicEl(); if (!m) return;
    if (p.restoringMenu) { try { m.volume = sliderVolume() * (p.menuGain || 0); } catch (_e) { /* volume bloqué */ } }
    else if (!p.musicStarted || p.phase === 'prelude') { try { m.volume = sliderVolume() * p.gain; } catch (_e) { /* volume bloqué */ } }
  }
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

  const baseSpeed = (p) => Math.max(24, Math.min(58, p.viewH * 0.06)) * (p.devSpeed || 1) * (p.userSpeed || 1);
  function orientation() {
    const r = window.innerHeight / Math.max(1, window.innerWidth);
    const prev = (P && P.orient) || (r > 1.02 ? 'portrait' : 'landscape');
    if (prev === 'portrait') return r < 0.92 ? 'landscape' : 'portrait';
    return r > 1.12 ? 'portrait' : 'landscape';
  }
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
      <div class="gq-score" aria-hidden="true"><audio preload="auto"></audio><audio preload="auto"></audio></div>
      <div class="gq-course" aria-hidden="true"><video class="gq-vid" muted playsinline preload="none" disablepictureinpicture></video><video class="gq-vid" muted playsinline preload="none" disablepictureinpicture></video><img class="gq-still" alt=""><div class="gq-mist"></div><div class="gq-warm"></div></div>
      <div class="gq-bg"><div class="gq-layer"><div class="gq-fill"></div><img class="gq-img" alt="" decoding="async"></div><div class="gq-layer"><div class="gq-fill"></div><img class="gq-img" alt="" decoding="async"></div></div>
      <div class="gq-veil"></div>
      <canvas class="gq-motes" aria-hidden="true"></canvas>
      <div class="gq-view" aria-live="off"><div class="gq-strip">${buildStrip(chronicle, mode)}</div></div>
      ${mode === 'generique' && D.cartons ? cartonsHtml() : ''}
      <div class="gq-opening">${ORN('gq-orn top')}<p class="gq-o1">${esc(op.line1)}</p><h1 class="gq-o2">${esc(op.title)}</h1><p class="gq-o3">${esc(mode === 'chronique' ? 'Ma Chronique' : op.tome)}</p>${ORN('gq-orn')}</div>
      <div class="gq-curtain" aria-hidden="true"></div>
      <div class="gq-prelude" aria-live="polite">${(D.prelude && mode === 'generique' ? D.prelude.lines : []).map((l) => `<p>${esc(l)}</p>`).join('')}</div>
      <div class="gq-launch" aria-hidden="true"></div>
      <div class="gq-gate" aria-hidden="true"></div>
      <div class="gq-paused">Pause</div>
      <div class="gq-quick"><button type="button" data-gq="fast" aria-pressed="false" title="Accélérer le défilement">» ×1</button><button type="button" data-gq="skip">${mode === 'chronique' ? 'Fermer' : 'Passer'}</button></div>
      <div class="gq-confirm" hidden><span>${mode === 'chronique' ? 'Refermer votre chronique ?' : 'Passer le générique ?'}</span><button type="button" data-gq="skip-yes">Passer</button><button type="button" data-gq="skip-no">Continuer</button></div>
      <div class="gq-ctrl">
        <button type="button" data-gq="pause">Pause</button>
        ${document.fullscreenEnabled ? '<button type="button" data-gq="fs">Plein écran</button>' : ''}
      </div>`;
    document.body.append(root);
    if (game() && game().devMode) {
      const ctrl = root.querySelector('.gq-ctrl');
      ctrl.insertAdjacentHTML('afterbegin', `<button type="button" class="dev" data-gq="speed">×1</button>${D.acts.filter((a) => mode !== 'chronique' || a.personal).map((a) => `<button type="button" class="dev" data-gq="act" data-act="${a.id}">${a.numeral}</button>`).join('')}`);
    }
    return root;
  }

  function cartonsHtml() {
    const c = D.cartons; const n = esc(c.name);
    return `<div class="gq-cartons" aria-live="polite"><div class="gq-carton centre" data-k="titre"><span class="gq-c-titre">${esc(c.title)}</span>${ORN('gq-sep')}</div>${c.items.map((it, i) => `<div class="gq-carton ${it.side === 'droite' ? 'droite' : 'gauche'}" data-k="${i}"><span class="gq-c-role">${esc(it.role)}</span><span class="gq-c-name">${n}</span></div>`).join('')}<div class="gq-carton centre" data-k="final"><span class="gq-c-un">${esc(c.final.lines[0])}</span><span class="gq-c-big">${esc(c.final.lines[1])}</span></div></div>`;
  }

  function layout() {
    const p = P; if (!p) return;
    p.root.classList.toggle('portrait', p.orient === 'portrait');
    p.root.classList.toggle('lite', lite());
    p.viewH = p.view.clientHeight || window.innerHeight;
    p.speed = baseSpeed(p);
    p.blocks = [...p.strip.querySelectorAll('.gq-block')].map((el) => ({ el, id: el.dataset.id, top: el.offsetTop, h: el.offsetHeight, bg: el.dataset.bg, focus: el.dataset.focus, kind: el.dataset.kind || '', final: el.dataset.final === '1' }));
    const fin = p.blocks.find((b) => b.final) || p.blocks[p.blocks.length - 1];
    p.stopAt = fin ? fin.top + fin.h / 2 + p.viewH / 2 : p.viewH;
    p.reading = p.viewH * 0.56;
    courseLayout();
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
  function showBg(src, focus, kind = '') {
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
      next.classList.toggle('kind-sprite', kind === 'sprite'); next.classList.toggle('kind-carte', kind === 'carte');
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
    showBg(src, target.focus, target.kind);
    // précharge le petit groupe suivant
    for (const b of p.blocks.slice(idx + 1, idx + 4)) if (b.bg) b.bg.split('|').slice(0, 1).forEach(preload);
  }

  /* ---- Couche 01 : la course de Hylee (deux lecteurs au plus, jamais relancés, muets) ---- */
  const K = D.course || null;
  const courseEnabled = () => Boolean(K && K.clips) && !reducedMotion() && !(navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2);
  function courseInit(p) {
    const vids = [...p.root.querySelectorAll('.gq-vid')];
    p.course = { vids, active: -1, clip: '', idx: -1, pending: '', since: -99, missing: new Set(), cues: [], on: false, enabled: courseEnabled() };
    vids.forEach((v) => {
      v.muted = true; v.defaultMuted = true; v.volume = 0; v.playsInline = true; v.setAttribute('muted', '');
      v.addEventListener('ended', () => {
        const q = P; const c = q && q.course; if (!c || c.vids[c.active] !== v) return;
        const clip = K && K.clips[c.clip]; if (clip && clip.loop === false) return;
        if (c.seaming || c.pending) return;
        try { v.currentTime = 0; playVid(v); } catch (_e) { /* ignore */ }
      });
    });
    const root = p.root.style; const tm = (K && K.timing) || {};
    root.setProperty('--xfade', (tm.crossfade || 1.4) + 's');
    if (p.course.enabled) courseGo(p.mode === 'chronique' ? (K.order[1] || K.order[0]) : K.order[0]);
  }
  function courseLayout() {
    const p = P; if (!p || !p.course || !K) return;
    const o = p.orient === 'portrait' ? 'portrait' : 'paysage';
    const clipCad = (K.clips[p.course.clip] && K.clips[p.course.clip].cadrage && K.clips[p.course.clip].cadrage[o]) || {};
    const cad = { ...(K.cadrage && K.cadrage[o]), ...clipCad };
    const st = p.root.style;
    if (cad.position) st.setProperty('--vpos', cad.position);
    if (cad.fit) st.setProperty('--vfit', cad.fit);
    const v = (K.voiles && K.voiles[o]) || {};
    for (const [k, val] of Object.entries(v)) st.setProperty('--v-' + k, String(val));
    if (K.voiles && K.voiles.illustrations != null) st.setProperty('--illus', String(K.voiles.illustrations));
    // positions des ancres dans la bande
    const top = (id) => { const b = p.blocks.find((x) => x.id === id); return b ? b.top : null; };
    const c0 = top('chronique-intro'), c1 = top('chronique-fin');
    p.course.cues = (K.cues || []).map((cue) => {
      let pos = null;
      if (cue.block) pos = top(cue.block);
      else if (cue.chronique != null && c0 != null && c1 != null) pos = c0 + (c1 - c0) * cue.chronique;
      return pos == null ? null : { idx: K.order.indexOf(cue.clip), pos };
    }).filter((x) => x && x.idx >= 0);
  }
  function loadInto(v, id) {
    return new Promise((res) => {
      const clip = K.clips[id]; if (!clip || !clip.src) { res(false); return; }
      let done = false;
      const end = (ok) => { if (done) return; done = true; clearTimeout(to); v.removeEventListener('loadeddata', onOk); v.removeEventListener('error', onErr); res(ok); };
      const onOk = () => end(true), onErr = () => end(false);
      const to = setTimeout(() => end(v.readyState >= 2), ((K.timing && K.timing.loadTimeout) || 8) * 1000);
      v.addEventListener('loadeddata', onOk); v.addEventListener('error', onErr);
      v.loop = false; v.muted = true; v.preload = 'auto';
      v.dataset.clip = id; v.src = clip.src;
      try { v.load(); } catch (_e) { end(false); }
    });
  }
  function playVid(v) { const p = P; if (!p || !v || p.paused || document.hidden) return; try { const pr = v.play(); if (pr) pr.catch(() => {}); } catch (_e) { /* autoplay refusé : repli par illustrations */ } }
  function courseGo(id, opts = {}) {
    const p = P; const c = p && p.course; if (!c || !c.enabled) return Promise.resolve(false);
    if (c.missing.has(id) || c.clip === id || c.pending === id) return Promise.resolve(c.clip === id);
    const slot = c.active < 0 ? 0 : c.active ^ 1;
    const v = c.vids[slot], old = c.active >= 0 ? c.vids[c.active] : null;
    c.pending = id;
    const ready = (v.dataset.clip === id && v.readyState >= 2) ? Promise.resolve(true) : loadInto(v, id);
    return ready.then((ok) => {
      if (!P || P.course !== c || c.pending !== id) return false;
      c.pending = '';
      if (!ok) { c.missing.add(id); try { v.removeAttribute('src'); v.load(); } catch (_e) { /* ignore */ } console.warn('[Sylvinia] Générique : vidéo absente ou illisible', id, K.clips[id] && K.clips[id].src); return false; }
      try { v.currentTime = 0; } catch (_e) { /* ignore */ }
      v.loop = false;
      if (opts.fade) v.style.setProperty('--xfade', opts.fade + 's'); else v.style.removeProperty('--xfade');
      playVid(v);
      const mist = p.root.querySelector('.gq-mist');
      if (old && mist) { mist.classList.add('on'); setTimeout(() => mist.classList.remove('on'), ((K.timing && K.timing.crossfade) || 1.4) * 700); }
      v.classList.add('vis');
      if (old) {
        old.classList.remove('vis');
        setTimeout(() => { if (old.classList.contains('vis')) return; try { old.pause(); old.removeAttribute('src'); old.load(); delete old.dataset.clip; } catch (_e) { /* ignore */ } }, ((opts.fade || (K.timing && K.timing.crossfade) || 1.4) + 0.4) * 1000);
      }
      c.active = slot; c.clip = id; c.since = p.clock;
      if (K.order.includes(id)) c.idx = K.order.indexOf(id);
      c.on = true; p.root.classList.add('course-on');
      courseLayout();
      return true;
    });
  }
  // Précharge un clip dans le lecteur libre (V06 pendant le dernier carton).
  function coursePreload(id) {
    const p = P; const c = p && p.course; if (!c || !c.enabled || c.pending || c.missing.has(id) || c.clip === id) return;
    const v = c.vids[c.active < 0 ? 0 : c.active ^ 1];
    if (v.dataset.clip !== id) loadInto(v, id).then((ok) => { if (!ok && P && P.course === c) c.missing.add(id); });
  }
  function courseSeamTick() {
    const p = P; const c = p && p.course;
    if (!c || !c.enabled || c.pending || c.seaming || p.phase === 'finale' || p.phase === 'gate' || p.phase === 'prelude') return;
    const v = c.active >= 0 ? c.vids[c.active] : null;
    if (!v || !c.clip || !v.duration || !Number.isFinite(v.duration)) return;
    const clip = K.clips[c.clip];
    if (clip && clip.loop === false) return;
    const fade = (K.timing && K.timing.crossfade) || 1.4;
    if (v.duration - v.currentTime > fade + 0.25) return;
    c.seaming = true;
    const id = c.clip, slot = c.active ^ 1, next = c.vids[slot];
    const start = () => {
      if (!P || P.course !== c || c.clip !== id) { c.seaming = false; return; }
      try { next.currentTime = 0; } catch (_e) { /* ignore */ }
      playVid(next);
      const mist = p.root.querySelector('.gq-mist');
      if (mist) { mist.classList.add('on'); setTimeout(() => mist.classList.remove('on'), fade * 700); }
      next.classList.add('vis'); v.classList.remove('vis');
      setTimeout(() => {
        if (!P || P.course !== c) return;
        try { v.pause(); v.currentTime = 0; } catch (_e) { /* ignore */ }
        if (c.clip === id && c.active === (slot ^ 1)) c.active = slot;
        c.seaming = false;
      }, (fade + 0.2) * 1000);
    };
    const ready = (next.dataset.clip === id && next.readyState >= 2) ? Promise.resolve(true) : loadInto(next, id);
    ready.then((ok) => { if (!ok) { c.seaming = false; try { v.currentTime = 0; playVid(v); } catch (_e) { /* ignore */ } return; } start(); });
  }
  function courseTick() {
    const p = P; const c = p && p.course; if (!c || !c.enabled || c.pending || c.seaming) return;
    let target = p.mode === 'chronique' ? 1 : 0;
    if (p.phase === 'strip' || p.phase === 'hold') for (const cue of c.cues) if (p.viewH - p.offset + cue.pos <= p.reading) target = Math.max(target, cue.idx);
    if (target <= c.idx) return;
    if (c.idx >= 0 && p.clock - c.since < ((K.timing && K.timing.minClip) || 14)) return;
    // une étape à la fois, sans retour en arrière ; un clip absent est sauté
    let next = c.idx + 1;
    while (next <= target && c.missing.has(K.order[next])) next += 1;
    if (next > target) { c.idx = target; return; }
    courseGo(K.order[next]).then((ok) => { if (!ok && P && P.course === c && c.idx < next) c.idx = Math.max(c.idx, next - 1); });
  }
  function courseSetPaused(on) {
    const p = P; const c = p && p.course; if (!c) return;
    const v = c.active >= 0 ? c.vids[c.active] : null; if (!v) return;
    if (on) { try { v.pause(); } catch (_e) { /* ignore */ } } else playVid(v);
  }
  function courseStop(p) {
    const c = p && p.course; if (!c) return;
    c.vids.forEach((v) => { try { v.pause(); v.removeAttribute('src'); v.load(); } catch (_e) { /* ignore */ } });
    c.enabled = false; c.on = false;
  }
  /* ---- Finale · Le dernier sourire : V06 seule, une fois, sans illustrations ni texte ---- */
  function startFinale() {
    const p = P; if (!p) return;
    p.phase = 'finale';
    askSkip(false);
    p.root.classList.add('finale');
    const tm = K.timing || {};
    p.finaleDeadline = p.clock + (tm.finaleMax || 20);
    const warm = p.root.querySelector('.gq-warm');
    if (warm) { warm.classList.add('on'); setTimeout(() => warm.classList.remove('on'), (tm.finaleIn || 2.4) * 1000); }
    const fallback = () => {
      if (!P || P !== p) return;
      const still = p.root.querySelector('.gq-still');
      const r = K.repli;
      if (still && r && r.src) { still.src = r.src; still.style.setProperty('--focus', r.focus || '50% 45%'); still.classList.add('vis'); }
      p.root.querySelectorAll('.gq-vid.vis').forEach((v) => v.classList.remove('vis'));
      p.finaleEnd = p.clock + (tm.fallbackHold || 5);
      p.finaleDegraded = true;
    };
    const c = p.course;
    if (!c || !c.enabled || c.missing.has('V06')) { fallback(); return; }
    courseGo('V06', { fade: tm.finaleIn || 2.4 }).then((ok) => {
      if (!P || P !== p) return;
      if (!ok) { fallback(); return; }
      const v = c.vids[c.active];
      v.addEventListener('ended', () => { if (P === p && p.phase === 'finale') p.finaleEnd = p.clock + (tm.finaleHold || 1.2); }, { once: true });
      p.finaleDeadline = p.clock + Math.max(tm.finaleMax || 20, (Number.isFinite(v.duration) ? v.duration : 0) + 4);
    });
  }

  /* ---- Cendres et poussières ---- */
  function sizeMotes() {
    const p = P; if (!p) return;
    const c = p.canvas, r = Math.min(2, window.devicePixelRatio || 1);
    const w = Math.round(window.innerWidth * r), h = Math.round(window.innerHeight * r);
    const n = lite() ? 14 : (p.orient === 'portrait' ? 46 : 30);
    if (p.moteW === w && p.moteH === h && p.motes && p.motes.length === n) return;
    const keep = (p.motes && p.motes.length === n) ? p.motes : null;
    c.width = w; c.height = h; p.moteW = w; p.moteH = h;
    p.motes = keep || Array.from({ length: n }, (_, i) => ({ x: Math.random(), y: Math.random(), s: 0.6 + Math.random() * 1.8, v: 0.006 + Math.random() * 0.018, w: Math.random() * 6.28, ember: p.orient === 'portrait' ? i % 3 === 0 : i % 7 === 0 }));
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
      const k = p.phase === 'strip' ? 1 : (p.userSpeed || 1);
      p.clock += dt * k;
      if (p.phase === 'prelude') stepPrelude();
      else if (p.phase === 'opening') {
        if (p.clock >= p.openEnd) { if (p.mode === 'generique' && D.cartons && p.root.querySelector('.gq-cartons')) startCartons(); else startStrip(); }
      } else if (p.phase === 'cartons') {
        stepCartons();
      } else if (p.phase === 'strip') {
        p.offset = Math.min(p.stopAt, p.offset + p.speed * dt);
        paintStrip();
        syncBg();
        if (p.offset >= p.stopAt) { p.phase = 'hold'; p.holdEnd = p.clock + T.finalHold; }
      } else if (p.phase === 'hold') {
        syncBg();
        if (!p.finalePreloaded && p.mode === 'generique') { p.finalePreloaded = true; coursePreload('V06'); }
        if (p.clock >= p.holdEnd) { if (p.mode === 'generique' && D.course) startFinale(); else finish('fin'); }
      } else if (p.phase === 'finale') {
        const fade = (scoreCfg().fadeOut || 2.4);
        if (!p.scoreFadingOut && p.finaleEnd && p.clock >= p.finaleEnd - fade) {
          p.scoreFadingOut = true;
          fadeGain(0, Math.max(400, (p.finaleEnd - p.clock + 0.6) * 1000));
        }
        if ((p.finaleEnd && p.clock >= p.finaleEnd) || p.clock >= p.finaleDeadline) finish('fin');
      }
      if (p.phase !== 'prelude' && p.phase !== 'finale' && p.phase !== 'gate') { courseTick(); courseSeamTick(); }
      scoreTick();
    }
    drawMotes(running ? dt : 0);
    p.raf = requestAnimationFrame(frame);
  }
  /* ---- Acte I : cartons individuels (horloge commune, pause comprise) ---- */
  function startCartons() {
    const p = P; if (!p) return;
    p.opening.classList.add('gone');
    p.phase = 'cartons'; p.cartStart = p.clock;
    const c = D.cartons, t = c.timing;
    const box = p.root.querySelector('.gq-cartons');
    box.style.setProperty('--c-in', t.fadeIn + 's'); box.style.setProperty('--c-out', t.fadeOut + 's');
    const els = [...box.querySelectorAll('.gq-carton')];
    let at = T.openingOut * 0.6; const sched = [];
    const add = (el, hold, item) => { sched.push({ el, start: at, out: at + t.fadeIn + hold, end: at + t.fadeIn + hold + t.fadeOut, item }); at += t.fadeIn + hold + t.fadeOut + t.gap; };
    add(els[0], t.titleHold, null);
    c.items.forEach((it, i) => add(els[i + 1], t.hold, it));
    add(els[els.length - 1], t.finalHold, null);
    p.cartons = { sched, total: at + t.breath };
    p.root.classList.add('cartons-on');
  }
  function stepCartons() {
    const p = P; if (!p || !p.cartons) return;
    const t = p.clock - p.cartStart;
    for (const s of p.cartons.sched) {
      const on = t >= s.start && t < s.out;
      if (on && !s.el.classList.contains('on')) {
        s.el.classList.add('on');
        if (s.item) {
          p.root.dataset.cote = s.item.side === 'droite' ? 'droite' : 'gauche';
          // sur la course, le carton reste seul face à Hylee ; sans vidéo, l’illustration du carton sert de fond
          if (p.course && p.course.on) showBg('', ''); else if (s.item.bg) showBg(s.item.bg.src, s.item.bg.focus);
        }
        else if (s.el.dataset.k === 'final') showBg('', '');
      } else if (!on && s.el.classList.contains('on')) s.el.classList.remove('on');
    }
    if (t >= p.cartons.total) startStrip();
  }
  function startStrip() {
    const p = P; if (!p) return;
    p.opening.classList.add('gone');
    p.root.classList.remove('cartons-on'); delete p.root.dataset.cote;
    p.root.querySelectorAll('.gq-carton.on').forEach((el) => el.classList.remove('on'));
    p.phase = 'strip'; p.started = true; p.offset = 0;
    layout(); paintStrip();
  }

  /* ---- Transition depuis l’épilogue ---- */
  function stepPrelude() {
    const p = P; if (!p) return;
    const pr = D.prelude; const t = p.clock - p.preStart;
    const C = pr.curtain, l1 = C + 0.3, l2 = l1 + 1.9, outAt = l2 + pr.lineHold + 1.2, launchAt = outAt + 0.9, openAt = launchAt + pr.launch * 0.6;
    if (!p.covered && t >= C) cover();
    const lines = p.root.querySelectorAll('.gq-prelude p');
    if (t >= l1 && lines[0]) lines[0].classList.add('in');
    if (t >= l2 && lines[1]) lines[1].classList.add('in');
    if (t >= outAt) lines.forEach((l) => l.classList.add('out'));
    if (t >= launchAt && !p.launched) { p.launched = true; const el = p.root.querySelector('.gq-launch'); el.style.setProperty('--launch', (pr.launch / (p.userSpeed || 1)) + 's'); el.classList.add('go'); }
    if (t >= openAt) beginOpening();
  }
  // Le voile couvre l’écran : le moteur peut rejoindre le menu (sauvegarde comprise) dessous.
  function cover() {
    const p = P; if (!p || p.covered) return;
    p.covered = true;
    try { if (p.opts.onCovered) p.opts.onCovered(); } catch (err) { console.error('[Sylvinia] Retour au menu', err); }
  }
  function beginOpening() {
    const p = P; if (!p || p.phase !== 'prelude') return;
    cover();
    p.phase = 'opening';
    p.root.classList.remove('prelude'); p.root.classList.add('played');
    p.openEnd = p.clock + T.openingIn + T.openingHold;
    p.opening.classList.add('in');
    startMusic();
  }
  function setFast(on) {
    const p = P; if (!p) return;
    p.userSpeed = on ? 3 : 1; p.speed = baseSpeed(p);
    const b = p.root.querySelector('[data-gq="fast"]');
    if (b) { b.textContent = on ? '» ×3' : '» ×1'; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); }
  }

  /* ---- Passerelle : menu principal ou Chronique Alternative ---- */
  function showGate() {
    const p = P; if (!p) return;
    cover();
    askSkip(false);
    if (p.paused) setPaused(false);
    p.phase = 'gate'; p.gateShown = true;
    p.root.classList.remove('prelude'); p.root.classList.add('played');
    const g = D.passerelle;
    const gate = p.root.querySelector('.gq-gate');
    gate.innerHTML = `<img class="gq-gate-poster" src="${esc(g.poster)}" alt=""><video muted loop playsinline preload="auto" poster="${esc(g.poster)}"><source src="${esc(g.video)}" type="video/mp4"></video><div class="gq-gate-veil"></div>
      <div class="gq-gate-card" role="group" aria-label="Suite de l’aventure"><span class="gq-kicker">${esc(g.kicker)}</span><h2>${esc(g.title)}</h2>${g.lines.map((l) => `<p>${esc(l)}</p>`).join('')}
        <div class="gq-gate-actions"><button type="button" data-gq="gate-menu"><b>${esc(g.menu.label)}</b><small>${esc(g.menu.sub)}</small></button><button type="button" class="ca" data-gq="gate-ca"><b>${esc(g.ca.label)}</b><small>${esc(g.ca.sub)}</small></button></div></div>`;
    gate.setAttribute('aria-hidden', 'false');
    const v = gate.querySelector('video');
    if (v) { v.muted = true; v.addEventListener('error', () => v.remove(), true); try { const pl = v.play(); if (pl) pl.catch(() => {}); } catch (_e) { /* l’affiche reste */ } }
    requestAnimationFrame(() => P && P.root.classList.add('gate'));
    setTimeout(() => { if (P === p) courseStop(p); }, 1800);
    restoreMenuMusic();
    setTimeout(() => { const b = P && P.root.querySelector('[data-gq="gate-menu"]'); if (b) b.focus({ preventScroll: true }); }, 700);
  }
  // La CA garde son accès habituel (sélecteur de mode, toujours ouvert) et sa propre sauvegarde ; l’Histoire est sauvegardée avant.
  function goAlternative() {
    const p = P; if (!p || p.closing) return;
    p.closing = true;
    p.root.classList.add('out');
    fadeGain(0, 900);
    if (p.restoringMenu) fadeMenu(0, 900);
    setTimeout(() => {
      scoreStop(true);
      const m = musicEl(); if (m && !m.paused) try { m.pause(); } catch (_e) { /* la CA reprend son propre thème */ }
      teardown(p, 'chronique-alternative');
      try { if (typeof save === 'function') save(); } catch (_e) { /* ignore */ }
      if (typeof openAlternativeChronicleFromModeSelect === 'function') openAlternativeChronicleFromModeSelect();
      else if (window.SylviniaGameModes && window.SylviniaGameModes.openAlternativeChronicle) window.SylviniaGameModes.openAlternativeChronicle();
      else window.location.assign('chronique-alternative/?intro=intro');
    }, 1000);
  }

  /* ---- Contrôles discrets ---- */
  function poke() {
    const p = P; if (!p) return;
    p.root.classList.add('ctrl'); clearTimeout(p.ctrlT);
    p.ctrlT = setTimeout(() => { if (P && P.confirm.hidden) P.root.classList.remove('ctrl'); }, 3200);
    const m = musicEl();
    // autoplay bloqué : la musique démarre au premier geste autorisé
    if (p.restoringMenu) {
      if (m && wantMenuMusic() && !p.paused && m.paused) m.play().then(applyGain).catch(() => {});
    } else if (p.musicStarted && wantMusic() && !p.paused && p.score && !p.score.stopped) {
      const a = p.score.els[p.score.active];
      if (a && a.paused) a.play().then(applyGain).catch(() => {});
    }
  }
  function setPaused(on) {
    const p = P; if (!p) return;
    p.paused = on; p.root.classList.toggle('paused', on);
    courseSetPaused(on);
    const b = p.root.querySelector('[data-gq="pause"]'); if (b) b.textContent = on ? 'Reprendre' : 'Pause';
    const m = musicEl();
    scoreHold(on);
    if (p.restoringMenu) {
      if (on) { p.musicWasPlaying = !!(m && !m.paused); if (p.musicWasPlaying) try { m.pause(); } catch (_e) { /* déjà en pause */ } }
      else if (p.musicWasPlaying && m && wantMenuMusic()) m.play().then(applyGain).catch(() => {});
    }
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
    else if (a === 'speed') { P.devSpeed = P.devSpeed === 6 ? 1 : 6; b.textContent = '×' + P.devSpeed; P.speed = baseSpeed(P); }
    else if (a === 'fast') setFast(P.userSpeed !== 3);
    else if (a === 'gate-menu') finish('menu');
    else if (a === 'gate-ca') goAlternative();
    else if (a === 'act') jumpTo(b.dataset.act);
  }
  function jumpTo(actId) {
    const p = P; if (!p) return;
    if (p.phase === 'opening' || p.phase === 'cartons') { p.clock = Math.max(p.clock, p.openEnd); startStrip(); }
    const blk = p.blocks.find((x) => x.el.dataset.act === actId); if (!blk) return;
    p.phase = 'strip'; p.offset = Math.min(p.stopAt, blk.top + p.viewH - p.reading); p.bgSince = -99; paintStrip(); syncBg();
  }
  function onKey(ev) {
    if (!P) return;
    if (P.phase === 'gate') { if (ev.key === 'Escape' || ev.key === 'Esc') { ev.preventDefault(); finish('menu'); } ev.stopPropagation(); return; }
    if (ev.key === ' ' || ev.key === 'Spacebar') { ev.preventDefault(); ev.stopPropagation(); setPaused(!P.paused); poke(); }
    else if (ev.key === 'Escape' || ev.key === 'Esc') { ev.preventDefault(); ev.stopPropagation(); askSkip(P.confirm.hidden); }
    else { ev.stopPropagation(); }
  }
  function onVisibility() { if (!P) return; P.last = performance.now(); const hold = document.hidden || P.paused; courseSetPaused(hold); if (!P.paused) scoreHold(document.hidden); }
  let resizeT = 0;
  function onResize() {
    clearTimeout(resizeT);
    resizeT = setTimeout(() => {
      if (!P) return;
      const w = window.innerWidth, h = window.innerHeight;
      if (P.lastW != null && Math.abs(w - P.lastW) < 16 && Math.abs(h - P.lastH) < 16 && orientation() === P.orient) return;
      P.lastW = w; P.lastH = h;
      relayout();
    }, 140);
  }

  /* ---- Ouverture / fermeture ---- */
  function open(mode, chronicle, opts = {}) {
    if (P) return false;
    const root = mount(mode, chronicle);
    P = {
      mode, root, chronicle, opts,
      view: root.querySelector('.gq-view'), strip: root.querySelector('.gq-strip'), opening: root.querySelector('.gq-opening'),
      layers: [...root.querySelectorAll('.gq-layer')], canvas: root.querySelector('.gq-motes'), confirm: root.querySelector('.gq-confirm'),
      orient: orientation(), clock: 0, offset: 0, phase: opts.prelude ? 'prelude' : 'opening', preStart: 0, covered: !opts.prelude && !opts.onCovered, paused: false, started: false, gain: 0, bgIdx: 0, bgToken: 0, bgSince: -99, bgSrc: undefined, blockSince: {}, devSpeed: 1, userSpeed: 1,
      prevMusicKey: (musicEl() && musicEl().dataset.currentKey) || '', prevMusicPaused: !musicEl() || musicEl().paused,
    };
    P.openEnd = T.openingIn + T.openingHold + (mode === 'chronique' ? -1.5 : 0);
    courseInit(P);
    scoreInit(P);
    layout();
    // sans vidéo lisible (absente, mouvement réduit) : le titre et les cartons gardent un fond illustré
    if (K && K.repliOuverture) setTimeout(() => { const q = P; if (q && q.root === root && !(q.course && q.course.on) && !q.bgSrc) showBg(K.repliOuverture.src, K.repliOuverture.focus); }, 2500);
    paintStrip();
    root.addEventListener('click', onClick);
    root.addEventListener('pointermove', poke, { passive: true });
    root.addEventListener('pointerdown', (ev) => { ev.stopPropagation(); poke(); }, { passive: true });
    ['dblclick', 'contextmenu', 'wheel', 'touchmove'].forEach((t) => root.addEventListener(t, (ev) => { ev.stopPropagation(); }, { passive: true }));
    document.addEventListener('keydown', onKey, true);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    if (opts.prelude) {
      root.classList.add('prelude', 'on');
      root.style.setProperty('--curtain', D.prelude.curtain + 's');
      requestAnimationFrame(() => requestAnimationFrame(() => P && P.root.querySelector('.gq-curtain').classList.add('down')));
    } else {
      root.classList.add('played');
      requestAnimationFrame(() => { root.classList.add('on'); requestAnimationFrame(() => P && P.opening.classList.add('in')); });
    }
    // premier fond derrière le titre : celui du premier acte, discret
    const firstAct = D.acts.find((a) => mode !== 'chronique' || a.personal);
    if (firstAct && firstAct.bg) showBg(firstAct.bg.src, firstAct.bg.focus);
    P.raf = requestAnimationFrame(frame);
    return true;
  }

  /* ---- Piste du générique : deux lecteurs, boucle en fondu enchaîné, #music laissé au menu ---- */
  function scoreInit(p) {
    const els = [...p.root.querySelectorAll('.gq-score audio')];
    const src = trackSrc();
    p.score = { els, src, active: 0, mix: [0, 0], looping: false, started: false, stopped: false, ready: false, was: [false, false], xfadeT: 0 };
    if (!src) return;
    els.forEach((a) => {
      a.preload = 'auto';
      a.loop = false;
      try { a.src = src; a.load(); } catch (_e) { /* préchargement impossible */ }
      a.addEventListener('canplaythrough', () => { if (P === p && p.score) p.score.ready = true; }, { once: true });
    });
  }
  function scoreVolume() {
    const p = P; if (!p || !p.score) return;
    const vol = sliderVolume() * (p.gain || 0);
    p.score.els.forEach((a, i) => { try { a.volume = Math.max(0, Math.min(1, vol * (p.score.mix[i] || 0))); } catch (_e) { /* volume bloqué */ } });
  }
  function scoreStop(clearSrc) {
    const p = P; if (!p || !p.score) return;
    stopLoopFade();
    p.score.stopped = true;
    p.score.looping = false;
    p.score.els.forEach((a, i) => {
      try { a.pause(); } catch (_e) { /* ignore */ }
      p.score.mix[i] = 0;
      if (clearSrc) { try { a.removeAttribute('src'); a.load(); } catch (_e) { /* ignore */ } }
    });
  }
  function scoreHold(on) {
    const p = P; if (!p || !p.score || !p.score.started || p.score.stopped) return;
    if (on) {
      p.score.was = p.score.els.map((a) => !a.paused);
      p.score.els.forEach((a) => { if (!a.paused) try { a.pause(); } catch (_e) { /* ignore */ } });
    } else if (wantMusic()) {
      p.score.els.forEach((a, i) => { if (p.score.was[i]) a.play().then(scoreVolume).catch(() => {}); });
    }
  }
  function scoreTick() {
    const p = P; if (!p || !p.score || !p.musicStarted || p.paused || p.score.stopped || p.score.looping || p.restoringMenu || p.scoreFadingOut) return;
    if (!wantMusic() || p.phase === 'prelude' || p.phase === 'gate') return;
    const s = p.score;
    const a = s.els[s.active];
    if (!a || a.paused || !a.duration || !Number.isFinite(a.duration)) return;
    const cfg = scoreCfg();
    const tail = cfg.loopTail || 5.5;
    if ((a.duration - a.currentTime) > tail) return;
    const b = s.els[1 - s.active];
    if (!b) return;
    s.looping = true;
    const offset = Math.max(0, cfg.loopOffset || 0);
    try { b.currentTime = offset; } catch (_e) { /* ignore */ }
    s.mix[1 - s.active] = 0;
    scoreVolume();
    b.play().then(() => {
      if (!P || P !== p || p.score.stopped) return;
      const ms = Math.max(400, (cfg.loopCrossfade || 4) * 1000);
      const fromA = s.mix[s.active];
      const idxA = s.active, idxB = 1 - s.active;
      let i = 0, steps = Math.max(1, Math.round(ms / 40));
      stopLoopFade();
      s.xfadeT = setInterval(() => {
        if (!P || P !== p) { stopLoopFade(); return; }
        i += 1;
        const k = Math.min(1, i / steps);
        s.mix[idxA] = fromA * (1 - k);
        s.mix[idxB] = k;
        scoreVolume();
        if (i >= steps) {
          stopLoopFade();
          try { a.pause(); a.currentTime = offset; } catch (_e) { /* ignore */ }
          s.mix[idxA] = 0; s.mix[idxB] = 1;
          s.active = idxB; s.looping = false;
          scoreVolume();
        }
      }, 40);
    }).catch(() => { s.looping = false; });
  }
  function fadeMenu(target, ms, then) {
    const p = P; if (!p) { then && then(); return; }
    stopMenuFade();
    const from = p.menuGain || 0;
    const steps = Math.max(1, Math.round(ms / 40)); let i = 0;
    p.menuFadeT = setInterval(() => {
      if (!P) return;
      i += 1; p.menuGain = from + (target - from) * (i / steps); applyGain();
      if (i >= steps) { stopMenuFade(); then && then(); }
    }, 40);
  }
  function restoreMenuMusic() {
    const p = P; if (!p || p.restoringMenu) return;
    p.restoringMenu = true;
    p.scoreFadingOut = true;
    const cfg = scoreCfg();
    fadeGain(0, Math.max(400, (cfg.fadeOut || 2.4) * 400), () => scoreStop(true));
    const m = musicEl();
    if (!wantMenuMusic()) { if (m && !m.paused) try { m.pause(); } catch (_e) { /* ignore */ } return; }
    p.menuGain = 0; applyGain();
    try { if (typeof playMusic === 'function') playMusic('music_menu'); } catch (_e) { /* ignore */ }
    if (m && m.paused) m.play().catch(() => {});
    fadeMenu(1, (cfg.menuFadeIn || 1.8) * 1000);
  }

  function startMusic() {
    const p = P; if (!p || p.restoringMenu) return;
    p.musicStarted = true;
    const m = musicEl();
    if (m && !m.paused) try { m.pause(); } catch (_e) { /* le thème du menu ou de l’épilogue cède la place */ }
    if (!wantMusic()) { scoreStop(false); return; }
    const s = p.score;
    if (!s || !s.src) { p.gain = 0; applyGain(); return; }
    const a = s.els[s.active] || s.els[0];
    s.active = s.els[0] ? 0 : s.active;
    s.mix = [1, 0]; s.looping = false; s.stopped = false; s.started = true;
    try { a.currentTime = 0; } catch (_e) { /* ignore */ }
    p.gain = 0; applyGain();
    const ms = (scoreCfg().fadeIn || 2.6) * 1000;
    a.play().then(() => fadeGain(1, ms)).catch(() => {});
  }
  function teardown(p, reason) {
    cancelAnimationFrame(p.raf);
    document.removeEventListener('keydown', onKey, true);
    document.removeEventListener('visibilitychange', onVisibility);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('orientationchange', onResize);
    clearTimeout(p.ctrlT); stopFade(); stopMenuFade(); stopLoopFade();
    courseStop(p);
    scoreStop(true);
    const v = p.root.querySelector('.gq-gate video'); if (v) { try { v.pause(); v.removeAttribute('src'); v.load(); } catch (_e) { /* ignore */ } }
    p.root.remove();
    P = null;
    try { window.SylviniaGenerique.lastEnd = reason; } catch (_e) { /* ignore */ }
  }
  function finish(reason) {
    const p = P; if (!p || p.closing) return;
    // Fin (ou passage) du générique : la passerelle propose le menu ou la suite dans la Chronique Alternative.
    if (p.mode === 'generique' && !p.opts.replay && D.passerelle && !p.gateShown && (reason === 'fin' || reason === 'passe')) { showGate(); return; }
    cover();
    p.closing = true;
    p.root.classList.add('out');
    const done = () => {
      teardown(p, reason);
      const m = musicEl();
      if (m) try { m.volume = sliderVolume(); } catch (_e) { /* ignore */ }
      if (p.mode === 'chronique' || p.opts.replay) {
        // retour à l’écran d’origine : on rend la piste qui jouait avant
        if (p.prevMusicKey && p.prevMusicKey !== D.track && typeof playMusic === 'function') { try { playMusic(p.prevMusicKey); } catch (_e) { /* ignore */ } }
        else if (p.prevMusicPaused && m) try { m.pause(); } catch (_e) { /* ignore */ }
      } else {
        // retour au menu principal : le thème du menu est déjà relancé à la passerelle, sans doublon
        try { if (typeof setScreen === 'function') setScreen('title'); } catch (_e) { /* ignore */ }
        try { if (document.body.classList.contains('ui-biblio') && window.BibliothequeAstrale) window.BibliothequeAstrale.route('#/titre'); } catch (_e) { /* ignore */ }
        if (m && wantMenuMusic() && m.paused) { try { if (typeof playMusic === 'function') playMusic('music_menu'); } catch (_e) { /* ignore */ } if (m.paused) m.play().catch(() => {}); }
      }
    };
    const m = musicEl();
    if (p.mode === 'chronique' || p.opts.replay) fadeGain(0, T.outro * 1000 * 0.9);
    setTimeout(done, T.outro * 1000);
  }

  /* ---- Déclencheur réel : fin de l’épilogue ---- */
  function fromEpilogue(prevFn, ctx, args) {
    intercepting = true;
    let chronicle = null;
    try { chronicle = chronicleForCredits(); } catch (err) { console.error('[Sylvinia] Chronique', err); }
    const onCovered = () => {
      try { prevFn.apply(ctx, args); } catch (err) { console.error('[Sylvinia] Retour au menu', err); }
      intercepting = false;
      // le thème du menu attend le titre frontal
      const m = musicEl();
      if (P) { stopFade(); P.gain = 0; applyGain(); }
      if (m && !m.paused) try { m.pause(); } catch (_e) { /* ignore */ }
    };
    let opened = false;
    try { opened = open('generique', chronicle, { prelude: Boolean(D.prelude), onCovered }); } catch (err) { console.error('[Sylvinia] Générique', err); }
    if (!opened) { intercepting = false; return prevFn.apply(ctx, args); }
    // la musique de l’épilogue s’éteint pendant que le voile tombe
    const m = musicEl();
    if (m && !m.paused) { P.gain = 1; fadeGain(0, (D.prelude ? D.prelude.curtain : 1.3) * 1000); }
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
      try { recordChoice(ch); } catch (_e) { /* le journal de parcours ne bloque jamais un choix */ }
      return previousChoose.apply(this, arguments);
    };
  }

  // Une seule piste : pendant la projection, aucune autre musique ne peut s’imposer.
  if (typeof playMusic === 'function') {
    const previousPlayMusic = playMusic;
    playMusic = window.playMusic = function (key) {
      if (P && !P.closing && !P.restoringMenu && key !== D.track) return undefined;
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
      if (game() !== before) { try { localStorage.removeItem(MIRROR_KEY); } catch (_e) { /* ignore */ } clearTrail(); }
      return r;
    };
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn && resetBtn.onclick === previousReset) resetBtn.onclick = resetProgress;
  }
  // « Nouvelle aventure » : le journal de parcours repart de zéro avec la nouvelle partie.
  if (typeof newGame === 'function') {
    const previousNewGame = newGame;
    newGame = window.newGame = function () {
      const before = game();
      const r = previousNewGame.apply(this, arguments);
      const st = game();
      if (st !== before && st && st.scene === 'p01' && !Object.keys(st.flags || {}).length) clearTrail();
      return r;
    };
    const startBtn = document.getElementById('startBtn');
    if (startBtn && startBtn.onclick === previousNewGame) startBtn.onclick = newGame;
  }

  /* ---- Ma Chronique : Progression (interface classique) ---- */
  function openChronicle() {
    if (!unlocked()) return false;
    const cap = currentChronicle() || makeCapture('apercu');
    return open('chronique', cap);
  }
  if (typeof renderProgression === 'function') {
    const previousRender = renderProgression;
    renderProgression = window.renderProgression = function () {
      const r = previousRender.apply(this, arguments);
      try {
        const back = document.getElementById('progressBackBtn');
        let btn = document.getElementById('maChroniqueBtn');
        if (unlocked()) {
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
  if (update) update.textContent = 'Mise à jour · ' + GAME_VERSION + ' · Générique : le thème de la course de Hylee';

  window.SylviniaGenerique = {
    version: GAME_VERSION,
    get active() { return Boolean(P); },
    hasChronicle: () => Boolean(currentChronicle()),
    debloque: () => unlocked(),
    registre: () => registre(),
    revoir: () => replayCredits(),
    chronicle: () => currentChronicle(),
    ouvrirChronique: openChronicle,
    // Outils de développement et de recette (aucun effet sur la sauvegarde).
    jouer: (opts = {}) => open(opts.mode || 'generique', opts.chronicle || currentChronicle(), opts) && (startMusic(), true),
    apercu: () => makeCapture('apercu'),
    parcours: () => readTrail(),
    etat: () => P && { mode: P.mode, phase: P.phase, offset: Math.round(P.offset), stopAt: Math.round(P.stopAt), clock: +P.clock.toFixed(2), orient: P.orient, paused: P.paused, bg: P.bgSrc, anchor: anchorNow(), speed: P.speed, course: P.course && { on: P.course.on, clip: P.course.clip, pending: P.course.pending, manquantes: [...P.course.missing], active: P.course.enabled }, finaleDegradee: Boolean(P.finaleDegraded), musique: P.score && { on: Boolean(P.score.started && !P.score.stopped && wantMusic()), piste: D.track, src: P.score.src, pret: P.score.ready, actif: P.score.active, fondu: P.score.looping, menu: Boolean(P.restoringMenu), temps: P.score.els[P.score.active] ? +P.score.els[P.score.active].currentTime.toFixed(2) : 0, duree: P.score.els[P.score.active] && Number.isFinite(P.score.els[P.score.active].duration) ? +P.score.els[P.score.active].duration.toFixed(2) : 0 } },
    vitesse: (n = 1) => { if (P) { P.devSpeed = n; P.speed = baseSpeed(P); } },
    accelerer: (on = true) => setFast(on),
    passer: () => finish('passe'),
    _aller: (off) => { if (P && P.phase === 'strip') { P.offset = Math.max(0, Math.min(P.stopAt, off)); P.bgSince = -99; paintStrip(); syncBg(); } },
    pause: (on = true) => setPaused(on),
  };
})();
