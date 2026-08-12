import type { DialogueLine } from "./game-data";

export type IntimacyGameOption = {
  id: string;
  label: string;
  score: 0 | 1 | 2;
  lines: DialogueLine[];
};

export type IntimacyGameBeat = {
  prompt: string;
  detail: string;
  options: IntimacyGameOption[];
};

export type IntimacyGame = {
  title: string;
  instruction: string;
  beats: IntimacyGameBeat[];
  results: {
    attuned: DialogueLine[];
    searching: DialogueLine[];
    discordant: DialogueLine[];
  };
};

const N = (text: string): DialogueLine => ({ speaker: "Narration", text });
const C = (speaker: string, text: string, mood?: string): DialogueLine => ({ speaker, text, mood });
const P = (text: string): DialogueLine => ({ speaker: "{player}", text });
const O = (id: string, label: string, score: 0 | 1 | 2, ...lines: DialogueLine[]): IntimacyGameOption => ({ id, label, score, lines });

/**
 * Ces jeux ne vérifient pas une « bonne conduite ». Ils mettent en jeu ce que
 * chaque personnage apporte spontanément à l'intimité : magie, musique,
 * stratégie, humour ou contrôle. Les réponses modifient réellement le ton de
 * la suite et restent lisibles comme des gestes, jamais comme un questionnaire.
 */
export const INTIMACY_GAMES: Record<string, IntimacyGame> = {
  hylee: {
    title: "Un dessin dans le givre",
    instruction: "Hylee fait courir une ligne de glace entre vos mains. Répondez à ses métamorphoses pour achever ensemble la figure.",
    beats: [
      { prompt: "La ligne hésite entre vos paumes.", detail: "Le froid picote sans faire mal. Hylee observe autant votre visage que le motif.", options: [
        O("warm", "Réchauffer lentement votre paume", 2, N("La glace devient transparente au lieu de casser. Hylee rapproche ses doigts des vôtres, ravie par cette souplesse nouvelle."), C("Hylee", "Tu vois ? Elle n’est pas obligée de choisir entre tenir et fondre.", "soft")),
        O("hold", "Garder exactement la même pression", 1, N("Le trait demeure net, un peu raide. Hylee l’allonge avec application et vous adresse un sourire concentré.")),
        O("snap", "Pincer le trait pour le faire éclater", 0, N("La glace casse en trois fragments. Hylee sursaute, puis rassemble les morceaux avec un rire nerveux."), C("Hylee", "D’accord… version plus sportive que prévu.", "surprised")),
      ]},
      { prompt: "Un flocon asymétrique apparaît.", detail: "Une branche dépasse, l’autre reste presque vide.", options: [
        O("follow", "Prolonger la branche qu’elle vient d’amorcer", 2, N("Vos deux lignes se rejoignent sans devenir identiques. Le flocon gagne une forme irrégulière et vivante."), C("Hylee", "Celui-là, personne ne pourra prétendre l’avoir fait seul·e.", "teasing")),
        O("perfect", "Corriger le motif pour le rendre régulier", 0, N("Le flocon devient impeccable. Hylee le contemple, puis regarde la petite branche que vous avez effacée."), C("Hylee", "Il était bancal… mais c’était ma partie préférée.", "sad")),
        O("wait", "La laisser décider de la seconde moitié", 1, N("Hylee complète le dessin en silence. Sa main gagne de l’assurance, même si le motif reste davantage le sien que le vôtre.")),
      ]},
      { prompt: "Le givre grimpe jusqu’à vos poignets.", detail: "Hylee rougit ; son sort répond à une pensée qu’elle n’a pas formulée.", options: [
        O("name", "Murmurer que le froid vous plaît ainsi", 2, P("Ne le retiens pas. J’aime sentir ce que tu ne réussis pas à cacher."), N("Le givre se couvre de minuscules étoiles. Hylee vous embrasse le poignet, précisément là où elles brillent.")),
        O("joke", "Souffler que les draps vont encore protester", 1, N("Hylee étouffe un rire contre votre épaule. Le sort recule, mais sa gêne devient plus légère.")),
        O("hide", "Retirer vivement votre main", 0, N("La ligne se rompt. Hylee ramène aussitôt son pouvoir contre elle et le silence se refroidit davantage que votre peau.")),
      ]},
      { prompt: "Il manque le centre du dessin.", detail: "Hylee attend votre geste au lieu de le deviner.", options: [
        O("kiss", "Poser un baiser au milieu du flocon", 2, N("La chaleur ouvre un cercle parfait. Hylee rit, efface d’un souffle la glace restante et remplace le motif par sa bouche.")),
        O("thumb", "Tracer un cercle avec votre pouce", 1, N("Le centre se creuse sous votre doigt. Hylee y pose le sien, puis laisse vos mains se refermer l’une sur l’autre.")),
        O("command", "Lui demander de terminer sa création", 0, N("Hylee obéit, mais le dernier cercle ressemble à une signature solitaire. Elle contemple le résultat sans la fierté espérée.")),
      ]},
    ],
    results: {
      attuned: [N("Le flocon achevé fond entre vos doigts et laisse vos paumes mouillées l’une contre l’autre. Hylee ne regarde déjà plus le dessin."), C("Hylee", "On recommencera. Pas pour le réussir mieux — pour voir ce qu’on inventera la prochaine fois.", "soft")],
      searching: [N("Le motif porte vos hésitations autant que vos trouvailles. Hylee en suit les défauts du doigt avant de reprendre votre main."), C("Hylee", "Il nous ressemble déjà : un peu maladroit et suffisamment joli pour continuer.", "teasing")],
      discordant: [N("Le dessin se brise avant d’être complet. Hylee chasse les éclats d’un geste et revient près de vous, moins joueuse mais toujours présente."), C("Hylee", "La magie, on peut la refaire. Pour la suite… regarde-moi davantage que le flocon.", "determined")],
    },
  },

  remerii: {
    title: "Quatre mesures sans partition",
    instruction: "Remerii joue une phrase au bord du lit. Répondez par un rythme, une rupture ou un silence ; la musique gardera la trace de vos choix.",
    beats: [
      { prompt: "Première mesure : trois notes parfaitement égales.", detail: "Elle vous tend le petit tambour, déjà prête à analyser votre réponse.", options: [
        O("offbeat", "Répondre sur le contretemps", 2, N("Votre frappe se glisse entre ses notes. Remerii relève un sourcil, puis décale volontairement l’accord suivant pour vous faire une place.")),
        O("copy", "Reproduire exactement les trois notes", 1, N("Le miroir sonore est impeccable. Remerii l’approuve, tout en attendant encore d’entendre ce qui viendra de vous.")),
        O("rush", "Frapper quatre fois, plus vite", 0, N("Le rythme trébuche. Remerii le rattrape d’un accord sec avant qu’il ne s’effondre."), C("Remerii", "L’audace n’abolit pas entièrement la mesure.", "strict")),
      ]},
      { prompt: "Deuxième mesure : elle laisse une note suspendue.", detail: "La résolution évidente attend sous ses doigts, mais elle ne la joue pas.", options: [
        O("silence", "Laisser la note sans réponse", 2, N("Le silence s’étire jusqu’à devenir le cœur du morceau. Remerii cesse de compter et vous observe à travers la vibration mourante."), C("Remerii", "Je n’aurais pas osé la laisser inachevée.", "calm")),
        O("resolve", "Donner la résolution attendue", 1, N("L’accord retrouve son équilibre. Remerii incline la tête devant votre réponse juste, sinon surprenante.")),
        O("wrong", "Choisir volontairement la note la plus dissonante", 0, N("La corde grince. Remerii ferme les yeux, atteinte dans une part très intime de son sens de l’ordre."), C("Remerii", "Vous confondez encore surprise et agression acoustique.", "strict")),
      ]},
      { prompt: "Troisième mesure : ses doigts accélèrent.", detail: "La maîtrise revient comme un refuge et menace de vous laisser derrière.", options: [
        O("touch", "Poser deux doigts sur son poignet", 2, N("La cadence ralentit sous votre contact. Remerii ne s’interrompt pas : elle adapte la phrase au rythme commun de vos pouls.")),
        O("chase", "Tenter de suivre jusqu’au bout", 1, N("Vous perdez une frappe, puis retrouvez la mesure. Un sourire presque fier traverse le visage de Remerii.")),
        O("quit", "Abandonner le tambour avec un rire", 0, N("La musique s’achève seule sous ses doigts. Remerii dissimule sa déception derrière une cadence impeccable.")),
      ]},
      { prompt: "Dernière mesure : elle vous cède la fin.", detail: "Aucune annotation ne précise comment conclure.", options: [
        O("kiss", "Remplacer la dernière note par un baiser", 2, N("Remerii inspire contre votre bouche ; la main qui tenait l’accord vient se perdre dans vos cheveux."), C("Remerii", "Conclusion techniquement irrégulière. Définitivement convaincante.", "smirk")),
        O("single", "Jouer une note simple et la laisser vibrer", 1, N("Le son vous enveloppe. Remerii pose son front contre le vôtre et attend sa disparition complète.")),
        O("flourish", "Improviser un final spectaculaire", 0, N("Le final remplit toute la chambre et laisse peu de place au moment fragile qu’elle vous avait confié. Remerii repose l’instrument avec précaution.")),
      ]},
    ],
    results: {
      attuned: [N("La musique s’arrête, mais vos respirations gardent sa mesure. Remerii abandonne la partition vierge sans chercher à noter ce qui vient d’exister."), C("Remerii", "Si je l’écrivais, je serais tentée de le contrôler. Je préfère vous laisser me le rappeler.", "calm")],
      searching: [N("Le morceau a boité, résisté, puis trouvé une résolution qui n’appartenait à aucun de vous seul. Remerii accepte ce désordre limité avec un sourire."), C("Remerii", "Nous pourrons réviser certains passages. Beaucoup plus tard.", "smirk")],
      discordant: [N("Remerii referme l’instrument avant que la musique ne se change en duel. Elle revient néanmoins s’asseoir près de vous."), C("Remerii", "Oublions la virtuosité. Pour la suite, une phrase simple vaudra mieux qu’un effet brillant.", "strict")],
    },
  },

  iriana: {
    title: "Une danse sans protocole",
    instruction: "La valse mécanique change de tempo quatre fois. Iriana refuse les pas de cour : à vous de construire une danse qui n’appartient qu’à cette pièce.",
    beats: [
      { prompt: "La musique commence trop lentement.", detail: "Iriana garde encore la distance exacte enseignée par ses maîtres.", options: [
        O("shoulder", "Poser sa main sur votre épaule et attendre son pas", 2, N("Elle comprend l’invitation, rompt elle-même la distance et choisit un premier mouvement que la cour ne lui a jamais appris.")),
        O("bow", "Lui offrir une révérence impeccable", 1, N("Iriana répond par réflexe, amusée mais encore enfermée dans les gestes qu’elle souhaitait oublier.")),
        O("pull", "La tirer vivement contre vous", 0, N("Son talon heurte le parquet. Iriana retrouve son équilibre et son regard devient celui d’une souveraine prise de court.")),
      ]},
      { prompt: "Le tempo bondit.", detail: "La valse exige un tour que personne n’a préparé.", options: [
        O("laugh", "Rater le tour avec elle et continuer en riant", 2, N("Vos épaules se heurtent, Iriana éclate de rire et transforme l’accident en pas officiel de votre danse."), C("Iriana", "Si quelqu’un demande, cette figure est ancienne et très difficile.", "smirk")),
        O("lead", "La guider dans un tour simple", 1, N("Le mouvement passe sans faute. Iriana suit avec plaisir, même si l’audace promise reste encore à venir.")),
        O("correct", "Corriger sa position de manière cérémonieuse", 0, N("Son sourire s’amincit. Pendant une mesure entière, la salle de bal redevient une salle d’examen.")),
      ]},
      { prompt: "La musique s’interrompt une seconde.", detail: "Vous restez proches, sans rythme auquel obéir.", options: [
        O("heartbeat", "Continuer sur le rythme de son cœur", 2, N("Iriana comprend lorsque votre main glisse entre ses omoplates. Vos pas deviennent plus lents que la musique revenue.")),
        O("wait", "Rester immobile jusqu’à la reprise", 1, N("Le silence passe entre vous sans briser la danse. Iriana conserve votre main dans la sienne.")),
        O("applaud", "Applaudir la performance de la salle", 0, N("La plaisanterie retombe avant d’atteindre ses yeux. L’instant suspendu s’est refermé trop vite.")),
      ]},
      { prompt: "La dernière mesure approche.", detail: "Iriana regarde le diadème laissé sur le siège, puis revient à vous.", options: [
        O("unfinished", "Arrêter avant la fin et rester front contre front", 2, N("La valse conclut sans vous. Iriana ferme les yeux, soulagée de ne devoir offrir aucune pose finale.")),
        O("spin", "La faire tourner une dernière fois", 1, N("Sa cape décrit un cercle sombre. Elle revient contre vous avec un sourire essoufflé.")),
        O("crown", "La reconduire élégamment jusqu’à son diadème", 0, N("Iriana s’immobilise devant la couronne. Vous avez achevé la danse à l’endroit précis qu’elle tentait de quitter.")),
      ]},
    ],
    results: {
      attuned: [N("La salle continue de jouer pour deux silhouettes qui ont cessé de suivre ses règles. Iriana garde sa main dans la vôtre et laisse le diadème attendre."), C("Iriana", "Voilà donc ce que signifie mener sa propre danse. J’aurais aimé apprendre cela avant de savoir gouverner.", "calm")],
      searching: [N("Votre danse conserve quelques révérences, deux accidents et un pas entièrement neuf. Iriana préfère manifestement ce dernier."), C("Iriana", "Nous ne sommes pas encore libres de tous les vieux mouvements. Mais celui-ci est à nous.", "smirk")],
      discordant: [N("La musique vous a ramenés plus souvent au protocole qu’Iriana ne l’espérait. Elle éteint la valse d’un geste et revient à une proximité plus simple."), C("Iriana", "Assez de pas appris. Pour la suite, ne suivez que mon regard.", "stern")],
    },
  },

  valurn: {
    title: "La partie sans mise",
    instruction: "Valurn distribue quatre cartes. Chacune offre une manière de poursuivre le jeu ; aucune ne permet de se cacher tout à fait derrière les règles.",
    beats: [
      { prompt: "Première carte : le Roi sans couronne.", detail: "Valurn la pose face visible et attend votre interprétation.", options: [
        O("free", "« Quelqu’un qui ne doit plus rien au trône. »", 2, C("Valurn", "Une lecture dangereusement séduisante. Je conserve cette carte.", "away"), N("Il la glisse sous son verre plutôt que dans la défausse.")),
        O("fallen", "« Un souverain qui a perdu. »", 1, N("Valurn incline la tête. La réponse l’amuse moins qu’elle ne l’intéresse.")),
        O("weak", "« Un homme sans pouvoir. »", 0, N("Son sourire devient plus poli. La carte disparaît entre ses doigts comme si elle n’avait jamais existé.")),
      ]},
      { prompt: "Deuxième carte : la Porte ouverte.", detail: "Le battant peint donne sur un paysage dont la route s’efface.", options: [
        O("stay", "Demander ce qui pourrait lui donner envie de rester", 2, C("Valurn", "Quelqu’un qui ne prendrait pas ma présence pour une dette. Hypothétiquement, bien sûr.", "away")),
        O("leave", "Lui demander où il partirait", 1, N("Valurn décrit trois villes et ne choisit aucune destination. Son regard revient toujours vers vous.")),
        O("lock", "Retourner la carte pour fermer la porte", 0, N("Le geste se voulait léger. Valurn le suit pourtant avec une attention soudain trop calme.")),
      ]},
      { prompt: "Troisième carte : le Démon souriant.", detail: "Le dessin ressemble assez à Valurn pour que la provocation soit volontaire.", options: [
        O("tell", "Chercher la différence entre le sourire peint et le sien", 2, P("Le tien se crispe juste avant que tu dises quelque chose de vrai."), N("Valurn porte deux doigts à sa bouche, pris en flagrant délit par une attention qu’il n’avait pas prévue.")),
        O("flirt", "Déclarer le démon plus séduisant", 1, C("Valurn", "Cruauté gratuite. J’apprécie l’effort, moins le résultat.", "amused")),
        O("pact", "Lui demander combien vaut cette carte", 0, N("Son rire s’interrompt. Pendant un instant, le jeu ressemble trop aux négociations de son père.")),
      ]},
      { prompt: "Dernière carte : elle est blanche.", detail: "Valurn vous tend également le crayon.", options: [
        O("two", "Dessiner deux silhouettes près d’un feu", 2, N("Vous ne tracez ni route ni contrat. Valurn regarde longuement l’espace laissé autour des silhouettes, puis ajoute une étoile.")),
        O("question", "Écrire une question sans exiger de réponse", 1, N("Il lit, répond tout de même et replie la carte avec un soin inhabituel.")),
        O("claim", "Écrire votre nom sur toute la carte", 0, N("Valurn contemple la revendication, sourit sans joie et repose le crayon entre vous.")),
      ]},
    ],
    results: {
      attuned: [N("Valurn rassemble les cartes, sauf la dernière. Il la garde contre sa poitrine, là où aucun pacte n’a laissé de sceau visible."), C("Valurn", "Une partie où je n’ai rien gagné et rien perdu. J’ignorais qu’elle pouvait me laisser aussi riche.", "away")],
      searching: [N("La partie a révélé deux vérités, un mensonge et plusieurs issues de secours. Valurn mélange le tout avant de s’approcher."), C("Valurn", "Nous apprenons encore les règles. Heureusement, je triche moins quand elles me plaisent.", "charming")],
      discordant: [N("Valurn range les cartes avant qu’elles ne deviennent un nouveau contrat. Quand il revient vers vous, ses mains sont vides et son sourire aussi."), C("Valurn", "Laissons les symboles tranquilles. Pour la suite, parlez-moi sans mise.", "away")],
    },
  },

  naiah: {
    title: "Le vrai parmi les illusions",
    instruction: "Naïah mêle sensations réelles et mirages inoffensifs. Trouvez ce qui vient d’elle, ou choisissez ce qui mérite de devenir réel.",
    beats: [
      { prompt: "Trois lucioles se posent sur votre bras.", detail: "L’une réchauffe réellement la peau ; les deux autres copient seulement sa lumière.", options: [
        O("warm", "Suivre celle dont la chaleur hésite", 2, N("La vraie luciole frémit sous votre doigt. Naïah sourit : son illusion imitait la perfection, pas le petit défaut du vivant.")),
        O("bright", "Choisir la plus brillante", 0, N("Elle éclate en poussière violette. Naïah retient une plaisanterie, attentive à votre réaction.")),
        O("all", "Rassembler les trois dans votre paume", 1, N("Deux lumières disparaissent ; la troisième reste. Naïah s’approche pour la libérer avec vous.")),
      ]},
      { prompt: "Sa voix murmure votre prénom de trois côtés.", detail: "Une seule version porte son souffle véritable.", options: [
        O("close", "Vous tourner vers la voix la plus proche", 2, N("Naïah se trouve à quelques centimètres. Votre mouvement transforme presque aussitôt la découverte en baiser.")),
        O("laugh", "Répondre aux trois Naïah à la fois", 1, N("Les illusions rient avec elle. La vraie finit par lever la main, vaincue par votre obstination joyeuse.")),
        O("command", "Exiger que les copies disparaissent", 0, N("La clairière se vide d’un coup. Naïah reste seule, mais son jeu s’est éteint avec les mirages.")),
      ]},
      { prompt: "Une fleur apparaît entre vos doigts.", detail: "Elle sent la pluie, alors que le ciel est sec.", options: [
        O("memory", "Lui demander quel souvenir lui a donné cette odeur", 2, N("La forêt s’efface un instant derrière une cuisine d’Akuhn’Nabad, une fenêtre ouverte et deux petites filles riant sous l’orage. Naïah laisse le souvenir entier entre vous.")),
        O("pretty", "Glisser la fleur derrière son oreille", 1, N("La fleur devient réelle le temps de tenir dans ses cheveux. Naïah rougit et prétend que la métamorphose n’était pas sentimentale.")),
        O("test", "Écraser un pétale pour vérifier sa nature", 0, N("Le pétale devient fumée. Naïah regarde votre main, blessée moins par la perte que par le réflexe de soupçon.")),
      ]},
      { prompt: "La dernière illusion vous ressemble.", detail: "Votre double tend la main à Naïah avec une assurance parfaite.", options: [
        O("imperfect", "Prendre sa main avec votre propre hésitation", 2, N("Le double parfait disparaît dès que vos doigts atteignent ceux de Naïah. Elle serre la main réelle, précisément parce qu’elle tremble un peu.")),
        O("compete", "Défier votre double de faire mieux", 1, N("Naïah éclate de rire et dissipe l’adversaire avant que la compétition ne devienne sérieuse.")),
        O("watch", "Laisser l’illusion choisir à votre place", 0, N("Le double s’approche ; Naïah le traverse et vient vous retrouver derrière lui."), C("Naïah", "Je préfère la version qui peut encore se tromper.", "thinking")),
      ]},
    ],
    results: {
      attuned: [N("Naïah dissipe le décor, mais conserve la fleur et la chaleur de la luciole. Les choses vraies n’étaient pas forcément celles qui existaient avant vous."), C("Naïah", "Tu m’as trouvée sans me demander d’arrêter d’être magique. C’est terriblement attirant.", "determined")],
      searching: [N("La clairière garde quelques mirages et quelques maladresses. Naïah vous rejoint au milieu, amusée que la vérité ait dû prendre plusieurs chemins."), C("Naïah", "Tu t’es perdu·e deux fois. Mais toujours dans ma direction.", "smile")],
      discordant: [N("Naïah dissipe ses illusions afin qu’aucun nouveau doute ne s’interpose. Son visage réel demeure ouvert, quoique moins joueur."), C("Naïah", "On laisse les tours de magie pour une autre nuit. Regarde-moi, cette fois.", "thinking")],
    },
  },

  lineva: {
    title: "Défaire la garde",
    instruction: "Lineva a porté son armure toute la journée. Quatre attaches résistent encore ; chacune réclame moins de force que d’attention.",
    beats: [
      { prompt: "Le fermoir de l’épaule est bloqué par le sel.", detail: "Lineva essaie déjà de l’ouvrir d’une seule main, par habitude.", options: [
        O("brace", "Maintenir la pièce pendant qu’elle libère le crochet", 2, N("Vos efforts se complètent. L’épaulière tombe sans bruit et Lineva roule enfin le muscle engourdi.")),
        O("take", "Lui demander de ne plus bouger et vous en charger", 1, N("Le fermoir cède. Lineva apprécie l’efficacité, moins la brusque dépossession de la tâche.")),
        O("force", "Tirer d’un coup sec", 0, N("Le métal claque contre le banc. Lineva retient votre poignet avant que la lanière n’arrache le cuir.")),
      ]},
      { prompt: "Le lacet du gantelet forme un nœud serré.", detail: "Ses doigts portent les marques rouges d’une journée de garde.", options: [
        O("teeth", "Défaire le nœud avec les dents, sans quitter son regard", 2, N("Le geste arrache à Lineva un souffle qui n’a rien de militaire. Lorsque le gant glisse, sa main nue reste contre votre joue.")),
        O("slow", "Desserrer patiemment chaque boucle", 1, N("Le cuir finit par céder. Lineva observe votre précision avec une détente grandissante.")),
        O("cut", "Proposer de couper le lacet", 0, C("Lineva", "C’est mon meilleur gantelet.", "stern"), N("Vous reposez le couteau. Le nœud, lui, paraît presque satisfait.")),
      ]},
      { prompt: "La boucle de ceinture porte trois clés inutiles ici.", detail: "Lineva les compte néanmoins du pouce.", options: [
        O("name", "Nommer chaque clé pendant qu’elle les dépose", 2, N("Port, poudrière, tour ouest. À la quatrième place, vous posez votre main vide dans la sienne. Lineva cesse de compter.")),
        O("table", "Poser le trousseau bien en vue", 1, N("Les clés restent accessibles sur la table. Lineva expire plus librement sans cesser tout à fait de les surveiller.")),
        O("hide", "Cacher les clés derrière votre dos", 0, N("Son corps se tend avant même sa pensée. La plaisanterie meurt lorsqu’elle vous demande de les rendre.")),
      ]},
      { prompt: "Il ne reste que le manteau.", detail: "Sans son poids, Lineva semble ignorer où placer ses épaules.", options: [
        O("replace", "Le remplacer par vos bras", 2, N("Elle se laisse entourer, raide une seconde, puis entière contre vous. Le front posé sur votre épaule, Lineva n’écoute plus les remparts.")),
        O("fold", "Plier soigneusement le manteau avec elle", 1, N("Vous lissez ensemble le tissu avant de vous asseoir côte à côte. L’ordre devient une transition plutôt qu’une armure.")),
        O("throw", "Le lancer au loin pour célébrer sa liberté", 0, N("Le manteau tombe dans la poussière. Lineva va le ramasser, et la commandante revient avec lui.")),
      ]},
    ],
    results: {
      attuned: [N("L’armure repose pièce par pièce, non comme une défaite mais comme une tâche enfin terminée. Lineva prend votre main nue et la guide contre sa taille."), C("Lineva", "La ville est gardée. Maintenant… restez avec moi.", "thoughtful")],
      searching: [N("Quelques attaches ont résisté, quelques réflexes aussi. Lineva se tient pourtant devant vous sans manteau ni rapport à achever."), C("Lineva", "Je ne sais pas encore déposer tout le reste aussi facilement. Ce soir, cela suffira.", "smirk")],
      discordant: [N("Lineva range elle-même les dernières pièces, reprenant le contrôle dont vos gestes l’avaient privée. Puis elle revient, sans armure et sans jeu."), C("Lineva", "Assez de manœuvres. La suite demande moins d’adresse et davantage de présence.", "stern")],
    },
  },

  saidin: {
    title: "Quatre choses qui n’arrivent qu’ici",
    instruction: "Les futurs bruissent encore autour de Saidin. Aidez-le à choisir quatre détails du présent avant que la chambre ne se perde dans leurs échos.",
    beats: [
      { prompt: "Une bougie vacille.", detail: "Saidin voit déjà les dix manières dont elle pourrait s’éteindre.", options: [
        O("wax", "Lui faire toucher la cire déjà refroidie", 2, N("La petite goutte dure sous son doigt n’existe que maintenant. Son regard revient de très loin jusqu’à votre main.")),
        O("flame", "Lui demander de prédire la direction de la flamme", 0, N("Ses pupilles pâlissent. Pendant une seconde, la chambre se remplit de vents qui ne souffleront peut-être jamais.")),
        O("shield", "Protéger la flamme de votre paume", 1, N("La lumière se stabilise entre vos doigts. Saidin suit l’ombre présente plutôt que ses fins possibles.")),
      ]},
      { prompt: "La pluie frappe la vitre.", detail: "Chaque goutte ouvre un avenir minuscule dans son regard.", options: [
        O("count", "Compter seulement les quatre prochaines", 2, P("Une. Deux. Trois. Quatre."), N("Saidin répète les nombres avec vous. À quatre, il est encore là et paraît surpris de cette victoire modeste.")),
        O("storm", "Lui demander quand cessera l’averse", 0, N("Cent réponses traversent son visage. La question a rendu l’horizon plus bruyant que la pluie.")),
        O("listen", "Écouter sans compter", 1, N("Le bruit devient un rideau continu. Saidin s’y repose, même si quelques futurs percent encore entre les gouttes.")),
      ]},
      { prompt: "Votre reflet bouge dans le miroir.", detail: "Un autre reflet, à peine décalé, choisit un geste différent.", options: [
        O("cover", "Couvrir le miroir et regarder Saidin directement", 2, N("Les versions concurrentes disparaissent sous le tissu. Saidin rencontre vos yeux sans consulter leurs lendemains.")),
        O("wave", "Saluer l’autre reflet", 1, N("Le double répond trop tard. Saidin rit, et ce rire-là n’avait été prévu par aucun miroir.")),
        O("follow", "Imiter le geste du reflet futur", 0, N("Saidin vous retient doucement. La pièce vient de perdre un instant la différence entre choix et répétition.")),
      ]},
      { prompt: "Il reste à choisir un dernier détail.", detail: "Saidin attend, les futurs enfin assez silencieux pour ne pas parler avant vous.", options: [
        O("breath", "Sa respiration contre votre bouche", 2, N("Vous la nommez puis la sentez se rapprocher. Saidin ferme les yeux et laisse le prochain souffle arriver sans le devancer.")),
        O("name", "La manière dont il prononce votre prénom", 1, N("Saidin le répète, plus lentement. Votre nom cesse un instant d’appartenir à toutes ses versions possibles.")),
        O("tomorrow", "Ce que vous ferez demain", 0, N("L’horizon recommence à se déplier. Saidin l’arrête d’un baiser bref, presque sévère.")),
      ]},
    ],
    results: {
      attuned: [N("La bougie, quatre gouttes, un miroir couvert et votre souffle : le présent tient dans ces détails. Saidin semble n’avoir jamais habité une pièce aussi vaste."), C("Saidin", "Je ne connais pas la prochaine seconde. Approchez avant que l’habitude me revienne.", "surprised")],
      searching: [N("Quelques futurs continuent de frôler les murs, mais Saidin revient chaque fois à un détail choisi avec vous."), C("Saidin", "Le présent exige plus d’effort que je ne l’admets. Vous le rendez difficile à quitter.", "soft")],
      discordant: [N("Les possibles ont repris trop de place. Saidin éteint la bougie et couvre lui-même le miroir jusqu’à ne garder que votre silhouette proche."), C("Saidin", "Plus de jeu. Cette fois, je ne veux rien savoir avant de le sentir.", "determined")],
    },
  },

  bellirith: {
    title: "Ce qui reste sans l’aura",
    instruction: "Bellirith retire quatre artifices, l’un après l’autre. À vous de répondre à la femme qui apparaît, sans chercher trop vite à décider laquelle est la vraie.",
    beats: [
      { prompt: "Elle ôte le bijou qui amplifie sa voix.", detail: "Son timbre devient plus bas, légèrement rauque.", options: [
        O("like", "Lui dire ce que cette voix vous fait réellement", 2, P("Elle me donne envie de me rapprocher pour ne rien perdre."), N("Bellirith avale la réplique brillante qu’elle préparait et vous offre un simple sourire.")),
        O("same", "Affirmer que vous ne remarquez aucune différence", 0, N("Elle sait que vous mentez. Le compliment la laisse plus seule que le silence.")),
        O("ask", "Lui demander laquelle elle préfère", 1, C("Bellirith", "Celle-ci, certains soirs. L’autre quand le monde exige que j’occupe toute la pièce.", "thoughtful")),
      ]},
      { prompt: "Elle efface le fard autour de ses yeux.", detail: "Une petite marque pâle traverse sa tempe.", options: [
        O("trace", "Suivre la marque du regard sans la commenter", 2, N("Bellirith remarque votre attention et ne détourne pas le visage. Le silence lui laisse décider elle-même d’en raconter l’origine.")),
        O("pretty", "L’assurer aussitôt qu’elle reste magnifique", 1, N("Le compliment lui plaît, mais arrive si vite qu’il recouvre presque ce qu’elle venait d’oser montrer.")),
        O("scar", "Lui demander qui l’a défigurée", 0, N("Son expression se glace. La marque minuscule vient de prendre sous vos mots une importance qu’elle ne lui donnait pas.")),
      ]},
      { prompt: "Elle laisse tomber son sourire de séduction.", detail: "La bouche au repos semble plus fatiguée, moins invincible.", options: [
        O("stay", "Rester dans le silence avec elle", 2, N("Bellirith attend le besoin de vous captiver. Lorsqu’il ne vient pas, ses épaules descendent enfin.")),
        O("joke", "Lui offrir une plaisanterie douce", 1, N("Un vrai rire remplace le sourire absent. Bellirith vous en sait gré sans le transformer en spectacle.")),
        O("perform", "Lui demander le retour de son plus beau sourire", 0, N("Il revient aussitôt, parfait et entièrement fermé.")),
      ]},
      { prompt: "Elle retire le dernier anneau et tend sa main nue.", detail: "Aucun sort n’accompagne le geste.", options: [
        O("palm", "Embrasser sa paume", 2, N("Bellirith frémit d’une réaction trop simple pour être feinte. Ses doigts se referment sur votre joue et vous ramènent vers elle.")),
        O("hold", "Entrelacer vos doigts", 1, N("Sa main reste dans la vôtre. L’absence d’effet magique rend chaque battement plus visible.")),
        O("inspect", "Vérifier malgré tout l’absence d’enchantement", 0, N("Bellirith retire lentement sa main. La prudence avait sa place ; la façon de l’exercer vient pourtant de la blesser.")),
      ]},
    ],
    results: {
      attuned: [N("Sans bijoux, sans fard et sans aura, Bellirith n’a rien perdu de sa présence. Elle semble seulement plus proche, et cette proximité la trouble davantage que n’importe quelle conquête."), C("Bellirith", "Vous me regardez encore. Voilà qui ruine une quantité embarrassante de mes théories.", "thoughtful")],
      searching: [N("Quelques compliments ont servi de masques, quelques silences les ont retirés. Bellirith garde sa main nue dans la vôtre."), C("Bellirith", "Nous ne savons pas toujours qui se montre. Au moins, cette fois, nous cherchons ensemble.", "soft")],
      discordant: [N("Bellirith repose ses artifices sur la table comme des armes qu’elle pourrait reprendre. Elle choisit pourtant de revenir sans eux, plus prudente."), C("Bellirith", "Cessons de deviner laquelle de mes versions mérite votre désir. Parlez à celle qui est devant vous.", "stern")],
    },
  },

  amanea: {
    title: "Le morceau sans royaume",
    instruction: "Amanea ouvre le piano oublié de ses appartements. Quatre phrases musicales attendent une réponse qui ne deviendra ni hymne ni ordre.",
    beats: [
      { prompt: "Amanea frappe un accord grave.", detail: "Il ressemble au début d’une marche militaire, et cela l’agace aussitôt.", options: [
        O("light", "Répondre par trois notes légères", 2, N("La marche perd son pas. Amanea recommence l’accord, moins lourd, et laisse vos notes traverser les siennes.")),
        O("march", "Renforcer le rythme solennel", 0, N("Le morceau devient majestueux malgré elle. Amanea retire ses mains avant que la reine n’en réclame la propriété.")),
        O("single", "Ajouter une note tenue", 1, N("La gravité demeure, mais la note ouvre un espace où respirer. Amanea l’écoute jusqu’au bout.")),
      ]},
      { prompt: "Une mélodie d’enfance apparaît sous ses doigts.", detail: "Elle l’interrompt avant la mesure où ses filles auraient autrefois chanté.", options: [
        O("continue", "Reprendre la mesure sans imiter leurs voix", 2, N("Vous n’occupez la place de personne. Amanea vous rejoint dans une variation nouvelle, les yeux brillants mais les mains fermes.")),
        O("ask", "Demander si Allenna la connaît encore", 1, C("Amanea", "Oui. Naïah aussi, même si elle prétendrait le contraire.", "sad"), N("Elle reprend une seule mesure avant de changer de thème.")),
        O("avoid", "Changer immédiatement de mélodie", 0, N("La douleur est évitée si vite qu’elle demeure entière. Amanea laisse sa main gauche immobile.")),
      ]},
      { prompt: "Le tempo se partage entre vous.", detail: "Amanea accélère chaque fois que l’émotion menace de dépasser la technique.", options: [
        O("slow", "Ralentir sans cesser de jouer", 2, N("Elle résiste deux mesures, puis vous suit. La mélodie devient assez lente pour laisser entendre sa respiration.")),
        O("match", "Suivre son accélération", 1, N("Vos mains courent ensemble sur le clavier. Amanea sourit devant votre adresse, même si l’émotion reste derrière la vitesse.")),
        O("stop", "Retirer brusquement vos mains", 0, N("Son accord continue seul et retombe lourdement. Amanea le laisse mourir sans vous regarder.")),
      ]},
      { prompt: "Il faut choisir la dernière note.", detail: "Amanea garde un doigt suspendu, comme si conclure signifiait encore décider pour deux.", options: [
        O("together", "Poser votre doigt sur le sien et jouer ensemble", 2, N("La note naît de vos deux poids. Amanea laisse vos mains superposées après que le son s’est éteint.")),
        O("hers", "Lui laisser seule la conclusion", 1, N("Amanea choisit une note sobre et vous regarde aussitôt, comme pour s’assurer que ce choix n’a fermé aucune porte.")),
        O("crown", "Choisir l’accord triomphal d’Akuhn’Nabad", 0, N("L’hymne emplit la pièce. Amanea referme le clavier avant que le royaume ne s’installe entre vous.")),
      ]},
    ],
    results: {
      attuned: [N("Le morceau s’achève sans titre, et personne ne vient lui en imposer un. Amanea garde vos doigts sous les siens, loin de la couronne laissée sur la table."), C("Amanea", "La cité n’entendra jamais cette musique. Pour une fois, cela ne la rend pas moins importante.", "smile")],
      searching: [N("La reine a traversé certaines mesures ; Amanea en a conservé d’autres. Le morceau demeure assez imparfait pour n’appartenir qu’à vous."), C("Amanea", "Nous le reprendrons. Non pour le corriger — pour apprendre à ne pas le commander.", "smile")],
      discordant: [N("L’hymne et les vieux réflexes ont trop souvent repris le clavier. Amanea le referme, puis dépose ses mains dans les vôtres comme un instrument plus honnête."), C("Amanea", "Assez de musique. Je n’ai plus envie de transformer ce moment en œuvre.", "stern")],
    },
  },
};

export function intimacyGameResult(characterId: string, score: number) {
  const game = INTIMACY_GAMES[characterId];
  if (!game) return [];
  const maximum = game.beats.length * 2;
  if (score >= maximum - 1) return game.results.attuned;
  if (score >= Math.ceil(maximum / 2)) return game.results.searching;
  return game.results.discordant;
}
