import type { ChoiceData, DialogueLine, Effects, StatKey } from "./game-data";
import type { DateScene } from "./date-scenes";

const N = (text: string): DialogueLine => ({ speaker: "Narration", text });
const H = (text: string, mood = "soft"): DialogueLine => ({ speaker: "Hylee", text, mood });
const P = (text: string): DialogueLine => ({ speaker: "{player}", text });
const Q = (id: string, text: string, stat: StatKey, response: DialogueLine[], effects: Effects = {}): ChoiceData => ({ id, text, stat, response, effects, dateOutcome: "good" });

export const HYLEE_DATES: DateScene[] = [
  {
    id: "date-hylee-glade", character: "hylee", title: "Un pique-nique sous la neige d’été",
    type: "Pique-nique et sculptures", description: "Un panier, de petites sculptures et une neige préparée par Hylee pour le plaisir d’être là.",
    location: "miraldas", spot: "miraldas-hylee-glade", period: "apres-midi", unlockStage: 5, minAffection: 34, minTrust: 34, minDesire: 24, mood: "teasing",
    intro: [
      N("Hylee vous attend au départ du sentier avec un panier et deux cuillères coincées dans la même poche. Elle vous donne le panier pour pouvoir dégager ses doigts."),
      H("Ne regarde pas dedans tout de suite. Il y a une surprise. Et un torchon qui n’a pas eu le temps de sécher." , "teasing"),
      N("Dans la clairière, elle installe la couverture loin de l’espace d’entraînement. Le bâton reste posé au pied d’un arbre. Elle écarte une assiette et vérifie le terrain du plat de la main."),
      H("Là. Tu peux t’asseoir."),
      N("Hylee lève les doigts. Quelques flocons apparaissent au-dessus de la couverture et descendent dans le soleil. Ils fondent avant de toucher le pain."),
      P("Tu as préparé de la neige ?"),
      H("J’ai essayé hier. Très peu, juste là. Pas besoin de couvrir toute la forêt."),
      N("Elle en détourne un de votre verre. Le flocon fond sur son poignet, et elle s’essuie sur le fameux torchon encore humide."),
      H("C’était mieux dans ma tête. Mais attends de voir la suite." , "teasing"),
      N("Sous une serviette, trois blocs de glace reposent dans une assiette creuse. Hylee a apporté une pointe en bois, des feuilles, des baies et un couteau émoussé."),
      H("J’ai fait les blocs. Toi, tu peux tailler, poser des choses dessus, me demander de changer une forme. Et manger les baies, mais pas toutes."),
      P("C’est un exercice ?"),
      H("Non. On mange, on essaie de faire quelque chose de joli et, si ça rate, on dit que c’était prévu."),
      N("Elle s’assied face à vous. Le premier bloc penche déjà dans son assiette."),
      H("Tu restes de ce côté ou tu viens à côté de moi ?"),
    ],
    choices: [
      Q("hyg-friendly", "Installer votre atelier face au sien et partager le repas.", "lucidite", [N("Vous répartissez les outils au milieu. Hylee vous donne la moitié du pain avant de commencer à manger la sienne."), H("Très bien. On pourra comparer sans espionner." , "teasing")], { affection: 5, trust: 5 }),
      Q("hyg-close", "Vous asseoir près d’elle, épaule contre épaule.", "audace", [N("Hylee décale son assiette pour vous faire une place. Votre épaule touche la sienne ; elle s’y appuie au moment de vous tendre la cuillère."), H("C’est pratique. Maintenant, si je me trompe, je peux accuser ton coude." , "teasing")], { affection: 5, trust: 2, desire: 5 }),
    ],
    // Le catalogue intime antérieur reste inchangé. Le raccord conduit au
    // vrai intérieur qu'il décrit ; aucune fausse version spécifique n'est créée.
    intimacySetting: {
      background: "/assets/backgrounds/miraldas_quarters.webp",
      opening: ["Après avoir rangé la couverture et les outils, vous reprenez ensemble le chemin de Mir’Aldas. Hylee vous propose de rester avec elle dans ses quartiers ; vous la suivez jusque dans la chambre."],
      closing: ["Le panier repose au pied de la porte. Hylee en tire les derniers fruits et les pose entre vous."],
    },
  },
  {
    id: "date-hylee-lake", character: "hylee", title: "Le lac qui n’existait pas hier",
    type: "Patinage et détour", description: "Découvrir la petite étendue d’eau qu’Hylee a préparée à la lisière de Mir’Aldas, et essayer de tenir debout dessus.",
    location: "miraldas", spot: "miraldas-lake", period: "apres-midi", unlockStage: 5, minAffection: 36, minTrust: 34, minDesire: 24, mood: "teasing",
    intro: [
      N("Hylee vous conduit au-delà du sentier habituel. Un mince barrage de pierres retient l’eau d’un ruisseau dans une cuvette naturelle. Des herbes dépassent encore près des bords."),
      H("Hier, c’était juste mouillé. J’ai aidé un peu."),
      P("Un peu ?"),
      N("Elle vous montre le passage qu’elle a laissé à l’eau. Puis elle s’accroupit au bord et étend une couche de glace sur la partie peu profonde, loin du courant."),
      N("La surface devient mate. Hylee la vérifie en avançant pas à pas, fait disparaître une bosse et revient chercher deux paires de lames à fixer sous les bottes."),
      H("Le lac tient. Les lames sont empruntées. Je sais les attacher."),
      P("Et patiner ?"),
      H("Je vais apprendre vite." , "determined"),
      N("Elle pose un pied sur la glace. Le second la dépasse aussitôt. Hylee agite les bras et revient s’asseoir dans l’herbe."),
      H("D’abord, je vais apprendre à rester sur place." , "surprised"),
      N("Vous vous asseyez près d’elle pour attacher vos lames. Hylee serre vos boucles, les vérifie, puis vous tend la main pour se relever."),
      N("Vous avancez votre poids sur la surface. La glace tient. Hylee vous rejoint, les genoux déjà fléchis et toute son attention sur ses pieds."),
      H("Si je te serre trop, dis-le. J’ai les mains moins courageuses que le reste."),
    ],
    choices: [
      Q("hyl-friendly", "Préparer ensemble une courte boucle près du bord.", "lucidite", [N("Vous indiquez deux pierres comme repères. Hylee ajoute une trace blanche au bord de la piste, puis cesse de regarder derrière elle."), H("D’accord. On en fait le tour. Debout, si possible.")], { affection: 5, trust: 5 }),
      Q("hyl-close", "Garder sa main et proposer d’apprendre ensemble.", "audace", [P("On commence comme ça ?"), N("Hylee regarde votre main qui n’a pas lâché la sienne. Elle entrelace vos doigts et ramène vos bras entre vous."), H("Oui. Et si je tombe, j’essaierai de te prévenir avant." , "teasing")], { affection: 5, trust: 3, desire: 5 }),
    ],
    intimacySetting: {
      background: "/assets/backgrounds/miraldas_quarters.webp",
      opening: ["Hylee retire vos lames, ouvre le barrage pour que le ruisseau retrouve son cours et vous accompagne jusqu’à Mir’Aldas. Une fois le matériel rendu, elle vous invite dans ses quartiers. Vous entrez ensemble dans la chambre."],
      closing: ["Vos bottes sèchent près de la porte. Hylee les regarde, rit tout bas et se rapproche de vous."],
    },
  },
];

export type HyleeDateBeat = { intro: DialogueLine[]; choices: ChoiceData[] };

/** Trois tours joués, sans temps réel, sans réponse morale cachée ni score
 * intime. Les choix matériels modifient le résultat ; les chutes ne punissent
 * ni l'affection, ni le désir. Toute magie appartient explicitement à Hylee. */
export function hyleeDateBeat(dateId: string, round: number, picks: readonly string[] = []): HyleeDateBeat | undefined {
  if (dateId === "date-hylee-glade") {
    if (round === 0) return {
      intro: [N("Hylee tourne l’assiette vers vous. Les trois blocs ont des tailles différentes. Elle cale le plus petit avec une feuille pour l’empêcher de glisser."), H("On fait quoi ? Quelque chose qui ressemble à ce qu’on annonce, si possible.", "teasing")],
      choices: [
        Q("hyg-owl", "Sculpter une chouette ronde, avec deux baies pour les yeux.", "lucidite", [N("Vous taillez une base large. Hylee arrondit le haut du bloc et attend que vous marquiez l’emplacement du bec."), H("Celle-là ne mangera pas le pain. J’en suis presque sûre.", "teasing")], { affection: 2, trust: 2 }),
        Q("hyg-crown", "Fabriquer une couronne beaucoup trop grande.", "audace", [N("Vous posez les morceaux en cercle. Hylee joint les extrémités et prolonge une pointe qui s’était cassée."), H("Elle va glisser jusqu’à mon nez. C’est bien ce que tu voulais ?", "teasing")], { affection: 3 }),
        Q("hyg-bridge", "Construire un pont miniature entre deux morceaux.", "resonance", [N("Vous mesurez l’écart avec la pointe en bois. Hylee produit une arche que vous posez manuellement sur les deux appuis. Vous repérez l’endroit où elle penche."), H("Je l’épaissis ici ? Attends, enlève d’abord ton doigt.")], { affection: 2, trust: 3 }),
      ],
    };
    if (round === 1) return {
      intro: [N("Le soleil atteint l’assiette. Une partie de votre construction s’affaisse avant que vous ayez terminé la décoration. Hylee place sa main près du bord, puis s’arrête pour regarder ce que vous allez faire."), H("Je peux la refroidir. Ou on sauve autre chose avec les morceaux.")],
      choices: [
        Q("hyg-repair", "Tenir les pièces à l’ombre pendant qu’elle reprend les joints.", "sangFroid", [N("Vous interposez le couvercle du panier entre le soleil et l’assiette. Hylee reprend les joints un à un. Vous inclinez les pièces avec la cuillère lorsqu’elle vous l’indique."), H("Ne bouge plus… Voilà. Tu peux relâcher."), N("La construction tient, plus épaisse d’un côté.")], { trust: 3, affection: 2 }),
        Q("hyg-melt", "Assumer l’effondrement et transformer les morceaux en animal aplati.", "audace", [N("Vous rapprochez les morceaux avec la cuillère et plantez deux feuilles sur le dessus. Hylee observe longuement le résultat."), H("C’est un lapin ?"), P("Il se repose."), N("Elle ajoute une petite queue de givre et se met à rire avant de l’avoir terminée.")], { affection: 4 }),
        Q("hyg-open", "Retirer le morceau fragile et garder une forme ouverte.", "lucidite", [N("Vous détachez la partie qui pèse sur l’ensemble. Hylee lisse la cassure, puis vous passe une feuille pour couvrir le bord."), H("Je n’aurais pas essayé comme ça."), N("Elle penche la tête des deux côtés et déplace une baie pour équilibrer la décoration.")], { affection: 2, trust: 3 }),
      ],
    };
    if (round === 2) return {
      intro: [
        ...(picks.includes("hyg-melt")
          ? [N("Votre animal aplati s’étale au milieu des feuilles. Hylee insiste pour lui donner une place d’honneur, devant le pain."), H("Il aura vécu très intensément.", "teasing")]
          : picks.includes("hyg-crown")
            ? [N("Hylee essaye la couronne en la tenant des deux mains. Une goutte descend sur son nez. Elle vous la confie aussitôt pour que vous subissiez le même sort."), H("À ton tour. Je veux voir si elle te va mieux.", "teasing")]
            : picks.includes("hyg-owl")
              ? [N("La chouette penche dans son assiette, mais ses deux yeux tiennent. Hylee place une miette devant son bec et attend de voir si vous protestez.")]
              : [N("Vous faites passer une baie sous le pont. Hylee se penche au niveau de l’assiette et la rattrape de l’autre côté avec sa cuillère.")]),
        N("Le repas s’achève sous les derniers flocons. Hylee arrête la neige avant de ranger les outils ; la sculpture fondra dans l’assiette."),
        H("Tu veux encore rester un moment ?"),
      ],
      choices: [
        Q("hyg-end-friends", "Vous allonger à côté de la couverture et bavarder jusqu’au départ.", "sangFroid", [N("Hylee s’allonge dans l’herbe, les mains derrière la tête. Vous cherchez à quel oiseau appartient un cri lointain ; elle change trois fois d’avis."), H("On demandera à Medig. Elle aura sûrement une opinion."), N("Vous repartez ensemble après avoir ramassé tous les outils.")], { affection: 5, trust: 3 }),
        Q("hyg-end-kiss", "L’inviter à se rapprocher pour un baiser.", "audace", [P("Oui. Viens là."), N("Hylee pose la dernière cuillère, vient contre vous et vous embrasse sans attendre que vous trouviez autre chose à dire. Elle sourit au second baiser."), H("Les outils peuvent attendre deux minutes."), N("Vous finissez tout de même par ranger le panier avant de reprendre le chemin.")], { affection: 4, desire: 7 }),
      ],
    };
  }
  if (dateId === "date-hylee-lake") {
    if (round === 0) return {
      intro: [N("La première glissade vous emmène plus loin que prévu. Hylee reste accrochée à votre main, puis s’aperçoit qu’elle oublie de pousser."), H("Tu fais tout le chemin. Attends, je vais essayer.", "determined")],
      choices: [
        Q("hyl-small", "Avancer par petits pas, les genoux souples.", "sangFroid", [N("Vous limitez les poussées. Hylee vous imite et trouve deux glissades régulières. Elle n’ose rire qu’une fois près du bord."), H("Ça y est. Je ne marche presque plus.")], { trust: 3, affection: 2 }),
        Q("hyl-speed", "Prendre de l’élan jusqu’au premier repère.", "audace", [N("Vous poussez plus fort. Hylee vous suit, crie de joie puis découvre le repère beaucoup trop près. Vous terminez assis dans la neige du bord."), H("Il nous manque une étape. Celle où on s’arrête.", "surprised"), N("Elle rit en époussetant vos manches et vous aide à vous relever.")], { affection: 4, trust: 1 }),
        Q("hyl-side", "Faire un essai côte à côte en comptant les poussées.", "resonance", [N("Vous comptez à voix basse. Hylee adapte ses jambes au rythme, sans toucher à la surface. Vos trajectoires cessent de se croiser."), H("Encore trois. Non, attends, j’en ai fait quatre. Ne recompte pas tout !", "teasing")], { affection: 2, trust: 3 }),
      ],
    };
    if (round === 1) return {
      intro: [N("Hylee place une pomme de pin sur le bord pour marquer le prochain virage. Elle choisit ensuite une ligne presque droite vers le second repère."), H("Le premier arrivé choisit le goûter. Et on n’a pas le droit de déplacer l’arrivée.", "teasing")],
      choices: [
        Q("hyl-turn", "Prendre un grand virage régulier.", "sangFroid", [N("Vous arrondissez la trajectoire. Hylee passe à l’intérieur, tente de vous saluer et perd assez d’élan pour que vous la rejoigniez."), H("Je célébrais trop tôt."), N("Vous atteignez le repère presque ensemble, chacun prétendant avoir touché le bord le premier.")], { affection: 3, trust: 2 }),
        Q("hyl-cut", "Tenter le raccourci serré près du repère.", "audace", [N("Votre pied glisse au changement d’angle. Vous vous asseyez brusquement. Hylee fait demi-tour pour vous aider et manque son propre freinage ; elle termine à côté de vous."), H("Ça compte comme une égalité ?", "teasing"), P("Seulement si on partage le goûter."), H("C’était prévu, mais ne le répète pas.")], { affection: 4, trust: 2 }),
        Q("hyl-guide", "Lui proposer de faire le virage en se tenant par les deux mains.", "lucidite", [N("Hylee accepte. Vous tournez lentement l’un autour de l’autre. Elle surveille d’abord vos pieds, puis relève la tête assez longtemps pour voir la courbe se refermer."), H("On revient au départ. C’était bien l’idée ?"), N("Vous recommencez un tour avant d’aller chercher le goûter.")], { affection: 3, trust: 3 }),
      ],
    };
    if (round === 2) return {
      intro: [
        ...(picks.includes("hyl-cut") || picks.includes("hyl-speed")
          ? [N("Assise au bord, Hylee inspecte une tache sur sa jupe. Elle l’essuie, puis change d’avis et vous montre celle qui couvre votre coude."), H("Nous avons clairement utilisé toute la piste.", "teasing")]
          : [N("Hylee fait un dernier tour sans vous. Elle vous salue une fois arrivée au bord et se rassoit prudemment avant d’annoncer sa réussite."), H("J’ai réussi ! Attends, personne ne me fait lever tout de suite.", "teasing")]),
        N("Vous partagez le goûter. Hylee laisse passer de l’eau sous la partie peu profonde et commence à desserrer les lames."),
        H("La prochaine fois, je saurai freiner. Tu reviens essayer ?"),
      ],
      choices: [
        Q("hyl-end-friends", "Réclamer une revanche et l’aider à ranger les lames.", "lucidite", [P("Oui. Mais je choisis le goûter."), H("Il faut d’abord gagner."), N("Vous rangez les lames dans leur sac. Hylee ouvre le petit barrage, vous montre l’eau qui retrouve le ruisseau et vous accompagne jusqu’au sentier."), H("On rapportera du pain en plus. Le patinage donne faim.")], { affection: 5, trust: 3 }),
        Q("hyl-end-kiss", "Lui demander une dernière figure, sur l’herbe cette fois.", "audace", [N("Une fois les lames retirées, vous lui tendez les mains. Hylee se relève et vient dans vos bras."), H("Celle-là, je connais."), N("Elle vous embrasse, puis recule juste assez pour vérifier que vous ne partez pas encore. Vous l’aidez ensuite à ouvrir le barrage et à ranger le matériel.")], { affection: 4, desire: 7 }),
      ],
    };
  }
  return undefined;
}
