import type { DialogueLine } from "./game-data";
import type { DateScene } from "./date-scenes";

type DateState = { flags: string[]; history: string[] };

/** Intro d’un rendez-vous, enrichie pour Bellirith selon l’historique (rempli plus bas). */
export function bellirithDateIntro(date: DateScene, game: DateState): DialogueLine[] {
  if (date.character !== "bellirith") return date.intro;
  return [...(BELLIRITH_DATE_PRELUDES[date.id]?.(game) || []), ...date.intro];
}

const BELLIRITH_DATE_PRELUDES: Record<string, (game: DateState) => DialogueLine[]> = {};

export function bellirithDateResultText(dateId: string, game: DateState) {
  void game;
  return dateId ? "Bellirith reste près de vous. Pour une fois, c’est vous qui choisissez le moment." : "";
}

export function bellirithDateResultAction(dateId: string) {
  return dateId ? "Maintenant" : "Suivre Bellirith";
}
