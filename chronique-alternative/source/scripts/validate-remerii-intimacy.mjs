import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => readFile(resolve(root, file), "utf8");
const server = await createServer({ root, appType: "custom", logLevel: "silent", server: { middlewareMode: true } });

const contexts = ["date-remerii-lanterns", "date-remerii-observatory", "home-remerii"];
const sexes = ["femme", "homme"];
const modes = ["tendre", "suggestif", "explicite", "ellipse"];
const phases = ["approach", "undressing", "naked-reveal", "partner-discovery", "remerii-discovery", "preliminaries", "intensification", "climax", "afterglow", "ending"];
const routeText = (route, mode = "explicite") => route.chapters[mode].flat().map((line) => line.text).join(" ");
const wordCount = (route, mode = "explicite") => routeText(route, mode).trim().split(/\s+/u).length;

try {
  const [intimacy, cg, sprites, pageSource, dateSource, intimacySource] = await Promise.all([
    server.ssrLoadModule("/src/remerii-date-intimacy.ts"),
    server.ssrLoadModule("/src/intimate-cg.ts"),
    server.ssrLoadModule("/src/sprite-system.ts"),
    read("src/page.tsx"),
    read("src/remerii-dates.ts"),
    read("src/remerii-date-intimacy.ts"),
  ]);

  assert.deepEqual(intimacy.validateRemeriiDateIntimacy(), { contexts: 3, combinations: 6, routes: 18, chapters: 720 });
  const ids = new Set();
  const labels = new Set();
  for (const context of contexts) for (const sex of sexes) {
    const routes = intimacy.remeriiDateIntimacyRoutes(context, sex);
    assert.equal(routes.length, 3, `${context}/${sex}: trois tonalités`);
    for (const route of routes) {
      assert.ok(!ids.has(route.id), `${route.id}: identifiant dupliqué`); ids.add(route.id);
      assert.ok(!labels.has(route.text), `${route.id}: intitulé dupliqué`); labels.add(route.text);
      assert.doesNotMatch(route.id, /guided|offered|mutual/iu);
      for (const mode of modes) {
        assert.equal(route.chapters[mode].length, 10, `${route.id}/${mode}: dix séquences`);
        assert.deepEqual(route.chapters[mode].map((_, index) => intimacy.remeriiDateIntimacyPhase(index)), phases);
        assert.ok(route.chapters[mode].every((chapter) => chapter.length > 0));
      }
      assert.ok(wordCount(route) >= 400, `${route.id}: scène explicite trop courte`);
      const explicit = routeText(route);
      assert.doesNotMatch(explicit, /\b(?:vulve?s?|vagin(?:s|ale?s?)?|p[eé]nis|clitoris|gland|verge|testicules?|scrotum|anus|phallus)\b/iu, `${route.id}: vocabulaire anatomique trop clinique`);
      assert.doesNotMatch(explicit, /astre du désir|constellation de plaisir|océan de feu|grotte secrète|rose entrouverte|bouton de rose|bourgeon charnel/iu, `${route.id}: image intime trop convenue`);
      assert.match(explicit, sex === "femme"
        ? /entre vos cuisses|en vous|votre chaleur|vos deux chaleurs/iu
        : /désir dressé|vous accueille|autour de vous/iu, `${route.id}: corporalité devenue trop vague`);
      route.chapters.explicite.flat().filter((line) => line.speaker === "Remerii" && line.mood).forEach((line) => {
        assert.ok(sprites.SPRITE_MOODS.remerii.includes(line.mood), `${route.id}: sprite ${line.mood} inexistant`);
      });

      const known = intimacy.remeriiDateIntimacyRoutes(context, sex, true).find((entry) => entry.id === route.id);
      const unknown = intimacy.remeriiDateIntimacyRoutes(context, sex, false).find((entry) => entry.id === route.id);
      assert.ok(known && unknown);
      assert.notEqual(routeText(known), routeText(unknown), `${route.id}: la connaissance de la cicatrice ne change rien`);
      assert.match(routeText(known), /(?:reconnaissez|reconnaît|connue)[\s\S]{0,90}(?:cicatrice|marque)|(?:cicatrice|marque)[\s\S]{0,90}(?:reconnaissez|reconnaît|connue)/iu);
      assert.match(routeText(known), /sein gauche/iu);
      assert.match(routeText(unknown), /cicatrice/iu);
      assert.match(routeText(unknown), /sein gauche/iu);
      assert.doesNotMatch(routeText(unknown), /\b(?:lame|malédiction|agresseur|attaque)\b/iu, `${route.id}: histoire révélée sans confidence`);
    }
  }
  assert.equal(ids.size, 18);
  assert.equal(labels.size, 18);

  const allRoutes = contexts.flatMap((context) => sexes.flatMap((sex) => intimacy.remeriiDateIntimacyRoutes(context, sex)));
  const publicRoutes = allRoutes.filter((route) => !route.id.startsWith("home-"));
  const publicText = publicRoutes.flatMap((route) => modes.map((mode) => routeText(route, mode))).join(" ");
  assert.doesNotMatch(publicText, /appartements? de Remerii|quartiers? de Remerii|miraldas_quarters/iu);

  for (const sex of sexes) for (const route of intimacy.remeriiDateIntimacyRoutes("date-remerii-lanterns", sex)) {
    assert.match(routeText(route), /lanterne|salon|panneau|divan/iu, `${route.id}: terrasse et salon privé absents`);
    assert.doesNotMatch(routeText(route), /\b(?:chambre|lit|matelas|oreiller)\b/iu, `${route.id}: déplacement hors du rendez-vous des lanternes`);
  }
  for (const sex of sexes) for (const route of intimacy.remeriiDateIntimacyRoutes("date-remerii-observatory", sex)) {
    assert.match(routeText(route), /observatoire|galerie|lunette|tapis|trépied|carte/iu, `${route.id}: observatoire absent`);
    assert.doesNotMatch(routeText(route), /\b(?:chambre|lit|matelas|oreiller)\b/iu, `${route.id}: déplacement hors de l'observatoire`);
  }
  for (const sex of sexes) for (const route of intimacy.remeriiDateIntimacyRoutes("home-remerii", sex)) {
    assert.match(routeText(route), /logis|maison|salon|chambre|lit|couloir/iu, `${route.id}: logis absent`);
  }

  assert.match(JSON.stringify(intimacy.REMERII_INTIMACY_OPENINGS["date-remerii-lanterns"]), /petit salon|panneaux ajourés/iu);
  assert.match(JSON.stringify(intimacy.REMERII_INTIMACY_OPENINGS["date-remerii-observatory"]), /verrouille l'accès|observatoire/iu);
  assert.match(JSON.stringify(intimacy.REMERII_INTIMACY_OPENINGS["home-remerii"]), /votre logis|salon/iu);
  assert.match(dateSource, /date-remerii-lanterns[\s\S]*?background:\s*"\/assets\/backgrounds\/miraldas_observatory\.webp"/u);
  assert.doesNotMatch(dateSource.match(/date-remerii-lanterns[\s\S]*?\n\s*\},\n\s*\{/u)?.[0] || "", /miraldas_quarters/iu);

  // L'option intersexe garde le catalogue antérieur : cette refonte ne fixe
  // pas silencieusement une anatomie encore en arbitrage.
  for (const context of contexts) assert.equal(intimacy.remeriiDateIntimacyRoutes(context, "intersexe").length, 0);
  assert.match(pageSource, /character\.id === "remerii" && game\.player\.sex !== "intersexe"/u);
  assert.match(pageSource, /remeriiContext[\s\S]*?remeriiDateIntimacyRoutes\(remeriiContext/u);
  assert.match(pageSource, /const dedicatedIntimacy = Boolean\(hyleeContext \|\| remeriiContext/u);
  assert.match(pageSource, /retainRevealThroughClimax:\s*Boolean\(hyleeContext \|\| remeriiContext\)/u);

  // La CG demeure un bonus de mise en scène : elle apparaît après la
  // découverte des corps et ne change jamais le lieu écrit.
  const state = (chapter) => cg.soloIntimateCgState({
    character: "remerii", mode: "explicite", surface: "route", step: "direction-lines", chapter,
    narrativePhase: intimacy.remeriiDateIntimacyPhase(chapter), retainRevealThroughClimax: true,
  });
  assert.equal(state(5), undefined);
  assert.equal(state(6)?.phase, "reveal");
  assert.equal(state(7)?.phase, "reveal");
  assert.equal(state(8)?.phase, "post-orgasm");
  assert.equal(state(9)?.phase, "post-orgasm");
  assert.equal(cg.soloIntimateCgState({ character: "remerii", mode: "explicite", surface: "route", step: "ending", chapter: 9 })?.phase, "post-orgasm");
  await Promise.all(["remerii_reveal.jpg", "remerii_post_orgasm.jpg"].map((file) => access(resolve(root, `../assets/intimacy-cg/${file}`))));

  assert.doesNotMatch(intimacySource, /polishIntimacyText|individualExplicitScene|intimacyRoutes\(/u);
  console.log("[Remerii intimité] 3 lieux conservés · 18 scènes manuelles · 720 chapitres modaux · deux corps écrits séparément · cicatrice, sprites et CG validés.");
} finally {
  await server.close();
}
