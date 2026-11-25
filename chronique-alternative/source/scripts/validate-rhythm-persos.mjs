// Validateur des fiches personnages du jeu de rythme (lot 0 : socle commun ; lot 1 : Bellirith ; lots 4 à 6 :
// Allenna, Lineva et leur trio avec relais de sommets ; lot 7 : Remerii ; lot 8 : Hylee, prototype réaligné).
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
  const scenes = await server.ssrLoadModule("/src/intimacy-scenes.ts");
  const homes = await server.ssrLoadModule("/src/home-intimacy-routes.ts");
  const groups = await server.ssrLoadModule("/src/group-dates.ts");
  const remeriiScenes = await server.ssrLoadModule("/src/remerii-date-intimacy.ts");
  const hyleeScenes = await server.ssrLoadModule("/src/hylee-date-intimacy.ts");
  const naiahScenes = await server.ssrLoadModule("/src/naiah-date-intimacy.ts");

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
  const bellirithAnchors = anchors.RHYTHM_ANCHORS.filter((anchor) => anchor.character === "bellirith");
  assert.equal(bellirithAnchors.length, 28, "28 variantes de Bellirith");
  let kits = 0;
  const seen = new Set();
  for (const anchor of bellirithAnchors) {
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
  // Vidrik n'est admis que dans la section « Voix de Lineva » (lot 5).
  const withoutLineva = sources.replace(/^## Voix de Lineva[\s\S]*?(?=^## |(?![\s\S]))/m, "");
  for (const banned of ["Jackie", "Calistahhh", "ellenmentor", "SuddenDice", "khenshom", "mariallinas"]) assert.ok(!sources.includes(banned), `SOURCES.md : ${banned} absent`);
  assert.ok(!withoutLineva.includes("Vidrik"), "SOURCES.md : Vidrik seulement pour Lineva");
  assert.equal((pageSource.match(/people\/aarrnnoo\//g) || []).length, 3, "crédits en jeu (À propos, Options, Mode libre)");

  // Intégration : un seul passage de relation par scène, en Chronique seulement, accès développeur.
  assert.match(pageSource, /lifeAdjustRelation\(current, characterId, delta, 0\)/);
  assert.match(pageSource, /result\.quality === "tatonnement" && !result\.auto && !modal\.replay && kit\.profile\.relationPenalty && !rhythmRelationApplied\.current/);
  assert.match(pageSource, /kind: "rythme-perso"/);
  assert.match(pageSource, /data-rythme-route=\{anchor\.routeId\}/);
  assert.match(pageSource, /if \(!rhythmScene && rhythmKit && nextChapter === rhythmKit\.start\)/);

  // ---------- Lots 4 à 6 : Allenna, Lineva, Allenna et Lineva ----------
  const counts = { allenna: 0, lineva: 0, "allenna-lineva": 0, remerii: 0, hylee: 0, "hylee-remerii": 0, naiah: 0 };
  const persoSeen = new Set();
  let relays = 0;
  for (const anchor of anchors.RHYTHM_ANCHORS.filter((entry) => entry.character !== "bellirith")) {
    counts[anchor.character]++;
    const p = profiles.rhythmProfileFor(anchor.character);
    assert.ok(p, `${anchor.character} : fiche`);
    let route;
    let chaptersFor;
    let curseRoute;
    if (anchor.character === "hylee") {
      const home = anchor.context.startsWith("home-");
      route = hyleeScenes.hyleeDateIntimacyRoutes(hyleeScenes.hyleeIntimacyContext(home ? undefined : anchor.context, home), anchor.sex).find((entry) => entry.id === anchor.routeId);
      chaptersFor = (mode) => route.chapters[mode];
    } else if (anchor.character === "remerii") {
      // Remerii : ses propres rendez-vous et son logis écrits (variante « malédiction connue » comprise, mêmes séquences).
      const home = anchor.context.startsWith("home-");
      const context = remeriiScenes.remeriiIntimacyContext(home ? undefined : anchor.context, home);
      route = remeriiScenes.remeriiDateIntimacyRoutes(context, anchor.sex, false).find((entry) => entry.id === anchor.routeId);
      curseRoute = remeriiScenes.remeriiDateIntimacyRoutes(context, anchor.sex, true).find((entry) => entry.id === anchor.routeId);
      assert.ok(curseRoute, `${anchor.routeId} : variante malédiction connue`);
      chaptersFor = (mode) => route.chapters[mode];
    } else if (anchor.character === "naiah") {
      // Naïah : ses deux rendez-vous et son logis écrits (douze séquences en Explicite, huit en Suggestif).
      route = naiahScenes.naiahProximityRoutes(naiahScenes.naiahProximityContext(anchor.context, anchor.context === "home-naiah"), anchor.sex).find((entry) => entry.id === anchor.routeId);
      chaptersFor = (mode) => route.chapters[mode];
    } else if (anchor.character === "allenna-lineva" || anchor.character === "hylee-remerii") {
      route = groups.groupIntimacyRoutes(anchor.context, anchor.sex).find((entry) => entry.id === anchor.routeId);
      chaptersFor = (mode) => route.chapters[mode];
    } else if (anchor.context.startsWith("home-")) {
      route = homes.homeIntimacyRoutes(anchor.character, anchor.sex).find((entry) => entry.id === anchor.routeId);
      chaptersFor = (mode) => route.chapters[mode];
    } else {
      route = scenes.intimacyDirections(anchor.character, anchor.sex, anchor.context).find((entry) => entry.id === anchor.routeId);
      chaptersFor = (mode) => scenes.directionChapters(anchor.character, anchor.routeId, mode, anchor.sex, anchor.context);
    }
    assert.ok(route, `${anchor.routeId} (${anchor.sex}) : route introuvable`);
    for (const mode of ["explicite", "suggestif"]) {
      const phases = mode === "suggestif" && anchor.suggestif ? anchor.suggestif.phases : anchor.phases;
      const returnChapter = mode === "suggestif" && anchor.suggestif ? anchor.suggestif.returnChapter : anchor.returnChapter;
      const nums = phases.map((phase) => phase.chapter);
      nums.forEach((chapter, i) => { if (i) assert.equal(chapter, nums[i - 1] + 1, `${anchor.routeId} ${mode} : séquences contiguës`); });
      assert.equal(returnChapter, nums.at(-1) + 1, `${anchor.routeId} ${mode} : reprise juste après le dernier sommet`);
      if (route.visual && mode === "explicite") assert.ok(nums[0] > route.visual.revealChapter, `${anchor.routeId} : après la révélation`);
      // Hylee et Remerii : l'après-coup écrit se prolonge (chapitre 8 ou 10) ; le dernier sommet joué est celui du joueur.
      if (route.progression && mode === "explicite") assert.equal(nums.at(-1), anchor.character === "hylee-remerii" ? route.progression.playerClimaxChapter.explicite : route.progression.postOrgasmChapter, `${anchor.routeId} : le dernier sommet est celui de l'écrit`);
      const chapters = chaptersFor(mode);
      assert.ok(returnChapter <= chapters.length, `${anchor.routeId} ${mode} : reprise valide`);
      const kit = anchors.buildRhythmKit(anchor, chapters, route.text, mode);
      assert.ok(kit, `${anchor.routeId} ${mode} : le jeu se construit`);
      if (curseRoute) { assert.ok(anchors.buildRhythmKit(anchor, curseRoute.chapters[mode], curseRoute.text, mode), `${anchor.routeId} ${mode} : malédiction connue`); kits++; }
      kits++;
      persoSeen.add(kit.scene.id);
      kit.scene.sections.forEach((section, i) => {
        const written = chapters[phases[i].chapter];
        const shown = [section.intro, ...section.tierLines.flat()];
        assert.equal(shown.length, written.length, `${kit.scene.id} : nombre de répliques`);
        shown.forEach((line, j) => assert.equal(line, written[j], `${kit.scene.id} : réplique recopiée ou réécrite`));
      });
      const wantedRelays = phases.filter((phase) => phase.relay).length;
      for (const difficulty of DIFFICULTIES) {
        const chart = engine.buildRhythmChart(difficulty, kit.sections);
        chart.forEach((note, index) => { if (index) assert.ok(note.time >= chart[index - 1].time, `${kit.scene.id} ${difficulty} : notes ordonnées`); });
        assert.equal(chart.filter((note) => note.kind === "final").length, 1, `${kit.scene.id} : un seul sommet final`);
        assert.equal(chart.filter((note) => note.relay).length, wantedRelays, `${kit.scene.id} : relais de sommets`);
        assert.ok(chart.filter((note) => note.relay).every((note) => note.kind === "hold"), "relais : une tenue");
        assert.equal(chart.at(-1).kind, "final", `${kit.scene.id} : le sommet final clôt la partition`);
        if (difficulty === "normal") relays += chart.filter((note) => note.relay).length;
        const traps = chart.filter(engine.isRhythmTrap);
        const perfect = chart.map(() => 1);
        const ceded = chart.map((note) => (engine.isRhythmTrap(note) ? 3 : 1));
        assert.deepEqual(engine.rhythmScore(perfect, chart), engine.rhythmScore(ceded, chart), `${kit.scene.id} : pièges hors score`);
        assert.equal(engine.rhythmScore(perfect, chart).total, chart.length - traps.length);
        if (anchor.character !== "naiah") assert.ok(!chart.some((note) => note.kind === "bait"), `${kit.scene.id} : aucun leurre (Allenna et Lineva n'en tendent pas)`);
        const duration = engine.rhythmChartEnd(difficulty, kit.sections);
        assert.ok(duration > 15 && duration < 600, `${kit.scene.id} ${difficulty} : durée ${Math.round(duration)} s`);
      }
      const chart = engine.buildRhythmChart("normal", kit.sections);
      if (anchor.character === "allenna" && mode === "explicite") assert.ok(chart.some((note) => note.edge === "bord"), `${kit.scene.id} : l'hésitation d'Allenna (silence au bord)`);
      if (anchor.character === "allenna") assert.ok(!chart.some((note) => note.aura), `${kit.scene.id} : pas d'ordres chez Allenna`);
      if (anchor.character === "lineva" && !anchor.context.startsWith("home-")) assert.ok(chart.some((note) => note.aura), `${kit.scene.id} : les ordres de Lineva`);
      if (anchor.character === "lineva") assert.ok(!chart.some((note) => note.kind === "edge" && note.edge === "bord"), `${kit.scene.id} : Lineva ne s'arrête pas au bord`);
      if (anchor.character === "hylee") assert.ok(!chart.some(engine.isRhythmTrap) && !chart.some((note) => note.aura), `${kit.scene.id} : Hylee (Doux) ne tend aucun piège`);
      if (anchor.character === "remerii") {
        assert.ok(chart.filter(engine.isRhythmTrap).every((note) => note.edge === "gel" && kit.scene.sections[note.section].chapter === 4), `${kit.scene.id} : Remerii ne tend aucun piège (elle mesure), seule la cicatrice fige la piste`);
        assert.equal(kit.sections.at(-1).ramp.final, 5, `${kit.scene.id} : au fond, tenue finale plus longue`);
        assert.ok(!chart.some((note) => note.aura), `${kit.scene.id} : pas d'ordres chez Remerii`);
      }
      if (anchor.character === "naiah") {
        // L'apprentissage : ses illusions (leurres) et ses ombres au bord, jamais d'aura ; aucune pénétration.
        assert.ok(!phases.some((phase) => phase.code === "pv" || phase.code === "pp"), `${kit.scene.id} : jamais de pénétration chez Naïah`);
        if (mode === "explicite") assert.ok(chart.some((note) => note.kind === "bait"), `${kit.scene.id} : ses illusions`);
        assert.ok(!chart.some((note) => note.aura), `${kit.scene.id} : pas d'ordres chez Naïah`);
      }
      if (anchor.character === "hylee-remerii") {
        assert.ok(chart.filter(engine.isRhythmTrap).every((note) => note.edge === "gel"), `${kit.scene.id} : Hylee et Remerii ne tendent aucun piège (seul un regard fige la piste)`);
        assert.ok(!chart.some((note) => note.aura), `${kit.scene.id} : pas d'ordres à trois avec Hylee et Remerii`);
        kit.sections.forEach((def, i) => {
          assert.equal(p.voices[def.voice ?? 0].key, phases[i].voice || "H", `${kit.scene.id} : voix de la phase ${i}`);
          if (def.ramp?.relay) assert.ok(kit.scene.sections[i].relay?.length, `${kit.scene.id} : bulle de relais`);
        });
        if (mode === "explicite") assert.ok(wantedRelays >= 1, `${kit.scene.id} : au moins un relais (le sommet d'une d'elles)`);
      }
      if (anchor.character === "allenna-lineva") {
        // Voix par phase : celle de la personne écrite dans l'ancrage ; les ordres seulement sur les phases de Lineva.
        kit.sections.forEach((def, i) => {
          const key = phases[i].voice || "A";
          assert.equal(p.voices[def.voice ?? 0].key, key, `${kit.scene.id} : voix de la phase ${i}`);
          if (def.aura) assert.equal(key, "L", `${kit.scene.id} : ordre hors d'une phase de Lineva`);
          if (def.bord) assert.equal(key, "A", `${kit.scene.id} : silence au bord hors d'une phase d'Allenna`);
          if (def.ramp?.relay) assert.ok(kit.scene.sections[i].relay?.length, `${kit.scene.id} : bulle de relais`);
        });
      }
    }
  }
  assert.deepEqual(counts, { allenna: 18, lineva: 18, "allenna-lineva": 18, remerii: 18, hylee: 18, "hylee-remerii": 18, naiah: 18 }, "18 variantes par lot");
  assert.equal(persoSeen.size, 252, "un identifiant de jeu par scène, corps et mode (lots 4 à 10)");
  // Lot 10 : Naïah, Normal, violet brumeux, relation 0, sa voix sans gémissement (DarkNightPrincess, CC0).
  const na = profiles.rhythmProfileFor("naiah");
  assert.equal(na.difficulty, "normal"); assert.equal(na.relationPenalty, 0); assert.equal(na.palette.vive, "98,78,130");
  assert.ok(na.behaviours.baits && na.behaviours.bord && !na.behaviours.aura, "Naïah : illusions et ombres, pas d'aura");
  {
    const own = sfx.rhythmSfxFilesFor(na.voice).filter((name) => name.startsWith("naiah/"));
    assert.equal(own.length, 9, "9 extraits pour naiah");
    for (const name of own) {
      assert.ok((await stat(resolve(projectRoot, `assets/audio/rythme/${name}.mp3`))).size > 2000, `${name} : fichier vide`);
      assert.match(sources, new RegExp(`^\\| ${name.replace("/", "\\/")}\\.mp3 \\|.*\\| DarkNightPrincess \\| https://freesound\\.org/people/DarkNightPrincess/sounds/\\d+/ \\| CC0 \\|$`, "m"), `${name} : crédit`);
    }
    assert.equal((pageSource.match(/people\/DarkNightPrincess\//g) || []).length, 3, "crédits en jeu de DarkNightPrincess");
  }
  const nab = await read("src/rhythm-bubbles-naiah.ts");
  assert.ok(!nab.includes("\u2014"), "Naïah : pas de tiret cadratin");
  assert.ok(!/g[ée]mi/i.test(JSON.stringify((await server.ssrLoadModule("/src/rhythm-bubbles-naiah.ts")).NAIAH_RHYTHM_BUBBLES)), "Naïah : jamais un gémissement dans ses bulles");
  // Lot 9 : Hylee et Remerii, Doux, leurs deux voix, relation 0 et -1.
  const hr = profiles.rhythmProfileFor("hylee-remerii");
  assert.equal(hr.difficulty, "doux"); assert.deepEqual(hr.relationPenalties, { hylee: 0, remerii: -1 });
  assert.deepEqual(hr.voices.map((entry) => [entry.key, entry.character, entry.bank.dir]), [["H", "hylee", ""], ["R", "remerii", "remerii"]]);
  assert.ok(!(await read("src/rhythm-bubbles-hylee-remerii.ts")).includes("\u2014"), "Hylee et Remerii : pas de tiret cadratin");
  // Lot 8 : Hylee, Doux, sa voix unique (fichiers à la racine), relation 0, le prototype réaligné.
  const hy = profiles.rhythmProfileFor("hylee");
  assert.equal(hy.difficulty, "doux"); assert.equal(hy.relationPenalty, 0); assert.equal(hy.voice.dir, "");
  assert.ok(anchors.rhythmAnchorFor("hylee", "hylee-home-homme-audacieuse", "homme"), "prototype réaligné : la route du prototype a sa fiche");
  for (const name of sfx.rhythmSfxFilesFor(hy.voice)) assert.ok((await stat(resolve(projectRoot, `assets/audio/rythme/${name}.mp3`))).size > 1000, `${name} : Hylee`);
  assert.ok(!(await read("src/rhythm-bubbles-hylee.ts")).includes("\u2014"), "Hylee : pas de tiret cadratin");
  // Lot 7 : Remerii, Normal, bleu nuit, relation -1, la mesure, la voix retenue dehors, au fond.
  const re = profiles.rhythmProfileFor("remerii");
  assert.equal(re.difficulty, "normal"); assert.equal(re.relationPenalty, -1); assert.equal(re.palette.vive, "58,86,170");
  assert.ok(re.behaviours.mesure && re.behaviours.retenue && re.behaviours.deepHold === 5, "Remerii : mesure, voix retenue, au fond");
  assert.equal(profiles.RHYTHM_VOICES.remerii, "epanody");
  const reb = (await server.ssrLoadModule("/src/rhythm-bubbles-remerii.ts")).REMERII_RHYTHM_BUBBLES;
  assert.ok(reb.mesure.length >= 2, "Remerii : bulles de mesure");
  assert.match(reb.endings.tatonnement.lines[0].text, /insuffisant/i);
  const al = profiles.rhythmProfileFor("allenna");
  const li = profiles.rhythmProfileFor("lineva");
  const trio = profiles.rhythmProfileFor("allenna-lineva");
  assert.equal(al.difficulty, "doux"); assert.equal(al.relationPenalty, 0); assert.equal(al.palette.vive, "96,168,128");
  assert.equal(li.difficulty, "normal"); assert.equal(li.relationPenalty, -1); assert.equal(li.palette.vive, "60,120,200");
  assert.deepEqual(trio.relationPenalties, { allenna: 0, lineva: -1 }, "trio : relation par personne");
  assert.equal(profiles.RHYTHM_VOICES.allenna, "guinefurrie"); assert.equal(profiles.RHYTHM_VOICES.lineva, "Vidrik");
  const alb = (await server.ssrLoadModule("/src/rhythm-bubbles-allenna.ts")).ALLENNA_RHYTHM_BUBBLES;
  const lib = (await server.ssrLoadModule("/src/rhythm-bubbles-lineva.ts")).LINEVA_RHYTHM_BUBBLES;
  const trb = (await server.ssrLoadModule("/src/rhythm-bubbles-allenna-lineva.ts")).ALLENNA_LINEVA_RHYTHM_BUBBLES;
  for (const set of [alb, lib, trb]) for (const quality of ["embrasement", "accord", "tatonnement"]) assert.ok(set.endings[quality].lines.length >= 1, `fin ${quality}`);
  assert.match(alb.endings.tatonnement.lines[0].text, /revanche/i, "Allenna : revanche");
  assert.equal(lib.endings.tatonnement.lines[0].text, "Repos. On reprendra l'exercice.");
  for (const want of ["Plus vite.", "Tenez.", "Maintenant.", "Ne ralentissez pas."]) assert.ok(JSON.stringify(lib).includes(want), `Lineva : « ${want} »`);
  assert.match(lib.autoNote.text, /Pas de démonstration/);
  assert.equal(lib.trapLabels.aura, "Ordre");
  for (const file of ["src/rhythm-bubbles-allenna.ts", "src/rhythm-bubbles-lineva.ts", "src/rhythm-bubbles-allenna-lineva.ts", "src/rhythm-bubbles-remerii.ts"]) assert.ok(!(await read(file)).includes("\u2014"), `${file} : pas de tiret cadratin`);
  // Voix : banques propres, fichiers présents, crédités chacun par sa source ; jamais de voix de Hylee.
  for (const [dir, author, licence, total] of [["allenna", "guinefurrie", "CC BY 4\\.0", 20], ["lineva", "Vidrik", "CC0 1\\.0", 13]]) {
    const own = sfx.rhythmSfxFilesFor(profiles.rhythmProfileFor(dir).voice).filter((name) => name.startsWith(`${dir}/`));
    assert.equal(own.length, total, `${total} extraits pour ${dir}`);
    for (const name of own) {
      const info = await stat(resolve(projectRoot, `assets/audio/rythme/${name}.mp3`));
      assert.ok(info.size > 2000, `${name} : fichier vide`);
      assert.match(sources, new RegExp(`^\\| ${name.replace("/", "\\/")}\\.mp3 \\|.*\\| ${author} \\| https://freesound\\.org/people/${author}/sounds/\\d+/ \\| ${licence} \\|$`, "m"), `${name} : crédit`);
    }
    assert.equal((pageSource.match(new RegExp(`people/${author}/`, "g")) || []).length, 3, `crédits en jeu de ${author}`);
  }
  {
    const own = sfx.rhythmSfxFilesFor(re.voice).filter((name) => name.startsWith("remerii/"));
    assert.equal(own.length, 18, "18 extraits pour remerii");
    for (const name of own) {
      assert.ok((await stat(resolve(projectRoot, `assets/audio/rythme/${name}.mp3`))).size > 2000, `${name} : fichier vide`);
      assert.match(sources, new RegExp(`^\\| ${name.replace("/", "\\/")}\\.mp3 \\|.*\\| epanody \\| https://freesound\\.org/people/deleted_user_1390811/sounds/866\\d\\d/ \\| CC BY 3\\.0 \\|$`, "m"), `${name} : crédit`);
    }
    assert.equal((pageSource.match(/voix de Remerii par epanody/g) || []).length, 3, "crédits en jeu d'epanody");
  }
  assert.match(pageSource, /const rhythmGroupKey = date\.characters\.join\("-"\);\n  const rhythmAnchor = direction \? rhythmAnchorFor\(rhythmGroupKey, direction\.id, game\.player\.sex\)/, "trios branchés dans la scène à trois");
  assert.match(pageSource, /onRelation=\{onRhythmRelation\} \/>;\n/, "relation du trio");

  console.log(`Fiches de rythme OK : ${bellirithAnchors.length} variantes de Bellirith, ${counts.allenna} d'Allenna, ${counts.lineva} de Lineva, ${counts["allenna-lineva"]} à trois (${relays} relais de sommets en Normal), ${counts.remerii} de Remerii, ${counts.hylee} de Hylee, ${counts["hylee-remerii"]} de Hylee et Remerii, ${counts.naiah} de Naïah, ${kits} jeux construits, partition de Hylee inchangée (${hash}), pièges hors score, ${voiceFiles.length} extraits aarrnnoo crédités.`);
} finally {
  await server.close();
}
