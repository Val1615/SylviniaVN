import assert from "node:assert/strict";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const sourceRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const modulePaths = [
  "ambient-dialogues",
  "game-data",
  "date-scenes",
  "heritages-data",
  "social-scenes",
  "campaign-scenes",
  "housing-scenes",
  "group-dates",
  "individual-explicit-scenes",
  "intimacy-scenes",
  "intimacy-games",
  "intimacy-routes",
  "home-intimacy-routes",
  "group-explicit-scenes",
  "scene-closures",
];
const characterNames = [
  "Hylee", "Remerii", "Iriana", "Tia", "Valurn", "Naïah", "Lineva",
  "Saidin", "Bellirith", "Amanea", "Allenna", "Draven",
];
const informalCharacters = new Set(["Hylee", "Naïah", "Bellirith", "Amanea"]);
const staleReactionPatterns = [
  /(?:choix|réponse|jugement|raisonnement|formulation|méthode|technique|solution) (?:est |reste |demeure )?(?:acceptable|correcte?|précise?|claire?|validée?)/iu,
  /j(?:e |’)apprécie (?:ce |cette |votre |ton |ta )/iu,
  /vous avez choisi/iu,
  /je valide/iu,
  /je prends acte/iu,
];

const server = await createServer({
  root: sourceRoot,
  appType: "custom",
  logLevel: "silent",
  server: { middlewareMode: true },
});

try {
  const modules = await Promise.all(modulePaths.map((name) => server.ssrLoadModule(`/src/${name}.ts`)));
  const lines = [];
  const seen = new Set();

  function walk(value, moduleName, path = moduleName) {
    if (!value || typeof value !== "object" || seen.has(value)) return;
    seen.add(value);
    if (typeof value.speaker === "string" && typeof value.text === "string") {
      lines.push({ moduleName, path, speaker: value.speaker, text: value.text });
    }
    if (Array.isArray(value)) {
      value.forEach((entry, index) => walk(entry, moduleName, `${path}[${index}]`));
      return;
    }
    for (const [key, entry] of Object.entries(value)) walk(entry, moduleName, `${path}.${key}`);
  }

  modules.forEach((module, index) => {
    for (const [name, value] of Object.entries(module)) {
      if (typeof value !== "function") walk(value, modulePaths[index], `${modulePaths[index]}.${name}`);
    }
  });

  const game = modules[modulePaths.indexOf("game-data")];
  const ambient = modules[modulePaths.indexOf("ambient-dialogues")];
  const castIds = game.CHARACTERS.map((character) => character.id);
  assert.equal(characterNames.length, castIds.length, "le validateur de voix doit couvrir tout le casting");

  const ambientCounts = Object.fromEntries(castIds.map((id) => [id, ambient.AMBIENT_LINES[id]?.length || 0]));
  for (const [id, count] of Object.entries(ambientCounts)) {
    assert.ok(count >= 15, `${id}: moins de quinze conversations libres`);
  }

  const report = characterNames.map((name) => {
    const spoken = lines.filter((line) => line.speaker === name);
    const words = spoken.reduce((sum, line) => sum + line.text.trim().split(/\s+/u).length, 0);
    const formulas = spoken.filter((line) => staleReactionPatterns.some((pattern) => pattern.test(line.text)));
    const formalLines = spoken.filter((line) => /\b(?:vous|votre|vos)\b/iu.test(line.text));
    const informalLines = spoken.filter((line) => /\b(?:tu|toi|ton|ta|tes)\b/iu.test(line.text));
    return { name, lines: spoken.length, words, formal: formalLines.length, informal: informalLines.length, formalLines, formulas };
  });

  for (const entry of report.filter((item) => informalCharacters.has(item.name))) {
    assert.ok(entry.informal > entry.formal * 3, `${entry.name}: le tutoiement doit nettement dominer`);
  }

  const formulaCount = report.reduce((sum, entry) => sum + entry.formulas.length, 0);
  if (process.argv.includes("--report")) {
    console.table(report.map(({ formulas, formalLines, ...entry }) => ({ ...entry, formulas: formulas.length })));
    console.table(ambientCounts);
    for (const entry of report.filter((item) => informalCharacters.has(item.name))) {
      for (const line of entry.formalLines) console.log(`${entry.name} · registre à vérifier · ${line.moduleName} · ${line.path}\n  ${line.text}`);
    }
    for (const entry of report) {
      for (const line of entry.formulas) console.log(`${entry.name} · ${line.moduleName} · ${line.path}\n  ${line.text}`);
    }
  }
  assert.equal(formulaCount, 0, `des réactions formulaires subsistent (${formulaCount})`);
  console.log(`Dialogue validé · ${lines.length} répliques · ${formulaCount} réactions formulaires · ${castIds.length} voix.`);
} finally {
  await server.close();
}
