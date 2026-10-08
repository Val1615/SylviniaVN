import type { DialogueLine } from "./game-data";
import type { IntimacyMode, PlayerSex } from "./date-scenes";
import type { IntimacyVisualProgression } from "./intimacy-routes";

/*
 * Outils d’écriture des intimités manuelles de Bellirith.
 * Aucune génération : chaque ligne est écrite à la main. Les seules
 * opérations sont des sélections (mode, corps choisi, historique par flags).
 */

export type BellirithIntimacyContext =
  | "bellirith-diversion-price-of-aid"
  | "bellirith-diversion-return-akuhn"
  | "bellirith-diversion-before-light"
  | "bellirith-diversion-coalition"
  | "bellirith-free"
  | "date-bellirith-music"
  | "date-bellirith-market"
  | "bellirith-home"
  | "bellirith-free-confidence"
  | "bellirith-free-ennui"
  | "bellirith-free-matin"
  | "bellirith-free-couloir"
  | "bellirith-free-faveur"
  | "date-bellirith-final";
export type BellirithIntimacyKind = "diversion" | "free" | "duel";

type Speaker = "Bellirith" | "{player}" | "Iriana" | "Valurn" | "Draven" | "Tia";
type SexTriplet = readonly [femme: string, homme: string, intersexe: string];
export type RawLine =
  | string
  | readonly [speaker: Speaker, text: string, mood?: string]
  | { x: SexTriplet; speaker?: Speaker; mood?: string }
  | { when: string; yes: RawLine[]; no: RawLine[] };
export type Chapter = { all: RawLine[] } | Record<IntimacyMode, RawLine[]>;
export type AuthoredRoute = {
  id: string;
  context: BellirithIntimacyContext;
  text: string;
  detail: string;
  /** Routes réservées à un historique précis. */
  requiresFlags?: string[];
  excludesFlags?: string[];
  visual?: IntimacyVisualProgression;
  chapters: Chapter[];
};
export type AuthoredApproach = { id: string; text: string; lines: RawLine[] };
export type FlagText = (flags: string[], source?: string) => RawLine[];
/**
 * Heure volée : une scène intime propre à une seule source (rendez-vous,
 * logis, confidence détournée, moment libre, invitation). Ouverture,
 * approches, route et fin sont écrites pour cette situation et nulle autre.
 */
export type HeureVolee = {
  context: BellirithIntimacyContext;
  title: string;
  devLabel: string;
  background: string;
  opening: FlagText;
  approaches: (flags: string[]) => AuthoredApproach[];
  ending: FlagText;
  route: AuthoredRoute;
};

export const BELLIRITH_INTIMACY_MINIMUM_SEQUENCES_VALUE = 12;
export const BELLIRITH_INTIMACY_MINIMUM_WORDS: Record<IntimacyMode, number> = { explicite: 1000, suggestif: 450, tendre: 250, ellipse: 150 };
export const SEXES: PlayerSex[] = ["femme", "homme", "intersexe"];
export const MODES: IntimacyMode[] = ["tendre", "suggestif", "explicite", "ellipse"];

/** Chapitre commun aux quatre modes (dialogue, décor, suites). */
export const A = (...all: RawLine[]): Chapter => ({ all });
/** Chapitre écrit séparément pour chaque mode d’intimité. */
export const M = (tendre: RawLine[], suggestif: RawLine[], explicite: RawLine[], ellipse: RawLine[]): Chapter => ({ tendre, suggestif, explicite, ellipse });
/** Narration propre au corps choisi : femme, homme, intersexe. */
export const X = (femme: string, homme: string, intersexe: string): RawLine => ({ x: [femme, homme, intersexe] });
export const XB = (femme: string, homme: string, intersexe: string, mood?: string): RawLine => ({ x: [femme, homme, intersexe], speaker: "Bellirith", mood });
export const XP = (femme: string, homme: string, intersexe: string): RawLine => ({ x: [femme, homme, intersexe], speaker: "{player}" });
export const B = (text: string, mood?: string): RawLine => ["Bellirith", text, mood] as const;
export const P = (text: string): RawLine => ["{player}", text] as const;
export const S = (speaker: Speaker, text: string, mood?: string): RawLine => [speaker, text, mood] as const;
/** Variante d’historique : `yes` si le flag est présent, sinon `no`. */
export const W = (flag: string, yes: RawLine[], no: RawLine[] = []): RawLine => ({ when: flag, yes, no });

export function renderLines(raw: RawLine[], sex: PlayerSex, flags: string[]): DialogueLine[] {
  return raw.flatMap((entry): DialogueLine[] => {
    if (typeof entry === "string") return [{ speaker: "Narration", text: entry }];
    if ("when" in entry) return renderLines(flags.includes(entry.when) ? entry.yes : entry.no, sex, flags);
    if ("x" in entry) {
      const index = SEXES.indexOf(sex);
      return [{ speaker: entry.speaker || "Narration", text: entry.x[index], ...(entry.mood ? { mood: entry.mood } : {}) }];
    }
    return [{ speaker: entry[0], text: entry[1], ...(entry[2] ? { mood: entry[2] } : {}) }];
  });
}

export const SLEPT = "bellirith-has-slept";
export const FAVORITE = "bellirith-favorite";
export const RESISTED = "bellirith-has-resisted";
export const TREND_RESISTED = "bellirith-trend:resisted";
export const TREND_CEDED = "bellirith-trend:ceded";
export const TREND_MIXED = "bellirith-trend:mixed";
