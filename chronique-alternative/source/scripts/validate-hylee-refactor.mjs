import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

// Tests du moteur, sans DOM. Seuls les hooks React sont remplacés par des
// cellules synchrones ; les actions, horaires et transitions restent ceux
// de page.tsx. Cette instrumentation n'entre jamais dans le build du jeu.
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const hookId = "\0hylee-test-hooks";
const hookModule = `
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
const exportNames = ["createGame", "hydrateGame", "DEFAULT_PLAYER", "routeNarrativeReady", "routeAvailableAtPlace", "routeNarrativeObjective", "secretConversationReady", "publicDateUnlocked", "homeDateUnlocked", "characterPlace", "characterSchedule", "choicesForDialogue", "dialogueSpriteMoods", "expandedLines"];
const actions = ["game", "dialogue", "modal", "setGame", "setDialogue", "setModal", "openCharacterScene", "advanceDialogue", "selectChoice", "closeDialogue", "travel", "startDate", "finishDateEnding", "startDateIntimacy", "startHomeDate", "finishHomeDate", "startHomeIntimacy", "replayRoute", "replayDate", "replaySecret", "startCampaignScene"];
const server = await createServer({
  root, appType: "custom", logLevel: "silent", server: { middlewareMode: true },
  plugins: [{
    name: "hylee-engine-tests", enforce: "pre",
    resolveId(id) { if (id === "hylee-test-hooks") return hookId; },
    load(id) { if (id === hookId) return hookModule; },
    transform(code, id) {
      if (!id.endsWith("/src/page.tsx")) return;
      assert.ok(code.includes('  if (screen === "title") {'), "point d’instrumentation du moteur absent");
      return code
        .replace('from "react";', 'from "hylee-test-hooks";')
        .replace('  if (screen === "title") {', `  return { ${actions.join(", ")} };\n  if (screen === "title") {`)
        + `\nexport { ${exportNames.join(", ")} };`;
    },
  }],
});

try {
  const page = await server.ssrLoadModule("/src/page.tsx");
  const hooks = await server.ssrLoadModule("hylee-test-hooks");
  const data = await server.ssrLoadModule("/src/game-data.ts");
  const world = await server.ssrLoadModule("/src/world-data.ts");
  const story = await server.ssrLoadModule("/src/story-data.ts");
  const relation = await server.ssrLoadModule("/src/hylee-relation.ts");
  const confidences = await server.ssrLoadModule("/src/hylee-confidences.ts");
  const dates = await server.ssrLoadModule("/src/hylee-dates.ts");
  const allDates = await server.ssrLoadModule("/src/date-scenes.ts");
  const heritages = await server.ssrLoadModule("/src/heritages-data.ts");
  const housing = await server.ssrLoadModule("/src/housing-data.ts");
  const home = await server.ssrLoadModule("/src/hylee-home-date.ts");
  const sprites = await server.ssrLoadModule("/src/sprite-system.ts");
  const rules = await server.ssrLoadModule("/src/gameplay-rules.ts");
  const hylee = data.CHARACTERS.find(c => c.id === "hylee");
  const remerii = data.CHARACTERS.find(c => c.id === "remerii");
  const routes = relation.HYLEE_ROUTES;
  assert.equal(routes.length, 5);
  assert.equal(confidences.HYLEE_CONFIDENCES.length, 6);
  assert.equal(dates.HYLEE_DATES.length, 2);
  assert.equal(home.HYLEE_HOME_DATE.rounds.length, 3);
  let api;
  const render = () => { hooks.beginRender(); return api = page.default(); };
  const init = (game) => { hooks.reset(); render().setGame(structuredClone(game)); return render(); };
  const act = (name, ...args) => { api[name](...args); return render(); };
  const newGame = () => page.createGame({ ...page.DEFAULT_PLAYER, name: "Test", intimacy: "tendre" });
  const campaignGame = (chapters = 4) => {
    const game = newGame();
    game.history = story.MAIN_STORY.slice(0, chapters).flatMap(c => c.requiredScenes);
    game.flags = [...game.history, "hylee-itinerary-start:1", "story-saidin-met", "story-phoenix-token", "story-route-algratal"];
    game.relationships.hylee = { ...game.relationships.hylee, met: true, affection: 90, trust: 90, desire: 0 };
    return game;
  };
  function finishDialogue(pick = choices => choices.find(c => !(c.effects.desire > 0)) || choices[0]) {
    let iterations = 0, choicesMade = 0;
    while (api.dialogue) {
      assert.ok(++iterations < 800, "dialogue bloqué");
      if (["choices", "relation-choices"].includes(api.dialogue.phase)) {
        const choices = page.choicesForDialogue(api.dialogue, api.game);
        assert.ok(choices.length, "écran de choix vide");
        act("selectChoice", pick(choices, api.dialogue, choicesMade++));
      } else act("advanceDialogue");
    }
    return choicesMade;
  }
  function routeFixture(route, game, replay = false) {
    const playable = relation.hyleeRouteVariant(route, game.knowledge, game.flags);
    const scene = { ...playable, cast: playable.cast || ["hylee"], kind: "route", route: playable };
    return { scene, lines: page.expandedLines(scene, game, scene.intro, "intro"), lineIndex: 0, phase: "intro", replay };
  }

  // Apparition et entrée de campagne : le calendrier ne présente plus une
  // Hylee encore employée à l'auberge avant la rencontre du joueur.
  const fresh = newGame();
  assert.equal(page.characterPlace(hylee, 1, 0, fresh.flags, fresh.housing).spot, "echo-clearing");
  assert.equal(page.routeNarrativeReady(routes[0], fresh), false);
  assert.equal(page.routeNarrativeReady(routes[0], campaignGame(2)), false);
  assert.equal(page.routeNarrativeReady(routes[0], campaignGame(3)), true);
  for (const route of routes) {
    assert.equal(route.dayMin, 1);
    assert.deepEqual(data.routeKnowledgeRequirements(route), []);
    assert.equal(Boolean(route.intimate), false);
  }
  assert.equal(page.routeNarrativeReady(routes[1], campaignGame(3)), false, "l'ordre ne dépend pas seulement des jauges");
  const legacy = campaignGame(4);
  legacy.relationships.hylee.stage = 3;
  assert.equal(page.routeNarrativeReady(routes[3], legacy), true, "compatibilité d'une étape conservée sans ancien historique détaillé");
  const anchored = ["campaign-algratal-road", "campaign-imperial-audience", "hylee-itinerary-start:40"];
  assert.equal(page.characterSchedule(hylee, 40, anchored).location, "algratal");
  for (let day = 40; day < 78; day++) for (let period = 0; period < 4; period++) {
    const first = page.characterPlace(hylee, day, period, anchored);
    const second = page.characterPlace(remerii, day, period, anchored);
    assert.equal(first.location, second.location, `voyage commun incohérent au jour ${day}`);
    assert.ok(world.spotById(first.spot));
  }

  // Les six confidences sont indépendantes des étapes et les unes des autres.
  for (const secret of confidences.HYLEE_CONFIDENCES) {
    const game = campaignGame(3);
    game.location = "miraldas";
    game.relationships.hylee.stage = 0;
    assert.equal(page.secretConversationReady(secret, game), true, secret.id);
    game.relationships.hylee.trust = secret.minTrust - 1;
    assert.equal(page.secretConversationReady(secret, game), false, `${secret.id}: confiance minimale`);
  }
  assert.notDeepEqual(relation.hyleeRouteVariant(routes[2], ["knows_hylee_dream"], []), relation.hyleeRouteVariant(routes[2], [], []));
  assert.notDeepEqual(relation.hyleeRouteVariant(routes[0], [], ["echoes-approach-blackmail"]), routes[0]);
  assert.notDeepEqual(relation.hyleeRelationBeat("hylee-0", ["road-amnesia-shared"]), relation.hyleeRelationBeat("hylee-0", ["road-amnesia-guarded"]));

  // Parcours amical complet : aucune confidence ni désir nécessaires.
  init(campaignGame());
  for (const route of routes.slice(0, 4)) {
    const game = api.game;
    assert.equal(page.routeNarrativeReady(route, game), true, route.id);
    game.location = route.location;
    game.spot = world.ROUTE_SPOTS[route.id];
    api.setDialogue(routeFixture(route, game)); render();
    const count = finishDialogue();
    assert.equal(count, relation.hyleeRelationBeat(route.id, game.flags) ? 2 : 1);
    assert.equal(api.game.relationships.hylee.stage, route.stage + 1);
    assert.equal(api.game.relationships.hylee.desire, 0);
    assert.equal(api.game.history.filter(id => id === route.id).length, 1);
  }
  // Régression : le bouton annoncé disponible doit réellement ouvrir la scène 5,
  // puis valider chaque réponse, y compris avec une ancienne sauvegarde à 4.
  const departureGame = structuredClone(api.game);
  for (const ending of routes[4].choices) {
    const game = structuredClone(departureGame);
    game.day = 1;
    game.period = [0, 1, 2, 3].find(period => page.characterPlace(hylee, game.day, period, game.flags, game.housing).spot === "algratal-streets");
    assert.notEqual(game.period, undefined);
    game.location = "algratal"; game.spot = "algratal-streets";
    assert.equal(page.characterPlace(hylee, game.day, game.period, game.flags, game.housing).spot, game.spot);
    assert.equal(page.routeAvailableAtPlace(routes[4], game), true);
    assert.equal(page.routeNarrativeObjective(routes[4], game), undefined);
    init(page.hydrateGame(JSON.parse(JSON.stringify(game))));
    act("openCharacterScene", "hylee");
    assert.equal(api.dialogue?.scene.id, "hylee-4", "le bouton ne doit plus lancer un moment libre");
    assert.equal(api.dialogue.scene.kind, "route");
    finishDialogue(choices => choices.find(c => c.id === ending.id));
    assert.equal(api.game.relationships.hylee.stage, 5, ending.id);
    assert.equal(api.game.history.filter(id => id === "hylee-4").length, 1);
    const restored = page.hydrateGame(JSON.parse(JSON.stringify(api.game)));
    assert.equal(restored.relationships.hylee.stage, 5);
    assert.equal(routes.find(route => route.stage === restored.relationships.hylee.stage), undefined);
    assert.equal(page.publicDateUnlocked(restored, dates.HYLEE_DATES[0]), true);
    init(restored);
    act("openCharacterScene", "hylee");
    assert.notEqual(api.dialogue?.scene.id, "hylee-4", "la scène terminée ne doit plus rester disponible");
  }
  // Le raccourci de la carte reste possible : trajet payé une seule fois.
  departureGame.day = 9; departureGame.period = 2;
  const here = page.characterPlace(hylee, departureGame.day, departureGame.period, departureGame.flags, departureGame.housing);
  departureGame.location = here.location; departureGame.spot = here.spot;
  init(departureGame);
  const cost = rules.travelPeriodCost(here.location, "algratal", api.game.player.vocation, data.LOCATIONS);
  const arrival = rules.advanceClock(api.game, cost, 4);
  act("travel", "algratal", "algratal-streets");
  assert.equal(api.dialogue?.scene.id, "hylee-4");
  assert.equal(api.game.location, here.location, "ne pas déplacer le joueur avant son choix");
  assert.ok(api.dialogue.lines.some(l => l.text.includes("Je pars vers")));
  finishDialogue();
  assert.equal(api.game.relationships.hylee.stage, 5);
  assert.equal(api.game.location, "algratal");
  assert.deepEqual({ day: api.game.day, period: api.game.period }, arrival);
  assert.equal(api.game.relationships.hylee.desire, 0);
  assert.equal(api.game.knowledge.length, 0);
  const saved = page.hydrateGame(JSON.parse(JSON.stringify(api.game)));
  assert.equal(saved.relationships.hylee.stage, 5);
  assert.ok(saved.history.includes("hylee-4"));
  assert.equal(saved.relationships.lineva.stage, api.game.relationships.lineva.stage);

  // Relecture sans gains, historique doublonné ou temps consommé.
  init(saved);
  const beforeReplay = JSON.stringify(api.game);
  act("replayRoute", "hylee-2");
  finishDialogue();
  assert.equal(JSON.stringify(api.game), beforeReplay);

  // Tous les embranchements matériels des deux jeux, pas seulement la réponse
  // de plus forte affection : 2 × 3 × 3 × 2 parcours par rendez-vous.
  let datePaths = 0;
  for (const date of dates.HYLEE_DATES) {
    const location = world.spotById(date.spot);
    assert.equal(location.location, date.location);
    await access(resolve(root, "..", location.background.replace(/^\//, "")));
    for (let base = 0; base < 2; base++) for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) for (let end = 0; end < 2; end++) {
      const game = structuredClone(saved);
      game.location = "miraldas"; game.spot = "miraldas-hylee-glade";
      init(game);
      const day = game.day + 1;
      act("startDate", date.id);
      assert.equal(api.dialogue?.scene.id, date.id);
      assert.equal(api.game.day, day);
      const indices = [base, a, b, end];
      assert.equal(finishDialogue((choices, _, step) => choices[indices[step]]), 4);
      assert.equal(api.modal?.kind, "date-result");
      assert.equal(api.game.dateHistory.filter(id => id === date.id).length, 1);
      assert.equal(api.game.journal.filter(entry => entry.startsWith("Rendez-vous ·") && entry.includes(date.title)).length, 1);
      assert.equal(api.game.day, day, "les quatre décisions ne consomment pas quatre jours");
      act("startDateIntimacy", date.id);
      assert.notEqual(api.modal?.kind, "intimacy", "désir insuffisant : pas d’intimité forcée");
      act("finishDateEnding", date.id, true);
      assert.ok(!api.game.flags.includes("hylee-platonic"));
      assert.equal(page.publicDateUnlocked(api.game, date), true);
      datePaths++;
    }
    const game = structuredClone(saved);
    game.location = "miraldas"; game.spot = "miraldas-hylee-glade";
    game.relationships.hylee.desire = 30;
    init(game); act("startDate", date.id); finishDialogue();
    act("startDateIntimacy", date.id);
    assert.equal(api.modal.kind, "intimacy");
    assert.match(api.modal.background, /miraldas_quarters/);
    act("finishDateEnding", date.id, false);
    act("startDate", date.id);
    assert.equal(api.dialogue.scene.id, date.id, "un refus temporaire laisse le prochain rendez-vous ouvert");
  }
  // Une invitation se fait depuis une autre région, même pendant son voyage.
  for (const date of dates.HYLEE_DATES) {
    const game = structuredClone(saved);
    game.day = 2; game.location = "algratal"; game.spot = "algratal-streets";
    assert.equal(page.characterPlace(hylee, 3, 2, game.flags, game.housing).traveling, true);
    init(game); act("startDate", date.id);
    assert.equal(api.dialogue?.scene.id, date.id);
    assert.equal(api.game.day, 3);
    assert.equal(api.game.location, date.location);
    assert.equal(api.game.spot, date.spot);
    finishDialogue();
    assert.equal(api.game.day, 3);
  }

  // Tous les rendez-vous individuels attendent la fin du fil relationnel.
  // Ni le désir, ni la présence, ni le calendrier n'ajoutent un verrou.
  for (const date of allDates.DATE_SCENES) {
    const game = campaignGame();
    game.relationships[date.character] = { ...game.relationships[date.character], met: true, stage: 4, affection: 100, trust: 100, desire: 0 };
    assert.equal(page.publicDateUnlocked(game, date), false, date.id);
    game.relationships[date.character].stage = 5;
    game.relationships[date.character].affection = date.minAffection;
    game.relationships[date.character].trust = date.minTrust;
    assert.equal(page.publicDateUnlocked(game, date), true, date.id);
    for (const [stat, minimum] of [["affection", date.minAffection], ["trust", date.minTrust]]) {
      game.relationships[date.character][stat] = minimum - 1;
      assert.equal(page.publicDateUnlocked(game, date), false, `${date.id}/${stat}`);
      game.relationships[date.character][stat] = minimum;
    }
    init(game); act("startDate", date.id);
    assert.equal(api.dialogue?.scene.id, date.id);
  }

  // Soirée au logis : trois tons ; désir post-rendez-vous, jour compté une fois.
  const property = housing.HOUSING_PROPERTIES.find(p => p.location === "miraldas");
  for (const tone of ["amical", "amoureux", "desir"]) {
    const game = structuredClone(saved);
    game.housing.propertyId = property.id;
    game.day = 2; game.location = "algratal"; game.spot = "algratal-streets";
    game.relationships.hylee.desire = tone === "desir" ? 30 : 0;
    init(game);
    act("startHomeDate", "hylee");
    assert.equal(api.modal.kind, "home-date");
    const reservedDay = api.game.day;
    assert.equal(reservedDay, game.day + 1);
    assert.equal(api.game.location, property.location);
    assert.equal(api.game.spot, property.spot);
    act("finishHomeDate", "hylee", tone, 6);
    assert.equal(api.game.day, reservedDay);
    assert.ok(api.game.housing.homeDateHistory.includes(`hylee:${tone}@${reservedDay}`));
    act("startHomeIntimacy", "hylee");
    assert.equal(api.modal.kind === "intimacy", tone === "desir");
  }

  // Expressions explicites valides et conservation sur la narration.
  const lines = routes.flatMap(r => [...r.intro, ...r.choices.flatMap(c => c.response)]);
  for (const line of lines) if (line.mood && ["Hylee", "Remerii"].includes(line.speaker)) {
    const id = line.speaker.toLowerCase();
    assert.ok(sprites.SPRITE_MOODS[id].includes(line.mood), `${id}/${line.mood}`);
  }
  const fixture = routeFixture(routes[2], saved);
  fixture.lines = [{ speaker: "Hylee", text: "…", mood: "sad" }, { speaker: "Narration", text: "Elle baisse la tête." }];
  fixture.lineIndex = 1;
  assert.equal(page.dialogueSpriteMoods(fixture).hylee, "sad");
  fixture.spriteMoods = page.dialogueSpriteMoods(fixture);
  fixture.lines = [{ speaker: "Narration", text: "Vous attendez." }]; fixture.lineIndex = 0;
  assert.equal(page.dialogueSpriteMoods(fixture).hylee, "sad");

  const ambient = await server.ssrLoadModule("/src/ambient-dialogues.ts");
  const closures = await server.ssrLoadModule("/src/scene-closures.ts");
  assert.equal(ambient.AMBIENT_LINES.hylee.length, 20);
  assert.equal(new Set(ambient.AMBIENT_LINES.hylee.map(s => s.id)).size, 20);
  for (const scene of ambient.AMBIENT_LINES.hylee) {
    assert.equal(scene.choices.length, 3, scene.id);
    assert.deepEqual(closures.sceneClosure(scene.id), [], "aucune fin commune ne doit contredire le choix");
    for (const choice of scene.choices) {
      assert.ok(choice.response.length >= 3, choice.id);
      for (const line of choice.response) if (line.speaker === "Hylee") assert.ok(sprites.SPRITE_MOODS.hylee.includes(line.mood));
    }
  }
  const routeText = JSON.stringify(routes) + JSON.stringify(routes.map(r => relation.hyleeRelationBeat(r.id)));
  assert.doesNotMatch(routeText, /baiser|embrass|tempe contre|main se pose sur votre taille/iu);
  assert.doesNotMatch(JSON.stringify(ambient.AMBIENT_LINES.hylee), /baiser|embrass|tête contre votre épaule/iu);
  const hyleeFood = confidences.HYLEE_CONFIDENCES.find(s => s.id === "secret-hylee-naiah-v2");
  const naiahFood = heritages.SECRET_CONVERSATIONS.find(s => s.id === "secret-naiah-tartlets");
  assert.match(JSON.stringify(hyleeFood), /nourriture de côté pour elle/);
  assert.match(JSON.stringify(naiahFood), /Hylee m’en gardait/);
  assert.doesNotMatch(JSON.stringify([hyleeFood, naiahFood]), /grenier|J’en apportais à Hylee|Elle t’en apportait/);
  const forbidden = /votre Résonance|souffle arcanique|courant magique|Confluence révéler|sentir ma magie|motif magique/iu;
  assert.doesNotMatch(JSON.stringify(ambient.AMBIENT_LINES.hylee), forbidden);
  const source = await readFile(resolve(root, "src/page.tsx"), "utf8");
  assert.match(source, /spriteMoods: dialogueSpriteMoods\(dialogue\)/);
  console.log(`[Hylee] scène 5 par le bouton (4 réponses) et par voyage · sauvegarde/relecture · 20 moments / 60 réponses · canon Hylee/Naïah · aucun baiser dans le fil · ${datePaths} parcours de mini-jeux · invitations sans présence · 3 tons au logis · seuils de tous les rendez-vous individuels · sprites validés (hors DOM).`);
} finally {
  await server.close();
}
