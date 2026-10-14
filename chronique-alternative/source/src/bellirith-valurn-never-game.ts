import type { DialogueLine } from "./game-data";
import type { BVStyle } from "./bellirith-valurn-scenes";
import {
  BV_NPC_CLAIMS, BV_NPC_EVENING, BV_NPC_FALLOUT, BV_PIVOT_CLAIMS, BV_PIVOT_FORCED, BV_PIVOT_SILENCE, BV_PLAYER_CLAIMS, BV_PLAYER_FALLOUT, BV_REVEAL_BEATS,
  BV_RESULT_RETORTS, BV_SUBJECT_CLAIMS, BV_TRANSITIONS,
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
};

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

export function createBVNever(seed = 1): BVNeverState {
  return { version: 1, seed: Math.abs(Math.trunc(seed)) || 1, round: 1, turn: 0, targetEnd: BV_DEFAULT_END, beats: [], used: [], log: [], pressure: zero(), attacks: zero(), drinks: { bellirith: 0, valurn: 0, player: 0 }, truths: [] };
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
  return state.pivotRound === undefined && state.round >= Math.max(5, state.targetEnd - 6) && state.round <= state.targetEnd - 4;
}

/** Beat imposé au locuteur courant, s’il y en a un. */
export function bvScheduledBeat(state: BVNeverState): BVBeat["id"] | "r8" | undefined {
  const p = state.pivotRound;
  const actor = bvActorAt(state);
  if (p === undefined) {
    if (actor === "bellirith" && state.round >= state.targetEnd - 4) return "r1";
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
    if (beatsDone && done >= next.targetEnd && done >= BV_MIN_ROUNDS) next = finish({ ...next, round: done, turn: 2 });
    else if (done >= BV_MAX_ROUNDS) next = finish({ ...next, round: done, turn: 2 });
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
  if (p === undefined) end = clamp(end, Math.max(BV_MIN_ROUNDS, state.round + 4), BV_MAX_ROUNDS);
  else end = clamp(end, Math.max(BV_MIN_ROUNDS, p + 4), Math.min(BV_MAX_ROUNDS, p + 6));
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

export type BVRecordView = {
  record: BVTurnRecord;
  declaration: DialogueLine;
  lines: DialogueLine[];
  /** Explication visible quand le moteur fait boire le joueur. */
  playerReason?: string;
  ask?: string;
};

export function bvRecordView(state: BVNeverState, index: number): BVRecordView | undefined {
  const record = state.log[index];
  if (!record) return undefined;
  if (record.beat && record.speaker !== "player") {
    const data = record.beat === "r1" ? BV_PIVOT_FORCED : record.beat === "r1b" ? BV_PIVOT_SILENCE : BV_REVEAL_BEATS[record.beat as Exclude<BVBeat["id"], "r1" | "r1b">];
    return { record, declaration: { speaker: NAMES[record.speaker], text: data.text, mood: data.mood }, lines: data.lines };
  }
  if (record.speaker === "player") {
    const claim = bvFindPlayerClaim(record.claimId);
    if (!claim) return undefined;
    const lines = [...claim.lines, ...(record.drinkers.includes("player") && claim.ifPlayerDrinks ? claim.ifPlayerDrinks : []), ...retort(state, index, record)];
    return { record, declaration: { speaker: NAMES.player, text: claim.text }, lines, playerReason: record.playerComputed ? claim.why : undefined };
  }
  const claim = bvFindNpcClaim(record.claimId);
  if (!claim) return { record, declaration: { speaker: NAMES[record.speaker], text: "…", mood: "neutral" }, lines: [] };
  const drank = record.drinkers.includes("player");
  const extra = drank ? claim.ifPlayerDrinks || [] : claim.ifPlayerDry || [];
  return {
    record, declaration: { speaker: NAMES[record.speaker], text: claim.text, mood: claim.mood },
    lines: [...claim.lines, ...(record.answer || record.playerComputed !== undefined || claim.truth.player !== "ask" ? extra : []), ...retort(state, index, record)],
    playerReason: record.playerComputed ? claim.why : undefined,
    ask: claim.truth.player === "ask" ? claim.ask || "Reconnaître, nier ou esquiver ?" : undefined,
  };
}

function resultKey(drinkers: BVActor[]) {
  const set = new Set(drinkers);
  return (["bellirith", "valurn", "player"] as BVActor[]).filter((actor) => set.has(actor)).map((actor) => actor[0]).join("") || "none";
}

/** Réplique de résultat : seulement quand le résultat surprend (personne, tout le monde, ou l’auteur qui boit). */
function retort(state: BVNeverState, index: number, record: BVTurnRecord): DialogueLine[] {
  const unexpected = record.drinkers.length === 0 || record.drinkers.length === 3 || record.drinkers.includes(record.speaker)
    || (record.target !== "none" && record.drinkers.length > 0 && !record.drinkers.includes(record.target));
  if (!unexpected || record.beat) return [];
  const pool = BV_RESULT_RETORTS[resultKey(record.drinkers)] || [];
  if (!pool.length) return [];
  const used = state.log.slice(0, index).filter((entry) => resultKey(entry.drinkers) === resultKey(record.drinkers)).length;
  return [pool[used % pool.length]];
}

/** Transition d’ambiance au début d’un tour de table (aucun tour consommé). */
export function bvTransition(state: BVNeverState, round = state.round): DialogueLine | undefined {
  if (round <= 1) return undefined;
  const phase = bvPhase(state, round);
  const pool = BV_TRANSITIONS[phase];
  return pool[(round * 3 + state.seed) % pool.length];
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
  const state: BVNeverState = {
    ...base,
    round: clamp(Math.trunc(num(source.round, 1)), 1, BV_MAX_ROUNDS),
    turn: ([0, 1, 2].includes(Number(source.turn)) ? Number(source.turn) : 0) as 0 | 1 | 2,
    targetEnd: clamp(Math.trunc(num(source.targetEnd, BV_DEFAULT_END)), BV_MIN_ROUNDS, BV_MAX_ROUNDS),
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
