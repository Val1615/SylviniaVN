import type { DialogueLine } from "./game-data";
import type { IntimacyMode, PlayerSex } from "./date-scenes";
import type { IntimacyRoute } from "./intimacy-routes";

export type RemeriiIntimacyContext = "date-remerii-lanterns" | "date-remerii-observatory" | "home-remerii";
export type RemeriiIntimacyPhase = "approach" | "undressing" | "naked-reveal" | "partner-discovery" | "remerii-discovery" | "preliminaries" | "intensification" | "climax" | "afterglow" | "ending";
export type RemeriiDateApproach = { id: string; text: string; lines: DialogueLine[] };

type BinaryPlayerSex = Extract<PlayerSex, "femme" | "homme">;
type RemeriiMood = "complice" | "attentive" | "elan";
type RawLine = string | readonly [speaker: "Remerii" | "{player}", text: string, mood?: "calm" | "neutral" | "smirk" | "strict"];
type AuthoredChapter = { all: RawLine[] } | Record<IntimacyMode, RawLine[]> | { known: RawLine[]; unknown: RawLine[] };
type AuthoredScene = {
  id: string;
  context: RemeriiIntimacyContext;
  sex: BinaryPlayerSex;
  mood: RemeriiMood;
  text: string;
  detail: string;
  chapters: AuthoredChapter[];
};

const PHASES: RemeriiIntimacyPhase[] = ["approach", "undressing", "naked-reveal", "partner-discovery", "remerii-discovery", "preliminaries", "intensification", "climax", "afterglow", "ending"];
const MODES: IntimacyMode[] = ["tendre", "suggestif", "explicite", "ellipse"];
const CONTEXTS: RemeriiIntimacyContext[] = ["date-remerii-lanterns", "date-remerii-observatory", "home-remerii"];
const SEXES: BinaryPlayerSex[] = ["femme", "homme"];

// Ces aides ne produisent aucune prose : elles rangent des passages écrits à
// la main, puis sélectionnent uniquement le réglage de visibilité demandé.
const A = (...all: RawLine[]): AuthoredChapter => ({ all });
const V = (tendre: RawLine[], suggestif: RawLine[], explicite: RawLine[], ellipse: RawLine[]): AuthoredChapter => ({ tendre, suggestif, explicite, ellipse });
const K = (known: RawLine[], unknown: RawLine[]): AuthoredChapter => ({ known, unknown });

const dialogueLines = (raw: RawLine[]): DialogueLine[] => raw.map((entry) => typeof entry === "string"
  ? { speaker: "Narration", text: entry }
  : { speaker: entry[0], text: entry[1], mood: entry[2] });

export const REMERII_INTIMACY_OPENINGS: Record<RemeriiIntimacyContext, DialogueLine[]> = {
  "date-remerii-lanterns": dialogueLines([
    "Le dernier service se termine sur la terrasse. Remerii ne prend pas l'escalier : elle ouvre, derrière l'arche voisine, un petit salon réservé aux convives qui souhaitent prolonger leur soirée. Les panneaux ajourés laissent voir les lanternes, mais dérobent entièrement la pièce aux tables et aux galeries.",
    ["Remerii", "J'avais demandé cet espace au cas où nous aurions encore quelque chose à nous dire. Je reconnais avoir volontairement sous-estimé la question.", "smirk"],
    "Elle ferme le panneau sans tirer les rideaux sur la ville. La même lumière dorée passe entre les motifs du bois lorsqu'elle revient vers vous et pose le billet de réservation près de ses gants.",
    ["Remerii", "Nous pouvons repartir. Ou rester ici, sans public et sans prétendre que ce dîner m'a laissé indifférente.", "calm"],
  ]),
  "date-remerii-observatory": dialogueLines([
    "Remerii remet le capuchon sur la lunette, éteint la lampe de lecture et verrouille l'accès de votre galerie. L'observatoire ne change pas de fonction pour autant : le ciel reste ouvert au-dessus des arches et les instruments couverts demeurent autour de vous.",
    "Elle étend la couverture sur le large tapis d'observation, à distance du trépied, puis s'assied contre la banquette basse sans vous lâcher la main.",
    ["Remerii", "Nous étions venus regarder quelque chose de lointain. J'ai, depuis, une préférence beaucoup plus proche.", "calm"],
    "Elle attend votre mouvement. Quand vous vous penchez vers elle, sa bouche rencontre la vôtre avec une lenteur qui rend toute autre explication inutile.",
  ]),
  "home-remerii": dialogueLines([
    "La dernière manche reste inachevée. Remerii empile les cinq jetons, renverse les deux gobelets pour montrer qu'ils sont vides, puis abandonne la partie au milieu de votre table.",
    "Sa cape et son bracelet occupent déjà une place dans votre logis. Elle regarde ce petit désordre, retire une épingle de ses cheveux et la pose près du signet qu'elle vous a offert.",
    ["Remerii", "Je pourrais rentrer maintenant. Je préférerais découvrir jusqu'où va cette soirée lorsqu'aucun de nous ne lui impose de programme.", "smirk"],
    "Elle vient à vous sans attendre que la maison ressemble à un décor préparé. Son baiser commence dans le salon, au milieu des tasses et des jetons oubliés.",
  ]),
};

export const REMERII_INTIMACY_APPROACHES: Record<RemeriiIntimacyContext, RemeriiDateApproach[]> = {
  "date-remerii-lanterns": [
    { id: "rem-lantern-int-complice", text: "Faire glisser le billet vers elle et lui demander ce qu'elle avait réellement réservé", lines: dialogueLines(["Vous poussez le billet du bout du doigt. Remerii le retient sous sa paume, parfaitement sérieuse pendant une seconde.", ["Remerii", "Une table, un salon et le droit de vous répondre sans témoin. Le reste n'était pas compris dans le prix.", "smirk"], ["{player}", "Alors improvisons le supplément."], "Son rire se perd contre votre bouche. Elle vous attire par le col et transforme aussitôt votre provocation en promesse tenue."]) },
    { id: "rem-lantern-int-attentive", text: "Prendre sa main et lui laisser le temps de franchir elle-même la dernière distance", lines: dialogueLines(["Vous retournez sa main dans la vôtre sans tirer Remerii vers vous. Son pouce suit une fois votre paume ; ses épaules s'abaissent légèrement.", ["Remerii", "Vous rendez l'attente beaucoup plus troublante que je ne l'avais prévu.", "calm"], "Elle se rapproche de son propre mouvement, pose votre main à sa taille et vous embrasse sans hâte, jusqu'à ce que sa retenue devienne une manière plus précise de vous désirer."]) },
    { id: "rem-lantern-int-elan", text: "Lui dire sans détour que vous la désirez ici, maintenant", lines: dialogueLines([["{player}", "J'ai envie de vous. Ici. Maintenant."], "Remerii vous fixe, puis fait glisser le verrou du panneau derrière elle.", ["Remerii", "Voilà une formulation qui ne réclame aucune correction.", "strict"], "Elle revient d'un pas franc, prend votre visage entre ses mains et vous embrasse avec une impatience jusque-là retenue sous toute son élégance."]) },
  ],
  "date-remerii-observatory": [
    { id: "rem-stars-int-complice", text: "Lui faire remarquer que la lunette n'est plus du tout orientée vers le sujet intéressant", lines: dialogueLines([["{player}", "Votre instrument vise le mauvais côté de la galerie."], "Remerii jette un regard au tube couvert, puis à votre bouche.", ["Remerii", "L'instrument est au repos. L'observatrice, beaucoup moins.", "smirk"], "Elle vous fait basculer doucement sur la couverture, satisfaite de vous avoir laissé une seconde entière pour goûter votre propre plaisanterie."]) },
    { id: "rem-stars-int-attentive", text: "Vous installer près d'elle et attendre que son silence trouve son geste", lines: dialogueLines(["Vous vous asseyez assez près pour que vos jambes se touchent sous la couverture. Remerii suit votre profil, lève la main, puis la pose sur votre joue.", ["Remerii", "Restez comme cela. Je n'hésite pas ; je prends le temps de vous regarder.", "calm"], "Son premier baiser est léger. Le second dure davantage, et sa main descend d'elle-même jusqu'à votre poitrine."]) },
    { id: "rem-stars-int-elan", text: "La ramener contre vous avant que la nuit refroidisse davantage", lines: dialogueLines(["Vous tirez doucement la couverture autour de Remerii et la rapprochez par la taille. Elle se laisse venir, puis prend aussitôt l'initiative du baiser.", ["Remerii", "J'allais proposer exactement cela avec davantage de mots. Votre version est meilleure.", "smirk"], "Elle vous pousse sur le tapis, s'installe au-dessus de vous et abandonne le ciel à lui-même."]) },
  ],
  "home-remerii": [
    { id: "rem-home-int-complice", text: "Cacher le dernier jeton contre vous et lui proposer de venir le reprendre", lines: dialogueLines(["Vous dérobez le dernier jeton avant qu'elle le range. Remerii suit votre main et l'endroit où elle disparaît sous votre vêtement.", ["Remerii", "Cette règle n'existait pas.", "smirk"], ["{player}", "Vous m'avez appris qu'on pouvait les changer."], "Elle vient chercher sa mise entre deux baisers, et oublie bientôt de prétendre que le jeton demeure son objectif."]) },
    { id: "rem-home-int-attentive", text: "Lui offrir votre place favorite et vous asseoir tout près", lines: dialogueLines(["Vous lui montrez l'endroit où vous vous installez lorsque la maison est calme. Remerii s'y assied, puis soulève la couverture pour vous faire une place contre elle.", ["Remerii", "Je commence à comprendre pourquoi vous gardez ce côté.", "calm"], "Vous échangez un baiser, puis un autre. Elle défait elle-même l'attache de votre col et laisse la soirée avancer au rythme de vos mains."]) },
    { id: "rem-home-int-elan", text: "L'attirer contre le premier meuble assez proche et cesser de différer", lines: dialogueLines(["Vous la ramenez contre vous avant qu'elle puisse reprendre sa tasse. Remerii la pose à l'aveugle, vérifie seulement qu'elle tient, puis saisit votre chemise.", ["Remerii", "Si ce meuble cède, vous assumerez l'explication demain.", "smirk"], ["{player}", "Demain."], "Le mot lui plaît. Elle vous embrasse plus fort et vous conduit vers la pièce où vous pourrez oublier le reste de la maison."]) },
  ],
};

export const REMERII_INTIMACY_ENDINGS: Record<RemeriiIntimacyContext, DialogueLine[]> = {
  "date-remerii-lanterns": dialogueLines(["Vous rajustez vos vêtements dans le petit salon. Au-dehors, les tables sont vides et les lanternes dessinent encore la ville entre les panneaux de bois.", "Remerii récupère ses gants, mais glisse le billet de réservation dans votre poche après y avoir inscrit une autre date.", ["Remerii", "Je ne garantis pas que le prochain dîner se terminera de la même manière. Je garantis seulement que j'en ai très envie.", "smirk"]]),
  "date-remerii-observatory": dialogueLines(["La lunette reste couverte pendant que vous rassemblez vos affaires. Remerii replie la couverture à moitié, renonce au carré parfait et la laisse sur la banquette.", ["Remerii", "Nous n'avons presque plus regardé les étoiles.", "calm"], ["{player}", "Vous regrettez ?"], ["Remerii", "Pas une seule seconde. Revenons tout de même : j'aimerais avoir les deux.", "smirk"]]),
  "home-remerii": dialogueLines(["La nuit demeure chez vous lorsque les gestes s'apaisent. Les gobelets sont encore renversés dans le salon ; aucun départ ne vient donner une limite artificielle au silence.", "Remerii garde la couverture autour de vos deux corps et pose la tête contre vous.", ["Remerii", "Laissez les jetons où ils sont. J'aimerais retrouver demain la preuve que nous avons su ne pas finir une partie.", "calm"]]),
};

const SCENES: AuthoredScene[] = [
  {
    id: "date-remerii-lanterns-complice-femme", context: "date-remerii-lanterns", sex: "femme", mood: "complice",
    text: "Lui rendre chacune de ses provocations", detail: "Une intimité joueuse où son élégance sociale se défait entre réparties, initiatives et renversements.",
    chapters: [
      A("Remerii garde le billet entre deux doigts tandis que vous avancez. Elle recule jusqu'au divan bas du salon, vous obligeant à venir chercher chaque baiser.", ["Remerii", "Vous vouliez improviser le supplément. J'attends une proposition convaincante.", "smirk"], "Vous lui répondez en l'embrassant et sa main se ferme aussitôt sur votre taille."),
      A("Vous retirez ses boucles d'oreilles l'une après l'autre. Remerii ouvre votre tenue en sens inverse, volontairement trop lentement, puis profite de votre impatience pour reprendre votre bouche.", ["Remerii", "Je constate une objection. Elle manque encore de précision.", "smirk"], "Vos vêtements rejoignent les coussins, mêlés aux siens sans respecter l'ordre impeccable qu'elle avait probablement imaginé."),
      A("Lorsqu'elle se tient nue dans la lumière ajourée des lanternes, Remerii lève le menton avec une assurance presque cérémonieuse. Son regard descend ensuite sur votre corps de femme et l'ironie s'y change en désir franc.", ["Remerii", "Vous pouvez regarder. Mais je me réserve exactement le même privilège.", "calm"]),
      V(
        ["Elle suit vos épaules, votre poitrine et la courbe de vos hanches de baisers patients. Son plaisir tient dans la façon dont vous venez de vous-même au-devant de ses mains."],
        ["Remerii descend le long de votre ventre, puis glisse une cuisse entre les vôtres. Sa paume découvre votre chaleur et revient au point qui vous fait retenir votre souffle."],
        ["Remerii écarte vos cuisses et laisse ses doigts parcourir votre chaleur humide. Elle frôle le point le plus sensible, recueille votre réaction, puis recommence avec une pression plus ferme jusqu'à ce que votre bassin vienne réclamer sa main.", ["Remerii", "Cette réponse-là me paraît parfaitement exploitable.", "smirk"]],
        ["Sa bouche quitte votre poitrine et descend hors de votre regard. Les panneaux de bois découpent la lumière tandis que votre main dans ses cheveux et son souffle entre vos cuisses racontent seuls la suite."],
      ),
      K(
        ["Votre bouche s'arrête un instant sous son sein gauche, là où vous reconnaissez la marque laissée par la lame. Vous y posez un baiser sans demander qu'elle vous livre de nouveau son histoire. Remerii expire, puis ramène votre main contre elle.", ["Remerii", "Merci de ne pas en faire une cérémonie. Continuez.", "calm"]],
        ["Sous son sein gauche, votre pouce rencontre une cicatrice fine. Remerii voit votre question mais ne s'y soumet pas ; elle couvre votre main de la sienne et choisit elle-même de la laisser là.", ["Remerii", "Une ancienne blessure. Son histoire attendra. Pas votre main.", "calm"]],
      ),
      V(
        ["Vous l'allongez sur le divan et prenez le temps d'apprendre ce qui détend son ventre et fait trembler ses cuisses. Remerii cesse peu à peu d'anticiper votre prochain geste."],
        ["Votre bouche suit sa poitrine, son ventre et l'intérieur de ses jambes. Elle ouvre davantage les cuisses, puis guide vos doigts vers la chaleur qu'elle ne cherche plus à dissimuler."],
        ["Vous goûtez Remerii entre les cuisses. Sa main vous indique d'abord l'endroit exact, puis ses mots se raccourcissent lorsque votre langue trouve son point sensible. Deux doigts entrent lentement en elle ; ses hanches corrigent l'angle bien plus sûrement que sa voix.", ["Remerii", "Là. Ne vous avisez surtout pas de devenir raisonnable maintenant.", "strict"]],
        ["Vous descendez sur elle tandis que la lumière des lanternes se brise sur le panneau. Remerii vous guide encore d'une main ; le récit s'arrête avant que ses phrases ne deviennent des souffles."],
      ),
      A("Elle vous attire ensuite à califourchon sur elle. Vos cuisses se mêlent, vos mains alternent et Remerii renverse deux fois la position, moins pour gagner que pour entendre votre rire se briser contre son cou.", "La magie reste silencieuse. Seule une lanterne vacille au-dehors lorsque son bassin retrouve le vôtre."),
      V(
        ["Vos caresses gardent une cadence vive mais tendre. Remerii vous mène au plaisir, accepte de perdre pied sous votre main à son tour et vous garde contre elle pendant que les deux vagues retombent."],
        ["Remerii presse sa cuisse entre les vôtres pendant que vos doigts entretiennent sa propre montée. Elle jouit contre votre paume, puis reprend le mouvement jusqu'à sentir votre corps céder à son tour."],
        ["Assise sur vos cuisses, Remerii frotte sa chaleur contre la vôtre tandis que vos doigts se glissent entre vos deux corps. Elle jouit la première, bouche ouverte contre votre gorge, puis reprend une cadence plus serrée jusqu'à faire déferler votre propre plaisir sous sa main.", ["Remerii", "Ne comptez pas cela comme une victoire. Ou faites-le, si vous acceptez la revanche.", "smirk"]],
        ["Elle vous entraîne dans un dernier renversement sous la couverture. Quand le récit revient, Remerii rit encore contre votre gorge et vos deux souffles cherchent ensemble un rythme plus calme."],
      ),
      A("Remerii demeure nue contre vous, une jambe passée sur les vôtres. Elle aperçoit un coussin tombé, tend la main comme pour le remettre en place, puis préfère vous caresser la joue.", ["Remerii", "Je crois que ce salon survivra à son désordre. Mon image publique aussi.", "smirk"]),
      A("Vous vous rhabillez lentement, interrompus par plusieurs baisers qui n'ont plus aucun prétexte. Remerii remet un seul bijou et glisse les autres dans sa poche.", "Avant d'ouvrir le panneau, elle vous embrasse encore, le sourire moins impeccable et beaucoup plus vrai."),
    ],
  },
  {
    id: "date-remerii-lanterns-attentive-femme", context: "date-remerii-lanterns", sex: "femme", mood: "attentive",
    text: "Laisser ses gestes parler avant ses phrases", detail: "Une progression silencieuse et attentive où Remerii regarde, choisit et guide sans devenir passive.",
    chapters: [
      A("Remerii garde votre main à sa taille après le premier baiser. Elle ne cherche pas une formule élégante ; elle observe votre visage, puis revient à votre bouche lorsque vous vous rapprochez.", "Le petit salon retient le murmure de la terrasse désormais vide. Entre deux baisers, elle vous demande seulement de rester près d'elle."),
      A("Elle défait votre tenue avec une lenteur appliquée, s'arrêtant chaque fois que vos mains découvrent une nouvelle attache sur la sienne. Vous vous déshabillez face à face, sans compétition.", ["Remerii", "Je veux voir ce que chaque geste vous fait. Pas pour l'évaluer. Pour ne rien manquer.", "calm"]),
      A("Nue devant les panneaux éclairés, Remerii laisse votre regard parcourir son corps. Sa respiration se serre lorsqu'elle comprend que vous ne détournez pas les yeux, puis sa main vient se poser sur votre poitrine découverte.", "Elle vous regarde avec la même franchise tranquille, attentive à la femme réelle devant elle plutôt qu'à une idée préparée."),
      V(
        ["Ses paumes épousent vos hanches et votre taille avant de remonter vers vos seins. Chaque caresse attend que votre corps vienne à sa rencontre."],
        ["Remerii embrasse votre gorge et votre poitrine, puis s'agenouille devant vous. Sa joue frôle l'intérieur de votre cuisse tandis que ses doigts découvrent lentement votre chaleur."],
        ["Remerii s'installe entre vos jambes et ouvre doucement votre intimité sous ses doigts. Sa langue rejoint le point sensible qu'elle vient de trouver ; elle garde la pression lorsque votre main se crispe sur son épaule et ne l'augmente qu'en sentant vos hanches revenir vers elle.", ["Remerii", "Comme cela ?", "calm"]],
        ["Elle descend entre vos cuisses et vous laisse choisir sa proximité d'un mouvement de jambe. La lumière reste sur vos visages un instant, puis la chronique respecte le silence que vous lui confiez."],
      ),
      K(
        ["Vous reconnaissez la cicatrice sous son sein gauche. Votre main s'arrête à côté, offrant le choix plutôt que l'évitement. Remerii la prend et pose vos doigts sur la marque elle-même.", ["Remerii", "Je la sens moins lorsque je décide qui peut la toucher.", "calm"]],
        ["La cicatrice sous son sein gauche apparaît lorsque Remerii lève le bras. Vous ne posez aucune question. Après un silence, elle amène elle-même vos doigts sur cette peau plus ferme.", ["Remerii", "Vous pouvez. Je ne souhaite simplement pas l'expliquer ce soir.", "calm"]],
      ),
      V(
        ["Vous rendez à son corps la même attention. Vos lèvres s'attardent sur sa poitrine et son ventre ; Remerii vous guide d'une pression discrète, sans reprendre le masque de celle qui sait tout."],
        ["Vous glissez entre ses cuisses. Son bassin se soulève vers votre paume et elle murmure le rythme qu'elle désire avant de fermer les yeux."],
        ["Votre bouche trouve sa chaleur et s'y attarde. Remerii pose deux doigts sur votre nuque pour vous guider, puis vous accueille plus profondément lorsqu'une main entre en elle. Elle ne donne plus d'instruction complète ; un souffle, une pression de ses cuisses et votre prénom suffisent.", ["Remerii", "Oui… gardez exactement cela.", "calm"]],
        ["Vous l'allongez sous la couverture et suivez la direction donnée par sa main. Ses mots disparaissent avant vos gestes, et le récit les rejoint dans l'ombre."],
      ),
      A("Vous vous retrouvez couchées sur le côté, face à face. Remerii glisse une jambe entre les vôtres et garde sa main là où votre souffle change, tandis que vous poursuivez lentement le plaisir qu'elle vous a confié.", "Aucun sort ne souligne l'instant. Sa précision tient désormais à l'écoute de vos deux corps."),
      V(
        ["Le plaisir monte sans rupture. Remerii vous embrasse au moment où vous cédez, puis vient chercher sa propre jouissance sous votre paume en gardant vos fronts joints."],
        ["Ses doigts maintiennent une caresse régulière entre vos cuisses pendant que les vôtres accélèrent sur elle. Votre plaisir arrive d'abord ; sa respiration se brise peu après contre vos lèvres."],
        ["Remerii garde deux doigts en vous, lents et recourbés, pendant que votre main travaille sa chaleur ouverte. Votre jouissance serre ses doigts ; elle soutient le mouvement jusqu'au bout, puis se cambre sous votre paume et jouit à son tour sans quitter votre regard.", ["Remerii", "Restez là. Je veux vous voir encore.", "calm"]],
        ["Vos mains poursuivent sous la couverture le dialogue commencé plus tôt. Lorsque la lumière revient, vos fronts sont joints et Remerii tremble encore contre votre paume."],
      ),
      A("Elle reste allongée face à vous. Son pouce passe sous votre œil, puis suit votre joue avec une tendresse qui n'a besoin d'aucun commentaire savant.", ["Remerii", "Je pensais que le silence me laisserait trop visible. Avec vous, il me laisse seulement présente.", "calm"]),
      A("Remerii vous aide à retrouver chaque vêtement, sans remettre immédiatement sa propre tenue. Elle garde encore un moment votre main contre son ventre.", "Quand vous vous levez enfin, elle vous accompagne jusqu'au panneau mais ne l'ouvre qu'après un dernier baiser lent."),
    ],
  },
  {
    id: "date-remerii-lanterns-elan-femme", context: "date-remerii-lanterns", sex: "femme", mood: "elan",
    text: "Suivre l'impatience qu'elle ne dissimule plus", detail: "Un désir assumé, direct et changeant, où Remerii prend l'initiative sans perdre son attention.",
    chapters: [
      A("Le verrou à peine tiré, Remerii vous ramène contre le panneau et prend votre bouche. L'élégance demeure dans la sûreté de ses mains, pas dans la patience de son baiser.", ["Remerii", "J'ai passé tout le dîner à différer ceci. Je considère le délai suffisant.", "strict"]),
      A("Elle ouvre votre vêtement pendant que vous faites glisser le sien sur ses épaules. Vous traversez le salon en vous déshabillant, jusqu'au divan où Remerii vous fait asseoir avant de retirer elle-même les dernières pièces.", "Ses bijoux restent sur le sol là où ils tombent. Elle les voit et n'interrompt rien."),
      A("Remerii se redresse nue entre vos jambes. La lumière des lanternes découpe son profil, sa poitrine et la force contenue de ses cuisses. Elle vous offre pleinement son corps, puis vient découvrir le vôtre avec le même empressement.", ["Remerii", "Regardez-moi tant que vous voulez. Mais ne restez pas immobile.", "smirk"]),
      V(
        ["Elle prend vos mains et les pose sur elle avant de parcourir à son tour votre poitrine et vos hanches. Chaque baiser demande moins d'attente que le précédent."],
        ["Remerii mord doucement votre épaule, descend sur vos seins puis glisse une main entre vos jambes. Votre chaleur contre sa paume lui arrache un souffle satisfait."],
        ["Remerii vous fait reculer sur le divan, ouvre vos cuisses et plonge deux doigts dans votre chaleur avant de refermer sa bouche sur le point le plus sensible. Son geste reste attentif malgré l'empressement ; elle ralentit une seconde à votre tension, puis reprend dès que vous la ramenez contre vous.", ["Remerii", "Oui. Montrez-moi jusqu'où je peux aller.", "strict"]],
        ["Elle vous allonge et disparaît entre vos cuisses avec une décision sans détour. Votre main répond dans ses cheveux ; la chronique laisse l'élan poursuivre son chemin hors champ."],
      ),
      K(
        ["Votre bouche rencontre la cicatrice connue sous son sein gauche. Remerii ne s'arrête pas ; elle prend votre main, la presse à cet endroit et vous embrasse avec plus de force.", ["Remerii", "Elle fait partie de moi. Ce soir, elle ne commande rien.", "strict"]],
        ["Vous découvrez la cicatrice sous son sein gauche au milieu de vos caresses. Remerii surprend votre regard et le ramène au sien d'une main ferme.", ["Remerii", "Pas maintenant. Désirez-moi avec elle, pas autour d'elle.", "strict"]],
      ),
      V(
        ["Vous renversez Remerii à votre tour. Elle accueille le changement avec un rire bref et ouvre les bras, impatiente de sentir comment vous répondrez."],
        ["Votre bouche descend sur sa poitrine et son ventre. Elle écarte les jambes et conduit votre main vers le mouvement qu'elle réclame, sans détourner les yeux."],
        ["Vous vous agenouillez entre ses cuisses et goûtez sa chaleur déjà ouverte. Remerii vous guide d'abord avec autorité, puis ses indications se brisent lorsque vos doigts entrent en elle et que votre langue garde le point qui la fait se cambrer.", ["Remerii", "Plus ferme. Voilà… ne ralentissez plus.", "strict"]],
        ["Vous reprenez l'initiative sous les panneaux de lumière. Remerii vous indique une seule fois ce qu'elle veut, puis la scène appartient à l'empressement de vos corps."],
      ),
      A("Elle vous attire ensuite au sol sur les coussins tombés. Vos jambes s'entrelacent ; Remerii presse sa cuisse contre votre chaleur et demande votre main sur elle en même temps.", "La position change encore lorsqu'elle vous fait passer au-dessus d'elle, puis vous ramène face à face sans laisser retomber le désir."),
      V(
        ["Remerii mène la cadence jusqu'à votre plaisir, puis vous la renversez doucement et l'accompagnez au sien. L'élan ne devient jamais précipitation ; chacune reste attentive au souffle de l'autre."],
        ["Vos bassins frottent contre les cuisses offertes tandis que vos mains entretiennent deux plaisirs distincts. Remerii jouit sous vous et vous entraîne dans la même vague d'un mouvement ferme."],
        ["Remerii presse sa chaleur contre votre cuisse tandis que ses doigts glissent en vous. Vous la caressez au même rythme, plus vite chaque fois qu'elle vous réclame. Sa jouissance éclate sous votre main ; elle maintient pourtant ses doigts et leur courbe jusqu'à ce que votre corps se tende à son tour contre elle.", ["Remerii", "Oui… maintenant. Avec moi.", "strict"]],
        ["Le dernier changement de position disparaît sous la couverture. Le récit revient sur deux corps encore serrés l'un contre l'autre et sur le souffle de Remerii qui refuse déjà de considérer la scène terminée."],
      ),
      A("Remerii reste au-dessus de vous, les cheveux défaits sur une épaule. Elle rit sans bruit en découvrant la trace de sa bouche sur votre peau.", ["Remerii", "Je ne me suis pas perdue. J'ai simplement cessé de prendre le chemin le plus long.", "smirk"]),
      A("Vous récupérez vos vêtements parmi les coussins. Remerii remet sa robe sans refermer tout de suite son col, puis vous attire debout contre elle.", "Son dernier baiser conserve l'impatience du premier, avec la promesse très nette qu'elle n'attendra pas autant la prochaine fois."),
    ],
  },
  {
    id: "date-remerii-lanterns-complice-homme", context: "date-remerii-lanterns", sex: "homme", mood: "complice",
    text: "Transformer sa réserve en jeu jusqu'à ce qu'elle vous réclame", detail: "Une intimité joueuse où provocations et renversements conduisent Remerii à demander franchement ce qu'elle veut.",
    chapters: [
      A("Remerii retient le billet sous sa paume et vous fait signe d'approcher. Chaque fois que vous cherchez sa bouche, elle tourne juste assez le visage pour vous obliger à choisir entre son sourire et son cou.", ["Remerii", "Vous avez demandé le supplément. Je vérifie seulement votre persévérance.", "smirk"]),
      A("Vous ouvrez sa robe pendant qu'elle défait votre chemise avec une lenteur moqueuse. Lorsqu'un bouton résiste, elle vous interdit d'aider d'un regard, puis abandonne finalement l'attache pour faire passer le tissu par-dessus votre tête.", "Vos vêtements tombent autour du divan, ses gants encore parfaitement réunis au milieu de ce désordre."),
      A("Remerii se tient nue devant vous, éclairée par les lanternes au travers des panneaux. Elle soutient votre regard sur sa poitrine et ses hanches, puis observe à son tour votre corps d'homme sans cacher le désir qui affine son sourire.", ["Remerii", "Nous sommes quittes pour les regards. Pas encore pour le reste.", "smirk"]),
      V(
        ["Elle suit votre torse et votre ventre de ses mains, s'attardant là où vos muscles se tendent. Sa bouche revient à la vôtre chaque fois que votre respiration la renseigne."],
        ["Remerii descend sur votre poitrine, votre ventre puis la naissance de votre désir. Elle le prend dans sa paume et découvre le rythme qui fait avancer vos hanches."],
        ["Remerii s'agenouille entre vos jambes et referme sa main autour de votre désir dressé. Sa langue en suit lentement la pointe avant que sa bouche vous accueille davantage ; ses doigts accompagnent chaque mouvement, et son regard levé guette le moment où votre assurance commence à céder.", ["Remerii", "Vous étiez plus éloquent pendant le dîner.", "smirk"]],
        ["Elle s'agenouille devant vous, sa bouche et sa main trouvant une réponse que vos phrases ne donnent plus. La lumière des lanternes reste seule visible pendant que la chronique s'écarte."],
      ),
      K(
        ["En la ramenant contre vous, vos lèvres trouvent la cicatrice connue sous son sein gauche. Vous l'embrassez sans interrompre le jeu. Remerii glisse une main dans vos cheveux et vous garde à cet endroit une seconde de plus.", ["Remerii", "Voilà une attention que j'accepte sans réserve.", "calm"]],
        ["Votre bouche rencontre une cicatrice sous son sein gauche. Vous levez les yeux ; Remerii secoue légèrement la tête, non pour vous éloigner, mais pour différer la question.", ["Remerii", "Vous aurez l'histoire une autre nuit. Celle-ci possède déjà un sujet.", "smirk"]],
      ),
      V(
        ["Vous allongez Remerii sur le divan et rendez chaque caresse qu'elle vous a donnée. Elle essaie encore de commenter votre méthode, puis perd sa phrase lorsque votre bouche descend."],
        ["Votre main glisse entre ses cuisses tandis que vous embrassez sa poitrine. Remerii ouvre les jambes et guide votre poignet vers la pression qu'elle préfère."],
        ["Vous goûtez sa chaleur entre les cuisses, trouvez sous votre langue le point qui fait trembler son ventre puis glissez deux doigts en elle. Remerii corrige une fois leur courbe ; ensuite ses hanches viennent seules réclamer chaque reprise.", ["Remerii", "Je retire toutes mes objections. Continuez.", "smirk"]],
        ["Vous descendez entre ses cuisses et Remerii vous guide d'une main ferme. Ses paroles deviennent trop brèves pour le récit, qui vous laisse poursuivre derrière les panneaux ajourés."],
      ),
      A("Remerii vient ensuite s'asseoir sur vos cuisses, face à vous. Elle frotte sa chaleur le long de votre désir sans vous accueillir encore, recule chaque fois que vous tentez de l'attirer et revient d'elle-même avec un sourire provocateur.", "Vous la faites basculer sous vous ; elle inverse encore la position dans un rire étouffé."),
      V(
        ["Elle vous accueille lentement, garde vos fronts joints et fait rouler son bassin jusqu'à ce que le plaisir vous gagne tous deux. Vous ralentissez ensemble, sans chercher qui a cédé le premier."],
        ["Remerii descend sur vous par étapes, puis choisit une cadence qui presse son point sensible contre votre bassin. Sa jouissance rompt son jeu ; vos mains la soutiennent jusqu'à votre propre abandon."],
        ["Remerii guide votre désir à son entrée puis vous accueille entièrement, assise face à vous. Elle roule des hanches, ralentit pour vous faire attendre et repart plus ferme lorsque votre main trouve son point sensible. Elle jouit autour de vous, garde ses mouvements courts et serrés, puis vous regarde céder en elle.", ["Remerii", "Vous pouvez compter cette manche. J'ai déjà choisi la revanche.", "smirk"]],
        ["Elle vous attire avec elle sur les coussins, et la couverture soustrait à la chronique la fin de votre jeu. Quand elle retombe, Remerii repose encore sur vous, sourire défait contre votre cou."],
      ),
      A("Remerii reste assise contre votre hanche, nue et parfaitement peu pressée de retrouver sa contenance. Du bout du pied, elle rapproche pourtant un gant de l'autre.", ["Remerii", "Certaines habitudes survivent à tout. C'est presque décevant.", "smirk"]),
      A("Vous vous rhabillez entre deux nouvelles provocations. Elle replace votre col de travers, constate son propre sabotage et décide de le laisser ainsi.", "Avant d'ouvrir le salon, elle glisse le billet dans votre poche comme une mise qu'elle compte bien récupérer."),
    ],
  },
  {
    id: "date-remerii-lanterns-attentive-homme", context: "date-remerii-lanterns", sex: "homme", mood: "attentive",
    text: "Lui confier votre désir sans rompre sa lenteur", detail: "Une scène attentive, conduite par les regards et les gestes choisis plutôt que par la démonstration.",
    chapters: [
      A("Remerii reste près de vous après le premier baiser, sa main ouverte sur votre poitrine. Elle écoute votre souffle comme on écoute une réponse encore incomplète, puis vous embrasse de nouveau lorsque vous couvrez ses doigts des vôtres."),
      A("Elle ouvre votre chemise, attend que vous fassiez glisser sa robe, puis reprend. Les vêtements quittent vos corps par étapes calmes ; aucune main ne devance l'autre au point de la laisser derrière.", ["Remerii", "Je ne veux pas rendre cela parfait. Je veux seulement être ici pendant chaque seconde.", "calm"]),
      A("Nue dans la lumière dorée, Remerii ne cherche ni pose ni couverture. Elle laisse vos yeux parcourir la cicatrice, sa poitrine, son ventre et ses jambes, puis découvre votre corps d'homme avec une attention qui vous fait vous redresser vers elle."),
      V(
        ["Elle suit votre torse du bout des doigts et embrasse les endroits où votre respiration change. Son autre main demeure sur votre hanche, présence constante plutôt que direction."],
        ["Sa bouche descend sur votre ventre. Remerii prend votre désir dans sa main, le caresse lentement et observe votre visage avant de varier la pression."],
        ["Remerii s'agenouille et entoure votre désir dressé d'une paume chaude. Sa langue frôle la pointe, puis sa bouche vous accueille sans hâte. Elle garde une main à votre base et règle la profondeur sur votre bassin, attentive au moindre recul comme à chaque avancée.", ["Remerii", "Dites-moi seulement si vous voulez que je continue ainsi.", "calm"]],
        ["Elle descend devant vous et vous laisse guider sa proximité d'une main posée sur son épaule. La lumière suffit encore à montrer son choix ; le récit se retire avant d'en détailler la suite."],
      ),
      K(
        ["Vous reconnaissez la cicatrice sous son sein gauche et y posez la paume sans la traiter comme une fragilité. Remerii garde votre main contre elle, puis l'entraîne plus bas lorsqu'elle le désire.", ["Remerii", "Vous savez. Je n'ai rien à ajouter maintenant.", "calm"]],
        ["Votre pouce rencontre la cicatrice sous son sein gauche. Remerii suit votre regard et demeure ouverte, sans offrir l'explication que vous ne lui demandez pas.", ["Remerii", "Elle est ancienne. Vous pouvez rester là si vous en avez envie.", "calm"]],
      ),
      V(
        ["Vous l'allongez et parcourez son corps avec la même patience. Sa main rejoint la vôtre lorsqu'elle souhaite prolonger une caresse ; elle ne se contente jamais d'attendre."],
        ["Votre bouche descend de sa poitrine à l'intérieur de ses cuisses. Remerii ouvre son corps et guide vos doigts vers sa chaleur avec un soupir net."],
        ["Vous embrassez Remerii entre les cuisses et goûtez sa chaleur. Sa main vous indique le point sensible, puis vos doigts entrent lentement en elle. Vous conservez le même mouvement jusqu'à ce que son bassin ne puisse plus rester immobile sous votre bouche.", ["Remerii", "Oui… gardez cette lenteur. Elle ne manque de rien.", "calm"]],
        ["Vous vous penchez entre ses jambes tandis qu'elle vous indique le geste d'une main. Le reste demeure derrière la couverture, rythmé seulement par des souffles qui n'ont plus besoin de phrases."],
      ),
      A("Remerii vous attire au-dessus d'elle puis préfère finalement vous faire rouler sur le côté. Une jambe autour de votre hanche, elle guide votre désir contre sa chaleur et prend le temps de vous regarder avant de vous accueillir."),
      V(
        ["Vous vous unissez lentement, sans quitter l'étreinte. Le plaisir vient dans des mouvements courts et patients ; Remerii atteint le sien sous votre main avant de vous accompagner jusqu'au vôtre."],
        ["Elle vous accueille et garde une cadence souple, une main sur votre nuque. Ses cuisses se resserrent lorsqu'elle jouit ; vous restez contre elle jusqu'à ce que votre propre plaisir vous traverse."],
        ["Remerii vous accueille par pressions lentes, couchée sur le côté face à vous. Votre main demeure entre vos bassins sur son point sensible ; elle jouit autour de votre désir, serre sa jambe contre vous et reprend quelques mouvements profonds jusqu'à sentir votre plaisir se répandre en elle.", ["Remerii", "Restez. Ne vous éloignez pas encore.", "calm"]],
        ["Elle vous attire sous la couverture et choisit elle-même le rythme de votre union. Quand le récit revient, Remerii vous retient encore dans l'étreinte, les jambes mêlées aux vôtres."],
      ),
      A("Son front repose contre le vôtre. Remerii passe une main dans vos cheveux, attentive au retour de votre souffle, puis accepte que vous fassiez de même pour elle.", ["Remerii", "Je n'avais rien à prouver. C'est peut-être pour cela que j'ai pu tout ressentir.", "calm"]),
      A("Vous retrouvez vos vêtements sans quitter le divan tout de suite. Elle boutonne votre chemise et laisse volontairement le dernier ouvert.", "Dans l'encadrement du salon, Remerii vous regarde encore avant de rejoindre avec vous la terrasse silencieuse."),
    ],
  },
  {
    id: "date-remerii-lanterns-elan-homme", context: "date-remerii-lanterns", sex: "homme", mood: "elan",
    text: "Répondre à son désir avant qu'elle ne le reformule", detail: "Une initiative franche où Remerii se laisse traverser par l'impulsion sans perdre ni choix ni présence.",
    chapters: [
      A("Remerii verrouille le panneau et revient directement à vous. Sa bouche prend la vôtre, sa main glisse sous votre veste et elle vous pousse jusqu'au divan sans transformer son envie en discours.", ["Remerii", "Je vous désire depuis bien avant le dessert. J'ai assez différé.", "strict"]),
      A("Elle arrache presque votre chemise à ses boutons ; vous retenez son poignet juste assez pour sauver le tissu, puis ouvrez sa robe avec la même urgence. Remerii rit contre votre gorge et vous aide à chasser le reste.", "Ses bijoux roulent sur un coussin. Elle ne tourne même pas la tête."),
      A("Nue devant vous, Remerii écarte vos genoux et vient s'y placer. Elle vous laisse voir son corps entier dans la lumière mouvante, puis ouvre elle-même le dernier vêtement qui dissimule encore votre désir.", ["Remerii", "Très bien. Ne me faites plus attendre.", "strict"]),
      V(
        ["Ses mains parcourent votre torse et votre ventre avec une chaleur urgente. Elle revient souvent à votre bouche, comme si aucun autre contact ne suffisait seul."],
        ["Remerii descend sur vous, referme sa main autour de votre désir et le caresse jusqu'à vous faire avancer contre sa paume. Sa bouche suit bientôt le même chemin."],
        ["Remerii prend votre désir dressé dans sa bouche avec une franchise qui vous coupe le souffle. Une main serre votre hanche, l'autre accompagne sa bouche ; lorsqu'elle vous autorise à bouger, elle accueille vos avancées jusqu'à la profondeur qu'elle choisit et reprend aussitôt plus vite.", ["Remerii", "Oui. Maintenant, cessez de ménager mon impatience.", "strict"]],
        ["Elle s'agenouille entre vos jambes et vous attire à elle. La chronique abandonne aux lanternes le mouvement précis de sa bouche et de vos mains."],
      ),
      K(
        ["Votre main passe sur la cicatrice connue sous son sein gauche. Remerii la presse plus fermement contre elle, refusant autant la prudence excessive que l'oubli.", ["Remerii", "Vous ne me casserez pas en me touchant. Venez.", "strict"]],
        ["Vous découvrez la cicatrice sous son sein gauche. Votre geste ralentit ; Remerii prend vos doigts et les fait glisser sur la marque avant de les entraîner vers son ventre.", ["Remerii", "Pas de détour. Je vous expliquerai quand nous aurons moins envie l'un de l'autre.", "strict"]],
      ),
      V(
        ["Vous la renversez sur les coussins et reprenez l'initiative. Remerii ouvre les bras, puis vous guide avec des mots brefs lorsque votre bouche descend."],
        ["Votre main trouve sa chaleur entre les cuisses tandis que votre bouche s'attarde sur sa poitrine. Elle se cambre et réclame une pression plus ferme."],
        ["Vous ouvrez ses cuisses et goûtez sa chaleur avec la même urgence. Votre langue insiste sur son point sensible pendant que deux doigts entrent en elle ; Remerii relève les hanches, vous saisit par les cheveux et perd toute phrase complète sous la cadence qu'elle a demandée.", ["Remerii", "Encore… exactement là.", "strict"]],
        ["Vous descendez entre ses jambes et Remerii vous guide sans détour. La lumière baisse sur son choix franc et sur votre réponse tout aussi immédiate."],
      ),
      A("Elle vous tire ensuite au-dessus d'elle et guide votre désir contre son entrée. Après quelques mouvements, Remerii vous fait rouler pour venir vous chevaucher, préférant choisir elle-même la profondeur et la vitesse.", "Ses cheveux se défont complètement lorsqu'elle se penche pour vous embrasser."),
      V(
        ["Remerii vous accueille et mène une cadence franche, ralentie seulement pour vous garder près d'elle. Sa jouissance arrive sous votre main ; la vôtre la suit alors qu'elle continue de vous entourer."],
        ["Elle chevauche votre désir, son point sensible pressé sous vos doigts. Son plaisir rompt le rythme, puis elle repart plus vite jusqu'à vous faire céder en elle."],
        ["Remerii s'abaisse sur votre désir jusqu'à vous accueillir entièrement, puis roule des hanches avec une impatience assumée. Votre pouce entretient son point sensible ; elle jouit autour de vous, repart presque aussitôt dans des mouvements plus courts et vous entraîne jusqu'au moment où votre plaisir se répand profondément en elle.", ["Remerii", "Oui. Ne retenez plus rien.", "strict"]],
        ["Elle vous chevauche sous la couverture, décidée à ne plus différer une seule envie. Lorsque le récit revient, Remerii demeure au-dessus de vous, haletante et encore parcourue de frissons."],
      ),
      A("Remerii repose sur votre poitrine sans chercher tout de suite une phrase digne. Sa main suit les battements rapides sous votre peau et un sourire satisfait apparaît enfin.", ["Remerii", "Je me souviens parfaitement de moi. J'avais simplement oublié que je pouvais vouloir aussi vite.", "calm"]),
      A("Elle remet sa robe, laisse ses cheveux défaits et récupère ses bijoux dans sa paume. Avant que vous ne vous leviez, elle revient entre vos genoux pour un dernier baiser.", "Le salon garde votre désordre pendant que vous rejoignez lentement la terrasse des lanternes."),
    ],
  },
  {
    id: "date-remerii-observatory-complice-femme", context: "date-remerii-observatory", sex: "femme", mood: "complice",
    text: "Dérégler son calme avec une précision très volontaire", detail: "Une scène joueuse sur le tapis de l'observatoire, où chaque pique devient un geste et chaque geste appelle une revanche.",
    chapters: [
      A("Remerii vous fait reculer sur la couverture mais garde un pied contre le trépied, comme si elle protégeait encore l'instrument de votre empressement.", ["Remerii", "La lunette n'a rien fait pour mériter votre enthousiasme. Orientez-le correctement.", "smirk"], "Vous l'attirez par la taille. Elle cède avec un rire bref et vient s'allonger à moitié sur vous."),
      A("Vous ouvrez sa tenue dans la faible lumière de la galerie. Remerii défait la vôtre en prenant soin de poser chaque épingle près de la carte, jusqu'à ce que vous en déplaciez une volontairement.", ["Remerii", "Je vois. Vous souhaitez tester la limite de ma concentration.", "smirk"], "Elle abandonne tout le rangement et vous retire le dernier tissu avec une efficacité beaucoup moins cérémonieuse."),
      A("Nue sur la couverture, Remerii s'étire sans quitter votre regard. L'air nocturne effleure sa peau ; elle attire un second pan sur ses jambes, non pour se cacher, mais pour vous inviter dessous avec elle.", "Ses yeux suivent votre poitrine et vos hanches découvertes, puis remontent vers votre sourire avec une chaleur qui n'a rien de théorique."),
      V(
        ["Elle vous fait rouler sur le dos et parcourt votre corps de baisers légers. Chaque fois que vous anticipez son chemin, Remerii change de côté et vous oblige à rire."],
        ["Sa bouche descend sur vos seins et votre ventre. Une main trouve la chaleur entre vos cuisses, s'en éloigne juste assez pour vous faire protester, puis revient plus précisément."],
        ["Remerii ouvre vos jambes sur la couverture et glisse deux doigts dans votre chaleur humide. Sa langue rejoint le point sensible qu'elle a frôlé trop brièvement ; elle alterne lenteur et reprises plus fermes jusqu'à ce que vos hanches cessent de pouvoir suivre son jeu.", ["Remerii", "Vous vouliez dérégler ma concentration. Je vous rends la faveur.", "smirk"]],
        ["Elle se glisse sous le pan partagé, entre vos cuisses. Son rire se transforme en souffle contre votre peau, puis la nuit garde pour elle les détails de votre revanche."],
      ),
      K(
        ["Lorsque vous découvrez à votre tour sa poitrine, votre bouche suit sans hésiter la cicatrice connue sous son sein gauche. Remerii vous regarde y déposer un baiser, puis pousse votre épaule pour vous faire rouler sous elle.", ["Remerii", "Très bien. Mais ne comptez pas m'immobiliser par la tendresse.", "smirk"]],
        ["Votre main trouve la cicatrice sous son sein gauche. Remerii la couvre une seconde, vous regarde, puis retire ses doigts sans livrer davantage que son choix de rester offerte.", ["Remerii", "Une histoire pour une autre nuit. Celle-ci commence à devenir excellente.", "smirk"]],
      ),
      V(
        ["Vous la ramenez sur le dos et ralentissez délibérément. Remerii tente une remarque, la perd sous vos baisers et vous indique d'une main où elle souhaite vous sentir davantage."],
        ["Vous embrassez sa poitrine puis l'intérieur de ses cuisses. Sa chaleur se presse contre votre paume ; elle ouvre davantage les jambes lorsque vos doigts trouvent leur mouvement."],
        ["Votre langue retrouve Remerii entre les cuisses. Vous insistez sur le point qui raidit son ventre tandis que vos doigts entrent en elle ; sa main s'accroche au bord de la couverture et son ironie se réduit à votre prénom lorsqu'elle vous réclame plus ferme.", ["Remerii", "Ne triomphez pas encore… continuez.", "smirk"]],
        ["Vous disparaissez sous la couverture à votre tour. Remerii essaie encore une pique, mais sa voix se brise avant la fin et le récit lui accorde cette défaite privée."],
      ),
      A("Elle vous ramène côte à côte, jambes mêlées sur le tapis. Vos chaleurs se pressent l'une contre l'autre tandis que vos mains trouvent un rythme commun, interrompu chaque fois que l'une de vous vole un baiser à l'autre.", "Le tube couvert demeure parfaitement immobile. La carte, elle, glisse hors de portée sans que Remerii cherche à la sauver."),
      V(
        ["Vous vous conduisez mutuellement au plaisir dans une étreinte mouvante. Remerii jouit sous vos doigts, reprend la caresse sur vous et sourit lorsque votre propre vague vous coupe la respiration."],
        ["Ses doigts glissent en vous pendant que votre paume travaille sa chaleur. Elle jouit contre votre cuisse, puis garde la même cadence jusqu'à sentir votre abandon répondre au sien."],
        ["Remerii vous fait passer au-dessus d'elle, vos cuisses encore entrelacées. Ses doigts entrent en vous tandis que les vôtres maintiennent une pression rapide sur son point sensible. Sa jouissance la cambre sous vous ; elle garde pourtant son geste, le rend plus profond, et vous accompagne jusqu'à ce que votre plaisir vous fasse retomber contre sa poitrine.", ["Remerii", "Match nul. Je refuse toute autre interprétation.", "smirk"]],
        ["Vos jambes changent encore de place sous la couverture. Lorsque la chronique revient, la carte est tombée du tapis et Remerii vous retient contre elle avec un sourire de victoire parfaitement contestable."],
      ),
      A("Remerii replace la couverture sur vos épaules sans se lever. Une de ses mèches s'est prise dans sa boucle d'oreille restée au sol ; vous la libérez ensemble en riant.", ["Remerii", "Je consens à ce que personne ne gagne. Pour cette fois.", "smirk"]),
      A("Vous vous rhabillez sur le tapis, lentement, tandis que la galerie refroidit. Remerii retrouve l'épingle que vous aviez déplacée et la met dans votre main au lieu de la ranger.", "Elle vous propose de la lui rendre lors d'une prochaine observation, puis vous embrasse pour ôter toute ambiguïté à l'invitation."),
    ],
  },
  {
    id: "date-remerii-observatory-attentive-femme", context: "date-remerii-observatory", sex: "femme", mood: "attentive",
    text: "Garder la nuit lente et laisser son attention vous guider", detail: "Une intimité calme, faite de regards soutenus, de gestes précis et de silences qui ne sont jamais de la passivité.",
    chapters: [
      A("Vous restez assises sous la couverture, épaule contre épaule. Remerii tourne la tête et vous embrasse sans fermer tout de suite les yeux, comme si elle voulait voir le moment exact où vous lui répondrez.", "Sa main se pose ensuite sur votre nuque et le baiser s'approfondit sans rompre le calme de la galerie."),
      A("Elle retire sa cape et vous aide à dégager vos manches. Vous ouvrez sa tenue, puis elle s'arrête un instant en sous-vêtement devant vous, non par recul, mais pour reprendre votre main.", ["Remerii", "Je veux que nous ayons le temps. La porte est fermée ; rien ne nous presse.", "calm"]),
      A("Remerii laisse tomber le dernier tissu et demeure nue dans la clarté douce du ciel. Elle accepte votre regard, puis défait avec vous ce qui couvre encore votre corps de femme.", "Sa paume suit votre taille comme pour en retenir la forme, mais son visage reste tout près du vôtre."),
      V(
        ["Elle embrasse votre épaule, vos seins et le creux de votre ventre, revenant souvent chercher votre regard. Ses doigts épousent vos hanches sans chercher encore plus bas."],
        ["Remerii glisse sa main entre vos cuisses et découvre votre chaleur par pressions lentes. Sa bouche reste sur votre poitrine tandis que votre bassin répond."],
        ["Allongée près de vous, Remerii laisse ses doigts ouvrir doucement votre chaleur. Elle entre en vous avec lenteur, recourbe le geste au rythme de vos hanches et garde son pouce sur le point sensible qui fait trembler vos jambes.", ["Remerii", "Je vous regarde. Prenez tout le temps qu'il vous faut.", "calm"]],
        ["Sa main descend entre vos cuisses tandis qu'elle vous embrasse. Le pan de couverture remonte sur vos corps et le récit s'arrête au seuil de cette attention partagée."],
      ),
      K(
        ["Votre regard reconnaît la cicatrice sous son sein gauche. Vous la frôlez sans la contourner ni l'interroger ; Remerii pose sa main sur la vôtre et garde vos doigts contre la marque pendant plusieurs respirations.", ["Remerii", "Elle n'a pas besoin de parler à notre place.", "calm"]],
        ["Vous découvrez la cicatrice sous son sein gauche. Remerii suit vos yeux, puis vient chercher votre bouche avant qu'une question ne transforme l'instant.", ["Remerii", "Vous la voyez. C'est assez pour ce soir.", "calm"]],
      ),
      V(
        ["Vous parcourez à votre tour sa peau, attentive aux mouvements par lesquels elle vous rapproche ou vous retient. Remerii guide sans expliquer, et sa respiration devient votre repère."],
        ["Votre bouche descend vers l'intérieur de ses cuisses. Elle ouvre les jambes, place votre main sur sa chaleur et vous montre le rythme d'un mouvement des hanches."],
        ["Vous goûtez lentement Remerii, votre langue posée sur son point sensible tandis que deux doigts glissent en elle. Sa main repose dans vos cheveux sans imposer ; lorsqu'elle désire davantage, ses cuisses se resserrent autour de vos épaules et sa voix vous le demande simplement.", ["Remerii", "Un peu plus… oui. Restez là.", "calm"]],
        ["Vous vous glissez entre ses cuisses sous la couverture. Remerii pose la main sur votre nuque et la galerie silencieuse garde la suite hors du regard du récit."],
      ),
      A("Vous revenez vous allonger face à elle. Remerii entrelace vos jambes, presse sa cuisse contre votre chaleur et guide votre main sur la sienne ; le rythme naît sans consigne, entretenu par de petites reprises de vos bassins.", "Elle ne détourne plus les yeux."),
      V(
        ["Vos caresses vous conduisent l'une après l'autre au plaisir. Remerii accueille votre abandon contre son épaule, puis se laisse rejoindre à son tour sans perdre l'étreinte."],
        ["Sa main poursuit entre vos cuisses pendant que la vôtre accélère sur elle. Votre plaisir arrive dans son regard ; le sien suit, silencieux et profond, contre vos doigts."],
        ["Les doigts de Remerii demeurent en vous tandis que vous caressez sa chaleur ouverte. Votre jouissance se propage autour de sa main ; elle vous embrasse sans ralentir votre geste sur elle, puis se tend à son tour, bassin pressé contre votre paume jusqu'au dernier frisson.", ["Remerii", "Ne vous éloignez pas. Pas encore.", "calm"]],
        ["La couverture dissimule le dernier mouvement de vos mains. Lorsque le récit revient, Remerii est lovée contre vous et le silence a pris la douceur d'une réponse complète."],
      ),
      A("Elle prend votre main et la pose à plat sur son ventre pendant que vos respirations s'apaisent. Aucun commentaire ne vient expliquer ce que ses doigts entrelacés aux vôtres disent déjà."),
      A("Vous remettez vos vêtements sans rallumer la lampe. Remerii plie la couverture une fois, puis la laisse simplement sur la banquette.", ["Remerii", "J'aimerais rester encore un peu avant d'ouvrir la porte.", "calm"], "Vous vous rasseyez côte à côte, habillées, sans rendre la nuit moins intime."),
    ],
  },
  {
    id: "date-remerii-observatory-elan-femme", context: "date-remerii-observatory", sex: "femme", mood: "elan",
    text: "Abandonner le ciel à son désir immédiat", detail: "Une scène spontanée où Remerii choisit vite, mène franchement et accueille chaque renversement.",
    chapters: [
      A("Remerii vous pousse sur la couverture avant que vous ayez fini de vous asseoir. Son genou se place entre vos jambes et son baiser possède l'élan de tout ce qu'elle a retenu pendant l'observation.", ["Remerii", "Je n'ai plus aucune envie de regarder loin.", "strict"]),
      A("Elle ouvre votre tenue d'un geste sûr pendant que vous faites glisser la sienne. Une manche résiste ; Remerii la tire, rit de sa propre impatience et vous laisse finalement la libérer.", "Vos vêtements restent près de la lunette couverte, assez loin pour ne gêner aucun de vos mouvements."),
      A("Nue à genoux sur le tapis, Remerii vous regarde retirer le dernier tissu. Le froid de la galerie durcit brièvement sa poitrine ; elle vous attire aussitôt contre sa chaleur et vous fait basculer sous elle.", ["Remerii", "Regardez autant que vous voudrez. Touchez-moi davantage.", "strict"]),
      V(
        ["Ses mains suivent vos seins et vos hanches avec une franchise vive. Elle vous embrasse chaque fois que l'air froid vous fait frissonner."],
        ["Remerii mord doucement votre sein, descend sur votre ventre puis presse sa cuisse contre la chaleur entre vos jambes. Elle sourit en sentant votre bassin répondre."],
        ["Remerii ouvre vos cuisses et plonge ses doigts dans votre chaleur humide. Sa bouche trouve aussitôt le point sensible, sa langue garde une cadence rapide tandis que ses doigts se courbent en vous ; elle ralentit seulement lorsque votre corps se tend trop vite, puis reprend sous votre main.", ["Remerii", "Ramenez-moi contre vous si vous en voulez davantage.", "strict"]],
        ["Elle disparaît entre vos jambes et la couverture suit ses épaules. Votre main l'attire plus près ; le récit laisse votre réponse physique poursuivre seule la scène."],
      ),
      K(
        ["Vous retrouvez la cicatrice connue sous son sein gauche au milieu d'un baiser. Remerii presse votre bouche contre elle sans interrompre le mouvement de ses hanches.", ["Remerii", "Pas de précaution inventée. Je vous dirai si quelque chose change.", "strict"]],
        ["Votre bouche s'arrête sur la cicatrice sous son sein gauche. Remerii saisit doucement votre menton et ramène vos yeux aux siens.", ["Remerii", "Une blessure ancienne. Ce soir, j'ai envie que vous continuiez.", "strict"]],
      ),
      V(
        ["Vous la renversez avec un élan qui lui arrache un rire. Remerii ouvre les bras, puis vos baisers descendent et son rire devient un souffle."],
        ["Votre main s'enfonce entre ses cuisses tandis que votre bouche parcourt son ventre. Elle guide vos doigts plus bas et réclame sans détour une cadence plus vive."],
        ["Vous goûtez sa chaleur ouverte et maintenez votre langue sur son point sensible. Deux doigts entrent en elle, plus profonds à chaque mouvement de ses hanches ; Remerii serre la couverture, vous demande de ne plus ralentir et perd le reste de sa phrase sous la poussée du plaisir.", ["Remerii", "Plus vite… oui, comme cela.", "strict"]],
        ["Vous prenez sa place au-dessus d'elle et Remerii guide votre tête entre ses cuisses. La suite disparaît avec vos deux silhouettes sous la couverture."],
      ),
      A("Elle vous ramène ensuite face à elle, assise sur vos cuisses. Vos chaleurs glissent l'une contre l'autre tandis que vos mains se croisent entre vos corps ; Remerii change l'angle, repart plus fort et vous entraîne avec elle.", "Un seul halo pâle court sur la boucle de la lunette, puis s'éteint. Elle ne le remarque même pas."),
      V(
        ["Le plaisir vous prend dans le même mouvement de bassin. Remerii vous serre contre elle, atteint la jouissance sous votre main et garde la sienne sur vous jusqu'à votre propre abandon."],
        ["Vos cuisses se resserrent et vos doigts accélèrent sur vos chaleurs rapprochées. Remerii jouit contre vous, puis reprend aussitôt le mouvement qui vous fait céder."],
        ["Remerii frotte sa chaleur contre la vôtre avec des mouvements courts, sa main glissée entre vos deux corps. Vos doigts entrent en elle tandis que les siens travaillent votre point sensible. Elle jouit contre votre poitrine, se cambre autour de votre main et vous entraîne presque aussitôt dans une jouissance qui vous laisse toutes deux haletantes sur le tapis.", ["Remerii", "Voilà. C'est cela que je voulais maintenant.", "strict"]],
        ["La couverture referme la scène sur votre élan partagé. Quand la chronique revient, Remerii repose à moitié sur vous, les doigts encore crispés dans votre main."],
      ),
      A("Elle reste nue contre votre flanc, souffle court et sourire presque étonné. Sa main remonte sur votre ventre, non pour recommencer tout de suite, mais parce qu'elle refuse la distance.", ["Remerii", "Je n'ai rien perdu. J'ai seulement cessé de retarder ce que je voulais.", "calm"]),
      A("Vous remettez vos vêtements à même le tapis. Remerii noue les siens sans retrouver tout à fait sa coiffure et s'en amuse au lieu de la corriger.", "Elle garde votre main jusqu'à la porte de la galerie, puis décide de ne pas l'ouvrir avant un dernier baiser."),
    ],
  },
  {
    id: "date-remerii-observatory-complice-homme", context: "date-remerii-observatory", sex: "homme", mood: "complice",
    text: "Laisser son ironie choisir une cible beaucoup plus proche", detail: "Une intimité vive et joueuse sur le tapis d'observation, sans transformer le moment en expérience ni en concours.",
    chapters: [
      A("Remerii vous fait asseoir sur la couverture, puis reste debout une seconde devant vous.", ["Remerii", "Vous aviez beaucoup d'assurance face à une lunette. Voyons si elle résiste à un sujet qui vous regarde en retour.", "smirk"], "Vous l'attirez entre vos jambes ; son rire disparaît dans le baiser qu'elle venait manifestement chercher."),
      A("Vous faites glisser sa cape tandis qu'elle ouvre votre chemise. Remerii pose encore ses bijoux près de la carte, mais vous intervertissez deux épingles et elle vous punit d'un baiser assez long pour vous faire oublier lesquelles."),
      A("Nue dans l'air frais de la galerie, Remerii garde les épaules droites et le sourire joueur. Votre regard descend sur son corps ; le sien découvre votre torse, vos hanches et votre désir déjà visible.", ["Remerii", "Je constate que notre changement de sujet produit des résultats immédiats.", "smirk"]),
      V(
        ["Elle embrasse votre cou, votre poitrine et votre ventre avec une curiosité chaude. Ses doigts reviennent souvent à vos hanches pour vous garder près d'elle."],
        ["Remerii s'agenouille, referme sa main autour de votre désir et en suit la longueur avec une lenteur provocatrice. Sa bouche frôle la pointe sans encore vous accueillir."],
        ["Remerii entoure votre désir dressé d'une main, puis sa bouche en prend lentement la pointe. Elle vous accueille plus loin à chaque reprise, garde ses doigts à la base et soutient votre regard jusqu'à ce qu'une avancée de vos hanches interrompe son sourire.", ["Remerii", "Je vous en prie. Montrez-moi si votre hypothèse tient encore.", "smirk"]],
        ["Elle descend entre vos jambes sous le bord de la couverture. Ses doigts et sa bouche trouvent le rythme qui efface votre répartie ; la chronique abandonne volontiers le dernier mot."],
      ),
      K(
        ["Quand vous l'allongez, votre main reconnaît la cicatrice sous son sein gauche. Vous la frôlez du pouce avant de poursuivre sur son ventre ; Remerii vous fait revenir d'un mouvement de hanche.", ["Remerii", "Vous n'étiez pas obligé de passer si vite. Mais ne devenez pas solennel.", "smirk"]],
        ["Votre bouche découvre la cicatrice sous son sein gauche. Remerii voit la question, mais pose un doigt sur vos lèvres avec un sourire qui ne se dérobe pas.", ["Remerii", "L'histoire est longue. J'ai pour l'instant une préférence pour les réponses courtes.", "smirk"]],
      ),
      V(
        ["Vous parcourez Remerii à votre tour, changeant de chemin chaque fois qu'elle croit vous avoir compris. Elle rit, puis sa main sur votre nuque vous guide plus bas."],
        ["Votre bouche descend sur sa poitrine et son ventre. Vos doigts trouvent sa chaleur entre les cuisses et la font venir vers votre paume."],
        ["Vous ouvrez ses cuisses et goûtez sa chaleur. Votre langue insiste sur le point sensible tandis que deux doigts entrent en elle ; Remerii tente une remarque, la perd lorsque vous recourbez le geste et vous attire plus fermement contre elle.", ["Remerii", "Je retire… non, ne ralentissez pas pour m'écouter.", "smirk"]],
        ["Vous vous glissez entre ses jambes. Remerii vous guide d'une pression sur la nuque, puis son rire étouffé cède la place à des souffles que la couverture garde pour vous."],
      ),
      A("Remerii s'assied ensuite sur vos cuisses, tourne d'abord le dos pour vous faire attendre, puis pivote face à vous sans quitter votre désir. Elle le frotte contre sa chaleur et change deux fois d'angle avant de choisir celui qui vous fait gémir ensemble."),
      V(
        ["Elle vous accueille lentement et fait rouler son bassin, vos mains à sa taille. Le plaisir vous gagne l'un après l'autre ; chaque vague se termine dans un baiser plutôt que dans un score."],
        ["Remerii vous chevauche, sa chaleur serrée autour de vous et son point sensible sous votre main. Elle jouit au milieu d'une pique inachevée ; votre propre plaisir la suit quelques mouvements plus tard."],
        ["Remerii guide votre désir en elle puis s'abaisse jusqu'à vous accueillir entièrement. Elle vous chevauche d'abord dos à vous, se retourne sans vous quitter et reprend face à vous, plus profonde. Votre main travaille son point sensible ; elle jouit autour de vous, puis continue jusqu'à vous sentir céder en elle.", ["Remerii", "Deux angles. Une conclusion. Je demeure remarquable.", "smirk"]],
        ["Elle vous entraîne sous la couverture dans un changement de position que le récit ne cherche pas à suivre. Lorsqu'elle réapparaît contre votre poitrine, son sourire affirme une victoire dont vous discuterez plus tard."],
      ),
      A("Remerii repose sur vous, une jambe encore entre les vôtres. Elle reprend son souffle, puis pointe du doigt la carte tombée hors du tapis.", ["Remerii", "Nous avons perdu notre repère.", "smirk"], ["{player}", "On le cherchera la prochaine fois."], "Elle approuve d'un baiser."),
      A("Vous vous rhabillez sans rallumer la lampe. Remerii vous rend un bouton qu'elle affirme avoir trouvé avant de reconnaître qu'il vient probablement de votre chemise.", "Elle garde ce léger désordre dans son sourire jusqu'à l'ouverture de la galerie."),
    ],
  },
  {
    id: "date-remerii-observatory-attentive-homme", context: "date-remerii-observatory", sex: "homme", mood: "attentive",
    text: "Lui laisser apprendre votre rythme sans rien démontrer", detail: "Une scène lente où Remerii mène par l'attention, reçoit sans s'effacer et demeure pleinement présente.",
    chapters: [
      A("Sous la couverture, Remerii garde votre main entre les siennes et lève les yeux vers vous avant de vous embrasser. Son autre main se pose sur votre poitrine, sent le battement qui s'y accélère et reste là jusqu'à ce que vous la rapprochiez."),
      A("Vous retirez ses épingles, puis elle ouvre votre chemise. Chaque vêtement est posé à portée de main sur le bord du tapis ; ce soin ne sert pas à contrôler la scène, seulement à lui laisser toute sa lenteur.", ["Remerii", "Je veux pouvoir me souvenir de chaque passage. Ne vous pressez pas pour me rassurer.", "calm"]),
      A("Remerii se découvre entièrement et demeure nue devant votre regard. Elle suit ensuite votre torse, votre ventre et votre désir d'une paume ouverte, attentive à ce qui change en vous sans réduire votre corps à cette seule réaction."),
      V(
        ["Ses lèvres parcourent votre cou et votre poitrine. Remerii laisse ses mains apprendre vos épaules, votre taille et vos hanches avant de chercher une proximité plus intime."],
        ["Elle embrasse votre ventre et referme doucement sa main autour de votre désir. Ses doigts varient la pression tandis que son regard demeure sur votre visage."],
        ["Remerii entoure votre désir dressé d'une main chaude, puis le prend dans sa bouche avec lenteur. Elle garde ses doigts à la base, accueille chaque mouvement sans hâter le suivant et vous laisse régler la profondeur par une main posée sur son épaule.", ["Remerii", "Je préfère vous sentir répondre que vous entendre prétendre aller bien.", "calm"]],
        ["Elle descend devant vous et suit vos réactions avec une attention silencieuse. Le bord de la couverture remonte, laissant hors champ le mouvement que votre main accompagne."],
      ),
      K(
        ["Votre paume retrouve la cicatrice connue sous son sein gauche. Remerii y appuie sa main sur la vôtre, puis laisse vos doigts repartir sur sa peau sans ouvrir le passé.", ["Remerii", "Vous connaissez cette marque. Ce soir, regardez seulement la femme qui la porte.", "calm"]],
        ["Vous apercevez la cicatrice sous son sein gauche. Votre main s'arrête à côté ; Remerii la prend et décide elle-même de la poser dessus.", ["Remerii", "Je vous raconterai peut-être. Je ne veux pas que votre désir recule devant elle.", "calm"]],
      ),
      V(
        ["Vous l'allongez sur la couverture et suivez ses indications discrètes. Elle vous ramène lorsqu'un baiser lui plaît, change l'angle de votre main et reste active dans chaque choix."],
        ["Votre bouche descend vers ses cuisses tandis que votre paume découvre sa chaleur. Remerii ouvre les jambes et guide votre rythme d'un mouvement lent."],
        ["Vous goûtez sa chaleur entre les cuisses et trouvez sous votre langue le point qui resserre ses jambes. Deux doigts entrent en elle ; Remerii les reçoit, ajuste leur courbe d'un mouvement de bassin et vous demande de conserver exactement cette profondeur.", ["Remerii", "Oui. Ne cherchez rien d'autre. Restez ici.", "calm"]],
        ["Vous descendez entre ses cuisses tandis que sa main vous indique le chemin. La couverture se referme et le récit laisse à ses souffles la précision de la suite."],
      ),
      A("Remerii vous ramène ensuite au-dessus d'elle et guide votre désir contre sa chaleur. Elle vous accueille lentement, une jambe autour de votre hanche, puis vous fait rouler sur le côté pour garder vos visages proches et vos corps entièrement soutenus."),
      V(
        ["Vos mouvements restent lents et profonds. Remerii atteint le plaisir sous votre main, vous garde contre elle et accompagne ensuite votre propre abandon sans rompre le baiser."],
        ["Elle bouge autour de vous avec une cadence souple, son point sensible sous vos doigts. Sa jouissance resserre l'étreinte ; quelques mouvements encore vous conduisent au même relâchement."],
        ["Couchée face à vous, Remerii vous accueille jusqu'au fond puis règle le mouvement de sa jambe sur votre hanche. Votre main caresse son point sensible ; elle jouit autour de votre désir et vous maintient en elle, reprenant une cadence lente jusqu'à sentir votre plaisir se répandre dans son étreinte.", ["Remerii", "Restez avec moi pendant que cela retombe.", "calm"]],
        ["Elle vous attire sous la couverture et choisit la proximité de votre union hors du regard du récit. Quand la scène revient, vos corps sont encore noués sur le tapis."],
      ),
      A("Remerii pose sa tête sur votre épaule. Vous sentez sa respiration retrouver sa profondeur pendant que ses doigts suivent lentement votre avant-bras.", ["Remerii", "Je n'ai pas eu besoin de savoir avant vous ce qui serait juste. C'est reposant.", "calm"]),
      A("Vous vous rhabillez assis l'un près de l'autre. Elle remet une épingle, garde les autres dans sa main et vous demande de rester encore quelques minutes sous la couverture.", "Le ciel demeure visible au-dessus de vous, mais aucun de vous ne cherche à nommer ce qu'il voit."),
    ],
  },
  {
    id: "date-remerii-observatory-elan-homme", context: "date-remerii-observatory", sex: "homme", mood: "elan",
    text: "Accueillir l'élan qui la fait venir sur vous", detail: "Une scène directe et spontanée où Remerii prend le dessus, change de position et exprime son désir sans détour.",
    chapters: [
      A("Remerii vous tire sur la couverture et vient aussitôt à califourchon sur vos cuisses. Sa bouche cherche la vôtre avant que vous soyez complètement allongé.", ["Remerii", "Je sais exactement ce que je veux maintenant. Pour une fois, je refuse d'en faire un avantage théorique.", "strict"]),
      A("Elle ouvre votre chemise et repousse le tissu sous vos épaules tandis que vous défaites sa tenue. Vous l'aidez à sortir d'une manche, puis Remerii arrache presque la seconde dans son empressement.", "La cape protège les instruments de vos vêtements abandonnés. Le reste du tapis vous appartient."),
      A("Nue au-dessus de vous, Remerii laisse l'air frais parcourir son dos et votre regard suivre sa poitrine jusqu'à ses hanches. Elle ouvre elle-même votre dernier vêtement et prend votre désir dans sa main sans baisser les yeux.", ["Remerii", "Ne confondez pas vitesse et absence d'attention. Je vous écoute parfaitement.", "strict"]),
      V(
        ["Elle parcourt votre torse et votre ventre de baisers rapides, puis revient à votre bouche dès que vous prononcez son prénom."],
        ["Remerii referme sa main autour de votre désir et le caresse plus fermement à mesure que vos hanches répondent. Sa bouche suit bientôt sa paume."],
        ["Remerii prend votre désir dressé en main, en goûte la pointe puis vous accueille dans sa bouche avec une impatience maîtrisée. Elle garde une paume à votre base et l'autre sur votre hanche, vous autorisant à avancer jusqu'à la profondeur qu'elle choisit avant de reprendre elle-même une cadence vive.", ["Remerii", "Oui. Comme cela. Ne ralentissez que si je vous le demande.", "strict"]],
        ["Elle descend sur vous et sa main vous montre clairement le mouvement qu'elle désire. Le récit recule devant l'empressement de sa bouche et la réponse de vos hanches."],
      ),
      K(
        ["Votre main glisse sur la cicatrice connue sous son sein gauche. Remerii la maintient là tout en poursuivant son mouvement sur vous, regard franc et désir intact.", ["Remerii", "Je suis entière. Ne traitez aucune partie de moi comme une interruption.", "strict"]],
        ["Vous découvrez la cicatrice sous son sein gauche lorsque Remerii se penche. Elle voit votre surprise, couvre brièvement vos doigts et les garde sur elle.", ["Remerii", "Une ancienne blessure. Vous pouvez me poser la question demain.", "strict"]],
      ),
      V(
        ["Vous la faites rouler sous vous. Remerii accueille le renversement avec un sourire et place vos mains là où elle veut les sentir, impatiente mais jamais silencieuse sur son choix."],
        ["Votre bouche descend sur sa poitrine et votre paume entre ses cuisses. Elle ouvre les jambes, relève les hanches et réclame plus de pression."],
        ["Vous ouvrez ses cuisses et goûtez sa chaleur. Votre langue reste sur son point sensible pendant que deux doigts entrent en elle ; Remerii guide leur profondeur par son bassin, serre votre nuque et vous demande une cadence plus rapide jusqu'à perdre le reste de sa phrase.", ["Remerii", "Plus profond… oui. Continuez.", "strict"]],
        ["Vous descendez entre ses jambes et Remerii vous attire sans détour. La couverture suit vos épaules ; la chronique laisse son désir guider le reste."],
      ),
      A("Elle vous ramène sur le dos, se place au-dessus de vos hanches et frotte sa chaleur le long de votre désir. Remerii le guide ensuite à son entrée, s'abaisse à moitié, remonte pour vous faire attendre puis vous accueille entièrement dans un même mouvement franc."),
      V(
        ["Elle vous chevauche dans une cadence pleine mais attentive, vos mains sur ses hanches. Son plaisir vient sous votre pouce ; elle se penche pour vous embrasser et vous accompagne peu après jusqu'au vôtre."],
        ["Remerii roule des hanches autour de vous, son point sensible sous vos doigts. Elle jouit sans ralentir longtemps et reprend jusqu'à ce que votre propre plaisir rompe votre souffle."],
        ["Remerii vous chevauche avec des mouvements profonds, les mains appuyées sur votre poitrine. Votre pouce travaille son point sensible ; sa jouissance serre votre désir en elle, la fait ralentir une seconde, puis elle repart plus vite et vous garde au fond d'elle lorsque votre plaisir se libère.", ["Remerii", "Oui… restez en moi. Voilà.", "strict"]],
        ["Elle vous accueille sous le pan de couverture et prend elle-même la cadence. Lorsque le récit revient, Remerii est toujours sur vous, front posé contre le vôtre."],
      ),
      A("Remerii se laisse glisser contre votre poitrine, encore parcourue de petits frissons. Sa main reste sur votre ventre et elle rit doucement en apercevant la lunette couverte.", ["Remerii", "Notre soirée était consacrée à l'observation. Je ne considère pas le programme trahi.", "smirk"]),
      A("Vous rassemblez vos vêtements et les épingles éparses. Remerii remet sa cape sur ses épaules nues avant de finir de s'habiller, puis la partage un instant avec vous.", "Elle déverrouille finalement la galerie, mais garde vos doigts entre les siens dans l'escalier."),
    ],
  },
  {
    id: "home-remerii-complice-femme", context: "home-remerii", sex: "femme", mood: "complice",
    text: "Faire du dernier jeton le début d'une partie sans règles", detail: "Une scène domestique et joueuse qui traverse votre logis au gré des provocations et des reprises.",
    chapters: [
      A("Remerii vient reprendre le jeton caché contre vous. Ses doigts trouvent d'abord le tissu, puis votre taille ; lorsqu'elle récupère enfin sa mise, elle la pose sur votre épaule et vous embrasse pour l'empêcher de tomber.", ["Remerii", "S'il atteint le sol, vous perdez.", "smirk"]),
      A("Vous traversez le salon sans laisser le jeton chuter, chacune ouvrant les vêtements de l'autre entre deux baisers. Il roule finalement entre vos poitrines lorsque Remerii retire votre dernier haut.", ["Remerii", "Égalité. Nous allons devoir trouver une épreuve décisive.", "smirk"], "Elle le laisse sur la table de nuit et oublie aussitôt de le surveiller."),
      A("Nue dans votre chambre, Remerii ne connaît ni l'endroit où tombe la meilleure lumière ni celui où vous rangez les couvertures. Elle vous laisse la guider jusqu'au lit, puis s'y installe avec une aisance qui transforme peu à peu votre espace en lieu partagé.", "Son regard parcourt votre corps de femme et son sourire perd toute retenue mondaine."),
      V(
        ["Elle vous attire sur elle et parcourt votre dos, votre poitrine puis vos hanches. Chaque caresse est ponctuée d'une petite provocation murmurée contre votre bouche."],
        ["Remerii suit vos seins et votre ventre, puis glisse une main entre vos cuisses. Elle y trouve votre chaleur, sourit et vous fait rouler sous elle."],
        ["Remerii ouvre vos jambes sur le lit et laisse ses doigts glisser dans votre chaleur humide. Son pouce trouve le point sensible ; elle entre en vous lentement, attend que vos hanches reviennent vers sa main puis accélère avec un sourire qui vous défie encore.", ["Remerii", "Je crois que vous venez de perdre une seconde fois.", "smirk"]],
        ["Elle vous entraîne sous votre propre couverture, une main déjà entre vos cuisses. La chronique laisse le jeton seul témoin de la manière dont votre jeu se poursuit."],
      ),
      K(
        ["Votre bouche retrouve la cicatrice connue sous son sein gauche. Remerii pose le jeton à côté de la marque, vous laisse l'y reprendre des lèvres, puis l'envoie rouler hors du lit d'une pichenette.", ["Remerii", "Cette pièce vient de perdre toute importance. Vous, non.", "smirk"]],
        ["Vous découvrez la cicatrice sous son sein gauche. Remerii voit votre hésitation, pose le jeton un instant à côté de la marque puis le chasse du lit.", ["Remerii", "Une vieille histoire. Je préfère nettement celle que nous écrivons ici.", "smirk"]],
      ),
      V(
        ["Vous la renversez dans vos oreillers et explorez son corps à votre tour. Remerii tente de deviner votre prochain geste ; vous changez de chemin dès qu'elle parle."],
        ["Votre bouche descend sur sa poitrine et son ventre. Votre main trouve sa chaleur, et elle ouvre les cuisses en réclamant une revanche plus précise."],
        ["Vous goûtez Remerii entre les cuisses, votre langue sur le point qui lui fait perdre sa répartie. Deux doigts entrent en elle et reprennent la cadence de son bassin ; elle agrippe votre drap, tente encore de parler puis vous guide plus fermement par la nuque.", ["Remerii", "Vous trichez… continuez.", "smirk"]],
        ["Vous vous glissez entre ses jambes et Remerii tire la couverture sur vos épaules. Son rire s'étouffe contre votre bouche, puis la scène se poursuit à l'abri du récit."],
      ),
      A("Elle vous ramène ensuite tête-bêche sur le lit, change d'avis lorsque vos jambes se heurtent au mur et vous fait pivoter sur le côté. Vos mains se retrouvent entre vos deux chaleurs ; aucune de vous ne mène assez longtemps pour revendiquer la manche."),
      V(
        ["Vous atteignez le plaisir presque ensemble, enlacées au milieu de votre lit défait. Remerii garde sa main sur vous pendant que la vôtre l'accompagne au dernier frisson."],
        ["Ses doigts poursuivent en vous tandis que les vôtres pressent sa chaleur. Elle jouit contre votre cuisse, puis reprend la cadence qui vous fait céder à votre tour."],
        ["Couchée sur le côté, Remerii garde deux doigts en vous pendant que votre main entre à son tour dans sa chaleur. Vos pouces trouvent vos points sensibles ; sa jouissance serre votre main, la vôtre vous fait vous cambrer contre elle, et vos gestes deviennent trop irréguliers pour décider laquelle a gagné.", ["Remerii", "Je réclame officiellement le match nul.", "smirk"]],
        ["La couverture enveloppe votre dernier renversement. Lorsque la chronique revient, vous êtes emmêlées au milieu du lit, et Remerii tient le jeton retrouvé entre deux doigts tremblants."],
      ),
      A("Remerii pose le jeton sur votre ventre et dessine un cercle autour du bout du doigt. Elle ne tente plus de ranger la chambre ni de retrouver la position initiale des oreillers.", ["Remerii", "Cette maison possède d'excellentes règles. Surtout celles que nous venons d'inventer.", "smirk"]),
      A("Vous restez nues sous la couverture, vos vêtements dispersés entre le salon et la chambre. Remerii lance le jeton vers la table, le manque et décide qu'il restera au sol jusqu'au matin.", "Elle revient se blottir contre vous avec un rire léger, déjà chez elle sans avoir eu besoin de le déclarer."),
    ],
  },
  {
    id: "home-remerii-attentive-femme", context: "home-remerii", sex: "femme", mood: "attentive",
    text: "L'accueillir dans vos habitudes et prendre le temps de la regarder", detail: "Une intimité familière, lente et active, où Remerii apprend votre espace autant que votre corps.",
    chapters: [
      A("Remerii s'installe à votre place favorite et soulève la couverture. Lorsque vous venez près d'elle, elle ne vous attire pas immédiatement ; elle ajuste le tissu autour de vos épaules puis pose sa bouche sur votre tempe.", "Votre baiser commence sans quitter le salon, entouré par les objets ordinaires de votre soirée."),
      A("Elle retire votre vêtement comme si elle apprenait une habitude de plus, attentive à l'endroit où vous posez naturellement chaque pièce. Vous l'aidez à défaire sa robe et Remerii laisse son bracelet à côté de votre tasse plutôt que de chercher un rangement plus digne.", ["Remerii", "Je saurai le retrouver. Je commence à connaître cette table.", "calm"]),
      A("Nue dans votre logis, Remerii laisse la couverture glisser jusqu'à sa taille. Elle accepte votre regard sur sa poitrine, son ventre et ses jambes, puis découvre votre corps de femme avec des paumes lentes.", "Elle vous demande d'un geste si vous préférez rester ici ou gagner la chambre ; votre main dans la sienne donne la direction."),
      V(
        ["Dans le lit, Remerii suit vos épaules, vos seins et vos hanches de baisers patients. Elle apprend la façon dont vous vous installez, puis vient épouser cet espace sans le corriger."],
        ["Sa bouche descend sur votre poitrine et votre ventre. Une main glisse entre vos cuisses, trouve votre chaleur et reste là jusqu'à sentir vos jambes s'ouvrir davantage."],
        ["Remerii s'allonge près de vous et laisse ses doigts parcourir votre chaleur humide. Elle ouvre doucement vos lèvres, entre en vous avec deux doigts et maintient son pouce sur le point sensible qui répond le plus nettement, son regard posé sur votre visage.", ["Remerii", "Je vous suis. Montrez-moi seulement quand vous voulez davantage.", "calm"]],
        ["Elle vous rejoint sous la couverture et sa main descend entre vos jambes. Le récit abandonne aux draps familiers la précision de cette découverte."],
      ),
      K(
        ["Vous reconnaissez la cicatrice sous son sein gauche lorsque Remerii s'étend dans votre lit. Vous la touchez avec la même douceur que le reste de sa peau ; elle couvre vos doigts, puis les laisse reprendre leur chemin.", ["Remerii", "Ici, elle ressemble moins à une preuve. Cela me plaît.", "calm"]],
        ["La lumière de votre chambre révèle la cicatrice sous son sein gauche. Remerii ne se couvre pas. Elle garde votre main à côté de la marque, sans vous en offrir la cause.", ["Remerii", "Elle est ancienne. Je préfère que vous me découvriez sans résumer mon corps à cette question.", "calm"]],
      ),
      V(
        ["Vous l'accueillez à votre tour dans l'espace du lit et parcourez sa peau sans chercher à reproduire exactement ses gestes. Remerii vous guide d'une main, puis laisse ses hanches répondre."],
        ["Votre bouche descend de sa poitrine à l'intérieur de ses cuisses. Elle ouvre les jambes, place votre paume sur sa chaleur et vous indique le rythme qu'elle veut."],
        ["Vous goûtez Remerii entre les cuisses, lente et attentive à chaque mouvement de son bassin. Votre langue garde son point sensible tandis que deux doigts glissent en elle ; sa main vous guide, puis se détend dans vos cheveux lorsque vous avez trouvé la cadence.", ["Remerii", "Oui. Je n'ai rien à corriger.", "calm"]],
        ["Vous passez sous la couverture et Remerii vous accueille entre ses jambes. Ses doigts dans vos cheveux donnent le seul guide dont le récit ait besoin avant de s'effacer."],
      ),
      A("Vous revenez face à face au milieu du lit. Une de ses jambes se glisse entre les vôtres ; sa main demeure sur votre chaleur pendant que la vôtre trouve la sienne. Vos mouvements prennent le rythme souple de deux corps qui n'ont aucun horaire à respecter."),
      V(
        ["Le plaisir vous rejoint dans une lenteur continue. Remerii vous garde contre son épaule lorsque vous cédez, puis vient à son tour sous votre main sans perdre le contact de vos lèvres."],
        ["Ses doigts poursuivent en vous tandis que votre paume caresse sa chaleur. Votre jouissance arrive la première ; elle vous laisse revenir à elle et atteint la sienne contre votre main."],
        ["Remerii garde deux doigts en vous et son pouce sur votre point sensible. Votre main entre dans sa chaleur, votre paume pressée contre elle ; vos bassins accompagnent la cadence. Vous jouissez contre sa main, puis prolongez votre geste jusqu'à la sentir se contracter autour de vos doigts et trembler dans vos bras.", ["Remerii", "Restez exactement ainsi.", "calm"]],
        ["La couverture se referme sur vos mains et vos souffles. Quand la scène revient, Remerii repose dans vos oreillers comme si elle connaissait depuis longtemps leur place."],
      ),
      A("Vous lui apportez de l'eau sans quitter longtemps le lit. Remerii boit, vous tend le verre à son tour puis remet une mèche derrière votre oreille.", ["Remerii", "Votre maison est moins silencieuse avec deux respirations. Je crois que je préfère cela.", "calm"]),
      A("Elle ne cherche pas ses vêtements. Son bracelet reste près de la tasse, sa cape dans l'entrée et sa robe au pied du lit.", "Remerii se tourne vers vous sous la couverture, retrouve votre bouche dans l'obscurité et choisit de laisser le matin décider du reste."),
    ],
  },
  {
    id: "home-remerii-elan-femme", context: "home-remerii", sex: "femme", mood: "elan",
    text: "La laisser prendre possession de l'instant, pas de la maison", detail: "Une envie directe et spontanée qui commence dans le salon, change de pièce et garde votre logis vivant autour d'elle.",
    chapters: [
      A("Remerii pose sa tasse sans regarder où, vous saisit par la taille et vous embrasse contre le premier meuble assez solide. Le bois grince ; elle s'arrête une seconde, vous regarde, puis rit.", ["Remerii", "La chambre. Je veux pouvoir recommencer sans établir de rapport sur les dégâts.", "smirk"]),
      A("Vous gagnez la pièce en ouvrant vos vêtements l'une sur l'autre. Remerii abandonne sa robe dans le couloir, votre haut près de la porte et le dernier de ses bijoux sur la table de nuit.", "Elle voit chacun de ces objets quitter sa place habituelle et poursuit pourtant sans la moindre tentative de retour."),
      A("Nue devant votre lit, Remerii vous attire à elle et retire elle-même le tissu qui couvre encore votre corps. Son regard descend sur vos seins, votre ventre et la chaleur déjà visible entre vos cuisses.", ["Remerii", "J'aime beaucoup votre manière de m'accueillir. Approchez davantage.", "strict"]),
      V(
        ["Elle vous fait tomber avec elle sur le lit et parcourt votre corps de baisers avides. Ses mains restent attentives même lorsque ses gestes se pressent."],
        ["Sa bouche suit votre poitrine et votre ventre tandis qu'une cuisse se glisse entre les vôtres. Remerii sent votre chaleur et intensifie le mouvement."],
        ["Remerii ouvre vos cuisses et glisse aussitôt deux doigts dans votre chaleur humide. Son pouce presse le point sensible, sa bouche descend pour le remplacer et ses doigts se courbent en vous avec une cadence vive qu'elle ajuste dès que votre souffle change.", ["Remerii", "Ne retenez pas votre voix. Nous sommes chez vous.", "strict"]],
        ["Elle vous allonge et disparaît entre vos jambes sous le drap. La maison garde le bruit de vos souffles et le récit vous laisse entièrement l'instant."],
      ),
      K(
        ["Votre main retrouve la cicatrice connue sous son sein gauche lorsque vous renversez Remerii. Elle vous laisse y poser la bouche, puis guide votre visage plus bas avec une impatience claire.", ["Remerii", "Vous la connaissez. Maintenant, continuez à me connaître.", "strict"]],
        ["Vous découvrez la cicatrice sous son sein gauche en la faisant rouler sous vous. Remerii intercepte votre question d'un baiser et garde votre main sur elle.", ["Remerii", "Demain, peut-être. Cette nuit, ne vous arrêtez pas à une marque.", "strict"]],
      ),
      V(
        ["Vous reprenez l'initiative et Remerii s'ouvre à vos baisers sans ralentir l'élan. Elle vous montre d'une main où elle veut être touchée."],
        ["Votre bouche descend sur son ventre et votre paume trouve sa chaleur. Remerii écarte les jambes, relève les hanches et vous demande plus ferme."],
        ["Vous goûtez sa chaleur ouverte, votre langue rapide sur son point sensible. Deux doigts entrent en elle et suivent ses mouvements de bassin ; Remerii serre votre nuque, vous attire plus près et réclame chaque reprise d'une voix devenue brève.", ["Remerii", "Encore. Plus profond… oui.", "strict"]],
        ["Vous vous glissez entre ses cuisses et Remerii vous guide sans détour. Le drap suit vos épaules ; la chronique abandonne la suite à son désir pleinement exprimé."],
      ),
      A("Elle vous ramène au-dessus d'elle, puis change brusquement d'idée et vient s'asseoir sur vos cuisses. Vos jambes s'entrelacent ; Remerii presse sa chaleur contre la vôtre et vous demande votre main entre vos corps pendant que la sienne retrouve votre point le plus sensible."),
      V(
        ["Vos mouvements francs vous conduisent au plaisir dans la même étreinte. Remerii jouit contre votre paume et garde ses doigts sur vous jusqu'à sentir votre propre abandon."],
        ["Elle frotte sa chaleur contre votre cuisse tandis que ses doigts travaillent la vôtre. Sa jouissance arrive la première ; elle reprend aussitôt la cadence qui vous fait céder."],
        ["Remerii roule son bassin contre votre chaleur, deux de vos doigts profondément en elle tandis que les siens entrent en vous. Vos pouces maintiennent chacun un point sensible. Elle jouit en se serrant autour de votre main, vous attire plus fort et poursuit jusqu'à ce que votre propre jouissance vous fasse trembler sous elle.", ["Remerii", "Voilà pourquoi je ne voulais plus attendre.", "strict"]],
        ["Le drap recouvre votre union et vos changements de position. Lorsque le récit revient, Remerii est étendue sur vous, haletante, sa main encore nouée à la vôtre."],
      ),
      A("Elle lève les yeux vers votre chambre comme si elle la découvrait enfin après coup. Un sourire chaud apparaît lorsqu'elle aperçoit sa robe dans l'encadrement et votre vêtement plus loin.", ["Remerii", "Votre maison vient de gagner un itinéraire extrêmement convaincant.", "smirk"]),
      A("Vous ne ramassez rien. Remerii tire la couverture autour de vous, se blottit contre votre poitrine et laisse sa tête occuper votre oreiller.", "Sa dernière initiative est un baiser plus lent, prolongé jusqu'à ce que le silence domestique reprenne naturellement autour de vous."),
    ],
  },
  {
    id: "home-remerii-complice-homme", context: "home-remerii", sex: "homme", mood: "complice",
    text: "Jouer la dernière manche jusque dans votre chambre", detail: "Une scène vive et domestique où Remerii transforme les objets familiers en prétextes, sans traiter le désir comme une épreuve.",
    chapters: [
      A("Remerii vient reprendre le jeton caché sous votre chemise. Elle le trouve contre votre poitrine, le fait rouler jusqu'à votre ventre puis le récupère entre deux doigts.", ["Remerii", "Trop simple. Je vais devoir augmenter l'enjeu.", "smirk"], "Elle vous embrasse et glisse le jeton dans son propre décolleté avant de reculer vers la chambre."),
      A("Vous la suivez en ouvrant sa robe pendant qu'elle défait votre chemise. Le jeton tombe quelque part dans le couloir ; Remerii s'immobilise, écoute le bruit, puis décide que le retrouver ruinerait considérablement la partie.", "Vos vêtements marquent le reste du chemin jusqu'au lit."),
      A("Nue dans votre chambre, Remerii s'assied au bord du lit et vous attire entre ses jambes. Son regard découvre votre corps d'homme avec une franchise joueuse ; sa main suit votre ventre jusqu'au désir qu'elle a déjà fait naître.", ["Remerii", "Voilà un enjeu plus intéressant que cinq jetons.", "smirk"]),
      V(
        ["Elle parcourt votre poitrine et vos hanches de baisers, puis vous fait asseoir pour pouvoir rester entre vos jambes. Sa main garde votre désir contre sa paume sans le presser."],
        ["Remerii descend sur votre ventre et entoure votre désir de ses doigts. Sa bouche frôle la pointe, s'en écarte avec un sourire, puis revient lorsque vous prononcez son nom."],
        ["Remerii s'agenouille devant vous et prend votre désir dressé dans sa main. Sa langue en suit la pointe, puis sa bouche vous accueille plus profondément ; elle alterne plusieurs rythmes, conserve celui qui fait avancer vos hanches et vous regarde perdre toute envie de plaisanter.", ["Remerii", "Je crois avoir trouvé où vous cachiez réellement votre mise.", "smirk"]],
        ["Elle s'installe entre vos jambes, sa main et sa bouche transformant votre jeu en quelque chose de plus sérieux. La chronique se retire avant que vous perdiez complètement la parole."],
      ),
      K(
        ["Vous retrouvez la cicatrice connue sous son sein gauche en ramenant Remerii sur le lit. Vous y cachez le jeton retrouvé, puis le reprenez d'un baiser ; elle rit et l'envoie rouler hors du drap.", ["Remerii", "Ce n'est plus une case de jeu. Revenez à moi.", "smirk"]],
        ["Votre bouche découvre la cicatrice sous son sein gauche. Remerii y pose le jeton une seconde, moins pour masquer la marque que pour détourner votre question.", ["Remerii", "Une ancienne blessure. Le reste ne se gagne pas à cette manche.", "smirk"]],
      ),
      V(
        ["Vous allongez Remerii et reprenez la partie sur son corps. Elle devine deux de vos baisers, se trompe au troisième et perd sa répartie lorsque vous descendez davantage."],
        ["Votre bouche suit sa poitrine et son ventre tandis que votre main glisse entre ses cuisses. Sa chaleur vient contre vos doigts avant qu'elle vous demande plus ferme."],
        ["Vous ouvrez ses cuisses et goûtez sa chaleur. Votre langue insiste sur le point sensible tandis que deux doigts entrent en elle ; Remerii recourbe elle-même votre geste d'un mouvement de bassin et s'accroche aux draps lorsque vous gardez cette cadence.", ["Remerii", "Je retire ma dernière objection… ne changez rien.", "smirk"]],
        ["Vous disparaissez entre ses jambes sous votre couverture. Ses doigts vous guident, puis son rire se perd dans un souffle que le récit laisse à la chambre."],
      ),
      A("Remerii vient ensuite au-dessus de vous, votre désir glissant contre sa chaleur. Elle vous fait attendre en comptant silencieusement sur ses doigts, s'interrompt au troisième et vous accueille avant la fin d'une règle qu'elle vient d'abandonner."),
      V(
        ["Elle vous chevauche lentement, vos mains sur ses hanches. Le plaisir la rejoint sous votre pouce ; Remerii continue jusqu'à votre propre abandon et vous embrasse comme conclusion suffisante."],
        ["Sa chaleur se resserre autour de vous tandis qu'elle roule des hanches. Elle jouit sous votre main, reprend plusieurs mouvements courts et vous entraîne avec elle."],
        ["Remerii descend sur votre désir jusqu'à vous accueillir entièrement, puis roule des hanches avec une cadence joueuse et profonde. Votre pouce travaille son point sensible ; elle jouit autour de vous, vous serre au fond d'elle et repart plus vite jusqu'à sentir votre plaisir se libérer dans son corps.", ["Remerii", "Manche décisive. Résultat remarquablement partagé.", "smirk"]],
        ["Elle vous chevauche sous le drap et abandonne le résultat à vos corps. Quand la chronique revient, Remerii repose sur votre poitrine et tient entre ses doigts le jeton enfin retrouvé."],
      ),
      A("Elle pose le jeton au creux de votre paume, puis referme vos doigts dessus.", ["Remerii", "Gardez-le. Vous aurez besoin d'une mise lorsque je réclamerai la revanche.", "smirk"], "Sa bouche revient sur la vôtre avant que vous puissiez demander quand."),
      A("Ses vêtements restent dans le couloir et son bracelet près de votre tasse. Remerii choisit de ne rien récupérer avant le matin.", "Elle tire votre couverture sur vos deux corps, s'installe contre vous et laisse votre maison conserver le désordre exact de son passage."),
    ],
  },
  {
    id: "home-remerii-attentive-homme", context: "home-remerii", sex: "homme", mood: "attentive",
    text: "Partager votre place et lui confier le rythme de la nuit", detail: "Une intimité lente, familière et mutuelle, où Remerii habite votre espace sans chercher à le corriger.",
    chapters: [
      A("Sous la couverture du salon, Remerii garde sa tasse entre les mains jusqu'à ce que vous la posiez avec la vôtre. Elle se tourne alors entièrement vers vous et vous embrasse, sa paume ouverte sur votre poitrine.", "Le canapé, la lampe et la table restent simplement ce qu'ils sont : les repères familiers d'une soirée qui change doucement."),
      A("Elle ouvre votre chemise et vous l'aidez à défaire sa robe. Remerii pose chaque vêtement là où votre maison offre de la place, sans aligner ni déplacer ce qui s'y trouve déjà.", ["Remerii", "Je comprends pourquoi vous gardez cette couverture ici. Elle risque de nous suivre.", "calm"]),
      A("Nue dans votre salon, Remerii laisse votre regard parcourir sa poitrine, son ventre et ses jambes. Elle découvre votre corps d'homme de la même manière, sans hâte ; ses doigts suivent votre ventre et s'arrêtent sur votre désir avant de vous proposer la chambre d'un regard."),
      V(
        ["Allongée près de vous, elle embrasse votre cou et votre poitrine. Sa main repose sur votre hanche, puis suit lentement le désir qu'elle sent contre elle."],
        ["Remerii descend sur votre ventre et entoure votre désir d'une paume attentive. Elle en apprend la pression et la cadence sur vos réactions avant d'y poser la bouche."],
        ["Remerii prend votre désir dressé dans sa main et laisse sa langue en parcourir la pointe. Sa bouche vous accueille ensuite par lentes reprises, une main gardée à la base ; elle suit chaque mouvement de vos hanches et vous laisse régler la profondeur sans détourner les yeux.", ["Remerii", "Je ne suis pas pressée. Donnez-moi votre rythme réel.", "calm"]],
        ["Elle se glisse entre vos jambes sous la couverture venue du salon. Votre main sur sa nuque répond à chacun de ses gestes, puis le récit vous laisse cette lenteur."],
      ),
      K(
        ["Votre main reconnaît la cicatrice sous son sein gauche. Dans votre lit, Remerii la laisse reposer là sans tension, puis pose sa paume sur votre poitrine comme une réponse égale.", ["Remerii", "Vous savez d'où elle vient. Ici, je veux seulement choisir ce qu'elle reçoit.", "calm"]],
        ["Vous découvrez une cicatrice sous son sein gauche. Remerii ne se dérobe pas, mais garde vos doigts dans les siens avant de les reposer sur sa peau.", ["Remerii", "Elle n'est pas dangereuse à toucher. Son histoire peut attendre le matin.", "calm"]],
      ),
      V(
        ["Vous parcourez son corps avec une lenteur semblable. Remerii vous guide lorsqu'elle le souhaite, puis accepte de ne pas savoir d'avance quel baiser la fera trembler."],
        ["Votre bouche descend sur sa poitrine et son ventre. Une main trouve sa chaleur entre les cuisses ; elle les ouvre et vient chercher la pression de vos doigts."],
        ["Vous goûtez sa chaleur ouverte, votre langue attentive au point qui fait monter son bassin. Deux doigts glissent en elle et suivent la cadence qu'elle vous indique d'une pression de la main ; Remerii cesse de parler lorsque vous la trouvez, puis revient à votre prénom.", ["Remerii", "Oui… gardez cela. Seulement cela.", "calm"]],
        ["Vous la rejoignez entre les cuisses sous votre couverture. Remerii vous guide sans expliquer, et le récit laisse ses souffles répondre à votre bouche."],
      ),
      A("Elle vous attire ensuite au-dessus d'elle, guide votre désir contre sa chaleur puis vous accueille lentement. Après quelques mouvements, Remerii vous fait rouler sur le côté, préférant garder vos visages proches et votre poids partagé par le lit."),
      V(
        ["Votre union conserve une cadence douce et profonde. Remerii atteint la jouissance sous votre main, reste autour de vous et vous accompagne jusqu'à votre propre plaisir dans le même baiser."],
        ["Elle bouge lentement autour de vous tandis que vos doigts entretiennent son point sensible. Son plaisir serre l'étreinte ; plusieurs mouvements encore vous conduisent au vôtre."],
        ["Remerii vous accueille profondément, couchée face à vous avec une jambe passée sur votre hanche. Votre main reste entre vos bassins ; elle jouit autour de votre désir, maintient l'étreinte et reprend une cadence lente jusqu'à sentir votre plaisir se répandre en elle.", ["Remerii", "Restez ici pendant que je vous sens encore.", "calm"]],
        ["Elle vous attire sous la couverture et choisit une proximité que le récit ne détaille pas. Lorsqu'il revient, vos jambes sont encore mêlées et sa main repose sur votre poitrine."],
      ),
      A("Remerii boit au verre que vous lui apportez, puis vous le tend. Elle replace la couverture sur vos épaules sans couvrir entièrement son propre corps.", ["Remerii", "Je pensais être invitée dans votre maison. J'ai l'impression que vous m'avez fait une place.", "calm"]),
      A("Elle laisse sa robe au pied du lit et son bracelet dans le salon. Aucun horaire de départ n'est prononcé.", "Remerii s'allonge contre vous, écoute un instant les bruits familiers du logis et ferme les yeux lorsque votre main retrouve la sienne."),
    ],
  },
  {
    id: "home-remerii-elan-homme", context: "home-remerii", sex: "homme", mood: "elan",
    text: "La suivre lorsqu'elle cesse de différer", detail: "Une scène spontanée qui commence dans le salon et laisse Remerii exprimer pleinement un désir franc, mobile et attentif.",
    chapters: [
      A("Remerii abandonne sa tasse, vous attire contre elle et vous embrasse avec une urgence qui fait heurter le bord de la table à votre hanche. Elle vous retient, vérifie votre sourire, puis désigne la chambre d'un mouvement de tête.", ["Remerii", "Je refuse que notre première décision soit de casser votre mobilier.", "smirk"]),
      A("Vous ouvrez vos vêtements dans le couloir. Elle retire votre chemise, vous faites glisser sa robe, et Remerii laisse derrière elle chaque pièce sans même suivre l'endroit où elle tombe.", "Dans la chambre, son bracelet rejoint la table de nuit ; tout le reste demeure sur le trajet."),
      A("Nue devant vous, Remerii prend votre main et la pose sur sa poitrine avant d'ouvrir elle-même votre dernier vêtement. Son regard descend sur votre corps d'homme et son désir apparaît sans détour dans la manière dont elle vous ramène contre ses hanches.", ["Remerii", "Je sais ce que je veux. Si le vôtre change, dites-le. Sinon, venez.", "strict"]),
      V(
        ["Elle vous pousse sur le lit et parcourt votre torse de baisers francs. Sa main suit votre ventre et vous garde près d'elle avec une chaleur impatiente."],
        ["Remerii descend sur votre ventre, entoure votre désir de ses doigts et le caresse fermement. Sa bouche rejoint bientôt la cadence de sa main."],
        ["Remerii s'agenouille entre vos jambes, prend votre désir dressé dans sa main et en goûte la pointe. Sa bouche vous accueille ensuite profondément, ses doigts gardés à la base ; elle accompagne vos avancées jusqu'à la limite qu'elle choisit, puis reprend plus vite sans perdre votre regard.", ["Remerii", "Oui. Cessez de retenir ce mouvement.", "strict"]],
        ["Elle se glisse entre vos jambes et vous attire vers sa bouche. La couverture suit son épaule ; le récit laisse à votre main et à votre souffle la réponse qu'elle attend."],
      ),
      K(
        ["Votre bouche retrouve la cicatrice connue sous son sein gauche lorsque vous la renversez sur votre lit. Remerii vous garde une seconde contre cette marque, puis vous attire plus bas.", ["Remerii", "Vous la connaissez. Ne laissez pas le passé ralentir ce que je choisis maintenant.", "strict"]],
        ["Vous découvrez la cicatrice sous son sein gauche au milieu de vos baisers. Remerii attrape votre regard et place fermement votre main sur elle.", ["Remerii", "Une ancienne blessure. Elle n'est pas une demande d'arrêter.", "strict"]],
      ),
      V(
        ["Vous reprenez l'initiative et Remerii s'allonge dans vos draps avec un désir visible. Elle guide vos mains sans transformer ses demandes en leçon."],
        ["Votre bouche descend sur son ventre tandis qu'une main trouve sa chaleur. Elle ouvre les cuisses, relève les hanches et réclame un rythme plus ferme."],
        ["Vous ouvrez ses jambes et goûtez sa chaleur, votre langue pressée sur son point sensible. Deux doigts entrent en elle et suivent les mouvements rapides de son bassin ; Remerii vous attire par la nuque, vous demande plus profond et perd sa voix lorsque vous gardez exactement cette cadence.", ["Remerii", "Oui… encore. Ne ralentissez plus.", "strict"]],
        ["Vous passez entre ses cuisses et Remerii vous guide sans le moindre détour. Le drap vous dérobe au récit tandis que son désir décide du rythme."],
      ),
      A("Elle vous ramène ensuite sur le dos, vient au-dessus de vos hanches et frotte sa chaleur le long de votre désir. Remerii le guide à son entrée, vous accueille en plusieurs pressions puis s'abaisse entièrement, ses mains appuyées sur votre poitrine."),
      V(
        ["Elle vous chevauche avec un élan franc, ralenti chaque fois qu'elle revient vous embrasser. Son plaisir naît sous votre main ; elle reste autour de vous jusqu'à vous accompagner au vôtre."],
        ["Remerii roule des hanches autour de vous tandis que votre pouce presse son point sensible. Elle jouit, vous accueille plus profondément encore et poursuit jusqu'à votre propre abandon."],
        ["Remerii vous chevauche en mouvements profonds et rapides, votre désir entièrement accueilli dans sa chaleur. Votre pouce travaille son point sensible ; sa jouissance serre son corps autour de vous, mais elle repart presque aussitôt et vous garde au fond d'elle lorsque votre plaisir se libère.", ["Remerii", "Oui. Maintenant. Ne vous retirez pas.", "strict"]],
        ["Elle vous accueille sous la couverture et prend elle-même la cadence. Quand la chronique revient, Remerii est toujours au-dessus de vous, les cheveux défaits et le souffle court."],
      ),
      A("Elle se laisse tomber contre votre poitrine et rit en entendant quelque chose rouler dans le couloir.", ["Remerii", "Probablement le jeton. Il peut attendre davantage que moi.", "smirk"], "Sa main reste sur votre ventre pendant que vos souffles ralentissent ensemble."),
      A("Aucun de vous ne récupère les vêtements semés jusqu'à la chambre. Remerii se glisse sous votre couverture, prend votre place habituelle contre l'oreiller et vous en offre la moitié.", "Son dernier baiser ne cherche plus l'urgence. Il installe simplement sa présence dans votre nuit."),
    ],
  },
];

function chapterLines(chapter: AuthoredChapter, mode: IntimacyMode, knowsCurse: boolean): DialogueLine[] {
  if ("all" in chapter) return dialogueLines(chapter.all);
  if ("known" in chapter) return dialogueLines(knowsCurse ? chapter.known : chapter.unknown);
  return dialogueLines(chapter[mode]);
}

function routeFromScene(scene: AuthoredScene, knowsCurse: boolean): IntimacyRoute {
  const chapters = Object.fromEntries(MODES.map((mode) => [mode, scene.chapters.map((chapter) => chapterLines(chapter, mode, knowsCurse))])) as Record<IntimacyMode, DialogueLine[][]>;
  return { id: scene.id, text: scene.text, detail: scene.detail, chapters };
}

export function remeriiIntimacyContext(dateId?: string, home = false): RemeriiIntimacyContext | undefined {
  if (home) return "home-remerii";
  return CONTEXTS.includes(dateId as RemeriiIntimacyContext) ? dateId as RemeriiIntimacyContext : undefined;
}

export function remeriiDateIntimacyPhase(chapter: number): RemeriiIntimacyPhase | undefined { return PHASES[chapter]; }
export function remeriiDateApproaches(context?: RemeriiIntimacyContext): RemeriiDateApproach[] | undefined { return context ? REMERII_INTIMACY_APPROACHES[context] : undefined; }
export function remeriiDateIntimacyOpening(context: RemeriiIntimacyContext): DialogueLine[] { return REMERII_INTIMACY_OPENINGS[context]; }
export function remeriiDateIntimacyEnding(context: RemeriiIntimacyContext): DialogueLine[] { return REMERII_INTIMACY_ENDINGS[context]; }

export function remeriiDateIntimacyRoutes(context: RemeriiIntimacyContext | undefined, sex: PlayerSex, knowsCurse = false): IntimacyRoute[] {
  if (!context || sex === "intersexe") return [];
  return SCENES.filter((scene) => scene.context === context && scene.sex === sex).map((scene) => routeFromScene(scene, knowsCurse));
}

export function validateRemeriiDateIntimacy() {
  let combinations = 0;
  let routes = 0;
  let chapters = 0;
  for (const context of CONTEXTS) for (const sex of SEXES) {
    combinations++;
    const entries = remeriiDateIntimacyRoutes(context, sex);
    if (entries.length !== 3) throw new Error(`${context}/${sex}: trois tonalités Remerii requises`);
    const moods = SCENES.filter((scene) => scene.context === context && scene.sex === sex).map((scene) => scene.mood);
    if (new Set(moods).size !== 3) throw new Error(`${context}/${sex}: les trois identités émotionnelles doivent être distinctes`);
    entries.forEach((entry) => {
      routes++;
      MODES.forEach((mode) => {
        if (entry.chapters[mode].length !== PHASES.length || entry.chapters[mode].some((chapter) => chapter.length === 0)) throw new Error(`${entry.id}/${mode}: dix séquences substantielles requises`);
        chapters += entry.chapters[mode].length;
      });
    });
  }
  if (remeriiDateIntimacyRoutes("home-remerii", "intersexe").length !== 0) throw new Error("Le canon intersexe ne doit pas être fixé par la refonte Remerii");
  return { contexts: CONTEXTS.length, combinations, routes, chapters };
}

validateRemeriiDateIntimacy();
