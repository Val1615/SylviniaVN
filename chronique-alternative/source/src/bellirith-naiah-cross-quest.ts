import type { CrossQuestProgress } from "./cross-quests";
import { bnGameResult, createBNGame, hydrateBNGame, type BNGameState } from "./bellirith-naiah-minigame";
import {
  bnStageScene, BN_FIRST_ACCEPT, BN_FIRST_DECLINE, BN_FIRST_LATER, BN_LIMIT_ACCEPT, BN_LIMIT_DECLINE, BN_LIMIT_LATER,
  BN_SIMULATION_ACCEPT, BN_SIMULATION_DECLINE, type BNSceneContext, type BNSceneData,
} from "./bellirith-naiah-scenes";
import { bnFinalScene, bnPostMoment, BN_FINAL_CHOICES, BN_FINAL_ID, BN_POST_MOMENT_IDS, type BNFinalChoice } from "./bellirith-naiah-date";
import { B, T, Y } from "./bellirith-naiah-kit";
import type { DialogueLine } from "./game-data";

/**
 * Quête croisée Bellirith / Naïah : état, déblocage, hydratation et progression.
 * Les textes vivent dans bellirith-naiah-scenes.ts, bellirith-naiah-date.ts,
 * bellirith-naiah-minigame.ts et bellirith-naiah-intimacy*.ts.
 */

export const BN_KEY = "bellirith-naiah";
export const BN_TITLES = ["L’anomalie", "Tu simules", "Les Trois Réponses", "Jusqu’où ?", "Même là ?", "Quelque chose d’autre", "Regarde-moi"] as const;
export const BN_SCENE_IDS = ["cross-bn-01", "cross-bn-02", "cross-bn-03", "cross-bn-04", "cross-bn-05", "cross-bn-06", BN_FINAL_ID] as const;
/** Six étapes, puis le rendez-vous final ; l’étape 7 signifie « série accomplie ». */
export const BN_STAGE_TOTAL = 7;
export const BN_FINAL_STAGE = 6;
export const BN_MINIGAME_STAGE = 2;

/** Objectifs du dossier. Aucun ne nomme la cible réelle de la fissure. */
export const BN_OBJECTIVES = [
  "Bellirith vous attend à l’Auberge du Forestier. Quelque chose chez Naïah lui échappe, et elle veut un témoin.",
  "Un billet plié en forme d’oiseau vous appelle aux Ruines noyées de brume. Naïah prépare une réception.",
  "Bellirith a fait dresser une table de jeu dans la Salle des Élus. Rejoignez-les pour une partie des Trois Réponses.",
  "Bellirith et Naïah se sont donné rendez-vous à la Halte du Fleuve bleu. Bellirith a changé de question.",
  "Naïah vous attend dans les appartements de Bellirith, au palais d’Al’Gratal. Elle annonce un pari.",
  "Bellirith vous a donné rendez-vous à la Clairière des Échos, en plein jour. Elle a quelque chose à vérifier.",
  "Naïah réclame une revanche dans sa clairière. Rejoignez-les à la nuit tombée.",
] as const;
export const BN_MINIGAME_OBJECTIVE = "La partie des Trois Réponses attend sa conclusion. Reprenez-la exactement là où vous l’avez laissée.";

export type BNIntimacyId = "bn-first" | "bn-limit" | "bn-simulation";
export const BN_INTIMACY_IDS: readonly BNIntimacyId[] = ["bn-first", "bn-limit", "bn-simulation"];
export type BNIntimacyStatus = "accepted" | "deferred" | "declined";

export type BNState = {
  choices: Record<string, string[]>;
  minigame?: BNGameState;
  checkpoint?: { sceneId: string; round: number; picks: string[] };
  firstIntimacy?: BNIntimacyStatus;
  firstIntimacyDone?: boolean;
  limitIntimacy?: BNIntimacyStatus;
  limitIntimacyDone?: boolean;
  simulationIntimacy?: Exclude<BNIntimacyStatus, "deferred">;
  simulationIntimacyDone?: boolean;
  /** Q5 vécue de l’extérieur : refus, ou chambre quittée avant la chute. */
  simulationToldAfter?: boolean;
  finalChoice?: BNFinalChoice;
  finalDateDone?: boolean;
  completed?: boolean;
};

export const BN_FLAGS = {
  started: "cross-bn-started",
  simulationDiscovered: "cross-bn-simulation-discovered",
  minigameComplete: "cross-bn-minigame-complete",
  firstIntimacy: "cross-bn-first-intimacy",
  limitIntimacy: "cross-bn-limit-intimacy",
  penetrationException: "cross-bn-penetration-exception",
  anomalyDetected: "cross-bn-anomaly-detected",
  amaneaFormSeen: "cross-bn-amanea-form-seen",
  finalDateComplete: "cross-bn-final-date-complete",
  seriesComplete: "cross-bn-series-complete",
} as const;
export const BN_ALL_FLAGS: readonly string[] = Object.values(BN_FLAGS);

type UnlockGame = { flags: readonly string[]; relationships: Record<string, { stage: number; met?: boolean }> };

/** Conditions de déblocage, dans l’ordre de lecture du dossier développeur. */
export function bnUnlockChecks(game: UnlockGame) {
  const naiah = game.relationships.naiah, bellirith = game.relationships.bellirith;
  return [
    { id: "act1", label: "Acte I terminé", ok: game.flags.some((flag) => flag === "main-story-act-1-complete" || flag === "main-story-complete") },
    { id: "naiah", label: "Relation Naïah à l’étape 5", ok: Boolean(naiah && naiah.stage >= 5) },
    { id: "bellirith", label: "Fil de Bellirith résolu (étape 5)", ok: Boolean(bellirith && bellirith.stage >= 5) },
    { id: "met", label: "Naïah et Bellirith rencontrées", ok: Boolean(naiah?.met && bellirith?.met) },
  ];
}

export function bnUnlocked(game: UnlockGame) {
  return bnUnlockChecks(game).every((check) => check.ok);
}

export function createBNProgress(day: number): CrossQuestProgress {
  return { id: BN_KEY, stage: 0, startedDay: day, stageStartedDay: day, letters: [], bn: { choices: {} } };
}

const STATUS = new Set<BNIntimacyStatus>(["accepted", "deferred", "declined"]);
const FINAL_CHOICE_BY_ID = Object.fromEntries(Object.entries(BN_FINAL_CHOICES).map(([key, id]) => [id, key])) as Record<string, BNFinalChoice>;
const KNOWN_SCENES = new Set<string>([...BN_SCENE_IDS, ...BN_POST_MOMENT_IDS, "cross-bn-05-door"]);

function statusFromPicks(picks: readonly string[] | undefined, accept: string, later: string | undefined, decline: string): BNIntimacyStatus | undefined {
  if (!picks) return undefined;
  if (picks.includes(accept)) return "accepted";
  if (later && picks.includes(later)) return "deferred";
  if (picks.includes(decline)) return "declined";
  return undefined;
}

/**
 * Hydratation défensive : sauvegarde v18 sans `bn`, champs inconnus ou corrompus.
 * Aucun choix fictif n’est injecté ; l’étape est bornée et les statuts d’intimité
 * se recalculent depuis les choix réellement enregistrés quand ils manquent.
 */
export function hydrateBN(progress: CrossQuestProgress): CrossQuestProgress {
  const source = (progress.bn && typeof progress.bn === "object" ? progress.bn : { choices: {} }) as Partial<BNState>;
  const choices = source.choices && typeof source.choices === "object"
    ? Object.fromEntries(Object.entries(source.choices).filter(([id, picks]) => KNOWN_SCENES.has(id) && Array.isArray(picks) && picks.every((pick) => typeof pick === "string")))
    : {};
  const checkpoint = source.checkpoint && typeof source.checkpoint.sceneId === "string" && KNOWN_SCENES.has(source.checkpoint.sceneId)
    && Number.isInteger(source.checkpoint.round) && source.checkpoint.round >= -1
    && Array.isArray(source.checkpoint.picks) && source.checkpoint.picks.every((pick) => typeof pick === "string") ? source.checkpoint : undefined;
  const minigame = hydrateBNGame(source.minigame);
  const bool = (value: unknown) => value === true;
  const rawStage = Math.max(0, Math.min(BN_STAGE_TOTAL, Math.trunc(Number(progress.stage) || 0)));
  const first = STATUS.has(source.firstIntimacy as BNIntimacyStatus) ? source.firstIntimacy : statusFromPicks(choices["cross-bn-02"], BN_FIRST_ACCEPT, BN_FIRST_LATER, BN_FIRST_DECLINE);
  const limit = STATUS.has(source.limitIntimacy as BNIntimacyStatus) ? source.limitIntimacy : statusFromPicks(choices["cross-bn-04"], BN_LIMIT_ACCEPT, BN_LIMIT_LATER, BN_LIMIT_DECLINE);
  const simulationSource = source.simulationIntimacy === "accepted" || source.simulationIntimacy === "declined" ? source.simulationIntimacy : statusFromPicks(choices["cross-bn-05"], BN_SIMULATION_ACCEPT, undefined, BN_SIMULATION_DECLINE);
  const simulation = simulationSource === "deferred" ? undefined : simulationSource;
  const finalPick = choices[BN_FINAL_ID]?.find((pick) => FINAL_CHOICE_BY_ID[pick]);
  // Le marquage développeur explicite conserve `finalDateDone` sans inventer de choix final.
  const finalDateDone = Boolean(choices[BN_FINAL_ID]) || (bool(source.finalDateDone) && rawStage >= BN_STAGE_TOTAL);
  // Jamais d’achèvement implicite : sans rendez-vous final vécu, la série reste à l’étape finale.
  const stage = rawStage >= BN_STAGE_TOTAL && !finalDateDone ? BN_FINAL_STAGE : rawStage;
  return {
    ...progress, id: BN_KEY, stage, letters: [],
    startedDay: Math.max(1, Number(progress.startedDay) || 1), stageStartedDay: Math.max(1, Number(progress.stageStartedDay) || 1),
    bn: {
      choices, checkpoint, minigame,
      firstIntimacy: first, firstIntimacyDone: bool(source.firstIntimacyDone) && (first === "accepted" || first === "deferred"),
      limitIntimacy: limit, limitIntimacyDone: bool(source.limitIntimacyDone) && (limit === "accepted" || limit === "deferred"),
      simulationIntimacy: simulation, simulationIntimacyDone: bool(source.simulationIntimacyDone) && simulation === "accepted",
      simulationToldAfter: bool(source.simulationToldAfter) || simulation === "declined",
      finalChoice: finalPick ? FINAL_CHOICE_BY_ID[finalPick] : undefined,
      finalDateDone, completed: finalDateDone && stage >= BN_STAGE_TOTAL,
    },
  };
}

export function bnStageOfScene(sceneId: string) {
  return (BN_SCENE_IDS as readonly string[]).indexOf(sceneId);
}

export function bnSceneContext(bn: BNState, flags: readonly string[]): BNSceneContext {
  return {
    flags,
    firstIntimacyDone: bn.firstIntimacyDone,
    limitIntimacyDone: bn.limitIntimacyDone,
    simulationIntimacyDone: bn.simulationIntimacyDone,
    simulationToldAfter: bn.simulationToldAfter || !bn.simulationIntimacyDone,
    minigameResult: bn.minigame?.completed ? bnGameResult(bn.minigame) : undefined,
  };
}

/** Scène d’une étape (0 à 6). L’étape 6 est le rendez-vous final. */
export function bnQuestScene(stage: number, bn: BNState, flags: readonly string[]): BNSceneData | undefined {
  const ctx = bnSceneContext(bn, flags);
  if (stage === BN_FINAL_STAGE) return bnFinalScene(ctx);
  if (stage >= 0 && stage < BN_FINAL_STAGE) return bnStageScene(stage, ctx);
  return undefined;
}

export { bnPostMoment, BN_POST_MOMENT_IDS };

/** Le dialogue de Q3 est terminé, mais la partie n’est pas encore achevée. */
export function bnMinigamePending(progress: CrossQuestProgress | undefined) {
  return Boolean(progress?.bn && progress.stage === BN_MINIGAME_STAGE && progress.bn.choices["cross-bn-03"] && !progress.bn.minigame?.completed);
}

/**
 * Enregistre la fin d’une scène. Une scène déjà enregistrée n’avance jamais
 * l’étape une seconde fois ; Q3 n’avance qu’à la fin du mini-jeu.
 */
export function finishBNScene(progress: CrossQuestProgress, sceneId: string, picks: string[], day: number): CrossQuestProgress {
  const bn = progress.bn!;
  if (bn.choices[sceneId]) return { ...progress, bn: { ...bn, checkpoint: undefined } };
  const choices = { ...bn.choices, [sceneId]: picks };
  const next: BNState = { ...bn, choices, checkpoint: undefined };
  if (sceneId === "cross-bn-02") next.firstIntimacy = statusFromPicks(picks, BN_FIRST_ACCEPT, BN_FIRST_LATER, BN_FIRST_DECLINE);
  if (sceneId === "cross-bn-04") next.limitIntimacy = statusFromPicks(picks, BN_LIMIT_ACCEPT, BN_LIMIT_LATER, BN_LIMIT_DECLINE);
  if (sceneId === "cross-bn-05") {
    const status = statusFromPicks(picks, BN_SIMULATION_ACCEPT, undefined, BN_SIMULATION_DECLINE);
    next.simulationIntimacy = status === "deferred" ? undefined : status;
    if (status === "declined") next.simulationToldAfter = true;
  }
  if (sceneId === "cross-bn-03" && !next.minigame) next.minigame = createBNGame();
  if (sceneId === BN_FINAL_ID) {
    const pick = picks.find((entry) => FINAL_CHOICE_BY_ID[entry]);
    next.finalChoice = pick ? FINAL_CHOICE_BY_ID[pick] : undefined;
    next.finalDateDone = true;
  }
  const sceneStage = bnStageOfScene(sceneId);
  const advances = sceneStage >= 0 && sceneStage === progress.stage && sceneStage !== BN_MINIGAME_STAGE;
  const stage = advances ? Math.min(BN_STAGE_TOTAL, progress.stage + 1) : progress.stage;
  next.completed = stage >= BN_STAGE_TOTAL && Boolean(next.finalDateDone);
  return { ...progress, stage, stageStartedDay: advances ? day : progress.stageStartedDay, bn: next };
}

/** Sauvegarde de la partie en cours (jamais appelée en relecture). */
export function bnSaveMinigame(progress: CrossQuestProgress, minigame: BNGameState): CrossQuestProgress {
  const bn = progress.bn!;
  if (progress.stage !== BN_MINIGAME_STAGE || bn.minigame?.completed) return progress;
  return { ...progress, bn: { ...bn, minigame } };
}

/** Fin de partie : seule cette étape fait avancer la série après Q3. */
export function bnCompleteMinigame(progress: CrossQuestProgress, minigame: BNGameState, day: number): CrossQuestProgress {
  const bn = progress.bn!;
  if (progress.stage !== BN_MINIGAME_STAGE || !minigame.completed) return progress;
  return { ...progress, stage: BN_MINIGAME_STAGE + 1, stageStartedDay: day, bn: { ...bn, minigame } };
}

/** Intimités optionnelles encore proposées depuis le dossier (acceptées puis interrompues, ou différées). */
export function bnPendingIntimacies(progress: CrossQuestProgress | undefined): BNIntimacyId[] {
  const bn = progress?.bn;
  if (!bn || progress!.stage >= BN_FINAL_STAGE) return [];
  const list: BNIntimacyId[] = [];
  if ((bn.firstIntimacy === "accepted" || bn.firstIntimacy === "deferred") && !bn.firstIntimacyDone && progress!.stage <= 4) list.push("bn-first");
  if ((bn.limitIntimacy === "accepted" || bn.limitIntimacy === "deferred") && !bn.limitIntimacyDone && progress!.stage <= 4) list.push("bn-limit");
  if (bn.simulationIntimacy === "accepted" && !bn.simulationIntimacyDone && !bn.simulationToldAfter && progress!.stage === 5) list.push("bn-simulation");
  return list;
}

export function bnIntimacyLived(bn: BNState | undefined, id: BNIntimacyId) {
  return Boolean(id === "bn-first" ? bn?.firstIntimacyDone : id === "bn-limit" ? bn?.limitIntimacyDone : bn?.simulationIntimacyDone);
}

/** Fin d’une intimité vécue en direct. `completed` = scène menée jusqu’à sa clôture. */
export function finishBNIntimacy(progress: CrossQuestProgress, id: BNIntimacyId, completed: boolean): CrossQuestProgress {
  const bn = progress.bn!;
  if (bnIntimacyLived(bn, id)) return progress;
  if (id === "bn-first") return completed ? { ...progress, bn: { ...bn, firstIntimacyDone: true, firstIntimacy: "accepted" } } : progress;
  if (id === "bn-limit") return completed ? { ...progress, bn: { ...bn, limitIntimacyDone: true, limitIntimacy: "accepted" } } : progress;
  return { ...progress, bn: { ...bn, simulationIntimacyDone: completed, simulationToldAfter: !completed } };
}

/** Effets d’une intimité vécue jusqu’au bout (désir de Bellirith ; affection et confiance pour Naïah, jamais de désir). */
export const BN_INTIMACY_EFFECTS: Record<BNIntimacyId, { bellirith: { affection?: number; trust?: number; desire?: number }; naiah: { affection?: number; trust?: number } }> = {
  "bn-first": { bellirith: { affection: 1, desire: 2 }, naiah: { affection: 2 } },
  "bn-limit": { bellirith: { affection: 1, trust: 1, desire: 2 }, naiah: { affection: 2, trust: 1 } },
  "bn-simulation": { bellirith: { trust: 1, desire: 3 }, naiah: { affection: 3, trust: 2 } },
};

/** Flags d’interaction avec les autres systèmes, dérivés de l’état. */
export function bnFlags(progress: CrossQuestProgress | undefined): string[] {
  const bn = progress?.bn;
  if (!progress || !bn) return [];
  const flags: string[] = [];
  if (progress.stage >= 1 || Object.keys(bn.choices).length) flags.push(BN_FLAGS.started);
  if (bn.minigame?.anomalySeen) flags.push(BN_FLAGS.anomalyDetected);
  if (bn.minigame?.completed) flags.push(BN_FLAGS.minigameComplete);
  if (bn.firstIntimacyDone) flags.push(BN_FLAGS.firstIntimacy);
  if (bn.limitIntimacyDone) flags.push(BN_FLAGS.limitIntimacy);
  if (bn.choices["cross-bn-05"]) flags.push(BN_FLAGS.simulationDiscovered);
  if (bn.simulationIntimacyDone) flags.push(BN_FLAGS.penetrationException);
  if (bn.finalDateDone) flags.push(BN_FLAGS.amaneaFormSeen, BN_FLAGS.finalDateComplete);
  if (bn.completed) flags.push(BN_FLAGS.seriesComplete);
  return flags;
}

/** Scène courte jouée quand le joueur quitte la chambre de Q5 avant la chute. */
export function bnSimulationDoorScene(): BNSceneData {
  const lines: DialogueLine[] = [
    T("Vous ramassez vos affaires et sortez sans bruit. Derrière vous, aucune des deux ne s’interrompt pour vous retenir. Vous vous asseyez sur la banquette du couloir."),
    T("Les voix continuent longtemps. Celle de Naïah monte, se brise, remonte, et vous vous surprenez à croire qu’il se passe vraiment quelque chose de neuf derrière ce velours."),
    T("Puis la porte s’ouvre d’un coup. Bellirith, un drap de soie serré contre elle, crie vers l’intérieur de la chambre."),
    B("Mais tu ne ressens toujours rien !", "angry"),
    B("Tu t’amuses, tu triomphes, tu rayonnes d’orgueil ! Et de ce que je cherchais, rien. Rien depuis la première bougie !", "angry"),
    T("De la chambre jaillit un éclat de rire si énorme qu’il en devient presque un cri. Naïah apparaît sur le seuil, la cape de Bellirith sur les épaules, les yeux pleins de larmes de joie."),
    Y("Tout ! Tout était faux ! Et tu es allée jusqu’au bout quand même !", "laugh"),
    B("Parce que tu me l’as demandé, peste !", "angry"),
    Y("Je sais ! C’était ça, le pari !", "laugh"),
    T("Bellirith vous aperçoit enfin sur votre banquette. Elle vous dévisage avec la colère d’une reine trahie par son propre public."),
    B("Et toi, tu y as cru. Je le sens d’ici, ne prends pas cet air-là.", "angry"),
  ];
  return {
    id: "cross-bn-05-door", title: "Même là ?", location: "algratal", spot: "algratal-palace-quarters", cast: ["bellirith", "naiah"], music: "two-stars-night",
    intro: lines,
    choices: [{ id: "cross-bn-05-door-own", text: "Avouer que vous y avez cru.", stat: "resonance", effects: {}, response: [
      { speaker: "{player}", text: "J’y ai cru." },
      Y("Mon public y a cru ! Je veux une statue.", "laugh"),
      B("Tu auras un cachot.", "angry"),
    ] }],
    beats: [],
  };
}
