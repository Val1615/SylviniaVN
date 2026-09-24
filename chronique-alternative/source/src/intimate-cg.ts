import type { IntimacyMode } from "./date-scenes";
import type { LinevaIntimacyPhase } from "./lineva-date-intimacy";
import type { AllennaIntimacyPhase } from "./allenna-date-intimacy";
import type { HyleeIntimacyPhase } from "./hylee-date-intimacy";
import type { RemeriiIntimacyPhase } from "./remerii-date-intimacy";

export type IntimateCgPhase = "reveal" | "post-orgasm";
export type IntimateCgSurface = "route" | "home" | "group";

export type IntimateCgState = {
  phase: IntimateCgPhase;
  src: string;
};

export type IntimateVisualState = {
  cg?: IntimateCgState;
  useIntimateSprites: boolean;
};

const ROOT = "/assets/intimacy-cg";

export const SOLO_INTIMATE_CG: Record<string, { reveal: string; postOrgasm: string }> = Object.fromEntries(
  ["hylee", "remerii", "iriana", "tia", "valurn", "naiah", "lineva", "saidin", "bellirith", "amanea", "allenna", "draven"]
    .map((character) => [character, {
      reveal: `${ROOT}/${character}_reveal.jpg`,
      postOrgasm: `${ROOT}/${character}_post_orgasm.jpg`,
    }]),
);

const DUO_NAMES: Record<string, string> = {
  "group-date-hylee-remerii": "hylee_remerii",
  "group-date-valurn-bellirith": "valurn_bellirith",
  "group-date-iriana-valurn": "iriana_valurn",
  "group-date-hylee-naiah": "hylee_naiah",
  "group-date-remerii-iriana": "remerii_iriana",
  "group-date-naiah-bellirith": "naiah_bellirith",
  "group-date-tia-remerii": "tia_remerii",
  // Les CG sont des récompenses de révélation. Leur cadrage n'impose pas le
  // décor narratif : chaque rendez-vous choisit lui-même son instant d'effeuillage.
  "group-date-allenna-lineva-training": "allenna_lineva",
  "group-date-allenna-lineva-basin": "allenna_lineva",
  "group-date-allenna-lineva-home": "allenna_lineva",
  "group-date-hylee-remerii-free-day": "hylee_remerii",
  "group-date-hylee-remerii-wind": "hylee_remerii",
  "group-date-hylee-remerii-home": "hylee_remerii",
};

export const DUO_INTIMATE_CG: Record<string, { reveal: string; postOrgasm: string }> = Object.fromEntries(
  Object.entries(DUO_NAMES).map(([pairId, fileName]) => [pairId, {
    reveal: `${ROOT}/${fileName}_reveal.jpg`,
    postOrgasm: `${ROOT}/${fileName}_post_orgasm.jpg`,
  }]),
);

function stateFromAssets(assets: { reveal: string; postOrgasm: string } | undefined, phase?: IntimateCgPhase): IntimateCgState | undefined {
  if (!assets || !phase) return undefined;
  return { phase, src: phase === "reveal" ? assets.reveal : assets.postOrgasm };
}

const STANDARD_VISUAL: IntimateVisualState = { useIntimateSprites: false };

const BEFORE_REVEAL_PHASES = new Set(["approach", "undressing"]);
const AFTERGLOW_PHASES = new Set(["afterglow", "ending"]);

export function soloIntimateVisualState(options: {
  character: string;
  mode: IntimacyMode;
  surface: Exclude<IntimateCgSurface, "group">;
  step: string;
  chapter: number;
  narrativePhase?: LinevaIntimacyPhase | AllennaIntimacyPhase | HyleeIntimacyPhase | RemeriiIntimacyPhase;
  revealChapter?: number;
  postOrgasmChapter?: number;
}): IntimateVisualState {
  if (options.mode !== "explicite") return STANDARD_VISUAL;
  const assets = SOLO_INTIMATE_CG[options.character];
  if (!assets) return STANDARD_VISUAL;
  if (options.step === "ending" || options.step === "done") {
    return { cg: stateFromAssets(assets, "post-orgasm"), useIntimateSprites: false };
  }
  if (options.step !== "direction-lines") return STANDARD_VISUAL;

  if (options.narrativePhase) {
    if (options.narrativePhase === "naked-reveal") {
      return { cg: stateFromAssets(assets, "reveal"), useIntimateSprites: false };
    }
    if (AFTERGLOW_PHASES.has(options.narrativePhase)) {
      return { cg: stateFromAssets(assets, "post-orgasm"), useIntimateSprites: false };
    }
    return { useIntimateSprites: !BEFORE_REVEAL_PHASES.has(options.narrativePhase) };
  }

  // Les routes sans phases doivent publier leur propre progression visuelle.
  // Sans ce contrat narratif, aucun sprite nu n'est autorisé à apparaître.
  if (options.revealChapter === undefined) return STANDARD_VISUAL;
  if (options.chapter < options.revealChapter) return STANDARD_VISUAL;
  if (options.chapter === options.revealChapter) {
    return { cg: stateFromAssets(assets, "reveal"), useIntimateSprites: false };
  }
  if (options.postOrgasmChapter !== undefined && options.chapter >= options.postOrgasmChapter) {
    return { cg: stateFromAssets(assets, "post-orgasm"), useIntimateSprites: false };
  }
  return { useIntimateSprites: true };
}

export function groupIntimateVisualState(options: {
  pairId: string;
  mode: IntimacyMode;
  step: string;
  chapter: number;
  revealChapter?: number;
  postOrgasmChapter?: number;
}): IntimateVisualState {
  if (options.mode !== "explicite") return STANDARD_VISUAL;
  const assets = DUO_INTIMATE_CG[options.pairId];
  if (!assets) return STANDARD_VISUAL;
  if (options.step === "ending" || options.step === "done") {
    return { cg: stateFromAssets(assets, "post-orgasm"), useIntimateSprites: false };
  }
  if (options.step !== "direction-lines") return STANDARD_VISUAL;

  const revealChapter = options.revealChapter ?? 3;
  const postOrgasmChapter = options.postOrgasmChapter ?? 5;
  if (options.chapter < revealChapter) return STANDARD_VISUAL;
  if (options.chapter === revealChapter) {
    return { cg: stateFromAssets(assets, "reveal"), useIntimateSprites: false };
  }
  if (options.chapter >= postOrgasmChapter) {
    return { cg: stateFromAssets(assets, "post-orgasm"), useIntimateSprites: false };
  }
  return { useIntimateSprites: true };
}
