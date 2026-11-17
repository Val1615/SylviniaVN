/* Sylvinia Studio : la couche de modifications lue par le moteur (studio/runtime). */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const root = path.join(__dirname, "..");
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");

function makeGame(published, search = "") {
  const rendered = [];
  const listeners = {};
  const ctx = {
    console: { info() {}, warn() {}, error() {}, log() {} },
    setTimeout: (fn) => { fn(); return 0; }, clearTimeout() {}, setInterval: () => 0,
    location: { search, origin: "http://local" },
    document: { readyState: "complete", body: { classList: { contains: () => false } }, getElementById: () => null, createElement: () => ({ style: {}, appendChild() {} }), addEventListener() {} },
    addEventListener: (t, fn) => { listeners[t] = fn; },
    Audio: function () { this.play = () => Promise.resolve(); },
  };
  ctx.window = ctx;
  vm.createContext(ctx);
  vm.runInContext(`
    const A = { bg_a: "assets/a.png" };
    const START_STATS = { audace: 0, sangfroid: 0, lien: 0, lucidite: 0, resonance: 0 };
    const statNames = { audace: "Audace", lucidite: "Lucidité" };
    let state = { scene: "s01", stats: { ...START_STATS }, flags: {}, history: [] };
    const S = {
      s01: { title: "Un", speaker: "Narrateur", text: "Texte d'origine", chars: [], next: "s02" },
      s02: { title: "Deux", speaker: "Remerii", text: "Seconde", chars: [], next: "s03" },
      s03: { title: "Trois", speaker: "Hylee", text: "Fin", chars: [], choices: [{ label: "A", next: "s01", effects: { audace: 1 } }] },
      echo: { title: "Echo", text: function () { return "dyn"; }, __storyWorldOriginalTextV2: "Base echo", __storyWorldEchoWrappedV2: true, next: "s01" },
    };
    function getSceneChapterLabel(id) { return "Chapitre I"; }
    function render() { __rendered.push(state.scene + "|" + (typeof S[state.scene].text === "function" ? S[state.scene].text() : S[state.scene].text)); }
  `, Object.assign(ctx, { __rendered: rendered }));
  vm.runInContext(read("studio/runtime/schema.js"), ctx);
  ctx.SylviniaStudioPublished = published;
  vm.runInContext(read("studio/runtime/runtime.js"), ctx);
  return { ctx, rendered, run: (code) => vm.runInContext(code, ctx) };
}

const schema = (() => { const c = { }; vm.createContext(c); c.window = c; vm.runInContext(read("studio/runtime/schema.js"), c); return c.SylviniaStudioSchema; })();

/* 1. Fichier vide : le jeu reste identique */
{
  const g = makeGame({ format: "sylvinia-studio", version: 1, revision: 0, nodes: {}, chapters: {} });
  assert.equal(g.run("S.s01.text"), "Texte d'origine");
  g.run("render()");
  assert.deepEqual(g.rendered, ["s01|Texte d'origine"]);
}
/* 2. Modification publiée appliquée, nouvelle réplique insérée, retour arrière possible */
const patch = {
  format: "sylvinia-studio", version: 1, revision: 3, nodes: {
    s01: { text: "Texte corrigé", next: "s01_stnew" },
    s01_stnew: { studioNew: true, title: "Un", speaker: "Hylee", text: "Ajout", chars: [], next: "s02" },
    s02: { studioIf: { stats: { lucidite: 30 } } },
    echo: { text: "Echo corrigé" },
  }, chapters: {},
};
{
  const g = makeGame(patch);
  assert.equal(g.run("S.s01.text"), "Texte corrigé");
  assert.equal(g.run("S.s01.next"), "s01_stnew");
  assert.equal(g.run("S.s01_stnew.text"), "Ajout");
  assert.equal(g.run("S.echo.__storyWorldOriginalTextV2"), "Echo corrigé", "les échos des temps libres restent dynamiques");
  assert.equal(typeof g.run("S.echo.text"), "function");
  /* condition de visibilité : Lucidité 0 → s02 est sautée */
  g.run("state.scene='s02'; render()");
  assert.equal(g.rendered.at(-1), "s03|Fin");
  g.run("state.scene='s02'; state.stats.lucidite=30; render()");
  assert.equal(g.rendered.at(-1), "s02|Seconde");
  /* un correctif tardif qui réécrit la scène est recouvert au rendu */
  g.run("S.s01.text='réécrit par un patch'; state.scene='s01'; render()");
  assert.equal(g.rendered.at(-1), "s01|Texte corrigé");
  /* retour arrière */
  g.run("SylviniaStudioRuntime.restore()");
  assert.equal(g.run("S.s01.text"), "Texte d'origine");
  assert.equal(g.run("S.s01.next"), "s02");
  assert.equal(g.run("'s01_stnew' in S"), false);
  assert.equal(g.run("S.echo.__storyWorldOriginalTextV2"), "Base echo");
}
/* 3. Mode extraction : rien n'est appliqué, l'instantané contient les scènes d'origine */
{
  const g = makeGame(patch, "?studio=extract");
  g.ctx.__SYLVINIA_STUDIO_MODE = "extract";
}
{
  const ctx = makeGame({ format: "sylvinia-studio", version: 1, revision: 0, nodes: {}, chapters: {} });
  const snap = JSON.parse(ctx.run("SylviniaStudioRuntime.snapshot()"));
  assert.deepEqual(snap.order, ["s01", "s02", "s03", "echo"]);
  assert.equal(snap.nodes.echo.text, "Base echo");
  assert.equal(snap.statNames.lien, "Regard de Remerii");
}
/* 4. Validation du format */
{
  const known = (id) => ["s01", "s02", "s03", "echo"].includes(id);
  assert.equal(schema.validate(patch, known).ok, true);
  const bad = JSON.parse(JSON.stringify(patch)); bad.nodes.s01.next = "inexistante";
  const r = schema.validate(bad, known);
  assert.equal(r.ok, false); assert.match(r.errors[0], /inexistante/);
  assert.equal(schema.validate({ format: "autre", version: 1, nodes: {} }, known).ok, false);
  const typed = JSON.parse(JSON.stringify(patch)); typed.nodes.s01.chars = "pas un tableau";
  assert.equal(schema.validate(typed, known).ok, false);
  assert.equal(schema.conditionMet({ stats: { lucidite: 20 }, any: ["a", "b"], none: ["c"] }, { stats: { lucidite: 25 }, flags: { b: true } }), true);
  assert.equal(schema.conditionMet({ none: ["c"] }, { stats: {}, flags: { c: true } }), false);
  assert.equal(schema.conditionMet({ all: { x: false } }, { stats: {}, flags: {} }), true);
}
/* 5. Le fichier publié du dépôt est valide */
{
  const c = {}; c.window = c; vm.createContext(c);
  vm.runInContext(read("studio/data/modifications.js"), c);
  assert.equal(c.SylviniaStudioPublished.format, "sylvinia-studio");
  assert.equal(schema.validate(c.SylviniaStudioPublished, () => true).ok, true);
}
/* 6. index.html charge le bac à sable en tête et la couche Studio après le moteur */
{
  const html = read("index.html");
  const sandbox = html.indexOf('studio/runtime/sandbox.js');
  const firstScript = html.indexOf("<script>");
  assert.ok(sandbox > 0 && sandbox < firstScript, "sandbox.js doit précéder les scripts du moteur");
  const runtime = html.indexOf('studio/runtime/runtime.js');
  assert.ok(runtime > html.indexOf("assets/ui/biblio-astrale/adapter.js"), "runtime.js doit suivre l'adaptateur");
  assert.ok(html.indexOf("studio/data/modifications.js") < runtime);
}
console.log("studio-overrides: ok");
