import type { DialogueLine } from "./game-data";
import type { IntimacyMode, PlayerSex } from "./date-scenes";
import type { GroupIntimacyRoute } from "./group-dates";

/**
 * Hylee / Naïah / {player} : outils des continuations intimes manuelles.
 *
 * Aucun générateur : chaque séquence est écrite à la main. Une séquence peut être
 * commune aux trois corps (jeu, chatouilles, retournements autour de Naïah,
 * retombée) ou propre au sexe du joueur (montée sexuelle, essais de Naïah,
 * culmination). Le constructeur ne fait que choisir la bonne variante.
 */
export type HNMotherOutcome = "killed" | "memory-erased" | "vegetative";
export type HNSeq = DialogueLine[];
export type HNSexSeq = { femme: HNSeq; homme: HNSeq; intersexe: HNSeq };
export type HNSlot = HNSeq | HNSexSeq;

export const N = (text: string): DialogueLine => ({ speaker: "Narration", text });
export const H = (text: string, mood = "teasing"): DialogueLine => ({ speaker: "Hylee", text, mood });
export const A = (text: string, mood = "smirk"): DialogueLine => ({ speaker: "Naïah", text, mood });
export const P = (text: string): DialogueLine => ({ speaker: "{player}", text });
export const S = (...lines: DialogueLine[]): HNSeq => lines;
export const X = (femme: HNSeq, homme: HNSeq, intersexe: HNSeq): HNSexSeq => ({ femme, homme, intersexe });

export type HNBranch = "H1" | "H2" | "H3" | "N1" | "N2" | "N3" | "L1" | "L2" | "L3";

export type HNSeed = {
  slug: string;
  branch: HNBranch;
  labels: Record<PlayerSex, string>;
  detail: string;
  tendre: HNSlot[];
  suggestif: HNSlot[];
  explicite: HNSlot[];
  ellipse: HNSlot[];
  /** Séquence où le plaisir du joueur culmine (ou se dissout dans l’ellipse). */
  climax: Record<IntimacyMode, number>;
  /** Séquence après laquelle une trace légère du destin de la mère peut s’insérer. */
  motherChapter: Record<IntimacyMode, number>;
  revealChapter: number;
  postOrgasmChapter: number;
};

export type HNRoute = GroupIntimacyRoute & {
  manual: true;
  hnBranch: HNBranch;
  motherTraceChapter: Record<IntimacyMode, number>;
};

const MODES: IntimacyMode[] = ["tendre", "suggestif", "explicite", "ellipse"];
const SEXES: PlayerSex[] = ["femme", "homme", "intersexe"];

function isSexSeq(slot: HNSlot): slot is HNSexSeq {
  return !Array.isArray(slot);
}

export function resolveHNSlots(slots: HNSlot[], sex: PlayerSex): HNSeq[] {
  return slots.map((slot) => (isSexSeq(slot) ? slot[sex] : slot));
}

export function buildHNRoutes(contextId: string, seeds: HNSeed[]): Record<PlayerSex, HNRoute[]> {
  return Object.fromEntries(SEXES.map((sex) => [
    sex,
    seeds.map((seed): HNRoute => ({
      id: `${contextId}-${sex}-${seed.slug}`,
      text: seed.labels[sex],
      detail: seed.detail,
      manual: true,
      hnBranch: seed.branch,
      motherTraceChapter: seed.motherChapter,
      progression: {
        playerClimaxChapter: seed.climax,
        revealChapter: seed.revealChapter,
        postOrgasmChapter: seed.postOrgasmChapter,
      },
      chapters: Object.fromEntries(MODES.map((mode) => [mode, resolveHNSlots(seed[mode], sex)])) as Record<IntimacyMode, DialogueLine[][]>,
    })),
  ])) as Record<PlayerSex, HNRoute[]>;
}
