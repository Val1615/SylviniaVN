import type { DialogueLine } from "./game-data";
import { B, P, T, Y } from "./bellirith-naiah-kit";

/**
 * Mini-jeu « Les Trois Réponses » (quête croisée Bellirith / Naïah, Q3).
 *
 * Bellirith énonce une affirmation sur Naïah et annonce la réponse qu’elle lit.
 * Le joueur choisit la manière dont Naïah joue la manche. Le cycle est fixe et
 * toujours affiché : SIMULER bat ASSUMER, RETOURNER bat SIMULER, ASSUMER bat RETOURNER.
 * Aucune défaite n’interrompt la quête : le score ne sert qu’aux variantes de clôture
 * et à un petit bonus de relation.
 */

export type BNMove = "assumer" | "simuler" | "retourner";
export type BNOutcome = "naiah" | "bellirith" | "egalite" | "suspendue";

export const BN_MOVES: readonly BNMove[] = ["assumer", "simuler", "retourner"];

export const BN_MOVE_INFO: Record<BNMove, { icon: string; label: string; detail: string }> = {
  assumer: { icon: "◆", label: "ASSUMER", detail: "Naïah répond franchement à l’affirmation." },
  simuler: { icon: "◐", label: "SIMULER", detail: "Naïah joue une autre réaction, une autre motivation." },
  retourner: { icon: "↺", label: "RETOURNER", detail: "Naïah esquive et retourne l’analyse contre Bellirith." },
};

/** Clé : le coup gagnant. Valeur : le coup qu’il bat. */
export const BN_BEATS: Record<BNMove, BNMove> = { simuler: "assumer", retourner: "simuler", assumer: "retourner" };

/** Les trois règles, dans l’ordre d’affichage permanent. */
export const BN_CYCLE: readonly (readonly [BNMove, BNMove])[] = [["simuler", "assumer"], ["retourner", "simuler"], ["assumer", "retourner"]];

export function bnCounter(expected: BNMove): BNMove {
  return BN_MOVES.find((move) => BN_BEATS[move] === expected)!;
}

export function bnResolve(pick: BNMove, expected: BNMove): Exclude<BNOutcome, "suspendue"> {
  if (pick === expected) return "egalite";
  return BN_BEATS[pick] === expected ? "naiah" : "bellirith";
}

export type BNAnswer = { lines: DialogueLine[]; naiahMood: string; bellirithMood: string };

export type BNRound = {
  id: string;
  statement: string;
  /** Lecture annoncée. Absente pour la manche anormale. */
  expected?: BNMove;
  /** Geste décrit pendant que Bellirith lit. */
  reading: string;
  tutorial?: boolean;
  anomaly?: boolean;
  answers: Record<BNMove, BNAnswer>;
};

export const BN_TUTORIAL_HINT = "Bellirith annonce la réponse qu’elle lit. Choisissez celle qui la contre.";
export const BN_ANOMALY_LABEL = "SIGNAL HORS ÉCHELLE";
export const BN_ANOMALY_DETAIL = "Les flammes de la table se couchent toutes du même côté. La lecture de Bellirith ne trouve plus de bord.";

export const BN_ROUNDS: readonly BNRound[] = [
  {
    id: "bn-round-win", statement: "Tu veux gagner.", expected: "assumer", tutorial: true,
    reading: "Bellirith incline la tête. Elle a la réponse sur la langue et ne prend même pas la peine de la cacher.",
    answers: {
      assumer: { naiahMood: "smirk", bellirithMood: "smirk", lines: [
        Y("Évidemment que je veux gagner. Tu croyais m’apprendre quelque chose sur moi ?", "smirk"),
        B("Je croyais t’obliger à l’avouer. Tu m’épargnes l’effort, c’est presque vexant.", "smirk"),
      ] },
      simuler: { naiahMood: "laugh", bellirithMood: "angry", lines: [
        T("Naïah pose une main sur son cœur et soupire comme une débutante au premier bal."),
        Y("Gagner ? Moi ? Je suis venue pour la compagnie, les bougies et ta conversation exquise.", "laugh"),
        B("Tu mens si mal que ça devient une insulte.", "angry"),
        Y("Tu as quand même hésité avant de répondre. Une demi-seconde. Je la prends.", "laugh"),
      ] },
      retourner: { naiahMood: "neutral", bellirithMood: "teasing", lines: [
        Y("Et toi, tu as besoin que je veuille gagner. Ça t’arrange tellement.", "smirk"),
        B("Ça m’arrange, oui. Tu viens de me répondre en me fixant sans ciller, ce qui revient à signer. Point pour moi.", "teasing"),
      ] },
    },
  },
  {
    id: "bn-round-closer", statement: "Tu voudrais que je me rapproche.", expected: "simuler",
    reading: "Bellirith fait glisser sa chaise d’un pouce. Ses yeux ne quittent plus la bouche de Naïah.",
    answers: {
      simuler: { naiahMood: "smirk", bellirithMood: "smirk", lines: [
        T("Naïah se penche à son tour, cils baissés, la voix descendue d’un ton."),
        Y("Oh, oui. Viens. Je n’en peux plus d’attendre.", "smirk"),
        B("Tu n’en peux plus de t’ennuyer, plutôt. Je l’avais annoncé, ma belle. Rien de neuf sous mes chandelles.", "smirk"),
      ] },
      retourner: { naiahMood: "laugh", bellirithMood: "angry", lines: [
        T("Naïah ne bouge pas d’un cheveu. Elle désigne les pieds de la chaise d’un mouvement de menton."),
        Y("Toi, tu as déjà avancé. Deux fois. Je compte depuis le début de la partie.", "smirk"),
        B("Une fois et demie.", "angry"),
        Y("Je prends la moitié aussi.", "laugh"),
      ] },
      assumer: { naiahMood: "neutral", bellirithMood: "teasing", lines: [
        Y("Pas spécialement. Tu es très bien là où tu es.", "neutral"),
        B("C’est vrai, et je l’ai senti arriver avant toi. Ta franchise me sert le point sur un plateau.", "teasing"),
      ] },
    },
  },
  {
    id: "bn-round-control", statement: "Tu aimes me faire perdre le contrôle.", expected: "retourner",
    reading: "Elle sourit à moitié. Elle attend la pirouette, celle que Naïah sort chaque fois qu’on la touche juste.",
    answers: {
      retourner: { naiahMood: "smirk", bellirithMood: "smirk", lines: [
        Y("Et toi, tu adores qu’on te le dise.", "smirk"),
        B("Voilà la pirouette. Je l’ai vue se préparer dans tes épaules avant que tu ouvres la bouche.", "smirk"),
      ] },
      assumer: { naiahMood: "laugh", bellirithMood: "angry", lines: [
        Y("Oui. Énormément. Ta bouche fait un petit pli quand tu sens que la partie t’échappe, et je pourrais le regarder toute la nuit.", "smirk"),
        T("Le pli apparaît, exactement à l’endroit annoncé. Bellirith le sent trop tard pour l’effacer."),
        Y("Celui-là. Merci beaucoup.", "laugh"),
      ] },
      simuler: { naiahMood: "thinking", bellirithMood: "teasing", lines: [
        T("Naïah pose un doigt sur sa lèvre et prend l’air d’une élève perdue."),
        Y("Perdre le contrôle ? Je ne sais même pas ce que ça veut dire.", "thinking"),
        B("Retourne ta phrase dans l’autre sens et tu auras mieux réussi. Celle-ci, je la lis comme une affiche collée sur un mur.", "teasing"),
      ] },
    },
  },
  {
    id: "bn-round-kiss", statement: "Tu voudrais que je t’embrasse.", expected: "assumer",
    reading: "La lecture lui plaît. Une envie nette pointe vers elle, et Bellirith la savoure avant de la poser sur la table.",
    answers: {
      assumer: { naiahMood: "smirk", bellirithMood: "thoughtful", lines: [
        Y("Oui. Je voudrais voir la tête que tu fais juste après.", "smirk"),
        B("Je savais que tu le voulais. Je n’avais pas deviné pour quoi faire, et ça m’agace plus que de perdre. Égalité.", "thoughtful"),
      ] },
      simuler: { naiahMood: "laugh", bellirithMood: "angry", lines: [
        T("Naïah ferme les yeux, entrouvre les lèvres et se penche avec une lenteur parfaite. Bellirith se penche aussi. Puis Naïah ouvre un œil."),
        Y("Tu as tenu combien de temps, là ?", "smirk"),
        B("Pas une seconde.", "angry"),
        Y("Quatre. Je les ai comptées pour toi.", "laugh"),
      ] },
      retourner: { naiahMood: "neutral", bellirithMood: "seductive", lines: [
        Y("C’est toi qui en as envie. Tu me la prêtes pour ne pas avoir à la demander.", "neutral"),
        B("Je ne prête jamais mes envies, je les réclame. Et tu viens de tourner le dos à la tienne : je l’ai sentie quitter la pièce. Point pour moi.", "seductive"),
      ] },
    },
  },
  {
    id: "bn-round-limit", statement: "Tu veux savoir jusqu’où je suis prête à aller.", expected: "simuler",
    reading: "Bellirith pose les coudes sur la table. Elle attend un numéro, quelque chose de joli et de faux pour couvrir la curiosité.",
    answers: {
      simuler: { naiahMood: "smirk", bellirithMood: "smirk", lines: [
        T("Naïah prend une voix rauque, beaucoup trop rauque, et fait courir un doigt sur le bord de la table."),
        Y("Jusqu’au bout de la nuit, Bellirith. Jusqu’au bout du monde.", "smirk"),
        B("Le numéro attendu, à la virgule près. Tu deviens prévisible quand tu joues trop bien.", "smirk"),
      ] },
      retourner: { naiahMood: "laugh", bellirithMood: "angry", lines: [
        Y("Moi, je sais déjà jusqu’où tu vas. Tu t’arrêtes juste avant de perdre. Tu veux que je te montre l’endroit exact ?", "smirk"),
        T("Bellirith ouvre la bouche, puis la referme. Naïah pointe le doigt sur ce silence."),
        Y("Là. Exactement là.", "laugh"),
      ] },
      assumer: { naiahMood: "neutral", bellirithMood: "seductive", lines: [
        Y("Oui. Je veux le savoir.", "neutral"),
        B("Tu me la donnes nue, sans rien autour. Avec moi, c’est toujours une erreur délicieuse.", "seductive"),
      ] },
    },
  },
  {
    id: "bn-round-fissure", anomaly: true,
    statement: "Si quelqu’un qui t’a rejetée revenait demain et te regardait enfin… tu voudrais une explication.",
    reading: "Bellirith a prononcé la phrase sur le même ton que les autres, la joue dans la main. Puis sa main retombe.",
    answers: {
      assumer: { naiahMood: "angry", bellirithMood: "cold", lines: [
        Y("C’est une question stupide.", "angry"),
        Y("Suivante.", "angry"),
        T("Elle l’a dit trop vite. Les deux mots se sont marché dessus."),
      ] },
      simuler: { naiahMood: "neutral", bellirithMood: "cold", lines: [
        T("Naïah bâille. Un bâillement impeccable, la main devant la bouche, les yeux qui se plissent."),
        Y("Non. Aucune envie. Personne ne revient, de toute façon.", "neutral"),
        T("Sa main reste devant sa bouche une seconde de trop."),
      ] },
      retourner: { naiahMood: "angry", bellirithMood: "cold", lines: [
        Y("Et toi, Bellirith, qui t’a rejetée ? Raconte. On a toute la nuit, puisque tu aimes les confidences.", "smirk"),
        T("La pirouette part trop tôt. Elle n’attend même pas la fin de la question pour tourner."),
      ] },
    },
  },
];

export const BN_ROUND_COUNT = BN_ROUNDS.length;
export const BN_ANOMALY_ROUND = BN_ROUNDS.findIndex((round) => round.anomaly);

/** Lignes communes à la fissure, quelle que soit la réponse choisie. */
export const BN_ANOMALY_AFTERMATH: DialogueLine[] = [
  T("Bellirith ne sourit plus. Elle ne dit rien, et c’est la première fois de la soirée que son silence ne sert à rien."),
  Y("Manche suivante.", "neutral"),
  B("Il n’y en a pas.", "cold"),
  Y("Alors on arrête. Tu as triché, de toute façon. Tes bougies ont fait un drôle de bruit.", "angry"),
];

export function bnOutcome(roundIndex: number, pick: BNMove): BNOutcome {
  const round = BN_ROUNDS[roundIndex];
  if (!round || round.anomaly || !round.expected) return "suspendue";
  return bnResolve(pick, round.expected);
}

export const BN_OUTCOME_LABELS: Record<BNOutcome, string> = {
  naiah: "Naïah prend la manche",
  bellirith: "Bellirith prend la manche",
  egalite: "Égalité : Bellirith a lu juste, Naïah ne lui cède rien",
  suspendue: "Manche suspendue",
};

export function bnOutcomeExplanation(roundIndex: number, pick: BNMove) {
  const round = BN_ROUNDS[roundIndex];
  if (!round?.expected) return "La lecture de Bellirith s’est arrêtée au milieu de la manche.";
  const outcome = bnResolve(pick, round.expected);
  const picked = BN_MOVE_INFO[pick], expected = BN_MOVE_INFO[round.expected];
  if (outcome === "egalite") return `Bellirith attendait ${expected.icon} ${expected.label} et l’a obtenu : personne ne marque.`;
  if (outcome === "naiah") return `${picked.icon} ${picked.label} bat ${expected.icon} ${expected.label} : Naïah a joué contre la lecture annoncée.`;
  return `${expected.icon} ${expected.label} bat ${picked.icon} ${picked.label} : Bellirith a lu la parade avant qu’elle arrive.`;
}

export type BNGameState = {
  /** Manche affichée (0 à BN_ROUND_COUNT). BN_ROUND_COUNT = écran de clôture. */
  round: number;
  /** Réponses déjà jouées, une par manche. */
  picks: BNMove[];
  /** Manches gagnées par Naïah. */
  score: number;
  /** Manches gagnées par Bellirith. */
  bellirithScore: number;
  tutorialSeen: boolean;
  anomalySeen: boolean;
  completed: boolean;
};

export function createBNGame(): BNGameState {
  return { round: 0, picks: [], score: 0, bellirithScore: 0, tutorialSeen: false, anomalySeen: false, completed: false };
}

function scoreOf(picks: readonly BNMove[]) {
  let score = 0, bellirithScore = 0;
  picks.forEach((pick, index) => {
    const outcome = bnOutcome(index, pick);
    if (outcome === "naiah") score += 1;
    if (outcome === "bellirith") bellirithScore += 1;
  });
  return { score, bellirithScore };
}

/** Joue la manche courante. Une manche déjà jouée n’est jamais rejouée dans la même partie. */
export function bnPick(state: BNGameState, move: BNMove): BNGameState {
  if (state.completed || state.round >= BN_ROUND_COUNT || state.picks.length > state.round || !BN_MOVES.includes(move)) return state;
  const picks = [...state.picks, move];
  return { ...state, picks, ...scoreOf(picks), tutorialSeen: true, anomalySeen: state.anomalySeen || state.round === BN_ANOMALY_ROUND };
}

/** Passe à la manche suivante, puis à l’écran de clôture. */
export function bnNext(state: BNGameState): BNGameState {
  if (state.completed || state.picks.length <= state.round || state.round >= BN_ROUND_COUNT) return state;
  return { ...state, round: state.round + 1 };
}

export function bnFinish(state: BNGameState): BNGameState {
  if (state.round < BN_ROUND_COUNT || state.picks.length < BN_ROUND_COUNT) return state;
  return { ...state, completed: true };
}

/** Partie locale positionnée à une manche donnée (replay et outils développeur uniquement). */
export function bnGameAtRound(round: number): BNGameState {
  const target = Math.max(0, Math.min(BN_ROUND_COUNT - 1, Math.trunc(round)));
  const picks = BN_ROUNDS.slice(0, target).map((entry) => entry.expected ? bnCounter(entry.expected) : "assumer");
  return { ...createBNGame(), round: target, picks, ...scoreOf(picks), tutorialSeen: target > 0 };
}

export function validBNGame(value: unknown): value is BNGameState {
  if (!value || typeof value !== "object") return false;
  const state = value as Partial<BNGameState>;
  if (!Number.isInteger(state.round) || state.round! < 0 || state.round! > BN_ROUND_COUNT) return false;
  if (!Array.isArray(state.picks) || !state.picks.every((pick) => BN_MOVES.includes(pick))) return false;
  if (state.picks.length > BN_ROUND_COUNT || state.picks.length < state.round! || state.picks.length > state.round! + 1) return false;
  if (typeof state.tutorialSeen !== "boolean" || typeof state.anomalySeen !== "boolean" || typeof state.completed !== "boolean") return false;
  if (state.completed && state.picks.length < BN_ROUND_COUNT) return false;
  return true;
}

/** Recalcule les scores depuis les réponses : un score falsifié ne survit pas au chargement. */
export function hydrateBNGame(value: unknown): BNGameState | undefined {
  if (!validBNGame(value)) return undefined;
  const picks = [...value.picks];
  return { ...value, picks, ...scoreOf(picks), anomalySeen: value.anomalySeen || picks.length > BN_ANOMALY_ROUND, tutorialSeen: value.tutorialSeen || picks.length > 0 };
}

export type BNGameResult = "naiah" | "bellirith" | "egalite";
export function bnGameResult(state: Pick<BNGameState, "score" | "bellirithScore">): BNGameResult {
  return state.score > state.bellirithScore ? "naiah" : state.score < state.bellirithScore ? "bellirith" : "egalite";
}

/** Clôture écrite pour chacun des trois résultats possibles. */
export const BN_CLOSINGS: Record<BNGameResult, DialogueLine[]> = {
  naiah: [
    T("Naïah ramasse les jetons gagnés un par un, avec un soin d’usurière, et en laisse un seul au milieu de la table."),
    Y("Pour ta prochaine leçon. Tu en auras besoin.", "smirk"),
    B("Garde ton aumône.", "cold"),
    T("Naïah part sans se retourner. Bellirith ne touche pas au jeton tant que la porte n’est pas refermée. Ensuite, elle le garde dans sa paume."),
    B("Tu as vu ses mains, à la dernière question ? Elles n’ont rien fait. Elle, qui ne tient jamais en place.", "thoughtful"),
    P("Tu veux dire qu’elle a eu peur ?"),
    B("Je veux dire que je n’ai pas de mot pour ce que j’ai senti. Et j’ai des mots pour tout, trésor.", "thoughtful"),
  ],
  bellirith: [
    T("Bellirith ne ramasse pas ses jetons. Naïah les compte quand même, à voix haute, pour bien montrer qu’elle sait perdre."),
    Y("Tu as gagné. Félicitations. Tu veux une médaille ou un baiser simulé ?", "smirk"),
    B("Ni l’un ni l’autre. Va-t’en, Naïah.", "cold"),
    T("La phrase est sortie sans rien autour, sans le sourire qui l’aurait rendue drôle. Naïah hausse un sourcil, puis s’en va pour de bon."),
    B("J’ai remporté plus de manches qu’elle et je ne sais pas ce que j’ai gagné. Retiens ce moment, il ne se reproduira pas.", "thoughtful"),
    P("Qu’est-ce que tu as senti, à la fin ?"),
    B("Une faim. Énorme. Et je ne sais pas encore de quoi.", "thoughtful"),
  ],
  egalite: [
    T("Les jetons restent répartis à parts égales. Naïah les aligne en deux colonnes parfaites, puis renverse la sienne d’une pichenette."),
    Y("Match nul. C’est la pire issue, personne ne peut se vanter.", "neutral"),
    B("Tu te vanteras quand même.", "cold"),
    Y("Évidemment.", "smirk"),
    T("La porte se referme. Bellirith remet un à un les jetons renversés dans la colonne de Naïah, sans rien dire, comme on recompte une somme qui ne tombe pas juste."),
    B("Elle a joué toute la soirée. Sauf une fois. Je veux savoir ce qu’il y avait derrière cette fois-là.", "thoughtful"),
  ],
};

export const BN_GAME_RELATION_BONUS: Record<BNGameResult, { naiah: { affection?: number; trust?: number }; bellirith: { affection?: number; trust?: number; desire?: number } }> = {
  // Simulation réussie : affection de Naïah, désir de Bellirith.
  naiah: { naiah: { affection: 2 }, bellirith: { desire: 1 } },
  // Bellirith lit et contre : confiance de Bellirith, affection de Naïah.
  bellirith: { naiah: { affection: 1 }, bellirith: { trust: 1 } },
  egalite: { naiah: { affection: 1 }, bellirith: { desire: 1 } },
};

/** Courte explication jouée au premier lancement, en une seule carte. */
export const BN_GAME_INTRO: DialogueLine[] = [
  B("Règles simples. Je dis une chose sur toi. Je t’annonce ce que tu vas répondre. Tu essaies de me faire mentir.", "teasing"),
  Y("Et si je réponds juste ?", "smirk"),
  B("Alors je gagne. Trois façons de jouer, chacune en bat une autre. Même une fée des brumes peut retenir ça.", "smirk"),
];
