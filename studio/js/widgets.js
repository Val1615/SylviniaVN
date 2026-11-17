/* Sylvinia Studio · composants de formulaire (conditions, effets, drapeaux). */
import * as Mo from "./model.js";
import { h, datalist } from "./ui.js";

export function statLabel(k) { const n = Mo.catalogs().statNames; return (n && n[k]) || k; }
function statSelect(value, onchange) {
  const s = h("select", { "aria-label": "Statistique" }, Mo.catalogs().stats.map((k) => h("option", { value: k, selected: k === value }, statLabel(k))));
  s.addEventListener("change", () => onchange(s.value));
  return s;
}
export function ensureLists() {
  const c = Mo.catalogs();
  datalist("dl-flags", c.flags); datalist("dl-memories", c.memories); datalist("dl-items", c.items); datalist("dl-speakers", c.speakers);
}

/* objet { clé: nombre } : effets (+/-) ou seuils (≥) */
export function numbersEditor(obj, onChange, { prefix = "", min = null, addLabel = "+ Ajouter" } = {}) {
  obj = Object.assign({}, obj || {});
  const box = h("div", { class: "rows" });
  const emit = () => onChange(Object.keys(obj).length ? Object.assign({}, obj) : undefined);
  Object.keys(obj).forEach((k) => {
    const num = h("input", { type: "number", value: obj[k], step: "1", inputmode: "numeric", min: min ?? undefined, "aria-label": "Valeur" });
    num.addEventListener("change", () => { obj[k] = Number(num.value) || 0; emit(); });
    box.appendChild(h("div", { class: "rowx" },
      statSelect(k, (nk) => { if (nk === k) return; const v = obj[k]; delete obj[k]; obj[nk] = v; emit(); }),
      prefix ? h("span", { class: "muted" }, prefix) : null, num,
      h("button", { class: "small", title: "Retirer", onclick: () => { delete obj[k]; emit(); } }, "✕")));
  });
  box.appendChild(h("div", null, h("button", { class: "small", onclick: () => {
    const free = Mo.catalogs().stats.find((k) => !(k in obj)); if (!free) return; obj[free] = prefix === "≥" ? 10 : 1; emit();
  } }, addLabel)));
  return box;
}
/* objet { drapeau: booléen } */
export function flagsEditor(obj, onChange, { trueLabel = "vrai", falseLabel = "faux", addLabel = "+ Drapeau" } = {}) {
  ensureLists();
  obj = Object.assign({}, obj || {});
  const box = h("div", { class: "rows" });
  const emit = () => onChange(Object.keys(obj).length ? Object.assign({}, obj) : undefined);
  Object.keys(obj).forEach((k) => {
    const name = h("input", { value: k, list: "dl-flags", "aria-label": "Nom du drapeau", style: { minWidth: "180px", flex: "1" } });
    name.addEventListener("change", () => { const nk = name.value.trim(); if (!nk || nk === k) return; const v = obj[k]; delete obj[k]; obj[nk] = v; emit(); });
    const val = h("select", { "aria-label": "Valeur" }, h("option", { value: "1", selected: obj[k] === true }, trueLabel), h("option", { value: "0", selected: obj[k] !== true }, falseLabel));
    val.addEventListener("change", () => { obj[k] = val.value === "1"; emit(); });
    box.appendChild(h("div", { class: "rowx" }, name, val, h("button", { class: "small", title: "Retirer", onclick: () => { delete obj[k]; emit(); } }, "✕")));
  });
  const add = h("input", { list: "dl-flags", placeholder: "Nom d'un drapeau existant…", "aria-label": "Ajouter un drapeau", style: { minWidth: "180px", flex: "1" } });
  const doAdd = () => { const k = add.value.trim(); if (!k) return; obj[k] = true; emit(); };
  add.addEventListener("change", doAdd);
  box.appendChild(h("div", { class: "rowx" }, add, h("button", { class: "small", onclick: doAdd }, addLabel)));
  return box;
}
/* liste de chaînes (drapeaux, souvenirs, objets) */
export function chipsEditor(list, onChange, listId, placeholder = "Ajouter…") {
  ensureLists();
  list = Array.isArray(list) ? list.slice() : [];
  const emit = () => onChange(list.length ? list.slice() : undefined);
  const add = h("input", { list: listId, placeholder, "aria-label": placeholder, style: { minWidth: "160px", flex: "1" } });
  const doAdd = () => { const v = add.value.trim(); if (!v || list.includes(v)) return; list.push(v); emit(); };
  add.addEventListener("change", doAdd);
  return h("div", { class: "chips" },
    list.map((v, i) => h("span", { class: "chip" }, v, h("button", { title: "Retirer", "aria-label": "Retirer " + v, onclick: () => { list.splice(i, 1); emit(); } }, "✕"))),
    add, h("button", { class: "small", onclick: doAdd }, "+"));
}

/* Condition de visibilité d'une réplique (champ Studio studioIf : ET / OU / NON) */
export function visibilityEditor(cond, onChange) {
  cond = Object.assign({}, cond || {});
  const emit = () => {
    const out = {};
    if (cond.stats && Object.keys(cond.stats).length) out.stats = cond.stats;
    if (cond.all && Object.keys(cond.all).length) out.all = cond.all;
    if (cond.any && cond.any.length) out.any = cond.any;
    if (cond.none && cond.none.length) out.none = cond.none;
    onChange(Object.keys(out).length ? out : undefined);
  };
  return h("div", { class: "cond-box" },
    h("h4", null, "Condition de visibilité de la réplique"),
    h("div", { class: "muted small" }, "Si la condition n'est pas remplie, la réplique est sautée et le récit passe à la suivante."),
    h("div", { class: "field" }, h("span", null, "Statistiques minimales (toutes requises : ET)"), numbersEditor(cond.stats, (v) => { cond.stats = v; emit(); }, { prefix: "≥", min: 0, addLabel: "+ Seuil" })),
    h("div", { class: "field" }, h("span", null, "Drapeaux (tous requis : ET)"), flagsEditor(cond.all, (v) => { cond.all = v; emit(); }, { trueLabel: "est posé", falseLabel: "n'est pas posé" })),
    h("div", { class: "field" }, h("span", null, "Au moins un de ces drapeaux (OU)"), chipsEditor(cond.any, (v) => { cond.any = v; emit(); }, "dl-flags", "Drapeau…")),
    h("div", { class: "field" }, h("span", null, "Aucun de ces drapeaux (NON)"), chipsEditor(cond.none, (v) => { cond.none = v; emit(); }, "dl-flags", "Drapeau…")));
}

/* Prérequis d'un choix : uniquement ce que le moteur sait lire (requires, requiresFlags, requiresAnyFlags). */
export function choiceConditionEditor(ch, onChange) {
  return h("div", { class: "cond-box" },
    h("h4", null, "Prérequis du choix"),
    h("div", { class: "field" }, h("span", null, "Statistiques minimales (ET)"), numbersEditor(ch.requires, (v) => onChange("requires", v), { prefix: "≥", min: 0, addLabel: "+ Seuil" })),
    h("div", { class: "field" }, h("span", null, "Drapeaux exigés (ET, valeur exacte)"), flagsEditor(ch.requiresFlags, (v) => onChange("requiresFlags", v))),
    h("div", { class: "field" }, h("span", null, "Au moins un de ces drapeaux (OU)"), chipsEditor(ch.requiresAnyFlags, (v) => onChange("requiresAnyFlags", v), "dl-flags", "Drapeau…")),
    h("div", { class: "muted small" }, "Le moteur ne gère pas de « NON » pour les choix : un drapeau exigé à « faux » doit avoir été posé à faux par un choix précédent."));
}
export function describeCond(c) {
  if (!c) return "";
  const p = [];
  Object.entries(c.stats || {}).forEach(([k, v]) => p.push(`${statLabel(k)} ≥ ${v}`));
  Object.entries(c.all || {}).forEach(([k, v]) => p.push(v ? k : `non ${k}`));
  if (c.any && c.any.length) p.push("un de : " + c.any.join(", "));
  if (c.none && c.none.length) p.push("aucun de : " + c.none.join(", "));
  return p.join(" · ");
}
export function describeChoiceReq(ch) {
  const p = [];
  Object.entries(ch.requires || {}).forEach(([k, v]) => p.push(`${statLabel(k)} ≥ ${v}`));
  Object.entries(ch.requiresFlags || {}).forEach(([k, v]) => p.push(v ? k : `${k} = faux`));
  if (ch.requiresAnyFlags && ch.requiresAnyFlags.length) p.push("un de : " + ch.requiresAnyFlags.join(", "));
  return p.join(" · ");
}
export function describeEffects(e) {
  return Object.entries(e || {}).filter(([, v]) => v).map(([k, v]) => `${statLabel(k)} ${v > 0 ? "+" : ""}${v}`).join(" · ");
}
