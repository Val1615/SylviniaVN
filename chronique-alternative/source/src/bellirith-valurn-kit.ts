import type { ChoiceData, DialogueLine, Effects, StatKey } from "./game-data";

/**
 * Vocabulaire partagé par la quête croisée Bellirith / Valurn.
 * Aucun helper ne fabrique de phrase : chaque réplique est écrite à la main
 * dans le fichier de sa scène ou de sa banque.
 */

export const T = (text: string, cast?: string[]): DialogueLine => ({ speaker: "Narration", text, ...(cast ? { cast } : {}) });
export const B = (text: string, mood = "teasing"): DialogueLine => ({ speaker: "Bellirith", text, mood });
export const V = (text: string, mood = "charming"): DialogueLine => ({ speaker: "Valurn", text, mood });
export const P = (text: string): DialogueLine => ({ speaker: "{player}", text });
export const C = (id: string, text: string, stat: StatKey, response: DialogueLine[], effects: Effects = {}, extra: Partial<ChoiceData> = {}): ChoiceData => ({ id, text, stat, response, effects, ...extra });

/** Choisit une réplique selon un flag d’historique ; aucune phrase n’est assemblée. */
export function W<X>(flags: readonly string[], flag: string, yes: X, no: X): X {
  return flags.includes(flag) ? yes : no;
}

/** Historique Bellirith réellement présent dans la sauvegarde (lecture seule). */
export const BV_BELLIRITH_STOOD = "bellirith-has-resisted";
export const BV_BELLIRITH_TREND_STOOD = "bellirith-trend:resisted";
export const BV_BELLIRITH_TREND_GAVE = "bellirith-trend:ceded";
export const BV_BELLIRITH_NIGHT = "bellirith-has-slept";
export const BV_BELLIRITH_FAVORITE = "bellirith-favorite";

/**
 * Flag propre à la série : le joueur a tenu tête à Bellirith pendant la série.
 * C’est la seule source de désir de Bellirith dans la quête croisée.
 */
export const BV_STOOD_UP = "cross-bv-stood-up";

/** Effet « tenir tête à Bellirith » : le seul qui puisse nourrir son désir. */
export const STAND: Effects["relationshipEffects"] = { bellirith: { desire: 2 } };

export const DUO = ["bellirith", "valurn"];
