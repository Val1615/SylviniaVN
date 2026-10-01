import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Chaque sprite public (Lieu, Fiche, À trois, scènes, cadeaux) doit être réellement détouré :
// un PNG/WebP « RGBA » mais entièrement opaque s'affiche avec un fond noir en jeu (cas Allenna, v2.5).
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../assets/sprites");
let checked = 0;
for (const character of readdirSync(root)) {
  const dir = path.join(root, character);
  for (const file of readdirSync(dir).filter((name) => /\.(png|webp)$/i.test(name))) {
    const result = spawnSync("identify", ["-format", "%[channels]|%[opaque]", path.join(dir, file)], { encoding: "utf8" });
    assert.equal(result.status, 0, `${character}/${file} : image illisible`);
    const [channels, opaque] = result.stdout.trim().split("|");
    assert.ok(channels.includes("a"), `${character}/${file} : pas de canal alpha`);
    assert.equal(opaque.toLowerCase(), "false", `${character}/${file} : canal alpha présent mais aucun pixel transparent (fond opaque)`);
    checked += 1;
  }
}
assert.ok(checked > 50, "Trop peu de sprites contrôlés.");
console.log(`✓ ${checked} sprites publics réellement transparents.`);
