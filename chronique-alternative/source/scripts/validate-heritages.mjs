import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const sourceRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const alternativeRoot = resolve(sourceRoot, "..");
const [heritagesSource, gameData, worldData, dateScenes, housingScenes, page, integration] = await Promise.all([
  readFile(resolve(sourceRoot, "src/heritages-data.ts"), "utf8"),
  readFile(resolve(sourceRoot, "src/game-data.ts"), "utf8"),
  readFile(resolve(sourceRoot, "src/world-data.ts"), "utf8"),
  readFile(resolve(sourceRoot, "src/date-scenes.ts"), "utf8"),
  readFile(resolve(sourceRoot, "src/housing-scenes.ts"), "utf8"),
  readFile(resolve(sourceRoot, "src/page.tsx"), "utf8"),
  readFile(resolve(sourceRoot, "src/integration.css"), "utf8"),
]);

const server = await createServer({
  root: sourceRoot,
  appType: "custom",
  logLevel: "silent",
  server: { middlewareMode: true },
});
let catalog;
try {
  catalog = await server.ssrLoadModule("/src/heritages-data.ts");
} finally {
  await server.close();
}
const report = catalog.validateHeritagesCatalog();
const expectedCast = new Set(["hylee", "remerii", "iriana", "valurn", "naiah", "lineva", "saidin", "bellirith", "amanea", "draven", "allenna", "tia"]);
const locationSection = gameData.slice(gameData.indexOf("export const LOCATIONS"), gameData.indexOf("export const CHARACTERS"));
const knownLocations = new Set([...locationSection.matchAll(/\bid:\s*"([^"]+)"/g)].map((match) => match[1]));
const spotSection = worldData.slice(worldData.indexOf("export const SUBLOCATIONS"), worldData.indexOf("export const DEFAULT_SPOTS"));
const knownSpots = new Map([...spotSection.matchAll(/\{\s*id:\s*"([^"]+)",\s*location:\s*"([^"]+)"/g)].map((match) => [match[1], match[2]]));

for (const [label, entries] of Object.entries({
  confidences: catalog.SECRET_CONVERSATIONS,
  lettres: catalog.LETTERS,
  invitations: catalog.INVITATIONS,
  rumeurs: catalog.RUMORS,
  événements: catalog.SPONTANEOUS_EVENTS,
})) {
  for (const entry of entries) {
    for (const character of [entry.character, ...(entry.characters || [])].filter(Boolean)) {
      if (!expectedCast.has(character)) throw new Error(`${label}/${entry.id}: personnage inconnu ${character}`);
    }
    for (const location of [entry.location, ...(entry.locations || [])].filter(Boolean)) {
      if (!knownLocations.has(location)) throw new Error(`${label}/${entry.id}: lieu inconnu ${location}`);
    }
    for (const spot of [entry.spot, ...(entry.spots || [])].filter(Boolean)) {
      const spotLocation = knownSpots.get(spot);
      if (!spotLocation) throw new Error(`${label}/${entry.id}: sous-lieu inconnu ${spot}`);
      if (entry.location && spotLocation !== entry.location) throw new Error(`${label}/${entry.id}: ${spot} n’appartient pas à ${entry.location}`);
    }
  }
}

async function validateWebp(path, label) {
  const contents = await readFile(path);
  if (contents.length < 5_000 || contents.toString("ascii", 0, 4) !== "RIFF" || contents.toString("ascii", 8, 12) !== "WEBP") {
    throw new Error(`${label}: sprite WebP vide ou illisible`);
  }
}

async function validatePortrait(path, label) {
  const contents = await readFile(path);
  const jpeg = contents[0] === 0xff && contents[1] === 0xd8 && contents.at(-2) === 0xff && contents.at(-1) === 0xd9;
  const png = contents.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  if (contents.length < 5_000 || (!jpeg && !png)) {
    throw new Error(`${label}: portrait PNG/JPEG vide ou illisible`);
  }
}

const expected = { characters: 12, secrets: 49, knowledge: 66, letters: 25, invitations: 12, rumors: 24, spontaneousEvents: 18 };
for (const [key, value] of Object.entries(expected)) {
  if (report[key] !== value) throw new Error(`${key}: ${value} attendu, ${report[key]} obtenu`);
}

for (const [character, unlockDay] of [["tia", 18], ["allenna", 8]]) {
  const characterPattern = new RegExp(`id: "${character}"[^\\n]+unlockDay: ${unlockDay}`);
  if (!characterPattern.test(gameData)) throw new Error(`${character}: fiche complète ou jour d’introduction manquant`);
  const routeCount = [...gameData.matchAll(new RegExp(`routeScene\\("${character}", [0-4],`, "g"))].length;
  if (routeCount !== 5) throw new Error(`${character}: cinq scènes relationnelles requises, ${routeCount} obtenue(s)`);
  const dateCount = [...dateScenes.matchAll(new RegExp(`character: "${character}"`, "g"))].length;
  if (dateCount !== 2) throw new Error(`${character}: deux rendez-vous publics requis, ${dateCount} obtenu(s)`);
  const residentCount = [...housingScenes.matchAll(new RegExp(`moment\\("${character}"`, "g"))].length;
  if (residentCount !== 4) throw new Error(`${character}: quatre moments de résident requis, ${residentCount} obtenu(s)`);
  for (const mood of ["neutral", "smile", "angry", "shy", "troubled", "thinking", "sad", "smirk", "threatening", "stern"]) {
    await validateWebp(resolve(alternativeRoot, `assets/sprites/${character}/${mood}.webp`), `${character}/${mood}`);
  }
  await validatePortrait(resolve(alternativeRoot, `assets/portraits/${character}.jpg`), character);
}

for (const field of ["knowledge", "secretHistory", "letters", "invitations", "rumors", "worldEventHistory", "livingWorldTick"]) {
  if (!page.includes(`${field}:`)) throw new Error(`Sauvegarde : valeur par défaut manquante pour ${field}`);
}
for (const feature of ["replaySecret", "replayWorldEvent", "evolveLivingWorld", "characterUnlocked", "ExplicitModeWarning"]) {
  if (!page.includes(feature)) throw new Error(`Intégration manquante : ${feature}`);
}
for (const style of ["living-world-panel", "living-journal-grid", "correspondence-modal", "invitation-modal"]) {
  if (!integration.includes(`.${style}`)) throw new Error(`Interface non stylée : ${style}`);
}

const forbiddenRevelations = [
  /Saidin est (?:réellement )?un dragon/iu,
  /Saidin est (?:le )?père (?:biologique )?de Hylee/iu,
  /Hylee est (?:réellement )?(?:une )?dragon/iu,
];
for (const pattern of forbiddenRevelations) {
  if (pattern.test(`${heritagesSource}\n${gameData}\n${dateScenes}\n${housingScenes}`)) {
    throw new Error(`Révélation interdite rendue explicite : ${pattern}`);
  }
}

console.log(`[Héritages & Fractures] ${report.characters} personnages · ${report.secrets} confidences · ${report.knowledge} connaissances · ${report.letters} lettres · ${report.invitations} invitations · ${report.rumors} rumeurs · ${report.spontaneousEvents} événements · sprites Tia/Allenna validés.`);
