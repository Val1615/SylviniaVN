import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { transformWithOxc } from "vite";

const sourceRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = resolve(sourceRoot, "src/intimacy-routes.ts");
const advancedPath = resolve(sourceRoot, "src/individual-explicit-scenes.ts");
const source = await readFile(sourcePath, "utf8");
const advancedSource = await readFile(advancedPath, "utf8");
const advancedTransformed = await transformWithOxc(advancedSource, advancedPath, { transformMode: "web" });
const advancedModuleUrl = `data:text/javascript;base64,${Buffer.from(advancedTransformed.code).toString("base64")}`;
const advancedCatalog = await import(advancedModuleUrl);
const transformed = await transformWithOxc(source, sourcePath, { transformMode: "web" });
const inlinedCode = transformed.code.replace(
  /import\s*\{\s*individualExplicitScene\s*\}\s*from\s*["']\.\/individual-explicit-scenes["'];?/u,
  "const individualExplicitScene = globalThis.__sylviniaIndividualExplicitScene;",
);
globalThis.__sylviniaIndividualExplicitScene = advancedCatalog.individualExplicitScene;
const moduleUrl = `data:text/javascript;base64,${Buffer.from(inlinedCode).toString("base64")}`;
let catalog;
try {
  catalog = await import(moduleUrl);
} catch (error) {
  console.error(`[Intimité] ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}
const report = catalog.validateIntimacyRouteCatalog();

const expected = { characters: 9, combinations: 27, routes: 81, chapters: 2592 };
for (const [key, value] of Object.entries(expected)) {
  if (report[key] !== value) {
    throw new Error(`${key}: ${value} attendu, ${report[key]} obtenu`);
  }
}

const labels = Object.values(catalog.INTIMACY_ROUTES_BY_SEX)
  .flatMap((bySex) => Object.values(bySex))
  .flat()
  .map((route) => route.text);

if (new Set(labels).size !== labels.length) {
  throw new Error("Chaque choix final doit posséder un libellé propre au personnage et au sexe.");
}

const forbiddenMedicalTerms = /\b(?:vulve|vagin|vaginale?|clitoris|p[eé]nis|gland|verge|testicules?|scrotum|anus)\b/giu;
const legacySource = await readFile(resolve(sourceRoot, "src/intimacy-scenes.ts"), "utf8");
const forbiddenMatches = `${source}\n${legacySource}\n${advancedSource}`.match(forbiddenMedicalTerms) || [];
if (forbiddenMatches.length) {
  throw new Error(`Vocabulaire anatomique à remplacer : ${[...new Set(forbiddenMatches.map((term) => term.toLocaleLowerCase("fr")))].join(", ")}`);
}

const explicitRoutes = Object.values(catalog.INTIMACY_ROUTES_BY_SEX)
  .flatMap((bySex) => Object.values(bySex))
  .flat();
const physicalChapters = explicitRoutes.map((route) => route.chapters.explicite[5]);
if (physicalChapters.some((chapter) => !chapter || chapter.length < 3 || !chapter.some((line) => line.speaker !== "Narration"))) {
  throw new Error("Chaque route explicite doit contenir sa propre position, au moins un dialogue et une réaction.");
}
const physicalSignatures = physicalChapters.map((chapter) => chapter.map((line) => `${line.speaker}:${line.text}`).join("\n"));
if (new Set(physicalSignatures).size !== 81) throw new Error("Les 81 embranchements physiques individuels doivent tous être uniques.");
const physicalLines = physicalChapters.flat().map((line) => line.text.trim());
if (new Set(physicalLines).size !== physicalLines.length) throw new Error("Une ligne physique individuelle est répétée entre deux embranchements.");

console.log(`[Intimité] ${report.characters} personnages · ${report.combinations} combinaisons · ${report.routes} routes · ${report.chapters} séquences · ${physicalSignatures.length} embranchements physiques uniques validés.`);
