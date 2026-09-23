import type { DialogueLine } from "./game-data";
import type { IntimacyMode, PlayerSex } from "./date-scenes";
import type { GroupIntimacyRoute } from "./group-dates";

export const N = (text: string): DialogueLine => ({ speaker: "Narration", text });
export const H = (text: string, mood = "soft"): DialogueLine => ({ speaker: "Hylee", text, mood });
export const R = (text: string, mood = "calm"): DialogueLine => ({ speaker: "Remerii", text, mood });
export const P = (text: string): DialogueLine => ({ speaker: "{player}", text });

export type HRManualSeed = {
  slug: string;
  labels: Record<PlayerSex, string>;
  detail: string;
  tendre: DialogueLine[][];
  suggestif: DialogueLine[][];
  explicite: Record<PlayerSex, DialogueLine[][]>;
  ellipse: DialogueLine[][];
  climax: Record<IntimacyMode, number>;
  revealChapter?: number;
  postOrgasmChapter?: number;
};

export function manualHRRoutes(
  contextId: string,
  seeds: HRManualSeed[],
): Record<PlayerSex, GroupIntimacyRoute[]> {
  return Object.fromEntries((["femme", "homme", "intersexe"] as PlayerSex[]).map((sex) => [
    sex,
    seeds.map((seed) => ({
      id: `${contextId}-${sex}-${seed.slug}`,
      text: seed.labels[sex],
      detail: seed.detail,
      manual: true as const,
      progression: {
        playerClimaxChapter: seed.climax,
        revealChapter: seed.revealChapter ?? 4,
        postOrgasmChapter: seed.postOrgasmChapter ?? 10,
      },
      chapters: {
        tendre: seed.tendre,
        suggestif: seed.suggestif,
        explicite: seed.explicite[sex],
        ellipse: seed.ellipse,
      },
    })),
  ])) as Record<PlayerSex, GroupIntimacyRoute[]>;
}
