import type { DialogueLine } from "./game-data";
import type { IntimacyMode, PlayerSex } from "./date-scenes";
import type { IntimacyRoute } from "./intimacy-routes";

/**
 * Valurn · continuités intimes, une par branche de rendez-vous (neuf au total).
 * Douze séquences chacune, écrites à la main. Les aides ci-dessous ne génèrent
 * aucune prose : elles rangent les passages par mode de visibilité et par corps.
 * Le consentement est posé à la séquence 2 de chaque scène ; l'interface permet
 * toujours de s'arrêter, et un refus ne mène jamais à la scène.
 */

export type ValurnIntimacyContext =
  | "forestier-tournoi" | "forestier-imposture" | "forestier-fond"
  | "river-imprevus" | "river-etoiles" | "river-braise"
  | "home-cabinet" | "home-reception" | "home-cartes";
export type ValurnIntimacyPhase = "approach" | "consent" | "undressing" | "reveal" | "partner-discovery" | "valurn-discovery" | "preliminaries" | "intensification" | "climax" | "afterglow" | "words" | "ending";
export type ValurnDateApproach = { id: string; text: string; lines: DialogueLine[] };

type RawLine = string | readonly [speaker: "Valurn" | "{player}", text: string, mood?: string];
type SexKey = Exclude<PlayerSex, "intersexe">;
type Chapter =
  | { all: RawLine[] }
  | { modes: Record<IntimacyMode, RawLine[]> }
  | { bySex: Record<SexKey, { soft: RawLine[]; explicit: RawLine[] }>; ellipse: RawLine[] };
type Scene = { context: ValurnIntimacyContext; text: string; detail: string; opening: RawLine[]; approaches: [string, string, RawLine[]][]; chapters: Chapter[]; ending: RawLine[] };

export const VALURN_INTIMACY_PHASES: ValurnIntimacyPhase[] = ["approach", "consent", "undressing", "reveal", "partner-discovery", "valurn-discovery", "preliminaries", "intensification", "climax", "afterglow", "words", "ending"];
const MODES: IntimacyMode[] = ["tendre", "suggestif", "explicite", "ellipse"];
const SEXES: SexKey[] = ["femme", "homme"];
export const VALURN_INTIMACY_CONTEXTS: ValurnIntimacyContext[] = ["forestier-tournoi", "forestier-imposture", "forestier-fond", "river-imprevus", "river-etoiles", "river-braise", "home-cabinet", "home-reception", "home-cartes"];

const A = (...all: RawLine[]): Chapter => ({ all });
const M = (tendre: RawLine[], suggestif: RawLine[], explicite: RawLine[], ellipse: RawLine[]): Chapter => ({ modes: { tendre, suggestif, explicite, ellipse } });
const S = (femme: [RawLine[], RawLine[]], homme: [RawLine[], RawLine[]], ellipse: RawLine[]): Chapter => ({
  bySex: { femme: { soft: femme[0], explicit: femme[1] }, homme: { soft: homme[0], explicit: homme[1] } }, ellipse,
});
const lines = (raw: RawLine[]): DialogueLine[] => raw.map((entry) => typeof entry === "string" ? { speaker: "Narration", text: entry } : { speaker: entry[0], text: entry[1], mood: entry[2] });

const SCENES: Scene[] = [
  {
    context: "forestier-tournoi", text: "Monter avec lui après la partie", detail: "La chambre au-dessus de la salle, la craie encore sur les doigts, une victoire ou une défaite qu'on ne compte plus.",
    opening: ["Hubert vous a donné la clé de la petite chambre sans un mot, avec la tête de quelqu'un qui en a vu d'autres. L'escalier craque à chaque marche. En bas, Gorn chante encore.", ["Valurn", "J'ai de la craie partout. Sur les mains, sur le col. Je ressemble à une ardoise.", "amused"], "Il s'arrête sur le seuil, la clé dans la main, et ne la tourne pas."],
    approaches: [["vfti-a", "Lui essuyer la craie de la joue, du pouce", ["Vous lui frottez la pommette. La craie s'étale au lieu de partir.", ["Valurn", "Vous empirez les choses. Continuez.", "charming"]]], ["vfti-b", "Prendre la clé et ouvrir vous-même", ["La serrure résiste, puis cède. Valurn vous regarde faire comme on regarde quelqu'un gagner une manche."]]],
    chapters: [
      A("La chambre est petite, un lit, une cuvette, une fenêtre sur la cour. Valurn pose l'osselet de la soirée sur l'appui de la fenêtre comme un témoin.", ["Valurn", "Je n'ai rien prévu. Pour une fois, c'est vrai."]),
      A(["Valurn", "Dites-moi si vous voulez rester. Je redescends sinon, et je perds encore une manche contre Gorn. J'en serai très content aussi.", "neutral"], ["{player}", "Je veux rester. Avec vous."], ["Valurn", "Bien. Moi aussi. Arrêtez-moi quand vous voulez. Je m'arrête."]),
      A("Ses boutons sont nombreux et ridiculement petits. Vous en ratez deux. Il rit, défait les siens trop vite, en arrache un, qui roule sous le lit et ne sera jamais retrouvé.", "Ses mains sont plus lentes sur vos vêtements à vous, attentives, comme si chaque agrafe méritait qu'on lui demande la permission."),
      A("Torse nu dans la lumière de la cour, Valurn a moins d'assurance qu'en bas. Sa peau est plus chaude que la vôtre, nettement, comme un mur exposé au soleil toute la journée.", ["Valurn", "C'est le sang de mon père. Ça ne brûle pas. Ça fait juste une très mauvaise surprise en hiver aux gens qui me serrent la main."]),
      A("Il vous regarde longtemps sans toucher, comme on lit une carte avant de jouer. Puis il pose une main sur votre hanche, l'autre au creux de votre dos, et attend.", ["Valurn", "Pour vous, je perdrais une partie entière. J'en ai perdu une ce soir. Je savais pourquoi."]),
      A("Vous découvrez qu'il est chatouilleux sous les côtes, ce qu'il nie avec indignation et un sursaut complet. Vous découvrez aussi une vieille cicatrice à l'épaule, mince et pâle, dont il ne dit rien et sur laquelle vous ne demandez rien."),
      M(
        ["Il vous embrasse lentement, le long de la mâchoire, puis du cou. Ses lèvres ont encore le goût de la bière de Hubert. Vous riez contre sa bouche."],
        ["Ses baisers descendent le long de votre gorge, s'attardent à la naissance de la poitrine. Sa paume chaude glisse sur votre ventre et s'arrête juste au bord de la ceinture défaite, en attendant votre signe."],
        ["Il descend le long de votre corps, la bouche ouverte sur votre peau, et ses mains trouvent ce que vous lui offrez sans le presser. Il apprend vos réactions comme une règle de jeu, vite, et la respecte."],
        ["Il vous embrasse. Plus tard, l'osselet tombe de l'appui de la fenêtre, et aucun de vous ne se lève pour le ramasser."],
      ),
      S(
        [["Vous l'attirez sur vous. Il vient doucement, en appui sur ses bras, et vos corps trouvent leur rythme sans hâte."], ["Il entre en vous lentement, le front contre le vôtre, et s'arrête pour vérifier votre regard avant de reprendre. La chaleur de sa peau se répand dans la vôtre à chaque mouvement, et vous sentez votre plaisir monter sous ses hanches patientes."]],
        [["Vous le renversez sur le lit étroit. Il se laisse faire, surpris, puis heureux de l'être."], ["Sa main vous enveloppe, chaude, d'abord hésitante, puis sûre, réglée sur votre souffle. Quand vous vous unissez enfin, il garde les yeux ouverts, attentif à chaque frisson qu'il provoque."]],
        ["La lumière de la cour s'éteint. Ce qui suit appartient au lit étroit, aux draps rêches et à la chaleur qu'il laisse sur votre peau."],
      ),
      M(
        ["Le plaisir vient sans bruit, en vagues lentes. Il vous serre contre lui comme si la chambre allait s'envoler."],
        ["Vous basculez avant lui. Il vous suit de près, le visage dans votre cou, avec un son étouffé qu'il ne fait jamais en public."],
        ["La jouissance vous prend en un long frisson, les doigts dans ses cheveux. Il se laisse aller peu après, sans retenue, le souffle cassé, et reste longtemps tremblant contre vous."],
        ["En bas, Gorn termine sa chanson. Ici, plus rien n'a besoin d'être compté."],
      ),
      A("Il ne bouge pas. Sa chaleur sèche la sueur sur vos bras. Vous sentez son cœur se calmer contre votre épaule, lentement, comme une salle d'auberge qui se vide."),
      A(["Valurn", "Je n'ai pas de phrase. J'en ai toujours une. Je n'en ai pas."], ["{player}", "Ce n'est pas grave."], ["Valurn", "Non. C'est même assez bien.", "away"]),
      A("Au matin, l'osselet est sous le lit, à côté du bouton perdu. Valurn les ramasse tous les deux et vous les donne, sans explication."),
    ],
    ending: ["Vous descendez ensemble. Hubert pose deux bols de bouillie sans commentaire. Gorn, la tête dans les mains, lève un pouce vers Valurn, qui rougit pour la première fois de sa vie."],
  },
  {
    context: "forestier-imposture", text: "Garder les masques encore un peu", detail: "Messire Orbe et son inspection monteront ensemble, puis l'un des deux enlèvera le masque en premier.",
    opening: ["Messire Orbe vous propose, avec une galanterie de veuf, de visiter sa chambre « pour une inspection du mobilier ». Hubert lève les yeux au ciel et lui tend la clé quand même.", ["Valurn", "Orbe est un homme très seul. Il compte sur votre professionnalisme.", "charming"]],
    approaches: [["vfii-a", "Rester dans le rôle et inspecter le lit avec sérieux", ["Vous tâtez le matelas en hochant la tête. Il note une note imaginaire dans un carnet imaginaire.", ["Valurn", "Verdict ?", "amused"]]], ["vfii-b", "Lui retirer le chapeau d'Orbe, doucement", ["Vous enlevez le chapeau. Il reste immobile, soudain moins drôle, plus présent."]]],
    chapters: [
      A("La chambre est la même que toutes celles du Forestier, sauf qu'il y a, ce soir, un chapeau d'emprunt posé sur la chaise comme un troisième personnage."),
      A(["Valurn", "Orbe se retire. Il reste moi. Je voudrais savoir si c'est encore une bonne idée.", "neutral"], ["{player}", "C'est vous que je veux. Pas Orbe."], ["Valurn", "Alors c'est oui pour moi aussi. Et vous pouvez tout arrêter. Je ne demanderai pas pourquoi."]),
      A("Vous vous déshabillez l'un l'autre en échangeant des faux noms, de plus en plus absurdes, jusqu'à ce que vous ne trouviez plus rien et qu'il ne reste que vos prénoms, murmurés."),
      A("Il se tient devant vous sans rien, sans rôle, et ça lui coûte plus que tout le reste. Ses épaules sont tendues. Il les relâche quand vous souriez, pas avant."),
      A("Il vous regarde comme le marchand de verre regardait les lunettes inexistantes : avec une croyance totale.", ["Valurn", "Vous, au moins, vous existez. J'ai vérifié."]),
      A("Vous découvrez ses mains, longues, avec des cals d'écriture sur le majeur droit, et ses poignets sensibles qu'il retire quand vous les embrassez, puis vous rend aussitôt."),
      M(
        ["Il vous allonge sur le lit et vous couvre de baisers légers, sur les paupières, les tempes, le coin des lèvres, comme s'il comptait."],
        ["Ses lèvres s'aventurent plus bas, sur votre ventre, puis l'intérieur de votre cuisse, et remontent. Il reste à la lisière, joueur, jusqu'à ce que vous l'appeliez par son vrai nom."],
        ["Sa bouche descend et s'attarde là où vous le guidez, patiente, gourmande, attentive à chaque souffle que vous lâchez. Il ne s'arrête que pour vous regarder, et reprend dès que vous le demandez."],
        ["Il vous embrasse. Le chapeau glisse de la chaise. Ni Orbe ni l'inspection n'ont plus rien à dire."],
      ),
      S(
        [["Vous l'accueillez contre vous et vos corps s'accordent, lentement, sans un mot."], ["Il vient en vous, très lentement, et vous sentez la chaleur singulière de son corps vous gagner tout entière. Vous le serrez entre vos jambes ; il suit votre cadence, sans jamais chercher à imposer la sienne."]],
        [["Il vous attire au-dessus de lui et vous laisse mener. Vous découvrez qu'il aime être guidé."], ["Vous l'enveloppez de la main puis de votre corps, à votre rythme. Il cède, les doigts accrochés aux draps, et sa voix se brise sur votre nom, le vrai."]],
        ["La bougie fond. Quelque part, dans cette chambre, Orbe meurt définitivement, et Valurn reste."],
      ),
      M(
        ["Le plaisir vient en même temps pour vous deux, par surprise, comme une réplique qu'on n'a pas répétée."],
        ["Vous vous défaites avant lui, contre lui, et il vous rejoint dans un soupir qu'il essaie, sans succès, d'étouffer dans l'oreiller."],
        ["La vague monte et vous submerge en tremblant ; il vous suit, le corps tendu, puis relâché d'un coup, la respiration perdue contre votre gorge."],
        ["Au matin, le chapeau est sous le lit, aplati. Ce qui s'est passé n'a pas besoin d'inventaire."],
      ),
      A("Vous restez allongés. Il trace du doigt des formes sur votre épaule. Vous devinez des lunettes, puis un chapeau, puis votre propre prénom."),
      A(["Valurn", "C'est la première fois que je joue un rôle et que je l'enlève avec quelqu'un. D'habitude, je le garde jusqu'à la porte."], ["{player}", "Et maintenant ?"], ["Valurn", "Maintenant, je suis là. C'est tout. C'est déjà beaucoup.", "away"]),
      A("Il rend le chapeau au client endormi, au matin, en le posant délicatement sur sa tête. Le client ne s'est réveillé de rien."),
    ],
    ending: ["Hubert vous sert le petit déjeuner en appelant Valurn « Messire Orbe » d'une voix parfaitement neutre. Valurn manque de s'étouffer dans son lait."],
  },
  {
    context: "forestier-fond", text: "Prolonger la table du fond", detail: "Une question posée à voix haute, une réponse, et une porte qu'on ferme doucement.",
    opening: ["Après la carte blanche, il ne reste que vous deux et Hubert qui empile les chaises. Valurn se lève, hésite, se rassoit.", ["Valurn", "J'ai une deuxième question. Elle est plus courte. Je ne l'ai pas écrite.", "neutral"]],
    approaches: [["vffi-a", "Lui dire de la poser", ["Il la pose, simplement : « Vous montez ? » Rien d'autre."]], ["vffi-b", "Répondre avant qu'il la pose", ["Vous vous levez et lui tendez la main. Il la regarde comme une carte qu'il n'osait pas jouer."]]],
    chapters: [
      A("La chambre sent le bois et la laine. Il ferme la porte doucement, comme pour ne réveiller personne, alors que la maison entière dort déjà."),
      A(["Valurn", "Je vous demande une dernière fois. Je ne veux pas avoir bien joué. Je veux que vous en ayez envie.", "neutral"], ["{player}", "J'en ai envie."], ["Valurn", "Moi aussi. Beaucoup. Vous dites stop, je m'arrête, sans faire de scène. Promis."]),
      A("Vous le déshabillez avec soin. Il se laisse faire, les bras le long du corps, comme si c'était la première fois que quelqu'un prenait le temps."),
      A("Sous la lampe, la chaleur de sa peau se devine presque, comme l'air au-dessus d'une pierre d'été. Il le sait, il guette votre regard. Vous le regardez sans détour."),
      A("Quand c'est votre tour, il ne se presse pas. Il pose ses mains sur vous à plat, comme pour sentir la chaleur, et la sienne répond.", ["Valurn", "Vous êtes là. C'est bête. Je n'arrive pas à m'en remettre."]),
      A("Vous découvrez qu'il respire mal quand vous embrassez la peau sous son oreille, et qu'il le cache en parlant trop. Puis il ne parle plus du tout."),
      M(
        ["Vous restez longtemps à vous embrasser, assis sur le bord du lit, sans aller plus loin, et c'est déjà vertigineux."],
        ["Sa bouche s'attarde sur votre torse, sur vos flancs, puis sur la courbe de votre hanche. Vos mains découvrent qu'il frémit au moindre effleurement le long du dos."],
        ["Vous vous caressez mutuellement, allongés face à face, sans hâte, les doigts curieux, en guettant chaque soupir de l'autre. Il apprend vite ce qui vous fait gémir et vous fait gémir encore."],
        ["La lampe faiblit. Vous ne la rallumez pas."],
      ),
      S(
        [["Il vient contre vous, lentement, et vous vous trouvez sans effort, comme une conversation reprise au bon endroit."], ["Il entre en vous avec une lenteur infinie, les yeux dans les vôtres. Vous sentez sa chaleur au plus profond, et il ne bouge que lorsque vous l'y invitez, d'une pression des hanches."]],
        [["Vous vous allongez l'un contre l'autre, et le désir se fait simple, réciproque, sans manœuvre."], ["Vous l'accueillez au creux de votre paume, puis plus intimement, à votre rythme. Il se cambre sous vous, la main sur votre nuque, et murmure votre nom comme une réponse à sa propre question."]],
        ["Ce qui se dit ensuite, sans mots, reste dans la chambre."],
      ),
      M(
        ["Le plaisir vous prend lentement, comme une chaleur qui monte d'un feu bien couvert."],
        ["Vous chavirez, les mains accrochées à ses épaules. Il vous suit, la bouche dans vos cheveux, en retenant un son qui vous fait sourire."],
        ["La jouissance vous traverse et vous laisse sans force ; il la rejoint aussitôt, le corps tendu contre le vôtre, et retombe en riant presque, comme soulagé."],
        ["Il fait nuit. Il fait bon. On n'en dira pas plus."],
      ),
      A("Vous restez enlacés. Il remonte la couverture sur vos épaules et garde la main posée sur votre bras, sans la bouger."),
      A(["Valurn", "La table du fond, c'était une très bonne idée."], ["{player}", "C'était la vôtre."], ["Valurn", "Non. C'était la vôtre. J'ai seulement réservé.", "away"]),
      A("Au matin, la carte blanche est sur l'oreiller. Il a ajouté une ligne en dessous : « Oui. »"),
    ],
    ending: ["Vous descendez. Hubert a déjà réservé la table du fond pour « une date que personne ne connaît encore ». Valurn paie d'avance, sans marchander."],
  },
  {
    context: "river-imprevus", text: "Rester sous la bâche", detail: "Trempés, rassasiés à moitié, et une loutre hostile pour seul témoin.",
    opening: ["La pluie revient, fine. La bâche empruntée tient bon. Vous êtes serrés dessous, épaule contre épaule, et Valurn grelotte malgré sa chaleur naturelle.", ["Valurn", "Je ne grelotte pas. Je vibre d'indignation contre le climat.", "annoyed"]],
    approaches: [["vrii-a", "Le prendre dans vos bras pour le réchauffer", ["Il se laisse faire immédiatement, sans protester, ce qui est très suspect."]], ["vrii-b", "Lui proposer de mettre les vêtements mouillés à sécher", ["Il vous regarde, comprend, et éclate de rire. « Pour sécher. Bien sûr. Le séchage. »"]]],
    chapters: [
      A("Sous la bâche, la couverture est la seule chose sèche. Le feu crépite devant. La loutre, quelque part dans les roseaux, fait un bruit de désapprobation."),
      A(["Valurn", "On peut aussi juste dormir. Je le dis sérieusement. Ce serait bien aussi.", "neutral"], ["{player}", "Je ne veux pas juste dormir."], ["Valurn", "Moi non plus. Mais vous pouvez changer d'avis à n'importe quel moment. Même au pire moment."]),
      A("Les vêtements mouillés collent. Les retirer devient une lutte comique, une manche coincée, une botte qui refuse. Vous riez tous les deux si fort que la loutre plonge."),
      A("Devant le feu, sa peau fume légèrement à cause de l'humidité. Il remarque votre regard et prend la pose d'une statue antique, puis éternue."),
      A("Il étend la couverture sur vous deux. Sa main trouve votre dos froid et s'y pose à plat, chaude comme une pierre de foyer.", ["Valurn", "Voilà. Je suis enfin utile."]),
      A("Vous découvrez qu'il a les pieds glacés, contrairement à tout le reste. C'est la seule partie de lui qui obéit aux lois de la nature."),
      M(
        ["Il vous embrasse le front, le nez, la bouche, en vous serrant plus fort à chaque fois, comme pour vous protéger de la pluie."],
        ["Sous la couverture, ses mains se promènent, réchauffent vos flancs, votre poitrine, l'arrondi de vos hanches. Il prend son temps, et le froid s'en va bien avant qu'il ait fini."],
        ["Ses caresses descendent, précises et lentes, jusqu'au plus intime, et la chaleur qu'il y met n'a plus rien à voir avec la pluie. Vous vous accrochez à lui en mordant votre lèvre pour ne pas réveiller les charretiers."],
        ["La pluie tambourine sur la bâche. Elle couvre tout le reste, par délicatesse."],
      ),
      S(
        [["Vous l'attirez sur vous, sous la couverture lourde, et vous vous trouvez dans une étreinte maladroite et tendre."], ["Il glisse en vous avec lenteur, sa chaleur contre votre froid, et le contraste vous arrache un soupir. Vous l'enserrez de vos jambes et il se meut au rythme de la pluie, sans jamais presser."]],
        [["Vous vous retrouvez l'un contre l'autre, sous la bâche trop basse, et vous inventez une manière de vous aimer qui ne la renverse pas."], ["Sa main vous enveloppe, puis votre corps l'accueille, ou le sien vous reçoit, selon le jeu. Il suit votre souffle, attentif, et chaque mouvement vous rapproche de la chaleur du feu."]],
        ["La pluie redouble. Le feu tient. Vous aussi."],
      ),
      M(
        ["Le plaisir vous emporte doucement, au son de la pluie, comme une vague qui ne fait pas de bruit."],
        ["Le plaisir vous emporte avant lui, la bouche contre son épaule. Il suit, le front dans votre cou, avec un rire étranglé."],
        ["Vous jouissez en le serrant de toutes vos forces ; il vous rejoint dans un frisson long, puis s'effondre contre vous, essoufflé, heureux, trempé."],
        ["À l'aube, la loutre est revenue, assise sur la bâche."],
      ),
      A("Vous restez serrés sous la couverture. La pluie cesse. Le fleuve reprend sa voix normale. Valurn a enfin les pieds chauds."),
      A(["Valurn", "Rien ne s'est passé comme prévu."], ["{player}", "Vous n'aviez rien prévu."], ["Valurn", "Justement. C'est la meilleure chose que je n'aie jamais prévue.", "away"]),
      A("Au matin, une arête de poisson attend devant le feu éteint. Valurn la contemple avec gravité."),
    ],
    ending: ["« Elle nous paie, dit-il. Pour le spectacle. » Il rend la bâche au charretier avec la moitié du fromage et un sourire qu'il ne cherche plus à contrôler."],
  },
  {
    context: "river-etoiles", text: "Vendre une dernière chose", detail: "Le marché fermé, il reste une marchandise qu'aucun des deux n'a mise en vente.",
    opening: ["L'étal est rangé. La pierre plate a repris sa place dans l'herbe. Valurn s'allonge sur la couverture, les mains derrière la tête, et regarde le ciel.", ["Valurn", "Il reste une chose qu'on n'a pas vendue. Je n'ose pas fixer le prix.", "neutral"]],
    approaches: [["vrei-a", "Lui demander ce que c'est", ["Il ne répond pas. Il tend la main vers vous, paume ouverte, comme on présente une marchandise."]], ["vrei-b", "Vous allonger contre lui, sans rien dire", ["Il retient son souffle, puis le relâche, et sa main trouve la vôtre."]]],
    chapters: [
      A("Les étoiles sont toutes là. Le feu est bas. La rive est déserte, à part les charrettes endormies au loin."),
      A(["Valurn", "C'est gratuit. Tout ce qui suit. On ne doit rien, ni l'un ni l'autre, et on peut s'arrêter. D'accord ?", "neutral"], ["{player}", "D'accord. Et j'en ai envie."], ["Valurn", "Alors moi aussi. Dites-le si ça change."]),
      A("Vous vous déshabillez sous les étoiles, sans hâte. Il plie ses vêtements avec soin, puis renonce et les jette au hasard, ce qui ne lui ressemble pas du tout."),
      A("Allongé nu sur la couverture, il a l'air d'une des statues des jardins impériaux, en moins solennel. Il le sait. Il fait la grimace pour gâcher l'effet."),
      A("Il vous regarde à la lumière des étoiles, longtemps, comme une constellation qu'on cherche à mémoriser.", ["Valurn", "Je n'ai rien à vendre qui vaille ça."]),
      A("Vous découvrez qu'il garde les yeux ouverts quand il embrasse, et qu'il les ferme seulement quand vous lui caressez la nuque."),
      M(
        ["Vous échangez des baisers comme des pièces d'un marché inventé, un pour une étoile, deux pour un silence."],
        ["Ses mains suivent le contour de vos épaules, puis de votre poitrine, de votre ventre, avec la lenteur d'un marchand qui inspecte une soie rare. Il ne prend rien, il attend que vous offriez."],
        ["Il vous caresse longuement, sa bouche cherchant chaque endroit qui vous fait soupirer, et vous offrez tout, sans marchander, en le guidant de la main."],
        ["Une étoile file. Personne ne la regarde."],
      ),
      S(
        [["Vous vous unissez sous le ciel, lentement, comme un dernier marché conclu sans prix."], ["Il entre en vous en douceur, en vous regardant, et le ciel tourne au-dessus de vous à chacun de ses mouvements lents. Vous sentez sa chaleur vous envahir et vous l'enlacez pour la garder."]],
        [["Vous l'attirez contre vous et le désir s'échange de l'un à l'autre, sans comptabilité."], ["Il vous accueille et vous l'accueillez tour à tour, entre ses mains puis en vous ou en lui, selon votre envie. Il suit votre élan, généreux, les doigts mêlés aux vôtres, et oublie de compter."]],
        ["Ce marché-là ne s'écrit pas. Il se conclut à la lumière des étoiles, et c'est tout."],
      ),
      M(
        ["Le plaisir monte comme une étoile qui file, bref et brillant."],
        ["Vous basculez avant lui, le visage tourné vers le ciel. Il vous rejoint dans un souffle qui ressemble à votre prénom."],
        ["La jouissance vous saisit en un long frémissement ; il la rejoint à son tour, tendu puis libéré, et vous tient contre lui comme la seule marchandise qu'il voudra jamais garder."],
        ["Le feu s'éteint. Le ciel reste."],
      ),
      A("Vous restez allongés à compter les étoiles. Il se trompe exprès, vous le corrigez, il se trompe encore."),
      A(["Valurn", "C'était hors de prix."], ["{player}", "C'était gratuit."], ["Valurn", "Oui. C'est pour ça.", "away"]),
      A("À l'aube, il vous offre le bouton d'argent, une deuxième fois, comme si la première n'avait pas suffi."),
    ],
    ending: ["Vous rentrez à pied vers Al'Gratal. Il n'essaie pas de vendre quoi que ce soit aux marchands du chemin. C'est la première fois."],
  },
  {
    context: "river-braise", text: "Veiller la braise autrement", detail: "Le feu presque éteint, le silence à sa place, et une confiance qui n'a pas besoin de jeu.",
    opening: ["La braise rougeoie. Valurn est assis, les genoux repliés, et vous regarde sans parler depuis un long moment.", ["Valurn", "Je ne sais pas comment demander ça sans plaisanter.", "neutral"]],
    approaches: [["vrbi-a", "Lui dire de ne pas plaisanter", ["Il hoche la tête. « Je voudrais vous toucher. Si vous voulez. » C'est tout."]], ["vrbi-b", "Le rejoindre de votre côté du feu", ["Vous vous asseyez contre lui. Il ferme les yeux, une seconde."]]],
    chapters: [
      A("Il n'y a plus de bruit. Le fleuve, la braise, vos respirations. La nuit est douce pour la saison."),
      A(["Valurn", "Vous pouvez dire non. Maintenant ou plus tard.", "neutral"], ["{player}", "Je dis oui."], ["Valurn", "Moi aussi. Je m'arrête au premier mot. N'importe lequel."]),
      A("Vous vous déshabillez lentement, sans jeu, en vous regardant. Il est très sérieux. Il en devient presque timide."),
      A("La braise éclaire sa peau par en dessous, en ombres chaudes. Il ne fait pas de grimace pour gâcher l'effet. Il vous laisse regarder."),
      A("Il pose la main sur votre joue, puis sur votre cou, puis sur votre cœur, et s'arrête là.", ["Valurn", "Il bat vite."], ["{player}", "Le vôtre aussi."]),
      A("Vous découvrez qu'il tremble un peu, et que ce n'est pas le froid. Vous le serrez. Il cesse de trembler."),
      M(
        ["Vous vous embrassez longtemps, assis face à face, front contre front entre deux baisers."],
        ["Ses mains descendent sur vos hanches et vous rapprochent de lui ; vous sentez la chaleur de son corps contre le vôtre, partout, et le désir qui grandit chez l'un comme chez l'autre."],
        ["Il vous allonge sur la couverture et vous caresse avec une lenteur qui frôle la ferveur, de la bouche et des doigts, jusqu'à ce que vous le suppliiez sans mots de continuer."],
        ["La braise s'assombrit. Vous ne la nourrissez pas."],
      ),
      S(
        [["Vous vous unissez près de la braise, sans hâte, en vous regardant tout le long."], ["Il vient en vous presque immobile, le front contre le vôtre, et ne bouge que pour suivre votre souffle. La chaleur de son corps et celle de la braise se mêlent jusqu'à ce que vous ne sachiez plus laquelle vous traverse."]],
        [["Vous vous enlacez et le désir circule entre vous comme la chaleur du feu."], ["Vous l'accueillez avec lenteur, de la main puis de tout le corps, et il vous rend chaque geste avec une douceur appliquée. Ses yeux restent dans les vôtres jusqu'au bout."]],
        ["Le reste se passe près de la braise, et la braise ne dit rien."],
      ),
      M(
        ["Le plaisir vient doucement, sans éclat, comme une braise qui se ranime sous un souffle."],
        ["Le plaisir vous emporte contre lui ; il vous suit, la tête basculée en arrière, les yeux fermés pour une fois."],
        ["La jouissance vous parcourt longuement ; il s'y laisse aller avec vous, sans retenue, le visage contre votre épaule, et reste immobile longtemps après."],
        ["Plus tard, la braise est presque éteinte. Vous la regardez ensemble."],
      ),
      A("Vous restez enlacés, la couverture sur vous. Il respire lentement. Vous croyez qu'il dort. Il ne dort pas."),
      A(["Valurn", "Merci."], ["{player}", "Pour quoi ?"], ["Valurn", "Pour rien. Pour ça. Je ne sais pas dire mieux.", "away"]),
      A("Au matin, la braise est encore tiède. Il la couvre de cendre avec un soin de jardinier."),
    ],
    ending: ["Vous rentrez sans parler, côte à côte. Arrivé au pont, il vous prend la main. Il ne la lâche qu'aux portes de la ville, et encore."],
  },
  {
    context: "home-cabinet", text: "Rester dans le cabinet", detail: "Après l'inventaire, il reste une pièce à découvrir que l'étagère vide ne contient pas.",
    opening: ["L'inventaire est fini. Valurn repose le dernier objet et vous regarde par-dessus l'étagère vide.", ["Valurn", "J'ai catalogué tout votre logis. Sauf une pièce. Je n'ose pas y toucher sans permission.", "charming"]],
    approaches: [["vhci-a", "Lui donner la permission, en riant", ["Vous riez. Il ne rit pas tout de suite. Il pose la main sur votre bras, très doucement."]], ["vhci-b", "Le guider vers la chambre", ["Il vous suit, et s'arrête sur le seuil pour demander, d'un regard, s'il peut entrer."]]],
    chapters: [
      A("Votre chambre est à vous, avec son désordre et ses objets familiers. Il la regarde avec le même respect qu'il avait pour l'étagère."),
      A(["Valurn", "Ici, c'est chez vous. Vous décidez tout. Si vous voulez qu'on s'arrête, on s'arrête.", "neutral"], ["{player}", "Je veux que vous restiez."], ["Valurn", "Je reste. Et je vous écoute."]),
      A("Il vous déshabille comme il inspectait vos objets : lentement, en demandant l'histoire de chaque vêtement, que vous inventez de plus en plus mal."),
      A("Debout près de votre lit, il est nu et n'a plus rien à cataloguer. Il rit, gêné, parce qu'il ne sait pas quoi faire de ses mains."),
      A("Vous lui prenez les mains et les posez sur vous. Il les laisse là, émerveillé comme devant un objet sans prix.", ["Valurn", "Celle-là, je ne l'aurais jamais trouvée dans un cabinet."]),
      A("Vous découvrez qu'il a un grain de beauté sous le bras gauche, et qu'il ne le savait pas. Il se tord pour le voir, en vain."),
      M(
        ["Il vous embrasse partout où il peut, avec méthode, comme s'il dressait l'inventaire de vos sourires."],
        ["Sa bouche explore votre corps, lente et curieuse, et vous découvrez qu'il est capable de silence quand il s'agit de vous faire frémir."],
        ["Il descend le long de vous, sans hâte, et ses lèvres et ses doigts trouvent tous les endroits qui vous font cambrer, qu'il note d'un murmure satisfait avant d'y revenir."],
        ["La lampe s'éteint, et il ne cherche pas à la rallumer."],
      ),
      S(
        [["Vous l'accueillez dans votre lit et vos corps se trouvent, comme une pièce qu'on range enfin au bon endroit."], ["Il entre en vous lentement, les yeux dans les vôtres, et chaque mouvement est une question à laquelle votre corps répond oui. Sa chaleur vous envahit, et vous le gardez en vous en l'enserrant."]],
        [["Vous l'attirez contre vous et le désir devient simple, chez vous, entre vos draps."], ["Votre main l'enveloppe, puis vos corps s'unissent, à votre rythme. Il suit chaque élan, les doigts dans vos cheveux, et murmure des choses qui ne sont pas des inventaires."]],
        ["Ce qui suit reste entre vos murs."],
      ),
      M(
        ["Le plaisir vous prend tous les deux, doucement, comme une porte qui s'ouvre sans grincer."],
        ["Vous chavirez avant lui, le visage dans votre oreiller. Il vous rejoint, le souffle haché, la main serrée dans la vôtre."],
        ["La jouissance vous submerge, et il la suit de près, le corps tendu contre le vôtre, puis relâché, comme vidé de tout calcul."],
        ["Plus tard, la nuit est complète. Vous dormez, peut-être."],
      ),
      A("Il reste contre vous, la joue sur votre épaule, et compte du doigt les objets de votre étagère à voix basse jusqu'à s'endormir au milieu."),
      A(["Valurn", "Inventaire terminé."], ["{player}", "Et alors ?"], ["Valurn", "Rien à vendre. Tout à garder.", "away"]),
      A("Au matin, la petite carte de l'étagère vide porte une deuxième date, d'une écriture endormie."),
    ],
    ending: ["Il prend le petit déjeuner chez vous, en touchant chaque objet de la cuisine avec une curiosité d'enfant. Il ne demande le prix d'aucun."],
  },
  {
    context: "home-reception", text: "Prolonger la réception", detail: "Les invités imaginaires sont partis. Il reste l'hôte, et la seule personne réellement invitée.",
    opening: ["Les bougies baissent. Valurn congédie les invités imaginaires un à un, avec des révérences. Puis il se tourne vers vous.", ["Valurn", "La réception est finie. Les invités sont partis. Vous restez ?", "neutral"]],
    approaches: [["vhri-a", "Lui faire la révérence et accepter", ["Il vous rend la révérence, très bas, et se redresse avec un regard qui n'a plus rien de protocolaire."]], ["vhri-b", "L'inviter à danser encore, sans musique", ["Il vous prend la main et vous fait tourner, lentement, vers la chambre."]]],
    chapters: [
      A("La nappe est encore sur le coffre. Une seule bougie brûle. La musique fredonnée s'est arrêtée au milieu d'une mesure."),
      A(["Valurn", "Plus de rôle ce soir. Juste moi. Et si vous voulez arrêter, à n'importe quel moment, on arrête.", "neutral"], ["{player}", "Je veux continuer."], ["Valurn", "Moi aussi. Beaucoup."]),
      A("Il défait vos vêtements comme on défait une tenue de bal, cérémonieusement, puis avec de moins en moins de cérémonie."),
      A("Sans ses vêtements de cour, il semble plus jeune, plus mince, plus vrai. Il garde un instant les bras croisés, puis les décroise."),
      A("Il vous regarde à la lumière de l'unique bougie.", ["Valurn", "La seule personne que j'ai invitée. J'ai bien choisi."]),
      A("Vous découvrez qu'il fredonne quand il est heureux, sans s'en rendre compte. Vous ne le lui dites pas, pour qu'il continue."),
      M(
        ["Vous vous embrassez en dansant encore un peu, jusqu'à ce que la danse devienne autre chose."],
        ["Ses mains glissent le long de votre dos, sur vos reins, et vous serrent contre lui. Sa bouche cherche votre cou, votre épaule, le creux de votre clavicule."],
        ["Il vous étend sur le lit et vous couvre de baisers de plus en plus bas, ses mains précises suivant chaque frisson, jusqu'à ce que vous l'attiriez à vous, avec une impatience qui le fait rire."],
        ["La bougie vacille. Le reste de la réception est privé."],
      ),
      S(
        [["Vous vous unissez lentement, et c'est la plus belle danse de la soirée."], ["Il entre en vous avec douceur, et votre corps l'accueille au rythme d'une valse lente. Sa chaleur se répand en vous, et vous l'enlacez pour ne pas perdre la mesure."]],
        [["Vous vous enlacez et le désir prend le relais de la danse."], ["Vous l'enveloppez de votre main, puis de votre corps, ou c'est lui qui vous reçoit, selon la figure. Il suit chaque pas, la respiration de plus en plus courte."]],
        ["La dernière danse appartient aux danseurs."],
      ),
      M(
        ["Le plaisir monte et retombe comme une dernière note tenue."],
        ["Vous basculez avant lui, le souffle court ; il vous rejoint en fredonnant presque, puis en se taisant d'un coup."],
        ["La jouissance vous emporte, et il la suit, le corps arc-bouté puis relâché, le visage dans vos cheveux, en riant doucement."],
        ["La bougie s'éteint. Personne ne la rallume."],
      ),
      A("Vous restez allongés. Il fredonne encore, sans s'en rendre compte. Vous ne dites rien."),
      A(["Valurn", "Je n'ai jamais été invité nulle part comme ça."], ["{player}", "Vous étiez l'hôte."], ["Valurn", "Non. Ce soir, c'était vous. J'étais invité.", "away"]),
      A("Au matin, la nappe est pliée sur le coffre, et une fleur des champs est posée dessus, cueillie on ne sait où."),
    ],
    ending: ["Il part tard, en frappant à la porte avant de sortir, pour la symétrie. Vous lui ouvrez. Il rit et revient prendre un dernier café."],
  },
  {
    context: "home-cartes", text: "Jouer une dernière main, cartes ouvertes", detail: "Plus de jeu, mais la même règle : tout est visible, il ne reste qu'à choisir.",
    opening: ["Les cartes sont rangées, face visible. Valurn reste assis à votre table, les mains à plat.", ["Valurn", "Cartes ouvertes. Je vais dire ce que je veux, et vous direz ce que vous voulez. Je vous préviens, c'est terrifiant.", "neutral"]],
    approaches: [["vhki-a", "Lui dire ce que vous voulez, en premier", ["Vous le dites. Simplement. Il ferme les yeux une seconde, puis les rouvre."]], ["vhki-b", "Le laisser parler en premier", ["« Je voudrais rester ce soir. Avec vous. Si vous voulez. » Il ne bluffe pas, ça se voit."]]],
    chapters: [
      A("Vous laissez les cartes sur la table. La chambre est à trois pas. Il ne bouge pas avant que vous vous leviez."),
      A(["Valurn", "Rien de caché. Vous pouvez tout arrêter, je le verrai, je m'arrêterai.", "neutral"], ["{player}", "Je ne veux pas arrêter."], ["Valurn", "Moi non plus."]),
      A("Vous vous déshabillez en vous regardant, sans pudeur feinte ni hâte. Il ne fait aucun mot d'esprit. Il regarde."),
      A("Il se tient devant vous, sans rien, comme les cartes : face visible. Ça lui coûte. Il le montre aussi."),
      A("Il vous regarde, longtemps, sans rien dire.", ["Valurn", "Je n'ai jamais rien vu d'aussi clair."]),
      A("Vous découvrez qu'il garde les mains ouvertes, paumes vers le haut, quand il ne sait pas s'il a le droit de toucher. Vous les prenez."),
      M(
        ["Vous vous embrassez sans stratégie, sans manœuvre, comme deux personnes qui n'ont rien à cacher."],
        ["Ses mains découvrent votre corps avec une franchise nouvelle, sans détour, et vous sentez son désir aussi clairement que le vôtre."],
        ["Il vous caresse longuement, de la bouche et des mains, en suivant vos soupirs comme on suit le jeu d'un partenaire, et vous le guidez sans rien retenir."],
        ["Plus rien n'est caché, et pourtant ce qui suit reste à vous deux."],
      ),
      S(
        [["Vous vous unissez face à face, en vous regardant, sans rien cacher."], ["Il entre en vous lentement, les yeux ouverts, et vous ne détournez pas les vôtres. Chaque mouvement est visible, voulu, partagé, et le plaisir monte sans masque."]],
        [["Vous vous enlacez et le désir se joue cartes ouvertes."], ["Vous l'accueillez de la main puis de tout votre corps, ou il vous reçoit, comme vous le choisissez. Il suit chaque élan, et rien n'est feint."]],
        ["La partie se termine sans gagnant, et c'est très bien ainsi."],
      ),
      M(
        ["Le plaisir vous gagne en même temps, comme une égalité."],
        ["Vous basculez avant lui, il vous suit aussitôt, et vous riez ensemble de l'égalité presque parfaite."],
        ["La jouissance vous prend, et il la partage, le corps tendu puis relâché contre le vôtre, sans rien retenir, sans rien jouer."],
        ["Égalité. Personne ne compte les points."],
      ),
      A("Vous restez enlacés, les mains nouées. Les cartes, dans la pièce voisine, attendent face visible."),
      A(["Valurn", "Égalité."], ["{player}", "Le seul résultat que vous n'aviez jamais obtenu."], ["Valurn", "Oui. Je pourrais m'y habituer.", "away"]),
      A("Au matin, il range le jeu de cartes dans votre tiroir et ne le reprend pas."),
    ],
    ending: ["Il part en laissant le jeu chez vous. Sur la première carte, il a écrit au crayon : « À la prochaine main. Cartes ouvertes. »"],
  },
];

function chapterLines(chapter: Chapter, mode: IntimacyMode, sex: SexKey): DialogueLine[] {
  if ("all" in chapter) return lines(chapter.all);
  if ("modes" in chapter) return lines(chapter.modes[mode]);
  if (mode === "ellipse") return lines(chapter.ellipse);
  const entry = chapter.bySex[sex as SexKey];
  return lines(mode === "explicite" ? entry.explicit : entry.soft);
}

export function valurnIntimacyContext(dateId: string | undefined, home: boolean, flags: readonly string[]): ValurnIntimacyContext | undefined {
  const key = home ? "home" : dateId;
  if (!key) return undefined;
  const flag = [...flags].reverse().find((entry) => entry.startsWith(`valurn-date-branch:${key}:`));
  if (!flag) return undefined;
  const branchId = flag.slice(flag.lastIndexOf(":") + 1);
  const prefix = home ? "home" : key === "date-valurn-forestier" ? "forestier" : key === "date-valurn-river" ? "river" : "";
  const context = `${prefix}-${branchId}` as ValurnIntimacyContext;
  return VALURN_INTIMACY_CONTEXTS.includes(context) ? context : undefined;
}

const sceneFor = (context: ValurnIntimacyContext) => SCENES.find((scene) => scene.context === context)!;
export function valurnIntimacyPhase(chapter: number): ValurnIntimacyPhase | undefined { return VALURN_INTIMACY_PHASES[chapter]; }
export function valurnIntimacyOpening(context: ValurnIntimacyContext): DialogueLine[] { return lines(sceneFor(context).opening); }
export function valurnIntimacyEnding(context: ValurnIntimacyContext): DialogueLine[] { return lines(sceneFor(context).ending); }
export function valurnIntimacyApproaches(context?: ValurnIntimacyContext): ValurnDateApproach[] | undefined {
  return context ? sceneFor(context).approaches.map(([id, text, raw]) => ({ id, text, lines: lines(raw) })) : undefined;
}
export function valurnIntimacyRoutes(context: ValurnIntimacyContext | undefined, sex: PlayerSex): IntimacyRoute[] {
  if (!context || sex === "intersexe") return [];
  const scene = sceneFor(context);
  const chapters = Object.fromEntries(MODES.map((mode) => [mode, scene.chapters.map((chapter) => chapterLines(chapter, mode, sex))])) as Record<IntimacyMode, DialogueLine[][]>;
  return [{ id: `valurn-${context}-${sex}`, text: scene.text, detail: scene.detail, chapters, visual: { revealChapter: 3, postOrgasmChapter: 9 } }];
}

/** Texte brut de toutes les scènes, pour les validateurs. */
export function valurnIntimacyCorpus(): { context: ValurnIntimacyContext; text: string }[] {
  return SCENES.map((scene) => {
    const parts: string[] = [];
    const push = (raw: RawLine[]) => raw.forEach((entry) => parts.push(typeof entry === "string" ? entry : entry[1]));
    push(scene.opening); push(scene.ending); scene.approaches.forEach(([, text, raw]) => { parts.push(text); push(raw); });
    scene.chapters.forEach((chapter) => {
      if ("all" in chapter) push(chapter.all);
      else if ("modes" in chapter) MODES.forEach((mode) => push(chapter.modes[mode]));
      else { push(chapter.ellipse); SEXES.forEach((sex) => { push(chapter.bySex[sex].soft); push(chapter.bySex[sex].explicit); }); }
    });
    return { context: scene.context, text: parts.join("\n") };
  });
}

export function validateValurnDateIntimacy() {
  let routes = 0;
  for (const context of VALURN_INTIMACY_CONTEXTS) {
    const scene = SCENES.find((entry) => entry.context === context);
    if (!scene) throw new Error(`${context}: scène intime manquante`);
    if (scene.chapters.length !== VALURN_INTIMACY_PHASES.length) throw new Error(`${context}: douze séquences requises`);
    if (scene.approaches.length < 2) throw new Error(`${context}: deux approches requises`);
    for (const sex of SEXES) for (const route of valurnIntimacyRoutes(context, sex)) {
      routes++;
      for (const mode of MODES) if (route.chapters[mode].some((chapter) => chapter.length === 0)) throw new Error(`${route.id}/${mode}: séquence vide`);
    }
  }
  return { contexts: VALURN_INTIMACY_CONTEXTS.length, routes, chapters: VALURN_INTIMACY_PHASES.length };
}

validateValurnDateIntimacy();
