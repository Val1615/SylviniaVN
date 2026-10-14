// Analyse du vocabulaire intime de la Chronique Alternative.
// Lecture purement textuelle des sources .ts : aucun import, aucune compilation.
// Les chaînes affichées au joueur sont extraites, rattachées à leur bloc
// (clé d'objet, appel ou identifiant) puis regroupées en « scènes ».
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const SRC = join(dirname(fileURLToPath(import.meta.url)), "../src");

// Fichiers analysés. Ajouter ici les nouveaux fichiers intimes (la refonte
// Valurn pourra y inscrire les siens et retirer l'exclusion ci-dessous).
export const INTIMATE_FILE_PATTERN = /(intim|heure-|explicit|date|bellirith-naiah|group|naiah-group)/;
export const EXTRA_FILES = ["intimacy-prose.ts", "intimacy-games.ts"];
// Fichiers ou blocs exclus : la refonte Valurn suit son propre chantier.
export const EXCLUDED_FILES = [/valurn/i];
export const EXCLUDED_BLOCK_LABELS = [/^valurn$/i];

export const CHARACTERS = ["hylee", "remerii", "naiah", "allenna", "lineva", "bellirith", "iriana", "saidin", "amanea", "tia", "draven", "valurn"];

// Euphémismes et termes désignant les parties intimes ou l'excitation.
// Chaque entrée : libellé affiché, expression régulière (insensible à la casse).
const P = "(?:son|sa|ses|votre|vos|leur|leurs|mon|ma|mes|ton|ta|tes)";
export const TERMS = [
  ["perle (de plaisir, sensible…)", /\b(?:perles? (?:de plaisir|sensibles?)|(?:votre|sa|ta|leur|vos|ses) perles?(?! (?:tombe|roule|restante|de (?:sueur|rosée|givre|pluie|verre|nacre))))\b/giu],
  ["virilité", /\bvirilit[ée]s?\b/giu],
  ["vigueur (possessif)", new RegExp(`\\b${P} vigueur\\b`, "giu")],
  ["membre (possessif)", new RegExp(`\\b${P} membre\\b`, "giu")],
  ["sexe (possessif / le sexe)", new RegExp(`\\b(?:${P}|le|du|au) sexes?\\b`, "giu")],
  ["intimité (possessif)", new RegExp(`\\b${P} intimit[ée]\\b`, "giu")],
  ["chaleur (possessif)", new RegExp(`\\b${P} chaleur\\b`, "giu")],
  ["humidité / moiteur", /\b(?:humidit[ée]|moiteur)\b/giu],
  ["fleur (possessif)", new RegExp(`\\b${P} fleur\\b`, "giu")],
  ["bouton", /\bbouton(?: de plaisir)?\b(?! de (?:col|manchette|veste|chemise|rose))(?! qu’elle a arraché)/giu, (m, ctx) => !/\b(?:un|du)\s+$/i.test(ctx)],
  ["fente", /\bfente\b/giu],
  ["replis / pli humide", /\b(?:replis|pli (?:humide|mouillé|luisant))\b/giu],
  ["entre ses/vos cuisses", /\bentre (?:ses|vos|leurs|mes|tes|les) cuisses\b/giu],
  ["entre ses/vos jambes", /\bentre (?:ses|vos|leurs|mes|tes|les) jambes\b/giu],
  ["bas-ventre", /\bbas-ventre\b/giu],
  ["ventre (possessif)", new RegExp(`\\b${P} ventre\\b`, "giu")],
  ["entrée (humide)", new RegExp(`\\b${P} entrée\\b|\\bentrée humide\\b`, "giu")],
  ["désir (anatomique)", /\b(?:son|votre|leur) désir (?:dressé|tendu|durci|gonflé|humide|brûlant contre)\b/giu],
  ["érection / dressé", /\b(?:érection|dressée?s?)\b/giu],
  ["longueur", /\b(?:la|sa|votre) longueur\b/giu],
  ["centre / cœur intime", new RegExp(`\\b${P} (?:centre|cœur intime|point sensible)\\b`, "giu")],
  ["source / sève / hampe", new RegExp(`\\b${P} (?:source|sève|hampe)\\b`, "giu")],
];

// Mots crus ou cliniques interdits dans la prose intime.
export const BANNED = /\b(?:pénis|penis|vagin|vagins|vulve|vulves|clitoris|testicules?|scrotum|anus|chatte|bite|bites|couilles?|phallus|verge|gland(?! du coussin)|érection)\b/giu;

export const MAX_PER_SCENE = 2;
// Taille minimale d'un bloc pour constituer une « scène » (caractères de prose).
export const SCENE_MIN_CHARS = 1500;

export function listFiles() {
  return readdirSync(SRC)
    .filter((f) => f.endsWith(".ts") && (INTIMATE_FILE_PATTERN.test(f) || EXTRA_FILES.includes(f)))
    .filter((f) => !EXCLUDED_FILES.some((r) => r.test(f)))
    .sort();
}

// Appels et clés dont les branches sont des variantes exclusives (le joueur
// n'en lit qu'une) : configuration du corps, mode d'affichage, drapeau, choix.
export const ALT_CALLEES = new Set(["X", "XP", "XB", "M", "V", "W", "K", "sexLines", "sexText"]);
export const ALT_KEYS = new Set(["femme", "homme", "intersexe", "tendre", "suggestif", "explicite", "ellipse", "explicit", "suggestive", "guided", "offered", "mutual", "known", "unknown", ...CHARACTERS]);
const CHOICE_CALLEES = new Set(["O", "Q"]);

// Petit lecteur : construit l'arbre des blocs ({ [ () et y range les chaînes.
export function scan(source) {
  const root = { kind: "root", label: "", children: [], start: 0, arg: 0, tern: 0 };
  const stack = [root];
  let i = 0; let lastSignificant = "\n"; const n = source.length;
  const top = () => stack[stack.length - 1];
  const labelBefore = (pos) => {
    const before = source.slice(Math.max(0, pos - 120), pos);
    const m = before.match(/(?:["']?([\w$-]+)["']?\s*:\s*|([\w$.]+)\s*)$/u);
    return m ? (m[1] || m[2] || "").split(".").pop() : "";
  };
  const keyBefore = (pos) => { const m = source.slice(Math.max(0, pos - 60), pos).match(/["']?([\w$-]+)["']?\s*:\s*$/u); return m ? m[1] : ""; };
  while (i < n) {
    const c = source[i]; const d = source[i + 1];
    if (c === "/" && d === "/") { while (i < n && source[i] !== "\n") i++; continue; }
    if (c === "/" && d === "*") { i = source.indexOf("*/", i + 2); i = i < 0 ? n : i + 2; continue; }
    if (c === "/" && /[=(,:;!&|?{}[\n]/.test(lastSignificant)) {
      i++; let cls = false;
      while (i < n) { const ch = source[i]; if (ch === "\\") { i += 2; continue; } if (ch === "[") cls = true; else if (ch === "]") cls = false; else if (ch === "/" && !cls) break; else if (ch === "\n") break; i++; }
      i++; while (/[a-z]/i.test(source[i] || "")) i++; lastSignificant = "x"; continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      const start = i; let j = i + 1; let text = "";
      while (j < n && source[j] !== c) {
        if (source[j] === "\\") { text += source[j + 1]; j += 2; continue; }
        if (c === "`" && source[j] === "$" && source[j + 1] === "{") { let depth = 1; j += 2; text += "{…}"; while (j < n && depth) { if (source[j] === "{") depth++; else if (source[j] === "}") depth--; j++; } continue; }
        text += source[j]; j++;
      }
      const t = top();
      t.children.push({ kind: "str", text, start, key: t.kind === "{" ? keyBefore(start) : "", arg: t.arg, tern: t.tern });
      i = j + 1; lastSignificant = "x"; continue;
    }
    if (c === "{" || c === "[" || c === "(") {
      const t = top();
      const node = { kind: c, label: labelBefore(i), key: t.kind === "{" ? keyBefore(i) : "", children: [], start: i, arg: 0, tern: 0, parentArg: t.arg, parentTern: t.tern, hasId: false };
      t.children.push(node); stack.push(node);
    } else if (c === "}" || c === "]" || c === ")") {
      if (stack.length > 1) stack.pop();
    } else if (c === ",") { const t = top(); t.arg++; t.tern = 0; }
    else if (c === "?" && d !== "." && d !== "?" && source[i - 1] !== "?") { top().tern++; }
    else if (c === ":" && top().tern > 0 && top().kind !== "{") { top().tern++; }
    if (!/\s/.test(c)) lastSignificant = c; else if (c === "\n") lastSignificant = "\n";
    i++;
  }
  return root;
}

const isProse = (t) => t.length >= 25 && /\s/.test(t) && /[a-zà-ÿ]{3}/i.test(t) && !/^[\w./-]+$/.test(t);

// Mesure d'une lecture : somme sur une séquence, maximum sur des variantes.
function sumInto(a, b) { for (const [k, v] of b.counts) a.counts.set(k, (a.counts.get(k) || 0) + v); a.len += b.len; a.hits.push(...b.hits); a.chars.push(...b.chars); }
function maxOf(list) {
  const out = { counts: new Map(), len: 0, hits: [], chars: [] };
  for (const r of list) { for (const [k, v] of r.counts) out.counts.set(k, Math.max(out.counts.get(k) || 0, v)); out.len = Math.max(out.len, r.len); out.hits.push(...r.hits); out.chars.push(...r.chars); }
  return out;
}

export function analyseFile(file) {
  const source = readFileSync(join(SRC, file), "utf8");
  const root = scan(source);
  const lineOf = (pos) => source.slice(0, pos).split("\n").length;
  const banned = [];
  const scenes = [];
  const fileChars = CHARACTERS.filter((c) => file.toLowerCase().includes(c));
  const isAltNode = (node) => {
    if (node.kind === "(" && ALT_CALLEES.has(node.label)) return "arg";
    if (node.kind === "{" && node.children.length > 1 && node.children.every((ch) => ALT_KEYS.has(ch.key))) return "key";
    if (node.kind === "[" && node.children.length > 1 && node.children.every((ch) => ch.kind === "(" && CHOICE_CALLEES.has(ch.label) || ch.kind === "{" && ch.hasId)) return "item";
    return null;
  };
  // Première passe : repérer les objets à identifiant.
  const markIds = (node) => { if (node.kind === "{") { const idStr = node.children.find((ch) => ch.kind === "str" && ch.key === "id"); if (idStr) { node.hasId = true; node.idText = idStr.text; } } (node.children || []).forEach(markIds); };
  markIds(root);
  const measure = (node, labels) => {
    if (node.kind === "str") {
      const r = { counts: new Map(), len: 0, hits: [], chars: [] };
      if (!isProse(node.text)) return r;
      r.len = node.text.length;
      const line = lineOf(node.start);
      for (const [label, re, accept] of TERMS) {
        re.lastIndex = 0; let m;
        while ((m = re.exec(node.text))) {
          if (accept && !accept(m, node.text.slice(0, m.index))) continue;
          r.counts.set(label, (r.counts.get(label) || 0) + 1); r.hits.push({ label, line, match: m[0] });
        }
      }
      BANNED.lastIndex = 0; let b;
      while ((b = BANNED.exec(node.text))) banned.push({ file, line, word: b[0] });
      CHARACTERS.forEach((c) => { if (new RegExp(c.replace("naiah", "na[iï]ah"), "i").test(node.text)) r.chars.push(c); });
      return r;
    }
    const myLabels = [...labels, (node.key || node.label || "").toLowerCase()];
    if (myLabels.some((l) => EXCLUDED_BLOCK_LABELS.some((rx) => rx.test(l)))) return { counts: new Map(), len: 0, hits: [], chars: [] };
    const results = node.children.map((ch) => ({ ch, r: measure(ch, myLabels) }));
    const alt = isAltNode(node);
    let out;
    if (alt) {
      const groups = new Map();
      for (const { ch, r } of results) { const g = alt === "arg" ? (ch.kind === "str" ? ch.arg : ch.parentArg) : alt === "key" ? ch.key : results.indexOf(results.find((x) => x.ch === ch)); if (!groups.has(g)) groups.set(g, { counts: new Map(), len: 0, hits: [], chars: [] }); sumInto(groups.get(g), r); }
      out = maxOf([...groups.values()]);
    } else {
      // Ternaires : branches exclusives à l'intérieur d'un même argument.
      const byArg = new Map();
      for (const { ch, r } of results) { const a = ch.kind === "str" ? ch.arg : ch.parentArg; const t = ch.kind === "str" ? ch.tern : ch.parentTern; if (!byArg.has(a)) byArg.set(a, new Map()); const m = byArg.get(a); if (!m.has(t)) m.set(t, { counts: new Map(), len: 0, hits: [], chars: [] }); sumInto(m.get(t), r); }
      out = { counts: new Map(), len: 0, hits: [], chars: [] };
      for (const m of byArg.values()) { const base = m.get(0); const branches = [...m].filter(([t]) => t > 0).map(([, v]) => v); if (base) sumInto(out, base); if (branches.length) sumInto(out, maxOf(branches)); }
    }
    node.reading = out; node.labels = myLabels;
    return out;
  };
  measure(root, []);
  // Scènes : blocs minimaux dont la lecture atteint SCENE_MIN_CHARS, ou objets à identifiant.
  const collect = (node, inScene) => {
    if (node.kind === "str" || !node.reading) return false;
    let childScene = false;
    for (const ch of node.children) if (collect(ch, inScene || node.hasId)) childScene = true;
    const big = node.reading.len >= SCENE_MIN_CHARS;
    if (((big && !childScene) || (node.hasId && !childScene && node.reading.len >= 400)) && node.reading.hits.length >= 0 && node.reading.len) {
      const labelsChars = CHARACTERS.filter((c) => node.labels.includes(c));
      const characters = labelsChars.length ? labelsChars : fileChars.length ? fileChars : [...new Set(node.reading.chars)].filter((c) => c !== "valurn");
      scenes.push({ file, name: node.idText || node.labels.filter(Boolean).slice(-3).join("/"), line: lineOf(node.start), characters: new Set(characters), counts: node.reading.counts, hits: node.reading.hits, len: node.reading.len });
      return true;
    }
    return childScene || big;
  };
  collect(root, false);
  return { scenes, banned };
}

export function analyseAll() {
  const scenes = []; const banned = [];
  for (const f of listFiles()) { const r = analyseFile(f); scenes.push(...r.scenes); banned.push(...r.banned); }
  return { scenes, banned };
}
