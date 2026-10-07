import type { ChoiceData, DialogueLine, Effects, PeriodKey, StatKey } from "./game-data";

/*
 * Bellirith · fil d’interférence de l’Acte I.
 *
 * Bellirith n’a pas de « route de guérison » en Acte I. Elle se greffe sur la
 * campagne principale : quatre intrusions (après l’audience, le prix de
 * l’aide, la lettre d’Amanea et la séance devant Tia), puis le chapitre IX qui
 * réagit à tout l’historique. Le joueur peut céder (scène intime précoce,
 * affection, familiarité, désir de Bellirith presque immobile) ou résister
 * (aucune scène, désir de Bellirith en forte hausse). Toute la mémoire tient
 * dans des flags légers : aucune sauvegarde parallèle « route cède / route
 * résiste ».
 */

export type BellirithIntrusionId = "01" | "02" | "03" | "04";
export type BellirithIntrusionMode = "live" | "catchup";
export type BellirithTrend = "none" | "ceded" | "resisted" | "mixed";

export type BellirithState = { flags: string[]; history: string[] };

export type BellirithIntrusion = {
  id: BellirithIntrusionId;
  afterScene: string;
  title: string;
  location: string;
  spot: string;
  period: PeriodKey;
  background: string;
  liveCast: string[];
  catchupCast: string[];
  /** Contexte intime ouvert lorsque le joueur cède. L’intrusion 01 n’en propose aucun. */
  diversion?: string;
  catchupInvitationId: string;
};

export const BELLIRITH_INTRUSION_IDS: BellirithIntrusionId[] = ["01", "02", "03", "04"];
export const BELLIRITH_MIGRATION_MARKER = "bellirith-refactor-v1-migrated";
export const BELLIRITH_RESISTED_FLAG = "bellirith-has-resisted";
export const BELLIRITH_FAVORITE_FLAG = "bellirith-favorite";
export const BELLIRITH_SLEPT_FLAG = "bellirith-has-slept";
export const BELLIRITH_COALITION_CEDED_FLAG = "bellirith-coalition:accepted";
export const BELLIRITH_COALITION_RESISTED_FLAG = "bellirith-coalition:resisted";
export const BELLIRITH_FINAL_DATE_ID = "date-bellirith-final";
export const BELLIRITH_TREND_FLAGS = ["bellirith-trend:none", "bellirith-trend:ceded", "bellirith-trend:resisted", "bellirith-trend:mixed"];

export const BELLIRITH_DIVERSION_IDS = [
  "bellirith-diversion-price-of-aid",
  "bellirith-diversion-return-akuhn",
  "bellirith-diversion-before-light",
  "bellirith-diversion-coalition",
] as const;

export const BELLIRITH_INTRUSIONS: BellirithIntrusion[] = [
  {
    id: "01",
    afterScene: "campaign-imperial-audience",
    title: "Une sœur dans l’embrasure",
    location: "algratal",
    spot: "algratal-palace-council",
    period: "soirée",
    background: "/assets/backgrounds/algratal_council.webp",
    liveCast: ["valurn", "bellirith", "iriana"],
    catchupCast: ["bellirith"],
    catchupInvitationId: "invite-bellirith-catchup-01",
  },
  {
    id: "02",
    afterScene: "campaign-price-of-aid",
    title: "La lettre peut attendre",
    location: "algratal",
    spot: "algratal-palace-council",
    period: "apres-midi",
    background: "/assets/backgrounds/algratal_council.webp",
    liveCast: ["iriana", "bellirith", "draven"],
    catchupCast: ["bellirith"],
    diversion: "bellirith-diversion-price-of-aid",
    catchupInvitationId: "invite-bellirith-catchup-02",
  },
  {
    id: "03",
    afterScene: "campaign-amanea-letter",
    title: "Le courrier de minuit",
    location: "akuhn",
    spot: "akuhn-war-room",
    period: "soirée",
    background: "/assets/backgrounds/war_room.webp",
    liveCast: ["draven", "bellirith"],
    catchupCast: ["bellirith"],
    diversion: "bellirith-diversion-return-akuhn",
    catchupInvitationId: "invite-bellirith-catchup-03",
  },
  {
    id: "04",
    afterScene: "campaign-before-light",
    title: "Ce que la Lumière ne célèbre pas",
    location: "algratal",
    spot: "algratal-palace-audience",
    period: "matin",
    background: "/assets/backgrounds/alcove.webp",
    liveCast: ["iriana", "bellirith", "draven"],
    catchupCast: ["bellirith"],
    diversion: "bellirith-diversion-before-light",
    catchupInvitationId: "invite-bellirith-catchup-04",
  },
];

/* ───────────── Flags & compteurs ───────────── */

const flag = (id: BellirithIntrusionId, state: string) => `bellirith-intrusion:${id}:${state}`;
export const bellirithIntrusionFlag = flag;

export function bellirithIntrusionById(id: string) {
  return BELLIRITH_INTRUSIONS.find((entry) => entry.id === id);
}

export function bellirithIntrusionResolved(state: BellirithState, id: BellirithIntrusionId) {
  return state.flags.includes(flag(id, "seen"))
    || state.flags.includes(flag(id, "accepted"))
    || state.flags.includes(flag(id, "resisted"));
}

export function bellirithIntrusionMissed(state: BellirithState, id: BellirithIntrusionId) {
  return state.flags.includes(flag(id, "missed")) && !bellirithIntrusionResolved(state, id);
}

export function bellirithAcceptedCount(state: BellirithState) {
  return BELLIRITH_INTRUSION_IDS.filter((id) => state.flags.includes(flag(id, "accepted"))).length
    + (state.flags.includes(BELLIRITH_COALITION_CEDED_FLAG) ? 1 : 0);
}

export function bellirithResistedCount(state: BellirithState) {
  return BELLIRITH_INTRUSION_IDS.filter((id) => state.flags.includes(flag(id, "resisted"))).length
    + (state.flags.includes(BELLIRITH_COALITION_RESISTED_FLAG) ? 1 : 0);
}

/** Nombre d’intrusions réellement résolues (jouées en direct ou en rattrapage). */
export function bellirithIntrusionCount(state: BellirithState) {
  return BELLIRITH_INTRUSION_IDS.filter((id) => bellirithIntrusionResolved(state, id)).length;
}

export function bellirithIsFavorite(state: BellirithState) {
  return state.flags.includes(BELLIRITH_FAVORITE_FLAG);
}

export function bellirithHasSlept(state: BellirithState) {
  return state.flags.includes(BELLIRITH_SLEPT_FLAG);
}

export function bellirithTrend(state: BellirithState): BellirithTrend {
  const accepted = bellirithAcceptedCount(state);
  const resisted = bellirithResistedCount(state);
  if (!accepted && !resisted) return "none";
  // « Toujours résisté » : aucune diversion acceptée.
  if (!accepted) return "resisted";
  // « Beaucoup cédé » : jamais résisté, ou au moins deux fois plus de oui que de non.
  if (!resisted || accepted >= resisted * 2) return "ceded";
  // Historique mixte : elle connaît certaines réactions et sait qu’on peut lui échapper.
  return "mixed";
}

/** Étape affichée dans la fiche : intrusions résolues + chapitre IX. */
export function bellirithFilStage(state: BellirithState) {
  return Math.min(5, bellirithIntrusionCount(state) + (state.history.includes("campaign-coalition-preparation") ? 1 : 0));
}

export function bellirithFlagsWithTrend(flags: string[]) {
  const base = flags.filter((entry) => !BELLIRITH_TREND_FLAGS.includes(entry));
  const trend = `bellirith-trend:${bellirithTrend({ flags: base, history: [] })}`;
  // Stable : si la tendance est déjà la bonne, ne rien réordonner (relectures sans mutation).
  if (flags.length === base.length + 1 && flags.includes(trend)) return flags;
  return [...base, trend];
}

/** Intrusion jouable en direct juste après un jalon de campagne — jamais deux fois. */
export function bellirithIntrusionAfter(completedCampaignSceneId: string, state: BellirithState) {
  const intrusion = BELLIRITH_INTRUSIONS.find((entry) => entry.afterScene === completedCampaignSceneId);
  if (!intrusion) return undefined;
  if (bellirithIntrusionResolved(state, intrusion.id)) return undefined;
  if (state.flags.includes(flag(intrusion.id, "missed"))) return undefined;
  if (state.flags.includes(flag(intrusion.id, "live-started"))) return undefined;
  return intrusion;
}

/** File de rattrapage : une seule intervention persistante à la fois, dans l’ordre. */
/** Intrusion lancée en direct (flag `live-started`) et pas encore résolue. */
export function bellirithPendingLive(completedCampaignSceneId: string, state: BellirithState) {
  const intrusion = BELLIRITH_INTRUSIONS.find((entry) => entry.afterScene === completedCampaignSceneId);
  if (!intrusion) return undefined;
  if (!state.flags.includes(flag(intrusion.id, "live-started"))) return undefined;
  if (bellirithIntrusionResolved(state, intrusion.id)) return undefined;
  return intrusion;
}
/**
 * Marque « manquée » toute intrusion dont le jalon est joué, qui n’est ni
 * résolue, ni lancée en direct, ni déjà manquée (outils dev, anciennes
 * sauvegardes, Acte I marqué accompli).
 */
export function markMissedBellirithIntrusions(state: BellirithState) {
  const additions = BELLIRITH_INTRUSIONS.filter((intrusion) => state.history.includes(intrusion.afterScene)
    && !bellirithIntrusionResolved(state, intrusion.id)
    && !state.flags.includes(flag(intrusion.id, "live-started"))
    && !state.flags.includes(flag(intrusion.id, "missed")))
    .map((intrusion) => flag(intrusion.id, "missed"));
  return additions.length ? bellirithFlagsWithTrend([...state.flags, ...additions]) : state.flags;
}
export function nextBellirithCatchup(state: BellirithState & { invitations: { id: string; status: string }[] }) {
  const pendingCatchup = state.invitations.some((entry) => entry.status === "pending" && entry.id.startsWith("invite-bellirith-catchup-"));
  if (pendingCatchup) return undefined;
  return BELLIRITH_INTRUSIONS.find((entry) => bellirithIntrusionMissed(state, entry.id)
    && !state.invitations.some((received) => received.id === entry.catchupInvitationId && received.status === "pending"));
}

/**
 * Migration v1 : une sauvegarde qui a déjà dépassé un jalon sans avoir pu
 * vivre l’intrusion reçoit un rattrapage persistant. Une intrusion commencée en
 * direct puis interrompue par un rechargement rejoint la même file. Le
 * marqueur empêche toute réinjection lors des chargements suivants.
 */
export function migrateBellirithFlags(state: BellirithState) {
  let flags = [...state.flags];
  const interrupted = BELLIRITH_INTRUSION_IDS.filter((id) => flags.includes(flag(id, "live-started")) && !bellirithIntrusionResolved({ flags, history: state.history }, id));
  flags = flags.filter((entry) => !/^bellirith-intrusion:0[1-4]:live-started$/.test(entry));
  interrupted.forEach((id) => flags.push(flag(id, "missed")));
  if (!flags.includes(BELLIRITH_MIGRATION_MARKER)) {
    BELLIRITH_INTRUSIONS.forEach((intrusion) => {
      if (state.history.includes(intrusion.afterScene) && !bellirithIntrusionResolved({ flags, history: state.history }, intrusion.id)) {
        flags.push(flag(intrusion.id, "missed"));
      }
    });
    flags.push(BELLIRITH_MIGRATION_MARKER);
  }
  return bellirithFlagsWithTrend(Array.from(new Set(flags)));
}

export function isBellirithCedeChoice(choice: Pick<ChoiceData, "id">) {
  return /^bel-i0[2-4]-cede-/.test(choice.id) || choice.id === "coalition-follow-bellirith";
}

export function bellirithDiversionForChoice(choiceId: string) {
  if (choiceId === "coalition-follow-bellirith") return "bellirith-diversion-coalition";
  const match = choiceId.match(/^bel-i(0[2-4])-cede-/);
  return match ? bellirithIntrusionById(match[1])?.diversion : undefined;
}

/**
 * Flags appliqués lorsqu’une intrusion se résout. Le choix porte déjà ses
 * propres flags ; on y ajoute la trace du mode, le statut de favori et la
 * tendance recalculée, puis on retire les marqueurs temporaires.
 */
export function bellirithResolutionFlags(flags: string[], id: BellirithIntrusionId, choice: ChoiceData, mode: BellirithIntrusionMode) {
  const cleaned = flags.filter((entry) => entry !== flag(id, "live-started") && entry !== flag(id, "missed"));
  const next = [...cleaned, ...(choice.effects.flags || []), flag(id, mode)];
  if (isBellirithCedeChoice(choice)) {
    const accepted = bellirithAcceptedCount({ flags: next, history: [] });
    if (accepted >= 2 || choice.id.includes("-cede-dare")) next.push(BELLIRITH_FAVORITE_FLAG);
  } else {
    next.push(BELLIRITH_RESISTED_FLAG);
  }
  return bellirithFlagsWithTrend(Array.from(new Set(next)));
}

/* ───────────── Outils d’écriture ───────────── */

export const L = (speaker: string, text: string, mood?: string): DialogueLine => ({ speaker, text, ...(mood ? { mood } : {}) });
export const N = (text: string): DialogueLine => L("Narration", text);
export const P = (text: string): DialogueLine => L("{player}", text);
export const B = (text: string, mood?: string): DialogueLine => L("Bellirith", text, mood);
const I = (text: string, mood?: string) => L("Iriana", text, mood);
const D = (text: string, mood?: string) => L("Draven", text, mood);
const V = (text: string, mood?: string) => L("Valurn", text, mood);

type ChoiceSeed = {
  id: string;
  text: string;
  stat: StatKey;
  response: DialogueLine[];
  effects: Effects;
  liveAftermath?: DialogueLine[];
  requires?: ChoiceData["requires"];
};

function choice(seed: ChoiceSeed, mode: BellirithIntrusionMode): ChoiceData {
  const effects: Effects = { ...seed.effects, stats: { ...(seed.effects.stats || {}), [seed.stat]: 1 } };
  if (mode === "catchup") delete effects.relationshipEffects;
  return {
    id: seed.id,
    text: seed.text,
    stat: seed.stat,
    response: mode === "live" ? [...seed.response, ...(seed.liveAftermath || [])] : seed.response,
    effects,
    ...(seed.requires ? { requires: seed.requires } : {}),
  };
}

type Ctx = {
  mode: BellirithIntrusionMode;
  live: boolean;
  accepted: number;
  resisted: number;
  favorite: boolean;
  slept: boolean;
  met: boolean;
  trend: BellirithTrend;
  /** Acceptations précédentes jouées en direct : la répétition durcit les réactions. */
  liveAccepted: number;
  coalitionDone: boolean;
};

function ctx(state: BellirithState, mode: BellirithIntrusionMode): Ctx {
  return {
    mode,
    live: mode === "live",
    accepted: bellirithAcceptedCount(state),
    resisted: bellirithResistedCount(state),
    favorite: bellirithIsFavorite(state),
    slept: bellirithHasSlept(state),
    met: bellirithIntrusionResolved(state, "01") || state.history.includes("campaign-coalition-preparation") || bellirithIntrusionCount(state) > 0,
    trend: bellirithTrend(state),
    liveAccepted: BELLIRITH_INTRUSION_IDS.filter((id) => state.flags.includes(flag(id, "accepted")) && state.flags.includes(flag(id, "live"))).length,
    coalitionDone: state.history.includes("campaign-coalition-preparation"),
  };
}

/** Variation déterministe des gains de désir : jamais un « bouton +5 » lisible. */
function desire(base: number, c: Ctx, salt: number) {
  const spread = (c.resisted + c.accepted + salt) % 3; // 0, 1 ou 2
  return base + (spread === 2 ? 1 : spread === 1 ? 0 : (salt % 2 ? 1 : 0));
}

export type BellirithIntrusionScene = {
  intrusion: BellirithIntrusion;
  mode: BellirithIntrusionMode;
  title: string;
  cast: string[];
  intro: DialogueLine[];
  choices: ChoiceData[];
};

/* ───────────── Intrusion 01 · après l’audience ───────────── */

function intrusion01(c: Ctx): { intro: DialogueLine[]; choices: ChoiceData[] } {
  const intro: DialogueLine[] = c.live ? [
    N("Iriana roule le relevé de runes et le scelle d’un ruban gris. L’audience est terminée ; personne ne l’a dit, mais Valurn a reposé ses bottes par terre, ce qui chez lui équivaut à une sonnerie de fin."),
    N("Le parfum arrive avant elle. Du miel brûlé, une note de jasmin, et quelque chose de plus chaud dessous, comme une pièce où l’on vient d’éteindre trop de bougies à la fois."),
    B("Tu as encore laissé la porte entrouverte, mon frère. Tu sais ce que je pense des invitations implicites.", "smirk"),
    N("Une femme se tient dans l’embrasure. Les gardes, de part et d’autre, regardent obstinément le mur d’en face avec l’air de deux hommes qui viennent de se souvenir de quelque chose de très intime."),
    V("Bellirith. Le palais a des gardes.", "annoyed"),
    B("Le palais a des gardes qui ont des désirs. C’est presque la même chose qu’une clé.", "teasing"),
    I("Vous n’êtes pas attendue.", "stern"),
    B("C’est précisément ce qui rend mes visites mémorables, chérie.", "seductive"),
    N("Elle traverse la salle du Conseil comme on traverse sa propre chambre, effleure au passage le dossier du fauteuil d’Iriana, puis s’arrête derrière Valurn. Elle se penche jusqu’à ce que sa bouche frôle presque l’oreille de son frère."),
    B("Tu as ta mâchoire des mauvaises nouvelles. Quelque chose de démoniaque t’a souri aujourd’hui ?", "smirk"),
    V("Rien qui te concerne.", "annoyed"),
    B("Tout ce qui te fait serrer les dents me concerne. C’est l’un de mes rares engagements familiaux.", "teasing"),
    N("Alors seulement elle vous remarque. Pas d’un coup : son regard glisse sur vous, revient, se pose. Elle redresse la tête avec l’intérêt d’une joueuse qui découvre une carte qu’elle n’a pas vue distribuer."),
    B("Et ça ? Tu collectionnes les curiosités, maintenant ?", "thoughtful"),
    N("Elle s’approche. Son aura vous touche avant ses mots : pas une contrainte, une question. Elle cherche ce qui, chez vous, a déjà envie de quelque chose, et souffle dessus pour voir si la braise prend."),
    B("Tu ne sens ni la cour, ni la route. Tu sens… une porte mal fermée. Et ton cœur bat très poliment pour quelqu’un que je viens de frôler.", "seductive"),
    I("Cette personne est ici sous le sceau du phénix.", "stern"),
    B("« Cette personne. » Vous en parlez comme d’une pièce à conviction. Comme c’est triste pour elle.", "smirk"),
    V("Laisse cette curiosité tranquille, Bellirith.", "annoyed"),
    N("Le sourire de Bellirith s’élargit lentement. Elle ne vous regarde plus ; elle regarde son frère, ravie."),
    B("Oh. Tu l’as dit trop vite.", "teasing"),
  ] : [
    N("Le Conseil est vide à cette heure. Les flambeaux ont été réduits de moitié et la grande carte de l’Empire dort sous un drap. Une seule silhouette occupe le fauteuil d’Iriana, les jambes croisées sur le bras du siège."),
    B("Te voilà. On m’a raconté que mon frère avait reçu ici, un soir, une curiosité tombée d’un portail. On ne me l’a pas présentée. Je suis vexée — modérément, mais avec style.", "smirk"),
    ...(c.coalitionDone ? [B("Ne me dis pas que nous nous sommes déjà vus au-dessus d’une carte. Ça ne compte pas : Valurn était dans la pièce, et quand Valurn est dans une pièce, je regarde Valurn.", "teasing")] : []),
    N("Elle se lève. Le parfum la précède : miel brûlé, jasmin, et cette chaleur de pièce où l’on vient d’éteindre trop de bougies à la fois."),
    B("Bellirith. Sœur de Valurn — la plus intéressante des deux, demande à n’importe qui sauf à lui.", "seductive"),
    N("Son aura vous effleure. Ce n’est pas un ordre ; c’est une main qui tâte une serrure. Elle cherche ce qui, chez vous, a déjà envie de quelque chose, et souffle dessus pour voir si la braise prend."),
    B("Tu ne sens ni la cour, ni la route. Tu sens une porte mal fermée. Et tu me regardes comme si tu cherchais où j’ai caché le piège.", "thoughtful"),
    B("Il n’y en a pas. Ce soir, je veux seulement savoir ce que mon frère a vu en toi pour te protéger aussi vite.", "teasing"),
  ];
  const close: DialogueLine[] = c.live ? [
    N("Bellirith recule d’un pas, puis d’un autre, sans jamais vous tourner le dos. Elle s’arrête à la porte."),
    B("Garde ta curiosité en vie, Valurn. J’ai envie de voir ce qu’elle fera le jour où elle aura quelque chose à perdre.", "smirk"),
    N("Le parfum reste après elle. Iriana attend qu’il se dissipe avant de reprendre la parole, ce qui prend plus longtemps qu’elle ne le voudrait."),
    I("Bellirith. Sœur de Valurn par leur père. Une complication que je n’ai pas le pouvoir d’interdire."),
    V("Et que personne n’a jamais eu le pouvoir d’ennuyer très longtemps.", "neutral"),
    I("Elle vous a repéré·e. Ce n’est pas un compliment. C’est une information."),
  ] : [
    B("Bien. Tu peux partir, maintenant. Ou rester et me laisser deviner ce que tu fais de tes soirées. Les deux m’apprendront quelque chose.", "seductive"),
    N("Elle se rassoit dans le fauteuil d’Iriana comme si elle l’avait gagné aux dés. Quand vous quittez la salle, vous avez la désagréable certitude d’avoir été lu, plié et rangé dans une poche."),
  ];
  const seeds: ChoiceSeed[] = [
    {
      id: "bel-i01-steady",
      text: "Soutenir son regard sans reculer d’un pouce",
      stat: "sangFroid",
      response: [
        P("Vous avez terminé l’inspection ?"),
        B("Presque. Tu ne recules pas, mais ta main gauche a envie de se refermer. Tu la laisses ouverte exprès. C’est mignon.", "teasing"),
        N("Elle vous tourne autour une fois, lentement, comme autour d’une statue qu’on envisage d’acheter."),
        B("Les gens se divisent en deux catégories quand je les frôle : ceux qui fuient et ceux qui avancent. Toi, tu restes. Personne ne reste.", "thoughtful"),
        ...close,
      ],
      effects: { affection: 1, desire: 3, flags: [flag("01", "seen"), "bellirith-first-look:steady", "story-bellirith-met"], relationshipEffects: { valurn: { trust: 1 } } },
    },
    {
      id: "bel-i01-read",
      text: "Lui renvoyer sa propre lecture",
      stat: "lucidite",
      response: [
        P("Vous n’êtes pas venue pour moi. Vous regardez la main de Valurn depuis que vous êtes entrée. Je suis seulement l’endroit où il a posé les yeux."),
        N("Une seconde, Bellirith ne bouge plus. Puis elle rit, un rire bas et réel qui lui échappe avant qu’elle décide de le rendre élégant."),
        B("Méchant. Exact, mais méchant. On ne dit pas à une démone qu’on a vu où elle regardait.", "smirk"),
        B("Tu viens de gagner le droit d’être regardé·e, toi aussi. Réfléchis bien à ce que ça signifie.", "seductive"),
        ...close,
      ],
      effects: { trust: 1, desire: 4, flags: [flag("01", "seen"), "bellirith-first-look:read", "story-bellirith-met"], relationshipEffects: { valurn: { affection: 1 } } },
    },
    {
      id: "bel-i01-spark",
      text: "Répondre à la provocation sur le même ton",
      stat: "audace",
      response: [
        P("Si je suis une porte mal fermée, vous êtes le courant d’air."),
        B("Un courant d’air ! On m’a appelée tempête, fléau, péché capital avec jarretières… Jamais courant d’air.", "teasing"),
        N("Elle a l’air sincèrement enchantée, ce qui est plus inquiétant que tout le reste."),
        B("Continue comme ça et je vais vouloir savoir ce que tu dis quand tu n’as plus de mots. Ce serait dommage pour ton emploi du temps.", "seductive"),
        ...close,
      ],
      effects: { affection: 3, desire: 2, flags: [flag("01", "seen"), "bellirith-first-look:spark", "story-bellirith-met"] },
    },
    {
      id: "bel-i01-aura",
      text: "Sentir où son aura appuie, et ne pas la suivre",
      stat: "resonance",
      response: [
        N("Vous suivez le fil de son pouvoir comme on suit un parfum jusqu’au flacon. Il ne fabrique rien : il trouve une envie déjà là, minuscule, et la fait gonfler. Vous la laissez gonfler. Vous ne bougez pas."),
        P("Vous ne créez rien. Vous cherchez ce qui existe déjà, et vous soufflez dessus."),
        B("Et toi, tu sens le souffle sans éteindre la bougie. Intéressant. Très, très intéressant.", "thoughtful"),
        B("La plupart des gens m’accusent de les avoir ensorcelés. Toi, tu viens de m’expliquer ma propre méthode. Je ne sais pas encore si je suis flattée ou insultée.", "smirk"),
        ...close,
      ],
      effects: { affection: 1, desire: 3, trust: 1, flags: [flag("01", "seen"), "bellirith-first-look:aura", "story-bellirith-met"] },
    },
  ];
  return { intro, choices: seeds.map((seed) => choice(seed, c.mode)) };
}

/* ───────────── Intrusion 02 · après le prix de l’aide ───────────── */

function intrusion02(c: Ctx): { intro: DialogueLine[]; choices: ChoiceData[] } {
  const meeting: DialogueLine[] = c.met ? [
    N("Bellirith est assise sur le rebord d’une haute fenêtre, une jambe repliée, l’autre balançant dans le vide au-dessus des jardins. Personne ne l’a vue entrer. Personne, vraisemblablement, ne la verra sortir."),
    B("Septième cloche, l’écurie nord. Tout le monde te donne des heures. Comme c’est austère.", "smirk"),
  ] : [
    N("Une femme est assise sur le rebord d’une haute fenêtre, une jambe repliée, l’autre balançant dans le vide au-dessus des jardins. Un parfum de miel brûlé occupe déjà la moitié de la salle."),
    B("Bellirith. La sœur de Valurn. Ne fais pas cette tête, ce n’est pas contagieux — enfin, pas toujours.", "smirk"),
    B("Septième cloche, l’écurie nord. Tout le monde te donne des heures. Comme c’est austère.", "teasing"),
  ];
  const intro: DialogueLine[] = c.live ? [
    N("Draven boucle son paquetage avec des gestes de soldat, trop serrés, comme si chaque sangle était un argument qu’il n’a pas pu prononcer devant Iriana."),
    I("Septième cloche, mon cabinet. Nous relirons la lettre de mission ligne par ligne. Une phrase mal placée, et Allenna vous fermera ses portes avant que vous ayez fini de saluer.", "stern"),
    D("Et à l’aube, l’écurie nord. Je pars avec ou sans vous. De préférence avec.", "gruff"),
    ...meeting,
    N("Elle se laisse glisser au sol et traverse la salle sans hâte. Draven la suit des yeux avec la méfiance d’un homme qui a déjà vu des sirènes depuis le pont d’un navire."),
    D("Qui est-ce ?", "stern"),
    I("Un problème.", "stern"),
    B("Un problème avec d’excellentes recommandations, capitaine.", "seductive"),
    N("Elle s’arrête devant vous, assez près pour que vous sentiez la chaleur de sa peau à travers l’air. Du bout d’un ongle, elle soulève la lettre de mission que vous tenez encore, la lit en diagonale et la laisse retomber."),
    B("Tu viens d’accepter de traverser une forêt qui mange les gens pour frapper à la porte d’une reine qui déteste l’Empire. Tu ne crois pas mériter quelque chose avant ?", "teasing"),
    B("Je t’offre ce soir. Pas la septième cloche. Pas l’aube. Ce soir, entier, et ce qu’il y a dedans.", "seductive"),
    N("Elle ne vous charme pas. Elle trouve. Il y avait déjà au fond de vous la fatigue d’une journée de politique, et l’envie très précise de cette bouche-là ; elle les prend entre deux doigts et les fait tourner dans la lumière, jusqu’à ce que vous ne puissiez plus prétendre qu’elles n’existent pas."),
    B("Je ne t’oblige à rien. J’ai horreur des gens obligés : ils font l’amour comme on remplit un registre.", "smirk"),
    N("Iriana ne dit rien. Elle vous regarde comme elle a regardé votre rapport tout à l’heure : pour savoir s’il tient. Draven, lui, a croisé les bras."),
  ] : [
    N("Le Conseil sent la cire froide et le papier. La grande table est vide, à l’exception d’une femme assise dessus, exactement à l’endroit où Iriana avait posé votre lettre de mission."),
    ...(c.met ? [] : [B("Bellirith. Sœur de Valurn. On s’est ratés, il me semble. J’ai horreur de rater les gens.", "smirk")]),
    B("Il y a quelque temps, dans cette salle, Iriana t’a donné une lettre et Draven t’a donné l’aube. J’étais derrière cette porte avec une proposition. Tu as filé par l’autre.", "teasing"),
    B("J’ai horreur des propositions qui refroidissent. Alors je réchauffe celle-ci.", "seductive"),
    N("Elle descend de la table. Ses pas ne font aucun bruit sur le marbre, mais vous les sentez quand même, un par un, comme on sent une main qui hésite au-dessus d’une nuque."),
    B("Aujourd’hui, personne ne t’attend. Pas de cloche, pas d’écurie, pas de capitaine qui compte jusqu’à dix. Ça rend la question délicieusement honnête.", "thoughtful"),
    B("Tu as envie de moi — je le sens, ne prends pas cet air vexé. Qu’est-ce que tu comptes en faire ?", "seductive"),
    N("Son aura ne fabrique rien : elle trouve l’envie qui est déjà là et souffle dessus. C’est à vous de décider si vous laissez la braise prendre."),
  ];
  const seeds: ChoiceSeed[] = [
    {
      id: "bel-i02-cede-follow",
      text: c.live ? "Suivre Bellirith. La lettre attendra demain." : "La suivre. Puisque personne n’attend, autant ne pas la faire attendre.",
      stat: "audace",
      response: [
        B("Enfin quelqu’un qui sait reconnaître une priorité.", "seductive"),
        N("Elle prend votre poignet, pas votre main, deux doigts posés sur le pouls comme pour en vérifier la cadence. Elle sourit quand elle la trouve."),
        B("Ne t’inquiète pas. Je te rendrai entier. Peut-être un peu moins ponctuel.", "teasing"),
      ],
      liveAftermath: [
        I("Le cabinet sera ouvert. Je relirai seule.", "stern"),
        N("Elle ne hausse pas la voix. Elle range seulement la lettre dans un dossier plus épais que nécessaire."),
        I("Ce n’est pas la première lettre que je relis seule. C’est la première que je relis seule alors que quelqu’un avait promis d’être là.", "calm"),
        D("L’écurie nord. À l’aube. Je ne compterai pas jusqu’à dix.", "gruff"),
      ],
      effects: { affection: 3, trust: 1, flags: [flag("02", "accepted")], relationshipEffects: { iriana: { trust: -3 }, draven: { trust: -2 } } },
    },
    {
      id: "bel-i02-cede-dare",
      text: "« Montre-moi ce qui vaut mieux qu’une lettre de mission. »",
      stat: "audace",
      response: [
        N("Bellirith pose un doigt sur vos lèvres, comme pour vérifier qu’elles viennent bien de prononcer ça."),
        B("Oh. Tu me lances un défi. Personne ne me lance de défi le premier soir, ça porte malheur.", "teasing"),
        B("Tu vas le regretter de la façon la plus délicieuse que tu puisses imaginer. Puis d’une autre que tu ne peux pas encore imaginer.", "seductive"),
      ],
      liveAftermath: [
        I("Septième cloche, {player}. Je ne reformulerai pas l’invitation.", "stern"),
        N("Vous ne vous retournez pas. Vous entendez quand même Draven poser son sac un peu trop fort sur la table."),
      ],
      effects: { affection: 2, desire: 1, flags: [flag("02", "accepted")], relationshipEffects: { iriana: { trust: -3, affection: -1 }, draven: { trust: -2 } } },
    },
    {
      id: "bel-i02-resist-calm",
      text: c.live ? "« J’en ai envie. J’y vais quand même. »" : "« J’en ai envie. Et ce sera non quand même. »",
      stat: "sangFroid",
      response: [
        N("Bellirith s’arrête net, la main encore levée vers votre col."),
        B("Répète la première moitié.", "thoughtful"),
        P("J’en ai envie."),
        B("Et tu pars quand même.", "cold"),
        N("Elle laisse retomber sa main. Ce n’est pas de la vexation. C’est l’expression d’une joueuse qui vient de voir son adversaire jouer une carte qui n’existait pas dans le paquet."),
        B("On me dit non parce qu’on a peur, ou oui parce qu’on n’a pas assez peur. Toi, tu me dis oui et non dans la même phrase, sans trembler. C’est obscène.", "smirk"),
        B("Va. Je vais y penser toute la nuit, et je compte bien te le faire payer.", "seductive"),
      ],
      liveAftermath: [
        I("Septième cloche.", "calm"),
        N("Iriana ne sourit pas. Mais elle reprend la lettre du dossier et la pose sur le dessus de la pile, à portée de votre main."),
      ],
      effects: { desire: desire(4, c, 1), flags: [flag("02", "resisted")], relationshipEffects: { iriana: { trust: 1 } } },
    },
    {
      id: "bel-i02-resist-tease",
      text: "Se pencher jusqu’à son oreille, lui laisser croire que vous cédez… puis repartir",
      stat: "audace",
      response: [
        N("Vous vous penchez. Elle vous laisse faire, les yeux mi-clos, déjà victorieuse. Votre souffle touche son oreille ; vous sentez son parfum monter d’un ton, comme une note qui répond."),
        P(c.live ? "Ce soir…" : "Tout à l’heure…"),
        N("Vous laissez durer le silence exactement une seconde de trop."),
        P(c.live ? "…je relis une lettre." : "…j’avais prévu de dormir. Seul·e. Profondément."),
        N("Bellirith ouvre les yeux. Pendant un battement, elle ne trouve rien à dire, ce qui n’est probablement pas arrivé depuis plusieurs siècles. Puis elle éclate de rire, tête renversée."),
        B("Tu viens de me faire mon propre numéro. Sur moi. Avec ma propre lenteur.", "teasing"),
        B("Je suis furieuse. Je suis ravie. Je ne sais pas encore laquelle des deux va gagner, mais elles vont se battre pour toi.", "seductive"),
      ],
      liveAftermath: [
        D("Je ne sais pas ce que vous venez de faire, mais je ne veux pas que vous me le fassiez un jour.", "surprised"),
      ],
      effects: { affection: 1, desire: desire(5, c, 2) + 1, flags: [flag("02", "resisted")] },
    },
    {
      id: "bel-i02-resist-duty",
      text: c.live ? "Rejoindre Draven pour préparer l’escorte" : "Lui dire qu’une autre personne compte davantage ce soir",
      stat: "lucidite",
      response: c.live ? [
        P("Draven part à l’aube avec ou sans moi. Je préfère que ce soit avec. Il y a des cartes à revoir et des chevaux à choisir."),
        B("Tu me préfères un capitaine qui sent le sel et le cuir mouillé.", "cold"),
        P("Je préfère ne pas laisser seul un homme qui vient de perdre une dispute contre l’Empire."),
        N("Bellirith regarde Draven, puis vous, puis Draven encore, comme si elle essayait de comprendre une langue qu’elle n’a jamais eu besoin d’apprendre."),
        B("Je ne sais pas si je suis vexée ou fascinée. Les deux, probablement. Je déteste les deux.", "smirk"),
      ] : [
        P("Ce soir, quelqu’un compte sur moi. Ce n’est pas toi."),
        B("Tu me préfères quelqu’un d’absent de cette pièce. Il faut un talent particulier pour ça.", "cold"),
        P("Ou une promesse."),
        B("Une promesse. Les gens les plus intéressants sont toujours encombrés de promesses. Je vais finir par vouloir savoir lesquelles.", "smirk"),
      ],
      liveAftermath: [
        N("Draven ne dit rien. Il vous tend simplement la moitié des cartes de la forêt, celle qu’il a le plus raturée."),
      ],
      effects: { desire: desire(4, c, 3) + 1, flags: [flag("02", "resisted")], relationshipEffects: { draven: { trust: 2, affection: 1 } } },
    },
  ];
  return { intro, choices: seeds.map((seed) => choice(seed, c.mode)) };
}

/* ───────────── Intrusion 03 · le retour d’Akuhn’Nabad ───────────── */

function bellirithHistoryOpening(c: Ctx, where: "akuhn" | "algratal"): DialogueLine[] {
  if (!c.met) return [
    B("Bellirith. Sœur de Valurn, fléau des dîners, et propriétaire non officielle de la moitié des nuits de cette ville.", "smirk"),
  ];
  if (c.trend === "ceded" && c.favorite) return [
    B(where === "akuhn" ? "Mon favori traverse ma ville sans venir m’embrasser. Je devrais être offensée. Je suis surtout affamée." : "Mon favori. Debout dans la lumière comme une offrande qu’on a oublié de déballer.", "seductive"),
    N("Elle dit « mon favori » sans tendresse et sans gêne, comme on désigne la meilleure place d’un théâtre. Ce n’est pas une déclaration. C’est un droit de propriété qu’elle s’amuse à faire valoir, en sachant parfaitement qu’il n’existe pas."),
  ];
  if (c.trend === "ceded" || (c.slept && c.trend !== "resisted")) return [
    B("Tu as encore un peu de mon parfum dans le col, tu sais. Ou c’est moi qui ai envie de le croire.", "teasing"),
    N("Elle se tient trop près, avec l’aisance de quelqu’un qui sait déjà où se trouvent vos points faibles et qui n’a aucune intention de faire semblant de l’ignorer."),
  ];
  if (c.trend === "resisted") return [
    B("Ne recule pas. Je t’ai déjà demandé de me suivre, et tu as dit non avec une élégance qui m’a coûté une nuit de sommeil.", "cold"),
    N("Elle tourne autour de vous sans vous toucher. Elle ne sourit pas tout de suite. Elle étudie. Elle a manifestement passé du temps à réfléchir à vous, et elle n’aime pas beaucoup ce que cela dit d’elle."),
    B("Alors j’ai changé de méthode. Je ne supplie pas. Je cherche ce que tu veux vraiment, et je le mets là où tu devras passer devant moi pour l’atteindre.", "thoughtful"),
  ];
  if (c.trend === "mixed") return [
    B("Toi. Je ne sais plus du tout ce que tu vas me répondre. Personne ne m’a fait ça depuis très longtemps, et je ne suis pas sûre de te le pardonner.", "thoughtful"),
    N("Elle vous observe comme une partie entamée : elle connaît certaines de vos réponses, et elle sait que vous pouvez aussi lui échapper. Cette incertitude l’agace visiblement autant qu’elle l’attire."),
  ];
  return [
    B(where === "akuhn" ? "Tu as traversé ma ville sans venir me saluer. À Akuhn’Nabad, c’est presque une déclaration de guerre. Ou une invitation, selon qui interprète." : "Te revoilà. Tu as l’air de quelqu’un qui a gagné quelque chose et qui ne sait pas encore quoi en faire.", "smirk"),
  ];
}

function intrusion03(c: Ctx, letterSent: boolean): { intro: DialogueLine[]; choices: ChoiceData[] } {
  const intro: DialogueLine[] = c.live ? [
    N("Allenna est partie organiser l’escorte. La salle de guerre ne garde plus qu’une lampe, la carte de la forêt et Draven, qui a glissé les preuves d’Alamma dans sa sacoche comme on couche un enfant dangereux."),
    D(letterSent ? "La lettre d’Amanea dort avec les preuves. Si je la perds, je crois que deux reines viendront me tuer en même temps." : "Pas de lettre. Les preuves parleront seules. J’espère qu’elles ont une meilleure voix que moi devant Tia.", "gruff"),
    D("On part à la première relève. Deux cavaliers d’Allenna jusqu’à la lisière, ensuite Naïah nous laissera passer — ou elle nous perdra pour s’amuser. Dormez, si vous savez encore comment on fait.", "neutral"),
    N("Une porte s’ouvre au fond de la salle, celle qui donne sur l’escalier de la cour basse. Bellirith descend les marches comme on descend dans un bain chaud : sans se presser, en laissant la chaleur monter d’abord."),
    ...bellirithHistoryOpening(c, "akuhn"),
    D(c.liveAccepted > 0 ? "Encore elle." : "Vous la connaissez ?", "stern"),
    B("Nous nous connaissons, capitaine. Vous, vous me découvrirez peut-être un jour, si vous êtes très sage et très malchanceux.", "smirk"),
    N("Elle s’assied sur le bord de la table de guerre, à cheval sur la ligne qui sépare les forces d’Akuhn’Nabad de celles de l’Empire, et y reste avec une satisfaction évidente."),
    ...(c.trend === "resisted"
      ? [B("Voilà ma proposition. Je sais quelque chose sur ta journée de demain devant Tia. Je te le donne contre une heure — une seule — dans les bains au-dessus de la salle de musique. Pas mon lit : mes bains. Je suis devenue très précise, à force de t’entendre dire non.", "teasing")]
      : [B("Ma chambre est au-dessus de la salle de musique. Il y a un bain qui ne refroidit jamais, des draps que personne n’a jamais réussi à froisser correctement, et moi. Les preuves peuvent dormir dans la sacoche du capitaine. Toi, tu peux dormir ailleurs — ou ne pas dormir.", "seductive")]),
    N("Son aura se lève comme de la vapeur. Elle ne vous prend rien ; elle vous rappelle seulement à quel point vous êtes fatigué·e, à quel point l’eau chaude existe, et à quel point sa bouche est près."),
  ] : [
    N("La salle de guerre d’Akuhn’Nabad est déserte à cette heure. La carte de la forêt n’a pas bougé depuis la nuit où vous y avez rapporté les preuves d’Alamma. Une seule lampe brûle, posée par quelqu’un qui savait que vous viendriez."),
    ...bellirithHistoryOpening(c, "akuhn"),
    B("La nuit où tu as quitté ma ville avec ta sacoche de secrets, tu ne t’es pas arrêté·e chez moi. Je l’ai pris pour un défi. J’ai toujours pris les défis très au sérieux.", "teasing"),
    B("Il n’y a plus de capitaine qui t’attend dans la cour, plus de relève, plus de route. Il reste la même question que cette nuit-là, et une salle de bain qui n’a jamais refroidi.", "seductive"),
  ];
  const seeds: ChoiceSeed[] = [
    {
      id: "bel-i03-cede-follow",
      text: c.live ? "La suivre jusqu’à ses appartements. La route attendra l’aube." : "La suivre jusqu’à ses appartements",
      stat: "audace",
      response: [
        B(c.slept ? "Bien. Tu te souviens du chemin, ou je dois encore te tenir par le col ?" : "Bien. Ne fais pas cette tête de condamné·e : je ne mords que les gens qui me le demandent. Ou presque.", "seductive"),
        N("Elle descend de la table et vous attend au pied de l’escalier sans vous tendre la main. Elle sait que vous allez la suivre. C’est précisément ce qui la ravit."),
      ],
      liveAftermath: c.liveAccepted > 0 ? [
        D("Deuxième fois. Je commence à connaître le chemin de l’écurie sans vous.", "angry"),
        D("Première relève. Si vous n’êtes pas dans la cour, je laisse un cheval sellé, la moitié du pain, et je pars. Je ne reviendrai pas vous chercher dans un bain.", "stern"),
      ] : [
        D("Première relève. Si vous n’êtes pas dans la cour, je laisse un cheval sellé et je pars.", "stern"),
        N("Il ne vous regarde pas monter. Il resserre seulement la sangle de la sacoche, d’un cran de plus qu’il ne faudrait."),
      ],
      effects: { affection: 3, flags: [flag("03", "accepted")], relationshipEffects: { draven: c.liveAccepted > 0 ? { trust: -4, affection: -2 } : { trust: -3, affection: -1 } } },
    },
    {
      id: "bel-i03-cede-dare",
      text: c.slept ? "« Prouve-moi que tu te souviens de tout. »" : "« Une nuit. Et tu me dis ce que tu sais sur demain. »",
      stat: c.slept ? "audace" : "lucidite",
      response: c.slept ? [
        B("Tout ? Tu es présomptueux·se. Je me souviens de l’endroit exact où ta respiration se coince. Du côté où tu tournes la tête. Du mot que tu as failli dire et que tu as avalé.", "seductive"),
        B("Je compte bien te le faire dire, cette fois.", "teasing"),
      ] : [
        N("Bellirith vous dévisage, puis rit doucement, avec une admiration qu’elle ne prend pas la peine de déguiser."),
        B("Tu marchandes avec une démone du Désir. Sur son propre terrain. Dans sa propre ville.", "smirk"),
        B("Marché conclu. Mais je fixe l’ordre : d’abord la nuit. Ensuite, si tu tiens encore debout, je te raconterai comment ne pas t’ennuyer devant Tia.", "seductive"),
      ],
      liveAftermath: [
        D(c.liveAccepted > 0 ? "Vous faites ça souvent, je remarque." : "Première relève. Je ne le répéterai pas.", "gruff"),
      ],
      effects: { affection: 2, desire: 1, flags: [flag("03", "accepted")], relationshipEffects: { draven: c.liveAccepted > 0 ? { trust: -4, affection: -1 } : { trust: -3 } } },
    },
    {
      id: "bel-i03-resist-calm",
      text: c.live ? "« Pas cette nuit. Les preuves voyagent avec moi. »" : "« Pas cette nuit. »",
      stat: "sangFroid",
      response: [
        B("Les preuves. Tu me préfères du papier. Je ne sais pas si je dois l’encadrer ou le brûler.", "cold"),
        N("Elle vous regarde longuement, sans aura, sans parfum, comme si elle voulait vérifier que votre refus tient encore quand elle cesse d’appuyer dessus. Il tient."),
        B("Très bien. Garde-la, ta nuit. Je vais en inventer une meilleure, et tu auras beaucoup plus de mal à me dire non.", "smirk"),
      ],
      effects: { desire: desire(4, c, 4) + (c.resisted ? 1 : 0), flags: [flag("03", "resisted")] },
    },
    {
      id: "bel-i03-resist-tease",
      text: c.trend === "resisted" ? "Lui prendre son information sans lui donner la nuit" : "L’embrasser une fois, longuement, puis retourner vers la carte",
      stat: "audace",
      response: c.trend === "resisted" ? [
        P("Tu vas me donner ton information quand même."),
        B("Ah oui ? Et pourquoi ferais-je une chose pareille ?", "teasing"),
        P("Parce que tu as envie de voir ce que j’en ferai. Plus envie que de me voir monter cet escalier."),
        N("Bellirith ouvre la bouche, la referme. Elle se penche, très près, et vous murmure son secret comme un baiser qu’elle aurait mis dans une enveloppe."),
        B("Tia déteste qu’on lui présente les preuves dans l’ordre. Commence par la plus laide. Elle respecte ceux qui ne la ménagent pas.", "seductive"),
        B("Voilà. Je t’ai donné quelque chose pour rien. Je ne fais jamais ça. Je vais devoir te détester un peu.", "cold"),
      ] : [
        N("Vous lui prenez le menton et l’embrassez. Elle vous laisse faire — mieux : elle vous répond, et pendant quelques secondes c’est elle qui mène, une main dans vos cheveux, le parfum montant autour de vous comme de la vapeur."),
        N("Puis vous reculez. Vous retournez vers la carte. Vous déplacez un pion de deux cases vers la lisière."),
        B("Tu… viens de m’embrasser comme une promesse, et tu fais de la logistique.", "angry"),
        P("Bonne nuit, Bellirith."),
        B("Ce n’est pas une bonne nuit. C’est une déclaration de guerre. J’accepte.", "seductive"),
      ],
      liveAftermath: [
        D("J’ignore ce qui vient de se passer. Je refuse qu’on me l’explique.", "surprised"),
      ],
      effects: { affection: 1, desire: desire(5, c, 5) + 1, flags: [flag("03", "resisted"), ...(c.trend === "resisted" ? ["bellirith-tip-tia"] : [])] },
    },
    {
      id: "bel-i03-resist-duty",
      text: c.live ? "Rester avec Draven pour veiller la sacoche" : "Lui répondre que vous avez promis cette nuit à quelqu’un d’autre",
      stat: "lucidite",
      response: c.live ? [
        P("Je reste avec Draven. Quelqu’un doit l’empêcher de dormir sur la sacoche et de se réveiller avec la carte imprimée sur la joue."),
        D("C’est arrivé une fois.", "gruff"),
        B("Tu choisis de veiller un capitaine bourru plutôt que de te faire veiller par moi.", "cold"),
        N("Elle quitte la table en emportant sa chaleur avec elle. Au pied de l’escalier, elle s’arrête, sans se retourner."),
        B("Il a de la chance. Il ne le sait pas. C’est exactement le genre de chose qui me donne envie de gagner.", "thoughtful"),
      ] : [
        P("Cette nuit est promise à quelqu’un d’autre."),
        B("Qui ? Non — ne me le dis pas. J’aime l’idée d’un rival sans visage. Je vais lui en dessiner un, et je vais le battre.", "smirk"),
      ],
      liveAftermath: [
        N("Draven pousse vers vous une chope de bière tiède, sans un mot. C’est probablement la chose la plus affectueuse qu’il ait faite depuis Forthaven."),
      ],
      effects: { desire: desire(4, c, 6), flags: [flag("03", "resisted")], relationshipEffects: { draven: { trust: 2, affection: 2 } } },
    },
  ];
  return { intro, choices: seeds.map((seed) => choice(seed, c.mode)) };
}

/* ───────────── Intrusion 04 · après la séance devant Tia ───────────── */

function intrusion04(c: Ctx, irianaClose: boolean): { intro: DialogueLine[]; choices: ChoiceData[] } {
  const intro: DialogueLine[] = c.live ? [
    N("Le miroir de campagne s’est éteint sur la colère de Lineva. La galerie d’audience se vide lentement de ses gardes. Tia est déjà repartie vers ses appartements, emportant avec elle la lumière du disque."),
    I("Cabinet de coordination, troisième cloche. Je veux à la table quelqu’un qui a vu les deux camps de près. Les officiers ont vu des cartes.", "stern"),
    D("Et moi, j’ai quarante noms à choisir pour le détachement. Puis quarante lettres à écrire aux familles.", "gruff"),
    D("Je ne vous demande pas de les écrire. Je vous demande de rester dans la pièce pendant que je le fais.", "neutral"),
    N("C’est la première fois que Draven vous demande quelque chose qui ne relève pas du service. Il le sait. Il regarde ailleurs pour ne pas avoir à voir votre réponse."),
    N("Des pas claquent sur le marbre, beaucoup trop gais pour une galerie impériale."),
    B("Une armée ! Une vraie, avec des bannières et des bottes ! Et personne ne fête rien ?", "teasing"),
    ...bellirithHistoryOpening(c, "algratal"),
    ...(c.trend === "ceded" && c.slept ? [
      N("Elle passe derrière vous et pose les lèvres dans votre cou, très brièvement, devant Iriana, devant Draven, devant les deux gardes du fond. Le geste ne demande rien. Il rappelle."),
      I("Ce n’est donc pas la première fois.", "calm"),
      B("Chérie, ce n’est même pas la deuxième.", "smirk"),
    ] : []),
    B("La Lumière ne fête jamais rien. Elle approuve. Elle signe. Elle rationne. Moi, je fête.", "seductive"),
    ...(c.trend === "resisted" ? [
      B("Et pour toi, j’ai fait un effort. Pas de lit, pas de bain, pas de supplication — tu y résistes trop bien, c’en est vexant. Je te propose Saëlis.", "thoughtful"),
      N("Elle ouvre la main. Au creux de sa paume tourne une minuscule ville de néons roses et pourpres, des toits qui battent comme des cœurs, des rues où l’on rit trop fort. Une illusion, tenue pour vous seul·e."),
      B("Une heure dans ma ville. Une heure où personne ne te demande rien d’utile.", "seductive"),
    ] : [
      B("Une célébration, rien que pour toi. Je connais une terrasse au-dessus du palais où la Lumière ne regarde jamais, et j’y ai apporté un morceau de chez moi.", "seductive"),
    ]),
    N("Son aura effleure la fatigue de la nuit, le soulagement de la décision de Tia, l’envie de ne plus rien porter pendant une heure. Elle ne crée rien de tout ça. Elle le désigne, simplement, et attend."),
  ] : [
    N("La galerie d’audience est vide en milieu de matinée. Le disque de Lumière ne tremble pas, mais quelqu’un a accroché à son support un ruban rose, d’un goût parfaitement scandaleux."),
    ...bellirithHistoryOpening(c, "algratal"),
    B("La Lumière a eu son armée. Personne n’a rien fêté. J’ai trouvé ça insupportable, alors j’ai gardé la fête au frais.", "teasing"),
    ...(c.trend === "resisted" ? [
      N("Elle ouvre la main. Au creux de sa paume tourne une minuscule ville de néons roses et pourpres : Saëlis, en illusion, tenue pour vous seul·e."),
      B("Pas de lit, pas de supplication. Une heure dans ma ville. Tu as déjà dit non à tout le reste.", "thoughtful"),
    ] : [
      B("Une terrasse au-dessus du palais, un morceau de chez moi, et toi. Rien d’utile. C’est tout l’intérêt.", "seductive"),
    ]),
  ];
  const iriAfter = irianaClose
    ? [I("Je ne vous reproche pas l’endroit où vous allez. Je vous reproche l’heure. Il y en avait une seule où j’avais besoin de vous.", "sad")]
    : [I("Troisième cloche. La table sera complète sans vous. Elle sera seulement moins juste.", "stern")];
  const seeds: ChoiceSeed[] = [
    {
      id: "bel-i04-cede-follow",
      text: c.live ? "Suivre Bellirith. Iriana et Draven attendront." : "La suivre sur la terrasse",
      stat: "audace",
      response: [
        B(c.favorite ? "Voilà mon favori. Toujours là quand on ouvre la bonne porte." : "Je savais que la Lumière finirait par t’ennuyer.", "seductive"),
        N("Elle vous entraîne vers un escalier de service que vous n’aviez jamais remarqué. Il sent la cire, puis le vent, puis le jasmin."),
      ],
      liveAftermath: [
        ...iriAfter,
        D(c.liveAccepted > 0 ? "Quarante lettres. Seul, donc. Comme d’habitude, avec vous." : "Quarante lettres. Seul, donc.", "angry"),
        N("Il ne crie pas. Il plie seulement la liste des noms en quatre, très soigneusement, et la glisse contre sa poitrine."),
      ],
      effects: {
        affection: 3,
        flags: [flag("04", "accepted")],
        relationshipEffects: {
          iriana: { trust: c.liveAccepted > 0 ? -5 : -4, ...(irianaClose ? { affection: -1 } : {}) },
          draven: c.liveAccepted > 0 ? { trust: -4, affection: -3 } : { trust: -3, affection: -2 },
        },
      },
    },
    {
      id: "bel-i04-cede-dare",
      text: c.trend === "resisted" ? "Accepter Saëlis, à condition de choisir vous-même la rue" : "« Montre-moi ce que Saëlis fait d’une victoire. »",
      stat: "resonance",
      response: c.trend === "resisted" ? [
        B("Tu poses des conditions à une illusion que je t’offre. Tu es insupportable.", "smirk"),
        B("Choisis, alors. Mais je te préviens : toutes les rues de Saëlis finissent chez moi.", "seductive"),
      ] : [
        B("Ce qu’elle fait d’une victoire ? Elle la déshabille, lentement, jusqu’à ce qu’il ne reste que le plaisir.", "seductive"),
        N("Elle a l’air sincèrement heureuse que vous ayez posé la question, ce qui est peut-être plus dangereux que tout le reste."),
      ],
      liveAftermath: [
        ...iriAfter,
        D("Je vous garde une place à la table. Je ne vous garderai pas les lettres.", "gruff"),
      ],
      effects: {
        affection: 2,
        desire: 1,
        flags: [flag("04", "accepted")],
        relationshipEffects: {
          iriana: { trust: c.liveAccepted > 0 ? -4 : -3 },
          draven: c.liveAccepted > 0 ? { trust: -4, affection: -2 } : { trust: -3, affection: -1 },
        },
      },
    },
    {
      id: "bel-i04-resist-calm",
      text: "« Pas maintenant. »",
      stat: "sangFroid",
      response: [
        B("Pas maintenant. Tu sais que c’est la phrase la plus excitante de toute ta langue ?", "teasing"),
        B("Pas « non ». Pas « jamais ». « Pas maintenant. » Tu viens de me donner un calendrier.", "seductive"),
        N("Elle referme la main, et la petite ville s’éteint — ou la promesse de terrasse retombe comme un drap. Elle n’a pas l’air vaincue. Elle a l’air de quelqu’un qui vient de noter une date."),
      ],
      liveAftermath: [
        N("Iriana a entendu. Elle ne commente pas. Elle vous fait seulement signe de la suivre vers le cabinet, un pas devant vous, comme on montre un chemin."),
      ],
      effects: { desire: desire(4, c, 7) + (c.resisted >= 2 ? 1 : 0), flags: [flag("04", "resisted")], relationshipEffects: { iriana: { trust: 1 } } },
    },
    {
      id: "bel-i04-resist-tease",
      text: c.live ? "Lui donner raison… et offrir la célébration à Draven" : "Lui donner raison… et partir fêter sans elle",
      stat: "audace",
      response: c.live ? [
        P("Tu as raison. Il faut fêter ça."),
        N("Bellirith sourit déjà. Vous vous tournez vers Draven."),
        P("Capitaine. Quarante lettres, c’est trop sec. Je vous offre un verre pendant que vous les écrivez."),
        D("…C’est la proposition la plus raisonnable qu’on m’ait faite dans ce palais.", "surprised"),
        N("Bellirith vous regarde partir avec Draven, la bouche entrouverte. Puis elle rit, d’un rire qui fait se retourner les deux gardes du fond."),
        B("Tu as volé ma fête. Tu l’as offerte à un capitaine qui sent le cheval. Je ne me suis jamais fait voler aussi joliment.", "smirk"),
      ] : [
        P("Tu as raison. Il faut fêter ça."),
        N("Vous lui prenez la bouteille qu’elle avait cachée derrière le support du disque, vous la remerciez d’une révérence parfaite, et vous partez avec."),
        B("Tu as volé ma fête. Avec la bouteille. Je n’ai jamais été cambriolée avec autant de courtoisie.", "smirk"),
      ],
      effects: { affection: 1, desire: desire(6, c, 8), flags: [flag("04", "resisted")], relationshipEffects: { draven: { affection: 2, trust: 1 } } },
    },
    {
      id: "bel-i04-resist-duty",
      text: c.live ? "Rejoindre le cabinet d’Iriana" : "Lui dire que votre victoire appartient aussi à d’autres",
      stat: "lucidite",
      response: c.live ? [
        P("Iriana a besoin de quelqu’un qui a vu les deux camps. J’y vais."),
        B("Iriana. Évidemment. La seule femme de l’Empire capable de rendre un emploi du temps plus désirable que moi.", "cold"),
        N("Elle laisse passer un silence, et ce silence n’est pas tout à fait un jeu."),
        B("Je finirai par comprendre ce que tu lui trouves. Ce jour-là, fais attention à toi.", "thoughtful"),
      ] : [
        P("Cette victoire, je l’ai partagée avec d’autres. Je la fête avec eux."),
        B("Une victoire partagée. Quelle idée abominable. Les miennes, je les garde pour moi et je les déshabille seule.", "cold"),
        B("Va. Je trouverai une autre façon de t’avoir pour moi seule une heure.", "smirk"),
      ],
      liveAftermath: [
        N("Draven, en passant, pose deux doigts sur votre épaule : il a compris que vous iriez le rejoindre après le cabinet. Vous y allez."),
      ],
      effects: { desire: desire(4, c, 9) + 1, flags: [flag("04", "resisted")], relationshipEffects: { iriana: { trust: 2 }, draven: { trust: 1 } } },
    },
  ];
  return { intro, choices: seeds.map((seed) => choice(seed, c.mode)) };
}

/* ───────────── Construction d’une scène d’intrusion ───────────── */

export function bellirithIntrusionScene(
  id: BellirithIntrusionId,
  state: BellirithState & { relationships?: Record<string, { affection: number; trust: number }> },
  mode: BellirithIntrusionMode,
): BellirithIntrusionScene | undefined {
  const intrusion = bellirithIntrusionById(id);
  if (!intrusion) return undefined;
  const c = ctx(state, mode);
  const built = id === "01" ? intrusion01(c)
    : id === "02" ? intrusion02(c)
      : id === "03" ? intrusion03(c, state.flags.includes("amanea-letter-to-tia"))
        : intrusion04(c, (state.relationships?.iriana?.affection || 0) >= 25);
  return {
    intrusion,
    mode,
    title: `${mode === "catchup" ? "Interférence rattrapée" : "Interférence"} · ${intrusion.title}`,
    cast: mode === "live" ? intrusion.liveCast : intrusion.catchupCast,
    intro: built.intro,
    choices: built.choices,
  };
}

/** Toutes les variantes, pour les validateurs. */
export function allBellirithIntrusionVariants() {
  const states: BellirithState[] = [
    { flags: [], history: [] },
    { flags: [flag("01", "seen"), flag("02", "accepted"), BELLIRITH_SLEPT_FLAG], history: [] },
    { flags: [flag("01", "seen"), flag("02", "accepted"), flag("03", "accepted"), BELLIRITH_SLEPT_FLAG, BELLIRITH_FAVORITE_FLAG], history: [] },
    { flags: [flag("01", "seen"), flag("02", "resisted"), flag("03", "resisted")], history: [] },
    { flags: [flag("01", "seen"), flag("02", "accepted"), flag("03", "resisted"), BELLIRITH_SLEPT_FLAG], history: ["campaign-coalition-preparation"] },
  ];
  return states.flatMap((state) => BELLIRITH_INTRUSION_IDS.flatMap((id) => (["live", "catchup"] as const).map((mode) => ({ state, id, mode, scene: bellirithIntrusionScene(id, state, mode)! }))));
}

/** Résumé du fil Bellirith pour le Journal et la fiche (spec §51) : intrusions, chapitre IX, duel final. */
export function bellirithThreadSummary(state: BellirithState & { dateHistory?: string[] }) {
  const completed = bellirithFilStage(state);
  const missed = BELLIRITH_INTRUSIONS.find((intrusion) => bellirithIntrusionMissed(state, intrusion.id));
  if (missed) return { completed, total: 5, done: false, title: `Interférence en attente · ${missed.title}`, objective: "Bellirith vous a laissé une invitation persistante dans le Registre. Elle n’expire jamais et ne coûte rien à vos compagnons." };
  const upcoming = BELLIRITH_INTRUSIONS.find((intrusion) => !bellirithIntrusionResolved(state, intrusion.id));
  if (upcoming) return { completed, total: 5, done: false, title: "Prochaine · à son heure", objective: "Poursuivez la campagne principale. Elle se manifestera au pire moment possible — c’est-à-dire au sien." };
  if (!state.history.includes("campaign-coalition-preparation")) return { completed, total: 5, done: false, title: "Chapitre IX · la soirée de la coalition", objective: "Le conseil d’Al’Gratal approche. Bellirith y sera, et elle se souvient de chacune de vos réponses." };
  if (!(state.dateHistory || []).includes(BELLIRITH_FINAL_DATE_ID)) return { completed, total: 5, done: false, title: "Rendez-vous final · Coup pour coup", objective: "Pour une fois, c’est à vous de l’inviter. Ses rendez-vous sont ouverts dans le planificateur ; le dernier mot vous appartient." };
  return { completed, total: 5, done: true, title: "Fil de l’Acte I accompli", objective: "Bellirith n’est pas résolue : elle est installée. Vous pouvez lui tenir tête — reste à savoir lequel de vous deux fera craquer l’autre." };
}
