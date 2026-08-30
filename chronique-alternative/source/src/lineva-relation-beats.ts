import type { ChoiceData, DialogueLine, Effects, StatKey } from "./game-data";

export type LinevaRelationBeat = {
  intro: DialogueLine[];
  choices: ChoiceData[];
};

const line = (speaker: string, text: string, mood?: string): DialogueLine => ({ speaker, text, mood });
const choice = (
  id: string,
  text: string,
  playerLine: string,
  stat: StatKey,
  response: DialogueLine[],
  effects: Effects,
): ChoiceData => ({ id, text, playerLine, stat, response, effects });

/**
 * Ces battements suivent la décision militaire sans la remplacer. Ils rendent
 * le désir entièrement facultatif : une réponse concrète permet de construire
 * affection et confiance sans ouvrir la branche physique.
 */
export const LINEVA_RELATION_BEATS: Record<string, LinevaRelationBeat> = {
  "lineva-0": {
    intro: [
      line("Narration", "La relève suivante prend la chaîne. Lineva vous retrouve près des caisses vides, vous tend sa gourde et regarde vos paumes rougies par les cordages."),
      line("Lineva", "Vous avez tenu jusqu’au bout. J’hésite entre vous offrir le café et vous épargner cette épreuve.", "smirk"),
    ],
    choices: [
      choice("lineva-beat-0-franc", "Garder la gourde et lui dire que sa compagnie compense le café.", "Votre compagnie devrait rendre le café supportable.", "audace", [
        line("Lineva", "C’est une affirmation grave. Revenez demain, nous vérifierons avec une tasse entière.", "smirk"),
        line("Narration", "Elle reprend la gourde en laissant ses doigts glisser contre les vôtres un peu plus longtemps que nécessaire."),
      ], { stats: { audace: 1 }, affection: 2, desire: 6 }),
      choice("lineva-beat-0-taquin", "Lui demander si le café sert à repousser les morts ou les visiteurs.", "Le café repousse les morts ou seulement les visiteurs ?", "lucidite", [
        line("Lineva", "Les visiteurs. Les morts ont déjà perdu le goût, les chanceux.", "smirk"),
        line("Narration", "Son rire bref survit au retour d’un officier venu chercher une signature."),
      ], { stats: { lucidite: 1 }, affection: 3, desire: 3 }),
      choice("lineva-beat-0-fiable", "Lui rendre la gourde et demander où la chaîne manquera de bras demain.", "Où faudra-t-il des bras demain ?", "sangFroid", [
        line("Lineva", "Bassin deux, à l’aube. Demandez Mara. Elle jure beaucoup, mais ses cordages ne cassent pas.", "determined"),
        line("Narration", "Elle inscrit votre nom sur l’équipe du matin sans vous promettre de traitement particulier."),
      ], { stats: { sangFroid: 1 }, affection: 4, trust: 2 }),
    ],
  },
  "lineva-1": {
    intro: [
      line("Narration", "Après le décompte, Lineva vous rattrape sous le rempart. Elle repère une entaille sur votre avant-bras et noue autour une bande propre tirée de sa poche."),
      line("Lineva", "Ce n’est pas profond. Ne profitez pas du diagnostic pour saigner davantage.", "thoughtful"),
    ],
    choices: [
      choice("lineva-beat-1-franc", "Lui dire que vous accepteriez volontiers un second examen après la relève.", "Je peux revenir pour un second examen après la relève.", "audace", [
        line("Lineva", "Revenez sans nouvelle plaie. Je trouverai bien quelque chose à vérifier.", "smirk"),
        line("Narration", "Elle resserre le nœud avec une précision qui n’exigeait pas de garder votre bras contre elle."),
      ], { stats: { audace: 1 }, affection: 2, desire: 5 }),
      choice("lineva-beat-1-proche", "Poser brièvement votre main sur la sienne avant qu’elle termine le nœud.", "Merci d’être revenue me chercher.", "sangFroid", [
        line("Lineva", "Je cherchais toutes les personnes encore dehors. Vous étiez sur la liste.", "thoughtful"),
        line("Narration", "La réponse est sèche. Sa main, elle, reste immobile sous la vôtre jusqu’au prochain coup de cloche."),
      ], { stats: { sangFroid: 1 }, affection: 3, desire: 3 }),
      choice("lineva-beat-1-fiable", "Lui proposer de finir avec elle la liste des dix-neuf.", "Finissons la liste avant de quitter le mur.", "lucidite", [
        line("Lineva", "D’accord. Vous lisez, j’écris. Les deux noms manquants restent des noms.", "determined"),
        line("Narration", "Vous travaillez côte à côte jusqu’à ce que chaque famille possède une réponse, même lorsque cette réponse fait mal."),
      ], { stats: { lucidite: 1 }, affection: 4, trust: 2 }),
    ],
  },
  "lineva-2": {
    intro: [
      line("Narration", "La dernière nacelle est arrimée. Lineva s’assied sur une caisse, ouvre et referme ses doigts brûlés par la corde, puis pousse vers vous le rouleau de bandage sans formuler d’ordre."),
      line("Lineva", "Mes mains fonctionnent encore. Elles fonctionneront mieux si quelqu’un évite de serrer comme un bourreau.", "thoughtful"),
    ],
    choices: [
      choice("lineva-beat-2-franc", "Bander ses paumes et lui faire remarquer qu’elle a choisi la bonne personne.", "Vous avez choisi la bonne personne.", "audace", [
        line("Lineva", "Pour le bandage ?", "smirk"),
        line("{player}", "Vous savez que non."),
        line("Narration", "Elle vous laisse terminer sans détourner les yeux, le sourire plus lent que sur le quai."),
      ], { stats: { audace: 1 }, affection: 2, desire: 5 }),
      choice("lineva-beat-2-proche", "Prendre le temps de nettoyer chaque brûlure avant de remettre le bandage.", "Dites-moi si je serre trop.", "sangFroid", [
        line("Lineva", "Je vous le dirai. Pour l’instant, continuez.", "thoughtful"),
        line("Narration", "Son pouce suit une fois le bord de votre paume lorsque vous nouez la dernière bande."),
      ], { stats: { sangFroid: 1 }, affection: 3, desire: 3 }),
      choice("lineva-beat-2-fiable", "Appeler une soigneuse et reprendre le registre pendant qu’elle examine Lineva.", "Je tiens le registre. Vous gardez vos mains pour demain.", "lucidite", [
        line("Lineva", "Voilà une répartition que je ne peux pas insulter sans mauvaise foi.", "determined"),
        line("Narration", "Elle transmet les recherches en cours à Mara, puis se laisse soigner sans quitter le décompte des oreilles."),
      ], { stats: { lucidite: 1 }, affection: 4, trust: 2 }),
    ],
  },
  "lineva-3": {
    intro: [
      line("Narration", "Les officiers sortent avec leurs affectations. Lineva attend que la porte se ferme, pousse elle-même le fauteuil de Draven contre le mur et s’assied sur le bord de la table dégagée."),
      line("Lineva", "Voilà. La carte est lisible et personne n’a été promu par un meuble. Vous aviez autre chose à me dire ?", "thoughtful"),
    ],
    choices: [
      choice("lineva-beat-3-franc", "Lui dire que vous vouliez une minute avec Lineva, sans capitaine ni titre.", "Je voulais une minute avec Lineva.", "audace", [
        line("Lineva", "Vous l’avez. N’en gaspillez pas la moitié à chercher une formule prudente.", "smirk"),
        line("Narration", "Elle vous attire entre ses genoux par le bord de votre veste, assez près pour rendre toute formule inutile."),
      ], { stats: { audace: 1 }, affection: 2, desire: 6 }),
      choice("lineva-beat-3-proche", "Rester près d’elle après le départ des officiers, sans remettre le titre au centre.", "Je reste un moment, si vous le voulez.", "sangFroid", [
        line("Lineva", "Je le veux. Fermez seulement la porte avant que Joren découvre un nouveau formulaire.", "thoughtful"),
        line("Narration", "Vous partagez le bord de la table. Son épaule vient toucher la vôtre lorsque le silence s’installe."),
      ], { stats: { sangFroid: 1 }, affection: 4, desire: 4 }),
      choice("lineva-beat-3-fiable", "Rassembler les derniers plis et lui demander lesquels doivent partir avant la marée.", "Quels plis doivent partir avant la marée ?", "lucidite", [
        line("Lineva", "Ces deux-là. Le reste attendra le convoi de demain.", "determined"),
        line("Narration", "Lineva délègue les copies à la secrétaire et garde seulement les deux signatures qu’elle doit réellement poser."),
      ], { stats: { lucidite: 1 }, affection: 4, trust: 3 }),
    ],
  },
  "lineva-4": {
    intro: [
      line("Narration", "Dans la cour de triage, Lineva écarte deux brancards, appelle votre nom et vous trouve enfin près du mur noirci. Elle vous saisit par l’épaule, vérifie votre visage puis votre respiration."),
      line("Lineva", "Vous êtes entier·ère. Très bien. J’avais besoin d’une bonne nouvelle qui ne tienne pas sur un rapport.", "thoughtful"),
    ],
    choices: [
      choice("lineva-beat-4-franc", "Lui dire que vous l’avez cherchée, elle aussi, dès que les cloches se sont tues.", "Je vous cherchais aussi.", "audace", [
        line("Lineva", "Alors restez là une seconde. Mara peut commander la cour sans nous.", "thoughtful"),
        line("Narration", "Son front touche le vôtre. Le contact est bref, franc et assez proche pour faire oublier la fumée une respiration."),
      ], { stats: { audace: 1 }, affection: 3, desire: 6 }),
      choice("lineva-beat-4-proche", "Couvrir sa main de la vôtre pendant qu’elle vérifie votre épaule.", "Je suis là.", "sangFroid", [
        line("Lineva", "Oui. Je vois.", "thoughtful"),
        line("Narration", "Ses doigts se desserrent enfin. Elle garde pourtant votre main contre la sienne jusqu’à ce que Mara appelle depuis les bandages."),
      ], { stats: { sangFroid: 1 }, affection: 4, trust: 1, desire: 4 }),
      choice("lineva-beat-4-fiable", "Lui remettre la liste des blessés et signaler que Mara a déjà trouvé le vin.", "Les blessés sont comptés. Mara a trouvé le vin avant nous.", "lucidite", [
        line("Lineva", "Évidemment. Donnez-moi la liste, puis nous irons lui confisquer la bouteille.", "smirk"),
        line("Narration", "Elle confie la cour de triage à Mara, prend les registres sous un bras et vous fait signe de marcher près d’elle."),
      ], { stats: { lucidite: 1 }, affection: 5, trust: 2 }),
    ],
  },
};

export function linevaRelationBeat(sceneId: string): LinevaRelationBeat | undefined {
  return LINEVA_RELATION_BEATS[sceneId];
}
