/* Sylvinia Studio · espace Chroniques Alternatives. */
import * as M from "./model.js";
import * as DB from "../db.js";
import * as X from "./extract.js";
import { h, clear, toast, modal, confirmBox, promptBox, debounce, autoGrow, fmtDate, download } from "../ui.js";

const app = document.getElementById("app");
const LS_BACKUP = "sylvinia_studio_ca_draft_backup_v1";
const HANDOFF = "sylvinia_studio_ca_preview_v1";
const TOKEN_KEY = "sylvinia_studio_github_v1";
const FILE_PATH = "studio/data/modifications-ca.js";
const CAT_LABEL = Object.fromEntries([...M.CATEGORIES.map((c) => [c[0], c[1]]), ["autres", "Autres contenus"]]);

const U = {
  tab: "chapitres", layout: "desktop", q: "", char: "", status: "all", openCats: ["temps-libres"],
  module: "", scene: -1, libview: "cats", sceneFilter: "", showAll: false, read: false,
  preview: { shown: true, mute: true, auto: true, sim: { source: "vierge", day: "", flags: "", dev: true, unlockAll: false, rel: {} } },
  seen: new Set(), hits: null,
};

/* ---------- dispositions (mêmes règles que le Mode Histoire) ---------- */
function computeLayout() { const w = innerWidth, hh = innerHeight; if (w < 700 || hh < 600) return "compact"; if (w >= 1280 && hh >= 700) return "desktop"; return "split"; }
function setTab(t) {
  U.tab = t; app.dataset.tab = t;
  document.querySelectorAll("#tabs button[data-tab]").forEach((b) => b.classList.toggle("active", b.dataset.tab === t));
  if (t === "apercu" || U.layout !== "compact") renderPreview();
  if (t === "branches") renderControls();
}
function applyLayout() {
  const l = computeLayout(); U.layout = l; app.dataset.layout = l;
  app.classList.toggle("portrait", innerHeight > innerWidth);
  if (l === "desktop" && (U.tab === "chapitres" || U.tab === "apercu")) U.tab = "ecriture";
  if (l === "split" && U.tab === "apercu") U.tab = "ecriture";
  app.classList.toggle("nopreview", l !== "compact" && !U.preview.shown);
  setTab(U.tab);
}
addEventListener("resize", debounce(applyLayout, 120));

/* ---------- persistance ---------- */
const saveState = document.getElementById("saveState");
let lastAuto = Date.now(), dirtySinceVersion = false;
function setStatus(t, cls) { saveState.textContent = t; saveState.className = "save-state " + (cls || ""); }
const saveDraft = debounce(async () => {
  try {
    await DB.put("ca-draft", M.C.draft);
    try { localStorage.setItem(LS_BACKUP, JSON.stringify(M.C.draft)); } catch {}
    setStatus("Enregistré " + new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }), "ok");
    if (dirtySinceVersion && Date.now() - lastAuto > 5 * 60 * 1000) { lastAuto = Date.now(); dirtySinceVersion = false; snapshotVersion("Sauvegarde automatique", true); }
  } catch (e) { setStatus("Échec d'enregistrement", "dirty"); toast("Enregistrement impossible : " + e.message, "error"); }
}, 450);
const saveUi = debounce(() => DB.put("ca-ui", { tab: U.tab, char: U.char, status: U.status, openCats: U.openCats, module: U.module, scene: U.scene, libview: U.libview, preview: U.preview, previewW: U.previewW, previewH: U.previewH }).catch(() => {}), 400);
addEventListener("beforeunload", () => { try { localStorage.setItem(LS_BACKUP, JSON.stringify(M.C.draft)); } catch {} });
async function snapshotVersion(label, auto = false) {
  await DB.addVersion({ kind: "ca", at: new Date().toISOString(), label, auto, count: Object.keys(M.C.draft.entries).length + Object.keys(M.C.draft.lists).length, draft: M.clone(M.C.draft) });
  await DB.pruneVersions(80, "ca");
}
let quiet = false;
M.onChange(() => {
  setStatus("Modifié…", "dirty"); dirtySinceVersion = true; saveDraft();
  updateUndo();
  if (U.preview.auto) pushPreviewSoon();
  if (!quiet) { renderLibrary(); renderEditor(); }
});
function updateUndo() { document.getElementById("btnUndo").disabled = !M.C.undo.length; document.getElementById("btnRedo").disabled = !M.C.redo.length; }

/* ---------- barre du haut ---------- */
function renderCrumbs() {
  const el = document.getElementById("crumbs"); clear(el);
  const meta = U.module ? M.moduleMeta(U.module) : null;
  if (!meta) { el.appendChild(h("span", null, "Chroniques Alternatives")); return; }
  el.appendChild(h("b", null, meta.label));
  const mod = M.C.mods.get(U.module);
  if (mod && U.scene >= 0 && mod.scenes[U.scene]) el.appendChild(h("span", null, " › " + sceneLabel(mod, U.scene)));
}
function sceneLabel(mod, i) { const s = mod.scenes[i]; if (!s) return ""; if (s.title) return s.title; if (s.key.startsWith("§")) return "Ensemble " + s.section; return s.key; }

/* ---------- catalogue ---------- */
function renderLibrary() {
  const root = document.getElementById("paneLibrary"); const keep = root.scrollTop; clear(root);
  root.appendChild(h("div", { class: "seg mode-switch", role: "tablist", "aria-label": "Espace du Studio" },
    h("button", { onclick: () => { location.href = "./"; } }, "Mode Histoire"),
    h("button", { class: "on", "aria-selected": "true" }, "Chroniques Alternatives")));
  if (U.libview === "scenes" && U.module && M.C.mods.get(U.module)) root.appendChild(scenesView());
  else root.appendChild(catsView());
  root.scrollTop = keep;
  renderCrumbs();
}
function modMatches(m) {
  if (U.char && !M.charactersOf(m.key).includes(U.char)) return false;
  if (U.status === "modifie" && M.moduleStatus(m.key) !== "modifie") return false;
  if (U.status === "touche" && M.moduleStatus(m.key) === "original") return false;
  const q = U.q.trim().toLowerCase();
  if (q && !(m.label.toLowerCase().includes(q) || m.key.includes(q))) return false;
  return true;
}
function catsView() {
  const search = h("input", { type: "search", placeholder: "Rechercher un module ou un texte…", value: U.q, "aria-label": "Recherche" });
  const list = h("div", { class: "lib-list" });
  const draw = () => {
    clear(list);
    if (U.hits) { list.appendChild(hitsView()); return; }
    const mods = M.C.index.modules.filter(modMatches);
    const cats = [...M.CATEGORIES.map((c) => c[0]), "autres"];
    let any = false;
    cats.forEach((ck) => {
      const ms = mods.filter((m) => M.categoriesOf(m.key).includes(ck));
      if (!ms.length) return; any = true;
      const open = U.openCats.includes(ck) || !!U.q || !!U.char;
      const nTexts = ms.reduce((a, m) => a + m.counts.s + m.counts.t, 0);
      const det = h("details", { class: "cat", open },
        h("summary", null, h("span", { class: "n" }, String(cats.indexOf(ck) + 1)), h("b", null, CAT_LABEL[ck]), h("span", { class: "muted small" }, `${ms.length} module(s) · ${nTexts} textes`)),
        h("div", { class: "mods" }, ms.map(modCard)));
      det.addEventListener("toggle", () => { U.openCats = det.open ? [...new Set([...U.openCats, ck])] : U.openCats.filter((x) => x !== ck); saveUi(); });
      list.appendChild(det);
    });
    if (!any) list.appendChild(h("div", { class: "empty" }, "Aucun module ne correspond."));
  };
  search.addEventListener("input", () => { U.q = search.value; U.hits = null; draw(); });
  search.addEventListener("keydown", (e) => { if (e.key === "Enter" && U.q.trim().length >= 3) globalSearch(U.q.trim(), draw); });
  const chars = h("select", { "aria-label": "Personnage" }, h("option", { value: "" }, "Tous les personnages"), M.CHARACTERS.map(([k, l]) => h("option", { value: k, selected: U.char === k }, l)));
  chars.addEventListener("change", () => { U.char = chars.value; saveUi(); draw(); });
  const st = h("select", { "aria-label": "État" }, [["all", "Tous les états"], ["modifie", "Modifiés (non publiés)"], ["touche", "Modifiés ou publiés"]].map(([v, l]) => h("option", { value: v, selected: U.status === v }, l)));
  st.addEventListener("change", () => { U.status = st.value; saveUi(); draw(); });
  draw();
  const total = M.C.index.modules.reduce((a, m) => a + m.counts.s + m.counts.t, 0);
  return h("div", { class: "lib" },
    h("div", { class: "lib-head" },
      h("div", { class: "row" }, h("h2", null, "Catalogue"), h("span", { class: "muted small" }, `${M.C.index.modules.length} modules · ${total} textes réels`)),
      h("div", { class: "row" }, search),
      h("div", { class: "row" }, h("button", { class: "small", disabled: false, onclick: () => { if (U.q.trim().length < 3) { toast("Saisissez au moins 3 lettres."); return; } globalSearch(U.q.trim(), draw); } }, "Rechercher dans tous les textes")),
      h("div", { class: "row" }, chars, st)),
    list);
}
function modCard(m) {
  const stt = M.moduleStatus(m.key);
  const open = () => openModule(m.key);
  return h("div", { class: "mod" + (m.key === U.module ? " active" : ""), role: "button", tabindex: "0", onclick: open, onkeydown: (e) => { if (e.key === "Enter") open(); } },
    h("div", { class: "t" }, m.label),
    h("div", { class: "muted small" }, `${m.scenes} scènes · ${m.counts.s + m.counts.t} textes · ${m.counts.n} seuils et effets`, stt !== "original" ? " · " : "", stt === "modifie" ? h("span", { class: "badge modifie" }, "Modifié") : stt === "publie" ? h("span", { class: "badge publie" }, "Publié") : null),
    m.collections.length ? h("div", { class: "acts" }, h("button", { class: "small", onclick: (e) => { e.stopPropagation(); createIn(m.key); } }, "+ Créer")) : null);
}
async function globalSearch(q, redraw) {
  const ql = q.toLowerCase();
  toast("Recherche dans tous les textes…");
  await M.loadAll();
  const hits = [];
  for (const m of M.C.mods.values()) {
    for (const it of m.items) {
      if (it.k === "n") continue;
      const v = String(M.value(it));
      if (v.toLowerCase().includes(ql) || it.id === q) { hits.push({ m, it, v }); if (hits.length >= 300) break; }
    }
    if (hits.length >= 300) break;
  }
  for (const [lid, l] of Object.entries(M.C.draft.lists)) l.insert.forEach((x) => { if (JSON.stringify(x.item).toLowerCase().includes(ql)) hits.push({ m: M.C.mods.get(M.moduleOf(lid)), added: { lid, x }, v: (M.textsOf(x.item).find(([, t]) => t.toLowerCase().includes(ql)) || ["", ""])[1] }); });
  U.hits = { q, hits }; redraw();
}
function hitsView() {
  const { q, hits } = U.hits;
  return h("div", { class: "rows" },
    h("div", { class: "row" }, h("b", null, `${hits.length}${hits.length >= 300 ? "+" : ""} résultat(s) pour « ${q} »`), h("button", { class: "small", onclick: () => { U.hits = null; renderLibrary(); } }, "Fermer")),
    hits.map(({ m, it, v, added }) => h("div", { class: "hit", role: "button", tabindex: "0", onclick: async () => { const a = added ? M.findItem(added.lid) : null; await openModule(m.module, added ? (a ? a.sc : -1) : it.sc, added ? added.lid : it.id); } },
      h("div", { class: "where" }, `${m.label} › ${added ? "élément ajouté" : sceneLabel(m, it.sc)}${it && it.sp ? " · " + it.sp : ""}`),
      h("div", { class: "snip" }, snippet(v, q)))));
}
function snippet(v, q) { const i = v.toLowerCase().indexOf(q.toLowerCase()); if (i < 0) return v.slice(0, 160); const a = Math.max(0, i - 60); return (a ? "… " : "") + v.slice(a, i + q.length + 90) + (i + q.length + 90 < v.length ? " …" : ""); }

async function openModule(key, scene = -1, focusId = "") {
  try { await M.loadModule(key); } catch (e) { toast("Module illisible : " + e.message, "error"); return; }
  U.module = key; U.libview = "scenes"; U.sceneFilter = "";
  if (scene >= 0) { U.scene = scene; if (U.layout !== "desktop") setTab("ecriture"); }
  else U.scene = -1;
  U.focus = focusId;
  saveUi(); renderLibrary(); renderEditor();
}
function scenesView() {
  const mod = M.C.mods.get(U.module);
  const filter = h("input", { type: "search", placeholder: "Filtrer les scènes…", value: U.sceneFilter, "aria-label": "Filtrer les scènes" });
  const list = h("div", { class: "scenes" });
  const draw = () => {
    clear(list);
    const q = U.sceneFilter.trim().toLowerCase();
    mod.scenes.forEach((s, i) => {
      if (!s.used) return;
      const items = mod.sceneItems[i]; const arrs = mod.sceneArrays[i];
      if (q && !(sceneLabel(mod, i).toLowerCase().includes(q) || s.key.toLowerCase().includes(q) || items.some((it) => String(M.value(it)).toLowerCase().includes(q)))) return;
      const nT = items.filter((it) => it.k !== "n").length, nN = items.length - nT;
      const edited = items.some((it) => M.status(it.id) !== "original") || arrs.some((a) => M.status(a.id) !== "original");
      const pick = () => { U.scene = i; U.focus = ""; saveUi(); renderLibrary(); renderEditor(); if (U.layout !== "desktop") setTab("ecriture"); };
      list.appendChild(h("div", { class: "scene-item" + (i === U.scene ? " active" : ""), role: "button", tabindex: "0", onclick: pick, onkeydown: (e) => { if (e.key === "Enter") pick(); } },
        h("span", { class: "idx" }, String(i + 1)),
        h("div", null, h("div", { class: "st" }, sceneLabel(mod, i)), h("div", { class: "sm" }, `${s.key.startsWith("§") ? s.section : s.key} · ${nT} textes${nN ? ` · ${nN} nombres` : ""}${arrs.length ? ` · ${arrs.length} listes` : ""}`)),
        h("div", { class: "bd" }, edited ? h("span", { class: "badge modifie" }, "modifiée") : null)));
    });
    if (!list.childNodes.length) list.appendChild(h("div", { class: "empty" }, "Aucune scène ne correspond."));
  };
  filter.addEventListener("input", () => { U.sceneFilter = filter.value; draw(); });
  draw();
  return h("div", { class: "lib" },
    h("div", { class: "lib-head" },
      h("div", { class: "row" }, h("button", { class: "small", onclick: () => { U.libview = "cats"; saveUi(); renderLibrary(); } }, "← Catalogue"), h("h2", null, mod.label)),
      h("div", { class: "muted small" }, `${mod.file} · groupe : ${mod.group}`),
      h("div", { class: "row" }, filter),
      mod.arrays.some((a) => a.top) ? h("div", { class: "row" }, h("button", { class: "small", onclick: () => createIn(mod.module) }, "+ Créer un contenu dans ce module")) : null),
    list);
}

/* ---------- écriture ---------- */
function renderEditor() {
  const root = document.getElementById("paneEcriture"); const keep = root.scrollTop; clear(root);
  const mod = U.module ? M.C.mods.get(U.module) : null;
  renderCrumbs();
  if (!mod || U.scene < 0 || !mod.scenes[U.scene]) {
    root.appendChild(h("div", { class: "empty" }, "Choisissez un module puis une scène dans le catalogue.", U.layout === "desktop" ? null : h("div", null, h("button", { class: "gold", style: { marginTop: "14px" }, onclick: () => setTab("chapitres") }, "Ouvrir le catalogue"))));
    return;
  }
  const s = mod.scenes[U.scene];
  const items = mod.sceneItems[U.scene], arrs = mod.sceneArrays[U.scene];
  root.appendChild(h("div", { class: "scene-head" },
    h("div", { class: "muted small" }, `${mod.label} · ${s.key.startsWith("§") ? "ensemble " + s.section : "identifiant " + s.key}`),
    h("div", { class: "title-row" }, h("h3", { style: { margin: "0", fontFamily: "var(--serif)", fontSize: "22px", flex: "1" } }, sceneLabel(mod, U.scene)),
      h("button", { class: "small" + (U.read ? " on" : ""), onclick: () => { U.read = !U.read; renderEditor(); } }, "Lecture"),
      h("button", { class: "gold", onclick: () => { pushPreview(true); setTab(U.layout === "compact" ? "apercu" : U.tab); if (U.layout !== "compact" && !U.preview.shown) { U.preview.shown = true; applyLayout(); } } }, "▶ Tester dans le jeu"))));
  if (U.read) { root.appendChild(readView(items)); return; }
  const seq = [...items.map((it) => ({ line: it.line, it })), ...arrs.map((a) => ({ line: a.line - 0.5, a }))].sort((x, y) => x.line - y.line);
  const limit = U.showAll ? seq.length : 260;
  const wrap = h("div", { class: "lines" });
  seq.slice(0, limit).forEach((x) => wrap.appendChild(x.it ? (x.it.k === "n" ? numRow(x.it) : textCard(x.it)) : listBox(x.a, mod)));
  root.appendChild(wrap);
  if (seq.length > limit) root.appendChild(h("button", { class: "small", onclick: () => { U.showAll = true; renderEditor(); } }, `Afficher les ${seq.length - limit} éléments suivants`));
  if (U.focus) { const el = root.querySelector(`[data-id="${CSS.escape(U.focus)}"]`); if (el) { el.scrollIntoView({ block: "center" }); el.classList.add("sel"); } U.focus = ""; }
  else root.scrollTop = keep;
}
function who(it) { return it.sp ? (it.sp === "{player}" ? "Vous" : it.sp) : ""; }
const ROLE = { text: "réplique", title: "titre", description: "description", prompt: "ouverture", label: "libellé", choix: "réponse proposée", playerLine: "réplique du joueur", name: "nom", detail: "détail", summary: "résumé", opening: "ouverture", closing: "clôture", intro: "introduction" };
function roleLabel(it) { return ROLE[it.role] || it.role || "texte"; }
function textCard(it) {
  const v = String(M.value(it)); const st = M.status(it.id);
  const ta = h("textarea", { rows: 2, "aria-label": "Texte", spellcheck: "true" }); ta.value = v;
  ta.addEventListener("input", () => { quiet = true; M.setValue(it, ta.value); quiet = false; autoGrow(ta); badge.textContent = M.isEdited(it) ? "Modifié" : ""; renderLibrarySoon(); });
  ta.addEventListener("blur", () => { renderLibrary(); });
  setTimeout(() => autoGrow(ta), 0);
  const badge = h("span", { class: "badge modifie", style: { display: M.isEdited(it) ? "" : "none" } }, "Modifié");
  const card = h("div", { class: "line" + (it.sp === "Narration" ? " narr" : ""), "data-id": it.id },
    h("div", { class: "line-head" },
      who(it) ? h("b", { class: "speaker", style: { color: "var(--gold2)", fontFamily: "var(--serif)", fontSize: "16px" } }, who(it)) : null,
      h("span", { class: "muted small" }, roleLabel(it)),
      h("span", { class: "spacer", style: { flex: "1" } }),
      U.seen.has(it.id) ? h("span", { class: "seen" }, "vu dans l'aperçu ✓") : null,
      st === "publie" ? h("span", { class: "badge publie" }, "Publié") : null, badge,
      h("code", { class: "code" }, it.id.split(":")[1])),
    ta,
    it.k === "t" ? h("div", { class: "ph" }, h("span", { class: "muted small" }, "Repères à garder :"), (it.vals || []).map((e, i) => h("code", { title: e }, `{${i + 1}} = ${e.length > 40 ? e.slice(0, 40) + "…" : e}`))) : null,
    M.isEdited(it) ? h("details", null, h("summary", { class: "small muted" }, "Texte d'origine"), h("div", { class: "orig" }, it.text),
      h("button", { class: "small", onclick: () => M.resetValue(it.id) }, "Rétablir l'original")) : null);
  badge.style.display = M.isEdited(it) ? "" : "none";
  return card;
}
const renderLibrarySoon = debounce(() => renderLibrary(), 600);
function numRow(it) {
  const inp = h("input", { type: "number", step: "1", value: String(M.value(it)), "aria-label": it.role });
  inp.addEventListener("change", () => { if (inp.value === "" || !isFinite(Number(inp.value))) { inp.value = String(M.value(it)); return; } M.setValue(it, Number(inp.value)); });
  const [kind, ...rest] = String(it.role || "").split(" ");
  return h("div", { class: "numrow", "data-id": it.id },
    h("span", { class: "lab" }, h("b", null, kind === "condition" ? "Seuil" : "Effet"), ` ${rest.join(" ").replace("effects.", "").replace("stats.", "statistique ")}`, it.sp ? ` · ${it.sp}` : ""),
    inp, M.isEdited(it) ? h("span", { class: "muted small" }, `origine ${it.text}`) : null,
    M.isEdited(it) ? h("button", { class: "small", onclick: () => M.resetValue(it.id) }, "Rétablir") : null);
}
function readView(items) {
  return h("div", { class: "readmode" }, items.filter((it) => it.k !== "n").map((it) => h("div", { class: "rl" }, h("b", null, who(it) || roleLabel(it)), h("p", null, String(M.value(it)).replace(/\{(\d+)\}/g, "…")))),
    h("div", { class: "muted small" }, "Lecture rapide dans le Studio. Pour le rendu réel, utilisez « Tester dans le jeu »."));
}

/* Listes : ajouter (copie d'un élément réel), masquer, modifier les ajouts */
function listBox(a, mod) {
  const ops = M.listOps(a.id);
  const what = a.kind === "paras" ? "paragraphe(s)" : "élément(s)";
  const box = h("div", { class: "listbox", "data-id": a.id },
    h("div", { class: "hd" },
      h("span", { class: "grow" }, `Liste · ${a.len} ${what}${ops.insert.length ? ` · ${ops.insert.length} ajouté(s)` : ""}${ops.hide.length ? ` · ${ops.hide.length} masqué(s)` : ""}`, h("div", { class: "muted small" }, a.path)),
      h("button", { class: "small", onclick: () => addToList(a) }, a.kind === "paras" ? "+ Paragraphe" : "+ Ajouter"),
      !a.top ? h("button", { class: "small", onclick: () => manageHidden(a, mod) }, "Masquer…") : null));
  ops.insert.forEach((x) => box.appendChild(addedCard(a, x)));
  return box;
}
async function addToList(a) {
  let data;
  try { toast("Lecture de la liste dans le jeu…"); data = (await X.getLists([a.id]))[a.id]; } catch (e) { toast("Lecture impossible : " + e.message, "error"); return; }
  if (!Array.isArray(data) || !data.length) { toast("Cette liste n'a pas pu être lue dans le jeu.", "error"); return; }
  const models = data.map((x, i) => ({ i, x, label: describe(x, i) }));
  const sel = h("select", { "aria-label": "Modèle" }, models.map((m) => h("option", { value: m.i }, m.label)));
  const pos = h("select", { "aria-label": "Position" }, h("option", { value: a.len }, "À la fin"), h("option", { value: 0 }, "Au début"), Array.from({ length: a.len - 1 }, (_, i) => h("option", { value: i + 1 }, `Après l'élément ${i + 1}`)));
  const body = h("div", { class: "rows" },
    h("div", { class: "muted small" }, "Le nouvel élément reprend la structure exacte d'un élément existant (personnage, statistiques, effets), avec un nouvel identifiant. Vous réécrivez ensuite ses textes."),
    h("label", { class: "field" }, h("span", null, "Partir de"), sel), h("label", { class: "field" }, h("span", null, "Position"), pos));
  modal("Ajouter un élément", body, [{ label: "Annuler" }, { label: "Ajouter", class: "gold", onclick: () => {
    const model = data[Number(sel.value)];
    const { item, hasFn } = M.cloneForInsert(model);
    if (hasFn) toast("Une partie calculée par le code n'a pas été reprise dans la copie.", "error");
    M.insertItem(a.id, Number(pos.value), item);
    toast("Élément ajouté. Réécrivez ses textes ci-dessous.");
  } }]);
}
function describe(x, i) {
  if (typeof x === "string") return `${i + 1}. ${x.slice(0, 70)}`;
  if (!x || typeof x !== "object") return `${i + 1}.`;
  const t = x.title || x.label || x.text || x.prompt || x.name || "";
  return `${i + 1}. ${x.id ? x.id + " · " : ""}${x.speaker ? x.speaker + " : " : ""}${String(t).slice(0, 70)}`;
}
function manageHidden(a, mod) {
  const ops = M.listOps(a.id);
  const snippets = a.els.map(([l0, l1], i) => { const its = mod.items.filter((it) => it.line >= l0 && it.line <= l1 && it.k !== "n"); return `${i + 1}. ${its.length ? (its[0].sp ? its[0].sp + " : " : "") + String(M.value(its[0])).slice(0, 80) : "(contenu calculé)"}`; });
  const body = h("div", { class: "list" }, snippets.map((sn, i) => h("div", { class: "it" }, h("span", { class: "grow small" }, sn),
    h("button", { class: "small" + (ops.hide.includes(i) ? " on" : ""), onclick: (e) => { M.toggleHide(a.id, i); e.target.classList.toggle("on"); e.target.textContent = M.listOps(a.id).hide.includes(i) ? "Masqué" : "Masquer"; } }, ops.hide.includes(i) ? "Masqué" : "Masquer"))));
  modal("Masquer des éléments", h("div", { class: "rows" }, h("div", { class: "muted small" }, "Un élément masqué n'apparaît plus dans le jeu, sans être supprimé du code : vous pouvez le rétablir à tout moment."), body), [{ label: "Fermer" }]);
}
function addedCard(a, x) {
  const save = (item) => { quiet = true; M.updateInserted(a.id, x.uid, item); quiet = false; renderLibrarySoon(); };
  const atSel = h("select", { "aria-label": "Position", class: "small" }, h("option", { value: a.len, selected: !(x.at < a.len) }, "à la fin"), h("option", { value: 0, selected: x.at === 0 }, "au début"), Array.from({ length: Math.max(0, a.len - 1) }, (_, i) => h("option", { value: i + 1, selected: x.at === i + 1 }, `après ${i + 1}`)));
  atSel.addEventListener("change", () => M.moveInserted(a.id, x.uid, Number(atSel.value)));
  return h("div", { class: "added", "data-id": a.id + "#" + x.uid },
    h("div", { class: "hd" }, h("span", { class: "badge publie", style: { borderColor: "rgba(159,214,160,.6)" } }, "Ajouté"), h("b", { class: "small", style: { flex: "1" } }, x.item && x.item.id ? x.item.id : "nouvel élément"), atSel,
      h("button", { class: "small danger", onclick: async () => { if (await confirmBox("Retirer l'élément ajouté", "Retirer cet élément de votre brouillon ?", "Retirer", true)) M.removeInserted(a.id, x.uid); } }, "Retirer")),
    jsonEditor(x.item, save));
}
const TEXT_KEYS = /^(text|title|prompt|label|description|detail|summary|playerLine|intro|outro|name|body|subject|hint|teaser|reply|line|opening|closing|note|journal|result)$/i;
function jsonEditor(root, onChange) {
  const data = M.clone(root);
  const fire = debounce(() => onChange(M.clone(data)), 250);
  const field = (obj, key, path, depth) => {
    const v = obj[key];
    const lab = typeof key === "number" ? `${key + 1}` : key;
    if (typeof v === "string") {
      const prose = TEXT_KEYS.test(String(key)) || /\s/.test(v);
      const el = prose ? h("textarea", { rows: 2 }) : h("input", { type: "text", style: { width: "100%" } });
      el.value = v;
      el.addEventListener("input", () => { obj[key] = el.value; if (prose) autoGrow(el); fire(); });
      if (prose) setTimeout(() => autoGrow(el), 0);
      return h("label", { class: "f" }, h("span", null, path || lab, !prose && /id$|flag/i.test(String(key)) ? " (identifiant interne)" : ""), el);
    }
    if (typeof v === "number") { const el = h("input", { type: "number", value: String(v) }); el.addEventListener("change", () => { const n = Number(el.value); if (isFinite(n)) { obj[key] = n; fire(); } }); return h("label", { class: "f" }, h("span", null, path || lab), el); }
    if (typeof v === "boolean") { const el = h("input", { type: "checkbox", checked: v }); el.addEventListener("change", () => { obj[key] = el.checked; fire(); }); return h("label", { class: "kv small" }, el, path || lab); }
    if (Array.isArray(v) && v.every((s) => typeof s === "string" && !/\s/.test(s))) {
      const el = h("input", { type: "text", value: v.join(", "), style: { width: "100%" } });
      el.addEventListener("change", () => { obj[key] = el.value.split(",").map((s) => s.trim()).filter(Boolean); fire(); });
      return h("label", { class: "f" }, h("span", null, (path || lab) + " (liste, séparée par des virgules)"), el);
    }
    if (v && typeof v === "object" && depth < 7) {
      const fs = h("fieldset", null, h("legend", null, path || lab));
      const keys = Array.isArray(v) ? v.map((_, i) => i) : Object.keys(v);
      keys.forEach((k) => fs.appendChild(field(v, k, "", depth + 1)));
      if (Array.isArray(v) && v.length && typeof v[v.length - 1] === "object") {
        fs.appendChild(h("div", { class: "toolbar" },
          h("button", { class: "small", onclick: () => { const c = M.cloneForInsert(v[v.length - 1]).item; v.push(c); fire(); onChange(M.clone(data)); } }, "+ Dupliquer le dernier"),
          v.length > 1 ? h("button", { class: "small", onclick: () => { v.pop(); onChange(M.clone(data)); } }, "Retirer le dernier") : null));
      }
      return fs;
    }
    return h("div", { class: "muted small" }, `${path || lab} : ${v === null ? "vide" : "valeur calculée, non modifiable"}`);
  };
  const wrapEl = h("div", { class: "jed" });
  if (typeof data === "string") {
    const ta = h("textarea", { rows: 3 }); ta.value = data;
    ta.addEventListener("input", () => { autoGrow(ta); onChangeSoon(ta.value); });
    const onChangeSoon = debounce((t) => onChange(t), 250);
    wrapEl.appendChild(ta); return wrapEl;
  }
  if (data && typeof data === "object") Object.keys(data).forEach((k) => wrapEl.appendChild(field(data, k, "", 0)));
  return wrapEl;
}

/* Créer un contenu dans une collection réelle du jeu */
async function createIn(key) {
  const mod = await M.loadModule(key);
  const cols = mod.arrays.filter((a) => a.top && a.kind === "items");
  if (!cols.length) { toast("Ce module n'a pas de collection où ajouter un contenu."); return; }
  const sel = h("select", { "aria-label": "Collection" }, cols.map((a) => h("option", { value: a.id }, `${a.path} (${a.len} éléments)`)));
  const body = h("div", { class: "rows" },
    h("div", { class: "muted small" }, "Le nouveau contenu est ajouté à une collection que le jeu parcourt déjà : il apparaît dès que ses conditions sont remplies (jour, lieu, relation, drapeaux), comme les contenus d'origine."),
    h("label", { class: "field" }, h("span", null, "Collection"), sel));
  modal("Créer un contenu", body, [{ label: "Annuler" }, { label: "Choisir un modèle", class: "gold", onclick: async () => {
    const a = cols.find((c) => c.id === sel.value);
    U.module = key; U.libview = "scenes"; U.scene = a.sc; U.focus = a.id; saveUi(); renderLibrary(); renderEditor(); if (U.layout !== "desktop") setTab("ecriture");
    await addToList(a);
  } }]);
}

/* ---------- contrôles ---------- */
async function renderControls() {
  const root = document.getElementById("paneBranches"); clear(root);
  root.appendChild(h("div", { class: "muted" }, "Vérification en cours…"));
  const v = await M.validate();
  clear(root);
  const go = async (id) => { const a = M.findItem(id) || M.findItem(id.split("#")[0]); if (!a) { toast("Élément introuvable dans le catalogue actuel."); return; } await openModule(M.moduleOf(id), a.sc, id); setTab("ecriture"); };
  const row = (x, cls) => h("div", { class: "problem" + (cls ? " " + cls : ""), role: "button", tabindex: "0", onclick: () => go(x.id) }, h("b", null, x.id), h("div", { class: "small" }, x.msg));
  root.appendChild(h("h3", null, "Contrôle de cohérence"));
  root.appendChild(h("div", { class: "msg " + (v.ok ? "ok" : "err") }, v.ok ? "Aucune erreur bloquante. La publication est possible." : `${v.errors.length} erreur(s) bloquent la publication.`));
  if (v.errors.length) root.appendChild(h("div", { class: "problems" }, v.errors.map((x) => row(x, "bad"))));
  if (v.warnings.length) root.appendChild(h("details", { open: true }, h("summary", null, `${v.warnings.length} avertissement(s)`), h("div", { class: "problems" }, v.warnings.map((x) => row(x)))));
  if (v.infos.length) root.appendChild(h("details", null, h("summary", null, `${v.infos.length} remarque(s)`), h("div", { class: "problems" }, v.infos.map((x) => row(x, "orphan")))));
  const diff = M.diffIds();
  root.appendChild(h("h3", null, `Modifications non publiées (${diff.length})`));
  root.appendChild(diff.length ? h("div", { class: "list" }, diff.slice(0, 400).map((id) => { const it = M.findItem(id); const lists = M.C.draft.lists[id]; return h("div", { class: "it" }, h("span", { class: "grow small", role: "button", tabindex: "0", onclick: () => go(id) }, h("b", null, (M.moduleMeta(M.moduleOf(id)) || { label: M.moduleOf(id) }).label), " · ", lists || (it && it.path) ? `liste ${it ? it.path : id}${lists ? ` (${lists.insert.length} ajout(s), ${lists.hide.length} masqué(s))` : ""}` : it ? String(M.value(it)).slice(0, 90) : id),
      h("button", { class: "small", title: "Revenir à la version publiée", onclick: () => { revertToPublished(id); renderControls(); } }, "Annuler")); })) : h("div", { class: "empty" }, "Rien à publier pour l'instant."));
  /* références croisées */
  const q = h("input", { type: "search", placeholder: "Identifiant, drapeau ou mot", style: { flex: "1" } });
  const out = h("div", { class: "list" });
  const search = async () => {
    const t = q.value.trim(); clear(out); if (t.length < 3) return;
    out.appendChild(h("div", { class: "muted small" }, "Recherche…"));
    await M.loadAll();
    clear(out);
    let n = 0;
    for (const m of M.C.mods.values()) {
      const inPath = m.arrays.filter((a) => a.path.includes(t)).map((a) => ({ id: a.id, sc: a.sc, txt: "liste " + a.path }));
      const inScene = m.scenes.map((s, i) => ({ s, i })).filter(({ s }) => s.key === t || s.key.includes(t)).map(({ s, i }) => ({ id: "", sc: i, txt: "scène " + s.key }));
      [...inScene, ...inPath].forEach((r) => { if (n++ < 200) out.appendChild(h("div", { class: "it", role: "button", tabindex: "0", onclick: () => openModule(m.module, r.sc, r.id).then(() => setTab("ecriture")) }, h("span", { class: "grow small" }, h("b", null, m.label), " · ", r.txt))); });
    }
    Object.entries(M.C.draft.lists).forEach(([lid, l]) => l.insert.forEach((x) => { if (JSON.stringify(x.item).includes(t) && n++ < 200) out.appendChild(h("div", { class: "it" }, h("span", { class: "grow small" }, h("b", null, "Ajout du brouillon"), " · ", (x.item && x.item.id) || lid))); }));
    if (!n) out.appendChild(h("div", { class: "empty" }, "Aucune référence trouvée dans les identifiants de scènes, les listes et vos ajouts."));
  };
  q.addEventListener("keydown", (e) => { if (e.key === "Enter") search(); });
  root.appendChild(h("h3", null, "Références croisées"));
  root.appendChild(h("div", { class: "rowx" }, q, h("button", { class: "small", onclick: search }, "Chercher")));
  root.appendChild(out);
}

function revertToPublished(id) {
  const P = M.C.published;
  M.transaction("Revenir à la version publiée", (d) => {
    if (id in P.entries) d.entries[id] = P.entries[id]; else delete d.entries[id];
    if (P.lists[id]) d.lists[id] = M.clone(P.lists[id]); else delete d.lists[id];
  });
}

/* ---------- aperçu dans le vrai jeu ---------- */
let previewFrame = null;
function buildSave() {
  const sim = U.preview.sim;
  let game = null;
  if (sim.source === "copie") { try { game = JSON.parse(localStorage.getItem("sylvinia-liens-autosave") || "null"); } catch { game = null; } if (!game) toast("Aucune partie enregistrée sur cet appareil : l'aperçu démarre sans sauvegarde.", "error"); }
  else if (sim.source === "fichier" && sim.file) { try { game = JSON.parse(sim.file); } catch { game = null; } }
  if (!game) return null;
  game = M.clone(game);
  if (sim.day !== "" && isFinite(Number(sim.day))) game.day = Math.max(1, Number(sim.day));
  if (sim.flags) { const add = sim.flags.split(",").map((f) => f.trim()).filter(Boolean); game.flags = [...new Set([...(game.flags || []), ...add])]; }
  game.settings = Object.assign({}, game.settings || {}, { developer: !!sim.dev, unlockAll: !!sim.unlockAll });
  if (game.relationships) Object.entries(sim.rel || {}).forEach(([c, r]) => { if (!game.relationships[c]) return; ["affection", "trust", "desire", "stage"].forEach((k) => { if (r[k] !== "" && r[k] != null && isFinite(Number(r[k]))) { game.relationships[c][k] = Number(r[k]); if (k !== "stage") game.relationships[c].met = true; } }); });
  return JSON.stringify(game);
}
function handoff() { return { patch: M.exportPatch(), save: buildSave(), mute: U.preview.mute, at: Date.now() }; }
function pushPreview(force) {
  try { localStorage.setItem(HANDOFF, JSON.stringify(handoff())); } catch (e) { toast("Aperçu : stockage plein (" + e.message + ")", "error"); return; }
  if (previewFrame && (force || U.preview.auto)) previewFrame.src = "../chronique-alternative/index.html?studio=preview&t=" + Date.now();
  else if (force) renderPreview(true);
}
const pushPreviewSoon = debounce(() => { if (previewFrame) pushPreview(false); }, 2500);
addEventListener("message", (ev) => {
  if (ev.origin !== location.origin || !ev.data) return;
  if (ev.data.type === "sylvinia-studio-ca:seen" && !U.seen.has(ev.data.id)) { U.seen.add(ev.data.id); const el = document.querySelector(`[data-id="${CSS.escape(ev.data.id)}"] .line-head .spacer`); if (el) el.after(h("span", { class: "seen" }, "vu dans l'aperçu ✓")); }
});
function renderPreview(start) {
  const root = document.getElementById("panePreview");
  if (root.dataset.built === "1" && !start) return;
  root.dataset.built = "1"; clear(root);
  const sim = U.preview.sim;
  const simBox = h("div", { class: "pv-sim hidden" });
  const fill = () => {
    clear(simBox);
    const src = h("select", { "aria-label": "Partie de test" }, [["vierge", "Nouvelle partie (aucune sauvegarde)"], ["copie", "Copie de ma partie (lecture seule)"], ["fichier", "Sauvegarde importée (.json)"]].map(([v, l]) => h("option", { value: v, selected: sim.source === v }, l)));
    src.addEventListener("change", () => { sim.source = src.value; saveUi(); fill(); });
    const file = h("input", { type: "file", accept: ".json,application/json" });
    file.addEventListener("change", async () => { const f = file.files[0]; if (!f) return; sim.file = await f.text(); toast("Sauvegarde de test chargée (gardée dans le Studio seulement)."); saveUi(); });
    const day = h("input", { type: "number", min: "1", value: sim.day, placeholder: "inchangé" }); day.addEventListener("change", () => { sim.day = day.value; saveUi(); });
    const flags = h("input", { type: "text", value: sim.flags, placeholder: "drapeau-a, drapeau-b", style: { width: "100%" } }); flags.addEventListener("change", () => { sim.flags = flags.value; saveUi(); });
    const dev = h("input", { type: "checkbox", checked: sim.dev }); dev.addEventListener("change", () => { sim.dev = dev.checked; saveUi(); });
    const ul = h("input", { type: "checkbox", checked: sim.unlockAll }); ul.addEventListener("change", () => { sim.unlockAll = ul.checked; saveUi(); });
    const grid = h("div", { class: "stats-grid" }, M.CHARACTERS.map(([c, l]) => {
      const r = sim.rel[c] || (sim.rel[c] = { affection: "", trust: "", desire: "", stage: "" });
      const inp = (k, ph) => { const x = h("input", { type: "number", value: r[k], placeholder: ph, title: ph, style: { width: "60px" } }); x.addEventListener("change", () => { r[k] = x.value; saveUi(); }); return x; };
      return h("label", null, h("span", { class: "small" }, l), inp("affection", "Affection"), inp("trust", "Confiance"), inp("desire", "Désir"), inp("stage", "Stade"));
    }));
    simBox.append(
      h("div", { class: "muted small" }, "État de test isolé : l'aperçu ne lit ni n'écrit vos vraies sauvegardes. Une copie de votre partie est seulement lue, puis modifiée en mémoire."),
      h("label", { class: "field" }, h("span", null, "Partie de test"), src), sim.source === "fichier" ? file : null,
      h("div", { class: "rowx" }, h("label", { class: "field" }, h("span", null, "Jour"), day), h("label", { class: "kv small" }, dev, "Mode développeur"), h("label", { class: "kv small" }, ul, "Tout déverrouiller")),
      h("label", { class: "field" }, h("span", null, "Drapeaux ajoutés"), flags),
      h("div", { class: "muted small" }, "Relations (vide = inchangé) : affection, confiance, désir, stade"), grid,
      h("div", { class: "toolbar" }, h("button", { class: "gold", onclick: () => { simBox.classList.add("hidden"); pushPreview(true); } }, "Appliquer et relancer")));
  };
  fill();
  const frameBox = h("div", { class: "pv-frame" });
  const startBtn = h("button", { class: "gold", onclick: () => { pushPreview(true); } }, "▶ Lancer l'aperçu");
  if (start || previewFrame) {
    previewFrame = h("iframe", { title: "Aperçu de la Chronique Alternative", src: "../chronique-alternative/index.html?studio=preview&t=" + Date.now(), allow: "autoplay; fullscreen" });
    frameBox.appendChild(previewFrame);
  } else frameBox.appendChild(h("div", { class: "pv-empty" }, h("p", null, "Le vrai jeu, avec votre brouillon, dans un état de test isolé."), startBtn));
  const mute = h("button", { class: "small" + (U.preview.mute ? " on" : ""), onclick: () => { U.preview.mute = !U.preview.mute; mute.classList.toggle("on", U.preview.mute); mute.textContent = U.preview.mute ? "Son coupé" : "Son actif"; saveUi(); } }, U.preview.mute ? "Son coupé" : "Son actif");
  const auto = h("button", { class: "small" + (U.preview.auto ? " on" : ""), title: "Relancer l'aperçu après chaque modification", onclick: () => { U.preview.auto = !U.preview.auto; auto.classList.toggle("on", U.preview.auto); saveUi(); } }, "Auto");
  root.append(
    h("div", { class: "pv-bar" },
      h("button", { class: "gold small", onclick: () => pushPreview(true) }, "▶ Relancer"),
      h("button", { class: "small", onclick: () => simBox.classList.toggle("hidden") }, "État de test"), auto, mute,
      h("span", { class: "grow" }),
      h("button", { class: "small", onclick: () => { localStorage.setItem(HANDOFF, JSON.stringify(handoff())); open("../chronique-alternative/index.html?studio=preview&t=" + Date.now(), "_blank", "noopener"); } }, "Plein écran ↗"),
      U.layout === "compact" ? h("button", { class: "small", onclick: () => setTab("ecriture") }, "← Écriture") : null),
    simBox, frameBox);
}

/* ---------- publier, importer, versions ---------- */
function stamp() { const d = new Date(); const p = (n) => String(n).padStart(2, "0"); return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}`; }
async function openPublish() {
  const v = await M.validate();
  const patch = M.exportPatch();
  const nE = Object.keys(patch.entries).length, nL = Object.keys(patch.lists).length;
  const body = h("div", { class: "rows" },
    h("div", { class: "msg " + (v.ok ? "ok" : "err") }, v.ok ? `Validation réussie : ${nE} texte(s) ou nombre(s) et ${nL} liste(s) diffèrent du jeu d'origine.` : `${v.errors.length} erreur(s) bloquent la publication (le brouillon reste enregistré). Voir l'onglet Contrôles.`),
    v.warnings.length ? h("div", { class: "msg warn" }, `${v.warnings.length} avertissement(s) : voir l'onglet Contrôles.`) : null,
    h("h3", null, "1. Exporter"),
    h("div", { class: "toolbar" },
      h("button", { class: "gold", disabled: !v.ok, onclick: () => download("modifications-ca.js", M.gameFileText(patch), "text/javascript") }, "Exporter pour le jeu (modifications-ca.js)"),
      h("button", { onclick: () => download(`sylvinia-studio-ca-${stamp()}.json`, JSON.stringify({ format: M.FORMAT, version: M.VERSION, kind: "sauvegarde-ca", exportedAt: new Date().toISOString(), patch: { ...patch, revision: M.C.draft.baseRevision || 0 }, sim: U.preview.sim, retired: M.C.draft.retired }, null, 1)) }, "Sauvegarde complète (.json)")),
    h("div", { class: "muted small" }, `Pour publier à la main : sur GitHub, ouvrez le dossier studio/data/, « Add file › Upload files », déposez modifications-ca.js et validez. Le jeu est mis à jour au déploiement suivant, sans reconstruire la Chronique Alternative.`),
    h("h3", null, "2. Importer"),
    importBox(),
    h("h3", null, "3. Publier sur GitHub"),
    githubBox(v));
  modal("Publier", body, [{ label: "Fermer" }]);
}
function importBox() {
  const f = h("input", { type: "file", accept: ".json,.js,application/json,text/javascript" });
  const mode = h("select", null, h("option", { value: "merge" }, "Fusionner avec mon brouillon"), h("option", { value: "replace" }, "Remplacer mon brouillon"));
  return h("div", { class: "rowx" }, f, mode, h("button", { onclick: async () => {
    const file = f.files[0]; if (!file) { toast("Choisissez un fichier."); return; }
    try {
      const parsed = M.parsePublished(await file.text());
      await snapshotVersion("Avant import");
      M.transaction("Importer", (d) => {
        if (mode.value === "replace") { d.entries = parsed.patch.entries; d.lists = parsed.patch.lists; }
        else { Object.assign(d.entries, parsed.patch.entries); Object.entries(parsed.patch.lists).forEach(([k, l]) => { d.lists[k] = l; }); }
        if (parsed.meta && Array.isArray(parsed.meta.retired)) d.retired = [...new Set([...(d.retired || []), ...parsed.meta.retired])];
      });
      if (parsed.sim) U.preview.sim = Object.assign(U.preview.sim, parsed.sim);
      toast(`Import terminé : ${Object.keys(parsed.patch.entries).length} texte(s), ${Object.keys(parsed.patch.lists).length} liste(s).`);
    } catch (e) { toast("Import impossible : " + e.message, "error"); }
  } }, "Importer"));
}
async function openVersions() {
  const list = await DB.listVersions("ca");
  const label = h("input", { placeholder: "Nom de la version (facultatif)", style: { flex: "1" } });
  modal("Historique des versions", h("div", { class: "rows" },
    h("div", { class: "rowx" }, label, h("button", { class: "gold", onclick: async () => { await snapshotVersion(label.value.trim() || "Version manuelle"); toast("Version enregistrée."); openVersions(); } }, "Créer une version")),
    h("div", { class: "muted small" }, "Versions de l'espace Chroniques Alternatives seulement. Une version automatique est créée toutes les 5 minutes de travail, et avant chaque import ou restauration."),
    list.length ? h("div", { class: "list" }, list.map((v) => h("div", { class: "it" },
      h("span", { class: "grow" }, h("b", null, v.label), h("div", { class: "muted small" }, `${fmtDate(v.at)} · ${v.count} modification(s)${v.auto ? " · automatique" : ""}`)),
      h("button", { class: "small", onclick: async () => {
        if (!(await confirmBox("Restaurer cette version", `Revenir à « ${v.label} » ? Votre état actuel est d'abord enregistré comme version.`, "Restaurer"))) return;
        await snapshotVersion("Avant restauration");
        const full = await DB.getVersion(v.id);
        M.transaction("Restaurer une version", (d) => { const n = M.normalizeDraft(full.draft); d.entries = n.entries; d.lists = n.lists; d.baseRevision = n.baseRevision; d.retired = [...new Set([...(d.retired || []), ...n.retired])]; });
        toast("Version restaurée.");
      } }, "Restaurer")))) : h("div", { class: "empty" }, "Aucune version pour l'instant.")), [{ label: "Fermer" }]);
}
function b64utf8(str) { const bytes = new TextEncoder().encode(str); let bin = ""; bytes.forEach((b) => { bin += String.fromCharCode(b); }); return btoa(bin); }
function utf8b64(b64) { const bin = atob(String(b64).replace(/\s/g, "")); return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0))); }
function githubBox(v) {
  let cfg = {}; try { cfg = JSON.parse(localStorage.getItem(TOKEN_KEY) || "null") || {}; } catch {}
  const repo = h("input", { value: cfg.repo || "Val1615/SylviniaVN", "aria-label": "Dépôt" });
  const base = h("input", { value: cfg.base || "main", "aria-label": "Branche de base", style: { width: "110px" } });
  const tok = h("input", { type: "password", value: cfg.token || "", placeholder: "Jeton GitHub (fine-grained)", autocomplete: "off", "aria-label": "Jeton GitHub", style: { flex: "1", minWidth: "200px" } });
  const remember = h("input", { type: "checkbox", checked: !!cfg.token });
  const log = h("div", { class: "list" });
  const say = (t, k = "") => log.appendChild(h("div", { class: "msg " + k }, t));
  const api = async (path, opts = {}) => {
    const r = await fetch("https://api.github.com" + path, Object.assign({}, opts, { headers: Object.assign({ Accept: "application/vnd.github+json", Authorization: "Bearer " + tok.value.trim(), "X-GitHub-Api-Version": "2022-11-28" }, opts.body ? { "Content-Type": "application/json" } : {}) }));
    const j = await r.json().catch(() => ({}));
    if (!r.ok) { const e = new Error(`${r.status} ${j.message || r.statusText}`); e.status = r.status; throw e; }
    return j;
  };
  const publish = async () => {
    clear(log);
    if (!v.ok) { say("Corrigez d'abord les erreurs (onglet Contrôles).", "err"); return; }
    if (!tok.value.trim()) { say("Saisissez un jeton GitHub.", "err"); return; }
    const c = { repo: repo.value.trim(), base: base.value.trim() || "main" }; if (remember.checked) c.token = tok.value; else if (cfg.token) c.token = cfg.token && remember.checked ? cfg.token : undefined;
    const prev = (() => { try { return JSON.parse(localStorage.getItem(TOKEN_KEY) || "{}") || {}; } catch { return {}; } })();
    localStorage.setItem(TOKEN_KEY, JSON.stringify(Object.assign(prev, c, remember.checked ? { token: tok.value } : {})));
    const R = c.repo, B = c.base;
    try {
      say("Lecture du fichier publié sur " + B + "…");
      let sha = null, remote = M.emptyPatch();
      try { const f = await api(`/repos/${R}/contents/${FILE_PATH}?ref=${encodeURIComponent(B)}`); sha = f.sha; remote = M.parsePublished(utf8b64(f.content)).patch; } catch (e) { if (e.status !== 404) throw e; }
      if ((remote.revision || 0) !== (M.C.draft.baseRevision || 0)) {
        say(`Conflit évité : la version en ligne (révision ${remote.revision || 0}) a changé depuis le début de votre brouillon (révision ${M.C.draft.baseRevision || 0}). Intégrez-la d'abord : vos modifications gardent la priorité.`, "warn");
        log.appendChild(h("button", { class: "gold", onclick: async () => { await snapshotVersion("Avant intégration de la version en ligne"); const next = M.rebaseOnto(remote); M.C.published = remote; M.transaction("Intégrer la version en ligne", (d) => { Object.assign(d, next); }); say("Version en ligne intégrée. Vérifiez puis relancez la publication.", "ok"); } }, "Intégrer la version en ligne"));
        return;
      }
      const out = M.exportPatch(); out.revision = (remote.revision || 0) + 1;
      const ref = await api(`/repos/${R}/git/ref/heads/${encodeURIComponent(B)}`);
      const branch = `studio/ca-publication-${stamp()}`;
      say("Création de la branche de travail " + branch + "…");
      await api(`/repos/${R}/git/refs`, { method: "POST", body: JSON.stringify({ ref: "refs/heads/" + branch, sha: ref.object.sha }) });
      const nE = Object.keys(out.entries).length, nL = Object.keys(out.lists).length;
      await api(`/repos/${R}/contents/${FILE_PATH}`, { method: "PUT", body: JSON.stringify({ message: `Sylvinia Studio (Chroniques Alternatives) : révision ${out.revision}`, content: b64utf8(M.gameFileText(out)), branch, sha: sha || undefined }) });
      const pr = await api(`/repos/${R}/pulls`, { method: "POST", body: JSON.stringify({ title: `Sylvinia Studio · Chroniques Alternatives : révision ${out.revision}`, head: branch, base: B, body: `Publication depuis Sylvinia Studio (Chroniques Alternatives).\n\n- Révision : ${out.revision}\n- Textes et nombres modifiés : ${nE}\n- Listes modifiées (ajouts, éléments masqués) : ${nL}\n\nSeul le fichier \`${FILE_PATH}\` change. Vérifiez puis fusionnez pour mettre le jeu à jour.` }) });
      say("Demande de fusion créée. Relisez-la sur GitHub puis fusionnez.", "ok");
      log.appendChild(h("a", { href: pr.html_url, target: "_blank", rel: "noopener", style: { color: "var(--gold2)" } }, pr.html_url));
      snapshotVersion(`Publication révision ${out.revision}`);
    } catch (e) { say("Échec : " + e.message + (e.status === 401 ? " (jeton refusé)" : e.status === 403 || e.status === 404 ? " (droits insuffisants sur ce dépôt ?)" : ""), "err"); }
  };
  return h("div", { class: "rows" },
    h("div", { class: "muted small" }, "Crée une branche de travail et une demande de fusion contenant uniquement studio/data/modifications-ca.js. Rien n'est fusionné automatiquement. Jeton « fine-grained » limité à ce dépôt (Contents et Pull requests en lecture et écriture), jamais écrit dans le code, gardé dans ce navigateur seulement si vous cochez « Mémoriser »."),
    h("div", { class: "rowx" }, repo, base), h("div", { class: "rowx" }, tok),
    h("div", { class: "rowx" }, h("label", { class: "kv small" }, remember, "Mémoriser le jeton sur cet appareil")),
    h("div", { class: "toolbar" }, h("button", { class: "gold", disabled: !v.ok, onclick: publish }, "Publier sur une branche de travail")), log);
}
function openHelp() {
  modal("Aide · Chroniques Alternatives", h("div", { class: "rows small" },
    h("p", null, "Le catalogue liste les vrais contenus de la Chronique Alternative, rangés en 18 catégories. Chaque texte, seuil ou effet a un identifiant stable : vos modifications s'appliquent par-dessus le code, qui n'est jamais réécrit."),
    h("p", null, "Écriture : modifiez un texte ou un nombre, « + Ajouter » copie un élément réel (réplique, réponse, moment, confidence, activité) avec un nouvel identifiant, « Masquer… » retire un élément d'une liste sans le supprimer."),
    h("p", null, "Les repères {1}, {2}… remplacent les parties calculées par le jeu (nom du personnage, lieu…) : gardez-les dans le texte."),
    h("p", null, "Aperçu : le vrai jeu avec votre brouillon, dans un bac à sable. Choisissez une partie de test, un jour, des relations et des drapeaux. Les textes modifiés sont entourés d'or quand ils s'affichent."),
    h("p", null, "Raccourcis : Ctrl+Z annuler, Ctrl+Y rétablir (hors zone de texte).")), [{ label: "Fermer" }]);
}


function initSplitter() {
  const sp = document.getElementById("splitter"), ws = document.getElementById("workspace");
  const setW = (px) => { const r = ws.getBoundingClientRect(); const v = Math.max(240, Math.min(r.width - 300, px)); app.style.setProperty("--preview-w", v + "px"); U.previewW = v; };
  const setH = (px) => { const r = ws.getBoundingClientRect(); const v = Math.max(180, Math.min(r.height - 160, px)); app.style.setProperty("--preview-h", v + "px"); U.previewH = v; };
  sp.tabIndex = 0;
  sp.addEventListener("pointerdown", (e) => {
    sp.setPointerCapture(e.pointerId);
    const portrait = app.classList.contains("portrait") && U.layout === "split";
    const frame = document.querySelector(".pv-frame iframe"); if (frame) frame.style.pointerEvents = "none";
    const move = (ev) => { const r = ws.getBoundingClientRect(); if (portrait) setH(r.bottom - ev.clientY); else setW(r.right - ev.clientX); };
    const up = () => { sp.removeEventListener("pointermove", move); sp.removeEventListener("pointerup", up); if (frame) frame.style.pointerEvents = ""; saveUi(); };
    sp.addEventListener("pointermove", move); sp.addEventListener("pointerup", up);
  });
}

/* ---------- démarrage ---------- */
async function boot() {
  const lt = document.getElementById("loadingText");
  try {
    await M.loadIndex();
    await M.loadPublished();
  } catch (e) { lt.textContent = "Catalogue introuvable : " + e.message; return; }
  let d = await DB.get("ca-draft").catch(() => null);
  if (!d) { try { d = JSON.parse(localStorage.getItem(LS_BACKUP) || "null"); } catch { d = null; } }
  M.C.draft = d ? M.normalizeDraft(d) : M.newDraft();
  if (d && (M.C.published.revision || 0) > (M.C.draft.baseRevision || 0)) {
    setTimeout(() => toast(`Une nouvelle version publiée (révision ${M.C.published.revision}) est en ligne. Vous pouvez l'intégrer depuis Publier.`), 800);
  }
  const ui = await DB.get("ca-ui").catch(() => null);
  if (ui) { Object.assign(U, { char: ui.char || "", status: ui.status || "all", openCats: ui.openCats || U.openCats, libview: ui.libview || "cats", tab: ui.tab || U.tab }); if (ui.preview) { U.preview = Object.assign(U.preview, ui.preview); U.preview.sim = Object.assign({ rel: {} }, ui.preview.sim || {}); } if (ui.module && M.moduleMeta(ui.module)) { await M.loadModule(ui.module).catch(() => {}); U.module = ui.module; U.scene = typeof ui.scene === "number" ? ui.scene : -1; } }
  document.getElementById("loading").classList.add("hidden");
  setStatus("Enregistré", "ok"); updateUndo();
  document.querySelectorAll("#tabs button[data-tab]").forEach((b) => b.addEventListener("click", () => { setTab(b.dataset.tab); saveUi(); }));
  document.getElementById("btnTogglePreview").addEventListener("click", () => { U.preview.shown = !U.preview.shown; applyLayout(); saveUi(); });
  document.getElementById("btnUndo").addEventListener("click", () => { const l = M.undo(); if (l) toast("Annulé : " + l); });
  document.getElementById("btnRedo").addEventListener("click", () => { const l = M.redo(); if (l) toast("Rétabli : " + l); });
  document.getElementById("btnPublish").addEventListener("click", openPublish);
  document.getElementById("btnVersions").addEventListener("click", openVersions);
  document.getElementById("btnHelp").addEventListener("click", openHelp);
  addEventListener("keydown", (e) => {
    if (e.key === "Escape") { const x = document.querySelector("#modal:not(.hidden) .modal-head button"); if (x) { e.preventDefault(); x.click(); return; } }
    const inField = /^(TEXTAREA|INPUT|SELECT)$/.test((e.target && e.target.tagName) || "");
    if ((e.ctrlKey || e.metaKey) && !inField && e.key.toLowerCase() === "z") { e.preventDefault(); M.undo(); }
    if ((e.ctrlKey || e.metaKey) && !inField && e.key.toLowerCase() === "y") { e.preventDefault(); M.redo(); }
  });
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") { DB.put("ca-draft", M.C.draft); try { localStorage.setItem(LS_BACKUP, JSON.stringify(M.C.draft)); } catch {} } });
  if (ui && ui.previewW) app.style.setProperty("--preview-w", ui.previewW + "px");
  if (ui && ui.previewH) app.style.setProperty("--preview-h", ui.previewH + "px");
  initSplitter(); DB.persist();
  applyLayout(); renderLibrary(); renderEditor();
  setTimeout(() => X.warm(), 1500);
  window.SylviniaStudioCA = { M, U, X, openModule, renderEditor };
}
boot();
