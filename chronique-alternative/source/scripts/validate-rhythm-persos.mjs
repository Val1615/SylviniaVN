// Validateur des fiches personnages du jeu de rythme (lot 0 : socle commun ; lot 1 : Bellirith).
// Vérifie que chaque scène de Bellirith se joue sur son texte écrit sans le réécrire, que la partition de
// Hylee reste identique, que les pièges ne comptent jamais dans le score, la sauvegarde v4, la voix et ses crédits.
import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { createHash } from "node:crypto";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const sourceRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const projectRoot = resolve(sourceRoot, "..");
const read = (path) => readFile(resolve(sourceRoot, path), "utf8");
const pageSource = await read("src/page.tsx");
const sources = await readFile(resolve(projectRoot, "assets/audio/rythme/SOURCES.md"), "utf8");
const server = await createServer({ root: sourceRoot, appType: "custom", logLevel: "silent", server: { middlewareMode: true } });
const DIFFICULTIES = ["doux", "normal", "intense"];
const HISTORIES = [[], ["bellirith-has-slept", "bellirith-favorite", "bellirith-trend:ceded"], ["bellirith-has-resisted", "bellirith-trend:resisted"]];
// Empreinte de la partition de Hylee calculée sur origin/main avant le lot 0 : elle ne doit pas bouger.
const HYLEE_CHART_HASH = "c64be9ee8ae6ef7a";

try {
  const engine = await server.ssrLoadModule("/src/rhythm-intimacy-engine.ts");
  const anchors = await server.ssrLoadModule("/src/rhythm-anchors.ts");
  const profiles = await server.ssrLoadModule("/src/rhythm-profiles.ts");
  const bubbles = await server.ssrLoadModule("/src/rhythm-bubbles-bellirith.ts");
  const labels = await server.ssrLoadModule("/src/rhythm-bubbles.ts");
  const sfx = await server.ssrLoadModule("/src/rhythm-intimacy-sfx.ts");
  const bellirith = await server.ssrLoadModule("/src/bellirith-diversion-intimacy.ts");

  // Hylee : partition, débuts de phase et fin identiques à origin/main.
  const hash = createHash("sha256").update(JSON.stringify(DIFFICULTIES.map((d) => [engine.buildRhythmChart(d), engine.rhythmChartEnd(d), engine.RHYTHM_SECTIONS.map((_, i) => engine.rhythmSectionStart(i, d))]))).digest("hex").slice(0, 16);
  assert.equal(hash, HYLEE_CHART_HASH, "partition de Hylee modifiée");
  assert.ok(engine.buildRhythmChart("normal").every((note) => !engine.isRhythmTrap(note)), "aucun piège chez Hylee");

  // Profils : échelle de relation validée (t233u), Bellirith en Intense, violet vif.
  assert.deepEqual(profiles.RHYTHM_RELATION_PENALTIES, { hylee: 0, allenna: 0, naiah: 0, remerii: -1, lineva: -1, valurn: -1, bellirith: -2 }, "échelle de relation");
  const profile = profiles.rhythmProfileFor("bellirith");
  assert.equal(profile.difficulty, "intense");
  assert.equal(profile.relationPenalty, -2);
  assert.equal(profile.palette.vive, "155,93,229");
  assert.equal(profiles.RHYTHM_VOICES.bellirith, "aarrnnoo");
  assert.equal(profiles.RHYTHM_VOICES.hylee, "MagicalMysticVA");

  // Les 14 scènes × 2 corps, pour chaque historique et chaque mode.
  assert.equal(anchors.RHYTHM_ANCHORS.length, 28, "28 variantes de Bellirith");
  let kits = 0;
  const seen = new Set();
  for (const anchor of anchors.RHYTHM_ANCHORS) {
    let found = false;
    for (const flags of HISTORIES) {
      const route = bellirith.bellirithIntimacyRoutes(anchor.context, anchor.sex, flags).find((entry) => entry.id === anchor.routeId);
      if (!route) continue;
      found = true;
      const chapterNums = anchor.phases.map((phase) => phase.chapter);
      chapterNums.forEach((chapter, i) => { if (i) assert.equal(chapter, chapterNums[i - 1] + 1, `${anchor.routeId} : séquences jouées contiguës`); });
      assert.equal(anchor.returnChapter, chapterNums.at(-1) + 1, `${anchor.routeId} : reprise juste après le sommet`);
      if (route.visual) {
        assert.ok(chapterNums[0] > route.visual.revealChapter, `${anchor.routeId} : le jeu commence après la révélation`);
        if (route.visual.postOrgasmChapter !== undefined) assert.ok(chapterNums.at(-1) < route.visual.postOrgasmChapter, `${anchor.routeId} : le sommet précède l'après`);
      }
      for (const mode of ["explicite", "suggestif"]) {
        const chapters = route.chapters[mode];
        assert.ok(anchor.returnChapter <= chapters.length, `${anchor.routeId} ${mode} : reprise valide`);
        const kit = anchors.buildRhythmKit(anchor, chapters, route.text, mode);
        assert.ok(kit, `${anchor.routeId} ${anchor.sex} ${mode} : le jeu se construit`);
        kits++;
        seen.add(kit.scene.id);
        assert.equal(kit.scene.suggestive === true, mode === "suggestif");
        // Texte : chaque réplique écrite est affichée telle quelle, dans l'ordre, sans perte ni ajout.
        kit.scene.sections.forEach((section, i) => {
          const written = chapters[anchor.phases[i].chapter];
          const shown = [section.intro, ...section.tierLines.flat()];
          assert.equal(shown.length, written.length, `${kit.scene.id} ${section.label} : nombre de répliques`);
          shown.forEach((line, j) => assert.equal(line, written[j], `${kit.scene.id} : réplique recopiée ou réécrite`));
        });
        for (const difficulty of DIFFICULTIES) {
          const chart = engine.buildRhythmChart(difficulty, kit.sections);
          chart.forEach((note, index) => {
            assert.equal(note.index, index);
            if (index) assert.ok(note.time >= chart[index - 1].time, `${kit.scene.id} ${difficulty} : notes ordonnées`);
          });
          const traps = chart.filter(engine.isRhythmTrap);
          assert.ok(traps.length > 0, `${kit.scene.id} : Bellirith tend des pièges`);
          assert.ok(chart.filter((note) => note.kind === "final").length === 1, `${kit.scene.id} : un seul sommet`);
          // Les pièges ne comptent jamais : tout réussir sauf céder à tous les pièges donne le même score.
          const perfect = chart.map((note) => (engine.isRhythmTrap(note) ? 1 : 1));
          const ceded = chart.map((note) => (engine.isRhythmTrap(note) ? 3 : 1));
          assert.deepEqual(engine.rhythmScore(perfect, chart), engine.rhythmScore(ceded, chart), `${kit.scene.id} : pièges hors score`);
          assert.equal(engine.rhythmScore(perfect, chart).total, chart.length - traps.length, `${kit.scene.id} : seuls les vrais coups comptent`);
          const resisted = engine.rhythmResistance(chart, perfect);
          assert.equal(resisted.ceded, 0);
          assert.ok(engine.rhythmResistance(chart, ceded).ceded === traps.length, "piège cédé compté");
          const duration = engine.rhythmChartEnd(difficulty, kit.sections);
          assert.ok(duration > 60 && duration < 420, `${kit.scene.id} ${difficulty} : durée ${Math.round(duration)} s`);
        }
        if (anchor.appel) assert.ok(kit.sections.some((def) => def.appel), `${kit.scene.id} : coup pour coup au duel`);
      }
    }
    assert.ok(found, `${anchor.routeId} (${anchor.sex}) : route introuvable`);
  }
  assert.equal(seen.size, 56, "un identifiant de jeu par scène, corps et mode");

  // Sauvegarde v4 : aller-retour, signature de partition ; v3 (Hylee) toujours lue.
  const store = new Map();
  const storage = { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => store.set(k, String(v)), removeItem: (k) => store.delete(k) };
  const sample = anchors.buildRhythmKit(anchors.RHYTHM_ANCHORS[0], bellirith.bellirithIntimacyRoutes(anchors.RHYTHM_ANCHORS[0].context, "homme", []).find((r) => r.id === anchors.RHYTHM_ANCHORS[0].routeId).chapters.explicite, "test", "explicite");
  const sampleChart = engine.buildRhythmChart("intense", sample.sections);
  const v4 = { v: 4, sig: engine.rhythmChartSignature(sampleChart), scene: sample.scene.id, difficulty: "intense", auto: false, offsetMs: 0, judgements: sampleChart.map((_, i) => (i < 20 ? 1 : 0)) };
  engine.storeRhythmSave(v4, sample.scene.id, storage);
  assert.deepEqual(engine.loadRhythmSave(sample.scene.id, storage, sample.sections)?.judgements, v4.judgements, "reprise v4");
  engine.storeRhythmSave({ ...v4, sig: "0:0:0" }, sample.scene.id, storage);
  assert.equal(engine.loadRhythmSave(sample.scene.id, storage, sample.sections), undefined, "partition changée : la partie repart du début");
  const hyleeChart = engine.buildRhythmChart("normal");
  const v3 = { v: 3, scene: "hylee", difficulty: "normal", auto: false, offsetMs: 0, judgements: hyleeChart.map(() => 0) };
  engine.storeRhythmSave(v3, "hylee", storage);
  assert.ok(engine.loadRhythmSave("hylee", storage), "sauvegarde v3 de Hylee toujours lue");
  assert.equal(engine.loadRhythmSave("hylee", storage, sample.sections), undefined, "v3 jamais appliquée à une fiche");
  assert.match(await read("src/rhythm-intimacy-ui.tsx"), /v: kit \? 4 : 3|v: 4/, "instantané v4 pour les fiches");

  // Bulles : trois fins, note de relation, aucun tiret cadratin dans les textes nouveaux.
  const b = bubbles.BELLIRITH_RHYTHM_BUBBLES;
  for (const quality of ["embrasement", "accord", "tatonnement"]) assert.ok(b.endings[quality].lines.length >= 1, `fin ${quality}`);
  assert.ok(b.relationNote.length > 10);
  for (const file of ["src/rhythm-bubbles.ts", "src/rhythm-bubbles-bellirith.ts", "src/rhythm-anchors.ts", "src/rhythm-profiles.ts", "scripts/validate-rhythm-persos.mjs"]) {
    assert.ok(!(await read(file)).includes("\u2014"), `${file} : pas de tiret cadratin`);
  }
  assert.ok(!JSON.stringify(labels).includes("\u2014"));

  // Voix : banque propre à Bellirith (aucun fichier de Hylee), fichiers présents et crédités, aucune voix exclue.
  const files = sfx.rhythmSfxFilesFor(profile.voice);
  const voiceFiles = files.filter((name) => name.startsWith("bellirith/"));
  assert.equal(voiceFiles.length, 19, "19 extraits de voix pour Bellirith");
  assert.ok(!files.some((name) => /^(souffle|soupir|gemit|halete|apogee|bouche|etouffe|langue)-/.test(name)), "aucun extrait de la voix de Hylee dans la banque de Bellirith");
  for (const name of voiceFiles) {
    const info = await stat(resolve(projectRoot, `assets/audio/rythme/${name}.mp3`));
    assert.ok(info.size > 2000, `${name} : fichier vide`);
    assert.match(sources, new RegExp(`^\\| ${name.replace("/", "\\/")}\\.mp3 \\|.*\\| aarrnnoo \\| https://freesound\\.org/people/aarrnnoo/sounds/\\d+/ \\| CC BY 4\\.0 \\|$`, "m"), `${name} : crédit`);
  }
  for (const banned of ["Jackie", "Calistahhh", "Vidrik", "ellenmentor", "SuddenDice", "khenshom", "mariallinas"]) assert.ok(!sources.includes(banned), `SOURCES.md : ${banned} absent`);
  assert.equal((pageSource.match(/people\/aarrnnoo\//g) || []).length, 3, "crédits en jeu (À propos, Options, Mode libre)");

  // Intégration : un seul passage de relation par scène, en Chronique seulement, accès développeur.
  assert.match(pageSource, /lifeAdjustRelation\(current, characterId, delta, 0\)/);
  assert.match(pageSource, /result\.quality === "tatonnement" && !result\.auto && !modal\.replay && kit\.profile\.relationPenalty && !rhythmRelationApplied\.current/);
  assert.match(pageSource, /kind: "rythme-perso"/);
  assert.match(pageSource, /data-rythme-route=\{anchor\.routeId\}/);
  assert.match(pageSource, /if \(!rhythmScene && rhythmKit && nextChapter === rhythmKit\.start\)/);

  console.log(`Fiches de rythme OK : ${anchors.RHYTHM_ANCHORS.length} variantes de Bellirith, ${kits} jeux construits (3 historiques × 2 modes), partition de Hylee inchangée (${hash}), pièges hors score, ${voiceFiles.length} extraits aarrnnoo crédités.`);
} finally {
  await server.close();
}
