import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => readFile(resolve(root, file), "utf8");
const [pageSource, gameSource, dateSource, socialSource, homeSource, groupSource] = await Promise.all([
  read("src/page.tsx"), read("src/game-data.ts"), read("src/date-scenes.ts"), read("src/social-scenes.ts"), read("src/home-intimacy-routes.ts"), read("src/group-dates.ts"),
]);
const server = await createServer({ root, appType: "custom", logLevel: "silent", server: { middlewareMode: true } });

try {
  const [game, dates, intimacy, relation, closures, contextual, housing, home, groups] = await Promise.all([
    server.ssrLoadModule("/src/game-data.ts"),
    server.ssrLoadModule("/src/date-scenes.ts"),
    server.ssrLoadModule("/src/allenna-date-intimacy.ts"),
    server.ssrLoadModule("/src/allenna-relation-beats.ts"),
    server.ssrLoadModule("/src/scene-closures.ts"),
    server.ssrLoadModule("/src/route-contextual-choices.ts"),
    server.ssrLoadModule("/src/housing-scenes.ts"),
    server.ssrLoadModule("/src/home-intimacy-routes.ts"),
    server.ssrLoadModule("/src/group-dates.ts"),
  ]);

  const routes = game.ROUTE_SCENES.filter((scene) => scene.character === "allenna").sort((a, b) => a.stage - b.stage);
  assert.deepEqual(routes.map((scene) => scene.title), ["Le terrain déjà occupé", "Un ordre suffit", "La fille dehors", "L’héritière", "Les noms des Serres"]);
  assert.ok(routes.every((scene) => scene.dayMin === 1 && !scene.intimate));
  assert.ok(routes.every((scene) => game.routeKnowledgeRequirements(scene).length === 0), "les confidences doivent rester facultatives");
  assert.deepEqual(routes.map((scene) => game.routeHistoryRequirements(scene)), [
    ["campaign-akuhn-gates"],
    ["campaign-amanea-audience", "allenna-0"],
    ["allenna-1"],
    ["campaign-coalition-preparation", "allenna-2"],
    ["campaign-rocky-spires", "allenna-3"],
  ]);
  assert.equal(closures.sceneClosure("allenna-4").length, 0, "aucun texte ne doit suivre la première fissure");
  routes[4].choices.forEach((choice) => {
    const tail = choice.response.slice(-4).map((line) => line.text);
    assert.deepEqual(tail, ["Non.", "Elle relit le document.", "Un silence.", "...Je vais vérifier."]);
  });

  assert.equal(socialSource.includes(["allenna", "care", "without", "command"].join("-")), false);
  assert.ok(routes.slice(0, 4).every((scene) => relation.allennaRelationBeat(scene.id)?.choices.length === 3));
  assert.ok(routes.every((scene) => contextual.ROUTE_CONTEXTUAL_CHOICES[scene.id]?.misread));

  const allennaDates = dates.DATE_SCENES.filter((date) => date.character === "allenna");
  assert.deepEqual(allennaDates.map((date) => date.title), ["L’exercice qui n’évalue personne", "Le chaudron à trois couleurs"]);
  assert.ok(allennaDates.every((date) => date.unlockStage === 5 && date.minDesire === 22 && date.intimacySetting.replaceProfile));
  const publicGate = pageSource.slice(pageSource.indexOf("function publicDateUnlocked"), pageSource.indexOf("function homeDateUnlocked"));
  assert.doesNotMatch(publicGate, /desire|minDesire/);
  assert.match(pageSource, /\["lineva", "allenna"\]\.includes\(date\.character\)/);
  assert.match(pageSource, /`\$\{date\.character\}-platonic`/);
  assert.match(pageSource, />Pas ce soir</);
  assert.match(pageSource, />Choisir une amitié durable</);

  assert.deepEqual(intimacy.validateAllennaDateIntimacy(), { dates: 2, combinations: 6, routes: 18, chapters: 720 });
  for (const date of allennaDates) for (const sex of ["femme", "homme", "intersexe"]) {
    const entries = intimacy.allennaDateIntimacyRoutes(date.id, sex);
    assert.equal(entries.length, 3);
    for (const entry of entries) for (const mode of ["tendre", "suggestif", "explicite", "ellipse"]) {
      assert.equal(entry.chapters[mode].length, 10);
      const reveal = entry.chapters[mode][2].map((line) => line.text).join(" ");
      assert.match(reveal, /menton/iu); assert.match(reveal, /roug/iu); assert.match(reveal, /détourn/iu);
    }
  }

  assert.equal(housing.HOME_DATE_PROFILES.allenna.title, "La bataille qui tient sur une table");
  for (const sex of ["femme", "homme", "intersexe"]) {
    const entries = home.homeIntimacyRoutes("allenna", sex);
    assert.equal(entries.length, 3);
    entries.forEach((entry) => Object.values(entry.chapters).forEach((chapters) => assert.ok(chapters.length >= 8)));
  }

  const duo = groups.GROUP_DATES.find((date) => date.id === "group-date-allenna-lineva");
  assert.deepEqual(duo.requiredFlags, ["story-allenna-lineva-met"]);
  assert.match(pageSource, /contentBranchAllowed\(game\.flags, date\).*date\.characters\.every/s);
  assert.doesNotMatch([gameSource, dateSource, homeSource].join("\n"), /protagoniste/iu);
  assert.doesNotMatch([gameSource.slice(gameSource.indexOf('routeScene("allenna", 0'), gameSource.indexOf("// DRAVEN")), dateSource.slice(dateSource.indexOf('id: "date-allenna-field"'), dateSource.indexOf('id: "date-tia-ballroom"'))].join("\n"), /—/u);

  console.log("[Allenna V2] 5 scènes · 2 rendez-vous · désir post-rendez-vous · 18 variantes corporelles · 720 chapitres · logis et duo validés.");
} finally {
  await server.close();
}
