import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { CHARACTERS } from "../src/game-data.ts";
import { KNOWN_MOOD_LABELS, SPRITE_MOODS, resolveSpriteMood, spritePath } from "../src/sprite-system.ts";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const sourceDirectory = path.resolve(scriptDirectory, "../src");
const spriteDirectory = path.resolve(scriptDirectory, "../../assets/sprites");

const sourceFiles = (await readdir(sourceDirectory)).filter((file) => /\.(?:ts|tsx)$/u.test(file));
const sourceMoodLabels = new Set(KNOWN_MOOD_LABELS);

for (const file of sourceFiles) {
  const source = await readFile(path.join(sourceDirectory, file), "utf8");
  for (const match of source.matchAll(/\bmood\s*:\s*"([a-z-]+)"/gu)) sourceMoodLabels.add(match[1]);
}

assert.deepEqual(
  Object.keys(SPRITE_MOODS).sort(),
  CHARACTERS.map((character) => character.id).sort(),
  "Le registre des sprites doit couvrir exactement tous les personnages jouables.",
);

let checkedResolutions = 0;

for (const character of CHARACTERS) {
  const directory = path.join(spriteDirectory, character.id);
  const actualMoods = (await readdir(directory))
    .filter((file) => file.endsWith(".webp"))
    .map((file) => file.replace(/\.webp$/u, ""))
    .sort();
  const registeredMoods = [...SPRITE_MOODS[character.id]].sort();

  assert.deepEqual(registeredMoods, actualMoods, `${character.name} : registre et fichiers de sprites désynchronisés.`);
  assert.ok(actualMoods.includes(character.defaultMood), `${character.name} : humeur par défaut absente (${character.defaultMood}).`);

  for (const requestedMood of [...sourceMoodLabels, "expression-inconnue"]) {
    const resolvedMood = resolveSpriteMood(character.id, requestedMood, character.defaultMood);
    assert.ok(actualMoods.includes(resolvedMood), `${character.name} : ${requestedMood} résout vers un fichier absent (${resolvedMood}).`);
    const relativePath = spritePath(character.id, requestedMood, character.defaultMood).replace(/^\/assets\/sprites\//u, "");
    assert.ok(existsSync(path.join(spriteDirectory, relativePath)), `${character.name} : chemin final absent pour ${requestedMood}.`);
    checkedResolutions += 1;
  }
}

assert.equal(resolveSpriteMood("lineva", "soft", "thoughtful"), "thoughtful");
assert.equal(resolveSpriteMood("lineva", "teasing", "thoughtful"), "smirk");
assert.equal(resolveSpriteMood("lineva", "calm", "thoughtful"), "thoughtful");
assert.equal(resolveSpriteMood("allenna", "soft", "neutral"), "shy");
assert.equal(resolveSpriteMood("allenna", "determined", "neutral"), "stern");

const pageSource = await readFile(path.join(sourceDirectory, "page.tsx"), "utf8");
assert.ok(!pageSource.includes("/assets/sprites/${"), "Les vues doivent utiliser spritePath au lieu de construire une URL non validée.");
assert.ok(pageSource.includes("speakerCharacterIds(currentLine.speaker, [character.id])"), "Les scènes intimes solo doivent reconnaître les noms courts comme Tia.");
assert.ok(pageSource.includes("speakerCharacterIds(currentLine.speaker, [first.id, second.id])"), "Les scènes à trois doivent reconnaître chaque intervenant du libellé.");

console.log(`[Sprites] ${CHARACTERS.length} personnages · ${checkedResolutions} résolutions · registre, équivalences et chemins réels validés.`);
