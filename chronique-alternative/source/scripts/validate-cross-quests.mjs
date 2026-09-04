import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const server = await createServer({ root, appType: "custom", logLevel: "silent", server: { middlewareMode: true } });
try {
  const [cross, alpha, group] = await Promise.all([server.ssrLoadModule("/src/cross-quests.ts"), server.ssrLoadModule("/src/alpha-hunt.ts"), server.ssrLoadModule("/src/group-dates.ts")]);
  assert.deepEqual(cross.LINEVA_ALLENNA_MILESTONES.filter((entry) => entry.stage !== 1).map((entry) => entry.title), ["Le mauvais allié", "Deux commandantes sur le même quai", "Trente jours à Forthaven", "Le silence", "La ville haute tient", "Le cœur de la ruche", "Après la bataille"]);
  assert.equal(cross.linevaAllennaSeriesUnlocked({ flags: ["main-story-act-1-complete"], history: [], relationships: { lineva: { stage: 5 }, allenna: { stage: 5 } } }), true);
  assert.equal(cross.linevaAllennaSeriesUnlocked({ flags: ["main-story-act-1-complete"], history: [], relationships: { lineva: { stage: 4 }, allenna: { stage: 5 } } }), false);
  assert.equal(cross.LINEVA_ALLENNA_LETTERS.length, 13);
  assert.equal(Math.max(...cross.LINEVA_ALLENNA_LETTERS.map((letter) => letter.dayOffset)), 26);
  assert.equal(new Set(cross.LINEVA_ALLENNA_LETTERS.map((letter) => letter.eventId)).size, 8);
  assert.ok(cross.LINEVA_ALLENNA_LETTERS.some((letter) => !letter.replies));
  assert.ok(cross.LINEVA_ALLENNA_LETTERS.some((letter) => letter.replies?.some((reply) => reply.effects.desire || Object.values(reply.effects.relationshipEffects || {}).some((effect) => effect.desire))));
  assert.deepEqual(cross.LINEVA_ALLENNA_SCENES.map((scene) => scene.stage), [0, 1, 2, 4, 5, 7]);
  for (const scene of cross.LINEVA_ALLENNA_SCENES) {
    assert.ok(scene.intro.length >= 5, `${scene.id}: introduction trop courte`);
    assert.ok(scene.choices.every((choice) => choice.response.length >= 3), `${scene.id}: réponse insuffisamment développée`);
  }
  const crossNarrative = JSON.stringify(cross.LINEVA_ALLENNA_SCENES);
  assert.doesNotMatch(crossNarrative, /\bprotagoniste\b|\bpacte\b/i);
  assert.doesNotMatch(crossNarrative, /Ce n[’']est pas[^.]{0,100}[.;]\s*(?:Mais|C[’'])/i);
  assert.match(crossNarrative, /amitié|amies/i);
  for (const flag of ["cross-la-series-complete", "story-allenna-lineva-met", "cross-la-public-dates-unlocked", "cross-la-world-friendship"]) assert.ok(cross.LINEVA_ALLENNA_FINAL_FLAGS.includes(flag));

  const correspondenceStart = { ...cross.createLinevaAllennaProgress(3), stage: 3, stageStartedDay: 10 };
  const firstDelivery = cross.advanceCrossTimeline(correspondenceStart, 10);
  assert.equal(firstDelivery.stage, 3);
  assert.equal(firstDelivery.letters.length, 1);
  assert.equal(firstDelivery.letters[0].receivedDay, 10);
  assert.equal(cross.nextCrossTimelineDay(firstDelivery, 10), 12);
  const jumpDelivery = cross.advanceCrossTimeline(firstDelivery, 39);
  assert.equal(jumpDelivery.stage, 4);
  assert.equal(jumpDelivery.letters.length, 13);
  assert.equal(new Set(jumpDelivery.letters.map((letter) => letter.id)).size, 13);
  assert.equal(jumpDelivery.letters.at(-1).receivedDay, 36);
  let naturalDelivery = correspondenceStart;
  for (let day = 10; day <= 39; day += 1) naturalDelivery = cross.advanceCrossTimeline(naturalDelivery, day);
  assert.equal(naturalDelivery.stage, 4);
  assert.equal(naturalDelivery.letters.length, 13);

  assert.equal(alpha.alphaSectorName({ row: 0, col: 6 }), "Ville Haute");
  assert.equal(alpha.alphaSectorName({ row: 2, col: 1 }), "Quartier des Ateliers");
  assert.equal(alpha.alphaSectorName({ row: 3, col: 5 }), "Place du Marché");
  assert.equal(alpha.alphaSectorName({ row: 6, col: 2 }), "Vieux Port");
  assert.equal(alpha.alphaSectorName({ row: 5, col: 6 }), "Docks Brisés");
  assert.equal(alpha.alphaCellName({ row: 5, col: 6 }), "Docks Brisés · secteur G6");
  assert.ok(existsSync(resolve(root, "../assets/backgrounds/forthaven-alpha-map.jpg")));
  assert.ok(existsSync(resolve(root, "../assets/audio/alpha-chases.mp3")));

  const linevaIntimacy = readFileSync(resolve(root, "src/lineva-date-intimacy.ts"), "utf8");
  const allennaIntimacy = readFileSync(resolve(root, "src/allenna-date-intimacy.ts"), "utf8");
  const groupDates = readFileSync(resolve(root, "src/group-dates.ts"), "utf8");
  const linevaAllennaGroup = groupDates.slice(groupDates.indexOf('"group-date-allenna-lineva-training": {'), groupDates.indexOf("function contextualLinevaAllennaPair"));
  const protectionLanguage = /\bprotections?\b|\bprotégés?\b|\bprotégées?\b/i;
  for (const intimateText of [linevaIntimacy, allennaIntimacy, linevaAllennaGroup]) {
    assert.doesNotMatch(intimateText, protectionLanguage);
  }
  for (const pairId of ["group-date-allenna-lineva-training", "group-date-allenna-lineva-basin", "group-date-allenna-lineva-home"]) {
    for (const sex of ["femme", "homme", "intersexe"]) {
      const generated = JSON.stringify(group.groupIntimacyRoutes(pairId, sex));
      assert.doesNotMatch(generated, protectionLanguage);
      if (pairId !== "group-date-allenna-lineva-training") assert.doesNotMatch(generated, /distanceent|habitudeent|d’une chiquenaude/);
    }
    const context = group.groupIntimacyContextById(pairId);
    assert.ok(context);
    assert.doesNotMatch(JSON.stringify(group.groupIntimacyEnding(context)), protectionLanguage);
  }

  const shapeSignatures = new Set();
  for (let seed = 1; seed <= 700; seed += 1) {
    const state = alpha.createAlphaHunt(seed);
    assert.equal(alpha.validateAlphaState(state), true);
    assert.equal(state.alpha.length, 4);
    assert.ok(state.alpha.every((cell) => cell.row !== alpha.ALPHA_HIGH_CITY_ROW));
    assert.equal(state.patrols.length, 3);
    const normalized = state.alpha.map((cell) => ({ row: cell.row - Math.min(...state.alpha.map((entry) => entry.row)), col: cell.col - Math.min(...state.alpha.map((entry) => entry.col)) })).sort((a, b) => a.row - b.row || a.col - b.col);
    shapeSignatures.add(JSON.stringify(normalized));
    assert.deepEqual(alpha.retryAlphaHunt(state).alpha, state.alpha);
  }
  assert.ok(shapeSignatures.size >= 7);
  let state = alpha.createAlphaHunt(91);
  for (const target of state.alpha.slice(0, 2)) {
    state = { ...state, duo: { row: Math.max(0, target.row - 1), col: target.col }, phase: "observation" };
    state = alpha.strikeAlphaCell(state, target);
  }
  assert.equal(state.revealed.length, 2);
  assert.equal(state.patrols.filter((patrol) => patrol.id.startsWith("reinforcement")).length, 2);
  const duplicate = alpha.strikeAlphaCell({ ...state, phase: "observation" }, state.alpha[1]);
  assert.equal(duplicate.revealed.length, 2);
  state = { ...state, revealed: [...state.alpha], duo: { row: state.alpha[0].row - 1, col: state.alpha[0].col }, phase: "observation" };
  assert.equal(alpha.alphaAdjacent(state), true);
  assert.equal(alpha.launchAlphaAssault(state).phase, "victory");
  console.log(`[Quêtes croisées] 7 étapes · 13 lettres sur 29 jours · 8 événements · ${shapeSignatures.size} formes Alpha · sauvegarde et reprise validées.`);
} finally {
  await server.close();
}
