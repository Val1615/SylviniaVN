// Quête croisée Allenna × Naïah « Les fils sous la cendre » : contrôles du pack de consignes
// (structure, enquête, Tellia, rendez-vous, extensions), règles permanentes (Naïah, Amanea,
// écriture), intégration page.tsx et compatibilité des sauvegardes v18 (jour 400).
import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const server = await createServer({
  root, appType: "custom", logLevel: "silent", server: { middlewareMode: true },
  plugins: [{ name: "an-test", enforce: "pre", transform(code, id) {
    if (id.endsWith("/src/page.tsx")) return `${code}\nexport { hydrateGame, createGame, DEFAULT_PLAYER, evolveCrossQuests };`;
  } }],
});
const results = [];
async function check(id, label, fn) {
  try { await fn(); results.push([id, label, true]); }
  catch (error) { results.push([id, label, false, error.message]); }
}
const DASH = /[—–]/u;
const CONTRAST = /n[’']est pas[^!?«»"]{0,80}[,;.:]\s*c[’']est\b|n[’']était pas[^!?«»"]{0,80}[,;.:]\s*c[’']était\b/iu;
const BANNED = /\b(?:chatte|bite|pénis|penis|vagin|vulve|anus|testicules?|clitoris|verge|phallus|couilles?|gland|érection|dressée?s?)\b/iu;
const INTERSEX = /intersex|hermaphrod/iu;
const NAMED_ORIENTATION = /\b(?:asexu|aromanti)/iu;
const PENETRATION = /pénétr|en elle\b/iu;
const TELLIA_FORBIDDEN = /démoniste|obscurcie|bras droit|saboteu|traîtr/iu;
const strings = (value, out = []) => {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((entry) => strings(entry, out));
  else if (value && typeof value === "object") Object.values(value).forEach((entry) => strings(entry, out));
  return out;
};
const linesOf = (value, out = []) => {
  if (Array.isArray(value)) value.forEach((entry) => linesOf(entry, out));
  else if (value && typeof value === "object") {
    if (typeof value.speaker === "string" && typeof value.text === "string") out.push(value);
    else Object.values(value).forEach((entry) => linesOf(entry, out));
  }
  return out;
};
const choicesOf = (value, out = []) => {
  if (Array.isArray(value)) value.forEach((entry) => choicesOf(entry, out));
  else if (value && typeof value === "object") {
    if (typeof value.id === "string" && value.effects && typeof value.stat === "string") out.push(value);
    Object.values(value).forEach((entry) => choicesOf(entry, out));
  }
  return out;
};
const stats = {};

try {
  const load = (path) => server.ssrLoadModule(path);
  const cq = await load("/src/allenna-naiah-cross-quest.ts");
  const sb = await load("/src/allenna-naiah-scenes-b.ts");
  const mg = await load("/src/allenna-naiah-minigame.ts");
  const dt = await load("/src/allenna-naiah-dates.ts");
  const ui = await load("/src/allenna-naiah-ui.tsx");
  const gd = await load("/src/group-dates.ts").catch(() => null);
  const page = await load("/src/page.tsx");
  const { renderToStaticMarkup } = await import("react-dom/server"), { createElement } = await import("react");
  const pageSource = await readFile(resolve(root, "src/page.tsx"), "utf8");

  const rel = (stage, extra = {}) => ({ stage, affection: 30, trust: 30, desire: 25, met: true, ...extra });
  const game = (flags = ["main-story-act-1-complete", "story-decoy-destroyed"], relationships = { allenna: rel(2), naiah: rel(2) }) => ({ flags, relationships });
  const ctx = cq.anSceneContext(game(), undefined);
  const quest = sb.AN_QUEST_IDS.map((id) => sb.anScene(id, ctx));
  const moments = sb.AN_MOMENT_IDS.map((id) => sb.anScene(id, ctx));
  const homeCtx = { name: "Maison du Pont", location: "algratal", spot: "algratal-home", background: "/assets/housing/algratal_2.webp", keepsakes: ["keepsake-naiah", "keepsake-allenna"] };
  const dateCtxs = [true, false].flatMap((eligible) => [undefined, homeCtx, { ...homeCtx, location: "akuhn", keepsakes: [] }].map((home) => ({ done: [], branches: {}, eligible, home, orientation: "complicite" })));
  const dates = dateCtxs.flatMap((c) => dt.AN_DATE_IDS.map((id) => dt.anDateScene(id, c)));
  const exts = cq.AN_EXTENSIONS;
  const everything = [...quest, ...moments, ...dates, ...exts, mg.AN_CLUES, mg.AN_CLAIMS, cq.AN_NOTES, cq.AN_HOME_ECHO, sb.AN_BORDEREAU];

  // Rejoue une scène : toujours le premier choix, en suivant les followUp.
  const firstPicks = (scene) => {
    const picks = [scene.choices[0].id];
    const beats = scene.choices[0].followUp || scene.beats || [];
    for (const beat of beats) picks.push(beat.choices[0].id);
    return picks;
  };
  const amaneaAkuhn = { location: "akuhn" };

  await check("AN1", "Structure : Q1 à Q7 (IDs cross-an-01..07), 2 moments libres, trois choix par scène principale, lieux canoniques", () => {
    assert.deepEqual([...sb.AN_QUEST_IDS], ["cross-an-01", "cross-an-02", "cross-an-03", "cross-an-04", "cross-an-05", "cross-an-06", "cross-an-07"]);
    quest.forEach((s) => { assert.ok(s, "scène construite"); assert.equal(s.choices.length, 3, `${s.id} : trois orientations`); assert.ok(s.intro.length >= 6, `${s.id} : introduction développée`); });
    assert.deepEqual(quest.map((s) => s.spot), ["forbidden-ruins", "forbidden-threshold", "akuhn-gates", "akuhn-archives", "akuhn-archives", "akuhn-archives", "forbidden-sanctuary"]);
    moments.forEach((s) => assert.ok(s.choices.length >= 2));
    stats.scenes = quest.length + moments.length;
  });

  await check("AN2", "Choix : chaque choix porte +1 de sa propre statistique (aperçu fidèle), aucun Désir accordé à Naïah", () => {
    const all = choicesOf(everything);
    assert.ok(all.length > 60);
    for (const c of all) {
      assert.equal(c.effects.stats?.[c.stat], 1, `${c.id} : +1 ${c.stat}`);
      assert.equal(c.effects.relationshipEffects?.naiah?.desire, undefined, `${c.id} : pas de désir pour Naïah`);
      assert.equal(c.effects.desire, undefined, `${c.id} : pas de désir implicite`);
    }
    const fx = cq.anExtEffects(true); assert.equal(fx.naiah.desire, undefined); assert.ok(fx.allenna.desire > 0);
    assert.equal(cq.anExtEffects(false).allenna.desire, undefined);
    stats.choix = all.length;
  });

  await check("AN3", "Déblocage : fin de l’Acte I, leurre détruit, Allenna et Naïah rencontrées à l’étape 2 ; jamais avant", () => {
    assert.ok(cq.anUnlocked(game()));
    assert.ok(!cq.anUnlocked(game([])), "pas avant l’Acte I");
    assert.ok(!cq.anUnlocked(game(undefined, { allenna: rel(1), naiah: rel(2) })));
    assert.ok(!cq.anUnlocked(game(undefined, { allenna: rel(2, { met: false }), naiah: rel(2) })));
    const base = page.createGame({ ...page.DEFAULT_PLAYER, name: "Testeur" });
    const before = page.evolveCrossQuests(base); assert.equal(before.crossQuestSeries[cq.AN_KEY], undefined);
    const ready = page.evolveCrossQuests({ ...base, flags: ["main-story-act-1-complete", "story-decoy-destroyed"], relationships: { ...base.relationships, allenna: { ...base.relationships.allenna, ...rel(2) }, naiah: { ...base.relationships.naiah, ...rel(2) } } });
    assert.ok(ready.crossQuestSeries[cq.AN_KEY]?.an, "série créée");
  });

  await check("AN4", "Parcours complet : attentes du lendemain, nuit d’Akuhn’Nabad enchaînée, flags de la consigne posés, série accomplie", () => {
    let p = cq.createANProgress(10); let day = 10;
    const play = (id) => { const s = cq.anBuildScene(id, game(), p); p = cq.finishANScene(p, id, firstPicks(s), day); };
    assert.deepEqual(cq.anAvailable(p, day, amaneaAkuhn).scenes, ["cross-an-01"]);
    play("cross-an-01");
    assert.ok(cq.anAvailable(p, day, amaneaAkuhn).wait, "Q2 attend le lendemain"); day++;
    play("cross-an-02"); assert.ok(cq.anAvailable(p, day, amaneaAkuhn).wait); day++;
    play("cross-an-03"); assert.deepEqual(cq.anAvailable(p, day, amaneaAkuhn).scenes, ["cross-an-04"], "Q4 la même nuit");
    play("cross-an-04"); const av = cq.anAvailable(p, day, amaneaAkuhn); assert.ok(av.mini && !av.scenes.length, "l’enquête s’ouvre");
    assert.ok(!cq.anFlags(p).includes("knows_tellia_name"), "aucun nom avant Q5");
    let m = p.an.mini;
    for (const [clues, claim] of [[["A1", "A2"], "H1"], [["B1", "B2"], "H4"], [["A4", "A5"], "H2"], [["B1", "B3"], "H3"], [["C1", "C2", "C3"], "H5"], [["C1", "C4"], "H7"], [["A3", "B4", "C5"], "H6"]]) {
      const out = mg.submitHypothesis(m, clues, claim); assert.equal(out.result.kind, "confirmed", claim); m = out.state; p = cq.anSaveMini(p, m, day);
    }
    assert.ok(p.an.mini.complete);
    const flagsMini = cq.anFlags(p);
    for (const f of ["cross-an-started", "cross-an-mini-complete", "cross-an-internal-modification-found", "an-transmission-sans-finalite"]) assert.ok(flagsMini.includes(f), f);
    play("cross-an-05"); assert.ok(cq.anFlags(p).includes("knows_tellia_name") && cq.anFlags(p).includes("has_tellia_portal_document"));
    play("cross-an-06"); assert.ok(cq.anAvailable(p, day, amaneaAkuhn).wait, "Q7 le lendemain"); day++;
    play("cross-an-07");
    assert.equal(p.stage, cq.AN_STAGE_TOTAL); assert.ok(p.an.completed); assert.ok(cq.anFlags(p).includes("cross-an-series-complete"));
    assert.deepEqual(cq.anAvailable(p, day, amaneaAkuhn).dates, [...dt.AN_DATE_IDS], "trois rendez-vous dans n’importe quel ordre");
    // Idempotence : rejouer une scène finie ne change rien.
    const again = cq.finishANScene(p, "cross-an-02", ["x"], day + 5); assert.deepEqual(again.an.choices, p.an.choices);
  });

  await check("AN5", "Sauvegardes : progrès sans `an`, champs corrompus et étape mensongère hydratés proprement ; hydratation idempotente", () => {
    const bare = cq.hydrateAN({ id: cq.AN_KEY, stage: 5, startedDay: 3, stageStartedDay: 3, letters: [] });
    assert.equal(bare.stage, 0, "l’étape ne dépasse pas ce que les choix prouvent"); assert.deepEqual(bare.an.choices, {});
    const dirty = cq.hydrateAN({ id: cq.AN_KEY, stage: 2, startedDay: 1, stageStartedDay: 1, letters: [], an: { choices: { "cross-an-01": ["a"], inconnu: ["b"], "cross-an-02": "zzz" }, days: { "cross-an-01": "x" }, checkpoint: { sceneId: "nope", round: 0, picks: [] }, mini: { revealed: ["ZZ"], confirmed: ["H9"] }, dates: { "group-date-allenna-naiah-lake": { branch: "x", day: 1 } }, extCheckpoint: { id: "an-ext:nope", seq: 3, picks: {} } } });
    assert.deepEqual(Object.keys(dirty.an.choices), ["cross-an-01"]); assert.equal(dirty.stage, 1); assert.equal(dirty.an.checkpoint, undefined);
    assert.deepEqual(dirty.an.dates, {}); assert.equal(dirty.an.extCheckpoint, undefined); assert.ok(!dirty.an.mini || (!dirty.an.mini.revealed.includes("ZZ") && !dirty.an.mini.confirmed.includes("H9") && !dirty.an.mini.complete), "enquête corrompue nettoyée");
    const twice = cq.hydrateAN(JSON.parse(JSON.stringify(dirty))); assert.deepEqual(twice, dirty);
  });

  await check("AN6", "Sauvegarde v18 au jour 400 : relue sans quête AN, puis avec une quête AN en cours, sans perte", async () => {
    assert.match(pageSource, /version: 18;/u);
    const base = page.createGame({ ...page.DEFAULT_PLAYER, name: "Testeur" });
    const old = JSON.parse(JSON.stringify({ ...base, day: 400, period: 2 }));
    const loaded = page.hydrateGame(old); assert.ok(loaded && loaded.day === 400 && loaded.version === 18);
    assert.equal(loaded.crossQuestSeries[cq.AN_KEY], undefined, "aucune série inventée");
    let p = cq.createANProgress(398); p = cq.finishANScene(p, "cross-an-01", ["cross-an-01-faits", "cross-an-01-ecrire"], 398);
    const withAN = page.hydrateGame({ ...old, crossQuestSeries: { ...old.crossQuestSeries, [cq.AN_KEY]: p } });
    assert.deepEqual(withAN.crossQuestSeries[cq.AN_KEY].an.choices, p.an.choices); assert.equal(withAN.crossQuestSeries[cq.AN_KEY].stage, 1);
    const v17 = JSON.parse(await readFile("/tmp/bvsim/save-fresh.json", "utf8").catch(() => "null"));
    if (v17) { const l = page.hydrateGame({ ...v17, day: 400 }); assert.ok(l && l.day === 400); }
  });

  await check("AN7", "Amanea : jamais présente dans une scène AN ; forêt fermée quand elle y séjourne, halte fermée quand elle voyage ; jamais responsable des portails", () => {
    for (const s of [...quest, ...moments, ...dates]) {
      assert.ok(!(s.cast || []).includes("amanea"), `${s.id} cast`);
      for (const b of [s, ...(s.beats || []), ...s.choices.flatMap((c) => c.followUp || [])]) assert.ok(!(b.cast || []).includes("amanea"));
      for (const l of linesOf(s)) assert.notEqual(l.speaker, "Amanea", `${s.id} : Amanea ne parle jamais`);
    }
    let p = cq.createANProgress(1);
    assert.deepEqual(cq.anAvailable(p, 1, { location: "forbidden" }).scenes, [], "Q1 fermée"); assert.ok(cq.anAvailable(p, 1, { location: "forbidden" }).blocked);
    assert.ok(cq.anAmaneaBlocks("river-halt", { travelTo: "forbidden" })); assert.equal(cq.anAmaneaBlocks("river-halt", { location: "akuhn" }), undefined);
    assert.equal(cq.anAmaneaBlocks("akuhn", { location: "akuhn" }), undefined, "le dispositif d’Allenna couvre la Cité");
    const q7 = strings(quest[6]).join(" "); assert.match(q7, /Rien ne remonte à un ordre d’Amanea/u);
    const q1 = strings(quest[0]).join(" "); assert.match(q1, /ne dit ni qui l’a fabriquée, ni qui l’a voulue/u);
  });

  await check("AN8", "Tellia : absente avant Q5, jamais genrée ni associée aux termes interdits, document neutre établi / probable / non vérifié", () => {
    for (const s of [...quest.slice(0, 4), ...dates, ...exts]) assert.ok(!strings(s).some((t) => /Tellia/u.test(t)), `${s.id} : pas de Tellia`);
    assert.ok(!strings([mg.AN_CLUES, mg.AN_CLAIMS]).some((t) => /Tellia/u.test(t)), "l’enquête ne nomme personne");
    const all = strings(everything).filter((t) => /Tellia/u.test(t));
    assert.ok(all.length >= 3);
    for (const t of all) {
      assert.ok(!TELLIA_FORBIDDEN.test(t), `terme interdit : ${t}`);
      assert.ok(!/Tellia[^.!?]*\b(il|elle|lui|celui|celle|seul|seule)\b/iu.test(t), `pronom genré : ${t}`);
    }
    assert.equal(sb.AN_BORDEREAU.title, "Bordereau de dérivation");
    assert.ok(sb.AN_BORDEREAU.established.length && sb.AN_BORDEREAU.probable.length && sb.AN_BORDEREAU.unverified.length);
    assert.match(sb.AN_BORDEREAU.rune, /retourn|envers/u); assert.match(sb.AN_BORDEREAU.rune, /trait supplémentaire/u);
  });

  await check("MG1", "Enquête : 14 indices sur trois domaines, 6 visibles au départ, 7 hypothèses utiles (dont une nuance) et 3 fausses pistes", () => {
    assert.equal(mg.AN_CLUES.length, 14); assert.equal(mg.AN_START_CLUES.length, 6);
    assert.deepEqual([...new Set(mg.AN_CLUES.map((c) => c.domain))].sort(), ["chemin", "registre", "trace"]);
    const useful = mg.AN_CLAIMS.filter((c) => c.needs.length), wrong = mg.AN_CLAIMS.filter((c) => !c.needs.length);
    assert.equal(useful.length, 7); assert.equal(wrong.length, 3); assert.equal(useful.filter((c) => c.optional).length, 1);
    for (const c of useful.filter((x) => !x.optional)) assert.equal(c.hints?.length, 3, `${c.id} : trois niveaux d’indice`);
    const final = useful.find((c) => c.final); assert.deepEqual(new Set(final.needs.map((id) => mg.AN_CLUES.find((x) => x.id === id).domain)).size, 3, "la conclusion croise les trois domaines");
    stats.enquete = { indices: 14, hypotheses: useful.length, fausses: wrong.length };
  });

  await check("MG2", "Enquête : résultats confirmée / incomplète (domaine manquant ou pièce en trop) / contredite ; aucun échec, compteur seulement", async () => {
    let s = mg.newANMini();
    const inc = mg.submitHypothesis(s, ["A1"], "H1"); assert.equal(inc.result.kind, "incomplete"); assert.match(inc.result.text, /traces/u);
    const extra = mg.submitHypothesis(s, ["A1", "A2", "B1"], "H1"); assert.equal(extra.result.kind, "incomplete"); assert.match(extra.result.text, /Manifeste/u);
    const wrong = mg.submitHypothesis(s, [], "F2"); assert.equal(wrong.result.kind, "contradicted"); assert.match(wrong.result.text, /Voie de service/u);
    assert.equal(mg.submitHypothesis(s, ["A1"], "F1").result.kind, "contradicted");
    assert.equal(mg.submitHypothesis(s, ["B1"], "F3").result.kind, "contradicted");
    assert.equal(wrong.state.ops, 1); assert.deepEqual(wrong.state.revealed, s.revealed, "une erreur ne retire rien");
    const h = mg.takeHint(s); assert.ok(h.hint && h.state.ops === 1);
    const h2 = mg.takeHint(h.state), h3 = mg.takeHint(h2.state), h4 = mg.takeHint(h3.state);
    assert.notEqual(h.hint.text, h2.hint.text); assert.notEqual(h2.hint.text, h3.hint.text); assert.equal(h4.hint.text, h3.hint.text, "plafond au niveau 3");
    const src = await readFile(resolve(root, "src/allenna-naiah-minigame.ts"), "utf8");
    assert.ok(!/setTimeout|setInterval|Date\.now|performance\.now/u.test(src), "aucun minuteur");
  });

  await check("MG3", "Enquête : reprise exacte après rechargement JSON, rejeu local sans récompense, résolution jamais réécrite", () => {
    let s = mg.newANMini(); s = mg.submitHypothesis(s, ["A1", "A2"], "H1").state; s = mg.submitHypothesis(s, ["A1"], "F1").state;
    const back = mg.hydrateANMini(JSON.parse(JSON.stringify(s))); assert.deepEqual(back, s);
    const replay = mg.replayANMini({ ...s, complete: true }); assert.deepEqual(replay.confirmed, []); assert.equal(replay.replays, 1);
    let p = cq.createANProgress(1); p = cq.finishANScene(p, "cross-an-04", ["x"], 1);
    p = cq.anSaveMini(p, { ...s, complete: true, confirmed: [...s.confirmed, "H6"] }, 2);
    const same = cq.anSaveMini(p, mg.newANMini(), 3); assert.equal(same, p, "aucune réécriture après résolution");
  });

  await check("DT1", "Rendez-vous : lac, halte, logis ; trois branches chacun avec suite propre et contribution du joueur ; prolongation seulement si éligible", () => {
    for (const [i, s] of dates.entries()) {
      const c = dateCtxs[Math.floor(i / 3)];
      assert.equal(s.choices.length, 3, `${s.id} : trois branches`);
      for (const branch of s.choices) {
        assert.equal(branch.followUp?.length, 2, `${branch.id} : suite + fin`);
        const end = branch.followUp[1].choices;
        if (c.eligible) {
          const pro = end.find((x) => x.launchesIntimacy); assert.ok(pro, `${branch.id} : prolonger`);
          assert.ok(cq.anExtension(pro.launchesIntimacy), `extension ${pro.launchesIntimacy}`);
          assert.ok(end.some((x) => x.id.endsWith("-attendre")), "pas ce soir");
        } else assert.ok(end.every((x) => !x.launchesIntimacy), "aucune intimité sans éligibilité");
      }
    }
    assert.equal(dates.filter((d) => d.id === "group-date-allenna-naiah-relay")[0].spot, "river-halt");
    if (gd?.GROUP_DATES) assert.ok(!gd.GROUP_DATES.some((g) => dt.AN_DATE_IDS.includes(g.id)), "GROUP_DATES intact");
    // N’importe quel ordre : le logis seul est disponible sans les deux autres.
    let p = cq.hydrateAN({ ...cq.createANProgress(1), stage: 8, an: { choices: Object.fromEntries(sb.AN_QUEST_IDS.map((id) => [id, ["x"]])), days: {}, mini: { ...mg.newANMini(), complete: true, confirmed: ["H6"] }, dates: {} } });
    p = cq.finishANScene(p, "group-date-allenna-naiah-home", ["group-date-allenna-naiah-home-toit", "group-date-allenna-naiah-home-toit-silence", "group-date-allenna-naiah-home-toit-prolonger"], 5);
    assert.equal(p.an.dates["group-date-allenna-naiah-home"].branch, "toit"); assert.equal(p.an.dates["group-date-allenna-naiah-home"].ext, "pending");
    assert.deepEqual(cq.anPendingExtensions(p), ["an-ext:home:toit"]);
    assert.deepEqual(cq.anAvailable(p, 6, amaneaAkuhn).dates, ["group-date-allenna-naiah-lake", "group-date-allenna-naiah-relay"]);
    assert.ok(!cq.anAvailable(p, 6, amaneaAkuhn, false).dates.includes("group-date-allenna-naiah-home"));
    stats.rendezvous = { dates: 3, branches: 9 };
  });

  await check("EX1", "Extensions : 9 variantes de 12 séquences ; initiative (séq. 5) et bifurcation (séq. 10) à trois options qui modifient la suite ; romance ou amitié ; fondu en ellipse", () => {
    assert.equal(exts.length, 9);
    for (const e of exts) {
      assert.equal(e.seqs.length, 12, e.id);
      assert.deepEqual(e.seqs[4].options.map((o) => o.id), ["o1", "o2", "o3"]);
      assert.deepEqual(Object.keys(e.seqs[5].after).sort(), ["o1", "o2", "o3"]);
      assert.deepEqual(e.seqs[9].options.map((o) => o.id), ["geste", "confidence", "ralentir"]);
      for (const i of [10, 11]) assert.deepEqual(Object.keys(e.seqs[i].after).sort(), ["confidence", "geste", "ralentir"]);
      for (const i of [8, 10]) assert.ok(e.seqs[i].romance?.length && e.seqs[i].friendship?.length, `${e.id} séq. ${i + 1}`);
      const full = ui.anSeqLines(e.seqs[8], 8, {}, true, "suggestif"), veiled = ui.anSeqLines(e.seqs[8], 8, {}, true, "ellipse");
      assert.ok(full.length > 1 && veiled.length === 1, "fondu au noir");
      assert.notDeepEqual(ui.anSeqLines(e.seqs[10], 10, { s10: "geste" }, true, "tendre"), ui.anSeqLines(e.seqs[10], 10, { s10: "ralentir" }, true, "tendre"));
      assert.ok(strings(e.seqs[1]).join(" ").match(/veu[xt]|voulez|oui/iu), `${e.id} : accord explicite`);
    }
    stats.extensions = { variantes: exts.length, sequences: exts.length * 12 };
  });

  await check("EX2", "Naïah : jamais de désir, jamais nommé, jamais pénétrée ; elle s’éloigne d’elle-même pendant la séquence la plus proche en romance", () => {
    for (const e of exts) {
      const rom = e.seqs[8].romance;
      assert.equal(rom[0].speaker, "Naïah", `${e.id} : Naïah annonce son départ`);
      const after = rom.slice(1).filter((l) => l.speaker === "Naïah"); assert.equal(after.length, 0, "Naïah absente du moment sensuel");
    }
    for (const t of strings(everything)) {
      assert.ok(!NAMED_ORIENTATION.test(t), `orientation nommée : ${t}`);
      assert.ok(!PENETRATION.test(t), `pénétration : ${t}`);
    }
    for (const l of linesOf([...dates, ...exts]).filter((x) => x.speaker === "Naïah")) assert.ok(!/(je te|je vous) (désire|veux en moi)|envie de toi|excit/iu.test(l.text), l.text);
  });

  await check("ST1", "Écriture : aucun tiret long ou demi-cadratin, aucune opposition « Ce n’est pas X, c’est Y », aucun terme cru, aucune mention intersexe", () => {
    const all = strings(everything);
    for (const t of all) {
      assert.ok(!DASH.test(t), `tiret : ${t}`); assert.ok(!CONTRAST.test(t), `opposition : ${t}`);
      assert.ok(!BANNED.test(t), `terme cru : ${t}`); assert.ok(!INTERSEX.test(t), t);
    }
  });

  await check("ST2", "Écriture : chaque réplique est unique dans toute la quête (au-delà de 24 caractères)", () => {
    const oneDateSet = dt.AN_DATE_IDS.map((id) => dt.anDateScene(id, dateCtxs[1]));
    const prose = linesOf([...quest, ...moments, ...oneDateSet, ...exts]).map((l) => l.text).filter((t) => t.length > 24);
    const seen = new Map(); const dup = [];
    for (const t of prose) { if (seen.has(t)) dup.push(t); seen.set(t, true); }
    assert.deepEqual([...new Set(dup)], []);
    stats.lignes = { total: prose.length, uniques: seen.size };
  });

  await check("ST3", "Voix : Naïah tutoie tout le monde dans la quête (aucun vouvoiement de sa part, hors pluriel adressé aux deux)", () => {
    for (const s of [...quest, ...moments, ...dates]) for (const l of linesOf(s).filter((x) => x.speaker === "Naïah")) assert.ok(!/\bvous (avez|êtes|pouvez|voulez)\b/u.test(l.text) || /vous deux|vous avez tous|Prenez|Donnez|Fermez/u.test(l.text), `Naïah vouvoie : ${l.text}`);
  });

  await check("UI1", "Interface : dossier, enquête et extension se rendent ; la pièce Tellia n’apparaît qu’après Q5 ; contrôle « Arrêter ici » présent", async () => {
    let p = cq.createANProgress(1); p = cq.finishANScene(p, "cross-an-01", ["x"], 1);
    const noop = () => {};
    const d1 = renderToStaticMarkup(createElement(ui.ANDossier, { progress: p, day: 2, amanea: amaneaAkuhn, onScene: noop, onMini: noop, onExtension: noop }));
    assert.match(d1, /Allenna &amp; Naïah/u); assert.ok(!/Tellia/u.test(d1));
    for (const id of sb.AN_QUEST_IDS.slice(1, 4)) p = cq.finishANScene(p, id, ["x"], 3);
    p = cq.anSaveMini(p, { ...mg.newANMini(), complete: true, confirmed: ["H6"] }, 3); p = cq.finishANScene(p, "cross-an-05", ["x"], 3);
    const d2 = renderToStaticMarkup(createElement(ui.ANDossier, { progress: p, day: 4, amanea: amaneaAkuhn, onScene: noop, onMini: noop, onExtension: noop }));
    assert.match(d2, /Bordereau de dérivation/u); assert.match(d2, /Non vérifié/u);
    const m = renderToStaticMarkup(createElement(ui.ANMinigame, { initial: mg.newANMini(), onSave: noop, onClose: noop, onFinish: noop }));
    assert.match(m, /Les fils sous la cendre/u); assert.match(m, /data-an-mini/u); assert.match(m, /op\./u);
    const e = renderToStaticMarkup(createElement(ui.ANExtensionModal, { ext: exts[0], mode: "tendre", romance: true, background: "", format: (x) => x, onCheckpoint: noop, onStop: noop, onFinish: noop }));
    assert.match(e, /Arrêter ici/u); assert.match(e, /data-sprite-channel="standard"/u); assert.ok(!/intimate/.test(e.replace(/interactive-intimacy|group-interactive-intimacy|v2-scene-intime|intimacy-dialogue|intimacy-top|group-intimacy-sprites?/gu, "")), "aucun sprite intime");
    const css = await readFile(resolve(root, "src/allenna-naiah.css"), "utf8");
    assert.match(css, /max-height: 600px/u); assert.match(css, /orientation: portrait/u); assert.match(css, /backdrop-filter/u);
  });

  await check("IN1", "Intégration : hydratation, drapeau de scène, enchaînements, dossier du Journal, onglet Croisées, bloc développeur et import CSS", async () => {
    for (const re of [/id === AN_KEY \? hydrateAN\(progress\)/u, /anScene\?: boolean;/u, /startANScene\("cross-an-05"/u, /<ANDossier /u, /game\.crossQuestSeries\[AN_KEY\] \? \[\["croisees"/u, /<ANDevBlock /u, /kind: "an-mini"/u, /anAlreadyPicked/u, /amaneaWhere\(game\)/u])
      assert.match(pageSource, re, String(re));
    const main = await readFile(resolve(root, "src/main.tsx"), "utf8"); assert.match(main, /allenna-naiah\.css/u);
    const cqSrc = await readFile(resolve(root, "src/cross-quests.ts"), "utf8"); assert.match(cqSrc, /an\?: import\("\.\/allenna-naiah-cross-quest"\)\.ANState;/u);
  });

  await check("AS1", "Ressources : tous les décors et musiques référencés existent (réemploi documenté, aucune image générée)", async () => {
    const bgs = new Set(strings([quest, moments, dates, exts]).filter((t) => /^\/assets\/.+\.webp$/u.test(t)));
    for (const b of bgs) if (!b.startsWith("/assets/housing/")) await access(resolve(root, "..", b.slice(1)));
    const music = new Set([...quest, ...moments, ...dates, ...exts].map((s) => s.music));
    for (const m of music) await access(resolve(root, "..", `assets/audio/${m}.mp3`));
    stats.ressources = { decors: bgs.size, musiques: music.size };
  });
} finally {
  await server.close();
}

const failed = results.filter((r) => !r[2]);
for (const [id, label, ok, message] of results) console.log(`${ok ? "✓" : "✗"} ${id} ${label}${ok ? "" : `\n    ${message}`}`);
console.log(JSON.stringify(stats));
if (failed.length) { console.error(`Allenna × Naïah : ${failed.length} contrôle(s) en échec sur ${results.length}`); process.exit(1); }
console.log(`Allenna × Naïah OK : ${results.length} contrôles.`);
