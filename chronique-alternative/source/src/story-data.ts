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
 * L'Acte I de Chroniques Alternatives se compose de dix chapitres. Chacun
 * naît du précédent ; les deux pistes du chapitre IV sont les seules branches
 * parallèles et se rejoignent sans ordre privilégié au chapitre V.
 */
export const MAIN_STORY: StoryAct[] = [
  {
    id: "echoes-clearing",
    number: "I",
    title: "La Clairière des Échos",
    objective: "Trouver la route d'Al’Gratal sans exposer la magie de deux inconnues.",
    detail: "Le conseil de Saidin vous mène à Hylee et Remerii en plein entraînement. Votre première négociation décide moins de la destination que de la confiance avec laquelle le trajet commencera.",
    requiredScenes: ["campaign-echoes"],
  },
  {
    id: "three-humans-algratal",
    number: "II",
    title: "Trois humains à Al’Gratal",
    objective: "Atteindre la capitale et découvrir à qui le phénix de Saidin ouvre réellement la porte.",
    detail: "La ville s'offre d'abord au regard de Hylee, puis le jeton transforme l'attitude des gardes. Il autorise une prise en charge officielle, jamais une promenade libre dans le palais.",
    requiredScenes: ["campaign-algratal-road"],
  },
  {
    id: "audience-without-witness",
    number: "III",
    title: "Audience sans témoin",
    objective: "Faire examiner votre anomalie par Iriana et Valurn, puis ouvrir deux pistes distinctes.",
    detail: "La signature de votre portail ressemble en partie à la grammaire du pacte d'Alamma sans révéler votre origine. Forthaven et Naïah deviennent deux directions à explorer dans l'ordre de votre choix.",
    requiredScenes: ["campaign-imperial-audience"],
  },
  {
    id: "two-roads",
    number: "IV",
    title: "Deux routes",
    objective: "Obtenir le passage de Naïah et ramener Draven à Al’Gratal.",
    detail: "La Forêt Interdite exige une négociation avec Naïah. Forthaven impose d'abord de survivre à une nouvelle vague de morts-vivants, puis d'assumer le départ de Draven devant Lineva. Aucune route n'accorde un avantage mécanique sur l'autre.",
    requiredScenes: ["campaign-naiah-promise", "campaign-forthaven-assault", "campaign-lineva-departure"],
  },
  {
    id: "price-of-help",
    number: "V",
    title: "Le prix de l'aide",
    objective: "Obtenir l'appui politique d'Iriana et former l'escorte vers Akuhn’Nabad.",
    detail: "Iriana promet son poids devant Tia, jamais une armée qu'elle ne contrôle pas. Draven accepte de prolonger son absence si la mission peut enfin rendre le danger de Forthaven impossible à ignorer.",
    requiredScenes: ["campaign-price-of-aid"],
  },
  {
    id: "forbidden-city",
    number: "VI",
    title: "La cité interdite",
    objective: "Franchir les portes d'Akuhn’Nabad sans contourner le bannissement de Naïah.",
    detail: "Naïah tient sa promesse et s'arrête aux portes. Allenna maintient son bannissement, interroge les visiteurs et décide seule si la mission peut entrer dans la cité.",
    requiredScenes: ["campaign-akuhn-gates"],
  },
  {
    id: "alamma-archives",
    number: "VII",
    title: "Les archives d'Alamma",
    objective: "Gagner l'accès d'Amanea, reconstruire le plan d'Alamma et tenter une coopération avec Tia.",
    detail: "Allenna, Draven et le protagoniste recoupent des preuves dispersées. La demande de lettre à Tia peut réussir ou échouer ; les deux décisions sont persistantes et conduisent à la suite sans correction artificielle.",
    requiredScenes: ["campaign-amanea-audience", "campaign-alamma-archives", "campaign-amanea-letter"],
  },
  {
    id: "before-light",
    number: "VIII",
    title: "Devant la Lumière",
    objective: "Convaincre Tia de mobiliser contre le portail et de répondre enfin à Forthaven.",
    detail: "La lettre d'Amanea, si elle existe, modifie profondément l'audience sans annuler les soupçons. L'aide arrive, mais Tia demande simultanément un détachement aux soldats que Forthaven peut le moins perdre.",
    requiredScenes: ["campaign-before-light"],
  },
  {
    id: "convergence",
    number: "IX",
    title: "La convergence",
    objective: "Préparer puis mener l'opération commune dans la Forêt Interdite.",
    detail: "Les camps coopèrent sans se réconcilier. Bellirith perturbe les personnes, jamais l'enquête. Le portail est réellement dangereux et sa destruction constitue une victoire crédible.",
    requiredScenes: ["campaign-coalition-preparation", "campaign-false-portal"],
  },
  {
    id: "rocky-spires",
    number: "X",
    title: "Les Serres Rocheuses",
    objective: "Comprendre pourquoi la victoire de la forêt servait le véritable plan d'Alamma.",
    detail: "Iriana vous convoque personnellement lorsque les rapports découvrent un second chantier. Le véritable portail s'ouvre, les négociations se rompent et l'Acte II devient inévitable sans résoudre Alamma, Forthaven, Saidin ni votre origine.",
    requiredScenes: ["campaign-rocky-spires"],
  },
];

export const SUPPORTING_FIGURES: SupportingFigure[] = [
  {
    id: "medig",
    name: "Medig",
    role: "Chouette blanche de Hylee",
    portrait: "/assets/portraits/medig.jpg",
    unlockScenes: ["medig-window"],
    place: "Entre l'Auberge du Forestier et les routes de Hylee",
    bio: "Hylee l'a sauvée près de l'Auberge du Forestier. Medig retrouve toujours sa route jusqu'à elle et transporte parfois des messages. Elle reste un lien relationnel facultatif, jamais la clef imposée des archives d'Akuhn’Nabad.",
  },
  {
    id: "alamma",
    name: "Alamma Farae",
    role: "Père d'Iriana · auteur du pacte",
    portrait: "/assets/backgrounds/algratal_catacombs.webp",
    unlockScenes: ["campaign-imperial-audience", "campaign-alamma-archives"],
    place: "Influence dissimulée entre les faux ordres et les portails",
    bio: "Père d'Iriana et fils de Tia, Alamma a conclu un pacte dont la grammaire ressemble partiellement à celle de votre apparition. Cette parenté guide l'enquête sans prouver votre origine. Ses faux ordres et ses chantiers transforment la méfiance entre Empire et Obscurcis en ressource stratégique.",
  },
];

export function storyProgress(history: string[], flags: string[]) {
  if (flags.includes("main-story-complete") || flags.includes("main-story-act-1-complete")) return MAIN_STORY.length;
  const completed = new Set([
    ...history,
    ...flags,
    ...flags.filter((flag) => flag.startsWith("social:")).map((flag) => flag.slice(7)),
  ]);
  let current = 0;
  for (const chapter of MAIN_STORY) {
    if (!chapter.requiredScenes.every((scene) => completed.has(scene))) break;
    current += 1;
  }
  return Math.min(current, MAIN_STORY.length);
}
