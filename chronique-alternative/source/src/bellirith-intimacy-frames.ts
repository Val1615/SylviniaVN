import { B, P, S, W, FAVORITE, RESISTED, SLEPT, TREND_RESISTED, type AuthoredApproach, type BellirithIntimacyContext, type BellirithIntimacyKind, type FlagText, type RawLine } from "./bellirith-intimacy-kit";

/*
 * Cadres des intimités Bellirith : ouvertures (avant le choix d’approche),
 * approches et fins. Les fins portent les conséquences : en direct, la
 * mission a réellement attendu ; en rattrapage, personne n’attendait
 * (spec §21 : jamais de pénalité rétroactive).
 */

const live = (id: string, flags: string[]) => flags.includes(`bellirith-intrusion:${id}:live`) && !flags.includes(`bellirith-intrusion:${id}:catchup`);

/** Les heures volées portent leurs propres cadres (bellirith-heure-*.ts). */
export const OPENINGS: Partial<Record<BellirithIntimacyContext, FlagText>> = {
  "bellirith-diversion-price-of-aid": (flags) => [
    ...(live("02", flags) ? [
      "Derrière vous, la porte du Conseil se referme sur la voix d’Iriana qui annonce, très calmement, qu’elle relira seule. Draven ne dit rien. Le silence de Draven est plus lourd que la voix d’Iriana.",
    ] : [
      "Personne ne vous attend ce soir. Pas de cloche, pas d’écurie, pas de lettre à relire. C’est peut-être pour ça que suivre Bellirith a surtout le goût de la curiosité.",
    ]),
    "Bellirith marche devant vous dans les couloirs du palais, sans se retourner. Elle sait que vous suivez. Elle compte vos pas, peut-être : vous la voyez sourire chaque fois que vous accélérez.",
    B("Ne regarde pas en arrière. Ça porte malheur, et surtout ça me vexe.", "teasing"),
  ],
  "bellirith-diversion-return-akuhn": (flags) => [
    ...(live("03", flags) ? [
      "En bas, dans la salle de guerre, Draven souffle la lampe. Vous l’entendez boucler la sacoche des preuves d’un geste sec, puis ses pas qui s’éloignent vers la cour basse, sans hâte, sans se retourner.",
    ] : [
      "La salle de guerre est vide derrière vous. La route est faite depuis longtemps ; il ne reste de cette nuit-là qu’une invitation qui a refusé de refroidir.",
    ]),
    W(SLEPT, [B("Tu montes cet escalier comme quelqu’un qui sait ce qu’il y a en haut. Tu ne sais rien. Mais j’aime que tu le croies.", "smirk")], [B("Attention à la sixième marche. Elle grince. Je l’ai gardée exprès : j’aime savoir quand on vient.", "teasing")]),
  ],
  "bellirith-diversion-before-light": (flags) => [
    ...(live("04", flags) ? [
      "Derrière vous, dans la galerie, Iriana reprend sa liste de noms sans lever la voix. Draven a déjà tourné les talons vers sa table et ses quarante lettres.",
    ] : [
      "La galerie est vide. L’armée est partie depuis longtemps ; la fête, elle, a été gardée au frais pour vous.",
    ]),
    "L’escalier de service sent la cire, puis le vent, puis le jasmin. Bellirith monte devant vous en fredonnant quelque chose qui ne ressemble à aucune musique d’Al’Gratal.",
    W(FAVORITE, [B("Mon favori me suit sur les toits, maintenant. Bientôt, tu me suivras dans des endroits qui n’ont pas de toit du tout.", "seductive")], []),
  ],
  "bellirith-diversion-coalition": () => [
    "Vous quittez la salle du Conseil au milieu d’une phrase de Tia. Derrière vous, la plume d’Iriana reprend, plus vite. Valurn ne vous regarde pas partir ; il regarde sa sœur, et c’est pire.",
    "Bellirith descend le grand escalier devant vous, une main glissant sur la rampe de marbre, comme une reine qui rentre d’un bal qu’elle a gâché exprès.",
    B("Ne fais pas cette tête. Les protocoles adorent qu’on les abandonne. Ça leur donne une raison d’exister.", "teasing"),
  ],
  // Contexte hérité uniquement : les sources connues ont chacune leur heure volée.
  "bellirith-free": (flags) => {
    return [
      W(SLEPT, [
        "Elle vous attendait. Elle ne le dira pas. Mais la porte de sa chambre est entrouverte, il y a deux verres sur la table et l’un d’eux est déjà servi.",
      ], [
        "Elle vous attendait. Elle ne le dira pas. Mais elle reste sur le seuil de sa chambre un moment de trop, comme quelqu’un qui vérifie qu’une chose est vraiment arrivée.",
      ]),
      W(TREND_RESISTED, [B("Aucune mission sacrifiée, aucun capitaine abandonné : tu viens parce que tu en as envie. Tu sais ce que ça me fait, ça ?", "thoughtful")], [B("Une heure volée à personne. C’est presque trop honnête pour moi.", "smirk")]),
    ];
  },
  "date-bellirith-final": (flags) => [
    "La soirée a été un long duel : des cartes, des répliques, une valse au piano dont personne n’a voulu céder la mesure. Maintenant, la salle de musique est silencieuse, et Bellirith attend, appuyée contre le piano, que vous partiez ou que vous restiez.",
    "Elle ne propose rien. Pour la première fois, elle ne propose rien.",
    P("Maintenant."),
    B("…Pardon ?", "thoughtful"),
    P("Tu m’as toujours choisi le moment. Ce soir, c’est moi. Maintenant."),
    W(RESISTED, [
      B("Toi. Toi qui m’as dit non au pire moment, chaque fois que je t’offrais le meilleur. Tu choisis le tien.", "thoughtful"),
    ], [
      B("Toi qui m’as toujours suivie quand je t’appelais. Tu m’appelles.", "thoughtful"),
    ]),
    "Le piano, derrière elle, laisse échapper une note toute seule, comme un cœur qui rate une marche.",
  ],
};

export const APPROACHES: Record<BellirithIntimacyKind, (flags: string[]) => AuthoredApproach[]> = {
  diversion: (flags) => [
    {
      id: "bel-div-follow",
      text: "Vous laisser conduire, sans un mot",
      lines: [
        "Vous ne dites rien. Vous la suivez, c’est tout. Elle s’en aperçoit et ralentit, juste assez pour que votre épaule frôle la sienne.",
        B("Silencieux·se. Tu sais que c’est la façon la plus efficace de me rendre bavarde ? Je vais te raconter tout ce que je vais te faire. Dans l’ordre.", "seductive"),
      ],
    },
    {
      id: "bel-div-provoke",
      text: "La provoquer, pour voir jusqu’où elle mène",
      lines: [
        P("Tu as l’air très sûre de toi."),
        B("Je le suis.", "smirk"),
        P("Tu pourrais être déçue."),
        "Elle s’arrête net, se retourne, et vous regarde de haut en bas avec un intérêt de collectionneuse.",
        W(SLEPT, [B("Déçue ? Par toi ? J’ai déjà vérifié, mon cœur. Plusieurs fois. Mais j’adore que tu essaies.", "teasing")], [B("Oh, j’espère bien. Les gens qui ne me déçoivent jamais m’ennuient à mourir. Essaie. Vraiment. Essaie de me décevoir.", "teasing")]),
      ],
    },
    {
      id: "bel-div-confess",
      text: "Lui avouer ce que vous laissez derrière vous",
      lines: [
        P("Je laisse quelqu’un m’attendre, pour toi."),
        "Bellirith ne répond pas tout de suite. Elle n’a pas l’air triomphante. Elle a l’air de quelqu’un qui vient de recevoir une information précieuse et qui la range soigneusement.",
        B("Je sais. C’est pour ça que je suis venue te chercher à ce moment-là, et pas à un autre.", "thoughtful"),
        B("Mais merci de l’avoir dit. Ça rend la chose meilleure. Pour moi.", "seductive"),
      ],
    },
  ],
  free: (flags) => [
    {
      id: "bel-free-remind",
      text: flags.includes(SLEPT) ? "Lui rappeler ce qu’elle sait déjà de vous" : "Lui dire que vous avez pensé à ses propositions",
      lines: flags.includes(SLEPT) ? [
        P("Tu te souviens de tout, paraît-il."),
        B("De tout. Du côté où tu tournes la tête. Du mot que tu avales. De la façon dont tu dis mon nom quand tu ne sais plus où tu es.", "seductive"),
        P("Alors prouve-le."),
        B("Avec plaisir. Avec beaucoup de plaisir.", "smirk"),
      ] : [
        P("J’ai pensé à chacune de tes propositions. Après les avoir refusées."),
        B("Ça, c’est la phrase la plus cruelle et la plus délicieuse qu’on m’ait dite cette année.", "thoughtful"),
        B("Raconte. Laquelle t’a tenu éveillé·e le plus longtemps ?", "seductive"),
      ],
    },
    {
      id: "bel-free-wait",
      text: "La faire attendre une seconde de plus",
      lines: [
        "Vous restez sur le seuil. Vous ne bougez pas. Une seconde, deux, trois.",
        B("Qu’est-ce que tu fais ?", "cold"),
        P("Je te laisse attendre. Tu m’as appris que c’était le meilleur moment."),
        "Elle éclate de rire et vous tire à l’intérieur par le col.",
        B("Petit monstre. C’est moi qui t’ai appris ça et tu t’en sers contre moi. Je suis fière de toi. Je te déteste.", "teasing"),
      ],
    },
    {
      id: "bel-free-yield",
      text: "La laisser choisir l’heure et le reste",
      lines: [
        P("Choisis. Tout. L’heure, le reste."),
        B("Tout ? Tu es imprudent·e.", "seductive"),
        P("Je suis venu·e pour ça."),
        W(FAVORITE, [B("Voilà pourquoi tu es mon favori. Tu sais exactement ce que tu me donnes, et tu me le donnes quand même.", "seductive")], [B("Alors je choisis lentement. Très lentement. Tu vas apprendre ce que « tout » veut dire chez moi.", "smirk")]),
      ],
    },
  ],
  duel: () => [
    {
      id: "bel-duel-again",
      text: "Répéter « maintenant », plus bas",
      lines: [
        P("Maintenant, Bellirith."),
        "Elle ferme les yeux une demi-seconde. Quand elle les rouvre, quelque chose a changé dans sa posture : pas de reddition, une mise en garde.",
        B("Tu sais ce que tu fais ? Tu viens de me déclarer la guerre dans ma propre langue.", "seductive"),
      ],
    },
    {
      id: "bel-duel-rules",
      text: "Annoncer vos propres règles",
      lines: [
        P("Une règle, une seule : personne ne gagne sans que l’autre l’ait vu venir."),
        B("C’est une règle idiote. Elle rend tout plus difficile.", "cold"),
        P("Pour toi."),
        B("…Pour moi. Bien. J’accepte. Et je vais la tourner contre toi avant minuit.", "smirk"),
      ],
    },
    {
      id: "bel-duel-laugh",
      text: "Rire de sa mise en scène",
      lines: [
        "Le piano qui joue tout seul, les bougies qui baissent exactement quand il faut, le parfum qui monte au bon moment : vous éclatez de rire.",
        B("Qu’est-ce qui te fait rire ?", "angry"),
        P("Toi. Tu as tout préparé, et tu as l’air d’avoir le trac."),
        B("Je n’ai jamais le trac.", "cold"),
        "Elle a le trac. Elle le sait. Vous le savez. Elle vous lance un coussin à la figure, et la partie commence.",
      ],
    },
  ],
};

const irianaDawn: RawLine[] = [
  "À l’aube, les ordres sont partis séparément. Hylee et Remerii n’ont pas été appelées : leur magie humaine n’est ni une ressource impériale ni un secret que vous avez le droit de sacrifier à la commodité.",
  "Saidin demeure absent. Son jeton vous a ouvert la première porte ; son intention reste fermée.",
  "Iriana vous attend au pied du grand escalier, le protocole déjà scellé, sous double cachet, dans la main d’un courrier qui n’est pas vous.",
  S("Iriana", "Nous entrons dans la forêt demain. Je garderai le poste de coordination. Si une preuve change, vous venez d’abord me voir.", "stern"),
  P("Même après cette nuit ?"),
  S("Iriana", "Surtout après cette nuit. Je ne vous demande pas où vous étiez. Je vous demande d’être là quand ce sera la seule chose qui compte.", "calm"),
  "Elle ne vous reproche rien de plus. Elle a seulement remplacé votre nom par celui d’un officier sur le relevé des courriers, et elle ne l’a pas encore rayé.",
];

export const ENDINGS: Partial<Record<BellirithIntimacyContext, FlagText>> = {
  "bellirith-diversion-price-of-aid": (flags) => live("02", flags) ? [
    "Quand vous regagnez votre chambre, la septième cloche est passée depuis longtemps. Sous votre porte, quelqu’un a glissé la lettre de mission, relue, annotée de la main d’Iriana. Trois phrases ont été corrigées. Dans la marge de la troisième, elle a écrit : « Vous l’auriez vu avant moi. »",
    "À l’aube, Draven est à l’écurie nord. Il vous tend les rênes sans un mot, et ne vous regarde qu’une fois en selle.",
    S("Draven", "Vous êtes là. Bien. On ne va pas en parler.", "gruff"),
    "Vous ne regrettez rien. Vous savez seulement, avec une précision désagréable, ce que cette nuit a coûté à d’autres que vous.",
  ] : [
    "Personne ne vous attendait ce soir. Vous regagnez votre chambre sans croiser âme qui vive, avec un parfum de miel brûlé dans les cheveux et la sensation tenace d’avoir été lu·e de la première à la dernière page.",
    "Rien n’a été manqué. Pourtant, la question qu’elle vous a posée en descendant de la table vous suit jusqu’au sommeil : « Qu’est-ce que tu comptes en faire ? »",
  ],
  "bellirith-diversion-return-akuhn": (flags) => [
    ...(live("03", flags) ? [
      "La cour basse est vide quand vous y descendez. Draven est parti à la première relève, comme promis. Il a laissé un cheval sellé, la moitié du pain, et sur le pommeau de la selle, une carte de la forêt où il a tracé au charbon la route qu’il a prise.",
      "Vous le rattrapez à la lisière, à midi, couvert de poussière et sans avoir dormi. Il ne demande rien. Il vous tend seulement la gourde, en regardant devant lui.",
      S("Draven", "Les preuves vont bien. Moi aussi. Merci de demander.", "gruff"),
    ] : [
      "Personne ne vous attend dans la cour. La route est faite depuis longtemps ; la nuit, cette fois, n’a rien coûté qu’à votre sommeil.",
    ]),
    ...(flags.includes("bellirith-tip-tia-bargain") ? [
      "Au moment où vous quittez ses appartements, elle vous rattrape par la manche et vous glisse à l’oreille le prix convenu.",
      B("Tia déteste qu’on lui présente les preuves dans l’ordre. Commence par la plus laide. Elle respecte ceux qui ne la ménagent pas. Voilà. J’honore toujours mes marchés, surtout ceux que j’ai gagnés.", "seductive"),
    ] : []),
  ],
  "bellirith-diversion-before-light": (flags) => live("04", flags) ? [
    "La troisième cloche est passée depuis des heures quand vous redescendez. Le cabinet de coordination est fermé ; la table a été complète sans vous. Elle a été seulement un peu moins juste ; Iriana l’a écrit en marge du compte rendu, sans votre nom, mais vous le reconnaissez.",
    "Draven a écrit ses quarante lettres seul. Vous le trouvez endormi sur la dernière, la plume encore à la main. Vous ne le réveillez pas. Vous pliez seulement la lettre, et vous restez un moment.",
    "Vous avez pris une nuit très belle à un très mauvais moment, voilà tout. Vous le savez. Bellirith le savait avant vous, et c’est précisément pour ça qu’elle avait choisi ce moment-là.",
  ] : [
    "Personne n’attendait plus rien de cette nuit. Vous redescendez du toit au petit matin, avec du jasmin dans les cheveux et une rue de Saëlis éteinte dans la mémoire.",
  ],
  "bellirith-diversion-coalition": () => irianaDawn,
  "bellirith-free": () => [
    "Vous quittez ses appartements sans que personne vous ait attendu nulle part. C’est une sensation étrange, après tant de diversions : une nuit avec Bellirith qui n’a rien coûté à personne, sauf, peut-être, à elle.",
  ],
  "date-bellirith-final": () => [
    "Quand vous quittez la salle de musique, l’aube n’est pas encore levée sur Akuhn’Nabad. Elle ne vous raccompagne pas. Elle reste assise au piano, nue sous un châle, et joue quelque chose de lent avec une seule main.",
    B("{player}. Au début, je me disais : je peux te faire céder. Ce soir, j’ai compris que tu pouvais me tenir tête.", "thoughtful"),
    B("Alors voyons lequel de nous deux fera craquer l’autre. Et la prochaine fois, je ne te laisserai pas l’égalité.", "seductive"),
    P("La prochaine fois, je ne te la proposerai pas."),
    "Elle rit, et le piano rit avec elle. Quelque chose vient de commencer : un jeu à deux, dont aucun ne connaît encore les règles, et qu’aucun n’a l’intention de perdre.",
  ],
};
