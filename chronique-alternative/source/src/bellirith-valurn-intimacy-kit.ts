import type { DialogueLine } from "./game-data";
import type { IntimacyMode, PlayerSex } from "./date-scenes";

/**
 * Format des intimités de la quête croisée Bellirith / Valurn.
 *
 * Règle canonique absolue : Bellirith et Valurn sont demi-frère et demi-sœur.
 * Aucune scène ne les réunit dans un moment intime. La voie C enchaîne deux
 * moments privés séparés, l’un après l’autre, selon les règles du joueur.
 *
 * Une scène = une voie et un corps. Chaque mode compte au moins douze
 * séquences, et chaque séquence explicite porte une position nommée
 * (contrôlée par le validateur pour la variété et la densité).
 */

export type BVSpeaker = "B" | "V" | "P";
export type BVLine = string | readonly [speaker: BVSpeaker, text: string, mood?: string];
export type BVChapter = readonly BVLine[];
export type BVVoie = "a" | "b" | "c";

export type BVIntimacyScene = {
  id: `bv-${BVVoie}-${PlayerSex}`;
  voie: BVVoie;
  sex: PlayerSex;
  title: string;
  detail: string;
  background: string;
  music: string;
  /** Index de la séquence explicite où la nudité est dévoilée. */
  revealChapter: number;
  opening: BVChapter;
  chapters: Record<IntimacyMode, readonly BVChapter[]>;
  /** Position (ou geste dominant) de chaque séquence explicite, dans l’ordre. */
  positions: readonly string[];
  /** Humeurs intimes de Bellirith par séquence explicite ("" = elle n’est pas là). */
  bellirithMoods: readonly string[];
};

export const b = (text: string, mood = "teasing"): BVLine => ["B", text, mood] as const;
export const v = (text: string, mood = "charming"): BVLine => ["V", text, mood] as const;
export const p = (text: string): BVLine => ["P", text] as const;

const SPEAKERS: Record<BVSpeaker, string> = { B: "Bellirith", V: "Valurn", P: "{player}" };

export function bvLine(raw: BVLine): DialogueLine {
  if (typeof raw === "string") return { speaker: "Narration", text: raw };
  const [speaker, text, mood] = raw;
  return { speaker: SPEAKERS[speaker], text, ...(mood ? { mood } : {}) };
}

export function bvRenderChapters(scene: BVIntimacyScene, mode: IntimacyMode): DialogueLine[][] {
  return scene.chapters[mode].map((chapter, index) => chapter.map((raw) => {
    const line = bvLine(raw);
    const mood = scene.bellirithMoods[index];
    if (mode !== "explicite" || !mood || index < scene.revealChapter) return line;
    return { ...line, intimateMoods: { bellirith: mood } };
  }));
}

export function bvRenderOpening(scene: BVIntimacyScene): DialogueLine[] {
  return scene.opening.map(bvLine);
}

export function bvAllIntimacyLines(scene: BVIntimacyScene): DialogueLine[] {
  const modes: IntimacyMode[] = ["tendre", "suggestif", "explicite", "ellipse"];
  return [...bvRenderOpening(scene), ...modes.flatMap((mode) => bvRenderChapters(scene, mode).flat())];
}

/** Sprites intimes : explicite seulement, après le dévoilement, Bellirith seulement (Valurn n’en a pas). */
export function bvIntimateVisible(scene: BVIntimacyScene, mode: IntimacyMode, chapter: number) {
  return mode === "explicite" && chapter >= scene.revealChapter && Boolean(scene.bellirithMoods[chapter]);
}
