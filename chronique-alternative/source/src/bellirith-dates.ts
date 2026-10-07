import type { DialogueLine } from "./game-data";
import type { DateScene } from "./date-scenes";

/*
 * Rendez-vous de Bellirith (spec §27, §25) : jeu, provocation, rivalité,
 * connaissance mutuelle — jamais « apprendre à séduire sans aura ».
 * Les préludes adaptent l’entrée en matière à l’historique (flags) sans
 * changer la scène elle-même.
 */

type DateState = { flags: string[]; history: string[] };

const L = (speaker: string, text: string, mood?: string): DialogueLine => ({ speaker, text, ...(mood ? { mood } : {}) });
const N = (text: string) => L("Narration", text);

const has = (game: DateState, flag: string) => game.flags.includes(flag);
const slept = (game: DateState) => has(game, "bellirith-has-slept");
const favorite = (game: DateState) => has(game, "bellirith-favorite");
const resisted = (game: DateState) => has(game, "bellirith-trend:resisted");
const mixed = (game: DateState) => has(game, "bellirith-trend:mixed");

/** Intro d’un rendez-vous, enrichie pour Bellirith selon l’historique. */
export function bellirithDateIntro(date: DateScene, game: DateState): DialogueLine[] {
  if (date.character !== "bellirith") return date.intro;
  return [...(BELLIRITH_DATE_PRELUDES[date.id]?.(game) || []), ...date.intro];
}

const BELLIRITH_DATE_PRELUDES: Record<string, (game: DateState) => DialogueLine[]> = {
  "date-bellirith-music": (game) => favorite(game) ? [
    N("Le carton d’invitation est arrivé avec une rose et une seule ligne : « Pour mon favori. Viens perdre en public. »"),
  ] : slept(game) ? [
    N("Le carton d’invitation sent le miel brûlé. Au dos, de sa main : « Tu connais déjà mon lit. Viens voir si tu connais mon jeu. »"),
  ] : resisted(game) ? [
    N("Le carton d’invitation est le plus sobre qu’elle vous ait jamais envoyé. « Pas de lit. Pas de bain. Pas de toit. Un salon plein de témoins. Tu n’auras aucune excuse pour refuser. »"),
  ] : mixed(game) ? [
    N("Le carton d’invitation hésite entre deux formules raturées. Il finit par dire : « Viens. Je ne sais plus ce que tu vas répondre, et j’en ai assez de ne pas savoir. »"),
  ] : [],
  "date-bellirith-market": (game) => slept(game) ? [
    N("Elle vous attend à l’entrée du marché et vous prend le bras comme si c’était une évidence, devant tout Al’Gratal. Deux marchandes se retournent. Elle leur sourit."),
  ] : resisted(game) ? [
    N("Elle vous attend à l’entrée du marché, à une distance parfaitement convenable. Pas un geste de trop. C’est sa manière à elle de vous défier : vous laisser constater combien vous remarquez ce qui manque."),
  ] : [],
  "date-bellirith-final": (game) => resisted(game) ? [
    N("Vous lui avez dit non au pire moment, trop de fois pour les compter. Ce soir, c’est vous qui proposez. Vous savez exactement ce que ça va lui faire, et c’est précisément pour ça que vous le faites."),
  ] : favorite(game) ? [
    N("Elle vous appelle « mon favori » depuis des semaines, devant n’importe qui, comme on désigne la meilleure place d’un théâtre. Ce soir, vous avez décidé de changer de place."),
  ] : slept(game) ? [
    N("Elle vous a toujours choisi le lieu, l’heure et la fin. Ce soir, vous avez décidé de tout choisir, sauf l’issue."),
  ] : [],
};

export function bellirithDateResultText(dateId: string, game: DateState) {
  if (dateId === "date-bellirith-final") return "Elle ne propose rien. Pour la première fois, Bellirith attend — appuyée contre le piano, les bras croisés, un sourire d’adversaire aux lèvres. Le moment vous appartient : vous pouvez dire « maintenant », ou la laisser sur cette égalité jusqu’à un autre soir.";
  if (slept(game)) return "Bellirith pose deux doigts sur votre pouls et sourit en trouvant la cadence qu’elle connaît. « Une heure volée ? » Elle vous laisse répondre. Elle a déjà l’air de savoir.";
  if (resisted(game)) return "Bellirith reste près de vous, à la distance exacte d’une invitation qu’elle ne formulera pas deux fois. « Je te propose la suite. Tu peux encore dire non. Tu es très doué·e pour ça. »";
  return "Bellirith reste près de vous et vous propose la suite d’un seul regard. Vous pouvez la suivre, ou garder cette soirée telle qu’elle est.";
}

export function bellirithDateResultAction(dateId: string) {
  return dateId === "date-bellirith-final" ? "« Maintenant. »" : "La suivre";
}
