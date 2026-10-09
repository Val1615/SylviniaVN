// Désir de Bellirith : il naît quand on lui tient tête, jamais quand on lui cède.
// 1. Inventaire de toutes les sources de désir Bellirith (solo, croisées, groupe, logis, mini-jeu).
// 2. Chaque choix est classé : R (tenir tête), C (céder, obéir, flatter, s’empresser), N (neutre).
//    Un choix C ou N ne donne jamais plus de +1 de désir ; tout choix qui donne du désir est classé.
// 3. Parcours simulés « céder », « mixte », « résister » avant/après, et accessibilité des paliers.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const server = await createServer({
  root, appType: "custom", logLevel: "silent", server: { middlewareMode: true },
  plugins: [{ name: "bellirith-desire-test", enforce: "pre", transform(code, id) {
    if (id.endsWith("/src/page.tsx")) return `${code}\nexport { hydrateGame, createGame, DEFAULT_PLAYER, secretConversationReady, publicDateUnlocked };`;
  } }],
});

/* Classement explicite. Tout ce qui n’est pas listé en R est considéré comme non-résistance (≤ 1). */
const RESIST = new Set([
  // Moments libres
  "bel-ecoute-l", "bel-ecoute-a", "bel-figues-s", "bel-figues-l", "bel-tenue-a", "bel-tenue-s", "bel-marche-l",
  "bel-musicien-r", "bel-musicien-s", "bel-rumeur-s", "bel-valurn-a", "bel-valurn-r", "bel-regard-a", "bel-regard-l", "bel-regard-s",
  "bel-refus-l", "bel-refus-a", "bel-refus-s", "bel-info-l", "bel-info-s", "bel-ennui-s", "bel-defi-l", "bel-defi-s",
  "bel-regles-s", "bel-regles-a", "bel-regles-l", "bel-aura-s", "bel-aura-a", "bel-aura-l", "bel-matin-l", "bel-matin-s",
  "bel-prop-a", "bel-prop-s", "bel-favori-s", "bel-conseil-l",
  // Confidences : insister, refuser le détour
  "sbf20-push-word", "sbf20-push-valurn", "sbb40-push", "sbb40-near", "sbb40-return", "sbs60-push", "sbs60-near", "sbs60-return", "sbg80-push-valurn", "sbg80-push-ring",
  // Lettres et invitation
  "bel-pref-tease", "bel-fav-counter", "bel-fav-dry", "bel-after-no", "bel-end-res-tease", "bel-end-ced-surprise", "bel-end-mix-come", "bel-end-mix-guess",
  "ibm-judge", "ibm-rival",
  // Intrusions (premier regard : aucune option de reddition) et chapitre IX
  "bel-i01-steady", "bel-i01-read", "bel-i01-spark", "bel-i01-aura",
  "bel-i02-resist-calm", "bel-i02-resist-tease", "bel-i02-resist-duty", "bel-i03-resist-calm", "bel-i03-resist-tease", "bel-i03-resist-duty",
  "bel-i04-resist-calm", "bel-i04-resist-tease", "bel-i04-resist-duty", "coalition-protocol", "coalition-friction", "coalition-bellirith",
  // Rendez-vous et sorties à trois
  "dbm-a", "dbm-l", "dbk-l", "dbk-a", "dbk-s", "dbf-cards", "dbf-piano", "dbf-words",
  "gvb-referee", "gvb-third", "gnb-name", "gnb-truth", "gnb-stage",
  // Logis
  "home:amoureux", "home:desir", "home-bellirith-0-a", "home-bellirith-0-l", "home-bellirith-0-s", "home-bellirith-1-l", "home-bellirith-1-s",
  "home-bellirith-2-a", "home-bellirith-2-l", "home-bellirith-3-a", "home-bellirith-3-l",
  // Série Bellirith / Naïah
  "cross-bn-02-vexed", "cross-bn-02-later", "cross-bn-02-decline", "cross-bn-03-score", "cross-bn-03-coach", "cross-bn-03-tease",
  "cross-bn-04-rules", "cross-bn-04-push", "cross-bn-04-later", "cross-bn-04-decline", "cross-bn-05-decline",
  "cross-bn-06-game", "cross-bn-06-careful", "cross-bn-06-warn", "cross-bn-06-ask",
  "cross-bn-after-inn-score", "cross-bn-after-tokens-play", "cross-bn-after-willow-tease", "bn-game:naiah", "bn-game:egalite",
]);
/* Redditions explicites : le parcours « céder » les choisit en priorité. */
const CEDE = new Set([
  "bel-figues-a", "bel-marche-s", "bel-musicien-a", "bel-rumeur-a", "bel-info-a", "bel-ennui-p", "bel-matin-p", "bel-prop-p", "bel-favori-a",
  "sbf20-accept", "sbb40-accept", "sbb40-yield", "sbs60-accept", "sbs60-yield", "sbg80-accept",
  "bel-pref-honest", "bel-after-yes", "bel-end-res-come", "bel-end-ced-soon", "ibm-prize",
  "bel-i02-cede-follow", "bel-i02-cede-dare", "bel-i03-cede-follow", "bel-i03-cede-dare", "bel-i04-cede-follow", "bel-i04-cede-dare", "coalition-follow-bellirith",
  "home-bellirith-1-a", "cross-bn-01-join", "cross-bn-01-bet", "cross-bn-02-accept", "cross-bn-04-accept", "cross-bn-05-accept", "cross-bn-06-list",
  "bn-intimacy:bn-first", "bn-intimacy:bn-limit", "bn-intimacy:bn-simulation",
]);

const flagsOk = (entry, flags) => (entry.requiresFlags || []).every((flag) => flags.includes(flag)) && !(entry.excludesFlags || []).some((flag) => flags.includes(flag));

try {
  const [amb, living, intr, dates, groups, campaign, housing, bnScenes, bnDate, bnGame, bnQuest, page, heritage] = await Promise.all([
    "bellirith-ambient", "bellirith-living-world", "bellirith-intrusions", "date-scenes", "group-dates", "campaign-scenes", "housing-scenes",
    "bellirith-naiah-scenes", "bellirith-naiah-date", "bellirith-naiah-minigame", "bellirith-naiah-cross-quest", "page", "heritages-data",
  ].map((name) => server.ssrLoadModule(`/src/${name}.${name === "page" ? "tsx" : "ts"}`)));

  /* ── 1. Inventaire : une scène = une liste d’options { id, desire[], gate } ── */
  const scenes = [];
  const scene = (system, id, options, extra = {}) => scenes.push({ system, id, options, ...extra });
  const opt = (choice, desire, extra = {}) => ({ id: choice.id, text: choice.text || choice.label || "", desire: [desire || 0], requiresFlags: choice.requiresFlags, excludesFlags: choice.excludesFlags, requires: choice.requires, ...extra });
  for (const entry of amb.BELLIRITH_AMBIENT_LINES) scene("moments libres", entry.id, entry.choices.map((choice) => opt(choice, choice.effects.desire)), { requiresFlags: entry.requiresFlags, excludesFlags: entry.excludesFlags });
  const flatConf = (choices) => choices.flatMap((choice) => [opt(choice, choice.effects.desire), ...(choice.followUp || []).flatMap((follow) => flatConf(follow.choices || []))]);
  for (const secret of living.BELLIRITH_CONFIDENCES) scene("confidences", secret.id, flatConf(secret.choices), { minDesire: secret.minDesire });
  for (const letter of living.BELLIRITH_LETTERS) scene("lettres", letter.id, letter.replies.map((reply) => opt(reply, reply.effects?.desire)), { requiresFlags: letter.requiresFlags, excludesFlags: letter.excludesFlags });
  for (const invitation of living.BELLIRITH_INVITATIONS) scene("invitations", invitation.id, (invitation.choices || []).map((choice) => opt(choice, choice.effects?.desire)));
  const variants = intr.allBellirithIntrusionVariants();
  for (const id of intr.BELLIRITH_INTRUSION_IDS) {
    const byChoice = new Map();
    for (const variant of variants.filter((entry) => entry.id === id)) for (const choice of variant.scene.choices) {
      const current = byChoice.get(choice.id) || opt(choice, 0, { desire: [] });
      current.desire.push(choice.effects.desire || 0);
      byChoice.set(choice.id, current);
    }
    scene("intrusions", `intrusion-${id}`, [...byChoice.values()].map((entry) => ({ ...entry, desire: [...new Set(entry.desire)].sort((a, b) => a - b) })));
  }
  const coalition = campaign.CAMPAIGN_SCENES.find((entry) => entry.id === "campaign-coalition-preparation");
  scene("campagne", coalition.id, coalition.choices.map((choice) => opt(choice, choice.effects.relationshipEffects?.bellirith?.desire)));
  for (const date of dates.DATE_SCENES.filter((entry) => entry.character === "bellirith")) scene("rendez-vous", date.id, date.choices.map((choice) => opt(choice, choice.effects.desire)));
  for (const group of groups.GROUP_DATES.filter((entry) => entry.characters.includes("bellirith"))) {
    scene("sorties à plusieurs", group.id, group.choices.map((choice) => opt(choice, group.characters[0] === "bellirith" ? choice.effects.desire : choice.effects.relationshipEffects?.bellirith?.desire)), { minDesire: group.minDesire, groupGate: true });
  }
  const home = housing.HOME_DATE_PROFILES.bellirith;
  scene("logis", "home-date-bellirith", Object.entries(home.tones).map(([tone, value]) => ({ id: `home:${tone}`, text: value.label, desire: [value.effects.desire || 0] })));
  for (const moment of housing.RESIDENT_MOMENTS.bellirith) scene("logis", moment.id, moment.choices.map((choice) => opt(choice, choice.effects.desire)));
  const bnSeen = new Set();
  const bnChoices = (node, out = []) => {
    for (const choice of node.choices || []) if (!bnSeen.has(choice.id)) { bnSeen.add(choice.id); out.push(opt(choice, choice.effects.desire)); }
    for (const beat of node.beats || []) bnChoices(beat, out);
    for (const branch of Object.values(node.branches || {})) if (branch && typeof branch === "object") bnChoices(branch, out);
    return out;
  };
  for (const data of [...bnScenes.allBNStageScenes(), ...bnDate.allBNDateScenes()]) {
    const options = bnChoices(data);
    if (options.length) scene("série Bellirith / Naïah", data.id, options);
  }
  scene("série Bellirith / Naïah", "bn-minigame", Object.entries(bnGame.BN_GAME_RELATION_BONUS).map(([result, value]) => ({ id: `bn-game:${result}`, text: result, desire: [value.bellirith.desire || 0] })));
  for (const [id, value] of Object.entries(bnQuest.BN_INTIMACY_EFFECTS)) scene("série Bellirith / Naïah", `bn-intimacy-${id}`, [{ id: `bn-intimacy:${id}`, text: id, desire: [value.bellirith.desire || 0] }]);

  const options = scenes.flatMap((entry) => entry.options.map((option) => ({ ...option, system: entry.system, scene: entry.id })));
  const ids = options.map((option) => option.id);
  assert.equal(new Set(ids).size, ids.length, "identifiants d’options uniques");

  /* ── 2. Règle : seule la résistance fait monter le désir ── */
  for (const option of options) {
    const max = Math.max(...option.desire);
    if (RESIST.has(option.id)) continue;
    assert.ok(max <= 1, `${option.scene}/${option.id} (« ${option.text} ») ne tient pas tête à Bellirith et donne +${max} de désir`);
    if (CEDE.has(option.id)) assert.ok(max <= 1, `${option.id} : céder ≤ 1`);
  }
  for (const id of [...RESIST, ...CEDE]) assert.ok(ids.includes(id), `${id} : classement orphelin`);
  for (const variant of variants.filter((entry) => entry.mode === "live" && entry.id !== "01")) {
    for (const choice of variant.scene.choices) {
      if (intr.isBellirithCedeChoice(choice)) assert.ok((choice.effects.desire || 0) <= 1, `${choice.id} : céder ≤ 1`);
      else assert.ok((choice.effects.desire || 0) >= 4, `${choice.id} : résister +4 minimum`);
    }
  }
  for (const entry of scenes.filter((item) => item.options.length > 1)) {
    const resist = entry.options.filter((option) => RESIST.has(option.id));
    if (resist.length) assert.ok(Math.max(...resist.flatMap((option) => option.desire)) >= Math.max(...entry.options.filter((option) => !RESIST.has(option.id)).flatMap((option) => option.desire), 0), `${entry.id} : tenir tête rapporte au moins autant que céder`);
  }

  /* ── 3. Parcours simulés ── */
  const before = JSON.parse(await readFile(resolve(root, "scripts/fixtures/bellirith-desire-before.json"), "utf8"));
  const beforeById = new Map(before.map((entry) => [entry.id, entry.desire]));
  const PATHS = {
    ceder: { flags: ["bellirith-has-slept", "bellirith-favorite", "bellirith-trend:ceded", "campaign-coalition-preparation"], pick: () => "C" },
    mixte: { flags: ["bellirith-has-slept", "bellirith-has-resisted", "bellirith-trend:mixed", "campaign-coalition-preparation"], pick: (index) => index % 2 ? "C" : "R" },
    resister: { flags: ["bellirith-has-resisted", "bellirith-trend:resisted", "campaign-coalition-preparation"], pick: () => "R" },
  };
  const simulate = (pathId, value) => {
    const path = PATHS[pathId];
    let desire = 0;
    const reached = [];
    const choose = (entry, index) => {
      const available = entry.options.filter((option) => flagsOk(option, path.flags));
      if (!available.length) return 0;
      const score = (option) => Math.max(...value(option));
      const resist = available.filter((option) => RESIST.has(option.id));
      const cede = available.filter((option) => !RESIST.has(option.id));
      const pool = path.pick(index) === "R" ? (resist.length ? resist : available) : (cede.length ? cede : available);
      const preferred = path.pick(index) === "C" ? pool.filter((option) => CEDE.has(option.id)) : [];
      const final = preferred.length ? preferred : pool;
      return path.pick(index) === "R" ? Math.max(...final.map(score)) : (preferred.length ? Math.max(...final.map(score)) : Math.min(...final.map(score)));
    };
    const free = scenes.filter((entry) => entry.minDesire === undefined && flagsOk(entry, path.flags));
    free.forEach((entry, index) => { const gain = choose(entry, index); desire += gain; if (process.env.DEBUG_DESIRE === pathId && gain) console.log(`    ${pathId} ${entry.id} +${gain}`); });
    for (const entry of scenes.filter((item) => item.minDesire !== undefined).sort((a, b) => a.minDesire - b.minDesire)) {
      if (desire >= entry.minDesire) { reached.push(`${entry.id}@${entry.minDesire}`); desire += choose(entry, reached.length); }
    }
    return { desire, reached };
  };
  const afterValue = (option) => option.desire;
  const beforeValue = (option) => beforeById.get(option.id) || [0];
  const results = Object.fromEntries(Object.keys(PATHS).map((pathId) => [pathId, { avant: simulate(pathId, beforeValue), apres: simulate(pathId, afterValue) }]));

  // Le joueur qui résiste atteint toutes les confidences et les sorties à plusieurs.
  const gated = scenes.filter((entry) => entry.minDesire !== undefined).map((entry) => `${entry.id}@${entry.minDesire}`);
  assert.deepEqual(results.resister.apres.reached.sort(), [...gated].sort(), "résister ouvre tous les paliers de désir (20/40/60/80 + sorties)");
  assert.ok(results.mixte.apres.reached.some((entry) => entry.startsWith("secret-bellirith-father")), "le parcours mixte ouvre au moins la première confidence");
  assert.ok(results.ceder.apres.desire < results.resister.apres.desire / 3, "céder rapporte bien moins de désir que résister");
  assert.ok(results.ceder.apres.desire < results.ceder.avant.desire, "céder rapporte moins qu’avant le rééquilibrage");

  // Les vraies conditions du jeu : confidences au bon palier, rien de principal ne dépend du désir.
  const base = page.hydrateGame(page.createGame({ ...page.DEFAULT_PLAYER, name: "Test" }));
  const confidences = heritage.SECRET_CONVERSATIONS.filter((secret) => secret.character === "bellirith");
  confidences.forEach((secret, index) => {
    const game = (desire) => ({ ...base, day: 90, secretHistory: confidences.slice(0, index).map((entry) => entry.id), knowledge: [...base.knowledge, ...(secret.requiresKnowledge || [])],
      relationships: { ...base.relationships, bellirith: { ...base.relationships.bellirith, met: true, stage: 5, affection: 0, trust: 0, desire } } });
    assert.equal(page.secretConversationReady(secret, game(results.resister.apres.desire), false), true, `${secret.id} : accessible au parcours résistant`);
  });
  const atStage5 = { ...base, day: 90, relationships: { ...base.relationships, bellirith: { ...base.relationships.bellirith, met: true, stage: 5, affection: 99, trust: 99, desire: 0 } } };
  for (const date of dates.DATE_SCENES.filter((entry) => entry.character === "bellirith")) {
    assert.equal(date.minDesire, undefined, `${date.id} : aucun palier de désir`);
    assert.equal(page.publicDateUnlocked(atStage5, date), true, `${date.id} (dont le duel de fin d’Acte) ouvert sans désir`);
  }
  const pageSource = await readFile(resolve(root, "src/page.tsx"), "utf8");
  assert.ok(pageSource.includes('date?.character === "bellirith"'), "l’intimité des rendez-vous Bellirith ne dépend pas du désir");
  assert.equal(bnQuest.bnUnlocked({ flags: ["main-story-act-1-complete"], relationships: { naiah: { stage: 5, met: true }, bellirith: { stage: 5, met: true, desire: 0 } } }), true, "la série Bellirith / Naïah ne dépend pas du désir");
  assert.equal(intr.bellirithFilStage({ flags: ["bellirith-intrusion-01:seen", "bellirith-intrusion-02:accepted", "bellirith-intrusion-03:accepted", "bellirith-intrusion-04:accepted"].map((flag) => flag), history: ["campaign-coalition-preparation"] }) >= 0, true);

  /* ── 4. Rapport ── */
  const bySystem = {};
  for (const option of options) {
    const row = bySystem[option.system] ||= { options: 0, changed: 0, before: 0, after: 0 };
    const was = beforeValue(option), now = afterValue(option);
    row.options += 1;
    row.before += Math.max(...was);
    row.after += Math.max(...now);
    if (was.join("/") !== now.join("/")) row.changed += 1;
  }
  console.log("Désir de Bellirith : système | options | modifiées | Σ max avant → après");
  for (const [system, row] of Object.entries(bySystem)) console.log(`  ${system} | ${row.options} | ${row.changed} | ${row.before} → ${row.after}`);
  console.log("Parcours (désir cumulé, première visite de chaque scène) :");
  for (const [pathId, row] of Object.entries(results)) console.log(`  ${pathId} : avant ${row.avant.desire} (${row.avant.reached.length}/${gated.length} paliers) → après ${row.apres.desire} (${row.apres.reached.length}/${gated.length} paliers : ${row.apres.reached.join(", ") || "aucun"})`);
  console.log(`Validation désir Bellirith OK : ${options.length} options, ${options.filter((option) => RESIST.has(option.id)).length} « tenir tête », ${options.filter((option) => CEDE.has(option.id)).length} « céder ».`);
} finally {
  await server.close();
}
