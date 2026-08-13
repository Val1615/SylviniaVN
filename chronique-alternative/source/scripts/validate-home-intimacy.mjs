import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { transformWithOxc } from "vite";

const sourceRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = resolve(sourceRoot, "src/home-intimacy-routes.ts");
const source = await readFile(sourcePath, "utf8");
const transformed = await transformWithOxc(source, sourcePath, { transformMode: "web" });
const moduleUrl = `data:text/javascript;base64,${Buffer.from(transformed.code).toString("base64")}`;
const catalog = await import(moduleUrl);
const report = catalog.validateHomeIntimacyCatalog();

const expected = { characters: 9, combinations: 27, routes: 81, chapters: 2592 };
for (const [key, value] of Object.entries(expected)) {
  if (report[key] !== value) throw new Error(`${key}: ${value} attendu, ${report[key]} obtenu`);
}

console.log(`[Logis intime] ${report.characters} personnages · ${report.combinations} combinaisons · ${report.routes} routes domestiques · ${report.chapters} séquences validées.`);
