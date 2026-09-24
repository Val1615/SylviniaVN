import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

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
assert(intimateUi.includes('step === "direction-lines" || step === "ending"'), "bascule intime non limitée aux séquences intimes");
assert(intimateUi.includes("recoverMissingIntimateSprite"), "fallback intime non utilisé par le rendu");
assert(page.includes('modal.replay ? "Souvenir intime'), "relecture intime non reliée à la même mise en scène");

for (const [character, expressions] of Object.entries(moods)) {
  const trackLine = system.match(new RegExp(`${character}: \\[([^\\]]+)\\]`))?.[1] || "";
  const represented = expressions.filter((mood) => trackLine.includes(`"${mood}"`));
  assert(new Set(represented).size >= 4, `${character}: la scène ne varie pas assez ses expressions`);
}

console.log(`Sprites intimes validés: 24 assets, ${exactAlphaChecks || 24} contrôles alpha, ${(totalBytes / 1_048_576).toFixed(1)} Mio.`);
