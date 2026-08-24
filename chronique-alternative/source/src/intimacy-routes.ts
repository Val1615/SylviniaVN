import type { DialogueLine } from "./game-data";
import type { IntimacyMode, PlayerSex } from "./date-scenes";
import { individualExplicitScene } from "./individual-explicit-scenes";
import { polishIntimacyText } from "./intimacy-prose";

export type IntimacyRoute = {
  id: string;
  text: string;
  detail: string;
  chapters: Record<IntimacyMode, DialogueLine[][]>;
};

type RawLine = string | [speaker: string, text: string, mood?: string];
type SexText = Record<PlayerSex, string>;
type SexLines = Record<PlayerSex, RawLine[]>;

type RouteSeed = {
  id: string;
  labels: SexText;
  detail: string;
  prelude: SexText;
  setup: RawLine[];
  deepening: RawLine[];
  tender: RawLine[];
  suggestive: RawLine[];
  explicit: SexLines;
  ellipse: RawLine[];
  closing: RawLine[];
  after: SexText;
};

type RouteRole = "guided" | "offered" | "mutual";
type RouteExpansion = {
  orientation: RawLine[];
  escalation: RawLine[];
  continuation: Record<IntimacyMode, RawLine[]>;
  aftercare: RawLine[];
};

const sexText = (femme: string, homme: string, intersexe: string): SexText => ({ femme, homme, intersexe });
const sexLines = (femme: RawLine[], homme: RawLine[], intersexe: RawLine[]): SexLines => ({ femme, homme, intersexe });

const lines = (raw: RawLine[], context = "individual"): DialogueLine[] => raw.map((entry) => {
  const speaker = typeof entry === "string" ? "Narration" : entry[0];
  const text = typeof entry === "string" ? entry : entry[1];
  return { speaker, text: polishIntimacyText(text, { speaker, context }), mood: typeof entry === "string" ? undefined : entry[2] };
});

const CHARACTER_NAMES: Record<string, string> = {
  hylee: "Hylee", remerii: "Remerii", iriana: "Iriana", valurn: "Valurn", naiah: "Naïah",
  lineva: "Lineva", saidin: "Saidin", bellirith: "Bellirith", amanea: "Amanea", tia: "Tia", allenna: "Allenna", draven: "Draven",
};

const FEMALE_BODY = new Set(["hylee", "remerii", "iriana", "naiah", "lineva", "bellirith", "amanea", "tia", "allenna"]);

const ORIENTATION_TEXTURES: Record<string, Record<RouteRole, string>> = {
  hylee: {
    guided: "Hylee vous fait reculer jusqu’au centre du lit, puis s’agenouille entre vos jambes sans se presser. Elle cherche votre regard une seconde ; le mouvement de vos hanches vers ses mains lui rend son sourire, et le givre qui borde ses doigts permet de suivre précisément chacun de ses déplacements.",
    offered: "Vous invitez Hylee à s’allonger sur le dos et lui montrez la position que vous souhaitez prendre. Elle pose une main sur votre nuque, vous attire dans un baiser plus décidé qu’elle ne l’imaginait et guide elle-même les premiers gestes qu’elle veut recevoir.",
    mutual: "Vous vous placez sur le côté, face à face, assez proches pour mêler vos jambes et assez libres pour renverser le jeu d’un mouvement. Hylee rougit lorsque votre cuisse trouve la sienne, puis répond avec une audace qui fait courir du givre sur les draps.",
  },
  remerii: {
    guided: "Remerii vous installe contre les oreillers, s’assure que votre nuque et vos hanches sont soutenues, puis abandonne volontairement toute autre procédure. Elle observe votre souffle, essaie d’en tirer une méthode et finit par céder lorsque vos jambes la ramènent fermement contre vous.",
    offered: "Vous guidez Remerii jusqu’au bord du lit, là où elle peut garder les pieds au sol et changer de position sans difficulté. Sa première indication est précise ; la seconde se perd contre votre bouche, et sa franchise troublée devient bientôt beaucoup moins méthodique.",
    mutual: "Vous vous allongez en diagonale, assez proches pour vous toucher et assez libres pour reprendre votre souffle. Remerii tente d’ordonner le drap soigneusement tiré, puis le froisse elle-même en vous attirant sur elle, comme une manière délicieuse de laisser la méthode derrière vous.",
  },
  iriana: {
    guided: "Iriana retire le dernier bijou qui pourrait accrocher votre peau et vous place contre les coussins avec une autorité devenue entièrement privée. Elle soutient votre regard jusqu’à ce que vos mains viennent la chercher, puis son premier geste transforme le commandement en une promesse de plaisir personnel.",
    offered: "Vous laissez Iriana choisir l’endroit où s’allonger, puis vous lui demandez de guider votre première main. Sa réponse est directe : elle pose vos doigts exactement où elle les désire, garde votre regard et affirme que la couronne ne décidera d’aucune étape.",
    mutual: "Iriana s’assied à califourchon sur vos cuisses et vous offre ses deux mains. Vous les refermez autour des vôtres avant de renverser doucement la position ; son rire surpris efface le protocole et donne à vos corps un rythme que personne n’a besoin d’ordonner.",
  },
  valurn: {
    guided: "Valurn vous fait asseoir au bord du lit et s’agenouille devant vous, le sourire encore provocateur mais les mains parfaitement immobiles. Vous choisissez la fermeté en nouant les doigts dans ses cheveux ; son regard s’assombrit de plaisir avant que sa bouche ne transforme le défi en quelque chose de beaucoup moins verbal.",
    offered: "Vous retirez à Valurn ses cartes, son verre et la possibilité de détourner la question. Il s’allonge à votre demande, jambes entrouvertes, puis vous indique d’une voix moins moqueuse où il souhaite sentir votre bouche et où vos mains doivent rester visibles.",
    mutual: "Vous vous placez de côté, une cuisse glissée entre les siennes, afin de pouvoir renverser l’initiative sans lutter. Valurn propose de compter les reprises plutôt que les victoires ; vous lui volez le premier point avec votre bouche, et il accepte la défaite sans parvenir à plaisanter.",
  },
  naiah: {
    guided: "Naïah dissipe ses doubles avant de vous allonger : une seule bouche, deux mains bien réelles et aucun reflet chargé de vous distraire. Elle suit vos réactions avec une attention presque insolente, puis fait revenir juste assez de brume pour souligner les frissons qu’elle provoque réellement.",
    offered: "Vous faites asseoir Naïah contre la tête du lit, ses mains posées à plat de chaque côté pour qu’aucune illusion ne prenne leur place. Elle choisit elle-même la première caresse, puis laisse son plaisir changer de direction sous vos gestes sans reconstruire le moindre masque.",
    mutual: "Naïah laisse un unique reflet flotter au plafond, non pour multiplier les corps mais pour vous montrer vos positions. Vos mouvements y apparaissent avec un léger retard ; ses jambes viennent chercher les vôtres dans un sourire joueur, impatiente de voir l’image tenter de vous rattraper.",
  },
  lineva: {
    guided: "Lineva dépose ses armes hors de portée, vous aide à vous allonger puis place un coussin sous vos hanches avec la même attention qu’elle accorderait à une blessure. Vos jambes se resserrent autour d’elle lorsqu’elle utilise enfin sa force pour soutenir le mouvement, et son calme se fend d’un sourire brûlant.",
    offered: "Vous invitez Lineva à remettre son poids au matelas plutôt qu’à ses épaules. Elle choisit une position où ses anciennes blessures ne tirent pas, guide votre main vers la chaleur qu’elle réclame et vous demande de ne pas confondre sa résistance habituelle avec un besoin de dureté.",
    mutual: "Vous vous installez face à face, genoux et hanches alignés, chacun capable de soutenir l’autre sans le porter entièrement. Lineva change de position une première fois au ralenti ; vous la ramenez aussitôt contre vous, et l’alternance devient un jeu au lieu d’une manœuvre.",
  },
  saidin: {
    guided: "Saidin retourne toutes les horloges avant de vous placer au centre du lit. Il commence lentement, observe chaque réaction comme si elle était imprévisible et laisse vos hanches lui révéler un présent qu’aucune vision ne lui avait montré.",
    offered: "Vous faites asseoir Saidin devant vous et lui demandez de fermer les yeux, non pour l’aveugler mais pour l’obliger à rester dans ses sensations présentes. Il pose votre main là où il veut la sentir et renonce à expliquer ce que la scène pourrait devenir.",
    mutual: "Vous vous allongez l’un contre l’autre tandis que sa montre reste fermée sur la table. Chaque changement de geste surprend Saidin ; cette petite grammaire des souffles et des mouvements remplace toutes les bifurcations qu’il pourrait autrement observer.",
  },
  bellirith: {
    guided: "Bellirith retire les enchantements visibles et vous installe au bord du lit. Sans charme pour amplifier son effet, elle laisse votre main réduire la distance entre vos deux corps et découvre dans votre empressement une réponse qui la trouble réellement.",
    offered: "Vous faites allonger Bellirith sans miroir, sans bijou et sans angle flatteur à préserver. Elle guide votre paume vers ce qu’elle désire et vous laisse voir chaque réaction avant qu’elle puisse l’embellir ; sa beauté devient plus vive à mesure que la pose disparaît.",
    mutual: "Chaque renversement devient une nouvelle manche. Bellirith cède l’initiative dans un sourire, vous la lui rendez par un baiser plus mordant ; débarrassé de magie, le duel devient lisible dans vos mains, vos regards et vos corps réels.",
  },
  amanea: {
    guided: "Amanea vous place sous sa cape ouverte, assez près pour vous envelopper sans bloquer aucun mouvement. Elle attend que votre main vienne chercher la sienne, puis sa force souveraine devient une chaleur privée qui soutient votre bassin et votre nuque.",
    offered: "Vous allongez Amanea loin de la couronne et prenez le temps de soutenir ses épaules fatiguées. Elle guide votre première main, indique la pression qu’elle veut recevoir et laisse échapper un rire rauque lorsque vos gestes la traitent enfin comme une femme plutôt que comme une puissance à ménager.",
    mutual: "Vous déposez ensemble la cape et la couronne avant de vous installer face à face. L’initiative circule avec les renversements, les baisers et les mains qui attirent ; l’égalité devient ainsi une pratique charnelle, pas une belle formule ajoutée au désir.",
  },
  tia: {
    guided: "Tia retire elle-même couronne, bijoux et gants, puis vous installe au centre des draps avec une attention presque cérémonieuse. Elle annonce ce qu’elle désire faire, attend votre mouvement vers elle et découvre que guider un plaisir choisi n’a rien d’un commandement impérial.",
    offered: "Vous demandez à Tia de s’allonger avant qu’elle puisse organiser la chambre comme une audience. Sa main conduit la vôtre vers la pression qu’elle souhaite recevoir ; chaque demande au singulier éloigne un peu plus la fonction sans prétendre que celle-ci n’existe pas.",
    mutual: "Vous convenez d’un geste simple pour transmettre l’initiative. Tia mène une première mesure, vous la renversez à la seconde, puis les rôles cessent de ressembler à des rangs dès que vos corps commencent à réclamer eux-mêmes la suite.",
  },
  allenna: {
    guided: "Allenna dépose ses gantelets et vérifie une dernière fois que rien ne gênera vos mouvements. Elle vous soutient avec la précision d’une soigneuse, mais son regard et sa bouche abandonnent bientôt toute distance clinique lorsque votre plaisir répond franchement au sien.",
    offered: "Vous faites asseoir Allenna contre les oreillers et lui demandez de ne formuler qu’une envie à la fois. Elle guide votre main, corrige l’angle sans s’excuser et accepte peu à peu de recevoir sans surveiller la porte ni préparer déjà l’urgence suivante.",
    mutual: "Vous choisissez une position où chacun peut porter puis être porté. Allenna échange la conduite comme une relève volontaire : aucune défaite, aucun corps abandonné à l’effort, seulement deux désirs qui se rendent mutuellement capables d’aller plus loin.",
  },
  draven: {
    guided: "Draven vous installe contre les oreillers avec une force qu’il garde entièrement sous contrôle. Il demande où poser ses mains, attend votre réponse et découvre que conduire un plaisir choisi n’a rien à voir avec donner un ordre à un équipage.",
    offered: "Vous faites asseoir Draven au bord du lit, assez près pour sentir toute sa tension et assez loin pour qu’il doive formuler ce qu’il veut. Lorsqu’il guide enfin votre main, le vieux militaire cède la place à un homme dont la franchise devient presque vulnérable.",
    mutual: "Vous vous placez face à face, jambes mêlées et mains libres de reprendre l’initiative. Draven tente de compter les mouvements comme une manœuvre, perd le fil à votre premier renversement et accepte dans un rire rauque qu’aucun de vous ne commande longtemps.",
  },
};

const ESCALATION_TEXTURES: Record<string, Record<RouteRole, string>> = {
  hylee: { guided: "Elle commence par votre bouche, votre gorge puis votre ventre, et le froid de ses doigts rend chaque déplacement délicieusement évident. Vos phrases raccourcissent ; Hylee suit les mouvements de votre bassin et revient là où ils deviennent les plus impatients.", offered: "Vous suivez la ligne de ses épaules jusqu’à ses hanches, en alternant paume chaude et baisers. Hylee cesse de retenir ses réactions, vous corrige une première fois puis réclame le même mouvement avec une assurance nouvelle.", mutual: "Une caresse reçue devient aussitôt une proposition rendue. Le givre dessine le trajet de vos mains sur vos deux peaux, si bien que chaque changement d’initiative devient un défi visible et volontaire." },
  remerii: { guided: "Sa bouche rejoint les endroits que ses doigts viennent de découvrir, et Remerii vous demande de distinguer ce qui est agréable de ce qui est simplement intense. Quand vous précisez la différence, elle adapte aussitôt sa cadence sans transformer votre réponse en examen.", offered: "Vous ouvrez sa tenue attache après attache, en laissant assez de temps pour que Remerii formule chaque envie. Sa voix perd peu à peu sa syntaxe parfaite, mais ses demandes deviennent plus nettes encore.", mutual: "Vos souffles donnent une mesure que ni l’un ni l’autre ne dirige longtemps. Remerii tente de compter, renonce sur votre bouche et remplace les chiffres par des gestes qui répondent exactement aux vôtres." },
  iriana: { guided: "Iriana découvre votre peau avec une lenteur cérémonieuse qu’elle brise elle-même dès que votre souffle s’accélère. Elle ne réclame ni immobilité ni déférence : seulement votre regard et la franchise de vos hanches venant chercher les siennes.", offered: "Vous défaites sa tenue tandis qu’Iriana nomme ce qu’elle veut au singulier. Ses épaules quittent leur posture publique et ses hanches répondent avant qu’une formule prudente ne puisse reprendre le contrôle.", mutual: "La danse se poursuit horizontalement : une main mène, l’autre répond, puis les rôles changent dans un murmure contre la peau. Aucun pas n’est offert à un public, et cette absence rend Iriana plus audacieuse." },
  valurn: { guided: "Valurn fait glisser ses lèvres le long de votre ventre sans quitter vos réactions des yeux. Chaque provocation reçoit un mouvement plus ferme ; son sourire change lorsque vos doigts se nouent dans ses cheveux, parce que le défi vient enfin de vous.", offered: "Vous explorez son torse, ses hanches et l’intérieur de ses cuisses en interrompant chaque trait d’humour par un geste plus précis. Valurn cesse de jouer l’indifférence et vous indique sans détour le rythme qu’il ne parvient plus à feindre.", mutual: "La lutte reste joueuse parce que vos deux corps rendent coup pour coup. Vous échangez les positions, les baisers et les prises de contrôle, et chaque rire essoufflé relance le défi avec une intensité nouvelle." },
  naiah: { guided: "Sa bouche et ses doigts prennent des chemins différents, mais Naïah garde un seul corps et un seul regard pour que vous puissiez toujours la suivre. La brume souligne vos frissons sans en inventer aucun.", offered: "Vous découvrez sous sa peau magique des réactions impossibles à contrefaire : la contraction de son ventre, la rupture de son souffle, la façon dont ses cuisses se resserrent. Naïah vous indique précisément laquelle elle veut sentir recommencer.", mutual: "Le reflet au plafond montre vos changements de position sans les idéaliser. Naïah vous laisse mener jusqu’à ce que votre plaisir demande une réponse, puis reprend l’initiative après vous avoir entendu l’accepter." },
  lineva: { guided: "Sa force se traduit par un soutien ferme sous vos hanches, jamais par une immobilisation. Lineva observe votre souffle ; lorsque son rythme augmente, une main reste mêlée à la vôtre tandis que l’autre entretient le mouvement qui vous fait vous cambrer.", offered: "Vous embrassez ses cicatrices sans les traiter comme des blessures ouvertes, puis descendez vers les zones où son corps réclame autre chose que de l’endurance. Lineva vous guide avec une franchise de plus en plus essoufflée.", mutual: "Vous changez de position sans brusquer ses anciennes blessures ni vous laisser porter seul·e. La force circule entre vos bras et vos cuisses ; Lineva rit en découvrant qu’elle peut céder du terrain sans abandonner personne." },
  saidin: { guided: "Ses mains avancent lentement sur votre peau et s’arrêtent chaque fois qu’une nouvelle réaction apparaît. Saidin ne devine pas la suivante : il vous demande de la lui faire comprendre, puis recommence le geste au présent.", offered: "Vous ouvrez sa robe et suivez son corps sans lui laisser le temps de transformer vos caresses en symbole. Saidin nomme ce qu’il ressent au lieu de ce que cela annonce, jusqu’à ce que ses phrases deviennent de simples demandes.", mutual: "Chaque fois que l’un de vous croit reconnaître la suite, l’autre change doucement de rythme. Saidin accueille ces surprises sans se dédoubler dans l’avenir ; vos mouvements restent imparfaits, synchrones et entièrement vécus." },
  bellirith: { guided: "Elle vous touche avec son expérience réelle plutôt qu’avec un sort, et suit chacune de vos réactions jusqu’à y perdre sa propre pose. Le plaisir visible sur votre corps lui retire peu à peu le besoin de jouer la femme infaillible.", offered: "Vous ouvrez sa tenue et laissez volontairement les bijoux hors de portée. Bellirith vous donne une indication sans détour, puis une seconde ; son masque tombe à mesure que votre précision rend toute mise en scène inutile.", mutual: "Chaque provocation reçoit une caresse, chaque caresse une riposte, et chaque changement de position relance le duel. L’intensité reste réelle parce qu’aucun charme ne peut falsifier le moment où l’un de vous cède l’initiative dans un soupir." },
  amanea: { guided: "Ses mains puissantes soutiennent votre bassin et votre nuque au lieu de vous maintenir. Votre corps vient chercher le sien, et Amanea transforme sa retenue en une intensité qui vous laisse pourtant toute liberté de mouvement.", offered: "Vous ouvrez sa cape, embrassez les muscles tendus et suivez le chemin que sa main vous indique. Amanea reçoit chaque geste sans le convertir en dette, et ses demandes deviennent plus franches lorsque son souffle cesse d’appartenir à une souveraine.", mutual: "Vos forces se rencontrent dans des positions choisies et réversibles. Amanea vous attire, vous la renversez lorsque son rire vous provoque, puis elle reprend la conduite sans qu’aucun mouvement ressemble à une victoire politique." },
  tia: { guided: "Tia suit votre souffle comme elle suivrait une partition, puis renonce volontairement à anticiper la mesure suivante. Sa bouche revient là où votre corps l’appelle, ses doigts conservent la pression demandée et son contrôle devient enfin une qualité d’écoute plutôt qu’une cage.", offered: "Vous ouvrez lentement les attaches d’or et découvrez les réactions que Tia n’autorise à aucune cour. Elle nomme chaque envie avec une précision troublante, puis ses hanches rendent bientôt les formules inutiles et vous indiquent seules où reprendre.", mutual: "Le protocole inventé pour la première mesure est oublié à la troisième. Vous échangez positions, baisers et caresses avec une rigueur devenue joueuse ; Tia rit lorsqu’un renversement imprévu lui plaît davantage que celui qu’elle avait prévu." },
  allenna: { guided: "Allenna commence lentement, attentive à vos appuis et à chaque variation de souffle. Lorsque vous réclamez davantage, sa force soutient le rythme sans vous immobiliser ; la discipline de la commandante se transforme en une patience brûlante entièrement tournée vers votre plaisir.", offered: "Vous embrassez ses cicatrices sans les inventorier et suivez la chaleur sous l’armure retirée. Allenna formule une correction, puis une demande, puis votre prénom ; cette progression révèle exactement le moment où elle cesse de traiter le désir comme une procédure à maîtriser.", mutual: "Vous changez d’appui comme pendant un entraînement, mais chaque transition se conclut par une bouche, une main ou un bassin revenu contre l’autre. Allenna accepte d’être relayée avant l’épuisement et découvre que partager l’effort peut aussi intensifier le plaisir." },
  draven: { guided: "Sa bouche suit votre gorge et votre torse tandis que ses mains soutiennent vos hanches sans les retenir. Draven vérifie chaque accélération d’un mot bref ; votre réponse lui rend une assurance qui devient chaleur plutôt qu’autorité.", offered: "Vous ouvrez sa chemise, découvrez les vieilles marques qu’il n’exhibe jamais et refusez d’en faire un inventaire de guerre. Draven vous indique le rythme d’une voix rauque, puis cesse de surveiller sa propre retenue lorsque vous le maintenez exactement là où il vous réclame.", mutual: "Chaque reprise change la personne qui mène. Draven vous attire, vous le renversez, puis vos corps trouvent un mouvement commun où sa force sert l’appui et où votre désir, pas son grade, décide de la cadence." },
};

const AFTERCARE_TEXTURES: Record<string, Record<RouteRole, string>> = {
  hylee: { guided: "Hylee fait fondre le dernier givre avec sa paume, vous apporte de l’eau et cherche doucement votre regard. Votre sourire la rassure ; elle se blottit aussitôt contre vous, fière et encore un peu étonnée de sa propre audace.", offered: "Vous couvrez Hylee avant que le froid de sa magie ne retombe. Elle examine vos mains mêlées aux siennes, embrasse vos doigts et sourit lorsqu’un dernier flocon fond sur votre poignet.", mutual: "Vous restez emmêlé·es le temps que la neige disparaisse, partagez de l’eau puis évoquez chacun un geste à reprendre. Hylee en choisit un second uniquement pour avoir une raison de rougir encore." },
  remerii: { guided: "Remerii suit votre respiration, vous tend de l’eau puis résiste à l’envie de transformer la nuit en rapport. Elle murmure seulement ce qu’elle a aimé avant de se laisser rassurer à son tour par votre bras autour de sa taille.", offered: "Vous replacez un coussin sous sa nuque et laissez Remerii retrouver ses mots sans exiger qu’ils soient élégants. Elle vous demande de rester assez près pour que la réponse demeure physique plutôt que théorique.", mutual: "Vous comparez encore vos sensations sans les noter ni les classer. Remerii finit par refermer le carnet qu’elle avait sorti par réflexe et choisit de mémoriser la chaleur de votre peau plutôt que sa formulation." },
  iriana: { guided: "Iriana vous couvre elle-même, apporte de l’eau et reste un instant à vous regarder sans reprendre son titre. Votre main sur sa joue transforme le silence en une conversation calme où la femme peut enfin se laisser rassurer.", offered: "Vous massez ses épaules pendant qu’Iriana remet des mots sur ce que son corps vient de vivre. Elle ne cherche pas à minimiser ce qu’elle a reçu ; elle vous remercie en son nom, sans parler une seule fois pour l’Empire.", mutual: "Vous restez côte à côte jusqu’à ce que vos pulsations ralentissent. Iriana choisit un geste qu’elle voudra répéter et vous demande le vôtre, comme les deux seules clauses d’un traité qu’aucune chancellerie ne verra." },
  valurn: { guided: "Valurn abandonne enfin les plaisanteries, vous tend de l’eau et observe votre visage avec une franchise inhabituelle. Votre sourire lui rend le sien ; il remet le score à zéro et revient poser la tête contre votre ventre.", offered: "Vous massez ses poignets et suivez la façon dont son souffle retrouve son rythme. Valurn reconnaît le moment où il a réellement cédé puis exige, avec un sourire plus fragile, que cette honnêteté ne devienne jamais une mise future.", mutual: "Vous comptez les reprises, pas les victoires, puis partagez l’eau et les dernières caresses. Valurn déclare une égalité officielle avant d’avouer que votre attention après le jeu constituait probablement le meilleur coup." },
  naiah: { guided: "Naïah dissipe toute la brume pour que l’après ne comporte aucun masque. Elle vous donne de l’eau et laisse sa véritable inquiétude apparaître ; vous la ramenez contre vous sans flatterie, jusqu’à ce que son souffle retrouve le calme.", offered: "Vous enveloppez Naïah dans un drap réel, sans illusion de soie ni lumière avantageuse. Elle vous confie ce qui l’a surprise puis reste assez longtemps silencieuse pour que son corps cesse de jouer.", mutual: "Le reflet disparaît et vous contemplez ensemble les marques et les émotions laissées par la nuit. Naïah choisit de ne rien embellir : elle garde seulement votre main contre elle et nomme franchement ce qu’elle voudra reprendre." },
  lineva: { guided: "Lineva observe votre confort avec sérieux, puis vous laisse prendre soin à votre tour de ses anciennes blessures. Eau, couverture et respiration retrouvée deviennent une petite relève à deux où personne ne prétend aller bien trop vite.", offered: "Vous soutenez ses jambes et massez les muscles sollicités. Lineva répond sans héroïsme à la douceur de vos mains, ajuste elle-même un coussin puis vous ramène contre elle avec gratitude.", mutual: "Vous répartissez encore les tâches : l’un apporte l’eau, l’autre arrange les draps, puis vos corps se retrouvent sous la couverture. Lineva décide que cette organisation-là mérite de devenir une habitude, parce qu’elle ne laisse personne seul après l’effort." },
  saidin: { guided: "Saidin ne cherche pas à savoir ce que la nuit changera. Il vous apporte de l’eau et reste encore tout contre vous, à l’écoute de votre corps présent jusqu’à ce que votre respiration redevienne paisible.", offered: "Vous attendez que Saidin rouvre les yeux et lui demandez ce qu’il ressent maintenant. Il répond sans métaphore, accepte l’eau et votre bras autour de lui, heureux que l’inconnu soit encore intact.", mutual: "Aucune montre n’est rouverte pendant que vous partagez longtemps encore la chaleur du drap, dans un silence délicieusement imprévisible. Saidin formule un désir pour la prochaine fois, puis sourit de l’avoir laissé au futur sans tenter de l’observer." },
  bellirith: { guided: "Bellirith laisse son visage au repos pendant qu’elle vous apporte de l’eau. Elle écoute vos murmures sans séduire la réponse, puis se risque à demander honnêtement d’être rassurée elle aussi.", offered: "Vous replacez le drap sur Bellirith sans lui offrir de miroir. Elle nomme le geste qui l’a rendue vulnérable et garde votre main sur elle au lieu de fabriquer immédiatement une posture avantageuse.", mutual: "Le duel terminé, vous contemplez les marques et les émotions avec la même franchise que les plaisirs. Bellirith accepte le match nul, boit à votre verre et choisit de rester jolie seulement à vos yeux non enchantés." },
  amanea: { guided: "Amanea vous couvre de sa cape, vous donne de l’eau et laisse votre main retrouver la femme derrière la reine. Elle accueille cette tendresse avec la même intensité que tout le reste, sans tenter de la transformer en faveur.", offered: "Vous soutenez Amanea pendant que son souffle retrouve sa profondeur et lui demandez ce dont elle a besoin, pas ce que le royaume attend. Elle choisit l’eau, votre chaleur et quelques minutes supplémentaires sans couronne.", mutual: "L’égalité a survécu à l’intensité. Amanea partage sa cape, entremêle ses jambes aux vôtres et formule un prochain désir qui ne ressemble ni à un ordre ni à une dette." },
  tia: { guided: "Tia vous apporte elle-même l’eau, replace la couverture puis s’arrête avant d’organiser davantage. Votre main contre sa joue lui permet de recevoir aussi le calme ; elle nomme un geste qu’elle voudra reprendre sans le transformer en engagement officiel.", offered: "Vous massez les épaules que la cour maintient toujours droites. Tia indique honnêtement ce qui tire encore, accepte votre chaleur et laisse la couronne hors de portée jusqu’à ce que ses respirations appartiennent de nouveau au présent.", mutual: "Vous examinez ensemble ce qui a plu, sans rapport ni bilan de performance. Tia garde seulement deux conclusions : personne n’a dû disparaître derrière l’autre, et elle souhaite recommencer une nuit qui ne prouve rien à l’Empire." },
  allenna: { guided: "Allenna vérifie votre souffle, vous tend de l’eau et accepte ensuite que vous examiniez à votre tour la tension de ses mains. Elle ne prétend pas que tout va bien : elle choisit une couverture, votre poitrine et le temps nécessaire pour revenir doucement.", offered: "Vous replacez un coussin sous ses anciennes blessures et laissez Allenna demander les soins minuscules qu’elle oublie toujours pour elle-même. Son front rejoint votre épaule lorsqu’elle comprend qu’aucune urgence ne viendra réclamer cette vulnérabilité.", mutual: "La relève continue jusque dans l’après : l’un apporte l’eau, l’autre arrange les draps, puis vous échangez les rôles sans compter. Allenna conserve votre main nue dans la sienne et admet que dépendre brièvement de quelqu’un peut être un choix compétent." },
  draven: { guided: "Draven vous apporte de l’eau, vérifie votre confort puis accepte que vous fassiez exactement de même pour lui. Lorsqu’aucune douleur ni limite ne réclame d’ajustement, il reste contre vous au lieu d’inventer une raison de reprendre la garde.", offered: "Vous massez la tension de ses épaules et Draven s’abstient, avec un effort visible, de prétendre qu’il n’a besoin de rien. Sa tête finit par reposer contre vous ; la confiance prend la forme très concrète de tout son poids enfin relâché.", mutual: "Vous remettez ensemble les draps en ordre, échangez l’eau et deux plaisanteries médiocres, puis renoncez au reste du rangement. Draven garde votre main contre sa poitrine et laisse la ville continuer une heure sans lui." },
};

const MODE_CONTINUATIONS: Record<Exclude<IntimacyMode, "explicite">, Record<RouteRole, string>> = {
  tendre: {
    guided: "Le rythme demeure lent et entièrement lisible. La personne qui mène revient souvent à votre bouche, à vos mains et à votre regard ; la tendresse ne masque aucune étape, elle donne simplement à chacune le temps d’être ressentie avant la suivante.",
    offered: "Vous prolongez chaque caresse au lieu de chercher une conclusion spectaculaire. L’autre rapproche votre main, vous embrasse et vient chercher la lenteur qui lui plaît avec une franchise croissante.",
    mutual: "Vous échangez baisers, pressions de paume et étreintes jusqu’à ce que le partage lui-même devienne le centre de la scène. Aucun de vous n’est réduit au rôle de donner ou de recevoir ; chaque geste appelle une réponse, une variation ou une revanche tendre.",
  },
  suggestif: {
    guided: "Les vêtements ouverts rendent enfin la position de vos corps parfaitement claire : vous restez soutenu·e, libre de bouger, tandis que les mains et la bouche de l’autre suivent votre désir au lieu de le précéder. Les respirations indiquent chaque accélération mieux que les mots.",
    offered: "Vous descendez sur le corps offert sans perdre le contact du regard. Les mains qui vous guident rendent la scène sans ambiguïté : l’endroit, la pression et le rythme changent avec les frissons et les mouvements qui vous attirent davantage.",
    mutual: "Vos vêtements quittent le lit à mesure que l’initiative circule. Une bouche se pose, une main répond, les hanches se rapprochent puis ralentissent ; même lorsque la scène devient plus intense, chaque corps reste identifiable et chaque mouvement choisi.",
  },
  ellipse: {
    guided: "Votre partenaire soutient une dernière fois votre regard avant que la lumière baisse, laissant à la chambre le rythme, les gestes et les mots que vous inventez ensemble.",
    offered: "L’autre vous attire hors du regard du récit, le désir toujours visible dans la façon dont son corps revient contre le vôtre. La scène se poursuit pleinement pour les personnages, même si la chronique en respecte désormais l’intimité.",
    mutual: "Vous laissez l’ombre envelopper vos deux corps encore distincts, puis mêlez vos jambes dans un dernier renversement joueur. Le présent vous appartient encore entièrement tandis que le récit se retire et que vos souffles continuent d’écrire la suite.",
  },
};

const EXPLICIT_CHARACTER_TEXTURES: Record<string, Record<RouteRole, string>> = {
  hylee: { guided: "Hylee alterne chaleur et froid pour rendre chaque contact plus net, mais cesse aussitôt la magie lorsque vos muscles se contractent trop vite. Elle revient au geste que vous réclamez, maintient la même pression et vous regarde perdre pied avec une fierté tendre plutôt qu’avec triomphe.", offered: "Le plaisir d’Hylee fait tomber une neige désordonnée au-dessus de vous. Vous gardez le rythme qu’elle a demandé jusqu’à ce que ses cuisses tremblent, puis ralentissez assez pour entendre son oui avant de reprendre exactement là où elle vous attire.", mutual: "Le givre marque le trajet de vos mains sur vos deux corps. Hylee rit d’abord des traces, puis n’a plus assez de souffle pour plaisanter lorsque vos gestes se répondent et que votre plaisir devient le signal de poursuivre le sien." },
  remerii: { guided: "Remerii annonce chaque variation avant de l’essayer, observe votre réaction puis conserve seulement ce qui vous fait revenir vers elle. Sa précision ne ressemble plus à une expérience : son propre souffle se brise chaque fois que votre plaisir confirme qu’elle vous atteint.", offered: "Remerii vous donne des indications de plus en plus courtes — plus lent, plus ferme, ne changez rien — et vous les suivez jusqu’à ce que sa voix disparaisse. Son corps continue de vous guider par ses hanches, sa main et la tension visible de ses jambes.", mutual: "Vous trouvez un contrepoint physique : l’un maintient le rythme pendant que l’autre change de geste, puis les rôles s’inversent. Remerii cesse de compter lorsque vos plaisirs se rapprochent et choisit de les laisser se désordonner ensemble." },
  iriana: { guided: "Iriana soutient votre regard pendant que ses gestes deviennent plus intimes. Chaque fois que votre corps se tend, elle demande si elle doit garder, augmenter ou ralentir le rythme ; votre réponse, et non son autorité, conduit la progression jusqu’à l’abandon.", offered: "Iriana formule ses envies sans euphémisme et vous montre avec sa propre main la cadence qu’elle veut. Vous la remplacez seulement lorsqu’elle vous y invite, puis maintenez ce mouvement jusqu’à faire disparaître la voix officielle derrière ses réactions réelles.", mutual: "La valse devient une alternance de positions clairement demandées. Iriana mène une mesure, vous la suivante ; vos mains et vos bouches prolongent le plaisir de l’autre jusqu’à ce que les changements de rôle ne suivent plus qu’un souffle ou un regard accepté." },
  valurn: { guided: "Valurn garde sa voix provocatrice, mais ses mains restent d’une franchise absolue. Il recommence le geste qui vous fait gémir, accélère uniquement sur votre demande et laisse son propre désir visible vous montrer que le pari l’engage autant que vous.", offered: "Le masque moqueur de Valurn cède lorsque vous gardez exactement le rythme qu’il a réclamé. Ses hanches répondent sans stratégie, ses doigts se crispent sur le drap et ses demandes deviennent trop directes pour ressembler encore à une feinte.", mutual: "Vous changez deux fois de position sans transformer l’échange en lutte. Valurn vous donne du plaisir, accepte d’en recevoir, puis rapproche vos corps pour que les deux rythmes puissent se maintenir ensemble ; le score disparaît dès que vos voix se brisent." },
  naiah: { guided: "Naïah utilise la brume seulement pour souligner l’endroit précis où sa bouche ou ses doigts vous touchent. Aucune sensation n’est inventée : elle observe votre corps réel, demande confirmation avant d’intensifier et garde le mouvement que vous réclamez jusqu’au bout.", offered: "Chaque illusion tombe à mesure que le plaisir de Naïah devient impossible à mettre en scène. Vous suivez ses indications concrètes, gardez la pression qui lui fait lever les hanches et attendez son oui avant de reprendre lorsque son souffle se rompt.", mutual: "Un seul reflet vous montre l’échange sans le multiplier. Naïah vous regarde lui donner du plaisir tandis que sa main poursuit le vôtre, puis vous inversez la position après une question nette ; la brume tremble avec des réactions qu’elle ne contrôle plus." },
  lineva: { guided: "Lineva utilise sa force pour vous soutenir et maintenir la position, jamais pour vous priver de mouvement. Elle garde le rythme que vous choisissez, vérifie votre souffle avant chaque accélération et laisse enfin son propre désir apparaître dans la tension de ses cuisses contre les vôtres.", offered: "Vous protégez ses anciennes blessures tout en refusant de traiter Lineva comme fragile. Elle vous guide vers ce qui lui procure du plaisir, demande davantage de pression puis se laisse aller parce qu’elle sait que votre main libre reste attentive à tout signal de recul.", mutual: "Vous partagez le poids et l’effort jusque dans les positions les plus intenses. Lineva donne, reçoit, change d’appui après votre accord et revient au mouvement qui vous fait tous deux perdre le rythme ; aucun corps n’est condamné à porter l’autre jusqu’au bout." },
  saidin: { guided: "Saidin se concentre sur une sensation présente à la fois. Il garde sa bouche ou sa main là où vous la réclamez, vérifie chaque changement de rythme et vous conduit vers le plaisir sans ralentir le temps, ce qui rend chaque seconde irréversible et plus intense.", offered: "Vous empêchez Saidin de se réfugier dans une possibilité future en lui demandant ce qu’il ressent maintenant. Sa réponse vous indique le mouvement à garder ; ses hanches et sa voix perdent toute distance lorsque vous le répétez sans lui offrir d’autre instant que celui-ci.", mutual: "Vos gestes ne suivent aucun avenir écrit. Saidin vous donne du plaisir pendant que vous poursuivez le sien, vous changez de position sur une demande réelle et vos deux corps avancent sans savoir lequel cédera d’abord — découverte qui le bouleverse autant que la sensation." },
  bellirith: { guided: "Bellirith n’emploie ni charme ni illusion : seule son expérience guide ses mains et sa bouche. Elle demande ce qui vous fait réellement céder, maintient le geste après votre réponse et laisse son soulagement apparaître quand votre plaisir prouve qu’elle suffit sans magie.", offered: "Vous refusez toute posture flatteuse et suivez seulement les indications de Bellirith. Son sexe, son souffle et ses hanches vous donnent une vérité impossible à maquiller ; vous conservez la pression qu’elle demande jusqu’à ce que sa séduction se dissolve en réactions entièrement spontanées.", mutual: "Le duel reste physique et négocié : Bellirith vous fait céder, vous reprenez l’initiative après son accord, puis vos plaisirs se poursuivent simultanément. Sans enchantement pour tricher, chaque tremblement devient un point que personne ne souhaite plus compter." },
  amanea: { guided: "Amanea met toute sa force au service de la stabilité de votre corps et laisse vos mots régler l’intensité. Elle garde le geste qui vous ouvre au plaisir, demande avant d’aller plus loin et reçoit votre abandon comme un choix offert, jamais comme une soumission.", offered: "Vous faites de la puissance d’Amanea quelque chose qu’elle peut déposer sans disparaître. Elle vous indique avec franchise où concentrer la bouche ou les doigts, exige que vous mainteniez le rythme, puis cède parce que vous n’essayez ni de la vaincre ni de la posséder.", mutual: "Vos forces se répondent dans un échange sans hiérarchie. Amanea reçoit du plaisir, vous en donne à son tour, puis rapproche vos corps pour prolonger les deux sensations à la fois ; chaque changement reste une proposition acceptée plutôt qu’un ordre ou une conquête." },
  tia: { guided: "Tia conserve la stimulation que vous avez choisie au lieu de chercher une progression parfaite. Votre plaisir défait sa voix officielle syllabe après syllabe ; elle demande une dernière confirmation, augmente la cadence et vous accompagne jusqu’à l’abandon sans jamais confondre conduite et droit sur votre corps.", offered: "Vous suivez les indications exactes de Tia jusqu’à ce que ses demandes deviennent des souffles plus courts. Elle vous ordonne presque de ne rien changer, corrige le mot elle-même — demande, pas ordre — puis s’abandonne au rythme qu’elle a librement défini.", mutual: "Vos plaisirs se répondent sans chercher une simultanéité exemplaire. Tia vous conduit d’abord, reçoit ensuite, puis rapproche vos corps pour que chaque reprise demeure visible dans les mains, les hanches et les regards plutôt que fixée par une règle préalable." },
  allenna: { guided: "Allenna emploie sa connaissance des corps sans vous traiter comme un patient. Elle conserve la pression qui vous fait revenir vers elle, demande avant chaque intensification et laisse son propre désir déranger enfin la précision de ses gestes lorsque votre plaisir approche.", offered: "Vous suivez la demande d’Allenna, protégez ses appuis et refusez pourtant toute douceur imposée. Elle réclame davantage, guide la cadence et accepte de céder sous une stimulation qu’elle n’a pas besoin de contrôler jusque dans ses conséquences.", mutual: "Vous organisez une relève charnelle : Allenna donne jusqu’à ce que vous demandiez l’échange, reçoit sans préparer sa revanche, puis revient contre vous pour maintenir deux plaisirs distincts. La discipline sert la continuité, jamais la compétition ni l’endurance forcée." },
  draven: { guided: "Draven garde une main ferme sous votre bassin et l’autre exactement là où vous l’avez guidée. Il augmente le rythme seulement après votre demande, abandonne toute plaisanterie lorsque votre plaisir approche et reste présent jusqu’au dernier frisson.", offered: "Vous maintenez le geste que Draven a réclamé jusqu’à ce que sa voix perde toute autorité. Ses hanches répondent sans stratégie, sa main cherche la vôtre et l’homme habitué à tenir accepte enfin de céder sans considérer cela comme une défaite.", mutual: "Vous échangez positions, bouche et mains sans transformer la force de Draven en droit de conduire. Il vous donne du plaisir, reçoit le vôtre, puis rapproche vos corps afin que les deux rythmes se poursuivent avec la même franchise." },
};

const EXPLICIT_CULMINATIONS: Record<RouteRole, string> = {
  guided: "Lorsque l’orgasme approche, vous le dites au lieu de laisser l’autre l’interpréter. Le geste ne change plus : même pression, même profondeur, même cadence jusqu’à ce que votre bassin se tende et que la sensation vous traverse entièrement ; seulement alors le mouvement ralentit, sans contact brusquement retiré.",
  offered: "Vous reconnaissez l’approche de l’orgasme dans la demande répétée et la tension du corps sous vous. Vous conservez exactement la même stimulation jusqu’aux contractions et au souffle rompu, puis diminuez graduellement la pression tout en restant assez proche pour recevoir un changement ou un arrêt.",
  mutual: "À l’approche de vos orgasmes, vous renoncez à chercher une simultanéité parfaite. Le premier corps qui cède reçoit le même rythme jusqu’au bout ; l’autre est ensuite guidé sans interruption vers son propre plaisir, avant que vos mains ne ralentissent ensemble et restent simplement posées.",
};

function legacyExplicitBodyChapter(character: string, role: RouteRole, sex: PlayerSex): RawLine[] {
  const name = CHARACTER_NAMES[character] || character;
  const npcFemale = FEMALE_BODY.has(character);
  const playerReceiving = sex === "femme"
    ? `${name} écarte vos cuisses, embrasse l’intérieur de chacune puis pose sa bouche contre votre intimité humide. Sa langue trouve la perle de plaisir nichée au creux de vos lèvres de velours, tandis qu’un doigt, puis deux après votre accord, glissent en vous au rythme demandé ; l’autre main garde votre bassin soutenu sans l’immobiliser.`
    : sex === "homme"
      ? `${name} referme d’abord la main autour de votre sexe dressé et répartit le lubrifiant avec des mouvements lents. Après votre accord, sa bouche descend sur son extrémité sensible puis le long de votre membre viril pendant que sa main poursuit la base ; chaque accélération répond à une demande ou à la poussée volontaire de vos hanches.`
      : `${name} vous demande de guider sa main vers le point de feu que vous souhaitez voir stimulé et de lui indiquer si vous voulez qu’un doigt, puis éventuellement deux, glissent en vous. Sa bouche suit votre indication, ses doigts caressent le pli secret voisin et ne vont plus loin que si vous le réclamez ; aucune forme n’est supposée à votre place.`;
  const npcReceiving = npcFemale
    ? `Vous écartez les cuisses de ${name}, embrassez son ventre puis posez votre bouche contre son intimité humide. Votre langue maintient une pression régulière sur sa perle de plaisir, tandis que vos doigts glissent en elle seulement après son oui ; sa main guide votre rythme au lieu de vous laisser deviner.`
    : `Vous prenez le membre viril de ${name} dans votre main, étalez le lubrifiant de son extrémité sensible jusqu’à la base puis le prenez dans votre bouche après son accord. Votre langue accompagne chaque va-et-vient et votre seconde main soutient ses hanches sans les retenir ; sa voix vous indique exactement quand accélérer.`;
  if (role === "guided") return [playerReceiving, EXPLICIT_CHARACTER_TEXTURES[character][role], EXPLICIT_CULMINATIONS[role]];
  if (role === "offered") return [npcReceiving, EXPLICIT_CHARACTER_TEXTURES[character][role], EXPLICIT_CULMINATIONS[role]];
  const advancedExchange = npcFemale
    ? sex === "femme"
      ? `Après un nouveau oui, vous vous tournez sur le côté et entrelacez vos jambes dans une position en ciseaux. Vos lèvres de velours se pressent contre celles de ${name} ; vos bassins cherchent ensemble l’angle qui place vos deux points de feu au centre du frottement. ${name} agrippe votre hanche pour maintenir la pression, puis vous ralentissez et recommencez jusqu’à trouver une cadence commune, plus profonde que les caresses qui l’ont préparée.`
      : sex === "homme"
        ? `${name} vous attire entre ses cuisses et guide votre sexe dressé vers son intimité humide. Vous entrez lentement dans son écrin de chair, vous immobilisant chaque fois que son souffle change, puis reprenez lorsqu’elle vous ramène contre elle. Après plusieurs mouvements mesurés, elle vous fait rouler sur le dos et vous chevauche afin de choisir elle-même la profondeur, l’angle et la cadence de la pénétration.`
        : `Vous nommez ensemble la suite qui convient réellement à vos corps : un frottement en ciseaux, une pénétration reçue ou une pénétration donnée. ${name} vous laisse guider l’angle, la profondeur et la cadence ; le mouvement commence lentement, s’interrompt à la moindre hésitation puis gagne en intensité lorsque vos deux voix demandent de continuer.`
    : sex === "femme"
      ? `Vous chevauchez ${name} face à face et guidez son membre viril vers votre intimité humide. Vous l’accueillez lentement, une main sur son épaule pour régler la profondeur, puis votre bassin trouve un mouvement qui fait glisser sa tige brûlante en vous sans rompre le baiser. ${name} ne pousse pas davantage : il soutient vos hanches et vous laisse décider de chaque reprise jusqu’à ce que vous réclamiez un rythme plus ferme.`
      : sex === "homme"
        ? `Après avoir préparé longuement celui qui souhaite recevoir, vous choisissez ensemble une pénétration sur le côté, assez proche pour rester enlacés. Le membre viril qui entre avance par pressions lentes dans l’intimité accueillante ; celui qui reçoit règle la profondeur d’une main et demande chaque accélération. Vous inversez ensuite les rôles seulement si un second désir est formulé, sans faire de la réciprocité une obligation.`
        : `Vous demandez à ${name} quelle forme de pénétration correspond à vos corps et à vos envies présentes. La personne qui reçoit guide le membre dressé vers son intimité préparée, règle la profondeur et garde la main sur le bassin de l’autre ; vous changez de position uniquement lorsque les deux voix réclament une intensité différente.`;
  return [npcReceiving, playerReceiving, advancedExchange, EXPLICIT_CHARACTER_TEXTURES[character][role], EXPLICIT_CULMINATIONS[role]];
}

function explicitBodyChapter(character: string, role: RouteRole, sex: PlayerSex): RawLine[] {
  return individualExplicitScene(character, sex, role);
}

function routeExpansion(character: string, role: RouteRole, sex: PlayerSex): RouteExpansion {
  return {
    orientation: [ORIENTATION_TEXTURES[character][role]],
    escalation: [ESCALATION_TEXTURES[character][role]],
    continuation: {
      tendre: [MODE_CONTINUATIONS.tendre[role]],
      suggestif: [MODE_CONTINUATIONS.suggestif[role]],
      explicite: explicitBodyChapter(character, role, sex),
      ellipse: [MODE_CONTINUATIONS.ellipse[role]],
    },
    aftercare: [AFTERCARE_TEXTURES[character][role]],
  };
}

const route = (character: string, sex: PlayerSex, seed: RouteSeed, seedIndex: number): IntimacyRoute => {
  const role: RouteRole = seedIndex === 0 ? "guided" : seedIndex === 1 ? "offered" : "mutual";
  const expansion = routeExpansion(character, role, sex);
  const context = `${character}:${sex}:${seed.id}`;
  const asLines = (raw: RawLine[]) => lines(raw, context);
  const opening = asLines([seed.prelude[sex], ...seed.setup]);
  const orientation = asLines(expansion.orientation);
  const deepening = asLines(seed.deepening);
  const escalation = asLines(expansion.escalation);
  const closing = asLines([...seed.closing, seed.after[sex]]);
  const modeChapter = (mode: IntimacyMode) => asLines(
    mode === "tendre" ? seed.tender
      : mode === "suggestif" ? seed.suggestive
        : mode === "explicite" ? seed.explicit[sex]
          : seed.ellipse,
  );
  return {
    id: `${character}-${sex}-${seed.id}`,
    text: polishIntimacyText(seed.labels[sex], { context }),
    detail: polishIntimacyText(seed.detail, { context }),
    chapters: {
      tendre: [opening, orientation, deepening, escalation, modeChapter("tendre"), asLines(expansion.continuation.tendre), asLines(expansion.aftercare), closing],
      suggestif: [opening, orientation, deepening, escalation, modeChapter("suggestif"), asLines(expansion.continuation.suggestif), asLines(expansion.aftercare), closing],
      explicite: [opening, orientation, deepening, escalation, modeChapter("explicite"), asLines(expansion.continuation.explicite), asLines(expansion.aftercare), closing],
      ellipse: [opening, orientation, deepening, escalation, modeChapter("ellipse"), asLines(expansion.continuation.ellipse), asLines(expansion.aftercare), closing],
    },
  };
};

const ROUTE_SEEDS: Record<string, RouteSeed[]> = {
  hylee: [
    {
      id: "givre-guide",
      labels: sexText("Laisser Hylee suivre vos frissons sous le givre", "Lui confier le rythme de votre désir", "Lui apprendre votre corps sans lui donner de modèle"),
      detail: "Hylee mène avec sa curiosité, attentive à chaque réaction plutôt qu’à une idée préconçue.",
      prelude: sexText("Hylee contemple votre silhouette avec une fascination qu’un flocon nerveux trahit aussitôt.", "Son regard descend sur votre torse avant de revenir, intimidé mais décidé, jusqu’à vos yeux.", "Vous guidez d’abord sa main ; Hylee mémorise le geste au lieu de supposer ce que votre corps attend."),
      setup: [["Hylee", "Dis-moi si le froid devient trop fort. Ou si tu veux que j’arrête de parler et que je continue.", "soft"], "Une poussière de givre suit ses doigts, assez fraîche pour rendre chaque contact distinct sans jamais devenir une armure."],
      deepening: ["Hylee prend confiance à mesure que vos réponses deviennent plus franches. Elle revient aux endroits qui vous ont fait respirer plus vite et sourit chaque fois qu’elle vous comprend sans phrase.", ["Hylee", "Je ne cherche pas une formule. Je cherche ce qui est vrai pour toi.", "determined"]],
      tender: ["Elle vous enveloppe de baisers lents, réchauffant chaque trace de froid avec sa paume. Le plaisir reste une confidence, douce et continue.", ["Hylee", "Reste contre moi. J’aime pouvoir prendre mon temps.", "soft"]],
      suggestive: ["Ses lèvres suivent la ligne laissée par le givre tandis que ses mains deviennent plus audacieuses. La neige au-dessus du lit accélère avec votre souffle.", ["Hylee", "Encore ce son… oui. Je veux savoir le refaire.", "teasing"]],
      explicit: sexLines(
        ["Hylee descend entre vos cuisses et laisse vos réactions guider sa bouche et ses doigts. Le givre fond contre votre peau à mesure que le plaisir se concentre, jusqu’à vous faire trembler sous elle.", ["Hylee", "Je te sens céder. Ne retiens rien pour me rassurer.", "determined"]],
        ["Hylee referme sa main autour de votre désir, apprend votre rythme puis le prolonge de sa bouche. Sa magie répond à chaque tension de vos hanches jusqu’à faire éclater une neige fine autour de vous.", ["Hylee", "Comme ça ? Oui… ton corps vient de répondre avant toi.", "determined"]],
        ["Hylee explore exactement les gestes que vous lui avez montrés, alternant bouche, doigts et chaleur de ses paumes sans réduire votre corps à une attente. Votre plaisir devient la seule carte qu’elle suit.", ["Hylee", "Je veux te connaître comme tu es, pas comme j’aurais pu t’imaginer.", "determined"]],
      ),
      ellipse: ["Hylee soulève la couverture et vous attire dans une neige minuscule. Vos indications deviennent des murmures, puis la chronique laisse la chambre garder la suite."],
      closing: ["Quand le givre cesse de tomber, Hylee ne s’éloigne pas. Elle pose l’oreille contre votre poitrine, encore étonnée d’avoir pu être aussi sûre sans cesser d’être elle-même.", ["Hylee", "La prochaine fois, je serai moins nerveuse. Peut-être. Mais je serai toujours attentive.", "soft"]],
      after: sexText("Ses doigts dessinent un dernier cercle tiède au creux de votre ventre.", "Elle embrasse votre épaule et rit lorsque votre souffle la chatouille.", "Elle replace doucement votre main sur la sienne, comme pour conserver votre langage commun."),
    },
    {
      id: "audace-renversee",
      labels: sexText("Faire de son propre désir une audace qu’elle peut revendiquer", "Lui montrer qu’elle peut vous désarmer sans être fragile", "L’inviter à choisir chaque geste et à le réclamer"),
      detail: "Vous prenez d’abord l’initiative, puis rendez à Hylee tout l’espace nécessaire pour devenir audacieuse.",
      prelude: sexText("Vous rapprochez Hylee de vous jusqu’à ce que sa gêne rencontre votre sourire plutôt qu’un miroir.", "Vous placez sa main contre vous et attendez qu’elle décide elle-même de la suite.", "Vous nommez ce qui vous plaît, puis lui demandez de nommer à son tour ce qu’elle désire."),
      setup: ["Votre premier geste est assuré, le second volontairement plus lent. Hylee comprend qu’elle n’a rien à rattraper et vous répond avec une audace qui grandit à vue d’œil.", ["Hylee", "Tu m’as donné une idée. Ne te plains pas maintenant si elle devient ambitieuse.", "teasing"]],
      deepening: ["Vous faites de chaque hésitation une invitation plutôt qu’un arrêt. Hylee apprend à demander, à reprendre votre main et à vous corriger sans s’excuser.", ["{player}", "Je veux t’entendre choisir."]],
      tender: ["Hylee choisit de rester tout près, de vous embrasser jusqu’à ce que sa confiance n’ait plus besoin de spectaculaire. Sa victoire tient dans la simplicité de son regard.", ["Hylee", "Alors je choisis ça. Toi, sans urgence.", "soft"]],
      suggestive: ["Elle renverse peu à peu la position, vous maintient sous son regard et découvre le plaisir très visible de vous surprendre. Son sourire devient presque insolent.", ["Hylee", "Tu voulais que je choisisse. Maintenant, laisse-moi finir.", "determined"]],
      explicit: sexLines(
        ["Vous guidez d’abord Hylee contre vous, puis elle reprend le mouvement et trouve seule la pression qui vous fait vous cambrer. Elle prolonge chaque réaction jusqu’à votre abandon, fière de l’avoir choisi.", ["Hylee", "Regarde-moi. Je veux voir le moment où tu ne peux plus prétendre tenir.", "determined"]],
        ["Votre désir devient évident sous ses gestes. Hylee abandonne sa prudence, alterne sa main et sa bouche avec une application de plus en plus gourmande, puis maintient son rythme lorsque votre corps se tend.", ["Hylee", "Cette fois, c’est moi qui te fais perdre pied.", "teasing"]],
        ["Vous lui montrez une première fois le geste juste. Hylee le reprend, le transforme et vous fait reformuler vos envies jusqu’à ce que votre corps n’ait plus besoin d’autre traduction.", ["Hylee", "Je choisis de continuer. Et toi, tu peux choisir de me le demander encore.", "determined"]],
      ),
      ellipse: ["Hylee vous fait reculer sous les couvertures avec un aplomb neuf. Le dernier flocon se pose sur la lampe au moment où l’intimité quitte le regard du récit."],
      closing: ["Elle reste au-dessus de vous une seconde, essoufflée, puis son assurance éclate en rire. Ce rire ne nie pas l’intensité ; il la rend habitable.", ["Hylee", "J’ai été courageuse sans combattre quoi que ce soit. J’aime beaucoup cette version.", "teasing"]],
      after: sexText("Elle se blottit contre vos courbes avec une fierté encore lumineuse.", "Son front rejoint votre torse, là où votre cœur n’a pas tout à fait ralenti.", "Elle vérifie votre sourire avant de mêler tranquillement ses jambes aux vôtres."),
    },
    {
      id: "neige-partagee",
      labels: sexText("Mêler vos plaisirs dans une bataille de neige silencieuse", "Transformer l’étreinte en défi où personne ne mène longtemps", "Inventer ensemble un jeu que vos corps seuls comprennent"),
      detail: "Une route mutuelle et joueuse où la magie d’Hylee devient le reflet changeant de vos initiatives.",
      prelude: sexText("Vous volez un baiser à Hylee ; une poignée de neige apparaît aussitôt sur votre épaule comme une riposte.", "Hylee vous pousse contre les draps, puis proteste quand vous inversez la position avant qu’elle ait pu célébrer.", "Vous décidez qu’aucune règle ne survivra plus d’un baiser et Hylee accepte ce principe avec enthousiasme."),
      setup: ["Chaque geste reçoit une réponse : un souffle froid contre une nuque, une main capturée, un baiser rendu plus long. Votre complicité accélère avant vos corps.", ["Hylee", "On ne compte pas les points. Sauf si je gagne.", "teasing"]],
      deepening: ["Le jeu devient plus lent sans cesser d’être joueur. Vos initiatives s’entremêlent, l’une offrant ce que l’autre transforme, jusqu’à ce que la chambre semble respirer avec vous.", ["{player}", "À toi."], ["Hylee", "Non. À nous.", "soft"]],
      tender: ["Vous vous couvrez tour à tour de baisers et de rires étouffés. La tendresse gagne sans que personne ait besoin de perdre.", ["Hylee", "Je pourrais rester dans cette manche très longtemps.", "soft"]],
      suggestive: ["Vos vêtements rejoignent le sol entre deux défis. Hylee répond à chacune de vos caresses par une autre, plus précise, et le givre dessine vos mouvements sur les vitres.", ["Hylee", "Encore. Mais change de stratégie, je commence à te connaître.", "teasing"]],
      explicit: sexLines(
        ["Vos bouches et vos mains alternent sans ordre fixe. Hylee découvre votre plaisir entre vos cuisses, puis revient vous embrasser pendant que vous faites céder le sien, jusqu’à ce que vos orgasmes se répondent dans la neige.", ["Hylee", "Égalité. Et je demande une revanche.", "teasing"]],
        ["Hylee vous accueille contre elle, joue avec votre rythme puis renverse l’étreinte pour vous prendre à son tour entre ses mains et sa bouche. Le plaisir circule jusqu’à ne plus laisser de vainqueur.", ["Hylee", "Ne ralentis pas… je veux te sentir céder avec moi.", "determined"]],
        ["Vous échangez les gestes que chacun·e vient de découvrir, sans rôle fixé ni corps supposé. Hylee suit vos indications, vous suivez les siennes, et vos plaisirs finissent par se rejoindre.", ["Hylee", "Ça, personne ne pouvait l’inventer à notre place.", "soft"]],
      ),
      ellipse: ["Hylee fait tomber une neige épaisse autour du lit comme un rideau. Vos rires deviennent des souffles, puis la chronique accepte sa défaite."],
      closing: ["La neige fond lentement tandis que vous restez emmêlé·es. Hylee cherche encore qui a commencé, uniquement pour obtenir le droit de recommencer.", ["Hylee", "Je crois que nous avons triché exactement autant.", "teasing"]],
      after: sexText("Elle cale sa tête contre votre épaule et garde votre main sur sa taille.", "Elle dessine une ligne de givre sur votre torse avant de la réchauffer d’un baiser.", "Elle vous demande le nom de votre moment préféré et écoute la réponse comme un secret précieux."),
    },
  ],

  remerii: [
    {
      id: "lecon-inversee",
      labels: sexText("Confier vos réactions à sa précision jusqu’à la troubler", "Laisser sa maîtrise apprendre votre rythme réel", "Lui donner des indications assez précises pour libérer son désir"),
      detail: "Remerii mène avec exactitude, mais votre plaisir transforme progressivement sa méthode en désir personnel.",
      prelude: sexText("Remerii vous observe comme une partition dont elle refuserait pourtant d’écrire la conclusion à l’avance.", "Elle pose deux doigts contre votre pouls, constate son accélération et oublie de formuler le diagnostic.", "Vous lui expliquez ce que votre corps attend ; Remerii répète vos mots pour ne pas les remplacer par une théorie."),
      setup: [["Remerii", "Je vais être attentive. Pas clinique. Si la différence devient floue, rappelez-la-moi.", "calm"], "Ses premiers gestes sont mesurés ; les suivants le sont moins, parce que vos réactions commencent à compter davantage que son plan."],
      deepening: ["Remerii retient les mouvements qui vous font revenir vers elle. Son regard gagne une chaleur presque fière lorsqu’elle constate que sa précision peut aussi la désarmer.", ["Remerii", "Ne minimisez pas. J’ai besoin de la réponse entière.", "smirk"]],
      tender: ["Elle apprend votre détente par petites touches, laisse chaque baiser s’achever avant d’en proposer un autre et vous garde assez près pour entendre le moindre changement de souffle.", ["Remerii", "Nous pouvons rester dans cette mesure aussi longtemps que nécessaire.", "calm"]],
      suggestive: ["Sa précision devient sensuelle sous vos vêtements. Remerii recommence volontairement les gestes qui vous font perdre vos mots et sourit lorsqu’aucune phrase correcte ne revient.", ["Remerii", "Cette réaction mérite manifestement une vérification supplémentaire.", "smirk"]],
      explicit: sexLines(
        ["Remerii suit votre poitrine, votre ventre puis l’intérieur de vos cuisses avec une attention qui n’a plus rien d’académique. Sa bouche et ses doigts maintiennent exactement la pression que votre corps réclame jusqu’à l’orgasme.", ["Remerii", "Voilà. Ne retenez surtout pas cette conclusion.", "smirk"]],
        ["Ses mains découvrent votre tension avant que sa bouche n’en reprenne le rythme. Remerii varie méthodiquement la pression, puis abandonne toute distance lorsque votre plaisir la fait respirer aussi vite que vous.", ["Remerii", "Votre corps est remarquablement plus honnête que vos phrases.", "smirk"]],
        ["Remerii applique chacune de vos indications, vérifie votre regard puis laisse son intuition compléter ce que les mots ne décrivent plus. Votre corps devient une connaissance partagée, jamais une catégorie.", ["Remerii", "Je comprends. Et je désire continuer, ce qui est une donnée essentielle.", "calm"]],
      ),
      ellipse: ["Remerii éteint les runes l’une après l’autre, comme si elle retirait les numéros d’une expérience. Dans l’obscurité, seules vos indications demeurent."],
      closing: ["Elle reste contre vous sans corriger ses cheveux ni le drap froissé. L’ordre de la chambre a perdu ; Remerii, elle, semble plus présente que jamais.", ["Remerii", "Je n’ai pas perdu le contrôle. J’ai choisi où le déposer.", "calm"]],
      after: sexText("Sa paume demeure sur votre ventre, chaude et parfaitement immobile.", "Elle écoute votre cœur contre votre torse comme une mesure qu’elle refuse de compter.", "Elle vous demande une dernière fois si tout va bien, puis accepte enfin votre sourire comme réponse."),
    },
    {
      id: "ordre-defait",
      labels: sexText("Défaire son contrôle sans effacer la femme qui le porte", "La conduire jusqu’au point où sa voix cesse d’enseigner", "Renverser sa méthode et lui faire formuler chaque envie"),
      detail: "Vous menez Remerii hors de ses procédures et transformez sa vulnérabilité en choix assumé.",
      prelude: sexText("Vous dérangez volontairement l’alignement parfait de ses bijoux avant de revenir à sa bouche.", "Votre main immobilise doucement celle qui cherchait encore à arranger votre col.", "Vous lui demandez une envie précise ; Remerii commence par une explication et finit par un seul verbe."),
      setup: ["Vous imposez une lenteur qu’elle ne peut accélérer par compétence. Remerii essaie de prévoir votre prochain geste, se trompe, puis découvre qu’elle aime cette erreur.", ["{player}", "Pas de leçon. Demandez-moi."], ["Remerii", "Continuez.", "calm"]],
      deepening: ["Sa diction se fragmente à mesure que vos mains trouvent les endroits où son contrôle n’est plus une protection utile. Elle ne disparaît pas derrière le plaisir : elle devient plus directement elle-même.", ["Remerii", "Là… et ne changez rien sous prétexte d’innover.", "smirk"]],
      tender: ["Vous la ramenez contre les draps avec assez de douceur pour qu’elle puisse cesser de se tenir. Remerii vous confie son poids et une série de soupirs sans correction.", ["Remerii", "Je n’avais pas prévu que le repos puisse être aussi intime.", "calm"]],
      suggestive: ["Votre bouche descend tandis que ses consignes deviennent de simples demandes. Remerii agrippe les draps, contrariée et ravie que vous sachiez déjà quand lui obéir.", ["Remerii", "Plus bas. Voilà, cette instruction-ci était parfaitement claire.", "smirk"]],
      explicit: sexLines(
        ["Vous ouvrez sa tenue, goûtez sa peau puis vous installez entre ses cuisses. Remerii tente encore de maîtriser son souffle ; votre bouche et vos doigts la conduisent jusqu’à un orgasme qui brise enfin sa phrase.", ["Remerii", "Ne vous arrêtez pas… pas maintenant.", "calm"]],
        ["Vous faites de votre force une retenue attentive, la maintenez contre vous puis suivez de la bouche le chemin qui défait sa contenance. Remerii vous guide d’une main et cède sans détour sous l’autre.", ["Remerii", "Je vous ai demandé de continuer. Ce n’était pas rhétorique.", "smirk"]],
        ["Vous lui faites préciser pression, rythme et limites jusqu’à ce que sa rigueur serve entièrement son plaisir. Lorsque son orgasme la traverse, Remerii serre votre main plutôt que de chercher une formule.", ["Remerii", "Gardez exactement cette version de moi.", "calm"]],
      ),
      ellipse: ["Vous défaites la dernière attache et Remerii éteint la lumière avant de pouvoir commenter votre sourire. Ses demandes restent audibles longtemps après la disparition du décor."],
      closing: ["Quand elle retrouve une phrase entière, Remerii ne s’en sert pas pour reprendre le dessus. Elle vous attire simplement contre elle.", ["Remerii", "Cette démonstration restera strictement privée. Sa reproduction, en revanche, est négociable.", "smirk"]],
      after: sexText("Elle repose sa joue contre votre poitrine et laisse ses bijoux de travers.", "Ses doigts dessinent distraitement une portée sur votre épaule.", "Elle reformule votre prénom comme s’il constituait, à lui seul, une conclusion suffisante."),
    },
    {
      id: "contrepoint-vivant",
      labels: sexText("Faire répondre vos corps comme deux voix d’un contrepoint", "Improviser jusqu’à perdre toute mesure commune", "Composer un rythme qui change avec chacun de vos gestes"),
      detail: "Une intimité mutuelle inspirée par la musique, où l’initiative circule et où Remerii accepte l’imprévu.",
      prelude: sexText("Vous rejouez du bout des doigts sur sa peau la phrase musicale laissée inachevée au rendez-vous.", "Remerii écoute votre pouls, puis vous demande de suivre le sien sans chercher lequel impose le tempo.", "Vous convenez d’un signal pour ralentir et d’un autre pour changer de rythme ; Remerii les transforme aussitôt en motif musical."),
      setup: ["Vos gestes se répondent comme deux phrases qui refusent la résolution attendue. Chaque changement d’initiative surprend Remerii et nourrit visiblement son envie.", ["Remerii", "Ne concluez pas encore. Cette dissonance commence à devenir intéressante.", "smirk"]],
      deepening: ["Vous apprenez à vous interrompre sans vous couper, à reprendre un geste offert par l’autre et à laisser les respirations remplacer le métronome.", ["{player}", "À votre tour."], ["Remerii", "Notre tour.", "calm"]],
      tender: ["Le contrepoint devient une suite de baisers et de mains entremêlées. Remerii accepte même un silence entier entre deux gestes sans chercher à le remplir.", ["Remerii", "Cette pause n’est pas vide. Je commence enfin à l’entendre.", "calm"]],
      suggestive: ["Vos vêtements tombent au fil des reprises. Remerii vous renverse avec un sourire, puis vous laisse modifier la phrase contre sa gorge, ses hanches et son souffle.", ["Remerii", "Improvisation validée. Poursuivez avant que je ne devienne raisonnable.", "smirk"]],
      explicit: sexLines(
        ["Vous alternez vos bouches et vos mains, donnant puis recevant sans hiérarchie stable. Remerii jouit sous vos gestes avant de vous ramener contre elle et de prolonger votre propre plaisir jusqu’à la même perte de mesure.", ["Remerii", "Nous reprendrons depuis le début. Plus tard. Beaucoup plus tard.", "smirk"]],
        ["Le rythme passe de vos hanches à ses mains, de sa bouche à la vôtre. Remerii cède sous vos gestes puis vous accueille contre elle, attentive à vous conduire au même vertige sans rompre le mouvement.", ["Remerii", "Ne comptez plus. Je vous suis.", "calm"]],
        ["Vous échangez les gestes et les indications comme une partition vivante. Aucun rôle ne reste fixe ; le plaisir de Remerii répond au vôtre jusqu’à ce que vos corps trouvent ensemble leur résolution.", ["Remerii", "C’est donc cela, une mesure qui ne réduit personne.", "calm"]],
      ),
      ellipse: ["La dernière rune pulse au rythme de vos respirations avant de s’éteindre. La musique se poursuit hors champ, libérée de toute partition."],
      closing: ["Au matin, Remerii rouvre le clavier, joue votre première note imparfaite et la laisse volontairement sans correction.", ["Remerii", "Celle-ci ne devra jamais être parfaite. C’est ce qui la rend nôtre.", "calm"]],
      after: sexText("Son bras reste autour de votre taille tandis que la note disparaît.", "Elle pose sa main sur votre torse pour retrouver le tempo de la nuit.", "Elle vous demande de choisir le nom de cette composition, puis refuse toutes les réponses trop sérieuses."),
    },
  ],

  iriana: [
    {
      id: "sans-couronne",
      labels: sexText("Laisser Iriana vous désirer sans témoin ni titre", "Lui offrir un choix que son rang ne peut pas confisquer", "La laisser nommer vos corps sans protocole préétabli"),
      detail: "Iriana mène librement, en formulant ses envies comme une femme plutôt que comme une héritière impériale.",
      prelude: sexText("Iriana retire son diadème puis regarde vos courbes sans chercher à transformer son désir en décision politique.", "Elle pose la paume sur votre torse et attend que vous lui confirmiez que ce geste n’appartient qu’à elle.", "Iriana vous demande les mots que vous employez pour vous-même et les reprend avec un sérieux débarrassé de toute cérémonie."),
      setup: [["Iriana", "Ce soir, je veux pouvoir changer d’avis sans que personne appelle cela une faiblesse.", "calm"], "Vous lui donnez cet espace. Iriana s’en sert d’abord pour respirer, puis pour vous rapprocher avec une franchise presque farouche."],
      deepening: ["Elle annonce ce qu’elle veut avant chaque nouveau geste, non par froideur mais pour goûter la liberté de le choisir à voix haute. Ses demandes deviennent plus directes avec votre confiance.", ["Iriana", "Je vous veux près. Davantage. Voilà, c’est dit.", "troubled"]],
      tender: ["Iriana vous embrasse longuement, recommence votre prénom sans titre et se laisse tenir sans devoir représenter autre chose qu’elle-même.", ["Iriana", "Ne me devinez pas. Restez et écoutez-moi.", "calm"]],
      suggestive: ["Ses mains ouvrent vos vêtements avec une impatience qu’aucun protocole ne ralentit. Iriana observe votre plaisir comme une vérité privée qu’elle n’a pas à partager avec l’Empire.", ["Iriana", "Regardez-moi. Cette réponse est la seule audience que je désire.", "smirk"]],
      explicit: sexLines(
        ["Iriana s’installe entre vos cuisses, suit vos indications puis laisse son désir rendre sa bouche et ses doigts plus insistants. Elle vous conduit jusqu’à l’orgasme sans détourner le regard lorsqu’il vous traverse.", ["Iriana", "Ce plaisir n’appartient à aucun récit officiel. Seulement à nous.", "troubled"]],
        ["Elle prend votre désir en main, en éprouve le rythme puis vous fait céder avec une ardeur débarrassée de toute bienséance. Son propre souffle se brise lorsqu’elle sent votre corps perdre sa discipline.", ["Iriana", "Ne vous retenez pas devant moi. Pas ici.", "troubled"]],
        ["Iriana suit exactement les gestes que vous nommez, puis vous demande d’une voix de plus en plus grave ce que vous souhaitez encore. Votre corps devient un territoire libre, jamais un dossier à classer.", ["Iriana", "Dites-le. Ce soir, vos mots n’engagent que votre plaisir.", "calm"]],
      ),
      ellipse: ["Iriana tire les rideaux, dépose sa couronne de l’autre côté et prononce votre prénom dans l’obscurité. La chronique reste avec les insignes abandonnés."],
      closing: ["Elle demeure nue de tout titre bien après que vos souffles se sont apaisés. Sa main cherche la vôtre sans ordre, sans révérence et sans témoin.", ["Iriana", "Demain, je remettrai la couronne. Ne la laissez pas effacer la femme qui vous a choisi ce soir.", "calm"]],
      after: sexText("Elle pose un baiser au creux de votre épaule avant de se blottir contre vous.", "Son front repose contre votre torse, à l’endroit où votre cœur répond encore au sien.", "Elle répète les mots que vous lui avez confiés afin qu’aucun titre ne les remplace au matin."),
    },
    {
      id: "protocole-renverse",
      labels: sexText("Faire céder le maintien impérial sous une tendresse exigeante", "Lui apprendre qu’elle peut recevoir sans contracter une dette", "Prendre l’initiative puis lui rendre chaque décision"),
      detail: "Vous menez Iriana hors de son rôle, sans confondre abandon et dépossession.",
      prelude: sexText("Vous décrochez vous-même le premier bijou ; Iriana se charge du suivant sans quitter votre bouche des yeux.", "Vous l’allongez sans révérence et lui demandez de ne rien offrir en retour avant d’en avoir envie.", "Vous prenez l’initiative ; Iriana la modifie, la renverse et utilise bientôt chacune de ces possibilités pour vous troubler."),
      setup: ["Votre attention ne lui réclame aucune performance. Iriana résiste d’abord au simple fait de recevoir, puis son corps comprend avant sa fierté que rien ne lui sera facturé au matin.", ["{player}", "Vous ne me devez pas la suite."], ["Iriana", "Alors je peux enfin la vouloir.", "troubled"]],
      deepening: ["Vous faites disparaître ses dernières postures sous des gestes patients. Iriana vous corrige quand elle le souhaite, vous attire quand l’attente devient trop longue et ne s’excuse plus de son impatience.", ["Iriana", "Continuez. Cette fois, c’est une demande.", "smirk"]],
      tender: ["Vous embrassez ses paupières, sa gorge et ses mains, tous les endroits où la souveraine s’installe d’ordinaire. Iriana se détend par fragments confiés.", ["Iriana", "Je ne savais pas qu’être regardée sans être évaluée pouvait me fatiguer aussi doucement.", "calm"]],
      suggestive: ["Votre bouche descend le long de sa peau libérée. Le maintien impérial cède à des mouvements plus francs ; Iriana finit par vous guider sans formuler une seule phrase officielle.", ["Iriana", "Plus bas. Et ne souriez pas comme si vous aviez gagné une guerre.", "troubled"]],
      explicit: sexLines(
        ["Vous faites de ses cuisses, de son ventre et de sa poitrine une suite de réactions privées avant de trouver son plaisir de la bouche et des doigts. Iriana jouit sans étouffer son cri, puis vous attire immédiatement contre elle.", ["Iriana", "Restez. Je n’ai pas encore envie de redevenir digne.", "troubled"]],
        ["Votre force reste contenue, offerte, pendant que votre bouche défait sa posture. Iriana vous guide avec franchise jusqu’à ce que son orgasme lui retire toute voix de commandement et ne laisse que votre prénom.", ["Iriana", "Voilà une victoire que je refuse de transformer en dette.", "calm"]],
        ["Vous lui faites décrire chaque rythme désiré et changez aussitôt lorsqu’elle le demande. Iriana reçoit sans se justifier ; son plaisir monte dans un langage construit par vous deux et choisi à chaque étape.", ["Iriana", "Je peux recevoir et rester souveraine de moi-même. Continuez.", "calm"]],
      ),
      ellipse: ["Sa robe rejoint le diadème. Vous restez visible dans son regard jusqu’à ce qu’Iriana ferme elle-même les rideaux sur la suite."],
      closing: ["Iriana récupère son souffle avant ses insignes. Elle ne remercie pas comme après un service ; elle vous embrasse comme après une vérité.", ["Iriana", "Vous ne m’avez rien pris. Vous m’avez laissé choisir de déposer le reste.", "calm"]],
      after: sexText("Elle garde votre main contre sa taille, là où aucun ruban ne la serre plus.", "Elle laisse sa jambe reposer sur la vôtre sans corriger la position.", "Elle vous demande ce que vous avez ressenti et écoute la réponse sans préparer la sienne."),
    },
    {
      id: "valse-privee",
      labels: sexText("Alterner l’élan et l’abandon comme une valse interdite", "Changer de conduite à chaque reprise de la musique", "Inventer une danse dont aucun rôle ne reste fixe"),
      detail: "Une route mutuelle où l’intimité prolonge la danse et où chacun·e peut mener, suivre ou interrompre.",
      prelude: sexText("Vous replacez la main d’Iriana à votre taille comme au début de la danse, mais sans la distance réglementaire.", "Iriana glisse sa jambe entre les vôtres et vous demande, sourire aux lèvres, qui mène réellement.", "Vous convenez qu’un changement de main changera aussi l’initiative ; la première permutation arrive avant la fin du baiser."),
      setup: ["La valse revient dans vos appuis, débarrassée de ses spectateurs. Iriana vous fait tourner, vous la ramenez contre le velours et aucun pas ne conserve longtemps son propriétaire.", ["Iriana", "Cette figure provoquerait un scandale remarquable.", "smirk"]],
      deepening: ["Vos vêtements tombent comme des couches de costume entre deux reprises. L’initiative circule avec la musique, parfois affirmée, parfois offerte, toujours lisible dans vos regards.", ["{player}", "Encore un tour."], ["Iriana", "J’espérais que vous le demanderiez.", "smirk"]],
      tender: ["La danse ralentit jusqu’à devenir une étreinte en mouvement. Iriana pose enfin la tête sur votre épaule avant la fin de la musique et refuse de la relever.", ["Iriana", "Cette fois, personne ne me rappellera à ma place.", "calm"]],
      suggestive: ["Vous alternez contre le velours, chacun·e ramenant l’autre plus près à chaque changement de conduite. Les soupirs remplacent bientôt les comptes de mesure.", ["Iriana", "À mon tour… puis reprenez-le-moi.", "smirk"]],
      explicit: sexLines(
        ["La danse devient un échange de bouches, de mains et de rythmes. Iriana jouit sous vos gestes avant de vous renverser contre le velours et de prolonger le plaisir entre vos cuisses jusqu’à votre propre abandon.", ["Iriana", "Aucun vainqueur. Seulement une reprise.", "troubled"]],
        ["Iriana vous accueille dans le mouvement puis le renverse, vos hanches et ses mains composant une cadence de plus en plus directe. Vous la conduisez au plaisir avant qu’elle ne vous entraîne au vôtre.", ["Iriana", "Ne rompez pas la mesure maintenant.", "troubled"]],
        ["Vos corps changent de conduite sans rôle imposé. Chaque indication donnée devient un geste rendu ; Iriana atteint son plaisir en vous regardant construire le vôtre dans le même mouvement.", ["Iriana", "C’est notre danse. Rien d’autre n’a besoin de la comprendre.", "calm"]],
      ),
      ellipse: ["La musique poursuit seule ses tours derrière les rideaux. Lorsque le récit s’éloigne, la couronne est déjà trop loin pour rejoindre la danse."],
      closing: ["Vous regagnez le parquet pieds nus, encore enlacé·es. Iriana laisse la dernière valse s’achever sans pose finale.", ["Iriana", "Je préfère cette danse lorsqu’elle ne prouve rien à personne.", "calm"]],
      after: sexText("Elle garde sa joue contre la vôtre pendant le dernier accord.", "Elle suit votre respiration jusqu’à retrouver un tempo calme.", "Elle serre vos doigts au moment exact où la musique s’éteint."),
    },
  ],

  valurn: [
    {
      id: "pari-livre",
      labels: sexText("Lui confier vos réactions sans lui permettre de les miser", "Déposer votre désir entre ses mains sans signer de pacte", "Lui faire découvrir votre corps sans carte ni contrat"),
      detail: "Valurn mène, mais chaque geste doit rester une offre sans dette ni victoire cachée.",
      prelude: sexText("Valurn ouvre la bouche pour annoncer une mise ; vous la fermez d’un baiser avant que le jeu ne commence.", "Vous lui donnez la clé de la chambre, puis refermez ses doigts sans accepter la moindre condition.", "Vous lui expliquez vos repères sans les transformer en clauses. Valurn écoute avec une gravité rare."),
      setup: [["Valurn", "Une nuit sans prix, sans gagnant et sans dette. Vous me demandez beaucoup.", "away"], ["{player}", "Je vous demande de rester."], "Son sourire perd sa fonction de diversion. Il vous touche comme si le geste pouvait exister sans garantir la suite."],
      deepening: ["Valurn vérifie vos réactions par le regard plutôt que par une plaisanterie. Chaque fois que vous revenez vers lui, une part de sa vigilance quitte la porte.", ["Valurn", "Dites-moi que c’est encore votre choix. J’ai envie de l’entendre sans sceau.", "away"]],
      tender: ["Il vous couvre d’une attention étonnamment calme, garde vos mains visibles et reçoit chaque sourire comme quelque chose qu’il n’a pas eu à négocier.", ["Valurn", "Rien à gagner. Voilà qui devient dangereusement agréable.", "charming"]],
      suggestive: ["Ses charmes deviennent des gestes au lieu de répliques. Valurn explore sous vos vêtements, ralentit lorsque votre souffle change et ne plaisante plus pour masquer son propre désir.", ["Valurn", "Je pourrais m’habituer à cette franchise très peu prudente.", "away"]],
      explicit: sexLines(
        ["Valurn descend entre vos cuisses sans détourner l’instant en jeu. Sa bouche et ses doigts suivent ce que votre corps réclame jusqu’à vous faire jouir, puis il reste là, bouleversé par une confiance qu’il n’a pas achetée.", ["Valurn", "Aucune dette. Promettez-moi seulement de ne pas appeler cela un paiement.", "away"]],
        ["Il prend votre désir entre ses mains, en éprouve le rythme puis vous accueille de la bouche avec une attention débarrassée de toute démonstration. Votre abandon lui retire son dernier sourire de façade.", ["Valurn", "Je n’ai rien gagné… et je n’ai jamais autant voulu rester.", "away"]],
        ["Valurn suit vos mots et vos gestes sans supposer la forme de votre plaisir. Sa bouche, ses mains et sa magie répondent à votre corps réel jusqu’à ce que toute négociation disparaisse.", ["Valurn", "Merci de m’avoir donné une vérité que je n’ai pas eu à voler.", "away"]],
      ),
      ellipse: ["Valurn pose ses cartes face cachée et vous rejoint derrière le paravent. Pour une fois, aucun symbole ne raconte la suite à votre place."],
      closing: ["Au matin, la clé est toujours dans votre main et Valurn n’a pas quitté le lit avant l’aube. Il contemple ces deux faits comme une défaite espérée.", ["Valurn", "Je propose que nous ne décidions jamais lequel de nous a gagné.", "charming"]],
      after: sexText("Il suit du doigt la courbe de votre hanche sans chercher un signe à interpréter.", "Sa tête repose contre votre épaule, les mains enfin vides.", "Il vous demande le geste à retenir de cette nuit et accepte que la réponse puisse changer."),
    },
    {
      id: "masque-tombe",
      labels: sexText("Faire tomber son charme jusqu’à obtenir une réaction sans détour", "Le pousser contre les draps avant qu’il invente une pirouette", "Choisir chaque renversement et l’obliger à rester présent"),
      detail: "Vous prenez l’initiative et désarmez progressivement l’élégance défensive de Valurn.",
      prelude: sexText("Vous retirez une à une les cartes cachées dans ses manches avant de vous occuper du reste.", "Vous le faites reculer jusqu’au lit ; son sourire assuré se trouble lorsque vous ne lui laissez aucun public.", "Vous laissez Valurn anticiper le prochain geste puis changez d’idée au moment où son corps vient le chercher. Il comprend que l’imprévu peut être délicieux."),
      setup: ["Chaque plaisanterie reçoit un baiser qui l’empêche de devenir une issue de secours. Valurn rit d’abord, puis son souffle se brise lorsque vos mains trouvent une vérité plus directe.", ["Valurn", "Vous avez une conception très personnelle de la négociation.", "amused"]],
      deepening: ["Vous le laissez choisir de revenir vers vous après chaque recul. Il revient toujours plus vite, abandonne ses effets de manche et finit par demander sans détour.", ["Valurn", "Ne vous arrêtez pas au moment précis où je cesse d’être brillant.", "away"]],
      tender: ["Vous embrassez les marques laissées par ses pactes et lui rappelez que sa vulnérabilité n’est ni une faiblesse ni une monnaie. Valurn se laisse tenir sans commentaire.", ["Valurn", "Je crains que vous ne me rendiez honnête par la douceur.", "away"]],
      suggestive: ["Vos mains ouvrent ses vêtements tandis que sa voix perd ses détours. Valurn vous indique ce qu’il veut par de courtes phrases et des mouvements qu’aucun sourire ne dissimule plus.", ["Valurn", "Là. Continuez et oubliez tout compliment spirituel.", "away"]],
      explicit: sexLines(
        ["Vous faites de son corps un lieu où il n’a rien à vendre. Votre bouche et vos mains le conduisent au plaisir ; quand Valurn cède, son gémissement ne ressemble à aucune performance et sa main cherche seulement la vôtre.", ["Valurn", "Restez pendant que je n’ai plus rien d’élégant à offrir.", "away"]],
        ["Vous prenez son sexe entre vos doigts puis votre bouche, maintenant le rythme qui lui fait perdre toute répartie. Valurn jouit sans parvenir à sauver une seule plaisanterie et vous attire aussitôt contre lui.", ["Valurn", "Vous venez de ruiner une réputation soigneusement entretenue.", "amused"]],
        ["Vous lui faites nommer les gestes qui le désarment et recevez ses réponses sans les utiliser contre lui. Son plaisir devient franc, physique, libéré de l’image qu’il projette.", ["Valurn", "Voilà donc ce qui reste quand je ne joue plus. Ne partez pas.", "away"]],
      ),
      ellipse: ["Les cartes rejoignent les vêtements sur le sol. La chronique quitte la partie lorsque Valurn prononce votre prénom sans sourire."],
      closing: ["Son masque ne revient pas immédiatement. Valurn reste décoiffé, silencieux et presque étonné que vous le trouviez encore désirable ainsi.", ["Valurn", "Vous pourriez au moins feindre d’être impressionné·e par ma vulnérabilité dramatique.", "amused"]],
      after: sexText("Il dépose un baiser sans malice sur votre ventre.", "Il garde une main autour de votre nuque comme une ancre discrète.", "Il vérifie que le silence vous convient avant de s’y installer avec vous."),
    },
    {
      id: "jeu-sans-vainqueur",
      labels: sexText("Échanger les initiatives jusqu’à perdre la règle du jeu", "Faire de chaque renversement une nouvelle invitation", "Inventer une partie où les rôles changent avec le désir"),
      detail: "Une route mutuelle, vive et joueuse, où Valurn apprend que l’imprévu n’impose aucune dette.",
      prelude: sexText("Vous dessinez une règle sur son torse : toute provocation doit être suivie d’une vérité.", "Valurn vous défie de garder l’avantage plus d’un baiser ; vous acceptez sans convenir de ce qu’avantage signifie.", "Vous décidez qu’un mot suffit à changer de rôle. Valurn teste le système avec une prudence cachée sous son enthousiasme."),
      setup: ["Le jeu vous fait changer de position, de rythme et d’initiative. Valurn triche deux fois, avoue une fois et vous embrasse chaque fois que la vérité devient trop proche.", ["Valurn", "Je n’ai jamais autant apprécié des règles qui m’empêchent de gagner.", "charming"]],
      deepening: ["Vos provocations perdent leur tranchant à mesure que le désir devient sincère. Chaque renversement se vérifie dans un regard avant de devenir plus intense.", ["{player}", "À moi."], ["Valurn", "Pour l’instant.", "amused"]],
      tender: ["La partie ralentit dans une étreinte où personne ne cherche l’issue. Valurn vous raconte une vérité minuscule entre deux baisers et vous laisse en offrir une autre.", ["Valurn", "Cette manche pourrait durer jusqu’au matin.", "away"]],
      suggestive: ["Vous changez d’avantage sous les draps, guidé·es par les rires, les souffles et les mains qui demandent davantage. Valurn oublie plusieurs fois de compter.", ["Valurn", "Encore un renversement. Purement par souci d’équité.", "charming"]],
      explicit: sexLines(
        ["Vous lui donnez du plaisir jusqu’à faire tomber son masque, puis Valurn renverse le jeu et s’attarde entre vos cuisses. Vos orgasmes arrivent dans des manches successives qu’aucun de vous ne veut conclure.", ["Valurn", "Égalité parfaite. Ce résultat exige une revanche immédiate.", "amused"]],
        ["Vos mains et vos bouches se relaient, son plaisir cédant sous vous avant qu’il ne prenne le vôtre en charge avec la même intensité. Le jeu disparaît dans des mouvements plus francs.", ["Valurn", "Ne décidez surtout pas qui mène. J’aime beaucoup cette confusion.", "charming"]],
        ["Vous alternez selon les mots convenus, chacun·e guidant l’autre à travers son corps réel. Le plaisir circule sans modèle fixe jusqu’à ce que vos réactions deviennent la seule règle encore utile.", ["Valurn", "Une liberté sans dette. Vous êtes décidément dangereux·se.", "away"]],
      ),
      ellipse: ["Valurn retourne la dernière carte : elle est blanche. Vos silhouettes disparaissent derrière le paravent avant qu’un dessin puisse les enfermer."],
      closing: ["Au matin, la carte blanche porte seulement deux empreintes de doigts et une tache de vin. Valurn refuse d’y ajouter une légende.", ["Valurn", "Les meilleurs souvenirs résistent remarquablement aux contrats.", "away"]],
      after: sexText("Il demeure enroulé autour de votre taille, encore trop heureux pour le cacher.", "Il pose un baiser contre votre clavicule en prétendant clore officiellement la partie.", "Il vous laisse choisir si la prochaine manche commencera par un rire, une vérité ou un silence."),
    },
  ],

  naiah: [
    {
      id: "illusion-verite",
      labels: sexText("Laisser Naïah chercher le vrai sous chaque frisson", "Lui confier votre désir sans lui demander d’abandonner ses illusions", "Lui apprendre les signes uniques de votre plaisir"),
      detail: "Naïah mène avec ses illusions, mais ne conserve que celles qui amplifient vos réactions réelles.",
      prelude: sexText("Trois mains illusoires effleurent votre peau ; la vraie hésite avant de se poser, chaude, contre votre hanche.", "Naïah fait apparaître trois reflets de votre torse puis les dissipe pour ne garder que votre respiration véritable.", "Vous lui montrez le signal qui signifie oui, celui qui signifie ralentir et celui qui demande autre chose. Ses illusions les apprennent avec elle."),
      setup: [["Naïah", "Je peux embellir presque n’importe quoi. Ce soir, je veux surtout savoir ce que je n’ai pas besoin d’inventer.", "thinking"], "Elle éprouve vos réactions avec des souffles, des lumières et des contacts dont un seul est réel. Vous reconnaissez bientôt sa main à sa petite hésitation."],
      deepening: ["Naïah conserve les mirages qui vous font sourire et chasse ceux qui s’interposent. Son jeu devient une attention très sérieuse sous ses airs de défi.", ["Naïah", "Ton corps ment beaucoup moins bien que ton visage. C’est charmant.", "smirk"]],
      tender: ["Les illusions deviennent de simples lucioles autour de vos baisers. Naïah garde ses vraies mains sur vous et accepte que la douceur n’ait aucun piège.", ["Naïah", "Je pourrais rendre ça spectaculaire. Mais je préfère te sentir respirer.", "thinking"]],
      suggestive: ["Les mirages prolongent ses caresses sans remplacer son corps. Naïah joue avec l’attente, puis revient elle-même là où votre désir la réclame le plus franchement.", ["Naïah", "Tu sais toujours laquelle est moi. Montre-le-moi encore.", "smirk"]],
      explicit: sexLines(
        ["Naïah fait disparaître les copies et s’installe réellement entre vos cuisses. Sa bouche et ses doigts suivent vos réactions jusqu’à vous faire jouir, tandis que la clairière illusoire se couvre de fleurs à chaque spasme.", ["Naïah", "Ça, aucune illusion ne sait le fabriquer.", "thinking"]],
        ["Ses mirages reproduisent la chaleur mais seule Naïah garde votre désir entre sa main et sa bouche. Elle apprend votre rythme, le trouble puis le retrouve jusqu’à faire céder votre corps contre elle.", ["Naïah", "Le vrai tremble toujours un peu plus. J’adore ça.", "smirk"]],
        ["Naïah suit vos indications et adapte ses formes magiques sans jamais remplacer votre corps réel. Sa bouche et ses mains explorent ce qui vous fait céder jusqu’à ce que tous les mirages répondent à votre plaisir.", ["Naïah", "Je pourrais changer le décor mille fois. Je ne changerais rien à toi.", "thinking"]],
      ),
      ellipse: ["Naïah efface le décor pièce par pièce jusqu’à ne garder que votre silhouette près de la sienne. L’obscurité réelle vous accueille avant la suite."],
      closing: ["Au matin, une seule fleur illusoire repose encore près de vous. Naïah la rend réelle assez longtemps pour la glisser dans votre main.", ["Naïah", "Souvenir véritable. Enfin… véritable jusqu’à midi. Après, il faudra revenir me voir.", "smirk"]],
      after: sexText("Elle dessine une constellation paresseuse sur votre ventre.", "Elle pose sa joue contre votre épaule et écoute votre souffle sans le copier.", "Elle vous demande quel mirage vous avez préféré, puis sourit lorsque vous répondez : aucun."),
    },
    {
      id: "predatrice-surprise",
      labels: sexText("Surprendre la chasseuse jusqu’à faire tomber tous ses doubles", "Retourner son jeu et obtenir une Naïah sans échappatoire", "Choisir le réel, puis la laisser le réclamer à son tour"),
      detail: "Vous prenez l’initiative et forcez gentiment Naïah à rester elle-même plutôt qu’à se cacher dans le spectacle.",
      prelude: sexText("Vous traversez deux illusions et saisissez la vraie Naïah par la taille avant qu’elle ne change encore de place.", "Vous laissez son double vous provoquer, puis attirez la véritable Naïah contre vous sans quitter son regard.", "Vous nommez le reflet réel et renversez son propre jeu lorsque ses bras viennent se nouer autour de vous."),
      setup: ["Naïah rit lorsqu’elle perd l’avantage, puis son rire se transforme en souffle quand vous ne lui laissez aucun masque à reprendre. Elle pourrait disparaître ; elle choisit de rester.", ["Naïah", "Tu apprends vite. C’est très mauvais pour ma réputation.", "smirk"]],
      deepening: ["Vous dissipez chaque nouvelle illusion par un geste plus précis sur la femme réelle. Naïah finit par fermer les yeux, renonçant volontairement à surveiller la scène.", ["{player}", "Pas de double."], ["Naïah", "Seulement moi.", "thinking"]],
      tender: ["Vous embrassez sa peau sans chercher le moindre tour caché. Naïah se détend dans cette attention simple et vous confie le poids qu’elle dissimule d’ordinaire sous l’espièglerie.", ["Naïah", "Ne me trouve pas trop facilement dehors. Ici… tu peux.", "thinking"]],
      suggestive: ["Vos mains font taire ses dernières provocations. Naïah vous indique ce qu’elle veut par des mouvements de plus en plus directs, son visage réel incapable de cacher son plaisir.", ["Naïah", "Continue. Je trouverai une vengeance après.", "smirk"]],
      explicit: sexLines(
        ["Vous la faites céder sous votre bouche et vos doigts, sans laisser ses doubles détourner l’intensité. L’orgasme de Naïah traverse la clairière réelle ; elle agrippe vos cheveux et oublie toute illusion.", ["Naïah", "Je n’ai rien caché. C’est terrifiant… recommence.", "thinking"]],
        ["Vous guidez sa main contre votre force avant de reprendre l’initiative sur son corps. Naïah jouit sous vos gestes sans se dédoubler, puis vous attire contre elle avec un désir devenu impossible à feindre.", ["Naïah", "Le vrai toi, le vrai moi. On garde cette règle.", "smirk"]],
        ["Vous lui demandez chaque sensation désirée puis la lui offrez sans interpréter son corps à sa place. Naïah abandonne ses mirages au moment où son plaisir devient trop intense pour être joué.", ["Naïah", "Je suis là. Entière. Ne détourne pas les yeux.", "thinking"]],
      ),
      ellipse: ["Vous traversez le dernier reflet et rejoignez la vraie Naïah dans l’ombre. Elle dissipe la clairière avant que le récit puisse inventer une copie de la suite."],
      closing: ["Naïah reste visible, tangible, blottie contre vous. Aucun double ne reprend sa place pendant que l’aube filtre entre les branches.", ["Naïah", "Tu peux continuer à me chercher. Mais maintenant, tu sais aussi me garder.", "thinking"]],
      after: sexText("Elle embrasse votre clavicule avec une douceur sans trucage.", "Elle garde ses doigts mêlés aux vôtres pour se rappeler qu’elle n’a pas disparu.", "Elle vous laisse choisir la première illusion du matin, puis la construit autour de vous deux."),
    },
    {
      id: "jeu-reflets",
      labels: sexText("Mêler vos reflets jusqu’à ne plus savoir qui provoque qui", "Faire de la clairière un terrain de jeu partagé", "Changer les formes sans jamais perdre vos repères"),
      detail: "Une route mutuelle où les illusions répondent à vos deux imaginaires et où les rôles changent sans cesse.",
      prelude: sexText("Votre reflet embrasse le sien une seconde avant vous ; Naïah proteste contre cette avance déloyale.", "Vous défiez son double tandis que la vraie Naïah vous renverse avec un rire victorieux.", "Vous choisissez ensemble les limites du jeu avant de donner aux illusions la liberté de transformer le reste."),
      setup: ["La clairière change à chaque initiative : pluie tiède, fleurs lumineuses, neige violette. Vos corps réels restent le centre stable de ce désordre complice.", ["Naïah", "Si tu te perds, attrape ma main. Ou ma taille. La taille fonctionne aussi.", "smirk"]],
      deepening: ["Vous vous surprenez à tour de rôle, mais chaque renversement revient au contact réel, au souffle non reproduit et au regard qui demande la suite.", ["{player}", "Lequel de nous mène ?"], ["Naïah", "Celui qui a la meilleure idée pendant les trois prochaines secondes.", "smirk"]],
      tender: ["Le jeu devient un ciel doux sous lequel vous vous embrassez sans autre enjeu. Naïah fait apparaître deux silhouettes enlacées et leur donne vos imperfections exactes.", ["Naïah", "Les défauts rendent l’illusion beaucoup plus jolie.", "thinking"]],
      suggestive: ["Les reflets multiplient vos mouvements tandis que vos mains réelles changent d’initiative. Naïah rit, gémit puis inverse la position avant qu’un rôle ne se fixe.", ["Naïah", "Encore un tour. Et cette fois, ne crois pas ce que tu vois.", "smirk"]],
      explicit: sexLines(
        ["Vos plaisirs alternent entre vos bouches et vos mains pendant que les reflets amplifient chaque frisson. Naïah jouit sous vous, puis vous ramène entre ses illusions jusqu’à votre propre abandon.", ["Naïah", "Deux corps, cent reflets, aucun mensonge.", "thinking"]],
        ["Vous échangez le contrôle, vos hanches et vos mains suivant un rythme que les doubles reproduisent trop tard. Naïah cède sous vos gestes avant de vous conduire au plaisir avec la même intensité.", ["Naïah", "La vraie sensation arrive toujours la première.", "smirk"]],
        ["Les formes changent autour de vous, jamais les repères convenus. Vous vous donnez du plaisir selon les indications échangées jusqu’à ce que les illusions éclatent au même instant que vos corps.", ["Naïah", "On vient de rendre le réel jaloux.", "smirk"]],
      ),
      ellipse: ["Une forêt entière de rideaux violets pousse autour de vous. Naïah salue théâtralement le récit avant de le laisser dehors."],
      closing: ["Les reflets disparaissent un à un, révélant vos corps encore enlacés au centre de la véritable clairière.", ["Naïah", "Je préfère la version qui reste quand tous les effets sont partis.", "thinking"]],
      after: sexText("Elle pose une fleur lumineuse derrière votre oreille et affirme qu’elle est parfaitement réelle.", "Elle dessine votre silhouette contre la sienne dans la buée d’une illusion matinale.", "Elle vous demande quelle forme vous aimeriez essayer une prochaine fois et écoute sans moquerie."),
    },
  ],

  lineva: [
    {
      id: "garde-reposee",
      labels: sexText("Laisser Lineva prendre soin de vous sans monter la garde", "Lui confier votre poids plutôt qu’une position à défendre", "Lui montrer comment protéger votre plaisir sans le contrôler"),
      detail: "Lineva mène avec force et attention, en découvrant que protéger peut aussi signifier écouter.",
      prelude: sexText("Lineva vérifie une dernière fois la porte avant que vous rameniez sa main contre votre hanche.", "Vous vous adossez entièrement contre elle ; Lineva comprend peu à peu que ce poids est offert, pas imposé.", "Vous placez ses mains là où vous les souhaitez et lui donnez un signal clair pour chaque changement."),
      setup: [["Lineva", "La ville est gardée. Toi aussi… non. Mauvaise habitude. Ce soir, je t’écoute.", "thoughtful"], "Sa force reste présente sans devenir une consigne. Elle vous soutient, vous entoure et attend vos réactions avant d’avancer."],
      deepening: ["Lineva apprend à ne pas anticiper le danger derrière chaque tension de votre corps. Vos soupirs deviennent des indications auxquelles elle répond avec une patience presque solennelle.", ["Lineva", "Dis-moi où tu me veux. Je préfère un ordre honnête à une devinette.", "smirk"]],
      tender: ["Elle vous garde contre elle, couvre votre visage et vos épaules de baisers et accepte que la sécurité puisse être une chaleur plutôt qu’une surveillance.", ["Lineva", "Je peux tenir ainsi sans attendre l’alarme.", "thoughtful"]],
      suggestive: ["Ses mains deviennent plus franches sous vos vêtements, toujours stables, jamais pressées. Lineva sourit lorsque votre corps vient chercher davantage de cette force contenue.", ["Lineva", "Je te tiens. Tu peux cesser de faire semblant du contraire.", "smirk"]],
      explicit: sexLines(
        ["Lineva vous installe solidement contre les draps puis descend entre vos cuisses. Sa bouche et ses doigts gardent un rythme sûr jusqu’à votre orgasme, sans lâcher votre main lorsque votre corps se tend.", ["Lineva", "Je suis là. Laisse venir.", "thoughtful"]],
        ["Elle maintient votre bassin avec une force attentive tandis que sa main puis sa bouche suivent votre désir. Lineva ne ralentit qu’à votre signal et vous conduit au plaisir sans jamais transformer sa puissance en prise.", ["Lineva", "Tu peux céder. Je te tiens encore.", "thoughtful"]],
        ["Lineva suit vos repères avec la précision d’une garde devenue tendresse. Ses mains et sa bouche explorent votre corps selon vos mots jusqu’à ce que vous puissiez vous abandonner sans perdre le contrôle de vous-même.", ["Lineva", "Ton corps t’appartient. Je protège seulement l’espace autour.", "thoughtful"]],
      ),
      ellipse: ["Lineva dépose son épée hors de portée puis vous entoure de ses bras. La porte reste fermée ; pour une fois, elle ne l’écoute plus."],
      closing: ["Elle reste éveillée quelques minutes par réflexe, puis comprend que votre respiration calme ne réclame aucune relève.", ["Lineva", "Ne bouge pas. Ce n’est pas un ordre. C’est une demande bien formulée.", "thoughtful"]],
      after: sexText("Sa paume repose sur votre ventre comme une chaleur constante.", "Elle garde votre dos contre son torse et votre main dans la sienne.", "Elle vous demande ce qui vous a fait vous sentir le plus libre, puis grave la réponse dans sa mémoire."),
    },
    {
      id: "armure-deposee",
      labels: sexText("Défaire son armure puis prendre soin de ce qu’elle cachait", "Lui offrir une force sur laquelle elle peut enfin s’appuyer", "Lui rendre chaque attache comme un choix plutôt qu’une reddition"),
      detail: "Vous menez Lineva vers le repos et lui permettez de recevoir sans perdre sa dignité ni sa puissance.",
      prelude: sexText("Vous dénouez son dernier lacet avec les dents ; Lineva oublie une seconde de surveiller la fenêtre.", "Vous soutenez son armure pendant qu’elle s’en libère, puis lui offrez votre épaule à la place.", "Vous demandez avant chaque attache. Lineva répond de plus en plus vite à mesure que le métal cesse de définir la scène."),
      setup: ["L’armure tombe pièce par pièce. Sous elle, Lineva ne devient pas fragile : elle devient fatiguée, chaude, vivante et autorisée à vous confier son poids.", ["Lineva", "Je ne sais pas rester sans mission. Donne-m’en une simple.", "thoughtful"], ["{player}", "Recevoir."]],
      deepening: ["Vous prenez le temps de détendre ses épaules et de faire disparaître les réflexes de garde sous vos mains. Lineva vous indique sans honte les endroits qui réclament davantage.", ["Lineva", "Là. Pas pour réparer. Juste… continue.", "smirk"]],
      tender: ["Vous embrassez les marques de l’armure et les endroits qu’aucun uniforme ne montre. Lineva ferme enfin les yeux avant vous.", ["Lineva", "Je pensais que déposer le poids me rendrait vide. Pas avec toi.", "thoughtful"]],
      suggestive: ["Vos mains descendent sous les dernières couches de tissu. Lineva reçoit chaque caresse avec une franchise croissante et cesse de surveiller sa propre réaction.", ["Lineva", "Je peux encaisser davantage. Non… je peux vouloir davantage.", "smirk"]],
      explicit: sexLines(
        ["Vous suivez ses cicatrices puis son ventre jusqu’à l’intérieur de ses cuisses. Votre bouche et vos doigts font céder Lineva par vagues ; son orgasme la traverse sans qu’elle cherche à se redresser ou à reprendre la garde.", ["Lineva", "Reste là. Le monde peut attendre une minute.", "thoughtful"]],
        ["Votre force soutient son corps tandis que vos mains et votre bouche trouvent le rythme qui lui retire toute tension militaire. Lineva jouit contre vous et ne s’excuse ni du bruit ni du poids qu’elle vous confie.", ["Lineva", "Je ne tombe pas. Je m’appuie sur toi.", "thoughtful"]],
        ["Vous transformez chaque indication de Lineva en geste précis, sans décider à sa place de ce que son corps devrait ressentir. Son plaisir s’intensifie jusqu’à ce qu’elle s’abandonne entièrement au soutien offert.", ["Lineva", "Je choisis de déposer le reste. Avec toi.", "thoughtful"]],
      ),
      ellipse: ["Le manteau rejoint l’armure. Lineva vous entraîne vers le lit sans vérifier une dernière fois les remparts, et la chronique prend la garde à sa place."],
      closing: ["Lorsque Lineva rouvre les yeux, rien n’a brûlé, aucune cloche n’a sonné et vous êtes encore là. Son soulagement devient un sourire presque timide.", ["Lineva", "J’aimerais apprendre à faire cela avant d’être épuisée.", "thoughtful"]],
      after: sexText("Elle se laisse border contre votre chaleur sans protester.", "Son bras lourd reste posé sur votre taille comme une confiance visible.", "Elle replace elle-même votre main contre son cœur avant de se rendormir."),
    },
    {
      id: "releve-a-deux",
      labels: sexText("Échanger force et tendresse comme une relève à deux", "Alterner les appuis jusqu’à ce qu’aucun ne porte tout", "Changer de rôle à chaque fois que l’un·e en ressent le besoin"),
      detail: "Une route mutuelle où l’initiative circule et où la force de Lineva devient un jeu partagé.",
      prelude: sexText("Vous annoncez une relève et Lineva rit, avant de comprendre que vous parlez de l’étreinte.", "Lineva vous renverse par réflexe ; vous lui demandez aussitôt quand elle souhaite que vous repreniez la position.", "Vous choisissez un mot pour changer d’initiative. Lineva l’emploie d’abord très sérieusement, puis avec un sourire."),
      setup: ["Vous vous soutenez tour à tour : une main offerte quand l’autre se tend, une étreinte reprise quand le poids devient trop lourd. Lineva découvre une discipline qui ne ressemble pas à un ordre.", ["Lineva", "Une relève où personne n’abandonne son poste. Ça, je comprends.", "smirk"]],
      deepening: ["Le rythme devient plus vif. Lineva aime visiblement vous renverser autant que se laisser ramener contre les draps, sa force servant le désir plutôt que la défense.", ["{player}", "Relève."], ["Lineva", "Déjà ? Très bien. Profitez-en.", "smirk"]],
      tender: ["Vous finissez enlacé·es, chacun·e gardant l’autre pendant quelques respirations. La relève devient un repos commun.", ["Lineva", "Je pourrais m’habituer à ne pas être la dernière éveillée.", "thoughtful"]],
      suggestive: ["Les changements d’initiative deviennent des renversements sensuels. Vos mains se répondent, vos souffles se cherchent et Lineva réclame la prochaine relève avant même d’en avoir besoin.", ["Lineva", "À toi. Puis rends-moi la position.", "smirk"]],
      explicit: sexLines(
        ["Vous faites céder Lineva entre vos mains et votre bouche, puis elle reprend la relève et se consacre à votre plaisir entre vos cuisses. Vos orgasmes arrivent l’un après l’autre, soutenus par la même étreinte.", ["Lineva", "Personne n’a porté tout le poids. C’est… nouveau.", "thoughtful"]],
        ["Votre force et la sienne alternent, vos corps changeant de position et de rythme sans lutte. Lineva jouit sous vos gestes avant de reprendre l’initiative et de vous conduire au même abandon.", ["Lineva", "Relève complète. Mais je ne quitte pas la chambre.", "smirk"]],
        ["Vous échangez les gestes selon le mot convenu, chacun·e pouvant mener, recevoir ou ralentir. Le plaisir devient une charge partagée jusqu’à ce que vos corps cèdent ensemble sans que personne ne perde sa place.", ["Lineva", "Voilà une mission que je veux recommencer.", "thoughtful"]],
      ),
      ellipse: ["Vous murmurez le mot de relève une dernière fois sous les couvertures. La chronique prend le tour de garde pendant que les rôles continuent de changer."],
      closing: ["Lineva s’endort contre vous avant de se réveiller par réflexe. Cette fois, elle sourit et ferme aussitôt les yeux.", ["Lineva", "Ton tour de surveiller l’aube. Réveille-moi très tard.", "smirk"]],
      after: sexText("Elle laisse une jambe mêlée aux vôtres, sans position réglementaire.", "Sa main trouve votre nuque dans son sommeil et vous garde près d’elle.", "Elle murmure le mot convenu une dernière fois uniquement pour vérifier que vous répondez."),
    },
  ],

  saidin: [
    {
      id: "present-inconnu",
      labels: sexText("Le laisser découvrir vos réactions sans regarder leur avenir", "Lui offrir un désir qu’aucune vision ne peut préparer", "Lui apprendre votre corps uniquement au présent"),
      detail: "Saidin mène sans utiliser la chronomancie et transforme chaque réaction imprévisible en émerveillement.",
      prelude: sexText("Saidin détourne ses horloges avant de laisser son regard parcourir votre corps réel, sans versions possibles autour.", "Il pose la main contre votre pouls et refuse de regarder la seconde suivante.", "Vous lui donnez vos mots et vos signes présents ; Saidin renonce à chercher une version future qui les expliquerait mieux."),
      setup: [["Saidin", "Il existe mille suites. Je n’en regarderai aucune.", "surprised"], "Ses gestes ont la prudence émerveillée d’un homme qui découvre sans savoir. Chaque réponse de votre corps le surprend réellement."],
      deepening: ["Saidin revient aux sensations qui vous ont fait réagir, non parce qu’il connaît leur résultat, mais parce qu’il désire les vivre une seconde fois avec vous.", ["Saidin", "Encore. Je veux ignorer si ce son reviendra.", "surprised"]],
      tender: ["Il vous touche comme un présent entier, embrassant chaque frisson sans chercher sa conséquence. La lenteur devient une forme de confiance temporelle.", ["Saidin", "Je n’avais jamais compris que l’inconnu pouvait être aussi doux.", "surprised"]],
      suggestive: ["Ses mains descendent sans anticiper votre prochaine réaction. L’étonnement sincère qui traverse son visage rend son désir plus visible que toutes ses certitudes.", ["Saidin", "Ne me dites pas ce qui arrive ensuite. Montrez-le-moi.", "surprised"]],
      explicit: sexLines(
        ["Saidin s’installe entre vos cuisses et suit votre plaisir seconde après seconde, sa bouche et ses doigts refusant tout raccourci temporel. L’orgasme arrive sans vision préalable et le bouleverse autant que vous.", ["Saidin", "C’était maintenant. Et maintenant était suffisant.", "surprised"]],
        ["Il découvre votre désir sous ses doigts puis avec sa bouche, chaque changement de rythme choisi dans l’instant. Saidin vous fait jouir sans ralentir le temps et reste contre vous pendant que la sensation passe réellement.", ["Saidin", "Je n’ai rien conservé. C’est ce qui rend cet instant précieux.", "surprised"]],
        ["Saidin suit vos indications sans consulter la moindre possibilité. Sa bouche et ses mains apprennent votre corps dans le seul présent disponible jusqu’à ce que votre plaisir efface toute autre chronologie.", ["Saidin", "Aucune version de vous ne vaut celle qui me répond ici.", "surprised"]],
      ),
      ellipse: ["Saidin retourne la dernière horloge et souffle la bougie. Le temps poursuit sa route tandis que le récit renonce à connaître la suite."],
      closing: ["L’aube arrive sans effet magique. Saidin la regarde éclairer votre visage comme une couleur qu’il n’aurait jamais rencontrée.", ["Saidin", "Je pourrais dire ce que cette nuit changera. Je préfère vous demander ce que vous voulez aujourd’hui.", "surprised"]],
      after: sexText("Il suit du doigt la lumière matinale sur votre ventre.", "Il écoute votre cœur ralentir sans compter les battements.", "Il répète vos mots de la veille uniquement pour les garder dans le présent."),
    },
    {
      id: "temps-desarme",
      labels: sexText("Lui faire perdre le fil de toutes ses prédictions sous vos mains", "Fermer ses horloges et le ramener entièrement dans son corps", "Lui faire formuler ses sensations plutôt que leurs conséquences"),
      detail: "Vous prenez l’initiative et désarmez le chronomancien sans faire de son pouvoir une honte.",
      prelude: sexText("Vous poussez sa montre au bord de la table avant de couvrir sa prochaine question d’un baiser.", "Vous fermez ses doigts autour de la montre, puis guidez l’autre main contre vous jusqu’à ce qu’il choisisse laquelle garder.", "Vous lui demandez ce qu’il ressent maintenant. Saidin abandonne trois métaphores avant de répondre simplement."),
      setup: ["Vous interrompez chaque début d’énigme par un geste concret. Saidin rit d’abord de votre méthode, puis perd volontairement le fil sous votre bouche.", ["{player}", "Pas demain. Ici."], ["Saidin", "Ici.", "surprised"]],
      deepening: ["Ses vêtements s’ouvrent tandis que son langage se simplifie. Saidin cesse d’observer son propre désir comme un phénomène et commence à vous le confier directement.", ["Saidin", "Ne me demandez pas ce que cela signifie. Pas encore.", "surprised"]],
      tender: ["Vous l’embrassez chaque fois que son regard s’éloigne vers une possibilité. Saidin revient toujours plus vite, jusqu’à n’avoir besoin que de votre main pour rester.", ["Saidin", "Vous rendez le présent très difficile à quitter.", "surprised"]],
      suggestive: ["Votre bouche suit la ligne de sa gorge et de son ventre. Saidin cesse enfin de prévoir le prochain contact ; chacun le surprend dans un souffle plus franc.", ["Saidin", "Continuez avant que mon esprit ne retrouve une issue.", "surprised"]],
      explicit: sexLines(
        ["Vous faites de ses réactions une suite sans oracle, votre bouche et vos mains le conduisant au plaisir jusqu’à ce qu’il perde toute question. Saidin jouit contre vous dans une seconde qu’aucune magie ne prolonge.", ["Saidin", "Je n’ai pas de question. C’est plus rare que vous ne l’imaginez.", "surprised"]],
        ["Vous prenez son sexe entre vos doigts puis votre bouche, maintenant Saidin dans son corps chaque fois que son regard menace de s’éloigner. Son orgasme interrompt définitivement la phrase qu’il cherchait.", ["Saidin", "Ne remontez pas le temps. Laissez-moi avoir vécu cela une seule fois.", "surprised"]],
        ["Vous lui faites nommer chaque sensation présente et adaptez vos gestes à cette vérité immédiate. Saidin atteint l’orgasme sans modèle futur, son corps devenant enfin la seule réponse nécessaire.", ["Saidin", "Je suis ici. Entièrement.", "surprised"]],
      ),
      ellipse: ["Votre main ferme sa montre pendant que la sienne vous attire plus près. Le récit s’interrompt avant qu’une nouvelle question apparaisse."],
      closing: ["Saidin ne rouvre aucune horloge. Il reste près de vous dans le désordre du lit, étonné qu’un instant puisse finir sans être perdu.", ["Saidin", "Je me souviens. Je n’avais pas besoin de le préserver davantage.", "surprised"]],
      after: sexText("Il embrasse votre épaule sans chercher le souvenir futur de ce geste.", "Sa paume demeure contre votre torse, ancrée dans sa chaleur présente.", "Il vous demande de choisir le premier geste du matin et attend réellement votre réponse."),
    },
    {
      id: "seconde-entiere",
      labels: sexText("Explorer ensemble une nuit qu’aucun de vous ne connaît", "Échanger l’initiative sans prévoir qui cédera d’abord", "Construire un présent où chaque corps garde sa propre temporalité"),
      detail: "Une route mutuelle où Saidin et vous refusez toute avance sur l’autre et découvrez chaque étape ensemble.",
      prelude: sexText("Vous retournez ensemble les sabliers, puis laissez le premier geste à celui ou celle qui cessera de sourire.", "Saidin vous demande qui cèdera d’abord ; vous lui interdisez de vérifier et l’embrassez.", "Vous accordez vos signaux sans exiger le même rythme. Saidin semble fasciné par cette chronologie à deux voix."),
      setup: ["Vos gestes se découvrent au même rythme. Les petites maladresses deviennent des rires partagés plutôt que des versions à corriger.", ["Saidin", "Nous inventons un souvenir que je n’ai jamais visité. J’aime cette idée.", "surprised"]],
      deepening: ["L’initiative circule avec vos respirations. Saidin s’étonne de votre audace, puis de la sienne, jusqu’à ce que toute distance philosophique disparaisse.", ["{player}", "À votre tour… peut-être."], ["Saidin", "Ne décidons pas trop vite.", "surprised"]],
      tender: ["Vous explorez la proximité sans destination obligatoire. Saidin pose son front contre le vôtre et laisse chaque seconde être complète avant la suivante.", ["Saidin", "Je ne savais pas que ne rien prévoir pouvait remplir autant de temps.", "surprised"]],
      suggestive: ["Vous changez d’initiative sous les draps, guidés par les souffles plutôt que les horloges. Chaque surprise rend Saidin plus présent et plus audacieux.", ["Saidin", "Encore ce mouvement. Non pour le répéter — pour le vivre autrement.", "surprised"]],
      explicit: sexLines(
        ["Vos mains et vos bouches alternent sans chercher quel plaisir doit venir d’abord. Saidin jouit sous vous, puis vous ramène entre ses bras et accompagne votre orgasme sans toucher au cours du temps.", ["Saidin", "Deux instants différents. Une seule nuit.", "surprised"]],
        ["Vos corps trouvent un rythme commun sans qu’aucun futur le garantisse. Saidin cède sous vos gestes puis reprend l’initiative, vous conduisant au plaisir dans le temps exact que votre corps réclame.", ["Saidin", "Chaque seconde entière. N’en volons aucune.", "surprised"]],
        ["Vous respectez vos rythmes distincts, échangeant gestes et indications jusqu’à ce que les plaisirs se rejoignent sans devoir être identiques. Saidin reste présent pendant chaque montée et chaque retour.", ["Saidin", "Nous n’avions pas besoin de la même chronologie pour nous trouver.", "surprised"]],
      ),
      ellipse: ["Les sabliers restent couchés tandis que vous rejoignez le lit. Le temps continue hors champ, libre de ne rien prouver."],
      closing: ["Au matin, Saidin retourne un sablier sans regret. Le sable reprend sa chute ordinaire pendant que vos mains restent liées.", ["Saidin", "Cette nuit est terminée. Elle n’est pas effacée.", "surprised"]],
      after: sexText("Il trace la première seconde du jour d’un baiser contre votre hanche.", "Il appuie son front contre votre épaule et laisse l’aube arriver sans la commenter.", "Il vous demande votre rythme pour la journée et accepte qu’il diffère du sien."),
    },
  ],

  bellirith: [
    {
      id: "sans-enchantement",
      labels: sexText("Laisser Bellirith vous séduire sans le secours d’aucun charme", "Lui confier votre désir lorsqu’elle ne peut pas en forcer l’écho", "Lui montrer les réactions qui n’appartiennent qu’à votre corps"),
      detail: "Bellirith mène sans magie et découvre que votre réponse libre l’atteint plus profondément que n’importe quel enchantement.",
      prelude: sexText("Bellirith retire son dernier bijou enchanté avant de laisser ses yeux s’attarder sur vous.", "Elle pose sa main sur votre torse, presque surprise que votre désir reste visible sans l’aide d’un sort.", "Vous lui expliquez ce que votre corps aime ; Bellirith écoute sans chercher l’incantation qui simplifierait la réponse."),
      setup: [["Bellirith", "Le charme est éteint. Si tu me désires encore, je n’aurai plus aucune excuse.", "thoughtful"], "Son premier baiser garde une élégance étudiée. Le second tremble légèrement, et cette imperfection vous rapproche davantage que tout son art."],
      deepening: ["Bellirith suit vos réactions avec une attention devenue vulnérable. Chaque plaisir librement offert efface un peu plus la peur qu’elle ne soit désirable qu’en contrôlant la scène.", ["Bellirith", "Encore ce frisson. Celui-là est vraiment à moi ?", "thoughtful"]],
      tender: ["Elle vous embrasse sans pose avantageuse, reste assez près pour sentir vos réponses et assez ouverte pour laisser les siennes apparaître.", ["Bellirith", "La tendresse ne me laisse aucun rôle. C’est terrifiant.", "thoughtful"]],
      suggestive: ["Son expérience devient une attention humaine sous vos vêtements. Bellirith sourit lorsque votre corps répond sans magie, mais son soulagement est plus visible que sa fierté.", ["Bellirith", "Ne me rassure pas avec des mots. Réponds-moi encore.", "seductive"]],
      explicit: sexLines(
        ["Bellirith descend entre vos cuisses et vous fait jouir avec sa bouche et ses doigts, portée seulement par l’attention qu’elle vous accorde. Lorsque votre plaisir cède, ses yeux brillent d’un soulagement qu’aucun sort n’a provoqué.", ["Bellirith", "C’était moi. Rien d’autre. J’avais besoin de l’entendre aussi fort.", "thoughtful"]],
        ["Elle prend votre désir entre ses mains, puis avec sa bouche, sans enchantement pour anticiper vos réactions. Bellirith apprend votre rythme et vous conduit à l’orgasme avec une fierté profondément personnelle.", ["Bellirith", "Ton corps vient de me choisir sans contrainte. Voilà un pouvoir qui m’impressionne.", "thoughtful"]],
        ["Bellirith suit vos indications et laisse votre corps réel déjouer tous ses scénarios. Sa bouche et ses mains trouvent votre plaisir sans charme, jusqu’à ce que votre abandon lui rende enfin sa propre confiance.", ["Bellirith", "Je préfère cette vérité à tous les désirs que j’aurais pu fabriquer.", "thoughtful"]],
      ),
      ellipse: ["Bellirith laisse ses bijoux hors de portée et vous rejoint dans l’ombre. La porte se ferme sur une séduction devenue entièrement ordinaire et entièrement vôtre."],
      closing: ["Elle reste près de vous sans chercher une pose séduisante. Ses doigts trouvent les vôtres sous le drap avec une simplicité presque timide.", ["Bellirith", "Continue à me désirer. Mais reste aussi lorsque je ne fais rien pour le mériter.", "thoughtful"]],
      after: sexText("Elle repose la tête contre votre poitrine et laisse son visage au repos.", "Elle dessine du doigt une ligne paresseuse sur votre épaule.", "Elle vous demande quels gestes étaient les vôtres et lesquels elle pourrait apprendre encore."),
    },
    {
      id: "charme-renverse",
      labels: sexText("Dépouiller sa mise en scène jusqu’à obtenir une femme désarmée", "Prendre le contrôle de la distance et faire céder son sourire", "Lui demander chaque vérité avant de lui offrir le geste"),
      detail: "Vous prenez l’initiative et renversez le spectacle sans humilier Bellirith ni nier son plaisir de séduire.",
      prelude: sexText("Vous retirez un bijou purement décoratif et attendez que Bellirith vous en offre un autre.", "Vous la faites reculer d’un pas, puis vous arrêtez juste avant le baiser qu’elle croyait certain.", "Vous lui demandez si le prochain sourire est une envie ou un réflexe. Bellirith répond en laissant enfin son visage se détendre."),
      setup: ["Vous effacez chaque réplique préparée sous un geste imprévisible. Bellirith tente de reprendre le jeu, puis se laisse surprendre avec un plaisir qu’elle ne peut plus maquiller.", ["Bellirith", "Cruel. Précis. Et beaucoup trop efficace.", "smirk"]],
      deepening: ["Vos mains découvrent la femme sous le spectacle sans lui demander d’abandonner son goût du jeu. Bellirith peut provoquer, mais chaque provocation doit désormais contenir une vérité.", ["Bellirith", "Je veux que tu continues. Voilà. Sans charme ni détour.", "thoughtful"]],
      tender: ["Vous embrassez son visage lorsque le sourire disparaît, ses mains lorsqu’elles tremblent et sa gorge lorsqu’elle cesse de parler. Bellirith reçoit la douceur sans la transformer en arme.", ["Bellirith", "Ne t’habitue pas à me voir aussi réelle.", "thoughtful"]],
      suggestive: ["Vous ouvrez sa chemise et faites de chaque partie de sa peau un endroit où sa maîtrise peut céder. Ses mots restent provocateurs ; son souffle vous livre une vérité plus directe.", ["Bellirith", "Plus bas. Puis je te prouverai que je reste dangereuse.", "seductive"]],
      explicit: sexLines(
        ["Votre bouche trouve son plaisir entre ses cuisses tandis que vos doigts prolongent le mouvement. Bellirith jouit sans mise en scène, agrippe vos cheveux et reste un instant incapable de reconstruire son sourire.", ["Bellirith", "Ne dis rien de séduisant. Je pourrais te croire.", "thoughtful"]],
        ["Vous la maintenez contre les draps avec une force mesurée et faites céder son corps sous vos mains et votre bouche. Son orgasme lui retire toute réplique ; Bellirith vous attire contre elle avant que son masque revienne.", ["Bellirith", "Reste là où je ne suis plus impressionnante.", "thoughtful"]],
        ["Vous lui faites formuler chaque désir sans jeu de rôle puis transformez ses mots en gestes. Bellirith atteint le plaisir dans une sincérité physique qui ne doit rien à son image ni à la forme de votre corps.", ["Bellirith", "Tu as trouvé la seule vérité que je ne savais pas embellir.", "thoughtful"]],
      ),
      ellipse: ["Vous retirez le dernier bijou et Bellirith vous attire hors du regard du récit, sans miroir ni lumière flatteuse pour répéter la scène."],
      closing: ["Son sourire revient, mais il n’est plus une défense parfaite. Bellirith vous laisse voir la fatigue heureuse qui le soutient.", ["Bellirith", "Tu pourras me désarmer encore. À condition de me laisser parfois gagner.", "smirk"]],
      after: sexText("Elle pose un baiser sans artifice sur votre ventre.", "Elle garde votre bras autour d’elle au lieu de choisir une pose flatteuse.", "Elle vous demande si vous avez vu le moment où elle a cessé de jouer, puis ne détourne pas les yeux."),
    },
    {
      id: "duel-sincere",
      labels: sexText("Faire de la séduction un duel où chaque riposte doit être sincère", "Renverser son jeu jusqu’à ne plus distinguer victoire et plaisir", "Changer d’initiative sans laisser aucun rôle devenir une prison"),
      detail: "Une route mutuelle et provocatrice où le duel demeure joueur parce que chaque renversement reste choisi.",
      prelude: sexText("Vous défiez Bellirith de vous surprendre sans magie ; elle accepte en défaisant très lentement un bouton.", "Bellirith vous annonce qu’elle gagnera avant que vous la renversiez contre les draps.", "Vous défiez Bellirith de soutenir votre regard pendant tout le duel. Elle le teste d’abord, puis son sourire vacille délicieusement."),
      setup: ["Vous échangez provocations, baisers et prises de distance. Bellirith rit lorsqu’une de vos caresses lui fait oublier la réplique qu’elle préparait.", ["Bellirith", "Tu deviens dangereusement compétent·e.", "smirk"]],
      deepening: ["Le duel perd ses faux-semblants à mesure que les vêtements rejoignent les bijoux. Chaque renversement dévoile une réaction qu’aucun miroir enchanté n’aurait su répéter.", ["{player}", "Tu préfères gagner ou perdre ?"], ["Bellirith", "Je refuse désormais de choisir.", "seductive"]],
      tender: ["Vos ripostes deviennent des étreintes et vos provocations des aveux minuscules. Bellirith accepte une égalité qui n’a pas besoin de vainqueur pour rester excitante.", ["Bellirith", "Une trêve. Très courte. Reste près.", "thoughtful"]],
      suggestive: ["Vous changez d’avantage au rythme des soupirs. Bellirith vous renverse, vous reprenez l’initiative et chaque retour devient plus audacieux que le précédent.", ["Bellirith", "Encore. Je n’ai pas décidé quelle défaite je préfère.", "seductive"]],
      explicit: sexLines(
        ["Le duel devient un échange de plaisirs donnés et repris. Bellirith jouit sous votre bouche, puis vous renverse et s’attarde entre vos cuisses jusqu’à effacer toute idée de vainqueur.", ["Bellirith", "Match nul. Terriblement satisfaisant.", "smirk"]],
        ["Vos mains et vos corps changent de conduite dans une lutte entièrement choisie. Bellirith cède sous vos gestes avant de reprendre votre plaisir avec la même ardeur, jusqu’à vos orgasmes successifs.", ["Bellirith", "Je réclame une revanche dès que nous pourrons tenir debout.", "seductive"]],
        ["Le mot convenu fait circuler l’initiative sans jamais fixer vos rôles. Vous vous guidez mutuellement à travers vos corps réels jusqu’à ce que les plaisirs se répondent et abolissent le score.", ["Bellirith", "Aucun sort n’aurait produit un désordre aussi juste.", "thoughtful"]],
      ),
      ellipse: ["Bellirith fait une révérence provocante avant de vous entraîner derrière le rideau. Le récit abandonne le duel au moment où vos rires deviennent trop proches."],
      closing: ["Vous vous retrouvez enlacé·es au milieu des bijoux éparpillés. Bellirith cherche le score, puis décide de perdre la feuille.", ["Bellirith", "Nous étions magnifiques. Surtout quand personne ne regardait.", "thoughtful"]],
      after: sexText("Elle trace une ligne de défi sur votre hanche et la termine par un baiser.", "Elle repose contre votre épaule sans chercher à reprendre l’avantage.", "Elle vous demande quelle règle conserver la prochaine fois et accepte votre réponse sans la détourner."),
    },
  ],

  amanea: [
    {
      id: "reine-tendre",
      labels: sexText("Laisser Amanea vous offrir la tendresse que son royaume ignore", "Lui confier votre abandon sans en faire une soumission", "Lui apprendre votre corps hors de toute alliance ou lignée"),
      detail: "Amanea mène avec intensité, mais sa puissance devient une tendresse privée plutôt qu’un ordre.",
      prelude: sexText("Amanea retire sa couronne avant de laisser son regard s’attarder sur votre corps comme sur quelque chose qui ne relève d’aucun royaume.", "Sa main ferme se pose contre votre torse ; elle attend pourtant votre mouvement avant de vous attirer.", "Vous lui donnez vos mots et vos limites. Amanea les reçoit comme une confiance, pas comme les clauses d’un traité."),
      setup: [["Amanea", "Je pourrais ordonner mille choses. Ce soir, je veux seulement entendre ce que tu choisis.", "smile"], "Sa force vous enveloppe sans se refermer. Chaque geste intense s’interrompt assez longtemps pour laisser votre réponse devenir la seule autorité."],
      deepening: ["Amanea parle peu, mais ses paumes, son souffle et la façon dont elle protège votre nuque rendent son désir lisible. Votre confiance fait apparaître une douceur que sa cour ne connaîtra jamais.", ["Amanea", "Reste. Le royaume survivra à cette demande.", "smile"]],
      tender: ["Elle vous couvre de sa cape et de baisers lents, gardant votre corps contre sa chaleur comme un refuge qui ne réclame aucun serment.", ["Amanea", "Ici, je ne garde rien d’autre que toi.", "smile"]],
      suggestive: ["Ses mains ouvrent vos vêtements tandis que sa bouche découvre votre gorge et votre poitrine. Amanea ne bavarde pas ; son désir passe dans chaque souffle plus grave lorsque vous répondez.", ["Amanea", "Je veux te voir céder. Pas par devoir. Pour moi.", "smile"]],
      explicit: sexLines(
        ["Amanea descend entre vos cuisses et maintient votre plaisir avec une intensité précise. Sa bouche et ses doigts vous conduisent jusqu’à l’orgasme, puis elle remonte vous embrasser avec une douceur que son peuple ne verrait jamais.", ["Amanea", "Aucun ordre n’aurait valu ce que tu viens de me donner librement.", "smile"]],
        ["Elle referme sa main autour de votre désir puis vous prend dans sa bouche, sa puissance entièrement tournée vers votre plaisir. Amanea vous garde contre elle lorsque l’orgasme vous traverse, comme un secret choisi.", ["Amanea", "Tu peux t’abandonner sans t’agenouiller. Je le veux ainsi.", "smile"]],
        ["Amanea suit les gestes que vous lui montrez et adapte sa force à votre corps réel. Sa bouche et ses mains vous conduisent au plaisir sans titre, sans lignée et sans modèle imposé.", ["Amanea", "Ton corps ne représente personne. Il est à toi — et tu me l’as confié.", "smile"]],
      ),
      ellipse: ["Amanea vous enveloppe dans sa cape noire et abaisse les flammes. La porte se referme sur une nuit qui n’appartient à aucun royaume."],
      closing: ["Elle repose près de vous, votre main emprisonnée contre son cœur. Au-dehors, Akuhn’Nabad continue sans réclamer sa présence.", ["Amanea", "La cité s’est passée de moi. Moi, je suis heureuse de ne pas m’être passée de toi.", "smile"]],
      after: sexText("Elle garde votre hanche contre la sienne sous la cape.", "Sa main repose sur votre torse comme une chaleur sombre et paisible.", "Elle reprend les mots de désir que vous aviez échangés, fière de les avoir transformés en confiance."),
    },
    {
      id: "couronne-loin",
      labels: sexText("Éloigner la couronne et prendre soin de la femme épuisée", "Lui offrir un appui qu’elle ne peut transformer en commandement", "Lui rendre le droit de recevoir à chaque nouvelle étape"),
      detail: "Vous prenez l’initiative et permettez à Amanea de déposer sa puissance sans la nier.",
      prelude: sexText("Vous faites glisser sa couronne au bout de la table, puis prenez doucement sa place dans tout son regard.", "Vous l’aidez à retirer sa cape avant de lui demander de vous confier son poids, pas son royaume.", "Vous laissez chaque geste répondre au mouvement de son corps. Amanea comprend peu à peu que recevoir ne l’oblige à rien céder d’autre."),
      setup: ["Amanea résiste moins à vos mains qu’au simple fait de n’avoir aucune responsabilité dans ce qui vient. Vous l’allongez sans la diminuer et elle vous laisse approcher les fatigues que l’armure dissimule.", ["{player}", "Tu n’as rien à gouverner ici."], ["Amanea", "Alors gouverne seulement ta propre envie.", "rictus"]],
      deepening: ["Vous embrassez les anciennes marques, les épaules tendues et les silences qu’elle ne confie à personne. Amanea vous donne son poids par fragments jusqu’à ne plus se retenir.", ["Amanea", "Ne t’arrête pas lorsque je me tais. Ce silence-ci veut sentir.", "smile"]],
      tender: ["Vous l’entourez sans chercher à contenir sa puissance. Amanea découvre le luxe d’être portée un instant sans devenir faible ni redevable.", ["Amanea", "Je croyais que le repos ressemblait à une absence. Pas à cela.", "smile"]],
      suggestive: ["Sa cape s’ouvre sous vos mains. Vous suivez la chaleur de sa peau jusqu’à ce que sa respiration devienne moins régulière et que ses doigts s’accrochent simplement à vous.", ["Amanea", "Plus bas. Et reste quand je ne saurai plus le demander.", "smile"]],
      explicit: sexLines(
        ["Vous conduisez Amanea au plaisir entre vos mains et votre bouche. Son orgasme reste grave mais libre, toute la force de la Reine Noire réduite un instant à la main qui serre la vôtre.", ["Amanea", "Encore… avant que quelqu’un se souvienne que je gouverne.", "rictus"]],
        ["Votre force devient un soutien plutôt qu’un défi tandis que votre bouche fait céder son corps. Amanea jouit sans commander la sensation, puis vous ramène contre elle avec une reconnaissance presque farouche.", ["Amanea", "Tu m’as portée sans tenter de me posséder.", "smile"]],
        ["Vous lui faites nommer chaque geste qu’elle veut recevoir, puis adaptez vos mains et votre bouche à ses réponses réelles. Amanea s’abandonne au plaisir sans qu’aucun rôle ne décide à sa place.", ["Amanea", "Je reçois parce que je le choisis. Continue.", "smile"]],
      ),
      ellipse: ["La couronne demeure sur la table lorsque vous ouvrez sa cape. La chronique quitte la chambre avant que la reine puisse revenir."],
      closing: ["Amanea ne reprend ni sa cape ni sa hauteur. Elle reste allongée, votre main sous la sienne et le royaume suffisamment loin.", ["Amanea", "Tu as gardé Amanea. La reine attendra encore un peu.", "smile"]],
      after: sexText("Elle dépose un baiser reconnaissant contre votre ventre.", "Elle repose son front contre votre épaule sans dissimuler sa fatigue.", "Elle vous demande ce que vous avez choisi de lui donner et ce que vous avez choisi de garder."),
    },
    {
      id: "egalite-nocturne",
      labels: sexText("Mêler vos forces sans couronne, victoire ni soumission", "Faire de votre puissance un dialogue plutôt qu’un affrontement", "Changer d’initiative sans laisser aucune identité disparaître"),
      detail: "Une route mutuelle où Amanea découvre qu’une égalité intime peut préserver deux êtres entiers.",
      prelude: sexText("Vous posez votre main sur la couronne en même temps qu’Amanea ; ensemble, vous la laissez sur la table.", "Amanea éprouve votre force d’un sourire avant que vous transformiez le défi en étreinte.", "Vous définissez clairement comment l’initiative peut changer. Amanea approuve cette égalité avec le sérieux d’un traité qu’elle désire enfin signer."),
      setup: ["Vous alternez l’étreinte et le renversement, chacun·e offrant à l’autre un endroit où relâcher sa force. Amanea goûte cette égalité sans chercher à la dominer.", ["Amanea", "Proches sans fusionner. Voilà un accord que je peux accepter.", "smile"]],
      deepening: ["Vos vêtements tombent sans cérémonie. Tantôt Amanea vous attire avec sa force de guerrière, tantôt elle vous laisse reprendre la conduite et sourit de ne rien perdre dans ce changement.", ["{player}", "À moi."], ["Amanea", "Montre-moi. Puis rends-moi la parole.", "rictus"]],
      tender: ["Vous vous tenez avec la même attention, chacun·e entier·e dans l’étreinte. Amanea découvre une proximité qui ne réclame ni héritage ni absorption.", ["Amanea", "Deux forces peuvent se reposer sans se vaincre.", "smile"]],
      suggestive: ["Les changements d’initiative deviennent plus intenses. Amanea vous renverse, vous la ramenez contre les draps et vos désirs se répondent sans ordre permanent.", ["Amanea", "À ton tour. Ne demande pas comme à une reine.", "rictus"]],
      explicit: sexLines(
        ["Vous échangez le plaisir jusqu’à ce que la reine et l’étrangère du portail ne définissent plus rien. Amanea jouit sous votre bouche, puis vous ramène entre ses mains et ses lèvres jusqu’à votre propre orgasme.", ["Amanea", "Égales dans le choix. Entières dans le plaisir.", "smile"]],
        ["Vos forces s’accordent sans lutte, vos corps changeant de conduite au rythme de vos souffles. Amanea cède sous vos gestes puis vous accueille contre elle et vous conduit à l’abandon avec la même intensité.", ["Amanea", "Ni victoire ni reddition. Seulement nous.", "smile"]],
        ["Vous échangez les gestes et les indications sans fixer les rôles. Le plaisir d’Amanea répond au vôtre, chacun·e gardant son identité et son rythme jusqu’à un abandon partagé.", ["Amanea", "Une égalité qui ne dissout personne. Je veux la connaître encore.", "smile"]],
      ),
      ellipse: ["Vous laissez la couronne, les titres et la lumière au bord du lit. La chronique se retire tandis que vos forces trouvent leur propre équilibre."],
      closing: ["Au matin, la couronne est toujours loin. Amanea ne la regarde qu’après avoir vérifié que votre main demeure dans la sienne.", ["Amanea", "Le royaume peut me reprendre. Il ne reprendra pas cette nuit.", "smile"]],
      after: sexText("Elle enlace votre taille sous sa cape, sans trône entre vous.", "Elle garde votre paume contre son cœur comme une force égale à la sienne.", "Elle vous demande quel prochain désir pourrait rester entièrement à vous deux."),
    },
  ],
  tia: [
    {
      id: "mesure-privee",
      labels: sexText("Laisser Tia conduire une mesure écrite seulement pour votre corps", "Lui confier le premier rythme loin de toute audience", "Définir avec Tia une conduite adaptée à votre corps réel"),
      detail: "Tia mène une première exploration où sa discipline devient écoute, sans transformer votre abandon en obéissance.",
      prelude: sexText("Tia retire lentement ses gants et observe vos courbes sans chercher une posture à corriger.", "Tia pose sa couronne loin de votre torse et attend que votre main vienne prendre la sienne.", "Vous nommez les gestes qui correspondent à votre corps ; Tia les retient sans compléter vos phrases."),
      setup: [["Tia", "Je guiderai le premier mouvement. Vous conserverez le droit de le modifier, de le renverser ou de l’arrêter sans justification.", "stern"], "La formulation ressemble encore à une règle, mais le baiser qui suit est trop personnel pour appartenir au protocole. Tia vous installe contre les oreillers et laisse votre désir décider de la distance."],
      deepening: ["Ses lèvres quittent votre bouche pour votre gorge, puis sa main suit le chemin que votre souffle rend plus pressant. Elle recommence exactement le geste qui vous attire contre elle au lieu d’en inventer un plus spectaculaire.", ["Tia", "Votre réponse suffit. Je n’ai pas besoin qu’elle soit élégante.", "troubled"]],
      tender: ["Tia alterne baisers, paumes ouvertes et longues étreintes. Chaque fois qu’un ancien réflexe raidit ses épaules, vous l’invitez à revenir au présent ; elle accepte cette douceur comme une décision, jamais comme une concession."],
      suggestive: ["Les attaches d’or rejoignent la couronne. Tia suit votre peau découverte avec une précision devenue brûlante, garde une main liée à la vôtre et laisse l’autre chercher la réaction qui vous fait prononcer son prénom sans titre."],
      explicit: sexLines(
        ["Tia s’agenouille entre vos cuisses et fait de sa bouche puis de ses doigts une cadence entièrement réglée par vos hanches. Elle maintient la pression sur votre point de feu jusqu’à ce que votre plaisir défasse toute retenue.", ["Tia", "Ne rendez pas votre voix plus digne pour moi. Laissez-la me dire la vérité.", "troubled"]],
        ["Tia prend votre désir dans sa main, apprend la tension qui annonce chaque mouvement puis la prolonge avec sa bouche. Elle garde la cadence demandée jusqu’à votre orgasme, attentive et profondément troublée par votre confiance.", ["Tia", "Je conduis parce que vous me l’avez confié. Rien d’autre ne m’accorde ce droit.", "troubled"]],
        ["Tia suit les indications propres à votre anatomie avec sa bouche, ses doigts et la chaleur de ses paumes. Aucun modèle ne remplace vos mots ; elle vous conduit au plaisir en gardant chaque variation visible et choisie.", ["Tia", "Votre corps n’est soumis à aucune doctrine. Apprenez-moi seulement son langage.", "troubled"]],
      ),
      ellipse: ["Tia éteint elle-même les lumières officielles et laisse une seule bougie près du lit. Sa main retrouve la vôtre au moment où la chronique abandonne la chambre à la mesure que vous inventez."],
      closing: ["La couronne demeure sur une chaise. Tia revient contre vous avant de la regarder, suffisamment paisible pour admettre que la fonction peut attendre derrière une porte fermée.", ["Tia", "Cette nuit ne corrigera aucun royaume. C’est précisément pourquoi je souhaite la garder.", "troubled"]],
      after: sexText("Elle dessine du pouce une ligne lente au creux de votre ventre.", "Elle repose contre votre épaule sans chercher à reprendre sa hauteur.", "Elle vous demande quel geste propre à votre corps vous voudriez lui confier une prochaine fois."),
    },
    {
      id: "couronne-deposee",
      labels: sexText("Déposer la souveraine et faire recevoir la femme sans la réduire", "Prendre l’initiative jusqu’à faire céder sa voix officielle", "Offrir à Tia un plaisir sans fonction anatomique présumée"),
      detail: "Vous menez Tia hors de son contrôle habituel et lui rendez le droit de recevoir sans devoir gouverner la suite.",
      prelude: sexText("Vous détachez son manteau blanc avant de lui demander où elle veut sentir votre première main.", "Vous faites reculer Tia jusqu’au lit et attendez qu’elle choisisse elle-même de s’y allonger.", "Vous lui refusez tout rôle préparé : elle devra demander selon son envie présente et votre corps réel."),
      setup: ["Tia commence par organiser les coussins, le verrou et la distance de la bougie. Vous interrompez doucement cette dernière procédure en embrassant sa paume nue.", ["{player}", "Vous pouvez préparer une limite. Vous n’avez pas besoin de préparer chaque sensation."], ["Tia", "Distinction reçue. Continuez.", "troubled"]],
      deepening: ["Vous ouvrez son armure de cérémonie sans traiter sa puissance comme un déguisement. Tia guide votre main une fois, puis accepte qu’une réaction imprévue devienne plus importante que la position qu’elle avait imaginée.", ["Tia", "Là. Gardez ce mouvement. Je vous le demande — je ne vous l’ordonne pas.", "shy"]],
      tender: ["Vous prenez soin des épaules, des mains et du visage que la cour ne voit jamais au repos. Tia reçoit chaque baiser sans le convertir en récompense et finit par vous attirer simplement parce qu’elle désire davantage de proximité."],
      suggestive: ["Votre bouche descend le long de la peau libérée des mailles d’or. Tia vous indique une pression plus ferme, puis perd le fil de sa phrase lorsque vous obéissez seulement à cette demande privée."],
      explicit: sexLines(
        ["Vous écartez ses cuisses et gardez votre bouche sur sa perle sensible pendant que vos doigts suivent le rythme choisi. Tia tente une phrase complète, échoue et vous ramène contre elle jusqu’à ce que l’orgasme rompe enfin sa maîtrise.", ["Tia", "Je veux que vous continuiez. Ma voix a simplement perdu sa syntaxe.", "shy"]],
        ["Vous préparez longuement Tia puis la laissez régler elle-même l’angle, la profondeur et la cadence de la rencontre. Son corps choisit avec une franchise que son visage officiel ne pourrait soutenir ; votre constance la conduit à l’abandon.", ["Tia", "Je reçois ceci parce que je le veux. Gardez cette vérité au centre.", "shy"]],
        ["Vous demandez à Tia quelle combinaison de bouche, de mains, de frottement ou de pénétration convient à vos deux corps. Elle répond sans doctrine, guide le premier mouvement et vous confie ensuite le rythme qui la fait céder.", ["Tia", "Aucune règle universelle. Seulement cette demande, maintenant.", "shy"]],
      ),
      ellipse: ["Vous laissez cape et couronne dans la pièce voisine. Tia referme la porte sans sceau ni garde, puis la chronique se retire avant que la femme n’ait à redevenir souveraine."],
      closing: ["Elle garde la tête contre votre poitrine et ne rédige aucun bilan de la nuit. Lorsque vous lui demandez ce qu’elle retient, Tia choisit un seul mot : encore.", ["Tia", "Je formulerai mieux demain. Ce soir, ce mot suffit.", "shy"]],
      after: sexText("Elle accepte votre main au creux de sa taille sans redresser sa posture.", "Elle garde votre souffle sous sa joue comme un rythme sans protocole.", "Elle vous demande ce qu’elle peut recevoir encore sans prétendre que vos corps attendent la même chose."),
    },
    {
      id: "danse-sans-rang",
      labels: sexText("Changer la danse en relais entre deux femmes sans rang", "Renverser chaque conduite jusqu’à perdre la notion du titre", "Faire circuler l’initiative sans assigner de rôle à aucun corps"),
      detail: "Une route mutuelle où Tia expérimente l’égalité comme une circulation concrète de désir et de vulnérabilité.",
      prelude: sexText("Tia tend la main comme dans une salle de bal, mais vous la faites tourner jusqu’au bord du lit.", "Vous acceptez sa première mesure avant de prendre la seconde sans consulter son titre.", "Vous convenez d’un signe pour échanger la conduite ; Tia le répète jusqu’à ce qu’il cesse de ressembler à une procédure."),
      setup: ["La danse commence debout, continue contre le mur puis rejoint les draps. À chaque changement, la personne qui conduit vérifie que l’autre avance réellement au lieu de se laisser déplacer.", ["Tia", "Je découvre qu’un renversement peut être exact sans avoir été prévu.", "smirk"]],
      deepening: ["Vos vêtements quittent la chorégraphie un à un. Tia mène avec assurance, cède sur votre signe et reprend ensuite l’initiative dans un rire rare lorsque vous sabotez volontairement la symétrie.", ["{player}", "Aucune cour n’approuverait ce pas."], ["Tia", "La cour n’est pas invitée.", "smirk"]],
      tender: ["Les rotations deviennent des étreintes. Vous vous offrez tour à tour un endroit où relâcher le poids, et Tia découvre qu’une proximité partagée ne menace ni son identité ni la vôtre."],
      suggestive: ["Chaque changement de conduite rapproche vos hanches et rend vos mains plus directes. Le signe convenu devient presque inutile : vos corps demandent clairement qui souhaite mener la reprise suivante."],
      explicit: sexLines(
        ["Vous échangez bouche, doigts et frottements sans fixer laquelle doit recevoir en premier. Tia jouit sous votre rythme, puis vous renverse lorsque vos bras l’y attirent et maintient votre point incandescent jusqu’à votre propre abandon.", ["Tia", "Deux plaisirs entiers. Aucun n’a servi de mesure à l’autre.", "smirk"]],
        ["Tia règle une première position face à face, puis vous lui demandez le renversement qui vous permet de conduire la seconde. Les profondeurs et les rythmes changent avec vos voix jusqu’à deux orgasmes successifs sans victoire attribuée.", ["Tia", "Je refuse de compter. Recommencez pourtant ce mouvement.", "smirk"]],
        ["Vous définissez à chaque reprise la personne qui reçoit, celle qui pénètre ou stimule et le geste adapté à son corps. Tia abandonne toute symétrie obligatoire ; vos plaisirs circulent avec la même attention et des formes librement différentes.", ["Tia", "L’égalité exige donc moins de ressemblance et davantage d’écoute. Je retiendrai cela.", "smirk"]],
      ),
      ellipse: ["La dernière bougie projette deux silhouettes qui échangent sans cesse leur position. Tia efface leur rang d’un geste et la chronique abandonne la danse au moment où sa respiration perd toute mesure officielle."],
      closing: ["Vous restez enlacé·es au milieu des vêtements et des règles oubliées. Tia retrouve le petit signe d’échange dans votre paume, puis le remplace par un baiser.", ["Tia", "Cette fois, je ne vous rends pas la conduite. Je vous demande seulement de rester.", "troubled"]],
      after: sexText("Elle garde vos jambes entremêlées sans chercher laquelle surplombe l’autre.", "Elle pose votre main et la sienne côte à côte sur les draps défaits.", "Elle nomme une envie nouvelle sans la déduire de la forme de votre corps."),
    },
  ],
  allenna: [
    {
      id: "mains-sans-gantelets",
      labels: sexText("Confier votre plaisir aux mains nues d’Allenna", "Laisser Allenna transformer sa précision en désir", "Guider ses mains sans laisser une anatomie supposée décider"),
      detail: "Allenna mène avec la précision de ses mains nues, mais laisse la commandante et la soigneuse hors de votre lit.",
      prelude: sexText("Allenna retire ses gantelets et pose ses doigts nus sur votre hanche avec une prudence qui ne masque plus son envie.", "Allenna suit votre torse du regard avant de demander où vous voulez sentir sa première main.", "Vous placez sa paume là où votre corps souhaite commencer ; Allenna retient ce geste plutôt qu’un modèle."),
      setup: [["Allenna", "Je connais les corps blessés, les corps épuisés et les corps qu’il faut maintenir en vie. Le tien n’est aucune de ces missions. Dis-moi ce qui lui plaît.", "troubled"], "Elle attend votre réponse avant de vous allonger, puis son baiser fait disparaître la dernière distance professionnelle qu’elle avait tenté de conserver."],
      deepening: ["Ses mains explorent avec méthode, mais la méthode change chaque fois que votre souffle ou vos hanches contredisent son hypothèse. Allenna sourit lorsqu’elle trouve enfin un geste qu’aucun manuel n’aurait pu lui apprendre.", ["Allenna", "Celui-ci. Ton corps vient de le classer prioritaire.", "smirk"]],
      tender: ["Elle alterne caresses lentes, baisers et contacts de front. Sa force ne sert qu’à vous rapprocher lorsque vous le demandez, puis Allenna accepte que la tendresse puisse être une action complète sans résultat à produire."],
      suggestive: ["Ses doigts descendent sous vos vêtements pendant que sa bouche garde votre souffle occupé. La précision demeure, mais le tremblement de sa propre main révèle que la scène l’engage bien au-delà de toute compétence."],
      explicit: sexLines(
        ["Allenna s’installe entre vos cuisses, maintient la pression choisie autour de votre perle de plaisir et ajoute ses doigts seulement lorsque vous la ramenez plus près. Elle garde cette cadence jusqu’à votre orgasme.", ["Allenna", "Je ne change rien. Ton corps a été parfaitement clair.", "smirk"]],
        ["Allenna referme sa main sur votre membre dressé, apprend votre rythme puis vous prend dans sa bouche avec une attention qui devient bientôt gourmande. Elle conserve le mouvement réclamé jusqu’à votre abandon.", ["Allenna", "Pas un patient. Pas un ordre. Seulement toi, ici, en train de me faire confiance.", "smirk"]],
        ["Allenna suit le point de plaisir, la profondeur et le type de contact que vous lui avez indiqués. Sa bouche et ses mains s’accordent à votre corps réel jusqu’à ce que votre orgasme rompe enfin sa concentration.", ["Allenna", "Je peux apprendre sans te réduire à ce que je connais déjà.", "smirk"]],
      ),
      ellipse: ["Allenna pose les gantelets sur la poignée afin que personne n’entre sans les faire tomber. Puis elle vous rejoint hors du récit, les mains nues et toute son attention rendue au présent."],
      closing: ["Elle examine votre confort, accepte que vous fassiez de même pour elle et reste contre vous lorsque plus aucune vérification n’est nécessaire.", ["Allenna", "Je pourrais apprendre à ne pas appeler cela une faiblesse. Avec de la pratique.", "troubled"]],
      after: sexText("Elle garde une paume nue sur votre ventre jusqu’au retour du calme.", "Elle suit votre pouls du bout des doigts sans le compter.", "Elle vous demande quels mots employer la prochaine fois pour que votre corps ne soit jamais supposé."),
    },
    {
      id: "relève-accordee",
      labels: sexText("Faire déposer à Allenna toute responsabilité avant de la toucher", "Prendre la relève et lui apprendre à recevoir sans surveiller", "Construire un plaisir qu’Allenna n’a pas à maintenir seule"),
      detail: "Vous prenez l’initiative et offrez à Allenna une relève réelle où recevoir ne signifie ni échouer ni perdre le contrôle.",
      prelude: sexText("Vous retirez son rapport de ses genoux et lui demandez une envie qui ne protégera personne d’autre.", "Vous posez son épée hors de portée, puis attendez qu’Allenna choisisse de fermer elle-même la porte.", "Vous lui demandez quel rôle elle ne veut surtout pas recevoir ; sa réponse devient la première limite de la nuit."),
      setup: ["Allenna vérifie encore la fenêtre, la trousse de soins et la position de sa lame. Vous ne vous moquez pas ; vous attendez qu’elle revienne volontairement vers le lit et vous offre tout son poids.", ["{player}", "La relève commence quand tu la choisis."], ["Allenna", "Je la choisis. Maintenant.", "troubled"]],
      deepening: ["Vous embrassez ses cicatrices sans raconter leur histoire à sa place. Allenna guide votre main vers la chaleur plutôt que vers les anciennes douleurs, puis cesse enfin de préparer le geste qu’elle devra vous rendre.", ["Allenna", "Continue. Je ne planifie pas la suite. C’est inconfortable… et très agréable.", "shy"]],
      tender: ["Vous la maintenez sans l’immobiliser et lui rendez chaque fois la possibilité de se relever. Allenna reste pourtant sous vos baisers, choisissant une douceur qui ne répare rien et n’a donc pas besoin de réussir."],
      suggestive: ["Votre bouche et vos mains descendent plus bas pendant que ses doigts s’ouvrent sur les draps. Allenna formule une demande ferme, puis une seconde plus vulnérable, et reçoit les deux sans préparer de contrepartie."],
      explicit: sexLines(
        ["Votre bouche trouve la chaleur intime d’Allenna pendant que vos doigts prolongent chaque pression. Elle demande davantage sans reprendre la conduite, puis jouit en agrippant votre main libre au lieu de ses gantelets.", ["Allenna", "Je reçois. Rien ne s’effondre. Ne change surtout pas ce rythme.", "shy"]],
        ["Vous préparez Allenna avec patience, suivez l’angle qu’elle choisit et gardez une main sur son point de feu pendant le mouvement. Elle accepte la profondeur puis la cadence qui la conduisent à l’orgasme sans transformer la scène en endurance.", ["Allenna", "Assez ferme. Toujours libre. Continue.", "shy"]],
        ["Vous demandez quelle stimulation, quel frottement ou quelle pénétration Allenna souhaite recevoir, puis adaptez chaque position à vos corps présents. Elle guide une fois et vous confie ensuite la continuité jusqu’à son plaisir.", ["Allenna", "Tu tiens la relève. Je peux enfin cesser de surveiller.", "shy"]],
      ),
      ellipse: ["La trousse et l’épée restent fermées. Allenna vous entraîne vers la chambre, puis la chronique laisse la porte devenir la seule limite qu’elle ait encore besoin de garder."],
      closing: ["Elle reste allongée longtemps après avoir retrouvé ses forces. Lorsque vous lui proposez de reprendre ses gantelets, Allenna choisit plutôt votre main.", ["Allenna", "Cinq minutes supplémentaires. Cet ordre s’adresse uniquement à moi.", "shy"]],
      after: sexText("Elle accepte votre tête contre son ventre sans vérifier la sortie.", "Elle laisse votre bras supporter une partie de son poids.", "Elle vous décrit ce qu’elle a reçu sans comparer votre anatomie à aucune autre."),
    },
    {
      id: "entrainement-renverse",
      labels: sexText("Changer chaque prise d’Allenna en relais de plaisir", "Faire circuler la force sans vainqueur ni captif", "Alterner positions et rôles selon les possibilités de vos deux corps"),
      detail: "Une route mutuelle et physique où la force devient soutien, échange et jeu plutôt qu’épreuve à gagner.",
      prelude: sexText("Allenna propose un exercice de maintien ; vous le transformez en une étreinte au moment exact où elle croit avoir gagné.", "Vous testez sa garde, cédez volontairement puis la renversez seulement après son sourire d’accord.", "Vous définissez un signe de relève avant de chercher quelles positions conviennent réellement à vos deux corps."),
      setup: ["Le premier changement a lieu debout, le second sur le tapis et le troisième au bord du lit. Allenna protège chaque appui sans ralentir le désir, surprise de pouvoir employer toute sa force sans transformer l’autre en adversaire.", ["Allenna", "Aucun vainqueur. Mais je compte encore les renversements par habitude.", "smirk"]],
      deepening: ["Vous échangez conduite et soutien au rythme de vos souffles. Lorsque les vêtements gênent, Allenna les retire sans détour ; lorsque son ancienne blessure tire, vous adaptez ensemble l’angle sans traiter cette limite comme une défaite.", ["{player}", "Relève."], ["Allenna", "Reçue. À mon tour de te porter.", "smirk"]],
      tender: ["La force se transforme en étreintes capables de soutenir tout le poids. Vous vous offrez tour à tour une place où céder, et Allenna découvre qu’un relais calme peut être aussi intime qu’un mouvement spectaculaire."],
      suggestive: ["Chaque renversement ouvre une nouvelle partie de peau et rapproche vos bassins. Les mains qui sécurisaient un appui deviennent caresses, puis reviennent au soutien dès que l’intensité exige une position plus stable."],
      explicit: sexLines(
        ["Allenna reçoit votre bouche et vos doigts, puis vous fait rouler lorsque vos bras l’invitent à prendre soin de votre propre point de plaisir. Vous échangez encore jusqu’à deux orgasmes accompagnés sans course ni simultanéité forcée.", ["Allenna", "Relève complète. Je refuse pourtant que la séance soit terminée.", "smirk"]],
        ["Vous choisissez à chaque position qui donne, qui reçoit et quelle profondeur reste confortable. Allenna conduit une première cadence, vous la seconde ; vos orgasmes successifs arrivent sous le même soutien attentif.", ["Allenna", "La force n’a rien décidé. Nous, oui.", "smirk"]],
        ["Vous alternez bouche, mains, frottements et pénétration selon vos deux anatomies, sans exiger de symétrie. Allenna soutient votre plaisir puis vous confie le sien ; chaque reprise respecte des besoins différents avec la même intensité.", ["Allenna", "Deux corps, deux stratégies, aucune hiérarchie. Voilà une méthode que je conserverai.", "smirk"]],
      ),
      ellipse: ["Allenna vous soulève juste assez pour franchir la chambre, puis accepte d’être portée à son tour sur les derniers pas. Le récit se retire devant cette relève qui continue derrière la porte."],
      closing: ["Les gantelets restent parmi les vêtements. Allenna compte encore deux renversements, oublie le troisième et décide que cette imprécision mérite d’être protégée.", ["Allenna", "La prochaine fois, nous commencerons par le tapis. Après repos, eau et une nuit complète. Dans cet ordre.", "smirk"]],
      after: sexText("Elle masse votre hanche avant de vous laisser masser la sienne.", "Elle garde vos épaules au même niveau sous la couverture.", "Elle note uniquement les limites utiles, jamais une forme attendue pour votre corps."),
    },
  ],
  draven: [
    {
      id: "amiral-sans-ordre",
      labels: sexText("Laisser Draven guider votre plaisir sans vous commander", "Confier votre rythme à sa force attentive", "Lui apprendre votre corps sans modèle ni grade"),
      detail: "Draven mène avec une franchise bourrue, mais chaque geste reste une question et chaque intensité une réponse à votre désir.",
      prelude: sexText("Draven contemple votre corps avec un désir qu’il ne déguise ni en protection ni en galanterie.", "Il pose une main sur votre torse et attend que vous la guidiez avant de réduire la distance.", "Vous indiquez à Draven où commencer ; il retient votre réponse plutôt qu’une hypothèse sur votre anatomie."),
      setup: [["Draven", "Je sais conduire un navire dans une tempête. Vous, je refuse de vous piloter. Dites-moi où vous voulez mes mains.", "gruff"], "Il attend réellement. Lorsque vous le rapprochez, sa force devient un appui chaud et précis, jamais une manière de vous empêcher de changer d’avis."],
      deepening: ["Draven embrasse chaque réaction au lieu de chercher une progression exemplaire. Ses questions se raccourcissent, vos réponses aussi, jusqu’à ce que vos hanches et vos mains forment un langage qu’il vérifie sans le dominer.", ["Draven", "Là ? Bon. Je garde ça. Et je ne bouge pas d’un foutu pouce sans que vous me le demandiez.", "approving"]],
      tender: ["Il vous entoure de ses bras et laisse les baisers durer assez longtemps pour que toute urgence quitte la pièce. La douceur n’efface pas sa force ; elle en révèle l’usage le plus intime."],
      suggestive: ["Ses mains descendent avec une lenteur délibérée, ouvrant vos vêtements sans rompre le regard. Draven conserve le rythme qui vous fait revenir contre lui et sourit lorsque votre franchise devient plus rauque que la sienne."],
      explicit: sexLines(
        ["Draven s’installe entre vos cuisses et suit vos indications avec sa bouche et ses doigts. La pression demeure celle que vous avez choisie jusqu’à ce que votre plaisir vous fasse agripper ses épaules.", ["Draven", "Ne vous retenez pas pour ménager mon ego. Il a survécu à pire — et il adore vous entendre.", "approving"]],
        ["Draven prend votre désir entre sa main et sa bouche, apprend la cadence à laquelle vos hanches répondent puis la maintient sans chercher à vous surprendre au mauvais moment. Votre abandon brise enfin sa retenue.", ["Draven", "Voilà. Pas une victoire. Juste vous, qui me dites de continuer.", "approving"]],
        ["Draven suit le point de plaisir, la profondeur et le contact que vous lui avez indiqués. Ses mains et sa bouche s’adaptent à votre corps réel jusqu’à ce que la tension cède entièrement sous lui.", ["Draven", "Aucune carte ne valait vos indications. Je m’en souviendrai.", "approving"]],
      ),
      ellipse: ["Draven éteint la lampe après votre dernier oui. La chronique laisse la chambre garder le poids de ses mains, votre voix et la suite qu’aucun ordre n’a écrite."],
      closing: ["Il reste contre vous, étonnamment immobile, et ne cherche pas à transformer le silence en bilan.", ["Draven", "La ville tient. Vous aussi. Je vais donc accomplir l’exploit stratégique de ne rien réparer.", "gruff"]],
      after: sexText("Sa paume demeure chaude sur votre ventre pendant que votre souffle revient.", "Il pose son front contre votre épaule et laisse retomber toute sa carrure.", "Il vous demande quels mots garder pour la prochaine fois et n’en suppose aucun."),
    },
    {
      id: "releve-du-vieux-soldat",
      labels: sexText("Prendre la relève et faire céder Draven sans le diminuer", "Lui offrir un plaisir qu’il n’a pas à mériter", "Choisir ensemble ce qu’il peut recevoir sans rôle imposé"),
      detail: "Vous prenez l’initiative afin que Draven puisse recevoir sans transformer l’abandon en faiblesse ni en dette.",
      prelude: sexText("Vous retirez son manteau, ses galons et enfin la phrase par laquelle il allait prétendre ne pas être fatigué.", "Vous faites asseoir Draven et lui demandez ce qu’il désire lorsqu’aucun équipage n’attend son ordre.", "Vous lui demandez d’abord ce qu’il ne veut pas recevoir ; cette limite devient le point de départ de votre proximité."),
      setup: ["Draven proteste par principe, puis comprend que vous ne lui demandez ni docilité ni reconnaissance. Il pose ses mains sur le lit, vous offre son poids et formule enfin une envie sans justification.", ["Draven", "Très bien. Vous menez. Mais si vous prenez ça pour un prétexte à me traiter comme un meuble ancien, je me relève.", "gruff"]],
      deepening: ["Vous embrassez son visage, son cou et les cicatrices qu’il ne commente pas. Draven vous guide une fois, puis accepte de laisser votre attention faire son chemin sans préparer déjà ce qu’il devra rendre.", ["Draven", "Continuez. C’est une demande, pas un rapport. Bon sang, je vais finir par apprendre la différence.", "approving"]],
      tender: ["Vous l’allongez sans effacer sa présence. Draven garde votre main contre sa poitrine, reçoit chaque baiser et découvre qu’il peut être entouré sans devenir une charge à transporter."],
      suggestive: ["Votre bouche et vos mains descendent tandis que les siennes cessent enfin de surveiller vos gestes. Il formule une direction, puis un encouragement plus cru, et vous accueillez les deux avec la même attention."],
      explicit: sexLines(
        ["Vous suivez la demande de Draven, gardez le rythme qui tend tout son corps et refusez de le laisser dissimuler ses réactions derrière une plaisanterie. Son plaisir arrive dans un souffle rauque contre votre main.", ["Draven", "Ne ralentissez pas. Je vous le demande parce que je le veux, pas parce que je tiens encore quelque chose.", "gruff"]],
        ["Vous utilisez bouche et mains selon ses indications, maintenez la cadence qui fait répondre ses hanches et restez attentif·ve au moindre recul. Draven cède sans honte, doigts crispés dans les draps.", ["Draven", "Voilà une relève que j’aurais dû accepter il y a des années.", "approving"]],
        ["Vous nommez ensemble la stimulation ou la pénétration que Draven souhaite recevoir et adaptez la position à vos deux corps. Il vous confie la continuité jusqu’à l’orgasme sans exiger de reprendre la conduite.", ["Draven", "Pas de dette. Mais une très forte envie de recommencer.", "approving"]],
      ),
      ellipse: ["Ses galons restent sur la chaise. Draven vous attire pourtant sur lui d’une main décidée, puis le récit ferme la porte avant que sa voix perde entièrement sa discipline."],
      closing: ["Il accepte l’eau que vous lui tendez et votre bras sous sa nuque. Aucun merci solennel ne vient transformer le moment en service rendu.", ["Draven", "Je ne me suis pas brisé. Le monde non plus. Notez cette découverte quelque part où aucun officier ne la verra.", "gruff"]],
      after: sexText("Il laisse votre tête reposer au-dessus de son cœur sans se redresser.", "Sa main couvre la vôtre et ne cherche pas à reprendre l’initiative.", "Il vérifie votre confort puis accepte que le sien compte dans la même phrase."),
    },
    {
      id: "manoeuvre-sans-vainqueur",
      labels: sexText("Renverser Draven jusqu’à ce que plus personne ne commande", "Partager la force, les positions et le plaisir sans victoire", "Faire circuler les rôles selon vos corps et vos demandes"),
      detail: "Une route mutuelle où la carrure de Draven devient soutien, jeu et réponse plutôt qu’avantage hiérarchique.",
      prelude: sexText("Draven vous attire contre lui ; vous utilisez son propre élan pour le faire basculer sur le lit dans un rire surpris.", "Vous testez son appui, cédez un instant puis reprenez la position uniquement lorsque sa main vous y invite.", "Vous convenez d’un signal de reprise avant d’explorer les positions adaptées à vos deux corps."),
      setup: ["Le premier renversement se termine contre les oreillers, le second à genoux et le troisième dans un baiser qui fait oublier le score. Draven emploie sa force pour sécuriser chaque mouvement, jamais pour vous enlever la possibilité de le changer.", ["Draven", "J’avais l’avantage. Puis vous avez triché avec cette bouche. Manœuvre recevable.", "approving"]],
      deepening: ["L’initiative circule à mesure que vos vêtements disparaissent. Draven reçoit votre poids, vous confie le sien, et chaque reprise devient plus intime parce qu’aucun des deux ne doit défendre sa place.", ["{player}", "Toujours envie de compter ?"], ["Draven", "J’ai perdu à trois. Ou gagné. Revenez ici avant que je choisisse.", "gruff"]],
      tender: ["Les renversements deviennent des étreintes. Vous vous soutenez tour à tour, front contre front, et Draven découvre qu’une pause peut appartenir au désir plutôt qu’à l’épuisement."],
      suggestive: ["Chaque changement de position rapproche vos bassins et libère une nouvelle partie de peau. Les mains qui assuraient les appuis deviennent plus directes, puis reviennent au soutien dès que l’intensité l’exige."],
      explicit: sexLines(
        ["Vous échangez bouche, mains et frottements sans décider laquelle doit céder la première. Draven accompagne votre plaisir, reçoit le sien, puis vous ramène contre lui pour prolonger les deux sans course à la simultanéité.", ["Draven", "Aucun vainqueur. Mais cette position mérite une revanche.", "approving"]],
        ["Vous alternez les positions et choisissez à chaque reprise qui donne, qui reçoit et quelle profondeur reste confortable. Draven conduit une cadence, vous la suivante ; vos plaisirs arrivent sous le même appui attentif.", ["Draven", "J’abandonne le score. Pas le mouvement.", "approving"]],
        ["Vous combinez bouche, mains, frottements et pénétration selon les possibilités réelles de vos corps. Draven soutient votre plaisir puis vous confie le sien ; chaque rôle change sur une demande claire, jamais sur une anatomie supposée.", ["Draven", "Deux corps, aucune doctrine et une excellente raison de recommencer.", "approving"]],
      ),
      ellipse: ["Draven vous soulève juste assez pour un dernier renversement, puis vous le faites rire en inversant encore la position. La chronique abandonne le compte derrière la porte fermée."],
      closing: ["Vous restez enlacé·es au milieu de draps qui ressemblent à une carte après tempête. Draven cherche une conclusion tactique, renonce et vous embrasse.", ["Draven", "Rapport final : personne n’a obéi et la mission est un succès.", "approving"]],
      after: sexText("Il garde vos jambes mêlées aux siennes sans rétablir la moindre distance.", "Il masse votre épaule avant de vous laisser faire de même pour lui.", "Il ne retient de vos différences que les gestes à demander de nouveau."),
    },
  ],
};

export const INTIMACY_ROUTES_BY_SEX: Record<string, Record<PlayerSex, IntimacyRoute[]>> = Object.fromEntries(
  Object.entries(ROUTE_SEEDS).map(([character, seeds]) => [character, {
    femme: seeds.map((seed, index) => route(character, "femme", seed, index)),
    homme: seeds.map((seed, index) => route(character, "homme", seed, index)),
    intersexe: seeds.map((seed, index) => route(character, "intersexe", seed, index)),
  }]),
);

export function intimacyRoutes(character: string, sex: PlayerSex): IntimacyRoute[] {
  return INTIMACY_ROUTES_BY_SEX[character]?.[sex] || [];
}

export function validateIntimacyRouteCatalog(): { characters: number; combinations: number; routes: number; chapters: number } {
  let combinations = 0;
  let routes = 0;
  let chapters = 0;
  Object.entries(INTIMACY_ROUTES_BY_SEX).forEach(([character, bySex]) => {
    (["femme", "homme", "intersexe"] as PlayerSex[]).forEach((sex) => {
      const entries = bySex[sex];
      if (!entries || entries.length !== 3) throw new Error(`${character}/${sex}: trois routes intimes sont requises`);
      if (new Set(entries.map((entry) => entry.text)).size !== 3) throw new Error(`${character}/${sex}: les choix doivent être distincts`);
      entries.forEach((entry) => {
        (["tendre", "suggestif", "explicite", "ellipse"] as IntimacyMode[]).forEach((mode) => {
          const wordCount = entry.chapters[mode].flat().reduce((total, line) => total + line.text.trim().split(/\s+/u).length, 0);
          const minimumWords = mode === "explicite" ? 400 : 280;
          if (entry.chapters[mode].length !== 8 || entry.chapters[mode].some((chapter) => chapter.length === 0)) {
            throw new Error(`${entry.id}/${mode}: la route doit couvrir exactement huit séquences`);
          }
          if (wordCount < minimumWords) {
            throw new Error(`${entry.id}/${mode}: ${wordCount} mots, minimum ${minimumWords}`);
          }
          chapters += entry.chapters[mode].length;
        });
      });
      combinations += 1;
      routes += entries.length;
    });
  });
  return { characters: Object.keys(INTIMACY_ROUTES_BY_SEX).length, combinations, routes, chapters };
}

validateIntimacyRouteCatalog();
