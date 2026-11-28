/* Générique v0.432 : données de mise en scène (node test/story-generique-course.test.cjs). */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const root = path.join(__dirname, "..");
const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, "fusion/story-generique-credits.js"), "utf8"), ctx);
const D = ctx.window.SylviniaGeneriqueData;
// Déroulé : participation, Votre Chronique, crédits réels, mot de l’auteur.
assert.deepEqual([...D.acts.map((a) => a.id)], ["participation", "chronique", "acte3", "acte4"]);
// Acte I : 8 cartons, alternance stricte gauche/droite, pseudonyme seul.
const c = D.cartons;
assert.equal(c.items.length, 8);
c.items.forEach((it, i) => assert.equal(it.side, i % 2 ? "droite" : "gauche", it.role));
assert.equal(c.name, "Le Chroniqueur Vagabond");
assert.deepEqual([...c.final.lines], ["Un jeu du", "Chroniqueur Vagabond"]);
// Faux crédits : 12 personnages puis « Vous » ; images existantes.
const cast = D.acts[0].blocks;
assert.equal(cast.length, 13);
assert.equal(cast[12].items[1].text, "Vous");
for (const b of cast.slice(0, 12)) assert.ok(fs.existsSync(path.join(root, b.bg.src)), b.bg.src);
// Crédits réels obligatoires conservés.
const names = D.acts[2].blocks.flatMap((b) => b.items).filter((i) => i.type === "credit").map((i) => i.name);
for (const n of ["ChatGPT", "GrokBot", "Grok Imagine", "Grok Imagine & Seedance", "Le Chroniqueur Vagabond", "Suno"]) assert.ok(names.includes(n), n);
// Course : ordre V01-V05, V06 non bouclée, ancres croissantes, fichiers présents ou repli signalé.
const K = D.course;
assert.deepEqual([...K.order], ["V01", "V02", "V03", "V04", "V05"]);
assert.equal(K.clips.V06.loop, false);
const idx = K.cues.map((q) => K.order.indexOf(q.clip));
assert.deepEqual([...idx], [...idx].sort((a, b) => a - b));
const present = Object.entries(K.clips).filter(([, v]) => fs.existsSync(path.join(root, v.src))).map(([k]) => k);
console.log("story-generique-course : ok (vidéos présentes : " + present.join(", ") + ")");
