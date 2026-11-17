/* Sylvinia Studio · état de l'interface partagé entre les panneaux. */
import * as Mo from "./model.js";
import { toast } from "./ui.js";

export const U = {
  chapter: null, scene: null, line: null,
  tab: "ecriture", libview: "chapitres", filter: "", status: "all",
  selected: new Set(), clipboard: null,
  find: { open: false, q: "", r: "", scope: "scene", cs: false },
  preview: { shown: true, simOpen: false, mute: true, sim: { stats: {}, flags: {}, history: [], memories: [], items: [], extra: {} } },
  layout: "desktop",
};
const renderers = new Map();
export function registerRenderer(name, fn) { renderers.set(name, fn); }
let pending = null;
export function refresh(names) {
  const list = names || [...renderers.keys()];
  pending = pending ? new Set([...pending, ...list]) : new Set(list);
  requestAnimationFrame(() => {
    if (!pending) return;
    const todo = pending; pending = null;
    todo.forEach((n) => { try { renderers.get(n) && renderers.get(n)(); } catch (e) { console.error(n, e); } });
  });
}
export function setTab(tab) {
  U.tab = tab;
  document.getElementById("app").dataset.tab = tab;
  document.querySelectorAll("#tabs button[data-tab]").forEach((b) => b.classList.toggle("active", b.dataset.tab === tab));
  refresh();
  saveUi();
}
export function selectChapter(key) {
  U.chapter = key; U.libview = "scenes";
  const sc = Mo.scenesOf(key)[0];
  U.scene = sc ? sc.id : null; U.line = sc ? sc.ids[0] : null; U.selected.clear();
  refresh(); saveUi();
}
export function selectScene(sceneId, lineId) {
  U.scene = sceneId;
  const s = Mo.scenesOf(U.chapter).find((x) => x.id === sceneId);
  U.line = lineId || (s ? s.ids[0] : null);
  U.selected.clear();
  refresh(); saveUi();
}
export function selectLine(id, { scroll = true } = {}) {
  if (!id || !Mo.node(id)) return;
  const key = Mo.chapterKey(id);
  if (key !== U.chapter) U.chapter = key;
  const s = Mo.sceneOfLine(key, id);
  U.scene = s ? s.id : U.scene; U.line = id;
  refresh(); saveUi();
  if (scroll) setTimeout(() => { const el = document.querySelector(`.line[data-id="${id}"]`); if (el) el.scrollIntoView({ block: "center", behavior: "smooth" }); }, 80);
}
/* Rattrape une sélection devenue invalide après un changement de structure. */
export function fixSelection() {
  if (!U.chapter || !Mo.chapter(U.chapter)) { U.chapter = null; U.scene = null; U.line = null; return; }
  const scenes = Mo.scenesOf(U.chapter);
  if (U.line && Mo.node(U.line) && !Mo.node(U.line).studioRemoved) {
    const s = Mo.sceneOfLine(U.chapter, U.line); if (s) { U.scene = s.id; return; }
  }
  const s = scenes.find((x) => x.id === U.scene) || scenes.find((x) => x.ids.includes(U.scene)) || scenes[0];
  U.scene = s ? s.id : null; U.line = s ? s.ids[0] : null;
}
export function act(label, fn, opts) {
  try { const r = Mo.transaction(label, fn, opts); fixSelection(); return r; }
  catch (e) { toast(e.message || String(e), "error"); return undefined; }
}
let saveUiHook = null;
export function onSaveUi(fn) { saveUiHook = fn; }
export function saveUi() { if (saveUiHook) saveUiHook(); }
export function currentScene() { return U.chapter ? Mo.scenesOf(U.chapter).find((s) => s.id === U.scene) || null : null; }
