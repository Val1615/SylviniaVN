// V2.5 — fenêtres refondues, scènes (plaque, choix en cartes, historique) et bilan de fin de journée.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { createServer } from "vite";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => readFile(path.join(root, file), "utf8");
const [page, main, css] = await Promise.all([read("src/page.tsx"), read("src/main.tsx"), read("src/ui/v2/v2-fenetres.css")]);

// 1. Fenêtres : nouveaux composants présents, anciens gabarits retirés.
for (const comp of ["V2Fenetre", "V2Portrait", "V2Cadeau", "V2CadeauReaction", "V2Lettre", "V2Resultat", "V2JeuResultat", "V2BilanJour"]) {
  assert.match(page, new RegExp(`function ${comp}\\b`), `${comp} doit exister.`);
}
for (const legacy of ["gift-modal", "wide-modal", "character-modal", "invitation-modal"]) {
  assert.doesNotMatch(page, new RegExp(`className=["{\`][^"\`]*\\b${legacy}\\b`), `L’ancien gabarit .${legacy} ne doit plus être rendu.`);
}
assert.match(page, /character\.giftLikes\.includes\(hovered\.id\)/, "L’aperçu de réaction doit suivre la vraie préférence (giftLikes).");
assert.match(page, /const reaction: V2GiftReaction = \{ character: characterId, giftId, liked, affection: clamp\(before\.affection \+ \(liked \? 6 : 2\)\) - before\.affection/, "La réaction au présent doit recevoir les écarts réellement appliqués.");
assert.match(page, /data-act="job-accepter"/, "Le lanceur de job doit exposer son bouton d’acceptation.");
assert.match(page, /data-reponse=\{reply\.id\}/, "Les réponses de lettre doivent être des cartes de choix.");
// 2. Scènes : historique, choix en cartes, raccourcis.
assert.match(page, /className="scene-backlog"/, "La scène doit proposer un historique.");
assert.match(page, /data-act="backlog"/, "Le bouton Historique doit exister.");
assert.match(page, /event\.key\.toLowerCase\(\) === "h"/, "La touche H doit ouvrir l’historique.");
assert.match(page, /className="v2-choix-carte"[^>]*disabled=\{locked\}/, "Les choix de scène doivent être des cartes et garder leur verrouillage.");
// 3. Styles : feuille chargée après l’intégration V2, curseurs d’échelle et mouvement réduit respectés.
assert.ok(main.indexOf("v2-fenetres.css") > main.indexOf("v2-integration.css"), "v2-fenetres.css doit être importée après v2-integration.css.");
for (const v of ["var(--k, 1)", "var(--tr, 1)", "var(--echelle, 1)", "var(--sprite, 1)"]) assert.ok(css.includes(v), `Les fenêtres doivent utiliser ${v}.`);
assert.match(css, /prefers-reduced-motion: reduce/, "Le mouvement réduit doit être respecté.");
assert.match(css, /max-height: 600px\) and \(orientation: landscape\)/, "Le format paysage bas (Galaxy Fold 830×525) doit être traité.");
assert.match(css, /\.bilan-jour \{[^}]*z-index: 97/, "Le bilan doit passer au-dessus du HUD et des toasts.");

// 4. Bilan de fin de journée : calculé uniquement à partir d’écarts réels entre deux états.
const server = await createServer({
  root, appType: "custom", logLevel: "error", server: { middlewareMode: true },
  plugins: [{ name: "v25-expose", transform(code, id) { if (id.endsWith("/src/page.tsx")) return `${code}\nexport { v2DayRecap as __v2DayRecap, createGame as __createGame, DEFAULT_PLAYER as __DEFAULT_PLAYER };`; } }],
});
try {
  const mod = await server.ssrLoadModule("/src/page.tsx");
  const base = mod.__createGame({ ...mod.__DEFAULT_PLAYER, name: "Test" });
  assert.deepEqual(mod.__v2DayRecap(base, structuredClone(base)), [], "Deux états identiques ne doivent produire aucune ligne.");
  const next = structuredClone(base);
  const id = Object.keys(next.relationships)[0];
  next.day += 1;
  next.relationships[id].affection += 6; next.relationships[id].trust += 3; next.relationships[id].met = true; base.relationships[id].met = false;
  next.coins -= 20;
  next.jobRuns = { ...next.jobRuns, "test-job": (next.jobRuns["test-job"] || 0) + 2 };
  next.codex = [...next.codex, "Entrée neuve"];
  const rows = mod.__v2DayRecap(base, next);
  const lien = rows.find((row) => row.kind === "lien");
  assert.ok(lien && lien.character.id === id && lien.affection === 6 && lien.trust === 3 && lien.desire === 0 && lien.met, "Les écarts de relation doivent être exacts.");
  assert.deepEqual(rows.find((row) => row.kind === "bourse"), { kind: "bourse", delta: -20 }, "L’écart de bourse doit être exact (y compris négatif).");
  assert.deepEqual(rows.find((row) => row.kind === "compte" && row.label === "Jobs accomplis")?.count, 2, "Les jobs accomplis doivent être comptés.");
  assert.deepEqual(rows.find((row) => row.kind === "liste" && row.label === "Codex")?.items, ["Entrée neuve"], "Les nouvelles entrées du codex doivent apparaître.");
  assert.ok(!rows.some((row) => row.kind === "stat" || row.kind === "confluence"), "Aucune statistique inchangée ne doit être inventée.");
} finally {
  await server.close();
}
console.log("V2.5 fenêtres, scènes et bilan : OK");
