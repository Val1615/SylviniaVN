import { A, B, M, P, W, X, FAVORITE, TREND_RESISTED, type HeureVolee } from "./bellirith-intimacy-kit";

/*
 * Heure volée · « Vérifie encore. »
 * Le matin d’après, dans le lit. Elle a annoncé qu’elle choisirait le
 * rythme et qu’elle écouterait peut-être vos protestations : toute la
 * scène est construite sur cette lenteur imposée, la carte des endroits
 * retrouvés et le plateau du petit déjeuner qui refroidit derrière la
 * porte. La proposition exige déjà une nuit partagée.
 */
export const HEURE_MATIN: HeureVolee = {
  context: "bellirith-free-matin",
  title: "L’inventaire du matin",
  devLabel: "Matin (proposition)",
  background: "/assets/backgrounds/bedroom.webp",
  opening: (flags) => [
    "Le soleil passe entre les rideaux mal tirés et découpe une bande dorée en travers du lit. Elle a encore la marque de l’oreiller sur la joue et les cheveux dans un désordre qu’aucune cour ne lui a jamais vu.",
    W(FAVORITE, [
      B("Mon favori réclame un supplément avant même le thé. Je note. Je note tout.", "teasing"),
    ], [
      B("Tu as dit encore. J’ai bien entendu encore. Ne fais pas semblant d’avoir dit autre chose.", "teasing"),
    ]),
  ],
  approaches: () => [
    { id: "matin-immobile", text: "Ne plus bouger d’un cil et la laisser chercher.", lines: [
      "Vous fermez les yeux et vous laissez retomber sur l’oreiller, parfaitement immobile.",
      B("Une statue. Très bien. J’ai toujours aimé les musées le matin, il n’y a personne.", "smirk"),
    ] },
    { id: "matin-attirer", text: "L’attirer contre vous sous les draps.", lines: [
      "Vous passez un bras autour de sa taille et la ramenez contre vous. Elle se laisse faire, puis vous tapote le poignet.",
      B("Déjà une tentative de prise de pouvoir. Je l’ajoute à la liste.", "teasing"),
    ] },
  ],
  ending: (flags) => [
    "Il est presque midi quand vous vous levez enfin. Le plateau a été ramené à l’intérieur, dévalisé, et le lit est plein de miettes.",
    W(TREND_RESISTED, [
      B("Toi qui dis non à tout le reste, tu m’as dit encore trois fois ce matin. Je compte, figure-toi.", "smirk"),
    ], [
      B("Demain, je vérifie un autre endroit. J’en ai repéré un hier soir, et tu ne sais même pas lequel.", "seductive"),
    ]),
  ],
  route: {
    id: "bellirith-heure-matin",
    context: "bellirith-free-matin",
    text: "Elle choisit le rythme",
    detail: "Elle a dit qu’elle choisirait le rythme ce matin et que vous pourriez protester. Elle tient parole sur le premier point. Pour le second, elle verra.",
    visual: { revealChapter: 4, postOrgasmChapter: 11 },
    chapters: [
      A(
        "Son doigt reprend la ligne sur votre épaule, descend le long de la clavicule, remonte vers le cou et s’arrête juste sous l’oreille.",
        "Votre souffle se suspend tout seul.",
        B("Il n’a pas bougé. Parfait. Je voulais en avoir le cœur net avant de commencer l’inventaire.", "smirk"),
        P("L’inventaire ?"),
        B("De tous les endroits trouvés jusqu’ici. Il faut vérifier qu’ils sont encore là. On ne sait jamais, avec les nuits.", "teasing"),
      ),
      A(
        B("Rappel des règles. Ce matin, je choisis le rythme. Tu as le droit de protester.", "teasing"),
        P("Je proteste déjà."),
        B("Protestation reçue, examinée et rejetée. Ne te décourage pas, tu en as d’autres.", "smirk"),
        "Elle repousse le drap jusqu’à votre taille, avec la lenteur d’une archiviste qui déroule un parchemin précieux.",
      ),
      M(
        [
          "Elle reprend la carte de votre corps, point par point : l’intérieur du poignet, le pli du coude, la peau fine sous les côtes. Chaque fois que vous frissonnez, elle hoche la tête, satisfaite.",
        ],
        [
          "Elle reprend la carte de votre corps, point par point. L’intérieur du poignet, qu’elle embrasse en vous regardant. Le pli du coude. La peau fine sous les côtes, qu’elle frôle à peine.",
          "Chaque fois que vous frissonnez, elle hoche la tête avec un sérieux absurde, comme une notaire qui vérifie un acte. Vous sentez son sourire contre votre ventre.",
        ],
        [
          "Elle reprend la carte de votre corps, point par point. L’intérieur du poignet, qu’elle embrasse en vous regardant. Le pli du coude. La peau fine sous les côtes, qu’elle frôle à peine.",
          X(
            "Elle s’attarde sur vos seins, fait rouler leurs pointes entre ses lèvres l’une après l’autre, puis reprend sa tournée comme si de rien n’était, le long de vos hanches.",
            "Elle s’attarde sur votre torse, mordille un téton, puis descend jusqu’à votre aine et souffle sur votre désir déjà dressé sans le toucher, avant de reprendre sa tournée le long de vos hanches.",
            "Elle s’attarde sur votre poitrine, fait rouler une pointe entre ses lèvres, puis descend jusqu’à votre aine et souffle sur votre vigueur sans la toucher, avant de reprendre sa tournée le long de vos hanches.",
          ),
          "Chaque fois que vous frissonnez, elle hoche la tête avec un sérieux absurde, comme une notaire qui vérifie un acte. Vous sentez son sourire contre votre ventre.",
        ],
        ["Elle refait la carte de votre corps, endroit par endroit, sans se presser."],
      ),
      M(
        [
          "Vous tentez de l’attirer plus près. D’un seul doigt posé sur votre poignet, elle ramène votre main sur l’oreiller.",
          B("Protestation numéro deux. Rejetée.", "teasing"),
        ],
        [
          "Vous glissez une main dans ses cheveux pour la ramener vers votre bouche. Elle ne résiste pas. Elle pose simplement un doigt sur votre poignet, et le ramène sur l’oreiller, à côté de votre tête.",
          B("Protestation numéro deux. Rejetée, elle aussi. Mais elle était mieux formulée.", "teasing"),
          "Elle laisse son doigt sur votre poignet. Vous pourriez vous dégager sans effort. Vous ne bougez pas.",
        ],
        [
          "Vous glissez une main dans ses cheveux pour la ramener vers votre bouche. Elle ne résiste pas. Elle pose simplement un doigt sur votre poignet, et le ramène sur l’oreiller, à côté de votre tête.",
          B("Protestation numéro deux. Rejetée, elle aussi. Mais elle était mieux formulée.", "teasing"),
          "Elle laisse son doigt sur votre poignet. Vous pourriez vous dégager sans effort. Vous ne bougez pas, et elle vous récompense d’un baiser lent, au goût de sommeil, qui vous fait arquer le dos sous elle.",
        ],
        ["Vous voulez la presser. Un doigt sur votre poignet suffit à vous arrêter."],
      ),
      M(
        [
          "Elle se redresse, et le drap glisse de ses épaules. Dans la lumière du matin, sans fard ni parure, elle est plus belle que dans ses robes de cour.",
        ],
        [
          "Elle se redresse à genoux, et le drap glisse de ses épaules jusqu’à sa taille, puis plus bas. Elle ne le retient pas.",
          "La bande de soleil la traverse en diagonale. Sans fard, sans bijoux, l’aura encore endormie, elle a l’air plus jeune et plus dangereuse à la fois.",
        ],
        [
          "Elle se redresse à genoux, et le drap glisse de ses épaules jusqu’à sa taille, puis plus bas. Elle ne le retient pas. Elle reste nue dans la lumière, les cheveux en bataille, les seins dorés par le soleil, la peau encore marquée par les plis du drap.",
          "La bande de soleil la traverse en diagonale. Sans fard, sans bijoux, l’aura encore endormie, elle a l’air plus jeune et plus dangereuse à la fois, et elle sait très bien ce que vous êtes en train de regarder.",
          "Elle passe une main dans ses cheveux pour les relever, ce qui ne sert à rien, et les laisse retomber sur ses épaules. Puis elle se penche au-dessus de vous, assez près pour que la pointe de ses seins effleure votre poitrine à chaque respiration, et pas plus près.",
        ],
        ["Le drap tombe. Elle est nue dans le soleil du matin, sans fard."],
      ),
      M(
        [
          "Elle vous caresse avec une lenteur exaspérante, s’arrêtant chaque fois que vous accélérez le souffle, reprenant quand vous vous calmez.",
        ],
        [
          "Elle vous caresse avec une lenteur exaspérante. Chaque fois que votre souffle s’accélère, sa main s’arrête et attend. Quand vous vous calmez, elle reprend exactement là où elle s’était interrompue.",
          B("Le rythme, c’est moi. Tu te souviens ?", "seductive"),
        ],
        [
          X(
            "Sa main descend entre vos cuisses et vous caresse avec une lenteur exaspérante, un doigt glissant le long de votre intimité sans jamais appuyer sur votre perle. Chaque fois que votre souffle s’accélère, elle s’arrête et attend.",
            "Sa main se referme sur votre virilité et vous caresse avec une lenteur exaspérante, du bas jusqu’au sommet, un seul passage à la fois. Chaque fois que votre souffle s’accélère, elle s’arrête et attend.",
            "Sa main se referme sur votre vigueur pendant que deux doigts de l’autre effleurent votre chaleur, avec une lenteur exaspérante, un seul passage à la fois. Chaque fois que votre souffle s’accélère, elle s’arrête et attend.",
          ),
          "Quand vous vous calmez, elle reprend exactement là où elle s’était interrompue, sans un millimètre d’écart.",
          B("Le rythme, c’est moi. Tu te souviens ?", "seductive"),
        ],
        ["Elle vous caresse au ralenti, et s’arrête chaque fois que vous accélérez."],
      ),
      A(
        "On frappe à la porte. Trois coups discrets.",
        "« Le petit déjeuner, madame. »",
        "Sa main ne s’arrête pas. Sa voix, quand elle répond, est d’un calme parfait.",
        B("Laissez le plateau dans le couloir.", "cold"),
        "« Le thé va refroidir, madame. »",
        B("Il refroidira.", "cold"),
        "Vous vous mordez le dos de la main pour ne pas faire de bruit. Les pas s’éloignent. Elle vous regarde, enchantée par votre supplice.",
      ),
      M(
        [
          P("Plus vite. S’il te plaît."),
          "Elle fait mine de réfléchir.",
          B("Protestation numéro trois. Retenue.", "smirk"),
          "Et elle vous laisse enfin la faire basculer sur le dos.",
        ],
        [
          P("Plus vite. S’il te plaît. Ou laisse-moi te toucher."),
          "Elle penche la tête, fait mine de peser votre requête sur une balance invisible.",
          B("Protestation numéro trois. Retenue, pour la politesse. Le s’il te plaît a fait pencher la balance.", "smirk"),
          "Elle se laisse retomber sur le dos, les bras en croix au milieu de la bande de soleil, et vous laisse prendre la place.",
        ],
        [
          P("Plus vite. S’il te plaît. Ou laisse-moi te toucher."),
          "Elle penche la tête, fait mine de peser votre requête sur une balance invisible, sans que sa main s’arrête tout à fait.",
          B("Protestation numéro trois. Retenue, pour la politesse. Le s’il te plaît a fait pencher la balance.", "smirk"),
          "Elle se laisse retomber sur le dos, les bras en croix au milieu de la bande de soleil, les jambes déjà ouvertes, et vous laisse prendre la place. Vous restez un moment à genoux entre ses cuisses, à la regarder respirer dans la lumière, et c’est elle, cette fois, qui finit par perdre patience.",
        ],
        ["Vous la suppliez. Elle accepte, pour le s’il te plaît, et se laisse basculer."],
      ),
      M(
        [
          "Vous l’embrassez partout où le soleil la touche, puis plus bas, jusqu’à la faire rire de plaisir, la tête renversée dans les oreillers.",
        ],
        [
          "Vous suivez la bande de soleil sur son corps et vous l’embrassez partout où la lumière la touche : l’épaule, le sein, la hanche, le genou.",
          "Puis vous quittez la lumière pour descendre plus bas, et elle rit, d’un rire de matin, la tête renversée dans les oreillers.",
        ],
        [
          "Vous suivez la bande de soleil sur son corps et vous l’embrassez partout où la lumière la touche : l’épaule, la pointe d’un sein, la hanche, le genou.",
          "Puis vous quittez la lumière pour descendre entre ses cuisses. Vous la goûtez à votre tour avec la même lenteur qu’elle vous a imposée, la langue paresseuse sur sa perle, deux doigts en elle qui bougent à peine. Elle rit, d’un rire de matin, la tête renversée dans les oreillers, puis le rire se brise et elle jouit contre votre bouche en vous tenant par les cheveux.",
        ],
        ["Vous l’embrassez partout où le soleil la touche, puis plus bas. Elle rit, la tête dans les oreillers."],
      ),
      M(
        [
          "Elle se tourne sur le côté et vous attire dans son dos. Vous vous unissez ainsi, lovés l’un contre l’autre, sans hâte, comme on se rendort.",
        ],
        [
          "Elle se tourne sur le côté et vous attire contre son dos, votre bras passé sous le sien.",
          "Vous vous unissez ainsi, lovés l’un contre l’autre, avec une paresse délicieuse, presque sans bouger, comme on se rendort. Dans le couloir, le thé refroidit.",
        ],
        [
          "Elle se tourne sur le côté et vous attire contre son dos, votre bras passé sous le sien, votre main sur son sein.",
          X(
            "Vous glissez une cuisse entre les siennes et votre main descend sur son intimité pendant que la sienne trouve la vôtre, en arrière. Vous vous caressez ainsi l’une l’autre, lovées, presque sans bouger.",
            "Elle soulève un peu la jambe et vous guide en elle, par-derrière, d’un mouvement paresseux. Vous bougez à peine, lovés l’un contre l’autre, en longues poussées lentes.",
            "Elle soulève un peu la jambe et guide votre vigueur en elle, par-derrière, d’un mouvement paresseux, puis passe une main en arrière pour caresser votre chaleur. Vous bougez à peine, lovés l’un contre l’autre.",
          ),
          "Une paresse délicieuse, comme on se rendort. Dans le couloir, le thé refroidit.",
        ],
        ["Lovés sur le côté, vous vous unissez sans hâte."],
      ),
      M(
        [
          "Le plaisir vient tard, longuement, comme une vague qui prend son temps pour arriver au rivage.",
        ],
        [
          "Le plaisir vient tard. Il monte si lentement que vous ne le voyez pas arriver, puis il vous emporte tous les deux, longuement, comme une vague qui a pris son temps pour atteindre le rivage.",
        ],
        [
          "Le plaisir vient tard. Il monte si lentement que vous ne le voyez pas arriver.",
          X(
            "Elle jouit la première, de nouveau, sous vos doigts, et c’est sa main crispée entre vos cuisses qui vous emporte ensuite, longuement, comme une vague qui a pris son temps pour atteindre le rivage.",
            "Elle se resserre autour de vous en gémissant, et vous jouissez en elle à votre tour, longuement, comme une vague qui a pris son temps pour atteindre le rivage.",
            "Elle se resserre autour de votre vigueur en gémissant, ses doigts pressés contre votre chaleur, et vous jouissez à votre tour, longuement, comme une vague qui a pris son temps pour atteindre le rivage.",
          ),
        ],
        ["Le plaisir monte lentement, puis vous emporte longtemps."],
      ),
      M(
        [
          "Elle va chercher le plateau elle-même, nue, et vous le ramène au lit. Le thé est froid. Elle le boit quand même.",
        ],
        [
          "Elle se lève, traverse la chambre sans prendre la peine de se couvrir, entrouvre la porte et ramène le plateau dans le lit.",
          "Le thé est froid. Elle le boit quand même, à petites gorgées, et vous tend un morceau de pain beurré sans vous regarder, comme si c’était la chose la plus naturelle du monde.",
        ],
        [
          "Elle se lève, traverse la chambre sans prendre la peine de se couvrir, entrouvre la porte juste assez pour attraper le plateau et ramène tout dans le lit, en riant quand une tasse manque de se renverser sur vos cuisses.",
          "Le thé est froid. Elle le boit quand même, à petites gorgées, et vous tend un morceau de pain beurré sans vous regarder, comme si c’était la chose la plus naturelle du monde. Vous mangez dans les draps défaits, épaule contre épaule, sa jambe nue posée en travers des vôtres. Une goutte de miel tombe sur son ventre ; elle vous regarde la lécher sans faire le moindre commentaire.",
        ],
        ["Elle ramène le plateau au lit. Le thé est froid. Vous mangez dans les draps."],
      ),
      A(
        B("Bilan de l’inventaire : tout est à sa place. Un endroit nouveau découvert derrière ton genou. Je l’inscris au registre.", "teasing"),
        P("Et mes protestations ?"),
        B("Une sur trois retenue. C’est un excellent taux. Les tribunaux du royaume font bien pire.", "smirk"),
        W(FAVORITE, [
          "Elle repose sa tasse et vous embrasse sur la tempe, distraitement, le geste de quelqu’un qui a pris une habitude et ne compte pas la perdre.",
        ], [
          "Elle repose sa tasse et vous regarde un moment, sérieuse, comme si elle venait de découvrir un endroit qui ne figurait sur aucune carte.",
        ]),
      ),
    ],
  },
};
