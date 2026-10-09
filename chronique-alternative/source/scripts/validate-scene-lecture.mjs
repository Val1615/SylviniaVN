// Lecture des scènes CA : bouton Retour sans effet rejoué, historique dédoublonné,
// fondu bas des sprites par masque CSS (aucun PNG modifié).
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { createServer } from "vite";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => readFile(path.join(root, file), "utf8");
const [page, bn, controls, main, css] = await Promise.all([read("src/page.tsx"), read("src/bellirith-naiah-ui.tsx"), read("src/scene-controls.tsx"), read("src/main.tsx"), read("src/ui/v2/v2-lecture.css")]);

/** Corps d’une fonction déclarée `function name(` (accolades équilibrées). */
function body(source, name) {
  const start = source.indexOf(`function ${name}(`);
  assert.ok(start >= 0, `${name} introuvable.`);
  let depth = 0, i = source.indexOf("{", source.indexOf(")", start));
  for (let j = i; j < source.length; j++) {
    if (source[j] === "{") depth++;
    else if (source[j] === "}" && --depth === 0) return source.slice(i, j + 1);
  }
  throw new Error(`${name} non fermée.`);
}

// 1. Dialogue : advanceDialogue n’applique aucun effet et empile chaque avancée ; selectChoice vide la pile.
const advance = body(page, "advanceDialogue");
assert.doesNotMatch(advance, /updateGame|setGame|applyEffects|applyChoice/, "advanceDialogue ne doit appliquer aucun effet : Retour ne doit jamais traverser un effet.");
const sets = advance.match(/setDialogue\(/g) || [];
const pushed = advance.match(/setDialogue\(withDialoguePast\(dialogue, /g) || [];
assert.equal(pushed.length, sets.length, "Chaque avancée de advanceDialogue doit empiler l’état précédent.");
assert.ok(pushed.length >= 6, "Toutes les transitions (réplique, choix, beats, relation) doivent être couvertes.");
const select = body(page, "selectChoice");
assert.match(select, /past: undefined/, "selectChoice doit vider la pile Retour : on ne revient jamais avant un choix.");
const stepBack = body(page, "stepBackDialogue");
assert.doesNotMatch(stepBack, /updateGame|setGame|onChoice|selectChoice|closeDialogue/, "Retour ne fait que ré-afficher un état déjà vu.");
assert.match(page, /onBack=\{stepBackDialogue\}/, "La scène doit recevoir le Retour.");

// 2. Scènes intimes (solo, à trois) : chaque choix vide la pile, chaque avancée l’alimente, le Retour ne finit rien.
const solo = body(page, "InteractiveIntimacyModal");
const group = body(page, "InteractiveGroupIntimacyModal");
for (const [label, source, chooses] of [["intime", solo, ["chooseApproach", "chooseDirection", "chooseAttunement"]], ["à trois", group, ["chooseDirection", "chooseAttunement"]]]) {
  for (const fn of chooses) assert.match(body(source, fn), /rollback\.clear\(\)/, `${label} : ${fn} doit vider la pile Retour.`);
  assert.match(body(source, "advance"), /rollback\.record\(/, `${label} : advance doit empiler l’état.`);
  const back = body(source, "back");
  assert.doesNotMatch(back, /onFinish|onStop|setAttunementScore|setDirection\(|setApproach|logChoice/, `${label} : Retour ne touche ni score, ni route, ni fin de scène.`);
  assert.match(source, /<SceneControls /, `${label} : barre Retour / Historique attendue.`);
}
// 3. Bellirith & Naïah : scène sans choix, effets appliqués seulement à « Continuer la chronique ».
const bnModal = body(bn, "BNIntimacyModal");
assert.match(body(bnModal, "advance"), /rollback\.record\(/, "BN : advance doit empiler l’état.");
assert.doesNotMatch(body(bnModal, "back"), /onFinish|onStop/, "BN : Retour ne termine rien.");
assert.match(bnModal, /<SceneControls /, "BN : barre Retour / Historique attendue.");

// 4. Historique : dédoublonnage par clé, réplique quittée retirée au Retour, raccourcis.
assert.match(controls, /entries\[entries\.length - 1\]\?\.key === lineKey \? entries/, "Une réplique déjà inscrite ne doit pas être dupliquée.");
assert.match(controls, /rewind: \(leavingKey: string\)/, "Retour doit retirer la réplique quittée.");
assert.match(controls, /event\.key === "ArrowLeft" \|\| event\.key === "Backspace"/, "Raccourcis Retour : ← et Retour arrière.");
assert.match(controls, /data-act="back"/, "Bouton Retour attendu.");
assert.match(controls, /sceneOwnsKeyboard/, "Seule la scène du dessus réagit au clavier.");

// 5. Fondu bas : masque CSS sur toutes les présentations de sprites des scènes CA.
assert.ok(main.indexOf("v2-lecture.css") > main.indexOf("bellirith-naiah.css"), "v2-lecture.css doit être chargée en dernier.");
for (const selector of [".scene-cast", ".intimacy-sprite img", ".group-intimacy-sprite img", ".bn-game-sprite img"]) assert.ok(css.includes(selector), `Fondu attendu sur ${selector}.`);
assert.match(css, /mask-image: var\(--ca-fondu-sprite\)/, "Le fondu doit être un masque CSS.");
assert.match(css, /--ca-fondu-sprite: linear-gradient\(0deg, transparent 0,/, "Le masque part du bas transparent.");

// 6. Comportement : la pile de dialogue restaure exactement l’état affiché et n’emporte jamais d’effet.
const server = await createServer({
  root, appType: "custom", logLevel: "error", server: { middlewareMode: true },
  plugins: [{ name: "lecture-expose", transform(code, id) { if (id.endsWith("/src/page.tsx")) return `${code}\nexport { withDialoguePast as __withDialoguePast };`; } }],
});
try {
  const { __withDialoguePast: withPast } = await server.ssrLoadModule("/src/page.tsx");
  const scene = { id: "s", title: "S", background: "", mood: "neutral", cast: ["bellirith"], kind: "ambient" };
  let state = { scene, lines: [{ speaker: "Narration", text: "a" }, { speaker: "Bellirith", text: "b" }], lineIndex: 0, phase: "intro" };
  const seen = [state];
  for (let i = 0; i < 3; i++) { state = withPast(state, { ...state, lineIndex: Math.min(i + 1, 1), phase: i === 2 ? "choices" : state.phase }); seen.push(state); }
  assert.equal(state.past.length, 3, "Trois avancées, trois instantanés.");
  assert.ok(state.past.every((snapshot) => snapshot.past === undefined), "Les instantanés ne s’imbriquent pas.");
  let rewound = state;
  for (let i = seen.length - 2; i >= 0; i--) {
    const previous = rewound.past.at(-1);
    rewound = { ...previous, past: rewound.past.slice(0, -1) };
    assert.equal(rewound.lineIndex, seen[i].lineIndex); assert.equal(rewound.phase, seen[i].phase);
  }
  assert.equal(rewound.past.length, 0, "Retour s’arrête au début de la scène.");
  let long = state; for (let i = 0; i < 600; i++) long = withPast(long, { ...long });
  assert.ok(long.past.length <= 400, "La pile reste bornée.");
} finally {
  await server.close();
}
console.log("Lecture des scènes validée : Retour sans effet rejoué (dialogue, intime, à trois, Bellirith & Naïah), historique dédoublonné, fondu bas par masque CSS.");
