import type { ChoiceData, DialogueLine, Effects, StatKey } from "./game-data";
import type { DateScene } from "./date-scenes";

const N = (text: string): DialogueLine => ({ speaker: "Narration", text });
const R = (text: string, mood = "calm"): DialogueLine => ({ speaker: "Remerii", text, mood });
const P = (text: string): DialogueLine => ({ speaker: "{player}", text });
const Q = (id: string, text: string, stat: StatKey, response: DialogueLine[], effects: Effects): ChoiceData => ({ id, text, stat, response, effects, dateOutcome: "good" });

export const REMERII_DATES: DateScene[] = [
  {
    id: "date-remerii-lanterns", character: "remerii", title: "Au-dessus des lanternes", type: "Dîner en terrasse",
    description: "Une table dans les galeries hautes de Mir’Aldas, un dîner et des histoires inventées à voix basse.",
    location: "miraldas", spot: "miraldas-lanterns", period: "soirée", unlockStage: 5, minAffection: 34, minTrust: 34, minDesire: 24, mood: "smirk",
    intro: [
      N("La terrasse occupe une galerie à l’écart des instruments de l’observatoire. Sous les arches, les tables donnent sur les lanternes de la ville. Remerii vous attend au pied de l’escalier."),
      R("J’ai demandé une table au bord. La personne qui la voulait avant nous a longuement expliqué l’importance de sa fonction."),
      P("Vous lui avez dit la vôtre ?"),
      R("J’avais réservé. C’était plus court.", "smirk"),
      N("Elle vous précède entre les tables. Une petite lampe protège sa flamme du vent ; Remerii la déplace pour qu’elle n’éclaire pas directement vos yeux."),
      R("Il y a une sauce aux agrumes avec ce plat. On peut la faire servir à part, si vous préférez."),
      P("Vous connaissez la carte par cœur ?"),
      R("J’ai regardé en attendant. Je sais déjà ce que je vais prendre. J’hésite encore sur ce que je vais vous envier."),
      N("Au moment de commander, elle demande que le vin reste léger. Le serveur propose aussi une boisson sans alcool, puis vous laisse choisir."),
      N("Remerii retire ses gants. Son bracelet accroche un instant le bord de la carte ; elle le libère et range celle-ci avant que vous ayez le temps de sourire."),
      R("Vous aviez une remarque ?"),
    ],
    choices: [
      Q("rem-lantern-flirt", "Avouer que vous la regardiez, pas son bracelet.", "audace", [P("Je vous regardais. Le bracelet n’y était pour rien."), N("Elle garde votre regard, puis pose ses gants à côté de la lampe."), R("Dans ce cas, je vais le garder. J’aimerais savoir si vous persistez.", "smirk")], { affection: 5, trust: 3, desire: 4 }),
      Q("rem-lantern-friend", "Lui demander ce qu’elle compte vous faire goûter.", "lucidite", [R("Les agrumes, d’abord. Mais gardez un peu de votre pain, nous risquons d’avoir envie d’échanger les assiettes."), N("Elle vous montre le plat qu’elle a choisi et écoute votre commande sans y ajouter de correction.")], { affection: 4, trust: 5 }),
    ],
    intimacySetting: {
      background: "/assets/backgrounds/miraldas_quarters.webp", replaceProfile: true,
      opening: ["Vous quittez la terrasse ensemble. Remerii vous invite à prolonger la soirée dans ses appartements, à quelques rues de là ; vous acceptez avant qu’elle prenne cette direction.", "À l’abri des regards, elle pose ses gants et vient vous embrasser. Le dîner et les lanternes reviennent dans votre conversation, entre deux silences."],
      closing: ["Au moment de repartir, vous retrouvez le billet de réservation dans votre poche. Remerii y inscrit une autre date, puis vous demande si elle vous convient."],
    },
  },
  {
    id: "date-remerii-observatory", character: "remerii", title: "Les étoiles sans sortilège", type: "Observation à la lunette",
    description: "Orienter une lunette mécanique à deux, puis partager le ciel de l’observatoire.",
    location: "miraldas", spot: "miraldas-observatory", period: "soirée", unlockStage: 5, minAffection: 35, minTrust: 34, minDesire: 24, mood: "calm",
    intro: [
      N("Remerii a emprunté une lunette sur un trépied de bois. Les grandes armilles restent couvertes ; une carte du ciel, une lampe et deux tabourets occupent seuls votre coin de la terrasse."),
      P("Il faut savoir la faire fonctionner ?"),
      R("Les deux molettes tournent le tube. Celle-ci règle la netteté. Le reste, ce sont des lentilles."),
      N("Elle vous laisse vérifier. Rien ne s’allume quand vous posez les mains sur le bois. Vous tournez une molette ; la lunette descend lentement vers les toits."),
      R("Nous avons découvert la cheminée. Une belle netteté, je vous l’accorde.", "smirk"),
      P("Et si je remonte ?"),
      N("Une étoile traverse le champ de vision. Vous vous immobilisez, mais elle a déjà disparu de l’autre côté."),
      R("Un peu moins vite. Je tiens le pied pendant que vous reprenez."),
      N("Son épaule frôle la vôtre. Elle regarde ensuite à son tour et recule légèrement la bague de mise au point."),
      R("J’y vois mieux ainsi. Dites-moi si cela brouille l’image pour vous."),
      N("Vous posez la carte entre les tabourets. Une pierre retient le bord ; Remerii rapproche la lampe pour vous permettre de lire les dessins."),
    ],
    choices: [
      Q("rem-stars-map", "Chercher ensemble le groupe d’étoiles dessiné près du bord de la carte.", "lucidite", [N("Vous repérez une paire de points brillants et lui montrez la même disposition sur le papier."), R("Oui. Prenez la molette, je vous dirai quand vous y serez."), N("Vous partagez les deux tabourets à la même hauteur.")], { affection: 4, trust: 5 }),
      Q("rem-stars-close", "Rapprocher votre siège et lui proposer de viser à deux.", "audace", [P("Si cela ne vous gêne pas."), R("La lunette, non. Mon coude, un peu. Là, c’est mieux."), N("Elle déplace son bras pour vous faire une place et reste appuyée contre votre épaule.")], { affection: 5, trust: 3, desire: 4 }),
    ],
    intimacySetting: {
      background: "/assets/backgrounds/miraldas_observatory.webp", replaceProfile: true,
      opening: ["Remerii remet le capuchon sur la lunette et ferme l’accès à votre galerie privée. Elle vous demande si vous souhaitez rester avec elle ; la couverture attend sur la banquette, loin des instruments.", "Vous vous rapprochez après lui avoir répondu. Elle prend le temps de vous embrasser, puis s’assied avec vous, la couverture ramenée sur vos épaules."],
      closing: ["La lunette reste couverte. Vous retrouvez vos affaires près des tabourets pendant que Remerii replie la couverture et vous propose de revenir voir le ciel un autre soir."],
    },
  },
];

export type RemeriiDateBeat = { intro: DialogueLine[]; choices: ChoiceData[] };
const LANTERN_BEATS: RemeriiDateBeat[] = [
  {
    intro: [
      N("Le dîner arrive. Remerii goûte sa sauce, puis échange avec vous un morceau de pain. À une table voisine, un homme change trois fois de chaise avant l’arrivée de son invitée."),
      R("Je parie qu’il veut tourner le dos à quelqu’un. Il n’a pas regardé la vue une seule fois."),
      P("Ou qu’il cherche la chaise qui ne boite pas."),
      R("Vous ruinez un début prometteur. Choisissez quelqu’un ; inventons-lui une raison d’être ici. À voix basse."),
    ],
    choices: [
      Q("rem-lantern-story", "Imaginer que l’homme attend la personne à qui il doit rendre les trois chaises.", "audace", [R("Il aurait pu les lui livrer. Vous lui imposez des frais de dîner considérables."), P("Il espère qu’elle ne les comptera pas."), N("Remerii doit poser son verre pour rire. Quand le serveur passe, elle reprend un air si digne qu’il vous faut regarder ailleurs.")], { affection: 5, trust: 3 }),
      Q("rem-lantern-gloves", "Inventer le rendez-vous d’une femme qui a apporté deux paires de gants.", "lucidite", [P("Elle en prête une paire à chaque personne qu’elle veut revoir. Pour qu’on ait une raison de revenir."), R("Et celle qui les garde ?"), P("Elle devait vraiment avoir froid."), N("Remerii regarde ses propres gants, puis les rapproche de son assiette avec un sourire.")], { affection: 5, trust: 3 }),
      Q("rem-lantern-no-game", "Préférer lui raconter quelque chose de votre propre journée.", "sangFroid", [P("Les inconnus peuvent garder leur dîner. Je voulais vous raconter le mien."), R("Racontez. J’espère que vous y avez conservé votre chaise."), N("Elle se tourne vers vous et ne revient pas aux tables voisines.")], { affection: 4, trust: 5 }),
    ],
  },
  {
    intro: [
      N("Vos assiettes sont débarrassées. Remerii choisit un dessert à partager et réserve la première bouchée avant de vous tendre la cuillère."),
      R("J’aime quand la croûte résiste un peu. Vous avez le droit de préférer le milieu. Cela arrangerait même beaucoup cette affaire."),
      N("Plus bas, les dernières lanternes s’allument. Elle se lève pour les regarder avec vous, puis laisse sa main ouverte sur la balustrade, près de la vôtre."),
    ],
    choices: [
      Q("rem-lantern-kiss", "Prendre sa main et lui demander si vous pouvez l’embrasser.", "audace", [R("Oui."), N("Elle se tourne vers vous. Le baiser est bref ; lorsqu’elle recule, elle garde vos doigts entre les siens."), R("Le dessert va refroidir. J’avoue que cela m’ennuie moins qu’il y a un instant.", "smirk"), N("Vous retournez finir votre assiette ensemble. Elle vous demande si vous souhaitez prolonger la soirée.")], { affection: 6, trust: 3, desire: 5 }),
      Q("rem-lantern-finish", "Admirer la vue près d’elle et proposer de revenir dîner ensemble.", "sangFroid", [R("Avec plaisir. Nous n’avons essayé qu’une petite partie de la carte."), N("Elle vous montre une ruelle éclairée plus bas, puis vous retournez terminer le dessert. Elle vous accompagne jusqu’à l’escalier sans hâter votre départ.")], { affection: 5, trust: 5 }),
    ],
  },
];
const STAR_BEATS: RemeriiDateBeat[] = [
  {
    intro: [
      N("Vous retrouvez la paire d’étoiles. Sur la carte, une troisième se trouve légèrement plus haut, à gauche. Le tube descend lorsque vous relâchez la poignée : la vis du support est mal serrée."),
      R("Je le tiens. Qu’est-ce qui vous paraît le plus simple ?"),
    ],
    choices: [
      Q("rem-stars-screw", "Resserrer la vis à la main, puis remonter légèrement le tube vers la gauche.", "lucidite", [N("Le support cesse de glisser. Vous tournez la molette par petites touches jusqu’à voir apparaître le troisième point."), R("Gardez cette position. Je voudrais la voir aussi."), N("Vous échangez les places. Elle décrit la teinte qu’elle distingue et vous invite à vérifier à votre tour.")], { affection: 4, trust: 5 }),
      Q("rem-stars-share", "Maintenir le tube pendant qu’elle règle le support, puis reprendre la recherche ensemble.", "sangFroid", [N("Vous retenez le tube sans forcer. Remerii serre la vis et vous guide vers le haut de la paire."), P("Je l’ai."), R("Alors ne cédez pas votre place trop vite. Je peux attendre."), N("Vous restez un moment à regarder, avant de lui laisser l’oculaire.")], { affection: 4, trust: 5 }),
      Q("rem-stars-miss", "Tourner rapidement la molette et perdre votre repère.", "audace", [N("Le champ se vide. Remerii rattrape la carte avant qu’elle glisse de vos genoux."), R("Nous avons encore la cheminée, si vous souhaitez repartir de quelque chose de familier.", "smirk"), N("Elle vous rend la carte et vous retrouvez ensemble la paire brillante. La seconde tentative prend moins de temps.")], { affection: 4, trust: 2 }),
    ],
  },
  {
    intro: [
      N("La lampe baisse. Remerii recouvre la carte et rapporte une couverture, qu’elle vous propose avant de s’asseoir sur la banquette."),
      R("Nous pouvons continuer à l’œil nu. J’aimerais voir une plus grande partie du ciel."),
      N("Elle étend les jambes. Le bord de la couverture passe sur vos genoux ; elle vous regarde pour savoir quelle place vous voulez prendre."),
    ],
    choices: [
      Q("rem-stars-kiss", "Vous asseoir contre elle et lui demander de se rapprocher.", "audace", [N("Remerii vient appuyer la tête contre votre épaule. Vous tournez légèrement le visage ; elle rencontre votre regard."), R("Oui, vous pouvez."), N("Elle vous embrasse lentement, puis revient regarder le ciel sans retirer sa main de la vôtre."), R("Restons encore un peu.")], { affection: 6, trust: 4, desire: 5 }),
      Q("rem-stars-finish", "Partager la couverture en lui laissant une place confortable à côté de vous.", "sangFroid", [N("Vous lui passez le pan libre. Remerii vous remercie et désigne une étoile que vous pouvez voir sans lunette."), P("Celle que nous cherchions ?"), R("Non. Celle que je suis en train de regarder. Elle me plaît aussi."), N("Vous restez côte à côte jusqu’à ce que la lampe s’éteigne.")], { affection: 5, trust: 5 }),
    ],
  },
];

export function remeriiDateBeat(sceneId: string, round: number): RemeriiDateBeat | undefined {
  return (sceneId === "date-remerii-lanterns" ? LANTERN_BEATS : sceneId === "date-remerii-observatory" ? STAR_BEATS : [])[round];
}

// On conserve les souvenirs d’un rendez-vous retiré, sans rejouer le piano.
export const migrateRemeriiDateId = (id: string) => id === "date-remerii-music" ? "date-remerii-lanterns" : id;
