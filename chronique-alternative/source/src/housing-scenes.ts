import type { ChoiceData, DialogueLine, Effects, StatKey } from "./game-data";
import type { DisplayItem, HousingProperty } from "./housing-data";

export type HomeDateTone = "amical" | "amoureux" | "desir";

export type HomeGameOption = {
  id: string;
  label: string;
  score: 0 | 1 | 2;
  response: DialogueLine[];
};

export type HomeGameRound = {
  prompt: string;
  detail: string;
  options: HomeGameOption[];
};

export type HomeDateProfile = {
  character: string;
  title: string;
  description: string;
  gift: string;
  activityTitle: string;
  activityInstruction: string;
  arrival: DialogueLine[];
  cityComments: Record<string, DialogueLine>;
  tierComments: DialogueLine[];
  ownItemComment: string;
  otherItemComment: string;
  tones: Record<HomeDateTone, { label: string; detail: string; effects: Effects; lines: DialogueLine[] }>;
  rounds: HomeGameRound[];
  results: { close: DialogueLine[]; warm: DialogueLine[]; perfect: DialogueLine[] };
};

export type HomeMoment = {
  id: string;
  title: string;
  characters: string[];
  intro: DialogueLine[];
  choices: ChoiceData[];
};

export type HomePairDateProfile = {
  id: string;
  characters: [string, string];
  title: string;
  description: string;
  requiredFlags?: string[];
  minStage: number;
  minTrust: number;
  tones: HomeDateTone[];
  opening: DialogueLine[];
  cityComments: Record<string, DialogueLine[]>;
  tierComments: DialogueLine[][];
  toneLines: Record<HomeDateTone, DialogueLine[]>;
  rounds: HomeGameRound[];
  results: { close: DialogueLine[]; warm: DialogueLine[]; perfect: DialogueLine[] };
};

const N = (text: string): DialogueLine => ({ speaker: "Narration", text });
const C = (speaker: string, text: string, mood?: string): DialogueLine => ({ speaker, text, mood });
const P = (text: string): DialogueLine => ({ speaker: "{player}", text });
const CHARACTER_NAMES: Record<string, string> = { hylee: "Hylee", remerii: "Remerii", iriana: "Iriana", tia: "Tia", valurn: "Valurn", naiah: "Naïah", lineva: "Lineva", saidin: "Saidin", bellirith: "Bellirith", amanea: "Amanea", allenna: "Allenna", draven: "Draven" };
const characterName = (id: string) => CHARACTER_NAMES[id] || id.charAt(0).toUpperCase() + id.slice(1);
const O = (id: string, label: string, score: 0 | 1 | 2, ...response: DialogueLine[]): HomeGameOption => ({ id, label, score, response });
const Q = (id: string, text: string, stat: StatKey, response: DialogueLine[], effects: Effects): ChoiceData => ({ id, text, stat, response, effects });

const tier = (character: string, lines: [string, string, string, string, string]): DialogueLine[] => lines.map((text) => C(character, text));
const cities = (character: string, algratal: string, forthaven: string, miraldas: string, akuhn: string): Record<string, DialogueLine> => ({
  algratal: C(character, algratal),
  forthaven: C(character, forthaven),
  miraldas: C(character, miraldas),
  akuhn: C(character, akuhn),
});

export const HOME_DATE_PROFILES: Record<string, HomeDateProfile> = {
  hylee: {
    character: "hylee", title: "La maison qui ne fond pas", description: "Cuisiner avec Hylee, apprivoiser un espace stable et transformer quelques maladresses en souvenirs domestiques.", gift: "homegift-hylee",
    activityTitle: "Dessert sous zéro", activityInstruction: "Aidez Hylee à composer un dessert glacé : texture, température et décoration réagissent à sa magie comme à votre humeur.",
    arrival: [N("Hylee arrive avec un panier trop grand pour elle et un photophore où tombe une neige minuscule."), C("Hylee", "Je voulais offrir quelque chose qui dise ‘merci de m’inviter’ sans dire ‘je me suis déjà imaginée revenir’. J’ai manifestement échoué à rester subtile.", "teasing")],
    cityComments: cities("Hylee", "Ici, même les fenêtres ont l’air de connaître les règles de la cour. La tienne peut apprendre à les oublier.", "On entend la mer avant même d’ouvrir. C’est moins silencieux que Mir’Aldas… mais étrangement rassurant.", "Je connais cette lumière. Pourtant, la voir depuis chez toi lui donne une couleur différente.", "Les feux verts me font encore frissonner. Tant que ta porte s’ouvre de l’intérieur, je peux apprendre à les regarder autrement."),
    tierComments: tier("Hylee", ["C’est petit. Pas étroit : petit comme un endroit qui sait exactement qui il abrite.", "Tu as assez de place pour vivre sans te perdre dans les pièces. J’aime bien cet équilibre.", "On peut respirer ici. Et peut-être danser sans renverser la moitié des meubles.", "J’ai peur de casser quelque chose rien qu’en respirant… mais je reconnais que la vue vaut le risque.", "Si tu cries depuis l’autre bout, il faudra probablement envoyer Medig avec le message."]),
    ownItemComment: "Tu l’as vraiment exposé… La branche de travers aussi. Alors tu as compris pourquoi je refusais de la corriger.", otherItemComment: "Je ne connais pas toute son histoire, mais tu l’as placé comme un souvenir, pas comme un trophée. Ça change tout.",
    tones: {
      amical: { label: "Une soirée refuge", detail: "Cuisiner, rire et lui offrir un lieu où elle n’a rien à prouver.", effects: { affection: 5, trust: 8 }, lines: [P("Ce soir, aucun exercice et aucune attente. Je veux seulement que tu te sentes chez une amie."), C("Hylee", "Alors je réclame le droit de rater le dessert sans transformer l’échec en leçon.", "soft")] },
      amoureux: { label: "Un premier chez-nous", detail: "Faire de la préparation un moment tendre et ouvertement romantique.", effects: { affection: 9, trust: 6, desire: 3 }, lines: [P("J’aimerais que cet endroit garde un peu de toi après ton départ."), C("Hylee", "Tu pourrais commencer par garder mon sourire. Il est déjà partout, apparemment.", "soft")] },
      desir: { label: "Faire monter la température", detail: "Laisser les gestes domestiques devenir un jeu de proximité et de désir.", effects: { affection: 6, trust: 4, desire: 9 }, lines: [P("Le dessert peut attendre. Toi, beaucoup moins."), C("Hylee", "C’est terriblement injuste de dire ça quand je tiens un bol glacé et que mes joues brûlent.", "teasing")] },
    },
    rounds: [
      { prompt: "La crème gèle trop vite autour du fouet.", detail: "Hylee lutte contre son réflexe de forcer le sort.", options: [O("warm", "Entourer le bol de vos mains et réchauffer par petites vagues", 2, N("La glace devient souple sans s’effondrer. Hylee accorde son souffle au vôtre.")), O("break", "Briser la couche et recommencer immédiatement", 1, C("Hylee", "Efficace, mais ce dessert commence à ressembler à un entraînement militaire.")), O("fire", "Approcher le bol directement du feu", 0, N("La préparation se sépare. Hylee sauve le reste dans un nuage de neige consterné."))] },
      { prompt: "Il faut choisir un cœur au dessert.", detail: "Baies acides, miel chaud ou cristal de menthe.", options: [O("berries", "Mêler les baies à une veine de miel", 2, C("Hylee", "Deux choses contraires qui se rendent meilleures. Ne fais aucun commentaire romantique.")), O("mint", "Choisir le cristal le plus spectaculaire", 1, N("Le résultat scintille magnifiquement et craque un peu trop sous la dent.")), O("all", "Tout verser pour ne vexer aucun ingrédient", 0, C("Hylee", "Nous venons d’inventer une menace diplomatique comestible."))] },
      { prompt: "La dernière forme refuse de tenir.", detail: "Le flocon central reste asymétrique.", options: [O("keep", "Garder sa branche irrégulière et signer à deux", 2, N("Hylee pose son doigt près du vôtre. Le flocon tient précisément parce que vous cessez de le corriger.")), O("owl", "Le transformer en petite chouette", 1, C("Hylee", "Medig poursuivra probablement le dessert. Cela compte comme une animation.")), O("perfect", "Lisser chaque branche jusqu’à la symétrie", 0, N("Le résultat est impeccable. Hylee regrette silencieusement la petite erreur qui vous ressemblait."))] },
    ],
    results: { close: [C("Hylee", "Le dessert est discutable. La soirée, beaucoup moins.", "soft")], warm: [C("Hylee", "Je crois que je pourrais m’habituer à fabriquer des choses ici avec toi.", "teasing")], perfect: [N("La neige du photophore s’accorde au dessert achevé."), C("Hylee", "D’accord. Celui-là devient notre recette. Personne ne corrige la branche.", "soft")] },
  },
  remerii: {
    character: "remerii", title: "Une soirée sans programme", description: "Inviter Remerii à classer une bibliothèque qui résiste délicieusement à toute méthode parfaite.", gift: "homegift-remerii",
    activityTitle: "La bibliothèque impossible", activityInstruction: "Classez quelques livres selon des règles mouvantes sans laisser l’organisation dévorer la soirée.",
    arrival: [N("Remerii entre avec un métronome arcanique sous le bras et prétend qu’il s’agit d’un cadeau purement pratique."), C("Remerii", "Il permet de mesurer le silence. J’ai découvert avec contrariété que le vôtre possède parfois un excellent tempo.", "smirk")],
    cityComments: cities("Remerii", "La capitale a déjà décidé ce que votre adresse signifie. Nous pourrons prendre un plaisir méthodique à la faire mentir.", "Le sel attaque les reliures. Votre choix de ville exige donc une bibliothèque fermée — et peut-être davantage de visites de contrôle.", "Vous vous installez à portée de mes archives. C’est une décision dangereusement efficace.", "Akuhn’Nabad conserve mieux ses secrets que ses livres. J’apporterai des protections et aucune question inutile."),
    tierComments: tier("Remerii", ["Chaque objet a une fonction. Même la chaise la plus proche de la théière. Votre prétention manque admirablement d’espace.", "Une pièce de travail, une pièce de repos, et aucune galerie destinée à impressionner des inconnus : raisonnable.", "Le confort est passé avant l’apparat. J’avais préparé une critique ; ce fauteuil vient malheureusement d’affaiblir ma position.", "Cette demeure dispose de davantage de chambres que certaines écoles de magie. Nous trouverons à les rendre utiles.", "J’avais préparé une remarque sur l’excès. La lumière vient malheureusement de rendre mon argument moins solide."]),
    ownItemComment: "Vous exposez une partition annotée plutôt qu’une édition propre. Votre goût du désordre devient parfois étonnamment précis.", otherItemComment: "Sa valeur réside manifestement dans la personne qui vous l’a confié. Voilà un classement que je peux respecter.",
    tones: {
      amical: { label: "Complicité studieuse", detail: "Partager une activité calme sans transformer sa présence en attente.", effects: { affection: 5, trust: 9 }, lines: [P("Je vous ai invitée pour votre compagnie, pas pour obtenir un cours particulier."), C("Remerii", "Excellent. Je pourrai donc critiquer vos rayonnages à titre strictement amical.", "smirk")] },
      amoureux: { label: "Déranger doucement l’ordre", detail: "Glisser une tendresse assumée entre les livres et les silences.", effects: { affection: 8, trust: 7, desire: 4 }, lines: [P("J’aime l’idée que votre désordre puisse rester ici après la soirée."), C("Remerii", "Je ne produis aucun désordre. Cette mèche, ce livre et mon rythme cardiaque sont des anomalies locales.", "calm")] },
      desir: { label: "Changer de mesure", detail: "Faire du classement un prétexte à une proximité beaucoup moins académique.", effects: { affection: 6, trust: 5, desire: 9 }, lines: [P("Si nous classions les livres selon le nombre de fois où vous perdez le fil en me regardant ?"), C("Remerii", "Nous manquerions rapidement de catégories. Continuez l’expérience.", "smirk")] },
    },
    rounds: [
      { prompt: "Premier livre : un traité exact contenant une conclusion fausse.", detail: "La reliure exige une catégorie unique.", options: [O("question", "Rayon des certitudes à rouvrir", 2, C("Remerii", "Une catégorie qui admet sa propre révision. Je la tolère avec enthousiasme.")), O("science", "Sciences exactes", 1, N("Remerii hésite, puis ajoute une note de réserve très visible.")), O("trash", "Le jeter", 0, C("Remerii", "Une erreur conservée avec son contexte instruit davantage qu’un vide satisfait."))] },
      { prompt: "Deuxième livre : un roman sentimental annoté par Remerii.", detail: "Les marges contiennent plus de texte que le chapitre.", options: [O("private", "Le placer dans votre étagère privée", 2, C("Remerii", "Vous n’utiliserez jamais ces annotations contre moi. Je constate simplement leur valeur documentaire.")), O("romance", "Romans", 1, N("Elle l’accepte, non sans retourner discrètement le dos annoté vers le mur.")), O("manual", "Manuels tactiques", 0, C("Remerii", "Je critiquais la syntaxe, pas la stratégie de séduction. Enfin… pas seulement."))] },
      { prompt: "Le métronome accélère devant le dernier ouvrage.", detail: "C’est un carnet vide portant vos deux noms.", options: [O("leave", "Le laisser vide jusqu’à la prochaine visite", 2, N("Remerii arrête le métronome. Le silence devient votre première page.")), O("rule", "Écrire les règles de classement", 1, C("Remerii", "Prévisible. Rassurant. Peut-être un peu lâche.")), O("finish", "Inventer immédiatement une fin parfaite", 0, C("Remerii", "Vous venez de conclure une histoire qui n’a pas commencé. Crime narratif caractérisé."))] },
    ],
    results: { close: [C("Remerii", "Votre classement survivra probablement jusqu’à demain. C’est déjà remarquable.", "calm")], warm: [C("Remerii", "Je reviendrai vérifier le rayon privé. Régulièrement. Par rigueur.", "smirk")], perfect: [N("Le métronome s’arrête sur un silence parfaitement partagé."), C("Remerii", "Ne le relancez pas. Cette mesure-ci peut rester inachevée.", "calm")] },
  },
  iriana: {
    character: "iriana", title: "Une table sans audience", description: "Recevoir Iriana sans protocole et composer un repas dont aucune décision ne concerne l’Empire.", gift: "homegift-iriana",
    activityTitle: "Le menu inutile", activityInstruction: "Composez un repas uniquement à partir de préférences personnelles, sans optimiser prestige, coût diplomatique ni rendement.",
    arrival: [N("Iriana arrive sans escorte visible, un petit oiseau mécanique dissimulé dans sa cape. Il chante faux dès que la porte se ferme."), C("Iriana", "Il ne sert à rien, n’appartient à aucun blason et m’a fait rire. Il constitue donc un cadeau politiquement irréprochable.", "smirk")],
    cityComments: cities("Iriana", "Je connais toutes les portes de cette ville, sauf celle-ci. Il est agréable d’en franchir une sans audience derrière.", "Une adresse à Forthaven vaut une déclaration de confiance envers la ville. Lineva le remarquera avant même moi.", "Mir’Aldas vous offre une indépendance que la cour ne sait pas taxer. J’envie presque cette architecture politique.", "Acheter ici exige davantage que des pièces. Si Amanea vous a laissé signer, cette maison dit déjà quelque chose de votre lien."),
    tierComments: tier("Iriana", ["Une seule pièce oblige chaque visite à être honnête : personne ne peut se réfugier dans un salon secondaire.", "C’est confortable sans chercher à imiter un palais. Une qualité plus rare qu’elle ne devrait l’être.", "Vous pouvez recevoir ici sans transformer votre vie en représentation. J’aurais aimé apprendre cette différence plus tôt.", "La cour interprétera cette demeure comme une ambition. Nous pouvons choisir ensemble de n’en faire qu’un foyer.", "Je connais des salles du palais moins vastes. Pourtant, ici, personne ne peut me convoquer. Voilà le vrai luxe." ]),
    ownItemComment: "Le ruban est ici, sans cadre ni inscription. Merci de l’avoir laissé demeurer une chose que j’ai simplement aimée.", otherItemComment: "Je pourrais demander sa provenance. Je préfère constater que votre maison possède une histoire que la cour n’a pas rédigée.",
    tones: {
      amical: { label: "Dîner sans fonction", detail: "Lui offrir une soirée proche et profondément amicale.", effects: { affection: 5, trust: 10 }, lines: [P("Rien ici ne vous oblige à être princesse, amante ou alliée. Vous pouvez seulement dîner avec moi."), C("Iriana", "Une fonction inexistante dans tous mes protocoles. Je l’accepte.", "calm")] },
      amoureux: { label: "Recevoir Iriana", detail: "Laisser les gestes ordinaires devenir une déclaration tendre.", effects: { affection: 9, trust: 7, desire: 4 }, lines: [P("Je voulais vous accueillir quelque part où votre prénom suffise."), C("Iriana", "Alors prononcez-le encore. La salle semble déjà mieux me connaître que certaines cours.", "calm")] },
      desir: { label: "Faire tomber le protocole", detail: "Transformer les préparatifs en tension franche, loin des regards de cour.", effects: { affection: 6, trust: 5, desire: 10 }, lines: [P("J’ai fermé la porte à la cour. Je n’ai pas l’intention de garder la même distance avec vous."), C("Iriana", "Enfin une règle intérieure que j’ai très envie d’enfreindre.", "smirk")] },
    },
    rounds: [
      { prompt: "Choisir l’entrée.", detail: "Le carnet d’Iriana propose trois plats classés par prestige.", options: [O("child", "La soupe simple qu’elle aimait enfant", 2, C("Iriana", "Personne ne me l’a servie depuis que j’ai été jugée trop âgée pour l’aimer.")), O("court", "L’entrée officielle de la cour", 1, N("Elle la connaît parfaitement et l’apprécie honnêtement, même si la surprise disparaît.")), O("rare", "L’ingrédient le plus rare", 0, C("Iriana", "Nous venons encore de laisser le prix décider à ma place."))] },
      { prompt: "L’oiseau mécanique chante pendant la cuisson.", detail: "Le rythme est atroce mais enthousiaste.", options: [O("dance", "Improviser une danse de cuisine", 2, N("Iriana rate un pas, rit et oublie assez longtemps de surveiller la casserole.")), O("wind", "Le remonter pour finir la chanson", 1, C("Iriana", "Votre endurance artistique mérite une décoration.")), O("silence", "L’enfermer dans un placard", 0, C("Iriana", "C’était sa maison avant d’être la nôtre pour ce soir. Libérez le musicien."))] },
      { prompt: "Le dessert s’est affaissé.", detail: "Il reste délicieux et parfaitement disgracieux.", options: [O("serve", "Le servir tel quel avec deux cuillères", 2, C("Iriana", "Aucune correction, aucune annonce. C’est scandaleusement bon.")), O("repair", "Masquer la chute sous des fruits", 1, N("Iriana reconnaît la manœuvre, mais en apprécie tout de même le résultat.")), O("discard", "Recommencer pour une présentation parfaite", 0, C("Iriana", "Non. Ce soir, l’imperfection a le droit d’arriver à table."))] },
    ],
    results: { close: [C("Iriana", "Le repas n’aurait remporté aucun concours. Je crois que c’est son plus grand mérite.", "calm")], warm: [C("Iriana", "Je reviendrai. La prochaine fois, je choisirai moi-même un plat inutile.", "smirk")], perfect: [N("L’oiseau mécanique entonne sa note la plus fausse."), C("Iriana", "Voici donc le son d’une soirée réussie. La cour serait horrifiée.", "smirk")] },
  },
  valurn: {
    character: "valurn", title: "Le jeu sans mise", description: "Laisser Valurn inventer un jeu domestique où gagner consiste, pour une fois, à ne rien posséder de l’autre.", gift: "homegift-valurn",
    activityTitle: "Les cartes de la maison", activityInstruction: "Piochez des cartes symbolisant portes, objets et souvenirs ; choisissez ce que votre foyer accepte de révéler.",
    arrival: [N("Valurn apporte un jeu de cartes neuves. Une seule est blanche, pliée en deux, et il la pose près de vos objets exposés."), C("Valurn", "J’offre une carte sans valeur. Vous remarquerez l’effort considérable nécessaire pour ne pas lui ajouter une dette.", "charming")],
    cityComments: cities("Valurn", "Une adresse à Al’Gratal vous donne trois voisins espions et cinq occasions de les inviter à boire. Excellent placement.", "Forthaven respecte les portes solides et les départs rapides. Deux qualités que j’ai longtemps confondues avec un foyer.", "Les mages de Mir’Aldas prétendront que votre serrure est conceptuellement imparfaite. Ne leur donnez pas de double.", "Akuhn’Nabad connaît mon nom de famille. J’apprécie énormément que cette porte, elle, ne me demande aucune filiation."),
    tierComments: tier("Valurn", ["Une pièce, une sortie, aucune cache secrète visible. J’aurais pu vivre ici avant d’apprendre de mauvaises habitudes.", "Assez confortable pour rester, assez simple pour partir sans escorte. Séduisant.", "Vous avez manifestement réussi des paris dont vous ne m’avez pas parlé.", "Je pourrais organiser ici une négociation internationale ou une soirée parfaitement indécente. La polyvalence est remarquable.", "Cette demeure possède assez de portes pour mes vieux réflexes. Je vais essayer de n’en surveiller qu’une." ]),
    ownItemComment: "Mon jeton. Vous l’avez exposé au lieu de l’encaisser. Cette décision est financièrement absurde et personnellement redoutable.", otherItemComment: "Chaque objet révèle une personne qui a accepté de vous laisser une trace. Votre collection ressemble moins à un trésor qu’à une liste d’issues devenues des retours.",
    tones: {
      amical: { label: "Cartes sur table", detail: "Faire de la soirée une complicité sans attente romantique.", effects: { affection: 6, trust: 9 }, lines: [P("Pas de séduction obligatoire. J’ai surtout envie que vous restiez jouer."), C("Valurn", "Une invitation sans arrière-pensée. Je vais devoir improviser une personnalité entière.", "amused")] },
      amoureux: { label: "Une raison de revenir", detail: "Lui montrer que votre porte peut devenir un retour plutôt qu’une sortie.", effects: { affection: 9, trust: 7, desire: 4 }, lines: [P("Je veux que vous sachiez où revenir, même quand vous n’avez rien à miser."), C("Valurn", "Vous rendez le mot ‘adresse’ dangereusement émouvant.", "away")] },
      desir: { label: "Tricher avec la distance", detail: "Faire des règles une provocation et de la partie un prélude.", effects: { affection: 6, trust: 5, desire: 10 }, lines: [P("Chaque manche perdue retire une couche de mauvaise foi."), C("Valurn", "Je suis soudain prêt à perdre avec un sérieux exemplaire.", "charming")] },
    },
    rounds: [
      { prompt: "Carte : la Porte entrouverte.", detail: "Elle n’indique pas si quelqu’un entre ou repart.", options: [O("return", "Y dessiner une silhouette qui revient", 2, C("Valurn", "Revenir : le mouvement le plus difficile à croire. Gardons cette carte avant que mon cynisme ne réclame une seconde lecture.")), O("open", "L’ouvrir complètement", 1, N("Valurn approuve l’issue disponible, même s’il regarde encore le seuil.")), O("lock", "Ajouter trois verrous", 0, C("Valurn", "Une prison confortable reste un très mauvais foyer."))] },
      { prompt: "Carte : l’Objet sans prix.", detail: "Valurn vous tend un crayon rouge.", options: [O("memory", "Écrire le souvenir plutôt qu’une valeur", 2, N("Il retourne discrètement le jeton exposé pour en relire la tranche vide.")), O("one", "Inscrire une pièce symbolique", 1, C("Valurn", "Un prix ridicule, donc presque honnête.")), O("auction", "Lancer des enchères imaginaires", 0, C("Valurn", "Je reconnais la technique. Je reconnais aussi pourquoi nous voulions l’éviter."))] },
      { prompt: "Dernière carte : votre maison.", detail: "Le dessin n’a encore aucun occupant.", options: [O("blank", "Laisser de la place aux prochaines visites", 2, C("Valurn", "Une carte qui ne décide pas qui reste. J’aurais aimé grandir dans ce jeu.")), O("names", "Écrire vos deux noms au crayon", 1, N("Il sourit, touché, puis ajoute une gomme près de la carte comme garantie de liberté.")), O("claim", "Écrire « à moi » sur toute la surface", 0, C("Valurn", "La maison, peut-être. Les personnes, jamais."))] },
    ],
    results: { close: [C("Valurn", "J’ai perdu deux manches et conservé toutes mes libertés. Votre jeu manque délicieusement de rentabilité.", "amused")], warm: [C("Valurn", "Gardez la carte blanche. J’aimerais revenir voir ce que nous n’y avons pas encore écrit.", "away")], perfect: [N("Valurn glisse la carte de la maison sous son verre au lieu de l’emporter."), C("Valurn", "Une mise laissée ici volontairement. Prenez la mesure historique du geste.", "charming")] },
  },
  naiah: {
    character: "naiah", title: "Trois vérités dans un salon", description: "Laisser Naïah métamorphoser votre intérieur sans lui permettre de cacher la soirée sous ses illusions.", gift: "homegift-naiah",
    activityTitle: "Le vrai, le faux et le souhaité", activityInstruction: "Naïah transforme trois détails du logis. Distinguez l’illusion, la vérité et ce qu’elle aimerait rendre réel.",
    arrival: [N("Naïah entre par la fenêtre, puis rouvre ostensiblement la porte pour recommencer son arrivée. Elle dépose une lanterne violette sur la table."), C("Naïah", "La luciole est fausse, la lanterne est vraie et j’ai réellement hésité douze minutes devant ta porte. Première énigme gratuite.", "smirk")],
    cityComments: cities("Naïah", "Al’Gratal a beaucoup trop de fenêtres pour une ville qui adore les secrets. J’approuve ce défaut.", "La mer détruit mes brumes et recommence chaque matin. Je pourrais finir par respecter cette insolence.", "Le Dôme rend toutes les illusions légèrement prétentieuses. Les miennes se sentent enfin comprises.", "Je connais la vue… pas depuis une maison où je peux partir quand je veux. Ce détail change la ville entière."),
    tierComments: tier("Naïah", ["Petit, caché, facile à transformer. Cette pièce a d’excellentes dispositions criminelles.", "Tu as juste assez de murs pour que je puisse en déplacer un sans provoquer de crise architecturale.", "C’est beau sans avoir l’air de vouloir t’avaler. J’aime bien.", "Je pourrais créer trois bals différents ici et n’inviter personne. Très tentant.", "Ce lieu est absurdement grand. Promets-moi qu’une pièce restera inutile." ]),
    ownItemComment: "Ma tasse… Tu as même laissé la fêlure tournée vers la lumière. Elle n’a jamais été aussi bien regardée au palais.", otherItemComment: "Je pourrais inventer une histoire plus spectaculaire. Mais la vraie trace sur ton visage quand tu le regardes est déjà meilleure.",
    tones: {
      amical: { label: "Cabane au milieu du monde", detail: "Jouer, parler et protéger une amitié sans ambiguïté imposée.", effects: { affection: 7, trust: 8 }, lines: [P("Tu peux transformer les murs. Pas besoin de transformer ce que nous sommes pour que la soirée compte."), C("Naïah", "Une amitié assez solide pour survivre à un plafond violet. J’accepte le défi.", "laugh")] },
      amoureux: { label: "Laisser une vraie trace", detail: "Choisir la tendresse derrière le spectacle.", effects: { affection: 9, trust: 7, desire: 4 }, lines: [P("Je veux savoir ce que tu laisserais ici si tu ne pouvais pas le cacher dans la brume."), C("Naïah", "Peut-être moi. Une soirée. Ne prends pas cet aveu pour une habitude.", "thinking")] },
      desir: { label: "Jouer avec les reflets", detail: "Laisser les illusions amplifier une tension déjà bien réelle.", effects: { affection: 6, trust: 5, desire: 10 }, lines: [P("Je veux retrouver la vraie Naïah parmi toutes celles qui me provoquent."), C("Naïah", "Mauvaise nouvelle : elles ont toutes la même idée pour la suite.", "smirk")] },
    },
    rounds: [
      { prompt: "Le mur s’ouvre sur une forêt impossible.", detail: "Un seul détail vient de la mémoire de Naïah.", options: [O("rain", "Suivre l’odeur de pluie sur la pierre", 2, C("Naïah", "C’était la cuisine d’Allenna et moi. Tu as trouvé le souvenir sous le spectacle.")), O("moon", "Choisir la lune la plus brillante", 1, N("Elle éclate en lucioles ravies d’avoir été remarquées.")), O("door", "Fermer immédiatement l’illusion", 0, C("Naïah", "Tu pouvais simplement me demander de la réduire."))] },
      { prompt: "Trois versions de votre table apparaissent.", detail: "L’une montre ce que Naïah souhaiterait y voir demain.", options: [O("breakfast", "Choisir les deux tasses du petit-déjeuner", 2, N("Naïah rougit avant de pouvoir remplacer l’image par quelque chose de plus insolent.")), O("feast", "Choisir le banquet spectaculaire", 1, C("Naïah", "Joli. Trop de couverts et pas assez de vérité.")), O("empty", "Choisir la table parfaitement vide", 0, N("L’illusion s’éteint ; la vraie Naïah garde les yeux sur la tasse qu’elle avait ajoutée."))] },
      { prompt: "Votre reflet prend la main de Naïah avant vous.", detail: "Elle sourit, mais attend votre décision réelle.", options: [O("real", "Ignorer le reflet et tendre votre vraie main", 2, N("Toutes les copies disparaissent dès que ses doigts rejoignent les vôtres.")), O("race", "Défier le reflet de vous devancer", 1, C("Naïah", "Enfin une compétition suffisamment absurde.")), O("watch", "Laisser l’illusion jouer la scène à votre place", 0, C("Naïah", "Je t’ai invité·e, pas ta doublure prudente."))] },
    ],
    results: { close: [C("Naïah", "Tu as trouvé assez de vrai pour que je n’aie pas besoin de gagner.", "thinking")], warm: [C("Naïah", "Je laisserai la lanterne. Comme ça, une de mes illusions aura officiellement ton adresse.", "smirk")], perfect: [N("La dernière illusion disparaît. La pièce réelle paraît plus intime qu’avant."), C("Naïah", "Voilà. Aucun truc. Juste moi qui ai très envie de rester.", "thinking")] },
  },
  lineva: {
    character: "lineva", title: "Une relève à domicile", description: "Assembler une maquette avec Lineva, entre copeaux, café solide et plaisanteries de quai.", gift: "homegift-lineva",
    activityTitle: "Le navire qui ne part pas", activityInstruction: "Assemblez avec Lineva une petite maquette destinée à rester sur une étagère, sans fonction militaire ni urgence.",
    arrival: [N("Lineva vérifie instinctivement les fenêtres, les issues et le verrou, puis dépose une maquette de navire encore inachevée."), C("Lineva", "Je l’ai commencée pendant une relève calme. Comme aucune catastrophe n’a suivi, je tente de considérer cela comme un loisir.", "thoughtful")],
    cityComments: cities("Lineva", "La capitale est loin de la mer mais proche de toutes les tempêtes politiques. Votre toit semble correctement amarré.", "Forthaven, donc. Je pourrais vous parler du vent, des remparts et du prix du sel. La vérité, c’est que savoir votre porte ici me fait quelque chose de beaucoup moins tactique.", "Ici, les défenses sont magiques et les rapports météorologiques inutiles. Je comprends pourquoi les mages dorment mieux.", "Une maison au cœur d’Akuhn’Nabad exige du courage et une excellente serrure. Vous semblez posséder les deux."),
    tierComments: tier("Lineva", ["Fonctionnel, solide et impossible à remplir de réunions. Excellent.", "Vous avez investi dans le confort sans sacrifier les issues. Bonne décision.", "Une vraie demeure. Il faudra simplement définir qui surveille quoi… Non. Pardon. Aucun tableau de garde.", "Cette maison pourrait loger un état-major. Interdiction formelle d’en profiter.", "Je pourrais perdre une patrouille entière dans cette chambre. La vue justifie presque l’absurdité." ]),
    ownItemComment: "La clé… Je vous l’avais confiée pour me rappeler de ne pas rouvrir le coffre. L’exposer me rappelle surtout que j’y suis arrivée.", otherItemComment: "Vous gardez les preuves de ce que les gens vous confient. C’est une responsabilité que je comprends.",
    tones: {
      amical: { label: "Coque, café et aucun ordre du jour", detail: "Partager un loisir et les plaisanteries sèches qui l’accompagnent.", effects: { affection: 6, trust: 10 }, lines: [P("On assemble ce navire, on boit le café et personne ne rédige de rapport."), C("Lineva", "Marché conclu. Le café reste toutefois passible d’inspection.", "thoughtful")] },
      amoureux: { label: "Une place au port", detail: "Construire une proximité tendre autour d’un objet qui restera chez vous.", effects: { affection: 9, trust: 8, desire: 4 }, lines: [P("J’aimerais que vous laissiez la maquette ici. Cela vous donnera une raison concrète de revenir."), C("Lineva", "Il faudra vérifier la coque régulièrement. Et la personne qui la garde.", "thoughtful")] },
      desir: { label: "Après la dernière pièce", detail: "Laisser les mains s’attarder lorsque la maquette sera terminée.", effects: { affection: 6, trust: 6, desire: 10 }, lines: [P("Terminez la maquette. Ensuite, occupez-vous de moi avec la même précision."), C("Lineva", "Demande recevable. Je compte vérifier chaque détail.", "smirk")] },
    },
    rounds: [
      { prompt: "Choisir la coque.", detail: "Une pièce parfaite est trop lourde ; une autre porte une légère fêlure.", options: [O("repair", "Réparer la coque légère avec elle", 2, C("Lineva", "Assez solide pour tenir, assez légère pour vivre. Bon choix.")), O("heavy", "Prendre la coque militaire", 1, N("La maquette devient stable, massive et un peu triste.")), O("pretty", "Choisir uniquement la plus jolie", 0, C("Lineva", "Elle ne tiendra pas deux manipulations. Même un loisir mérite de durer."))] },
      { prompt: "Les voiles refusent de s’aligner.", detail: "Lineva commence à dresser une liste de corrections.", options: [O("crooked", "Garder une voile légèrement de travers", 2, N("Elle proteste, puis admet que le navire semble enfin poussé par un vrai vent.")), O("measure", "Mesurer chaque fil", 1, C("Lineva", "Précis. Nous avions toutefois promis une soirée avant l’aube.")), O("remove", "Retirer toutes les voiles", 0, C("Lineva", "Ce n’est plus un navire, c’est un coffre ambitieux."))] },
      { prompt: "Il faut baptiser le navire.", detail: "Aucun nom de bataille ni de souverain n’est requis.", options: [O("home", "Le Retour", 2, N("Lineva reste longtemps silencieuse avant de graver le nom.")), O("joke", "L’Insubmersible Théière", 1, C("Lineva", "Les marins vont composer une chanson atroce. J’accepte.")), O("victory", "La Victoire de Lineva", 0, C("Lineva", "Je préférerais un navire qui puisse exister sans devenir mon monument."))] },
    ],
    results: { close: [C("Lineva", "Il flotte très mal sur une étagère. Je découvre que c’est exactement sa mission.", "thoughtful")], warm: [C("Lineva", "Gardez-le ici. J’aurai une raison concrète de vérifier son état.", "smirk")], perfect: [N("La maquette baptisée Le Retour rejoint vos objets."), C("Lineva", "Ce navire n’a aucune urgence. Nous non plus, pour le reste de la soirée.", "thoughtful")] },
  },
  saidin: {
    character: "saidin", title: "L’heure qui appartient à la maison", description: "Construire avec Saidin une horloge incapable de prédire la moindre seconde future.", gift: "homegift-saidin",
    activityTitle: "L’horloge du présent", activityInstruction: "Réglez trois mécanismes pour qu’ils indiquent ce qui existe maintenant plutôt que ce qui arrivera ensuite.",
    arrival: [N("Saidin apporte une montre dont le cadran ne possède qu’une seule aiguille. Elle indique obstinément maintenant."), C("Saidin", "Elle refuse demain, ignore hier et possède donc davantage de sagesse que la plupart des archimages.", "mysterious")],
    cityComments: cities("Saidin", "J’ai vu mille versions d’Al’Gratal. Aucune ne contenait exactement cette porte avant que vous ne la choisissiez.", "La mer rend les avenirs flous. Chaque vague efface la certitude de la précédente ; votre maison bénéficie d’un excellent voisinage temporel.", "Mir’Aldas me connaît trop bien. Votre foyer pourrait devenir l’une des rares pièces où l’on ne vient pas demander demain.", "Akuhn’Nabad survit dans des futurs que l’Empire refuse d’imaginer. Habiter ici est déjà une réponse au temps officiel."),
    tierComments: tier("Saidin", ["Une petite pièce contient moins de futurs possibles. C’est reposant.", "Vous avez laissé assez d’espace au hasard sans lui offrir un palais entier.", "Cette maison semble prête à durer. Je ferai l’effort de la découvrir journée après journée.", "Je vois déjà vingt usages possibles pour chaque salon. Je vais n’en choisir aucun avant ce soir.", "Les grandes demeures donnent l’illusion d’échapper au temps. Celle-ci est belle précisément parce qu’elle n’y échappera pas." ]),
    ownItemComment: "L’aiguille est immobile et pourtant vous lui avez donné une place. Merci de ne pas exiger qu’elle prouve son utilité.", otherItemComment: "Je pourrais vous raconter son avenir. Je préfère vous demander le souvenir présent qui vous l’a fait choisir.",
    tones: {
      amical: { label: "Une heure ordinaire", detail: "Lui offrir une amitié entièrement ancrée dans le présent.", effects: { affection: 6, trust: 10 }, lines: [P("Aucun avenir à interpréter. J’avais juste envie de passer cette heure avec vous."), C("Saidin", "Une invitation que même moi ne peux compliquer sans effort. Merci.", "surprised")] },
      amoureux: { label: "Un futur à ne pas regarder", detail: "Faire de la soirée une promesse tendre, sans demander de garantie.", effects: { affection: 9, trust: 8, desire: 4 }, lines: [P("Je ne sais pas combien de fois vous reviendrez. J’ai seulement envie que celle-ci existe."), C("Saidin", "Alors je ne compterai aucune autre visite pendant celle-ci.", "surprised")] },
      desir: { label: "Perdre le fil des secondes", detail: "Transformer l’expérience en proximité imprévisible et sensuelle.", effects: { affection: 6, trust: 6, desire: 10 }, lines: [P("Si l’horloge fonctionne, elle devra expliquer pourquoi cette minute devient si longue."), C("Saidin", "Je pourrais vérifier. Je préfère manifestement l’éprouver.", "mysterious")] },
    },
    rounds: [
      { prompt: "Le premier rouage tourne vers hier.", detail: "Il rejoue le bruit de la porte avant l’arrivée de Saidin.", options: [O("reverse", "Le retourner sans écouter la répétition", 2, C("Saidin", "Vous refusez une seconde parfaite pour préserver celle qui arrive. Bien.")), O("study", "Mesurer le décalage", 1, N("La curiosité ralentit le travail, sans l’empêcher.")), O("loop", "Rejouer son arrivée jusqu’à la rendre parfaite", 0, C("Saidin", "À la troisième répétition, ce ne serait déjà plus une arrivée."))] },
      { prompt: "Le second mécanisme propose trois futurs.", detail: "Dîner brûlé, baiser inattendu ou visite interrompue.", options: [O("blank", "Effacer les trois prédictions", 2, N("Le cadran devient blanc. Saidin sourit à cette ignorance construite ensemble.")), O("kiss", "Choisir le futur séduisant", 1, C("Saidin", "Tentant. Mais il vient de cesser d’être inattendu.")), O("avoid", "Écarter seulement le mauvais futur", 0, C("Saidin", "Contrôler la peur reste une manière de laisser demain gouverner la pièce."))] },
      { prompt: "La dernière aiguille attend une unité.", detail: "Secondes, battements ou rencontres.", options: [O("heartbeat", "La régler sur vos deux battements présents", 2, N("L’aiguille hésite entre vos rythmes puis invente une mesure commune.")), O("seconds", "Conserver les secondes ordinaires", 1, C("Saidin", "Parfois, l’ordinaire est déjà une victoire.")), O("forever", "L’inscrire sur l’éternité", 0, C("Saidin", "L’éternité écrase souvent ce qu’elle prétend honorer."))] },
    ],
    results: { close: [C("Saidin", "L’horloge ne prévoit rien. Elle accomplit donc parfaitement sa fonction.", "surprised")], warm: [C("Saidin", "Je reviendrai sans consulter la date. Cette phrase me paraît encore extraordinaire.", "mysterious")], perfect: [N("La montre et l’horloge battent ensemble pendant une seule minute."), C("Saidin", "Celle-ci n’existera qu’une fois. Restons jusqu’au bout.", "surprised")] },
  },
  bellirith: {
    character: "bellirith", title: "Un miroir qui ne flatte pas", description: "Recevoir Bellirith sans scène publique et jouer avec une image qui ne lui obéit pas.", gift: "homegift-bellirith",
    activityTitle: "Le portrait honnête", activityInstruction: "Composez un portrait de Bellirith à partir de trois choix que son charme ne peut influencer.",
    arrival: [N("Bellirith entre sans bijoux enchantés et apporte un miroir au tain légèrement imparfait."), C("Bellirith", "Il ne flatte personne. J’ai pensé qu’il ferait un cadeau délicieusement hostile — puis j’ai eu envie de me regarder dedans chez toi.", "thoughtful")],
    cityComments: cities("Bellirith", "Al’Gratal transforme chaque salon en théâtre. Le tien pourrait devenir l’endroit où je rate enfin une entrée.", "Forthaven se méfie de moi avec une franchise rafraîchissante. Ta porte est la première à ne pas ressembler à un poste de contrôle.", "Les miroirs de Mir’Aldas montrent les auras avant les visages. Ici, tu m’as laissé décider seule de ce que je voulais refléter.", "Akuhn’Nabad connaît toutes mes anciennes performances. Cette maison pourrait apprendre la femme qui rentre après."),
    tierComments: tier("Bellirith", ["Une petite chambre empêche toute sortie spectaculaire. Tu es cruellement ingénieux·se.", "Du confort sans scène centrale. Je vais devoir attirer ton regard par des moyens presque honnêtes.", "Cette demeure te ressemble : assez belle pour séduire, assez habitée pour ne pas mendier l’admiration.", "Je pourrais y organiser un bal. Je préfère la pensée beaucoup plus scandaleuse de n’y inviter que toi.", "Enfin un décor à la hauteur de mon mauvais goût pour le sublime. Gardons au moins un coin parfaitement banal." ]),
    ownItemComment: "Mon gant. Tu exposes précisément l’objet qui rend mon pouvoir inutile. Je n’avais pas prévu que cela me toucherait autant.", otherItemComment: "Je reconnais la différence entre un objet choisi pour impressionner et un objet gardé parce qu’une personne manque parfois. Celui-ci appartient à la seconde catégorie.",
    tones: {
      amical: { label: "Sans conquête", detail: "Construire une proximité amicale où elle n’a personne à séduire.", effects: { affection: 7, trust: 9 }, lines: [P("Tu n’as rien à gagner ici. J’ai envie de ta compagnie, pas de ta performance."), C("Bellirith", "Terrifiant. Je vais devoir découvrir si je sais être intéressante sans victoire.", "thoughtful")] },
      amoureux: { label: "La femme après la scène", detail: "Lui offrir une romance calme qui regarde au-delà du masque.", effects: { affection: 9, trust: 8, desire: 4 }, lines: [P("J’aimerais que le miroir garde la femme qui est arrivée, pas celle que le monde attend."), C("Bellirith", "Alors reste près de moi lorsque je regarderai.", "thoughtful")] },
      desir: { label: "Séduire sans magie", detail: "Laisser la tension se construire uniquement par les mots, les regards et les gestes choisis.", effects: { affection: 6, trust: 6, desire: 11 }, lines: [P("Aucun charme. Je veux voir jusqu’où tu peux me troubler seulement en étant toi."), C("Bellirith", "Tu viens de choisir la version la plus dangereuse du jeu.", "seductive")] },
    },
    rounds: [
      { prompt: "Choisir le premier trait du portrait.", detail: "Bellirith propose beauté, puissance ou désir.", options: [O("effort", "La femme qui fait l’effort de ne pas contrôler la réponse", 2, N("Son sourire vacille. Le miroir garde précisément cette imperfection.")), O("beauty", "Sa beauté", 1, C("Bellirith", "Vrai, agréable et si prévisible que je pourrais presque me reposer dedans.")), O("danger", "Son danger", 0, C("Bellirith", "Encore une image qui me rend intéressante à condition de rester une menace."))] },
      { prompt: "Choisir une couleur qui lui appartient.", detail: "Le rose de son aura, le noir de ses bijoux ou une teinte absente de ses costumes.", options: [O("new", "Un bleu calme qu’elle ne porte jamais", 2, C("Bellirith", "Une couleur sans réputation. J’ignorais pouvoir en désirer une.")), O("pink", "Le rose spectaculaire", 1, N("Elle reconnaît sa force, même si le portrait reste proche de son masque.")), O("black", "Le noir le plus profond", 0, C("Bellirith", "Tu peins encore l’ombre avant de regarder la personne."))] },
      { prompt: "Le miroir demande une expression finale.", detail: "Bellirith prépare déjà son sourire parfait.", options: [O("wait", "Attendre qu’elle oublie de poser", 2, N("Le sourire véritable arrive lorsqu’elle croit l’exercice terminé.")), O("smile", "Choisir son sourire le plus séduisant", 1, C("Bellirith", "Excellent techniquement. Intime comme une affiche de bal.")), O("sad", "Exiger une vulnérabilité", 0, C("Bellirith", "La sincérité arrachée devient encore une performance."))] },
    ],
    results: { close: [C("Bellirith", "Le portrait n’est pas parfait. J’y reconnais pourtant quelqu’un que j’aimerais revoir.", "thoughtful")], warm: [C("Bellirith", "Laisse le miroir ici. Je veux découvrir quel visage il me rendra lors de ma prochaine visite.", "thoughtful")], perfect: [N("Le miroir conserve un instant le sourire surpris de Bellirith."), C("Bellirith", "Tu as obtenu une image que je ne savais pas fabriquer. C’est terriblement séduisant.", "seductive")] },
  },
  amanea: {
    character: "amanea", title: "La reine invitée à dîner", description: "Accueillir Amanea dans une maison où sa couronne ne lui donne aucune place réservée.", gift: "homegift-amanea",
    activityTitle: "La table sans titres", activityInstruction: "Disposez un souper où chaque objet doit être choisi pour une personne et jamais pour son rang.",
    arrival: [N("Amanea arrive sous une cape simple, sans garde dans l’embrasure. Elle apporte une coupe de basalte dont aucun emblème ne précise le rang."), C("Amanea", "Elle vient des cuisines basses. On y boit sans toast, sans témoin et sans historien. Cela m’a paru approprié.", "smile")],
    cityComments: cities("Amanea", "Habiter la capitale impériale sans lui appartenir demande une insolence que je respecte.", "Forthaven connaît le prix des murailles et celui des absences. Une maison ici constitue une promesse plus grave qu’un acte notarié.", "Mir’Aldas protège son indépendance sous un Dôme. J’espère que ta porte possède la même volonté.", "Tu as choisi Akuhn’Nabad. Ma confiance a réduit le prix ; elle n’a pas acheté ta décision. C’est ce qui lui donne sa valeur."),
    tierComments: tier("Amanea", ["J’ai connu des cellules plus vastes et des palais moins libres. Cette pièce appartient clairement à la seconde catégorie.", "Une demeure sobre. Elle n’a pas besoin d’intimider pour tenir debout.", "Tu peux recevoir ici sans cour. C’est un privilège que les souverains apprennent trop tard à envier.", "Cette maison pourrait devenir un lieu de pouvoir. Garde au moins une table où aucune décision politique n’est admise.", "Je devrais juger cet excès. Je préfère constater que personne ne s’incline lorsque tu traverses ton propre salon." ]),
    ownItemComment: "Le sceau vierge. Tu exposes l’ordre que je n’ai pas donné. Peut-être est-ce la trace la plus fidèle que j’aie laissée.", otherItemComment: "Les souverains collectionnent les serments. Toi, tu collectionnes les choses offertes librement. Continue ainsi.",
    tones: {
      amical: { label: "Amanea, sans couronne", detail: "Lui offrir une amitié adulte qui ne cherche ni faveur ni romance.", effects: { affection: 7, trust: 10 }, lines: [P("Tu peux rester comme mon amie. Je ne te demande ni faveur, ni aveu, ni place différente."), C("Amanea", "Une table où l’on ne négocie pas mon affection. Voilà un territoire rare.", "smile")] },
      amoureux: { label: "Recevoir la femme", detail: "Faire du dîner une intimité tendre, séparée du trône.", effects: { affection: 9, trust: 8, desire: 5 }, lines: [P("J’ai invité Amanea. La reine peut attendre près de la porte."), C("Amanea", "Elle protestera. Je compte bien l’ignorer jusqu’au matin.", "smile")] },
      desir: { label: "Fermer la porte au royaume", detail: "Laisser son intensité répondre à la vôtre dans un lieu qui n’obéit qu’à ses habitants.", effects: { affection: 7, trust: 6, desire: 11 }, lines: [P("Ici, ta voix ne commande rien. Elle peut pourtant me demander de venir plus près."), C("Amanea", "Alors viens. Je n’ai nul besoin d’un trône pour être entendue.", "rictus")] },
    },
    rounds: [
      { prompt: "Choisir la place d’Amanea.", detail: "Le fauteuil d’honneur domine la table ; une chaise simple vous place côte à côte.", options: [O("side", "Deux chaises identiques côte à côte", 2, C("Amanea", "Aucune hauteur à abandonner. Je pourrais prendre goût à cette géographie.")), O("honor", "Le fauteuil d’honneur", 1, N("Elle s’y assied par habitude, puis regarde la distance créée.")), O("kneel", "Lui offrir la place et rester debout", 0, C("Amanea", "Je suis venue dîner avec toi, pas recruter un sujet."))] },
      { prompt: "Choisir la vaisselle.", detail: "Porcelaine impériale, basalte obscurci ou deux bols dépareillés.", options: [O("mixed", "Les deux bols dépareillés", 2, C("Amanea", "Aucune dynastie ne revendiquera notre soupe. Parfait.")), O("basalt", "Le basalte d’Akuhn’Nabad", 1, N("Amanea apprécie la pierre, tout en laissant l’emblème tourné vers la table.")), O("imperial", "La porcelaine impériale", 0, C("Amanea", "Je refuse de faire de ce repas une nouvelle victoire de Tia."))] },
      { prompt: "Un messager frappe avec une question urgente mais non critique.", detail: "Amanea tend déjà la main vers sa cape.", options: [O("allenna", "Confier la réponse à Allenna et resservir le vin", 2, N("Amanea reste. Le monde continue sous une autre main compétente.")), O("brief", "Laisser une réponse courte", 1, C("Amanea", "Un compromis acceptable. La prochaine question attendra.")), O("go", "Transformer le dîner en audience", 0, C("Amanea", "Tu viens de rendre le trône à la femme que tu avais invitée à le quitter."))] },
    ],
    results: { close: [C("Amanea", "Le royaume a survécu au repas. J’en suis presque offensée.", "smile")], warm: [C("Amanea", "Je reviendrai avec du miel et sans messager. Allenna considérera cela comme un progrès politique.", "smile")], perfect: [N("La couronne reste dans la cape jusqu’à la fin du repas."), C("Amanea", "Cette table n’a pas reçu la Reine Noire. Elle a reçu Amanea. Garde-lui une place.", "smile")] },
  },
  allenna: {
    character: "allenna", title: "La bataille qui tient sur une table", description: "Inviter Allenna à déployer un vieux jeu de stratégie, défendre des positions absurdes et disputer une soirée sans victime réelle.", gift: "homegift-allenna",
    activityTitle: "Le siège des quatre bols", activityInstruction: "Placez les pions, choisissez les provisions et remportez la partie sans transformer le salon en véritable quartier général.",
    arrival: [N("Allenna entre avec une boîte plate sous le bras. Elle en sort une carte de tissu, des pions dépareillés et quatre petits bols destinés aux provisions."), C("Allenna", "Jeu de siège. Les règles officielles sont mauvaises ; les miennes ont survécu à six campagnes de caserne.", "smirk")],
    cityComments: cities("Allenna", "La capitale possède trop de gardes pour que chacun voie encore ce qu’il protège. Ici, la serrure défend une personne précise. C’est plus simple.", "Le sel abîme les lames et nettoie certaines plaies. Forthaven sait qu’une chose peut nuire et sauver selon l’usage.", "Les mages réparent souvent avant d’avoir regardé la blessure. Ta maison me paraît heureusement moins pressée de prouver sa puissance.", "Je connais chaque ronde de ce quartier. Il est étrange d’y trouver désormais une porte devant laquelle je peux m’arrêter sans rapport."),
    tierComments: tier("Allenna", ["Une seule pièce : aucune issue ne peut être négligée et aucun silence ne peut se cacher très loin.", "Solide, mesuré, assez confortable pour désapprendre la veille pendant une heure.", "Une vraie maison. Je pourrais y laisser une lame sans croire que je prépare déjà mon départ.", "Trop de chambres pour une seule personne. Assez, peut-être, pour qu’une autre cesse de demander si elle dérange.", "Je pourrais y établir une infirmerie complète. Je ne le ferai pas. Rappelle-le-moi si je commence à mesurer les portes."]),
    ownItemComment: "Tu as gardé le fil de suture dans son étui fermé. Merci de te souvenir du soin plutôt que de la plaie.", otherItemComment: "Tu ne ranges pas les gens selon leur utilité. Les objets qu’ils te laissent le prouvent mieux que tes discours.",
    tones: {
      amical: { label: "Alliance de circonstance", detail: "Former une équipe redoutable et garder la soirée franchement amicale.", effects: { affection: 7, trust: 9 }, lines: [P("Je prends le col. Tu gardes les provisions. Alliance jusqu'à la fin de la partie."), C("Allenna", "Une alliance limitée, claire et avantageuse. J'accepte.", "smirk")] },
      amoureux: { label: "Une revanche très proche", detail: "Laisser les mains se rejoindre au-dessus des pions et le jeu devenir tendrement personnel.", effects: { affection: 9, trust: 8, desire: 5 }, lines: [P("Je crois que tu protèges surtout le pion près de ma main."), C("Allenna", "Je vérifiais si cette position te ferait sourire. Résultat concluant.", "shy")] },
      desir: { label: "Changer le terrain", detail: "Faire de chaque pion capturé une raison de réduire la distance.", effects: { affection: 7, trust: 6, desire: 11 }, lines: [P("Chaque capture retire une règle ou une distance."), C("Allenna", "Vous venez de rendre la défaite tactiquement attirante.", "smirk")] },
    },
    rounds: [
      { prompt: "Allenna fortifie immédiatement le col central.", detail: "Une victoire sûre laisse pourtant les quatre bols de provisions à portée de votre raid.", options: [O("raid", "Sacrifier deux pions et voler ses provisions", 2, C("Allenna", "Coûteux, déloyal et remarquablement efficace.")), O("front", "Attaquer directement le col", 1, N("Le choc est honorable et parfaitement prévisible.")), O("wait", "Attendre sans modifier votre position", 0, C("Allenna", "L'inaction n'est pas une stratégie parce qu'on la regarde longtemps."))] },
      { prompt: "Une tempête fictive coupe la carte en deux.", detail: "Vos armées doivent coopérer un tour ou perdre ensemble.", options: [O("bridge", "Construire un pont avec vos pions couchés", 2, N("Allenna complète l'ouvrage avec son meilleur éclaireur et salue l'absurdité du règlement modifié.")), O("share", "Partager un seul passage", 1, C("Allenna", "Praticable. Le prochain tour dira lequel de nous regrette cette courtoisie.")), O("deny", "Prétendre que la tempête n'existe pas", 0, C("Allenna", "Le climat ne négocie pas avec votre confiance."))] },
      { prompt: "La dernière manche se joue avec un pion chacun.", detail: "Allenna cache son intention derrière un visage beaucoup trop neutre.", options: [O("feint", "L'embrasser puis capturer son pion", 2, C("Allenna", "Manœuvre illégale.")), O("draw", "Proposer l'égalité et une revanche", 1, C("Allenna", "Acceptable si la revanche commence maintenant.")), O("surrender", "Abandonner sans jouer", 0, C("Allenna", "Je refuse une victoire qui n'a pas tenté de me surprendre."))] },
    ],
    results: { close: [C("Allenna", "La carte a tenu. Votre flanc gauche beaucoup moins.", "smirk")], warm: [C("Allenna", "Laissez les pions ici. Une revanche gagne à disposer d'une adresse fixe.", "shy")], perfect: [N("Allenna aligne les deux derniers pions, puis les couche côte à côte plutôt que d'annoncer un vainqueur."), C("Allenna", "Égalité provisoire. Je reviendrai la contester.", "shy")] },
  },
  tia: {
    character: "tia", title: "Une table sans décret", description: "Recevoir Tia dans un lieu où aucun protocole n’a prévu sa place et composer avec elle une soirée qui n’aura pas valeur de précédent.", gift: "homegift-tia",
    activityTitle: "Le sceau qui ne gouverne rien", activityInstruction: "Gravez un sceau domestique destiné à fermer des recettes, des invitations et des souvenirs — jamais des ordres.",
    arrival: [N("Tia arrive sans héraut, mais exactement à l’heure. Elle dépose un coffret de cire claire et observe la pièce comme un territoire sans carte officielle."), C("Tia", "J’ai congédié l’escorte au coin de la rue. Cette décision n’autorise aucun commentaire triomphant.", "neutral")],
    cityComments: cities("Tia", "Al’Gratal croit que toute porte finit par appartenir à l’Empire. La vôtre vient de lui opposer une exception intéressante.", "Forthaven confond parfois autonomie et insubordination. Cette maison possède au moins la courtoisie de ne pas brandir sa serrure.", "Mir’Aldas protège son indépendance avec une élégance que je trouve irritante. Votre accueil la rend momentanément tolérable.", "Entrer ici sans armée aurait jadis été considéré comme une folie. Je préfère penser que le monde a appris autre chose que la peur."),
    tierComments: tier("Tia", ["Peu d’espace, donc peu de possibilités de transformer une visite en cérémonie. C’est efficace.", "Cette demeure ne cherche pas à imiter un rang supérieur au sien. Une qualité rare.", "Vous avez construit du confort sans le présenter comme une faiblesse. Je comprends ce choix.", "Un domaine assez vaste pour accueillir une cour, mais vous n’en avez invité qu’une personne. J’ai remarqué.", "Le palais possède davantage de salles. Aucune où je puisse fermer la porte sans que l’Empire attende derrière."]),
    ownItemComment: "Vous avez exposé la matrice sans l’utiliser. Un sceau peut donc conserver une décision qu’on choisit de ne pas imposer.", otherItemComment: "Chaque objet témoigne d’une loyauté librement accordée. L’Empire sous-estime trop souvent la solidité de ce genre de lien.",
    tones: {
      amical: { label: "Une audience sans demande", detail: "Partager une confiance exigeante, sans tenter de lui arracher une douceur prématurée.", effects: { affection: 6, trust: 10 }, lines: [P("Je ne demande aucune faveur. J’avais simplement envie que vous voyiez comment je vis."), C("Tia", "Une audience sans requête. Vous venez de rendre le protocole presque inutile.", "thinking")] },
      amoureux: { label: "L’invitation personnelle", detail: "Nommer une tendresse adulte sans transformer son hésitation en reddition.", effects: { affection: 9, trust: 8, desire: 4 }, lines: [P("Je n’ai pas invité l’Impératrice. Je ne vous demanderai pas non plus de cesser de l’être."), C("Tia", "Vous persistez à distinguer ce que j’avais organisé pour rester inséparable.", "troubled")] },
      desir: { label: "Aucune distance officielle", detail: "Laisser l’autorité rencontrer un désir consenti, hors de toute obligation impériale.", effects: { affection: 7, trust: 7, desire: 10 }, lines: [P("Ici, votre titre ne peut ni m’ordonner d’approcher ni m’interdire de le vouloir."), C("Tia", "Alors ne confondez surtout pas mon consentement avec une concession.", "smirk")] },
    },
    rounds: [
      { prompt: "Choisir la forme du sceau.", detail: "Tia propose spontanément les armes Farae, puis s’interrompt.", options: [O("open", "Une porte entrouverte sans blason", 2, C("Tia", "Une frontière qui décide de s’ouvrir sans disparaître. Le symbole est plus rigoureux qu’il n’en a l’air.")), O("farae", "Conserver les armes familiales", 1, N("La gravure est impeccable, mais le nouvel objet raconte encore une histoire ancienne.")), O("broken", "Une couronne brisée", 0, C("Tia", "La provocation remplace rarement une pensée complète."))] },
      { prompt: "La cire refuse de prendre l’empreinte parfaite.", detail: "Une petite fissure traverse chaque essai.", options: [O("keep", "Garder la fissure comme partie du motif", 2, N("Tia examine longtemps l’imperfection, puis grave une ligne identique dans la matrice elle-même.")), O("warm", "Réchauffer doucement la cire et réessayer", 1, C("Tia", "Une correction patiente. Je l’accepte, sans prétendre qu’elle règle tout.")), O("force", "Appuyer jusqu’à effacer la fissure", 0, C("Tia", "Vous avez obtenu une surface lisse et détruit le relief. Démonstration utile."))] },
      { prompt: "Il faut décider de la première enveloppe à fermer.", detail: "Aucun document officiel ne se trouve sur la table.", options: [O("invitation", "Écrire une invitation pour une prochaine soirée", 2, N("Tia la date, hésite devant la formule de politesse, puis signe seulement de son prénom.")), O("recipe", "Sceller une recette choisie ensemble", 1, C("Tia", "Un secret d’État dont la sécurité repose sur notre capacité à ne pas brûler le miel.")), O("decree", "Inventer un décret domestique", 0, C("Tia", "Vous venez de rendre à l’Empire la soirée que nous tentions de lui soustraire."))] },
    ],
    results: { close: [C("Tia", "Le sceau fonctionne. Sa finalité demeure inhabituellement modeste — ce n’est pas une critique.", "thinking")], warm: [C("Tia", "Conservez la cire. Je pourrais avoir une autre enveloppe qui ne concerne personne d’autre.", "troubled")], perfect: [N("L’invitation scellée reste sur votre table alors que Tia aurait pu l’emporter."), C("Tia", "Vous connaissez déjà la réponse. J’exige néanmoins que vous me laissiez le droit de l’écrire.", "troubled")] },
  },
  draven: {
    character: "draven", title: "Le port dans une bouteille", description: "Partager avec Draven une soirée autour d’une carte, d’un nœud marin et d’un foyer où il n’a ni flotte à commander ni âge à dissimuler.", gift: "homegift-draven",
    activityTitle: "La bouteille de relève", activityInstruction: "Montez une miniature de port en choisissant ce qui doit rester sous la responsabilité de la génération suivante.",
    arrival: [N("Draven apporte un nœud marin fixé sur une petite planche et l’accroche près de la porte après avoir demandé votre permission."), C("Draven", "Un nœud de relève. Il tient parce que deux cordages partagent la charge, pas parce que l’un étrangle l’autre.", "approving")],
    cityComments: cities("Draven", "Al’Gratal ne sent ni le sel ni le bois mouillé. Votre maison aura besoin d’une fenêtre ouverte et d’un café plus fort.", "Vous avez acheté à Forthaven. La ville ne vous devra rien pour ce choix, mais elle saura que vous avez décidé de rester.", "Les mages bâtissent des maisons comme s’ils négociaient avec la gravité. Tant que le toit tient, je ne commenterai pas davantage.", "Akuhn’Nabad et Forthaven connaissent chacune les sièges. Votre foyer pourrait leur rappeler ce que l’on protège réellement."),
    tierComments: tier("Draven", ["Solide, sec, chauffé. Beaucoup de marins appelleraient déjà cela du luxe.", "Assez de place pour accueillir sans transformer l’endroit en quartier général.", "Une vraie maison. Ne laissez personne vous convaincre qu’elle doit devenir un symbole.", "Cette demeure pourrait loger douze officiers. N’en invitez pas douze.", "J’ai commandé depuis des palais moins vastes. Heureusement, vous ne m’avez pas invité pour commander." ]),
    ownItemComment: "Ma boussole. Elle a mené assez de navires ; la voir immobile ici ne me déplaît pas.", otherItemComment: "Un objet donné mérite qu’on se souvienne aussi de la personne, pas seulement du moment héroïque. Vous semblez le savoir.",
    tones: {
      amical: { label: "Un verre entre adultes", detail: "Partager une confiance calme, sans attente romantique.", effects: { affection: 7, trust: 10 }, lines: [P("Je voulais votre compagnie, Draven. Aucun rapport et aucune tentative de vous remplacer auprès de Lineva."), C("Draven", "Bon. J’ai apporté de quoi boire, et je refuse de gâcher une invitation honnête en rédigeant un ordre du jour.", "approving")] },
      amoureux: { label: "Le détour inutile", detail: "Nommer une attirance adulte sans l’enrober de gratitude ni de respect hiérarchique.", effects: { affection: 9, trust: 8, desire: 4 }, lines: [P("Je ne vous ai pas invité comme amiral, mentor ou père de quelqu’un. C’est vous que j’attendais."), C("Draven", "Bon sang. J’avais préparé trois réponses raisonnables. Aucune ne survit à cette phrase.", "gruff"), N("Son regard reste sur vous avec une chaleur brusquement dépourvue d’alibi.")] },
      desir: { label: "Pas besoin de carte", detail: "Reconnaître le désir entre vous et lui laisser une direction qu’aucun grade ne décide.", effects: { affection: 7, trust: 7, desire: 10 }, lines: [P("Je sais exactement pourquoi je vous ai demandé de rester. Et vous ?"), C("Draven", "Je suis vieux, pas mort. Fermez la porte avant que je formule ça de manière moins civilisée.", "approving"), N("Il vous laisse pourtant choisir vous-même la distance qui disparaît.")] },
    },
    rounds: [
      { prompt: "Placer la tour de commandement.", detail: "Elle peut dominer le port ou rejoindre les ateliers.", options: [O("among", "La placer parmi les ateliers", 2, C("Draven", "Le commandement voit mieux lorsqu’il ne regarde pas seulement d’en haut.")), O("high", "La placer au sommet", 1, N("La vue est excellente, la distance avec les quais aussi.")), O("none", "La retirer entièrement", 0, C("Draven", "Partager l’autorité ne signifie pas nier la responsabilité."))] },
      { prompt: "Une figurine représente Lineva.", detail: "Draven la tient encore près de l’ancien poste de l’Amiral.", options: [O("own", "Lui donner son propre quai", 2, N("Il déplace la figurine sans corriger son orientation.")), O("beside", "La placer à côté de Draven", 1, C("Draven", "Mieux qu’en dessous. Pas encore tout à fait sa place.")), O("behind", "La mettre à l’abri derrière la tour", 0, C("Draven", "La protéger de sa propre fonction reviendrait à lui retirer son commandement."))] },
      { prompt: "La dernière corde doit relier le port au large.", detail: "Elle peut retenir le navire ou guider son retour.", options: [O("guide", "En faire une ligne de retour lâche", 2, C("Draven", "Une route, pas une laisse. Exactement.")), O("anchor", "L’amarrer solidement", 1, N("Le navire reste sûr mais incapable de choisir la mer.")), O("cut", "Couper toute liaison", 0, C("Draven", "L’autonomie n’exige pas l’abandon."))] },
    ],
    results: { close: [C("Draven", "Le port tiendra. Peut-être même sans que je vérifie chaque corde.", "approving")], warm: [C("Draven", "Gardez la miniature. La prochaine fois, Lineva corrigera probablement notre plan.", "gruff")], perfect: [N("Draven pose sa figurine sur un navire en partance et laisse celle de Lineva au commandement."), C("Draven", "Voilà. Une relève n’efface personne. Elle permet enfin à chacun d’avoir une route.", "approving")] },
  },
};

const EMPTY_DISPLAY_COMMENTS: Record<string, string> = {
  hylee: "Oh, tout est encore vide. On pourrait y mettre un souvenir sérieux, un souvenir ridicule et… quelque chose qui soit les deux à la fois.",
  remerii: "Trois emplacements vacants. Je pourrais vous proposer un système de classement ; je vais plutôt attendre de voir quelles histoires résistent à vos catégories.",
  iriana: "Trois places que personne n’a encore remplies à votre place. Même une galerie impériale offre rarement un luxe aussi simple.",
  valurn: "Trois places vides et aucune dette accrochée au mur. Votre décoration manque d’ambition criminelle, mais elle commence admirablement.",
  naiah: "Trois places vides ? Parfait. J’ai une grenouille empaillée, une fausse relique et quelque chose qui mord. Tu me laisses choisir l’ordre ?",
  lineva: "C’est vide, mais pas abandonné. Ça attend juste des choses qui auront mérité leur place. C’est plutôt sain.",
  saidin: "Trois absences bien exposées. Elles ne resteront pas vides ; la seule question intéressante est de savoir quels souvenirs vous surprendront.",
  bellirith: "Trois places nues. Elles attirent déjà le regard sans le supplier — qualité que bien des gens pourraient leur envier.",
  amanea: "Trois places libres. Ne les remplis pas pour prouver que tu as vécu. Attends qu’une histoire exige elle-même d’être gardée.",
  allenna: "Trois emplacements, aucune obligation de les combler. Un foyer n’est pas un rapport d’inventaire. J’essaie de m’en souvenir.",
  tia: "Ces places sont vides, non négligées. La distinction est importante. Vous déciderez de ce qui mérite d’y demeurer.",
  draven: "Rien pour l’instant. Bien. Une maison n’a pas besoin de médailles avant d’avoir des souvenirs.",
};

const DISPLAY_COMMENTS: Record<string, Array<(item: DisplayItem) => string>> = {
  hylee: [
    (item) => `${item.name} a l’air d’attendre qu’on raconte son histoire de travers. Les meilleurs souvenirs font ça : ils refusent de rester bien rangés.`,
    (item) => `Je parie que ${item.name} ne rappelle pas la même chose selon l’heure. Tu me raconteras la version du soir ?`,
    (item) => `${item.name} rend la pièce moins parfaite et beaucoup plus vivante. Oui, c’est un compliment.`,
  ],
  remerii: [
    (item) => `${item.name} a manifestement été placé selon une logique affective. Elle est impossible à mesurer et, contre toute attente, parfaitement lisible.`,
    (item) => `Je pourrais vous demander la provenance de ${item.name}. Votre manière de le regarder constitue déjà une réponse plus exacte.`,
    (item) => `${item.name} déséquilibre légèrement l’ensemble. Ne le déplacez surtout pas : ce serait ruiner la seule erreur intéressante de cette étagère.`,
  ],
  iriana: [
    (item) => `${item.name} serait accompagné d’un cartel et d’une version officielle au palais. Ici, votre silence lui permet enfin de raconter autre chose.`,
    (item) => `Vous avez laissé ${item.name} visible sans l’utiliser pour impressionner. C’est une forme de pouvoir que la cour comprend très mal.`,
    (item) => `${item.name} révèle davantage par la place que vous lui accordez que par sa valeur. Vous le saviez, naturellement.`,
  ],
  valurn: [
    (item) => `${item.name} trône ici sans prix, sans piège et sans contrat. Je commence à soupçonner cette maison de mauvaises fréquentations.`,
    (item) => `Vous regardez ${item.name} comme une promesse déjà tenue. C’est moins rentable qu’une dette, mais beaucoup plus difficile à voler.`,
    (item) => `${item.name} possède une excellente place pour écouter les conversations. Je lui ferai payer son silence plus tard.`,
  ],
  naiah: [
    (item) => `${item.name} est beaucoup trop sage. Je peux lui inventer une malédiction, un ancien propriétaire louche et deux jambes pendant la nuit.`,
    (item) => `Tu fais cette tête chaque fois que tu regardes ${item.name}. La tête “je ne suis pas ému·e, c’est la poussière”. Très convaincante.`,
    (item) => `${item.name} ne sert à rien et reste quand même. J’approuve cette philosophie avec une objectivité parfaite.`,
  ],
  lineva: [
    (item) => `${item.name} est posé là où on le voit sans qu’il gêne le passage. Pratique, personnel, pas prétentieux. Bon choix.`,
    (item) => `Je ne connais pas la moitié de l’histoire de ${item.name}, mais tu ne le regardes pas comme du butin. Ça me suffit.`,
    (item) => `${item.name} a quelques marques. Tant mieux. Les choses intactes ont rarement fait grand-chose.`,
  ],
  saidin: [
    (item) => `${item.name} a déjà changé de sens depuis son arrivée ici. Les objets voyagent moins loin que nous et vieillissent parfois plus vite.`,
    (item) => `Vous pourriez me raconter l’histoire de ${item.name}. Je préfère encore celle que votre regard hésite à formuler.`,
    (item) => `${item.name} se trouve exactement là où je ne l’aurais pas prévu. Voilà qui lui confère une valeur inattendue.`,
  ],
  bellirith: [
    (item) => `${item.name} attire ton regard avant le mien. Je devrais être jalouse ; je suis surtout curieuse de savoir qui t’a appris cette tendresse.`,
    (item) => `Tu as offert à ${item.name} une place sans le mettre en scène. C’est presque indécent, cette absence de manipulation.`,
    (item) => `${item.name} porte les traces de quelqu’un d’autre. Rassure-toi, je sais parfois partager une pièce avec un souvenir.`,
  ],
  amanea: [
    (item) => `${item.name} n’est ni un emblème ni une preuve. Tu l’as gardé parce qu’il compte. L’Empire aurait déjà gravé une devise dessous.`,
    (item) => `Quelqu’un demeure autour de ${item.name}. Pas un fantôme : une conséquence. C’est souvent plus tenace.`,
    (item) => `${item.name} a trouvé sa place sans conquête et sans permission. Une réussite assez rare pour être remarquée.`,
  ],
  allenna: [
    (item) => `${item.name} est entretenu, mais pas poli au point d’effacer son usage. Tu conserves la trace, pas une relique.`,
    (item) => `Je ne demanderai pas qui t’a confié ${item.name}. La façon dont tu l’as placé indique déjà que cette confiance demeure active.`,
    (item) => `${item.name} n’occupe pas l’espace inutilement. Il rappelle quelque chose dont tu as encore besoin. C’est une fonction suffisante.`,
  ],
  tia: [
    (item) => `${item.name} ne porte aucune inscription destinée aux visiteurs. Vous l’avez donc conservé pour vous-même. C’est… raisonnable.`,
    (item) => `La valeur officielle de ${item.name} m’échappe. Sa valeur à vos yeux, beaucoup moins.`,
    (item) => `${item.name} a été placé sans symétrie parfaite. Je m’apprêtais à le corriger. Je ne le ferai pas.`,
  ],
  draven: [
    (item) => `${item.name} a servi, ou vous a servi à tenir. C’est une meilleure raison de l’exposer que n’importe quel blason.`,
    (item) => `Je pourrais demander d’où vient ${item.name}. Vous me le direz quand le récit ne ressemblera plus à un interrogatoire.`,
    (item) => `${item.name} n’est pas là pour faire joli. Tant mieux : les maisons trop propres donnent envie de marcher au garde-à-vous.`,
  ],
};

export function homeDateOpening(profile: HomeDateProfile, property: HousingProperty, items: DisplayItem[]): DialogueLine[] {
  const lines = [...profile.arrival, profile.cityComments[property.location], profile.tierComments[property.tier - 1]];
  if (!items.length) {
    lines.push(C(characterName(profile.character), EMPTY_DISPLAY_COMMENTS[profile.character]));
    return lines;
  }
  items.forEach((item, index) => {
    lines.push(N(`${item.name} attire son regard parmi les objets exposés.`));
    const comment = item.character === profile.character
      ? profile.ownItemComment
      : `${DISPLAY_COMMENTS[profile.character][index % DISPLAY_COMMENTS[profile.character].length](item)} ${index === 0 ? profile.otherItemComment : ""}`.trim();
    lines.push(C(characterName(profile.character), comment));
  });
  return lines;
}

type ResidentReply = { beat: string; line: string };

const RESIDENT_REPLIES: Record<string, Array<[ResidentReply, ResidentReply, ResidentReply]>> = {
  hylee: [
    [
      { beat: "Son inquiétude éclate en rire. Elle vous cède un coin de vitre et dessine aussitôt une lune beaucoup trop grande.", line: "D’accord, mais je refuse la prison. Notre peine sera de finir le paysage avant le soleil." },
      { beat: "Son doigt reste suspendu sur une petite maison de givre. Elle n’avait pas remarqué qu’elle lui avait dessiné deux fenêtres éclairées.", line: "Je croyais faire une montagne. Apparemment, ma main avait une autre idée… On peut la garder jusqu’à midi ?" },
      { beat: "Hylee vient poser son épaule contre la vôtre. La première branche fond sans qu’elle tente de la sauver.", line: "C’est joli aussi quand ça disparaît doucement. Surtout si je ne suis pas la seule à regarder." },
    ],
    [
      { beat: "Hylee brandit une cuillère de garniture comme une épée et pose un pied sur une chaise.", line: "Le royaume sera collant, mais il survivra. Sa reine exige maintenant une dégustation héroïque." },
      { beat: "La cuillère redescend. Elle gratte du pouce une tache de farine sur le plan de travail.", line: "Remerii me fait essayer un sort devant deux maîtres demain. Je sais que je peux le faire… mon ventre n’a pas reçu l’information." },
      { beat: "Elle vous tend un torchon, puis garde l’autre. La croûte brûlée craque entre vos gestes coordonnés.", line: "Alors ce n’est pas une défaite. C’est juste une cuisine qui aura besoin d’aération et de beaucoup de mauvaise foi." },
    ],
    [
      { beat: "Elle vous drape dans la cape et recule pour juger le résultat avec un sérieux théâtral.", line: "Elle te va beaucoup trop bien. Je vais devoir rester près de toi si je veux la récupérer un jour." },
      { beat: "Hylee regarde les deux chaises, puis en tire une tout contre la vôtre.", line: "Je choisis celle-là. Enfin… aujourd’hui. C’est rassurant de pouvoir changer demain sans être chassée." },
      { beat: "Elle laisse la cape telle quelle. Un pan glisse au sol ; cette fois, elle ne se précipite pas pour le ramasser.", line: "Lentement, ça me va. J’ai passé assez de temps à croire qu’il fallait mériter chaque chaise." },
    ],
    [
      { beat: "Hylee attrape un tisonnier comme une lance et se place derrière vous avec un courage très dépendant de votre présence.", line: "Je propose ‘Griffe-la-Poubelle’. Si le monstre est un chat, il sera humilié avant même le combat." },
      { beat: "Sa respiration se bloque, puis reprend plus bas. Elle acquiesce sans chercher à sourire tout de suite.", line: "À l’auberge, un bruit la nuit annonçait rarement quelque chose de gentil. Ici… ici, je peux apprendre un autre bruit." },
      { beat: "Elle s’assied au sol, dos au canapé, et vous ménage une place contre elle.", line: "Alors on veille. Mais au prochain craquement, tu inventes l’histoire rassurante. Moi, je fais le chocolat." },
    ],
  ],
  remerii: [
    [
      { beat: "Remerii fixe le second objet déplacé, pince les lèvres, puis en décale volontairement un troisième.", line: "Votre protocole manque de toute rigueur. Il produit néanmoins des résultats étrangement libérateurs." },
      { beat: "Son regard quitte le tiroir pour se poser sur vous. La justesse de la remarque l’agace assez pour la faire sourire.", line: "Je déteste lorsque vous formulez en une phrase ce que je comptais analyser pendant trois jours." },
      { beat: "Elle ferme le tiroir avec une lenteur cérémonieuse et pose les deux mains à plat dessus.", line: "S’il s’effondre, nous rédigerons demain une élégie pour l’ordre perdu. Pas avant le petit-déjeuner." },
    ],
    [
      { beat: "Elle tente de vous faire taire, puis cède au troisième duc sanglotant avec une indignité particulièrement inspirée.", line: "Votre duchesse ressemble à un corbeau enrhumé. Continuez : le texte en devient presque défendable." },
      { beat: "Remerii garde un doigt entre les pages. Son expression se dépouille un instant de toute ironie.", line: "Personne ne risque de mourir si je manque un indice. Cette médiocrité possède donc une vertu que je n’avais pas prévue." },
      { beat: "La chaleur revient dans la tasse. Elle tourne une page, puis incline le livre afin que vous puissiez lire avec elle.", line: "Le chapitre reste mauvais. Votre présence améliore toutefois sensiblement les conditions de l’étude." },
    ],
    [
      { beat: "Remerii résiste exactement deux secondes avant de s’enrouler dans la couverture avec vous. Son rire disparaît dans le tissu.", line: "Cette méthode est inadmissible, inefficace et remarquablement chaude. Je suspends donc mon jugement." },
      { beat: "Elle défait elle-même un angle trop net et observe le pli retomber de travers.", line: "Une préférence peut être proposée. Une règle exige une raison. J’avais oublié de vérifier laquelle des deux je vous imposais." },
      { beat: "Vos mains reprennent le geste ensemble. Remerii abandonne le dernier coin imparfait et s’assied dessus pour empêcher toute rechute.", line: "Voilà. L’erreur est désormais structurelle. Il serait irresponsable d’y toucher." },
    ],
    [
      { beat: "Votre première casserole manque le temps. À la seconde, Remerii déplace le métronome pour vous laisser une vraie place dans la mesure.", line: "Vous êtes rythmiquement coupable, mais musicalement utile. C’est une catégorie nouvelle." },
      { beat: "Elle écoute la bouilloire répondre au métronome et laisse son sourire apparaître sans le corriger.", line: "L’ordinaire ne demande peut-être pas à être élevé. Il suffisait que je cesse de parler par-dessus." },
      { beat: "Elle modifie la phrase pour y faire entrer le choc des deux tasses. Le morceau s’achève sur ce son minuscule.", line: "Ne buvez pas encore. Cette cadence-ci avait besoin de vous pour conclure." },
    ],
  ],
  iriana: [
    [
      { beat: "Iriana plonge la main dans le panier sans regarder et en ressort une poire. Elle la lève comme un sceptre.", line: "Le décret est promulgué. Toute contestation devra être déposée après dégustation." },
      { beat: "Elle cesse de parcourir mentalement les conséquences d’un simple repas. Un sourire calculé devient, peu à peu, un vrai sourire.", line: "Une envie sans justification… Voilà une forme de gouvernement dangereusement séduisante." },
      { beat: "Son regard passe d’une assiette à l’autre, puis choisit la plus simple. Elle attend votre réaction avant de comprendre qu’il n’y en aura pas.", line: "Vous n’alliez vraiment pas interpréter mon choix. Je pourrais m’habituer à cette absence d’analyse — chez vous seulement." },
    ],
    [
      { beat: "Iriana vous regarde fabriquer le coussin, puis corrige volontairement son inclinaison pour le rendre plus pompeux encore.", line: "La couronne exige apparemment un trône. Je crains que son goût ne soit devenu déplorable en mon absence." },
      { beat: "Elle effleure la marque laissée par le diadème sur son front, comme si elle découvrait qu’elle pouvait s’effacer.", line: "Je reste moi-même. La difficulté consiste à découvrir qui cela désigne lorsque personne ne me regarde régner." },
      { beat: "Le déclic du coffret traverse l’entrée. Iriana s’en éloigne sans se retourner et glisse sa main dans la vôtre.", line: "Qu’il y reste. Si l’Empire me cherche, il pourra commencer par apprendre à attendre." },
    ],
    [
      { beat: "Elle jauge la lettre comme un adversaire, puis la repousse d’un doigt vers le bord de la table.", line: "Le dessert devra être excellent. Vous venez de miser contre l’inépuisable créativité administrative de ma famille." },
      { beat: "Iriana observe votre reflet dans la vitre plutôt que le sceau derrière elle.", line: "La princesse reviendra quand j’aurai fini d’écouter la pluie. Iriana, elle, est déjà exactement où elle le souhaite." },
      { beat: "Le silence s’installe sans se transformer en attente. Après un long moment, elle pose sa tête contre votre épaule.", line: "Vous êtes redoutable. Vous ne me demandez rien, et je finis tout de même par rester." },
    ],
    [
      { beat: "Iriana sort du lit avec une dignité ruinée par ses cheveux et compose aussitôt une quatrième note pire que les trois premières.", line: "L’hymne officiel de cette maison devra être interdit dans au moins deux royaumes." },
      { beat: "Elle remonte l’oiseau et le regarde battre inutilement des ailes.", line: "On m’a appris que toute chose devait servir. Il m’a fallu beaucoup plus de temps pour comprendre que la joie était déjà une fonction." },
      { beat: "La chanson fausse reprend. Son rire reste bas, intime, sans public à convaincre.", line: "Une seule fois, aviez-vous dit. Je vous préviens : demain, je nierai avoir demandé la seconde." },
    ],
  ],
  valurn: [
    [
      { beat: "Valurn ne sursaute presque pas lorsque vous ouvrez la fenêtre. Sa main, elle, a déjà trouvé le couteau sous le livre.", line: "Très drôle. Mon progrès psychologique vient de déposer une plainte pour sabotage aggravé." },
      { beat: "Il écoute la porte, puis votre respiration. Le couteau retourne lentement sous la couverture.", line: "Je connais surtout la personne assez mal élevée pour entrer sans réclamer de prix. C’est statistiquement rassurant." },
      { beat: "Il décale le livre afin de vous garder dans sa vision périphérique, puis reprend exactement à la ligne interrompue.", line: "Vous n’avez rien remarqué. Votre talent pour la discrétion mérite une récompense que je ne vous donnerai pas." },
    ],
    [
      { beat: "Il invente la clause sept sur-le-champ et exige que le dessert soit livré avec intérêts composés.", line: "L’arbitrage sera truqué, naturellement. Je tiens à préserver le sérieux juridique de cette maison." },
      { beat: "Le sourire demeure, mais ses doigts cessent de jouer avec la fausse facture.", line: "Un cadeau gratuit ressemble beaucoup à un piège quand on a grandi chez les experts. J’essaie de distinguer les deux." },
      { beat: "Valurn attend le contre-service. Comme rien ne vient, il plie la facture et la glisse dans sa poche.", line: "Vous êtes d’une irresponsabilité comptable bouleversante. Merci… Ne prenez pas l’habitude de me faire prononcer ce mot." },
    ],
    [
      { beat: "La flamme s’élève comme vexée. Valurn lui fait une révérence avant d’inciser le pain.", line: "Son Altesse Croustillante Première régnera peu, mais avec une mie irréprochable." },
      { beat: "L’ombre du sourire s’efface. Il regarde ses paumes, éclairées par un feu qui ne détruit rien.", line: "Bhaal appelait cela gaspiller un héritage. J’appelle cela cuire sans massacrer les voisins. Nous avons des critères différents." },
      { beat: "L’odeur du pain remplit la pièce. Valurn finit par s’asseoir au sol, contre le four, sans surveiller la flamme à chaque seconde.", line: "Si quelqu’un apprend que j’ai trouvé la paix devant une miche, je vous accuse de sorcellerie domestique." },
    ],
    [
      { beat: "Il examine les coussins entassés dans le sac, puis s’allonge dessus avec une gravité de martyr.", line: "Me voici vaincu par le confort. Dites à mes ennemis que ma fin fut honteusement moelleuse." },
      { beat: "Valurn passe un doigt sur la boucle ouverte. Son sourire ne parvient pas tout à fait à détourner la question.", line: "Une sortie visible rend le choix de rester plus honnête. Ce soir, le sac restera vide. N’en faites pas une cérémonie." },
      { beat: "Il ferme finalement le sac et vous le tend au lieu de le reprendre.", line: "Rangez-le où je pourrai le retrouver. C’est une consigne de sécurité, surtout pas une preuve de confiance." },
    ],
  ],
  naiah: [
    [
      { beat: "La couronne devient si grande qu’elle avale la moitié de la constellation. Naïah ricane et vous ajoute des moustaches stellaires.", line: "Voilà. Souverain·e du Très Mauvais Goût. Je suis ton unique conseillère, donc tout est perdu." },
      { beat: "Les étoiles vacillent. Elle fait mine de corriger une branche alors que son regard s’est brusquement adouci.", line: "Ne prends pas cet air intelligent. J’ai juste raté une menace et obtenu… ça. Par accident cosmique." },
      { beat: "Naïah s’allonge près de vous. Une étoile descend assez bas pour se poser sur le bout de son nez avant de disparaître.", line: "Tu n’as pas le droit de t’endormir avant moi. C’est mon ciel, j’établis les règles." },
    ],
    [
      { beat: "La plante vous traite immédiatement d’escroc. Naïah, cachée derrière la porte, étouffe un rire beaucoup trop reconnaissable.", line: "Elle exige trois biscuits et l’exil définitif de son interprète. Personnellement, je trouve ses demandes raisonnables." },
      { beat: "La feuille la plus haute s’incline vers vous. Naïah sort de sa cachette avec une moue faussement désinvolte.", line: "Une maison silencieuse oublie vite les gens. Je lui ai donné une meilleure mémoire, c’est tout." },
      { beat: "Elle modifie le sort pour que la plante ait sa propre voix, grave et scandalisée.", line: "Elle reste. Mais si elle révèle où je cache les sucreries, je l’envoie vivre chez Allenna." },
    ],
    [
      { beat: "Le faux couloir se couvre aussitôt de pancartes absurdes : ‘Conseil secret’, ‘Cuisine interdite’ et ‘Allenna dehors’.", line: "Enfin une institution sérieuse. Première décision : les réunions se font couchées et les comptes rendus sont comestibles." },
      { beat: "Naïah vérifie votre visage comme si elle cherchait le piège caché derrière l’offre.", line: "Une vraie place ? Avec une porte que personne ne condamne ? C’est suspect. J’accepte pour mener l’enquête." },
      { beat: "Elle choisit le recoin le moins pratique, précisément parce qu’on y voit la fenêtre depuis le sol.", line: "Celui-là. Et tu n’as pas le droit de l’appeler ‘le coin de Naïah’ devant les autres. Sauf si ça les rend jaloux." },
    ],
    [
      { beat: "Ses cheveux se dressent davantage lorsqu’elle s’incline avec une majesté offensée.", line: "Enfin quelqu’un reconnaît mon autorité capillaire. Mon premier décret interdit les peignes jusqu’à midi." },
      { beat: "La réplique qu’elle préparait meurt derrière ses dents. Elle baisse les yeux vers ses mains nues de toute illusion.", line: "Et si je ne fais rien, tu ne t’ennuies pas ? Question théorique. Réponds bien." },
      { beat: "Naïah boit, grimace parce que le thé est trop chaud, puis ne transforme la grimace en aucun spectacle.", line: "Ce matin est terriblement mal écrit. Il ne se passe rien… J’aimerais bien voir combien de temps ça peut durer." },
    ],
  ],
  lineva: [
    [
      { beat: "Lineva inspecte le canapé, lui donne une tape militaire sur l’accoudoir et vous rend un salut impeccable.", line: "Structure stable. Deux coussins indisciplinés. Aucune perte. Rapport accepté." },
      { beat: "Elle garde la main à quelques centimètres du verrou, puis la laisse retomber.", line: "À Forthaven, le troisième contrôle sauvait parfois des vies. Ici, il m’empêche surtout de m’asseoir. J’apprends la différence." },
      { beat: "Après la dernière fenêtre, elle s’effondre à côté de vous et étend les jambes sans élégance.", line: "Terminé. Si la maison tombe maintenant, elle aura au moins attendu qu’on soit confortablement installés." },
    ],
    [
      { beat: "Lineva vous rend la relève avec une tasse en guise de gourde et prend son poste devant la cafetière.", line: "Relève acceptée. Menace principale : manque de café. On devrait tenir jusqu’à l’aube." },
      { beat: "Sa mâchoire se serre. Elle regarde la porte comme si quelqu’un, très loin, attendait encore son retour.", line: "Dormir, c’était laisser les autres tenir le mur. J’ai su leur faire confiance au combat. Pas encore dans ma tête." },
      { beat: "Elle prend la première tasse trop vite, se brûle, jure à mi-voix et finit par sourire de sa propre précipitation.", line: "Ne répète pas que l’Amirale a perdu un duel contre du café. J’ai une réputation médiocre à protéger." },
    ],
    [
      { beat: "Lineva vous tend une minuscule lime comme s’il s’agissait d’une promotion officielle.", line: "Assistant·e provisoire. Si vous cassez la quille, je nie vous avoir recruté·e." },
      { beat: "Elle fait tourner la maquette vers la lumière. Les nouvelles voiles ne sont pas symétriques, mais elles tiennent.", line: "Pas de date, pas de rapport, pas de père qui vérifie. Juste… l’envie de voir si elle peut naviguer demain." },
      { beat: "Vos copeaux se mêlent sur la table. Lineva ne reprend votre pièce qu’une seule fois, puis vous laisse finir.", line: "Pas mal. Un peu tordu. Les vrais navires le sont aussi après leur première tempête." },
    ],
    [
      { beat: "Elle ajoute votre annotation, signe d’un paraphe d’amirale et contemple le mot ‘biscuits’ avec une satisfaction grave.", line: "Enfin un rapport qui identifie la vraie menace. J’ordonne un ravitaillement immédiat." },
      { beat: "Lineva plie le document, gênée d’avoir employé la seule langue qu’on lui a apprise pour prendre soin d’un lieu.", line: "Je sais commander un port. Demander si on manque de savon me paraît plus compliqué. C’est complètement con." },
      { beat: "L’en-tête se consume dans une soucoupe. Elle conserve la liste et ajoute du café en première ligne.", line: "Voilà. Ce n’est plus un rapport, juste deux personnes qui essaient de ne pas dîner avec un placard vide." },
    ],
  ],
  saidin: [
    [
      { beat: "La tasse rebondit dans le coussin. Saidin observe la tache qui aurait dû exister sur le sol avec un intérêt presque enfantin.", line: "Vous venez de créer un futur qui ne méritait aucune prophétie. C’est précisément pour cela qu’il me plaît." },
      { beat: "Il laisse la tasse au bord, mais son attention se déplace enfin de sa chute vers votre visage.", line: "Savoir n’oblige pas à intervenir. Cette vérité est simple ; il m’a fallu beaucoup trop de temps pour la vivre." },
      { beat: "La tasse finit par tomber. Saidin la rattrape au dernier instant, surpris par sa propre décision.", line: "Voilà qui est fâcheux. Je ne savais pas encore si j’allais la laisser se briser." },
    ],
    [
      { beat: "Saidin inscrit votre catastrophe en lettres minuscules, puis dessine autour une pâtisserie anatomiquement impossible.", line: "L’événement a déjà eu lieu dans deux versions. Dans celle-ci, nous survivons à la crème." },
      { beat: "Son doigt suit le cercle autour de la date sans chercher ce qu’il contient après.", line: "Réserver le vide est plus difficile que prévoir. Le vide peut encore vous répondre." },
      { beat: "Il se lève avant que vous ayez fini la proposition et vous tend votre manteau.", line: "Excellente idée. Je comptais vous la suggérer dans trois minutes ; vous venez de me rendre ce temps." },
    ],
    [
      { beat: "Une goutte atteint son nez. Il cligne des yeux, puis éclate d’un rire bref que la pluie n’avait annoncé nulle part.", line: "Celle-ci était gratuite, inutile et parfaitement imprévisible. Recommencez avant que je ne m’y prépare." },
      { beat: "Saidin tend la paume vers la fenêtre sans chercher le prochain éclair.", line: "Je connais la pluie. Ce que j’ignore encore, c’est l’homme que je choisis d’être lorsqu’elle arrive." },
      { beat: "L’air humide envahit la pièce. Il ferme les yeux et écoute chaque goutte comme si aucune n’avait de précédent.", line: "La pluie réelle n’est jamais exactement celle que l’on prévoit. Heureusement pour nous." },
    ],
    [
      { beat: "Vous empilez des cuillères, marchez à reculons et donnez un nom à une poussière. Saidin participe avec un sérieux déconcertant.", line: "Nous avons encore quarante-deux secondes pour ne rien accomplir. Ne gâchez pas cette occasion." },
      { beat: "Il regarde les aiguilles immobiles, puis la pièce qui continue pourtant de respirer.", line: "Une maison ne rend pas le temps. Elle rappelle seulement qu’il n’avait jamais cessé de nous appartenir." },
      { beat: "Ses doigts se referment sur les vôtres. Lorsque les horloges repartent, aucun de vous ne vérifie laquelle a raison.", line: "La minute est terminée. Ce moment, beaucoup moins." },
    ],
  ],
  bellirith: [
    [
      { beat: "Vous ajoutez une vieille cuillère ébréchée. Bellirith l’examine, puis retire sa cape avec un rire retrouvé.", line: "Enfin un objet assez laid pour détourner l’attention de ma vulnérabilité. Je lui dois une faveur." },
      { beat: "Ses doigts restent sur la fermeture de la cape. Pour une fois, elle ne transforme pas l’émotion en invitation.", line: "Rentrer avant d’être regardée… Je ne savais même pas que je désirais cette chronologie-là." },
      { beat: "Elle vous laisse prendre la cape. Sans ses bijoux, son silence paraît plus nu que sa peau ne l’a jamais été.", line: "Ne dis rien. Si tu es tendre maintenant, je pourrais avoir l’indécence de te croire." },
    ],
    [
      { beat: "Bellirith dessine sur le tissu des sourcils furieux et une moustache immense. Son propre rire surprend la pièce.", line: "Il me ressemble déjà davantage : dramatique, suspect et scandaleusement bien entouré." },
      { beat: "Elle serre le tissu entre deux doigts, comme si ne pas regarder constituait encore une faute à expier.", line: "J’ai toujours cru qu’un miroir refusé gagnait. Peut-être que je peux simplement ne pas jouer aujourd’hui." },
      { beat: "Bellirith s’appuie contre vous sans retirer le voile. Sa respiration cherche puis trouve un rythme moins défensif.", line: "Reste. Pas pour me convaincre que je suis belle. Reste jusqu’à ce que la question cesse d’avoir de l’importance." },
    ],
    [
      { beat: "Elle vous regarde vous effondrer, lève les yeux au ciel, puis vous enjambe avec une lenteur excessivement provocante.", line: "Le coton était donc ton vice secret. Je me sens presque insultée de ne pas l’avoir découvert plus tôt." },
      { beat: "Bellirith tire sur une manche trop large et renonce à la replacer pour souligner sa taille.", line: "Sans armure de dentelle, sans parfum, sans faim empruntée… et tu me regardes encore comme si j’étais là. Curieux." },
      { beat: "Elle vole une tranche de pain dans votre assiette et s’assied de travers, parfaitement ordinaire.", line: "Bienvenue et petit-déjeuner. Deux mots dangereusement simples. Je vais peut-être les pervertir en habitude." },
    ],
    [
      { beat: "Bellirith ouvre la bouche pour protester, se rappelle trois de ses commentaires et éclate de rire contre votre épaule.", line: "C’est atrocement précis. J’exige que cette qualité reste secrète : ma réputation ne survivrait pas à la littérature." },
      { beat: "La séduction quitte son regard sans que la chaleur disparaisse. Elle encaisse le compliment comme une vérité presque douloureuse.", line: "Je connais trop bien la violence d’un désir imposé. Si je peux rendre un choix, alors tout en moi n’est peut-être pas perdu." },
      { beat: "Elle ne répond pas tout de suite. Sa main cherche la vôtre sans artifice, paume contre paume.", line: "Rester sans scène, sans charme, sans garantie d’être désirée… C’est la chose la plus difficile que tu pouvais admirer." },
    ],
  ],
  amanea: [
    [
      { beat: "Amanea découvre le marque-page, vous adresse un regard meurtrier, puis le glisse avec soin entre les pages voisines.", line: "Tu te moques de ma couronne dans mon propre foyer ? Bien. L’Empire t’aurait déjà fait exécuter pour moins drôle." },
      { beat: "Elle regarde l’étagère comme si l’objet avait commis une indiscrétion à sa place.", line: "Le pouvoir mesure toutes les pièces avant d’y entrer. J’avais oublié qu’ici, personne ne m’attend au garde-à-vous." },
      { beat: "Vous la retrouvez pieds nus près de la fenêtre. Elle constate l’absence de sa couronne et ne retourne pas la chercher.", line: "Laisse-la régner sur les livres. Ils sont moins dociles que mes conseillers ; cela lui fera une expérience utile." },
    ],
    [
      { beat: "Amanea protège le pot contre vous avec une majesté absurde, puis cède exactement la moitié de sa cuillère.", line: "Une seule bouchée. La décadence a besoin de frontières, sans quoi elle ressemble à un banquet impérial." },
      { beat: "Son menton reste haut, mais un grain de sucre au coin de sa bouche ruine délicieusement l’effet.", line: "J’ai le droit d’aimer quelque chose qui ne sert aucune cause. Ne prends pas cet air victorieux : cette doctrine reste expérimentale." },
      { beat: "Elle observe la seconde cuillère, puis la prend sans commentaire. Le silence dure jusqu’à ce qu’elle pousse le pot entre vous.", line: "Si quelqu’un entre, je nierai tout. Et il ne ressortira probablement pas avec sa mémoire intacte." },
    ],
    [
      { beat: "Amanea lit le post-scriptum, vous fusille du regard et le laisse pourtant sur la page.", line: "Écris encore ‘sa mère’ avec cette désinvolture et je t’exile. Allenna, elle… comprendra peut-être." },
      { beat: "Sa plume s’arrête. Elle relit la question dépouillée de tous les conseils qu’elle avait failli imposer.", line: "On ne m’a jamais offert cet espace. Ce n’est pas une raison pour le refuser à celle que j’ai choisie comme fille." },
      { beat: "Elle scelle l’enveloppe sans ajouter d’ordre. Son pouce reste un instant sur le nom d’Allenna.", line: "Le silence n’est pas toujours un abandon. Parfois, c’est la place laissée à une réponse que l’on craint." },
    ],
    [
      { beat: "Une flamme se penche vers vous comme si elle écoutait. Amanea lui adresse le regard las d’une reine devant un sujet insolent.", line: "Elle plaidera l’influence de ton humour. Je condamnerai probablement les deux responsables à alimenter le foyer." },
      { beat: "L’ombre verte danse sur son visage. Ses mains restent immobiles sur ses genoux malgré chaque sursaut du feu.", line: "J’ai bâti un royaume parce que personne ne protégeait les exclus. J’oublie parfois que protéger n’autorise pas à tout façonner." },
      { beat: "La nouvelle bûche crépite. Amanea se rapproche, assez pour que son épaule rencontre la vôtre sans déclaration.", line: "Il tient sans moi. Voilà qui est à la fois vexant et… reposant. N’en profite pas pour devenir insupportable." },
    ],
  ],
  allenna: [
    [
      { beat: "Allenna fixe le coussin, puis replace la ceinture dessus avec une précision cérémonielle.", line: "Poste de garde attribué. S’il abandonne son secteur, tu répondras personnellement de la brèche." },
      { beat: "Sa main se ferme à vide là où devrait se trouver la poignée. Elle l’ouvre lentement.", line: "Sans arme, je ne deviens pas incapable. Je le sais. Mon corps exige encore un rapport plus convaincant." },
      { beat: "À la troisième minute, son regard cesse enfin de revenir vers l’entrée. Elle expire comme après une garde trop longue.", line: "Tu peux parler. Je t’écoute désormais sans surveiller simultanément trois issues." },
    ],
    [
      { beat: "Elle vous tend la tasse comme une prescription et adopte son ton de commandement le plus sévère.", line: "Deux prises quotidiennes. Effets secondaires : chaleur, repos et diminution temporaire de l’entêtement." },
      { beat: "Allenna goûte l’infusion, presque gênée par un plaisir qui n’a sauvé personne.", line: "Tout n’a pas besoin d’être utile pour mériter des ressources. Amanea me le répète. Je commence seulement à l’entendre." },
      { beat: "Elle corrige votre dosage d’un geste, puis retient la remarque suivante et vous laisse terminer.", line: "Un peu moins de feuilles. Voilà. Elle sera différente de la mienne, pas inférieure." },
    ],
    [
      { beat: "Allenna construit une seconde figurine, lui donne une lance minuscule et organise les deux combattants avec un enthousiasme qu’elle nie aussitôt.", line: "L’affrontement suivra les règles de la cité. Naïah serait disqualifiée avant le début, ce qui améliore déjà le tournoi." },
      { beat: "Elle tourne la figurine entre ses doigts calleux. Le petit nœud inutile lui arrache un sourire sans défense.", line: "Réparer laisse toujours la peur de perdre quelqu’un. Créer… je n’avais jamais remarqué que le geste pouvait s’arrêter à la joie." },
      { beat: "Vos doigts se gênent sur le dernier nœud. Allenna ne retire pas sa main et le bras de tissu finit légèrement trop long.", line: "Défaut acceptable. Il lui donnera davantage d’allonge au combat." },
    ],
    [
      { beat: "Allenna examine le canapé comme un adversaire puis s’y enfonce davantage, prise au piège par son propre confort.", line: "Négociation en cours. L’ennemi exige que je termine mon assiette avant libération." },
      { beat: "Elle compte mentalement les officiers capables de tenir sans elle et s’arrête avant d’atteindre une objection.", line: "Je les ai formés pour décider. Continuer à tout reprendre ne serait pas du dévouement, mais de la défiance." },
      { beat: "Le billet part avec un messager. Allenna revient s’asseoir et reprend enfin son repas encore tiède.", line: "La cité est informée. Elle survivra à mon dessert. Moi aussi, avec un entraînement suffisant." },
    ],
  ],
  tia: [
    [
      { beat: "Tia examine les sceaux selon votre classement absurde et déplace discrètement le plus laid en première position.", line: "Celui-ci vient du Conseil des moissons. Leur cire est médiocre, mais leur urgence rarement feinte. Votre méthode n’est pas entièrement inutile." },
      { beat: "Elle regarde le thé comme si cette priorité minuscule constituait une désobéissance publique.", line: "L’Empire n’a pas attendu : je lui ai ordonné d’attendre. La nuance préserve encore une part de ma dignité." },
      { beat: "Vous versez l’eau. Tia ne touche aucun pli avant d’avoir fini la seconde tasse.", line: "Dix minutes ne menaceront pas le règne. Si je me trompe, vous porterez une responsabilité historique considérable." },
    ],
    [
      { beat: "Son regard promet une condamnation. Pourtant, elle redresse la manche pour rendre le pli plus visible encore.", line: "L’insigne sera réservé aux souveraines assez imprudentes pour s’endormir hors de leur lit. N’espérez aucune décoration." },
      { beat: "Tia contemple son reflet sans reprendre la posture officielle qui lui vient d’ordinaire avant toute pensée.", line: "On reconnaît l’autorité à ce qu’elle protège, non à une manche. Voilà du moins ce que j’exige des autres." },
      { beat: "Elle enfile le manteau. Le pli demeure sous le tissu, connu de vous deux et corrigé par personne.", line: "Nous sortirons ainsi. Si quelqu’un ose commenter, j’observerai votre théorie face à une crise réelle." },
    ],
    [
      { beat: "Tia consulte l’horloge et vous accorde un regard glacial dont la sévérité est trahie par le couvert déjà rempli.", line: "Votre retard est enregistré. Sa sanction consiste à manger avant que le plat refroidisse." },
      { beat: "Sa main se pose près de votre assiette, puis recule au lieu d’en rectifier l’alignement.", line: "Une convocation obtient une présence. Je voulais… que vous reveniez. La formulation m’est moins familière." },
      { beat: "Elle commence le repas. Au bout de quelques bouchées, ses épaules descendent d’une mesure presque imperceptible.", line: "Vous êtes là. Je n’exigerai pas de ce fait simple qu’il devienne une déclaration." },
    ],
    [
      { beat: "Tia regarde le coin sombre, puis vous, avec la patience sévère réservée aux hérésies mineures.", line: "L’ombre refuse déjà mon autorité. Je doute que votre règlement domestique l’impressionne davantage." },
      { beat: "Ses doigts se resserrent sur l’accoudoir. Elle ne détourne pourtant pas le regard de l’obscurité.", line: "On m’a appris que la Lumière recule dès qu’on cesse de la défendre. Personne ne m’a appris à distinguer le repos de la capitulation." },
      { beat: "La dernière flamme se redresse d’elle-même. Tia desserre la main et garde le coin du salon dans son champ de vision.", line: "Rien n’est venu. Ne confondez pas cette observation avec une conversion. Mais… je la retiendrai." },
    ],
  ],
  draven: [
    [
      { beat: "Draven vous salue avec la cafetière, verse deux doses capables de dissoudre une ancre et prend enfin place.", line: "Promotion acceptée. Mon premier ordre : ne dites jamais à Lineva que j’ai reçu un grade pour ça." },
      { beat: "Il tend la tasse, puis la retire par réflexe pour vérifier sa température avant de vous la rendre, contrarié contre lui-même.", line: "Recevoir, je sais. Laisser quelqu’un s’occuper de moi, c’est une autre foutue discipline." },
      { beat: "Draven s’assied en face de vous. Après une gorgée, il cesse de chercher la tâche qui justifierait sa présence.", line: "Bon café. Mauvais briefing. Excellente matinée, donc." },
    ],
    [
      { beat: "Il marque les boulangeries par des triangles tactiques et ajoute une croix sur celle qui vend les pires chaussons.", line: "Renseignement utile. Une campagne sérieuse commence toujours par sécuriser le ravitaillement." },
      { beat: "Draven suit du doigt une rue qui mène au port puis revient vers la maison, sans passer par aucune fortification.", line: "J’ai dessiné des routes pour envoyer des gens au combat toute ma vie. Une route faite pour rentrer… ça change la main." },
      { beat: "Il trace une boucle volontairement inutile autour du marché et vous tend le crayon pour choisir la suite.", line: "Pas d’objectif, pas d’inspection. Si nous nous perdons, vous expliquerez à l’Amirale que c’était stratégique." },
    ],
    [
      { beat: "Draven se penche vers le nœud et lui adresse la voix d’un officier accordant une permission rare.", line: "Repos autorisé jusqu’à midi. Après quoi cette corde reprendra une tenue décente." },
      { beat: "Il observe les fibres relâchées sans y porter la main. Le geste lui coûte davantage qu’il ne souhaite l’admettre.", line: "Il tiendra. Et s’il ne tient pas, quelqu’un d’autre saura le refaire. Voilà la partie que j’apprends encore." },
      { beat: "Vous passez devant le nœud tout le matin. Draven ne propose de le resserrer qu’après avoir fini son café.", line: "Maintenant. Parce que nous l’avons choisi, pas parce qu’une corde commande la maison." },
    ],
    [
      { beat: "Il dessine un navire si mauvais qu’il ressemble à une pomme de terre armée. Son rire bourru secoue la table.", line: "Parfait. Elle saura que la lettre vient de moi et que je n’ai subi aucune aide artistique." },
      { beat: "Draven relit la phrase. Son pouce masque l’espace vide où un ordre aurait autrefois suivi.", line: "Je lui ai trop souvent expliqué comment aller bien. Il serait temps que je lui demande si elle y arrive." },
      { beat: "Il ferme l’enveloppe d’un geste sec, puis la garde un instant contre sa paume avant de vous la confier.", line: "Envoyez-la avant que je n’ajoute trois pages de conseils. Et ne souriez pas comme ça, bordel." },
    ],
  ],
};

const moment = (character: string, index: number, title: string, prompt: string, playerChoices: [string, string, string]): HomeMoment => {
  const replies = RESIDENT_REPLIES[character]?.[index];
  if (!replies) throw new Error(`Réponses de moment résident manquantes : ${character}-${index}`);
  const answer = (choiceIndex: number): DialogueLine[] => [
    P(playerChoices[choiceIndex]),
    N(replies[choiceIndex].beat),
    C(characterName(character), replies[choiceIndex].line),
  ];
  return {
    id: `home-${character}-${index}`,
    title,
    characters: [character],
    intro: [N(prompt)],
    choices: [
      Q(`home-${character}-${index}-a`, playerChoices[0], "audace", answer(0), { stats: { audace: 1 }, affection: 4, desire: 2 }),
      Q(`home-${character}-${index}-l`, playerChoices[1], "lucidite", answer(1), { stats: { lucidite: 1 }, trust: 5, affection: 2 }),
      Q(`home-${character}-${index}-s`, playerChoices[2], "sangFroid", answer(2), { stats: { sangFroid: 1 }, trust: 4, affection: 3 }),
    ],
  };
};

export const RESIDENT_MOMENTS: Record<string, HomeMoment[]> = {
  hylee: [
    moment("hylee", 0, "Du givre sur les carreaux", "Hylee dessine au réveil un paysage de glace sur votre fenêtre, puis s’arrête en réalisant qu’elle a modifié votre maison sans demander.", ["Alors je dessine aussi. Si nous sommes deux responsables, aucun de nous ne peut être puni.", "Tu as dessiné un endroit où tu te sens en sécurité. Ne l’efface pas encore.", "Merci. Je peux juste rester là pendant que le soleil le transforme."]),
    moment("hylee", 1, "La tarte héroïque", "La cuisine porte les traces d’une tentative de tarte. Hylee prétend que la croûte carbonisée constitue une armure narrative.", ["Très bien : sauvons le royaume en mangeant la garniture.", "Tu cuisines quand tu es nerveuse. Qu’est-ce qui t’attend aujourd’hui ?", "On peut nettoyer ensemble sans décider si c’était un échec."]),
    moment("hylee", 2, "Une cape sur deux chaises", "Hylee a laissé sa cape entre deux chaises comme si elle n’avait pas encore choisi laquelle était la sienne.", ["Je vote pour la troisième option : directement sur mes épaules.", "Tu peux choisir une place ici sans demander si elle dérange.", "Laisse-la là. La maison peut apprendre tes habitudes lentement."]),
    moment("hylee", 3, "La nuit trop calme", "Un bruit dans la rue a réveillé Hylee. Elle se tient dans le salon, prête à s’excuser d’avoir allumé toutes les lampes.", ["Nous allons inspecter la menace : elle mérite probablement un nom ridicule.", "Ton corps a reconnu un danger ancien. Ici, il peut vérifier puis revenir.", "Je reste éveillé·e avec toi. Aucune explication nécessaire."]),
  ],
  remerii: [
    moment("remerii", 0, "Le tiroir corrigé", "Remerii a réorganisé un tiroir, puis laissé volontairement un objet à la mauvaise place pour vérifier si elle peut vivre avec.", ["J’en ajoute un second. Appelons cela une exposition expérimentale.", "Vous n’essayez pas de ranger le tiroir. Vous essayez d’habiter l’imperfection.", "Je ne toucherai à rien. Nous verrons demain si le monde tient."]),
    moment("remerii", 1, "Thé oublié", "Deux tasses refroidissent sur la table pendant que Remerii lit, étonnamment absorbée par un roman médiocre.", ["Je lis les dialogues dramatiques avec les voix les plus indignes.", "Vous aviez besoin d’une histoire qui ne vous demande aucune solution.", "Je réchauffe le thé et reste près d’elle sans interrompre le chapitre."]),
    moment("remerii", 2, "La leçon interdite", "Remerii corrige votre manière de plier une couverture, puis comprend que son ton vient de transformer le salon en salle de cours.", ["Examen pratique : réussir à nous rouler dedans sans aucune méthode.", "Vous pouvez partager une préférence sans qu’elle devienne une règle.", "Je replie avec elle, puis lui laisse choisir ce qui peut rester imparfait."]),
    moment("remerii", 3, "Une note dans la cuisine", "Le métronome arcanique bat depuis la cuisine. Remerii y compose une phrase musicale avec les bruits ordinaires du logis.", ["J’ajoute une percussion avec les casseroles. La critique peut attendre.", "Vous transformez enfin l’ordinaire en musique au lieu de le corriger.", "Je suis son rythme en préparant deux tasses."]),
  ],
  iriana: [
    moment("iriana", 0, "Le décret du petit-déjeuner", "Iriana a rédigé une liste pour choisir le petit-déjeuner, puis l’a barrée avec irritation.", ["Je décrète que le premier aliment attrapé devient loi jusqu’à midi.", "Vous cherchez encore la bonne décision là où une envie suffirait.", "Je lui présente deux assiettes et attends simplement son choix."]),
    moment("iriana", 1, "Une couronne dans l’entrée", "Iriana a laissé son diadème près de la porte et traverse la maison sans y revenir du regard.", ["Je lui construis un minuscule coussin excessivement solennel.", "Vous vouliez savoir si vous restiez vous-même hors de son poids.", "Je ferme doucement le coffret et poursuis la matinée avec elle."]),
    moment("iriana", 2, "Le courrier fermé", "Une lettre impériale repose encore scellée tandis qu’Iriana regarde la pluie depuis votre fenêtre.", ["Nous parions un dessert qu’elle ne contient rien qui mérite cette vue.", "Vous pouvez choisir l’heure à laquelle la princesse revient travailler.", "Je m’assieds près d’elle sans toucher au sceau."]),
    moment("iriana", 3, "L’oiseau chante faux", "L’oiseau mécanique réveille la maison avec trois notes atroces. Iriana étouffe un rire dans l’oreiller.", ["Nous lui apprenons un hymne encore pire.", "Vous avez laissé cet objet devenir important précisément parce qu’il ne servait à rien.", "Je le remonte une fois et partage son sourire silencieux."]),
  ],
  valurn: [
    moment("valurn", 0, "La porte non surveillée", "Valurn lit près de la fenêtre. Pour la première fois depuis son installation, il tourne le dos à la porte.", ["Je passe par la fenêtre pour ruiner symboliquement ce progrès.", "Vous connaissez désormais le bruit de cette porte et les personnes qui peuvent l’ouvrir.", "Je m’installe dans son champ de vision sans signaler le détail."]),
    moment("valurn", 1, "Aucune facture", "Valurn a réparé une étagère et déposé à côté une facture parodique longue de six clauses.", ["Je refuse la clause sept inexistante et réclame un arbitrage au dessert.", "Vous plaisantez parce qu’un service gratuit vous rend encore vulnérable.", "Je le remercie sans chercher à équilibrer immédiatement la dette."]),
    moment("valurn", 2, "La flamme du four", "Une flamme noire chauffe le four. Valurn la surveille avec méfiance tandis qu’elle cuit paisiblement du pain.", ["Je baptise le premier pain ‘héritier du Chaos domestiqué’.", "Votre magie peut servir une envie simple sans devenir la voix de votre père.", "Je reste près de lui jusqu’à ce que le pain soit prêt."]),
    moment("valurn", 3, "Un sac qui reste vide", "Le sac de voyage de Valurn est ouvert sur le lit, mais il n’y place aucun vêtement.", ["Je le remplis de coussins pour saboter toute fuite dramatique.", "Vous vérifiez encore que partir reste possible avant de choisir de rester.", "Je lui demande seulement s’il veut de l’aide pour le ranger."]),
  ],
  naiah: [
    moment("naiah", 0, "Le plafond étoilé", "Naïah a remplacé le plafond par un ciel violet. Une constellation dessine maladroitement votre profil.", ["J’ajoute à son portrait une couronne de travers.", "C’est la première illusion ici qui ressemble à un souvenir heureux.", "Je regarde avec elle jusqu’à ce que les étoiles s’éteignent."]),
    moment("naiah", 1, "La plante qui ment", "Une plante prétend parler avec la voix de Naïah chaque fois que vous passez près d’elle.", ["Je négocie avec la plante et refuse de parler à son interprète.", "Tu voulais laisser une présence ici même pendant tes absences.", "Je l’arrose et demande à Naïah si elle souhaite garder le sort."]),
    moment("naiah", 2, "La pièce oubliée", "Naïah a créé derrière une porte un faux couloir vers une chambre supplémentaire, puis admet qu’elle voulait un endroit secret.", ["Nous en faisons le quartier général de décisions absurdes.", "Tu peux avoir une pièce à toi sans devoir la cacher au monde entier.", "Je lui propose de choisir un vrai coin de la maison."]),
    moment("naiah", 3, "Le matin sans masque", "Au réveil, aucune illusion ne couvre les cheveux emmêlés ni le silence de Naïah. Elle semble attendre une plaisanterie.", ["Je déclare cette coiffure officiellement souveraine de la maison.", "Tu n’as pas besoin de produire une scène dès que quelqu’un te regarde.", "Je lui tends une tasse et laisse le matin rester ordinaire."]),
  ],
  lineva: [
    moment("lineva", 0, "La ronde du salon", "Lineva vient de vérifier une seconde fois les fenêtres et s’arrête elle-même avant la troisième.", ["Je lui délivre un rapport officiel : le canapé tient toujours.", "La troisième ronde attendra. Le canapé réclame votre présence.", "Je fais le tour avec elle une dernière fois, puis nous nous asseyons."]),
    moment("lineva", 1, "Un réveil sans cloche", "Lineva s’est levée avant l’aube, certaine d’avoir entendu la relève. La maison demeure silencieuse.", ["Je sonne une cuillère contre une tasse pour annoncer la relève du petit-déjeuner.", "La relève n’a pas sonné. Le café, si.", "Je prépare du café et reste avec elle jusqu’au vrai matin."]),
    moment("lineva", 2, "La maquette avance", "Une nouvelle voile est apparue sur la maquette. Lineva nie y avoir travaillé pendant deux heures.", ["Je réclame le grade officiel d’assistant·e charpentier·e.", "La voile tient. Vous reviendrez vérifier le mât demain.", "Je taille silencieusement une petite pièce à côté d’elle."]),
    moment("lineva", 3, "Le rapport brûlé", "Lineva tient un brouillon de rapport domestique intitulé ‘état des provisions’. Elle semble honteuse et amusée.", ["Je l’approuve avec la mention ‘biscuits stratégiquement insuffisants’.", "Gardons la liste. Le titre militaire, lui, peut finir dans le feu.", "Nous gardons la liste des courses et brûlons seulement l’en-tête militaire."]),
  ],
  saidin: [
    moment("saidin", 0, "La tasse qui tombe", "Saidin regarde une tasse posée trop près du bord. Il sait qu’elle tombera et refuse pourtant de la déplacer.", ["Je la pousse moi-même dans un coussin pour inventer un troisième futur.", "Vous apprenez qu’un accident connu peut rester l’accident de quelqu’un d’autre.", "Je m’assieds avec lui et laisse la tasse décider de son destin."]),
    moment("saidin", 1, "Un rendez-vous non inscrit", "Saidin a effacé toutes les dates de son calendrier, sauf aujourd’hui, qu’il a entouré sans événement précis.", ["J’ajoute ‘catastrophe pâtissière à durée indéterminée’.", "Vous vouliez réserver du temps sans enfermer ce qu’il devait contenir.", "Je lui propose une promenade immédiate, sans programme."]),
    moment("saidin", 2, "La pluie prévue", "Il pleut exactement comme Saidin l’avait annoncé. Il reste pourtant devant la fenêtre, contrarié de ne pas être surpris.", ["Je lui jette quelques gouttes depuis un verre. Celle-là n’était pas prévue.", "Vous ne cherchez pas une météo inconnue, mais une réaction qui vous appartienne.", "J’ouvre la fenêtre et écoute avec lui la pluie réelle."]),
    moment("saidin", 3, "Une minute entière", "Toutes les horloges se sont arrêtées une minute. Saidin affirme ne pas en être responsable et paraît ravi.", ["Nous commettons le plus de choses inutiles possible avant la reprise.", "Peut-être que la maison vient de vous rendre un présent.", "Je prends sa main et ne compte pas la durée."]),
  ],
  bellirith: [
    moment("bellirith", 0, "Les bijoux dans un bol", "Bellirith a laissé ses bijoux enchantés dans un simple bol de l’entrée et paraît nue avant même d’avoir retiré sa cape.", ["Je dépose à côté l’objet le moins glamour de la maison pour leur tenir compagnie.", "Tu veux pouvoir rentrer avant de redevenir désirable pour quelqu’un.", "Je prends sa cape et ne commente pas le reste."]),
    moment("bellirith", 1, "Le miroir couvert", "Le miroir honnête est couvert d’un tissu. Bellirith admet qu’elle n’avait pas envie de voir son visage aujourd’hui.", ["Nous dessinons un visage ridicule sur le tissu et le déclarons remplaçant officiel.", "Tu peux ne pas te regarder sans devoir te punir de cette fatigue.", "Je laisse le tissu et lui offre simplement ma présence."]),
    moment("bellirith", 2, "Une tenue ordinaire", "Bellirith porte une chemise simple et attend manifestement une réaction spectaculaire qui ne vient pas.", ["Je m’évanouis théâtralement devant l’audace du coton.", "Tu voulais savoir si ta présence survivait à l’absence de costume.", "Je lui dis qu’elle est la bienvenue et poursuis le petit-déjeuner."]),
    moment("bellirith", 3, "Le compliment impossible", "Bellirith vous demande une qualité qui n’a aucun rapport avec son apparence, son pouvoir ou sa séduction.", ["Ton talent pour choisir les pires romans et les commenter mieux que l’auteur.", "Tu fais l’effort de rendre aux autres le choix que ton pouvoir pourrait leur prendre.", "Ta capacité à rester quand aucune performance ne te protège."]),
  ],
  amanea: [
    moment("amanea", 0, "La couronne sur une étagère", "Amanea a posé sa couronne entre deux livres, puis oublié de la reprendre en changeant de pièce.", ["Je lui ajoute un marque-page pour signaler la page du règne interrompu.", "Tu as cessé quelques minutes de mesurer ta distance au pouvoir.", "Je laisse l’objet où il est et rejoins Amanea."]),
    moment("amanea", 1, "Le miel du matin", "Amanea mange du miel directement à la cuillère et vous fixe comme si vous veniez de surprendre un secret d’État.", ["Je réclame immédiatement ma part du scandale.", "Tu avais réellement envie d’une mauvaise habitude ordinaire.", "Je pose une seconde cuillère sans commentaire."]),
    moment("amanea", 2, "Une lettre à Allenna", "Amanea rédige une lettre à Allenna, barre trois conseils et conserve seulement une question : ‘Qu’as-tu choisi ?’.", ["J’ajoute en post-scriptum que sa mère apprend dangereusement vite.", "Tu lui offres enfin l’espace que tu aurais voulu recevoir.", "Je lui donne une enveloppe et garde le silence."]),
    moment("amanea", 3, "Le feu sans ordre", "Les flammes vertes du foyer vacillent. Amanea les regarde sans utiliser sa magie pour les remettre au pas.", ["Je leur raconte qu’elles risquent une audience disciplinaire.", "Tu laisses quelque chose vivre près de toi sans le gouverner.", "Je rajoute une bûche et reste avec elle devant le feu."]),
  ],
  allenna: [
    moment("allenna", 0, "La lame dans l’entrée", "Allenna a posé sa ceinture d’armes près de la porte. Elle revient deux fois vérifier qu’elle s’y trouve toujours sans la reprendre.", ["Je lui attribue un coussin de garde officiel.", "Tu vérifies que tu peux déposer une arme sans perdre ta capacité d’agir.", "Je reste près d’elle jusqu’à ce qu’elle cesse de regarder l’entrée."]),
    moment("allenna", 1, "Une tisane sans patient", "Allenna prépare une infusion avec la précision d’un remède, puis admet qu’elle l’a choisie uniquement parce qu’elle aime son goût.", ["Je réclame une ordonnance en trois exemplaires.", "Tu apprends qu’une plante peut te faire plaisir sans devoir sauver quelqu’un.", "Je prépare une seconde tasse selon ses instructions."]),
    moment("allenna", 2, "Le bandage inutile", "Un rouleau de bandage devient entre les mains d’Allenna une figurine maladroite. Elle prétend qu’il s’agit d’un exercice de dextérité.", ["Je lui fabrique un adversaire et organise un duel médical.", "Tu avais envie de créer quelque chose qui ne répare aucune blessure.", "Je l’aide à nouer les bras de la figurine sans commenter son sourire."]),
    moment("allenna", 3, "La ronde manquée", "Allenna réalise que l’heure de sa ronde est passée. Personne ne l’a appelée et la cité n’a pas cessé de tenir.", ["Je proclame que le canapé l’a retenue en otage.", "Tu viens de laisser d’autres personnes porter une part de la sécurité.", "Je lui propose d’envoyer un billet, puis de finir le repas."]),
  ],
  tia: [
    moment("tia", 0, "Le courrier non ouvert", "Trois plis officiels attendent sur la table. Tia termine pourtant son thé avant de tendre la main vers le premier.", ["Je les classe par qualité de sceau, sans les lire.", "Vous venez de décider que l’Empire pouvait attendre la fin d’une tasse.", "Je renouvelle l’eau chaude et respecte ce délai minuscule."]),
    moment("tia", 1, "Une manche froissée", "La manche de Tia porte un pli après une nuit passée dans le fauteuil. Elle le voit dans le miroir et choisit de ne pas le corriger.", ["Je décrète le pli nouvel insigne impérial.", "Vous vérifiez si le monde vous reconnaît encore lorsque tout n’est pas maîtrisé.", "Je lui tends son manteau sans lisser le tissu."]),
    moment("tia", 2, "Le second couvert", "Tia a dressé la table pour deux avant votre retour, puis semble contrariée d’avoir rendu son attente visible.", ["J’arrive avec une minute de retard cérémoniel pour préserver le scandale.", "Vous avez préparé une place au lieu d’ordonner une présence.", "Je m’assieds et commence le repas sans lui demander d’expliquer."]),
    moment("tia", 3, "La lumière basse", "Tia laisse les chandelles diminuer sans renforcer leur lumière. L’ombre gagne un coin du salon et rien de terrible ne s’y produit.", ["Je demande poliment à l’ombre de respecter le couvre-feu.", "Vous pouvez observer l’obscurité sans la transformer immédiatement en menace.", "Je reste avec elle jusqu’à ce que la dernière flamme se stabilise."]),
  ],
  draven: [
    moment("draven", 0, "Le café civil", "Draven prépare un café assez fort pour réveiller un équipage, puis cherche à qui donner les instructions de service.", ["Je le nomme Amiral de la cafetière avec pouvoir limité jusqu’à midi.", "Vous savez recevoir un ordre plus facilement qu’une tasse offerte.", "Je prends la seconde tasse et m’assieds avec lui."]),
    moment("draven", 1, "La carte sans front", "Draven dessine les rues autour de la maison mais aucun secteur ennemi. La page blanche semble le dérouter.", ["J’ajoute les positions stratégiques des meilleures boulangeries.", "Cette carte peut servir à revenir, pas seulement à défendre.", "Je lui demande de tracer notre prochaine promenade."]),
    moment("draven", 2, "Le nœud relâché", "Le nœud de relève près de la porte s’est légèrement détendu. Draven le remarque sans se précipiter.", ["Je prétends qu’il demande officiellement des vacances.", "Vous lui faites confiance pour tenir sans contrôle constant.", "Nous le resserrons ensemble plus tard dans la matinée."]),
    moment("draven", 3, "La lettre courte", "La lettre de Draven à Lineva ne contient qu’une phrase : ‘J’espère que tu vas bien.’ Aucun conseil ne suit.", ["C’est beaucoup trop court : ajoutez un dessin de navire scandaleusement mauvais.", "Vous lui posez enfin une question sans écrire la réponse attendue.", "Je lui tends l’enveloppe et respecte ce progrès silencieux."]),
  ],
};

const shared = (id: string, title: string, characters: string[], intro: string, lines: [DialogueLine[], DialogueLine[], DialogueLine[]]): HomeMoment => ({
  id: `home-shared-${id}`, title, characters, intro: [N(intro)], choices: [
    Q(`home-shared-${id}-a`, "Bousculer la situation et faire de l’incident un jeu collectif.", "audace", lines[0], { stats: { audace: 1 }, affection: 3, trust: 2, relationshipEffects: { [characters[1]]: { affection: 3, trust: 2 } } }),
    Q(`home-shared-${id}-l`, "Nommer la dynamique entre eux sans choisir de camp.", "lucidite", lines[1], { stats: { lucidite: 1 }, trust: 4, relationshipEffects: { [characters[1]]: { trust: 4 } } }),
    Q(`home-shared-${id}-s`, "Leur laisser l’espace de résoudre ce moment à leur manière.", "sangFroid", lines[2], { stats: { sangFroid: 1 }, trust: 3, affection: 2, relationshipEffects: { [characters[1]]: { trust: 3, affection: 2 } } }),
  ],
});

export const SHARED_RESIDENT_MOMENTS: HomeMoment[] = [
  shared("hylee-remerii", "La cuisine devient laboratoire", ["hylee", "remerii"], "Hylee tente une pâtisserie glacée tandis que Remerii corrige la recette avec la rigueur d’un traité arcanique. Leur vieille dynamique d’élève et de mentor envahit progressivement votre cuisine.", [[C("Hylee", "On retire la recette et on improvise !"), C("Remerii", "Je proteste officiellement et participe concrètement.")], [P("Hylee veut savoir si son idée peut vivre. Remerii veut éviter qu’elle explose. Vous pouvez faire les deux."), C("Remerii", "Une synthèse agaçante."), C("Hylee", "Donc juste.")], [N("Vous préparez les ingrédients pendant qu’elles trouvent un compromis : une moitié expérimentale, une moitié stable.")]]),
  shared("iriana-valurn", "Le conseil des chaussons", ["iriana", "valurn"], "Iriana et Valurn débattent avec un sérieux absurde de la répartition des chaussons, du dernier dessert et du droit d’occuper le meilleur fauteuil.", [[P("Je propose un duel de coussins avec droit d’appel."), C("Iriana", "J’accepte."), C("Valurn", "La monarchie vient enfin de trouver sa forme supérieure.")], [P("Vous reproduisez une cour miniature parce que l’intimité vous rend encore vulnérables."), C("Iriana", "Cruellement exact."), C("Valurn", "Je préférais le duel.")], [N("Vous les laissez négocier. L’accord final partage le fauteuil et condamne le dessert à trois cuillères.")]]),
  shared("valurn-bellirith", "Le concours qui n’existe pas", ["valurn", "bellirith"], "Valurn et Bellirith transforment le choix d’une bouteille en compétition. Aucun n’admet vouloir impressionner l’autre ; tous deux vous observent après chaque proposition.", [[P("Le gagnant sera la personne qui accepte de perdre avec élégance."), C("Bellirith", "Il est éliminé."), C("Valurn", "Elle vient de perdre en répondant trop vite.")], [P("Vous cherchez chacun la preuve que l’autre vous estime encore."), C("Bellirith", "Ce jeu manque soudain de légèreté."), C("Valurn", "Et gagne malheureusement en précision.")], [N("Vous ouvrez une troisième bouteille choisie sans eux. Leur rivalité se détend autour de ce verdict extérieur.")]]),
  shared("lineva-draven", "Deux cartes du même port", ["lineva", "draven"], "Lineva et Draven ont chacun corrigé la même carte de Forthaven pendant la nuit. Leurs annotations diffèrent, mais aucune ne recouvre désormais celle de l’autre.", [[P("Je les mélange et vous impose de défendre la correction de l’autre."), C("Lineva", "C’est déloyal."), C("Draven", "Et instructif. Commence.")], [P("Vous avez enfin dessiné deux responsabilités au lieu d’un commandement et de son ombre."), C("Draven", "Elle a gagné son tracé."), C("Lineva", "Il a appris à ne pas l’effacer.")], [N("Vous préparez le café pendant qu’ils reportent ensemble les deux légendes sur une carte neuve.")]]),
  shared("amanea-allenna", "Le rapport qui devient une question", ["amanea", "allenna"], "Allenna présente l’état des patrouilles. Amanea barre la formule de validation et lui demande ce qu’elle aurait choisi sans ordre royal.", [[P("Je transforme le rapport en tournoi de décisions impossibles."), C("Allenna", "Inutile."), C("Amanea", "Donc peut-être nécessaire.")], [P("Amanea essaie de transmettre sa confiance sans la déguiser en commandement."), C("Amanea", "J’apprends tardivement."), C("Allenna", "Mais tu apprends.")], [N("Vous préparez le thé pendant qu’Allenna reformule le plan à la première personne. Amanea écoute sans reprendre le parchemin.")]]),
  shared("allenna-naiah", "Deux sœurs, une étagère", ["allenna", "naiah"], "Allenna et Naïah réclament la même étagère : l’une pour ses plantes médicinales, l’autre pour une collection d’objets sans fonction avouable.", [[P("Chaque objet devra survivre à une inspection menée par l’autre."), C("Naïah", "Je vais nommer les poisons."), C("Allenna", "Je vais jeter les faux noms.")], [P("Vous défendez toutes deux une place visible dans la même maison."), C("Allenna", "Ce n’est pas le sujet."), C("Naïah", "C’est exactement le sujet, donc elle déteste cette réponse.")], [N("Vous partagez l’étagère en hauteur plutôt qu’en largeur. Chacune conserve son territoire sans expulser l’autre.")]]),
  shared("tia-iriana", "Le pli du protocole", ["tia", "iriana"], "Tia corrige par réflexe la manière dont Iriana a disposé les couverts. Iriana replace calmement le sien comme elle le souhaite et attend.", [[P("J’utilise ma cuillère comme sceptre et déclare toutes les places souveraines."), C("Iriana", "J’appuie cette réforme."), C("Tia", "Je refuse d’en reconnaître la jurisprudence.")], [P("Protéger Iriana ne vous donne pas le droit de décider chaque geste à sa place."), C("Tia", "Je l’entends."), C("Iriana", "Ce n’est pas encore la même chose que l’accepter.")], [N("Tia ne corrige pas une seconde fois. Iriana n’exige pas qu’elle transforme aussitôt ce silence en excuse.")]]),
  shared("saidin-remerii", "Deux méthodes pour ne rien prévoir", ["saidin", "remerii"], "Saidin refuse de prédire la panne d’un mécanisme tandis que Remerii refuse de ne pas la diagnostiquer. Le petit appareil grésille entre eux avec une joie manifeste.", [[P("Je le secoue. Voilà une troisième méthode scientifiquement irresponsable."), C("Remerii", "Évidemment."), C("Saidin", "Je ne l’avais pas prévue. Continuez.")], [P("Saidin protège la surprise ; Remerii protège la compréhension. Le mécanisme a besoin des deux."), C("Remerii", "Nous pouvons l’observer sans conclure."), C("Saidin", "Et conclure seulement au présent.")], [N("Vous les laissez travailler. Ils finissent par réparer l’objet sans consulter son futur ni rédiger sa biographie complète.")]]),
];

export function availableSharedHomeMoment(residents: string[], histories: string[]) {
  return SHARED_RESIDENT_MOMENTS.find((entry) => entry.characters.every((character) => residents.includes(character)) && !histories.includes(entry.id));
}

export const HOME_PAIR_DATES: HomePairDateProfile[] = [
  {
    id: "hylee-remerii", characters: ["hylee", "remerii"], title: "Une recette sans professeure", description: "Hylee et Remerii essaient d’inventer dans votre cuisine sans retomber dans une leçon.", requiredFlags: ["hr-triad-established"], minStage: 4, minTrust: 30, tones: ["amical", "amoureux", "desir"],
    opening: [N("Hylee arrive avec des fruits glacés. Remerii porte trois livres de cuisine et affirme, sans convaincre personne, qu’ils ne serviront qu’en cas d’urgence."), C("Hylee", "Si elle ouvre le troisième avant que j’aie cassé quelque chose, tu le confisques."), C("Remerii", "J’accepte cette règle arbitraire dans le seul but de démontrer ma souplesse.")],
    cityComments: {
      algratal: [C("Remerii", "Une cuisine d’Al’Gratal possède davantage de protocole qu’un conseil de Mir’Aldas."), C("Hylee", "Alors on mange directement dans le plat. Révolution." )],
      forthaven: [C("Hylee", "Le sel de la mer va finir dans le dessert."), C("Remerii", "Pour une fois, je souhaite vérifier cette hypothèse par l’expérience.")],
      miraldas: [C("Remerii", "Nous sommes assez proches de l’atelier pour y fuir en cas de catastrophe."), C("Hylee", "Non. Ce soir, même nos catastrophes restent chez nous.")],
      akuhn: [C("Hylee", "Les flammes vertes donnent à la crème un air suspect."), C("Remerii", "Cette remarque est techniquement infondée et esthétiquement exacte.")],
    },
    tierComments: [[C("Hylee", "On tient à trois si personne ne fait de grand geste."), C("Remerii", "Je réorganise donc uniquement mes objections.")], [C("Remerii", "La pièce oblige à partager l’espace. C’est utile."), C("Hylee", "Elle voulait dire agréable.")], [C("Hylee", "Assez de place pour cuisiner et danser."), C("Remerii", "Pas simultanément." )], [C("Remerii", "Cette demeure peut accueillir une expérience à trois variables."), C("Hylee", "Elle parle de nous. C’est sa version romantique.")], [C("Hylee", "Si on se perd, on se retrouve au dessert."), C("Remerii", "Enfin un protocole raisonnable.")]],
    toneLines: {
      amical: [P("Je veux une soirée où chacune peut être maladroite sans devoir réparer l’image des deux autres."), C("Hylee", "Je commence immédiatement."), C("Remerii", "Je m’efforcerai de ne pas noter l’heure exacte.")],
      amoureux: [P("Je veux que cette maison garde trois manières différentes de s’aimer."), C("Remerii", "Distinctes, mais capables de se répondre."), C("Hylee", "Et de se voler des baisers dans la cuisine.")],
      desir: [P("La cuisine est un excellent prétexte. J’espère que nous n’allons pas être raisonnables jusqu’au dessert."), C("Hylee", "Je viens d’oublier toute la recette."), C("Remerii", "Pour une fois, je ne vais pas la lui rappeler.")],
    },
    rounds: [
      { prompt: "La préparation exige une température que Hylee peut tenir, mais pas mesurer seule.", detail: "Remerii veut calculer ; Hylee veut sentir.", options: [O("both", "Faire lire le thermomètre à Remerii pendant qu’Hylee suit la texture", 2, N("Leurs deux méthodes se complètent sans que l’une devienne la correction de l’autre.")), O("hylee", "Suivre uniquement l’instinct d’Hylee", 1, C("Remerii", "Je reconnais que le résultat tient. Ma mâchoire, un peu moins.")), O("remerii", "Appliquer exactement le calcul de Remerii", 0, C("Hylee", "C’est parfait. Et ça ne ressemble plus du tout à ce que j’essayais d’inventer."))] },
      { prompt: "Il reste une cuillère pour goûter.", detail: "Trois regards convergent vers elle.", options: [O("circle", "Faire circuler la cuillère et demander une modification à chacune", 2, N("Le goût change trois fois et finit par n’appartenir à personne seule.")), O("player", "Goûter et trancher", 1, N("Votre décision évite la dispute, mais aussi leur meilleure improvisation.")), O("fight", "Lancer une compétition", 0, N("Hylee triche avec le givre ; Remerii rédige mentalement une réclamation."))] },
      { prompt: "Le dessert se fend au moment d’être servi.", detail: "Remerii tend déjà la main ; Hylee la retient.", options: [O("name", "Nommer la fissure et la conserver comme signature commune", 2, C("Remerii", "Une imperfection documentée n’est pas nécessairement corrigée."), C("Hylee", "Je prends cette victoire.")), O("hide", "La couvrir de fruits", 1, N("La fente disparaît sous une décoration joyeuse.")), O("redo", "Tout recommencer", 0, C("Hylee", "On vient de perdre la partie qui nous ressemblait."))] },
    ],
    results: { close: [C("Hylee", "Le dessert est étrange. Nous, ça va.")], warm: [C("Remerii", "Je propose une seconde expérience sans modifier le protocole humain."), C("Hylee", "Elle veut revenir.")], perfect: [N("La cuillère passe encore de main en main longtemps après le dessert."), C("Hylee", "Trois goûts, une seule recette. C’est peut-être ça, notre truc."), C("Remerii", "Une métaphore imprécise. Mais je la garde.")] },
  },
  {
    id: "iriana-valurn", characters: ["iriana", "valurn"], title: "La cour minuscule", description: "Recevoir Iriana et Valurn loin du palais pour un jeu diplomatique qui ne décide de rien d’autre que votre soirée.", requiredFlags: ["iv-shared-dates"], minStage: 4, minTrust: 30, tones: ["amical", "amoureux", "desir"],
    opening: [N("Iriana apporte une bouteille sans sceau impérial. Valurn apporte des cartes vierges et prétend que l’absence de règles constitue sa contribution."), C("Iriana", "S’il triche dans votre maison, je ne peux officiellement rien faire."), C("Valurn", "Je savais que cet endroit me plairait.")],
    cityComments: { algratal: [C("Iriana", "À quelques rues du palais, cette porte suffit pourtant à me rendre anonyme."), C("Valurn", "Je connais trois espions voisins. Je leur ai donné de fausses informations sur le dessert.")], forthaven: [C("Valurn", "Forthaven déteste les jeux où personne ne gagne."), C("Iriana", "Alors notre soirée lui apprendra la diplomatie.")], miraldas: [C("Iriana", "Mir’Aldas protège jalousement son indépendance."), C("Valurn", "Ce salon vient de déclarer la sienne.")], akuhn: [C("Valurn", "Deux héritiers du Chaos invités sous le toit d’une même personne. Amanea rirait ou renforcerait la garde."), C("Iriana", "Probablement les deux.")] },
    tierComments: [[C("Valurn", "Petit. Personne ne peut quitter la conversation avec dignité."), C("Iriana", "Tu viens d’identifier son meilleur avantage.")], [C("Iriana", "Un espace choisi avec mesure."), C("Valurn", "Elle complimente votre budget. C’est presque intime.")], [C("Valurn", "Assez beau pour Iriana, assez privé pour moi."), C("Iriana", "Tu viens encore de parler à ma place." )], [C("Iriana", "Cette demeure pourrait recevoir une ambassade."), C("Valurn", "Ce soir, elle reçoit bien plus dangereux.")], [C("Valurn", "Un palais personnel. J’exige un titre inutile."), C("Iriana", "Prince des chaussons.")]],
    toneLines: { amical: [P("Je vous invite comme deux personnes capables de perdre un jeu sans en faire une crise d’État."), C("Valurn", "Parlez pour elle."), C("Iriana", "Il a déjà perdu.")], amoureux: [P("J’aime ce que chacun de vous devient quand aucun rôle public ne décide de notre place."), C("Iriana", "Alors gardons trois places distinctes."), C("Valurn", "Et rapprochons les chaises.")], desir: [P("Aucune cour, aucun témoin et aucune raison de prétendre que la tension n’existe pas."), C("Valurn", "Enfin un discours convaincant."), C("Iriana", "Ne lui laissez pas croire qu’il a déjà gagné.")] },
    rounds: [
      { prompt: "Attribuer les rôles secrets du jeu.", detail: "Valurn tente de lire vos cartes ; Iriana lit Valurn.", options: [O("swap", "Échanger les cartes après chaque regard", 2, N("L’information ne reste jamais assez longtemps au même endroit pour devenir un pouvoir.")), O("hide", "Cacher strictement votre carte", 1, N("Le mystère tient, mais chacun joue seul.")), O("reveal", "Montrer votre rôle à Iriana", 0, C("Valurn", "Une alliance prévisible. Je suis blessé et déjà victorieux."))] },
      { prompt: "Valurn provoque Iriana pour lui faire rompre son masque.", detail: "Elle s’apprête à répondre comme une princesse.", options: [O("absurd", "Imposer que toute réponse soit chantée", 2, N("Iriana chante une menace diplomatique. Valurn perd sa manche en riant.")), O("defend", "Défendre Iriana", 1, C("Iriana", "Merci. Mais je pouvais gagner cette bataille ridicule.")), O("assist", "Aider Valurn", 0, C("Iriana", "Deux contre une dans ma propre défaite ? Je retiens."))] },
      { prompt: "La dernière carte permet de nommer le vainqueur.", detail: "Tous trois avez triché d’une façon différente.", options: [O("house", "Déclarer la maison victorieuse", 2, C("Iriana", "Verdict incontestable."), C("Valurn", "Je demande à devenir résident pour contester demain.")), O("draw", "Déclarer l’égalité", 1, N("Personne ne proteste assez sincèrement pour annuler le résultat.")), O("self", "Vous proclamer vainqueur·se", 0, C("Valurn", "Audacieux. Faux, mais audacieux."))] },
    ],
    results: { close: [C("Iriana", "Aucun incident diplomatique. C’est presque décevant.")], warm: [C("Valurn", "Je réclame une revanche ici, exactement ici.")], perfect: [N("Iriana pose son diadème près des cartes vierges. Valurn laisse son jeu face visible."), C("Iriana", "Personne n’a gagné."), C("Valurn", "C’est pourquoi personne ne veut partir.")] },
  },
  {
    id: "valurn-bellirith", characters: ["valurn", "bellirith"], title: "Le concours des mauvais perdants", description: "Canaliser leur rivalité dans une dégustation à l’aveugle où chaque compliment coûte un point.", minStage: 4, minTrust: 32, tones: ["amical", "desir"],
    opening: [N("Valurn arrive avec trois bouteilles anonymes. Bellirith apporte trois rubans opaques et précise qu’aucun n’est enchanté."), C("Bellirith", "Le premier qui transforme la soirée en numéro de séduction perd."), C("Valurn", "Vous venez de m’interdire de respirer avec élégance.")],
    cityComments: { algratal: [C("Bellirith", "Al’Gratal récompense les apparences. Quel endroit délicieux pour juger sans regarder."), C("Valurn", "Elle se croit subtile depuis quatre secondes.")], forthaven: [C("Valurn", "À Forthaven, toute boisson correcte doit survivre au roulis."), C("Bellirith", "Et toute vanité au sel. Tu es mal parti.")], miraldas: [C("Bellirith", "Les mages analyseraient chaque arôme."), C("Valurn", "Nous ferons pire : nous donnerons notre avis.")], akuhn: [C("Valurn", "Chez moi, un mauvais vin peut déclencher une vendetta."), C("Bellirith", "Parfait. J’ai choisi le second.")] },
    tierComments: [[C("Bellirith", "Nous sommes assez proches pour l’entendre mentir."), C("Valurn", "Et assez proches pour voir qu’elle sourit.")], [C("Valurn", "Confortable sans être impressionnable."), C("Bellirith", "Comme notre hôte, j’espère.")], [C("Bellirith", "Une scène élégante."), C("Valurn", "Elle vient de perdre un point pour mise en scène.")], [C("Valurn", "Deux salons : parfait pour bouder séparément."), C("Bellirith", "Tu reviendras avant moi.")], [C("Bellirith", "Ce domaine rendrait notre compétition presque vulgaire."), C("Valurn", "Presque ? Nous devons faire un effort.")]],
    toneLines: { amical: [P("Votre rivalité reste au service du jeu. Personne n’a besoin de séduire qui que ce soit."), C("Bellirith", "J’accepte ce handicap."), C("Valurn", "Moi aussi, quoique héroïquement.")], amoureux: [P("Ce soir peut être tendre sans devenir une compétition."), C("Valurn", "Cette option n’était pas dans les règles."), C("Bellirith", "Donc elle est éliminée.")], desir: [P("Le gagnant choisira comment prolonger la soirée. Le perdant reconnaîtra que cela lui plaît."), C("Valurn", "Enfin un enjeu sérieux."), C("Bellirith", "Essaie seulement de suivre.")] },
    rounds: [
      { prompt: "Identifier le premier verre sans charme ni démonologie.", detail: "Valurn observe Bellirith plutôt que la couleur ; Bellirith écoute sa respiration.", options: [O("describe", "Leur faire décrire un souvenir plutôt qu’un arôme", 2, N("Leurs réponses révèlent deux solitudes très différentes et la même envie de ne pas perdre la face.")), O("taste", "Les laisser goûter en silence", 1, N("Ils trouvent tous deux la région, sans rien apprendre l’un de l’autre.")), O("bluff", "Donner une fausse piste", 0, N("Ils détectent le mensonge et s’allient immédiatement contre vous."))] },
      { prompt: "Bellirith reconnaît le vin mais doit complimenter Valurn pour répondre.", detail: "La règle lui coûte visiblement.", options: [O("specific", "Exiger un compliment précis et vrai", 2, C("Bellirith", "Tu observes mieux que tu ne prétends. Et tu sais parfois te taire juste à temps."), C("Valurn", "Je vais encadrer cette phrase.")), O("easy", "Accepter un compliment sur sa veste", 1, C("Valurn", "Faible, mais recevable.")), O("skip", "Annuler la règle", 0, C("Bellirith", "Tu viens de nous voler la seule difficulté intéressante."))] },
      { prompt: "Valurn doit reconnaître sa défaite sur le dernier verre.", detail: "Il cherche une formulation qui n’en soit pas vraiment une.", options: [O("plain", "Lui demander seulement : ‘Bellirith avait raison’", 2, C("Valurn", "Bellirith avait raison."), C("Bellirith", "Encore."), C("Valurn", "N’abusons pas des miracles.")), O("poem", "L’autoriser à le dire en métaphore", 1, N("Le compliment dure une minute et contient deux échappatoires.")), O("escape", "Le laisser changer de sujet", 0, C("Bellirith", "Il perd deux fois : au jeu et au courage."))] },
    ],
    results: { close: [C("Valurn", "Je conteste les règles."), C("Bellirith", "Tu contestes surtout le résultat.")], warm: [C("Bellirith", "La revanche aura lieu ici. Même ruban, meilleurs enjeux.")], perfect: [N("Ils retirent leurs rubans sans s’éloigner. Leur rivalité ne s’est pas éteinte ; elle a appris à produire de l’attention."), C("Valurn", "Je n’ai pas aimé perdre."), C("Bellirith", "Menteur.")] },
  },
];

export function pairDateOpening(profile: HomePairDateProfile, property: HousingProperty, items: DisplayItem[]) {
  const lines = [...profile.opening, ...(profile.cityComments[property.location] || []), ...(profile.tierComments[property.tier - 1] || [])];
  items.forEach((item) => {
    lines.push(N(`${item.name} attire simultanément deux regards très différents.`));
    profile.characters.forEach((character) => lines.push(C(characterName(character), item.character === character ? HOME_DATE_PROFILES[character].ownItemComment : HOME_DATE_PROFILES[character].otherItemComment)));
  });
  return lines;
}
