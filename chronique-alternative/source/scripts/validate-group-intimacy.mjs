import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { transformWithOxc } from "vite";

const sourceRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = resolve(sourceRoot, "src/group-dates.ts");
const source = await readFile(sourcePath, "utf8");
const transformed = await transformWithOxc(source, sourcePath, { transformMode: "web" });
const moduleUrl = `data:text/javascript;base64,${Buffer.from(transformed.code).toString("base64")}`;
let catalog;
try {
  catalog = await import(moduleUrl);
} catch (error) {
  console.error(`[Intimité à trois] ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}

const report = catalog.validateGroupIntimacyCatalog();
const expected = { pairs: 6, combinations: 18, routes: 54, chapters: 1728, dates: 6, games: 6 };
for (const [key, value] of Object.entries(expected)) {
  if (report[key] !== value) throw new Error(`${key}: ${value} attendu, ${report[key]} obtenu`);
}

const forbiddenMedicalTerms = /\b(?:vulve|vagin|vaginale?|clitoris|p[eé]nis|gland|verge|testicules?|scrotum|anus)\b/giu;
const forbiddenMatches = source.match(forbiddenMedicalTerms) || [];
if (forbiddenMatches.length) {
  throw new Error(`Vocabulaire anatomique à remplacer : ${[...new Set(forbiddenMatches.map((term) => term.toLocaleLowerCase("fr")))].join(", ")}`);
}

const advancedRoutes = Object.values(catalog.GROUP_INTIMACY_ROUTES_BY_SEX)
  .flatMap((bySex) => Object.values(bySex))
  .flat()
  .filter((route) => route.chapters.explicite.flat().some((line) => /position en ciseaux|pénétration|chevauch/iu.test(line.text)));
if (advancedRoutes.length !== 18) {
  throw new Error(`18 routes à trois avancées attendues (une par duo et par sexe), ${advancedRoutes.length} obtenues`);
}

console.log(`[Intimité à trois] ${report.pairs} duos · ${report.combinations} combinaisons · ${report.routes} routes · ${report.chapters} séquences · ${report.games} mini-jeux · ${advancedRoutes.length} progressions avancées validées.`);
