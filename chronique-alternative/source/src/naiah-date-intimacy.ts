import type { DialogueLine } from "./game-data";
import type { IntimacyMode, PlayerSex } from "./date-scenes";
import type { IntimacyRoute } from "./intimacy-routes";

export type NaiahProximityContext = "date-naiah-sanctuary" | "date-naiah-akuhn" | "home-naiah";
export type NaiahProximityPhase = "transition" | "initiative" | "device" | "reaction" | "trust" | "shift" | "truth" | "rebound" | "calm" | "closure";
export type NaiahProximityApproach = { id: string; text: string; lines: DialogueLine[] };
type BinaryPlayerSex = Extract<PlayerSex, "femme" | "homme">;
type RawLine = string | readonly [speaker: string, text: string, mood?: string];
type AuthoredChapter = { all: RawLine[] };
type AuthoredScene = { id: string; context: NaiahProximityContext; sex: BinaryPlayerSex; concept: string; text: string; detail: string; chapters: AuthoredChapter[] };

const PHASES: NaiahProximityPhase[] = ["transition", "initiative", "device", "reaction", "trust", "shift", "truth", "rebound", "calm", "closure"];
const MODES: IntimacyMode[] = ["tendre", "suggestif", "explicite", "ellipse"];
const CONTEXTS: NaiahProximityContext[] = ["date-naiah-sanctuary", "date-naiah-akuhn", "home-naiah"];
const SEXES: BinaryPlayerSex[] = ["femme", "homme"];
const C = (...all: RawLine[]): AuthoredChapter => ({ all });
const lines = (raw: readonly RawLine[]): DialogueLine[] => raw.map((entry) => typeof entry === "string" ? { speaker: "Narration", text: entry } : { speaker: entry[0], text: entry[1], mood: entry[2] });

export const NAIAH_PROXIMITY_OPENINGS: Record<NaiahProximityContext, DialogueLine[]> = {
  "date-naiah-sanctuary": lines([
    "La cérémonie truquée se disperse dans un grand froissement de feuilles. Les ombres emportent les pancartes ; Naïah garde les deux rubans et vous entraîne vers une clairière minuscule que le jeu n'avait jamais indiquée.",
    ["Naïah", "Le sentier de retour existe. Je l'ai seulement prié de ne pas être pressé.", "smirk"],
    "Elle s'assied sur une racine basse et pose près d'elle la couronne, la clochette du faux jury et un biscuit rescapé. La forêt demeure le lieu de la suite.",
    ["Naïah", "Nous pouvons rentrer. Ou découvrir ce qu'on fait après avoir gagné un jeu dont personne ne connaissait les règles.", "thinking"],
  ]),
  "date-naiah-akuhn": lines([
    "La dernière pièce du royaume miniature reste sur le parapet. Le vent redescend entre les arches et Naïah vous conduit sous la partie intacte du belvédère, où la pierre garde un peu de chaleur.",
    ["Naïah", "La ville est toujours là. C'est impoli, mais prévisible. Toi aussi, tu es toujours là. C'est moins prévisible.", "thinking"],
    "Elle installe la fiole de lumière entre vous et conserve toutes les issues visibles. Le rapprochement naît du jeu stratégique, de la discussion difficile et du choix de rester.",
    ["Naïah", "Je n'ai pas prévu de suite. J'ai seulement prévu trois façons de prétendre le contraire.", "smirk"],
  ]),
  "home-naiah": lines([
    "Le jeu domestique est terminé, mais aucun meuble n'a retrouvé sa place. La lanterne éclaire encore la loi ajoutée au rouleau : « son propriétaire peut revenir sans justification ».",
    ["Naïah", "La séance est levée. La souveraine du fauteuil examine toutefois une requête urgente : rester après la fermeture des bureaux.", "smirk"],
    "La porte est fermée, le logis est bien réel et Naïah ne fabrique aucune chambre de brume. Le fauteuil annexé et l'objet laissé vont décider de la forme du moment.",
    ["Naïah", "Tu peux dire non. Le fauteuil protestera, mais son avis n'est pas juridiquement contraignant.", "thinking"],
  ]),
};

export const NAIAH_PROXIMITY_APPROACHES: Record<NaiahProximityContext, NaiahProximityApproach[]> = {
  "date-naiah-sanctuary": [
    { id: "naiah-forest-ribbon", text: "Nouer votre ruban au sien et déclarer deux vainqueurs", lines: lines(["Vous reliez les rubans. Naïah teste le nœud, tire assez fort pour vous rapprocher et décide qu'il tiendra.", ["Naïah", "Décision scandaleuse. Le jury va devoir apprendre à compter jusqu'à deux.", "laugh"]]) },
    { id: "naiah-forest-honest", text: "Lui dire que vous avez envie de rester près d’elle sans nouvelle épreuve", lines: lines([["{player}", "Je veux rester, mais je n'ai pas besoin d'un autre jeu pour le mériter."], "Naïah fait tinter la clochette comme pour enregistrer une objection.", ["Naïah", "Accordé. Avec une petite réserve de mauvaise foi pour le confort.", "thinking"]]) },
    { id: "naiah-forest-revenge", text: "Lui voler la couronne et l’obliger à venir la récupérer", lines: lines(["Vous posez la couronne sur votre tête. Naïah bondit, s'arrête juste devant vous et renonce volontairement à la reprendre à distance.", ["Naïah", "Vol de symbole royal. La peine dépend de la proximité du coupable.", "smirk"]]) },
  ],
  "date-naiah-akuhn": [
    { id: "naiah-edge-light", text: "Entourer avec elle la fiole de lumière volée", lines: lines(["Vos mains se rejoignent autour du verre. Naïah pourrait déplacer l'éclat par magie ; elle ajuste plutôt ses doigts aux vôtres.", ["Naïah", "Partage temporaire de souveraineté lumineuse. Ne t'habitue pas à mon sens du compromis.", "thinking"]]) },
    { id: "naiah-edge-direct", text: "Lui demander de venir plus près, sans détour stratégique", lines: lines([["{player}", "Viens plus près."], "Naïah examine la distance comme une carte, puis la traverse sans illusion ni diversion.", ["Naïah", "Manœuvre directe. Risquée. Très difficile à mal interpréter.", "smirk"]]) },
    { id: "naiah-edge-goat", text: "Installer la chèvre miniature comme chaperon et lui confier les règles", lines: lines(["Vous placez la figurine entre vous. Naïah lui prête une voix grave qui autorise les mains jointes et interdit les discours trop dignes.", ["Naïah", "Le commandement approuve. Je soupçonne une corruption pâtissière.", "laugh"]]) },
  ],
  "home-naiah": [
    { id: "naiah-home-seat", text: "Lui faire une place dans le fauteuil qu’elle a annexé", lines: lines(["Vous vous installez au bord du fauteuil et soulevez le plaid. Naïah choisit la place contre vous plutôt que le siège illusoire qu'elle pourrait créer.", ["Naïah", "Cohabitation territoriale. Le droit domestique progresse à une vitesse alarmante.", "smirk"]]) },
    { id: "naiah-home-law", text: "Ajouter une loi qui interdit aux illusions de parler à votre place", lines: lines(["Vous inscrivez la règle sous les siennes. Naïah dissipe le dernier reflet spectral et pose elle-même sa question.", ["Naïah", "Est-ce que tu veux vraiment que je reste ?", "thinking"], ["{player}", "Oui."]]) },
    { id: "naiah-home-lantern", text: "Placer ensemble sa lanterne à l’endroit qu’elle a choisi", lines: lines(["Vous portez la lanterne à deux. Une fois l'objet posé, Naïah garde vos doigts sous les siens.", ["Naïah", "Elle connaît son adresse. Reste à voir si sa propriétaire ose la retenir.", "thinking"]]) },
  ],
};

export const NAIAH_PROXIMITY_ENDINGS: Record<NaiahProximityContext, DialogueLine[]> = {
  "date-naiah-sanctuary": lines(["Le vrai sentier finit par revenir. Naïah garde un bout de ruban au poignet et ordonne aux panneaux de regarder ailleurs pendant que vous repartez main dans la main.", ["Naïah", "La prochaine fois, les règles seront plus simples. C'est un mensonge de clôture, il ne compte pas.", "laugh"]]),
  "date-naiah-akuhn": lines(["Vous redescendez avec les figurines dans les poches. Naïah ne se retourne qu'une fois, pour vérifier que la chèvre garde correctement le parapet.", ["Naïah", "Elle a un royaume. Nous, nous avons un chemin. Le partage me paraît honnête.", "thinking"]]),
  "home-naiah": lines(["La lanterne reste allumée dans votre logis. Naïah s'endort ou repart selon la route choisie, mais l'objet, le coussin et la loi ajoutée ne sont pas effacés au matin.", ["Naïah", "Ne range pas tout parfaitement. J'aimerais reconnaître l'endroit où j'étais.", "thinking"]]),
};

const SCENES: AuthoredScene[] = [
  {
    id: "naiah-forest-femme-two-crowns", context: "date-naiah-sanctuary", sex: "femme", concept: "double-couronne", text: "Deux couronnes pour une victoire truquée", detail: "Retourner sa cérémonie contre Naïah, partager le ruban et transformer le verdict en complicité tactile.",
    chapters: [
      C("Le faux jury s'est retiré, mais deux couronnes demeurent. Naïah pose la plus grande sur vos cheveux et recule pour juger l'effet avec une gravité manifestement frauduleuse."),
      C("Vous prenez la seconde et la lui posez de travers. Une branche vient corriger l'angle ; Naïah menace l'arbre d'une mutation administrative immédiate."),
      C("Elle déroule le ruban entre vous. Des lettres apparaissent : « Sa Majesté et son invitée ». Vous rayez le second titre ; la brume inscrit vos deux noms."),
      C("Une copie de vous exécute la révérence attendue avec une jupe illusoire gigantesque. Vous lui prenez la main et la faites saluer Naïah, qui perd toute dignité en riant."),
      C("Les couronnes glissent ensemble. Vous retenez la sienne ; ses mains couvrent les vôtres autour des feuilles, puis restent là lorsque la copie se dissout."),
      C("Naïah tire sur le ruban et vous attire contre son épaule comme si le déplacement appartenait au protocole. Vous changez la collision en étreinte durable."),
      C("Son sourire se calme. Elle avoue avoir préparé une seule couronne pour voir si vous accepteriez une place offerte sans demander ce qui lui revenait."),
      C("Vous posez un baiser sur sa joue. Douze hérauts miniatures annoncent aussitôt qu'elle n'a pas rougi ; leur communiqué devient de plus en plus peu crédible."),
      C("Les hérauts épuisés, vous restez assises couronne contre couronne. Naïah trace une spirale lumineuse sur votre paume, uniquement pour accompagner le silence."),
      C("Avant de repartir, elle partage le ruban en deux longueurs inégales et choisit la plus courte. Elle appelle cela une preuve matérielle de sa défaite héroïque."),
    ],
  },
  {
    id: "naiah-forest-femme-last-double", context: "date-naiah-sanctuary", sex: "femme", concept: "double-recalcitrant", text: "La doublure qui refuse de disparaître", detail: "Démasquer un reflet trop parfait, laisser Naïah être trouvée sans lui arracher un aveu et finir à trois avant que l’illusion ne cède.",
    chapters: [
      C("Une copie de Naïah reste après toutes les autres. Elle vous tend la main avec exactement le sourire attendu et annonce qu'elle est prête à être parfaitement sincère."),
      C("La véritable Naïah s'assied à distance et vous invite à choisir. Vous prenez la main de la copie, puis lui demandez quel détail de votre chute l'a amusée."),
      C("L'illusion récite une réponse élégante. La vraie Naïah regarde vos bottes encore tachées, étouffe le même rire qu'alors et se trahit par cette cruauté minuscule."),
      C("La copie prend votre visage, votre voix et une démarche féminine exagérément gracieuse. Vous accrochez son bras et amplifiez sa parade jusqu'à la rendre impossible."),
      C("Naïah rejoint la procession entre vous deux. Elle perd le contrôle de la doublure à force de rire ; celle-ci s'affaisse en rubans de brume vexés."),
      C("Votre bras demeure passé sous celui de Naïah. Elle resserre le coude au lieu de s'écarter et prétend que la version réelle possède des articulations moins prévisibles."),
      C("Elle accepte de rester tant que la question ne devient pas une cage. Vous montrez le sentier visible et dites seulement que sa présence vous plaît."),
      C("Naïah fait revenir votre double pour surveiller l'entrée. La gardienne salue avec votre propre sérieux tandis que Naïah se blottit contre votre côté."),
      C("Votre baiser est interrompu par la copie qui tousse avec votre voix. Naïah lui lance une pomme de pin ; le rire partagé dissout la solennité."),
      C("Sur le retour, deux paires de traces avancent sans doublure entre elles. Naïah efface néanmoins une empreinte sur trois, par respect pour le mystère."),
    ],
  },
  {
    id: "naiah-forest-femme-rule-zero", context: "date-naiah-sanctuary", sex: "femme", concept: "regle-zero", text: "La règle zéro que la forêt applique vraiment", detail: "Inventer une règle de proximité, franchir un sentier mouvant et découvrir pourquoi Naïah avait besoin qu’on puisse aussi la contredire.",
    chapters: [
      C("Vous réclamez une dernière règle. Naïah fait apparaître une plume, un registre et une greffière spectrale qui vous ressemble avec cinquante années imaginaires de plus."),
      C("Règle zéro : pendant trois respirations, aucune de vous ne se cache derrière une illusion. La greffière frappe le registre ; toute la brume tombe d'un coup."),
      C("La clairière réelle est plus petite et sombre. Naïah se tient sans double, très jeune dans son hésitation et très ancienne dans la façon dont elle la mesure."),
      C("À la première respiration, vous ouvrez la main. À la deuxième, elle y pose la sienne. À la troisième, elle vous entraîne sur une racine mouvante."),
      C("La règle est terminée mais elle ne lâche pas vos doigts. Le chemin se déroule au-dessus d'un fossé ; chaque mouvement passe par une pression de main."),
      C("Naïah propose de sauter, admet que c'est une mauvaise idée et saute quand même. Vous tombez ensemble dans la mousse, sans lâcher prise."),
      C("Elle voulait savoir si vous suivriez quand ses règles changent, mais surtout si vous imposeriez parfois une règle qu'elle ne contrôle pas entièrement."),
      C("Vous proclamez une quatrième respiration et embrassez son front. Naïah proteste contre l'extension illégale avant de rejeter elle-même son propre appel."),
      C("La magie revient par petites touches : une luciole, puis une grenouille munie de la plume. Rien ne se place entre vos corps au repos."),
      C("Naïah inscrit la règle zéro au dos du panneau d'entrée et ajoute : « renouvelable d'un commun accord ». Elle vous confie ensuite la plume."),
    ],
  },
  {
    id: "naiah-forest-homme-prince-refused", context: "date-naiah-sanctuary", sex: "homme", concept: "prince-refuse", text: "Le prince que la cérémonie n’obtiendra pas", detail: "Refuser le rôle héroïque fabriqué par les ombres et inventer avec Naïah une place d’acolyte qu’aucun conte n’avait prévue.",
    chapters: [
      C("Les ombres vous accueillent avec une fanfare et une cape de prince héroïque, taillée pour élargir vos épaules. Naïah siège sur un trône de racines, ravie."),
      C("Vous retirez la cape avant qu'elle se ferme et la posez sur Naïah. Elle disparaît presque dessous ; seule sa couronne dépasse avec une dignité furieuse."),
      C("Vous proposez le titre d'acolyte principal, sans royaume ni sauvetage. Trois renards spectraux consultent le règlement et exigent le partage des biscuits."),
      C("L'ombre chargée de vous incarner bombe le torse et saisit une épée inexistante. Vous reproduisez la pose si excessivement que Naïah tombe du trône en riant."),
      C("Vous l'aidez à se relever. Elle garde votre avant-bras, vérifie par jeu la solidité du héros, puis déplace sa prise jusqu'à votre main."),
      C("Ensemble, vous utilisez la cape comme tente. Le faux royaume disparaît derrière le tissu ; il ne reste que son rire proche et votre respiration tranquille."),
      C("Naïah admet qu'elle voulait voir si vous accepteriez une histoire flatteuse où elle n'était qu'une récompense. Vous dites que cette histoire était surtout très mal écrite."),
      C("Votre réponse lui vole un rire puis un baiser au coin de la bouche. Elle accuse cette flatterie mieux ciblée de constituer une corruption narrative."),
      C("Sous la cape, elle pose la tête contre votre épaule. Les renards tentent de soulever le bord ; vous les repoussez ensemble en défendant votre mauvaise tente."),
      C("Naïah vous remet un insigne d'acolyte, une feuille percée d'un fil violet : mandat révocable, avantages douteux, aucune obligation de la sauver ni de marcher solennellement."),
    ],
  },
  {
    id: "naiah-forest-homme-hero-shadow", context: "date-naiah-sanctuary", sex: "homme", concept: "ombre-heroique", text: "L’ombre héroïque qui vous ressemble mal", detail: "Affronter une caricature de force tranquille, laisser Naïah corriger son piège et gagner une confiance qui ne dépend d’aucun rôle.",
    chapters: [
      C("Votre ombre grandit contre les arbres. D'une voix grave, elle promet de protéger Naïah contre tout danger et vous appelle son modèle avec une admiration insupportable."),
      C("Vous lui demandez de nommer un péril que Naïah ne vaincrait pas seule. Elle invente dragon, armée et pluie ; Naïah réfute chaque réponse avec méthode."),
      C("Quand l'ombre montre ses muscles imaginaires, vous brandissez un biscuit. Naïah déclare le biscuit supérieur sur tous les critères tactiques et réclame une démonstration."),
      C("L'ombre prend votre vrai visage et promet de ne jamais contredire Naïah. Celle-ci cesse de rire : cette obéissance parfaite lui paraît plus dangereuse que le dragon."),
      C("Vous traversez la silhouette de brume et rejoignez Naïah. Votre bras laisse de l'espace près d'elle ; elle choisit elle-même de venir s'y abriter."),
      C("Une branche illusoire tombe. Vous laissez Naïah la dissiper, puis lui demandez seulement si elle souhaite rester dans votre étreinte. Son oui arrive sans détour."),
      C("Elle avait fabriqué la caricature pour vérifier si la force vous servirait à occuper toute la scène. Vous refusez une histoire où elle devrait rapetisser."),
      C("L'ombre devient un chevalier de poche chargé de garder le biscuit. Naïah vient chercher un baiser choisi, sans détresse à récompenser ni victoire à prouver."),
      C("Vous restez contre le tronc, sa joue sous votre clavicule et vos mains visibles dans les siennes. Le chevalier annonce régulièrement que le biscuit demeure sain."),
      C("À l'entrée, Naïah dissout l'ombre mais vous rend le biscuit : vous pouvez être fort sans devenir le mobilier principal, donc aucun certificat ne sera délivré."),
    ],
  },
  {
    id: "naiah-forest-homme-still-race", context: "date-naiah-sanctuary", sex: "homme", concept: "course-immobile", text: "La course que l’on gagne sans avancer", detail: "Accepter une règle absurde, résister aux provocations et obliger Naïah à choisir elle-même la distance qu’elle prétend contrôler.",
    chapters: [
      C("Naïah trace deux cercles dans la mousse et annonce une course dont le vainqueur sera la dernière personne à quitter sa place. L'arrivée passe derrière elle."),
      C("Vous vous installez dans votre cercle. Elle crée une pluie de plumes, une fanfare et une fausse araignée qui réclame poliment votre botte."),
      C("Vous ne bougez pas et invitez l'araignée sur votre genou. Elle s'installe avec une tasse minuscule ; Naïah fronce les sourcils devant cette trahison."),
      C("Une copie de Naïah ajuste votre col et demande si vous céderiez pour un baiser. Vous répondez que l'original devra négocier elle-même."),
      C("La copie disparaît. Naïah garde un pied dans son cercle et étire l'autre vers vous dans un équilibre absurde ; vous lui tendez la main."),
      C("Le sol rapproche soudain les deux cercles. Naïah accuse la forêt d'initiative non autorisée. Vos genoux se touchent sans qu'aucun de vous ait techniquement avancé."),
      C("Elle demande pourquoi vous n'avez pas poursuivi ses leurres. Vous aviez compris qu'il fallait attendre qu'elle décide de venir, ou qu'elle déplace le monde."),
      C("Vous remarquez que déplacer le monde reste une manière d'approcher. Naïah vous embrasse pour interrompre le raisonnement avant qu'il ne devienne trop exact."),
      C("La course continue épaule contre épaule dans deux cercles confondus. L'araignée sert du thé imaginaire et Naïah pose votre main sur son genou."),
      C("Au coucher du soleil, elle dessine une ligne d'arrivée autour de vous deux et déclare une égalité parfaite, puis exige une revanche sans mouvement, avec arbitre araignée et règlement très officiel rédigé sur une feuille minuscule."),
    ],
  },
  {
    id: "naiah-edge-femme-night-watch", context: "date-naiah-akuhn", sex: "femme", concept: "veille-inversee", text: "La relève que personne ne vous a confiée", detail: "Monter une veille à deux, déplacer les figurines au rythme de la cité et laisser la vigilance devenir un appui choisi.",
    chapters: [
      C("Naïah aligne trois soldats miniatures sur le parapet et vous confie la tour orientale. Une cape de garde apparaît sur vos épaules, ornée d'une chèvre couronnée."),
      C("Vous retournez la cape et la posez sur vos deux épaules. Naïah proteste que l'uniforme perd toute lisibilité, puis se glisse dessous avant votre réponse."),
      C("Au loin, les lanternes changent. Vous déplacez une figurine lorsque la ronde descend ; Naïah corrige d'un millimètre et prédit le détour du troisième garde."),
      C("Vous inventez pour chaque soldat une raison privée d'être pressé : une soupe, une lettre, une sœur. Naïah ajoute des détails tactiques assez exacts pour les rendre plausibles."),
      C("Le vent soulève la cape. Vous la retenez autour de Naïah ; sa main ferme le tissu sur votre taille. Elle choisit votre chaleur plutôt qu'un sort plus rapide."),
      C("Une silhouette féminine apparaît sur la muraille, possible reine du guet. Naïah la dissipe avant que la ville vous donne un titre pour justifier votre présence."),
      C("Vous rappelez que vous êtes venue parce qu'elle vous a invitée et restée parce que vous le choisissez. Naïah qualifie cette formulation d'affreusement robuste."),
      C("Elle reprend sa voix d'officière et vous condamne à un baiser pour insubordination. Vous exigez un procès ; l'affaire est classée avant l'ouverture des débats."),
      C("La veille continue sous la cape, ses jambes repliées contre les vôtres et sa tête sur votre épaule. Les figurines bougent seules au passage des vraies lanternes."),
      C("À la dernière relève, Naïah attache le blason de chèvre à votre manche. Votre victoire invisible est d'avoir tout observé sans laisser la cité décider de vous."),
    ],
  },
  {
    id: "naiah-edge-femme-sister-trial", context: "date-naiah-akuhn", sex: "femme", concept: "proces-du-manteau", text: "Le procès du manteau trop raide", detail: "Juger une imitation d’Allenna sans faire parler la véritable Allenna, traverser une plaisanterie qui dérape et choisir de rester.",
    chapters: [
      C("Naïah pose la figurine au manteau raide dans un cercle de cailloux. Une caricature théâtrale d'Allenna apparaît, bras croisés et sourcils cousus de sévérité."),
      C("Vous acceptez le rôle de défense. La copie produit trois rapports, une épée réglementaire et un morceau de pain soigneusement partagé en deux comme pièces à conviction."),
      C("L'imitation connaît le rythme des silences, le moment où une réponse sèche cache l'inquiétude et la main qui cherche machinalement une blessure. La satire trahit l'attention."),
      C("Vous soulignez cette précision. Naïah réplique que les geôliers connaissent aussi leurs prisonniers ; la phrase vise votre histoire et frappe volontairement."),
      C("Vous retirez votre figurine du cercle : vous pouvez rester, mais pas servir de cible pour éviter votre observation. La copie baisse les bras quand Naïah cesse de l'animer."),
      C("Naïah déplace sa propre pierre hors du tribunal et s'assied près de vous. Sans produire d'excuse parfaite, elle pose le petit manteau entre vos mains."),
      C("Elle avoue savoir exactement comment Allenna se tient quand elle veut protéger et punir dans la même seconde. Vous ne répondez ni pour sa sœur ni pour l'avenir."),
      C("Pour empêcher le silence de devenir un mausolée, Naïah rend à la copie un chapeau gigantesque. Cette fois, elle imite seulement son refus de l'aimer."),
      C("Vous riez ensemble. Naïah cherche votre main, puis un baiser très doux qu'elle interrompt pour condamner le tribunal à ranger tous les cailloux."),
      C("La figurine rejoint sa poche sans acquittement ni condamnation. Le dossier reste ouvert ; le couvre-chef, en revanche, est déclaré définitivement coupable."),
    ],
  },
  {
    id: "naiah-edge-femme-bottled-city", context: "date-naiah-akuhn", sex: "femme", concept: "ville-en-fiole", text: "La ville assez petite pour tenir entre deux paumes", detail: "Réduire le symbole sans nier sa douleur, partager la fiole et garder un désir de proximité qui n’exige aucune résolution familiale.",
    chapters: [
      C("L'éclat dans la fiole grandit jusqu'à reproduire Akuhn’Nabad en miniature. Naïah la fait tourner ; les tours glissent entre vos paumes jointes comme des poissons verts."),
      C("Une petite reine de brume apparaît sur le rempart et proclame que toutes les voyageuses doivent choisir un camp. Vous lui confisquez sa couronne pour défaut de compétence."),
      C("Naïah rit, puis vous nomme administratrice temporaire des rues inutiles. Vous créez une place réservée aux chèvres et un pont menant volontairement nulle part."),
      C("La miniature tente de vous attribuer une robe, un rang et une place près du trône. Naïah efface le trône mais conserve votre silhouette sur le pont absurde."),
      C("Vous lui demandez quelle partie elle veut garder. Elle choisit une cuisine, un escalier et une fenêtre où deux enfants observaient autrefois l'orage sans permission."),
      C("Vos doigts referment ensemble la fiole autour de ces trois lieux. Naïah pose sa joue contre la vôtre pour regarder sans donner davantage à la ville."),
      C("Elle admet qu'une part d'elle souhaite encore que les murailles regrettent son absence. Vous n'appelez pas cette envie faiblesse, victoire ou étape à dépasser."),
      C("Une minuscule chèvre escalade alors la tour principale et remplace les bannières par des chaussettes. Naïah accuse votre administration d'une efficacité inquiétante."),
      C("Vous échangez un baiser tandis que la ville miniature poursuit son coup d'État textile. La lumière reste entre vos mains, jamais utilisée pour embellir le geste."),
      C("Naïah libère l'éclat vers les murailles, mais garde le petit pont inutile dans la fiole. Il portera vos deux noms jusqu'à une prochaine partie."),
    ],
  },
  {
    id: "naiah-edge-homme-goat-council", context: "date-naiah-akuhn", sex: "homme", concept: "conseil-de-la-chevre", text: "Le conseil de guerre présidé par une chèvre", detail: "Déjouer un rôle de conquérant, faire de la stratégie un jeu à égalité et laisser Naïah choisir une proximité qui ne ressemble pas à une reddition.",
    chapters: [
      C("La chèvre miniature vous désigne général suprême. Un uniforme de brume élargit vos épaules et ajoute tellement de médailles que vous penchez dangereusement vers le parapet."),
      C("Vous retirez les décorations une à une et les remettez à la chèvre. Naïah consigne cette abdication comme la première décision raisonnable du nouveau commandement."),
      C("Votre plan ouvre la porte par les cuisines ; le sien transforme les tours en moulins. Vous combinez les deux et créez une boulangerie défensive d'une grande inutilité."),
      C("Une figurine prend votre voix et exige qu'on protège Naïah derrière les lignes. Elle l'envoie aussitôt balayer les écuries pour insubordination conceptuelle."),
      C("Vous reconnaissez qu'elle n'a besoin d'aucun gardien, mais demandez une place à ses côtés. Naïah rapproche vos cailloux sans les fusionner ni les hiérarchiser."),
      C("Le vent renverse le conseil. Vos mains se referment ensemble sur la chèvre ; Naïah garde votre poignet contre le sien après que le danger ridicule a disparu."),
      C("Elle avoue avoir préparé le général caricatural pour voir si un rôle flatteur vous ferait oublier la femme qui dirigeait réellement le jeu."),
      C("Vous condamnez l'uniforme à devenir une couverture. Naïah transforme les médailles en grelots et vient partager le tissu en faisant le moins de bruit possible."),
      C("Sous la couverture militaire devenue absurde, elle vous embrasse puis appuie son front contre le vôtre. La chèvre prononce un discours que personne n'écoute."),
      C("Le conseil vous démet tous deux pour conduite indigne. Naïah glisse la figurine dans votre poche : elle surveillera que vous ne redeveniez jamais général suprême."),
    ],
  },
  {
    id: "naiah-edge-homme-watchman-mask", context: "date-naiah-akuhn", sex: "homme", concept: "masque-du-guetteur", text: "Le guetteur qui refuse son uniforme", detail: "Observer la ville sans jouer au protecteur, rendre son masque à une illusion trop parfaite et construire avec Naïah une veille à hauteur humaine.",
    chapters: [
      C("Un guetteur de brume prend votre visage, une mâchoire héroïque et une lance. Il promet de tenir la frontière pendant que Naïah pourra enfin se reposer."),
      C("Vous lui demandez qui le lui a demandé. L'illusion cite le devoir, la galanterie et trois vieux contes ; Naïah ajoute le mauvais goût comme quatrième source."),
      C("Vous prenez la lance, l'utilisez pour suspendre la cape contre le vent et rendez au guetteur une tasse. Sa posture martiale supporte mal ce nouvel emploi."),
      C("Naïah déplace la patrouille miniature avec une exactitude chirurgicale. Vous lisez le terrain et annoncez le seul angle mort qu'elle avait volontairement laissé dans votre secteur."),
      C("Elle vous accuse d'avoir déjoué son test ; vous l'accusez d'avoir truqué les données. Le faux guetteur note que votre dispute ressemble dangereusement à une bonne équipe."),
      C("Vous ne promettez pas de la défendre contre sa propre histoire. Vous proposez simplement de veiller avec elle, assez près pour intervenir si elle le demande."),
      C("Naïah retire votre visage au guetteur et lui donne celui d'une chèvre sévère. Elle garde pourtant la cape tendue au-dessus de vos épaules réunies."),
      C("Une secousse lointaine de lumière verte traverse la cité. Sa main serre la vôtre une seconde ; vous ne la transformez pas en question qu'elle devrait expliquer."),
      C("Le silence se détend. Elle vous embrasse sous la cape, puis ordonne au guetteur caprin de détourner les yeux conformément au règlement récemment inventé."),
      C("En redescendant, Naïah laisse la lance servir de mât à une chaussette. Le masque héroïque reste aux ruines ; votre main, elle, reste dans la sienne."),
    ],
  },
  {
    id: "naiah-edge-homme-third-road", context: "date-naiah-akuhn", sex: "homme", concept: "troisieme-route", text: "Le passage qui ne mène ni dedans ni dehors", detail: "Refuser les deux issues imposées par la cité, bâtir un chemin miniature et laisser le rapprochement venir d’une troisième proposition.",
    chapters: [
      C("Le plan de cailloux propose deux routes : entrer dans Akuhn’Nabad ou lui tourner définitivement le dos. Naïah prétend que le plateau exige une réponse avant minuit."),
      C("Vous prenez le noyau-ministre et tracez une troisième route le long du ravin. Elle ne conquiert rien, ne fuit rien et rejoint seulement les ruines où vous êtes."),
      C("Naïah convoque un tribunal de lucioles pour fraude cartographique. Vous défendez le droit universel de dessiner un chemin quand les deux autres sont malhonnêtes."),
      C("La ville miniature envoie un chevalier portant votre visage pour bloquer le passage. Vous lui donnez congé et lui demandez d'aller apprendre la pâtisserie."),
      C("Naïah suit votre route du doigt. Elle demande où elle mène demain ; vous répondez qu'elle peut changer, disparaître ou revenir au même endroit sans devenir une promesse."),
      C("Elle place sa figurine au milieu, puis la vôtre à côté, séparée d'un petit espace délibéré. Vos mains se rejoignent exactement au-dessus de cet intervalle."),
      C("Naïah confie qu'elle déteste les récits où dépasser l'exil signifie pardonner la porte ou ne plus regarder la ville. Votre route n'exige aucun des deux."),
      C("Le noyau-ministre proclame aussitôt la troisième voie paradis fiscal. Naïah l'exile dans votre manche, où il poursuit son discours avec une voix ridiculement grave."),
      C("Vous l'embrassez pendant qu'elle tente de faire taire le ministre sans libérer votre main. Le baiser devient plus calme lorsque la voix finit par s'étouffer."),
      C("Naïah efface les deux anciennes routes et conserve la troisième sur une ardoise. Elle refuse de lui donner un nom avant que vous l'ayez parcourue à nouveau."),
    ],
  },
  {
    id: "naiah-home-femme-chair-court", context: "home-naiah", sex: "femme", concept: "cour-du-fauteuil", text: "Le tribunal du fauteuil annexé", detail: "Contester le royaume domestique, devenir sa co-juge et transformer une bataille de coussins en repos partagé.",
    chapters: [
      C("Naïah rouvre la séance depuis le fauteuil et vous accuse d'avoir laissé le canapé sans représentation. Une greffière spectrale porte votre visage, vos cheveux et une moustache judiciaire."),
      C("Vous récusez la greffière pour conflit d'apparence et prenez vous-même place sur l'accoudoir. Naïah vous nomme co-juge avant que vous puissiez contester le règlement."),
      C("La première affaire oppose le plaid au coussin violet. Vous écoutez leurs voix absurdes, puis condamnez les deux objets à être partagés entre les souveraines présentes."),
      C("Naïah obéit en vous attirant sous le plaid. Le fauteuil devient trop étroit ; elle refuse néanmoins d'abandonner un territoire gagné par une procédure aussi douteuse."),
      C("Vous proposez d'agrandir le royaume jusqu'au sol. Des coussins forment une pente ; vous glissez ensemble et finissez enlacées au pied du trône renversé."),
      C("La greffière demande si cette position constitue un précédent. Naïah répond qu'aucune femme raisonnable ne devrait tenter de reproduire votre chute avec autant d'élégance."),
      C("Elle admet avoir annexé la pièce pour éviter de demander directement une place. Vous ne lui offrez ni demeure entière ni éternité : seulement cette place, maintenant."),
      C("Une armée de coussins tente un coup d'État. Vous les repoussez ensemble, puis scellez la paix par un baiser dont la greffière refuse de consigner les détails."),
      C("Le royaume aboli, vous restez allongées sous le même plaid. Naïah dessine sur votre paume la frontière minuscule qu'elle accepte de ne plus défendre."),
      C("Avant de fermer les yeux, elle promulgue une dernière loi : personne ne remettra le fauteuil droit avant le matin, preuve que le désordre peut aussi devenir une adresse."),
    ],
  },
  {
    id: "naiah-home-femme-real-double", context: "home-naiah", sex: "femme", concept: "double-de-l-hotesse", text: "L’hôtesse parfaite qui ne vous ressemble pas", detail: "Corriger une copie féminine trop lisse, lui apprendre les vraies habitudes du logis et montrer ce qu’aucune illusion ne peut décider.",
    chapters: [
      C("Votre double spectral revient en hôtesse parfaite : robe impeccable, sourire mesuré, connaissance miraculeuse de chaque objet. Elle promet à Naïah une soirée sans erreur ni hésitation."),
      C("Vous lui demandez d'ouvrir le tiroir qui coince. La copie tire avec grâce ; le meuble illusoire traverse le mur. Naïah applaudit cette démonstration de compétence."),
      C("Vous montrez le vrai geste maladroit, hanche contre le meuble et poignée soulevée. Naïah tient l'autre bord tandis que la copie prétend avoir prévu la méthode."),
      C("L'illusion sert le thé dans la mauvaise tasse. Naïah échange les deux et révèle qu'elle connaît déjà celle que vous prenez quand vous êtes fatiguée."),
      C("La copie formule une déclaration parfaite sur votre féminité souveraine. Vous lui demandez ce qu'elle fera si Naïah rit ; elle promet de préserver l'ambiance et perd aussitôt le procès."),
      C("Vous admettez ne pas savoir comment poursuivre la soirée. Naïah pose ses pieds sur les vôtres et juge cette ignorance infiniment plus habitable que le discours impeccable."),
      C("Elle craint qu'une version plus belle de vous sache toujours quoi lui offrir. Vous répondez que seule la version réelle peut lui demander ce qu'elle souhaite maintenant."),
      C("Naïah place vos bras autour d'elle. La copie pousse un soupir romantique ; vous lui lancez chacune un coussin, et les projectiles la dissolvent au milieu."),
      C("Vous échangez un baiser dans les plumes imaginaires. Naïah en glisse une derrière votre oreille et affirme que ce détail améliore beaucoup votre compétence domestique."),
      C("Elle laisse au dos du règlement trois notes : soulever le tiroir, garder sa tasse à gauche, ne jamais employer l'hôtesse parfaite. Votre signature rejoint la sienne."),
    ],
  },
  {
    id: "naiah-home-femme-lantern-address", context: "home-naiah", sex: "femme", concept: "adresse-de-la-lanterne", text: "La lanterne qui apprend votre adresse", detail: "Trouver une place durable à son objet, parcourir le logis à sa lumière et laisser Naïah choisir la forme du matin.",
    chapters: [
      C("Naïah éteint toutes les lampes sauf la sienne. Le halo violet transforme votre logis sans modifier les murs ; elle demande une visite nocturne de sa future adresse."),
      C("Vous parcourez les pièces côte à côte. Sur chaque seuil, elle propose une fonction absurde : phare à mites, prison d'ombres, tribunal des chaussettes perdues."),
      C("Dans la cuisine, la lanterne révèle de la farine. Naïah y dessine vos silhouettes du pied puis ajoute une troisième, très petite, pour représenter la lumière."),
      C("Elle vous imite guidant la visite, avec votre voix et une posture féminine beaucoup trop élégante. Vous entourez sa taille ; l'imitation se brise en rire."),
      C("Près de la chambre, vous clarifiez que la lanterne peut rester au salon, repartir ou entrer avec elle pour dormir : aucune option ne condamnera les autres."),
      C("Naïah choisit d'abord le salon, recule jusqu'au couloir, puis revient déplacer l'objet près de la chambre. Elle accuse la lanterne d'avoir changé d'avis."),
      C("Sa propriétaire, elle, veut se réveiller une fois ici pour vérifier que l'adresse existe encore quand elle ne la regarde pas. La demande demeure simple."),
      C("Naïah crée un lit de nuages spectaculaire. Vous montrez les draps réels ; elle soupire devant leur manque de panache et s'y glisse pourtant."),
      C("Vous vous embrassez puis trouvez une position calme, ses doigts accrochés aux vôtres. Le contact ne réclame aucune étape suivante pour devenir complet."),
      C("Au matin, la lanterne repose sur l'étagère. Naïah ajoute au plan du salon une flèche : « ici, même quand je dors », puis réclame une nouvelle expérience."),
    ],
  },
  {
    id: "naiah-home-homme-couch-republic", context: "home-naiah", sex: "homme", concept: "republique-du-canape", text: "La république du canapé contre le royaume du fauteuil", detail: "Négocier deux territoires domestiques, renverser les rôles de souverain et d’hôte, puis abolir la frontière à deux.",
    chapters: [
      C("Naïah gouverne le fauteuil ; vous fondez la République du canapé. Elle envoie un ambassadeur spectral portant votre visage, une moustache gigantesque et un discours sur le mobilier."),
      C("Vous révoquez l'ambassadeur et le nommez portemanteau. Votre offre donne à Naïah la moitié du plaid contre un droit permanent de passage entre les sièges."),
      C("Elle réclame aussi les biscuits, un baiser de douane et l'immunité pour les coussins en mission secrète. Vous négociez le baiser et refusez l'immunité."),
      C("La négociation devient parcours physique : Naïah saute sans toucher le sol, vous utilisez votre bras comme pont et l'ambassadeur commente chaque mouvement comme une bataille."),
      C("Elle s'arrête assise sur votre avant-bras, plus près que prévu. Vous vérifiez la position ; Naïah ajuste elle-même vos mains avant de déclarer le pont conforme."),
      C("Vous abaissez lentement le pont et la gardez contre vous. Elle déplace le drapeau républicain sur votre épaule, puis pose sa joue dessous comme usage officiel."),
      C("Naïah savait conquérir la maison, pas quoi faire si vous la laissiez gagner sans devenir son sujet. Vous proposez de perdre le royaume et garder la place."),
      C("L'ambassadeur tente un hymne solennel. Naïah le transforme en grenouille moustachue et vous embrasse pendant que l'animal continue de chanter trop bas."),
      C("Vous partagez le canapé, le plaid et les biscuits. Naïah garde vos doigts dans les siens et invente des lois uniquement pour décider qui cherchera l'eau."),
      C("La frontière de coussins est abolie avant le sommeil. Le fauteuil reste un royaume vide ; la République accueille sa première résidente invitée pour la nuit."),
    ],
  },
  {
    id: "naiah-home-homme-perfect-host", context: "home-naiah", sex: "homme", concept: "double-hote", text: "L’hôte parfait qui n’a jamais vécu ici", detail: "Déjouer un double masculin trop assuré, révéler les vraies maladresses du foyer et faire de Naïah une invitée qui peut aussi prendre soin.",
    chapters: [
      C("Votre double spectral revient en maître de maison impeccable : veste sans pli, voix profonde et connaissance miraculeuse de chaque objet. Il promet une soirée sans erreur."),
      C("Vous le laissez réparer le tiroir. Il tire trop fort ; le meuble illusoire traverse le mur dans un bruit de catastrophe. Naïah applaudit votre délégation stratégique."),
      C("Vous montrez comment le vrai tiroir doit être soulevé. Naïah tient l'autre bord, votre double prend des notes et prétend avoir prévu cette méthode."),
      C("L'illusion sert les boissons mais vous donne la tasse de Naïah. Elle échange les deux puis explique au double que vous soufflez toujours sur la première gorgée."),
      C("La copie tente une déclaration parfaite. Vous demandez ce qu'il fera si Naïah rit au mauvais moment ; il promet de rester grave et se condamne lui-même."),
      C("Vous vous asseyez près d'elle et admettez ne pas savoir exactement comment finir la soirée. Naïah pose ses pieds sur vos chaussures et préfère cette ignorance."),
      C("Elle dit que les hommes sachant toujours quoi faire finissent parfois par décider ce que les autres veulent. Vous l'invitez à choisir le prochain geste avec vous."),
      C("Naïah place vos mains autour d'elle. Le double pousse un soupir romantique ; vous lui lancez chacun un coussin et le dissolvez dans des plumes."),
      C("Vous échangez un baiser au milieu des plumes impossibles. Naïah en glisse une derrière votre oreille et affirme que votre compétence domestique vient d'augmenter."),
      C("Elle laisse au dos du plan une liste : soulever le tiroir, garder sa tasse à gauche, ne jamais employer l'hôte parfait. Le vrai modèle reste réparable."),
    ],
  },
  {
    id: "naiah-home-homme-object-stays", context: "home-naiah", sex: "homme", concept: "lanterne-et-loi", text: "L’objet qui reste quand sa propriétaire hésite", detail: "Suivre les déplacements impossibles de la lanterne, distinguer invitation et possession, puis choisir ensemble la forme du matin.",
    chapters: [
      C("Naïah place sa lanterne sur l'étagère, puis elle réapparaît dans votre main. Elle accuse l'objet de refuser la séparation et ouvre une enquête magistrale."),
      C("Vous la reposez. Elle apparaît dans votre poche. Naïah trouve sa propre signature magique et affirme qu'une tierce personne malveillante a dû l'imiter."),
      C("Vous suggérez que la propriétaire souhaite peut-être que l'objet reste. Naïah fait apparaître un avocat spectral qui dénonce une hypothèse sans preuve et porte votre taille."),
      C("L'avocat vous caricature en protecteur possessif, promettant de garder la lanterne, sa propriétaire et la forêt dans une armoire sûre. Vous le révoquez et ouvrez l'armoire."),
      C("Vous dites que l'objet peut rester sans obliger Naïah à revenir, et qu'elle peut revenir sans que l'objet serve de dette. Elle inspecte chaque clause."),
      C("La lanterne cesse de se téléporter. Naïah s'assied devant l'étagère et vous invite à venir contre elle ; votre épaule devient son appui choisi."),
      C("Laisser quelque chose ici signifie qu'une part d'elle existera dans une pièce qu'elle ne contrôle pas. Vous nommez cela un choix, jamais une prise."),
      C("La lanterne projette aussitôt une ombre où vous servez le petit-déjeuner en robe royale à une armée de lucioles. Naïah exige la révérence complète."),
      C("Vous obéissez assez mal pour la faire rire. Elle vous tire à elle par la ceinture imaginaire, vous embrasse puis dissipe la robe avant qu'elle devienne loi."),
      C("Naïah choisit le canapé, tête contre votre cuisse et main refermée sur deux doigts. Au matin, la lanterne n'a pas bougé ; vous non plus, malgré un rêve de lucioles."),
    ],
  },
];

function routeFromScene(scene: AuthoredScene): IntimacyRoute {
  const chapters = Object.fromEntries(MODES.map((mode) => [mode, scene.chapters.map((chapter) => lines(chapter.all))])) as Record<IntimacyMode, DialogueLine[][]>;
  return { id: scene.id, text: scene.text, detail: scene.detail, chapters };
}

export function naiahProximityContext(dateId?: string, home = false): NaiahProximityContext | undefined {
  if (home) return "home-naiah";
  return CONTEXTS.includes(dateId as NaiahProximityContext) ? dateId as NaiahProximityContext : undefined;
}
export function naiahProximityPhase(chapter: number): NaiahProximityPhase | undefined { return PHASES[chapter]; }
export function naiahProximityApproaches(context?: NaiahProximityContext): NaiahProximityApproach[] | undefined { return context ? NAIAH_PROXIMITY_APPROACHES[context] : undefined; }
export function naiahProximityOpening(context: NaiahProximityContext): DialogueLine[] { return NAIAH_PROXIMITY_OPENINGS[context]; }
export function naiahProximityEnding(context: NaiahProximityContext): DialogueLine[] { return NAIAH_PROXIMITY_ENDINGS[context]; }
export function naiahProximityRoutes(context: NaiahProximityContext | undefined, sex: PlayerSex): IntimacyRoute[] {
  if (!context || sex === "intersexe") return [];
  return SCENES.filter((scene) => scene.context === context && scene.sex === sex).map(routeFromScene);
}

export function validateNaiahProximity() {
  let combinations = 0; let routes = 0; let chapters = 0;
  for (const context of CONTEXTS) for (const sex of SEXES) {
    combinations++;
    const entries = naiahProximityRoutes(context, sex);
    if (entries.length !== 3) throw new Error(`${context}/${sex}: trois scènes de proximité Naïah requises`);
    const concepts = SCENES.filter((scene) => scene.context === context && scene.sex === sex).map((scene) => scene.concept);
    if (new Set(concepts).size !== 3) throw new Error(`${context}/${sex}: trois dispositifs matériels distincts requis`);
    entries.forEach((entry) => {
      routes++;
      MODES.forEach((mode) => {
        const routeChapters = entry.chapters[mode];
        const tooShort = routeChapters.some((chapter) => chapter.map((line) => line.text).join(" ").split(/\s+/u).length < 18);
        if (routeChapters.length !== PHASES.length || tooShort) throw new Error(`${entry.id}/${mode}: dix séquences substantielles requises`);
        chapters += routeChapters.length;
      });
    });
  }
  if (naiahProximityRoutes("home-naiah", "intersexe").length) throw new Error("Le canon intersexe ne doit pas être improvisé");
  return { contexts: CONTEXTS.length, combinations, routes, chapters };
}
