import type { ChoiceData, DialogueLine, Effects, StatKey } from "./game-data";

/**
 * Petit vocabulaire partagé par les fichiers Bellirith / Naïah.
 * Ces helpers ne produisent aucun texte : chaque réplique reste écrite à la main
 * dans le fichier de sa scène.
 */

/** Représentation interne de la métamorphose du rendez-vous final : jamais une entrée du cast réel. */
export const BN_FORM = "bellirith-as-amanea";
/** Sprite standard emprunté pour l’apparence ; Amanea elle-même n’est jamais présente. */
export const BN_FORM_SPRITE = "amanea";

export const T = (text: string, cast?: string[]): DialogueLine => ({ speaker: "Narration", text, ...(cast ? { cast } : {}) });
export const B = (text: string, mood = "teasing"): DialogueLine => ({ speaker: "Bellirith", text, mood });
export const Y = (text: string, mood = "smirk"): DialogueLine => ({ speaker: "Naïah", text, mood });
export const P = (text: string): DialogueLine => ({ speaker: "{player}", text });
export const C = (id: string, text: string, stat: StatKey, response: DialogueLine[], effects: Effects = {}, extra: Partial<ChoiceData> = {}): ChoiceData => ({ id, text, stat, response, effects, ...extra });

/** Historique Bellirith réellement présent dans la sauvegarde. */
export const BN_BELLIRITH_SLEPT = "bellirith-has-slept";
export const BN_BELLIRITH_FAVORITE = "bellirith-favorite";
export const BN_BELLIRITH_RESISTED = "bellirith-has-resisted";

/** Choisit une réplique selon un flag d’historique ; aucune phrase n’est assemblée. */
export function W<T>(flags: readonly string[], flag: string, yes: T, no: T): T {
  return flags.includes(flag) ? yes : no;
}
