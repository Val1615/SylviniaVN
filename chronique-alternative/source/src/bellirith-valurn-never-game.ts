import type { DialogueLine } from "./game-data";
import type { BVStyle } from "./bellirith-valurn-scenes";
import { BV_TRANSITION_LEADS, BV_TRANSITION_MOODS, type BVTransitionLead, type BVTransitionMood } from "./bellirith-valurn-never-transitions";
import {
  BV_ANSWER_GENERIC, BV_ANSWER_GENERIC_T, BV_ANSWER_REACTIONS, BV_ANSWER_REACTIONS_T, BV_PLAYER_ANSWERS, BV_PLAYER_ANSWERS_T,
  BV_PLAYER_LEADS, BV_PLAYER_LEADS_SOLEMN, BV_PLAYER_LEADS_SOLEMN_T, BV_PLAYER_LEADS_T, BV_STATEMENT_FALLOUT, BV_STATEMENT_FALLOUT_T,
  BV_STATEMENT_GENERIC, BV_STATEMENT_GENERIC_T, BV_STATEMENT_REACTIONS, BV_STATEMENT_REACTIONS_T, BV_STATEMENT_SOLEMN, BV_STATEMENT_SOLEMN_T,
  BV_THEME_REACTIONS, BV_THEME_REACTIONS_T, type BVIvresse, type BVTiers,
} from "./bellirith-valurn-never-reactions";
import {
  BV_NPC_CLAIMS, BV_NPC_EVENING, BV_NPC_FALLOUT, BV_PIVOT_CLAIMS, BV_PIVOT_FORCED, BV_PIVOT_SILENCE, BV_PLAYER_CLAIMS, BV_PLAYER_FALLOUT, BV_REVEAL_BEATS,
  BV_SUBJECT_CLAIMS, BV_TRANSITIONS,
} from "./bellirith-valurn-never-content";

/**
 * Moteur du « Je n’ai jamais » Bellirith / Valurn.
 * Un tour de table = Bellirith, puis Valurn, puis le joueur. 10 à 20 tours complets.
 * Toutes les décisions sont déterministes (graine sauvegardée) : un rechargement
 * retrouve exactement la même affirmation, les mêmes buveurs et les mêmes options.
 */

export type BVActor = "bellirith" | "valurn" | "player";
export type BVNpc = "bellirith" | "valurn";
export type BVPhase = "facade" | "piques" | "revelations" | "retombee";
export type BVTier = 0 | 1 | 2 | 3;
export type BVTheme = "humour" | "relations" | "marches" | "confiance" | "surprise" | "libre";
export type BVAnswer = "acknowledge" | "deny" | "dodge";
export type BVPressureKey = `${BVActor}>${BVActor}`;

export type BVTruthCtx = {
  flags: readonly string[];
  knowledge: readonly string[];
  relationships: Partial<Record<string, { stage: number; affection: number; trust: number; desire: number; met?: boolean }>>;
  dateHistory: readonly string[];
  groupDateHistory: readonly string[];
};

/** Vérité du joueur : calculée depuis la sauvegarde, ou aveu volontaire (« ask »). Jamais un booléen inventé. */
export type BVPlayerTruth = boolean | "ask" | ((ctx: BVTruthCtx, state: BVNeverState) => boolean);
/** Vérité d’un PNJ : canonique, ou lue dans la soirée en cours (affirmations « du soir »). */
export type BVNpcTruth = boolean | ((state: BVNeverState) => boolean);

export type BVNpcClaim = {
  id: string;
  speaker: BVNpc;
  target: BVActor;
  tier: BVTier;
  phases: BVPhase[];
  text: string;
  mood?: string;
  truth: { bellirith: BVNpcTruth; valurn: BVNpcTruth; player: BVPlayerTruth };
  /** Pourquoi le joueur boit, affiché quand le moteur le détermine. */
  why?: string;
  /** Formulation de l’aveu volontaire, quand la sauvegarde ne permet pas de savoir. */
  ask?: string;
  /** Le locuteur connaît légitimement le fait (présence, récit, fait public). */
  requires?: (ctx: BVTruthCtx) => boolean;
  /** Réagit à ce qui s’est passé pendant la soirée. */
  evening?: (state: BVNeverState) => boolean;
  /** Exploite la sauvegarde (compte pour la couverture éditoriale). */
  save?: boolean;
  tags: string[];
  lines: DialogueLine[];
  ifPlayerDrinks?: DialogueLine[];
  ifPlayerDry?: DialogueLine[];
};

export type BVPlayerClaim = {
  id: string;
  target: "bellirith" | "valurn" | "none";
  theme: BVTheme;
  intensity: 0 | 1 | 2 | 3;
  phases: BVPhase[];
  /** -1 raccourcit la soirée (aveu direct, lassitude), +1 l’étire (provocation, relance). */
  pace: -1 | 0 | 1;
  text: string;
  truth: { bellirith: boolean; valurn: boolean; player: boolean | ((ctx: BVTruthCtx, state: BVNeverState) => boolean) };
  why?: string;
  requires?: (ctx: BVTruthCtx, state: BVNeverState) => boolean;
  save?: boolean;
  tags: string[];
  lines: DialogueLine[];
  ifPlayerDrinks?: DialogueLine[];
};

export type BVBeat = {
  id: "r1" | "r1b" | "r2" | "r3" | "r4" | "r5" | "r6" | "r7";
  speaker: BVNpc;
  text: string;
  mood?: string;
  drinkers: BVActor[];
  knowledge?: string;
  lines: DialogueLine[];
};

export type BVTurnRecord = {
  round: number;
  speaker: BVActor;
  claimId: string;
  target: BVActor | "none";
  drinkers: BVActor[];
  /** Le joueur a bu parce que la sauvegarde le prouve (et non par aveu). */
  playerComputed?: boolean;
  answer?: BVAnswer;
  beat?: BVBeat["id"];
};

export type BVNeverState = {
  version: 1;
  seed: number;
  /** Tour de table en cours, 1 à 20. */
  round: number;
  /** 0 = Bellirith, 1 = Valurn, 2 = joueur. */
  turn: 0 | 1 | 2;
  /** Fin souhaitée, bornée à [10, 20] et toujours compatible avec les moments obligatoires. */
  targetEnd: number;
  pivotRound?: number;
  beats: string[];
  used: string[];
  log: BVTurnRecord[];
  pressure: Record<BVPressureKey, number>;
  attacks: Record<BVPressureKey, number>;
  drinks: Record<BVActor, number>;
  /** Affirmation PNJ en attente d’un aveu volontaire du joueur. */
  awaiting?: string;
  truths: string[];
  completed?: boolean;
  style?: BVStyle;
  tutorialSeen?: boolean;
  /** Format choisi à l’ouverture. Absent : pas encore choisi (ou ancienne sauvegarde en cours, lue comme soirée complète). */
  mode?: BVMode;
};

export type BVMode = "complete" | "abregee";
export const BV_NEVER_MODE_LABELS: Record<BVMode, string> = { complete: "Soirée complète", abregee: "Version abrégée" };
/** Bornes de durée par format. La version abrégée garde tous les moments clés en 8 à 10 tours. */
export function bvBounds(state: Pick<BVNeverState, "mode">) { return state.mode === "abregee" ? { min: 8, max: 10, end: 8 } : { min: BV_MIN_ROUNDS, max: BV_MAX_ROUNDS, end: BV_DEFAULT_END }; }

/** Version abrégée : Bellirith force le tournant au tour 4, Valurn répond, révélations aux tours 5 à 7, dernière question au tour 8. */
export const BV_SHORT_PIVOT = 4;
export const BV_MIN_ROUNDS = 10;
export const BV_MAX_ROUNDS = 20;
export const BV_DEFAULT_END = 14;
const ORDER: readonly BVActor[] = ["bellirith", "valurn", "player"];
const KEYS: BVPressureKey[] = ["bellirith>valurn", "bellirith>player", "valurn>bellirith", "valurn>player", "player>bellirith", "player>valurn"];
export const BV_PRESSURE_KEYS = KEYS;
const REVEAL_ORDER = ["r2", "r3", "r4", "r5", "r6", "r7"] as const;
export const BV_REQUIRED_BEATS = ["r1", ...REVEAL_ORDER, "r8"] as const;

const zero = () => Object.fromEntries(KEYS.map((key) => [key, 0])) as Record<BVPressureKey, number>;
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export function createBVNever(seed = 1, mode?: BVMode): BVNeverState {
  return { version: 1, seed: Math.abs(Math.trunc(seed)) || 1, round: 1, turn: 0, targetEnd: bvBounds({ mode }).end, ...(mode ? { mode } : {}), beats: [], used: [], log: [], pressure: zero(), attacks: zero(), drinks: { bellirith: 0, valurn: 0, player: 0 }, truths: [] };
}

/** Graine stable : dérivée du jour et de l’historique, jamais de Math.random(). */
export function bvSeedFor(day: number, flags: readonly string[]) {
  let h = 2166136261 ^ day;
  for (const flag of flags) for (let i = 0; i < flag.length; i++) h = Math.imul(h ^ flag.charCodeAt(i), 16777619);
  return (h >>> 0) || 1;
}

function rnd(state: BVNeverState, salt: number) {
  let h = Math.imul(state.seed ^ (state.round * 7919) ^ (state.turn * 104729) ^ (salt * 1299709), 2654435761);
  h ^= h >>> 15; h = Math.imul(h, 2246822519); h ^= h >>> 13; h = Math.imul(h, 3266489917); h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

function pickWeighted<X>(items: X[], weight: (item: X) => number, r: number): X | undefined {
  const total = items.reduce((sum, item) => sum + Math.max(0, weight(item)), 0);
  if (!items.length || total <= 0) return items[0];
  let acc = r * total;
  for (const item of items) { acc -= Math.max(0, weight(item)); if (acc < 0) return item; }
  return items[items.length - 1];
}

export function bvActorAt(state: BVNeverState): BVActor { return ORDER[state.turn]; }

export function bvPhase(state: BVNeverState, round = state.round): BVPhase {
  const p = state.pivotRound;
  if (p !== undefined && round > p + 3) return "retombee";
  if (p !== undefined && round > p) return "revelations";
  const facadeEnd = clamp(Math.floor((state.targetEnd - 4) / 2), 2, 7);
  return round <= facadeEnd ? "facade" : "piques";
}

/** Le moment pivot est jouable par le joueur à partir de ce tour. */
function pivotWindowOpen(state: BVNeverState) {
  if (state.mode === "abregee") return false;
  return state.pivotRound === undefined && state.round >= Math.max(5, state.targetEnd - 6) && state.round <= state.targetEnd - 4;
}

/** Beat imposé au locuteur courant, s’il y en a un. */
export function bvScheduledBeat(state: BVNeverState): BVBeat["id"] | "r8" | undefined {
  const p = state.pivotRound;
  const actor = bvActorAt(state);
  if (p === undefined) {
    if (actor === "bellirith" && state.round >= (state.mode === "abregee" ? BV_SHORT_PIVOT : state.targetEnd - 4)) return "r1";
    return undefined;
  }
  const forced = state.log.find((entry) => entry.beat === "r1")?.speaker === "bellirith";
  if (forced && state.round === p && actor === "valurn" && !state.beats.includes("r1b")) return "r1b";
  const offset = state.round - p;
  if (offset >= 1 && offset <= 3 && actor !== "player") {
    const index = (offset - 1) * 2 + (actor === "bellirith" ? 0 : 1);
    const beat = REVEAL_ORDER[index];
    return state.beats.includes(beat) ? undefined : beat;
  }
  if (offset === 3 && actor === "player" && !state.beats.includes("r8")) return "r8";
  return undefined;
}

function playerTruth(truth: BVPlayerTruth, ctx: BVTruthCtx, state: BVNeverState): boolean | "ask" {
  return typeof truth === "function" ? truth(ctx, state) : truth;
}

function drinkersOf(truth: { bellirith: BVNpcTruth; valurn: BVNpcTruth }, player: boolean, state: BVNeverState): BVActor[] {
  const npc = (value: BVNpcTruth) => typeof value === "function" ? value(state) : value;
  return (["bellirith", "valurn", "player"] as BVActor[]).filter((actor) => actor === "player" ? player : npc(truth[actor]));
}

function applyRecord(state: BVNeverState, record: BVTurnRecord, extra: Partial<BVNeverState> = {}): BVNeverState {
  const pressure = { ...state.pressure }, attacks = { ...state.attacks }, drinks = { ...state.drinks };
  for (const actor of record.drinkers) drinks[actor] += 1;
  if (record.target !== "none" && record.target !== record.speaker && !record.beat) {
    const key = `${record.speaker}>${record.target}` as BVPressureKey;
    attacks[key] += 1;
    // La victime a envie de rendre le coup, davantage si la phrase a porté.
    const back = `${record.target}>${record.speaker}` as BVPressureKey;
    pressure[back] += record.drinkers.includes(record.target) ? 2 : 1;
  }
  return { ...state, ...extra, pressure, attacks, drinks, log: [...state.log, record], used: record.claimId ? [...state.used, record.claimId] : state.used };
}

function advance(state: BVNeverState): BVNeverState {
  if (state.awaiting) return state;
  let { round, turn } = state;
  turn = ((turn + 1) % 3) as 0 | 1 | 2;
  if (turn === 0) round += 1;
  let next: BVNeverState = { ...state, round, turn };
  // Le tour de table vient de se terminer : la soirée peut s’achever ici seulement.
  if (turn === 0) {
    const done = round - 1;
    const beatsDone = BV_REQUIRED_BEATS.every((beat) => next.beats.includes(beat));
    const { min, max } = bvBounds(next);
    if (beatsDone && done >= next.targetEnd && done >= min) next = finish({ ...next, round: done, turn: 2 });
    else if (done >= max) next = finish({ ...next, round: done, turn: 2 });
  }
  return next;
}

function finish(state: BVNeverState): BVNeverState {
  return { ...state, completed: true, style: bvComputeStyle(state) };
}

/** Recale la fin souhaitée sans jamais sacrifier les moments obligatoires. */
function retarget(state: BVNeverState, delta: number): BVNeverState {
  const p = state.pivotRound;
  let end = state.targetEnd + delta;
  const { min, max } = bvBounds(state);
  if (p === undefined) end = clamp(end, Math.max(min, state.round + 4), max);
  else end = clamp(end, Math.max(min, p + 4), Math.min(max, p + 6));
  return { ...state, targetEnd: end };
}

/* ------------------------------------------------------------------------ */
/* Tours des PNJ                                                             */
/* ------------------------------------------------------------------------ */

function tierFor(state: BVNeverState, speaker: BVNpc, target: BVActor): BVTier {
  const phase = bvPhase(state);
  const bonus = phase === "piques" ? 2 : phase === "retombee" ? -2 : 0;
  return clamp(Math.floor((state.pressure[`${speaker}>${target}` as BVPressureKey] + bonus) / 2), 0, 3) as BVTier;
}

function eligible(claim: BVNpcClaim, state: BVNeverState, ctx: BVTruthCtx) {
  return !state.used.includes(claim.id) && (!claim.requires || claim.requires(ctx)) && (!claim.evening || claim.evening(state));
}

/** Choix transparent pour les tests : cibles admissibles, palier et affirmation retenue. */
export function bvPlanNpc(state: BVNeverState, ctx: BVTruthCtx): { targets: BVActor[]; target: BVActor; tier: BVTier; claim: BVNpcClaim } | undefined {
  const speaker = bvActorAt(state) as BVNpc;
  if (speaker === ("player" as BVActor)) return undefined;
  const other: BVNpc = speaker === "bellirith" ? "valurn" : "bellirith";
  const phase = bvPhase(state);
  const targets: BVActor[] = [other, "player"];
  const weight = (target: BVActor) => 3 + state.pressure[`${speaker}>${target}` as BVPressureKey] * 2 + (phase === "piques" && target === other ? 2 : 0);
  const ordered = [pickWeighted(targets, weight, rnd(state, 1))!, ...targets].filter((t, i, all) => all.indexOf(t) === i);
  const banks = phase === "retombee" ? [BV_NPC_FALLOUT, BV_NPC_EVENING, BV_NPC_CLAIMS] : [BV_NPC_EVENING, BV_NPC_CLAIMS];
  // Version abrégée : au dernier tour, Bellirith vous pose la question qui reste (aveu volontaire).
  if (state.mode === "abregee" && state.pivotRound !== undefined && state.round > state.pivotRound + 3 && speaker === "bellirith") {
    const asks = [...BV_NPC_EVENING, ...BV_NPC_FALLOUT, ...BV_NPC_CLAIMS].filter((claim) => claim.speaker === speaker && claim.target === "player" && claim.truth.player === "ask" && eligible(claim, state, ctx));
    const best = asks.sort((a, b) => b.tier - a.tier)[0];
    if (best) return { targets, target: "player", tier: best.tier, claim: best };
  }
  for (const target of ordered) {
    const tier = tierFor(state, speaker, target);
    for (const bank of banks) {
      const pool = bank.filter((claim) => claim.speaker === speaker && claim.target === target && claim.phases.includes(phase) && eligible(claim, state, ctx));
      if (!pool.length) continue;
      if (bank === BV_NPC_EVENING && rnd(state, 2) > 0.6) continue;
      const byTier = [tier, tier - 1, tier - 2, tier - 3, tier + 1, tier + 2, tier + 3].filter((t) => t >= 0 && t <= 3);
      for (const t of byTier) {
        const exact = pool.filter((claim) => claim.tier === t);
        if (exact.length) return { targets, target, tier: t as BVTier, claim: exact[Math.floor(rnd(state, 3) * exact.length)] };
      }
    }
  }
  // Repli : n’importe quelle affirmation encore libre du locuteur, toutes phases confondues.
  const fallback = [...BV_NPC_FALLOUT, ...BV_NPC_CLAIMS].filter((claim) => claim.speaker === speaker && eligible(claim, state, ctx));
  if (!fallback.length) return undefined;
  const claim = fallback[Math.floor(rnd(state, 4) * fallback.length)];
  return { targets, target: claim.target, tier: claim.tier, claim };
}

/** Intervention automatique de Bellirith ou de Valurn. Sans effet si une réponse du joueur est attendue. */
export function bvNpcTurn(state: BVNeverState, ctx: BVTruthCtx): BVNeverState {
  if (state.completed || state.awaiting) return state;
  const speaker = bvActorAt(state);
  if (speaker === "player") return state;
  const beat = bvScheduledBeat(state);
  if (beat === "r1") {
    const record: BVTurnRecord = { round: state.round, speaker, claimId: BV_PIVOT_FORCED.id, target: "player", drinkers: BV_PIVOT_FORCED.drinkers, beat: "r1" };
    return advance(retarget(applyRecord(state, record, { pivotRound: state.round, beats: [...state.beats, "r1"] }), 0));
  }
  if (beat && beat !== "r8") {
    const data = beat === "r1b" ? BV_PIVOT_SILENCE : BV_REVEAL_BEATS[beat];
    const record: BVTurnRecord = { round: state.round, speaker, claimId: data.id, target: speaker === "bellirith" ? "valurn" : "bellirith", drinkers: data.drinkers, beat };
    const truths = data.knowledge && !state.truths.includes(data.knowledge) ? [...state.truths, data.knowledge] : state.truths;
    return advance(applyRecord(state, record, { beats: [...state.beats, beat], truths }));
  }
  const plan = bvPlanNpc(state, ctx);
  if (!plan) {
    const record: BVTurnRecord = { round: state.round, speaker, claimId: "", target: "none", drinkers: [] };
    return advance({ ...state, log: [...state.log, record] });
  }
  const truth = playerTruth(plan.claim.truth.player, ctx, state);
  if (truth === "ask") {
    const record: BVTurnRecord = { round: state.round, speaker, claimId: plan.claim.id, target: plan.claim.target, drinkers: drinkersOf(plan.claim.truth, false, state) };
    return applyRecord(state, record, { awaiting: plan.claim.id });
  }
  const record: BVTurnRecord = { round: state.round, speaker, claimId: plan.claim.id, target: plan.claim.target, drinkers: drinkersOf(plan.claim.truth, truth, state), playerComputed: truth || undefined };
  return advance(applyRecord(state, record));
}

/** Aveu volontaire : reconnaître (le joueur boit), nier ou esquiver (il ne boit pas). Idempotent. */
export function bvAnswer(state: BVNeverState, answer: BVAnswer): BVNeverState {
  if (!state.awaiting) return state;
  const log = [...state.log];
  const last = log[log.length - 1];
  if (!last || last.claimId !== state.awaiting) return { ...state, awaiting: undefined };
  const drinks = { ...state.drinks };
  const drinkers = answer === "acknowledge" ? [...last.drinkers, "player" as BVActor] : last.drinkers;
  if (answer === "acknowledge") drinks.player += 1;
  log[log.length - 1] = { ...last, drinkers, answer };
  const pressure = { ...state.pressure };
  if (answer === "acknowledge" && last.target === "player") pressure[`player>${last.speaker}` as BVPressureKey] += 1;
  return advance({ ...state, log, drinks, pressure, awaiting: undefined });
}

/* ------------------------------------------------------------------------ */
/* Tour du joueur                                                            */
/* ------------------------------------------------------------------------ */

function playerEligible(claim: BVPlayerClaim, state: BVNeverState, ctx: BVTruthCtx, phase: BVPhase) {
  return !state.used.includes(claim.id) && claim.phases.includes(phase) && (!claim.requires || claim.requires(ctx, state));
}

/** 4 à 6 affirmations distinctes ; jamais une option déjà jouée. */
export function bvPlayerOptions(state: BVNeverState, ctx: BVTruthCtx): BVPlayerClaim[] {
  if (state.completed || bvActorAt(state) !== "player" || state.awaiting) return [];
  const phase = bvPhase(state);
  const beat = bvScheduledBeat(state);
  if (beat === "r8") {
    const subject = BV_SUBJECT_CLAIMS.filter((claim) => !state.used.includes(claim.id) && (!claim.requires || claim.requires(ctx, state)));
    return shuffle(subject, state).slice(0, 5);
  }
  const base = (phase === "retombee" ? [...BV_PLAYER_FALLOUT, ...BV_PLAYER_CLAIMS] : BV_PLAYER_CLAIMS).filter((claim) => playerEligible(claim, state, ctx, phase));
  const options: BVPlayerClaim[] = [];
  const take = (claim?: BVPlayerClaim) => { if (claim && !options.includes(claim)) options.push(claim); };
  if (pivotWindowOpen(state)) take(shuffle(BV_PIVOT_CLAIMS.filter((claim) => !state.used.includes(claim.id)), state, 9)[0]);
  const mixed = shuffle(base, state);
  take(mixed.find((claim) => claim.target === "bellirith"));
  take(mixed.find((claim) => claim.target === "valurn"));
  take(mixed.find((claim) => claim.target === "none"));
  take(mixed.find((claim) => claim.theme === "surprise" || claim.intensity >= 2));
  for (const claim of mixed) { if (options.length >= 5) break; take(claim); }
  // Garde-fou : la banque générale complète toujours jusqu’à quatre options.
  if (options.length < 4) for (const claim of shuffle(BV_PLAYER_CLAIMS.filter((c) => !state.used.includes(c.id) && (!c.requires || c.requires(ctx, state))), state, 5)) { if (options.length >= 4) break; take(claim); }
  return shuffle(options, state, 7);
}

function shuffle<X>(items: X[], state: BVNeverState, salt = 11): X[] {
  return items.map((item, index) => ({ item, key: rnd(state, salt + index * 31) })).sort((a, b) => a.key - b.key).map((entry) => entry.item);
}

export function bvFindPlayerClaim(id: string): BVPlayerClaim | undefined {
  return [...BV_PLAYER_CLAIMS, ...BV_PLAYER_FALLOUT, ...BV_PIVOT_CLAIMS, ...BV_SUBJECT_CLAIMS].find((claim) => claim.id === id);
}

export function bvFindNpcClaim(id: string): BVNpcClaim | undefined {
  return [...BV_NPC_CLAIMS, ...BV_NPC_EVENING, ...BV_NPC_FALLOUT].find((claim) => claim.id === id);
}

/** Affirmation du joueur. Refusée si l’option n’est pas proposée à ce tour (idempotence à la reprise). */
export function bvPlayerTurn(state: BVNeverState, claimId: string, ctx: BVTruthCtx): BVNeverState {
  if (state.completed || state.awaiting || bvActorAt(state) !== "player") return state;
  const claim = bvPlayerOptions(state, ctx).find((option) => option.id === claimId);
  if (!claim) return state;
  const player = playerTruth(claim.truth.player, ctx, state) === true;
  const pivot = BV_PIVOT_CLAIMS.includes(claim);
  const subject = BV_SUBJECT_CLAIMS.includes(claim);
  const record: BVTurnRecord = { round: state.round, speaker: "player", claimId: claim.id, target: claim.target, drinkers: drinkersOf(claim.truth, player, state), playerComputed: player || undefined, beat: pivot ? "r1" : undefined };
  let next = applyRecord(state, record, pivot ? { pivotRound: state.round, beats: [...state.beats, "r1"] } : subject ? { beats: [...state.beats, "r8"] } : {});
  if (pivot) {
    // L’attaque visait peut-être quelqu’un : elle compte comme une provocation.
    if (claim.target !== "none") next = { ...next, attacks: { ...next.attacks, [`player>${claim.target}`]: next.attacks[`player>${claim.target}` as BVPressureKey] + 1 } };
  }
  next = retarget(next, pivot || subject ? 0 : claim.pace);
  return advance(next);
}

/* ------------------------------------------------------------------------ */
/* Lecture : lignes affichées pour une intervention                          */
/* ------------------------------------------------------------------------ */

const NAMES: Record<BVActor, string> = { bellirith: "Bellirith", valurn: "Valurn", player: "{player}" };

/** Étapes d’un échange, toujours dans cet ordre : votre réplique, qui boit, réactions qui vous sont adressées, échanges entre eux, geste final. */
export const BV_STEPS = ["reponse", "verres", "a-vous", "entre-eux", "geste"] as const;
export type BVStep = typeof BV_STEPS[number];
export type BVViewLine = DialogueLine & { step: BVStep; to?: string };
/** Au plus trois répliques de personnages après le verdict des verres (hors moments clés écrits d’un bloc). */
export const BV_MAX_REACTIONS = 3;

export type BVRecordView = {
  record: BVTurnRecord;
  declaration: DialogueLine & { to?: string };
  lines: BVViewLine[];
  /** Explication visible quand le moteur fait boire le joueur. */
  playerReason?: string;
  ask?: string;
};

const ADDRESSED_TO_PLAYER = /\b(?:vous|votre|vos)\b|\{player\}/iu;
const TARGET_NAME = (target: BVActor | "none") => target === "none" ? "la table" : target === "player" ? "vous" : NAMES[target];
const isNarration = (line: DialogueLine) => line.speaker === "Narration";
const otherOf = (speaker: string) => speaker === "Bellirith" ? "Valurn" : speaker === "Valurn" ? "Bellirith" : undefined;

function drinkLine(record: BVTurnRecord, authored?: DialogueLine): BVViewLine {
  const d = record.drinkers;
  const npcs = (["bellirith", "valurn"] as BVNpc[]).filter((who) => d.includes(who)).map((who) => NAMES[who]);
  const playerPart = d.includes("player") ? (npcs.length ? "Vous buvez aussi." : "Vous êtes seul à boire.") : "Votre verre reste plein.";
  if (authored && !ADDRESSED_TO_PLAYER.test(authored.text)) return { ...authored, step: "verres", text: `${authored.text} ${playerPart}` };
  if (authored) return { ...authored, step: "verres" };
  const npcPart = npcs.length === 2 ? "Bellirith et Valurn boivent." : npcs.length === 1 ? `${npcs[0]} boit.` : d.includes("player") ? "" : "Personne ne boit.";
  return { speaker: "Narration", step: "verres", text: [npcPart, playerPart].filter(Boolean).join(" ") };
}

/** Assemble un échange ordinaire dans l’ordre fixe. */
function orderExchange(record: BVTurnRecord, playerLine: DialogueLine | undefined, authored: DialogueLine[], toPlayer: DialogueLine[], playerTo: string): BVViewLine[] {
  const lines: BVViewLine[] = [];
  if (playerLine) lines.push({ ...playerLine, step: "reponse", to: playerTo });
  const lead = authored[0] && isNarration(authored[0]) ? authored[0] : undefined;
  lines.push(drinkLine(record, lead));
  const rest = lead ? authored.slice(1) : authored;
  const said = rest.filter((line) => !isNarration(line));
  const gesture = rest.filter(isNarration).slice(-1);
  const mine = [...toPlayer, ...said.filter((line) => ADDRESSED_TO_PLAYER.test(line.text))];
  const theirs = said.filter((line) => !ADDRESSED_TO_PLAYER.test(line.text));
  const seen = new Set<string>();
  let budget = BV_MAX_REACTIONS;
  for (const line of mine) { if (budget <= 0 || seen.has(line.text)) continue; seen.add(line.text); budget--; lines.push({ ...line, step: "a-vous", to: "vous" }); }
  for (const line of theirs) { if (budget <= 0 || seen.has(line.text)) continue; seen.add(line.text); budget--; lines.push({ ...line, step: "entre-eux", to: otherOf(line.speaker) }); }
  for (const line of gesture) lines.push({ ...line, step: "geste" });
  return lines;
}

export function bvRecordView(state: BVNeverState, index: number): BVRecordView | undefined {
  const record = state.log[index];
  if (!record) return undefined;
  if (record.beat && record.speaker !== "player") {
    // Moments clés (tournant, révélations) : texte écrit d’un bloc, gardé intact ; seul le verdict des verres passe en tête.
    const data = record.beat === "r1" ? BV_PIVOT_FORCED : record.beat === "r1b" ? BV_PIVOT_SILENCE : BV_REVEAL_BEATS[record.beat as Exclude<BVBeat["id"], "r1" | "r1b">];
    // Le récit des moments clés reste dans l’ordre écrit (révélations) ; le verdict des verres passe toujours en tête.
    const lead = data.lines[0] && isNarration(data.lines[0]) ? data.lines[0] : undefined;
    const rest = (lead ? data.lines.slice(1) : data.lines).map((line): BVViewLine => isNarration(line) ? { ...line, step: "geste" } : ADDRESSED_TO_PLAYER.test(line.text) ? { ...line, step: "a-vous", to: "vous" } : { ...line, step: "entre-eux", to: otherOf(line.speaker) });
    return { record, declaration: { speaker: NAMES[record.speaker], text: data.text, mood: data.mood, to: TARGET_NAME(record.target) }, lines: [drinkLine(record, lead), ...rest] };
  }
  if (record.speaker === "player") {
    const claim = bvFindPlayerClaim(record.claimId);
    if (!claim) return undefined;
    const choice = bvChoiceLines(state, index);
    const toPlayer = record.drinkers.includes("player") && claim.ifPlayerDrinks?.length ? [claim.ifPlayerDrinks[0]] : choice.after.slice(0, 1);
    const lines = orderExchange(record, choice.before[0], claim.lines, toPlayer, TARGET_NAME(claim.target));
    return { record, declaration: { speaker: NAMES.player, text: claim.text, to: TARGET_NAME(claim.target) }, lines, playerReason: record.playerComputed ? claim.why : undefined };
  }
  const claim = bvFindNpcClaim(record.claimId);
  if (!claim) return { record, declaration: { speaker: NAMES[record.speaker], text: "…", mood: "neutral" }, lines: [] };
  const asked = claim.truth.player === "ask";
  const choice = record.answer ? bvChoiceLines(state, index) : { before: [], after: [] };
  const extra = record.drinkers.includes("player") ? claim.ifPlayerDrinks || [] : claim.ifPlayerDry || [];
  const toPlayer = record.answer ? choice.after.slice(0, 1) : asked ? [] : extra.slice(0, 1);
  return {
    record, declaration: { speaker: NAMES[record.speaker], text: claim.text, mood: claim.mood, to: TARGET_NAME(claim.target) },
    lines: orderExchange(record, choice.before[0], claim.lines, toPlayer, NAMES[record.speaker]),
    playerReason: record.playerComputed ? claim.why : undefined,
    ask: asked ? claim.ask || "Reconnaître, nier ou esquiver ?" : undefined,
  };
}



/* ------------------------------------------------------------------------ */
/* Ivresse et répliques de choix                                             */
/* ------------------------------------------------------------------------ */

/** Seuils d’ivresse : gris à partir de 3 verres, ivre à partir de 6. La jauge plafonne à 8. */
export const BV_IVRESSE_GRIS = 3;
export const BV_IVRESSE_IVRE = 6;
export const BV_IVRESSE_MAX = 8;
export function bvIvresse(drinks: number, mode?: BVMode): BVIvresse {
  const t = bvIvresseSeuils(mode);
  return drinks >= t.ivre ? "ivre" : drinks >= t.gris ? "gris" : "sobre";
}
/** La version abrégée compte moins de tours : les seuils sont ramenés à proportion (gris 2, ivre 4, jauge 5). */
export function bvIvresseSeuils(mode?: BVMode) { return mode === "abregee" ? { gris: 2, ivre: 4, max: 5 } : { gris: BV_IVRESSE_GRIS, ivre: BV_IVRESSE_IVRE, max: BV_IVRESSE_MAX }; }

/** Verres bus par chacun jusqu’à l’intervention `index` incluse. */
export function bvDrinksAt(state: BVNeverState, index: number): Record<BVActor, number> {
  const drinks: Record<BVActor, number> = { bellirith: 0, valurn: 0, player: 0 };
  for (const entry of state.log.slice(0, index + 1)) for (const actor of entry.drinkers) drinks[actor] += 1;
  return drinks;
}

/** Crans de pression quand un convive vous somme de répondre (1 à 4).
 * Base : palier de l’affirmation (lui-même tiré de la pression accumulée contre vous, 0 à 3).
 * +1 si la question vient après la bascule ou si celui qui presse est ivre. Plafond 4. */
export const BV_PRESSION_MAX = 4;
export function bvPressionLevel(state: BVNeverState, index: number): number {
  const record = state.log[index];
  if (!record || record.speaker === "player") return 0;
  const claim = bvFindNpcClaim(record.claimId);
  if (!claim) return 0;
  const after = state.pivotRound !== undefined && record.round > state.pivotRound;
  const drunk = bvIvresse(bvDrinksAt(state, index)[record.speaker], state.mode) === "ivre";
  const base = 1 + claim.tier + (after || drunk ? 1 : 0);
  // Version abrégée : la dernière question, après les révélations, presse au maximum.
  if (state.mode === "abregee" && state.pivotRound !== undefined && record.round > state.pivotRound + 3) return BV_PRESSION_MAX;
  return Math.min(BV_PRESSION_MAX, base);
}

export type BVChoiceLines = { before: DialogueLine[]; after: DialogueLine[] };

function hashKey(seed: number, round: number, salt: string) {
  let h = 2166136261 ^ seed ^ Math.imul(round, 2654435761);
  for (let i = 0; i < salt.length; i++) h = Math.imul(h ^ salt.charCodeAt(i), 16777619);
  return h >>> 0;
}
/** Groupes ordonnés du plus ivre au plus sobre : la variante d’ivresse passe d’abord, la banque sobre sert de réserve. */
function tiered(base: DialogueLine[], tiers: BVTiers | undefined, level: BVIvresse): DialogueLine[][] {
  if (!tiers || level === "sobre") return [base];
  return level === "ivre" ? [tiers.ivre, tiers.gris, base] : [tiers.gris, base];
}
/** Première réplique encore inédite ce soir, dans un ordre mélangé par la graine. Jamais de répétition. */
function draw(groups: DialogueLine[][], used: Set<string>, seed: number, round: number, salt: string): DialogueLine | undefined {
  for (const [g, group] of groups.entries()) {
    const start = group.length ? hashKey(seed, round, `${salt}:${g}`) % group.length : 0;
    for (let i = 0; i < group.length; i++) {
      const line = group[(start + i) % group.length];
      if (!used.has(line.text)) { used.add(line.text); return line; }
    }
  }
  return undefined;
}

function choiceLinesFor(state: BVNeverState, index: number, used: Set<string>): BVChoiceLines {
  const record = state.log[index];
  const none: BVChoiceLines = { before: [], after: [] };
  if (!record) return none;
  const drinks = bvDrinksAt(state, index);
  const lvl = (actor: BVActor) => bvIvresse(drinks[actor], state.mode);
  const seed = state.seed, round = record.round;
  const npcs: BVNpc[] = ["bellirith", "valurn"];
  if (record.speaker === "player") {
    const claim = bvFindPlayerClaim(record.claimId);
    if (!claim) return none;
    const solemn = record.beat === "r1" || BV_SUBJECT_CLAIMS.includes(claim);
    const key = claim.target;
    const lead = solemn
      ? draw(tiered(BV_PLAYER_LEADS_SOLEMN, BV_PLAYER_LEADS_SOLEMN_T, lvl("player")), used, seed, round, "lead-solemn")
      : draw([...tiered(BV_PLAYER_LEADS[key], BV_PLAYER_LEADS_T[key], lvl("player")), ...tiered(BV_PLAYER_LEADS.generic, BV_PLAYER_LEADS_T.generic, lvl("player"))], used, seed, round, `lead-${key}`);
    // La cible réagit toujours ; l’autre convive une fois sur deux (toujours si personne n’est visé).
    const order: BVNpc[] = key === "valurn" ? ["valurn", "bellirith"] : key === "bellirith" ? ["bellirith", "valurn"] : (hashKey(seed, round, "who") % 2 ? ["valurn", "bellirith"] : ["bellirith", "valurn"]);
    const after: DialogueLine[] = [];
    for (const [i, npc] of order.entries()) {
      if (i === 1 && key !== "none" && hashKey(seed, round, `second-${npc}`) % 2) continue;
      const level = lvl(npc);
      const role = key === npc ? "target" : "bystander";
      const reactionKey = `${role}-${record.drinkers.includes(npc) ? "drank" : "dry"}` as keyof typeof BV_STATEMENT_REACTIONS.bellirith;
      const groups = solemn
        ? [...tiered(BV_STATEMENT_SOLEMN[npc], BV_STATEMENT_SOLEMN_T[npc], level), ...tiered(BV_STATEMENT_GENERIC[npc], BV_STATEMENT_GENERIC_T[npc], level)]
        : [
          ...(bvPhase(state, round) === "retombee" ? tiered(BV_STATEMENT_FALLOUT[npc], BV_STATEMENT_FALLOUT_T[npc], level) : []),
          ...(role === "target" || key === "none" ? tiered(BV_THEME_REACTIONS[npc][claim.theme], BV_THEME_REACTIONS_T[npc][claim.theme], level) : []),
          ...tiered(BV_STATEMENT_REACTIONS[npc][reactionKey], BV_STATEMENT_REACTIONS_T[npc][reactionKey], level),
          ...tiered(BV_STATEMENT_GENERIC[npc], BV_STATEMENT_GENERIC_T[npc], level),
        ];
      // Le thème ne passe en premier qu’une fois sur deux, pour que l’issue (boire ou non) reste audible.
      const ordered = !solemn && hashKey(seed, round, `theme-${npc}`) % 2 ? groups.slice().sort((a, b) => Number(isTheme(a, npc, claim.theme)) - Number(isTheme(b, npc, claim.theme))) : groups;
      const line = draw(ordered, used, seed, round, `react-${npc}`);
      if (line) { after.push(line); break; }
    }
    return { before: lead ? [lead] : [], after };
  }
  if (record.answer) {
    const answer = record.answer;
    const say = draw(tiered(BV_PLAYER_ANSWERS[answer], BV_PLAYER_ANSWERS_T[answer], lvl("player")), used, seed, round, `answer-${answer}`);
    const asker = record.speaker as BVNpc;
    const other: BVNpc = asker === "bellirith" ? "valurn" : "bellirith";
    const after: DialogueLine[] = [];
    for (const npc of [asker, other]) {
      if (npc === other && hashKey(seed, round, `answer-other-${npc}`) % 5 >= 3) continue;
      const level = lvl(npc);
      const role = npc === asker ? "asker" : "other";
      if (after.length) break;
      const line = draw([...tiered(BV_ANSWER_REACTIONS[npc][role][answer], BV_ANSWER_REACTIONS_T[npc][role][answer], level), ...tiered(BV_ANSWER_GENERIC[npc], BV_ANSWER_GENERIC_T[npc], level)], used, seed, round, `answer-${npc}`);
      if (line) after.push(line);
    }
    return { before: say ? [say] : [], after };
  }
  return none;
}
function isTheme(group: DialogueLine[], npc: BVNpc, theme: BVTheme) {
  return group === BV_THEME_REACTIONS[npc][theme] || group === BV_THEME_REACTIONS_T[npc][theme].gris || group === BV_THEME_REACTIONS_T[npc][theme].ivre;
}

/** Répliques de choix de l’intervention `index` : votre phrase, puis les réactions. Aucune réplique déjà entendue ce soir. */
export function bvChoiceLines(state: BVNeverState, index: number): BVChoiceLines {
  const used = new Set<string>();
  let result: BVChoiceLines = { before: [], after: [] };
  for (let i = 0; i <= index && i < state.log.length; i++) result = choiceLinesFor(state, i, used);
  return result;
}


/** Passage entre deux tours : ce qui vient de se passer (réponse, pression, qui a bu), puis l’ambiance
 * (avant ou après le tournant, ivresse de la table ; version abrégée à part). Aucune phrase répétée dans la soirée. */
export type BVTransitionInfo = { line: DialogueLine; lead?: BVTransitionLead; mood: BVTransitionMood | BVPhase; tier: BVIvresse; after: boolean };
export function bvTransitionInfo(state: BVNeverState, round = state.round): BVTransitionInfo | undefined {
  if (round <= 1) return undefined;
  const used = new Set<string>();
  let info: BVTransitionInfo | undefined;
  for (let r = 2; r <= round; r++) info = transitionFor(state, r, used);
  return info;
}
export function bvTransition(state: BVNeverState, round = state.round): DialogueLine | undefined { return bvTransitionInfo(state, round)?.line; }

function transitionFor(state: BVNeverState, round: number, used: Set<string>): BVTransitionInfo {
  const prevIndex = state.log.map((entry) => entry.round).lastIndexOf(round - 1);
  const prev = state.log.filter((entry) => entry.round === round - 1);
  const drinks = bvDrinksAt(state, prevIndex);
  const levels = (["bellirith", "valurn", "player"] as BVActor[]).map((actor) => bvIvresse(drinks[actor], state.mode));
  // L’ambiance suit votre propre ivresse : la narration est à votre hauteur.
  const tier: BVIvresse = levels[2];
  const after = state.pivotRound !== undefined && state.pivotRound < round;
  const answered = [...prev].reverse().find((entry) => entry.answer);
  const last = prev[prev.length - 1];
  let lead: BVTransitionLead | undefined;
  if (answered) lead = bvPressionLevel(state, state.log.indexOf(answered)) >= 3 ? "pression" : `answer-${answered.answer!}` as BVTransitionLead;
  else if (last) {
    const d = last.drinkers;
    lead = d.length === 3 ? "drank-all" : !d.length ? "drank-none" : d.includes("player") ? "drank-player" : d.includes("bellirith") ? "drank-bellirith" : "drank-valurn";
  }
  const pick = (pools: string[][], salt: string) => {
    for (const [i, pool] of pools.entries()) {
      const start = pool.length ? hashKey(state.seed, round, `${salt}:${i}`) % pool.length : 0;
      for (let k = 0; k < pool.length; k++) { const text = pool[(start + k) % pool.length]; if (!used.has(text)) { used.add(text); return text; } }
    }
    return undefined;
  };
  const leadText = lead ? pick([BV_TRANSITION_LEADS[lead], ...Object.values(BV_TRANSITION_LEADS)], "lead") : undefined;
  const side = after ? "apres" : "avant";
  const tierMood = `${side}-${tier}` as BVTransitionMood;
  const moodKey: BVTransitionMood = state.mode === "abregee" ? `court-${side}` as BVTransitionMood : tierMood;
  const order: BVTransitionMood[] = [moodKey, tierMood, ...(["sobre", "gris", "ivre"] as BVIvresse[]).map((t) => `${side}-${t}` as BVTransitionMood)];
  const moodText = pick([...order.map((key) => BV_TRANSITION_MOODS[key]), BV_TRANSITIONS[bvPhase(state, round)].map((line) => line.text), ...Object.values(BV_TRANSITIONS).map((pool) => pool.map((line) => line.text))], "mood");
  const text = [leadText, moodText].filter(Boolean).join(" ");
  return { line: { speaker: "Narration", text }, lead, mood: moodKey, tier, after };
}

/* ------------------------------------------------------------------------ */
/* Style, sauvegarde et rejouabilité                                         */
/* ------------------------------------------------------------------------ */

export function bvComputeStyle(state: BVNeverState): BVStyle {
  const a = state.attacks["player>bellirith"], v = state.attacks["player>valurn"];
  const playerTurns = state.log.filter((entry) => entry.speaker === "player").length;
  if (a >= 3 && v >= 3 && Math.abs(a - v) <= 2) return "double-provocateur";
  if (a >= 3 && a >= v + 2) return "bellirith-provocateur";
  if (v >= 3 && v >= a + 2) return "valurn-provocateur";
  if (a + v <= Math.max(2, Math.floor(playerTurns * 0.35))) return "discret";
  return "equilibre";
}

/** Flags durables, non punitifs, écrits une seule fois à la fin de la partie. */
export function bvNeverStyleFlags(state: BVNeverState): string[] {
  const style = state.style || bvComputeStyle(state);
  const flags = [`bv-never:player-style:${style}`, `bv-never:rounds:${state.round}`];
  const hit = (target: BVNpc) => state.log.filter((entry) => entry.speaker === "player" && entry.target === target && entry.drinkers.includes(target)).length;
  if (hit("bellirith") >= 3) flags.push("bv-never:bellirith-precision-impressed");
  if (hit("valurn") >= 3) flags.push("bv-never:valurn-precision-impressed");
  if (state.log.some((entry) => entry.speaker === "player" && entry.drinkers.includes("player"))) flags.push("bv-never:player-accidental-truth");
  if (state.log.some((entry) => entry.answer === "acknowledge")) flags.push("bv-never:player-admitted");
  if (state.log.some((entry) => entry.drinkers.length === 3)) flags.push("bv-never:all-three-drank");
  if (state.drinks.player >= 6) flags.push("bv-never:player-drank-many");
  if (state.log.find((entry) => entry.beat === "r1")?.speaker === "player") flags.push("bv-never:player-opened-the-door");
  return flags;
}

export function bvHydrateNever(raw: unknown): BVNeverState | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const source = raw as Partial<BVNeverState>;
  const base = createBVNever(Number(source.seed) || 1);
  const num = (value: unknown, fallback: number) => Number.isFinite(Number(value)) ? Number(value) : fallback;
  const keyed = (value: unknown) => Object.fromEntries(KEYS.map((key) => [key, Math.max(0, num((value as Record<string, unknown> | undefined)?.[key], 0))])) as Record<BVPressureKey, number>;
  const log = Array.isArray(source.log) ? source.log.filter((entry): entry is BVTurnRecord => Boolean(entry && typeof entry === "object" && typeof (entry as BVTurnRecord).claimId === "string" && ORDER.includes((entry as BVTurnRecord).speaker))) : [];
  const mode = source.mode === "complete" || source.mode === "abregee" ? { mode: source.mode } : {};
  const state: BVNeverState = {
    ...base, ...mode,
    round: clamp(Math.trunc(num(source.round, 1)), 1, bvBounds(mode).max),
    turn: ([0, 1, 2].includes(Number(source.turn)) ? Number(source.turn) : 0) as 0 | 1 | 2,
    targetEnd: clamp(Math.trunc(num(source.targetEnd, bvBounds(mode).end)), bvBounds(mode).min, bvBounds(mode).max),
    pivotRound: Number.isInteger(source.pivotRound) ? source.pivotRound : undefined,
    beats: Array.isArray(source.beats) ? source.beats.filter((beat) => typeof beat === "string") : [],
    used: Array.isArray(source.used) ? source.used.filter((id) => typeof id === "string") : [],
    log,
    pressure: keyed(source.pressure), attacks: keyed(source.attacks),
    drinks: { bellirith: num(source.drinks?.bellirith, 0), valurn: num(source.drinks?.valurn, 0), player: num(source.drinks?.player, 0) },
    awaiting: typeof source.awaiting === "string" ? source.awaiting : undefined,
    truths: Array.isArray(source.truths) ? source.truths.filter((id) => typeof id === "string") : [],
    completed: source.completed === true,
    style: source.style,
    tutorialSeen: source.tutorialSeen === true,
  };
  return state;
}

/** Ordre des savoirs acquis à la table (journal). */
export const BV_KNOWLEDGE_ORDER = ["bellirith-wanted-humanity", "bv-talisman-transfer", "bv-artifact-actual-effect", "bv-abandon-chosen"] as const;

/** Musique de la soirée : le thème léger jusqu’au tournant, la version tendue à partir du tournant (restaurée depuis la sauvegarde). */
export const BV_NEVER_CROSSFADE_MS = 2400;
export const BV_NEVER_MUSIC = { jeu: "bv-never-jeu", tournant: "bv-never-tournant" } as const;
export function bvNeverMusic(state: Pick<BVNeverState, "pivotRound"> | undefined): string {
  return state?.pivotRound !== undefined ? BV_NEVER_MUSIC.tournant : BV_NEVER_MUSIC.jeu;
}
