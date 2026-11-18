/* Sylvinia Studio · Chroniques Alternatives : catalogue des contenus réels et brouillon de l'auteur.
   Le catalogue (studio/data/ca/) est produit à chaque construction de la Chronique Alternative :
   chaque texte, chaque nombre d'effet ou de seuil et chaque liste de contenu y porte un identifiant stable.
   Le brouillon ne contient que les différences ; le jeu les lit dans studio/data/modifications-ca.js. */
export const FORMAT = "sylvinia-studio-ca";
export const VERSION = 1;

export const C = { index: null, mods: new Map(), published: null, draft: null, undo: [], redo: [], lastKey: "", lastAt: 0, listeners: new Set() };

export const CHARACTERS = [
  ["hylee", "Hylee"], ["naiah", "Naïah"], ["remerii", "Remerii"], ["bellirith", "Bellirith"], ["valurn", "Valurn"],
  ["allenna", "Allenna"], ["lineva", "Lineva"], ["iriana", "Iriana"], ["amanea", "Amanea"],
];
const CHAR_RE = new RegExp(`(^|-)(${CHARACTERS.map((c) => c[0]).join("|")})(-|$)`, "g");

/* Les 18 catégories de la consigne. Un module peut appartenir à plusieurs catégories. */
export const CATEGORIES = [
  ["temps-libres", "Temps libres et moments ambiants", /ambient|free-day|heure-|intrusions|reactions$|living-world/],
  ["confidences", "Confidences et connaissances", /confidences|knowledge|heritages-data/],
  ["fils", "Fils narratifs personnels", /relation-beats|-relation$|hylee-search|^narrative-system$/],
  ["relations", "Relations et progression", /gameplay-rules|life-state|scene-closures|route-contextual|-relation$/],
  ["quetes", "Quêtes principales et secondaires", /^story-data$|campaign-scenes|valurn-quests|alpha-hunt|anchor-operation/],
  ["croisees", "Quêtes croisées", /cross-quest|^cross-quests$|-(kit|minigame|scenes|scenes-b|knowledge)$/],
  ["rdv", "Rendez-vous individuels", /^(hylee|naiah|remerii|bellirith|valurn|allenna|lineva)-(dates|home-date)$|^date-scenes$/],
  ["rdv-groupe", "Rendez-vous collectifs", /group-dates|group-proximity|^(\w+)-(\w+)-dates?$|naiah-date$/],
  ["domestique", "Scènes domestiques et cohabitation", /housing|home-date|-home$|home-intimacy|intimacy-home/],
  ["intimes", "Scènes intimes et variantes", /intimacy|intimate|explicit/],
  ["social", "Rencontres sociales", /social-scenes/],
  ["activites", "Activités quotidiennes", /^life-|jobs/],
  ["monde", "Événements du monde", /living-world|heritages-data|weather/],
  ["lettres", "Correspondances et journal", /heritages-data|living-world|letters?/],
  ["lieux", "Lieux, sous-lieux et disponibilité", /world-data|housing-data|weather/],
  ["speciaux", "Événements spéciaux et mini-jeux", /minigame|never|intimacy-games|alpha-hunt|market/],
  ["calendrier", "Calendrier et chronologie", /calendar|weather/],
  ["objets", "Objets, récompenses et conséquences", /^game-data$|market|life-gifts|jobs/],
];

export function charactersOf(key) {
  const out = []; key.replace(CHAR_RE, (m, a, c) => { if (!out.includes(c)) out.push(c); return m; });
  return out;
}
export function categoriesOf(key) {
  const c = CATEGORIES.filter((x) => x[2].test(key)).map((x) => x[0]);
  return c.length ? c : ["autres"];
}
export const clone = (x) => (x == null ? x : JSON.parse(JSON.stringify(x)));
export const moduleOf = (id) => String(id).split(":")[0];

async function getJSON(url) {
  const r = await fetch(url, { cache: "no-cache" });
  if (!r.ok) throw new Error(`${url} : ${r.status}`);
  return r.json();
}
export async function loadIndex() { C.index = await getJSON("data/ca/index.json"); return C.index; }
export function moduleMeta(key) { return C.index.modules.find((m) => m.key === key) || null; }

export async function loadModule(key) {
  if (C.mods.has(key)) return C.mods.get(key);
  const data = await getJSON(`data/ca/${encodeURIComponent(key)}.json`);
  data.byId = new Map();
  data.items.forEach((it) => { data.byId.set(it.id, it); });
  data.arrays.forEach((a) => { data.byId.set(a.id, a); });
  data.sceneItems = data.scenes.map(() => []);
  data.items.forEach((it) => data.sceneItems[it.sc].push(it));
  data.sceneArrays = data.scenes.map(() => []);
  data.arrays.forEach((a) => data.sceneArrays[a.sc].push(a));
  C.mods.set(key, data);
  return data;
}
export async function loadAll(onProgress) {
  const keys = C.index.modules.map((m) => m.key);
  let n = 0;
  for (const k of keys) { await loadModule(k); n++; if (onProgress) onProgress(n, keys.length); }
}
export function findItem(id) { const m = C.mods.get(moduleOf(id)); return m ? m.byId.get(id) || null : null; }

/* ---------- fichier publié ---------- */
export function emptyPatch() { return { format: FORMAT, version: VERSION, revision: 0, updatedAt: null, entries: {}, lists: {} }; }
export function parsePublished(text) {
  text = String(text || "").replace(/^\uFEFF/, "").trim();
  let obj;
  if (text.startsWith("{")) obj = JSON.parse(text);
  else {
    const i = text.indexOf("SylviniaStudioCAPublished"); if (i < 0) throw new Error("Fichier non reconnu : ni export du Studio (Chroniques Alternatives), ni modifications-ca.js.");
    obj = JSON.parse(text.slice(text.indexOf("{", i), text.lastIndexOf("}") + 1));
  }
  if (obj && obj.kind === "sauvegarde-ca" && obj.patch) return { patch: normalizePatch(obj.patch), sim: obj.sim || null, meta: obj };
  if (!obj || obj.format !== FORMAT) throw new Error("Ce fichier n'est pas au format des Chroniques Alternatives (sylvinia-studio-ca).");
  return { patch: normalizePatch(obj), sim: null, meta: null };
}
export function normalizePatch(p) {
  const o = emptyPatch();
  if (!p || typeof p !== "object") return o;
  o.revision = Number(p.revision) || 0; o.updatedAt = p.updatedAt || null;
  if (p.entries && typeof p.entries === "object") Object.keys(p.entries).forEach((k) => { const v = p.entries[k]; if (typeof v === "string" || (typeof v === "number" && isFinite(v))) o.entries[k] = v; });
  if (p.lists && typeof p.lists === "object") Object.keys(p.lists).forEach((k) => { const l = p.lists[k] || {}; o.lists[k] = { insert: Array.isArray(l.insert) ? l.insert.filter((x) => x && x.item != null) : [], hide: Array.isArray(l.hide) ? l.hide.filter((x) => Number.isInteger(x)) : [] }; });
  return o;
}
export function gameFileText(patch) {
  return `/* Sylvinia Studio · modifications publiées de la Chronique Alternative.
   Ce fichier est produit par Sylvinia Studio (bouton « Exporter pour le jeu » ou « Publier sur GitHub »).
   La Chronique Alternative le lit au démarrage : chaque entrée remplace un texte (ou un nombre d'effet) par son identifiant.
   Pour revenir au jeu d'origine : remettre ce fichier dans son état vide ("entries": {} et "lists": {}). */
window.SylviniaStudioCAPublished = ${JSON.stringify(patch, null, 1)};
`;
}
export async function loadPublished() {
  try { const r = await fetch("data/modifications-ca.js", { cache: "no-cache" }); C.published = parsePublished(await r.text()).patch; }
  catch { C.published = emptyPatch(); }
  return C.published;
}

/* ---------- brouillon ---------- */
export function newDraft(from) {
  const p = normalizePatch(from || C.published);
  return { format: FORMAT, version: VERSION, kind: "brouillon-ca", baseRevision: p.revision, entries: p.entries, lists: p.lists, updatedAt: null, retired: [] };
}
export function normalizeDraft(d) {
  const p = normalizePatch(d);
  return { format: FORMAT, version: VERSION, kind: "brouillon-ca", baseRevision: Number(d && d.baseRevision) || 0, entries: p.entries, lists: p.lists, updatedAt: d && d.updatedAt || null, retired: Array.isArray(d && d.retired) ? d.retired : [] };
}
export function onChange(fn) { C.listeners.add(fn); }
function changed(label) { C.draft.updatedAt = new Date().toISOString(); C.listeners.forEach((fn) => fn(label)); }
export function transaction(label, fn, key = "") {
  const now = Date.now();
  if (!(key && key === C.lastKey && now - C.lastAt < 1500)) { C.undo.push({ label, draft: clone(C.draft) }); if (C.undo.length > 120) C.undo.shift(); }
  C.lastKey = key; C.lastAt = now; C.redo = [];
  fn(C.draft);
  changed(label);
}
export function undo() { const s = C.undo.pop(); if (!s) return null; C.redo.push({ label: s.label, draft: clone(C.draft) }); C.draft = s.draft; C.lastKey = ""; changed("annuler"); return s.label; }
export function redo() { const s = C.redo.pop(); if (!s) return null; C.undo.push({ label: s.label, draft: clone(C.draft) }); C.draft = s.draft; C.lastKey = ""; changed("rétablir"); return s.label; }

/* ---------- valeurs ---------- */
export function original(it) { return it.k === "n" ? Number(it.text) : it.text; }
export function value(it) { const d = C.draft.entries; return Object.prototype.hasOwnProperty.call(d, it.id) ? d[it.id] : original(it); }
export function isEdited(it) { return Object.prototype.hasOwnProperty.call(C.draft.entries, it.id); }
export function status(id) {
  const d = C.draft.entries[id], p = C.published.entries[id];
  const dl = JSON.stringify(C.draft.lists[id] || null), pl = JSON.stringify(C.published.lists[id] || null);
  if (d === p && dl === pl) return d === undefined && dl === "null" ? "original" : "publie";
  return "modifie";
}
export function setValue(it, v) {
  transaction("Modifier un texte", (d) => {
    if (it.k === "n") { v = Number(v); if (!isFinite(v)) return; }
    if (v === original(it)) delete d.entries[it.id]; else d.entries[it.id] = v;
  }, "v:" + it.id);
}
export function resetValue(id) { transaction("Rétablir l'original", (d) => { delete d.entries[id]; }); }

/* ---------- listes : éléments ajoutés et masqués ---------- */
export function listOps(id) { return C.draft.lists[id] || { insert: [], hide: [] }; }
function ensureList(d, id) { if (!d.lists[id]) d.lists[id] = { insert: [], hide: [] }; return d.lists[id]; }
function cleanList(d, id) { const l = d.lists[id]; if (l && !l.insert.length && !l.hide.length) delete d.lists[id]; }
export function uid() { return Date.now().toString(36).slice(-4) + Math.random().toString(36).slice(2, 5); }
export function insertItem(listId, at, item, label = "Ajouter un élément") {
  const u = uid();
  transaction(label, (d) => { ensureList(d, listId).insert.push({ at, item, uid: u }); });
  return u;
}
export function updateInserted(listId, u, item) { transaction("Modifier un élément ajouté", (d) => { const x = ensureList(d, listId).insert.find((i) => i.uid === u); if (x) x.item = item; }, "i:" + u); }
export function moveInserted(listId, u, at) { transaction("Déplacer un élément ajouté", (d) => { const x = ensureList(d, listId).insert.find((i) => i.uid === u); if (x) x.at = at; }); }
export function removeInserted(listId, u) {
  transaction("Retirer un élément ajouté", (d) => {
    const l = ensureList(d, listId); const x = l.insert.find((i) => i.uid === u);
    if (x && x.item && typeof x.item.id === "string" && publishedHasInsert(listId, u)) d.retired.push(x.item.id);
    l.insert = l.insert.filter((i) => i.uid !== u); cleanList(d, listId);
  });
}
function publishedHasInsert(listId, u) { const l = C.published.lists[listId]; return !!(l && l.insert.some((i) => i.uid === u)); }
export function toggleHide(listId, idx) {
  transaction("Masquer ou rétablir un élément", (d) => {
    const l = ensureList(d, listId); const i = l.hide.indexOf(idx);
    if (i >= 0) l.hide.splice(i, 1); else l.hide.push(idx);
    cleanList(d, listId);
  });
}

/* Copie « intelligente » d'un élément réel : nouveaux identifiants, jamais réutilisés. */
export function cloneForInsert(model, baseId) {
  const item = clone(model);
  const used = new Set(C.draft.retired || []);
  let hasFn = false;
  const suffix = "-st" + uid();
  const walk = (o, top) => {
    if (Array.isArray(o)) { for (let i = o.length - 1; i >= 0; i--) { if (o[i] && o[i].__fn) { o.splice(i, 1); hasFn = true; } else walk(o[i], false); } return; }
    if (!o || typeof o !== "object") return;
    Object.keys(o).forEach((k) => {
      const v = o[k];
      if (v && typeof v === "object" && v.__fn) { delete o[k]; hasFn = true; return; }
      if (k === "id" && typeof v === "string") { let nid = top && baseId ? baseId : v + suffix; while (used.has(nid)) nid += "x"; o[k] = nid; }
      else walk(v, false);
    });
  };
  walk(item, true);
  return { item, hasFn };
}

/* ---------- export ---------- */
export function exportPatch() {
  const out = emptyPatch();
  out.revision = (C.draft.baseRevision || 0) + 1;
  out.updatedAt = new Date().toISOString();
  Object.keys(C.draft.entries).sort().forEach((k) => { out.entries[k] = C.draft.entries[k]; });
  Object.keys(C.draft.lists).sort().forEach((k) => { const l = C.draft.lists[k]; if (l.insert.length || l.hide.length) out.lists[k] = clone(l); });
  return out;
}
export function diffIds() {
  const ids = new Set([...Object.keys(C.draft.entries), ...Object.keys(C.published.entries), ...Object.keys(C.draft.lists), ...Object.keys(C.published.lists)]);
  return [...ids].filter((id) => status(id) === "modifie").sort();
}
export function moduleChangeCount(key) {
  const pre = key + ":"; let n = 0;
  Object.keys(C.draft.entries).forEach((k) => { if (k.startsWith(pre)) n++; });
  Object.keys(C.draft.lists).forEach((k) => { if (k.startsWith(pre)) n++; });
  return n;
}
export function moduleStatus(key) {
  const pre = key + ":";
  const ids = new Set([...Object.keys(C.draft.entries), ...Object.keys(C.published.entries), ...Object.keys(C.draft.lists), ...Object.keys(C.published.lists)].filter((k) => k.startsWith(pre)));
  if (!ids.size) return "original";
  return [...ids].some((id) => status(id) === "modifie") ? "modifie" : "publie";
}

/* ---------- contrôles ---------- */
const FORBIDDEN_PAIRS = [["naiah", "amanea"]];
export function placeholders(s) { return [...new Set((String(s).match(/\{(\d+)\}/g) || []).map((x) => Number(x.slice(1, -1))))]; }
export function textsOf(item, path = "", out = []) {
  if (typeof item === "string") { out.push([path, item]); return out; }
  if (Array.isArray(item)) item.forEach((x, i) => textsOf(x, path + "[" + i + "]", out));
  else if (item && typeof item === "object") Object.keys(item).forEach((k) => textsOf(item[k], path ? path + "." + k : k, out));
  return out;
}
export async function validate() {
  const errors = [], warnings = [], infos = [];
  const keys = new Set([...Object.keys(C.draft.entries), ...Object.keys(C.draft.lists)].map(moduleOf));
  for (const k of keys) { if (moduleMeta(k)) await loadModule(k); }
  for (const [id, v] of Object.entries(C.draft.entries)) {
    const it = findItem(id);
    if (!it) { warnings.push({ id, msg: "Texte d'origine introuvable : il a changé dans le code depuis votre modification. La modification est ignorée par le jeu." }); continue; }
    if (it.k === "n" && !(typeof v === "number" && isFinite(v))) errors.push({ id, msg: "Nombre invalide." });
    if (it.k !== "n") {
      if (typeof v !== "string") errors.push({ id, msg: "Texte invalide." });
      else {
        if (!v.trim()) warnings.push({ id, msg: "Texte vide." });
        if (it.k === "t") {
          const n = (it.vals || []).length; const ph = placeholders(v);
          ph.filter((x) => x < 1 || x > n).forEach((x) => warnings.push({ id, msg: `Repère {${x}} inconnu : il s'affichera tel quel.` }));
          for (let i = 1; i <= n; i++) if (!ph.includes(i)) infos.push({ id, msg: `Le repère {${i}} (${it.vals[i - 1]}) n'est plus utilisé.` });
        }
        if (/[—–]/.test(v)) infos.push({ id, msg: "Le texte contient un tiret long." });
      }
    }
  }
  for (const [id, l] of Object.entries(C.draft.lists)) {
    const a = findItem(id);
    if (!a) { warnings.push({ id, msg: "Liste introuvable dans le catalogue actuel : ses ajouts sont ignorés par le jeu." }); continue; }
    l.hide.forEach((i) => { if (i >= a.len) warnings.push({ id, msg: `Élément masqué n°${i + 1} inexistant.` }); });
    const ids = new Set();
    l.insert.forEach((x) => {
      if (x.item == null) { errors.push({ id, msg: "Élément ajouté vide." }); return; }
      if (x.item && typeof x.item.id === "string") { if (ids.has(x.item.id)) errors.push({ id, msg: `Identifiant en double : ${x.item.id}.` }); ids.add(x.item.id); if ((C.draft.retired || []).includes(x.item.id)) errors.push({ id, msg: `Identifiant déjà utilisé par un contenu supprimé : ${x.item.id}.` }); }
      const flat = JSON.stringify(x.item).toLowerCase();
      FORBIDDEN_PAIRS.forEach(([p, q]) => { if (new RegExp(`"(character|characters|cast|participants|partners)"[^\\]]*"${p}"`).test(flat) && new RegExp(`"${q}"`).test(flat)) warnings.push({ id, msg: "Règle des personnages : Amanea et Naïah ne partagent jamais une scène." }); });
      if (/intim|explicit/.test(id) && /"naiah"|naïah/.test(flat)) warnings.push({ id, msg: "Règle des personnages : Naïah ne ressent jamais de désir sexuel, et cela n'est jamais nommé. Relisez cet ajout." });
      textsOf(x.item).forEach(([p, t]) => { if (/[—–]/.test(t)) infos.push({ id, msg: `Tiret long dans ${p}.` }); });
    });
  }
  /* références croisées entre contenus créés dans le Studio (connaissance révélée, drapeau, scène suivante...) */
  const created = new Set(), refs = [];
  const scan = (o, lid, key) => {
    if (Array.isArray(o)) { o.forEach((x) => scan(x, lid, key)); return; }
    if (o && typeof o === "object") { Object.keys(o).forEach((k) => { if (k === "id" && typeof o[k] === "string") created.add(o[k]); else scan(o[k], lid, k); }); return; }
    if (typeof o === "string" && /-st[0-9a-z]{7}x*$/.test(o)) refs.push({ lid, key, ref: o });
  };
  for (const [lid, l] of Object.entries(C.draft.lists)) l.insert.forEach((x) => scan(x.item, lid, ""));
  refs.forEach(({ lid, key, ref }) => { if (!created.has(ref)) warnings.push({ id: lid, msg: `Référence « ${ref} » (${key}) vers un contenu créé dans le Studio qui n'existe plus dans le brouillon.` }); });
  return { ok: !errors.length, errors, warnings, infos };
}

/* Intégrer la version en ligne : vos entrées gardent la priorité. */
export function rebaseOnto(remote) {
  const r = normalizePatch(remote);
  const d = newDraft(r);
  Object.keys(C.draft.entries).forEach((k) => { if (C.draft.entries[k] !== C.published.entries[k]) d.entries[k] = C.draft.entries[k]; });
  Object.keys(C.draft.lists).forEach((k) => { if (JSON.stringify(C.draft.lists[k]) !== JSON.stringify(C.published.lists[k] || null)) d.lists[k] = clone(C.draft.lists[k]); });
  d.retired = C.draft.retired || [];
  return d;
}
