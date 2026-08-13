import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { transformWithOxc } from "vite";

const sourceRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = resolve(sourceRoot, "src/intimacy-routes.ts");
const source = await readFile(sourcePath, "utf8");
const transformed = await transformWithOxc(source, sourcePath, { transformMode: "web" });
const moduleUrl = `data:text/javascript;base64,${Buffer.from(transformed.code).toString("base64")}`;
const catalog = await import(moduleUrl);
const report = catalog.validateIntimacyRouteCatalog();

const expected = { characters: 9, combinations: 27, routes: 81, chapters: 1296 };
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

console.log(`[Intimité] ${report.characters} personnages · ${report.combinations} combinaisons · ${report.routes} routes · ${report.chapters} séquences validées.`);
