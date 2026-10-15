// Vie quotidienne (PROPOSITION_VIE_V1, approuvée) : humeurs, présents, activités partagées, invitations,
// lettres, envies et aspirations. Contrôles de règles, de lore (LORE_CHECK.md), d’écriture et de sauvegarde.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const server = await createServer({
  root, appType: "custom", logLevel: "silent", server: { middlewareMode: true },
  plugins: [{ name: "vie-test", enforce: "pre", transform(code, id) {
    if (id.endsWith("/src/page.tsx")) return `${code}\nexport { hydrateGame, createGame, DEFAULT_PLAYER, characterPlace, baseCharacterPlace, setLifeOverlay, lifeTick, withLifeEvents, characterMood, lifeInviteSpots, lifeInviteFactors, lifeInviteSuspended, lifeNotifications, lifeScaleEffects, lifeOf };`;
  } }],
});
const results = [];
async function check(id, label, fn) {
  try { await fn(); results.push([id, label, true]); }
  catch (error) { results.push([id, label, false, error.message]); }
}
const DASH = /[—–]/u;
const CONTRAST = /n[’']est pas[^!?«»"]{0,80}[,;.:]\s*c[’']est\b/iu;
const CRUDE = /\b(merde|putain|bordel|connard|conne?s?|salope?|baiser|baise|cul|chier|foutre|engueul\w*|bite|chatte|nichons?)\b/iu;
const INTIMATE = /\b(nue?s?|caress\w*|sensuel\w*|intim\w*|déshabill\w*|au lit|dans (son|ton|votre|mon) lit|désir\w*|embrass\w*)\b/iu;
const QUARANTINE = /(Elowan|stase|yeux d[’']argent|cryomancie d[’']enfance|malédiction de Remerii|mère d[’']Iriana|mère de Lineva|artefact de Bellirith)/iu;
const TU_CHARACTERS = ["hylee", "naiah", "bellirith", "amanea"];
const stats = {};

/** Toutes les chaînes d’une valeur (objets et tableaux parcourus récursivement). */
function strings(value, out = []) {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => strings(v, out));
  else if (value && typeof value === "object") Object.values(value).forEach((v) => strings(v, out));
  return out;
}

try {
  const load = (path) => server.ssrLoadModule(path);
  const gd = await load("/src/game-data.ts");
  const wd = await load("/src/world-data.ts");
  const hd = await load("/src/housing-data.ts");
  const moods = await load("/src/life-moods.ts");
  const gifts = await load("/src/life-gifts.ts");
  const acts = await load("/src/life-activities.ts");
  const texts = await load("/src/life-initiative-texts.ts");
  const wishes = await load("/src/life-wishes.ts");
  const ls = await load("/src/life-state.ts");
  const page = await load("/src/page.tsx");
  const pageSource = await readFile(resolve(root, "src/page.tsx"), "utf8");
  const lifeSources = await Promise.all(["life-moods", "life-gifts", "life-activities", "life-initiative-texts", "life-wishes", "life-state"].map((f) => readFile(resolve(root, `src/${f}.ts`), "utf8")));
  const CHARS = gd.CHARACTERS.map((c) => c.id);
  const GIFT_IDS = gd.GIFTS.map((g) => g.id);
  const SPOT_IDS = wd.SUBLOCATIONS.map((s) => s.id);
  const LOC_IDS = gd.LOCATIONS.map((l) => l.id);
  const fresh = () => {
    const g = page.createGame({ ...page.DEFAULT_PLAYER, name: "Testeur" });
    for (const id of CHARS) g.relationships[id] = { ...g.relationships[id], met: true, stage: 3, affection: 40, trust: 40, desire: 10 };
    return { ...g, settings: { ...g.settings, unlockAll: true }, visitedSpots: [...SPOT_IDS], visitedLocations: [...LOC_IDS], day: 30 };
  };
  const relSnapshot = (g) => JSON.stringify(Object.fromEntries(CHARS.map((id) => [id, { desire: g.relationships[id].desire, stage: g.relationships[id].stage }])));

  await check("HUM1", "Humeurs : 6 humeurs, tempérament et 6 accroches par personnage, tirage déterministe et varié", () => {
    assert.deepEqual(Object.keys(moods.MOODS).sort(), ["fatiguee", "irritable", "maussade", "nostalgique", "radieuse", "sereine"]);
    for (const m of Object.values(moods.MOODS)) assert.ok(m.gain >= 0.75 && m.gain <= 1.25 && Math.abs(m.invite) <= 15, `bornes ${m.id}`);
    const lines = [];
    for (const id of CHARS) {
      assert.ok(moods.MOOD_TEMPERAMENTS[id], `tempérament ${id}`);
      for (const mood of moods.MOOD_ORDER) { assert.ok(moods.MOOD_LINES[id]?.[mood], `accroche ${id}/${mood}`); lines.push(moods.MOOD_LINES[id][mood]); }
      const seen = new Set();
      for (let day = 1; day <= 400; day++) {
        const a = moods.moodOf(id, day, { locationId: "algratal" });
        assert.equal(a, moods.moodOf(id, day, { locationId: "algratal" }), "déterminisme");
        seen.add(a);
      }
      assert.ok(seen.size >= 5, `${id} : au moins 5 humeurs sur 400 jours (${seen.size})`);
    }
    assert.equal(new Set(lines).size, 72, "72 accroches uniques");
    for (const mood of moods.MOOD_ORDER) { assert.ok(moods.scaleGain(4, mood) >= 1); assert.equal(moods.scaleGain(-2, mood), -2); assert.equal(moods.scaleGain(0, mood), 0); }
    assert.equal(moods.moodLabel("radieuse", "valurn"), "radieux"); assert.equal(moods.moodLabel("fatiguee", "draven"), "fatigué"); assert.equal(moods.moodLabel("sereine", "hylee"), "sereine");
    // Excuse : efface les souvenirs négatifs plus anciens ; activité du jour : apaise « maussade ».
    const neg = [{ character: "lineva", kind: "rdv-manque", day: 10 }];
    assert.ok(moods.recentMoodScore(neg, "lineva", 11) < 0);
    assert.equal(moods.recentMoodScore([...neg, { character: "lineva", kind: "excuse", day: 10 }], "lineva", 11), 0);
    for (let day = 1; day <= 200; day++) assert.notEqual(moods.moodOf("hylee", day, { locationId: "forbidden", events: [{ character: "hylee", kind: "activite", day }] }), "maussade");
  });

  await check("HUM2", "Humeurs en jeu : stables sur la journée, gains de conversation modulés sans toucher au Désir", () => {
    const g = fresh();
    for (const id of CHARS) assert.equal(page.characterMood({ ...g, period: 0 }, id), page.characterMood({ ...g, period: 3 }, id), `stable ${id}`);
    const scaled = page.lifeScaleEffects({ affection: 4, trust: 2, desire: 3 }, "radieuse");
    assert.equal(scaled.desire, 3, "le Désir n’est jamais modulé"); assert.equal(scaled.affection, 5);
    assert.equal(page.lifeScaleEffects({ affection: -3 }, "irritable").affection, -3, "aucune perte aggravée par l’humeur");
    assert.match(pageSource, /dialogue\.scene\.kind === "ambient" \|\| dialogue\.scene\.kind === "social"\) && dialogue\.scene\.character;\n\s*applyEffects\(dialogue\.scene\.character, everyday \? lifeScaleEffects/u, "modulation limitée aux conversations ordinaires");
  });

  await check("DES1", "Désir et étape : aucun module de vie ne les lit ni ne les écrit (Bellirith : Désir seulement en lui tenant tête)", () => {
    for (const src of lifeSources) { assert.ok(!/\.desire\b|desire\s*:/u.test(src), "aucun accès au Désir"); assert.ok(!/\.stage\s*=|stage\s*:\s*[^n]/u.test(src.replace(/stage: number/g, "")), "aucune écriture d’étape"); }
    const fn = (name) => { const i = pageSource.indexOf(`function ${name}(`); return pageSource.slice(i, pageSource.indexOf("\n  }\n", i)); };
    for (const name of ["giveGift", "doSharedActivity", "proposeInvite", "joinInvite", "sendLifeLetter", "readLifeMail", "pickAspiration"]) assert.ok(!/desire|\.stage\s*=/u.test(fn(name)), `${name} sans Désir ni étape`);
    for (const name of ["lifeAdjustRelation", "applyLifeReward", "withLifeEvents", "lifeTick"]) { const i = pageSource.indexOf(`function ${name}(`); assert.ok(i > 0); assert.ok(!/desire|\.stage\s*=/u.test(pageSource.slice(i, pageSource.indexOf("\n}\n", i))), name); }
    // Simulation large : toutes les sortes d’événements, 60 jours de passage du temps.
    let g = fresh();
    const before = relSnapshot(g);
    g = page.withLifeEvents(g, [{ kind: "gift", character: "bellirith", category: "aime" }, { kind: "activity", character: "bellirith", activity: "jeu", spot: "algratal-market", home: false, weather: "clair" }, { kind: "letter", character: "bellirith", theme: "confidence" }, { kind: "invite", character: "bellirith", location: "algratal", home: false }, { kind: "meet", character: "bellirith" }]);
    g = { ...g, life: { ...g.life, letters: CHARS.map((c, i) => ({ id: `t-${c}`, character: c, theme: ["merci", "nouvelles", "excuse", "confidence"][i % 4], day: 30, replyDay: 31 + (i % 3), read: false, high: true })), invites: CHARS.map((c) => ({ id: `i-${c}`, character: c, location: "algratal", spot: "algratal-market", day: 31, period: 1, status: "accepted", createdDay: 30 })) } };
    for (let d = 31; d <= 90; d++) for (let p = 0; p < 4; p++) { page.setLifeOverlay(g.life); g = page.lifeTick({ ...g, day: d, period: p }); }
    assert.equal(relSnapshot(g), before, "Désir et étapes inchangés");
  });

  await check("CAD1", "Présents : deux goûts à éviter par personnage, distincts des favoris, et une réplique pour chaque cas", () => {
    let liked = 0, disliked = 0, neutral = 0;
    for (const c of gd.CHARACTERS) {
      const dis = gifts.GIFT_DISLIKES[c.id];
      assert.equal(dis?.length, 2, c.id); assert.ok(dis.every((g) => GIFT_IDS.includes(g)) && !dis.some((g) => c.giftLikes.includes(g)), `goûts disjoints ${c.id}`);
      for (const g of c.giftLikes) { assert.ok(gifts.GIFT_LIKED_LINES[c.id]?.[g], `aimé ${c.id}/${g}`); liked++; }
      for (const g of dis) { assert.ok(gifts.GIFT_DISLIKED_LINES[c.id]?.[g], `mal choisi ${c.id}/${g}`); disliked++; }
      assert.equal(gifts.GIFT_NEUTRAL_LINES[c.id]?.length, 3); neutral += 3;
      const v = gifts.GIFT_MOOD_LINES[c.id]; assert.ok(v.aimeRadieuse && v.aimeIrritable && v.detesteRadieuse && v.detesteIrritable, `variantes ${c.id}`);
    }
    stats.cadeaux = { liked, disliked, neutral, moodVariants: CHARS.length * 4 };
  });

  await check("CAD2", "Présents : gains (aimé 6/3, neutre 2/1, mal choisi 0/-1 ou -2 irritable), un seul compté par jour", () => {
    const c = gd.CHARACTERS.find((x) => x.id === "lineva");
    const like = gifts.giftOutcome("lineva", c.giftLikes[0], c.giftLikes, "nostalgique", 5);
    assert.deepEqual([like.category, like.affection, like.trust], ["aime", 6, 3]);
    assert.deepEqual([gifts.giftOutcome("lineva", c.giftLikes[0], c.giftLikes, "radieuse", 5).affection], [8]);
    const neutralGift = GIFT_IDS.find((g) => !c.giftLikes.includes(g) && !gifts.GIFT_DISLIKES.lineva.includes(g));
    const neu = gifts.giftOutcome("lineva", neutralGift, c.giftLikes, "nostalgique", 5); assert.deepEqual([neu.affection, neu.trust], [2, 1]);
    const bad = gifts.giftOutcome("lineva", gifts.GIFT_DISLIKES.lineva[0], c.giftLikes, "sereine", 5); assert.deepEqual([bad.category, bad.affection, bad.trust], ["deteste", 0, -1]);
    assert.equal(gifts.giftOutcome("lineva", gifts.GIFT_DISLIKES.lineva[0], c.giftLikes, "irritable", 5).trust, -2);
    const again = gifts.giftOutcome("lineva", c.giftLikes[0], c.giftLikes, "radieuse", 5, false); assert.deepEqual([again.affection, again.trust, again.counted], [0, 0, false]);
    assert.match(pageSource, /const counted = !giftCounted\(lifeOf\(game\), characterId, game\.day\);/u);
    assert.match(pageSource, /discovered: \{ \.\.\.life\.discovered, \[characterId\]: \[\.\.\.\(life\.discovered\[characterId\] \|\| \[\]\), giftId\] \}/u, "un goût à éviter est découvert en l’offrant");
  });

  await check("ACT1", "Activités : lieux réels, une réaction par personnage et activité, propres à un personnage atteignables", () => {
    let reactions = 0;
    for (const a of acts.SHARED_ACTIVITIES) {
      assert.ok(a.spots.every((s) => SPOT_IDS.includes(s)), `lieux ${a.id}`);
      assert.ok((a.outdoor || []).every((s) => a.spots.includes(s)), `plein air ${a.id}`);
      if (a.character) assert.ok(CHARS.includes(a.character), a.id);
    }
    for (const id of CHARS) for (const a of acts.SHARED_ACTIVITIES.filter((x) => !x.character || x.character === id)) { assert.ok(acts.ACTIVITY_REACTIONS[id]?.[a.id], `réaction ${id}/${a.id}`); reactions++; }
    for (const id of CHARS) { assert.ok(acts.FAVORITE_ACTIVITY[id] && acts.PREFERRED_TONE[id], `préférences ${id}`); }
    // Atteignabilité : chaque activité propre se trouve sur l’itinéraire du personnage au moins une fois en 60 jours.
    for (const a of acts.SHARED_ACTIVITIES.filter((x) => x.character)) {
      const c = gd.CHARACTERS.find((x) => x.id === a.character);
      let ok = false;
      for (let d = 10; d <= 70 && !ok; d++) for (let p = 0; p < 4 && !ok; p++) if (a.spots.includes(page.baseCharacterPlace(c, d, p, [], undefined).spot)) ok = true;
      assert.ok(ok, `${a.id} atteignable avec ${a.character}`);
    }
    // Météo et saison : plein air bloqué par l’orage, lac gelé en hiver.
    let frozen = false;
    for (let d = 287; d <= 369; d++) { const r = acts.activitiesAt("remerii", "miraldas-lake", "miraldas", d).find((x) => x.activity.id === "pecher"); if (r) { assert.equal(r.available, false); frozen = true; } }
    assert.ok(frozen, "pêche au lac de Mir’Aldas testée en hiver");
    stats.activites = { generales: acts.SHARED_ACTIVITIES.filter((a) => !a.character).length, propres: acts.SHARED_ACTIVITIES.filter((a) => a.character).map((a) => `${a.id}:${a.character}`), reactions };
  });

  await check("ACT2", "Activités : gains (+2, favori +1, ton +1), contenu jamais intime, une seule comptée par jour", () => {
    const fav = acts.FAVORITE_ACTIVITY.lineva; const tone = acts.PREFERRED_TONE.lineva;
    const o = acts.activityOutcome("lineva", "Lineva", fav, tone, "nostalgique", 40, "forthaven");
    assert.deepEqual([o.affection, o.trust, o.favorite, o.toneMatch], [3, 2, true, true]);
    for (const a of acts.SHARED_ACTIVITIES) for (const t of strings([a.intro, a.tones, a.label, a.detail])) assert.ok(!INTIMATE.test(t), `${a.id} : ${t}`);
    for (const t of strings(acts.ACTIVITY_REACTIONS)) assert.ok(!INTIMATE.test(t), t);
    let life = ls.emptyLife();
    assert.equal(ls.activityCounted(life, "tia", 5), false); life = ls.recordActivity(life, "tia", "lire", 5);
    assert.equal(ls.activityCounted(life, "tia", 5), true); assert.equal(ls.activityCounted(life, "tia", 6), false);
    assert.match(pageSource, /const counted = !activityCounted\(lifeOf\(game\), characterId, game\.day\);/u);
  });

  await check("INV1", "Invitations : Naïah seulement en Forêt Interdite, Amanea et Naïah jamais réunies, scènes d’histoire prioritaires", () => {
    const g = fresh();
    const naiahSpots = page.lifeInviteSpots(g, "naiah");
    assert.ok(naiahSpots.length > 0 && naiahSpots.every((s) => s.location === "forbidden"), "Naïah : Forêt Interdite");
    assert.ok(page.lifeInviteSpots(g, "lineva").some((s) => s.location !== "forbidden"));
    assert.ok(!page.lifeInviteSpots(g, "lineva").some((s) => s.location === "rocky-spires" || s.housing), "ni front ni logis d’autrui");
    const naiah = gd.CHARACTERS.find((c) => c.id === "naiah");
    let tested = 0;
    for (let d = 20; d <= 60; d++) for (let p = 0; p < 4; p++) {
      const spot = page.baseCharacterPlace(naiah, d, p, [], undefined).spot;
      const loc = wd.spotById(spot)?.location;
      const invite = { id: "x", character: "amanea", location: loc, spot, day: d, period: p, status: "accepted", createdDay: 1 };
      page.setLifeOverlay(undefined);
      assert.equal(page.lifeInviteSuspended(invite, [], undefined), true, `Amanea suspendue là où se trouve Naïah (${d}/${p})`);
      tested++;
    }
    // Les deux invitées au même endroit : chacune suspendue.
    const both = ls.recordAcceptance(ls.recordAcceptance(ls.emptyLife(), { id: "a", character: "amanea", location: "forbidden", spot: "forbidden-sanctuary", day: 40, period: 1, status: "accepted", createdDay: 39 }), { id: "n", character: "naiah", location: "forbidden", spot: "forbidden-sanctuary", day: 40, period: 1, status: "accepted", createdDay: 39 });
    page.setLifeOverlay(both);
    const amanea = gd.CHARACTERS.find((c) => c.id === "amanea");
    assert.notEqual(page.characterPlace(amanea, 40, 1, [], undefined).spot === page.characterPlace(naiah, 40, 1, [], undefined).spot && page.characterPlace(amanea, 40, 1, [], undefined).spot === "forbidden-sanctuary", true, "jamais au même sous-lieu");
    page.setLifeOverlay(undefined);
    // Surcouche : un rendez-vous accepté place le personnage, sauf scène d’histoire.
    const lin = gd.CHARACTERS.find((c) => c.id === "lineva");
    page.setLifeOverlay(ls.recordAcceptance(ls.emptyLife(), { id: "l", character: "lineva", location: "algratal", spot: "algratal-market", day: 50, period: 2, status: "accepted", createdDay: 48 }));
    assert.equal(page.characterPlace(lin, 50, 2, [], undefined).spot, "algratal-market");
    assert.notEqual(page.characterPlace(lin, 50, 1, [], undefined).spot === "algratal-market" && page.baseCharacterPlace(lin, 50, 1, [], undefined).spot !== "algratal-market", true, "seulement au créneau convenu");
    page.setLifeOverlay(undefined);
    stats.invitations = { amaneaNaiahCreneaux: tested };
  });

  await check("INV2", "Invitations : score caché, indice qualitatif, refus sans coût puis pause de 3 jours, manqué -1 et excusé +1", () => {
    assert.equal(ls.inviteHint(80).label, "semble disponible"); assert.equal(ls.inviteHint(50).label, "hésite peut-être"); assert.equal(ls.inviteHint(20).label, "semble peu disponible");
    const inviter = pageSource.slice(pageSource.indexOf("function V2VieInviter("), pageSource.indexOf("function V2VieInviteReponse("));
    assert.ok(/inviteHint\(lifeInviteFactors\(/u.test(inviter) && !/\{score\}|\.score\}|score \/|\bscore\b[^)]*<\//u.test(inviter), "aucun score chiffré affiché, seulement l’indice");
    let life = ls.emptyLife();
    for (let i = 0; i < 3; i++) life = ls.recordRefusal(life, "tia", 10);
    assert.equal(ls.invitePaused(life, "tia", 12), true); assert.equal(ls.invitePaused(life, "tia", 13), false);
    for (const id of CHARS) { const t = texts.INVITE_TEXTS[id]; assert.ok(t && ["accept", "refuse", "weather", "far", "meet", "missed"].every((k) => t[k]), `textes ${id}`); assert.ok(texts.INVITE_EXCUSES[id], `excuse ${id}`); }
    let g = fresh();
    g = { ...g, day: 40, period: 0, life: ls.recordAcceptance(ls.emptyLife(), { id: "m", character: "lineva", location: "algratal", spot: "algratal-market", day: 40, period: 0, status: "accepted", createdDay: 38 }) };
    const trust = g.relationships.lineva.trust;
    page.setLifeOverlay(g.life);
    let after = page.lifeTick({ ...g, period: 1 });
    assert.equal(after.relationships.lineva.trust, trust - 1, "rendez-vous manqué : confiance -1");
    assert.equal(after.life.invites[0].status, "missed"); assert.ok(after.life.notes.some((n) => n.kind === "manque"));
    after = page.lifeTick({ ...after, period: 2 }); assert.equal(after.relationships.lineva.trust, trust - 1, "pénalité appliquée une seule fois");
    // Empêchement du personnage (scène d’histoire au créneau) : excuse et +1.
    const story = { ...g, life: ls.recordAcceptance(ls.emptyLife(), { id: "s", character: "amanea", location: "forbidden", spot: "forbidden-sanctuary", day: 40, period: 0, status: "accepted", createdDay: 38 }) };
    const naiah = gd.CHARACTERS.find((c) => c.id === "naiah");
    const spotN = page.baseCharacterPlace(naiah, 40, 0, story.flags, story.housing).spot;
    story.life.invites[0].spot = spotN; story.life.invites[0].location = wd.spotById(spotN).location;
    page.setLifeOverlay(story.life);
    const ex = page.lifeTick({ ...story, period: 1 });
    assert.equal(ex.life.invites[0].status, "excused"); assert.equal(ex.relationships.amanea.trust, story.relationships.amanea.trust + 1);
    page.setLifeOverlay(undefined);
  });

  await check("LET1", "Lettres : réponses pour chaque personnage et thème, délai 1 à 3 jours, une en attente par personne, deux par jour", () => {
    let replies = 0;
    for (const id of CHARS) {
      const r = texts.LETTER_REPLIES[id];
      for (const theme of ["merci", "nouvelles", "excuse", "confidence"]) { assert.ok(r[theme][0] && r[theme][1] && r[theme][0] !== r[theme][1], `${id}/${theme}`); replies += 2; }
      assert.ok(r.invitationOui && r.invitationNon && r.signature); replies += 2;
    }
    let life = ls.emptyLife();
    const r1 = ls.replyDayFor(life, "tia", 10); assert.ok(r1 >= 11 && r1 <= 13);
    life = { ...life, letters: [{ id: "a", character: "tia", theme: "nouvelles", day: 10, replyDay: r1, read: false, high: false }] };
    assert.ok(ls.letterBlocked(life, "tia", 10), "une lettre en attente par personne");
    life = { ...life, letters: [...life.letters, { id: "b", character: "draven", theme: "nouvelles", day: 10, replyDay: ls.replyDayFor(life, "draven", 10), read: false, high: false }] };
    assert.notEqual(life.letters[0].replyDay, life.letters[1].replyDay, "jamais deux réponses le même jour");
    assert.ok(ls.letterBlocked(life, "saidin", 10), "deux envois par jour");
    assert.equal(ls.letterThemeAvailable(ls.emptyLife(), "tia", "confidence", 2, 10), false); assert.equal(ls.letterThemeAvailable(ls.emptyLife(), "tia", "confidence", 3, 10), true);
    const d = ls.deliverLetterGains(life, 20); assert.equal(d.gains.length, 2); assert.equal(ls.deliverLetterGains(d.life, 21).gains.length, 0, "gains appliqués une seule fois");
    assert.ok(Object.values(ls.LETTER_GAINS).every((g) => g.trust <= 3 && g.affection <= 1));
    stats.lettres = { reponses: replies };
  });

  await check("ENV1", "Envies : 1 à 3 actives, faisables, sans Bellirith, sans répétition sur 5 jours ; lieux et objets réels", () => {
    for (const w of wishes.WISHES) {
      const c = w.condition;
      if (c.location) assert.ok(LOC_IDS.includes(c.location), w.id); if (c.spot) assert.ok(SPOT_IDS.includes(c.spot), w.id);
      if (c.gift) assert.ok(GIFT_IDS.includes(c.gift), w.id); if (c.activity) assert.ok(acts.activityById(c.activity), w.id);
      if (c.character && c.character !== "{character}") assert.ok(CHARS.includes(c.character) && c.character !== "bellirith", w.id);
    }
    let g = fresh(); let life = ls.emptyLife(); const lastSeen = {};
    for (let day = 1; day <= 300; day++) {
      const ctx = { day, period: 0, location: "algratal", spot: "algratal-market", coins: 50, locationOpen: () => true, spotLocation: (s) => wd.spotById(s)?.location, met: () => true };
      life = ls.rollWishes(life, ctx, CHARS);
      const active = life.wishes.filter((w) => !w.done && w.expiresDay >= day && w.createdDay <= day);
      assert.ok(active.length >= 1 && active.length <= 3, `jour ${day} : ${active.length}`);
      for (const w of life.wishes.filter((x) => x.createdDay === day)) {
        assert.notEqual(w.character, "bellirith");
        const key = w.character ? `${w.id}:${w.character}` : w.id;
        if (lastSeen[key] !== undefined) assert.ok(day - lastSeen[key] >= 5, `${key} répétée`);
        lastSeen[key] = day;
      }
    }
    void g;
    stats.envies = { modeles: wishes.WISHES.length, tirees: Object.keys(lastSeen).length };
  });

  await check("ASP1", "Aspirations : 7 fils de 4 jalons, récompenses appliquées une fois, titre et souvenir de vitrine", () => {
    assert.equal(wishes.ASPIRATIONS.length, 7);
    for (const a of wishes.ASPIRATIONS) { assert.equal(a.steps.length, 4); assert.ok(hd.DISPLAY_ITEMS.some((i) => i.id === a.keepsake), `souvenir ${a.id}`); }
    let g = fresh(); g = { ...g, life: ls.chooseAspiration(ls.emptyLife(), "coeur-cour", g.day) };
    const coins = g.coins; const luc = g.stats.lucidite;
    g = page.withLifeEvents(g, [
      { kind: "letter", character: "iriana", theme: "nouvelles" }, { kind: "letter", character: "tia", theme: "merci" },
      { kind: "activity", character: "tia", activity: "lire", spot: "algratal-palace", home: false, weather: "clair" },
      { kind: "gift", character: "iriana", category: "aime" },
      { kind: "invite", character: "iriana", location: "algratal", home: false },
    ]);
    const p = g.life.aspirations["coeur-cour"];
    assert.equal(p.steps.length, 4); assert.ok(g.life.titles.includes(wishes.ASPIRATIONS[0].title));
    assert.equal(g.inventory["asp-sceau-cour"], 1); assert.ok(g.coins >= coins + 55); assert.ok(g.stats.lucidite >= luc + 2);
    const again = page.withLifeEvents(g, [{ kind: "invite", character: "iriana", location: "algratal", home: false }]);
    assert.equal(again.coins, g.coins, "pas de double récompense"); assert.equal(again.life.titles.length, 1);
    const notes = page.lifeNotifications(fresh(), g); assert.ok(notes.some((n) => /Aspiration accomplie/u.test(n.title)));
  });

  await check("TXT1", "Écriture : vouvoiement de narration, tu ou vous selon le personnage, sans tiret, sans tournure interdite, sans grossièreté, sans détail en quarantaine, répliques uniques", () => {
    const all = strings([moods.MOOD_LINES, Object.values(moods.MOODS).map((m) => m.hint), gifts.GIFT_LIKED_LINES, gifts.GIFT_DISLIKED_LINES, gifts.GIFT_NEUTRAL_LINES, gifts.GIFT_MOOD_LINES, gifts.GIFT_CATEGORY_LABEL, gifts.GIFT_ALREADY_TODAY,
      acts.SHARED_ACTIVITIES, acts.TONES, acts.ACTIVITY_REACTIONS, texts.INVITE_TEXTS, texts.INVITE_EXCUSES, texts.INVITE_EXCUSE_FALLBACK, texts.LETTER_THEMES, texts.LETTER_REPLIES, wishes.WISHES.map((w) => w.text), wishes.ASPIRATIONS, wishes.ASPIRATION_KEEPSAKES]);
    for (const t of all) { assert.ok(!DASH.test(t), `tiret : ${t}`); assert.ok(!CONTRAST.test(t), `tournure : ${t}`); assert.ok(!CRUDE.test(t), `grossièreté : ${t}`); assert.ok(!QUARANTINE.test(t), `quarantaine : ${t}`); }
    const long = all.filter((t) => t.length > 50);
    const dup = long.filter((t, i) => long.indexOf(t) !== i);
    assert.deepEqual([...new Set(dup)], [], "répliques uniques");
    // Tu ou vous envers le joueur : paroles directes des personnages.
    for (const id of CHARS) {
      const speech = strings([texts.LETTER_REPLIES[id], texts.INVITE_EXCUSES[id], ["accept", "refuse", "weather", "far", "missed"].map((k) => texts.INVITE_TEXTS[id][k])]);
      for (const t of speech) {
        if (TU_CHARACTERS.includes(id)) assert.ok(!/(?<![\p{L}-])(vous|votre|vos)(?!\p{L})/iu.test(t.replace(/vous deux|entre vous/giu, "")), `${id} tutoie : ${t}`);
        else assert.ok(!/(?<!\p{L})(tu|te|toi|ton|ta|tes)(?!\p{L})|(?<!\p{L})t[’'](?=\p{L})/iu.test(t), `${id} vouvoie : ${t}`);
      }
    }
    // Répliques entre guillemets dans la narration (présents, activités, accroches, rencontres).
    for (const id of CHARS) {
      const narr = strings([gifts.GIFT_LIKED_LINES[id], gifts.GIFT_DISLIKED_LINES[id], gifts.GIFT_NEUTRAL_LINES[id], gifts.GIFT_MOOD_LINES[id], acts.ACTIVITY_REACTIONS[id], moods.MOOD_LINES[id], texts.INVITE_TEXTS[id].meet]);
      for (const t of narr) for (const quote of t.match(/«[^»]*»/gu) || []) {
        if (TU_CHARACTERS.includes(id)) assert.ok(!/(?<![\p{L}-])(vous|votre|vos)(?!\p{L})/iu.test(quote.replace(/vous deux|entre vous/giu, "")), `${id} tutoie : ${quote}`);
        else assert.ok(!/(?<!\p{L})(tu|te|toi|ton|ta|tes)(?!\p{L})|(?<!\p{L})t[’'](?=\p{L})/iu.test(quote), `${id} vouvoie : ${quote}`);
      }
    }
    // Lineva : la mauvaise cuisine n’est pas démultipliée (bible §99.3) : au plus une mention.
    const lineva = strings([gifts.GIFT_LIKED_LINES.lineva, gifts.GIFT_DISLIKED_LINES.lineva, gifts.GIFT_NEUTRAL_LINES.lineva, acts.ACTIVITY_REACTIONS.lineva, texts.LETTER_REPLIES.lineva, texts.INVITE_TEXTS.lineva, moods.MOOD_LINES.lineva]);
    assert.ok(lineva.filter((t) => /cuisin\w*|brûl\w*|immangeable/iu.test(t)).length <= 1, "cuisine de Lineva");
    // Valurn : aucun lien avec Bellirith.
    for (const t of strings([gifts.GIFT_LIKED_LINES.valurn, gifts.GIFT_DISLIKED_LINES.valurn, gifts.GIFT_NEUTRAL_LINES.valurn, acts.ACTIVITY_REACTIONS.valurn, texts.LETTER_REPLIES.valurn, texts.INVITE_TEXTS.valurn, moods.MOOD_LINES.valurn])) assert.ok(!/Bellirith|s(œ|oe)ur|frère/iu.test(t), `Valurn : ${t}`);
    stats.lignes = { total: all.length, uniques: new Set(all).size };
  });

  await check("SAV1", "Sauvegardes : version 18, partie au jour 400 relue sans champ de vie, état de vie normalisé et filtré", async () => {
    assert.match(pageSource, /version: 18;/u); assert.match(pageSource, /life\?: LifeState;/u);
    const base = page.createGame({ ...page.DEFAULT_PLAYER, name: "Testeur" });
    const old = JSON.parse(JSON.stringify({ ...base, day: 400, period: 2, location: "forthaven", spot: "forthaven-harbor" }));
    const loaded = page.hydrateGame(old);
    assert.ok(loaded && loaded.day === 400 && loaded.version === 18); assert.equal(loaded.life, undefined, "aucun champ inventé");
    const ticked = page.lifeTick(loaded); assert.ok(ticked.life && ticked.life.wishesRolled === 400);
    const round = page.hydrateGame(JSON.parse(JSON.stringify(ticked))); assert.deepEqual(JSON.parse(JSON.stringify(round.life)), JSON.parse(JSON.stringify(ticked.life)), "aller-retour JSON");
    const dirty = page.hydrateGame({ ...old, life: { moodEvents: [{ character: "inconnu", kind: "activite", day: 2 }, { character: "tia", kind: "activite", day: 3 }], invites: [{ id: "x", character: "tia", location: "nulle-part", spot: "x", day: 1, period: 1, status: "accepted" }], aspiration: "inexistante", titles: ["Faux"], wishes: [{ id: "zzz" }], letters: "n’importe quoi" } });
    assert.equal(dirty.life.moodEvents.length, 1); assert.equal(dirty.life.invites.length, 0); assert.equal(dirty.life.aspiration, undefined); assert.equal(dirty.life.titles.length, 0); assert.equal(dirty.life.wishes.length, 0); assert.deepEqual(dirty.life.letters, []);
    const v17 = JSON.parse(await readFile("/tmp/bvsim/save-fresh.json", "utf8").catch(() => "null"));
    if (v17) { const l = page.hydrateGame({ ...v17, day: 400 }); assert.ok(l && l.day === 400); assert.ok(page.lifeTick(l).life); }
  });

  await check("UI1", "Interface : feuille life.css, fenêtres de vie montées, entrées Lieu, Fiche, Courrier et Chronique, printemps allégé", async () => {
    const main = await readFile(resolve(root, "src/main.tsx"), "utf8"); assert.match(main, /import "\.\/life\.css";/u);
    const css = await readFile(resolve(root, "src/calendar.css"), "utf8"); assert.match(css, /\.v2-ciel\.ciel-printemps \{ --voile-saison: \.2; \}/u);
    for (const hook of ["vie-rejoindre", "vie-partager", "vie-inviter", "vie-envoyer", "vie-ecrire", "vie-ensemble", "vie-repondre"]) assert.ok(pageSource.includes(`data-act="${hook}"`), hook);
    assert.match(pageSource, /<V2VieLayer game=\{game\} modal=\{lifeModal\}/u); assert.match(pageSource, /data-chron="vie"/u);
    assert.match(pageSource, /if \(storyCharacterPlace\(invite\.character, invite\.day, invite\.period, flags\)\) return true;/u, "scènes d’histoire prioritaires");
  });
} finally {
  await server.close();
}

for (const [id, label, ok, error] of results) console.log(`${ok ? "✓" : "✗"} ${id} ${label}${ok ? "" : ` : ${error}`}`);
if (process.env.VIE_STATS) console.log(JSON.stringify(stats, null, 2));
const failed = results.filter((r) => !r[2]).length;
console.log(`[Vie quotidienne] ${failed ? `${failed} contrôle(s) en échec` : `${results.length} contrôles OK`} sur ${results.length}.`);
if (failed) process.exit(1);
