/* Sylvinia Studio · aperçu dans le vrai moteur, avec un état de test isolé. */
import * as Mo from "./model.js";
import { h, clear, toast, debounce } from "./ui.js";
import { U, setTab, saveUi, currentScene } from "./state.js";
import { numbersEditor, flagsEditor, chipsEditor, statLabel } from "./widgets.js";

const HANDOFF = "sylvinia_studio_preview_v1";
let built = false, frame = null, ready = false, lastScene = null;
let simBox = null, emptyBox = null;

function handoff(scene) {
  const data = { at: new Date().toISOString(), scene, patch: Mo.exportPatch(), sim: U.preview.sim, mute: U.preview.mute };
  try { localStorage.setItem(HANDOFF, JSON.stringify(data)); }
  catch (e) { toast("Impossible de préparer l'aperçu : stockage du navigateur plein.", "error"); return false; }
  return true;
}
export function testFrom(id) {
  if (!id || !Mo.node(id)) return;
  lastScene = id;
  if (!handoff(id)) return;
  const app = document.getElementById("app");
  if (U.layout === "compact") setTab("apercu");
  else if (app.classList.contains("nopreview")) { app.classList.remove("nopreview"); U.preview.shown = true; saveUi(); }
  buildPreview();
  ready = false;
  emptyBox.style.display = "none";
  frame.src = "../index.html?studio=preview&t=" + Date.now();
}
export function pushPatch() {
  if (!frame || !ready) return;
  try { frame.contentWindow.postMessage({ type: "sylvinia-studio:patch", patch: Mo.exportPatch() }, location.origin); } catch {}
}
export const pushPatchSoon = debounce(pushPatch, 350);
window.addEventListener("message", (e) => {
  if (e.origin !== location.origin || !e.data) return;
  if (e.data.type === "sylvinia-studio:ready") ready = true;
});

export function buildPreview() {
  const root = document.getElementById("panePreview");
  if (built) return;
  built = true;
  clear(root);
  const muteBtn = h("button", { class: "small", onclick: () => { U.preview.mute = !U.preview.mute; muteBtn.textContent = U.preview.mute ? "Son coupé" : "Son actif"; saveUi(); toast("Pris en compte au prochain lancement de l'aperçu."); } }, U.preview.mute ? "Son coupé" : "Son actif");
  const simBtn = h("button", { class: "small" + (U.preview.simOpen ? " on" : ""), onclick: () => { U.preview.simOpen = !U.preview.simOpen; simBtn.classList.toggle("on", U.preview.simOpen); simBox.classList.toggle("hidden", !U.preview.simOpen); renderSim(); saveUi(); } }, "État de test");
  root.appendChild(h("div", { class: "pv-bar" },
    h("button", { class: "small gold", onclick: () => { const s = currentScene(); if (s) testFrom(s.ids[0]); } }, "▶ Tester cette scène"),
    h("button", { class: "small", onclick: () => testFrom(U.line) }, "▶ D'ici"),
    h("button", { class: "small", title: "Relancer l'aperçu", onclick: () => testFrom(lastScene || U.line) }, "⟳"),
    simBtn, muteBtn,
    h("span", { class: "grow" }),
    h("button", { class: "small", title: "Ouvrir l'aperçu dans un nouvel onglet", onclick: () => { const id = lastScene || U.line; if (!id || !handoff(id)) return; window.open("../index.html?studio=preview&t=" + Date.now(), "_blank"); } }, "Plein écran ↗"),
    h("button", { class: "small back-edit", onclick: () => setTab("ecriture") }, "← Revenir à l'édition")));
  simBox = h("div", { class: "pv-sim" + (U.preview.simOpen ? "" : " hidden") });
  root.appendChild(simBox);
  frame = h("iframe", { title: "Aperçu du jeu", allow: "autoplay; fullscreen" });
  emptyBox = h("div", { class: "pv-empty" }, h("div", null, h("div", { class: "sigil", style: { fontSize: "28px" } }, "✦"),
    "Touchez « Tester cette scène » pour lancer le vrai moteur du jeu à cet endroit.",
    h("div", { class: "muted small", style: { fontFamily: "var(--sans)", marginTop: "8px" } }, "L'aperçu utilise un état de test isolé : vos sauvegardes de joueur ne sont jamais touchées.")));
  root.appendChild(h("div", { class: "pv-frame" }, frame, emptyBox));
  renderSim();
}
export function renderPreview() {
  buildPreview();
  const back = document.querySelector(".pv-bar .back-edit"); if (back) back.style.display = U.layout === "compact" ? "" : "none";
}

function renderSim() {
  if (!simBox || !U.preview.simOpen) return;
  clear(simBox);
  const sim = U.preview.sim;
  const changed = () => { saveUi(); };
  const stats = h("div", { class: "stats-grid" }, Mo.catalogs().stats.map((k) => {
    const inp = h("input", { type: "number", value: (sim.stats || {})[k] ?? 0, min: 0, step: 1, inputmode: "numeric", "aria-label": statLabel(k) });
    inp.addEventListener("change", () => { sim.stats = Object.assign({}, sim.stats, { [k]: Number(inp.value) || 0 }); changed(); });
    return h("label", null, statLabel(k), inp);
  }));
  const extra = h("textarea", { rows: "3", style: { fontFamily: "ui-monospace,monospace", fontSize: "12px" }, placeholder: '{"c7Naiah": {"pacte": 3}}' });
  extra.value = sim.extra && Object.keys(sim.extra).length ? JSON.stringify(sim.extra, null, 1) : "";
  extra.addEventListener("change", () => { try { sim.extra = extra.value.trim() ? JSON.parse(extra.value) : {}; extra.style.borderColor = ""; changed(); } catch { extra.style.borderColor = "var(--red)"; toast("JSON invalide : corrigez avant de tester.", "error"); } });
  simBox.appendChild(h("div", { class: "muted small" }, "Valeurs utilisées au lancement de l'aperçu. Elles ne touchent jamais une vraie sauvegarde."));
  simBox.appendChild(h("div", { class: "field" }, h("span", null, "Statistiques"), stats));
  simBox.appendChild(h("div", { class: "field" }, h("span", null, "Drapeaux narratifs et événements accomplis"), flagsEditor(sim.flags, (v) => { sim.flags = v || {}; changed(); renderSim(); })));
  simBox.appendChild(h("div", { class: "field" }, h("span", null, "Choix antérieurs (scènes déjà vues)"), chipsEditor(sim.history, (v) => { sim.history = v || []; changed(); renderSim(); }, "dl-ids", "Identifiant de scène…")));
  simBox.appendChild(h("div", { class: "grid2" },
    h("div", { class: "field" }, h("span", null, "Souvenirs"), chipsEditor(sim.memories, (v) => { sim.memories = v || []; changed(); renderSim(); }, "dl-memories", "Souvenir…")),
    h("div", { class: "field" }, h("span", null, "Objets"), chipsEditor(sim.items, (v) => { sim.items = v || []; changed(); renderSim(); }, "dl-items", "Objet…"))));
  simBox.appendChild(h("details", null, h("summary", { class: "small" }, "État avancé (relations, duels…) en JSON"), extra));
  simBox.appendChild(h("div", { class: "toolbar" },
    h("button", { class: "small", onclick: () => { U.preview.sim = { stats: {}, flags: {}, history: [], memories: [], items: [], extra: {} }; saveUi(); renderSim(); } }, "Réinitialiser"),
    h("button", { class: "small gold", onclick: () => testFrom(lastScene || U.line) }, "Appliquer et relancer")));
}
