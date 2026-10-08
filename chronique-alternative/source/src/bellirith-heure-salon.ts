import { A, B, M, P, W, X, SLEPT, type HeureVolee } from "./bellirith-intimacy-kit";

/*
 * Heure volée · après « Le salon des mauvaises intentions ».
 * Le salon de musique d’Al’Gratal vidé de sa cour, la porte verrouillée,
 * les fraises écrasées sur le piano. Le jeu de la soirée continue à huis
 * clos : chacun son tour fait désirer quelque chose à l’autre. Le choix
 * fait pendant le rendez-vous (audace, lucidité, résonance) colore la scène.
 */
const AUD = "bellirith-salon:audace";
const LUC = "bellirith-salon:lucidite";

export const HEURE_SALON: HeureVolee = {
  context: "date-bellirith-music",
  title: "Les fraises écrasées",
  devLabel: "Salon de musique",
  background: "/assets/backgrounds/algratal_music_room.webp",
  opening: (flags) => [
    "Le dernier courtisan s’en va en serrant une fraise dans son mouchoir, comme une relique volée à la messe. Bellirith tourne la clé dans la serrure du salon et la glisse dans son corsage sans vous quitter des yeux.",
    W(AUD, [
      B("Tu as fait désirer ma défaite à toute la cour. La cour est rentrée se coucher ; la défaite est restée ici, avec nous. Je compte la reprendre morceau par morceau.", "seductive"),
    ], [W(LUC, [
      B("Tu m’as demandé ce que je désirais, et j’ai répondu à voix basse, comme une débutante. Tu es resté·e. Il va bien falloir que je te montre la suite de ma phrase.", "thoughtful"),
    ], [
      B("Ta chanson a vidé ma salle. En trois siècles, personne n’avait réussi à vider ma salle. Tu vas devoir me consoler, et je préviens : je suis très longue à consoler.", "teasing"),
    ])]),
    W(SLEPT, [
      "Elle connaît déjà le chemin de votre bouche. Ce soir, elle a l’air décidée à prendre le plus long.",
    ], [
      "Vous ne l’avez encore jamais touchée. Le salon semble le savoir : les chaises renversées, les coupes abandonnées et le piano ouvert retiennent leur souffle avec vous.",
    ]),
  ],
  approaches: () => [
    { id: "salon-tour", text: "Réclamer votre tour dans le jeu de la soirée.", lines: [
      P("La partie continue. Et c’est à moi de jouer."),
      B("Alors fais-moi désirer quelque chose. Il n’y a plus personne pour applaudir ; je te dirai moi-même si tu as gagné.", "teasing"),
    ] },
    { id: "salon-banc", text: "Vous asseoir au piano et l’attendre.", lines: [
      "Vous prenez place sur le banc et posez les mains sur les touches, sans appuyer. Bellirith approche à pas comptés, ramasse une fraise écrasée sur le couvercle et l’examine comme une pièce à conviction.",
      B("Tu m’attends au piano. On ne m’a jamais attendue au piano. On m’y admire, à la rigueur.", "thoughtful"),
    ] },
  ],
  ending: (flags) => [
    "Quand vous sortez enfin, un serviteur balaie déjà les restes de la fête. Il trouve une fraise intacte sur le banc du piano, la regarde longtemps, puis la laisse où elle est.",
    W(LUC, [
      B("Je t’ai dit ce que je désirais, et tu l’as fait. Ne t’habitue pas à ce que je parle aussi clairement. Ça ne m’arrive qu’une fois par siècle.", "thoughtful"),
    ], [W(AUD, [
      B("Égalité. Tu as gagné la salle, j’ai gagné le salon vide. La prochaine fois, j’invite moins de monde et je triche davantage.", "smirk"),
    ], [
      B("Rejoue-la un jour, ta chanson. Quand il n’y aura personne. Je veux savoir si elle me fait encore cet effet quand je ne suis pas en train de perdre.", "thoughtful"),
    ])]),
  ],
  route: {
    id: "bellirith-heure-salon",
    context: "date-bellirith-music",
    text: "Chacun son tour",
    detail: "Le jeu de la soirée reprend à huis clos sur le piano couvert de fraises. Il n’y a plus de salle pour voter : chacun compte les points de l’autre.",
    visual: { revealChapter: 4, postOrgasmChapter: 10 },
    chapters: [
      A(
        "Bellirith balaie le couvercle du piano d’un revers de main. Les cartes de la soirée s’envolent, une coupe roule jusqu’au bord sans tomber, et trois fraises écrasées laissent sur le bois noir des traînées d’un rouge très peu convenable.",
        B("Mêmes règles que tout à l’heure. Chacun son tour, on fait désirer quelque chose à l’autre. Sauf qu’il n’y a plus de salle pour voter, alors il faudra être honnête.", "teasing"),
        P("Toi, honnête ?"),
        B("J’ai dit qu’il faudrait. Je n’ai pas précisé lequel de nous deux.", "smirk"),
      ),
      A(
        W(AUD, [
          "Elle ouvre la partie, évidemment. Elle s’assied sur le couvercle, croise les jambes et pose une fraise intacte sur son genou, en équilibre. Elle laisse le fruit immobile et vous regarde le regarder.",
          B("Tu m’as volé ma salle. Je reprends mon public, une personne à la fois. Ce soir, la personne, c’est toi.", "seductive"),
        ], [W(LUC, [
          "Elle ouvre la partie, puis s’interrompt. Elle tient une fraise entre deux doigts et ne sait plus très bien quoi en faire, ce qui ne lui arrive jamais devant témoin.",
          B("Tout à l’heure, j’ai répondu trop vite. Je voulais que tu restes. Tu es resté·e. Et me voilà sans plan, comme une idiote, avec un fruit.", "thoughtful"),
          P("Commence par le fruit."),
        ], [
          "Elle ouvre la partie en refermant le couvercle des touches, doucement, comme on borde quelqu’un qui a trop pleuré.",
          B("Plus de chansons. Tu as eu ton tour : la cour entière est rentrée chez elle avec l’envie de serrer quelqu’un dans ses bras. Moi, il ne me reste que toi à serrer.", "teasing"),
        ])]),
      ),
      M(
        [
          "Elle place la fraise entre ses lèvres et attend. Vous traversez le salon et la prenez d’un baiser. Elle a le goût du sucre et du vin de la soirée.",
          W(SLEPT, [B("Tu n’as même pas hésité. Je note.", "smirk")], [B("Notre premier baiser a un goût de dessert. C’est d’une vulgarité parfaite.", "smirk")]),
        ],
        [
          "Elle place la fraise entre ses lèvres et ne bouge plus. Son aura s’éveille à peine, juste assez pour que l’odeur du fruit remplisse la pièce, et vous comprenez très vite que c’est sa bouche que vous voulez goûter.",
          "Vous traversez le salon. Vous prenez la fraise d’un baiser, et le baiser survit longtemps au fruit. Ses doigts trouvent votre col et le défont sans se presser.",
          W(SLEPT, [B("Tu n’as même pas hésité. Je note.", "smirk")], [B("Notre premier baiser a un goût de dessert. C’est d’une vulgarité parfaite.", "smirk")]),
        ],
        [
          "Elle place la fraise entre ses lèvres et ne bouge plus. Son aura s’éveille à peine, juste assez pour que l’odeur du fruit remplisse la pièce, et vous comprenez très vite que c’est sa bouche que vous voulez goûter.",
          "Vous traversez le salon. Vous prenez la fraise d’un baiser, et le jus coule de sa bouche à la vôtre pendant que ses doigts défont votre col, un bouton après l’autre, au rythme d’une valse qu’elle seule entend.",
          X(
            "Quand le tissu s’ouvre, elle passe un doigt rougi sur la courbe de votre sein et contemple la trace qu’il y laisse, aussi satisfaite qu’un peintre devant sa signature.",
            "Quand le tissu s’ouvre, elle trace du doigt une ligne rouge le long de votre torse et s’arrête à la ceinture, juste au-dessus de votre désir qui tend déjà l’étoffe.",
            "Quand le tissu s’ouvre, elle trace une ligne rouge de votre poitrine à votre ceinture et s’arrête au-dessus de l’endroit où votre corps la réclame de deux manières à la fois.",
          ),
          W(SLEPT, [B("Tu n’as même pas hésité. Je note.", "smirk")], [B("Notre premier baiser a un goût de dessert. C’est d’une vulgarité parfaite.", "smirk")]),
        ],
        ["Une fraise entre ses lèvres, un baiser pour la prendre, un col qui s’ouvre."],
      ),
      M(
        [
          "À votre tour. Vous la faites asseoir sur le banc, dos au clavier, et vous jouez derrière elle, les bras autour de sa taille, une mélodie inventée à mesure. À chaque note grave, vous embrassez sa nuque.",
          B("Tu me fais désirer la note suivante. C’est tricher.", "thoughtful"),
        ],
        [
          "À votre tour. Vous l’asseyez sur le banc, dos au clavier, et vous jouez derrière elle, les bras passés autour de sa taille. Vous inventez la mélodie au fur et à mesure ; chaque note grave s’accompagne d’un baiser sur sa nuque, chaque note aiguë d’une main qui remonte le long de ses côtes.",
          "Elle comprend le système à la troisième mesure. À la cinquième, elle attend les notes graves en retenant son souffle.",
          B("Tu me fais désirer la note suivante. C’est de la triche, et c’est très bien joué.", "thoughtful"),
        ],
        [
          "À votre tour. Vous l’asseyez sur le banc, dos au clavier, et vous jouez derrière elle, les bras passés autour de sa taille. Vous inventez la mélodie au fur et à mesure ; chaque note grave s’accompagne d’un baiser sur sa nuque, chaque note aiguë d’une main qui remonte sous sa robe le long de ses côtes, jusqu’à la rondeur de son sein.",
          "Elle comprend le système à la troisième mesure. À la cinquième, elle attend les notes graves en se cambrant contre vous.",
          X(
            "Vos seins nus se pressent contre son dos chaque fois que vous vous penchez vers les basses, et elle s’appuie davantage, pour en avoir plus.",
            "Votre désir dressé se presse contre ses reins chaque fois que vous vous penchez vers les basses, et elle ondule à peine, juste assez pour vous faire manquer une note.",
            "Votre vigueur se presse contre ses reins chaque fois que vous vous penchez vers les basses, et elle ondule à peine, juste assez pour que votre chaleur s’éveille à son tour.",
          ),
          B("Tu me fais désirer la note suivante. C’est de la triche, et c’est très bien joué.", "thoughtful"),
        ],
        ["Vous jouez derrière elle, une note grave pour chaque baiser. Elle attend les basses."],
      ),
      M(
        [
          "Elle se relève, vous rend un point d’un geste de la main et reprend la main. Les bougies du salon s’éteignent toutes, sauf une, qu’elle garde allumée au-dessus d’elle pendant qu’elle ôte sa robe.",
        ],
        [
          "Elle se relève, vous accorde le point d’un geste de la main et reprend la partie. Les bougies du salon s’éteignent l’une après l’autre, sauf celle qui flotte au-dessus d’elle. Elle se dévêt dans ce seul rond de lumière, sans hâte, en laissant l’ombre garder ce qu’elle n’a pas encore décidé de vous montrer.",
          B("Désire. Je t’en prie. C’est mon tour.", "seductive"),
        ],
        [
          "Elle se relève, vous accorde le point d’un geste de la main et reprend la partie. Les bougies du salon s’éteignent l’une après l’autre, sauf celle qui flotte au-dessus d’elle. Elle se dévêt dans ce seul rond de lumière, sans hâte, en laissant l’ombre garder ce qu’elle n’a pas encore décidé de vous montrer.",
          "La robe tombe. Puis la lumière descend avec une lenteur de rideau de théâtre : ses épaules, ses seins aux pointes sombres, la ligne de son ventre, le haut de ses cuisses, et enfin tout le reste, quand vous ne respirez déjà plus.",
          B("Désire. Je t’en prie. C’est mon tour, et je joue pour gagner.", "seductive"),
        ],
        ["Une seule bougie reste allumée. Elle se dévêt dessous, pour vous."],
      ),
      M(
        [
          "Elle vous allonge sur le couvercle du piano, parmi les traces de fruit, et prend le temps de vous embrasser partout où ses mains ont déjà demandé la permission.",
        ],
        [
          "Elle vous allonge sur le couvercle du piano, parmi les traces de fruit, et achève de vous déshabiller avec une précision d’accordeur. Le bois résonne sourdement sous votre dos chaque fois que vous bougez.",
          "Elle vous embrasse du cou jusqu’au ventre en écrasant au passage une fraise oubliée, puis lèche le jus sur votre peau avec une gourmandise franche, oubliant pour une fois d’être regardée.",
        ],
        [
          "Elle vous allonge sur le couvercle du piano, parmi les traces de fruit, et achève de vous déshabiller avec une précision d’accordeur. Le bois résonne sourdement sous votre dos chaque fois que vous bougez.",
          "Elle vous embrasse du cou jusqu’au ventre en écrasant au passage une fraise oubliée, puis lèche le jus sur votre peau avec une gourmandise franche, oubliant pour une fois d’être regardée.",
          X(
            "Elle écarte vos cuisses au bord du couvercle et pose la bouche sur votre chaleur. Sa langue trouve votre perle de plaisir et la cajole par petits cercles patients, pendant que le piano gronde sous vous à chaque frisson.",
            "Elle s’agenouille sur le banc, prend votre virilité dans sa main et la conduit entre ses lèvres. Elle vous goûte lentement, profondément, et le piano gronde sous vous à chaque frisson.",
            "Elle s’agenouille sur le banc, prend votre vigueur entre ses lèvres et glisse deux doigts dans votre chaleur. Elle vous goûte des deux côtés à la fois, sans se presser, et le piano gronde sous vous à chaque frisson.",
          ),
          "Elle s’arrête juste avant que vous ne basculiez, se redresse et s’essuie la bouche du revers du poignet.",
        ],
        ["Allongé·e sur le piano, vous la laissez vous goûter parmi les fraises."],
      ),
      A(
        B("Deux points à un. Pour moi.", "smirk"),
        P("Tu t’es arrêtée."),
        B("Évidemment. Si je t’avais laissé·e jouir, tu aurais oublié de jouer.", "teasing"),
        W(LUC, [
          B("Et puis je voulais te dire la suite. Ce que je désire, ce soir, c’est te regarder quand je perds. Je n’ai jamais eu envie de ça.", "thoughtful"),
        ], [W(AUD, [
          B("Tu as fait applaudir ma défaite. Je veux au moins l’avoir méritée.", "seductive"),
        ], [
          B("Ta chanson me trotte encore dans la tête. Si tu la fredonnes maintenant, je te jure que je triche.", "thoughtful"),
        ])]),
      ),
      M(
        [
          "Vous la faites asseoir à son tour sur le couvercle et vous vous agenouillez devant le banc. Vous prenez votre temps. Elle s’accroche au bord du piano et une touche grave résonne quand son coude la heurte.",
        ],
        [
          "Vous la faites asseoir à son tour sur le couvercle et vous vous agenouillez sur le banc. Vous embrassez l’intérieur de ses genoux, puis de ses cuisses, avec une lenteur que vous savez cruelle.",
          "Son coude heurte le clavier ouvert. Un accord grave s’élève et meurt dans le salon vide. Elle rit nerveusement, se rattrape au bord du piano, et cesse de rire quand votre bouche atteint enfin le haut de ses cuisses.",
        ],
        [
          "Vous la faites asseoir à son tour sur le couvercle et vous vous agenouillez sur le banc. Vous embrassez l’intérieur de ses genoux, puis de ses cuisses, avec une lenteur que vous savez cruelle.",
          "Son coude heurte le clavier ouvert. Un accord grave s’élève et meurt dans le salon vide. Elle rit nerveusement, se rattrape au bord du piano, et cesse de rire quand votre bouche se pose sur son intimité.",
          "Elle est brûlante et déjà trempée. Vous la goûtez à plat, puis du bout de la langue autour de sa perle, en écoutant ses talons battre contre le bois. Chaque fois qu’elle se cambre, son dos frôle les touches et le piano gémit avec elle.",
          B("Plus bas. Non, là. Ne t’arrête surtout pas. Je retire tout ce que j’ai dit sur ta triche.", "seductive"),
        ],
        ["À votre tour de la goûter. Le piano proteste chaque fois qu’elle se cambre."],
      ),
      M(
        [
          "Elle vous attire sur le banc, s’assied sur vos genoux, face à vous, et vous enlace. Vos corps se trouvent sans un mot. Derrière elle, le clavier soupire sous son dos.",
        ],
        [
          "Elle se laisse glisser du couvercle sur vos genoux, face à vous, les jambes de part et d’autre du banc. Ses bras se nouent autour de votre cou. Vous vous unissez sans la moindre hésitation, lentement, et le clavier soupire sous ses reins à chaque mouvement.",
          B("Égalité. Je déteste l’égalité. Bouge.", "seductive"),
        ],
        [
          "Elle se laisse glisser du couvercle sur vos genoux, face à vous, les jambes de part et d’autre du banc. Ses bras se nouent autour de votre cou et ses lèvres ne quittent plus les vôtres.",
          X(
            "Elle glisse une main entre vous deux et ses doigts s’enfoncent en vous pendant qu’elle frotte sa chaleur contre la vôtre. Vos deux intimités se cherchent, se trouvent, glissent l’une sur l’autre au rythme qu’elle impose, et le clavier soupire sous ses reins à chaque mouvement.",
            "Elle se soulève, vous guide d’une main et descend sur vous d’un seul mouvement, jusqu’au bout. Elle reste immobile un instant, la bouche ouverte contre la vôtre, puis commence à onduler, et le clavier soupire sous ses reins à chaque mouvement.",
            "Elle se soulève, guide votre vigueur et descend sur vous jusqu’au bout, puis glisse deux doigts dans votre chaleur. Elle vous prend des deux côtés au même rythme, et le clavier soupire sous ses reins à chaque mouvement.",
          ),
          B("Égalité. Je déteste l’égalité. Bouge, et fais-moi perdre.", "seductive"),
        ],
        ["Sur le banc, face à face, vous vous unissez. Elle réclame qu’on la fasse perdre."],
      ),
      M(
        [
          "Le plaisir vous emporte ensemble. Sa main glisse sur les touches et un accord entier s’élève, faux et magnifique.",
        ],
        [
          "Le rythme s’accélère malgré elle. Vous sentez le moment exact où elle cesse de compter les points. Le plaisir vous prend presque en même temps, et sa main, en cherchant un appui, plaque sur le clavier un accord entier, faux et magnifique.",
        ],
        [
          "Le rythme s’accélère malgré elle. Vous sentez le moment exact où elle cesse de compter les points : son souffle se brise, ses ongles marquent vos épaules, ses hanches perdent toute élégance.",
          X(
            "Elle bascule la première, frissonnante contre vous, et ses doigts recourbés en vous vous entraînent dans sa chute. Vous jouissez en serrant sa taille de toutes vos forces.",
            "Elle bascule la première, serrée autour de vous, et ses contractions vous entraînent dans sa chute. Vous jouissez en elle en serrant sa taille de toutes vos forces.",
            "Elle bascule la première, serrée autour de votre vigueur pendant que ses doigts pressent votre chaleur, et vous jouissez des deux côtés à la fois en serrant sa taille de toutes vos forces.",
          ),
          "Sa main, en cherchant un appui, plaque sur le clavier un accord entier, faux et magnifique, qui résonne longtemps dans le salon vide.",
        ],
        ["Vous basculez ensemble. Un accord faux résonne dans le salon vide."],
      ),
      M(
        [
          "Vous restez enlacés sur le banc. Elle a de la fraise dans les cheveux et ne le sait pas. Vous ne le lui dites pas tout de suite.",
        ],
        [
          "Vous restez enlacés sur le banc, haletants. Elle a de la fraise dans les cheveux et un sourire qu’elle n’a pas eu le temps de composer. Elle pose le front contre le vôtre.",
        ],
        [
          "Vous restez enlacés sur le banc, haletants, encore unis. Elle a de la fraise dans les cheveux, du jus séché sur la hanche, et un sourire qu’elle n’a pas eu le temps de composer. Elle pose le front contre le vôtre et respire avec vous, sans rien dire, pendant que l’accord finit de mourir.",
        ],
        ["Elle a de la fraise dans les cheveux. Vous gardez l’information pour plus tard."],
      ),
      A(
        B("Qui a gagné ?", "thoughtful"),
        P("La salle n’est plus là pour voter."),
        B("Alors c’est nul. Je n’ai jamais fait match nul de ma vie.", "smirk"),
        W(SLEPT, [
          B("Avec toi, je commence à collectionner les premières fois. C’est très mauvais pour ma réputation.", "teasing"),
        ], [
          B("Une première nuit qui se termine sur une égalité. Je vais devoir revenir jusqu’à ce que l’un de nous perde franchement.", "teasing"),
        ]),
        "Vous retirez la fraise de ses cheveux. Elle la regarde, outrée, puis la mange.",
      ),
      M(
        [
          "Elle rouvre le couvercle des touches et joue une note, une seule, avec un doigt. Puis elle pose la tête sur votre épaule et attend que le jour se lève derrière les rideaux.",
        ],
        [
          "Elle rouvre le couvercle des touches et joue une note, une seule, avec un doigt, comme on vérifie qu’un instrument a survécu. Puis elle pose la tête sur votre épaule et regarde le jour pâlir derrière les rideaux.",
        ],
        [
          "Elle rouvre le couvercle des touches et joue une note, une seule, avec un doigt, comme on vérifie qu’un instrument a survécu. Puis elle se blottit contre vous sur le banc, nue, la tête sur votre épaule, et regarde le jour pâlir derrière les rideaux sans faire un geste pour se rhabiller.",
        ],
        ["Une note, un seul doigt, sa tête sur votre épaule jusqu’au jour."],
      ),
    ],
  },
};
