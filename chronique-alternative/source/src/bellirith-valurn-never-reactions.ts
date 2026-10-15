import type { DialogueLine } from "./game-data";
import type { BVAnswer, BVNpc, BVTheme } from "./bellirith-valurn-never-game";

/**
 * Répliques de table du « Je n’ai jamais » : ce que vous dites en jouant votre affirmation
 * ou en répondant, puis la façon dont Bellirith et Valurn le reçoivent.
 * Aucune ligne ne revient deux fois dans une même soirée (le moteur consomme chaque réplique).
 * Bellirith ne s’allume que lorsque vous lui tenez tête ou la battez ; quand vous cédez, elle s’ennuie.
 * Rien ici ne touche au secret de Valurn : les révélations restent dans leurs moments dédiés.
 */

const B = (text: string, mood = "teasing"): DialogueLine => ({ speaker: "Bellirith", text, mood });
const V = (text: string, mood = "charming"): DialogueLine => ({ speaker: "Valurn", text, mood });
const P = (text: string): DialogueLine => ({ speaker: "{player}", text });

/* ------------------------------------------------------------------------ */
/* Vous lancez une affirmation                                               */
/* ------------------------------------------------------------------------ */

export const BV_PLAYER_LEADS: Record<"bellirith" | "valurn" | "none" | "generic", DialogueLine[]> = {
  bellirith: [
    P("Bellirith, pose ta bague. Celle-là, il faut l’écouter les mains libres."),
    P("Je la gardais depuis le deuxième tour. Elle a ton nom brodé dessus."),
    P("Regarde-moi pendant que tu décides. C’est tout ce que je demande."),
    P("Tu m’as appris à viser bas. Voyons si l’élève a écouté."),
    P("Ta pique de tout à l’heure, je te la rends. Avec les intérêts."),
    P("Ne cherche pas Valurn des yeux. Il a déjà choisi son camp, et c’est le mien."),
    P("Celle-ci, je l’ai polie pendant que tu riais de Valurn."),
    P("On dit que tu ne bois jamais deux fois de suite. On va vérifier."),
    P("Lève ton verre ou mens-moi joliment. J’accepte les deux."),
    P("Je m’adresse à la plus dangereuse de nous trois. Oui, toi. Ne fais pas l’innocente."),
    P("Tu voulais quelqu’un qui ne baisse pas les yeux ? Écoute."),
    P("Pour toi, avec mes compliments. Et sans filet."),
  ],
  valurn: [
    P("Valurn, garde tes gants. Ils ne t’aideront pas sur celle-là."),
    P("Une phrase sans clause cachée. Je sais que ça te change."),
    P("Réponds par un verre, pas par une question. Pour une fois."),
    P("Celle-ci ne se revend pas au marché. Désolé."),
    P("Range ton sourire de négociateur. On ne marchande pas ce tour-ci."),
    P("J’ai trouvé ta faille en t’écoutant parler du port. Attention."),
    P("Je te devais celle-là depuis l’histoire des pièces comptées par la tranche."),
    P("Le piano ne témoignera pas pour toi, Valurn. J’ai demandé."),
    P("Si tu bois avec ton air de ministre offensé, je gagne double."),
    P("Celle-là sent l’encre et la cire à cacheter. Tu vas la reconnaître."),
    P("Allez, Valurn. Une vérité nue, sans emballage ni facture."),
    P("Je vise l’homme qui a réponse à tout. Trouve-m’en une courte."),
  ],
  none: [
    P("Personne en particulier. On verra bien qui rougit."),
    P("Une pour la table entière. Que les verres décident."),
    P("Je la lance comme une pièce dans une fontaine. Advienne que pourra."),
    P("Rien de personnel. Presque rien."),
    P("Celle-ci a l’air innocente. Méfiez-vous des choses qui ont l’air innocentes."),
    P("Pas de cible. Juste une question posée au feu."),
    P("Je la dis pour moi autant que pour vous deux."),
    P("Un tour de répit, en apparence."),
    P("Ceux qui l’ont fait boivent. Les autres regardent et prennent des notes."),
    P("Changeons d’air. Une affirmation pour les trois verres à la fois."),
    P("Quelqu’un ici a quelque chose à cacher. Peut-être moi."),
    P("Elle m’est venue en regardant le lustre. Le lustre n’y est pour rien."),
  ],
  generic: [
    P("Mon tour. Personne ne triche sur la hauteur de son verre."),
    P("J’en ai une. Préparez vos excuses."),
    P("Inutile de faire durer le suspense."),
    P("Silence à la table. Je joue."),
    P("Celle-là m’est venue en vous écoutant vous chamailler."),
    P("J’essaie quelque chose. Si ça rate, on boit quand même."),
    P("Vous allez l’adorer, ou me haïr. Les deux me conviennent."),
    P("Asseyez-vous droit, j’ai la parole."),
    P("Écoutez bien. Ensuite, honnêteté, pour changer."),
    P("Je garde mon verre à la main, par précaution."),
  ],
};

/** Moments de bascule (affirmation pivot, dernier sujet) : ton grave, une seule fois par soirée. */
export const BV_PLAYER_LEADS_SOLEMN: DialogueLine[] = [
  P("Je vais dire une chose que personne ici n’a envie d’entendre."),
  P("Assez joué en surface. Celle-ci, je la pense."),
  P("Je pose mon verre avant de parler. Vous allez comprendre."),
  P("Mieux vaut que ce soit moi qui le dise plutôt que le silence."),
  P("Écoutez-moi jusqu’au bout, tous les deux. Après, faites ce que vous voudrez."),
  P("Une seule fois. Je ne la rejouerai pas."),
];

/* ------------------------------------------------------------------------ */
/* Ils réagissent à votre affirmation                                        */
/* ------------------------------------------------------------------------ */

export type BVReactionKey = "target-drank" | "target-dry" | "bystander-drank" | "bystander-dry";

/** Réactions de sujet : elles parlent de ce que l’affirmation touche (rire, liens, affaires, confiance, coup de théâtre, sincérité). */
export const BV_THEME_REACTIONS: Record<BVNpc, Record<BVTheme, DialogueLine[]>> = {
  bellirith: {
    humour: [
      B("Faire rire pour endormir ma garde. Ça marche une minute, pas deux.", "smirk"),
      B("Drôle. Je te le ferai payer plus tard, avec la même légèreté.", "amused"),
      B("Une blague à ma table. Les derniers qui ont essayé chantent encore faux dans les couloirs.", "teasing"),
      B("Ris si tu veux. Moi, je regarde où tu poses les yeux quand tu ris.", "seductive"),
      B("Le sens du ridicule. C’est rare chez les mortels, et presque attendrissant.", "amused"),
    ],
    relations: [
      B("Tu parles de cœurs à une table pareille. Courageux, ou distrait.", "thoughtful"),
      B("Les liens, encore. Tu tiens un registre des amants de la cour ?", "smirk"),
      B("Qui aime qui, qui ment à qui. Tu viens de décrire ma famille sans le savoir.", "thoughtful"),
      B("Les lettres d’amour, je les brûle avant de les lire. Gain de temps.", "teasing"),
      B("On ne m’a jamais attendue à une fenêtre. On m’a guettée, nuance.", "smirk"),
    ],
    marches: [
      B("Une affaire de comptoir. Valurn s’est redressé d’un coup, regarde-le.", "teasing"),
      B("Tu joues sur son terrain. Il va croire que tu l’as fait exprès pour lui plaire.", "smirk"),
      B("L’argent, toujours l’argent. Moi je préfère les dettes. Elles durent plus longtemps.", "seductive"),
      B("Je n’ai jamais marchandé de ma vie. On me donne, ou je prends.", "smirk"),
      B("Des prix, des balances, des pièces. Tu sens le marché à plein nez ce soir.", "teasing"),
    ],
    confiance: [
      B("La confiance, à cette heure, après tant de verres. Tu aimes le vertige.", "thoughtful"),
      B("Tu demandes de l’honnêteté à une démone. J’admire l’optimisme.", "teasing"),
      B("Promettre, tenir. Deux verbes qui ne s’entendent jamais à cette table.", "cold"),
      B("Tu crois qu’on garde un secret par loyauté ? Par paresse, surtout.", "smirk"),
      B("Une question de parole donnée. Valurn vient de se gratter la gorge, tu as vu ?", "teasing"),
    ],
    surprise: [
      B("Je ne l’ai pas vue venir. Fais attention, ça me donne envie de te surveiller.", "seductive"),
      B("D’où sors-tu celle-là ? Ne réponds pas. Garde ton mystère, il te va bien.", "amused"),
      B("Un coup de théâtre. J’aurais applaudi si je n’étais pas aussi vexée.", "annoyed"),
      B("Tu changes de jeu en pleine partie. J’adore qu’on triche avec élégance.", "seductive"),
      B("Personne ne me surprend deux fois. Tu viens de gâcher ta première fois.", "smirk"),
    ],
    libre: [
      B("Simple, nette. Tu progresses.", "smirk"),
      B("Tu joues sans filet. Ça finit toujours par tomber sur quelqu’un.", "teasing"),
      B("Aucune ruse là-dedans. Je cherche quand même, par principe.", "thoughtful"),
      B("Une phrase toute nue. Elle a froid, la pauvre.", "amused"),
      B("Tu as dit ça comme on pose une carte face visible. Je respecte, de loin.", "smirk"),
    ],
  },
  valurn: {
    humour: [
      V("Un trait d’esprit honnête. Je le range parmi mes rares bons souvenirs de jeu.", "amused"),
      V("Vous visez le rire, et le rire touche. Méthode éprouvée.", "amused"),
      V("Bellirith rit. Notez l’heure, ça servira aux historiens.", "amused"),
      V("Drôle, et pas cruel. On ne m’avait pas prévenu que c’était possible ici.", "charming"),
      V("Je souris. Ne le répétez pas à mes créanciers.", "amused"),
    ],
    relations: [
      V("Les questions de cœur se paient plus cher que celles d’argent.", "thoughtful"),
      V("Vous fouillez les attaches des gens. Je reconnais le métier.", "charming"),
      V("J’ai vu des alliances se défaire pour moins qu’une lettre mal pliée.", "thoughtful"),
      V("Les sentiments, c’est le seul marché où je refuse de spéculer.", "away"),
      V("Qui attend qui. La moitié des intrigues du palais tient dans cette phrase.", "charming"),
    ],
    marches: [
      V("Une affirmation de marchand. Je l’aurais vendue plus cher.", "charming"),
      V("Prix et réputations. Je me sens chez moi, pas forcément en sécurité.", "amused"),
      V("Vous parlez de balance comme quelqu’un qui a vu une balance truquée. Je ne pose pas de question.", "thoughtful"),
      V("Ah, le port. J’y ai perdu une cargaison et gagné un ennemi. Bonne journée, au total.", "amused"),
      V("Vous comptez en marchand. Bellirith compte en reine. Ce n’est pas la même arithmétique.", "charming"),
    ],
    confiance: [
      V("La confiance, encore. Vous tenez à ce que je boive par principe.", "thoughtful"),
      V("Croire quelqu’un à voix haute. Exercice rare, chez moi.", "away"),
      V("Une parole donnée. J’en ai encore quelques-unes en stock, en bon état.", "charming"),
      V("Je tiens mes promesses. C’est de les faire que je me garde.", "thoughtful"),
      V("Vous marchez sur un plancher qui craque. Avancez doucement.", "away"),
    ],
    surprise: [
      V("Celle-là manquait à mes prévisions. Bravo, sincèrement.", "amused"),
      V("Vous gardez des cartes que je n’ai pas comptées. Inquiétant et charmant.", "charming"),
      V("Je n’avais pas prévu ce coup. Je déteste ne pas avoir prévu.", "annoyed"),
      V("Joli renversement. Je vais devoir refaire tous mes calculs.", "thoughtful"),
      V("Bellirith a cligné des yeux. Vous venez de réussir quelque chose de rare.", "amused"),
    ],
    libre: [
      V("Sans calcul apparent. Ce sont toujours les plus dangereuses.", "thoughtful"),
      V("Une phrase propre. On n’en entend presque plus dans ce palais.", "charming"),
      V("Pas de double fond. J’ai vérifié deux fois, par habitude.", "amused"),
      V("C’est d’une franchise presque impolie. J’aime beaucoup.", "charming"),
      V("Vous dites les choses comme elles sont. Ma famille va se méfier de vous.", "amused"),
    ],
  },
};

export const BV_STATEMENT_REACTIONS: Record<BVNpc, Record<BVReactionKey, DialogueLine[]>> = {
  bellirith: {
    "target-drank": [
      B("Touché. Recommence, pour voir si c’était de la chance.", "seductive"),
      B("Tu as osé, et tu as eu raison. Ne t’y habitue pas.", "smirk"),
      B("Tu prends goût à me faire boire. Moi aussi, à te regarder faire.", "seductive"),
      B("D’habitude, c’est moi qui pousse les autres au verre. Continue, j’apprends.", "seductive"),
      B("Bien visé. Je déteste perdre, et je déteste encore plus le montrer. Tant pis.", "annoyed"),
      B("Tu m’as battue à mon propre jeu. Je retiens ton visage.", "seductive"),
    ],
    "target-dry": [
      B("Tu m’as visée et tu as touché le vide. C’est attendrissant.", "teasing"),
      B("Tu croyais me connaître ? Pas encore.", "smirk"),
      B("Joli tir, mauvaise cible. Mon verre reste plein, et mon sourire aussi.", "teasing"),
      B("Vise ce que je cache, la prochaine fois. Pas ce que je montre.", "smirk"),
      B("Des aventures que je n’ai même pas eu le temps d’avoir. Tu me flattes.", "amused"),
      B("Sous-estimée ou surestimée, je ne sais pas. Sèche, en tout cas.", "teasing"),
    ],
    "bystander-drank": [
      B("Ce n’était pas pour moi, et je trinque quand même. Tu tires large.", "amused"),
      B("Une gorgée volée en passant. Ne t’en vante pas, tu ne visais pas là.", "smirk"),
      B("Un verre pris au voisinage. J’accepte, et je m’en souviendrai.", "teasing"),
      B("Tu visais Valurn et c’est moi qui bois. Charmant hasard.", "amused"),
      B("Sans honte. Avec un peu de nostalgie, peut-être.", "thoughtful"),
      B("Même de biais, tu trouves le chemin de mon verre. Agaçant talent.", "seductive"),
    ],
    "bystander-dry": [
      B("Je regarde les autres se tortiller. Meilleur siège de la salle.", "teasing"),
      B("Mon verre reste sage. Pour une fois, il ne ment pas.", "smirk"),
      B("Rien pour moi. Mon innocence commençait à me manquer.", "amused"),
      B("Spectatrice ce tour-ci. La vue me plaît.", "teasing"),
      B("Épargnée, et un peu vexée de l’être. Donne-moi mieux, la prochaine fois.", "annoyed"),
      B("Je ne te remercie pas de m’épargner. Ce serait t’encourager.", "smirk"),
    ],
  },
  valurn: {
    "target-drank": [
      V("Vous avez lu juste, et je n’aime pas qu’on lise juste.", "annoyed"),
      V("Accordé. Ça m’a coûté un verre et un peu de prestige.", "amused"),
      V("Aucun argument. Seulement un verre plus léger.", "thoughtful"),
      V("Vous avez trouvé la faille. J’en ai d’autres, rassurez-vous.", "charming"),
      V("Pas de plaidoirie. Prenez ça comme un compliment, il est rare.", "amused"),
      V("Vous auriez fait un excellent courtier. Dans ma bouche, c’est presque une insulte.", "amused"),
    ],
    "target-dry": [
      V("Vous m’avez prêté un passé plus intéressant que le mien.", "amused"),
      V("Pas une goutte. Révisez vos sources.", "charming"),
      V("Manqué, avec élégance. C’est déjà mieux que la plupart.", "charming"),
      V("Je reste sec, vous restez curieux. Chacun y gagne.", "amused"),
      V("Mauvaise rumeur. Je vous dirai un jour qui l’a vendue, et à quel prix.", "thoughtful"),
      V("Je suis plus ennuyeux qu’on ne le raconte. Désolé de le confirmer.", "away"),
    ],
    "bystander-drank": [
      V("On ne m’avait pas prévenu que c’était contagieux.", "amused"),
      V("Ça ne m’était pas destiné, et pourtant. Le hasard a du goût.", "charming"),
      V("Un verre collatéral. Je le passe en frais généraux.", "amused"),
      V("Discrètement, oui. Ne me regardez pas comme ça.", "away"),
      V("Même de profil, vous touchez. Je change de chaise au prochain tour.", "amused"),
      V("Je l’ai fait, oui. L’histoire est meilleure sans moi, je n’ajoute rien.", "thoughtful"),
    ],
    "bystander-dry": [
      V("Je profite du spectacle avec une gratitude de propriétaire.", "charming"),
      V("Sec, rare et précieux, comme une bonne affaire.", "amused"),
      V("J’ai mené une vie plus sage que prévu, apparemment.", "amused"),
      V("Aucun commentaire de ma part. Ou presque.", "charming"),
      V("Mon verre se repose. Il l’a mérité.", "away"),
      V("Exempté. Je garde mes forces pour vos prochaines attaques.", "charming"),
    ],
  },
};

export const BV_STATEMENT_GENERIC: Record<BVNpc, DialogueLine[]> = {
  bellirith: [
    B("Note qui a hésité avant de lever son verre. Moi, je note.", "smirk"),
    B("Tu deviens redoutable à cette table. Je ne sais pas encore si ça m’arrange.", "thoughtful"),
    B("Encore une comme ça et je vais devoir te prendre au sérieux.", "teasing"),
    B("Le feu crépite. Il approuve, je crois.", "amused"),
    B("Les verres mentent moins que les visages. C’est pour ça que je les regarde.", "thoughtful"),
    B("Ta voix descend d’un ton quand tu joues. J’ai remarqué.", "seductive"),
    B("On en est où, au juste ? Peu importe. Le score, c’est pour les comptables.", "teasing"),
    B("Valurn fait semblant de ne pas compter. Il compte tout.", "smirk"),
  ],
  valurn: [
    V("Quel sens du tempo. Rare chez un joueur de passage.", "charming"),
    V("Je tiens les comptes de tête. Ne me les demandez pas, je mentirais.", "amused"),
    V("Belle tournure. Je la volerai un soir au salon.", "charming"),
    V("La carafe baisse plus vite que prévu. Mauvais présage pour nos secrets.", "amused"),
    V("Un pas de côté, puis l’attaque. Vous jouez comme on négocie.", "thoughtful"),
    V("Bellirith fait semblant de s’ennuyer. Elle ne s’ennuie jamais quand on la défie.", "amused"),
    V("On ne sait jamais quand une phrase devient monnaie. Je garde celle-là.", "charming"),
    V("Écoutez ce piano grincer. Il voudrait jouer aussi.", "away"),
  ],
};

/** Après les révélations : la table est plus douce, les piques aussi. */
export const BV_STATEMENT_FALLOUT: Record<BVNpc, DialogueLine[]> = {
  bellirith: [
    B("Après ce qu’on s’est dit, celle-là a presque un goût de tendresse.", "thoughtful"),
    B("Tu joues doucement, maintenant. Ne crois pas que ça m’échappe.", "thoughtful"),
    B("Boire ou pas, quelle importance. La soirée a déjà payé.", "away"),
    B("Ta question a la voix basse des fins de nuit. Elle me va.", "seductive"),
  ],
  valurn: [
    V("Plus léger, enfin. On en avait besoin.", "thoughtful"),
    V("Vous laissez la table respirer. Merci, sans ironie.", "away"),
    V("À cette heure, chaque verre ressemble à une confidence.", "thoughtful"),
    V("Je réponds sans calcul, pour une fois. C’est reposant.", "amused"),
  ],
};

/** Réactions aux moments de bascule, une seule fois par soirée. */
export const BV_STATEMENT_SOLEMN: Record<BVNpc, DialogueLine[]> = {
  bellirith: [
    B("Tu as choisi le moment exact où je ne pouvais plus rire. Bien joué, et je t’en veux.", "cold"),
    B("Personne ne parle comme ça à ma table. Toi, si. Je retiens.", "thoughtful"),
    B("Tu viens d’ouvrir une porte. Ne fais pas semblant d’ignorer ce qu’il y a derrière.", "cold"),
  ],
  valurn: [
    V("Vous avez attendu le bon moment. Je déteste que ce soit le bon.", "away"),
    V("Pas de réplique toute prête. Laissez-moi une seconde.", "thoughtful"),
    V("Une phrase qu’on ne rattrape pas. Je l’accepte quand même.", "away"),
  ],
};

/* ------------------------------------------------------------------------ */
/* Vous répondez : reconnaître, nier, esquiver                               */
/* Quand la question a ses propres réponses (bellirith-valurn-never-topics),  */
/* celles-ci passent avant ces banques.                                       */
/* ------------------------------------------------------------------------ */

export const BV_PLAYER_ANSWERS: Record<BVAnswer, DialogueLine[]> = {
  acknowledge: [
    P("Oui. Et je ne m’en excuse pas."),
    P("Coupable. Remplissez, que je fasse ça proprement."),
    P("D’accord, c’est vrai. Ne prenez pas cet air victorieux."),
    P("Je l’ai fait. Je le referais peut-être."),
    P("Bien vu. À ta perspicacité."),
    P("Ça se lit sur mon visage, de toute façon."),
    P("Une fois. Et c’était une excellente idée sur le moment."),
    P("Vrai. L’histoire, en revanche, vous ne l’aurez pas ce soir."),
    P("C’est arrivé. Ni fierté ni regret."),
    P("Plutôt boire que mentir à cette table-là."),
    P("Oui. Et je sens que tu vas t’en servir contre moi."),
    P("Je reconnais. Profitez-en, ça n’arrivera pas tous les tours."),
    P("Voilà, c’est dit. Passons à la suite."),
    P("J’avoue. Mes raisons, je les garde."),
    P("À la santé de qui m’a deviné."),
  ],
  deny: [
    P("Jamais. Regarde-moi aussi longtemps que tu veux."),
    P("Faux. Mon verre reste où il est."),
    P("Tu confonds avec quelqu’un d’autre."),
    P("Non, et je soutiens ton regard en le disant."),
    P("Cherche ailleurs. Je ne suis pas ta proie ce soir."),
    P("Jolie tentative. Elle tombe à côté."),
    P("Si tu as une preuve, sors-la maintenant."),
    P("Jamais fait. Pardon de te décevoir. Enfin, presque."),
    P("Plein, et il le restera. Suivant."),
    P("Tu voulais une réponse honnête ? La voilà : non."),
    P("Je ne compte pas commencer pour te faire plaisir."),
    P("Faux départ. Repose ta question à quelqu’un d’autre."),
    P("Tu me connais moins bien que tu ne le crois."),
    P("Ce verre ne me revient pas."),
    P("Rien à me reprocher sur ce point-là. Sur d’autres, peut-être."),
  ],
  dodge: [
    P("Joker. Ce souvenir-là attendra une autre soirée."),
    P("Question suivante."),
    P("Je souris, je ne bois pas, je ne dis rien. Débrouillez-vous avec ça."),
    P("Tu aimerais bien le savoir. Justement."),
    P("Je passe. Les règles l’autorisent, j’ai vérifié."),
    P("Ça dépend de la définition. Mon verre reste plein."),
    P("Je laisse la question flotter. Elle est jolie, là-haut."),
    P("Pas ce soir. Peut-être quand tu m’auras rendu un service."),
    P("Ma réponse coûte plus cher qu’un verre."),
    P("Tu poses la question, je pose mon verre. Égalité."),
    P("Je change de sujet avec toute la grâce dont je suis capable."),
    P("Il faut bien garder un mystère pour plus tard."),
    P("Je ne confirme ni ne dénie. J’ai appris ça de Valurn."),
    P("Ah, le feu baisse. Quelqu’un devrait s’en occuper."),
    P("Sous clé, celle-là. Insiste, et je jette la clé."),
  ],
};

export type BVAnswerRole = "asker" | "other";

export const BV_ANSWER_REACTIONS: Record<BVNpc, Record<BVAnswerRole, Record<BVAnswer, DialogueLine[]>>> = {
  bellirith: {
    asker: {
      acknowledge: [
        B("Évidemment. Un coup de coude et tu bois. Un peu trop facile.", "away"),
        B("Je voulais une chasse, j’ai eu une reddition.", "annoyed"),
        B("Bonne réponse, mauvaise manière. Tu aurais pu me faire travailler.", "smirk"),
        B("Docile. Reposant, et ça ne m’apprend rien.", "away"),
        B("Je le savais. Tu me le confirmes sans la moindre résistance. Dommage.", "teasing"),
      ],
      deny: [
        B("Tu me regardes en face pour me dire non. Ça, j’aime.", "seductive"),
        B("Me contredire à ma propre table. Continue, j’écoute de plus près.", "seductive"),
        B("Mensonge ou pas, tu ne recules pas. Intéressant.", "smirk"),
        B("Tu tiens bon. Je garde la question pour plus tard, et toi avec.", "seductive"),
        B("Personne ne me dit non avec ce calme. Je vais finir par y prendre goût.", "seductive"),
      ],
      dodge: [
        B("Tu te dérobes avec style. Je te poursuivrai avec plus de style encore.", "smirk"),
        B("Tu sais que je déteste les portes fermées, alors tu en fermes une.", "seductive"),
        B("Tu me laisses sur ma faim, et tu le fais exprès.", "seductive"),
        B("Tu joues au mystère avec moi ? Quelle témérité.", "teasing"),
        B("Ne crois pas avoir gagné. Tu as seulement repoussé le moment.", "smirk"),
      ],
    },
    other: {
      acknowledge: [
        B("Il a gagné celle-là. Tu aurais dû me demander conseil avant de répondre.", "teasing"),
        B("Plus prompt à avouer à Valurn qu’à moi. Je note la préférence.", "annoyed"),
        B("Bois, bois. Il adore qu’on lui donne raison.", "smirk"),
        B("Trop honnête avec lui. Garde un peu de ça pour moi.", "teasing"),
        B("Celle-là, je la range dans mes archives personnelles.", "amused"),
      ],
      deny: [
        B("Tu lui tiens tête. Bien. Il en a besoin plus souvent.", "smirk"),
        B("Un non à Valurn, en face. Je savais que tu me plairais.", "seductive"),
        B("Regarde-le, il déteste qu’on lui refuse quelque chose. Délicieux.", "amused"),
        B("Ne le crois pas, Valurn. Ou crois-le. Ça m’amuse dans les deux cas.", "teasing"),
        B("Joli refus. Je n’aurais pas fait mieux, et je fais toujours mieux.", "smirk"),
      ],
      dodge: [
        B("Esquivé comme on esquive un créancier. Il connaît la sensation.", "amused"),
        B("Il va passer la nuit à chercher la réponse. Merci pour ce cadeau.", "teasing"),
        B("Pas de verre, pas de réponse. Tu apprends vite avec lui.", "smirk"),
        B("Une énigme pour Valurn. Il adore ça, il ne l’avouera jamais.", "amused"),
        B("Esquive propre. Je t’accorde le point, pas plus.", "teasing"),
      ],
    },
  },
  valurn: {
    asker: {
      acknowledge: [
        V("Merci. Une réponse franche vaut une bonne bouteille.", "charming"),
        V("Sans plaider. J’apprécie la clarté du contrat.", "amused"),
        V("Je m’en doutais. Le plaisir, c’est d’avoir raison sans insister.", "charming"),
        V("Voilà qui simplifie mes dossiers. Santé.", "amused"),
        V("Honnête et rapide. En affaires, vous seriez une catastrophe, et c’est un compliment.", "amused"),
      ],
      deny: [
        V("Je reverrai mes sources. Elles me coûtent pourtant cher.", "thoughtful"),
        V("Je ne saurai jamais si c’est vrai. Très bien joué.", "charming"),
        V("Mon informateur va m’entendre. Ou alors vous mentez à merveille.", "amused"),
        V("Refus enregistré. Je n’insiste pas, j’ai des manières.", "charming"),
        V("Droit dans les yeux. Ça se respecte, même au marché.", "thoughtful"),
      ],
      dodge: [
        V("La réponse la plus chère de toutes, vous le savez.", "amused"),
        V("Vous gardez des réserves. J’apprécie ça chez un adversaire.", "charming"),
        V("Ni oui ni non. Vous avez pris des leçons quelque part.", "amused"),
        V("Je reviendrai par une autre porte, plus tard.", "charming"),
        V("Silence stratégique. C’est presque mon style, je devrais porter plainte.", "amused"),
      ],
    },
    other: {
      acknowledge: [
        V("Vous lui donnez ce qu’elle veut. Prudence, elle en redemande toujours.", "thoughtful"),
        V("Avouer à Bellirith, c’est signer sans lire. Quel courage.", "amused"),
        V("Elle vous laissera tranquille trois minutes. Quatre, avec de la chance.", "amused"),
        V("Un aveu pour elle. Je garde ce détail dans un coin de ma tête.", "charming"),
        V("Une réponse franche à une question piège. Vous me surprenez encore.", "charming"),
      ],
      deny: [
        V("Un non en face. Je prends des notes, elle déteste ça.", "amused"),
        V("Regardez-la. Elle vient de trouver quelqu’un d’intéressant.", "charming"),
        V("Un refus net à Bellirith. On en voit un par saison, en général.", "amused"),
        V("Elle va vous le faire payer, et elle va aimer ça.", "thoughtful"),
        V("Bravo. Je n’aurais pas osé sur ce ton-là.", "amused"),
      ],
      dodge: [
        V("Esquiver Bellirith. Vous jouez avec le feu, et le feu sourit.", "amused"),
        V("Belle dérobade. Elle va la ruminer jusqu’à l’aube.", "charming"),
        V("Une question ouverte. Elle déteste ça, donc elle va s’y attacher.", "thoughtful"),
        V("Elle compte, vous savez. Chaque verre que vous ne buvez pas.", "amused"),
        V("Habile. Je vous offrirais un poste, si j’avais encore des postes à offrir.", "charming"),
      ],
    },
  },
};

export const BV_ANSWER_GENERIC: Record<BVNpc, DialogueLine[]> = {
  bellirith: [
    B("La table retient tout. Moi aussi.", "smirk"),
    B("Ton silence entre deux mots en disait plus que ta réponse.", "thoughtful"),
    B("Tu as hésité d’un battement. Je l’ai entendu.", "seductive"),
    B("Réponse notée. Les intérêts courent.", "teasing"),
    B("Aucun commentaire. Je savoure.", "amused"),
    B("Passons, avant que je m’attache à cette question.", "away"),
    B("Ta main a tremblé sur le verre. Ou c’était la lumière.", "teasing"),
    B("On en reparlera quand Valurn ne sera pas là pour écouter.", "seductive"),
    B("Je ferai semblant d’avoir oublié. Je n’oublie jamais.", "smirk"),
    B("Pas assez pour me surprendre. Pas mal, quand même.", "teasing"),
  ],
  valurn: [
    V("La manière compte plus que la réponse. Je retiens les deux.", "charming"),
    V("Votre voix a pris une demi-note de plus. Je ne dis rien.", "amused"),
    V("Intéressant. Je range ça avec les choses qui ne se vendent pas.", "thoughtful"),
    V("La carafe en a vu d’autres. Moi aussi, mais moins souvent.", "amused"),
    V("Belle réponse. Je l’aurais formulée avec plus de clauses.", "charming"),
    V("Le jeu est long, la nuit aussi. Je laisse passer.", "away"),
    V("Vous jouez juste. C’est presque suspect.", "amused"),
    V("Personne n’avait encore répondu ainsi devant moi.", "thoughtful"),
    V("Je note, je souris, je me tais. Mon meilleur numéro.", "charming"),
    V("Une réponse comme celle-là mérite un silence respectueux. Voilà.", "away"),
  ],
};

/* ------------------------------------------------------------------------ */
/* Ivresse : variantes « gris » et « ivre » de chaque banque                 */
/* Plus de rires, de gestes, de franchise et de phrasé relâché, sans jamais   */
/* sortir du caractère ni forcer qui que ce soit.                             */
/* ------------------------------------------------------------------------ */

export type BVIvresse = "sobre" | "gris" | "ivre";
export type BVTiers = { gris: DialogueLine[]; ivre: DialogueLine[] };
const T = (gris: DialogueLine[], ivre: DialogueLine[]): BVTiers => ({ gris, ivre });

export const BV_PLAYER_LEADS_T: Record<"bellirith" | "valurn" | "none" | "generic", BVTiers> = {
  bellirith: T(
    [P("Bellirith, celle-là est pour toi. Arrête de rire avant que j’aie fini, c’est contagieux."), P("Je te vise, toi et ton sourire en coin. Si, il est en coin, je le vois d’ici.")],
    [P("Bellirith. Bellirith ! Écoute. Elle est pour toi, et elle est très, très bonne."), P("Ma reine des cornes. Pardon. Je retire les cornes. Non, je les garde, elles te vont.")],
  ),
  valurn: T(
    [P("Mon cher marchand, tes gants ne te sauveront pas. J’ai bu juste assez pour voir clair."), P("Pour toi, Valurn. Je la trouve brillante, mais je suis d’humeur généreuse.")],
    [P("Valurn ! Je t’aime bien, tu sais ? Ça ne change rien. Tu vas boire quand même."), P("Le grand négociateur. Attends, j’avais une phrase. Elle était là. Voilà, je l’ai.")],
  ),
  none: T(
    [P("Une pour tout le monde. J’ai l’impression que je vais me piéger moi-même."), P("Elle vise la table. Ou le lustre. Le lustre a sûrement des choses à se reprocher.")],
    [P("Tout le monde ! Le piano aussi. Surtout le piano, il a une tête à secrets."), P("Personne n’est visé. Enfin si. Un peu. Vous verrez bien, hein.")],
  ),
  generic: T(
    [P("À moi. Je tiens encore droit sur ma chaise, la partie s’annonce bien."), P("Je l’avais préparée, j’ai oublié la fin en route. Ah, la voilà.")],
    [P("Mon tour. Si, si. J’ai compté sur mes doigts, deux fois."), P("Elle est géniale. Je ris avant de la dire, c’est normal, attendez.")],
  ),
};
export const BV_PLAYER_LEADS_SOLEMN_T: BVTiers = T(
  [P("Je pose le verre. J’ai assez bu pour être honnête, pas assez pour oublier.")],
  [P("Attendez. Je suis ivre, mais ça, je le pense depuis le début de la soirée.")],
);

export const BV_THEME_REACTIONS_T: Record<BVNpc, Record<BVTheme, BVTiers>> = {
  bellirith: {
    humour: T([B("Je ris. Ne le répète à personne, ça ruinerait ma réputation.", "amused")], [B("Ha ! Arrête. J’ai renversé du vin sur mon propre talon. Encore une !", "amused")]),
    relations: T([B("Les cœurs, encore. Le vin me rend presque indulgente sur le sujet.", "thoughtful")], [B("J’en ai un aussi, de cœur. Petit. Bien caché. Ne le cherche pas. Ou cherche-le.", "thoughtful")]),
    marches: T([B("Une histoire de comptoir. Regarde, je bâille avec élégance.", "teasing")], [B("Le marché, le marché… Valurn, achète-moi un autre verre. Avec tes sous de marché.", "amused")]),
    confiance: T([B("Me faire confiance après ce que j’ai bu ? Audacieux, et un peu fou.", "thoughtful")], [B("Ce soir, je te prête la mienne, de confiance. Tu me la rends demain. Intacte.", "thoughtful")]),
    surprise: T([B("Oh, celle-là ! Je la note quelque part. Sur ma main, tiens.", "amused")], [B("Pas vue venir. Je ne vois plus grand-chose venir, remarque. Le lustre tourne.", "amused")]),
    libre: T([B("Simple et efficace. Comme moi, avant le troisième verre.", "smirk")], [B("Bien dit. Très bien dit. Redis-le, plus lentement, que je l’entende avec les oreilles.", "seductive")]),
  },
  valurn: {
    humour: T([V("Je ris, et je ne le facture même pas. Le vin me rend prodigue.", "amused")], [V("C’est drôle. C’est vraiment drôle. Pourquoi c’est si drôle ? Ne m’expliquez pas.", "amused")]),
    relations: T([V("Les affaires de cœur passent mieux après quelques verres. Curieux phénomène.", "thoughtful")], [V("Les cœurs. J’en ai connu un ou deux. Le mien, parfois, de loin.", "away")]),
    marches: T([V("Une affaire ! Je fais une offre. Non, je la retire. Si, je la maintiens.", "amused")], [V("Combien ? Je paie. Je paie tout. Notez que demain, je ne paierai rien du tout.", "amused")]),
    confiance: T([V("Ma confiance ? Ce soir, elle est en solde. Profitez-en.", "charming")], [V("Je vous fais confiance. Voilà. J’ai trop bu pour revenir dessus, c’est signé.", "away")]),
    surprise: T([V("Pas prévue, celle-là. Mes prévisions titubent un peu.", "amused")], [V("Ah ! Vous m’avez eu. Encore. Je crois que j’adore être eu, finalement.", "amused")]),
    libre: T([V("Phrase nette. La mienne commence à friser, vous remarquerez.", "amused")], [V("Belle phrase. Je vais la répéter. Belle phrase. Voilà, c’est fait.", "amused")]),
  },
};

export const BV_STATEMENT_REACTIONS_T: Record<BVNpc, Record<BVReactionKey, BVTiers>> = {
  bellirith: {
    "target-drank": T(
      [B("Encore moi ? Tu le fais exprès. Continue, ça en devient charmant.", "seductive"), B("Quel œil, ce soir. Un œil insolent. Je bois à ton œil.", "smirk")],
      [B("Tu m’as eue ! Encore ! Je devrais être furieuse et je ris. Explique-moi ça.", "amused"), B("Viens que je te félicite. Non, reste là. Félicitations de loin, c’est plus prudent.", "seductive")],
    ),
    "target-dry": T(
      [B("Raté ! Et je me moque de toi, gentiment. Un peu.", "amused"), B("Trop de vices pour moi. Enfin, pas celui-là. Les autres, garde-les.", "teasing")],
      [B("Innocente ! Regarde ce visage. Innocent. Presque. Un peu.", "amused"), B("Pas une goutte, ha. Enfin, une seule. Pour la forme.", "amused")],
    ),
    "bystander-drank": T(
      [B("Je bois en passant, et je repose le verre trop fort. Pardon, la table.", "amused"), B("Pas visée, et je bois. Le destin me trouve jolie, ce soir.", "seductive")],
      [B("Moi aussi ! Ne me demandez pas quand. C’était une très bonne nuit. Je crois.", "amused"), B("Pour le principe. Et pour le goût. Surtout pour le goût, en fait.", "amused")],
    ),
    "bystander-dry": T(
      [B("Pas moi. J’en profite pour admirer vos grimaces, elles sont superbes.", "teasing"), B("Je regarde, je ris, je garde mon verre. Le meilleur rôle.", "amused")],
      [B("Rien pour moi. Mais je bois quand même ? Non ? Bon. Je repose.", "amused"), B("J’applaudis. Lentement. Très lentement. Encore plus lentement.", "amused")],
    ),
  },
  valurn: {
    "target-drank": T(
      [V("Je bois, et je ris, ce qui est nouveau pour moi à cette table.", "amused"), V("Encore eu. Je commence à vous admirer, c’est fâcheux.", "charming")],
      [V("Accordé ! Tout accordé ! Je signe ce que vous voulez. Non, rien. Je bois, c’est tout.", "amused"), V("Vous lisez en moi comme dans un livre. Un livre mal relié, avec des taches.", "amused")],
    ),
    "target-dry": T(
      [V("Manqué, mais avec panache. Je lève mon verre vide à votre panache.", "amused"), V("Presque déçu de ma propre sagesse, tiens.", "amused")],
      [V("Jamais ! Enfin, je crois. Je vérifierai demain, dans mes carnets.", "amused"), V("Sec. C’est bien la seule chose sèche autour de moi, ce soir.", "amused")],
    ),
    "bystander-drank": T(
      [V("Me voilà inclus par le vin. Je ne discute pas avec lui.", "amused"), V("Moi aussi. Ne demandez pas de détails, ils sont flous.", "charming")],
      [V("J’aime bien boire avec vous. Je le dis, c’est dit, on n’y revient pas.", "amused"), V("Collatéral, encore ! Je suis une victime ravie.", "amused")],
    ),
    "bystander-dry": T(
      [V("Pas moi. J’en profite pour remplir le verre de quelqu’un d’autre.", "charming"), V("Verre plein, et je fredonne. Ignorez le fredonnement.", "amused")],
      [V("Un exemple pour la jeunesse. Un exemple légèrement penché.", "amused"), V("Le piano et moi, on attend notre tour. Il est patient. Moi moins.", "amused")],
    ),
  },
};

export const BV_STATEMENT_GENERIC_T: Record<BVNpc, BVTiers> = {
  bellirith: T(
    [B("Tu as les joues roses. Ou c’est le feu. Je préfère que ce soit moi.", "seductive"), B("Je compte les verres sur mes doigts. Il m’en manque un.", "amused")],
    [B("Je t’aime bien quand tu joues. C’est le vin qui le dit. Moi, je n’ai rien dit.", "seductive"), B("Le lustre tourne. Ou la table. Peu importe. Continue.", "amused")],
  ),
  valurn: T(
    [V("Je desserre mon col. Ne le prenez pas pour une capitulation.", "amused"), V("Vous jouez bien. Je l’aurais dit plus sobrement il y a trois verres.", "charming")],
    [V("Vous êtes la meilleure chose qui soit arrivée à cette carafe. Je le pense.", "amused"), V("J’ai perdu le compte. Moi. Le compte. Ha.", "amused")],
  ),
};
export const BV_STATEMENT_FALLOUT_T: Record<BVNpc, BVTiers> = {
  bellirith: T([B("Après tout ça, le vin a un goût de trêve. Je ne déteste pas.", "thoughtful")], [B("On s’est tout dit, et je ris quand même. Tu vois ce que tu me fais faire ?", "amused")]),
  valurn: T([V("Le vin et la vérité font bon ménage, finalement. Qui l’eût cru.", "thoughtful")], [V("Je suis content. Ivre et content. Notez la date, elle ne reviendra pas.", "amused")]),
};
export const BV_STATEMENT_SOLEMN_T: Record<BVNpc, BVTiers> = {
  bellirith: T([B("Le vin m’empêche de faire semblant. Tu as choisi ton moment, je t’en veux.", "cold")], [B("Trop ivre pour mentir, alors je me tais. C’est pire, je sais.", "thoughtful")]),
  valurn: T([V("Je voudrais une réplique brillante. Le vin ne me laisse qu’une vraie.", "away")], [V("Attendez. Je dégrise d’un coup. C’est très désagréable.", "away")]),
};

export const BV_PLAYER_ANSWERS_T: Record<BVAnswer, BVTiers> = {
  acknowledge: T(
    [P("Oui, oui, je l’ai fait. Je ris en le disant, c’est mauvais signe."), P("Coupable ! Et c’est beaucoup plus drôle qu’il y a une heure.")],
    [P("Oui. Bien sûr que oui. Deux fois. Non, une. Je bois pour les deux."), P("J’avoue tout. Enfin, ça. Seulement ça. Remplissez.")],
  ),
  deny: T(
    [P("Non ! Et je le dis en te regardant, même si tu tangues un peu."), P("Jamais. Sur ce point-là, je suis encore sobre.")],
    [P("Non. Non non. Jamais. Je jure sur la carafe."), P("Archi-faux ! Tiens, regarde, je pose le verre. Loin. Très loin.")],
  ),
  dodge: T(
    [P("Je souris très mystérieusement. Ça se voit, que c’est mystérieux ?"), P("Joker ! Le vin me rend joueur, pas bavard.")],
    [P("Je… non. Je garde ça. Pour moi. Et pour le lustre, il sait tout."), P("Question suivante ! J’ai oublié celle-ci, de toute façon.")],
  ),
};

export const BV_ANSWER_REACTIONS_T: Record<BVNpc, Record<BVAnswerRole, Record<BVAnswer, BVTiers>>> = {
  bellirith: {
    asker: {
      acknowledge: T([B("Un aveu en riant. Mignon, et ça ne m’apprend toujours rien.", "away")], [B("Tu avoues tout, ce soir. Facile. Trop facile. Je bâille. Non, je ris.", "amused")]),
      deny: T([B("Un non avec du vin dans la voix. Ça me plaît encore plus.", "seductive")], [B("Non ? À moi ? Viens me le redire plus près. Ou pas. Comme tu veux.", "seductive")]),
      dodge: T([B("Tu te dérobes en titubant. Je te rattraperai, j’ai le pied plus sûr.", "smirk")], [B("Tu fuis ! Je te suivrais bien, mais la table a bougé.", "amused")]),
    },
    other: {
      acknowledge: T([B("Tout avouer à Valurn. Le vin te rend prodigue avec les mauvaises personnes.", "teasing")], [B("Tu lui dis oui, à lui ? Traîtrise adorable.", "amused")]),
      deny: T([B("Tenir tête à Valurn, avec ce vin dans les veines. J’applaudirais si mes mains m’obéissaient.", "smirk")], [B("Un non à Valurn ! Ha ! Regarde sa tête. Regarde-la, vite, avant qu’il se recoiffe.", "amused")]),
      dodge: T([B("Esquive avinée, mais esquive. Je valide.", "teasing")], [B("Tu l’as semé ! Il cherche encore la réponse sous la table.", "amused")]),
    },
  },
  valurn: {
    asker: {
      acknowledge: T([V("Franchise et vin rouge, mon duo préféré de la soirée.", "amused")], [V("Vous avouez ! Je vous aime bien. Je l’ai déjà dit ? Je le redis.", "amused")]),
      deny: T([V("Je n’ai plus la tête à vérifier. Bien joué.", "amused")], [V("Bon. Je vous crois. Je crois tout le monde, ce soir. C’est grave, docteur ?", "amused")]),
      dodge: T([V("J’en prends note, d’une écriture qui penche.", "amused")], [V("Filé entre mes doigts ! Je ferais pareil. Je fais pareil depuis vingt ans.", "amused")]),
    },
    other: {
      acknowledge: T([V("Elle sourit. Méfiez-vous du sourire, même flou.", "thoughtful")], [V("Elle a gagné. Elle gagne toujours. À sa santé, et à la vôtre. Surtout la vôtre.", "amused")]),
      deny: T([V("Non à Bellirith, avec ce qu’on a bu. Je retiens votre aplomb.", "amused")], [V("Vous lui dites non ! Je ris. Pardon, Bellirith. Non, pas pardon.", "amused")]),
      dodge: T([V("Vous lui glissez entre les doigts. Joli, après tant de verres.", "charming")], [V("Elle vous cherche, et plus personne ! Je vous cache. Derrière le piano.", "amused")]),
    },
  },
};

export const BV_ANSWER_GENERIC_T: Record<BVNpc, BVTiers> = {
  bellirith: T([B("Ta voix traîne un peu sur les fins de phrase. Ça te va bien.", "seductive"), B("Je retiens tout, même éméchée. Surtout éméchée.", "smirk")], [B("Demain, je ne me souviendrai de rien. Si. De toi, si.", "seductive"), B("Ha. Je ris, et je ne sais même plus pourquoi. Bon signe.", "amused")]),
  valurn: T([V("Vos réponses s’arrondissent avec le vin. Les miennes aussi.", "charming"), V("Je note, mais l’encre de ma mémoire coule un peu.", "amused")], [V("Excellente réponse. Je ne l’ai pas entendue, mais je l’approuve.", "amused"), V("D’accord avec vous. Avec tout. Avec la table aussi.", "amused")]),
};
