import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (path) => readFile(resolve(root, path), "utf8");
const server = await createServer({
  root,
  appType: "custom",
  logLevel: "silent",
  server: { middlewareMode: true },
  plugins: [{
    name: "naiah-save-migration-test",
    enforce: "pre",
    transform(code, id) {
      if (id.endsWith("/src/page.tsx")) return `${code}\nexport { hydrateGame };`;
    },
  }],
});

try {
  const [game, heritage, ambient, social, campaign, world, closures, page] = await Promise.all([
    server.ssrLoadModule("/src/game-data.ts"),
    server.ssrLoadModule("/src/heritages-data.ts"),
    server.ssrLoadModule("/src/ambient-dialogues.ts"),
    server.ssrLoadModule("/src/social-scenes.ts"),
    server.ssrLoadModule("/src/campaign-scenes.ts"),
    server.ssrLoadModule("/src/world-data.ts"),
    server.ssrLoadModule("/src/scene-closures.ts"),
    server.ssrLoadModule("/src/page.tsx"),
  ]);

  const routes = game.ROUTE_SCENES.filter((scene) => scene.character === "naiah").sort((a, b) => a.stage - b.stage);
  assert.equal(routes.length, 5, "Naïah doit conserver exactement cinq quêtes personnelles");
  assert.deepEqual(routes.map((scene) => scene.stage), [0, 1, 2, 3, 4]);
  assert.deepEqual(routes.map((scene) => scene.title), [
    "Le jeu des branches",
    "Les brumes ne s'entretiennent pas toutes seules",
    "Ceux qu'elle prétend ne pas protéger",
    "Quand le rire s'arrête",
    "La gardienne sans titre",
  ]);
  assert.deepEqual(routes.map((scene) => scene.dayMin), [4, 6, 8, 10, 12]);
  assert.ok(routes.every((scene) => scene.location === "forbidden" && !scene.intimate), "l'arc doit rester forestier et non intime");
  assert.ok(routes.every((scene) => scene.intro.length >= 10), "chaque étape doit avoir une véritable mise en scène");
  assert.ok(routes.every((scene) => scene.choices.length >= 3), "chaque étape doit proposer plusieurs décisions concrètes");
  for (const scene of routes) {
    for (const choice of scene.choices) {
      assert.ok(choice.stat, `${scene.id}/${choice.id}: stat explicite manquante`);
      assert.ok(choice.response.length >= 8, `${scene.id}/${choice.id}: conséquence trop courte`);
    }
    assert.ok(closures.sceneClosure(scene.id).length >= 2, `${scene.id}: fermeture de scène manquante`);
    assert.deepEqual(game.routeKnowledgeRequirements(scene), [], `${scene.id}: une confidence ne doit jamais bloquer la quête`);
    assert.equal(game.routeStoryRequirement(scene), 0, `${scene.id}: aucun chapitre ultérieur ne doit bloquer la quête`);
    assert.deepEqual(game.routeFlagRequirements(scene), [], `${scene.id}: aucun drapeau de contournement ne doit bloquer la quête`);
  }
  assert.deepEqual([...new Set(routes.flatMap((scene) => scene.choices.map((choice) => choice.stat)))].sort(), ["audace", "lucidite", "resonance", "sangFroid"]);
  assert.deepEqual(game.routeHistoryRequirements(routes[0]), ["campaign-naiah-promise"]);
  for (let stage = 1; stage < 5; stage += 1) assert.deepEqual(game.routeHistoryRequirements(routes[stage]), [`naiah-${stage - 1}`]);
  assert.deepEqual(routes.map((scene) => world.ROUTE_SPOTS[scene.id]), ["forbidden-sanctuary", "forbidden-crossroads", "forbidden-threshold", "forbidden-ruins", "forbidden-sanctuary"]);

  const history = new Set(["campaign-naiah-promise"]);
  for (const route of routes) {
    assert.ok(game.routeHistoryRequirements(route).every((id) => history.has(id)), `${route.id}: chaîne autonome inaccessible`);
    history.add(route.id);
  }

  const routeText = JSON.stringify(routes);
  assert.match(routeText, /dissimulation|cach/i);
  assert.match(routeText, /désorient|confusion/i);
  assert.match(routeText, /renvoi|renvoyer/i);
  assert.match(routeText, /convoi/i);
  assert.match(routeText, /Allenna/i);
  assert.doesNotMatch(routeText, /tartelette|crise identitaire|belle âme|théâtre des brumes|reine sans public|pas une victoire sur elle/iu);
  assert.doesNotMatch(routeText, /vous lancez? (?:un|le) sort|vous réaccordez? la magie|votre magie maintient/iu, "le protagoniste ne doit pas devenir un mage de substitution");
  assert.match(routeText, /ne devien(?:s|t) mage|sans vous demander d.y verser la moindre magie/iu);

  const secrets = heritage.SECRET_CONVERSATIONS.filter((secret) => secret.character === "naiah").sort((a, b) => a.tier - b.tier);
  assert.deepEqual(secrets.map((secret) => secret.tier), [20, 40, 60, 80]);
  assert.deepEqual(secrets.map((secret) => secret.id), ["secret-naiah-hylee-nights", "secret-naiah-exile", "secret-naiah-surpass", "secret-naiah-look"]);
  assert.deepEqual(secrets.map((secret) => secret.reveals[0]), ["knows_naiah_hylee_nights", "knows_naiah_exile", "knows_naiah_surpass_amanea", "knows_naiah_maternal_rejection"]);
  const secretText = JSON.stringify(secrets);
  assert.match(secretText, /après le dernier service/iu);
  assert.match(secretText, /ni grâce à elle|ni à cause d'elle/iu);
  assert.doesNotMatch(secretText, /tartelette|plus de sujets|une couronne plus haute|pacte de Llorea|Naïah meurt/iu);
  const lastSecret = secrets.find((secret) => secret.tier === 80);
  assert.ok(lastSecret.choices.some((choice) => choice.requiresKnowledge?.includes("knows_amanea_naiah_pain")), "la nuance conditionnelle liée à Amanea doit rester facultative");
  assert.ok(lastSecret.choices.every((choice) => !choice.requiresKnowledge?.includes("knows_amanea_naiah_pact")), "le pacte ne doit jamais être requis ou révélé par Naïah");

  const letters = heritage.LETTERS.filter((letter) => letter.character === "naiah");
  assert.equal(letters.length, 2);
  const margin = letters.find((letter) => letter.id === "letter-naiah-margin");
  const question = letters.find((letter) => letter.id === "letter-naiah-question");
  assert.ok(margin.replies.some((reply) => reply.id === "naiah-verso"));
  assert.doesNotMatch(JSON.stringify(margin), /tartelette|recette/iu);
  assert.match(JSON.stringify(question), /ne décide pas à ma place|vérité qui me blesse|avant d'utiliser cette vérité/iu);

  const invitation = heritage.INVITATIONS.find((entry) => entry.id === "invite-naiah-branches");
  assert.ok(invitation, "invitation personnelle de Naïah manquante");
  assert.equal(invitation.declineEffects, undefined, "refuser l'invitation ne doit jamais punir la relation");
  assert.deepEqual([...new Set(invitation.choices.map((choice) => choice.stat))].sort(), ["audace", "lucidite", "resonance", "sangFroid"]);
  assert.match(JSON.stringify(invitation), /clou d'arpentage|tourne en rond|boucle/iu);
  assert.doesNotMatch(JSON.stringify(invitation), /quelqu'un pourrait m'attendre|attend de Naïah/iu);

  const moments = ambient.AMBIENT_LINES.naiah;
  assert.equal(moments.length, 18, "Naïah doit conserver dix-huit moments libres entièrement révisés");
  assert.equal(new Set(moments.map((moment) => moment.id)).size, 18);
  assert.ok(moments.every((moment) => moment.choices.length === 3));
  assert.ok(moments.flatMap((moment) => moment.choices).every((choice) => choice.response.length >= 4));
  assert.deepEqual([...new Set(moments.flatMap((moment) => moment.choices.map((choice) => choice.stat)))].sort(), ["audace", "lucidite", "resonance", "sangFroid"]);
  assert.doesNotMatch(JSON.stringify(moments), /tartelette|guérir|thérapie|besoin de savoir que tu me vois|ton non ne devient pas une offense/iu);
  for (const moment of moments) assert.ok(closures.sceneClosure(moment.id).length >= 2, `${moment.id}: conclusion propre manquante`);

  const shared = ["shared-hylee-naiah-visit", "shared-valurn-naiah", "shared-bellirith-naiah"].map((id) => social.SOCIAL_SCENES.find((scene) => scene.id === id));
  assert.ok(shared.every(Boolean), "moments partagés de Naïah incomplets");
  const hyleeNaiah = shared[0];
  assert.deepEqual(hyleeNaiah.requiresKnowledge, ["knows_hylee_naiah_nights", "knows_naiah_hylee_nights"]);
  assert.doesNotMatch(JSON.stringify(shared), /tartelette|réparer Naïah|posséder l'autre|pas d'aura, pas d'illusion/iu);

  const hyleeSecret = heritage.SECRET_CONVERSATIONS.find((secret) => secret.id === "secret-hylee-naiah-nights");
  assert.ok(hyleeSecret?.reveals.includes("knows_hylee_naiah_nights"));
  assert.doesNotMatch(JSON.stringify([hyleeSecret, secrets[0]]), /tartelette|nourriture de côté|restes du service/iu);

  const firstMeeting = campaign.CAMPAIGN_SCENES.find((scene) => scene.id === "campaign-naiah-promise");
  assert.ok(firstMeeting, "première rencontre de campagne manquante");
  assert.doesNotMatch(JSON.stringify(firstMeeting), /tartelette/iu);

  const naiahSources = await Promise.all([read("src/naiah-relation.ts"), read("src/naiah-confidences.ts"), read("src/naiah-ambient.ts")]);
  assert.ok(naiahSources.every((source) => !/speaker:\s*["']Amanea["']/.test(source)), "aucune interaction directe Amanea/Naïah ne doit être créée");

  const migrated = page.hydrateGame({
    version: 16,
    player: { name: "Migration Naïah", sex: "intersexe", origin: "", trait: "", vocation: "" },
    knowledge: ["knows_naiah_tartlets", "knows_hylee_tartlets", "heard_rumor_naiah_tartlets"],
    secretHistory: ["secret-naiah-tartlets", "secret-hylee-naiah-v2"],
    rumors: [{ id: "rumor-forbidden-tartlets", heardDay: 7 }],
    letters: [{ id: "letter-naiah-margin", receivedDay: 7, read: true, replyId: "naiah-food" }],
  });
  assert.ok(migrated, "la sauvegarde de migration doit être hydratable");
  assert.equal(migrated.version, 17);
  assert.ok(migrated.knowledge.includes("knows_naiah_hylee_nights"));
  assert.ok(migrated.knowledge.includes("knows_hylee_naiah_nights"));
  assert.ok(migrated.knowledge.includes("heard_rumor_naiah_guardian"));
  assert.ok(migrated.secretHistory.includes("secret-naiah-hylee-nights"));
  assert.ok(migrated.secretHistory.includes("secret-hylee-naiah-nights"));
  assert.ok(migrated.rumors.some((entry) => entry.id === "rumor-forbidden-guardian"));
  assert.equal(migrated.letters.find((entry) => entry.id === "letter-naiah-margin")?.replyId, "naiah-verso");

  console.log(`[Naïah] 5 quêtes autonomes · 4 confidences facultatives · 18 moments libres · 3 moments partagés · courrier/invitation · migration v17 validés.`);
} finally {
  await server.close();
}
