import type { CrossQuestProgress } from "./cross-quests";
import { BV_ENDING_CHOICES, BV_FALLOUT_IDS, BV_Q6_CHOICES, bvBuildScene, type BVEnding, type BVQ6Tone, type BVRelation, type BVSceneContext, type BVSceneData, type BVStyle } from "./bellirith-valurn-scenes";
import { bvHydrateNever, bvNeverStyleFlags, type BVNeverState } from "./bellirith-valurn-never-game";

/**
 * Quête croisée Bellirith / Valurn : état durable, déblocage, progression.
 * État rangé dans `game.crossQuestSeries["bellirith-valurn"].bv` ; aucun autre
 * sous-état (HN, BN, HR, Lineva / Allenna) n’est lu ni écrit ici.
 */

export const BV_KEY = "bellirith-valurn";
export const BV_DATE_ID = "group-date-bellirith-valurn-never";
export const BV_STAGE_TOTAL = 6;
export const BV_DATE_STAGE = 3;

export const BV_TITLES = [
  "Les comptes de famille",
  "Ce qu’on sait de l’autre",
  "La troisième chaise",
  "Je n’ai jamais",
  "Les lendemains ont mauvaise mémoire",
  "Les règles ont changé",
] as const;

export const BV_OBJECTIVES = [
  "Rejoindre Valurn sous l’auvent d’Ysaure Pellin, au Grand Marché d’Al’Gratal, l’après-midi. Bellirith ne tardera pas à s’en mêler.",
  "Deux conversations, dans l’ordre qui vous plaît : Bellirith à la Salle des Élus l’après-midi, Valurn dans la galerie d’audience le soir.",
  "Retrouver Bellirith et Valurn à la Cloche Fêlée, sur la place aux Cygnes (Avenues impériales), le soir.",
  "Invitation permanente : le salon de musique du palais, le soir qui vous plaira. Rien ne presse ; la troisième chaise vous attend.",
  "Le lendemain du salon : retrouver Bellirith au Grand Marché le matin, et Valurn au salon de musique l’après-midi, séparément.",
  "Ysaure Pellin vous fait appeler au Grand Marché : deux offres pour une seule réception.",
] as const;

export const BV_SCENE_IDS = {
  q1: "cross-bv-01", q2b: "cross-bv-02-b", q2v: "cross-bv-02-v", q3: "cross-bv-03", after: "cross-bv-04", q5b: "cross-bv-05-b", q5v: "cross-bv-05-v", q6: "cross-bv-06",
} as const;
export const BV_MAIN_SCENES: readonly string[] = Object.values(BV_SCENE_IDS);
const KNOWN_SCENES = new Set<string>([...BV_MAIN_SCENES, ...BV_FALLOUT_IDS]);

export type BVIntimacyId = "bv-a" | "bv-b" | "bv-c";
export const BV_INTIMACY_IDS: readonly BVIntimacyId[] = ["bv-a", "bv-b", "bv-c"];
const ENDING_BY_CHOICE = Object.fromEntries(Object.entries(BV_ENDING_CHOICES).map(([ending, id]) => [id, ending])) as Record<string, BVEnding>;
const Q6_BY_CHOICE = Object.fromEntries(Object.entries(BV_Q6_CHOICES).map(([tone, id]) => [id, tone])) as Record<string, BVQ6Tone>;

export type BVCheckpoint = { sceneId: string; round: number; picks: string[] };

export type BVState = {
  /** Choix réellement enregistrés par scène (rejouabilité protégée). */
  choices: Record<string, string[]>;
  checkpoint?: BVCheckpoint;
  /** Partie « Je n’ai jamais », sauvegardée après chaque intervention. */
  never?: BVNeverState;
  /** Jour où la soirée s’est achevée (Q5 se joue le lendemain). */
  dateDay?: number;
  style?: BVStyle;
  ending?: BVEnding;
  intimacy?: BVIntimacyId;
  intimacyStatus?: "lived" | "stopped";
  q6Tone?: BVQ6Tone;
  completed?: boolean;
};

type UnlockGame = { flags: string[]; relationships: Record<string, { stage: number; met?: boolean } | undefined> };

export function bvUnlockChecks(game: UnlockGame) {
  const bellirith = game.relationships.bellirith, valurn = game.relationships.valurn;
  return [
    { id: "act1", label: "Acte I terminé", ok: game.flags.some((flag) => flag === "main-story-act-1-complete" || flag === "main-story-complete") },
    { id: "bellirith", label: "Relation Bellirith à l’étape 3", ok: Boolean(bellirith && bellirith.stage >= 3) },
    { id: "valurn", label: "Relation Valurn à l’étape 3", ok: Boolean(valurn && valurn.stage >= 3) },
    { id: "met", label: "Bellirith et Valurn rencontrés", ok: Boolean(bellirith?.met && valurn?.met) },
  ];
}

export function bvUnlocked(game: UnlockGame) {
  return bvUnlockChecks(game).every((check) => check.ok);
}

export function createBVProgress(day: number): CrossQuestProgress {
  return { id: BV_KEY, stage: 0, startedDay: day, stageStartedDay: day, letters: [], bv: { choices: {} } };
}

const STYLES = new Set<BVStyle>(["discret", "bellirith-provocateur", "valurn-provocateur", "double-provocateur", "equilibre"]);

/** Hydratation défensive : sauvegardes sans `bv`, champs corrompus, étapes hors bornes. Aucun choix n’est inventé. */
export function hydrateBV(progress: CrossQuestProgress): CrossQuestProgress {
  const source = (progress.bv && typeof progress.bv === "object" ? progress.bv : { choices: {} }) as Partial<BVState>;
  const choices = source.choices && typeof source.choices === "object"
    ? Object.fromEntries(Object.entries(source.choices).filter(([id, picks]) => KNOWN_SCENES.has(id) && Array.isArray(picks) && picks.every((pick) => typeof pick === "string")))
    : {};
  const cp = source.checkpoint;
  const checkpoint = cp && typeof cp.sceneId === "string" && KNOWN_SCENES.has(cp.sceneId) && Number.isInteger(cp.round) && cp.round >= -1
    && Array.isArray(cp.picks) && cp.picks.every((pick) => typeof pick === "string") ? { sceneId: cp.sceneId, round: cp.round, picks: [...cp.picks] } : undefined;
  const never = bvHydrateNever(source.never);
  const afterPick = choices[BV_SCENE_IDS.after]?.find((pick) => ENDING_BY_CHOICE[pick]);
  const q6Pick = choices[BV_SCENE_IDS.q6]?.find((pick) => Q6_BY_CHOICE[pick]);
  const ending = afterPick ? ENDING_BY_CHOICE[afterPick] : undefined;
  const intimacy = ending === "a" || ending === "b" || ending === "c" ? `bv-${ending}` as BVIntimacyId : undefined;
  // L’étape ne dépasse jamais ce que les choix enregistrés prouvent.
  let stage = Math.max(0, Math.min(BV_STAGE_TOTAL, Math.trunc(Number(progress.stage) || 0)));
  const proven = provenStage(choices, Boolean(never?.completed));
  if (stage > proven) stage = proven;
  return {
    ...progress, id: BV_KEY, stage, letters: [],
    startedDay: Math.max(1, Number(progress.startedDay) || 1), stageStartedDay: Math.max(1, Number(progress.stageStartedDay) || 1),
    bv: {
      choices, checkpoint, never,
      dateDay: Number.isInteger(source.dateDay) ? source.dateDay : undefined,
      style: STYLES.has(source.style as BVStyle) ? source.style : never?.completed ? never.style : undefined,
      ending, intimacy,
      intimacyStatus: intimacy && (source.intimacyStatus === "lived" || source.intimacyStatus === "stopped") ? source.intimacyStatus : undefined,
      q6Tone: q6Pick ? Q6_BY_CHOICE[q6Pick] : undefined,
      completed: stage >= BV_STAGE_TOTAL,
    },
  };
}

function provenStage(choices: Record<string, string[]>, neverDone: boolean) {
  const done = (id: string) => Boolean(choices[id]);
  if (!done(BV_SCENE_IDS.q1)) return 0;
  if (!done(BV_SCENE_IDS.q2b) || !done(BV_SCENE_IDS.q2v)) return 1;
  if (!done(BV_SCENE_IDS.q3)) return 2;
  if (!neverDone || !done(BV_SCENE_IDS.after)) return 3;
  if (!done(BV_SCENE_IDS.q5b) || !done(BV_SCENE_IDS.q5v)) return 4;
  if (!done(BV_SCENE_IDS.q6)) return 5;
  return 6;
}

/** Scènes jouables maintenant (dossier du Journal). `waitTomorrow` signale que Q5 attend le lendemain. */
export function bvAvailableScenes(progress: CrossQuestProgress | undefined, day: number): { scenes: string[]; never: boolean; waitTomorrow: boolean } {
  const bv = progress?.bv;
  if (!progress || !bv) return { scenes: [], never: false, waitTomorrow: false };
  const open = (ids: string[]) => ids.filter((id) => !bv.choices[id]);
  switch (progress.stage) {
    case 0: return { scenes: open([BV_SCENE_IDS.q1]), never: false, waitTomorrow: false };
    case 1: return { scenes: open([BV_SCENE_IDS.q2b, BV_SCENE_IDS.q2v]), never: false, waitTomorrow: false };
    case 2: return { scenes: open([BV_SCENE_IDS.q3]), never: false, waitTomorrow: false };
    case 3: return bv.never?.completed ? { scenes: open([BV_SCENE_IDS.after]), never: false, waitTomorrow: false } : { scenes: [], never: true, waitTomorrow: false };
    case 4: {
      const wait = bv.dateDay !== undefined && day <= bv.dateDay;
      return { scenes: wait ? [] : open([BV_SCENE_IDS.q5b, BV_SCENE_IDS.q5v]), never: false, waitTomorrow: wait };
    }
    case 5: return { scenes: open([BV_SCENE_IDS.q6]), never: false, waitTomorrow: false };
    default: return { scenes: [...BV_FALLOUT_IDS].filter((id) => !bv.choices[id]), never: false, waitTomorrow: false };
  }
}

/** Fin d’une scène : idempotente. Une scène déjà enregistrée ne réécrit rien, seule la reprise est effacée. */
export function finishBVScene(progress: CrossQuestProgress, sceneId: string, picks: readonly string[], day: number): CrossQuestProgress {
  const bv = progress.bv || { choices: {} };
  if (bv.choices[sceneId]) return { ...progress, bv: { ...bv, checkpoint: undefined } };
  const choices = { ...bv.choices, [sceneId]: [...picks] };
  const next: BVState = { ...bv, choices, checkpoint: undefined };
  if (sceneId === BV_SCENE_IDS.after) {
    const pick = picks.find((id) => ENDING_BY_CHOICE[id]);
    next.ending = pick ? ENDING_BY_CHOICE[pick] : "amical";
    next.intimacy = next.ending === "a" || next.ending === "b" || next.ending === "c" ? `bv-${next.ending}` as BVIntimacyId : undefined;
    next.dateDay = day;
  }
  if (sceneId === BV_SCENE_IDS.q6) {
    const pick = picks.find((id) => Q6_BY_CHOICE[id]);
    next.q6Tone = pick ? Q6_BY_CHOICE[pick] : "prudence";
  }
  const stage = Math.max(progress.stage, provenStage(choices, Boolean(next.never?.completed)));
  next.completed = stage >= BV_STAGE_TOTAL;
  return { ...progress, stage, stageStartedDay: stage !== progress.stage ? day : progress.stageStartedDay, bv: next };
}

/** Sauvegarde intermédiaire de la partie : refusée une fois la partie conclue. */
export function bvSaveNever(progress: CrossQuestProgress, state: BVNeverState): CrossQuestProgress {
  const bv = progress.bv || { choices: {} };
  if (bv.never?.completed) return progress;
  return { ...progress, bv: { ...bv, never: state } };
}

/** Clôture de la partie : pressions remises à zéro, seul le style de jeu reste. Idempotente. */
export function bvCompleteNever(progress: CrossQuestProgress, state: BVNeverState): CrossQuestProgress {
  const bv = progress.bv || { choices: {} };
  if (bv.never?.completed) return progress;
  const zero = Object.fromEntries(Object.keys(state.pressure).map((key) => [key, 0])) as BVNeverState["pressure"];
  const never: BVNeverState = { ...state, completed: true, pressure: zero };
  return { ...progress, bv: { ...bv, never, style: state.style } };
}

export function finishBVIntimacy(progress: CrossQuestProgress, completed: boolean): CrossQuestProgress {
  const bv = progress.bv;
  if (!bv?.intimacy || bv.intimacyStatus) return progress;
  return { ...progress, bv: { ...bv, intimacyStatus: completed ? "lived" : "stopped" } };
}

export function bvPendingIntimacy(progress: CrossQuestProgress | undefined): BVIntimacyId | undefined {
  const bv = progress?.bv;
  return bv?.intimacy && !bv.intimacyStatus ? bv.intimacy : undefined;
}

/**
 * Effets d’une intimité menée à son terme. Bellirith n’y gagne jamais de désir :
 * son désir ne vient que des moments où le joueur lui a tenu tête.
 */
export const BV_INTIMACY_EFFECTS: Record<BVIntimacyId, { bellirith?: { affection?: number; trust?: number }; valurn?: { affection?: number; trust?: number; desire?: number } }> = {
  "bv-a": { bellirith: { affection: 3, trust: 2 }, valurn: { trust: 1 } },
  "bv-b": { valurn: { affection: 3, trust: 2, desire: 2 }, bellirith: { trust: 1 } },
  "bv-c": { bellirith: { affection: 2, trust: 2 }, valurn: { affection: 2, trust: 2, desire: 1 } },
};

/** Flags dérivés, stables et non punitifs. */
export function bvFlags(progress: CrossQuestProgress): string[] {
  const bv = progress.bv;
  if (!bv) return [];
  const flags: string[] = [];
  for (const id of BV_MAIN_SCENES) if (bv.choices[id]) flags.push(`${id}-done`);
  if (bv.never?.completed) flags.push("cross-bv-never-complete", ...bvNeverStyleFlags(bv.never));
  if (bv.ending) flags.push(`bv-ending:${bv.ending}`);
  if (bv.intimacyStatus === "lived" && bv.intimacy) flags.push(`bv-intimacy:${bv.intimacy}`);
  if (bv.q6Tone) flags.push(`bv-q6:${bv.q6Tone}`);
  if (bv.completed) flags.push("cross-bv-series-complete");
  return flags;
}

export const BV_ALL_FLAG_PREFIXES = ["cross-bv-", "bv-never:", "bv-ending:", "bv-intimacy:", "bv-q6:", "bv-q1", "bv-q2", "bv-accept:", "bv-q5"];

export function bvSceneContext(game: { flags: string[]; knowledge: string[]; relationships: Record<string, BVRelation | undefined> }, progress?: CrossQuestProgress): BVSceneContext {
  const bv = progress?.bv;
  return {
    flags: game.flags, knowledge: game.knowledge,
    relationships: { bellirith: game.relationships.bellirith, valurn: game.relationships.valurn },
    style: bv?.style, ending: bv?.ending, q6Tone: bv?.q6Tone, rounds: bv?.never?.completed ? bv.never.round : undefined,
  };
}

export function bvScene(sceneId: string, game: Parameters<typeof bvSceneContext>[0], progress?: CrossQuestProgress): BVSceneData | undefined {
  return bvBuildScene(sceneId, bvSceneContext(game, progress));
}

export const BV_SCENE_TITLES: Record<string, string> = {
  "cross-bv-01": "Les comptes de famille", "cross-bv-02-b": "Ce qu’on sait de l’autre · Bellirith", "cross-bv-02-v": "Ce qu’on sait de l’autre · Valurn",
  "cross-bv-03": "La troisième chaise", "cross-bv-04": "Après la dernière gorgée", "cross-bv-05-b": "Les lendemains · Bellirith", "cross-bv-05-v": "Les lendemains · Valurn",
  "cross-bv-06": "Les règles ont changé", "cross-bv-r1": "Huit paris perdus", "cross-bv-r2": "Tant de curiosité", "cross-bv-r3": "Un billet sous la porte",
  "cross-bv-r4": "La carafe d’eau", "cross-bv-r5": "La deuxième violette", "cross-bv-r6": "Tous les couplets",
};
