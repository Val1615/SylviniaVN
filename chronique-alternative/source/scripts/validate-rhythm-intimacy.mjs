// Validateur du jeu de rythme intime (prototype) : cadence régulière des va-et-vient, bruitages,
// paliers, sauvegarde « Reprendre plus tard », textes et rattachement à une seule scène.
import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";
import { BANNED } from "./intimate-vocabulary-lib.mjs";

const sourceRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const projectRoot = resolve(sourceRoot, "..");
const pageSource = await readFile(resolve(sourceRoot, "src/page.tsx"), "utf8");
const server = await createServer({ root: sourceRoot, appType: "custom", logLevel: "silent", server: { middlewareMode: true } });

try {
  const engine = await server.ssrLoadModule("/src/rhythm-intimacy-engine.ts");
  const texts = await server.ssrLoadModule("/src/rhythm-intimacy.ts");
  const hylee = await server.ssrLoadModule("/src/hylee-date-intimacy.ts");
  const scene = texts.HYLEE_HOME_RHYTHM;

  // Cadence : un coup par battement, tempo stable dans chaque position, accélération par paliers, aucune dépendance à la musique.
  const charts = Object.fromEntries(["doux", "normal", "intense"].map((d) => [d, engine.buildRhythmChart(d)]));
  assert.ok(!("RHYTHM_SONG_START" in engine) && !("RHYTHM_BPM" in engine), "plus aucun calage sur la musique");
  const bpms = engine.RHYTHM_SECTIONS.map((section) => section.bpm);
  for (let i = 1; i < bpms.length; i++) assert.ok(bpms[i] > bpms[i - 1], `tempo croissant d'une position à l'autre (${bpms.join(" < ")})`);
  for (const [difficulty, chart] of Object.entries(charts)) {
    assert.equal(chart.length, charts.normal.length, `${difficulty} : même cadence (un coup par battement), seuls tempo et tolérance changent`);
    assert.ok(chart.length >= 80, `${difficulty} : carte trop courte`);
    chart.forEach((note, index) => {
      assert.equal(note.index, index);
      if (index) assert.ok(note.time > chart[index - 1].time, `${difficulty} : notes ordonnées`);
      if (note.kind === "hold" || note.kind === "final") assert.ok(note.duration > 0, "appui long sans durée");
      else assert.equal(note.duration, 0);
    });
    assert.equal(chart.filter((n) => n.kind === "slide").length, 3, `${difficulty} : trois glissés (trois changements de position)`);
    assert.equal(chart.filter((n) => n.kind === "final").length, 1, "une seule apogée");
    assert.equal(chart.at(-1).kind, "final", "l'apogée clôt la carte");
    assert.ok(chart.some((n) => n.kind === "hold"), "appuis longs présents");
    engine.RHYTHM_SECTIONS.forEach((section, s) => {
      const own = chart.filter((n) => n.section === s);
      const steady = own.slice(0, section.strokes + (section.slide ? 1 : 0));
      const beat = steady.at(-1).beat;
      for (const note of steady) assert.ok(Math.abs(note.beat - beat) < 1e-9, `${difficulty}/${section.id} : tempo stable`);
      for (let i = 1; i < steady.length; i++) {
        const previous = steady[i - 1];
        const expected = previous.kind === "hold" ? section.holdBeats * beat : beat;
        assert.ok(Math.abs(steady[i].time - previous.time - expected) < 1e-6, `${difficulty}/${section.id} : coup hors battement à ${steady[i].time.toFixed(3)} s`);
      }
      if (section.ramp) {
        const ramp = own.slice(steady.length);
        assert.equal(ramp.length, section.ramp.strokes + 1, "montée finale complète");
        for (let i = 1; i < ramp.length; i++) assert.ok(ramp[i].beat <= ramp[i - 1].beat + 1e-9, `${difficulty} : la montée finale ne ralentit jamais`);
        assert.ok(ramp[0].beat < beat, "la montée accélère au-delà du tempo de la position");
      }
      if (s) assert.ok(own[0].beat < chart.filter((n) => n.section === s - 1)[0].beat, `${difficulty} : battement plus court à chaque position`);
    });
    // Pas de chevauchement entre un appui long et la note suivante.
    chart.forEach((note, i) => { if (note.duration && chart[i + 1]) assert.ok(note.time + note.duration <= chart[i + 1].time + 1e-6, "appui long chevauchant"); });
  }
  assert.ok(charts.doux.at(-1).time > charts.normal.at(-1).time && charts.normal.at(-1).time > charts.intense.at(-1).time, "Doux plus lent, Intense plus rapide");

  // La musique intime existe toujours (fond sonore réglable), les bruitages sont tous présents et sourcés.
  const track = resolve(projectRoot, "assets/audio", `${engine.RHYTHM_TRACK}.mp3`);
  await stat(track);
  let duration = 0;
  try { duration = Number(execFileSync("ffprobe", ["-v", "quiet", "-show_entries", "format=duration", "-of", "csv=p=0", track]).toString().trim()); } catch { duration = 0; }
  const sfx = await server.ssrLoadModule("/src/rhythm-intimacy-sfx.ts");
  const sources = await readFile(resolve(projectRoot, "assets/audio/rythme/SOURCES.md"), "utf8");
  for (const name of sfx.RHYTHM_SFX_FILES) {
    const file = resolve(projectRoot, "assets/audio/rythme", `${name}.mp3`);
    assert.ok((await stat(file)).size > 1000, `bruitage manquant : ${name}`);
    assert.ok(sources.includes(`${name}.mp3`), `bruitage non crédité dans SOURCES.md : ${name}`);
  }
  assert.ok(/CC0/.test(sources) && /freesound\.org/.test(sources), "SOURCES.md : licence et provenance");
  const defaults = engine.defaultRhythmPrefs();
  assert.ok(defaults.sfx && defaults.sfxVolume > 0 && defaults.musicVolume < 0.6, "bruitages actifs, musique en retrait par défaut");
  assert.equal(engine.rhythmArdour(0, false), 0);
  assert.equal(engine.rhythmArdour(40, true), 1, "l'apogée porte l'interface au maximum");
  assert.ok(engine.rhythmArdour(60, false) > engine.rhythmArdour(30, false), "l'interface réagit davantage quand le plaisir monte");

  // Justesse et paliers.
  assert.equal(engine.judgeOffset(0.01, "normal"), 1);
  assert.equal(engine.judgeOffset(0.1, "normal"), 2);
  assert.equal(engine.judgeOffset(0.2, "normal"), 0);
  const perfect = charts.normal.map(() => 1);
  const misses = charts.normal.map(() => 3);
  const mixed = charts.normal.map((_, i) => (i % 3 === 0 ? 3 : i % 3 === 1 ? 2 : 1));
  assert.equal(engine.rhythmQuality(perfect), "embrasement");
  assert.equal(engine.rhythmQuality(mixed), "tatonnement");
  assert.equal(engine.rhythmQuality(charts.normal.map((_, i) => (i % 4 === 0 ? 2 : 1))), "embrasement");
  assert.equal(engine.rhythmQuality(charts.normal.map((_, i) => (i % 4 === 0 ? 3 : i % 4 === 1 ? 2 : 1))), "accord");
  assert.equal(engine.rhythmGauge(perfect), 100);
  assert.equal(engine.rhythmGauge(misses), 0, "un raté ne fait jamais monter la jauge");
  for (let s = 0; s < 4; s++) {
    assert.equal(engine.sectionTiersReached(charts.normal, perfect, s), 3, "trois paliers par section en jeu parfait");
    assert.equal(engine.sectionTiersReached(charts.normal, misses, s), 0, "aucun palier sans justesse");
  }

  // Sauvegarde « Reprendre plus tard » : aller-retour exact, effacement, rejet d'un état incohérent.
  const memory = new Map();
  const storage = { getItem: (k) => memory.get(k) ?? null, setItem: (k, v) => memory.set(k, v) };
  const state = { v: 2, scene: scene.id, difficulty: "normal", auto: false, offsetMs: 20, time: 41.631, judgements: charts.normal.map((_, i) => (i < 50 ? 1 : 0)), combo: 12, maxCombo: 30, unlocked: ["intro-0", "s0-t1"], teases: [2], savedAt: 1 };
  engine.storeRhythmSave(state, "k", storage);
  assert.deepEqual(engine.loadRhythmSave("k", storage), state);
  engine.storeRhythmSave({ ...state, judgements: [1, 2] }, "bad", storage);
  assert.equal(engine.loadRhythmSave("bad", storage), undefined, "état incompatible avec la carte rejeté");
  engine.storeRhythmSave(undefined, "k", storage);
  assert.equal(engine.loadRhythmSave("k", storage), undefined);
  assert.equal(engine.RHYTHM_STORAGE_KEY, "sylvinia_ca_rythme_v1");
  assert.ok(!engine.RHYTHM_STORAGE_KEY.includes("vn_v82"), "jamais dans la sauvegarde du Mode Histoire");

  // Rattachement : une seule route, Explicite uniquement, parcours homme, jamais Naïah ni Bellirith.
  assert.equal(texts.rhythmSceneFor(scene.routeId, "explicite"), scene);
  for (const mode of ["tendre", "suggestif", "ellipse"]) assert.equal(texts.rhythmSceneFor(scene.routeId, mode), undefined, `${mode} : pas de jeu`);
  const route = hylee.hyleeDateIntimacyRoutes("home-hylee", "homme").find((r) => r.id === scene.routeId);
  assert.ok(route, "la route Hylee existe");
  assert.equal(hylee.hyleeDateIntimacyPhase(texts.RHYTHM_REPLACED_CHAPTER), "climax", "le jeu remplace la séquence climax");
  assert.equal(hylee.hyleeDateIntimacyPhase(texts.RHYTHM_REPLACED_CHAPTER - 1), "intensification");
  assert.ok(route.chapters.explicite[texts.RHYTHM_REPLACED_CHAPTER].length, "la version écrite reste lisible (Lire la version écrite)");
  assert.ok(!/naiah|bellirith/i.test(scene.routeId));

  // Textes : quatre positions, trois paliers chacune, trois conclusions, dix taquineries, rien de recyclé.
  assert.equal(scene.sections.length, engine.RHYTHM_SECTIONS.length);
  for (const section of scene.sections) {
    assert.ok(section.strokes.length >= 6, `${section.label} : au moins six lignes de cadence`);
    assert.ok(section.voice.length >= 4, `${section.label} : au moins quatre répliques en rythme`);
    for (const line of section.strokes) assert.ok(line.text.length <= 60, `ligne de cadence trop longue : ${line.text}`);
    for (const line of section.voice) { assert.equal(line.speaker, "Hylee"); assert.ok(line.text.length <= 40, `réplique trop longue : ${line.text}`); }
  }
  assert.ok(!/musique/i.test(JSON.stringify(scene)), "le texte ne parle plus de musique");
  const all = [scene.title, scene.instruction, ...scene.sections.flatMap((s) => [s.label, s.cadence, s.intro.text, ...s.tiers.map((l) => l.text), ...s.strokes.map((l) => l.text), ...s.voice.map((l) => l.text)]), ...scene.teases.map((l) => l.text), ...Object.values(scene.conclusions).flatMap((c) => [c.title, ...c.lines.map((l) => l.text)])];
  assert.equal(new Set(all).size, all.length, "aucun texte répété");
  assert.ok(scene.teases.length >= 8);
  for (const text of all) {
    assert.ok(!text.includes("—"), `tiret cadratin : ${text}`);
    assert.ok(!/ce n['’]est pas[^.]*, c['’]est/i.test(text), `tournure interdite : ${text}`);
    BANNED.lastIndex = 0;
    assert.ok(!BANNED.test(text), `terme cru : ${text}`);
  }
  const corpus = [hylee, await server.ssrLoadModule("/src/individual-explicit-scenes.ts")].map((m) => JSON.stringify(m)).join("\n");
  for (const text of all.filter((t) => t.length > 40)) assert.ok(!corpus.includes(text), `texte recyclé : ${text}`);
  for (const section of scene.sections) for (const line of [section.intro, ...section.tiers, ...section.voice]) if (line.intimateMood) assert.ok(["seductive", "teasing", "tender", "soft", "shy", "annoyed"].includes(line.intimateMood), "humeur de sprite intime Hylee existante");

  // Accès développeur et intégration à la scène.
  assert.match(pageSource, /kind: "hylee-rhythm"/);
  assert.match(pageSource, /id="caDevRythme"/);
  assert.match(pageSource, /game\.player\.intimacy !== "explicite"/, "bouton dév réservé au réglage Explicite");
  assert.match(pageSource, /RHYTHM_DUCK_EVENT/);

  const counts = Object.fromEntries(Object.entries(charts).map(([d, c]) => [d, c.length]));
  const studio = await readFile(resolve(sourceRoot, "scripts/studio-ca-strings.mjs"), "utf8");
  assert.match(studio, /"rhythm-intimacy-sfx"/, "le module des bruitages reste hors de l'enveloppe Studio");
  const lengths = Object.fromEntries(Object.keys(charts).map((d) => [d, engine.rhythmChartEnd(d).toFixed(1) + " s"]));
  console.log(`Jeu de rythme OK : ${charts.normal.length} coups par partie, tempos ${bpms.join(" → ")} puis montée à ${engine.RHYTHM_SECTIONS.at(-1).ramp.toBpm} coups/min, durées ${JSON.stringify(lengths)}, ${sfx.RHYTHM_SFX_FILES.length} bruitages sourcés, musique de fond ${duration ? duration.toFixed(0) + " s" : "présente"}, ${all.length} textes uniques.`);
} finally {
  await server.close();
}
