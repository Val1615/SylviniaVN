/* Sylvinia Studio · démarrage, dispositions (ordinateur, Fold déplié, Fold replié), persistance. */
import * as Mo from "./model.js";
import * as DB from "./db.js";
import { h, $, toast, modal, debounce, fmtDate } from "./ui.js";
import { U, registerRenderer, refresh, setTab, onSaveUi, fixSelection, currentScene, selectLine } from "./state.js";
import { renderLibrary } from "./library.js";
import { renderEditor } from "./editor.js";
import { renderBranches } from "./branches.js";
import { renderVisuals } from "./visuals.js";
import { renderPreview, pushPatchSoon } from "./preview.js";
import { openPublish, openVersions, snapshotVersion } from "./io.js";

const LS_BACKUP = "sylvinia_studio_draft_backup_v1";
const app = document.getElementById("app");

/* ---------- dispositions ---------- */
function computeLayout() {
  const w = window.innerWidth, hgt = window.innerHeight;
  if (w < 700 || hgt < 600) return "compact";
  if (w >= 1280 && hgt >= 700) return "desktop";
  return "split";
}
function applyLayout() {
  const l = computeLayout();
  U.layout = l;
  app.dataset.layout = l;
  app.classList.toggle("portrait", window.innerHeight > window.innerWidth);
  if (l === "desktop" && (U.tab === "chapitres" || U.tab === "apercu")) U.tab = "ecriture";
  if (l === "split" && U.tab === "apercu") U.tab = "ecriture";
  app.classList.toggle("nopreview", l !== "compact" && !U.preview.shown);
  setTab(U.tab);
}
window.addEventListener("resize", debounce(applyLayout, 120));

/* ---------- séparateur redimensionnable ---------- */
function initSplitter() {
  const sp = document.getElementById("splitter");
  const ws = document.getElementById("workspace");
  const setW = (px) => { const r = ws.getBoundingClientRect(); const v = Math.max(240, Math.min(r.width - 300, px)); app.style.setProperty("--preview-w", v + "px"); U.previewW = v; };
  const setH = (px) => { const r = ws.getBoundingClientRect(); const v = Math.max(180, Math.min(r.height - 160, px)); app.style.setProperty("--preview-h", v + "px"); U.previewH = v; };
  sp.addEventListener("pointerdown", (e) => {
    sp.setPointerCapture(e.pointerId);
    const portrait = app.classList.contains("portrait") && U.layout === "split";
    const frame = document.querySelector(".pv-frame iframe"); if (frame) frame.style.pointerEvents = "none";
    const move = (ev) => { const r = ws.getBoundingClientRect(); if (portrait) setH(r.bottom - ev.clientY); else setW(r.right - ev.clientX); };
    const up = () => { sp.removeEventListener("pointermove", move); sp.removeEventListener("pointerup", up); if (frame) frame.style.pointerEvents = ""; saveUiNow(); };
    sp.addEventListener("pointermove", move); sp.addEventListener("pointerup", up);
  });
  sp.addEventListener("keydown", (e) => {
    const portrait = app.classList.contains("portrait") && U.layout === "split";
    const cur = portrait ? (U.previewH || ws.clientHeight * 0.46) : (U.previewW || ws.clientWidth * 0.42);
    const d = e.key === "ArrowLeft" || e.key === "ArrowUp" ? 30 : e.key === "ArrowRight" || e.key === "ArrowDown" ? -30 : 0;
    if (!d) return; e.preventDefault(); if (portrait) setH(cur + d); else setW(cur + d); saveUiNow();
  });
}

/* ---------- persistance ---------- */
let lastAutoVersion = Date.now(), changesSinceVersion = false;
const saveState = document.getElementById("saveState");
function setStatus(text, cls) { saveState.textContent = text; saveState.className = "save-state " + (cls || ""); }
const saveDraft = debounce(async () => {
  try {
    await DB.put("draft", Mo.M.draft);
    try { localStorage.setItem(LS_BACKUP, JSON.stringify(Mo.M.draft)); } catch {}
    setStatus("Enregistré " + new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }), "ok");
    if (changesSinceVersion && Date.now() - lastAutoVersion > 5 * 60 * 1000) { lastAutoVersion = Date.now(); changesSinceVersion = false; snapshotVersion("Sauvegarde automatique", true); }
  } catch (e) { setStatus("Échec d'enregistrement", "dirty"); toast("Enregistrement impossible : " + e.message, "error"); }
}, 500);
function flushBackup() { try { if (Mo.M.draft) localStorage.setItem(LS_BACKUP, JSON.stringify(Mo.M.draft)); } catch {} }
window.addEventListener("beforeunload", flushBackup);
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") { flushBackup(); DB.put("draft", Mo.M.draft); saveUiNow(); } });
function uiSnapshot() { return { chapter: U.chapter, scene: U.scene, line: U.line, tab: U.tab, libview: U.libview, preview: U.preview, previewW: U.previewW, previewH: U.previewH }; }
function saveUiNow() { DB.put("ui", uiSnapshot()).catch(() => {}); }
const saveUiSoon = debounce(saveUiNow, 400);
onSaveUi(saveUiSoon);

/* ---------- barre du haut ---------- */
function renderCrumbs() {
  const c = U.chapter ? Mo.chapter(U.chapter) : null; const s = currentScene();
  const el = document.getElementById("crumbs");
  el.innerHTML = "";
  if (!c) { el.textContent = "Bibliothèque des chapitres"; return; }
  el.appendChild(h("b", null, c.number)); el.appendChild(document.createTextNode(c.title ? " · " + c.title : ""));
  if (s) el.appendChild(document.createTextNode("  ›  " + (s.title || "(sans titre)")));
  document.getElementById("btnUndo").disabled = !Mo.M.undo.length;
  document.getElementById("btnRedo").disabled = !Mo.M.redo.length;
  document.getElementById("btnUndo").title = Mo.M.undo.length ? "Annuler : " + Mo.M.undo[Mo.M.undo.length - 1].label : "Rien à annuler";
}
function doUndo() { const l = Mo.undo(); if (l) { fixSelection(); toast("Annulé : " + l); refresh(); } }
function doRedo() { const l = Mo.redo(); if (l) { fixSelection(); toast("Rétabli : " + l); refresh(); } }
document.getElementById("btnUndo").onclick = doUndo;
document.getElementById("btnRedo").onclick = doRedo;
document.getElementById("btnPublish").onclick = openPublish;
document.getElementById("btnVersions").onclick = openVersions;
document.getElementById("btnHelp").onclick = openHelp;
document.getElementById("btnTogglePreview").onclick = () => { U.preview.shown = !U.preview.shown; applyLayout(); saveUiNow(); };
document.querySelectorAll("#tabs button[data-tab]").forEach((b) => { b.onclick = () => setTab(b.dataset.tab); });
document.addEventListener("keydown", (e) => {
  const inField = e.target.closest && e.target.closest("input,textarea,select");
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") { e.preventDefault(); saveDraft(); toast("Brouillon enregistré."); return; }
  if (inField) return;
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z" && !e.shiftKey) { e.preventDefault(); doUndo(); }
  else if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === "y" || (e.key.toLowerCase() === "z" && e.shiftKey))) { e.preventDefault(); doRedo(); }
});

function openHelp() {
  modal("Utiliser Sylvinia Studio", h("div", { class: "rows" },
    h("p", null, h("b", null, "Écrire. "), "Choisissez un chapitre, puis une scène. Chaque carte est une réplique du jeu : modifiez le personnage et le texte directement. Les boutons ▲ ▼ (ou la poignée ⋮⋮) déplacent une réplique ; « + Réplique » et « + Narration » insèrent après la réplique sélectionnée."),
    h("p", null, h("b", null, "Enregistrer. "), "Tout est enregistré automatiquement dans ce navigateur (IndexedDB). « Versions » garde un historique restaurable. ↶ ↷ annulent et rétablissent."),
    h("p", null, h("b", null, "Tester. "), "« Tester cette scène » lance le vrai moteur du jeu à cet endroit, avec vos modifications et l'état de test choisi (statistiques, drapeaux, souvenirs). Vos sauvegardes de joueur ne sont jamais touchées."),
    h("p", null, h("b", null, "Publier. "), "« Publier » exporte le fichier modifications.js à déposer dans studio/data/ du dépôt, ou crée directement une demande de fusion sur GitHub avec votre jeton. Le jeu lit ce fichier au démarrage."),
    h("p", { class: "muted small" }, "Les identifiants (ex. c10_01) ne changent jamais : les sauvegardes existantes restent valides. Une réplique retirée reste connue du jeu.")), [{ label: "Fermer" }]);
}

/* ---------- lecture du jeu ---------- */
function extract() {
  return new Promise((resolve, reject) => {
    const f = document.createElement("iframe");
    f.setAttribute("aria-hidden", "true"); f.tabIndex = -1;
    f.style.cssText = "position:fixed;left:-12000px;top:0;width:1280px;height:720px;opacity:0;pointer-events:none;border:0";
    const done = (fn) => { clearTimeout(timer); setTimeout(() => f.remove(), 50); fn(); };
    const timer = setTimeout(() => done(() => reject(new Error("Le jeu n'a pas répondu à temps."))), 90000);
    f.onload = () => {
      const w = f.contentWindow; let n = 0;
      const wait = () => {
        n++;
        if (w.SylviniaStudioRuntime && w.document.readyState === "complete") {
          setTimeout(() => { try { const snap = JSON.parse(w.SylviniaStudioRuntime.snapshot()); done(() => resolve(snap)); } catch (e) { done(() => reject(e)); } }, 1500);
        } else if (n > 300) done(() => reject(new Error("Couche Studio absente du jeu.")));
        else setTimeout(wait, 200);
      };
      wait();
    };
    f.src = "../index.html?studio=extract&t=" + Date.now();
    document.body.appendChild(f);
  });
}
function hashSnap(s) { const str = JSON.stringify([s.order.length, s.published && s.published.revision, s.order.slice(-20), Object.keys(s.assets).length]); let x = 0; for (let i = 0; i < str.length; i++) x = (x * 31 + str.charCodeAt(i)) | 0; return x + ":" + JSON.stringify(s.nodes).length; }

async function loadDraft() {
  let d = await DB.get("draft").catch(() => null);
  try { const b = JSON.parse(localStorage.getItem(LS_BACKUP) || "null"); if (b && (!d || (b.updatedAt || "") > (d.updatedAt || ""))) d = b; } catch {}
  const pub = Mo.M.published;
  if (!d) { d = Mo.normalizeDraft(pub); d.baseRevision = pub.revision || 0; d.meta = { touched: {}, created: Object.keys(pub.nodes).filter((id) => !Mo.isBase(id)) }; }
  d = Mo.normalizeDraft(d);
  if (d.meta.pendingRevision && (pub.revision || 0) >= d.meta.pendingRevision) { d.baseRevision = pub.revision || 0; d.meta.touched = {}; delete d.meta.pendingRevision; }
  Mo.setDraft(d);
  if ((d.baseRevision || 0) !== (pub.revision || 0)) {
    setTimeout(() => modal("Nouvelle version publiée", h("div", { class: "rows" },
      h("p", null, `Le jeu en ligne contient une version publiée plus récente (révision ${pub.revision || 0}) que celle de départ de votre brouillon (révision ${d.baseRevision || 0}).`),
      h("p", { class: "muted" }, "Intégrer : vos répliques modifiées dans ce navigateur sont gardées, toutes les autres prennent la version en ligne. Une version de secours est enregistrée avant.")), [
      { label: "Plus tard" },
      { label: "Intégrer la version en ligne", class: "gold", onclick: async () => { await snapshotVersion("Avant intégration de la version en ligne"); Mo.setDraft(Mo.rebaseOnto(pub)); refresh(); toast("Version en ligne intégrée."); } },
    ]), 400);
  }
}

async function boot() {
  DB.persist();
  const ui = (await DB.get("ui").catch(() => null)) || {};
  Object.assign(U, { chapter: ui.chapter || null, scene: ui.scene || null, line: ui.line || null, tab: ui.tab || "ecriture", libview: ui.libview || "chapitres", previewW: ui.previewW, previewH: ui.previewH });
  if (ui.preview) U.preview = Object.assign(U.preview, ui.preview, { sim: Object.assign(U.preview.sim, ui.preview.sim || {}) });
  if (U.previewW) app.style.setProperty("--preview-w", U.previewW + "px");
  if (U.previewH) app.style.setProperty("--preview-h", U.previewH + "px");

  const cached = await DB.get("base").catch(() => null);
  const start = async (snap) => {
    Mo.setBase(snap);
    await loadDraft();
    if (!U.chapter || !Mo.chapter(U.chapter)) { U.chapter = null; U.libview = "chapitres"; if (U.tab !== "chapitres" && computeLayout() !== "desktop") U.tab = "chapitres"; }
    fixSelection();
    document.getElementById("loading").classList.add("hidden");
    applyLayout();
    setStatus(Mo.M.draft.updatedAt ? "Brouillon du " + fmtDate(Mo.M.draft.updatedAt) : "Prêt", "ok");
  };
  let started = false;
  if (cached && cached.order) { await start(cached); started = true; }
  try {
    document.getElementById("loadingText").textContent = "Lecture des chapitres du jeu…";
    const snap = await extract();
    await DB.put("base", snap).catch(() => {});
    if (!started) await start(snap);
    else if (hashSnap(snap) !== hashSnap(cached)) { Mo.setBase(snap); await loadDraft(); fixSelection(); refresh(); toast("Le contenu du jeu a été relu : bibliothèque à jour."); }
  } catch (e) {
    if (!started) { document.getElementById("loadingText").textContent = "Impossible de lire le jeu : " + e.message + " Rechargez la page."; return; }
    toast("Le jeu n'a pas pu être relu, la dernière lecture est utilisée : " + e.message, "error");
  }
}

registerRenderer("library", renderLibrary);
registerRenderer("editor", () => { if (!U.quiet) renderEditor(); });
registerRenderer("branches", renderBranches);
registerRenderer("visuals", renderVisuals);
registerRenderer("preview", renderPreview);
registerRenderer("crumbs", renderCrumbs);
Mo.onChange((reason) => {
  changesSinceVersion = true;
  setStatus("Modification…", "dirty");
  saveDraft();
  pushPatchSoon();
  if (U.quiet) refresh(["library", "crumbs"]); else refresh();
});
initSplitter();
window.SylviniaStudio = { M: Mo.M, model: Mo, U, refresh, selectLine };
boot();
