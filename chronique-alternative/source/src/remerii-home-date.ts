import type { ChoiceData, DialogueLine, Effects, StatKey } from "./game-data";
import type { HomeDateProfile, HomeGameOption, HomeMoment } from "./housing-scenes";

const N = (text: string): DialogueLine => ({ speaker: "Narration", text });
const R = (text: string, mood = "calm"): DialogueLine => ({ speaker: "Remerii", text, mood });
const P = (text: string): DialogueLine => ({ speaker: "{player}", text });
const O = (id: string, label: string, score: 0 | 1 | 2, ...response: DialogueLine[]): HomeGameOption => ({ id, label, score, response });

export const REMERII_HOME_DATE: HomeDateProfile = {
  character: "remerii", title: "Une soirée sans programme", gift: "homegift-remerii",
  description: "Recevoir Remerii, partager une boisson et quelques manches d’un petit jeu de table.",
  activityTitle: "Deux gobelets, cinq jetons",
  activityInstruction: "À tour de rôle, cachez de zéro à cinq jetons sous un gobelet et annoncez un nombre. Croire, contester ou demander un nouvel essai : les manches servent surtout à vous taquiner.",
  arrival: [
    N("Remerii attend que vous ayez ouvert avant de refermer son petit parapluie. Elle secoue une goutte au-dessus du seuil et vous demande où le poser."),
    R("J’ai apporté quelque chose pour votre lecture. Vous avez plusieurs fois plié le coin d’une page sous mes yeux ; j’ai fini par céder."),
    N("Elle vous tend un signet de métal fin, puis défait sa cape. Son bracelet accroche la manche ; elle le retire et le pose près de votre lampe."),
    R("Je peux m’installer ici ? Ce fauteuil a l’air de tenir ses promesses."),
    N("Vous lui proposez une boisson. Elle goûte, vous demande ce que vous y avez mis, puis tire le fauteuil assez près pour vous entendre sans hausser la voix."),
  ],
  cityComments: {
    algratal: R("On entend encore les voitures d’ici. Je préfère cela aux conversations du palier ; au moins, elles passent."),
    forthaven: R("Votre rue sent le pain jusqu’à cette porte. J’ai failli arriver avec une miche sous chaque bras."),
    miraldas: R("J’ai reconnu votre fenêtre depuis le croisement. La lampe m’a épargné une visite chez votre voisin."),
    akuhn: R("L’escalier tourne beaucoup. Je vous préviens : si vous oubliez quelque chose dehors, je vous attends dans ce fauteuil."),
  },
  tierComments: [
    R("Vous avez réussi à garder une place près de la lampe. Je vais essayer de ne pas y abandonner toutes mes affaires."),
    R("Cette petite table conviendra très bien. Je prends le côté qui ne gêne pas la porte."),
    R("Vous aviez raison pour le fauteuil. Je retire la réserve que j’avais faite en entrant."),
    R("Je vous suivrai pour visiter après notre boisson. J’aimerais d’abord profiter de cette pièce."),
    R("J’espère que vous connaissez le chemin de la cuisine. Je ne suis pas certaine de retrouver seule cette porte."),
  ],
  ownItemComment: "Cela me fait plaisir de le retrouver chez vous.",
  otherItemComment: "Vous me raconterez comment cet objet est arrivé ici ? Seulement si l’histoire peut être partagée.",
  tones: {
    amical: { label: "Une visite entre amis", detail: "Discuter et jouer sans rechercher de rapprochement physique.", effects: { affection: 5, trust: 8 }, lines: [P("Ça me fait plaisir de vous recevoir. On essaie ce jeu après avoir bu ?"), R("Volontiers. Mais vous m’expliquez les règles avant de commencer à gagner.", "smirk")] },
    amoureux: { label: "Tout près d’elle", detail: "Lui proposer une place à côté de vous et une soirée tendre.", effects: { affection: 8, trust: 6, desire: 3 }, lines: [P("Vous pouvez venir à côté de moi, si vous préférez."), N("Elle examine l’espace que vous lui laissez, puis y apporte sa tasse."), R("Oui. Mais je garde la moitié de la couverture.")] },
    desir: { label: "L’envie de rester", detail: "Lui dire votre attirance et la laisser répondre, sans décider de la suite.", effects: { affection: 6, trust: 6, desire: 7 }, lines: [P("J’ai très envie de vous embrasser. Je voulais vous le dire avant de passer la soirée à chercher comment."), R("Vous avez bien fait."), N("Elle pose sa tasse et vient vous embrasser. Sa main reste sur votre joue quand elle recule."), R("Nous avons encore le temps de jouer. Je ne suis pas pressée.", "smirk")] },
  },
  rounds: [
    {
      prompt: "Remerii cache des jetons sous son gobelet. « Trois. »",
      detail: "Elle dit cela avec un aplomb qui ne vous apprend rien. Vous avez entendu les jetons tomber, sans pouvoir les compter.",
      options: [
        O("rem-home-believe", "La croire et lui laisser révéler le nombre.", 2, N("Elle soulève le gobelet : trois jetons."), R("Une confiance récompensée. Je vous déconseille d’en tirer une habitude.")),
        O("rem-home-doubt", "Contester en soutenant son regard.", 2, N("Elle révèle trois jetons et prend celui qui marque sa victoire."), R("Vous avez perdu cette manche avec beaucoup de conviction. J’aime assez cela.", "smirk")),
        O("rem-home-ask", "Lui demander de refaire la manche pour mieux comprendre la règle.", 2, R("Bien sûr. Je vous montre cette fois, puis nous recommençons."), N("Elle répartit les jetons devant vous et ne compte pas la manche.")),
      ],
    },
    {
      prompt: "C’est à vous de cacher les jetons.",
      detail: "Remerii pose les coudes sur ses genoux et vous observe ostensiblement. « Ne cherchez pas à regarder votre propre gobelet pour vous rassurer. »",
      options: [
        O("rem-home-bluff", "Cacher deux jetons et en annoncer cinq.", 2, P("Cinq."), R("Vous avez répété ce chiffre dans votre tête avant de parler. Je conteste."), N("Elle a deviné juste. Vous lui montrez les deux jetons ; elle en cache aussitôt quatre pour vous proposer une revanche.")),
        O("rem-home-truth", "Annoncer honnêtement le nombre, en prenant un air trop mystérieux.", 2, N("Remerii hésite, puis conteste. Vous soulevez le gobelet."), R("Cet air était absolument superflu."), P("Pas tant que cela."), N("Elle rit et vous passe le jeton de la manche.")),
        O("rem-home-empty", "Ne cacher aucun jeton et le lui annoncer franchement.", 2, R("Vous m’obligez à me méfier du vide. Je vous crois."), N("Elle tapote le gobelet retourné, puis vous le rend pour une autre tentative.")),
      ],
    },
    {
      prompt: "Un jeton roule sous le fauteuil. Remerii se penche et le rattrape contre votre chaussure.",
      detail: "Elle le remet sur la table et reprend sa tasse. Le jeu peut s’arrêter là ou continuer pendant votre conversation.",
      options: [
        O("rem-home-another", "Proposer une dernière manche, sans miser autre chose que le plaisir de gagner.", 2, R("Dernière jusqu’à la prochaine ? Très bien."), N("Elle rassemble les jetons et vous laisse choisir qui commence.")),
        O("rem-home-talk", "Ranger les gobelets et lui demander de finir l’histoire qu’elle racontait en arrivant.", 2, R("Vous vous en souvenez. Alors laissez-moi reprendre à l’escalier."), N("Elle se cale dans le fauteuil et achève son récit, ponctué de vos questions.")),
        O("rem-home-walk", "Lui proposer de visiter le reste du logis avant de reprendre une boisson.", 2, R("Avec plaisir. Je laisse mon bracelet ici, si cela ne vous gêne pas."), N("Elle vous suit et s’arrête devant ce que vous prenez le temps de lui montrer.")),
      ],
    },
  ],
  results: {
    close: [N("Remerii rassemble les jetons près des gobelets."), R("Merci pour la soirée. Je connais maintenant votre adresse sans avoir besoin de la lire trois fois.")],
    warm: [N("Elle laisse le signet dépasser de votre livre pour que vous le retrouviez."), R("Vous m’écrirez quand vous voudrez recommencer ? J’aimerais beaucoup.")],
    perfect: [N("La dernière manche reste inscrite sur un petit morceau de papier. Remerii vous le tend avec le signet."), R("Gardez-le. Je me réserve le droit de venir contester le résultat.", "smirk")],
  },
};

const Q = (id: string, text: string, stat: StatKey, response: DialogueLine[], effects: Effects): ChoiceData => ({ id, text, stat, response, effects });

export const REMERII_RESIDENT_MOMENTS: HomeMoment[] = [
  {
    id: "home-remerii-0", title: "Le tiroir qui coince", characters: ["remerii"],
    intro: [N("Remerii retient un tiroir entrouvert. Une cuillère s’est prise en travers."), R("J’ai trouvé la résistance. Il me manque seulement une main assez petite pour l’atteindre sans condamner l’autre." )],
    choices: [
      Q("home-remerii-0-a", "Lui demander si la cuillère exige une rançon.", "audace", [R("Elle exige que nous retirions le tiroir. Je crains de devoir céder.", "smirk"), N("Vous soulevez le tiroir à deux et libérez enfin la cuillère.")], { affection: 4, trust: 2 }),
      Q("home-remerii-0-l", "Retirer doucement le tiroir avec elle.", "lucidite", [N("Remerii tient le côté droit pendant que vous dégagez l’autre."), R("Voilà. Je prendrai une boîte moins haute pour les couverts.")], { trust: 4, affection: 2 }),
      Q("home-remerii-0-s", "Proposer de garder le tiroir entrouvert jusqu’après le petit-déjeuner.", "sangFroid", [R("Très bien. La cuillère peut attendre. Votre pain, moins."), N("Elle vous rejoint à table et garde sa place près de la fenêtre.")], { affection: 3, trust: 3 }),
    ],
  },
  {
    id: "home-remerii-1", title: "Le chapitre interrompu", characters: ["remerii"],
    intro: [N("Remerii baisse son livre lorsque vous entrez. Deux tasses attendent près de la bouilloire."), R("J’ai entendu vos pas. Vous pouvez servir, il est encore chaud.")],
    choices: [
      Q("home-remerii-1-a", "Lui demander de lire un dialogue en donnant leur voix aux personnages.", "audace", [R("Vous regretterez cette demande au premier duc."), N("Elle prend une voix si grave que vous éclatez de rire avant la fin de la réplique."), R("Je vous avais prévenu.", "smirk")], { affection: 4 }),
      Q("home-remerii-1-l", "Lui demander ce qui lui plaît dans ce livre.", "lucidite", [N("Elle vous montre un passage après vous avoir laissé poser les tasses."), R("Cette conversation. Ils ont quelque chose à se dire et tournent autour depuis le début. Là, enfin, elle l’interrompt.")], { trust: 4, affection: 2 }),
      Q("home-remerii-1-s", "Apporter les deux tasses et la laisser finir son chapitre.", "sangFroid", [N("Elle vous fait une place et achève sa lecture. Quand elle ferme le livre, elle se tourne vers vous."), R("Merci. À vous : comment s’est passée votre journée ?")], { trust: 4, affection: 2 }),
    ],
  },
  {
    id: "home-remerii-2", title: "Un courant d’air", characters: ["remerii"],
    intro: [N("La couverture glisse du fauteuil de Remerii. Elle la rattrape du talon et regarde la fenêtre restée entrouverte."), R("Elle est ouverte pour une raison, ou puis-je la fermer ?")],
    choices: [
      Q("home-remerii-2-a", "Fermer la fenêtre et lui proposer de partager la couverture.", "audace", [R("Je garde ce bout. Il est déjà chaud."), N("Elle vous fait une place à côté d’elle, en tenant la couverture pour que vous puissiez vous asseoir.")], { affection: 4 }),
      Q("home-remerii-2-l", "Lui montrer comment bloquer le battant pour réduire le courant d’air.", "lucidite", [N("Elle vérifie le loquet, puis revient au fauteuil."), R("C’est mieux. Je m’en souviendrai ce soir, si vous souhaitez aérer encore.")], { trust: 4, affection: 2 }),
      Q("home-remerii-2-s", "Fermer la fenêtre et lui remonter la couverture sur les genoux.", "sangFroid", [R("Merci. Il me reste assez de chaleur pour vous écouter."), N("Elle sourit et tire une chaise près de la sienne.")], { affection: 3, trust: 3 }),
    ],
  },
  {
    id: "home-remerii-3", title: "Un signet sur la table", characters: ["remerii"],
    intro: [N("Remerii retrouve le signet sous une feuille. Elle le pose bien en vue, près de votre livre."), R("Je préfère vous éviter de vous en servir comme dessous de tasse. Il est assez plat pour que l’idée soit tentante.")],
    choices: [
      Q("home-remerii-3-a", "Lui montrer que la page est restée intacte grâce à son cadeau.", "audace", [R("Un usage approprié. Je suis émue.", "smirk"), N("Elle regarde la page et s’assied pour vous demander ce que vous êtes en train de lire.")], { affection: 4 }),
      Q("home-remerii-3-l", "Lui proposer de partager cette lecture.", "lucidite", [R("Lisez-moi ce passage, d’abord."), N("Vous reprenez le paragraphe. Elle garde ses questions jusqu’à la fin, puis rapproche le livre pour retrouver une phrase.")], { affection: 3, trust: 3 }),
      Q("home-remerii-3-s", "La remercier et ranger le signet avant de préparer une boisson.", "sangFroid", [N("Elle vous rejoint avec les tasses et vous demande si vous souhaitez vous installer près de la fenêtre."), R("Je vous garde la chaise pendant que vous servez.")], { trust: 4, affection: 2 }),
    ],
  },
];
