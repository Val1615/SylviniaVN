import type { ChoiceData, DialogueLine, Effects, StatKey } from "./game-data";
import type { KnowledgeEntry, SecretConversation, SecretTier } from "./heritages-data";

const N = (text: string): DialogueLine => ({ speaker: "Narration", text });
const R = (text: string, mood = "calm"): DialogueLine => ({ speaker: "Remerii", text, mood });
const P = (text: string): DialogueLine => ({ speaker: "{player}", text });
const Q = (id: string, text: string, stat: StatKey, response: DialogueLine[], effects: Effects): ChoiceData => ({ id, text, stat, response, effects: { ...effects, stats: { [stat]: 1 } } });
const SECRET_SPOTS: Record<string, string[]> = {
  "secret-remerii-coat": ["miraldas-quarters", "miraldas-archives"],
  "secret-remerii-prodigy": ["miraldas-archives", "miraldas-atelier"],
  "secret-remerii-dome": ["miraldas-archives", "miraldas-quarters"],
  "secret-remerii-curse": ["miraldas-quarters", "miraldas-atelier"],
  "secret-remerii-cold": ["miraldas-atelier", "miraldas-archives"],
};
const S = (id: string, title: string, tier: SecretTier, minTrust: number, intro: DialogueLine[], choices: ChoiceData[], reveals: string[], requiresKnowledge: string[] = []): SecretConversation => ({
  id, character: "remerii", title, tier, minTrust, minDay: 1, locations: ["miraldas"], spots: SECRET_SPOTS[id], intro, choices, reveals, requiresKnowledge,
});

export const REMERII_KNOWLEDGE: KnowledgeEntry[] = [
  { id: "knows_remerii_coat", title: "Le manteau trop grand", summary: "Remerii a été trouvée très jeune dans la forêt, près d’un ruisseau, enveloppée dans un manteau trop grand. Aucun indice n’a permis de retrouver ses parents. Mir’Aldas est devenue sa famille.", people: ["remerii"] },
  { id: "knows_remerii_child_prodigy", title: "La seule humaine", summary: "À douze ans, Remerii était la seule élève humaine de l’académie. Elle disposait d’une puissance arcanique immense et intuitive. Saidin fut son maître et une figure paternelle, sans pouvoir lui éviter toutes les difficultés.", people: ["remerii", "saidin"] },
  { id: "knows_remerii_dome", title: "Le Dôme, à quatorze ans", summary: "Pendant l’attaque de Mir’Aldas, Remerii a désobéi à Saidin et contribué à l’origine du Dôme. Après l’exploit, l’admiration, la peur et la jalousie ont éloigné ses camarades.", people: ["remerii", "saidin"] },
  { id: "knows_remerii_curse", title: "La cicatrice près du cœur", summary: "Un Sylvinien mû par la haine des humains a piégé Remerii et l’a frappée d’une lame maudite sous le sein gauche. Saidin lui a sauvé la vie et contenu la malédiction. Elle reste présente et entrave sa connexion à l’Arcane.", people: ["remerii", "saidin"] },
  { id: "knows_remerii_cryo_origin", title: "La goutte d’eau", summary: "Après avoir perdu l’essentiel de sa puissance, Remerii a dû réapprendre des gestes élémentaires. Elle a étudié le froid permanent de la malédiction et construit sa propre cryomancie. Cette discipline est son travail, pas un don de l’agresseur ni une guérison.", people: ["remerii", "saidin", "hylee"] },
];

export const REMERII_CONFIDENCES: SecretConversation[] = [
  S("secret-remerii-coat", "Le manteau trop grand", 20, 12, [
    N("Remerii a décroché sa cape. Une couture de la doublure a cédé ; elle en suit le bord avec l’ongle avant de plier le vêtement sur ses genoux."),
    R("Je connais quelqu’un qui réparera cela mieux que moi. Avec moins de commentaires aussi, je l’espère."),
    P("Vous l’avez depuis longtemps ?"),
    R("Celle-ci, non. Le premier manteau dont on m’ait parlé était beaucoup trop grand pour moi."),
    N("Elle garde les yeux sur la doublure un moment, puis relève la tête."),
    R("On m’a trouvée dans la forêt, près d’un ruisseau. Très petite. J’étais enveloppée dedans. Pas de nom cousu, pas de lettre. Personne aux alentours."),
    P("Vous vous en souvenez ?"),
    R("Non. J’ai essayé de me fabriquer une image à force d’entendre le récit. Je préfère vous le dire avant de la confondre avec un souvenir."),
    R("On a cherché mes parents. Nous n’avons rien trouvé qui mène à eux."),
    N("Elle replie le bord abîmé à l’intérieur de la cape."),
    R("Mir’Aldas m’a élevée. Les gens qui m’y attendaient le soir, eux, je les ai connus."),
  ], [
    Q("rem-secret-coat-question", "Lui demander si elle souhaite encore chercher ses parents.", "lucidite", [
      P("Vous aimeriez reprendre les recherches ?"),
      R("Si un indice sérieux apparaissait, oui. Je ne vais pas promettre que cela m’est indifférent."),
      N("Elle pose sa cape à côté d’elle."),
      R("Mais je ne demande pas aux visages croisés dans la rue de devenir les leurs. J’ai longtemps regardé les gens ainsi. Cela rend les promenades épuisantes."),
      P("Je ne vous proposerai pas une piste sans raison."),
      R("Merci. Les belles hypothèses ne manquent pas. Elles ne tiennent jamais jusqu’au deuxième renseignement."),
    ], { trust: 5, affection: 2 }),
    Q("rem-secret-coat-city", "Lui demander qui elle aimait retrouver à Mir’Aldas.", "sangFroid", [
      R("Saidin, évidemment. Même quand j’avais une raison très précise de lui en vouloir."),
      P("Il s’en apercevait ?"),
      R("Pas toujours. J’étais profondément offensée quand il oubliait de remarquer mon indignation."),
      N("Son sourire revient. Elle vous raconte les portes auxquelles elle pouvait frapper et les adultes qui savaient où la chercher lorsqu’elle ne répondait pas."),
      R("Vous comprenez pourquoi je dis que je suis d’ici. Ce n’est pas une réponse par défaut."),
    ], { trust: 4, affection: 4 }),
  ], ["knows_remerii_coat"]),

  S("secret-remerii-prodigy", "La seule humaine", 40, 24, [
    N("Un groupe d’élèves passe dans le couloir, serré autour d’un ouvrage. Remerii retient la porte pour la dernière, qui marche à reculons en défendant son raisonnement."),
    R("À douze ans, je faisais exactement cela. Avec une conviction tout aussi pénible."),
    P("Vous étiez déjà à l’académie ?"),
    R("Oui. La seule humaine parmi les élèves. Je m’en apercevais davantage dans les conversations qu’en regardant les rangs."),
    N("Elle attend que les voix s’éloignent."),
    R("On était surpris de me trouver là. Certains me le faisaient sentir assez lourdement. D’autres voulaient absolument m’aider à suivre."),
    P("Vous aviez besoin d’aide ?"),
    R("Pour les mots, parfois. Pour faire venir l’Arcane, très peu. J’avais beaucoup de puissance. Elle répondait avant que je sache expliquer ce que je faisais."),
    R("Saidin me demandait de reprendre les gestes lentement. Je pensais qu’il cherchait à m’occuper."),
    N("Un bruit de feuilles renversées vous parvient du couloir. Remerii jette un regard vers la porte, puis revient à vous."),
    R("Hylee a parfois le même regard quand je lui demande d’attendre. Je le reconnais très bien. Cela ne me rend pas toujours plus patiente."),
  ], [
    Q("rem-secret-prodigy-saidin", "Lui demander ce qui parvenait à lui faire écouter Saidin.", "lucidite", [
      R("Une bonne raison. Et, certains jours, une mauvaise humeur plus tenace que la mienne."),
      P("Il gagnait ?"),
      R("Il restait. C’était déjà beaucoup. Je pouvais me montrer insupportable et le retrouver le lendemain."),
      N("Elle ramasse une feuille oubliée près de la porte et la dépose sur le comptoir."),
      R("Il m’a appris énormément. Il s’est aussi trompé. Je tiens assez à lui pour ne pas avoir besoin de vous raconter le contraire."),
    ], { trust: 6, affection: 3 }),
    Q("rem-secret-prodigy-peers", "Lui demander ce qu’elle faisait une fois les cours terminés.", "audace", [
      R("Je cherchais les autres. Croyez-vous que je passais mes soirées à polir mes résultats ?"),
      P("Vous m’avez surtout parlé des cours."),
      R("C’est juste. Je voulais participer aux mêmes jeux. Et gagner. J’avais une conception assez peu modeste des deux."),
      N("Elle sourit, puis observe le groupe qui revient chercher sa feuille."),
      R("Il y avait aussi des jours agréables. Ne retenez pas seulement les remarques les plus laides."),
    ], { trust: 5, affection: 4 }),
  ], ["knows_remerii_child_prodigy"]),

  S("secret-remerii-dome", "Après les acclamations", 60, 38, [
    N("La lumière du Dôme change derrière les fenêtres. Remerii suit son passage sur le mur ; une personne qui vient de la saluer a employé le mot « prodige ». Elle n’a pas répondu à ce mot-là."),
    P("C’était à propos du Dôme ?"),
    R("Probablement. J’avais quatorze ans pendant l’attaque de la cité."),
    R("Saidin m’avait demandé de rester à l’abri. J’ai désobéi. Je voyais ce qui arrivait et j’avais la puissance nécessaire pour intervenir."),
    N("Elle vous décrit l’effort, l’espace qu’il fallait couvrir, puis la barrière qui a tenu au-dessus de Mir’Aldas. Elle parle de ce qu’elle a fait avec une fierté sans détour."),
    R("Après, on m’a acclamée. On voulait entendre le récit, me voir recommencer quelque chose, même beaucoup plus petit."),
    P("Et à l’académie ?"),
    R("On me gardait une place devant. On s’asseyait moins souvent à côté."),
    N("Elle passe le pouce sur le bord de sa manche."),
    R("Une camarade m’a demandé si je pouvais perdre le contrôle en dormant. Elle avait l’air honteux de poser la question. Je ne savais pas comment retourner jouer avec elle après cela."),
    R("Il y avait de l’admiration, de la jalousie, et une peur qu’on prenait rarement la peine de cacher. Tout cela pouvait tenir dans le même bonjour."),
  ], [
    Q("rem-secret-dome-pride", "Lui demander ce qu’elle aurait aimé entendre de ses camarades.", "lucidite", [
      R("Mon prénom, sans qu’une question suive immédiatement. Une invitation à sortir."),
      P("Vous en avez reçu ?"),
      R("Quelques-unes. Je ne les ai pas toutes acceptées. J’avais commencé à attendre le moment où l’on parlerait de magie."),
      N("Elle se lève pour mieux voir le Dôme par la fenêtre."),
      R("Je suis fière d’avoir aidé ma cité. J’aurais simplement aimé qu’on reste assis près de moi ensuite."),
      N("Vous la rejoignez devant la vitre. Elle vous laisse la place d’où la barrière apparaît le mieux."),
    ], { trust: 8, affection: 3 }),
    Q("rem-secret-dome-listen", "L’écouter sans lui demander une démonstration ni un nouveau récit de l’exploit.", "sangFroid", [
      N("Vous restez près d’elle. Dans le couloir, les élèves s’éloignent en riant."),
      R("Vous pouvez poser une question. Je ne vais pas vous confondre avec eux pour cela."),
      P("J’en aurai peut-être une plus tard. Pour l’instant, je vous écoute."),
      N("Elle revient au souvenir d’un déjeuner, aux places laissées vides et à ce qu’elle avait emporté pour manger. Des détails qu’aucun éloge du Dôme n’avait retenus."),
      R("Je n’avais pas reparlé de cette table depuis longtemps."),
    ], { trust: 8, affection: 2 }),
  ], ["knows_remerii_dome"]),

  S("secret-remerii-curse", "Sous le sein gauche", 80, 58, [
    N("Remerii ferme la porte après le départ du dernier visiteur. Elle revient s’asseoir, sans reprendre le livre qu’elle avait posé."),
    R("Je voudrais vous expliquer quelque chose. Si je m’interromps, laissez-moi choisir si je continue."),
    P("D’accord."),
    R("Un homme m’a attirée à l’écart, à Mir’Aldas. Un Sylvinien. Il avait préparé une lame maudite."),
    N("Sa main s’immobilise sur sa cuisse. Elle ne cherche pas à vous montrer la marque."),
    R("Il m’a frappée sous le sein gauche, près du cœur. Il me haïssait parce que j’étais humaine. Mon talent ne rendait pas ma présence plus supportable à ses yeux."),
    P("Saidin vous a retrouvée ?"),
    R("Oui. Il m’a sauvée. Il a contenu ce qui me tuait, sans parvenir à le retirer."),
    N("Elle reprend sa respiration avant de poursuivre."),
    R("La malédiction attaque ma connexion à l’Arcane. J’ai perdu l’essentiel de ma puissance. La douleur revient encore. Quand je vous demande d’attendre, c’est parfois pour cela."),
    R("Vous pouvez savoir ce qui m’est arrivé sans avoir à regarder la cicatrice."),
  ], [
    Q("rem-secret-curse-help", "Lui demander ce qu’elle souhaite que vous fassiez lorsque la douleur revient.", "sangFroid", [
      R("Écoutez ce que je demande sur le moment. Une chaise, de l’eau, quelquefois de la solitude. Ne prévenez pas toute la pièce avant de m’avoir parlé."),
      P("Je peux faire cela."),
      R("Et si je ne peux pas vous répondre, cherchez de l’aide. Je ne vous demande pas de me laisser en danger pour ménager mon orgueil."),
      N("Elle se penche pour rapprocher son verre."),
      R("Vous savez maintenant. Je préférerais qu’on reste encore un peu ici avant de rouvrir la porte."),
    ], { trust: 9, affection: 3 }),
    Q("rem-secret-curse-anger", "Lui laisser parler de sa colère sans lui proposer de pardonner.", "lucidite", [
      P("Vous lui en voulez encore."),
      R("Oui. Il y a des jours où cette réponse prend toute la place."),
      N("Elle vous regarde droit dans les yeux."),
      R("Je n’ai pas de conclusion généreuse à ajouter pour que mon récit vous soit plus agréable."),
      P("Je ne vous en demande pas."),
      N("Elle desserre enfin les doigts. Vous restez assis pendant qu’elle termine ce qu’elle souhaitait dire, sans lui demander le nom de l’homme ni faire de promesse à sa place."),
    ], { trust: 10, affection: 2 }),
  ], ["knows_remerii_curse"]),

  S("secret-remerii-cold", "La goutte d’eau", 80, 72, [
    N("Remerii vous montre une ancienne page d’exercices. Le premier dessin représente une goutte au-dessus d’une soucoupe. Les dates changent ; le dessin, presque pas."),
    R("Après l’agression, je n’arrivais plus à la soulever."),
    P("Vous avez gardé toutes ces pages ?"),
    R("Celles-ci. J’en ai déchiré d’autres. J’étais furieuse contre mes mains, contre les instruments, contre Saidin quand il entrait au mauvais moment."),
    N("Elle tourne le feuillet. Les annotations deviennent plus serrées autour d’une série de relevés de froid."),
    R("La malédiction me laissait ce froid permanent. J’ai commencé à l’étudier parce qu’il était là, même lorsque le reste ne répondait pas."),
    R("J’ai essayé de le diriger, de le diviser, de lui donner une forme qui tienne. Longtemps. Ce que je pratique aujourd’hui s’est construit ainsi."),
    P("Votre cryomancie."),
    R("Oui. Je l’ai apprise et développée. Lui ne m’a rien enseigné."),
    N("Elle laisse la page ouverte entre vous."),
    R("Quand Hylee obtient quelque chose avant d’en comprendre la difficulté, je me reconnais. Parfois, cela m’émerveille. Parfois, je lui parle trop sèchement."),
    R("Elle mérite que je voie ce qu’elle est en train de faire, au lieu d’attendre mon propre accident à chaque geste."),
  ], [
    Q("rem-secret-cold-work", "Lui demander quelle réussite elle a voulu montrer en premier.", "lucidite", [
      R("Une forme minuscule. Assez stable pour que Saidin ait le temps de venir la voir."),
      P("Il est venu ?"),
      R("Oui. Je lui avais crié de se dépêcher. Il a obéi avec une sagesse admirable."),
      N("Elle rit doucement, puis pose le doigt près d’une date."),
      R("Celle-ci. Je peux encore vous dire où il s’est assis. J’ai recommencé devant lui, pour être certaine de ne pas l’avoir réussie par hasard."),
      N("Elle referme le dossier après vous avoir laissé regarder les derniers dessins."),
    ], { trust: 9, affection: 4 }),
    Q("rem-secret-cold-hylee", "Lui demander ce qu’elle aime voir lorsqu’Hylee réussit.", "sangFroid", [
      R("Sa tête quand elle se retourne. Elle cherche quelqu’un qui a vu."),
      N("Remerii sourit avant de replier le feuillet."),
      R("Je l’aime. Et je ne suis pas toujours assez habile pour le lui montrer quand j’ai peur."),
      P("Vous lui avez dit cela ?"),
      R("Nous en parlons. À deux. Je ne vous confie pas un message à lui transmettre."),
      N("Elle range elle-même le dossier, puis vous demande si vous souhaitez l’accompagner jusqu’à la porte. La conversation s’achève là, sans vous donner de rôle dans la leur."),
    ], { trust: 9, affection: 3 }),
  ], ["knows_remerii_cryo_origin"], ["knows_remerii_curse"]),
];
