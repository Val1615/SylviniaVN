import type { DialogueLine } from "./game-data";
import type { PlayerSex } from "./date-scenes";
import type { IntimacyRoute } from "./intimacy-routes";
import {
  BELLIRITH_INTIMACY_MINIMUM_SEQUENCES_VALUE,
  MODES,
  SEXES,
  renderLines,
  type AuthoredRoute,
  type BellirithIntimacyContext,
  type BellirithIntimacyKind,
} from "./bellirith-intimacy-kit";
import { APPROACHES, ENDINGS, OPENINGS } from "./bellirith-intimacy-frames";
import { PRICE_OF_AID_ROUTE } from "./bellirith-intimacy-price-of-aid";
import { RETURN_AKUHN_ROUTE } from "./bellirith-intimacy-return-akuhn";
import { BEFORE_LIGHT_ROUTE } from "./bellirith-intimacy-before-light";
import { COALITION_ROUTE } from "./bellirith-intimacy-coalition";
import { FREE_FAMILIAR_ROUTE, FREE_FIRST_ROUTE } from "./bellirith-intimacy-free";
import { DUEL_STEAL_ROUTE, DUEL_TURN_ROUTE } from "./bellirith-intimacy-duel";

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
 * Aucune scène n’est générée : chaque séquence est écrite à la main
 * (fichiers bellirith-intimacy-*.ts). Les seules opérations sont des
 * sélections (mode d’intimité, corps choisi, historique par flags).
 */

export type { BellirithIntimacyContext, BellirithIntimacyKind } from "./bellirith-intimacy-kit";
export type BellirithApproach = { id: string; text: string; lines: DialogueLine[] };

export const BELLIRITH_INTIMACY_CONTEXTS: BellirithIntimacyContext[] = [
  "bellirith-diversion-price-of-aid",
  "bellirith-diversion-return-akuhn",
  "bellirith-diversion-before-light",
  "bellirith-diversion-coalition",
  "bellirith-free",
  "date-bellirith-final",
];
export const BELLIRITH_FREE_SOURCES = ["bellirith-free", "bellirith-free-confidence", "bellirith-home", "date-bellirith-music", "date-bellirith-market"];
export const BELLIRITH_INTIMACY_MINIMUM_SEQUENCES = BELLIRITH_INTIMACY_MINIMUM_SEQUENCES_VALUE;
export { BELLIRITH_INTIMACY_MINIMUM_WORDS } from "./bellirith-intimacy-kit";

const ROUTES: AuthoredRoute[] = [
  PRICE_OF_AID_ROUTE,
  RETURN_AKUHN_ROUTE,
  BEFORE_LIGHT_ROUTE,
  COALITION_ROUTE,
  FREE_FAMILIAR_ROUTE,
  FREE_FIRST_ROUTE,
  DUEL_STEAL_ROUTE,
  DUEL_TURN_ROUTE,
];
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
  "date-bellirith-final": "/assets/backgrounds/music_room.webp",
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
  return renderLines(OPENINGS[context]?.(flags, source) || [], sex, flags);
}

export function bellirithIntimacyEnding(context: BellirithIntimacyContext, flags: string[], sex: PlayerSex, source?: string): DialogueLine[] {
  return renderLines(ENDINGS[context]?.(flags, source) || [], sex, flags);
}

export function bellirithIntimacyApproaches(context: BellirithIntimacyContext, flags: string[], sex: PlayerSex): BellirithApproach[] {
  return (APPROACHES[bellirithIntimacyKind(context)]?.(flags) || []).map((entry) => ({ id: entry.id, text: entry.text, lines: renderLines(entry.lines, sex, flags) }));
}

function routeMatches(route: AuthoredRoute, flags: string[]) {
  return (route.requiresFlags || []).every((flag) => flags.includes(flag))
    && !(route.excludesFlags || []).some((flag) => flags.includes(flag));
}

function buildRoute(route: AuthoredRoute, sex: PlayerSex, flags: string[]): IntimacyRoute {
  const chapters = Object.fromEntries(MODES.map((mode) => [mode, route.chapters.map((chapter) => renderLines("all" in chapter ? chapter.all : chapter[mode], sex, flags))])) as IntimacyRoute["chapters"];
  return { id: route.id, text: route.text, detail: route.detail, chapters, ...(route.visual ? { visual: route.visual } : {}) };
}

export function bellirithIntimacyRoutes(context: BellirithIntimacyContext, sex: PlayerSex, flags: string[]): IntimacyRoute[] {
  const candidates = ROUTES.filter((route) => route.context === context);
  const matching = candidates.filter((route) => routeMatches(route, flags));
  return (matching.length ? matching : candidates).map((route) => buildRoute(route, sex, flags));
}

/** Pour les validateurs : chaque route, chaque corps, et les deux états d’historique les plus contrastés. */
export const BELLIRITH_VALIDATION_HISTORIES: { label: string; flags: string[] }[] = [
  { label: "premier contact", flags: [] },
  { label: "déjà amants, favori", flags: ["bellirith-has-slept", "bellirith-favorite", "bellirith-trend:ceded"] },
  { label: "refus répétés", flags: ["bellirith-has-resisted", "bellirith-trend:resisted"] },
];

export function allBellirithIntimacyRoutes(): { context: BellirithIntimacyContext; id: string; sex: PlayerSex; history: string; requiresFlags: string[]; excludesFlags: string[]; route: IntimacyRoute }[] {
  return ROUTES.flatMap((route) => SEXES.flatMap((sex) => BELLIRITH_VALIDATION_HISTORIES.map((history) => ({
    context: route.context,
    id: route.id,
    sex,
    history: history.label,
    requiresFlags: route.requiresFlags || [],
    excludesFlags: route.excludesFlags || [],
    route: buildRoute(route, sex, history.flags),
  }))));
}
