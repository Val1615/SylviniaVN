import { A, B, M, P, W, X, FAVORITE, type HeureVolee } from "./bellirith-intimacy-kit";

/*
 * Heure volée · « Ou bien on s’ennuie à deux, ailleurs. »
 * Ailleurs, c’est le petit théâtre du palais, fermé pour la saison :
 * sièges sous housse, toile de tempête peinte, machinerie de scène.
 * Bellirith s’installe en spectatrice et compte ses bâillements ; à vous
 * de la surprendre. La proposition exige déjà une nuit partagée, d’où
 * les variantes sur le statut de favori·te plutôt que sur la première fois.
 */
export const HEURE_ENNUI: HeureVolee = {
  context: "bellirith-free-ennui",
  title: "Trois bâillements",
  devLabel: "Ennui (proposition)",
  background: "/assets/backgrounds/ballroom.webp",
  opening: (flags) => [
    "Elle vous mène par une porte de service jusqu’au petit théâtre du palais, fermé depuis la fin de la saison. Les fauteuils dorment sous des housses grises. Sur la scène, une toile peinte montre une mer en furie et un navire qui sombre depuis des années sans jamais toucher le fond.",
    W(FAVORITE, [
      B("Mon favori m’a promis l’ennui à deux. Je viens vérifier que le titre est mérité.", "teasing"),
    ], [
      B("Tu as dit ailleurs. Voilà ailleurs. Il sent la poussière et la cire de la dernière représentation.", "teasing"),
    ]),
  ],
  approaches: () => [
    { id: "ennui-premier-rang", text: "La laisser s’asseoir au premier rang et monter seul·e sur scène.", lines: [
      "Elle enjambe une housse et se laisse tomber dans un fauteuil du premier rang, les jambes par-dessus l’accoudoir. Vous montez les trois marches de la scène.",
      B("Le public attend. Il est d’humeur exécrable.", "smirk"),
    ] },
    { id: "ennui-coulisses", text: "L’emmener d’abord voir les coulisses.", lines: [
      "Vous passez derrière le rideau. Les cordes pendent des cintres comme des lianes, et une odeur de colle et de peinture flotte entre les décors empilés.",
      B("Tu me montres l’envers du décor avant le spectacle. Quelle impolitesse délicieuse.", "seductive"),
    ] },
  ],
  ending: (flags) => [
    "Vous ressortez par la porte de service avec des flocons de papier dans les cheveux. Un garde vous croise, ouvre la bouche, puis la referme et regarde ailleurs.",
    W(FAVORITE, [
      B("Deux fois. J’ai bâillé deux fois en une heure, avec toi, et plus aucun depuis le rideau de gaze. Je vais devoir le faire graver quelque part.", "teasing"),
    ], [
      B("Je ne me suis pas ennuyée. C’est très inquiétant. Ne t’avise pas de le répéter à qui que ce soit.", "smirk"),
    ]),
  ],
  route: {
    id: "bellirith-heure-ennui",
    context: "bellirith-free-ennui",
    text: "La surprendre",
    detail: "Elle s’assoit au premier rang d’un théâtre vide et compte ses bâillements. Au troisième, elle rentre. À vous de faire en sorte qu’il ne vienne jamais.",
    visual: { revealChapter: 4, postOrgasmChapter: 11 },
    chapters: [
      A(
        "Elle s’étire dans son fauteuil, les bras au-dessus de la tête, et bâille ostensiblement, une main sur la bouche.",
        B("Voici la règle. Je compte mes bâillements. Au troisième, je me lève, je rentre et je deviens vertueuse pour le reste de la semaine.", "teasing"),
        P("Tu n’as jamais été vertueuse une semaine entière."),
        B("Alors tu imagines l’horreur. Tout repose sur toi.", "smirk"),
      ),
      A(
        "Vous descendez de scène et vous lui baisez la main, galamment, en prenant votre temps.",
        "Elle bâille. Lentement, avec application.",
        B("Un.", "cold"),
        "Vous remontez sur scène, vexé·e. Contre le mur des coulisses, une grande plaque de tôle pend au bout d’une chaîne. Vous la secouez de toutes vos forces. Le tonnerre roule dans la salle vide et fait trembler les lustres sous leurs housses.",
        "Elle sursaute si fort qu’elle manque de tomber de son fauteuil. Puis elle rit, incrédule, une main sur le cœur.",
        B("Ça, je ne l’avais pas vu venir.", "teasing"),
      ),
      M(
        [
          "Vous lui tendez la main depuis le bord de la scène. Elle la prend et vous la hissez près de vous, sous la tempête peinte. Vous l’embrassez devant la salle déserte.",
          "Elle tourne la tête vers les fauteuils vides, comme pour vérifier l’effet produit. Vous ramenez doucement son visage vers vous.",
        ],
        [
          "Vous lui tendez la main depuis le bord de la scène. Elle la prend et vous la hissez près de vous, sous la tempête peinte, dans la lumière de l’unique lanterne que vous avez allumée.",
          "Vous l’embrassez devant trois cents fauteuils vides. Elle joue le jeu avec délice, se cambre comme une héroïne de tragédie, jette un regard en coin vers la salle pour s’assurer de son public.",
          "Vous lui prenez le menton et ramenez son visage vers vous. Elle cesse de jouer pour la salle. Le baiser suivant, elle vous le donne à vous seul·e.",
        ],
        [
          "Vous lui tendez la main depuis le bord de la scène. Elle la prend et vous la hissez près de vous, sous la tempête peinte, dans la lumière de l’unique lanterne que vous avez allumée.",
          "Vous l’embrassez devant trois cents fauteuils vides. Elle joue le jeu avec délice, se cambre comme une héroïne de tragédie, jette un regard en coin vers la salle pour s’assurer de son public, et glisse au passage une cuisse entre les vôtres.",
          "Vous lui prenez le menton et ramenez son visage vers vous. Elle cesse de jouer pour la salle. Le baiser suivant, elle vous le donne à vous seul·e, la bouche ouverte et les mains déjà sous vos vêtements.",
        ],
        ["Sur scène, sous la tempête peinte, vous l’embrassez. Elle cesse vite de jouer pour la salle."],
      ),
      M(
        [
          "Elle commence à défaire vos vêtements, puis s’arrête et bâille.",
          B("Deux. Tout le monde se déshabille de la même façon.", "cold"),
          "Alors vous passez derrière le rideau de gaze et vous vous dévêtez seul·e, lentement, en ombre chinoise devant la lanterne.",
        ],
        [
          "Elle commence à défaire vos vêtements, bouton après bouton. Au quatrième, elle s’interrompt et bâille, sans même se cacher.",
          B("Deux. Pardon. Tout le monde se déshabille de la même façon, c’est plus fort que moi.", "cold"),
          "Vous reculez sans un mot et passez derrière le grand rideau de gaze du fond de scène. Vous déplacez la lanterne derrière vous. Puis vous vous dévêtez lentement, et votre ombre s’étire, immense, sur le tissu tendu.",
          "De l’autre côté, elle ne bâille plus du tout.",
        ],
        [
          "Elle commence à défaire vos vêtements, bouton après bouton. Au quatrième, elle s’interrompt et bâille, sans même se cacher.",
          B("Deux. Pardon. Tout le monde se déshabille de la même façon, c’est plus fort que moi.", "cold"),
          "Vous reculez sans un mot et passez derrière le grand rideau de gaze du fond de scène. Vous déplacez la lanterne derrière vous. Puis vous vous dévêtez lentement, et votre ombre s’étire, immense, sur le tissu tendu.",
          X(
            "Elle voit votre silhouette lever les bras pour faire glisser votre chemise, le profil de vos seins se découper, la ligne de vos hanches quand le reste tombe à vos pieds.",
            "Elle voit votre silhouette lever les bras pour faire glisser votre chemise, puis le profil net de votre désir dressé quand le reste tombe à vos pieds.",
            "Elle voit votre silhouette lever les bras pour faire glisser votre chemise, l’arrondi de votre poitrine, puis le profil de votre désir dressé quand le reste tombe à vos pieds.",
          ),
          "De l’autre côté, elle ne bâille plus du tout. Elle a avancé jusqu’à toucher la gaze du bout des doigts.",
        ],
        ["Elle bâille une deuxième fois. Vous allez vous dévêtir derrière le rideau de gaze, en ombre chinoise. Elle ne bâille plus."],
      ),
      M(
        [
          "Elle passe derrière la gaze à son tour. Sa robe tombe. Pendant un instant, vos deux ombres se mêlent sur le tissu, puis elle vient contre vous.",
        ],
        [
          "Elle passe derrière la gaze à son tour. Elle ne dit rien. Sa robe glisse de ses épaules et tombe avec un bruit d’eau.",
          "Pendant un instant, sur le tissu, vos deux ombres se cherchent et se mêlent, et la salle vide aurait eu droit au plus beau spectacle de la saison. Puis elle franchit les derniers pas et vous la recevez nue contre vous.",
        ],
        [
          "Elle passe derrière la gaze à son tour. Elle ne dit rien. Sa robe glisse de ses épaules et tombe avec un bruit d’eau. Dessous, il n’y a rien, et la lanterne la dore tout entière : la pointe dressée de ses seins, son ventre, la courbe de ses fesses quand elle se retourne pour vous laisser regarder.",
          "Pendant un instant, sur le tissu, vos deux ombres se cherchent et se mêlent, et la salle vide aurait eu droit au plus beau spectacle de la saison. Puis elle franchit les derniers pas et vous la recevez nue contre vous, peau contre peau, son cœur cognant contre le vôtre.",
        ],
        ["Elle vous rejoint derrière la gaze et sa robe tombe. Vos ombres se mêlent sur le tissu."],
      ),
      M(
        [
          "Au milieu des décors trône un grand siège de bois peint en or. Vous l’y faites asseoir et vous vous agenouillez devant elle. Elle ouvre la bouche pour bâiller ; c’est un soupir qui en sort.",
        ],
        [
          "Au milieu des décors trône un grand fauteuil de bois peint en or, celui de tous les rois de la troupe. Vous l’y faites asseoir, vous posez sur ses cheveux une couronne de fer-blanc et vous vous agenouillez devant elle.",
          "Vous embrassez ses genoux, puis plus haut. Elle ouvre la bouche, par réflexe, comme pour bâiller. C’est un soupir qui en sort, long et tremblant.",
        ],
        [
          "Au milieu des décors trône un grand fauteuil de bois peint en or, celui de tous les rois de la troupe. Vous l’y faites asseoir, vous posez sur ses cheveux une couronne de fer-blanc et vous vous agenouillez devant elle.",
          "Vous lui écartez les genoux et remontez à petits baisers le long de ses cuisses, jusqu’à poser la bouche sur son intimité. Vous la goûtez lentement, la langue large d’abord, puis précise, en cercles serrés sur sa perle.",
          "Elle ouvre la bouche, par réflexe, comme pour bâiller. C’est un soupir qui en sort, long et tremblant, et ses mains agrippent les accoudoirs dorés au point d’en écailler la peinture.",
        ],
        ["Sur le trône de bois doré, couronne de fer-blanc sur la tête, elle soupire au lieu de bâiller."],
      ),
      A(
        B("Tu triches. On ne peut pas bâiller dans ces conditions.", "angry"),
        "Une lueur passe derrière les hautes fenêtres : la lanterne d’une ronde. Vous vous figez tous les deux, elle sur son trône, vous à genoux, comme deux statues dans un tableau vivant.",
        "Les pas s’éloignent. Elle se mord le poing pour ne pas éclater de rire, et sa couronne lui tombe sur le nez.",
        B("Si on nous avait vus. Un tableau vivant. On aurait fait payer l’entrée.", "teasing"),
      ),
      M(
        [
          "Elle se lève, vous pousse sur une pile de vieux rideaux de velours et prend sa revanche avec les mains, puis avec la bouche, jusqu’à ce que vous oubliiez où vous êtes.",
        ],
        [
          "Elle se lève, ôte sa couronne et vous pousse en arrière sur une pile de vieux rideaux de velours rouge qui sentent la poussière et la lavande.",
          "Elle prend sa revanche avec méthode, des mains d’abord, puis de la bouche, en remontant chaque fois que vous approchez du bord pour vous regarder la supplier.",
        ],
        [
          "Elle se lève, ôte sa couronne et vous pousse en arrière sur une pile de vieux rideaux de velours rouge qui sentent la poussière et la lavande.",
          X(
            "Elle s’allonge sur vous, glisse deux doigts en vous et presse son pouce sur votre perle, sans hâte, en descendant ensuite vous goûter. Chaque fois que vous approchez du bord, elle s’arrête et remonte vous regarder, ravie.",
            "Elle s’allonge entre vos jambes et vous prend dans sa bouche, profondément, puis vous relâche et vous caresse d’une main lente. Chaque fois que vous approchez du bord, elle s’arrête et remonte vous regarder, ravie.",
            "Elle s’allonge entre vos jambes, prend votre vigueur dans sa bouche et caresse votre chaleur du bout des doigts, sans hâte. Chaque fois que vous approchez du bord, elle s’arrête et remonte vous regarder, ravie.",
          ),
          B("Toi non plus, tu ne t’ennuies pas, on dirait.", "seductive"),
        ],
        ["Elle vous renverse sur des rideaux de velours et prend sa revanche."],
      ),
      M(
        [
          "Du pied, vous heurtez un long tambour couché sur le sol. Des pois secs roulent à l’intérieur et la pluie se met à tomber sur le théâtre. Elle rit contre votre cou et décide que la pluie est parfaite.",
        ],
        [
          "En vous retournant, vous heurtez du pied un long tambour couché sur le plancher. Des milliers de pois secs roulent à l’intérieur, et une averse soudaine se met à tomber sur le théâtre vide.",
          "Elle relève la tête, stupéfaite, puis éclate de rire contre votre cou. Du bout de l’orteil, elle relance le tambour pour que la pluie continue.",
          B("Laisse-la tomber. J’ai toujours voulu qu’on me fasse l’amour sous l’orage.", "seductive"),
        ],
        [
          "En vous retournant, vous heurtez du pied un long tambour couché sur le plancher. Des milliers de pois secs roulent à l’intérieur, et une averse soudaine se met à tomber sur le théâtre vide.",
          "Elle relève la tête, stupéfaite, puis éclate de rire contre votre cou. Du bout de l’orteil, elle relance le tambour pour que la pluie continue, sans cesser pour autant de vous caresser de l’autre main.",
          B("Laisse-la tomber. J’ai toujours voulu qu’on me prenne sous l’orage, et la vraie pluie mouille.", "seductive"),
        ],
        ["Un tambour à pois roule sous votre pied : il pleut sur le théâtre. Elle veut que la pluie continue."],
      ),
      M(
        [
          "Elle vous ramène jusqu’au trône doré, s’y assoit sur vous et vous unit à elle, face à la salle vide, sous la pluie qui ne mouille pas.",
        ],
        [
          "Elle vous ramène jusqu’au trône doré, vous y fait asseoir et s’installe à califourchon sur vos genoux, face à vous, dos à la salle vide.",
          "Vous vous unissez lentement, le vieux bois craquant sous votre poids à chaque mouvement, pendant que la fausse averse ralentit et que les derniers pois roulent comme des gouttes sur un toit.",
        ],
        [
          "Elle vous ramène jusqu’au trône doré, vous y fait asseoir et s’installe à califourchon sur vos genoux, face à vous, dos à la salle vide.",
          X(
            "Elle se presse contre vous, son intimité contre la vôtre, et commence à onduler. Vos chaleurs glissent l’une sur l’autre, de plus en plus vite, ses doigts glissés entre vous pour accentuer chaque frottement.",
            "Elle descend sur vous d’un seul mouvement lent, jusqu’au bout, et commence à onduler, les mains crispées sur le dossier sculpté derrière votre tête.",
            "Elle descend sur votre vigueur d’un seul mouvement lent, jusqu’au bout, et commence à onduler, une main glissée en arrière pour caresser votre chaleur au même rythme.",
          ),
          "Le vieux bois craque sous votre poids à chaque mouvement, pendant que la fausse averse ralentit et que les derniers pois roulent comme des gouttes sur un toit.",
        ],
        ["Sur le trône doré, elle vous chevauche, face à vous."],
      ),
      M(
        [
          "Le plaisir monte. Votre main cherche un appui et attrape une corde. Quelque part dans les cintres, un sac s’ouvre, et une neige de papier blanc tombe sur vous deux au moment où vous basculez.",
        ],
        [
          "Le plaisir monte, vite maintenant. Votre main cherche un appui, attrape une corde qui pend près du trône et tire. Quelque part dans les cintres, un sac s’ouvre.",
          "Une neige de papier blanc se met à tomber sur vous deux, lente, silencieuse, au moment exact où elle se crispe contre vous et vous emporte avec elle.",
        ],
        [
          "Le plaisir monte, vite maintenant. Votre main cherche un appui, attrape une corde qui pend près du trône et tire. Quelque part dans les cintres, un sac s’ouvre.",
          X(
            "Une neige de papier blanc se met à tomber sur vous deux, lente, silencieuse, au moment exact où elle jouit contre vous en tremblant, et son plaisir déclenche le vôtre une seconde plus tard.",
            "Une neige de papier blanc se met à tomber sur vous deux, lente, silencieuse, au moment exact où elle se resserre autour de vous en criant, et vous vous répandez en elle dans la seconde.",
            "Une neige de papier blanc se met à tomber sur vous deux, lente, silencieuse, au moment exact où elle se resserre autour de votre vigueur en criant, et vous jouissez dans la seconde, des deux côtés, sous ses doigts.",
          ),
        ],
        ["Une corde tirée par hasard : de la neige de papier tombe des cintres au moment où vous jouissez."],
      ),
      M(
        [
          "Vous restez allongés sur les rideaux de velours, couverts de flocons de papier. Elle en retire un de vos cheveux, puis un autre, très sérieuse.",
        ],
        [
          "Vous finissez allongés sur les rideaux de velours, sous la tempête peinte, couverts de flocons de papier. Elle en retire un de vos cheveux, puis un autre, avec un sérieux de chirurgienne.",
          B("Il en reste trois cents. J’ai le temps.", "teasing"),
        ],
        [
          "Vous finissez allongés sur les rideaux de velours, sous la tempête peinte, couverts de flocons de papier qui collent à vos peaux encore moites. Elle en retire un de vos cheveux, puis un sur votre épaule, puis un autre beaucoup plus bas, avec un sérieux de chirurgienne.",
          B("Il en reste trois cents. J’ai le temps, et j’ai l’intention de tous les retirer à la main.", "teasing"),
        ],
        ["Vous restez couverts de neige de papier. Elle vous en débarrasse flocon par flocon."],
      ),
      A(
        P("Tu n’as bâillé que deux fois."),
        B("Je sais compter. Je n’en ferai pas un troisième, de peur que tu inventes autre chose. J’ai encore du tonnerre dans les oreilles.", "smirk"),
        W(FAVORITE, [
          B("Le titre de favori, je le confirme. Avec mention spéciale pour la pluie.", "seductive"),
        ], [
          B("Il faudra revenir. Il reste une machine à vent dans les coulisses, et je veux savoir ce que tu en ferais.", "seductive"),
        ]),
      ),
    ],
  },
};
