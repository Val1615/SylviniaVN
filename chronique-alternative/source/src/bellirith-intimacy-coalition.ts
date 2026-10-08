import { A, B, M, P, W, X, SLEPT, FAVORITE, RESISTED, type AuthoredRoute } from "./bellirith-intimacy-kit";

/*
 * Diversion du chapitre IX — « La veille de bataille » (salle de bal vide
 * d’Al’Gratal, pendant que le protocole s’écrit sans {player}). La plus
 * nourrie par l’historique : c’est la dernière diversion de l’Acte I.
 */
export const COALITION_ROUTE: AuthoredRoute = {
  id: "bellirith-eve",
  context: "bellirith-diversion-coalition",
  text: "Une heure, à sa mesure",
  detail: "Vous avez dit « une heure ». Elle va vous montrer combien de temps dure une heure quand c’est elle qui la tient.",
  visual: { revealChapter: 3, postOrgasmChapter: 10 },
  chapters: [
    A(
      "La grande salle de bal d’Al’Gratal dort sous des housses blanches. Les lustres sont emmaillotés comme des oiseaux en cage, les fauteuils alignés contre les murs ressemblent à une assemblée de fantômes. Deux étages plus haut, Iriana, Tia et Valurn écrivent un protocole sans vous.",
      "Bellirith traverse le parquet en faisant claquer ses talons exprès, pour que l’écho porte. Au passage, elle effleure un lustre du bout des doigts, et toutes ses bougies s’allument d’un coup, une couronne de flammes roses au-dessus de vous.",
      B("Une heure. C’est toi qui l’as dit. Je vais te montrer combien de temps dure une heure quand c’est moi qui la tiens.", "seductive"),
      W(FAVORITE, [
        B("Mon favori a abandonné la carte, la coalition et une Impératrice pour moi. Encore. Tu sais que ça devient une habitude ?", "smirk"),
      ], [W(RESISTED, [
        B("Toi. Tu as passé l’Acte entier à me dire non avec une élégance insupportable, et c’est ce soir que tu dis oui. La veille d’une bataille. Tu as le sens du théâtre.", "thoughtful"),
      ], [
        B("Ne fais pas cette tête. Le protocole survivra sans ton regard. Il sera seulement un peu plus bête.", "teasing"),
      ])]),
    ),
    A(
      "Elle vous prend la main et vous entraîne au centre de la salle. Il n’y a pas de musique. Elle danse quand même, et vous force à danser avec elle, en comptant les temps à voix basse.",
      "Au troisième tour, la musique arrive, d’on ne sait où : un orchestre invisible, des violons un peu faux, exactement le genre de valse qu’on joue à la fin d’un bal quand il ne reste plus que les gens qui ne veulent pas rentrer.",
      B("Mon frère va bouder jusqu’au portail. Il va être odieux avec tout le monde, et tout le monde va croire que c’est l’angoisse de la bataille.", "smirk"),
      P("Ce n’est pas l’angoisse de la bataille ?"),
      B("C’est moi. C’est toujours moi. Il a eu des siècles pour s’habituer, il refuse obstinément.", "teasing"),
      "Elle tourne sous votre bras, revient contre vous, et la valse ralentit pour vous laisser le temps de sentir tout son corps contre le vôtre.",
    ),
    M(
      [
        "Elle arrête la danse au pied d’une colonne et vous y adosse. Elle vous embrasse, puis défait votre col.",
        B("Les veilles de bataille sont les seules nuits honnêtes. Personne ne fait semblant d’avoir le temps.", "thoughtful"),
      ],
      [
        "Elle arrête la danse au pied d’une colonne de marbre et vous y adosse sans douceur. Elle vous embrasse, une main à plat sur votre poitrine pour vous maintenir contre la pierre froide, l’autre déjà occupée à défaire votre col.",
        B("Les veilles de bataille sont les seules nuits honnêtes. Personne ne fait semblant d’avoir le temps. Personne ne fait semblant de ne pas avoir envie.", "thoughtful"),
        "Vos vêtements tombent un à un sur le parquet ciré. Elle prend son temps quand même. C’est sa façon de mépriser la bataille.",
      ],
      [
        "Elle arrête la danse au pied d’une colonne de marbre et vous y adosse sans douceur. Elle vous embrasse, une main à plat sur votre poitrine pour vous maintenir contre la pierre froide, l’autre déjà occupée à défaire votre col.",
        B("Les veilles de bataille sont les seules nuits honnêtes. Personne ne fait semblant d’avoir le temps. Personne ne fait semblant de ne pas avoir envie.", "thoughtful"),
        "Vos vêtements tombent un à un sur le parquet ciré. Elle prend son temps quand même, et chaque morceau de peau qu’elle découvre, elle le marque d’un baiser ou d’une morsure légère, comme on paraphe un document page par page.",
        X(
          "Quand vous êtes nue contre la colonne, le marbre froid dans le dos et sa bouche chaude sur votre sein, elle glisse un genou entre vos cuisses et appuie, juste assez pour que votre chaleur vienne la chercher.",
          "Quand vous êtes nu contre la colonne, le marbre froid dans le dos et sa bouche chaude sur votre gorge, elle presse sa cuisse contre votre virilité dressée et appuie, juste assez pour vous arracher un grognement.",
          "Quand vous êtes nu·e contre la colonne, le marbre froid dans le dos et sa bouche chaude sur votre gorge, elle glisse sa cuisse entre les vôtres et appuie, contre votre vigueur et contre votre chaleur à la fois, juste assez pour vous arracher un son.",
        ),
      ],
      [
        "Elle arrête la danse contre une colonne et commence à vous déshabiller, très lentement, pour mépriser la bataille.",
      ],
    ),
    M(
      [
        "Elle recule d’un pas. Sa robe glisse. Au-dessus de vous, les lustres baissent d’eux-mêmes, comme une salle qui retient son souffle avant le lever du rideau.",
        B("Regarde bien. Demain, tu regarderas des cartes.", "seductive"),
      ],
      [
        "Elle recule d’un pas et laisse glisser sa robe. Au-dessus de vous, les lustres baissent d’eux-mêmes, comme une salle qui retient son souffle avant le lever du rideau. Il ne reste qu’une lumière rose qui la suit comme un projecteur.",
        B("Regarde bien. Demain, tu regarderas des cartes. Je veux que tu les trouves d’un ennui mortel.", "seductive"),
      ],
      [
        "Elle recule d’un pas et laisse glisser sa robe. Au-dessus de vous, les lustres baissent d’eux-mêmes, comme une salle qui retient son souffle avant le lever du rideau. Il ne reste qu’une lumière rose qui la suit comme un projecteur.",
        "Elle se tient nue au milieu de la salle de bal impériale, les seins hauts, les hanches offertes à la lumière, la peau couleur de braise, et elle a l’air d’en être la propriétaire légitime.",
        B("Regarde bien. Demain, tu regarderas des cartes. Je veux que tu les trouves d’un ennui mortel.", "seductive"),
      ],
      [
        "Elle laisse glisser sa robe. Les lustres baissent d’eux-mêmes. Il ne reste qu’une lumière rose.",
      ],
    ),
    M(
      [
        "Elle arrache la housse d’un divan, vous y couche, et s’installe au-dessus de vous.",
        W(SLEPT, [B("Je sais déjà où te toucher. Ce soir, je vais vérifier si tu as appris à me cacher quelque chose.", "teasing")], [B("Voyons si tu es aussi lisible que je le crois.", "teasing")]),
        "Ses mains confirment, une à une, toutes ses hypothèses.",
      ],
      [
        "Elle arrache la housse d’un divan d’un geste de prestidigitatrice, vous y couche et s’installe au-dessus de vous, un genou de chaque côté de vos hanches.",
        W(SLEPT, [
          B("Je sais déjà où te toucher. Ce soir, je vais vérifier si tu as appris à me cacher quelque chose.", "teasing"),
          "Elle passe en revue ce qu’elle connaît : la nuque, le côté gauche, le creux sous les côtes. Tout répond comme prévu. Elle a l’air presque déçue, puis elle trouve un endroit nouveau sur votre poignet, et son sourire revient, carnassier.",
        ], [
          B("Voyons si tu es aussi lisible que je le crois.", "teasing"),
          "Elle cherche, méthodiquement. La nuque, les épaules, les côtes. Chaque découverte la fait sourire un peu plus, et elle les annonce à voix haute, comme une joueuse qui abat ses cartes une à une.",
        ]),
      ],
      [
        "Elle arrache la housse d’un divan d’un geste de prestidigitatrice, vous y couche et s’installe au-dessus de vous, un genou de chaque côté de vos hanches.",
        W(SLEPT, [
          B("Je sais déjà où te toucher. Ce soir, je vais vérifier si tu as appris à me cacher quelque chose.", "teasing"),
          "Elle passe en revue ce qu’elle connaît : la nuque, le côté gauche, le creux sous les côtes. Tout répond comme prévu. Elle a l’air presque déçue, puis elle trouve un endroit nouveau à l’intérieur de votre poignet, et son sourire revient, carnassier.",
        ], [
          B("Voyons si tu es aussi lisible que je le crois.", "teasing"),
          "Elle cherche, méthodiquement. La nuque, les épaules, les côtes. Chaque découverte la fait sourire un peu plus, et elle les annonce à voix haute, comme une joueuse qui abat ses cartes une à une.",
        ]),
        X(
          "Elle se penche, et ses seins frôlent les vôtres, pointe contre pointe, pendant que ses doigts descendent tracer un cercle très lent autour de votre perle de plaisir, sans jamais la toucher tout à fait.",
          "Elle se penche, ses seins frôlant votre poitrine, et sa chaleur vient se poser sur votre virilité dressée sans la prendre, glissant d’avant en arrière, humide et brûlante, juste pour vous montrer ce que vous n’aurez pas encore.",
          "Elle se penche, ses seins frôlant votre poitrine, et sa chaleur vient glisser le long de votre vigueur dressée sans la prendre, tandis que sa main descend plus bas tracer un cercle lent autour de votre propre chaleur, sans y entrer.",
        ),
      ],
      [
        "Elle vous couche sur un divan dépouillé de sa housse et vérifie, une à une, toutes ses hypothèses sur vous.",
      ],
    ),
    M(
      [
        "Son aura emplit la salle de bal comme un parfum renversé. Votre désir monte, monte encore, et elle le tient là, au sommet, sans le laisser retomber ni basculer.",
        B("Dis-moi ce que tu as laissé là-haut pour moi.", "thoughtful"),
        P("Une carte. Une plume. Une chaise vide."),
        B("Une chaise vide. Voilà le plus beau compliment qu’on m’ait fait cette année.", "smirk"),
      ],
      [
        "Son aura emplit la salle de bal comme un parfum renversé. Miel brûlé, jasmin, et cette note sombre que vous commencez à reconnaître. Votre désir monte, monte encore, et elle le tient là, au sommet, sans le laisser retomber ni basculer, comme on tient une note de violon jusqu’à ce que le public cesse de respirer.",
        B("Dis-moi ce que tu as laissé là-haut pour moi.", "thoughtful"),
        P("Une carte. Une plume. Une chaise vide."),
        B("Une chaise vide à la table de la coalition. Voilà le plus beau compliment qu’on m’ait fait cette année.", "smirk"),
      ],
      [
        "Son aura emplit la salle de bal comme un parfum renversé. Miel brûlé, jasmin, et cette note sombre que vous commencez à reconnaître. Votre désir monte, monte encore, et elle le tient là, au sommet, sans le laisser retomber ni basculer.",
        X(
          "Ses doigts sont enfin dans votre chaleur, deux, puis trois, et son pouce reste posé sur votre perle de plaisir sans bouger. C’est son aura qui fait le reste : chaque battement de votre cœur se répercute sous son pouce comme une caresse que personne ne donne.",
          "Sa main enserre enfin votre virilité, immobile. C’est son aura qui fait le reste : chaque battement de votre cœur se répercute dans sa paume comme une caresse que personne ne donne, et elle sourit en sentant votre vigueur tressaillir toute seule.",
          "Une de ses mains enserre votre vigueur, l’autre est entrée dans votre chaleur, et aucune ne bouge. C’est son aura qui fait le reste : chaque battement de votre cœur se répercute aux deux endroits comme une caresse que personne ne donne.",
        ),
        B("Dis-moi ce que tu as laissé là-haut pour moi.", "thoughtful"),
        P("Une carte. Une plume. Une chaise vide."),
        B("Une chaise vide à la table de la coalition. Voilà le plus beau compliment qu’on m’ait fait cette année.", "smirk"),
      ],
      [
        "Son aura emplit la salle. Elle vous tient au sommet de votre désir et vous demande ce que vous avez laissé là-haut pour elle. Une chaise vide. Elle trouve le compliment magnifique.",
      ],
    ),
    M(
      [
        "Elle vous récompense pour cette réponse, avec la bouche cette fois, et ne s’arrête plus. Le plaisir vous emporte sous les lustres roses.",
      ],
      [
        "Elle vous récompense pour cette réponse. Elle descend le long de votre corps, et sa bouche fait ce que son aura promettait depuis le début de la valse. Elle ne s’arrête plus, cette fois. Elle a décidé que vous aviez assez attendu.",
        "Le plaisir vous emporte sous les lustres roses, et l’orchestre invisible, quelque part, laisse tomber son archet.",
      ],
      [
        "Elle vous récompense pour cette réponse et descend le long de votre corps. Elle a décidé que vous aviez assez attendu.",
        X(
          "Sa bouche remplace son pouce sur votre perle de plaisir, ses doigts se remettent à bouger en vous, et cette fois elle ne ralentit plus. Vous jouissez sous les lustres roses, les talons enfoncés dans le divan, en criant quelque chose qui pourrait être son nom.",
          "Sa bouche prend le relais de sa main et descend sur votre virilité jusqu’au bout, et cette fois elle ne ralentit plus. Vous jouissez sous les lustres roses, une main crispée sur le bord du divan, en criant quelque chose qui pourrait être son nom.",
          "Sa bouche prend votre vigueur pendant que ses doigts se remettent à bouger dans votre chaleur, et cette fois elle ne ralentit plus. Vous jouissez des deux côtés à la fois sous les lustres roses, en criant quelque chose qui pourrait être son nom.",
        ),
        "L’orchestre invisible, quelque part, laisse tomber son archet.",
      ],
      [
        "Elle vous récompense, et ne s’arrête plus. L’orchestre invisible laisse tomber son archet.",
      ],
    ),
    M(
      [
        "Elle remonte sur vous, et vient prendre son propre plaisir à son tour, lentement, en vous tenant les poignets au-dessus de la tête.",
        B("Reste là. C’est mon tour.", "seductive"),
      ],
      [
        "Elle remonte sur vous sans vous laisser reprendre votre souffle, attrape vos poignets et les tient au-dessus de votre tête, contre l’accoudoir doré.",
        B("Reste là. C’est mon tour. Tu as eu le tien, et il était très bruyant.", "seductive"),
        "Elle bouge sur vous avec la lenteur de quelqu’un qui a tout son temps et qui tient à le faire savoir à la bataille de demain.",
      ],
      [
        "Elle remonte sur vous sans vous laisser reprendre votre souffle, attrape vos poignets et les tient au-dessus de votre tête, contre l’accoudoir doré.",
        B("Reste là. C’est mon tour. Tu as eu le tien, et il était très bruyant.", "seductive"),
        X(
          "Elle s’installe sur votre cuisse, sa chaleur contre votre peau, et se frotte contre vous en longs mouvements appliqués, le bassin roulant, jusqu’à ce que votre propre plaisir, à peine retombé, recommence à monter contre sa cuisse à elle.",
          "Elle vous reprend en main, vous ranime en quelques caresses expertes, et descend sur votre virilité avec une lenteur provocante. Puis elle bouge sur vous avec la patience de quelqu’un qui a tout son temps et qui tient à le faire savoir à la bataille de demain.",
          "Elle vous ranime en quelques caresses expertes et descend sur votre vigueur avec une lenteur provocante, ses doigts revenant chercher votre chaleur encore sensible. Puis elle bouge sur vous avec la patience de quelqu’un qui a tout son temps et qui tient à le faire savoir à la bataille de demain.",
        ),
      ],
      [
        "Elle remonte sur vous, vous tient les poignets, et annonce que c’est son tour.",
      ],
    ),
    M(
      [
        "Vous libérez une main, la posez sur sa hanche, et suivez son rythme au lieu de le subir. Elle vous regarde, surprise, puis vous laisse faire. Elle atteint son plaisir dans un souffle, et un lustre entier s’embrase au-dessus de vous.",
      ],
      [
        "Vous libérez une main et la posez sur sa hanche ; elle vous laisse faire, ou elle n’a pas remarqué. Vous ne cherchez pas à mener. Vous suivez son rythme au lieu de le subir, et vous l’accompagnez juste un peu plus loin à chaque mouvement.",
        "Elle vous regarde, surprise. Elle ouvre la bouche pour reprendre l’avantage, puis ne dit rien.",
        "Elle atteint son plaisir dans un souffle qui ressemble à un aveu, et au-dessus de vous un lustre entier s’embrase, toutes ses bougies montant d’un coup jusqu’au plafond.",
        B("…Tu viens de faire quelque chose.", "thoughtful"),
        P("J’ai suivi."),
        B("Personne ne suit aussi bien. C’est suspect.", "smirk"),
      ],
      [
        "Vous libérez une main et la posez sur sa hanche ; elle vous laisse faire, ou elle n’a pas remarqué. Vous ne cherchez pas à mener. Vous suivez son rythme au lieu de le subir, et vous l’accompagnez juste un peu plus loin à chaque mouvement.",
        X(
          "Votre main glisse de sa hanche jusqu’à sa perle de plaisir, et vous la caressez exactement au rythme de son bassin, sans rien imposer, en suivant. Elle vous regarde, surprise, ouvre la bouche pour reprendre l’avantage, puis ne dit rien.",
          "Votre main glisse de sa hanche jusqu’à sa perle de plaisir pendant qu’elle se soulève et retombe sur vous, et vous la caressez exactement à son rythme, sans rien imposer. Elle vous regarde, surprise, ouvre la bouche pour reprendre l’avantage, puis ne dit rien.",
          "Votre main glisse de sa hanche jusqu’à sa perle de plaisir pendant qu’elle se soulève et retombe sur votre vigueur, et vous la caressez exactement à son rythme, sans rien imposer. Elle vous regarde, surprise, ouvre la bouche pour reprendre l’avantage, puis ne dit rien.",
        ),
        "Elle jouit dans un souffle qui ressemble à un aveu, se resserrant contre vous, et vous l’accompagnez de l’autre côté. Au-dessus de vous, un lustre entier s’embrase, toutes ses bougies montant d’un coup jusqu’au plafond.",
        B("…Tu viens de faire quelque chose.", "thoughtful"),
        P("J’ai suivi."),
        B("Personne ne suit aussi bien. C’est suspect.", "smirk"),
      ],
      [
        "Vous suivez son rythme au lieu de le subir. Elle le remarque. Un lustre entier s’embrase quand elle atteint son plaisir.",
      ],
    ),
    A(
      "Vous restez étendu·e contre elle sur le divan dépouillé, sous la housse qu’elle a ramenée sur vous d’un geste négligent. L’orchestre s’est tu. Les lustres brûlent bas.",
      B("Demain, tout le monde mentira à nouveau pour rester en vie. Les officiers diront qu’ils n’ont pas peur. Iriana dira qu’elle a tout prévu. Mon frère dira qu’il s’en moque.", "thoughtful"),
      P("Et toi ?"),
      B("Moi, je dirai que je me suis ennuyée ce soir. Personne ne me croira. C’est l’avantage d’avoir une réputation.", "smirk"),
    ),
    A(
      "Elle se lève, renfile sa robe, puis, chose inattendue, ramasse votre chemise et vous la boutonne elle-même, du premier au dernier bouton, avec une précision de valet.",
      B("Le protocole est parti. Sans ton regard. Iriana va te le faire payer avec une politesse terrifiante.", "teasing"),
      W(SLEPT, [
        B("Tu te souviens de la première fois ? Tu tremblais un peu. Ce soir, tu as suivi mon rythme comme si tu l’avais appris par cœur. Je ne sais pas encore si je dois m’en réjouir.", "thoughtful"),
      ], [
        B("Voilà. Tu as goûté. Maintenant, tu sais ce que tu refusais. Je me demande si tu vas le regretter ou recommencer.", "seductive"),
      ]),
    ),
    A(
      "Elle part la première, sans se retourner, et à chaque pas qu’elle fait vers la porte, un lustre s’éteint derrière elle. Quand elle atteint le seuil, la salle de bal est noire.",
      B("Bonne bataille, {player}. Ne meurs pas. J’ai encore des choses à vérifier.", "seductive"),
    ),
  ],
};
