import type { GroupDateScene } from "./group-dates";
import type { CrossQuestProgress } from "./cross-quests";
import {
  H,
  R,
  P,
  N,
  Q,
  HR_KEY,
  HR_OPEN,
  hrTriadAccepted,
  type HRBeat,
} from "./hylee-remerii-cross-quest";

export const HR_DATE_IDS = [
  "group-date-hylee-remerii-free-day",
  "group-date-hylee-remerii-wind",
  "group-date-hylee-remerii-home",
] as const;

const sharedDateFields = {
  characters: ["hylee", "remerii"] as [string, string],
  minStage: 5,
  minAffection: 22,
  minTrust: 22,
  minDesire: 0,
  intimacyMinDesire: 25,
  authoredBeats: true,
  mood: "soft",
  intimacySetting: { opening: [], closing: [] },
};

export const HR_DATES: GroupDateScene[] = [
  {
    ...sharedDateFields,
    id: HR_DATE_IDS[0],
    title: "Une journée sans programme",
    type: "Une sortie à Mir’Aldas",
    description: "Retrouver Hylee et Remerii sous le dôme, sans rapport à rendre ni destination à accomplir.",
    dynamic: "Hylee choisit au fil des rues. Remerii a promis de laisser son registre à la résidence — ce qui ne l’empêche pas d’avoir gardé un crayon.",
    location: "miraldas",
    spot: "miraldas-dome",
    period: "apres-midi",
    music: "miraldas",
    intro: [
      N("Hylee vous attend sous le dôme avec un sachet vide. Remerii vérifie machinalement sa manche, puis retire sa main lorsque Hylee la surprend."),
      H("Montre."),
      R("Il n’y a rien."),
      H("Tu as répondu trop vite."),
      N("Hylee glisse deux doigts dans la manche et en ressort un crayon. Remerii le lui laisse prendre avec la dignité d’une femme victime d’une fouille manifestement habituelle."),
      R("Ce n’est pas un registre."),
      H("La journée part donc sur une victoire."),
      P("Et le sachet vide ?"),
      H("Pour ce qu’on trouvera. Une liste nous obligerait à savoir où nous allons."),
      R("Une direction générale demeure souhaitable."),
      H("Devant nous."),
      N("Remerii ouvre la bouche, regarde la rue, puis rit. Hylee lui rend le crayon mais le glisse derrière son oreille pour qu’elle ne puisse pas écrire sans y penser."),
      N("Vous traversez une galerie où les étals changent déjà de place. Hylee s’arrête devant des rubans, Remerii devant une petite table à l’ombre ; chacune attend que l’autre remarque son choix."),
    ],
    choices: [
      Q(
        "cross-hr-day-third",
        "Prendre la troisième chaise et refuser de choisir entre la table et les étals.",
        "audace",
        [
          P("Nous nous asseyons, puis nous repartons. Je refuse d’arbitrer un conflit aussi grave."),
          H("Tu vois ? Une troisième proposition."),
          R("Qui consiste à faire les deux dans un ordre raisonnable."),
          H("Ne gâche pas sa victoire."),
          N("Elles s’installent de part et d’autre de vous, momentanément unies contre votre prétendu sens de l’arbitrage."),
        ],
        { affection: 1, desire: 1, relationshipEffects: { remerii: { affection: 1, desire: 1 } } },
      ),
      Q(
        "cross-hr-day-follow",
        "Leur proposer de suivre la première chose qui attire l’une d’elles.",
        "resonance",
        [
          N("Remerii regarde les étals ; Hylee regarde la table. Elles comprennent en même temps qu’elles ont choisi pour l’autre."),
          H("On mange d’abord."),
          R("Puis les rubans."),
          N("Vous les suivez dans une décision qui leur appartenait déjà à toutes les deux."),
        ],
        { trust: 1, relationshipEffects: { remerii: { trust: 1 } } },
      ),
      Q(
        "cross-hr-day-plan",
        "Improviser un parcours précis pour éviter de perdre l’après-midi.",
        "lucidite",
        [
          H("On vient justement de gagner une journée sans parcours."),
          R("Je reconnais pourtant la tentation."),
          N("Remerii retire le crayon de son oreille, vous le montre, puis le range."),
          R("Aujourd’hui, nous allons essayer de nous perdre à une échelle raisonnable."),
        ],
        { trust: -1 },
      ),
    ],
  },
  {
    ...sharedDateFields,
    id: HR_DATE_IDS[1],
    title: "À trois contre le vent",
    type: "Une promenade dans les bois pourpres",
    description: "Suivre les sentiers sous le dôme jusqu’à ce que le vent décide de votre abri et rapproche vos trois corps.",
    dynamic: "La promenade prolonge les gestes de la première sortie. Le froid, le manteau partagé et les baisers rendent le désir plus difficile à ignorer.",
    location: "miraldas",
    spot: "miraldas-purple-woods",
    period: "apres-midi",
    afterDates: [HR_DATE_IDS[0]],
    music: "confessions-wind",
    intro: [
      N("Le vent fait claquer la couverture avant même que vous quittiez le chemin principal. Hylee en tient un coin devant elle ; une rafale le lui rabat aussitôt au visage."),
      R("J’allais te prévenir."),
      H("Après ou avant de rire ?"),
      R("Les deux étaient encore possibles."),
      N("Remerii dégage le tissu de ses cheveux. Hylee en profite pour lui entourer les épaules avec la couverture et vous tend l’autre extrémité."),
      H("Voilà. Elle ne s’envole plus."),
      R("Parce que je suis devenue un lest."),
      H("Un lest très élégant."),
      P("Il y a un mur bas plus haut. L’arbre derrière coupera une partie du vent."),
      R("Vous avez repéré cela avant que nous transformions la couverture en vêtement."),
      H("Nous pouvons garder les deux solutions."),
      N("Vous avancez serrés sous un tissu trop court. Hylee touche naturellement le bras de Remerii pour signaler une racine ; Remerii prend votre poignet quand le sentier se resserre."),
    ],
    choices: [
      Q(
        "cross-hr-wind-share",
        "Garder la couverture autour de vous trois jusqu’à l’abri.",
        "resonance",
        [
          N("Votre marche prend un rythme maladroit mais commun. À chaque rafale, Hylee se rapproche ; Remerii prétend corriger la prise tout en vous gardant contre elle."),
          H("On ressemble à une tente qui a décidé de voyager."),
          R("Une tente aurait davantage de tenue."),
          P("Mais moins chaud."),
        ],
        { affection: 1, desire: 2, relationshipEffects: { remerii: { affection: 1, desire: 2 } } },
      ),
      Q(
        "cross-hr-wind-route",
        "Prendre le panier et choisir le chemin large pour qu’elles gardent la couverture.",
        "sangFroid",
        [
          H("Plus long, mais je pourrai la tenir autrement qu’avec les dents."),
          R("Nous ne sommes attendus nulle part. Prenons celui-là."),
          N("Vous portez le panier. Hylee et Remerii descendent côte à côte, chacune un pan de couverture autour de l’autre."),
        ],
        { trust: 2, relationshipEffects: { remerii: { trust: 2 } } },
      ),
      Q(
        "cross-hr-wind-ice",
        "Suggérer à Hylee de fixer la couverture avec sa magie.",
        "lucidite",
        [
          H("Je préfère qu’on puisse s’asseoir dessus sans rester collés avec."),
          R("Et cette promenade n’est pas une démonstration."),
          N("Vous prenez le panier. Hylee resserre la couverture sur les épaules de Remerii avant de reprendre le chemin."),
        ],
        { trust: -1 },
      ),
    ],
  },
  {
    ...sharedDateFields,
    id: HR_DATE_IDS[2],
    title: "La porte fermée",
    type: "Une soirée dans votre logis",
    description: "Recevoir Hylee et Remerii chez vous, partager le repas et découvrir ce que change la possibilité de rester.",
    dynamic: "Votre pièce, vos objets et vos habitudes deviennent le décor réel de la soirée. Le troisième rendez-vous ne pourrait exister nulle part ailleurs.",
    location: "miraldas",
    spot: "miraldas-quarters",
    period: "soirée",
    afterDates: [HR_DATE_IDS[0], HR_DATE_IDS[1]],
    home: true,
    music: "two-stars-night",
    intro: [
      N("Hylee passe votre porte avec un paquet enveloppé dans un linge. Remerii retient le battant derrière elle et cherche déjà où poser son manteau sans couvrir vos affaires."),
      H("On a apporté de quoi compléter le repas. Enfin, c’était le principe avant qu’elle ajoute la moitié du marché."),
      R("Tu as changé deux fois la taille du paquet."),
      H("Parce que tu ajoutais des choses."),
      R("Pour éviter que nous mangions seulement du pain et ce que tu appelais une surprise."),
      N("Remerii vous tend le paquet le plus lourd, puis dégage le linge pris dans la manche d’Hylee avec la familiarité d’un geste répété cent fois."),
      P("Vos manteaux peuvent rester ici."),
      N("Hylee en retire le sien. Remerii garde encore le sien sur le bras."),
      H("Tu comptes repartir avant le repas ?"),
      R("Je cherchais à ne pas couvrir les objets de {player}."),
      P("Ils survivront à votre manteau."),
      N("Elle le pose enfin. Hylee observe un objet exposé sans le toucher ; Remerii regarde plutôt la lumière, les sièges et les traces de vos habitudes."),
      H("Je peux ouvrir le paquet ?"),
      R("Tu l’as fermé."),
      H("Je demande quand même."),
      N("Le nœud cède. Une petite boîte menace de rouler ; Remerii place une assiette dessous avant même qu’Hylee ne lève les yeux."),
    ],
    choices: [
      Q(
        "cross-hr-home-places",
        "Leur montrer où déposer leurs affaires, puis leur laisser choisir leur place.",
        "resonance",
        [
          N("Hylee choisit le siège depuis lequel elle peut vous voir et atteindre Remerii. Celle-ci déplace sa chaise de quelques doigts, vieux compromis silencieux entre proximité et espace."),
          H("Tu peux la rapprocher encore."),
          R("Je savais que tu le dirais."),
          N("Elle le fait tout de même."),
        ],
        { affection: 1, relationshipEffects: { remerii: { affection: 1 } } },
      ),
      Q(
        "cross-hr-home-tour",
        "Leur faire visiter les détails du logement qui comptent pour vous.",
        "resonance",
        [
          N("Hylee vous suit jusqu’aux objets exposés. Remerii reste un pas derrière, attentive aux histoires plutôt qu’à leur valeur."),
          R("Je comprends pourquoi vous l’avez placé près de la lumière."),
          H("Et pourquoi cette place reste vide quand tu n’es pas là."),
          N("Votre logement cesse d’être un décor générique ; elles apprennent la pièce par la manière dont vous l’habitez."),
        ],
        { trust: 2, relationshipEffects: { remerii: { trust: 2 } } },
      ),
      Q(
        "cross-hr-home-service",
        "Demander à Remerii de terminer seule le service pendant que vous gardez Hylee.",
        "audace",
        [
          R("Je suis venue passer la soirée avec vous deux."),
          H("Et je peux attendre qu’on ait posé trois assiettes."),
          N("Vous reprenez le dernier plat. Hylee garde la chaise voisine de Remerii libre jusqu’à ce qu’elle s’y installe."),
        ],
        { trust: -2, relationshipEffects: { remerii: { affection: -2 } } },
      ),
    ],
  },
];

export const HR_DATE_BEATS: Record<string, HRBeat[]> = {
  [HR_DATE_IDS[0]]: [
    {
      intro: [
        N("Vous ressortez avec de quoi grignoter. Remerii s’arrête devant un étal de petites boîtes en bois et en soulève une dont le couvercle ferme mal."),
        H("Tu avais dit n’avoir besoin de rien."),
        R("Je n’ai besoin de rien."),
        H("Tu vas l’acheter pour la réparer."),
        R("Non."),
        N("Remerii repose la boîte, puis en prend une seconde. Hylee vous regarde ; vous attendez ensemble. Remerii lève les yeux et découvre le même sourire sur vos deux visages."),
        R("Je veux seulement savoir où elle accroche."),
        H("Évidemment."),
        N("Elle achète la première. Hylee ouvre son sachet pour la ranger ; Remerii retient doucement son poignet."),
        R("Il y a de la confiture dans celui-là."),
        H("Seulement d’un côté."),
        R("Le bois n’a pas besoin du second."),
        N("Elles repartent en discutant de la quantité exacte de confiture capable de ruiner un assemblage."),
      ],
      choices: [
        Q(
          "cross-hr-day-box",
          "Demander ce que la boîte contiendra une fois réparée.",
          "resonance",
          [
            R("Je n’en sais rien."),
            H("C’est bien. Ça laisse plus de possibilités qu’une liste."),
            N("Remerii reconnaît la phrase du départ. Son rire surprend Hylee, qui rit avec elle."),
            R("Je vous l’ai assez dit, je suppose."),
          ],
          { affection: 1, relationshipEffects: { remerii: { affection: 2 } } },
        ),
        Q(
          "cross-hr-day-conspiracy",
          "Les accuser de transformer une boîte bancale en aventure à trois.",
          "audace",
          [
            P("Je croyais que nous n’avions pas de programme. Nous voilà engagés dans une affaire de couvercle et de confiture."),
            H("Tu peux encore fuir."),
            R("Après avoir porté les provisions ? Ce serait irresponsable."),
            N("Elles vous reprennent chacune un paquet, puis continuent à marcher assez près pour que vos mains se heurtent entre les sacs."),
          ],
          { affection: 1, desire: 2, relationshipEffects: { remerii: { affection: 1, desire: 2 } } },
        ),
        Q(
          "cross-hr-day-dismiss",
          "Dire qu’un achat aussi banal ne mérite pas qu’on s’y attarde.",
          "lucidite",
          [
            R("Il me plaisait."),
            H("On avait justement la journée pour s’attarder."),
            N("Remerii garde la boîte contre elle. Vous ralentissez sans essayer de remplacer trop vite ce petit plaisir par une destination plus importante."),
          ],
          { relationshipEffects: { remerii: { affection: -2 } } },
        ),
      ],
    },
    {
      intro: [
        N("Plus tard, l’ombre gagne un banc au bord d’une place. Hylee s’assoit la première et attire Remerii près d’elle par le poignet. La boîte repose entre leurs genoux."),
        H("On n’a presque rien fait."),
        R("Tu as choisi trois fois à manger, contesté deux prix et failli acheter un ruban plus long que ton manteau."),
        H("Je pensais à quelque chose qu’on serait obligés de raconter ensuite."),
        N("Remerii retire du pouce une trace de sucre sur sa joue. Hylee garde sa main une seconde contre ses lèvres, puis embrasse sa paume sans théâtralité."),
        R("Alors non. Presque rien."),
        N("Vous vous asseyez au bord du banc. Hylee pousse le sachet avec son pied pour vous faire une place ; Remerii pose la boîte ailleurs afin que votre épaule puisse rejoindre les leurs."),
      ],
      choices: [
        {
          ...Q(
            "cross-hr-day-stay",
            "Prendre leurs mains et proposer de ne toujours rien prévoir.",
            "audace",
            [
              N("Hylee enlace vos doigts et pose un baiser sur votre joue. Remerii se penche vers elle avant qu’elle ne se retire ; leur baiser vous laisse le temps de les regarder rire contre la bouche de l’autre."),
              H("On pourrait continuer la journée comme ça."),
              R("Sur ce banc ?"),
              H("Tu avais dit que la chaise était toujours utilisable."),
              N("Remerii vous attire enfin dans leur mouvement. Le flirt accumulé au fil des rues cesse d’avoir besoin d’un programme pour avancer."),
            ],
            { affection: 2, desire: 4, relationshipEffects: { remerii: { affection: 2, desire: 4 } } },
          ),
          dateOutcome: "great",
        },
        {
          ...Q(
            "cross-hr-day-quiet",
            "Rester serrés en regardant passer la place.",
            "resonance",
            [
              N("Hylee appuie sa tête contre Remerii et garde votre main sur son genou. Remerii pose la sienne par-dessus."),
              H("Tu vois ? Presque rien."),
              R("Je commence à comprendre l’intérêt."),
              N("Lorsque l’ombre atteint vos chaussures, personne ne retire tout de suite ses doigts."),
            ],
            { trust: 2, desire: 2, relationshipEffects: { remerii: { trust: 2, desire: 2 } } },
          ),
          dateOutcome: "great",
        },
      ],
    },
  ],
  [HR_DATE_IDS[1]]: [
    {
      intro: [
        N("Le mur coupe presque tout le vent. Hylee déplie la couverture pendant que Remerii trouve une pierre lisse pour en retenir le coin. Vous vous occupez du second bord."),
        H("Cette fois, elle reste."),
        R("Attends au moins d’avoir lâché."),
        N("Hylee ouvre ses mains avec ostentation. Le tissu ne bouge pas ; elle s’incline devant Remerii, qui lui rend une révérence beaucoup trop sérieuse."),
        N("Remerii retire du panier une portion gardée à part."),
        R("Sans la sauce."),
        H("Tu t’en es souvenue."),
        R("Tu as protesté pendant tout le chemin la dernière fois."),
        H("Une seule fois, très longtemps."),
        N("Hylee touche son genou pour arrêter la liste, mais Remerii rit déjà. Elle lui donne le paquet entier."),
        P("Je peux goûter ce qui a mérité une dispute de plusieurs kilomètres ?"),
        H("Oui. Tu pourras témoigner."),
        R("Ne l’encouragez pas à réviser la durée."),
      ],
      choices: [
        Q(
          "cross-hr-wind-taste",
          "Goûter sans chercher à les départager.",
          "sangFroid",
          [
            P("Ça me plaît. Et je comprends qu’on en préfère moins."),
            H("On aurait dû t’avoir avec nous."),
            R("Pour qu’elle puisse protester auprès de quelqu’un d’autre ?"),
            H("Pour que nous ayons deux portions."),
            N("Remerii se sert plus légèrement. Hylee le remarque et pousse le pain à sa portée."),
          ],
          { affection: 1, relationshipEffects: { remerii: { affection: 1 } } },
        ),
        Q(
          "cross-hr-wind-memory",
          "Leur demander où les avait menées cette ancienne promenade.",
          "resonance",
          [
            H("J’avais suivi un sentier parce que je pensais reconnaître un arbre."),
            R("Nous avons reconnu beaucoup d’arbres ce jour-là."),
            H("Mais tu m’as laissée chercher."),
            R("Il faisait beau. Et tu avais besoin de trouver toi-même que nous étions perdues."),
            N("Hylee sourit et étend ses jambes contre les siennes pendant que le récit continue."),
          ],
          { trust: 2, relationshipEffects: { remerii: { trust: 1 } } },
        ),
        Q(
          "cross-hr-wind-tease",
          "Prétendre que vous refusez de témoigner sans être soudoyé par un baiser.",
          "audace",
          [
            H("Un seul ? Tu négocies mal."),
            N("Elle vous embrasse au coin des lèvres. Remerii prend le temps de ranger le paquet avant de venir chercher votre bouche, puis celle d’Hylee."),
            R("Témoignage désormais compromis."),
            H("Mais beaucoup plus intéressant."),
          ],
          { desire: 3, relationshipEffects: { remerii: { desire: 3 } } },
        ),
      ],
    },
    {
      intro: [
        N("Le repas terminé, une rafale contourne le mur. Remerii ouvre son manteau et Hylee se glisse contre son flanc avant même l’invitation."),
        H("Là, ça va."),
        R("Tu as les mains froides."),
        H("Seulement les doigts."),
        N("Remerii les prend sous le tissu. Hylee relève les yeux vers elle et l’embrasse, d’abord pour la surprendre, puis assez longtemps pour oublier la prochaine rafale."),
        N("Remerii vous tend un pan du manteau sans lâcher sa main. Vous vous rapprochez. Trois épaules tiennent dans un vêtement prévu pour une seule personne à condition de renoncer à toute distance raisonnable."),
        H("La prochaine fois, je prends un manteau plus grand."),
        R("La prochaine fois, tu prétendras encore que celui-ci suffit."),
        P("Il suffit pour l’instant."),
      ],
      choices: [
        {
          ...Q(
            "cross-hr-wind-kiss",
            "Les embrasser sans quitter la chaleur du manteau.",
            "audace",
            [
              N("Hylee se tourne vers vous la première. Le vent ramène une mèche sur vos lèvres ; Remerii la dégage en riant, puis vous embrasse à son tour."),
              N("Hylee rejoint ce second baiser au lieu d’attendre. Ses doigts restent mêlés à ceux de Remerii sous le manteau tandis que votre main trouve leurs deux tailles."),
              R("Nous allons devoir marcher pour nous réchauffer."),
              H("Dans un moment."),
              N("Le froid n’a pas disparu. Il rend seulement la chaleur de vos corps trop précise pour être ignorée."),
            ],
            { affection: 2, desire: 5, relationshipEffects: { remerii: { affection: 2, desire: 5 } } },
          ),
          dateOutcome: "great",
        },
        {
          ...Q(
            "cross-hr-wind-return",
            "Reprendre lentement le chemin en restant serrés.",
            "resonance",
            [
              N("Vous marchez à trois sous le même manteau jusqu’à ce que le sentier exige de vous séparer. Hylee garde la main de Remerii ; celle-ci retient votre manche."),
              H("Une boisson chaude en rentrant."),
              R("Et le reste du pain."),
              P("Sans nouvelle dispute sur la sauce ?"),
              N("Elles refusent de promettre. Le désir vous suit tout de même jusqu’aux premières lumières."),
            ],
            { trust: 2, desire: 3, relationshipEffects: { remerii: { trust: 2, desire: 3 } } },
          ),
          dateOutcome: "great",
        },
      ],
    },
  ],
  [HR_DATE_IDS[2]]: [
    {
      intro: [
        N("Les plats se vident lentement. Hylee se lève pour reprendre de l’eau ; Remerii tourne déjà son verre pour lui laisser passer le bras."),
        P("Vous faites souvent ça ?"),
        H("Répondre avant la fin de la question ?"),
        R("Certainement."),
        H("Partager une table aussi. Ça finit par se voir."),
        N("Hylee verse moins d’eau à Remerii, qui n’en demande jamais davantage le soir. Remerii pousse vers elle le dernier morceau de ce qu’elle préfère."),
        H("C’est agréable de pouvoir rester sans attendre qu’on débarrasse autour de nous."),
        R("Nous pourrions tout de même débarrasser ici."),
        H("Je pensais après."),
        N("Remerii se rassoit. Autour d’elles, votre vaisselle, la lumière choisie et les objets exposés donnent au mot « rester » une réalité que les sorties publiques n’avaient pas."),
      ],
      choices: [
        Q(
          "cross-hr-home-place",
          "Leur montrer l’endroit où vous vous installez quand vous êtes seul.",
          "resonance",
          [
            N("Hylee s’y rend, s’arrête avant de s’asseoir et vous demande la permission d’un regard. Remerii apporte les verres pendant que vous rapprochez un troisième siège."),
            R("Je comprends. La lumière vient du bon côté."),
            H("Et depuis la table, on peut te voir quand tu parles."),
            N("Elles apprennent votre place sans la prendre entièrement."),
          ],
          { affection: 2, relationshipEffects: { remerii: { affection: 2 } } },
        ),
        Q(
          "cross-hr-home-clear",
          "Ranger ensemble pour transformer la pièce après le repas.",
          "lucidite",
          [
            N("Vous emportez les assiettes. Hylee essuie ; Remerii retrouve les places que vous lui indiquez sans réorganiser les étagères."),
            H("La prochaine fois, je te ferai goûter l’autre plat."),
            R("Tu n’as pas encore demandé si nous pouvions revenir."),
            N("Elles vous regardent en même temps. La question est taquine, mais la possibilité compte vraiment."),
          ],
          { trust: 2, relationshipEffects: { remerii: { trust: 2 } } },
        ),
        Q(
          "cross-hr-home-future",
          "Parler déjà de la manière dont elles pourraient vivre ici.",
          "audace",
          [
            H("On est venues passer une soirée."),
            R("Laissez-nous d’abord la finir."),
            P("Je suis allé trop vite."),
            N("Remerii acquiesce. Hylee reprend son verre et choisit elle-même l’endroit où s’asseoir près de vous deux."),
          ],
          { trust: -2, relationshipEffects: { remerii: { trust: -2 } } },
        ),
      ],
    },
    {
      intro: [
        N("La conversation ralentit. Hylee a retiré ses chaussures et replié les jambes sur le canapé. Remerii pousse les lacets hors du passage avant de s’asseoir près d’elle."),
        H("Tu tires sur ton col depuis le dessert."),
        R("L’attache s’est prise dans mes cheveux."),
        H("Tourne."),
        N("Remerii obéit sans protester. Hylee dégage le petit nœud à la lumière de votre lampe et garde sa main sur sa nuque après que l’attache a cédé."),
        R("Mieux."),
        N("Remerii tourne la tête et embrasse l’intérieur de son poignet. Hylee se penche vers sa bouche ; leur baiser appartient à leur histoire avant de s’ouvrir vers vous."),
        N("Vous baissez la lumière. Hylee avance votre siège au lieu de vous appeler au centre ; Remerii vous tend la main depuis le canapé."),
        H("On peut encore parler."),
        R("Ou apprendre à nous taire à trois."),
        N("Personne ne regarde la porte. Les manteaux sont restés là où vous leur aviez fait une place."),
      ],
      choices: [
        {
          ...Q(
            "cross-hr-home-close",
            "Fermer les rideaux et les rejoindre sur le canapé.",
            "audace",
            [
              N("Le dernier reflet de la rue disparaît. Hylee vous attire par la main ; Remerii recule pour vous ouvrir une place sans quitter la chaleur de son corps."),
              H("Ton canapé est vraiment trop petit."),
              P("Vous pouvez encore récupérer vos manteaux."),
              R("Ce serait une solution très peu convaincante."),
              N("Hylee embrasse Remerii pour approuver, puis revient vers vous. La pièce, le repas encore présent dans l’air et les vêtements laissés près de la porte conduisent naturellement la soirée vers une intimité qui ne ressemble à aucun lieu emprunté."),
            ],
            { affection: 2, desire: 5, relationshipEffects: { remerii: { affection: 2, desire: 5 } } },
          ),
          dateOutcome: "great",
        },
        {
          ...Q(
            "cross-hr-home-rest",
            "Partager une couverture et laisser la soirée finir doucement.",
            "sangFroid",
            [
              H("Ça me va. Je commençais à perdre les mots."),
              R("Tu n’en as pas perdu tant que cela."),
              N("Hylee lui donne un léger coup d’épaule et s’y appuie. Remerii vous réserve le bord de la couverture."),
              N("Quand il faut enfin se lever, leurs manteaux sont toujours près du vôtre. Elles partent sans urgence et la possibilité de revenir demeure entière."),
            ],
            { trust: 2, affection: 1, relationshipEffects: { remerii: { trust: 2, affection: 1 } } },
          ),
          dateOutcome: "good",
        },
      ],
    },
  ],
};

type HRDateGame = {
  day: number;
  flags: string[];
  groupDateHistory: string[];
  housing: { propertyId?: string };
  relationships: Record<string, { stage: number; affection: number; trust: number; desire?: number }>;
  crossQuestSeries: Record<string, CrossQuestProgress>;
  settings?: { unlockAll?: boolean };
};

export type HRDateVisibility = {
  visible: boolean;
  unlocked: boolean;
  status: "hidden" | "available" | "decision" | "waiting" | "locked" | "unavailable";
  reason?: string;
};

export function hrDateVisibility(date: GroupDateScene, game: HRDateGame): HRDateVisibility {
  const progress = game.crossQuestSeries[HR_KEY];
  if (game.settings?.unlockAll) return { visible: true, unlocked: true, status: "available" };
  if (!progress || progress.stage < 7 || !progress.hr) {
    return { visible: false, unlocked: false, status: "hidden" };
  }

  const hr = progress.hr;
  const accepted = hrTriadAccepted(progress, {
    flags: game.flags,
    groupDateHistory: game.groupDateHistory,
  });
  if (hr.branch !== "double") {
    return {
      visible: true,
      unlocked: false,
      status: "unavailable",
      reason: "Cette chronologie n’a pas ouvert de relation à trois. Les liens individuels avec Hylee et Remerii restent disponibles.",
    };
  }
  if (!accepted && !hr.configuration) {
    return {
      visible: true,
      unlocked: false,
      status: "decision",
      reason: "Hylee et Remerii souhaitent reparler avec vous de ce que pourrait devenir votre relation. Retrouvez « Une place à la table » dans les Quêtes croisées.",
    };
  }
  if (hr.configuration === "waiting") {
    const sameDay = game.day <= (hr.recognitionDay || 0);
    return {
      visible: true,
      unlocked: false,
      status: sameDay ? "waiting" : "decision",
      reason: sameDay
        ? "Vous avez demandé du temps. La conversation pourra reprendre à partir du jour suivant."
        : "Vous avez demandé du temps. « Une place à la table » peut maintenant être reprise dans les Quêtes croisées.",
    };
  }
  if (hr.configuration === "separate" || hr.configuration === "refused") {
    return {
      visible: true,
      unlocked: false,
      status: "unavailable",
      reason: hr.configuration === "separate"
        ? "Vous avez choisi de poursuivre vos relations séparément. Ce rendez-vous n’est pas accessible dans cette branche narrative."
        : "Vous avez refusé les rendez-vous à trois. Ce contenu reste visible pour rappeler la conséquence de ce choix.",
    };
  }
  if (!accepted && !game.flags.includes(HR_OPEN)) {
    return {
      visible: true,
      unlocked: false,
      status: "decision",
      reason: "La dynamique à trois n’a pas encore été acceptée dans « Une place à la table ».",
    };
  }

  if (date.afterDates?.some((id) => !game.groupDateHistory.includes(id))) {
    return {
      visible: true,
      unlocked: false,
      status: "locked",
      reason: date.home
        ? "Les deux premières sorties doivent être accomplies avant « La porte fermée »."
        : "« Une journée sans programme » doit être vécue avant cette promenade.",
    };
  }
  if (date.home && !game.housing.propertyId) {
    return {
      visible: true,
      unlocked: false,
      status: "locked",
      reason: "Les deux premières sorties sont accomplies. Achetez un logis pour pouvoir proposer « La porte fermée ».",
    };
  }
  if (date.characters.some((id) => {
    const relation = game.relationships[id];
    return !relation
      || relation.stage < date.minStage
      || relation.affection < date.minAffection
      || relation.trust < date.minTrust;
  })) {
    return {
      visible: true,
      unlocked: false,
      status: "locked",
      reason: "Votre relation avec Hylee ou Remerii doit encore évoluer avant une première sortie à trois.",
    };
  }
  return { visible: true, unlocked: true, status: "available" };
}

export function hrDateReason(date: GroupDateScene, game: HRDateGame) {
  return hrDateVisibility(date, game).reason;
}

export function hrDatesVisible(game: HRDateGame) {
  return HR_DATES.some((date) => hrDateVisibility(date, game).visible);
}
