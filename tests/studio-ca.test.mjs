// Sylvinia Studio · Chroniques Alternatives : repérage des textes et application des modifications.
// node tests/studio-ca.test.mjs
import assert from "node:assert/strict";
import { writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { wrapModule, CA_RUNTIME } from "../chronique-alternative/source/scripts/studio-ca-strings.mjs";
import ts from "../chronique-alternative/source/node_modules/typescript/lib/typescript.js";

const SAMPLE = `
type Line = { speaker: string; text: string };
const L = (speaker: string, text: string): Line => ({ speaker, text });
const A = (text: string) => L("Naïah", text);
const secret = (id: string, title: string, tier: number, minTrust: number, intro: Line[]) => ({ id, title, tier, minTrust, intro });
export const MOMENTS = [
  { id: "m-un", title: "Le premier moment", minTrust: 12, intro: [A("Une réplique de Naïah, assez longue pour compter."), L("Narration", "Un paragraphe de narration qui décrit la scène.")], effects: { affection: 2, trust: 1 } },
];
export const CONF = [secret("c-un", "Une confidence d'essai", 20, 10, [A("Une autre réplique de Naïah pour la confidence.")])];
export function isFirst(t: string) { return t === "Le premier moment"; }
`;
const w = wrapModule(SAMPLE, "essai", { reserved: new Set(["Le premier moment"]) });
assert.ok(w, "le module est enveloppé");
const byText = (t) => w.items.find((i) => i.text === t);
assert.equal(byText("Le premier moment"), undefined, "un texte servant de comparaison n'est pas modifiable");
const line = byText("Une réplique de Naïah, assez longue pour compter.");
assert.ok(line, "réplique repérée");
assert.equal(line.sp, "Naïah", "locuteur déduit de la fonction A()");
const nums = w.items.filter((i) => i.k === "n");
assert.ok(nums.some((n) => n.role === "condition minTrust" && n.value === 12), "seuil en propriété repéré");
assert.ok(nums.some((n) => n.role === "condition minTrust" && n.value === 10 && n.sp === "c-un"), "seuil passé en argument repéré");
assert.ok(!nums.some((n) => n.value === 20), "le palier n'est pas pris pour un seuil");
assert.ok(w.arrays.some((a) => a.path === "MOMENTS" && a.top), "collection de premier niveau repérée");

// Exécution du code enveloppé avec les modifications publiées
const thr = nums.find((n) => n.value === 10);
const moments = w.arrays.find((a) => a.path === "MOMENTS");
globalThis.SylviniaStudioCAPublished = {
  format: "sylvinia-studio-ca", version: 1, revision: 1,
  entries: { [line.id]: "Réplique modifiée dans le Studio.", [thr.id]: 25 },
  lists: { [moments.id]: { insert: [{ at: 1, uid: "u1", item: { id: "m-deux", title: "Moment créé", minTrust: 5, intro: [{ speaker: "Narration", text: "Ajout." }], effects: { affection: 1 } } }], hide: [] } },
};
const dir = mkdtempSync(join(tmpdir(), "studio-ca-"));
writeFileSync(join(dir, "runtime.mjs"), CA_RUNTIME);
const js = ts.transpileModule(w.code.replace("virtual:sylvinia-studio-ca", "./runtime.mjs"), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
writeFileSync(join(dir, "mod.mjs"), js);
const mod = await import(pathToFileURL(join(dir, "mod.mjs")).href);
assert.equal(mod.MOMENTS[0].intro[0].text, "Réplique modifiée dans le Studio.", "texte remplacé");
assert.equal(mod.MOMENTS[0].intro[0].speaker, "Naïah", "locuteur inchangé");
assert.equal(mod.CONF[0].minTrust, 25, "seuil remplacé");
assert.equal(mod.MOMENTS.length, 2, "contenu créé ajouté à la collection");
assert.equal(mod.MOMENTS[1].id, "m-deux");
assert.equal(mod.isFirst("Le premier moment"), true, "les comparaisons du code restent intactes");
console.log("studio-ca: ok");
