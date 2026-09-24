import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const sourceRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const projectRoot = resolve(sourceRoot, "..");
const [pageSource, cssSource, musicSource] = await Promise.all([
  readFile(resolve(sourceRoot, "src/page.tsx"), "utf8"),
  readFile(resolve(sourceRoot, "src/globals.css"), "utf8"),
  readFile(resolve(sourceRoot, "src/music-data.ts"), "utf8"),
]);

function jpegDimensions(buffer) {
  assert.equal(buffer[0], 0xff, "signature JPEG absente");
  assert.equal(buffer[1], 0xd8, "signature JPEG absente");
  let offset = 2;
  while (offset + 9 < buffer.length) {
    if (buffer[offset] !== 0xff) { offset += 1; continue; }
    const marker = buffer[offset + 1];
    if ([0xd8, 0xd9].includes(marker)) { offset += 2; continue; }
    const length = buffer.readUInt16BE(offset + 2);
    if (length < 2) break;
    if ((marker >= 0xc0 && marker <= 0xc3) || (marker >= 0xc5 && marker <= 0xc7) || (marker >= 0xc9 && marker <= 0xcb) || (marker >= 0xcd && marker <= 0xcf)) {
      return { height: buffer.readUInt16BE(offset + 5), width: buffer.readUInt16BE(offset + 7) };
    }
    offset += 2 + length;
  }
  throw new Error("dimensions JPEG introuvables");
}

const server = await createServer({ root: sourceRoot, appType: "custom", logLevel: "silent", server: { middlewareMode: true } });

try {
  const cg = await server.ssrLoadModule("/src/intimate-cg.ts");
  assert.equal(Object.keys(cg.SOLO_INTIMATE_CG).length, 12, "douze couples de CG solo requis");
  assert.equal(Object.keys(cg.DUO_INTIMATE_CG).length, 13, "treize contextes de CG duo requis");

  const assets = [
    ...Object.values(cg.SOLO_INTIMATE_CG),
    ...Object.values(cg.DUO_INTIMATE_CG),
  ].flatMap((entry) => [entry.reveal, entry.postOrgasm]);
  assert.equal(assets.length, 50, "cinquante références de CG requises");
  assert.equal(new Set(assets).size, 40, "les nouveaux rendez-vous doivent réutiliser uniquement les deux récompenses duo autorisées");
  for (const asset of new Set(assets)) {
    const relativeAsset = asset.replace(/^\/?assets\//, "assets/");
    const buffer = await readFile(resolve(projectRoot, relativeAsset));
    assert.ok(buffer.length > 50_000, `${asset}: image trop petite ou vide`);
    const { width, height } = jpegDimensions(buffer);
    assert.equal(width, 1536, `${asset}: largeur inattendue`);
    assert.equal(height, 864, `${asset}: hauteur inattendue`);
    assert.equal(width / height, 16 / 9, `${asset}: ratio 16:9 requis`);
  }

  const solo = (mode, step, chapter, narrativePhase) => cg.soloIntimateVisualState({ character: "hylee", mode, surface: "route", step, chapter, narrativePhase });
  for (const mode of ["tendre", "suggestif", "ellipse"]) {
    assert.equal(solo(mode, "direction-lines", 4, "naked-reveal").cg, undefined, `${mode}: aucune CG ne doit être chargée hors mode explicite`);
    assert.equal(solo(mode, "ending", 7).cg, undefined, `${mode}: aucune CG finale ne doit être chargée hors mode explicite`);
  }

  assert.equal(solo("explicite", "direction-lines", 5, "undressing").useIntimateSprites, false, "route solo : sprite nu trop précoce");
  assert.equal(solo("explicite", "direction-lines", 6, "naked-reveal").cg?.phase, "reveal", "route solo : reveal pendant le déshabillage");
  assert.equal(solo("explicite", "direction-lines", 6, "naked-reveal").useIntimateSprites, false, "route solo : sprite superposé à la CG");
  assert.equal(solo("explicite", "direction-lines", 7, "partner-discovery").useIntimateSprites, true, "route solo : sprites après la CG");
  assert.equal(solo("explicite", "direction-lines", 8, "afterglow").cg?.phase, "post-orgasm", "route solo : post-orgasm après climax");
  assert.equal(solo("explicite", "ending", 9).cg?.phase, "post-orgasm", "route solo : post-orgasm pendant le dénouement");

  const group = (mode, step, chapter) => cg.groupIntimateVisualState({ pairId: "group-date-hylee-remerii", mode, step, chapter });
  assert.equal(group("suggestif", "direction-lines", 3).cg, undefined, "duo : aucune CG hors mode explicite");
  assert.equal(group("explicite", "direction-lines", 3).cg?.phase, "reveal", "duo : reveal après trois montées");
  assert.equal(group("explicite", "direction-lines", 4).useIntimateSprites, true, "duo : retour aux sprites après la CG");
  assert.equal(group("explicite", "direction-lines", 5).cg?.phase, "post-orgasm", "duo : post-orgasm après le climax");
  assert.equal(group("explicite", "ending", 7).cg?.phase, "post-orgasm", "duo : post-orgasm pendant le dénouement");
  assert.equal(group("explicite", "done", 7).cg?.phase, "post-orgasm", "duo : post-orgasm jusqu’au bouton final");

  const manualGroup = (chapter) => cg.groupIntimateVisualState({
    pairId: "group-date-allenna-lineva-home",
    mode: "explicite",
    step: "direction-lines",
    chapter,
    revealChapter: 4,
    postOrgasmChapter: 11,
  });
  assert.equal(manualGroup(3).useIntimateSprites, false, "trio manuel : reveal trop précoce");
  assert.equal(manualGroup(4).cg?.phase, "reveal", "trio manuel : reveal au chapitre propre à la route");
  assert.equal(manualGroup(5).useIntimateSprites, true, "trio manuel : sprites absents après la CG");
  assert.equal(manualGroup(10).useIntimateSprites, true, "trio manuel : sprites perdus avant l’après-scène");
  assert.equal(manualGroup(11).cg?.phase, "post-orgasm", "trio manuel : post-orgasm seulement après le seuil déclaré");

  assert.match(pageSource, /intimateCg \? <IntimateCg cg=\{intimateCg\} \/> : <div className=\{`intimacy-sprite/, "solo : la CG doit remplacer le sprite");
  assert.match(pageSource, /intimateCg \? <IntimateCg cg=\{intimateCg\} \/> : <div className=\{`group-intimacy-sprites/, "duo : la CG doit remplacer tous les sprites");
  assert.match(pageSource, /data-intimacy-cg=\{cg\.phase\}/, "la phase CG doit rester inspectable en test visuel");
  assert.match(cssSource, /\.intimacy-cg img[^}]*object-fit:\s*contain/s, "les CG doivent préserver leur composition sans crop agressif");
  assert.match(cssSource, /@media \(max-width: 720px\)[\s\S]*\.intimacy-cg img/, "un rendu mobile explicite doit être défini");
  assert.doesNotMatch(musicSource, /intimateCg|intimacy-cg/, "les CG ne doivent jamais piloter ou redémarrer la musique");
  assert.match(pageSource, /musicForContext\(game\.spot, \{ locationId: game\.location, intimacy: modal\?\.kind === "intimacy" \|\| modal\?\.kind === "group-intimacy"/, "la musique intime doit rester liée au modal, pas à la phase CG");

  console.log("[CG intimes] 40 images 16:9 · 13 contextes duo · CG de déshabillage puis sprites nus · post-orgasm persistant · desktop/mobile validés.");
} finally {
  await server.close();
}
