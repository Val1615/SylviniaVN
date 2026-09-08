import type { DialogueLine } from "./game-data";
import type { IntimacyMode, PlayerSex } from "./date-scenes";
import type { IntimacyRoute } from "./intimacy-routes";

export type HyleeIntimacyContext = "date-hylee-glade" | "date-hylee-lake" | "home-hylee";
export type HyleeIntimacyPhase = "approach" | "undressing" | "naked-reveal" | "partner-discovery" | "hylee-discovery" | "preliminaries" | "intensification" | "climax" | "afterglow" | "ending";
export type HyleeDateApproach = { id: string; text: string; lines: DialogueLine[] };

type BinaryPlayerSex = Extract<PlayerSex, "femme" | "homme">;
type HyleeMood = "joueuse" | "tendre" | "audacieuse";
type RawLine = string | readonly [speaker: "Hylee" | "{player}", text: string, mood?: string];
type AuthoredChapter = { all: RawLine[] } | Record<IntimacyMode, RawLine[]>;
type AuthoredScene = {
  id: string;
  context: HyleeIntimacyContext;
  sex: BinaryPlayerSex;
  mood: HyleeMood;
  text: string;
  detail: string;
  chapters: AuthoredChapter[];
};

const PHASES: HyleeIntimacyPhase[] = ["approach", "undressing", "naked-reveal", "partner-discovery", "hylee-discovery", "preliminaries", "intensification", "climax", "afterglow", "ending"];
const MODES: IntimacyMode[] = ["tendre", "suggestif", "explicite", "ellipse"];
const CONTEXTS: HyleeIntimacyContext[] = ["date-hylee-glade", "date-hylee-lake", "home-hylee"];
const SEXES: BinaryPlayerSex[] = ["femme", "homme"];

// Ces deux aides ne rédigent ni ne recombinent la scène : elles déclarent si
// un chapitre est commun aux réglages de visibilité ou possède quatre textes
// explicitement écrits. La seule opération ultérieure est une sélection.
const A = (...all: RawLine[]): AuthoredChapter => ({ all });
const V = (tendre: RawLine[], suggestif: RawLine[], explicite: RawLine[], ellipse: RawLine[]): AuthoredChapter => ({ tendre, suggestif, explicite, ellipse });

const dialogueLines = (raw: RawLine[]): DialogueLine[] => raw.map((entry) => typeof entry === "string"
  ? { speaker: "Narration", text: entry }
  : { speaker: entry[0], text: entry[1], mood: entry[2] });

export const HYLEE_INTIMACY_OPENINGS: Record<HyleeIntimacyContext, DialogueLine[]> = {
  "date-hylee-glade": dialogueLines([
    "Le repas terminé, Hylee range les outils mais laisse la couverture étendue. Le sentier est silencieux ; elle en vérifie les deux directions, puis vous conduit quelques pas plus loin, dans un creux de la clairière masqué par les fougères violettes.",
    ["Hylee", "On peut rentrer. Ou rester ici, mais pas seulement pour finir les fruits.", "soft"],
    "Elle rapporte le panier et la couverture dans ce repli d'herbe, à l'abri des regards depuis le chemin. Les branches basses retiennent le soleil de fin d'après-midi au-dessus de vous.",
    ["Hylee", "J'y ai pensé pendant qu'on rangeait. Maintenant que je te l'ai demandé, j'ai encore plus d'idées.", "teasing"],
  ]),
  "date-hylee-lake": dialogueLines([
    "Hylee retire vos lames mais ne rouvre pas encore le petit barrage. Elle vous entraîne sur la rive opposée, derrière un rideau de saules pourpres où le chemin et Mir'Aldas disparaissent.",
    "Vos bottes et le sac de lames restent près d'une pierre plate. Hylee étend vos deux manteaux sur l'herbe sèche, s'assied, puis garde votre main au lieu de la lâcher.",
    ["Hylee", "Je ne t'ai pas amené·e ici seulement pour sauver nos chevilles.", "teasing"],
    ["Hylee", "Sur la glace, je pensais déjà à ce que ça ferait de te toucher sans essayer de rester debout. Ici, personne ne nous voit. J'aimerais vérifier.", "determined"],
  ]),
  "home-hylee": dialogueLines([
    "La dernière coupe est vide. Vous rangez ensemble les bols, essuyez la trace de baie sur la table et laissez le panier près de la porte. Le photophore offert par Hylee éclaire encore la pièce.",
    "Hylee revient de la cuisine avec le torchon sur l'épaule. Elle s'arrête tout près de vous, retire le tissu et le pose sans regarder où il tombe.",
    ["Hylee", "Je peux rester. Tu me l'as proposé, et j'en ai envie. Mais je n'ai pas envie de faire semblant que c'est seulement pour le thé.", "soft"],
    "Elle ferme elle-même la porte, puis revient chercher votre bouche avec une décision qui n'attend aucune mise en scène supplémentaire.",
  ]),
};

export const HYLEE_INTIMACY_APPROACHES: Record<HyleeIntimacyContext, HyleeDateApproach[]> = {
  "date-hylee-glade": [
    { id: "hylee-glade-fruit", text: "Partager le dernier fruit jusqu'à ce que Hylee décide que le jeu a assez duré", lines: dialogueLines(["Vous prenez chacun un côté du fruit resté dans le panier. Hylee mord, rapproche sa bouche de la vôtre et abandonne volontairement la moitié de sa prise.", ["Hylee", "C'était une très mauvaise façon de partager. On recommence sans le fruit ?", "teasing"], "Elle vous embrasse avant que vous répondiez."]) },
    { id: "hylee-glade-blanket", text: "Replier la couverture autour de vous pour fermer le reste de la clairière", lines: dialogueLines(["Vous ramenez ensemble un bord de la couverture ; un petit copeau de glace fondue tombe au milieu.", ["Hylee", "Elle a déjà survécu au repas et à notre sculpture. Je crois qu'elle peut nous supporter aussi.", "teasing"], "Elle s'agenouille, vous tend les deux mains et vous attire près d'elle."]) },
    { id: "hylee-glade-honest", text: "Lui dire sans détour que vous y pensiez depuis le dernier baiser", lines: dialogueLines([["{player}", "J'y pensais déjà quand tu as demandé si je voulais rester."], "Hylee rougit, baisse les yeux une seconde, puis saisit votre chemise pour vous rapprocher.", ["Hylee", "Bien. Alors nous pouvons arrêter de ranger très sérieusement.", "determined"]]) },
  ],
  "date-hylee-lake": [
    { id: "hylee-lake-warm-hands", text: "Prendre ses mains encore fraîches et les guider sous votre vêtement", lines: dialogueLines(["Vous glissez les mains d'Hylee sous votre haut, contre votre taille. Elle sursaute au contraste, puis écarte les doigts et vous rapproche.", ["Hylee", "D'accord. Elles vont se réchauffer ici beaucoup plus vite.", "teasing"]]) },
    { id: "hylee-lake-no-balance", text: "L'embrasser en lui rappelant qu'elle n'a plus besoin de garder l'équilibre", lines: dialogueLines([["{player}", "Tu peux arrêter de surveiller tes pieds."], "Hylee regarde aussitôt le sol, rit de s'être fait prendre et pose un pied entre les vôtres.", ["Hylee", "Alors je vais regarder ce que font mes mains.", "determined"], "Elle vous embrasse en les glissant à votre taille."]) },
    { id: "hylee-lake-laces", text: "Vous asseoir près d'elle et défaire la boucle qu'elle a oubliée", lines: dialogueLines(["Vous vous agenouillez dans l'herbe devant la boucle restée serrée autour de sa cheville. Hylee pose une main sur votre épaule, mais son regard quitte vite la lanière pour suivre votre visage.", ["Hylee", "Tu peux remonter maintenant. Lentement, si tu veux.", "soft"]]) },
  ],
  "home-hylee": [
    { id: "hylee-home-photophore", text: "Éteindre les autres lampes et garder seulement son photophore", lines: dialogueLines(["La pièce s'assombrit autour du petit photophore. Hylee tourne le verre pour projeter une branche de lumière sur votre poitrine.", ["Hylee", "Je l'avais fait pour ta table. Je préfère ce nouvel usage.", "teasing"], "Elle suit la lumière de sa bouche."]) },
    { id: "hylee-home-spoon", text: "Lui reprendre la petite cuillère qu'elle garde encore et réclamer autre chose", lines: dialogueLines(["Vous retirez doucement la cuillère de ses doigts et la posez dans la coupe vide.", ["{player}", "J'ai envie d'autre chose."], ["Hylee", "Moi aussi. C'est pratique.", "determined"], "Elle vient s'asseoir sur vos genoux et vous embrasse."]) },
    { id: "hylee-home-door", text: "Laisser Hylee choisir la pièce où elle veut poursuivre", lines: dialogueLines([["{player}", "Où veux-tu aller ?"], "Hylee regarde le canapé, la chambre, puis votre bouche. Elle prend votre main et choisit sans transformer la décision en épreuve.", ["Hylee", "La chambre. Mais je veux commencer ici.", "soft"], "Son premier baiser vous retient encore dans le salon."]) },
  ],
};

export const HYLEE_INTIMACY_ENDINGS: Record<HyleeIntimacyContext, DialogueLine[]> = {
  "date-hylee-glade": dialogueLines(["Le panier reste ouvert dans l'herbe. Hylee retrouve le dernier fruit, le coupe avec le bord d'une cuillère et vous en donne la part la plus grande sans ouvrir de négociation.", ["Hylee", "La prochaine fois, on apporte moins d'outils. Ou une couverture plus grande.", "teasing"]]),
  "date-hylee-lake": dialogueLines(["Le jour baisse sur le petit lac. Hylee remet le sac de lames près des bottes, mais reste encore nue sous les manteaux avec vous.", ["Hylee", "On retournera sur la glace. Pas tout de suite. Mes jambes ont déjà beaucoup appris ici.", "teasing"]]),
  "home-hylee": dialogueLines(["Le photophore veille encore lorsque Hylee ramène la couverture sur vous deux. La vaisselle attendra le matin ; elle a laissé son panier près de la porte, sans le reprendre.", ["Hylee", "J'aime bien savoir où je me réveillerai. Ici, si tu veux bien.", "soft"]]),
};

const SCENES: AuthoredScene[] = [
  {
    id: "hylee-glade-femme-joueuse", context: "date-hylee-glade", sex: "femme", mood: "joueuse",
    text: "Comparer vos découvertes et laisser Hylee changer les règles",
    detail: "Une complicité joueuse entre deux femmes, nourrie par le panier, la couverture et les défis improvisés d'Hylee.",
    chapters: [
      A("Au creux de la clairière, Hylee vide deux baies oubliées dans sa paume et vous demande d'en choisir une. Quand vous tendez les doigts, elle mange celle que vous visiez et vous offre l'autre entre ses lèvres.", ["Hylee", "Première règle : je peux changer les règles. Toi aussi, mais il faut être plus rapide.", "teasing"], "Votre baiser a le goût du fruit et de son rire retenu."),
      A("Elle entreprend d'ouvrir votre chemise sans quitter votre bouche, se trompe de bouton et refuse de revenir en arrière. Vous défaites sa robe pendant qu'elle prétend que l'asymétrie était prévue.", "Les vêtements rejoignent la couverture dans un ordre impossible à reconstituer. Hylee récupère pourtant votre sous-vêtement avant qu'il tombe et le brandit comme un trophée.", ["Hylee", "Celui-là compte double. Je ne sais pas encore ce que je gagne.", "teasing"]),
      A("Nue devant vous, Hylee tourne sur elle-même avec une audace qui se brise seulement lorsqu'elle croise votre regard. Elle rougit, puis lève les bras au lieu de se couvrir.", ["Hylee", "Tu peux regarder. Moi aussi, je vais regarder. Comme ça, personne ne triche.", "determined"], "Elle vous aide à retirer le dernier tissu et découvre votre corps de femme avec une attention vive, sans comparaison ni étonnement joué."),
      V(
        ["Hylee suit vos épaules, vos seins et le creux de votre taille du bout des doigts. Elle vérifie chaque frisson par un baiser, fière lorsque votre corps se rapproche de lui-même."],
        ["Ses lèvres descendent entre vos seins puis sur votre ventre. Une main se glisse entre vos cuisses ; elle sourit contre votre peau quand elle sent votre chaleur répondre."],
        ["Hylee écarte vos cuisses sur la couverture et découvre votre vulve avec ses doigts. Elle recueille votre humidité, tourne autour de votre clitoris et change aussitôt de pression quand vos hanches se soulèvent.", ["Hylee", "Ah. C'est là que tu oublies de me laisser gagner.", "teasing"]],
        ["Hylee embrasse votre ventre puis se glisse plus bas. La couverture remonte sur ses épaules ; ses questions deviennent des souffles, et votre main dans ses cheveux lui répond sans imposer d'image au récit."],
      ),
      V(
        ["Vous l'allongez à son tour et suivez sa peau de vos paumes. Hylee essaie de deviner votre prochain geste, se trompe deux fois et finit par fermer les yeux pour mieux le sentir."],
        ["Votre bouche trouve ses seins, son ventre puis l'intérieur de ses cuisses. Hylee ouvre les jambes avant que vous le demandiez et vous montre d'une main l'endroit où elle veut vous retrouver."],
        ["Vous goûtez Hylee entre les cuisses. Sa vulve s'ouvre sous votre langue ; elle guide votre bouche vers son clitoris, puis écarte elle-même les doigts pour vous offrir un contact plus précis.", ["Hylee", "Oui. Reste là… non, attends, un peu plus haut. Voilà.", "determined"]],
        ["Vous lui rendez la découverte avec la même attention. Hylee se mord la lèvre, renonce à retenir le premier son et vous attire plus près tandis que le récit demeure derrière la couverture."],
      ),
      V(
        ["Hylee propose de vous allonger côte à côte. Vos cuisses se mêlent ; chacune cherche la caresse qui fait rire l'autre avant de la faire soupirer."],
        ["Elle vient au-dessus de vous, un genou entre vos jambes, puis change d'idée et se retourne pour que vos mains puissent vous découvrir en même temps."],
        ["Hylee se place tête-bêche sur la couverture. Sa bouche revient sur votre clitoris pendant que vous reprenez le sien avec les doigts et la langue ; elle perd le rythme, rit contre votre vulve et revient avec une application redoublée."],
        ["Hylee invente une nouvelle position sous la couverture et vous demande seulement de lui dire si elle vous plaît. Les réponses deviennent bientôt trop courtes pour être racontées."],
      ),
      A("Le soleil filtré par les branches fait briller les gouttes de sueur sur sa peau. Hylee vous ramène face à elle, vos jambes entremêlées, et frotte son bassin contre votre cuisse avant de vous offrir la sienne.", "Un seul fin motif de givre apparaît sur la cuillère tombée près du panier. Hylee l'aperçoit, hausse les sourcils et vous embrasse comme si ce détail lui avait donné une nouvelle avance."),
      V(
        ["Vos mains trouvent un rythme commun. Hylee garde son front contre le vôtre et laisse le plaisir monter sans cesser de sourire chaque fois que vos corps se répondent."],
        ["Vos vulves se pressent l'une contre l'autre entre vos cuisses croisées. Hylee change l'angle, reprend votre bouche et accélère lorsqu'elle vous sent trembler."],
        ["Hylee maintient vos bassins serrés, son clitoris glissant contre le vôtre. Sa main ajoute une pression exacte entre vous ; l'orgasme vous prend la première, puis vos mouvements désordonnés et vos doigts la font jouir contre votre cuisse.", ["Hylee", "J'avais dit que ça comptait double… je ne sais toujours pas pour quoi.", "teasing"]],
        ["Votre jeu devient plus pressant, puis le récit baisse la lumière sur vos corps enlacés. Quand elle revient, Hylee tremble encore et rit sans réussir à expliquer laquelle de vous a gagné."],
      ),
      A("Hylee reste couchée de travers, une cheville hors de la couverture et la joue sur votre poitrine. Elle retrouve une baie écrasée près du panier, décide qu'elle est perdue et vient voler le goût resté sur votre bouche.", ["Hylee", "J'avais d'autres règles. Je les ai toutes oubliées. C'est plutôt bon signe.", "soft"]),
      A("Vous repliez la couverture sans vous lever vraiment. Hylee roule avec le tissu, vous entraîne contre elle et décrète que le rangement est reporté.", ["Hylee", "La prochaine sculpture sera beaucoup plus simple. Deux personnes allongées. Je sais déjà comment elles tiennent ensemble.", "teasing"]),
    ],
  },
  {
    id: "hylee-glade-homme-joueuse", context: "date-hylee-glade", sex: "homme", mood: "joueuse",
    text: "Accepter le défi d'Hylee et la laisser vérifier chaque effet qu'elle produit",
    detail: "Hylee transforme les restes du pique-nique en provocations et explore le corps masculin sans perdre son humour.",
    chapters: [
      A("Sous les branches de la clairière, Hylee pose une baie sur votre clavicule et vous interdit de la laisser tomber pendant qu'elle défait votre col. La baie roule au premier baiser ; elle la rattrape contre votre poitrine avec la bouche.", ["Hylee", "Tu as perdu. La punition, c'est que je continue.", "teasing"], "Elle ne vous laisse pas le temps de contester."),
      A("Ses doigts ouvrent votre chemise pendant que vous délacez sa robe. Hylee recule juste assez pour faire glisser le tissu de ses épaules, puis vous enlève votre ceinture avec le sérieux exagéré d'une épreuve délicate.", "Votre pantalon résiste à une botte oubliée. Elle éclate de rire, s'agenouille pour vous libérer et profite de sa position pour embrasser votre ventre."),
      A("Hylee se redresse nue, les cheveux défaits sur ses seins. Votre regard la fait rougir ; elle pose les mains sur ses hanches et reste offerte au lieu de ramener la couverture.", "Lorsqu'elle vous dénude à votre tour, son attention descend franchement sur votre sexe. Elle relève les yeux avec une curiosité qui n'a rien d'innocent.", ["Hylee", "Je peux avoir des idées et poser des questions en même temps. Prépare-toi.", "determined"]),
      V(
        ["Elle caresse votre torse, votre ventre et vos hanches, attentive aux muscles qui se tendent sous sa paume. Son baiser suit chaque endroit qu'elle vient d'apprendre."],
        ["Hylee referme la main sur votre érection à travers le dernier tissu, observe votre souffle changer et recommence avec une lente fierté."],
        ["Elle libère votre pénis et l'entoure de ses doigts. Son pouce glisse sur le gland humide ; Hylee essaie deux pressions, garde celle qui vous fait fermer les yeux et sourit comme après une sculpture enfin stable.", ["Hylee", "Celle-là. Je garde ce mouvement.", "teasing"]],
        ["Hylee descend sur votre ventre et vous découvre sous la couverture. Elle demande ce que vous aimez, puis le récit s'écarte pendant que ses mains apprennent votre réponse."],
      ),
      V(
        ["Vous l'allongez sur la couverture et découvrez ses seins, son ventre, ses cuisses. Hylee change la place de votre main chaque fois qu'une autre idée lui plaît davantage."],
        ["Votre main se glisse entre ses jambes. Hylee ouvre les cuisses, pousse le bassin contre vos doigts et vous demande de ne surtout pas prétendre que ce mouvement était involontaire."],
        ["Vos doigts trouvent sa vulve humide puis son clitoris. Hylee vous montre le cercle qui lui plaît, vous laisse l'apprendre et vous arrête brusquement pour attirer votre bouche entre ses cuisses.", ["Hylee", "Je veux savoir ce que ça fait avec ta langue. Maintenant, si possible.", "determined"]],
        ["Vous poursuivez sous la couverture. Hylee guide votre main par de petits mouvements francs, puis sa voix remplace les détails que le récit choisit de laisser privés."],
      ),
      V(
        ["Hylee vient s'asseoir sur vos cuisses, encore séparée de vous par un tissu. Elle teste trois façons de bouger, abandonne la première et garde celle qui vous rapproche tous les deux."],
        ["Elle alterne sa bouche et sa main sur votre sexe, puis remonte vous embrasser pour réclamer le même soin entre ses jambes."],
        ["Hylee prend votre pénis dans sa bouche, joue de sa langue sous le gland puis vous libère au moment où vos hanches cherchent davantage. Elle se place au-dessus de vous et guide votre érection contre son entrée humide sans cesser de vous regarder."],
        ["Hylee vous attire contre la couverture et transforme la suite en expérience privée, changeant de mouvement chaque fois que votre souffle lui révèle une meilleure idée."],
      ),
      A("Elle descend lentement sur vous, s'arrête pour trouver l'angle qui lui convient puis reprend avec un rire bref quand vos mains se crispent sur ses hanches.", ["Hylee", "Ne fais pas cette tête. Enfin si, fais exactement cette tête.", "teasing"], "Un mince cercle de givre blanchit le bord de la coupe posée dans l'herbe, unique éclat de magie au milieu de la clairière."),
      V(
        ["Hylee reste assise contre vous et accompagne chaque mouvement d'un baiser. Vos mains et ses hanches trouvent une cadence qui vous mène ensemble jusqu'au plaisir."],
        ["Elle accélère au-dessus de vous, une main sur votre poitrine et l'autre entre ses cuisses. Sa respiration se brise lorsque vos doigts reprennent son clitoris."],
        ["Hylee chevauche votre pénis avec une cadence de plus en plus assurée. Vous travaillez son clitoris pendant qu'elle resserre ses cuisses autour de vos hanches ; son orgasme la fait s'immobiliser sur vous, puis elle reprend assez longtemps pour vous conduire au vôtre.", ["Hylee", "Attends… voilà. Maintenant tu peux perdre aussi.", "determined"]],
        ["Ses mouvements deviennent plus pressants sous la couverture. Le récit laisse vos corps achever le défi ; lorsqu'il revient, Hylee est affalée sur votre torse, victorieuse et incapable de compter les points."],
      ),
      A("Elle reste sur vous, le menton posé au milieu de votre poitrine, et dessine du doigt le trajet imaginaire de la baie tombée au début.", ["Hylee", "Je crois que la punition était mal choisie. Tu avais l'air d'aimer perdre.", "teasing"], "Vous lui répondez en la ramenant contre votre bouche."),
      A("Hylee range la coupe givrée près du panier puis revient nue sous la couverture, sans se presser de retrouver ses vêtements.", ["Hylee", "La prochaine fois, j'invente un jeu avec moins de règles. Une seule : tu reviens.", "soft"]),
    ],
  },
  {
    id: "hylee-glade-femme-tendre", context: "date-hylee-glade", sex: "femme", mood: "tendre",
    text: "Vous découvrir entre deux hésitations qu'Hylee choisit de traverser",
    detail: "Une tendresse active : Hylee rougit, observe, demande, se reprend et revient toujours d'elle-même.",
    chapters: [
      A("Hylee pose le panier dans l'herbe, revient jusqu'à vous puis s'arrête à la distance d'un souffle. Ses doigts trouvent votre main avant ses mots.", ["Hylee", "Je suis sûre d'avoir envie. Je ne suis pas sûre d'être élégante. Tu peux m'embrasser quand même ?", "soft"], "Vous répondez par un baiser lent. Au second, c'est elle qui vous rapproche."),
      A("Elle ouvre d'abord votre manche, s'aperçoit qu'elle a commencé par l'endroit le moins pratique et sourit sans cacher son embarras. Vous l'aidez, puis attendez lorsqu'elle prend votre bouton suivant entre ses doigts.", "Hylee défait votre vêtement à son rythme et vous laisse dénouer le sien. Chaque tissu retiré est suivi d'un regard, d'une respiration et d'un geste qu'elle choisit de reprendre."),
      A("Quand sa robe tombe, Hylee couvre un instant ses seins de ses avant-bras. Elle regarde vos propres épaules nues, souffle, puis laisse ses bras redescendre.", ["Hylee", "Attends. Je veux te voir me regarder sans me cacher tout le temps.", "determined"], "Elle reste face à vous et vous demande silencieusement la même franchise ; vous retirez le dernier tissu."),
      V(
        ["Hylee pose ses paumes sur vos épaules, descend vers vos seins puis s'arrête à votre taille. Elle vous laisse guider une main et recommence seule avec l'autre."],
        ["Ses baisers suivent votre poitrine et votre ventre. Sa cuisse se place entre les vôtres ; elle observe votre bassin venir chercher le contact avant de bouger à son tour."],
        ["Hylee glisse une main entre vos jambes et découvre votre vulve humide. Ses doigts longent vos lèvres, remontent vers votre clitoris puis s'immobilisent lorsque votre souffle change.", ["Hylee", "C'est bien ici ?"], ["{player}", "Oui. Continue."], "Elle reprend, plus sûre."],
        ["Hylee vous découvre sous la couverture, avec des questions simples et des gestes que vous guidez. Le récit laisse son assurance grandir dans vos réponses."],
      ),
      V(
        ["Vous suivez les taches claires de sa peau sans en faire un inventaire. Hylee observe votre main, rougit encore et finit par la guider elle-même jusqu'à son sein."],
        ["Votre bouche se ferme sur un mamelon, puis descend sur son ventre. Hylee écarte les cuisses et pose une main dans vos cheveux pour vous demander de rester."],
        ["Vous embrassez l'intérieur de ses cuisses avant de goûter sa vulve. Hylee se crispe, reprend votre main et la place sur son ventre ; votre langue trouve son clitoris quand elle cesse de retenir son bassin.", ["Hylee", "Ne t'arrête pas parce que je tremble. Je te le dirai si je veux arrêter.", "determined"]],
        ["Vous lui rendez chaque caresse à l'abri de la couverture. Hylee garde votre main et choisit elle-même quand se rapprocher davantage."],
      ),
      V(
        ["Elle vous fait remonter près d'elle. Vos jambes se mêlent, vos mains circulent sans urgence et Hylee ose demander une seconde fois ce qui lui a plu."],
        ["Hylee s'allonge sur le côté face à vous. Une cuisse passe entre les vôtres ; vos doigts alternent sur vos corps pendant que vos bouches restent proches."],
        ["Allongées face à face, vous glissez chacune une main entre les cuisses de l'autre. Hylee apprend le mouvement de votre clitoris tandis que vos doigts entrent doucement en elle ; elle change l'angle de sa hanche pour vous offrir plus de place."],
        ["Hylee vous attire face à elle sous la couverture. La suite avance par questions, réponses et silences pleins ; le récit se retire sans transformer sa gêne en absence."],
      ),
      A("Votre rythme s'intensifie sans devenir brusque. Hylee serre votre cuisse entre les siennes, vous embrasse, perd votre bouche dans un soupir et revient la chercher.", "Un flocon unique se forme au-dessus du panier, tombe sur la couverture et fond entre vos épaules. Hylee le sent, sourit et garde toute son attention sur vous."),
      V(
        ["Vos caresses vous mènent l'une après l'autre au plaisir. Hylee accompagne votre tremblement, puis vous guide jusqu'à ce que le sien détende enfin ses jambes autour de vous."],
        ["Vos doigts accélèrent ensemble. Hylee jouit la première contre votre main ; elle garde pourtant son geste sur vous et vous conduit à votre tour sans quitter votre regard."],
        ["Hylee serre vos doigts en elle tandis que son pouce travaille votre clitoris. Votre orgasme vous cambre contre sa paume ; elle reprend votre main sur sa vulve et vient jouir sous vos doigts, le visage enfoui contre votre cou."],
        ["Les mouvements deviennent trop intimes pour le récit. Lorsqu'il revient, vos respirations se calment l'une contre l'autre et Hylee garde encore votre main entre ses cuisses."],
      ),
      A("Hylee reste face à vous, les joues toujours rouges mais le corps détendu. Elle caresse votre épaule avec la lenteur de quelqu'un qui n'a plus besoin de prouver qu'elle reste.", ["Hylee", "J'ai eu peur trois fois. Et trois fois, j'avais encore envie de continuer.", "soft"]),
      A("Elle tire la couverture du pique-nique sur vos pieds et glisse le panier hors du passage du bout du talon.", ["Hylee", "On peut parler demain. Là, je veux juste savoir si tu restes jusqu'à ce que je m'endorme.", "soft"], "Vous restez. Sa main ne lâche la vôtre qu'une fois endormie."),
    ],
  },
  {
    id: "hylee-glade-homme-tendre", context: "date-hylee-glade", sex: "homme", mood: "tendre",
    text: "Laisser Hylee apprivoiser sa gêne tout en guidant elle-même vos gestes",
    detail: "Une scène face à face où Hylee demeure active, découvre le corps masculin et choisit chaque reprise.",
    chapters: [
      A("Hylee écarte une branche et vérifie une dernière fois que le sentier reste invisible derrière les fougères. Elle vous regarde, inspire, puis vient poser la main au milieu de votre poitrine.", ["Hylee", "Mon cœur court plus vite que sur le sentier. Le tien aussi ?", "soft"], "Vous gardez sa paume sur vos battements. Elle sourit, rassurée par cette réponse ordinaire, et vous embrasse."),
      A("Elle retire votre veste et prend le temps de la suspendre, comme si ce geste lui donnait une seconde pour revenir. Elle revient vraiment, ouvre votre chemise et vous invite d'un mouvement à défaire sa robe.", "Quand vos doigts hésitent sur une attache, Hylee les reprend, la défait elle-même puis remet votre main à sa place contre sa taille."),
      A("Nue dans la lumière basse, elle rougit jusqu'aux oreilles. Sa première réaction est de rapprocher ses jambes ; la seconde, choisie, est d'avancer vers vous.", "Hylee retire votre dernier vêtement et regarde votre érection sans reculer. Elle touche d'abord votre hanche, puis descend sa main lorsqu'elle se sent prête.", ["Hylee", "Je vais peut-être demander beaucoup de choses. Ce n'est pas parce que je veux partir.", "determined"]),
      V(
        ["Ses mains découvrent votre torse et votre ventre. Hylee appuie sa joue contre votre poitrine, écoute votre souffle et continue plus bas seulement lorsque vous l'attirez contre vous."],
        ["Elle caresse votre sexe par-dessus sa paume, sans brusquer le premier contact. La réponse de votre corps lui arrache un sourire qu'elle essaie inutilement de cacher."],
        ["Hylee entoure votre pénis de ses doigts, explore la longueur puis le gland d'un pouce prudent. Votre souffle l'encourage ; elle ajuste sa prise et vous regarde avant chaque changement.", ["Hylee", "Comme ça ? Je veux sentir quand ça devient vraiment bon."], "Vous lui montrez. Elle retient le rythme."],
        ["Sous la couverture, Hylee découvre votre corps avec ses mains et ses questions. Vous lui répondez sans accélérer à sa place, et sa gêne devient peu à peu une initiative entière."],
      ),
      V(
        ["Vous embrassez ses épaules, ses seins et son ventre. Hylee vous fait remonter une fois pour reprendre votre bouche, puis vous guide elle-même vers l'intérieur de ses cuisses."],
        ["Votre main trouve sa chaleur. Hylee ouvre les jambes, pose les doigts sur les vôtres et vous montre le mouvement qui lui fait relever le bassin."],
        ["Vos doigts séparent les lèvres de sa vulve humide et tournent autour de son clitoris. Hylee guide votre main, retire la sienne lorsqu'elle vous sent comprendre, puis vous demande de glisser un doigt en elle sans cesser la caresse externe."],
        ["Hylee vous guide entre ses cuisses sous la couverture. Ses demandes restent nettes même lorsque les détails s'effacent, et elle reprend votre bouche chaque fois que la gêne revient."],
      ),
      V(
        ["Elle vous allonge et vient contre votre côté. Vos jambes se croisent ; Hylee choisit un mouvement de bassin doux qui vous garde face à face."],
        ["Hylee caresse votre sexe puis vous attire entre ses cuisses. Elle teste la proximité sans se presser d'aller plus loin, attentive à votre respiration comme à la sienne."],
        ["Hylee guide votre pénis contre sa vulve, fait glisser le gland sur son clitoris et s'arrête pour savourer le frisson. Lorsqu'elle vous accueille enfin, elle garde une main sur votre hanche et règle elle-même la profondeur.", ["Hylee", "Reste près. Je veux te voir.", "soft"]],
        ["Hylee vous ramène sous la couverture et choisit la manière dont vos corps se rejoignent. Le récit s'efface, mais pas ses gestes ni les réponses qu'elle vous demande."],
      ),
      A("Vous restez sur le côté, son visage à quelques centimètres du vôtre. Hylee accompagne chaque mouvement, s'arrête pour changer l'angle puis repart d'elle-même lorsqu'il lui convient.", "Un peu de fraîcheur gagne la boucle métallique du panier abandonné dans l'herbe, sans neige ni tempête. Elle n'y prête même pas attention."),
      V(
        ["Le plaisir monte entre vos caresses et vos mouvements lents. Hylee vous garde contre elle lorsqu'elle tremble, puis accompagne votre propre abandon d'une main ferme dans votre dos."],
        ["Hylee presse son clitoris entre vos bassins, accélère et jouit contre vous. Elle continue à bouger, plus doucement, jusqu'à sentir votre plaisir vous traverser à votre tour."],
        ["Votre pénis glisse en elle au rythme qu'elle maintient. Hylee travaille son clitoris d'une main, jouit en serrant vos hanches contre les siennes, puis reprend des mouvements courts jusqu'à votre orgasme, le front appuyé au vôtre."],
        ["La couverture se referme sur vos corps face à face. Le récit revient après le plaisir, lorsque Hylee garde vos jambes liées et votre souffle encore mêlé au sien."],
      ),
      A("Hylee reste contre votre torse. Ses doigts retracent une ancienne couture de la couverture plutôt que de chercher une phrase importante.", ["Hylee", "Je croyais que j'allais devoir devenir très sûre de moi. En fait, j'ai pu hésiter et quand même venir vers toi.", "soft"]),
      A("Elle pose sa robe sur le panier pour la garder loin de l'herbe humide, puis revient nue sous la couverture.", ["Hylee", "Ne remets pas ta chemise tout de suite. J'aime bien entendre ton cœur sans tissu au milieu.", "soft"], "La lumière descend derrière les arbres. Sa paume reste sur votre poitrine."),
    ],
  },
  {
    id: "hylee-glade-femme-audacieuse", context: "date-hylee-glade", sex: "femme", mood: "audacieuse",
    text: "Laisser Hylee mener le désir qu'elle n'a plus envie de retenir",
    detail: "Une Hylee directe prend l'initiative, provoque une autre femme et change de dynamique lorsqu'elle le décide.",
    chapters: [
      A("À peine le sentier masqué par les fougères, Hylee vous prend par la taille et vous embrasse contre le tronc d'un grand arbre. Le panier heurte doucement une racine ; elle le repousse du pied sans quitter votre bouche.", ["Hylee", "J'ai attendu pendant qu'on rangeait. Maintenant, je n'attends plus.", "determined"], "Elle guide vos mains sous sa robe avec une franchise qui rend toute explication inutile."),
      A("Hylee ouvre votre haut, embrasse chaque parcelle découverte et vous fait reculer jusqu'à la couverture. Elle retire sa robe elle-même, debout entre vos genoux, puis vous tend les bras pour que vous défassiez le reste.", "Quand vous tentez de reprendre l'initiative, elle vous laisse faire deux boutons avant de vous renverser doucement sur les coudes, ravie de l'effet."),
      A("Nue, Hylee ne se détourne pas. Elle pose un genou entre vos jambes et attend que votre regard parcoure ses seins, son ventre, ses hanches et les taches claires de sa peau.", ["Hylee", "Regarde bien. Après, c'est mon tour."], "Elle vous déshabille avec la même attention assumée et accueille votre nudité de femme par un sourire lent."),
      V(
        ["Hylee vous maintient allongée sous elle et découvre vos seins de ses paumes. Elle suit chaque réaction, puis vous demande seulement de la rapprocher quand vous voulez davantage."],
        ["Sa bouche descend sur vos seins, son ventre pressé entre vos cuisses. Une main se glisse plus bas et commence une caresse dont elle surveille fièrement l'effet."],
        ["Hylee écarte vos jambes et passe deux doigts sur votre vulve mouillée. Elle cerne votre clitoris, accélère dès que vos hanches répondent puis plonge un doigt en vous sans interrompre le travail de son pouce.", ["Hylee", "Dis mon nom si tu veux plus. Je veux l'entendre.", "determined"]],
        ["Hylee vous couvre de la couverture et prend le temps de découvrir ce qui vous fait l'appeler. Le récit se retire devant son assurance, pas devant une hésitation."],
      ),
      V(
        ["Vous inversez les places. Hylee rit de se retrouver dessous, puis ouvre les bras et les jambes avec une invitation qui n'a rien de passif."],
        ["Vous mordez doucement son sein avant de descendre. Elle pose votre main entre ses cuisses et vous fait sentir exactement la chaleur qu'elle ne cherche plus à cacher."],
        ["Votre langue ouvre sa vulve et revient sur son clitoris. Hylee relève le bassin contre votre bouche, guide vos cheveux d'une main et utilise l'autre sur son propre sein.", ["Hylee", "Plus fort. Oui, comme ça. Je te dirai quand changer.", "determined"]],
        ["Vous lui rendez son audace sous la couverture. Hylee guide le mouvement, réclame ce qu'elle veut et transforme chaque silence en rapprochement."],
      ),
      V(
        ["Hylee vous attire à califourchon sur sa cuisse, puis vient chercher la vôtre. Elle veut sentir vos deux corps travailler, pas choisir une seule personne à combler."],
        ["Vos bassins se pressent l'un contre l'autre pendant que vos mains alternent. Hylee modifie l'angle, vous fait asseoir et vient sur vos genoux pour reprendre le rythme."],
        ["Hylee place sa cuisse contre votre vulve et frotte la sienne sur la vôtre. Vos clitoris trouvent tour à tour la pression de l'autre ; elle vous tient par les hanches et change la cadence dès qu'elle entend votre souffle céder."],
        ["Elle réorganise vos jambes sous la couverture avec une impatience joyeuse. La clairière s'efface derrière le tissu tandis que vos mouvements deviennent le seul rythme qui compte."],
      ),
      A("Hylee vous assied contre le large tronc et vient sur vos cuisses, poitrine contre poitrine. Elle mène le mouvement, puis vous confie brusquement ses hanches pour voir ce que vous ferez de cette place.", "La paroi de la coupe oubliée se couvre une seule fois de cristaux fins. Leur reflet court sur sa peau avant de fondre."),
      V(
        ["Vous atteignez le plaisir dans un échange de caresses fermes. Hylee vous regarde céder, sourit de l'avoir provoqué puis se laisse conduire à son tour sans perdre sa voix."],
        ["Son bassin frotte le vôtre pendant que vos doigts travaillent chacune le plaisir de l'autre. Hylee jouit avec un cri bref, reprend aussitôt votre clitoris et vous suit jusqu'à votre propre secousse."],
        ["Hylee maintient sa vulve contre la vôtre, une main sur votre clitoris et l'autre agrippée à votre hanche. Elle vous fait jouir sous elle, observe votre visage avec une fierté ouverte, puis réclame vos doigts en elle et atteint son orgasme sans ralentir ses propres caresses."],
        ["Hylee garde la direction sous la couverture jusqu'à ce que vos voix se brisent. Le récit revient quand elle s'effondre contre vous, encore satisfaite d'avoir vu chaque effet qu'elle cherchait."],
      ),
      A("Elle s'allonge sur votre ventre, les yeux brillants et le sourire trop éveillé pour annoncer le sommeil.", ["Hylee", "J'aime te voir perdre tes phrases. Je crois que je vais recommencer juste pour vérifier.", "teasing"], "Sa main descend déjà lorsque vous éclatez de rire."),
      A("Plus tard, Hylee récupère la couverture tombée au sol et vous enveloppe avec elle, sans quitter vos bras.", ["Hylee", "J'avais peur d'en vouloir trop. Maintenant, j'ai surtout envie de te dire quand j'en veux encore.", "determined"], "Elle le dit d'un nouveau baiser, plus doux mais pas moins décidé."),
    ],
  },
  {
    id: "hylee-glade-homme-audacieuse", context: "date-hylee-glade", sex: "homme", mood: "audacieuse",
    text: "Suivre Hylee lorsqu'elle décide de prendre votre plaisir en main",
    detail: "Hylee assume son désir du corps masculin, mène, observe ses effets et réclame ensuite sa propre part.",
    chapters: [
      A("Dès que les feuillages cachent le sentier, Hylee vous saisit par le col et vous embrasse avant que le panier ait fini de se balancer à son bras. Elle le pose sans regarder puis presse vos mains contre ses hanches.", ["Hylee", "Je sais exactement pourquoi je t'ai demandé de rester. Si j'oublie une étape, j'en inventerai une autre.", "determined"]),
      A("Elle retire votre chemise en tirant dessus plutôt qu'en préservant les plis, puis vous ordonne en riant de sauver la sienne avant qu'elle traite sa propre robe de la même façon.", "Vous la déshabillez debout. Hylee ouvre votre ceinture, fait glisser votre pantalon et vous repousse sur la couverture avec une main au milieu du torse."),
      A("Hylee laisse tomber son dernier vêtement et vous offre un tour entier de son corps sans se couvrir. Elle suit votre regard, visiblement heureuse de l'arrêter sur elle.", "Elle dénude votre sexe, contemple votre érection puis la prend en main avec une assurance qui ne feint pas l'expérience universelle.", ["Hylee", "Je vais quand même écouter. Mais je veux commencer.", "determined"]),
      V(
        ["Assise entre vos jambes, Hylee parcourt votre torse et votre ventre de ses mains. Elle s'attarde sur chaque réaction, puis remonte vous embrasser pour en provoquer une autre."],
        ["Elle caresse votre érection d'une main lente tout en mordillant votre ventre. La manière dont vos hanches cherchent sa paume lui plaît ouvertement."],
        ["Hylee serre votre pénis à sa base, remonte jusqu'au gland humide et y fait tourner son pouce. Elle garde votre regard, accélère puis ralentit juste pour entendre votre protestation.", ["Hylee", "Voilà. Cette tête-là. Je voulais être sûre que je pouvais la refaire.", "teasing"]],
        ["Hylee disparaît sous la couverture avec votre plaisir entre ses mains. Le récit lui laisse la conduite et revient seulement lorsqu'elle remonte chercher votre bouche."],
      ),
      V(
        ["Vous la ramenez sur le dos. Hylee vous laisse prendre la place, mais guide aussitôt vos mains vers ses seins puis entre ses cuisses."],
        ["Votre bouche descend sur son ventre. Elle ouvre largement les jambes et vous demande de ne pas ralentir par politesse lorsqu'elle commence à bouger contre vous."],
        ["Vous ouvrez sa vulve de la langue et aspirez doucement son clitoris. Hylee appuie une main sur votre nuque, règle la pression de l'autre sur son sein et vous donne des indications courtes jusqu'à ce que ses cuisses tremblent."],
        ["Hylee vous montre ce qu'elle réclame sous la couverture. Votre bouche et vos mains suivent sa franchise jusqu'à ce que sa voix perde sa netteté."],
      ),
      V(
        ["Elle vous fait asseoir et vient à califourchon sur vous. Ses hanches testent la proximité pendant qu'elle garde vos mains sur elle."],
        ["Hylee frotte sa chaleur le long de votre sexe, vous embrasse puis change de position pour prendre appui sur ses pieds et décider de chaque mouvement."],
        ["Elle fait glisser votre pénis entre les lèvres humides de sa vulve, insiste sur son clitoris puis guide le gland à son entrée. Hylee descend lentement sur vous, s'arrête une fois pour ajuster l'angle et reprend jusqu'à vous accueillir entièrement."],
        ["Hylee s'installe sur vous sous la couverture et choisit une cadence qui efface le reste de la clairière. Le récit n'impose ni image ni détail au mouvement qu'elle mène."],
      ),
      A("Hylee vous chevauche, les mains appuyées sur votre poitrine. Elle ralentit pour observer votre visage, sourit quand vous tentez de suivre ses hanches et repart avec une amplitude plus ferme.", "Une mince pellicule de givre saisit la baie oubliée près du panier. C'est le seul débordement de magie ; toute son attention reste sur l'effet de son corps."),
      V(
        ["Hylee mène vos mouvements jusqu'au plaisir, puis reste assise contre vous et accueille votre étreinte sans abandonner la place qu'elle a choisie."],
        ["Elle travaille son clitoris pendant qu'elle bouge sur vous. Son orgasme la fait se contracter et s'appuyer contre votre torse ; elle repart plus lentement jusqu'à sentir votre propre abandon."],
        ["Votre pénis coulisse en elle pendant qu'Hylee frotte son clitoris d'une main. Elle jouit au-dessus de vous, maintient ses hanches serrées puis reprend des mouvements courts et profonds jusqu'à votre orgasme, attentive à chaque secousse qu'elle provoque.", ["Hylee", "Oui. Je voulais te sentir arriver comme ça.", "determined"]],
        ["Ses hanches gardent la direction sous la couverture jusqu'à ce que le plaisir vous emporte. Quand la lumière revient, Hylee est encore sur vous, le sourire ouvert par ce qu'elle a vu et ressenti."],
      ),
      A("Hylee ne quitte pas tout de suite vos cuisses. Elle pose les avant-bras sur votre poitrine et vous regarde reprendre votre souffle avec une satisfaction sans détour.", ["Hylee", "Je pourrais prétendre que j'ai improvisé. Mais non. J'espérais vraiment te faire cet effet.", "teasing"]),
      A("Elle finit par rouler contre votre côté, récupère un morceau de couverture et laisse une jambe sur les vôtres.", ["Hylee", "La prochaine fois, tu pourras essayer de mener. J'ai dit essayer.", "teasing"], "Vous partagez le dernier fruit pendant que le soir gagne la clairière."),
    ],
  },
  {
    id: "hylee-lake-femme-joueuse", context: "date-hylee-lake", sex: "femme", mood: "joueuse",
    text: "Inventer avec Hylee une revanche où perdre l'équilibre devient le but",
    detail: "Le souvenir du lac nourrit un jeu physique entre deux femmes : appuis détournés, rires et initiatives échangées.",
    chapters: [
      A("Hylee trace du doigt une ligne imaginaire dans l'herbe, comme celle qui bordait la piste. Elle vous défie de l'embrasser sans poser le pied de l'autre côté.", "Vous respectez la règle trois secondes. Hylee accroche votre cheville avec la sienne et vous attire hors de la ligne contre elle.", ["Hylee", "Tu as perdu. J'avais oublié de dire que je trichais.", "teasing"]),
      A("Vous tentez de lui retirer sa veste pendant qu'elle garde un pied levé. Hylee tient jusqu'à la seconde manche, tombe assise sur les manteaux et vous entraîne avec elle en riant.", "Elle défait votre haut depuis cette position, puis se redresse pour vous laisser ouvrir sa robe. Chaque vêtement devient un nouvel appui à contourner plutôt qu'une étape solennelle."),
      A("Hylee se tient nue sur la rive, les pieds bien à plat cette fois. Elle vous laisse découvrir ses seins, ses hanches et les nuances claires de sa peau, puis pivote pour offrir son dos à votre regard.", ["Hylee", "Je tiens beaucoup mieux sans lames. À toi."], "Elle retire votre dernier vêtement et contemple votre corps de femme avec un sourire curieux qui descend jusqu'entre vos cuisses."),
      V(
        ["Hylee explore vos épaules et vos seins avec ses paumes encore fraîches. Elle réchauffe chaque contact de sa bouche et s'amuse à vous faire deviner lequel viendra ensuite."],
        ["Sa bouche glisse de votre poitrine à votre ventre. Ses doigts longent l'intérieur de vos cuisses ; elle alterne le frais de sa paume et la chaleur de ses lèvres jusqu'à vous faire bouger."],
        ["Hylee ouvre votre vulve d'une main et fait passer un doigt humide autour de votre clitoris. Elle essaie un cercle, une pression plus directe puis un mouvement lent de haut en bas, attentive à celui qui fait glisser vos hanches vers elle.", ["Hylee", "Celui-là t'a fait oublier tes pieds. Je le garde.", "teasing"]],
        ["Sous la couverture, Hylee suit votre corps sans modèle. Ses questions, vos réponses et ses rires étouffés remplacent les gestes que le récit laisse hors champ."],
      ),
      V(
        ["Vous la faites reculer sur les manteaux et découvrez à votre tour les endroits où sa peau perd sa fraîcheur. Hylee vous aide à déplacer sa jambe plutôt que d'attendre votre choix."],
        ["Votre bouche parcourt ses seins puis son ventre. Elle place votre main entre ses cuisses, serre vos doigts contre elle et vous montre par un mouvement de bassin la pression qu'elle veut."],
        ["Vous glissez deux doigts le long de sa vulve humide, puis votre langue sur son clitoris. Hylee écarte davantage les jambes et invente de compter vos passages ; elle perd le compte au quatrième et vous demande de recommencer depuis le début.", ["Hylee", "C'est une vérification très sérieuse.", "teasing"]],
        ["Vous lui rendez son exploration sous les pans croisés des manteaux. Hylee déplace elle-même vos mains et cesse vite de compter quoi que ce soit."],
      ),
      V(
        ["Hylee propose de reprendre la figure à deux du lac, allongées cette fois. Vos jambes se croisent et vos bassins cherchent ensemble un appui qui n'exige aucun équilibre."],
        ["Elle se tourne tête-bêche, sa cuisse contre votre joue et la vôtre contre la sienne. Chaque caresse devient une riposte joyeuse."],
        ["Hylee referme sa bouche sur votre clitoris pendant que votre langue travaille le sien. Quand elle perd le rythme, elle utilise ses doigts sur vous ; vous répondez de la même façon et vos corps alternent bouche, paume et bassin sans désigner de gagnante."],
        ["Vos jambes s'organisent sous la couverture dans une position qu'Hylee baptise trop vite. Le nom se perd avec vos souffles lorsque le récit vous laisse poursuivre seules."],
      ),
      A("Hylee vous ramène côte à côte et presse sa vulve contre votre cuisse pendant qu'elle offre la sienne à votre bassin. Elle change deux fois d'appui, non par hésitation mais parce que chaque solution lui donne une nouvelle idée.", "La boucle humide d'une lame oubliée se couvre d'un peu de givre près de la pierre. Hylee ne détourne pas les yeux de vous."),
      V(
        ["Vos mains et vos cuisses vous conduisent au plaisir dans un désordre heureux. Hylee rit contre votre bouche lorsque vos deux corps tremblent presque ensemble."],
        ["Hylee frotte son clitoris contre votre cuisse tandis que ses doigts accélèrent sur le vôtre. Elle jouit en vous serrant, garde sa main en mouvement et vous accompagne jusqu'à votre propre abandon."],
        ["Vos vulves se rencontrent entre vos jambes croisées. Hylee trouve l'angle qui presse vos clitoris, maintient la cadence malgré ses soupirs et vous fait jouir contre elle ; vos doigts entrent ensuite en elle pendant qu'elle se frotte à votre paume jusqu'à son orgasme.", ["Hylee", "Égalité. Mais une vraie, cette fois.", "teasing"]],
        ["La couverture cache la fin de votre revanche. Lorsque le récit revient, Hylee a une jambe sur votre taille et le sourire essoufflé de quelqu'un qui ne réclame plus de décompte."],
      ),
      A("Hylee examine vos jambes mêlées comme une figure particulièrement réussie. Elle tente de les démêler, change d'avis et pose sa joue contre votre épaule.", ["Hylee", "On devrait donner un nom à celle-là. Plus tard. Je refuse de réfléchir maintenant.", "soft"]),
      A("Les bottes restent dans l'herbe près de la pierre. Hylee tire un manteau jusqu'à vos épaules et vous promet une revanche sur la glace, à condition que celle de la rive puisse recommencer avant.", ["Hylee", "Ici, tomber est beaucoup plus agréable.", "teasing"]),
    ],
  },
  {
    id: "hylee-lake-homme-joueuse", context: "date-hylee-lake", sex: "homme", mood: "joueuse",
    text: "Jouer avec Hylee à celui qui fera perdre pied à l'autre",
    detail: "Hylee détourne les leçons du lac pour explorer un homme, tester ses réactions et réclamer une revanche équitable.",
    chapters: [
      A("Hylee pose deux doigts sur votre poitrine et annonce que chacun a droit à trois gestes pour faire reculer l'autre jusqu'aux manteaux. Elle commence par un baiser qui vous coûte immédiatement un pas.", ["Hylee", "Un. Je ne savais pas si ça marcherait aussi bien.", "teasing"], "Son deuxième geste glisse déjà sous votre chemise."),
      A("Vous lui faites perdre un pas en ouvrant sa robe. Elle riposte en défaisant votre ceinture, se prend dans une manche et refuse que cet incident compte contre elle.", "Les vêtements forment une courte piste dans l'herbe. Hylee vous pousse sur les manteaux au dernier tour, puis grimpe à genoux au-dessus de vous pour annoncer sa victoire."),
      A("Elle se redresse nue, assise sur vos cuisses. Son assurance vacille sous votre regard mais revient quand elle voit votre érection apparaître ; Hylee suit cette réaction jusqu'à votre visage.", ["Hylee", "Je crois que j'ai trouvé un meilleur moyen de compter les points."], "Elle referme la main autour de vous, curieuse et ravie de la réponse immédiate."),
      V(
        ["Hylee parcourt votre torse et votre ventre, bouche après paume. Elle vérifie les muscles qui se tendent quand elle se penche et vous demande lequel de ses gestes vous déstabilise le plus."],
        ["Sa main enveloppe votre érection avec une lenteur calculée. Elle vous embrasse juste au moment où sa paume remonte, puis recommence pour voir si l'effet se répète."],
        ["Hylee fait glisser sa main le long de votre pénis, tourne son pouce autour du gland et recueille l'humidité qui s'y forme. Elle prend ensuite le gland entre ses lèvres, vous regarde perdre votre souffle et sourit avant de descendre davantage.", ["Hylee", "Deux points. Au moins.", "teasing"]],
        ["Hylee disparaît sous la couverture pour découvrir ce qui vous fait perdre pied. Le récit abandonne le décompte à vos souffles et revient lorsqu'elle remonte contre vous."],
      ),
      V(
        ["Vous l'allongez et récupérez un point en embrassant l'endroit sous son oreille qui lui coupe son rire. Hylee vous indique ensuite, sans gêne jouée, où elle espère votre prochain geste."],
        ["Votre main se glisse entre ses cuisses. Elle presse sa vulve contre vos doigts et se cambre lorsqu'ils remontent vers son clitoris."],
        ["Votre langue rejoint sa vulve ouverte. Hylee guide votre bouche sur son clitoris, vous arrête pour changer l'angle et vous ramène aussitôt entre ses jambes dès que le nouveau contact la fait gémir.", ["Hylee", "Celui-là vaut plus que trois. Je réviserai les règles après.", "determined"]],
        ["Vous lui rendez le jeu à l'abri des manteaux croisés. Ses hanches et ses indications directes vous disent tout ce que le récit ne montre pas."],
      ),
      V(
        ["Hylee vous fait rouler sur le côté et glisse une jambe autour de vos hanches. Elle veut reprendre le mouvement du lac sans qu'aucun de vous doive rester vertical."],
        ["Elle frotte sa chaleur contre votre sexe puis alterne sa main sur vous et la vôtre entre ses cuisses, changeant la règle chaque fois que l'un de vous approche trop vite du plaisir."],
        ["Hylee reprend votre pénis dans sa bouche jusqu'à le rendre dur contre sa langue, puis vient à califourchon. Elle guide le gland le long de sa vulve, insiste sur son clitoris et vous accueille lorsqu'elle a choisi l'angle qui lui plaît."],
        ["Sous la couverture, elle vous attire dans une position qui ne ressemble plus à aucune leçon de patinage. Le récit se retire pendant que votre jeu trouve un rythme plus pressant."],
      ),
      A("Hylee se balance sur vous, les mains sur vos épaules, puis vous fait vous asseoir pour que vos corps restent serrés. Elle rit lorsque le changement manque de vous faire basculer tous les deux.", "Une trace de givre dessine un demi-cercle sur la boucle d'une botte. Le phénomène s'arrête là ; Hylee reprend aussitôt le mouvement de ses hanches."),
      V(
        ["Vos mouvements vous conduisent ensemble au plaisir. Hylee s'accroche à vous, revient vous embrasser et refuse de déclarer qui a cédé le premier."],
        ["Elle travaille son clitoris contre votre bassin pendant qu'elle monte et descend sur vous. Son orgasme brise le décompte ; elle poursuit jusqu'à sentir le vôtre répondre sous elle."],
        ["Hylee chevauche votre pénis, presse son clitoris entre ses doigts et accélère chaque fois que votre souffle se défait. Elle jouit en se contractant autour de vous, puis reprend des mouvements courts jusqu'à votre orgasme et s'immobilise seulement quand vos mains cessent de trembler."],
        ["Les manteaux cachent le dernier échange de votre défi. Quand la scène revient, Hylee est étendue en travers de vous, trop essoufflée pour inventer un résultat crédible."],
      ),
      A("Hylee lève trois doigts, essaie de compter vos points puis replie la main sur votre poitrine.", ["Hylee", "J'étais devant jusqu'au moment où j'ai complètement oublié le jeu. Ça devrait compter comme une victoire différente.", "teasing"], "Vous l'embrassez pour interrompre la contestation."),
      A("Elle pousse les bottes du bout du pied, revient sous un manteau et cale sa tête sur votre bras.", ["Hylee", "Sur la glace, tu me rattrapais quand je tombais. Sur cette rive aussi. Je préfère quand même la version sans chaussures.", "soft"]),
    ],
  },
  {
    id: "hylee-lake-femme-tendre", context: "date-hylee-lake", sex: "femme", mood: "tendre",
    text: "Réchauffer ses mains et laisser Hylee reprendre chaque geste à son rythme",
    detail: "Une intimité attentive entre deux femmes où la nervosité d'Hylee reste visible sans jamais décider à sa place.",
    chapters: [
      A("Hylee regarde ses mains encore fraîches et les frotte l'une contre l'autre. Vous les prenez, soufflez sur ses doigts et les gardez contre votre cou.", ["Hylee", "Je peux attendre qu'elles se réchauffent."], ["{player}", "Ou tu peux commencer là."], "Elle pose un baiser sous son pouce, puis un autre sur votre bouche."),
      A("Elle enlève votre veste avec précaution et vous laisse retirer la sienne. La robe reste accrochée une seconde à son poignet ; Hylee rit nerveusement, la libère et revient poser votre main sur sa hanche nue.", "Vous vous déshabillez face à face, sans détourner systématiquement les yeux. Chaque fois qu'elle rougit, Hylee reprend elle-même le geste interrompu."),
      A("Nue, elle s'assied sur les manteaux et laisse ses genoux s'écarter juste assez pour que vous vous placiez entre eux. Son regard parcourt votre poitrine découverte, descend et remonte aussitôt.", ["Hylee", "Je regarde trop vite. Je vais recommencer."], "Elle le fait lentement, puis retire votre dernier vêtement de ses propres mains."),
      V(
        ["Ses doigts réchauffés suivent votre clavicule, vos seins et vos flancs. Hylee pose une question quand elle hésite, mais sa main continue d'explorer pendant qu'elle écoute."],
        ["Elle embrasse vos seins puis votre ventre. Une paume glisse entre vos cuisses et reste là, chaude maintenant, jusqu'à ce que vous veniez chercher la pression."],
        ["Hylee écarte doucement les lèvres de votre vulve et trouve votre humidité. Elle caresse votre clitoris d'un doigt, observe votre respiration puis recommence avec deux doigts plus fermes.", ["Hylee", "Je sens quand tu te rapproches. Dis-moi seulement si je dois changer.", "soft"]],
        ["Hylee vous découvre à l'abri de la couverture. Ses mains se réchauffent sur vous, guidées par vos mots simples et les mouvements que vous ne retenez plus."],
      ),
      V(
        ["Vous vous agenouillez près d'elle et suivez ses épaules, ses seins puis son ventre. Hylee pose votre main plus bas avec une hésitation brève, choisie plutôt que subie."],
        ["Vos doigts glissent entre ses cuisses. Elle serre votre poignet une seconde, non pour l'arrêter mais pour placer votre paume contre l'endroit exact qu'elle veut sentir."],
        ["Vous goûtez sa vulve et remontez sur son clitoris. Hylee ouvre davantage les jambes, vous guide d'une main dans vos cheveux et demande un doigt en elle lorsque la chaleur devient plus pressante.", ["Hylee", "Oui. Là, je n'ai plus froid du tout.", "soft"]],
        ["Vous poursuivez sous un pan de manteau, attentive à ses reprises et à ses demandes. Hylee vous rapproche au lieu d'attendre que vous deviniez."],
      ),
      V(
        ["Hylee vous invite à vous allonger sur le côté. Elle place vos jambes comme elle plaçait vos pieds sur la glace, puis rit doucement de son propre sérieux."],
        ["Face à face, vos cuisses se mêlent et vos mains alternent entre vos seins et vos sexes. Hylee garde votre regard chaque fois qu'un mouvement la surprend."],
        ["Hylee glisse deux doigts en vous pendant que votre main caresse sa vulve. Vous trouvez son clitoris ; elle ajuste sa hanche, vous offre un rythme et travaille le vôtre avec la même attention, vos bouches à portée d'un souffle."],
        ["La couverture se referme sur vos corps couchés face à face. Le récit laisse les caresses devenir plus intimes tandis qu'Hylee continue de choisir, demander et répondre."],
      ),
      A("Vos gestes prennent une cadence plus ferme. Hylee accroche une jambe autour de la vôtre, revient contre votre paume et vous demande de ne plus ralentir chaque fois qu'elle rougit.", "La boucle métallique d'une lame blanchit brièvement de froid près de l'eau. Aucun autre signe magique ne détourne la scène de vos corps."),
      V(
        ["Le plaisir vous traverse presque ensemble. Hylee garde ses doigts en mouvement jusqu'à sentir votre corps se détendre, puis vous guide encore sur elle et cède à son tour."],
        ["Vos doigts accélèrent sur vos clitoris. Hylee jouit contre votre main, reprend son souffle sans retirer la sienne et vous mène au plaisir en répétant le mouvement qu'elle a appris."],
        ["Votre main entre en Hylee pendant que son pouce presse votre clitoris. Elle jouit autour de vos doigts, le visage contre le vôtre ; sa main reprend aussitôt une cadence plus ferme sur votre vulve jusqu'à ce que votre orgasme vous serre contre elle."],
        ["Les mouvements se poursuivent hors du regard du récit. La lumière revient sur Hylee encore face à vous, une main immobile entre vos cuisses et l'autre serrée dans la vôtre."],
      ),
      A("Hylee souffle sur vos doigts comme vous l'aviez fait au début, mais ils sont chauds maintenant. Elle les embrasse un par un, rougit de son propre geste et ne le retire pas.", ["Hylee", "Je pourrais avoir encore un peu peur la prochaine fois. Ça ne m'empêchera pas de savoir où poser mes mains.", "soft"]),
      A("Vous restez couchées pendant que les bottes attendent dans l'herbe. Hylee écoute une goutte tomber du cuir sur une feuille, puis se rapproche pour que le son n'occupe plus tout le silence.", ["Hylee", "Reste jusqu'à ce que le soleil disparaisse derrière les saules. Après, on verra.", "soft"]),
    ],
  },
  {
    id: "hylee-lake-homme-tendre", context: "date-hylee-lake", sex: "homme", mood: "tendre",
    text: "Rester face à Hylee pendant qu'elle transforme sa prudence en choix",
    detail: "Une progression tendre avec un homme : mains réchauffées, découverte mutuelle et mouvements guidés par Hylee.",
    chapters: [
      A("Hylee garde votre main entre les siennes et vérifie vos doigts comme elle vérifiait les boucles des lames. Elle lève les yeux, embarrassée par son propre réflexe.", ["Hylee", "Je n'ai rien à réparer. J'avais juste besoin de commencer par quelque chose que je savais faire."], "Elle porte votre main à sa joue, puis vient l'embrasser avant de la rendre."),
      A("Vous retirez vos vestes humides. Hylee ouvre votre chemise, s'arrête après deux boutons et reprend en constatant que vous ne bougez pas à sa place.", "Elle vous laisse défaire sa robe, mais retire elle-même le tissu pris sous sa cuisse. Sa main revient aussitôt sur votre ventre nu, plus curieuse que craintive."),
      A("Hylee se tient nue entre vos jambes. Elle rougit lorsque vous regardez son corps entier, puis pose vos paumes sur ses hanches au lieu de se couvrir.", "Elle ouvre votre pantalon et découvre votre érection. Son souffle hésite ; ses doigts, eux, viennent en suivre la forme avec une douceur décidée.", ["Hylee", "Tu me dis si je fais quelque chose que tu n'aimes pas. Pour le reste, laisse-moi essayer.", "determined"]),
      V(
        ["Elle parcourt votre torse, votre ventre et vos hanches, réchauffant ses mains sur votre peau. Hylee écoute vos réactions et recommence les gestes qui vous rapprochent."],
        ["Hylee prend votre sexe dans sa paume et le caresse lentement. Elle observe la tension de votre ventre, puis revient vous embrasser sans retirer sa main."],
        ["Ses doigts entourent votre pénis et remontent jusqu'au gland. Hylee étale l'humidité du pouce, change de pression quand vos hanches répondent et se penche pour goûter l'extrémité avant de reprendre le mouvement de sa main."],
        ["Hylee vous découvre sous les manteaux, sans supposer ce que vous aimez. Le récit laisse ses questions et vos réponses guider une exploration qui lui appartient pleinement."],
      ),
      V(
        ["Vous embrassez son cou, ses seins et son ventre. Hylee vous arrête une seconde pour replier un manteau sous sa nuque, puis vous ramène exactement là où vous étiez."],
        ["Votre main descend entre ses cuisses. Elle ouvre les jambes et presse sa vulve contre votre paume, montrant elle-même le mouvement dont elle a envie."],
        ["Vos doigts longent les lèvres humides de sa vulve et trouvent son clitoris. Hylee guide deux cercles, vous laisse continuer puis vous demande un doigt en elle ; elle accompagne l'entrée d'un mouvement de bassin qui ne doit rien à l'attente passive."],
        ["Vous découvrez Hylee sous la couverture. Elle replace votre main quand elle en a envie et vous ramène contre elle chaque fois que le récit s'éloigne."],
      ),
      V(
        ["Hylee vous attire sur le côté, une jambe passée autour de vos hanches. Elle veut rester face à vous et pouvoir interrompre un mouvement seulement pour reprendre votre bouche."],
        ["Elle frotte sa chaleur contre votre sexe, puis guide vos hanches plus près. La proximité devient plus ferme sans que son regard quitte le vôtre."],
        ["Hylee fait glisser votre pénis sur sa vulve, presse le gland contre son clitoris puis le guide à son entrée. Elle vous accueille lentement sur le côté, ajuste elle-même sa jambe et reprend le mouvement lorsque la profondeur lui convient.", ["Hylee", "Comme ça. Je peux bouger aussi.", "soft"]],
        ["Sous la couverture, Hylee choisit une union qui vous garde face à face. Le récit se retire pendant qu'elle règle l'angle et le rythme par ses propres gestes."],
      ),
      A("Hylee roule légèrement ses hanches contre vous, d'abord avec prudence puis avec une régularité qu'elle trouve elle-même. Votre main reste entre vos bassins, là où elle l'a placée.", "Un souffle froid trouble une fois la vitre ; il disparaît sans neige. Hylee ne quitte pas votre visage des yeux."),
      V(
        ["Le plaisir la traverse dans vos bras. Hylee vous garde près d'elle, reprend ses mouvements après la secousse et vous accompagne jusqu'à votre propre abandon."],
        ["Votre main travaille son clitoris pendant que vos corps restent unis. Elle jouit contre vous, puis ses hanches continuent avec une douceur ferme jusqu'à sentir votre orgasme."],
        ["Votre pénis coulisse en elle pendant que vos doigts pressent son clitoris. Hylee jouit en serrant sa jambe autour de vous ; elle reprend, plus lente mais volontaire, et vous conduit à l'orgasme sans rompre le contact de vos fronts."],
        ["La couverture cache la montée finale. Lorsque le récit revient, Hylee respire contre votre bouche et garde encore une jambe autour de vos hanches."],
      ),
      A("Elle reste face à vous, caresse votre joue puis regarde ses propres doigts comme s'ils venaient de lui apprendre quelque chose de très concret.", ["Hylee", "J'ai demandé, j'ai changé de place et j'ai recommencé. C'était moins compliqué que toutes les phrases que j'avais préparées.", "soft"]),
      A("Hylee tire un manteau sur vos épaules et laisse les bottes seules près de la pierre.", ["Hylee", "Si tu bouges pour vérifier les chaussettes, je te ramène ici. Elles survivront.", "teasing"], "Vous restez enlacés jusqu'à ce que le ciel s'assombrisse entre les saules."),
    ],
  },
  {
    id: "hylee-lake-femme-audacieuse", context: "date-hylee-lake", sex: "femme", mood: "audacieuse",
    text: "Laisser Hylee reprendre l'élan du lac et mener une autre femme",
    detail: "Hylee affirme ce qu'elle veut, utilise les appuis appris au lac et savoure franchement les réactions qu'elle provoque.",
    chapters: [
      A("Hylee pose le sac de lames, vous fait pivoter contre le tronc d'un saule et cale un pied entre les vôtres comme au départ d'une course.", ["Hylee", "Cette fois, je sais comment m'arrêter. Je n'en ai juste pas envie.", "determined"], "Elle vous embrasse avec assez d'élan pour faire glisser votre veste de votre épaule."),
      A("Elle retire votre veste puis votre haut en vous gardant contre l'écorce. Vous ouvrez sa robe ; Hylee en sort d'un mouvement et vous entraîne jusqu'aux manteaux par la ceinture.", "Elle s'agenouille pour défaire votre dernier vêtement, vous regarde pendant que le tissu descend puis se relève nue à son tour, sans demander à la lumière de l'épargner."),
      A("Hylee prend vos mains et les pose sur ses seins. Elle suit votre regard sur son corps avec une fierté tranquille, puis recule pour découvrir le vôtre de la même façon.", ["Hylee", "Je te veux entière. Pas seulement la partie qui sait me rattraper."], "Son regard s'attarde entre vos cuisses avant que sa paume le rejoigne."),
      V(
        ["Hylee vous embrasse debout, ses mains fermes sur vos seins et vos hanches. Elle apprécie chaque frisson et vous le dit sans diminuer la pression."],
        ["Sa bouche descend sur vos seins. Elle glisse une cuisse entre les vôtres, vous fait frotter contre elle et sourit lorsque vous perdez l'appui de l'arbre."],
        ["Hylee écarte votre vulve contre sa cuisse, recueille votre humidité puis presse votre clitoris de deux doigts. Elle vous maintient par la hanche pendant que votre bassin suit la cadence qu'elle impose.", ["Hylee", "Oui. Laisse tes jambes trembler. Je te tiens.", "determined"]],
        ["Elle vous guide sous les manteaux et prend le temps de faire céder vos appuis un à un. Le récit laisse vos réactions lui confirmer le chemin."],
      ),
      V(
        ["Vous la repoussez sur les manteaux et Hylee accueille ce renversement avec un rire franc. Elle ouvre elle-même les jambes et réclame votre bouche plutôt qu'une lente attente."],
        ["Votre langue suit son ventre puis la chaleur entre ses cuisses. Elle vous indique une pression plus ferme d'une main sur votre nuque."],
        ["Vous léchez sa vulve ouverte et revenez sur son clitoris avec un rythme soutenu. Hylee relève les hanches, glisse deux doigts en elle devant vous puis vous confie le mouvement pendant qu'elle tire votre bouche plus près."],
        ["Vous lui rendez chaque provocation sous la couverture. Hylee garde la voix assez nette pour vous demander exactement ce qu'elle veut."],
      ),
      V(
        ["Elle vous fait asseoir contre une pierre plate et vient sur une de vos cuisses. Sa propre cuisse se glisse entre les vôtres ; Hylee construit un appui où chacune peut bouger."],
        ["Vos bassins frottent alternativement contre vos cuisses. Hylee accélère, vous arrête d'un baiser puis repart avec une prise différente sur vos hanches."],
        ["Hylee presse sa vulve contre votre cuisse pendant que la sienne stimule votre clitoris. Vos doigts se glissent entre vos corps, entrent tour à tour en vous et en elle ; elle règle la cadence avec ses hanches et refuse de choisir laquelle cédera d'abord."],
        ["Sous la couverture, elle organise vos jambes comme une nouvelle figure, puis laisse le désir en défaire l'ordre. Le récit s'éloigne devant votre cadence partagée."],
      ),
      A("Hylee vous renverse finalement sur les manteaux et vient frotter sa vulve contre la vôtre, les mains serrées aux vôtres au-dessus de l'herbe. Elle vous regarde vaciller avec une joie assumée.", "Le métal des lames tinte une fois quand une mince croûte de givre se fend sur la boucle. La magie n'intervient plus."),
      V(
        ["Vos corps atteignent le plaisir dans la même poussée. Hylee garde vos mains liées et rit contre votre bouche lorsque vos jambes cessent enfin de chercher un appui."],
        ["Vos clitoris se pressent l'un contre l'autre. Hylee maintient l'angle jusqu'à vous sentir jouir, puis guide votre main sur elle et atteint son propre plaisir avec un cri bref."],
        ["Hylee frotte sa vulve humide contre la vôtre, vos clitoris saisis dans une pression régulière. Votre orgasme la fait accélérer ; vous glissez deux doigts en elle et travaillez son clitoris du pouce jusqu'à ce qu'elle jouisse au-dessus de vous, incapable de soutenir son sourire.", ["Hylee", "Je t'avais dit que je te tenais.", "determined"]],
        ["Les manteaux referment la scène sur l'élan de vos corps. Quand ils s'ouvrent de nouveau, Hylee est étendue sur vous, vos mains encore jointes dans l'herbe."],
      ),
      A("Elle descend de votre corps sans aller plus loin que votre côté. Sa main parcourt votre cuisse encore tremblante et elle sourit de l'effet sans feindre la modestie.", ["Hylee", "J'aime ça. Te regarder quand tu ne peux plus faire semblant de tenir debout.", "teasing"]),
      A("Hylee range les lames sans remettre ses vêtements, puis revient sous les manteaux avec une décision tout aussi nue.", ["Hylee", "Le lac aura sa revanche. Toi, tu peux l'avoir maintenant si tu en as encore la force.", "determined"]),
    ],
  },
  {
    id: "hylee-lake-homme-audacieuse", context: "date-hylee-lake", sex: "homme", mood: "audacieuse",
    text: "Confier l'élan à Hylee et la regarder assumer ce qu'elle vous fait",
    detail: "Une route directe sur la rive où Hylee mène le corps masculin, change d'appui et nomme son désir.",
    chapters: [
      A("Hylee laisse tomber le sac de lames, vous pousse doucement contre un saule et glisse ses deux mains sous votre chemise.", ["Hylee", "J'ai passé le dernier tour à imaginer ça. Tu peux me dire non, mais ne me demande pas de faire semblant d'avoir seulement froid.", "determined"], "Votre réponse la ramène aussitôt contre votre bouche."),
      A("Elle tire votre chemise hors de votre pantalon et la fait passer par-dessus votre tête. Vous ouvrez sa robe ; Hylee finit elle-même les attaches, puis pose votre main sur son sein tandis que l'autre s'occupe de votre ceinture.", "Ses vêtements tombent près des bottes. Elle vous déshabille entièrement et vous guide jusqu'aux manteaux sans lâcher votre sexe déjà dur."),
      A("Nue face à vous, Hylee ne cherche pas à réduire son corps au regard que vous portez. Elle vous laisse voir ses seins, ses hanches et sa peau marquée de clair, puis s'approche assez pour que votre érection touche son ventre.", ["Hylee", "Je veux sentir ce que je te fais. Et je veux que tu me fasses répondre aussi.", "determined"]),
      V(
        ["Hylee vous fait asseoir, parcourt votre torse et embrasse votre ventre. Sa main descend avec assurance et ralentit seulement pour écouter votre réaction."],
        ["Elle referme les doigts sur votre érection, la caresse contre sa paume et apprécie ouvertement la façon dont votre ventre se tend."],
        ["Hylee serre votre pénis, remonte jusqu'au gland et fait tourner sa langue autour avant de le prendre dans sa bouche. Elle alterne profondeur et pression de sa main, s'arrête juste avant que vous perdiez le contrôle et remonte avec un sourire sans excuse.", ["Hylee", "Pas encore. Je veux être avec toi quand ça arrive.", "determined"]],
        ["Hylee prend votre plaisir en main sous la couverture, le mène près de la limite puis revient vers votre bouche. Le récit respecte la précision qu'elle choisit de garder entre vous."],
      ),
      V(
        ["Vous la renversez sur les manteaux. Hylee ouvre les cuisses, saisit votre poignet et vous place sans détour contre sa chaleur."],
        ["Votre main caresse sa vulve pendant que votre bouche travaille ses seins. Elle vous demande davantage et accompagne vos doigts d'un bassin impatient."],
        ["Vous glissez deux doigts dans sa vulve humide et pressez son clitoris du pouce. Hylee prend votre rythme, le corrige d'un mouvement plus ferme puis vous attire entre ses jambes pour que votre langue remplace votre main.", ["Hylee", "Je te dirai quand j'en aurai assez. Ce n'est pas maintenant.", "determined"]],
        ["Vous répondez à sa franchise sous les pans croisés des manteaux. Hylee guide votre bouche et vos mains jusqu'à ce que ses mots se réduisent à votre prénom."],
      ),
      V(
        ["Hylee vous fait vous asseoir contre le tronc du saule et vient sur vos cuisses. Elle prend vos mains, les pose sur ses hanches et vous demande de la laisser choisir l'appui."],
        ["Elle frotte sa vulve contre votre sexe, change l'angle puis soulève son bassin pour vous guider plus près. Chaque décision vient d'un geste net."],
        ["Hylee fait glisser votre pénis le long de sa vulve, presse le gland contre son clitoris puis le place à son entrée. Elle descend sur vous avec une lenteur maîtrisée, ajuste la profondeur et commence à bouger sans quitter votre regard."],
        ["Sous la couverture, Hylee vous installe dans la position qu'elle a choisie et mène l'union jusqu'à ce que la lumière n'ait plus rien à ajouter."],
      ),
      A("Elle vous chevauche d'abord en mouvements longs, puis se penche pour vous embrasser et adopte une cadence plus courte qui la fait gémir contre votre bouche. Votre main rejoint son clitoris à sa demande.", "Une pellicule froide apparaît une seule fois sur la pierre humide, traversée par le reflet du lac. Hylee n'en fait aucun commentaire."),
      V(
        ["Hylee atteint le plaisir au-dessus de vous, garde vos mains sur elle et continue à bouger jusqu'à ce que votre corps la rejoigne dans la même étreinte."],
        ["Elle frotte son clitoris pendant que votre sexe reste en elle. Son orgasme serre vos hanches entre ses cuisses ; elle reprend, plus ferme, et vous mène jusqu'au vôtre."],
        ["Votre pénis coulisse profondément en Hylee tandis qu'elle presse son clitoris de deux doigts. Elle jouit en se contractant autour de vous, ralentit sans s'arrêter puis reprend jusqu'à votre orgasme, observant votre visage avec le plaisir franc d'en être la cause.", ["Hylee", "Oui. C'est ça que je voulais voir.", "determined"]],
        ["Le récit se retire pendant qu'Hylee garde la direction. Il revient après vos orgasmes, lorsqu'elle est encore assise sur vous et que vos respirations trouvent enfin la même mesure."],
      ),
      A("Hylee reste au-dessus de vous, les avant-bras posés sur votre poitrine. Elle suit du regard vos muscles encore tendus et dépose un baiser là où votre cœur frappe.", ["Hylee", "Je n'ai pas besoin de prétendre que ça m'a surprise. J'avais vraiment envie de te faire perdre pied.", "teasing"]),
      A("Elle glisse près de votre côté et tire un manteau sur vos jambes. Les bottes et les lames restent abandonnées près de la pierre.", ["Hylee", "Tout à l'heure, je serai peut-être gênée en les regardant. Maintenant, je préfère te regarder toi.", "soft"], "Elle recommence tandis que le soleil descend derrière les saules."),
    ],
  },
  {
    id: "hylee-home-femme-joueuse", context: "home-hylee", sex: "femme", mood: "joueuse",
    text: "Suivre les traces de dessert qu'Hylee transforme en nouveau jeu",
    detail: "Le rendez-vous au logis se prolonge entre table, photophore et chambre dans une exploration joueuse entre deux femmes.",
    chapters: [
      A("Hylee remarque une trace de coulis sur votre pouce, saisit votre poignet et la recueille avec la langue. Elle garde votre doigt entre ses lèvres une seconde de trop pour que le geste ressemble encore à du rangement.", ["Hylee", "Il restait du dessert. Maintenant, je dois vérifier ailleurs.", "teasing"], "Elle repère une tache inventée au coin de votre bouche et vient l'effacer d'un baiser."),
      A("Vous retirez son torchon, puis son haut pendant qu'elle ouvre le vôtre. Hylee tente de plier le premier vêtement sur la chaise, voit votre regard et le laisse tomber avec les autres.", "Sa robe glisse près de la table. Elle vous entraîne vers la chambre en reculant, s'arrête pour enlever votre manche coincée et rit contre votre épaule sans rompre l'élan."),
      A("La lumière du photophore atteint la chambre par la porte ouverte. Hylee s'y tient nue, une hanche appuyée au chambranle ; elle rougit quand vous la contemplez, puis tourne lentement pour ne rien soustraire.", ["Hylee", "Tu as regardé mon dessert avec moins d'attention. J'approuve."], "Elle vous dénude à son tour et suit votre corps de femme avec la même curiosité gourmande."),
      V(
        ["Hylee vous fait asseoir et parcourt vos épaules, vos seins et votre ventre avec des baisers légers. Elle annonce chaque nouvel endroit comme une trouvaille, puis abandonne les mots quand votre peau répond."],
        ["Sa bouche descend sur votre poitrine tandis que ses doigts explorent l'intérieur de vos cuisses. Elle goûte encore une pointe de baie sur votre peau et décide que le mélange lui plaît."],
        ["Hylee ouvre votre vulve du bout des doigts, y trouve votre humidité et la porte à sa langue avec un sourire. Elle revient sur votre clitoris, teste une pression circulaire puis se penche pour remplacer sa main par sa bouche.", ["Hylee", "Oui, c'est meilleur ici. Je ne dirai rien à la recette.", "teasing"]],
        ["Hylee se glisse sous la couverture pour poursuivre sa dégustation très peu culinaire. Le récit laisse vos réactions lui indiquer les endroits qu'elle veut retrouver."],
      ),
      V(
        ["Vous l'allongez et découvrez les zones où sa peau conserve encore la chaleur de la cuisine. Hylee vous vole un baiser chaque fois que votre main la surprend."],
        ["Votre bouche suit ses seins, son ventre puis l'intérieur de ses cuisses. Elle ouvre les jambes et réclame que vous goûtiez la trace de fruit qu'elle prétend y avoir cachée."],
        ["Vous léchez sa vulve humide et retrouvez son clitoris. Hylee relève le bassin, guide votre bouche d'une main et se met à rire lorsqu'elle admet qu'il n'y avait évidemment aucun coulis là.", ["Hylee", "La recherche reste utile. Continue.", "determined"]],
        ["Vous lui rendez son jeu sous le drap. Hylee cesse de plaisanter seulement le temps de vous guider avec des mots courts et des hanches très nettes."],
      ),
      V(
        ["Elle revient au-dessus de vous avec la petite cuillère récupérée sur la table, la pose aussitôt hors de portée et admet que vos mains sont beaucoup plus utiles."],
        ["Hylee se place tête-bêche, sa cuisse près de votre bouche et la vôtre près de la sienne. Vos caresses deviennent une dégustation réciproque sans ordre fixe."],
        ["Sa langue travaille votre clitoris pendant que vous ouvrez sa vulve de deux doigts. Hylee alterne bouche et main sur vous, puis presse son bassin contre vos lèvres ; chacune interrompt l'autre par une nouvelle idée avant de retrouver un rythme commun."],
        ["Sous la couverture, Hylee propose une position, en change et revient à la première. Le récit s'efface pendant que votre jeu trouve enfin le mouvement qu'aucune de vous ne veut abandonner."],
      ),
      A("Hylee vous ramène face à face, vos jambes entrelacées, et fait glisser une dernière goutte de miel sur votre épaule avant de la reprendre de la bouche. Vos mains poursuivent entre vos corps avec une cadence désormais plus précise.", "Un unique cristal se forme sur le bord de la petite cuillère laissée près du lit. La magie s'arrête à ce détail brillant."),
      V(
        ["Vos caresses vous font trembler l'une après l'autre. Hylee garde votre main sur elle jusqu'à son plaisir, puis reprend la sienne sur vous avec un rire devenu souffle."],
        ["Vos doigts accélèrent sur vos clitoris. Hylee jouit contre votre bouche, remonte aussitôt et vous mène au plaisir avec la main encore humide entre vos cuisses."],
        ["Vous gardez deux doigts en Hylee pendant qu'elle travaille votre clitoris de sa langue. Elle jouit autour de votre main, remonte sur vous et reprend votre vulve de ses doigts rapides jusqu'à votre orgasme, sa bouche ouverte contre la vôtre.", ["Hylee", "Je crois que le dessert est officiellement terminé.", "teasing"]],
        ["La couverture se referme sur la fin de votre jeu. Lorsque le récit revient, Hylee a du miel sur la joue, vos jambes entre les siennes et aucune intention de retourner à la cuisine."],
      ),
      A("Hylee récupère la petite cuillère, la regarde sérieusement puis la repose bien trop loin.", ["Hylee", "On la lavera demain. Elle vient d'assister à beaucoup trop de choses pour retourner dans le tiroir ce soir.", "teasing"], "Elle lèche la dernière trace de miel sur votre épaule."),
      A("Vous rejoignez le salon seulement pour éteindre les lampes. Le photophore reste allumé ; Hylee le rapporte près du lit et se glisse nue contre vous.", ["Hylee", "La prochaine fois, on prépare un dessert qui laisse encore plus de traces. J'ai une méthode de nettoyage.", "teasing"]),
    ],
  },
  {
    id: "hylee-home-homme-joueuse", context: "home-hylee", sex: "homme", mood: "joueuse",
    text: "Laisser Hylee détourner la dernière cuillère et tester de nouveaux usages",
    detail: "Une scène domestique vive où Hylee joue avec le dessert, explore un homme et change de pièce selon ses envies.",
    chapters: [
      A("Hylee garde la petite cuillère entre ses dents pendant qu'elle noue le panier. Vous la lui retirez ; elle vous prend aussitôt le poignet et goûte le manche resté contre vos doigts.", ["Hylee", "Il n'y avait plus rien dessus. J'avais seulement envie de voir ta tête.", "teasing"], "Elle obtient une réaction plus nette en venant s'asseoir sur vos genoux."),
      A("Elle ouvre votre col d'une main tout en essayant de poser la cuillère sur la table sans regarder. Le métal tombe ; Hylee décrète que le bruit donne le départ et vous retire votre chemise.", "Vous défaites sa robe sur la chaise. Elle se lève pour la laisser tomber, ouvre votre ceinture puis vous entraîne vers la chambre avec vos vêtements encore à mi-chemin."),
      A("Hylee arrive nue au bord du lit, les taches claires de sa peau éclairées par le photophore. Votre regard la fait rougir mais elle avance, prend vos mains et les place sur ses hanches.", "Elle retire votre dernier vêtement et découvre votre pénis dressé. Son sourire change, plus lent, lorsqu'elle constate l'effet de son corps.", ["Hylee", "Je peux faire mieux que la cuillère. C'était déjà mon idée.", "determined"]),
      V(
        ["Hylee explore votre torse et votre ventre de sa bouche, remonte vous embrasser puis redescend pour retrouver l'endroit qui vous avait fait frissonner."],
        ["Elle caresse votre érection à travers sa paume et suit la tension de vos hanches. Une goutte de miel sur son pouce disparaît contre le gland avant qu'elle prétende que c'était accidentel."],
        ["Hylee entoure votre pénis d'une main, étale le miel sur le gland puis le recueille lentement avec la langue. Elle vous prend dans sa bouche, combine ses lèvres et sa paume et relève les yeux pour vérifier chaque effet.", ["Hylee", "Beaucoup mieux. La cuillère est battue.", "teasing"]],
        ["Hylee emporte votre plaisir sous la couverture avec une curiosité qui n'a plus besoin d'accessoire. Le récit revient lorsqu'elle remonte, satisfaite des réactions obtenues."],
      ),
      V(
        ["Vous la couchez sur le lit et suivez les traces de lumière sur ses seins, son ventre et ses cuisses. Hylee propose un faux indice, rit et vous guide vers un endroit plus intéressant."],
        ["Votre main trouve sa vulve chaude. Elle frotte contre vos doigts, puis les replace plus haut avec un geste direct pour obtenir la pression qu'elle veut."],
        ["Vous ouvrez sa vulve et caressez son clitoris humide. Hylee place deux doigts en elle devant vous, vous les confie puis attire votre bouche entre ses cuisses, ravie de transformer la découverte en défi réciproque."],
        ["Vous suivez ses indications sous le drap. Hylee cesse de jouer lorsque le plaisir l'exige, puis recommence à vous provoquer dès qu'elle retrouve son souffle."],
      ),
      V(
        ["Elle vous ramène dans le salon, simplement parce qu'elle avait promis de choisir plusieurs pièces. Hylee s'installe sur vos cuisses et décide que le canapé compte comme une étape entière."],
        ["Sa vulve frotte contre votre sexe pendant qu'elle vous embrasse. Elle teste l'appui du dossier, approuve et vous fait glisser plus bas pour pouvoir mener le mouvement."],
        ["Hylee fait rouler votre pénis entre ses doigts, presse le gland contre son clitoris puis le guide dans sa vulve humide. Elle descend sur vous au milieu du canapé, trouve un rythme avec ses pieds au sol et rit quand le meuble grince avant elle."],
        ["Sous la couverture du salon, Hylee détourne le canapé de sa fonction officielle. Le récit laisse ses mouvements, vos mains et quelques rires décider de la suite."],
      ),
      A("Hylee change d'appui, pose les genoux de chaque côté de vous et reprend une cadence plus ample. Elle s'arrête seulement pour vous faire goûter le miel resté sur sa bouche.", "Le bord de la coupe vide se voile une fois de givre sous sa main. Elle la repousse aussitôt pour garder tout l'espace entre vos corps."),
      V(
        ["Le plaisir vous traverse sur le canapé, enlacés et encore capables de rire du moindre grincement. Hylee vous garde en elle le temps que vos souffles se calment."],
        ["Hylee presse son clitoris pendant qu'elle bouge sur vous. Son orgasme lui fait perdre l'appui du dossier ; vous la retenez, et elle reprend assez pour vous conduire au vôtre."],
        ["Votre pénis coulisse en Hylee tandis qu'elle travaille son clitoris. Elle jouit au-dessus de vous, se cramponne à vos épaules puis poursuit en mouvements courts jusqu'à votre orgasme, attentive à la façon dont votre corps se tend sous elle.", ["Hylee", "Le canapé tient. Nous aussi, presque.", "teasing"]],
        ["La couverture cache la fin de l'expérience. Quand le récit revient, Hylee est allongée sur vous et le canapé a survécu, quoique ses coussins n'aient plus aucun ordre."],
      ),
      A("Hylee examine les coussins au sol sans bouger de votre poitrine.", ["Hylee", "Je devais découvrir ta maison. Le canapé est validé. La chambre mérite peut-être une seconde inspection.", "teasing"], "Elle vous embrasse avant de tenter de se lever."),
      A("Vous gagnez finalement le lit, emportant un seul coussin du salon et le photophore. Hylee pose la petite cuillère à côté de la lampe comme le souvenir d'une règle abandonnée.", ["Hylee", "Demain, je cuisine. Ce soir, j'ai trouvé une activité beaucoup plus convaincante.", "soft"]),
    ],
  },
  {
    id: "hylee-home-femme-tendre", context: "home-hylee", sex: "femme", mood: "tendre",
    text: "Laisser Hylee choisir sa place dans votre logis et contre votre corps",
    detail: "Une Hylee intimidée mais active apprivoise une maison qui n'est pas la sienne et une proximité tendre entre deux femmes.",
    chapters: [
      A("Hylee éteint une lampe, garde le photophore et vous demande où vous préférez vous asseoir. Quand vous lui retournez la question, elle choisit le bord du lit plutôt que le canapé.", ["Hylee", "Là. Je peux partir si j'en ai besoin. Et je peux surtout rester.", "soft"], "Elle prend votre main et vous entraîne dans la chambre."),
      A("Elle défait votre haut puis s'arrête pour demander où poser les vêtements. Vous lui montrez la chaise ; Hylee y dépose le premier avec soin, laisse tomber le second et sourit de cette petite décision.", "Vous ouvrez sa robe. Elle retient votre poignet le temps d'un souffle, puis le ramène elle-même contre sa peau et termine l'attache avec vous."),
      A("Nue dans une chambre qui n'est pas la sienne, Hylee regarde d'abord la porte, puis vous. Elle rougit, approche et pose vos mains sur ses seins au lieu de se couvrir.", ["Hylee", "Je voulais que tu me voies ici. Chez toi. Je ne sais pas pourquoi ça compte autant, mais ça compte."], "Elle retire votre dernier tissu et découvre votre nudité de femme en restant assez près pour que vos genoux se touchent."),
      V(
        ["Hylee suit votre visage, vos épaules et vos seins du bout des doigts. Elle demande si elle peut continuer plus bas, entend votre réponse et y va avant que sa nervosité invente une autre question."],
        ["Ses lèvres descendent sur votre poitrine et votre ventre. Une main se glisse entre vos jambes ; elle attend le mouvement de votre bassin puis répond par une pression douce."],
        ["Hylee ouvre votre vulve avec des doigts prudents, trouve votre clitoris et le caresse lentement. Elle glisse un doigt en vous lorsque vous la rapprochez et observe votre visage pour ajuster la profondeur.", ["Hylee", "Je te sens venir vers ma main. Continue de me montrer.", "soft"]],
        ["Sous la couverture de votre propre lit, Hylee apprend votre corps par vos mots et vos réponses. Le récit s'efface sans lui retirer l'initiative qu'elle reprend à chaque étape."],
      ),
      V(
        ["Vous l'allongez sur vos oreillers et suivez sa peau de vos mains. Hylee en déplace un derrière sa tête, rit doucement de ce souci pratique puis guide votre paume jusqu'à sa poitrine."],
        ["Votre bouche caresse ses seins et son ventre. Elle ouvre les cuisses, prend votre main et la place contre sa chaleur avec une franchise plus forte que son rougissement."],
        ["Vous glissez les doigts sur sa vulve humide et cernez son clitoris. Hylee vous demande une pression plus ferme, puis un doigt en elle ; elle accompagne chaque entrée du bassin et garde votre autre main serrée contre son sein."],
        ["Vous découvrez Hylee à l'abri du drap. Elle ne reste jamais immobile par défaut : elle vous rapproche, change l'angle et vous dit quand reprendre."],
      ),
      V(
        ["Hylee se tourne face à vous et propose que chacune garde une main sur l'autre. Vos jambes se mêlent dans le lit, vos fronts presque joints."],
        ["Vos doigts circulent entre vos seins, vos ventres puis vos sexes. Hylee trouve un rythme sur vous et guide le vôtre sur elle sans précipiter la réponse."],
        ["Hylee glisse deux doigts dans votre vulve pendant que votre main entre doucement en elle. Vos pouces travaillent vos clitoris ; elle bouge contre votre paume, vous embrasse et reprend elle-même le mouvement chaque fois qu'un frisson l'interrompt."],
        ["La couverture se ferme sur vos corps face à face. Le récit laisse vos mains construire la suite, ponctuée par les questions simples d'Hylee et les réponses que vos souffles rendent évidentes."],
      ),
      A("Le rythme devient plus assuré. Hylee serre votre jambe entre les siennes, garde ses doigts en vous et vous demande de ne pas cesser lorsque sa voix tremble.", "Les petites étoiles du photophore blanchissent une seule fois de froid. Leur lumière reste stable ; aucune autre magie ne vient commenter son plaisir."),
      V(
        ["Vous atteignez le plaisir dans la même étreinte, l'une après l'autre. Hylee continue de vous caresser jusqu'à votre détente complète, puis vous la conduisez à son tour sans quitter sa bouche."],
        ["Vos doigts accélèrent sur vos clitoris. Hylee jouit contre votre paume, reprend le mouvement sur vous et vous accompagne jusqu'à l'orgasme en gardant son front au vôtre."],
        ["Les doigts d'Hylee se courbent en vous pendant que son pouce travaille votre clitoris. Votre orgasme serre sa main ; vous maintenez la vôtre dans sa vulve et pressez le sien jusqu'à ce qu'elle jouisse contre vous, bouche ouverte sur votre nom."],
        ["Le récit laisse vos caresses vous emporter derrière la couverture. Il revient quand Hylee demeure face à vous, tremblante, active encore dans les gestes doux de l'après."],
      ),
      A("Hylee pose la paume sur le matelas, comme pour enregistrer la texture du lieu. Elle ramène ensuite cette main sur votre taille.", ["Hylee", "Je saurai où revenir. Même si tu changes les coussins de place.", "soft"], "Elle sourit, un peu gênée d'avoir déjà parlé d'un retour, mais ne retire pas la phrase."),
      A("Vous éteignez le photophore ensemble. Hylee demande le côté du lit que vous utilisez, choisit l'autre et finit pourtant au milieu, serrée contre vous.", ["Hylee", "Je ne prends pas trop de place ? Non, attends. Ne réponds pas. J'ai envie d'en prendre un peu.", "determined"]),
    ],
  },
  {
    id: "hylee-home-homme-tendre", context: "home-hylee", sex: "homme", mood: "tendre",
    text: "Accueillir Hylee sans choisir pour elle la place qu'elle veut prendre",
    detail: "Dans votre logis, Hylee hésite, avance et guide elle-même une découverte tendre du corps masculin.",
    chapters: [
      A("Hylee garde le photophore dans les deux mains et parcourt votre logis du regard comme si elle cherchait la bonne place pour ce qui va suivre. Elle le pose près du lit, puis revient prendre votre main.", ["Hylee", "J'ai envie d'être ici avec toi. Si je regarde la porte, ce n'est pas parce que je veux la prendre."], "Elle ferme les derniers centimètres par un baiser."),
      A("Elle retire votre veste et vous demande où la poser. La réponse devient inutile lorsque vous défaites sa robe et que vos deux vêtements tombent ensemble au pied de la chaise.", "Hylee ouvre votre chemise, s'arrête pour caresser votre torse puis reprend les boutons. Vous lui laissez chaque décision ; elle ne vous laisse pas immobile pour autant."),
      A("Nue devant vous, Hylee inspire sous votre regard et pose elle-même vos mains sur ses hanches. Elle regarde votre corps à son tour, retire le dernier tissu et découvre votre érection avec un mélange de gêne et d'envie très lisible.", ["Hylee", "Je peux rougir et avoir envie de te toucher. Les deux sont vrais."], "Sa main descend pour le prouver."),
      V(
        ["Elle explore votre torse, votre ventre et vos hanches avec une attention douce. Hylee suit les réactions sous sa paume et revient embrasser les endroits qu'elle veut mémoriser."],
        ["Sa main se referme sur votre érection. Elle la caresse lentement, sans détourner les yeux lorsque votre souffle change, puis vous demande d'un sourire si elle peut continuer."],
        ["Hylee entoure votre pénis de ses doigts, remonte jusqu'au gland et y fait glisser son pouce humide. Elle apprend la pression par vos hanches, se penche pour prendre l'extrémité dans sa bouche et combine prudemment ses lèvres et sa main.", ["Hylee", "Montre-moi encore. J'ai compris, mais j'aime bien vérifier.", "soft"]],
        ["Hylee se glisse sous la couverture et découvre votre plaisir selon vos indications. Le récit respecte l'intimité du geste tout en laissant son choix et sa curiosité entiers."],
      ),
      V(
        ["Vous l'allongez dans vos draps et embrassez ses épaules, ses seins puis son ventre. Hylee garde une main sur votre nuque et utilise l'autre pour vous guider plus bas."],
        ["Vos doigts trouvent sa vulve chaude. Elle ouvre les jambes, déplace votre pouce vers son clitoris et vous montre la cadence qu'elle veut par un mouvement continu de bassin."],
        ["Vous caressez son clitoris, glissez un doigt dans sa vulve humide puis un second quand elle vous le demande. Hylee serre vos doigts, vous attire entre ses cuisses et guide votre langue jusqu'à l'endroit où ses mots deviennent des souffles."],
        ["Vous lui rendez chaque découverte sous la couverture. Hylee choisit la pression, l'angle et le moment où vous rapprocher davantage."],
      ),
      V(
        ["Elle vous attire sur le côté pour rester face à vous. Une jambe passe autour de vos hanches, puis Hylee prend votre main afin de placer votre paume là où elle veut garder le contact."],
        ["Hylee frotte sa vulve le long de votre sexe, s'habitue à la proximité et vous embrasse chaque fois que sa gêne tente de lui voler le regard."],
        ["Elle guide votre pénis contre son clitoris puis jusqu'à son entrée humide. Hylee vous accueille lentement sur le côté, ajuste la profondeur avec sa jambe et commence elle-même les mouvements, front contre front.", ["Hylee", "Ne fais pas tout. J'ai envie de venir vers toi aussi.", "determined"]],
        ["Sous le drap, Hylee choisit une position qui vous garde face à face. Le récit s'efface pendant qu'elle reprend chaque mouvement à sa manière."],
      ),
      A("Vos corps trouvent une cadence lente mais active. Hylee roule les hanches contre vous, interrompt un mouvement pour changer l'oreiller puis repart avec un confort qu'elle a choisi.", "Une seule branche givrée apparaît sur le verre du photophore et fond presque aussitôt dans sa lumière."),
      V(
        ["Le plaisir la traverse dans vos bras ; elle vous garde près d'elle et poursuit assez longtemps pour sentir votre propre abandon lui répondre."],
        ["Votre main travaille son clitoris pendant que vos bassins bougent ensemble. Hylee jouit contre vous, reprend des mouvements doux et vous conduit à l'orgasme sans quitter votre regard."],
        ["Votre pénis glisse en Hylee tandis que vos doigts pressent son clitoris. Elle jouit en serrant sa jambe autour de vous, puis continue volontairement jusqu'à votre orgasme, attentive à chaque contraction de votre ventre et à la chaleur qui vous quitte."],
        ["La couverture cache la montée finale. Quand le récit revient, Hylee respire contre votre bouche et ses jambes vous gardent encore exactement là où elle vous a choisi."],
      ),
      A("Hylee observe le plafond inconnu, puis se tourne aussitôt vers vous plutôt que de laisser la pièce devenir plus importante que le moment.", ["Hylee", "Je pensais que chez toi, je me sentirais invitée. Là, je me sens restée. Ce n'est pas pareil.", "soft"]),
      A("Elle demande où vous gardez une seconde couverture, va la chercher elle-même et revient la déplier sur vous deux.", ["Hylee", "Je compte apprendre cette maison. Pas tout ce soir. J'ai déjà beaucoup appris sur ce côté du lit.", "teasing"]),
    ],
  },
  {
    id: "hylee-home-femme-audacieuse", context: "home-hylee", sex: "femme", mood: "audacieuse",
    text: "Donner les clés de la soirée à Hylee et la laisser occuper votre maison",
    detail: "Hylee assume son désir d'une femme, choisit les pièces, mène les positions et savoure l'effet qu'elle produit chez vous.",
    chapters: [
      A("Hylee ferme la porte, retire la clé et vient la poser dans votre paume. Elle referme ensuite vos doigts dessus et vous pousse doucement contre le mur de l'entrée.", ["Hylee", "Tu ouvriras si tu veux. Moi, je reste et je te veux.", "determined"], "Son baiser ne laisse rien de timide dans la façon dont ses hanches rejoignent les vôtres."),
      A("Elle vous retire votre haut dans l'entrée, dépose un baiser ferme sur chaque sein découvert puis vous entraîne vers la chambre. En chemin, Hylee enlève sa robe et l'abandonne au milieu du salon comme un chemin très facile à suivre.", "Vous défaites son sous-vêtement au seuil de la chambre. Elle ouvre le vôtre elle-même et vous fait entrer à reculons sans perdre votre regard."),
      A("Nue au centre de votre chambre, Hylee prend le temps d'être vue. Elle tourne, relève ses cheveux et vous montre son dos avant de revenir poitrine contre la vôtre.", ["Hylee", "C'est chez toi. Ce soir, j'ai quand même envie de décider où tu regardes."], "Elle vous dénude complètement et guide votre attention sur le frisson qui court entre vos cuisses."),
      V(
        ["Hylee vous installe au bord du lit et parcourt votre poitrine de ses mains. Elle vous demande de garder les yeux ouverts pendant qu'elle découvre chaque réaction."],
        ["Sa bouche travaille vos seins tandis qu'une cuisse se place entre les vôtres. Hylee bouge contre vous et vous fait suivre le rythme qu'elle a choisi."],
        ["Elle écarte votre vulve et caresse votre clitoris avec deux doigts déjà humides. Hylee glisse un doigt en vous, puis un second, et courbe sa main jusqu'à trouver le mouvement qui vous fait saisir les draps.", ["Hylee", "Oui. Je voulais voir ce que tu ferais avec tes mains quand les miennes seraient là.", "teasing"]],
        ["Hylee vous couvre et mène la découverte hors du regard du récit. Vos réponses lui suffisent ; elle n'abandonne ni sa voix ni son initiative."],
      ),
      V(
        ["Vous l'attirez à votre tour sur le lit. Hylee vous laisse inverser les places, mais ouvre aussitôt les jambes et place votre bouche là où elle la réclame."],
        ["Vous embrassez sa poitrine puis son ventre. Elle presse votre main contre sa vulve et vous demande une caresse ferme, sans euphémisme dans son geste."],
        ["Votre langue travaille son clitoris pendant que deux doigts entrent dans sa vulve. Hylee roule les hanches contre votre bouche, vous ordonne de ne pas ralentir et serre ses seins de ses propres mains lorsque le plaisir devient plus vif."],
        ["Vous lui rendez son désir sous la couverture. Hylee choisit la cadence par ses hanches et vous rappelle d'un mot direct chaque endroit où revenir."],
      ),
      V(
        ["Elle quitte le lit, vous prend par la main et retourne dans le salon. Hylee vous assoit sur la table débarrassée, ravie de donner à votre maison un souvenir qui ne tient dans aucun inventaire."],
        ["Debout entre vos jambes, elle presse sa cuisse contre votre sexe puis vous attire à son tour au bord de la table. Vos mains circulent sans attribuer durablement la conduite."],
        ["Hylee vient s'asseoir sur votre cuisse, sa vulve ouverte contre votre peau, tandis que la sienne se glisse entre vos jambes. Vos clitoris trouvent tour à tour la pression ; vos doigts s'ajoutent entre vous lorsque le frottement ne suffit plus.", ["Hylee", "Je veux que tu te souviennes de cette table autrement.", "determined"]],
        ["La lumière baisse sur la table détournée et vos jambes nouées. Le récit vous laisse choisir ensemble les prises que votre maison gardera en mémoire."],
      ),
      A("Hylee vous ramène contre le plateau, une main sous votre cuisse et l'autre sur votre clitoris. Elle frotte son propre bassin contre le vôtre, mène puis vous laisse reprendre juste assez pour être surprise.", "Le verre du photophore se couvre une fois d'étoiles givrées. Elles éclairent vos corps sans devenir un spectacle répété."),
      V(
        ["Vos caresses vous mènent toutes deux au plaisir contre la table. Hylee vous garde serrée, encore fière de l'endroit et de chaque réaction qu'elle a obtenue."],
        ["Hylee fait jouir votre corps sous sa main, puis presse la vôtre contre son clitoris et se laisse conduire à son tour dans un mouvement toujours franc."],
        ["Ses doigts se courbent dans votre vulve pendant que son pouce travaille votre clitoris. Vous jouissez contre la table ; Hylee place ensuite votre main entre ses cuisses, frotte sa vulve contre votre paume et atteint son orgasme sans détourner les yeux.", ["Hylee", "Voilà. Cette maison sait maintenant que je suis venue.", "determined"]],
        ["Le récit se retire tandis qu'Hylee garde votre corps contre le sien. Il revient après vos orgasmes, quand les étoiles de givre fondent et que vos jambes refusent encore le sol."],
      ),
      A("Hylee regarde la table, puis vous, et ne cherche pas à minimiser son plaisir d'avoir choisi les lieux.", ["Hylee", "J'aime être invitée. J'aime encore plus savoir que je peux avoir des idées une fois entrée.", "teasing"], "Elle vous soulève juste assez pour vous aider à retrouver vos jambes."),
      A("Vous laissez les vêtements dans trois pièces différentes. Hylee rapporte seulement la clé et la pose près du lit avant de vous attirer sous les draps.", ["Hylee", "Tu pourras me rendre la visite. Mais cette adresse, je veux la garder.", "soft"]),
    ],
  },
  {
    id: "hylee-home-homme-audacieuse", context: "home-hylee", sex: "homme", mood: "audacieuse",
    text: "Laisser Hylee choisir chaque pièce et conduire votre désir jusqu'au bout",
    detail: "Hylee prend possession de la soirée, mène un homme du salon à la chambre et affirme ce qu'elle veut recommencer.",
    chapters: [
      A("Hylee ferme la porte à clé, laisse le panier dans l'entrée et vient s'asseoir sur vos genoux sans demander au silence de parler pour elle.", ["Hylee", "Je veux rester. Je veux aussi te déshabiller dans cette maison. Les deux décisions sont prises.", "determined"], "Elle mord doucement votre lèvre et ouvre déjà votre col."),
      A("Votre chemise tombe sur le canapé. Hylee retire sa robe debout entre vos jambes, vous laisse ouvrir le dernier lien puis fait glisser votre pantalon avant de vous entraîner vers la chambre.", "À mi-chemin, elle change d'avis, vous pousse contre la table débarrassée et décide que la chambre peut attendre une étape."),
      A("Nue dans la lumière du photophore, Hylee se place entre vous et la table, offerte à votre regard sans chercher à devenir immobile. Elle prend vos mains et les fait parcourir ses seins, ses flancs et ses fesses.", "Puis elle libère votre pénis, observe votre érection contre son ventre et resserre les doigts autour avec un sourire assumé.", ["Hylee", "Je voulais te trouver comme ça chez toi. Maintenant, je veux savoir tout ce que je peux en faire.", "determined"]),
      V(
        ["Hylee vous fait asseoir sur la table et découvre votre torse, votre ventre et vos hanches. Elle savoure chaque réaction visible et vous embrasse avant de poursuivre plus bas."],
        ["Sa main travaille votre érection pendant que sa bouche suit votre ventre. Hylee varie la pression, observe vos doigts se crisper sur le bord et garde le mouvement qui vous trouble le plus."],
        ["Hylee enveloppe votre pénis d'une main ferme, lèche le gland puis le prend dans sa bouche. Elle combine sa langue sous la couronne et la paume sur la longueur, vous mène près de l'orgasme et s'arrête volontairement.", ["Hylee", "Pas sur la table. J'ai une autre idée pour la fin.", "teasing"]],
        ["Hylee se penche entre vos jambes sous la couverture du salon et prend votre plaisir en main. Le récit s'écarte avant qu'elle révèle l'idée qu'elle garde pour la chambre."],
      ),
      V(
        ["Vous la faites asseoir à son tour et embrassez sa poitrine. Hylee ouvre les jambes, vous donne accès à sa chaleur et place votre main sans attendre que vous deviniez."],
        ["Vos doigts caressent sa vulve pendant que votre bouche revient sur ses seins. Elle presse son bassin contre votre paume et réclame un mouvement plus ferme."],
        ["Vous ouvrez sa vulve humide, tournez autour de son clitoris puis glissez deux doigts en elle. Hylee guide la courbe de votre main, vous attire entre ses cuisses et se frotte à votre langue jusqu'à perdre la netteté de ses ordres."],
        ["Vous répondez à ses demandes sous la couverture. Hylee change elle-même d'appui et vous ramène chaque fois que votre prudence menace de devenir une décision prise à sa place."],
      ),
      V(
        ["Hylee vous conduit enfin dans la chambre et vous fait allonger. Elle vient à califourchon, reprend votre bouche et place vos mains sur ses hanches."],
        ["Elle frotte sa vulve contre votre sexe, étale sa chaleur sur vous et change la pression selon son propre plaisir autant que le vôtre."],
        ["Hylee fait glisser votre pénis le long des lèvres de sa vulve, presse le gland contre son clitoris puis le guide en elle. Elle descend entièrement, ajuste l'angle et commence à vous chevaucher avec une cadence qu'elle n'a aucune envie de vous céder."],
        ["Sous le drap, Hylee s'installe sur vous et mène l'union qu'elle avait choisie depuis la table. Le récit lui laisse le rythme et la précision."],
      ),
      A("Elle alterne des mouvements profonds et des frottements courts, se penche pour vous embrasser puis se redresse afin de voir l'effet de chaque reprise. Votre main rejoint son clitoris ; Hylee la maintient exactement là.", "Une seule étoile de givre apparaît sur le photophore. Sa lumière traverse le verre puis la magie s'immobilise."),
      V(
        ["Hylee vous mène jusqu'au plaisir et atteint le sien dans la même étreinte. Elle reste assise sur vous, mains liées aux vôtres et désir enfin apaisé sans être diminué."],
        ["Elle presse son clitoris sous vos doigts tandis qu'elle bouge sur vous. Son orgasme la fait se contracter autour de votre sexe ; Hylee reprend aussitôt une cadence plus courte jusqu'à sentir votre propre abandon."],
        ["Votre pénis coulisse en Hylee pendant que vos doigts travaillent son clitoris. Elle jouit au-dessus de vous, vous regarde céder sous les contractions de sa vulve puis continue à vous chevaucher jusqu'à votre orgasme, les mains fermes sur votre poitrine.", ["Hylee", "Oui. C'était exactement mon autre idée.", "determined"]],
        ["La couverture dissimule l'aboutissement de son idée. Lorsque le récit revient, Hylee est encore sur vous, essoufflée et parfaitement consciente d'avoir conduit la scène où elle le voulait."],
      ),
      A("Hylee se penche sur votre torse et suit du doigt le battement rapide sous votre peau. Son sourire n'est ni surpris ni modeste.", ["Hylee", "J'aime quand ton corps me répond avant ta bouche. Mais j'aime aussi ce que ta bouche peut faire, donc ne choisis pas.", "teasing"]),
      A("Elle descend enfin de vos hanches, ramène la couverture et garde la clé près du photophore. Le panier attend toujours dans l'entrée.", ["Hylee", "Je repartirai demain. Pas avant. Et je veux revenir assez souvent pour ne plus demander où est la chambre.", "soft"]),
    ],
  },
];

function routeFromScene(scene: AuthoredScene): IntimacyRoute {
  const chapters = Object.fromEntries(MODES.map((mode) => [mode, scene.chapters.map((chapter) => dialogueLines("all" in chapter ? chapter.all : chapter[mode]))])) as Record<IntimacyMode, DialogueLine[][]>;
  return { id: scene.id, text: scene.text, detail: scene.detail, chapters };
}

export function hyleeIntimacyContext(dateId?: string, home = false): HyleeIntimacyContext | undefined {
  if (home) return "home-hylee";
  return CONTEXTS.includes(dateId as HyleeIntimacyContext) ? dateId as HyleeIntimacyContext : undefined;
}

export function hyleeDateIntimacyPhase(chapter: number): HyleeIntimacyPhase | undefined { return PHASES[chapter]; }
export function hyleeDateApproaches(context?: HyleeIntimacyContext): HyleeDateApproach[] | undefined { return context ? HYLEE_INTIMACY_APPROACHES[context] : undefined; }
export function hyleeDateIntimacyOpening(context: HyleeIntimacyContext): DialogueLine[] { return HYLEE_INTIMACY_OPENINGS[context]; }
export function hyleeDateIntimacyEnding(context: HyleeIntimacyContext): DialogueLine[] { return HYLEE_INTIMACY_ENDINGS[context]; }

export function hyleeDateIntimacyRoutes(context: HyleeIntimacyContext | undefined, sex: PlayerSex): IntimacyRoute[] {
  if (!context || sex === "intersexe") return [];
  return SCENES.filter((scene) => scene.context === context && scene.sex === sex).map(routeFromScene);
}

export function validateHyleeDateIntimacy() {
  let combinations = 0;
  let routes = 0;
  let chapters = 0;
  for (const context of CONTEXTS) for (const sex of SEXES) {
    combinations++;
    const entries = hyleeDateIntimacyRoutes(context, sex);
    if (entries.length !== 3) throw new Error(`${context}/${sex}: trois tonalités Hylee requises`);
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
  if (hyleeDateIntimacyRoutes("home-hylee", "intersexe").length !== 0) throw new Error("Le canon intersexe ne doit pas être fixé par la refonte Hylee");
  return { contexts: CONTEXTS.length, combinations, routes, chapters };
}
