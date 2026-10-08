import type { ChoiceData, DialogueLine } from "./game-data";
import type { HRBeat } from "./hylee-remerii-cross-quest";
import { B, C, P, T, W, Y, BN_BELLIRITH_FAVORITE, BN_BELLIRITH_RESISTED, BN_BELLIRITH_SLEPT } from "./bellirith-naiah-kit";

/**
 * Quête croisée Bellirith / Naïah : les six étapes dialoguées (Q1 à Q6).
 * Chaque scène est écrite à la main. Les variantes dépendent de l’historique
 * Bellirith réellement présent dans la sauvegarde et des intimités acceptées,
 * différées ou refusées pendant la série.
 */

export type BNSceneContext = {
  flags: readonly string[];
  firstIntimacyDone?: boolean;
  limitIntimacyDone?: boolean;
  simulationIntimacyDone?: boolean;
  /** Le joueur a quitté Q5 avant la chute (refus ou interruption). */
  simulationToldAfter?: boolean;
  minigameResult?: "naiah" | "bellirith" | "egalite";
};

export type BNSceneData = HRBeat & { id: string; title: string; location: string; spot: string; cast: string[]; beats: HRBeat[]; music: string; period?: string };

const DUO = ["bellirith", "naiah"];

/** Choix qui ouvrent une intimité : ils ne s’affichent qu’après une proposition explicite et ne lancent la scène qu’à la fermeture du dialogue. */
export const BN_FIRST_ACCEPT = "cross-bn-02-accept";
export const BN_FIRST_LATER = "cross-bn-02-later";
export const BN_FIRST_DECLINE = "cross-bn-02-decline";
export const BN_LIMIT_ACCEPT = "cross-bn-04-accept";
export const BN_LIMIT_LATER = "cross-bn-04-later";
export const BN_LIMIT_DECLINE = "cross-bn-04-decline";
export const BN_SIMULATION_ACCEPT = "cross-bn-05-accept";
export const BN_SIMULATION_DECLINE = "cross-bn-05-decline";
export const BN_INTIMACY_CHOICES = { first: BN_FIRST_ACCEPT, limit: BN_LIMIT_ACCEPT, simulation: BN_SIMULATION_ACCEPT } as const;

/* ------------------------------------------------------------------------ */
/* Q1 · L’anomalie                                                           */
/* ------------------------------------------------------------------------ */

function anomaly(ctx: BNSceneContext): BNSceneData {
  const slept = ctx.flags.includes(BN_BELLIRITH_SLEPT);
  return {
    id: "cross-bn-01", title: "L’anomalie", location: "forestier", spot: "forestier-inn", cast: ["bellirith"], music: "midnight-waltz",
    intro: [
      T("L’Auberge du Forestier tient sa salle à moitié pleine. Bellirith occupe la meilleure table sans l’avoir réservée ; le tenancier a simplement renoncé à discuter. Elle vous appelle de deux doigts, comme on rappelle un serveur dont on apprécie la tournure."),
      slept
        ? B("Tu tombes bien. Il me faut quelqu’un qui sait déjà comment je travaille, et tu as eu le privilège de l’apprendre de très près.", "seductive")
        : B("Assieds-toi. Il me faut un témoin, et tu as une tête à raconter les choses exactement comme elles se sont passées.", "teasing"),
      T("Elle désigne le fond de la salle d’un coup de menton. Près de la cheminée, Naïah s’est assise à l’envers sur une chaise, les bras croisés sur le dossier. Chaque fois qu’un voyageur tend la main vers sa chope, la chope se retrouve un peu plus loin sur le comptoir."),
      B("Regarde-la. Elle fait ça depuis une heure. Moi, je sens toute la salle : le marchand veut la serveuse, la serveuse veut qu’il paie, le voyageur veut sa bière et un peu ta voisine de banc.", "teasing"),
      P("Et Naïah ?"),
      B("Elle veut rire. Elle veut qu’il craque avant elle. Elle veut que la cheminée tienne jusqu’à minuit. Voilà.", "thoughtful"),
      T("Bellirith plisse les yeux, avec l’air d’une musicienne qui entend une corde manquer à l’instrument sans réussir à dire laquelle."),
      B("Il manque quelque chose. Attends ici.", "thoughtful"),
      T("Elle se lève. Sa robe accroche la lumière à chaque pas et la moitié de la salle oublie ce qu’elle était en train de dire. Elle s’arrête près de Naïah, assez près pour que sa hanche frôle le dossier de la chaise.", DUO),
      B("On m’avait parlé d’une héritière des brumes. On avait oublié de préciser qu’elle était aussi jolie quand elle trichait.", "seductive"),
      Y("On t’a mal renseignée. Je ne triche pas. Je déplace.", "smirk"),
      T("Bellirith se penche. Une chaleur discrète passe dans l’air, l’odeur d’une chambre où l’on vient d’allumer les bougies. À trois tables de là, le voyageur renverse sa bière tout seul et devient écarlate."),
      Y("Oh. C’est toi qui fais ça ? Regarde-le, il est tout rouge.", "laugh"),
      B("Lui, oui.", "seductive"),
      T("Bellirith attend. Naïah la regarde avec un intérêt sincère, la tête inclinée, comme on observe un insecte inconnu qui vient de se poser sur la nappe."),
      Y("Tu fais une drôle de tête. Tu as perdu quelque chose ?", "smirk"),
    ],
    choices: [
      C("cross-bn-01-join", "Rejoindre Bellirith et relancer la conversation sur le tour de la chope.", "audace", [
        T("Vous traversez la salle. Naïah vous fait une place sur le banc d’un geste de propriétaire, sans quitter Bellirith des yeux."),
        P("Combien de temps tu comptes le faire courir ?"),
        Y("Jusqu’à ce qu’il comprenne. Il ne comprendra pas. C’est ce qui rend l’exercice reposant.", "smirk"),
        B("Moi, je comprends très bien. Tu préfères le voir chercher plutôt que boire.", "teasing"),
        Y("Exactement. Tu lis bien. Continue, c’est agréable d’être lue par quelqu’un de compétent.", "laugh"),
        T("Bellirith pose deux doigts sur le poignet de Naïah, juste là où le pouls se laisse prendre. Naïah baisse les yeux sur la main, puis les relève, ravie, comme si on venait de lui offrir un jeu de cartes neuf."),
        B("Tu as la peau froide.", "thoughtful"),
        Y("Et toi, tu as la main lourde. Tu cherches un endroit précis ?", "smirk"),
      ], { relationshipEffects: { naiah: { affection: 1 } }, desire: 1 }),
      C("cross-bn-01-watch", "Rester assis et observer ce que Bellirith cherche.", "lucidite", [
        T("De votre table, la scène se lit comme un tour de prestidigitation dont on connaîtrait déjà le truc."),
        T("Bellirith essaie d’abord la proximité : elle s’assoit sur le coin de la table de Naïah. Naïah lui tend sa chope sans un mot. Elle essaie ensuite le regard, long, appuyé, celui qui fait rougir les gardes impériaux. Naïah le lui rend, avec la même durée exactement, et compte à voix basse."),
        T("Enfin, Bellirith effleure du bout de l’ongle la nuque de Naïah, sous les cheveux. Naïah frissonne, rit, et lui demande si c’est un sort qu’on apprend en Enfer ou si elle l’a inventé seule."),
        T("Bellirith revient s’asseoir en face de vous. Elle vide votre verre au lieu du sien."),
        B("Rien.", "cold"),
        P("Rien du tout ?"),
        B("Des tas de choses. De la curiosité, du rire, l’envie de me répondre. Et à l’endroit où je regarde d’habitude en premier, une chaise vide.", "thoughtful"),
      ], { trust: 1 }),
      C("cross-bn-01-offer", "Demander à Naïah, d’un signe, si elle veut qu’on la débarrasse de la démone.", "resonance", [
        T("Naïah surprend votre geste par-dessus l’épaule de Bellirith. Elle secoue la tête avec une vigueur presque scandalisée."),
        Y("Surtout pas. Elle est beaucoup plus drôle que le voyageur.", "laugh"),
        B("Je suis là. J’entends.", "teasing"),
        Y("Je sais. C’est pour ça que je le dis fort.", "smirk"),
        T("Bellirith se penche encore, la voix plus basse, une promesse au bord de chaque syllabe. Naïah écoute avec attention, puis répète la fin de la phrase sur le même ton, pour voir si elle sonne aussi bien dans sa bouche."),
        Y("Non. Chez toi, c’est mieux. Il faudra que je travaille ça.", "thinking"),
      ], { relationshipEffects: { naiah: { affection: 1, trust: 1 } } }),
    ],
    beats: [{
      cast: DUO,
      intro: [
        T("Bellirith tente une dernière chose. Elle ne touche plus personne. Elle laisse simplement monter ce qu’elle porte en elle, et la salle entière tiédit comme un bain qu’on réchauffe. Deux clients s’embrassent près de la porte. Le tenancier oublie de rendre la monnaie."),
        T("Naïah ne regarde pas les clients. Elle regarde Bellirith, et seulement Bellirith, avec une concentration de joueuse d’échecs."),
        Y("Tu es en train de m’étudier.", "thinking"),
        B("Je regarde. C’est mon métier.", "teasing"),
        Y("Non. Tu cherches. Tu as la tête de quelqu’un qui fouille une poche et qui retrouve toujours la même pièce de monnaie.", "smirk"),
        T("Un silence. Puis Naïah éclate de rire, si franchement que le voyageur récupère sa chope par erreur."),
        Y("Oh, c’est merveilleux. Continue, je t’en prie. Je veux voir combien de temps tu tiens avant d’abandonner.", "laugh"),
        B("Je n’abandonne jamais rien. Je laisse parfois les choses mûrir.", "smirk"),
      ],
      choices: [
        C("cross-bn-01-ask", "Une fois Naïah partie, demander à Bellirith ce qu’elle a cherché.", "lucidite", [
          T("Naïah s’en va par la porte de derrière en laissant une chope pleine en équilibre sur la poutre, hors de portée de tout le monde."),
          P("Qu’est-ce que tu cherchais, exactement ?"),
          B("Ce que je trouve chez tout le monde. D’ordinaire, ça me saute au visage avant le prénom. Chez elle, il y a du monde partout, sauf dans cette pièce-là.", "thoughtful"),
          P("Ça te dérange ?"),
          B("Ça m’intrigue. Et je n’ai pas été intriguée depuis très longtemps. Garde ça pour toi, je tiens à ma réputation.", "seductive"),
        ], { trust: 1, relationshipEffects: { naiah: { affection: 1 } } }),
        C("cross-bn-01-bet", "Parier avec Naïah que Bellirith finira par trouver ce qu’elle cherche.", "audace", [
          Y("Un pari ? Avec quoi ?", "smirk"),
          P("Tes bottes."),
          Y("Mes bottes valent plus que toi. Mais d’accord. Si elle trouve, je te les donne. Si elle ne trouve pas, tu les cires pendant un mois.", "laugh"),
          B("Personne ne parie sur moi sans me demander mon avis.", "angry"),
          Y("Si. Nous deux. À l’instant.", "laugh"),
        ], { desire: 1, relationshipEffects: { naiah: { affection: 1 } } }),
        C("cross-bn-01-leave", "Laisser Bellirith sortir la première et voir si Naïah la suit des yeux.", "resonance", [
          T("Bellirith quitte l’auberge sans saluer. Naïah la suit des yeux jusqu’à la porte, puis vous regarde, très contente d’elle."),
          Y("Elle reviendra. Les gens qui fouillent reviennent toujours vérifier la poche.", "smirk"),
          P("Et toi, tu seras là ?"),
          Y("Évidemment. Je veux voir sa tête quand elle la retrouvera vide une deuxième fois.", "laugh"),
        ], { relationshipEffects: { naiah: { trust: 1 } }, trust: 1 }),
      ],
    }],
  };
}

/* ------------------------------------------------------------------------ */
/* Q2 · Tu simules                                                           */
/* ------------------------------------------------------------------------ */

function simulates(ctx: BNSceneContext): BNSceneData {
  const favorite = ctx.flags.includes(BN_BELLIRITH_FAVORITE);
  const resisted = ctx.flags.includes(BN_BELLIRITH_RESISTED);
  return {
    id: "cross-bn-02", title: "Tu simules", location: "forbidden", spot: "forbidden-ruins", cast: ["naiah"], music: "bellirith-encounter",
    intro: [
      T("Un billet plié en forme d’oiseau vous attendait sur l’oreiller. Il ne disait que « Ruines, ce soir, viens tôt ». Naïah vous accueille au pied des escaliers noyés, une chandelle dans chaque main."),
      Y("Tu es en avance. Parfait. Aide-moi à finir le décor.", "smirk"),
      T("Le décor, c’est une table basse posée au milieu des racines, trois coussins de velours rouge, une carafe de vin sombre et une quantité déraisonnable de bougies. Vous reconnaissez la mise en scène. Vous l’avez déjà vue autour de Bellirith."),
      P("Tu as copié sa table."),
      Y("J’ai étudié. Elle m’a regardée de près, je lui rends la politesse. C’est la moindre des choses entre gens bien élevés.", "smirk"),
      T("Bellirith arrive à l’heure exacte, ce qui ne lui ressemble pas. Elle s’arrête devant les coussins, les bougies, le vin, et un sourire très lent lui monte aux lèvres.", DUO),
      favorite
        ? B("Une invitation, et mon témoin préféré déjà installé. On me gâte. Je vais finir par croire que vous complotez.", "seductive")
        : resisted
          ? B("Même toi, tu as fait le chemin ? Tu me refuses, mais tu ne refuses jamais un spectacle. J’ai noté.", "smirk")
          : B("Une invitation et un public. On me gâte. Je vais finir par croire que vous complotez.", "seductive"),
      Y("Assieds-toi. Ce soir, c’est moi qui reçois.", "smirk"),
      T("Naïah verse le vin. Puis, pendant quelques instants, quelque chose change chez elle. Son souffle se raccourcit. Elle mord sa lèvre inférieure, juste un peu. Ses joues prennent une couleur chaude, ses doigts tremblent sur le pied du verre, et quand ses yeux remontent vers Bellirith, ils ont l’air d’avoir du mal à rester en place."),
      T("Vous en avez le souffle coupé vous-même. C’est parfait. C’est exactement le trouble qu’on voit traverser les gens qui regardent Bellirith depuis trop longtemps."),
      B("Tu simules.", "cold"),
      T("La phrase tombe avant que Naïah ait reposé le verre."),
      Y("Oui.", "neutral"),
      Y("Je voulais savoir combien de temps il te faudrait. Moins d’une seconde. Tu es vraiment douée.", "laugh"),
      B("Personne ne simule avec moi.", "angry"),
      T("Bellirith l’a dit avec une dignité de reine offensée. Le visage de Naïah s’illumine lentement, comme celui d’une enfant devant qui on vient de poser un paquet en lui interdisant de l’ouvrir."),
    ],
    choices: [
      C("cross-bn-02-laugh", "Rire avec Naïah, franchement.", "audace", [
        T("Le rire vous échappe. Naïah lève aussitôt un doigt dans votre direction, comme une juge qui accorde un point au public."),
        Y("Tu vois ? Même ton témoin trouve ça drôle.", "laugh"),
        B("Mon témoin n’a pas l’oreille. Il entend une chanson et croit qu’on chante.", "angry"),
        P("Elle chantait plutôt bien."),
        B("Elle chantait faux à l’endroit exact où personne d’autre que moi ne peut entendre. C’est pire.", "cold"),
      ], { relationshipEffects: { naiah: { affection: 2 } } }),
      C("cross-bn-02-how", "Demander à Bellirith comment elle l’a su aussi vite.", "lucidite", [
        P("Comment tu as su ? Moi, j’y ai cru."),
        B("Le souffle montait, les joues rougissaient, les mains tremblaient. Tout le corps jouait la partition. Et derrière, rien ne bougeait. Une porte qui chanterait un air d’amour.", "thoughtful"),
        Y("Une porte. Elle me compare à une porte.", "laugh"),
        B("À une très belle porte, sculptée, vernie. Je ne suis pas cruelle.", "seductive"),
      ], { trust: 1, relationshipEffects: { naiah: { affection: 1 } } }),
      C("cross-bn-02-vexed", "Faire remarquer à Bellirith qu’elle a l’air plus vexée que flattée.", "resonance", [
        P("Tu as l’air vexée."),
        B("Vexée ? Elle vient de contrefaire ma signature sous mon nez, avec ma propre encre, sur mon propre papier.", "angry"),
        Y("Et c’était une très belle contrefaçon. Tu l’as dit toi-même.", "smirk"),
        B("Je n’ai rien dit de tel.", "angry"),
        Y("Tes sourcils l’ont dit. Ils sont très bavards, tes sourcils.", "laugh"),
      ], { affection: 1, relationshipEffects: { naiah: { affection: 1 } } }),
    ],
    beats: [{
      cast: DUO,
      intro: [
        Y("Personne ne simule avec toi. Personne. Vraiment personne ?", "smirk"),
        B("Personne.", "cold"),
        Y("Alors je suis la première. Tu notes la date ? Moi, je la note.", "laugh"),
        T("Elle trace un bâton dans la cire d’une bougie avec l’ongle. Un seul. Il y a de la place pour beaucoup d’autres."),
        B("Tu comptes recommencer.", "teasing"),
        Y("Tu viens de me dire que c’était impossible. Je n’ai jamais su résister à une porte fermée.", "smirk"),
        T("Bellirith la regarde longtemps. Puis elle sourit, autrement, avec cette gourmandise qu’elle réserve d’habitude aux duels qu’elle est sûre de gagner."),
        B("Très bien. Si tu veux jouer à ça, joue-le jusqu’au bout. Ce soir. Avec moi, ici, sur tes coussins volés.", "seductive"),
        B("Et toi aussi, {player}, puisque tu sais déjà si bien regarder. Je veux voir ce qu’elle fait quand je ne trouve rien, et je veux quelqu’un qui le verra aussi.", "seductive"),
        Y("Pour voir ce que tu fais quand tu ne trouves rien ? D’accord. Ça m’intéresse énormément.", "smirk"),
        T("Naïah l’a dit sans détour, la tête penchée, curieuse comme devant une expérience qu’elle aurait elle-même proposée. Elles se tournent toutes les deux vers vous. Rien ne commencera sans votre réponse."),
      ],
      choices: [
        C(BN_FIRST_ACCEPT, "Accepter de rester ce soir et d’entrer dans leur jeu.", "audace", [
          P("Je reste."),
          Y("Bien. Tu seras mon public.", "smirk"),
          B("Tu seras mon témoin. Elle se trompe, comme d’habitude.", "seductive"),
          T("Naïah souffle la moitié des bougies d’un geste. Bellirith rallume l’autre moitié d’un regard. Il reste juste assez de lumière pour que personne ne puisse prétendre ne pas avoir vu."),
        ], { desire: 1, relationshipEffects: { naiah: { affection: 1 } } }, { launchesIntimacy: "bn-first" }),
        C(BN_FIRST_LATER, "Proposer de garder cette nuit pour plus tard.", "sangFroid", [
          P("Pas ce soir. Mais je ne dis pas non."),
          B("Je déteste attendre. C’est précisément ce qui rend l’attente si délicieuse quand c’est moi qui la fixe.", "teasing"),
          Y("Moi, je ne déteste rien. Je patiente et je m’entraîne.", "smirk"),
          T("Naïah ajoute un second bâton dans la cire, à côté du premier, puis le barre aussitôt."),
          Y("Celui-là ne compte pas encore. Il attend ta réponse.", "laugh"),
        ], { trust: 1, relationshipEffects: { naiah: { trust: 1 } } }),
        C(BN_FIRST_DECLINE, "Refuser d’en faire partie, sans retirer votre amitié à aucune des deux.", "resonance", [
          P("Je ne veux pas en faire partie. Jouez sans moi, si vous jouez."),
          B("Dommage. Mon enquête continue, avec ou sans ton regard.", "teasing"),
          Y("Ça change mon score, par contre. Je comptais sur toi pour applaudir.", "smirk"),
          P("J’applaudirai le reste."),
          Y("Le reste sera très bien aussi. Je n’ai pas besoin d’une chambre pour gagner.", "laugh"),
          T("Bellirith range le vin. Naïah garde les bougies. Le jeu, lui, ne s’éteint pas."),
        ], { trust: 1, relationshipEffects: { naiah: { trust: 1 } } }),
      ],
    }],
  };
}

/* ------------------------------------------------------------------------ */
/* Q3 · Les Trois Réponses (dialogue d’ouverture ; le mini-jeu suit)         */
/* ------------------------------------------------------------------------ */

function threeAnswers(ctx: BNSceneContext): BNSceneData {
  return {
    id: "cross-bn-03", title: "Les Trois Réponses", location: "algratal", spot: "algratal-ballroom", cast: DUO, music: "infernal-trade",
    intro: [
      T("La Salle des Élus est vide à cette heure. Les lustres sont éteints sauf un. Sous ce lustre unique, Bellirith a fait installer une table de jeu, deux chaises face à face et une petite coupe pleine de jetons d’ivoire."),
      ctx.firstIntimacyDone
        ? B("Depuis l’autre nuit, je connais par cœur chacune de tes grimaces, Naïah. La façon dont tu cambres, celle dont tu soupires, l’ordre exact dans lequel tu les sers.", "seductive")
        : B("Je t’ai regardée tricher dans une auberge et dans des ruines. Ça m’a suffi pour connaître ton répertoire, Naïah. La lèvre, le souffle, les joues.", "teasing"),
      ctx.firstIntimacyDone
        ? Y("Et moi, depuis l’autre nuit, j’ai corrigé trois défauts. Tu ne les reconnaîtras plus.", "smirk")
        : Y("J’en ai d’autres. Je les garde pour les grandes occasions.", "smirk"),
      B("Justement. J’en ai assez de te chasser dans les coins. Ce soir, on joue à un jeu dont je fixe les règles.", "seductive"),
      Y("Tu fixes toujours les règles.", "neutral"),
      B("Et cette fois, je te les donne à l’avance. Considère ça comme un cadeau.", "smirk"),
      T("Bellirith pose trois jetons sur la table, chacun gravé d’un signe. Un losange plein, un cercle à moitié noirci, une flèche qui revient sur elle-même."),
      B("Je dis une chose sur toi. Avant que tu répondes, je t’annonce ce que je lis. Ensuite tu choisis ta manière de jouer. Tu peux assumer, simuler, ou me retourner la question.", "teasing"),
      Y("Et qui gagne ?", "smirk"),
      B("Simuler bat assumer. Retourner bat simuler. Assumer bat retourner. Celle qui joue la parade de l’autre prend la manche.", "teasing"),
      Y("C’est un jeu d’enfant.", "laugh"),
      B("Un jeu d’enfant où l’une des deux joueuses voit à travers les murs. Je trouve ça équitable.", "seductive"),
      T("Naïah fait rouler le jeton à la flèche entre ses doigts, puis vous le lance."),
      Y("Toi, tu comptes les points. Tu es la seule personne honnête dans cette pièce.", "smirk"),
    ],
    choices: [
      C("cross-bn-03-score", "Prendre le carnet et promettre de compter sans favoriser personne.", "lucidite", [
        P("Je compte. Personne ne touche aux jetons sauf moi."),
        B("Un arbitrage en règle. Comme c’est austère.", "teasing"),
        Y("Comme c’est rassurant. Tu triches mieux quand personne ne regarde.", "smirk"),
      ], { trust: 1, relationshipEffects: { naiah: { trust: 1 } } }),
      C("cross-bn-03-coach", "Glisser à Naïah que Bellirith annonce toujours la vérité de ce qu’elle lit.", "resonance", [
        P("Elle ne ment jamais sur ce qu’elle lit. Sers-t’en."),
        Y("Je sais. C’est sa plus grande faiblesse. Elle est trop fière pour bluffer.", "laugh"),
        B("Je suis trop douée pour avoir besoin de bluffer. Nuance.", "smirk"),
      ], { relationshipEffects: { naiah: { affection: 1 } } }),
      C("cross-bn-03-tease", "Demander à Bellirith ce qu’elle mise, puisqu’elle aime tant les enjeux.", "audace", [
        P("Et tu mises quoi, toi ?"),
        B("Ma patience. C’est ce que j’ai de plus rare.", "seductive"),
        Y("Moi je mise un baiser simulé, à livrer quand je veux.", "smirk"),
        B("Garde-le. J’ai déjà une collection.", "cold"),
      ], { desire: 1 }),
    ],
    beats: [],
  };
}

/* ------------------------------------------------------------------------ */
/* Q4 · Jusqu’où ?                                                           */
/* ------------------------------------------------------------------------ */

function howFar(ctx: BNSceneContext): BNSceneData {
  const first = ctx.firstIntimacyDone;
  const slept = ctx.flags.includes(BN_BELLIRITH_SLEPT);
  return {
    id: "cross-bn-04", title: "Jusqu’où ?", location: "river-halt", spot: "river-halt", cast: DUO, music: "marble-moon",
    intro: [
      T("À la Halte du Fleuve bleu, les bateliers ont tiré les barques sur la grève pour la nuit. Bellirith et Naïah sont assises côte à côte sur la coque retournée de la plus grande, à une distance de deux mains exactement, comme si elles l’avaient mesurée."),
      T("Naïah raconte quelque chose. Au milieu de sa phrase, elle s’interrompt, se mord la lèvre, laisse ses doigts courir sur le genou de Bellirith en remontant très lentement. Son souffle se fait court, ses paupières lourdes. C’est une scène magnifique."),
      T("Bellirith regarde le fleuve."),
      T("Naïah accentue. Elle se penche, son épaule contre celle de Bellirith, sa bouche près de son oreille, un petit gémissement à peine audible au fond de la gorge."),
      T("Bellirith regarde toujours le fleuve. Elle compte les reflets, peut-être. Elle a l’air de passer une soirée paisible."),
      Y("Tu l’as vu ?", "neutral"),
      B("Depuis le début.", "smirk"),
      Y("Pourquoi tu ne dis rien ?", "angry"),
      B("Parce que ce que tu voulais, c’était ma réaction.", "smirk"),
      T("Naïah se redresse d’un coup. Pour la première fois depuis le début de leur jeu, elle a l’air réellement prise de court. Puis elle se met à rire, et ce rire-là ne joue rien du tout."),
      Y("Oh, tu es odieuse. Tu as appris.", "laugh"),
      B("J’apprends vite quand on me fait perdre. Et j’ai senti autre chose, pendant que tu soupirais si joliment. Tu voulais que je craque. Tu le voulais vraiment.", "seductive"),
      first
        ? B("Alors je change de question. Je ne cherche plus si je peux te faire brûler, je sais à quoi ressemblent tes flammes peintes. Je veux savoir jusqu’où tu iras pour continuer à jouer avec moi.", "seductive")
        : B("Alors je change de question. Je ne cherche plus si je peux te faire brûler. Je veux savoir jusqu’où tu iras pour continuer à jouer avec moi.", "seductive"),
      T("Naïah la dévisage. Vous la voyez comprendre la question entière, ce qu’elle demande et ce qu’elle ne demande pas."),
      Y("C’est une très bonne question. Elle m’intéresse plus que toutes les autres.", "thinking"),
    ],
    choices: [
      C("cross-bn-04-name", "Demander à Naïah ce qu’elle cherche, elle, dans ce jeu.", "lucidite", [
        P("Et toi, qu’est-ce que tu y gagnes ?"),
        Y("Sa tête. Le moment où elle croit me tenir et où je bouge d’un pouce. Ce petit vertige-là.", "smirk"),
        Y("Et maintenant, savoir jusqu’où je peux la faire courir avant qu’elle s’arrête. C’est la même question qu’elle, vue de l’autre côté.", "thinking"),
        B("Tu vois ? Elle veut gagner. Ça, je le sens comme un feu de cheminée.", "teasing"),
      ], { trust: 1, relationshipEffects: { naiah: { trust: 1 } } }),
      C("cross-bn-04-rules", "Rappeler à Bellirith qu’un jeu sans règle d’arrêt n’en est plus un.", "sangFroid", [
        P("Si vous allez plus loin, il faut un mot pour arrêter. Et il faut qu’il serve."),
        B("Il sert toujours avec moi. On ne me dit jamais non deux fois, parce que je l’entends la première.", "cold"),
        Y("Le mien, ce sera « brume ». Si je le dis, tu t’arrêtes, même au milieu d’une phrase.", "neutral"),
        B("Même au milieu d’une très belle phrase. Promis.", "seductive"),
      ], { trust: 1, relationshipEffects: { naiah: { trust: 2 } } }),
      C("cross-bn-04-push", "Pousser Bellirith à poser la question franchement, sans détour.", "audace", [
        P("Demande-lui clairement. Tu sais faire."),
        B("Je sais tout faire. Je préfère d’ordinaire qu’on me supplie.", "smirk"),
        Y("Elle ne demande jamais. Elle annonce. C’est pour ça qu’on la déteste et qu’on reste.", "laugh"),
      ], { desire: 1, relationshipEffects: { naiah: { affection: 1 } } }),
    ],
    beats: [{
      intro: [
        T("La lune passe au-dessus du fleuve. Bellirith se lève, fait trois pas sur la grève et se retourne vers elles deux, vers vous aussi."),
        B("Alors je demande. Une fois, à voix haute, pour que ce soit clair entre nous. Naïah, je veux aller plus loin que la dernière fois. Plus longtemps, plus près. Je ne te promets pas d’être sage.", "seductive"),
        Y("Je veux continuer.", "neutral"),
        T("Elle l’a dit simplement. Pas de soupir, pas de cils baissés. Une décision."),
        Y("Ce que je fais pendant, c’est mon affaire. Ce que je montre, c’est mon jeu. Ce que je dis, je le pense. Si je dis brume, tu t’arrêtes.", "neutral"),
        B("Je m’arrête toujours quand on me le demande. C’est ce qui rend tout le reste si intéressant.", "seductive"),
        slept
          ? B("Et toi, {player}, tu sais déjà ce que je vaux de près. Viens, ou reste sur la barque. Les deux me conviennent, mais je préfère la première.", "seductive")
          : B("Et toi, {player} ? Viens, ou reste sur la barque. Les deux me conviennent, mais je préfère la première.", "seductive"),
      ],
      choices: [
        C(BN_LIMIT_ACCEPT, "Les rejoindre sur la grève.", "audace", [
          P("Je viens."),
          Y("Bien. Plus il y a de public, plus le jeu est drôle.", "smirk"),
          T("Bellirith tend une main à chacune et à chacun. Naïah prend la sienne la première."),
        ], { desire: 1, relationshipEffects: { naiah: { affection: 1 } } }, { launchesIntimacy: "bn-limit" }),
        C(BN_LIMIT_LATER, "Leur proposer de reprendre ce jeu une autre nuit.", "sangFroid", [
          P("Une autre nuit. Je veux y être, mais pas ce soir."),
          B("Une autre nuit, donc. Je la note sur ma liste des choses qui me sont dues.", "teasing"),
          Y("Elle a une liste. Évidemment qu’elle a une liste.", "laugh"),
        ], { trust: 1, relationshipEffects: { naiah: { trust: 1 } } }),
        C(BN_LIMIT_DECLINE, "Leur dire que vous préférez rester en dehors.", "resonance", [
          P("Je préfère rester en dehors de ça. Je vous laisse votre jeu."),
          B("Comme tu voudras. La question reste posée, avec ou sans témoin.", "thoughtful"),
          Y("Et la réponse viendra quand même. Je ne joue pas pour qu’on me regarde.", "smirk"),
          B("Si. Un peu.", "smirk"),
          Y("Un peu.", "laugh"),
        ], { trust: 1, relationshipEffects: { naiah: { trust: 1 } } }),
      ],
    }],
  };
}

/* ------------------------------------------------------------------------ */
/* Q5 · Même là ?                                                            */
/* ------------------------------------------------------------------------ */

/** Variante non intime : le joueur n’entre pas dans la chambre ; la chute arrive à travers la porte. */
const SIMULATION_OUTSIDE: DialogueLine[] = [
  T("Vous refermez la porte derrière vous et vous asseyez dans le couloir, sur la banquette des domestiques. Les appartements d’hôtes sont bien construits. Pas assez pour tout étouffer."),
  T("Il y a d’abord des rires, puis plus de rires du tout. Des voix basses. La voix de Naïah qui monte, se brise, remonte. Un long silence. Puis encore la voix de Naïah, et cette fois elle ressemble à s’y méprendre à celle de quelqu’un qui perd pied."),
  T("Vous ne savez plus très bien ce que vous entendez. Vous vous surprenez à penser que quelque chose a peut-être changé, ce soir, derrière cette porte."),
  T("La porte s’ouvre si fort qu’elle cogne contre le mur. Bellirith sort, drapée dans un drap de soie qu’elle tient d’une main, les cheveux défaits, les yeux brillants de rage."),
  B("Mais tu ne ressens toujours rien !", "angry"),
  B("Tu ris, tu gagnes, tu jubiles, tu débordes de tout ! Et de ça, pas une goutte. Pas une seule de toute la nuit !", "angry"),
  T("Elle ne vous parle pas. Elle crie vers la chambre. Et de la chambre monte un rire, énorme, incontrôlable, le rire de quelqu’un qui a tenu toute une nuit pour ce moment précis."),
  T("Naïah apparaît sur le seuil, enveloppée dans la cape de Bellirith, pliée en deux, incapable de parler pendant plusieurs secondes."),
  Y("Depuis le début. Depuis la première bougie. Tout. Tout était faux, et tu as continué !", "laugh"),
  B("J’ai continué parce que tu me l’as demandé !", "angry"),
  Y("Je sais ! C’était ça, le piège !", "laugh"),
  T("Bellirith vous voit enfin. Elle vous fixe, outrée, comme si vous aviez participé au complot depuis votre banquette."),
  B("Tu y as cru, toi aussi. Ne mens pas, je le sens d’ici.", "angry"),
  P("Un peu."),
  Y("Un peu ! Tu entends ça, Bellirith ? Un peu ! Je veux une médaille.", "laugh"),
];

function evenThere(ctx: BNSceneContext): BNSceneData {
  const limit = ctx.limitIntimacyDone, first = ctx.firstIntimacyDone;
  return {
    id: "cross-bn-05", title: "Même là ?", location: "algratal", spot: "algratal-palace-quarters", cast: ["bellirith"], music: "two-stars-night",
    intro: [
      T("Les appartements que la cour prête à Bellirith n’ont plus grand-chose de la cour. Elle a remplacé les rideaux clairs par du velours sombre, les lampes par des chandelles rouges. Le lit est immense. Elle y est allongée sur le ventre, un livre ouvert qu’elle ne lit pas."),
      B("Elle t’a donné rendez-vous ici, à toi aussi ? Bien sûr. Elle aime les salles pleines.", "teasing"),
      T("On frappe. Naïah entre sans attendre de réponse. Elle porte une robe simple, sans un seul accessoire, sans aucune trace d’illusion, à mille lieues de ses tenues de scène.", DUO),
      Y("Bonsoir. Je suis venue perdre.", "neutral"),
      B("Personne ne vient chez moi pour perdre.", "smirk"),
      Y("Moi si. Ce soir, je ne simule pas. Pas un soupir, pas une rougeur. Ce que tu verras, ce sera vrai.", "neutral"),
      T("Bellirith pose le livre. Elle se redresse sur un coude et dévisage Naïah longuement, de la tête aux pieds, puis des pieds jusqu’aux yeux."),
      B("Tu sais que je le saurai.", "seductive"),
      Y("Alors tu n’as rien à craindre. Et tu iras aussi loin que tu voudras pour vérifier.", "smirk"),
      limit
        ? Y("Plus loin qu’à la rivière. Je te laisse l’endroit que je ne donne à personne. Seulement à toi, seulement ce soir, seulement parce que c’est le pari.", "neutral")
        : first
          ? Y("Plus loin que dans les ruines. Je te laisse l’endroit que je ne donne à personne. Seulement à toi, seulement ce soir, seulement parce que c’est le pari.", "neutral")
          : Y("Jusqu’au bout. Je te laisse l’endroit que je ne donne à personne. Seulement à toi, seulement ce soir, seulement parce que c’est le pari.", "neutral"),
      T("Le silence qui suit est très différent de ceux de Bellirith. Elle ne s’en sert pas. Elle le subit."),
      B("Tu es sûre ?", "thoughtful"),
      Y("Je suis toujours sûre de ce que je choisis. Le reste, tu le liras. Mais demande-moi encore avant chaque porte, si tu veux. Je dirai oui ou non, et je le penserai.", "neutral"),
      B("Je te demanderai.", "seductive"),
      T("Alors elles se tournent vers vous. Naïah tend la main, paume ouverte, sans un clin d’œil."),
      Y("Tu restes ? J’ai besoin de quelqu’un qui regarde, ce soir. Elle t’appellera sans doute, à un moment. Si tu préfères partir, pars. Je ne t’en voudrai pas.", "neutral"),
    ],
    choices: [
      C(BN_SIMULATION_ACCEPT, "Rester avec elles cette nuit.", "audace", [
        P("Je reste."),
        Y("Merci.", "neutral"),
        T("Naïah ne sourit pas en le disant. Elle commence à défaire le premier lacet de sa robe, lentement, et Bellirith la regarde faire comme on regarde une carte qu’on vient de retourner."),
      ], { desire: 1, relationshipEffects: { naiah: { affection: 1, trust: 1 } } }, { launchesIntimacy: "bn-simulation" }),
      C(BN_SIMULATION_DECLINE, "Les laisser seules et attendre dehors.", "sangFroid", [
        P("Je vous laisse. Je serai dans le couloir."),
        Y("D’accord. Ne t’endors pas trop vite. La fin sera bruyante.", "smirk"),
        ...SIMULATION_OUTSIDE,
      ], { trust: 1, relationshipEffects: { naiah: { trust: 1 } } }),
    ],
    beats: [],
  };
}

/* ------------------------------------------------------------------------ */
/* Q6 · Quelque chose d’autre                                                */
/* ------------------------------------------------------------------------ */

function somethingElse(ctx: BNSceneContext): BNSceneData {
  const lived = ctx.simulationIntimacyDone && !ctx.simulationToldAfter;
  return {
    id: "cross-bn-06", title: "Quelque chose d’autre", location: "echo-clearing", spot: "echo-clearing", cast: ["bellirith"], music: "captive",
    intro: [
      T("Bellirith vous a donné rendez-vous à la Clairière des Échos, en plein jour, ce qui ne lui ressemble pas. Elle est assise sur une pierre plate, habillée simplement, et elle aligne sur un mouchoir les jetons d’ivoire de la Salle des Élus."),
      lived
        ? B("Tu étais là. Tu as tout vu. Tu as cru, comme moi j’aurais cru si je n’avais pas eu ce fichu don. Elle a joué la nuit entière sans une fausse note.", "thoughtful")
        : B("Tu as entendu la fin à travers une porte. C’est déjà trop, pour mon orgueil. Elle a joué la nuit entière sans une fausse note.", "thoughtful"),
      B("Et moi, j’ai passé la nuit à chercher le seul signal qui ne viendrait jamais. Comme une imbécile qui guette le facteur un jour férié.", "cold"),
      P("Tu as perdu un pari."),
      B("J’ai perdu un pari, oui. Mais en cherchant au mauvais endroit, j’ai vu tout le reste. Et le reste, chez elle, c’est immense.", "thoughtful"),
      T("Elle pousse un jeton vers vous. Puis un autre. Elle les nomme à mesure."),
      B("Elle veut gagner. Ça, c’est un feu de forge. Elle veut provoquer, c’est une étincelle qui saute partout. Elle veut contrôler la scène, elle veut être choisie, parfois. Elle veut comprendre. Et elle veut une réponse.", "thoughtful"),
      P("Une réponse à quoi ?"),
      T("Bellirith pose le dernier jeton, celui de la dernière manche, à l’écart des autres."),
      B("C’est ce que je suis venue vérifier. Elle arrive.", "cold"),
      T("Naïah traverse la clairière les mains dans les poches, l’air de quelqu’un qui a gagné une guerre et vient encaisser le tribut.", DUO),
      Y("Vous parliez de moi. Je le sens à vos têtes. Continuez, j’adore.", "smirk"),
      T("Elle s’assoit en face de Bellirith, voit les jetons, et prend aussitôt l’air le plus innocent du monde. Puis elle bat des cils, lentement, avec un petit soupir comblé."),
      B("Celle-là, tu la joues.", "smirk"),
      Y("Évidemment. Je m’entretiens.", "laugh"),
      B("Mais tu veux vraiment savoir ce que je vais dire ensuite. Ça, tu ne le joues pas.", "thoughtful"),
      T("Naïah cesse de battre des cils. Juste une seconde. Bellirith le note comme on note une carte."),
    ],
    choices: [
      C("cross-bn-06-list", "Laisser Bellirith dérouler sa liste de désirs devant Naïah.", "lucidite", [
        B("Là, tu veux gagner. Là, tu veux que je rate. Là, tu veux que {player} te regarde gagner. Là, tu veux un deuxième biscuit et tu n’oses pas.", "teasing"),
        Y("Je n’ai pas de biscuit.", "neutral"),
        B("Tu en voudrais un.", "smirk"),
        Y("…C’est vrai. Arrête ça tout de suite.", "laugh"),
      ], { trust: 1, relationshipEffects: { naiah: { affection: 1 } } }),
      C("cross-bn-06-game", "Proposer de rejouer une manche des Trois Réponses, pour voir.", "audace", [
        P("Une manche. Juste une, pour voir si elle tient toujours."),
        Y("Avec plaisir. Je n’ai pas perdu mon talent depuis la dernière fois.", "smirk"),
        B("Tu veux que je me rapproche.", "teasing"),
        Y("Retourner. Toi, tu as déjà…", "smirk"),
        B("Tu n’as pas envie que je me rapproche. Tu as envie de gagner cette manche devant {player}. Ça, c’est vrai, et ça brûle bien.", "seductive"),
        Y("Tu triches. Tu lis la mauvaise case.", "angry"),
        B("Je lis enfin la bonne.", "thoughtful"),
      ], { desire: 1, relationshipEffects: { naiah: { trust: 1 } } }),
      C("cross-bn-06-careful", "Demander à Bellirith d’y aller doucement.", "resonance", [
        P("Doucement. Elle est venue pour jouer."),
        B("Je suis toujours douce quand je cherche. C’est quand je trouve que je deviens dangereuse.", "cold"),
        Y("Tu ne trouveras rien. Je suis une porte, tu te souviens ?", "smirk"),
        B("Les portes ont des serrures, ma belle. C’est même à ça qu’on les reconnaît.", "thoughtful"),
      ], { trust: 1, relationshipEffects: { naiah: { trust: 1 } } }),
    ],
    beats: [{
      intro: [
        T("Bellirith prend le jeton écarté, celui de la dernière manche, et le pose devant Naïah sans rien dire. Naïah le regarde. Elle ne le touche pas."),
        B("Akuhn’Nabad.", "cold"),
        T("Rien qu’un nom de ville. Dit à voix basse, sans aucun effet."),
        T("Vous ne voyez rien de particulier. Naïah ne bouge pas. Mais Bellirith se raidit comme si on venait d’ouvrir une fenêtre en hiver, et ses doigts se referment sur le mouchoir."),
        B("La Reine Noire.", "cold"),
        Y("Arrête.", "angry"),
        B("Amanea.", "thoughtful"),
        T("Naïah se lève si vite que la pierre racle le sol. Elle n’a pas d’expression du tout. C’est la chose la plus inquiétante que vous lui ayez vue."),
        Y("Ne fais pas ça. Ce n’est pas un jeu.", "angry"),
        T("Elle s’en va sans courir. La brume se referme derrière elle avec une rapidité qui n’a rien de naturel."),
        B("Je sais qu’elle est sa fille. Tout Akuhn le sait. Je sais qu’on ne la regarde pas, là-bas, qu’on fait comme si elle n’existait pas. Je ne sais pas pourquoi.", "thoughtful"),
        B("Mais la dernière manche, l’autre soir. Ce signal hors de toute mesure. C’était ça. C’était elle. Tout ce qu’elle veut le plus au monde porte ce visage.", "thoughtful"),
        P("Qu’est-ce que tu vas faire ?"),
        B("Ce que je fais toujours quand je trouve un désir, trésor. Je vais lui donner de quoi manger.", "cold"),
      ],
      choices: [
        C("cross-bn-06-warn", "Lui dire que cette faim-là pourrait la mordre, elle aussi.", "sangFroid", [
          P("Celle-là pourrait te mordre."),
          B("Tout ce qui vaut la peine mord. Je préviendrai Naïah. Pas de ce que je ferai, seulement que je viendrai. Elle choisira de m’ouvrir ou non.", "thoughtful"),
          T("Le soir même, un mot arrive pour vous, dans l’écriture penchée de Naïah. « Elle veut une revanche. Clairière, demain soir. Viens. Je compte la massacrer. »"),
        ], { trust: 1 }),
        C("cross-bn-06-ask", "Demander si elle sait ce qu’elle cherche à obtenir.", "lucidite", [
          P("Et toi, tu veux quoi, au bout de ça ?"),
          B("La voir perdre pied. Une seule fois, pour de vrai. Je l’ai cherché partout dans son corps, je le trouve ailleurs. C’est vexant et c’est magnifique.", "seductive"),
          T("Le soir même, un mot arrive pour vous, dans l’écriture penchée de Naïah. « Elle veut une revanche. Clairière, demain soir. Viens. Je compte la massacrer. »"),
        ], { desire: 1 }),
        C("cross-bn-06-stay", "Ne rien dire et rester assis avec elle un moment.", "resonance", [
          T("Vous restez. Bellirith remet les jetons dans leur bourse un à un, sauf le dernier, qu’elle garde dans sa main."),
          B("Tu ne me fais pas la leçon. J’apprécie. Je ne l’aurais pas écoutée, mais j’apprécie.", "thoughtful"),
          T("Le soir même, un mot arrive pour vous, dans l’écriture penchée de Naïah. « Elle veut une revanche. Clairière, demain soir. Viens. Je compte la massacrer. »"),
        ], { trust: 1, affection: 1 }),
      ],
    }],
  };
}

const BUILDERS = [anomaly, simulates, threeAnswers, howFar, evenThere, somethingElse] as const;

export function bnStageScene(stage: number, ctx: BNSceneContext): BNSceneData | undefined {
  const builder = BUILDERS[stage];
  return builder ? builder(ctx) : undefined;
}

/** Toutes les scènes de dialogue, pour les validateurs (toutes variantes d’historique). */
export function allBNStageScenes(): BNSceneData[] {
  const contexts: BNSceneContext[] = [
    { flags: [] },
    { flags: [BN_BELLIRITH_SLEPT, BN_BELLIRITH_FAVORITE], firstIntimacyDone: true, limitIntimacyDone: true, simulationIntimacyDone: true },
    { flags: [BN_BELLIRITH_RESISTED], firstIntimacyDone: false, simulationToldAfter: true },
  ];
  return contexts.flatMap((ctx) => BUILDERS.map((build) => build(ctx)));
}

export type BNChoiceList = ChoiceData[];
