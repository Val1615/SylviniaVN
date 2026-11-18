/* Sylvinia Studio · petits outils d'interface (sans dépendance). */
export function h(tag, attrs, ...kids) {
  const el = document.createElement(tag);
  if (attrs) for (const [k, v] of Object.entries(attrs)) {
    if (v === undefined || v === null || v === false) continue;
    if (k === "class") el.className = v;
    else if (k === "style" && typeof v === "object") Object.assign(el.style, v);
    else if (k.startsWith("on") && typeof v === "function") el.addEventListener(k.slice(2), v);
    else if (k === "html") el.innerHTML = v;
    else if (k === "value") el.value = v;
    else if (k === "checked") el.checked = !!v;
    else if (k === "dataset") Object.assign(el.dataset, v);
    else if (v === true) el.setAttribute(k, "");
    else el.setAttribute(k, v);
  }
  for (const kid of kids.flat(Infinity)) {
    if (kid === null || kid === undefined || kid === false) continue;
    el.appendChild(kid instanceof Node ? kid : document.createTextNode(String(kid)));
  }
  return el;
}
export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
export function clear(el) { while (el.firstChild) el.removeChild(el.firstChild); return el; }

export function toast(msg, kind = "") {
  const box = document.getElementById("toasts");
  const t = h("div", { class: "toast " + kind, role: "status" }, msg);
  box.appendChild(t);
  setTimeout(() => t.classList.add("out"), kind === "error" ? 6000 : 3200);
  setTimeout(() => t.remove(), kind === "error" ? 6600 : 3800);
}

/* Fenêtre modale plein cadre, toujours dans l'écran, défilable. */
export function modal(title, body, actions = []) {
  const root = document.getElementById("modal");
  clear(root);
  const close = () => { root.classList.add("hidden"); clear(root); };
  const card = h("div", { class: "modal-card", role: "dialog", "aria-modal": "true", "aria-label": title },
    h("div", { class: "modal-head" }, h("h2", null, title), h("button", { class: "icon", title: "Fermer", "aria-label": "Fermer", onclick: close }, "✕")),
    h("div", { class: "modal-body" }, body),
    actions.length ? h("div", { class: "modal-actions" }, actions.map((a) => h("button", { class: a.class || "", onclick: () => { const r = a.onclick && a.onclick(close); if (r !== false && !a.keep) close(); } }, a.label))) : null);
  root.appendChild(card);
  root.classList.remove("hidden");
  root.onclick = (e) => { if (e.target === root) close(); };
  return close;
}
export function confirmBox(title, text, okLabel = "Confirmer", danger = false) {
  return new Promise((resolve) => {
    let done = false;
    const close = modal(title, h("p", null, text), [
      { label: "Annuler", onclick: () => { done = true; resolve(false); } },
      { label: okLabel, class: danger ? "danger" : "gold", onclick: () => { done = true; resolve(true); } },
    ]);
    const root = document.getElementById("modal");
    const obs = new MutationObserver(() => { if (root.classList.contains("hidden")) { obs.disconnect(); if (!done) resolve(false); } });
    obs.observe(root, { attributes: true });
  });
}
export function promptBox(title, label, value = "", okLabel = "Valider") {
  return new Promise((resolve) => {
    const input = h("input", { type: "text", value, class: "wide", "aria-label": label });
    let done = false;
    modal(title, h("label", { class: "field" }, h("span", null, label), input), [
      { label: "Annuler", onclick: () => { done = true; resolve(null); } },
      { label: okLabel, class: "gold", onclick: () => { done = true; resolve(input.value); } },
    ]);
    setTimeout(() => input.focus(), 50);
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") { done = true; resolve(input.value); document.getElementById("modal").classList.add("hidden"); } });
    const root = document.getElementById("modal");
    const obs = new MutationObserver(() => { if (root.classList.contains("hidden")) { obs.disconnect(); if (!done) resolve(null); } });
    obs.observe(root, { attributes: true });
  });
}
export function debounce(fn, ms) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; }
export function autoGrow(ta) { ta.style.height = "auto"; ta.style.height = Math.min(ta.scrollHeight + 2, 900) + "px"; }
export function fmtDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}
export function download(name, text, type = "application/json") {
  const blob = new Blob([text], { type });
  const a = h("a", { href: URL.createObjectURL(blob), download: name });
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}
/* sélecteur avec recherche intégrée, sans menu flottant (liste dans le flux de la page) */
export function datalist(id, values) {
  let dl = document.getElementById(id);
  if (!dl) { dl = h("datalist", { id }); document.body.appendChild(dl); }
  if (dl.dataset.n === String(values.length)) return dl;
  clear(dl); values.forEach((v) => dl.appendChild(h("option", { value: v })));
  dl.dataset.n = String(values.length);
  return dl;
}
