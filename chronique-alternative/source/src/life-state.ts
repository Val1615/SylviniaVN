/**
 * Vie quotidienne · état sauvegardé facultatif (`GameState.life`) et logique pure.
 * Sauvegarde v18 inchangée : absent = état vide ; normalisé à la lecture (identifiants inconnus filtrés).
 * Aucune fonction de ce module ne lit ni n’écrit le Désir ou l’étape d’une relation.
 */
import { imperialDate, type SeasonId } from "./calendar";
import { weatherAt, type WeatherId } from "./weather";
import { MOOD_MEMORY_DAYS, MOODS, type MoodEvent, type MoodEventKind, type MoodId } from "./life-moods";
import { activityById, type ActivityId } from "./life-activities";
import { LETTER_THEMES, type LetterTheme } from "./life-initiative-texts";
import { ASPIRATIONS, WISHES, WISH_EXCLUDED_CHARACTERS, type WishCondition, type WishReward, type WishTemplate } from "./life-wishes";
import type { StatKey } from "./game-data";

export type PlayerInvite = { id: string; character: string; location: string; spot: string; day: number; period: number; status: "accepted" | "honored" | "missed" | "excused"; createdDay: number; viaLetter?: boolean };
export type SentLetter = { id: string; character: string; theme: LetterTheme; day: number; replyDay: number; read: boolean; high: boolean; accepted?: boolean; inviteId?: string; applied?: boolean };
export type CharacterNote = { id: string; character: string; kind: "manque" | "excuse"; day: number; read: boolean };
export type ActiveWish = { id: string; character?: string; createdDay: number; expiresDay: number; done?: number };
export type AspirationProgress = { steps: string[]; counters: Record<string, number>; lists: Record<string, string[]>; chosenDay: number };

export type LifeState = {
  moodEvents: MoodEvent[];
  giftDay: Record<string, number>;
  activityDay: Record<string, { day: number; count: number }>;
  discovered: Record<string, string[]>;
  invites: PlayerInvite[];
  refusals: Record<string, { count: number; untilDay?: number }>;
  letters: SentLetter[];
  notes: CharacterNote[];
  wishes: ActiveWish[];
  wishHistory: Record<string, number>;
  wishesRolled: number;
  aspiration?: string;
  aspirations: Record<string, AspirationProgress>;
  titles: string[];
};

export function emptyLife(): LifeState {
  return { moodEvents: [], giftDay: {}, activityDay: {}, discovered: {}, invites: [], refusals: {}, letters: [], notes: [], wishes: [], wishHistory: {}, wishesRolled: 0, aspirations: {}, titles: [] };
}

const MOOD_KINDS: MoodEventKind[] = ["cadeau-aime", "cadeau-neutre", "cadeau-deteste", "rdv-honore", "rdv-manque", "activite", "lettre", "excuse"];
const num = (value: unknown, fallback = 0) => (Number.isFinite(Number(value)) ? Number(value) : fallback);
const obj = (value: unknown): Record<string, unknown> => (value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {});
const arr = (value: unknown): unknown[] => (Array.isArray(value) ? value : []);

/** Normalise un état lu dans une sauvegarde : tout champ inconnu ou invalide est filtré, rien n’est inventé. */
export function normalizeLife(raw: unknown, characters: readonly string[], spots: readonly string[], locations: readonly string[], gifts: readonly string[]): LifeState {
  const base = emptyLife();
  if (!raw || typeof raw !== "object") return base;
  const value = obj(raw);
  const isChar = (id: unknown): id is string => typeof id === "string" && characters.includes(id);
  base.moodEvents = arr(value.moodEvents).map(obj).filter((e) => isChar(e.character) && MOOD_KINDS.includes(e.kind as MoodEventKind)).map((e) => ({ character: e.character as string, kind: e.kind as MoodEventKind, day: Math.max(1, num(e.day, 1)) }));
  for (const [id, day] of Object.entries(obj(value.giftDay))) if (isChar(id)) base.giftDay[id] = num(day);
  for (const [id, entry] of Object.entries(obj(value.activityDay))) if (isChar(id)) base.activityDay[id] = { day: num(obj(entry).day), count: Math.max(0, num(obj(entry).count)) };
  for (const [id, list] of Object.entries(obj(value.discovered))) if (isChar(id)) base.discovered[id] = arr(list).filter((g): g is string => typeof g === "string" && gifts.includes(g));
  base.invites = arr(value.invites).map(obj).filter((e) => typeof e.id === "string" && isChar(e.character) && spots.includes(e.spot as string) && locations.includes(e.location as string) && ["accepted", "honored", "missed", "excused"].includes(e.status as string))
    .map((e) => ({ id: e.id as string, character: e.character as string, location: e.location as string, spot: e.spot as string, day: Math.max(1, num(e.day, 1)), period: Math.min(3, Math.max(0, num(e.period))), status: e.status as PlayerInvite["status"], createdDay: Math.max(1, num(e.createdDay, 1)), ...(e.viaLetter ? { viaLetter: true } : {}) }));
  for (const [id, entry] of Object.entries(obj(value.refusals))) if (isChar(id)) base.refusals[id] = { count: Math.max(0, num(obj(entry).count)), ...(obj(entry).untilDay !== undefined ? { untilDay: num(obj(entry).untilDay) } : {}) };
  base.letters = arr(value.letters).map(obj).filter((e) => typeof e.id === "string" && isChar(e.character) && (e.theme as string) in LETTER_THEMES)
    .map((e) => ({ id: e.id as string, character: e.character as string, theme: e.theme as LetterTheme, day: Math.max(1, num(e.day, 1)), replyDay: Math.max(1, num(e.replyDay, 1)), read: Boolean(e.read), high: Boolean(e.high), ...(typeof e.accepted === "boolean" ? { accepted: e.accepted } : {}), ...(typeof e.inviteId === "string" ? { inviteId: e.inviteId } : {}), ...(e.applied ? { applied: true } : {}) }));
  base.notes = arr(value.notes).map(obj).filter((e) => typeof e.id === "string" && isChar(e.character) && (e.kind === "manque" || e.kind === "excuse")).map((e) => ({ id: e.id as string, character: e.character as string, kind: e.kind as CharacterNote["kind"], day: Math.max(1, num(e.day, 1)), read: Boolean(e.read) }));
  base.wishes = arr(value.wishes).map(obj).filter((e) => WISHES.some((w) => w.id === e.id) && (e.character === undefined || isChar(e.character)))
    .map((e) => ({ id: e.id as string, ...(isChar(e.character) ? { character: e.character } : {}), createdDay: Math.max(1, num(e.createdDay, 1)), expiresDay: Math.max(1, num(e.expiresDay, 1)), ...(e.done !== undefined ? { done: num(e.done) } : {}) }));
  for (const [id, day] of Object.entries(obj(value.wishHistory))) if (WISHES.some((w) => id.startsWith(w.id))) base.wishHistory[id] = num(day);
  base.wishesRolled = num(value.wishesRolled);
  base.aspiration = ASPIRATIONS.some((a) => a.id === value.aspiration) ? value.aspiration as string : undefined;
  for (const [id, entry] of Object.entries(obj(value.aspirations))) {
    const aspiration = ASPIRATIONS.find((a) => a.id === id);
    if (!aspiration) continue;
    const e = obj(entry);
    const counters: Record<string, number> = {};
    for (const [k, v] of Object.entries(obj(e.counters))) counters[k] = Math.max(0, num(v));
    const lists: Record<string, string[]> = {};
    for (const [k, v] of Object.entries(obj(e.lists))) lists[k] = arr(v).filter((x): x is string => typeof x === "string");
    base.aspirations[id] = { steps: arr(e.steps).filter((s): s is string => aspiration.steps.some((step) => step.id === s)), counters, lists, chosenDay: Math.max(1, num(e.chosenDay, 1)) };
  }
  base.titles = arr(value.titles).filter((t): t is string => ASPIRATIONS.some((a) => a.title === t));
  return base;
}

function hash(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0) / 4294967296;
}

export function pushMoodEvent(life: LifeState, character: string, kind: MoodEventKind, day: number): LifeState {
  const kept = life.moodEvents.filter((event) => day - event.day <= MOOD_MEMORY_DAYS);
  return { ...life, moodEvents: [...kept, { character, kind, day }] };
}

/* ---------------------------------------------------------------- Invitations */

export const INVITE_MAX_AHEAD = 3;
export const INVITE_MAX_PENDING = 3;
export const INVITE_REFUSAL_PAUSE = 3;
export const BAD_WEATHER: WeatherId[] = ["pluie", "orage", "tempete", "neige", "blizzard", "sable", "canicule"];

export type InviteFactors = { stage: number; trust: number; mood: MoodId; sameRegion: boolean; knownRegion: boolean; badWeather: boolean };

/** Score d’acceptation (caché au joueur, résumé par un indice qualitatif). */
export function inviteScore(f: InviteFactors) {
  return 30 + 10 * Math.min(5, Math.max(0, f.stage)) + Math.floor(Math.max(0, f.trust) / 4) + MOODS[f.mood].invite + (f.sameRegion ? 15 : 0) - (f.knownRegion ? 0 : 20) - (f.badWeather ? 10 : 0);
}
export const INVITE_ACCEPT_THRESHOLD = 55;
export function inviteHint(score: number): { id: "disponible" | "hesite" | "peu"; label: string } {
  if (score >= 70) return { id: "disponible", label: "semble disponible" };
  if (score >= 45) return { id: "hesite", label: "hésite peut-être" };
  return { id: "peu", label: "semble peu disponible" };
}
/** Réponse déterministe : le score plus un léger aléa fixe par (personnage, jour, période, lieu). */
export function inviteAccepted(character: string, day: number, period: number, spot: string, score: number) {
  const jitter = Math.round((hash(`invite:${character}:${day}:${period}:${spot}`) - 0.5) * 16);
  return score + jitter >= INVITE_ACCEPT_THRESHOLD;
}
export function invitePaused(life: LifeState, character: string, day: number) {
  const entry = life.refusals[character];
  return Boolean(entry?.untilDay && day < entry.untilDay);
}
export function pendingInvites(life: LifeState, day: number, period: number) {
  return life.invites.filter((invite) => invite.status === "accepted" && (invite.day > day || (invite.day === day && invite.period >= period)));
}
export function recordRefusal(life: LifeState, character: string, day: number): LifeState {
  const count = (life.refusals[character]?.count || 0) + 1;
  return { ...life, refusals: { ...life.refusals, [character]: count >= 3 ? { count: 0, untilDay: day + INVITE_REFUSAL_PAUSE } : { count } } };
}
export function recordAcceptance(life: LifeState, invite: PlayerInvite): LifeState {
  return { ...life, invites: [...life.invites.filter((entry) => !(entry.status === "accepted" && entry.character === invite.character)), invite], refusals: { ...life.refusals, [invite.character]: { count: 0 } } };
}
/** Présence imposée par une invitation acceptée à ce créneau (surcouche sur l’itinéraire). */
export function inviteAt(life: LifeState | undefined, character: string, day: number, period: number) {
  return life?.invites.find((invite) => invite.status === "accepted" && invite.character === character && invite.day === day && invite.period === period);
}

/* ---------------------------------------------------------------- Lettres */

export const LETTERS_PER_DAY = 2;
export function letterThemeAvailable(life: LifeState, character: string, theme: LetterTheme, stage: number, day: number) {
  const recent = life.moodEvents.filter((event) => event.character === character && day - event.day <= 7);
  const lastExcuse = recent.filter((event) => event.kind === "excuse").reduce((max, event) => Math.max(max, event.day), -Infinity);
  if (theme === "merci") return recent.some((event) => ["cadeau-aime", "rdv-honore", "activite"].includes(event.kind));
  if (theme === "excuse") return recent.some((event) => ["cadeau-deteste", "rdv-manque"].includes(event.kind) && event.day > lastExcuse);
  if (theme === "confidence") return stage >= (LETTER_THEMES.confidence.minStage || 3);
  return true;
}
export function letterBlocked(life: LifeState, character: string, day: number): string | undefined {
  if (life.letters.some((letter) => letter.character === character && letter.replyDay > day)) return "Une lettre attend déjà sa réponse.";
  if (life.letters.filter((letter) => letter.day === day).length >= LETTERS_PER_DAY) return "Deux lettres par jour au plus : le coursier repart demain.";
  return undefined;
}
/** Délai de réponse : 1 à 3 jours, et jamais deux réponses le même jour. */
export function replyDayFor(life: LifeState, character: string, day: number) {
  let reply = day + 1 + Math.floor(hash(`lettre:${character}:${day}`) * 3);
  const taken = new Set(life.letters.map((letter) => letter.replyDay));
  while (taken.has(reply)) reply += 1;
  return reply;
}
export const LETTER_GAINS: Record<LetterTheme, { affection: number; trust: number }> = {
  merci: { affection: 0, trust: 2 }, nouvelles: { affection: 1, trust: 1 }, excuse: { affection: 0, trust: 1 }, invitation: { affection: 0, trust: 0 }, confidence: { affection: 1, trust: 3 },
};

/* ---------------------------------------------------------------- Envies */

export type LifeContext = {
  day: number;
  period: number;
  location: string;
  spot: string;
  coins: number;
  homeSpot?: string;
  locationOpen: (id: string) => boolean;
  spotLocation: (spotId: string) => string | undefined;
  met: (character: string) => boolean;
};

function wishFeasible(template: WishTemplate, ctx: LifeContext, from: number, to: number, character?: string): boolean {
  const c = template.condition;
  const days = Array.from({ length: to - from + 1 }, (_, i) => from + i);
  if (c.type === "visit") {
    const location = c.location || (c.spot ? ctx.spotLocation(c.spot) : undefined);
    if (location && !ctx.locationOpen(location)) return false;
    if (c.weather) {
      const candidates = location ? [location] : ["algratal", "miraldas", "forbidden", "forthaven", "akuhn", "tzekarun", "forestier", "river-halt", "imperial-road", "echo-clearing"].filter(ctx.locationOpen);
      return candidates.some((loc) => days.some((d) => c.weather!.includes(weatherAt(d, loc).id)));
    }
    return true;
  }
  if (c.type === "activity") {
    if (c.season && !days.some((d) => imperialDate(d).season === c.season)) return false;
    if (c.weather && !days.some((d) => ["algratal", "miraldas", "forthaven", "akuhn", "forestier"].filter(ctx.locationOpen).some((loc) => c.weather!.includes(weatherAt(d, loc).id)))) return false;
    if (character && !ctx.met(character)) return false;
    return true;
  }
  if (c.type === "meet" || c.type === "letter") return !character || ctx.met(character);
  if (c.type === "invite") return true;
  return true;
}

export function wishLabel(wish: ActiveWish, names: Record<string, string>) {
  const template = WISHES.find((entry) => entry.id === wish.id);
  return template ? template.text.replace("{name}", wish.character ? names[wish.character] || wish.character : "") : wish.id;
}

/** Tirage du matin : élague les envies expirées et complète jusqu’à 1 à 3 envies, sans répéter une envie récente (5 jours). */
export function rollWishes(life: LifeState, ctx: LifeContext, characters: readonly string[]): LifeState {
  if (life.wishesRolled === ctx.day) return life;
  const kept = life.wishes.filter((wish) => wish.expiresDay >= ctx.day && !(wish.done && wish.done < ctx.day));
  const target = 1 + Math.floor(hash(`envies:${ctx.day}`) * 3);
  const wishes = [...kept];
  const history = { ...life.wishHistory };
  const metChars = characters.filter((id) => ctx.met(id) && !WISH_EXCLUDED_CHARACTERS.includes(id));
  const ordered = [...WISHES].sort((a, b) => hash(`${a.id}:${ctx.day}`) - hash(`${b.id}:${ctx.day}`));
  for (const template of ordered) {
    if (wishes.filter((wish) => !wish.done).length >= target) break;
    const character = template.perCharacter ? metChars[Math.floor(hash(`${template.id}:who:${ctx.day}`) * metChars.length)] : undefined;
    if (template.perCharacter && !character) continue;
    const key = character ? `${template.id}:${character}` : template.id;
    if (wishes.some((wish) => wish.id === template.id)) continue;
    if (history[key] !== undefined && ctx.day - history[key] < 5) continue;
    const duration = 1 + Math.floor(hash(`${template.id}:duree:${ctx.day}`) * 3);
    const expiresDay = ctx.day + duration - 1;
    if (!wishFeasible(template, ctx, ctx.day, expiresDay, character)) continue;
    wishes.push({ id: template.id, ...(character ? { character } : {}), createdDay: ctx.day, expiresDay });
    history[key] = ctx.day;
  }
  return { ...life, wishes, wishHistory: history, wishesRolled: ctx.day };
}

/* ---------------------------------------------------------------- Événements, envies et aspirations */

export type LifeEvent =
  | { kind: "visit"; location: string; spot: string; period: number; weather: WeatherId; newSpot?: boolean }
  | { kind: "travel"; surcharge: number }
  | { kind: "gift"; character: string; category: "aime" | "neutre" | "deteste" }
  | { kind: "buy"; gift: string }
  | { kind: "activity"; character: string; activity: ActivityId; spot: string; home: boolean; weather: WeatherId }
  | { kind: "letter"; character: string; theme: LetterTheme }
  | { kind: "job" }
  | { kind: "invite"; character: string; location: string; home: boolean }
  | { kind: "meet"; character: string }
  | { kind: "state" };

export type LifeReward = { stats: Partial<Record<StatKey, number>>; coins: number; messages: { title: string; detail: string }[]; keepsakes: string[] };

function matchWish(c: WishCondition, event: LifeEvent, character: string | undefined, ctx: LifeContext): boolean {
  const who = character;
  switch (c.type) {
    case "visit": return event.kind === "visit" && (!c.location || c.location === event.location) && (!c.spot || c.spot === event.spot) && (!c.weather || c.weather.includes(event.weather)) && (!c.periods || c.periods.includes(event.period));
    case "newSpot": return event.kind === "visit" && Boolean(event.newSpot);
    case "gift": return event.kind === "gift" && (!c.category || c.category === event.category) && (!c.character || c.character === event.character);
    case "buy": return event.kind === "buy" && event.gift === c.gift;
    case "activity": return event.kind === "activity" && (!c.activity || c.activity === event.activity) && (!c.character || event.character === (c.character === "{character}" ? who : c.character)) && (!c.weather || c.weather.includes(event.weather)) && (!c.season || imperialDate(ctx.day).season === c.season);
    case "letter": return event.kind === "letter" && (!c.theme || c.theme === event.theme) && (!c.character || event.character === (c.character === "{character}" ? who : c.character));
    case "job": return event.kind === "job";
    case "invite": return event.kind === "invite";
    case "meet": return event.kind === "meet" && event.character === who;
  }
}

function addReward(reward: LifeReward, gain: WishReward) {
  if (gain.stat) reward.stats[gain.stat] = (reward.stats[gain.stat] || 0) + 1;
  if (gain.coins) reward.coins += gain.coins;
}
export function rewardLabel(gain: WishReward, statLabels: Record<StatKey, string>) {
  return [gain.stat ? `+1 ${statLabels[gain.stat]}` : "", gain.coins ? `+${gain.coins} ◈` : ""].filter(Boolean).join(" · ");
}

const COUR = ["iriana", "tia"];
const FORT = ["lineva", "draven"];

function aspirationTicks(event: LifeEvent, ctx: LifeContext): { counters: string[]; lists: [string, string][] } {
  const counters: string[] = [];
  const lists: [string, string][] = [];
  if (event.kind === "letter") { if (COUR.includes(event.character)) counters.push("letters:cour"); lists.push(["correspondents", event.character]); }
  if (event.kind === "activity") {
    counters.push(`activity:${event.activity}`);
    if (COUR.includes(event.character)) counters.push("activity-with:cour");
    if (FORT.includes(event.character) && event.activity === "entrainer") counters.push("activity-with:forthaven");
    if (event.home) counters.push("activity-home");
    lists.push(["partners", event.character]);
  }
  if (event.kind === "gift" && event.category === "aime") { counters.push("gift-aime"); if (COUR.includes(event.character)) counters.push("gift-aime:cour"); }
  if (event.kind === "buy") counters.push("buy");
  if (event.kind === "job") counters.push("jobs");
  if (event.kind === "invite") { counters.push("invites"); counters.push(`invite-loc:${event.location}`); if (FORT.includes(event.character)) counters.push("invite-with:forthaven"); if (event.home) counters.push("invite-home"); }
  if (event.kind === "travel" && event.surcharge > 0) counters.push("weather-travel");
  if (event.kind === "visit") {
    lists.push(["visit-locs", event.location]);
    lists.push(["weathers", event.weather]);
    if (event.location === "forthaven" && ["pluie", "orage", "tempete"].includes(event.weather)) counters.push("visit-bad:forthaven");
  }
  void ctx;
  return { counters, lists };
}

/** Applique un événement : envies réalisées, compteurs et jalons de l’aspiration active. Renvoie l’état et les récompenses. */
export function applyLifeEvent(life: LifeState, event: LifeEvent, ctx: LifeContext, names: Record<string, string>, statLabels: Record<StatKey, string>): { life: LifeState; reward: LifeReward } {
  const reward: LifeReward = { stats: {}, coins: 0, messages: [], keepsakes: [] };
  let wishes = life.wishes;
  let envyDone = 0;
  if (event.kind !== "state") {
    wishes = life.wishes.map((wish) => {
      if (wish.done || wish.expiresDay < ctx.day || wish.createdDay > ctx.day) return wish;
      const template = WISHES.find((entry) => entry.id === wish.id);
      if (!template || !matchWish(template.condition, event, wish.character, ctx)) return wish;
      addReward(reward, template.reward);
      envyDone += 1;
      reward.messages.push({ title: `Envie réalisée · ${wishLabel(wish, names)}`, detail: rewardLabel(template.reward, statLabels) });
      return { ...wish, done: ctx.day };
    });
  }
  let next: LifeState = { ...life, wishes };
  const activeId = life.aspiration;
  const aspiration = ASPIRATIONS.find((entry) => entry.id === activeId);
  if (aspiration) {
    const progress: AspirationProgress = { ...(life.aspirations[aspiration.id] || { steps: [], counters: {}, lists: {}, chosenDay: ctx.day }) };
    const counters = { ...progress.counters };
    const lists = { ...progress.lists };
    const ticks = aspirationTicks(event, ctx);
    for (const key of ticks.counters) counters[key] = (counters[key] || 0) + 1;
    if (envyDone) { counters.envies = (counters.envies || 0) + envyDone; ticks.lists.push(["envy-seasons", imperialDate(ctx.day).season as SeasonId]); }
    for (const [key, item] of ticks.lists) lists[key] = lists[key]?.includes(item) ? lists[key] : [...(lists[key] || []), item];
    const steps = [...progress.steps];
    for (const step of aspiration.steps) {
      if (steps.includes(step.id)) continue;
      const value = step.state === "home" ? (ctx.homeSpot ? 1 : 0) : step.state === "coins" ? ctx.coins : step.listKey ? (lists[step.key] || []).length : counters[step.key] || 0;
      if (value < step.target) break;
      steps.push(step.id);
      addReward(reward, step.reward);
      reward.messages.push({ title: `${aspiration.name} · ${step.label}`, detail: rewardLabel(step.reward, statLabels) });
    }
    next = { ...next, aspirations: { ...next.aspirations, [aspiration.id]: { ...progress, counters, lists, steps } } };
    if (steps.length === aspiration.steps.length && !life.titles.includes(aspiration.title)) {
      next = { ...next, titles: [...next.titles, aspiration.title] };
      reward.keepsakes.push(aspiration.keepsake);
      reward.messages.push({ title: `Aspiration accomplie · ${aspiration.name}`, detail: `Titre « ${aspiration.title} » et souvenir de vitrine` });
    }
  }
  return { life: next, reward };
}

export function chooseAspiration(life: LifeState, id: string | undefined, day: number): LifeState {
  if (!id) return { ...life, aspiration: undefined };
  if (!ASPIRATIONS.some((entry) => entry.id === id)) return life;
  return { ...life, aspiration: id, aspirations: { ...life.aspirations, [id]: life.aspirations[id] || { steps: [], counters: {}, lists: {}, chosenDay: day } } };
}

/* ---------------------------------------------------------------- Activités : limite journalière */

export function activityCounted(life: LifeState, character: string, day: number) {
  return life.activityDay[character]?.day === day && life.activityDay[character].count > 0;
}
export function recordActivity(life: LifeState, character: string, activity: ActivityId, day: number): LifeState {
  const entry = life.activityDay[character];
  const count = entry?.day === day ? entry.count + 1 : 1;
  void activityById(activity);
  return pushMoodEvent({ ...life, activityDay: { ...life.activityDay, [character]: { day, count } } }, character, "activite", day);
}
export function giftCounted(life: LifeState, character: string, day: number) { return life.giftDay[character] === day; }

/* ---------------------------------------------------------------- Passage du temps */

/** Rendez-vous dépassés : manqués (-1 confiance, lettre douce, souvenir négatif). */
/** `isSuspended` : vrai quand l’invitation n’a pas pu tenir (présence impossible) ; elle devient alors excusée, sans pénalité. */
export function expireInvites(life: LifeState, day: number, period: number, isSuspended: (invite: PlayerInvite) => boolean = () => false): { life: LifeState; missed: PlayerInvite[]; excused: PlayerInvite[] } {
  const missed: PlayerInvite[] = [];
  const excused: PlayerInvite[] = [];
  const invites = life.invites.map((invite) => {
    if (invite.status !== "accepted") return invite;
    if (invite.day > day || (invite.day === day && invite.period >= period)) return invite;
    if (isSuspended(invite)) { excused.push(invite); return { ...invite, status: "excused" as const }; }
    missed.push(invite);
    return { ...invite, status: "missed" as const };
  });
  let next: LifeState = { ...life, invites };
  for (const invite of excused) next = { ...next, notes: [...next.notes, { id: `excuse-${invite.id}`, character: invite.character, kind: "excuse", day, read: false }] };
  for (const invite of missed) {
    next = pushMoodEvent(next, invite.character, "rdv-manque", day);
    next = { ...next, notes: [...next.notes, { id: `manque-${invite.id}`, character: invite.character, kind: "manque", day, read: false }] };
  }
  return { life: next, missed, excused };
}

export function excuseInvite(life: LifeState, inviteId: string, day: number): LifeState {
  const invite = life.invites.find((entry) => entry.id === inviteId);
  if (!invite || invite.status !== "accepted") return life;
  return { ...life, invites: life.invites.map((entry) => entry.id === inviteId ? { ...entry, status: "excused" as const } : entry), notes: [...life.notes, { id: `excuse-${invite.id}`, character: invite.character, kind: "excuse", day, read: false }] };
}

export function honorInvite(life: LifeState, inviteId: string, day: number): LifeState {
  const invite = life.invites.find((entry) => entry.id === inviteId);
  if (!invite || invite.status !== "accepted") return life;
  return pushMoodEvent({ ...life, invites: life.invites.map((entry) => entry.id === inviteId ? { ...entry, status: "honored" as const } : entry) }, invite.character, "rdv-honore", day);
}

/** Lettres dont la réponse arrive aujourd’hui ou avant (non encore « livrées » : replyDay <= day). */
export function deliveredLetters(life: LifeState, day: number) { return life.letters.filter((letter) => letter.replyDay <= day); }
export function unreadLifeMail(life: LifeState | undefined, day: number) {
  if (!life) return 0;
  return deliveredLetters(life, day).filter((letter) => !letter.read).length + life.notes.filter((note) => !note.read).length;
}

/** Réponses arrivées : applique une seule fois les gains du thème (jamais le Désir) et l’effet d’une excuse. */
export function deliverLetterGains(life: LifeState, day: number): { life: LifeState; gains: { character: string; theme: LetterTheme; affection: number; trust: number }[] } {
  const gains: { character: string; theme: LetterTheme; affection: number; trust: number }[] = [];
  let next = life;
  const letters = life.letters.map((letter) => {
    if (letter.applied || letter.replyDay > day) return letter;
    gains.push({ character: letter.character, theme: letter.theme, ...LETTER_GAINS[letter.theme] });
    return { ...letter, applied: true };
  });
  next = { ...next, letters };
  for (const gain of gains) next = pushMoodEvent(next, gain.character, gain.theme === "excuse" ? "excuse" : "lettre", day);
  return { life: next, gains };
}
