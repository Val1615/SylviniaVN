import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const sourceRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pageSource = await readFile(resolve(sourceRoot, "src/page.tsx"), "utf8");
const server = await createServer({
  root: sourceRoot,
  appType: "custom",
  logLevel: "silent",
  server: { middlewareMode: true },
});

try {
  const [game, heritage, social, campaign, story, world, contextual, closures] = await Promise.all([
    server.ssrLoadModule("/src/game-data.ts"),
    server.ssrLoadModule("/src/heritages-data.ts"),
    server.ssrLoadModule("/src/social-scenes.ts"),
    server.ssrLoadModule("/src/campaign-scenes.ts"),
    server.ssrLoadModule("/src/story-data.ts"),
    server.ssrLoadModule("/src/world-data.ts"),
    server.ssrLoadModule("/src/route-contextual-choices.ts"),
    server.ssrLoadModule("/src/scene-closures.ts"),
  ]);

  const castIds = game.CHARACTERS.map((character) => character.id);
  const routeIds = game.ROUTE_SCENES.map((scene) => scene.id);
  const secretsByReveal = new Map();
  for (const secret of heritage.SECRET_CONVERSATIONS) {
    for (const knowledge of secret.reveals) secretsByReveal.set(knowledge, secret);
  }

  assert.equal(game.ROUTE_SCENES.length, castIds.length * 5, "cinq scènes majeures sont requises pour chaque personnage");
  assert.deepEqual(contextual.validateContextualRouteChoices(routeIds), { routes: 60, contextualChoices: 60 });

  for (const characterId of castIds) {
    const routes = game.ROUTE_SCENES.filter((scene) => scene.character === characterId).sort((left, right) => left.stage - right.stage);
    assert.deepEqual(routes.map((scene) => scene.stage), [0, 1, 2, 3, 4], `${characterId}: ordre des cinq scènes majeures incomplet`);
    assert.equal(game.ROUTE_KNOWLEDGE_ORDER[characterId]?.length, 4, `${characterId}: quatre transitions par confidence sont requises`);

    const tiers = new Set(heritage.SECRET_CONVERSATIONS.filter((secret) => secret.character === characterId).map((secret) => secret.tier));
    assert.deepEqual([...tiers].sort((a, b) => a - b), [20, 40, 60, 80], `${characterId}: progression 20/40/60/80 incomplète`);

    for (const route of routes) {
      assert.ok(closures.sceneClosure(route.id).length >= 2, `${route.id}: conséquence de fin de scène manquante`);
      const extra = contextual.ROUTE_CONTEXTUAL_CHOICES[route.id];
      assert.ok(extra?.misread?.text && extra.misread.response, `${route.id}: mauvaise lecture propre à la scène manquante`);
      if (route.stage >= 3 && characterId !== "draven") {
        assert.ok(extra.boundary?.text && extra.boundary.response, `${route.id}: limite contextuelle manquante`);
        assert.ok(extra.platonic?.text && extra.platonic.response, `${route.id}: bifurcation amicale contextuelle manquante`);
      }
      if (route.stage === 0) continue;
      const expectedKnowledge = game.ROUTE_KNOWLEDGE_ORDER[characterId][route.stage - 1];
      assert.deepEqual(game.routeKnowledgeRequirements(route), [expectedKnowledge], `${route.id}: la confidence précédente doit être exigée`);
      const provider = secretsByReveal.get(expectedKnowledge);
      assert.ok(provider, `${route.id}: connaissance sans scène source ${expectedKnowledge}`);
      assert.equal(provider.character, characterId, `${route.id}: la transition doit venir de l’arc du personnage`);
      assert.equal(provider.tier, route.stage * 20, `${route.id}: mauvais palier de confidence`);
    }
  }

  const allContainers = [
    ...game.ROUTE_SCENES,
    ...heritage.SECRET_CONVERSATIONS,
    ...heritage.INVITATIONS,
    ...heritage.SPONTANEOUS_EVENTS,
    ...social.SOCIAL_SCENES,
    ...campaign.CAMPAIGN_SCENES,
  ];
  const choiceOwners = new Map();
  for (const container of allContainers) {
    assert.ok(container.choices?.length, `${container.id}: aucun choix écrit`);
    for (const choice of container.choices) {
      assert.ok(choice.text.trim().length >= 8, `${container.id}/${choice.id}: choix trop vague`);
      assert.ok(choice.response?.length, `${container.id}/${choice.id}: conséquence de choix absente`);
      choiceOwners.set(choice.id, [...(choiceOwners.get(choice.id) || []), container.id]);
    }
  }
  for (const [choiceId, owners] of choiceOwners) {
    assert.equal(owners.length, 1, `${choiceId}: choix réutilisé dans ${owners.join(", ")}`);
  }

  assert.match(pageSource, /dialogue\.scene\.kind !== "route" \|\| !dialogue\.scene\.route/, "les choix contextuels doivent rester réservés aux routes majeures");
  assert.match(pageSource, /ROUTE_CONTEXTUAL_CHOICES\[dialogue\.scene\.route\.id\]/, "les choix injectés doivent être récupérés par identifiant de scène");
  assert.doesNotMatch(pageSource, /Vous prenez le temps de répondre sans détour/, "le texte de remplissage générique ne doit plus être injecté");
  assert.doesNotMatch(pageSource, /Tu peux m.expliquer la L[’']|Tu peux m.expliquer le L[’']/iu, "ancienne construction grammaticale invalide encore présente");
  assert.ok(!social.SOCIAL_SCENES.some((scene) => scene.title === "L’héritière et la frontière"), "la scène de frontière brouillonne doit être remplacée");

  const campaignOrder = [
    "campaign-archives-channel",
    "campaign-forged-proof",
    "campaign-convergence-council",
    "campaign-convergence-operation",
    "campaign-epilogue",
  ];
  assert.deepEqual(campaign.CAMPAIGN_SCENES.map((scene) => scene.id), campaignOrder, "la campagne V–VI doit conserver son ordre causal");
  const campaignById = new Map(campaign.CAMPAIGN_SCENES.map((scene) => [scene.id, scene]));
  assert.ok(campaignById.get("campaign-forged-proof").requiresHistory.includes("campaign-archives-channel"));
  assert.ok(campaignById.get("campaign-convergence-council").requiresHistory.includes("campaign-forged-proof"));
  assert.ok(campaignById.get("campaign-convergence-operation").requiresHistory.includes("campaign-convergence-council"));
  assert.ok(campaignById.get("campaign-epilogue").requiresHistory.includes("campaign-convergence-operation"));
  for (const scene of campaign.CAMPAIGN_SCENES) {
    assert.ok(closures.sceneClosure(scene.id).length >= 2, `${scene.id}: transition vers le jalon suivant manquante`);
    assert.ok(!(scene.requiresHistory || []).some((id) => /secret-|-(?:1|2|3|4)$/.test(id)), `${scene.id}: la campagne ne doit pas exiger une confidence privée ou une route avancée`);
    assert.ok(scene.choices.every((choice) => choice.effects.flags?.includes(scene.id)), `${scene.id}: tous les choix doivent transmettre le jalon causal`);
  }
  const councilFirstRoutes = new Set(campaignById.get("campaign-convergence-council").requiresHistory.filter((id) => /-0$/.test(id)));
  assert.deepEqual([...councilFirstRoutes].sort(), castIds.map((id) => `${id}-0`).sort(), "le conseil final doit connaître les douze personnes sans exiger leur intimité");

  function requireRouteFlags(routeId, expected) {
    const actual = new Set(game.routeFlagRequirements({ id: routeId }));
    for (const flag of expected) assert.ok(actual.has(flag), `${routeId}: conséquence préalable manquante ${flag}`);
  }
  requireRouteFlags("iriana-4", ["iriana-private-choice"]);
  requireRouteFlags("amanea-4", ["amanea-pact-boundary"]);
  requireRouteFlags("bellirith-4", ["bellirith-memory-space", "fracture-valurn-bellirith-distance-set"]);
  requireRouteFlags("valurn-4", ["valurn-accountability", "fracture-valurn-bellirith-distance-set"]);
  requireRouteFlags("lineva-4", ["lineva-mother-truth-resolved", "lineva-draven-grief-shared"]);
  requireRouteFlags("draven-4", ["lineva-mother-truth-resolved", "lineva-draven-grief-shared"]);

  const eventById = new Map(heritage.SPONTANEOUS_EVENTS.map((event) => [event.id, event]));
  const valurnTruth = eventById.get("world-bellirith-valurn-truth");
  assert.ok(valurnTruth.requiresKnowledge.includes("knows_bellirith_mortal_death") && valurnTruth.requiresKnowledge.includes("knows_valurn_true_abandonment"), "la confrontation Valurn/Bellirith doit attendre les deux versions");
  assert.ok(valurnTruth.requiresFlags.includes("valurn-accountability"), "Valurn doit préparer une transmission sans imposer son remords à Bellirith");
  const linevaTruth = eventById.get("world-lineva-draven-truth");
  assert.ok(linevaTruth.requiresKnowledge.includes("knows_lineva_mother_dead") && linevaTruth.requiresKnowledge.includes("knows_draven_fear_return"), "l’annonce à Draven doit attendre les deux points de vue");

  for (const event of heritage.SPONTANEOUS_EVENTS) {
    const paired = event.characters.includes("amanea") && event.characters.includes("naiah");
    if (!paired) continue;
    assert.equal(event.amaneaNaiahSafeguard, true, `${event.id}: coprésence Amanea/Naïah non protégée`);
    const lines = [...event.intro, ...event.choices.flatMap((choice) => choice.response)];
    for (const line of lines) {
      if (line.speaker === "Amanea") assert.doesNotMatch(line.text, /Naïah|ma fille|\btoi\b/iu, `${event.id}: Amanea répond directement à Naïah`);
    }
  }

  const mandatorySocialIds = new Set([
    "medig-window",
    "amanea-family-truth",
    "bellirith-after-memory",
    "iriana-after-mother",
    "valurn-after-truth",
    "amanea-after-pact",
    "lineva-draven-after-truth",
    "valurn-bellirith-after-truth",
  ]);
  const mandatoryEventIds = new Set(["world-bellirith-valurn-truth", "world-lineva-draven-truth"]);
  const stages = Object.fromEntries(castIds.map((id) => [id, 0]));
  const history = new Set();
  const flags = new Set();
  const knowledge = new Set();
  const secretsDone = new Set();
  const socialsDone = new Set();
  const eventsDone = new Set();

  const addEffects = (effects = {}) => {
    for (const flag of effects.flags || []) flags.add(flag);
    for (const entry of effects.knowledge || []) knowledge.add(entry);
  };
  const historySatisfied = (id) => history.has(id) || flags.has(id) || flags.has(`social:${id}`);
  let changed = true;
  let passes = 0;
  while (changed && passes < 100) {
    changed = false;
    passes += 1;

    for (const route of game.ROUTE_SCENES) {
      if (stages[route.character] !== route.stage) continue;
      if (route.character === "tia" && route.stage === 0 && stages.amanea < 2) continue;
      if (!game.routeKnowledgeRequirements(route).every((entry) => knowledge.has(entry))) continue;
      if (!game.routeFlagRequirements(route).every((flag) => flags.has(flag))) continue;
      stages[route.character] = route.stage + 1;
      history.add(route.id);
      addEffects(route.choices[0].effects);
      changed = true;
    }

    for (const secret of heritage.SECRET_CONVERSATIONS) {
      if (secretsDone.has(secret.id) || stages[secret.character] < secret.tier / 20) continue;
      if (!(secret.requiresKnowledge || []).every((entry) => knowledge.has(entry))) continue;
      secretsDone.add(secret.id);
      for (const entry of secret.reveals) knowledge.add(entry);
      addEffects(secret.choices[0].effects);
      changed = true;
    }

    for (const scene of social.SOCIAL_SCENES) {
      if (!mandatorySocialIds.has(scene.id) || socialsDone.has(scene.id)) continue;
      if (Object.entries(scene.minStages || {}).some(([id, stage]) => stages[id] < stage)) continue;
      if (!(scene.requiresKnowledge || []).every((entry) => knowledge.has(entry))) continue;
      if (!(scene.requiresFlags || []).every((flag) => flags.has(flag))) continue;
      if (scene.requiresAnyFlags?.length && !scene.requiresAnyFlags.some((flag) => flags.has(flag))) continue;
      if ((scene.excludesFlags || []).some((flag) => flags.has(flag))) continue;
      socialsDone.add(scene.id);
      flags.add(`social:${scene.id}`);
      addEffects(scene.choices[0].effects);
      changed = true;
    }

    for (const event of heritage.SPONTANEOUS_EVENTS) {
      if (!mandatoryEventIds.has(event.id) || eventsDone.has(event.id)) continue;
      if (Object.entries(event.minStages || {}).some(([id, stage]) => stages[id] < stage)) continue;
      if (!(event.requiresKnowledge || []).every((entry) => knowledge.has(entry))) continue;
      if (!(event.requiresFlags || []).every((flag) => flags.has(flag))) continue;
      if ((event.excludesFlags || []).some((flag) => flags.has(flag))) continue;
      eventsDone.add(event.id);
      addEffects(event.choices[0].effects);
      changed = true;
    }

    for (const scene of campaign.CAMPAIGN_SCENES) {
      if (history.has(scene.id)) continue;
      if (!(scene.requiresHistory || []).every(historySatisfied)) continue;
      if (!(scene.requiresFlags || []).every((flag) => flags.has(flag))) continue;
      if (!(scene.requiresKnowledge || []).every((entry) => knowledge.has(entry))) continue;
      history.add(scene.id);
      addEffects(scene.choices[0].effects);
      changed = true;
    }
  }

  assert.deepEqual(stages, Object.fromEntries(castIds.map((id) => [id, 5])), "la simulation complète doit terminer les douze routes");
  assert.equal(secretsDone.size, heritage.SECRET_CONVERSATIONS.length, "la simulation complète doit atteindre toutes les confidences sans cycle mort");
  assert.deepEqual([...mandatorySocialIds].filter((id) => !socialsDone.has(id)), [], "une transition sociale obligatoire reste inaccessible");
  assert.deepEqual([...mandatoryEventIds].filter((id) => !eventsDone.has(id)), [], "un événement croisé obligatoire reste inaccessible");
  assert.deepEqual(campaignOrder.filter((id) => !history.has(id)), [], "la campagne ne rejoint pas sa conclusion");
  assert.equal(story.storyProgress([...history], [...flags]), story.MAIN_STORY.length, "les Chapitres I–VI ne se terminent pas lors d’une run légitime");
  assert.ok(flags.has("main-story-complete"), "l’épilogue doit produire le flag de conclusion");

  const linevaTravelItinerary = [
    { days: 14, location: "forthaven" },
    { days: 3, travelTo: "algratal", note: "Voyage vers Al’Gratal" },
    { days: 3, location: "algratal" },
    { days: 3, travelTo: "forthaven", note: "Retour vers le front" },
    { days: 15, location: "forthaven" },
  ];
  const irianaForthavenItinerary = [
    { days: 12, location: "algratal" },
    { days: 3, travelTo: "akuhn", note: "Voyage clandestin" },
    { days: 3, location: "akuhn" },
    { days: 3, travelTo: "algratal", note: "Retour secret" },
    { days: 6, location: "algratal" },
    { days: 3, travelTo: "forthaven", note: "Accompagne la délégation" },
    { days: 3, location: "forthaven" },
    { days: 3, travelTo: "algratal", note: "Regagne la capitale" },
    { days: 2, location: "algratal" },
  ];
  const allFlags = new Set(allContainers.flatMap((container) => container.choices.flatMap((choice) => choice.effects.flags || [])));

  function schedule(character, day) {
    const itinerary = character.id === "lineva" && allFlags.has("lineva-travel")
      ? linevaTravelItinerary
      : character.id === "iriana" && allFlags.has("story-forthaven-accord-drafted")
        ? irianaForthavenItinerary
        : character.itinerary;
    const cycleLength = itinerary.reduce((total, stop) => total + stop.days, 0);
    const cycleDay = ((Math.max(1, day) - 1) % cycleLength) + 1;
    let cursor = 1;
    for (const stop of itinerary) {
      const end = cursor + stop.days - 1;
      if (cycleDay <= end) return { ...stop, stopDay: cycleDay - cursor + 1 };
      cursor = end + 1;
    }
    throw new Error(`${character.id}: itinéraire vide`);
  }

  function place(characterId, day, periodIndex) {
    const character = game.CHARACTERS.find((entry) => entry.id === characterId);
    const stop = schedule(character, day);
    let moment = stop.location
      ? world.routineFor(characterId, stop.location, game.PERIODS[periodIndex].id, day)
      : world.travelWaypoint(characterId, stop.travelTo, stop.note || "voyage", stop.stopDay);
    if (characterId === "naiah" && stop.location === "forbidden") {
      const hylee = game.CHARACTERS.find((entry) => entry.id === "hylee");
      if (schedule(hylee, day).location === "forbidden") moment = { spot: "forbidden-sanctuary" };
    }
    const spot = world.spotById(moment.spot);
    return { location: spot?.location || stop.location || stop.travelTo, spot: moment.spot };
  }

  for (const event of heritage.SPONTANEOUS_EVENTS) {
    const physical = event.characters.filter((id) => !(event.remoteCharacters || []).includes(id));
    let reachable = false;
    for (let day = event.minDay; day <= event.minDay + 114 && !reachable; day += 1) {
      for (let period = 0; period < game.PERIODS.length && !reachable; period += 1) {
        const positions = physical.map((id) => place(id, day, period));
        reachable = positions.every((position) => position.location === event.location && (!event.spots?.length || event.spots.includes(position.spot)))
          && new Set(positions.map((position) => position.spot)).size === 1;
      }
    }
    assert.ok(reachable, `${event.id}: aucune coprésence physique dans trois cycles`);
  }

  for (const scene of social.SOCIAL_SCENES.filter((entry) => entry.oneTime)) {
    const required = scene.requiredPresent || scene.characters;
    let reachable = false;
    for (let day = 1; day <= 114 && !reachable; day += 1) {
      for (let period = 0; period < game.PERIODS.length && !reachable; period += 1) {
        const positions = required.map((id) => place(id, day, period));
        const oneSpot = new Set(positions.map((position) => position.spot)).size === 1;
        const allowedSpot = !scene.sublocations?.length || positions.every((position) => scene.sublocations.includes(position.spot));
        const allowedLocation = !scene.locations?.length || positions.every((position) => scene.locations.includes(position.location));
        reachable = oneSpot && allowedSpot && allowedLocation;
      }
    }
    assert.ok(reachable, `${scene.id}: aucun créneau commun dans trois cycles`);
    assert.ok(closures.sceneClosure(scene.id).length >= 2, `${scene.id}: conséquence sociale manquante`);
  }

  console.log(`[Narration] run complète en ${passes} passes · 6 chapitres · ${history.size} scènes majeures/campagne · ${secretsDone.size} confidences · ${socialsDone.size} transitions obligatoires · ${eventsDone.size} confrontations causales · horaires croisés validés.`);
} finally {
  await server.close();
}
