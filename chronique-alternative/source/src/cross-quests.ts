import type { ChoiceData, DialogueLine, Effects } from "./game-data";
import type { AlphaHuntState } from "./alpha-hunt";

export const LINEVA_ALLENNA_SERIES_ID = "lineva-allenna";
export const LINEVA_ALLENNA_CORRESPONDENCE_DAYS = 29;

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
  return progress.stage === 3 && progress.letters.length === LINEVA_ALLENNA_LETTERS.length && day >= progress.stageStartedDay + LINEVA_ALLENNA_CORRESPONDENCE_DAYS;
}

export function nextCrossTimelineDay(progress: CrossQuestProgress, day: number) {
  if (progress.stage !== 3) return day;
  const pendingLetter = LINEVA_ALLENNA_LETTERS.find((letter) => !progress.letters.some((entry) => entry.id === letter.id));
  const target = pendingLetter
    ? progress.stageStartedDay + pendingLetter.dayOffset
    : progress.stageStartedDay + LINEVA_ALLENNA_CORRESPONDENCE_DAYS;
  return Math.max(day, target);
}

export function advanceCrossTimeline(progress: CrossQuestProgress, day: number): CrossQuestProgress {
  if (progress.stage !== 3) return progress;
  const receivedIds = new Set(progress.letters.map((entry) => entry.id));
  const dueLetters = LINEVA_ALLENNA_LETTERS
    .filter((letter) => !receivedIds.has(letter.id) && day >= progress.stageStartedDay + letter.dayOffset)
    .map((letter) => ({ id: letter.id, receivedDay: progress.stageStartedDay + letter.dayOffset, read: false }));
  const updated = dueLetters.length ? { ...progress, letters: [...progress.letters, ...dueLetters] } : progress;
  if (updated.letters.length === LINEVA_ALLENNA_LETTERS.length && day >= progress.stageStartedDay + LINEVA_ALLENNA_CORRESPONDENCE_DAYS) {
    return { ...updated, stage: 4, stageStartedDay: day };
  }
  return updated;
}

const BOTH_LIGHT: Effects = { affection: 2, trust: 2, relationshipEffects: { allenna: { affection: 2, trust: 2 } } };
const BOTH_FLIRT: Effects = { affection: 1, trust: 1, desire: 2, relationshipEffects: { allenna: { affection: 1, trust: 1, desire: 2 } } };

export const LINEVA_ALLENNA_SCENES: CrossQuestScene[] = [
  {
    id: "cross-la-01-allenna", stage: 0, title: "Le mauvais allié · Une piste extérieure", location: "akuhn", spot: "akuhn-war-room", lead: "allenna", cast: ["allenna"],
    intro: [
      N("La salle de guerre d’Akuhn’Nabad s’est vidée. Allenna reste debout devant trois pièces rapportées des Serres : un relevé de traces, un croquis de formation et un résidu enfermé sous verre noir."),
      N("Elle rapproche les documents avec la pointe de son couteau, puis retire aussitôt celui dont l’encre a bavé. Son geste tranche avant que son visage laisse paraître le doute."),
      C("Allenna", "Ces éléments prouvent une méthode. Ils ne donnent ni ordre, ni auteur, ni mobile."),
      C("Allenna", "Je vérifierai la piste. Je n’accepterai pas qu’on transforme cette vérification en accusation contre Amanea ou contre les Obscurcis.", "stern"),
      N("Elle referme elle-même le coffret de prélèvement et garde la clé dans son poing. Sa loyauté demeure entière ; son refus d’ignorer les faits l’est tout autant."),
      C("Allenna", "Les rapports impériaux se citent les uns les autres. Il me faut une lecture qui ne leur doive rien."),
      N("Forthaven possède des archives de siège, des morts qui marchent encore et une commandante peu disposée à ménager l’Empire. Allenna relève enfin les yeux vers vous."),
      C("Allenna", "Vous connaissez Lineva. Dites-moi si elle écoutera des faits apportés par la mauvaise personne.", "thinking"),
    ],
    choices: [
      choice("cross-la-01-information", "Proposer Forthaven comme source à confronter, sans la présenter comme une alliée acquise", [
        C("Allenna", "Une cité qui nous soupçonne cherchera l’erreur avant de chercher à me croire."),
        N("Elle reprend le rapport écarté, marque la tache d’encre et note la faiblesse dans la marge au lieu de la dissimuler."),
        C("Allenna", "Cette hostilité peut servir l’enquête. Elle ne décidera pas de sa conclusion.", "thinking"),
        N("Allenna tire une feuille vierge et commence elle-même la demande de rencontre."),
      ], { trust: 3 }),
      choice("cross-la-01-strategy", "Souligner l’intérêt commun face aux morts relevés dans les Serres et à Forthaven", [
        C("Allenna", "Un ennemi commun ouvre un passage. Il n’efface rien de ce qui nous sépare."),
        N("Son pouce reste posé sur le croquis des Serres tandis qu’elle examine la route maritime vers Forthaven."),
        C("Allenna", "J’irai avec une équipe réduite. Si Lineva refuse, nous repartirons avec nos informations intactes."),
        C("Allenna", "Si elle accepte, nous jugerons la coopération sur ses résultats."),
      ], { affection: 2, trust: 2 }),
      choice("cross-la-01-empire", "Rappeler que comparer deux lectures indépendantes sert aussi la loyauté d’Allenna", [
        C("Allenna", "Amanea ne m’a jamais demandé de préférer un rapport commode à un rapport exact."),
        N("La réponse vient sans hésitation. Allenna appose son sceau personnel, pas celui de la couronne, au bas du message."),
        C("Allenna", "Je confronterai les faits à Forthaven. Ensuite seulement, je saurai quelle question rapporter.", "stern"),
      ], { trust: 3 }),
    ],
  },
  {
    id: "cross-la-01-lineva", stage: 1, title: "Le mauvais allié · Une rencontre, rien de plus", location: "forthaven", spot: "forthaven-war-room", lead: "lineva", cast: ["lineva"],
    intro: [
      N("À Forthaven, une poutre neuve traverse la salle de guerre encore lézardée. Lineva vient de la caler avec l’épaule lorsque vous posez le billet d’Allenna sur la carte."),
      N("Elle essuie ses paumes sur son pantalon, boit une gorgée d’un café assez noir pour attaquer le gobelet et lit le message deux fois."),
      C("Lineva", "Des morts se lèvent dans nos rues. Des traces obscurcies apparaissent dans les Serres. Et vous me proposez d’inviter la commandante d’Amanea sur mes quais.", "determined"),
      N("Son index suit la ligne des Docks Brisés, s’arrête sur chaque accès encore habité, puis remonte vers la Ville Haute."),
      C("Lineva", "Aucune preuve ne les innocente. Aucune ne suffit davantage à les condamner, ce qui rend la situation particulièrement désagréable."),
      N("Elle appelle la responsable du quai, lui fait doubler une relève et réserve une passerelle extérieure avant même de vous demander la suite."),
      C("Lineva", "Je peux écouter une mauvaise alliée. Je refuse seulement qu’elle découvre nos faiblesses pendant que nous échangeons des politesses."),
      C("Lineva", "Donnez-moi une raison concrète de la laisser débarquer.", "stern"),
    ],
    choices: [
      choice("cross-la-01-observe", "Répondre qu’un contact direct permettra de confronter les informations et d’observer Allenna en action", [
        C("Lineva", "Une rencontre sur le quai extérieur. Six personnes de chaque côté, aucun accès aux réserves."),
        N("Elle déplace déjà les jetons sur la carte. Votre argument n’a pas créé son plan ; il lui a donné une raison de l’essayer."),
        C("Lineva", "Si elle apporte des faits, nous les vérifierons. Si elle apporte un discours, la marée la remportera avec son bateau."),
      ], { trust: 4 }),
      choice("cross-la-01-autonomy", "Refuser de laisser l’Empire choisir seul les témoignages que Forthaven peut entendre", [
        C("Lineva", "Voilà une mauvaise idée devenue difficile à jeter."),
        N("Elle renverse son café dans un seau, grimace devant le bruit qu’il fait et inscrit elle-même l’heure d’arrivée sur le registre du port."),
        C("Lineva", "Elle parlera devant les gens qui ont tenu ces quais. L’Empire n’écrira pas le résumé à notre place.", "smirk"),
      ], { affection: 2, trust: 3 }),
      choice("cross-la-01-certain", "Affirmer qu’Allenna ne représente aucun danger pour Forthaven", [
        N("Lineva cesse de toucher la carte. Son regard remonte lentement jusqu’au vôtre."),
        C("Lineva", "Vous n’en savez rien. Moi non plus."),
        C("Lineva", "Je la recevrai parce que le risque peut être contenu, pas parce que vous venez de le nier. La rencontre restera surveillée.", "stern"),
      ], { trust: -2 }),
      choice("cross-la-01-flirt", "Ajouter qu’elle pourra vous faire payer cette idée après la rencontre", [
        C("Lineva", "Vous venez de proposer une commandante obscurcie et votre propre punition dans la même minute."),
        N("Elle pose le billet contre votre poitrine, mais le sourire au coin de sa bouche survit au geste."),
        C("Lineva", "Commencez par accueillir votre invitée. Nous reparlerons du prix quand mes quais seront encore debout.", "smirk"),
      ], { desire: 2, affection: 1 }),
    ],
  },
  {
    id: "cross-la-02-quay", stage: 2, title: "Deux commandantes sur le même quai", location: "forthaven", spot: "forthaven-harbor", lead: "lineva", cast: ["lineva", "allenna"],
    intro: [
      N("Le navire obscurci accoste au quai extérieur sans bannière déployée. Allenna franchit seule la dernière passerelle ; derrière elle, six soldats attendent encore l’autorisation de poser le pied à terre."),
      N("Lineva l’accueille entre deux équipes de débardeurs. Aucun tapis, aucun officier d’apparat : seulement du sel, des marteaux et les cloches qui comptent les rues condamnées."),
      C("Lineva", "Ici, la peste a des visages. Certaines familles les reconnaissent encore quand ils reviennent cogner aux portes."),
      C("Allenna", "Je ne leur demanderai ni oubli ni pardon au nom d’un peuple entier. J’apporte des faits, des combattants et trente jours de mon commandement."),
      N("Lineva prend le dossier tendu, en vérifie le poids puis le passe à la responsable du quai sans l’ouvrir devant les soldats."),
      C("Lineva", "Trente jours, c’est assez long pour causer beaucoup de dégâts."),
      C("Allenna", "C’est également assez long pour rendre les résultats difficiles à falsifier."),
      N("Allenna propose une présence réduite et des observations partagées. Lineva retire les réserves, les quartiers habités et les souterrains de la carte commune. Elles discutent directement, se coupent deux fois et ne vous demandent d’intervenir qu’au moment de fixer la règle vérifiable."),
    ],
    choices: [
      choice("cross-la-02-ledger", "Faire consigner chaque accès et chaque information transmise dans un registre commun", [
        C("Allenna", "Deux copies, deux sceaux, une heure inscrite pour chaque ajout."),
        C("Lineva", "Et des mots lisibles par quelqu’un qui n’a pas grandi dans une chancellerie."),
        N("Allenna rature elle-même le premier intitulé, trop impérial au goût de Lineva, puis lui tend la plume."),
        C("Lineva", "Marché conclu. Mara gardera notre copie ; choisissez qui aura le courage de garder la vôtre.", "smirk"),
      ], BOTH_LIGHT),
      choice("cross-la-02-patrol", "Proposer des patrouilles mixtes hors des positions les plus sensibles", [
        C("Lineva", "Mes gens choisissent les rues. Les vôtres annoncent leurs capacités avant le départ."),
        C("Allenna", "La décision revient à la personne qui voit le danger en premier. Le compte rendu suivra, s’il reste utile."),
        N("Lineva jauge Allenna une seconde, puis appelle deux responsables d’équipe et leur fait former les premières paires."),
        C("Lineva", "On jugera les actes là où ils ont lieu."),
      ], BOTH_LIGHT),
      choice("cross-la-02-command", "Donner à chacune un droit de retrait immédiat si une limite convenue est franchie", [
        C("Allenna", "Aucun retrait n’exigera d’aveu ni de justification immédiate."),
        C("Lineva", "La personne qui le demande ramène tout le monde. Les explications viendront derrière une porte fermée."),
        N("Elles se serrent l’avant-bras. La prise ressemble moins à une promesse qu’à une règle qu’elles comptent faire respecter."),
        C("Allenna", "J’accepte."),
      ], BOTH_LIGHT),
      choice("cross-la-02-flirt", "Observer que trente jours révéleront surtout laquelle supporte le moins d’avoir tort", [
        C("Lineva", "Elle."),
        C("Allenna", "Cette réponse fournit déjà un élément de comparaison."),
        N("Lineva souffle un rire. Allenna autorise enfin ses soldats à descendre et lui laisse volontairement le premier pas sur le quai."),
        C("Lineva", "Venez. Je vais vous montrer tout ce que votre plan oublie encore.", "smirk"),
      ], BOTH_FLIRT),
    ],
  },
  {
    id: "cross-la-04-silence", stage: 4, title: "Le silence", location: "forthaven", spot: "forthaven-harbor", lead: "lineva", cast: ["lineva", "allenna"],
    intro: [
      N("Trois jours passent sans billet de Forthaven. Le premier bateau dérive au large avec ses cordages tranchés ; le suivant apporte des blessés et une seule phrase : la ville basse ne répond plus."),
      N("Quand votre embarcation atteint enfin la côte, les Docks Brisés brûlent jusque dans l’eau. Des cloches courtes appellent les civils vers la Ville Haute tandis qu’un grondement irrégulier remonte du Vieux Port."),
      N("La rampe principale est perdue. Une marchande tire deux enfants par la main ; des porteurs poussent une charrette de bandages ; plus loin, une patrouille de morts répète le même circuit entre les maisons effondrées."),
      N("Vous ne possédez ni la force de Lineva ni les techniques d’Allenna. La ville offre pourtant trois passages : le rythme de la ronde, les entrepôts ouverts sur l’arrière et la charrette trop lourde qui bloque une venelle."),
      N("Au-dessus de la fumée, une cloche de Forthaven sonne deux fois. Une lueur violette lui répond depuis les remparts. Elles tiennent encore."),
    ],
    choices: [
      choice("cross-la-04-observe", "Observer deux rondes complètes avant de traverser derrière les porteurs", [
        N("La patrouille tourne la tête au même coup de cloche. Vous attendez le second passage, prévenez les porteurs et traversez dans leur sillage sans rompre leur cadence."),
        N("Une morte s’écarte soudain de sa boucle ; un trait violet frappe le pavé devant elle et lui rend sa trajectoire. Allenna a vu le danger depuis le rempart."),
        N("Vous gagnez la Place du Marché avec le groupe. Là-haut, les ordres brefs de Lineva répondent aux signaux obscurcis."),
      ], { stats: { lucidite: 1 } }),
      choice("cross-la-04-detour", "Contourner les docks par les entrepôts effondrés", [
        N("Le premier entrepôt n’offre qu’un mur brûlant. Le second a perdu son toit, mais ses poutres cachent la venelle aux regards de la horde."),
        N("Vous progressez avec trois habitants qui connaissent encore les portes intérieures. Chacun attend que le précédent ait franchi les gravats avant d’avancer."),
        N("Le détour vous dépose au Quartier des Ateliers. Une équipe mixte couvre déjà l’escalier vers la Ville Haute sans demander d’où vous venez."),
      ], { stats: { sangFroid: 1 } }),
      choice("cross-la-04-help", "Aider la porteuse à dégager sa charrette, puis suivre son groupe", [
        N("Vous poussez avec elle pendant que les deux enfants tirent les bandages hors d’une roue brisée. La charrette bouge juste assez pour libérer la venelle."),
        N("Une équipe descend du rempart, prend les caisses et répartit leur poids sans discours. Vous suivez la porteuse jusqu’à la rampe, une main encore crispée sur le bois."),
        N("Personne ne vous acclame. Une personne de plus, plusieurs caisses et deux enfants atteignent simplement la Ville Haute."),
      ], { affection: 1, relationshipEffects: { allenna: { affection: 1 } } }),
    ],
  },
  {
    id: "cross-la-05-high-city", stage: 5, title: "La ville haute tient", location: "forthaven", spot: "forthaven-ramparts", lead: "lineva", cast: ["lineva", "allenna"],
    intro: [
      N("Sur les remparts, les capes de Forthaven et les armures obscurcies occupent les mêmes créneaux. Les munitions montent par une chaîne commune ; les blessés redescendent vers l’infirmerie qu’Allenna a fait installer derrière la seconde porte."),
      N("Lineva vous attrape par l’avant-bras dès votre arrivée, vérifie d’un regard la suie sur vos vêtements et vous pousse un gobelet d’eau dans la main."),
      C("Lineva", "Bon moment pour revenir. Trois rues plus tôt et je vous aurais confié à quelqu’un de beaucoup moins poli.", "smirk"),
      C("Allenna", "La route civile a tenu. J’avais évalué sa perte comme notre risque principal."),
      C("Lineva", "Elle veut dire qu’elle a déplacé la moitié de son dispositif dès que la première cloche a menti."),
      N("Allenna serre un dernier bandage autour du bras d’une combattante, lui ordonne de descendre et vient replacer deux poids sur la carte. Lineva lui cède la place sans interrompre son propre compte des rues."),
      C("Allenna", "Les morts cessent parfois de poursuivre une cible proche pour rejoindre une convergence plus lointaine."),
      C("Lineva", "Quelque chose les rappelle. Ça occupe plusieurs rues et ça se déplace sous les toits effondrés."),
      N("Lineva connaît chaque passage praticable. Allenna a relevé les intervalles d’énergie. Elles vous tendent les rapports afin que vous superposiez les deux séries pendant qu’elles préparent déjà la descente."),
    ],
    choices: [
      choice("cross-la-05-pattern", "Comparer les rondes autour des cinq quartiers détruits", [
        N("Les itinéraires paraissent d’abord indépendants. Allenna pose un fil sur chaque changement de direction ; Lineva retire les rues où les morts n’auraient jamais pu passer."),
        C("Allenna", "Elles convergent par vagues, même lorsqu’une cible plus proche devrait les détourner."),
        C("Lineva", "Alors nous suivons la prochaine vague jusqu’à son centre. Je choisis les passages ; tu comptes les écarts."),
        C("Allenna", "Départ dans six minutes."),
      ], BOTH_LIGHT),
      choice("cross-la-05-energy", "Superposer les pics d’énergie aux déplacements signalés", [
        N("Les heures ne correspondent pas parfaitement. Allenna décale le premier rapport ; Lineva reconnaît aussitôt la cloche qui avait sonné en retard pendant l’évacuation."),
        C("Allenna", "Quatre pics contigus. Une empreinte unique, masquée par les bâtiments."),
        C("Lineva", "Une créature assez grande pour occuper un pâté de maisons. Ça manquait à la journée.", "smirk"),
        N("Elle roule déjà la carte et la glisse sous son bras."),
      ], BOTH_LIGHT),
      choice("cross-la-05-route", "Préparer une lecture de carte pendant qu’elles avancent ensemble", [
        C("Lineva", "Nous descendons toutes les deux. La carte nous donnera la route, pas une troisième lame."),
        C("Allenna", "Chaque frappe d’observation provoquera une réaction. Notez-la ; nous confirmerons sa forme sur le terrain."),
        N("Lineva marque la Ville Haute comme point de départ. Allenna place les patrouilles venues du bassin et vous confie les deux jetons qui les représenteront en mouvement."),
        C("Lineva", "Quand vous ouvrez un passage, nous l’exploitons. Quand il se referme, nous en trouvons un autre."),
      ], BOTH_LIGHT),
    ],
  },
  {
    id: "cross-la-07-after", stage: 7, title: "Après la bataille", location: "forthaven", spot: "forthaven-war-room", lead: "lineva", cast: ["lineva", "allenna"],
    intro: [
      N("La horde n’a pas disparu, mais sa convergence est brisée. Dans la salle de guerre, la table porte de nouvelles entailles, trois gobelets et un pain qu’Allenna vient de partager avec une précision presque provocante."),
      C("Lineva", "Elle soutient que trois parts égales améliorent la victoire."),
      C("Allenna", "Je soutiens que tu avais déjà choisi la plus grande."),
      N("Lineva échange les morceaux pendant qu’Allenna boit dans son gobelet. Le geste déclenche une brève lutte de poignets, gagnée par Allenna lorsque Lineva préfère sauver le pain."),
      C("Lineva", "Victoire administrative. Profite-en."),
      C("Allenna", "Je compte surtout profiter du terrain que tu m’as promis."),
      N("Sans vous consulter, elles fixent un prochain entraînement à Forthaven, un échange mensuel de relevés et une visite de Lineva dans les quartiers ordinaires d’Akuhn’Nabad. Leur amitié a déjà son calendrier, ses disputes et ses projets."),
      N("Lineva pousse le troisième siège de votre côté. Allenna déplace sa ration pour faire de la place ; toutes deux vous regardent, cette fois, avec une invitation qui vous appartient aussi."),
    ],
    choices: [
      choice("cross-la-07-toast", "Lever le gobelet aux deux villes qui ont tenu sans promettre davantage", [
        C("Allenna", "Aux actes vérifiés, et à ceux qu’il reste à accomplir."),
        C("Lineva", "Aux prochains, tant que personne ne rédige un traité pendant qu’on boit."),
        N("Les trois gobelets se heurtent. Allenna garde déjà le prochain rapport ; Lineva garde la date de leur revanche. Rien n’exige une promesse plus vaste."),
      ], BOTH_LIGHT),
      choice("cross-la-07-rest", "Prendre le troisième siège et partager le pain avec elles", [
        N("Vous vous asseyez entre le mur rayé et leurs deux épaules. Lineva vous rend le morceau disputé ; Allenna en coupe un autre et le pose devant elle sans commentaire."),
        C("Lineva", "Ne vous habituez pas au calme. Elle a réservé le terrain de demain à l’aube."),
        C("Allenna", "Tu as demandé une revanche."),
        N("Leur discussion repart au-dessus de votre gobelet. Cette fois, vous en faites partie sans avoir à la conduire."),
      ], { affection: 3, trust: 3, relationshipEffects: { allenna: { affection: 3, trust: 3 } } }),
      choice("cross-la-07-flirt", "Suggérer de tester leur coordination un soir sans armée autour", [
        C("Lineva", "Sur un terrain d’entraînement ?", "smirk"),
        C("Allenna", "Ou dans un lieu où elle ne pourra pas attribuer chaque détour à la tactique."),
        C("Lineva", "Tu as préparé cette réponse."),
        C("Allenna", "J’ai préparé plusieurs possibilités."),
        N("Le défi qu’elles échangent reste celui de deux amies. Les deux regards qui reviennent vers vous portent, eux, une proposition nettement moins militaire."),
      ], { affection: 2, desire: 4, relationshipEffects: { allenna: { affection: 2, desire: 4 } } }),
    ],
  },
];

export function crossSceneForStage(stage: number) {
  return LINEVA_ALLENNA_SCENES.find((scene) => scene.stage === stage);
}
