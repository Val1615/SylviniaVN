/* Sylvinia Studio · format des données (partagé par le jeu et par le Studio).
   Un fichier de modifications contient, pour chaque identifiant de réplique (clé de S),
   uniquement les champs modifiés. Les champs absents gardent la valeur d'origine. */
(function sylviniaStudioSchema(root) {
  "use strict";
  if (root.SylviniaStudioSchema) return;

  var FORMAT = "sylvinia-studio";
  var VERSION = 1;

  /* Champs du moteur que le Studio sait modifier. Tout autre champ d'origine est conservé tel quel. */
  var FIELDS = {
    title: "string", sub: "string", speaker: "string", text: "string", direction: "string",
    bg: "string", music: "string", next: "string", keyImage: "string", videoBanner: "string",
    zoom: "boolean", hideChars: "boolean", clearChars: "boolean", bgCycleMs: "number",
    chars: "chars", choices: "choices",
    /* Champs propres au Studio, lus par studio/runtime/runtime.js */
    sfx: "string", studioIf: "condition", studioRemoved: "boolean", studioNew: "boolean", studioNote: "string"
  };
  var CHOICE_FIELDS = {
    label: "string", next: "string", note: "string", effects: "numbers", requires: "numbers",
    requiresFlags: "booleans", requiresAnyFlags: "strings", flags: "any", items: "strings", memories: "strings",
    skipHistory: "boolean"
  };
  /* Destinations spéciales reconnues par go() */
  var SPECIAL_TARGETS = ["menu", "restart_c7", "restart_c5_sage"];

  function isObj(v) { return v !== null && typeof v === "object" && !Array.isArray(v); }

  function checkType(kind, v) {
    switch (kind) {
      case "string": return typeof v === "string";
      case "number": return typeof v === "number" && isFinite(v);
      case "boolean": return typeof v === "boolean";
      case "numbers": return isObj(v) && Object.keys(v).every(function (k) { return typeof v[k] === "number" && isFinite(v[k]); });
      case "booleans": return isObj(v) && Object.keys(v).every(function (k) { return typeof v[k] === "boolean"; });
      case "strings": return Array.isArray(v) && v.every(function (x) { return typeof x === "string"; });
      case "chars": return Array.isArray(v) && v.every(function (c) { return Array.isArray(c) && c.length >= 2 && c.length <= 4 && c.every(function (x) { return typeof x === "string"; }); });
      case "choices": return Array.isArray(v) && v.every(function (c) { return isObj(c) && typeof c.label === "string" && typeof c.next === "string"; });
      case "condition": return isObj(v);
      case "any": return true;
      default: return false;
    }
  }

  /* Validation d'un fichier de modifications.
     knownIds : fonction(id) -> true si la scène existe dans le jeu d'origine.
     Retourne { ok, errors:[...], warnings:[...] } ; les erreurs bloquent la publication, pas le brouillon. */
  function validate(patch, knownIds) {
    var errors = [], warnings = [];
    if (!isObj(patch)) return { ok: false, errors: ["Le fichier ne contient pas un objet de modifications."], warnings: warnings };
    if (patch.format !== FORMAT) errors.push("Format inconnu : « " + patch.format + " » (attendu : « " + FORMAT + " »).");
    if (typeof patch.version !== "number" || patch.version > VERSION) errors.push("Version de format non prise en charge : " + patch.version + ".");
    if (!isObj(patch.nodes)) { errors.push("La liste des scènes (nodes) est absente."); return { ok: false, errors: errors, warnings: warnings }; }
    var exists = function (id) { return (knownIds && knownIds(id)) || Object.prototype.hasOwnProperty.call(patch.nodes, id) || SPECIAL_TARGETS.indexOf(id) >= 0; };
    Object.keys(patch.nodes).forEach(function (id) {
      var n = patch.nodes[id];
      if (!/^[A-Za-z0-9_]+$/.test(id)) errors.push("Identifiant invalide : « " + id + " ».");
      if (!isObj(n)) { errors.push(id + " : contenu invalide."); return; }
      var isNew = !(knownIds && knownIds(id));
      if (isNew && !n.studioNew) warnings.push(id + " : cette réplique n'existe pas dans le jeu d'origine.");
      Object.keys(n).forEach(function (f) {
        if (!FIELDS[f]) { warnings.push(id + " : champ « " + f + " » ignoré par le jeu."); return; }
        if (!checkType(FIELDS[f], n[f])) errors.push(id + " : le champ « " + f + " » a une forme invalide.");
      });
      if (n.studioRemoved) return;
      if (typeof n.next === "string" && n.next && !exists(n.next)) errors.push(id + " : la suite « " + n.next + " » n'existe pas.");
      if (Array.isArray(n.choices)) n.choices.forEach(function (c, i) {
        if (!isObj(c)) return;
        Object.keys(c).forEach(function (f) {
          if (CHOICE_FIELDS[f] && !checkType(CHOICE_FIELDS[f], c[f])) errors.push(id + " · choix " + (i + 1) + " : le champ « " + f + " » a une forme invalide.");
        });
        if (c.next && !exists(c.next)) errors.push(id + " · choix " + (i + 1) + " : la destination « " + c.next + " » n'existe pas.");
        if (!String(c.label || "").trim()) warnings.push(id + " · choix " + (i + 1) + " : libellé vide.");
      });
      if (isNew && typeof n.text !== "string") warnings.push(id + " : nouvelle réplique sans texte.");
    });
    return { ok: errors.length === 0, errors: errors, warnings: warnings };
  }

  /* Condition de visibilité d'une réplique (champ studioIf) :
     { stats:{lucidite:30}, all:{flag:true|false}, any:[flags], none:[flags] }
     Toutes les parties présentes doivent être vraies (ET). « any » = OU, « none » = NON. */
  function conditionMet(cond, st) {
    if (!isObj(cond)) return true;
    var stats = (st && st.stats) || {}, flags = (st && st.flags) || {};
    if (isObj(cond.stats) && !Object.keys(cond.stats).every(function (k) { return (Number(stats[k]) || 0) >= Number(cond.stats[k]); })) return false;
    if (isObj(cond.all) && !Object.keys(cond.all).every(function (k) { return cond.all[k] ? flags[k] === true : flags[k] !== true; })) return false;
    if (Array.isArray(cond.any) && cond.any.length && !cond.any.some(function (k) { return flags[k] === true; })) return false;
    if (Array.isArray(cond.none) && cond.none.some(function (k) { return flags[k] === true; })) return false;
    return true;
  }

  function emptyPatch() { return { format: FORMAT, version: VERSION, revision: 0, updatedAt: null, nodes: {}, chapters: {} }; }

  root.SylviniaStudioSchema = {
    FORMAT: FORMAT, VERSION: VERSION, FIELDS: FIELDS, CHOICE_FIELDS: CHOICE_FIELDS, SPECIAL_TARGETS: SPECIAL_TARGETS,
    validate: validate, conditionMet: conditionMet, emptyPatch: emptyPatch, checkType: checkType
  };
})(typeof window !== "undefined" ? window : globalThis);
