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
  type HeureVolee,
} from "./bellirith-intimacy-kit";
import { APPROACHES, ENDINGS, OPENINGS } from "./bellirith-intimacy-frames";
import { PRICE_OF_AID_ROUTE } from "./bellirith-intimacy-price-of-aid";
import { RETURN_AKUHN_ROUTE } from "./bellirith-intimacy-return-akuhn";
import { BEFORE_LIGHT_ROUTE } from "./bellirith-intimacy-before-light";
import { COALITION_ROUTE } from "./bellirith-intimacy-coalition";
import { FREE_FAMILIAR_ROUTE, FREE_FIRST_ROUTE } from "./bellirith-intimacy-free";
import { DUEL_STEAL_ROUTE, DUEL_TURN_ROUTE } from "./bellirith-intimacy-duel";
import { HEURE_SALON } from "./bellirith-heure-salon";
import { HEURE_AUBERGE } from "./bellirith-heure-auberge";
import { HEURE_LOGIS } from "./bellirith-heure-logis";
import { HEURE_CONFIDENCE } from "./bellirith-heure-confidence";
import { HEURE_ENNUI } from "./bellirith-heure-ennui";
import { HEURE_MATIN } from "./bellirith-heure-matin";
import { HEURE_COULOIR } from "./bellirith-heure-couloir";
import { HEURE_FAVEUR } from "./bellirith-heure-faveur";

/*
 * Intimités manuelles de Bellirith (refonte Acte I).
 *
 * Trois familles, écrites avec des dynamiques différentes (spec §45) :
 *  A. diversions précoces : `{player}` a choisi de suivre Bellirith, puis
 *     elle dirige presque tout (lieu, tempo, mise en scène, fin) ;
 *  B. heures volées : une scène propre à chaque source (salon de musique,
 *     auberge du marché, logis, confidence détournée, trois propositions
 *     libres, pari des diplomates). Aucune n’en recycle une autre. Les
 *     anciennes routes génériques FREE_FIRST / FREE_FAMILIAR ne restent
 *     branchées que sur le contexte hérité « bellirith-free », pour les
 *     sauvegardes antérieures ou une source inconnue ;
 *  C. rendez-vous de fin d’Acte I : un duel, initiative partagée,
 *     `{player}` a choisi « maintenant ».
 *
 * Aucune scène n’est générée : chaque séquence est écrite à la main
 * (fichiers bellirith-intimacy-*.ts). Les seules opérations sont des
 * sélections (mode d’intimité, corps choisi, historique par flags).
 */

export type { BellirithIntimacyContext, BellirithIntimacyKind } from "./bellirith-intimacy-kit";
export type BellirithApproach = { id: string; text: string; lines: DialogueLine[] };

/** Une heure volée par source, dans l’ordre du panneau de développement. */
export const BELLIRITH_HEURES_VOLEES: HeureVolee[] = [
  HEURE_SALON,
  HEURE_AUBERGE,
  HEURE_LOGIS,
  HEURE_CONFIDENCE,
  HEURE_ENNUI,
  HEURE_MATIN,
  HEURE_COULOIR,
  HEURE_FAVEUR,
];
const HEURE_BY_CONTEXT = Object.fromEntries(BELLIRITH_HEURES_VOLEES.map((heure) => [heure.context, heure])) as Partial<Record<BellirithIntimacyContext, HeureVolee>>;
export function bellirithHeureVolee(context: BellirithIntimacyContext): HeureVolee | undefined {
  return HEURE_BY_CONTEXT[context];
}

export const BELLIRITH_INTIMACY_CONTEXTS: BellirithIntimacyContext[] = [
  "bellirith-diversion-price-of-aid",
  "bellirith-diversion-return-akuhn",
  "bellirith-diversion-before-light",
  "bellirith-diversion-coalition",
  ...BELLIRITH_HEURES_VOLEES.map((heure) => heure.context),
  "bellirith-free",
  "date-bellirith-final",
];
/** Sources qui ouvrent une heure volée : chacune a désormais son propre contexte. */
export const BELLIRITH_FREE_SOURCES: BellirithIntimacyContext[] = BELLIRITH_HEURES_VOLEES.map((heure) => heure.context);
/** Contexte hérité (anciennes sauvegardes, source inconnue) : seul à garder FREE_FIRST / FREE_FAMILIAR. */
export const BELLIRITH_LEGACY_FREE_CONTEXT: BellirithIntimacyContext = "bellirith-free";
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
  ...BELLIRITH_HEURES_VOLEES.map((heure) => heure.route),
];
export const BELLIRITH_INTIMACY_TITLES: Record<BellirithIntimacyContext, string> = {
  "bellirith-diversion-price-of-aid": "Le salon des miroirs",
  "bellirith-diversion-return-akuhn": "Les bains au-dessus de la salle de musique",
  "bellirith-diversion-before-light": "Saëlis sur une terrasse",
  "bellirith-diversion-coalition": "La veille de bataille",
  "bellirith-free": "Une heure volée",
  "date-bellirith-final": "Coup pour coup",
  ...Object.fromEntries(BELLIRITH_HEURES_VOLEES.map((heure) => [heure.context, heure.title])),
} as Record<BellirithIntimacyContext, string>;

export const BELLIRITH_INTIMACY_BACKGROUNDS: Record<BellirithIntimacyContext, string> = {
  "bellirith-diversion-price-of-aid": "/assets/backgrounds/alcove.webp",
  "bellirith-diversion-return-akuhn": "/assets/backgrounds/akuhn_palace.webp",
  "bellirith-diversion-before-light": "/assets/backgrounds/terrace.webp",
  "bellirith-diversion-coalition": "/assets/backgrounds/ballroom.webp",
  "bellirith-free": "/assets/backgrounds/bedroom.webp",
  "date-bellirith-final": "/assets/backgrounds/music_room.webp",
  ...Object.fromEntries(BELLIRITH_HEURES_VOLEES.map((heure) => [heure.context, heure.background])),
} as Record<BellirithIntimacyContext, string>;
/** Intimités Bellirith hors rendez-vous planifié, relisibles depuis les souvenirs. */
export const BELLIRITH_REPLAYABLE_INTIMACIES = [
  "bellirith-diversion-price-of-aid",
  "bellirith-diversion-return-akuhn",
  "bellirith-diversion-before-light",
  "bellirith-diversion-coalition",
  "bellirith-home",
  "bellirith-free-confidence",
  "bellirith-free-ennui",
  "bellirith-free-matin",
  "bellirith-free-couloir",
  "bellirith-free-faveur",
  "bellirith-free",
];
/*
 * Les heures volées des rendez-vous (salon, auberge) se revoient depuis le
 * souvenir du rendez-vous ; celle du logis via `date-intimate:bellirith-home`.
 * « bellirith-free » reste listé pour les sauvegardes qui portent encore
 * `date-intimate:bellirith-free`.
 */

export const BELLIRITH_DEV_INTIMACIES = [
  { dateId: "bellirith-diversion-price-of-aid", label: "Diversion II" },
  { dateId: "bellirith-diversion-return-akuhn", label: "Diversion III" },
  { dateId: "bellirith-diversion-before-light", label: "Diversion IV" },
  { dateId: "bellirith-diversion-coalition", label: "Chapitre IX" },
  ...BELLIRITH_HEURES_VOLEES.map((heure) => ({ dateId: heure.context as string, label: `Heure volée · ${heure.devLabel}` })),
  { dateId: "date-bellirith-final", label: "Duel final" },
];

export function bellirithRouteNote(context: BellirithIntimacyContext, count: number) {
  const kind = bellirithIntimacyKind(context);
  if (kind === "diversion") return "Vous l’avez suivie : à partir d’ici, c’est elle qui choisit le lieu, le tempo et le moment où tout s’arrête. Une route écrite pour le corps que vous avez choisi, en douze séquences au moins.";
  if (kind === "duel") return `Ce soir, c’est vous qui avez dit « maintenant ». ${count > 1 ? "Deux manières d’ouvrir le duel" : "Un duel"} : chaque route alterne ses initiatives et les vôtres, en douze séquences au moins.`;
  const heure = bellirithHeureVolee(context);
  if (heure) return `${heure.route.detail} Une scène écrite pour ce moment-là seulement, en douze séquences au moins.`;
  return `${count > 1 ? `${count} façons` : "Une façon"} de prolonger cette heure volée, nourries par ce qu’elle sait déjà de vous. Douze séquences au moins.`;
}

// ─── API ────────────────────────────────────────────────────────────────

export function bellirithIntimacyContext(dateId?: string): BellirithIntimacyContext | undefined {
  if (!dateId) return undefined;
  return BELLIRITH_INTIMACY_CONTEXTS.includes(dateId as BellirithIntimacyContext) ? dateId as BellirithIntimacyContext : undefined;
}

export function bellirithIntimacyKind(context: BellirithIntimacyContext): BellirithIntimacyKind {
  return context === "date-bellirith-final" ? "duel" : context === BELLIRITH_LEGACY_FREE_CONTEXT || bellirithHeureVolee(context) ? "free" : "diversion";
}

export function bellirithIntimacyOpening(context: BellirithIntimacyContext, flags: string[], sex: PlayerSex, source?: string): DialogueLine[] {
  const frame = bellirithHeureVolee(context)?.opening || OPENINGS[context];
  return renderLines(frame?.(flags, source) || [], sex, flags);
}

export function bellirithIntimacyEnding(context: BellirithIntimacyContext, flags: string[], sex: PlayerSex, source?: string): DialogueLine[] {
  const frame = bellirithHeureVolee(context)?.ending || ENDINGS[context];
  return renderLines(frame?.(flags, source) || [], sex, flags);
}

export function bellirithIntimacyApproaches(context: BellirithIntimacyContext, flags: string[], sex: PlayerSex): BellirithApproach[] {
  const source = bellirithHeureVolee(context)?.approaches || APPROACHES[bellirithIntimacyKind(context)];
  return (source?.(flags) || []).map((entry) => ({ id: entry.id, text: entry.text, lines: renderLines(entry.lines, sex, flags) }));
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
