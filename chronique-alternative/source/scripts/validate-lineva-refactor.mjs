import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const sourceRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = async (file) => readFile(resolve(sourceRoot, file), "utf8");
const [pageSource, gameSource, dateSource, intimacySource, relationSource, housingSource, homeSource, legacyIntimacySource] = await Promise.all([
  source("src/page.tsx"),
  source("src/game-data.ts"),
  source("src/date-scenes.ts"),
  source("src/lineva-date-intimacy.ts"),
  source("src/lineva-relation-beats.ts"),
  source("src/housing-scenes.ts"),
  source("src/home-intimacy-routes.ts"),
  source("src/intimacy-scenes.ts"),
]);

const server = await createServer({ root: sourceRoot, appType: "custom", logLevel: "silent", server: { middlewareMode: true } });
const informal = /(?:^|[\s’'])(?:tu|toi|te|ton|ta|tes)(?=$|[\s.,;:!?…’'])|t[’']/iu;
const linevaSpeech = (lines) => lines.filter((line) => line.speaker === "Lineva");
const choiceLines = (choices) => choices.flatMap((choice) => choice.response);
const sum = (values) => values.reduce((total, value) => total + value, 0);

try {
  const [game, world, dates, intimacy, heritage, cg, contextual, closures, relation, housing, home] = await Promise.all([
    server.ssrLoadModule("/src/game-data.ts"),
    server.ssrLoadModule("/src/world-data.ts"),
    server.ssrLoadModule("/src/date-scenes.ts"),
    server.ssrLoadModule("/src/lineva-date-intimacy.ts"),
    server.ssrLoadModule("/src/heritages-data.ts"),
    server.ssrLoadModule("/src/intimate-cg.ts"),
    server.ssrLoadModule("/src/route-contextual-choices.ts"),
    server.ssrLoadModule("/src/scene-closures.ts"),
    server.ssrLoadModule("/src/lineva-relation-beats.ts"),
    server.ssrLoadModule("/src/housing-scenes.ts"),
    server.ssrLoadModule("/src/home-intimacy-routes.ts"),
  ]);

  // A — Acte I et accès aux rendez-vous sans verrou de désir.
  const routes = game.ROUTE_SCENES.filter((scene) => scene.character === "lineva").sort((a, b) => a.stage - b.stage);
  assert.deepEqual(routes.map((scene) => scene.id), ["lineva-0", "lineva-1", "lineva-2", "lineva-3", "lineva-4"]);
  assert.deepEqual(routes.map((scene) => scene.title), [
    "Le quai qui tient encore",
    "La ligne qui recule",
    "Ceux qu’on remonte",
    "Le fauteuil de l’amiral",
    "Quand les cloches ne s’arrêtent plus",
  ]);
  assert.ok(routes.every((scene) => scene.location === "forthaven" && scene.dayMin === 1 && !scene.intimate), "Lineva doit vivre et commander à Forthaven sans verrou de jour arbitraire");
  assert.ok(routes.every((scene) => scene.intro.length >= 10 && scene.choices.length === 3), "les cinq scènes doivent conserver leur ampleur et trois approches tactiques");
  assert.ok(routes.every((scene) => closures.sceneClosure(scene.id).length >= 2), "chaque scène doit avoir une retombée écrite");
  assert.deepEqual(game.routeHistoryRequirements(routes[0]), ["campaign-lineva-departure"]);
  assert.deepEqual(routes.map((scene) => game.routeStoryRequirement(scene)), [0, 4, 5, 8, 9]);
  assert.ok(routes.every((scene) => game.routeKnowledgeRequirements(scene).length === 0), "les confidences Lineva doivent rester facultatives");
  assert.deepEqual(routes.map((scene) => world.ROUTE_SPOTS[scene.id]), [
    "forthaven-harbor",
    "forthaven-war-room",
    "forthaven-ramparts",
    "forthaven-war-room",
    "forthaven-ramparts",
  ]);
  assert.deepEqual(routes.map((scene) => world.ROUTE_PERIODS[scene.id]), [["aube"], ["matin"], ["apres-midi"], ["matin"], ["apres-midi"]]);
  assert.ok(routes[2].choices.every((choice) => choice.effects.knowledge?.includes("knows_lineva_mother_dead")));
  assert.ok(routes[4].choices.every((choice) => choice.effects.flags?.includes("lineva-act-one-held")));
  assert.ok(routes.flatMap((scene) => scene.choices).every((choice) => !choice.effects.desire && !choice.effects.flags?.includes("lineva-travel")), "le désir doit rester dans le second battement facultatif et Lineva à Forthaven");

  const relationBeats = routes.map((scene) => relation.linevaRelationBeat(scene.id));
  assert.ok(relationBeats.every(Boolean), "un battement relationnel doit suivre chacun des cinq choix tactiques");
  assert.ok(relationBeats.every((beat) => beat.choices.length === 3), "chaque battement relationnel doit offrir flirt franc, proximité et réponse pratique");
  assert.ok(relationBeats.every((beat) => beat.choices.some((choice) => (choice.effects.desire || 0) > 0) && beat.choices.some((choice) => !choice.effects.desire)), "le flirt doit toujours rester facultatif");
  assert.ok(relationBeats.every((beat) => linevaSpeech([...beat.intro, ...choiceLines(beat.choices)]).every((line) => !informal.test(line.text))), "Lineva doit vouvoyer dans les cinq battements");
  assert.match(pageSource, /phase:\s*"relation-intro"/);
  assert.match(pageSource, /phase:\s*"relation-choices"/);
  assert.match(pageSource, /!hasRelationBeat \|\| isRelationChoice/, "le choix tactique ne doit pas clore la route avant le battement relationnel");

  assert.equal(contextual.ROUTE_CONTEXTUAL_CHOICES["lineva-3"].boundary, undefined);
  assert.equal(contextual.ROUTE_CONTEXTUAL_CHOICES["lineva-3"].platonic, undefined);
  assert.equal(contextual.ROUTE_CONTEXTUAL_CHOICES["lineva-4"].boundary, undefined);
  assert.equal(contextual.ROUTE_CONTEXTUAL_CHOICES["lineva-4"].platonic, undefined);
  assert.ok(contextual.ROUTE_CONTEXTUAL_CHOICES["lineva-3"].misread.text.includes("Amirale"));

  const sceneFourText = JSON.stringify(routes[3]);
  assert.doesNotMatch(sceneFourText, /vous (?:déplacez|poussez|tirez)[^\n]{0,60}fauteuil/iu, "le personnage joueur ne doit jamais déplacer le fauteuil");
  assert.match(JSON.stringify(relationBeats[3].intro), /Lineva[^\n]{0,80}pousse elle-même le fauteuil/iu, "Lineva doit disposer elle-même du fauteuil après les officiers");
  assert.deepEqual(routes[3].choices.map((choice) => choice.id), ["l3-l", "l3-a", "l3-s"]);
  assert.doesNotMatch(JSON.stringify(routes[4]), /Elle abandonne la pierre\. Pas vous\./u);

  const linevaDates = dates.DATE_SCENES.filter((date) => date.character === "lineva");
  assert.deepEqual(linevaDates.map((date) => date.title), ["Forthaven à elle", "Une soirée qui ne sert à rien"]);
  assert.ok(linevaDates.every((date) => date.unlockStage === 5 && date.minDesire === 22), "le désir ne doit intervenir qu’après un rendez-vous de palier 5");
  assert.ok(linevaDates.every((date) => date.location === "forthaven" && date.intimacySetting.replaceProfile));
  assert.ok(linevaDates.every((date) => linevaSpeech([...date.intro, ...choiceLines(date.choices)]).every((line) => !informal.test(line.text))), "Lineva doit vouvoyer pendant les rendez-vous");
  assert.doesNotMatch(JSON.stringify(linevaDates[1]), /cuisine ratée|plat brûlé|incapable de cuisiner/iu, "la cuisine médiocre ne doit pas devenir un gimmick");
  const publicGate = pageSource.slice(pageSource.indexOf("function publicDateUnlocked"), pageSource.indexOf("function homeDateUnlocked"));
  assert.doesNotMatch(publicGate, /desire|minDesire/, "l’accès au rendez-vous ne doit pas dépendre du désir");
  assert.match(pageSource, /\["lineva", "allenna"\]\.includes\(date\.character\)/, "les trois décisions de fin doivent être proposées même si l’intimité reste verrouillée");

  // B, C et D — flirt fort, flirt modéré et absence de flirt.
  const strongFlirt = sum(relationBeats.map((beat) => Math.max(...beat.choices.map((choice) => choice.effects.desire || 0))));
  const moderateFlirt = sum(relationBeats.map((beat) => beat.choices[1].effects.desire || 0));
  const noFlirt = sum(relationBeats.map((beat) => beat.choices[2].effects.desire || 0));
  const leastDateDesire = Math.min(...linevaDates.flatMap((date) => date.choices.map((choice) => choice.effects.desire || 0)));
  const mostDateDesire = Math.max(...linevaDates.flatMap((date) => date.choices.map((choice) => choice.effects.desire || 0)));
  assert.ok(strongFlirt + leastDateDesire >= 22, "un flirt fort doit ouvrir l’intimité après le rendez-vous");
  assert.ok(moderateFlirt + leastDateDesire >= 22, "un flirt modéré suivi d’un bon rendez-vous doit ouvrir l’intimité");
  assert.ok(noFlirt + mostDateDesire < 22, "une route sans flirt doit pouvoir rester non sexuelle sans perdre le rendez-vous");
  assert.ok(relationBeats.every((beat) => (beat.choices[2].effects.affection || 0) > 0 && (beat.choices[2].effects.trust || 0) > 0), "la voie non flirt doit construire affection et confiance");

  // E, F et G — pas ce soir, amitié définitive et interruption.
  const endingHandler = pageSource.slice(pageSource.indexOf("function finishDateEnding"), pageSource.indexOf("function startGroupDateIntimacy"));
  assert.match(endingHandler, /if \(permanentlyPlatonic\)/);
  assert.match(endingHandler, /`\$\{date\.character\}-platonic`/);
  assert.doesNotMatch(endingHandler, /affection\s*:|trust\s*:|desire\s*:/, "ni pas ce soir ni l’amitié ne doivent infliger de pénalité statistique");
  assert.match(pageSource, />Pas ce soir</);
  assert.match(pageSource, />Choisir une amitié durable</);
  const closeIntimacy = pageSource.slice(pageSource.indexOf("function closeIntimacy"), pageSource.indexOf("function closeGroupIntimacy"));
  assert.match(closeIntimacy, /if \(completed && !modal\.replay\)[\s\S]*"lineva-tutoiement"/, "le tutoiement doit être enregistré uniquement après une scène achevée");

  // Intimité — dix phases sémantiques, vouvoyer jusqu’au climax, puis premier tu.
  assert.deepEqual(intimacy.validateLinevaDateIntimacy(), { dates: 2, combinations: 6, routes: 18, chapters: 720 });
  const requiredPhases = ["approach", "undressing", "naked-reveal", "partner-discovery", "lineva-discovery", "preliminaries", "intensification", "climax", "afterglow", "ending"];
  for (const date of linevaDates) {
    assert.equal(intimacy.linevaDateApproaches(date.id).length, 3);
    for (const sex of ["femme", "homme", "intersexe"]) {
      const entries = intimacy.linevaDateIntimacyRoutes(date.id, sex);
      assert.equal(entries.length, 3);
      for (const entry of entries) {
        for (const mode of ["tendre", "suggestif", "explicite", "ellipse"]) {
          const chapters = entry.chapters[mode];
          assert.ok(chapters.length >= 8 && chapters.length !== 8, `${entry.id}/${mode}: la longueur ne doit plus être figée à huit`);
          assert.deepEqual(chapters.map((_, index) => intimacy.linevaDateIntimacyPhase(index)), requiredPhases);
        }
        const explicitWords = entry.chapters.explicite.flat().reduce((total, line) => total + line.text.trim().split(/\s+/u).length, 0);
        assert.ok(explicitWords >= 360, `${entry.id}: progression explicite trop courte`);
      }
    }
  }

  const linevaCg = (chapter) => cg.soloIntimateCgState({
    character: "lineva",
    mode: "explicite",
    surface: "route",
    step: "direction-lines",
    chapter,
    narrativePhase: intimacy.linevaDateIntimacyPhase(chapter),
  });
  assert.equal(linevaCg(5), undefined);
  assert.equal(linevaCg(6)?.phase, "reveal");
  assert.equal(linevaCg(7), undefined, "les sprites doivent revenir pendant le climax");
  assert.equal(linevaCg(8)?.phase, "post-orgasm");
  assert.equal(linevaCg(9)?.phase, "post-orgasm");
  assert.equal(cg.soloIntimateCgState({ character: "lineva", mode: "explicite", surface: "route", step: "ending", chapter: 9 })?.phase, "post-orgasm");

  // La première intimité peut aussi venir du logis : mêmes règles de registre.
  for (const sex of ["femme", "homme", "intersexe"]) {
    for (const entry of home.homeIntimacyRoutes("lineva", sex)) {
      for (const mode of ["tendre", "suggestif", "explicite", "ellipse"]) {
        const chapters = entry.chapters[mode];
        assert.ok(linevaSpeech(chapters.slice(0, 4).flat()).every((line) => !informal.test(line.text)), `${entry.id}/${mode}: tutoiement domestique trop précoce`);
        const firstInformal = chapters.findIndex((chapter) => linevaSpeech(chapter).some((line) => informal.test(line.text)));
        if (firstInformal >= 0) {
          const priorNarration = chapters.slice(0, firstInformal + 1).flat().map((line) => line.text).join(" ");
          assert.match(priorNarration, /plaisir|orgasme|joui|abandon/iu, `${entry.id}/${mode}: premier tu avant le plaisir culminant`);
        }
      }
    }
  }
  assert.equal(housing.HOME_DATE_PROFILES.lineva.character, "lineva");
  const homeProfile = housing.HOME_DATE_PROFILES.lineva;
  const homeProfileLines = [
    ...homeProfile.arrival,
    ...Object.values(homeProfile.cityComments),
    ...homeProfile.tierComments,
    ...Object.values(homeProfile.tones).flatMap((tone) => tone.lines),
    ...homeProfile.rounds.flatMap((round) => round.options.flatMap((option) => option.response)),
    ...Object.values(homeProfile.results).flat(),
  ];
  assert.ok(linevaSpeech(homeProfileLines).every((line) => !informal.test(line.text)), "Lineva doit vouvoyer pendant le rendez-vous au logis");

  // H — rendu avec un prénom réel, jamais « protagoniste ».
  const erynnRendered = JSON.stringify([
    ...routes.flatMap((scene) => [...scene.intro, ...choiceLines(scene.choices)]),
    ...linevaDates.flatMap((date) => [...date.intro, ...choiceLines(date.choices)]),
  ]).replaceAll("{player}", "Erynn");
  assert.match(erynnRendered, /Erynn/);
  assert.doesNotMatch(`${pageSource}\n${gameSource}\n${dateSource}\n${housingSource}`, /protagoniste/iu);

  const motherSecret = heritage.SECRET_CONVERSATIONS.find((scene) => scene.id === "secret-lineva-mother");
  assert.deepEqual(motherSecret.reveals, ["knows_lineva_mother_last_hours"]);
  const truthEvent = heritage.SPONTANEOUS_EVENTS.find((scene) => scene.id === "world-lineva-draven-truth");
  assert.equal(truthEvent.minStages.lineva, 5);
  assert.ok(truthEvent.requiresFlags.includes("main-story-act-1-complete"));

  const linevaStart = gameSource.indexOf("// LINEVA");
  const linevaEnd = gameSource.indexOf("// SAIDIN", linevaStart);
  const linevaNarrative = [
    gameSource.slice(linevaStart, linevaEnd),
    dateSource.slice(dateSource.indexOf('id: "date-lineva-ramparts"'), dateSource.indexOf('id: "date-saidin-observatory"')),
    relationSource,
  ].join("\n");
  assert.doesNotMatch(linevaNarrative, /bonne réponse|tu as compris|vous avez compris|lâcher prise|guérir son trauma/iu);
  assert.doesNotMatch(linevaNarrative, /—/u, "les scènes refondues ne doivent pas retomber dans le tic du tiret cadratin");
  assert.doesNotMatch(`${intimacySource}\n${legacyIntimacySource}\n${homeSource}`, /Défaire la garde/u);
  assert.match(pageSource, /linevaDateApproaches\(modal\.dateId\) \|\| allennaDateApproaches\(modal\.dateId\) \|\| profile\.approaches/);
  assert.match(pageSource, /linevaDateIntimacyPhase\(directionChapter\)/);

  console.log("[Lineva V2] scénarios A–H validés · 5 scènes et 5 battements relationnels · 2 rendez-vous · seuil de désir post-rendez-vous · 18 variantes corporelles · 720 chapitres modaux · CG sémantiques · vouvoiement puis premier tu.");
} finally {
  await server.close();
}
