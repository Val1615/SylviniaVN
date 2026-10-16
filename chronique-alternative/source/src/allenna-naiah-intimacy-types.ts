import type { DialogueLine } from "./game-data";

/**
 * Extensions intimes à trois, non graphiques. Douze séquences par variante :
 * 1 arrivée · 2 accord explicite de chacune · 3 conditions de Naïah · 4 pudeur d’Allenna ·
 * 5 initiative de {player} (trois options) · 6 suite selon l’initiative · 7 geste choisi par Naïah ·
 * 8 Allenna se détend · 9 moment le plus proche (romance ou amitié selon Allenna) ·
 * 10 bifurcation (geste, confidence, ralentir) · 11 suite de la bifurcation · 12 après.
 * Naïah n’éprouve aucun désir ; elle participe par la tendresse, la présence et des gestes
 * qu’elle choisit. Elle n’est jamais l’objet d’un geste sensuel. Chacun peut tout arrêter.
 */

export type ANExtOption = { id: string; label: string; response: DialogueLine[] };
export type ANExtSeq = {
  title: string;
  lines: DialogueLine[];
  /** Variantes selon l’option prise à la séquence précédente qui en propose. */
  after?: Record<string, DialogueLine[]>;
  options?: ANExtOption[];
  /** Séquences 9 et 11 : ligne romance (désir d’Allenna suffisant) ou ligne d’amitié tendre. */
  romance?: DialogueLine[];
  friendship?: DialogueLine[];
  /** En mode ellipse, seule la première ligne de la séquence est montrée. */
  veiled?: boolean;
};
export type ANExtension = { id: string; date: "lake" | "relay" | "home"; branch: string; title: string; background?: string; music: string; seqs: ANExtSeq[] };

export const AN_SEQ5_OPTIONS = ["o1", "o2", "o3"] as const;
export const AN_SEQ10_OPTIONS = ["geste", "confidence", "ralentir"] as const;
export const AN_EXT_SEQUENCES = 12;
