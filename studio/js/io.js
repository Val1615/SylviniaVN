/* Sylvinia Studio · export, import, versions et publication GitHub. */
import * as Mo from "./model.js";
import * as DB from "./db.js";
import { h, clear, modal, toast, download, fmtDate, confirmBox } from "./ui.js";
import { U, refresh } from "./state.js";

const SCHEMA = window.SylviniaStudioSchema;
const TOKEN_KEY = "sylvinia_studio_github_v1";
const FILE_PATH = "studio/data/modifications.js";

export function gameFileText(patch) {
  return `/* Sylvinia Studio · modifications publiées.
   Ce fichier est produit par Sylvinia Studio (bouton « Exporter pour le jeu » ou « Publier sur GitHub »).
   Le jeu le lit au démarrage et applique ces changements par-dessus les scènes d'origine.
   Pour revenir au jeu d'origine : remettre "nodes": {} et "chapters": {}. */
window.SylviniaStudioPublished = ${JSON.stringify(patch, null, 1)};
`;
}
export function parseAny(text) {
  text = String(text || "").replace(/^\uFEFF/, "").trim();
  let obj;
  if (text.startsWith("{")) obj = JSON.parse(text);
  else {
    const i = text.indexOf("SylviniaStudioPublished"); if (i < 0) throw new Error("Fichier non reconnu : ni export Sylvinia Studio, ni modifications.js.");
    const a = text.indexOf("{", i), b = text.lastIndexOf("}");
    obj = JSON.parse(text.slice(a, b + 1));
  }
  if (obj && obj.kind === "sauvegarde" && obj.patch) return { patch: obj.patch, sim: obj.sim || null, meta: obj };
  return { patch: obj, sim: null, meta: null };
}
function stamp() { const d = new Date(); const p = (n) => String(n).padStart(2, "0"); return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}`; }
function chapterPatch(key) {
  const p = Mo.exportPatch();
  const nodes = {}; Object.keys(p.nodes).forEach((id) => { if (Mo.chapterKey(id) === key) nodes[id] = p.nodes[id]; });
  const chapters = {}; if (p.chapters[key]) chapters[key] = p.chapters[key];
  return Object.assign(p, { nodes, chapters });
}
export async function snapshotVersion(label, auto = false) {
  const p = Mo.exportPatch();
  await DB.addVersion({ at: new Date().toISOString(), label, auto, count: Object.keys(p.nodes).length, draft: Mo.clone(Mo.M.draft) });
  await DB.pruneVersions();
}

/* ---------- fenêtre Publier ---------- */
export function openPublish() {
  const patch = Mo.exportPatch();
  const v = Mo.validateDraft(patch);
  const diff = Mo.diffSummary();
  const byChap = {}; diff.forEach((id) => { const k = Mo.chapterKey(id); byChap[k] = (byChap[k] || 0) + 1; });
  const body = h("div", { class: "rows" });
  body.appendChild(h("div", { class: "msg " + (v.ok ? "ok" : "err") },
    v.ok ? `Validation réussie. ${Object.keys(patch.nodes).length} réplique(s) diffèrent du jeu d'origine, dont ${diff.length} non encore publiée(s).`
      : `Validation : ${v.errors.length} erreur(s) bloquent la publication (le brouillon reste enregistré).`));
  if (!v.ok) body.appendChild(h("div", { class: "list" }, v.errors.slice(0, 30).map((e) => h("div", { class: "it small" }, e))));
  if (v.warnings.length) body.appendChild(h("details", null, h("summary", { class: "small" }, `${v.warnings.length} avertissement(s)`), h("div", { class: "list" }, v.warnings.slice(0, 40).map((e) => h("div", { class: "it small" }, e)))));
  if (diff.length) body.appendChild(h("div", { class: "chips" }, Object.entries(byChap).map(([k, n]) => h("span", { class: "badge modifie" }, `${(Mo.chapter(k) || { number: k }).number} : ${n}`))));

  body.appendChild(h("h3", null, "1. Exporter"));
  body.appendChild(h("div", { class: "toolbar" },
    h("button", { class: "gold", disabled: !v.ok, onclick: () => { download("modifications.js", gameFileText(patch), "text/javascript"); snapshotVersion("Export pour le jeu"); toast("Fichier modifications.js téléchargé. Déposez-le dans studio/data/ du dépôt."); } }, "Exporter pour le jeu (modifications.js)"),
    h("button", { onclick: () => { download(`sylvinia-studio-${stamp()}.json`, JSON.stringify({ format: SCHEMA.FORMAT, version: SCHEMA.VERSION, kind: "sauvegarde", exportedAt: new Date().toISOString(), scope: "tout", patch, sim: U.preview.sim }, null, 1)); toast("Sauvegarde complète téléchargée."); } }, "Sauvegarde complète (.json)"),
    U.chapter ? h("button", { onclick: () => { const p = chapterPatch(U.chapter); download(`sylvinia-studio-${U.chapter}-${stamp()}.json`, JSON.stringify({ format: SCHEMA.FORMAT, version: SCHEMA.VERSION, kind: "sauvegarde", exportedAt: new Date().toISOString(), scope: U.chapter, patch: p }, null, 1)); toast("Chapitre exporté."); } }, "Exporter ce chapitre (.json)") : null));
  body.appendChild(h("div", { class: "muted small" }, "Le fichier modifications.js remplace studio/data/modifications.js dans le dépôt. Le jeu le lit au démarrage : aucun dialogue n'est à recopier."));

  body.appendChild(h("h3", null, "2. Importer"));
  const file = h("input", { type: "file", accept: ".json,.js,application/json,text/javascript" });
  file.addEventListener("change", () => { const f = file.files[0]; if (f) f.text().then(importText).catch((e) => toast(e.message, "error")); });
  body.appendChild(h("div", { class: "toolbar" }, file));

  body.appendChild(h("h3", null, "3. Publier sur GitHub (facultatif)"));
  body.appendChild(githubBox(patch, v));
  modal("Exporter, importer, publier", body, [{ label: "Fermer" }]);
}

/* ---------- import ---------- */
export async function importText(text) {
  let parsed;
  try { parsed = parseAny(text); } catch (e) { toast("Import impossible : " + e.message, "error"); return; }
  const v = SCHEMA.validate(parsed.patch, Mo.isKnownTarget);
  const n = Object.keys((parsed.patch && parsed.patch.nodes) || {}).length;
  const body = h("div", { class: "rows" },
    h("div", { class: "msg " + (v.ok ? "ok" : "warn") }, v.ok ? `Fichier valide : ${n} réplique(s).` : `Fichier lisible avec ${v.errors.length} erreur(s) : il peut être importé comme brouillon, mais pas publié avant correction.`),
    v.errors.length ? h("div", { class: "list" }, v.errors.slice(0, 20).map((e) => h("div", { class: "it small" }, e))) : null,
    h("div", { class: "muted small" }, "« Fusionner » remplace seulement les répliques présentes dans le fichier. « Remplacer » remplace tout le brouillon. Une version de secours est créée avant."));
  if (!parsed.patch || typeof parsed.patch !== "object" || !parsed.patch.nodes) { toast("Ce fichier ne contient pas de modifications.", "error"); return; }
  modal("Importer", body, [
    { label: "Annuler" },
    { label: "Fusionner", onclick: () => { doImport(parsed, "merge"); } },
    { label: "Remplacer le brouillon", class: "gold", onclick: () => { doImport(parsed, "replace"); } },
  ]);
}
async function doImport(parsed, mode) {
  await snapshotVersion("Avant import");
  const p = parsed.patch;
  Mo.transaction("Importer", () => {
    const d = Mo.M.draft;
    const t = new Date().toISOString();
    if (mode === "replace") { d.nodes = {}; d.chapters = {}; d.meta.created = []; }
    Object.keys(p.nodes).forEach((id) => { d.nodes[id] = Mo.clone(p.nodes[id]); d.meta.touched[id] = t; if (!Mo.isBase(id) && !d.meta.created.includes(id)) d.meta.created.push(id); });
    Object.assign(d.chapters, Mo.clone(p.chapters || {}));
  });
  if (parsed.sim) U.preview.sim = parsed.sim;
  toast(`Import terminé (${Object.keys(p.nodes).length} réplique(s)).`);
  refresh();
}

/* ---------- versions ---------- */
export async function openVersions() {
  const list = await DB.listVersions();
  const label = h("input", { placeholder: "Nom de la version (facultatif)", style: { flex: "1" } });
  const body = h("div", { class: "rows" },
    h("div", { class: "rowx" }, label, h("button", { class: "gold", onclick: async () => { await snapshotVersion(label.value.trim() || "Version manuelle"); toast("Version enregistrée."); openVersions(); } }, "Créer une version")),
    h("div", { class: "muted small" }, "Le Studio enregistre aussi une version automatique toutes les 5 minutes de travail, et avant chaque import ou restauration."),
    list.length ? h("div", { class: "list" }, list.map((v) => h("div", { class: "it" },
      h("span", { class: "grow" }, h("b", null, v.label), h("div", { class: "muted small" }, `${fmtDate(v.at)} · ${v.count} réplique(s) modifiée(s)${v.auto ? " · automatique" : ""}`)),
      h("button", { class: "small", onclick: async () => {
        if (!(await confirmBox("Restaurer cette version", `Revenir à « ${v.label} » (${fmtDate(v.at)}) ? Votre état actuel est d'abord enregistré comme version.`, "Restaurer"))) return;
        await snapshotVersion("Avant restauration");
        const full = await DB.getVersion(v.id);
        Mo.transaction("Restaurer une version", () => { const d = Mo.normalizeDraft(full.draft); Mo.M.draft.nodes = d.nodes; Mo.M.draft.chapters = d.chapters; Mo.M.draft.meta = d.meta; Mo.M.draft.baseRevision = d.baseRevision; });
        toast("Version restaurée."); refresh();
      } }, "Restaurer"),
      h("button", { class: "small", onclick: async () => { const full = await DB.getVersion(v.id); download(`sylvinia-studio-version-${v.id}.json`, JSON.stringify({ format: SCHEMA.FORMAT, version: SCHEMA.VERSION, kind: "sauvegarde", exportedAt: v.at, scope: "tout", patch: Object.assign(SCHEMA.emptyPatch(), { nodes: full.draft.nodes, chapters: full.draft.chapters, revision: full.draft.baseRevision || 0 }) }, null, 1)); } }, "Exporter")))) : h("div", { class: "empty" }, "Aucune version pour l'instant."));
  modal("Historique des versions", body, [{ label: "Fermer" }]);
}

/* ---------- GitHub ---------- */
function loadCfg() { try { return JSON.parse(localStorage.getItem(TOKEN_KEY) || "null") || {}; } catch { return {}; } }
function b64utf8(str) { const bytes = new TextEncoder().encode(str); let bin = ""; bytes.forEach((b) => { bin += String.fromCharCode(b); }); return btoa(bin); }
function utf8b64(b64) { const bin = atob(String(b64).replace(/\s/g, "")); const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0)); return new TextDecoder().decode(bytes); }

function githubBox(patch, v) {
  const cfg = loadCfg();
  let sessionToken = cfg.token || "";
  const repo = h("input", { value: cfg.repo || "Val1615/SylviniaVN", "aria-label": "Dépôt" });
  const base = h("input", { value: cfg.base || "main", "aria-label": "Branche de base", style: { width: "110px" } });
  const tok = h("input", { type: "password", value: sessionToken, placeholder: "Jeton GitHub (fine-grained)", autocomplete: "off", "aria-label": "Jeton GitHub", style: { flex: "1", minWidth: "200px" } });
  const remember = h("input", { type: "checkbox", checked: !!cfg.token });
  const log = h("div", { class: "list" });
  const say = (t, kind = "") => log.appendChild(h("div", { class: "msg " + kind }, t));
  const saveCfg = () => { const c = { repo: repo.value.trim(), base: base.value.trim() || "main" }; if (remember.checked && tok.value) c.token = tok.value; localStorage.setItem(TOKEN_KEY, JSON.stringify(c)); };
  const api = async (path, opts = {}) => {
    const r = await fetch("https://api.github.com" + path, Object.assign({}, opts, { headers: Object.assign({ Accept: "application/vnd.github+json", Authorization: "Bearer " + tok.value.trim(), "X-GitHub-Api-Version": "2022-11-28" }, opts.body ? { "Content-Type": "application/json" } : {}) }));
    const j = await r.json().catch(() => ({}));
    if (!r.ok) { const e = new Error(`${r.status} ${j.message || r.statusText}`); e.status = r.status; throw e; }
    return j;
  };
  const publish = async () => {
    clear(log);
    if (!v.ok) { say("Corrigez d'abord les erreurs de validation.", "err"); return; }
    if (!tok.value.trim()) { say("Saisissez un jeton GitHub.", "err"); return; }
    saveCfg();
    const R = repo.value.trim(), B = base.value.trim() || "main";
    try {
      say("Lecture du fichier publié sur " + B + "…");
      let remoteSha = null, remotePatch = SCHEMA.emptyPatch();
      try { const f = await api(`/repos/${R}/contents/${FILE_PATH}?ref=${encodeURIComponent(B)}`); remoteSha = f.sha; remotePatch = parseAny(utf8b64(f.content)).patch; }
      catch (e) { if (e.status !== 404) throw e; }
      const remoteRev = remotePatch.revision || 0;
      if (remoteRev !== (Mo.M.draft.baseRevision || 0)) {
        say(`Conflit évité : la version en ligne (révision ${remoteRev}) a changé depuis le début de votre brouillon (révision ${Mo.M.draft.baseRevision || 0}). Intégrez-la d'abord : vos répliques modifiées sont gardées, les autres prennent la version en ligne.`, "warn");
        log.appendChild(h("button", { class: "gold", onclick: async () => { await snapshotVersion("Avant intégration de la version en ligne"); const next = Mo.rebaseOnto(remotePatch); Mo.setDraft(next, { keepUndo: true }); Mo.M.draft.updatedAt = new Date().toISOString(); refresh(); say("Version en ligne intégrée. Vérifiez puis relancez la publication.", "ok"); } }, "Intégrer la version en ligne"));
        return;
      }
      const out = Mo.exportPatch(); out.revision = remoteRev + 1;
      const ref = await api(`/repos/${R}/git/ref/heads/${encodeURIComponent(B)}`);
      const branch = `studio/publication-${stamp()}`;
      say("Création de la branche de travail " + branch + "…");
      await api(`/repos/${R}/git/refs`, { method: "POST", body: JSON.stringify({ ref: "refs/heads/" + branch, sha: ref.object.sha }) });
      const n = Object.keys(out.nodes).length; const changed = Mo.diffSummary().length;
      await api(`/repos/${R}/contents/${FILE_PATH}`, { method: "PUT", body: JSON.stringify({ message: `Sylvinia Studio : publication révision ${out.revision} (${changed} réplique(s) modifiée(s))`, content: b64utf8(gameFileText(out)), branch, sha: remoteSha || undefined }) });
      const pr = await api(`/repos/${R}/pulls`, { method: "POST", body: JSON.stringify({ title: `Sylvinia Studio : révision ${out.revision}`, head: branch, base: B, body: `Publication depuis Sylvinia Studio.\n\n- Révision : ${out.revision}\n- Répliques différentes du jeu d'origine : ${n}\n- Modifiées depuis la dernière publication : ${changed}\n\nSeul le fichier \`${FILE_PATH}\` change. Vérifiez puis fusionnez pour mettre le jeu à jour.` }) });
      Mo.M.draft.meta.pendingRevision = out.revision;
      say("Demande de fusion créée. Relisez-la sur GitHub puis fusionnez : le jeu sera mis à jour au déploiement suivant.", "ok");
      log.appendChild(h("a", { href: pr.html_url, target: "_blank", rel: "noopener", style: { color: "var(--gold2)" } }, pr.html_url));
      snapshotVersion(`Publication révision ${out.revision}`);
    } catch (e) {
      say("Échec : " + e.message + (e.status === 401 ? " (jeton refusé)" : e.status === 403 || e.status === 404 ? " (droits insuffisants sur ce dépôt ?)" : ""), "err");
    }
  };
  return h("div", { class: "rows" },
    h("div", { class: "muted small" }, "Crée une branche de travail et une demande de fusion contenant uniquement studio/data/modifications.js. Rien n'est fusionné automatiquement. Utilisez un jeton « fine-grained » limité à ce dépôt, avec les droits Contents et Pull requests en lecture et écriture. Le jeton n'est jamais écrit dans le code : il reste dans ce navigateur, seulement si vous cochez « Mémoriser »."),
    h("div", { class: "rowx" }, repo, base),
    h("div", { class: "rowx" }, tok),
    h("div", { class: "rowx" }, h("label", { class: "kv small" }, remember, "Mémoriser le jeton sur cet appareil"),
      h("button", { class: "small", onclick: () => { localStorage.removeItem(TOKEN_KEY); tok.value = ""; remember.checked = false; toast("Jeton oublié sur cet appareil."); } }, "Oublier le jeton")),
    h("div", { class: "toolbar" }, h("button", { class: "gold", disabled: !v.ok, onclick: publish }, "Publier sur une branche de travail")),
    log);
}
