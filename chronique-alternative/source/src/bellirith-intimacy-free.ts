import { A, B, M, P, W, X, SLEPT, FAVORITE, RESISTED, TREND_RESISTED, type AuthoredRoute } from "./bellirith-intimacy-kit";

/*
 * Intimités libres intermédiaires (spec §45 B) — « Une heure volée ».
 * Plus familières, nourries par l’historique. Deux routes exclusives :
 * l’une pour qui a déjà partagé son lit, l’autre pour une première fois
 * arrivée hors diversion (souvent après beaucoup de refus).
 */
export const FREE_FAMILIAR_ROUTE: AuthoredRoute = {
  id: "bellirith-free-familiar",
  context: "bellirith-free",
  text: "Ce qu’elle sait déjà",
  detail: "Elle connaît vos faiblesses et compte bien s’en servir. Vous en connaissez peut-être une ou deux des siennes.",
  requiresFlags: [SLEPT],
  visual: { revealChapter: 2, postOrgasmChapter: 10 },
  chapters: [
    A(
      "Elle ne vous fait pas visiter. Elle ne met pas en scène. Elle pousse la porte de sa chambre du bout du pied, jette ses gants sur un fauteuil, ses boucles d’oreilles dans une coupe, et s’étire comme quelqu’un qui rentre enfin chez soi.",
      "C’est peut-être ça, le plus troublant : elle ne vous traite plus comme une conquête à éblouir. Elle vous traite comme quelqu’un qui connaît déjà le chemin.",
      B("Ferme derrière toi. Tu sais où est le verrou. Tu l’as cherché la dernière fois avec une maladresse adorable.", "teasing"),
      W(FAVORITE, [B("Mon favori. Dans ma chambre. Sans qu’aucune mission soit sacrifiée. J’en suis presque déçue.", "smirk")], [B("Ce soir, tu reviens sans prétexte, sans capitaine qui attend ni Impératrice qui relit. C’est presque indécent de simplicité.", "smirk")]),
    ),
    M(
      [
        "Elle vous attire par la ceinture et vous embrasse sans préambule, comme on reprend une conversation là où on l’avait laissée.",
        B("Côté gauche. Toujours côté gauche.", "teasing"),
        "Elle a raison. Votre tête bascule du côté gauche, et elle rit contre votre bouche.",
      ],
      [
        "Elle vous attire par la ceinture et vous embrasse sans préambule, comme on reprend une conversation là où on l’avait laissée. Ses mains vont droit aux endroits qu’elle connaît, sans chercher, sans tester : elle sait.",
        B("Côté gauche. Toujours côté gauche. Tu ne peux pas t’en empêcher, hein ?", "teasing"),
        "Votre tête bascule du côté gauche, et elle rit contre votre bouche. Vos vêtements commencent à tomber, sans cérémonie, au fil des pas qui vous rapprochent du lit.",
      ],
      [
        "Elle vous attire par la ceinture et vous embrasse sans préambule, comme on reprend une conversation là où on l’avait laissée. Ses mains vont droit aux endroits qu’elle connaît, sans chercher, sans tester : la nuque, le creux sous la dernière côte, le bas du dos. Elle sait.",
        B("Côté gauche. Toujours côté gauche. Tu ne peux pas t’en empêcher, hein ?", "teasing"),
        "Votre tête bascule du côté gauche, et elle rit contre votre bouche. Vos vêtements commencent à tomber, sans cérémonie, au fil des pas qui vous rapprochent du lit.",
        X(
          "Elle prend vos seins dans ses paumes au passage, les soupèse comme on retrouve un objet aimé, et pince doucement leurs pointes exactement comme la dernière fois, exactement comme il faut.",
          "Elle glisse une main dans votre pantalon déjà ouvert et vous trouve dur, évidemment. Elle ne commente pas. Elle se contente de serrer une fois, comme on salue une vieille connaissance.",
          "Elle glisse une main dans votre pantalon déjà ouvert, trouve votre vigueur dressée, puis descend plus bas jusqu’à votre chaleur, comme pour vérifier que tout est bien à sa place. Elle ne commente pas. Elle salue les deux d’une pression.",
        ),
      ],
      [
        "Elle vous embrasse comme on reprend une conversation. Côté gauche, toujours. Vos vêtements tombent sur le chemin du lit.",
      ],
    ),
    M(
      [
        "Elle se déshabille sans spectacle, ce qui chez elle est déjà un spectacle. Elle s’allonge en travers du lit et vous attend.",
        B("Viens. Sinon je vais commencer à m’ennuyer.", "seductive"),
      ],
      [
        "Elle se déshabille sans spectacle, ce qui chez elle est déjà un spectacle : la robe dégrafée d’une main pendant qu’elle vous regarde, le reste abandonné par terre comme si ça n’avait aucune importance. Elle s’allonge en travers du lit, appuyée sur un coude.",
        B("Viens. Sinon je vais commencer à m’ennuyer, et tu sais ce que je fais quand je m’ennuie.", "seductive"),
        P("Tu fais des bêtises."),
        B("Je fais des chefs-d’œuvre. Les gens appellent ça des bêtises parce qu’ils sont jaloux.", "smirk"),
      ],
      [
        "Elle se déshabille sans spectacle, ce qui chez elle est déjà un spectacle : la robe dégrafée d’une main pendant qu’elle vous regarde, le reste abandonné par terre comme si ça n’avait aucune importance. Nue, elle s’allonge en travers du lit, appuyée sur un coude, une jambe repliée, offerte et parfaitement maîtresse d’elle-même.",
        B("Viens. Sinon je vais commencer à m’ennuyer, et tu sais ce que je fais quand je m’ennuie.", "seductive"),
        P("Tu fais des bêtises."),
        B("Je fais des chefs-d’œuvre. Les gens appellent ça des bêtises parce qu’ils sont jaloux.", "smirk"),
      ],
      [
        "Elle se déshabille sans spectacle, ce qui chez elle est encore un spectacle, et vous attend sur le lit.",
      ],
    ),
    M(
      [
        "Vous la rejoignez. Elle vous renverse aussitôt sur le dos et s’assied sur vos hanches, les mains sur votre poitrine.",
        B("Je vais te rappeler tout ce que je sais. Dans l’ordre.", "teasing"),
        "Elle commence par la nuque.",
      ],
      [
        "Vous la rejoignez. Elle vous renverse aussitôt sur le dos et s’assied sur vos hanches, les mains à plat sur votre poitrine.",
        B("Je vais te rappeler tout ce que je sais. Dans l’ordre. Et tu vas me dire si j’ai oublié quelque chose.", "teasing"),
        "Elle commence par la nuque, descend, coche chaque endroit d’un baiser, d’un coup de dent, d’une caresse plus appuyée. Elle a raison partout. C’est exaspérant.",
        P("Tu as oublié quelque chose."),
        B("Impossible.", "cold"),
        P("Cherche."),
      ],
      [
        "Vous la rejoignez. Elle vous renverse aussitôt sur le dos et s’assied sur vos hanches, les mains à plat sur votre poitrine.",
        B("Je vais te rappeler tout ce que je sais. Dans l’ordre. Et tu vas me dire si j’ai oublié quelque chose.", "teasing"),
        "Elle commence par la nuque, descend, coche chaque endroit d’un baiser, d’un coup de dent, d’une caresse plus appuyée. Elle a raison partout. C’est exaspérant.",
        X(
          "Quand elle arrive entre vos cuisses, elle souffle sur votre chaleur, puis y pose la langue, à plat, une seule fois, de bas en haut, jusqu’à votre perle de plaisir. Exactement comme la première fois. Votre corps se souvient avant vous.",
          "Quand elle arrive à votre ventre, elle prend votre virilité dans sa main et embrasse le sommet, une seule fois, avec une lenteur affectueuse. Exactement comme la première fois. Votre corps se souvient avant vous.",
          "Quand elle arrive à votre ventre, elle embrasse le sommet de votre vigueur, puis descend jusqu’à votre chaleur et y pose la langue, une seule fois. Exactement comme la première fois. Votre corps se souvient avant vous, des deux côtés.",
        ),
        P("Tu as oublié quelque chose."),
        B("Impossible.", "cold"),
        P("Cherche."),
      ],
      [
        "Elle vous renverse et passe en revue tout ce qu’elle sait de vous. Vous prétendez qu’elle a oublié quelque chose.",
      ],
    ),
    M(
      [
        "Elle cherche. Elle cherche longtemps, avec une application furieuse, et c’est délicieux. Vous ne lui dites rien.",
        B("Tu mens. Tu mens pour que je continue.", "angry"),
        P("Ça marche ?"),
        B("…Oui.", "smirk"),
      ],
      [
        "Elle cherche. Elle cherche longtemps, partout, avec une application furieuse, et c’est absolument délicieux. Elle refait le chemin à l’envers, essaie des endroits improbables, le pli du coude, la cheville, l’arrière de l’oreille.",
        B("Tu mens. Tu mens pour que je continue.", "angry"),
        P("Ça marche ?"),
        B("…Oui. Je te déteste.", "smirk"),
        "Elle ne s’arrête pas pour autant.",
      ],
      [
        "Elle cherche. Elle cherche longtemps, partout, avec une application furieuse, et c’est absolument délicieux. Elle refait le chemin à l’envers, essaie des endroits improbables, le pli du coude, la cheville, l’arrière de l’oreille, et chaque essai est une caresse de plus.",
        B("Tu mens. Tu mens pour que je continue.", "angry"),
        P("Ça marche ?"),
        B("…Oui. Je te déteste.", "smirk"),
        X(
          "Pour se venger, elle revient entre vos cuisses et n’en bouge plus. Sa langue sur votre perle de plaisir, deux doigts recourbés en vous, elle vous fait payer chaque seconde de recherche inutile.",
          "Pour se venger, elle vous prend dans sa bouche et n’en bouge plus. Elle vous fait payer chaque seconde de recherche inutile, profondément, lentement, la main serrée à la base.",
          "Pour se venger, elle prend votre vigueur dans sa bouche et glisse deux doigts dans votre chaleur, et n’en bouge plus. Elle vous fait payer chaque seconde de recherche inutile, des deux côtés à la fois.",
        ),
      ],
      [
        "Elle cherche avec une application furieuse. Elle comprend que vous mentez pour qu’elle continue. Elle continue.",
      ],
    ),
    M(
      [
        "Vous la renversez à votre tour. Elle se laisse faire avec un soupir théâtral.",
        B("Une manche. Une seule.", "teasing"),
        "Vous embrassez l’endroit, juste sous la nuque, que vous aviez trouvé une fois par hasard. Elle se tait d’un coup.",
      ],
      [
        "Profitant d’un instant où elle reprend son souffle, vous la renversez à votre tour. Elle se laisse faire avec un soupir théâtral, les bras en croix.",
        B("Une manche. Une seule. Ensuite, tu me rends le commandement.", "teasing"),
        "Vous ne répondez pas. Vous l’embrassez au bas de la nuque, juste à la naissance des cheveux, cet endroit que vous aviez trouvé une fois par hasard et qu’elle avait aussitôt prétendu ne pas exister.",
        "Elle se tait d’un coup. Tout son corps se tend sous vous, puis se relâche, et elle laisse échapper un son qui n’a absolument rien de composé.",
        B("Ça. Je t’interdis de te souvenir de ça.", "angry"),
      ],
      [
        "Profitant d’un instant où elle reprend son souffle, vous la renversez à votre tour. Elle se laisse faire avec un soupir théâtral, les bras en croix.",
        B("Une manche. Une seule. Ensuite, tu me rends le commandement.", "teasing"),
        "Vous ne répondez pas. Vous l’embrassez au bas de la nuque, juste à la naissance des cheveux, cet endroit que vous aviez trouvé une fois par hasard et qu’elle avait aussitôt prétendu ne pas exister.",
        "Elle se tait d’un coup. Tout son corps se tend sous vous, puis se relâche, et elle laisse échapper un son qui n’a absolument rien de composé. Votre main descend sur son ventre, trouve sa chaleur, brûlante et déjà humide.",
        B("Ça. Je t’interdis de te souvenir de ça.", "angry"),
        P("Trop tard."),
      ],
      [
        "Vous la renversez et embrassez l’endroit, sous la nuque, qu’elle prétend ne pas exister. Elle vous interdit de vous en souvenir.",
      ],
    ),
    M(
      [
        "Vous la caressez en gardant les lèvres sur sa nuque, et elle perd la manche avec un rire furieux et ravi à la fois.",
        B("Je hais ça. Recommence.", "seductive"),
      ],
      [
        "Vous gardez les lèvres sur sa nuque et la caressez sans hâte, comme elle le fait avec vous. Elle essaie de reprendre l’avantage deux fois. Deux fois, vous revenez à la nuque, et deux fois elle oublie ce qu’elle voulait faire.",
        "Elle perd la manche avec un rire furieux et ravi à la fois, le plaisir la traversant si vite qu’elle n’a pas le temps de le mettre en scène.",
        B("Je hais ça. Recommence.", "seductive"),
      ],
      [
        "Vous gardez les lèvres sur sa nuque, et vos doigts glissent dans sa chaleur, l’un puis l’autre, pendant que votre pouce trouve sa perle de plaisir. Elle essaie de reprendre l’avantage deux fois. Deux fois, vous revenez à la nuque, et deux fois elle oublie ce qu’elle voulait faire.",
        "Elle jouit avec un rire furieux et ravi à la fois, se resserrant autour de vos doigts, le plaisir la traversant si vite qu’elle n’a pas le temps de le mettre en scène.",
        B("Je hais ça. Recommence.", "seductive"),
      ],
      [
        "Elle perd la manche avec un rire furieux et ravi. Elle vous ordonne de recommencer.",
      ],
    ),
    M(
      [
        "Mais elle reprend le commandement aussitôt, comme promis, et vous fait payer votre insolence avec une générosité scandaleuse.",
      ],
      [
        "Mais elle a dit une manche, et c’est elle qui compte. D’un coup de reins, elle vous renverse, s’installe sur vous et reprend le commandement avec une générosité scandaleuse, comme pour vous prouver qu’une défaite, chez elle, se rembourse au centuple.",
        B("Tu as gagné une manche. Je gagne la partie. C’est la règle.", "smirk"),
        P("Tu viens de l’inventer."),
        B("Toutes les règles ont été inventées par quelqu’un. Celles-ci, par moi.", "teasing"),
      ],
      [
        "Mais elle a dit une manche, et c’est elle qui compte. D’un coup de reins, elle vous renverse et s’installe sur vous.",
        X(
          "Elle entrelace ses jambes aux vôtres, sa chaleur pressée contre la vôtre, et vous emmène avec elle dans un balancement long et appuyé, ses doigts revenant de temps en temps entre vous pour relancer ce qui risquerait de ralentir.",
          "Elle vous guide en elle et descend jusqu’au bout, d’une seule traite, avec un soupir de satisfaction profonde. Puis elle bouge sur vous comme pour vous prouver qu’une défaite, chez elle, se rembourse au centuple.",
          "Elle vous guide en elle et descend jusqu’au bout, d’une seule traite, pendant que sa main se glisse sous elle, jusqu’à votre chaleur. Puis elle bouge sur vous comme pour vous prouver qu’une défaite, chez elle, se rembourse au centuple, des deux côtés.",
        ),
        B("Tu as gagné une manche. Je gagne la partie. C’est la règle.", "smirk"),
        P("Tu viens de l’inventer."),
        B("Toutes les règles ont été inventées par quelqu’un. Celles-ci, par moi.", "teasing"),
      ],
      [
        "Elle reprend le commandement, comme promis, et invente une règle pour gagner la partie.",
      ],
    ),
    M(
      [
        "Le plaisir vous emporte tous les deux, presque en même temps. Presque : elle fait en sorte d’arriver une seconde après vous, pour pouvoir vous regarder.",
      ],
      [
        "Elle mène jusqu’au bout, et vous vous laissez mener, cette fois, parce que vous savez désormais qu’elle peut perdre et que c’est elle qui choisit de gagner. Le plaisir vous emporte tous les deux, presque en même temps. Presque : elle fait en sorte d’arriver une seconde après vous, pour pouvoir vous regarder.",
        B("Voilà ce que je voulais voir. Toujours le même visage. Je ne m’en lasse pas. C’est très inquiétant.", "thoughtful"),
      ],
      [
        "Elle mène jusqu’au bout, et vous vous laissez mener, cette fois, parce que vous savez désormais qu’elle peut perdre et que c’est elle qui choisit de gagner.",
        X(
          "Vous jouissez contre elle, vos deux chaleurs pressées l’une contre l’autre, et elle vous suit une seconde plus tard ; une seconde exprès, pour pouvoir vous regarder.",
          "Vous jouissez en elle, les mains crispées sur ses hanches, et elle vous suit une seconde plus tard ; une seconde exprès, pour pouvoir vous regarder.",
          "Vous jouissez en elle, votre chaleur pulsant autour de ses doigts au même moment, et elle vous suit une seconde plus tard ; une seconde exprès, pour pouvoir vous regarder.",
        ),
        B("Voilà ce que je voulais voir. Toujours le même visage. Je ne m’en lasse pas. C’est très inquiétant.", "thoughtful"),
      ],
      [
        "Le plaisir vous emporte presque ensemble. Presque : elle arrive une seconde après, exprès, pour vous regarder.",
      ],
    ),
    A(
      "Elle reste couchée sur vous, la joue contre votre épaule, plus longtemps que d’habitude. Elle trace des cercles paresseux sur votre bras.",
      B("Tu sais ce qui m’agace, chez toi ?", "thoughtful"),
      P("Beaucoup de choses, apparemment."),
      B("Tu apprends. Les autres, je les lis une fois et c’est fini. Toi, chaque fois que je reviens, il y a une page de plus. C’est très mal élevé.", "smirk"),
    ),
    A(
      W(RESISTED, [
        B("Et tu continues à me dire non, de temps en temps. Au mauvais moment. Avec cette voix calme.", "thoughtful"),
        B("Je ne t’ai jamais autant désiré·e que ces soirs-là. Ne t’en sers pas. Ou sers-t’en mieux.", "seductive"),
      ], [
        B("Tu dis toujours oui. Je devrais m’ennuyer. Je ne m’ennuie pas. Je ne comprends pas pourquoi.", "thoughtful"),
      ]),
      "Elle se redresse, s’étire, et vous jette votre chemise à la figure.",
    ),
    A(
      B("Rhabille-toi. Je vais avoir envie de recommencer, et tu as sûrement quelque part un monde à sauver.", "teasing"),
      P("Il peut attendre."),
      B("Ne dis pas ça. Je risquerais de te croire, et ce serait la fin de tout ce que j’aime chez toi.", "thoughtful"),
    ),
  ],
};

export const FREE_FIRST_ROUTE: AuthoredRoute = {
  id: "bellirith-free-first",
  context: "bellirith-free",
  text: "Enfin",
  detail: "Elle vous a proposé son lit trop souvent pour faire semblant d’être calme. C’est elle qui mène, et elle a faim ; ça se voit.",
  excludesFlags: [SLEPT],
  visual: { revealChapter: 3, postOrgasmChapter: 10 },
  chapters: [
    A(
      "Elle referme la porte de sa chambre et reste un moment adossée contre le bois, à vous regarder, sans rien dire. D’habitude, elle soigne davantage ses entrées. Elle a l’air de quelqu’un qui vérifie qu’une chose est vraiment arrivée.",
      B("Tu es là.", "thoughtful"),
      P("Tu as l’air surprise."),
      W(TREND_RESISTED, [
        B("Tu m’as dit non plus souvent que n’importe qui depuis un siècle. Avec une politesse parfaite, chaque fois. Alors oui, je suis surprise. Et je déteste être surprise.", "cold"),
      ], [
        B("Je ne suis jamais surprise. Je suis… attentive. Il y a une nuance, et tu vas la payer.", "smirk"),
      ]),
    ),
    A(
      "Elle traverse la pièce. Lentement d’abord, par habitude, puis plus vite, comme si elle avait décidé que la lenteur était un luxe qu’elle ne pouvait plus se permettre.",
      "Elle s’arrête à un souffle de vous, et ne vous touche pas.",
      B("Dis-le. Je veux l’entendre une fois sans que je l’aie provoqué.", "seductive"),
      P("J’ai envie de toi."),
      B("Encore.", "thoughtful"),
      P("J’ai envie de toi, Bellirith. Ce soir, et sans que tu aies soufflé dessus."),
      "Elle ferme les yeux une seconde. Quand elle les rouvre, son parfum a envahi la pièce d’un coup, comme une bouteille qu’on aurait brisée.",
    ),
    M(
      [
        "Elle vous embrasse comme on se jette à l’eau. Il n’y a plus rien de calculé dans ce baiser-là, ou si peu.",
        B("Tu m’as fait attendre.", "angry"),
        P("Tu aimes attendre."),
        B("J’aime faire attendre. Nuance.", "smirk"),
      ],
      [
        "Elle vous embrasse comme on se jette à l’eau. Il n’y a plus rien de calculé dans ce baiser-là, ou si peu : ses mains dans vos cheveux, son corps plaqué contre le vôtre, sa bouche qui prend et ne demande pas.",
        B("Tu m’as fait attendre.", "angry"),
        P("Tu aimes attendre."),
        B("J’aime faire attendre. Nuance. Tu vas comprendre la différence très, très précisément.", "smirk"),
        "Elle défait vos vêtements avec une impatience qu’elle ne prend même pas la peine de cacher, et en arrache un bouton au passage.",
      ],
      [
        "Elle vous embrasse comme on se jette à l’eau. Il n’y a plus rien de calculé dans ce baiser-là, ou si peu : ses mains dans vos cheveux, son corps plaqué contre le vôtre, sa bouche qui prend et ne demande pas.",
        B("Tu m’as fait attendre.", "angry"),
        P("Tu aimes attendre."),
        B("J’aime faire attendre. Nuance. Tu vas comprendre la différence très, très précisément.", "smirk"),
        "Elle défait vos vêtements avec une impatience qu’elle ne prend même pas la peine de cacher, et en arrache un bouton au passage.",
        X(
          "Quand vous êtes nue, elle recule d’un demi-pas pour vous regarder, et son regard s’attarde sur vos seins, votre ventre, vos cuisses, avec une avidité presque douloureuse.",
          "Quand vous êtes nu, elle recule d’un demi-pas pour vous regarder, et son regard descend jusqu’à votre virilité dressée avec une avidité presque douloureuse.",
          "Quand vous êtes nu·e, elle recule d’un demi-pas pour vous regarder, et son regard descend sur votre vigueur dressée, puis sur votre chaleur, avec une avidité presque douloureuse.",
        ),
        B("J’ai imaginé ça. Plusieurs fois. Je m’étais trompée sur deux détails.", "thoughtful"),
      ],
      [
        "Elle vous embrasse comme on se jette à l’eau, et arrache un bouton en vous déshabillant. Elle vous reproche de l’avoir fait attendre.",
      ],
    ),
    M(
      [
        "Sa robe tombe. Elle ne fait pas de théâtre, cette fois ; elle n’a pas la patience.",
        B("Regarde vite. Je n’ai pas l’intention de rester debout.", "seductive"),
      ],
      [
        "Sa robe tombe. Elle ne fait pas de théâtre, cette fois, elle n’a pas la patience. Pourtant, elle reste immobile une seconde, nue devant vous, pour vous laisser regarder.",
        B("Regarde vite. Je n’ai pas l’intention de rester debout.", "seductive"),
        "Elle vous pousse sur le lit et tombe sur vous.",
      ],
      [
        "Sa robe tombe. Elle ne fait pas de théâtre, cette fois, elle n’a pas la patience. Pourtant, elle reste immobile une seconde, nue devant vous, pour vous laisser regarder : la peau couleur de braise, les seins lourds aux pointes déjà dures, les hanches pleines, le désir qui se voit.",
        B("Regarde vite. Je n’ai pas l’intention de rester debout.", "seductive"),
        "Elle vous pousse sur le lit et tombe sur vous.",
      ],
      [
        "Sa robe tombe. Elle vous accorde une seconde pour regarder, puis vous pousse sur le lit.",
      ],
    ),
    M(
      [
        "Elle vous couvre de baisers, partout, sans ordre, comme si elle voulait tout prendre avant que vous changiez d’avis.",
        P("Je ne vais pas changer d’avis."),
        B("Je sais. C’est pour moi que je me dépêche.", "thoughtful"),
      ],
      [
        "Elle vous couvre de baisers, partout, sans ordre ni méthode, comme si elle voulait tout prendre avant que vous changiez d’avis. Puis elle se rattrape, ralentit, et vous la voyez redevenir elle-même : la joueuse, l’experte, celle qui note.",
        P("Je ne vais pas changer d’avis."),
        B("Je sais. C’est pour moi que je me dépêche. Et maintenant, c’est pour moi que je ralentis.", "thoughtful"),
        "Ses mains commencent leur inventaire. Pour la première fois, elle découvre tout, et elle ne fait aucun effort pour cacher le plaisir que lui donne chaque découverte.",
      ],
      [
        "Elle vous couvre de baisers, partout, sans ordre ni méthode, comme si elle voulait tout prendre avant que vous changiez d’avis. Puis elle se rattrape, ralentit, et vous la voyez redevenir elle-même : la joueuse, l’experte, celle qui note.",
        P("Je ne vais pas changer d’avis."),
        B("Je sais. C’est pour moi que je me dépêche. Et maintenant, c’est pour moi que je ralentis.", "thoughtful"),
        X(
          "Ses mains commencent leur inventaire. Elle prend vos seins, les embrasse, mordille leurs pointes jusqu’à vous faire cambrer. Elle descend, découvre votre chaleur du bout des doigts, l’ouvre, explore, trouve votre perle de plaisir et l’observe réagir sous son pouce avec une concentration de joaillière.",
          "Ses mains commencent leur inventaire. Elle parcourt votre torse, mordille vos côtes, descend sur votre ventre, et découvre votre virilité du bout des doigts : la racine, la longueur, le sommet, chaque endroit où une pression vous fait tressaillir. Elle l’observe réagir avec une concentration de joaillière.",
          "Ses mains commencent leur inventaire. Elle parcourt votre torse, descend sur votre ventre, et découvre votre vigueur du bout des doigts, puis votre chaleur juste en dessous. Elle teste les deux, l’une après l’autre, puis ensemble, avec une concentration de joaillière qui vient de recevoir une pierre rare.",
        ),
        "Pour la première fois, elle découvre tout, et elle ne fait aucun effort pour cacher le plaisir que lui donne chaque découverte.",
      ],
      [
        "Elle vous couvre de baisers, puis ralentit et redevient elle-même : la joueuse qui note chaque découverte.",
      ],
    ),
    M(
      [
        "Elle remonte vers votre visage, et vous dit, très bas, tout ce qu’elle a appris en si peu de temps.",
        B("Tu as la même tête que quand tu me dis non. C’est la même. C’est fascinant.", "thoughtful"),
      ],
      [
        "Elle remonte vers votre visage sans retirer ses mains, et vous dit, très bas, tout ce qu’elle a appris en si peu de temps. Chaque phrase est accompagnée d’une démonstration.",
        B("Tu as la même tête que quand tu me dis non. Exactement la même. Ce petit pli au coin de la bouche. C’est fascinant.", "thoughtful"),
        P("Peut-être que je te dis non pour la même raison."),
        "Bellirith s’immobilise. Elle vous regarde comme si vous veniez de retourner une carte qu’elle cherchait depuis des semaines.",
        B("…Tais-toi. Tu vas me faire perdre le fil.", "angry"),
      ],
      [
        "Elle remonte vers votre visage sans retirer ses mains, et vous dit, très bas, tout ce qu’elle a appris en si peu de temps. Chaque phrase est accompagnée d’une démonstration.",
        X(
          "Ses doigts glissent en vous pendant qu’elle parle, son pouce dessine des cercles sur votre perle de plaisir, lents, réguliers, et elle commente chacun de vos soupirs comme une découverte.",
          "Sa main vous parcourt pendant qu’elle parle, lente, serrée, et elle commente chacun de vos soupirs comme une découverte.",
          "Ses deux mains vous parcourent pendant qu’elle parle, l’une sur votre vigueur, l’autre dans votre chaleur, et elle commente chacun de vos soupirs comme une découverte.",
        ),
        B("Tu as la même tête que quand tu me dis non. Exactement la même. Ce petit pli au coin de la bouche. C’est fascinant.", "thoughtful"),
        P("Peut-être que je te dis non pour la même raison."),
        "Bellirith s’immobilise. Elle vous regarde comme si vous veniez de retourner une carte qu’elle cherchait depuis des semaines.",
        B("…Tais-toi. Tu vas me faire perdre le fil.", "angry"),
      ],
      [
        "Elle vous dit tout ce qu’elle a appris. Vous lui répondez une phrase qui la fait taire une seconde.",
      ],
    ),
    M(
      [
        "Elle ne perd pas le fil. Elle le resserre. Le plaisir vous emporte entre ses mains, et elle vous regarde partir avec une expression que vous ne lui connaissiez pas.",
      ],
      [
        "Elle ne perd pas le fil. Elle le resserre. Elle vous mène jusqu’au bord sans les ralentissements cruels des autres fois, car ce soir elle a trop envie de voir, et vous laisse basculer en vous tenant le visage d’une main.",
        "Elle vous regarde partir avec une expression que vous ne lui connaissiez pas, une sorte d’émerveillement agacé.",
        B("Voilà. Voilà ce que tu me refusais.", "thoughtful"),
      ],
      [
        "Elle ne perd pas le fil. Elle le resserre.",
        X(
          "Elle descend entre vos cuisses, remplace son pouce par sa langue sur votre perle de plaisir, et cette fois elle ne vous fait pas attendre. Vous jouissez contre sa bouche en lui tenant les cheveux, et elle vous regarde partir, les yeux levés vers vous.",
          "Elle descend sur vous et vous prend dans sa bouche, profondément, et cette fois elle ne vous fait pas attendre. Vous jouissez en lui tenant les cheveux, et elle vous regarde partir, les yeux levés vers vous.",
          "Elle descend sur vous, prend votre vigueur dans sa bouche, garde ses doigts dans votre chaleur, et cette fois elle ne vous fait pas attendre. Vous jouissez des deux côtés à la fois, et elle vous regarde partir, les yeux levés vers vous.",
        ),
        "Son regard trahit une sorte d’émerveillement agacé.",
        B("Voilà. Voilà ce que tu me refusais.", "thoughtful"),
      ],
      [
        "Elle vous laisse basculer sans vous faire attendre, cette fois, et vous regarde avec un émerveillement agacé.",
      ],
    ),
    M(
      [
        "Vous la tirez contre vous et c’est vous, cette fois, qui la faites attendre. Une caresse, puis rien. Un baiser, puis rien.",
        B("Tu n’oserais pas.", "angry"),
        P("Pas encore."),
        "Elle éclate de rire, furieuse.",
      ],
      [
        "Vous la tirez contre vous, vous la renversez, et c’est vous, cette fois, qui la faites attendre. Une caresse, puis rien. Un baiser au creux du ventre, puis rien. Votre souffle sur l’intérieur de sa cuisse, et vous vous arrêtez.",
        B("Tu n’oserais pas.", "angry"),
        P("Pas encore."),
        "Elle reconnaît la phrase. Elle reconnaît la voix. Elle éclate de rire, furieuse, la tête renversée dans les oreillers.",
        B("Tu me fais mon propre numéro. Dans mon propre lit.", "smirk"),
        P("Tu m’as appris."),
      ],
      [
        "Vous la tirez contre vous, vous la renversez, et c’est vous, cette fois, qui la faites attendre. Une caresse, puis rien. Un baiser au creux du ventre, puis rien. Votre souffle sur sa chaleur, tout près, et vous vous arrêtez.",
        B("Tu n’oserais pas.", "angry"),
        P("Pas encore."),
        "Elle reconnaît la phrase. Elle reconnaît la voix. Elle éclate de rire, furieuse, la tête renversée dans les oreillers, ses hanches se soulevant vers vous malgré elle.",
        B("Tu me fais mon propre numéro. Dans mon propre lit.", "smirk"),
        P("Tu m’as appris."),
        "Alors vous posez enfin la bouche sur sa perle de plaisir, et elle cesse complètement de rire.",
      ],
      [
        "Vous la faites attendre à votre tour. « Pas encore. » Elle reconnaît la phrase et rit, furieuse.",
      ],
    ),
    M(
      [
        "Elle reprend le dessus, comme toujours, et vous attire en elle, contre elle, sans plus de jeu. Elle atteint son plaisir en criant votre nom, et c’est la première fois que vous l’entendez le dire ainsi.",
      ],
      [
        "Elle reprend le dessus, comme toujours, d’un mouvement de hanches qui vous fait rouler sur le dos. Elle s’installe sur vous, et il n’y a plus de jeu, plus de commentaire, plus de manche à compter.",
        "Elle atteint son plaisir en criant votre nom. C’est la première fois que vous l’entendez le dire aussi simplement, sans provocation ni titre. Le vôtre suit, emporté par le sien.",
      ],
      [
        "Elle reprend le dessus, comme toujours, d’un mouvement de hanches qui vous fait rouler sur le dos. Elle s’installe sur vous, et il n’y a plus de jeu, plus de commentaire, plus de manche à compter.",
        X(
          "Elle presse sa chaleur contre la vôtre, entrelace ses jambes aux vôtres, et se balance contre vous de plus en plus fort, vos deux perles de plaisir se cherchant à chaque mouvement.",
          "Elle vous guide en elle et descend d’un seul mouvement, jusqu’au bout, avec un gémissement qu’elle ne retient pas. Puis elle bouge sur vous, de plus en plus fort, ses mains posées sur votre poitrine.",
          "Elle vous guide en elle et descend d’un seul mouvement, jusqu’au bout, sa main glissant sous elle jusqu’à votre chaleur. Puis elle bouge sur vous, de plus en plus fort, ses doigts suivant le même rythme.",
        ),
        "Elle jouit en criant votre nom. C’est la première fois que vous l’entendez le dire aussi simplement, sans provocation ni titre. Le vôtre suit, emporté par le sien.",
      ],
      [
        "Elle reprend le dessus, sans plus de jeu. Elle atteint son plaisir en criant votre nom, juste votre nom.",
      ],
    ),
    A(
      "Après, elle reste allongée sur le dos, un bras sur les yeux. Elle ne dit rien pendant si longtemps que vous finissez par croire qu’elle s’est endormie.",
      B("C’était agaçant.", "cold"),
      P("Agaçant ?"),
      B("Je t’avais imaginé·e. Plusieurs fois, je l’ai dit. Je m’étais trompée sur deux détails. Maintenant, je me suis trompée sur tout le reste aussi. C’est très vexant pour quelqu’un de mon métier.", "thoughtful"),
    ),
    A(
      "Elle roule sur le côté et vous regarde, la tête appuyée sur sa main.",
      B("Ne crois pas que ça change quoi que ce soit. Je vais continuer à te tendre des pièges. À te faire rater des rendez-vous. À te proposer mon lit au pire moment.", "smirk"),
      P("Je vais continuer à dire non, parfois."),
      B("Je l’espère bien. Si tu cesses, je m’ennuierai, et je te l’ai dit : quand je m’ennuie, je fais des chefs-d’œuvre.", "seductive"),
    ),
    A(
      "Elle se lève, ramasse le bouton qu’elle a arraché tout à l’heure, et vous le met dans la paume.",
      B("Garde-le. C’est la seule chose que je t’aie jamais rendue.", "teasing"),
    ),
  ],
};
