import { A, B, M, P, W, X, SLEPT, FAVORITE, type HeureVolee } from "./bellirith-intimacy-kit";

/*
 * Heure volée · « Le pari de la salle de musique » (invitation, choix ibm-prize).
 * {player} a interrompu le pari des dix-sept diplomates pour « sauter à la
 * partie où quelqu’un doit quelque chose à l’autre ». Le prix se négocie
 * dans le vestiaire des délégations, entre les manteaux brodés, comme un
 * traité : articles, contre-propositions, amendements, paraphe final.
 */
export const HEURE_FAVEUR: HeureVolee = {
  context: "bellirith-free-faveur",
  title: "Le traité du vestiaire",
  devLabel: "Pari des diplomates (invitation)",
  background: "/assets/backgrounds/akuhn_palace.webp",
  opening: (flags) => [
    "Elle vous entraîne dans le vestiaire des délégations, une pièce étroite où dix-sept manteaux pendent à dix-sept patères, chacun brodé d’armoiries. À travers la cloison, le clavecin reprend un menuet sans elle.",
    W(SLEPT, [
      B("Six aveux sur dix-sept, et tu as tout arrêté d’une phrase. Tu sais déjà ce que je fais aux gens qui me doivent quelque chose. Assieds-toi. On négocie quand même, pour la forme.", "smirk"),
    ], [
      B("Tu as interrompu mon pari. Six aveux sur dix-sept. Il m’en restait onze, et tu les as fait disparaître avec une seule phrase. Tu me dois une victoire, et je compte bien la négocier.", "smirk"),
    ]),
  ],
  approaches: () => [
    { id: "faveur-banc", text: "Vous asseoir face à elle sur le banc, comme à une table de négociation.", lines: [
      "Vous vous asseyez à l’autre bout du banc, les mains croisées sur le genou. Elle se redresse, ravie, et prend la pose d’une plénipotentiaire.",
      B("La délégation adverse a de bonnes manières. C’est suspect.", "teasing"),
    ] },
    { id: "faveur-patere", text: "Rester debout, adossé·e aux manteaux, et la laisser ouvrir les débats.", lines: [
      "Vous vous adossez aux manteaux. Une odeur de tabac froid et de fourrure vous enveloppe.",
      B("Tu choisis le terrain de l’adversaire. Audacieux. Ou mal conseillé.", "smirk"),
    ] },
  ],
  ending: (flags) => [
    "Vous regagnez la salle de musique séparément, à cinq minutes d’intervalle. Un diplomate cherche son manteau en vain, et Bellirith lui conseille avec un sérieux parfait de porter plainte auprès de son propre gouvernement.",
    W(FAVORITE, [
      B("Mon favori négocie comme un vieux légat. Je ne sais pas si c’est un compliment. Je crois que oui.", "seductive"),
    ], [
      B("Nous rouvrirons les négociations. Les traités se renégocient. C’est le principe même de la diplomatie.", "teasing"),
    ]),
  ],
  route: {
    id: "bellirith-heure-faveur",
    context: "bellirith-free-faveur",
    text: "Négocier le prix",
    detail: "Vous lui devez onze aveux. Elle réclame des faveurs en échange, article par article. Vous avez le droit de contre-proposer, et elle adore les amendements.",
    visual: { revealChapter: 4, postOrgasmChapter: 11 },
    chapters: [
      A(
        B("Article premier. La délégation adverse me doit tout.", "teasing"),
        P("Rejeté. Contre-proposition : une faveur par diplomate que tu n’as pas eu le temps de faire parler."),
        B("Onze faveurs.", "thoughtful"),
        P("Onze. Et j’ai le droit d’amender."),
        B("Accepté. Tu vas le regretter, et j’ai hâte.", "smirk"),
      ),
      A(
        "Elle se lève, passe la main le long des manteaux comme une archiviste devant ses registres, et s’arrête sur une cape grise, sobre, sans fourrure.",
        B("Le premier envoyé, celui qui n’a pas avoué. Il voulait qu’on le remarque. Première faveur : remarque-moi.", "seductive"),
        "Vous la regardez. Vraiment. Ses yeux, sa bouche, la façon dont elle se tient un peu trop droite. Elle supporte votre regard plus longtemps que vous ne l’auriez cru.",
        B("Faveur payée. Il en reste dix.", "smirk"),
      ),
      M(
        [
          "La deuxième faveur, c’est un baiser. Elle précise : un baiser de signataire, solennel et interminable. Vous le lui donnez contre les manteaux.",
        ],
        [
          "Elle touche une cape brodée de fils d’argent. La deuxième faveur, c’est un baiser. Elle précise : un baiser de signataire, solennel, interminable, de ceux qu’on donne pour sceller la paix entre deux royaumes.",
          "Vous le lui donnez contre les manteaux, sous une odeur de fourrure et de poudre, si longtemps que le menuet de la salle voisine a le temps de finir et de recommencer.",
        ],
        [
          "Elle touche une cape brodée de fils d’argent. La deuxième faveur, c’est un baiser. Elle précise : un baiser de signataire, solennel, interminable, de ceux qu’on donne pour sceller la paix entre deux royaumes.",
          "Vous le lui donnez contre les manteaux, sous une odeur de fourrure et de poudre, si longtemps que le menuet de la salle voisine a le temps de finir et de recommencer. Ses mains s’égarent sous votre veste, puis plus bas, en terrain qu’aucun article n’a encore couvert, et elle presse votre désir à travers le tissu avec une fermeté de chancelière qui conclut une séance.",
          P("Ce n’était pas dans l’article."),
          B("Annexe secrète.", "seductive"),
        ],
        ["Un baiser de signataire, contre les manteaux, interminable."],
      ),
      M(
        [
          B("Troisième faveur : déshabille-toi.", "teasing"),
          P("Amendement : je te déshabille d’abord."),
          "Elle fait mine d’hésiter, puis tourne le dos et vous présente les agrafes de sa robe.",
        ],
        [
          B("Troisième faveur : déshabille-toi, lentement, devant moi.", "teasing"),
          P("Amendement. Je te déshabille d’abord. Je me déshabille ensuite. L’ordre change, l’esprit du texte est respecté."),
          "Elle plisse les yeux, comme une ambassadrice qui flaire un piège dans la formulation.",
          B("Amendement adopté, à une voix contre zéro.", "smirk"),
          "Elle tourne le dos et vous présente les agrafes de sa robe.",
        ],
        [
          B("Troisième faveur : déshabille-toi, lentement, devant moi.", "teasing"),
          P("Amendement. Je te déshabille d’abord. Je me déshabille ensuite. L’ordre change, l’esprit du texte est respecté."),
          "Elle plisse les yeux, comme une ambassadrice qui flaire un piège dans la formulation.",
          B("Amendement adopté, à une voix contre zéro.", "smirk"),
          "Elle tourne le dos et vous présente les agrafes de sa robe. Vous les défaites une à une, et vous embrassez chaque bande de peau qui apparaît, de la nuque jusqu’au creux des reins, en sentant son dos frémir sous vos lèvres.",
        ],
        ["Elle vous demande de vous dévêtir. Vous amendez : elle d’abord."],
      ),
      M(
        [
          "La robe tombe. Elle décroche un manteau doublé de zibeline et s’en drape un instant, puis l’ouvre devant vous.",
        ],
        [
          "La robe tombe à ses pieds. Elle décroche un lourd manteau doublé de zibeline, s’y glisse nue, se retourne et le tient fermé contre elle.",
          B("Quatrième faveur. Regarde.", "seductive"),
          "Et elle l’ouvre, lentement, la fourrure sombre encadrant sa peau pâle comme un écrin.",
        ],
        [
          "La robe tombe à ses pieds. Elle décroche un lourd manteau doublé de zibeline, s’y glisse nue, se retourne et le tient fermé contre elle.",
          B("Quatrième faveur. Regarde.", "seductive"),
          "Et elle l’ouvre, lentement. La fourrure sombre encadre sa peau pâle comme un écrin : ses seins dressés par la fraîcheur, son ventre, le haut de ses cuisses. Elle laisse le manteau glisser d’une épaule, puis de l’autre, et reste nue devant vous, les pieds dans sa robe.",
          "Vous tenez votre propre article : vos vêtements suivent les siens, et elle compte chaque pièce à voix haute.",
        ],
        ["Elle s’enveloppe de zibeline, puis l’ouvre devant vous."],
      ),
      A(
        "On frappe à la porte du vestiaire.",
        "« Le manteau de Son Excellence, s’il vous plaît. Celui à boutons de corne. »",
        "Bellirith attrape le premier manteau venu, entrouvre la porte d’une main, et le tend dehors sans regarder.",
        B("Voici.", "cold"),
        "La porte se referme. Elle se retourne vers vous, radieuse.",
        B("Il avait des boutons d’argent. Incident diplomatique. Cinquième faveur : tu ne dis rien à personne.", "teasing"),
      ),
      M(
        [
          "Elle s’allonge sur le banc et réclame la sixième faveur d’un geste. Vous la couvrez de baisers jusqu’à ce qu’elle en oublie de compter.",
        ],
        [
          "Elle s’allonge sur le banc, la tête sur une cape pliée, et réclame la sixième faveur d’un seul geste du menton vers le bas.",
          "Vous vous agenouillez près du banc et la couvrez de baisers, de plus en plus bas. Au bout d’un moment, elle oublie de compter les faveurs.",
        ],
        [
          "Elle s’allonge sur le banc, la tête sur une cape pliée, et réclame la sixième faveur d’un seul geste du menton vers le bas.",
          "Vous vous agenouillez près du banc, lui écartez les cuisses et la goûtez longuement, la langue en larges caresses sur son intimité, puis serrée sur sa perle, vos doigts glissés en elle. Elle oublie de compter. Elle oublie le menuet. Elle jouit en tirant un manteau sur son visage pour étouffer son cri, les hanches soulevées vers votre bouche.",
        ],
        ["Sur le banc, vous la couvrez de baisers. Elle en oublie de compter."],
      ),
      M(
        [
          P("Clause de réciprocité."),
          B("Je n’ai jamais signé ça.", "angry"),
          P("Annexe secrète."),
          "Elle rit, et vous rend la faveur.",
        ],
        [
          P("Clause de réciprocité."),
          B("Je n’ai jamais signé ça.", "angry"),
          P("Annexe secrète. Tu viens de l’inventer toi-même."),
          "Elle rit, renversée sur le banc, battue par sa propre jurisprudence. Puis elle se relève, vous pousse contre les manteaux et vous rend la faveur avec une générosité très peu diplomatique.",
        ],
        [
          P("Clause de réciprocité."),
          B("Je n’ai jamais signé ça.", "angry"),
          P("Annexe secrète. Tu viens de l’inventer toi-même."),
          "Elle rit, renversée sur le banc, battue par sa propre jurisprudence. Puis elle se relève et vous pousse contre les manteaux.",
          X(
            "Elle s’agenouille dans les pans de fourrure et vous prend avec la bouche, la langue sur votre perle, deux doigts recourbés en vous, avec une générosité très peu diplomatique.",
            "Elle s’agenouille dans les pans de fourrure et vous prend dans sa bouche, longuement, une main serrée autour de vous, avec une générosité très peu diplomatique.",
            "Elle s’agenouille dans les pans de fourrure, prend votre vigueur dans sa bouche et glisse ses doigts dans votre chaleur, avec une générosité très peu diplomatique.",
          ),
          "Vous vous agrippez aux patères. Un manteau se décroche et vous tombe sur l’épaule.",
        ],
        ["Clause de réciprocité. Elle rit et vous rend la faveur contre les manteaux."],
      ),
      A(
        B("Septième faveur, et dernier article : je suis au-dessus.", "seductive"),
        P("Amendement : chacun son tour."),
        B("Rejeté.", "cold"),
        P("Alors je quitte la table."),
        "Elle vous regarde, nue, au milieu des manteaux tombés, et éclate de rire.",
        B("Compromis. Je commence. Tu finis. Les quatre faveurs restantes, je les garde en réserve, avec intérêts.", "smirk"),
      ),
      M(
        [
          "Vous jetez une brassée de manteaux sur le sol. Elle vous y allonge, s’installe sur vous et vous unit à elle, au milieu des armoiries de dix-sept délégations.",
        ],
        [
          "Vous arrachez une brassée de manteaux aux patères et les jetez sur le sol en un lit de fourrure, de soie et de velours. Elle vous y allonge et s’installe sur vous.",
          "Vous vous unissez au milieu des armoiries de dix-sept délégations. Puis, comme convenu, vous la faites rouler sur le dos et vous terminez au-dessus, ses chevilles croisées dans votre dos.",
        ],
        [
          "Vous arrachez une brassée de manteaux aux patères et les jetez sur le sol en un lit de fourrure, de soie et de velours. Elle vous y allonge et s’installe sur vous.",
          X(
            "Elle se couche sur vous, son intimité contre la vôtre, et ondule lentement, puis de plus en plus vite. Comme convenu, vous la faites rouler sur le dos à mi-chemin et c’est vous qui menez la fin, vos chaleurs glissant l’une contre l’autre.",
            "Elle descend sur vous et vous chevauche lentement, puis de plus en plus fort. Comme convenu, vous la faites rouler sur le dos à mi-chemin et vous la prenez au-dessus, ses chevilles croisées dans votre dos.",
            "Elle descend sur votre vigueur, une main pressée sur votre chaleur, et vous chevauche lentement, puis de plus en plus fort. Comme convenu, vous la faites rouler sur le dos à mi-chemin et vous terminez au-dessus, ses chevilles croisées dans votre dos.",
          ),
          "Les armoiries de dix-sept délégations s’impriment dans vos peaux. Une boucle de ceinturon vous mord la hanche, un col de fourrure vous chatouille la nuque, et elle se moque de vous à chaque grimace sans ralentir pour autant, jusqu’à ce que vous la fassiez taire d’un coup de reins plus profond que les autres.",
        ],
        ["Sur un lit de manteaux, elle commence au-dessus. Vous finissez."],
      ),
      M(
        [
          "Vous basculez ensemble, la bouche de l’un dans le cou de l’autre, pendant que le menuet s’achève derrière la cloison.",
        ],
        [
          "Le plaisir vous prend presque en même temps, juste au moment où, derrière la cloison, le menuet s’achève sur un accord et que la salle applaudit.",
        ],
        [
          X(
            "Le plaisir vous prend presque en même temps, vos corps frottés l’un contre l’autre jusqu’au bout, juste au moment où, derrière la cloison, le menuet s’achève sur un accord.",
            "Elle se resserre autour de vous et vous jouissez en elle presque en même temps, juste au moment où, derrière la cloison, le menuet s’achève sur un accord.",
            "Elle se resserre autour de votre vigueur et vous jouissez des deux côtés presque en même temps, juste au moment où, derrière la cloison, le menuet s’achève sur un accord.",
          ),
          "La salle voisine applaudit. Bellirith, hors d’haleine, incline la tête vers la cloison avec la gravité d’une soliste qui salue.",
        ],
        ["Vous jouissez au moment où le menuet s’achève, sous les applaudissements de la salle voisine."],
      ),
      M(
        [
          "Vous restez emmêlés dans les manteaux. Elle compte les armoiries à voix basse, puis s’arrête à neuf et s’endort presque.",
        ],
        [
          "Vous restez emmêlés dans les manteaux, une manche de velours sur le visage. Elle reprend le compte des armoiries à voix basse, du bout du doigt sur votre épaule.",
          "Elle s’arrête à neuf, perd le fil et recommence, puis renonce et se blottit contre vous.",
        ],
        [
          "Vous restez emmêlés dans les manteaux, nus, une manche de velours en travers de la poitrine. Elle reprend le compte des armoiries à voix basse, en dessinant chaque blason du bout du doigt sur votre peau, l’épaule, le flanc, la hanche.",
          "Elle s’arrête à neuf, perd le fil et recommence, puis renonce et se blottit contre vous, une jambe passée sur les vôtres, la joue contre votre cœur. Vous sentez sa respiration ralentir, puis reprendre, plus vite, quand vos doigts descendent paresseusement le long de sa colonne. Elle grogne que ce n’est pas prévu au traité, et ne bouge pas d’un pouce.",
        ],
        ["Emmêlés dans les manteaux, elle compte les blasons et perd le fil."],
      ),
      A(
        B("Il reste à parapher le traité.", "teasing"),
        "Elle trempe le doigt dans le fard de ses lèvres et trace sur votre poitrine un B élégant, puis vous tend le même doigt.",
        "Vous signez sur sa hanche, de votre initiale.",
        W(SLEPT, [
          B("Traité ratifié. Les quatre faveurs restantes portent intérêt. Je viendrai les réclamer à des heures indécentes.", "seductive"),
        ], [
          B("Traité ratifié. Les quatre faveurs restantes, je les réclamerai. Tu viens de signer un accord avec moi, et tu as l’air content·e. C’est très imprudent.", "seductive"),
        ]),
      ),
    ],
  },
};
