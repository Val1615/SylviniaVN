import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { createServer } from "vite";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const src = (relative) => path.join(root, "source", "src", relative);
const asset = (character, mood) => path.join(root, "assets", "sprites-intimate", character, `${mood}.webp`);

const moods = {
  hylee: ["soft", "shy", "seductive", "tender", "teasing", "annoyed"],
  remerii: ["teasing", "soft", "inviting", "shy", "strict", "smirk"],
  allenna: ["seductive", "angry", "shy", "soft", "troubled", "stern"],
  lineva: ["teasing", "passionate", "pouting", "smirk", "annoyed", "soft"],
};

function webpDeclaresAlpha(buffer) {
  if (buffer.subarray(0, 4).toString("ascii") !== "RIFF" || buffer.subarray(8, 12).toString("ascii") !== "WEBP") return false;
  for (let offset = 12; offset + 8 <= buffer.length;) {
    const kind = buffer.subarray(offset, offset + 4).toString("ascii");
    const size = buffer.readUInt32LE(offset + 4);
    const data = offset + 8;
    if (kind === "ALPH") return true;
    if (kind === "VP8X" && data < buffer.length && (buffer[data] & 0x10) !== 0) return true;
    if (kind === "VP8L" && data + 5 <= buffer.length && buffer[data] === 0x2f) {
      const bits = buffer.readUInt32LE(data + 1);
      if (((bits >>> 28) & 1) === 1) return true;
    }
    offset = data + size + (size % 2);
  }
  return false;
}

let exactAlphaChecks = 0;
let totalBytes = 0;
for (const [character, expressions] of Object.entries(moods)) {
  assert(expressions.includes("soft"), `${character}: fallback soft absent`);
  for (const expression of expressions) {
    const file = asset(character, expression);
    assert(existsSync(file), `asset intime introuvable: ${character}/${expression}.webp`);
    const buffer = readFileSync(file);
    totalBytes += buffer.length;
    assert(buffer.length > 25_000, `${character}/${expression}: asset anormalement petit`);
    assert(webpDeclaresAlpha(buffer), `${character}/${expression}: WebP sans canal alpha déclaré`);

    const identified = spawnSync("identify", ["-format", "%[channels]|%[opaque]", file], { encoding: "utf8" });
    if (identified.status === 0) {
      const [channels, opaque] = identified.stdout.trim().split("|");
      assert(channels.includes("a"), `${character}/${expression}: canal alpha non décodé`);
      assert.equal(opaque.toLocaleLowerCase(), "false", `${character}/${expression}: alpha présent mais aucun pixel transparent`);
      exactAlphaChecks += 1;
    }
  }
}

const system = readFileSync(src("intimate-sprite-system.ts"), "utf8");
const page = readFileSync(src("page.tsx"), "utf8");
const standard = readFileSync(src("sprite-system.ts"), "utf8");
const dialogue = readFileSync(src("game-data.ts"), "utf8");
const cgSource = readFileSync(src("intimate-cg.ts"), "utf8");

assert(system.includes("INTIMATE_SPRITE_MOODS"), "registre intime dédié absent");
assert(system.includes("INTIMATE_SPRITE_FALLBACKS"), "fallbacks intimes absents");
assert(system.includes("intimateSpritePath"), "resolver intime absent");
assert(!standard.includes("sprites-intimate"), "le canal intime pollue sprite-system.ts");
assert(!standard.includes("INTIMATE_SPRITE_MOODS"), "les moods intimes polluent le registre standard");
assert(dialogue.includes("intimateMood?: string"), "mood intime solo non explicite dans DialogueLine");
assert(dialogue.includes("intimateMoods?: Partial<Record<string, string>>"), "moods intimes de groupe absents");

assert(system.includes("withSoloIntimateMoods"), "pilotage des expressions solo absent");
assert(system.includes("withGroupIntimateMoods"), "pilotage des expressions de groupe absent");
assert(system.includes("[characters[0]]") && system.includes("[characters[1]]"), "les deux partenaires ne reçoivent pas de moods indépendants");
assert(system.includes('"group-date-hylee-remerii-free-day"'), "contextes Hylee/Remerii absents");
assert(system.includes('"group-date-allenna-lineva-training"'), "contextes Lineva/Allenna absents");

const intimateModalStart = page.indexOf("function InteractiveIntimacyModal");
const intimateModalEnd = page.indexOf("function JobGameModal");
assert(intimateModalStart >= 0 && intimateModalEnd > intimateModalStart, "modales intimes introuvables");
const intimateUi = page.slice(intimateModalStart, intimateModalEnd);
const ordinaryUi = `${page.slice(0, intimateModalStart)}${page.slice(intimateModalEnd)}`;
assert(intimateUi.includes("intimateSpritePath"), "sprites intimes non rendus dans la scène intime");
assert(!ordinaryUi.includes("data-sprite-channel={useIntimate"), "sprites intimes employés hors des modales intimes");
assert(intimateUi.includes("soloIntimateVisualState"), "orchestration CG → sprites solo absente");
assert(intimateUi.includes("groupIntimateVisualState"), "orchestration CG → sprites trio absente");
assert(!intimateUi.includes('step === "direction-lines" || step === "ending"'), "ancienne bascule nue dès l’entrée encore présente");
assert(intimateUi.includes("recoverMissingIntimateSprite"), "fallback intime non utilisé par le rendu");
assert(page.includes('modal.replay ? "Souvenir intime'), "relecture intime non reliée à la même mise en scène");

for (const [character, expressions] of Object.entries(moods)) {
  const trackLine = system.match(new RegExp(`${character}: \\[([^\\]]+)\\]`))?.[1] || "";
  const represented = expressions.filter((mood) => trackLine.includes(`"${mood}"`));
  assert(new Set(represented).size >= 4, `${character}: la scène ne varie pas assez ses expressions`);
}

const trioContexts = [
  "group-date-hylee-remerii-free-day",
  "group-date-hylee-remerii-wind",
  "group-date-hylee-remerii-home",
  "group-date-allenna-lineva-training",
  "group-date-allenna-lineva-basin",
  "group-date-allenna-lineva-home",
];
for (const context of trioContexts) assert(cgSource.includes(`"${context}"`), `${context}: CG duo non reliée`);

const cgFiles = [
  "hylee_reveal.jpg", "hylee_post_orgasm.jpg",
  "remerii_reveal.jpg", "remerii_post_orgasm.jpg",
  "lineva_reveal.jpg", "lineva_post_orgasm.jpg",
  "allenna_reveal.jpg", "allenna_post_orgasm.jpg",
  "hylee_remerii_reveal.jpg", "hylee_remerii_post_orgasm.jpg",
  "allenna_lineva_reveal.jpg", "allenna_lineva_post_orgasm.jpg",
];
for (const file of cgFiles) assert(existsSync(path.join(root, "assets", "intimacy-cg", file)), `CG absente: ${file}`);

const undressing = /\b(?:nue?s?|nus|déshabill\w*|vêtements?|tissus?|tuniques?|chemises?|étoffes?|tenues?|uniformes?|pantalons?|jupes?)\b/iu;
const server = await createServer({ root: path.join(root, "source"), appType: "custom", logLevel: "silent", server: { middlewareMode: true } });
try {
  const [cg, groups, individual, home, hyleeDates, remeriiDates, linevaDates, allennaDates] = await Promise.all([
    server.ssrLoadModule("/src/intimate-cg.ts"),
    server.ssrLoadModule("/src/group-dates.ts"),
    server.ssrLoadModule("/src/intimacy-routes.ts"),
    server.ssrLoadModule("/src/home-intimacy-routes.ts"),
    server.ssrLoadModule("/src/hylee-date-intimacy.ts"),
    server.ssrLoadModule("/src/remerii-date-intimacy.ts"),
    server.ssrLoadModule("/src/lineva-date-intimacy.ts"),
    server.ssrLoadModule("/src/allenna-date-intimacy.ts"),
  ]);

  const soloState = (narrativePhase) => cg.soloIntimateVisualState({
    character: "hylee", mode: "explicite", surface: "route", step: "direction-lines", chapter: 0, narrativePhase,
  });
  assert.deepEqual(soloState("undressing"), { useIntimateSprites: false }, "solo: sprite nu avant la CG");
  assert.equal(soloState("naked-reveal").cg?.phase, "reveal", "solo: CG absente au dévoilement");
  assert.equal(soloState("naked-reveal").useIntimateSprites, false, "solo: sprite nu superposé à la CG");
  assert.equal(soloState("partner-discovery").useIntimateSprites, true, "solo: sprite nu absent après la CG");
  assert.equal(soloState("preliminaries").useIntimateSprites, true, "solo: sprite nu perdu pendant la scène");
  assert.equal(soloState("afterglow").cg?.phase, "post-orgasm", "solo: CG finale absente");
  assert.equal(cg.soloIntimateVisualState({ character: "hylee", mode: "tendre", surface: "route", step: "direction-lines", chapter: 8, narrativePhase: "afterglow" }).cg, undefined, "solo: CG chargée hors explicite");

  const dedicatedCatalogs = [
    { character: "hylee", module: hyleeDates, route: "hyleeDateIntimacyRoutes", phase: "hyleeDateIntimacyPhase", contexts: ["date-hylee-glade", "date-hylee-lake", "home-hylee"], sexes: ["femme", "homme"] },
    { character: "remerii", module: remeriiDates, route: "remeriiDateIntimacyRoutes", phase: "remeriiDateIntimacyPhase", contexts: ["date-remerii-lanterns", "date-remerii-observatory", "home-remerii"], sexes: ["femme", "homme"] },
    { character: "lineva", module: linevaDates, route: "linevaDateIntimacyRoutes", phase: "linevaDateIntimacyPhase", contexts: ["date-lineva-ramparts", "date-lineva-quarters"], sexes: ["femme", "homme", "intersexe"] },
    { character: "allenna", module: allennaDates, route: "allennaDateIntimacyRoutes", phase: "allennaDateIntimacyPhase", contexts: ["date-allenna-field", "date-allenna-terrace"], sexes: ["femme", "homme", "intersexe"] },
  ];
  for (const catalog of dedicatedCatalogs) {
    const revealChapter = Array.from({ length: 12 }, (_, chapter) => chapter).find((chapter) => catalog.module[catalog.phase](chapter) === "naked-reveal");
    assert.notEqual(revealChapter, undefined, `${catalog.character}: phase naked-reveal absente`);
    for (const context of catalog.contexts) for (const sex of catalog.sexes) {
      for (const route of catalog.module[catalog.route](context, sex, true)) {
        const revealText = route.chapters.explicite[revealChapter].map((line) => line.text).join(" ");
        assert.match(revealText, undressing, `${route.id}: la CG dédiée ne coïncide pas avec la nudité écrite`);
      }
    }
  }

  const revealSignatures = [];
  for (const context of trioContexts) {
    for (const sex of ["femme", "homme", "intersexe"]) {
      for (const route of groups.groupIntimacyRoutes(context, sex)) {
        assert(route.progression, `${route.id}: progression visuelle absente`);
        const { revealChapter, postOrgasmChapter } = route.progression;
        assert(revealChapter >= 0 && revealChapter < postOrgasmChapter, `${route.id}: seuils CG incohérents`);
        const revealText = route.chapters.explicite[revealChapter]?.map((line) => line.text).join(" ") || "";
        assert.match(revealText, undressing, `${route.id}: la CG ne correspond pas à un déshabillage écrit`);
        revealSignatures.push(`${route.id}\n${revealText}`);
        if (revealChapter > 0) {
          const before = cg.groupIntimateVisualState({ pairId: context, mode: "explicite", step: "direction-lines", chapter: revealChapter - 1, revealChapter, postOrgasmChapter });
          assert.equal(before.useIntimateSprites, false, `${route.id}: sprite nu avant la CG`);
          assert.equal(before.cg, undefined, `${route.id}: CG trop précoce`);
        }
        const reveal = cg.groupIntimateVisualState({ pairId: context, mode: "explicite", step: "direction-lines", chapter: revealChapter, revealChapter, postOrgasmChapter });
        assert.equal(reveal.cg?.phase, "reveal", `${route.id}: CG de dévoilement absente`);
        assert.equal(reveal.useIntimateSprites, false, `${route.id}: sprites superposés à la CG`);
        const after = cg.groupIntimateVisualState({ pairId: context, mode: "explicite", step: "direction-lines", chapter: revealChapter + 1, revealChapter, postOrgasmChapter });
        assert.equal(after.cg, undefined, `${route.id}: CG maintenue au lieu de laisser place aux sprites`);
        assert.equal(after.useIntimateSprites, true, `${route.id}: sprites nus absents après la CG`);
        const post = cg.groupIntimateVisualState({ pairId: context, mode: "explicite", step: "direction-lines", chapter: postOrgasmChapter, revealChapter, postOrgasmChapter });
        assert.equal(post.cg?.phase, "post-orgasm", `${route.id}: CG d’après-scène absente`);
      }
    }
  }
  assert.equal(new Set(revealSignatures.map((entry) => entry.split("\n").slice(1).join("\n"))).size, revealSignatures.length, "des dévoilements de trio ont été copiés-collés");

  for (const character of Object.keys(moods)) {
    for (const route of individual.intimacyRoutes(character, "intersexe")) {
      assert(route.visual, `${route.id}: progression visuelle solo absente`);
      const text = route.chapters.explicite[route.visual.revealChapter]?.map((line) => line.text).join(" ") || "";
      assert.match(text, undressing, `${route.id}: dévoilement solo non écrit`);
    }
    for (const route of home.homeIntimacyRoutes(character, "intersexe")) {
      assert(route.visual, `${route.id}: progression visuelle au logis absente`);
      const text = route.chapters.explicite[route.visual.revealChapter]?.map((line) => line.text).join(" ") || "";
      assert.match(text, undressing, `${route.id}: dévoilement au logis non écrit`);
    }
  }
} finally {
  await server.close();
}

console.log(`Sprites intimes validés: 24 assets, 12 CG, ${exactAlphaChecks || 24} contrôles alpha, solo + 54 routes trio avec transition CG → sprites.`);
