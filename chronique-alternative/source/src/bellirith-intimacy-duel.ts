import { A, B, M, P, W, X, SLEPT, FAVORITE, RESISTED, type AuthoredRoute } from "./bellirith-intimacy-kit";

/*
 * Rendez-vous de fin d’Acte I (spec §25–26, §45 C) — « Coup pour coup ».
 * {player} a choisi « maintenant ». Structure Bellirith ↔ {player} :
 * elle tente de mener, {player} retourne une initiative, elle improvise,
 * {player} exploite une réaction, elle reprend l’ascendant, l’équilibre bouge.
 */
const DUEL_CLOSING_A = A(
  "Plus tard, beaucoup plus tard, vous êtes étendu·e sur le tapis de la salle de musique, la tête sur son ventre, et elle joue distraitement avec vos cheveux. Le piano, au-dessus de vous, s’est tu de lui-même, comme un témoin discret qui sort de la pièce.",
  B("Tu sais ce que tu as fait, ce soir ?", "thoughtful"),
  P("J’ai l’impression d’avoir perdu plusieurs fois."),
  B("Tu as perdu. Tu as gagné. Tu as reperdu. Tu m’as rendu chaque coup. Personne ne me rend les coups, {player}. Ils encaissent, ou ils s’enfuient.", "thoughtful"),
);
const DUEL_CLOSING_B = A(
  "Elle se redresse sur un coude et vous regarde avec une attention nouvelle, celle qu’on réserve à un adversaire dont on vient de découvrir la force.",
  B("Je croyais que je cherchais à savoir ce que tu désirais vraiment. Je crois que je viens de trouver quelque chose de beaucoup plus dangereux.", "thoughtful"),
  P("Quoi ?"),
  B("Un partenaire de jeu. Quelqu’un qui peut me rendre coup pour coup. Tu n’as aucune idée de ce que ça va nous coûter, à tous les deux.", "seductive"),
  W(FAVORITE, [B("« Mon favori », c’était trop petit. Je vais devoir trouver un autre mot. Ça va me prendre du temps. Profites-en.", "smirk")], [B("Je n’ai pas de mot pour ça. Je vais devoir en inventer un. Ça va me prendre du temps. Profites-en.", "smirk")]),
);

export const DUEL_STEAL_ROUTE: AuthoredRoute = {
  id: "bellirith-duel-steal",
  context: "date-bellirith-final",
  text: "Lui voler le premier coup",
  detail: "Vous avez dit « maintenant ». Alors c’est vous qui ouvrez la partie. Vous verrez bien combien de temps elle vous laisse l’avantage.",
  visual: { revealChapter: 2, postOrgasmChapter: 11 },
  chapters: [
    A(
      "Elle a déjà ouvert la bouche pour annoncer les règles. Vous ne la laissez pas commencer. Vous traversez la salle de musique en trois pas, la prenez par la taille et l’embrassez, avant qu’elle ait pu placer le premier mot.",
      "Une seconde, Bellirith reste parfaitement immobile, les mains en l’air, comme quelqu’un qu’on vient de voler en pleine rue.",
      B("…Tu viens de me couper la parole.", "angry"),
      P("Tu allais fixer les règles."),
      B("Je fixe toujours les règles.", "cold"),
      P("Pas ce soir. Ce soir, c’est moi qui ai dit « maintenant »."),
      "Ses yeux se plissent. Puis, lentement, un sourire de joueuse lui monte aux lèvres, celui de quelqu’un qui vient de comprendre que la partie sera bonne.",
    ),
    M(
      [
        "Vous défaites sa robe vous-même. Elle vous laisse faire, mais elle compte chaque agrafe à voix haute, pour vous rappeler qu’elle voit tout.",
        B("Sept. Tu en as oublié une. Non, tu l’as gardée pour la fin. Tiens donc.", "thoughtful"),
      ],
      [
        "Vous défaites sa robe vous-même, agrafe après agrafe, en la faisant tourner lentement devant le grand miroir du salon. Elle vous laisse faire, mais elle compte chaque agrafe à voix haute, pour vous rappeler qu’elle voit tout.",
        B("Cinq. Six. Sept. Tu en as oublié une. Non, tu l’as gardée pour la fin. Tiens donc.", "thoughtful"),
        "Vous embrassez sa nuque au lieu de défaire la dernière. Elle frissonne, et dans le miroir, vous la voyez s’en rendre compte et le détester.",
      ],
      [
        "Vous défaites sa robe vous-même, agrafe après agrafe, en la faisant tourner lentement devant le grand miroir du salon. Elle vous laisse faire, mais elle compte chaque agrafe à voix haute, pour vous rappeler qu’elle voit tout.",
        B("Cinq. Six. Sept. Tu en as oublié une. Non, tu l’as gardée pour la fin. Tiens donc.", "thoughtful"),
        "Vous embrassez sa nuque au lieu de défaire la dernière, vos mains glissant sous le tissu ouvert pour prendre ses seins, en éprouver le poids, rouler leurs pointes entre vos doigts. Elle frissonne, et dans le miroir, vous la voyez s’en rendre compte et le détester.",
      ],
      [
        "Vous la déshabillez vous-même devant le miroir. Elle compte les agrafes à voix haute pour prouver qu’elle voit tout.",
      ],
    ),
    M(
      [
        "La robe tombe. Elle se retourne vers vous, nue, et le salon tout entier se teinte de rose.",
        B("Bien joué. À moi.", "seductive"),
      ],
      [
        "La dernière agrafe cède, la robe tombe, et elle se retourne vers vous, nue, sans aucune pudeur et avec une fierté immense. Le salon tout entier se teinte de rose ; les bougies montent d’un cran.",
        B("Bien joué. Un coup pour toi. À moi.", "seductive"),
        "Son aura se déploie d’un coup, comme une voile qui prend le vent.",
      ],
      [
        "La dernière agrafe cède, la robe tombe, et elle se retourne vers vous, nue, sans aucune pudeur et avec une fierté immense : les seins hauts, le ventre tendu, la peau couleur de braise qui semble éclairer la pièce. Le salon tout entier se teinte de rose ; les bougies montent d’un cran.",
        B("Bien joué. Un coup pour toi. À moi.", "seductive"),
        "Son aura se déploie d’un coup, comme une voile qui prend le vent.",
      ],
      [
        "La robe tombe. Elle se retourne, nue et fière. « Un coup pour toi. À moi. »",
      ],
    ),
    M(
      [
        "Elle vous déshabille à son tour, très vite, et son parfum vous enveloppe si fort que vos genoux faiblissent. Elle vous fait reculer jusqu’au divan, vous y fait tomber.",
        B("Tu vois ? Je n’ai même pas eu besoin de règles.", "smirk"),
      ],
      [
        "Elle vous déshabille à son tour, beaucoup plus vite que vous ne l’avez fait, et son parfum vous enveloppe si fort que vos genoux faiblissent. Elle vous fait reculer jusqu’au divan de velours et vous y fait tomber d’une simple pression du doigt.",
        B("Tu vois ? Je n’ai même pas eu besoin de règles. Il suffit que je souffle.", "smirk"),
        "Elle grimpe sur vous, et votre désir, déjà vif, s’embrase sous son aura comme du papier.",
      ],
      [
        "Elle vous déshabille à son tour, beaucoup plus vite que vous ne l’avez fait, et son parfum vous enveloppe si fort que vos genoux faiblissent. Elle vous fait reculer jusqu’au divan de velours et vous y fait tomber d’une simple pression du doigt.",
        B("Tu vois ? Je n’ai même pas eu besoin de règles. Il suffit que je souffle.", "smirk"),
        X(
          "Elle grimpe sur vous, et votre chaleur, sous son aura, s’éveille si vite que vous en avez le souffle coupé. Sa main glisse entre vos cuisses, vous trouve déjà prête, et elle sourit.",
          "Elle grimpe sur vous, et votre virilité se dresse sous son aura si vite que vous en avez le souffle coupé. Sa main se referme dessus, et elle sourit.",
          "Elle grimpe sur vous, et votre vigueur comme votre chaleur s’éveillent sous son aura si vite que vous en avez le souffle coupé. Ses deux mains vérifient, et elle sourit.",
        ),
      ],
      [
        "Elle vous déshabille beaucoup plus vite et vous fait tomber sur le divan d’une pression du doigt. Son aura fait le reste.",
      ],
    ),
    M(
      [
        "Vous fermez les yeux. Vous respirez lentement, une fois, deux fois, et vous laissez son aura passer à travers vous sans la retenir, comme un vent qu’on ne combat pas.",
        "Quand vous rouvrez les yeux, vous êtes calme. Elle vous regarde, stupéfaite.",
        B("Comment tu as fait ça ?", "thoughtful"),
      ],
      [
        "Vous fermez les yeux. Vous respirez lentement, une fois, deux fois, en cherchant l’endroit précis où son pouvoir appuie. Vous laissez son aura passer à travers vous sans la retenir, comme un vent qu’on ne combat pas.",
        "Votre désir reste là, entier, brûlant, et il vous appartient de nouveau. Quand vous rouvrez les yeux, vous êtes calme, et elle vous regarde, stupéfaite.",
        B("Comment tu as fait ça ?", "thoughtful"),
        P("Tu souffles. Je respire. On peut le faire à deux."),
        B("…C’est la chose la plus insolente qu’on m’ait jamais dite au lit.", "angry"),
      ],
      [
        "Vous fermez les yeux. Vous respirez lentement, une fois, deux fois, en cherchant l’endroit précis où son pouvoir appuie. Vous laissez son aura passer à travers vous sans la retenir, comme un vent qu’on ne combat pas.",
        "Votre désir reste là, entier, brûlant, dressé contre sa main, et il vous appartient de nouveau. Quand vous rouvrez les yeux, vous êtes calme, et elle vous regarde, stupéfaite.",
        B("Comment tu as fait ça ?", "thoughtful"),
        P("Tu souffles. Je respire. On peut le faire à deux."),
        B("…C’est la chose la plus insolente qu’on m’ait jamais dite au lit.", "angry"),
      ],
      [
        "Vous laissez son aura passer à travers vous sans la combattre. Votre désir redevient le vôtre. Elle en reste stupéfaite.",
      ],
    ),
    M(
      [
        "Elle improvise aussitôt. Les bougies s’éteignent ; la pièce se peuple d’illusions, de mains fantômes, de murmures. Vous ne savez plus d’où viennent les caresses.",
        B("Respire, maintenant. Voyons.", "teasing"),
      ],
      [
        "Elle improvise aussitôt, et c’est magnifique. Les bougies s’éteignent d’un coup. La pièce se peuple d’illusions : des reflets d’elle dans tous les coins, des murmures à vos deux oreilles en même temps, des caresses qui semblent venir de trois mains à la fois.",
        B("Respire, maintenant. Voyons ça. Tu sais lequel de mes reflets te touche vraiment ?", "teasing"),
        "Vous ne savez pas. Vous perdez pied, délicieusement, et elle rit dans le noir.",
      ],
      [
        "Elle improvise aussitôt, et c’est magnifique. Les bougies s’éteignent d’un coup. La pièce se peuple d’illusions : des reflets d’elle dans tous les coins, des murmures à vos deux oreilles en même temps, des caresses qui semblent venir de trois mains à la fois.",
        B("Respire, maintenant. Voyons ça. Tu sais lequel de mes reflets te touche vraiment ?", "teasing"),
        X(
          "Une bouche se pose sur votre sein, une autre sur votre ventre, des doigts glissent dans votre chaleur, une langue effleure votre perle de plaisir, et vous ne savez plus lesquels sont réels. Vous perdez pied, délicieusement, et elle rit dans le noir.",
          "Une bouche se pose sur votre gorge, une autre sur votre ventre, une main se referme autour de votre virilité, une langue en effleure le sommet, et vous ne savez plus lesquelles sont réelles. Vous perdez pied, délicieusement, et elle rit dans le noir.",
          "Une bouche se pose sur votre gorge, une main se referme sur votre vigueur, des doigts glissent dans votre chaleur, une langue effleure les deux tour à tour, et vous ne savez plus lesquels sont réels. Vous perdez pied, délicieusement, et elle rit dans le noir.",
        ),
      ],
      [
        "Elle éteint les bougies et peuple la pièce de ses reflets. Vous ne savez plus lequel vous touche vraiment.",
      ],
    ),
    M(
      [
        "Vous cessez de chercher la vraie. Vous tendez la main au hasard vers le reflet qui rit le plus fort : c’est elle. Elle seule rit en vrai.",
        P("Trouvée."),
        B("Comment… ?", "angry"),
        P("Les reflets sourient. Toi, tu ris."),
      ],
      [
        "Vous cessez de chercher la vraie. Vous écoutez. Tous les reflets sourient, tous murmurent, mais un seul rit vraiment, d’un rire bas qui lui échappe chaque fois qu’elle vous voit perdre pied. Vous tendez la main vers ce rire-là.",
        "Votre main se referme sur un poignet bien réel. Toutes les illusions s’éteignent d’un coup.",
        P("Trouvée."),
        B("Comment… ?", "angry"),
        P("Les reflets sourient. Toi, tu ris. Tu ne peux pas t’en empêcher quand tu gagnes."),
        "Elle vous dévisage dans la pénombre, et pour la première fois de la soirée, elle n’a aucune réplique.",
      ],
      [
        "Vous cessez de chercher la vraie. Vous écoutez. Tous les reflets sourient, tous murmurent, mais un seul rit vraiment, d’un rire bas qui lui échappe chaque fois qu’elle vous voit perdre pied. Vous tendez la main vers ce rire-là.",
        "Votre main se referme sur un poignet bien réel. Toutes les illusions s’éteignent d’un coup.",
        P("Trouvée."),
        B("Comment… ?", "angry"),
        P("Les reflets sourient. Toi, tu ris. Tu ne peux pas t’en empêcher quand tu gagnes."),
        "Vous l’attirez sous vous et, sans lui laisser le temps de répondre, descendez entre ses cuisses. Votre bouche trouve sa chaleur, sa perle de plaisir, et vous exploitez sans pitié le petit cri que vous lui arrachez.",
      ],
      [
        "Vous la trouvez parmi ses reflets : les reflets sourient, elle seule rit. Les illusions s’éteignent.",
      ],
    ),
    M(
      [
        "Vous la caressez, et elle perd le contrôle pour de bon. Son plaisir monte vite, trop vite pour elle ; elle s’accroche à vos épaules et bascule en jurant dans une langue que vous ne connaissez pas.",
      ],
      [
        "Vous la caressez, et vous exploitez chaque réaction qu’elle ne parvient pas à cacher : la nuque, le creux de la hanche, ce point au bas du dos qui la fait cambrer. Elle essaie de reprendre la main. Vous revenez à la nuque. Elle oublie.",
        "Son plaisir monte vite, trop vite pour elle ; elle s’accroche à vos épaules et bascule en jurant dans une langue que vous ne connaissez pas, quelque chose de très ancien et de très grossier.",
        B("Un partout. Ne prends pas cet air content de toi.", "angry"),
      ],
      [
        "Votre langue ne quitte pas sa perle de plaisir. Vos doigts glissent en elle, cherchent, trouvent l’endroit qui la fait cambrer, y restent. Elle essaie de reprendre la main, de vous repousser, de vous attirer ailleurs. Vous remontez une seconde embrasser sa nuque, et elle oublie tout.",
        "Son plaisir monte vite, trop vite pour elle. Elle s’accroche à vos épaules, se resserre autour de vos doigts et bascule en jurant dans une langue que vous ne connaissez pas, quelque chose de très ancien et de très grossier.",
        B("Un partout. Ne prends pas cet air content de toi.", "angry"),
      ],
      [
        "Vous exploitez chaque réaction qu’elle ne parvient pas à cacher. Elle bascule en jurant. « Un partout. »",
      ],
    ),
    M(
      [
        "Elle reprend l’ascendant d’un coup de reins et vous renverse sous elle, les yeux brillants.",
        B("Deux à un. Pour moi. Bientôt.", "seductive"),
        "Elle vous mène où elle veut, et vous la laissez faire, parce que c’est un plaisir, maintenant, de la regarder gagner une manche.",
      ],
      [
        "Elle n’a pas fini de reprendre son souffle qu’elle reprend l’ascendant. D’un coup de reins, elle vous renverse sous elle, vous coince les poignets, et ses yeux brillent d’une joie féroce.",
        B("Deux à un. Pour moi. Bientôt. Tu vas voir.", "seductive"),
        "Elle vous mène là où elle veut, avec toute son expertise, toute sa cruauté joyeuse, et vous la laissez faire, parce que c’est un plaisir, maintenant, de la regarder gagner une manche en sachant que vous pourriez gagner la suivante.",
      ],
      [
        "Elle n’a pas fini de reprendre son souffle qu’elle reprend l’ascendant. D’un coup de reins, elle vous renverse sous elle, vous coince les poignets, et ses yeux brillent d’une joie féroce.",
        B("Deux à un. Pour moi. Bientôt. Tu vas voir.", "seductive"),
        X(
          "Elle s’installe sur vous, sa chaleur contre la vôtre, et vous mène avec toute son expertise : un balancement lent, puis brusque, puis lent encore, ses doigts revenant sur votre perle de plaisir exactement quand vous croyiez qu’elle l’avait oubliée.",
          "Elle descend sur vous d’un seul mouvement et vous mène avec toute son expertise : lentement, puis brusquement, puis lentement encore, en se resserrant autour de vous chaque fois que vous croyez deviner le rythme.",
          "Elle descend sur votre vigueur d’un seul mouvement, glisse deux doigts dans votre chaleur, et vous mène avec toute son expertise : lentement, puis brusquement, ses deux rythmes refusant obstinément de se mettre d’accord.",
        ),
        "Vous la laissez faire, parce que c’est un plaisir, maintenant, de la regarder gagner une manche en sachant que vous pourriez gagner la suivante.",
      ],
      [
        "Elle reprend l’ascendant et vous renverse, les yeux brillants. « Deux à un. Bientôt. »",
      ],
    ),
    M(
      [
        "Elle vous amène au bord. Vous l’y amenez avec vous. Vous basculez ensemble, sans savoir qui a gagné, et elle rit, la joue contre la vôtre.",
      ],
      [
        "Elle vous amène au bord. Au dernier moment, vous libérez une main et la posez sur sa nuque, juste posée, sans appuyer. Elle sent la menace et éclate de rire.",
        B("Tu n’oserais pas.", "teasing"),
        P("Égalité ?"),
        B("…Égalité.", "seductive"),
        "Vous basculez ensemble, sans plus savoir qui mène, et le plaisir vous emporte tous les deux en même temps, pour de bon, cette fois.",
      ],
      [
        "Elle vous amène au bord. Au dernier moment, vous libérez une main et la posez sur sa nuque, juste posée, sans appuyer. Elle sent la menace et éclate de rire.",
        B("Tu n’oserais pas.", "teasing"),
        P("Égalité ?"),
        B("…Égalité.", "seductive"),
        X(
          "Vous basculez ensemble, vos deux chaleurs pressées l’une contre l’autre, vos plaisirs se répondant en vagues qui ne savent plus laquelle a commencé.",
          "Vous basculez ensemble ; elle se resserre autour de vous au moment même où vous vous répandez en elle, et vos deux plaisirs se répondent en vagues qui ne savent plus laquelle a commencé.",
          "Vous basculez ensemble ; elle se resserre autour de votre vigueur au moment même où votre chaleur se resserre autour de ses doigts, et vos plaisirs se répondent en vagues qui ne savent plus laquelle a commencé.",
        ),
      ],
      [
        "Vous basculez ensemble, à égalité. Elle accepte le score.",
      ],
    ),
    A(
      "Elle reste sur vous longtemps, le front contre le vôtre, sans parler. Puis elle se met à rire, doucement d’abord, puis sans retenue, un rire qui la secoue tout entière.",
      B("Égalité. J’ai accepté une égalité. Si mon frère apprend ça, il le fera graver sur ma tombe.", "smirk"),
    ),
    DUEL_CLOSING_A,
    DUEL_CLOSING_B,
  ],
};

export const DUEL_TURN_ROUTE: AuthoredRoute = {
  id: "bellirith-duel-turn",
  context: "date-bellirith-final",
  text: "La laisser ouvrir, pour mieux la retourner",
  detail: "Vous connaissez son jeu. Laissez-la mener comme elle aime, et attendez le moment précis où elle croit avoir gagné.",
  visual: { revealChapter: 3, postOrgasmChapter: 11 },
  chapters: [
    A(
      "Vous ne bougez pas. Vous vous asseyez sur le divan de velours, les coudes sur les genoux, et vous la regardez.",
      P("Vas-y. Ouvre la partie."),
      B("Tu me laisses le premier coup ?", "thoughtful"),
      P("Tu le prends toujours. Ce soir, je te le donne. Ça change tout."),
      "Bellirith pèse la phrase comme on soupèse une pièce pour vérifier qu’elle n’est pas fausse.",
      B("Tu viens de dire « maintenant », et maintenant tu me rends la main. Tu prépares quelque chose.", "smirk"),
      P("Évidemment."),
      B("Bien. J’adore qu’on prépare quelque chose contre moi. C’est la seule forme de respect qui me fasse de l’effet.", "seductive"),
    ),
    A(
      "Elle commence comme elle sait commencer. Le piano se met à jouer tout seul, une valse lente. Les bougies baissent. Le parfum monte : miel brûlé, jasmin, cette note sombre que vous savez désormais reconnaître.",
      W(SLEPT, [
        B("Je connais tes faiblesses par cœur, tu sais. Côté gauche. La nuque. Le moment où ta respiration s’arrête. Tu crois vraiment pouvoir préparer quelque chose ?", "teasing"),
      ], [
        B("Tu n’as jamais partagé mon lit. Tu ne connais de moi que des propositions et des sourires. Et tu crois pouvoir me surprendre ?", "teasing"),
      ]),
      P("Je crois que tu vas t’amuser à le vérifier."),
      "Elle s’approche en dansant, sans hâte, et s’arrête entre vos genoux.",
    ),
    M(
      [
        "Elle vous déshabille comme dans les miroirs, la première fois : lentement, en commentant, en vous interdisant de la toucher. Vous obéissez. Elle en a l’air presque déçue.",
        B("Tu es docile, ce soir. Méfie-toi : j’ai horreur des gens dociles.", "cold"),
      ],
      [
        "Elle vous déshabille comme elle sait le faire : lentement, en commentant, en vous interdisant de la toucher. Vous obéissez, parfaitement, sans protester. Vos mains restent posées sur le velours.",
        B("Tu es docile, ce soir. Méfie-toi : j’ai horreur des gens dociles. Ils font l’amour comme on remplit un registre.", "cold"),
        P("Je ne suis pas docile. J’attends."),
        B("Quoi ?", "thoughtful"),
        P("Tu le sauras quand ce sera là."),
      ],
      [
        "Elle vous déshabille comme elle sait le faire : lentement, en commentant, en vous interdisant de la toucher. Vous obéissez, parfaitement, sans protester. Vos mains restent posées sur le velours, même quand ses lèvres descendent le long de votre ventre, même quand elle souffle sur votre peau nue en vous regardant par en dessous.",
        B("Tu es docile, ce soir. Méfie-toi : j’ai horreur des gens dociles. Ils font l’amour comme on remplit un registre.", "cold"),
        P("Je ne suis pas docile. J’attends."),
        B("Quoi ?", "thoughtful"),
        P("Tu le sauras quand ce sera là."),
      ],
      [
        "Elle vous déshabille en vous interdisant de la toucher. Vous obéissez. Vous dites que vous attendez quelque chose.",
      ],
    ),
    M(
      [
        "Elle se déshabille à son tour, en dansant au rythme du piano. C’est un spectacle, un vrai, et elle le sait.",
        B("Tu attends ça ?", "seductive"),
        P("Non. Mais je ne me plains pas."),
      ],
      [
        "Elle se déshabille à son tour, en dansant au rythme du piano. Chaque pièce de soie tombe sur une note précise. C’est un spectacle, un vrai, et elle le sait, et elle vous regarde le regarder.",
        B("Tu attends ça ?", "seductive"),
        P("Non. Mais je ne me plains pas."),
        "Elle rit et vient s’asseoir à califourchon sur vos genoux, nue, chaude, triomphante.",
      ],
      [
        "Elle se déshabille à son tour, en dansant au rythme du piano. Chaque pièce de soie tombe sur une note précise. Quand la dernière glisse, elle tourne sur elle-même, nue, les bras levés, les seins dressés dans la lumière rose, pour que vous n’en perdiez rien.",
        B("Tu attends ça ?", "seductive"),
        P("Non. Mais je ne me plains pas."),
        "Elle rit et vient s’asseoir à califourchon sur vos genoux, nue, chaude, triomphante, sa chaleur posée contre votre ventre.",
      ],
      [
        "Elle se déshabille en dansant et vient s’asseoir sur vos genoux, triomphante.",
      ],
    ),
    M(
      [
        "Elle vous mène jusqu’au bord, avec ses mains, son aura, sa voix. Exactement comme d’habitude. Vous la laissez faire.",
        B("Alors ? Où est ta surprise ?", "teasing"),
      ],
      [
        "Elle vous mène jusqu’au bord avec ses mains, son aura, sa voix, exactement comme elle sait le faire. Elle ralentit au bon moment, accélère au bon moment, et vous la laissez faire sans un mot.",
        B("Alors ? Où est ta surprise ? Je commence à croire que tu bluffais.", "teasing"),
        "Elle s’approche pour vous embrasser, sûre d’elle, et c’est là, exactement là, que vous la voyez : la seconde où elle cesse de regarder votre visage pour fermer les yeux.",
      ],
      [
        X(
          "Elle vous mène jusqu’au bord, ses doigts dans votre chaleur, son pouce sur votre perle de plaisir, son aura gonflant chaque caresse. Elle ralentit au bon moment, accélère au bon moment, et vous la laissez faire sans un mot.",
          "Elle vous mène jusqu’au bord, sa main serrée sur votre virilité, son aura gonflant chaque caresse. Elle ralentit au bon moment, accélère au bon moment, et vous la laissez faire sans un mot.",
          "Elle vous mène jusqu’au bord, une main sur votre vigueur, l’autre dans votre chaleur, son aura gonflant chaque caresse. Elle ralentit au bon moment, accélère au bon moment, et vous la laissez faire sans un mot.",
        ),
        B("Alors ? Où est ta surprise ? Je commence à croire que tu bluffais.", "teasing"),
        "Elle s’approche pour vous embrasser, sûre d’elle, et c’est là, exactement là, que vous la voyez : la seconde où elle cesse de regarder votre visage pour fermer les yeux.",
      ],
      [
        "Elle vous mène au bord, comme d’habitude. Puis, en vous embrassant, elle ferme les yeux. C’est le moment que vous attendiez.",
      ],
    ),
    M(
      [
        "Vous la retournez sur le divan avant qu’elle les rouvre. Quand elle les rouvre, c’est vous qui êtes au-dessus.",
        P("Voilà ma surprise. Tu fermes les yeux quand tu crois avoir gagné."),
        B("…Je ne fais pas ça.", "angry"),
        P("Tu viens de le faire."),
      ],
      [
        "Avant qu’elle les rouvre, vous la prenez par les hanches et la retournez sur le divan. Quand elle les rouvre, c’est vous qui êtes au-dessus, et elle a la bouche ouverte sur une réplique qui ne vient pas.",
        P("Voilà ma surprise. Tu fermes les yeux quand tu crois avoir gagné. Une seconde. Toujours la même."),
        B("…Je ne fais pas ça.", "angry"),
        P("Tu le fais chaque fois. Je t’ai regardée le faire. Tu viens de recommencer."),
        "Elle vous fixe. Puis un sourire lui monte aux lèvres, très lent, presque admiratif.",
        B("Tu m’as observée pendant tout ce temps. Pendant que je t’observais.", "thoughtful"),
      ],
      [
        "Avant qu’elle les rouvre, vous la prenez par les hanches et la retournez sur le divan. Quand elle les rouvre, c’est vous qui êtes au-dessus, entre ses cuisses ouvertes, et elle a la bouche ouverte sur une réplique qui ne vient pas.",
        P("Voilà ma surprise. Tu fermes les yeux quand tu crois avoir gagné. Une seconde. Toujours la même."),
        B("…Je ne fais pas ça.", "angry"),
        P("Tu viens de le faire."),
        "Elle vous fixe. Puis un sourire lui monte aux lèvres, très lent, presque admiratif.",
        B("Tu m’as observée pendant tout ce temps. Pendant que je t’observais.", "thoughtful"),
      ],
      [
        "Vous la retournez avant qu’elle rouvre les yeux. « Tu fermes les yeux quand tu crois avoir gagné. » Elle sourit, presque admirative.",
      ],
    ),
    M(
      [
        "Elle improvise : elle veut faire monter son aura pour vous renverser à nouveau. Vous l’embrassez sur la nuque, et son aura retombe comme un soufflé.",
        B("Ça, c’est de la triche.", "angry"),
      ],
      [
        "Elle improvise. Son aura monte d’un coup, comme une vague qui doit vous renverser, et vous l’accueillez au lieu de la combattre. Vous respirez avec elle. Puis vous posez les lèvres au bas de sa nuque, juste à la naissance des cheveux.",
        "L’aura retombe d’un coup, comme un soufflé qu’on aurait sorti trop tôt du four. Bellirith pousse un cri d’indignation.",
        B("Ça, c’est de la triche. Tu n’as pas le droit de te servir de ça.", "angry"),
        P("Tu m’as appris à me servir de tout."),
      ],
      [
        "Elle improvise. Son aura monte d’un coup, comme une vague qui doit vous renverser, et vous l’accueillez au lieu de la combattre. Vous respirez avec elle. Puis vous posez les lèvres au bas de sa nuque, juste à la naissance des cheveux, pendant que votre main descend sur sa chaleur.",
        "L’aura retombe d’un coup, comme un soufflé qu’on aurait sorti trop tôt du four. Bellirith pousse un cri d’indignation qui se transforme en gémissement quand vos doigts trouvent sa perle de plaisir.",
        B("Ça, c’est de la triche. Tu n’as pas le droit de te servir de ça.", "angry"),
        P("Tu m’as appris à me servir de tout."),
      ],
      [
        "Elle fait monter son aura. Vous l’accueillez, puis embrassez sa nuque. L’aura retombe. Elle crie à la triche.",
      ],
    ),
    M(
      [
        "Vous exploitez l’avantage. Elle se défend, puis cesse de se défendre, puis atteint son plaisir avec un rire étranglé et furieux.",
      ],
      [
        "Vous exploitez l’avantage sans aucune pitié, avec toute la patience qu’elle vous a enseignée. Vous la menez au bord et vous vous arrêtez. Vous recommencez. Vous vous arrêtez encore.",
        B("Je te déteste. Je te déteste tellement.", "angry"),
        P("Demande mieux."),
        "Elle reconnaît ses propres mots. Elle éclate d’un rire étranglé, furieux, et le demande mieux. Vous la laissez basculer, et elle jouit en vous serrant si fort que vous en garderez les marques.",
      ],
      [
        "Vous exploitez l’avantage sans aucune pitié, avec toute la patience qu’elle vous a enseignée. Vos doigts en elle, votre bouche sur sa perle de plaisir, vous la menez au bord et vous vous arrêtez. Vous recommencez. Vous vous arrêtez encore.",
        B("Je te déteste. Je te déteste tellement.", "angry"),
        P("Demande mieux."),
        "Elle reconnaît ses propres mots. Elle éclate d’un rire étranglé, furieux, et le demande mieux. Vous la laissez basculer, et elle jouit contre votre bouche en se resserrant autour de vos doigts, les ongles plantés dans vos épaules si fort que vous en garderez les marques.",
      ],
      [
        "Vous la menez au bord et vous arrêtez. « Demande mieux. » Elle reconnaît ses mots, rit, furieuse, et le demande mieux.",
      ],
    ),
    M(
      [
        "Elle reprend l’ascendant avant même d’avoir fini de trembler. Elle vous renverse, et cette fois c’est vous qui ne contrôlez plus rien.",
        B("À moi. Et je ne fermerai pas les yeux.", "seductive"),
      ],
      [
        "Elle reprend l’ascendant avant même d’avoir fini de trembler. Elle vous renverse sur le tapis, s’installe sur vous, vous tient le menton pour que vous la regardiez.",
        B("À moi. Et je ne fermerai pas les yeux. Plus jamais, avec toi.", "seductive"),
        "Elle tient parole. Elle vous mène les yeux grands ouverts, et c’est infiniment plus troublant.",
      ],
      [
        "Elle reprend l’ascendant avant même d’avoir fini de trembler. Elle vous renverse sur le tapis, s’installe sur vous, vous tient le menton pour que vous la regardiez.",
        B("À moi. Et je ne fermerai pas les yeux. Plus jamais, avec toi.", "seductive"),
        X(
          "Elle presse sa chaleur contre la vôtre et se met à onduler, les yeux grands ouverts, plantés dans les vôtres, ses doigts entre vous pour ne rien laisser au hasard. C’est infiniment plus troublant que tout ce qu’elle a fait jusqu’ici.",
          "Elle vous prend en elle et se met à bouger, les yeux grands ouverts, plantés dans les vôtres. C’est infiniment plus troublant que tout ce qu’elle a fait jusqu’ici.",
          "Elle vous prend en elle, glisse une main jusqu’à votre chaleur, et se met à bouger, les yeux grands ouverts, plantés dans les vôtres. C’est infiniment plus troublant que tout ce qu’elle a fait jusqu’ici.",
        ),
      ],
      [
        "Elle reprend l’ascendant et vous mène les yeux grands ouverts. C’est infiniment plus troublant.",
      ],
    ),
    M(
      [
        "L’équilibre bouge encore, d’elle à vous, de vous à elle, jusqu’à ce que plus personne ne mène. Vous basculez ensemble.",
      ],
      [
        "L’équilibre bouge encore. Vous reprenez une seconde, elle reprend la suivante, vous vous rendez coup pour coup jusqu’à ce que la question de qui mène cesse d’avoir le moindre sens.",
        "Vous basculez ensemble, ses yeux toujours ouverts dans les vôtres, et le piano, quelque part au-dessus de vous, plaque un dernier accord parfaitement juste.",
      ],
      [
        "L’équilibre bouge encore. Vous reprenez une seconde, elle reprend la suivante, vous vous rendez coup pour coup jusqu’à ce que la question de qui mène cesse d’avoir le moindre sens.",
        X(
          "Vous basculez ensemble, vos chaleurs pressées l’une contre l’autre, ses yeux toujours ouverts dans les vôtres.",
          "Vous basculez ensemble ; elle se resserre autour de vous au moment même où vous vous libérez en elle, ses yeux toujours ouverts dans les vôtres.",
          "Vous basculez ensemble, des deux côtés à la fois, elle serrée autour de votre vigueur et ses doigts serrés en vous, ses yeux toujours ouverts dans les vôtres.",
        ),
        "Le piano, quelque part au-dessus de vous, plaque un dernier accord parfaitement juste.",
      ],
      [
        "Vous basculez ensemble. Le piano plaque un accord parfaitement juste.",
      ],
    ),
    DUEL_CLOSING_A,
    DUEL_CLOSING_B,
    A(
      W(RESISTED, [
        B("Toutes ces fois où tu m’as dit non. Je croyais que tu me refusais. Tu m’étudiais. C’est insupportable. C’est merveilleux.", "thoughtful"),
      ], [
        B("Toutes ces fois où tu m’as suivie. Je croyais que tu cédais. Tu m’étudiais. C’est insupportable. C’est merveilleux.", "thoughtful"),
      ]),
      "Elle se laisse retomber contre vous et ferme les yeux, exprès cette fois, en vous regardant les fermer.",
    ),
  ],
};
