/* Sylvinia Studio · mise en scène : décor, personnages, ambiance, transitions. */
import * as Mo from "./model.js";
import { h, clear, toast } from "./ui.js";
import { U, refresh, act, currentScene, setTab } from "./state.js";

const POS = [["left", "Gauche"], ["center", "Centre"], ["right", "Droite"]];
let picked = null;            // index du personnage sélectionné sur la scène miniature
let bgQuery = "";
let bgLimit = 60;
let audioEl = null;

export function renderVisuals() {
  const root = document.getElementById("paneVisuels");
  if (!root.offsetParent && U.tab !== "visuels") return;
  const keep = root.scrollTop;
  clear(root);
  if (!U.chapter || !U.line || !Mo.node(U.line)) { root.appendChild(h("div", { class: "empty" }, "Sélectionnez une réplique dans l'onglet Écriture.")); return; }
  const id = U.line; const n = Mo.node(id);
  const scene = currentScene();
  root.appendChild(h("div", { class: "toolbar", style: { marginBottom: "8px" } },
    h("h2", null, "Mise en scène"),
    h("span", { class: "muted small" }, `Réplique `, h("code", null, id), ` · ${n.speaker || "Narrateur"} : ${String(typeof n.text === "string" ? n.text : "").slice(0, 70)}`),
    h("button", { class: "small", onclick: () => setTab("ecriture") }, "← Écriture")));
  root.appendChild(stage(id, n));
  root.appendChild(charsSection(id, n));
  root.appendChild(bgSection(id, n));
  root.appendChild(ambianceSection(id, n));
  if (scene && scene.ids.length > 1) root.appendChild(h("div", { class: "section" },
    h("h3", null, "Toute la scène"),
    h("div", { class: "muted small" }, `Recopier la mise en scène de cette réplique sur les ${scene.ids.length} répliques de « ${scene.title} ».`),
    h("div", { class: "toolbar" },
      h("button", { class: "small", onclick: () => spread(scene, id, ["bg"]) }, "Même décor partout"),
      h("button", { class: "small", onclick: () => spread(scene, id, ["music"]) }, "Même musique partout"),
      h("button", { class: "small", onclick: () => spread(scene, id, ["chars"]) }, "Mêmes personnages partout"))));
  root.scrollTop = keep;
}
function set(id, field, value, label) { act(label || "Mise en scène", () => Mo.setField(id, field, value)); refresh(); }
function spread(scene, id, fields) {
  const src = Mo.node(id);
  act("Mise en scène de toute la scène", () => scene.ids.forEach((x) => { if (Mo.isDynamicText(x) && fields.includes("chars")) return; fields.forEach((f) => Mo.setField(x, f, Mo.clone(src[f]))); }));
  toast("Mise en scène recopiée sur toute la scène.");
  refresh();
}

/* ---------- scène miniature : manipulation directe ---------- */
function stage(id, n) {
  const chars = Mo.clone(n.chars || []);
  const bgUrl = Mo.assetUrl(n.bg);
  const isVideo = /\.(mp4|webm)$/i.test(bgUrl);
  const st = h("div", { class: "stage", style: { backgroundImage: !isVideo && bgUrl ? `url("${bgUrl}")` : "none" } });
  if (isVideo) st.appendChild(h("video", { src: bgUrl, muted: true, autoplay: true, loop: true, playsinline: true }));
  const zones = h("div", { class: "zones" });
  const hidden = n.hideChars;
  POS.forEach(([pos, label]) => {
    const z = h("div", { class: "zone", "data-pos": pos }, h("span", { class: "zl" }, label));
    chars.forEach((c, i) => {
      if ((c[2] || "center") !== pos) return;
      const url = Mo.assetUrl(c[1]);
      const cls = (c[3] || "").split(/\s+/);
      const img = h("img", { class: "spr" + (cls.includes("back") ? " back" : "") + (cls.includes("dim") ? " dim" : "") + (picked === i ? " picked" : ""), src: url, alt: c[0], draggable: "false", style: { zIndex: String(10 + i), opacity: hidden ? ".35" : "1" } });
      img.addEventListener("click", (e) => { e.stopPropagation(); picked = picked === i ? null : i; refresh(["visuals"]); });
      img.addEventListener("pointerdown", (e) => startDrag(e, img, i, id, chars, zones));
      z.appendChild(img);
    });
    z.addEventListener("click", () => { if (picked === null || !chars[picked]) return; chars[picked][2] = pos; picked = null; set(id, "chars", chars, "Déplacer un personnage"); });
    zones.appendChild(z);
  });
  st.appendChild(zones);
  st.appendChild(h("span", { class: "stage-note" }, picked !== null && chars[picked] ? `Touchez une zone pour placer ${chars[picked][0]}` : "Glissez un personnage ou touchez-le puis touchez une zone"));
  return h("div", { class: "section" }, st,
    h("div", { class: "muted small" }, "Ce schéma sert à composer. Le rendu exact (proportions, cadrage, interface) est celui de l'aperçu du jeu, mis à jour en direct."));
}
function startDrag(e, img, i, id, chars, zones) {
  if (e.button && e.button !== 0) return;
  const start = { x: e.clientX, y: e.clientY }; let moved = false;
  img.setPointerCapture(e.pointerId);
  const zoneAt = (x, y) => [...zones.children].find((z) => { const r = z.getBoundingClientRect(); return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom; });
  const move = (ev) => {
    if (Math.abs(ev.clientX - start.x) + Math.abs(ev.clientY - start.y) > 8) moved = true;
    if (!moved) return;
    img.style.transform = `translate(${ev.clientX - start.x}px, ${ev.clientY - start.y}px)`;
    [...zones.children].forEach((z) => z.classList.toggle("hot", z === zoneAt(ev.clientX, ev.clientY)));
  };
  const up = (ev) => {
    img.removeEventListener("pointermove", move); img.removeEventListener("pointerup", up); img.removeEventListener("pointercancel", up);
    [...zones.children].forEach((z) => z.classList.remove("hot"));
    if (!moved) return;
    const z = zoneAt(ev.clientX, ev.clientY);
    img.style.transform = "";
    if (z && z.dataset.pos !== (chars[i][2] || "center")) { chars[i][2] = z.dataset.pos; set(id, "chars", chars, "Déplacer un personnage"); }
  };
  img.addEventListener("pointermove", move); img.addEventListener("pointerup", up); img.addEventListener("pointercancel", up);
}

/* ---------- personnages ---------- */
function charsSection(id, n) {
  const cat = Mo.catalogs();
  const chars = Mo.clone(n.chars || []);
  const save = (label) => set(id, "chars", chars, label);
  const sec = h("div", { class: "section" }, h("h3", null, "Personnages"),
    h("div", { class: "muted small" }, "L'ordre de la liste fixe qui passe devant : le dernier est au premier plan."));
  if (Mo.isDynamicText(id) && false) return sec;
  chars.forEach((c, i) => {
    const [kind, sprite, pos = "center", extra = ""] = c;
    const cls = new Set(String(extra).split(/\s+/).filter(Boolean));
    const spriteSel = h("select", { "aria-label": "Sprite et expression" }, (cat.sprites[kind] || [sprite]).map((s) => h("option", { value: s, selected: s === sprite }, s.replace(kind + "_", ""))));
    if (!(cat.sprites[kind] || []).includes(sprite)) spriteSel.appendChild(h("option", { value: sprite, selected: true }, sprite));
    spriteSel.addEventListener("change", () => { chars[i][1] = spriteSel.value; save("Changer d'expression"); });
    const seg = h("span", { class: "seg" }, POS.map(([p, l]) => h("button", { class: "small" + (p === pos ? " on" : ""), onclick: () => { chars[i][2] = p; save("Déplacer un personnage"); } }, l)));
    const toggle = (name, label) => h("button", { class: "small" + (cls.has(name) ? " on" : ""), onclick: () => { cls.has(name) ? cls.delete(name) : cls.add(name); const v = [...cls].join(" "); if (v) chars[i][3] = v; else chars[i].length = 3; save("Modifier un personnage"); } }, label);
    sec.appendChild(h("div", { class: "char-row" },
      h("img", { src: Mo.assetUrl(spriteSel.value || sprite), alt: "" }),
      h("b", { style: { minWidth: "70px", textTransform: "capitalize" } }, kind), spriteSel, seg,
      toggle("back", "Arrière-plan"), toggle("dim", "Assombri"), kind === "lineva" || cls.has("projection") ? toggle("projection", "Projection") : null,
      h("button", { class: "small icon", "aria-label": "Plus en arrière", disabled: i === 0, onclick: () => { [chars[i - 1], chars[i]] = [chars[i], chars[i - 1]]; save("Ordre des personnages"); } }, "▲"),
      h("button", { class: "small icon", "aria-label": "Plus en avant", disabled: i === chars.length - 1, onclick: () => { [chars[i + 1], chars[i]] = [chars[i], chars[i + 1]]; save("Ordre des personnages"); } }, "▼"),
      h("button", { class: "small danger", onclick: () => { chars.splice(i, 1); picked = null; save("Retirer un personnage"); } }, "Retirer")));
  });
  const kindSel = h("select", { "aria-label": "Personnage à ajouter" }, cat.charKinds.map((k) => h("option", { value: k }, k)));
  sec.appendChild(h("div", { class: "toolbar" }, kindSel, h("button", { class: "small", onclick: () => {
    const k = kindSel.value; const sp = (cat.sprites[k] || [])[0]; if (!sp) { toast("Aucun sprite trouvé pour ce personnage.", "error"); return; }
    const used = new Set(chars.map((c) => c[2])); const pos = ["left", "right", "center"].find((p) => !used.has(p)) || "center";
    chars.push([k, sp, pos]); save("Ajouter un personnage");
  } }, "+ Ajouter le personnage")));
  return sec;
}

/* ---------- décor ---------- */
function bgSection(id, n) {
  const cat = Mo.catalogs();
  const sec = h("div", { class: "section" }, h("h3", null, "Décor"));
  const q = h("input", { type: "search", value: bgQuery, placeholder: "Rechercher un lieu (forêt, palais, c10…)", "aria-label": "Rechercher un décor", class: "wide" });
  const grid = h("div", { class: "thumbs" });
  const draw = () => {
    clear(grid);
    const words = bgQuery.toLowerCase().split(/\s+/).filter(Boolean);
    const list = cat.backgrounds.filter((k) => words.every((w) => k.toLowerCase().includes(w) || String(Mo.M.base.assets[k]).toLowerCase().includes(w)));
    list.slice(0, bgLimit).forEach((k) => {
      const url = Mo.assetUrl(k); const vid = /\.(mp4|webm)$/i.test(url);
      grid.appendChild(h("button", { class: "thumb" + (k === n.bg ? " on" : ""), title: k, onclick: () => set(id, "bg", k, "Changer de décor") },
        vid ? h("video", { src: url, muted: true, preload: "metadata", style: { width: "100%", aspectRatio: "16/9", objectFit: "cover" } }) : h("img", { src: url, loading: "lazy", alt: "" }),
        h("span", null, (vid ? "▶ " : "") + k)));
    });
    if (list.length > bgLimit) grid.appendChild(h("button", { class: "small", onclick: () => { bgLimit += 60; draw(); } }, `Afficher plus (${list.length - bgLimit})`));
    if (!list.length) grid.appendChild(h("div", { class: "muted" }, "Aucun décor ne correspond."));
  };
  q.addEventListener("input", () => { bgQuery = q.value; bgLimit = 60; draw(); });
  draw();
  sec.appendChild(h("div", { class: "rowx" }, h("span", null, "Actuel : ", h("code", null, n.bg || "(aucun)"))));
  sec.appendChild(q); sec.appendChild(grid);
  return sec;
}

/* ---------- ambiance, transitions, paramètres pris en charge ---------- */
function ambianceSection(id, n) {
  const cat = Mo.catalogs();
  const music = h("select", { "aria-label": "Musique" }, h("option", { value: "" }, "(musique par défaut du moteur)"), cat.music.map((k) => h("option", { value: k, selected: k === n.music }, k)));
  if (n.music && !cat.music.includes(n.music)) music.appendChild(h("option", { value: n.music, selected: true }, n.music));
  music.addEventListener("change", () => set(id, "music", music.value, "Changer de musique"));
  const sfx = h("select", { "aria-label": "Effet sonore" }, h("option", { value: "" }, "Aucun"), cat.audio.map((k) => h("option", { value: k, selected: k === n.sfx }, k)));
  sfx.addEventListener("change", () => set(id, "sfx", sfx.value || undefined, "Effet sonore"));
  const play = (key) => { try { if (audioEl) { audioEl.pause(); audioEl = null; return; } if (!key) return; audioEl = new Audio(Mo.assetUrl(key)); audioEl.volume = .7; audioEl.play(); setTimeout(() => { if (audioEl) { audioEl.pause(); audioEl = null; } }, 12000); } catch {} };
  const flag = (field, label, help) => h("label", { class: "kv", title: help }, h("input", { type: "checkbox", checked: !!n[field], onchange: (e) => set(id, field, e.target.checked, label) }), label);
  const sec = h("div", { class: "section" }, h("h3", null, "Ambiance et transitions"),
    h("div", { class: "grid2" },
      h("label", { class: "field" }, h("span", null, "Musique"), h("div", { class: "rowx" }, music, h("button", { class: "small", onclick: () => play(music.value) }, "▶ / ■"))),
      h("label", { class: "field" }, h("span", null, "Effet sonore (une fois, à l'arrivée)"), h("div", { class: "rowx" }, sfx, h("button", { class: "small", onclick: () => play(sfx.value) }, "▶ / ■")))),
    h("div", { class: "chips" },
      flag("zoom", "Zoom lent sur le décor (image clé)", "Effet de caméra du moteur"),
      flag("hideChars", "Masquer les personnages", "Plan sur le décor seul"),
      flag("clearChars", "Vider la scène avant", "Retire les personnages précédents")),
    typeof n.bgCycleMs === "number" ? h("label", { class: "field" }, h("span", null, "Décors en cycle : durée par image (ms)"), h("input", { type: "number", value: n.bgCycleMs, min: 500, step: 100, onchange: (e) => set(id, "bgCycleMs", Math.max(500, Number(e.target.value) || 0), "Durée du cycle") })) : null,
    h("div", { class: "muted small" }, "Les éclairages et fondus propres à certains chapitres sont gérés par le moteur : ils restent actifs et visibles dans l'aperçu."));
  return sec;
}
