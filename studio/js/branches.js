/* Sylvinia Studio · arbre narratif : graphe des scènes, problèmes et éditeur de choix. */
import * as Mo from "./model.js";
import { h, clear, confirmBox, toast, datalist } from "./ui.js";
import { U, refresh, act, selectScene, selectLine, setTab, currentScene } from "./state.js";
import { numbersEditor, flagsEditor, chipsEditor, choiceConditionEditor, describeChoiceReq, describeEffects, ensureLists } from "./widgets.js";

export function renderBranches() {
  const root = document.getElementById("paneBranches");
  if (!root.offsetParent && U.tab !== "branches") return; // panneau caché : rendu au prochain affichage
  const keep = root.scrollTop;
  clear(root);
  ensureLists();
  if (!U.chapter) { root.appendChild(h("div", { class: "empty" }, "Choisissez un chapitre.")); return; }
  const an = Mo.analyze(U.chapter);
  root.appendChild(h("div", { class: "toolbar", style: { marginBottom: "8px" } },
    h("h2", null, "Embranchements"),
    h("span", { class: "muted small" }, "Touchez une scène pour modifier ses choix. Les scènes ne sont jamais fusionnées automatiquement.")));
  root.appendChild(problemsBox(an));
  root.appendChild(graph());
  root.appendChild(choiceEditor());
  root.scrollTop = keep;
}

function problemsBox(an) {
  const box = h("details", { class: "section", open: an.problems.some((p) => p.type !== "orphan") });
  const counts = an.problems.reduce((a, p) => { a[p.type] = (a[p.type] || 0) + 1; return a; }, {});
  box.appendChild(h("summary", null, h("b", null, "Vérification du chapitre : "),
    an.problems.length ? [counts.broken ? `${counts.broken} lien(s) cassé(s) · ` : "", counts.deadend ? `${counts.deadend} fin(s) sans suite · ` : "", counts.orphan ? `${counts.orphan} passage(s) sans lien entrant · ` : "", counts.locked ? `${counts.locked} choix verrouillé(s)` : ""].join("") : "aucun problème détecté."));
  const list = h("div", { class: "problems" });
  an.problems.slice(0, 150).forEach((p) => list.appendChild(h("div", { class: "problem " + p.type },
    h("code", null, p.id), h("span", { style: { flex: "1" } }, p.text),
    h("button", { class: "small", onclick: () => { selectLine(p.id); setTab("ecriture"); } }, "Ouvrir"))));
  box.appendChild(list);
  return box;
}

function graph() {
  const scenes = Mo.scenesOf(U.chapter);
  const sceneOf = new Map(); scenes.forEach((s) => s.ids.forEach((id) => sceneOf.set(id, s.index)));
  const edges = []; const ext = new Map(); const inCount = new Map();
  scenes.forEach((s) => s.ids.forEach((id) => Mo.children(Mo.node(id)).forEach((e) => {
    const t = sceneOf.get(e.to);
    if (t === s.index && e.to !== s.ids[0]) return;
    const cond = e.kind === "choice" && !!(e.choice.requires || e.choice.requiresFlags || (e.choice.requiresAnyFlags || []).length);
    if (t === undefined) { if (!ext.has(e.to)) ext.set(e.to, { id: e.to, n: Mo.node(e.to) }); edges.push({ from: s.index, ext: e.to, kind: e.kind, cond }); }
    else { edges.push({ from: s.index, to: t, kind: e.kind, cond }); inCount.set(t, (inCount.get(t) || 0) + 1); }
  })));
  /* profondeur par parcours en largeur depuis l'entrée */
  const depth = new Map(); const q = [0]; depth.set(0, 0);
  const adj = new Map(); edges.forEach((e) => { if (e.to === undefined) return; if (!adj.has(e.from)) adj.set(e.from, []); adj.get(e.from).push(e.to); });
  while (q.length) { const x = q.shift(); (adj.get(x) || []).forEach((y) => { if (!depth.has(y)) { depth.set(y, depth.get(x) + 1); q.push(y); } }); }
  let maxD = Math.max(0, ...depth.values());
  scenes.forEach((s) => { if (!depth.has(s.index)) { depth.set(s.index, maxD + 1); } });
  maxD = Math.max(0, ...depth.values());
  const cols = new Map(); scenes.forEach((s) => { const d = depth.get(s.index); if (!cols.has(d)) cols.set(d, []); cols.get(d).push(s.index); });
  const W = 190, H = 58, GX = 64, GY = 16, PAD = 16;
  const pos = new Map();
  cols.forEach((list, d) => list.forEach((si, row) => pos.set(si, { x: PAD + d * (W + GX), y: PAD + row * (H + GY) })));
  const extList = [...ext.values()];
  extList.forEach((e, i) => pos.set("ext:" + e.id, { x: PAD + (maxD + 1) * (W + GX), y: PAD + i * (H + GY) }));
  const width = PAD * 2 + (maxD + 2) * (W + GX);
  const height = PAD * 2 + Math.max(1, ...[...cols.values()].map((l) => l.length), extList.length) * (H + GY);
  const wrap = h("div", { class: "graph-wrap" });
  const g = h("div", { class: "graph", style: { width: width + "px", height: height + "px" } });
  const NS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(NS, "svg"); svg.setAttribute("width", width); svg.setAttribute("height", height);
  edges.forEach((e) => {
    const a = pos.get(e.from); const b = e.ext ? pos.get("ext:" + e.ext) : pos.get(e.to); if (!a || !b) return;
    const back = b.x <= a.x;
    const x1 = a.x + W, y1 = a.y + H / 2, x2 = b.x, y2 = b.y + H / 2;
    const p = document.createElementNS(NS, "path");
    const d = back ? `M${x1},${y1} C${x1 + 60},${y1 + 90} ${x2 - 60},${y2 + 90} ${x2},${y2}` : `M${x1},${y1} C${x1 + 36},${y1} ${x2 - 36},${y2} ${x2},${y2}`;
    p.setAttribute("d", d); p.setAttribute("fill", "none");
    p.setAttribute("stroke", e.kind === "choice" ? "rgba(233,201,133,.75)" : "rgba(190,190,210,.38)");
    p.setAttribute("stroke-width", e.kind === "choice" ? "1.6" : "1.2");
    if (e.cond || back) p.setAttribute("stroke-dasharray", e.cond ? "5 4" : "2 4");
    svg.appendChild(p);
  });
  g.appendChild(svg);
  const an = Mo.analyze(U.chapter); const bad = new Set(an.problems.filter((p) => p.type !== "orphan").map((p) => p.id));
  scenes.forEach((s) => {
    const p = pos.get(s.index);
    const isBad = s.ids.some((id) => bad.has(id));
    g.appendChild(h("button", { class: "gnode" + (s.id === U.scene ? " active" : "") + (s.choices >= 2 ? " branch" : "") + ((inCount.get(s.index) || 0) >= 2 ? " conv" : "") + (isBad ? " bad" : ""),
      style: { left: p.x + "px", top: p.y + "px" }, title: s.ids[0], onclick: () => selectScene(s.id) },
      h("span", { class: "t" }, `${s.index + 1}. ${s.title || "(sans titre)"}`),
      h("span", { class: "s" }, `${s.ids.length} répl.${s.choices ? " · ◆ " + s.choices + " choix" : ""}${(inCount.get(s.index) || 0) >= 2 ? " · convergence" : ""}${s.conditional ? " · ⚑" : ""}`)));
  });
  extList.forEach((e) => {
    const p = pos.get("ext:" + e.id);
    g.appendChild(h("button", { class: "gnode ext" + (e.n || Mo.isPeriod(e.id) ? "" : " bad"), style: { left: p.x + "px", top: p.y + "px" }, onclick: () => { if (e.n) { selectLine(e.id); } } },
      h("span", { class: "t" }, e.n ? (e.n.title || e.id) : Mo.isPeriod(e.id) ? "Temps libre · " + Mo.M.base.periods[e.id].title : "Introuvable"), h("span", { class: "s" }, (e.n ? Mo.chapter(Mo.chapterKey(e.id))?.number + " · " : "") + e.id)));
  });
  wrap.appendChild(g);
  const legend = h("div", { class: "muted small", style: { margin: "4px 2px 10px" } }, "Trait doré : choix · trait gris : suite directe · pointillés : choix sous condition ou retour en arrière · liseré bleu : convergence · cadre rouge : problème.");
  setTimeout(() => { const a = wrap.querySelector(".gnode.active"); if (a) { wrap.scrollLeft = Math.max(0, a.offsetLeft - 40); wrap.scrollTop = Math.max(0, a.offsetTop - 60); } }, 0);
  return h("div", null, wrap, legend);
}

/* ---------- éditeur de choix ---------- */
function destPicker(value, onChange) {
  const order = Mo.narrativeOrder(U.chapter);
  const sel = h("select", { class: "wide", "aria-label": "Destination" });
  const inChapter = order.includes(value);
  const scenes = Mo.scenesOf(U.chapter);
  scenes.forEach((s) => {
    const og = h("optgroup", { label: `${s.index + 1}. ${s.title || "(sans titre)"}` });
    s.ids.forEach((id, i) => { const n = Mo.node(id); og.appendChild(h("option", { value: id, selected: id === value }, `${i === 0 ? "▸ début de scène" : "  réplique " + (i + 1)} · ${(n.speaker || "")} : ${String(typeof n.text === "string" ? n.text : "").slice(0, 50)}`)); });
    sel.appendChild(og);
  });
  const og2 = h("optgroup", { label: "Spécial" });
  [["menu", "Retour au menu"]].forEach(([v, l]) => og2.appendChild(h("option", { value: v, selected: v === value }, l)));
  if (value && !inChapter && value !== "menu") og2.appendChild(h("option", { value, selected: true }, Mo.isPeriod(value) ? `Temps libre : ${Mo.M.base.periods[value].title} (${value})` : `Autre chapitre : ${(Mo.node(value) || {}).title || "?"} (${value})`));
  if (!value) sel.appendChild(h("option", { value: "", selected: true }, "(aucune destination)"));
  sel.appendChild(og2);
  sel.addEventListener("change", () => onChange(sel.value));
  datalist("dl-ids", Mo.allIds());
  const other = h("input", { list: "dl-ids", placeholder: "Identifiant d'une autre scène…", "aria-label": "Autre destination", style: { flex: "1", minWidth: "160px" } });
  other.addEventListener("change", () => { const v = other.value.trim(); if (!v) return; if (!Mo.exists(v) && !Mo.isPeriod(v) && v !== "menu") { toast("Identifiant inconnu : " + v, "error"); return; } onChange(v); });
  return h("div", { class: "rows" }, sel, h("div", { class: "rowx" }, other));
}

function choiceEditor() {
  const scene = currentScene(); if (!scene) return h("div");
  const box = h("div", null);
  let targets = scene.ids.filter((id) => (Mo.node(id).choices || []).length);
  if (U.line && scene.ids.includes(U.line) && (Mo.node(U.line).choices || []).length) targets = [U.line];
  box.appendChild(h("h3", { style: { margin: "6px 0 8px" } }, `Scène « ${scene.title || "(sans titre)"} »`));
  if (!targets.length) {
    const last = U.line && scene.ids.includes(U.line) ? U.line : scene.ids[scene.ids.length - 1];
    const n = Mo.node(last);
    box.appendChild(h("div", { class: "section" },
      h("div", null, "La réplique ", h("code", null, last), " n'a pas de choix. Elle mène directement à :"),
      destPicker(n.next || "", (v) => { act("Relier deux scènes", () => Mo.setField(last, "next", v || undefined)); refresh(); }),
      h("div", { class: "toolbar" }, h("button", { class: "gold", onclick: () => { act("Créer un embranchement", () => Mo.makeBranch(last)); refresh(); } }, "◆ Créer un embranchement ici"),
        h("span", { class: "muted small" }, "La suite actuelle devient la première réponse ; ajoutez ensuite les autres."))));
    return box;
  }
  targets.forEach((id) => box.appendChild(choicesOf(id)));
  return box;
}

function choicesOf(id) {
  const n = Mo.node(id);
  const list = Mo.clone(n.choices || []);
  const save = (label) => { act(label, () => Mo.setChoices(id, list)); refresh(); };
  const sec = h("div", { class: "section" },
    h("div", { class: "toolbar" }, h("b", null, "Choix de la réplique "), h("code", null, id),
      h("button", { class: "small", onclick: () => { selectLine(id); setTab("ecriture"); } }, "Voir le texte")),
    h("div", { class: "muted small", style: { fontFamily: "var(--serif)", fontSize: "15px" } }, String(typeof n.text === "string" ? n.text : "").slice(0, 220)));
  list.forEach((c, i) => {
    const lab = h("textarea", { rows: "1", "aria-label": "Libellé du choix " + (i + 1) }); lab.value = c.label || "";
    lab.addEventListener("change", () => { list[i].label = lab.value; save("Modifier un choix"); });
    const note = h("input", { class: "wide", value: c.note || "", placeholder: "Note affichée sous le choix", "aria-label": "Note du choix" });
    note.addEventListener("change", () => { if (note.value) list[i].note = note.value; else delete list[i].note; save("Modifier une note de choix"); });
    const setKey = (k, v) => { if (v === undefined) delete list[i][k]; else list[i][k] = v; save("Modifier un choix"); };
    const preserved = Object.keys(c).filter((k) => !["label", "next", "note", "effects", "requires", "requiresFlags", "requiresAnyFlags", "flags", "items", "memories", "skipHistory"].includes(k));
    const adv = h("details", null, h("summary", { class: "small" }, "Conséquences et prérequis",
      describeChoiceReq(c) ? h("span", { class: "badge cond", style: { marginLeft: "6px" } }, "requis : " + describeChoiceReq(c)) : null,
      describeEffects(c.effects) ? h("span", { class: "badge", style: { marginLeft: "6px" } }, describeEffects(c.effects)) : null),
      h("div", { class: "rows", style: { marginTop: "8px" } },
        h("div", { class: "field" }, h("span", null, "Effets sur les statistiques"), numbersEditor(c.effects, (v) => setKey("effects", v || {}), { addLabel: "+ Effet" })),
        h("div", { class: "field" }, h("span", null, "Drapeaux posés par ce choix"), flagsEditor(c.flags && typeof c.flags === "object" ? c.flags : {}, (v) => setKey("flags", v))),
        choiceConditionEditor(c, (k, v) => setKey(k, v)),
        h("div", { class: "grid2" },
          h("div", { class: "field" }, h("span", null, "Souvenirs débloqués"), chipsEditor(c.memories, (v) => setKey("memories", v), "dl-memories", "Souvenir…")),
          h("div", { class: "field" }, h("span", null, "Objets obtenus"), chipsEditor(c.items, (v) => setKey("items", v), "dl-items", "Objet…"))),
        preserved.length ? h("div", { class: "muted small" }, "Propriétés du moteur conservées telles quelles : " + preserved.join(", ")) : null));
    sec.appendChild(h("div", { class: "choice-card" },
      h("div", { class: "hd" }, h("b", null, `RÉPONSE ${i + 1}`), h("span", { style: { flex: "1" } }),
        h("button", { class: "small icon", "aria-label": "Monter", disabled: i === 0, onclick: () => { [list[i - 1], list[i]] = [list[i], list[i - 1]]; save("Réordonner les choix"); } }, "▲"),
        h("button", { class: "small icon", "aria-label": "Descendre", disabled: i === list.length - 1, onclick: () => { [list[i + 1], list[i]] = [list[i], list[i + 1]]; save("Réordonner les choix"); } }, "▼"),
        h("button", { class: "small danger", onclick: async () => { if (!(await confirmBox("Supprimer la réponse", `Supprimer la réponse « ${c.label} » ? La scène visée reste en place.`, "Supprimer", true))) return; list.splice(i, 1); save("Supprimer une réponse"); } }, "Supprimer")),
      lab, note,
      h("div", { class: "field" }, h("span", null, "Mène à"), destPicker(c.next, (v) => { list[i].next = v; save("Changer la destination d'un choix"); })),
      adv));
  });
  sec.appendChild(h("div", { class: "toolbar" },
    h("button", { onclick: () => { list.push({ label: "Nouvelle réponse", next: list[0] ? list[0].next : "", effects: {}, note: "" }); save("Ajouter une réponse"); } }, "+ Ajouter une réponse"),
    h("button", { class: "small", onclick: () => { const nid = act("Créer une scène de conséquence", () => {
      const key = U.chapter; const back = list[0] ? list[0].next : "";
      const created = Mo.createNode(key, { title: "Conséquence", sub: "", speaker: "Narrateur", text: "", chars: Mo.clone(n.chars || []), bg: n.bg || "", music: n.music || "", next: back });
      list.push({ label: "Nouvelle réponse", next: created, effects: {}, note: "" });
      Mo.setChoices(id, list);
      return created;
    }); if (nid) { toast("Nouvelle réponse et sa scène de conséquence créées : elle rejoint ensuite la suite commune."); selectLine(nid); setTab("ecriture"); } } }, "+ Réponse avec nouvelle scène")));
  return sec;
}
