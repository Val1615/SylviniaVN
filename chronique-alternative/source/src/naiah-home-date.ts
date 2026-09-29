import type { DialogueLine } from "./game-data";
import type { HomeDateProfile } from "./housing-scenes";

const N = (text: string): DialogueLine => ({ speaker: "Narration", text });
const A = (text: string, mood = "smirk"): DialogueLine => ({ speaker: "Naïah", text, mood });
const P = (text: string): DialogueLine => ({ speaker: "{player}", text });
const O = (id: string, label: string, score: 0 | 1 | 2, ...response: DialogueLine[]) => ({ id, label, score, response });

export const NAIAH_HOME_DATE: HomeDateProfile = {
  character: "naiah",
  title: "Une place qui n’était pas là",
  description: "Laisser Naïah annexer votre mobilier, promulguer des lois absurdes et décider ce qu'elle veut réellement laisser derrière elle.",
  gift: "homegift-naiah",
  activityTitle: "Le royaume du fauteuil",
  activityInstruction: "Trois crises domestiques réclament une décision. Naïah juge surtout la manière dont vous partagez le jeu, l'espace et le droit de rester.",
  arrival: [
    N("On frappe trois fois à la porte, puis une quatrième fois depuis l'intérieur. Lorsque vous entrez dans votre propre salon, Naïah siège déjà dans le fauteuil avec un coussin violet en guise de couronne."),
    A("Bienvenue chez toi. J'ai procédé à une annexion préventive. Le canapé reste neutre et la cuisine négocie encore."),
    N("Une copie spectrale de vous prend des notes près de la fenêtre. Elle porte une robe de magistrat, une moustache et une expression beaucoup trop raisonnable."),
    A("J'ai convoqué un témoin expert. Il affirme que tu ranges mal les tasses et que tu hésites trop longtemps avant d'inviter les gens à rester."),
  ],
  cityComments: {
    algratal: A("Al’Gratal a trop de fenêtres pour une ville qui adore les secrets. J'approuve ce défaut."),
    forthaven: A("La mer détruit mes brumes et recommence chaque matin. Je pourrais finir par respecter cette insolence."),
    miraldas: A("Le Dôme rend toutes les illusions légèrement prétentieuses. Les miennes se sentent enfin comprises."),
    akuhn: A("Je connais la vue. Pas depuis une maison où je peux partir quand je veux. Ce détail change tout.", "thinking"),
  },
  tierComments: [
    A("Petit, caché, facile à transformer. Cette pièce a d'excellentes dispositions criminelles."),
    A("Tu as juste assez de murs pour que j'en déplace un sans provoquer de crise architecturale."),
    A("C'est beau sans avoir l'air de vouloir t'avaler. J'aime bien."),
    A("Je pourrais créer trois bals ici et n'inviter personne. Très tentant."),
    A("Ce lieu est absurdement grand. Promets-moi qu'une pièce restera inutile."),
  ],
  ownItemComment: "Ma tasse… Tu as même laissé la fêlure tournée vers la lumière. Elle n'a jamais été aussi bien regardée au palais.",
  otherItemComment: "Je pourrais inventer une histoire plus spectaculaire. Mais la vraie trace sur ton visage quand tu regardes cet objet est déjà meilleure.",
  tones: {
    amical: {
      label: "Une ambassade sans traité", detail: "Jouer, parler et protéger une complicité qui n'a rien à prouver.", effects: { affection: 7, trust: 8 },
      lines: [P("Tu peux annexer le fauteuil. Rien ne t'oblige à annexer la soirée entière."), A("Une frontière respectée volontairement ? Mon royaume devient scandaleusement civilisé.", "laugh")],
    },
    amoureux: {
      label: "Une adresse pour la lanterne", detail: "Lui offrir une place qui ne devient ni dette ni promesse forcée.", effects: { affection: 9, trust: 8, desire: 4 },
      lines: [P("Ta lanterne peut rester ici, même si toi tu repars ce soir."), A("Et je peux revenir sans prétendre que c'était elle qui insistait ? Clause dangereusement séduisante.", "thinking")],
    },
    desir: {
      label: "Abolir la frontière du plaid", detail: "Choisir une proximité physique, joueuse et explicite dans ses limites.", effects: { affection: 7, trust: 6, desire: 10 },
      lines: [P("Le fauteuil garde son royaume. Je réclame seulement une place contre toi sous le plaid."), A("Demande recevable. Taxe douanière : un baiser, payable à l'avance.", "smirk")],
    },
  },
  rounds: [
    {
      prompt: "Le double spectral affirme connaître votre logis mieux que vous.",
      detail: "Il propose un itinéraire parfait où aucun geste maladroit ne survient.",
      options: [
        O("dismiss", "Le révoquer et montrer à Naïah le tiroir qui coince vraiment", 2, N("Le double proteste ; Naïah l'affecte au poste de portemanteau et vient soulever avec vous le vrai tiroir."), A("Une maladresse réparable vaut mieux qu'une perfection qui n'habite pas ici.")),
        O("contest", "Défier le double dans une visite guidée contradictoire", 1, N("Chaque objet reçoit deux histoires et une fonction absurde. Naïah attribue les points sans expliquer le barème.")),
        O("follow", "Laisser la copie organiser toute la soirée", 0, A("Je t'ai invité·e, pas ton excellent service administratif. Récupère ton visage.", "annoyed")),
      ],
    },
    {
      prompt: "Le royaume du fauteuil et la république du canapé revendiquent le même plaid.",
      detail: "Naïah a déjà dessiné une frontière en coussins et nommé trois ambassadeurs invisibles.",
      options: [
        O("third", "Fonder entre les deux un territoire commun assez petit pour se toucher", 2, N("Vous repliez le plaid entre les deux sièges. Naïah abandonne aussitôt son trône pour venir tester la constitution contre votre épaule."), A("Troisième solution. Les diplomates vont être furieux.")),
        O("duel", "Régler le conflit par un duel de coussins", 1, N("Le salon disparaît sous les plumes illusoires. La frontière survit moins de trente secondes et votre dignité encore moins.")),
        O("yield", "Lui céder tout le plaid depuis l'autre bout de la pièce", 0, A("Victoire totale et profondément ennuyeuse. Reviens au moins contester mon règne.")),
      ],
    },
    {
      prompt: "Avant de partir, Naïah pose sa lanterne près de la porte.",
      detail: "Elle prétend que l'objet refuse de rentrer, tout en gardant sa main sur l'anse.",
      options: [
        O("address", "Choisir ensemble une étagère et laisser la lanterne y décider de son adresse", 2, N("Vous portez l'objet à deux. Une fois posé, Naïah garde ses doigts sur les vôtres."), A("Elle sait où revenir. Sa propriétaire mène encore une enquête.", "thinking")),
        O("pocket", "Glisser une clé symbolique sous la lanterne", 1, N("Naïah fabrique aussitôt une serrure minuscule pour la clé et refuse de dire laquelle des deux est le cadeau.")),
        O("return", "Lui rendre la lanterne sans répondre à ce qu'elle demande", 0, N("Elle la reprend, mais laisse le coussin violet sur le fauteuil comme une protestation silencieuse.")),
      ],
    },
  ],
  results: {
    close: [A("Le royaume a survécu. La diplomatie beaucoup moins. J'exige une seconde visite pour réécrire les archives.", "laugh")],
    warm: [N("Naïah range les illusions mais oublie volontairement le coussin violet."), A("Ce n'est pas un oubli. C'est une occupation à temps partiel.", "smirk")],
    perfect: [N("Le double spectral disparaît, la lanterne reste et le fauteuil retrouve sa forme réelle. Naïah ne bouge pourtant pas de votre côté du plaid."), A("Voilà. Aucun tour pour décider à ma place. J'ai envie de rester encore.", "thinking")],
  },
};
