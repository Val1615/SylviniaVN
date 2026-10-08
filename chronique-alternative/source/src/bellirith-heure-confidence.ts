import { A, B, M, P, W, X, SLEPT, RESISTED, type HeureVolee } from "./bellirith-intimacy-kit";

/*
 * Heure volée · confidence détournée.
 * Bellirith a changé de sujet en changeant de terrain. La phrase sur
 * Valurn reste suspendue pendant toute la scène : {player} peut y revenir,
 * elle répond par le corps, frôle l’aveu et le garde. Aucun registre
 * thérapeutique : personne ne console, personne ne répare.
 */
export const HEURE_CONFIDENCE: HeureVolee = {
  context: "bellirith-free-confidence",
  title: "La phrase suspendue",
  devLabel: "Confidence détournée",
  background: "/assets/backgrounds/alcove.webp",
  opening: (flags) => [
    "Elle vous entraîne vers le divan de ses appartements en parlant beaucoup trop : du vin, des rideaux, d’une marquise qui a la voix d’un canard. Vous la connaissez assez pour savoir qu’elle remplit le silence avant qu’autre chose ne s’y installe.",
    W(SLEPT, [
      B("Tu connais déjà le chemin. Profites-en. Les sujets de conversation, eux, peuvent attendre dans le couloir.", "seductive"),
    ], [
      B("Tu viens de choisir ma bouche plutôt que mon histoire. C’est la meilleure décision de ta vie. Ne la gâche pas en réfléchissant.", "seductive"),
    ]),
  ],
  approaches: () => [
    { id: "confidence-laisser", text: "Laisser la question où elle est, pour l’instant.", lines: [
      "Vous ne dites rien. Vous la laissez parler du canard et de la marquise jusqu’à ce qu’elle s’essouffle d’elle-même.",
      B("Tu m’écoutes raconter des bêtises avec un sérieux insultant.", "angry"),
    ] },
    { id: "confidence-garder", text: "Lui faire savoir que la question vous suit.", lines: [
      P("Je te suis. La question aussi. Elle est polie, elle attendra dans un coin."),
      B("Alors je vais la faire rougir, ta question. Elle finira par partir d’elle-même.", "smirk"),
    ] },
  ],
  ending: (flags) => [
    "Elle vous raccompagne jusqu’à la porte, enveloppée dans un drap, et vous embrasse sur le seuil avec une douceur qu’elle n’a pas prévue.",
    W(RESISTED, [
      B("Tu as dit non à tant de choses. Ce soir, tu as dit oui, et tu as quand même gardé ta question. Je ne sais pas encore si je t’admire ou si je te hais.", "thoughtful"),
    ], [
      B("Tu reviendras avec ta question. Je le sais. Choisis bien le moment : je serai odieuse, et tu le mériteras.", "smirk"),
    ]),
  ],
  route: {
    id: "bellirith-heure-confidence",
    context: "bellirith-free-confidence",
    text: "Changer de terrain",
    detail: "Elle a choisi le seul terrain où elle gagne toujours. La phrase qu’elle n’a pas finie reste dans la pièce, et vous pouvez y revenir autant que vous voudrez.",
    visual: { revealChapter: 4, postOrgasmChapter: 11 },
    chapters: [
      A(
        "Les lampes baissent d’elles-mêmes. Une musique de cordes monte de nulle part, un peu trop forte, et des pétales sombres se mettent à tomber du plafond pour disparaître avant de toucher le tapis.",
        P("Tu en fais beaucoup."),
        B("J’en fais toujours beaucoup. C’est mon charme.", "teasing"),
        P("Ce soir, tu en fais plus que d’habitude."),
        "Elle claque des doigts. Les pétales cessent de tomber. La musique, elle, continue, plus bas.",
      ),
      A(
        P("Tout à l’heure, tu parlais d’une époque."),
        "Elle pose un doigt sur votre bouche, très exactement au milieu de la lèvre inférieure.",
        B("Chut. Tu as choisi.", "cold"),
        P("J’ai choisi de te suivre. Je n’ai rien promis d’autre."),
        B("Alors je vais devoir être très convaincante.", "seductive"),
      ),
      M(
        [
          "Elle vous embrasse pour vous faire taire, longuement, puis vous déshabille avec une hâte qui ne lui ressemble pas. Ses mains tremblent un peu ; vous faites semblant de ne pas le remarquer.",
        ],
        [
          "Elle vous embrasse pour vous faire taire, longuement, profondément, puis s’attaque à vos vêtements avec une hâte qui ne lui ressemble pas. Un bouton saute et roule sous le divan. Elle ne le regarde même pas.",
          "Ses mains tremblent un peu. Vous faites semblant de ne pas le remarquer, et elle fait semblant de ne pas voir que vous faites semblant.",
        ],
        [
          "Elle vous embrasse pour vous faire taire, longuement, profondément, puis s’attaque à vos vêtements avec une hâte qui ne lui ressemble pas. Un bouton saute et roule sous le divan. Elle ne le regarde même pas.",
          X(
            "Elle vous dénude jusqu’à la taille et prend vos seins à pleines mains, trop fort d’abord, puis plus doucement quand vous retenez son poignet. Elle frotte ses pouces sur leurs pointes jusqu’à vous arracher un soupir.",
            "Elle ouvre votre pantalon et vous empoigne aussitôt, trop vite, comme pour en finir avec les questions. Quand vous retenez son poignet, elle ralentit et vous caresse sur toute votre longueur, les yeux baissés.",
            "Elle ouvre votre pantalon, saisit votre vigueur et glisse aussitôt l’autre main vers votre chaleur, trop vite, comme pour en finir avec les questions. Quand vous retenez son poignet, elle ralentit, et ses doigts apprennent les deux chemins sans se presser.",
          ),
          "Elle vous mord l’épaule, puis embrasse la marque, puis la mord encore, en surveillant votre visage du coin de l’œil pour vérifier que la question s’en va.",
          "Ses mains tremblent un peu. Vous faites semblant de ne pas le remarquer, et elle fait semblant de ne pas voir que vous faites semblant.",
        ],
        ["Elle vous déshabille trop vite, les mains un peu tremblantes."],
      ),
      M(
        [
          "Vous lui prenez les poignets et les tenez contre vous, sans serrer. Elle s’immobilise, surprise. Vous l’embrassez lentement, comme si vous aviez toute la nuit.",
          B("Tu ralentis exprès.", "angry"),
        ],
        [
          "Vous lui prenez les poignets et les ramenez contre votre poitrine, sans serrer. Elle s’immobilise, interloquée, comme une danseuse dont le partenaire vient de changer la mesure.",
          "Vous l’embrassez lentement, la tempe, le coin de la bouche, la paupière, en prenant tout le temps qu’elle cherche à vous voler.",
          B("Tu ralentis exprès. Pour que ta question ait le temps de revenir.", "angry"),
          P("Elle n’est jamais partie."),
        ],
        [
          "Vous lui prenez les poignets et les ramenez contre votre poitrine, sans serrer. Elle s’immobilise, interloquée, comme une danseuse dont le partenaire vient de changer la mesure.",
          "Vous l’embrassez lentement, la tempe, le coin de la bouche, la paupière, puis la gorge, en prenant tout le temps qu’elle cherche à vous voler. Sous vos lèvres, son pouls bat aussi vite que le vôtre.",
          B("Tu ralentis exprès. Pour que ta question ait le temps de revenir.", "angry"),
          P("Elle n’est jamais partie."),
        ],
        ["Vous lui tenez les poignets et ralentissez tout. Elle déteste ça, un peu."],
      ),
      M(
        [
          "Elle se dégage, se lève et laisse tomber sa robe dans la pénombre, en gardant les lampes très basses.",
        ],
        [
          "Elle se dégage d’un mouvement d’épaules, se lève et laisse tomber sa robe dans la pénombre. Les lampes restent si basses que vous devinez son corps plus que vous ne le voyez.",
          P("Rallume."),
          "Elle hésite. Puis une seule flamme se redresse, à contrecœur, juste assez pour éclairer son visage. C’est le visage qu’elle voulait cacher, et vous le regardez.",
        ],
        [
          "Elle se dégage d’un mouvement d’épaules, se lève et laisse tomber sa robe dans la pénombre. Les lampes restent si basses que vous devinez son corps plus que vous ne le voyez : l’arrondi d’un sein, une hanche, l’éclat de ses boucles d’oreilles.",
          P("Rallume."),
          "Elle hésite. Puis les flammes se redressent, à contrecœur, une à une, jusqu’à éclairer tout son corps nu et son visage, surtout son visage, celui qu’elle aurait voulu garder dans l’ombre. Vous la regardez des pieds à la tête, et c’est son visage que vous regardez le plus longtemps.",
        ],
        ["Elle se dévêt dans le noir. Vous lui demandez de rallumer. Elle obéit, à moitié."],
      ),
      A(
        P("Avant la haine, il y avait quoi ?"),
        "Elle ferme les yeux. Pendant une seconde entière, vous croyez qu’elle va répondre.",
        B("Il y avait…", "thoughtful"),
        "Puis elle rouvre les yeux, et ils brillent de nouveau de cette lumière de défi que vous connaissez bien.",
        B("Il y avait ça.", "seductive"),
        "Et elle vous pousse en arrière sur le divan.",
      ),
      M(
        [
          "Elle vous couvre de baisers, partout, avec une détermination furieuse, jusqu’à ce que vous ne pensiez plus à rien. Presque plus à rien.",
        ],
        [
          "Elle vous couvre de baisers, partout, avec une détermination furieuse, comme si chaque centimètre de votre peau pouvait cacher la question et qu’il fallait la débusquer pour l’étouffer.",
          "Elle descend, s’attarde, remonte, recommence. Vous la laissez faire. Au bout d’un moment, vous ne pensez plus à grand-chose. Elle le voit, et son triomphe sent le soulagement.",
        ],
        [
          "Elle vous couvre de baisers, partout, avec une détermination furieuse, comme si chaque centimètre de votre peau pouvait cacher la question et qu’il fallait la débusquer pour l’étouffer.",
          X(
            "Elle s’allonge entre vos cuisses et vous prend avec la bouche, sans préambule, la langue pressée contre votre perle, deux doigts recourbés en vous. Elle y met tout ce qu’elle sait, et elle en sait beaucoup trop.",
            "Elle s’allonge entre vos cuisses et vous prend dans sa bouche jusqu’au fond, sans préambule, une main serrée à la base. Elle y met tout ce qu’elle sait, et elle en sait beaucoup trop.",
            "Elle s’allonge entre vos cuisses, prend votre vigueur dans sa bouche et enfonce deux doigts dans votre chaleur. Elle y met tout ce qu’elle sait, des deux côtés à la fois, et elle en sait beaucoup trop.",
          ),
          "Au bout d’un moment, vous ne pensez plus à grand-chose. Elle le voit, et son triomphe sent le soulagement.",
        ],
        ["Elle vous embrasse partout pour chasser la question. Ça marche presque."],
      ),
      A(
        "Vous dites son nom, doucement. Rien d’autre. Elle s’arrête net.",
        B("Ne fais pas ça.", "cold"),
        P("Je n’ai rien demandé."),
        B("Tu l’as dit comme on pose une question. Il y avait une maison. Il y avait…", "thoughtful"),
        "Elle se mord la lèvre, si fort qu’elle y laisse une marque.",
        B("Non. Continue ce que tu faisais. Enfin, ce que je faisais. Peu importe.", "angry"),
      ),
      M(
        [
          "Vous la faites basculer sur le dos et la caressez à votre tour. Elle se tait pour de bon, une main sur la bouche, et se laisse emporter.",
        ],
        [
          "Vous la faites basculer sur le dos. À votre tour de la caresser, lentement, sans vous presser, en suivant ce que son corps répond.",
          "Elle se tait pour de bon. Elle plaque une main sur sa propre bouche, comme pour empêcher la phrase de sortir par un autre chemin, et se laisse emporter.",
        ],
        [
          "Vous la faites basculer sur le dos. À votre tour de la goûter, lentement, en embrassant d’abord ses seins, puis son ventre, puis l’intérieur de ses cuisses, jusqu’à poser la bouche sur son intimité brûlante.",
          "Vous la caressez de la langue et des doigts, en suivant ce que son corps répond. Elle se tait pour de bon. Elle plaque une main sur sa propre bouche, comme pour empêcher la phrase de sortir par un autre chemin, et jouit sous votre bouche en silence, le dos arqué, tremblant longtemps après.",
        ],
        ["À votre tour. Elle garde une main sur sa bouche, et se laisse emporter."],
      ),
      M(
        [
          "Elle vous attire contre elle et vous vous unissez, face à face. Elle garde les yeux fermés. Vous lui demandez de les ouvrir. Elle les ouvre.",
        ],
        [
          "Elle vous attire contre elle et vous vous unissez, face à face, lentement. Elle garde les yeux fermés.",
          P("Regarde-moi."),
          "Elle les ouvre. Elle ne dit rien. Elle vous regarde pendant tout le reste, et c’est peut-être la chose la plus difficile qu’elle ait faite de la soirée.",
        ],
        [
          "Elle vous attire contre elle, les jambes nouées autour de vous.",
          X(
            "Vous vous allongez sur elle, intimité contre intimité, et vous commencez à bouger. Vos chaleurs glissent l’une contre l’autre, lentement, vos doigts entremêlés pour vous ouvrir l’une à l’autre. Elle garde les yeux fermés.",
            "Elle vous guide en elle d’une main et vous attire jusqu’au bout. Vous commencez à bouger, lentement, profondément. Elle garde les yeux fermés.",
            "Elle guide votre vigueur en elle et vous attire jusqu’au bout, puis glisse une main entre vous pour caresser votre chaleur. Vous commencez à bouger, lentement. Elle garde les yeux fermés.",
          ),
          P("Regarde-moi."),
          "Elle les ouvre. Elle ne dit rien. Elle vous regarde pendant tout le reste, et c’est peut-être la chose la plus difficile qu’elle ait faite de la soirée.",
          "Vous bougez avec elle sans hâte. Chaque fois que ses paupières frémissent, prêtes à retomber, vous ralentissez encore, et elle comprend le marché. Elle garde les yeux dans les vôtres, les lèvres entrouvertes, les talons pressés contre vos reins pour vous rapprocher. La musique de cordes s’est tue depuis longtemps. Il ne reste que le craquement du divan et vos deux souffles qui cherchent le même tempo.",
        ],
        ["Face à face. Vous lui demandez d’ouvrir les yeux. Elle les ouvre."],
      ),
      M(
        [
          "Le plaisir vous prend tous les deux, presque ensemble. Elle ne détourne pas le regard.",
        ],
        [
          "Le plaisir vous prend tous les deux, presque ensemble. Elle ne détourne pas le regard, même au moment où son visage se défait.",
        ],
        [
          "Le rythme s’accélère. Elle s’accroche à vos épaules et ne détourne pas le regard, même au moment où son visage se défait.",
          X(
            "Vous jouissez l’une contre l’autre, presque ensemble, ses doigts serrés sur les vôtres.",
            "Elle se resserre autour de vous et vous jouissez en elle presque au même instant, sa main crispée dans votre nuque.",
            "Elle se resserre autour de votre vigueur, ses doigts pressés contre votre chaleur, et vous jouissez des deux côtés presque au même instant qu’elle.",
          ),
          "Elle laisse échapper un son bref, à mi-chemin entre un rire et un sanglot, et l’étouffe aussitôt contre votre épaule. Vous ne lui demandez pas ce que c’était.",
        ],
        ["Vous basculez ensemble. Elle garde les yeux ouverts."],
      ),
      M(
        [
          "Plus tard, elle vous tourne le dos. Votre main reste posée sur son épaule. Elle parle au mur, très bas.",
        ],
        [
          "Plus tard, elle se tourne sur le côté et vous présente son dos. Votre main reste posée sur son épaule ; elle ne la chasse pas. Quand elle parle, c’est au mur, très bas.",
        ],
        [
          "Plus tard, elle se tourne sur le côté et vous présente son dos nu, ses cheveux répandus sur le coussin. Votre main reste posée sur son épaule ; elle ne la chasse pas, elle la recouvre même de la sienne. Vous suivez du pouce la ligne de son omoplate, puis toute la ligne de son dos jusqu’au creux des reins, jusqu’à ce que son souffle s’apaise. Quand elle parle, c’est au mur, très bas.",
        ],
        ["Elle vous tourne le dos et garde votre main sur son épaule."],
      ),
      A(
        B("Je n’ai jamais fini cette phrase. Devant personne. Ce soir, j’ai failli. C’est ta faute.", "thoughtful"),
        P("Je reposerai la question."),
        B("Je sais. Pose-la au pire moment, que je puisse au moins te détester en répondant.", "smirk"),
        W(SLEPT, [
          "Elle se retourne enfin et se cale contre vous, le front dans votre cou, comme les autres nuits. Cette fois, elle ne dort pas.",
        ], [
          "Elle se retourne enfin, vous dévisage longtemps, puis se cale contre vous, le front dans votre cou, avec la maladresse des premières fois.",
        ]),
      ),
    ],
  },
};
