import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { createServer } from "vite";

const scriptsDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptsDir, "..");
const read = (file) => readFile(path.join(root, file), "utf8");
const [page, shell, settingsSource, css, index] = await Promise.all([
  read("src/page.tsx"),
  read("src/ui/atlas/atlas-shell.tsx"),
  read("src/ui/atlas/atlas-ui.ts"),
  read("src/ui/atlas/atlas.css"),
  read("index.html"),
]);

const server = await createServer({ root, appType: "custom", server: { middlewareMode: true } });
try {
  const settings = await server.ssrLoadModule("/src/ui/atlas/atlas-ui.ts");
  const defaults = settings.normalizeAtlasUiSettings(undefined);
  assert.equal(defaults.uiStyle, "balanced", "Une ancienne sauvegarde doit recevoir le profil équilibré.");
  assert.equal(defaults.uiScale, 100);
  assert.equal(settings.normalizeAtlasUiSettings({ uiScale: 500, panelOpacity: -3 }).uiScale, 125, "L’échelle doit être bornée.");
  assert.equal(settings.normalizeAtlasUiSettings({ uiScale: 500, panelOpacity: -3 }).panelOpacity, 18, "L’opacité doit être bornée.");
  assert.equal(settings.normalizeAtlasUiSettings({ uiStyle: "debug" }).uiStyle, "balanced", "Un profil inconnu doit être normalisé.");
  assert.deepEqual(["cinematic", "balanced", "compact", "complete"].map(settings.nextUiStyle), ["balanced", "compact", "complete", "cinematic"], "Le sélecteur doit parcourir les quatre profils.");

  const matrix = [
    [360, 800, true, "phone-portrait"],
    [412, 915, true, "phone-portrait"],
    [430, 932, true, "phone-portrait"],
    [720, 900, true, "fold-portrait"],
    [915, 412, true, "phone-landscape"],
    [1024, 768, true, "fold-landscape"],
    [1280, 720, false, "desktop"],
    [1440, 900, false, "desktop"],
    [1920, 1080, false, "desktop"],
  ];
  for (const [width, height, touch, expected] of matrix) {
    assert.equal(settings.detectAtlasDevice({ width, height, coarse: touch, hoverNone: touch }), expected, `${width}×${height} doit produire ${expected}.`);
  }
} finally {
  await server.close();
}

for (const key of ["uiStyle", "uiScale", "panelOpacity", "backgroundDim", "accentTone", "secondaryDetails", "monumentalTitles", "highContrastText", "decorativeGrain", "statusBar", "adaptiveLayout", "touchNavigation"]) {
  assert.match(settingsSource, new RegExp(`\\b${key}\\b`), `Réglage manquant : ${key}`);
}
assert.match(page, /normalizeAtlasUiSettings\(value\.settings\)/, "La migration des anciennes sauvegardes doit normaliser Atlas.");
assert.match(page, /data-ui=\{game\.settings\.uiStyle\}/, "Le profil doit être exposé au shell.");
assert.match(page, /data-device=\{atlasDevice\}/, "Le type d’appareil doit être exposé au shell.");
assert.match(page, /<AtlasChrome/, "Le chrome partagé doit piloter la navigation.");
assert.match(page, /atlas-relation-stage/, "Relations doit utiliser la composition Atlas.");
assert.match(page, /atlas-options-workbench/, "Les options doivent utiliser l’atelier Atlas.");
assert.match(page, /atlas-subplace-strip/, "Le lieu doit exposer ses sous-lieux sans ouvrir un second écran.");
assert.match(page, /screenRef\.current\?\.scrollTo/, "Chaque étape du créateur doit revenir en haut.");
for (const label of ["Interface", "Lisibilité", "Appareil", "Audio & jeu", "Chronique"]) assert.match(page, new RegExp(label.replace("&", "&")), `Catégorie d’options manquante : ${label}`);
for (const label of ["Lieu", "Carte", "Jobs", "Relations", "Journal", "Biens", "Codex", "Options"]) assert.match(shell, new RegExp(`label: "${label}"`), `Destination manquante : ${label}`);
for (const fragment of ["safe-area-inset-top", "safe-area-inset-bottom", "fold-landscape", "data-ui=\"cinematic\"", "data-ui=\"complete\"", "prefers-reduced-motion", ".atlas-bottom-nav", ".atlas-side-nav", ".atlas-relation-dossier", "transform:none", "min-height:0!important"]) assert.ok(css.includes(fragment), `Règle CSS Atlas manquante : ${fragment}`);
assert.match(index, /src="\/src\/main\.tsx"/, "L’entrée statique Vite doit rester intacte.");

console.log("✓ Atlas V6 : migration, profils, matrice responsive, shell, vues et options validés.");
