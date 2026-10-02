import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { createServer } from "vite";

const scriptsDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptsDir, "..");
const read = (file) => readFile(path.join(root, file), "utf8");
const [page, main, css, cssIntegration, title, fxSource, index] = await Promise.all([
  read("src/page.tsx"),
  read("src/main.tsx"),
  read("src/ui/v2/v2.css"),
  read("src/ui/v2/v2-integration.css"),
  read("src/ui/v2/title.tsx"),
  read("src/ui/v2/fx.ts"),
  read("index.html"),
]);

const server = await createServer({ root, appType: "custom", server: { middlewareMode: true } });
try {
  // Les réglages hérités (sauvegardes de la version Atlas) doivent toujours être normalisés.
  const settings = await server.ssrLoadModule("/src/ui/atlas/atlas-ui.ts");
  const defaults = settings.normalizeAtlasUiSettings(undefined);
  assert.equal(defaults.uiStyle, "balanced", "Une ancienne sauvegarde doit recevoir le profil équilibré.");
  assert.equal(settings.normalizeAtlasUiSettings({ uiScale: 500 }).uiScale, 125, "L’échelle héritée doit être bornée.");
  const fx = await server.ssrLoadModule("/src/ui/v2/fx.ts");
  assert.equal(fx.SCALE_KEYS.length, 7, "Les 7 curseurs d’échelle doivent exister.");
  for (const key of fx.SCALE_KEYS) {
    const e = fx.ECHELLES[key];
    assert.equal(fx.borne(key, 9999), e.max, `${key} doit être borné en haut.`);
    assert.equal(fx.borne(key, 1), e.min, `${key} doit être borné en bas.`);
    assert.equal(fx.DEFAULT_SCALES[key], 100);
  }
} finally {
  await server.close();
}

assert.match(page, /normalizeAtlasUiSettings\(value\.settings\)/, "La migration des anciennes sauvegardes doit rester active.");
for (const comp of ["V2Title", "V2Creation", "V2Hud", "V2Lieu", "V2Carte", "V2Liens", "V2Fiche", "V2Rdv", "V2Trio", "V2Journal", "V2Jobs", "V2Biens", "V2Codex", "V2OptionsBody", "V2SaveSlots", "V2Toasts", "V2TimeJump", "V2RankUp"]) {
  assert.match(page, new RegExp(`<${comp}[\\s>]`), `Composant V2 non rendu : ${comp}`);
}
// Chaque action V2 doit appeler la vraie logique du jeu.
for (const action of ["continueGame", "loadSlot", "saveSlot", "advancePeriod", "travel", "startDate", "startGroupDate", "waitForCharacter", "buyProperty", "sellProperty", "toggleResident", "setDisplayedItem", "startCampaignScene", "exportSave", "importSave", "presenceInteraction"]) {
  assert.match(page, new RegExp(`\\b${action}\\b`), `Action réelle manquante : ${action}`);
}
assert.match(page, /chroniques-alternatives\.mp4/, "La cinématique réelle doit être conservée.");
assert.match(title, /<video/, "L’écran-titre doit lire la cinématique.");
assert.match(page, /\.\.\/index\.html/, "Le retour au Mode Histoire doit rester disponible.");
const developerPanel = page.slice(page.indexOf("function DeveloperPanel"), page.indexOf("type IntimacyStep"));
assert.match(developerPanel, /Accès direct aux scènes intimes/, "Le panneau développeur doit proposer l’accès direct aux continuations intimes.");
assert.match(developerPanel, /Ouvrir la partie intime/, "Le saut de la première partie du rendez-vous doit être explicite.");
assert.match(page, /function openDevIntimacy[\s\S]*replay:\s*true/, "Les prévisualisations intimes développeur doivent rester sans mutation de sauvegarde.");
assert.match(developerPanel, /ACT_ONE_SCENE_ORDER/, "L’outil de campagne doit utiliser la chronologie actuelle.");
assert.match(developerPanel, /main-story-act-1-complete/, "L’outil de campagne doit poser le flag canonique actuel.");
assert.doesNotMatch(developerPanel, /["']main-story-complete["']/, "Le panneau développeur ne doit plus restaurer l’ancien état de campagne.");
for (const forbidden of ["Démo rang", "Temps de jeu", "données fictives", "Vitesse du texte"]) {
  assert.ok(!page.includes(forbidden), `Contenu de prototype non adossé au jeu : ${forbidden}`);
}
assert.ok(!page.includes('className="fiche-defil"'), "La fiche doit rester centrée sur le personnage choisi (pas de bandeau de portraits).");
assert.match(page, /className="fiche-pas"/, "La fiche doit garder un sélecteur discret précédent/suivant.");
assert.match(fxSource, /sylvinia-ca-v2-echelles/, "Les échelles doivent être persistées.");
assert.match(main, /ui\/v2\/v2\.css/, "La feuille V2 doit être importée.");
assert.match(main, /ui\/v2\/v2-integration\.css/, "La feuille de raccord V2 doit être importée.");
assert.ok(main.indexOf("v2.css") > main.indexOf("globals.css"), "V2 doit passer après les styles globaux.");
for (const fragment of ["prefers-reduced-motion", "safe-area-inset", "@media", ".hud", ".hud-onglets", ".nav-mobile"]) {
  assert.ok(css.includes(fragment), `Règle CSS V2 manquante : ${fragment}`);
}
assert.ok(cssIntegration.includes(".v2-calque"), "Le calque des dialogues V2 doit être stylé.");
assert.match(index, /src="\/src\/main\.tsx"/, "L’entrée statique Vite doit rester intacte.");

console.log("✓ Interface V2.4 : composants, actions réelles, échelles, migration et styles validés.");
