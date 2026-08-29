import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const sourceRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const [pageSource, gameSource, dateSource, intimacySource] = await Promise.all([
  readFile(resolve(sourceRoot, "src/page.tsx"), "utf8"),
  readFile(resolve(sourceRoot, "src/game-data.ts"), "utf8"),
  readFile(resolve(sourceRoot, "src/date-scenes.ts"), "utf8"),
  readFile(resolve(sourceRoot, "src/lineva-date-intimacy.ts"), "utf8"),
]);

const server = await createServer({ root: sourceRoot, appType: "custom", logLevel: "silent", server: { middlewareMode: true } });

try {
  const [game, world, dates, intimacy, heritage, cg, contextual, closures] = await Promise.all([
    server.ssrLoadModule("/src/game-data.ts"),
    server.ssrLoadModule("/src/world-data.ts"),
    server.ssrLoadModule("/src/date-scenes.ts"),
    server.ssrLoadModule("/src/lineva-date-intimacy.ts"),
    server.ssrLoadModule("/src/heritages-data.ts"),
    server.ssrLoadModule("/src/intimate-cg.ts"),
    server.ssrLoadModule("/src/route-contextual-choices.ts"),
    server.ssrLoadModule("/src/scene-closures.ts"),
  ]);

  const routes = game.ROUTE_SCENES.filter((scene) => scene.character === "lineva").sort((a, b) => a.stage - b.stage);
  assert.deepEqual(routes.map((scene) => scene.id), ["lineva-0", "lineva-1", "lineva-2", "lineva-3", "lineva-4"]);
  assert.deepEqual(routes.map((scene) => scene.title), [
    "Le quai qui tient encore",
    "La ligne qui recule",
    "Ceux qu’on remonte",
    "Le fauteuil de l’amiral",
    "Quand les cloches ne s’arrêtent plus",
  ], "les cinq mouvements de la place laissée vide doivent rester explicites");
  assert.ok(routes.every((scene) => scene.location === "forthaven"), "Lineva doit vivre tout son Acte I à Forthaven");
  assert.ok(routes.every((scene) => !scene.intimate), "la route relationnelle ne doit plus se conclure automatiquement par du sexe");
  assert.ok(routes.every((scene) => scene.intro.length >= 10), "chaque scène majeure doit posséder plusieurs mouvements avant le choix");
  assert.ok(routes.every((scene) => scene.choices.length === 3), "chaque scène doit proposer trois approches écrites");
  assert.ok(routes.every((scene) => scene.choices.every((choice) => choice.response.length >= 8)), "les variantes Lineva ne doivent pas se réduire à une réaction courte");
  assert.ok(routes.every((scene) => closures.sceneClosure(scene.id).length >= 2), "chaque scène doit posséder une vraie retombée");

  assert.deepEqual(game.routeHistoryRequirements(routes[0]), ["campaign-lineva-departure"], "la première rencontre relationnelle doit suivre le départ scénarisé de Draven");
  assert.deepEqual(routes.map((scene) => game.routeStoryRequirement(scene)), [0, 4, 5, 8, 9], "les scènes doivent se répartir dans la vie réelle de l’Acte I");
  assert.ok(routes.every((scene) => game.routeKnowledgeRequirements(scene).length === 0), "les confidences Lineva doivent rester facultatives");
  assert.deepEqual(game.routeFlagRequirements(routes[4]), [], "la dernière scène ne doit pas résoudre Draven ou la mort de sa mère");
  assert.ok(routes.flatMap((scene) => scene.choices).every((choice) => !choice.effects.flags?.includes("lineva-travel")), "l’ancien voyage à Al’Gratal ne doit pas réapparaître");
  assert.ok(routes[2].choices.every((choice) => choice.effects.knowledge?.includes("knows_lineva_mother_dead")), "la mort de sa mère doit être connue quelle que soit l’approche de la scène 3");
  assert.ok(routes[4].choices.every((choice) => choice.effects.flags?.includes("lineva-act-one-held")), "chaque issue de l’attaque doit conserver le coût commun de la ville tenue");

  assert.deepEqual(routes.map((scene) => world.ROUTE_SPOTS[scene.id]), [
    "forthaven-harbor",
    "forthaven-war-room",
    "forthaven-ramparts",
    "forthaven-war-room",
    "forthaven-ramparts",
  ]);
  assert.deepEqual(routes.map((scene) => world.ROUTE_PERIODS[scene.id]), [["aube"], ["matin"], ["apres-midi"], ["matin"], ["apres-midi"]]);

  assert.ok(contextual.ROUTE_CONTEXTUAL_CHOICES["lineva-3"].misread.text.includes("Amirale"), "le titre refusé doit posséder sa mauvaise lecture propre");
  assert.ok(contextual.ROUTE_CONTEXTUAL_CHOICES["lineva-4"].platonic, "la branche amicale doit rester disponible à la fin, pas au milieu du siège");

  const motherSecret = heritage.SECRET_CONVERSATIONS.find((scene) => scene.id === "secret-lineva-mother");
  assert.deepEqual(motherSecret.reveals, ["knows_lineva_mother_last_hours"], "la dernière confidence doit approfondir les circonstances au lieu de répéter la révélation principale");
  const truthEvent = heritage.SPONTANEOUS_EVENTS.find((scene) => scene.id === "world-lineva-draven-truth");
  assert.equal(truthEvent.minStages.lineva, 5, "l’annonce à Draven doit suivre l’arc relationnel de l’Acte I");
  assert.ok(truthEvent.requiresFlags.includes("main-story-act-1-complete"), "l’annonce ne doit pas refermer la blessure avant le cliffhanger");

  const linevaDates = dates.DATE_SCENES.filter((date) => date.character === "lineva");
  assert.deepEqual(linevaDates.map((date) => date.title), ["Forthaven à elle", "Une soirée qui ne sert à rien"]);
  assert.ok(linevaDates.every((date) => date.unlockStage === 5), "les rendez-vous doivent suivre les cinq scènes relationnelles");
  assert.ok(linevaDates.every((date) => date.location === "forthaven" && date.intimacySetting.replaceProfile), "chaque rendez-vous doit rester à Forthaven et remplacer l’ouverture générique");
  assert.ok(linevaDates.every((date) => date.intro.length >= 10 && date.choices.every((choice) => choice.response.length >= 7)), "les rendez-vous doivent rester longs et différenciés");
  assert.ok(linevaDates[0].intro.some((line) => /ragoût de poisson|dés|fanal/u.test(line.text)));
  assert.ok(linevaDates[1].intro.some((line) => /cartes|danse|phonographe/u.test(line.text)));

  assert.deepEqual(intimacy.validateLinevaDateIntimacy(), { dates: 2, combinations: 6, routes: 18, chapters: 576 });
  for (const date of linevaDates) {
    assert.equal(intimacy.linevaDateApproaches(date.id).length, 3, `${date.id}: trois entrées propres au rendez-vous sont requises`);
    for (const sex of ["femme", "homme", "intersexe"]) {
      const entries = intimacy.linevaDateIntimacyRoutes(date.id, sex);
      assert.equal(entries.length, 3, `${date.id}/${sex}: trois humeurs requises`);
      assert.deepEqual(entries.map((entry) => entry.id.includes(sex)), [true, true, true], `${date.id}/${sex}: les variantes doivent être identifiables par corps`);
      for (const entry of entries) {
        for (const mode of ["tendre", "suggestif", "explicite", "ellipse"]) {
          assert.equal(entry.chapters[mode].length, 8, `${entry.id}/${mode}: huit séquences requises`);
        }
        const explicitWords = entry.chapters.explicite.flat().reduce((total, line) => total + line.text.trim().split(/\s+/u).length, 0);
        assert.ok(explicitWords >= 360, `${entry.id}: progression explicite trop courte (${explicitWords} mots)`);
        assert.ok(entry.chapters.explicite[4].some((line) => /nue|vulve|sexe|corps/u.test(line.text)), `${entry.id}: reveal absent du chapitre 4`);
        assert.ok(entry.chapters.explicite[5].some((line) => /orgasme|joui|plaisir/u.test(line.text)), `${entry.id}: climax absent du chapitre 5`);
        assert.ok(entry.chapters.explicite[6].every((line) => !/accélère|pénétr/u.test(line.text)), `${entry.id}: le chapitre post-orgasm ne doit pas relancer l’acte`);
      }
    }
    const female = intimacy.linevaDateIntimacyRoutes(date.id, "femme").map((entry) => entry.chapters.explicite.flat().map((line) => line.text).join(" "));
    const male = intimacy.linevaDateIntimacyRoutes(date.id, "homme").map((entry) => entry.chapters.explicite.flat().map((line) => line.text).join(" "));
    assert.ok(female.every((text, index) => text !== male[index]), `${date.id}: les versions femme et homme ne peuvent pas être de simples copies`);
  }

  const harborExplicit = intimacy.linevaDateIntimacyRoutes("date-lineva-ramparts", "femme")[0].chapters.explicite.flat().map((line) => line.text).join(" ");
  const quartersExplicit = intimacy.linevaDateIntimacyRoutes("date-lineva-quarters", "femme")[0].chapters.explicite.flat().map((line) => line.text).join(" ");
  assert.notEqual(harborExplicit, quartersExplicit, "chaque rendez-vous doit posséder sa propre intimité complète");
  assert.match(harborExplicit, /fanal|roue|quai/u);
  assert.match(quartersExplicit, /carte|table|phonographe/u);

  const linevaCg = (step, chapter) => cg.soloIntimateCgState({ character: "lineva", mode: "explicite", surface: "route", step, chapter });
  assert.equal(linevaCg("direction-lines", 3), undefined, "le reveal ne doit pas arriver avant le pivot");
  assert.equal(linevaCg("direction-lines", 4)?.phase, "reveal", "le reveal Lineva doit accompagner le chapitre 4");
  assert.equal(linevaCg("direction-lines", 5), undefined, "les sprites doivent revenir pour le climax");
  assert.equal(linevaCg("direction-lines", 6)?.phase, "post-orgasm", "le post-orgasm doit commencer après le climax");
  assert.equal(linevaCg("ending", 7)?.phase, "post-orgasm", "le post-orgasm doit rester pendant la clôture propre au rendez-vous");
  assert.equal(linevaCg("done", 7)?.phase, "post-orgasm", "aucun sprite ne doit revenir avant la fermeture");

  assert.match(pageSource, /linevaDateApproaches\(modal\.dateId\) \|\| profile\.approaches/, "l’ouverture interactive doit utiliser les approches propres au rendez-vous");
  assert.match(pageSource, /intimacyDirections\(character\.id, game\.player\.sex, modal\.dateId\)/, "les directions doivent recevoir l’identifiant du rendez-vous");
  assert.match(pageSource, /directionChapters\(character\.id, choice\.id, game\.player\.intimacy, game\.player\.sex, modal\.dateId\)/, "les huit chapitres doivent rester liés au rendez-vous choisi");
  assert.match(pageSource, /modal\.dateId\?\.startsWith\("date-lineva-"\) \? undefined : INTIMACY_GAMES/, "Défaire la garde ne doit pas réapparaître après que Lineva a déjà déposé son équipement");
  assert.match(dateSource, /replaceProfile:\s*true/g, "les rendez-vous Lineva doivent remplacer le prologue intime générique");

  const linevaStart = gameSource.indexOf("// LINEVA");
  const linevaEnd = gameSource.indexOf("// SAIDIN", linevaStart);
  const linevaNarrative = `${gameSource.slice(linevaStart, linevaEnd)}\n${dateSource.slice(dateSource.indexOf('id: "date-lineva-ramparts"'), dateSource.indexOf('id: "date-saidin-observatory"'))}`;
  assert.doesNotMatch(linevaNarrative, /bonne réponse|tu as compris|vous avez compris|lâcher prise|guérir son trauma/iu, "ancienne écriture validante ou thérapeutique détectée");
  assert.doesNotMatch(linevaNarrative, /—/u, "les scènes refondues ne doivent pas retomber dans le tic du tiret cadratin");
  assert.doesNotMatch(intimacySource, /INTIMACY_TEXT|Défaire la garde/u, "les deux intimités ne doivent dépendre ni du texte générique ni du mini-jeu incohérent");

  console.log("[Lineva] 5 scènes de guerre · 2 rendez-vous · 18 variantes corporelles · 576 chapitres modaux · CG reveal/climax/post persistantes · continuité Forthaven validée.");
} finally {
  await server.close();
}
