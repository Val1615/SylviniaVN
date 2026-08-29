import type { DialogueLine } from "./game-data";
import type { IntimacyMode, PlayerSex } from "./date-scenes";
import type { IntimacyRoute } from "./intimacy-routes";
import { polishIntimacyText } from "./intimacy-prose";

type RawLine = string | [speaker: string, text: string, mood?: string];
type LinevaMood = "joueuse" | "lente" | "passionnee";
type LinevaDateId = "date-lineva-ramparts" | "date-lineva-quarters";

export type LinevaDateApproach = {
  id: string;
  text: string;
  lines: DialogueLine[];
};

type MoodSeed = {
  id: LinevaMood;
  labels: Record<PlayerSex, string>;
  detail: string;
  opening: RawLine[];
  undressing: RawLine[];
  linevaDiscovery: RawLine[];
  reveal: Record<IntimacyMode, RawLine[]>;
  afterClimax: RawLine[];
  ending: RawLine[];
};

type SexBeat = {
  tenderDiscovery: RawLine[];
  suggestiveDiscovery: RawLine[];
  explicitDiscovery: RawLine[];
  tenderClimax: RawLine[];
  suggestiveClimax: RawLine[];
  explicitClimax: RawLine[];
  ellipse: RawLine[];
};

const MODES: IntimacyMode[] = ["tendre", "suggestif", "explicite", "ellipse"];
const SEXES: PlayerSex[] = ["femme", "homme", "intersexe"];

const lines = (raw: RawLine[], context: string): DialogueLine[] => raw.map((entry) => {
  const speaker = typeof entry === "string" ? "Narration" : entry[0];
  const text = typeof entry === "string" ? entry : entry[1];
  return {
    speaker,
    text: polishIntimacyText(text, { speaker, context }),
    mood: typeof entry === "string" ? undefined : entry[2],
  };
});

const HARBOR_SEEDS: MoodSeed[] = [
  {
    id: "joueuse",
    labels: {
      femme: "Prolonger le pari du fanal entre deux femmes qui refusent de céder la dernière provocation",
      homme: "Laisser Lineva transformer la réparation en défi physique et sensuel",
      intersexe: "Faire du vieux fanal un terrain de jeu adapté à vos deux corps",
    },
    detail: "Une intimité physique et joueuse, nourrie par la graisse du mécanisme, les paris du quai et l’humour très concret de Lineva.",
    opening: [
      "La trappe se referme sous vos pieds. Lineva écoute une seconde le brouhaha du quai, puis utilise votre manche pour effacer la trace de graisse qu’elle vous a laissée sur la joue.",
      ["Lineva", "Je pourrais prétendre que c’est un accident. Mais tu as vu mes mains avant de monter.", "smirk"],
      "Vous lui rendez la marque du pouce sous la pommette. Elle attrape votre poignet, examine le résultat dans la vitre du fanal et décide que l’affront exige une réponse immédiate.",
    ],
    undressing: [
      "Le premier baiser vous pousse contre la table des cartes de marée. Lineva rit lorsque la roue réparée fait vibrer les outils, puis retire votre manteau et le sien de l’établi avant qu’une clé ne vous tombe dessus.",
      "Sa chemise reste retroussée au-dessus des coudes. Vous ouvrez les premiers boutons pendant qu’elle défait votre ceinture, chacun essayant de faire perdre à l’autre la cadence sans jamais arracher un geste non attendu.",
      ["Lineva", "Celui qui fait tomber la lampe descend la rallumer nu. Je préfère annoncer les enjeux.", "smirk"],
    ],
    linevaDiscovery: [
      "Vous faites glisser la chemise de Lineva hors de ses épaules. Ses cicatrices apparaissent sans présentation solennelle : une ligne pâle près des côtes, la marque ronde d’un éclat au-dessus de la hanche et celle, plus ridicule, que le fameux tonneau a laissée au genou.",
      "Votre bouche choisit la cicatrice du tonneau. Lineva vous accuse de manquer de respect à l’histoire militaire, mais son rire se brise lorsque vos doigts suivent l’intérieur de sa cuisse.",
      ["Lineva", "Continue et je rétrograde le tonneau à titre posthume.", "smirk"],
    ],
    reveal: {
      tendre: ["Lineva vous attire avec elle sur les couvertures de veille. La lumière tournante traverse vos corps découverts, une fois claire, une fois sombre, tandis que votre jeu ralentit de lui-même.", ["Lineva", "Reste là. J’aime bien te voir revenir à chaque tour.", "thoughtful"]],
      suggestif: ["Sur les couvertures, Lineva se place à califourchon au-dessus de vous puis s’arrête pour laisser vos mains choisir où reprendre. Le fanal balaie sa peau nue et révèle à chaque passage une nouvelle trace de graisse, de sel ou de désir.", ["Lineva", "Tu regardes beaucoup pour quelqu’un qui prétendait vouloir gagner.", "smirk"]],
      explicite: ["Lineva s’agenouille nue sur les couvertures, une cuisse de chaque côté de vos hanches. La lumière du fanal glisse sur sa poitrine, son ventre et le désir visible entre ses jambes ; elle prend votre main, la conduit exactement là où la chaleur est la plus vive, puis la relâche pour que le geste suivant reste le vôtre.", ["Lineva", "Voilà le terrain. Maintenant, montre-moi ce que ton pari valait vraiment.", "smirk"]],
      ellipse: ["Lineva tire le rideau de maintenance devant la fenêtre. Vos silhouettes disparaissent du quai au moment où elle vous renverse sur les couvertures avec un rire victorieux.", ["Lineva", "La lampe reste debout. Pour le reste, aucun témoin fiable.", "smirk"]],
    },
    afterClimax: [
      "Le vieux mécanisme poursuit sa rotation. Lineva reste sur le côté, une jambe lourde passée sur les vôtres, le souffle encore irrégulier et le sourire dépourvu de toute tentative de dignité.",
      "Elle trouve sur votre peau une nouvelle marque de graisse, essaie de l’essuyer avec le drap et ne fait que l’étendre. Son rire revient plus bas, contre votre épaule.",
      ["Lineva", "Réparation réussie. Propreté tactiquement compromise.", "smirk"],
    ],
    ending: [
      "Les voix des marins montent depuis le quai avec le refrain du tonneau. Lineva ne se rhabille pas pour les faire taire. Elle se contente de frapper trois coups du talon contre le plancher, exactement sur la mesure.",
      ["Lineva", "Ils vont ajouter un couplet sur la lumière qui tourne. Je nierai tout, mais je veux l’entendre avant de décider s’il mérite une sanction.", "thoughtful"],
      "Elle garde votre main contre son ventre pendant que le fanal accomplit un nouveau tour complet.",
    ],
  },
  {
    id: "lente",
    labels: {
      femme: "Découvrir lentement la femme sous la chemise de travail, sans faire de ses cicatrices un récit obligé",
      homme: "Laisser Lineva guider une proximité lente où aucun de vos corps ne doit faire ses preuves",
      intersexe: "Construire une lenteur attentive aux gestes et aux appuis propres à vos deux corps",
    },
    detail: "Une intimité lente et vulnérable par les gestes : peu d’aveux, des pauses choisies, des mains que Lineva replace elle-même.",
    opening: [
      "Dans la chambre du fanal, Lineva pose son front contre le vôtre sans reprendre immédiatement le baiser. Sa main reste à votre taille ; son pouce suit le bord de votre vêtement, revient, puis s’arrête.",
      "Vous attendez. En bas, quelqu’un ferme un étal et les dernières pièces roulent dans une caisse. Lineva expire, lève votre main et la pose sous sa chemise contre la chaleur de son dos.",
      ["Lineva", "Là. Pas de question pour l’instant.", "thoughtful"],
    ],
    undressing: [
      "Vous ouvrez sa chemise bouton après bouton. Lineva défait les vôtres au même rythme, sans transformer cette symétrie en règle. Parfois l’une de ses mains s’immobilise ; elle la remet en mouvement lorsqu’elle le décide.",
      "Ses bottes rejoignent les vôtres près de la trappe. Son pantalon reste encore en place lorsqu’elle s’assied sur les couvertures et vous attire entre ses genoux pour un baiser qui ne cherche aucune étape suivante avant d’avoir fini d’exister.",
      ["Lineva", "La roue fait assez de bruit pour deux. On peut se taire.", "thoughtful"],
    ],
    linevaDiscovery: [
      "Lorsque le reste de ses vêtements glisse enfin, Lineva ne redresse pas les épaules pour présenter son corps. Elle s’allonge simplement, une main derrière la nuque, l’autre ouverte près de vous.",
      "Vous suivez son ventre, ses hanches et l’intérieur de ses cuisses avec la paume avant d’y poser la bouche. Elle vous guide une fois par les cheveux, relâche aussitôt et laisse son bassin répondre là où les mots s’arrêtent.",
      ["Lineva", "Oui. Garde cette lenteur.", "thoughtful"],
    ],
    reveal: {
      tendre: ["La lumière du fanal revient sur Lineva étendue contre vous. Elle ne cache ni les marques de l’armure ni les frissons qui les traversent ; votre main repose entre ses côtes et sa hanche, là où elle l’a elle-même placée."],
      suggestif: ["Lineva ouvre davantage les jambes sous la lumière tournante et vous ramène contre elle par la nuque. Son désir n’est ni annoncé ni dissimulé : il se lit dans la façon dont son bassin cherche votre cuisse et dont sa bouche refuse de quitter la vôtre."],
      explicite: ["Sous le passage lent du fanal, Lineva reste nue sur le dos, les jambes ouvertes autour de vous. Sa vulve est déjà humide ; elle pose deux de vos doigts contre elle, montre la pression désirée par un mouvement précis du bassin, puis vous regarde continuer sans détourner les yeux.", ["Lineva", "Comme ça. Ne transforme pas mon silence en hésitation.", "thoughtful"]],
      ellipse: ["La lumière tourne et emporte alternativement vos corps dans l’ombre. Lineva vous attire sur elle au passage suivant ; le récit reste du côté obscur de la vitre."],
    },
    afterClimax: [
      "Lineva demeure immobile assez longtemps pour que la lumière accomplisse plusieurs tours. Sa respiration soulève votre main contre ses côtes ; lorsqu’elle rouvre les yeux, elle ne cherche pas la fenêtre.",
      "Elle prend la couverture, la tire sur vos hanches et replace votre tête contre son épaule avec la même franchise que tous ses autres gestes.",
      ["Lineva", "Tu peux rester là sans parler. J’ai encore tout ce qu’il me faut.", "thoughtful"],
    ],
    ending: [
      "Le fanal éclaire le bassin, puis la mer, puis la chambre. Lineva compte les passages du regard sans que le compte ressemble à une alerte.",
      "Ses doigts suivent votre poignet et s’arrêtent sur votre pouls. Elle ferme les yeux avant le tour suivant.",
      ["Lineva", "Quand la lumière revient, sois encore là. Après, on verra.", "thoughtful"],
    ],
  },
  {
    id: "passionnee",
    labels: {
      femme: "Répondre à son désir direct avec toute la force que deux femmes choisissent de partager",
      homme: "Suivre Lineva dans une passion franche, physique et sans détour de commandement",
      intersexe: "Choisir ensemble les prises, les rythmes et la passion adaptés à vos anatomies",
    },
    detail: "Une intimité directe et passionnée où Lineva nomme ce qu’elle veut, reçoit des réponses nettes et ne confond jamais force avec autorité.",
    opening: [
      "À peine la trappe fermée, Lineva revient contre vous et saisit votre chemise à deux mains. Elle attend votre mouvement vers elle, puis vous embrasse avec assez de force pour faire grincer la table contre le mur.",
      ["Lineva", "Je te veux ici. Pas après un autre verre, pas après une meilleure phrase. Ici.", "determined"],
      "Votre réponse la fait sourire une seule seconde. Le baiser suivant efface le sourire sans diminuer la certitude.",
    ],
    undressing: [
      "Vos manteaux tombent sur l’escalier. Lineva ouvre votre haut, vous aide lorsque le tissu résiste et vous laisse faire sauter les boutons de sa chemise sans protéger l’uniformité de la rangée.",
      "Elle recule pour retirer son pantalon, vous regarde vous dévêtir et revient avant que vous ayez fini. Ses mains trouvent votre peau avec une impatience attentive, ralentissant uniquement lorsqu’un geste exige votre indication.",
      ["Lineva", "Dis-moi si tu veux moins. Pour davantage, rapproche-moi.", "determined"],
    ],
    linevaDiscovery: [
      "Vous la plaquez à votre tour contre le mur de bois, une main sous sa cuisse. Lineva utilise l’appui pour ouvrir ses jambes autour de vous sans vous laisser porter seul·e son poids.",
      "Votre bouche descend sur sa poitrine, son ventre puis plus bas. Sa respiration devient rauque ; elle demande une pression plus ferme et vous montre le rythme par des mouvements qui ne laissent aucune place au doute.",
      ["Lineva", "Oui. Là. Ne ralentis pas pour me regarder tenir.", "determined"],
    ],
    reveal: {
      tendre: ["La force du premier élan cède à une étreinte serrée sur les couvertures. Lineva garde votre visage entre ses mains tandis que le fanal découvre vos corps puis les rend à l’ombre."],
      suggestif: ["Lineva vous renverse sur les couvertures et vient se placer au-dessus de vous. Sa poitrine se soulève vite ; ses cuisses encadrent les vôtres et toute sa posture annonce une suite qu’elle vous laisse pourtant relancer."],
      explicite: ["Nue au-dessus de vous, Lineva ouvre les jambes et frotte son sexe humide contre votre cuisse avant de guider votre main entre elles. La lumière tournante révèle son plaisir sans l’adoucir : muscles tendus, poitrine offerte, bouche entrouverte sur votre nom. Elle vous tire ensuite contre elle pour choisir ensemble la position du mouvement suivant.", ["Lineva", "Je ne veux pas être ménagée. Je veux être écoutée quand je te demande plus.", "determined"]],
      ellipse: ["Lineva vous renverse sur les couvertures et tire le rideau d’un coup de pied. Le fanal continue sa garde pendant que le récit abandonne la sienne."],
    },
    afterClimax: [
      "Lineva retombe contre vous avec un souffle presque rieur, le cœur battant sous votre paume. Elle garde une cuisse entre les vôtres et ne cherche pas encore à retrouver une position plus présentable.",
      "Lorsque vous bougez pour atteindre l’eau, elle vous retient une seconde, boit à la même gourde puis la laisse rouler sans vérifier où elle s’arrête.",
      ["Lineva", "La lampe est debout. Nous aussi, approximativement. Je considère la soirée bien engagée.", "smirk"],
    ],
    ending: [
      "La lumière balaie les outils, les vêtements et vos corps encore mêlés. Lineva suit le désordre du regard, choisit de ne rien ramasser et revient mordre doucement votre épaule.",
      ["Lineva", "Le prochain tour est à moi. Le fanal, lui, peut se débrouiller seul.", "smirk"],
      "Elle reste visible dans la lumière suivante, sans armure et sans recul.",
    ],
  },
];

const QUARTERS_SEEDS: MoodSeed[] = [
  {
    id: "joueuse",
    labels: {
      femme: "Poursuivre la partie entre deux femmes qui cachent leurs cartes beaucoup moins bien que leur désir",
      homme: "Transformer l’as retrouvé sur votre peau en mise pour une partie plus physique",
      intersexe: "Inventer un jeu sensuel où chaque règle s’adapte à vos deux corps",
    },
    detail: "Une intimité physique et joueuse qui prolonge les cartes, la danse et le dîner raté sans remettre l’armure dans la chambre.",
    opening: [
      "Lineva récupère l’as posé près de votre hanche et le glisse dans votre col avec une application suspecte. La musique de quai recommence au phonographe, trop basse pour couvrir son rire.",
      ["Lineva", "Nouvelle règle : chaque carte retrouvée retire un vêtement. Le jeu est légèrement truqué en ma faveur.", "smirk"],
      "Vous sortez la carte et la glissez à votre tour sous sa chemise. Lineva regarde l’endroit, puis vous, et décide que cette contestation mérite une fouille complète.",
    ],
    undressing: [
      "La partie vous conduit autour de la table repoussée. Une carte tombe de sa manche avec la chemise ; deux autres apparaissent sous votre ceinture parce que Lineva les y a placées pendant le dernier baiser.",
      "Ses mains rient presque autant qu’elle : rapides, franches, capables de s’arrêter net lorsque vous changez la règle puis de reprendre ailleurs avec votre accord.",
      ["Lineva", "Si tu trouves le roi, tu choisis la position. Si tu trouves le valet, je nie avoir acheté ce jeu.", "smirk"],
    ],
    linevaDiscovery: [
      "Vous trouvez le roi sous le dernier vêtement de Lineva, posé contre sa hanche. Elle affirme que l’emplacement ne prouve aucune préméditation, puis s’allonge sur la table pour honorer une règle qu’elle vient elle-même d’inventer.",
      "Vous découvrez sa poitrine, son ventre et l’intérieur de ses cuisses entre les cartes éparpillées. Lineva tente encore une plaisanterie ; votre bouche plus bas lui en fait perdre la fin.",
      ["Lineva", "Garde le roi. Continue avec ta bouche.", "smirk"],
    ],
    reveal: {
      tendre: ["Lineva vous attire contre elle au pied de la table. Les cartes collent aux draps et à vos peaux ; elle en retire une de votre épaule avant de vous embrasser avec une douceur qui ne respecte plus aucune règle."],
      suggestif: ["Nue parmi les cartes, Lineva s’assied sur vos cuisses et glisse le roi entre vos corps avant de le laisser tomber. Ses hanches reprennent le rythme de la danse tandis que ses mains ouvrent l’espace dont vous avez besoin."],
      explicite: ["Lineva s’allonge nue sur les draps, une jambe repliée et l’autre ouverte contre la table. Les cartes encadrent sa vulve brillante de désir ; elle récupère le roi près de sa cuisse, vous le tend comme une invitation dérisoire puis guide votre bouche et vos doigts jusqu’au contact qu’elle réclame.", ["Lineva", "Tu as gagné la position. Fais-en quelque chose avant que je change les règles.", "smirk"]],
      ellipse: ["Lineva jette le paquet en l’air. Les cartes retombent autour de vos vêtements tandis qu’elle vous entraîne hors du champ du récit."],
    },
    afterClimax: [
      "Lineva reste au milieu du désordre, le dos contre le pied de la table et votre corps contre le sien. Une carte colle à sa poitrine ; elle la retourne et découvre le valet.",
      ["Lineva", "Je nie avoir acheté ce jeu.", "smirk"],
      "Son rire secoue encore son souffle. Elle pose le valet sur votre ventre comme si le point avait une importance véritable, puis laisse sa tête tomber contre votre épaule.",
    ],
    ending: [
      "Le phonographe gratte la fin du cylindre. Lineva rassemble trois cartes à portée de main, renonce devant les quarante-neuf autres et utilise la nappe comme couverture.",
      ["Lineva", "La prochaine partie se jouera avec des dés. Il est beaucoup plus difficile d’en cacher vingt dans une chemise.", "smirk"],
      "Elle garde pourtant le roi dans sa paume jusqu’à la clôture de la soirée.",
    ],
  },
  {
    id: "lente",
    labels: {
      femme: "Laisser la danse ralentir jusqu’à une découverte patiente du corps d’une autre femme",
      homme: "Suivre les gestes silencieux de Lineva sans transformer leur lenteur en fragilité",
      intersexe: "Trouver ensemble une lenteur où chaque anatomie garde ses propres besoins",
    },
    detail: "Une intimité lente où la vulnérabilité reste dans les pauses, le poids confié et les gestes précis, jamais dans un discours thérapeutique.",
    opening: [
      "Le cylindre recommence la danse de quai. Lineva ne repousse pas davantage les meubles ; elle place une main dans la vôtre, l’autre à votre taille et reprend le pas dans l’espace étroit laissé entre la table et le lit.",
      "Au lieu du tour brusque, elle reste contre vous. Son front touche le vôtre ; ses pieds cessent de suivre la musique avant le reste de son corps.",
      ["Lineva", "On peut rater la danse autrement.", "thoughtful"],
    ],
    undressing: [
      "Vous défaites sa chemise pendant qu’elle garde les mains à votre taille. Lineva regarde vos doigts, puis ouvre votre vêtement avec la même patience. Rien ne tombe avant d’avoir été posé sur le dossier de la chaise ou laissé volontairement au sol.",
      "Lorsqu’une ancienne cicatrice tire sous son épaule, elle change l’angle sans s’excuser. Vous déplacez votre appui ; elle vous remercie d’un baiser sous l’oreille plutôt que d’une explication.",
      ["Lineva", "Là, c’est mieux.", "thoughtful"],
    ],
    linevaDiscovery: [
      "Lineva s’assied au bord du lit, nue à l’exception d’une chaussette qu’elle a oubliée. Elle la voit en même temps que vous, jure et refuse de corriger le détail.",
      "Vous vous agenouillez entre ses jambes. Vos paumes remontent de ses mollets à ses cuisses ; sa main se pose sur votre nuque et vous arrête une seconde avant de vous rapprocher elle-même.",
      ["Lineva", "Maintenant.", "thoughtful"],
    ],
    reveal: {
      tendre: ["La musique s’achève sur Lineva étendue près de vous, une seule chaussette encore au pied et aucun rire pour la cacher. Vos mains restent posées là où vos corps se rejoignent avec le plus de calme."],
      suggestif: ["Lineva ouvre ses jambes et vous accueille contre elle, sans hâte. La lumière du port dessine ses cicatrices et le mouvement lent de ses hanches ; elle vous ramène chaque fois que la distance augmente."],
      explicite: ["Nue sur le lit défait, Lineva écarte les cuisses et vous montre de deux doigts le mouvement qu’elle aime autour de son clitoris. Son sexe humide répond déjà à la lenteur de votre main ; elle garde votre regard, pose ensuite sa paume sur votre corps et attend votre indication avant d’explorer à son tour.", ["Lineva", "On garde le temps qu’il faut. Pas celui que la chanson avait prévu.", "thoughtful"]],
      ellipse: ["La dernière note s’éteint. Lineva vous entraîne sur le lit avec une lenteur que le récit ne cherche pas à mesurer."],
    },
    afterClimax: [
      "Lineva reste sur le dos, votre main sous la sienne au milieu de son ventre. Son autre pied, toujours en chaussette, dépasse du drap ; elle le regarde sans avoir l’énergie de le défendre.",
      "Vous riez doucement. Elle tourne la tête vers vous, faussement sévère, puis son expression cède avant la menace.",
      ["Lineva", "Un mot sur cette chaussette et je nie toute la soirée. Mal, mais avec conviction.", "thoughtful"],
    ],
    ending: [
      "Le ragoût froid parfume encore la pièce. Lineva partage avec vous la gourde laissée près du lit et garde ensuite ses doigts mêlés aux vôtres.",
      "Aucun rapport ne sort du coffre. Aucun sujet grave ne remplace le silence.",
      ["Lineva", "La soirée ne sert toujours à rien. Elle tient donc exactement ses promesses.", "thoughtful"],
    ],
  },
  {
    id: "passionnee",
    labels: {
      femme: "Faire basculer la danse en désir franc entre deux femmes qui nomment chaque envie",
      homme: "Répondre sans détour à la passion de Lineva et choisir avec elle profondeur et rythme",
      intersexe: "Transformer la table, le lit et vos appuis en une passion adaptée à vos corps réels",
    },
    detail: "Une intimité directe et passionnée : Lineva demande, provoque, reçoit et reprend l’initiative sans transformer la chambre en champ de bataille.",
    opening: [
      "La danse s’arrête lorsque Lineva vous ramène brusquement contre elle. Sa cuisse reste entre les vôtres, une main ferme à votre taille ; l’autre retire l’aiguille du phonographe pour rendre la pièce au bruit de vos souffles.",
      ["Lineva", "J’ai assez dansé autour.", "determined"],
      "Elle vous embrasse, attend votre réponse physique, puis recule jusqu’à la table sans lâcher votre vêtement.",
    ],
    undressing: [
      "La chemise de Lineva s’ouvre contre le bord de la table. Elle retire la vôtre, fait glisser vos vêtements hors de ses appuis et pose chaque fois une question courte lorsque le geste suivant peut changer l’intensité.",
      "Vous répondez de la même façon. Bientôt, la nappe rejoint le sol, les assiettes sont à l’abri sur le coffre et Lineva est nue devant vous, les paumes posées à plat derrière elle.",
      ["Lineva", "La table tient. Viens vérifier le reste.", "determined"],
    ],
    linevaDiscovery: [
      "Vous prenez place entre ses jambes et mordez doucement la ligne de sa mâchoire. Lineva vous ramène par les hanches, guide une de vos mains sur sa poitrine et l’autre entre ses cuisses.",
      "Son désir mouille déjà vos doigts. Elle ne tente pas de contenir le mouvement qui la rapproche, vous indique plus vite, plus ferme, puis vous rend chaque caresse avec la même franchise.",
      ["Lineva", "Oui. Maintenant, ne me fais pas attendre pour une belle mise en scène.", "determined"],
    ],
    reveal: {
      tendre: ["L’élan se ralentit au bord du lit. Lineva garde vos deux mains contre elle et vous embrasse jusqu’à ce que la force devienne une chaleur continue plutôt qu’une urgence."],
      suggestif: ["Lineva s’allonge en travers du lit, nue, les jambes ouvertes vers vous. Elle vous montre l’endroit qu’elle veut sentir, puis tend la main vers votre propre désir sans quitter vos yeux."],
      explicite: ["Lineva s’allonge nue en travers du lit, les cuisses largement ouvertes et le bassin au bord du matelas. Son sexe luit sous la lumière du port ; elle prend votre main, presse vos doigts contre son clitoris puis plus bas, là où elle veut être remplie, avant d’ouvrir les bras pour vous attirer dans la position choisie ensemble.", ["Lineva", "Là. Je veux ton rythme, pas une démonstration.", "determined"]],
      ellipse: ["Lineva balaie les dernières cartes du lit, vous attire entre ses jambes et ferme le rideau sur la seule règle qui compte encore : chaque geste reste demandé."],
    },
    afterClimax: [
      "Lineva reste en travers du lit, une jambe pendante et le souffle encore rude. Elle vous attire sur sa poitrine, récupère assez d’air pour rire de la table déplacée puis abandonne la phrase avant sa conclusion.",
      "Vous lui donnez de l’eau. Elle boit, vous tend la gourde et essuie du pouce une trace de vin près de votre bouche.",
      ["Lineva", "Le dîner était une catastrophe. Je maintiens le reste du programme.", "smirk"],
    ],
    ending: [
      "Le port se reflète au plafond. Lineva ne ferme pas les rideaux ; elle tire seulement le drap sur vos hanches et reste nue contre vous dans la lumière mouvante.",
      ["Lineva", "La prochaine fois, tu cuisines. Ou nous sautons directement la partie dangereuse.", "smirk"],
      "Sa main descend de nouveau sous le drap, promesse physique d’une suite que la scène n’a pas besoin de résoudre.",
    ],
  },
];

const SEX_BEATS: Record<LinevaMood, Record<PlayerSex, SexBeat>> = {
  joueuse: {
    femme: {
      tenderDiscovery: ["Lineva glisse une cuisse entre les vôtres et sourit lorsque vos bassins trouvent naturellement le même balancement. Ses doigts apprennent la forme de votre poitrine, de votre ventre et de vos hanches sans presser la suite."],
      suggestiveDiscovery: ["Ses baisers descendent entre vos seins puis le long de votre ventre. Une main ouvre vos cuisses ; l’autre reste sous votre hanche pendant que sa bouche approche de votre vulve et que son sourire se transforme en souffle chaud."],
      explicitDiscovery: ["Lineva s’installe entre vos cuisses et écarte doucement les lèvres de votre vulve. Sa langue trouve d’abord votre clitoris par touches courtes, presque provocantes ; deux doigts recueillent votre humidité puis entrent lentement en vous lorsque votre bassin vient les chercher. Elle alterne le mouvement interne et la pression de sa bouche, attentive aux contractions qui lui indiquent quand accélérer."],
      tenderClimax: ["Le jeu devient une longue friction de cuisses et de ventres. Vous atteignez ensemble un sommet doux, davantage porté par vos baisers et la chaleur continue que par une course à gagner."],
      suggestiveClimax: ["Lineva maintient votre cuisse contre la sienne et reprend le rythme qui fait trembler vos deux bassins. Votre plaisir arrive sous ses doigts ; le sien suit lorsque votre main trouve exactement la même cadence sur elle."],
      explicitClimax: ["Vous ramenez Lineva au-dessus de vous et glissez votre cuisse contre sa vulve pendant que ses doigts restent en vous. Votre main travaille son clitoris humide ; elle reprend votre bouche, accélère ses mouvements et gémit contre votre langue. Votre orgasme contracte votre sexe autour de ses doigts. Lineva résiste quelques secondes de plus, puis jouit à son tour sous votre paume, ses hanches frottant sans retenue contre votre cuisse jusqu’à l’immobilité."],
      ellipse: ["Vos cuisses se mêlent, vos rires deviennent des souffles et la lumière ou la musique garde seule le compte de la partie."],
    },
    homme: {
      tenderDiscovery: ["Lineva pose votre main sur sa hanche et vient se frotter lentement contre votre érection encore couverte. Elle rit de votre réaction, puis embrasse votre torse avec une tendresse qui retire toute moquerie au jeu."],
      suggestiveDiscovery: ["Elle ouvre votre pantalon et referme sa main autour de votre sexe, d’abord par lentes provocations. Sa bouche suit le trajet de son pouce ; elle observe vos hanches répondre avant de vous libérer entièrement."],
      explicitDiscovery: ["Lineva s’agenouille entre vos jambes, prend votre pénis dressé dans sa main et en suit la longueur de la langue. Sa bouche se referme autour du gland, descend progressivement et accompagne chaque mouvement d’une paume ferme à la base. Elle varie la pression lorsqu’elle vous sent vous tendre, recule pour embrasser l’intérieur de votre cuisse puis vous reprend avec un sourire qui rend le défi aussi physique que le plaisir."],
      tenderClimax: ["Vous restez enlacés, votre érection entre vos ventres sans obligation de la transformer en preuve. Les frottements lents et les baisers vous conduisent à une détente chaude que Lineva accueille sans compter."],
      suggestiveClimax: ["Après avoir préparé la protection, Lineva vient s’asseoir sur vous et choisit une cadence qui prolonge le jeu. Votre plaisir monte sous ses mouvements ; le sien se lit dans ses cuisses qui se resserrent et sa main qui revient entre elles."],
      explicitClimax: ["Lineva déroule la protection préparée sur votre pénis et se place au-dessus de vous. Elle guide le gland contre son entrée humide, descend lentement jusqu’à vous accueillir entièrement puis remonte avec un sourire de défi. Vous soutenez ses hanches sans décider de sa cadence. Lorsqu’elle demande plus vite, vous accompagnez ses mouvements et caressez son clitoris. Elle jouit la première, contractions serrées autour de vous ; son rythme désordonné vous entraîne ensuite jusqu’à l’orgasme, maintenu profondément contre elle."],
      ellipse: ["Lineva transforme le dernier pari en une étreinte plus serrée. Le reste de la partie se joue hors du regard du récit."],
    },
    intersexe: {
      tenderDiscovery: ["Lineva découvre votre poitrine, votre ventre et les zones sensibles que vous lui indiquez sans chercher à leur imposer un nom. Elle transforme chaque réponse en nouvelle provocation douce, puis vous laisse inventer la suivante sur son corps."],
      suggestiveDiscovery: ["Ses mains suivent votre anatomie réelle : l’une soutient votre bassin, l’autre trouve le point externe ou la longueur sensible que vous lui avez montré. Sa bouche remplace ensuite ses doigts à l’endroit précis où votre souffle se brise."],
      explicitDiscovery: ["Lineva vous demande le geste exact, puis explore votre sexe sans modèle préfabriqué. Sa langue stimule la zone externe la plus sensible pendant que ses doigts caressent votre longueur ou entrent dans l’ouverture que vous lui avez offerte. Elle ajuste pression, profondeur et angle à vos mots, revient aux mouvements qui font contracter votre bassin et sourit chaque fois que votre corps déjoue ses provocations."],
      tenderClimax: ["Vos anatomies se rejoignent par les surfaces, les appuis et les frottements qui vous conviennent. Le plaisir arrive dans une étreinte où aucune forme n’a été supposée."],
      suggestiveClimax: ["Vous alternez les gestes indiqués, Lineva contre votre main puis vous contre sa bouche, jusqu’à ce que vos plaisirs se répondent sans exiger le même chemin."],
      explicitClimax: ["Vous choisissez ensemble frottement, stimulation interne ou pénétration selon vos possibilités et vos envies. Lineva soutient votre bassin pendant que vous gardez une main sur son clitoris ; l’autre guide la profondeur ou la pression sur votre propre sexe. Les mouvements deviennent plus rapides à votre demande. Votre orgasme arrive sous le contact qu’elle maintient sans changer d’angle ; vous prolongez aussitôt sur sa vulve jusqu’à ce qu’elle jouisse à son tour, serrée contre votre corps réel."],
      ellipse: ["Vous échangez les règles, les appuis et les rires jusqu’à ce que le jeu ne puisse plus être raconté sans trahir vos choix précis."],
    },
  },
  lente: {
    femme: {
      tenderDiscovery: ["Lineva suit votre poitrine puis votre ventre avec la paume entière. Sa cuisse trouve la vôtre, mais elle garde le mouvement lent, laissant vos bassins se rapprocher seulement quand vous l’attirez."],
      suggestiveDiscovery: ["Elle ouvre vos jambes et embrasse longtemps l’intérieur de vos cuisses. Ses doigts passent sur votre vulve sans insister, apprennent votre humidité puis reviennent à votre clitoris lorsque vous guidez sa main."],
      explicitDiscovery: ["Lineva reste allongée près de vous pendant que sa main descend entre vos cuisses. Elle écarte les lèvres de votre vulve, recueille lentement votre humidité et décrit un cercle régulier autour de votre clitoris. Un doigt entre en vous, puis un second après votre mouvement d’accord. Elle garde la profondeur stable et embrasse votre poitrine tandis que chaque contraction lui apprend le rythme que votre corps préfère."],
      tenderClimax: ["Vos cuisses se pressent l’une contre l’autre et la lenteur finit par traverser vos deux corps en vagues douces. Lineva reste front contre front jusqu’à ce que les dernières tensions se dissipent."],
      suggestiveClimax: ["Sa main poursuit la cadence sur votre sexe tandis que la vôtre répond entre ses cuisses. Vos plaisirs arrivent séparément, assez proches pour que chacune accompagne l’autre sans précipiter la fin."],
      explicitClimax: ["Lineva garde deux doigts en vous et sa paume contre votre clitoris, maintenant exactement la cadence demandée. Vous glissez votre propre main entre ses jambes, caressez sa vulve humide et entrez en elle à votre tour. Votre orgasme se construit lentement puis serre ses doigts en une série de contractions. Elle vous regarde revenir, guide votre pouce sur son clitoris et jouit ensuite sous vos gestes, sans détourner le visage ni reprendre une seule phrase."],
      ellipse: ["Vos mains apprennent lentement la chaleur de l’autre femme. Le temps cesse d’appartenir à la chanson ou au fanal."],
    },
    homme: {
      tenderDiscovery: ["Lineva pose votre érection contre son ventre et l’entoure sans hâte de sa main. Elle embrasse votre épaule, votre torse, puis revient à votre bouche chaque fois que votre souffle accélère."],
      suggestiveDiscovery: ["Sa main ouvre votre pantalon et suit lentement votre sexe. Elle embrasse le gland, s’arrête pour observer votre réponse puis reprend avec une bouche chaude et une cadence volontairement patiente."],
      explicitDiscovery: ["Lineva s’allonge à votre côté et referme ses doigts autour de votre pénis dressé. Son pouce étale l’humidité au gland avant que sa bouche le prenne. Elle descend lentement, maintient la base de sa main et laisse votre bassin choisir l’amplitude sans jamais vous presser. Lorsqu’elle revient respirer, ses lèvres suivent encore la longueur sensible et sa paume conserve le rythme qui vous empêche de perdre la montée."],
      tenderClimax: ["Votre sexe reste entre vos ventres pendant que vous vous embrassez. Les frottements lents suffisent à vous conduire au plaisir ; Lineva vous garde contre elle sans transformer l’instant en étape manquante."],
      suggestiveClimax: ["Avec la protection en place, vous entrez lentement en Lineva selon l’angle qu’elle guide. Elle garde ses jambes autour de vous et accompagne chaque mouvement jusqu’à ce que le plaisir vous traverse l’un après l’autre."],
      explicitClimax: ["Vous mettez la protection préparée puis laissez Lineva guider votre pénis vers son entrée. Vous pénétrez lentement, vous arrêtez lorsqu’elle vous serre et reprenez seulement quand ses hanches vous rappellent. Une main reste sous son bassin, l’autre stimule son clitoris. Son orgasme arrive dans des contractions qui resserrent sa vulve autour de vous ; vous gardez la même profondeur, puis cédez à votre tour sous les mouvements lents qu’elle continue jusqu’au dernier frisson."],
      ellipse: ["La lenteur passe de vos mains à vos hanches. Le récit s’arrête avant de donner à vos corps un rythme qu’ils n’ont pas choisi."],
    },
    intersexe: {
      tenderDiscovery: ["Lineva garde une paume sur votre ventre et l’autre sur la zone sensible que vous avez nommée. Elle découvre votre anatomie par les indications et les réactions plutôt que par une attente."],
      suggestiveDiscovery: ["Ses doigts puis sa bouche rejoignent le point externe, la longueur ou l’ouverture que vous lui offrez. Elle conserve une lenteur régulière et vous laisse déplacer sa main lorsqu’un autre angle devient préférable."],
      explicitDiscovery: ["Lineva explore votre sexe selon les mots échangés avant le contact. Elle caresse la partie externe ou la longueur sensible, ajoute un doigt dans l’ouverture désirée si vous la lui offrez et maintient une pression lente autour du point qui fait trembler votre ventre. Sa bouche reprend l’endroit le plus réactif ; ses mains soutiennent vos hanches sans enfermer leur mouvement."],
      tenderClimax: ["La chaleur monte selon un chemin propre à chacun de vos corps. Lineva accompagne votre plaisir, puis vous laisse accompagner le sien avec la même lenteur."],
      suggestiveClimax: ["Vous échangez les caresses sans chercher une symétrie artificielle. Le plaisir de l’un devient la respiration où l’autre trouve son propre rythme."],
      explicitClimax: ["Vous choisissez les gestes de pénétration, de frottement ou de stimulation externe qui conviennent à votre anatomie. Lineva maintient exactement le point demandé pendant que vos doigts travaillent son clitoris et entrent en elle selon ses indications. Votre orgasme arrive d’abord, sans qu’elle retire sa main ni précipite le suivant. Vous revenez sur sa vulve, gardez la lenteur qu’elle réclame et la sentez jouir contre vous en contractions profondes."],
      ellipse: ["Les gestes deviennent trop précis pour être résumés sans les trahir. Le récit laisse vos deux corps conserver leur propre vocabulaire."],
    },
  },
  passionnee: {
    femme: {
      tenderDiscovery: ["Lineva vous renverse puis s’immobilise au-dessus de vous, le front contre le vôtre. La force reste dans ses bras et ses cuisses, mais le mouvement se fait doux jusqu’à ce que vous la rameniez plus près."],
      suggestiveDiscovery: ["Sa bouche descend sur votre poitrine puis votre ventre. Elle écarte vos cuisses d’une main ferme, embrasse votre vulve à travers le tissu humide et l’écarte seulement lorsque vous soulevez les hanches."],
      explicitDiscovery: ["Lineva ouvre vos jambes et se place entre elles. Sa langue presse directement votre clitoris avant de descendre recueillir votre humidité ; ses doigts entrent en vous avec l’angle que votre main sur son poignet précise. Elle soutient vos hanches lorsqu’elles se soulèvent, reprend une cadence plus forte à votre demande et garde votre sexe ouvert sous sa bouche jusqu’à ce que vos réactions ne laissent plus de place à l’ironie."],
      tenderClimax: ["La passion se transforme en friction lente, poitrine contre poitrine et cuisses mêlées. Votre plaisir se répand sans heurt ; Lineva l’accueille dans un baiser prolongé."],
      suggestiveClimax: ["Vous pressez vos vulves l’une contre l’autre et trouvez une cadence vive, soutenue par vos mains sur les hanches. Lineva jouit contre votre cuisse avant de reprendre le mouvement qui vous fait céder à votre tour."],
      explicitClimax: ["Vous faites rouler Lineva sur le dos et placez votre cuisse contre sa vulve tandis que vos doigts entrent en elle. Elle conserve une main entre vos jambes, stimule votre clitoris avec une pression ferme et reprend vos mouvements par le bassin. Vous jouissez sous ses doigts, corps tendu contre le sien. Vos contractions font perdre à Lineva son dernier rythme ; vous accentuez alors la friction et la pénétration jusqu’à ce qu’elle jouisse à son tour, criant votre prénom sans chercher à le retenir."],
      ellipse: ["Vos deux forces se rencontrent, changent d’appui et deviennent désir avant que le récit puisse les réduire à un duel."],
    },
    homme: {
      tenderDiscovery: ["Lineva vous attire sur elle puis ralentit assez pour sentir votre érection contre son ventre. Sa main l’entoure, sa bouche reste contre la vôtre et la force du moment devient une chaleur soutenue."],
      suggestiveDiscovery: ["Elle libère votre sexe et le prend en main avec une franchise qui vous arrache un mouvement. Sa bouche descend ensuite, alterne langue et lèvres, puis vous laisse la relever lorsqu’une autre position devient urgente."],
      explicitDiscovery: ["Lineva referme une main ferme autour de votre pénis dressé, stimule le gland de son pouce puis le prend dans sa bouche. Elle descend plus profondément à chaque mouvement, garde la base serrée et suit vos hanches sans perdre le rythme. Lorsqu’elle recule, un filet de salive relie encore ses lèvres à votre sexe ; elle le rompt de la langue, vous regarde et reprend assez vite pour rendre votre souffle rauque."],
      tenderClimax: ["Vous vous pressez contre elle sans chercher la profondeur. Les frottements et les baisers conduisent votre plaisir ; Lineva vous garde enlacé lorsqu’il passe."],
      suggestiveClimax: ["Une fois protégés, vous choisissez ensemble un angle direct mais confortable. Lineva reçoit vos mouvements, les accélère de ses hanches et vient au plaisir sous votre main avant de vous entraîner à sa suite."],
      explicitClimax: ["Après avoir mis la protection, vous guidez votre pénis contre l’entrée humide de Lineva. Elle ouvre davantage les jambes et vous attire en elle jusqu’à la profondeur demandée. Vos mouvements deviennent francs, soutenus par ses mains sur vos hanches ; vous caressez son clitoris à chaque poussée. Lineva jouit en vous serrant fortement, son bassin continuant de vous réclamer. Vous maintenez l’angle, accélérez à sa demande puis atteignez l’orgasme profondément en elle, retenu contre son corps jusqu’au dernier spasme."],
      ellipse: ["Lineva choisit l’appui, vous choisissez le rythme suivant, et la passion ferme la porte au récit avant toute conclusion imposée."],
    },
    intersexe: {
      tenderDiscovery: ["Lineva utilise sa force pour vous rapprocher sans décider quel contact votre anatomie doit recevoir. Votre main déplace la sienne ; elle suit aussitôt et transforme l’indication en caresse assurée."],
      suggestiveDiscovery: ["Sa bouche et ses doigts rejoignent le point externe, la longueur ou l’ouverture indiquée. Elle augmente la pression à vos mots, soutient vos hanches et laisse votre corps définir la vigueur du mouvement."],
      explicitDiscovery: ["Lineva vous demande un mot bref pour la pression et un autre pour la profondeur, puis prend votre sexe entre sa bouche et ses mains selon sa forme réelle. Elle stimule le point externe ou la longueur sensible, ajoute une pénétration digitale si vous la désirez et maintient vos hanches lorsqu’elles viennent chercher plus. Chaque accélération vient de votre indication ; sa force sert uniquement à garder l’appui qui permet à votre plaisir de monter sans rupture."],
      tenderClimax: ["Vos corps se serrent selon les contacts qui leur conviennent. La passion ne perd rien en ralentissant et vous conduit chacun vers une détente entière."],
      suggestiveClimax: ["Vous échangez pression, frottement et profondeur sans attribuer un rôle fixe à votre anatomie. Le plaisir circule jusqu’à vous faire céder l’un après l’autre."],
      explicitClimax: ["Vous choisissez une combinaison de frottement, pénétration ou stimulation externe adaptée à vos corps. Lineva soutient l’appui et maintient sur votre sexe la pression exacte que vous avez demandée ; votre main stimule son clitoris tandis que l’autre entre en elle ou guide le contact de vos bassins. Votre orgasme vous traverse sous sa force attentive. Vous reprenez aussitôt sur sa vulve, augmentez le rythme à sa demande et la faites jouir contre vous sans hiérarchie entre vos plaisirs."],
      ellipse: ["La passion garde sa franchise tandis que les gestes s’adaptent à chaque appui. Le récit abandonne toute prétention à les prévoir."],
    },
  },
};

const SEEDS: Record<LinevaDateId, MoodSeed[]> = {
  "date-lineva-ramparts": HARBOR_SEEDS,
  "date-lineva-quarters": QUARTERS_SEEDS,
};

const DATE_APPROACHES: Record<LinevaDateId, LinevaDateApproach[]> = {
  "date-lineva-ramparts": [
    { id: "lineva-fanal-graisse", text: "Essuyer du pouce la graisse sur sa joue, puis goûter votre provocation sur sa bouche.", lines: lines(["Votre pouce traverse la trace noire. Lineva le suit des yeux, referme ses doigts autour de votre poignet et embrasse d’abord la pulpe tachée avant de venir chercher votre bouche.", ["Lineva", "Tu nettoies très mal. Recommence plus près.", "smirk"]], "lineva-date-harbor-approach") },
    { id: "lineva-fanal-cle", text: "Poser la clé du fanal dans sa paume et la laisser choisir ce qu’elle souhaite ouvrir ensuite.", lines: lines(["Lineva referme la main sur la clé, la pose à côté de son couteau et revient sans objet entre vous.", ["Lineva", "La trappe est fermée. Ma chemise, beaucoup moins. Je choisis celle-là.", "thoughtful"], "Elle prend votre main et la conduit au premier bouton."], "lineva-date-harbor-approach") },
    { id: "lineva-fanal-pari", text: "Parier que la lumière accomplira un tour avant qu’elle ne vous fasse perdre le fil.", lines: lines([["Lineva", "Pari stupide. J’accepte.", "smirk"], "Le faisceau quitte la fenêtre. Lineva vous embrasse, change d’appui puis mord doucement votre lèvre. Quand la lumière revient, vous avez oublié de compter depuis longtemps.", ["Lineva", "Je réclamerai mon gain plus tard. Plusieurs fois.", "smirk"]], "lineva-date-harbor-approach") },
  ],
  "date-lineva-quarters": [
    { id: "lineva-soiree-danse", text: "Reprendre le dernier pas de danse et laisser vos corps décider où la mesure se termine.", lines: lines(["Vous replacez sa main à votre taille et reprenez le tour dans l’espace étroit. Lineva vous ramène contre elle à la dernière mesure, puis refuse de créer la distance nécessaire au pas suivant.", ["Lineva", "La chorégraphie s’arrête ici. J’ai mieux.", "smirk"]], "lineva-date-quarters-approach") },
    { id: "lineva-soiree-as", text: "Récupérer l’as contre sa peau et proposer une règle que vous pourrez tricher ensemble.", lines: lines(["Vos doigts glissent sous sa chemise pour retrouver la carte. Lineva les emprisonne contre sa taille, déplace elle-même l’as plus haut et vous offre un sourire parfaitement coupable.", ["Lineva", "Il faut fouiller plus sérieusement. Règlement de Forthaven.", "smirk"]], "lineva-date-quarters-approach") },
    { id: "lineva-soiree-franche", text: "Lui dire que le dîner a raté et que votre désir, lui, n’a besoin d’aucune correction.", lines: lines([["{player}", "Le poisson est perdu. Je te veux quand même."], "Lineva baisse les yeux vers la casserole, puis vers votre bouche. Son rire bref laisse place à une franchise plus chaude.", ["Lineva", "Enfin un bilan utile. Viens ici.", "determined"]], "lineva-date-quarters-approach") },
  ],
};

function sexChapter(beat: SexBeat, mode: IntimacyMode, phase: "discovery" | "climax"): RawLine[] {
  if (mode === "ellipse") return beat.ellipse;
  if (phase === "discovery") {
    if (mode === "tendre") return beat.tenderDiscovery;
    if (mode === "suggestif") return beat.suggestiveDiscovery;
    return beat.explicitDiscovery;
  }
  if (mode === "tendre") return beat.tenderClimax;
  if (mode === "suggestif") return beat.suggestiveClimax;
  return beat.explicitClimax;
}

function routeChapters(dateId: LinevaDateId, seed: MoodSeed, sex: PlayerSex, mode: IntimacyMode): DialogueLine[][] {
  const beat = SEX_BEATS[seed.id][sex];
  const context = `lineva-${dateId}-${seed.id}-${sex}-${mode}`;
  return [
    lines(seed.opening, context),
    lines(seed.undressing, context),
    lines(sexChapter(beat, mode, "discovery"), context),
    lines(seed.linevaDiscovery, context),
    lines(seed.reveal[mode], context),
    lines(sexChapter(beat, mode, "climax"), context),
    lines(seed.afterClimax, context),
    lines(seed.ending, context),
  ];
}

export function linevaDateApproaches(dateId?: string): LinevaDateApproach[] | undefined {
  if (dateId !== "date-lineva-ramparts" && dateId !== "date-lineva-quarters") return undefined;
  return DATE_APPROACHES[dateId];
}

export function linevaDateIntimacyRoutes(dateId: string | undefined, sex: PlayerSex): IntimacyRoute[] {
  if (dateId !== "date-lineva-ramparts" && dateId !== "date-lineva-quarters") return [];
  return SEEDS[dateId].map((seed) => ({
    id: `${dateId}-${seed.id}-${sex}`,
    text: seed.labels[sex],
    detail: seed.detail,
    chapters: Object.fromEntries(MODES.map((mode) => [mode, routeChapters(dateId, seed, sex, mode)])) as Record<IntimacyMode, DialogueLine[][]>,
  }));
}

export function validateLinevaDateIntimacy(): { dates: number; combinations: number; routes: number; chapters: number } {
  let combinations = 0;
  let routes = 0;
  let chapters = 0;
  (Object.keys(SEEDS) as LinevaDateId[]).forEach((dateId) => {
    SEXES.forEach((sex) => {
      const entries = linevaDateIntimacyRoutes(dateId, sex);
      if (entries.length !== 3) throw new Error(`${dateId}/${sex}: trois humeurs intimes sont requises`);
      if (new Set(entries.map((entry) => entry.text)).size !== 3) throw new Error(`${dateId}/${sex}: les trois humeurs doivent être distinctes`);
      entries.forEach((entry) => {
        MODES.forEach((mode) => {
          const sequence = entry.chapters[mode];
          if (sequence.length !== 8 || sequence.some((chapter) => chapter.length === 0)) {
            throw new Error(`${entry.id}/${mode}: huit séquences substantielles sont requises`);
          }
          const words = sequence.flat().reduce((total, line) => total + line.text.trim().split(/\s+/u).length, 0);
          const minimum = mode === "explicite" ? 360 : 170;
          if (words < minimum) throw new Error(`${entry.id}/${mode}: ${words} mots, minimum ${minimum}`);
          chapters += sequence.length;
        });
      });
      combinations += 1;
      routes += entries.length;
    });
  });
  return { dates: Object.keys(SEEDS).length, combinations, routes, chapters };
}

validateLinevaDateIntimacy();
