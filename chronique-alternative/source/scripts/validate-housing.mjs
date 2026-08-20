import { access, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const sourceRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const alternativeRoot = resolve(sourceRoot, "..");
const housingData = await readFile(resolve(sourceRoot, "src/housing-data.ts"), "utf8");
const housingScenes = await readFile(resolve(sourceRoot, "src/housing-scenes.ts"), "utf8");
const page = await readFile(resolve(sourceRoot, "src/page.tsx"), "utf8");
const cities = ["algratal", "forthaven", "miraldas", "akuhn"];
const characters = ["hylee", "remerii", "iriana", "tia", "valurn", "naiah", "lineva", "saidin", "bellirith", "amanea", "allenna", "draven"];

for (const city of cities) {
  for (let tier = 1; tier <= 5; tier += 1) {
    if (!housingData.includes(`property("${city}", ${tier},`)) throw new Error(`Logement manquant : ${city}/${tier}`);
    await access(resolve(alternativeRoot, `assets/housing/${city}_${tier}.webp`));
  }
}

for (const character of characters) {
  for (const id of [`keepsake-${character}`, `homegift-${character}`]) {
    if (!housingData.includes(`id: "${id}"`)) throw new Error(`Objet exposable manquant : ${id}`);
  }
  const momentCount = [...housingScenes.matchAll(new RegExp(`moment\\("${character}",`, "g"))].length;
  if (momentCount !== 4) throw new Error(`${character}: quatre moments de résident requis, ${momentCount} obtenu(s)`);
}

for (const feature of ["discountedPropertyPrice", "housingSaleValue", "setDisplayedItem", "toggleResident", "HOME_PAIR_DATES", "Biens"]) {
  if (!page.includes(feature) && !housingScenes.includes(feature)) throw new Error(`Intégration manquante : ${feature}`);
}

console.log("[Logis] 4 villes · 20 logements · 20 décors · 24 objets personnels · 48 moments de résident validés.");
