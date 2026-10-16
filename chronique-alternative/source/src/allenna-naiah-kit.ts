import type { ChoiceData, DialogueLine, StatKey } from "./game-data";

/**
 * Vocabulaire partagé par la quête croisée Allenna × Naïah.
 * Aucun helper ne fabrique de phrase : chaque réplique est écrite à la main
 * dans le fichier de sa scène. Naïah tutoie tout le monde ; Allenna vouvoie
 * {player} et tutoie sa sœur (bible §30, §39, §99.1).
 */

export const T = (text: string, cast?: string[]): DialogueLine => ({ speaker: "Narration", text, ...(cast ? { cast } : {}) });
export const AL = (text: string, mood = "neutral"): DialogueLine => ({ speaker: "Allenna", text, mood });
export const NA = (text: string, mood = "smirk"): DialogueLine => ({ speaker: "Naïah", text, mood });
export const P = (text: string): DialogueLine => ({ speaker: "{player}", text });

/** Effets d’un choix AN. Naïah n’a pas de champ Désir : son désir n’existe pas dans cette série. */
export type ANFx = {
  al?: { affection?: number; trust?: number; desire?: number };
  na?: { affection?: number; trust?: number };
  /** Lien entre les deux sœurs, séparé des jauges individuelles avec {player}. */
  bond?: number;
  flags?: string[];
  stats?: Partial<Record<StatKey, number>>;
};

/** Registre des variations de lien fraternel par identifiant de choix (recalcul idempotent à l’hydratation). */
export const AN_BOND: Record<string, number> = {};

export function C(id: string, text: string, stat: StatKey, response: DialogueLine[], fx: ANFx = {}, extra: Partial<ChoiceData> = {}): ChoiceData {
  if (fx.bond) AN_BOND[id] = fx.bond;
  const relationshipEffects: NonNullable<ChoiceData["effects"]["relationshipEffects"]> = {};
  if (fx.al) relationshipEffects.allenna = { ...fx.al };
  if (fx.na) relationshipEffects.naiah = { affection: fx.na.affection, trust: fx.na.trust };
  return {
    id, text, stat, response,
    effects: { stats: { [stat]: 1, ...(fx.stats || {}) }, ...(Object.keys(relationshipEffects).length ? { relationshipEffects } : {}), ...(fx.flags?.length ? { flags: [...fx.flags] } : {}) },
    ...extra,
  };
}

/** Choisit une valeur selon une condition ; aucune phrase n’est assemblée. */
export function W<X>(condition: boolean, yes: X, no: X): X {
  return condition ? yes : no;
}

export const TRIO = ["allenna", "naiah"];
export const ONLY_NAIAH = ["naiah"];
export const ONLY_ALLENNA = ["allenna"];
