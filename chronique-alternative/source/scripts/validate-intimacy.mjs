import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { transformWithOxc } from "vite";

const sourceRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = resolve(sourceRoot, "src/intimacy-routes.ts");
const advancedPath = resolve(sourceRoot, "src/individual-explicit-scenes.ts");
const prosePath = resolve(sourceRoot, "src/intimacy-prose.ts");
const source = await readFile(sourcePath, "utf8");
const advancedSource = await readFile(advancedPath, "utf8");
const proseSource = await readFile(prosePath, "utf8");
const proseTransformed = await transformWithOxc(proseSource, prosePath, { transformMode: "web" });
const proseModuleUrl = `data:text/javascript;base64,${Buffer.from(proseTransformed.code).toString("base64")}`;
const proseCatalog = await import(proseModuleUrl);
const advancedTransformed = await transformWithOxc(advancedSource, advancedPath, { transformMode: "web" });
const advancedModuleUrl = `data:text/javascript;base64,${Buffer.from(advancedTransformed.code).toString("base64")}`;
const advancedCatalog = await import(advancedModuleUrl);
const transformed = await transformWithOxc(source, sourcePath, { transformMode: "web" });
const inlinedCode = transformed.code.replace(
  /import\s*\{\s*individualExplicitScene\s*\}\s*from\s*["']\.\/individual-explicit-scenes["'];?/u,
  "const individualExplicitScene = globalThis.__sylviniaIndividualExplicitScene;",
).replace(
  /import\s*\{\s*polishIntimacyText\s*\}\s*from\s*["']\.\/intimacy-prose["'];?/u,
  "const polishIntimacyText = globalThis.__sylviniaPolishIntimacyText;",
);
globalThis.__sylviniaIndividualExplicitScene = advancedCatalog.individualExplicitScene;
globalThis.__sylviniaPolishIntimacyText = proseCatalog.polishIntimacyText;
const moduleUrl = `data:text/javascript;base64,${Buffer.from(inlinedCode).toString("base64")}`;
let catalog;
try {
  catalog = await import(moduleUrl);
} catch (error) {
  console.error(`[Intimité] ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}
const report = catalog.validateIntimacyRouteCatalog();

const expected = { characters: 11, combinations: 33, routes: 99, chapters: 3168 };
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
const intrusiveLines = explicitRoutes.flatMap((route) => Object.values(route.chapters)
  .flat(2)
  .filter((line) => proseCatalog.hasIntrusiveIntimacyLanguage(line.text))
  .map((line) => `${route.id} — ${line.text}`));
if (intrusiveLines.length) {
  throw new Error(`Formulations de consentement intrusives encore affichées :\n${intrusiveLines.slice(0, 12).join("\n")}`);
}
const renderedIntimacyText = explicitRoutes.flatMap((route) => Object.values(route.chapters).flat(2).map((line) => line.text)).join("\n");
const vocabularyFamilies = {
  intimite: ["chaleur intime", "pli de velours", "secret humide", "écrin brûlant", "rose entrouverte"],
  plaisir: ["perle sensible", "petite amande", "pointe de feu", "source du plaisir", "étincelle charnelle", "bouton de rose", "bourgeon charnel", "sommet sensible", "nœud de plaisir", "point incandescent"],
  masculin: ["membre dressé", "sexe tendu", "membre brûlant", "phallus tendu", "désir durci", "hampe tendue", "longueur brûlante", "tige dressée", "virilité tendue", "chaleur dressée"],
};
for (const [family, terms] of Object.entries(vocabularyFamilies)) {
  const variants = terms.filter((term) => renderedIntimacyText.includes(term));
  if (variants.length < 5) throw new Error(`Vocabulaire ${family} insuffisamment varié : ${variants.join(", ")}`);
}
const physicalChapters = explicitRoutes.map((route) => route.chapters.explicite[5]);
if (physicalChapters.some((chapter) => !chapter || chapter.length < 3 || !chapter.some((line) => line.speaker !== "Narration"))) {
  throw new Error("Chaque route explicite doit contenir sa propre position, au moins un dialogue et une réaction.");
}
const physicalSignatures = physicalChapters.map((chapter) => chapter.map((line) => `${line.speaker}:${line.text}`).join("\n"));
if (new Set(physicalSignatures).size !== 99) throw new Error("Les 99 embranchements physiques individuels doivent tous être uniques.");
const physicalLines = physicalChapters.flat().map((line) => line.text.trim());
if (new Set(physicalLines).size !== physicalLines.length) throw new Error("Une ligne physique individuelle est répétée entre deux embranchements.");

console.log(`[Intimité] ${report.characters} personnages · ${report.combinations} combinaisons · ${report.routes} routes · ${report.chapters} séquences · ${physicalSignatures.length} embranchements physiques uniques validés.`);
