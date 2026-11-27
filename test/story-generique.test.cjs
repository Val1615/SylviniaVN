/* Sélecteur de « Votre Chronique » : états synthétiques de la matrice de recette (node test/story-generique.test.cjs). */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const C = require("../fusion/story-generique-chronique.js");
const ids = (r) => r.map((x) => x.id);
const base = { wolfApproach: "still", gateReaction: "fists", remeriiSeSouviendraPatience: true, s02Adieu: "confiance", s02PorteNoireComplete: true, s08BlizzardComplete: true, s08Reponse: "seule", tome1Complete: true };

// Assets : chaque fond existe dans le dépôt, chaque entrée a 1 à 3 fonds.
for (const e of C.ENTRIES) {
  assert.ok(e.backgrounds.length >= 1 && e.backgrounds.length <= 3, e.id);
  for (const b of e.backgrounds) assert.ok(fs.existsSync(path.join(__dirname, "..", b)), `${e.id} : ${b}`);
  assert.ok(!/\u2014/.test(e.text + e.title), `pas de tiret cadratin : ${e.id}`);
}
// Identifiants uniques ; une seule valeur par flag et par groupe exclusif.
assert.equal(new Set(C.ENTRIES.map((e) => e.id)).size, C.ENTRIES.length);

// 1. Parcours sans branche optionnelle : ni Draven ni Iriana, choix prouvés seulement.
let r = C.select({ flags: base });
assert.ok(!ids(r).some((i) => /^s06_|^s07_|c4d_|c13i_|c10i_/.test(i)), "pas de branche optionnelle");
assert.ok(ids(r).includes("c2_gardien_still") && ids(r).includes("c17_adieu_confiance") && ids(r).includes("s08_reponse_seule"));

// 2. Branche Draven : variante de Lineva correcte, pas d’Iriana.
r = C.select({ flags: { ...base, s06LinevaWords: "mere", s06DravenComplete: true, c18PlayedIriana: true } });
assert.ok(ids(r).includes("s06_lineva_mere") && !ids(r).some((i) => i.startsWith("s07_")));
// Le marqueur « déjà jouée » seul ne prouve rien.
r = C.select({ flags: { ...base, c18PlayedDraven: true, finaleSeenDraven: true } });
assert.ok(!ids(r).some((i) => i.startsWith("s06_")));
// Variante sans achèvement de la branche (Game Over puis abandon) : rien.
r = C.select({ flags: { ...base, s06LinevaWords: "promesse" } });
assert.ok(!ids(r).some((i) => i.startsWith("s06_")));

// 3. Branche Iriana : renversement, y compris la variante « tresse ».
r = C.select({ flags: { ...base, s07Garde: "esprit", s07Renversement: "tresse", s07IrianaComplete: true } });
assert.ok(ids(r).includes("s07_renversement_tresse"));

// 4. Deux branches : les deux, dans l’ordre, sans doublon.
r = C.select({ flags: { ...base, s06LinevaWords: "fierte", s06DravenComplete: true, s07Renversement: "question", s07IrianaComplete: true } });
const i6 = ids(r).indexOf("s06_lineva_fierte"), i7 = ids(r).indexOf("s07_renversement_question");
assert.ok(i6 >= 0 && i7 > i6);
assert.equal(new Set(r.map((x) => x.group)).size, r.length, "une entrée par groupe");

// 5. Deux réponses s08Reponse : textes différents, une entrée par groupe.
const a = C.select({ flags: { ...base, s08Reponse: "seule" } }).find((x) => x.group === "s08_reponse");
const b = C.select({ flags: { ...base, s08Reponse: "main" } }).find((x) => x.group === "s08_reponse");
assert.ok(a && b && a.text !== b.text);

// 6. Duel réessayé : les manches remises à zéro ne produisent aucun souvenir.
r = C.select({ flags: { ...base, s04M1: null, s04M2: "bad", s04Qte: null } });
assert.ok(!ids(r).some((i) => /s04/.test(i)));

// 7. Sauvegarde ancienne / flags absents : pas d’erreur, rétrospective courte, aucun choix inventé.
assert.deepEqual(C.select({}), []);
assert.deepEqual(C.select(null), []);
assert.deepEqual(C.select({ flags: { chapter10IrianaComplete: true, chapter13IComplete: true, chapter4DComplete: true } }), [], "un chapitre débloqué n’est pas une scène vécue");
r = C.select({ flags: { s08BlizzardComplete: true, s02PorteNoireComplete: true } });
assert.deepEqual(ids(r), ["commun_porte_noire", "commun_blizzard"]);
// Valeur inconnue : ignorée.
assert.ok(!ids(C.select({ flags: { wolfApproach: "danse" } })).length);

// 8. Plafond, répartition et déterminisme.
const many = {};
for (const e of C.ENTRIES) for (const [k, v] of Object.entries(e.requires.flags)) if (!(k in many)) many[k] = v;
r = C.select({ flags: many });
assert.ok(r.length <= C.MAX_ENTRIES && r.length >= 10);
assert.deepEqual(ids(r), ids(C.select({ flags: { ...many } })));
assert.deepEqual(r.map((x) => x.order), [...r.map((x) => x.order)].sort((x, y) => x - y), "ordre narratif");

// 9. Capture : figée, relue sans recalcul.
const cap = C.capture({ flags: base }, { game: "v0.429", provenance: "partie" });
assert.equal(cap.v, 1); assert.equal(cap.catalog, C.CATALOG_VERSION);
assert.deepEqual(ids(cap.entries), ids(C.select({ flags: base })));
assert.ok(!("tome1Complete" in cap.evidence) && cap.evidence.wolfApproach === "still", "preuves strictement nécessaires");

// 10. v2 : la chronique complète, chapitre par chapitre (scènes synthétiques au format du moteur).
const scenes = {
  p01: { title: "Le réveil", choices: [{ label: "Se lever", next: "p02" }] },
  s02: { title: "La rivière", choices: [{ label: "Suivre la rivière", next: "s03" }, { label: "Rester au camp", next: "s03" }] },
  c2_05: { title: "Le ruisseau", choices: [{ label: "Observer le ruisseau", flags: { streamAngle: "fear" }, next: "c2_06" }, { label: "Autre", flags: { streamAngle: "joy" }, next: "c2_06" }] },
  c3_20: { title: "La boutique", choices: [{ label: "Choisir la robe bleue", flags: { robeBleueVue: true }, memories: ["remerii_robe_assurance"], next: "c3_21" }, { label: "Partir", next: "c3_21" }] },
  c3_30: { title: "Ambigu", choices: [{ label: "A", flags: { ambigu: true }, next: "x" }, { label: "B", flags: { ambigu: true }, next: "x" }] },
  c12g_choice: { title: "Chapitre XII_G · Le bal", choices: [{ label: "Choix stratégique : danser", flags: { c12gDanse: "oui" }, next: "y" }, { label: "Non", next: "y" }] },
  c17_gameover_a: { title: "Game Over", choices: [{ label: "Réessayer le duel", next: "c17_m1" }, { label: "Retour au menu", next: "menu" }] },
  c18_bh_dragon: { title: "Le dragon", choices: [{ label: "L’attraper au vol", flags: { s08Dragon: "tenir" }, next: "z" }, { label: "Viser la gorge", flags: { s08Dragon: "gorge" }, next: "z" }] },
};
const memoryDefs = { remerii_robe_assurance: { title: "Remerii se souviendra de cette assurance", body: "Hylee a cessé de disparaître.", type: "Remerii" } };
const ctx = { scenes, memoryDefs, chapters: [], trail: [["s02", "Suivre la rivière"], ["c17_gameover_a", "Réessayer le duel"]], journal: [] };
const v2 = C.captureV2({ flags: { streamAngle: "fear", robeBleueVue: true, ambigu: true, c12gDanse: "oui", s08Dragon: "tenir", s08BlizzardComplete: true, chapter4DComplete: true }, memories: ["remerii_robe_assurance", "inconnu"] }, ctx, { provenance: "partie" });
assert.deepEqual(v2.chapters.map((c) => c.key), ["ch1", "ch2", "ch3", "ch12_g", "ch18"], "générique : structure chapitre par chapitre");
const rep1 = v2.chapters[0].items;
assert.ok(rep1.length === 1 && rep1[0].label === "Suivre la rivière" && rep1[0].repere, "repère : un chapitre sans choix marquant garde sa première décision prouvée");
const minor = C.captureV2({ flags: { streamAngle: "fear" }, memories: [] }, { scenes: { ...scenes, c2_99: { title: "Berge", choices: [{ label: "Rester sur la berge", next: "c2_100" }, { label: "Partir", next: "c2_100" }] } }, trail: [["c2_99", "Rester sur la berge"]] });
assert.ok(!minor.chapters.flatMap((c) => c.items).some((i) => i.label === "Rester sur la berge"), "générique : choix mineur écarté quand le chapitre a déjà un souvenir");
assert.ok(minor.complet.flatMap((c) => c.items).some((i) => i.label === "Rester sur la berge"), "Ma Chronique : choix mineur gardé");
assert.deepEqual(v2.complet.map((c) => c.key), ["ch1", "ch2", "ch3", "ch12_g", "ch18"], "Ma Chronique : tout le parcours, dans l’ordre du livre");
assert.ok(v2.complet.flatMap((c) => c.items).some((i) => i.kind === "choix" && i.label === "Suivre la rivière" && i.how === "parcours"), "Ma Chronique : choix cliqué (journal de parcours)");
const all = v2.chapters.flatMap((c) => c.items);
assert.ok(all.some((i) => i.kind === "choix" && i.label === "Choisir la robe bleue" && i.how === "flag"), "choix reconstitué par un flag à libellé unique");
assert.ok(all.some((i) => i.kind === "choix" && i.label === "danser"), "préfixe « Choix stratégique » retiré");
assert.ok(!all.some((i) => i.kind === "choix" && /^(A|B)$/.test(i.label)), "flag ambigu (deux libellés) : rien");
assert.ok(!all.some((i) => /Réessayer|Retour/.test(i.label || "")), "pas de navigation ni de Game Over");
assert.ok(all.some((i) => i.kind === "souvenir" && i.id === "c2_ruisseau_fear"), "souvenir illustré du catalogue");
assert.ok(!all.some((i) => i.kind === "choix" && i.scene === "c2_05"), "le souvenir illustré remplace la ligne de choix de la même scène");
assert.ok(all.some((i) => i.kind === "souvenir" && i.id === "s08_dragon_tenir"));
assert.ok(all.some((i) => i.kind === "memoire" && i.title.startsWith("Remerii se souviendra")) && !all.some((i) => i.id === "inconnu"), "souvenirs de Progression connus seulement");
assert.equal(v2.counts.rubriques, all.length);
// Pas de plafond : un parcours très riche est retranscrit entièrement.
const big = {}; const trail = [];
for (let i = 0; i < 140; i++) { big[`c${2 + (i % 17)}_d${i}`] = { title: "Scène " + i, choices: [{ label: "Choix " + i, next: "n" }, { label: "Autre " + i, next: "n" }] }; trail.push([`c${2 + (i % 17)}_d${i}`, "Choix " + i]); }
const full = C.captureV2({ flags: many, memories: [] }, { scenes: big, memoryDefs: {}, chapters: [], trail, journal: [] });
assert.ok(full.countsComplet.rubriques >= 140 + C.selectAll({ flags: many }).filter((x) => !x.common).length, "aucune troncature : " + full.counts.rubriques);
// Choix marquants : poids déterministe et plafond par chapitre pour le générique.
const routeScene = { title: "Croisée", choices: [{ label: "Suivre Draven", flags: { route4DStarted: true }, next: "c4d_01" }, { label: "Suivre Valurn", flags: { route4VStarted: true }, next: "c4v_01" }] };
assert.ok(C.markWeight("c4_00", routeScene, "Suivre Draven") >= 100, "branche de route");
assert.equal(C.markWeight("s02", scenes.s02, "Suivre la rivière"), 0, "choix sans flag ni souvenir : mineur");
assert.ok(C.markWeight("c3_20", scenes.c3_20, "Choisir la robe bleue") > C.markWeight("c3_30", scenes.c3_30, "A"), "souvenir accordé plus lourd qu’un flag simple");
const heavy = {}; const heavyTrail = []; const heavyFlags = {};
for (let i = 0; i < 9; i++) { heavy[`c5_h${i}`] = { title: "S" + i, choices: [{ label: "Décision " + i, flags: { ["c5h" + i]: i % 2 ? "x" : true }, next: "n" }, { label: "Non " + i, next: "n" }] }; heavyTrail.push([`c5_h${i}`, "Décision " + i]); }
const capped = C.captureV2({ flags: heavyFlags, memories: [] }, { scenes: heavy, trail: heavyTrail });
assert.equal(capped.chapters[0].items.filter((x) => x.kind === "choix").length, C.MAX_DECISIONS_PER_CHAPTER, "plafond par chapitre dans le générique");
assert.ok(capped.chapters[0].items.every((x) => x.weight === 40), "les plus lourdes d’abord (valeur texte)");
assert.equal(capped.complet[0].items.length, 9, "Ma Chronique garde tout");
assert.deepEqual(capped.chapters, C.captureV2({ flags: heavyFlags, memories: [] }, { scenes: heavy, trail: heavyTrail }).chapters, "déterministe");

// Ancienne sauvegarde sans aucune preuve : rien d’inventé.
assert.deepEqual(C.captureV2({ flags: {}, memories: [] }, { scenes }).chapters, []);
assert.equal(C.chapterOf("c13i_x"), "ch13_i"); assert.equal(C.chapterOf("x12i_a"), "ch12_i"); assert.equal(C.chapterOf("c4d_07"), "ch4"); assert.equal(C.chapterOf("intro_wake"), "intro"); assert.equal(C.chapterOf("s14_bow"), "ch1");

console.log("story-generique : ok (" + C.ENTRIES.length + " souvenirs au catalogue, " + new Set(C.ENTRIES.map((e) => e.group)).size + " groupes)");
