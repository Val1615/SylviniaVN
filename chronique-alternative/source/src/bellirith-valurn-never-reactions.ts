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
    P("Celle-là porte ton nom, Bellirith. Lève ton verre ou mens avec talent."),
    P("Je vise la reine de la table. Ne fais pas semblant d’être surprise."),
    P("Bellirith, regarde-moi pendant que tu décides de boire."),
    P("Tu m’as appris à frapper où ça compte. Je prends des notes, tu vois."),
    P("Je te rends la monnaie de ta dernière pique, avec les intérêts."),
    P("Celle-ci, je l’ai gardée exprès pour toi depuis le début de la soirée."),
    P("Tu souris déjà. Mauvais signe pour ton verre."),
    P("Je parie que tu vas boire en prétendant que c’est par soif."),
    P("Ne cherche pas Valurn des yeux, il ne te sauvera pas sur celle-là."),
    P("À toi de jouer, Bellirith. Et pas de tour de passe-passe avec la carafe."),
    P("Je m’adresse à la plus dangereuse de nous trois. Elle se reconnaîtra."),
    P("Tu voulais quelqu’un qui n’a pas peur de toi ? Voilà."),
  ],
  valurn: [
    P("Valurn, celle-ci est pour toi. Garde tes gants, ils ne cacheront rien."),
    P("Je vise l’homme qui a toujours une explication. Trouve-m’en une courte."),
    P("Valurn, fais-moi le plaisir de ne pas répondre par une autre question."),
    P("Celle-ci, tu ne pourras pas la revendre au marché demain matin."),
    P("Je connais ton sourire de négociateur. Range-le, on joue."),
    P("À toi, Valurn. Un verre vaut mieux qu’un long discours."),
    P("Je te dois bien celle-là depuis ta dernière manœuvre."),
    P("Valurn, ne regarde pas le piano. Il ne témoignera pas pour toi."),
    P("Je parie un dernier verre que tu vas boire en prenant l’air d’un ministre."),
    P("Celle-ci a l’odeur de tes affaires. Tu vas la reconnaître."),
    P("Allez, Valurn. Une fois dans la soirée, dis la vérité sans emballage."),
    P("Je t’offre une affirmation sans clause cachée. Profites-en."),
  ],
  none: [
    P("Celle-ci ne vise personne. On verra bien qui se sent visé."),
    P("Une pour la table entière. Que les verres parlent."),
    P("Je lance celle-là au hasard, comme une pièce dans une fontaine."),
    P("Rien de personnel. Enfin, presque rien."),
    P("Je joue une affirmation honnête. Profitez-en, ça ne durera pas."),
    P("Écoutez bien, celle-ci est plus traîtresse qu’elle n’en a l’air."),
    P("Pas de cible ce tour-ci. Juste une question posée au feu."),
    P("Celle-ci, je la dis pour moi autant que pour vous."),
    P("Un tour de répit pour tout le monde. Du moins, en apparence."),
    P("Faisons simple. Ceux qui l’ont fait boivent, les autres regardent."),
    P("Je change d’humeur. Une affirmation pour les trois verres à la fois."),
    P("Voyons qui avait quelque chose à cacher dans cette pièce."),
  ],
  generic: [
    P("Mon tour. Personne ne triche sur la hauteur de son verre."),
    P("J’en ai une. Préparez vos excuses."),
    P("Je ne vais pas faire durer le suspense plus que nécessaire."),
    P("Silence, la table. Je joue."),
    P("Celle-là m’est venue en vous écoutant tous les deux."),
    P("J’essaie quelque chose. Si ça rate, on boit quand même."),
    P("Vous allez adorer celle-ci. Ou me détester. Les deux me vont."),
    P("Tenez-vous droits, je prends la parole."),
    P("Écoutez. Ensuite, soyez honnêtes, pour changer."),
    P("Je garde mon verre à la main, au cas où."),
  ],
};

/** Moments de bascule (affirmation pivot, dernier sujet) : ton grave, une seule fois par soirée. */
export const BV_PLAYER_LEADS_SOLEMN: DialogueLine[] = [
  P("Je vais dire quelque chose que personne ici n’a envie d’entendre."),
  P("Assez joué en surface. Celle-ci, je la pense vraiment."),
  P("Je pose mon verre avant de parler. Vous comprendrez pourquoi."),
  P("Je préfère que ce soit moi qui le dise plutôt que le silence."),
  P("Écoutez-moi jusqu’au bout, tous les deux. Après, faites ce que vous voudrez."),
  P("Je joue cette carte une fois. Je ne la rejouerai pas."),
];

/* ------------------------------------------------------------------------ */
/* Ils réagissent à votre affirmation                                        */
/* ------------------------------------------------------------------------ */

export type BVReactionKey = "target-drank" | "target-dry" | "bystander-drank" | "bystander-dry";

export const BV_THEME_REACTIONS: Record<BVNpc, Record<BVTheme, DialogueLine[]>> = {
  bellirith: {
    humour: [B("Tu crois que me faire rire te protège ? Ça m’adoucit d’une minute, guère plus.", "smirk"), B("Drôle. Je te le ferai payer plus tard, avec la même légèreté.", "amused")],
    relations: [B("Tu parles de cœurs à une table pareille. Courageux, ou distrait.", "thoughtful"), B("Les liens, toujours les liens. Tu tiens un registre, ou tu devines ?", "smirk")],
    marches: [B("Encore une affaire de comptoir. Valurn va se sentir chez lui.", "teasing"), B("Tu joues sur son terrain à lui. Intéressant choix d’allié.", "smirk")],
    confiance: [B("La confiance, à cette heure-ci, après trois verres. Tu aimes vivre dangereusement.", "thoughtful"), B("Tu demandes de l’honnêteté à une démone. J’admire l’optimisme.", "teasing")],
    surprise: [B("Je ne l’ai pas vue venir. Fais attention, ça me donne envie de te surveiller.", "seductive"), B("Où as-tu trouvé celle-là ? Ne réponds pas, garde ton mystère.", "amused")],
    libre: [B("Simple, nette, sans détour. Tu progresses.", "smirk"), B("J’aime quand tu joues sans filet. Ça finit toujours par tomber sur quelqu’un.", "teasing")],
  },
  valurn: {
    humour: [V("Un trait d’esprit honnête. Je le note dans mes rares bons souvenirs de jeu.", "amused"), V("Vous visez le rire, et le rire touche. Méthode efficace.", "amused")],
    relations: [V("Les questions de cœur se paient plus cher que celles d’argent, vous savez.", "thoughtful"), V("Vous fouillez les attaches des gens. Je reconnais le métier.", "charming")],
    marches: [V("Une affirmation de marchand. Je l’aurais vendue plus cher.", "charming"), V("Vous parlez prix et réputations. Je me sens chez moi, et pas forcément en sécurité.", "amused")],
    confiance: [V("La confiance, encore. Vous tenez à ce que je boive par principe.", "thoughtful"), V("Vous me demandez de croire quelqu’un à voix haute. Exercice rare.", "away")],
    surprise: [V("Celle-là, je ne l’avais pas dans mes prévisions. Bravo, sincèrement.", "amused"), V("Vous gardez des cartes que je n’ai pas comptées. Inquiétant et charmant.", "charming")],
    libre: [V("Sans calcul apparent. Ce sont toujours les plus dangereuses.", "thoughtful"), V("Une phrase propre. On n’en entend presque plus dans ce palais.", "charming")],
  },
};

export const BV_STATEMENT_REACTIONS: Record<BVNpc, Record<BVReactionKey, DialogueLine[]>> = {
  bellirith: {
    "target-drank": [
      B("Touché. Tu m’as eue, et je bois sans me plaindre. Recommence pour voir.", "seductive"),
      B("Tu as osé, et tu as eu raison. Ne t’habitue pas à ce que ça marche.", "smirk"),
      B("Je bois. Tu as gagné ce tour, et tu as l’air d’y prendre goût. Moi aussi.", "seductive"),
      B("Personne ne me pousse au verre comme ça d’habitude. Continue, ça me plaît.", "seductive"),
      B("Bien visé. Je déteste perdre, et je déteste encore plus le montrer. Tant pis.", "annoyed"),
      B("Tu viens de me battre à mon propre jeu. Je retiens ton visage.", "seductive"),
    ],
    "target-dry": [
      B("Raté. Tu m’as visée et tu as touché le vide. Mignon.", "teasing"),
      B("Je ne bois pas. Tu croyais me connaître, hein ? Pas encore.", "smirk"),
      B("Joli tir, mauvaise cible. Je garde mon verre plein et mon sourire.", "teasing"),
      B("Essaie encore. La prochaine fois, vise ce que je cache, pas ce que je montre.", "smirk"),
      B("Rien. Tu me prêtes des aventures que je n’ai même pas eu le temps d’avoir.", "amused"),
      B("Tu m’as sous-estimée, ou surestimée. Dans les deux cas, je ne bois pas.", "teasing"),
    ],
    "bystander-drank": [
      B("Ce n’était même pas pour moi, et je bois quand même. Tu tires large.", "amused"),
      B("Je bois en passant. Ne t’en vante pas, ce n’était pas ton but.", "smirk"),
      B("Un verre volé au voisinage. J’accepte, mais je m’en souviendrai.", "teasing"),
      B("Tu visais quelqu’un d’autre et c’est moi qui trinque. Charmant hasard.", "amused"),
      B("Je bois, oui. Sans honte. Avec un peu de nostalgie, peut-être.", "thoughtful"),
      B("Même de côté, tu trouves le chemin de mon verre. Agaçant talent.", "seductive"),
    ],
    "bystander-dry": [
      B("Pas moi. Je regarde les autres se tortiller, c’est le meilleur siège.", "teasing"),
      B("Mon verre reste sage. Pour une fois, ce n’est pas un mensonge.", "smirk"),
      B("Rien pour moi. Je commençais à m’ennuyer de mon innocence.", "amused"),
      B("Je passe ce tour en spectatrice. J’aime bien la vue.", "teasing"),
      B("Je ne bois pas, et ça m’ennuie un peu. Donne-moi mieux la prochaine fois.", "annoyed"),
      B("Épargnée. Je ne te remercierai pas, ce serait t’encourager.", "smirk"),
    ],
  },
  valurn: {
    "target-drank": [
      V("Je bois. Vous avez lu juste, et je n’aime pas qu’on lise juste.", "annoyed"),
      V("Accordé. Vous m’avez coûté un verre et un peu de prestige.", "amused"),
      V("Bien joué. Je n’ai pas d’argument, seulement un verre plus léger.", "thoughtful"),
      V("Vous avez trouvé la faille. J’en ai d’autres, rassurez-vous.", "charming"),
      V("Je bois sans plaider. Prenez ça comme un compliment, il est rare.", "amused"),
      V("Touché. Vous auriez fait un excellent courtier, c’est presque une insulte.", "amused"),
    ],
    "target-dry": [
      V("Non. Vous m’avez prêté un passé plus intéressant que le mien.", "amused"),
      V("Pas une goutte. Je vous laisse réviser vos sources.", "charming"),
      V("Raté avec élégance. C’est déjà mieux que la plupart des gens.", "charming"),
      V("Je reste sec, et vous restez curieux. Tout le monde y gagne.", "amused"),
      V("Mauvaise rumeur. Je vous dirai un jour qui l’a vendue.", "thoughtful"),
      V("Mon verre ne bouge pas. Je suis plus ennuyeux qu’on le raconte.", "away"),
    ],
    "bystander-drank": [
      V("Je bois en simple passant. On ne m’avait pas prévenu que c’était contagieux.", "amused"),
      V("Ce n’était pas pour moi, et pourtant. Le hasard a bon goût.", "charming"),
      V("Un verre collatéral. Je le note dans les frais généraux.", "amused"),
      V("Je bois, discrètement. Ne me regardez pas comme ça.", "away"),
      V("Même de profil, vous touchez. Je change de chaise au prochain tour.", "amused"),
      V("Je l’ai fait, oui. Je n’ajouterai rien, l’histoire est meilleure sans moi.", "thoughtful"),
    ],
    "bystander-dry": [
      V("Pas moi. Je profite du spectacle avec une gratitude de propriétaire.", "charming"),
      V("Je reste sec. Rare et précieux, comme une bonne affaire.", "amused"),
      V("Rien pour moi. Je commence à croire que j’ai mené une vie sage.", "amused"),
      V("Je ne bois pas, et je ne ferai aucun commentaire. Ou presque.", "charming"),
      V("Mon verre se repose. Il le mérite.", "away"),
      V("Exempté ce tour. Je garde mes forces pour vos prochaines attaques.", "charming"),
    ],
  },
};

export const BV_STATEMENT_GENERIC: Record<BVNpc, DialogueLine[]> = {
  bellirith: [
    B("Note bien qui a hésité avant de lever son verre. Moi, je note.", "smirk"),
    B("Tu deviens dangereux à cette table. Je ne sais pas encore si ça m’arrange.", "thoughtful"),
    B("Continue comme ça et je vais devoir te prendre au sérieux.", "teasing"),
    B("Le feu crépite. Il approuve, je crois.", "amused"),
    B("J’aime regarder les verres plus que les visages. Ils mentent moins.", "thoughtful"),
    B("Ta voix change quand tu joues. Plus basse. J’ai remarqué.", "seductive"),
    B("On en est où, déjà ? Peu importe. Le compte, c’est pour les comptables.", "teasing"),
    B("Valurn fait semblant de ne pas compter. Il compte tout.", "smirk"),
  ],
  valurn: [
    V("Vous avez le sens du tempo. Rare chez un joueur de passage.", "charming"),
    V("Je tiens les comptes de tête. Ne me demandez pas, je mentirais.", "amused"),
    V("Belle tournure. Je la volerai un soir au salon.", "charming"),
    V("La carafe baisse plus vite que prévu. Mauvais présage pour nos secrets.", "amused"),
    V("Vous jouez comme on négocie : un pas de côté, puis l’attaque.", "thoughtful"),
    V("Bellirith fait semblant de s’ennuyer. Elle ne s’ennuie jamais quand on la défie.", "amused"),
    V("Je retiens celle-là. On ne sait jamais quand une phrase devient monnaie.", "charming"),
    V("Le piano grince dans son coin. Il voudrait jouer aussi.", "away"),
  ],
};

/** Après les révélations : la table est plus douce, les piques aussi. */
export const BV_STATEMENT_FALLOUT: Record<BVNpc, DialogueLine[]> = {
  bellirith: [
    B("Après ce qu’on s’est dit, celle-là a presque un goût de tendresse.", "thoughtful"),
    B("Tu joues doucement maintenant. Ne crois pas que je ne le vois pas.", "thoughtful"),
    B("Je bois ou pas, quelle importance. La soirée a déjà payé.", "away"),
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
    B("Tu viens d’ouvrir une porte. Ne fais pas semblant d’être surpris de ce qu’il y a derrière.", "cold"),
  ],
  valurn: [
    V("Vous avez attendu le bon moment. Je déteste que ce soit le bon.", "away"),
    V("Je n’ai pas de réplique toute prête. Laissez-moi une seconde.", "thoughtful"),
    V("Voilà une phrase qu’on ne rattrape pas. Je l’accepte quand même.", "away"),
  ],
};

/* ------------------------------------------------------------------------ */
/* Vous répondez : reconnaître, nier, esquiver                               */
/* ------------------------------------------------------------------------ */

export const BV_PLAYER_ANSWERS: Record<BVAnswer, DialogueLine[]> = {
  acknowledge: [
    P("Oui. Je bois, et je ne m’en excuse pas."),
    P("Coupable. Remplissez, que je fasse ça proprement."),
    P("D’accord, c’est vrai. Ne prenez pas cet air victorieux."),
    P("Je l’ai fait. Je le referais peut-être, d’ailleurs."),
    P("Bien vu. Je lève mon verre à ta perspicacité."),
    P("Inutile de nier, ça se lit sur mon visage. Je bois."),
    P("Oui, une fois. Et c’était une bonne idée sur le moment."),
    P("Je bois. L’histoire, vous ne l’aurez pas ce soir."),
    P("C’est arrivé. Je n’en suis ni fier ni désolé."),
    P("Touché. Je préfère boire que mentir à cette table-là."),
    P("Oui. Et je sens que tu vas t’en servir contre moi."),
    P("Je reconnais. Prenez note, ça n’arrivera pas tous les tours."),
    P("C’est vrai. Voilà, c’est dit, on peut passer à la suite."),
    P("J’avoue. Mais j’avais d’excellentes raisons, que je garde."),
    P("Oui. Je bois à la santé de celle ou celui qui m’a percé à jour."),
  ],
  deny: [
    P("Non. Jamais. Tu peux me regarder aussi longtemps que tu veux."),
    P("Faux. Mon verre reste où il est."),
    P("Tu confonds avec quelqu’un d’autre. Je ne bois pas."),
    P("Non, et je soutiens ton regard en le disant."),
    P("Pas moi. Cherche ailleurs, je ne suis pas ta proie ce soir."),
    P("Jolie tentative. Elle tombe à côté."),
    P("Non. Et si tu as une preuve, sors-la maintenant."),
    P("Jamais fait. Désolé de te décevoir, ou pas."),
    P("Mon verre est plein et il le restera. Suivant."),
    P("Non. Tu voulais une réponse honnête ? La voilà."),
    P("Je n’ai jamais fait ça, et je ne compte pas commencer pour te faire plaisir."),
    P("Faux départ. Repose ta question à quelqu’un d’autre."),
    P("Non. Tu me connais moins bien que tu ne le crois."),
    P("Je refuse ce verre. Il ne me revient pas."),
    P("Pas une goutte. Je n’ai rien à me reprocher sur ce point-là."),
  ],
  dodge: [
    P("Joker. Je garde ce souvenir-là pour une autre soirée."),
    P("Question suivante. Celle-ci ne mérite pas ma réponse."),
    P("Je souris, je ne bois pas, et je ne dis rien. Débrouillez-vous avec ça."),
    P("Tu aimerais bien le savoir, hein ? Justement."),
    P("Je passe. Les règles l’autorisent, je l’ai vérifié."),
    P("Disons que la réponse dépend de la définition. Je ne bois pas."),
    P("Je laisse la question flotter au-dessus de la table. Elle est jolie là-haut."),
    P("Pas ce soir. Peut-être quand tu m’auras rendu un service."),
    P("Je réserve ma réponse. Elle coûte plus cher qu’un verre."),
    P("Tu poses la question, je pose mon verre. Égalité."),
    P("Je change de sujet avec toute la grâce dont je suis capable."),
    P("Mystère. Il faut bien garder quelque chose pour plus tard."),
    P("Je ne confirme ni ne dénie. J’ai appris ça de Valurn."),
    P("Ah, regardez, le feu baisse. Quelqu’un devrait s’en occuper."),
    P("Je garde celle-là sous clé. Insiste, et je jette la clé."),
  ],
};

export type BVAnswerRole = "asker" | "other";

export const BV_ANSWER_REACTIONS: Record<BVNpc, Record<BVAnswerRole, Record<BVAnswer, DialogueLine[]>>> = {
  bellirith: {
    asker: {
      acknowledge: [
        B("Évidemment. Tu bois dès que je te pousse. Un peu trop facile.", "away"),
        B("Tu avoues si vite. Je voulais une chasse, j’ai eu une reddition.", "annoyed"),
        B("Bonne réponse, mauvaise manière. Tu aurais pu me faire travailler.", "smirk"),
        B("Docile. C’est reposant, et ça ne m’apprend rien.", "away"),
        B("Je savais. Tu viens de me le confirmer sans la moindre résistance. Dommage.", "teasing"),
      ],
      deny: [
        B("Non ? Tu me regardes en face pour me dire non. Ça, j’aime.", "seductive"),
        B("Tu me contredis à ma propre table. Continue, je t’écoute de plus près.", "seductive"),
        B("Menteur, ou pas. Dans les deux cas, tu ne recules pas. Intéressant.", "smirk"),
        B("Tu tiens bon. Je garde la question pour plus tard, et toi aussi.", "seductive"),
        B("Personne ne me dit non avec ce calme. Je vais finir par aimer ça.", "seductive"),
      ],
      dodge: [
        B("Tu te dérobes avec style. Je te poursuivrai avec plus de style encore.", "smirk"),
        B("Une esquive. Tu sais que je déteste les portes fermées, alors tu en fermes une.", "seductive"),
        B("Malin. Tu me laisses sur ma faim, et tu le fais exprès.", "seductive"),
        B("Tu joues au mystère avec moi ? Brave petite chose.", "teasing"),
        B("Ne crois pas avoir gagné. Tu as seulement repoussé le moment.", "smirk"),
      ],
    },
    other: {
      acknowledge: [
        B("Il t’a eu. Tu aurais dû me demander conseil avant de répondre.", "teasing"),
        B("Tu avoues à Valurn plus vite qu’à moi. Je note la préférence.", "annoyed"),
        B("Bois, bois. Il adore quand les gens lui donnent raison.", "smirk"),
        B("Trop honnête avec lui. Garde un peu de ça pour moi.", "teasing"),
        B("Oh, celle-là je la garde pour mes archives personnelles.", "amused"),
      ],
      deny: [
        B("Tu lui tiens tête. Bien. Il en a besoin plus souvent.", "smirk"),
        B("Non, à Valurn, en face. Je savais que tu me plairais.", "seductive"),
        B("Regarde-le, il déteste qu’on lui refuse quelque chose. Délicieux.", "amused"),
        B("Ne le crois pas, Valurn. Ou crois-le. Ça m’amuse dans les deux cas.", "teasing"),
        B("Joli refus. Je n’aurais pas fait mieux, et je fais toujours mieux.", "smirk"),
      ],
      dodge: [
        B("Tu l’as esquivé comme on esquive un créancier. Il connaît la sensation.", "amused"),
        B("Une dérobade pour Valurn. Il va passer la nuit à chercher la réponse.", "teasing"),
        B("Pas de verre, pas de réponse. Tu apprends vite avec lui.", "smirk"),
        B("Tu lui laisses une énigme. Il adore ça, il ne l’avouera jamais.", "amused"),
        B("Esquive propre. Je t’en accorde le point, pas plus.", "teasing"),
      ],
    },
  },
  valurn: {
    asker: {
      acknowledge: [
        V("Merci. Une réponse franche vaut une bonne bouteille.", "charming"),
        V("Vous buvez sans plaider. J’apprécie la clarté du contrat.", "amused"),
        V("Je m’en doutais. Le plaisir vient d’avoir raison sans avoir à insister.", "charming"),
        V("Voilà qui simplifie mes dossiers. Santé.", "amused"),
        V("Honnête et rapide. Vous seriez une catastrophe en affaires, et c’est un compliment.", "amused"),
      ],
      deny: [
        V("Non ? Je reverrai mes sources. Elles me coûtent pourtant cher.", "thoughtful"),
        V("Vous niez avec aplomb. Je ne saurai pas si c’est vrai, et c’est très bien joué.", "charming"),
        V("Mon informateur va m’entendre. Ou alors c’est vous qui mentez à merveille.", "amused"),
        V("Refus enregistré. Je n’insiste pas, j’ai des manières.", "charming"),
        V("Vous me regardez droit en disant non. Ça se respecte, même au marché.", "thoughtful"),
      ],
      dodge: [
        V("Une esquive. La réponse la plus chère de toutes, vous le savez.", "amused"),
        V("Vous laissez la question en suspens. J’apprécie un adversaire qui garde des réserves.", "charming"),
        V("Pas de oui, pas de non. Vous avez pris des leçons quelque part.", "amused"),
        V("Je respecte. Je reviendrai par une autre porte, plus tard.", "charming"),
        V("Silence stratégique. C’est presque mon style, je devrais me plaindre.", "amused"),
      ],
    },
    other: {
      acknowledge: [
        V("Vous lui donnez ce qu’elle veut. Prudence, elle en redemande toujours.", "thoughtful"),
        V("Avouer à Bellirith, c’est signer sans lire. Courageux.", "amused"),
        V("Bien. Elle vous laissera tranquille trois minutes, peut-être quatre.", "amused"),
        V("Vous buvez pour elle. Je garde ce détail dans un coin de ma tête.", "charming"),
        V("Une réponse franche à une question piège. Vous me surprenez encore.", "charming"),
      ],
      deny: [
        V("Vous lui dites non en face. Je prends des notes, elle déteste ça.", "amused"),
        V("Regardez-la. Elle vient de trouver quelqu’un d’intéressant.", "charming"),
        V("Un refus net à Bellirith. On en voit un par saison, en général.", "amused"),
        V("Vous ne reculez pas. Elle va vous le faire payer, et elle va aimer ça.", "thoughtful"),
        V("Bravo. Je n’aurais pas osé sur ce ton-là.", "amused"),
      ],
      dodge: [
        V("Esquiver Bellirith. Vous jouez avec le feu, et le feu sourit.", "amused"),
        V("Belle dérobade. Elle va la ruminer jusqu’à l’aube.", "charming"),
        V("Vous lui laissez une question ouverte. Elle déteste ça, donc elle va s’y attacher.", "thoughtful"),
        V("Pas de verre pour elle. Vous savez qu’elle compte, n’est-ce pas ?", "amused"),
        V("Habile. Je vous offrirais un poste si j’avais encore des postes à offrir.", "charming"),
      ],
    },
  },
};

export const BV_ANSWER_GENERIC: Record<BVNpc, DialogueLine[]> = {
  bellirith: [
    B("La table retient tout, tu sais. Moi aussi.", "smirk"),
    B("Ton silence entre deux mots en disait plus que ta réponse.", "thoughtful"),
    B("Tu as hésité d’un battement. Je l’ai entendu.", "seductive"),
    B("Réponse notée. Les intérêts courent.", "teasing"),
    B("Je ne commente pas. Je savoure.", "amused"),
    B("Bien. Passons, avant que je m’attache à cette question.", "away"),
    B("Ta main a tremblé sur le verre. Ou c’était la lumière.", "teasing"),
    B("On reparlera de ça quand Valurn ne sera pas là pour écouter.", "seductive"),
    B("Je ferai semblant d’avoir oublié. Je n’oublie jamais.", "smirk"),
    B("Pas mal. Pas assez pour me surprendre, mais pas mal.", "teasing"),
  ],
  valurn: [
    V("Je retiens la réponse et la manière. La manière compte plus.", "charming"),
    V("Votre voix a pris une demi-note de plus. Je ne dis rien.", "amused"),
    V("Intéressant. Je range ça avec les choses qui ne se vendent pas.", "thoughtful"),
    V("La carafe en a vu d’autres. Moi aussi, mais moins souvent.", "amused"),
    V("Belle réponse. Je l’aurais formulée avec plus de clauses.", "charming"),
    V("Je laisse passer. Le jeu est long, la nuit aussi.", "away"),
    V("Vous jouez juste. C’est presque suspect.", "amused"),
    V("Personne n’a jamais répondu à cette question de cette façon devant moi.", "thoughtful"),
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
    [P("Bellirith, celle-là, elle est pour toi. Et arrête de rire avant que j’aie fini."), P("Je te vise, toi et ton sourire de travers. Si, si, il est de travers.")],
    [P("Bellirith. Bellirith. Écoute-moi. Celle-ci est pour toi, et elle est très, très bonne."), P("Je te vise, ma reine des cornes. Pardon. Je retire les cornes. Non, je les garde.")],
  ),
  valurn: T(
    [P("Valurn, mon cher marchand, tes gants ne te sauveront pas. J’ai bu, je vois clair."), P("Celle-ci est pour toi, Valurn. Je la trouve brillante, mais je suis peut-être généreux.")],
    [P("Valurn ! Valurn. Je t’aime bien, tu sais ? Ça ne change rien, tu vas boire."), P("Pour toi, le grand négociateur. Attends, je retrouve la phrase. Voilà.")],
  ),
  none: T(
    [P("Une pour tout le monde. Je sens que je vais me faire avoir moi-même."), P("Celle-ci vise la table. Ou le lustre. Le lustre a sûrement des secrets.")],
    [P("Tout le monde ! Même le piano. Surtout le piano."), P("Écoutez, écoutez. Personne n’est visé. Enfin si. Vous verrez bien.")],
  ),
  generic: T(
    [P("À moi. Je tiens encore debout, c’est bon signe pour la qualité du jeu."), P("Mon tour ! Je l’avais préparée, j’ai juste oublié la fin. Ah, la voilà.")],
    [P("Mon tour. Si. C’est mon tour, j’ai compté sur mes doigts."), P("J’en ai une. Elle est géniale. Je ris avant de la dire, c’est normal.")],
  ),
};
export const BV_PLAYER_LEADS_SOLEMN_T: BVTiers = T(
  [P("Je pose le verre. J’ai assez bu pour être honnête, pas assez pour l’oublier.")],
  [P("Attendez. Je suis ivre, mais ce que je vais dire, je le pense depuis le début.")],
);

export const BV_THEME_REACTIONS_T: Record<BVNpc, Record<BVTheme, BVTiers>> = {
  bellirith: {
    humour: T([B("Je ris. Ne le répète à personne, ça ruinerait ma réputation.", "amused")], [B("Ha ! Arrête, j’ai renversé du vin sur mon propre talon. Encore une.", "amused")]),
    relations: T([B("Les cœurs, encore. Le vin me rend presque indulgente sur le sujet.", "thoughtful")], [B("Les cœurs, les cœurs. J’en ai un aussi, tu sais. Petit. Bien caché.", "thoughtful")]),
    marches: T([B("Une histoire de comptoir. Je bâille avec élégance, regarde.", "teasing")], [B("Le marché, toujours le marché. Valurn, tu m’achètes un autre verre ?", "amused")]),
    confiance: T([B("Me faire confiance après ce que j’ai bu ? Audacieux et un peu bête.", "thoughtful")], [B("La confiance… oui. Ce soir je te prête la mienne. Rends-la demain.", "thoughtful")]),
    surprise: T([B("Oh, celle-là ! Je la note quelque part. Sur ma main, tiens.", "amused")], [B("Je ne l’ai pas vue venir. Je ne vois plus grand-chose venir, remarque.", "amused")]),
    libre: T([B("Simple et efficace. Comme moi, avant le troisième verre.", "smirk")], [B("Bien dit. Très bien dit. Dis-le encore, plus lentement.", "seductive")]),
  },
  valurn: {
    humour: T([V("Je ris, et je ne le facture même pas. Le vin me rend prodigue.", "amused")], [V("C’est drôle. C’est vraiment drôle. Pourquoi c’est si drôle ?", "amused")]),
    relations: T([V("Les questions de cœur passent mieux avec le troisième verre. Curieux phénomène.", "thoughtful")], [V("Les cœurs, oui. J’en ai connu un ou deux. Le mien, parfois.", "away")]),
    marches: T([V("Une affaire ! Je fais une offre. Non, je retire mon offre.", "amused")], [V("Combien ? Je paie. Je paie tout. Notez que je ne paierai rien demain.", "amused")]),
    confiance: T([V("Vous voulez ma confiance ? Ce soir, elle est en solde.", "charming")], [V("Je vous fais confiance. Voilà. C’est dit, et j’ai trop bu pour revenir dessus.", "away")]),
    surprise: T([V("Je ne l’avais pas prévue, celle-là. Mes prévisions titubent un peu.", "amused")], [V("Ah ! Vous m’avez eu. Encore. J’adore être eu, finalement.", "amused")]),
    libre: T([V("Phrase nette. La mienne commence à friser, vous remarquerez.", "amused")], [V("Belle phrase. Je vais la répéter. Belle phrase. Voilà, je l’ai répétée.", "amused")]),
  },
};

export const BV_STATEMENT_REACTIONS_T: Record<BVNpc, Record<BVReactionKey, BVTiers>> = {
  bellirith: {
    "target-drank": T(
      [B("Encore moi ? Tu le fais exprès. Continue, je trouve ça presque charmant.", "seductive"), B("Je bois, je bois. Tu as l’œil, ce soir. Un œil insolent.", "smirk")],
      [B("Tu m’as eue ! Encore ! Je devrais être furieuse, et je ris. Explique-moi ça.", "amused"), B("Viens là que je te félicite. Non, reste assis. Félicitations de loin.", "seductive")],
    ),
    "target-dry": T(
      [B("Raté ! Et je ris de toi, gentiment. Un peu.", "amused"), B("Non, non. Tu me prêtes trop de vices. Enfin, pas celui-là.", "teasing")],
      [B("Rien ! Je suis innocente. Regarde ce visage. Innocent. Presque.", "amused"), B("Je ne bois pas, ha. Je bois quand même un peu, pour la forme.", "amused")],
    ),
    "bystander-drank": T(
      [B("Je bois en passant, et je pose le verre un peu trop fort. Pardon, table.", "amused"), B("Même pas visée, et je bois. Le destin me trouve jolie, ce soir.", "seductive")],
      [B("Moi aussi ! Ne me demandez pas quand. C’était une très bonne soirée.", "amused"), B("Je bois. Pour le principe. Et pour le goût. Surtout pour le goût.", "amused")],
    ),
    "bystander-dry": T(
      [B("Pas moi. J’en profite pour admirer vos grimaces.", "teasing"), B("Je regarde, je ris, je ne bois pas. Le meilleur rôle de la soirée.", "amused")],
      [B("Pas moi. Mais je bois quand même. Non ? Bon. Je repose le verre.", "amused"), B("Je ne bois pas, j’applaudis. Lentement. Très lentement.", "amused")],
    ),
  },
  valurn: {
    "target-drank": T(
      [V("Je bois, et je ris, ce qui est nouveau pour moi à cette table.", "amused"), V("Vous m’avez encore eu. Je commence à vous admirer, c’est fâcheux.", "charming")],
      [V("Accordé ! Tout accordé ! Je signe ce que vous voulez. Non, rien. Je bois.", "amused"), V("Vous lisez en moi comme dans un livre ouvert. Un livre très mal relié.", "amused")],
    ),
    "target-dry": T(
      [V("Raté, mais avec panache. Je lève mon verre vide à votre panache.", "amused"), V("Pas moi. Je suis presque déçu de ma propre sagesse.", "amused")],
      [V("Non ! Je n’ai jamais. Jamais. Enfin, je crois. Je vérifierai demain.", "amused"), V("Je reste sec. C’est bien la seule chose sèche autour de moi.", "amused")],
    ),
    "bystander-drank": T(
      [V("Je bois en passant. Le vin a décidé de m’inclure, je ne discute pas.", "amused"), V("Moi aussi, oui. Ne demandez pas de détails, ils sont flous.", "charming")],
      [V("Je bois ! J’aime bien boire avec vous. Je le dis, c’est dit.", "amused"), V("Collatéral, encore. Je suis une victime ravie.", "amused")],
    ),
    "bystander-dry": T(
      [V("Pas moi. J’en profite pour remplir le verre de quelqu’un d’autre.", "charming"), V("Je ne bois pas, et je fredonne. Ignorez le fredonnement.", "amused")],
      [V("Pas moi. Je suis un exemple. Un exemple légèrement penché.", "amused"), V("Rien pour moi. Le piano et moi, on attend notre tour.", "amused")],
    ),
  },
};

export const BV_STATEMENT_GENERIC_T: Record<BVNpc, BVTiers> = {
  bellirith: T(
    [B("Tu as les joues roses. Ou c’est le feu. Je préfère que ce soit moi.", "seductive"), B("Je compte les verres sur mes doigts. Il m’en manque un.", "amused")],
    [B("Je t’aime bien quand tu joues. Je le dis parce que le vin le dit pour moi.", "seductive"), B("Le lustre tourne. Ou c’est la table. Peu importe, continue.", "amused")],
  ),
  valurn: T(
    [V("Je desserre mon col. Ne le prenez pas pour une capitulation.", "amused"), V("Vous jouez bien. Je l’aurais dit plus sobrement il y a trois verres.", "charming")],
    [V("Vous savez quoi ? Vous êtes la meilleure chose qui soit arrivée à cette carafe.", "amused"), V("J’ai perdu le compte. Je ne perds jamais le compte. Ha.", "amused")],
  ),
};
export const BV_STATEMENT_FALLOUT_T: Record<BVNpc, BVTiers> = {
  bellirith: T([B("Après tout ça, le vin a un goût de trêve. Je ne déteste pas.", "thoughtful")], [B("On s’est tout dit, et je ris quand même. Tu vois ce que tu me fais faire ?", "amused")]),
  valurn: T([V("Le vin et la vérité font bon ménage, finalement. Qui l’eût cru.", "thoughtful")], [V("Je suis content. Voilà. Je suis ivre et content, notez la date.", "amused")]),
};
export const BV_STATEMENT_SOLEMN_T: Record<BVNpc, BVTiers> = {
  bellirith: T([B("Le vin m’empêche de faire semblant. Tu as choisi ton moment, je t’en veux.", "cold")], [B("Je suis trop ivre pour mentir, alors je me tais. C’est pire, je sais.", "thoughtful")]),
  valurn: T([V("Je voudrais une réplique brillante. Le vin me laisse seulement une vraie.", "away")], [V("Attendez. Je dégrise d’un coup, c’est très désagréable.", "away")]),
};

export const BV_PLAYER_ANSWERS_T: Record<BVAnswer, BVTiers> = {
  acknowledge: T(
    [P("Oui, oui, je l’ai fait. Je ris en le disant, c’est mauvais signe."), P("Coupable ! Je bois, et je trouve ça beaucoup plus drôle qu’il y a une heure.")],
    [P("Oui. Bien sûr que oui. Deux fois, même. Non, une. Je bois pour les deux."), P("J’avoue tout. Enfin, ça. Seulement ça. Remplissez.")],
  ),
  deny: T(
    [P("Non ! Et je le dis en te regardant, même si tu tangues un peu."), P("Jamais. Je suis sobre sur ce point-là, au moins.")],
    [P("Non. Non non. Jamais. Je jure sur la carafe."), P("Faux ! Archi-faux. Je ne bois pas, tiens, regarde, je pose le verre. Loin.")],
  ),
  dodge: T(
    [P("Je ne réponds pas. Je souris très mystérieusement. Ça se voit, que c’est mystérieux ?"), P("Joker ! Le vin me rend joueur, pas bavard.")],
    [P("Je… non. Je garde ça. Pour moi. Et pour le lustre, il sait tout."), P("Question suivante ! Je ne me souviens plus de celle-ci, de toute façon.")],
  ),
};

export const BV_ANSWER_REACTIONS_T: Record<BVNpc, Record<BVAnswerRole, Record<BVAnswer, BVTiers>>> = {
  bellirith: {
    asker: {
      acknowledge: T([B("Tu avoues en riant. C’est mignon, et ça ne m’apprend toujours rien.", "away")], [B("Oh, tu avoues tout ce soir. Facile. Trop facile. Je bâille. Non, je ris.", "amused")]),
      deny: T([B("Tu me dis non avec du vin dans la voix. Ça me plaît encore plus.", "seductive")], [B("Non ? Tu me dis non ? Viens me le redire plus près. Ou pas, comme tu veux.", "seductive")]),
      dodge: T([B("Tu te dérobes en titubant. Je te rattraperai, j’ai le pied plus sûr.", "smirk")], [B("Tu fuis ! Je te suivrais bien, mais la table a bougé.", "amused")]),
    },
    other: {
      acknowledge: T([B("Tu avoues tout à Valurn. Le vin te rend généreux avec les mauvaises personnes.", "teasing")], [B("Tu lui dis oui, à lui ? Traître adorable.", "amused")]),
      deny: T([B("Tu tiens tête à Valurn, même éméché. J’applaudirais si mes mains m’obéissaient.", "smirk")], [B("Non, à Valurn ! Ha ! Regarde sa tête. Regarde-la, vite.", "amused")]),
      dodge: T([B("Esquive avinée, mais esquive. Je valide.", "teasing")], [B("Tu l’as semé ! Il cherche encore la réponse sous la table.", "amused")]),
    },
  },
  valurn: {
    asker: {
      acknowledge: T([V("Franchise et vin rouge, mon duo préféré de la soirée.", "amused")], [V("Vous avouez ! Je vous aime bien. Je l’ai déjà dit ? Je le redis.", "amused")]),
      deny: T([V("Vous niez, et je n’ai plus la tête à vérifier. Bien joué.", "amused")], [V("Non ? Bon. Je vous crois. Je crois tout le monde, ce soir, c’est grave.", "amused")]),
      dodge: T([V("Une esquive. J’en prends note, d’une écriture qui penche.", "amused")], [V("Vous esquivez ! Je ferais pareil. Je fais pareil depuis vingt ans.", "amused")]),
    },
    other: {
      acknowledge: T([V("Vous avouez à Bellirith, et elle sourit. Méfiez-vous du sourire, même flou.", "thoughtful")], [V("Ah, elle a gagné. Elle gagne toujours. Je bois à sa santé, et à la vôtre.", "amused")]),
      deny: T([V("Non à Bellirith, avec trois verres dans le sang. Je retiens votre courage.", "amused")], [V("Vous lui dites non ! Je ris. Je ris beaucoup. Pardon, Bellirith. Non, pas pardon.", "amused")]),
      dodge: T([V("Vous lui glissez entre les doigts. Joli, pour quelqu’un qui a bu.", "charming")], [V("Elle vous cherche, vous êtes parti ! Je vous cache. Derrière le piano.", "amused")]),
    },
  },
};

export const BV_ANSWER_GENERIC_T: Record<BVNpc, BVTiers> = {
  bellirith: T([B("Ta voix traîne un peu sur les fins de phrase. Ça te va bien.", "seductive"), B("Je retiens tout, même éméchée. Surtout éméchée.", "smirk")], [B("Je ne me souviendrai de rien demain. Si. De toi, si.", "seductive"), B("Ha. Je ris, et je ne sais même plus pourquoi. C’est bon signe.", "amused")]),
  valurn: T([V("Le vin arrondit les angles. Vos réponses aussi.", "charming"), V("Je note, mais l’encre de ma mémoire coule un peu.", "amused")], [V("Excellente réponse. Je ne l’ai pas entendue, mais je l’approuve.", "amused"), V("Je suis d’accord avec vous. Avec tout. Avec la table aussi.", "amused")]),
};
