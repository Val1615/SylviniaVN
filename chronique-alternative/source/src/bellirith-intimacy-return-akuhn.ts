import { A, B, M, P, W, X, SLEPT, FAVORITE, type AuthoredRoute } from "./bellirith-intimacy-kit";

/*
 * Diversion III — « Les bains au-dessus de la salle de musique »
 * (Akuhn’Nabad, la nuit avant le départ des preuves). Elle peut déjà
 * connaître {player} : l’historique change ce qu’elle sait, pas qui mène.
 */
export const RETURN_AKUHN_ROUTE: AuthoredRoute = {
  id: "bellirith-baths",
  context: "bellirith-diversion-return-akuhn",
  text: "Le bain qui ne refroidit jamais",
  detail: "La vapeur porte son parfum, le piano en dessous joue tout seul. Elle a décidé que vous ne dormiriez pas.",
  visual: { revealChapter: 2, postOrgasmChapter: 11 },
  chapters: [
    A(
      "L’escalier monte en colimaçon au-dessus de la salle de musique. À chaque marche, la chaleur augmente ; à la dernière, l’air est si humide qu’il colle aux cils. La pièce est ronde, carrelée de rose sombre, ouverte sur la ville rouge par trois hautes fenêtres. Au centre, un bassin de cuivre creusé dans le sol fume doucement.",
      "Sous vos pieds, à travers le plancher, le piano de la salle de musique se met à jouer. Personne n’est assis devant.",
      B("Il joue quand j’ai de la visite. Je l’ai dressé. Ça m’a pris quarante ans, il était très têtu.", "smirk"),
      W(SLEPT, [
        B("Ne fais pas semblant de découvrir les lieux. Tu as déjà ce regard de quelqu’un qui sait ce qui l’attend. Tu ne sais rien. Mais j’aime que tu le croies.", "teasing"),
      ], [
        B("Tout le monde regarde d’abord le bassin. Puis les fenêtres. Puis moi. Tu as fait l’inverse. Je note.", "thoughtful"),
      ]),
      B("Ne te déshabille pas. C’est moi qui le fais. Je n’aime pas les cadeaux qu’on ouvre seul.", "seductive"),
    ),
    M(
      [
        "Elle vous retire vos vêtements de voyage pièce par pièce, et chacun lui arrache un petit commentaire : la poussière de la route, la boue d’Akuhn’Nabad sur vos bottes, un fil décousu au col.",
        W(SLEPT, [B("Je connais déjà ce bouton. Il résiste toujours un peu. Comme toi.", "teasing")], [B("Tu portes beaucoup trop de choses pour quelqu’un qui va devoir s’en passer.", "teasing")]),
        "Ses mains sont chaudes, plus chaudes que la vapeur.",
      ],
      [
        "Elle vous retire vos vêtements de voyage pièce par pièce, et chacun lui arrache un petit commentaire : la poussière de la route, la boue d’Akuhn’Nabad sur vos bottes, un fil décousu au col.",
        W(SLEPT, [
          B("Je connais déjà ce bouton. Il résiste toujours un peu. Comme toi, avant de céder d’un coup.", "teasing"),
          "Elle ne cherche pas. Elle sait déjà où poser les doigts pour que vous frissonniez, et elle le fait en vous regardant, pour bien vous montrer qu’elle sait.",
        ], [
          B("Tu portes beaucoup trop de choses pour quelqu’un qui va devoir s’en passer.", "teasing"),
          "Elle cherche, et elle ne s’en cache pas : une paume sur votre côté, un pouce dans le creux de votre hanche, un souffle sur votre épaule. À chaque essai, elle observe votre visage, comme une joueuse qui teste la valeur d’une carte.",
        ]),
        "Ses mains sont chaudes, plus chaudes que la vapeur. Quand la dernière pièce tombe, elle recule d’un pas et vous considère avec une approbation de propriétaire.",
      ],
      [
        "Elle vous retire vos vêtements de voyage pièce par pièce, et chacun lui arrache un petit commentaire : la poussière de la route, la boue d’Akuhn’Nabad sur vos bottes, un fil décousu au col.",
        W(SLEPT, [
          B("Je connais déjà ce bouton. Il résiste toujours un peu. Comme toi, avant de céder d’un coup.", "teasing"),
          "Elle ne cherche pas. Elle sait déjà où poser les doigts pour que vous frissonniez : sous la dernière côte, au creux du genou, au bas du dos. Elle le fait en vous regardant, pour bien vous montrer qu’elle n’a rien oublié.",
        ], [
          B("Tu portes beaucoup trop de choses pour quelqu’un qui va devoir s’en passer.", "teasing"),
          "Elle cherche, et elle ne s’en cache pas : une paume sur votre côté, un pouce dans le creux de votre hanche, un souffle sur votre épaule. À chaque essai, elle observe votre visage, comme une joueuse qui teste la valeur d’une carte.",
        ]),
        X(
          "Quand la dernière pièce tombe, elle recule d’un pas. Son regard descend sur vos seins, que la vapeur fait déjà briller, puis sur votre ventre et sur le triangle sombre entre vos cuisses. Elle hoche la tête, lentement, comme devant un vin qui tient ses promesses.",
          "Quand la dernière pièce tombe, elle recule d’un pas. Son regard descend sur votre torse que la vapeur fait déjà briller, puis sur votre virilité qui se dresse sous ses yeux sans qu’elle ait rien touché. Elle hoche la tête, lentement, comme devant un vin qui tient ses promesses.",
          "Quand la dernière pièce tombe, elle recule d’un pas. Son regard descend sur votre peau que la vapeur fait déjà briller, sur votre vigueur qui se dresse sans qu’elle ait rien touché, sur la chaleur que vous ne pouvez pas cacher en dessous. Elle hoche la tête, lentement, comme devant un vin qui tient deux promesses à la fois.",
        ),
        B("Dans l’eau. Tout de suite. Avant que je change d’avis et que je te prenne sur le carrelage.", "seductive"),
      ],
      [
        "Elle vous déshabille avec une lenteur de propriétaire, en commentant chaque vêtement. Puis elle vous désigne le bassin.",
      ],
    ),
    M(
      [
        "Vous descendez dans l’eau. Elle est exactement à la bonne température, ce qui n’a rien de naturel. Bellirith défait sa robe sur le bord, d’un seul geste, et vous rejoint sans se presser.",
        B("Tu me regardes comme si tu avais le droit. J’adore.", "smirk"),
      ],
      [
        "Vous descendez dans l’eau. Elle est exactement à la bonne température, ce qui n’a rien de naturel. Bellirith défait sa robe sur le bord, d’un seul geste, et vous laisse la regarder tout le temps qu’elle met à descendre les marches du bassin.",
        "La vapeur s’enroule autour d’elle, se teinte de rose à son contact. Elle s’assied face à vous, l’eau à hauteur de poitrine, et vous observe avec la patience d’un chat devant une souris qui croit avoir trouvé une cachette.",
        B("Tu me regardes comme si tu avais le droit. J’adore.", "smirk"),
      ],
      [
        "Vous descendez dans l’eau. Elle est exactement à la bonne température, ce qui n’a rien de naturel. Bellirith défait sa robe sur le bord, d’un seul geste, et vous laisse la regarder tout le temps qu’elle met à descendre les marches du bassin.",
        "Nue, elle a la peau couleur de braise sous la lampe, des seins pleins aux pointes sombres, des hanches larges et une démarche qui fait de chaque marche une phrase. La vapeur s’enroule autour d’elle et se teinte de rose à son contact.",
        "Elle s’assied face à vous, l’eau à hauteur de poitrine, puis glisse jusqu’à ce que ses genoux encadrent les vôtres. Elle ne vous touche pas encore. Elle vous laisse sentir la chaleur de son corps à travers l’eau, ce qui est presque pire.",
        B("Tu me regardes comme si tu avais le droit. J’adore.", "smirk"),
      ],
      [
        "Elle laisse tomber sa robe et vous rejoint dans l’eau. La vapeur fait le reste du travail de pudeur.",
      ],
    ),
    M(
      [
        "Elle prend une éponge, un flacon d’huile parfumée, et entreprend de vous laver comme si c’était une cérémonie. Chaque geste est lent, appliqué, et l’éponge s’attarde toujours un peu là où vous ne l’attendiez pas.",
        B("Ton capitaine dort sur sa sacoche, à l’heure qu’il est. Moi, je te lave les épaules. Qui a la meilleure nuit, à ton avis ?", "teasing"),
        P("Pas Draven."),
        B("Pas Draven.", "smirk"),
      ],
      [
        "Elle prend une éponge, un flacon d’huile parfumée, et entreprend de vous laver comme si c’était une cérémonie. Chaque geste est lent, appliqué ; la poussière du voyage s’en va, et quelque chose d’autre prend sa place, une sensibilité nouvelle de la peau.",
        "L’éponge descend le long de votre dos, contourne votre hanche, remonte sur votre ventre. Elle s’attarde toujours un peu là où vous ne l’attendiez pas, et jamais là où vous l’espériez.",
        B("Ton capitaine dort sur sa sacoche, à l’heure qu’il est. Moi, je te lave les épaules. Qui a la meilleure nuit, à ton avis ?", "teasing"),
        P("Pas Draven."),
        B("Pas Draven. Mais il se réveillera reposé, lui. Toi, je ne te le promets pas.", "smirk"),
      ],
      [
        "Elle prend une éponge, un flacon d’huile parfumée, et entreprend de vous laver comme si c’était une cérémonie. La poussière du voyage s’en va ; quelque chose d’autre prend sa place, une sensibilité nouvelle de la peau, comme si l’huile la rendait plus mince.",
        "L’éponge descend le long de votre dos, contourne votre hanche, remonte sur votre ventre, puis l’éponge disparaît et il ne reste que sa main huilée.",
        X(
          "Sa paume glisse sur vos seins, les soulève, les relâche, s’attarde sur leurs pointes jusqu’à ce qu’elles durcissent sous ses doigts. Puis elle descend sous l’eau, effleure l’intérieur de vos cuisses, frôle votre chaleur une seule fois et repart vers votre genou, comme par distraction.",
          "Sa paume glisse sur votre torse, votre ventre, et descend sous l’eau. Elle effleure votre virilité dressée d’un seul passage de la racine au sommet, presque par distraction, et repart vers votre genou comme si de rien n’était.",
          "Sa paume glisse sur votre torse, votre ventre, et descend sous l’eau. Elle effleure votre vigueur dressée d’un seul passage, frôle la chaleur juste en dessous, et repart vers votre genou, comme par distraction, mais avec un sourire qui n’a rien de distrait.",
        ),
        B("Ton capitaine dort sur sa sacoche, à l’heure qu’il est. Moi, je te lave. Qui a la meilleure nuit, à ton avis ?", "teasing"),
        P("Pas Draven."),
        B("Pas Draven. Mais il se réveillera reposé, lui. Toi, je ne te le promets pas.", "smirk"),
      ],
      [
        "Elle vous lave avec une éponge et une lenteur cérémonieuse, en vous demandant qui, de vous ou de Draven, passe la meilleure nuit.",
      ],
    ),
    M(
      [
        "La vapeur change de couleur. Elle rosit, épaissit, et porte maintenant son parfum : miel brûlé, jasmin, et quelque chose de plus sombre que vous ne savez pas nommer.",
        B("Je ne fabrique rien, tu sais. Je souffle. Ce qui brûle était déjà là.", "thoughtful"),
        "Chaque respiration vous la rend plus proche.",
      ],
      [
        "La vapeur change de couleur. Elle rosit, épaissit, et porte maintenant son parfum : miel brûlé, jasmin, et quelque chose de plus sombre que vous ne savez pas nommer.",
        B("Je ne fabrique rien, tu sais. Je souffle. Ce qui brûle était déjà là.", "thoughtful"),
        "Chaque inspiration vous emplit d’elle. Votre peau s’éveille par vagues, comme si l’eau elle-même se mettait à vous caresser. Vous n’avez pas bougé, et pourtant vous avez l’impression d’avoir déjà fait la moitié du chemin vers elle.",
        P("C’est déloyal."),
        B("C’est chez moi. Chez moi, la loyauté est un dessert qu’on sert aux invités qui ont été sages.", "smirk"),
      ],
      [
        "La vapeur change de couleur. Elle rosit, épaissit, et porte maintenant son parfum : miel brûlé, jasmin, et quelque chose de plus sombre que vous ne savez pas nommer.",
        B("Je ne fabrique rien, tu sais. Je souffle. Ce qui brûle était déjà là.", "thoughtful"),
        "Chaque inspiration vous emplit d’elle. Votre peau s’éveille par vagues, comme si l’eau elle-même se mettait à vous caresser. Votre désir, déjà vif, se met à battre au rythme de la vapeur qui monte et redescend ; elle l’a accordé à sa respiration, et elle respire lentement, exprès.",
        P("C’est déloyal."),
        B("C’est chez moi. Chez moi, la loyauté est un dessert qu’on sert aux invités qui ont été sages.", "smirk"),
      ],
      [
        "La vapeur se teinte de rose et porte son parfum. Elle souffle sur une braise qui était déjà là.",
      ],
    ),
    M(
      [
        "Elle vous fait asseoir sur le rebord du bassin. Sous le plancher, le piano accélère quand votre souffle accélère, ralentit quand vous essayez de vous calmer.",
        B("Écoute. C’est toi qui joues.", "teasing"),
        "Elle s’agenouille dans l’eau entre vos jambes, et ses baisers remontent lentement depuis vos genoux.",
      ],
      [
        "Elle vous fait asseoir sur le rebord du bassin, l’eau jusqu’aux mollets. Sous le plancher, le piano accélère quand votre souffle accélère, ralentit quand vous essayez de vous calmer, trébuche quand vous retenez votre respiration.",
        B("Écoute. C’est toi qui joues. Je l’ai accordé sur ton pouls en montant l’escalier.", "teasing"),
        "Elle s’agenouille dans l’eau entre vos jambes, et ses baisers remontent lentement depuis vos genoux. À chaque baiser, une note. Vous vous entendez devenir une mélodie de plus en plus pressée, et elle rit contre votre cuisse.",
      ],
      [
        "Elle vous fait asseoir sur le rebord du bassin, l’eau jusqu’aux mollets. Sous le plancher, le piano accélère quand votre souffle accélère, ralentit quand vous essayez de vous calmer, trébuche quand vous retenez votre respiration.",
        B("Écoute. C’est toi qui joues. Je l’ai accordé sur ton pouls en montant l’escalier.", "teasing"),
        "Elle s’agenouille dans l’eau entre vos jambes, et ses baisers remontent lentement depuis vos genoux. À chaque baiser, une note.",
        X(
          "Quand sa bouche arrive enfin sur votre chaleur, le piano plaque un accord entier. Sa langue vous ouvre, trouve votre perle de plaisir et s’y installe avec une patience terrible, tandis que deux de ses doigts glissent en vous et se recourbent juste assez pour que la mélodie, en dessous, perde complètement le fil.",
          "Quand sa bouche se referme enfin sur votre virilité, le piano plaque un accord entier. Elle vous prend lentement, profondément, sa main serrée à la base, et règle le mouvement de sa tête sur la mélodie en dessous, ou la mélodie sur elle, vous ne savez plus.",
          "Quand sa bouche se referme enfin sur votre vigueur, le piano plaque un accord entier. Deux de ses doigts trouvent votre chaleur au même moment et s’y glissent, et elle fait travailler sa bouche et sa main sur deux mesures différentes, si bien que la mélodie, en dessous, se met à jouer deux airs à la fois.",
        ),
        "Vous vous entendez devenir une musique de plus en plus pressée. Elle rit, la bouche pleine de vous, et le rire vibre jusque dans vos reins.",
      ],
      [
        "Elle vous assied au bord du bassin. Le piano, en dessous, joue au rythme de votre souffle. La chronique vous laisse l’écouter seul·e.",
      ],
    ),
    M(
      [
        "Le plaisir vous prend au moment où le piano plaque une fausse note, magnifique et retentissante. Bellirith éclate de rire.",
        B("Quarante ans de dressage, et tu le fais rater en une soirée.", "smirk"),
      ],
      [
        "Le plaisir vous prend d’un seul coup, et en dessous le piano plaque une fausse note, magnifique, retentissante, qui résonne dans toute l’aile du palais. Bellirith éclate de rire, le front contre votre genou.",
        B("Quarante ans de dressage, et tu le fais rater en une soirée. Je devrais te faire payer l’accordeur.", "smirk"),
      ],
      [
        X(
          "Le plaisir vous prend d’un seul coup, vos cuisses se refermant autour de sa tête, votre chaleur se contractant autour de ses doigts en longues vagues. En dessous, le piano plaque une fausse note magnifique, retentissante, qui résonne dans toute l’aile du palais.",
          "Le plaisir vous prend d’un seul coup ; vous vous répandez dans sa bouche en vous agrippant au rebord de cuivre, et elle vous garde jusqu’au bout. En dessous, le piano plaque une fausse note magnifique, retentissante, qui résonne dans toute l’aile du palais.",
          "Le plaisir vous prend d’un seul coup, des deux côtés à la fois : votre vigueur se libère dans sa bouche tandis que votre chaleur se resserre autour de ses doigts. En dessous, le piano plaque deux fausses notes en même temps, retentissantes, qui résonnent dans toute l’aile du palais.",
        ),
        "Bellirith éclate de rire, le front contre votre genou, encore essoufflée de vous.",
        B("Quarante ans de dressage, et tu le fais rater en une soirée. Je devrais te faire payer l’accordeur.", "smirk"),
      ],
      [
        "Le piano plaque une fausse note. Bellirith rit. Quarante ans de dressage, ruinés en une soirée.",
      ],
    ),
    M(
      [
        "Vous l’attirez dans l’eau avec vous. Elle se laisse faire avec une exclamation indignée qui ne trompe personne, et vient s’asseoir sur vos genoux, les bras autour de votre cou.",
        B("Tu crois que c’est toi qui m’as attirée. C’est mignon.", "teasing"),
      ],
      [
        "Vous glissez de nouveau dans l’eau et l’attirez à vous. Elle pousse une exclamation indignée qui ne trompe personne et vient s’asseoir sur vos genoux, les bras autour de votre cou, ses seins contre votre poitrine.",
        B("Tu crois que c’est toi qui m’as attirée. C’est mignon. Je te laisse le croire encore une minute.", "teasing"),
        "Vous l’embrassez. Elle vous rend le baiser en le prenant aussitôt en main, la langue joueuse, les ongles dans votre nuque.",
      ],
      [
        "Vous glissez de nouveau dans l’eau et l’attirez à vous. Elle pousse une exclamation indignée qui ne trompe personne et vient s’asseoir à califourchon sur vos cuisses, les bras autour de votre cou, ses seins écrasés contre votre poitrine.",
        B("Tu crois que c’est toi qui m’as attirée. C’est mignon. Je te laisse le croire encore une minute.", "teasing"),
        "Vous l’embrassez. Elle vous rend le baiser en le prenant aussitôt en main, la langue joueuse, les ongles dans votre nuque. Vos mains descendent le long de son dos, sur ses hanches, empoignent ses fesses sous l’eau. Elle ondule contre vous, et vous sentez sa chaleur glisser contre votre ventre, plus brûlante que le bain.",
        W(FAVORITE, [B("Mon favori a pris de l’assurance. Ne t’habitue pas.", "smirk")], [B("Tu as des mains audacieuses pour quelqu’un qui tremblait sur le rebord il y a une minute.", "smirk")]),
      ],
      [
        "Vous l’attirez dans l’eau. Elle proteste pour la forme et s’installe sur vos genoux. La minute qu’elle vous accorde est très courte.",
      ],
    ),
    M(
      [
        "Elle reprend aussitôt la mesure. Elle bouge contre vous, lentement, très lentement, et chaque fois que vous voulez accélérer, elle pose un doigt sur vos lèvres.",
        B("Non. Lentement. Je veux que tu t’en souviennes dans la forêt.", "seductive"),
      ],
      [
        "La minute passe. Elle reprend aussitôt la mesure, et c’est une mesure très lente. Elle bouge contre vous dans l’eau chaude, ses hanches dessinant de grands cercles paresseux, et chaque fois que vous essayez d’accélérer, elle pose un doigt sur vos lèvres.",
        B("Non. Lentement. Je veux que tu t’en souviennes dans la forêt, au milieu des ronces, quand Naïah te fera tourner en rond.", "seductive"),
        "L’eau clapote contre le cuivre. Le piano, en dessous, s’est mis à jouer une valse, beaucoup trop lente pour être dansée.",
      ],
      [
        "La minute passe. Elle reprend aussitôt la mesure, et c’est une mesure très lente.",
        X(
          "Elle s’ajuste sur votre cuisse, sa chaleur contre la vôtre, et glisse une main entre vous pour trouver votre perle de plaisir. Elle se frotte contre vous en grands cercles paresseux que l’eau rend soyeux, et ses doigts suivent le même dessin, exactement, sans jamais se presser.",
          "Elle se soulève, prend votre virilité dans sa main sous l’eau et descend sur vous avec une lenteur calculée, jusqu’à vous avoir entièrement en elle. Puis elle reste immobile, serrée autour de vous, et vous regarde perdre patience.",
          "Elle se soulève, prend votre vigueur dans sa main sous l’eau et descend sur vous avec une lenteur calculée, jusqu’à vous avoir entièrement en elle. Puis elle glisse deux doigts sous elle, jusqu’à votre chaleur, pour que vous ne puissiez rien oublier de vous-même pendant qu’elle reste immobile.",
        ),
        "Chaque fois que vous essayez d’accélérer, elle pose un doigt sur vos lèvres.",
        B("Non. Lentement. Je veux que tu t’en souviennes dans la forêt, au milieu des ronces, quand Naïah te fera tourner en rond.", "seductive"),
        "L’eau clapote contre le cuivre. Le piano, en dessous, s’est mis à jouer une valse beaucoup trop lente pour être dansée.",
      ],
      [
        "Elle reprend la mesure : une valse très lente. Vous n’avez pas le droit d’accélérer.",
      ],
    ),
    M(
      [
        "Elle atteint son plaisir quand elle le décide, et pas une seconde avant. Elle vous regarde en face tout du long, comme pour s’assurer que vous voyez bien qui a gagné.",
        "La vapeur, autour de vous, devient entièrement rose.",
      ],
      [
        "Elle accélère enfin, au moment qu’elle a choisi. Elle vous tient par la nuque pour que vous la regardiez, et vous la regardez : les lèvres entrouvertes, les yeux mi-clos, l’expression concentrée de quelqu’un qui mène une manœuvre délicate jusqu’à son terme.",
        "Elle atteint son plaisir sans quitter votre regard, et la vapeur, autour de vous, devient entièrement rose. Le vôtre suit, rappelé par le sien.",
        B("Voilà. Maintenant, tu peux.", "seductive"),
      ],
      [
        "Elle accélère enfin, au moment qu’elle a choisi. Elle vous tient par la nuque pour que vous la regardiez, et vous la regardez : les lèvres entrouvertes, les yeux mi-clos, l’expression concentrée de quelqu’un qui mène une manœuvre délicate jusqu’à son terme.",
        X(
          "Ses doigts ne quittent pas votre perle de plaisir, ses hanches ne quittent pas les vôtres. Elle jouit la première, longuement, en se resserrant contre votre cuisse, et le plaisir vous reprend dans la foulée, appelé par le sien.",
          "Elle se soulève et retombe sur vous, de plus en plus fort, l’eau débordant du bassin à chaque mouvement. Elle jouit la première, longuement, en se resserrant autour de votre virilité, et vous la suivez aussitôt, emporté au fond d’elle.",
          "Elle se soulève et retombe sur votre vigueur, de plus en plus fort, ses doigts toujours dans votre chaleur. Elle jouit la première, longuement, en se resserrant autour de vous, et vous la suivez des deux côtés à la fois, avec un cri qu’elle étouffe d’un baiser.",
        ),
        "La vapeur, autour de vous, devient entièrement rose.",
        B("Voilà. Tu peux respirer, maintenant. Je t’y autorise.", "seductive"),
      ],
      [
        "Elle atteint son plaisir quand elle l’a décidé, en vous regardant. La vapeur devient entièrement rose.",
      ],
    ),
    A(
      "Le piano s’est tu. L’eau refroidit enfin, pour la première fois peut-être depuis des années, comme si elle aussi reprenait son souffle.",
      "Bellirith sort du bassin la première, s’enveloppe dans une serviette brodée, et vous en tend une autre. Puis, au lieu de vous laisser faire, elle vous sèche les cheveux elle-même, debout derrière vous, avec des gestes étonnamment doux.",
      "Vous la regardez dans le reflet d’une fenêtre. Elle s’en aperçoit et ses mains redeviennent aussitôt brusques.",
      B("Ne te fais pas d’idées. Je ne veux pas que tu attrapes froid. Un malade, ça ne sert à rien.", "cold"),
    ),
    A(
      "Par les hautes fenêtres, le ciel d’Akuhn’Nabad pâlit à peine. Quelque part dans la cour basse, un cheval s’ébroue.",
      B("La relève. Ton capitaine va bientôt compter ses chevaux. Tu ne dormiras pas, je t’avais prévenu·e.", "teasing"),
      W(SLEPT, [
        B("Tu sais ce qui me plaît, avec toi ? Tu reviens toujours un peu différent·e. Je dois réapprendre un détail chaque fois. C’est épuisant. Continue.", "thoughtful"),
      ], [
        B("Maintenant, je sais où tu frissonnes. Je ne le dirai à personne. Je m’en servirai seulement.", "smirk"),
      ]),
      "Elle ouvre la porte de l’escalier et vous tend vos bottes, encore pleines de la boue d’hier.",
    ),
  ],
};
