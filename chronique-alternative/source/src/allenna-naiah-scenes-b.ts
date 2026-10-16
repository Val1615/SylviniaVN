import { AL, C, NA, ONLY_ALLENNA, P, T, TRIO, W } from "./allenna-naiah-kit";
import { AN_SCENE_BUILDERS_A, picked, type ANSceneContext, type ANSceneData } from "./allenna-naiah-scenes";

/**
 * Q5 à Q7 et moments libres. Tellia est un nom sur un bordereau : aucun genre,
 * aucun rang, aucun pouvoir, aucun lien démontré avec Alamma. Les répliques
 * ne lui attribuent jamais de pronom.
 */

/** Texte exact du bordereau (réutilisé par le dossier et le validateur). */
export const AN_BORDEREAU = {
  title: "Bordereau de dérivation",
  reference: "Liasse des transits, feuillet sans cote ; mois effacé, « …e lune, quatrième nuit ».",
  body: "Dérivation secondaire reçue sur la ligne nord, ancrage retourné, charge sortie hors inventaire et déclarée rebut. Copie à l’attention de Tellia.",
  rune: "Sous la mention de copie, une rune secondaire tracée à l’envers, reliée à la précédente par un trait supplémentaire qu’aucun manuel de la Cité ne décrit.",
  established: ["Le bordereau appartient au même circuit que les manifestes falsifiés.", "La modification de l’ancrage a eu lieu après la destruction annoncée du leurre."],
  probable: ["Une seconde main a modifié le circuit après coup.", "Cette main dispose d’un savoir démonologique avancé."],
  unverified: ["L’identité réelle derrière le nom de Tellia.", "Le lien entre ce nom et la modification.", "La présence de cette personne dans la Cité."],
} as const;

/* Q5 · Une seconde main */

function q5(ctx: ANSceneContext): ANSceneData {
  const transmission = Boolean(ctx.mini?.transmission);
  return {
    id: "cross-an-05", title: "Une seconde main", location: "akuhn", spot: "akuhn-archives", cast: TRIO, music: "tension", character: "naiah", period: "nuit",
    background: "/assets/backgrounds/deep_archives.webp",
    intro: [
      T("L’ancienne citerne sous le quartier des fondateurs sert de dépôt à des caisses que personne ne réclame. L’eau s’en est retirée depuis un siècle ; ses parois en gardent encore le niveau, une ligne pâle à hauteur de poitrine.", TRIO),
      T("Allenna soulève le couvercle d’une caisse marquée rebut. Dedans, des pierres d’étalonnage étouffées sous un drap, intactes, et une liasse attachée par une ficelle de chanvre neuve."),
      AL("Rebut. Détruit. Signé d’un officier mort depuis huit mois. Et rangé avec soin dans une citerne que les plans ne mentionnent plus.", "stern"),
      NA("Ta ville range ses mensonges mieux que ses archives.", "neutral"),
      T("Au milieu de la liasse, un feuillet plus petit, sans cote. Le papier est de bonne qualité ; l’encre, pâle, presque grise. Allenna le lit à voix haute, puis le relit en silence."),
      AL("« Bordereau de dérivation. Dérivation secondaire reçue sur la ligne nord, ancrage retourné, charge sortie hors inventaire et déclarée rebut. Copie à l’attention de Tellia. »", "thinking"),
      T("Le nom reste suspendu sous les voûtes. Naïah ne dit rien. Elle approche le visage du feuillet, si près que son souffle en fait trembler le coin."),
      NA("Ce trait-là. Sous le nom. La rune est tracée à l’envers, et quelqu’un l’a reliée à la précédente avec un trait de plus. Je n’ai jamais vu ce geste dans un manuel.", "thinking"),
      NA("Ce geste ne recopie pas une formule ; il la réécrit. Il faut un savoir démonologique très avancé pour retourner un ancrage sans le briser.", "neutral"),
      AL("Il n’existe aucune Tellia parmi les officiers de transit que je connais. Ni dans les relèves, ni dans les signatures de cette aile.", "thinking"),
      AL("Ça ne prouve rien. Une absence dans mes listes ne vaut pas une absence dans la Cité.", "stern"),
      W(transmission,
        P("Le circuit transmettait sans tout comprendre de ce qu’il transmettait. Ce bordereau est le premier papier qui sache où allait la charge."),
        P("Tout le reste du circuit faisait passer des charges. Ce papier est le seul qui parle à quelqu’un.")),
      T("Naïah se redresse. Elle n’a pas souri depuis l’entrée de la citerne, et vous vous en apercevez seulement maintenant."),
      NA("Une seconde main a pris le leurre d’Alamma et lui a appris un autre tour. Je ne sais pas encore si c’est pour le servir ou pour s’en servir.", "sad"),
    ],
    choices: [
      C("cross-an-05-copie", "Recopier le bordereau à la main, en reproduisant le geste de la rune trait pour trait", "lucidite", [
        P("Je le recopie. Tout, même le trait en trop. Naïah, tu me corriges si je me trompe de sens."),
        T("Vous recopiez lentement. Naïah guide votre poignet du bout d’un fil de brume au moment du trait retourné, sans jamais toucher votre peau."),
        NA("Là. Tu viens d’écrire une chose que personne ne devrait savoir écrire. Range-la bien.", "neutral"),
        AL("Et l’original reste ici. S’il disparaît, nous saurons que quelqu’un surveille cette citerne.", "stern"),
      ], { al: { trust: 2 }, na: { trust: 2 }, flags: ["an-q5:copie"] }),
      C("cross-an-05-scelle", "Laisser l’original et emporter une copie scellée par Allenna", "sangFroid", [
        P("L’original reste à sa place. Allenna, vous faites une copie et vous la scellez. Votre sceau vaudra témoignage."),
        AL("Mon sceau m’engage. Je le pose quand même.", "neutral"),
        T("Elle recopie le bordereau d’une écriture militaire et appose son sceau à la cire verte. Naïah la regarde faire avec une attention étrange, presque douce."),
        NA("Tu viens de signer pour moi. Tu t’en rends compte ?", "thinking"),
        AL("J’ai signé pour un document.", "neutral"),
      ], { al: { trust: 2, affection: 1 }, na: { trust: 1 }, bond: 1, flags: ["an-q5:scelle"] }),
      C("cross-an-05-brume", "Demander à Naïah de garder l’empreinte du trait dans une brume qu’elle seule sait rappeler", "resonance", [
        P("Garde le trait dans ta brume. Une copie peut se voler ; ta mémoire, beaucoup moins."),
        NA("Tu me confies un secret au lieu de me le cacher. C’est très imprudent. Merci.", "smirk"),
        T("Une volute s’élève du feuillet, prend la forme exacte de la rune, puis se replie dans la paume de Naïah comme un oiseau qui rentre au nid. Vous recopiez quand même le texte, par principe."),
        AL("Deux copies. Une dans votre poche, l’autre dans la main de ma sœur. Je n’aurais jamais cru écrire ce rapport.", "smirk"),
      ], { na: { trust: 3, affection: 1 }, flags: ["an-q5:brume"] }),
    ],
    beats: [{
      intro: [
        T("Vous pliez la copie en quatre. Elle pèse presque rien. Elle vous semble pourtant tirer votre poche vers le bas."),
        AL("Nous ne disons ce nom à personne. Ni à la cour, ni au conseil, ni à Draven. Tant que nous ignorons qui le porte, il est plus dangereux dit que gardé.", "stern"),
        NA("Pour une fois, ma sœur et moi sommes d’accord. Note la date, quelqu’un.", "neutral"),
      ],
      choices: [
        C("cross-an-05-taire", "Promettre le silence, et tenir un registre privé de qui sait quoi", "sangFroid", [
          P("Je garde le nom. Et je note qui le connaît : nous trois. Si une quatrième personne le prononce, on saura qu’il a fui."),
          AL("Un registre des secrets. Vous me plaisez de plus en plus, ce soir.", "smile"),
        ], { al: { trust: 1, affection: 1 } }),
        C("cross-an-05-question", "Poser une seule question à voix haute : à qui ce bordereau devait-il servir ?", "lucidite", [
          P("Une copie « à l’attention de ». Ça veut dire que quelqu’un rend des comptes. À qui, et pourquoi ?"),
          NA("Voilà la question qui va m’empêcher de dormir. Je te déteste un peu.", "thinking"),
        ], { na: { trust: 1 } }),
      ],
    }],
  };
}

/* Q6 · Les portes se referment */

function q6(ctx: ANSceneContext): ANSceneData {
  const scelle = picked(ctx, "cross-an-05-scelle");
  return {
    id: "cross-an-06", title: "Les portes se referment", location: "akuhn", spot: "akuhn-archives", cast: TRIO, music: "infiltration", character: "allenna", period: "aube",
    intro: [
      T("Des pas, deux niveaux au-dessus. Puis une voix d’archiviste qui demande, beaucoup trop tôt, la liasse des transits du dernier trimestre.", TRIO),
      AL("Personne ne demande ce registre. Personne. Depuis des années.", "stern"),
      T("Vous retournez vers la table. Le relevé de garde que vous aviez posé sur le coin a disparu. À sa place, une goutte de cire fraîche, encore molle."),
      NA("Quelqu’un efface derrière nous. Pas loin. Pas pressé, ce qui est pire.", "angry"),
      AL("La relève de l’escalier palatial a été doublée cette nuit, sur mon ordre. Personne de la cour ne descendra par là. Mais un archiviste, oui.", "neutral"),
      W(scelle,
        T("Allenna tâte la copie scellée sous son plastron, puis vous regarde. Elle ne vous demande rien. Elle vérifie seulement que vous êtes toujours là."),
        T("Allenna fait l’inventaire de vos poches d’un seul regard, comme une intendante de campagne avant le départ.")),
      NA("La pierre d’étalonnage étouffée. Si on la laisse, demain elle sera brisée pour de vrai, et toute la piste avec.", "angry"),
      AL("Si on l’emporte, nous sortons de la Cité avec une preuve volée sous le bras et une bannie à côté.", "stern"),
    ],
    choices: [
      C("cross-an-06-originaux", "Emporter les originaux, pierre comprise, et accepter le risque d’une sortie plus lente", "audace", [
        P("On prend la pierre. Sans elle, demain, il ne restera que nos souvenirs contre leurs registres."),
        T("Allenna enveloppe la pierre dans sa cape d’officier et la porte elle-même, à deux bras, sans un mot. Naïah prend les devants dans le couloir du four froid."),
        NA("Gauche. Gauche. Arrête-toi. Maintenant droite.", "neutral"),
        T("Elle guide chaque pas à l’oreille, devinant les gardes à leur souffle derrière les portes. Allenna obéit sans discuter, et ce simple fait vous serre la gorge."),
        AL("Elle a toujours entendu mieux que moi. Je ne le lui avais jamais dit.", "troubled"),
        NA("Tu viens de le dire. Je l’enregistre.", "smirk"),
      ], { al: { trust: 2 }, na: { trust: 2 }, bond: 2, flags: ["an-q6:originaux"] }),
      C("cross-an-06-sources", "Protéger les sources : laisser les pièces, emporter les copies, effacer seulement vos propres traces", "sangFroid", [
        P("Les pièces restent. On emporte nos copies, on efface nos empreintes, et on laisse leur nettoyeur faire son travail en croyant qu’il nous devance."),
        AL("Il saura qu’on est passés.", "thinking"),
        P("Il saura que quelqu’un est passé. Il ne saura pas ce qu’on a vu."),
        T("Allenna remet chaque registre à sa place exacte, au doigt près. Naïah souffle sur la table une brume qui emporte la poussière de vos coudes."),
        NA("Le ménage le plus soigné de ma vie. Si Lineva voyait ça, elle encadrerait la table.", "laugh"),
        AL("Elle te ferait recommencer les coins.", "smirk"),
      ], { al: { trust: 2 }, na: { trust: 1 }, bond: 1, flags: ["an-q6:sources"] }),
      C("cross-an-06-diversion", "Créer une diversion et sortir avec une preuve fragmentaire : un éclat de la pierre étouffée", "lucidite", [
        P("Un éclat suffit à prouver qu’elle a été étouffée. Naïah, une seule lueur au bout de l’aile. Allenna, vous montez accueillir l’archiviste."),
        T("Naïah allume une brume verte au fond des rayonnages, à l’opposé de la sortie. L’archiviste s’y précipite. Allenna l’y rejoint, sévère, et lui demande ce qu’il fait là à cette heure."),
        T("Vous détachez un éclat de la pierre, gros comme une phalange, et le glissez dans votre poche à côté de la copie."),
        AL("Il m’a juré qu’il cherchait ses lunettes. Il les avait sur le nez.", "stern"),
        NA("J’aime cette ville. Elle ment très mal quand on la surprend.", "laugh"),
      ], { al: { trust: 1, affection: 1 }, na: { affection: 2 }, flags: ["an-q6:diversion"] }),
    ],
    beats: [{
      intro: [
        T("La poterne. L’air froid du ruisseau. Puis la route de l’aube, qui sent la cendre des fourneaux et l’herbe mouillée. Personne ne parle avant que les murs noirs deviennent une ligne derrière vous."),
        T("À la lisière, le brasero du poste est éteint. Naïah s’arrête sur la frontière du sol damé, exactement là où elle se tenait deux nuits plus tôt.", TRIO),
        NA("La rune du linteau. Elle dormait encore quand on est ressortis. Je l’ai vérifié en passant, sans toucher. Tu vois que j’écoute, commandante.", "neutral"),
        AL("Je vois.", "neutral"),
        T("Allenna ôte ses gantelets, les accroche à sa ceinture, et reste un moment à regarder ses mains comme si elles venaient de faire quelque chose qu’elle n’a pas encore classé."),
      ],
      choices: [
        C("cross-an-06-silence", "Laisser le silence durer, sans rien ajouter", "sangFroid", [
          T("Vous ne dites rien. Le jour monte. Naïah s’assoit dans l’herbe du côté de la forêt ; Allenna, après une hésitation, s’assoit sur le banc, du côté de la Cité. Entre elles, une ligne de terre battue de la largeur d’une main."),
          T("Aucune des deux ne la franchit. Aucune des deux ne s’en va."),
        ], { al: { affection: 1 }, na: { affection: 1 }, bond: 1 }),
        C("cross-an-06-merci", "Remercier chacune pour le geste précis qui vous a sortis de là", "audace", [
          P("Allenna, la relève doublée. Naïah, tes pas comptés dans le noir. Sans l’une ou l’autre, on dormait en cellule."),
          AL("Vous comptez les mérites comme des munitions.", "smirk"),
          NA("Toi, tu tiens les comptes. Moi, je garde les intérêts.", "laugh"),
        ], { al: { affection: 1, trust: 1 }, na: { affection: 1 } }),
      ],
    }],
  };
}

/* Q7 · Une route pour revenir */

export const AN_Q7_CHOICES = ["cross-an-07-partenariat", "cross-an-07-confiance", "cross-an-07-complicite"] as const;

function q7(ctx: ANSceneContext): ANSceneData {
  const transmission = Boolean(ctx.mini?.transmission);
  const originaux = picked(ctx, "cross-an-06-originaux");
  return {
    id: "cross-an-07", title: "Une route pour revenir", location: "forbidden", spot: "forbidden-sanctuary", cast: TRIO, music: "wild-calm", character: "naiah", period: "soirée",
    intro: [
      T("Le sanctuaire de Naïah tient dans une clairière qu’aucune carte obscurcie ne dessine. Des lucioles y dorment le jour sous les champignons violets ; le soir, elles se lèvent toutes ensemble, comme si quelqu’un avait soufflé sur des braises.", TRIO),
      T("Allenna est venue seule, sans uniforme, une besace de toile sur l’épaule. Elle s’est arrêtée trois fois sur le chemin, vous l’avez vu, sans jamais faire demi-tour."),
      NA("Elle est entrée dans ma forêt. Personne ne meurt. Je suis presque déçue.", "smirk"),
      AL("La journée n’est pas finie.", "smirk"),
      T("Sur une souche plate, vous étalez ce que la nuit d’Akuhn’Nabad vous a laissé. Le relevé, la copie du bordereau, les horaires de garde, et la liste qu’Allenna a établie en trois colonnes."),
      AL("Établi : la signature principale est celle d’Alamma. Le circuit de transit a été détourné par des opérations clandestines liées à ses agents. Rien ne remonte à un ordre d’Amanea.", "neutral"),
      NA("Elle a dit « rien ne remonte » et pas « elle est innocente ». J’apprécie la nuance. Je la garde pour mes jours de rancune.", "thinking"),
      W(transmission,
        AL("Probable : le circuit transmettait sans finalité propre. Une seconde main l’a modifié après la destruction du leurre, avec un savoir que je ne possède pas.", "thinking"),
        AL("Probable : une seconde main a modifié le circuit après la destruction du leurre, avec un savoir que je ne possède pas.", "thinking")),
      AL("Non vérifié : qui porte le nom de Tellia, et si ce nom désigne seulement une personne.", "stern"),
      W(originaux,
        T("La pierre étouffée repose au milieu de la clairière, dans la cape d’Allenna. Naïah a posé dessus un caillou rond, comme sur une tombe minuscule."),
        T("L’éclat de pierre, ou ce qui en tient lieu, est passé de main en main toute la soirée. Personne ne l’a encore rangé.")),
      NA("Et maintenant ? On se serre la main ? On jure ? Tu ne vas pas me demander de signer un registre, j’espère.", "smirk"),
      T("Allenna regarde sa sœur. Puis vous. Puis, longuement, la lisière des lucioles."),
    ],
    choices: [
      C(AN_Q7_CHOICES[0], "Proposer un partenariat prudent : un canal, des règles, et aucune promesse qu’on ne puisse tenir", "sangFroid", [
        P("Un canal discret entre vous deux. Des règles écrites. Et la liberté de dire non sans perdre l’autre."),
        AL("Un message par lune, par la brume ou par la patrouille. Chacune répond quand elle le peut, pas quand l’autre l’exige.", "neutral"),
        NA("Tu vas organiser notre relation comme une relève de garde.", "smirk"),
        AL("Oui. Ça tient.", "neutral"),
        NA("…Ça tient.", "neutral"),
      ], { al: { trust: 3 }, na: { trust: 3 }, bond: 1, flags: ["an-orientation:partenariat"] }),
      C(AN_Q7_CHOICES[1], "Parier sur la confiance professionnelle : se revoir pour travailler, et laisser le reste venir s’il veut", "lucidite", [
        P("Vous travaillez bien ensemble. Personne ne vous demande de vous aimer d’un coup. Revoyez-vous pour les traces et les registres ; le reste suivra son chemin."),
        NA("Tu nous offres un prétexte. Très élégant. J’accepte le prétexte.", "laugh"),
        AL("Je reviendrai à la lisière avec les relevés de la prochaine relève. Pour l’enquête.", "neutral"),
        NA("Pour l’enquête, évidemment. Apporte aussi le pain que tu ne sais pas cuire.", "smirk"),
      ], { al: { trust: 2, affection: 1 }, na: { trust: 2, affection: 1 }, bond: 1, flags: ["an-orientation:confiance"] }),
      C(AN_Q7_CHOICES[2], "Ouvrir une complicité privée : à trois, hors des registres, quand vous le voudrez toutes les deux", "audace", [
        P("Pas seulement l’enquête. Des soirées comme celle-ci, à trois, hors des registres. Quand vous en avez envie toutes les deux, et seulement dans ce cas."),
        T("Le silence dure assez pour que trois lucioles se posent sur la besace d’Allenna."),
        AL("Je ne sais pas faire ça.", "shy"),
        NA("Moi non plus. On sera mauvaises ensemble. C’est déjà un début.", "laugh"),
        T("Allenna ouvre sa besace. Dedans, un pain trop cuit, un bocal de quelque chose de vert et deux tasses de fer. Elle en tend une à sa sœur sans la regarder."),
      ], { al: { affection: 3, trust: 1 }, na: { affection: 3, trust: 1 }, bond: 2, flags: ["an-orientation:complicite"] }),
    ],
    beats: [{
      intro: [
        T("Plus tard, quand les lucioles sont toutes levées, Naïah se met à nommer les champignons de la clairière, un par un, avec des noms qu’elle invente visiblement à mesure. Allenna corrige l’orthographe de noms qui n’existent pas."),
        AL("Vous restez quelques jours dans la région ?", "neutral"),
        NA("Elle te demande si tu veux nous revoir. En langage d’intendance.", "smirk"),
        T("Trois chemins vous viennent à l’esprit : le lac de brume que Naïah a mentionné tout à l’heure, la halte du Fleuve bleu où Allenna fait reposer ses chevaux, et votre propre seuil, qui n’a encore jamais reçu les deux sœurs en même temps."),
      ],
      choices: [
        C("cross-an-07-oui", "Répondre oui, simplement, et leur laisser choisir le premier lieu", "audace", [
          P("Oui. Où vous voudrez, quand vous voudrez. À trois."),
          AL("Alors je proposerai un lieu. Ma sœur en proposera un autre. Et nous nous disputerons.", "smile"),
          NA("Enfin une perspective réjouissante.", "laugh"),
        ], { al: { affection: 1 }, na: { affection: 1 } }),
        C("cross-an-07-lent", "Proposer d’aller lentement : un rendez-vous à la fois, et de vraies pauses entre", "sangFroid", [
          P("Un rendez-vous à la fois. Avec du temps entre, pour que chacune sache si elle a envie du suivant."),
          AL("Vous ménagez les forces de la troupe.", "smile"),
          NA("C’est surtout la tienne qu’on ménage, commandante.", "smirk"),
        ], { al: { trust: 1 }, na: { trust: 1 } }),
      ],
    }],
  };
}

/* Moments libres (section 9 du pack) */

function m1(ctx: ANSceneContext): ANSceneData {
  const complicite = ctx.flags.includes("an-orientation:complicite");
  return {
    id: "cross-an-m1", title: "La carte corrigée", location: "forbidden", spot: "forbidden-threshold", cast: TRIO, music: "wild-calm", character: "allenna", period: "après-midi",
    intro: [
      T("Allenna a déroulé une carte de patrouille sur le banc du poste. Naïah, assise côté forêt, la redessine à distance avec un fil de brume violette qui laisse des flèches partout où il passe.", TRIO),
      AL("Ce sentier n’existe pas.", "stern"),
      NA("Il existe depuis ce matin. Je l’ai fait pousser pour toi.", "smirk"),
      AL("Tu ne peux pas faire pousser un sentier.", "stern"),
      NA("Je peux le convaincre. C’est presque pareil.", "laugh"),
      W(complicite,
        T("Allenna tente de garder son sérieux. Elle échoue d’un quart de seconde, ce qui, chez elle, ressemble beaucoup à un éclat de rire."),
        T("Allenna fronce les sourcils, mais elle reporte le sentier sur sa carte au crayon, en pointillés, ce qui chez elle équivaut à une reddition.")),
    ],
    choices: [
      C("cross-an-m1-question", "Demander à Naïah où mène vraiment ce sentier", "lucidite", [
        P("Il mène où, ton sentier ?"),
        NA("Au ruisseau où elle venait se cacher quand on était petites et qu’elle avait raté une leçon d’épée. Elle croyait que personne ne le savait.", "smirk"),
        AL("…Je le reporte en trait plein.", "shy"),
      ], { al: { affection: 1 }, na: { affection: 1 }, bond: 1 }),
      C("cross-an-m1-taire", "Ne pas intervenir, et les regarder se disputer", "sangFroid", [
        T("Vous croisez les bras et laissez la dispute suivre son cours. Elle dure longtemps, s’égare sur trois sujets, revient au sentier, et se termine sans vainqueur, par un silence presque confortable."),
        NA("Tu n’as rien dit de toute l’après-midi. C’était très reposant.", "neutral"),
      ], { na: { trust: 1 }, al: { trust: 1 }, bond: 1 }),
      C("cross-an-m1-pari", "Proposer un pari : vous allez marcher le sentier tous les trois, et la perdante cuisine", "audace", [
        P("On le marche. S’il existe, Allenna cuisine. S’il n’existe pas, Naïah cuisine."),
        NA("C’est un piège. Si je gagne, elle cuisine, et nous mourons tous.", "laugh"),
        AL("Ma cuisine nourrit des régiments.", "stern"),
        NA("Elle les nourrit, oui. Personne n’a parlé de les réjouir.", "smirk"),
      ], { al: { affection: 1 }, na: { affection: 2 } }),
    ],
    beats: [],
  };
}

function m2(_ctx: ANSceneContext): ANSceneData {
  return {
    id: "cross-an-m2", title: "La pierre à aiguiser", location: "forbidden", spot: "forbidden-crossroads", cast: TRIO, music: "forbidden", character: "naiah", period: "crépuscule",
    intro: [
      T("Au carrefour des brumes, Allenna sort de sa poche une petite pierre à aiguiser grise, polie par l’usage, et la pose sur une racine entre elle et sa sœur. Elle ne dit pas qu’il s’agit d’un cadeau.", TRIO),
      AL("Ta lame. Tu la fais tourner depuis trois rencontres. Le fil est mort.", "neutral"),
      NA("Mon couteau va très bien, merci.", "neutral"),
      AL("Il coupe le pain comme un regret.", "stern"),
      T("Naïah prend la pierre. Elle la soupèse longtemps, puis passe la lame dessus, mal, trop vite. Allenna se penche, corrige l’angle d’un doigt, sans toucher sa main."),
      NA("Tu m’apprends à aiguiser. Après tout ce temps. C’est absurde.", "sad"),
      AL("Tu m’as appris à écouter des pierres. Nous sommes quittes.", "neutral"),
    ],
    choices: [
      C("cross-an-m2-essayer", "Demander à essayer à votre tour, sous leurs deux regards", "audace", [
        P("Montrez-moi. J’ai les mains les moins habiles de nous trois, autant le prouver devant témoins."),
        T("Vous ratez l’angle. Deux voix vous corrigent en même temps, en des termes contradictoires, puis se taisent, surprises de s’être répondu."),
        NA("Elle dit « plus bas ». Je dis « plus doux ». On a raison toutes les deux.", "laugh"),
      ], { al: { affection: 1 }, na: { affection: 1 }, bond: 1 }),
      C("cross-an-m2-ecouter", "Rester en retrait et écouter le chant régulier de la lame", "sangFroid", [
        T("Vous vous asseyez contre un tronc. Le chuintement de la pierre s’installe, régulier, presque musical. À un moment, Naïah fredonne un air d’enfance. Allenna ne la reprend pas ; elle bat la mesure du pouce."),
      ], { al: { trust: 1 }, na: { trust: 1 }, bond: 1 }),
    ],
    beats: [],
  };
}

const BUILDERS: Record<string, (ctx: ANSceneContext) => ANSceneData> = {
  ...AN_SCENE_BUILDERS_A,
  "cross-an-05": q5, "cross-an-06": q6, "cross-an-07": q7, "cross-an-m1": m1, "cross-an-m2": m2,
};

export const AN_QUEST_IDS = ["cross-an-01", "cross-an-02", "cross-an-03", "cross-an-04", "cross-an-05", "cross-an-06", "cross-an-07"] as const;
export const AN_MOMENT_IDS = ["cross-an-m1", "cross-an-m2"] as const;

export function anScene(id: string, ctx: ANSceneContext): ANSceneData | undefined {
  return BUILDERS[id]?.(ctx);
}

export { ONLY_ALLENNA };
