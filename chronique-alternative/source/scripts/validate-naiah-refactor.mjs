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
      if (id.endsWith("/src/page.tsx")) return `${code}\nexport { hydrateGame, createGame, DEFAULT_PLAYER, publicDateUnlocked, homeDateUnlocked };`;
    },
  }],
});

try {
  const [game, heritage, ambient, social, campaign, world, closures, page, dates, dateWriting, housing, housingData, proximity, groupProximity, groups, soloRoutes, homeRoutes, intimateCg, intimateSprites] = await Promise.all([
    server.ssrLoadModule("/src/game-data.ts"),
    server.ssrLoadModule("/src/heritages-data.ts"),
    server.ssrLoadModule("/src/ambient-dialogues.ts"),
    server.ssrLoadModule("/src/social-scenes.ts"),
    server.ssrLoadModule("/src/campaign-scenes.ts"),
    server.ssrLoadModule("/src/world-data.ts"),
    server.ssrLoadModule("/src/scene-closures.ts"),
    server.ssrLoadModule("/src/page.tsx"),
    server.ssrLoadModule("/src/date-scenes.ts"),
    server.ssrLoadModule("/src/naiah-dates.ts"),
    server.ssrLoadModule("/src/housing-scenes.ts"),
    server.ssrLoadModule("/src/housing-data.ts"),
    server.ssrLoadModule("/src/naiah-date-intimacy.ts"),
    server.ssrLoadModule("/src/naiah-group-proximity.ts"),
    server.ssrLoadModule("/src/group-dates.ts"),
    server.ssrLoadModule("/src/intimacy-routes.ts"),
    server.ssrLoadModule("/src/home-intimacy-routes.ts"),
    server.ssrLoadModule("/src/intimate-cg.ts"),
    server.ssrLoadModule("/src/intimate-sprite-system.ts"),
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
  assert.match(secretText, /cent quarante et deux cents morts|calculé jusqu'aux morts/iu, "la lucidité stratégique et la dangerosité de Naïah doivent rester visibles");
  assert.match(secretText, /une idée ne devient pas innocente/iu);
  assert.doesNotMatch(secretText, /tartelette|plus de sujets|une couronne plus haute|pacte de Llorea|Naïah meurt/iu);
  assert.doesNotMatch(secretText, /Comité des réponses insuffisantes|inspecteur compétent|formulaire entièrement blanc/iu, "le rebond ne doit plus reposer sur la bureaucratie");
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

  const naiahSources = await Promise.all([
    read("src/naiah-relation.ts"),
    read("src/naiah-confidences.ts"),
    read("src/naiah-ambient.ts"),
    read("src/naiah-dates.ts"),
    read("src/naiah-home-date.ts"),
    read("src/naiah-date-intimacy.ts"),
    read("src/naiah-date-intimacy-types.ts"),
    read("src/naiah-date-intimacy-forest.ts"),
    read("src/naiah-date-intimacy-edge.ts"),
    read("src/naiah-date-intimacy-home.ts"),
    read("src/naiah-group-proximity.ts"),
  ]);
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
  assert.ok(migrated.version >= 17, "la migration Naïah doit produire une sauvegarde au moins en version 17 (18 depuis la refonte Bellirith)");
  assert.ok(migrated.knowledge.includes("knows_naiah_hylee_nights"));
  assert.ok(migrated.knowledge.includes("knows_hylee_naiah_nights"));
  assert.ok(migrated.knowledge.includes("heard_rumor_naiah_guardian"));
  assert.ok(migrated.secretHistory.includes("secret-naiah-hylee-nights"));
  assert.ok(migrated.secretHistory.includes("secret-hylee-naiah-nights"));
  assert.ok(migrated.rumors.some((entry) => entry.id === "rumor-forbidden-guardian"));
  assert.equal(migrated.letters.find((entry) => entry.id === "letter-naiah-margin")?.replyId, "naiah-verso");

  const naiahDates = dates.DATE_SCENES.filter((date) => date.character === "naiah");
  assert.deepEqual(naiahDates.map((date) => date.id), ["date-naiah-sanctuary", "date-naiah-akuhn"]);
  assert.deepEqual(naiahDates.map((date) => date.title), ["Le jeu des apparences", "Au bord de son royaume"]);
  assert.ok(naiahDates.every((date) => date.unlockStage === 5 && date.minDesire === 24));
  assert.ok(naiahDates.every((date) => date.intro.length >= 12 && date.choices.length === 3), "les rendez-vous publics doivent disposer d'une vraie scène d'ouverture");
  assert.deepEqual([...new Set(naiahDates.flatMap((date) => [date.choices, ...[0, 1, 2].map((round) => dateWriting.naiahDateBeat(date.id, round)?.choices || [])]).flat().map((choice) => choice.stat))].sort(), ["audace", "lucidite", "resonance", "sangFroid"]);

  const homeProfile = housing.HOME_DATE_PROFILES.naiah;
  assert.equal(homeProfile.title, "Une place qui n’était pas là");
  assert.equal(homeProfile.rounds.length, 3);
  assert.equal(homeProfile.rounds.flatMap((round) => round.options).length, 9);

  const playable = page.createGame({ ...page.DEFAULT_PLAYER, name: "Test Naïah", sex: "femme" });
  playable.relationships.naiah = { ...playable.relationships.naiah, met: true, stage: 5, affection: 60, trust: 60, desire: 30 };
  playable.housing.propertyId = housingData.HOUSING_PROPERTIES[0].id;
  assert.ok(naiahDates.every((date) => page.publicDateUnlocked(playable, date)), "les deux rendez-vous publics doivent être indépendamment accessibles");
  playable.dateHistory = [naiahDates[0].id];
  assert.ok(page.publicDateUnlocked(playable, naiahDates[1]), "le premier rendez-vous ne doit pas conditionner le second");
  playable.dateHistory = [naiahDates[1].id];
  assert.ok(page.publicDateUnlocked(playable, naiahDates[0]), "le second rendez-vous ne doit pas conditionner le premier");
  assert.ok(page.homeDateUnlocked(playable, "naiah"), "le rendez-vous au logis doit être indépendant des deux sorties publiques");

  assert.deepEqual(proximity.validateNaiahProximity(), { contexts: 3, combinations: 6, routes: 18, chapters: 648 });
  const contexts = ["date-naiah-sanctuary", "date-naiah-akuhn", "home-naiah"];
  const modes = ["tendre", "suggestif", "explicite", "ellipse"];
  const sequenceCounts = { tendre: 8, suggestif: 8, explicite: 12, ellipse: 8 };
  const sexualLanguage = /\b(?:orgasme|joui(?:r|t|ssance)?|sexe|nud(?:e|it[eé])|d[eé]shabill\w*)\b/iu;
  const explicitSexualAction = /\b(?:orgasme|joui(?:r|t|ssance)?|bouche|langue|sexe|entre (?:vos|tes|ses) cuisses)\b/iu;
  const forbiddenPenetration = /\b(?:p[eé]n[eé]tr\w*|s['’]enfonc\w*|introdui\w*.{0,24}(?:anus|vagin|corps)|doigts?.{0,18}(?:entrent|s['’]enfoncent).{0,18}(?:corps|sexe|anus|vagin))\b/iu;
  const clinicalLanguage = /(?:r[eé]ponse physiologique|r[eé]sultat exp[eé]rimental|protocole (?:de|du|d['’]essai)|variables? (?:du|de l['’])exp[eé]rience|donn[eé]es? (?:physiologiques|exp[eé]rimentales)|seuil (?:de r[eé]action|physiologique|sensoriel))/iu;
  for (const context of contexts) for (const sex of ["femme", "homme"]) {
    const entries = proximity.naiahProximityRoutes(context, sex);
    assert.equal(entries.length, 3, `${context}/${sex}: trois orientations manuelles requises`);
    assert.equal(new Set(entries.map((entry) => entry.id)).size, 3);
    for (const entry of entries) {
      assert.equal(new Set(modes.map((mode) => JSON.stringify(entry.chapters[mode]))).size, 4, `${entry.id}: les quatre modes doivent être écrits séparément`);
      for (const mode of modes) {
        const sequence = entry.chapters[mode];
        const chapterCounts = sequence.map((chapter) => chapter.reduce((total, line) => total + line.text.trim().split(/\s+/u).length, 0));
        assert.equal(sequence.length, sequenceCounts[mode], `${entry.id}/${mode}: ${sequenceCounts[mode]} séquences requises`);
        assert.ok(chapterCounts.every((count) => count >= 18), `${entry.id}/${mode}: une séquence n'est pas substantielle (${chapterCounts.join(", ")})`);
        const fullText = sequence.flat().map((line) => line.text).join("\n");
        assert.doesNotMatch(fullText, forbiddenPenetration, `${entry.id}/${mode}: pénétration interdite détectée`);
        assert.doesNotMatch(fullText, clinicalLanguage, `${entry.id}/${mode}: langage clinique détecté`);
      }
      const explicitText = entry.chapters.explicite.flat().map((line) => line.text).join("\n");
      const explicitDialogue = entry.chapters.explicite.flat().filter((line) => line.speaker !== "Narration");
      assert.ok(explicitDialogue.length >= 4, `${entry.id}: la version explicite doit réellement faire dialoguer Naïah et le protagoniste`);
      assert.match(explicitText, explicitSexualAction, `${entry.id}: le mode explicite doit contenir une vraie continuation sexuelle non pénétrative`);
      assert.match(explicitText, /(?:orgasme|joui(?:r|t|ssance)?)/iu, `${entry.id}: la progression explicite doit aller jusqu'à son terme`);
      assert.match(entry.chapters.explicite[2].map((line) => line.text).join(" "), /(?:retir|d[eé]shabill|v[eê]tement|chemise|veste|cape|pantalon|nue?)/iu, `${entry.id}: la nudité doit être racontée avant la CG`);
      assert.match(entry.chapters.explicite[3].map((line) => line.text).join(" "), /(?:r[eé]v[eè]le|nue?|nudit[eé]|peau)/iu, `${entry.id}: la révélation visuelle doit prolonger la nudité racontée`);
    }
  }
  for (const context of contexts) {
    const woman = proximity.naiahProximityRoutes(context, "femme");
    const man = proximity.naiahProximityRoutes(context, "homme");
    assert.deepEqual(woman.map((entry) => entry.text), man.map((entry) => entry.text), `${context}: femme et homme doivent partager les mêmes trois concepts`);
  }
  assert.equal(proximity.naiahProximityRoutes("home-naiah", "intersexe").length, 0, "aucun canon corporel intersexe ne doit être improvisé");

  const authoredIntimacySource = [
    await read("src/naiah-date-intimacy-forest.ts"),
    await read("src/naiah-date-intimacy-edge.ts"),
    await read("src/naiah-date-intimacy-home.ts"),
  ].join("\n");
  assert.doesNotMatch(authoredIntimacySource, /PAIR_ROUTE_DATA|(?:role|route|position)\s*:\s*["'](?:first|second|shared)["']|\.replace\s*\(/u, "les dix-huit variantes doivent rester manuelles et non générées");
  assert.doesNotMatch(authoredIntimacySource, /\bCG\b/u, "la narration ne doit jamais nommer la mécanique de CG au joueur");
  assert.doesNotMatch(authoredIntimacySource, forbiddenPenetration, "aucune route Naïah ne doit contenir de pénétration");
  assert.doesNotMatch(authoredIntimacySource, clinicalLanguage, "les scènes intimes ne doivent pas adopter un vocabulaire clinique");
  assert.doesNotMatch(authoredIntimacySource, /\b(?:sexe|testicules?|vagins?|p[eé]nis|penis|penix|sternum)\b/iu, "le vocabulaire intime ne doit pas devenir anatomique ou médical");

  assert.equal(soloRoutes.intimacyRoutes("naiah", "femme").length, 0, "Naïah ne doit plus dépendre des routes sexuelles individuelles génériques");
  assert.equal(homeRoutes.homeIntimacyRoutes("naiah", "femme").length, 0, "Naïah ne doit plus dépendre des routes sexuelles génériques du logis");
  assert.ok(intimateCg.SOLO_INTIMATE_CG.naiah.reveal.endsWith("assets/intimacy-cg/naiah_reveal.jpg"), "la CG doit introduire les placeholders Naïah");
  assert.ok(intimateCg.DUO_INTIMATE_CG["group-date-hylee-naiah"].reveal.endsWith("assets/intimacy-cg/hylee_naiah_reveal.jpg"));
  assert.ok(intimateCg.DUO_INTIMATE_CG["group-date-naiah-bellirith"].reveal.endsWith("assets/intimacy-cg/naiah_bellirith_reveal.jpg"));
  assert.equal(intimateSprites.hasIntimateSprites("naiah"), true, "les placeholders intimes de Naïah doivent être enregistrés");
  assert.ok(intimateSprites.intimateSpritePath("naiah", "laugh").endsWith("assets/sprites-intimate/naiah/laugh.png"));

  assert.deepEqual(groupProximity.validateNaiahGroupProximity(), { contexts: 2, combinations: 6, routes: 18, chapters: 576 });
  for (const pairId of groupProximity.NAIAH_GROUP_CONTEXT_IDS) for (const sex of ["femme", "homme", "intersexe"]) {
    const entries = groups.groupIntimacyRoutes(pairId, sex);
    assert.equal(entries.length, 3, `${pairId}/${sex}: trois routes de proximité à trois requises`);
    assert.ok(groups.isManualGroupIntimacy(pairId), `${pairId}: le contexte dédié doit contourner le générateur sexuel`);
    assert.doesNotMatch(entries.flatMap((entry) => modes.flatMap((mode) => entry.chapters[mode].flat().map((line) => line.text))).join("\n"), sexualLanguage, `${pairId}/${sex}: ancienne route sexuelle encore rendue`);
  }

  assert.ok(naiahSources.every((source) => !/speaker:\s*["']Amanea["']/.test(source)), "aucune interaction directe Amanea/Naïah ne doit être créée dans les rendez-vous");

  const pageSource = await read("src/page.tsx");
  assert.match(pageSource, /AUTHORED_DATE_CHARACTERS = new Set\(\["hylee", "remerii", "naiah"\]\)/u);
  assert.match(pageSource, /DEDICATED_HOME_DATE_CHARACTERS = new Set\(\["hylee", "remerii", "naiah"\]\)/u);
  assert.match(pageSource, /Souvenir intime/u);
  assert.match(pageSource, /game\.player\.sex === "intersexe"/u, "le blocage intersexe doit être expliqué avant l'ouverture d'une continuation");

  console.log(`[Naïah] 5 quêtes · 4 confidences · 18 moments libres · 2 sorties + 1 logis · 18 continuations sexuelles manuelles non pénétratives · groupes dédiés · migration v17 validés.`);
} finally {
  await server.close();
}
