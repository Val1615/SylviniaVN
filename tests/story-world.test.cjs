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
const periodsSource = fs.readFileSync(path.join(__dirname, "..", "fusion", "story-periods.js"), "utf8");
new vm.Script(periodsSource, { filename: "story-periods.js" }).runInContext(context);
const content = window.SylviniaStoryContent;

assert.equal(content.periods.length, 19);
assert.equal(Object.keys(window.SylviniaStoryMoments).length, 62);
assert.equal(content.periods.flatMap((period) => period.spots).reduce((total, spot) => total + spot.activities.length, 0), 124);
content.periods.forEach((period) => period.spots.forEach((spot) => assert.ok(spot.activities.length >= 2, `lieu non enrichi: ${period.id}/${spot.id}`)));

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

S.c2_43.chars = [["remerii", "remerii_chapter2_exact", "right"]];
A.remerii_chapter2_exact = "assets/sprites/chapter2/remerii_exact.png";

const engineSource = fs.readFileSync(path.join(__dirname, "..", "fusion", "story-world.js"), "utf8");
new vm.Script(engineSource, { filename: "story-world.js" }).runInContext(context);

content.periods.forEach((period) => {
  assert.ok(S[period.anchorScene].choices.some((choice) => choice.storyWorldPeriodId === period.id), `porte absente: ${period.id}`);
});
assert.equal(state.storyWorld.mode, "story");
assert.equal(state.storyWorld.version, 3);

const algratal = content.byId["algratal-preparatifs"];
const apartment = algratal.spots.find((spot) => spot.id === "appartements");
const apartmentVisual = window.SylviniaStoryWorld.resolveVisual(algratal, apartment);
assert.equal(apartmentVisual.sprite, "remerii_chapter2_exact", "le sprite doit venir de la scène VN de référence");

const partyPeriod = content.periods.find((period) => period.spots.some((spot) => spot.partyOutfits));
const partySpot = partyPeriod.spots.find((spot) => spot.partyOutfits);
const partyVisual = window.SylviniaStoryWorld.resolveVisual(partyPeriod, partySpot);
assert.match(partyVisual.sprite, /_party$/);
assert.ok(partyRemaps > 0, "le remappage des tenues de bal doit être appelé");

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

click({ swView: "location" });
assert.equal(root.classList.contains("is-drawer-open"), true, "le joueur doit pouvoir ouvrir le tiroir des lieux");
click({ swAction: "close-drawer" });
assert.equal(root.classList.contains("is-drawer-open"), false);

click({ swActivity: "provisions" });
click({ swChoice: "lucidite" });
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
click({ swActivity: "requetes-introduction" });
click({ swChoice: "sangfroid" });
assert.equal(state.stats.sangfroid, 1);
assert.equal(state.storyWorld.resources.coins, 5);
assert.equal(state.storyWorld.relationships.iriana.trust, 2);

click({ swAction: "continue" });
click({ swSpot: "appartements" });
assert.equal(getElement("swCharacter").src, A.remerii_chapter2_exact);
click({ swActivity: "retour-miraldas" });
click({ swChoice: "audace" });
assert.equal(state.stats.audace, 1);
assert.equal(state.storyWorld.periodRuns["algratal-preparatifs"].slot, 3);

click({ swAction: "finish" });
assert.equal(destination, "c3_01");
assert.equal(state.storyWorld.activePeriod, null);
assert.ok(state.storyWorld.completedPeriods.includes("algratal-preparatifs"));
assert.match(S.c3_01.text(), /Al’Gratal n’est plus seulement/);
assert.match(S.c3_01.text(), /trois requêtes/i);

window.SylviniaStoryWorld.patchGates();
assert.equal(S.c2_45.choices.some((choice) => choice.storyWorldPeriodId === "algratal-preparatifs"), false);

state.scene = "c8_end";
state.storyWorld.relationships.iriana.trust = 0;
state.storyWorld.relationships.iriana.affection = 0;
window.SylviniaStoryWorld.open("algratal-avant-expedition");
click({ swSpot: "palais" });
assert.match(getElement("swContent").innerHTML, /Lien requis · Iriana 0\/2/);
click({ swAction: "title" });
assert.equal(screen, "title");

const preservedWorld = clonePlain(state.storyWorld);
window.startChapter3();
assert.deepEqual(clonePlain(state.storyWorld), preservedWorld);
assert.ok(saved >= 7);

console.log("story-world integration: ok");

function clonePlain(value) {
  return JSON.parse(JSON.stringify(value));
}
