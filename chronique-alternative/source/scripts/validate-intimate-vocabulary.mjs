// Validateur : variété du vocabulaire intime et absence de termes crus ou cliniques.
// Usage : node scripts/validate-intimate-vocabulary.mjs [--report]
import { analyseAll, MAX_PER_SCENE, MAX_FIXED_PER_SCENE, FIXED_FORMULAS, listFiles } from "./intimate-vocabulary-lib.mjs";

const { scenes, banned } = analyseAll();
const report = process.argv.includes("--report");
const json = process.argv.includes("--json");
const errors = [];
const fixed = new Set(FIXED_FORMULAS.map(([l]) => l));
for (const s of scenes) for (const [label, n] of s.counts) {
  if (n > (fixed.has(label) ? MAX_FIXED_PER_SCENE : MAX_PER_SCENE)) errors.push(`${s.file}:${s.line} [${s.name}] « ${label} » ×${n} (lignes ${[...new Set(s.hits.filter((h) => h.label === label).map((h) => h.line))].join(", ")})`);
}
for (const b of banned) errors.push(`${b.file}:${b.line} terme interdit « ${b.word} »`);

if (report || json) {
  const total = new Map(); const perChar = new Map();
  for (const s of scenes) for (const h of s.hits) {
    const label = h.label; const hits = [h];
    total.set(label, (total.get(label) || 0) + hits.length);
    for (const c of s.characters.size ? s.characters : ["(autre)"]) {
      if (!perChar.has(c)) perChar.set(c, new Map());
      perChar.get(c).set(label, (perChar.get(c).get(label) || 0) + hits.length);
    }
  }
  if (json) { console.log(JSON.stringify({ total: Object.fromEntries(total), perChar: Object.fromEntries([...perChar].map(([c, m]) => [c, Object.fromEntries(m)])), violations: errors.length })); process.exit(0); }
  console.log(`Fichiers : ${listFiles().length}, scènes : ${scenes.length}`);
  console.log("\nTop 20 global :"); [...total].sort((a, b) => b[1] - a[1]).slice(0, 20).forEach(([l, n]) => console.log(`  ${String(n).padStart(4)}  ${l}`));
  for (const [c, m] of [...perChar].sort()) console.log(`\n${c} : ` + [...m].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([l, n]) => `${l} ${n}`).join(" · "));
  console.log("");
}
if (errors.length) { console.error(`Vocabulaire intime : ${errors.length} problème(s)`); errors.forEach((e) => console.error("  " + e)); process.exit(1); }
console.log(`Vocabulaire intime OK : ${scenes.length} scènes, aucun euphémisme répété plus de ${MAX_PER_SCENE} fois par scène, aucune formule figée plus de ${MAX_FIXED_PER_SCENE} fois, aucun terme cru ou clinique.`);
