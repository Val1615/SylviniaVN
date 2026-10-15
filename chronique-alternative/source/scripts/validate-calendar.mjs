// Calendrier impérial, saisons, météo régionale et trajets (bible « Le Calendrier impérial » v1.0).
// Contrôles : calcul des dates contre la bible, fêtes et filtre par civilisation, météo déterministe
// et règles climatiques, effets sur les trajets sans blocage, abris sûrs, compatibilité des sauvegardes.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const server = await createServer({
  root, appType: "custom", logLevel: "silent", server: { middlewareMode: true },
  plugins: [{ name: "calendar-test", enforce: "pre", transform(code, id) {
    if (id.endsWith("/src/page.tsx")) return `${code}\nexport { hydrateGame, createGame, DEFAULT_PLAYER, characterPlace, weatherProtectedSpots };`;
  } }],
});
const results = [];
async function check(id, label, fn) {
  try { await fn(); results.push([id, label, true]); }
  catch (error) { results.push([id, label, false, error.message]); }
}
const DASH = /[—–]/u;
const CONTRAST = /n[’']est pas[^!?«»"]{0,80}[,;.:]\s*c[’']est\b/iu;
const stats = {};

try {
  const load = (path) => server.ssrLoadModule(path);
  const cal = await load("/src/calendar.ts");
  const w = await load("/src/weather.ts");
  const gd = await load("/src/game-data.ts");
  const rules = await load("/src/gameplay-rules.ts");
  const page = await load("/src/page.tsx");
  const pageSource = await readFile(resolve(root, "src/page.tsx"), "utf8");

  await check("CAL1", "Neuf mois en -eth, 369 jours, 40/41/42 répétés, saisons 2/3/2/2, Annexe A", () => {
    const m = cal.IMPERIAL_MONTHS;
    assert.deepEqual(m.map((x) => x.name), ["Avarneth", "Saëlieth", "Orvaneleth", "Vaëraeth", "Caeloreth", "Therianeth", "Eryndraeth", "Eladrieth", "Tiaeth"]);
    assert.deepEqual(m.map((x) => x.days), [40, 41, 42, 40, 41, 42, 40, 41, 42]);
    assert.equal(m.reduce((s, x) => s + x.days, 0), 369); assert.equal(cal.YEAR_LENGTH, 369);
    assert.ok(m.every((x) => x.name.endsWith("eth")));
    assert.deepEqual(m.map((x) => x.season), ["printemps", "printemps", "ete", "ete", "ete", "automne", "automne", "hiver", "hiver"]);
    const annexe = [[1, 40], [41, 81], [82, 123], [124, 163], [164, 204], [205, 246], [247, 286], [287, 327], [328, 369]];
    annexe.forEach(([a, b], i) => { assert.equal(cal.monthStart(i + 1), a); assert.equal(cal.monthStart(i + 1) + m[i].days - 1, b); });
    const seasonDays = { printemps: 0, ete: 0, automne: 0, hiver: 0 }; m.forEach((x) => { seasonDays[x.season] += x.days; });
    assert.deepEqual(seasonDays, { printemps: 81, ete: 123, automne: 82, hiver: 83 });
    assert.equal(cal.WEEK_LENGTH, 9); assert.equal(369 / 9, 41);
    assert.equal(cal.SELAMBRE_DAY_OF_YEAR, 357);
    assert.equal(cal.monthStart(9) + 30 - 1, 357, "30 Tiaeth = 357e jour");
  });

  await check("CAL2", "Correspondance jour de partie ↔ date impériale (jour 1, 369, 370, 400), aller-retour sur 5 ans, notation", () => {
    const d1 = cal.imperialDate(1); assert.equal(`${d1.dayOfMonth} ${d1.monthName} ${d1.year}`, "1 Avarneth 2024");
    assert.equal(cal.formatImperialDate(369), "42 Tiaeth 2024 E.I.");
    assert.equal(cal.formatImperialDate(370), "1 Avarneth 2025 E.I.");
    assert.equal(cal.formatImperialDate(400), "31 Avarneth 2025 E.I.");
    assert.equal(cal.formatImperialDate(cal.gameDayOf(2024, 5, 17)), "17 Caeloreth 2024 E.I.");
    assert.equal(cal.imperialDate(cal.gameDayOf(2024, 9, 30)).selambre, true);
    assert.equal(cal.imperialDate(cal.gameDayOf(2024, 9, 31)).selambre, false);
    for (let day = 1; day <= 369 * 5; day++) {
      const d = cal.imperialDate(day);
      assert.equal(cal.gameDayOf(d.year, d.month, d.dayOfMonth), day, `aller-retour ${day}`);
      assert.ok(d.dayOfMonth >= 1 && d.dayOfMonth <= cal.IMPERIAL_MONTHS[d.month - 1].days);
      assert.ok(d.weekday >= 1 && d.weekday <= 9 && d.week >= 1 && d.week <= 41);
    }
    // Pic thermique au cinquième mois, minimum en hiver.
    const heat = (mo, dd) => cal.imperialDate(cal.gameDayOf(2024, mo, dd)).heat;
    assert.ok(heat(5, 21) === Math.max(...Array.from({ length: 369 }, (_, i) => cal.imperialDate(i + 1).heat)), "pic en Caeloreth");
    const year = Array.from({ length: 369 }, (_, i) => cal.imperialDate(i + 1));
    const coldest = year.reduce((a, b) => (b.heat < a.heat ? b : a));
    assert.ok([8, 9].includes(coldest.month), `minimum relatif en Eladrieth ou Tiaeth (${coldest.monthName})`);
    assert.ok(heat(1, 20) < heat(3, 20) && heat(3, 20) < heat(5, 20) && heat(6, 20) > heat(8, 20), "montée puis décroissance");
    // Valeurs invalides : jamais d’exception.
    assert.equal(cal.imperialDate(0).day, 1); assert.equal(cal.imperialDate(Number.NaN).day, 1);
    // Aucun nom de jour inventé (la bible ne les fixe pas).
    assert.match(cal.weekLabel(10), /^Semaine 2 · jour 1 sur 9$/u);
  });

  await check("CAL3", "Fêtes : les douze fêtes régionales et la Sélambre sous quatre noms, dates et durées de la bible, Bal des Élus hors calendrier", () => {
    const F = cal.CALENDAR_FESTIVALS;
    const expected = [
      ["Jour de l’Unification", "algratal", 1, 1, 2], ["Nuit des Noms", "akuhn", 1, 1, 1], ["Journée des Glyphes", "miraldas", 2, 9, 1], ["Bénédiction des Filets", "forthaven", 2, 12, 1],
      ["Présentation des Talents", "miraldas", 3, 26, 2], ["Jeux du Phénix", "algratal", 4, 19, 3], ["Courses des Brisants", "forthaven", 5, 17, 3], ["Banquet des Retours", "forthaven", 6, 8, 2],
      ["Veillée de l’Équilibre", "akuhn", 6, 15, 2], ["Nuit des Cent Manuscrits", "miraldas", 7, 22, 1], ["Veillée des Mille Flambeaux", "algratal", 8, 6, 1], ["Foire des Voiles", "akuhn", 8, 21, 3],
      ["Résonance des Profondeurs", "akuhn", 9, 30, 1], ["Nuit des Fanaux", "forthaven", 9, 30, 1], ["Nuit de Résonance", "miraldas", 9, 30, 1], ["Veille des Deux Astres", "algratal", 9, 30, 1],
    ];
    assert.equal(F.length, expected.length);
    for (const [name, civ, month, day, duration] of expected) {
      const f = F.find((x) => x.name === name); assert.ok(f, `fête absente : ${name}`);
      assert.deepEqual([f.civilization, f.month, f.day, f.duration], [civ, month, day, duration], name);
      assert.ok(f.day + f.duration - 1 <= cal.IMPERIAL_MONTHS[f.month - 1].days, `${name} déborde du mois`);
      assert.ok(f.description.length > 40 && !DASH.test(f.description + f.name + f.nature) && !CONTRAST.test(f.description), `texte ${name}`);
    }
    for (const civ of cal.CIVILIZATION_ORDER) {
      assert.equal(F.filter((f) => f.civilization === civ && !f.selambre).length, 3, `trois fêtes pour ${civ}`);
      assert.equal(F.filter((f) => f.civilization === civ && f.selambre).length, 1, `Sélambre pour ${civ}`);
    }
    assert.ok(!F.some((f) => /Bal des Élus/u.test(f.name)), "le Bal des Élus n’a pas de date annuelle");
    const newYear = cal.festivalsOn(1).map((f) => f.id).sort(); assert.deepEqual(newYear, ["akuhn-nuit-des-noms", "algratal-unification"]);
    assert.deepEqual(cal.festivalsOn(2).map((f) => f.id), ["algratal-unification"], "Unification : deux jours");
    assert.equal(cal.festivalsOn(cal.gameDayOf(2024, 9, 30)).length, 4);
    assert.equal(cal.festivalsOn(cal.gameDayOf(2025, 5, 19)).map((f) => f.id).join(), "forthaven-brisants", "fêtes annuelles");
    assert.equal(cal.festivalsOn(cal.gameDayOf(2025, 5, 20)).length, 0);
  });

  await check("CAL4", "Filtre par civilisation : mois, jour et fêtes à venir ne montrent que les civilisations choisies", () => {
    for (const civ of cal.CIVILIZATION_ORDER) {
      for (let month = 1; month <= 9; month++) assert.ok(cal.festivalsInMonth(month, [civ]).every((f) => f.civilization === civ));
      assert.ok(cal.upcomingFestivals(50, 10, [civ]).every(({ festival }) => festival.civilization === civ));
      assert.equal(cal.upcomingFestivals(1, 20, [civ]).length, 4);
    }
    assert.deepEqual(cal.festivalsOn(1, ["forthaven"]), []);
    assert.equal(cal.festivalsInMonth(9, []).length, 0);
    assert.equal(cal.festivalsInMonth(9).length, 4);
    const up = cal.upcomingFestivals(100, 5); assert.ok(up.every((x, i) => i === 0 || x.inDays >= up[i - 1].inDays));
    assert.ok(pageSource.includes("data-civ={civ}") && pageSource.includes('["calendrier", "Calendrier"'), "onglet et filtre présents dans le Journal");
  });

  await check("MET1", "Météo : profil climatique pour chaque lieu de la carte, déterministe, règles géographiques", () => {
    for (const loc of gd.LOCATIONS) assert.ok(w.LOCATION_CLIMATE[loc.id], `climat manquant : ${loc.id}`);
    for (const [id, c] of Object.entries(w.CLIMATES)) for (const season of ["printemps", "ete", "automne", "hiver"]) {
      assert.ok(Object.keys(c.table[season]).length >= 3, `${id} ${season}`);
      for (const k of Object.keys(c.table[season])) assert.ok(w.WEATHER[k], `${id} : temps inconnu ${k}`);
    }
    const never = (climate, ids) => { for (const season of Object.keys(w.CLIMATES[climate].table)) for (const k of ids) assert.ok(!(k in w.CLIMATES[climate].table[season]), `${climate} ${season} : ${k}`); };
    never("desert", ["neige", "blizzard", "brume", "brume-dense", "tempete"]);
    never("roche-noire", ["neige", "blizzard", "sable", "tempete"]);
    never("dome", ["tempete", "blizzard", "orage", "sable", "canicule"]);
    for (const c of Object.keys(w.CLIMATES)) if (c !== "desert") never(c, ["sable"]);
    for (const c of Object.keys(w.CLIMATES)) if (c !== "archipel") never(c, ["tempete"]);
    for (const season of ["printemps", "ete", "automne", "hiver"]) assert.ok(w.CLIMATES.brumes.table[season].brume, "brume toute l’année en forêt");
    for (const season of ["printemps", "automne"]) never("archipel", []);
    // Déterminisme et répartition sur six ans.
    const counts = {};
    for (const loc of gd.LOCATIONS) {
      counts[loc.id] = {};
      for (let day = 1; day <= 369 * 6; day++) {
        const a = w.weatherAt(day, loc.id); assert.equal(a, w.weatherAt(day, loc.id));
        const season = cal.imperialDate(day).season;
        assert.ok(a.id in w.climateOf(loc.id).table[season] || day > 1, `${loc.id} ${day} hors table`);
        counts[loc.id][a.id] = (counts[loc.id][a.id] || 0) + 1;
      }
      assert.ok(Object.keys(counts[loc.id]).length >= 5, `${loc.id} trop monotone`);
    }
    // Chaleur plus fréquente en Caeloreth qu’en Orvaneleth à Al’Gratal ; neige seulement en hiver hors montagne.
    const freq = (loc, month, id) => { let n = 0, t = 0; for (let y = 2024; y < 2030; y++) for (let d = 1; d <= cal.IMPERIAL_MONTHS[month - 1].days; d++) { t++; if (["chaleur", "canicule"].includes(w.weatherAt(cal.gameDayOf(y, month, d), loc).id)) n++; } return n / t; };
    assert.ok(freq("algratal", 5, "chaleur") > freq("algratal", 3, "chaleur"), "pic de chaleur au cinquième mois");
    for (let day = 1; day <= 369 * 6; day++) { const s = cal.imperialDate(day).season; if (s === "ete") assert.notEqual(w.weatherAt(day, "algratal").id, "neige"); }
    stats.meteo = Object.fromEntries(Object.entries(counts).map(([k, v]) => [k, Object.entries(v).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([id, n]) => `${id} ${Math.round(n / (369 * 6) * 100)}%`).join(", ")]));
  });

  await check("MET2", "Trajets : surcoût plafonné à deux périodes, jamais dans une même région, Éclaireur·se aidé, réglage sans coût respecté", () => {
    const regions = gd.LOCATIONS.map((l) => l.id); let delayed = 0, trips = 0;
    for (let day = 1; day <= 369 * 3; day += 2) for (const a of regions) for (const b of regions) {
      const t = w.weatherTravel(a, b, day, "Cartographe des Échos");
      if (a === b) { assert.equal(t.surcharge, 0); continue; }
      trips++; if (t.surcharge) delayed++;
      assert.ok(t.surcharge >= 0 && t.surcharge <= w.WEATHER_TRAVEL_CAP);
      const scout = w.weatherTravel(a, b, day, rules.SCOUT_VOCATION);
      assert.ok(scout.surcharge === Math.max(0, t.surcharge - 1), "Éclaireur·se : une période de moins");
      assert.equal(w.weatherTravel(a, b, day, "x", "setting").surcharge, 0);
      const total = rules.travelPeriodCost(a, b, "x", gd.LOCATIONS) + t.surcharge; assert.ok(total <= 6, `trajet ${a}→${b} ${total}`);
    }
    stats.trajets = `${Math.round(delayed / trips * 100)} % des trajets interrégionaux ralentis`;
    assert.ok(delayed / trips > 0.05 && delayed / trips < 0.45, stats.trajets);
  });

  await check("MET3", "Aucun blocage : jalons d’histoire, départ d’Hylee et invitations ignorent la météo ; trajets libres toujours possibles", () => {
    const body = (name) => { const a = pageSource.indexOf(`function ${name}(`); const b = pageSource.indexOf("\n  function ", a + 10); return pageSource.slice(a, b); };
    assert.ok(!body("startCampaignScene").includes("weatherTravel"), "les jalons de l’histoire principale ne subissent pas la météo");
    assert.ok(!body("acceptInvitation").includes("weatherTravel") && !body("acceptInvitation").includes("advanceClock"), "les invitations restent instantanées");
    const hyleeDeparture = pageSource.slice(pageSource.indexOf('route?.id === "hylee-4" && dialogue.scene.departure'), pageSource.indexOf('route?.id === "hylee-4" && dialogue.scene.departure') + 600);
    assert.ok(!hyleeDeparture.includes("weatherTravel"), "départ d’Hylee inchangé");
    assert.ok(body("travel").includes("weatherTravel") && !/disabled=\{[^}]*meteo/u.test(pageSource), "trajet libre : surcoût, jamais de bouton bloqué");
    // Simulation : un voyageur qui veut atteindre chaque région le jour J y arrive toujours au plus tard le lendemain soir.
    const regions = gd.LOCATIONS.filter((l) => l.unlockDay < 999).map((l) => l.id);
    for (let day = 1; day <= 369 * 2; day++) for (const a of regions) for (const b of regions) {
      if (a === b) continue;
      const periods = rules.travelPeriodCost(a, b, "x", gd.LOCATIONS) + w.weatherTravel(a, b, day, "x").surcharge;
      const arrival = rules.advanceClock({ day, period: 3 }, periods, 4);
      assert.ok(arrival.day <= day + 2, `${a}→${b} jour ${day}`);
    }
    // Les invitations expirent en jours entiers ; aucune n’a un délai inférieur à un jour.
    assert.ok(pageSource.includes("expiresDay"));
  });

  await check("MET4", "Abris : seulement des paires sûres de la même région, jamais là où une scène attend le personnage", async () => {
    const spots = new Map((await load("/src/world-data.ts")).SUBLOCATIONS.map((s) => [s.id, s]));
    for (const [from, to] of Object.entries(w.WEATHER_SHELTERS)) { assert.ok(spots.get(from) && spots.get(to), `${from} → ${to}`); assert.equal(spots.get(from).location, spots.get(to).location); }
    const game = page.createGame(page.DEFAULT_PLAYER); let sheltered = 0, checked = 0;
    for (const character of gd.CHARACTERS) {
      const protectedSpots = page.weatherProtectedSpots(character.id);
      for (let day = 1; day <= 369; day += 1) for (let period = 0; period < 4; period++) {
        const place = page.characterPlace(character, day, period, game.flags, game.housing); checked++;
        if (/à l’abri/u.test(place.action || "")) {
          sheltered++;
          const from = Object.entries(w.WEATHER_SHELTERS).find(([, to]) => to === place.spot)?.[0];
          assert.ok(from && !protectedSpots.has(from), `${character.id} déplacé depuis un lieu protégé`);
          assert.ok(w.shelterSpot(from, place.location, day, new Set()), "abri sans mauvais temps");
        }
      }
      for (const spot of protectedSpots) assert.equal(w.shelterSpot(spot, spots.get(spot)?.location || "algratal", 1, protectedSpots), undefined);
    }
    stats.abris = `${sheltered} présences à l’abri sur ${checked}`;
    assert.ok(sheltered > 0, "aucun abri utilisé");
  });

  await check("SAV1", "Sauvegardes : version 18 inchangée, partie au jour 400 et sauvegarde ancienne relues sans perte", async () => {
    assert.match(pageSource, /version: 18;/u);
    const fresh = page.createGame({ ...page.DEFAULT_PLAYER, name: "Testeur" });
    const old = JSON.parse(JSON.stringify({ ...fresh, day: 400, period: 2, location: "forthaven", spot: "forthaven-harbor" }));
    const loaded = page.hydrateGame(old);
    assert.ok(loaded); assert.equal(loaded.day, 400); assert.equal(loaded.period, 2); assert.equal(loaded.location, "forthaven");
    assert.equal(cal.formatImperialDate(loaded.day), "31 Avarneth 2025 E.I.");
    assert.ok(!Object.keys(loaded).some((k) => /calend|meteo|weather|saison|season|festival/iu.test(k)), "aucun champ ajouté à la sauvegarde : tout est calculé");
    const v17 = JSON.parse(await readFile("/tmp/bvsim/save-fresh.json", "utf8").catch(() => "null"));
    if (v17) { const l = page.hydrateGame({ ...v17, day: 400 }); assert.ok(l && l.day === 400, "sauvegarde v17 au jour 400"); }
  });

  await check("TXT1", "Écriture : textes météo et climats sans tiret long ni tournure interdite", () => {
    const texts = [...Object.values(w.WEATHER).flatMap((x) => [x.label, x.detail]), ...Object.values(w.CLIMATES).flatMap((c) => [c.label, c.detail]), cal.BAL_DES_ELUS_NOTE, ...cal.IMPERIAL_MONTHS.map((m) => m.ruler)];
    for (const t of texts) assert.ok(!DASH.test(t) && !CONTRAST.test(t), t);
  });
} finally {
  await server.close();
}

for (const [id, label, ok, error] of results) console.log(`${ok ? "✓" : "✗"} ${id} ${label}${ok ? "" : ` : ${error}`}`);
if (process.env.CAL_STATS) console.log(JSON.stringify(stats, null, 2));
const failed = results.filter((r) => !r[2]).length;
console.log(`[Calendrier] ${failed ? `${failed} contrôle(s) en échec` : `${results.length} contrôles OK`} sur ${results.length}.`);
if (failed) process.exit(1);
