import { A, B, M, P, W, X, SLEPT, RESISTED, type HeureVolee } from "./bellirith-intimacy-kit";

/*
 * Heure volée · « La proposition du couloir ».
 * Dix pas, une porte qui ferme à clé : la lingerie du palais, piles de
 * draps amidonnés, table à repasser, fenêtre haute. Bellirith a promis
 * d’être directe ; elle éteint son aura et parle sans détour. L’urgence
 * vient des lingères qui cherchent la clé. Première fois possible :
 * variantes selon une nuit déjà partagée ou une longue série de refus.
 */
export const HEURE_COULOIR: HeureVolee = {
  context: "bellirith-free-couloir",
  title: "Dix pas jusqu’à la lingerie",
  devLabel: "Couloir (proposition)",
  background: "/assets/backgrounds/atelier.webp",
  opening: (flags) => [
    "Elle compte à voix basse en marchant, votre main dans la sienne. Au dixième pas, elle s’arrête devant une porte étroite, sort une clé de son corsage et la tourne deux fois. Derrière, il y a la lingerie du palais : des étagères de draps pliés jusqu’au plafond et une odeur d’amidon et de lavande.",
    W(SLEPT, [
      B("Tu vois ? J’ai tenu parole. Dix pas, pas un de plus. Je n’aurais pas tenu jusqu’à ma chambre.", "seductive"),
    ], [W(RESISTED, [
      B("Tu as dit oui. Après tous ces non. Je vais avoir besoin d’un instant pour m’en remettre, et je ne vais pas le prendre.", "thoughtful"),
    ], [
      B("Tu as dit oui. Je m’attendais à tout sauf à ça, et je n’ai rien préparé. C’est délicieux.", "seductive"),
    ])]),
  ],
  approaches: () => [
    { id: "couloir-cle", text: "Lui prendre la clé des mains et verrouiller vous-même.", lines: [
      "Vous refermez la porte derrière vous, prenez la clé entre ses doigts et donnez vous-même le dernier tour.",
      B("Tu fermes à clé avec moi à l’intérieur. Tu es soit très confiant·e, soit très mal renseigné·e.", "smirk"),
    ] },
    { id: "couloir-porte", text: "La plaquer doucement contre la porte refermée.", lines: [
      "À peine la porte close, vous la retournez et l’adossez au battant. La clé tombe de sa main et tinte sur les dalles.",
      B("Voilà. Plus personne ne sait où est la clé. Excellente stratégie.", "teasing"),
    ] },
  ],
  ending: (flags) => [
    "Elle repart dans le couloir avec une pile de draps dans les bras, comme si elle avait toujours eu l’intention de faire la lessive de la cour. Vous la suivez avec votre chemise boutonnée de travers.",
    W(SLEPT, [
      B("La prochaine fois, je compte jusqu’à cinq. Je ne suis pas sûre de tenir dix pas.", "smirk"),
    ], [
      B("J’ai demandé. Tu as répondu. Je ne savais pas que ça pouvait être aussi simple, et je t’en veux un peu.", "thoughtful"),
    ]),
  ],
  route: {
    id: "bellirith-heure-couloir",
    context: "bellirith-free-couloir",
    text: "Sans détour",
    detail: "Elle a promis d’être directe. Elle éteint son aura, dit ce qu’elle veut avec des mots simples, et vous avez jusqu’au retour des lingères.",
    visual: { revealChapter: 4, postOrgasmChapter: 11 },
    chapters: [
      A(
        "Elle s’adosse aux étagères, au milieu des draps pliés, et souffle longuement, comme si elle avait couru.",
        "Puis l’air change. Le parfum sucré qui flotte toujours autour d’elle se dissipe d’un coup, et la pièce ne sent plus que l’amidon.",
        P("Qu’est-ce que tu as fait ?"),
        B("J’ai éteint l’aura. Tout ce que tu ressens à partir de maintenant, tu le ressens par toi-même. Je veux en être sûre.", "thoughtful"),
      ),
      A(
        "Vous la regardez. Elle est la même : les mêmes yeux, la même bouche, le même sourire en coin qui vacille un peu.",
        P("Rien n’a changé."),
        "Elle vous fixe un long moment, puis rit, d’un rire bref et nerveux qui ne lui ressemble pas.",
        B("Alors embrasse-moi avant que je recommence à réfléchir.", "seductive"),
      ),
      M(
        [
          "Vous l’embrassez contre les étagères. Une pile de draps bascule et vous tombe sur l’épaule. Ni l’un ni l’autre ne s’arrête.",
        ],
        [
          "Vous l’embrassez contre les étagères, fort, et elle vous rend le baiser avec une avidité sans calcul. Une pile de draps bascule et s’effondre sur vos épaules dans un nuage de lavande.",
          "Ni l’un ni l’autre ne s’arrête. Elle repousse les draps du pied et vous attire plus près par la ceinture.",
        ],
        [
          "Vous l’embrassez contre les étagères, fort, et elle vous rend le baiser avec une avidité sans calcul, sa langue contre la vôtre, ses hanches pressées contre les vôtres. Une pile de draps bascule et s’effondre sur vos épaules dans un nuage de lavande.",
          "Ni l’un ni l’autre ne s’arrête. Elle repousse les draps du pied, vous attire plus près par la ceinture et frotte son bassin contre le vôtre avec une franchise qui vous coupe le souffle.",
          B("J’ai envie de toi depuis le grand escalier. Je n’ai pas envie de te le cacher, pour une fois.", "seductive"),
        ],
        ["Contre les étagères, une pile de draps vous tombe dessus. Vous ne vous arrêtez pas."],
      ),
      M(
        [
          "Il n’y a pas le temps de tout enlever. Elle défait votre chemise, vous dénouez son corsage, et c’est assez.",
        ],
        [
          "Il n’y a pas le temps de tout enlever, et elle ne fait pas semblant de vouloir le prendre. Elle tire votre chemise hors de votre ceinture, l’ouvre à deux mains ; un bouton saute.",
          B("Le corsage. Les lacets sont dans le dos. Vite.", "seductive"),
          "Vos doigts s’emmêlent dans les lacets. Elle trépigne, et pour une fois son impatience est sincère.",
        ],
        [
          "Il n’y a pas le temps de tout enlever, et elle ne fait pas semblant de vouloir le prendre. Elle tire votre chemise hors de votre ceinture, l’ouvre à deux mains ; un bouton saute. Elle défait votre ceinture dans la foulée et glisse la main à l’intérieur sans demander.",
          B("Le corsage. Les lacets sont dans le dos. Vite.", "seductive"),
          "Vos doigts s’emmêlent dans les lacets. Elle trépigne, la main toujours sur vous, et pour une fois son impatience est sincère.",
        ],
        ["Pas le temps de tout enlever. Chemise ouverte, lacets défaits, et c’est assez."],
      ),
      M(
        [
          "Le corsage cède enfin. Elle le rabat sur ses hanches, et la lumière de la fenêtre haute tombe sur sa poitrine nue.",
        ],
        [
          "Le corsage cède enfin. Elle le fait glisser jusqu’à ses hanches et relève sa jupe d’une main, sans cérémonie, pour que vous voyiez.",
          "La lumière grise de la fenêtre haute tombe sur sa peau nue. Elle ne prend aucune pose. Elle vous regarde la regarder, la respiration courte.",
        ],
        [
          "Le corsage cède enfin. Elle le fait glisser jusqu’à ses hanches, libérant ses seins, et relève sa jupe d’une main jusqu’à la taille, sans cérémonie, pour que vous voyiez. Elle ne porte rien dessous.",
          "La lumière grise de la fenêtre haute tombe sur sa peau nue et sur la toison sombre entre ses cuisses. Elle ne prend aucune pose. Elle vous regarde la regarder, la respiration courte.",
          B("Voilà. C’est tout moi. Sans les lumières.", "thoughtful"),
        ],
        ["Le corsage cède. Elle relève sa jupe et vous laisse la voir, sans pose."],
      ),
      A(
        "Des voix dans le couloir. Deux femmes, des paniers qui grincent. La poignée tourne, résiste.",
        "« C’est fermé. Qui a fermé la lingerie ? »",
        "« Va chercher la clé chez la gouvernante. Moi, je t’attends. »",
        "Vous vous figez, nez à nez. Elle articule sans un son : « Combien de temps ? » Vous haussez les épaules. Elle sourit, et ses yeux brillent.",
        B("Alors dépêchons-nous.", "teasing"),
      ),
      M(
        [
          "Elle vous fait asseoir sur la grande table à plier et vous caresse vite, sans détour, une main sur votre bouche pour garder le silence.",
        ],
        [
          "Elle vous pousse jusqu’à la grande table à plier, vous y fait asseoir au milieu des taies d’oreiller et vous caresse vite, sans détour, en surveillant la porte par-dessus votre épaule.",
          "Chaque fois qu’un panier grince dans le couloir, sa main ralentit. Chaque fois que le silence revient, elle accélère.",
        ],
        [
          "Elle vous pousse jusqu’à la grande table à plier et vous y fait asseoir au milieu des taies d’oreiller.",
          X(
            "Elle glisse deux doigts en vous et presse sa paume contre votre perle, vite, sans détour, en surveillant la porte par-dessus votre épaule.",
            "Elle libère votre virilité et la caresse vite, d’une main ferme, sans détour, en surveillant la porte par-dessus votre épaule.",
            "Elle libère votre vigueur et la caresse vite, l’autre main pressée contre votre chaleur, sans détour, en surveillant la porte par-dessus votre épaule.",
          ),
          "Chaque fois qu’un panier grince dans le couloir, sa main ralentit. Chaque fois que le silence revient, elle accélère, et vous devez enfouir le visage dans son cou pour ne pas gémir. Elle vous souffle à l’oreille, sans aucune coquetterie, que vous lui plaisez comme ça, à bout de souffle et sans défense, et qu’elle veut s’en souvenir.",
        ],
        ["Sur la table à plier, elle vous caresse vite, l’œil sur la porte."],
      ),
      M(
        [
          "Vous inversez les places. Elle s’assoit sur la table, et c’est votre tour de la faire trembler en silence.",
        ],
        [
          "Vous inversez les places. Elle se hisse sur la table, la jupe retroussée, et c’est votre tour de la faire trembler en silence.",
          "Elle mord un coin de drap plié pour ne pas crier, et ses talons frappent le bois de la table au rythme de vos caresses.",
        ],
        [
          "Vous inversez les places. Elle se hisse sur la table, la jupe retroussée jusqu’aux hanches, et ouvre les jambes pour vous.",
          "Vous vous agenouillez et la prenez avec la bouche, la langue sur sa perle, deux doigts glissés dans sa chaleur trempée. Elle mord un coin de drap plié pour ne pas crier, et ses talons frappent le bois de la table au rythme de vos caresses, de plus en plus vite.",
        ],
        ["À votre tour. Elle mord un drap pour ne pas crier."],
      ),
      A(
        "Elle vous relève en tirant sur vos épaules, haletante.",
        B("Je te veux contre cette porte. Maintenant. Avec elle de l’autre côté.", "seductive"),
        P("Tu es folle."),
        B("Je suis directe. C’était promis.", "teasing"),
      ),
      M(
        [
          "Vous l’adossez à la porte et vous vous unissez debout, le bois tremblant à chaque mouvement, la lingère à deux pas de l’autre côté.",
        ],
        [
          "Vous l’adossez à la porte, une de ses jambes remontée sur votre hanche, et vous vous unissez debout, vite, sans grâce, la bouche de l’un contre l’épaule de l’autre.",
          "Le battant tremble légèrement à chaque mouvement. De l’autre côté, la lingère fredonne une chanson à boire, à deux pas.",
        ],
        [
          "Vous l’adossez à la porte, une de ses jambes remontée sur votre hanche.",
          X(
            "Vous pressez votre cuisse entre les siennes, votre intimité contre la sienne, et vos doigts se cherchent entre vos deux corps. Vous vous frottez l’une contre l’autre, debout, vite, sans grâce, la bouche de l’une contre l’épaule de l’autre.",
            "Elle vous guide en elle d’une main pressée et vous la prenez debout, vite, sans grâce, à grands coups de reins, la bouche de l’un contre l’épaule de l’autre.",
            "Elle guide votre vigueur en elle d’une main pressée, et vous la prenez debout, vite, sans grâce, pendant que ses doigts reviennent fouiller votre chaleur, la bouche de l’un contre l’épaule de l’autre.",
          ),
          "Le battant tremble légèrement à chaque mouvement. De l’autre côté, la lingère fredonne une chanson à boire, à deux pas.",
          "Bellirith vous regarde droit dans les yeux pendant tout ce temps, la bouche entrouverte, sans aucun artifice, et murmure contre vos lèvres ce qu’elle veut au fur et à mesure : plus fort, plus près, encore, comme on donne des indications à quelqu’un qui conduit dans le noir.",
        ],
        ["Contre la porte, debout, vite, pendant que la lingère fredonne de l’autre côté."],
      ),
      M(
        [
          "Le plaisir vous prend tous les deux en même temps, étouffé dans un drap qu’elle a attrapé au vol.",
        ],
        [
          "Le plaisir arrive trop vite et trop fort. Elle attrape un drap sur l’étagère la plus proche et vous y enfouissez vos deux visages pour étouffer le bruit.",
        ],
        [
          "Le plaisir arrive trop vite et trop fort. Elle attrape un drap sur l’étagère la plus proche et vous y enfouissez vos deux visages pour étouffer le bruit.",
          X(
            "Elle jouit contre vous en tremblant de tout son corps, et vos propres hanches s’affolent contre les siennes jusqu’à ce que la vague vous emporte à votre tour.",
            "Elle se resserre autour de vous en mordant le drap, et vous jouissez en elle dans la seconde, le front contre le bois.",
            "Elle se resserre autour de votre vigueur en mordant le drap, ses doigts enfoncés dans votre chaleur, et vous jouissez dans la seconde des deux côtés à la fois.",
          ),
          "Quand vous relevez la tête, elle a les joues en feu et la trace d’un pli de drap imprimée sur la pommette. Elle rit en silence, le front contre votre épaule, et vous sentez son rire vous secouer tout entier·e.",
        ],
        ["Vous jouissez ensemble, la bouche dans un drap de lavande."],
      ),
      M(
        [
          "Des pas reviennent dans le couloir, une clé tinte. Vous vous rhabillez en hâte, en riant sans bruit.",
        ],
        [
          "Des pas reviennent dans le couloir, une clé tinte au bout d’une chaîne. Vous vous rhabillez en hâte, en riant sans bruit, chacun gênant l’autre.",
          "Elle relace son corsage de travers. Vous boutonnez votre chemise avec un trou d’avance. Personne n’a le temps de corriger.",
        ],
        [
          "Des pas reviennent dans le couloir, une clé tinte au bout d’une chaîne. Vous vous rhabillez en hâte, en riant sans bruit, chacun gênant l’autre, encore moites, les jambes molles.",
          "Elle relace son corsage de travers et rabat sa jupe froissée. Vous boutonnez votre chemise avec un trou d’avance. Elle vous embrasse une dernière fois, vite, au coin de la bouche. Personne n’a le temps de corriger quoi que ce soit. Vous retrouvez sa clé au milieu des draps renversés et la lui glissez dans le corsage, à l’endroit d’où elle l’avait sortie.",
        ],
        ["Une clé tinte dans le couloir. Rhabillage précipité, en riant sans bruit."],
      ),
      A(
        "La clé tourne. Bellirith attrape une pile de draps, ouvre la porte en grand avant la lingère et la toise de toute sa hauteur.",
        B("Enfin. On attend ces draps dans l’aile est depuis une heure. Vous, avec moi.", "cold"),
        "La lingère bredouille des excuses. Vous sortez derrière Bellirith, les bras chargés de linge, le visage aussi neutre que possible.",
        "Dans l’escalier, elle rallume son aura d’un claquement de doigts. Vous ne sentez aucune différence, et à son regard en coin, vous comprenez qu’elle l’a remarqué.",
      ),
    ],
  },
};
