/* Sylvinia Studio · Chronique Alternative
   Repère, dans les modules de contenu, les textes que l'auteur peut modifier depuis le Studio,
   avec un identifiant stable pour chacun. Utilisé par le plugin Vite (qui enveloppe ces textes
   pour que le jeu lise les modifications publiées) et pour produire le catalogue du Studio.
   Rien n'est réécrit dans les fichiers sources. */
import ts from "typescript";

export const CA_STUDIO_FORMAT = "sylvinia-studio-ca";
export const CA_STUDIO_VERSION = 1;

/* Modules purement techniques : jamais enveloppés. */
export const SKIP_MODULES = new Set([
  "chatgpt-auth", "sprite-system", "intimate-sprite-system", "music-data", "intimate-cg", "rhythm-intimacy-engine", "rhythm-intimacy-sfx", "rhythm-anchors", "rhythm-profiles",
]);

const EFFECT_KEYS = new Set(["affection", "trust", "desire", "confluence", "coins", "audace", "lucidite", "sangFroid", "resonance"]);
const DENY_PROPS = new Set([
  "id", "key", "kind", "src", "href", "image", "img", "sprite", "background", "bg", "music", "audio", "sound", "sfx",
  "className", "class", "icon", "flag", "flags", "route", "path", "stat", "mood", "intimateMood", "character", "characters",
  "speaker", "cast", "location", "spot", "period", "slug", "cg", "poster", "color", "accent", "variant", "outfit", "pose",
  "requiresFlag", "requiresFlags", "setFlag", "setFlags", "unlockFlag", "dateId", "sceneId", "questId", "secretId", "target",
  "next", "anchor", "region", "climate", "season", "weekday", "month", "theme", "style", "font", "url", "file", "asset", "assets",
]);
const DENY_METHODS = new Set([
  "includes", "startsWith", "endsWith", "indexOf", "lastIndexOf", "split", "replace", "replaceAll", "match", "matchAll", "search",
  "has", "get", "delete", "getItem", "removeItem", "querySelector", "querySelectorAll", "getElementById", "addEventListener",
  "removeEventListener", "test", "exec", "localeCompare", "padStart", "padEnd", "join", "toggle", "contains", "closest",
]);
const FIRST_ARG_METHODS = new Set(["set", "setItem", "setAttribute", "setProperty"]);

export function fnv(s) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  return (h >>> 0).toString(36).padStart(7, "0");
}

export function isProse(text) {
  const t = text.trim();
  if (t.length < 4) return false;
  if (!/\s/.test(t)) return false;
  if (!/\p{L}{2,}/u.test(t)) return false;
  if (/^[a-z0-9_-]+(\s+[a-z0-9_.:\/#-]+)+$/.test(t) && /[-_]/.test(t)) return false; /* listes de classes CSS */
  if (/^(\.?\/)?assets\//.test(t) || /^https?:\/\//.test(t)) return false;
  if (/^[\[\](){}<>=!&|?:;.,\d\s+*\/%-]+$/.test(t)) return false;
  return true;
}

function propName(node) {
  if (!node) return "";
  if (ts.isIdentifier(node) || ts.isPrivateIdentifier(node)) return node.text;
  if (ts.isStringLiteral(node) || ts.isNumericLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  return "";
}

function inTypeOrDeclaration(node) {
  for (let p = node.parent; p; p = p.parent) {
    if (ts.isTypeNode(p) || ts.isImportDeclaration(p) || ts.isExportDeclaration(p) || ts.isTypeAliasDeclaration(p) ||
        ts.isInterfaceDeclaration(p) || ts.isModuleDeclaration(p) || ts.isEnumDeclaration(p) || ts.isDecorator(p) ||
        ts.isImportEqualsDeclaration(p) || ts.isExternalModuleReference(p)) return true;
  }
  return false;
}

/* Le texte occupe-t-il une position « valeur affichable » ? */
function editablePosition(node) {
  const p = node.parent;
  if (!p) return false;
  if (ts.isExpressionStatement(p)) return false;
  if (ts.isPropertyAssignment(p) && p.name === node) return false;
  if (ts.isPropertyAssignment(p) && DENY_PROPS.has(propName(p.name))) return false;
  if (ts.isComputedPropertyName(p) || ts.isElementAccessExpression(p) && p.argumentExpression === node) return false;
  if (ts.isCaseClause(p)) return false;
  if (ts.isBinaryExpression(p)) {
    const k = p.operatorToken.kind;
    if ([ts.SyntaxKind.EqualsEqualsEqualsToken, ts.SyntaxKind.ExclamationEqualsEqualsToken, ts.SyntaxKind.EqualsEqualsToken,
      ts.SyntaxKind.ExclamationEqualsToken, ts.SyntaxKind.InKeyword, ts.SyntaxKind.InstanceOfKeyword].includes(k)) return false;
  }
  if (ts.isTaggedTemplateExpression(p)) return false;
  if ((ts.isCallExpression(p) || ts.isNewExpression(p)) && p.arguments && p.arguments.includes(node)) {
    const callee = p.expression;
    const name = ts.isPropertyAccessExpression(callee) ? callee.name.text : ts.isIdentifier(callee) ? callee.text : "";
    if (DENY_METHODS.has(name)) return false;
    if (FIRST_ARG_METHODS.has(name) && p.arguments[0] === node) return false;
    if (ts.isNewExpression(p) && ["RegExp", "URL", "Audio", "Image", "Map", "Set"].includes(name)) return false;
    if (["require", "fetch", "RegExp", "Symbol", "import"].includes(name)) return false;
  }
  if (ts.isEnumMember(p) || ts.isExportSpecifier(p) || ts.isImportSpecifier(p)) return false;
  if (ts.isJsxAttribute(p)) return false;
  return true;
}

/* Fonctions d'écriture du type  const H = (text) => ({ speaker: "Hylee", text })  */
function helperInfo(sf) {
  const map = new Map();
  const visit = (n) => {
    if (ts.isVariableDeclaration(n) && ts.isIdentifier(n.name) && n.initializer && (ts.isArrowFunction(n.initializer) || ts.isFunctionExpression(n.initializer))) {
      const fn = n.initializer;
      let body = fn.body;
      while (body && ts.isParenthesizedExpression(body)) body = body.expression;
      if (body && ts.isBlock(body)) {
        const ret = body.statements.find((s) => ts.isReturnStatement(s));
        body = ret && ret.expression; while (body && ts.isParenthesizedExpression(body)) body = body.expression;
      }
      if (body && ts.isObjectLiteralExpression(body)) {
        const info = { params: fn.parameters.map((x) => propName(x.name)), speaker: "", choice: false };
        for (const pr of body.properties) {
          const nm = propName(pr.name);
          if (nm === "speaker" && ts.isPropertyAssignment(pr) && (ts.isStringLiteral(pr.initializer) || ts.isNoSubstitutionTemplateLiteral(pr.initializer))) info.speaker = pr.initializer.text;
          if (nm === "response" || nm === "effects") info.choice = true;
        }
        map.set(n.name.text, info);
      }
    }
    ts.forEachChild(n, visit);
  };
  visit(sf);
  /* fonctions qui délèguent à une autre : const A = (text) => L("Naïah", text) */
  const deleg = (n) => {
    if (ts.isVariableDeclaration(n) && ts.isIdentifier(n.name) && !map.has(n.name.text) && n.initializer && ts.isArrowFunction(n.initializer)) {
      let body = n.initializer.body; while (body && ts.isParenthesizedExpression(body)) body = body.expression;
      if (body && ts.isCallExpression(body) && ts.isIdentifier(body.expression) && map.has(body.expression.text)) {
        const inner = map.get(body.expression.text);
        const own = n.initializer.parameters.map((x) => propName(x.name));
        const info = { params: own.map((nm) => { const i = body.arguments.findIndex((a) => ts.isIdentifier(a) && a.text === nm); return i >= 0 && inner.params[i] ? inner.params[i] : nm; }), speaker: inner.speaker, choice: inner.choice };
        const si = inner.params.indexOf("speaker"); const a = si >= 0 ? body.arguments[si] : null;
        if (a && (ts.isStringLiteral(a) || ts.isNoSubstitutionTemplateLiteral(a))) info.speaker = a.text;
        map.set(n.name.text, info);
      }
    }
    ts.forEachChild(n, deleg);
  };
  deleg(sf);
  return map;
}

function objStringProp(obj, name) {
  for (const pr of obj.properties) {
    if (ts.isPropertyAssignment(pr) && propName(pr.name) === name && (ts.isStringLiteral(pr.initializer) || ts.isNoSubstitutionTemplateLiteral(pr.initializer))) return pr.initializer.text;
  }
  return null;
}

function parentPropName(node) {
  for (let q = node.parent; q; q = q.parent) { if (ts.isPropertyAssignment(q)) return propName(q.name); if (ts.isVariableDeclaration(q)) return ""; }
  return "";
}
function topDeclName(node) {
  let last = null;
  for (let p = node.parent; p; p = p.parent) {
    if (ts.isVariableDeclaration(p) && ts.isIdentifier(p.name)) last = p.name.text;
    else if ((ts.isFunctionDeclaration(p)) && p.name) last = p.name.text;
  }
  return last || "module";
}

/* Scène = l'objet le plus englobant qui porte un « id » textuel ; sinon la déclaration de premier niveau. */
const ID_RE = /^[a-z0-9][\w.-]*$/i;
function callId(p) {
  if (!ts.isCallExpression(p) || !p.arguments.length) return null;
  const a = p.arguments[0];
  if (!(ts.isStringLiteral(a) || ts.isNoSubstitutionTemplateLiteral(a)) || !ID_RE.test(a.text) || !/[-_]/.test(a.text)) return null;
  const b = p.arguments[1];
  return { key: a.text, title: b && (ts.isStringLiteral(b) || ts.isNoSubstitutionTemplateLiteral(b)) && isProse(b.text) && b.text.length < 90 ? b.text : "" };
}
function idOwner(p) {
  if (ts.isObjectLiteralExpression(p)) { const id = objStringProp(p, "id"); if (id && ID_RE.test(id)) return { key: id, title: objStringProp(p, "title") || objStringProp(p, "label") || objStringProp(p, "name") || "" }; }
  return callId(p);
}
function sceneOf(node, sf) {
  let best = null;
  for (let p = node.parent; p; p = p.parent) { const o = idOwner(p); if (o) best = o; }
  const section = topDeclName(node);
  if (best) return { key: best.key, title: best.title, section };
  return { key: "§" + section, title: "", section };
}

function ownerKey(node) {
  for (let p = node.parent; p; p = p.parent) { const o = idOwner(p); if (o) return o.key; }
  return "";
}
const NUM_KEYS = (name, parentProp) => EFFECT_KEYS.has(name) || /^(min|max)[A-Z]\w*$/.test(name) || name === "unlockStage" || (name === "value" && /^requires/.test(parentProp));

function describe(node, helpers) {
  let sp = "", role = "";
  const p = node.parent;
  if (ts.isCallExpression(p) && ts.isIdentifier(p.expression) && helpers.has(p.expression.text)) {
    const h = helpers.get(p.expression.text); const idx = p.arguments.indexOf(node);
    role = h.choice ? (h.params[idx] === "text" ? "choix" : h.params[idx] || "texte") : (h.params[idx] || "texte");
    if (!h.choice) sp = h.speaker || "";
  }
  if (ts.isPropertyAssignment(p)) {
    role = propName(p.name);
    if (ts.isObjectLiteralExpression(p.parent)) sp = objStringProp(p.parent, "speaker") || "";
  }
  if (!role) {
    for (let q = p; q; q = q.parent) { if (ts.isPropertyAssignment(q)) { role = propName(q.name); break; } }
  }
  return { sp, role: role || "texte" };
}

function elemKind(e) {
  if (ts.isObjectLiteralExpression(e) || ts.isCallExpression(e)) return "obj";
  if ((ts.isStringLiteral(e) || ts.isNoSubstitutionTemplateLiteral(e)) && isProse(e.text)) return "str";
  if (ts.isSpreadElement(e)) return "spread";
  return "other";
}
/* Listes de contenu : objets, appels d'écriture ou paragraphes. Jamais les listes de drapeaux ou de nombres. */
function contentArray(node) {
  const k = node.elements.map(elemKind);
  if (k.includes("other")) return false;
  if (!k.includes("obj") && !k.includes("str")) return false;
  const p = node.parent;
  if (ts.isPropertyAssignment(p) && DENY_PROPS.has(propName(p.name))) return false;
  if (ts.isSpreadElement(p) || ts.isElementAccessExpression(p) || ts.isPropertyAccessExpression(p)) return false;
  if (ts.isCallExpression(p) && p.expression === node) return false;
  return true;
}
function arrayOwner(node) {
  /* chemin : propriété ou argument jusqu'au propriétaire identifié, sinon jusqu'à la constante de premier niveau */
  const parts = [];
  let child = node;
  for (let p = node.parent; p; child = p, p = p.parent) {
    if (ts.isPropertyAssignment(p) && p.initializer === child) parts.unshift(propName(p.name));
    else if (ts.isCallExpression(p) && p.arguments.includes(child)) { const o = callId(p); if (o) return { path: o.key + "." + ["arg" + p.arguments.indexOf(child), ...parts].join("."), top: false }; return null; }
    else if (ts.isObjectLiteralExpression(p)) { const o = idOwner(p); if (o) return parts.length ? { path: o.key + "." + parts.join("."), top: false } : null; }
    else if (ts.isArrayLiteralExpression(p)) return null;
    else if (ts.isVariableDeclaration(p)) {
      if (!ts.isIdentifier(p.name)) return null;
      const st = p.parent && p.parent.parent;
      if (!st || !ts.isVariableStatement(st) || st.parent !== node.getSourceFile()) return null;
      return { path: [p.name.text, ...parts].join("."), top: true };
    }
    else if (ts.isAsExpression(p) || ts.isSatisfiesExpression(p) || ts.isParenthesizedExpression(p)) continue;
    else return null;
  }
  return null;
}

/** Parcourt un module et renvoie les textes modifiables (et les nombres d'effets), avec leurs positions. */
export function collectModule(code, moduleKey, opts = {}) {
  const reserved = opts.reserved || new Set();
  const sf = ts.createSourceFile(moduleKey + ".ts", code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const helpers = helperInfo(sf);
  const items = [];
  const seen = new Map();
  const scenes = []; const sceneIdx = new Map();
  const mkId = (kind, basis) => { const base = `${moduleKey}:${kind}${fnv(basis)}`; const n = seen.get(base) || 0; seen.set(base, n + 1); return n ? `${base}.${n}` : base; };
  const scene = (node) => {
    const s = sceneOf(node, sf); const k = s.section + "|" + s.key;
    if (!sceneIdx.has(k)) { sceneIdx.set(k, scenes.length); scenes.push(s); }
    return sceneIdx.get(k);
  };
  const line = (node) => sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1;
  const visit = (node) => {
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      const text = node.text;
      if (isProse(text) && !reserved.has(text) && editablePosition(node) && !inTypeOrDeclaration(node)) {
        const d = describe(node, helpers);
        items.push({ id: mkId("s", text), k: "s", text, start: node.getStart(sf), end: node.getEnd(), sc: scene(node), sp: d.sp, role: d.role, line: line(node) });
      }
      return;
    }
    if (ts.isTemplateExpression(node)) {
      const parts = [node.head.text, ...node.templateSpans.map((s) => s.literal.text)];
      let text = parts[0];
      node.templateSpans.forEach((s, i) => { text += `{${i + 1}}` + parts[i + 1]; });
      const plain = parts.join(" x ");
      if (isProse(plain) && editablePosition(node) && !inTypeOrDeclaration(node)) {
        const d = describe(node, helpers);
        const vals = node.templateSpans.map((s) => s.expression.getText(sf));
        items.push({ id: mkId("t", text), k: "t", text, vals, start: node.getStart(sf), end: node.getEnd(), sc: scene(node), sp: d.sp, role: d.role, line: line(node) });
      }
      ts.forEachChild(node, visit);
      return;
    }
    if (ts.isPropertyAssignment(node) && NUM_KEYS(propName(node.name), parentPropName(node)) && !inTypeOrDeclaration(node)) {
      let v = node.initializer; let neg = false;
      if (ts.isPrefixUnaryExpression(v) && v.operator === ts.SyntaxKind.MinusToken && ts.isNumericLiteral(v.operand)) { neg = true; v = v.operand; }
      if (ts.isNumericLiteral(v)) {
        const val = (neg ? -1 : 1) * Number(v.text);
        let path = propName(node.name); let cond = false;
        if (/^(min|max)[A-Z]|^unlock|^value$/.test(path)) cond = true;
        for (let q = node.parent; q; q = q.parent) { if (ts.isPropertyAssignment(q)) { const nm = propName(q.name); if (/^requires|^min|condition/i.test(nm)) cond = true; if (nm === "stats" || nm === "effects" || /^requires/.test(nm)) path = nm + "." + path; break; } }
        const owner = ownerKey(node);
        items.push({ id: mkId("n", owner + "|" + path + "|" + val), k: "n", text: String(val), value: val, start: node.initializer.getStart(sf), end: node.initializer.getEnd(), sc: scene(node), sp: owner, role: (cond ? "condition " : "effet ") + path, line: line(node) });
      }
      return;
    }
    /* seuils et effets passés en argument à une fonction d'écriture locale, par exemple secret(id, titre, palier, minTrust, ...) */
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && helpers.has(node.expression.text) && !inTypeOrDeclaration(node)) {
      const params = helpers.get(node.expression.text).params;
      node.arguments.forEach((arg, i) => {
        const name = params[i];
        if (!name || !NUM_KEYS(name, "")) return;
        let v = arg; let neg = false;
        if (ts.isPrefixUnaryExpression(v) && v.operator === ts.SyntaxKind.MinusToken && ts.isNumericLiteral(v.operand)) { neg = true; v = v.operand; }
        if (!ts.isNumericLiteral(v)) return;
        const val = (neg ? -1 : 1) * Number(v.text);
        const cond = /^(min|max)[A-Z]|^unlock/.test(name);
        const owner = ownerKey(arg);
        items.push({ id: mkId("n", owner + "|" + name + "|" + val), k: "n", text: String(val), value: val, start: arg.getStart(sf), end: arg.getEnd(), sc: scene(arg), sp: owner, role: (cond ? "condition " : "effet ") + name, line: line(arg) });
      });
    }
    if (ts.isArrayLiteralExpression(node) && node.elements.length && !inTypeOrDeclaration(node) && contentArray(node)) {
      const own = arrayOwner(node);
      if (own) {
        const kinds = node.elements.map(elemKind);
        const kind = kinds.includes("str") && !kinds.includes("obj") ? "paras" : "items";
        arrays.push({ id: mkId("a", own.path), k: "a", path: own.path, kind, len: node.elements.length, start: node.getStart(sf), end: node.getEnd(), sc: scene(node), line: line(node), top: own.top, els: node.elements.map((e) => [line(e), sf.getLineAndCharacterOfPosition(e.getEnd()).line + 1]) });
      }
    }
    ts.forEachChild(node, visit);
  };
  const arrays = [];
  visit(sf);
  return { items, scenes, arrays };
}

/** Enveloppe les textes repérés : "x" devient __caT("id","x"), `a${b}` devient __caTag("id")`a${b}`, 3 devient __caN("id",3). */
export function wrapModule(code, moduleKey, opts = {}) {
  const { items, scenes, arrays } = collectModule(code, moduleKey, opts);
  if (!items.length && !arrays.length) return null;
  const edits = [];
  for (const a of arrays) { edits.push([a.start, `__caArr(${JSON.stringify(a.id)},`]); edits.push([a.end, `)`]); }
  for (const it of items) {
    if (it.k === "s") { edits.push([it.start, `__caT(${JSON.stringify(it.id)},`]); edits.push([it.end, `)`]); }
    else if (it.k === "t") edits.push([it.start, `__caTag(${JSON.stringify(it.id)})`]);
    else { edits.push([it.start, `__caN(${JSON.stringify(it.id)},`]); edits.push([it.end, `)`]); }
  }
  /* insertions de la fin vers le début ; à position égale, les fermetures avant les ouvertures */
  /* à position égale : l'ouverture d'abord, la fermeture ensuite, pour obtenir « )__caT( » */
  edits.sort((a, b) => b[0] - a[0] || (a[1] === ")" ? 1 : 0) - (b[1] === ")" ? 1 : 0));
  let out = code;
  for (const [pos, s] of edits) out = out.slice(0, pos) + s + out.slice(pos);
  return { code: `import { __caT, __caTag, __caN, __caArr } from "virtual:sylvinia-studio-ca";\n` + out, items, scenes, arrays };
}

/** Textes qui servent aussi de clé ou de comparaison quelque part (ils ne seront pas modifiables). */
export function collectReserved(files) {
  const out = new Set();
  for (const { code, name } of files) {
    const sf = ts.createSourceFile(name, code, ts.ScriptTarget.Latest, true, name.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
    const visit = (node) => {
      if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
        const p = node.parent; const t = node.text;
        if (isProse(t) && p) {
          const keyLike = (ts.isPropertyAssignment(p) && p.name === node) || ts.isCaseClause(p) || ts.isComputedPropertyName(p) ||
            (ts.isElementAccessExpression(p) && p.argumentExpression === node) ||
            (ts.isBinaryExpression(p) && [ts.SyntaxKind.EqualsEqualsEqualsToken, ts.SyntaxKind.ExclamationEqualsEqualsToken, ts.SyntaxKind.EqualsEqualsToken, ts.SyntaxKind.ExclamationEqualsToken, ts.SyntaxKind.InKeyword].includes(p.operatorToken.kind)) ||
            ((ts.isCallExpression(p)) && ts.isPropertyAccessExpression(p.expression) && ["includes", "has", "get", "indexOf", "startsWith", "endsWith"].includes(p.expression.name.text)) ||
            ts.isLiteralTypeNode(p);
          if (keyLike) out.add(t);
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(sf);
  }
  return out;
}

const NAMES = { hylee: "Hylee", naiah: "Naïah", remerii: "Remerii", bellirith: "Bellirith", valurn: "Valurn", allenna: "Allenna", lineva: "Lineva", iriana: "Iriana", amanea: "Amanea" };
const WORDS = {
  date: "rendez-vous", dates: "rendez-vous", intimacy: "intimité", intimate: "intime", cross: "croisée", quest: "quête", ambient: "moments libres",
  confidences: "confidences", home: "logis", scenes: "scènes", scene: "scène", group: "groupe", kit: "outils", minigame: "mini-jeu",
  world: "monde", relation: "relation", beats: "battements", life: "vie", gifts: "cadeaux", moods: "humeurs", activities: "activités",
  wishes: "envies", initiative: "initiatives", texts: "textes", never: "Je n’ai jamais", content: "contenu", reactions: "réactions", topics: "sujets",
  transitions: "transitions", game: "jeu", data: "données", routes: "routes", explicit: "explicites", individual: "individuelles", prose: "prose",
  games: "jeux", campaign: "campagne", housing: "logement", heritages: "héritages", jobs: "métiers", advanced: "avancés", social: "sociales",
  story: "récit", narrative: "narration", calendar: "calendrier", weather: "météo", market: "marché", quests: "quêtes", search: "recherche",
  closures: "clôtures", contextual: "contextuels", choices: "choix", knowledge: "savoirs", intrusions: "intrusions", heure: "heure", shared: "partagée",
  place: "lieu", one: "première", free: "libre", day: "jour", wind: "vent", forest: "forêt", edge: "lisière", lake: "lac", relay: "relais",
  types: "types", training: "entraînement", basin: "bassin", proximity: "proximité", frames: "cadres", simulation: "simulation", limit: "limite",
  first: "première", diversion: "diversion", operation: "opération", anchor: "ancre", alpha: "Alpha", hunt: "chasse", rules: "règles", gameplay: "gameplay",
  state: "état", dossier: "dossier",
};
export function moduleLabel(key) {
  const toks = key.replace("living-world", "monde-vivant").split("-");
  const who = toks.filter((t) => NAMES[t]).map((t) => NAMES[t]);
  const rest = toks.filter((t) => !NAMES[t]).map((t) => WORDS[t] || t);
  const group = who.length ? who.join(" × ") : (toks[0] === "life" ? "Vie quotidienne" : "Monde et systèmes");
  if (toks[0] === "life") return { label: "Vie quotidienne · " + rest.slice(1).join(" "), group };
  const label = (who.length ? who.join(" × ") + (rest.length ? " · " : "") : "") + rest.join(" ");
  return { label: label.charAt(0).toUpperCase() + label.slice(1), group };
}

/* Code exécuté dans le jeu : lit les modifications publiées (studio/data/modifications-ca.js),
   ou le brouillon envoyé par le Studio en aperçu isolé. Sans modification, chaque texte reste l'original. */
export const CA_RUNTIME = `
const G = globalThis;
const P = G.SylviniaStudioCAPublished;
const O = P && P.entries && typeof P.entries === "object" ? P.entries : {};
const has = Object.prototype.hasOwnProperty;
const ANY = Object.keys(O).length > 0;
export function __caT(id, s) {
  if (ANY && has.call(O, id)) { const v = O[id]; if (typeof v === "string") return v; }
  return s;
}
export function __caN(id, n) {
  if (ANY && has.call(O, id)) { const v = O[id]; if (typeof v === "number" && isFinite(v)) return v; }
  return n;
}
export function __caTag(id) {
  return function (strs) {
    const vals = Array.prototype.slice.call(arguments, 1);
    if (ANY && has.call(O, id) && typeof O[id] === "string") {
      return O[id].replace(/\\{(\\d+)\\}/g, function (m, d) { const i = Number(d) - 1; return i >= 0 && i < vals.length ? String(vals[i]) : m; });
    }
    let out = strs[0];
    for (let i = 0; i < vals.length; i++) out += String(vals[i]) + strs[i + 1];
    return out;
  };
}
const L = P && P.lists && typeof P.lists === "object" ? P.lists : {};
const REG = G.__SYLVINIA_STUDIO_MODE === "extract" ? (G.SylviniaStudioCARegistry = G.SylviniaStudioCARegistry || {}) : null;
let applied = 0;
/* Listes : répliques ou réponses ajoutées, masquées ; nouveaux contenus ajoutés aux collections du jeu. */
export function __caArr(id, arr) {
  const ops = has.call(L, id) ? L[id] : null;
  let out = arr;
  if (ops && Array.isArray(arr)) {
    const hide = new Set(Array.isArray(ops.hide) ? ops.hide : []);
    const ins = Array.isArray(ops.insert) ? ops.insert : [];
    out = [];
    for (let i = 0; i <= arr.length; i++) {
      for (const x of ins) if ((x.at === i || (i === arr.length && !(x.at < arr.length))) && x.item != null) out.push(x.item);
      if (i < arr.length && !hide.has(i)) out.push(arr[i]);
    }
    applied++;
  }
  if (REG) REG[id] = out;
  return out;
}
G.SylviniaStudioCAApplied = { count: Object.keys(O).length, lists: Object.keys(L).length };
`;
