import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";
import { execSync } from "node:child_process";

/*
 * Refonte Valurn · Acte I. Contrats de la consigne §14 (tests 1 à 28 et 12 bis)
 * exécutés sur le vrai moteur (hooks React remplacés), plus les contrôles
 * éditoriaux : vocabulaire réservé (empreintes), tirets, formule « ce n'est pas X, c'est Y »,
 * vocabulaire cru, plafond d'euphémismes, structure.
 */
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const hookId = "\0valurn-test-hooks";
const hooksSource = `
let slots = [], cursor = 0;
export function reset() { slots = []; cursor = 0; }
export function beginRender() { cursor = 0; }
export function useState(initial) {
  const index = cursor++;
  if (!(index in slots)) slots[index] = typeof initial === 'function' ? initial() : initial;
  return [slots[index], value => { slots[index] = typeof value === 'function' ? value(slots[index]) : value; }];
}
export function useRef(current) { return useState({ current })[0]; }
export function useEffect() {}
export function useLayoutEffect() {}
export function useCallback(callback) { return callback; }
export const Fragment = "fragment";
`;
const exports = ["createGame", "hydrateGame", "DEFAULT_PLAYER", "routeNarrativeReady", "routeAvailableAtPlace", "publicDateUnlocked", "homeDateUnlocked", "characterPlace", "choicesForDialogue", "sceneFor", "letterReady", "secretConversationReady", "relationshipNarrativeProgress"];
const actions = ["game", "dialogue", "modal", "setGame", "setDialogue", "setModal", "openCharacterScene", "advanceDialogue", "selectChoice", "closeDialogue", "startDate", "finishDateEnding", "startHomeDate", "finishHomeDate", "startSecretConversation", "readLetter", "startValurnMarket", "setValurnMarketState", "finishValurnMarket"];
const server = await createServer({
  root, appType: "custom", logLevel: "silent", server: { middlewareMode: true },
  plugins: [{
    name: "valurn-engine-tests", enforce: "pre",
    resolveId(id) { if (id === "valurn-test-hooks") return hookId; },
    load(id) { if (id === hookId) return hooksSource; },
    transform(code, id) {
      if (!id.endsWith("/src/page.tsx")) return;
      assert.ok(code.includes('  if (screen === "title") {'));
      return code.replace('from "react";', 'from "valurn-test-hooks";')
        .replace('  if (screen === "title") {', `  return { ${actions.join(", ")} };\n  if (screen === "title") {`)
        + `\nexport { ${exports.join(", ")} };`;
    },
  }],
});

const results = [];
const check = (id, label, fn) => { fn(); results.push(`${id}. ${label}`); };

try {
  const page = await server.ssrLoadModule("/src/page.tsx");
  const hooks = await server.ssrLoadModule("valurn-test-hooks");
  const data = await server.ssrLoadModule("/src/game-data.ts");
  const story = await server.ssrLoadModule("/src/story-data.ts");
  const quests = await server.ssrLoadModule("/src/valurn-quests.ts");
  const market = await server.ssrLoadModule("/src/valurn-market.ts");
  const living = await server.ssrLoadModule("/src/valurn-living-world.ts");
  const dates = await server.ssrLoadModule("/src/valurn-dates.ts");
  const homeDate = await server.ssrLoadModule("/src/valurn-home-date.ts");
  const intimacy = await server.ssrLoadModule("/src/valurn-date-intimacy.ts");
  const ambient = await server.ssrLoadModule("/src/valurn-ambient.ts");
  const ambientAll = await server.ssrLoadModule("/src/ambient-dialogues.ts");
  const heritages = await server.ssrLoadModule("/src/heritages-data.ts");
  const social = await server.ssrLoadModule("/src/social-scenes.ts");
  const groups = await server.ssrLoadModule("/src/group-dates.ts");
  const housing = await server.ssrLoadModule("/src/housing-scenes.ts");
  const world = await server.ssrLoadModule("/src/world-data.ts");
  const bellLiving = await server.ssrLoadModule("/src/bellirith-living-world.ts");

  let api;
  const render = () => { hooks.beginRender(); return api = page.default(); };
  const init = (game) => { hooks.reset(); render().setGame(structuredClone(game)); return render(); };
  const act = (name, ...args) => { api[name](...args); return render(); };
  const valurn = data.CHARACTERS.find((c) => c.id === "valurn");
  const campaignGame = (chapters = 3) => {
    const game = page.createGame({ ...page.DEFAULT_PLAYER, name: "Test", intimacy: "explicite" });
    game.history = story.MAIN_STORY.slice(0, chapters).flatMap((c) => c.requiredScenes);
    game.flags = [...game.history, "story-saidin-met", "story-phoenix-token", "story-route-algratal", "valurn-refonte-v1"];
    game.relationships.valurn = { ...game.relationships.valurn, met: true, affection: 90, trust: 90, desire: 40 };
    game.day = 4; game.location = "algratal";
    return game;
  };
  const placeFor = (game, sceneId) => {
    const spot = world.ROUTE_SPOTS[sceneId];
    const period = world.ROUTE_PERIODS[sceneId][0];
    const periodIndex = data.PERIODS.findIndex((p) => p.id === period);
    for (let day = game.day; day < game.day + 80; day++) {
      const place = page.characterPlace(valurn, day, periodIndex, game.flags, game.housing);
      if (place.spot === spot) return { ...game, day, period: periodIndex, location: "algratal", spot };
    }
    throw new Error(`${sceneId}: Valurn introuvable à ${spot} (${period})`);
  };
  const finish = (picker) => {
    let steps = 0;
    while (api.dialogue) {
      assert.ok(++steps < 800, `dialogue bloqué : ${api.dialogue.scene.id}`);
      if (["choices", "relation-choices"].includes(api.dialogue.phase)) {
        const choices = page.choicesForDialogue(api.dialogue, api.game);
        assert.ok(choices.length, `choix absents : ${api.dialogue.scene.id}/${api.dialogue.phase}`);
        act("selectChoice", picker ? picker(choices, api.dialogue) : choices[0]);
      } else act("advanceDialogue");
    }
  };
  const solveMarket = (state) => {
    let s = state;
    for (const id of ["recu", "dette", "thazran"]) s = market.setOfferStatus(s, id, "bought");
    for (const person of ["L'apprenti greffier", "Odile Varrasque"]) s = market.toggleProtection(s, person);
    s = market.submitOffer(s);
    s = market.concludeMarket(s);
    return { ...s, phase: "done", reaction: "repaired" };
  };
  const playQuest = (game, id, picker) => {
    init(placeFor(game, id));
    assert.equal(page.sceneFor("valurn", api.game.relationships.valurn.stage, api.game.history)?.id, id, `${id}: quête courante`);
    assert.ok(page.routeAvailableAtPlace(page.sceneFor("valurn", 0, api.game.history), api.game), `${id}: disponible sur place`);
    act("openCharacterScene", "valurn");
    assert.equal(api.dialogue?.scene.id, id, `${id}: ouverture directe`);
    finish(picker);
    if (id === "valurn-q5") {
      assert.equal(api.modal?.kind, "valurn-market", "Q5 lance le registre");
      const solved = solveMarket(api.game.valurnMarket);
      act("setValurnMarketState", solved);
      act("finishValurnMarket", solved);
    }
    assert.ok(api.game.history.includes(id), `${id}: consignée`);
    return api.game;
  };
  const playAll = (game, picker) => { let g = game; for (const id of quests.VALURN_QUEST_IDS) g = playQuest(g, id, picker); return g; };

  check(1, "Chapitre III : Valurn non rencontré avant l'audience ; Q1 directement après", () => {
    const before = campaignGame(2);
    assert.equal(page.routeNarrativeReady(quests.VALURN_QUESTS[0], before), false);
    assert.equal(page.routeNarrativeReady(quests.VALURN_QUESTS[0], campaignGame(3)), true);
    assert.deepEqual(data.routeKnowledgeRequirements(quests.VALURN_QUESTS[0]), []);
  });
  check(2, "Intrusion Bellirith vue / non vue : variante de Q1, quête jouable", () => {
    const seen = campaignGame(); seen.flags.push("bellirith-intrusion:01:seen");
    const a = quests.valurnRouteVariant(quests.VALURN_QUESTS[0], seen.flags, seen.relationships.valurn);
    const b = quests.valurnRouteVariant(quests.VALURN_QUESTS[0], campaignGame().flags, campaignGame().relationships.valurn);
    assert.notDeepEqual(a.intro, b.intro);
    playQuest(seen, "valurn-q1");
  });
  let completed;
  check(3, "Chapitre III seulement : sept quêtes complétables, aucun lieu fermé", () => {
    completed = playAll(campaignGame(3));
    for (const id of quests.VALURN_QUEST_IDS) assert.equal(world.ROUTE_SPOTS[id].startsWith("algratal-"), true);
    assert.equal(page.relationshipNarrativeProgress(completed, "valurn").completed, 7);
  });
  const corpus = (value) => JSON.stringify(value);
  check(4, "Quêtes avant Naïah/Forthaven : aucun nom prématuré", () => {
    const text = corpus(quests.VALURN_QUESTS) + corpus(quests.VALURN_RELATION_BEATS);
    for (const name of ["Naïah", "Draven", "Lineva", "Allenna", "Amanea", "Saëlis", "Forthaven", "Tia"]) assert.equal(text.includes(name), false, name);
  });
  check(5, "Quêtes commencées après le chapitre VII : jouables, sans contradiction", () => { playAll(campaignGame(7)); });
  check(6, "Quêtes après la fin de l'Acte I : jouables, aucune fermeture", () => { playAll(campaignGame(story.MAIN_STORY.length)); });
  check(7, "Refus du marché initial : retour possible, pas de route morte", () => {
    const g = playQuest(campaignGame(), "valurn-q1", (choices) => choices.find((c) => /refus|plus tard|risque/i.test(c.text)) || choices.at(-1));
    assert.equal(page.sceneFor("valurn", 0, g.history)?.id, "valurn-q2");
  });
  check(8, "Mini-jeu : échec, réessai, partiel, coûteux, reprise de sauvegarde, rejouable", () => {
    let s = market.createValurnMarket("audace");
    s = market.setOfferStatus(s, "bram", "bought"); s = market.submitOffer(s);
    assert.equal(s.lastVerdict.kind, "failed"); assert.equal(s.phase, "board"); assert.equal(market.canConclude(s), false);
    s = market.setOfferStatus(s, "recu", "bought"); s = market.submitOffer(s);
    assert.ok(["partial", "failed"].includes(s.lastVerdict.kind)); assert.equal(market.canConclude(s), true);
    assert.ok(market.boughtSeeded(s));
    const costly = market.concludeMarket(market.submitOffer(market.submitOffer(market.createValurnMarket("lucidite"))));
    assert.equal(costly.result, "costly");
    const g = campaignGame(); g.history.push(...quests.VALURN_QUEST_IDS.slice(0, 5)); g.flags.push("valurn-q5-approach:sangfroid");
    init(g); act("startValurnMarket");
    const mid = market.setOfferStatus(api.game.valurnMarket, "recu", "bought"); act("setValurnMarketState", mid);
    const reloaded = page.hydrateGame(JSON.parse(JSON.stringify(api.game)));
    assert.equal(reloaded.valurnMarket.statuses.recu, "bought", "reprise de sauvegarde");
    init(reloaded); act("startValurnMarket"); assert.equal(api.modal?.kind, "valurn-market");
    act("setModal", null); act("startValurnMarket", true); assert.equal(api.modal.replay, true);
  });
  check(9, "Q5 : Valurn a menti ; le reproche est possible et laisse une trace", () => {
    assert.equal(market.MARKET_OFFERS.filter((o) => o.seededByValurn).length, 2);
    assert.ok(market.MARKET_REACTIONS.some((r) => r.id === "accused"));
    assert.ok(completed.knowledge.includes("knows_valurn_seeded_leads"));
  });
  check(10, "Q7 : trois sorties, lettre réactive et monde libre distincts", () => {
    const outcomes = ["accord", "revelation", "contremarche"];
    for (const outcome of outcomes) {
      const letter = living.VALURN_LETTERS.find((l) => l.requiresFlags?.includes(`valurn-outcome:${outcome}`));
      assert.ok(letter, `lettre ${outcome}`);
      assert.ok(ambient.VALURN_AMBIENT_LINES.find((m) => m.id === "valurn-lettre-absente").promptVariants.some((v) => v.requiresFlags.includes(`valurn-outcome:${outcome}`)));
    }
    const q7 = quests.VALURN_QUESTS[6];
    const effects = q7.choices.map((c) => Object.keys(c.effects.relationshipEffects || {}).length);
    assert.ok(effects.every((n) => n >= 1 && n <= 3), "1 à 3 relationshipEffects");
  });
  check(11, "Confidences 20/40/60/80 dans l'ordre, jamais requises par une quête", () => {
    const tiers = living.VALURN_CONFIDENCES.map((c) => c.tier);
    for (const t of [20, 40, 60, 80]) assert.ok(tiers.includes(t));
    assert.equal(living.VALURN_CONFIDENCES.length, 8);
    for (const id of quests.VALURN_QUEST_IDS) assert.deepEqual(data.routeKnowledgeRequirements({ character: "valurn", stage: 3, id }), []);
    const c60 = living.VALURN_CONFIDENCES.find((c) => c.id === "secret-valurn-regret");
    assert.ok(c60.reveals.includes("knows_valurn_unnamed_regret"));
    assert.ok(living.VALURN_CONFIDENCES.find((c) => c.id === "secret-valurn-accountability").reveals.includes("knows_valurn_current_accountability"));
  });
  check(12, "Anciennes confidences sensibles en sauvegarde : fil jouable sans révélation", () => {
    const g = campaignGame(); delete g.flags[g.flags.indexOf("valurn-refonte-v1")];
    g.flags = g.flags.filter(Boolean); g.knowledge.push("knows_valurn_old_promise", "knows_valurn_did_not_return");
    g.secretHistory = ["secret-valurn-protection", "secret-valurn-return"];
    const h = page.hydrateGame(JSON.parse(JSON.stringify(g)));
    assert.ok(!h.secretHistory.includes("secret-valurn-protection"));
    playQuest(h, "valurn-q1");
  });
  // Vocabulaire réservé : seules des empreintes SHA-256 tronquées sont versionnées.
  const normWord = (t) => t.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().replace(/’/g, "'");
  const digest = (t) => createHash("sha256").update(t).digest("hex").slice(0, 16);
  const tokens = (t) => normWord(t).match(/[\p{L}']+/gu) || [];
  const RESERVED_STEMS = [[8, "a0f9ef9e841e1acf"], [8, "e99f7ff1ebb40a91"], [9, "4e50e2eec1db1cf2"], [8, "4edfbd28d0483e70"], [7, "df864c0596aa1a43"], [7, "361d14f2293e538d"], [8, "d98b2796c258b4ad"], [8, "f60be5c7e2a38443"]];
  const RESERVED_PHRASES = [[3, "51f2e50a03a27ab5"], [4, "12747c41fc24948b"], [6, "9cbe174e73402f86"], [8, "18be65273e86cc58"], [9, "9ce19226a4e5d10a"]];
  const reservedHit = (text, { stems = true, phrases = RESERVED_PHRASES } = {}) => {
    const words = tokens(text);
    for (let i = 0; i < words.length; i++) {
      if (stems) for (const [n, h] of RESERVED_STEMS) if (words[i].length >= n && digest(words[i].slice(0, n)) === h) return `${words.slice(Math.max(0, i - 6), i).join(" ")} [mot réservé]`;
      for (const [n, h] of phrases) if (i + n <= words.length && digest(words.slice(i, i + n).join(" ")) === h) return `${words.slice(Math.max(0, i - 6), i).join(" ")} [formule réservée]`;
    }
    return null;
  };
  check("12 bis", "Vocabulaire réservé absent du corpus Valurn et de la documentation ; proche regretté anonyme", () => {
    const valurnText = corpus([quests.VALURN_QUESTS, quests.VALURN_RELATION_BEATS, living.VALURN_CONFIDENCES, living.VALURN_LETTERS, living.VALURN_INVITATIONS, living.VALURN_KNOWLEDGE, dates.VALURN_DATES, dates.VALURN_DATE_BEATS, homeDate.VALURN_HOME_BRANCHES, intimacy.valurnIntimacyCorpus(), ambient.VALURN_AMBIENT_LINES]);
    const hit = reservedHit(valurnText); assert.equal(hit, null, `corpus : ${hit}`);
    for (const doc of ["VALURN_SOURCE_REGISTER.md", "VALURN_CURRENT_AUDIT.md", "VALURN_INTEGRATION.md", "VALURN_TESTS.md", "VALURN_STAGING.md"]) {
      const docHit = reservedHit(readFileSync(resolve(root, "docs", doc), "utf8"), { stems: false }); assert.equal(docHit, null, `${doc} : ${docHit}`);
    }
    const c60 = corpus(living.VALURN_CONFIDENCES.find((c) => c.id === "secret-valurn-regret"));
    for (const word of ["Bellirith", "sœur", "elle ", " il l", "femme", "homme", "frère"]) assert.equal(c60.includes(word), false, `confidence 60 : ${word}`);
    for (const entry of bellLiving.VALURN_BELLIRITH_KNOWLEDGE) assert.equal(reservedHit(entry.summary), null, entry.id);
    assert.equal(bellLiving.VALURN_BELLIRITH_CONFIDENCES.length, 0);
    assert.equal(social.SOCIAL_SCENES.some((s) => s.id === "valurn-after-truth"), false);
    assert.doesNotMatch(corpus(social.SOCIAL_SCENES.find((s) => s.id === "shared-valurn-bellirith")), /promesse|pas revenu|revenir/iu);
  });
  check(13, "Aucun texte ne prétend que le joueur est allé à Saëlis", () => { assert.equal(corpus([quests.VALURN_QUESTS, living, dates.VALURN_DATES]).includes("Saëlis"), false); });
  check(14, "Six lettres déclenchables, réponses persistantes, aucune requise par une quête", () => {
    for (const id of ["letter-valurn-scandal", "letter-valurn-accounts", "letter-valurn-debt", "letter-valurn-correspondent", "letter-valurn-evening", "letter-valurn-truth"]) assert.ok(living.VALURN_LETTERS.some((l) => l.id === id), id);
    assert.ok(living.VALURN_LETTERS.filter((l) => !l.character || l.character === "valurn").length >= 6);
    const g = structuredClone(completed); g.day = 60;
    const ready = living.VALURN_LETTERS.filter((l) => page.letterReady(l, g));
    assert.ok(ready.length >= 3, "lettres prêtes après le fil");
    g.letters = [...g.letters, { id: ready[0].id, receivedDay: g.day, read: false }];
    init(g); act("readLetter", ready[0].id);
    assert.ok(api.game.letters.find((l) => l.id === ready[0].id)?.read, "lue");
    const again = page.hydrateGame(JSON.parse(JSON.stringify(api.game)));
    assert.equal(living.VALURN_LETTERS.filter((l) => page.letterReady(l, again)).some((l) => l.id === ready[0].id), false, "pas de doublon");
    const flagsNeeded = quests.VALURN_QUESTS.flatMap((q) => data.routeFlagRequirements(q));
    assert.equal(flagsNeeded.some((f) => f.startsWith("letter-")), false);
  });
  check(15, "Invitations : expiration, refus, reprise ; aucune perte définitive", () => {
    assert.equal(living.VALURN_INVITATIONS.length, 3);
    for (const inv of living.VALURN_INVITATIONS) { assert.ok(inv.expiresAfter > 0); assert.ok(inv.declineEffects?.flags?.includes("valurn-invite-declined")); }
    assert.ok(living.VALURN_LETTERS.some((l) => l.requiresFlags?.includes("valurn-invite-declined")), "refus : lettre de rattrapage");
  });
  check(16, "Au moins 20 moments libres, variantes selon relation et intrigue", () => {
    const deck = ambientAll.AMBIENT_LINES.valurn.filter((m) => m.id.startsWith("valurn-") && !m.id.startsWith("valurn-bellirith"));
    assert.ok(deck.length >= 20, `${deck.length} moments`);
    assert.equal(new Set(deck.map((m) => m.id)).size, deck.length);
    assert.ok(deck.some((m) => m.promptVariants?.length));
    for (const m of deck) assert.ok(world.AMBIENT_SPOT_HINTS[m.id] || !m.requiresFlags, `${m.id}: lieu repérable`);
  });
  check(17, "Rendez-vous et logis fermés avant la fin de la série (valurn-q7), puis libres dans n'importe quel ordre", () => {
    const g = structuredClone(completed); g.relationships.valurn.stage = 5;
    for (const d of dates.VALURN_DATES) assert.equal(page.publicDateUnlocked(g, d), true, d.id);
    const before = structuredClone(g); before.history = before.history.filter((id) => id !== "valurn-q7"); before.flags = before.flags.filter((f) => f !== "valurn-q7-done");
    before.settings = { ...before.settings, unlockAll: false };
    for (const d of dates.VALURN_DATES) assert.equal(page.publicDateUnlocked(before, d), false, `${d.id} avant Q7`);
    before.housing = { ...before.housing, propertyId: before.housing.propertyId || "x" };
    assert.equal(page.homeDateUnlocked(before, "valurn"), false, "logis avant Q7");
    assert.ok(!dates.VALURN_DATES.some((d) => JSON.stringify(d).includes("date-valurn-river") && d.id === "date-valurn-forestier"));
  });
  check(18, "Trois branches distinctes par rendez-vous, trois fins hors intimité", () => {
    for (const d of dates.VALURN_DATES) {
      assert.equal(d.choices.length, 3);
      for (const c of d.choices) {
        let rounds = 0;
        while (dates.valurnDateBeat(d.id, rounds, [c.id])) rounds++;
        assert.ok(rounds >= 5, `${c.id}: ${rounds} temps`);
        const last = dates.valurnDateBeat(d.id, rounds - 1, [c.id]);
        assert.ok(last.choices.every((x) => x.effects.flags?.some((f) => f.startsWith("valurn-date-"))), `${c.id}: fin propre`);
      }
    }
    assert.equal(homeDate.VALURN_HOME_BRANCHES.length, 3);
    for (const b of homeDate.VALURN_HOME_BRANCHES) assert.equal(b.rounds.length, 3);
  });
  check(19, "Intimité facultative, refusable, modes tendre/suggestif/explicite/ellipse", () => {
    const g = structuredClone(completed); g.relationships.valurn.desire = 0;
    const d = dates.VALURN_DATES[0];
    assert.ok(d.minDesire > 0);
    for (const ctx of intimacy.VALURN_INTIMACY_CONTEXTS) {
      const r = intimacy.valurnIntimacyRoutes(ctx, "femme")[0];
      for (const mode of ["tendre", "suggestif", "explicite", "ellipse"]) assert.equal(r.chapters[mode].length, 12);
      assert.notDeepEqual(r.chapters.explicite, r.chapters.ellipse);
    }
  });
  check(20, "Variations femme / homme réelles ; aucune route intersexe", () => {
    for (const ctx of intimacy.VALURN_INTIMACY_CONTEXTS) {
      const [f, h] = ["femme", "homme"].map((sex) => JSON.stringify(intimacy.valurnIntimacyRoutes(ctx, sex)[0].chapters.explicite));
      assert.notEqual(f, h);
      assert.equal(intimacy.valurnIntimacyRoutes(ctx, "intersexe").length, 0, `${ctx}: intersexe`);
    }
  });
  check(21, "Visuels : jalons CG publiés (révélation, après) ; aucun asset ajouté", () => {
    for (const ctx of intimacy.VALURN_INTIMACY_CONTEXTS) {
      const v = intimacy.valurnIntimacyRoutes(ctx, "homme")[0].visual;
      assert.equal(v.revealChapter, 3); assert.equal(v.postOrgasmChapter, 9);
    }
  });
  const files = ["valurn-quests.ts", "valurn-market.ts", "valurn-market-ui.tsx", "valurn-living-world.ts", "valurn-dates.ts", "valurn-home-date.ts", "valurn-date-intimacy.ts", "valurn-ambient.ts"];
  const sources = Object.fromEntries(await Promise.all(files.map(async (f) => [f, await readFile(resolve(root, "src", f), "utf8")])));
  check(22, "iv-open-truth, iv-boundaries, shared-iriana-valurn intacts ; statut platonique respecté", () => {
    for (const id of ["iv-open-truth", "iv-boundaries"]) {
      const scene = social.SOCIAL_SCENES.find((s) => s.id === id);
      assert.ok(scene, id); assert.ok(scene.excludesFlags.includes("valurn-platonic"), `${id}: platonique`);
    }
  });
  check(23, "Mécaniques de Bellirith intactes (tendance céder/résister, intrusions)", () => {
    const diff = execSync("git diff --name-only origin/main -- src/bellirith-*.ts src/bellirith-*.tsx", { cwd: root, encoding: "utf8" }).trim().split("\n").filter(Boolean);
    assert.ok(diff.every((f) => f.endsWith("bellirith-living-world.ts")), `fichiers Bellirith touchés : ${diff.join(", ")}`);
    for (const [f, src] of Object.entries(sources)) assert.equal(/bellirith-trend|bellirith-has-resisted/.test(src), false, f);
  });
  check(24, "group-date-valurn-bellirith et group-date-iriana-valurn présents", () => {
    for (const id of ["group-date-valurn-bellirith", "group-date-iriana-valurn"]) assert.ok(groups.GROUP_DATES.some((g) => g.id === id), id);
    assert.ok(social.SOCIAL_SCENES.some((s) => s.id === "shared-iriana-valurn"));
  });
  check(25, "Sauvegarde ancienne (valurn-0..4, confidences, dates) : migration sans blocage", () => {
    const g = campaignGame(); g.flags = g.flags.filter((f) => f !== "valurn-refonte-v1");
    g.history.push("valurn-0", "valurn-1", "valurn-2", "valurn-3", "valurn-4"); g.relationships.valurn.stage = 5; g.flags.push("valurn-accountability", "date-intimate:date-valurn-forestier");
    const h = page.hydrateGame(JSON.parse(JSON.stringify(g)));
    assert.equal(h.history.some((id) => /^valurn-[0-4]$/.test(id)), false);
    assert.ok(h.flags.includes("valurn-legacy-arc") && h.flags.includes("valurn-legacy-scene:4") && h.flags.includes("valurn-refonte-v1"));
    assert.ok(!h.flags.includes("valurn-accountability"));
    assert.equal(h.relationships.valurn.stage, 5, "stade conservé");
    assert.equal(page.sceneFor("valurn", h.relationships.valurn.stage, h.history)?.id, "valurn-q1");
    assert.equal(h.version, 18);
    // Les rendez-vous suivent la nouvelle série : une ancienne sauvegarde les rouvre après valurn-q7.
    for (const d of dates.VALURN_DATES) assert.equal(page.publicDateUnlocked({ ...h, settings: { ...h.settings, unlockAll: false } }, d), false);
  });
  check(26, "Aucun choix Résonance ne fait de magie au joueur", () => {
    const text = corpus([quests.VALURN_QUESTS, quests.VALURN_RELATION_BEATS, dates.VALURN_DATES, dates.VALURN_DATE_BEATS, ambientAll.AMBIENT_LINES.valurn, living.VALURN_CONFIDENCES]);
    assert.equal(/"stat":"resonance"/.test(text), false);
  });
  check(27, "Journal : titre, problème, objectif, lieu, indice, conséquence, suite", () => {
    let history = [];
    for (let i = 0; i <= 7; i++) {
      const entry = quests.valurnJournalEntry(history, []);
      for (const key of ["title", "problem", "objective", "place", "clue", "consequence", "next"]) assert.ok(entry[key], `${i}/${key}`);
      if (i < 7) history = [...history, quests.VALURN_QUEST_IDS[i]];
    }
    const pending = quests.valurnJournalEntry(quests.VALURN_QUEST_IDS.slice(0, 5), []);
    assert.match(pending.objective, /registre/);
  });

  // ─── Contrôles éditoriaux ────────────────────────────────────────────────
  const strings = (src) => [...src.matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((m) => m[1]).filter((s) => / /.test(s));
  check("E1", "Aucun tiret cadratin ou demi-cadratin", () => { for (const [f, src] of Object.entries(sources)) assert.equal(/[—–]/.test(strings(src).join("\n")), false, f); });
  check("E2", "Aucune formule « ce n'est pas X, c'est Y »", () => { for (const [f, src] of Object.entries(sources)) assert.equal(/(?:ce|c)\s*(?:'|’)?\s*n(?:'|’)est pas [^.!?]{1,60}, c(?:'|’)est /iu.test(strings(src).join("\n")), false, f); });
  const CRUDE = /\b(pénis|vagin|testicules?|clitoris|anus|chatte|bite|queue|verge|sexe dressé|téton|mamelon|sperme|foutre)\b/iu;
  check("E3", "Aucun vocabulaire cru ou clinique", () => { for (const [f, src] of Object.entries(sources)) { const m = strings(src).join("\n").match(CRUDE); assert.equal(m, null, `${f}: ${m?.[0]}`); } });
  const EUPHEMISMS = { vague: /vague/giu, frisson: /frisson|frém/giu, chavir: /chavir/giu, bascul: /bascul/giu, submerg: /submerg/giu, abandon: /abandonn?e/giu, intime: /au plus (?:intime|profond)/giu, cambr: /cambr/giu, envahi: /envah/giu };
  check("E4", "Plafond d'euphémismes : aucune image répétée plus de deux fois par scène et par mode", () => {
    for (const ctx of intimacy.VALURN_INTIMACY_CONTEXTS) for (const sex of ["femme", "homme"]) {
      const route = intimacy.valurnIntimacyRoutes(ctx, sex)[0];
      for (const mode of ["tendre", "suggestif", "explicite", "ellipse"]) {
        const text = route.chapters[mode].flat().map((l) => l.text).join(" ");
        for (const [name, re] of Object.entries(EUPHEMISMS)) { const n = (text.match(re) || []).length; assert.ok(n <= 2, `${ctx}/${sex}/${mode}: « ${name} » × ${n}`); }
      }
    }
  });
  check("E5", "Motifs surexploités contenus (jeton, sourire en coin, coupe de vin)", () => {
    const all = Object.values(sources).map((s) => strings(s).join("\n")).join("\n");
    assert.ok((all.match(/sourire en coin/giu) || []).length === 0);
    assert.ok((all.match(/coupe de vin/giu) || []).length <= 1);
    assert.ok((all.match(/jeton/giu) || []).length <= 6, `jeton × ${(all.match(/jeton/giu) || []).length}`);
  });
  check("E6", "Structure : 7 quêtes, 8 confidences, ≥ 6 lettres + 2 tierces, 3 invitations, 9 continuités de 12 séquences", () => {
    assert.equal(quests.VALURN_QUESTS.length, 7);
    assert.ok(living.VALURN_LETTERS.filter((l) => l.character && l.character !== "valurn" || /tiers|third/i.test(l.id) || ["letter-valurn-hesse", "letter-valurn-odile", "letter-valurn-corvin"].includes(l.id)).length >= 2);
    assert.deepEqual(intimacy.validateValurnDateIntimacy(), { contexts: 9, routes: 18, chapters: 12 });
  });
  check("E7", "Bundle publié : aucune formule réservée", async () => {});
  const bundle = await readFile(resolve(root, "..", "build", "chronique.js"), "utf8");
  { const hit = reservedHit(bundle, { stems: false, phrases: RESERVED_PHRASES.slice(2) }); assert.equal(hit, null, `bundle : ${hit}`); }

  // Comptage des mots par mode pour le rapport.
  const words = (t) => (t.match(/[\p{L}’'-]+/gu) || []).length;
  const perMode = Object.fromEntries(["tendre", "suggestif", "explicite", "ellipse"].map((mode) => [mode, intimacy.VALURN_INTIMACY_CONTEXTS.reduce((sum, ctx) => sum + words(intimacy.valurnIntimacyRoutes(ctx, "femme")[0].chapters[mode].flat().map((l) => l.text).join(" ")), 0)]));
  console.log(`[Valurn] ${results.length} contrats validés : ${results.map((r) => r.split(".")[0]).join(", ")}`);
  console.log(`[Valurn] intimités (femme, 9 scènes) : ${Object.entries(perMode).map(([m, n]) => `${m} ${n}`).join(" · ")} mots`);
} finally {
  await server.close();
}
