import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

// Série croisée Bellirith / Valurn : contrôles §14 du dossier de consignes, plus style, positions et longueurs.
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const server = await createServer({ root, appType: "custom", logLevel: "silent", server: { middlewareMode: true } });
const results = [];
async function check(id, label, fn) {
  try { await fn(); results.push([id, label, true]); }
  catch (error) { results.push([id, label, false, error.message]); }
}
const STYLE_DASH = /[—–]/u;
const STYLE_CONTRAST = /n[’']est pas[^!?«»"]{0,80}[,;.:]\s*c[’']est\b|n[’']était pas[^!?«»"]{0,80}[,;.:]\s*c[’']était\b/iu;
const BANNED = /\b(?:chatte|bite|pénis|penis|vagin|vulve|anus|testicules?|clitoris|verge|phallus|couilles?|gland|bourses|érection)\b/iu;
const INTERSEX = /intersex|hermaphrod/iu;
const strings = (value, out = []) => {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((entry) => strings(entry, out));
  else if (value && typeof value === "object") Object.values(value).forEach((entry) => strings(entry, out));
  return out;
};
const words = (text) => text.split(/\s+/u).filter(Boolean).length;

try {
  const load = (path) => server.ssrLoadModule(path);
  const cq = await load("/src/bellirith-valurn-cross-quest.ts");
  const sc = await load("/src/bellirith-valurn-scenes.ts");
  const g = await load("/src/bellirith-valurn-never-game.ts");
  const c = await load("/src/bellirith-valurn-never-content.ts");
  const rx = await load("/src/bellirith-valurn-never-reactions.ts");
  const kit = await load("/src/bellirith-valurn-intimacy-kit.ts");
  const im = await load("/src/bellirith-valurn-intimacy.ts");
  const kn = await load("/src/bellirith-valurn-knowledge.ts");
  const her = await load("/src/heritages-data.ts");
  const ui = await load("/src/bellirith-valurn-ui.tsx");
  const { renderToStaticMarkup } = await import("react-dom/server"), { createElement } = await import("react");

  const rel = (stage, extra = {}) => ({ stage, affection: 30, trust: 30, desire: 30, met: true, ...extra });
  const base = { flags: ["main-story-act-1-complete"], knowledge: [], relationships: { bellirith: rel(3), valurn: rel(3) }, dateHistory: [], groupDateHistory: [] };
  const ctxFor = (flags = [], relationships = base.relationships) => ({ ...base, flags: [...base.flags, ...flags], relationships });
  const allScenesIds = [...cq.BV_MAIN_SCENES, ...sc.BV_FALLOUT_IDS];
  const sceneCtx = (extra = {}) => ({ flags: base.flags, knowledge: [], relationships: base.relationships, ...extra });
  const scenes = allScenesIds.map((id) => sc.bvBuildScene(id, sceneCtx()));
  const sceneVariants = allScenesIds.flatMap((id) => sc.bvSceneVariants(id));
  const play = (seed, ctx, pickIndex = 0, answer = "acknowledge") => {
    let s = g.createBVNever(seed); let guard = 0; const optionCounts = []; const seen = new Set(); let repeat = false;
    while (!s.completed && guard++ < 300) {
      if (s.awaiting) { s = g.bvAnswer(s, answer); continue; }
      if (g.bvActorAt(s) === "player") { const o = g.bvPlayerOptions(s, ctx); optionCounts.push(o.length); if (!o.length) break; const pick = o[(pickIndex + s.round) % o.length]; if (seen.has(pick.id)) repeat = true; seen.add(pick.id); s = g.bvPlayerTurn(s, pick.id, ctx); }
      else s = g.bvNpcTurn(s, ctx);
    }
    return { s, optionCounts, repeat };
  };
  const runs = [];
  const ctxs = [ctxFor(), ctxFor(["bellirith-has-resisted", "valurn-q1-choice:rules", "valurn-q3-deal:bluff", "bv-accept:taquine", "bellirith-favorite", "valurn-outcome:accord"]), ctxFor(["bellirith-trend:ceded", "valurn-q4-odile:exposed"])];
  for (let seed = 1; seed <= 150; seed++) for (const [i, ctx] of ctxs.entries()) runs.push(play(seed, ctx, seed + i, ["acknowledge", "deny", "dodge"][seed % 3]));

  // ---------------------------------------------------------------- Déblocage et structure
  await check("BV01", "Clé de série distincte de BN", () => assert.ok(cq.BV_KEY === "bellirith-valurn"));
  await check("BV02", "Identifiant de rendez-vous distinct de l’ancien", () => assert.ok(cq.BV_DATE_ID === "group-date-bellirith-valurn-never" && cq.BV_DATE_ID !== "group-date-valurn-bellirith"));
  await check("BV03", "Déblocage refusé sans Acte I", () => assert.ok(!cq.bvUnlocked({ flags: [], relationships: base.relationships })));
  await check("BV04", "Déblocage refusé sous l’étape 3", () => assert.ok(!cq.bvUnlocked({ flags: base.flags, relationships: { bellirith: rel(2), valurn: rel(3) } })));
  await check("BV05", "Déblocage refusé sans rencontre", () => assert.ok(!cq.bvUnlocked({ flags: base.flags, relationships: { bellirith: rel(3, { met: false }), valurn: rel(3) } })));
  await check("BV06", "Déblocage accordé quand tout est réuni", () => assert.ok(cq.bvUnlocked(base)));
  await check("BV07", "Six étapes titrées et objectivées", () => assert.ok(cq.BV_TITLES.length === 6 && cq.BV_OBJECTIVES.length === 6 && cq.BV_STAGE_TOTAL === 6));
  await check("BV08", "Toutes les scènes se construisent", () => assert.ok(scenes.every(Boolean)));
  await check("BV09", "Q1 propose quatre choix", () => assert.equal(sc.bvBuildScene("cross-bv-01", sceneCtx()).choices.length >= 4 || sc.bvBuildScene("cross-bv-01", sceneCtx()).beats.some((b) => b.choices.length >= 4), true));
  await check("BV10", "Q2 : deux conversations séparées", () => { const b = sc.bvBuildScene("cross-bv-02-b", sceneCtx()), v = sc.bvBuildScene("cross-bv-02-v", sceneCtx()); assert.ok(b.character === "bellirith" && v.character === "valurn"); });
  await check("BV11", "Q2-V n’applique pas d’effets Valurn en double", () => { const v = sc.bvBuildScene("cross-bv-02-v", sceneCtx()); for (const ch of [...v.choices, ...v.beats.flatMap((b) => b.choices)]) assert.ok(!ch.effects?.relationshipEffects?.valurn); });
  await check("BV12", "Q3 : quatre tons d’acceptation", () => assert.equal(sc.BV_ACCEPT_TONES.length, 4));
  await check("BV13", "Q5 attend le lendemain du salon", () => {
    let p = { ...cq.createBVProgress(1), stage: 4, bv: { choices: {}, dateDay: 5 } };
    assert.ok(cq.bvAvailableScenes(p, 5).waitTomorrow && cq.bvAvailableScenes(p, 6).scenes.length === 2);
  });
  await check("BV14", "Q6 : trois tons", () => assert.equal(Object.keys(sc.BV_Q6_CHOICES).length, 3));
  await check("BV15", "Au moins six retombées", () => assert.ok(sc.BV_FALLOUT_IDS.length >= 6));
  await check("BV16", "Fin amicale toujours disponible", () => {
    const ids = (ctx) => { const s = sc.bvBuildScene("cross-bv-04", ctx); return [...s.choices, ...s.beats.flatMap((b) => b.choices)].map((ch) => ch.id); };
    assert.ok(ids(sceneCtx({ relationships: { bellirith: rel(0, { desire: 0 }), valurn: rel(0, { desire: 0 }) } })).includes(sc.BV_ENDING_CHOICES.amical));
  });
  await check("BV17", "Voie A exige d’avoir tenu tête à Bellirith", () => {
    assert.ok(!sc.bvPathOpen(sceneCtx(), "a"));
    assert.ok(sc.bvPathOpen(sceneCtx({ flags: [...base.flags, "bellirith-has-resisted"] }), "a"));
  });
  await check("BV18", "Voie C exige les deux voies", () => assert.ok(!sc.bvPathOpen(sceneCtx({ relationships: { bellirith: rel(3), valurn: rel(3, { trust: 0 }) }, flags: [...base.flags, "bellirith-has-resisted"] }), "c")));
  await check("BV19", "Le désir de Bellirith ne vient que de la résistance", () => {
    for (const s of sceneVariants) for (const ch of [...s.choices, ...s.beats.flatMap((b) => b.choices)]) {
      const own = s.character === "bellirith" ? ch.effects?.desire : ch.effects?.relationshipEffects?.bellirith?.desire;
      if (own) assert.ok((ch.effects?.flags || []).includes("cross-bv-stood-up"), `${ch.id} donne du désir sans résistance`);
    }
    assert.ok(Object.values(cq.BV_INTIMACY_EFFECTS).every((e) => !e.bellirith?.desire));
  });
  await check("BV20", "Hydratation : sauvegarde vide ou corrompue", () => {
    const h = cq.hydrateBV({ id: "x", stage: 99, startedDay: 1, letters: [], bv: { choices: { "inconnu": ["a"], "cross-bv-01": "x" } } });
    assert.ok(h.stage <= 1 && Object.keys(h.bv.choices).length === 0);
  });
  await check("BV21", "Fin de scène idempotente", () => {
    const p = cq.finishBVScene(cq.createBVProgress(1), "cross-bv-01", ["cross-bv-01-mirror"], 1);
    const q = cq.finishBVScene(p, "cross-bv-01", ["cross-bv-01-third"], 1);
    assert.deepEqual(q.bv.choices["cross-bv-01"], ["cross-bv-01-mirror"]);
  });
  await check("BV22", "Fin choisie : intimité en attente seulement pour A/B/C", () => {
    const p = { ...cq.createBVProgress(1), stage: 3, bv: { choices: {}, never: { completed: true } } };
    assert.equal(cq.finishBVScene(p, "cross-bv-04", [sc.BV_ENDING_CHOICES.amical], 3).bv.intimacy, undefined);
    assert.equal(cq.finishBVScene(p, "cross-bv-04", [sc.BV_ENDING_CHOICES.c], 3).bv.intimacy, "bv-c");
  });

  // ---------------------------------------------------------------- Mini-jeu
  await check("BV23", "Toutes les parties se terminent", () => assert.ok(runs.every((r) => r.s.completed)));
  await check("BV24", "Durée entre 10 et 20 tours", () => assert.ok(runs.every((r) => r.s.round >= 10 && r.s.round <= 20)));
  await check("BV25", "Fin souhaitée toujours dans [10, 20]", () => assert.ok(runs.every((r) => r.s.targetEnd >= 10 && r.s.targetEnd <= 20)));
  await check("BV26", "Ordre Bellirith, Valurn, joueur", () => { const s = g.createBVNever(3); assert.deepEqual([0, 1, 2].map((t) => g.bvActorAt({ ...s, turn: t })), ["bellirith", "valurn", "player"]); });
  await check("BV27", "Au moins quatre options par tour du joueur", () => assert.ok(runs.every((r) => r.optionCounts.every((n) => n >= 4))));
  await check("BV28", "Aucune option rejouée", () => assert.ok(runs.every((r) => !r.repeat)));
  await check("BV29", "Les huit moments obligatoires ont lieu", () => assert.ok(runs.every((r) => g.BV_REQUIRED_BEATS.every((b) => r.s.beats.includes(b)))));
  await check("BV30", "Ordre des révélations respecté", () => assert.ok(runs.every((r) => { const order = r.s.beats.filter((b) => b !== "r1b"); const want = ["r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8"]; return want.every((b, i) => order.indexOf(b) === i); })));
  await check("BV31", "Quatre connaissances débloquées dans l’ordre", () => assert.ok(runs.every((r) => JSON.stringify(r.s.truths) === JSON.stringify([...g.BV_KNOWLEDGE_ORDER]))));
  await check("BV32", "Connaissances enregistrées au catalogue", () => { const ids = new Set(her.ALL_KNOWLEDGE_ENTRIES.map((e) => e.id)); assert.ok(g.BV_KNOWLEDGE_ORDER.every((id) => ids.has(id)) && kn.BV_KNOWLEDGE.length === 4); });
  await check("BV33", "Valurn boit au pivot", () => assert.ok(runs.every((r) => r.s.log.find((e) => e.beat === "r1").drinkers.includes("valurn"))));
  await check("BV34", "Au moins 80 affirmations du joueur", () => assert.ok(c.BV_PLAYER_CLAIMS.length >= 80));
  await check("BV35", "64 affirmations PNJ (2×2×4×4)", () => {
    assert.ok(c.BV_NPC_CLAIMS.length >= 64);
    for (const sp of ["bellirith", "valurn"]) for (const t of sp === "bellirith" ? ["valurn", "player"] : ["bellirith", "player"]) for (const tier of [0, 1, 2, 3])
      assert.ok(c.BV_NPC_CLAIMS.filter((x) => x.speaker === sp && x.target === t && x.tier === tier).length >= 4, `${sp}>${t} palier ${tier}`);
  });
  await check("BV36", "Au moins 25 affirmations conditionnées par la sauvegarde", () => assert.ok([...c.BV_NPC_CLAIMS, ...c.BV_NPC_EVENING, ...c.BV_NPC_FALLOUT, ...c.BV_PLAYER_CLAIMS, ...c.BV_SUBJECT_CLAIMS].filter((x) => x.save).length >= 25));
  await check("BV37", "Au moins 12 affirmations réactives à la soirée", () => assert.ok(c.BV_NPC_EVENING.filter((x) => typeof x.evening === "function").length >= 12));
  await check("BV38", "Au moins 12 transitions", () => assert.ok(Object.values(c.BV_TRANSITIONS).flat().length >= 12));
  await check("BV39", "Au moins 12 répliques de résultat", () => assert.ok(Object.values(c.BV_RESULT_RETORTS).flat().length >= 12));
  await check("BV40", "Six pressions dirigées", () => assert.equal(g.BV_PRESSURE_KEYS.length, 6));
  await check("BV41", "Aveu volontaire : reconnaître fait boire, nier ou esquiver non", () => {
    const ask = c.BV_NPC_CLAIMS.find((x) => x.truth.player === "ask");
    assert.ok(ask, "aucune affirmation à aveu");
    const s = { ...g.createBVNever(1), awaiting: ask.id, log: [{ round: 1, speaker: ask.speaker, claimId: ask.id, target: ask.target, drinkers: [] }] };
    assert.ok(g.bvAnswer(s, "acknowledge").log[0].drinkers.includes("player"));
    assert.ok(!g.bvAnswer(s, "deny").log[0].drinkers.includes("player") && !g.bvAnswer(s, "dodge").log[0].drinkers.includes("player"));
  });
  await check("BV42", "Pressions remises à zéro en fin de partie", () => {
    const r = runs[0].s; const p = cq.bvCompleteNever({ ...cq.createBVProgress(1), stage: 3, bv: { choices: {} } }, r);
    assert.ok(Object.values(p.bv.never.pressure).every((v) => v === 0) && p.bv.style);
  });
  await check("BV43", "Drapeaux de style écrits", () => assert.ok(g.bvNeverStyleFlags(runs[0].s).some((f) => f.startsWith("bv-never:player-style:"))));
  await check("BV44", "Sauvegarde intermédiaire et reprise", () => {
    let s = g.createBVNever(9); s = g.bvNpcTurn(s, ctxs[0]);
    const h = g.bvHydrateNever(JSON.parse(JSON.stringify(s)));
    assert.deepEqual(JSON.parse(JSON.stringify(h.log)), JSON.parse(JSON.stringify(s.log))); assert.equal(h.round, s.round);
  });
  await check("BV45", "Partie conclue verrouillée", () => { const p = cq.bvCompleteNever({ ...cq.createBVProgress(1), bv: { choices: {} } }, runs[0].s); assert.equal(cq.bvSaveNever(p, g.createBVNever(2)), p); });
  await check("BV46", "Hydratation de partie corrompue", () => { const h = g.bvHydrateNever({ round: 999, targetEnd: -5, log: [{}], drinks: "x" }); assert.ok(h.round <= 20 && h.targetEnd >= 10 && h.log.length === 0); });
  await check("BV47", "Le joueur ne boit qu’avec une preuve ou un aveu", () => {
    for (const r of runs.slice(0, 60)) for (const e of r.s.log) if (e.drinkers.includes("player")) assert.ok(e.playerComputed || e.answer === "acknowledge", `${e.claimId} fait boire sans preuve`);
  });
  await check("BV48", "Une raison accompagne chaque preuve tirée de la sauvegarde", () => {
    for (const x of [...c.BV_NPC_CLAIMS, ...c.BV_PLAYER_CLAIMS]) if (typeof x.truth.player === "function" && x.save) assert.ok(x.why, `${x.id} sans explication`);
  });

  // ---------------------------------------------------------------- Intimités
  const allIntimacy = im.BV_INTIMACY_SCENES;
  await check("BV49", "Six scènes intimes : trois voies × deux corps", () => assert.ok(allIntimacy.length === 6 && ["a", "b", "c"].every((v) => ["femme", "homme"].every((sx) => im.bvIntimacyScene(v, sx).voie === v && im.bvIntimacyScene(v, sx).sex === sx))));
  await check("BV50", "Au moins 12 séquences dans chaque mode", () => { for (const s of allIntimacy) for (const m of ["tendre", "suggestif", "explicite", "ellipse"]) assert.ok(s.chapters[m].length >= 12, `${s.id} ${m}`); });
  await check("BV51", "Une position nommée par séquence explicite", () => { for (const s of allIntimacy) assert.equal(s.positions.length, s.chapters.explicite.length, s.id); });
  await check("BV52", "Positions variées dans chaque scène", () => { for (const s of allIntimacy) assert.equal(new Set(s.positions).size, s.positions.length, s.id); });
  await check("BV53", "Positions distinctes d’une scène à l’autre (hors congé et eau)", () => {
    const seen = new Map();
    for (const s of allIntimacy) for (const p of s.positions) { if (/galerie, seul|congé|billets/u.test(p)) continue; if (seen.has(p) && seen.get(p).slice(0, 4) !== s.id.slice(0, 4)) assert.fail(`${p} répété`); seen.set(p, s.id); }
  });
  await check("BV54", "Séquences explicites longues et denses", () => {
    for (const s of allIntimacy) {
      const counts = kit.bvRenderChapters(s, "explicite").map((ch) => words(ch.map((l) => l.text).join(" ")));
      const avg = counts.reduce((a, b) => a + b, 0) / counts.length;
      assert.ok(avg >= 90, `${s.id} moyenne ${Math.round(avg)} mots`);
      const action = counts.filter((n) => n >= 110).length;
      assert.ok(action >= 6, `${s.id} : ${action} séquences d’action denses`);
    }
  });
  await check("BV55", "Fondu au noir non graphique", () => { for (const s of allIntimacy) for (const ch of s.chapters.ellipse) assert.ok(words(strings(ch).join(" ")) <= 20, s.id); });
  await check("BV56", "Aucun moment intime entre Bellirith et Valurn", () => {
    for (const s of allIntimacy) {
      if (s.voie === "a") assert.ok(!strings(s.chapters).some((t) => t.includes("Valurn")), `${s.id} cite Valurn pendant l’intimité`);
      if (s.voie === "b") assert.ok(!strings(s.chapters).some((t) => t.includes("Bellirith") && !/tenté de l’empoisonner/u.test(t)), `${s.id} cite Bellirith`);
      if (s.voie === "c") for (const [i, ch] of s.chapters.explicite.entries()) { const t = strings(ch).join(" "); const lines = ch.filter((l) => Array.isArray(l)).map((l) => l[0]); assert.ok(!(lines.includes("B") && lines.includes("V")), `${s.id} séquence ${i + 1} réunit les deux`); void t; }
    }
  });
  await check("BV57", "Consentement explicite à l’ouverture", () => { for (const s of allIntimacy) assert.ok(/stop|non|arrêter|porte/iu.test(strings(s.opening).join(" ")) && s.opening.some((l) => Array.isArray(l) && l[0] === "P" && /oui/iu.test(l[1])), s.id); });
  await check("BV58", "Sprites intimes seulement pour Bellirith, en explicite, après dévoilement", () => {
    for (const s of allIntimacy) { assert.ok(!kit.bvIntimateVisible(s, "suggestif", 5)); if (s.voie === "b") assert.ok(s.bellirithMoods.every((m) => m === "")); }
  });

  // ---------------------------------------------------------------- Écriture
  const corpus = [
    ...sceneVariants.flatMap((s) => strings(s)),
    ...strings([c.BV_NPC_CLAIMS, c.BV_NPC_EVENING, c.BV_NPC_FALLOUT, c.BV_PLAYER_CLAIMS, c.BV_PLAYER_FALLOUT, c.BV_SUBJECT_CLAIMS, c.BV_PIVOT_CLAIMS, c.BV_PIVOT_FORCED, c.BV_PIVOT_SILENCE, c.BV_REVEAL_BEATS, c.BV_TRANSITIONS, c.BV_RESULT_RETORTS]),
    ...strings(Object.fromEntries(Object.entries(rx).filter(([, v]) => typeof v === "object"))),
    ...allIntimacy.flatMap((s) => kit.bvAllIntimacyLines(s).map((l) => l.text)),
  ];
  await check("BV59", "Aucun tiret cadratin ou demi-cadratin", () => { const bad = corpus.filter((t) => STYLE_DASH.test(t)); assert.equal(bad.length, 0, bad[0]); });
  await check("BV60", "Aucune tournure « ce n’est pas X, c’est Y »", () => { const bad = corpus.filter((t) => STYLE_CONTRAST.test(t)); assert.equal(bad.length, 0, bad[0]); });
  await check("BV61", "Aucun terme cru ou clinique", () => { const bad = corpus.filter((t) => BANNED.test(t)); assert.equal(bad.length, 0, bad[0]); });
  await check("BV62", "Aucune mention d’intersexuation", () => assert.ok(!corpus.some((t) => INTERSEX.test(t))));
  await check("BV63", "Narration à la deuxième personne du pluriel", () => { const narr = allIntimacy.flatMap((s) => s.chapters.explicite.flat().filter((l) => typeof l === "string")); assert.ok(narr.filter((t) => /\bvous\b|\bvotre\b|\bvos\b/iu.test(t)).length / narr.length > 0.6); });
  await check("BV64", "Aucune formule copiée du Tome II", () => {
    const forbidden = [/entretenu ma haine parce qu/iu, /à une mort certaine/iu, /dernier lien/iu];
    assert.ok(!corpus.some((t) => forbidden.some((rx) => rx.test(t))));
  });
  await check("BV65", "Aucun passé Iriana prêté au joueur", () => assert.ok(!strings([c.BV_SUBJECT_CLAIMS, c.BV_PLAYER_CLAIMS]).some((t) => /Iriana/u.test(t))));
  await check("BV66", "Les fichiers Valurn existants ne contiennent pas les nouvelles révélations", async () => {
    const files = (await readdir(resolve(root, "src"))).filter((f) => /^valurn/.test(f));
    for (const f of files) { const t = await readFile(resolve(root, "src", f), "utf8"); assert.ok(!/talisman de transfert/iu.test(t), f); }
  });

  // ---------------------------------------------------------------- Interface
  const fmt = (t) => t.replaceAll("{player}", "Aube");
  await check("BV67", "Fenêtre de jeu V2 : décor, sprites, compteur discret, reprise, aucune jauge de pression (seule l’ivresse est montrée)", () => {
    const m = renderToStaticMarkup(createElement(ui.BVNeverModal, { state: g.createBVNever(1), ctx: ctxs[0], background: "/assets/backgrounds/algratal_music_room.webp", format: fmt, onChange() {}, onClose() {}, onFinish() {} }));
    assert.ok(/Tour (1|I)\b/u.test(m) && m.includes("Reprendre plus tard") && !/pression|progress/iu.test(m) && !/jauge/iu.test(m.replace(/bv-ivresse-jauge/gu, "")));
    assert.ok(m.includes("v2-scene") && m.includes("algratal_music_room.webp") && m.includes("scene-cast cast-2") && (m.match(/scene-sprite/gu) || []).length === 2);
  });
  await check("BV68", "Dossier rendu à chaque étape", () => {
    for (let stage = 0; stage <= 6; stage++) renderToStaticMarkup(createElement(ui.BVDossier, { progress: { ...cq.createBVProgress(1), stage }, day: 2, onScene() {}, onNever() {}, onIntimacy() {} }));
  });
  await check("BV69", "Bloc développeur rendu avec les quatre modes", () => {
    const m = renderToStaticMarkup(createElement(ui.BVDevBlock, { progress: undefined, unlockChecks: cq.bvUnlockChecks(base), sceneIds: cq.BV_MAIN_SCENES, actions: new Proxy({}, { get: () => () => {} }) }));
    assert.ok(["tendre", "suggestif", "explicite", "ellipse"].every((mode) => m.includes(`value="${mode}"`)));
  });
  await check("BV70", "Modale intime rendue pour les six scènes", () => {
    for (const id of ["bv-a", "bv-b", "bv-c"]) for (const sex of ["femme", "homme"]) renderToStaticMarkup(createElement(ui.BVIntimacyModal, { id, mode: "explicite", sex, background: "", format: fmt, onStop() {}, onFinish() {} }));
  });

  // ---------------------------------------------------------------- Compléments §14
  const groups = await load("/src/group-dates.ts");
  const prelude = ["cross-bv-01", "cross-bv-02-b", "cross-bv-02-v", "cross-bv-03"].flatMap((id) => sc.bvSceneVariants(id)).flatMap((s) => strings(s));
  await check("BV71", "Q1 à Q3 ne révèlent ni talisman, ni artefact, ni abandon", () => assert.ok(!prelude.some((t) => /talisman|artefact|abandonn/iu.test(t))));
  await check("BV72", "Trois interventions par tour, fin au bout d’un tour complet", () => assert.ok(runs.every((r) => r.s.log.length === r.s.round * 3 && r.s.log.at(-1).speaker === "player")));
  await check("BV73", "La durée varie réellement selon les choix", () => assert.ok(new Set(runs.map((r) => r.s.round)).size >= 4));
  await check("BV74", "Chaque PNJ vise réellement l’autre et le joueur", () => {
    const targets = (sp) => new Set(runs.flatMap((r) => r.s.log.filter((e) => e.speaker === sp && !e.beat && e.claimId).map((e) => e.target)));
    assert.ok(targets("bellirith").has("valurn") && targets("bellirith").has("player") && targets("valurn").has("bellirith") && targets("valurn").has("player"));
  });
  await check("BV75", "Zéro, un, deux et trois buveurs se produisent", () => { const n = new Set(runs.flatMap((r) => r.s.log.map((e) => e.drinkers.length))); assert.ok([0, 1, 2, 3].every((k) => n.has(k))); });
  await check("BV76", "Q5 et Q6 restent ouvertes quelle que soit la fin", () => {
    for (const id of Object.values(sc.BV_ENDING_CHOICES)) { const prior = { "cross-bv-01": ["cross-bv-01-mirror"], "cross-bv-02-b": ["x"], "cross-bv-02-v": ["x"], "cross-bv-03": ["x"] };
      const p = cq.finishBVScene({ ...cq.createBVProgress(1), stage: 3, bv: { choices: prior, never: { completed: true } } }, "cross-bv-04", [id], 3); assert.equal(p.stage, 4, id); assert.equal(cq.bvAvailableScenes(p, 4).scenes.length, 2, id); }
  });
  await check("BV77", "Fin amicale sans désir", () => { const s = sc.bvBuildScene("cross-bv-04", sceneCtx()); const ch = [...s.choices, ...s.beats.flatMap((b) => b.choices)].find((x) => x.id === sc.BV_ENDING_CHOICES.amical); assert.ok(!ch.effects.desire && !ch.effects.relationshipEffects?.valurn?.desire); });
  await check("BV78", "L’ancien rendez-vous Valurn / Bellirith existe toujours", () => assert.ok(groups.GROUP_DATES.some((d) => d.id === "group-date-valurn-bellirith") && !groups.GROUP_DATES.some((d) => d.id === cq.BV_DATE_ID)));
  await check("BV79", "Ni stase inventée ni transfert en panne", () => assert.ok(!corpus.some((t) => /\bstase\b|tomb[ée] en panne|n’a pas fonctionné/iu.test(t))));
  await check("BV80", "Valurn a choisi : la décision est nommée comme telle", () => assert.ok(/choisi de ne pas/iu.test(strings(c.BV_REVEAL_BEATS.r6).join(" "))));

  // ---------------------------------------------------------------- Répliques de table et ivresse
  const RX_BASE = ["BV_PLAYER_LEADS", "BV_PLAYER_LEADS_SOLEMN", "BV_THEME_REACTIONS", "BV_STATEMENT_REACTIONS", "BV_STATEMENT_GENERIC", "BV_STATEMENT_FALLOUT", "BV_STATEMENT_SOLEMN", "BV_PLAYER_ANSWERS", "BV_ANSWER_REACTIONS", "BV_ANSWER_GENERIC"];
  const rxLines = (value, out = []) => { if (Array.isArray(value)) out.push(...value); else if (value && typeof value === "object") Object.values(value).forEach((v) => rxLines(v, out)); return out; };
  const rxAll = RX_BASE.flatMap((name) => [...rxLines(rx[name]), ...rxLines(rx[`${name}_T`])]);
  await check("BV81", "Répliques de table : sans tiret, sans « ce n’est pas X, c’est Y », sans mot cru ni indice du secret", () => {
    const bad = rxAll.filter((l) => STYLE_DASH.test(l.text) || STYLE_CONTRAST.test(l.text) || BANNED.test(l.text) || /talisman|artefact|humanit|deux objets/iu.test(l.text));
    assert.equal(bad.length, 0, bad[0]?.text);
    assert.ok(rxAll.every((l) => ["{player}", "Bellirith", "Valurn"].includes(l.speaker)));
  });
  await check("BV82", "Répliques de table toutes uniques, et distinctes du reste du jeu", () => {
    const texts = rxAll.map((l) => l.text);
    const dup = texts.find((t, i) => texts.indexOf(t) !== i); assert.ok(!dup, dup);
    const others = corpus.filter((t) => !texts.includes(t));
    const clash = texts.find((t) => others.includes(t)); assert.ok(!clash, clash);
  });
  await check("BV83", "Chaque banque de réplique a des variantes sobre, gris et ivre", () => {
    const walk = (baseNode, tierNode, path) => {
      if (Array.isArray(baseNode)) { assert.ok(baseNode.length >= 1, `${path} sobre vide`); assert.ok(tierNode && tierNode.gris?.length >= 1 && tierNode.ivre?.length >= 1, `${path} sans variante gris/ivre`); return; }
      for (const [key, value] of Object.entries(baseNode)) walk(value, tierNode?.[key], `${path}.${key}`);
    };
    for (const name of RX_BASE) walk(rx[name], rx[`${name}_T`], name);
    assert.ok(rxAll.length >= 300, `seulement ${rxAll.length} répliques`);
  });
  const choiceStats = { choices: 0, missing: [], repeated: [], tiers: { sobre: 0, gris: 0, ivre: 0 } };
  const tierOf = new Map();
  for (const name of RX_BASE) { rxLines(rx[name]).forEach((l) => tierOf.set(l.text, "sobre")); const t = rx[`${name}_T`]; const walkT = (n) => { if (n && n.gris && n.ivre && Array.isArray(n.gris)) { n.gris.forEach((l) => tierOf.set(l.text, "gris")); n.ivre.forEach((l) => tierOf.set(l.text, "ivre")); } else if (n && typeof n === "object") Object.values(n).forEach(walkT); }; walkT(t); }
  for (const run of runs) {
    const heard = new Set();
    run.s.log.forEach((record, index) => {
      if (record.speaker !== "player" && !record.answer) return;
      choiceStats.choices += 1;
      const lines = g.bvChoiceLines(run.s, index);
      if (lines.before.length !== 1 || lines.before[0].speaker !== "{player}" || lines.after.length < 1) choiceStats.missing.push(`${record.claimId}:${record.answer || "affirmation"}`);
      const view = g.bvRecordView(run.s, index);
      if (!view || !lines.before.every((l) => view.lines.includes(l)) || !lines.after.every((l) => view.lines.includes(l))) choiceStats.missing.push(`vue ${record.claimId}`);
      for (const l of [...lines.before, ...lines.after]) { if (heard.has(l.text)) choiceStats.repeated.push(l.text); heard.add(l.text); choiceStats.tiers[tierOf.get(l.text)] += 1; }
    });
  }
  await check("BV84", "Chaque choix (affirmation, reconnaître, nier, esquiver) donne votre réplique et au moins une réaction", () => {
    assert.ok(choiceStats.choices > 3000, `${choiceStats.choices} choix simulés`);
    assert.equal(choiceStats.missing.length, 0, choiceStats.missing[0]);
    const answers = new Set(runs.flatMap((run) => run.s.log.map((r) => r.answer).filter(Boolean)));
    assert.deepEqual([...answers].sort(), ["acknowledge", "deny", "dodge"]);
  });
  await check("BV85", "Aucune réplique de table répétée au cours d’une même soirée", () => assert.equal(choiceStats.repeated.length, 0, choiceStats.repeated[0]));
  await check("BV86", "L’ivresse monte avec les verres et relâche les répliques (gris et ivre réellement entendus)", () => {
    assert.equal(g.bvIvresse(0), "sobre"); assert.equal(g.bvIvresse(g.BV_IVRESSE_GRIS), "gris"); assert.equal(g.bvIvresse(g.BV_IVRESSE_IVRE), "ivre");
    assert.ok(choiceStats.tiers.gris > 200 && choiceStats.tiers.ivre > 100, JSON.stringify(choiceStats.tiers));
    for (const run of runs.slice(0, 30)) { const last = run.s.log.length - 1; assert.deepEqual(g.bvDrinksAt(run.s, last), run.s.drinks); }
  });
  await check("BV87", "Jauges d’ivresse affichées pour les trois convives dans le panneau", () => {
    const m = renderToStaticMarkup(createElement(ui.BVNeverModal, { state: runs[0].s, ctx: ctxs[0], background: "/assets/backgrounds/algratal_music_room.webp", format: fmt, onChange() {}, onClose() {}, onFinish() {} }));
    assert.equal((m.match(/role="meter"/gu) || []).length, 3);
    assert.ok(/Ivresse de Bellirith/u.test(m) && /Ivresse de Valurn/u.test(m) && /Ivresse de Vous/u.test(m));
  });

  const failed = results.filter((r) => !r[2]);
  for (const r of failed) console.error(`✗ ${r[0]} ${r[1]} : ${r[3]}`);
  const playerWords = allIntimacy.map((s) => `${s.id} ${Object.entries(s.chapters).map(([m, chs]) => `${m} ${words(strings(chs).join(" "))}`).join(" · ")}`);
  const rounds = runs.map((r) => r.s.round);
  if (failed.length) { console.error(`[Bellirith / Valurn] ${failed.length} contrôle(s) en échec sur ${results.length}.`); process.exitCode = 1; }
  else {
    console.log(`[Bellirith / Valurn] ${results.length} contrôles OK · ${runs.length} parties simulées (${Math.min(...rounds)} à ${Math.max(...rounds)} tours) · ${c.BV_PLAYER_CLAIMS.length} affirmations joueur · ${c.BV_NPC_CLAIMS.length} PNJ.`);
    for (const line of playerWords) console.log(`  ${line}`);
  }
} finally { await server.close(); }
