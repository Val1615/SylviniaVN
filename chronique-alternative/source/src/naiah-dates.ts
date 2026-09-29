import type { ChoiceData, DialogueLine, Effects, StatKey } from "./game-data";
import type { DateScene } from "./date-scenes";

const N = (text: string): DialogueLine => ({ speaker: "Narration", text });
const A = (text: string, mood = "smirk"): DialogueLine => ({ speaker: "Naïah", text, mood });
const P = (text: string): DialogueLine => ({ speaker: "{player}", text });
const Q = (id: string, text: string, stat: StatKey, response: DialogueLine[], effects: Effects = {}): ChoiceData => ({
  id, text, stat, response, dateOutcome: "great",
  effects: { ...effects, stats: { ...(effects.stats || {}), [stat]: 1 } },
});

/** Les deux rendez-vous publics sont indépendants et conservent leurs IDs historiques. */
export const NAIAH_DATES: DateScene[] = [
  {
    id: "date-naiah-sanctuary", character: "naiah", title: "Le jeu des apparences", type: "Jeu de piste impossible",
    description: "Traverser une forêt qui triche avec ses propres règles, reconnaître ses faux chemins et découvrir ce que Naïah observe derrière la farce.",
    location: "forbidden", spot: "forbidden-sanctuary", period: "apres-midi", unlockStage: 5, minAffection: 32, minTrust: 32, minDesire: 24, mood: "laugh",
    intro: [
      N("Un panneau violet attend au bord de la Forêt Interdite : « RENDEZ-VOUS TRÈS OFFICIEL — chaussures facultatives, méfiance obligatoire ». Trois flèches indiquent trois sentiers différents."),
      A("Tu es à l'heure. C'est dommage, j'avais préparé un reproche magnifique.", "smirk"),
      N("Naïah se balance sur une branche. Deux copies occupent les arbres voisins ; l'une bâille, l'autre tient une clochette beaucoup trop grande."),
      P("Laquelle de vous m'a invité·e ?"),
      A("Excellente première erreur. Tu supposes qu'une seule de nous a eu l'idée.", "laugh"),
      N("Elle saute au sol. Les copies l'imitent avec un léger retard, puis applaudissent sa réception comme un jury sévère."),
      A("Nous allons jouer au Jeu des apparences. Le premier qui atteint la cérémonie gagne. Le second gagne aussi, mais moins élégamment."),
      P("Où est la cérémonie ?"),
      A("À la fin. J'ignorais que tu aurais besoin de ce niveau de détail."),
      N("Une ombre à six pattes sort d'un buisson avec un plateau de biscuits et une pancarte : « monstre dangereux, pourboire apprécié ». Naïah lui prend deux biscuits et lui en rend trois."),
      A("Règle une : les panneaux mentent, sauf celui qui nie mentir. Règle deux : les arbres participent. Règle trois : tu peux inventer une règle si elle me contrarie suffisamment."),
      N("Derrière la plaisanterie, son regard suit vos mains, le chemin que vous vérifiez et le temps que vous mettez à décider. Cette invitation est aussi une expérience, simplement une expérience qui distribue des biscuits."),
      A("Tu peux demander un indice, accuser la forêt ou tricher avant moi. Mais choisis vite : le sentier de gauche vient de devenir le plafond.", "laugh"),
    ],
    choices: [
      Q("naiah-app-enter-invent", "Décréter que toute règle doit d'abord être démontrée par son autrice.", "audace", [P("Nouvelle règle : tu testes chaque règle avant moi."), N("Naïah recalcule le jeu, puis saute sur le sentier de gauche. Il bascule réellement à la verticale et la dépose dans un buisson."), A("Acceptée. Tu viens de rendre ma forêt dangereusement intéressante.", "laugh")], { affection: 5, trust: 3, desire: 2 }),
      Q("naiah-app-enter-watch", "Observer quelle copie regarde le vrai chemin avant de bouger.", "lucidite", [N("La copie à la clochette surveille vos pieds. Celle qui bâille surveille Naïah. La véritable Naïah jette un regard vers une racine nue derrière vous."), P("Je prends le chemin que tu essaies de ne pas regarder."), A("C'est odieux. J'avais travaillé mon indifférence.")], { affection: 3, trust: 5 }),
      Q("naiah-app-enter-trees", "Saluer les arbres et leur demander de trahir Naïah.", "resonance", [N("Vous vous inclinez devant le plus vieux tronc. Trois branches se tournent aussitôt vers Naïah comme des témoins trop heureux de parler."), A("Je vous ai donné une conscience et voilà comment vous me remerciez ? Très bien. Les arbres t'aiment déjà. Leur jugement reste discutable.", "laugh")], { affection: 4, trust: 4, desire: 2 }),
    ],
    intimacySetting: {
      background: "/assets/backgrounds/forbidden_forest.webp", replaceProfile: true,
      opening: ["La fausse cérémonie s'achève, mais le sentier refuse encore de vous rendre à l'entrée. Naïah garde le ruban du vainqueur et propose de rester dans ce repli de forêt où les règles peuvent enfin être dites à voix haute."],
      closing: ["Lorsque vous retrouvez le vrai sentier, un dernier panneau apparaît : « PERSONNE N'A GAGNÉ ». Naïah le retourne ; l'autre face porte vos deux noms."],
    },
  },
  {
    id: "date-naiah-akuhn", character: "naiah", title: "Au bord de son royaume", type: "Belvédère et jeu de stratégie",
    description: "Observer Akuhn’Nabad depuis les ruines, déplacer une ville miniature et suivre Naïah là où sa clairvoyance cesse d'être confortable.",
    location: "forbidden", spot: "forbidden-ruins", period: "soirée", unlockStage: 5, minAffection: 34, minTrust: 34, minDesire: 24, mood: "thinking",
    intro: [
      N("Au sommet des ruines, Akuhn’Nabad tient dans l'ouverture d'une arche brisée. Ses tours vertes paraissent proches ; le ravin et la forêt en disent autrement."),
      N("Naïah a étalé sur le parapet des cailloux, des noyaux de fruits et trois figurines de soldats. Une quatrième porte une cape beaucoup trop raide."),
      A("Voici la ville. Voici ses portes. Voici Allenna, qui pense très fort qu'une mâchoire serrée est une stratégie complète.", "smirk"),
      N("Elle redresse les épaules, abaisse la voix et imite sa sœur avec une précision assez tendre pour rendre la moquerie suspecte."),
      A("« Naïah, cesse de déplacer mes patrouilles. Naïah, rends-moi ce rempart. Naïah, une chèvre n'est pas une unité de siège. »", "laugh"),
      P("La chèvre est une unité de siège ?"),
      A("Celle-ci a pris une cuisine en moins d'une minute. Respecte son dossier militaire."),
      N("Sans regarder la vraie cité, Naïah déplace deux noyaux. Au loin, une relève quitte précisément la porte orientale et une seconde lanterne s'allume sur les hauteurs."),
      A("Ils ont raccourci la ronde de six minutes. Une charrette bloque encore le passage bas, donc le remplacement monte par l'ancien escalier. S'il pleuvait, ils perdraient neuf hommes avant d'atteindre le mur."),
      N("La fantaisie vient de révéler qu'elle habille un esprit qui compte tout. Naïah connaît les angles morts, les réserves et les habitudes de la ville sans avoir besoin d'y entrer."),
      A("Nous allons prendre Akuhn’Nabad avec quatre cailloux, une chèvre et aucune conséquence réelle. Ensuite, tu me diras pourquoi tu crois que je t'ai amené·e ici."),
      P("Et si ma réponse ne te plaît pas ?"),
      A("Je gagnerai plus fort. C'est une méthode politique très ancienne.", "smirk"),
    ],
    choices: [
      Q("naiah-edge-enter-map", "Lui demander quelle personne elle veut faire sortir avant de conquérir quoi que ce soit.", "resonance", [N("Le noyau qu'elle faisait tourner s'immobilise. Naïah désigne une petite porte latérale, loin des figurines."), A("La cuisinière de nuit. Elle nourrit les gardes et déteste les discours. Dans mon plan, elle obtient l'auberge du sud et personne ne brûle sa réserve.", "thinking"), N("Elle vous confie la chèvre comme si cette réponse n'avait rien changé.")], { affection: 4, trust: 5 }),
      Q("naiah-edge-enter-flank", "Chercher le défaut de son plan au lieu de l'admirer.", "lucidite", [P("Le vent pousse ta fumée vers l'ouest. La tour nord verra l'approche."), N("Naïah suit votre raisonnement, déplace un caillou et sourit comme si vous veniez de lui offrir quelque chose de rare."), A("Oui. Ils verront le leurre trop tôt. Cela oblige à sacrifier la charrette. La chèvre dépose une plainte officielle.")], { affection: 3, trust: 6 }),
      Q("naiah-edge-enter-goat", "Promouvoir la chèvre au commandement et exiger que Naïah défende ce choix.", "audace", [N("Vous posez la chèvre sur la plus haute pierre. Naïah improvise un discours de couronnement d'une solennité irréprochable."), A("Elle gouvernera moins mal que la moitié du conseil et mangera l'autre moitié. Ta proposition est inquiétante de réalisme.", "laugh")], { affection: 5, trust: 2, desire: 2 }),
    ],
    intimacySetting: {
      background: "/assets/backgrounds/akuhn.webp", replaceProfile: true,
      opening: ["La partie se termine sans reddition. Naïah laisse les cailloux en place et s'assied sous l'arche, assez près pour que la chaleur compte davantage que les lumières lointaines de la ville."],
      closing: ["Avant de quitter le belvédère, Naïah remet la chèvre au centre du parapet. « Elle garde le royaume », décrète-t-elle, puis elle prend votre main pour redescendre."],
    },
  },
];

export type NaiahDateBeat = { intro: DialogueLine[]; choices: ChoiceData[] };

const APPEARANCE_BEATS: NaiahDateBeat[] = [
  {
    intro: [N("Le premier sentier se replie derrière vous comme un ruban. Six panneaux donnent six directions ; les fautes changent d'une pancarte à l'autre."), A("Une seule indication est utile. Deux sont vraies. Trois sont vexantes. La sixième a été écrite par un arbre qui se croit poète."), N("Une racine tapote votre botte, impatiente de participer.")],
    choices: [
      Q("naiah-app-sign-error", "Suivre la faute que Naïah ne ferait jamais exprès.", "lucidite", [N("Le panneau « chemin abslument sûr » porte une erreur trop plate pour sa mise en scène. Une mousse fraîche indique le passage réellement utilisé."), A("Tu as repéré l'ennuyeuse erreur authentique au milieu de mes merveilleuses fausses erreurs. J'hésite entre fierté et représailles.", "thinking")], { trust: 4, affection: 2 }),
      Q("naiah-app-sign-tree", "Laisser la racine voter et accepter son verdict.", "resonance", [N("La racine choisit le panneau poétique. Il mène dans une haie, qui s'ouvre pourtant quand vous remerciez l'arbre."), A("Trahison végétale confirmée. Tu remportes trois points de politesse sylvestre, monnaie parfaitement inutile.", "laugh")], { affection: 4, trust: 3 }),
      Q("naiah-app-sign-back", "Partir dans la direction opposée à toutes les flèches.", "audace", [N("Le sentier recule avec vous, essaie de vous replacer devant les panneaux, puis renonce dans un bruit de feuilles froissées."), A("Tu viens de contrarier une route enchantée par pure mauvaise foi. Notre sortie est officiellement romantique.", "smirk")], { affection: 4, trust: 2, desire: 3 }),
    ],
  },
  {
    intro: [N("La clairière suivante contient cinq Naïah. Elles adoptent votre posture avec un temps de retard, jusqu'à l'inclinaison de votre tête."), A("Épreuve de reconnaissance ! Aucun indice physique, aucune magie détectable et interdiction d'utiliser le mot ‘vraie’. Je trouve ce dernier point très philosophique."), N("Chaque copie attend votre décision ; l'une sourit déjà comme si elle connaissait la réponse.")],
    choices: [
      Q("naiah-app-double-question", "Poser une question dont Naïah refuserait la prémisse.", "lucidite", [P("Laquelle obéira gentiment si je la choisis ?"), N("Quatre copies lèvent la main. La cinquième éclate de rire et renverse le décor."), A("Tu m'as trouvée en m'insultant avec méthode. C'est presque élégant.", "laugh")], { trust: 4, affection: 3 }),
      Q("naiah-app-double-all", "Inviter les cinq à continuer et refuser de transformer sa présence en devinette.", "sangFroid", [P("Je continue avec les cinq. Celle qui veut être près de moi n'a pas besoin d'être désignée gagnante."), N("Quatre copies se dissolvent ; Naïah reste, brièvement prise à son propre piège."), A("Réponse non homologuée. Très efficace. Je vais prétendre qu'elle me contrarie.", "thinking")], { trust: 5, affection: 4, desire: 2 }),
      Q("naiah-app-double-copy", "Imiter à votre tour la copie la plus insolente.", "audace", [N("Vous reproduisez son sourire ; elle amplifie la pose, vous aussi. Les autres abandonnent pour applaudir le duel."), A("C'est moi. Aucun simulacre n'aurait osé devenir aussi ridicule devant moi.", "laugh")], { affection: 5, desire: 3 }),
    ],
  },
  {
    intro: [N("Le dernier rideau d'arbres s'écarte sur une estrade de racines. Des ombres en robe de cérémonie agitent des mouchoirs."), A("Résultat officiel : j'ai gagné de deux cent sept points. Tu peux contester devant un tribunal composé de moi, de cet arbre et d'une grenouille absente."), N("Elle tient pourtant deux rubans violets derrière son dos. Son regard passe de votre visage à l'espace libre près d'elle.")],
    choices: [
      Q("naiah-app-end-steal", "Voler le second ruban et couronner la forêt entière avec elle.", "audace", [N("Vous nouez le ruban autour de son poignet puis du vôtre. Les ombres lancent des feuilles comme du riz."), A("Un coup d'État textile. Je suis furieuse et très bien assortie.", "laugh"), N("Vous saluez ensemble vos sujets végétaux sans défaire le lien.")], { affection: 5, trust: 3, desire: 5 }),
      Q("naiah-app-end-kiss", "Réclamer votre récompense sans accepter son score truqué.", "resonance", [P("Je refuse le score. Je réclame tout de même la récompense."), N("Naïah vous remet la couronne et se retrouve interrompue par un baiser. Les ombres huent le manque de procédure."), A("Dossier recevable. Audience ajournée jusqu'à ce que je décide si tu triches mieux que moi.", "smirk")], { affection: 5, trust: 4, desire: 6 }),
      Q("naiah-app-end-rest", "Vous asseoir sur l'estrade et regarder le tribunal se disputer.", "sangFroid", [N("Naïah vient près de vous et fait débattre l'arbre et la grenouille invisible avec deux voix scandaleusement sérieuses."), A("Verdict : personne ne rentre avant que le soleil touche ce rocher. La défense accepte-t-elle ?", "thinking"), N("Vous restez côte à côte sans qu'elle invente une épreuve supplémentaire.")], { affection: 4, trust: 5, desire: 2 }),
    ],
  },
];

const KINGDOM_BEATS: NaiahDateBeat[] = [
  {
    intro: [N("Naïah répartit les pièces. Elle conserve portes et réserves ; vous recevez les guetteurs, la chèvre et un noyau de prune nommé ministre des Affaires inutiles."), A("Objectif : entrer sans bataille, sortir sans prisonnier et vexer au moins un dignitaire. La dernière condition est négociable contre une pâtisserie."), N("La chèvre renverse aussitôt le noyau-ministre. Naïah consigne l'incident avec le sérieux d'une chroniqueuse de guerre.")],
    choices: [
      Q("naiah-edge-gate-time", "Exploiter l'écart de six minutes entre les deux relèves.", "lucidite", [N("Vous placez la charrette sous la tour au moment où la ronde basse quitte son poste. Naïah confirme l'angle mort."), A("Propre, discret, presque raisonnable. J'ajoute une fanfare lointaine pour éviter que le plan devienne triste.")], { trust: 5, affection: 2 }),
      Q("naiah-edge-gate-goat", "Envoyer la chèvre détourner la cuisine pendant que la porte s'ouvre.", "audace", [N("La figurine traverse le plan, renverse le ministre et occupe la cuisine imaginaire."), A("Sept hommes, deux marmitons et Allenna elle-même si quelqu'un touche au pain. Diversion terrifiante.", "laugh")], { affection: 5, trust: 2 }),
      Q("naiah-edge-gate-people", "Transformer les habitants en alliés plutôt qu'en éléments du décor.", "resonance", [P("Si les cuisiniers ouvrent la porte, aucun guetteur n'a besoin d'être trompé."), N("Naïah ajoute des graines autour de la cuisine et retire trois soldats."), A("Tu viens de supprimer la partie spectaculaire et de sauver tout le quartier. C'est agaçant. Garde cette idée.", "thinking")], { affection: 3, trust: 5 }),
    ],
  },
  {
    intro: [N("Le plan a réussi. Naïah devrait célébrer ; elle observe la porte réelle, où une patrouille change comme annoncé."), A("Ils n'ont toujours pas réparé l'escalier. Allenna le sait. Elle préfère doubler les rondes plutôt que fermer le passage trois jours."), P("Tu pourrais le lui dire."), A("Quelle idée neuve. J'entre, je donne un conseil, tout le monde oublie le bannissement et nous partageons une soupe familiale ?", "angry"), N("La réplique frappe plus fort que la question. Son menton se relève comme si vous aviez porté le premier coup.")],
    choices: [
      Q("naiah-edge-hurt-boundary", "Nommer le coup sans exiger d'excuse immédiate.", "sangFroid", [P("Tu savais que ça ferait mal. Je reste, mais je ne ferai pas semblant que c'était seulement une plaisanterie."), N("Le noyau qu'elle tenait roule jusqu'à vous."), A("Oui. Je voulais que la question recule. Elle a emporté la personne avec. Mauvais rendement.", "thinking")], { trust: 6, affection: 2 }),
      Q("naiah-edge-hurt-counter", "Lui rendre une vérité aussi nette, sans cruauté supplémentaire.", "audace", [P("Tu connais chaque défaut de la ville et aucun chemin simple pour lui manquer. C'est pour ça que tu m'as invité·e."), N("Sa première réponse, brillante et blessante, se forme puis disparaît."), A("J'espérais aussi que tu admirerais la chèvre. Ne réduis pas mes motivations.", "smirk")], { affection: 4, trust: 4 }),
      Q("naiah-edge-hurt-space", "Reculer et lui laisser le choix de rétablir la distance.", "resonance", [N("Vous quittez le parapet sans descendre. Naïah regarde l'espace, puis traverse elle-même la moitié du chemin."), A("Je ne retire pas ce que j'ai dit sur la soupe. Je retire l'usage que j'en ai fait contre toi.", "thinking"), N("Elle vous tend la figurine d'Allenna, geste minuscule et délibéré.")], { trust: 6, affection: 3 }),
    ],
  },
  {
    intro: [N("La partie reprend autrement. Naïah renverse la figurine au manteau raide et attire dans une fiole un seul éclat vert de la cité."), A("Trophée légalement discutable. Il ne manque à personne et éclaire mieux ici. J'attends ton jugement moral."), N("Elle pose la fiole au milieu, assez près pour que vos mains puissent la prendre ensemble.")],
    choices: [
      Q("naiah-edge-end-share", "Garder la lumière entre vos deux mains sans décider à qui elle appartient.", "resonance", [N("Vos paumes entourent ensemble le verre. L'éclat dessine deux ombres sur l'arche."), A("Une propriété partagée, révocable et transportable. Le conseil va détester.", "smirk"), N("Elle appuie sa tempe contre la vôtre et observe la ville à travers la fiole.")], { affection: 5, trust: 5, desire: 4 }),
      Q("naiah-edge-end-kiss", "Déposer la fiole et lui demander clairement si vous pouvez l'embrasser.", "sangFroid", [P("J'ai envie de t'embrasser. Pas pour gagner la partie."), N("Naïah examine votre visage comme une fortification, puis pose deux doigts sur vos lèvres."), A("Très bien. Mais si c'est décevant, la chèvre reprend le commandement.", "smirk"), N("Elle vous embrasse la première. La seconde fois, son rire reste pris entre vos bouches.")], { affection: 5, trust: 4, desire: 6 }),
      Q("naiah-edge-end-return", "Rendre l'éclat à la ville et emporter seulement le plan de cailloux.", "lucidite", [N("La lumière rejoint les murailles ; Naïah vous confie la chèvre et le noyau-ministre."), A("Tu refuses mon vol mais acceptes mes institutions. Décision politiquement catastrophique. J'aimerais recommencer bientôt.", "laugh"), N("Vous redescendez avec le royaume miniature dans les poches.")], { affection: 4, trust: 5, desire: 2 }),
    ],
  },
];

export function naiahDateBeat(sceneId: string, round: number): NaiahDateBeat | undefined {
  if (sceneId === "date-naiah-sanctuary") return APPEARANCE_BEATS[round];
  if (sceneId === "date-naiah-akuhn") return KINGDOM_BEATS[round];
  return undefined;
}
