import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const sourceRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const [pageSource, groupSource, housingSceneSource, musicSource] = await Promise.all([
  readFile(resolve(sourceRoot, "src/page.tsx"), "utf8"),
  readFile(resolve(sourceRoot, "src/group-dates.ts"), "utf8"),
  readFile(resolve(sourceRoot, "src/housing-scenes.ts"), "utf8"),
  readFile(resolve(sourceRoot, "src/music-data.ts"), "utf8"),
]);

const server = await createServer({
  root: sourceRoot,
  appType: "custom",
  logLevel: "silent",
  server: { middlewareMode: true },
});

try {
  const [gameData, worldData, storyData, rules, musicData, housingData, campaignData] = await Promise.all([
    server.ssrLoadModule("/src/game-data.ts"),
    server.ssrLoadModule("/src/world-data.ts"),
    server.ssrLoadModule("/src/story-data.ts"),
    server.ssrLoadModule("/src/gameplay-rules.ts"),
    server.ssrLoadModule("/src/music-data.ts"),
    server.ssrLoadModule("/src/housing-data.ts"),
    server.ssrLoadModule("/src/campaign-scenes.ts"),
  ]);

  assert.equal(gameData.CHARACTERS.length, 12, "le casting complet doit contenir douze personnages");
  assert.equal(gameData.ROUTE_SCENES.length, 60, "chaque personnage doit conserver cinq scènes majeures");
  assert.equal(new Set(gameData.ROUTE_SCENES.map((scene) => scene.id)).size, 60, "les identifiants de route doivent être uniques");

  function schedule(character, day, flags) {
    const itinerary = character.itinerary;
    const cycleLength = itinerary.reduce((total, stop) => total + stop.days, 0);
    const cycleDay = ((Math.max(1, day) - 1) % cycleLength) + 1;
    let cursor = 1;
    for (const stop of itinerary) {
      const end = cursor + stop.days - 1;
      if (cycleDay <= end) return { ...stop, stopDay: cycleDay - cursor + 1 };
      cursor = end + 1;
    }
    throw new Error(`emploi du temps vide pour ${character.id}`);
  }

  function place(character, day, period, flags) {
    const stop = schedule(character, day, flags);
    const moment = stop.location
      ? worldData.routineFor(character.id, stop.location, gameData.PERIODS[period].id, day)
      : worldData.travelWaypoint(character.id, stop.travelTo, stop.note, stop.stopDay);
    return moment.spot;
  }

  const completedRoutes = [];
  const routeFlags = new Set();
  for (const character of gameData.CHARACTERS) {
    let searchTick = 0;
    for (const route of gameData.ROUTE_SCENES.filter((scene) => scene.character === character.id).sort((a, b) => a.stage - b.stage)) {
      const targetSpot = worldData.ROUTE_SPOTS[route.id];
      const target = worldData.spotById(targetSpot);
      assert.ok(target, `${route.id}: sous-lieu de route inconnu`);
      assert.equal(target.location, route.location, `${route.id}: le lieu déclaré ne correspond pas au sous-lieu réel`);
      const periods = worldData.ROUTE_PERIODS[route.id];
      assert.ok(periods?.length, `${route.id}: aucune période autorisée`);
      let found;
      const firstTick = Math.max(searchTick, (route.dayMin - 1) * gameData.PERIODS.length);
      const lastTick = firstTick + 76 * gameData.PERIODS.length;
      for (let tick = firstTick; tick <= lastTick && !found; tick += 1) {
        const day = Math.floor(tick / gameData.PERIODS.length) + 1;
        const period = tick % gameData.PERIODS.length;
        if (periods.includes(gameData.PERIODS[period].id) && place(character, day, period, routeFlags) === targetSpot) {
          found = { day, period, tick };
        }
      }
      assert.ok(found, `${route.id}: aucun créneau légitime dans deux cycles complets`);
      searchTick = found.tick + 1;
      completedRoutes.push(route.id);
      for (const flag of route.choices[0]?.effects.flags || []) routeFlags.add(flag);
    }
  }

  const linevaTwo = gameData.ROUTE_SCENES.find((scene) => scene.id === "lineva-2");
  assert.ok(linevaTwo.choices.every((choice) => choice.effects.knowledge?.includes("knows_lineva_mother_dead")), "lineva-2 doit révéler sobrement la mort de sa mère dans toutes les variantes");
  assert.ok(gameData.ROUTE_SCENES.filter((scene) => scene.character === "lineva").every((scene) => scene.location === "forthaven"), "Lineva doit rester physiquement à Forthaven pendant son Acte I");
  assert.ok(gameData.ROUTE_SCENES.filter((scene) => scene.character === "lineva").flatMap((scene) => scene.choices).every((choice) => !choice.effects.flags?.includes("lineva-travel")), "aucun choix Lineva ne doit rétablir l’ancien voyage à Al’Gratal");
  assert.equal(rules.routeChoiceCompletes("lineva-2-misread"), false, "une maladresse ne doit pas valider une route");
  assert.equal(rules.routeChoiceCompletes("lineva-4-boundary"), false, "une pause ne doit pas valider la dernière route");
  assert.equal(rules.routeChoiceCompletes("lineva-4-platonic"), true, "une décision amicale claire doit clore la dernière étape");
  assert.equal(rules.routeChoiceCompletes("l2-s"), true, "un choix écrit doit valider la route");

  assert.equal(rules.contentBranchAllowed(["hr-triad-established"], { characters: ["hylee", "remerii"], requiredFlags: ["hr-triad-established"] }), true);
  assert.equal(rules.contentBranchAllowed([], { characters: ["hylee", "remerii"], requiredFlags: ["hr-triad-established"] }), false);
  assert.equal(rules.contentBranchAllowed(["hr-triad-established", "hylee-platonic"], { characters: ["hylee", "remerii"], requiredFlags: ["hr-triad-established"] }), false);
  assert.equal(rules.contentBranchAllowed(["iv-shared-dates", "iv-friends"], { characters: ["iriana", "valurn"], requiredFlags: ["iv-shared-dates"], excludedFlags: ["iv-friends"] }), false);

  const hyleeRemerii = groupSource.slice(groupSource.indexOf('id: "group-date-hylee-remerii"'), groupSource.indexOf('id: "group-date-valurn-bellirith"'));
  const irianaValurn = groupSource.slice(groupSource.indexOf('id: "group-date-iriana-valurn"'), groupSource.indexOf('id: "group-date-hylee-naiah"'));
  assert.match(hyleeRemerii, /requiredFlags:\s*\["hr-triad-established"\]/, "le rendez-vous Hylee/Remerii exige le trouple établi");
  assert.match(irianaValurn, /requiredFlags:\s*\["iv-shared-dates"\]/, "le rendez-vous Iriana/Valurn exige l'accord pour les moments à trois");
  assert.match(irianaValurn, /excludedFlags:\s*\["iv-friends"\]/, "la branche amicale Iriana/Valurn doit exclure le rendez-vous romantique");
  assert.match(housingSceneSource, /id:\s*"hylee-remerii"[^\n]+requiredFlags:\s*\["hr-triad-established"\]/, "le rendez-vous au logis Hylee/Remerii doit suivre la même branche");

  assert.match(pageSource, /dialogue\.scene\.kind !== "route" \|\| !dialogue\.scene\.route/, "seules les routes majeures peuvent recevoir des choix contextuels supplémentaires");
  assert.match(pageSource, /ROUTE_CONTEXTUAL_CHOICES\[dialogue\.scene\.route\.id\]/, "les choix supplémentaires doivent provenir du catalogue propre à chaque scène");
  assert.match(pageSource, /routeChoiceCompletes\(choice\.id\) \? dialogue\.scene\.route/, "la validation de route doit filtrer les choix injectés");
  assert.match(pageSource, /publicDateUnlocked\(game, date\)/, "le démarrage d'un rendez-vous doit revérifier la branche");
  assert.match(pageSource, /visitedLocations:\s*\["echo-clearing"\]/, "une nouvelle partie ne doit marquer que son lieu réellement visité");
  const advanceSection = pageSource.slice(pageSource.indexOf("function advancePeriod"), pageSource.indexOf("function applyEffects"));
  assert.doesNotMatch(advanceSection, /LOCATIONS\.filter|codex:/, "le passage d'un jour ne doit pas découvrir automatiquement la carte");

  const nearby = rules.travelPeriodCost("algratal", "echo-clearing", "Cartographe des Échos", gameData.LOCATIONS);
  const regional = rules.travelPeriodCost("algratal", "forthaven", "Cartographe des Échos", gameData.LOCATIONS);
  const scout = rules.travelPeriodCost("algratal", "forthaven", rules.SCOUT_VOCATION, gameData.LOCATIONS);
  assert.equal(rules.travelPeriodCost("algratal", "algratal", rules.SCOUT_VOCATION, gameData.LOCATIONS), 1, "changer de pièce doit coûter une période");
  assert.ok(nearby >= 2, "un voyage régional normal doit coûter plus qu'un changement de pièce");
  assert.ok(regional > nearby, "un trajet lointain doit coûter davantage qu'une escale voisine");
  assert.equal(scout, regional - 1, "la vocation Éclaireur·se doit réellement accélérer le voyage");
  assert.deepEqual(rules.advanceClock({ day: 3, period: 3 }, 3), { day: 4, period: 2 }, "les longs voyages doivent franchir correctement la nuit");

  for (const property of housingData.HOUSING_PROPERTIES) {
    const track = musicData.musicForContext(property.spot, { locationId: property.location });
    assert.notEqual(track, "title", `${property.id}: un logis ne doit jamais reprendre la musique du titre`);
    assert.ok(musicData.MUSIC_LABELS[track], `${property.id}: piste musicale inconnue ${track}`);
  }
  assert.doesNotMatch(musicSource.slice(musicSource.indexOf("export function musicForContext")), /:\s*"title"\s*;/, "le fallback musical libre ne doit pas viser le titre");

  const socialFlags = ["social:medig-window", "social:amanea-family-truth"];
  const storyHistory = [...campaignData.ACT_ONE_SCENE_ORDER];
  assert.equal(storyData.storyProgress(storyHistory, socialFlags), storyData.MAIN_STORY.length, "la campagne doit pouvoir atteindre sa conclusion sans mode développeur");
  const campaignIds = new Set(campaignData.CAMPAIGN_SCENES.map((scene) => scene.id));
  for (const requirement of storyData.MAIN_STORY.flatMap((act) => act.requiredScenes)) {
    assert.ok(completedRoutes.includes(requirement) || socialFlags.includes(`social:${requirement}`) || campaignIds.has(requirement), `jalon principal introuvable : ${requirement}`);
  }

  console.log(`[Gameplay] ${completedRoutes.length} routes atteignables · ${storyData.MAIN_STORY.length} chapitres terminables · branches platoniques et rendez-vous croisés synchronisés · temps, Codex et ${housingData.HOUSING_PROPERTIES.length} logis validés.`);
} finally {
  await server.close();
}
