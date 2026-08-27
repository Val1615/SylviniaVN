import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const sourceRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const projectRoot = resolve(sourceRoot, "..");
const [pageSource, gameSource, ambientSource, dateSource] = await Promise.all([
  readFile(resolve(sourceRoot, "src/page.tsx"), "utf8"),
  readFile(resolve(sourceRoot, "src/game-data.ts"), "utf8"),
  readFile(resolve(sourceRoot, "src/ambient-dialogues.ts"), "utf8"),
  readFile(resolve(sourceRoot, "src/date-scenes.ts"), "utf8"),
]);

const server = await createServer({
  root: sourceRoot,
  appType: "custom",
  logLevel: "silent",
  server: { middlewareMode: true },
});

const routeA = [
  "campaign-echoes", "campaign-algratal-road", "campaign-imperial-audience",
  "campaign-naiah-promise", "campaign-forthaven-assault", "campaign-lineva-departure",
  "campaign-price-of-aid", "campaign-akuhn-gates", "campaign-amanea-audience",
  "campaign-alamma-archives", "campaign-amanea-letter", "campaign-before-light",
  "campaign-coalition-preparation", "campaign-false-portal", "campaign-rocky-spires",
];

const routeB = [
  "campaign-echoes", "campaign-algratal-road", "campaign-imperial-audience",
  "campaign-forthaven-assault", "campaign-lineva-departure", "campaign-naiah-promise",
  "campaign-price-of-aid", "campaign-akuhn-gates", "campaign-amanea-audience",
  "campaign-alamma-archives", "campaign-amanea-letter", "campaign-before-light",
  "campaign-coalition-preparation", "campaign-false-portal", "campaign-rocky-spires",
];

try {
  const [campaign, world, game, story, dates, heritages] = await Promise.all([
    server.ssrLoadModule("/src/campaign-scenes.ts"),
    server.ssrLoadModule("/src/world-data.ts"),
    server.ssrLoadModule("/src/game-data.ts"),
    server.ssrLoadModule("/src/story-data.ts"),
    server.ssrLoadModule("/src/date-scenes.ts"),
    server.ssrLoadModule("/src/heritages-data.ts"),
  ]);

  const scenes = campaign.CAMPAIGN_SCENES;
  const order = [...campaign.ACT_ONE_SCENE_ORDER];
  assert.equal(scenes.length, 15, "l’Acte I doit contenir quinze jalons");
  assert.deepEqual(scenes.map((scene) => scene.id), order, "les scènes doivent suivre l’ordre de référence");
  assert.equal(new Set(order).size, order.length, "les identifiants de campagne doivent être uniques");
  assert.equal(campaign.ACT_ONE_SCENE_AUDIT.length, scenes.length, "chaque scène doit posséder une ligne d’audit");
  assert.deepEqual(Object.keys(campaign.ACT_ONE_SCENE_LINKS).sort(), [...order].sort(), "le graphe doit couvrir chaque scène");

  for (const scene of scenes) {
    const spot = world.spotById(scene.spot);
    assert.ok(spot, `${scene.id}: sous-lieu inconnu`);
    assert.equal(spot.location, scene.location, `${scene.id}: lieu et sous-lieu incohérents`);
    assert.ok(game.PERIODS.some((period) => period.id === scene.period), `${scene.id}: période inconnue`);
    assert.ok(scene.intro.length >= 8, `${scene.id}: introduction trop courte`);
    assert.ok(scene.choices.length >= 3, `${scene.id}: choix insuffisants`);
    assert.ok(scene.choices.every((choice) => choice.response.length >= 4), `${scene.id}: réaction à un choix trop courte`);
    assert.ok(scene.choices.every((choice) => choice.effects.flags?.length), `${scene.id}: les choix doivent créer un état persistant`);
    assert.ok(scene.relationState?.length > 30, `${scene.id}: contexte relationnel manquant`);
    assert.ok(campaign.ACT_ONE_SCENE_LINKS[scene.id].every((id) => order.includes(id)), `${scene.id}: lien sortant inconnu`);
    if (scene.background.startsWith("/")) await access(resolve(projectRoot, scene.background.slice(1)));
  }

  function completePath(path, letterOutcome) {
    const history = [];
    const flags = new Set(["story-phoenix-token"]);
    for (const id of path) {
      const scene = campaign.campaignSceneById(id);
      assert.ok(scene, `${id}: scène introuvable`);
      assert.ok((scene.requiresHistory || []).every((required) => history.includes(required)), `${id}: historique requis absent`);
      assert.ok((scene.requiresFlags || []).every((required) => flags.has(required)), `${id}: flag requis absent`);
      let choice = scene.choices[0];
      if (id === "campaign-amanea-letter") {
        choice = scene.choices.find((candidate) => candidate.id === (letterOutcome === "letter" ? "letter-people" : "letter-respect-refusal"));
      }
      assert.ok(choice, `${id}: choix de parcours introuvable`);
      for (const flag of choice.effects.flags || []) flags.add(flag);
      history.push(id);
    }
    assert.equal(history.at(-1), "campaign-rocky-spires", "le parcours doit atteindre le cliffhanger");
    assert.ok(flags.has(letterOutcome === "letter" ? "amanea-letter-to-tia" : "amanea-refused-tia-letter"), "l’issue Amanea doit persister");
    assert.ok(flags.has("main-story-act-1-complete"), "l’Acte I doit être marqué terminé");
    assert.ok(flags.has("story-rocky-portal-open"), "le véritable portail doit être ouvert");
    assert.ok(flags.has("story-empire-obscurci-rupture"), "la rupture politique doit être persistante");
    assert.equal(story.storyProgress(history, [...flags]), story.MAIN_STORY.length, "les dix chapitres doivent être terminables");
    return { history, flags };
  }

  completePath(routeA, "letter");
  completePath(routeA, "refusal");
  completePath(routeB, "letter");
  completePath(routeB, "refusal");

  assert.match(pageSource, /CHARACTER_INTRODUCTIONS:[\s\S]*hylee:[\s\S]*campaign-echoes[\s\S]*tia:[\s\S]*campaign-before-light[\s\S]*bellirith:[\s\S]*campaign-coalition-preparation/, "le casting doit se débloquer par présentation scénarisée");
  assert.match(pageSource, /locationUnlocked\(game[\s\S]*campaign-imperial-audience[\s\S]*campaign-akuhn-gates[\s\S]*campaign-rocky-spires/, "les régions doivent se débloquer progressivement");
  assert.match(pageSource, /visibleCharacters = CHARACTERS\.filter\(\(character\) => characterUnlocked\(game, character\)\)/, "la carte doit masquer le casting inconnu");
  assert.match(pageSource, /act1-first-route-naiah[\s\S]*act1-first-route-forthaven/, "le premier ordre des branches doit être mémorisé");
  assert.match(pageSource, /characterId === "draven"[\s\S]*campaign-akuhn-gates[\s\S]*campaign-before-light/, "les déplacements de Draven doivent primer sur sa routine");
  assert.match(pageSource, /characterId === "lineva"[\s\S]*campaign-lineva-departure/, "Lineva doit tenir Forthaven pendant la campagne");

  const beforeLight = campaign.campaignSceneById("campaign-before-light");
  assert.deepEqual(beforeLight.remote, ["lineva"], "Lineva doit intervenir à distance depuis Forthaven");
  assert.ok(!beforeLight.cast.includes("lineva"), "Lineva ne doit pas être physiquement à Al’Gratal");
  assert.ok(scenes.every((scene) => !(scene.cast.includes("amanea") && scene.cast.includes("naiah"))), "Amanea et Naïah ne doivent pas être réunies artificiellement");
  assert.ok(dates.DATE_SCENES.filter((scene) => scene.character === "naiah").every((scene) => scene.location !== "akuhn"), "Naïah ne doit jamais avoir de rendez-vous à Akuhn’Nabad");
  assert.ok(heritages.SPONTANEOUS_EVENTS.filter((event) => event.characters.includes("naiah")).every((event) => event.location !== "akuhn"), "Naïah ne doit jamais apparaître à Akuhn’Nabad dans un événement");
  assert.doesNotMatch(dateSource, /character: "naiah"[^\n]+location: "akuhn"/, "aucun rendez-vous de Naïah ne doit franchir son bannissement");
  assert.doesNotMatch(ambientSource, /naiah:[\s\S]{0,500}location: "akuhn"/, "aucune conversation ambiante de Naïah ne doit l’installer à Akuhn’Nabad");

  const stageZeroTitles = game.ROUTE_SCENES.filter((scene) => scene.stage === 0).map((scene) => scene.title);
  assert.ok(stageZeroTitles.every((title) => !scenes.some((scene) => scene.title === title)), "une route relationnelle ne doit pas répéter une audience de campagne");
  assert.doesNotMatch(gameSource, /portail au-dessus d’Al’Gratal|repris connaissance dans le palais de ma sœur/, "les anciennes versions contradictoires du prologue doivent disparaître");

  const finalText = campaign.campaignSceneById("campaign-rocky-spires").outro.map((line) => line.text).join(" ");
  assert.match(finalText, /Forthaven demeure assiégée/, "la crise de Forthaven doit rester ouverte");
  assert.match(finalText, /Saidin n'a pas expliqué son jeton/, "le jeton de Saidin doit rester irrésolu");
  assert.match(finalText, /origine/, "l’origine du protagoniste doit rester irrésolue");

  console.log(`[Acte I] ${scenes.length} jalons · 4 parcours complets · ${campaign.ACT_ONE_SCENE_AUDIT.length} lignes d'audit · carte, casting, horaires et canon Amanea/Naïah validés.`);
} finally {
  await server.close();
}
