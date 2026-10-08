import { A, B, M, P, W, X, SLEPT, FAVORITE, type HeureVolee } from "./bellirith-intimacy-kit";

/*
 * Heure volée · au logis, après « La partie de salon ».
 * La partie de cartes truquée continue chez {player}. Chaque carte
 * retournée impose une règle à la maison, et la maison est la vôtre :
 * votre chaise, votre lampe, vos étagères, votre lit.
 */
export const HEURE_LOGIS: HeureVolee = {
  context: "bellirith-home",
  title: "La dernière donne",
  devLabel: "Logis",
  background: "/assets/backgrounds/bedroom.webp",
  opening: (flags) => [
    "La partie est finie depuis longtemps et Bellirith n’a pas rangé les cartes. Elle les bat d’une main, distraitement, assise de travers sur votre table, entre la bouteille sans étiquette et la lampe qu’elle a baissée sans vous demander la permission.",
    W(SLEPT, [
      B("Tu connais mes mains. Tu sais ce qu’elles font quand elles s’ennuient. Je te propose une dernière donne avant qu’elles trouvent une occupation toute seules.", "seductive"),
    ], [
      B("Je n’ai encore jamais dormi chez toi. Je n’ai pas dit que je comptais dormir. Une dernière donne ?", "seductive"),
    ]),
  ],
  approaches: () => [
    { id: "logis-couper", text: "Couper le paquet vous-même.", lines: [
      "Vous tendez la main et coupez le paquet avant qu’elle ait fini de le battre. Elle regarde vos doigts posés sur ses cartes comme on regarde quelqu’un qui vient de s’asseoir sur son trône.",
      B("Chez toi, tu coupes. D’accord. C’est moi qui distribue.", "teasing"),
    ] },
    { id: "logis-mise", text: "Demander quel est l’enjeu.", lines: [
      P("On joue pour quoi ?"),
      B("Pour la maison. Chaque carte impose une règle sous ton toit, jusqu’à ce qu’il n’en reste plus. Tu peux refuser de jouer, évidemment.", "smirk"),
      P("Distribue."),
    ] },
  ],
  ending: (flags) => [
    "Au matin, vous trouvez la dame de pique posée bien en vue sur votre étagère, appuyée contre vos affaires comme si elle avait toujours été là.",
    W(FAVORITE, [
      B("Ta maison me plaît. Je l’ai trichée de fond en comble. Garde la carte : c’est ma clé, maintenant, et je ne te demande pas ton avis.", "teasing"),
    ], [
      B("Garde la carte. Elle ne vaut rien au jeu. Chez toi, elle veut dire que je reviendrai.", "thoughtful"),
    ]),
  ],
  route: {
    id: "bellirith-heure-logis",
    context: "bellirith-home",
    text: "Une règle par carte",
    detail: "La partie truquée continue sous votre toit. Chaque carte retournée impose une règle à votre maison ; elle triche, vous le savez, et vous finissez par reprendre le paquet.",
    visual: { revealChapter: 4, postOrgasmChapter: 11 },
    chapters: [
      A(
        "Elle étale cinq cartes face cachée sur votre table, en éventail, et pose le reste du paquet à côté de la bouteille.",
        B("Règle du jeu : on retourne une carte chacun son tour. La carte décide d’une règle pour ta maison, et la règle tient jusqu’à ce qu’une autre carte l’annule.", "teasing"),
        P("Et qui invente les règles ?"),
        B("Celui qui retourne la carte. Tu vois, c’est très démocratique. Je commence.", "smirk"),
      ),
      A(
        "Elle retourne la dame de cœur et la fait claquer sur le bois.",
        B("Dame de cœur. Règle : tu n’as plus le droit de te lever de cette chaise. Ta chaise, ta maison, ta prison.", "seductive"),
        W(SLEPT, [
          B("La dernière fois, tu t’es levé·e trop tôt. Je corrige.", "teasing"),
        ], [
          B("J’ai toujours rêvé de savoir ce que tu ferais, cloué·e sur ta propre chaise.", "teasing"),
        ]),
      ),
      M(
        [
          "Elle fait le tour de la table et s’assied à califourchon sur vos genoux. Vous n’avez pas le droit de vous lever ; elle en profite pour vous embrasser longuement, les mains dans vos cheveux.",
        ],
        [
          "Elle fait le tour de la table sans se presser, en caressant le dossier de chaque chaise au passage, puis s’assied à califourchon sur vos genoux. Vous n’avez pas le droit de vous lever. Elle en profite.",
          "Elle vous embrasse longuement, les mains dans vos cheveux, puis défait votre chemise et la laisse pendre sur le dossier, comme un trophée accroché chez l’ennemi.",
        ],
        [
          "Elle fait le tour de la table sans se presser, en caressant le dossier de chaque chaise au passage, puis s’assied à califourchon sur vos genoux. Vous n’avez pas le droit de vous lever. Elle en profite.",
          "Elle vous embrasse longuement, les mains dans vos cheveux, puis défait votre chemise et la laisse pendre sur le dossier, comme un trophée accroché chez l’ennemi.",
          X(
            "Elle baisse la tête et prend la pointe d’un de vos seins entre ses lèvres. Vous vous cambrez sur la chaise ; elle vous rappelle à l’ordre d’une main posée sur votre ventre, et continue, plus lentement.",
            "Elle ondule sur vos genoux, juste assez pour sentir votre désir durcir sous elle, et sourit contre votre bouche en vous rappelant que vous n’avez pas le droit de bouger.",
            "Elle ondule sur vos genoux et sent votre vigueur se dresser contre elle. Elle glisse une main sous votre ceinture, effleure aussi votre chaleur, et sourit en vous rappelant que vous n’avez pas le droit de bouger.",
          ),
        ],
        ["Dame de cœur : vous ne pouvez plus quitter votre chaise. Elle s’assied sur vous."],
      ),
      M(
        [
          "Votre tour. Vous tendez le bras et retournez un valet de pique. Votre règle : elle garde les mains derrière le dos. Elle obéit, scandalisée, et continue avec la bouche seulement.",
        ],
        [
          "Votre tour. Vous tendez le bras par-dessus son épaule et retournez un valet de pique.",
          P("Valet de pique. Règle : tes mains restent derrière ton dos."),
          "Elle vous regarde comme si vous veniez de confisquer son royaume. Puis, lentement, elle croise les poignets dans son dos et se penche vers vous. Privée de ses mains, elle se sert de sa bouche avec une application vexée qui vous fait perdre le fil.",
        ],
        [
          "Votre tour. Vous tendez le bras par-dessus son épaule et retournez un valet de pique.",
          P("Valet de pique. Règle : tes mains restent derrière ton dos."),
          "Elle vous regarde comme si vous veniez de confisquer son royaume. Puis, lentement, elle croise les poignets dans son dos et se penche vers vous. Privée de ses mains, elle se sert de sa bouche avec une application vexée : votre cou, votre clavicule, votre ventre, jusqu’à glisser de vos genoux pour s’agenouiller entre vos jambes.",
          X(
            "Elle défait votre ceinture avec les dents, tire le tissu le long de vos cuisses et pose la bouche sur votre chaleur, les mains toujours sagement croisées dans le dos, en vous regardant par en dessous.",
            "Elle défait votre ceinture avec les dents, libère votre virilité d’un coup de menton et la prend entre ses lèvres sans l’aide de ses mains, en vous regardant par en dessous.",
            "Elle défait votre ceinture avec les dents, prend votre vigueur entre ses lèvres puis descend jusqu’à votre chaleur, alternant de l’une à l’autre sans l’aide de ses mains, en vous regardant par en dessous.",
          ),
        ],
        ["Valet de pique : ses mains restent dans son dos. Elle se débrouille très bien sans."],
      ),
      M(
        [
          "Elle se relève et retourne une carte qu’elle tenait déjà dans sa manche. Règle : on change de pièce. Elle vous emmène dans votre propre chambre et se déshabille à la lumière de votre lampe.",
        ],
        [
          "Elle se relève, les lèvres brillantes, et retourne une carte. Vous êtes à peu près sûr·e qu’elle sortait de sa manche.",
          B("Sept de carreau. Règle : on change de pièce. Et la dame de cœur est annulée : tu peux te lever. Tu vas en avoir besoin.", "smirk"),
          "Elle vous précède dans votre chambre comme si elle y vivait, passe un doigt sur vos étagères, soulève un objet, le repose ailleurs. Puis elle se dévêt à la lumière de votre lampe, avec la lenteur de quelqu’un qui prend possession des lieux.",
        ],
        [
          "Elle se relève, les lèvres brillantes, et retourne une carte. Vous êtes à peu près sûr·e qu’elle sortait de sa manche.",
          B("Sept de carreau. Règle : on change de pièce. Et la dame de cœur est annulée : tu peux te lever. Tu vas en avoir besoin.", "smirk"),
          "Elle vous précède dans votre chambre comme si elle y vivait, passe un doigt sur vos étagères, soulève un objet, le repose ailleurs. Puis elle se dévêt à la lumière de votre lampe, avec la lenteur de quelqu’un qui prend possession des lieux : la robe d’abord, puis les bas qu’elle roule le long de ses jambes l’un après l’autre, jusqu’à rester nue devant votre fenêtre, ses seins dorés par la lampe, une main sur la hanche.",
        ],
        ["Une carte tirée de sa manche, une autre pièce. Elle se déshabille dans votre chambre."],
      ),
      A(
        "Un deuxième sept de carreau dépasse de la robe qu’elle vient de jeter sur votre lit. Vous le ramassez et le lui montrez.",
        B("Ah. Celui-là, c’est un jumeau. Ils sont très proches.", "teasing"),
        P("Donne-moi le paquet. À partir de maintenant, c’est moi qui distribue."),
        "Elle hésite assez longtemps pour que vous compreniez à quel point la demande lui coûte. Puis elle vous tend les cartes, sans un mot, et s’allonge en travers de votre lit pour regarder la suite.",
      ),
      M(
        [
          "Vous retournez l’as de carreau. Règle : elle doit dire à voix haute ce qu’elle veut avant chaque caresse. Elle s’y plie, mot après mot, et chaque aveu lui coûte un peu plus que le précédent.",
        ],
        [
          "Vous retournez l’as de carreau.",
          P("As de carreau. Règle : avant chaque caresse, tu dis ce que tu veux. À voix haute."),
          B("C’est de la cruauté pure.", "angry"),
          "Mais elle joue. Elle demande votre bouche sur son épaule, puis plus bas, puis votre main à un endroit précis, et chaque phrase lui sort un peu plus difficilement, un peu plus vraie. Vous obéissez à chacune, sans en ajouter une seule.",
        ],
        [
          "Vous retournez l’as de carreau.",
          P("As de carreau. Règle : avant chaque caresse, tu dis ce que tu veux. À voix haute."),
          B("C’est de la cruauté pure.", "angry"),
          "Mais elle joue. Elle demande votre bouche sur son épaule, puis sur ses seins, puis votre main entre ses cuisses, et chaque phrase lui sort un peu plus difficilement, un peu plus vraie. Vous obéissez à chacune, sans en ajouter une seule.",
          B("Ta langue. Là. Lentement. Ne fais pas semblant de ne pas avoir compris.", "seductive"),
          "Vous posez la bouche sur son intimité et la goûtez exactement comme elle l’a demandé, lentement, en suivant les instructions qu’elle vous donne d’une voix de plus en plus brisée, jusqu’à ce qu’elle oublie de parler et serre vos cheveux à pleines mains.",
        ],
        ["As de carreau : elle doit demander chaque caresse à voix haute. Elle demande."],
      ),
      M(
        [
          "Elle vous reprend le paquet d’un geste vif et retourne une carte au hasard, honnêtement pour une fois : le roi de trèfle. Elle vous fait asseoir au bord du lit et s’agenouille devant vous.",
        ],
        [
          "Elle vous reprend le paquet d’un geste vif et retourne une carte au hasard, honnêtement pour une fois.",
          B("Roi de trèfle. Règle : le roi s’assied, et sa cour s’occupe de lui.", "seductive"),
          "Elle vous fait asseoir au bord de votre lit et s’agenouille sur votre tapis, entre vos genoux, avec une révérence moqueuse.",
        ],
        [
          "Elle vous reprend le paquet d’un geste vif et retourne une carte au hasard, honnêtement pour une fois.",
          B("Roi de trèfle. Règle : le roi s’assied, et sa cour s’occupe de lui.", "seductive"),
          "Elle vous fait asseoir au bord de votre lit et s’agenouille sur votre tapis, entre vos genoux, avec une révérence moqueuse.",
          X(
            "Elle écarte vos cuisses et vous caresse d’abord du plat de la main, longuement, avant de glisser deux doigts en vous et d’effleurer votre perle de la langue. Elle mène la cadence avec une patience de courtisane qui sait exactement quand le roi va céder.",
            "Elle prend votre virilité à deux mains, la caresse de la base au sommet, puis la conduit entre ses lèvres. Elle mène la cadence avec une patience de courtisane qui sait exactement quand le roi va céder.",
            "Elle prend votre vigueur dans une main et glisse l’autre entre vos cuisses jusqu’à votre chaleur, puis vous goûte d’un côté pendant que ses doigts vous caressent de l’autre. Elle mène la cadence avec une patience de courtisane qui sait exactement quand le roi va céder.",
          ),
        ],
        ["Roi de trèfle : vous voilà assis·e au bord du lit, servi·e à genoux."],
      ),
      A(
        "Elle s’arrête avant la fin, remonte sur le lit et regarde autour d’elle : vos étagères, vos affaires pliées, la tasse que vous avez oubliée sur la table de nuit.",
        B("Tout, ici, te ressemble. C’est insupportable. Ça me donne envie de laisser une trace partout.", "thoughtful"),
        W(SLEPT, [
          P("Tu en as déjà laissé."),
          B("Je sais. Je vérifie qu’elles tiennent.", "smirk"),
        ], [
          P("Commence par le lit."),
          B("J’allais te le proposer.", "smirk"),
        ]),
      ),
      M(
        [
          "Elle vous attire sous vos propres draps. Vous vous unissez lentement, puis vous la retournez sur le dos et elle se laisse faire, une carte coincée sous l’oreiller.",
        ],
        [
          "Elle vous attire sous vos propres draps et s’installe sur vous. Vous vous unissez lentement, ses mains à plat sur votre poitrine. Puis vous la faites rouler sur le dos ; elle se laisse faire en riant, et une carte oubliée crisse sous l’oreiller.",
        ],
        [
          "Elle vous attire sous vos propres draps et s’installe sur vous, ses mains à plat sur votre poitrine.",
          X(
            "Elle frotte son intimité contre la vôtre, d’avant en arrière, avec une lenteur qui vous arrache des plaintes, puis vous faites rouler vos deux corps et c’est vous qui menez, vos chaleurs pressées l’une contre l’autre, vos doigts glissés en elle.",
            "Elle descend sur votre virilité jusqu’au bout et vous chevauche lentement, puis vous la faites rouler sur le dos et c’est vous qui la prenez, profondément, ses talons noués dans le creux de vos reins.",
            "Elle descend sur votre vigueur jusqu’au bout et vous chevauche lentement en caressant votre chaleur du bout des doigts, puis vous la faites rouler sur le dos et c’est vous qui la prenez, ses talons noués dans le creux de vos reins.",
          ),
          "Elle se laisse faire en riant, et une carte oubliée crisse sous l’oreiller.",
        ],
        ["Sous vos draps, vous vous unissez. Une carte oubliée crisse sous l’oreiller."],
      ),
      M(
        [
          "Vous basculez ensemble dans votre lit, elle en vous serrant contre elle comme si elle avait peur que la maison vous reprenne.",
        ],
        [
          "Le plaisir monte sans ruse ni règle. Elle bascule la première, accrochée à vous, et vous la suivez presque aussitôt dans votre lit défait.",
        ],
        [
          "Le plaisir monte sans ruse ni règle. Elle bascule la première, cambrée sous vous, les ongles plantés dans vos épaules, et garde les yeux ouverts jusqu’au bout pour vous regarder la suivre.",
          X(
            "Ses spasmes contre vous vous entraînent à votre tour, et vous jouissez en écrasant votre bouche contre la sienne.",
            "Ses spasmes autour de vous vous entraînent à votre tour, et vous jouissez en elle en écrasant votre bouche contre la sienne.",
            "Ses spasmes autour de votre vigueur vous entraînent, sa main pressée contre votre chaleur, et vous jouissez des deux côtés en écrasant votre bouche contre la sienne.",
          ),
        ],
        ["Plus de règles. Vous basculez ensemble dans votre lit défait."],
      ),
      M(
        [
          "Elle reste allongée sur votre poitrine et regarde votre plafond comme si elle le découvrait.",
        ],
        [
          "Elle reste allongée sur votre poitrine, le menton sur votre cœur, et regarde votre plafond comme on regarde le ciel d’un pays étranger.",
        ],
        [
          "Elle reste allongée sur votre poitrine, nue, le menton sur votre cœur, une jambe passée sur les vôtres, et regarde votre plafond comme on regarde le ciel d’un pays étranger. Ses cheveux couvrent la moitié de votre lit.",
          "Son souffle ralentit contre votre peau. Elle attrape une carte égarée dans les draps, l’examine, puis la glisse sous votre oreiller sans la moindre explication.",
        ],
        ["Elle regarde votre plafond, la tête sur votre cœur."],
      ),
      A(
        "Elle tend le bras vers la table de nuit, où elle a posé le reste du paquet, et retourne la dernière carte. C’est la dame de pique.",
        B("Dernière règle. Elle tient jusqu’à ce que tu la défasses toi-même.", "thoughtful"),
        P("Laquelle ?"),
        W(SLEPT, [
          B("Tu me gardes une place dans ce lit. Le côté gauche. Je l’ai essayé deux fois ; c’est le meilleur.", "teasing"),
        ], [
          B("Je reviens. C’est tout. Je n’ai pas trouvé mieux, et j’ai cherché.", "thoughtful"),
        ]),
      ),
    ],
  },
};
