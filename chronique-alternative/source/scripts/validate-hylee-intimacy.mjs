import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => readFile(resolve(root, file), "utf8");
const [pageSource, dateSource, intimacySource] = await Promise.all([
  read("src/page.tsx"),
  read("src/hylee-dates.ts"),
  read("src/hylee-date-intimacy.ts"),
]);
const server = await createServer({ root, appType: "custom", logLevel: "silent", server: { middlewareMode: true } });

const contexts = ["date-hylee-glade", "date-hylee-lake", "home-hylee"];
const sexes = ["femme", "homme"];
const modes = ["tendre", "suggestif", "explicite", "ellipse"];
const phases = ["approach", "undressing", "naked-reveal", "partner-discovery", "hylee-discovery", "preliminaries", "intensification", "climax", "afterglow", "ending"];
const words = (chapters) => chapters.flat().reduce((total, line) => total + line.text.trim().split(/\s+/u).length, 0);
const routeText = (route, mode = "explicite") => route.chapters[mode].flat().map((line) => line.text).join(" ");

try {
  const [intimacy, cg, sprites] = await Promise.all([
    server.ssrLoadModule("/src/hylee-date-intimacy.ts"),
    server.ssrLoadModule("/src/intimate-cg.ts"),
    server.ssrLoadModule("/src/sprite-system.ts"),
  ]);

  assert.deepEqual(intimacy.validateHyleeDateIntimacy(), { contexts: 3, combinations: 6, routes: 18, chapters: 720 });
  const ids = new Set();
  const labels = new Set();
  for (const context of contexts) for (const sex of sexes) {
    const routes = intimacy.hyleeDateIntimacyRoutes(context, sex);
    assert.equal(routes.length, 3, `${context}/${sex}: trois tonalités`);
    for (const route of routes) {
      assert.ok(!ids.has(route.id), `${route.id}: identifiant dupliqué`); ids.add(route.id);
      assert.ok(!labels.has(route.text), `${route.id}: intitulé dupliqué`); labels.add(route.text);
      assert.doesNotMatch(route.id, /guided|offered|mutual/iu);
      for (const mode of modes) {
        assert.equal(route.chapters[mode].length, 10, `${route.id}/${mode}: dix séquences`);
        assert.deepEqual(route.chapters[mode].map((_, index) => intimacy.hyleeDateIntimacyPhase(index)), phases);
        assert.ok(route.chapters[mode].every((chapter) => chapter.length > 0));
      }
      assert.ok(words(route.chapters.explicite) >= 400, `${route.id}: scène explicite trop courte`);
      const explicit = routeText(route);
      assert.match(explicit, sex === "femme" ? /vulve|clitoris/iu : /pénis|érection/iu, `${route.id}: anatomie non écrite`);
      const magicPhenomena = explicit.match(/givre|flocon|neige|buée froide|pellicule froide|cristal|blanchi/giu) || [];
      assert.ok(magicPhenomena.length <= 3, `${route.id}: magie trop répétitive`);
      route.chapters.explicite.flat().filter((line) => line.speaker === "Hylee" && line.mood).forEach((line) => {
        assert.ok(sprites.SPRITE_MOODS.hylee.includes(line.mood), `${route.id}: sprite ${line.mood} inexistant`);
      });
    }
  }
  assert.equal(ids.size, 18);
  assert.equal(labels.size, 18);

  // Les douze versions publiques restent dans leur lieu de rendez-vous. La CG
  // est un bonus plein cadre et ne dicte jamais un retour dans une chambre.
  const publicRoutes = contexts.slice(0, 2).flatMap((context) => sexes.flatMap((sex) => intimacy.hyleeDateIntimacyRoutes(context, sex)));
  const publicLiterature = publicRoutes.flatMap((route) => modes.map((mode) => routeText(route, mode))).join(" ");
  assert.doesNotMatch(publicLiterature, /\b(?:chambre|lit|fenêtre|matelas|oreiller|plancher|table|chaise|photophore|lampe|drap)\b|(?:la|une|contre|près de la) porte/iu);
  for (const sex of sexes) for (const route of intimacy.hyleeDateIntimacyRoutes("date-hylee-glade", sex)) {
    assert.match(routeText(route), /clairière|sentier|fougère|arbre|herbe/iu, `${route.id}: clairière absente`);
  }
  for (const sex of sexes) for (const route of intimacy.hyleeDateIntimacyRoutes("date-hylee-lake", sex)) {
    assert.match(routeText(route), /lac|rive|saule|eau|lame/iu, `${route.id}: rive absente`);
  }
  assert.match(JSON.stringify(intimacy.HYLEE_INTIMACY_OPENINGS["date-hylee-glade"]), /à l'abri|invisible/iu);
  assert.match(JSON.stringify(intimacy.HYLEE_INTIMACY_OPENINGS["date-hylee-lake"]), /personne ne nous voit|disparaissent/iu);
  assert.match(dateSource, /background:\s*"\/assets\/backgrounds\/miraldas\.webp"/);
  assert.match(dateSource, /background:\s*"\/assets\/backgrounds\/miraldas_lake\.png"/);
  const startIntimacy = pageSource.slice(pageSource.indexOf("function startDateIntimacy"), pageSource.indexOf("function finishDateEnding"));
  assert.doesNotMatch(startIntimacy, /miraldas-quarters|placeDiscovery/);

  // Les six versions domestiques restent propres au rendez-vous du logis.
  for (const sex of sexes) for (const route of intimacy.hyleeDateIntimacyRoutes("home-hylee", sex)) {
    assert.match(routeText(route), /logis|photophore|salon|chambre|table|canapé/iu, `${route.id}: logis absent`);
  }

  // Le chemin intersexe antérieur reste disponible en repli ; aucun canon
  // corporel nouveau n'est décidé silencieusement dans ce catalogue.
  assert.equal(intimacy.hyleeDateIntimacyRoutes("date-hylee-glade", "intersexe").length, 0);
  assert.equal(intimacy.hyleeDateIntimacyRoutes("date-hylee-lake", "intersexe").length, 0);
  assert.equal(intimacy.hyleeDateIntimacyRoutes("home-hylee", "intersexe").length, 0);
  assert.match(pageSource, /character\.id === "hylee" && game\.player\.sex !== "intersexe"/);
  assert.match(pageSource, /hyleeContext \? hyleeDateIntimacyRoutes[\s\S]*modal\.home \? homeIntimacyRoutes/);

  // Reveal après découverte, maintien pendant le climax, puis CG post-orgasme
  // sans retour du sprite dans la fin Hylee.
  const hyleeCg = (chapter) => cg.soloIntimateCgState({
    character: "hylee", mode: "explicite", surface: "route", step: "direction-lines", chapter,
    narrativePhase: intimacy.hyleeDateIntimacyPhase(chapter), retainRevealThroughClimax: true,
  });
  assert.equal(hyleeCg(5), undefined);
  assert.equal(hyleeCg(6)?.phase, "reveal");
  assert.equal(hyleeCg(7)?.phase, "reveal");
  assert.equal(hyleeCg(8)?.phase, "post-orgasm");
  assert.equal(hyleeCg(9)?.phase, "post-orgasm");
  assert.equal(cg.soloIntimateCgState({ character: "hylee", mode: "explicite", surface: "route", step: "ending", chapter: 9 })?.phase, "post-orgasm");

  assert.doesNotMatch(intimacySource, /polishIntimacyText|individualExplicitScene|intimacyRoutes\(/u);
  assert.match(pageSource, /const dedicatedIntimacy = Boolean\(hyleeContext/);
  assert.match(pageSource, /retainRevealThroughClimax:\s*Boolean\(hyleeContext\)/);

  console.log("[Hylee intimité] 3 contextes · 18 scènes manuelles · 720 chapitres modaux · clairière et rive conservées · logis dédié · intersexe préservé · CG sémantiques validées.");
} finally {
  await server.close();
}
