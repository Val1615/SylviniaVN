import type { DialogueLine } from "./game-data";
import type { HomeDateProfile } from "./housing-scenes";

const N = (text: string): DialogueLine => ({ speaker: "Narration", text });
const A = (text: string, mood = "smirk"): DialogueLine => ({ speaker: "Naïah", text, mood });
const P = (text: string): DialogueLine => ({ speaker: "{player}", text });
const O = (id: string, label: string, score: 0 | 1 | 2, ...response: DialogueLine[]) => ({ id, label, score, response });

export const NAIAH_HOME_DATE: HomeDateProfile = {
  character: "naiah",
  title: "Une place qui n’était pas là",
  description: "Voir Naïah essayer votre logement, le déranger, l’améliorer parfois et y laisser une trace qu’elle prétendra temporaire.",
  gift: "homegift-naiah",
  activityTitle: "Trois choses déplacées",
  activityInstruction: "Naïah essaie le lieu comme on éprouve un terrain inconnu. Répondez à ses inventions sans lui abandonner tout le jeu.",
  arrival: [
    N("Naïah entre lorsque vous ouvrez la porte — sans apparition depuis l’intérieur, sans fanfare, ce qui devient presque plus inquiétant."),
    A("Je voulais savoir si j’étais capable d’attendre qu’on m’invite. Résultat : oui, mais c’est très long."),
    N("Elle fait le tour de la pièce à grandes enjambées, déplace une chaise hors du courant d’air, pousse une lampe vers votre livre ouvert et retourne un coussin pour cacher une tache que vous n’aviez jamais remarquée."),
    A("Cette chaise essayait de te rendre malade. Cette lampe travaillait mal. Le coussin nie tout."),
    N("Puis elle sort de sa manche une tasse ébréchée, bleu sombre, réparée deux fois avec une résine violette. Elle la pose sur l’étagère, la reprend aussitôt et continue sa visite avec l’objet serré contre elle."),
    P("Tu apportes ta vaisselle en rendez-vous ?"),
    A("Elle voulait voir la maison. Ne l’encourage pas, elle devient vite exigeante.", "thinking"),
  ],
  cityComments: {
    algratal: A("On voit six fenêtres depuis la porte. Trois personnes pourraient nous espionner confortablement. J’aime l’hospitalité locale."),
    forthaven: A("Le sel entre partout. Si ma brume survit une nuit ici, je lui offre un nom et un dessert."),
    miraldas: A("Le Dôme fait vibrer la lumière sur tes murs. J’ai déjà trouvé comment lui répondre. Je ne le ferai qu’une fois. Peut-être neuf."),
    akuhn: A("Je reconnais le bruit des cloches. Depuis une pièce où personne ne peut m’ordonner de sortir, il sonne autrement.", "neutral"),
  },
  tierComments: [
    A("Petit. Je peux atteindre la table, la fenêtre et toi sans faire trois pas. Excellente architecture."),
    A("Il y a assez de place pour se perdre derrière une porte. Je vais essayer avant de critiquer."),
    A("Tu as un vrai mur inutile. Garde-le ainsi. Les choses inutiles survivent mieux aux projets grandioses."),
    A("Cette pièce pourrait accueillir cinquante invités ou un seul monstre gigantesque. Le choix me paraît évident."),
    A("C’est beaucoup trop grand. Si je crie depuis l’autre bout, attends au moins la deuxième fois avant de t’inquiéter."),
  ],
  ownItemComment: "Ma tasse est encore là. Tu as mis la fêlure face à la lumière… Elle est plus jolie comme ça. Ne prends pas cet air victorieux.",
  otherItemComment: "Tu regardes cet objet avant même de le toucher. Je pourrais inventer une meilleure histoire, mais ton visage gâcherait le mensonge.",
  tones: {
    amical: {
      label: "La laisser essayer la maison", detail: "Jouer avec ses changements, en garder certains et lui rendre les autres.", effects: { affection: 8, trust: 7 },
      lines: [P("Tu peux déplacer ce qui te gêne. Je me réserve le droit de tout remettre."), A("Parfait. Je me réserve celui de recommencer plus vite.", "laugh")],
    },
    amoureux: {
      label: "Traiter sa tasse comme si elle avait toujours eu une étagère", detail: "Faire entrer sa présence dans vos gestes sans réclamer de promesse.", effects: { affection: 10, trust: 8, desire: 4 },
      lines: [N("Vous prenez la tasse lorsqu’elle cherche où la poser et la placez près de la vôtre."), N("Naïah regarde les deux anses alignées. Elle ne fait apparaître aucun commentaire à sa place."), A("Elle reste jusqu’à demain. Après, nous verrons si elle se conduit bien.", "thinking")],
    },
    desir: {
      label: "Lui montrer une habitude qu’elle peut détourner", detail: "Transformer le terrain familier du logis en jeu physique dont vous partagez l’initiative.", effects: { affection: 8, trust: 7, desire: 11 },
      lines: [P("Je m’assois toujours ici quand la porte est fermée."), N("Naïah suit votre regard jusqu’au canapé, puis revient à votre bouche avec un sourire qui vient d’apprendre quelque chose."), A("Information dangereuse. Merci.", "smirk")],
    },
  },
  rounds: [
    {
      prompt: "Naïah a déplacé votre table de quelques centimètres.",
      detail: "La circulation devient meilleure, mais votre main cherche encore l’ancien bord chaque fois que vous passez.",
      options: [
        O("keep-good", "Reconnaître que son changement fonctionne et lui demander comment elle l’a vu", 2, N("Naïah reproduit vos six derniers passages avec de petits doubles. Chacun évite désormais le coin qui accrochait votre hanche."), A("Tu contournais ce meuble sans le regarder. Il gagnait depuis des semaines."), P("Il a perdu."), A("Nous avons perdu. Je comptais parier sur lui.")),
        O("move-again", "Déplacer la table une seconde fois pour lui rendre le problème", 1, N("Vous l’orientez vers la lumière. Naïah change de trajectoire, constate que le nouvel angle fonctionne aussi et dessine une grimace sur le bois."), A("Égalité. Le meuble demeure suspect.")),
        O("restore", "La remettre immédiatement à sa place sans essayer", 0, N("Naïah ne proteste pas. Une miniature de la table vous suit ensuite partout en cognant obstinément votre cheville."), A("Coïncidence domestique.")),
      ],
    },
    {
      prompt: "Une ombre monstrueuse occupe maintenant le couloir.",
      detail: "Elle possède douze griffes, un souffle de tombe et un petit tablier couvert de farine.",
      options: [
        O("feed-beast", "Lui confier la préparation du dessert et juger seulement le résultat", 2, N("La créature pétrit la pâte avec neuf mains, en mange avec deux et utilise la dernière pour chasser Naïah de la cuisine."), A("Je l’ai créée il y a trente secondes et elle me trahit déjà. Elle est parfaite.", "laugh")),
        O("imitate-beast", "Ajouter une seconde abomination qui prétend connaître la recette", 1, N("Les deux monstres se disputent à voix basse afin de ne pas faire retomber la pâte. Naïah grimpe sur le plan de travail pour arbitrer avec une cuillère.")),
        O("erase-beast", "Dissiper la créature avant qu’elle touche à quoi que ce soit", 0, N("La cuisine redevient sûre. Naïah termine seule le dessert, volontairement difforme, puis vous sert la plus belle part sans commentaire.")),
      ],
    },
    {
      prompt: "Au moment de partir, elle reprend sa tasse sur l’étagère.",
      detail: "Elle la pose près de la porte, la remet dans sa manche, puis la ressort pour vérifier une fêlure qu’elle connaît déjà.",
      options: [
        O("use-cup", "Servir naturellement une dernière boisson dans sa tasse", 2, N("Vous la lui prenez sans cérémonie, versez l’infusion et replacez l’objet près du vôtre après qu’elle a bu."), N("Naïah suit le geste. Son pouce cesse de frotter la fêlure."), A("Elle n’a pas fini de refroidir. Je serai obligée de revenir la chercher."), P("Évidemment.")),
        O("ask-cup", "Lui demander franchement si elle veut la laisser", 1, N("Naïah regarde l’étagère, votre main ouverte et la porte."), A("Jusqu’à la prochaine fois. Ce qui peut être demain ou dans cent ans selon ton aptitude à préparer le petit-déjeuner.", "thinking")),
        O("pack-cup", "L’aider à l’emballer pour le retour", 0, N("Vous protégez la tasse dans un linge. Naïah noue le paquet, puis laisse à sa place une petite luciole illusoire qui refuse de la suivre.")),
      ],
    },
  ],
  results: {
    close: [N("Naïah repart avec sa tasse, mais une luciole demeure sous la lampe et cligne chaque fois que vous approchez de la porte."), A("Elle espionne le mobilier. Toi, seulement par accident.", "smirk")],
    warm: [N("La table garde son nouvel angle. La tasse reste jusqu’à la prochaine visite et le coussin violet apparaît sur le canapé au moment précis où Naïah prétend n’avoir rien oublié."), A("Ne le range pas. Il mord.")],
    perfect: [N("Vous utilisez sa tasse une dernière fois, puis la replacez près de la vôtre sans demander si le geste signifie davantage que ce soir."), N("Naïah la regarde, regarde la porte et retire lentement sa main de sa manche vide."), A("Je reste encore un peu. J’ai besoin de vérifier si ta maison sait garder deux tasses sans devenir insupportable.", "thinking")],
  },
};
