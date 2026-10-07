import assert from "node:assert/strict";
import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

// Le moteur réel est exercé avec des cellules de hooks ; aucun double de quête.
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const hookId = "\0hn-test-hooks";
const actions = ["game", "dialogue", "modal", "setGame", "setModal", "advanceDialogue", "selectChoice", "closeDialogue", "startHNScene", "startHNDate", "startHyleeSearch", "setHyleeSearchState", "startGroupDate", "replayGroupDate", "startGroupDateIntimacy", "finishTrioEnding", "closeGroupIntimacy", "startHRScene", "startAnchorOperation", "setAnchorState", "startAlphaHunt", "setAlphaHuntState", "updateGame"];
const server = await createServer({ root, appType: "custom", logLevel: "silent", server: { middlewareMode: true }, plugins: [{
  name: "hn-engine-test", enforce: "pre",
  resolveId(id) { if (id === "hn-test-hooks") return hookId; },
  load(id) { if (id === hookId) return `
    let slots = [], cursor = 0;
    export function reset() { slots = []; cursor = 0; }
    export function beginRender() { cursor = 0; }
    export function useState(initial) { const i = cursor++; if (!(i in slots)) slots[i] = typeof initial === 'function' ? initial() : initial; return [slots[i], value => { slots[i] = typeof value === 'function' ? value(slots[i]) : value; }]; }
    export function useRef(current) { return useState({current})[0]; }
    export function useEffect() {} export function useLayoutEffect() {} export function useCallback(callback) { return callback; }
  `; },
  transform(code, id) { if (!id.endsWith("/src/page.tsx")) return;
    return code.replace('from "react";', 'from "hn-test-hooks";')
      .replace('  if (screen === "title") {', `  return { ${actions.join(", ")} };\n  if (screen === "title") {`)
      + '\nexport { createGame, hydrateGame, DEFAULT_PLAYER, choicesForDialogue, groupDateUnlocked, evolveCrossQuests, JournalView, V2Journal, v2KnownGroupDates };';
  },
}] });
try {
  const [page, hooks, hn, search, dates, housing, ui, group, alpha, anchor] = await Promise.all([
    server.ssrLoadModule("/src/page.tsx"), server.ssrLoadModule("hn-test-hooks"), server.ssrLoadModule("/src/hylee-naiah-cross-quest.ts"),
    server.ssrLoadModule("/src/hylee-search.ts"), server.ssrLoadModule("/src/hylee-naiah-dates.ts"), server.ssrLoadModule("/src/housing-data.ts"),
    server.ssrLoadModule("/src/hylee-naiah-ui.tsx"), server.ssrLoadModule("/src/group-dates.ts"), server.ssrLoadModule("/src/alpha-hunt.ts"), server.ssrLoadModule("/src/anchor-operation.ts"),
  ]);
  let api;
  const render = () => { hooks.beginRender(); return api = page.default(); };
  const init = game => { hooks.reset(); render().setGame(structuredClone(game)); return render(); };
  const act = (name, ...args) => { api[name](...args); return render(); };
  const save = () => page.hydrateGame(JSON.parse(JSON.stringify(api.game)));
  const progress = () => api.game.crossQuestSeries[hn.HN_KEY];
  const fixture = () => {
    const g = page.createGame({ ...page.DEFAULT_PLAYER, name: "Enquête", intimacy: "tendre" });
    g.flags = ["main-story-act-1-complete", "main-story-complete", "story-route-miraldas"];
    g.settings.noTimeCost = true;
    for (const id of ["hylee", "naiah", "remerii", "lineva", "allenna"]) g.relationships[id] = { ...g.relationships[id], met: true, stage: 5, affection: 50, trust: 50, desire: 0 };
    return page.hydrateGame(page.evolveCrossQuests(g));
  };
  function finish(pick = choices => choices[0], reload = false) {
    let rounds = 0, guard = 0;
    while (api.dialogue) {
      assert.ok(++guard < 1000, "conversation bloquée");
      if (["choices", "relation-choices"].includes(api.dialogue.phase)) {
        const choices = page.choicesForDialogue(api.dialogue, api.game); assert.ok(choices.length);
        if (choices.some(c => c.id === "cross-hn-mother-let")) assert.deepEqual(api.dialogue.scene.cast, ["naiah"], "Hylee encore visible après sa fuite");
        act("selectChoice", pick(choices, rounds++));
        if (reload && !api.dialogue.replay) {
          const scene = api.dialogue.scene, saved = save(), relations = structuredClone(api.game.relationships);
          init(saved); scene.groupDate ? act("startGroupDate", scene.id) : act("startHNScene", progress().stage);
          assert.ok(api.dialogue, "conversation non reprise");
          if (scene.id === "cross-hn-04" && api.dialogue.dateRound === 0) assert.deepEqual(api.dialogue.scene.cast, ["naiah"], "Hylee réapparaît au chargement");
          assert.deepEqual(api.game.relationships, relations, "effets doublés au chargement");
        }
      } else act("advanceDialogue");
    }
    return rounds;
  }
  function solve(state) {
    const solution = search.SEARCH_SCENARIOS.find(s => s.id === state.scenarioId).solution;
    let s = state;
    for (const [cat, id] of Object.entries(solution)) s = search.selectSearchCard(s, cat, id);
    return search.locateHylee(s);
  }
  const base = fixture();
  assert.ok(base.crossQuestSeries[hn.HN_KEY]);
  assert.equal(hn.hnUnlocked({ ...base, flags: [] }), false);
  assert.equal(hn.hnUnlocked({ ...base, relationships: { ...base.relationships, naiah: { stage: 4 } } }), false);
  assert.equal(hn.hnUnlocked(base), true);
  assert.equal(base.housing.propertyId, undefined);
  const old = structuredClone(base); delete old.crossQuestSeries[hn.HN_KEY];
  assert.doesNotThrow(() => page.hydrateGame(old));
  assert.ok(page.evolveCrossQuests(page.hydrateGame(old)).crossQuestSeries[hn.HN_KEY]);
  const damaged = structuredClone(base);
  damaged.crossQuestSeries[hn.HN_KEY].hn.checkpoint = { sceneId: "cross-hn-01", round: 0, picks: 42 };
  assert.doesNotThrow(() => page.hydrateGame(damaged));
  assert.equal(page.hydrateGame(damaged).crossQuestSeries[hn.HN_KEY].hn.checkpoint, undefined);

  // Chaque scénario est solvable par les sources, dans les trois issues mère.
  for (const outcome of ["killed", "memory-erased", "vegetative"]) for (const scenario of search.SEARCH_SCENARIOS) {
    let s = search.createHyleeSearch(outcome, 0, scenario.id);
    assert.ok(search.validHyleeSearch(s)); assert.equal("solution" in s, false);
    for (const [cat, id] of Object.entries(scenario.solution)) s = search.selectSearchCard(s, cat, id);
    assert.ok(search.searchActionReason(s, "shadow"));
    s = search.investigateSearch(s, "naiah"); s = search.investigateSearch(s, "naiah");
    if (outcome === "vegetative") assert.ok(search.searchActionReason(s, "shadow"));
    s = search.investigateSearch(s, "terrain", "manifestation", scenario.solution.manifestation);
    s = search.investigateSearch(s, "witness", "route", scenario.solution.route);
    const before = s.instability; s = search.investigateSearch(s, "shadow");
    assert.equal(s.instability, before + (outcome === "killed" ? 1 : 0));
    assert.equal(search.searchAnalysis(s).contradictions, 0);
    assert.equal(search.searchAnalysis(s).support, s.clues.length);
    s = search.locateHylee(s); assert.equal(s.result, "success"); assert.equal(s.turn, 6);
    assert.ok(search.validHyleeSearch(JSON.parse(JSON.stringify(s))));
    assert.deepEqual(search.investigateSearch(s, "naiah"), s);
    assert.equal(search.validHyleeSearch({ ...s, turn: 9 }), false);
    assert.equal(search.validHyleeSearch({ ...s, uses: { ...s.uses, terrain: NaN } }), false);
    assert.equal(search.validHyleeSearch({ ...s, notes: "invalid" }), false);
    assert.equal(search.validHyleeSearch({ ...s, selected: [] }), false);
  }
  let mistake = search.createHyleeSearch("memory-erased", 0);
  for (const [cat, id] of Object.entries({ refuge: "ridge", route: "north", manifestation: "burst" })) mistake = search.selectSearchCard(mistake, cat, id);
  mistake = search.noteSearchCard(mistake, "refuge", "ridge");
  const wrong = search.locateHylee(mistake); assert.equal(wrong.instability, 1); assert.equal(wrong.clues.length, 1);
  assert.ok(search.searchAnalysis(wrong).contradictions > 0);
  mistake = search.locateHylee(search.locateHylee(wrong)); assert.equal(mistake.phase, "retreat");
  const retry = search.retryHyleeSearch(mistake); assert.equal(retry.instability, 0); assert.equal(retry.turn, 0);
  assert.deepEqual(retry.clues, mistake.clues); assert.deepEqual(retry.notes, mistake.notes); assert.equal(retry.scenarioId, mistake.scenarioId);
  assert.equal(solve(retry).result, "success");
  // Épuisement d'actions et succès au huitième tour.
  let exhausted = search.createHyleeSearch("memory-erased", 0);
  exhausted = search.investigateSearch(search.investigateSearch(exhausted, "naiah"), "naiah");
  exhausted = search.investigateSearch(exhausted, "terrain", "route", "inn");
  exhausted = search.investigateSearch(exhausted, "terrain", "manifestation", "frost");
  exhausted = search.investigateSearch(exhausted, "witness", "refuge", "oak");
  exhausted = search.investigateSearch(exhausted, "witness", "route", "inn");
  for (const [cat, id] of Object.entries(search.SEARCH_SCENARIOS[0].solution)) exhausted = search.selectSearchCard(exhausted, cat, id);
  exhausted = search.investigateSearch(exhausted, "shadow"); assert.equal(exhausted.turn, 7);
  assert.equal(search.locateHylee(exhausted).result, "success");
  exhausted = search.selectSearchCard(exhausted, "refuge", "ridge"); exhausted = search.locateHylee(exhausted);
  assert.equal(exhausted.phase, "retreat"); assert.equal(exhausted.turn, 8); assert.equal(exhausted.instability, 1);
  assert.equal(search.retryHyleeSearch(exhausted).clues.length, exhausted.clues.length);

  const stats = new Set(["audace", "lucidite", "sangFroid", "resonance"]);
  for (const scene of [0, 1, 2, 3, 4].map(stage => hn.hnQuestScene(stage, { choices: {}, motherOutcome: "killed" }))) {
    assert.ok(scene.intro.length >= 10); assert.ok(scene.beats.length >= 1);
    for (const beat of [scene, ...scene.beats]) for (const choice of beat.choices) { assert.ok(stats.has(choice.stat)); assert.ok(choice.response.length >= 4); }
  }

  // Série complète, sauvegarde à chaque réponse, sans désir ni romance.
  const completedSaves = [];
  for (const motherChoice of ["cross-hn-mother-let", "cross-hn-mother-focus", "cross-hn-mother-step"]) {
    init(base);
    const hrBefore = structuredClone(api.game.crossQuestSeries.hyleeRemerii), laBefore = structuredClone(api.game.crossQuestSeries.linevaAllenna);
    for (let stage = 0; stage < 4; stage++) {
      act("startHNScene", stage); assert.ok(api.dialogue);
      finish(choices => choices.find(c => c.id === motherChoice) || choices[0], true);
      assert.equal(progress().stage, stage + 1);
      assert.deepEqual(api.game.crossQuestSeries.hyleeRemerii, hrBefore);
      assert.deepEqual(api.game.crossQuestSeries.linevaAllenna, laBefore);
    }
    assert.equal(api.modal.kind, "hylee-search");
    assert.equal(api.game.flags.filter(f => hn.HN_MOTHER_FLAGS.includes(f)).length, 1);
    act("setHyleeSearchState", { ...search.investigateSearch(progress().hn.search, "naiah"), tutorialSeen: true });
    const partial = save().crossQuestSeries[hn.HN_KEY].hn.search;
    act("setModal", null); act("startHyleeSearch"); assert.deepEqual(progress().hn.search, partial);
    init(save()); act("startHyleeSearch"); assert.deepEqual(progress().hn.search, partial);
    act("setHyleeSearchState", solve(progress().hn.search)); assert.ok(api.game.flags.includes("cross-hn-search-complete"));
    act("setModal", null); act("startHNScene", 4); finish(undefined, true); assert.equal(progress().stage, 5);
    for (let stage = 5; stage <= 6; stage++) {
      const date = group.GROUP_DATES.find(d => d.id === dates.HN_DATE_IDS[stage - 5]); assert.ok(page.groupDateUnlocked(api.game, date));
      assert.equal(date.minDesire, 0); act("startGroupDate", date.id); finish(undefined, true); assert.equal(progress().stage, stage + 1);
    }
    assert.ok(api.game.flags.includes("cross-hn-world-friendship"));
    const home = group.GROUP_DATES.find(d => d.id === dates.HN_DATE_IDS[2]);
    assert.equal(page.groupDateUnlocked(api.game, home), false); act("startGroupDate", home.id); assert.equal(api.dialogue, null);
    const property = housing.HOUSING_PROPERTIES.find(p => p.location === "algratal");
    const saved = save(); saved.housing.propertyId = property.id; init(saved);
    act("startGroupDate", home.id); assert.equal(api.game.spot, property.spot); assert.equal(api.dialogue.scene.background, property.background);
    finish(undefined, true); assert.equal(progress().stage, 8); assert.ok(progress().hn.completed);
    for (const flag of ["cross-hn-series-complete", "cross-hn-home-date-complete", "cross-hn-hylee-date-complete", "cross-hn-naiah-date-complete"]) assert.ok(api.game.flags.includes(flag));
    assert.deepEqual(api.game.crossQuestSeries.hyleeRemerii, hrBefore); assert.deepEqual(api.game.crossQuestSeries.linevaAllenna, laBefore);
    const protectedGame = JSON.stringify(api.game);
    act("startHyleeSearch", true); act("setHyleeSearchState", solve(api.modal.state)); act("setModal", null); assert.equal(JSON.stringify(api.game), protectedGame);
    for (let stage = 0; stage < 8; stage++) { act("startHNScene", stage, true); finish(); assert.equal(JSON.stringify(api.game), protectedGame, `relecture ${stage} modifie la partie`); }
    for (const id of dates.HN_DATE_IDS) { act("startGroupDate", id); finish(); assert.equal(JSON.stringify(api.game), protectedGame, "rendez-vous accompli récompensé deux fois"); }
    completedSaves.push(save());
  }
  // Les trois activités au logis restent distinctes, même après rechargement.
  for (const activity of ["cook", "game", "music"]) {
    const playing = structuredClone(completedSaves[1]), id = dates.HN_DATE_IDS[2], p = playing.crossQuestSeries[hn.HN_KEY];
    p.stage = 7; p.hn.completed = false; p.hn.homeDateDone = false; delete p.hn.choices[id];
    playing.groupDateHistory = playing.groupDateHistory.filter(d => d !== id);
    playing.flags = playing.flags.filter(f => !["cross-hn-series-complete", "cross-hn-home-date-complete"].includes(f));
    playing.settings.noTimeCost = false;
    init(playing); act("startGroupDate", id); assert.equal(api.game.day, playing.day + 1);
    const day = api.game.day;
    finish((choices, round) => round === 0 ? choices.find(c => c.id === `cross-hn-home-${activity}`) : choices[0], true);
    assert.equal(api.game.day, day, "reprise du rendez-vous coûte une deuxième journée");
    assert.ok(progress().hn.choices[id].includes(`cross-hn-home-${activity}`));
    assert.ok(progress().hn.choices[id].some(c => c.startsWith(`cross-hn-home-${activity}-`)));
    assert.equal(progress().stage, 8);
    const protectedGame = JSON.stringify(api.game); act("startGroupDate", id); finish();
    assert.equal(JSON.stringify(api.game), protectedGame, "relecture avance le temps réel");
  }
  // Trois rendez-vous autonomes : n’importe quel ordre, sans prérequis croisé.
  const TRANSITIONS = { [dates.HN_DATE_IDS[0]]: "cross-hn-lake-gage", [dates.HN_DATE_IDS[1]]: "cross-hn-one-thread", [dates.HN_DATE_IDS[2]]: "cross-hn-home-lead" };
  const property = housing.HOUSING_PROPERTIES.find(p => p.location === "algratal");
  const freshDates = (desire = 0) => {
    const g = structuredClone(completedSaves[0]), p = g.crossQuestSeries[hn.HN_KEY];
    p.stage = 5; p.hn.completed = p.hn.hyleeDateDone = p.hn.naiahDateDone = p.hn.homeDateDone = false; p.hn.checkpoint = undefined;
    for (const id of dates.HN_DATE_IDS) delete p.hn.choices[id];
    g.groupDateHistory = g.groupDateHistory.filter(d => !dates.HN_DATE_IDS.includes(d));
    g.flags = g.flags.filter(f => !/^cross-hn-(?:hylee|naiah|home)-date-complete$|^cross-hn-(?:world-friendship|series-complete)$|^group-date-intimate:/.test(f));
    g.housing.propertyId = property.id;
    for (const id of ["hylee", "naiah"]) g.relationships[id] = { ...g.relationships[id], desire };
    return g;
  };
  init(freshDates());
  const order = [dates.HN_DATE_IDS[2], dates.HN_DATE_IDS[1], dates.HN_DATE_IDS[0]];
  for (const [index, id] of order.entries()) {
    const date = group.GROUP_DATES.find(d => d.id === id);
    assert.ok(page.groupDateUnlocked(api.game, date), `${id}: verrouillé hors ordre`);
    assert.equal(dates.hnDateReason(id, api.game), undefined, `${id}: un autre rendez-vous est encore exigé`);
    assert.equal(date.intimacyDisabled, undefined); assert.equal(date.intimacyMinDesire, 25);
    const seen = [];
    act("startGroupDate", id); finish(choices => { seen.push(...choices.map(c => c.id)); return choices[0]; }, true);
    assert.ok(!seen.includes(TRANSITIONS[id]), `${id}: bascule intime proposée sans désir`);
    assert.ok(!seen.some(c => /tender|close$/.test(c)), `${id}: ancienne proximité tendre encore proposée`);
    assert.equal(api.modal, null, `${id}: continuation intime ouverte sans désir`);
    assert.equal(progress().stage, 6 + index);
  }
  assert.ok(progress().hn.completed);
  for (const flag of ["cross-hn-series-complete", "cross-hn-home-date-complete", "cross-hn-hylee-date-complete", "cross-hn-naiah-date-complete", "cross-hn-world-friendship"]) assert.ok(api.game.flags.includes(flag), `${flag} absent après un ordre libre`);
  init(freshDates()); act("startGroupDate", dates.HN_DATE_IDS[2]); finish();
  assert.ok(api.game.flags.includes("cross-hn-home-date-complete"));
  assert.ok(!api.game.flags.includes("cross-hn-hylee-date-complete") && !api.game.flags.includes("cross-hn-world-friendship"), "le logis valide un autre rendez-vous");
  const homeText = JSON.stringify(dates.hnDateScene(dates.HN_DATE_IDS[2], progress().hn, ["cross-hn-home-cook"], api.game));
  assert.doesNotMatch(homeText, /perles qui restent|petit lien au poignet|au lac après-demain|prochain jeu du lac/u, "le logis cite encore un autre rendez-vous");
  // Un seul désir suffisant ne suffit pas.
  const half = freshDates(); half.relationships.hylee.desire = 40; half.relationships.naiah.desire = 24;
  init(half); { const seen = []; act("startGroupDate", dates.HN_DATE_IDS[0]); finish(choices => { seen.push(...choices.map(c => c.id)); return choices[0]; }); assert.ok(!seen.includes(TRANSITIONS[dates.HN_DATE_IDS[0]]), "bascule ouverte avec un seul désir"); }
  // Désir ≥ 25 pour les deux : bascule proposée, refus gratuit, continuation manuelle, relecture sans drapeau.
  for (const id of dates.HN_DATE_IDS) {
    init(freshDates(25));
    act("startGroupDate", id);
    finish(choices => choices.find(c => c.id === TRANSITIONS[id]) || choices[0]);
    assert.ok(progress().hn.choices[id].includes(TRANSITIONS[id]), `${id}: bascule intime absente à désir 25`);
    assert.equal(api.modal?.kind, "group-date-result", `${id}: proposition de continuation absente`);
    const declined = JSON.stringify({ r: api.game.relationships, f: api.game.flags.filter(f => !f.startsWith("group-date-intimate")) });
    act("finishTrioEnding", id, false);
    assert.equal(JSON.stringify({ r: api.game.relationships, f: api.game.flags.filter(f => !f.startsWith("group-date-intimate")) }), declined, `${id}: refuser coûte quelque chose`);
    act("startGroupDateIntimacy", id);
    assert.equal(api.modal?.kind, "group-intimacy", `${id}: continuation manuelle non ouverte`);
    assert.ok(group.isManualGroupIntimacy(id));
    act("closeGroupIntimacy", true, "test");
    assert.ok(api.game.flags.includes(`group-date-intimate:${id}`));
    const protectedGame = JSON.stringify(api.game);
    act("startGroupDate", id); finish(choices => choices.find(c => c.id === TRANSITIONS[id]) || choices[0]);
    assert.equal(api.modal?.kind, "group-date-result"); assert.equal(api.modal.replay, true, `${id}: relecture sans drapeau de souvenir`);
    act("startGroupDateIntimacy", id, true); assert.equal(api.modal?.kind, "group-intimacy"); assert.equal(api.modal.replay, true);
    act("closeGroupIntimacy", true, "replay");
    assert.equal(JSON.stringify(api.game), protectedGame, `${id}: relecture intime modifie la partie`);
  }
  assert.doesNotMatch(JSON.stringify(api.game.flags), /romance|triad|trio-love/iu, "un drapeau de romance à trois a été écrit");
  const { renderToStaticMarkup } = await import("react-dom/server"), { createElement } = await import("react");
  const openDates = freshDates(); openDates.crossQuestSeries[hn.HN_KEY].hn.choices[dates.HN_DATE_IDS[1]] = ["cross-hn-one-walk"];
  const datesDossier = renderToStaticMarkup(createElement(ui.HNDossier, { progress: openDates.crossQuestSeries[hn.HN_KEY], game: openDates, onScene() {}, onSearch() {} }));
  for (const title of hn.HN_TITLES.slice(5)) assert.ok(datesDossier.includes(title.replace(/’/g, "’")), `dossier : « ${title} » absent`);
  assert.match(datesDossier, /dans l’ordre de votre choix/u); assert.match(datesDossier, /Revivre « Une seule chose »/u);
  const partialGame = structuredClone(completedSaves[1]); partialGame.crossQuestSeries[hn.HN_KEY].stage = 4;
  const dossier = renderToStaticMarkup(createElement(ui.HNDossier, { progress: partialGame.crossQuestSeries[hn.HN_KEY], game: partialGame, onScene() {}, onSearch() {} }));
  assert.match(dossier, /Hylee &amp; Naïah/); assert.match(dossier, /Retrouver Hylee/);
  const markup = renderToStaticMarkup(createElement(ui.HyleeSearchModal, { state: search.createHyleeSearch("vegetative", 0), onChange() {}, onClose() {}, onFinish() {} }));
  assert.match(markup, /aria-modal="true"/); assert.match(markup, /Didacticiel/); assert.doesNotMatch(markup, /branchSel|solution/);
  const replayMarkup = renderToStaticMarkup(createElement(ui.HyleeSearchModal, { state: search.createHyleeSearch("killed", 0), replay: true, onChange() {}, onClose() {}, onFinish() {} }));
  assert.doesNotMatch(replayMarkup, /hn-tutorial-backdrop/); assert.match(replayMarkup, /aucun impact/);
  for (const cat of search.SEARCH_CATEGORIES) for (const card of cat.cards) await access(resolve(root, "..", card.image.replace(/^\/?assets\//, "assets/")));
  assert.ok(alpha.validateAlphaState(alpha.createAlphaHunt(90))); assert.ok(anchor.validAnchorState(anchor.createAnchorOperation(90)));
  if (process.env.HN_FIXTURES) {
    await mkdir(process.env.HN_FIXTURES, { recursive: true });
    await writeFile(resolve(process.env.HN_FIXTURES, "base.json"), JSON.stringify(base));
    await writeFile(resolve(process.env.HN_FIXTURES, "completed.json"), JSON.stringify(completedSaves[1]));
    const playing = structuredClone(completedSaves[1]); playing.crossQuestSeries[hn.HN_KEY].stage = 4;
    playing.crossQuestSeries[hn.HN_KEY].hn.search = search.createHyleeSearch("memory-erased", 0);
    await writeFile(resolve(process.env.HN_FIXTURES, "search.json"), JSON.stringify(playing));
  }
  console.log("[Hylee / Naïah] 3 issues mère · 4 scénarios · 8 étapes · 3 rendez-vous autonomes (ordre libre) · bascule intime à désir 25 · 3 activités au logis · reprise et relecture protégées validées.");
} finally { await server.close(); }
