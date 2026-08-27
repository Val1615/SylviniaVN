import type { IntimacyMode } from "./date-scenes";

export type IntimateCgPhase = "reveal" | "post-orgasm";
export type IntimateCgSurface = "route" | "home" | "group";

export type IntimateCgState = {
  phase: IntimateCgPhase;
  src: string;
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
  "group-date-allenna-lineva": "allenna_lineva",
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

export function soloIntimateCgState(options: {
  character: string;
  mode: IntimacyMode;
  surface: Exclude<IntimateCgSurface, "group">;
  step: string;
  chapter: number;
}): IntimateCgState | undefined {
  if (options.mode !== "explicite") return undefined;
  const assets = SOLO_INTIMATE_CG[options.character];
  if (options.step === "ending" || options.step === "done") return stateFromAssets(assets, "post-orgasm");
  if (options.step !== "direction-lines") return undefined;

  // Les scènes au logis placent leur climax au chapitre 4 ; les routes solo au chapitre 5.
  const revealChapter = options.surface === "home" ? 3 : 4;
  const postOrgasmChapter = options.surface === "home" ? 5 : 6;
  if (options.chapter === revealChapter) return stateFromAssets(assets, "reveal");
  if (options.chapter >= postOrgasmChapter) return stateFromAssets(assets, "post-orgasm");
  return undefined;
}

export function groupIntimateCgState(options: {
  pairId: string;
  mode: IntimacyMode;
  step: string;
  chapter: number;
}): IntimateCgState | undefined {
  if (options.mode !== "explicite") return undefined;
  const assets = DUO_INTIMATE_CG[options.pairId];
  if (options.step === "ending" || options.step === "done") return stateFromAssets(assets, "post-orgasm");
  if (options.step !== "direction-lines") return undefined;

  // Le chapitre 4 contient le climax à trois : reveal au 3, post-orgasm à partir du 5.
  if (options.chapter === 3) return stateFromAssets(assets, "reveal");
  if (options.chapter >= 5) return stateFromAssets(assets, "post-orgasm");
  return undefined;
}
