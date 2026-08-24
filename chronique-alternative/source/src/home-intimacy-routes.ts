import type { DialogueLine } from "./game-data";
import type { IntimacyMode, PlayerSex } from "./date-scenes";
import type { IntimacyChoice } from "./intimacy-scenes";
import type { DisplayItem, HousingProperty } from "./housing-data";

export type HomeIntimacyRoute = {
  id: string;
  text: string;
  detail: string;
  chapters: Record<IntimacyMode, DialogueLine[][]>;
};

type RawLine = string | [speaker: string, text: string, mood?: string];
type SexText = Record<PlayerSex, string>;
type SexLines = Record<PlayerSex, RawLine[]>;

type HomeRouteSeed = {
  id: string;
  labels: SexText;
  detail: string;
  threshold: RawLine[];
  firstMovement: RawLine[];
  variation: RawLine[];
  tender: RawLine[];
  suggestive: RawLine[];
  explicit: SexLines;
  ellipse: RawLine[];
  reprise: RawLine[];
  closing: RawLine[];
  after: SexText;
};

const sexText = (femme: string, homme: string, intersexe: string): SexText => ({ femme, homme, intersexe });
const sexLines = (femme: RawLine[], homme: RawLine[], intersexe: RawLine[]): SexLines => ({ femme, homme, intersexe });
const N = (text: string): DialogueLine => ({ speaker: "Narration", text });
const C = (speaker: string, text: string, mood?: string): DialogueLine => ({ speaker, text, mood });
const P = (text: string): DialogueLine => ({ speaker: "{player}", text });
const rawLines = (entries: RawLine[]): DialogueLine[] => entries.map((entry) => typeof entry === "string"
  ? N(entry)
  : C(entry[0], entry[1], entry[2]));

const route = (character: string, sex: PlayerSex, seed: HomeRouteSeed): HomeIntimacyRoute => {
  const modeChapter = (mode: IntimacyMode) => rawLines(
    mode === "tendre" ? seed.tender
      : mode === "suggestif" ? seed.suggestive
        : mode === "explicite" ? seed.explicit[sex]
          : seed.ellipse,
  );
  const chapters = (mode: IntimacyMode) => {
    const sequence = [
      rawLines(seed.threshold),
      rawLines(seed.firstMovement),
      rawLines(seed.variation),
      modeChapter(mode),
      rawLines(seed.reprise),
      rawLines(seed.closing),
      rawLines([seed.after[sex]]),
    ];
    const splitIndex = sequence.findIndex((chapter) => chapter.length > 1);
    if (splitIndex >= 0) {
      const chapter = sequence[splitIndex];
      const pivot = Math.ceil(chapter.length / 2);
      sequence.splice(splitIndex, 1, chapter.slice(0, pivot), chapter.slice(pivot));
    }
    return sequence;
  };
  return {
    id: `home-${character}-${sex}-${seed.id}`,
    text: seed.labels[sex],
    detail: seed.detail,
    chapters: {
      tendre: chapters("tendre"),
      suggestif: chapters("suggestif"),
      explicite: chapters("explicite"),
      ellipse: chapters("ellipse"),
    },
  };
};

const HOME_ROUTE_SEEDS: Record<string, HomeRouteSeed[]> = {
  hylee: [
    {
      id: "photophore-guide",
      labels: sexText("Laisser le photophore guider Hylee le long de vos courbes", "Lui confier votre désir dans la lumière du givre", "Laisser Hylee apprendre votre intimité à la lueur des flocons"),
      detail: "Hylee mène une exploration lente du canapé au lit, en utilisant la lumière froide de son cadeau pour lire chacune de vos réactions.",
      threshold: ["Hylee pose son photophore sur la table basse. La neige enfermée éclaire le salon par vagues et transforme votre maison en refuge d’hiver.", ["Hylee", "Je veux prendre mon temps. Pas parce que j’hésite : parce que nous avons enfin une porte que personne ne viendra ouvrir.", "determined"]],
      firstMovement: ["Elle vous installe dans l’angle profond du canapé, embrasse votre bouche, votre gorge puis votre ventre, et déplace le photophore pour que sa lumière accompagne ses mains.", ["Hylee", "Chaque fois que la neige accélère, c’est moi. Je crois qu’elle me trahit mieux que mon visage.", "teasing"]],
      variation: ["Vous gagnez ensuite la chambre sans rompre le contact. Hylee change votre position contre les oreillers, s’agenouille entre vos jambes puis remonte pour vous regarder lorsque votre souffle se brise.", ["{player}", "Ne détourne pas les yeux maintenant."]],
      tender: ["Ses gestes restent amples et paisibles. Elle réchauffe de sa paume chaque frisson laissé par le givre et vous garde enlacé·es assez longtemps pour que le désir devienne une confiance physique."],
      suggestive: ["Sa bouche suit le chemin bleuté que la lumière dessine sur votre peau. Une main vous maintient près d’elle tandis que l’autre cherche avec une curiosité de plus en plus sûre ce qui raccourcit vos phrases."],
      explicit: sexLines(
        ["Hylee ouvre vos cuisses au milieu des draps et suit du bout des doigts les lèvres de votre intimité humide. Sa bouche trouve votre perle de plaisir ; elle alterne caresses lentes et pressions plus fermes jusqu’à ce que vos hanches réclament seules la cadence.", ["Hylee", "Je reconnais ce mouvement. Laisse-moi le faire revenir… encore.", "determined"]],
        ["Hylee referme ses doigts autour de votre membre dressé, apprend la tension qui vous traverse puis prolonge le mouvement de ses lèvres. Elle change d’angle lorsque vos hanches quittent le matelas et maintient le rythme jusqu’à votre abandon.", ["Hylee", "La neige tombe plus vite que toi. Mais de très peu.", "teasing"]],
        ["Hylee explore l’écrin exact de votre intimité avec les mots et les gestes que vous lui avez donnés. Doigts, bouche et chaleur de sa paume se relaient sans supposer votre anatomie, jusqu’à ce que le plaisir fasse trembler la lumière du photophore.", ["Hylee", "C’est ton corps, ton langage. J’aime qu’il n’appartienne qu’à nous.", "soft"]],
      ),
      ellipse: ["Hylee emporte le photophore jusqu’à la chambre et referme la porte d’un souffle de givre. Les flocons accélèrent derrière le verre tandis que la chronique demeure dans le salon."],
      reprise: ["Après une première accalmie, Hylee ne se presse pas de dormir. Elle vous fait rouler contre elle, échange la conduite et transforme les oreillers déplacés en terrain d’une seconde exploration plus joueuse."],
      closing: ["Le photophore finit sur le sol, entouré de vêtements et de neige fondue. Hylee reste étendue de travers, satisfaite d’avoir habité chaque coin de cette nuit plutôt que de l’avoir simplement traversée.", ["Hylee", "Chez toi, j’ai eu le temps d’être audacieuse plusieurs fois. C’est dangereusement confortable.", "teasing"]],
      after: sexText("Elle garde une main tiède au creux de votre ventre.", "Elle dessine un flocon sur votre torse avant de l’effacer d’un baiser.", "Elle replace la couverture sur vos deux anatomies sans tenter de leur donner une symétrie."),
    },
    {
      id: "cuisine-renversee",
      labels: sexText("Renverser la préparation et faire du plan de travail votre première étape", "La faire quitter les draps pour une aventure dans toute la maison", "Inventer avec elle un parcours sensuel sans rôle fixe"),
      detail: "Vous menez d’abord Hylee dans la cuisine, puis l’initiative circule entre le plan de travail, le tapis et le lit.",
      threshold: ["Le dessert abandonné garde encore le plan de travail froid. Vous y faites asseoir Hylee ; son rire s’interrompt lorsque vous prenez place entre ses genoux.", ["Hylee", "Je retire tout ce que j’ai dit sur la cuisine qui ne devait servir qu’à cuisiner.", "teasing"]],
      firstMovement: ["Vous lui ôtez lentement les traces de farine et les vêtements qui les retiennent. Hylee s’appuie sur le marbre, surprise par le contraste entre sa magie froide et votre bouche contre sa peau."],
      variation: ["Elle reprend l’avantage en vous attirant au sol sur le tapis du salon. Un coussin jeté derrière votre dos suffit à rendre la nouvelle position confortable ; Hylee vous chevauche un instant avant de vous entraîner vers la chambre.", ["Hylee", "Trois pièces. Aucune catastrophe. Nous faisons des progrès remarquables.", "determined"]],
      tender: ["La promenade devient une suite de baisers et d’étreintes, chaque pièce accueillant une manière différente de se tenir. Vous terminez au lit, encore amusé·es par l’itinéraire inventé."],
      suggestive: ["Contre le tapis puis le bord du lit, vos mains se montrent plus directes. Hylee répond à chaque nouvelle position par une audace plus nette, et le givre dessine sur le sol la route exacte de vos corps."],
      explicit: sexLines(
        ["Allongée contre le tapis, Hylee presse sa cuisse entre les vôtres avant de venir chercher votre intimité de ses doigts. Vous inversez ensuite la position : vos bassins se rejoignent en ciseaux, vos plis sensibles glissant l’un contre l’autre jusqu’à ce que son plaisir et le vôtre se confondent.", ["Hylee", "Ne change rien… je veux finir cette manche avec toi.", "determined"]],
        ["Hylee vous attire contre elle au bord du lit, guide votre membre entre ses lèvres de rose puis règle elle-même la profondeur de chaque mouvement. Elle quitte bientôt le bord pour vous chevaucher, son givre craquant sous ses genoux lorsque le rythme s’intensifie.", ["Hylee", "Cette fois, je garde le contrôle jusqu’au bout.", "teasing"]],
        ["Votre parcours devient un échange de positions choisies : contre le tapis, à cheval sur les hanches de l’autre, puis côte à côte sur le lit. Hylee suit les zones de plaisir que vous lui nommez et vous lui rendez chaque découverte jusqu’à un abandon partagé.", ["Hylee", "On vient d’inventer quelque chose que personne n’aurait pu nous apprendre.", "soft"]],
      ),
      ellipse: ["Vous quittez la cuisine en laissant une trace de farine et de givre. La chambre reçoit la suite de votre parcours tandis que le dessert fond paisiblement hors champ."],
      reprise: ["Hylee revient chercher une cuillerée de crème, la dépose sur votre épaule et prétend qu’une dégustation complète exige une reprise. La seconde partie de la nuit devient plus lente, plus gourmande et beaucoup moins ordonnée."],
      closing: ["Au matin, trois coussins et une cuillère permettent de reconstituer votre trajet. Hylee refuse de ranger avant d’avoir ri avec vous de chaque étape.", ["Hylee", "Je croyais qu’un foyer devait rester intact. Le nôtre a surtout besoin de survivre à nos bonnes idées.", "teasing"]],
      after: sexText("Elle récupère une mèche collée à votre joue et la coince derrière votre oreille.", "Elle s’endort contre votre flanc avec un genou posé sur votre hanche.", "Elle garde vos doigts mêlés aux siens sous la couverture froissée."),
    },
    {
      id: "refuge-partage",
      labels: sexText("Construire sous les couvertures un refuge où vos plaisirs se répondent", "Laisser Hylee transformer le lit en bataille tendre et charnelle", "Partager une nuit de givre où chaque corps invente sa place"),
      detail: "Une route mutuelle sous un dais de glace, entre jeu, changements de conduite et longues reprises.",
      threshold: ["Hylee dresse au-dessus du lit un dais translucide qui étouffe les bruits de la rue. La maison entière demeure visible à travers la glace, mais le monde ne peut plus vous atteindre.", ["Hylee", "Ce n’est pas une forteresse. Juste une cabane très ambitieuse.", "teasing"]],
      firstMovement: ["Sous la couverture, chaque main qui avance rencontre une autre main prête à répondre. Vous vous embrassez sur le côté, puis Hylee vous fait rouler au centre du matelas dans un éclat de rire étouffé."],
      variation: ["La conduite change avec chaque flocon tombé du dais : au-dessus, en dessous, enlacé·es face à face puis assis·es l’un·e contre l’autre. Aucun rôle ne dure assez longtemps pour devenir une règle."],
      tender: ["Vous explorez surtout la chaleur de vos peaux, les creux où une bouche peut se reposer et les gestes qui rassurent sans interrompre le désir. La lenteur rend chaque reprise plus intime."],
      suggestive: ["Vos cuisses s’entremêlent et vos mains deviennent plus insistantes sous la couverture. Hylee mord doucement votre épaule lorsque vous découvrez un rythme commun et le dais se couvre de fissures lumineuses."],
      explicit: sexLines(
        ["Vos bassins se rejoignent, plis sensibles contre plis sensibles, tandis que vos doigts cherchent alternativement la perle de plaisir de l’autre. Hylee change l’angle de ses hanches, vous rapproche par la cuisse et vous conduit vers un orgasme auquel le sien répond presque aussitôt.", ["Hylee", "Égalité… mais je réclame une autre manche.", "teasing"]],
        ["Hylee vous accueille face à face, ses jambes refermées autour de vos hanches. Elle règle d’abord le mouvement, puis vous inversez la position et prolongez la pénétration avec une cadence plus profonde, interrompue seulement par ses baisers impatients.", ["Hylee", "Encore. J’aime quand aucun de nous ne garde longtemps l’avantage.", "determined"]],
        ["Vos anatomies trouvent leur propre manière de s’emboîter, de glisser et de se stimuler. Vous alternez mains, bouches et pression des bassins, changeant de position chaque fois que l’un de vous découvre une sensation à partager.", ["Hylee", "À nous deux. C’est tout ce que cette règle doit dire.", "soft"]],
      ),
      ellipse: ["Le dais de glace devient opaque au premier soupir partagé. Les ombres de vos mouvements y dessinent une danse que la chronique choisit de ne pas traduire."],
      reprise: ["Le dais tient toute la nuit. Après vous être reposé·es joue contre joue, vous recommencez plus calmement, sans défi, en prenant le temps de retrouver chacun des gestes qui vous avait surpris·es."],
      closing: ["À l’aube, Hylee laisse fondre la cabane au lieu de la briser. L’eau disparaît avant d’atteindre les draps, mais la forme de votre refuge demeure dans le désordre du lit.", ["Hylee", "On pourra la reconstruire. Pas à l’identique — mieux.", "soft"]],
      after: sexText("Son souffle réchauffe encore votre poitrine lorsqu’elle ferme les yeux.", "Elle garde votre main sur sa hanche pendant que le dais s’amincit.", "Elle vous demande quel geste vous souhaitez garder pour votre prochaine cabane."),
    },
  ],

  remerii: [
    {
      id: "metronome-indocile",
      labels: sexText("Confier votre rythme au métronome que Remerii accepte de dérégler", "La laisser mesurer votre plaisir puis perdre volontairement le compte", "Inventer avec Remerii une cadence adaptée à votre corps"),
      detail: "Remerii mène du fauteuil au lit ; le métronome devient un jeu de rythme qu’elle finit par abandonner à vos réactions.",
      threshold: ["Remerii installe son métronome arcanique sur l’accoudoir. Elle règle une pulsation lente, puis déplace volontairement le poids d’un cran imparfait.", ["Remerii", "Je souhaite savoir à quel moment cet instrument cessera d’être utile. Je soupçonne que votre corps proposera une mesure supérieure.", "smirk"]],
      firstMovement: ["Assis·e dans le fauteuil, vous recevez ses baisers au tempo exact. Remerii ouvre vos vêtements entre deux pulsations, patiente une troisième, puis avance plus tôt simplement pour voir votre réaction."],
      variation: ["Elle vous conduit ensuite au bord du lit, une main dans votre dos et l’autre entre vos cuisses. Le métronome continue dans le salon ; votre souffle, plus proche, devient la seule mesure qu’elle écoute."],
      tender: ["Remerii ralentit jusqu’à ne plus compter. Ses caresses reviennent comme un thème doux, enrichi à chaque répétition par un détail qu’elle a appris de vous."],
      suggestive: ["Sa précision quitte le domaine de l’étude pour devenir franchement gourmande. Elle varie la pression au moindre frisson, garde votre regard et sourit lorsque vous perdez le fil avant elle."],
      explicit: sexLines(
        ["Remerii sépare délicatement les lèvres de votre écrin de chair et fait d’abord circuler un doigt autour de votre perle sensible. Sa bouche remplace le geste ; langue et phalanges alternent contre votre intimité humide jusqu’à ce que votre plaisir rompe définitivement la mesure.", ["Remerii", "Voilà. Cette contraction-là ne nécessite aucun métronome.", "smirk"]],
        ["Remerii prend votre membre viril dans sa paume, règle trois mouvements lents puis en brise volontairement la cadence avec sa bouche. Elle observe chaque tension de vos cuisses, accélère sans prévenir et vous maintient au bord jusqu’à décider que l’attente a assez duré.", ["Remerii", "Mesure abandonnée. Réaction obtenue.", "smirk"]],
        ["Remerii suit les repères que vous lui donnez et construit une cadence propre à votre anatomie. Ses doigts, ses lèvres et le poids de son corps changent de fonction à chaque réponse, jusqu’à ce que votre plaisir rende toute classification inutile.", ["Remerii", "Je ne corrigerai pas ce langage. Je veux seulement le parler avec vous.", "calm"]],
      ),
      ellipse: ["Le métronome poursuit seul sa pulsation dans le salon. Derrière la porte, Remerii en dérègle la rune à distance, puis la lumière s’efface sur une mesure devenue entièrement privée."],
      reprise: ["Remerii revient avec l’instrument et vous propose de choisir cette fois les ruptures de cadence. La seconde expérience se déroule côte à côte, plus lente, chaque irrégularité accueillie comme une réussite."],
      closing: ["Le métronome s’arrête enfin sur une pulsation incomplète. Remerii ne tend pas la main pour l’achever ; elle préfère écouter vos souffles retrouver ensemble un rythme ordinaire.", ["Remerii", "Je consigne une conclusion : chez vous, l’imprécision peut devenir une forme d’attention.", "calm"]],
      after: sexText("Elle garde ses doigts posés sous votre nombril, là où le dernier frisson s’apaise.", "Elle écoute votre cœur contre votre poitrine au lieu de recompter les battements.", "Elle vous demande le mot que vous donneriez à cette cadence et accepte la première réponse."),
    },
    {
      id: "bureau-sans-lecon",
      labels: sexText("Installer Remerii sur votre bureau et lui interdire toute leçon", "Faire du bureau le lieu où sa maîtrise change de mains", "Renverser ensemble le protocole sur le bois encore couvert de notes"),
      detail: "Vous prenez l’initiative au bureau, puis Remerii négocie chaque renversement par le désir plutôt que par l’autorité.",
      threshold: ["Vous poussez les livres sur un côté du bureau et y faites asseoir Remerii. Elle regarde une feuille tomber, résiste au réflexe de la ramasser et vous attire entre ses jambes.", ["Remerii", "Je vous préviens : cette utilisation du mobilier compromet plusieurs catégories de classement.", "smirk"]],
      firstMovement: ["Vous défaites ses attaches une à une, sans suivre l’ordre qu’elle aurait choisi. Sa première correction meurt contre votre bouche ; la seconde devient une demande plus courte et beaucoup plus honnête."],
      variation: ["Lorsque le bord du bureau devient inconfortable, vous glissez ensemble sur le tapis. Remerii vous renverse, reprend brièvement l’initiative, puis accepte de la rendre lorsqu’une autre position vous rapproche davantage."],
      tender: ["Votre audace se transforme en attention. Vous embrassez les endroits où sa posture accumule la tension et Remerii se laisse recevoir sans produire ni méthode ni dette."],
      suggestive: ["Le bois froid sous ses cuisses aiguise chacune de vos caresses. Remerii vous guide par des phrases de moins en moins complètes et finit par n’utiliser que votre prénom lorsqu’elle veut davantage."],
      explicit: sexLines(
        ["Vous écartez ses cuisses au bord du bureau et trouvez son intimité de la bouche, d’abord avec une lenteur étudiée puis avec le rythme irrégulier qu’elle n’aurait jamais osé prescrire. Sa perle de plaisir gonfle sous votre langue ; Remerii jouit les doigts crispés sur une feuille restée blanche.", ["Remerii", "Ne classez surtout pas ce résultat. Reproduisez-le.", "smirk"]],
        ["Vous faites glisser Remerii jusqu’au bord, guidez votre sexe dressé vers son écrin humide puis lui laissez régler la première pénétration. Sur le tapis, elle vous chevauche ensuite avec une précision qui se défait à mesure que le plaisir la rend plus franche.", ["Remerii", "La prochaine variation… maintenant. Oui.", "calm"]],
        ["Vous lui demandez les gestes qu’elle veut recevoir et ceux qu’elle souhaite rendre. Le bureau, le tapis puis le lit accueillent une suite de positions adaptées à vos corps, sans modèle fixe, jusqu’à ce que Remerii abandonne toute voix professorale.", ["Remerii", "Cette pratique ne sera enseignée à personne.", "smirk"]],
      ),
      ellipse: ["La dernière feuille rejoint le sol lorsque Remerii vous attire contre elle. Le bureau cesse d’être un lieu de travail et la chronique ferme pudiquement le dossier."],
      reprise: ["Plus tard, Remerii ramasse une seule feuille et vous invite à vous allonger sur le lit. Elle y dessine du doigt trois mouvements dont elle souhaite une reprise, puis froisse le papier avant la fin."],
      closing: ["Au matin, le bureau porte une marque de tasse, une page blanche et un bijou oublié de travers. Remerii choisit de ne réparer aucun de ces indices.", ["Remerii", "Votre mobilier vient de valider une hypothèse très convaincante.", "smirk"]],
      after: sexText("Elle s’endort avec la joue sur votre épaule et une feuille collée à sa hanche.", "Elle laisse sa jambe croisée sur la vôtre au milieu du tapis.", "Elle dessine dans votre paume un signe qui ne figure dans aucun manuel."),
    },
    {
      id: "partition-des-pieces",
      labels: sexText("Composer avec elle une partition qui traverse toutes les pièces", "Laisser chaque porte ouvrir une nouvelle manière de vous rejoindre", "Faire de la maison entière une musique de gestes partagés"),
      detail: "Une route mutuelle et mobile où chaque pièce impose un nouveau tempo, une nouvelle position et une nouvelle initiative.",
      threshold: ["Remerii propose trois notes et vous laisse attribuer chacune à une pièce. Le salon devient lenteur, le couloir surprise et la chambre résolution — classification qu’elle vous autorise aussitôt à trahir."],
      firstMovement: ["Dans le salon, vous vous embrassez debout, mains patientes sous les vêtements. Dans le couloir, Remerii vous plaque contre le mur avec une audace soudaine puis rit de sa propre rupture de méthode."],
      variation: ["Vous atteignez la chambre sans décider qui conduit. Assis·es face à face, vous échangez les gestes comme des phrases musicales, puis roulez côte à côte lorsque la proximité réclame un autre angle."],
      tender: ["La composition reste charnelle mais douce : baisers posés, paumes qui rassurent, jambes mêlées. Chaque silence devient une tenue de note plutôt qu’une interruption."],
      suggestive: ["Vos vêtements marquent le trajet comme des signes de reprise. Remerii utilise le mur, le bord du lit puis votre propre poids pour varier la pression et laisse vos soupirs remplacer toute notation."],
      explicit: sexLines(
        ["Côte à côte, vos cuisses se croisent et vos doigts trouvent tour à tour les plis secrets de l’autre. Remerii reprend sur votre perle de plaisir la cadence que vous venez de lui offrir ; vos bassins pressés ensemble conduisent les deux montées jusqu’à une résolution désordonnée.", ["Remerii", "Deux lignes distinctes. Un accord commun. Je retire toutes mes objections.", "calm"]],
        ["Remerii vous accueille d’abord assise face à vous, son intimité descendant lentement sur votre membre. Vous la renversez ensuite contre les draps, changez la profondeur et la cadence, puis lui rendez la conduite jusqu’à ce que vos plaisirs se répondent.", ["Remerii", "Ne concluez pas seul. Avec moi… maintenant.", "smirk"]],
        ["Vos anatomies composent leur propre contrepoint : pression des cuisses, gestes de la main, bouches offertes puis positions inversées. Aucun rôle ne demeure fixe et Remerii répond à chaque indication en vous donnant la sienne.", ["Remerii", "Notre partition ne réduit personne. Gardons précisément ce désordre.", "calm"]],
      ),
      ellipse: ["La troisième note résonne lorsque la porte de la chambre se ferme. La musique poursuit hors champ, traversée de reprises qu’aucune partition ne pourra conserver."],
      reprise: ["La résolution ne termine rien. Vous repartez vers le salon à demi couvert·es, rejouez la première note beaucoup plus lentement et découvrez qu’une même pièce peut accueillir une tout autre cadence."],
      closing: ["Remerii retrouve au matin les trois notes initiales. Elle en ajoute une quatrième, sans nom, pour le trajet du retour vers le lit.", ["Remerii", "Une maison possède donc sa propre acoustique intime. La vôtre est remarquablement indisciplinée.", "smirk"]],
      after: sexText("Elle suit du doigt la courbe de votre hanche comme une liaison musicale.", "Sa main reste à plat sur votre torse pendant la dernière résonance.", "Elle vous laisse choisir où inscrire la quatrième note sur votre peau."),
    },
  ],

  iriana: [
    {
      id: "audience-renversee",
      labels: sexText("Laisser Iriana tenir une audience privée devant votre désir", "Lui offrir votre corps sans lui céder la maison", "Transformer avec elle l’autorité en jeu charnel choisi"),
      detail: "Iriana mène depuis le grand fauteuil, puis abandonne titres et protocole à mesure que la nuit gagne le tapis et le lit.",
      threshold: ["Iriana dépose son diadème à côté de l’oiseau mécanique et s’installe dans votre fauteuil comme si elle allait recevoir une délégation. Son sourire dément aussitôt la solennité de la posture.", ["Iriana", "Approchez. Cette audience n’aura qu’un seul sujet, et je refuse qu’un secrétaire en rédige le compte rendu.", "smirk"]],
      firstMovement: ["Elle vous garde debout entre ses genoux, ouvre vos vêtements avec un calme souverain et vous fait tourner pour observer ce que son regard provoque lorsque personne d’autre ne peut le voir."],
      variation: ["Le fauteuil cède bientôt la place au tapis. Iriana vous fait allonger, vient au-dessus de vous puis accepte d’être renversée sans perdre la netteté de ses demandes."],
      tender: ["Son autorité devient une manière de prendre soin : elle choisit une couverture, ralentit vos mouvements et vous embrasse jusqu’à ce que la différence entre conduire et suivre cesse d’avoir de l’importance."],
      suggestive: ["Iriana utilise le dossier du fauteuil, la chaleur du tapis et le bord du lit pour faire varier vos appuis. Chacun de ses ordres se raccourcit jusqu’à devenir un souffle contre votre oreille."],
      explicit: sexLines(
        ["À genoux entre vos cuisses, Iriana fait courir deux doigts dans votre intimité humide avant de concentrer sa bouche autour de votre bouton de rose. Elle vous maintient contre le tapis lorsque le plaisir vous cambre et prolonge les contractions avec une lenteur presque impérieuse.", ["Iriana", "Voilà une réponse que personne ne pourra détourner de son sens.", "troubled"]],
        ["Iriana prend votre sexe dressé en main depuis le fauteuil, vous attire entre ses cuisses puis vous accueille lentement dans sa chaleur. Sur le tapis, elle change l’angle en vous chevauchant et garde le regard jusqu’à ce que votre plaisir lui arrache le sien.", ["Iriana", "Ici, je peux réclamer sans gouverner. Donnez-moi encore ce rythme.", "troubled"]],
        ["Iriana vous demande les termes qui appartiennent à votre corps, puis leur donne une traduction en gestes. Elle alterne mains, lèvres et pression de ses hanches, changeant de position avec vous jusqu’à ce que l’autorité ne soit plus qu’un jeu partagé.", ["Iriana", "Aucun protocole. Seulement ce langage-ci.", "calm"]],
      ),
      ellipse: ["L’oiseau mécanique chante faux lorsque vous quittez le fauteuil. Iriana le fait taire d’un coussin, puis la porte de la chambre se referme sur une audience sans archive."],
      reprise: ["Après avoir repris souffle, Iriana refuse que la nuit s’achève sur une seule décision. Elle vous ramène dans le fauteuil, inverse les places et vous ordonne en souriant de lui montrer votre propre manière de mener."],
      closing: ["Le diadème demeure près de l’oiseau jusqu’au matin. Iriana se rhabille d’abord de votre chemise et traverse votre maison avec une souveraineté qui n’appartient plus à la cour.", ["Iriana", "Votre toit n’a pas obéi à la princesse. Il a accueilli la femme. Je reviendrai pour cette insolence.", "smirk"]],
      after: sexText("Elle garde votre cuisse entre les siennes en contemplant le fauteuil déserté.", "Elle repose contre votre épaule, votre souffle encore sensible sous sa paume.", "Elle vous demande quel rôle vous voudrez renverser lors de sa prochaine visite."),
    },
    {
      id: "fenetre-sans-couronne",
      labels: sexText("Faire oublier la cour à Iriana contre la fenêtre de votre logis", "La rejoindre debout face à une ville qui ne peut plus la voir", "Inventer devant la vitre une intimité sans place assignée"),
      detail: "Vous prenez l’initiative près de la fenêtre, puis la ville, les rideaux et le lit deviennent les étapes d’une nuit sans témoin.",
      threshold: ["Vous conduisez Iriana vers la grande fenêtre. Elle observe un instant la ville, puis tire les rideaux à moitié : assez pour disparaître de la cour, pas assez pour perdre la lumière.", ["Iriana", "Je veux savoir ce que cette vue devient lorsqu’elle n’attend plus rien de moi.", "calm"]],
      firstMovement: ["Debout derrière elle, vous défaites les attaches de sa robe et embrassez sa nuque. Iriana appuie ses paumes contre la vitre froide, puis se retourne pour reprendre votre bouche avec une impatience privée."],
      variation: ["Vous passez de la fenêtre au rebord rembourré, Iriana assise à votre hauteur, puis au lit où elle vous attire au-dessus d’elle avant de renverser encore la position."],
      tender: ["Vous explorez sa peau comme un territoire sans emblème. Iriana se laisse admirer sans devoir représenter son peuple et vous garde près d’elle dans la lumière tamisée."],
      suggestive: ["Le verre froid, les rideaux contre son dos puis les draps sous ses hanches offrent trois contrastes qu’Iriana réclame tour à tour. Sa voix perd toute diction officielle lorsque vos mains reviennent entre ses cuisses."],
      explicit: sexLines(
        ["Assise sur le rebord, Iriana ouvre ses cuisses et vous guide jusqu’à son intimité. Vos doigts glissent dans son écrin de chair tandis que votre bouche travaille sa perle sensible ; elle jouit face à la ville cachée, le front contre la vitre et votre nom aux lèvres.", ["Iriana", "Qu’ils gardent leurs fenêtres. Celle-ci connaît enfin ma vérité.", "troubled"]],
        ["Iriana s’appuie contre la vitre et guide votre membre brûlant dans son intimité humide. Le mouvement commence debout, lent et profond, puis se poursuit sur le lit où ses jambes vous rapprochent jusqu’à l’orgasme partagé.", ["Iriana", "Ne regardez pas la ville. Regardez ce qu’elle ne possédera jamais.", "troubled"]],
        ["Près de la fenêtre, vous choisissez ensemble les appuis et les gestes adaptés à vos corps. Les mains deviennent plus précises, les hanches trouvent une friction commune puis le lit reçoit une seconde position, plus ouverte, jusqu’à votre vertige partagé.", ["Iriana", "Cette vue n’a plus aucun pouvoir sur nous.", "calm"]],
      ),
      ellipse: ["Les rideaux se rejoignent lentement autour de vos silhouettes. La ville perd toute visibilité au moment où Iriana vous entraîne du rebord vers le lit."],
      reprise: ["Plus tard, elle rouvre une fente dans les rideaux et vous invite à revenir contre la fenêtre. Cette fois, la posture est plus calme : assis·es ensemble sur le rebord, vos gestes se prolongent sans défi jusqu’à une seconde montée."],
      closing: ["À l’aube, Iriana laisse les rideaux entrouverts. Elle regarde la ville depuis vos draps, sans couronne et sans honte, comme une femme qui a choisi son propre point de vue.", ["Iriana", "Je croyais connaître chaque fenêtre d’Al’Gratal. J’ignorais que la plus libre pouvait appartenir à quelqu’un d’autre.", "calm"]],
      after: sexText("Elle embrasse votre épaule avant de regarder le jour revenir.", "Ses doigts suivent votre flanc tandis que la ville se rallume.", "Elle vous laisse choisir la largeur exacte de l’ouverture dans les rideaux."),
    },
    {
      id: "oiseau-desobeissant",
      labels: sexText("Jouer avec l’oiseau sans blason jusqu’à faire rire Iriana entre deux étreintes", "Laisser sa chanson fausse dicter vos changements de position", "Partager une nuit indocile où aucun corps ne garde la conduite"),
      detail: "Une route mutuelle et joueuse : chaque chant de l’oiseau mécanique impose un renversement, du canapé aux draps.",
      threshold: ["L’oiseau mécanique chante trois notes fausses. Vous décidez que chacune imposera un changement de conduite ; Iriana accepte la règle avec un sérieux qui ne survit pas à la première mélodie."],
      firstMovement: ["Sur le canapé, elle mène le premier baiser et choisit la lenteur. La seconde note vous donne l’initiative : vous la faites glisser contre les coussins et ouvrez sa robe sous son regard amusé."],
      variation: ["À la troisième note, vous gagnez le tapis enlacé·es, puis remontez ensemble vers le lit. Iriana relance elle-même l’oiseau chaque fois que l’un de vous s’installe trop longtemps dans un rôle."],
      tender: ["Le jeu devient une série de tendresses renversées : caresser puis recevoir, tenir puis se laisser tenir. Iriana rit chaque fois que l’oiseau ruine une pose trop solennelle."],
      suggestive: ["Les notes décident qui s’agenouille, qui se cambre et qui prend place au-dessus. Vos vêtements disparaissent dans plusieurs pièces tandis qu’Iriana transforme chaque changement en provocation plus intime."],
      explicit: sexLines(
        ["Vous vous rejoignez en ciseaux sur le tapis, lèvres de rose pressées et cuisses verrouillées. À chaque note, l’angle change ; vos doigts reprennent sur la perle de l’autre le rythme abandonné par vos bassins jusqu’à ce que vos orgasmes se répondent dans un rire brisé.", ["Iriana", "Cet oiseau vient d’obtenir un privilège que le Conseil n’aura jamais.", "smirk"]],
        ["Iriana vous chevauche d’abord sur le canapé, votre membre profondément accueilli dans sa chaleur. Une note la fait rouler sous vous ; la suivante vous ramène assis face à face, et la cadence change jusqu’à ce que chacun fasse céder l’autre.", ["Iriana", "Encore une note. Je refuse que cette partie possède un dernier tour.", "troubled"]],
        ["Chaque chant impose une nouvelle rencontre entre vos anatomies : hanches emboîtées, mains partagées, bouches qui se relaient puis position inversée. Aucun rôle ne dure et votre plaisir commun devient la seule règle stable.", ["Iriana", "Voilà une constitution que je signerais presque.", "smirk"]],
      ),
      ellipse: ["L’oiseau chante une quatrième note impossible. Iriana vous entraîne hors du canapé en promettant une sanction privée ; le récit laisse le petit mécanisme garder le salon."],
      reprise: ["Vous croyez le jeu terminé, mais l’oiseau repart au milieu de la nuit. Iriana ouvre un œil, sourit et réclame que la nouvelle manche se joue plus lentement, côte à côte sous les draps."],
      closing: ["L’oiseau s’arrête enfin, épuisé avant vous. Iriana le remonte une dernière fois puis renonce, préférant écouter le rythme irrégulier de votre respiration.", ["Iriana", "Je le déclarerais objet d’intérêt impérial si cela ne risquait pas de le rendre sérieux.", "smirk"]],
      after: sexText("Elle cale son genou entre vos jambes et s’endort avant la prochaine note.", "Elle laisse sa joue contre votre torse, loin de tout hymne.", "Elle pose l’oiseau entre vos deux oreillers comme un gardien parfaitement incompétent."),
    },
  ],

  valurn: [
    {
      id: "carte-sans-dette",
      labels: sexText("Plaquer la carte blanche contre votre poitrine et laisser Valurn en inventer la règle", "Miser votre chemise, puis chaque pièce de la maison", "Refuser les rôles prévisibles et écrire la règle directement sur sa peau"),
      detail: "Une partie sans dette mène Valurn du fauteuil à la table de jeu, puis au lit où chaque nouvelle règle renverse la précédente.",
      threshold: ["Valurn fait tourner sa carte blanche entre deux doigts. Aucun sceau, aucun nom et aucune dette n’en altèrent la surface.", ["Valurn", "Une règle vierge dans une maison qui vous appartient. Je commence à soupçonner que vous m’avez invité pour me placer en sérieux désavantage.", "charming"]],
      firstMovement: ["Vous lui prenez la carte et la glissez sous sa veste. Valurn vous laisse la récupérer contre sa peau, puis vous attire dans le grand fauteuil avec un baiser qui ressemble moins à un pari qu’à un aveu impatient."],
      variation: ["La partie gagne la table basse : à chaque carte retournée, l’un choisit une nouvelle posture et l’autre une nouvelle façon de le troubler. Le lit n’est atteint qu’après plusieurs détours délibérés.", ["Valurn", "J’avais prévu trois issues. Vous venez d’en inventer une quatrième, nettement plus intéressante.", "charming"]],
      tender: ["Il abandonne les réparties lorsqu’elles deviennent inutiles. Sa bouche revient aux mêmes endroits avec une douceur presque grave, et sa main reste dans la vôtre même lorsqu’aucune règle ne l’exige."],
      suggestive: ["La carte voyage de votre gorge à votre ventre, puis disparaît entre les draps. Valurn prétend vouloir la retrouver ; ses mains explorent beaucoup trop lentement pour que l’excuse reste crédible."],
      explicit: sexLines(
        ["Valurn vous allonge sur la table de jeu, ouvre vos cuisses et fait glisser deux doigts dans votre intimité chaude avant de concentrer sa bouche sur votre point de feu. Au lit, il vous accueille au-dessus de lui et vous laisse choisir l’angle et la cadence jusqu’à ce que vos hanches cessent de jouer.", ["Valurn", "Vous gagnez. Je réclame néanmoins le droit de perdre encore une fois.", "charming"]],
        ["Valurn referme sa main autour de votre sexe dressé et mêle son rythme au vôtre, front contre front. Plus tard, il vous fait pencher contre le bord du lit, prépare longuement votre corps puis s’enfonce avec une lenteur qui transforme chaque centimètre en provocation.", ["Valurn", "Aucune dette. Seulement cette manière très convaincante de me demander de continuer.", "charming"]],
        ["Valurn apprend les prises, les pressions et les profondeurs propres à votre corps sans tenter de les ramener à une catégorie. Sur la table, puis à cheval sur ses hanches, vous échangez la conduite jusqu’à une jouissance qui froisse la carte entre vos paumes.", ["Valurn", "Votre anatomie vient de ruiner toutes mes probabilités. J’en suis ravi.", "charming"]],
      ),
      ellipse: ["Valurn retourne la dernière carte face contre la table. Lorsqu’il vous porte vers la chambre, la chronique accepte que la règle suivante demeure blanche."],
      reprise: ["Après une première accalmie, Valurn retrouve la carte sous l’oreiller et inscrit au charbon : « changer de pièce ». Vous recommencez contre la bibliothèque, plus joueurs, mais sans jamais faire de l’autre un enjeu."],
      closing: ["La carte finit cornée, tachée de charbon et parfaitement dépourvue de valeur marchande. Valurn la replace pourtant avec soin parmi vos objets exposés.", ["Valurn", "Voilà mon bien le plus coûteux : quelque chose que je ne peux ni vendre ni reprendre.", "soft"]],
      after: sexText("Il embrasse l’intérieur de votre cuisse avant de rabattre le drap.", "Il laisse vos jambes mêlées et son sourire contre votre épaule.", "Il trace au doigt une règle nouvelle sur votre hanche sans chercher à la nommer."),
    },
    {
      id: "jeton-sur-la-tranche",
      labels: sexText("Faire tourner le jeton de Valurn sur votre ventre jusqu’à ce qu’il tombe du bon côté", "Utiliser le jeton pour décider lequel de vous cède le fauteuil", "Lancer le jeton tout en refusant qu’il attribue un rôle à votre corps"),
      detail: "Le véritable jeton de Valurn rythme une succession de manches physiques, du tapis au fauteuil puis à la chambre.",
      threshold: ["Vous décrochez le jeton de la première mise et le posez sur sa tranche. Valurn le reconnaît avant même qu’il tombe.", ["Valurn", "Je vous l’avais laissé pour clore une histoire. Vous avez manifestement décidé d’en ouvrir une beaucoup moins raisonnable.", "charming"]],
      firstMovement: ["Pile : vous l’embrassez contre la cheminée. Face : il vous fait reculer jusqu’au tapis. Le métal roule sous un meuble pendant que vos vêtements commencent à baliser le salon."],
      variation: ["Chaque manche change de hauteur : à genoux sur le tapis, assis l’un contre l’autre dans le fauteuil, puis debout contre la porte de la chambre. Valurn rit moins à mesure que vos gestes deviennent précis."],
      tender: ["Le jeton cesse vite d’être nécessaire. Valurn suit votre souffle plutôt que le hasard, vous enveloppe de son corps et laisse la tendresse durer assez longtemps pour révéler tout ce qu’il cachait derrière le jeu."],
      suggestive: ["Le métal froid glisse le long de votre ventre tandis que sa bouche en suit le trajet. Lorsque le jeton disparaît entre les coussins, Valurn poursuit la recherche de ses mains avec une application outrageusement sélective."],
      explicit: sexLines(
        ["Assise sur lui dans le fauteuil, vous guidez son membre brûlant vers votre écrin humide et descendez lentement jusqu’à le recevoir tout entier. Une seconde manche vous mène à quatre pattes sur le lit ; Valurn reprend derrière vous une cadence profonde, sa main revenant sur votre perle de plaisir.", ["Valurn", "Pile, face… quelle importance ? Dans les deux cas, vous me faites perdre le compte.", "charming"]],
        ["Valurn s’agenouille entre vos jambes et travaille votre membre de la bouche jusqu’à vous faire agripper le dossier. Au lit, vous inversez l’avantage : vos mains se referment ensemble autour de vos sexes, puis il vous accueille contre lui dans une position assise où chaque poussée devient un baiser.", ["Valurn", "Je retire tout ce que j’ai dit sur le hasard. Cette précision me convient.", "soft"]],
        ["Le jeton désigne successivement vos mains, vos bouches et le mouvement de vos bassins. Vous adaptez chaque manche aux plaisirs que votre corps réclame, sur le fauteuil puis dans les draps, jusqu’à ce que Valurn laisse tomber la pièce au moment exact où vous vous abandonnez.", ["Valurn", "Cette fois, le hasard a eu l’élégance de se taire.", "soft"]],
      ),
      ellipse: ["Le jeton roule sous le lit. Valurn affirme qu’une fouille minutieuse s’impose ; la porte se ferme avant que la chronique puisse vérifier sa méthode."],
      reprise: ["Vous retrouvez la pièce au milieu de la nuit. Valurn propose une dernière manche sans pile ni face : chacun montre à l’autre le geste qu’il souhaite retrouver, puis le reçoit à son tour."],
      closing: ["Au matin, le jeton repose sur la table, posé à plat pour la première fois. Valurn ne tente ni de le reprendre ni de définir qui a gagné.", ["Valurn", "Gardez-le. Il sait désormais que revenir n’est pas la même chose que réclamer une dette.", "soft"]],
      after: sexText("Sa paume demeure chaude au creux de votre ventre.", "Il pose le jeton sur votre poitrine et écoute votre cœur le déplacer.", "Il referme vos doigts autour du métal avant de se lover contre vous."),
    },
    {
      id: "flamme-noire",
      labels: sexText("Attiser la flamme noire et défier Valurn de garder son calme", "Le pousser contre la bibliothèque avant que le feu ne baisse", "Faire de la chaleur un terrain sans vainqueur ni rôle fixe"),
      detail: "Une route plus intense autour de la cheminée : défi, corps à corps et reprises dans plusieurs pièces, sans magie d’emprise.",
      threshold: ["Valurn allume dans l’âtre une flamme noire qui ne brûle ni le bois ni la peau. Elle ne fait qu’amplifier la chaleur déjà présente dans la pièce.", ["Valurn", "Elle ne force rien. Elle révèle. Dans notre cas, la nuance risque d’être très brève.", "charming"]],
      firstMovement: ["Vous le poussez contre la bibliothèque avant qu’il termine sa phrase. Il répond en vous soulevant contre lui, puis vous repose seulement pour défaire ce que vos mains ne parviennent plus à contourner."],
      variation: ["Le duel traverse le tapis et le canapé. Tantôt Valurn vous maintient sous son regard, tantôt vous le renversez et utilisez l’accoudoir pour changer l’angle de vos corps. La flamme suit chaque reprise."],
      tender: ["Sous la provocation, il reste attentif à chaque souffle. Ses gestes ralentissent lorsqu’il rencontre une ancienne tension et la couvrent de baisers jusqu’à ce qu’elle appartienne au présent."],
      suggestive: ["La chaleur noire fait luire vos peaux. Valurn utilise une écharpe oubliée pour vous rapprocher par les hanches, puis la libère afin que vos mains reprennent la lutte sans arbitre."],
      explicit: sexLines(
        ["Valurn vous installe à califourchon sur l’accoudoir, sa bouche fouillant votre intimité humide jusqu’à votre premier spasme. Il vous retourne ensuite contre le canapé et vous pénètre par longues poussées, une main sous votre ventre, l’autre travaillant votre bouton sensible jusqu’au second vertige.", ["Valurn", "Vous vouliez de l’intensité. Je compte bien rendre le mot insuffisant.", "charming"]],
        ["Face à la bibliothèque, Valurn mêle sa main à la vôtre autour de votre sexe puis descend entre vos cuisses. Vous le renversez ensuite sur le tapis et le chevauchez ; dans la chambre, il reprend votre corps contre le bord du lit avec une profondeur lente, loin de toute précipitation.", ["Valurn", "Voilà un duel dont je signerais volontiers chaque revanche.", "charming"]],
        ["Vos corps trouvent trois prises distinctes autour du canapé : face à face, l’un au-dessus de l’autre, puis enlacés sur le côté. Doigts, bouches et mouvement des hanches s’adaptent à votre anatomie jusqu’à ce que la flamme noire blanchisse sous l’intensité de votre plaisir.", ["Valurn", "Même le feu vient d’admettre sa défaite.", "soft"]],
      ),
      ellipse: ["La flamme noire gagne la chambre avant vous et tire sur les murs un rideau d’ombres mouvantes. Vos silhouettes s’y rejoignent, puis le feu referme l’image."],
      reprise: ["Loin de s’éteindre, le feu devient plus doux après la première jouissance. Vous revenez sur le tapis, enveloppés d’une couverture, et transformez le défi en une longue seconde exploration où chaque reprise change de conduite."],
      closing: ["Valurn éteint l’âtre d’un souffle au lever du jour. La chaleur reste dans la pièce et sur votre peau, débarrassée de toute magie.", ["Valurn", "Votre maison vient de survivre à mon meilleur mauvais jugement. J’en suis presque fier.", "charming"]],
      after: sexText("Il pose un baiser fier sur votre hanche marquée par le tapis.", "Il garde votre taille contre lui lorsque la dernière braise disparaît.", "Il laisse l’écharpe nouée autour de vos deux poignets joints, devenue simple souvenir."),
    },
  ],

  naiah: [
    {
      id: "luciole-et-verite",
      labels: sexText("Suivre la luciole de Naïah partout où elle choisit d’éclairer votre corps", "Laisser sa fausse luciole révéler un désir très réel", "Donner à l’illusion la forme exacte que votre intimité réclame"),
      detail: "La lanterne offerte par Naïah guide une exploration joueuse entre ombres illusoires, canapé et lit véritable.",
      threshold: ["Naïah libère de sa lanterne une luciole violette. L’illusion traverse votre salon, s’attarde sur votre bouche puis se pose au creux de votre gorge.", ["Naïah", "Elle est curieuse, menteuse et beaucoup trop sûre d’être invitée. Aucun rapport avec moi.", "smirk"]],
      firstMovement: ["Vous suivez l’insecte jusqu’au canapé. Chaque fois qu’il se pose sur vous, Naïah embrasse l’endroit désigné ; chaque fois qu’il choisit sa peau, vous lui rendez la règle."],
      variation: ["La luciole multiplie bientôt les fausses portes et les ombres de vos mouvements. Vous quittez le canapé pour le tapis, puis gagnez le lit en ne suivant que la chaleur réelle de la main de Naïah."],
      tender: ["Elle renonce aux images les plus spectaculaires. Une simple nuit étoilée apparaît au plafond tandis qu’elle apprend vos frissons par des caresses patientes et des baisers qui ne cherchent aucun public."],
      suggestive: ["La luciole descend le long de votre ventre et Naïah la suit de la langue. Ses illusions reproduisent autour de vous les poses qu’elle imagine, mais ses mains choisissent la plus intime et la rendent lentement réelle."],
      explicit: sexLines(
        ["Naïah écarte vos lèvres de velours et fait tourner sa langue autour de votre perle de plaisir, guidée par la luciole posée sur votre ventre. Sur le lit, elle vient ensuite entrelacer ses jambes aux vôtres ; vos bassins se frottent en ciseaux jusqu’à une jouissance que l’illusion répète en pluie d’étoiles.", ["Naïah", "La lumière ment. Ton corps, lui, vient de dire quelque chose de magnifique.", "smirk"]],
        ["Naïah prend votre membre dans sa bouche sous une voûte d’étoiles fausses, puis revient à califourchon sur vos hanches. Elle vous accueille lentement, varie l’angle en se penchant contre votre poitrine et accélère lorsque la luciole se met à tournoyer au-dessus du lit.", ["Naïah", "Regarde-moi, pas le ciel. C’est moi qui veux te faire perdre pied.", "smirk"]],
        ["La luciole éclaire tour à tour les zones que vous lui indiquez. Naïah y répond avec ses lèvres, ses doigts puis la pression de son bassin, changeant de position pour épouser votre anatomie jusqu’à ce que les étoiles illusoires éclatent au rythme de votre plaisir.", ["Naïah", "Une vérité assez forte pour faire tomber tout mon décor.", "soft"]],
      ),
      ellipse: ["La luciole entre dans la chambre et referme derrière vous une porte qui n’existait pas une seconde plus tôt. Les étoiles deviennent opaques avant la suite."],
      reprise: ["Naïah fait renaître l’insecte au milieu de la nuit, mais vous lui bandez les yeux avec son propre voile. Sans image à suivre, elle apprend votre maison et votre corps par le toucher dans une reprise plus lente."],
      closing: ["La luciole retourne dans sa lanterne au matin. Naïah la pose près de votre lit et choisit de rester visible, décoiffée, sans aucun paysage pour la protéger.", ["Naïah", "Tu possèdes maintenant le seul endroit où mes illusions savent qu’elles ne sont pas nécessaires.", "soft"]],
      after: sexText("Elle laisse une étoile violette au creux de votre ventre.", "Elle referme vos doigts autour de la lanterne pendant que son souffle ralentit.", "Elle dessine sur votre peau la forme que la luciole devra retenir."),
    },
    {
      id: "portes-mouvantes",
      labels: sexText("Déjouer les fausses portes et rattraper Naïah dans chaque pièce", "La poursuivre dans un logis qui refuse de garder le même plan", "Changer les règles de son labyrinthe avec votre propre désir"),
      detail: "Naïah transforme le logement en labyrinthe sensuel ; vous percez ses illusions et choisissez ensemble où chaque étape devient réelle.",
      threshold: ["Trois portes apparaissent sur le mur du salon. Naïah disparaît derrière celle du milieu, mais son rire vient clairement de la cuisine.", ["Naïah", "Trouve-moi avant que ta maison oublie où se trouve la chambre.", "smirk"]],
      firstMovement: ["Vous la rattrapez près du plan de travail et l’embrassez avant qu’elle puisse déplacer le décor. Naïah riposte en faisant surgir derrière vous un matelas de brume qui devient ferme au moment de vous recevoir."],
      variation: ["Le labyrinthe alterne cuisine, corridor de forêt et véritable chambre. Chaque illusion dissoute révèle une nouvelle position : debout contre un mur, à genoux sur le tapis, puis enlacés face à face dans les draps."],
      tender: ["Vous cessez de courir et ouvrez simplement les bras. Naïah laisse tomber toutes les fausses portes, vient s’y réfugier et transforme le jeu en lente reconnaissance de vos peaux."],
      suggestive: ["Chaque porte gagnée coûte un vêtement. Naïah entretient le vertige avec des mains réelles derrière des doubles illusoires, jusqu’à ce que vous reconnaissiez sa présence à la seule façon dont elle vous fait frissonner."],
      explicit: sexLines(
        ["Dans la cuisine redevenue réelle, Naïah vous fait asseoir sur le plan de travail et plonge deux doigts dans votre intimité humide pendant que sa langue travaille votre bourgeon charnel. Au lit, vous la renversez, glissez une cuisse entre les siennes et faites se rejoindre vos plaisirs dans un frottement de plus en plus serré.", ["Naïah", "Tu as trouvé la sortie. Quel dommage que je n’aie aucune envie de te laisser partir.", "smirk"]],
        ["Naïah vous attire contre le mur, sa main et sa bouche faisant durcir votre sexe avant qu’elle ne vous guide dans sa chaleur. Elle change le décor à chaque nouvelle profondeur — forêt, palais, nuit violette — tandis que sa position reste réelle, jambes nouées autour de vos hanches.", ["Naïah", "Tout le reste peut bouger. Pas toi. Continue.", "troubled"]],
        ["À travers trois pièces mouvantes, Naïah alterne bouche, mains et contact de ses cuisses selon les réponses de votre corps. Vous la rejoignez sur le côté, au-dessus d’elle puis assis l’un contre l’autre, jusqu’à ce que le labyrinthe s’effondre dans votre jouissance commune.", ["Naïah", "Enfin une carte que même moi je ne veux plus changer.", "soft"]],
      ),
      ellipse: ["Vous ouvrez la dernière porte sur votre propre chambre, transformée en clairière violette. Naïah vous y entraîne et la brume referme doucement le passage."],
      reprise: ["Après avoir retrouvé le vrai plafond, vous inversez le jeu : vous bandez les yeux de Naïah et lui faites deviner chaque pièce par les sons, les textures et la manière différente dont vous l’y embrassez."],
      closing: ["Au matin, toutes les portes ont repris leur place. Naïah en dessine pourtant une minuscule au charbon près de votre lit, réservée à la prochaine nuit.", ["Naïah", "Elle ne mène nulle part. C’est précisément pour ça que j’ai envie de l’ouvrir avec toi.", "soft"]],
      after: sexText("Elle s’endort avec une cuisse encore prise entre les vôtres.", "Elle laisse sa paume sur votre ventre comme unique repère du labyrinthe.", "Elle murmure le vrai nom de chacune de vos sensations avant de fermer les yeux."),
    },
    {
      id: "miroir-de-brume",
      labels: sexText("Demander à la brume de ne montrer que ce que Naïah n’ose pas réclamer", "Briser son reflet théâtral par un désir sans détour", "Faire du miroir un paysage où vos corps ne jouent aucun rôle imposé"),
      detail: "Un miroir de brume révèle les désirs cachés de Naïah ; la scène passe du fauteuil au tapis puis au lit, sans spectacle extérieur.",
      threshold: ["Naïah tend une nappe de brume devant le miroir. Son reflet y apparaît couronné, moqueur, parfaitement invulnérable. Elle souffle dessus jusqu’à ne garder que son regard.", ["Naïah", "Je connais toutes mes jolies versions. Ce soir, je voudrais voir celle qui reste après.", "troubled"]],
      firstMovement: ["Vous l’asseyez devant le miroir et dénouez lentement ce qu’elle porte comme une armure. Naïah regarde vos mains dans le reflet, puis se retourne pour vous embrasser sans laisser la brume embellir le geste."],
      variation: ["Le fauteuil devient trop étroit. Vous glissez sur le tapis, Naïah au-dessus de vous, avant qu’elle ne vous entraîne au lit et change encore la conduite en vous offrant son dos puis son visage."],
      tender: ["Le miroir n’affiche plus que vos deux silhouettes enlacées. Vous embrassez chacune de ses hésitations et Naïah répond par une tendresse dépouillée de tout effet de scène."],
      suggestive: ["La brume encadre vos corps sans les modifier. Naïah observe votre main descendre entre ses cuisses, puis guide la sienne sur vous avec une franchise qui rend le reflet plus brûlant que n’importe quelle illusion."],
      explicit: sexLines(
        ["Face au miroir, Naïah se place derrière vous et glisse ses doigts dans votre fente de velours tout en maintenant votre regard dans le reflet. Au lit, elle vous rejoint ventre contre ventre ; vos cuisses s’emboîtent et vos perles sensibles se cherchent jusqu’à un orgasme vu, senti et cette fois impossible à maquiller.", ["Naïah", "Voilà. Moi, sans couronne. Toi, sans détour.", "troubled"]],
        ["Naïah vous fait asseoir face au miroir et prend votre membre entre ses lèvres, attentive au reflet de votre plaisir. Elle vient ensuite au-dessus de vous, vous reçoit profondément et poursuit en vous tournant vers elle afin que le dernier vertige n’appartienne qu’à vos regards.", ["Naïah", "Le reflet peut tout voir. Il n’emportera rien.", "soft"]],
        ["Devant le miroir, Naïah suit chaque indication de votre corps avec ses doigts et sa bouche, puis vous rejoint sur le tapis dans une position où vos bassins peuvent se répondre. La dernière reprise a lieu dans le lit, hors du reflet, au rythme que vous avez découvert ensemble.", ["Naïah", "Je n’avais pas besoin d’une plus belle image. Seulement de celle-ci.", "soft"]],
      ),
      ellipse: ["La brume couvre le miroir lorsque vos vêtements touchent le tapis. Elle ne se dissipera qu’après que la chambre aura retrouvé le silence."],
      reprise: ["Naïah efface le miroir pour la seconde reprise. Elle choisit de vous regarder directement, assise sur vos cuisses, et refait lentement les gestes que le reflet avait rendus trop vertigineux."],
      closing: ["Le miroir ordinaire vous rend deux visages fatigués et heureux. Naïah rit de ses cheveux en bataille au lieu de les corriger d’un charme.", ["Naïah", "Ne le remplace jamais par un miroir magique. Celui-ci vient enfin d’apprendre la vérité.", "soft"]],
      after: sexText("Elle essuie du pouce une trace de brume sur votre hanche.", "Elle pose sa joue contre votre épaule et contemple le reflet immobile.", "Elle laisse votre silhouette choisir seule la forme qu’elle gardera dans le miroir."),
    },
  ],

  lineva: [
    {
      id: "cle-de-la-releve",
      labels: sexText("Tourner la clé de la relève et attirer Lineva loin de toutes ses cartes", "Fermer le coffre des rapports avant de la soulever contre le bureau", "Confier les ordres à la clé et inventer avec elle une nuit sans grade"),
      detail: "Lineva dépose enfin sa garde : une scène directe et patiente entre bureau, fenêtre maritime et lit.",
      threshold: ["Lineva pose la clé de la relève sur vos rapports, ferme le coffre et vérifie deux fois le déclic. Pour la première fois depuis son arrivée, ses épaules descendent.", ["Lineva", "J’ai confié la ville jusqu’à l’aube. Si je regarde encore cette serrure, embrasse-moi avant que je recommence.", "determined"]],
      firstMovement: ["Vous obéissez assez vite pour lui arracher un rire bref. Lineva vous plaque ensuite contre le bureau, défait vos vêtements avec l’efficacité d’un uniforme et ralentit volontairement au contact de votre peau."],
      variation: ["Vous quittez le bois dur pour le tapis, puis le rebord de la fenêtre où le bruit de la mer couvre vos souffles. Au lit, Lineva accepte enfin de s’allonger sans surveiller la porte."],
      tender: ["Vous massez la tension accumulée dans son dos avant de la couvrir de baisers. Lineva reçoit sans commander, puis vous attire contre elle pour rendre chaque attention avec une application silencieuse."],
      suggestive: ["Sa discipline devient une précision charnelle : doigts au creux de vos hanches, bouche sur votre gorge, genou entre vos cuisses. Chaque fois qu’elle cherche la porte des yeux, vous ramenez son regard à vous."],
      explicit: sexLines(
        ["Lineva vous fait asseoir sur le bureau et explore votre intimité de deux doigts fermes avant de descendre jusqu’à votre perle de plaisir. Sur le lit, elle se place entre vos cuisses avec un coussin sous vos hanches et reprend bouche et doigts jusqu’à faire céder toute la tension qu’elle avait retenue.", ["Lineva", "La ville tient. Toi aussi… jusqu’à ce que je te demande le contraire.", "determined"]],
        ["Lineva prend votre sexe dressé dans sa paume et maintient un rythme précis jusqu’à ce que vous la tiriez au bord du bureau. Plus tard, elle vous accueille dans le lit, jambes hautes contre vos flancs, puis vous fait rouler pour chevaucher elle-même la seconde cadence.", ["Lineva", "Pas de manœuvre parfaite. Seulement celle qui nous garde ensemble.", "soft"]],
        ["Lineva suit les réactions de votre corps comme une carte qu’elle refuse de conquérir : mains, bouche, pression des cuisses puis position face à face dans les draps. Vous échangez la conduite à chaque reprise jusqu’à atteindre ensemble un calme plus profond que le sommeil.", ["Lineva", "Je retiendrai ce chemin. Pas pour le commander — pour savoir revenir.", "soft"]],
      ),
      ellipse: ["Lineva laisse la clé sur le bureau et vous suit dans la chambre sans se retourner. La mer remplit le silence lorsque la porte se ferme."],
      reprise: ["Un bruit du port la réveille. Vous lui montrez la serrure toujours fermée, puis elle revient vers vous avec une lenteur nouvelle et choisit une seconde position où elle peut enfin vous tourner le dos sans crainte."],
      closing: ["À l’aube, Lineva ouvre le coffre mais ne prend aucun rapport. Elle glisse plutôt la clé dans votre main et reste encore quelques minutes sous les draps.", ["Lineva", "Garde-la jusqu’à mon départ. J’ai découvert qu’une relève pouvait aussi être un endroit.", "soft"]],
      after: sexText("Elle embrasse votre paume refermée sur la clé.", "Elle garde votre bras autour de sa taille face à la fenêtre.", "Elle compte vos respirations plutôt que les cloches du port."),
    },
    {
      id: "noeud-de-port",
      labels: sexText("Défaire sur Lineva chaque nœud qu’elle sait faire les yeux fermés", "Lui apprendre un nœud qui rapproche au lieu de retenir", "Utiliser l’écharpe de quart comme lien souple entre vos deux corps"),
      detail: "Une leçon de nœuds marins devient un jeu de proximité sur le tapis, le fauteuil et le lit, pensé autour de Lineva.",
      threshold: ["Lineva sort une corde fine de son sac et réalise un nœud de chaise sans regarder. Vous tirez sur la boucle ; elle tient parfaitement.", ["Lineva", "Un bon nœud protège sans étrangler. C’est probablement la phrase la plus romantique que Forthaven m’ait apprise.", "soft"]],
      firstMovement: ["Vous remplacez la corde par son écharpe de quart et enroulez doucement vos poignets ensemble. Lineva teste le jeu d’une traction, vous rapproche et transforme la démonstration en baiser."],
      variation: ["Le lien passe à vos tailles, puis à une cheville contre la sienne. Il ne vous immobilise jamais : il indique seulement la direction suivante, du tapis au fauteuil puis aux draps."],
      tender: ["Vous défaites chaque nœud avant d’en former un autre, ponctuant le jeu de caresses lentes. Lineva s’amuse de pouvoir être retenue uniquement par la promesse de revenir contre vous."],
      suggestive: ["L’écharpe glisse sous ses seins, autour de vos hanches puis entre vos mains jointes. Lineva utilise la tension du tissu pour guider vos corps dans des angles qu’un lit trop sage n’aurait pas proposés."],
      explicit: sexLines(
        ["Lineva fixe l’écharpe autour de votre cuisse ouverte et s’agenouille entre vos jambes. Sa langue se concentre sur votre bouton de rose tandis que deux doigts remplissent votre intimité ; au fauteuil, elle vous installe au-dessus d’elle et vos plis humides se frottent jusqu’à une seconde montée.", ["Lineva", "Tiens la boucle. Je m’occupe du reste.", "determined"]],
        ["L’écharpe rapproche vos hanches pendant que Lineva fait glisser sa paume sur votre membre. Elle vous guide ensuite en elle, assise sur le fauteuil face à vous, puis vous entraîne au lit où le tissu autour de vos tailles maintient une profondeur régulière jusqu’à l’orgasme.", ["Lineva", "Voilà un nœud qui mérite de survivre au quart.", "troubled"]],
        ["Lineva noue l’écharpe de façon à rapprocher vos bassins sans définir lequel doit mener. Vos mains et vos bouches complètent la prise, puis vous changez ensemble de position sur le lit jusqu’à ce que le tissu se détende sous vos corps comblés.", ["Lineva", "Protection, mobilité, plaisir… Bon sang. Je vais devoir ajouter ce nœud à une liste que personne d’autre ne verra.", "soft"]],
      ),
      ellipse: ["Lineva vérifie une dernière fois le nœud, puis tire l’écharpe et vous entraîne derrière la porte. Le tissu bleu reste seul visible dans l’entrebâillement avant que celui-ci disparaisse."],
      reprise: ["La boucle s’est défaite pendant votre premier abandon. Vous la renouez ensemble, cette fois autour de vos chevilles mêlées, et reprenez sur le côté dans un rythme calme dicté par la mer."],
      closing: ["L’écharpe sèche au dossier d’une chaise. Lineva y refait le nœud appris cette nuit, moins utile en mer mais infiniment plus personnel.", ["Lineva", "Je ne l’enseignerai à aucun équipage. Certaines techniques peuvent rester à la maison.", "soft"]],
      after: sexText("Elle défait le dernier tour autour de votre cuisse avec les lèvres.", "Elle laisse la boucle reposer sur vos hanches rapprochées.", "Elle glisse un doigt sous le tissu pour garder entre vous un espace exactement choisi."),
    },
    {
      id: "maree-interieure",
      labels: sexText("Suivre Lineva à travers chaque pièce au rythme d’une marée montante", "La défier de laisser le roulis décider de vos appuis", "Transformer le logement en navire dont vous partagez la barre"),
      detail: "Une nuit mobile au rythme de la mer : équilibre, changements d’appui et longues reprises propres à la commandante.",
      threshold: ["Lineva ouvre la fenêtre. Le vent salé traverse le logis et fait osciller la maquette de son premier navire.", ["Lineva", "À bord, on apprend à bouger avec le sol. Ici, le sol ne bouge pas. Il va falloir lui apprendre.", "determined"]],
      firstMovement: ["Elle vous prend par la taille et improvise un roulis. Vous reculez ensemble jusqu’au mur, puis au canapé, en transformant chaque perte d’équilibre en étreinte plus serrée."],
      variation: ["La marée imaginaire gagne la table, le tapis puis la chambre. Lineva change vos appuis avec une sûreté de marin : debout, assis face à face, enfin allongés sur le côté lorsque le rythme devient plus profond."],
      tender: ["Le jeu se calme comme une mer après l’orage. Lineva berce vos corps enlacés, embrasse votre front puis vos épaules, et laisse le mouvement servir uniquement à vous rapprocher."],
      suggestive: ["Chaque roulis presse vos hanches l’une contre l’autre. Lineva utilise la table comme rambarde, le canapé comme pont incliné et le lit comme cabine où aucun ordre ne franchit la porte."],
      explicit: sexLines(
        ["Sur le canapé, Lineva glisse sa cuisse contre votre intimité humide et maintient un mouvement de houle pendant que ses doigts trouvent votre point de feu. Au lit, vous vous placez tête-bêche ; vos bouches se répondent jusqu’à deux orgasmes rapprochés par le même roulis.", ["Lineva", "Même cap. Même vague. Ne ralentis pas.", "determined"]],
        ["Lineva vous attire debout contre la table, referme sa main sur votre sexe puis se tourne pour vous accueillir entre ses cuisses. La chambre reçoit la seconde position : couchée sur le côté devant vous, elle guide chaque poussée profonde au rythme des vagues du port.", ["Lineva", "Garde ce cap… encore trois mouvements… maintenant.", "determined"]],
        ["Vous trouvez ensemble une houle adaptée à vos corps : friction des bassins contre le canapé, mains précises au bord de la table, puis étreinte latérale dans le lit. Lineva maintient le rythme commun jusqu’à ce que vos souffles se brisent sur la même vague.", ["Lineva", "On peut tenir sans rester immobile. Souviens-t’en.", "soft"]],
      ),
      ellipse: ["La maquette tangue lorsque Lineva vous emporte vers la chambre. Le rideau gonflé par le vent couvre la suite comme une voile."],
      reprise: ["La marée redescend, puis remonte avant l’aube. Vous reprenez sur le côté, plus lentement, Lineva derrière vous et sa main entre vos cuisses pendant que la vraie mer impose sa cadence."],
      closing: ["Lineva referme la fenêtre après le lever du soleil. La maquette retrouve son équilibre ; vous restez encore enlacés comme si le sol continuait à rouler.", ["Lineva", "Je croyais savoir rentrer au port. Cette maison vient de donner au mot un autre sens.", "soft"]],
      after: sexText("Elle pose votre main sur la maquette avant de la ramener à sa hanche.", "Elle s’endort le front contre votre dos, bercée par la mer réelle.", "Elle laisse vos jambes choisir seules la position où le roulis s’apaise."),
    },
  ],

  saidin: [
    {
      id: "montre-sans-demain",
      labels: sexText("Arrêter la montre sur votre souffle et laisser Saidin habiter chaque seconde", "Poser la montre sur son cœur avant de lui offrir tout le présent", "Inventer une heure qui n’appartient qu’à vos deux corps"),
      detail: "Saidin renonce à regarder plus loin que la pièce ; la montre offerte rythme une scène lente entre fauteuil, bureau et lit.",
      threshold: ["Saidin pose la montre qui ignore demain entre vous. Son aiguille n’avance que lorsque l’un de vous respire.", ["Saidin", "Pour une fois, je ne connais pas la minute suivante. J’aimerais la découvrir exactement ici.", "mysterious"]],
      firstMovement: ["Vous posez la montre contre son cœur et l’embrassez au premier battement. Saidin répond sans sa distance habituelle, vous attire dans le fauteuil et laisse l’aiguille s’affoler avec vos souffles."],
      variation: ["Le présent change de forme au bureau, où vous le faites asseoir parmi ses notes inutiles, puis au lit, face à face, sans aucun futur assez pressant pour interrompre vos mains."],
      tender: ["Saidin apprend la lenteur sans la prévoir. Il embrasse chaque endroit comme s’il venait de le découvrir et garde votre front contre le sien durant les silences."],
      suggestive: ["L’aiguille bondit lorsque ses doigts glissent sous vos vêtements. Il recommence au même endroit pour vérifier le phénomène, puis sourit en constatant que votre corps lui offre une réponse différente."],
      explicit: sexLines(
        ["Saidin vous installe au bord du bureau et fait glisser ses doigts dans votre intimité humide, sa bouche suivant les contractions de votre perle sensible plutôt que l’aiguille. Dans le lit, il se couche sous vous ; vous le chevauchez et choisissez une profondeur lente jusqu’à ce que la montre cesse de compter.", ["Saidin", "Je ne savais pas quand cela arriverait. C’est infiniment meilleur ainsi.", "troubled"]],
        ["Saidin referme ses doigts autour de votre membre dressé et change le rythme chaque fois que la montre hésite. Au lit, vous venez assis contre lui ; vos corps se rejoignent dans une pénétration lente, puis basculent sur le côté pour prolonger chaque mouvement jusqu’à votre abandon.", ["Saidin", "Reste dans cette seconde. Elle est assez vaste pour nous deux.", "troubled"]],
        ["Saidin suit les réponses particulières de votre anatomie avec ses mains et sa bouche, sans anticiper la suivante. Vous changez deux fois de position entre le bureau et le lit ; l’aiguille s’immobilise au moment où votre plaisir atteint le sien.", ["Saidin", "Aucun avenir n’aurait pu m’apprendre cette manière de te connaître.", "soft"]],
      ),
      ellipse: ["Saidin ferme le boîtier de la montre. Le clic devient la dernière mesure publique avant que la chambre n’accueille la suite."],
      reprise: ["Au milieu de la nuit, l’aiguille repart. Vous recommencez sur le côté, plus calmement, Saidin derrière vous et entièrement attentif au seul mouvement qu’il peut sentir."],
      closing: ["La montre indique une heure impossible au matin. Saidin refuse de la corriger et la replace parmi vos objets.", ["Saidin", "Elle ne mesure rien d’utile. C’est pourquoi cette heure est exacte.", "soft"]],
      after: sexText("Il compte vos frissons du bout des lèvres, jamais au-delà du présent.", "Il garde la montre sur votre poitrine jusqu’à ce que vos battements ralentissent.", "Il vous demande quel nom votre corps donne à cette heure et retient votre réponse."),
    },
    {
      id: "avenir-aveugle",
      labels: sexText("Bander les yeux de l’archimage et lui interdire de regarder plus loin que vos mains", "Lui retirer toute avance en guidant ses gestes dans le noir", "Faire de l’inconnu un jeu où votre corps donne seul les repères"),
      detail: "Privé de vision et de prescience, Saidin découvre votre logement et votre désir par le toucher, dans trois espaces distincts.",
      threshold: ["Vous nouez un foulard devant les yeux de Saidin. La magie temporelle autour de lui se tait comme une horloge privée de ressort.", ["Saidin", "Je n’ai devant moi ni image ni lendemain. Seulement la chaleur de votre main. Continuez.", "mysterious"]],
      firstMovement: ["Vous le guidez jusqu’au mur du salon, placez ses mains sur vos hanches et l’embrassez avant de déplacer votre corps. Saidin vous retrouve au souffle, étonné chaque fois que la réalité refuse d’être anticipée."],
      variation: ["Le jeu traverse le tapis, le fauteuil puis le lit. Vous changez d’appui sans l’avertir ; Saidin apprend à suivre votre peau plutôt qu’une possibilité future et gagne en assurance à chaque découverte."],
      tender: ["Ses mains deviennent délicates, presque révérentes. Il reconnaît votre visage, vos épaules et vos flancs sans jamais chercher à deviner la suite, puis vous demande de lui décrire seulement ce qui existe maintenant."],
      suggestive: ["Le foulard aiguise chacun de ses autres sens. Sa bouche suit votre parfum jusqu’à votre ventre ; ses doigts retrouvent les zones qui font changer votre respiration et y reviennent avec une précision apprise, non prédite."],
      explicit: sexLines(
        ["Toujours aveugle, Saidin s’agenouille et explore les lèvres de votre rose du bout des doigts avant d’y poser sa bouche. Vous le conduisez ensuite au lit, venez vous placer au-dessus de lui et guidez son sexe dans votre chaleur, variant vous-même profondeur et cadence jusqu’au plaisir partagé.", ["Saidin", "Je ne vois rien… et pourtant je n’ai jamais été aussi exactement avec vous.", "troubled"]],
        ["Vous placez sa main autour de votre sexe et changez le rythme dès qu’il croit l’avoir compris. Saidin vous attire ensuite sur le lit, vous reçoit entre ses cuisses et vous guide par la voix dans une étreinte profonde où vos positions s’inversent sans aucune vision d’avance.", ["Saidin", "Surprends-moi encore. Le présent n’a jamais été aussi charnel.", "troubled"]],
        ["Vous apprenez à Saidin les repères propres à votre anatomie en déplaçant ses doigts, ses lèvres puis ses hanches. Sans image ni préscience, il répond au souffle et à la tension de votre corps jusqu’à une jouissance qui le laisse souriant sous le foulard.", ["Saidin", "Je veux garder l’inconnu exactement comme cela.", "soft"]],
      ),
      ellipse: ["Saidin accepte le foulard et votre main. Vous l’emmenez jusqu’à la chambre ; la chronique partage avec lui l’élégance de ne rien voir de plus."],
      reprise: ["Après avoir retiré le foulard, Saidin vous le noue doucement à votre tour. Il reprend les gestes que vous lui avez appris, mais change leur ordre afin que l’inconnu vous appartienne aussi."],
      closing: ["Le foulard repose sur le bureau au lever du jour. Saidin regarde enfin la pièce sans chercher aucune trace de ce qui suivra.", ["Saidin", "Je reviendrai sans consulter la route. Voilà peut-être la promesse la plus difficile que je puisse faire.", "soft"]],
      after: sexText("Il reconnaît votre sourire au toucher avant de dénouer le tissu.", "Il replace le foulard autour de votre poignet comme un bracelet sans prophétie.", "Il laisse vos doigts décrire sur sa paume l’unique chemin qu’il devra retenir."),
    },
    {
      id: "boucle-imparfaite",
      labels: sexText("Rejouer le même baiser en changeant chaque fois la suite", "Entrer dans une boucle que votre désir rend volontairement imparfaite", "Déformer avec Saidin une répétition jusqu’à ce qu’elle ne ressemble qu’à vous"),
      detail: "Une petite boucle temporelle rejoue le début, mais vos initiatives transforment chaque répétition en route sensuelle différente.",
      threshold: ["Saidin embrasse votre joue. La montre tinte et vous ramène trois secondes en arrière. Cette fois, vous tournez la tête : le baiser trouve votre bouche.", ["Saidin", "Une boucle minuscule. Nous pouvons la briser… ou l’éduquer.", "mysterious"]],
      firstMovement: ["À chaque reprise, vous changez un geste : une main sous sa chemise, son dos contre la porte, votre cuisse entre les siennes. La boucle cède lorsque le désir devient trop complexe pour être répété."],
      variation: ["Libérés, vous poursuivez comme si chaque pièce était une nouvelle version du présent : assis au sol, debout contre la bibliothèque, puis allongés de travers sur le lit."],
      tender: ["Vous rejouez volontairement les caresses qui vous ont plu, sans jamais reproduire exactement leur rythme. Saidin découvre qu’une répétition attentive peut être une mémoire plutôt qu’une prison."],
      suggestive: ["Chaque variante déplace une bouche, une cuisse ou une main plus près de votre désir. Saidin laisse les possibilités s’empiler jusqu’à ne plus pouvoir distinguer laquelle a fait naître le premier gémissement."],
      explicit: sexLines(
        ["Une boucle ramène trois fois les doigts de Saidin autour de votre perle de plaisir ; vous changez l’angle de vos hanches à chaque retour. Quand le temps se libère, il vous pénètre sur le côté dans les draps et prolonge les mouvements appris jusqu’à une jouissance sans répétition possible.", ["Saidin", "Celle-ci n’est arrivée qu’une fois. Je veux m’en souvenir ainsi.", "soft"]],
        ["Vous faites varier chaque reprise autour de votre membre : sa main, sa bouche, puis vos deux paumes réunies. Au lit, Saidin s’assoit au-dessus de vous et vous accueille contre lui ; la dernière cadence change sans cesse jusqu’à l’orgasme qu’aucune boucle ne peut retenir.", ["Saidin", "Enfin un événement qui refuse de devenir une habitude.", "troubled"]],
        ["La boucle vous permet d’essayer plusieurs pressions et positions adaptées à votre corps, mais vous ne gardez que celles qui font naître une réponse réelle. Sur le lit, Saidin en compose une suite nouvelle et vos plaisirs rompent ensemble le dernier retour.", ["Saidin", "Ton corps vient de choisir un avenir que je n’avais pas vu.", "soft"]],
      ),
      ellipse: ["La montre tinte une dernière fois lorsque vous tombez ensemble sur le lit. Le temps referme alors la boucle autour de la chambre, hors de toute observation."],
      reprise: ["Vous tentez de rejouer la première étreinte, mais aucun de vous ne respecte l’ordre. La seconde reprise devient plus inventive, lente, ponctuée de rires lorsque la mémoire se trompe heureusement."],
      closing: ["Saidin casse la boucle au matin en déplaçant simplement la montre. Le jour avance ; aucune version de vous ne reste prisonnière derrière.", ["Saidin", "La meilleure répétition fut celle où nous avons cessé de nous répéter.", "soft"]],
      after: sexText("Il embrasse une dernière fois le même endroit, avec une douceur entièrement nouvelle.", "Il suit sur votre torse le trajet de la boucle avant de l’effacer.", "Il garde votre main contre la sienne pour sentir le temps avancer sans la mesurer."),
    },
  ],

  bellirith: [
    {
      id: "miroir-honnete",
      labels: sexText("Faire asseoir Bellirith devant son miroir honnête et choisir ce qui mérite d’être regardé", "Lui montrer dans le miroir le désir qu’aucun charme n’a fabriqué", "Utiliser le reflet pour célébrer vos corps sans les corriger"),
      detail: "Sans aura ni embellissement, Bellirith affronte un reflet réel avant de transformer le miroir, la coiffeuse et le lit en scène privée.",
      threshold: ["Bellirith pose son miroir au tain honnête sur la coiffeuse. Le reflet refuse ses charmes et lui rend seulement son visage attentif.", ["Bellirith", "Cet objet manque cruellement de flatterie. Dis-moi que toi, tu sais mieux regarder.", "seductive"]],
      firstMovement: ["Vous vous placez derrière elle et montrez du bout des doigts ce qui vous attire sans magie : sa nuque tendue, son sourire incertain, la chaleur réelle sous sa peau. Bellirith vous ramène dans le reflet par un baiser."],
      variation: ["Elle s’assoit sur la coiffeuse, vous attire entre ses genoux puis vous fait glisser avec elle sur le tapis. Le lit accueille la dernière position, face au miroir mais loin de tout public."],
      tender: ["Bellirith cesse de poser. Vous embrassez ses imperfections une à une et elle vous rend la même attention, découvrant qu’admirer n’exige ni mensonge ni emprise."],
      suggestive: ["Elle regarde dans le miroir vos mains ouvrir ses vêtements et les siennes descendre sur vous. Chaque mouvement reste visible, mais aucun reflet n’ose décider lequel de vous est le spectacle."],
      explicit: sexLines(
        ["Bellirith vous installe devant le miroir, ouvre votre intimité humide de ses doigts et garde votre regard tandis que sa bouche trouve votre perle de plaisir. Au lit, elle mêle ses cuisses aux vôtres ; vos bassins glissent l’un contre l’autre jusqu’à ce que le reflet saisisse deux jouissances sans les embellir.", ["Bellirith", "Regarde bien : rien de ce plaisir ne vient de mon aura.", "troubled"]],
        ["Bellirith prend votre sexe dressé en main devant le miroir puis se penche pour le recevoir entre ses lèvres. Elle vous conduit ensuite au lit, s’assoit sur vous face au reflet et règle la pénétration d’un mouvement ample jusqu’à perdre elle-même toute expression calculée.", ["Bellirith", "Voilà le visage que je ne montre jamais. Garde-le pour toi.", "troubled"]],
        ["Dans le miroir, Bellirith observe les gestes précis que vous choisissez pour votre anatomie et les reproduit avec sa bouche et ses mains. Vous vous rejoignez ensuite sur le lit dans deux positions différentes, gardant le reflet comme témoin muet jusqu’à votre plaisir commun.", ["Bellirith", "Aucun charme. Aucun mensonge. Seulement nous.", "soft"]],
      ),
      ellipse: ["Bellirith retourne le miroir vers le mur au moment où vous quittez la coiffeuse. Ce n’est pas de la pudeur : simplement le choix de ne plus partager votre attention."],
      reprise: ["Plus tard, elle remet le miroir face au lit, mais vous éteignez toutes les lumières sauf une bougie. La seconde reprise devient une étude lente de silhouettes, de mains et de voix dépouillées de tout artifice."],
      closing: ["Au matin, Bellirith ne corrige ni ses cheveux ni le drap froissé dans le reflet. Elle sourit à l’image parce qu’elle en connaît désormais l’histoire.", ["Bellirith", "Je pensais t’offrir un miroir. Il semble que tu m’aies offert le reflet.", "soft"]],
      after: sexText("Elle trace du rouge sur votre hanche plutôt que sur ses lèvres.", "Elle repose contre vous en observant la vérité de vos souffles.", "Elle demande quel détail de votre reflet vous souhaitez qu’elle garde en mémoire."),
    },
    {
      id: "parfum-sans-aura",
      labels: sexText("Choisir trois parfums et laisser Bellirith les suivre sur votre peau", "Déposer le parfum sur elle avant d’en effacer chaque trace par vos baisers", "Composer une senteur intime qui n’appartient à aucun genre ni pouvoir"),
      detail: "Bellirith abandonne son aura pour un jeu de parfums très physique, de la table au bain puis aux draps.",
      threshold: ["Bellirith aligne trois fioles : cendre, rose nocturne et épices de Forthaven. Son aura demeure volontairement muette.", ["Bellirith", "Ce soir, si tu me suis, ce sera à cause d’un parfum choisi — et de mes très mauvaises intentions.", "seductive"]],
      firstMovement: ["Vous déposez une goutte au creux de son poignet, une autre sous sa gorge. Elle marque votre peau à son tour et suit chaque senteur de la bouche jusqu’à ce que les fioles deviennent inutiles."],
      variation: ["L’huile conduit vos mains sur la table, puis jusqu’au bain où vous effacez les parfums sans effacer le désir. Vous gagnez le lit enveloppés seulement de serviettes vite abandonnées."],
      tender: ["Vous choisissez les senteurs qui réveillent des souvenirs heureux et les massez lentement dans sa peau. Bellirith vous offre la même patience sans transformer le geste en performance."],
      suggestive: ["L’huile rend chaque prise plus glissante et chaque passage de sa bouche plus net. Bellirith vous fait deviner les parfums les yeux fermés, en déposant chaque réponse de plus en plus bas."],
      explicit: sexLines(
        ["Bellirith masse l’huile le long de vos cuisses puis glisse ses doigts dans votre écrin de chair, son pouce revenant sur votre bouton sensible. Dans le bain, vous vous rejoignez en ciseaux ; au lit, sa bouche prolonge votre plaisir jusqu’à ce que rose et cendre se confondent.", ["Bellirith", "Je reconnaîtrais désormais ce parfum parmi mille mondes.", "seductive"]],
        ["Ses mains huilées parcourent votre membre avec une lenteur provocante avant que sa bouche ne prenne le relais. Au lit, Bellirith vous accueille à genoux, puis vous fait rouler sur le dos et vous chevauche, variant la profondeur jusqu’à l’orgasme qui brise sa voix.", ["Bellirith", "Ce désir a ton odeur. Personne ne pourra prétendre que je l’ai inventé.", "troubled"]],
        ["Bellirith adapte le massage à votre corps, mêlant pression de ses doigts, chaleur de sa bouche et friction de ses cuisses. Du bain au lit, vous changez de position en laissant chaque parfum désigner une nouvelle zone de plaisir jusqu’à l’abandon partagé.", ["Bellirith", "Ni féminin, ni masculin, ni magique. Simplement le parfum de cette nuit.", "soft"]],
      ),
      ellipse: ["La vapeur du bain avale les trois senteurs et vos silhouettes. Lorsque la porte s’ouvre de nouveau, seules les fioles vides témoignent du trajet vers le lit."],
      reprise: ["Bellirith retrouve sur votre épaule une note de cendre oubliée. Elle la suit jusque sous les draps et transforme la découverte en seconde exploration, moins théâtrale et beaucoup plus lente."],
      closing: ["Les fioles restent ouvertes sur la table. Bellirith refuse de les reboucher : le mélange appartient désormais à la maison.", ["Bellirith", "Je reviendrai vérifier sa tenue. Une nécessité olfactive, évidemment.", "seductive"]],
      after: sexText("Elle respire contre le pli de votre cuisse avant de remonter.", "Elle garde votre poignet parfumé sous son nez en fermant les yeux.", "Elle choisit sur votre peau l’endroit où la dernière note doit survivre."),
    },
    {
      id: "rideau-sans-scene",
      labels: sexText("Fermer les rideaux et défier Bellirith de ne séduire qu’une seule personne", "La renverser sur le canapé avant qu’elle ne trouve son public", "Inventer avec elle une nuit où personne ne joue le rôle du trophée"),
      detail: "Un duel de séduction privé devient une étreinte sans aura, mobile et intense, où Bellirith accepte d’être choisie plutôt qu’admirée.",
      threshold: ["Vous fermez les rideaux un à un. Bellirith regarde disparaître la ville, puis le dernier reflet susceptible de lui servir de public.", ["Bellirith", "Une scène sans spectateurs. Tu sais vraiment comment effrayer une démone du désir.", "seductive"]],
      firstMovement: ["Vous la renversez sur le canapé avant qu’elle n’invente une pose. Bellirith riposte en vous attirant au-dessus d’elle, puis laisse échapper un rire véritable lorsque vous refusez de lui céder toute la mise en scène."],
      variation: ["Le défi se poursuit contre les rideaux, sur le tapis puis dans le lit. Chacun choisit une position qui expose son propre désir plutôt que le corps de l’autre."],
      tender: ["La compétition se dissout. Bellirith garde votre visage entre ses mains et vous embrasse sans technique visible, recevant ensuite vos caresses avec une émotion qu’elle ne masque pas."],
      suggestive: ["Sans aura, elle utilise seulement sa voix, sa bouche et la courbe de son corps contre le vôtre. Vous répondez par des gestes aussi directs ; le canapé devient vite trop étroit pour vos renversements."],
      explicit: sexLines(
        ["Bellirith vous plaque contre les rideaux et glisse une main entre vos cuisses, deux doigts fouillant votre intimité tandis que son pouce travaille votre point de feu. Vous la faites ensuite asseoir sur votre visage au bord du lit, puis vos bassins se rejoignent en ciseaux dans une cadence compétitive qui finit par vous faire jouir presque ensemble.", ["Bellirith", "Presque ensemble ? Recommence. Je refuse cette défaite-là.", "seductive"]],
        ["Bellirith vous attire à genoux sur le tapis et prend votre sexe dans sa bouche sans quitter votre regard. Dans le lit, vous la pénétrez d’abord face à face ; elle inverse ensuite la position, chevauche plus vite et vous entraîne avec elle dans un dernier mouvement sans vainqueur.", ["Bellirith", "Je ne suis pas ton trophée. Et tu n’es pas le mien. C’est bien meilleur.", "troubled"]],
        ["Vous échangez les rôles à chaque changement de pièce : celui qui touche, celui qui reçoit, puis deux corps actifs dans une position choisie pour votre anatomie. Bellirith abandonne tout numéro lorsque vos mains la font céder et vous rend la même franchise jusqu’à l’orgasme.", ["Bellirith", "Tu m’as choisie sans me mettre en scène. Je ne savais pas que cela pouvait brûler autant.", "troubled"]],
      ),
      ellipse: ["Le dernier rideau se ferme. Bellirith s’incline devant le public absent, puis vous entraîne derrière lui dans une nuit que personne n’applaudira."],
      reprise: ["Après le premier abandon, vous rouvrez un rideau sur la nuit. Bellirith vient derrière vous et reprend plus lentement, mains jointes aux vôtres contre le tissu, sans défi à gagner."],
      closing: ["À l’aube, elle rouvre les rideaux sans remettre son aura. La ville découvre seulement deux silhouettes paisibles et trop éloignées pour être reconnues.", ["Bellirith", "Qu’ils regardent la fenêtre. Ils ne sauront jamais ce qu’il fallait être pour entrer.", "soft"]],
      after: sexText("Elle garde ses lèvres contre votre point de feu avant de remonter se blottir.", "Elle dessine sur votre torse la forme du rideau fermé.", "Elle laisse sa main ouverte sous la vôtre, sans rôle à défendre."),
    },
  ],

  amanea: [
    {
      id: "coupe-sans-titre",
      labels: sexText("Boire dans la coupe de basalte puis asseoir Amanea à votre place", "Lui retirer son titre avant de l’attirer contre l’âtre vert", "Partager la coupe et décider ensemble qui conduit chaque reprise"),
      detail: "Amanea franchit une porte où son titre ne commande rien ; la coupe de basalte accompagne une scène souveraine entre foyer, table et lit.",
      threshold: ["Amanea remplit la coupe de basalte et vous la tend avant de boire à son tour. Elle a laissé couronne, escorte et armes au-delà de votre porte.", ["Amanea", "Chez toi, mon titre n’achète aucune obéissance. Ne gaspille pas ce privilège en devenant timide.", "neutral"]],
      firstMovement: ["Vous prenez sa place près de l’âtre et l’attirez entre vos genoux. Amanea goûte le vin sur votre bouche, puis vous soulève de votre siège pour reprendre une position qui ne ressemble à aucun trône."],
      variation: ["La coupe passe de main en main tandis que vous gagnez la table, le tapis chauffé par les flammes vertes puis le lit. Amanea change d’initiative sans jamais confondre puissance et distance."],
      tender: ["Sa force se fait enveloppante. Elle vous tient comme si le monde pouvait enfin être protégé sans être contrôlé, et reçoit vos baisers avec une vulnérabilité grave."],
      suggestive: ["Le basalte froid voyage sur vos peaux avant d’être remplacé par sa bouche. Amanea vous fait asseoir sur la table, ouvre lentement vos vêtements et exige votre regard plutôt qu’une quelconque révérence."],
      explicit: sexLines(
        ["Amanea écarte vos cuisses sur la table et fait glisser deux doigts dans votre intimité brûlante, son pouce pressant votre bouton de rose jusqu’au premier orgasme. Au lit, vous venez au-dessus d’elle et guidez son sexe dans votre chaleur ; elle reprend ensuite la cadence en vous tenant par les hanches.", ["Amanea", "Ici, céder n’est pas s’agenouiller. Montre-moi que tu connais la différence.", "troubled"]],
        ["Amanea referme sa main autour de votre membre et vous maintient contre l’âtre jusqu’à ce que vos jambes tremblent. Dans le lit, elle se place au-dessus de vous, vous accueille profondément puis change l’angle avec une puissance mesurée, avant de vous laisser la renverser pour la seconde montée.", ["Amanea", "Ta maison. Ta force. Ne me donne rien que tu ne puisses aussi reprendre.", "troubled"]],
        ["Amanea apprend les points de plaisir de votre corps avec une attention souveraine, alternant doigts, bouche et poids de ses hanches. Sur la table puis dans le lit, vous échangez la position dominante jusqu’à une jouissance commune qui fait vibrer la coupe oubliée.", ["Amanea", "À égalité, donc. Voilà une loi que je respecterai sous ce toit.", "soft"]],
      ),
      ellipse: ["Amanea repose la coupe et vous tend la main comme on conclut un pacte sans signature. La chambre reçoit les conséquences loin de toute cour."],
      reprise: ["La première accalmie ne lui suffit pas. Amanea revient devant l’âtre, vous fait asseoir entre ses jambes et vous demande de mener une reprise lente où aucun titre ne peut servir de raccourci."],
      closing: ["Au matin, la coupe ne porte ni sceau ni trace d’ordre. Amanea la replace parmi vos biens avec le respect qu’elle accorderait à une frontière reconnue.", ["Amanea", "Ce logis n’est pas une annexe de mon royaume. C’est pour cela que je peux y revenir.", "soft"]],
      after: sexText("Elle embrasse votre ventre avec une douceur sans témoin.", "Elle garde votre main sur la sienne plutôt que sur une couronne absente.", "Elle vous demande quelle place votre corps souhaite occuper lors de sa prochaine visite."),
    },
    {
      id: "flamme-verte",
      labels: sexText("Attiser les feux verts jusqu’à faire vaciller le calme d’Amanea", "La défier près du foyer puis lui céder volontairement le lit", "Modeler avec elle une flamme qui répond à vos plaisirs plutôt qu’à vos rôles"),
      detail: "Les feux verts d’Akuhn’Nabad deviennent un baromètre du désir d’Amanea dans une route intense et très mobile.",
      threshold: ["Amanea tend la main vers l’âtre. Les flammes deviennent vertes, mais leur hauteur répond désormais à vos respirations plutôt qu’à sa magie seule.", ["Amanea", "Elles révèlent l’intensité, pas l’intention. À nous de leur donner un sens.", "neutral"]],
      firstMovement: ["Vous la défiez de garder le feu bas en l’embrassant contre la pierre. La flamme bondit. Amanea vous plaque au mur avec un sourire rare et entreprend de vous faire perdre la manche suivante."],
      variation: ["Le duel passe du mur au tapis, puis au rebord du lit. Vous renversez Amanea autant de fois qu’elle vous reprend ; chaque position différente donne au feu une forme nouvelle."],
      tender: ["Vous laissez les flammes redescendre autour d’une étreinte lente. Amanea caresse vos cicatrices visibles ou invisibles et ne demande à aucune d’elles de justifier votre désir."],
      suggestive: ["La chaleur verte éclaire ses mains sur vous et les vôtres sous sa tenue. Un coussin, le bord du canapé et la pierre tiède deviennent les appuis d’un affrontement où le seul enjeu est de faire monter le feu."],
      explicit: sexLines(
        ["Amanea vous allonge sur le tapis, enfouit sa bouche entre vos cuisses et travaille votre perle de plaisir tandis que ses doigts remplissent votre écrin humide. Après votre première jouissance, elle vous entraîne au lit, vous place à califourchon sur elle et vous pénètre lentement avant d’accélérer sous vos mouvements.", ["Amanea", "Le feu te trahit. Continue jusqu’à ce qu’il n’ait plus de hauteur à gagner.", "troubled"]],
        ["Près du foyer, Amanea prend votre sexe en main puis entre vous entre ses lèvres avec une lenteur féroce. Au lit, elle vous accueille entre ses cuisses, chevauche ensuite votre corps et varie l’angle jusqu’à ce que les flammes se dressent au plafond avec vos orgasmes.", ["Amanea", "Tu voulais me faire vaciller. Assume maintenant ta victoire.", "troubled"]],
        ["Amanea utilise la chaleur pour suivre les réactions de votre anatomie : sa bouche là où le feu monte, ses doigts là où votre souffle casse, puis son bassin contre le vôtre dans plusieurs positions choisies ensemble. La dernière jouissance blanchit les flammes avant de les éteindre.", ["Amanea", "Aucune magie ne ment avec autant de beauté que ton corps vient d’être vrai.", "soft"]],
      ),
      ellipse: ["Les flammes vertes montent et forment un écran entre le salon et la chambre. Elles s’éteignent seulement lorsque la nuit a trouvé son propre rythme."],
      reprise: ["Une braise se rallume avant l’aube. Vous reprenez dans le fauteuil, Amanea assise derrière vous, ses mains lentes et sa bouche contre votre nuque jusqu’à ce que la flamme atteigne une seconde fois le manteau de l’âtre."],
      closing: ["Le feu redevient ordinaire. Amanea contemple la pierre noircie, satisfaite qu’aucun serviteur ne vienne effacer la trace de votre nuit.", ["Amanea", "Laisse-la. Une maison a le droit de se souvenir autrement qu’un palais.", "soft"]],
      after: sexText("Elle réchauffe votre intimité d’une paume devenue douce.", "Elle garde votre bassin contre le sien jusqu’à la dernière braise.", "Elle dessine dans la cendre le signe choisi pour votre plaisir partagé."),
    },
    {
      id: "couronne-a-la-porte",
      labels: sexText("Laisser la couronne à l’entrée et demander à la femme de conquérir votre nuit", "Prendre Amanea dans vos bras avant qu’elle puisse redevenir reine", "Partager le pouvoir de la chambre sans couronne ni posture assignée"),
      detail: "Une route dépouillée de symboles : Amanea explore toute la maison comme une femme libre, avec des reprises plus calmes après l’intensité.",
      threshold: ["Amanea pose sa couronne sur la console de l’entrée. Elle ne la cache pas ; elle décide simplement de ne pas la porter.", ["Amanea", "Elle sera encore là demain. Cette nuit, j’aimerais découvrir ce qui reste lorsque je ne la laisse pas entrer.", "troubled"]],
      firstMovement: ["Vous la prenez dans vos bras avant qu’un autre mot ne reconstruise sa distance. Amanea vous porte à son tour jusqu’au canapé, amusée que la force puisse circuler sans devenir un commandement."],
      variation: ["Vous explorez la maison comme un territoire commun : enlacés dans l’entrée, à genoux sur le tapis, assis face à face dans le fauteuil puis étendus dans la chambre dont aucun dais ne ressemble à un trône."],
      tender: ["Amanea vous montre les marques laissées par son rôle et reçoit vos baisers sans transformer leur douceur en faiblesse. Elle rend chaque geste avec une lenteur protectrice, mais jamais possessive."],
      suggestive: ["La reine absente laisse une femme qui sait exactement ce qu’elle désire. Elle vous déshabille dans l’entrée, vous pousse doucement dans le fauteuil et utilise chaque pièce comme une nouvelle manière de demander davantage."],
      explicit: sexLines(
        ["Dans le fauteuil, Amanea vous garde ouverte contre elle et fait circuler ses doigts dans votre intimité humide jusqu’à ce que votre perle de plaisir pulse sous son pouce. Au lit, vous vous placez en ciseaux, hanches verrouillées, puis elle vous pénètre au rythme de votre bassin pour une seconde jouissance plus profonde.", ["Amanea", "Pas une reine. Pas un sujet. Deux femmes qui savent exactement pourquoi elles sont ici.", "troubled"]],
        ["Amanea s’agenouille dans l’entrée et prend votre membre en bouche avec une patience qui vous fait agripper le mur. Dans la chambre, elle vous accueille face à face, puis vous fait rouler sous elle ; les mouvements deviennent plus puissants avant de ralentir dans une longue position sur le côté.", ["Amanea", "Je ne conquiers rien. Je viens à toi — encore.", "soft"]],
        ["Sans couronne, Amanea demande à votre anatomie ses propres règles par les gestes plutôt que par le protocole. Vos mains et vos bouches se relaient dans l’entrée, le fauteuil puis le lit ; chaque position redistribue le pouvoir jusqu’à ce que vos corps cèdent ensemble.", ["Amanea", "Cette égalité ne m’enlève rien. Elle me rend à moi-même.", "soft"]],
      ),
      ellipse: ["La couronne reste seule dans l’entrée. Amanea vous emporte au-delà du couloir et la chronique refuse de lui accorder le moindre droit de regard."],
      reprise: ["Après l’intensité, Amanea revient à vous sans défi : couchée sur le côté, une jambe entre les vôtres, elle reprend par de longs mouvements et des caresses patientes jusqu’à une seconde plénitude silencieuse."],
      closing: ["Elle récupère sa couronne au matin, mais ne la remet qu’après avoir franchi la porte. Sous votre toit, Amanea reste encore quelques secondes sans titre.", ["Amanea", "Invitez-moi de nouveau. Pas mon royaume. Pas mon histoire. Moi.", "soft"]],
      after: sexText("Elle embrasse vos lèvres de rose avant de remonter contre votre cœur.", "Elle garde votre visage entre ses mains comme la seule autorité admise.", "Elle vous laisse choisir qui portera symboliquement la couronne lors de la prochaine nuit."),
    },
  ],
  tia: [
    {
      id: "partition-inachevee",
      labels: sexText("Faire de chaque pièce une mesure privée avec Tia", "Laisser Tia conduire le salon avant de renverser la partition", "Composer une nuit adaptée à vos deux corps sans protocole"),
      detail: "La partition sans dernière mesure guide Tia du salon à la chambre, où la conduite circule sans audience.",
      threshold: ["Tia pose la partition sur votre piano ou, à défaut, sur la table du salon. La dernière mesure manque réellement.", ["Tia", "Chez vous, aucune institution ne réclame la conclusion. Je propose que nos corps l’écrivent à la place.", "troubled"]],
      firstMovement: ["Elle joue le rythme contre votre paume, puis contre votre gorge. Vous lui rendez la mesure par un baiser qui défait la première attache d’or et déplace la musique du salon vers le canapé."],
      variation: ["La conduite change à chaque pièce : Tia vous guide près de la fenêtre, vous la renversez sur le tapis, puis la chambre accueille une reprise où plus personne ne compte.", ["Tia", "Nous avons perdu le tempo. Ne le retrouvez pas.", "smirk"]],
      tender: ["La partition devient une suite d’étreintes lentes. Tia vous couvre, reçoit vos mains et laisse chaque pause durer sans la remplir d’une nouvelle règle."],
      suggestive: ["Les notes restantes servent de prétexte à des baisers plus bas et des mains plus directes. Tia essaie encore de diriger la cadence, puis vous offre volontairement la mesure suivante."],
      explicit: sexLines(
        ["Tia vous allonge sur le tapis, garde sa bouche sur votre perle sensible et fait glisser ses doigts dans votre chaleur au rythme frappé plus tôt. Au lit, vous échangez la conduite dans une position en ciseaux jusqu’à deux orgasmes successifs.", ["Tia", "La mesure finale nous appartient. Ne la rendez surtout pas régulière.", "troubled"]],
        ["Tia prend votre membre dressé entre ses lèvres près du piano, puis vous accueille dans la chambre face à face. Elle choisit la première profondeur ; vous la seconde, et vos plaisirs concluent la partition sans pose officielle.", ["Tia", "Je refuse toute cadence qui ne laisse pas chacun conduire à son tour.", "troubled"]],
        ["Tia vous demande la forme exacte de plaisir que votre corps souhaite recevoir, puis choisit la sienne sans exiger de symétrie. Bouche, mains, frottements ou pénétration se relaient entre le salon et le lit jusqu’à vos abandons distincts.", ["Tia", "Deux conclusions différentes. Une seule nuit entière.", "troubled"]],
      ),
      ellipse: ["Tia retire la dernière page, la plie et vous entraîne vers la chambre. La musique continue derrière la porte tandis que la chronique laisse la mesure inachevée."],
      reprise: ["Avant l’aube, Tia rejoue trois notes sur votre peau. La reprise est plus lente, couchée sur le côté, avec davantage de baisers que de structure."],
      closing: ["La partition reste ouverte sur le silence final. Tia inscrit seulement la date dans la marge et refuse d’ajouter un titre.", ["Tia", "Une œuvre privée n’a pas besoin de légitimer son existence.", "thinking"]],
      after: sexText("Elle garde votre jambe entre les siennes comme une dernière mesure tenue.", "Elle écoute votre cœur sans tenter d’en fixer le tempo.", "Elle vous demande quelle sensation votre corps voudra choisir lors de la reprise."),
    },
    {
      id: "diner-sans-service",
      labels: sexText("Déranger le dîner de Tia jusqu’à faire de la table un refuge", "Lui retirer chaque tâche avant de l’attirer près de l’âtre", "Partager cuisine, table et lit sans distribuer de rôles fixes"),
      detail: "Un repas sans service devient une nuit domestique, joueuse et mobile où Tia apprend l’imprévu sans cesser d’être elle-même.",
      threshold: ["Tia a dressé la table avec une exactitude intimidante. Vous déplacez volontairement un verre et attendez sa réaction.", ["Tia", "Je sais que c’est une provocation. Je constate également que personne ne mourra de cette asymétrie.", "smirk"]],
      firstMovement: ["Elle goûte la sauce sur votre doigt, puis votre bouche. Le repas refroidit tandis que vous l’asseyez sur le plan de travail et que Tia choisit de ne sauver aucune assiette."],
      variation: ["Vous passez du marbre au fauteuil puis au lit, laissant dans chaque pièce un vêtement ou une règle devenue inutile. Tia renverse elle-même le dernier coussin parfaitement aligné."],
      tender: ["Vous vous nourrissez de bouchées volées et de longs baisers. Tia se laisse envelopper par une chaleur qui ne réclame aucune décision au-delà de rester."],
      suggestive: ["Le contraste du marbre froid et de vos mains accélère son souffle. Elle vous attire contre elle, formule une envie directe puis accepte que votre réponse change l’itinéraire prévu."],
      explicit: sexLines(
        ["Tia vous fait asseoir sur la table, ouvre vos cuisses et entretient votre point incandescent avec sa langue tandis que ses doigts trouvent le rythme intérieur demandé. Au lit, vous lui rendez le plaisir puis mêlez vos jambes pour une seconde montée.", ["Tia", "Le dîner est perdu. Je considère cette conséquence parfaitement acceptable.", "smirk"]],
        ["Tia s’agenouille près de l’âtre et prend votre longueur brûlante dans sa bouche. Dans la chambre, vous entrez lentement en elle, puis elle vous chevauche et choisit la cadence jusqu’à ce que vos deux souffles rompent toute conversation.", ["Tia", "Aucune cour n’apprendra que j’ai préféré ceci au dessert.", "smirk"]],
        ["Cuisine, fauteuil et lit deviennent trois configurations choisies selon vos anatomies : donner, recevoir, puis mêler les plaisirs sans copie obligatoire. Tia abandonne la soirée à vos corps jusqu’à ce que chacun ait obtenu sa propre conclusion.", ["Tia", "L’imprévu possède donc parfois une architecture remarquable.", "smirk"]],
      ),
      ellipse: ["La nappe glisse avec le dernier couvert. Tia vous suit jusqu’au couloir et la chronique reste auprès du dîner froid pendant que la chambre devient plus importante."],
      reprise: ["Vous revenez partager le dessert à même le tapis. Tia recueille une trace sucrée sur votre peau et transforme la dégustation en reprise plus lente."],
      closing: ["Au matin, la table est encore de travers. Tia redresse un verre, regarde le reste et décide de laisser exactement ainsi.", ["Tia", "Une preuve discrète que cette maison a survécu à mon absence de contrôle.", "troubled"]],
      after: sexText("Elle goûte une dernière trace sucrée au creux de votre ventre.", "Elle repose contre votre torse pendant que le repas attend.", "Elle vous laisse définir la prochaine recette et la prochaine configuration corporelle."),
    },
    {
      id: "sceau-a-la-porte",
      labels: sexText("Laisser les deux sceaux à l’entrée et inviter seulement Tia", "Fermer la porte à l’Empire avant de prendre la seconde conduite", "Créer sous votre toit une égalité sans corps ni fonction assignés"),
      detail: "Tia dépose ses sceaux, explore la maison sans escorte et construit avec vous une égalité intime durable.",
      threshold: ["Tia aligne le sceau impérial et son sceau personnel sur la console. Après réflexion, elle laisse les deux.", ["Tia", "Même mon prénom peut devenir une armure. Ce soir, je voudrais entrer sans preuve de fonction.", "troubled"]],
      firstMovement: ["Vous lui tendez la main sans révérence. Tia la prend, traverse chaque pièce à vos côtés puis vous embrasse devant la porte de la chambre qu’elle choisit elle-même d’ouvrir."],
      variation: ["Le fauteuil accueille sa première conduite, le tapis la vôtre, et le lit rend enfin les échanges trop naturels pour conserver le moindre compte."],
      tender: ["Vous partagez le poids, la chaleur et le calme. Tia reçoit un soin qui ne diminue pas sa puissance et vous rend une tendresse sans la faire passer pour une récompense."],
      suggestive: ["Chaque renversement retire une attache et une distance. Tia vous guide, vous la faites céder à votre tour, puis vos hanches trouvent un rythme que ni sceau ni rang ne pourrait enregistrer."],
      explicit: sexLines(
        ["Vous donnez d’abord du plaisir à Tia avec votre bouche et vos doigts, puis elle vous renverse et maintient votre perle sensible jusqu’à votre propre orgasme. Une seconde position en ciseaux fait circuler le désir sans fixer de gagnante.", ["Tia", "Aucune de nous ne s’efface. Voilà la seule loi admise ici.", "troubled"]],
        ["Tia conduit la première pénétration face à face, puis vous changez de position sur le côté et prenez la seconde cadence. Ses doigts gardent son plaisir vivant pendant que vos orgasmes arrivent sans classement ni simultanéité exigée.", ["Tia", "Ni souveraine ni sujet. Deux personnes capables de reprendre la conduite.", "troubled"]],
        ["Vous alternez bouche, mains, frottement et pénétration selon les possibilités choisies de vos corps. Tia reçoit une forme de plaisir, vous une autre, et l’intensité identique n’exige jamais que les gestes se ressemblent.", ["Tia", "Cette égalité demeure exacte précisément parce qu’elle ne nous rend pas identiques.", "troubled"]],
      ),
      ellipse: ["Les sceaux restent seuls dans l’entrée. Tia referme la chambre sans verrou officiel et la chronique abandonne toute tentative d’archiver la suite."],
      reprise: ["Après une longue accalmie, vous échangez encore la conduite sur le côté, front contre front, dans une reprise plus calme où chaque demande peut devenir un baiser."],
      closing: ["Tia récupère le grand sceau seulement après avoir franchi le seuil. Le petit reste sur votre console jusqu’à sa prochaine visite.", ["Tia", "Gardez-le. Une invitation personnelle doit pouvoir trouver son chemin de retour.", "troubled"]],
      after: sexText("Elle garde votre hanche contre la sienne sans hiérarchie visible.", "Elle laisse sa main ouverte sur votre poitrine, sans sceau dans la paume.", "Elle vous demande une prochaine nuit tout aussi précise et tout aussi différente."),
    },
  ],
  allenna: [
    {
      id: "boite-de-suture",
      labels: sexText("Fermer la boîte de soins et confier votre plaisir aux mains d’Allenna", "Laisser ses mains nues apprendre votre rythme au salon", "Définir avec Allenna une anatomie de plaisir entièrement personnelle"),
      detail: "La boîte de campagne devient le symbole d’une nuit où Allenna touche sans soigner et reçoit sans surveiller.",
      threshold: ["Allenna vérifie la boîte de suture offerte, puis la ferme volontairement avant de retirer ses gantelets.", ["Allenna", "Aucune blessure. Aucun patient. Si mes mains travaillent ce soir, ce sera pour une raison que j’ai choisie.", "troubled"]],
      firstMovement: ["Ses doigts nus commencent sur votre visage, descendent vers votre gorge puis sous vos vêtements. Vous les guidez une fois ; Allenna retient votre réponse et non une règle générale."],
      variation: ["Du canapé au tapis, puis du tapis au lit, elle adapte chaque appui avant de reprendre exactement là où votre souffle s’était brisé."],
      tender: ["Allenna vous enveloppe de longues caresses et accepte vos soins en retour. Le contact ne répare rien : il existe seulement parce qu’il vous plaît à tous deux."],
      suggestive: ["Sa précision devient sensuelle à mesure que les vêtements tombent. Allenna suit chaque réaction, mais son propre désir dérange bientôt délicieusement la régularité de ses gestes."],
      explicit: sexLines(
        ["Allenna vous ouvre contre les coussins, garde sa bouche sur votre petite amande et fait glisser ses doigts dans votre secret humide. Après votre orgasme, vous échangez les places et lui rendez la même attention jusqu’à son abandon.", ["Allenna", "La boîte reste fermée. Ces mains ont une mission beaucoup plus agréable.", "smirk"]],
        ["Allenna prend votre membre dressé dans sa main puis entre ses lèvres, attentive au rythme que vous lui donnez. Dans la chambre, vous la préparez avant une pénétration sur le côté qui protège ses appuis et intensifie vos deux plaisirs.", ["Allenna", "Stable, profond, entièrement choisi. Continue.", "smirk"]],
        ["Allenna suit les indications de votre anatomie avec bouche, doigts, frottement ou pénétration adaptés. Vous lui demandez ensuite sa propre configuration ; vos plaisirs différents reçoivent la même précision jusqu’au bout.", ["Allenna", "Deux corps réels. Aucun manuel ne remplacera cette information.", "smirk"]],
      ),
      ellipse: ["Allenna laisse la boîte fermée dans le salon et vous suit vers la chambre, mains nues. Le récit ne franchit pas la porte."],
      reprise: ["Avant de dormir, elle revient sur le canapé et vous attire au-dessus d’elle pour une reprise plus douce, guidée par les souvenirs précis de ce qui a plu."],
      closing: ["La boîte n’a pas bougé. Allenna replace seulement un coussin sous votre nuque et accepte celui que vous glissez sous la sienne.", ["Allenna", "Aucun soin nécessaire. Je conserve pourtant volontiers cette surveillance mutuelle.", "troubled"]],
      after: sexText("Elle suit votre ventre du bout de ses doigts sans chercher une douleur.", "Elle garde votre pouls sous sa paume sans le compter.", "Elle mémorise les mots propres à votre corps plutôt qu’un protocole."),
    },
    {
      id: "terrain-domestique",
      labels: sexText("Transformer le tapis en terrain de relève avec Allenna", "Échanger force et conduite dans toute la maison", "Inventer des appuis adaptés sans distribuer les rôles par anatomie"),
      detail: "Un exercice sur le tapis devient un parcours charnel où force, appuis et conduite changent à chaque pièce.",
      threshold: ["Allenna écarte la table basse et teste le tapis d’un pied. Votre salon devient un terrain d’entraînement parfaitement indigne d’un rapport officiel.", ["Allenna", "Pas de victoire. Le mot de relève change seulement la personne qui porte le mouvement.", "smirk"]],
      firstMovement: ["Vous testez une prise, la transformez en baiser puis roulez ensemble sur le tapis. Allenna rit lorsque vous exploitez déloyalement la distraction qu’elle vient elle-même de provoquer."],
      variation: ["Le parcours continue contre le canapé, le mur puis le lit. Chaque position protège les anciennes blessures sans imposer de douceur ni réduire sa force."],
      tender: ["L’exercice ralentit jusqu’à devenir une suite d’étreintes capables de porter tout le poids. Allenna accepte d’être soutenue avant la fatigue et vous rend la même sécurité."],
      suggestive: ["Les prises ouvrent vêtements et distances. Le mot de relève circule avec les mains, les bouches et les bassins jusqu’à ne plus désigner qu’un désir de changer l’angle."],
      explicit: sexLines(
        ["Vous échangez bouche, doigts et frottements sur le tapis puis au lit. Allenna reçoit jusqu’à son orgasme, prononce la relève et maintient votre point de feu avec la même constance jusqu’au vôtre.", ["Allenna", "Aucune gagnante. Deux relèves parfaitement exécutées.", "smirk"]],
        ["Allenna vous accueille face à face, conduit la première cadence puis vous confie la position suivante sur le côté. La pénétration reste soutenue par une caresse extérieure et vos orgasmes successifs n’exigent aucun classement.", ["Allenna", "La force soutient. Elle ne décide rien à notre place.", "smirk"]],
        ["Chaque configuration est choisie selon vos corps : toucher, recevoir, pénétrer ou frotter sans rôle fixe. Allenna échange le soutien avant l’épuisement et garde chaque plaisir entier jusqu’à sa conclusion propre.", ["Allenna", "Relève corporelle accomplie. Demande de reprise en préparation.", "smirk"]],
      ),
      ellipse: ["Le mot de relève vous conduit du tapis au couloir, puis la chambre absorbe le reste de l’exercice hors du regard de la chronique."],
      reprise: ["Après l’intensité, Allenna choisit une position assise dans le fauteuil où vos corps peuvent reprendre lentement sans porter leur poids seuls."],
      closing: ["Le salon porte encore les traces du parcours. Allenna remet la table en place, mais laisse le tapis de travers comme une promesse visible.", ["Allenna", "Nous corrigerons l’aménagement après la prochaine séance. Pas avant.", "smirk"]],
      after: sexText("Elle masse votre cuisse avant de vous confier la sienne.", "Elle laisse vos épaules partager le même appui.", "Elle vérifie que chaque rôle est resté modifiable jusqu’au bout."),
    },
    {
      id: "veille-interrompue",
      labels: sexText("Faire tomber la garde d’Allenna près de la fenêtre nocturne", "Prendre la relève de sa veille et l’attirer dans votre lit", "Partager une nuit où aucun corps ne doit monter la garde"),
      detail: "Une veille à la fenêtre devient une scène lente où Allenna accepte le repos, la vulnérabilité et plusieurs reprises.",
      threshold: ["Allenna se tient devant la fenêtre comme devant un rempart. Vous fermez les rideaux et lui montrez la porte déjà verrouillée.", ["Allenna", "Je sais qu’il n’y a pas de menace. Mon corps n’a pas encore reçu le rapport.", "troubled"]],
      firstMovement: ["Vous vous placez entre elle et la fenêtre sans l’emprisonner. Allenna choisit de reculer vers vous, dépose son front contre le vôtre et laisse un premier baiser interrompre la veille."],
      variation: ["Le fauteuil reçoit son poids, le tapis vos genoux, puis le lit devient enfin un endroit où ni l’un ni l’autre ne surveille la sortie."],
      tender: ["Vous gardez Allenna contre vous jusqu’à ce que ses épaules descendent. Elle répond par des baisers lents et accepte de fermer les yeux sans disparaître de la scène."],
      suggestive: ["Vos mains remplacent progressivement les pièces d’armure. Allenna ouvre les vôtres en retour, plus attentive au désir qui monte qu’au silence de la rue."],
      explicit: sexLines(
        ["Allenna vous fait asseoir dans le fauteuil et entretient votre perle sensible avec sa bouche et ses doigts. Dans le lit, vous lui rendez le plaisir, puis une position en ciseaux prolonge la nuit jusqu’à une seconde jouissance partagée.", ["Allenna", "La fenêtre est fermée. Je préfère nettement ce qui se passe ici.", "troubled"]],
        ["Allenna prend votre longueur brûlante près de la fenêtre, puis vous accueille dans le lit sur le côté, assez proche pour guider chaque profondeur. Elle vient ensuite au-dessus et conduit la reprise jusqu’à vos orgasmes successifs.", ["Allenna", "Aucune garde. Seulement cette cadence et la certitude de pouvoir la changer.", "troubled"]],
        ["Vous choisissez une première stimulation pour votre corps, puis une seconde pour Allenna, sans symétrie imposée. La reprise mêle les deux par les mains, les bouches, le frottement ou la pénétration que vous avez définis ensemble.", ["Allenna", "Personne ne monte la garde. Personne ne disparaît. Continue.", "troubled"]],
      ),
      ellipse: ["Les rideaux se ferment. Allenna laisse ses gantelets sur le rebord et rejoint le lit pendant que la chronique demeure de l’autre côté."],
      reprise: ["Au milieu de la nuit, elle se réveille sans sursaut et vient chercher votre chaleur. La reprise naît de cette demande silencieuse, lente et entièrement présente."],
      closing: ["À l’aube, Allenna ouvre les rideaux sans remettre immédiatement l’armure. La rue existe toujours ; elle n’a pas eu besoin de la sauver.", ["Allenna", "Le monde a tenu. Je pourrais risquer une autre nuit.", "troubled"]],
      after: sexText("Elle dort enfin avec votre main sur son ventre.", "Elle laisse votre torse remplacer le rempart sous sa joue.", "Elle demande quelle proximité permettra à votre propre corps de se reposer."),
    },
  ],
};

export const HOME_INTIMACY_APPROACHES: Record<string, IntimacyChoice[]> = {
  hylee: [
    { id: "home-hylee-light", text: "Lui confier la lumière du photophore et la première initiative.", lines: [P("Montre-moi où tu veux commencer."), C("Hylee", "Ici. Puis peut-être partout ailleurs, puisque nous avons toute la maison.", "teasing"), N("Elle déplace le photophore près de vous et laisse ses flocons éclairer son premier baiser.")] },
    { id: "home-hylee-tour", text: "L’embrasser dans l’entrée et lui proposer de découvrir chaque pièce autrement.", lines: [N("Votre baiser interrompt la visite avant la première explication."), C("Hylee", "J’espère que la chambre est loin. J’aime déjà beaucoup le trajet.", "determined")] },
    { id: "home-hylee-nest", text: "Construire avec elle un refuge de coussins et laisser le désir y entrer lentement.", lines: [C("Hylee", "Une cabane dans notre propre salon. C’est adulte et parfaitement défendable."), N("Elle ferme l’ouverture derrière vous, puis transforme la plaisanterie en un long baiser.")] },
  ],
  remerii: [
    { id: "home-remerii-beat", text: "Dérégler vous-même le métronome et lui demander de suivre l’erreur.", lines: [N("Vous poussez le poids hors de toute mesure régulière."), C("Remerii", "Provocation techniquement grossière. Réponse immédiate requise.", "smirk")] },
    { id: "home-remerii-desk", text: "Écarter ses notes du bureau et y installer Remerii à leur place.", lines: [C("Remerii", "Vous venez de déplacer trois semaines de classement."), P("Tu es la seule priorité de cette table."), C("Remerii", "Argument recevable. Approchez.", "calm")] },
    { id: "home-remerii-score", text: "Lui proposer une partition dont chaque pièce de la maison sera une mesure.", lines: [C("Remerii", "Une composition spatiale sans répétition garantie…"), N("Elle ferme déjà le livre et vous tend la main avant d’avoir terminé son objection.")] },
  ],
  iriana: [
    { id: "home-iriana-chair", text: "Lui offrir le grand fauteuil, puis refuser de vous incliner devant elle.", lines: [C("Iriana", "Enfin une audience qui commence par une insolence utile.", "smirk"), N("Elle vous attire entre ses genoux au lieu d’exiger la moindre révérence.")] },
    { id: "home-iriana-window", text: "Déposer le diadème et conduire Iriana vers une fenêtre sans témoins.", lines: [N("La couronne reste près de l’oiseau mécanique."), C("Iriana", "Montrez-moi la ville comme si elle n’avait aucun droit sur cette nuit.", "calm")] },
    { id: "home-iriana-bird", text: "Remonter l’oiseau et inventer une règle à chaque fausse note.", lines: [C("Iriana", "Si l’une des règles implique encore une dignité impériale, je la refuse."), P("Aucune chance."), N("La première note vous trouve déjà enlacé·es.")] },
  ],
  valurn: [
    { id: "home-valurn-card", text: "Glisser sa carte blanche sous sa veste et lui demander d’inventer la première règle.", lines: [C("Valurn", "Une partie dans laquelle la règle touche déjà ma peau. Départ prometteur.", "charming"), N("Il vous entraîne dans le fauteuil sans tenter de transformer le geste en dette.")] },
    { id: "home-valurn-token", text: "Faire tourner son jeton sur la table et miser le choix de la première pièce.", lines: [N("Le métal oscille entre vous."), C("Valurn", "Pile : le canapé. Face : le canapé aussi, mais je prétendrai avoir gagné.", "charming")] },
    { id: "home-valurn-fire", text: "Allumer avec lui une flamme noire et voir lequel de vous la fait monter.", lines: [C("Valurn", "Aucune emprise. Seulement un feu indiscret."), P("Alors donne-lui quelque chose à révéler."), N("Votre baiser fait aussitôt blanchir le cœur de la flamme.")] },
  ],
  naiah: [
    { id: "home-naiah-firefly", text: "Libérer sa luciole illusoire et suivre chaque endroit qu’elle éclaire.", lines: [C("Naïah", "Elle ment sur tout, sauf sur ce qui lui donne envie de s’arrêter."), N("La lumière se pose sur votre gorge ; Naïah y dépose sa bouche.")] },
    { id: "home-naiah-doors", text: "La poursuivre derrière les fausses portes de votre propre maison.", lines: [N("Trois portes apparaissent sur le mur."), C("Naïah", "Si tu trouves la vraie chambre, je te laisse choisir ce que nous y faisons d’abord.", "smirk")] },
    { id: "home-naiah-mirror", text: "Effacer ses beaux reflets et demander à Naïah de rester sans décor.", lines: [P("Je ne veux pas la reine des brumes. Je veux celle qui me regarde maintenant."), C("Naïah", "Elle est beaucoup plus facile à troubler. Profites-en.", "troubled")] },
  ],
  lineva: [
    { id: "home-lineva-key", text: "Fermer avec elle le coffre des rapports et garder la clé jusqu’à l’aube.", lines: [C("Lineva", "La ville tient sans moi quelques heures."), N("Elle vérifie le déclic, puis vous embrasse avant de pouvoir le remettre en doute.")] },
    { id: "home-lineva-knot", text: "Remplacer sa corde d’exercice par une écharpe qui vous rapproche.", lines: [C("Lineva", "Un bon nœud protège sans étrangler."), P("Montre-moi."), N("La boucle souple réunit vos poignets et Lineva teste aussitôt la distance d’un baiser.")] },
    { id: "home-lineva-tide", text: "Ouvrir la fenêtre sur la mer et laisser le roulis déplacer vos appuis.", lines: [N("Le vent du port gonfle le rideau."), C("Lineva", "Bouge avec la vague, pas contre elle."), N("Ses mains à votre taille donnent au conseil une signification plus intime.")] },
  ],
  saidin: [
    { id: "home-saidin-watch", text: "Arrêter sa montre sur votre souffle et lui interdire tout lendemain.", lines: [C("Saidin", "Je ne connais pas la minute suivante."), P("Alors reste dans celle-ci."), N("Vous posez la montre sur son cœur avant de l’embrasser.")] },
    { id: "home-saidin-blind", text: "Bander les yeux de Saidin pour que vos mains deviennent son seul avenir.", lines: [N("La prescience se tait derrière le foulard."), C("Saidin", "Le présent a votre chaleur. Guidez-moi.", "mysterious")] },
    { id: "home-saidin-loop", text: "Créer une boucle de trois secondes et en changer chaque répétition.", lines: [N("Le même baiser recommence, mais votre main trouve chaque fois un nouvel endroit."), C("Saidin", "Nous venons d’apprendre à une boucle à désobéir.", "soft")] },
  ],
  bellirith: [
    { id: "home-bellirith-mirror", text: "L’asseoir devant son miroir honnête et lui montrer ce que vous regardez vraiment.", lines: [C("Bellirith", "Aucun charme ne corrige ce reflet."), P("Je ne veux rien corriger."), N("Votre main se pose sur sa nuque nue dans le miroir.")] },
    { id: "home-bellirith-scent", text: "Choisir trois parfums et les suivre sur sa peau sans utiliser son aura.", lines: [N("Cendre, rose et épices attendent sur la table."), C("Bellirith", "Suis la bonne senteur. Je promets d’être la destination.", "seductive")] },
    { id: "home-bellirith-curtains", text: "Fermer les rideaux et lui retirer le dernier public possible.", lines: [C("Bellirith", "Une scène sans spectateurs ? Cruauté raffinée."), N("Vous la renversez sur le canapé avant qu’elle ne trouve une pose.")] },
  ],
  amanea: [
    { id: "home-amanea-cup", text: "Partager sa coupe sans titre et lui offrir votre siège, jamais votre obéissance.", lines: [C("Amanea", "Chez toi, mon titre ne décide rien."), P("C’est toi que j’ai invitée."), N("Elle goûte cette distinction directement sur votre bouche.")] },
    { id: "home-amanea-fire", text: "Attiser les flammes vertes jusqu’à faire vaciller son calme.", lines: [C("Amanea", "Le feu révèle l’intensité, pas l’intention."), P("La mienne est très claire."), N("Vous la poussez contre l’âtre et les flammes bondissent.")] },
    { id: "home-amanea-crown", text: "Laisser sa couronne à l’entrée et accueillir la femme dans toute la maison.", lines: [N("La couronne reste sur la console."), C("Amanea", "Elle sera encore là demain. Cette nuit, venez à moi.", "troubled")] },
  ],
  tia: [
    { id: "home-tia-score", text: "Ouvrir sa partition inachevée et lui confier la première mesure.", lines: [N("Tia pose deux doigts sur la page avant de les offrir à votre paume."), C("Tia", "Je conduis une mesure. Vous prenez la suivante, sans devoir la rendre régulière.", "troubled")] },
    { id: "home-tia-table", text: "Déplacer un couvert et l’embrasser avant qu’elle ne le corrige.", lines: [N("Son regard rejoint le verre asymétrique, puis votre bouche."), C("Tia", "Une provocation domestique remarquablement efficace.", "smirk")] },
    { id: "home-tia-seals", text: "Laisser ses deux sceaux à l’entrée et lui tendre une main sans révérence.", lines: [N("Tia abandonne les symboles sur la console et franchit la distance en son nom."), C("Tia", "Cette invitation ne concerne que moi. Répondez de même.", "troubled")] },
  ],
  allenna: [
    { id: "home-allenna-kit", text: "Fermer sa boîte de soins et embrasser ses mains comme des mains.", lines: [N("Le fermoir claque. Allenna retire ses gantelets et vous confie ses doigts nus."), C("Allenna", "Aucune réparation. Seulement ce que nous voulons en faire.", "troubled")] },
    { id: "home-allenna-floor", text: "Écarter la table basse et proposer une relève sur le tapis.", lines: [C("Allenna", "Pas de vainqueur. Chacun porte le mouvement avant de le transmettre."), N("La première prise devient un baiser avant même que l’exercice commence.")] },
    { id: "home-allenna-curtains", text: "Fermer les rideaux et prendre officiellement la relève de sa veille.", lines: [P("Le monde tiendra jusqu’à l’aube."), C("Allenna", "Je vais tester cette hypothèse depuis ton lit.", "smirk"), N("Elle laisse les gantelets sur la fenêtre et revient vers vous.")] },
  ],
};

const HOME_CHARACTER_OPENING: Record<string, DialogueLine[]> = {
  hylee: [C("Hylee", "Cette fois, nous ne louons pas une chambre au temps. Nous sommes chez toi.", "soft")],
  remerii: [C("Remerii", "Aucun horaire de départ, aucun témoin et un mobilier dont nous connaissons la solidité. Situation favorable.", "smirk")],
  iriana: [C("Iriana", "Fermez la porte. La princesse sait où me retrouver demain.", "calm")],
  valurn: [C("Valurn", "Votre toit, vos règles. Voilà une proposition bien plus dangereuse qu’un pacte.", "charming")],
  naiah: [C("Naïah", "Je pourrais changer tout le décor. Je préfère découvrir ce que le vrai sait faire.", "smirk")],
  lineva: [C("Lineva", "La relève tient jusqu’à l’aube. Ne me laissez pas gaspiller cette victoire.", "determined")],
  saidin: [C("Saidin", "Je n’ai regardé aucun futur au-delà de cette porte. La pièce me paraît immense.", "mysterious")],
  bellirith: [C("Bellirith", "J’ai laissé mon aura dehors. Si tu me désires ici, je saurai enfin que c’est moi.", "seductive")],
  amanea: [C("Amanea", "Aucun garde, aucun trône, aucun sujet. Une soirée rare mérite une franchise rare.", "neutral")],
  tia: [C("Tia", "J’ai laissé mes sceaux dans l’entrée. S’ils parlent avant moi, retournez-les face contre la console.", "troubled")],
  allenna: [C("Allenna", "La relève est prévenue, la porte verrouillée et la trousse fermée. Je n’ai plus aucune excuse fonctionnelle.", "troubled")],
};

const HOME_CHARACTER_ENDING: Record<string, DialogueLine[]> = {
  hylee: [C("Hylee", "Je veux me souvenir que cette nuit avait une adresse.", "soft")],
  remerii: [C("Remerii", "Je refuse de qualifier cette expérience d’exception. Une reprise sera nécessaire.", "smirk")],
  iriana: [C("Iriana", "Aucune cour ne m’a jamais offert une nuit aussi vaste que cette maison.", "calm")],
  valurn: [C("Valurn", "Je reviendrai sans mise. Ne répétez surtout pas que je sais faire cela.", "soft")],
  naiah: [C("Naïah", "J’aime cette maison : elle survit même lorsque je cesse de l’inventer.", "soft")],
  lineva: [C("Lineva", "Je repars au commandement. Mais cette adresse appartient désormais à ma carte du retour.", "soft")],
  saidin: [C("Saidin", "Je connais moins bien demain qu’hier. C’est une conséquence délicieuse.", "soft")],
  bellirith: [C("Bellirith", "Garde le miroir tourné vers le lit. J’ai l’intention de lui donner d’autres vérités.", "soft")],
  amanea: [C("Amanea", "À l’extérieur, je reprendrai ma couronne. Ici, je laisse une promesse de retour.", "soft")],
  tia: [C("Tia", "Le petit sceau peut rester ici. Je préfère qu’une prochaine invitation connaisse déjà l’adresse.", "troubled")],
  allenna: [C("Allenna", "Le monde a tenu sans ma surveillance. Je reviendrai vérifier que cette méthode reste reproductible.", "smirk")],
};

export function homeIntimacyRoutes(character: string, sex: PlayerSex): HomeIntimacyRoute[] {
  return (HOME_ROUTE_SEEDS[character] || []).map((seed) => route(character, sex, seed));
}

export function homeIntimacyOpening(character: string, property: HousingProperty, items: DisplayItem[]): DialogueLine[] {
  const lines = [
    N(`La porte de ${property.name} se referme. La gamme ${property.tier} de la demeure cesse d’être un prix : elle devient l’espace réel dont vous disposez pour ne rien précipiter.`),
    ...(HOME_CHARACTER_OPENING[character] || []),
  ];
  const personalItem = items.find((item) => item.character === character);
  if (personalItem) lines.push(N(`${personalItem.name} reste visible dans la pénombre. Sa présence relie l’histoire déjà vécue à la nuit qui commence.`));
  else if (items.length) lines.push(N(`${items.map((item) => item.name).join(", ")} ${items.length === 1 ? "demeure dans le salon comme un témoin silencieux" : `demeurent dans le salon comme ${items.length} témoins silencieux`} que personne n’a invité${items.length === 1 ? "" : "s"} à parler.`));
  lines.push(N("Le temps du rendez-vous est terminé. Celui de la maison commence, plus lent, capable d’accueillir des pauses, des changements de pièce et plusieurs reprises."));
  return lines;
}

export function homeIntimacyEnding(character: string, property: HousingProperty): DialogueLine[] {
  return [
    N(`La lumière revient lentement dans ${property.name}. Rien n’a demandé de libérer la chambre, de reprendre la route ou de remettre immédiatement un rôle public.`),
    ...(HOME_CHARACTER_ENDING[character] || []),
  ];
}

export function validateHomeIntimacyCatalog() {
  const sexes: PlayerSex[] = ["femme", "homme", "intersexe"];
  let combinations = 0;
  let routes = 0;
  let chapters = 0;
  const labels: string[] = [];
  Object.keys(HOME_ROUTE_SEEDS).forEach((character) => {
    sexes.forEach((sex) => {
      const entries = homeIntimacyRoutes(character, sex);
      if (entries.length !== 3) throw new Error(`${character}/${sex}: trois routes domestiques requises`);
      entries.forEach((entry) => {
        labels.push(entry.text);
        (["tendre", "suggestif", "explicite", "ellipse"] as IntimacyMode[]).forEach((mode) => {
          if (entry.chapters[mode].length !== 8 || entry.chapters[mode].some((chapter) => chapter.length === 0)) throw new Error(`${entry.id}/${mode}: huit séquences requises`);
          chapters += entry.chapters[mode].length;
        });
      });
      combinations += 1;
      routes += entries.length;
    });
  });
  if (new Set(labels).size !== labels.length) throw new Error("Chaque choix domestique par sexe doit avoir un libellé unique.");
  return { characters: Object.keys(HOME_ROUTE_SEEDS).length, combinations, routes, chapters };
}
