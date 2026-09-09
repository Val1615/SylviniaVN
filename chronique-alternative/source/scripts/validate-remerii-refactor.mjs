import assert from "node:assert/strict";
import { access, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

// Les actions réelles du moteur sont exécutées. Seuls les hooks React sont
// remplacés pour observer les changements d'état sans simuler un navigateur.
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const hookId = "\0remerii-test-hooks";
const hooksSource = `
let slots = [], cursor = 0;
export function reset() { slots = []; cursor = 0; }
export function beginRender() { cursor = 0; }
export function useState(initial) {
  const index = cursor++;
  if (!(index in slots)) slots[index] = typeof initial === 'function' ? initial() : initial;
  return [slots[index], value => { slots[index] = typeof value === 'function' ? value(slots[index]) : value; }];
}
export function useRef(current) { return useState({ current })[0]; }
export function useEffect() {}
export function useCallback(callback) { return callback; }
`;
const exports = ["createGame", "hydrateGame", "DEFAULT_PLAYER", "routeNarrativeReady", "routeAvailableAtPlace", "routeNarrativeObjective", "secretConversationReady", "publicDateUnlocked", "homeDateUnlocked", "characterPlace", "choicesForDialogue", "dialogueSpriteMoods", "sceneFor", "chooseSocialScene", "spontaneousEventReady"];
const actions = ["game", "dialogue", "modal", "setGame", "setDialogue", "setModal", "openCharacterScene", "advanceDialogue", "selectChoice", "closeDialogue", "startDate", "finishDateEnding", "startDateIntimacy", "startHomeDate", "finishHomeDate", "startHomeIntimacy", "closeIntimacy", "replayRoute", "replayDate", "replaySecret"];
const server = await createServer({
  root, appType: "custom", logLevel: "silent", server: { middlewareMode: true },
  plugins: [{
    name: "remerii-engine-tests", enforce: "pre",
    resolveId(id) { if (id === "remerii-test-hooks") return hookId; },
    load(id) { if (id === hookId) return hooksSource; },
    transform(code, id) {
      if (!id.endsWith("/src/page.tsx")) return;
      assert.ok(code.includes('  if (screen === "title") {'));
      return code.replace('from "react";', 'from "remerii-test-hooks";')
        .replace('  if (screen === "title") {', `  return { ${actions.join(", ")} };\n  if (screen === "title") {`)
        + `\nexport { ${exports.join(", ")} };`;
    },
  }],
});

try {
  const page = await server.ssrLoadModule("/src/page.tsx");
  const hooks = await server.ssrLoadModule("remerii-test-hooks");
  const data = await server.ssrLoadModule("/src/game-data.ts");
  const world = await server.ssrLoadModule("/src/world-data.ts");
  const story = await server.ssrLoadModule("/src/story-data.ts");
  const relation = await server.ssrLoadModule("/src/remerii-relation.ts");
  const secrets = await server.ssrLoadModule("/src/remerii-confidences.ts");
  const dates = await server.ssrLoadModule("/src/remerii-dates.ts");
  const home = await server.ssrLoadModule("/src/remerii-home-date.ts");
  const ambient = await server.ssrLoadModule("/src/remerii-ambient.ts");
  const living = await server.ssrLoadModule("/src/remerii-living-world.ts");
  const housing = await server.ssrLoadModule("/src/housing-data.ts");
  const social = await server.ssrLoadModule("/src/social-scenes.ts");
  const sprites = await server.ssrLoadModule("/src/sprite-system.ts");
  const closures = await server.ssrLoadModule("/src/scene-closures.ts");
  const remerii = data.CHARACTERS.find(c => c.id === "remerii");
  const routes = relation.REMERII_ROUTES;
  let api;
  const render = () => { hooks.beginRender(); return api = page.default(); };
  const init = game => { hooks.reset(); render().setGame(structuredClone(game)); return render(); };
  const act = (name, ...args) => { api[name](...args); return render(); };
  const campaignGame = (stage = 0, chapters = 4) => {
    const game = page.createGame({ ...page.DEFAULT_PLAYER, name: "Test", intimacy: "tendre" });
    game.history = [...story.MAIN_STORY.slice(0, chapters).flatMap(c => c.requiredScenes), ...routes.slice(0, stage).map(r => r.id)];
    game.flags = [...game.history, "hylee-itinerary-start:1", "story-saidin-met", "story-phoenix-token", "story-route-algratal"];
    for (const id of ["hylee", "remerii", "saidin"]) game.relationships[id] = { ...game.relationships[id], met: true, affection: 90, trust: 90, desire: 0 };
    game.relationships.remerii.stage = stage;
    return game;
  };
  const tick = picker => {
    if (["choices", "relation-choices"].includes(api.dialogue.phase)) {
      const choices = page.choicesForDialogue(api.dialogue, api.game);
      assert.ok(choices.length, `choix absents : ${api.dialogue.scene.id}`);
      act("selectChoice", picker ? picker(choices, api.dialogue) : choices[0]);
      return 1;
    }
    act("advanceDialogue"); return 0;
  };
  const finish = (picker, sceneId) => {
    let steps = 0, count = 0;
    while (api.dialogue && (!sceneId || api.dialogue.scene.id === sceneId)) {
      assert.ok(++steps < 600, "dialogue bloqué"); count += tick(picker);
    }
    return count;
  };
  const roundTrip = game => page.hydrateGame(JSON.parse(JSON.stringify(game)));

  assert.equal(routes.length, 5);
  assert.equal(secrets.REMERII_CONFIDENCES.length, 5);
  assert.equal(dates.REMERII_DATES.length, 2);
  assert.equal(home.REMERII_HOME_DATE.rounds.length, 3);
  assert.equal(ambient.REMERII_AMBIENT_LINES.length, 15);
  assert.equal(home.REMERII_RESIDENT_MOMENTS.length, 4);
  assert.equal(page.routeNarrativeReady(routes[0], campaignGame()), false, "Hylee doit passer avant Remerii");
  for (const route of routes) {
    assert.equal(route.dayMin, 1);
    assert.equal(Boolean(route.intimate), false);
    assert.deepEqual(data.routeKnowledgeRequirements(route), []);
    assert.deepEqual(closures.sceneClosure(route.id), []);
    assert.doesNotMatch(JSON.stringify(route), /embrass|baiser|résonance harmonise/i);
  }

  // 3 réponses d'audience × 3 fins d'Hylee : le raccord n'écrase pas le
  // premier choix et n'avance jamais l'heure, même après sérialisation.
  let connections = 0;
  for (const first of ["hy0-return", "hy0-account", "hy0-limits"]) for (const last of ["hyb0-fontaine", "hyb0-flirt", "hyb0-partage"]) {
    const game = campaignGame(0, 3);
    game.day = 2; game.period = 2; game.location = "algratal"; game.spot = "algratal-streets";
    init(game); act("openCharacterScene", "hylee");
    assert.equal(api.dialogue.scene.id, "hylee-0");
    finish((choices, d) => choices.find(c => c.id === (d.phase === "choices" ? first : last)), "hylee-0");
    assert.equal(api.dialogue.scene.id, "remerii-0");
    assert.deepEqual([api.game.day, api.game.period, api.game.location, api.game.spot], [2, 2, "algratal", "algratal-streets"]);
    assert.ok(api.game.flags.includes(`hylee-return-choice:${first}:${last}`));
    assert.ok(api.dialogue.scene.cast.includes("hylee"));
    assert.equal(api.game.relationships.hylee.stage, 1);
    const resumed = roundTrip(api.game);
    assert.ok(resumed.flags.includes(`hylee-return-choice:${first}:${last}`));
    finish(choices => choices[connections++ % choices.length]);
    assert.equal(api.game.relationships.remerii.stage, 1);
    assert.equal(api.game.history.filter(id => id === "remerii-0").length, 1);
    assert.equal(api.game.period, 3, "une seule période pour la conversation complète");
  }

  // Rattrapage : ancien stage Hylee conservé sans choix inventé.
  const legacy = campaignGame(); legacy.relationships.hylee.stage = 1;
  legacy.location = "algratal"; legacy.spot = "algratal-streets";
  init(legacy); act("openCharacterScene", "remerii");
  assert.equal(api.dialogue.scene.id, "remerii-0");
  assert.ok(api.dialogue.lines.some(l => l.text.includes("Ce souvenir reprend")));
  finish(); assert.equal(api.game.relationships.remerii.stage, 1);

  let routeBranches = 0;
  for (const route of routes.slice(1)) for (const choice of route.choices) {
    const game = campaignGame(route.stage);
    game.relationships.hylee.stage = 1; game.history.push("hylee-0");
    game.location = route.location; game.spot = world.ROUTE_SPOTS[route.id]; game.period = 2;
    const tooEarly = campaignGame(route.stage - 1);
    assert.equal(page.routeNarrativeReady(route, tooEarly), false);
    init(game); assert.equal(page.routeAvailableAtPlace(route, game), true);
    act("openCharacterScene", "remerii"); assert.equal(api.dialogue.scene.id, route.id);
    assert.equal(finish(choices => choices.find(c => c.id === choice.id)), 1);
    assert.equal(api.game.relationships.remerii.stage, route.stage + 1);
    assert.equal(api.game.history.filter(id => id === route.id).length, 1);
    assert.equal(api.game.knowledge.length, 0, "le fil ne révèle aucun passé à l'insu du joueur");
    const restored = roundTrip(api.game);
    assert.equal(restored.relationships.remerii.stage, route.stage + 1);
    init(restored); act("openCharacterScene", "remerii");
    assert.notEqual(api.dialogue?.scene.id, route.id, "une scène validée ne reste pas disponible");
    if (route.stage === 4) {
      assert.equal(page.sceneFor("remerii", 5), undefined);
      assert.equal(page.routeAvailableAtPlace(undefined, restored), false);
      assert.equal(restored.inventory["keepsake-remerii"], 1);
    }
    routeBranches++;
  }
  for (const secret of secrets.REMERII_CONFIDENCES) {
    const game = campaignGame(); game.knowledge = secret.requiresKnowledge || [];
    game.location = "miraldas"; game.spot = secret.spots[0];
    assert.equal(page.secretConversationReady(secret, game), true, secret.id);
    game.spot = "miraldas-dome";
    assert.equal(page.secretConversationReady(secret, game), false, `${secret.id}: une confidence privée ne se joue pas sur la place`);
    game.spot = secret.spots[0];
    game.relationships.remerii.trust = secret.minTrust - 1;
    assert.equal(page.secretConversationReady(secret, game), false, `${secret.id}: confiance insuffisante`);
  }
  const unknown = relation.remeriiRouteVariant(routes[3], [], []);
  const known = relation.remeriiRouteVariant(routes[3], ["knows_remerii_curse"], []);
  assert.notDeepEqual(unknown.intro, known.intro);
  assert.doesNotMatch(JSON.stringify(unknown), /lame maudite|cicatrice|malédiction|agresseur/iu);

  // Les souvenirs rejouent le texte actuel sans gain, nouvel horaire,
  // changement de choix antérieur ou résolution du triangle.
  const completed = campaignGame(5); completed.relationships.hylee.stage = 1; completed.history.push("hylee-0");
  for (const id of ["hylee-0", ...routes.map(r => r.id)]) {
    init(completed); const before = JSON.stringify(api.game);
    act("replayRoute", id); finish(); assert.equal(JSON.stringify(api.game), before, `relecture : ${id}`);
  }
  const oldDate = structuredClone(completed);
  oldDate.dateHistory = ["date-remerii-music"];
  oldDate.flags.push("date-intimate:date-remerii-music");
  oldDate.sceneMemories["date-remerii-music"] = "algratal-music-room";
  oldDate.knowledge = ["knows_remerii_curse"];
  const migrated = roundTrip(oldDate);
  assert.ok(migrated.dateHistory.includes("date-remerii-lanterns"));
  assert.equal(migrated.sceneMemories["date-remerii-lanterns"], "miraldas-lanterns");
  assert.ok(migrated.flags.includes("remerii-intimacy-lived"));
  assert.deepEqual(roundTrip(migrated), migrated, "migration idempotente");
  assert.deepEqual(migrated.knowledge, oldDate.knowledge);

  let datePaths = 0;
  for (const date of dates.REMERII_DATES) {
    const game = structuredClone(completed);
    game.day = 2; game.location = "algratal"; game.spot = "algratal-streets";
    assert.equal(page.publicDateUnlocked(game, date), true, "aucun désir ni présence requis");
    const locked = structuredClone(game); locked.relationships.remerii.stage = 4;
    assert.equal(page.publicDateUnlocked(locked, date), false);
    for (const field of ["affection", "trust"]) {
      const low = structuredClone(game); low.relationships.remerii[field] = (field === "trust" ? date.minTrust : date.minAffection) - 1;
      assert.equal(page.publicDateUnlocked(low, date), false);
    }
    for (let first = 0; first < 2; first++) for (let middle = 0; middle < 3; middle++) for (let end = 0; end < 2; end++) {
      init(game); act("startDate", date.id);
      const when = api.game.day;
      const scheduled = page.characterPlace(remerii, when, api.game.period, api.game.flags, api.game.housing);
      assert.notEqual(scheduled.spot, date.spot, "le cas de test doit couvrir une invitée absente du lieu");
      let index = 0; const picks = [first, middle, end];
      assert.equal(finish(choices => choices[picks[index++]]), 3);
      assert.equal(api.modal.kind, "date-result");
      assert.equal(api.game.dateHistory.filter(id => id === date.id).length, 1);
      assert.equal(api.game.day, when);
      act("startDateIntimacy", date.id); assert.notEqual(api.modal.kind, "intimacy", "désir insuffisant");
      act("finishDateEnding", date.id, true);
      assert.equal(page.publicDateUnlocked(api.game, date), true);
      assert.ok(!api.game.flags.some(f => f.endsWith("-platonic")));
      datePaths++;
    }
    game.relationships.remerii.desire = 24;
    init(game); act("startDate", date.id); finish(); act("startDateIntimacy", date.id);
    assert.equal(api.modal.kind, "intimacy");
    act("closeIntimacy", true);
    assert.ok(api.game.flags.includes("remerii-intimacy-lived"));
    assert.ok(!api.game.flags.some(f => f.startsWith("hr-resolution")));
    const beforeReplay = JSON.stringify(api.game);
    act("replayDate", date.id); finish(); assert.equal(JSON.stringify(api.game), beforeReplay);
  }

  // La visite au logis est planifiée même si Remerii voyage ailleurs ;
  // une faible note ou un ton amical ne verrouille jamais la relation.
  let homePaths = 0;
  for (const property of housing.HOUSING_PROPERTIES) for (const tone of ["amical", "amoureux", "desir"]) {
    const game = structuredClone(completed); game.housing.propertyId = property.id; game.relationships.remerii.desire = 24;
    game.day = 2; game.location = "algratal"; game.spot = "algratal-streets";
    init(game); assert.equal(page.homeDateUnlocked(game, "remerii"), true);
    act("startHomeDate", "remerii"); assert.equal(api.modal.kind, "home-date");
    assert.deepEqual([api.game.day, api.game.period, api.game.spot], [3, 3, property.spot]);
    act("finishHomeDate", "remerii", tone, 0);
    assert.equal(api.game.day, 3, "pas de second saut de jour en terminant le logis");
    assert.ok(api.game.housing.homeDateHistory.includes(`remerii:${tone}@3`));
    assert.equal(api.game.inventory["homegift-remerii"], 1);
    assert.equal(api.modal.kind === "home-date-result", tone === "desir");
    assert.ok(!api.game.flags.includes("remerii-platonic"));
    homePaths++;
  }
  for (const field of ["stage", "affection", "trust", "desire"]) {
    const game = structuredClone(completed); game.housing.propertyId = housing.HOUSING_PROPERTIES[0].id;
    const property = housing.HOUSING_PROPERTIES[0]; game.location = property.location; game.spot = property.spot;
    game.housing.homeDateHistory = [`remerii:desir@${game.day}`]; game.relationships.remerii.desire = 30;
    game.relationships.remerii[field] = { stage: 4, affection: 33, trust: 31, desire: 23 }[field];
    init(game); act("startHomeIntimacy", "remerii"); assert.notEqual(api.modal?.kind, "intimacy", `logis : ${field} insuffisant`);
  }

  const hrStart = social.SOCIAL_SCENES.find(s => s.id === "hr-remerii-truth");
  assert.equal(hrStart.minStages.remerii, 5);
  assert.ok(hrStart.requiresFlags.includes("remerii-intimacy-lived"));

  // Chaque événement possède au moins un créneau réellement jouable.
  for (const event of living.REMERII_WORLD_EVENTS) {
    let reachable = false;
    for (let day = 1; day <= 38 && !reachable; day++) for (let period = 0; period < 4 && !reachable; period++) {
      const game = structuredClone(completed); game.relationships.saidin.stage = 5;
      game.day = day; game.period = period; game.location = event.location; game.spot = event.spots[0];
      reachable = page.spontaneousEventReady(event, game);
    }
    assert.ok(reachable, `événement introuvable dans les horaires : ${event.id}`);
  }

  let spriteLines = 0;
  async function inspect(value) {
    if (!value || typeof value !== "object") return;
    if (value.speaker === "Remerii" && value.mood) {
      assert.ok(sprites.SPRITE_MOODS.remerii.includes(value.mood), value.mood);
      const file = sprites.spritePath("remerii", value.mood, "calm");
      await access(resolve(root, "..", file.replace(/^\//, ""))); spriteLines++;
    }
    for (const item of Object.values(value)) await inspect(item);
  }
  await inspect([routes, secrets.REMERII_CONFIDENCES, dates.REMERII_DATES, home.REMERII_HOME_DATE, home.REMERII_RESIDENT_MOMENTS, ambient.REMERII_AMBIENT_LINES, living]);
  for (const date of dates.REMERII_DATES) {
    for (let round = 0; round < 2; round++) await inspect(dates.remeriiDateBeat(date.id, round));
    for (const background of [world.spotById(date.spot).background, date.intimacySetting.background]) await access(resolve(root, "..", background.replace(/^\//, "")));
  }
  const newFiles = ["remerii-relation", "remerii-confidences", "remerii-ambient", "remerii-dates", "remerii-home-date", "remerii-living-world"];
  for (const file of newFiles) {
    const text = await readFile(resolve(root, `src/${file}.ts`), "utf8");
    assert.doesNotMatch(text, /apprend à lâcher|Votre Résonance|harmoniser|réparer sa malédiction|Hylee était inconsciente/iu);
  }
  if (process.env.REMERII_QA_FIXTURE) {
    const fixture = structuredClone(completed);
    fixture.day = 7; fixture.period = 2; fixture.location = "miraldas"; fixture.spot = "miraldas-archives";
    fixture.housing.propertyId = housing.HOUSING_PROPERTIES.find(p => p.location === "miraldas" && p.tier === 2).id;
    fixture.relationships.remerii.stage = 4; fixture.history = fixture.history.filter(id => id !== "remerii-4");
    fixture.settings.volume = 0;
    await writeFile(process.env.REMERII_QA_FIXTURE, JSON.stringify(fixture));
  }
  console.log(`[Remerii] ${connections} raccords Hylee · ${routeBranches} branches relationnelles · 5 confidences facultatives · ${datePaths} parcours publics · ${homePaths} visites au logis · migration, relecture, horaires, désir et ${spriteLines} expressions vérifiés.`);
} finally {
  await server.close();
}
