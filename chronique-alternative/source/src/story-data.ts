export type StoryAct = {
  id: string;
  number: string;
  title: string;
  objective: string;
  detail: string;
  requiredScenes: string[];
};

export type SupportingFigure = {
  id: string;
  name: string;
  role: string;
  portrait: string;
  unlockScenes: string[];
  bio: string;
  place: string;
};

/**
 * Cette chronique diverge au début du Tome 1 : Hylee a rencontré Remerii,
 * tandis qu’Iriana poursuit seule son enquête. Les actes avancent par découvertes,
 * sans date butoir et sans empêcher le monde de rester ouvert ensuite.
 */
export const MAIN_STORY: StoryAct[] = [
  {
    id: "borrowed-portal",
    number: "I",
    title: "Le portail emprunté",
    objective: "Retrouver vos repères dans une Sylvinia que vous reconnaissez sans pouvoir dire d’où.",
    detail: "Saidin vous recueille à Al’Gratal après l’ouverture d’un portail instable. Votre mémoire ne livre aucune chronologie à comparer à celle-ci : seulement la certitude intime et inexpliquée que vous n’êtes pas né·e dans cette réalité.",
    requiredScenes: [],
  },
  {
    id: "missing-gathering",
    number: "II",
    title: "Le pacte sans escorte",
    objective: "Approcher Iriana et comprendre ce qu’elle cherche à défaire sans livrer une autre vie au pacte d’Alamma.",
    detail: "Iriana enquête seule sur le contrat démoniaque conclu par son père. Elle refuse la solution qui consisterait à lui substituer une autre âme et garde ses recherches hors du Conseil, où les faux d’Alamma possèdent encore des défenseurs.",
    requiredScenes: ["iriana-0"],
  },
  {
    id: "separate-roads",
    number: "III",
    title: "Des routes séparées",
    objective: "Suivre les indices laissés par le portail et décider quelles personnes mettre en relation.",
    detail: "Hylee et Remerii viennent de prendre la route. Draven cherche des renforts pour Forthaven. Naïah protège ses brumes et Akuhn’Nabad reste hors des cartes impériales. Aucun destin ne vous attend : les liens naîtront de rencontres, d’accords et de refus réels.",
    requiredScenes: ["medig-window", "draven-0"],
  },
  {
    id: "living-black-queen",
    number: "IV",
    title: "La Reine Noire vivante",
    objective: "Entrer à Akuhn’Nabad et négocier avec Amanea sans exposer sa cité à l’Empire.",
    detail: "Dans cette branche, Amanea règne encore. Ennemie de l’Empire, elle reste loin d’Al’Gratal, prépare Allenna à lui succéder et oppose à Naïah un silence dont personne ne comprend encore la cause.",
    requiredScenes: ["amanea-0", "amanea-family-truth"],
  },
  {
    id: "pact-seam",
    number: "V",
    title: "Les encres du mensonge",
    objective: "Protéger un canal d’archives, puis recouper le registre impérial, les journaux d’Akuhn’Nabad et le faux ordre.",
    detail: "L’enquête politique progresse sans exiger les confidences privées des personnages. Valurn examine la grammaire démoniaque sous la cire, Amanea cherche dans les rapports de ses loyalistes et Iriana dans les réserves d’Alamma. La résonance de votre passage demeure une piste distincte, jamais une preuve de votre origine.",
    requiredScenes: ["campaign-archives-channel", "campaign-forged-proof"],
  },
  {
    id: "chosen-convergence",
    number: "VI",
    title: "La convergence choisie",
    objective: "Fermer le relais d’Alamma, empêcher une offensive fondée sur ses faux et préserver l’autonomie de chaque camp.",
    detail: "Douze trajectoires acceptent de coordonner une seule opération sans former un groupe permanent. L’Empire et Akuhn’Nabad ne se réconcilient pas, et les fractures personnelles restent soumises à la confiance de celles et ceux qui les portent. La conclusion ferme la campagne, pas le monde ni les relations.",
    requiredScenes: ["campaign-convergence-council", "campaign-convergence-operation", "campaign-epilogue"],
  },
];

export const SUPPORTING_FIGURES: SupportingFigure[] = [
  {
    id: "medig",
    name: "Medig",
    role: "Chouette blanche de Hylee",
    portrait: "/assets/portraits/medig.jpg",
    unlockScenes: ["medig-window"],
    place: "Entre l’Auberge du Forestier et les routes de Hylee",
    bio: "Hylee l’a sauvée près de l’Auberge du Forestier. Medig retrouve toujours sa route jusqu’à elle et transporte parfois des messages entre Hylee, Remerii et Naïah lorsque les déplacements magiques seraient trop faciles à repérer.",
  },
  {
    id: "alamma",
    name: "Alamma Farae",
    role: "Père d’Iriana · auteur du pacte",
    portrait: "/assets/backgrounds/algratal_catacombs.webp",
    unlockScenes: ["iriana-3", "amanea-3"],
    place: "Influence dissimulée entre les plans",
    bio: "Père d’Iriana, Alamma a conclu avec un démon un pacte dont les clauses continuent d’agir sur sa fille et sur les équilibres de Sylvinia. Iriana cherche à le révoquer ; Valurn et Amanea savent qu’un contrat démoniaque ne se brise jamais sans révéler ce qu’il protégeait réellement.",
  },
];

export function storyProgress(history: string[], flags: string[]) {
  // Une sauvegarde ayant déjà achevé l'ancienne campagne conserve son état.
  // Les nouvelles scènes restent alors disponibles en relecture grâce à la
  // migration de sauvegarde, sans retirer au joueur une fin déjà obtenue.
  if (flags.includes("main-story-complete")) return MAIN_STORY.length;
  const completed = new Set([...history, ...flags, ...flags.filter((flag) => flag.startsWith("social:")).map((flag) => flag.slice(7))]);
  let current = 0;
  for (const act of MAIN_STORY) {
    if (!act.requiredScenes.every((scene) => completed.has(scene))) break;
    current += 1;
  }
  return Math.min(current, MAIN_STORY.length);
}
