/* Sylvinia Studio · bibliothèque des chapitres et navigateur de scènes. */
import * as Mo from "./model.js";
import { h, clear, fmtDate, promptBox, confirmBox, toast } from "./ui.js";
import { U, refresh, selectChapter, selectScene, setTab, act, saveUi } from "./state.js";

const STATUS = { publie: "Publié", modifie: "Modifié", brouillon: "Brouillon" };

export function renderLibrary() {
  const root = document.getElementById("paneLibrary");
  const keepScroll = root.scrollTop;
  clear(root);
  document.getElementById("app").dataset.libview = U.libview;
  root.appendChild(U.libview === "scenes" && U.chapter ? scenesView() : chaptersView());
  if (U.libview === "chapitres") root.scrollTop = keepScroll;
  else { const a = root.querySelector(".scene-item.active"); if (a && !isVisible(a, root)) a.scrollIntoView({ block: "center" }); }
}
function isVisible(el, box) { const r = el.getBoundingClientRect(), b = box.getBoundingClientRect(); return r.top >= b.top && r.bottom <= b.bottom; }

function chaptersView() {
  const search = h("input", { type: "search", placeholder: "Rechercher un chapitre…", value: U.filter, "aria-label": "Rechercher un chapitre" });
  search.addEventListener("input", () => { U.filter = search.value; renderList(); });
  const status = h("select", { "aria-label": "Filtrer par état" },
    ["all:Tous", "modifie:Modifiés", "brouillon:Brouillons", "publie:Publiés"].map((x) => { const [v, l] = x.split(":"); return h("option", { value: v, selected: U.status === v }, l); }));
  status.addEventListener("change", () => { U.status = status.value; renderList(); });
  const list = h("div", { class: "lib-list" });
  const renderList = () => {
    clear(list);
    const q = U.filter.trim().toLowerCase();
    const chs = Mo.chapters().filter((c) => {
      if (q && !(c.label.toLowerCase().includes(q) || c.key.includes(q))) return false;
      if (U.status !== "all" && Mo.chapterStats(c.key).status !== U.status) return false;
      return true;
    });
    if (!chs.length) list.appendChild(h("div", { class: "empty" }, "Aucun chapitre ne correspond."));
    chs.forEach((c) => list.appendChild(chapterCard(c)));
  };
  renderList();
  return h("div", { class: "lib" },
    h("div", { class: "lib-head" },
      h("div", { class: "row" }, h("h2", null, "Chapitres"), h("span", { class: "muted small" }, `${Mo.chapters().length} chapitres du Mode Histoire`)),
      h("div", { class: "row" }, search, status),
      h("div", { class: "row" }, h("button", { class: "small", onclick: newChapter }, "+ Nouveau chapitre"))),
    list);
}

function chapterCard(c) {
  const st = Mo.chapterStats(c.key);
  const open = () => { selectChapter(c.key); if (U.layout !== "desktop") setTab("ecriture"); };
  const card = h("div", { class: "chap" + (c.key === U.chapter ? " active" : ""), role: "button", tabindex: "0", onclick: open, onkeydown: (e) => { if (e.key === "Enter") open(); } },
    h("div", { class: "num" }, c.number),
    h("div", { class: "ttl" }, c.title || c.label),
    h("div", { class: "meta" },
      h("span", { class: "badge " + st.status }, STATUS[st.status]),
      h("span", null, `${st.scenes} scènes`), h("span", null, `${st.lines} répliques`),
      h("span", null, `${st.choices} choix`), h("span", null, `${st.branches} embranchements`),
      st.modified ? h("span", { class: "badge modifie" }, `${st.modified} modif.`) : null,
      st.last ? h("span", null, "modifié " + fmtDate(st.last)) : null),
    h("div", { class: "acts" },
      h("button", { class: "small gold", onclick: (e) => { e.stopPropagation(); open(); } }, "Éditer"),
      h("button", { class: "small", onclick: (e) => { e.stopPropagation(); dupChapter(c); } }, "Dupliquer"),
      c.custom ? h("button", { class: "small", onclick: (e) => { e.stopPropagation(); renameChap(c); } }, "Renommer") : null));
  return card;
}
async function newChapter() {
  const t = await promptBox("Nouveau chapitre", "Titre du chapitre", "Chapitre inédit · ");
  if (t === null) return;
  const key = act("Nouveau chapitre", () => Mo.createChapter(t.trim() || "Nouveau chapitre"));
  if (key) { toast("Chapitre créé en brouillon. Il ne sera visible en jeu qu'une fois relié à une scène existante (onglet Branches)."); selectChapter(key); setTab("ecriture"); }
}
async function dupChapter(c) {
  const ok = await confirmBox("Dupliquer le chapitre", `Créer une copie de travail de « ${c.label} » ? La copie reçoit de nouveaux identifiants et reste détachée du jeu : les sauvegardes et le chapitre d'origine ne changent pas.`, "Dupliquer");
  if (!ok) return;
  const key = act("Dupliquer un chapitre", () => Mo.duplicateChapter(c.key));
  if (key) { toast("Copie créée en brouillon."); selectChapter(key); }
}
async function renameChap(c) {
  const t = await promptBox("Renommer le chapitre", "Titre", c.label);
  if (t === null) return;
  act("Renommer le chapitre", () => Mo.renameChapter(c.key, t.trim()));
  refresh();
}

function scenesView() {
  const c = Mo.chapter(U.chapter);
  const scenes = Mo.scenesOf(U.chapter);
  const st = Mo.chapterStats(U.chapter);
  const q = h("input", { type: "search", placeholder: "Filtrer les scènes…", "aria-label": "Filtrer les scènes" });
  const list = h("div", { class: "scenes" });
  const draw = () => {
    clear(list);
    const f = q.value.trim().toLowerCase();
    scenes.forEach((s, i) => {
      if (f && !(s.title.toLowerCase().includes(f) || s.ids.some((id) => id.includes(f) || String(Mo.node(id).text || "").toLowerCase().includes(f)))) return;
      const mod = s.ids.some((id) => !Mo.same(Mo.M.draft.nodes[id], Mo.M.published.nodes[id]));
      list.appendChild(h("button", { class: "scene-item" + (s.id === U.scene ? " active" : ""), onclick: () => { selectScene(s.id); if (U.layout === "compact" || U.tab === "chapitres") setTab("ecriture"); } },
        h("span", { class: "idx" }, String(i + 1)),
        h("span", null, h("div", { class: "st" }, s.title || "(sans titre)"), h("div", { class: "sm" }, `${s.ids.length} réplique${s.ids.length > 1 ? "s" : ""} · ${s.ids[0]}`)),
        h("span", { class: "bd" },
          s.choices ? h("span", { class: "badge", title: "Choix dans cette scène" }, `◆ ${s.choices}`) : null,
          s.conditional ? h("span", { class: "badge cond", title: "Scène conditionnelle" }, "⚑ cond.") : null,
          s.special ? h("span", { class: "badge special", title: "Événement spécial" }, "✸") : null,
          mod ? h("span", { class: "badge modifie" }, "modifiée") : null)));
    });
  };
  q.addEventListener("input", draw);
  draw();
  return h("div", { class: "lib" },
    h("div", { class: "lib-head" },
      h("div", { class: "row" }, h("button", { class: "small", onclick: () => { U.libview = "chapitres"; refresh(["library"]); saveUi(); } }, "← Chapitres"), h("span", { class: "badge " + st.status }, STATUS[st.status])),
      h("div", null, h("div", { class: "muted small" }, c.number), h("h2", { style: { fontFamily: "var(--serif)", fontSize: "21px" } }, c.title || c.label)),
      h("div", { class: "muted small" }, `${scenes.length} scènes · ${st.lines} répliques · ${st.choices} choix`),
      q),
    list);
}
