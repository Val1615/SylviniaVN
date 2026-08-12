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
  };
}

function fakeElement(id = "") {
  return {
    id,
    hidden: false,
    innerHTML: "",
    src: "",
    alt: "",
    style: {},
    dataset: {},
    disabled: false,
    children: [],
    listeners: {},
    classList: fakeClassList(),
    setAttribute() {},
    removeAttribute(name) { if (name === "src") this.src = ""; },
    addEventListener(type, listener) { this.listeners[type] = listener; },
    appendChild(child) { this.children.push(child); },
    contains() { return true; },
    querySelector() { return null; },
    focus() {},
  };
}

const elements = new Map();
const body = fakeElement("body");
body.contains = (element) => body.children.includes(element);
body.appendChild = (element) => {
  body.children.push(element);
  if (element.id) elements.set(element.id, element);
};
const backdrop = fakeElement("swBackdrop");
const document = {
  body,
  listeners: {},
  createElement: (tag) => fakeElement(tag),
  addEventListener(type, listener) { this.listeners[type] = listener; },
  getElementById(id) {
    if (!elements.has(id)) elements.set(id, fakeElement(id));
    return elements.get(id);
  },
  querySelector(selector) {
    if (selector === "#storyWorldRoot .sw-backdrop") return backdrop;
    return null;
  },
};

const state = {
  scene: "c2_45",
  stats: { audace: 0, lucidite: 0, sangfroid: 0, resonance: 0, lien: 0 },
  flags: {},
};
const S = {
  c2_45: {
    choices: [
      { label: "Commencer le chapitre III", next: "c3_01", effects: {} },
      { label: "Retourner au menu", next: "menu", effects: {} },
    ],
  },
  c3_01: { text: "Le soleil se lève sur Al’Gratal." },
  c3_02: { choices: [] },
};
const A = {
  c3_bg_algratal_marche: "assets/images/chapter3/c3_algratal_marche.png",
  bg_algratal_panorama: "assets/images/algratal_panorama.png",
  bg_algratal_rues: "assets/images/algratal_rues.png",
  c4d_noble_chamber: "assets/images/chapter4/c4d_noble_chamber.png",
  remerii_calm: "assets/sprites/remerii_calm.png",
  remerii_profile: "assets/sprites/remerii_profile.png",
  iriana_calm: "assets/sprites/iriana_calm.png",
  hylee_thinking: "assets/sprites/hylee_thinking.png",
};

let saved = 0;
let destination = null;
const window = {
  requestAnimationFrame(callback) { callback(); return 1; },
};
const context = vm.createContext({
  window,
  document,
  state,
  S,
  A,
  console,
  setTimeout,
  clearTimeout,
  save() { saved += 1; },
  playMusic() {},
  setScreen() {},
  readMainSave() { return state; },
  applyBalancedStatDelta(key, delta) {
    state.stats[key] = Math.max(0, (Number(state.stats[key]) || 0) + delta);
  },
  go(next) { destination = next; state.scene = next; },
  render() {},
  resume() {},
  startChapter3() {
    const flags = state.flags;
    state.scene = "c3_01";
    state.flags = flags;
    delete state.storyWorld;
  },
});
window.go = context.go;
window.render = context.render;
window.resume = context.resume;
window.startChapter3 = context.startChapter3;

const source = fs.readFileSync(path.join(__dirname, "..", "fusion", "story-world.js"), "utf8");
new vm.Script(source, { filename: "story-world.js" }).runInContext(context);

assert.equal(S.c2_45.choices[0].next, "story_world_algratal_preparatifs");
assert.equal(S.c2_45.choices[1].next, "c3_01");
assert.equal(state.storyWorld.mode, "story");

window.SylviniaStoryWorld.open();
assert.equal(state.storyWorld.activePeriod, "algratal-preparatifs");
const root = elements.get("storyWorldRoot");
assert.ok(root);
assert.equal(root.hidden, false);

function click(dataset) {
  const button = { dataset, disabled: false };
  root.listeners.click({ target: { closest: () => button } });
}

click({ swAction: "event" });
click({ swChoice: "compare" });
assert.equal(state.stats.lucidite, 1);
assert.equal(state.flags.freeMarketCompared, true);
assert.equal(state.storyWorld.periodRuns["algratal-preparatifs"].slot, 1);

click({ swAction: "title" });
assert.equal(root.hidden, true);
assert.equal(state.storyWorld.activePeriod, "algratal-preparatifs");
context.resume();
assert.equal(root.hidden, false);
click({ swAction: "event" });
click({ swChoice: "fear" });
assert.equal(state.stats.lucidite, 2);
assert.equal(state.stats.lien, 1);
assert.equal(state.flags.freeRemeriiMiraldasTalk, true);
assert.equal(state.storyWorld.periodRuns["algratal-preparatifs"].slot, 2);
assert.ok(S.c3_02.choices.some((choice) => choice.storyWorldId === "story-world-c3-remerii"));

click({ swAction: "finish" });
assert.equal(destination, "c3_01");
assert.equal(state.storyWorld.activePeriod, null);
assert.ok(state.storyWorld.completedPeriods.includes("algratal-preparatifs"));
assert.match(S.c3_01.text(), /heures de la veille/);
assert.ok(saved >= 4);

context.render();
assert.equal(S.c2_45.choices.some((choice) => choice.storyWorldId === "algratal-preparatifs"), false);
const preservedWorld = state.storyWorld;
state.scene = "chapter-select";
window.startChapter3();
assert.deepEqual(state.storyWorld, preservedWorld);

console.log("story-world integration: ok");
