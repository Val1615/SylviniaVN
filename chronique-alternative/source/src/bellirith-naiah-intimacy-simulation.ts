import { X, b, p, y, type BNIntimacyScene } from "./bellirith-naiah-intimacy-kit";

/**
 * Q5 · « Même là ? ». Grande scène de la série, vue de l’extérieur.
 *
 * La narration ne dit jamais ce que Naïah ressent ni ce que Bellirith lit :
 * elle décrit ce que le protagoniste voit et entend, et laisse le doute s’installer
 * jusqu’à la chute. Le consentement de Naïah est explicite, prononcé à voix
 * haute avant chaque seuil, et jamais simulé.
 *
 * Exception narrative : Naïah accorde ici à Bellirith, et à elle seule, ce
 * qu’elle ne donne à personne. Bellirith façonne son corps de succube pour
 * l’occasion. Aucune autre scène, aucun autre partenaire n’y a accès.
 */
export const BN_SIMULATION_INTIMACY: BNIntimacyScene = {
  id: "bn-simulation",
  title: "Même là ?",
  detail: "Appartements d’Algratal · chandelles rouges, velours sombre, aucun bâton dans la cire",
  background: "algratal-palace-quarters",
  music: "intimate",
  cg: { reveal: "naiah_bellirith_reveal", climax: "naiah_bellirith_post_orgasm" },
  revealChapter: 2,
  climaxChapter: 10,
  penetrationException: true,
  opening: [
    "Bellirith a poussé un fauteuil au pied du lit, pour vous. Elle n’a rien dit en le faisant. Elle s’est contentée de tapoter le dossier, deux fois, comme on désigne une place au théâtre.",
    "Sur la table de chevet, il y a une bougie neuve. Naïah la regarde, puis regarde Bellirith, et laisse ses mains retomber le long de sa robe.",
    y("Pas de bâtons, ce soir. Il n’y aura rien à compter.", "neutral"),
    b("On verra.", "cold"),
    b("Le mot reste le même. Brume. Pour elle, pour toi, pour moi.", "thoughtful"),
    y("Brume. Et je te répondrai à chaque porte. Demande.", "neutral"),
  ],
  chapters: {
    tendre: [
      [
        "Naïah défait sa robe sans cérémonie. Aucun regard en coin, aucune lenteur calculée. Elle la plie sur le dossier d’une chaise, comme avant un bain.",
        "Vous attendez le petit sourire, la lèvre mordue, la première note de sa partition habituelle. Rien ne vient. Elle reste debout près du lit, simple, et c’est plus troublant que tout ce qu’elle a montré jusqu’ici.",
      ],
      [
        "Bellirith l’embrasse. Doucement, d’abord. Puis plus longuement. Les joues de Naïah prennent une couleur chaude, et son souffle se raccourcit.",
        "Vous attendez le verdict. « Un. » Il ne tombe pas. Bellirith garde les yeux fermés et ne dit rien du tout.",
      ],
      [
        "Bellirith se dévêt à son tour, sans spectacle, et attire Naïah sur le lit. Les chandelles rouges font trembler les draps. Elles s’allongent face à face, si près que leurs fronts se touchent.",
        b("Tu es là ?", "thoughtful"),
        y("Je suis là.", "neutral"),
      ],
      [
        "Les mains de Bellirith parcourent Naïah avec une lenteur nouvelle. Naïah ne se mord pas la lèvre. Elle ne cambre pas les reins au moment attendu. Elle retient son souffle, longtemps, puis le relâche d’un coup, comme quelqu’un qui découvre l’eau froide.",
        "Vous ne lui avez jamais vu ce geste-là. Il ne fait partie d’aucun de ses numéros.",
      ],
      [
        b("Encore ?", "thoughtful"),
        y("Oui.", "neutral"),
        "Bellirith descend contre elle et disparaît dans les draps. Naïah pose une main dans ses cheveux et ne la retire plus. Ses doigts se crispent, se détendent, se crispent encore. Bellirith ne compte toujours pas.",
      ],
      [
        "Sans relever la tête, Bellirith tend un bras vers le fauteuil.",
        b("Viens. J’ai besoin de tes mains.", "seductive"),
        "Vous venez. Vos mains trouvent le dos de la démone, sa nuque, ses hanches, et elle s’appuie contre vous de tout son poids. Naïah attrape votre autre main et entrelace ses doigts aux vôtres. Elle serre fort.",
      ],
      [
        "C’est Naïah qui bouge la première. Elle fait rouler Bellirith sur le dos, s’assied sur elle et la regarde de très haut.",
        y("Maintenant. Celle que je ne donne à personne.", "neutral"),
        b("Naïah. Oui ?", "thoughtful"),
        y("Oui. Je le dis, et je le pense.", "neutral"),
      ],
      [
        "Quelque chose change chez Bellirith. Vous le voyez sans le comprendre : sa peau frémit, sa silhouette se modifie un peu, comme une flamme qui prend une autre forme sans cesser d’être la même flamme.",
        y("Tu peux faire ça ?", "smirk"),
        b("Je peux être ce qu’il faut.", "seductive"),
        "Naïah hausse les sourcils, intéressée, avec la mine de quelqu’un qui prend des notes pour plus tard.",
      ],
      [
        "Bellirith l’attire contre elle, très lentement, et Naïah lui offre ce qu’elle ne donne à personne. Ses yeux s’agrandissent. Sa bouche s’ouvre sur un son que vous ne lui avez jamais entendu. Sa main écrase la vôtre.",
        "Vous retenez votre propre souffle. Vous croyez assister à quelque chose qui n’était jamais arrivé.",
      ],
      [
        "Le rythme monte. Bellirith ne sourit plus. Elle a le visage fermé, concentré, la mâchoire serrée, comme une duelliste qui joue sa dernière botte. Elle vous garde contre elle d’un bras et ne vous lâche plus.",
        "Les chandelles rouges crépitent toutes en même temps, et vous ne savez plus très bien qui les attise.",
      ],
      [
        "Naïah se cambre d’un coup, la tête renversée, et un cri lui échappe, long, brisé. Ses joues sont en feu. Elle tremble de la tête aux pieds. Bellirith la suit dans un souffle rauque, et vous emporte avec elle.",
        "Puis tout retombe. Naïah reste allongée, les yeux mi-clos, rouge jusqu’aux épaules. Vous ne savez pas quoi penser. Vous pensez, très fort, que quelque chose vient d’arriver.",
      ],
      [
        "Bellirith ne bouge pas. Elle reste longtemps penchée au-dessus de Naïah, immobile. Sa silhouette redevient la sienne. Puis elle se redresse d’un bloc.",
        b("Mais tu ne ressens toujours rien !", "angry"),
        b("Tu rayonnes, tu triomphes, tu respires plus fort que moi ! Et le seul feu que je cherchais, toujours éteint !", "angry"),
      ],
      [
        "Naïah éclate de rire. Un rire énorme, incontrôlable, qui la plie en deux sur les draps et lui fait monter les larmes aux yeux.",
        y("Depuis la première bougie ! Et tu as arrêté de compter ! Tu as arrêté de compter !", "laugh"),
        b("Tu m’avais dit que tu ne simulerais pas !", "angry"),
        y("Je sais ! C’était ça, le pari !", "laugh"),
        p("J’y ai cru."),
        y("Tu vois ? Même toi. Je veux un portrait en pied.", "laugh"),
      ],
      [
        "Bellirith s’est drapée dans le drap de soie et boude près de la fenêtre. Naïah la rejoint, enveloppée dans sa cape, encore secouée de rires par vagues.",
        b("Ton rire, lui, je le sens entier. Je le sens depuis les ruines.", "thoughtful"),
        "Naïah cesse de rire, une seconde. Juste une.",
        y("Ne gâche pas ma victoire.", "smirk"),
        "Elle revient s’allonger en travers de vos jambes et s’endort presque aussitôt. Bellirith la regarde dormir avec une expression que vous ne savez pas nommer.",
      ],
    ],
    suggestif: [
      [
        "Naïah défait sa robe sans cérémonie et la plie sur le dossier d’une chaise, comme avant un bain. Aucun regard en coin, aucune lenteur calculée, aucune épaule dévoilée avec art.",
        "Vous attendez le petit sourire, la lèvre mordue, la première note de sa partition habituelle. Rien ne vient. Elle reste debout près du lit en chemise fine, simple, et c’est plus troublant que tout ce qu’elle a montré jusqu’ici.",
      ],
      [
        "Bellirith se lève, la prend par la taille et l’embrasse longuement. Les joues de Naïah prennent une couleur chaude, son souffle se raccourcit, ses doigts se referment sur la soie de la robe de chambre.",
        "Vous attendez le verdict. « Un. » Il ne tombe pas. Bellirith garde les yeux fermés, le front contre celui de Naïah, et ne dit rien du tout.",
      ],
      [
        "La robe de chambre de Bellirith glisse au sol, puis la chemise de Naïah. Elles roulent ensemble sur le lit immense, entre les chandelles rouges, et le velours sombre avale le bruit de leurs corps.",
        b("Tu es là ?", "thoughtful"),
        y("Je suis là.", "neutral"),
      ],
      [
        "Les mains de Bellirith parcourent Naïah avec une lenteur nouvelle, des épaules jusqu’aux hanches, puis plus bas. Naïah ne se mord pas la lèvre. Elle ne se cambre pas au moment attendu. Elle retient son souffle, longtemps, puis le relâche d’un coup, comme quelqu’un qui découvre l’eau froide.",
        "Vous ne lui avez jamais vu ce geste-là. Il ne fait partie d’aucun de ses numéros, et vous en avez vu beaucoup.",
      ],
      [
        b("Encore ?", "thoughtful"),
        y("Oui.", "neutral"),
        "Bellirith descend le long de son ventre et disparaît entre ses cuisses. Naïah pose une main dans ses cheveux et ne la retire plus. Ses doigts se crispent, se détendent, se crispent encore. Ses genoux se resserrent sur les épaules de la démone. Bellirith ne compte toujours pas.",
      ],
      [
        "Sans relever la tête, Bellirith tend un bras vers le fauteuil.",
        b("Viens. J’ai besoin de tes mains.", "seductive"),
        "Vous venez. Vous vous agenouillez derrière elle sur le lit, vos mains trouvent ses reins, ses hanches, et elle recule contre vous sans interrompre ce qu’elle fait. Naïah attrape votre autre main par-dessus le corps de Bellirith et entrelace ses doigts aux vôtres. Elle serre fort.",
      ],
      [
        "C’est Naïah qui bouge la première. Elle fait rouler Bellirith sur le dos, la chevauche et la regarde de très haut, les cheveux défaits sur les épaules.",
        y("Maintenant. Celle que je ne donne à personne.", "neutral"),
        b("Naïah. Oui ?", "thoughtful"),
        y("Oui. Je le dis, et je le pense.", "neutral"),
      ],
      [
        "Quelque chose change chez Bellirith. Vous le voyez sans le comprendre : sa peau frémit sous les mains de Naïah, et son corps se façonne, se prépare, prend une forme qu’il n’avait pas un instant plus tôt, comme une flamme qui change de dessin sans cesser d’être la même flamme.",
        y("Tu peux faire ça ?", "smirk"),
        b("Je peux être ce qu’il faut.", "seductive"),
        "Naïah hausse les sourcils, intéressée, avec la mine de quelqu’un qui prend des notes pour plus tard.",
      ],
      [
        "Naïah descend sur elle, très lentement, et lui offre ce qu’elle ne donne à personne. Ses yeux s’agrandissent. Sa bouche s’ouvre sur un son que vous ne lui avez jamais entendu. Sa main, toujours prise dans la vôtre, vous écrase les doigts.",
        "Vous retenez votre propre souffle. Vous croyez assister à quelque chose qui n’était jamais arrivé à personne dans cette chambre, ni ailleurs.",
      ],
      [
        "Le rythme monte. Bellirith ne sourit plus. Elle a le visage fermé, la mâchoire serrée, comme une duelliste qui joue sa dernière botte, et elle vous garde contre elle d’un bras, votre corps pressé contre le sien, sans vous lâcher.",
        "Les chandelles rouges crépitent toutes en même temps. Naïah ondule au-dessus d’elle, et ses hanches suivent un rythme que vous jureriez venu d’ailleurs que de sa volonté.",
      ],
      [
        "Naïah se cambre d’un coup, la tête renversée, et un cri lui échappe, long, brisé. Ses joues sont en feu. Elle tremble de la tête aux pieds, crispée sur Bellirith. La démone la suit dans un souffle rauque, et vous emporte avec elle, collé·e à son dos.",
        "Puis tout retombe. Naïah s’effondre sur le côté, les yeux mi-clos, rouge jusqu’aux épaules. Vous ne savez pas quoi penser. Vous pensez, très fort, que quelque chose vient d’arriver.",
      ],
      [
        "Bellirith ne bouge pas. Elle reste longtemps à fixer Naïah, immobile, la respiration encore désordonnée. Son corps redevient le sien. Puis elle se redresse d’un bloc, tous ses cheveux dans la figure.",
        b("Mais tu ne ressens toujours rien !", "angry"),
        b("Tu rayonnes, tu triomphes, tu respires plus fort que moi ! Et le seul feu que je cherchais, toujours éteint !", "angry"),
      ],
      [
        "Naïah éclate de rire. Un rire énorme, incontrôlable, qui la plie en deux sur les draps, lui fait battre des pieds et monter les larmes aux yeux.",
        y("Depuis la première bougie ! Et tu as arrêté de compter ! Tu as arrêté de compter !", "laugh"),
        b("Tu m’avais dit que tu ne simulerais pas !", "angry"),
        y("Je sais ! C’était ça, le pari !", "laugh"),
        p("J’y ai cru."),
        y("Tu vois ? Même toi. Je veux un portrait en pied.", "laugh"),
      ],
      [
        "Bellirith s’est drapée dans le drap de soie et boude près de la fenêtre, le dos tourné. Naïah la rejoint, enveloppée dans la cape de la démone, encore secouée de rires par vagues.",
        b("Ton rire, lui, je le sens entier. Je le sens depuis les ruines.", "thoughtful"),
        "Naïah cesse de rire, une seconde. Juste une.",
        y("Ne gâche pas ma victoire.", "smirk"),
        "Elle revient s’allonger en travers de vos jambes et s’endort presque aussitôt, la cape remontée jusqu’au menton. Bellirith la regarde dormir avec une expression que vous ne savez pas nommer.",
      ],
    ],
    explicite: [
      [
        "Naïah défait sa robe sans cérémonie et la plie sur le dossier d’une chaise, comme avant un bain. Aucun regard en coin, aucune lenteur calculée, aucune épaule dévoilée avec art. Puis la chemise, puis le reste, plié de la même manière.",
        "Vous attendez le petit sourire, la lèvre mordue, la première note de sa partition habituelle. Rien ne vient. Elle reste nue près du lit, les bras le long du corps, et c’est plus troublant que tout ce qu’elle a montré jusqu’ici.",
      ],
      [
        "Bellirith se lève, la prend par la taille et l’embrasse à pleine bouche, longuement. Les joues de Naïah prennent une couleur chaude, son souffle se raccourcit, les pointes de ses seins durcissent contre la soie de la robe de chambre.",
        "Vous attendez le verdict. « Un. » Il ne tombe pas. Bellirith garde les yeux fermés, le front contre celui de Naïah, et ne dit rien du tout.",
      ],
      [
        "La robe de chambre de Bellirith glisse au sol. Elles roulent ensemble sur le lit immense, nues entre les chandelles rouges, et le velours sombre avale le bruit de leurs corps. Les jambes s’emmêlent, les seins se pressent, les cheveux noirs et les cheveux pâles se mélangent sur l’oreiller.",
        b("Tu es là ?", "thoughtful"),
        y("Je suis là.", "neutral"),
      ],
      [
        "Les mains de Bellirith parcourent Naïah avec une lenteur nouvelle. Elles prennent ses seins, descendent sur son ventre, s’attardent sur l’intérieur de ses cuisses, puis viennent se poser sur sa chaleur et la caressent à peine, du bout des doigts.",
        "Naïah ne se mord pas la lèvre. Elle ne se cambre pas au moment attendu. Elle retient son souffle, longtemps, puis le relâche d’un coup, comme quelqu’un qui découvre l’eau froide. Vous ne lui avez jamais vu ce geste-là. Il ne fait partie d’aucun de ses numéros, et vous en avez vu beaucoup.",
      ],
      [
        b("Encore ?", "thoughtful"),
        y("Oui.", "neutral"),
        "Bellirith descend le long de son ventre, lui écarte les genoux et pose la bouche sur sa chaleur. Elle y reste longtemps, la langue lente sur la perle de plaisir, puis plus appuyée, puis lente de nouveau.",
        "Naïah pose une main dans ses cheveux et ne la retire plus. Ses doigts se crispent, se détendent, se crispent encore. Ses cuisses se resserrent sur les épaules de la démone et ses talons glissent sur les draps. Bellirith ne compte toujours pas.",
      ],
      [
        "Sans relever la tête, Bellirith tend un bras vers le fauteuil.",
        b("Viens. J’ai besoin de tes mains.", "seductive"),
        X(
          "Vous venez. Vous vous agenouillez derrière elle sur le lit, et elle recule contre vous sans interrompre ce qu’elle fait. Votre main glisse entre ses cuisses et trouve sa chaleur trempée. Vos doigts entrent en elle au rythme de sa langue sur Naïah.",
          "Vous venez. Vous vous agenouillez derrière elle sur le lit, et elle recule contre vous sans interrompre ce qu’elle fait, frottant ses reins contre votre virilité dressée jusqu’à vous guider en elle d’une main tendue en arrière.",
          "Vous venez. Vous vous agenouillez derrière elle sur le lit, et elle recule contre vous sans interrompre ce qu’elle fait, frottant ses reins contre votre vigueur jusqu’à vous guider en elle, votre chaleur pressée contre sa peau.",
        ),
        "Naïah attrape votre main libre par-dessus le corps de Bellirith et entrelace ses doigts aux vôtres. Elle serre fort.",
      ],
      [
        "C’est Naïah qui bouge la première. Elle repousse doucement la tête de Bellirith, la fait rouler sur le dos et la chevauche, les cheveux défaits sur les épaules, ses genoux de part et d’autre des hanches de la démone. Elle la regarde de très haut.",
        y("Maintenant. Celle que je ne donne à personne.", "neutral"),
        b("Naïah. Oui ?", "thoughtful"),
        y("Oui. Je le dis, et je le pense.", "neutral"),
      ],
      [
        "Quelque chose change chez Bellirith. Vous le voyez sans le comprendre. Sa peau frémit, une chaleur sombre remonte le long de son ventre, et son corps de succube se façonne sous les mains de Naïah : une vigueur se dresse là où il n’y avait rien un instant plus tôt, longue et brûlante, faite pour la nuit qu’elle s’est promise.",
        y("Tu peux faire ça ?", "smirk"),
        b("Je peux être ce qu’il faut.", "seductive"),
        "Naïah hausse les sourcils et referme les doigts dessus, curieuse, comme on soupèse un objet rare, avec la mine de quelqu’un qui prend des notes pour plus tard.",
      ],
      [
        "Naïah se soulève, guide la vigueur de Bellirith d’une main et descend sur elle très lentement. Bellirith entre en elle pouce après pouce, sans forcer, les mains posées à plat sur ses hanches, prête à tout arrêter au premier mot.",
        "Le mot ne vient pas. Les yeux de Naïah s’agrandissent. Sa bouche s’ouvre sur un son que vous ne lui avez jamais entendu. Sa main, toujours prise dans la vôtre, vous écrase les doigts.",
        "Vous retenez votre propre souffle. Vous croyez assister à quelque chose qui n’était jamais arrivé à personne dans cette chambre, ni ailleurs.",
      ],
      [
        "Le rythme monte. Naïah ondule au-dessus d’elle, et Bellirith la prend de plus en plus profondément, les hanches soulevées à chaque mouvement. La démone ne sourit plus. Elle a le visage fermé, la mâchoire serrée, comme une duelliste qui joue sa dernière botte.",
        X(
          "Elle vous a gardée contre elle. Sa main libre est entre vos cuisses, ses doigts en vous, et elle vous caresse au même rythme que ses coups de reins, sans vous laisser une seconde de répit.",
          "Elle vous a gardé contre elle. Sa main libre s’est refermée sur votre virilité et vous caresse au même rythme que ses coups de reins, serrée, impitoyable.",
          "Elle vous a gardé·e contre elle. Sa main libre va de votre vigueur à votre chaleur, au même rythme que ses coups de reins, sans vous laisser une seconde de répit.",
        ),
        "Les chandelles rouges crépitent toutes en même temps, et vous ne savez plus très bien qui les attise.",
      ],
      [
        "Naïah se cambre d’un coup, la tête renversée, et un cri lui échappe, long, brisé. Ses joues sont en feu, sa poitrine rougie jusqu’aux épaules. Elle tremble de la tête aux pieds et se serre sur Bellirith en spasmes longs, parfaitement réguliers.",
        X(
          "La démone la suit dans un souffle rauque, se répand en elle, et ses doigts recourbés en vous vous emportent dans la même vague.",
          "La démone la suit dans un souffle rauque, se répand en elle, et sa main serrée sur vous vous emporte dans la même vague.",
          "La démone la suit dans un souffle rauque, se répand en elle, et ses doigts sur votre vigueur et dans votre chaleur vous emportent dans la même vague.",
        ),
        "Puis tout retombe. Naïah s’effondre sur le côté, les yeux mi-clos, rouge jusqu’aux épaules. Vous ne savez pas quoi penser. Vous pensez, très fort, que quelque chose vient d’arriver.",
      ],
      [
        "Bellirith ne bouge pas. Elle reste longtemps à fixer Naïah, immobile, la respiration encore désordonnée. La vigueur qu’elle s’était donnée se dissout, et son corps redevient le sien. Puis elle se redresse d’un bloc, tous ses cheveux dans la figure.",
        b("Mais tu ne ressens toujours rien !", "angry"),
        b("Tu rayonnes, tu triomphes, tu respires plus fort que moi ! Et le seul feu que je cherchais, toujours éteint !", "angry"),
      ],
      [
        "Naïah éclate de rire. Un rire énorme, incontrôlable, qui la plie en deux sur les draps défaits, lui fait battre des pieds et monter les larmes aux yeux. Elle en tousse. Elle en pleure. Elle tend un doigt tremblant vers la bougie neuve, sans une seule marque.",
        y("Depuis la première bougie ! Et tu as arrêté de compter ! Tu as arrêté de compter !", "laugh"),
        b("Tu m’avais dit que tu ne simulerais pas !", "angry"),
        y("Je sais ! C’était ça, le pari !", "laugh"),
        p("J’y ai cru."),
        y("Tu vois ? Même toi. Je veux un portrait en pied.", "laugh"),
      ],
      [
        "Bellirith s’est drapée dans le drap de soie et boude près de la fenêtre, le dos tourné, les épaules raides. Naïah la rejoint, enveloppée dans la cape de la démone, nue dessous, encore secouée de rires par vagues.",
        b("Ton rire, lui, je le sens entier. Je le sens depuis les ruines.", "thoughtful"),
        "Naïah cesse de rire, une seconde. Juste une.",
        y("Ne gâche pas ma victoire.", "smirk"),
        "Elle revient s’allonger en travers de vos jambes et s’endort presque aussitôt, la cape remontée jusqu’au menton. Bellirith la regarde dormir avec une expression que vous ne savez pas nommer.",
      ],
    ],
    ellipse: [
      ["Naïah se déshabille sans le moindre numéro."],
      ["Un baiser. Vous attendez le « Un ». Il ne vient pas."],
      ["Elles roulent sur le lit, entre les chandelles rouges."],
      ["Naïah réagit d’une façon que vous ne lui connaissez pas."],
      ["« Encore ? » « Oui. » Bellirith ne compte toujours pas."],
      ["Bellirith vous appelle. Naïah serre votre main."],
      ["« Celle que je ne donne à personne. » Bellirith demande. Naïah dit oui."],
      ["Bellirith façonne son corps de succube. « Je peux être ce qu’il faut. »"],
      ["Naïah lui offre ce qu’elle ne donne à personne. Vous y croyez."],
      ["Bellirith joue sa dernière botte, la mâchoire serrée."],
      ["Naïah crie et tremble. Bellirith vous emporte avec elle."],
      ["« Mais tu ne ressens toujours rien ! »"],
      ["Naïah éclate de rire. C’était le pari, depuis la première bougie."],
      ["« Ne gâche pas ma victoire. » Naïah s’endort en travers de vos jambes."],
    ],
  },
  explicitMoods: {
    bellirith: ["sultry", "teasing", "inviting", "sultry", "hungry", "inviting", "haughty", "smug", "hungry", "hungry", "sultry", "hungry", "haughty", "sultry"],
    naiah: ["soft", "soft", "inviting", "soft", "soft", "inviting", "stern", "smirk", "soft", "soft", "soft", "soft", "laugh", "teasing"],
  },
};
