import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { transformWithOxc } from "vite";

const sourceRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = resolve(sourceRoot, "src/group-dates.ts");
const advancedPath = resolve(sourceRoot, "src/group-explicit-scenes.ts");
const source = await readFile(sourcePath, "utf8");
const advancedSource = await readFile(advancedPath, "utf8");
const advancedTransformed = await transformWithOxc(advancedSource, advancedPath, { transformMode: "web" });
const advancedModuleUrl = `data:text/javascript;base64,${Buffer.from(advancedTransformed.code).toString("base64")}`;
const advancedCatalog = await import(advancedModuleUrl);
const transformed = await transformWithOxc(source, sourcePath, { transformMode: "web" });
const inlinedCode = transformed.code.replace(
  /import\s*\{\s*groupExplicitScene\s*\}\s*from\s*["']\.\/group-explicit-scenes["'];?/u,
  "const groupExplicitScene = globalThis.__sylviniaGroupExplicitScene;",
);
globalThis.__sylviniaGroupExplicitScene = advancedCatalog.groupExplicitScene;
const moduleUrl = `data:text/javascript;base64,${Buffer.from(inlinedCode).toString("base64")}`;
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
const forbiddenMatches = `${source}\n${advancedSource}`.match(forbiddenMedicalTerms) || [];
if (forbiddenMatches.length) {
  throw new Error(`Vocabulaire anatomique à remplacer : ${[...new Set(forbiddenMatches.map((term) => term.toLocaleLowerCase("fr")))].join(", ")}`);
}

const explicitRoutes = Object.values(catalog.GROUP_INTIMACY_ROUTES_BY_SEX)
  .flatMap((bySex) => Object.values(bySex))
  .flat();
const physicalChapters = explicitRoutes.map((route) => route.chapters.explicite[4]);
if (physicalChapters.some((chapter) => !chapter || chapter.length < 4 || !chapter.some((line) => line.speaker !== "Narration"))) {
  throw new Error("Chaque route explicite à trois doit contenir sa propre position, des dialogues et une réaction.");
}
const physicalSignatures = physicalChapters.map((chapter) => chapter.map((line) => `${line.speaker}:${line.text}`).join("\n"));
if (new Set(physicalSignatures).size !== 54) throw new Error("Les 54 embranchements physiques à trois doivent tous être uniques.");
const physicalLines = physicalChapters.flat().map((line) => line.text.trim());
if (new Set(physicalLines).size !== physicalLines.length) throw new Error("Une ligne physique à trois est répétée entre deux embranchements.");

console.log(`[Intimité à trois] ${report.pairs} duos · ${report.combinations} combinaisons · ${report.routes} routes · ${report.chapters} séquences · ${report.games} mini-jeux · ${physicalSignatures.length} embranchements physiques uniques validés.`);
