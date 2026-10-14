import type { DialogueLine } from "./game-data";

/**
 * Quête 5 · « La partie truquée ». Marché d'informations interactif.
 * Logique pure, sérialisable dans la sauvegarde (`GameState.valurnMarket`).
 * Aucune action ne repose sur la magie : recouper, bluffer, négocier.
 */

export type ValurnApproach = "lucidite" | "audace" | "sangfroid";
export type OfferTruth = "vraie" | "fausse" | "incomplete" | "abusive";
export type OfferStatus = "open" | "bought" | "discarded";
export type MarketResult = "clean" | "partial" | "costly";
export type MarketReaction = "accused" | "admired" | "repaired" | "turned";

export type MarketOffer = {
  id: string;
  affirmation: string;
  source: string;
  fiabilite: "annoncée sûre" | "douteuse" | "inconnue";
  prix: number;
  risque: "faible" | "moyen" | "élevé";
  preuve: string;
  expose: string;
  truth: OfferTruth;
  /** Fausse piste semée par Valurn lui-même, révélée après la séance. */
  seededByValurn?: boolean;
  /** Ce que révèle un recoupement. */
  crossCheck: string;
  /** Réaction du vendeur à un contre-bluff. */
  bluff: string;
};

export const MARKET_BUDGET = 12;

export const MARKET_OFFERS: MarketOffer[] = [
  {
    id: "recu", affirmation: "Halbrecht a payé des « copies de correspondance » le mois dernier.", source: "Un apprenti greffier de Halbrecht", fiabilite: "douteuse",
    prix: 4, risque: "élevé", preuve: "Un reçu recopié à la main", expose: "L'apprenti greffier", truth: "vraie",
    crossCheck: "Le montant du reçu correspond au prix que Dame Vayre a cité pour les « nouvelles » de Lisse. La copie est fidèle.",
    bluff: "L'apprenti pâlit, puis baisse son prix d'un denier sans rien nier.",
  },
  {
    id: "dette", affirmation: "Corvin Lisse ne vend pas pour l'or : Halbrecht tient une dette de sa famille.", source: "Un prêteur du Croissant", fiabilite: "annoncée sûre",
    prix: 5, risque: "moyen", preuve: "Un extrait du registre du prêteur", expose: "La mère de Corvin", truth: "vraie",
    crossCheck: "Le registre porte bien le sceau de Halbrecht en garant. Le relieur du Croissant confirme que Lisse paie « en services ».",
    bluff: "Le prêteur hausse les épaules : « Vous le savez ? Alors payez moins. » Il ne s'émeut pas. Un vendeur qui dit vrai n'a rien à craindre.",
  },
  {
    id: "odile", affirmation: "La relieuse du Croissant a falsifié deux billets de Valurn. Elle est la source de la fuite.", source: "Un client mécontent d'Odile", fiabilite: "annoncée sûre",
    prix: 3, risque: "élevé", preuve: "Deux billets annotés de sa main", expose: "Odile Varrasque", truth: "abusive",
    crossCheck: "Les billets sont bien de sa main. Mais la date de la première fuite précède son premier billet modifié : elle a été un maillon, pas l'origine.",
    bluff: "Le client jubile et baisse son prix. Il veut surtout voir Odile tomber.",
  },
  {
    id: "bram", affirmation: "Le garçon de courses Bram revend des copies de plis au marché.", source: "Un billet anonyme, signé d'une encre rouge", fiabilite: "inconnue",
    prix: 2, risque: "élevé", preuve: "Aucune, seulement un horaire", expose: "Bram", truth: "fausse", seededByValurn: true,
    crossCheck: "L'horaire indiqué tombe un jour de fermeture du marché. Personne n'a vu Bram vendre quoi que ce soit.",
    bluff: "Personne ne se présente pour défendre le billet. Le vendeur a disparu, comme si l'offre n'attendait que d'être achetée.",
  },
  {
    id: "sel", affirmation: "La caisse de sel noir a été achetée par un agent de la cour.", source: "Un porteur du Croissant", fiabilite: "douteuse",
    prix: 3, risque: "moyen", preuve: "Un bout de cachet de cire", expose: "Personne de précis", truth: "fausse", seededByValurn: true,
    crossCheck: "Le cachet est celui d'un marchand de cire du marché, vendu à n'importe qui. Aucun agent de la cour n'a signé de bon d'achat.",
    bluff: "Le porteur se trouble, puis lâche : « On m'a payé pour le répéter. » Il ne dit pas qui.",
  },
  {
    id: "clause", affirmation: "Halbrecht prépare une clause pour revendiquer les correspondants de Valurn.", source: "Un clerc de notaire", fiabilite: "inconnue",
    prix: 4, risque: "faible", preuve: "Le brouillon d'une première page", expose: "Le clerc", truth: "incomplete",
    crossCheck: "La première page est authentique. Il manque la suite : on ne sait ni quand ni contre qui la clause sera utilisée.",
    bluff: "Le clerc rit : « Bluffez tant que vous voulez, je n'ai que la première page. » C'est vrai.",
  },
  {
    id: "thazran", affirmation: "Thazran a vendu la même réponse à un second acheteur.", source: "Un courrier des Calciterres", fiabilite: "douteuse",
    prix: 2, risque: "faible", preuve: "Le reçu d'un pli roussi", expose: "Personne de précis", truth: "vraie",
    crossCheck: "Le pli est daté et adressé au comptoir que fréquente Lisse. Vrai, mais il ne prouve rien seul.",
    bluff: "Le courrier ne cille pas. Il s'en moque : il est payé à la course.",
  },
];

export type ValurnMarketState = {
  approach: ValurnApproach;
  statuses: Record<string, OfferStatus>;
  checked: string[];
  bluffed: string[];
  protectedSources: string[];
  attempts: number;
  /** Offres achetées au moins une fois, même si elles ont été rendues ensuite. */
  boughtEver: string[];
  /** Prix majorés après une mauvaise offre (nouvelle contrepartie). */
  surcharge: Record<string, number>;
  lastVerdict?: MarketVerdict;
  phase: "board" | "reveal" | "done";
  result?: MarketResult;
  reaction?: MarketReaction;
};

export type MarketVerdict = { kind: "clean" | "partial" | "failed"; lines: string[] };

export function createValurnMarket(approach: ValurnApproach): ValurnMarketState {
  return {
    approach,
    statuses: Object.fromEntries(MARKET_OFFERS.map((offer) => [offer.id, "open" as OfferStatus])),
    checked: [], bluffed: [], protectedSources: [], attempts: 0, boughtEver: [], surcharge: {}, phase: "board",
  };
}

export function validateValurnMarket(value: unknown): value is ValurnMarketState {
  if (!value || typeof value !== "object") return false;
  const state = value as ValurnMarketState;
  return ["lucidite", "audace", "sangfroid"].includes(state.approach)
    && Boolean(state.statuses) && Array.isArray(state.checked) && Array.isArray(state.bluffed)
    && Array.isArray(state.protectedSources) && typeof state.attempts === "number"
    && ["board", "reveal", "done"].includes(state.phase);
}

export const checkLimit = (state: ValurnMarketState) => state.approach === "lucidite" ? 4 : 2;
export const bluffLimit = (state: ValurnMarketState) => state.approach === "audace" ? 3 : 1;
export const protectLimit = (state: ValurnMarketState) => state.approach === "sangfroid" ? 2 : 1;

export function offerPrice(state: ValurnMarketState, offer: MarketOffer) {
  const bluffDiscount = state.bluffed.includes(offer.id) && offer.truth !== "vraie" ? 1 : 0;
  return Math.max(1, offer.prix + (state.surcharge[offer.id] || 0) - bluffDiscount);
}

export function spent(state: ValurnMarketState) {
  return MARKET_OFFERS.filter((offer) => state.statuses[offer.id] === "bought").reduce((sum, offer) => sum + offerPrice(state, offer), 0);
}

export const exposedPeople = () => Array.from(new Set(MARKET_OFFERS.map((offer) => offer.expose).filter((name) => name !== "Personne de précis")));

export function setOfferStatus(state: ValurnMarketState, id: string, status: OfferStatus): ValurnMarketState {
  const offer = MARKET_OFFERS.find((entry) => entry.id === id);
  if (!offer || state.phase !== "board") return state;
  if (status === "bought" && state.statuses[id] !== "bought" && spent(state) + offerPrice(state, offer) > MARKET_BUDGET) return state;
  const boughtEver = status === "bought" ? Array.from(new Set([...(state.boughtEver || []), id])) : state.boughtEver || [];
  return { ...state, statuses: { ...state.statuses, [id]: status }, boughtEver, lastVerdict: undefined };
}

export function crossCheck(state: ValurnMarketState, id: string): ValurnMarketState {
  if (state.phase !== "board" || state.checked.includes(id) || state.checked.length >= checkLimit(state)) return state;
  return { ...state, checked: [...state.checked, id] };
}

export function bluffOffer(state: ValurnMarketState, id: string): ValurnMarketState {
  if (state.phase !== "board" || state.bluffed.includes(id) || state.bluffed.length >= bluffLimit(state)) return state;
  return { ...state, bluffed: [...state.bluffed, id] };
}

export function toggleProtection(state: ValurnMarketState, person: string): ValurnMarketState {
  if (state.phase !== "board") return state;
  if (state.protectedSources.includes(person)) return { ...state, protectedSources: state.protectedSources.filter((entry) => entry !== person) };
  if (state.protectedSources.length >= protectLimit(state)) return state;
  return { ...state, protectedSources: [...state.protectedSources, person] };
}

/** Évalue l'offre composée. Un échec ajoute une contrepartie mais ne ferme jamais la séance. */
export function evaluateOffer(state: ValurnMarketState): MarketVerdict {
  const bought = MARKET_OFFERS.filter((offer) => state.statuses[offer.id] === "bought");
  const has = (id: string) => bought.some((offer) => offer.id === id);
  const lines: string[] = [];
  const falseOnes = bought.filter((offer) => offer.truth === "fausse");
  if (!bought.length) return { kind: "failed", lines: ["Vous présentez une offre vide. Le salon s'amuse poliment. Achetez au moins une affirmation."] };
  if (falseOnes.length) {
    for (const offer of falseOnes) lines.push(`« ${offer.affirmation} » ne tient pas : ${offer.crossCheck}`);
    lines.push("Votre conclusion s'effondre devant les courtiers. Les vendeurs restants relèvent leurs prix d'un denier.");
    return { kind: "failed", lines };
  }
  const keys = has("recu") && has("dette");
  if (!keys) {
    lines.push(has("recu") || has("dette")
      ? "Vous tenez la moitié du chemin : on voit l'acheteur ou le mobile, pas les deux. Halbrecht peut tout nier."
      : "Rien dans votre offre ne relie Halbrecht à la fuite. Le salon vous écoute, puis passe à autre chose.");
    if (has("odile") && !state.protectedSources.includes("Odile Varrasque")) lines.push("Et vous venez de désigner Odile comme coupable devant tout le monde.");
    return { kind: has("recu") || has("dette") ? "partial" : "failed", lines };
  }
  lines.push("Le reçu et la dette se répondent : Halbrecht achète, Lisse vend sous contrainte. La conclusion tient.");
  if (has("clause")) lines.push("La première page de clause donne à Valurn une longueur d'avance, même incomplète.");
  if (has("thazran")) lines.push("Le pli roussi confirme que la même réponse a circulé deux fois.");
  if (has("odile") && !state.protectedSources.includes("Odile Varrasque")) {
    lines.push("Mais l'offre sur Odile est vraie et trompeuse : en l'achetant sans la protéger, vous la désignez comme l'origine de la fuite.");
    return { kind: "partial", lines };
  }
  if (has("recu") && !state.protectedSources.includes("L'apprenti greffier")) lines.push("L'apprenti greffier sera reconnu. Halbrecht le renverra sans doute.");
  return { kind: has("recu") && !state.protectedSources.includes("L'apprenti greffier") && state.approach !== "sangfroid" ? "partial" : "clean", lines };
}

export function submitOffer(state: ValurnMarketState): ValurnMarketState {
  if (state.phase !== "board") return state;
  const verdict = evaluateOffer(state);
  if (verdict.kind === "failed") {
    const surcharge = { ...state.surcharge };
    for (const offer of MARKET_OFFERS) if (state.statuses[offer.id] !== "bought") surcharge[offer.id] = Math.min(2, (surcharge[offer.id] || 0) + 1);
    const statuses = Object.fromEntries(MARKET_OFFERS.map((offer) => [offer.id, offer.truth === "fausse" && state.statuses[offer.id] === "bought" ? "discarded" : state.statuses[offer.id] === "bought" ? "open" : state.statuses[offer.id]])) as Record<string, OfferStatus>;
    return { ...state, statuses, surcharge, attempts: state.attempts + 1, lastVerdict: verdict };
  }
  return { ...state, attempts: state.attempts + 1, lastVerdict: verdict };
}

/** Conclure : accepter le verdict courant, ou, après deux échecs, une conclusion coûteuse. */
export function concludeMarket(state: ValurnMarketState): ValurnMarketState {
  const verdict = state.lastVerdict;
  if (state.phase !== "board") return state;
  if (verdict?.kind === "clean") return { ...state, phase: "reveal", result: "clean" };
  if (verdict?.kind === "partial") return { ...state, phase: "reveal", result: "partial" };
  if (state.attempts >= 2) return { ...state, phase: "reveal", result: "costly" };
  return state;
}

export const canConclude = (state: ValurnMarketState) => state.phase === "board" && (state.lastVerdict?.kind === "clean" || state.lastVerdict?.kind === "partial" || state.attempts >= 2);

export function boughtSeeded(state: ValurnMarketState) {
  return MARKET_OFFERS.some((offer) => offer.seededByValurn && (state.boughtEver || []).includes(offer.id));
}

const N = (text: string): DialogueLine => ({ speaker: "Narration", text });
const V = (text: string, mood = "neutral"): DialogueLine => ({ speaker: "Valurn", text, mood });
const P = (text: string): DialogueLine => ({ speaker: "{player}", text });

export const MARKET_INTRO: Record<ValurnApproach, string> = {
  lucidite: "Recoupement minutieux : quatre vérifications possibles. Chaque recoupement révèle ce que vaut vraiment une offre.",
  audace: "Contre-bluff : trois bluffs possibles. Un vendeur qui ment se trouble et baisse son prix ; un vendeur sincère ne bouge pas.",
  sangfroid: "Négociation protégée : vous pouvez protéger deux personnes exposées, et le salon accepte une offre prudente comme conclusion propre.",
};

/** Le renversement : Valurn a semé une partie des fausses pistes. */
export function revealLines(state: ValurnMarketState): DialogueLine[] {
  const hurtBram = boughtSeeded(state) || state.result === "costly";
  return [
    N("Le salon se vide. Valurn referme le registre, puis le rouvre à la page de l'offre sur Bram et pose l'index sur l'encre rouge."),
    V("Celle-là, c'est moi. Et le porteur au cachet de cire aussi. Je les ai fait circuler il y a dix jours, pour voir qui les rachèterait et à qui."),
    P("Vous ne m'avez rien dit."),
    V("Non. Vous auriez joué autrement. J'avais besoin que vous jouiez comme quelqu'un qui ne sait pas.", "neutral"),
    ...(hurtBram ? [
      N("Dehors, Bram, le garçon de courses, attend près de la porte. Un étal lui a refusé sa course du matin. On murmure déjà qu'il vend des plis."),
      V("Il n'a rien fait. Je savais que son nom pouvait circuler. J'ai jugé le risque acceptable. Pour moi, il l'était.", "neutral"),
    ] : [
      N("Vous n'avez acheté aucune des deux fausses pistes. Bram, le garçon de courses dont le nom circulait, passe sous la fenêtre sans savoir qu'il a failli payer."),
      V("Vous ne les avez pas achetées. Il aurait suffi d'une fois pour que ce garçon perde ses courses. Je le savais en écrivant son nom.", "neutral"),
    ]),
    V("C'était rationnel. Le revendeur s'est trahi en achetant ma fausse piste avant vous. Je ne retire rien. Je vous dis seulement que je l'ai fait."),
  ];
}

export const MARKET_REACTIONS: { id: MarketReaction; label: string; lines: DialogueLine[] }[] = [
  { id: "accused", label: "L'accuser : il s'est servi de vous et d'un innocent.", lines: [
    P("Vous m'avez utilisé·e comme un pion, et vous avez mis le nom d'un garçon sur la table pour gagner du temps."),
    V("Oui.", "annoyed"),
    N("Il attend la suite. Vous ne la donnez pas. Le silence dure plus que ce qu'il supporte d'habitude."),
    V("Vous voulez que je dise que j'ai eu tort. Je ne le pense pas entièrement. Je pense que je vous dois de ne plus le faire avec vous. Ça, je peux le promettre."),
  ] },
  { id: "admired", label: "L'admirer : le piège était brillant, et il a fonctionné.", lines: [
    P("C'était brillant. Le revendeur a mordu."),
    V("Merci. Je n'espérais pas d'applaudissements, j'en prends note.", "charming"),
    N("Il sourit, puis son regard glisse vers la porte où se tenait Bram."),
    V("Ne m'admirez pas trop vite. Le garçon, lui, n'applaudira pas.", "neutral"),
  ] },
  { id: "repaired", label: "L'aider à réparer : laver le nom de Bram avant ce soir.", lines: [
    P("On répare. Maintenant. Vous allez dire au marché que ce billet était faux, et d'où il venait."),
    V("D'où il venait ? Vous voulez que j'avoue publiquement une manœuvre ?", "surprised"),
    P("Je veux que Bram retrouve ses courses."),
    N("Il le fait, à sa façon : il annonce au marché que le billet sur Bram était une farce de mauvais goût « d'un concurrent ». Puis il paie au garçon trois semaines de courses d'avance. Il ne s'accuse pas. Il répare."),
    V("Une moitié de vérité et une semaine de salaire. C'est ce que je peux faire sans perdre le marché. Vous pouvez trouver ça insuffisant."),
  ] },
  { id: "turned", label: "Retourner ses méthodes contre lui : lui vendre à son tour une fausse piste.", lines: [
    P("Très bien. Alors je vous préviens : le registre que je vous ai rendu contient une page fausse. Je ne vous dirai pas laquelle."),
    V("Vous... vous mentez.", "surprised"),
    P("Peut-être. Vérifiez. Vous adorez vérifier."),
    N("Il feuillette, s'arrête, reprend. Pendant une longue seconde, il ne sait pas. Puis il rit, vraiment, un rire bref et vexé."),
    V("C'est odieux. Je vais y penser toute la nuit. Nous sommes quittes, et je déteste ça.", "amused"),
  ] },
];

export const MARKET_RESULT_LABEL: Record<MarketResult, string> = {
  clean: "Conclusion propre",
  partial: "Conclusion partielle",
  costly: "Conclusion coûteuse",
};
