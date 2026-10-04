import type { IntimacyMode, PlayerSex } from "./date-scenes";

export type NaiahIntimacyContext = "date-naiah-sanctuary" | "date-naiah-akuhn" | "home-naiah";
export type NaiahIntimacyPhase = "transition" | "initiative" | "undressing" | "reveal" | "exploration" | "adjustment" | "counterplay" | "experiment" | "escalation" | "surrender" | "climax" | "afterglow";
export type NaiahBinarySex = Extract<PlayerSex, "femme" | "homme">;
export type NaiahRawLine = string | readonly [speaker: string, text: string, mood?: string];
export type NaiahAuthoredChapter = readonly NaiahRawLine[];

export type NaiahAuthoredScene = {
  id: string;
  context: NaiahIntimacyContext;
  sex: NaiahBinarySex;
  concept: string;
  text: string;
  detail: string;
  chapters: Record<IntimacyMode, readonly NaiahAuthoredChapter[]>;
};

/** Ce helper ne produit aucun texte : il ne fait que conserver une séquence écrite manuellement. */
export const NC = (...lines: NaiahRawLine[]): NaiahAuthoredChapter => lines;
