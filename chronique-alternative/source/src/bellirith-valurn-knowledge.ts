import type { KnowledgeEntry } from "./heritages-data";

/** Connaissances débloquées par le « Je n’ai jamais » de la quête croisée Bellirith / Valurn, dans l’ordre de révélation. */
export const BV_KNOWLEDGE: KnowledgeEntry[] = [
  { id: "bellirith-wanted-humanity", title: "Une vie qui finisse", summary: "Autrefois à moitié humaine, Bellirith voulait le devenir tout à fait. Valurn et elle avaient placé cet espoir dans un artefact capable de canaliser le Chaos.", people: ["bellirith", "valurn"] },
  { id: "bv-talisman-transfer", title: "Le talisman de transfert", summary: "Le talisman que Valurn avait confié à Bellirith ne la camouflait pas : il pouvait la déplacer jusqu’à lui. Il le lui avait présenté comme une protection pour qu’elle tienne son rôle de diversion.", people: ["bellirith", "valurn"] },
  { id: "bv-artifact-actual-effect", title: "Ce que faisait vraiment l’artefact", summary: "Valurn a volé l’artefact et l’a essayé sur lui-même. Il stabilise le Chaos, il apaise une nature ; il ne la change pas. Valurn ne l’a découvert qu’en s’en servant.", people: ["valurn", "bellirith"] },
  { id: "bv-abandon-chosen", title: "Un abandon choisi", summary: "Valurn pouvait déclencher le talisman et ne l’a pas fait. Il a décidé seul que perdre sa part humaine ferait moins souffrir Bellirith qu’un espoir impossible. Ce qu’elle ne lui pardonne pas, c’est qu’il lui ait pris ce choix.", people: ["bellirith", "valurn"] },
];
