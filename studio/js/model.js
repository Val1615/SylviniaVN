/* Sylvinia Studio · modèle de données.
   La source de vérité est le jeu lui-même : les scènes d'origine sont lues dans le moteur (S),
   et le Studio ne conserve que les différences (le « brouillon »), au même format que
   studio/data/modifications.js. */
const SCHEMA = window.SylviniaStudioSchema;
const hasOwn = Object.prototype.hasOwnProperty;

export const M = {
  base: null,          // instantané du jeu d'origine
  baseSet: new Set(),
  published: null,     // modifications publiées actuellement dans le dépôt
  draft: null,         // brouillon (= publié + modifications en cours)
  version: 0,          // incrémenté à chaque changement
  undo: [], redo: [],
  listeners: new Set(),
};

export const clone = (v) => (v == null || typeof v !== "object" ? v : JSON.parse(JSON.stringify(v)));
export const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
export const now = () => new Date().toISOString();

export function emptyDraft() {
  const d = SCHEMA.emptyPatch();
  d.baseRevision = 0; d.meta = { touched: {}, created: [] };
  return d;
}
export function normalizeDraft(d) {
  const out = Object.assign(emptyDraft(), clone(d) || {});
  out.nodes = out.nodes || {}; out.chapters = out.chapters || {};
  out.meta = Object.assign({ touched: {}, created: [] }, out.meta || {});
  return out;
}

export function setBase(snapshot) {
  M.base = snapshot;
  M.baseSet = new Set(snapshot.order);
  M.published = normalizeDraft(snapshot.published || SCHEMA.emptyPatch());
  if (M.draft) bump(); else memo.clear();
}
export function setDraft(d, { keepUndo = false } = {}) {
  M.draft = normalizeDraft(d);
  if (!keepUndo) { M.undo = []; M.redo = []; }
  bump();
}
export function onChange(fn) { M.listeners.add(fn); return () => M.listeners.delete(fn); }
function bump(reason) { M.version++; memo.clear(); M.listeners.forEach((fn) => { try { fn(reason); } catch (e) { console.error(e); } }); }
export function invalidate() { memo.clear(); }

/* ---------- lecture ---------- */
const memo = new Map();
function memoize(key, fn) { if (!memo.has(key)) memo.set(key, fn()); return memo.get(key); }

export const isBase = (id) => M.baseSet.has(id);
export const isPeriod = (id) => !!(M.base && M.base.periods && M.base.periods[id]);
export const isKnownTarget = (id) => isBase(id) || isPeriod(id);
export const exists = (id) => isBase(id) || !!(M.draft && M.draft.nodes[id] && M.draft.nodes[id].studioNew);
export function baseNode(id) { return (M.base && M.base.nodes[id]) || null; }
export function node(id) {
  const b = baseNode(id); const d = M.draft && M.draft.nodes[id];
  if (!b && !(d && d.studioNew)) return null;
  return Object.assign({}, b || {}, d || {});
}
export function allIds() {
  return memoize("allIds", () => [...M.base.order, ...(M.draft.meta.created || []).filter((id) => M.draft.nodes[id] && !isBase(id))]);
}
export function isDynamicText(id) {
  const b = baseNode(id);
  return !!(b && (b.text && typeof b.text === "object") || (b && (b.ending || b.duelResult)));
}
export function children(n) {
  if (!n) return [];
  const out = [];
  if (Array.isArray(n.choices) && n.choices.length) n.choices.forEach((c, i) => c && c.next && out.push({ to: c.next, kind: "choice", index: i, choice: c }));
  else if (n.next) out.push({ to: n.next, kind: "next" });
  return out;
}
export function referrers() {
  return memoize("refs", () => {
    const refs = new Map();
    allIds().forEach((id) => {
      const n = node(id); if (!n || n.studioRemoved) return;
      children(n).forEach((e) => { if (!refs.has(e.to)) refs.set(e.to, []); refs.get(e.to).push({ from: id, kind: e.kind, index: e.index }); });
    });
    return refs;
  });
}
export const refsTo = (id) => referrers().get(id) || [];

/* ---------- chapitres ---------- */
export function chapterKey(id) {
  id = String(id || "");
  if (/^intro_/.test(id)) return "intro";
  let m = /^(cx\d+)_/.exec(id); if (m) return m[1];
  m = /^x(\d+[a-z]*)_/.exec(id); if (m) return "c" + m[1];
  m = /^c(\d+)([a-z]*)_/.exec(id); if (m) return "c" + m[1] + m[2];
  return "c1";
}
export function idPrefix(key) { return key === "c1" ? "s" : key; }
const ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX"];

export function chapters() {
  return memoize("chapters", () => {
    const map = new Map();
    allIds().forEach((id, idx) => {
      const k = chapterKey(id);
      if (!map.has(k)) map.set(k, { key: k, ids: [], first: idx });
      map.get(k).ids.push(id);
    });
    Object.keys(M.draft.chapters || {}).forEach((k) => { if (!map.has(k)) map.set(k, { key: k, ids: [], first: 1e9 }); });
    const c1Label = M.base.labels.p01 || "Chapitre I";
    const list = [...map.values()].map((ch) => {
      const custom = M.draft.chapters[ch.key];
      let label = custom && custom.title ? custom.title : (M.base.labels[ch.ids[0]] || "");
      const m = /^c(\d+)([a-z]*)$/.exec(ch.key);
      if (!custom && ch.key !== "c1" && (!label || label === c1Label) && m) {
        const n = +m[1], suf = m[2];
        const sameNum = [...map.values()].find((o) => o.key === "c" + n && o.ids.length);
        const t = sameNum ? (M.base.labels[sameNum.ids[0]] || "").split(" · ").slice(1).join(" · ") : "";
        label = `Chapitre ${ROMAN[n] || n}${suf ? "_" + suf.toUpperCase() : ""}${t ? " · " + t : ""}${suf === "g" ? " (route du groupe)" : ""}`;
      }
      const parts = label.split(" · ");
      const num = ch.key === "intro" ? 0 : (m ? +m[1] : 99);
      return { key: ch.key, ids: ch.ids, label, number: parts[0] || label, title: parts.slice(1).join(" · ") || "", sortNum: num, first: ch.first, custom: !!custom };
    });
    list.sort((a, b) => a.sortNum - b.sortNum || a.first - b.first);
    return list;
  });
}
export function chapter(key) { return chapters().find((c) => c.key === key) || null; }

/* Ordre narratif : ordre de déclaration, en ramenant chaque réplique ajoutée plus tard
   (correctifs, Studio) juste après la réplique qui y mène. */
export function narrativeOrder(key) {
  return memoize("order:" + key, () => {
    const ch = chapter(key); if (!ch) return [];
    const all = ch.ids.filter((id) => { const n = node(id); return n && !n.studioRemoved; });
    const inCh = new Set(all);
    const baseIds = all.filter(isBase);
    const idx = new Map(baseIds.map((id, i) => [id, i]));
    const firstRef = new Map();
    baseIds.forEach((id) => children(node(id)).forEach((e) => { if (idx.has(e.to) && !firstRef.has(e.to)) firstRef.set(e.to, id); }));
    const placed = new Set(); const out = [];
    const place = (id) => {
      if (placed.has(id)) return; placed.add(id); out.push(id);
      children(node(id)).forEach((e) => {
        const c = e.to;
        if (idx.has(c) && !placed.has(c) && firstRef.get(c) === id && idx.get(c) > idx.get(id) + 12) place(c);
      });
    };
    baseIds.forEach(place);
    /* répliques créées dans le Studio : après leur unique prédécesseur, sinon juste avant leur suite */
    let pending = all.filter((id) => !isBase(id));
    for (let guard = 0; pending.length && guard < 50; guard++) {
      const rest = [];
      pending.forEach((id) => {
        const refs = refsTo(id).filter((r) => inCh.has(r.from));
        let pos = -1;
        if (refs.length === 1 && refs[0].kind === "next") { const i = out.indexOf(refs[0].from); if (i >= 0) pos = i + 1; }
        if (pos < 0) {
          let t = node(id).next, g = 0;
          while (t && inCh.has(t) && !placed.has(t) && g++ < 200) t = node(t).next;
          const i = t ? out.indexOf(t) : -1;
          if (i >= 0) pos = i;
          else if (refs.length) { const j = out.indexOf(refs[0].from); if (j >= 0) pos = j + 1; }
        }
        if (pos >= 0) { out.splice(pos, 0, id); placed.add(id); } else rest.push(id);
      });
      if (rest.length === pending.length) { rest.forEach((id) => { out.push(id); placed.add(id); }); break; }
      pending = rest;
    }
    return out;
  });
}
export function scenesOf(key) {
  return memoize("scenes:" + key, () => {
    const order = narrativeOrder(key); const out = [];
    order.forEach((id) => {
      const n = node(id); const t = (n.title || "").trim();
      const last = out[out.length - 1];
      if (last && last.title === t) last.ids.push(id);
      else out.push({ id, title: t, ids: [id] });
    });
    out.forEach((s, i) => {
      s.index = i;
      s.conditional = s.ids.some((id) => {
        const n = node(id);
        if (n.studioIf) return true;
        return refsTo(id).some((r) => { if (r.kind !== "choice") return false; const c = node(r.from).choices[r.index]; return c && (c.requires || c.requiresFlags || (c.requiresAnyFlags && c.requiresAnyFlags.length)); });
      });
      s.choices = s.ids.reduce((a, id) => a + ((node(id).choices || []).length), 0);
      s.special = s.ids.some((id) => specialOf(node(id)).length > 0);
    });
    return out;
  });
}
export function sceneOfLine(key, id) { return scenesOf(key).find((s) => s.ids.includes(id)) || null; }

export function chapterStats(key) {
  const ch = chapter(key); if (!ch) return null;
  let choices = 0, branches = 0, modified = 0, publishedMods = 0, last = null;
  ch.ids.forEach((id) => {
    const n = node(id); if (!n) return;
    const k = (n.choices || []).length; choices += k; if (k >= 2) branches++;
    const d = M.draft.nodes[id], p = M.published.nodes[id];
    if (!same(d, p)) modified++;
    if (p) publishedMods++;
    const t = M.draft.meta.touched[id]; if (t && (!last || t > last)) last = t;
  });
  const custom = M.draft.chapters[key];
  let status = "publie";
  if (custom && !M.published.chapters[key]) status = "brouillon";
  else if (modified) status = "modifie";
  return { scenes: scenesOf(key).length, lines: narrativeOrder(key).length, choices, branches, modified, publishedMods, status, last };
}

/* ---------- événements spéciaux ---------- */
const SPECIAL = [
  ["combat", "Duel"], ["c3ShadowCombat", "Duel des ombres"], ["c5SageDuel", "Duel du Sage (minuté)"], ["c7NaiahDuel", "Duel de Naïah (QTE)"],
  ["c7PacteEval", "Évaluation du pacte"], ["x12iDuel", "Duel et QTE (Chapitre XII_I)"], ["keySlides", "Diaporama d'images clés"],
  ["c12gNaiahAssault", "Séquence spéciale"], ["c12gCycle", "Séquence cyclique"], ["bgCycle", "Décors en cycle"], ["ending", "Fin de chapitre"],
  ["duelResult", "Résultat de duel"], ["videoBanner", "Bandeau vidéo"], ["projection", "Projection"], ["pov", "Changement de point de vue"],
  ["memories", "Souvenirs débloqués"], ["items", "Objets obtenus"], ["intro", "Introduction"], ["c10gNoop", ""],
];
export function specialOf(n) {
  if (!n) return [];
  return SPECIAL.filter(([k, l]) => l && n[k] !== undefined && n[k] !== false && n[k] !== null).map(([k, l]) => ({ key: k, label: l, value: n[k] }));
}

/* ---------- catalogues (noms internes existants uniquement) ---------- */
export function catalogs() {
  return memoize("catalogs", () => {
    const flags = new Set(), mem = new Set(), items = new Set(), speakers = new Map();
    allIds().forEach((id) => {
      const n = node(id); if (!n) return;
      if (n.speaker) speakers.set(n.speaker, (speakers.get(n.speaker) || 0) + 1);
      (n.memories || []).forEach && Array.isArray(n.memories) && n.memories.forEach((x) => mem.add(x));
      Array.isArray(n.items) && n.items.forEach((x) => items.add(x));
      (n.choices || []).forEach((c) => {
        if (!c) return;
        if (c.flags && typeof c.flags === "object") Object.keys(c.flags).forEach((f) => flags.add(f));
        if (c.requiresFlags) Object.keys(c.requiresFlags).forEach((f) => flags.add(f));
        (c.requiresAnyFlags || []).forEach((f) => flags.add(f));
        (c.memories || []).forEach((x) => mem.add(x));
        (c.items || []).forEach((x) => items.add(x));
      });
      if (n.studioIf) { Object.keys(n.studioIf.all || {}).forEach((f) => flags.add(f)); (n.studioIf.any || []).concat(n.studioIf.none || []).forEach((f) => flags.add(f)); }
    });
    ["chapter1Complete", "chapter2Complete", "chapter3Complete", "chapter4VComplete", "chapter4DComplete", "chapter5Complete", "chapter6Complete", "chapter7Complete", "hyleePostGlacialis", "introComplete"].forEach((f) => flags.add(f));
    const A = M.base.assets || {};
    const keys = Object.keys(A);
    const isImg = (k) => /\.(png|jpe?g|webp|gif)$/i.test(A[k] || "");
    const isVid = (k) => /\.(mp4|webm)$/i.test(A[k] || "");
    const isAud = (k) => /\.(mp3|ogg|wav|m4a)$/i.test(A[k] || "");
    const charKinds = new Set();
    allIds().forEach((id) => (node(id).chars || []).forEach((c) => Array.isArray(c) && charKinds.add(c[0])));
    const sprites = {};
    charKinds.forEach((k) => { sprites[k] = keys.filter((x) => x.startsWith(k + "_") && isImg(x)); });
    const usedBg = new Set(); allIds().forEach((id) => { const b = node(id).bg; if (b) usedBg.add(b); });
    const spriteSet = new Set(Object.values(sprites).flat());
    const backgrounds = keys.filter((k) => (isImg(k) || isVid(k)) && !spriteSet.has(k)).sort((a, b) => (usedBg.has(b) - usedBg.has(a)) || a.localeCompare(b));
    return {
      flags: [...flags].sort(), memories: [...mem].sort(), items: [...items].sort(),
      speakers: [...speakers.entries()].sort((a, b) => b[1] - a[1]).map((e) => e[0]),
      stats: Object.keys(M.base.startStats || { audace: 0, sangfroid: 0, lien: 0, lucidite: 0, resonance: 0 }),
      statNames: M.base.statNames || {},
      music: keys.filter((k) => isAud(k) && /^music_|^menu_/.test(k)).sort(),
      audio: keys.filter(isAud).sort(),
      backgrounds, sprites, charKinds: [...charKinds].sort(),
    };
  });
}
export const assetUrl = (key) => { const p = M.base.assets[key]; return p ? "../" + p : ""; };

/* ---------- écriture (toutes les modifications passent par ici) ---------- */
function snapshotDraft() { return JSON.stringify({ nodes: M.draft.nodes, chapters: M.draft.chapters, meta: M.draft.meta }); }
export function transaction(label, fn, opts = {}) {
  const before = snapshotDraft();
  let result;
  try { result = fn(); } catch (e) { restoreSnap(before); memo.clear(); throw e; }
  if (snapshotDraft() !== before) {
    const top = M.undo[M.undo.length - 1];
    const t = Date.now();
    if (!(opts.coalesce && top && top.coalesce === opts.coalesce && t - top.at < 2500)) {
      M.undo.push({ label, snap: before, coalesce: opts.coalesce || null, at: t }); if (M.undo.length > 300) M.undo.shift();
    } else top.at = t;
    M.redo = [];
    M.draft.updatedAt = now();
    bump(label);
  }
  return result;
}
function restoreSnap(s) { const o = JSON.parse(s); M.draft.nodes = o.nodes; M.draft.chapters = o.chapters; M.draft.meta = o.meta; }
export function undo() { const u = M.undo.pop(); if (!u) return null; M.redo.push({ label: u.label, snap: snapshotDraft() }); restoreSnap(u.snap); M.draft.updatedAt = now(); bump("undo"); return u.label; }
export function redo() { const r = M.redo.pop(); if (!r) return null; M.undo.push({ label: r.label, snap: snapshotDraft() }); restoreSnap(r.snap); M.draft.updatedAt = now(); bump("redo"); return r.label; }

function touch(id) { M.draft.meta.touched[id] = now(); }
export function setField(id, field, value) {
  if (!SCHEMA.FIELDS[field]) throw new Error("Champ non modifiable : " + field);
  const b = baseNode(id);
  const d = M.draft.nodes[id] || (M.draft.nodes[id] = {});
  const baseVal = b ? b[field] : undefined;
  if (b && (value === undefined || same(value, baseVal))) delete d[field];
  else if (value === undefined) delete d[field];
  else d[field] = clone(value);
  if (!Object.keys(d).length) delete M.draft.nodes[id];
  touch(id);
}
export function setFields(id, obj) { Object.keys(obj).forEach((f) => setField(id, f, obj[f])); }

export function newId(key) {
  const p = idPrefix(key);
  let id;
  do { id = `${p}_st${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`.replace(/[^A-Za-z0-9_]/g, ""); } while (exists(id));
  return id;
}
export function createNode(key, fields) {
  const id = newId(key);
  M.draft.nodes[id] = Object.assign({ studioNew: true, title: "", sub: "", bg: "", music: "", speaker: "Narrateur", text: "", chars: [] }, clone(fields), { studioNew: true });
  M.draft.meta.created.push(id);
  touch(id);
  memo.clear();
  return id;
}

/* Une réplique « linéaire » a une suite unique et pas de choix. */
export const isLinear = (n) => !!(n && n.next && !(n.choices && n.choices.length));
function redirect(fromTarget, toTarget, exceptId) {
  refsTo(fromTarget).forEach((r) => {
    if (r.from === exceptId) return;
    const n = node(r.from);
    if (r.kind === "next") setField(r.from, "next", toTarget);
    else { const ch = clone(n.choices); ch[r.index].next = toTarget; setField(r.from, "choices", ch); }
  });
  memo.clear();
}
export function canInsertAfter(id) { const n = node(id); return !!n && !(n.choices && n.choices.length); }
export function insertAfter(id, fields) {
  const n = node(id);
  if (!canInsertAfter(id)) throw new Error("Cette réplique se termine par un choix : ajoutez la nouvelle réplique dans la scène visée par le choix, ou insérez-la avant.");
  const key = chapterKey(id);
  const base = { title: n.title || "", sub: n.sub || "", bg: n.bg || "", music: n.music || "", chars: clone(n.chars || []), speaker: "Narrateur", text: "" };
  const nid = createNode(key, Object.assign(base, fields || {}, { next: n.next || "" }));
  if (!n.next) setField(nid, "next", undefined);
  setField(id, "next", nid);
  memo.clear();
  return nid;
}
export function insertBefore(id, fields) {
  const refs = refsTo(id);
  if (!refs.length) throw new Error("Aucune réplique ne mène ici : impossible d'insérer avant (c'est sans doute le début du chapitre).");
  const n = node(id); const key = chapterKey(id);
  const base = { title: n.title || "", sub: n.sub || "", bg: n.bg || "", music: n.music || "", chars: clone(n.chars || []), speaker: "Narrateur", text: "" };
  const nid = createNode(key, Object.assign(base, fields || {}, { next: id }));
  redirect(id, nid, nid);
  return nid;
}
export function lineMoveCheck(first, last) {
  last = last || first;
  const f = node(first), l = node(last);
  if (!f || !l) return "Réplique introuvable.";
  if (!isLinear(l)) return "Cette réplique se termine par un choix ou n'a pas de suite : elle ne peut pas être déplacée.";
  if (!refsTo(first).length) return "C'est le point d'entrée d'un passage : le déplacer couperait l'accès au chapitre.";
  return null;
}
/* Déplace la chaîne first..last juste après la réplique target. */
export function moveAfter(first, last, target) {
  last = last || first;
  const err = lineMoveCheck(first, last); if (err) throw new Error(err);
  const chain = []; let cur = first;
  for (let g = 0; g < 500; g++) { chain.push(cur); if (cur === last) break; const n = node(cur); if (!isLinear(n)) throw new Error("Passage non linéaire."); cur = n.next; }
  if (chain.includes(target)) throw new Error("Destination à l'intérieur du passage déplacé.");
  const t = node(target);
  if (!canInsertAfter(target)) throw new Error("La réplique de destination se termine par un choix.");
  if (t.next === first) return;
  const after = node(last).next;
  redirect(first, after, null);      // le passage sort du fil
  memo.clear();
  const tNext = node(target).next;
  setField(last, "next", tNext);
  setField(target, "next", first);
  memo.clear();
}
export function moveUp(id) {
  const prevs = refsTo(id).filter((r) => r.kind === "next");
  if (prevs.length !== 1) throw new Error("Plusieurs passages mènent ici (ou aucun) : utilisez « Déplacer après… » pour choisir l'endroit.");
  const p = prevs[0].from;
  moveAfter(p, p, id);
}
export function moveDown(id) { const n = node(id); if (!isLinear(n)) throw new Error("Cette réplique se termine par un choix."); moveAfter(id, id, n.next); }
export function removeLine(id) {
  const n = node(id);
  if (!isLinear(n)) throw new Error("Seule une réplique avec une suite unique peut être retirée. Pour un choix, modifiez les réponses dans l'onglet Branches.");
  if (!refsTo(id).length) throw new Error("C'est le point d'entrée d'un passage : il ne peut pas être retiré.");
  redirect(id, n.next, id);
  if (!isBase(id) && !(M.published.nodes[id])) {
    delete M.draft.nodes[id];
    M.draft.meta.created = M.draft.meta.created.filter((x) => x !== id);
  } else setField(id, "studioRemoved", true);
  memo.clear();
}
export function restoreLine(id) {
  /* une réplique retirée reste dans les sauvegardes : on peut la rebrancher après une autre */
  setField(id, "studioRemoved", undefined);
}

/* ---------- scènes ---------- */
export function renameScene(key, sceneId, title) {
  const s = scenesOf(key).find((x) => x.id === sceneId); if (!s) return;
  s.ids.forEach((id) => setField(id, "title", title));
}
export function sceneEnds(key, sceneId) {
  const s = scenesOf(key).find((x) => x.id === sceneId); if (!s) return null;
  return { scene: s, first: s.ids[0], last: s.ids[s.ids.length - 1] };
}
export function sceneIsChain(s) {
  for (let i = 0; i < s.ids.length - 1; i++) { const n = node(s.ids[i]); if (!isLinear(n) || n.next !== s.ids[i + 1]) return false; }
  return true;
}
export function addSceneAfter(key, sceneId, title) {
  const e = sceneEnds(key, sceneId);
  const lastNode = node(e.last);
  const target = canInsertAfter(e.last) ? e.last : null;
  if (!target) throw new Error("La scène se termine par un choix : ajoutez la nouvelle scène comme destination d'un choix (onglet Branches).");
  return insertAfter(target, { title: title || "Nouvelle scène", sub: "", text: "", speaker: "Narrateur", chars: clone(lastNode.chars || []) });
}
export function moveScene(key, sceneId, dir) {
  const list = scenesOf(key); const i = list.findIndex((s) => s.id === sceneId); const s = list[i];
  const other = list[i + dir];
  if (!s || !other) throw new Error("Rien à échanger dans cette direction.");
  const [a, b] = dir < 0 ? [other, s] : [s, other];
  if (!sceneIsChain(a) || !sceneIsChain(b)) throw new Error("Une des deux scènes contient des embranchements : déplacez-la depuis l'onglet Branches.");
  const aLast = a.ids[a.ids.length - 1], bLast = b.ids[b.ids.length - 1];
  if (node(aLast).next !== b.ids[0]) throw new Error("Ces deux scènes ne se suivent pas directement dans le récit.");
  const bErr = lineMoveCheck(b.ids[0], bLast); if (bErr) throw new Error(bErr);
  /* B passe avant A : on déplace B juste après le prédécesseur unique de A */
  const prevs = refsTo(a.ids[0]).filter((r) => r.kind === "next");
  if (prevs.length !== 1) throw new Error("La scène précédente a plusieurs entrées : déplacement impossible sans choisir l'embranchement.");
  moveAfter(b.ids[0], bLast, prevs[0].from);
}
export function removeScene(key, sceneId) {
  const s = scenesOf(key).find((x) => x.id === sceneId);
  if (!sceneIsChain(s)) throw new Error("Cette scène contient des embranchements : retirez d'abord ses choix dans l'onglet Branches.");
  const last = node(s.ids[s.ids.length - 1]);
  if (!isLinear(last)) throw new Error("Cette scène se termine par un choix ou sans suite : elle ne peut pas être retirée sans casser le récit.");
  if (!refsTo(s.ids[0]).length) throw new Error("C'est le début du chapitre : il ne peut pas être retiré.");
  [...s.ids].forEach((id) => removeLine(id));
}
export function duplicateScene(key, sceneId) {
  const s = scenesOf(key).find((x) => x.id === sceneId);
  const map = new Map();
  s.ids.forEach((id) => map.set(id, newIdUnique(key, map)));
  const copies = s.ids.map((id) => {
    const n = clone(node(id));
    const out = pickEditable(n);
    out.title = (n.title || "") + " (copie)";
    if (out.next && map.has(out.next)) out.next = map.get(out.next);
    if (Array.isArray(out.choices)) out.choices = out.choices.map((c) => Object.assign({}, c, { next: map.get(c.next) || c.next }));
    return [map.get(id), out];
  });
  /* la copie est insérée juste après la scène si celle-ci finit par une suite unique, sinon elle reste détachée */
  const e = sceneEnds(key, sceneId); const lastN = node(e.last);
  const attach = sceneIsChain(s) && isLinear(lastN);
  copies.forEach(([nid, out]) => { M.draft.nodes[nid] = Object.assign(out, { studioNew: true }); M.draft.meta.created.push(nid); touch(nid); });
  if (attach) {
    const lastCopy = map.get(e.last);
    M.draft.nodes[lastCopy].next = lastN.next;
    setField(e.last, "next", map.get(s.ids[0]));
  } else {
    const lastCopy = map.get(e.last);
    if (!(M.draft.nodes[lastCopy].choices || []).length) delete M.draft.nodes[lastCopy].next;
  }
  memo.clear();
  return { first: map.get(s.ids[0]), attached: attach };
}
function newIdUnique(key, map) { let id; const used = new Set(map.values()); do { id = newId(key); } while (used.has(id)); return id; }
export function pickEditable(n) {
  const out = {};
  Object.keys(SCHEMA.FIELDS).forEach((f) => { if (n[f] !== undefined && !(f === "text" && typeof n.text === "object")) out[f] = clone(n[f]); });
  delete out.studioRemoved;
  return out;
}

/* ---------- chapitres créés dans le Studio ---------- */
export function createChapter(title) {
  let i = 1; const keys = new Set(chapters().map((c) => c.key));
  while (keys.has("cx" + i)) i++;
  const key = "cx" + i;
  M.draft.chapters[key] = { title: title || `Nouveau chapitre ${i}`, createdAt: now() };
  createNode(key, { title: "Ouverture", sub: "", speaker: "Narrateur", text: "", chars: [] });
  memo.clear();
  return key;
}
export function duplicateChapter(srcKey) {
  const src = chapter(srcKey);
  const key = createChapterShell(`${src.label} (copie)`);
  const map = new Map(); const ids = narrativeOrder(srcKey);
  ids.forEach((id) => map.set(id, newIdUnique(key, map)));
  ids.forEach((id) => {
    const out = pickEditable(clone(node(id)));
    if (out.next && map.has(out.next)) out.next = map.get(out.next);
    if (Array.isArray(out.choices)) out.choices = out.choices.map((c) => Object.assign({}, c, { next: map.get(c.next) || c.next }));
    const nid = map.get(id);
    M.draft.nodes[nid] = Object.assign(out, { studioNew: true }); M.draft.meta.created.push(nid); touch(nid);
  });
  memo.clear();
  return key;
}
function createChapterShell(title) {
  let i = 1; const keys = new Set(chapters().map((c) => c.key));
  while (keys.has("cx" + i)) i++;
  const key = "cx" + i;
  M.draft.chapters[key] = { title, createdAt: now() };
  memo.clear();
  return key;
}
export function renameChapter(key, title) {
  if (!M.draft.chapters[key]) throw new Error("Les titres des chapitres d'origine sont définis par le moteur : seuls les chapitres créés dans le Studio peuvent être renommés ici.");
  M.draft.chapters[key] = Object.assign({}, M.draft.chapters[key], { title });
}

/* ---------- choix ---------- */
export function makeBranch(id) {
  const n = node(id);
  if (n.choices && n.choices.length) return;
  setField(id, "choices", [{ label: "Continuer", next: n.next || "", effects: {}, note: "" }]);
  setField(id, "next", undefined);
}
export function setChoices(id, list) { setField(id, "choices", list.length ? list : undefined); }

/* ---------- analyse des embranchements ---------- */
export function analyze(key) {
  return memoize("analyze:" + key, () => {
    const ids = narrativeOrder(key); const ch = chapter(key);
    const entry = ch && ch.ids.find((id) => !node(id).studioRemoved);
    const problems = [];
    ids.forEach((id) => {
      const n = node(id);
      children(n).forEach((e) => { if (e.to && !exists(e.to) && !isPeriod(e.to) && !SCHEMA.SPECIAL_TARGETS.includes(e.to)) problems.push({ id, type: "broken", text: `Destination introuvable « ${e.to} »` }); });
      const sp = specialOf(n);
      if (!n.next && !(n.choices && n.choices.length) && !sp.length && !/_end$|ending|fin/i.test(id)) problems.push({ id, type: "deadend", text: "Sans suite : le joueur ne peut pas continuer (vérifiez si c'est voulu)." });
      if (id !== entry && !refsTo(id).length) problems.push({ id, type: "orphan", text: "Aucun lien entrant connu : passage inaccessible, sauf s'il est lancé par le moteur (début de chapitre, duel, temps libre)." });
      (n.choices || []).forEach((c, i) => { if (c && c.requires && Object.values(c.requires).some((v) => v > 999)) problems.push({ id, type: "locked", text: `Choix ${i + 1} : seuil impossible à atteindre.` }); });
    });
    return { entry, problems };
  });
}

/* ---------- fusion avec une version publiée plus récente ---------- */
export function rebaseOnto(remote) {
  const r = normalizeDraft(remote);
  const touched = M.draft.meta.touched || {};
  const out = normalizeDraft(r);
  Object.keys(touched).forEach((id) => {
    if (M.draft.nodes[id]) out.nodes[id] = clone(M.draft.nodes[id]); else delete out.nodes[id];
  });
  out.chapters = Object.assign({}, r.chapters, M.draft.chapters);
  out.meta = clone(M.draft.meta);
  out.meta.created = [...new Set([...(r.meta && r.meta.created || []), ...M.draft.meta.created])];
  out.baseRevision = r.revision || 0;
  out.revision = r.revision || 0;
  return out;
}
export function exportPatch() {
  const d = clone(M.draft);
  const p = { format: SCHEMA.FORMAT, version: SCHEMA.VERSION, revision: (d.baseRevision || 0) + 1, updatedAt: now(), nodes: d.nodes, chapters: d.chapters };
  return p;
}
export function validateDraft(patch) {
  return SCHEMA.validate(patch || exportPatch(), isKnownTarget);
}
export function diffSummary() {
  const rows = [];
  const ids = new Set([...Object.keys(M.draft.nodes), ...Object.keys(M.published.nodes)]);
  ids.forEach((id) => { if (!same(M.draft.nodes[id], M.published.nodes[id])) rows.push(id); });
  return rows;
}
