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
  // Sept phases : trois préliminaires (main, bouche, langue), chacune à son tempo, puis les quatre positions qui accélèrent.
  assert.deepEqual(engine.RHYTHM_SECTIONS.map((s) => s.gesture), ["main", "bouche", "langue", "penetration", "penetration", "penetration", "penetration"], "ordre des phases");
  const prelim = engine.RHYTHM_SECTIONS.filter((s) => s.gesture !== "penetration");
  const positions = engine.RHYTHM_SECTIONS.filter((s) => s.gesture === "penetration");
  for (const group of [prelim, positions]) for (let i = 1; i < group.length; i++) assert.ok(group[i].bpm > group[i - 1].bpm, `tempo croissant (${group.map((g) => g.bpm).join(" < ")})`);
  assert.ok(prelim.every((s) => s.motif && s.motif.length >= 4), "chaque préliminaire a son motif");
  assert.ok(new Set(prelim.map((s) => JSON.stringify(s.motif))).size === prelim.length, "un motif propre à chaque préliminaire");
  for (const [difficulty, chart] of Object.entries(charts)) {
    assert.equal(chart.length, charts.normal.length, `${difficulty} : même cadence (un coup par battement), seuls tempo et tolérance changent`);
    assert.ok(chart.length >= 80, `${difficulty} : carte trop courte`);
    chart.forEach((note, index) => {
      assert.equal(note.index, index);
      if (index) assert.ok(note.time > chart[index - 1].time, `${difficulty} : notes ordonnées`);
      if (note.kind === "hold" || note.kind === "final") assert.ok(note.duration > 0, "appui long sans durée");
      else assert.equal(note.duration, 0);
    });
    const transitions = chart.filter((n, i) => n.kind === "slide" && (i === 0 || chart[i - 1].section !== n.section));
    assert.equal(transitions.length, engine.RHYTHM_SECTIONS.filter((s) => s.slide).length, `${difficulty} : un glissé à chaque changement de geste ou de position`);
    assert.equal(transitions.length, 6, `${difficulty} : six transitions`);
    assert.equal(chart.filter((n) => n.kind === "final").length, 1, "une seule apogée");
    assert.equal(chart.at(-1).kind, "final", "l'apogée clôt la carte");
    assert.ok(chart.some((n) => n.kind === "hold"), "appuis longs présents");
    engine.RHYTHM_SECTIONS.forEach((section, s) => {
      const own = chart.filter((n) => n.section === s);
      if (section.motif) {
        // Préliminaires : le motif se répète à l'identique, tempo stable ; une tenue dure tout son pas.
        const notes = own.slice(section.slide ? 1 : 0);
        const beat = notes[0].beat;
        assert.equal(notes.length, section.strokes, `${difficulty}/${section.id} : nombre de coups`);
        notes.forEach((note, i) => {
          const step = section.motif[i % section.motif.length];
          assert.equal(note.kind, step.kind, `${difficulty}/${section.id} : motif respecté`);
          assert.equal(note.motion, step.motion, `${difficulty}/${section.id} : sens du geste`);
          if (step.kind === "hold") assert.ok(Math.abs(note.duration - step.beats * beat) < 1e-9);
          if (i) assert.ok(Math.abs(note.time - notes[i - 1].time - section.motif[(i - 1) % section.motif.length].beats * beat) < 1e-6, `${difficulty}/${section.id} : coup hors motif`);
        });
        if (s) assert.ok(own[0].beat < chart.filter((n) => n.section === s - 1)[0].beat, `${difficulty} : battement plus court d'un préliminaire à l'autre`);
        const next = chart.find((n) => n.section === s + 1);
        const last = notes.at(-1);
        assert.ok(next.time >= last.time + last.duration + 0.2, `${difficulty}/${section.id} : la phase suivante attend la fin du dernier geste`);
        return;
      }
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
      if (s && engine.RHYTHM_SECTIONS[s - 1].gesture === "penetration") assert.ok(own[0].beat < chart.filter((n) => n.section === s - 1)[0].beat, `${difficulty} : battement plus court à chaque position`);
    });
    // Cunnilingus : cadence irrégulière mais lisible (au moins deux durées de pas, motif répété).
    const langue = engine.RHYTHM_SECTIONS.find((x) => x.id === "langue");
    assert.ok(new Set(langue.motif.map((m) => m.beats)).size >= 3 && langue.motif.some((m) => m.kind === "slide"), "langue : pas irréguliers et glissés");
    assert.ok(engine.RHYTHM_SECTIONS.find((x) => x.id === "main").motif.filter((m) => m.motion).length >= 6, "main : va-et-vient haut/bas");
    assert.ok(engine.RHYTHM_SECTIONS.find((x) => x.id === "bouche").motif.filter((m) => m.kind === "hold").length >= 2, "bouche : tenues profondes");
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
  // Une seule voix pour Hylee : MagicalMysticVA (CC BY 4.0), créditée ici et dans le jeu ; plus aucune des anciennes voix.
  const voiceRows = sources.split("\n").filter((line) => /^\| (souffle|soupir|gemit|halete|apogee)-\d+\.mp3/.test(line));
  assert.ok(voiceRows.length > 0 && voiceRows.every((line) => /MagicalMysticVA/.test(line) && /CC BY 4\.0/.test(line) && /freesound\.org\/people\/magicalmysticva\/sounds\/\d+/.test(line)), "voix : une seule comédienne, CC BY 4.0 sourcée");
  // Vidrik, ancienne voix de Hylee, n'est admise que dans la section « Voix de Lineva » (lot 5, choix de Valentin), jamais pour Hylee.
  const withoutLineva = sources.replace(/^## Voix de Lineva[\s\S]*?(?=^## |(?![\s\S]))/m, "");
  assert.ok(!/Vidrik|ellenmentor|SuddenDice|khenshom|mariallinas/.test(withoutLineva), "anciennes voix retirées des crédits de Hylee");
  assert.ok(sources.split("\n").filter((line) => line.includes("Vidrik") && line.startsWith("| ")).every((line) => line.startsWith("| lineva/")), "Vidrik : lignes de Lineva seulement");
  const pageSource = await readFile(resolve(projectRoot, "source/src/page.tsx"), "utf8");
  assert.ok(/MagicalMysticVA/.test(pageSource) && /CC BY 4\.0/.test(pageSource), "crédit de la voix dans le jeu");
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
  for (let s = 0; s < engine.RHYTHM_SECTIONS.length; s++) {
    assert.equal(engine.sectionTiersReached(charts.normal, perfect, s), 3, "trois paliers par section en jeu parfait");
    assert.equal(engine.sectionTiersReached(charts.normal, misses, s), 0, "aucun palier sans justesse");
  }

  // Sauvegarde « Reprendre plus tard » : aller-retour exact, effacement, rejet d'un état incohérent.
  const memory = new Map();
  const storage = { getItem: (k) => memory.get(k) ?? null, setItem: (k, v) => memory.set(k, v) };
  const state = { v: 3, scene: scene.id, difficulty: "normal", auto: false, offsetMs: 20, time: 41.631, judgements: charts.normal.map((_, i) => (i < 50 ? 1 : 0)), combo: 12, maxCombo: 30, unlocked: ["intro-0", "s0-t1"], teases: [2], savedAt: 1 };
  engine.storeRhythmSave(state, "k", storage);
  assert.deepEqual(engine.loadRhythmSave("k", storage), state);
  engine.storeRhythmSave({ ...state, v: 2 }, "old", storage);
  assert.equal(engine.loadRhythmSave("old", storage), undefined, "une sauvegarde de l'ancienne partie (quatre positions) repart de zéro");
  engine.storeRhythmSave({ ...state, judgements: [1, 2] }, "bad", storage);
  assert.equal(engine.loadRhythmSave("bad", storage), undefined, "état incompatible avec la carte rejeté");
  engine.storeRhythmSave(undefined, "k", storage);
  assert.equal(engine.loadRhythmSave("k", storage), undefined);
  assert.equal(engine.RHYTHM_STORAGE_KEY, "sylvinia_ca_rythme_v1");
  assert.ok(!engine.RHYTHM_STORAGE_KEY.includes("vn_v82"), "jamais dans la sauvegarde du Mode Histoire");

  // Rattachement : une seule route, Explicite uniquement, parcours homme, jamais Naïah ni Bellirith.
  assert.equal(texts.rhythmSceneFor(scene.routeId, "explicite"), scene);
  for (const mode of ["tendre", "ellipse"]) assert.equal(texts.rhythmSceneFor(scene.routeId, mode), undefined, `${mode} : pas de jeu`);
  // v5 · Suggestif : même scène, version adoucie.
  const soft = texts.HYLEE_HOME_RHYTHM_SUGGESTIF;
  assert.equal(texts.rhythmSceneFor(scene.routeId, "suggestif"), soft, "suggestif : version adoucie du jeu");
  assert.ok(soft.suggestive === true && !scene.suggestive && soft.id !== scene.id, "suggestif : drapeau et sauvegarde séparée");
  assert.equal(texts.rhythmSceneFor("autre-route", "suggestif"), undefined);
  const route = hylee.hyleeDateIntimacyRoutes("home-hylee", "homme").find((r) => r.id === scene.routeId);
  assert.ok(route, "la route Hylee existe");
  assert.equal(hylee.hyleeDateIntimacyPhase(texts.RHYTHM_REPLACED_CHAPTER), "climax", "le jeu remplace la séquence climax");
  assert.equal(hylee.hyleeDateIntimacyPhase(texts.RHYTHM_REPLACED_CHAPTER - 1), "intensification");
  assert.ok(route.chapters.explicite[texts.RHYTHM_REPLACED_CHAPTER].length, "la version écrite reste lisible (Lire la version écrite)");
  assert.equal(hylee.hyleeDateIntimacyPhase(texts.RHYTHM_START_CHAPTER), "partner-discovery", "le jeu s'ouvre sur les caresses à la table");
  for (let c = texts.RHYTHM_START_CHAPTER; c <= texts.RHYTHM_REPLACED_CHAPTER; c++) assert.ok(route.chapters.explicite[c].length, `séquence écrite ${c + 1} lisible`);
  assert.equal(hylee.hyleeDateIntimacyPhase(texts.RHYTHM_VISUAL_CHAPTER), "intensification", "visuel du jeu : sprites intimes, sans CG");
  assert.match(pageSource, /nextChapter === RHYTHM_START_CHAPTER/, "le jeu s'ouvre à la première séquence remplacée");
  assert.match(pageSource, /conclusion \? RHYTHM_REPLACED_CHAPTER : RHYTHM_START_CHAPTER/, "version écrite : toutes les séquences remplacées");
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
  // Textes Suggestif : même structure, mêmes règles, et aucun mot d'anatomie ou d'acte décrit.
  assert.equal(soft.sections.length, scene.sections.length, "suggestif : autant de phases");
  const SOFT_BANNED = /\b(langue|lèvres|sexe|seins?|cuisses?|reins|en elle|au fond|enfoui|poussées?|coups? de reins|jouiss\w*|nue?s?|vous accueille|entre ses|bouche|peau claque)\b/i;
  for (const section of soft.sections) {
    assert.ok(section.strokes.length >= 6 && section.voice.length >= 4, `suggestif ${section.label} : lignes complètes`);
    for (const line of section.strokes) assert.ok(line.text.length <= 60, `suggestif : ligne trop longue ${line.text}`);
    for (const line of section.voice) { assert.equal(line.speaker, "Hylee"); assert.ok(line.text.length <= 40, `suggestif : réplique trop longue ${line.text}`); }
  }
  const softAll = [soft.title, soft.instruction, ...soft.sections.flatMap((s) => [s.label, s.cadence, s.intro.text, ...s.tiers.map((l) => l.text), ...s.strokes.map((l) => l.text), ...s.voice.map((l) => l.text)]), ...soft.teases.map((l) => l.text), ...Object.values(soft.conclusions).flatMap((c) => [c.title, ...c.lines.map((l) => l.text)])];
  assert.equal(new Set(softAll).size, softAll.length, "suggestif : aucun texte répété");
  for (const text of softAll) {
    assert.ok(!text.includes("—") && !/ce n['’]est pas[^.]*, c['’]est/i.test(text), `suggestif : style ${text}`);
    BANNED.lastIndex = 0;
    assert.ok(!BANNED.test(text) && !SOFT_BANNED.test(text), `suggestif : terme trop explicite « ${text} »`);
  }
  const explicitOnly = new Set(all.filter((t) => t.length > 30));
  // Intros et paliers tous réécrits ; quelques lignes courtes déjà sans détail (regards, givre, taquineries) sont partagées.
  const softDescriptions = soft.sections.flatMap((s) => [s.intro.text, ...s.tiers.map((l) => l.text)]);
  assert.ok(softDescriptions.every((t) => !explicitOnly.has(t)), "suggestif : intros et paliers réécrits");
  assert.ok(["Ses lèvres", "Votre langue"].every((label) => !soft.sections.some((s) => s.label === label)), "suggestif : titres de phase adoucis");
  for (let c = texts.RHYTHM_START_CHAPTER; c <= texts.RHYTHM_REPLACED_CHAPTER; c++) assert.ok(route.chapters.suggestif[c].length, `séquence écrite Suggestif ${c + 1} lisible`);
  assert.match(pageSource, /route\.chapters\[game\.player\.intimacy === "suggestif" \? "suggestif" : "explicite"\]/, "accès direct : suite écrite dans le réglage du joueur");
  assert.match(pageSource, /rhythmScene\?\.suggestive \? "rythme-suggestif"/, "suggestif : classe de voile sur la scène");
  assert.match(pageSource, /game\.player\.intimacy !== "explicite" && game\.player\.intimacy !== "suggestif"/, "bouton de dév : Explicite ou Suggestif");
  assert.match(await readFile(resolve(sourceRoot, "src/rhythm-intimacy.css"), "utf8"), /\.rythme-suggestif \.intimacy-sprite img,[^{]*\.intimacy-cg img \{[^}]*blur\(/, "suggestif : sprite et CG floutés");
  for (const section of scene.sections) for (const line of [section.intro, ...section.tiers, ...section.voice]) if (line.intimateMood) assert.ok(["seductive", "teasing", "tender", "soft", "shy", "annoyed"].includes(line.intimateMood), "humeur de sprite intime Hylee existante");

  // Accès développeur et intégration à la scène.
  assert.match(pageSource, /kind: "hylee-rhythm"/);
  assert.match(pageSource, /id="caDevRythme"/);
  assert.match(pageSource, /game\.player\.intimacy !== "explicite"/, "bouton dév réservé au réglage Explicite");
  assert.match(pageSource, /RHYTHM_DUCK_EVENT/);

  const counts = Object.fromEntries(Object.entries(charts).map(([d, c]) => [d, c.length]));
  const studio = await readFile(resolve(sourceRoot, "scripts/studio-ca-strings.mjs"), "utf8");
  assert.match(studio, /"rhythm-intimacy-sfx"/, "le module des bruitages reste hors de l'enveloppe Studio");
  // v3 · Enchaînements : paliers à 8, 16, 24 puis tous les 12 ; un raté brise le combo ; bonus de jauge plafonné.
  assert.deepEqual([...engine.RHYTHM_COMBO_FIRST], [8, 16, 24], "paliers de combo 8, 16, 24");
  const crossings = Array.from({ length: 120 }, (_, i) => i + 1).filter((c) => engine.rhythmComboThreshold(c));
  assert.deepEqual(crossings, [8, 16, 24, 36, 48, 60, 72, 84, 96, 108, 120], "paliers franchis aux bons coups");
  assert.equal(engine.rhythmComboLevel(7), 0); assert.equal(engine.rhythmComboLevel(8), 1); assert.equal(engine.rhythmComboLevel(16), 2); assert.equal(engine.rhythmComboLevel(60), 3);
  const flat = charts.normal.map(() => 2);
  assert.equal(engine.rhythmGauge(flat, 0), engine.rhythmGauge(flat), "sans bonus, jauge inchangée");
  assert.ok(engine.rhythmGauge(flat, 3) > engine.rhythmGauge(flat), "le combo bonifie la jauge");
  assert.equal(engine.rhythmGauge(flat, 999) - engine.rhythmGauge(flat), engine.RHYTHM_COMBO_BONUS_MAX, "bonus plafonné");
  assert.equal(engine.rhythmQuality(flat), engine.rhythmQuality(flat), "la qualité finale ne dépend que des jugements");
  const ui = await readFile(resolve(sourceRoot, "src/rhythm-intimacy-ui.tsx"), "utf8");
  assert.match(ui, /if \(judgement === 3\) \{\s*comboRef\.current = 0;/, "un raté brise le combo");
  assert.match(ui, /downgraded === 3\) \{ comboRef\.current = 0;/, "un appui lâché brise le combo");
  assert.match(ui, /rythme-combo-eclat/, "inscription COMBO au palier");
  assert.match(ui, /rythme-onde combo/, "onde rose au palier");
  assert.match(ui, /rythme-combo-voile/, "voile rose au palier");
  assert.match(ui, /bonus: bonusRef\.current/, "bonus conservé dans la sauvegarde");
  const css = await readFile(resolve(sourceRoot, "src/rhythm-intimacy.css"), "utf8");
  for (const rule of [".rythme-combo-eclat", ".rythme-onde.combo", ".rythme-combo-voile", ".effets-reduit .rythme-combo-eclat"]) assert.ok(css.includes(rule), `style ${rule}`);

  // v3 · Voix : hors combo, seulement souffles et soupirs, rares ; gémissements uniquement aux paliers, espacés.
  const sfxSource = await readFile(resolve(sourceRoot, "src/rhythm-intimacy-sfx.ts"), "utf8");
  const strokeBody = sfxSource.slice(sfxSource.indexOf("  stroke("), sfxSource.indexOf("  /** Glissé"));
  assert.ok(!/speak|gemit|halete|breath|comboMoan/.test(strokeBody), "un coup ne déclenche jamais de gémissement à lui seul (seule une tenue profonde de la bouche fait entendre sa voix étouffée)");
  const breathBody = sfxSource.slice(sfxSource.indexOf("  breath("), sfxSource.indexOf("  comboMoan("));
  assert.ok(!/gemit|halete/.test(breathBody), "hors combo : ni gémissement ni halètement");
  for (const runs of [["parfaite", () => 1], ["avec ratés", (i) => (i % 11 === 10 ? 3 : 1)]]) {
    const [label, judge] = runs;
    const voice = new sfx.RhythmSfx();
    const clock = { currentTime: 0 };
    Object.assign(voice, { ctx: clock, master: {} });
    let combo = 0; let thresholds = 0; const moanTimes = []; const mouthTimes = [];
    const moanCount = () => ["gemit", "halete", "etouffe", "langue"].reduce((sum, g) => sum + (voice.played[g] || 0), 0);
    for (const note of charts.normal) {
      clock.currentTime = note.time + 10;
      const gesture = engine.RHYTHM_SECTIONS[note.section].gesture;
      const before = moanCount(); const mouthBefore = voice.played.bouche || 0;
      if (judge(note.index) === 3) { combo = 0; voice.miss(); continue; }
      combo++;
      if (note.kind === "slide") voice.slide(gesture, true); else voice.stroke(true, 0.5, note.kind === "hold" || note.kind === "final", gesture, note.motion);
      if (engine.rhythmComboThreshold(combo)) { thresholds++; voice.comboMoan(engine.rhythmComboLevel(combo), 0.6, gesture); } else voice.breath(0.6, false, gesture);
      if (moanCount() > before) moanTimes.push(note.time);
      if ((voice.played.bouche || 0) > mouthBefore) mouthTimes.push(note.time);
    }
    const moans = moanCount();
    for (let i = 1; i < mouthTimes.length; i++) assert.ok(mouthTimes[i] - mouthTimes[i - 1] >= 2.5, `${label} : voix bouche occupée espacée`);
    for (const group of ["glisse", "succion", "lechage", "baiser", "peau"]) assert.ok(voice.played[group] > 0, `${label} : bruitage ${group} joué dans sa phase`);
    assert.ok(mouthTimes.length > 0, `${label} : voix bouche occupée sur les tenues profondes`);
    const breaths = (voice.played.souffle || 0) + (voice.played.soupir || 0);
    assert.ok(moans > 0 && moans <= thresholds, `${label} : gémissements seulement aux paliers (${moans} pour ${thresholds} paliers)`);
    for (let i = 1; i < moanTimes.length; i++) assert.ok(moanTimes[i] - moanTimes[i - 1] >= 3.5, `${label} : gémissements espacés`);
    assert.ok(breaths <= charts.normal.length * 0.2, `${label} : souffles rares hors combo (${breaths})`);
    if (label === "parfaite") var perfectVoices = { moans, breaths, thresholds };
  }

  // v5 · Mixage et bruits corporels neutres : chaque groupe a sa famille, les réglages sont mémorisés,
  // et en mode neutre aucun bruit corporel enregistré ne joue (sons synthétisés à la place, rythme intact).
  const busOf = sfx.RHYTHM_SFX_BUS;
  for (const name of sfx.RHYTHM_SFX_FILES) assert.ok(busOf[name.replace(/-\d+$/, "")], `famille de mixage pour ${name}`);
  assert.deepEqual([...new Set(Object.values(busOf))].sort(), [...engine.RHYTHM_BUSES].sort(), "familles du mixage");
  for (const g of ["peau", "humide", "glisse", "succion", "lechage"]) assert.equal(busOf[g], "corps", `${g} : bruit corporel`);
  for (const g of ["souffle", "soupir", "gemit", "halete", "apogee"]) assert.equal(busOf[g], "voix", `${g} : voix`);
  assert.ok(defaults.mix && defaults.neutral === false && Object.values(defaults.mute).every((m) => m === false), "mixage par défaut : tout audible, bruits réels");
  {
    const store = new Map();
    globalThis.localStorage = { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => store.set(k, String(v)), removeItem: (k) => store.delete(k) };
    engine.storeRhythmPrefs({ ...defaults, mix: { ...defaults.mix, voix: 0.4, corps: 0.15 }, mute: { ...defaults.mute, ambiance: true, musique: true }, neutral: true });
    const back = engine.loadRhythmPrefs();
    assert.equal(back.mix.voix, 0.4); assert.equal(back.mix.corps, 0.15); assert.equal(back.mute.ambiance, true); assert.equal(back.mute.musique, true); assert.equal(back.neutral, true, "réglages du mixage mémorisés");
    store.set(engine.RHYTHM_PREFS_KEY, JSON.stringify({ difficulty: "doux", sfxVolume: 0.5 }));
    const old = engine.loadRhythmPrefs();
    assert.equal(old.neutral, false); assert.equal(old.mix.voix, defaults.mix.voix); assert.equal(old.difficulty, "doux", "anciens réglages relus sans mixage");
    delete globalThis.localStorage;
  }
  {
    const neutral = new sfx.RhythmSfx();
    const clock = { currentTime: 0 };
    Object.assign(neutral, { ctx: clock, master: {}, neutral: true });
    let combo = 0;
    for (const note of charts.normal) {
      clock.currentTime = note.time + 10;
      const gesture = engine.RHYTHM_SECTIONS[note.section].gesture;
      combo++;
      if (note.kind === "slide") neutral.slide(gesture, note.index % 2 === 0); else neutral.stroke(true, 0.5, note.kind === "hold" || note.kind === "final", gesture, note.motion);
      if (engine.rhythmComboThreshold(combo)) { neutral.comboMoan(engine.rhythmComboLevel(combo), 0.6, gesture); neutral.comboChime(engine.rhythmComboLevel(combo)); } else neutral.breath(0.6, false, gesture);
    }
    neutral.apogee();
    for (const g of ["peau", "humide", "glisse", "succion", "lechage", "bouche", "langue"]) assert.ok(!neutral.played[g], `bruits neutres : aucun son « ${g} »`);
    for (const k of ["battement", "feutre", "tic", "souffle"]) assert.ok(neutral.played[`neutre-${k}`] > 0, `bruits neutres : ${k} joué`);
    const strokes = charts.normal.filter((n) => n.kind !== "slide").length;
    const neutralStrokes = ["battement", "feutre", "tic", "souffle"].reduce((sum, k) => sum + (neutral.played[`neutre-${k}`] || 0), 0);
    assert.ok(neutralStrokes >= strokes, `bruits neutres : un son par coup (${neutralStrokes} pour ${strokes})`);
    assert.ok(neutral.played.combo > 0 && neutral.played.apogee > 0, "carillon de combo et apogée");
    var neutralStats = { strokes: neutralStrokes };
  }
  {
    const sug = new sfx.RhythmSfx({ suggestive: true });
    const clock = { currentTime: 0 };
    Object.assign(sug, { ctx: clock, master: {} });
    sug.setMix(defaults.mix, defaults.mute, false);
    assert.ok(sug.neutral && sug.mute.voix, "suggestif : bruits neutres et voix coupée imposés, même si le mixage demande l'inverse");
    let combo = 0;
    for (const note of charts.normal) {
      clock.currentTime = note.time + 10;
      const gesture = engine.RHYTHM_SECTIONS[note.section].gesture;
      combo++;
      if (note.kind === "slide") sug.slide(gesture, note.index % 2 === 0); else sug.stroke(true, 0.9, note.kind === "hold" || note.kind === "final", gesture, note.motion);
      if (engine.rhythmComboThreshold(combo)) { sug.comboMoan(engine.rhythmComboLevel(combo), 0.9, gesture); sug.comboChime(engine.rhythmComboLevel(combo)); } else sug.breath(0.9, true, gesture);
    }
    sug.apogee();
    const heard = Object.keys(sug.played).filter((g) => sfx.RHYTHM_SFX_BUS[g] === "voix" || sfx.RHYTHM_SFX_BUS[g] === "corps");
    assert.deepEqual(heard, [], `suggestif : ni voix ni bruit corporel (${heard.join(", ")})`);
    for (const k of ["battement", "feutre", "tic", "souffle"]) assert.ok(sug.played[`neutre-${k}`] > 0, `suggestif : son neutre ${k}`);
    assert.ok(sug.played.combo > 0, "suggestif : interface conservée");
  }
  assert.match(ui, /new RhythmSfx\(\{ suggestive \}\)/, "suggestif transmis aux bruitages");
  assert.match(ui, /disabled=\{suggestive\}/, "suggestif : bruits neutres non désactivables");
  assert.match(ui, /data-rythme-mixage/, "menu de mixage");
  assert.match(ui, /setMix\(prefs\.mix, prefs\.mute, prefs\.neutral\)/, "mixage appliqué en direct");
  assert.match(ui, /Bruits corporels neutres/, "option bruits neutres");
  assert.ok((ui.match(/\{reglagesAmbiance\}/g) || []).length >= 2, "mixage accessible avant le lancement et en pause");
  assert.ok(css.includes(".rythme-mixage") && css.includes(".rythme-muet"), "styles du mixage");

  // v3 · Secousse : sens par position, amplitude croissante, plafonnée, réduite ou coupée sur demande.
  assert.deepEqual(positions.map((s) => s.shake), ["vertical", "profondeur", "vertical", "profondeur"], "sens de la secousse par position");
  const plein = { effects: "plein", shake: true };
  const a0 = engine.rhythmShakeAmplitude(0, 0, false, plein), a1 = engine.rhythmShakeAmplitude(0.6, 1, false, plein), a2 = engine.rhythmShakeAmplitude(0.95, 3, false, plein), aTop = engine.rhythmShakeAmplitude(1, 3, true, plein);
  assert.ok(a0 > 0 && a0 < a1 && a1 < a2 && a2 <= aTop, `amplitude croissante (${[a0, a1, a2, aTop].map((v) => v.toFixed(1)).join(" < ")})`);
  assert.ok(aTop <= engine.RHYTHM_SHAKE_MAX, "amplitude plafonnée");
  assert.ok(engine.rhythmShakeAmplitude(1, 3, true, { effects: "reduit", shake: true }) <= aTop * 0.31, "réduite en effets réduits");
  assert.equal(engine.rhythmShakeAmplitude(1, 3, true, { effects: "plein", shake: false }), 0, "désactivable");
  const wave = Array.from({ length: 40 }, (_, i) => engine.rhythmShakeWave(i / 100));
  assert.ok(Math.max(...wave) > 0.4 && Math.min(...wave) < -0.1, "poussée puis rebond");
  assert.equal(engine.rhythmShakeWave(engine.RHYTHM_SHAKE_DURATION), 0, "retour au repos");
  assert.ok(defaults.shake === true, "secousses actives par défaut");
  assert.match(css, /intimacy-sprite img \{[^}]*translate: var\(--rythme-secousse-x, 0px\) var\(--rythme-secousse-y/, "secousse appliquée au sprite");
  assert.match(css, /intimacy-sprite img \{[^}]*var\(--rythme-etire, 0\)[^}]*rotate: var\(--rythme-incline/, "étirement et inclinaison appliqués au sprite");
  for (const g of ["main", "bouche", "langue"]) assert.ok(css.includes(`[data-rythme-geste="${g}"] .intimacy-sprite img`), `origine du geste ${g}`);
  assert.match(css, /group-intimacy-sprite\.active img,\s*\.rythme-en-cours \.intimacy-sprite img/, "trio : même mouvement que le solo, seulement sur le sprite actif");
  for (const g of ["main", "bouche", "langue"]) assert.ok(css.includes(`[data-rythme-geste="${g}"] .group-intimacy-sprite.active img`), `origine du geste ${g} aussi sur le sprite actif du trio`);
  // Animation propre à chaque geste : visible, distincte de la secousse, bornée, coupée avec les secousses.
  const motionOf = (gesture, extra = {}) => Array.from({ length: 60 }, (_, i) => engine.rhythmGestureMotion({ gesture, axis: "vertical", amp: 12, sinceHit: i / 100, beat: 0.8, t: 10 + i / 100, motion: "haut", ardour: 0.7, progress: 0.8, ...extra }));
  const peak = (list, key) => Math.max(...list.map((m) => Math.abs(m[key])));
  const main = motionOf("main"), bouche = motionOf("bouche"), langue = motionOf("langue"), pen = motionOf("penetration");
  assert.ok(peak(main, "stretch") > 0.01 && peak(main, "tilt") === 0, "main : étirement vertical en rythme");
  assert.ok(peak(motionOf("main", { motion: "bas" }), "stretch") < peak(main, "stretch"), "main : retour plus court sur « bas »");
  assert.ok(peak(motionOf("main", { holdFrac: 0.8 }), "stretch") > 0.01, "main : étirement maintenu pendant une caresse tenue");
  assert.ok(peak(bouche, "y") > 5 && peak(bouche, "tilt") > 0.5 && peak(bouche, "stretch") === 0, "bouche : hochement et inclinaison");
  assert.ok(Math.sign(motionOf("bouche", { parity: 1 })[30].tilt) === -Math.sign(bouche[30].tilt), "bouche : inclinaison alternée");
  assert.ok(peak(langue, "x") > 1 && peak(langue, "tilt") > 0.3, "langue : ondulation");
  const shiverLow = peak(motionOf("langue", { progress: 0, sinceHit: 99 }), "x"), shiverHigh = peak(motionOf("langue", { progress: 1, sinceHit: 99 }), "x");
  assert.ok(shiverHigh > shiverLow, "langue : les frissons montent au fil de la phase");
  assert.ok(peak(pen, "stretch") === 0 && peak(pen, "tilt") === 0 && peak(pen, "y") > 5, "pénétration : secousse seule");
  for (const list of [main, bouche, langue]) for (const m of list) assert.ok(Math.abs(m.stretch) <= engine.RHYTHM_STRETCH_MAX && Math.abs(m.tilt) <= engine.RHYTHM_TILT_MAX && Math.abs(m.y) <= engine.RHYTHM_SHAKE_MAX, "mouvement borné");
  for (const g of ["main", "bouche", "langue", "penetration"]) assert.deepEqual(engine.rhythmGestureMotion({ gesture: g, axis: "vertical", amp: 0, sinceHit: 0.1, beat: 0.8, t: 3 }), { y: 0, x: 0, scale: 0, stretch: 0, tilt: 0 }, `${g} : immobile quand les secousses sont coupées`);
  assert.match(css, /intimacy-cg img \{[^}]*calc\(\.4 \* var\(--rythme-secousse-y/, "secousse plus légère sur la CG");

  // v3 · Sprite : un échec de chargement ne le masque plus pour de bon.
  const recover = pageSource.slice(pageSource.indexOf("function recoverMissingIntimateSprite"), pageSource.indexOf("function routeBackground("));
  assert.match(recover, /function markIntimateSpriteLoaded[\s\S]*image\.hidden = false/, "une image chargée réapparaît");
  assert.match(recover, /spriteLastGood/, "repli sur la dernière image bien chargée");
  assert.ok((pageSource.match(/onLoad=\{use\w*IntimateSprite \? markIntimateSpriteLoaded/g) || []).length >= 3, "tous les sprites intimes se rétablissent au chargement");

  const narrative = await server.ssrLoadModule("/src/narrative-system.ts");
  const duo = ["hylee"];
  const trio = ["hylee", "remerii"];
  const L = (speaker, text) => ({ speaker, text });
  assert.deepEqual(narrative.actingCharacterIds(L("Hylee", "Viens plus près."), trio), ["hylee"], "locuteur seul");
  assert.deepEqual(narrative.actingCharacterIds(L("Hylee et Remerii", "Ensemble."), trio), ["hylee", "remerii"], "deux locuteurs dans le libellé");
  assert.deepEqual(narrative.actingCharacterIds(L("Naiah", "Attends."), ["naiah"]), ["naiah"], "locuteur sans accent");
  assert.deepEqual(narrative.actingCharacterIds(L("Narration", "Hylee pose la main sur vous."), trio), ["hylee"], "acteur en tête de narration");
  assert.deepEqual(narrative.actingCharacterIds(L("Narration", "Puis Remerii accélère sans rien dire."), trio), ["remerii"], "acteur précédé d’un adverbe");
  assert.deepEqual(narrative.actingCharacterIds(L("Narration", "Hylee et Remerii se retrouvent contre vous."), trio), ["hylee", "remerii"], "deux acteurs en tête de narration");
  assert.deepEqual(narrative.actingCharacterIds(L("Narration", "Toutes deux perdent le rythme."), trio), trio, "sujet joint « toutes deux »");
  assert.deepEqual(narrative.actingCharacterIds(L("Narration", "Vous caressez Hylee sans vous presser."), trio), [], "le joueur agit : aucun sprite ne s’élance");
  assert.deepEqual(narrative.actingCharacterIds(L("Narration", "Le silence retombe."), trio), [], "narration sans acteur");
  assert.deepEqual(narrative.actingCharacterIds(L("Hylee", "Oui."), duo), ["hylee"], "solo : le locuteur reste l’acteur");
  assert.ok(pageSource.includes("onVoice={setRhythmActors}"), "le jeu à trois transmet l’acteur de la phase au décor");

  const lengths = Object.fromEntries(Object.keys(charts).map((d) => [d, engine.rhythmChartEnd(d).toFixed(1) + " s"]));
  console.log(`Jeu de rythme OK : ${charts.normal.length} coups par partie, tempos ${prelim.map((x) => x.bpm).join(" → ")} (préliminaires) puis ${positions.map((x) => x.bpm).join(" → ")} puis montée à ${engine.RHYTHM_SECTIONS.at(-1).ramp.toBpm} coups/min, durées ${JSON.stringify(lengths)}, ${sfx.RHYTHM_SFX_FILES.length} bruitages sourcés, musique de fond ${duration ? duration.toFixed(0) + " s" : "présente"}, ${all.length} textes uniques ; combo : paliers ${crossings.slice(0, 5).join(", ")}…, partie parfaite ${perfectVoices.moans} gémissements pour ${perfectVoices.thresholds} paliers et ${perfectVoices.breaths} souffles ; secousse ${a0.toFixed(1)} à ${aTop.toFixed(1)} px ; mixage 4 familles + musique, bruits neutres ${neutralStats.strokes} sons synthétisés sur une partie, aucun bruit corporel enregistré.`);
} finally {
  await server.close();
}
