import type { DialogueLine } from "./game-data";
import type { IntimacyMode, PlayerSex } from "./date-scenes";
import type { IntimacyRoute } from "./intimacy-routes";

/*
 * Intimités manuelles de Bellirith (refonte Acte I).
 *
 * Trois familles, écrites avec des dynamiques différentes (spec §45) :
 *  A. diversions précoces : `{player}` a choisi de suivre Bellirith, puis
 *     elle dirige presque tout (lieu, tempo, mise en scène, fin) ;
 *  B. intimités libres intermédiaires : plus familières, nourries par
 *     l’historique (favori, refus, rapports déjà vécus) ;
 *  C. rendez-vous de fin d’Acte I : un duel, initiative partagée,
 *     `{player}` a choisi « maintenant ».
 *
 * Aucune scène n’est générée : chaque séquence est écrite à la main. Les
 * seules opérations sont des sélections (mode d’intimité, corps choisi,
 * historique par flags).
 */

export type BellirithIntimacyContext =
  | "bellirith-diversion-price-of-aid"
  | "bellirith-diversion-return-akuhn"
  | "bellirith-diversion-before-light"
  | "bellirith-diversion-coalition"
  | "bellirith-free"
  | "date-bellirith-final";
export type BellirithIntimacyKind = "diversion" | "free" | "duel";
export type BellirithApproach = { id: string; text: string; lines: DialogueLine[] };

type Speaker = "Bellirith" | "{player}";
type SexTriplet = readonly [femme: string, homme: string, intersexe: string];
type RawLine =
  | string
  | readonly [speaker: Speaker, text: string, mood?: string]
  | { x: SexTriplet; speaker?: Speaker; mood?: string };
type Chapter = { all: RawLine[] } | Record<IntimacyMode, RawLine[]>;
type AuthoredRoute = {
  id: string;
  context: BellirithIntimacyContext;
  text: string;
  detail: string;
  /** Routes réservées à un historique précis (familière / inventive…). */
  requiresFlags?: string[];
  excludesFlags?: string[];
  chapters: Chapter[];
};

export const BELLIRITH_INTIMACY_CONTEXTS: BellirithIntimacyContext[] = [
  "bellirith-diversion-price-of-aid",
  "bellirith-diversion-return-akuhn",
  "bellirith-diversion-before-light",
  "bellirith-diversion-coalition",
  "bellirith-free",
  "date-bellirith-final",
];
export const BELLIRITH_FREE_SOURCES = ["bellirith-free", "bellirith-free-confidence", "date-bellirith-music", "date-bellirith-market"];
const MODES: IntimacyMode[] = ["tendre", "suggestif", "explicite", "ellipse"];
const SEXES: PlayerSex[] = ["femme", "homme", "intersexe"];
export const BELLIRITH_INTIMACY_MINIMUM_SEQUENCES = 12;
export const BELLIRITH_INTIMACY_MINIMUM_WORDS: Record<IntimacyMode, number> = { explicite: 1000, suggestif: 450, tendre: 250, ellipse: 150 };

const A = (...all: RawLine[]): Chapter => ({ all });
const M = (tendre: RawLine[], suggestif: RawLine[], explicite: RawLine[], ellipse: RawLine[]): Chapter => ({ tendre, suggestif, explicite, ellipse });
const X = (femme: string, homme: string, intersexe: string): RawLine => ({ x: [femme, homme, intersexe] });
const XB = (femme: string, homme: string, intersexe: string, mood?: string): RawLine => ({ x: [femme, homme, intersexe], speaker: "Bellirith", mood });
const B = (text: string, mood?: string): RawLine => ["Bellirith", text, mood] as const;
const P = (text: string): RawLine => ["{player}", text] as const;

function lines(raw: RawLine[], sex: PlayerSex): DialogueLine[] {
  return raw.map((entry) => {
    if (typeof entry === "string") return { speaker: "Narration", text: entry };
    if ("x" in entry) {
      const index = SEXES.indexOf(sex);
      return { speaker: entry.speaker || "Narration", text: entry.x[index], ...(entry.mood ? { mood: entry.mood } : {}) };
    }
    return { speaker: entry[0], text: entry[1], ...(entry[2] ? { mood: entry[2] } : {}) };
  });
}

// ─── Contenu ────────────────────────────────────────────────────────────
// (rempli plus bas : ouvertures, approches, routes, fins)

const ROUTES: AuthoredRoute[] = [];
const OPENINGS: Record<BellirithIntimacyContext, (flags: string[], source?: string) => RawLine[]> = {} as Record<BellirithIntimacyContext, (flags: string[], source?: string) => RawLine[]>;
const ENDINGS: Record<BellirithIntimacyContext, (flags: string[], source?: string) => RawLine[]> = {} as Record<BellirithIntimacyContext, (flags: string[], source?: string) => RawLine[]>;
const APPROACHES: Record<BellirithIntimacyKind, (flags: string[]) => { id: string; text: string; lines: RawLine[] }[]> = {} as Record<BellirithIntimacyKind, (flags: string[]) => { id: string; text: string; lines: RawLine[] }[]>;
export const BELLIRITH_INTIMACY_TITLES: Record<BellirithIntimacyContext, string> = {
  "bellirith-diversion-price-of-aid": "Le salon des miroirs",
  "bellirith-diversion-return-akuhn": "Les bains au-dessus de la salle de musique",
  "bellirith-diversion-before-light": "Saëlis sur une terrasse",
  "bellirith-diversion-coalition": "La veille de bataille",
  "bellirith-free": "Une heure volée",
  "date-bellirith-final": "Coup pour coup",
};

export const BELLIRITH_INTIMACY_BACKGROUNDS: Record<BellirithIntimacyContext, string> = {
  "bellirith-diversion-price-of-aid": "/assets/backgrounds/alcove.webp",
  "bellirith-diversion-return-akuhn": "/assets/backgrounds/akuhn_palace.webp",
  "bellirith-diversion-before-light": "/assets/backgrounds/terrace.webp",
  "bellirith-diversion-coalition": "/assets/backgrounds/ballroom.webp",
  "bellirith-free": "/assets/backgrounds/bedroom.webp",
  "date-bellirith-final": "/assets/backgrounds/ballroom.webp",
};
/** Intimités Bellirith hors rendez-vous planifié, relisibles depuis les souvenirs. */
export const BELLIRITH_REPLAYABLE_INTIMACIES = [
  "bellirith-diversion-price-of-aid",
  "bellirith-diversion-return-akuhn",
  "bellirith-diversion-before-light",
  "bellirith-diversion-coalition",
  "bellirith-free",
  "bellirith-free-confidence",
];

export const BELLIRITH_DEV_INTIMACIES = [
  { dateId: "bellirith-diversion-price-of-aid", label: "Diversion II" },
  { dateId: "bellirith-diversion-return-akuhn", label: "Diversion III" },
  { dateId: "bellirith-diversion-before-light", label: "Diversion IV" },
  { dateId: "bellirith-diversion-coalition", label: "Chapitre IX" },
  { dateId: "bellirith-free", label: "Heure volée" },
  { dateId: "date-bellirith-final", label: "Duel final" },
];

export function bellirithRouteNote(context: BellirithIntimacyContext, count: number) {
  const kind = bellirithIntimacyKind(context);
  if (kind === "diversion") return "Vous l’avez suivie : à partir d’ici, c’est elle qui choisit le lieu, le tempo et le moment où tout s’arrête. Une route écrite pour le corps que vous avez choisi, en douze séquences au moins.";
  if (kind === "duel") return `Ce soir, c’est vous qui avez dit « maintenant ». ${count > 1 ? "Deux manières d’ouvrir le duel" : "Un duel"} : chaque route alterne ses initiatives et les vôtres, en douze séquences au moins.`;
  return `${count > 1 ? `${count} façons` : "Une façon"} de prolonger cette heure volée, nourries par ce qu’elle sait déjà de vous. Douze séquences au moins.`;
}

// ─── API ────────────────────────────────────────────────────────────────

export function bellirithIntimacyContext(dateId?: string): BellirithIntimacyContext | undefined {
  if (!dateId) return undefined;
  if (BELLIRITH_FREE_SOURCES.includes(dateId)) return "bellirith-free";
  return BELLIRITH_INTIMACY_CONTEXTS.includes(dateId as BellirithIntimacyContext) ? dateId as BellirithIntimacyContext : undefined;
}

export function bellirithIntimacyKind(context: BellirithIntimacyContext): BellirithIntimacyKind {
  return context === "date-bellirith-final" ? "duel" : context === "bellirith-free" ? "free" : "diversion";
}

export function bellirithIntimacyOpening(context: BellirithIntimacyContext, flags: string[], sex: PlayerSex, source?: string): DialogueLine[] {
  return lines(OPENINGS[context]?.(flags, source) || [], sex);
}

export function bellirithIntimacyEnding(context: BellirithIntimacyContext, flags: string[], sex: PlayerSex, source?: string): DialogueLine[] {
  return lines(ENDINGS[context]?.(flags, source) || [], sex);
}

export function bellirithIntimacyApproaches(context: BellirithIntimacyContext, flags: string[], sex: PlayerSex): BellirithApproach[] {
  return (APPROACHES[bellirithIntimacyKind(context)]?.(flags) || []).map((entry) => ({ id: entry.id, text: entry.text, lines: lines(entry.lines, sex) }));
}

function routeMatches(route: AuthoredRoute, flags: string[]) {
  return (route.requiresFlags || []).every((flag) => flags.includes(flag))
    && !(route.excludesFlags || []).some((flag) => flags.includes(flag));
}

function buildRoute(route: AuthoredRoute, sex: PlayerSex): IntimacyRoute {
  const chapters = Object.fromEntries(MODES.map((mode) => [mode, route.chapters.map((chapter) => lines("all" in chapter ? chapter.all : chapter[mode], sex))])) as Record<IntimacyMode, DialogueLine[][]>;
  return { id: route.id, text: route.text, detail: route.detail, chapters };
}

export function bellirithIntimacyRoutes(context: BellirithIntimacyContext, sex: PlayerSex, flags: string[]): IntimacyRoute[] {
  const candidates = ROUTES.filter((route) => route.context === context);
  const matching = candidates.filter((route) => routeMatches(route, flags));
  return (matching.length ? matching : candidates).map((route) => buildRoute(route, sex));
}

export function allBellirithIntimacyRoutes(): { context: BellirithIntimacyContext; id: string; sex: PlayerSex; route: IntimacyRoute }[] {
  return ROUTES.flatMap((route) => SEXES.map((sex) => ({ context: route.context, id: route.id, sex, route: buildRoute(route, sex) })));
}

export const __bellirithIntimacyAuthoring = { ROUTES, OPENINGS, ENDINGS, APPROACHES, A, M, X, XB, B, P };
