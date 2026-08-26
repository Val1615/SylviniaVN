const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

function fakeClassList() {
  const values = new Set();
  return {
    add: (...names) => names.forEach((name) => values.add(name)),
    remove: (...names) => names.forEach((name) => values.delete(name)),
    contains: (name) => values.has(name),
    toggle(name, force) {
      if (force === true) values.add(name);
      else if (force === false) values.delete(name);
      else if (values.has(name)) values.delete(name);
      else values.add(name);
      return values.has(name);
    },
  };
}

const elements = new Map();
const navButtons = ["location", "relations", "journal"].map((view) => {
  const button = fakeElement(`nav-${view}`);
  button.dataset.swView = view;
  return button;
});

function fakeElement(id = "") {
  const attributes = {};
  return {
    id,
    hidden: false,
    innerHTML: "",
    textContent: "",
    src: "",
    alt: "",
    className: "",
    style: {},
    dataset: {},
    disabled: false,
    children: [],
    listeners: {},
    classList: fakeClassList(),
    attributes,
    setAttribute(name, value) { attributes[name] = String(value); },
    getAttribute(name) { return attributes[name]; },
    removeAttribute(name) { if (name === "src") this.src = ""; },
    addEventListener(type, listener) { this.listeners[type] = listener; },
    appendChild(child) { this.children.push(child); },
    contains() { return true; },
    querySelector(selector) {
      if (selector === ".sw-backdrop") return getElement("swBackdrop");
      if (selector === "#swCharacter") return getElement("swCharacter");
      if (selector === "#swCompanion") return getElement("swCompanion");
      if (selector === ".sw-spot.is-selected" || selector === "button") return fakeElement("focus-target");
      return null;
    },
    querySelectorAll(selector) { return selector === "[data-sw-view]" ? navButtons : []; },
    focus() {},
  };
}

function getElement(id) {
  if (!elements.has(id)) elements.set(id, fakeElement(id));
  return elements.get(id);
}

const body = fakeElement("body");
body.contains = (element) => body.children.includes(element);
body.appendChild = (element) => {
  body.children.push(element);
  if (element.id) elements.set(element.id, element);
};

const document = {
  body,
  listeners: {},
  createElement: (tag) => fakeElement(tag),
  addEventListener(type, listener) { this.listeners[type] = listener; },
  getElementById: getElement,
  querySelector() { return null; },
};

const state = {
  scene: "c2_45",
  stats: { audace: 0, lucidite: 0, sangfroid: 0, resonance: 0, lien: 0 },
  flags: {},
  inventory: [],
  devMode: false,
};
const S = {};
const A = {};
let saved = 0;
let destination = null;
let screen = null;
let partyRemaps = 0;
let timerSequence = 0;
const timers = new Map();

function queueTimer(callback) {
  timerSequence += 1;
  timers.set(timerSequence, callback);
  return timerSequence;
}

function cancelTimer(id) {
  timers.delete(id);
}

function runNextTimer() {
  const entry = timers.entries().next().value;
  assert.ok(entry, "aucun minuteur à exécuter");
  timers.delete(entry[0]);
  entry[1]();
}

const window = {
  requestAnimationFrame(callback) { callback(); return 1; },
  __sylviniaPartySpriteRemap(sprite) { partyRemaps += 1; return `${sprite}_party`; },
};

const context = vm.createContext({
  window,
  document,
  state,
  S,
  A,
  console,
  setTimeout: queueTimer,
  clearTimeout: cancelTimer,
  save() { saved += 1; },
  playMusic() {},
  setScreen(name) { screen = name; },
  readMainSave() { return state; },
  applyBalancedStatDelta(key, delta) {
    state.stats[key] = Math.max(0, (Number(state.stats[key]) || 0) + delta);
  },
  go(next) { destination = next; state.scene = next; },
  render() {},
  resume() {},
  startChapter3() {
    state.scene = "c3_01";
    delete state.storyWorld;
  },
});
window.go = context.go;
window.render = context.render;
window.resume = context.resume;
window.startChapter3 = context.startChapter3;

const momentsSource = fs.readFileSync(path.join(__dirname, "..", "fusion", "story-moments.js"), "utf8");
new vm.Script(momentsSource, { filename: "story-moments.js" }).runInContext(context);
const authoredSource = fs.readFileSync(path.join(__dirname, "..", "fusion", "story-authored-scenes.js"), "utf8");
new vm.Script(authoredSource, { filename: "story-authored-scenes.js" }).runInContext(context);
const dialoguesSource = fs.readFileSync(path.join(__dirname, "..", "fusion", "story-dialogues.js"), "utf8");
assert.doesNotMatch(dialoguesSource, /generatedOpening|generatedOutcome|POV_LINES|VOICES/, "aucun générateur de répliques ne doit subsister");
new vm.Script(dialoguesSource, { filename: "story-dialogues.js" }).runInContext(context);
const periodsSource = fs.readFileSync(path.join(__dirname, "..", "fusion", "story-periods.js"), "utf8");
assert.doesNotMatch(periodsSource, /[✦✧]/, "les étoiles décoratives doivent être retirées du temps libre");
new vm.Script(periodsSource, { filename: "story-periods.js" }).runInContext(context);
const content = window.SylviniaStoryContent;

assert.equal(content.periods.length, 19);
assert.equal(Object.keys(window.SylviniaStoryMoments).length, 62);
assert.equal(Object.keys(window.SylviniaAuthoredStoryScenes.scenes).length, 145);
const allActivities = content.periods.flatMap((period) => period.spots.flatMap((spot) => spot.activities));
assert.equal(allActivities.length, 145);
const runtimeSceneIds = Array.from(content.periods.flatMap((period) => period.spots.flatMap((spot) => spot.activities.map((activity) => `${period.id}:${spot.id}:${activity.id}`)))).sort();
assert.deepEqual(Object.keys(window.SylviniaAuthoredStoryScenes.scenes).sort(), runtimeSceneIds, "chaque activité doit posséder exactement un script dédié");
assert.equal(allActivities.filter((activity) => activity.kind === "confession").length, 21);
assert.equal(allActivities.filter((activity) => activity.kind === "debrief").length, 12);
assert.equal(allActivities.filter((activity) => activity.miniGame).length, 4);
allActivities.forEach((activity) => {
  assert.ok(activity.opening.length >= 4, `amorce VN trop courte: ${activity.id}`);
  activity.choices.forEach((choice) => assert.ok(choice.outcome.length >= 5, `conséquence VN trop courte: ${activity.id}/${choice.id}`));
});
const authoredText = Object.values(window.SylviniaAuthoredStoryScenes.scenes).flatMap((scene) => [
  ...scene.opening,
  ...scene.ending,
  ...Object.values(scene.branches).flat(),
]).map((entry) => entry.text).join("\n");
assert.doesNotMatch(authoredText, /—/, "les dialogues ne doivent pas dépendre du tiret cadratin");
assert.doesNotMatch(authoredText, /\bce n['’]est pas\b/i, "la construction automatique « ce n'est pas » doit être retirée");
const indexSource = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const worldCssSource = fs.readFileSync(path.join(__dirname, "..", "fusion", "story-world.css"), "utf8");
assert.match(worldCssSource, /\.sw-choice-list\s*\{[\s\S]*?overflow-y:\s*auto;/, "la liste des choix doit défiler verticalement");
assert.match(worldCssSource, /touch-action:\s*pan-y;/, "le défilement tactile des choix doit être explicite");
const authoredScriptIndex = indexSource.indexOf('src="fusion/story-authored-scenes.js');
const dialoguesScriptIndex = indexSource.indexOf('src="fusion/story-dialogues.js');
const periodsScriptIndex = indexSource.indexOf('src="fusion/story-periods.js');
assert.ok(authoredScriptIndex >= 0 && authoredScriptIndex < dialoguesScriptIndex && dialoguesScriptIndex < periodsScriptIndex, "les scripts écrits doivent être chargés avant leur registre et les périodes");
allActivities.filter((activity) => activity.kind === "confession").forEach((activity) => {
  assert.ok(activity.requiresRelation && activity.requiresRelation.min > 0, `confidence sans seuil: ${activity.id}`);
  activity.choices.forEach((choice) => {
    Object.entries(choice.effects.relationships || {}).forEach(([id, relation]) => {
      assert.equal(Number(relation.desire) || 0, 0, `désir injecté par ${activity.id} vers ${id}`);
    });
  });
});
content.periods.filter((period) => period.perspective === "Hylee").forEach((period) => {
  assert.ok(period.spots.some((spot) => spot.activities.some((activity) => activity.kind === "debrief")), `aucun retour sur le chapitre: ${period.id}`);
});
content.periods.forEach((period) => period.spots.forEach((spot) => assert.ok(spot.activities.length >= 2, `lieu non enrichi: ${period.id}/${spot.id}`)));
assert.equal(content.byId["forestier-avant-depart"].location, "Campement de la forêt sylvinienne");
assert.equal(content.byId["algratal-apres-conseil"].nextScene, "c15_001");

content.periods.forEach((period) => {
  S[period.anchorScene] = S[period.anchorScene] || {};
  S[period.anchorScene].bg = S[period.anchorScene].bg || `bg_${period.anchorScene}`;
  S[period.anchorScene].next = period.nextScene;
  S[period.anchorScene].choices = [{ label: "Poursuivre", next: period.nextScene, effects: {} }];
  A[`bg_${period.anchorScene}`] = `assets/backgrounds/${period.anchorScene}.webp`;
  if (period.echoScene) {
    S[period.echoScene] = S[period.echoScene] || {};
    S[period.echoScene].text = S[period.echoScene].text || `Ouverture de ${period.echoScene}.`;
    S[period.echoScene].bg = S[period.echoScene].bg || `bg_${period.echoScene}`;
    A[`bg_${period.echoScene}`] = `assets/backgrounds/${period.echoScene}.webp`;
  }
  period.spots.forEach((spot) => {
    if (!spot.visualScene) return;
    const sprite = `${spot.character}_${spot.visualScene}_exact`;
    S[spot.visualScene] = S[spot.visualScene] || {};
    S[spot.visualScene].bg = `bg_${spot.visualScene}`;
    S[spot.visualScene].chars = spot.character ? [[spot.character, sprite, "right"]] : [];
    A[`bg_${spot.visualScene}`] = `assets/backgrounds/${spot.visualScene}.webp`;
    A[sprite] = `assets/sprites/${sprite}.webp`;
    A[`${sprite}_party`] = `assets/sprites/${sprite}_party.webp`;
  });
});

A.hylee2_thinking = "assets/sprites/chapter3/hylee2_thinking.png";
A.hylee2_determined = "assets/sprites/chapter3/hylee2_determined.png";
A.hylee2_soft = "assets/sprites/chapter3/hylee2_soft.png";
A.remerii_soft = "assets/sprites/remerii_soft.png";
S.c6_20.chars = [["hylee", "hylee2_soft", "left"], ["remerii", "remerii_soft", "right"]];

S.c2_43.chars = [["remerii", "remerii_chapter2_exact", "right"]];
A.remerii_chapter2_exact = "assets/sprites/chapter2/remerii_exact.png";
S.c2_43.bg = "c2_key_example";
A.c2_key_example = "assets/images/keyscenes/chapter2/c2_key_example.png";
S.c2_42 = { bg: "bg_c2_apartments", chars: [["remerii", "remerii_room_exact", "right"]], next: "c2_43" };
A.bg_c2_apartments = "assets/images/backgrounds/chapter2/apartments.png";
A.remerii_room_exact = "assets/sprites/chapter2/remerii_room_exact.png";

const engineSource = fs.readFileSync(path.join(__dirname, "..", "fusion", "story-world.js"), "utf8");
new vm.Script(engineSource, { filename: "story-world.js" }).runInContext(context);

content.periods.forEach((period) => {
  assert.ok(S[period.anchorScene].choices.some((choice) => choice.storyWorldPeriodId === period.id), `porte absente: ${period.id}`);
});
assert.equal(state.storyWorld.mode, "story");
assert.equal(state.storyWorld.version, 4);

const algratal = content.byId["algratal-preparatifs"];
const apartment = algratal.spots.find((spot) => spot.id === "appartements");
const apartmentVisual = window.SylviniaStoryWorld.resolveVisual(algratal, apartment);
assert.equal(apartmentVisual.sprite, "remerii_chapter2_exact", "le sprite doit venir de la scène VN de référence");
assert.equal(apartmentVisual.background, "bg_c2_apartments", "une image clé ne doit jamais servir de décor au temps libre");

const partyPeriod = content.periods.find((period) => period.spots.some((spot) => spot.partyOutfits));
const partySpot = partyPeriod.spots.find((spot) => spot.partyOutfits);
const partyVisual = window.SylviniaStoryWorld.resolveVisual(partyPeriod, partySpot);
assert.match(partyVisual.sprite, /_party$/);
assert.ok(partyRemaps > 0, "le remappage des tenues de bal doit être appelé");

const chapterThreeCamp = content.byId["camp-avant-croisee"];
const chapterThreeHyleeSpots = chapterThreeCamp.spots.filter((spot) => spot.character === "hylee");
assert.ok(chapterThreeHyleeSpots.length >= 2);
chapterThreeHyleeSpots.forEach((spot) => {
  const visual = window.SylviniaStoryWorld.resolveVisual(chapterThreeCamp, spot);
  assert.match(visual.sprite, /^hylee2_/, `ancienne apparence d’Hylee encore utilisée: ${spot.id}`);
});

const chapterSix = content.byId["miraldas-matin-libre"];
const chapterSixTerrace = chapterSix.spots.find((spot) => spot.id === "terrasse");
const chapterSixTerraceVisual = window.SylviniaStoryWorld.resolveVisual(chapterSix, chapterSixTerrace);
assert.equal(chapterSixTerraceVisual.character, "hylee");
assert.equal(chapterSixTerraceVisual.sprite, "hylee2_soft");
assert.equal(chapterSixTerraceVisual.companion, null, "Remerii ne doit pas apparaître dans une scène solitaire d’Hylee");

content.periods.forEach((period) => period.spots.forEach((spot) => {
  const visual = window.SylviniaStoryWorld.resolveVisual(period, spot);
  if (spot.character) assert.equal(visual.character, spot.character, `personnage focal incorrect: ${period.id}/${spot.id}`);
  if (!spot.showCompanion) assert.equal(visual.companion, null, `sprite secondaire injecté: ${period.id}/${spot.id}`);
}));

const dravenCountershot = content.byId["forthaven-apres-draven"];
assert.equal(dravenCountershot.perspective, "Lineva");
assert.match(dravenCountershot.locationNote, /Draven demeure au palais d’Al’Gratal/);
dravenCountershot.spots.forEach((spot) => assert.equal(spot.character, "lineva"));
const dravenCountershotActivities = dravenCountershot.spots.flatMap((spot) => spot.activities);
dravenCountershotActivities.forEach((activity) => {
  assert.notEqual(activity.speaker, "Draven", `Draven présent physiquement dans ${activity.id}`);
  assert.doesNotMatch(activity.prompt, /Choisissez la manière|Quelle place donner/i, `question générique dans ${activity.id}`);
  [...activity.opening, ...activity.choices.flatMap((choice) => choice.outcome)].forEach((entry) => {
    assert.notEqual(entry.speaker, "Draven", `réplique physique de Draven dans ${activity.id}`);
  });
});
const dravenCountershotText = dravenCountershotActivities.flatMap((activity) => [
  ...activity.opening,
  ...activity.choices.flatMap((choice) => choice.outcome),
]).map((entry) => entry.text).join("\n");
assert.match(dravenCountershotText, /morts-vivants/i);
assert.match(dravenCountershotText, /faim|grain|ration/i);

window.SylviniaStoryWorld.open("algratal-preparatifs");
assert.equal(state.storyWorld.activePeriod, "algratal-preparatifs");
const root = elements.get("storyWorldRoot");
assert.ok(root);
assert.equal(root.hidden, false);
assert.equal(root.classList.contains("is-drawer-open"), false, "le panneau de gestion doit être replié à l’ouverture");

function click(dataset, disabled = false) {
  const button = { dataset, disabled };
  root.listeners.click({ target: { closest: () => button } });
}

function playActivity(activityId, choiceId) {
  click({ swActivity: activityId });
  let guard = 40;
  let run = state.storyWorld.periodRuns[state.storyWorld.activePeriod];
  while (run.view === "activity" && run.pendingActivity && run.pendingActivity.phase === "opening" && guard-- > 0) {
    click({ swAction: "advance-scene" });
    run = state.storyWorld.periodRuns[state.storyWorld.activePeriod];
  }
  if (run.view === "minigame") {
    click({ swAction: "skip-minigame" });
    run = state.storyWorld.periodRuns[state.storyWorld.activePeriod];
  }
  assert.equal(run.pendingActivity.phase, "choices");
  const slotBeforePreview = run.slot;
  const statsBeforePreview = clonePlain(state.stats);
  click({ swChoice: choiceId });
  run = state.storyWorld.periodRuns[state.storyWorld.activePeriod];
  assert.equal(run.pendingActivity.phase, "choices", `premier clic validant prématurément: ${activityId}/${choiceId}`);
  assert.equal(run.pendingActivity.previewChoiceId, choiceId);
  assert.equal(run.slot, slotBeforePreview);
  assert.deepEqual(clonePlain(state.stats), statsBeforePreview);
  assert.match(getElement("swContent").innerHTML, /sw-choice is-preview/);
  assert.match(getElement("swContent").innerHTML, /Toucher à nouveau pour confirmer/);
  const displayedEffects = (getElement("swContent").innerHTML.match(/class="sw-choice-effects"/g) || []).length;
  assert.equal(displayedEffects, 1, `les valeurs de tous les choix restent affichées: ${activityId}`);
  click({ swChoice: choiceId });
  run = state.storyWorld.periodRuns[state.storyWorld.activePeriod];
  while (run.view === "activity" && run.pendingActivity && run.pendingActivity.phase === "outcome" && guard-- > 0) {
    click({ swAction: "advance-scene" });
    run = state.storyWorld.periodRuns[state.storyWorld.activePeriod];
  }
  assert.ok(guard > 0, `séquence bloquée: ${activityId}`);
  assert.equal(run.view, "result");
}

click({ swView: "location" });
assert.equal(root.classList.contains("is-drawer-open"), true, "le joueur doit pouvoir ouvrir le tiroir des lieux");
click({ swAction: "close-drawer" });
assert.equal(root.classList.contains("is-drawer-open"), false);

click({ swActivity: "provisions" });
click({ swChoice: "lucidite" });
assert.equal(state.stats.lucidite, 0, "un choix ne peut pas être injecté avant la fin de l’amorce");
click({ swAction: "location" });
playActivity("provisions", "lucidite");
assert.equal(state.stats.lucidite, 1);
assert.equal(state.stats.lien, 1);
assert.ok(state.inventory.includes("necessaire_de_route"));
assert.equal(state.storyWorld.periodRuns["algratal-preparatifs"].slot, 1);
assert.equal(state.storyWorld.relationships.remerii.trust, 2);

click({ swAction: "title" });
assert.equal(root.hidden, true);
assert.equal(state.storyWorld.activePeriod, "algratal-preparatifs");
context.resume();
assert.equal(root.hidden, false, "la période active doit reprendre avec la sauvegarde");

click({ swAction: "continue" });
click({ swSpot: "palais" });
playActivity("requetes-introduction", "sangfroid");
assert.equal(state.stats.sangfroid, 1);
assert.equal(state.storyWorld.resources.coins, 5);
assert.equal(state.storyWorld.relationships.iriana.trust, 2);

click({ swAction: "continue" });
click({ swSpot: "appartements" });
assert.equal(getElement("swCharacter").src, A.remerii_chapter2_exact);
playActivity("retour-miraldas", "audace");
assert.equal(state.stats.audace, 1);
assert.equal(state.storyWorld.periodRuns["algratal-preparatifs"].slot, 3);

click({ swAction: "finish" });
assert.equal(destination, "c3_01");
assert.equal(state.storyWorld.activePeriod, null);
assert.ok(state.storyWorld.completedPeriods.includes("algratal-preparatifs"));
assert.match(S.c3_01.text(), /Al’Gratal n’est plus seulement/);
assert.match(S.c3_01.text(), /Iriana attend réellement/i);

window.SylviniaStoryWorld.patchGates();
assert.equal(S.c2_45.choices.some((choice) => choice.storyWorldPeriodId === "algratal-preparatifs"), false);

state.scene = "c8_end";
state.storyWorld.relationships.iriana.trust = 0;
state.storyWorld.relationships.iriana.affection = 0;
window.SylviniaStoryWorld.open("algratal-avant-expedition");
assert.match(getElement("swContent").innerHTML, /Une conversation attend encore/);
assert.doesNotMatch(getElement("swContent").innerHTML, /Forthaven au-delà de ses remparts/);
click({ swSpot: "palais" });
assert.match(getElement("swContent").innerHTML, /Lien requis · Iriana 0\/2/);
click({ swAction: "title" });
assert.equal(screen, "title");

state.scene = "c12g_end";
window.SylviniaStoryWorld.open("bal-entre-duels");
click({ swActivity: "choisir-danse" });
let rhythmRun = state.storyWorld.periodRuns["bal-entre-duels"];
while (rhythmRun.view === "activity" && rhythmRun.pendingActivity.phase === "opening") {
  click({ swAction: "advance-scene" });
  rhythmRun = state.storyWorld.periodRuns["bal-entre-duels"];
}
assert.equal(rhythmRun.view, "minigame");
click({ swAction: "start-minigame" });
for (let beat = 0; beat < 8; beat += 1) {
  runNextTimer();
  assert.equal(rhythmRun.pendingActivity.miniGameState.status, "cue");
  click({ swAction: "rhythm-hit" });
}
assert.equal(rhythmRun.pendingActivity.phase, "choices");
click({ swChoice: "audace" });
click({ swChoice: "audace" });
while (rhythmRun.view === "activity" && rhythmRun.pendingActivity && rhythmRun.pendingActivity.phase === "outcome") click({ swAction: "advance-scene" });
assert.match(rhythmRun.lastResult.miniGameLabel, /Accord remarquable/);
click({ swAction: "title" });

state.scene = "c6_32";
window.SylviniaStoryWorld.open("miraldas-matin-libre");
click({ swSpot: "atelier" });
click({ swActivity: "tri-cristaux" });
let patternRun = state.storyWorld.periodRuns["miraldas-matin-libre"];
while (patternRun.view === "activity" && patternRun.pendingActivity.phase === "opening") {
  click({ swAction: "advance-scene" });
  patternRun = state.storyWorld.periodRuns["miraldas-matin-libre"];
}
click({ swAction: "start-minigame" });
runNextTimer();
const pattern = patternRun.pendingActivity.miniGameState.sequence.slice();
pattern.forEach((symbol) => click({ swGameSymbol: symbol }));
assert.equal(patternRun.pendingActivity.phase, "choices");
click({ swChoice: "lucidite" });
click({ swChoice: "lucidite" });
while (patternRun.view === "activity" && patternRun.pendingActivity && patternRun.pendingActivity.phase === "outcome") click({ swAction: "advance-scene" });
assert.match(patternRun.lastResult.miniGameLabel, /Accord remarquable/);
click({ swAction: "title" });

/* Run de non-régression : chaque scène doit pouvoir aller de son amorce à son résultat. */
state.devMode = true;
state.storyWorld.resources.coins = 1000;
state.storyWorld.resources.supplies = 1000;
Object.keys(state.storyWorld.relationships).forEach((id) => {
  state.storyWorld.relationships[id].affection = 50;
  state.storyWorld.relationships[id].trust = 50;
  state.storyWorld.relationships[id].met = true;
});
let traversed = 0;
content.periods.forEach((period) => {
  period.spots.forEach((spot) => {
    spot.activities.forEach((activity) => {
      activity.choices.forEach((choice) => {
        delete state.storyWorld.periodRuns[period.id];
        state.storyWorld.resources.coins = 1000;
        state.storyWorld.resources.supplies = 1000;
        state.scene = period.anchorScene;
        window.SylviniaStoryWorld.open(period.id);
        const run = state.storyWorld.periodRuns[period.id];
        run.slot = Math.max(Number(spot.availableFrom) || 0, Number(activity.availableFrom) || 0);
        run.selectedSpot = spot.id;
        run.view = "location";
        window.SylviniaStoryWorld.render();
        playActivity(activity.id, choice.id);
        assert.equal(run.slot, Math.max(Number(spot.availableFrom) || 0, Number(activity.availableFrom) || 0) + 1, `créneau non consommé: ${period.id}/${spot.id}/${activity.id}/${choice.id}`);
        traversed += 1;
        window.SylviniaStoryWorld.close();
      });
    });
  });
});
assert.equal(traversed, 438);
state.devMode = false;

const preservedWorld = clonePlain(state.storyWorld);
window.startChapter3();
assert.deepEqual(clonePlain(state.storyWorld), preservedWorld);
assert.ok(saved >= 7);

console.log("story-world integration: ok");

function clonePlain(value) {
  return JSON.parse(JSON.stringify(value));
}
