(function registerSylviniaStoryDialogues() {
  "use strict";

  if (window.SylviniaStoryDialogues) return;

  const AUTHORED = (window.SylviniaAuthoredStoryScenes && window.SylviniaAuthoredStoryScenes.scenes) || {};

  const PATCHES = {};
  const ADDITIONS = {};

  function key(periodId, spotId, activityId) {
    return `${periodId}:${spotId}:${activityId}`;
  }

  function beat(speaker, text) {
    return { speaker, text };
  }

  function add(periodId, spotId, definition) {
    const spotKey = `${periodId}:${spotId}`;
    ADDITIONS[spotKey] = ADDITIONS[spotKey] || [];
    ADDITIONS[spotKey].push({
      kind: "confession",
      eyebrow: "Conversation personnelle",
      prompt: "Comment Hylee ouvre-t-elle cette conversation ?",
      noStats: true,
      hiddenTitle: "Une conversation attend encore",
      ...definition,
    });
  }

  function patch(periodId, spotId, activityId, definition) {
    PATCHES[key(periodId, spotId, activityId)] = definition;
  }

  function personalChoices(first, second, third) {
    return {
      lucidite: { label: first, note: "Poser une question précise sans prétendre connaître déjà la réponse." },
      audace: { label: second, note: "Nommer directement ce qui paraît difficile à dire." },
      sangfroid: { label: third, note: "Laisser à l’autre le choix du rythme et de la profondeur." },
    };
  }

  /* Retours explicites sur les chapitres : ils ne se confondent plus avec les confidences. */
  patch("forestier-avant-depart", "salle", "dernier-service", {
    kind: "debrief",
    eyebrow: "Retour sur le chapitre",
    title: "Ce que le départ change vraiment",
    intro: "Le feu du camp baisse. Hylee revient sur la décision qui l’emmène vers Al’Gratal et sur la facilité avec laquelle Remerii a présenté ce voyage comme une simple étape.",
    prompt: "Que demande Hylee à Remerii avant de reprendre la route ?",
    choiceText: personalChoices("Lui demander si elle la voit vraiment comme son apprentie", "Affirmer qu’elle choisit elle aussi cette route", "Avouer ce que ce nouveau départ lui fait craindre"),
  });
  patch("algratal-preparatifs", "palais", "requetes-introduction", {
    kind: "debrief",
    eyebrow: "Retour sur le chapitre",
    title: "Ce qu’Iriana attend réellement d’elles",
    intro: "La réunion est terminée, mais Iriana conserve les requêtes sous sa main. Hylee lui demande enfin ce que la princesse pense de la mission, au-delà des ordres qu’elle vient de donner.",
    prompt: "Jusqu’où Hylee pousse-t-elle Iriana à quitter son rôle officiel ?",
    choiceText: personalChoices("Demander ce que la mission peut réellement changer", "Lui demander pourquoi elle a choisi deux humaines", "Écouter les réserves qu’elle ne dira pas au Conseil"),
  });
  patch("camp-avant-croisee", "feu", "apres-cauchemar", {
    kind: "debrief",
    eyebrow: "Retour sur le chapitre",
    choiceText: {
      sangfroid: { label: "Dire ce qui lui fait encore peur", note: "Nommer la peur sans lui laisser décider de la suite." },
      lucidite: { label: "Distinguer le cauchemar de l’avertissement", note: "Reprendre ce qui appartient au passé et ce qui menace encore." },
      resonance: { label: "Décrire comment sa magie a réagi", note: "Parler de la sensation avant d’en chercher le sens." },
    },
  });
  patch("miraldas-apres-saidin", "bibliotheque", "question-saidin", {
    kind: "debrief",
    eyebrow: "Retour sur le chapitre",
    choiceText: {
      lucidite: { label: "Demander ce que l’épreuve mesurait vraiment", note: "Refuser de confondre réussite et objectif du test." },
      audace: { label: "Exiger la partie que Saidin a retenue", note: "Le pousser à quitter, un instant, son avance habituelle." },
      resonance: { label: "Décrire ce que l’épreuve a réveillé", note: "L’interroger à partir de la trace laissée dans la magie." },
    },
  });
  patch("miraldas-matin-libre", "terrasse", "apres-proximite", {
    kind: "debrief",
    eyebrow: "Retour sur le chapitre",
    choiceText: {
      sangfroid: { label: "Nommer la nuit sans la dramatiser", note: "Reconnaître le moment sans exiger qu’il résolve tout." },
      lucidite: { label: "Demander ce que cela change entre elles", note: "Distinguer le désir d’avancer de la peur de mal comprendre." },
      resonance: { label: "Écouter ce que leur magie en a gardé", note: "Laisser la sensation commune précéder les mots." },
    },
  });
  patch("algratal-avant-expedition", "toits", "parler-temps", {
    kind: "debrief",
    eyebrow: "Retour sur le chapitre",
    choiceText: {
      lucidite: { label: "Demander ce que Saidin avait prévu", note: "Séparer ses calculs de ce qu’il prétend pressentir." },
      sangfroid: { label: "Demander ce qu’ils peuvent encore changer", note: "Ramener la conversation vers les décisions présentes." },
      resonance: { label: "Questionner la sensation laissée par la route", note: "Comparer son intuition à celle du vieux mage." },
    },
  });
  patch("geoles-apres-capture", "cellule", "parler-groupe", {
    kind: "debrief",
    eyebrow: "Retour sur le chapitre",
    choiceText: personalChoices("Reconstituer le moment où le plan a cédé", "Refuser qu’un seul porte toute la faute", "Demander ce dont chacun a besoin maintenant"),
  });
  patch("algratal-groupe-retour", "infirmerie", "bilan", {
    kind: "debrief",
    eyebrow: "Retour sur le chapitre",
    choiceText: personalChoices("Demander ce que les geôles ont révélé", "Nommer la phrase qui a blessé", "Commencer par ce qui peut encore être réparé"),
  });
  patch("bal-entracte-groupe", "alcove", "pacte-bal", {
    kind: "debrief",
    eyebrow: "Retour sur le chapitre",
    choiceText: personalChoices("Comparer ce que la cour essaie d’obtenir", "Refuser de jouer le couple qu’elle attend", "Fixer une règle pour traverser le bal ensemble"),
  });
  patch("bal-entre-duels", "balcon", "verifier-naiah", {
    kind: "debrief",
    eyebrow: "Retour sur le chapitre",
    choiceText: {
      lucidite: { label: "Lui demander ce que le duel a réellement touché", note: "Distinguer sa colère de la blessure qu’elle protège." },
      sangfroid: { label: "Rester sans exiger qu’elle se confie", note: "Lui offrir une présence qu’elle ne contrôle pas par un jeu." },
      resonance: { label: "Décrire ce que ses ombres ont laissé paraître", note: "Parler de la magie sans prétendre lire ses pensées." },
    },
  });
  patch("algratal-matin-apres-bal", "galerie", "conseiller-masque", {
    kind: "debrief",
    eyebrow: "Retour sur le chapitre",
    choiceText: personalChoices("Comparer ce qu’ils ont observé du conseiller", "Dire pourquoi son masque l’inquiète", "Demander ce que Draven n’a pas dit au groupe"),
  });
  patch("algratal-apres-conseil", "balcon", "avant-guerre", {
    kind: "debrief",
    eyebrow: "Retour sur le chapitre",
    choiceText: {
      lucidite: { label: "Reprendre les décisions du Conseil une à une", note: "Séparer le plan officiel de ses angles morts." },
      audace: { label: "Dire ce qu’Hylee refuse d’emporter en silence", note: "Ne pas laisser l’urgence confisquer leur vérité." },
      sangfroid: { label: "Parler de ce qu’elles feront si le plan cède", note: "Préparer une issue sans transformer la peur en certitude." },
      resonance: { label: "Comparer ce que leur magie pressent", note: "Écouter ensemble la tension qui traverse la ville." },
    },
  });

  /* Mini-jeux contextuels, facultatifs et jamais bloquants. */
  patch("miraldas-matin-libre", "atelier", "tri-cristaux", {
    kind: "minigame",
    eyebrow: "Atelier · Mini-jeu",
    miniGame: {
      type: "pattern",
      title: "Accorder les cristaux",
      instruction: "Mémorisez l’ordre des quatre résonances, puis reproduisez-le.",
      symbols: ["◇", "○", "△", "□"],
      reward: { stats: { resonance: 1 } },
    },
  });
  patch("geoles-apres-capture", "barreaux", "etudier-runes", {
    kind: "minigame",
    eyebrow: "Observation · Mini-jeu",
    miniGame: {
      type: "pattern",
      title: "Retenir le cycle des runes",
      instruction: "Observez le cycle de la serrure avant qu’il ne s’efface, puis reproduisez-le.",
      symbols: ["◐", "◇", "⌁", "○"],
      reward: { stats: { lucidite: 1 } },
    },
  });
  patch("bal-entre-duels", "piste", "choisir-danse", {
    kind: "minigame",
    eyebrow: "Danse · Mini-jeu de rythme",
    miniGame: {
      type: "rhythm",
      title: "Trouver le même tempo",
      instruction: "Touchez au moment où la pulsation s’illumine. Une erreur change la danse, elle ne l’interrompt pas.",
      beats: 8,
      reward: { relationships: { remerii: { affection: 1, trust: 1 } } },
    },
  });
  patch("algratal-apres-conseil", "infirmerie", "preparer-soins", {
    kind: "minigame",
    eyebrow: "Préparatifs · Mini-jeu",
    miniGame: {
      type: "pattern",
      title: "Composer les nécessaires",
      instruction: "Mémorisez l’ordre de rangement pour que chaque soigneur trouve le bon outil dans l’urgence.",
      symbols: ["✚", "◫", "◌", "⌁"],
      reward: { resources: { supplies: 1 } },
    },
  });

  /* Confidences canoniques : aucun désir n’est ajouté, y compris dans les scènes romantiques. */
  add("forestier-avant-depart", "chambre", {
    id: "confidence-remerii-apprendre",
    title: "Ce que Remerii attend d’une apprentie",
    speaker: "Remerii",
    relation: "remerii",
    availableFrom: 1,
    requiresRelation: { id: "remerii", min: 2 },
    approaches: ["lucidite", "audace", "sangfroid"],
    choiceText: personalChoices("Lui demander ce qu’elle redoute", "Refuser d’être seulement protégée", "Lui laisser formuler ses règles"),
    opening: [
      beat("Narrateur", "Les paquetages sont presque prêts. Remerii vérifie une troisième fois la même attache, trop appliquée pour que le problème soit réellement la corde."),
      beat("Hylee", "Tu sais que je fais mes sacs toute seule depuis presque deux ans."),
      beat("Remerii", "Je nourris cet espoir avec une patience remarquable."),
      beat("Hylee", "Je voulais dire autre chose. Maintenant que je suis vraiment ton apprentie… qu’est-ce que tu attends de moi ?"),
      beat("Narrateur", "Les doigts de Remerii restent immobiles sur le nœud. Pour une fois, elle ne possède pas de réponse préparée."),
      beat("Remerii", "Que tu survives assez longtemps pour me désobéir pour de bonnes raisons. Le reste s’enseigne."),
    ],
    resolution: "Remerii ne transforme pas la route en serment. Elle admet seulement qu’elle n’apprend pas à Hylee à suivre ses pas, mais à choisir les siens sans se perdre.",
  });

  add("algratal-preparatifs", "palais", {
    id: "confidence-iriana-observer",
    title: "Pourquoi Iriana observe avant de parler",
    speaker: "Iriana",
    relation: "iriana",
    availableFrom: 1,
    requiresRelation: { id: "iriana", min: 2 },
    approaches: ["lucidite", "audace", "sangfroid"],
    choiceText: personalChoices("L’interroger sur ce qu’elle a remarqué", "Lui demander si elle manipule tout le monde", "Attendre qu’elle retire elle-même le masque"),
    opening: [
      beat("Narrateur", "La galerie s’est vidée. Iriana regarde encore la porte par laquelle chaque conseiller est parti, comme si leurs dos parlaient mieux que leurs visages."),
      beat("Hylee", "Vous saviez déjà ce qu’ils allaient demander, n’est-ce pas ?"),
      beat("Iriana", "Je savais ce qu’ils voulaient obtenir. Ce qu’ils accepteraient de sacrifier était moins certain."),
      beat("Hylee", "Vous faites ça avec tout le monde ?"),
      beat("Narrateur", "Le regard d’Iriana revient sur elle, précis mais dépourvu de la cruauté qu’Hylee y attendait."),
      beat("Iriana", "Non. Certaines personnes méritent qu’on les écoute avant de décider à quoi elles servent."),
    ],
    resolution: "Iriana ne renonce pas à observer Hylee. Elle lui accorde cependant une différence importante : elle accepte désormais que ses surprises ne soient pas nécessairement des erreurs.",
  });

  add("algratal-preparatifs", "appartements", {
    id: "confidence-remerii-retour",
    title: "Mir’Aldas avant Hylee",
    speaker: "Remerii",
    relation: "remerii",
    availableFrom: 1,
    requiresRelation: { id: "remerii", min: 4 },
    approaches: ["lucidite", "audace", "sangfroid"],
    choiceText: personalChoices("Demander ce qui a changé là-bas", "Lui demander pourquoi elle est partie", "L’assurer qu’elle n’a pas à tout raconter"),
    opening: [
      beat("Narrateur", "Sur la carte, Remerii suit du doigt un ancien chemin vers Mir’Aldas puis l’efface de la paume."),
      beat("Hylee", "Tu connais une route plus courte."),
      beat("Remerii", "Je connais une route plus ancienne. Les deux ne coïncident pas toujours."),
      beat("Hylee", "Tu vivais là-bas avant l’auberge ?"),
      beat("Narrateur", "Remerii sourit comme on referme doucement une porte qui grince."),
      beat("Remerii", "J’y ai été brillante, insupportable et beaucoup trop jeune pour qu’on me laisse l’être. Dans cet ordre variable."),
    ],
    resolution: "Hylee n’obtient ni le récit de la malédiction ni celui du départ. Elle découvre une Remerii prodige, entourée d’adultes qui avaient cessé de voir l’enfant bien avant qu’elle ne le soit plus.",
  });

  add("camp-avant-croisee", "feu", {
    id: "confidence-remerii-peur",
    title: "La peur que Remerii reconnaît",
    speaker: "Remerii",
    relation: "remerii",
    availableFrom: 1,
    requiresRelation: { id: "remerii", min: 6 },
    approaches: ["lucidite", "audace", "sangfroid"],
    choiceText: personalChoices("Lui demander si elle a connu cette peur", "Lui dire qu’elle n’est pas obligée d’être infaillible", "Rester près d’elle sans exiger de récit"),
    opening: [
      beat("Narrateur", "Le cauchemar d’Hylee a laissé le camp trop silencieux. Remerii remue les braises avec une branche déjà consumée."),
      beat("Hylee", "Quand je me suis réveillée… tu n’avais pas l’air surprise."),
      beat("Remerii", "J’ai une certaine expérience des nuits qui refusent de rester dans le passé."),
      beat("Hylee", "Les tiennes ?"),
      beat("Narrateur", "La branche casse entre les doigts de Remerii. Elle observe les deux morceaux avant de les déposer dans le feu."),
      beat("Remerii", "Disons que je sais ce que l’on ressent lorsque sa propre magie cesse d’être un refuge."),
    ],
    resolution: "Remerii ne nomme pas encore la malédiction. Elle offre quelque chose de plus modeste et de plus rare : la certitude qu’elle ne parle pas à Hylee depuis un lieu intact.",
  });

  add("miraldas-apres-saidin", "bibliotheque", {
    id: "confidence-saidin-remerii-enfant",
    title: "Remerii avant d’être une prodige",
    speaker: "Saidin",
    relation: "saidin",
    availableFrom: 1,
    requiresRelation: { id: "saidin", min: 2 },
    approaches: ["lucidite", "audace", "sangfroid"],
    choiceText: personalChoices("Demander comment Remerii apprenait", "L’accuser gentiment d’être fier d’elle", "Le laisser choisir le souvenir"),
    opening: [
      beat("Narrateur", "Saidin retrouve dans un traité une marge couverte d’une écriture minuscule et rageusement régulière."),
      beat("Hylee", "C’est l’écriture de Remerii ?"),
      beat("Saidin", "Celle de Remerii à onze ans. Elle annotait les erreurs des auteurs avant de terminer leurs livres."),
      beat("Hylee", "Elle devait être insupportable."),
      beat("Saidin", "Absolument. J’étais très fier."),
      beat("Narrateur", "Il tourne la page. Un petit dessin de dragon dort entre deux formules, presque effacé par le temps."),
    ],
    resolution: "Saidin raconte une enfant brillante qui voulait tout comprendre avant le lendemain. Il évite soigneusement l’instant où les autres ont cessé de la traiter comme une enfant.",
  });

  add("miraldas-apres-saidin", "residence", {
    id: "confidence-remerii-prodige",
    title: "Quand l’admiration devient une cage",
    speaker: "Remerii",
    relation: "remerii",
    availableFrom: 1,
    requiresRelation: { id: "remerii", min: 8 },
    approaches: ["lucidite", "audace", "sangfroid"],
    choiceText: personalChoices("Lui demander qui venait dans cette chambre", "Dire que le talent n’annule pas le droit d’être aidée", "Lui proposer de refermer la porte"),
    opening: [
      beat("Narrateur", "La chambre de Mir’Aldas porte encore les marques claires des étagères retirées. Remerii sait exactement ce qui se trouvait sur chacune."),
      beat("Hylee", "Tout le monde te connaissait ici."),
      beat("Remerii", "Tout le monde connaissait ce que je savais faire."),
      beat("Hylee", "C’est différent."),
      beat("Narrateur", "Remerii la regarde longuement. Sa réponse préparée disparaît avant d’atteindre ses lèvres."),
      beat("Remerii", "Non. Et j’ai mis beaucoup trop d’années à comprendre pourquoi je me sentais seule au milieu de leur admiration."),
    ],
    resolution: "Pour la première fois, Remerii décrit Mir’Aldas sans seulement parler de magie : la cité fut aussi l’endroit où son talent avait pris toute la place qu’aurait dû occuper la personne.",
  });

  add("miraldas-matin-libre", "patisserie", {
    id: "confidence-remerii-ordinaire",
    title: "Une habitude qui pourrait durer",
    speaker: "Remerii",
    relation: "remerii",
    availableFrom: 1,
    requiresRelation: { id: "remerii", min: 10 },
    approaches: ["lucidite", "audace", "sangfroid"],
    choiceText: personalChoices("Lui demander pourquoi cela la trouble", "Proposer d’en faire une tradition", "Profiter du silence sans le définir"),
    opening: [
      beat("Narrateur", "Une miette reste au coin des lèvres de Remerii. Hylee la lui signale ; elle l’essuie avec une dignité si excessive qu’elle devient comique."),
      beat("Hylee", "On pourrait refaire ça."),
      beat("Remerii", "Acheter une pâtisserie ? Je pense pouvoir intégrer l’exercice à ton programme."),
      beat("Hylee", "Non. Être là sans courir vers une catastrophe."),
      beat("Narrateur", "La tasse de Remerii s’immobilise à mi-chemin. Son sourire revient plus lentement."),
      beat("Remerii", "C’est une habitude dangereuse. On finit par désirer qu’elle dure."),
    ],
    resolution: "Elles ne donnent aucun nom à ce moment. Leurs mains restent pourtant proches sur la table, et Remerii ne trouve aucune raison urgente de consulter l’heure.",
  });

  add("algratal-avant-expedition", "camp-forthaven", {
    id: "confidence-draven-forthaven",
    title: "Forthaven au-delà de ses remparts",
    speaker: "Draven",
    relation: "draven",
    availableFrom: 1,
    requiresRelation: { id: "draven", min: 2 },
    approaches: ["lucidite", "audace", "sangfroid"],
    choiceText: personalChoices("Lui demander ce que les cartes oublient", "Demander ce qui lui manque de la ville", "Le laisser choisir un souvenir simple"),
    opening: [
      beat("Narrateur", "Draven replie une carte de Forthaven dont les bords ont été réparés plusieurs fois. Une tache ronde recouvre une partie du port."),
      beat("Hylee", "C’est une position stratégique ?"),
      beat("Draven", "C’était une chope. Ma fille avait huit ans et l’équilibre d’un bélier ivre."),
      beat("Hylee", "Vous avez gardé la carte ?"),
      beat("Draven", "Elle est encore lisible. Et personne n’a le droit de rire."),
      beat("Narrateur", "Il grogne avant même qu’Hylee sourie, ce qui ne fait qu’aggraver son cas."),
    ],
    resolution: "Forthaven cesse d’être seulement une citadelle assiégée. Draven parle de quais bruyants, de tavernes trop pleines et d’une enfant qui courait sur les remparts avant de savoir ce qu’ils coûtaient.",
  });

  add("algratal-avant-expedition", "marche", {
    id: "confidence-valurn-calciterres",
    title: "Ce que les Calciterres apprennent aux enfants",
    speaker: "Valurn",
    relation: "valurn",
    availableFrom: 1,
    requiresRelation: { id: "valurn", min: 2 },
    approaches: ["lucidite", "audace", "sangfroid"],
    choiceText: personalChoices("Demander ce qu’il reconnaît ici", "Lui demander s’il a déjà eu peur", "Le laisser plaisanter avant de répondre"),
    opening: [
      beat("Narrateur", "Valurn rejette un fruit trop mûr après l’avoir pesé sans y penser comme une pierre de survie."),
      beat("Hylee", "Tu vérifies toujours la nourriture comme ça ?"),
      beat("Valurn", "Une enfance heureuse, pleine de leçons pratiques : le rouge peut être du jus, du poison ou un avertissement parental."),
      beat("Hylee", "Et tu as appris comment ?"),
      beat("Valurn", "En goûtant. J’étais un enfant charmant, mais statistiquement imprudent."),
      beat("Narrateur", "Il plaisante. Sa main repose pourtant le fruit avec une prudence qui appartient encore au garçon des Calciterres."),
    ],
    resolution: "Valurn transforme son enfance en spectacle, puis laisse passer entre deux plaisanteries l’image d’un monde où survivre comptait davantage qu’être protégé.",
  });

  add("algratal-avant-expedition", "palais", {
    id: "confidence-iriana-cage",
    title: "Les règles qui protègent et enferment",
    speaker: "Iriana",
    relation: "iriana",
    availableFrom: 1,
    requiresRelation: { id: "iriana", min: 4 },
    approaches: ["lucidite", "audace", "sangfroid"],
    choiceText: personalChoices("Lui demander qui a écrit ses règles", "Lui demander ce qu’elle ferait sans protocole", "Reconnaître que certaines protections étouffent"),
    opening: [
      beat("Narrateur", "Un maître de cérémonie corrige la position de deux chaises, salue Iriana et repart. Elle attend qu’il disparaisse avant de remettre l’une exactement comme avant."),
      beat("Hylee", "C’était volontaire ?"),
      beat("Iriana", "Une victoire mesquine. J’en cultive quelques-unes pour rester supportable."),
      beat("Hylee", "Qui vous a appris toutes ces règles ?"),
      beat("Narrateur", "Les doigts d’Iriana se referment sur le dossier de la chaise."),
      beat("Iriana", "Ma grand-mère m’a appris que chaque geste visible pouvait devenir une arme contre l’Empire. Elle a oublié de préciser ce qu’il restait lorsqu’aucun geste n’était plus à moi."),
    ],
    resolution: "Iriana ne condamne pas encore Tia. Elle admet seulement que la protection impériale a parfois la forme exacte d’une cage parfaitement polie.",
  });

  add("algratal-avant-expedition", "appartements", {
    id: "confidence-naiah-tests",
    title: "Pourquoi Naïah pousse jusqu’à la rupture",
    speaker: "Naïah",
    relation: "naiah",
    availableFrom: 1,
    requiresRelation: { id: "naiah", min: 2 },
    approaches: ["lucidite", "audace", "sangfroid"],
    choiceText: personalChoices("Lui dire qu’elle étudie les réactions", "Lui rendre l’une de ses provocations", "Refuser de jouer sans l’abandonner"),
    opening: [
      beat("Narrateur", "Naïah déplace chaque objet de la chambre d’un doigt vers la gauche. Hylee la regarde atteindre le vase avant de l’arrêter."),
      beat("Hylee", "Pourquoi ?"),
      beat("Naïah", "Pour savoir combien de temps tu mets à remarquer que quelque chose cloche."),
      beat("Hylee", "Tu fais ça avec tout le monde."),
      beat("Naïah", "Bien sûr. Les gens expliquent très bien qui ils sont quand on touche au mauvais vase."),
      beat("Narrateur", "Elle remet celui-ci à sa place exacte. Elle avait mémorisé la chambre avant même de commencer son jeu."),
    ],
    resolution: "Naïah reconnaît à demi-mot qu’elle provoque pour mesurer le danger avant qu’il ne la surprenne. Elle préfère être détestée pour un piège contrôlé que blessée par une réaction inconnue.",
  });

  add("algratal-avant-expedition", "toits", {
    id: "confidence-saidin-temps",
    title: "Une longueur d’avance",
    speaker: "Saidin",
    relation: "saidin",
    availableFrom: 1,
    requiresRelation: { id: "saidin", min: 4 },
    approaches: ["lucidite", "audace", "sangfroid"],
    choiceText: personalChoices("Lui demander ce qu’il avait prévu", "Lui demander de parler au présent", "Accepter qu’il ne livre qu’une partie"),
    opening: [
      beat("Narrateur", "Saidin regarde une tour dont la cloche n’a pas encore sonné. Il compte silencieusement jusqu’à trois ; le bronze résonne."),
      beat("Hylee", "Vous saviez."),
      beat("Saidin", "Je savais qu’elle était en retard. Prédire les habitudes est moins impressionnant que prédire l’avenir, mais plus fiable."),
      beat("Hylee", "Et pour notre expédition ? Habitude ou avenir ?"),
      beat("Narrateur", "Le sourire de Saidin s’efface juste assez pour rendre la question plus lourde."),
      beat("Saidin", "Une route dont j’ai déjà vu trop d’issues et pas encore celle que vous choisirez."),
    ],
    resolution: "Saidin refuse d’expliquer son rapport au temps. Son avance ne lui donne aucune maîtrise : percevoir un danger tôt signifie parfois l’attendre plus longtemps.",
  });

  add("geoles-apres-capture", "barreaux", {
    id: "confidence-saidin-remords",
    title: "Ce qu’un mentor ne peut pas empêcher",
    speaker: "Saidin",
    relation: "saidin",
    availableFrom: 1,
    requiresRelation: { id: "saidin", min: 6 },
    approaches: ["lucidite", "audace", "sangfroid"],
    choiceText: personalChoices("Lui demander pourquoi il surveille Remerii", "Dire qu’il ne peut pas tout prévoir", "Partager le silence de la cellule"),
    opening: [
      beat("Narrateur", "De l’autre côté des barreaux, Remerii dort enfin. Saidin n’a pas détourné les yeux depuis plusieurs minutes."),
      beat("Hylee", "Vous pensez qu’elle va disparaître si vous cessez de la regarder ?"),
      beat("Saidin", "Non. J’ai déjà commis l’erreur inverse : croire que voir le danger suffisait à l’empêcher."),
      beat("Hylee", "Sa malédiction ?"),
      beat("Narrateur", "Il ne confirme pas. Sa main se ferme autour d’un anneau ancien, caché sous sa manche."),
      beat("Saidin", "Il existe des blessures qu’un mentor arrive trop tard pour prévenir, puis trop tôt pour accepter qu’il ne peut les porter à la place de l’élève."),
    ],
    resolution: "Hylee comprend que la vigilance de Saidin n’est pas seulement mystérieuse. Elle est faite d’une faute qu’il ne nomme pas et d’une affection paternelle qu’il ne sait pas davantage avouer.",
  });

  add("algratal-groupe-retour", "cour", {
    id: "confidence-naiah-faim",
    title: "Ce que la faim n’oublie pas",
    speaker: "Naïah",
    relation: "naiah",
    availableFrom: 1,
    requiresRelation: { id: "naiah", min: 4 },
    approaches: ["lucidite", "audace", "sangfroid"],
    choiceText: personalChoices("Lui demander pourquoi elle cache toujours de la nourriture", "Lui voler une bouchée pour inverser le jeu", "Lui offrir sans demander d’explication"),
    opening: [
      beat("Narrateur", "Naïah fait disparaître un petit pain dans sa manche alors qu’un second est déjà entre ses dents."),
      beat("Hylee", "Tu sais qu’il y aura encore à manger demain ?"),
      beat("Naïah", "C’est une théorie très optimiste. J’aime vérifier expérimentalement."),
      beat("Hylee", "Tu as souvent manqué ?"),
      beat("Narrateur", "Naïah mord plus lentement. Son regard cherche aussitôt une plaisanterie derrière Hylee et n’en trouve pas."),
      beat("Naïah", "Assez pour me souvenir de chaque personne qui a donné sans réclamer quelque chose après."),
    ],
    resolution: "Naïah ne raconte pas encore l’exil. Elle laisse pourtant comprendre pourquoi une tartelette offerte autrefois par Hylee occupe dans sa mémoire une place que le geste ne semblait pas mériter.",
  });

  add("bal-entracte-groupe", "buffet", {
    id: "confidence-valurn-bhaal",
    title: "Un père dont Valurn porte encore la voix",
    speaker: "Valurn",
    relation: "valurn",
    availableFrom: 0,
    requiresRelation: { id: "valurn", min: 4 },
    approaches: ["lucidite", "audace", "sangfroid"],
    choiceText: personalChoices("Lui demander qui lui a appris à mépriser la faiblesse", "Nommer son père sans détour", "Lui laisser une sortie par l’humour"),
    opening: [
      beat("Narrateur", "Un noble félicite Valurn pour son ‘sang puissant’ avant de s’éloigner. Le sourire du demi-démon reste en place, devenu parfaitement vide."),
      beat("Hylee", "Ça t’arrive souvent ?"),
      beat("Valurn", "D’être complimenté ? Constamment. Par des imbéciles ? Avec une régularité admirable."),
      beat("Hylee", "Il parlait de ton père."),
      beat("Narrateur", "La coupe s’arrête près de ses lèvres. Pour une seconde, l’humour ne vient pas."),
      beat("Valurn", "Mon père appelait ‘héritage’ tout ce qu’il voulait m’empêcher de choisir."),
    ],
    resolution: "Valurn n’offre aucun récit complet des Calciterres. Il reconnaît seulement que sa provocation est aussi une manière de parler avec sa propre voix avant que celle de son père ne le fasse à sa place.",
  });

  add("bal-entre-duels", "couloir", {
    id: "confidence-draven-famille",
    title: "La famille qui attend à Forthaven",
    speaker: "Draven",
    relation: "draven",
    availableFrom: 0,
    requiresRelation: { id: "draven", min: 4 },
    approaches: ["lucidite", "audace", "sangfroid"],
    choiceText: personalChoices("Lui demander ce qu’il leur écrirait", "Lui demander pourquoi il parle si peu de sa femme", "L’écouter sans corriger ses regrets"),
    opening: [
      beat("Narrateur", "Draven a retourné sa décoration, mais garde dans la poche intérieure une lettre jamais commencée."),
      beat("Hylee", "Pour Lineva ?"),
      beat("Draven", "Pour elle et sa mère. Enfin… c’était l’idée."),
      beat("Hylee", "Qu’est-ce qui bloque ?"),
      beat("Draven", "La première phrase. Après ‘je vais bien’, tout ressemble à un mensonge ou à un ordre."),
      beat("Narrateur", "Il lisse le papier avec un pouce calleux. Hylee détourne les yeux, lui laissant l’espace de chercher une première phrase qui ne ressemble pas à un rapport."),
    ],
    resolution: "Draven parle d’une épouse patiente et de toutes les fois où il a promis de rentrer plus tôt. Hylee n’entend pas une confession héroïque, seulement un homme qui ne sait pas écrire ‘vous me manquez’ sans se sentir désarmé.",
  });

  add("algratal-matin-apres-bal", "galerie", {
    id: "confidence-draven-lineva",
    title: "Lineva avant l’armure",
    speaker: "Draven",
    relation: "draven",
    availableFrom: 1,
    requiresRelation: { id: "draven", min: 6 },
    approaches: ["lucidite", "audace", "sangfroid"],
    choiceText: personalChoices("Lui demander quand Lineva a commencé à combattre", "Lui demander s’il voulait vraiment cette vie pour elle", "Le laisser raconter le souvenir à sa manière"),
    opening: [
      beat("Narrateur", "Dans le tableau, un général victorieux pose devant une enfant sage. Draven le regarde comme une insulte personnelle."),
      beat("Hylee", "Lineva n’était pas sage ?"),
      beat("Draven", "À six ans, elle a mordu un instructeur parce qu’il lui avait dit de regarder les garçons s’entraîner."),
      beat("Hylee", "Vous étiez fier."),
      beat("Draven", "J’étais convoqué. J’ai attendu d’être dehors pour être fier."),
      beat("Narrateur", "Son rire tombe vite. Le portrait lui rappelle aussi combien de fois il n’était pas là pour voir la suite."),
    ],
    resolution: "Draven raconte les chutes, les genoux ouverts et l’obstination de Lineva. Il avoue espérer qu’elle le dépasse surtout là où lui n’a jamais su gouverner sans se cacher derrière l’armure.",
  });

  add("algratal-matin-apres-bal", "cuisine", {
    id: "confidence-naiah-amanea",
    title: "La question que Naïah transforme en colère",
    speaker: "Naïah",
    relation: "naiah",
    availableFrom: 1,
    requiresRelation: { id: "naiah", min: 6 },
    approaches: ["lucidite", "audace", "sangfroid"],
    choiceText: personalChoices("Lui demander ce qu’elle voudrait comprendre", "Refuser sa plaisanterie sur Amanea", "Lui laisser le droit de ne pas savoir"),
    opening: [
      beat("Narrateur", "Naïah découpe une pomme en quartiers d’une régularité parfaite, puis les dispose comme une couronne avant de la détruire morceau par morceau."),
      beat("Hylee", "Tu penses encore à elle."),
      beat("Naïah", "À la pomme ? Oui, notre relation est passionnelle."),
      beat("Hylee", "À Amanea."),
      beat("Narrateur", "Le couteau s’enfonce dans la planche. Naïah sourit, mais ne tire pas tout de suite sur le manche."),
      beat("Naïah", "Je pense surtout à toutes les bonnes raisons qu’une mère peut avoir de ne jamais regarder sa fille. J’en suis à zéro, c’est frustrant."),
    ],
    resolution: "La colère reste intacte. Dessous, Hylee aperçoit pourtant une question d’enfant que Naïah n’a jamais cessé de poser : qu’avait-elle fait avant même de savoir parler pour mériter d’être ignorée ?",
  });

  add("algratal-apres-conseil", "archives", {
    id: "confidence-iriana-devoir",
    title: "Ce qu’Iriana choisirait sans témoin",
    speaker: "Iriana",
    relation: "iriana",
    availableFrom: 1,
    requiresRelation: { id: "iriana", min: 6 },
    approaches: ["lucidite", "audace", "sangfroid"],
    choiceText: personalChoices("Lui demander quelle carte est la sienne", "Lui demander de choisir contre l’Empire", "Lui rappeler qu’elle peut encore hésiter"),
    opening: [
      beat("Narrateur", "Deux cartes couvrent la table : l’offensive approuvée par le Conseil et les voies de repli annotées de la main d’Iriana."),
      beat("Hylee", "Laquelle montre ce que vous voulez vraiment ?"),
      beat("Iriana", "Vous supposez qu’une héritière possède le luxe d’un désir distinct de sa fonction."),
      beat("Hylee", "Je suppose surtout que vous avez quand même dessiné la seconde."),
      beat("Narrateur", "Iriana pose la paume sur les itinéraires secrets. Le geste ressemble moins à une prise de possession qu’à une protection."),
      beat("Iriana", "Je veux que l’Empire survive. Je commence seulement à douter que cela signifie toujours obéir à ceux qui prétendent l’incarner."),
    ],
    resolution: "Iriana ne se déclare ni rebelle ni alliée. Elle reconnaît une fracture plus dangereuse : pour la première fois, son devoir envers les personnes et son devoir envers l’institution ne lui paraissent plus identiques.",
  });

  add("algratal-apres-conseil", "caserne", {
    id: "confidence-draven-retour",
    title: "Le retour que Draven imagine encore",
    speaker: "Draven",
    relation: "draven",
    availableFrom: 1,
    requiresRelation: { id: "draven", min: 8 },
    approaches: ["lucidite", "audace", "sangfroid"],
    choiceText: personalChoices("Lui demander ce qui l’attend après la guerre", "Lui faire promettre de rentrer", "Refuser une promesse impossible"),
    opening: [
      beat("Narrateur", "Draven vérifie une selle qui n’a aucun défaut. Derrière lui, les soldats parlent de ce qu’ils feront en rentrant."),
      beat("Hylee", "Et vous ?"),
      beat("Draven", "Je vais dormir deux jours, manger quelque chose qui n’a pas voyagé dans une caisse et me faire engueuler par ma famille."),
      beat("Hylee", "Vous souriez."),
      beat("Draven", "Ma femme dira que j’ai maigri. Lineva dira que je ralentis. Elles auront tort toutes les deux, évidemment."),
      beat("Narrateur", "Il décrit cette scène avec une simplicité qui serre la gorge. Pour quelques secondes, la guerre paraît n’être qu’un trajet pénible avant le retour."),
    ],
    resolution: "Draven n’avoue pas craindre la mort. Il avoue craindre plus profondément de revenir trop tard pour retrouver sa famille telle qu’il l’a laissée. Hylee n’essaie pas de transformer cette peur en promesse impossible.",
  });

  add("algratal-apres-conseil", "balcon", {
    id: "confidence-remerii-demain",
    title: "Si demain leur échappe",
    speaker: "Remerii",
    relation: "remerii",
    availableFrom: 1,
    requiresRelation: { id: "remerii", min: 14 },
    approaches: ["lucidite", "audace", "sangfroid"],
    choiceText: personalChoices("Lui demander ce qu’elle n’a jamais dit", "Lui prendre la main sans détour", "Refuser les adieux anticipés"),
    opening: [
      beat("Narrateur", "Sous le balcon, Al’Gratal prépare la guerre. Remerii compte les lanternes qui s’éteignent comme si chacune représentait une heure de moins."),
      beat("Hylee", "Tu veux encore vérifier mon équipement ?"),
      beat("Remerii", "Non. J’ai déjà vérifié deux fois. Trois, si l’on compte la vérification que tu n’as pas remarquée."),
      beat("Hylee", "Alors pourquoi tu es venue ?"),
      beat("Narrateur", "Remerii ouvre la bouche, la referme, puis abandonne enfin l’élégance de sa réponse."),
      beat("Remerii", "Parce que je ne veux pas que notre dernière conversation éventuelle concerne l’état de tes bottes."),
    ],
    resolution: "Elles ne prononcent aucun adieu et ne promettent pas l’impossible. Remerii laisse simplement sa main dans celle d’Hylee assez longtemps pour que le silence dise ce que la guerre n’aura pas le droit d’effacer.",
  });

  function normaliseSpeaker(value) {
    const speaker = String(value || "Narrateur");
    return speaker === "Narrator" ? "Narrateur" : speaker;
  }

  function patchDefinition(periodId, spotId, definition) {
    const patchValue = PATCHES[key(periodId, spotId, definition.id)] || {};
    return {
      ...definition,
      ...patchValue,
      choiceText: { ...(definition.choiceText || {}), ...(patchValue.choiceText || {}) },
      responses: { ...(definition.responses || {}), ...(patchValue.responses || {}) },
    };
  }

  function enrichActivity(context) {
    const definition = context.definition;
    const activity = { ...context.activity };
    const sceneId = key(context.periodId, context.spot.id, definition.id);
    const script = AUTHORED[sceneId];
    if (!script) throw new Error(`Scène de temps libre non écrite : ${sceneId}`);
    activity.opening = (script.opening || []).map(function map(entry) {
      return typeof entry === "string" ? beat("Narrateur", entry) : { speaker: normaliseSpeaker(entry.speaker), text: String(entry.text || "") };
    }).filter(function filter(entry) { return entry.text; });
    activity.miniGame = definition.miniGame || null;
    activity.hiddenTitle = definition.hiddenTitle || null;
    activity.summary = definition.resolution || "Ce moment laisse une trace dans la suite du voyage.";
    activity.choices = (activity.choices || []).map(function map(choice) {
      const branch = script.branches && script.branches[choice.id];
      if (!branch) throw new Error(`Branche de temps libre non écrite : ${sceneId}/${choice.id}`);
      const outcomes = [...branch, ...(script.ending || [])];
      return {
        ...choice,
        response: definition.resolution || choice.response,
        outcome: outcomes.map(function mapBeat(entry) {
          return typeof entry === "string" ? beat("Narrateur", entry) : { speaker: normaliseSpeaker(entry.speaker), text: String(entry.text || "") };
        }).filter(function filter(entry) { return entry.text; }),
      };
    });
    return activity;
  }

  window.SylviniaStoryDialogues = {
    version: 2,
    additions: ADDITIONS,
    patchDefinition,
    enrichActivity,
  };
})();
