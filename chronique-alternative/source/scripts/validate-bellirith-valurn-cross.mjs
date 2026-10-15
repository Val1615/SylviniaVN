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
      if (!view || view.lines[0]?.text !== lines.before[0]?.text || !view.lines.some((l) => l.step === "a-vous" || l.step === "entre-eux")) choiceStats.missing.push(`vue ${record.claimId}`);
      for (const l of [...lines.before, ...lines.after].filter((x) => view?.lines.some((v) => v.text === x.text))) { if (heard.has(l.text)) choiceStats.repeated.push(l.text); heard.add(l.text); choiceStats.tiers[tierOf.get(l.text)] += 1; }
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
    assert.equal(g.bvIvresse(0), "sobre"); assert.equal(g.bvIvresse(g.BV_IVRESSE_GRIS), "gris"); assert.equal(g.bvIvresse(g.BV_IVRESSE_GRIS - 1), "sobre"); assert.equal(g.bvIvresse(g.BV_IVRESSE_IVRE), "ivre");
    assert.ok(choiceStats.tiers.gris > 200 && choiceStats.tiers.ivre > 100, JSON.stringify(choiceStats.tiers));
    for (const run of runs.slice(0, 30)) { const last = run.s.log.length - 1; assert.deepEqual(g.bvDrinksAt(run.s, last), run.s.drinks); }
  });
  await check("BV87", "Jauges d’ivresse affichées pour les trois convives dans le panneau", () => {
    const m = renderToStaticMarkup(createElement(ui.BVNeverModal, { state: runs[0].s, ctx: ctxs[0], background: "/assets/backgrounds/algratal_music_room.webp", format: fmt, onChange() {}, onClose() {}, onFinish() {} }));
    assert.equal((m.match(/role="meter"/gu) || []).length, 3);
    assert.ok(/Ivresse de Bellirith/u.test(m) && /Ivresse de Valurn/u.test(m) && /Ivresse de Vous/u.test(m));
  });
  await check("BV88", "Pression : vignette, sprite penché et frisson des cartes quand un convive vous somme de répondre, discrets et coupés en mouvement réduit", async () => {
    let s0 = g.createBVNever(3); let guard = 0;
    while (!s0.awaiting && !s0.completed && guard++ < 200) s0 = g.bvActorAt(s0) === "player" ? g.bvPlayerTurn(s0, g.bvPlayerOptions(s0, ctxs[0])[0].id, ctxs[0]) : g.bvNpcTurn(s0, ctxs[0]);
    assert.ok(s0.awaiting, "aucune question en attente simulée");
    const m = renderToStaticMarkup(createElement(ui.BVNeverModal, { state: s0, ctx: ctxs[0], background: "/x.webp", format: fmt, onChange() {}, onClose() {}, onFinish() {} }));
    const asker = s0.log[s0.log.length - 1].speaker;
    assert.ok(m.includes(`bv-pression-${asker}`) && m.includes("bv-pression-voile") && /data-pression="[123]"/u.test(m), "effet de pression absent");
    const calm = renderToStaticMarkup(createElement(ui.BVNeverModal, { state: g.createBVNever(1), ctx: ctxs[0], background: "/x.webp", format: fmt, onChange() {}, onClose() {}, onFinish() {} }));
    assert.ok(!calm.includes("bv-pression"), "pression affichée hors question");
    const css = await readFile(resolve(root, "src/bellirith-valurn.css"), "utf8");
    assert.ok(/\.bv-pression-voile\s*\{[^}]*pointer-events:\s*none/u.test(css) && /transparent var\(--pr-in\)/u.test(css), "la vignette doit laisser le centre libre et ne pas capter les clics");
    assert.ok(/prefers-reduced-motion[^}]*bv-pression/u.test(css) && /body\.reduit \.bv-pression/u.test(css), "mouvement réduit non respecté");
    const frames = [...css.matchAll(/@keyframes (bv-pression[\w-]*)\s*\{((?:[^{}]*\{[^}]*\})*)\s*\}/gu)];
    assert.ok(frames.length >= 2, "keyframes de pression introuvables");
    for (const [, name, body] of frames) assert.ok(!/(?:width|height|top|left|filter|box-shadow)\s*:/u.test(body), `animation coûteuse : ${name}`);
  });
  await check("BV89", "Crans de pression 1 à 4 : chaque cran est nettement plus fort que le précédent", async () => {
    const css = await readFile(resolve(root, "src/bellirith-valurn.css"), "utf8");
    const level = (n) => { const m = css.match(new RegExp(`\\.bv-pression\\[data-pression="${n}"\\]\\s*\\{([^}]*)\\}`, "u")); assert.ok(m, `cran ${n} absent`); return Object.fromEntries([...m[1].matchAll(/--pr-(\w+):\s*([\d.]+)/gu)].map(([, k, v]) => [k, Number(v)])); };
    const tiers = [1, 2, 3, 4].map(level);
    for (let i = 1; i < 4; i++) {
      for (const key of ["a", "w", "z", "r", "x", "m"]) assert.ok(tiers[i][key] > tiers[i - 1][key], `--pr-${key} ne monte pas du cran ${i} au cran ${i + 1}`);
      for (const key of ["in", "t"]) assert.ok(tiers[i][key] < tiers[i - 1][key], `--pr-${key} ne se resserre pas du cran ${i} au cran ${i + 1}`);
      assert.ok(tiers[i].a - tiers[i - 1].a >= .1 && tiers[i].w - tiers[i - 1].w >= 20, `écart trop faible entre les crans ${i} et ${i + 1}`);
    }
    const seenLevels = new Set();
    for (const run of runs) run.s.log.forEach((r, i) => { if (r.answer) seenLevels.add(g.bvPressionLevel(run.s, i)); });
    assert.deepEqual([...seenLevels].sort(), [1, 2, 3, 4], `crans atteints en partie : ${[...seenLevels].sort()}`);
  });
  await check("BV90", "Reprendre plus tard : la soirée sauvegardée en cours de partie se recharge à l’identique (tour, verres, ivresse, pression, répliques, question en attente, secrets)", () => {
    const norm = (v) => { const o = JSON.parse(JSON.stringify(v)); if (o && "round" in o && "log" in o) { o.completed = Boolean(o.completed); o.tutorialSeen = Boolean(o.tutorialSeen); } return o; };
    const view = (st) => renderToStaticMarkup(createElement(ui.BVNeverModal, { state: st, ctx: ctxs[1], background: "/x.webp", format: fmt, onChange() {}, onClose() {}, onFinish() {} }));
    let snapshots = 0, awaitingSeen = 0, truthsSeen = 0;
    for (const seed of [2, 5, 9, 14]) {
      let s = g.createBVNever(seed); let guard = 0;
      while (!s.completed && guard++ < 300) {
        const progress = cq.bvSaveNever({ ...cq.createBVProgress(1), stage: 3 }, s);
        const reloaded = cq.hydrateBV(JSON.parse(JSON.stringify(progress))).bv.never;
        assert.deepEqual(norm(reloaded), norm(s), `état perdu au tour ${s.round} (graine ${seed})`);
        const last = s.log.length - 1;
        if (last >= 0) {
          assert.deepEqual(g.bvDrinksAt(reloaded, last), g.bvDrinksAt(s, last));
          assert.equal(g.bvPressionLevel(reloaded, last), g.bvPressionLevel(s, last));
          assert.deepEqual(norm(g.bvChoiceLines(reloaded, last)), norm(g.bvChoiceLines(s, last)));
        }
        assert.equal(view(reloaded), view(s), `affichage différent après rechargement au tour ${s.round}`);
        snapshots++; if (s.awaiting) awaitingSeen++; if (s.truths.length) truthsSeen++;
        if (s.awaiting) s = g.bvAnswer(s, ["acknowledge", "deny", "dodge"][s.round % 3]);
        else if (g.bvActorAt(s) === "player") { const o = g.bvPlayerOptions(s, ctxs[1]); s = g.bvPlayerTurn(s, o[s.round % o.length].id, ctxs[1]); }
        else s = g.bvNpcTurn(s, ctxs[1]);
      }
    }
    assert.ok(snapshots > 100 && awaitingSeen > 5 && truthsSeen > 5, `couverture insuffisante ${snapshots}/${awaitingSeen}/${truthsSeen}`);
    let mid = g.createBVNever(4); for (let i = 0; i < 12 && !mid.completed; i++) mid = mid.awaiting ? g.bvAnswer(mid, "deny") : g.bvActorAt(mid) === "player" ? g.bvPlayerTurn(mid, g.bvPlayerOptions(mid, ctxs[0])[0].id, ctxs[0]) : g.bvNpcTurn(mid, ctxs[0]);
    const dossier = renderToStaticMarkup(createElement(ui.BVDossier, { progress: cq.bvSaveNever({ ...cq.createBVProgress(1), stage: 3 }, mid), day: 2, onScene() {}, onNever() {}, onIntimacy() {} }));
    assert.ok(dossier.includes(`Reprendre la soirée · tour ${mid.round}`) && dossier.includes("soirée conservée"), "le journal n’affiche pas la reprise");
  });
  await check("BV91", "Musique de la soirée : pistes intactes, thème léger puis version tendue à partir du tournant, restaurée à la reprise", async () => {
    const { createHash } = await import("node:crypto");
    const md = await load("/src/music-data.ts");
    const expected = { "bv-never-jeu": "54ad45b244391923ebf0b43078170dbd459e7e63a50e8862a949882962e48e7b", "bv-never-tournant": "63d485a572b0d507029de7307c4e61976d944ea35487219ff2f0071a8a5912e6" };
    for (const [id, hash] of Object.entries(expected)) {
      const bytes = await readFile(resolve(root, "../assets/audio", `${id}.mp3`));
      assert.equal(createHash("sha256").update(bytes).digest("hex"), hash, `${id}.mp3 modifié`);
      assert.ok(md.MUSIC_LABELS[id], `libellé manquant pour ${id}`);
    }
    assert.equal(g.bvNeverMusic(g.createBVNever(1)), "bv-never-jeu");
    let pivoted = 0;
    for (const run of runs.slice(0, 60)) {
      assert.equal(g.bvNeverMusic(run.s), run.s.pivotRound !== undefined ? "bv-never-tournant" : "bv-never-jeu");
      let s = g.createBVNever(run.s.seed); let guard = 0;
      while (!s.completed && guard++ < 300) {
        const reloaded = cq.hydrateBV(JSON.parse(JSON.stringify(cq.bvSaveNever({ ...cq.createBVProgress(1), stage: 3 }, s)))).bv.never;
        assert.equal(g.bvNeverMusic(reloaded), g.bvNeverMusic(s), "piste différente après reprise");
        if (s.pivotRound !== undefined) pivoted++;
        if (s.awaiting) s = g.bvAnswer(s, "dodge"); else if (g.bvActorAt(s) === "player") s = g.bvPlayerTurn(s, g.bvPlayerOptions(s, ctxs[0])[0].id, ctxs[0]); else s = g.bvNpcTurn(s, ctxs[0]);
        if (guard > 40) break;
      }
    }
    assert.ok(pivoted > 0, "aucun tournant atteint");
    const page = await readFile(resolve(root, "src/page.tsx"), "utf8");
    assert.ok(/kind === "bv-never" \? bvNeverMusic\(/u.test(page), "la soirée doit choisir sa piste via bvNeverMusic");
    assert.ok(/fadingTrack[\s\S]{0,200}<audio[^>]*loop/u.test(page) && /key=\{soundtrack\}[\s\S]{0,400}?autoPlay loop/u.test(page), "fondu enchaîné ou boucle absents");
  });
  const tr = await load("/src/bellirith-valurn-never-transitions.ts");
  const playMode = (seed, ctx, mode, answer) => {
    let s = g.createBVNever(seed, mode); let guard = 0;
    while (!s.completed && guard++ < 400) {
      if (s.awaiting) s = g.bvAnswer(s, answer(s));
      else if (g.bvActorAt(s) === "player") { const o = g.bvPlayerOptions(s, ctx); s = g.bvPlayerTurn(s, o[(seed + s.round) % o.length].id, ctx); }
      else s = g.bvNpcTurn(s, ctx);
    }
    return s;
  };
  const ans = (seed) => (s) => ["acknowledge", "deny", "dodge"][(seed + s.round) % 3];
  const modeRuns = { complete: [], abregee: [] };
  for (let seed = 1; seed <= 120; seed++) for (const [i, ctx] of ctxs.entries()) for (const mode of ["complete", "abregee"]) modeRuns[mode].push(playMode(seed * 7 + i, ctx, mode, ans(seed)));
  await check("BV92", "Ordre de chaque échange : affirmation, votre réplique, verres, réactions à vous, piques entre eux ; au plus trois réactions, sans doublon", () => {
    let exchanges = 0;
    for (const s of [...modeRuns.complete, ...modeRuns.abregee]) s.log.forEach((record, index) => {
      const view = g.bvRecordView(s, index); if (!view) return; exchanges++;
      const steps = view.lines.map((l) => g.BV_STEPS.indexOf(l.step));
      assert.ok(steps.every((v, i) => v >= 0 && (i === 0 || v >= steps[i - 1] || record.beat)) && (!record.beat || view.lines[0].step === "verres" || view.lines[1]?.step === "verres"), `ordre cassé ${record.claimId} : ${view.lines.map((l) => l.step)}`);
      assert.equal(view.lines.filter((l) => l.step === "verres").length, 1, `verdict des verres absent ou doublé ${record.claimId}`);
      const mine = record.speaker === "player" || record.answer;
      if (mine && !record.beat) assert.ok(view.lines[0].step === "reponse" && view.lines[0].speaker === "{player}", `votre réplique doit suivre votre choix ${record.claimId}`);
      if (!record.beat) assert.ok(view.lines.filter((l) => l.step === "a-vous" || l.step === "entre-eux").length <= g.BV_MAX_REACTIONS, `trop de réactions ${record.claimId}`);
      const texts = view.lines.map((l) => l.text); if (!record.beat) assert.equal(new Set(texts).size, texts.length, `réplique doublée ${record.claimId}`);
      for (const l of view.lines) {
        if (l.step === "a-vous") assert.equal(l.to, "vous");
        if (l.step === "entre-eux") assert.ok(l.to === "Bellirith" || l.to === "Valurn", `destinataire flou ${record.claimId}`);
      }
      assert.ok(view.declaration.to, `cible de l’affirmation absente ${record.claimId}`);
    });
    assert.ok(exchanges > 10000, `${exchanges} échanges`);
    const m = renderToStaticMarkup(createElement(ui.BVNeverModal, { state: modeRuns.complete[0], ctx: ctxs[0], background: "/x.webp", format: fmt, onChange() {}, onClose() {}, onFinish() {} }));
    assert.ok(!/Les verres se lèvent, ou non/u.test(m));
  });
  const TOPICS = (await load("/src/bellirith-valurn-never-topics.ts")).BV_TOPIC_ANSWERS;
  await check("BV96", "Soirée complète : ivresse trois fois plus lente pour eux (9/18), seuils propres à vous, paliers atteints tard ; version abrégée inchangée", () => {
    assert.deepEqual(g.bvIvresseSeuils("complete"), { gris: 9, ivre: 18, max: 24 });
    assert.deepEqual(g.bvIvresseSeuils(undefined), { gris: 9, ivre: 18, max: 24 }, "ancienne partie sans format = seuils de la soirée complète");
    assert.deepEqual(g.bvIvresseSeuils("abregee"), { gris: 2, ivre: 4, max: 5 });
    assert.deepEqual(g.bvIvresseSeuils("abregee", "player"), { gris: 2, ivre: 4, max: 5 }, "version abrégée : mêmes seuils pour vous");
    assert.deepEqual(g.bvIvresseSeuils("complete", "player"), g.BV_IVRESSE_JOUEUR); assert.deepEqual(g.bvIvresseSeuils(undefined, "player"), g.BV_IVRESSE_JOUEUR);
    // Vous : qui avoue souvent devient gris en milieu de soirée et ivre tard ; qui nie ou esquive reste sobre ou gris.
    const strat = { franc: () => "acknowledge", prudent: (seed) => (st) => (seed + st.round) % 2 ? "deny" : "dodge" };
    const byStrat = {};
    for (const [name, pick] of Object.entries(strat)) {
      const runsS = []; for (let seed = 1; seed <= 60; seed++) for (const [i, ctx] of ctxs.entries()) runsS.push(playMode(seed * 11 + i, ctx, "complete", name === "franc" ? pick : pick(seed)));
      const end = { sobre: 0, gris: 0, ivre: 0 }; const firstG = [], firstI = [];
      for (const st of runsS) {
        end[g.bvIvresse(st.drinks.player, "complete", "player")]++;
        let gR, iR; st.log.forEach((r, k) => { const t = g.bvIvresse(g.bvDrinksAt(st, k).player, "complete", "player"); if (t !== "sobre" && gR === undefined) gR = r.round / st.round; if (t === "ivre" && iR === undefined) iR = r.round / st.round; });
        if (gR !== undefined) firstG.push(gR); if (iR !== undefined) firstI.push(iR);
      }
      const med = (a) => a.length ? a.sort((x, y) => x - y)[a.length >> 1] : undefined;
      byStrat[name] = { n: runsS.length, end, gris: med(firstG), ivre: med(firstI), runs: runsS };
      if (process.env.BV_STATS) console.log(`[stats] vous (${name}) : fin ${JSON.stringify(end)} sur ${runsS.length} ; gris atteint à ${Math.round((med(firstG) ?? 0) * 100)} % de la soirée, ivre à ${Math.round((med(firstI) ?? 0) * 100)} % (médianes)`);
    }
    const all = modeRuns.complete; const endAll = { sobre: 0, gris: 0, ivre: 0 }; all.forEach((x) => endAll[g.bvIvresse(x.drinks.player, "complete", "player")]++);
    if (process.env.BV_STATS) console.log(`[stats] vous (mixte) : fin ${JSON.stringify(endAll)} sur ${all.length}`);
    const F = byStrat.franc, P = byStrat.prudent;
    assert.ok(F.end.ivre / F.n >= 0.5, `qui avoue souvent doit finir ivre : ${JSON.stringify(F.end)}`);
    assert.ok(F.gris >= 0.25 && F.gris <= 0.65, `gris du franc-parleur hors du milieu de soirée : ${F.gris}`);
    assert.ok(F.ivre >= 0.55, `ivre du franc-parleur trop tôt : ${F.ivre}`);
    assert.equal(P.end.ivre, 0, `le prudent ne doit pas finir ivre : ${JSON.stringify(P.end)}`);
    assert.ok(endAll.ivre > 0 && endAll.sobre + endAll.gris > 0, "en jeu mixte, toutes les issues doivent exister");
    // Vos répliques ivres propres à la question sont bien entendues.
    let drunkHeard = 0;
    for (const st of F.runs) st.log.forEach((r, k) => { if (!r.answer) return; const v = g.bvRecordView(st, k); const tq = TOPICS[r.claimId]?.[r.answer]; if (v && tq && v.lines.some((l) => l.text === tq.drunk.text)) drunkHeard++; });
    assert.ok(drunkHeard > 20, `répliques ivres du joueur entendues : ${drunkHeard}`);
    if (process.env.BV_STATS) console.log(`[stats] répliques ivres du joueur entendues (franc-parleur) : ${drunkHeard}`);
    const first = { gris: [], ivre: [] }; let runs = 0, gotGris = 0, gotIvre = 0;
    for (const s of modeRuns.complete) {
      runs++; const reached = { gris: false, ivre: false };
      for (const actor of ["bellirith", "valurn", "player"]) {
        const seen = {};
        s.log.forEach((_, i) => { const t = g.bvIvresse(g.bvDrinksAt(s, i)[actor], "complete", actor); if (t !== "sobre" && seen.gris === undefined) seen.gris = s.log[i].round; if (t === "ivre" && seen.ivre === undefined) seen.ivre = s.log[i].round; });
        for (const k of ["gris", "ivre"]) if (seen[k] !== undefined) { first[k].push([seen[k], s.round]); reached[k] = true; }
      }
      if (reached.gris) gotGris++; if (reached.ivre) gotIvre++;
    }
    const pct = (a) => a.map(([r]) => r).sort((x, y) => x - y);
    const q = (a, p) => a.length ? a[Math.min(a.length - 1, Math.floor(p * a.length))] : "-";
    const rel = (a) => a.map(([r, n]) => r / n);
    if (process.env.BV_STATS) {
      for (const k of ["gris", "ivre"]) { const r = pct(first[k]); const hist = {}; r.forEach((x) => hist[x] = (hist[x] || 0) + 1);
        console.log(`[stats] ${k}: ${first[k].length} atteintes (convive × soirée) ; tour p10/p50/p90 = ${q(r, .1)}/${q(r, .5)}/${q(r, .9)} ; part de la soirée médiane = ${q(rel(first[k]).sort((x, y) => x - y), .5)} ; histogramme ${JSON.stringify(hist)}`); }
      for (const actor of ["bellirith", "valurn", "player"]) { const t = { sobre: 0, gris: 0, ivre: 0 }; modeRuns.complete.forEach((x) => t[g.bvIvresse(x.drinks[actor], "complete", actor)]++); const d = modeRuns.complete.map((x) => x.drinks[actor]).sort((a, b) => a - b); console.log(`[stats] fin de soirée ${actor} : ${JSON.stringify(t)} verres p50/max ${d[d.length >> 1]}/${d[d.length - 1]}`); }
      console.log(`[stats] soirées : ${runs}, avec au moins un gris : ${gotGris}, avec au moins un ivre : ${gotIvre}`);
    }
    assert.ok(gotGris / runs > 0.8, `gris trop rare : ${gotGris}/${runs}`);
    assert.ok(gotIvre > 0, "ivre jamais atteint en soirée complète");
    const g50 = q(rel(first.gris).sort((x, y) => x - y), .5), i50 = q(rel(first.ivre).sort((x, y) => x - y), .5);
    assert.ok(g50 >= 0.25, `gris trop tôt (médiane ${g50})`); assert.ok(i50 >= 0.5, `ivre trop tôt (médiane ${i50})`);
  });
  await check("BV97", "Carte d’annonce de chaque nouvelle affirmation : en grand, couleur et nom de qui parle, tour, passable, mouvement réduit respecté, rejouée à la reprise seulement si l’affirmation attend encore", async () => {
    const { readFileSync } = await import("node:fs");
    assert.ok(ui.BV_CARD_HOLD_MS >= 1200 && ui.BV_CARD_HOLD_MS <= 1500, `tenue ${ui.BV_CARD_HOLD_MS}`);
    const render = (st) => renderToStaticMarkup(createElement(ui.BVNeverModal, { state: st, ctx: ctxs[0], background: "/x.webp", format: fmt, onChange() {}, onClose() {}, onFinish() {} }));
    let pending; for (const st of modeRuns.complete) { let x = g.createBVNever(st.seed, "complete"); let guard = 0; while (!x.awaiting && !x.completed && guard++ < 200) x = g.bvActorAt(x) === "player" ? g.bvPlayerTurn(x, g.bvPlayerOptions(x, ctxs[0])[0].id, ctxs[0]) : g.bvNpcTurn(x, ctxs[0]); if (x.awaiting) { pending = x; break; } }
    assert.ok(pending, "aucune affirmation en attente simulée");
    const m = render(pending); const sp = pending.log.at(-1).speaker;
    assert.ok(m.includes(`bv-carte bv-carte-${sp}`) && m.includes("bv-carte-texte") && /Tour [IVXL]+/u.test(m) && m.includes("Toucher pour passer"), "carte absente pour l’affirmation en attente");
    const { awaiting, ...resumed } = pending; assert.ok(!render({ ...resumed }).includes("bv-carte"), "carte rejouée pour une affirmation déjà lue");
    const css = readFileSync(new URL("../src/bellirith-valurn.css", import.meta.url), "utf8");
    assert.ok(/prefers-reduced-motion: reduce\)\s*\{\s*\.bv-carte/u.test(css) && css.includes("bv-carte-sortie"), "mouvement réduit : fondu seul attendu");
    for (const who of ["bellirith", "valurn"]) assert.ok(css.includes(`.bv-carte-${who} { --c:`), `couleur ${who}`);
  });
  await check("BV93", "Version abrégée : 8 à 10 tours, tournant des deux côtés, révélations, gris et ivre atteints, pression au cran 4, bascule musicale", () => {
    for (const s of modeRuns.abregee) {
      assert.ok(s.completed && s.round >= 8 && s.round <= 10, `durée ${s.round}`);
      for (const beat of [...g.BV_REQUIRED_BEATS, "r1b"]) assert.ok(s.beats.includes(beat), `moment clé ${beat} absent (graine ${s.seed})`);
      assert.ok(Object.values(s.drinks).some((d) => g.bvIvresse(d, "abregee") === "ivre") && Object.values(s.drinks).some((d) => g.bvIvresse(d, "abregee") !== "sobre"), "ivresse insuffisante");
      assert.ok(s.log.some((r, i) => r.answer && g.bvPressionLevel(s, i) === 4), `cran 4 jamais atteint (graine ${s.seed})`);
      assert.equal(g.bvNeverMusic(s), "bv-never-tournant");
      const before = { ...s, pivotRound: undefined }; assert.equal(g.bvNeverMusic(before), "bv-never-jeu");
    }
    for (const s of modeRuns.complete) assert.ok(s.completed && s.round >= 10 && s.round <= 20, `complète ${s.round}`);
    const playerTiers = new Set(modeRuns.abregee.map((s) => g.bvIvresse(s.drinks.player, "abregee")));
    assert.ok(playerTiers.has("gris") && playerTiers.has("ivre"), "le joueur doit pouvoir atteindre gris et ivre en version abrégée");
    // Format choisi à l’ouverture, conservé et relu ; ancienne partie sans format = soirée complète.
    const fresh = renderToStaticMarkup(createElement(ui.BVNeverModal, { state: g.createBVNever(5), ctx: ctxs[0], background: "/x.webp", format: fmt, onChange() {}, onClose() {}, onFinish() {} }));
    assert.ok(fresh.includes("Soirée complète") && fresh.includes("Version abrégée"), "choix du format absent");
    const old = { ...modeRuns.complete[0], completed: false }; delete old.mode;
    const reloaded = cq.hydrateBV(JSON.parse(JSON.stringify(cq.bvSaveNever({ ...cq.createBVProgress(1), stage: 3 }, { ...old, log: old.log.slice(0, 9), round: 4 })))).bv.never;
    assert.ok(!reloaded.mode && g.bvBounds(reloaded).max === 20, "ancienne sauvegarde mal relue");
    const oldView = renderToStaticMarkup(createElement(ui.BVNeverModal, { state: reloaded, ctx: ctxs[0], background: "/x.webp", format: fmt, onChange() {}, onClose() {}, onFinish() {} }));
    assert.ok(!oldView.includes("Version abrégée"), "une partie entamée ne doit pas redemander le format");
    const short = cq.hydrateBV(JSON.parse(JSON.stringify(cq.bvSaveNever({ ...cq.createBVProgress(1), stage: 3 }, modeRuns.abregee[0])))).bv.never;
    assert.equal(short.mode, "abregee");
    const dossier = renderToStaticMarkup(createElement(ui.BVDossier, { progress: cq.bvSaveNever({ ...cq.createBVProgress(1), stage: 3 }, { ...modeRuns.abregee[1], completed: false }), day: 2, onScene() {}, onNever() {}, onIntimacy() {} }));
    assert.ok(dossier.includes("Version abrégée"), "le Journal doit afficher le format");
  });
  await check("BV94", "Transitions entre les tours : une à chaque tour, jamais répétée, toutes les ambiances et amorces entendues, règles d’écriture", () => {
    const all = [...Object.values(tr.BV_TRANSITION_LEADS).flat(), ...Object.values(tr.BV_TRANSITION_MOODS).flat()];
    assert.equal(new Set(all).size, all.length, "phrase de transition en double dans la banque");
    for (const t of all) { assert.ok(!STYLE_DASH.test(t) && !STYLE_CONTRAST.test(t) && !BANNED.test(t), `règle d’écriture : ${t}`); assert.ok((t.match(/[.!?…](?:\s|$)/gu) || []).length <= 2, `trop long : ${t}`); }
    const moods = new Set(), leads = new Set();
    for (const s of [...modeRuns.complete, ...modeRuns.abregee]) {
      const heard = new Set();
      for (let r = 2; r <= s.round; r++) {
        const info = g.bvTransitionInfo(s, r);
        assert.ok(info && info.line.text.length > 20, `transition absente au tour ${r}`);
        const sentences = info.line.text.split(/(?<=[.!?…])\s+/u);
        assert.ok(sentences.length >= 1 && sentences.length <= 3, `transition de ${sentences.length} phrases`);
        for (const p of sentences) { assert.ok(!heard.has(p), `phrase de transition répétée dans la soirée : ${p}`); heard.add(p); }
        moods.add(info.mood); if (info.lead) leads.add(info.lead);
        if (s.mode === "abregee") assert.ok(info.mood.startsWith("court-"), "la version abrégée a ses propres ambiances");
        else assert.ok(info.mood === `${info.after ? "apres" : "avant"}-${info.tier}`, "ambiance sans rapport avec l’ivresse ou le tournant");
      }
    }
    for (const key of Object.keys(tr.BV_TRANSITION_MOODS)) assert.ok(moods.has(key), `ambiance jamais jouée : ${key}`);
    for (const key of Object.keys(tr.BV_TRANSITION_LEADS)) assert.ok(leads.has(key), `amorce jamais jouée : ${key}`);
  });
  await check("BV95", "Écriture : pas d’ouverture ni de tournure répétée d’une banque à l’autre, réponses propres à chaque question posée", async () => {
    const tp = await load("/src/bellirith-valurn-never-topics.ts");
    const texts = []; const walk = (v) => { if (v && typeof v === "object" && "text" in v) texts.push(v.text); else if (typeof v === "string") texts.push(v); else if (v && typeof v === "object") Object.values(v).forEach(walk); };
    walk(rx); walk(tr); walk(tp);
    const STOP = new Set("je tu il elle on nous vous ils elles le la les l' un une des de du d' à au aux et ou ne n' pas que qu' qui ce c' ça se s' me m' te t' en y est a ai as plus moins si mais pour par sur dans avec sans mon ma mes ton ta tes son sa ses votre vos notre nos leur leurs".split(" "));
    const norm = (t) => t.toLowerCase().replace(/[’']/gu, "' ").replace(/[^\p{L}' ]+/gu, " ").split(/\s+/u).filter(Boolean);
    const openings = new Map(), grams = new Map();
    for (const t of texts) {
      const w = norm(t); const o = w.slice(0, 2).join(" "); openings.set(o, (openings.get(o) || 0) + 1);
      const seen = new Set();
      for (let i = 0; i + 3 <= w.length; i++) { const g = w.slice(i, i + 3); if (g.every((x) => STOP.has(x))) continue; const k = g.join(" "); if (!seen.has(k)) { seen.add(k); grams.set(k, (grams.get(k) || 0) + 1); } }
    }
    const over = (m, max) => [...m].filter(([, n]) => n > max).map(([k, n]) => `« ${k} » × ${n}`);
    assert.deepEqual(over(openings, 5), [], "ouvertures trop répétées");
    // Répliques écrites des affirmations : mêmes ouvertures plafonnées (les moments clés restent hors calcul).
    const authored = []; const take = (v) => { if (v && typeof v === "object" && "text" in v) authored.push(v.text); else if (Array.isArray(v)) v.forEach(take); };
    for (const x of [...c.BV_NPC_CLAIMS, ...c.BV_NPC_EVENING, ...c.BV_NPC_FALLOUT, ...c.BV_PLAYER_CLAIMS, ...c.BV_PLAYER_FALLOUT]) take([x.lines, x.ifPlayerDrinks || [], x.ifPlayerDry || []]);
    const aOpen = new Map(); for (const t of authored) { const o = norm(t).slice(0, 2).join(" "); aOpen.set(o, (aOpen.get(o) || 0) + 1); }
    assert.deepEqual(over(aOpen, 5), [], "ouvertures trop répétées dans les répliques écrites");
    assert.deepEqual(over(grams, 5), [], "tournures trop répétées");
    for (const t of texts) assert.ok(!STYLE_DASH.test(t) && !STYLE_CONTRAST.test(t) && !BANNED.test(t), `règle d’écriture : ${t}`);
    const asked = [...c.BV_NPC_CLAIMS, ...c.BV_NPC_EVENING, ...c.BV_NPC_FALLOUT].filter((x) => x.truth.player === "ask");
    for (const claim of asked) for (const a of ["acknowledge", "deny", "dodge"]) {
      const entry = tp.BV_TOPIC_ANSWERS[claim.id]?.[a];
      assert.ok(entry && entry.say.speaker === "{player}" && entry.drunk.speaker === "{player}", `réponses propres manquantes : ${claim.id} ${a}`);
      assert.equal(entry.reply.speaker, claim.speaker === "bellirith" ? "Bellirith" : "Valurn", `la réplique doit venir de qui a posé la question : ${claim.id}`);
      if (claim.speaker === "bellirith") assert.ok(a === "acknowledge" ? entry.reply.mood !== "seductive" : true, `Bellirith ne s’allume pas quand vous cédez : ${claim.id}`);
    }
    // Les réponses propres sont bien jouées en partie.
    let topical = 0;
    for (const s of modeRuns.complete.slice(0, 80)) s.log.forEach((r, i) => { if (r.answer && tp.BV_TOPIC_ANSWERS[r.claimId]) { const v = g.bvRecordView(s, i); const t = tp.BV_TOPIC_ANSWERS[r.claimId][r.answer]; assert.ok(v.lines.some((l) => l.text === t.reply.text), `réplique de sujet absente ${r.claimId}`); topical++; } });
    assert.ok(topical > 50, `${topical} réponses de sujet jouées`);
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
