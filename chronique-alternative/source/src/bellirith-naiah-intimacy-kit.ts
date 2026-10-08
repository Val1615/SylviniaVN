import type { DialogueLine } from "./game-data";
import type { IntimacyMode, PlayerSex } from "./date-scenes";

/**
 * Format des scènes intimes de la quête croisée Bellirith / Naïah.
 *
 * Ces scènes restent volontairement hors du catalogue des routes Bellirith
 * (bellirith-diversion-intimacy.ts) : elles appartiennent à la série croisée,
 * s’ouvrent uniquement après une acceptation explicite dans le dialogue et
 * portent leurs propres règles (exception de Q5 comprise).
 *
 * Les helpers ci-dessous ne fabriquent aucune phrase : ils ne font que
 * transporter des lignes écrites à la main et choisir la variante corporelle.
 */

export type BNSpeaker = "B" | "Y" | "P";
export type BNLine = string | readonly [speaker: BNSpeaker, text: string, mood?: string];
/** Variante selon le corps du protagoniste : femme, homme, intersexe. */
export type BNSexVariant = { readonly sx: readonly [femme: BNLine, homme: BNLine, intersexe: BNLine] };
export type BNRaw = BNLine | BNSexVariant;
export type BNChapter = readonly BNRaw[];

export type BNIntimacyScene = {
  id: "bn-first" | "bn-limit" | "bn-simulation";
  title: string;
  detail: string;
  background: string;
  music: string;
  /** Q5 seulement : CG plein écran au dévoilement et au faux sommet. */
  cg?: { reveal: string; climax: string };
  /** Index (mode explicite) de la séquence où la nudité est dévoilée. */
  revealChapter: number;
  /** Index (mode explicite) de la séquence du sommet affiché, si une CG l’accompagne. */
  climaxChapter?: number;
  /** Exception narrative de Q5 : présente uniquement dans la scène « bn-simulation ». */
  penetrationException?: boolean;
  opening: BNChapter;
  chapters: Record<IntimacyMode, readonly BNChapter[]>;
  /** Humeurs intimes par séquence explicite, une par partenaire. */
  explicitMoods: { bellirith: readonly string[]; naiah: readonly string[] };
};

export const X = (femme: BNLine, homme: BNLine, intersexe: BNLine): BNSexVariant => ({ sx: [femme, homme, intersexe] });
export const b = (text: string, mood = "teasing"): BNLine => ["B", text, mood] as const;
export const y = (text: string, mood = "smirk"): BNLine => ["Y", text, mood] as const;
export const p = (text: string): BNLine => ["P", text] as const;

const SPEAKERS: Record<BNSpeaker, string> = { B: "Bellirith", Y: "Naïah", P: "{player}" };
const SEX_INDEX: Record<PlayerSex, 0 | 1 | 2> = { femme: 0, homme: 1, intersexe: 2 };

function isVariant(raw: BNRaw): raw is BNSexVariant {
  return typeof raw === "object" && !Array.isArray(raw) && "sx" in raw;
}

export function bnLine(raw: BNRaw, sex: PlayerSex): DialogueLine {
  const line = isVariant(raw) ? raw.sx[SEX_INDEX[sex] ?? 0] : raw;
  if (typeof line === "string") return { speaker: "Narration", text: line };
  const [speaker, text, mood] = line as readonly [BNSpeaker, string, string?];
  return { speaker: SPEAKERS[speaker], text, ...(mood ? { mood } : {}) };
}

/** Séquences jouables pour un mode et un corps, avec les humeurs intimes de chaque partenaire. */
export function bnRenderChapters(scene: BNIntimacyScene, mode: IntimacyMode, sex: PlayerSex): DialogueLine[][] {
  return scene.chapters[mode].map((chapter, index) => chapter.map((raw) => {
    const line = bnLine(raw, sex);
    if (mode !== "explicite") return line;
    return { ...line, intimateMoods: { bellirith: scene.explicitMoods.bellirith[index], naiah: scene.explicitMoods.naiah[index] } };
  }));
}

export function bnRenderOpening(scene: BNIntimacyScene, sex: PlayerSex): DialogueLine[] {
  return scene.opening.map((raw) => bnLine(raw, sex));
}

/** Toutes les lignes possibles d’une scène (validateurs). */
export function bnAllLines(scene: BNIntimacyScene): DialogueLine[] {
  const sexes: PlayerSex[] = ["femme", "homme", "intersexe"];
  const modes: IntimacyMode[] = ["tendre", "suggestif", "explicite", "ellipse"];
  return sexes.flatMap((sex) => [...bnRenderOpening(scene, sex), ...modes.flatMap((mode) => bnRenderChapters(scene, mode, sex).flat())]);
}

export type BNVisual = { cg?: { phase: "reveal" | "post-orgasm"; src: string }; nude: boolean };

/**
 * Règle visuelle : rien d’intime hors du mode explicite. En explicite, les
 * sprites restent habillés avant le dévoilement, la CG (Q5) couvre le
 * dévoilement et le faux sommet, et les sprites intimes prennent le relais ensuite.
 */
export function bnVisualState(scene: BNIntimacyScene, mode: IntimacyMode, step: "opening" | "chapters" | "done", chapter: number): BNVisual {
  if (mode !== "explicite") return { nude: false };
  if (step === "opening") return { nude: false };
  if (step === "done") return { nude: true };
  if (chapter < scene.revealChapter) return { nude: false };
  if (chapter === scene.revealChapter && scene.cg) return { cg: { phase: "reveal", src: scene.cg.reveal }, nude: false };
  if (scene.climaxChapter !== undefined && chapter === scene.climaxChapter && scene.cg) return { cg: { phase: "post-orgasm", src: scene.cg.climax }, nude: false };
  return { nude: true };
}
