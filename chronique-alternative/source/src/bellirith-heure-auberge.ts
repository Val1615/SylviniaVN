import { A, B, M, P, W, X, SLEPT, type HeureVolee } from "./bellirith-intimacy-kit";

/*
 * Heure volée · après « Le prix d’une envie ».
 * Une chambre d’auberge louée pour une heure derrière le Grand Marché,
 * la lumière du matin, les cris des marchands sous la fenêtre. Le pari
 * continue : à chaque quart d’heure, l’un nomme ce que l’autre désire.
 * Le choix du rendez-vous décide de qui tient la montre (ou de la cloche).
 */
const LUC = "bellirith-marche:lucidite";
const AUD = "bellirith-marche:audace";
const BRIOCHE = "bellirith-marche:brioche";

export const HEURE_AUBERGE: HeureVolee = {
  context: "date-bellirith-market",
  title: "Une heure à l’Enseigne du Pesage",
  devLabel: "Auberge du marché",
  background: "/assets/backgrounds/forestier_room.webp",
  opening: (flags) => [
    "L’Enseigne du Pesage loue ses chambres à l’heure aux marchands qui ont besoin de compter leur recette au calme. L’aubergiste regarde la robe rose de Bellirith, puis vous, puis décide de ne rien regarder du tout.",
    W(AUD, [
      "C’est vous qui payez, avec la montre de l’horloger qu’elle vous a donnée tout à l’heure. L’aubergiste la rend aussitôt, effrayé par sa valeur, et accepte trois pièces à la place. La montre reste dans votre poche.",
    ], [W(LUC, [
      "Elle paie avec une pièce d’or posée sur le comptoir d’un seul doigt. La montre, elle l’a rendue au vieil horloger après avoir perdu son pari ; elle a les mains vides et ne semble pas savoir quoi en faire.",
    ], [
      "Elle paie avec la montre ancienne, posée sur le comptoir sans un mot. L’aubergiste la lui rend, épouvanté, et prend trois pièces à la place.",
    ])]),
    B("Une heure, et je compte les minutes. Je déteste les gens qui s’attardent. Sauf exception.", "smirk"),
  ],
  approaches: () => [
    { id: "auberge-premier", text: "Proposer de nommer le premier désir.", lines: [
      P("Le pari continue. Je commence."),
      B("Tu commences. Dans une chambre que j’ai louée. Tu as un sens de la propriété très particulier.", "teasing"),
    ] },
    { id: "auberge-volets", text: "Ouvrir les volets avant toute chose.", lines: [
      "Vous traversez la chambre et poussez les volets. Le soleil du matin entre d’un coup avec l’odeur du pain, et le marché crie ses premiers prix juste sous la fenêtre.",
      B("La lumière du jour. Sur moi. Tu sais que les démones préfèrent les chandelles ?", "thoughtful"),
      P("Je sais surtout que tu mens."),
    ] },
  ],
  ending: (flags) => [
    "Vous redescendez l’escalier étroit pendant que l’aubergiste fait semblant de compter des œufs. Dehors, le marché bat son plein et personne ne se retourne sur vous, ce qui vexe profondément Bellirith.",
    W(AUD, [
      "Sur le seuil, vous sortez la montre de votre poche. Elle a tourné toute l’heure. Vous la rapporterez à l’horloger ; Bellirith vous regarde le décider sans protester.",
    ], [W(BRIOCHE, [
      B("Tu m’as offert une brioche, ce matin. Je viens de comprendre que c’était un piège très bien tendu.", "smirk"),
    ], [
      B("Je n’ai pas deviné tout ce que tu désirais. Ça m’agace. Je vais devoir recommencer avec une chambre plus grande et un sablier.", "thoughtful"),
    ])]),
  ],
  route: {
    id: "bellirith-heure-auberge",
    context: "date-bellirith-market",
    text: "Nommer ce que l’autre désire",
    detail: "Une chambre louée pour une heure, le soleil du matin et le marché sous la fenêtre. À chaque quart d’heure, l’un nomme ce que l’autre désire ; si c’est juste, l’autre l’accorde.",
    visual: { revealChapter: 4, postOrgasmChapter: 11 },
    chapters: [
      A(
        "La chambre est basse de plafond, blanchie à la chaux, meublée d’un lit étroit, d’une cuvette ébréchée et d’une chaise qui boite. Sous la fenêtre, une poissonnière vante ses anguilles d’une voix capable de réveiller les morts.",
        W(AUD, [
          "Vous posez la montre de l’horloger sur la table de chevet, couvercle ouvert. L’aiguille des minutes avance avec un petit claquement sec que vous allez entendre pendant toute l’heure.",
        ], [W(LUC, [
          "Il n’y a pas d’horloge. Bellirith désigne la fenêtre : la cloche du marché sonne les quarts, et ce sera votre seul compte.",
        ], [
          "Bellirith pose la montre sur la table de chevet, couvercle ouvert, et la tourne vers vous pour que vous voyiez l’aiguille avancer.",
        ])]),
      ),
      A(
        B("Les règles du marché. À chaque quart d’heure, l’un de nous nomme ce que l’autre désire. Si c’est juste, l’autre l’accorde, tout de suite et sans discuter.", "teasing"),
        P("Et si c’est faux ?"),
        B("Alors celui qui s’est trompé doit entendre la vérité à voix haute. C’est bien pire.", "smirk"),
        W(LUC, [
          B("Tu m’as déjà battue une fois ce matin. Je ne compte pas te laisser prendre l’habitude.", "cold"),
        ], [W(BRIOCHE, [
          B("Et cette fois, pas de brioche. Tu joues.", "teasing"),
        ], [
          B("Tu as nommé mon désir devant trois marchandes de soie. Ici, il n’y a personne pour te sauver si tu te trompes.", "seductive"),
        ])]),
      ),
      M(
        [
          "Premier quart. Elle vous regarde longtemps, la tête penchée, puis nomme votre désir : la voir dans la lumière du matin. Elle a raison. Elle s’assied sur le rebord de la fenêtre, en plein soleil, et vous laisse l’embrasser.",
        ],
        [
          "Premier quart. Elle vous regarde longtemps, la tête penchée, comme on évalue une étoffe. Puis elle nomme votre désir, très simplement : la voir dans la lumière du matin, sans chandelles ni magie pour l’arranger.",
          "Elle a raison, et elle le lit sur votre visage avant que vous répondiez. Elle s’assied sur le rebord de la fenêtre, en plein soleil, la robe rose remontée sur un genou. Vous l’embrassez pendant que la poissonnière, en dessous, baisse le prix des anguilles.",
          W(SLEPT, [B("Tu m’as déjà vue nue sous toutes les lumières de la nuit. Le jour, c’est autre chose, hein ?", "smirk")], [B("Tu ne m’as jamais vue sous aucune lumière. Commence par la plus cruelle.", "smirk")]),
        ],
        [
          "Premier quart. Elle vous regarde longtemps, la tête penchée, comme on évalue une étoffe. Puis elle nomme votre désir, très simplement : la voir dans la lumière du matin, sans chandelles ni magie pour l’arranger.",
          "Elle a raison, et elle le lit sur votre visage avant que vous répondiez. Elle s’assied sur le rebord de la fenêtre, en plein soleil, la robe rose remontée sur un genou. Vous l’embrassez pendant que la poissonnière, en dessous, baisse le prix des anguilles, et ses jambes se referment autour de vos hanches pour vous empêcher de reculer.",
          X(
            "Elle défait votre chemise et la laisse glisser de vos épaules. Le soleil tombe sur vos seins nus ; elle les regarde dans cette lumière franche avec une attention presque grave, puis les prend dans ses paumes chaudes.",
            "Elle défait votre chemise, la laisse glisser de vos épaules, puis pose la main sur votre pantalon, à l’endroit où votre désir se dresse déjà, et le serre à travers le tissu sans vous quitter des yeux.",
            "Elle défait votre chemise, puis pose la main sur votre pantalon et vous découvre dur sous ses doigts. Elle descend un peu plus bas, jusqu’à la chaleur qui l’attend aussi, et hausse un sourcil ravi.",
          ),
          W(SLEPT, [B("Tu m’as déjà vue nue sous toutes les lumières de la nuit. Le jour, c’est autre chose, hein ?", "smirk")], [B("Tu ne m’as jamais vue sous aucune lumière. Commence par la plus cruelle.", "smirk")]),
        ],
        ["Premier quart : elle devine que vous voulez la voir au soleil. Elle s’assied à la fenêtre."],
      ),
      M(
        [
          "À vous. Vous nommez son désir : qu’on la déshabille lentement, à la main, sans qu’elle ait à faire le spectacle. Elle se tait. Puis elle tourne le dos et vous présente les agrafes de sa robe.",
        ],
        [
          "À vous. Vous nommez son désir à voix basse : qu’on la déshabille lentement, à la main, sans qu’elle ait à faire le spectacle elle-même. Elle ne répond pas tout de suite. Elle se lève, vous tourne le dos et écarte ses cheveux de sa nuque.",
          "Sa robe de jour compte vingt-deux agrafes. Vous les défaites une à une, en embrassant chaque morceau de peau que le tissu abandonne. À la quinzième, elle s’appuie contre vous.",
          B("Tu as gagné ce quart-là. Ne compte pas tout haut, c’est vulgaire.", "thoughtful"),
        ],
        [
          "À vous. Vous nommez son désir à voix basse : qu’on la déshabille lentement, à la main, sans qu’elle ait à faire le spectacle elle-même. Elle ne répond pas tout de suite. Elle se lève, vous tourne le dos et écarte ses cheveux de sa nuque.",
          "Sa robe de jour compte vingt-deux agrafes. Vous les défaites une à une, en embrassant chaque morceau de peau que le tissu abandonne. À la quinzième, elle s’appuie contre vous ; à la vingtième, vos mains glissent sous l’étoffe ouverte et trouvent ses seins, lourds et tièdes, dont les pointes durcissent sous vos paumes.",
          B("Tu as gagné ce quart-là. Ne compte pas tout haut, c’est vulgaire. Continue.", "thoughtful"),
        ],
        ["Vous devinez qu’elle veut être déshabillée à la main. Vingt-deux agrafes."],
      ),
      M(
        [
          "La robe tombe. Elle se retourne dans le soleil et se laisse regarder sans rien arranger. Puis elle vous tire sur le lit, qui grince affreusement.",
        ],
        [
          "La robe tombe à ses pieds. Elle se retourne lentement dans le rectangle de soleil et se laisse regarder sans rien arranger, sans aura pour flatter la courbe d’une hanche. Elle a une petite cicatrice pâle sur l’épaule que vous n’aviez jamais vue.",
          "Puis elle vous attrape par la ceinture et vous fait tomber sur le lit étroit, qui grince comme une charrette mal graissée. En bas, quelqu’un éclate de rire.",
          B("Tout le marché va savoir. Tant mieux. Ça me fera de la publicité.", "teasing"),
        ],
        [
          "La robe tombe à ses pieds. Elle se retourne lentement dans le rectangle de soleil et se laisse regarder sans rien arranger, sans aura pour flatter la courbe d’une hanche. Elle a une petite cicatrice pâle sur l’épaule que vous n’aviez jamais vue, et la lumière crue dore chaque détail de son corps, ses seins, son ventre, la toison sombre entre ses cuisses.",
          "Puis elle vous attrape par la ceinture, vous débarrasse du reste de vos vêtements avec une impatience de marchande pressée, et vous fait tomber sur le lit étroit, qui grince comme une charrette mal graissée. En bas, quelqu’un éclate de rire.",
          B("Tout le marché va savoir. Tant mieux. Ça me fera de la publicité.", "teasing"),
        ],
        ["Elle se laisse regarder au soleil, puis vous fait tomber sur un lit qui grince."],
      ),
      A(
        "La cloche du marché sonne le deuxième quart, à deux rues de là.",
        B("Tu désires que je me taise. Que je cesse de commenter. Tout le monde finit par désirer ça.", "smirk"),
        P("Faux."),
        "Elle fronce les sourcils. Elle attend. Les règles sont les règles.",
        P("Je désire t’entendre. Toi, sans les répliques."),
        B("…C’est injuste. Tu viens de transformer ma défaite en devoir.", "thoughtful"),
      ),
      M(
        [
          "Elle s’allonge et vous guide de la main. Vous la caressez lentement, et elle tient parole : elle ne fait plus de phrases, seulement des soupirs que la rumeur du marché recouvre à peine.",
        ],
        [
          "Elle s’allonge sur le dos, attrape votre poignet et le guide elle-même entre ses cuisses. Vous la caressez lentement, en cherchant ce qui la fait taire. Elle tient parole : plus de phrases, plus de commentaires, seulement des soupirs de plus en plus courts que la rumeur du marché recouvre à peine.",
          "Quand la poissonnière crie un nouveau prix, Bellirith étouffe un rire dans l’oreiller, puis un gémissement qu’elle n’arrive pas à transformer en rire.",
        ],
        [
          "Elle s’allonge sur le dos, attrape votre poignet et le guide elle-même entre ses cuisses. Elle est déjà humide. Vous la caressez lentement, du bout des doigts d’abord, puis en glissant deux doigts en elle pendant que votre pouce tourne autour de sa perle, et vous cherchez ce qui la fait taire.",
          "Elle tient parole : plus de phrases, plus de commentaires, seulement des soupirs de plus en plus courts, puis des sons bas et rauques que la rumeur du marché recouvre à peine. Ses hanches viennent à la rencontre de votre main.",
          "Quand la poissonnière crie un nouveau prix, Bellirith mord l’oreiller pour étouffer un gémissement, et jouit brusquement contre vos doigts, les cuisses serrées sur votre poignet, en vous fusillant du regard parce que vous l’avez entendue.",
        ],
        ["Vous la caressez jusqu’à ce qu’elle oublie ses répliques. Le marché couvre sa voix, presque."],
      ),
      M(
        [
          "Elle reprend son souffle, puis vous renverse sur le dos. Elle a une revanche à prendre et toute la lumière du matin pour la prendre.",
        ],
        [
          "Elle reprend son souffle, les yeux fermés, puis vous renverse sur le dos d’un coup de hanche. Elle a une revanche à prendre et toute la lumière du matin pour le faire.",
          "Elle descend le long de votre corps en mordillant votre peau, sans hâte, en suivant de l’ongle le trajet du soleil sur votre ventre.",
          B("Tu m’as entendue. Maintenant, c’est mon tour d’écouter.", "seductive"),
        ],
        [
          "Elle reprend son souffle, les yeux fermés, puis vous renverse sur le dos d’un coup de hanche. Elle a une revanche à prendre et toute la lumière du matin pour le faire.",
          "Elle descend le long de votre corps en mordillant votre peau, sans hâte, en suivant de l’ongle le trajet du soleil sur votre ventre.",
          X(
            "Elle s’installe entre vos cuisses, les écarte de ses paumes et vous embrasse là où vous êtes le plus chaud·e. Sa langue s’enroule autour de votre perle de plaisir, ralentit dès que vous gémissez, reprend dès que vous vous taisez, jusqu’à ce que vous compreniez son jeu.",
            "Elle s’installe entre vos cuisses, prend votre virilité dans sa main et la caresse de toute sa longueur avant de la prendre entre ses lèvres. Elle ralentit dès que vous gémissez, reprend dès que vous vous taisez, jusqu’à ce que vous compreniez son jeu.",
            "Elle s’installe entre vos cuisses, prend votre vigueur entre ses lèvres et pose deux doigts à l’entrée de votre chaleur, sans y entrer. Elle ralentit dès que vous gémissez, reprend dès que vous vous taisez, jusqu’à ce que vous compreniez son jeu.",
          ),
          B("Tu m’as entendue. Maintenant, c’est mon tour d’écouter. Plus fort.", "seductive"),
        ],
        ["Sa revanche : elle vous goûte en exigeant de vous entendre."],
      ),
      A(
        W(AUD, ["Sur la table de chevet, l’aiguille de la montre passe le troisième quart avec son petit claquement sec."], ["Au loin, la cloche sonne le troisième quart."]),
        P("Toi, tu désires que je te demande de rester après l’heure."),
        "Bellirith s’immobilise, la joue contre votre ventre. Elle ne répond rien du tout, et ses doigts cessent de dessiner sur votre hanche.",
        B("Joue. Il reste un quart.", "cold"),
      ),
      M(
        [
          "Elle remonte vers vous, vous attire contre la tête de lit et s’installe sur vous. Vous vous unissez lentement. Le lit cogne contre le mur, et le voisin cogne en retour.",
        ],
        [
          "Elle remonte vers vous, vous adosse à la tête de lit et s’assied sur vos cuisses, face à vous. Vous vous unissez lentement, les yeux dans les yeux, dans la lumière qui ne pardonne rien.",
          "Le lit se met à cogner contre le mur. Au bout d’un moment, le voisin cogne en retour. Bellirith répond de trois coups de poing contre la cloison sans cesser de bouger, et vous riez tous les deux contre la bouche de l’autre.",
        ],
        [
          "Elle remonte vers vous, vous adosse à la tête de lit et s’assied sur vos cuisses, face à vous, les genoux de part et d’autre de vos hanches, dans la lumière qui ne pardonne rien.",
          X(
            "Elle colle sa chaleur contre la vôtre et se met à onduler, lentement, vos deux intimités glissant l’une contre l’autre, sa main entre vous pour vous ouvrir et vous presser à la fois. Elle vous regarde fondre et ne détourne pas les yeux.",
            "Elle vous prend dans sa main, vous guide et s’abaisse sur vous jusqu’au bout, avec un long soupir. Elle reste un instant immobile, bien droite, à vous regarder fondre, puis commence à monter et descendre sur votre virilité.",
            "Elle guide votre vigueur en elle et s’abaisse jusqu’au bout, puis glisse une main entre vous pour caresser votre chaleur au même rythme. Elle vous regarde fondre des deux côtés et ne détourne pas les yeux.",
          ),
          "Le lit se met à cogner contre le mur. Au bout d’un moment, le voisin cogne en retour. Bellirith répond de trois coups de poing contre la cloison sans cesser de bouger, et vous riez tous les deux contre la bouche de l’autre.",
        ],
        ["Contre la tête de lit, vous vous unissez. Le voisin cogne au mur ; elle répond."],
      ),
      M(
        [
          "La cloche commence à sonner l’heure. Le plaisir vous prend au troisième coup, elle au quatrième, accrochée à vos épaules.",
        ],
        [
          "La cloche du marché commence à sonner l’heure. Bellirith accélère comme si elle voulait finir avant le dernier coup. Le plaisir vous prend au troisième, elle au quatrième, accrochée à vos épaules, la bouche ouverte sans un son.",
        ],
        [
          "La cloche du marché commence à sonner l’heure. Bellirith accélère comme si elle voulait finir avant le dernier coup, les mains crispées sur la tête de lit.",
          X(
            "Ses doigts trouvent votre perle au troisième coup et vous jouissez en vous arquant contre elle. Elle vous suit au quatrième, frottée contre vous, la bouche ouverte sans un son.",
            "Vous jouissez en elle au troisième coup, les mains serrées sur ses hanches. Elle vous suit au quatrième, contractée autour de vous, la bouche ouverte sans un son.",
            "Au troisième coup, vous jouissez en elle pendant que ses doigts vous font basculer de l’autre côté aussi. Elle vous suit au quatrième, contractée autour de vous, la bouche ouverte sans un son.",
          ),
        ],
        ["L’heure sonne. Vous basculez au troisième coup, elle au quatrième."],
      ),
      M(
        [
          "Elle s’effondre contre vous. Le soleil a tourné et éclaire maintenant vos pieds emmêlés au bout du lit.",
          W(BRIOCHE, ["Dans la poche de votre veste, par terre, il reste la moitié d’une brioche. Elle la trouve, la partage en deux sans demander."], []),
        ],
        [
          "Elle s’effondre contre vous, en sueur, ses cheveux collés à votre épaule. Le soleil a tourné ; il éclaire maintenant vos pieds emmêlés au bout du lit et la robe rose en tas sur le plancher.",
          W(BRIOCHE, ["Dans la poche de votre veste, par terre, il reste la moitié d’une brioche. Elle la trouve, la partage en deux sans demander, et vous la mangez couchés, en semant des miettes partout."], []),
        ],
        [
          "Elle s’effondre contre vous, en sueur, ses cheveux collés à votre épaule, encore unie à vous. Le soleil a tourné ; il éclaire maintenant vos pieds emmêlés au bout du lit, la robe rose en tas sur le plancher et la cuvette où flotte une plume échappée de l’oreiller.",
          W(BRIOCHE, ["Dans la poche de votre veste, par terre, il reste la moitié d’une brioche. Elle la trouve, la partage en deux sans demander, et vous la mangez couchés, en semant des miettes partout."], []),
        ],
        ["Le soleil a tourné. Vos pieds sont emmêlés au bout du lit."],
      ),
      A(
        "On frappe. L’aubergiste annonce, à travers la porte et d’une voix très neutre, que l’heure est passée.",
        "Bellirith regarde la porte, puis vous. Vous comprenez qu’elle répond enfin à votre troisième quart.",
        W(SLEPT, [
          B("Mettez-en une autre sur ma note. Et apportez du pain.", "smirk"),
        ], [
          B("Nous partons. Une première fois, ça se quitte à l’heure, sinon ça devient une habitude.", "thoughtful"),
          "Elle reste pourtant allongée une bonne minute de plus, la main posée à plat sur votre cœur, comme pour en vérifier le compte.",
        ]),
      ),
    ],
  },
};
