/* Sylvinia Studio · Chronique Alternative.
   Chargé par chronique-alternative/index.html après studio/data/modifications-ca.js.
   En jeu normal : ne fait rien (le jeu lit les modifications publiées).
   ?studio=preview : remplace les modifications par le brouillon du Studio, dans le bac à sable (sauvegardes réelles intouchées).
   ?studio=extract : répond au Studio avec les listes de contenu réelles (pour dupliquer une réplique, une réponse, un moment). */
(function sylviniaStudioCABoot() {
  "use strict";
  var mode = window.__SYLVINIA_STUDIO_MODE || "";
  if (mode !== "preview" && mode !== "extract") return;
  var origin = window.location.origin;
  function post(msg) { try { if (window.parent && window.parent !== window) window.parent.postMessage(msg, origin); } catch (e) {} }
  var handoff = mode === "preview" && window.__sylviniaStudioReadHandoff ? window.__sylviniaStudioReadHandoff() : null;

  if (mode === "preview" && handoff && handoff.patch && typeof handoff.patch === "object") {
    window.SylviniaStudioCAPublished = {
      format: "sylvinia-studio-ca", version: 1, revision: handoff.patch.revision || 0,
      entries: handoff.patch.entries && typeof handoff.patch.entries === "object" ? handoff.patch.entries : {},
      lists: handoff.patch.lists && typeof handoff.patch.lists === "object" ? handoff.patch.lists : {},
    };
  }

  /* Sérialisation prudente (fonctions signalées, références circulaires coupées). */
  function safe(value, depth, seen) {
    if (value === null || typeof value === "string" || typeof value === "number" || typeof value === "boolean") return value;
    if (typeof value === "function") return { __fn: true };
    if (typeof value !== "object" || depth > 9) return null;
    if (seen.indexOf(value) >= 0) return null;
    seen.push(value);
    var out;
    if (Array.isArray(value)) out = value.map(function (x) { return safe(x, depth + 1, seen); });
    else { out = {}; Object.keys(value).forEach(function (k) { var v = safe(value[k], depth + 1, seen); if (v !== undefined) out[k] = v; }); }
    seen.pop();
    return out;
  }

  if (mode === "extract") {
    window.addEventListener("message", function (ev) {
      if (ev.origin !== origin || !ev.data || ev.data.type !== "sylvinia-studio-ca:get") return;
      var reg = window.SylviniaStudioCARegistry || {};
      var data = {};
      (ev.data.ids || []).forEach(function (id) { if (reg[id]) data[id] = safe(reg[id], 0, []); });
      post({ type: "sylvinia-studio-ca:data", req: ev.data.req, data: data });
    });
    var tries = 0;
    (function ready() {
      if (window.SylviniaStudioCARegistry && Object.keys(window.SylviniaStudioCARegistry).length) { post({ type: "sylvinia-studio-ca:ready", count: Object.keys(window.SylviniaStudioCARegistry).length }); return; }
      if (++tries < 200) setTimeout(ready, 100);
    })();
    return;
  }

  /* ---------- aperçu ---------- */
  function onReady(fn) { if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn); else fn(); }
  onReady(function () {
    var b = document.createElement("div");
    b.id = "sylviniaStudioCABanner";
    b.setAttribute("role", "status");
    b.style.cssText = "position:fixed;left:50%;transform:translateX(-50%);bottom:4px;z-index:2147483000;max-width:min(80vw,560px);padding:3px 12px;border-radius:999px;background:rgba(14,10,24,.82);border:1px solid rgba(233,201,133,.55);color:#f3e2b8;font:600 11px/1.4 Inter,system-ui,sans-serif;pointer-events:none;transition:opacity .8s";
    b.textContent = "Aperçu Studio · Chronique Alternative · état de test isolé";
    document.body.appendChild(b);
    setTimeout(function () { b.style.opacity = ".3"; }, 4000);

    /* Reprendre automatiquement la partie de test */
    if (handoff && typeof handoff.save === "string") {
      var n = 0;
      (function tryContinue() {
        var btn = Array.prototype.find.call(document.querySelectorAll("button"), function (x) { return !x.disabled && /^\s*Continuer/.test(x.textContent || ""); });
        if (btn) { btn.click(); post({ type: "sylvinia-studio-ca:continued" }); return; }
        if (++n < 60) setTimeout(tryContinue, 250);
      })();
    }

    /* Repère doré sur les textes modifiés quand ils apparaissent à l'écran */
    var wanted = [];
    var patch = window.SylviniaStudioCAPublished || {};
    var ent = patch.entries || {};
    Object.keys(ent).forEach(function (id) { var v = ent[id]; if (typeof v === "string") { var t = v.replace(/\{\d+\}/g, "\u0000").split("\u0000").sort(function (a, c) { return c.length - a.length; })[0].trim(); if (t.length >= 10) wanted.push({ id: id, t: t.slice(0, 48) }); } });
    var lists = patch.lists || {};
    Object.keys(lists).forEach(function (id) { (lists[id].insert || []).forEach(function (x) { JSON.stringify(x.item || {}).replace(/"(?:text|title|prompt|label)":"((?:[^"\\]|\\.){10,})"/g, function (m, t) { try { wanted.push({ id: id, t: JSON.parse('"' + t + '"').slice(0, 48) }); } catch (e) {} return m; }); }); });
    if (!wanted.length) return;
    var seen = {};
    var timer = 0;
    function scan() {
      timer = 0;
      var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      var node;
      while ((node = walker.nextNode())) {
        var txt = node.nodeValue;
        if (!txt || txt.length < 10) continue;
        for (var i = 0; i < wanted.length; i++) {
          if (txt.indexOf(wanted[i].t) >= 0) {
            var el = node.parentElement;
            if (el && !el.hasAttribute("data-studio-mark")) { el.setAttribute("data-studio-mark", "1"); el.style.outline = "2px solid rgba(233,201,133,.9)"; el.style.outlineOffset = "3px"; el.style.borderRadius = "6px"; }
            if (!seen[wanted[i].id]) { seen[wanted[i].id] = 1; post({ type: "sylvinia-studio-ca:seen", id: wanted[i].id }); }
          }
        }
      }
    }
    new MutationObserver(function () { if (!timer) timer = setTimeout(scan, 300); }).observe(document.body, { childList: true, subtree: true, characterData: true });
    scan();
  });
  post({ type: "sylvinia-studio-ca:boot" });
})();
