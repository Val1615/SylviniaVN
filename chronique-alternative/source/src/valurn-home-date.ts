import type { DialogueLine } from "./game-data";
import type { HomeDateBranch } from "./housing-scenes";

/** « Le jeu sans mise » : trois soirées au logis, choisies après le ton. */
const N = (text: string): DialogueLine => ({ speaker: "Narration", text });
const V = (text: string, mood = "charming"): DialogueLine => ({ speaker: "Valurn", text, mood });
const P = (text: string): DialogueLine => ({ speaker: "{player}", text });
const O = (id: string, label: string, score: 0 | 1 | 2, ...response: DialogueLine[]) => ({ id, label, score, response });

export const VALURN_HOME_BRANCHES: HomeDateBranch[] = [
  {
    id: "cabinet", label: "Le cabinet des choses ordinaires", detail: "Il fait l'inventaire de vos objets exposés et vous raconte leur vie imaginaire.",
    lines: [
      N("Valurn pose ses cartes sans les distribuer. Il préfère vos étagères. Il en fait le tour comme un commissaire-priseur qui aurait décidé de ne rien vendre."),
      V("Ce soir, je suis conservateur d'un cabinet de curiosités. Le vôtre. Je ne connais l'histoire d'aucun objet, alors je vais l'inventer, et vous me corrigerez."),
      N("Il prend le premier objet du bout des doigts, le tourne vers la lampe, et commence une biographie absurde que vous interrompez au bout de trois phrases."),
    ],
    rounds: [
      { prompt: "Le premier objet.", detail: "Valurn lui attribue un passé de contrebande.", options: [
        O("truth", "Lui raconter sa vraie histoire, même banale", 2, V("Banale ? Vous l'avez gardée. Rien de ce qu'on garde n'est banal.", "neutral")),
        O("better", "Inventer une histoire encore plus folle que la sienne", 1, V("Vous me battez sur mon propre terrain. Je retire ma contrebande.", "amused")),
        O("price", "Lui demander combien il en tirerait", 0, V("Je ne sais pas. J'ai arrêté de calculer en entrant. C'était le principe.", "annoyed")),
      ] },
      { prompt: "L'objet sans histoire.", detail: "Il trouve une chose sans souvenir, posée là par hasard.", options: [
        O("give", "La lui offrir, puisqu'elle n'a encore rien vécu", 2, N("Il la tient longtemps, puis la remet à sa place."), V("Je la laisse ici. Elle vivra mieux chez vous. Mais je viendrai la voir.", "neutral")),
        O("invent", "Lui inventer une histoire à deux voix", 1, V("Une biographie collective. C'est très démocratique. Iriana serait horrifiée.", "amused")),
        O("hide", "La ranger pour qu'il ne la remarque pas", 0, V("Vous rangez sous mes yeux. Je ne demande rien. Je note.", "neutral")),
      ] },
      { prompt: "La dernière vitrine.", detail: "Il vous demande quelle place il occuperait dans le cabinet.", options: [
        O("shelf", "Lui désigner une étagère vide", 2, V("Une étagère vide. Sans étiquette. C'est la plus belle proposition qu'on m'ait faite cette année.", "away")),
        O("label", "Lui écrire une étiquette ridicule", 1, N("« Démonologue. Fragile. Ne pas exposer au soleil ni aux questions. » Il la garde dans sa poche.")),
        O("none", "Répondre qu'il n'y a pas de place pour lui", 0, V("Bien. Je resterai visiteur. C'est mon rôle préféré, d'habitude.", "neutral")),
      ] },
    ],
    results: {
      close: [V("Votre cabinet résiste à mon talent de faussaire. Excellent musée. Je reviendrai le décevoir.", "amused")],
      warm: [N("Il repose le dernier objet exactement à sa place, au millimètre."), V("Merci de m'avoir laissé toucher. Je sais que ce n'est pas rien.", "neutral")],
      perfect: [N("Avant de partir, il ajoute discrètement une petite carte sur l'étagère vide. Elle porte seulement la date de ce soir."), V("Inventaire terminé. Il manquait une pièce. Je l'ai ajoutée.", "charming")],
    },
  },
  {
    id: "reception", label: "La réception privée", detail: "Il organise chez vous une parodie de réception de cour, pour vous seul public.",
    lines: [
      N("Valurn déplace deux chaises, pose une nappe sur votre coffre et allume trop de bougies. Il vous annonce à la porte de votre propre salle comme un huissier."),
      V("Ce soir, réception privée. Je suis l'hôte, l'huissier, les musiciens et les trois invités désagréables. Vous êtes la seule personne que j'ai réellement invitée."),
      N("Il prend une voix grave pour le premier invité, un conseiller qui se plaint des impôts sur les chapeaux."),
    ],
    rounds: [
      { prompt: "Le conseiller grincheux.", detail: "Valurn l'imite à la perfection et vous demande votre avis sur les chapeaux.", options: [
        O("play", "Entrer dans le jeu et proposer une taxe sur les plumes", 2, V("Une taxe sur les plumes ! Le conseiller s'évanouit. Je dois le jouer évanoui maintenant.", "amused")),
        O("laugh", "Rire trop fort pour répondre", 1, V("Le rire n'est pas une position politique. Mais c'est un bon début.", "charming")),
        O("stop", "Lui demander d'arrêter les voix", 0, N("Il s'arrête, un peu déçu."), V("D'accord. Je redeviens un seul homme. C'est moins drôle.", "neutral")),
      ] },
      { prompt: "La danse obligatoire.", detail: "Le protocole exige une danse. Il n'y a pas de musique. Il fredonne.", options: [
        O("dance", "Danser avec lui, maladroitement, au milieu de la salle", 2, N("Vous tournez entre la table et le lit. Il fredonne faux, compte les pas, se trompe exprès, puis plus du tout.")),
        O("lead", "Prendre la conduite de la danse", 1, V("Vous menez. Je suis. C'est nouveau. J'aime ça plus que je ne l'admettrai jamais.", "away")),
        O("refuse", "Refuser la danse, poliment, comme à la cour", 0, V("Refus noté. Je danse seul, alors, avec la nappe.", "amused")),
      ] },
      { prompt: "Le toast final.", detail: "L'hôte doit porter un toast. Il vous tend le verre et vous laisse la parole.", options: [
        O("him", "Porter un toast à lui, sans ironie", 2, N("Il ne sait plus où mettre ses mains."), V("C'est contraire au protocole. Je vais le noter quelque part où personne ne le lira.", "neutral")),
        O("home", "Porter un toast à votre maison", 1, V("À la maison. Et à ses portes, qui ferment des deux côtés.", "charming")),
        O("court", "Porter un toast à la cour, pour rire", 0, V("À la cour. Puisse-t-elle ne jamais savoir que nous existons.", "amused")),
      ] },
    ],
    results: {
      close: [V("Réception réussie : aucun mort, deux invités offensés, un hôte ridicule. Selon les critères d'Al'Gratal, c'est un triomphe.", "amused")],
      warm: [N("Il souffle les bougies une à une, en laissant une seule allumée."), V("J'ai joué toute la cour. Je n'ai jamais été invité nulle part comme ça.", "neutral")],
      perfect: [N("Il plie la nappe avec soin et la laisse sur votre coffre."), V("La prochaine réception, c'est vous qui recevez, et je viens en invité. Un vrai. Je frapperai à la porte.", "charming")],
    },
  },
  {
    id: "cartes", label: "Cartes ouvertes", detail: "Une partie où toutes les cartes sont visibles et où l'on ne peut pas bluffer.",
    lines: [
      N("Valurn distribue enfin ses cartes, face visible. Toutes. Les vôtres, les siennes. Il n'y a rien à cacher sur la table."),
      V("La règle est simple : on joue cartes ouvertes. On sait tout ce que l'autre peut faire. Il ne reste qu'à choisir ce qu'on fait vraiment."),
      N("Il pose la première carte. Il ne fait aucun commentaire, pas un mot, pas un regard de biais. C'est presque inquiétant."),
    ],
    rounds: [
      { prompt: "La première levée.", detail: "Vous pourriez prendre sa meilleure carte. Il le voit. Vous le voyez le voir.", options: [
        O("leave", "La lui laisser, sans rien dire", 2, V("Vous auriez pu. Vous ne l'avez pas fait. Je ne sais pas encore quoi faire de ça.", "neutral")),
        O("take", "La prendre, franchement, en le regardant", 1, V("Honnête. Cruel. Honnête quand même.", "amused")),
        O("talk", "Commenter sa stratégie à voix haute", 0, V("Inutile. Tout est visible. Il ne reste que les choix, pas les commentaires.", "neutral")),
      ] },
      { prompt: "La carte perdue.", detail: "Il joue une carte qui le fait perdre, à l'évidence, et ne s'explique pas.", options: [
        O("ask", "Lui demander pourquoi, sans reproche", 2, V("Parce que je voulais voir ce que ça fait de perdre sans que personne ne croie que je le fais exprès. Ici, on voit que je le fais exprès. C'est plus simple.", "neutral")),
        O("win", "Profiter de l'erreur et gagner la levée", 1, V("Vous prenez. Bien. C'est ce que j'aurais fait, avant.", "neutral")),
        O("refuse", "Refuser de jouer la levée", 0, V("On ne peut pas refuser. C'est la seule règle que je n'ai pas inventée ce soir.", "annoyed")),
      ] },
      { prompt: "La dernière main.", detail: "Il reste une carte à chacun. Elles sont identiques.", options: [
        O("tie", "Proposer de déclarer l'égalité", 2, N("Il pose sa carte sur la vôtre. Aucun gagnant."), V("Égalité. C'est le seul résultat que je n'avais jamais obtenu.", "away")),
        O("swap", "Échanger vos cartes", 1, V("Échanger deux choses identiques. C'est absurde. C'est parfait.", "amused")),
        O("keep", "Garder votre carte pour vous", 0, V("Vous la gardez. Elle est visible quand même. Vous apprenez vite.", "neutral")),
      ] },
    ],
    results: {
      close: [V("Partie sans bluff. Je suis épuisé. On devrait interdire la sincérité après le dîner.", "amused")],
      warm: [N("Il range les cartes face visible, dans l'ordre exact où vous les avez jouées.")],
      perfect: [N("Il laisse le jeu complet sur votre table, toutes les cartes face visible."), V("Gardez-le. Je ne joue plus avec. Je jouerai avec vous, si vous voulez, cartes ouvertes.", "neutral")],
    },
  },
];
VALURN_HOME_BRANCHES[2].results.warm.push(V("Je n'ai rien gagné. Je repars quand même avec quelque chose. C'est contraire à toutes mes lois.", "neutral"));
export const VALURN_HOME_OWN_ITEM_COMMENT = "Mon cadeau. Vous l'avez exposé au lieu de le ranger. C'est à la fois très touchant et parfaitement inutile, ce qui le rend touchant.";
void P;
