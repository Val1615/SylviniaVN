/* Sylvinia Studio · bac à sable de l'aperçu.
   Chargé tout en haut de index.html. Ne fait RIEN en jeu normal.
   Avec ?studio=preview ou ?studio=extract, toutes les écritures localStorage du jeu
   restent en mémoire : les vraies sauvegardes du joueur ne sont jamais écrasées. */
(function sylviniaStudioSandbox() {
  "use strict";
  var mode = "";
  try { mode = new URLSearchParams(window.location.search).get("studio") || ""; } catch (e) { mode = ""; }
  if (mode !== "preview" && mode !== "extract") return;
  window.__SYLVINIA_STUDIO_MODE = mode;

  var ls;
  try { ls = window.localStorage; } catch (e) { return; }
  var proto = Storage.prototype;
  var real = { get: proto.getItem, set: proto.setItem, remove: proto.removeItem, clear: proto.clear };
  var mem = new Map();
  var removed = new Set();
  var cleared = false;
  /* Clés de progression du joueur : jamais lues ni écrites par l'aperçu. */
  var PLAYER_KEYS = /^(sylvinia_vn_v\d+|sylvinia_vn_intro_v\d+|sylvinia_biblio_astrale_v\d+|sylvinia_legacy_sheet_state|sylvinia_ch14_directors_cut_v\d+)$/;

  proto.getItem = function getItem(key) {
    if (this !== ls) return real.get.call(this, key);
    key = String(key);
    if (mem.has(key)) return mem.get(key);
    if (cleared || removed.has(key) || PLAYER_KEYS.test(key)) return null;
    return real.get.call(this, key);
  };
  proto.setItem = function setItem(key, value) {
    if (this !== ls) return real.set.call(this, key, value);
    key = String(key);
    removed.delete(key);
    mem.set(key, String(value));
  };
  proto.removeItem = function removeItem(key) {
    if (this !== ls) return real.remove.call(this, key);
    key = String(key);
    mem.delete(key);
    removed.add(key);
  };
  proto.clear = function clear() {
    if (this !== ls) return real.clear.call(this);
    mem.clear();
    cleared = true;
  };

  /* Lecture directe du passage préparé par le Studio (clé propre au Studio, jamais une sauvegarde). */
  window.__sylviniaStudioReadHandoff = function readHandoff() {
    try { return JSON.parse(real.get.call(ls, "sylvinia_studio_preview_v1") || "null"); } catch (e) { return null; }
  };
  window.__sylviniaStudioSandboxKeys = function sandboxKeys() { return Array.from(mem.keys()); };

  /* Extraction : aucune musique. Aperçu : son coupé si le Studio le demande. */
  var handoff = mode === "preview" ? window.__sylviniaStudioReadHandoff() : null;
  var mute = mode === "extract" || !!(handoff && handoff.mute);
  if (mute && window.HTMLMediaElement) {
    var mediaProto = HTMLMediaElement.prototype;
    var realPlay = mediaProto.play;
    mediaProto.play = function play() {
      if (this.tagName === "VIDEO" && mode === "preview") { this.muted = true; return realPlay.call(this); }
      return Promise.resolve();
    };
  }
})();
