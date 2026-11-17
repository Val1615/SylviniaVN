/* Sylvinia Studio · couche de modifications lue par le moteur du Mode Histoire.
   Chargé en dernier dans index.html, après studio/data/modifications.js.
   - Jeu normal : applique les modifications publiées (window.SylviniaStudioPublished) par-dessus S.
   - ?studio=preview : applique le brouillon transmis par le Studio, dans un état de test isolé.
   - ?studio=extract : n'applique rien et expose les scènes d'origine au Studio.
   Retour arrière : vider studio/data/modifications.js (ou retirer ses balises) rend le jeu d'origine. */
(function sylviniaStudioRuntime() {
  "use strict";
  if (window.SylviniaStudioRuntime) return;
  var SCHEMA = window.SylviniaStudioSchema;
  var MODE = window.__SYLVINIA_STUDIO_MODE || "";
  var hasOwn = Object.prototype.hasOwnProperty;

  function scenes() { try { return S; } catch (e) { return null; } }            /* const S du moteur */
  function assets() { try { return A; } catch (e) { return null; } }            /* const A du moteur */
  function gameState() { try { return state; } catch (e) { return null; } }     /* let state du moteur */
  if (!scenes() || !SCHEMA) return;

  var originals = Object.create(null);   /* id -> { champ: { had, value } } */
  var added = Object.create(null);       /* id des répliques créées par le Studio */
  var active = null;                     /* modifications actuellement appliquées */
  var chapterTitles = Object.create(null);

  function rememberAndSet(id, node, field, value) {
    var o = originals[id] || (originals[id] = Object.create(null));
    if (!(field in o)) o[field] = { had: hasOwn.call(node, field), value: node[field] };
    node[field] = value;
  }
  function textField(node) {
    /* Les répliques enrichies par les échos des temps libres gardent leur texte d'origine à part. */
    return node && node.__storyWorldEchoWrappedV2 && hasOwn.call(node, "__storyWorldOriginalTextV2") ? "__storyWorldOriginalTextV2" : "text";
  }
  function copy(v) { return v == null || typeof v !== "object" ? v : JSON.parse(JSON.stringify(v)); }

  function restore() {
    var SS = scenes();
    Object.keys(originals).forEach(function (id) {
      var node = SS[id]; if (!node) return;
      var o = originals[id];
      Object.keys(o).forEach(function (f) { if (o[f].had) node[f] = o[f].value; else delete node[f]; });
    });
    Object.keys(added).forEach(function (id) { delete SS[id]; });
    originals = Object.create(null); added = Object.create(null); chapterTitles = Object.create(null);
    active = null;
  }

  function applyNode(id, fields) {
    var SS = scenes();
    var node = SS[id];
    if (!node) {
      if (!fields.studioNew) return;
      node = SS[id] = { title: "", sub: "", bg: "", music: "", speaker: "Narrateur", text: "", chars: [] };
      added[id] = true;
    }
    Object.keys(fields).forEach(function (f) {
      if (!SCHEMA.FIELDS[f]) return;
      var v = copy(fields[f]);
      if (f === "text") { rememberAndSet(id, node, textField(node), v); return; }
      rememberAndSet(id, node, f, v);
    });
  }

  function apply(patch) {
    restore();
    if (!patch || typeof patch !== "object" || !patch.nodes) return 0;
    var n = 0;
    Object.keys(patch.nodes).forEach(function (id) {
      try { applyNode(id, patch.nodes[id] || {}); n++; } catch (e) { console.warn("[Sylvinia Studio] modification ignorée", id, e); }
    });
    Object.keys(patch.chapters || {}).forEach(function (k) { if (patch.chapters[k] && patch.chapters[k].title) chapterTitles[k] = patch.chapters[k].title; });
    active = patch;
    return n;
  }

  /* Certains correctifs du moteur réécrivent une scène après le chargement :
     juste avant l'affichage, on vérifie que la réplique courante porte bien sa modification. */
  function ensureNode(id) {
    if (!active || !active.nodes || !active.nodes[id]) return;
    var node = scenes()[id]; if (!node) return;
    var fields = active.nodes[id];
    Object.keys(fields).forEach(function (f) {
      if (!SCHEMA.FIELDS[f]) return;
      var key = f === "text" ? textField(node) : f;
      if (JSON.stringify(node[key]) !== JSON.stringify(fields[f])) rememberAndSet(id, node, key, copy(fields[f]));
    });
  }

  /* Condition de visibilité : une réplique masquée passe directement à sa suite. */
  function skipHidden() {
    var st = gameState(); var SS = scenes(); if (!st) return;
    for (var guard = 0; guard < 25; guard++) {
      var node = SS[st.scene];
      if (!node || !node.studioIf || node.choices || !node.next || !SS[node.next]) return;
      if (SCHEMA.conditionMet(node.studioIf, st)) return;
      st.scene = node.next;
      ensureNode(st.scene);
    }
  }

  var lastSfxScene = null;
  function playSfx() {
    var st = gameState(); if (!st) return;
    var node = scenes()[st.scene];
    if (!node || !node.sfx || lastSfxScene === st.scene) { if (!node || !node.sfx) lastSfxScene = st.scene; return; }
    lastSfxScene = st.scene;
    if (st.musicOn === false) return;
    var AA = assets() || {};
    try { var a = new Audio(AA[node.sfx] || node.sfx); a.volume = 0.85; var p = a.play(); if (p && p.catch) p.catch(function () {}); } catch (e) {}
  }

  function wrapEngine() {
    if (window.__sylviniaStudioRenderWrapped || typeof render !== "function") return;
    window.__sylviniaStudioRenderWrapped = true;
    var previousRender = render;
    window.render = render = function sylviniaStudioRender() {
      try { var st = gameState(); if (st && st.scene) { ensureNode(st.scene); skipHidden(); } } catch (e) { console.warn("[Sylvinia Studio]", e); }
      var result = previousRender.apply(this, arguments);
      try { playSfx(); } catch (e) {}
      return result;
    };
    if (typeof getSceneChapterLabel === "function") {
      var previousLabel = getSceneChapterLabel;
      window.getSceneChapterLabel = getSceneChapterLabel = function sylviniaStudioChapterLabel(id) {
        var raw = String(id === undefined ? ((gameState() || {}).scene || "") : id);
        var m = /^(cx\d+)_/.exec(raw);
        if (m && chapterTitles[m[1]]) return chapterTitles[m[1]];
        return previousLabel.apply(this, arguments);
      };
    }
  }

  /* ---------- Extraction pour le Studio (jeu d'origine, sans modification) ---------- */
  function serializeNode(node) {
    var out = {};
    Object.keys(node).forEach(function (f) {
      var v = node[f];
      if (typeof v === "function") { out[f] = { __dynamic: true }; return; }
      if (f === "choices" && Array.isArray(v)) {
        out[f] = v.map(function (c) {
          var r = {};
          Object.keys(c || {}).forEach(function (k) { r[k] = typeof c[k] === "function" ? { __dynamic: true } : c[k]; });
          return r;
        });
        return;
      }
      out[f] = v;
    });
    if (node.__storyWorldEchoWrappedV2 && typeof node.__storyWorldOriginalTextV2 === "string") {
      out.text = node.__storyWorldOriginalTextV2; out.__echo = true;
    }
    return out;
  }
  function snapshot() {
    var SS = scenes(), AA = assets() || {};
    var nodes = {}, order = [], labels = {};
    Object.keys(SS).forEach(function (id) {
      if (added[id]) return;
      var node = SS[id]; if (!node || typeof node !== "object") return;
      order.push(id);
      try { nodes[id] = JSON.parse(JSON.stringify(serializeNode(node))); } catch (e) { nodes[id] = { title: node.title || "", text: "", __unreadable: true }; }
      try { labels[id] = typeof getSceneChapterLabel === "function" ? getSceneChapterLabel(id) : ""; } catch (e) { labels[id] = ""; }
    });
    var statNamesSafe = {}, startStats = {};
    try { statNamesSafe = JSON.parse(JSON.stringify(statNames)); } catch (e) {}
    try { startStats = JSON.parse(JSON.stringify(START_STATS)); } catch (e) {}
    statNamesSafe.lien = "Regard de Remerii";
    /* Destinations « temps libre » interceptées par fusion/story-world.js (go → période libre) */
    var periods = {};
    try {
      var content = window.SylviniaStoryContent;
      Object.keys((content && content.byTarget) || {}).forEach(function (t) {
        var p = content.byTarget[t] || {};
        periods[t] = { id: p.id || "", title: p.title || p.label || p.id || t, nextScene: p.nextScene || "", anchorScene: p.anchorScene || "" };
      });
    } catch (e) {}
    return JSON.stringify({
      takenAt: new Date().toISOString(), order: order, nodes: nodes, labels: labels, periods: periods,
      assets: JSON.parse(JSON.stringify(AA)), statNames: statNamesSafe, startStats: startStats,
      published: window.SylviniaStudioPublished || null
    });
  }

  /* ---------- Aperçu : état de test isolé ---------- */
  var previewReady = false;
  function prepareTestState(sim) {
    var st = gameState(); if (!st) return;
    sim = sim || {};
    var base = {}; try { base = JSON.parse(JSON.stringify(START_STATS)); } catch (e) {}
    st.stats = Object.assign({}, base, sim.stats || {});
    st.flags = Object.assign({}, sim.flags || {});
    st.history = Array.isArray(sim.history) ? sim.history.slice() : [];
    st.memories = Array.isArray(sim.memories) ? sim.memories.slice() : [];
    st.inventory = Array.isArray(sim.items) ? sim.items.slice() : [];
    st.devMode = !!sim.devMode;
    st.lastScreen = "game";
    if (sim.extra && typeof sim.extra === "object") Object.keys(sim.extra).forEach(function (k) { st[k] = copy(sim.extra[k]); });
  }
  function engineScreenIsGame() {
    var g = document.getElementById("game") || document.getElementById("gameScreen");
    return !g || !g.classList.contains("hidden");
  }
  function startAt(id) {
    var SS = scenes(); var st = gameState();
    if (!SS[id] || !st) { banner("Réplique introuvable : " + id); return; }
    try { if (typeof markDisclaimerSeen === "function") markDisclaimerSeen(); } catch (e) {}
    var biblio = document.body.classList.contains("ui-biblio") && window.BibliothequeAstrale;
    if (biblio) {
      st.scene = null;
      window.BibliothequeAstrale.aller("#/jeu/" + id);
    } else {
      st.scene = id;
      try { if (typeof setScreen === "function") setScreen("game"); } catch (e) {}
      render();
    }
  }
  function rerender() {
    var st = gameState(); if (!st || !st.scene) return;
    try { if (engineScreenIsGame()) render(); } catch (e) {}
    try { if (window.BibliothequeAstrale && window.BibliothequeAstrale.majJeu) window.BibliothequeAstrale.majJeu(); } catch (e) {}
  }
  function banner(msg) {
    var b = document.getElementById("sylviniaStudioBanner");
    if (!b) {
      b = document.createElement("div");
      b.id = "sylviniaStudioBanner";
      b.setAttribute("role", "status");
      b.style.cssText = "position:fixed;left:50%;transform:translateX(-50%);bottom:4px;z-index:2147483000;max-width:min(78vw,520px);padding:3px 10px;border-radius:999px;" +
        "background:rgba(10,8,4,.62);border:1px solid rgba(233,201,133,.55);color:#f3e2b5;font:600 11px/1.35 Inter,system-ui,sans-serif;" +
        "pointer-events:auto;backdrop-filter:blur(4px);display:flex;gap:8px;align-items:center";
      document.body.appendChild(b);
    }
    b.innerHTML = "";
    b.style.opacity = "1"; b.style.transition = "opacity .8s";
    clearTimeout(banner._t);
    banner._t = setTimeout(function () { b.style.opacity = ".28"; }, 3500);
    b.onmouseenter = function () { b.style.opacity = "1"; };
    var t = document.createElement("span"); t.textContent = msg; b.appendChild(t);
    if (window.parent === window) {
      var back = document.createElement("a"); back.href = "studio/"; back.textContent = "Revenir au Studio";
      back.style.cssText = "color:#ffd98a;text-decoration:underline;white-space:nowrap";
      b.appendChild(back);
    }
  }
  function bootPreview() {
    var handoff = (window.__sylviniaStudioReadHandoff && window.__sylviniaStudioReadHandoff()) || {};
    apply(handoff.patch || null);
    var tries = 0;
    (function waitEngine() {
      tries++;
      var biblioWanted = document.body.classList.contains("ui-biblio");
      var biblioReady = !biblioWanted || (window.BibliothequeAstrale && window.BibliothequeAstrale.racine);
      if (!biblioReady && tries < 60) { setTimeout(waitEngine, 100); return; }
      setTimeout(function () {
        prepareTestState(handoff.sim);
        previewReady = true;
        banner("Aperçu Studio · état de test isolé");
        if (handoff.scene) startAt(handoff.scene);
        post({ type: "sylvinia-studio:ready", scene: handoff.scene || null });
      }, biblioWanted ? 700 : 50);
    })();
  }
  function post(msg) { try { if (window.parent && window.parent !== window) window.parent.postMessage(msg, window.location.origin); } catch (e) {} }
  window.addEventListener("message", function (ev) {
    if (MODE !== "preview" || ev.origin !== window.location.origin || !ev.data || typeof ev.data !== "object") return;
    var d = ev.data;
    if (d.type === "sylvinia-studio:patch") { apply(d.patch || null); rerender(); }
    else if (d.type === "sylvinia-studio:goto" && d.scene) { if (d.sim) prepareTestState(d.sim); if (d.patch) apply(d.patch); startAt(d.scene); }
  });

  /* Lien discret vers le Studio dans les outils DEV (visibles seulement en mode développeur). */
  function addDevLink() {
    var dock = document.getElementById("devToolsDockV0215");
    if (!dock || document.getElementById("sylviniaStudioDevLink")) return;
    var card = document.createElement("div");
    card.className = "devToolCard"; card.id = "sylviniaStudioDevLink";
    card.innerHTML = '<strong>Sylvinia Studio</strong><small>Éditeur des chapitres du Mode Histoire.</small>';
    var a = document.createElement("a"); a.href = "studio/"; a.textContent = "Ouvrir Sylvinia Studio";
    a.style.cssText = "color:#e9c985;font-weight:800;text-decoration:underline";
    card.appendChild(a); dock.appendChild(card);
  }

  window.SylviniaStudioRuntime = {
    mode: MODE, apply: apply, restore: restore, snapshot: snapshot, startAt: startAt,
    prepareTestState: prepareTestState, active: function () { return active; }, ready: function () { return previewReady; }
  };

  wrapEngine();
  if (MODE === "extract") {
    /* rien à appliquer : le Studio lit les scènes d'origine */
  } else if (MODE === "preview") {
    if (document.readyState === "complete") bootPreview(); else window.addEventListener("load", bootPreview);
  } else {
    var published = window.SylviniaStudioPublished;
    var count = apply(published);
    /* réappliquer après les correctifs tardifs du moteur */
    window.addEventListener("load", function () { apply(published); setTimeout(function () { apply(published); }, 0); });
    if (count) console.info("[Sylvinia Studio] " + count + " réplique(s) modifiée(s) appliquée(s), révision " + (published.revision || 0) + ".");
    setInterval(addDevLink, 2000);
  }
})();
