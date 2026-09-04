import assert from "node:assert/strict";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const server = await createServer({ root, appType: "custom", logLevel: "silent", server: { middlewareMode: true } });
try {
  const [cross, alpha] = await Promise.all([server.ssrLoadModule("/src/cross-quests.ts"), server.ssrLoadModule("/src/alpha-hunt.ts")]);
  assert.deepEqual(cross.LINEVA_ALLENNA_MILESTONES.filter((entry) => entry.stage !== 1).map((entry) => entry.title), ["Le mauvais allié", "Deux commandantes sur le même quai", "Trente jours à Forthaven", "Le silence", "La ville haute tient", "Le cœur de la ruche", "Après la bataille"]);
  assert.equal(cross.linevaAllennaSeriesUnlocked({ flags: ["main-story-act-1-complete"], history: [], relationships: { lineva: { stage: 5 }, allenna: { stage: 5 } } }), true);
  assert.equal(cross.linevaAllennaSeriesUnlocked({ flags: ["main-story-act-1-complete"], history: [], relationships: { lineva: { stage: 4 }, allenna: { stage: 5 } } }), false);
  assert.equal(cross.LINEVA_ALLENNA_LETTERS.length, 13);
  assert.equal(Math.max(...cross.LINEVA_ALLENNA_LETTERS.map((letter) => letter.dayOffset)), 26);
  assert.equal(new Set(cross.LINEVA_ALLENNA_LETTERS.map((letter) => letter.eventId)).size, 8);
  assert.ok(cross.LINEVA_ALLENNA_LETTERS.some((letter) => !letter.replies));
  assert.ok(cross.LINEVA_ALLENNA_LETTERS.some((letter) => letter.replies?.some((reply) => reply.effects.desire || Object.values(reply.effects.relationshipEffects || {}).some((effect) => effect.desire))));
  assert.deepEqual(cross.LINEVA_ALLENNA_SCENES.map((scene) => scene.stage), [0, 1, 2, 4, 5, 7]);
  for (const flag of ["cross-la-series-complete", "story-allenna-lineva-met", "cross-la-public-dates-unlocked", "cross-la-world-friendship"]) assert.ok(cross.LINEVA_ALLENNA_FINAL_FLAGS.includes(flag));

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
