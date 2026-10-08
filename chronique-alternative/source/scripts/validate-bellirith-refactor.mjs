// Validateur de la refonte Bellirith (spec §53, §54, §55).
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
    name: "bellirith-refactor-test",
    enforce: "pre",
    transform(code, id) {
      if (id.endsWith("/src/page.tsx")) return `${code}\nexport { hydrateGame, createGame, DEFAULT_PLAYER, secretConversationReady, publicDateUnlocked };`;
    },
  }],
});

const BANNED = /\b(?:chatte|bite|pénis|penis|vagin|vulve|anus|testicules?|clitoris|verge|phallus|couilles?)\b/iu;
const FALSE_CANON = /pierre de stase|\bstase\b|artefact de scellement|sommeil de pierre/iu;
const OLD_AXIS = /sans aura|sans magie|séduire sans|sans charme|neutralis|devenir ordinaire|miroir honnête|tain honnête|bijoux? enchanté/iu;
const THERAPY = /thérap|guérison|guérir|patiente|soigner sa blessure|travail sur (?:elle|soi)/iu;
const words = (lines) => lines.flat().reduce((sum, line) => sum + line.text.trim().split(/\s+/u).filter(Boolean).length, 0);
const text = (value) => JSON.stringify(value);

try {
  const [intr, intimacy, living, ambientMod, belAmbient, reactions, campaign, heritage, dates, belDates, housing, housingData, page] = await Promise.all([
    server.ssrLoadModule("/src/bellirith-intrusions.ts"),
    server.ssrLoadModule("/src/bellirith-diversion-intimacy.ts"),
    server.ssrLoadModule("/src/bellirith-living-world.ts"),
    server.ssrLoadModule("/src/ambient-dialogues.ts"),
    server.ssrLoadModule("/src/bellirith-ambient.ts"),
    server.ssrLoadModule("/src/bellirith-reactions.ts"),
    server.ssrLoadModule("/src/campaign-scenes.ts"),
    server.ssrLoadModule("/src/heritages-data.ts"),
    server.ssrLoadModule("/src/date-scenes.ts"),
    server.ssrLoadModule("/src/bellirith-dates.ts"),
    server.ssrLoadModule("/src/housing-scenes.ts"),
    server.ssrLoadModule("/src/housing-data.ts"),
    server.ssrLoadModule("/src/page.tsx"),
  ]);
  const pageSource = await read("src/page.tsx");
  const counts = {};

  /* ── 1. Intrusions : jalons valides, une seule occurrence live ── */
  const campaignIds = new Set(campaign.CAMPAIGN_SCENES.map((scene) => scene.id));
  const expectedAfter = { "01": "campaign-imperial-audience", "02": "campaign-price-of-aid", "03": "campaign-amanea-letter", "04": "campaign-before-light" };
  assert.equal(intr.BELLIRITH_INTRUSIONS.length, 4, "quatre intrusions en Acte I");
  for (const intrusion of intr.BELLIRITH_INTRUSIONS) {
    assert.ok(campaignIds.has(intrusion.afterScene), `${intrusion.id} : jalon inconnu ${intrusion.afterScene}`);
    assert.equal(intrusion.afterScene, expectedAfter[intrusion.id], `${intrusion.id} : jalon attendu`);
    const empty = { flags: [], history: [] };
    assert.equal(intr.bellirithIntrusionAfter(intrusion.afterScene, empty)?.id, intrusion.id, `${intrusion.id} : doit démarrer en direct`);
    const started = { flags: [intr.bellirithIntrusionFlag(intrusion.id, "live-started")], history: [intrusion.afterScene] };
    assert.equal(intr.bellirithIntrusionAfter(intrusion.afterScene, started), undefined, `${intrusion.id} : jamais deux fois en direct`);
    const resolved = { flags: [intr.bellirithIntrusionFlag(intrusion.id, intrusion.id === "01" ? "seen" : "resisted")], history: [intrusion.afterScene] };
    assert.equal(intr.bellirithIntrusionAfter(intrusion.afterScene, resolved), undefined, `${intrusion.id} : résolue = plus d’intrusion`);
    if (intrusion.id !== "01") assert.ok(intrusion.diversion && intimacy.bellirithIntimacyContext(intrusion.diversion), `${intrusion.id} : diversion manuelle manquante`);
  }
  assert.ok(campaignIds.has("campaign-coalition-preparation"), "chapitre IX présent");

  /* ── 2. Rattrapage persistant, une invitation à la fois, sans expiration ── */
  const allHistory = Object.values(expectedAfter);
  const missedFlags = intr.markMissedBellirithIntrusions({ flags: [], history: allHistory });
  for (const id of intr.BELLIRITH_INTRUSION_IDS) assert.ok(missedFlags.includes(intr.bellirithIntrusionFlag(id, "missed")), `${id} : manquée → rattrapage`);
  const first = intr.nextBellirithCatchup({ flags: missedFlags, history: allHistory, invitations: [] });
  assert.equal(first?.id, "01", "la file de rattrapage suit l’ordre de l’Acte");
  assert.equal(intr.nextBellirithCatchup({ flags: missedFlags, history: allHistory, invitations: [{ id: first.catchupInvitationId, status: "pending" }] }), undefined, "une seule invitation de rattrapage à la fois");
  const catchups = heritage.INVITATIONS.filter((invitation) => invitation.catchup);
  assert.equal(catchups.length, 4, "quatre invitations de rattrapage");
  for (const invitation of catchups) {
    assert.equal(invitation.persistent, true, `${invitation.id} : persistante`);
    assert.equal(invitation.expiresAfter, undefined, `${invitation.id} : ne doit jamais expirer`);
    assert.ok(intr.BELLIRITH_INTRUSIONS.some((intrusion) => intrusion.catchupInvitationId === invitation.id), `${invitation.id} : intrusion associée`);
  }

  /* ── 3. Aucun malus compagnon en rattrapage ; malus live sur les « céder » ── */
  const variants = intr.allBellirithIntrusionVariants();
  counts.intrusionVariants = variants.length;
  for (const variant of variants) {
    for (const choice of variant.scene.choices) {
      if (variant.mode === "catchup") assert.equal(choice.effects.relationshipEffects, undefined, `${variant.id}/${choice.id} : malus compagnon en rattrapage`);
      assert.doesNotMatch(text(choice), BANNED, `${choice.id} : vocabulaire cru`);
    }
    if (variant.mode === "live" && variant.id !== "01") {
      const cede = variant.scene.choices.filter((choice) => intr.isBellirithCedeChoice(choice));
      assert.ok(cede.length >= 1, `${variant.id} : au moins un choix « céder »`);
      assert.ok(cede.every((choice) => Object.values(choice.effects.relationshipEffects || {}).some((effect) => Object.values(effect).some((value) => value < 0))), `${variant.id} : céder en direct coûte quelque chose aux compagnons`);
      const resist = variant.scene.choices.filter((choice) => !intr.isBellirithCedeChoice(choice));
      assert.ok(resist.length >= 1, `${variant.id} : au moins un choix « résister »`);
      assert.ok(resist.every((choice) => !choice.launchesIntimacy && !intr.bellirithDiversionForChoice(choice.id)), `${variant.id} : un refus ne mène jamais à une scène intime`);
      assert.ok(resist.every((choice) => (choice.effects.desire || 0) >= 4), `${variant.id} : résister fait monter le désir (+4 minimum)`);
      assert.ok(cede.every((choice) => (choice.effects.desire || 0) <= 1), `${variant.id} : céder ne fait presque pas monter le désir`);
      const ids = new Set(variant.scene.choices.map((choice) => choice.id));
      assert.equal(ids.size, variant.scene.choices.length, `${variant.id} : identifiants uniques`);
    }
  }
  for (const id of ["02", "03", "04"]) {
    const scene = intr.bellirithIntrusionScene(id, { flags: [], history: [] }, "live");
    for (const choice of scene.choices.filter((entry) => intr.isBellirithCedeChoice(entry))) {
      assert.ok(intimacy.bellirithIntimacyContext(intr.bellirithDiversionForChoice(choice.id)), `${choice.id} : le consentement ouvre la diversion`);
    }
  }

  /* ── 4. Tendance, favori, flags ── */
  const f = intr.bellirithIntrusionFlag;
  assert.equal(intr.bellirithTrend({ flags: [], history: [] }), "none");
  assert.equal(intr.bellirithTrend({ flags: [f("02", "resisted"), f("03", "resisted")], history: [] }), "resisted");
  assert.equal(intr.bellirithTrend({ flags: [f("02", "accepted"), f("03", "accepted")], history: [] }), "ceded");
  assert.equal(intr.bellirithTrend({ flags: [f("02", "accepted"), f("03", "resisted")], history: [] }), "mixed");
  const once = intr.bellirithFlagsWithTrend([f("02", "accepted")]);
  assert.strictEqual(intr.bellirithFlagsWithTrend(once), once, "recalcul de tendance stable (relectures sans mutation)");
  const scene02 = intr.bellirithIntrusionScene("02", { flags: [], history: [] }, "live");
  const cede02 = scene02.choices.find((choice) => intr.isBellirithCedeChoice(choice));
  const resist02 = scene02.choices.find((choice) => !intr.isBellirithCedeChoice(choice));
  const afterResist = intr.bellirithResolutionFlags([], "02", resist02, "live");
  assert.ok(afterResist.includes(intr.BELLIRITH_RESISTED_FLAG) && afterResist.includes("bellirith-trend:resisted"), "résister trace le refus");
  const afterCede = intr.bellirithResolutionFlags([f("03", "accepted")], "02", cede02, "live");
  assert.ok(afterCede.includes(intr.BELLIRITH_FAVORITE_FLAG), "deux acceptations → favori");
  assert.ok(!afterCede.includes(f("02", "live-started")) && afterCede.includes(f("02", "live")), "marqueurs temporaires retirés");

  /* ── 5. Migration v18 ── */
  const base = page.createGame({ ...page.DEFAULT_PLAYER, name: "Test Bellirith", sex: "femme" });
  const legacy = { ...base, version: 17, history: ["campaign-imperial-audience", "campaign-price-of-aid"], flags: ["campaign-imperial-audience", "campaign-price-of-aid"], invitations: [] };
  const migrated = page.hydrateGame(JSON.parse(JSON.stringify(legacy)));
  assert.equal(migrated.version, 18, "sauvegarde migrée en version 18");
  assert.ok(migrated.flags.includes(intr.BELLIRITH_MIGRATION_MARKER), "marqueur de migration");
  assert.ok(migrated.flags.includes(f("01", "missed")) && migrated.flags.includes(f("02", "missed")), "jalons passés → rattrapage");
  assert.ok(!migrated.flags.includes(f("03", "missed")), "pas de rattrapage pour un jalon non atteint");
  assert.equal(migrated.invitations.filter((entry) => entry.id.startsWith("invite-bellirith-catchup-") && entry.status === "pending").length, 1, "une seule invitation de rattrapage injectée");
  const remigrated = page.hydrateGame(JSON.parse(JSON.stringify(migrated)));
  assert.deepEqual([...remigrated.flags].sort(), [...migrated.flags].sort(), "migration idempotente");
  assert.equal(remigrated.invitations.length, migrated.invitations.length, "aucune invitation dupliquée au rechargement");
  assert.equal(Object.values(migrated.relationships).reduce((sum, rel) => sum + rel.trust, 0), Object.values(base.relationships).reduce((sum, rel) => sum + rel.trust, 0), "aucune pénalité rétroactive");

  /* ── 6. Scènes intimes manuelles : 12 séquences, minima de mots, vocabulaire, Naïah ── */
  const routes = intimacy.allBellirithIntimacyRoutes();
  const stats = {};
  for (const entry of routes) {
    for (const mode of ["tendre", "suggestif", "explicite", "ellipse"]) {
      const chapters = entry.route.chapters[mode];
      assert.ok(chapters.length >= intimacy.BELLIRITH_INTIMACY_MINIMUM_SEQUENCES, `${entry.id}/${mode} : moins de 12 séquences`);
      assert.ok(chapters.every((chapter) => chapter.length > 0), `${entry.id}/${mode}/${entry.sex} : séquence vide`);
      const total = words(chapters);
      assert.ok(total >= intimacy.BELLIRITH_INTIMACY_MINIMUM_WORDS[mode], `${entry.id}/${mode}/${entry.sex}/${entry.history} : ${total} mots`);
      (stats[mode] ||= []).push(total);
      const raw = text(chapters);
      assert.doesNotMatch(raw, BANNED, `${entry.id}/${mode}/${entry.sex} : vocabulaire cru`);
      // Naïah peut être nommée (contexte de quête) mais jamais présente dans une scène intime Bellirith.
      assert.ok(chapters.flat().every((line) => line.speaker !== "Naïah"), `${entry.id} : Naïah ne participe pas (quête croisée réservée)`);
      assert.doesNotMatch(raw, /Naïah[^.]{0,60}(?:caress|embrass|pénètr|nue?\b|désir)/iu, `${entry.id} : Naïah jamais cible sexuelle`);
      assert.doesNotMatch(raw, FALSE_CANON, `${entry.id} : faux canon`);
      assert.doesNotMatch(raw, /\{player\}\s*:\s*non\b/iu, `${entry.id} : refus dans une scène consentie`);
    }
    if (entry.route.visual) assert.ok(entry.route.visual.revealChapter < entry.route.visual.postOrgasmChapter && entry.route.visual.postOrgasmChapter < entry.route.chapters.explicite.length, `${entry.id} : progression CG`);
  }
  counts.intimacyRoutes = new Set(routes.map((entry) => entry.id)).size;
  counts.intimacyWords = Object.fromEntries(Object.entries(stats).map(([mode, list]) => [mode, { min: Math.min(...list), avg: Math.round(list.reduce((a, b) => a + b, 0) / list.length), max: Math.max(...list) }]));
  for (const context of intimacy.BELLIRITH_INTIMACY_CONTEXTS) {
    for (const sex of ["femme", "homme", "intersexe"]) {
      for (const history of intimacy.BELLIRITH_VALIDATION_HISTORIES) {
        assert.ok(intimacy.bellirithIntimacyRoutes(context, sex, history.flags).length >= 1, `${context}/${sex}/${history.label} : aucune route`);
        assert.ok(intimacy.bellirithIntimacyOpening(context, history.flags, sex).length >= 1, `${context} : ouverture manquante`);
        assert.ok(intimacy.bellirithIntimacyEnding(context, history.flags, sex).length >= 1, `${context} : fin manquante`);
        assert.ok(intimacy.bellirithIntimacyApproaches(context, history.flags, sex).length >= 2, `${context} : approches`);
        assert.doesNotMatch(text(intimacy.bellirithIntimacyOpening(context, history.flags, sex)) + text(intimacy.bellirithIntimacyEnding(context, history.flags, sex)), BANNED);
      }
    }
  }

  /* ── 7. Rendez-vous final : historique accepter / refuser ── */
  const finalDate = dates.DATE_SCENES.find((date) => date.id === intr.BELLIRITH_FINAL_DATE_ID);
  assert.ok(finalDate, "rendez-vous de fin d’Acte I présent");
  assert.equal(intimacy.bellirithIntimacyKind("date-bellirith-final"), "duel");
  const openResisted = text(intimacy.bellirithIntimacyOpening("date-bellirith-final", ["bellirith-has-resisted", "bellirith-trend:resisted"], "femme"));
  const openCeded = text(intimacy.bellirithIntimacyOpening("date-bellirith-final", ["bellirith-has-slept", "bellirith-trend:ceded"], "femme"));
  assert.notEqual(openResisted, openCeded, "le duel final tient compte de l’historique");
  assert.match(openCeded, /Maintenant/u, "c’est {player} qui dit « maintenant »");
  assert.equal(belDates.bellirithDateResultAction(intr.BELLIRITH_FINAL_DATE_ID), "« Maintenant. »");
  const belDatesList = dates.DATE_SCENES.filter((date) => date.character === "bellirith");
  assert.equal(belDatesList.length, 3, "trois rendez-vous Bellirith");
  for (const date of belDatesList) {
    assert.doesNotMatch(text(date), OLD_AXIS, `${date.id} : ancien axe « sans aura »`);
    assert.doesNotMatch(text(date), BANNED);
    const at = (stage) => ({ ...base, day: 90, relationships: { ...base.relationships, bellirith: { ...base.relationships.bellirith, met: true, stage, affection: 99, trust: 99, desire: 0 } } });
    assert.equal(page.publicDateUnlocked(at(4), date), false, `${date.id} : fermé avant la fin du fil (étape 4)`);
    assert.equal(page.publicDateUnlocked(at(5), date), true, `${date.id} : ouvert après les quatre intrusions et le chapitre IX`);
  }
  const preludeCeded = belDates.bellirithDateIntro(finalDate, { flags: ["bellirith-has-slept"], history: [] });
  const preludeResisted = belDates.bellirithDateIntro(finalDate, { flags: ["bellirith-trend:resisted"], history: [] });
  assert.notEqual(text(preludeCeded), text(preludeResisted), "prélude du rendez-vous final selon l’historique");

  /* ── 8. Confidences débloquées par le désir ── */
  const confidences = heritage.SECRET_CONVERSATIONS.filter((secret) => secret.character === "bellirith");
  assert.deepEqual(confidences.map((secret) => secret.minDesire), [20, 40, 60, 80], "paliers de désir 20/40/60/80");
  counts.confidences = confidences.length;
  for (const secret of confidences) {
    assert.doesNotMatch(text(secret), FALSE_CANON, `${secret.id} : faux canon`);
    assert.doesNotMatch(text(secret), THERAPY, `${secret.id} : registre thérapeutique`);
    assert.doesNotMatch(text(secret), BANNED);
  }
  const ready = (desire, done) => page.secretConversationReady(confidences[1], {
    ...base, day: 60, secretHistory: done, knowledge: [...base.knowledge, ...(confidences[1].requiresKnowledge || [])],
    relationships: { ...base.relationships, bellirith: { ...base.relationships.bellirith, met: true, stage: 0, affection: 0, trust: 0, desire } },
  }, false);
  assert.equal(ready(39, [confidences[0].id]), false, "désir insuffisant → confidence fermée");
  assert.equal(ready(40, [confidences[0].id]), true, "désir suffisant → confidence ouverte, sans exigence d’affection ni de confiance");
  assert.equal(ready(80, []), false, "les confidences profondes exigent les précédentes");

  /* ── 9. Faux canon retiré ── */
  const knowledgeIds = heritage.KNOWLEDGE_ENTRIES.map((entry) => entry.id);
  for (const removed of ["knows_bellirith_stasis", "knows_valurn_artifact", "heard_rumor_false_artifact", "heard_rumor_stasis"]) assert.ok(!knowledgeIds.includes(removed), `${removed} doit être retiré`);
  const bellirithWorld = text([living.BELLIRITH_CONFIDENCES, living.VALURN_BELLIRITH_CONFIDENCES, living.BELLIRITH_LETTERS, living.BELLIRITH_INVITATIONS, living.BELLIRITH_KNOWLEDGE, living.VALURN_BELLIRITH_KNOWLEDGE]);
  assert.doesNotMatch(bellirithWorld, FALSE_CANON, "le monde vivant ne dépend plus de la stase / de l’artefact");
  assert.doesNotMatch(text(heritage.LETTERS.filter((letter) => letter.character === "bellirith")), THERAPY, "courriers non thérapeutiques");
  counts.letters = heritage.LETTERS.filter((letter) => letter.character === "bellirith").length;
  const invitation = heritage.INVITATIONS.find((entry) => entry.id === "invite-bellirith-mask");
  assert.ok(invitation && !/sans aura/iu.test(invitation.title), "« Une soirée sans aura » refondue");

  /* ── 10. Moments libres ── */
  const bank = ambientMod.AMBIENT_LINES.bellirith;
  assert.strictEqual(bank, belAmbient.BELLIRITH_AMBIENT_LINES);
  assert.ok(bank.length >= 15, "au moins quinze moments libres");
  counts.freeMoments = bank.length;
  assert.doesNotMatch(text(bank), OLD_AXIS, "moments libres : ancien axe « séduire sans magie »");
  assert.doesNotMatch(text(bank), BANNED);
  const proposals = bank.filter((scene) => scene.choices.some((choice) => choice.launchesIntimacy));
  assert.ok(proposals.length >= 2 && proposals.length <= Math.ceil(bank.length / 3), `propositions sexuelles fréquentes mais pas systématiques (${proposals.length}/${bank.length})`);
  counts.freeProposals = proposals.length;
  const histories = [[], ["bellirith-has-slept"], ["bellirith-has-resisted", "bellirith-trend:resisted"], ["bellirith-has-slept", "bellirith-favorite", "bellirith-trend:ceded"]];
  for (const scene of bank) {
    for (const flags of histories) {
      if (!ambientMod.ambientAvailableForFlags(scene, flags)) continue;
      const visible = scene.choices.filter((choice) => ambientMod.choiceAvailableForFlags(choice, flags));
      assert.ok(visible.length >= 3, `${scene.id} : trois choix visibles pour ${flags.join(",") || "aucun historique"}`);
      if (visible.some((choice) => choice.launchesIntimacy)) assert.ok(visible.some((choice) => !choice.launchesIntimacy), `${scene.id} : un refus doit toujours exister`);
      for (const choice of visible.filter((entry) => entry.launchesIntimacy)) assert.ok(intimacy.bellirithIntimacyContext(choice.launchesIntimacy), `${choice.id} : contexte intime inconnu`);
    }
  }
  assert.ok(bank.some((scene) => scene.promptVariants?.length), "variantes d’ouverture selon l’historique");
  assert.ok(bank.some((scene) => scene.requiresFlags?.includes("bellirith-has-slept")) && bank.some((scene) => scene.requiresFlags?.includes("bellirith-has-resisted")), "moments propres à chaque historique");
  assert.ok(reactions.VALURN_BELLIRITH_REACTIONS.every((scene) => ambientMod.AMBIENT_LINES.valurn.includes(scene)), "réactions de Valurn branchées");
  assert.ok(reactions.IRIANA_BELLIRITH_REACTIONS.every((scene) => ambientMod.AMBIENT_LINES.iriana.includes(scene)), "réactions d’Iriana branchées");

  /* ── 11. Logis ── */
  assert.doesNotMatch(text([housing.HOME_DATE_PROFILES.bellirith, housing.RESIDENT_MOMENTS.bellirith]), OLD_AXIS, "logis : ancien axe retiré");
  assert.doesNotMatch(text(housingData.DISPLAY_ITEMS?.filter?.((item) => item.character === "bellirith") ?? []), OLD_AXIS);

  /* ── 12. Relectures protégées (contrôle statique du câblage) ── */
  assert.match(pageSource, /!dialogue\.replay && dialogue\.scene\.kind === "bellirith" && dialogue\.scene\.bellirithIntrusionId/u, "intrusion relue sans effets");
  assert.match(pageSource, /if \(dialogue\.replay\) return;\s*\n\s*if \(diversion\) openBellirithIntimacy/u, "une relecture n’ouvre pas de diversion ni n’avance le temps");
  assert.match(pageSource, /if \(completed && !modal\.replay\)/u, "intimité relue sans mutation");
  assert.match(pageSource, /const noTime = Boolean\(modal\.replay/u, "intimité relue sans temps consommé");
  assert.match(pageSource, /!dialogue\.replay && dialogue\.chosen\?\.launchesIntimacy/u, "proposition relue sans nouvelle intimité");

  /* ── 13. Acte I : Bellirith sans route classique ── */
  const gameData = await server.ssrLoadModule("/src/game-data.ts");
  assert.equal(gameData.ROUTE_SCENES.filter((route) => route.character === "bellirith").length, 0, "pas de route de guérison en Acte I");
  const fiche = gameData.CHARACTERS.find((character) => character.id === "bellirith");
  assert.doesNotMatch(text(fiche), /Accords secrets avec Naïah|sans aura/iu, "fiche et itinéraire refondus");

  /* ── 14. Style : ni tiret cadratin, ni formule « ce n’est pas X, c’est Y » ── */
  const STYLE_DASH = /[—–]/u;
  const STYLE_CONTRAST = /n[’']est pas[^!?«»"]{0,80}[,;.:]\s*c[’']est\b|n[’']était pas[^!?«»"]{0,80}[,;.:]\s*c[’']était\b/iu;
  const strings = (value, out = []) => {
    if (typeof value === "string") out.push(value);
    else if (Array.isArray(value)) value.forEach((entry) => strings(entry, out));
    else if (value && typeof value === "object") Object.values(value).forEach((entry) => strings(entry, out));
    return out;
  };
  const styleCorpus = [];
  const addStyle = (label, value) => strings(value).forEach((entry) => styleCorpus.push([label, entry]));
  addStyle("intrusions", intr.allBellirithIntrusionVariants().map((entry) => entry.scene));
  addStyle("intimités", routes.map((entry) => entry.route));
  for (const context of intimacy.BELLIRITH_INTIMACY_CONTEXTS) {
    for (const sex of ["femme", "homme", "intersexe"]) {
      for (const history of intimacy.BELLIRITH_VALIDATION_HISTORIES) {
        for (const source of [undefined, ...intimacy.BELLIRITH_FREE_SOURCES]) {
          addStyle(`${context}/ouverture`, intimacy.bellirithIntimacyOpening(context, history.flags, sex, source));
          addStyle(`${context}/fin`, intimacy.bellirithIntimacyEnding(context, history.flags, sex, source));
        }
        addStyle(`${context}/approches`, intimacy.bellirithIntimacyApproaches(context, history.flags, sex));
      }
    }
  }
  for (const date of belDatesList) {
    addStyle(date.id, date);
    for (const flags of histories) {
      addStyle(`${date.id}/prélude`, belDates.bellirithDateIntro(date, { flags, history: [] }));
      addStyle(`${date.id}/issue`, belDates.bellirithDateResultText(date.id, { flags, history: [] }));
    }
  }
  addStyle("confidences", confidences);
  addStyle("monde vivant", [living.BELLIRITH_CONFIDENCES, living.VALURN_BELLIRITH_CONFIDENCES, living.BELLIRITH_LETTERS, living.BELLIRITH_INVITATIONS, living.BELLIRITH_KNOWLEDGE, living.VALURN_BELLIRITH_KNOWLEDGE]);
  addStyle("courriers", heritage.LETTERS.filter((letter) => letter.character === "bellirith"));
  addStyle("invitations", heritage.INVITATIONS.filter((entry) => entry.character === "bellirith"));
  addStyle("moments libres", [bank, reactions.VALURN_BELLIRITH_REACTIONS, reactions.IRIANA_BELLIRITH_REACTIONS]);
  addStyle("logis", [housing.HOME_DATE_PROFILES.bellirith, housing.RESIDENT_MOMENTS.bellirith, [...housingData.STORY_KEEPSAKES, ...housingData.HOME_DATE_GIFTS].filter((item) => item.character === "bellirith")]);
  const housingSource = await read("src/housing-scenes.ts");
  addStyle("logis (commentaires)", housingSource.match(/^ {2}bellirith: (?:\[[\s\S]*?^ {2}\],|"[^\n]*",)$/gmu) || []);
  addStyle("fiche", [fiche, gameData.INTIMACY_TEXT.bellirith]);
  for (const flags of histories) addStyle("fil", intr.bellirithThreadSummary({ flags, history: [], dateHistory: [] }));
  for (const scene of campaign.CAMPAIGN_SCENES) {
    addStyle(`${scene.id}/Bellirith`, strings(scene).filter((entry) => /Bellirith/u.test(entry)));
  }
  assert.ok(styleCorpus.length > 1000, `corpus de style trop petit (${styleCorpus.length})`);
  const dashHits = styleCorpus.filter(([, entry]) => STYLE_DASH.test(entry));
  assert.equal(dashHits.length, 0, `tiret cadratin dans le texte de Bellirith : ${dashHits.slice(0, 3).map(([label, entry]) => `${label} « ${entry.slice(0, 80)} »`).join(" | ")}`);
  const contrastHits = styleCorpus.filter(([, entry]) => STYLE_CONTRAST.test(entry));
  assert.equal(contrastHits.length, 0, `formule « ce n’est pas X, c’est Y » : ${contrastHits.slice(0, 3).map(([label, entry]) => `${label} « ${entry.slice(0, 80)} »`).join(" | ")}`);
  const sourceFiles = ["bellirith-ambient", "bellirith-dates", "bellirith-diversion-intimacy", "bellirith-intimacy-before-light", "bellirith-intimacy-coalition", "bellirith-intimacy-duel", "bellirith-intimacy-frames", "bellirith-intimacy-free", "bellirith-intimacy-kit", "bellirith-intimacy-price-of-aid", "bellirith-intimacy-return-akuhn", "bellirith-intrusions", "bellirith-living-world", "bellirith-reactions"];
  for (const name of sourceFiles) {
    const code = (await read(`src/${name}.ts`)).replace(/\/\*[\s\S]*?\*\//gu, "").replace(/^\s*\/\/.*$/gmu, "");
    assert.doesNotMatch(code, STYLE_DASH, `${name}.ts : tiret cadratin dans une chaîne`);
    assert.doesNotMatch(code, STYLE_CONTRAST, `${name}.ts : formule « ce n’est pas X, c’est Y »`);
  }
  counts.styleStrings = styleCorpus.length;

  console.log(`Bellirith validée · ${counts.intrusionVariants} variantes d’intrusion · ${counts.intimacyRoutes} routes intimes · ${counts.confidences} confidences · ${counts.letters} courriers · ${counts.freeMoments} moments libres (${counts.freeProposals} propositions) · style vérifié sur ${counts.styleStrings} chaînes`);
  console.log(`Mots par mode (min/moy/max) : ${Object.entries(counts.intimacyWords).map(([mode, s]) => `${mode} ${s.min}/${s.avg}/${s.max}`).join(" · ")}`);
} finally {
  await server.close();
}
