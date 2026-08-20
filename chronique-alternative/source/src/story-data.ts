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
 * mais Iriana n'a jamais réuni l'équipe. Les actes avancent par découvertes,
 * sans date butoir et sans empêcher le monde de rester ouvert ensuite.
 */
export const MAIN_STORY: StoryAct[] = [
  {
    id: "borrowed-portal",
    number: "I",
    title: "Le portail emprunté",
    objective: "Comprendre dans quelle Sylvinia le passage défectueux vous a déposé·e.",
    detail: "Saidin vous recueille à Al’Gratal. Tout ressemble au commencement d’une histoire connue, sauf un fait : la décision qui devait réunir plusieurs destins autour d’Iriana n’a jamais été prise.",
    requiredScenes: [],
  },
  {
    id: "missing-gathering",
    number: "II",
    title: "Le rassemblement absent",
    objective: "Approcher Iriana et découvrir pourquoi sa quête contre le pacte d’Alamma demeure solitaire.",
    detail: "Iriana cherche toujours à révoquer le pacte conclu par son père avec un démon. Pourtant, elle n’a envoyé aucune invitation et ne se souvient même pas d’avoir envisagé l’équipe qui aurait dû changer le cours des événements.",
    requiredScenes: ["iriana-0"],
  },
  {
    id: "separate-roads",
    number: "III",
    title: "Des routes qui ne se croisent plus",
    objective: "Retrouver les personnes que l’expédition absente aurait dû rassembler.",
    detail: "Hylee et Remerii parcourent le continent en dissimulant leur magie à l’Empire. Draven cherche des renforts pour Forthaven. Naïah demeure dans ses brumes. Chacun poursuit une vie cohérente — mais séparée des autres.",
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
    title: "La couture du pacte",
    objective: "Relier la défaillance de votre portail au pacte qu’Iriana tente de révoquer.",
    detail: "Valurn reconnaît dans votre fracture la même logique que dans les contrats démoniaques d’Alamma. Bellirith connaît des chemins que son frère préférerait ignorer ; Amanea possède des archives que l’Empire ne doit jamais voir. D’autres traces ressemblantes devront être étudiées sans être confondues entre elles.",
    requiredScenes: ["valurn-2", "amanea-3", "iriana-3"],
  },
  {
    id: "chosen-convergence",
    number: "VI",
    title: "La convergence choisie",
    objective: "Faire coopérer des vies séparées sans recréer de force l’équipe qui n’a jamais existé.",
    detail: "Vous devenez le trait d’union de cette chronologie alternative : des alliances discrètes remplacent l’expédition absente. La décision finale n’est liée à aucun jour et le monde reste entièrement ouvert après sa résolution.",
    requiredScenes: ["amanea-4", "draven-4", "bellirith-3"],
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
  const completed = new Set([...history, ...flags, ...flags.filter((flag) => flag.startsWith("social:")).map((flag) => flag.slice(7))]);
  let current = 0;
  for (const act of MAIN_STORY) {
    if (!act.requiredScenes.every((scene) => completed.has(scene))) break;
    current += 1;
  }
  return Math.min(current, MAIN_STORY.length);
}
