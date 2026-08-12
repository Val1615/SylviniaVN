const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

let destination = null;
let saves = 0;
const button = {
  dataset: {},
  listeners: {},
  addEventListener(type, listener) { this.listeners[type] = listener; },
};
const window = {
  location: { assign(value) { destination = value; } },
};
const document = {
  readyState: "complete",
  getElementById(id) { return id === "chronicleModeBtn" ? button : null; },
  addEventListener() {},
};
const context = vm.createContext({ window, document, save() { saves += 1; } });
const source = fs.readFileSync(path.join(__dirname, "..", "fusion", "game-modes.js"), "utf8");
new vm.Script(source, { filename: "game-modes.js" }).runInContext(context);

assert.equal(button.dataset.chronicleBound, "true");
button.listeners.click();
assert.equal(destination, "chronique-alternative/");
assert.equal(saves, 1);
assert.equal(window.SylviniaGameModes.alternativeChronicle, "chronique-alternative/");

console.log("game modes: ok");
