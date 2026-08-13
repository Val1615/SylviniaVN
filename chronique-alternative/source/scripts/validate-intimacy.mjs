import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { transformWithOxc } from "vite";

const sourceRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = resolve(sourceRoot, "src/intimacy-routes.ts");
const source = await readFile(sourcePath, "utf8");
const transformed = await transformWithOxc(source, sourcePath, { transformMode: "web" });
const moduleUrl = `data:text/javascript;base64,${Buffer.from(transformed.code).toString("base64")}`;
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
const forbiddenMatches = `${source}\n${legacySource}`.match(forbiddenMedicalTerms) || [];
if (forbiddenMatches.length) {
  throw new Error(`Vocabulaire anatomique à remplacer : ${[...new Set(forbiddenMatches.map((term) => term.toLocaleLowerCase("fr")))].join(", ")}`);
}

const advancedRoutes = Object.values(catalog.INTIMACY_ROUTES_BY_SEX)
  .flatMap((bySex) => Object.values(bySex))
  .flat()
  .filter((route) => route.chapters.explicite.flat().some((line) => /position en ciseaux|pénétration|chevauch/iu.test(line.text)));
if (advancedRoutes.length !== 27) {
  throw new Error(`27 routes avancées attendues (une par personnage et par sexe), ${advancedRoutes.length} obtenues`);
}

console.log(`[Intimité] ${report.characters} personnages · ${report.combinations} combinaisons · ${report.routes} routes · ${report.chapters} séquences · ${advancedRoutes.length} progressions avancées validées.`);
