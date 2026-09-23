import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const sourceRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manualFiles = [
  "lineva-allenna-group-intimacy.ts",
  "lineva-allenna-training-intimacy.ts",
  "lineva-allenna-basin-intimacy.ts",
  "lineva-allenna-home-intimacy.ts",
];
const hrManualFiles = [
  "hylee-remerii-intimacy-shared.ts",
  "hylee-remerii-free-day-intimacy.ts",
  "hylee-remerii-wind-intimacy.ts",
  "hylee-remerii-home-intimacy.ts",
  "hylee-remerii-group-intimacy.ts",
];
const [groupSource, advancedSource, pageSource, ...manualSources] = await Promise.all([
  readFile(resolve(sourceRoot, "src/group-dates.ts"), "utf8"),
  readFile(resolve(sourceRoot, "src/group-explicit-scenes.ts"), "utf8"),
  readFile(resolve(sourceRoot, "src/page.tsx"), "utf8"),
  ...manualFiles.map((file) => readFile(resolve(sourceRoot, "src", file), "utf8")),
]);
const manualSource = manualSources.join("\n");
const hrManualSources = await Promise.all(hrManualFiles.map((file) => readFile(resolve(sourceRoot, "src", file), "utf8")));
const hrManualSource = hrManualSources.join("\n");
const contextIds = [
  "group-date-allenna-lineva-training",
  "group-date-allenna-lineva-basin",
  "group-date-allenna-lineva-home",
];
const hrContextIds = [
  "group-date-hylee-remerii-free-day",
  "group-date-hylee-remerii-wind",
  "group-date-hylee-remerii-home",
];
const sexes = ["femme", "homme", "intersexe"];
const modes = ["tendre", "suggestif", "explicite", "ellipse"];
const informalLineva = /(?<![\p{L}\p{M}])(?:tu|te|toi|ton|ta|tes)(?![\p{L}\p{M}])|(?<![\p{L}\p{M}])t[’']/iu;
const contraceptiveLanguage = /\b(?:préservatifs?|contracepti\w*|prophylacti\w*|se protéger avant|protection intime|protection contre une grossesse)\b/iu;

const server = await createServer({ root: sourceRoot, appType: "custom", logLevel: "silent", server: { middlewareMode: true } });
try {
  const [catalog, proseCatalog] = await Promise.all([
    server.ssrLoadModule("/src/group-dates.ts"),
    server.ssrLoadModule("/src/intimacy-prose.ts"),
  ]);

  const report = catalog.validateGroupIntimacyCatalog();
  assert.equal(report.pairs, 13);
  assert.equal(report.combinations, 39);
  assert.equal(report.routes, 117);
  assert.equal(report.dates, 12);
  assert.equal(report.games, 13);
  assert.ok(report.chapters >= 3798, `minimum 3798 séquences, ${report.chapters} obtenues`);
  assert.doesNotMatch(groupSource, /sequence\.length\s*!==\s*8/u, "huit doit rester un minimum, jamais un maximum");
  assert.match(groupSource, /sequence\.length\s*<\s*8/u, "le minimum de huit séquences doit être validé");

  const allRoutes = Object.values(catalog.GROUP_INTIMACY_ROUTES_BY_SEX)
    .flatMap((bySex) => Object.values(bySex))
    .flat();
  const renderedIntimacyText = allRoutes.flatMap((route) => Object.values(route.chapters).flat(2).map((line) => line.text)).join("\n");
  const gameLines = Object.entries(catalog.GROUP_INTIMACY_GAMES).flatMap(([gameId, game]) => [
    `${gameId} — ${game.title}`,
    `${gameId} — ${game.instruction}`,
    ...game.beats.flatMap((beat) => [
      `${gameId} — ${beat.prompt}`,
      `${gameId} — ${beat.detail}`,
      ...beat.options.flatMap((option) => [option.label, ...option.lines.map((line) => line.text)]).map((text) => `${gameId} — ${text}`),
    ]),
    ...Object.values(game.results).flat().map((line) => `${gameId} — ${line.text}`),
  ]);
  const openingLines = [...catalog.GROUP_DATES, ...catalog.HOME_GROUP_INTIMACY_DATES].flatMap((date) => [
    ...catalog.groupIntimacyOpening(date),
    ...catalog.groupIntimacyEnding(date),
  ].map((line) => `${date.id} — ${line.text}`));
  const intrusiveLines = [
    ...allRoutes.flatMap((route) => Object.values(route.chapters)
      .flat(2)
      .filter((line) => proseCatalog.hasIntrusiveIntimacyLanguage(line.text))
      .map((line) => `${route.id} — ${line.text}`)),
    ...gameLines.filter((entry) => proseCatalog.hasIntrusiveIntimacyLanguage(entry)),
    ...openingLines.filter((entry) => proseCatalog.hasIntrusiveIntimacyLanguage(entry)),
  ];
  assert.deepEqual(intrusiveLines, [], `formulations intrusives encore affichées :\n${intrusiveLines.slice(0, 16).join("\n")}`);

  const vocabularyFamilies = {
    intimite: ["chaleur intime", "pli de velours", "secret humide", "écrin brûlant", "rose entrouverte"],
    plaisir: ["perle sensible", "petite amande", "pointe de feu", "source du plaisir", "étincelle charnelle", "bouton de rose", "bourgeon charnel", "sommet sensible", "nœud de plaisir", "point incandescent"],
    masculin: ["membre dressé", "sexe tendu", "membre brûlant", "phallus tendu", "désir durci", "hampe tendue", "longueur brûlante", "tige dressée", "virilité tendue", "chaleur dressée"],
  };
  for (const [family, terms] of Object.entries(vocabularyFamilies)) {
    const variants = terms.filter((term) => renderedIntimacyText.includes(term));
    assert.ok(variants.length >= 4, `vocabulaire ${family} insuffisamment varié : ${variants.join(", ")}`);
  }

  const manualRoutes = contextIds.flatMap((contextId) => sexes.flatMap((sex) => catalog.groupIntimacyRoutes(contextId, sex)));
  const requiredWomanManScenes = contextIds.flatMap((contextId) => ["femme", "homme"].flatMap((sex) => catalog.groupIntimacyRoutes(contextId, sex)));
  assert.equal(manualRoutes.length, 27, "18 scènes femme/homme et 9 variantes intersexes statiques requises");
  assert.equal(requiredWomanManScenes.length, 18, "les dix-huit scènes demandées doivent exister");
  assert.ok(manualRoutes.every((route) => route.manual === true), "chaque route Lineva/Allenna doit être marquée comme littérature manuelle");

  const allArrays = [];
  const substantiveLines = [];
  for (const route of manualRoutes) {
    assert.ok(route.linevaAddress && route.progression, `${route.id}: métadonnées de tutoiement ou de progression absentes`);
    const firstTime = route.linevaAddress.firstTime.map((line) => line.text).join(" ");
    const familiar = route.linevaAddress.familiar.map((line) => line.text).join(" ");
    assert.match(firstTime, /\bvous\b/iu, `${route.id}: adresse initiale au vouvoiement absente`);
    assert.doesNotMatch(firstTime, informalLineva, `${route.id}: tutoiement présent dans la variante de première relation`);
    assert.match(familiar, informalLineva, `${route.id}: variante familière sans tutoiement`);

    for (const mode of modes) {
      const sequence = route.chapters[mode];
      assert.ok(sequence.length >= 8, `${route.id}/${mode}: huit séquences minimum`);
      assert.ok(sequence.every((chapter) => chapter.reduce((total, line) => total + line.text.trim().split(/\s+/u).length, 0) >= 12), `${route.id}/${mode}: séquence non substantielle`);
      allArrays.push(sequence, ...sequence);
      for (const line of sequence.flat()) {
        if (line.text.trim().split(/\s+/u).length > 8) substantiveLines.push(`${line.speaker}:${line.text.trim()}`);
      }

      const climaxChapter = route.progression.playerClimaxChapter[mode];
      const firstTuChapter = route.progression.linevaFirstTuChapter[mode];
      assert.ok(climaxChapter >= 0 && climaxChapter < sequence.length, `${route.id}/${mode}: chapitre de climax invalide`);
      assert.ok(firstTuChapter > climaxChapter && firstTuChapter < sequence.length, `${route.id}/${mode}: le premier tu doit suivre le climax`);
      const linevaBefore = sequence.slice(0, firstTuChapter).flat().filter((line) => line.speaker === "Lineva");
      assert.ok(
        linevaBefore.every((line) => !informalLineva.test(line.text) || /\bAllenna\b/iu.test(line.text)),
        `${route.id}/${mode}: Lineva tutoie le joueur avant le climax`,
      );
      const firstLinevaAfter = sequence.slice(firstTuChapter).flat().find((line) => line.speaker === "Lineva");
      assert.ok(firstLinevaAfter && informalLineva.test(firstLinevaAfter.text), `${route.id}/${mode}: premier tu post-climax absent`);
      const climaxText = sequence[climaxChapter].map((line) => line.text).join(" ");
      assert.match(climaxText, /plaisir|orgasme|culmine|sommet|joui|frisson/iu, `${route.id}/${mode}: climax du joueur illisible`);
    }

    assert.ok(route.chapters.explicite.length > 8, `${route.id}: la scène explicite ne doit pas être comprimée dans huit cases`);
    const explicitWords = route.chapters.explicite.flat().reduce((total, line) => total + line.text.trim().split(/\s+/u).length, 0);
    assert.ok(explicitWords >= 500, `${route.id}: scène explicite trop courte (${explicitWords} mots)`);
    const explicitText = route.chapters.explicite.flat().map((line) => line.text).join(" ");
    assert.match(explicitText, /doigts|langue|bouche|pénètr|chevauch|lèche|sexe|perle/iu, `${route.id}: chorégraphie concrète absente`);
    assert.match(explicitText, /embrass(?:e|ent)[^.!?]{0,100}(?:Allenna|Lineva)|(?:Allenna|Lineva)[^.!?]{0,100}embrass/iu, `${route.id}: contact entre Allenna et Lineva absent`);
    assert.ok((explicitText.match(/orgasme|jouit|jouir|climax/giu) || []).length >= 2, `${route.id}: climax individuels insuffisamment construits`);
    const aftercare = route.chapters.explicite.slice(-2).flat().map((line) => line.text).join(" ");
    assert.match(aftercare, /serviette|gourde|eau|fruit|dattes?|galette|couverture|tasses?|verre|petit déjeuner|matin|dorm/iu, `${route.id}: après-climax contextuel absent`);
  }

  assert.equal(new Set(allArrays).size, allArrays.length, "aucun tableau narratif ne doit être partagé entre deux scènes ou deux modes");
  const duplicateSubstantiveLines = substantiveLines.filter((line, index) => substantiveLines.indexOf(line) !== index);
  assert.deepEqual([...new Set(duplicateSubstantiveLines)], [], "aucune ligne narrative substantielle ne doit être clonée");
  const explicitSignatures = manualRoutes.map((route) => route.chapters.explicite.flat().map((line) => `${line.speaker}:${line.text}`).join("\n"));
  assert.equal(new Set(explicitSignatures).size, manualRoutes.length, "chaque scène explicite doit être intégralement unique");
  assert.deepEqual([...new Set(manualRoutes.map((route) => route.chapters.explicite.length))].sort((a, b) => a - b), [13, 14], "les scènes doivent pouvoir suivre des rythmes de longueurs différentes");

  for (const contextId of contextIds) {
    for (let index = 0; index < 3; index += 1) {
      const woman = catalog.groupIntimacyRoutes(contextId, "femme")[index].chapters.explicite.flat().map((line) => line.text).join("\n");
      const man = catalog.groupIntimacyRoutes(contextId, "homme")[index].chapters.explicite.flat().map((line) => line.text).join("\n");
      assert.notEqual(woman, man, `${contextId}/${index}: adaptation homme/femme clonée`);
    }
    const context = catalog.groupIntimacyContextById(contextId);
    assert.ok(context);
    assert.deepEqual(catalog.groupIntimacyOpening(context), [], `${contextId}: ouverture commune encore active`);
    assert.deepEqual(catalog.groupIntimacyEnding(context), [], `${contextId}: fermeture commune encore active`);
  }

  const contextVocabulary = {
    training: /banc|casiers?|vestiaires?|douches?|carrelage/iu,
    basin: /bassin|eau|pierre|rebord|alcôve/iu,
    home: /canapé|comptoir|chambre|lit|couverture|tasses?/iu,
  };
  for (const route of manualRoutes) {
    const context = route.id.includes("-training-") ? "training" : route.id.includes("-basin-") ? "basin" : "home";
    const text = route.chapters.explicite.flat().map((line) => line.text).join(" ");
    assert.match(text, contextVocabulary[context], `${route.id}: décor spécifique absent`);
  }

  assert.doesNotMatch(manualSource, /heritageExplicitPair|contextualLinevaAllennaPair|groupExplicitScene|polishIntimacyText|JSON\.stringify|JSON\.parse|GroupRole/u, "un générateur ou un clone narratif subsiste dans les scènes manuelles");
  assert.doesNotMatch(manualSource, /["'](?:first|second|shared)["']\s*:/u, "un squelette first/second/shared subsiste dans les scènes manuelles");
  assert.doesNotMatch(advancedSource, /group-date-allenna-lineva-(?:training|basin|home)/u, "Lineva/Allenna dépend encore du générateur explicite générique");
  assert.doesNotMatch(groupSource, /contextualLinevaAllennaPair/u, "le clone contextuel Lineva/Allenna doit être supprimé");
  const generatedRegistry = groupSource.slice(groupSource.indexOf("const PAIR_ROUTE_DATA"), groupSource.indexOf("function buildGroupRoute"));
  assert.doesNotMatch(generatedRegistry, /group-date-allenna-lineva/u, "Lineva/Allenna figure encore dans le registre narratif généré");
  assert.match(groupSource, /\.\.\.LINEVA_ALLENNA_MANUAL_ROUTES/u, "le catalogue manuel doit être fusionné uniquement au niveau technique");
  assert.match(pageSource, /manualGroupIntimacy \? \[\] : groupIntimacyOpening\(date\)/u, "l’interface doit ignorer l’ouverture commune pour toutes les routes manuelles");
  assert.match(pageSource, /else if \(manualGroupIntimacy\) setStep\("done"\)/u, "l’interface doit ignorer la fermeture commune pour toutes les routes manuelles");
  assert.match(pageSource, /game\.flags\.includes\("lineva-tutoiement"\)/u, "la variante de tutoiement doit dépendre du drapeau sauvegardé");
  const trioEnding = pageSource.slice(pageSource.indexOf("function finishTrioEnding"), pageSource.indexOf("function closeIntimacy"));
  assert.match(trioEnding, /if \(friendlyForThisDate\)/u, "la fin amicale doit rester un choix propre au rendez-vous courant");
  assert.match(trioEnding, /withoutObsoletePermanentFriendshipFlags\(current\.flags\)/u, "une ancienne sauvegarde verrouillée doit être nettoyée");
  assert.doesNotMatch(trioEnding, /cross-la-trio-platonic/u, "la fin amicale ne doit plus poser de verrou permanent sur le trio");
  assert.match(pageSource, />Rester complices ce soir</u, "le bouton doit annoncer clairement la portée temporaire du choix");
  assert.doesNotMatch(manualSource, contraceptiveLanguage, "une préparation contraceptive artificielle subsiste");

  const homeSource = manualSources[3];
  assert.doesNotMatch(homeSource, /\b(?:mission|rapport|protocole|paramètres?|stratégie|commandement|entraînement|exercice|amarres?|manœuvres?|poste de garde|relève de la garde)\b/iu, "le logis reprend un vocabulaire professionnel ou militaire");

  const hrRoutes = hrContextIds.flatMap((contextId) => sexes.flatMap((sex) => catalog.groupIntimacyRoutes(contextId, sex)));
  assert.equal(hrRoutes.length, 27, "les trois rendez-vous Hylee/Remerii doivent fournir trois routes pour chacun des trois corps");
  assert.ok(hrRoutes.every((route) => route.manual === true), "chaque route Hylee/Remerii doit être manuelle");
  for (const contextId of hrContextIds) {
    const context = catalog.groupIntimacyContextById(contextId);
    assert.ok(context, `${contextId}: rendez-vous public absent`);
    assert.equal(context.intimacyDisabled, undefined, `${contextId}: continuation intime encore désactivée`);
    assert.equal(context.intimacyMinDesire, 25, `${contextId}: seuil de désir incohérent`);
    assert.deepEqual(catalog.groupIntimacyOpening(context), [], `${contextId}: ouverture générique encore active`);
    assert.deepEqual(catalog.groupIntimacyEnding(context), [], `${contextId}: fermeture générique encore active`);
    for (const sex of sexes) {
      const routes = catalog.groupIntimacyRoutes(contextId, sex);
      assert.equal(routes.length, 3, `${contextId}/${sex}: trois orientations manuelles requises`);
      for (const route of routes) {
        assert.ok(route.progression, `${route.id}: progression CG/climax absente`);
        for (const mode of modes) {
          const sequence = route.chapters[mode];
          const words = sequence.flat().reduce((total, line) => total + line.text.trim().split(/\s+/u).length, 0);
          assert.ok(sequence.length >= 8, `${route.id}/${mode}: huit séquences minimum`);
          assert.ok(words >= (mode === "explicite" ? 400 : 150), `${route.id}/${mode}: scène trop courte (${words} mots)`);
          const climax = route.progression.playerClimaxChapter[mode];
          assert.ok(climax >= 0 && climax < sequence.length, `${route.id}/${mode}: climax hors séquence`);
        }
        const explicitText = route.chapters.explicite.flat().map((line) => line.text).join(" ");
        assert.match(explicitText, /Hylee/iu, `${route.id}: Hylee absente de la chorégraphie`);
        assert.match(explicitText, /Remerii/iu, `${route.id}: Remerii absente de la chorégraphie`);
        assert.match(explicitText, /embrass/iu, `${route.id}: contact entre partenaires absent`);
        assert.doesNotMatch(explicitText, /\b(?:vulves?|pénis|vagins?|clitoris)\b/iu, `${route.id}: vocabulaire clinique interdit`);
      }
    }
  }
  const hrExplicitSignatures = hrRoutes.map((route) => route.chapters.explicite.flat().map((line) => `${line.speaker}:${line.text}`).join("\n"));
  assert.equal(new Set(hrExplicitSignatures).size, hrRoutes.length, "chaque variante explicite Hylee/Remerii doit être écrite séparément");
  for (const contextId of hrContextIds) {
    for (let index = 0; index < 3; index += 1) {
      const woman = catalog.groupIntimacyRoutes(contextId, "femme")[index].chapters.explicite.flat().map((line) => line.text).join("\n");
      const man = catalog.groupIntimacyRoutes(contextId, "homme")[index].chapters.explicite.flat().map((line) => line.text).join("\n");
      const intersex = catalog.groupIntimacyRoutes(contextId, "intersexe")[index].chapters.explicite.flat().map((line) => line.text).join("\n");
      assert.notEqual(woman, man, `${contextId}/${index}: variantes femme/homme clonées`);
      assert.notEqual(woman, intersex, `${contextId}/${index}: variante intersexe clonée`);
    }
  }
  const hrContextVocabulary = {
    "group-date-hylee-remerii-free-day": /Mir’Aldas|galerie|alcôve|échoppe|établi|loggia/iu,
    "group-date-hylee-remerii-wind": /vent|manteau|abri|sentier|pierre/iu,
    "group-date-hylee-remerii-home": /logis|canapé|étagère|chambre|lit|livres?/iu,
  };
  for (const contextId of hrContextIds) {
    const text = sexes.flatMap((sex) => catalog.groupIntimacyRoutes(contextId, sex)).flatMap((route) => route.chapters.explicite.flat()).map((line) => line.text).join(" ");
    assert.match(text, hrContextVocabulary[contextId], `${contextId}: décor propre absent`);
  }
  assert.doesNotMatch(hrManualSource, /groupExplicitScene|PAIR_ROUTE_DATA|polishIntimacyText|heritageExplicitPair|contextualLinevaAllennaPair/u, "Hylee/Remerii dépend encore d’un générateur narratif générique");
  assert.match(groupSource, /\.\.\.HYLEE_REMERII_MANUAL_ROUTES/u, "le registre manuel Hylee/Remerii doit être fusionné au niveau du catalogue");
  assert.match(groupSource, /\.\.\.HYLEE_REMERII_INTIMACY_GAMES/u, "les trois mini-jeux contextuels doivent être enregistrés");
  const generatedHrRegistry = groupSource.slice(groupSource.indexOf("const PAIR_ROUTE_DATA"), groupSource.indexOf("function buildGroupRoute"));
  assert.doesNotMatch(generatedHrRegistry, /group-date-hylee-remerii-(?:free-day|wind|home)/u, "les nouveaux rendez-vous Hylee/Remerii figurent encore dans le générateur ancien");

  console.log(`[Intimité de groupe] Lineva/Allenna préservées · Hylee/Remerii : 3 contextes, 27 routes manuelles, 8+ séquences · ${report.chapters} séquences cataloguées.`);
} finally {
  await server.close();
}
