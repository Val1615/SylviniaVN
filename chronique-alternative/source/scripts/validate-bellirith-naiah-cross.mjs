import assert from "node:assert/strict";
import { readFile, readdir, access } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

// Série croisée Bellirith / Naïah (§81). Le moteur réel est exercé avec des cellules de hooks.
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const hookId = "\0bn-test-hooks";
const actions = ["game", "dialogue", "modal", "setGame", "setModal", "advanceDialogue", "selectChoice", "closeDialogue", "updateGame", "openDevIntimacy",
  "startBNScene", "startBNMoment", "startBNMinigame", "setBNMinigameState", "finishBNMinigame", "startBNIntimacy", "closeBNIntimacy", "startHNScene", "startHRScene"];
const server = await createServer({ root, appType: "custom", logLevel: "silent", server: { middlewareMode: true }, plugins: [{
  name: "bn-engine-test", enforce: "pre",
  resolveId(id) { if (id === "bn-test-hooks") return hookId; },
  load(id) { if (id === hookId) return `
    let slots = [], cursor = 0;
    export function reset() { slots = []; cursor = 0; }
    export function beginRender() { cursor = 0; }
    export function useState(initial) { const i = cursor++; if (!(i in slots)) slots[i] = typeof initial === 'function' ? initial() : initial; return [slots[i], value => { slots[i] = typeof value === 'function' ? value(slots[i]) : value; }]; }
    export function useRef(current) { return useState({current})[0]; }
    export function useEffect() {} export function useLayoutEffect() {} export function useCallback(callback) { return callback; }
  `; },
  transform(code, id) { if (!id.endsWith("/src/page.tsx")) return;
    return code.replace('from "react";', 'from "bn-test-hooks";')
      .replace('  if (screen === "title") {', `  return { ${actions.join(", ")} };\n  if (screen === "title") {`)
      + '\nexport { createGame, hydrateGame, DEFAULT_PLAYER, choicesForDialogue, evolveCrossQuests };';
  },
}] });

const MODES = ["tendre", "suggestif", "explicite", "ellipse"];
const SEXES = ["femme", "homme", "intersexe"];
const BANNED = /\b(?:chatte|bite|pénis|penis|vagin|vulve|anus|testicules?|clitoris|verge|phallus|couilles?)\b/iu;
const STYLE_DASH = /[—–]/u;
const STYLE_CONTRAST = /n[’']est pas[^!?«»"]{0,80}[,;.:]\s*c[’']est\b|n[’']était pas[^!?«»"]{0,80}[,;.:]\s*c[’']était\b/iu;
const STYLE_REVEAL = /\b(?:ce|c[’'])\s*n[’']est pas[^.!?«»"]{0,60}\bmais\b/iu;
const LABEL = /\basexu\w*|\baromanti\w*|\bace\b/iu;
const PENETRATION = /entre en elle|pénètr|s[’']enfonce en elle|en elle pouce/iu;
const strings = (value, out = []) => {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((entry) => strings(entry, out));
  else if (value && typeof value === "object") Object.values(value).forEach((entry) => strings(entry, out));
  return out;
};
const text = (value) => strings(value).join("\n");
const words = (lines) => lines.reduce((sum, line) => sum + line.text.split(/\s+/u).filter(Boolean).length, 0);
const normalizeSentence = (sentence) => sentence.toLocaleLowerCase("fr").replace(/\{player\}/gu, "player").replace(/[’']/gu, "'").replace(/[«»"“”().,;:!?…·]/gu, " ").replace(/\s+/gu, " ").trim();
const sentencesOf = (value) => strings(value).flatMap((entry) => entry.split(/(?<=[.!?…])\s+|[«»]/u)).map(normalizeSentence).filter((sentence) => sentence.split(" ").filter(Boolean).length >= 8);

try {
  const load = (path) => server.ssrLoadModule(path);
  const [page, hooks, bn, game, scenes, dates, kit, intimacy, ui, sprites, hr, hn] = await Promise.all([
    load("/src/page.tsx"), load("bn-test-hooks"), load("/src/bellirith-naiah-cross-quest.ts"), load("/src/bellirith-naiah-minigame.ts"),
    load("/src/bellirith-naiah-scenes.ts"), load("/src/bellirith-naiah-date.ts"), load("/src/bellirith-naiah-kit.ts"), load("/src/bellirith-naiah-intimacy.ts"),
    load("/src/bellirith-naiah-ui.tsx"), load("/src/intimate-sprite-system.ts"), load("/src/hylee-remerii-cross-quest.ts"), load("/src/hylee-naiah-cross-quest.ts"),
  ]);
  const { renderToStaticMarkup } = await import("react-dom/server"), { createElement } = await import("react");
  const counts = { checks: 0 };
  const ok = (value, message) => { assert.ok(value, message); counts.checks += 1; };

  /* ── 1. Conditions de déblocage ── */
  const fixture = (overrides = {}) => {
    const g = page.createGame({ ...page.DEFAULT_PLAYER, name: "Arbitre", intimacy: overrides.intimacy || "explicite", sex: overrides.sex || "femme" });
    g.flags = ["main-story-act-1-complete"];
    g.settings.noTimeCost = true;
    for (const id of ["naiah", "bellirith"]) g.relationships[id] = { ...g.relationships[id], met: true, stage: 5, affection: 40, trust: 40, desire: id === "naiah" ? 0 : 30 };
    return page.hydrateGame(page.evolveCrossQuests(g));
  };
  const base = fixture();
  ok(base.crossQuestSeries[bn.BN_KEY], "série non débloquée avec toutes les conditions");
  ok(base.journal.some((line) => line === "Quêtes croisées · Bellirith & Naïah · L’anomalie"), "entrée de journal absente");
  const locked = (mutate) => { const g = structuredClone(base); delete g.crossQuestSeries[bn.BN_KEY]; mutate(g); return page.evolveCrossQuests(g).crossQuestSeries[bn.BN_KEY]; };
  ok(!locked((g) => { g.flags = []; }), "débloquée sans l’acte I");
  ok(locked((g) => { g.flags = ["main-story-complete"]; }), "« main-story-complete » doit suffire");
  ok(!locked((g) => { g.relationships.naiah.stage = 4; }), "débloquée avec Naïah à l’étape 4");
  ok(!locked((g) => { g.relationships.bellirith.stage = 4; }), "débloquée avec Bellirith à l’étape 4");
  ok(!locked((g) => { g.relationships.bellirith.met = false; }), "débloquée sans rencontre de Bellirith");
  ok(!locked((g) => { g.relationships.naiah.met = false; }), "débloquée sans rencontre de Naïah");
  assert.equal(bn.bnUnlockChecks(base).length, 4);

  /* ── 2. Sauvegarde et hydratation défensive (v18, sans complétion automatique) ── */
  const old = structuredClone(base); delete old.crossQuestSeries[bn.BN_KEY];
  assert.doesNotThrow(() => page.hydrateGame(old));
  const damaged = structuredClone(base);
  damaged.crossQuestSeries[bn.BN_KEY] = { ...damaged.crossQuestSeries[bn.BN_KEY], stage: 99, bn: { choices: { "cross-bn-01": [1], bogus: ["x"] }, checkpoint: { sceneId: "cross-bn-02", round: 0, picks: 3 }, minigame: { round: "x" }, firstIntimacyDone: "yes" } };
  const repaired = page.hydrateGame(damaged).crossQuestSeries[bn.BN_KEY];
  assert.equal(repaired.stage, bn.BN_FINAL_STAGE, "étape 7 sans rendez-vous final : aucune complétion automatique");
  assert.deepEqual(repaired.bn.choices, {}, "choix fictifs conservés");
  assert.equal(repaired.bn.checkpoint, undefined); assert.equal(repaired.bn.minigame, undefined);
  assert.equal(repaired.bn.firstIntimacyDone, false); assert.equal(repaired.bn.completed, false);
  const noBn = structuredClone(base); delete noBn.crossQuestSeries[bn.BN_KEY].bn;
  assert.deepEqual(page.hydrateGame(noBn).crossQuestSeries[bn.BN_KEY].bn.choices, {});
  ok(true, "hydratation");

  /* ── 3. Mini-jeu : trois réponses, cycle, didacticiel, score non bloquant, anomalie finale ── */
  assert.equal(game.BN_MOVES.length, 3, "exactement trois réponses");
  assert.deepEqual([...game.BN_MOVES].sort(), ["assumer", "retourner", "simuler"]);
  assert.deepEqual(game.BN_BEATS, { simuler: "assumer", retourner: "simuler", assumer: "retourner" }, "cycle incorrect");
  for (const move of game.BN_MOVES) assert.notEqual(game.BN_BEATS[game.BN_BEATS[move]], move);
  assert.equal(game.BN_ROUND_COUNT, 6);
  ok(game.BN_ROUNDS[0].tutorial, "manche d’essai absente");
  assert.equal(game.BN_ANOMALY_ROUND, game.BN_ROUND_COUNT - 1, "la dernière manche doit déclencher l’anomalie");
  assert.equal(game.BN_ROUNDS.filter((round) => round.anomaly).length, 1);
  for (const [index, round] of game.BN_ROUNDS.entries()) {
    for (const move of game.BN_MOVES) ok(round.answers[move]?.lines.length >= 2, `manche ${index} : réponse ${move} absente`);
    if (round.anomaly) { assert.equal(round.expected, undefined); for (const move of game.BN_MOVES) assert.equal(game.bnOutcome(index, move), "suspendue"); }
    else for (const move of game.BN_MOVES) assert.equal(game.bnOutcome(index, move), move === round.expected ? "egalite" : game.BN_BEATS[move] === round.expected ? "naiah" : "bellirith");
  }
  const playAll = (pickFor) => { let s = game.createBNGame(); for (let r = 0; r < game.BN_ROUND_COUNT; r++) { s = game.bnPick(s, pickFor(r)); s = game.bnNext(s); } return game.bnFinish(s); };
  const losing = playAll((r) => game.BN_ROUNDS[r].expected ? game.BN_MOVES.find((m) => game.BN_BEATS[m] !== game.BN_ROUNDS[r].expected && m !== game.BN_ROUNDS[r].expected) : "assumer");
  ok(losing.completed && losing.anomalySeen, "une partie entièrement perdue doit se conclure (score non bloquant)");
  assert.equal(losing.score, 0);
  ok(game.validBNGame(JSON.parse(JSON.stringify(losing))), "partie non sérialisable");
  ok(game.BN_GAME_RELATION_BONUS[game.bnGameResult(losing)], "aucune suite pour une défaite");
  for (const result of ["naiah", "bellirith", "egalite"]) { ok(game.BN_CLOSINGS[result].length, `clôture ${result}`); assert.equal(game.BN_GAME_RELATION_BONUS[result].naiah.desire, undefined, "le mini-jeu augmente le désir de Naïah"); }
  const fmt = (t) => t.replace(/\{player\}/gu, "Arbitre");
  const tutorialMarkup = renderToStaticMarkup(createElement(ui.BNMinigameModal, { state: { ...game.createBNGame(), tutorialSeen: true }, format: fmt, onChange() {}, onClose() {}, onFinish() {} }));
  ok(tutorialMarkup.includes(game.BN_TUTORIAL_HINT), "didacticiel non affiché");
  ok(/aria-modal="true"/.test(tutorialMarkup), "mini-jeu sans rôle de dialogue modal");
  const anomalyMarkup = renderToStaticMarkup(createElement(ui.BNMinigameModal, { state: game.bnGameAtRound(game.BN_ANOMALY_ROUND), format: fmt, onChange() {}, onClose() {}, onFinish() {} }));
  ok(anomalyMarkup.includes("SIGNAL HORS ÉCHELLE") && anomalyMarkup.includes("bn-anomaly"), "manche hors échelle non signalée");
  ok(!/bellirith\/(?:teasing|seductive|smirk)\./u.test(anomalyMarkup), "Bellirith sourit encore pendant la manche hors échelle");
  const pageSource = await readFile(resolve(root, "src/page.tsx"), "utf8");
  ok(/bnDuck \? 0\.15/u.test(pageSource), "la musique n’est pas atténuée pendant la manche hors échelle");
  ok(/\.bn-anomaly \*\{animation:none!important/u.test(await readFile(resolve(root, "src/bellirith-naiah.css"), "utf8")), "l’animation n’est pas coupée pendant l’anomalie");

  /* ── 4. Textes : six étapes, rendez-vous final, Amanea, style ── */
  assert.equal(bn.BN_TITLES.length, 7); assert.equal(bn.BN_STAGE_TOTAL, 7);
  const histories = [
    { choices: {} },
    { choices: {}, firstIntimacyDone: true, limitIntimacyDone: true, simulationIntimacyDone: true, minigame: losing },
    { choices: {}, simulationToldAfter: true },
  ];
  const flagSets = [[], [kit.BN_BELLIRITH_SLEPT, kit.BN_BELLIRITH_FAVORITE], [kit.BN_BELLIRITH_RESISTED]];
  const allScenes = [];
  for (let stage = 0; stage < 7; stage++) {
    const variants = new Set();
    for (const state of histories) for (const flags of flagSets) {
      const scene = bn.bnQuestScene(stage, state, flags); ok(scene, `étape ${stage} absente`);
      assert.equal(scene.id, bn.BN_SCENE_IDS[stage]);
      variants.add(JSON.stringify(scene)); allScenes.push(scene);
    }
    if (stage !== 2) ok(variants.size > 1, `étape ${stage} : aucune variante selon l’histoire avec Bellirith`);
  }
  for (const id of dates.BN_POST_MOMENT_IDS) allScenes.push(dates.bnPostMoment(id));
  allScenes.push(bn.bnSimulationDoorScene());
  ok(allScenes.some((scene) => text(scene).includes("Celle-là, tu la joues.")), "« Celle-là, tu la joues. » absent");
  const castsOf = (value, out = []) => { if (Array.isArray(value)) value.forEach((entry) => castsOf(entry, out)); else if (value && typeof value === "object") { for (const [key, entry] of Object.entries(value)) { if ((key === "cast" || key === "responseCast") && Array.isArray(entry)) out.push(...entry); else castsOf(entry, out); } } return out; };
  for (const scene of allScenes) {
    ok(!castsOf(scene).includes("amanea"), `${scene.id} : Amanea dans la distribution`);
    for (const choice of [scene, ...(scene.beats || [])].flatMap((beat) => beat.choices || [])) {
      assert.equal(choice.effects?.relationshipEffects?.naiah?.desire, undefined, `${choice.id} : désir de Naïah augmenté`);
      ok(!choice.effects?.relationshipEffects?.amanea, `${choice.id} : relation Amanea modifiée`);
      ok(!(choice.effects?.flags || []).some((flag) => /amanea|naiah/iu.test(flag) && !flag.startsWith("cross-bn-")), `${choice.id} : drapeau Amanea/Naïah`);
      if (choice.launchesIntimacy) ok(["cross-bn-02-accept", "cross-bn-04-accept", "cross-bn-05-accept"].includes(choice.id), `${choice.id} : intimité lancée hors d’un accord explicite`);
    }
  }
  // Aucune mention d’Amanea avant la révélation de Q6 (dossier, objectifs, mini-jeu, Q1 à Q5, intro de Q6).
  const beforeReveal = allScenes.filter((scene) => ["cross-bn-01", "cross-bn-02", "cross-bn-03", "cross-bn-04", "cross-bn-05", "cross-bn-05-door"].includes(scene.id));
  for (const scene of beforeReveal) ok(!/Amanea/u.test(text(scene)), `${scene.id} : Amanea nommée avant la révélation`);
  for (const scene of allScenes.filter((entry) => entry.id === "cross-bn-06")) ok(!/Amanea/u.test(text(scene.intro)) && !/Amanea/u.test(text(scene.choices)), "Q6 : Amanea nommée avant le jeton");
  ok(!/Amanea/u.test(text([bn.BN_OBJECTIVES, bn.BN_TITLES, bn.BN_MINIGAME_OBJECTIVE])), "objectifs ou titres citent Amanea");
  ok(!/Amanea/u.test(text([game.BN_ROUNDS, game.BN_GAME_INTRO, game.BN_CLOSINGS, game.BN_ANOMALY_AFTERMATH, game.BN_ANOMALY_DETAIL, game.BN_MOVE_INFO])), "le mini-jeu cite Amanea");
  ok(!/Amanea/u.test(tutorialMarkup + anomalyMarkup), "l’interface du mini-jeu cite Amanea");
  // Rendez-vous final : forme sans nom, trois choix, aucun triomphe, aucune intimité.
  for (const flags of flagSets) {
    const final = bn.bnQuestScene(6, histories[1], flags);
    const formIndex = final.intro.findIndex((line) => line.cast?.includes(kit.BN_FORM));
    ok(formIndex > 0, "la forme n’apparaît jamais");
    ok(!/Amanea/u.test(text(final.intro.slice(0, formIndex))), "Amanea nommée avant la transformation");
    ok(final.intro.slice(formIndex).some((line) => line.music), "la musique ne refroidit pas à la transformation");
    ok(final.intro.slice(formIndex).filter((line) => line.speaker === "Bellirith").every((line) => line.text === "Naïah."), "la forme parle pendant la métamorphose");
    for (const choice of final.choices) {
      const back = choice.response.findIndex((line) => line.cast && !line.cast.includes(kit.BN_FORM));
      ok(back > 0, `${choice.id} : Bellirith ne reprend jamais son visage`);
      ok(choice.response.slice(0, back).some((line) => line.speaker === "Naïah" && line.text === "Regarde-moi."), `${choice.id} : « Regarde-moi. » absent`);
      ok(choice.response.slice(0, back).filter((line) => line.speaker === "Bellirith").every((line) => line.text === "Naïah."), `${choice.id} : la forme dit plus que « Naïah. »`);
      ok(!/je t[’']ai eue|j[’']ai gagné|victoire/iu.test(text(choice.response)), `${choice.id} : Bellirith triomphe`);
    }
    ok(/Allenna/u.test(text(final)), "Allenna n’apparaît pas dans le rendez-vous final");
    const choices = [final, ...final.beats].flatMap((beat) => beat.choices);
    for (const id of Object.values(dates.BN_FINAL_CHOICES)) ok(choices.some((choice) => choice.id === id), `choix final ${id} absent`);
    ok(choices.every((choice) => !choice.launchesIntimacy), "intimité après le rendez-vous final");
    ok(!/je t[’']ai eue|j[’']ai gagné|victoire/iu.test(text([final.intro.slice(formIndex), final.beats])), "Bellirith triomphe");
    ok(!/je te pardonne/iu.test(text(final)), "Naïah pardonne");
  }
  for (const id of dates.BN_POST_MOMENT_IDS) ok([dates.bnPostMoment(id), ...dates.bnPostMoment(id).beats].flatMap((beat) => beat.choices || []).every((choice) => !choice.launchesIntimacy), `${id} : intimité après la série`);

  /* ── 5. Intimités : consentement, modes, exception de pénétration, sprites ── */
  const wordCounts = {};
  const intimacyIds = Object.keys(intimacy.BN_INTIMACY_SCENES);
  assert.deepEqual(intimacyIds.sort(), ["bn-first", "bn-limit", "bn-simulation"]);
  for (const id of intimacyIds) {
    const scene = intimacy.BN_INTIMACY_SCENES[id];
    wordCounts[id] = {};
    ok(MODES.every((mode) => scene.chapters[mode]?.length), `${id} : un mode manque`);
    const opening = intimacy.bnRenderOpening(scene, "femme");
    ok(opening.some((line) => line.speaker === "Naïah" && /assez|brume|Oui|Vas-y|prête|Commence/iu.test(line.text)) || id === "bn-simulation", `${id} : accord de Naïah absent avant la scène`);
    ok(/assez|brume|arrête|arrêter/u.test(text(opening)) || id === "bn-simulation", `${id} : aucun mot d’arrêt posé`);
    assert.equal(Boolean(scene.penetrationException), id === "bn-simulation", `${id} : exception de pénétration mal placée`);
    for (const mode of MODES) {
      const counts = [];
      for (const sex of SEXES) {
        const chapters = intimacy.bnRenderChapters(scene, mode, sex);
        const all = [...intimacy.bnRenderOpening(scene, sex), ...chapters.flat()];
        counts.push(words(all));
        const body = text(all.map((line) => line.text));
        ok(!BANNED.test(body), `${id}/${mode}/${sex} : vocabulaire cru`);
        ok(!PENETRATION.test(body) || (id === "bn-simulation" && mode === "explicite"), `${id}/${mode}/${sex} : pénétration hors de l’exception`);
        ok(all.every((line) => ["Narration", "Bellirith", "Naïah", "{player}"].includes(line.speaker)), `${id} : locuteur inattendu`);
        if (id === "bn-simulation") {
          ok(chapters.length >= 12, `Q5/${mode} : moins de 12 séquences`);
          const twist = chapters.findIndex((chapter) => chapter.some((line) => line.text.includes("Mais tu ne ressens toujours rien !")));
          ok(twist > 0, `Q5/${mode} : chute absente`);
          ok(twist < chapters.length - 1 && chapters[twist + 1].length, `Q5/${mode} : la chute n’est pas suivie d’une précision`);
          ok(chapters.slice(twist).some((chapter) => chapter.some((line) => (line.speaker === "Naïah" && line.mood === "laugh") || /Naïah éclate de rire/u.test(line.text))), `Q5/${mode} : le rire de Naïah manque`);
          ok(chapters.slice(0, twist).flat().some((line) => (line.speaker === "Naïah" && /^Oui\b/u.test(line.text)) || /Naïah dit oui|« Oui\. »/u.test(line.text)), `Q5/${mode} : consentement verbal absent avant la chute`);
          ok(!/elle pense|elle se dit|au fond d[’']elle|elle ressent|elle désire/iu.test(body), `Q5/${mode} : narration intérieure`);
          if (mode === "explicite") {
            const penetration = chapters.findIndex((chapter) => PENETRATION.test(text(chapter.map((line) => line.text))));
            ok(penetration > 0, "Q5 explicite : exception absente");
            ok(chapters.slice(0, penetration).flat().filter((line) => line.speaker === "Naïah" && /^Oui\. Je le dis/u.test(line.text)).length, "Q5 : pénétration sans accord réaffirmé");
            ok(/sans forcer/u.test(text(chapters[penetration].map((line) => line.text))), "Q5 : exception sans retenue");
          }
        }
        // Sprites : uniquement en explicite, après la révélation.
        for (let index = 0; index < chapters.length; index++) {
          const visual = intimacy.bnVisualState(scene, mode, "chapters", index);
          if (mode !== "explicite") ok(!visual.nude && !visual.cg, `${id}/${mode} : visuel nu hors explicite`);
          else if (index < scene.revealChapter) ok(!visual.nude && !visual.cg, `${id} : nu avant la révélation`);
          if (mode === "explicite" && visual.nude) {
            for (const line of chapters[index]) {
              const mood = line.intimateMoods?.bellirith;
              ok(mood && sprites.INTIMATE_SPRITE_MOODS.bellirith.includes(mood), `${id} : humeur intime Bellirith absente au chapitre ${index}`);
            }
          }
          if (mode !== "explicite") ok(chapters[index].every((line) => !line.intimateMoods), `${id}/${mode} : humeurs intimes hors explicite`);
        }
      }
      wordCounts[id][mode] = { min: Math.min(...counts), avg: Math.round(counts.reduce((a, b) => a + b, 0) / counts.length), max: Math.max(...counts) };
    }
  }
  ok(!PENETRATION.test(text(allScenes)), "pénétration évoquée dans une scène de quête");
  for (const mood of sprites.INTIMATE_SPRITE_MOODS.bellirith) await access(resolve(root, "..", sprites.intimateSpritePath("bellirith", mood).replace(/^\/?assets\//u, "assets/")));
  for (const id of intimacyIds) {
    const scene = intimacy.BN_INTIMACY_SCENES[id];
    if (scene.cg) for (const src of [scene.cg.reveal, scene.cg.climax]) await access(resolve(root, "..", `assets/intimacy-cg/${src}.jpg`));
  }

  /* ── 6. Style et unicité ── */
  const corpus = [...strings(allScenes), ...strings([game.BN_ROUNDS, game.BN_GAME_INTRO, game.BN_CLOSINGS, game.BN_ANOMALY_AFTERMATH, game.BN_MOVE_INFO, bn.BN_OBJECTIVES])];
  for (const id of intimacyIds) for (const mode of MODES) for (const sex of SEXES) corpus.push(...intimacy.bnRenderChapters(intimacy.BN_INTIMACY_SCENES[id], mode, sex).flat().map((line) => line.text), ...intimacy.bnRenderOpening(intimacy.BN_INTIMACY_SCENES[id], sex).map((line) => line.text));
  for (const entry of corpus) {
    ok(!STYLE_DASH.test(entry), `tiret cadratin : « ${entry.slice(0, 80)} »`);
    ok(!STYLE_CONTRAST.test(entry) && !STYLE_REVEAL.test(entry), `formule « ce n’est pas X, c’est Y » : « ${entry.slice(0, 80)} »`);
    ok(!BANNED.test(entry), `vocabulaire cru : « ${entry.slice(0, 80)} »`);
    ok(!LABEL.test(entry), `Naïah étiquetée : « ${entry.slice(0, 80)} »`);
  }
  const bnFiles = (await readdir(resolve(root, "src"))).filter((name) => /^bellirith-naiah.*\.tsx?$/u.test(name));
  for (const name of bnFiles) {
    const code = (await readFile(resolve(root, "src", name), "utf8")).replace(/\/\*[\s\S]*?\*\//gu, "").replace(/^\s*\/\/.*$/gmu, "");
    ok(!STYLE_DASH.test(code), `${name} : tiret cadratin`);
    ok(!STYLE_CONTRAST.test(code), `${name} : formule de contraste`);
  }
  // Unicité : aucune phrase de 8 mots ou plus partagée entre deux scènes BN, ni reprise d’une scène Bellirith ou Naïah existante.
  const owners = new Map();
  const own = (owner, value) => { for (const sentence of new Set(sentencesOf(value))) { const set = owners.get(sentence) || new Set(); set.add(owner); owners.set(sentence, set); } };
  const ownerOf = (id) => id.replace(/^cross-bn-0([1-7]).*$/u, "q$1");
  for (const scene of allScenes) own(ownerOf(scene.id), scene);
  own("mini-jeu", [game.BN_ROUNDS, game.BN_GAME_INTRO, game.BN_CLOSINGS, game.BN_ANOMALY_AFTERMATH]);
  for (const id of intimacyIds) for (const mode of MODES) for (const sex of SEXES) own(id, [intimacy.bnRenderOpening(intimacy.BN_INTIMACY_SCENES[id], sex), intimacy.bnRenderChapters(intimacy.BN_INTIMACY_SCENES[id], mode, sex)]);
  const shared = [...owners.entries()].filter(([, set]) => set.size > 1);
  assert.equal(shared.length, 0, `phrases recyclées entre scènes BN : ${shared.slice(0, 3).map(([s, set]) => `« ${s} » (${[...set].join(", ")})`).join(" | ")}`);
  const bnSentences = new Set(owners.keys());
  const others = (await readdir(resolve(root, "src"))).filter((name) => /^(?:bellirith|naiah)-.*\.ts$/u.test(name) && !name.startsWith("bellirith-naiah"));
  let foreign = 0;
  for (const name of others) {
    const code = await readFile(resolve(root, "src", name), "utf8");
    const literals = [...code.matchAll(/"((?:[^"\\\n]|\\.){30,})"/gu)].map((match) => match[1]);
    for (const sentence of new Set(sentencesOf(literals))) { foreign += 1; ok(!bnSentences.has(sentence), `${name} : phrase reprise dans la série BN « ${sentence} »`); }
  }
  counts.uniqueSentences = bnSentences.size; counts.foreignSentences = foreign;

  /* ── 7. Moteur réel : série complète, refus, reprise, relecture ── */
  let api;
  const render = () => { hooks.beginRender(); return api = page.default(); };
  const init = (g) => { hooks.reset(); render().setGame(structuredClone(g)); return render(); };
  const act = (name, ...args) => { api[name](...args); return render(); };
  const save = () => page.hydrateGame(JSON.parse(JSON.stringify(api.game)));
  const progress = () => api.game.crossQuestSeries[bn.BN_KEY];
  function finish(pick = (choices) => choices[0], reload = false) {
    let guard = 0;
    while (api.dialogue) {
      assert.ok(++guard < 1500, "conversation bloquée");
      if (["choices", "relation-choices"].includes(api.dialogue.phase)) {
        const choices = page.choicesForDialogue(api.dialogue, api.game); assert.ok(choices.length);
        act("selectChoice", pick(choices));
        if (reload && !api.dialogue.replay) {
          const sceneId = api.dialogue.scene.id, cast = api.dialogue.scene.cast, saved = save(), relations = structuredClone(api.game.relationships);
          init(saved); act("startBNScene", progress().stage);
          assert.ok(api.dialogue, `${sceneId} : conversation non reprise`);
          assert.equal(api.dialogue.scene.id, sceneId);
          if (cast.includes(kit.BN_FORM)) assert.ok(api.dialogue.scene.cast.includes(kit.BN_FORM), "la forme disparaît à la reprise");
          assert.deepEqual(api.game.relationships, relations, "effets doublés au chargement");
        }
      } else act("advanceDialogue");
    }
  }
  const playMinigame = (pickFor, resumeAt = 1) => {
    assert.equal(api.modal?.kind, "bn-minigame", "mini-jeu non ouvert après Q3");
    for (let r = 0; r < game.BN_ROUND_COUNT; r++) {
      act("setBNMinigameState", game.bnPick(progress().bn.minigame, pickFor(r)));
      if (r === resumeAt) {
        const saved = save(), snapshot = structuredClone(saved.crossQuestSeries[bn.BN_KEY].bn.minigame);
        init(saved); act("startBNScene", bn.BN_MINIGAME_STAGE);
        assert.equal(api.modal?.kind, "bn-minigame", "mini-jeu non repris");
        assert.deepEqual(progress().bn.minigame, snapshot, "partie non reprise à l’identique");
      }
      act("setBNMinigameState", game.bnNext(progress().bn.minigame));
    }
    act("finishBNMinigame", game.bnFinish(progress().bn.minigame));
  };
  const pickBy = (ids) => (choices) => choices.find((choice) => ids.includes(choice.id)) || choices[0];
  const runs = [
    { name: "tout accepter", sex: "femme", picks: ["cross-bn-02-accept", "cross-bn-04-accept", "cross-bn-05-accept", "cross-bn-07-intervene"], complete: true },
    { name: "différer puis refuser", sex: "homme", picks: ["cross-bn-02-later", "cross-bn-04-decline", "cross-bn-05-decline", "cross-bn-07-present"], complete: false },
    { name: "interrompre Q5", sex: "intersexe", picks: ["cross-bn-02-decline", "cross-bn-04-later", "cross-bn-05-accept", "cross-bn-07-naiah"], complete: "interrupt" },
  ];
  let completedSave;
  for (const run of runs) {
    init(fixture({ sex: run.sex }));
    const before = structuredClone(api.game);
    const otherSeries = JSON.stringify(Object.fromEntries(Object.entries(api.game.crossQuestSeries).filter(([key]) => key !== bn.BN_KEY)));
    for (let stage = 0; stage < 7; stage++) {
      act("startBNScene", stage); assert.ok(api.dialogue || api.modal, `${run.name} : étape ${stage} non ouverte`);
      finish(pickBy(run.picks), true);
      if (stage === 1 || stage === 3) {
        const accepted = run.picks.includes(stage === 1 ? "cross-bn-02-accept" : "cross-bn-04-accept");
        const id = stage === 1 ? "bn-first" : "bn-limit";
        if (accepted) { assert.equal(api.modal?.kind, "bn-intimacy", `${run.name} : intimité ${id} non ouverte`); assert.equal(api.modal.id, id); act("closeBNIntimacy", true); }
        else assert.equal(api.modal, null, `${run.name} : intimité ouverte sans accord`);
        if (run.picks.includes(stage === 1 ? "cross-bn-02-later" : "cross-bn-04-later")) {
          ok(bn.bnPendingIntimacies(progress()).includes(id), `${run.name} : intimité différée non proposée`);
          const dossier = renderToStaticMarkup(createElement(ui.BNDossier, { progress: progress(), onScene() {}, onMinigame() {}, onIntimacy() {}, onMoment() {} }));
          ok(/Retrouver Bellirith/u.test(dossier) || dossier.includes(ui.BN_INTIMACY_LABELS[id]), `${run.name} : dossier sans intimité différée`);
          act("startBNIntimacy", id); assert.equal(api.modal?.kind, "bn-intimacy"); act("closeBNIntimacy", true);
          ok(progress().bn[id === "bn-first" ? "firstIntimacyDone" : "limitIntimacyDone"], `${run.name} : intimité différée non enregistrée`);
        }
      }
      if (stage === 2) playMinigame((r) => game.BN_MOVES[r % 3]);
      if (stage === 4) {
        if (run.complete === true) { assert.equal(api.modal?.id, "bn-simulation"); act("closeBNIntimacy", true); ok(api.game.flags.includes(bn.BN_FLAGS.penetrationException), "drapeau d’exception absent"); }
        else if (run.complete === "interrupt") {
          assert.equal(api.modal?.id, "bn-simulation"); act("closeBNIntimacy", false);
          assert.equal(api.dialogue?.scene.id, "cross-bn-05-door", "la scène de la porte ne suit pas l’interruption");
          finish();
          ok(!api.game.flags.includes(bn.BN_FLAGS.penetrationException), "exception enregistrée sans scène vécue");
        } else assert.equal(api.modal, null, "Q5 ouverte après un refus");
      }
      // Toutes les pages du dossier restent sans Amanea et sans intimité après le final.
      const dossier = renderToStaticMarkup(createElement(ui.BNDossier, { progress: progress(), onScene() {}, onMinigame() {}, onIntimacy() {}, onMoment() {} }));
      ok(!/Amanea/u.test(dossier), `${run.name} : dossier cite Amanea à l’étape ${progress().stage}`);
      assert.equal(progress().stage, stage + 1, `${run.name} : étape ${stage} n’avance pas`);
    }
    assert.equal(api.modal, null, "intimité ouverte après le rendez-vous final"); assert.equal(api.dialogue, null);
    ok(progress().bn.completed, `${run.name} : série non accomplie`);
    assert.equal(bn.bnPendingIntimacies(progress()).length, 0, "intimité encore proposée après la série");
    for (const flag of [bn.BN_FLAGS.started, bn.BN_FLAGS.minigameComplete, bn.BN_FLAGS.anomalyDetected, bn.BN_FLAGS.simulationDiscovered, bn.BN_FLAGS.amaneaFormSeen, bn.BN_FLAGS.finalDateComplete, bn.BN_FLAGS.seriesComplete]) ok(api.game.flags.includes(flag), `${run.name} : ${flag} absent`);
    const added = api.game.flags.filter((flag) => !before.flags.includes(flag));
    ok(added.every((flag) => flag.startsWith("cross-bn-") || flag.startsWith("cross-quest") || !/amanea|naiah/iu.test(flag)), `${run.name} : drapeau Amanea/Naïah hors série : ${added.join(", ")}`);
    assert.equal(api.game.relationships.naiah.desire, before.relationships.naiah.desire, `${run.name} : désir de Naïah modifié`);
    assert.deepEqual(api.game.relationships.amanea, before.relationships.amanea, `${run.name} : relation Amanea modifiée`);
    assert.equal(JSON.stringify(Object.fromEntries(Object.entries(api.game.crossQuestSeries).filter(([key]) => key !== bn.BN_KEY))), otherSeries, `${run.name} : autre série modifiée`);
    ok(!/Amanea/u.test(api.game.journal.filter((line) => !before.journal.includes(line)).join("\n")), `${run.name} : le journal écrit qu’Amanea est venue`);
    // Moments libres après la série, puis relecture sans aucun effet.
    for (const id of dates.BN_POST_MOMENT_IDS) { act("startBNMoment", id); assert.equal(api.dialogue?.scene.id, id); finish(); assert.equal(api.modal, null); }
    act("updateGame", (g) => ({ ...g, settings: { ...g.settings, developer: true } }));
    const protectedGame = JSON.stringify(api.game);
    for (let stage = 0; stage < 7; stage++) { act("startBNScene", stage, true); finish(); assert.equal(JSON.stringify(api.game), protectedGame, `${run.name} : relecture ${stage} modifie la partie`); }
    for (const id of dates.BN_POST_MOMENT_IDS) { act("startBNMoment", id); finish(); assert.equal(JSON.stringify(api.game), protectedGame, `${run.name} : moment ${id} récompensé deux fois`); }
    act("startBNMinigame", true); assert.equal(api.modal?.kind, "bn-minigame"); assert.equal(api.modal.replay, true);
    act("setBNMinigameState", game.bnPick(api.modal.state, "assumer")); act("finishBNMinigame", losing);
    assert.equal(JSON.stringify(api.game), protectedGame, `${run.name} : relecture du mini-jeu modifie la partie`);
    for (const id of intimacyIds) {
      act("startBNIntimacy", id, true);
      if (bn.bnIntimacyLived(progress().bn, id)) { assert.equal(api.modal?.replay, true); act("closeBNIntimacy", true); }
      else assert.notEqual(api.modal?.kind, "bn-intimacy", `${run.name} : souvenir d’une intimité jamais vécue`);
      assert.equal(JSON.stringify(api.game), protectedGame, `${run.name} : souvenir intime modifie la partie`);
    }
    // Mode développeur : ouvertures sans mutation.
    for (const target of [{ kind: "bn-scene", stage: 4 }, { kind: "bn-scene", stage: 6 }, { kind: "bn-minigame", round: game.BN_ANOMALY_ROUND }, { kind: "bn-intimacy", id: "bn-simulation", mode: "ellipse" }, { kind: "bn-moment", id: dates.BN_POST_MOMENT_IDS[0] }]) {
      act("openDevIntimacy", target);
      ok(api.dialogue || api.modal, `développeur : ${target.kind} non ouvert`);
      if (api.dialogue) finish();
      if (api.modal?.kind === "bn-intimacy") act("closeBNIntimacy", true);
      if (api.modal?.kind === "bn-minigame") act("finishBNMinigame", losing);
      assert.equal(JSON.stringify(api.game), protectedGame, `développeur : ${target.kind} modifie la partie`);
    }
    if (run.complete === true) completedSave = save();
  }
  // Refus total : aucune intimité, série accomplie quand même, rien à rattraper.
  ok(completedSave.crossQuestSeries[bn.BN_KEY].bn.finalChoice === "intervene", "choix final non enregistré");
  // Bloc développeur : rendu et actions explicites seulement.
  const devMarkup = renderToStaticMarkup(createElement(ui.BNDevBlock, { progress: completedSave.crossQuestSeries[bn.BN_KEY], unlockChecks: bn.bnUnlockChecks(completedSave), actions: new Proxy({}, { get: () => () => {} }) }));
  for (const label of ["Démarrer la série", "Placer à l’étape", "Marquer accomplie", "Effacer la série", "Ouvrir Q5 directement", "Ouvrir le rendez-vous final"]) ok(devMarkup.includes(label), `bloc développeur : « ${label} » absent`);
  ok(MODES.every((mode) => devMarkup.includes(`value="${mode}"`)), "bloc développeur : un mode d’intimité manque");
  // Non-régression : les autres séries gardent leurs clés.
  ok(typeof hr.HR_KEY === "string" && typeof hn.HN_KEY === "string" && hr.HR_KEY !== bn.BN_KEY && hn.HN_KEY !== bn.BN_KEY, "clé de série en collision");

  console.log(`[Bellirith / Naïah] ${counts.checks} contrôles · déblocage 4 conditions · 6 étapes + rendez-vous final · 3 réponses en cycle · didacticiel · anomalie en dernière manche · 3 parcours (accepter, différer/refuser, interrompre Q5) · reprise du mini-jeu · relecture et outils développeur sans effet · ${counts.uniqueSentences} phrases uniques (contre ${counts.foreignSentences} phrases Bellirith/Naïah existantes).`);
  for (const [id, modes] of Object.entries(wordCounts)) console.log(`  ${id} « ${intimacy.BN_INTIMACY_SCENES[id].title} » : ${Object.entries(modes).map(([mode, s]) => `${mode} ${s.min}/${s.avg}/${s.max}`).join(" · ")}`);
} finally { await server.close(); }
