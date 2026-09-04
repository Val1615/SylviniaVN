import type { ChoiceData, DialogueLine, Effects } from "./game-data";
import type { AlphaHuntState } from "./alpha-hunt";

export const LINEVA_ALLENNA_SERIES_ID = "lineva-allenna";

export type CrossLetterReply = {
  id: string;
  label: string;
  response: string;
  effects: Effects;
};

export type CrossLetter = {
  id: string;
  dayOffset: number;
  character: "lineva" | "allenna";
  subject: string;
  delivery: string;
  body: string[];
  signature: string;
  eventId: string;
  replies?: CrossLetterReply[];
};

export type ReceivedCrossLetter = {
  id: string;
  receivedDay: number;
  read: boolean;
  replyId?: string;
};

export type CrossQuestProgress = {
  id: string;
  stage: number;
  startedDay: number;
  stageStartedDay: number;
  letters: ReceivedCrossLetter[];
  alphaState?: AlphaHuntState;
};

export type CrossQuestMilestone = {
  stage: number;
  title: string;
  objective: string;
};

export type CrossQuestScene = {
  id: string;
  stage: number;
  title: string;
  location: string;
  spot: string;
  lead: "lineva" | "allenna";
  cast: ["lineva", "allenna"] | ["allenna"] | ["lineva"];
  intro: DialogueLine[];
  choices: ChoiceData[];
};

const N = (text: string): DialogueLine => ({ speaker: "Narration", text });
const C = (speaker: string, text: string, mood?: string): DialogueLine => ({ speaker, text, mood });
const choice = (id: string, text: string, response: DialogueLine[], effects: Effects = {}): ChoiceData => ({ id, text, response, effects });

export const LINEVA_ALLENNA_MILESTONES: CrossQuestMilestone[] = [
  { stage: 0, title: "Le mauvais allié", objective: "Revoir Allenna à Akuhn’Nabad et ouvrir un canal extérieur à l’Empire." },
  { stage: 1, title: "Le mauvais allié", objective: "Proposer à Lineva une rencontre, sans lui promettre l’innocence des Obscurcis." },
  { stage: 2, title: "Deux commandantes sur le même quai", objective: "Accueillir Allenna sur les quais de Forthaven et définir une coopération temporaire." },
  { stage: 3, title: "Trente jours à Forthaven", objective: "Poursuivre vos activités pendant que leurs nouvelles arrivent par courrier." },
  { stage: 4, title: "Le silence", objective: "Trois jours sans nouvelle : retourner à Forthaven et gagner la ville haute." },
  { stage: 5, title: "La ville haute tient", objective: "Retrouver Lineva et Allenna sur les remparts et comprendre le mouvement de la horde." },
  { stage: 6, title: "Le cœur de la ruche", objective: "Localiser l’Alpha, ouvrir une route et guider les deux commandantes jusqu’à lui." },
  { stage: 7, title: "Après la bataille", objective: "Retrouver Lineva et Allenna lorsque l’urgence retombe." },
];

export const LINEVA_ALLENNA_FINAL_FLAGS = [
  "cross-la-series-complete",
  "story-allenna-lineva-met",
  "cross-la-public-dates-unlocked",
  "cross-la-world-friendship",
];

export function linevaAllennaSeriesUnlocked(input: {
  flags: string[];
  history: string[];
  relationships: Record<string, { stage: number }>;
  unlockAll?: boolean;
}) {
  if (input.unlockAll) return true;
  const actOneComplete = input.flags.includes("main-story-act-1-complete") || input.flags.includes("main-story-complete");
  return actOneComplete && (input.relationships.lineva?.stage || 0) >= 5 && (input.relationships.allenna?.stage || 0) >= 5;
}

export function createLinevaAllennaProgress(day: number): CrossQuestProgress {
  return { id: LINEVA_ALLENNA_SERIES_ID, stage: 0, startedDay: day, stageStartedDay: day, letters: [] };
}

export function crossMilestone(stage: number) {
  return LINEVA_ALLENNA_MILESTONES.find((entry) => entry.stage === stage);
}

export function completedCrossMilestones(stage: number) {
  if (stage >= 8) return 7;
  if (stage <= 0) return 0;
  if (stage === 1) return 0;
  return Math.min(6, stage - 1);
}

export const LINEVA_ALLENNA_LETTERS: CrossLetter[] = [
  {
    id: "cross-la-letter-01", dayOffset: 0, character: "allenna", eventId: "first-operation", subject: "Dispositif modifié", delivery: "Billet scellé de Forthaven",
    body: ["Le premier dispositif a tenu jusqu’à ce que Lineva déplace deux équipes sans prévenir.", "Le quai s’effondrait sous elles. Son changement était justifié. Je n’approuve pas la méthode ; j’en conserve le résultat."], signature: "Allenna",
    replies: [
      { id: "method", label: "Demander quel détail a sauvé l’opération", response: "Allenna joint un schéma précis. Une annotation de Lineva au charbon contredit encore la légende.", effects: { trust: 2, relationshipEffects: { lineva: { trust: 1 } } } },
      { id: "tease", label: "Souligner qu’elle vient presque de complimenter Lineva", response: "La réponse suivante ne contient qu’un trait sec. En dessous, Lineva a ajouté : « Je confirme. »", effects: { affection: 1, desire: 1, relationshipEffects: { lineva: { affection: 1, desire: 1 } } } },
    ],
  },
  { id: "cross-la-letter-02", dayOffset: 2, character: "lineva", eventId: "first-operation", subject: "Son dispositif", delivery: "Feuillet plié en quatre", body: ["La commandante obscurcie avait prévu trois sorties. J’en ai trouvé une quatrième quand le quai a cédé.", "Elle a râlé pendant tout le repli. Elle a aussi ramené tout le monde."], signature: "Lineva" },
  {
    id: "cross-la-letter-03", dayOffset: 4, character: "lineva", eventId: "retreat", subject: "La digue ou les gens", delivery: "Message d’un navire marchand",
    body: ["Nous avons laissé une digue aux morts pour garder deux équipes en vie. Allenna voulait d’abord sauver les réserves.", "Elle a trouvé comment incendier seulement l’accès et récupérer les caisses ensuite. Je déteste les plans propres quand ils fonctionnent."], signature: "Lineva",
    replies: [{ id: "support", label: "Répondre que choisir les vivants n’annule pas la stratégie", response: "Lineva répond que c’était précisément l’idée, sans ajouter qu’elle avait besoin de la lire.", effects: { trust: 2 } }],
  },
  { id: "cross-la-letter-04", dayOffset: 6, character: "allenna", eventId: "retreat", subject: "Position abandonnée", delivery: "Papier noir aux bords salés", body: ["Lineva a cédé une position avant que je l’ordonne. J’ai d’abord cru à une improvisation de plus.", "Elle avait vu les fondations bouger. Nous avons repris les réserves après l’incendie. Le retrait était le bon."], signature: "Allenna" },
  {
    id: "cross-la-letter-05", dayOffset: 8, character: "allenna", eventId: "mutual-cover", subject: "Trois secondes", delivery: "Billet très court",
    body: ["Une brèche s’est ouverte. Lineva m’a crié de passer avant d’expliquer.", "J’ai obéi. Trois secondes plus tard, son équipe fermait l’angle derrière nous. Rien d’autre à signaler."], signature: "Allenna",
    replies: [{ id: "flirt-allenna", label: "Demander si elle obéit toujours aussi bien", response: "Allenna précise que l’expérience ne sera reproduite que dans des conditions rigoureusement choisies. L’encre a marqué une pause avant « rigoureusement ».", effects: { desire: 2, affection: 1 } }],
  },
  { id: "cross-la-letter-06", dayOffset: 10, character: "lineva", eventId: "mutual-cover", subject: "Elle n’a pas discuté", delivery: "Dos d’un ancien rapport", body: ["Allenna a franchi la brèche quand je l’ai demandé. Pas de débat, pas de leçon.", "Après, elle a compté les blessés deux fois. Je lui ai donné mon verre avant qu’elle trouve une tâche de plus."], signature: "Lineva" },
  {
    id: "cross-la-letter-07", dayOffset: 13, character: "lineva", eventId: "training", subject: "Règles d’entraînement", delivery: "Feuille tachée de craie",
    body: ["Allenna affirme qu’un exercice doit conserver ses règles. J’affirme qu’un ennemi ne les lira pas.", "Elle a gagné la première manche. J’ai gagné la deuxième. La troisième est reportée parce que le râtelier n’a pas survécu."], signature: "Lineva",
    replies: [{ id: "both", label: "Proposer de servir de troisième adversaire", response: "Deux réponses arrivent dans la même enveloppe : « Accepté. » et « Mauvaise idée. Venez quand même. »", effects: { desire: 1, relationshipEffects: { allenna: { desire: 1, affection: 1 } } } }],
  },
  { id: "cross-la-letter-08", dayOffset: 15, character: "allenna", eventId: "training", subject: "Compte rendu non officiel", delivery: "Papier d’exercice", body: ["Lineva change les règles quand elle perd. Elle les change aussi quand elle gagne, ce qui rend l’accusation difficile à soutenir.", "J’ai réservé un nouveau râtelier. Elle ignore où."], signature: "Allenna" },
  {
    id: "cross-la-letter-09", dayOffset: 17, character: "allenna", eventId: "meal", subject: "Repas commun", delivery: "Note jointe à une liste de vivres",
    body: ["J’ai préparé une ration complète. Lineva l’a regardée comme si elle pouvait encore l’attaquer.", "Elle en a repris. Elle demande que ce fait ne devienne pas une information diplomatique."], signature: "Allenna",
    replies: [{ id: "question", label: "Demander ce qu’il y avait dedans", response: "La liste contient neuf ingrédients et aucune indication de couleur. Lineva ajoute qu’il vaut mieux ne pas poser certaines questions.", effects: { affection: 2 } }],
  },
  { id: "cross-la-letter-10", dayOffset: 20, character: "lineva", eventId: "improvised-code", subject: "Code au torchon", delivery: "Morceau de registre", body: ["J’ai utilisé un torchon rouge pour signaler une rue perdue. Allenna a déclaré que ce n’était pas un code.", "Hier, elle a demandé trois torchons rouges avant une sortie. Aucun commentaire officiel."], signature: "Lineva" },
  {
    id: "cross-la-letter-11", dayOffset: 22, character: "lineva", eventId: "allenna-decision", subject: "Le pont nord", delivery: "Courrier militaire ouvert",
    body: ["Allenna a ordonné le décrochement du pont nord. J’ai suivi sans discuter.", "Elle avait reconnu le rythme de convergence avant nous. Le pont est tombé vide. Elle n’a pas eu besoin de me le rappeler."], signature: "Lineva",
    replies: [{ id: "respect", label: "Répondre que la confiance se voit surtout quand elle ne parle pas", response: "Lineva ne commente pas la formule. Elle écrit seulement : « Oui. »", effects: { trust: 2, relationshipEffects: { allenna: { trust: 2 } } } }],
  },
  { id: "cross-la-letter-12", dayOffset: 24, character: "allenna", eventId: "daily-life", subject: "Une matinée ordinaire", delivery: "Billet sans sceau", body: ["Entraînement, inspection du quai est, dispute sur un nœud, repas.", "Lineva soutient que j’ai perdu la dispute. Le nœud tient. Je considère le dossier clos."], signature: "Allenna" },
  {
    id: "cross-la-letter-13", dayOffset: 26, character: "lineva", eventId: "daily-life", subject: "Rien d’urgent", delivery: "Dernier bateau du soir",
    body: ["Aucune brèche aujourd’hui. Allenna a corrigé une relève, mangé sur le quai et caché le bon râtelier.", "Une journée presque calme. C’est toujours celles-là qui annoncent les semaines les plus agitées."], signature: "Lineva",
    replies: [{ id: "flirt-both", label: "Écrire que vous aimeriez voir ce calme de plus près", response: "Allenna répond qu’une visite ne nécessite aucun motif opérationnel. Lineva ajoute un lieu, une heure et aucun commentaire.", effects: { desire: 2, affection: 1, relationshipEffects: { allenna: { desire: 2, affection: 1 } } } }],
  },
];

export function nextCrossLetter(progress: CrossQuestProgress, day: number) {
  if (progress.stage !== 3) return undefined;
  return LINEVA_ALLENNA_LETTERS.find((letter) => day >= progress.stageStartedDay + letter.dayOffset && !progress.letters.some((entry) => entry.id === letter.id));
}

export function crossSilenceReady(progress: CrossQuestProgress, day: number) {
  return progress.stage === 3 && progress.letters.length === LINEVA_ALLENNA_LETTERS.length && day >= progress.stageStartedDay + 29;
}

const BOTH_LIGHT: Effects = { affection: 2, trust: 2, relationshipEffects: { allenna: { affection: 2, trust: 2 } } };
const BOTH_FLIRT: Effects = { affection: 1, trust: 1, desire: 2, relationshipEffects: { allenna: { affection: 1, trust: 1, desire: 2 } } };

export const LINEVA_ALLENNA_SCENES: CrossQuestScene[] = [
  {
    id: "cross-la-01-allenna", stage: 0, title: "Le mauvais allié · Une piste extérieure", location: "akuhn", spot: "akuhn-war-room", lead: "allenna", cast: ["allenna"],
    intro: [N("Allenna aligne les traces relevées dans les Serres sans leur faire dire davantage qu’elles ne prouvent."), C("Allenna", "Je vérifierai cette piste. Cela ne signifie pas que j’accepte une accusation contre Amanea, ni contre tout mon peuple.", "stern"), N("Un canal indépendant de l’Empire lui manque. Forthaven possède l’expérience militaire, l’autonomie et toutes les raisons de rester méfiante.")],
    choices: [
      choice("cross-la-01-information", "Proposer Forthaven comme source à confronter, pas comme alliée acquise", [C("Allenna", "Une cité qui nous soupçonne examinera chaque incohérence. C’est inconfortable. C’est donc utile.", "thinking")], { trust: 3 }),
      choice("cross-la-01-strategy", "Souligner l’intérêt commun face aux morts des Serres", [C("Allenna", "Un intérêt commun suffit à ouvrir une porte. Il ne suffit pas à la laisser sans garde.")], { affection: 2, trust: 2 }),
      choice("cross-la-01-empire", "Rappeler qu’aucune des deux cités ne doit dépendre d’une seule lecture impériale", [C("Allenna", "Comparer deux rapports n’exige aucune trahison. J’irai si Lineva accepte de m’entendre.")], { trust: 3 }),
    ],
  },
  {
    id: "cross-la-01-lineva", stage: 1, title: "Le mauvais allié · Une rencontre, rien de plus", location: "forthaven", spot: "forthaven-war-room", lead: "lineva", cast: ["lineva"],
    intro: [N("Lineva écoute la proposition debout, les deux poings sur une carte où la ville basse porte encore les marques de la peste."), C("Lineva", "Des morts se lèvent chez nous, des noms obscurcis apparaissent dans les Serres, et l’idée serait d’inviter leur commandante sur mes quais ?", "determined"), C("Lineva", "Aucune preuve ne dit qu’ils sont innocents.")],
    choices: [
      choice("cross-la-01-observe", "Répondre qu’un contact direct permet justement de les observer et de confronter leurs informations", [C("Lineva", "Une rencontre. Sous mes règles. Ne transformez pas ça en alliance avant qu’elle ait posé le pied ici.")], { trust: 4 }),
      choice("cross-la-01-autonomy", "Refuser de laisser l’Empire choisir seul quels témoignages Forthaven entend", [C("Lineva", "Voilà une manière de rendre une mauvaise idée difficile à jeter. Une rencontre, donc.", "smirk")], { affection: 2, trust: 3 }),
      choice("cross-la-01-certain", "Affirmer qu’Allenna ne représente aucun danger", [C("Lineva", "Vous n’en savez rien. Moi non plus. C’est précisément pour ça que la rencontre restera surveillée.", "stern")], { trust: -2 }),
      choice("cross-la-01-flirt", "Ajouter qu’elle pourra toujours vous faire payer l’idée après la rencontre", [C("Lineva", "Je retiens surtout que vous venez de proposer les deux risques dans la même phrase.", "smirk")], { desire: 2, affection: 1 }),
    ],
  },
  {
    id: "cross-la-02-quay", stage: 2, title: "Deux commandantes sur le même quai", location: "forthaven", spot: "forthaven-harbor", lead: "lineva", cast: ["lineva", "allenna"],
    intro: [N("Allenna franchit seule la dernière passerelle. Lineva l’attend devant les équipes de relève, sans escorte d’apparat."), C("Lineva", "Ici, la peste n’est pas une hypothèse diplomatique."), C("Allenna", "Et je ne suis pas venue demander pardon au nom d’un peuple entier. Je suis venue comparer nos faits et combattre ce qui se lève."), N("Allenna propose trente jours, une petite présence obscurcie, des observations partagées et des secteurs strictement définis. Lineva fixe les accès sensibles, la transmission des rapports et le droit d’interrompre l’essai.")],
    choices: [
      choice("cross-la-02-ledger", "Faire consigner chaque accès et chaque information transmise dans un registre commun", [C("Allenna", "Traçable des deux côtés."), C("Lineva", "Et lisible sans votre encre de cérémonie. Marché conclu.", "smirk")], BOTH_LIGHT),
      choice("cross-la-02-patrol", "Proposer des patrouilles mixtes hors des positions les plus sensibles", [C("Lineva", "On juge les actes là où ils ont lieu."), C("Allenna", "Avec une chaîne de décision explicite. J’accepte.")], BOTH_LIGHT),
      choice("cross-la-02-command", "Leur laisser chacune un droit de retrait immédiat si une limite est franchie", [C("Allenna", "Une coopération sans confiance aveugle."), C("Lineva", "Enfin une formule que je peux signer.")], BOTH_LIGHT),
      choice("cross-la-02-flirt", "Observer que trente jours devraient suffire pour découvrir laquelle supporte le moins d’avoir tort", [C("Lineva", "Elle."), C("Allenna", "Cette réponse constitue déjà un élément de comparaison."), N("Le premier sourire ne dure pas, mais il existe." )], BOTH_FLIRT),
    ],
  },
  {
    id: "cross-la-04-silence", stage: 4, title: "Le silence", location: "forthaven", spot: "forthaven-harbor", lead: "lineva", cast: ["lineva", "allenna"],
    intro: [N("Trois jours sans billet. À Forthaven, la ville basse brûle par endroits ; les quais sont coupés et les civils remontent vers la citadelle."), N("Vous n’avez ni lame ni pouvoir à inventer. Il reste les rythmes d’une patrouille, une venelle enfumée et le passage d’une équipe de porteurs." )],
    choices: [
      choice("cross-la-04-observe", "Observer deux rondes avant de traverser derrière les porteurs", [N("Vous gagnez la rampe sans attirer la horde. Au-dessus, des ordres obscurcis répondent aux cloches de Forthaven.")], { stats: { lucidite: 1 } }),
      choice("cross-la-04-detour", "Contourner les docks par les entrepôts effondrés", [N("Le détour est lent, mais les murs coupent les lignes de vue. Vous atteignez la ville intermédiaire avec les derniers civils." )], { stats: { sangFroid: 1 } }),
      choice("cross-la-04-help", "Aider une porteuse à dégager une charrette, puis suivre son groupe", [N("La charrette ouvre quelques secondes de passage. Personne ne vous prend pour un héros ; une personne de plus atteint simplement la rampe." )], { affection: 1, relationshipEffects: { allenna: { affection: 1 } } }),
    ],
  },
  {
    id: "cross-la-05-high-city", stage: 5, title: "La ville haute tient", location: "forthaven", spot: "forthaven-ramparts", lead: "lineva", cast: ["lineva", "allenna"],
    intro: [N("Sur les remparts, les capes de Forthaven et les armures obscurcies tiennent les mêmes créneaux. Aucun traité n’est affiché ; la coopération existe dans la manière dont les blessés et les munitions circulent."), C("Lineva", "Bon moment pour revenir. Trois rues plus tôt et l’accueil aurait été moins poli.", "smirk"), C("Allenna", "La route a tenu. C’était l’incertitude principale."), N("Lineva désigne les mouvements de la ville basse. Allenna complète avec les intervalles d’énergie observés. L’une annonce la limite d’une sortie ; l’autre change déjà l’angle de la carte sans discuter."), C("Allenna", "Quelque chose coordonne les morts."), C("Lineva", "Assez gros pour attirer leurs rondes. Pas assez visible pour qu’on sache encore où frapper.")],
    choices: [
      choice("cross-la-05-pattern", "Comparer les rondes autour des quartiers détruits", [C("Allenna", "Elles convergent sans poursuivre directement la cible la plus proche."), C("Lineva", "Donc on suit la ronde jusqu’à son centre.")], BOTH_LIGHT),
      choice("cross-la-05-energy", "Superposer les rapports d’énergie aux déplacements", [C("Allenna", "Les pics dessinent plusieurs cases contiguës."), C("Lineva", "Une créature énorme, alors. Ça manquait à la journée.", "smirk")], BOTH_LIGHT),
      choice("cross-la-05-route", "Préparer une lecture de carte pendant qu’elles avancent ensemble", [C("Lineva", "Nous descendons toutes les deux. La route nous viendra de la carte, pas d’une troisième lame."), C("Allenna", "Et nous confirmerons chaque réaction sur le terrain.")], BOTH_LIGHT),
    ],
  },
  {
    id: "cross-la-07-after", stage: 7, title: "Après la bataille", location: "forthaven", spot: "forthaven-war-room", lead: "lineva", cast: ["lineva", "allenna"],
    intro: [N("La horde n’a pas disparu, mais ses mouvements se sont défaits. À une table rayée attendent trois gobelets et une ration qu’Allenna a partagée avec une précision inutile."), C("Lineva", "Elle soutient que couper le pain en trois parts égales améliore la victoire."), C("Allenna", "Je soutiens que tu avais déjà pris la plus grande."), N("Le silence qui suit n’exige ni médiation ni définition. Elles discutent d’une relève future qui vous inclut, puis d’un entraînement qui ne ressemble déjà plus tout à fait à une mission.")],
    choices: [
      choice("cross-la-07-toast", "Lever le gobelet aux deux villes qui ont tenu sans promettre davantage", [C("Allenna", "Aux actes vérifiés."), C("Lineva", "Et aux prochains, si personne ne se met à écrire un traité pendant qu’on boit." )], BOTH_LIGHT),
      choice("cross-la-07-rest", "Demander seulement où poser le troisième siège", [N("Lineva le pousse du pied. Allenna déplace sa ration pour faire de la place. La réponse tient dans ces deux gestes." )], { affection: 3, trust: 3, relationshipEffects: { allenna: { affection: 3, trust: 3 } } }),
      choice("cross-la-07-flirt", "Suggérer de tester leur coordination un jour sans armée autour", [C("Lineva", "Sur un terrain d’entraînement ?"), C("Allenna", "Ou dans un lieu où elle ne pourra pas prétendre que chaque détour était tactique."), N("Leurs regards restent sur vous un battement de plus que nécessaire." )], { affection: 2, desire: 4, relationshipEffects: { allenna: { affection: 2, desire: 4 } } }),
    ],
  },
];

export function crossSceneForStage(stage: number) {
  return LINEVA_ALLENNA_SCENES.find((scene) => scene.stage === stage);
}
