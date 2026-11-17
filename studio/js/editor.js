/* Sylvinia Studio · éditeur de dialogues ligne par ligne. */
import * as Mo from "./model.js";
import { h, clear, autoGrow, toast, confirmBox, modal, debounce } from "./ui.js";
import { U, refresh, act, selectLine, setTab, currentScene, selectScene, saveUi } from "./state.js";
import { visibilityEditor, describeCond, ensureLists, describeChoiceReq, describeEffects } from "./widgets.js";
import { testFrom } from "./preview.js";

const openDetails = new Set();
let dragId = null;

export function renderEditor() {
  const root = document.getElementById("paneEcriture");
  const keep = root.scrollTop;
  clear(root);
  ensureLists();
  if (!U.chapter) { root.appendChild(h("div", { class: "empty" }, "Choisissez un chapitre dans la bibliothèque pour commencer.", U.layout === "desktop" ? null : h("div", null, h("button", { class: "gold", style: { marginTop: "14px" }, onclick: () => setTab("chapitres") }, "Ouvrir la bibliothèque")))); return; }
  const scene = currentScene();
  if (!scene) { root.appendChild(h("div", { class: "empty" }, "Ce chapitre ne contient aucune scène.")); return; }
  root.appendChild(sceneHead(scene));
  root.appendChild(toolbar(scene));
  if (U.find.open) root.appendChild(findBar());
  const list = h("div", { class: "lines", id: "lines" });
  scene.ids.forEach((id, i) => list.appendChild(lineCard(id, i, scene)));
  list.appendChild(h("div", { class: "toolbar" },
    h("button", { onclick: () => addLine(scene.ids[scene.ids.length - 1], false) }, "+ Réplique à la fin"),
    h("button", { onclick: () => addLine(scene.ids[scene.ids.length - 1], true) }, "+ Narration à la fin"),
    nextSceneButton(scene)));
  root.appendChild(list);
  root.scrollTop = keep;
  root.querySelectorAll("textarea").forEach(autoGrow);
}

function nextSceneButton(scene) {
  const list = Mo.scenesOf(U.chapter); const i = list.findIndex((s) => s.id === scene.id);
  return h("span", { class: "toolbar", style: { marginLeft: "auto" } },
    i > 0 ? h("button", { onclick: () => { selectScene(list[i - 1].id); document.getElementById("paneEcriture").scrollTop = 0; } }, "‹ Scène précédente") : null,
    i < list.length - 1 ? h("button", { onclick: () => { selectScene(list[i + 1].id); document.getElementById("paneEcriture").scrollTop = 0; } }, "Scène suivante ›") : null);
}

function sceneHead(scene) {
  const c = Mo.chapter(U.chapter);
  const list = Mo.scenesOf(U.chapter);
  const idx = list.findIndex((s) => s.id === scene.id);
  const title = h("input", { value: scene.title, "aria-label": "Titre de la scène", title: "Renommer la scène" });
  title.addEventListener("change", () => { act("Renommer la scène", () => Mo.renameScene(U.chapter, scene.id, title.value)); refresh(); });
  const head = h("div", { class: "scene-head" + (sceneOpsOpen ? " open" : "") });
  sceneHeadBody(head, scene, c, list, idx, title).forEach((x) => head.appendChild(x));
  return head;
}
let sceneOpsOpen = false;
function sceneHeadBody(head, scene, c, list, idx, title) {
  return [
    h("div", { class: "muted small" }, `${c.number} · scène ${idx + 1} sur ${list.length}`),
    h("div", { class: "title-row" }, title,
      scene.conditional ? h("span", { class: "badge cond" }, "⚑ conditionnelle") : null,
      h("button", { class: "small scene-ops-toggle", "aria-expanded": String(sceneOpsOpen), onclick: () => { sceneOpsOpen = !sceneOpsOpen; head.classList.toggle("open", sceneOpsOpen); } }, "Scène ▾"),
      h("button", { class: "gold", onclick: () => testFrom(scene.ids[0]) }, "▶ Tester cette scène")),
    h("div", { class: "toolbar scene-ops" },
      h("button", { class: "small", title: "Échanger avec la scène précédente", onclick: () => sceneOp("Monter la scène", () => Mo.moveScene(U.chapter, scene.id, -1)) }, "▲ Monter"),
      h("button", { class: "small", title: "Échanger avec la scène suivante", onclick: () => sceneOp("Descendre la scène", () => Mo.moveScene(U.chapter, scene.id, 1)) }, "▼ Descendre"),
      h("button", { class: "small", onclick: () => { const id = act("Ajouter une scène", () => Mo.addSceneAfter(U.chapter, scene.id, "Nouvelle scène")); if (id) { selectLine(id); toast("Nouvelle scène ajoutée après celle-ci."); } } }, "+ Scène après"),
      h("button", { class: "small", onclick: () => { const r = act("Dupliquer la scène", () => Mo.duplicateScene(U.chapter, scene.id)); if (r) { selectLine(r.first); toast(r.attached ? "Copie insérée juste après la scène." : "Copie créée, détachée du récit (la scène d'origine se termine par un choix)."); } } }, "Dupliquer"),
      h("button", { class: "small danger", onclick: async () => {
        if (!(await confirmBox("Retirer la scène", `Retirer « ${scene.title} » du déroulement ? Les répliques restent connues du jeu (une sauvegarde arrêtée dessus continue de fonctionner) mais plus aucun passage n'y mène.`, "Retirer", true))) return;
        sceneOp("Retirer la scène", () => Mo.removeScene(U.chapter, scene.id));
      } }, "Retirer"))];
}
function sceneOp(label, fn) { act(label, fn); refresh(); }

function toolbar(scene) {
  const n = U.selected.size;
  const allSel = scene.ids.every((id) => U.selected.has(id));
  return h("div", { class: "toolbar sticky-tools" },
    h("button", { onclick: () => addLine(U.line || scene.ids[scene.ids.length - 1], false), title: "Insérer une réplique après la réplique sélectionnée" }, "+ Réplique"),
    h("button", { onclick: () => addLine(U.line || scene.ids[scene.ids.length - 1], true) }, "+ Narration"),
    h("button", { class: "small", onclick: () => { if (allSel) U.selected.clear(); else scene.ids.forEach((id) => U.selected.add(id)); refresh(["editor"]); } }, allSel ? "Désélectionner" : "Tout sélectionner"),
    h("button", { class: "small", disabled: !n, onclick: copySelection }, `Copier${n ? " (" + n + ")" : ""}`),
    h("button", { class: "small", onclick: pasteDialog }, "Coller"),
    h("button", { class: "small" + (U.find.open ? " on" : ""), onclick: () => { U.find.open = !U.find.open; refresh(["editor"]); } }, "Rechercher"));
}

function lineCard(id, i, scene) {
  const n = Mo.node(id);
  const dyn = Mo.isDynamicText(id);
  const narr = !n.speaker || /^Narrat/i.test(n.speaker);
  const isSel = U.line === id;
  const changed = !Mo.same(Mo.M.draft.nodes[id], Mo.M.published.nodes[id]);
  const card = h("div", { class: "line" + (isSel ? " sel" : "") + (narr ? " narr" : ""), "data-id": id });
  card.addEventListener("click", (e) => { if (U.line !== id && !e.target.closest("button,input,select,textarea")) { U.line = id; saveUi(); markSel(id); refresh(["visuals", "branches", "crumbs"]); } });
  card.addEventListener("focusin", () => { if (U.line !== id) { U.line = id; saveUi(); markSel(id); refresh(["visuals", "branches", "crumbs"]); } });

  const handle = h("span", { class: "handle", title: "Glisser pour déplacer (ou utiliser ▲ ▼)", "aria-hidden": "true" }, "⋮⋮");
  handle.addEventListener("pointerdown", () => { card.draggable = true; });
  card.addEventListener("dragstart", (e) => { dragId = id; card.classList.add("dragging"); e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", id); });
  card.addEventListener("dragend", () => { card.draggable = false; card.classList.remove("dragging"); dragId = null; document.querySelectorAll(".drop-before,.drop-after").forEach((x) => x.classList.remove("drop-before", "drop-after")); });
  card.addEventListener("dragover", (e) => { if (!dragId || dragId === id) return; e.preventDefault(); const r = card.getBoundingClientRect(); const after = e.clientY > r.top + r.height / 2; card.classList.toggle("drop-after", after); card.classList.toggle("drop-before", !after); });
  card.addEventListener("dragleave", () => card.classList.remove("drop-before", "drop-after"));
  card.addEventListener("drop", (e) => { e.preventDefault(); const after = card.classList.contains("drop-after"); card.classList.remove("drop-before", "drop-after"); dropLine(dragId, id, after); });

  const check = h("input", { type: "checkbox", checked: U.selected.has(id), "aria-label": "Sélectionner la réplique " + (i + 1) });
  check.addEventListener("change", () => { if (check.checked) U.selected.add(id); else U.selected.delete(id); refresh(["editor"]); });
  const speaker = h("input", { class: "speaker", value: n.speaker || "Narrateur", list: "dl-speakers", "aria-label": "Personnage" });
  speaker.addEventListener("change", () => commit(id, "speaker", speaker.value.trim() || "Narrateur", true));

  const badges = [];
  if (n.studioIf) badges.push(h("span", { class: "badge cond", title: describeCond(n.studioIf) }, "⚑ condition"));
  if (n.sfx) badges.push(h("span", { class: "badge", title: n.sfx }, "♪ son"));
  Mo.specialOf(n).slice(0, 2).forEach((s) => badges.push(h("span", { class: "badge special" }, s.label)));
  if (n.studioNew) badges.push(h("span", { class: "badge brouillon" }, "nouvelle"));
  else if (changed) badges.push(h("span", { class: "badge modifie" }, "modifiée"));

  const up = h("button", { class: "small icon", title: "Monter", "aria-label": "Monter la réplique", onclick: () => lineOp("Monter une réplique", () => Mo.moveUp(id)) }, "▲");
  const down = h("button", { class: "small icon", title: "Descendre", "aria-label": "Descendre la réplique", onclick: () => lineOp("Descendre une réplique", () => Mo.moveDown(id)) }, "▼");
  card.appendChild(h("div", { class: "line-head" }, handle, check, h("span", { class: "n" }, String(i + 1)), speaker,
    h("span", { class: "code", title: "Identifiant stable (sauvegardes)" }, id), ...badges, h("span", { class: "spacer" }), up, down));

  if (n.direction || openDetails.has(id)) {
    const dir = h("input", { class: "direction wide", value: n.direction || "", placeholder: "Indication de mise en scène (affichée en italique avant la réplique)", "aria-label": "Indication de mise en scène" });
    dir.addEventListener("input", debounce(() => commit(id, "direction", dir.value || undefined), 300));
    card.appendChild(dir);
  }
  const ta = h("textarea", { rows: "2", spellcheck: "true", lang: "fr", "aria-label": "Texte de la réplique " + (i + 1), disabled: dyn });
  ta.value = dyn ? "(Texte calculé par le moteur à l'affichage : non modifiable ici, il reste préservé.)" : String(n.text || "");
  ta.addEventListener("input", () => { autoGrow(ta); typing(id, ta.value); });
  card.appendChild(ta);

  if (n.choices && n.choices.length) {
    card.appendChild(h("div", { class: "choice-mini" },
      h("div", { class: "muted small" }, `◆ ${n.choices.length} choix`),
      n.choices.map((c, ci) => {
        const lab = h("input", { class: "wide", value: c.label || "", "aria-label": "Libellé du choix " + (ci + 1), style: { fontFamily: "var(--serif)", fontSize: "16px" } });
        lab.addEventListener("input", debounce(() => { const list = Mo.clone(Mo.node(id).choices); list[ci].label = lab.value; commit(id, "choices", list, false, "choice:" + id + ":" + ci); }, 300));
        const dest = Mo.node(c.next);
        const req = describeChoiceReq(c), eff = describeEffects(c.effects);
        return h("div", { class: "rowx" }, lab, h("span", { class: "muted small" }, "→ " + (dest ? (dest.title || c.next) : c.next) + (req ? " · requis : " + req : "") + (eff ? " · " + eff : "")));
      }),
      h("div", null, h("button", { class: "small", onclick: () => { U.line = id; setTab("branches"); } }, "Modifier les choix, destinations et conditions"))));
  }
  const sp = Mo.specialOf(n);
  if (sp.length) card.appendChild(h("div", { class: "special" }, h("b", null, "Événement spécial : "), sp.map((s) => s.label).join(", "),
    h("div", { class: "muted small" }, "Ce bloc est géré par le moteur : il est conservé tel quel. Ses paramètres pris en charge sont modifiables dans l'onglet Visuels."),
    h("pre", null, sp.map((s) => `${s.key} : ${JSON.stringify(s.value)}`).join("\n").slice(0, 900))));

  {
    card.appendChild(h("div", { class: "acts" },
      h("button", { class: "small", onclick: () => addLine(id, false, true) }, "Insérer avant"),
      h("button", { class: "small", onclick: () => addLine(id, false) }, "Insérer après"),
      h("button", { class: "small", onclick: () => duplicateLine(id) }, "Dupliquer"),
      h("button", { class: "small", onclick: () => moveAfterDialog(id, scene) }, "Déplacer après…"),
      h("button", { class: "small", onclick: () => { setTab("visuels"); } }, "Mise en scène"),
      h("button", { class: "small" + (openDetails.has(id) ? " on" : ""), onclick: () => { openDetails.has(id) ? openDetails.delete(id) : openDetails.add(id); refresh(["editor"]); } }, "Détails"),
      h("button", { class: "small gold", onclick: () => testFrom(id) }, "▶ Tester d'ici"),
      h("button", { class: "small danger", onclick: () => removeLine(id) }, "Retirer")));
  }
  if (openDetails.has(id)) card.appendChild(details(id, n));
  return card;
}
function markSel(id) { document.querySelectorAll(".line.sel").forEach((x) => x.classList.remove("sel")); const el = document.querySelector(`.line[data-id="${id}"]`); if (el) el.classList.add("sel"); }

function details(id, n) {
  const sub = h("input", { value: n.sub || "", "aria-label": "Sous-titre" });
  sub.addEventListener("change", () => commit(id, "sub", sub.value, true));
  const note = h("textarea", { rows: "2", placeholder: "Note d'auteur (jamais affichée en jeu)", style: { fontFamily: "var(--sans)", fontSize: "13px" } });
  note.value = n.studioNote || "";
  note.addEventListener("change", () => commit(id, "studioNote", note.value || undefined, true));
  const sfx = h("select", { "aria-label": "Effet sonore" }, h("option", { value: "" }, "Aucun effet sonore"), Mo.catalogs().audio.map((k) => h("option", { value: k, selected: n.sfx === k }, k)));
  sfx.addEventListener("change", () => commit(id, "sfx", sfx.value || undefined, true));
  return h("div", { class: "details" },
    h("div", { class: "grid2" },
      h("label", { class: "field" }, h("span", null, "Sous-titre affiché"), sub),
      h("label", { class: "field" }, h("span", null, "Effet sonore à l'arrivée sur la réplique"), sfx)),
    visibilityEditor(n.studioIf, (v) => commit(id, "studioIf", v, true)),
    h("label", { class: "field" }, h("span", null, "Note d'auteur"), note),
    h("div", { class: "muted small" }, `Suite : ${n.next || "(aucune)"} · ${Mo.refsTo(id).length} passage(s) mènent ici.`));
}

/* ---------- écriture ---------- */
const typingTimers = new Map();
function typing(id, value) {
  clearTimeout(typingTimers.get(id));
  setStatusDirty();
  typingTimers.set(id, setTimeout(() => commit(id, "text", value, false, "text:" + id), 250));
}
function setStatusDirty() { const s = document.getElementById("saveState"); if (s) { s.textContent = "Modification…"; s.className = "save-state dirty"; } }
export function commit(id, field, value, rerender, coalesce) {
  U.quiet = !rerender;
  act(field === "text" ? "Modifier une réplique" : "Modifier " + field, () => Mo.setField(id, field, value), { coalesce: coalesce || (field + ":" + id) });
  U.quiet = false;
  if (rerender) refresh();
}
function lineOp(label, fn) { act(label, fn); refresh(); }
function addLine(afterId, narration, before) {
  if (!afterId) return;
  const fields = narration ? { speaker: "Narrateur", chars: Mo.node(afterId).chars || [] } : { speaker: guessSpeaker(afterId) };
  const nid = act(narration ? "Ajouter une narration" : "Ajouter une réplique", () => before ? Mo.insertBefore(afterId, fields) : Mo.insertAfter(afterId, fields));
  if (nid) { selectLine(nid); setTimeout(() => { const ta = document.querySelector(`.line[data-id="${nid}"] textarea`); if (ta) ta.focus(); }, 120); }
}
function guessSpeaker(id) {
  /* réplique de dialogue : on propose l'autre interlocuteur de la scène */
  const s = Mo.sceneOfLine(U.chapter, id); const cur = Mo.node(id).speaker;
  const others = (s ? s.ids : []).map((x) => Mo.node(x).speaker).filter((x) => x && !/^Narrat/i.test(x) && x !== cur);
  return others[others.length - 1] || (cur && !/^Narrat/i.test(cur) ? cur : "Hylee");
}
function duplicateLine(id) {
  const n = Mo.node(id);
  const nid = act("Dupliquer une réplique", () => Mo.insertAfter(id, Mo.pickEditable(Object.assign({}, n, { next: undefined, choices: undefined }))));
  if (nid) selectLine(nid);
}
async function removeLine(id) {
  const n = Mo.node(id);
  if (!(await confirmBox("Retirer la réplique", `Retirer cette réplique du déroulement ?\n« ${String(n.text || "").slice(0, 140)} »\nElle reste connue du jeu pour les sauvegardes existantes. Vous pouvez annuler avec ↶.`, "Retirer", true))) return;
  lineOp("Retirer une réplique", () => Mo.removeLine(id));
}
function dropLine(src, target, after) {
  if (!src || src === target) return;
  act("Déplacer une réplique", () => {
    if (after) Mo.moveAfter(src, src, target);
    else {
      const prevs = Mo.refsTo(target).filter((r) => r.kind === "next");
      if (prevs.length !== 1) throw new Error("Impossible de placer la réplique ici : plusieurs passages (ou aucun) mènent à cet endroit.");
      if (prevs[0].from === src) return;
      Mo.moveAfter(src, src, prevs[0].from);
    }
  });
  refresh();
}
function moveAfterDialog(id, scene) {
  const order = Mo.narrativeOrder(U.chapter).filter((x) => x !== id && Mo.canInsertAfter(x));
  const sel = h("select", { class: "wide", "aria-label": "Réplique de destination" }, order.map((x) => { const n = Mo.node(x); return h("option", { value: x, selected: scene.ids.includes(x) && x === scene.ids[scene.ids.length - 1] }, `${n.title || "?"} · ${n.speaker || ""} : ${String(n.text || "").slice(0, 60)}`); }));
  modal("Déplacer la réplique après…", h("div", { class: "field" }, h("span", null, "Placer la réplique juste après :"), sel), [
    { label: "Annuler" },
    { label: "Déplacer", class: "gold", onclick: () => { lineOp("Déplacer une réplique", () => Mo.moveAfter(id, id, sel.value)); } },
  ]);
}

/* ---------- copier / coller ---------- */
function lineToText(n) { return (/^Narrat/i.test(n.speaker || "Narrateur") ? "" : (n.speaker + " : ")) + String(n.text || ""); }
function copySelection() {
  const order = Mo.narrativeOrder(U.chapter).filter((id) => U.selected.has(id));
  const extra = [...U.selected].filter((id) => !order.includes(id));
  const ids = [...order, ...extra];
  U.clipboard = ids.map((id) => { const n = Mo.node(id); return Mo.pickEditable(Object.assign({}, n, { next: undefined, choices: undefined, studioNew: undefined })); });
  const text = ids.map((id) => lineToText(Mo.node(id))).join("\n\n");
  try { navigator.clipboard && navigator.clipboard.writeText(text); } catch {}
  toast(`${ids.length} réplique(s) copiée(s).`);
}
export function parsePassage(text) {
  return String(text || "").replace(/\r\n/g, "\n").split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean).map((p) => {
    const m = /^([^:\n«»]{1,32}?)\s*:\s*([\s\S]+)$/.exec(p);
    if (m && !/^(https?|Note)$/i.test(m[1].trim())) return { speaker: m[1].trim(), text: m[2].trim() };
    return { speaker: "Narrateur", text: p };
  });
}
function pasteDialog() {
  const target = U.line;
  if (!target) return;
  if (!Mo.canInsertAfter(target)) { toast("La réplique sélectionnée se termine par un choix : sélectionnez une autre réplique pour coller après elle.", "error"); return; }
  const ta = h("textarea", { rows: "8", placeholder: "Une réplique par paragraphe.\nPour un personnage : « Remerii : texte ».\nSans nom : narration." });
  const body = h("div", { class: "rows" },
    U.clipboard ? h("div", { class: "msg ok" }, `${U.clipboard.length} réplique(s) copiée(s) dans le Studio, avec leur mise en scène.`) : null,
    h("label", { class: "field" }, h("span", null, "Ou collez un passage complet :"), ta));
  const insert = (items) => {
    let last = target; let first = null;
    act("Coller un passage", () => { items.forEach((it) => { last = Mo.insertAfter(last, it); if (!first) first = last; }); });
    if (first) { selectLine(first); toast(`${items.length} réplique(s) insérée(s).`); }
  };
  modal("Coller après la réplique sélectionnée", body, [
    { label: "Annuler" },
    U.clipboard ? { label: "Coller les répliques copiées", onclick: () => insert(U.clipboard.map(Mo.clone)) } : null,
    { label: "Insérer le passage", class: "gold", onclick: () => { const items = parsePassage(ta.value); if (!items.length) { toast("Le passage est vide.", "error"); return false; } const base = Mo.node(target); insert(items.map((x) => Object.assign({ chars: Mo.clone(base.chars || []) }, x))); } },
  ].filter(Boolean));
  setTimeout(() => ta.focus(), 60);
}

/* ---------- rechercher / remplacer ---------- */
function findBar() {
  const f = U.find;
  const q = h("input", { type: "search", value: f.q, placeholder: "Rechercher…", "aria-label": "Rechercher" });
  const r = h("input", { value: f.r, placeholder: "Remplacer par…", "aria-label": "Remplacer par" });
  const scope = h("select", { "aria-label": "Portée" }, [["scene", "Cette scène"], ["chapter", "Ce chapitre"], ["all", "Tout le Mode Histoire"]].map(([v, l]) => h("option", { value: v, selected: f.scope === v }, l)));
  const cs = h("label", { class: "kv small" }, h("input", { type: "checkbox", checked: f.cs }), "Respecter la casse");
  const results = h("div", { class: "list", style: { gridColumn: "1/-1", maxHeight: "220px", overflow: "auto" } });
  const draw = () => {
    f.q = q.value; f.r = r.value; f.scope = scope.value; f.cs = cs.querySelector("input").checked;
    clear(results);
    const hits = findHits();
    results.appendChild(h("div", { class: "muted small" }, f.q ? `${hits.length} occurrence(s)` : "Saisissez un texte à rechercher."));
    hits.slice(0, 60).forEach((hit) => results.appendChild(h("div", { class: "it" },
      h("span", { class: "grow small" }, h("b", null, hit.where), " · ", hit.excerpt),
      h("button", { class: "small", onclick: () => selectLine(hit.id) }, "Voir"),
      h("button", { class: "small", onclick: () => { replaceHits([hit]); draw(); } }, "Remplacer"))));
  };
  [q, r].forEach((x) => x.addEventListener("input", debounce(draw, 200)));
  scope.addEventListener("change", draw); cs.addEventListener("change", draw);
  setTimeout(draw, 0);
  return h("div", { class: "findbar" }, q, r,
    h("div", { class: "row" }, scope, cs,
      h("button", { class: "small gold", onclick: () => { const hits = findHits(); if (!hits.length) return; replaceHits(hits); toast(`${hits.length} remplacement(s).`); draw(); } }, "Tout remplacer"),
      h("button", { class: "small", onclick: () => { U.find.open = false; refresh(["editor"]); } }, "Fermer")),
    results);
}
function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
function findHits() {
  const f = U.find; if (!f.q) return [];
  const re = new RegExp(escapeRe(f.q), f.cs ? "g" : "gi");
  const ids = f.scope === "scene" ? (currentScene() || { ids: [] }).ids : f.scope === "chapter" ? Mo.narrativeOrder(U.chapter) : Mo.allIds().filter((id) => !Mo.node(id).studioRemoved);
  const hits = [];
  ids.forEach((id) => {
    const n = Mo.node(id); if (!n) return;
    if (typeof n.text === "string" && !Mo.isDynamicText(id)) { re.lastIndex = 0; const m = re.exec(n.text); if (m) hits.push({ id, field: "text", where: `${n.title || id}`, excerpt: n.text.slice(Math.max(0, m.index - 40), m.index + 60) }); }
    (n.choices || []).forEach((c, i) => { re.lastIndex = 0; if (c && typeof c.label === "string" && re.test(c.label)) hits.push({ id, field: "choice", index: i, where: `${n.title || id} · choix ${i + 1}`, excerpt: c.label.slice(0, 100) }); });
  });
  return hits;
}
function replaceHits(hits) {
  const f = U.find; const re = new RegExp(escapeRe(f.q), f.cs ? "g" : "gi");
  act("Rechercher et remplacer", () => {
    hits.forEach((hit) => {
      const n = Mo.node(hit.id);
      if (hit.field === "text") Mo.setField(hit.id, "text", n.text.replace(re, () => f.r));
      else { const list = Mo.clone(n.choices); list[hit.index].label = list[hit.index].label.replace(re, () => f.r); Mo.setField(hit.id, "choices", list); }
    });
  });
  refresh();
}
