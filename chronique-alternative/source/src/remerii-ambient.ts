import type { ChoiceData, DialogueLine, Effects, StatKey } from "./game-data";
import type { AmbientDialogue } from "./ambient-dialogues";

const R = (text: string, mood = "calm"): DialogueLine => ({ speaker: "Remerii", text, mood });
const N = (text: string): DialogueLine => ({ speaker: "Narration", text });
const P = (text: string): DialogueLine => ({ speaker: "{player}", text });
const Q = (id: string, text: string, stat: StatKey, response: DialogueLine[], effects: Effects): ChoiceData => ({ id, text, stat, response, effects });
const S = (id: string, title: string, prompt: string, choices: ChoiceData[], minStage = 0, mood = "calm"): AmbientDialogue => ({ id, title, prompt, choices, minStage, mood });

// Identifiants conservés : l'historique des moments libres reste utilisable.
export const REMERII_AMBIENT_LINES: AmbientDialogue[] = [
  S("remerii-lecture", "La mauvaise fin", "Remerii referme un roman en gardant un doigt entre les dernières pages. « Il lui restait trois lignes pour ne pas gâcher son livre. Il les a employées toutes les trois. »", [
    Q("rem-read-ending", "Lui demander de raconter la fin, si cela peut soulager son indignation.", "audace", [R("Vous risquez d’y perdre toute envie de le lire."), P("Vous venez déjà d’y contribuer."), N("Elle vous résume la fin avec des gestes de plus en plus vifs, puis vous tend le livre."), R("Lisez le début. Il était excellent. C’est ce qui m’agace.", "smirk")], { affection: 3 }),
    Q("rem-read-save", "Préférer découvrir le livre avant de partager son jugement.", "lucidite", [R("Très bien. Je garderai mes objections jusqu’à votre retour."), N("Elle retire son marque-page et vous indique le comptoir de prêt."), R("Ne sautez pas au dernier chapitre. Je veux savoir à quel moment vous commencerez à lui en vouloir.")], { trust: 3, affection: 1 }),
  ]),
  S("remerii-the", "Le fond de la tasse", "Remerii retient quelques feuilles de thé avec sa cuillère. « Le filtre est resté dans la cuisine. Je l’ai vu en passant et j’ai trouvé le moyen de ne pas le prendre. »", [
    Q("rem-tea-filter", "Aller demander un filtre ou une seconde tasse.", "sangFroid", [N("Vous revenez avec une passoire. Elle la tient pendant que vous versez."), R("Merci. Je vous laisse les feuilles ; j’ai déjà assez mâché ce thé."), N("Elle rapproche ensuite le plat de biscuits pour que vous puissiez vous servir.")], { trust: 3, affection: 1 }),
    Q("rem-tea-wait", "Lui proposer d’attendre que les feuilles se déposent en discutant.", "lucidite", [R("D’accord. Je m’interdirai simplement les gestes trop éloquents."), N("Elle pose la tasse et vous demande ce que vous avez fait depuis votre dernière rencontre. Au bout d’un moment, vous lui rappelez qu’elle peut boire."), R("Ah. Cette fois, il est froid.", "smirk")], { affection: 3, trust: 1 }),
  ]),
  S("remerii-erreur", "La caisse fendue", "Une caisse de matériel bloque l’atelier. Remerii vous arrête avant que vous la saisissiez : « Le fond se détache. On vide d’abord. »", [
    Q("rem-crate-empty", "Déposer le contenu sur la table pendant qu’elle tient le fond.", "sangFroid", [N("Vous sortez les instruments un à un. Remerii vous indique où poser les plus fragiles."), R("Voilà. Maintenant, nous pouvons déplacer ce magnifique déchet."), N("Elle vous aide à emporter les planches.")], { trust: 3 }),
    Q("rem-crate-label", "Lui montrer l’étiquette « solide et durable » sur le côté.", "audace", [N("Remerii lit, puis vous demande de garder l’étiquette."), R("Je vais la rapporter au vendeur. Seule. Ce sera plus facile à porter que le reste de sa promesse.", "smirk"), N("Vous videz ensemble la caisse avant de dégager la porte.")], { affection: 3, trust: 1 }),
  ]),
  S("remerii-bijoux", "Le fermoir", "Remerii tient un bracelet ouvert. « Il ferme parfaitement sur la table. À mon poignet, il découvre soudain des convictions. »", [
    Q("rem-clasp-help", "Lui proposer de tenir l’extrémité pendant qu’elle ferme le bracelet.", "sangFroid", [R("Oui, merci. Ce côté-là."), N("Vous maintenez le bout de chaîne. Elle rabat le fermoir et vérifie qu’il tient."), R("Il me plaît trop pour que je lui en veuille longtemps.")], { trust: 2, affection: 2 }),
    Q("rem-clasp-taste", "Lui demander pourquoi elle a choisi celui-ci.", "lucidite", [R("La couleur, d’abord. Regardez quand on le tourne."), N("Elle vous montre le reflet, puis range le bracelet dans sa poche."), R("Je le ferai réparer. J’aimerais autant le garder jusqu’au bout de la journée.")], { affection: 3 }),
  ], 1),
  S("remerii-medig", "Une place convoitée", "Medig occupe le dossier du fauteuil de Remerii. Lorsque celle-ci approche, la chouette déploie une aile. « Elle a parfaitement compris. Elle négocie. »", [
    Q("rem-medig-wait", "Vous installer ailleurs et laisser Remerii régler le différend.", "sangFroid", [N("Remerii présente son bras. Medig s’y pose après un temps considérable."), R("Merci de votre diligence."), N("Elle s’assied enfin ; la chouette reprend aussitôt le dossier, juste derrière sa tête.")], { trust: 3, affection: 1 }),
    Q("rem-medig-joke", "Proposer une troisième chaise pour que vous ayez tous une place.", "audace", [R("Elle choisira la vôtre. Je préfère vous prévenir."), N("Vous apportez la chaise. Medig vous regarde, puis ferme les yeux."), R("Ou elle nous laissera déplacer les meubles pour son divertissement.", "smirk")], { affection: 3 }),
  ]),
  S("remerii-ponctuation", "Un compliment douteux", "Remerii vous lit une phrase d’un courrier : « Votre intervention était moins désastreuse qu’on pouvait le craindre. » Elle relève les yeux. « J’hésite à remercier. »", [
    Q("rem-letter-answer", "Proposer : « Votre soulagement me touche. »", "audace", [R("C’est assez court pour ne pas leur laisser de prise."), N("Elle note la phrase, puis ajoute le nom du destinataire."), R("Je reconnaîtrai votre participation si l’on proteste.", "smirk")], { affection: 3, trust: 1 }),
    Q("rem-letter-nothing", "Suggérer de répondre uniquement aux renseignements utiles du courrier.", "lucidite", [N("Elle relit la page."), R("Cela nous laisse deux lignes. Ils auraient pu économiser du papier."), N("Elle rédige une réponse brève, sèche et parfaitement lisible.")], { trust: 3 }),
  ]),
  S("remerii-parapluie", "La pluie de côté", "Le vent rabat la pluie sous l’auvent. Remerii recule d’un pas et découvre que votre épaule est déjà trempée. « Nous avons choisi le mauvais bout. »", [
    Q("rem-rain-move", "Lui montrer un renfoncement sec de l’autre côté de la porte.", "lucidite", [N("Vous vous y glissez ensemble. Elle secoue doucement sa manche vers la rue."), R("Beaucoup mieux. J’aurais dû vous écouter avant d’annoncer que l’averse passait."), P("Elle passe. Sur nous."), N("Elle rit et vous fait davantage de place.")], { affection: 3, trust: 2 }),
    Q("rem-rain-umbrella", "Ouvrir votre parapluie et lui proposer de partager le chemin.", "sangFroid", [R("Oui. Plus haut, sinon mon front arrive avant nous."), N("Vous relevez la poignée. Elle se rapproche et vous indique la rue la moins exposée au vent."), R("Je vous tiens le coude dans l’escalier. Il est glissant.")], { trust: 3, affection: 1 }),
  ], 1),
  S("remerii-sablier", "Le rendez-vous en retard", "Remerii attend quelqu’un qui ne vient pas. Elle relit le billet. « Même son excuse est en retard. »", [
    Q("rem-late-company", "Lui tenir compagnie jusqu’à ce qu’elle décide de partir.", "sangFroid", [N("Elle vous demande des nouvelles, puis glisse le billet dans sa poche lorsque la cloche sonne."), R("C’est assez. Je vais déjeuner. Vous venez ?"), N("Elle laisse son nom au comptoir, sans prolonger l’attente.")], { trust: 3, affection: 2 }),
    Q("rem-late-note", "L’aider à trouver de quoi laisser un mot.", "lucidite", [N("Vous lui tendez un feuillet. Elle écrit où la personne pourra la retrouver plus tard."), P("Vous ne dites pas que vous êtes fâchée ?"), R("La brièveté suffira. Elle connaît mon écriture quand je suis aimable.", "smirk")], { affection: 2, trust: 2 }),
  ], 1),
  S("remerii-enigme", "Le livre hors d’atteinte", "Un ouvrage attend tout en haut d’une étagère. Remerii regarde l’escabeau occupé par trois pots. « Quelqu’un a confondu le rangement avec une vengeance. »", [
    Q("rem-shelf-ladder", "Déplacer les pots pour libérer l’escabeau.", "sangFroid", [N("Vous posez les pots sur une table. Remerii monte chercher son livre, puis vous en tend un second."), R("C’est celui que vous aviez demandé. Il se cachait derrière le mien."), N("Elle redescend avant de vous aider à ranger les pots ailleurs.")], { trust: 3, affection: 1 }),
    Q("rem-shelf-ask", "Aller chercher la personne qui range cette étagère.", "lucidite", [N("Une aide revient avec un crochet prévu pour les ouvrages du dernier rang."), R("Ah. J’aurais aimé connaître son existence avant l’escabeau."), N("Elle remercie l’aide et lui demande où replacer le crochet après usage.")], { trust: 3 }),
  ]),
  S("remerii-musique", "L’air qui reste", "Remerii fredonne quelques notes, puis s’arrête en vous voyant. « Je ne retrouve pas la suite. Ne me dites pas que vous l’avez entendu : cela ne m’aiderait que si vous la connaissez. »", [
    Q("rem-tune-listen", "Lui demander de reprendre le début pour essayer de reconnaître l’air.", "lucidite", [N("Elle recommence, plus bas. Vous ne reconnaissez rien et le lui dites."), R("Au moins, vous ne m’en avez pas inventé une autre."), N("Elle sourit et abandonne pour l’instant, sans vous demander de chanter.")], { trust: 2, affection: 2 }),
    Q("rem-tune-improvise", "Proposer une suite volontairement absurde en la chantonnant.", "audace", [N("Elle vous écoute jusqu’au bout avec les sourcils levés."), R("Maintenant, c’est celle-ci que je vais garder dans la tête. Vous me le paierez.", "smirk"), N("Quelques pas plus loin, elle reprend malgré elle vos dernières notes.")], { affection: 3 }),
  ], 2),
  S("remerii-fatigue", "Le mot oublié", "Remerii s’arrête au milieu d’une phrase. « Le petit objet avec lequel on… Je le connais. Ne souriez pas. »", [
    Q("rem-word-help", "Lui demander de décrire l’objet.", "lucidite", [R("On s’en sert pour retirer les agrafes des dossiers."), P("Un ôte-agrafes ?"), N("Elle ferme les yeux une seconde."), R("Je vous remercie. Oubliez le temps qu’il m’a fallu.", "smirk")], { affection: 3 }),
    Q("rem-word-wait", "Lui laisser le temps de retrouver le mot.", "sangFroid", [N("Vous reprenez la page qu’elle vous montrait. Le mot lui revient quelques instants plus tard, à voix beaucoup trop haute."), R("Pardon. Il avait pris toute la place."), N("Elle achève enfin sa phrase.")], { trust: 3 }),
  ], 2),
  S("remerii-tendresse", "Une place près de la fenêtre", "Remerii retire son sac d’une chaise lorsque vous approchez. « Je l’ai gardée. On y voit mieux que près de la porte. »", [
    Q("rem-seat-thanks", "Vous asseoir et la remercier d’avoir pensé à vous.", "sangFroid", [R("Vous vous plaignez de la pénombre à chaque fois. J’ai fini par m’en souvenir."), N("Elle pousse la lampe vers le milieu de la table et reprend sa conversation avec vous.")], { affection: 3, trust: 2 }),
    Q("rem-seat-reciprocity", "Lui proposer de garder une place à votre tour lors de votre prochaine rencontre.", "audace", [R("Une chaise qui ne boite pas. Je ne suis pas excessivement exigeante."), N("Elle vous observe sourire."), R("Pour une chaise, du moins.", "smirk")], { affection: 3, trust: 1 }),
  ], 3),
  S("remerii-question-franche", "Un avis demandé", "Remerii hésite entre deux foulards. « Lequel ? Si vous répondez “les deux”, je vous renvoie au comptoir. »", [
    Q("rem-scarf-blue", "Choisir le bleu et lui dire ce qui vous plaît dans cette couleur.", "lucidite", [N("Elle le pose sur son épaule et regarde le reflet dans la vitre."), R("Oui. Je pense aussi."), N("Elle paie son achat sans vous faire deviner une autre réponse.")], { affection: 3 }),
    Q("rem-scarf-other", "Préférer l’autre, même si elle semblait attirée par le bleu.", "audace", [R("Vraiment ? Montrez."), N("Vous lui tendez le foulard. Elle l’essaie, hésite, puis reprend le bleu."), R("Je garde mon premier choix. Merci d’avoir répondu franchement.")], { trust: 3, affection: 1 }),
  ], 2),
  S("remerii-rature", "Une tache d’encre", "Une tache traverse l’adresse que Remerii vient d’écrire. Elle retourne le papier : « Il me reste un côté pour prétendre que je sais tenir une plume. »", [
    Q("rem-ink-paper", "Lui tendre une feuille propre.", "sangFroid", [R("Merci. Gardez celle-ci pour les brouillons."), N("Elle recopie lentement l’adresse, puis vous rend la plume essuyée."), R("Cette version devrait au moins arriver chez la bonne personne.")], { trust: 3 }),
    Q("rem-ink-joke", "Lui demander si la tache fait partie de sa signature.", "audace", [R("Uniquement pour mes correspondants les plus estimés. Elle m’a demandé des années d’entraînement.", "smirk"), N("Elle vous tend le papier avant de rire de son propre sérieux."), R("Allez, donnez-moi plutôt quelque chose pour essuyer cela.")], { affection: 3 }),
  ], 1),
  S("remerii-cinq-minutes", "Le chemin le plus long", "Au croisement, Remerii vous indique deux rues. « Celle-ci est plus courte. L’autre nous laisse encore un peu de chemin ensemble. »", [
    Q("rem-way-long", "Choisir la promenade la plus longue.", "audace", [N("Elle se met en marche à côté de vous, sans presser le pas."), R("Vous ne m’avez pas encore raconté la fin."), P("De quoi ?"), R("Choisissez. Nous avons une rue entière.", "smirk")], { affection: 4, trust: 1 }),
    Q("rem-way-short", "Prendre la rue courte et proposer de la revoir bientôt.", "sangFroid", [R("D’accord. Écrivez-moi quand vous saurez."), N("Elle vous accompagne jusqu’à votre embranchement et attend que vous ayez trouvé votre direction pour reprendre la sienne.")], { trust: 3, affection: 1 }),
  ], 4),
];
