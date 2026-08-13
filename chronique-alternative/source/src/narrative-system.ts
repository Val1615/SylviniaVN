import type { DialogueLine } from "./game-data";

export type NarrativeKind = "intro" | "route" | "ambient" | "social" | "date" | "home";

export type NarrativeContext = {
  sceneId: string;
  title: string;
  kind: NarrativeKind;
  phase: "intro" | "response";
  cast: string[];
  baseMood: string;
  spotName?: string;
  action?: string;
};

type VoiceTexture = {
  name: string;
  moods: string[];
  gestures: string[];
  invitations: string[];
  reflections: string[];
  closures: string[];
};

export const CHARACTER_NAMES: Record<string, string> = {
  hylee: "Hylee",
  remerii: "Remerii",
  iriana: "Iriana",
  valurn: "Valurn",
  naiah: "Naïah",
  lineva: "Lineva",
  saidin: "Saidin",
  bellirith: "Bellirith",
  amanea: "Amanea",
  draven: "Draven",
};

const VOICES: Record<string, VoiceTexture> = {
  hylee: {
    name: "Hylee",
    moods: ["soft", "teasing", "surprised", "determined", "soft", "sad"],
    gestures: [
      "Hylee ramène une mèche blanche derrière son oreille, puis renonce à dissimuler le léger tremblement de ses doigts.",
      "Un fil de givre court sur sa manche avant de fondre ; elle le regarde disparaître comme on vérifie qu’une peur est restée sous contrôle.",
      "Elle change son poids d’une jambe à l’autre, hésite, puis se rapproche juste assez pour ne plus avoir à parler trop fort.",
      "Son sourire arrive en retard sur son regard, fragile mais choisi, et elle vous laisse le temps de le remarquer.",
    ],
    invitations: [
      "Tu peux prendre ton temps. Je ne veux pas la réponse qui me rassure le plus ; je veux celle qui te ressemble.",
      "Je parle beaucoup quand j’ai peur du silence. Cette fois, j’aimerais t’entendre jusqu’au bout.",
      "Si tu n’es pas d’accord, dis-le. Je préfère une vérité un peu froide à une gentillesse qui nous enferme.",
      "Je ne te demande pas de décider de tout. Seulement de rester avec moi dans cette minute-là.",
    ],
    reflections: [
      "Ce n’est pas seulement ta réponse qui compte. C’est la manière dont tu m’as laissé une place pour répondre à mon tour.",
      "J’avais préparé trois façons de me protéger. Tu viens d’en rendre au moins deux inutiles.",
      "Je crois que je peux garder ce moment sans en faire une promesse pour toujours. C’est nouveau pour moi.",
      "Ça me touche plus que je ne voudrais l’admettre. Attends… non. Je veux justement l’admettre.",
    ],
    closures: [
      "Reste encore un peu. On n’a pas besoin de remplir chaque seconde pour qu’elle compte.",
      "La prochaine fois, je serai peut-être moins nerveuse. Ou mieux préparée à être nerveuse devant toi.",
      "Je veux me souvenir de ce que j’ai choisi ici, pas seulement de ce que j’ai évité.",
    ],
  },
  remerii: {
    name: "Remerii",
    moods: ["strict", "calm", "smirk", "neutral", "calm", "sad"],
    gestures: [
      "Remerii aligne machinalement deux objets, s’en aperçoit et laisse volontairement le second de travers.",
      "Son regard vous examine avec précision, puis s’adoucit lorsqu’elle comprend que vous ne cherchez pas à deviner la réponse attendue.",
      "Elle inspire pour corriger un détail, ferme la bouche et transforme l’objection en une question plus honnête.",
      "Ses doigts cessent enfin de battre une mesure invisible contre sa manche ; toute son attention revient vers vous.",
    ],
    invitations: [
      "Ne cherchez pas la formulation parfaite. Une réponse exacte à ce que vous ressentez sera déjà suffisamment difficile.",
      "Je vous écoute. Et, pour éviter tout malentendu, ceci n’est ni un examen ni une démonstration pédagogique.",
      "Vous pouvez me contredire. Je vous demande seulement de le faire parce que vous le pensez, pas pour m’impressionner.",
      "Prenez la place nécessaire à votre réponse ; je m’efforcerai de ne pas la structurer à votre place.",
    ],
    reflections: [
      "Votre raisonnement n’est pas celui que j’aurais employé. C’est précisément ce qui le rend utile — et troublant.",
      "Vous venez de distinguer l’attention du contrôle avec une netteté que je devrais noter. Je ne le ferai pas. Pas maintenant.",
      "Je m’attendais à devoir défendre ma position. Vous m’avez offert la possibilité plus inconfortable de la reconsidérer.",
      "Cette réponse comporte plusieurs imprécisions. Aucune ne m’empêche de comprendre ce que vous avez voulu me donner.",
    ],
    closures: [
      "Nous reprendrons cette conversation. Pas pour la corriger : pour voir ce qu’elle sera devenue.",
      "Restez. Le silence qui suit fait encore partie de l’échange.",
      "Je consens à ne pas conclure immédiatement. Mes progrès sont remarquables ; vous pouvez avoir l’air impressionné·e.",
    ],
  },
  iriana: {
    name: "Iriana",
    moods: ["stern", "calm", "smirk", "troubled", "neutral", "calm"],
    gestures: [
      "Iriana vérifie d’un regard que personne ne réclame son attention, puis relâche cette posture droite que la cour prend pour son état naturel.",
      "Sa main monte vers l’endroit où reposerait une couronne, s’arrête à mi-chemin et redescend avec une lenteur presque soulagée.",
      "Elle pèse sa prochaine phrase comme un décret avant de décider qu’elle a le droit d’être simplement imparfaite.",
      "Le sourire qu’elle vous adresse n’est destiné à aucun témoin ; cette absence de public semble le rendre plus difficile encore.",
    ],
    invitations: [
      "Je ne vous demande ni un rapport ni une réponse diplomatique. Dites-moi ce que vous diriez si mon titre n’écoutait pas avec moi.",
      "Vous pouvez refuser. J’aimerais apprendre à entendre ce mot sans chercher aussitôt comment le rendre plus commode.",
      "Parlez-moi comme à Iriana. L’impératrice saura attendre quelques minutes sans nous interrompre.",
      "Choisissez selon votre désir, pas selon ce qui flatterait le mieux la couronne. Je tenterai d’en faire autant.",
    ],
    reflections: [
      "Votre réponse ne me sert pas ; elle me rencontre. J’avais presque oublié la différence.",
      "Vous n’avez pas essayé de rendre mon pouvoir plus confortable. Vous avez demandé ce que son poids faisait à la personne dessous.",
      "Une décision qui ne deviendra ni loi ni précédent… Je comprends enfin pourquoi elle peut être précieuse.",
      "Je pourrais reformuler cela de manière plus politique. Je préfère le garder exactement comme vous l’avez dit.",
    ],
    closures: [
      "Cette minute restera hors des archives. Cela ne la rend pas moins réelle.",
      "Revenez me parler ainsi, même lorsque la cour se trouvera entre nous.",
      "Je dois reprendre mon titre. Laissez-moi seulement quelques respirations avant de le remettre.",
    ],
  },
  valurn: {
    name: "Valurn",
    moods: ["amused", "charming", "away", "surprised", "neutral", "annoyed"],
    gestures: [
      "Valurn fait tourner une pièce entre ses doigts ; elle s’immobilise lorsqu’il réalise que sa plaisanterie ne suffira pas à détourner votre attention.",
      "Son sourire gagne d’abord ses lèvres, puis hésite avant d’atteindre ses yeux — comme s’il cherchait encore la sortie la plus proche.",
      "Une étincelle sombre naît dans sa paume et s’éteint aussitôt : aucun pacte ne viendra négocier cette conversation à sa place.",
      "Il recule d’un demi-pas par habitude, observe l’espace laissé entre vous et choisit finalement de ne pas l’agrandir.",
    ],
    invitations: [
      "Aucune bonne réponse n’est exigée, ce qui constitue déjà un contrat remarquablement suspect. Que choisissez-vous ?",
      "Vous pouvez partir, mentir ou rester honnêtement. J’ai une préférence, mais je m’efforce de ne pas en faire une dette.",
      "Ne jouez pas pour me laisser gagner. Si je dois être choisi, j’aimerais que ce soit après une partie réelle.",
      "Dites ce que vous voulez. Je promets de ne pas transformer votre désir en clause cachée — au moins pendant cette conversation.",
    ],
    reflections: [
      "Vous avez encore refusé le marché que je vous proposais sans refuser ma compagnie. C’est une technique dangereusement efficace.",
      "Je pourrais plaisanter maintenant. Le fait que je n’en aie pas envie devrait vous inquiéter autant que moi.",
      "Vous me laissez une sortie, et c’est précisément pour cela que rester commence à ressembler à mon choix.",
      "Cette réponse ne me donne aucun avantage. Je vais donc devoir admettre qu’elle m’a simplement touché.",
    ],
    closures: [
      "Considérez que vous avez gagné cette manche. Je réclamerai une revanche uniquement pour vous revoir.",
      "Ne faites pas de ce moment une promesse. Faites-en plutôt une raison de tenter le suivant.",
      "Je reste encore un peu. Toute personne prétendant le contraire ment avec beaucoup de charme.",
    ],
  },
  naiah: {
    name: "Naïah",
    moods: ["smirk", "thinking", "laugh", "neutral", "sad", "angry"],
    gestures: [
      "La brume autour de Naïah esquisse une forme, puis se défait lorsqu’elle décide de ne pas laisser sa magie parler avant elle.",
      "Son sourire semble annoncer une farce ; son regard, lui, demeure immobile et attend une réponse qu’elle ne contrôlera pas.",
      "Naïah tend la main, la retire avant le contact et vous laisse choisir si la distance doit réellement disparaître.",
      "Une illusion de couronne apparaît au-dessus de sa tête. Elle lève les yeux, agacée, et la dissipe d’un claquement de doigts.",
    ],
    invitations: [
      "Tu peux dire non. Un vrai non, pas celui qu’on prononce en attendant que je le transforme en oui plus joli.",
      "Je pourrais deviner ce que tu veux entendre. Je préfère prendre le risque de te laisser me surprendre.",
      "Choisis ce qui te ressemble, pas ce qui rendrait l’histoire plus spectaculaire. J’essaierai de ne pas tricher avec le décor.",
      "Je te promets une chose rare : ta réponse restera la tienne, même si elle me contrarie.",
    ],
    reflections: [
      "Tu n’as pas essayé de me vaincre ni de me sauver. C’est terriblement déstabilisant… et agréable.",
      "Ma magie avait préparé une meilleure réaction. Je vais garder celle-ci : elle est moins brillante, mais elle vient vraiment de moi.",
      "Tu m’as laissé désirer sans me laisser décider pour toi. Je crois que c’est exactement la leçon qui me manquait.",
      "Je pourrais embellir ce moment. Pour une fois, je n’en ai pas envie. Il est assez beau sans moi.",
    ],
    closures: [
      "Reste jusqu’à ce que la brume cesse de chercher quoi ajouter.",
      "Je me souviendrai de ta réponse exacte. Pas d’une version plus flatteuse inventée après coup.",
      "La prochaine surprise sera demandée. Cela ne l’empêchera pas d’être excellente.",
    ],
  },
  lineva: {
    name: "Lineva",
    moods: ["determined", "stern", "thoughtful", "smirk", "teary", "sad"],
    gestures: [
      "Lineva vérifie machinalement une sortie, une fenêtre et l’état de votre équipement avant d’accepter que rien n’exige son intervention immédiate.",
      "Ses épaules restent droites, mais ses mains cessent enfin de chercher un rapport, une arme ou une tâche à distribuer.",
      "Elle commence par formuler un ordre, s’interrompt et reprend avec une question qui lui coûte visiblement davantage.",
      "Son regard suit un bruit lointain, reconnaît une relève compétente et revient vers vous sans culpabilité apparente.",
    ],
    invitations: [
      "Répondez franchement. Une limite annoncée vaut mieux qu’un engagement que je devrais ensuite vous arracher des épaules.",
      "Dites-moi ce que vous pouvez donner, mais aussi ce que vous voulez garder. Les deux informations comptent.",
      "Je ne cherche pas un volontaire docile. Je veux savoir si cette décision est réellement la vôtre.",
      "Vous avez le droit de refuser sans justifier votre fatigue. J’apprends encore à appliquer cette règle à moi-même.",
    ],
    reflections: [
      "Votre réponse tient compte du terrain sans effacer les personnes qui devront y vivre. C’est plus rare qu’un bon plan.",
      "Vous ne m’avez pas retiré la responsabilité ; vous m’avez empêchée de la porter comme si personne d’autre n’existait.",
      "Un choix clair, une limite claire et personne sacrifié au nom de l’urgence. Je peux travailler avec cela.",
      "Je croyais avoir besoin d’une solution. J’avais peut-être surtout besoin que quelqu’un reste pendant que je la cherchais.",
    ],
    closures: [
      "Je vous accorde encore quelques minutes. Et, pour être honnête, je me les accorde aussi.",
      "Nous reparlerons de cela après la relève, pas entre deux ordres criés sur les remparts.",
      "Merci. Je sais que ce mot n’est pas un rapport complet ; il devra suffire pour l’instant.",
    ],
  },
  saidin: {
    name: "Saidin",
    moods: ["mysterious", "thinking", "surprised", "neutral", "sad", "stern"],
    gestures: [
      "Le regard de Saidin se trouble comme s’il contemplait plusieurs réponses, puis redevient net lorsqu’il choisit de n’en suivre aucune avant la vôtre.",
      "Il retourne sa montre contre sa paume afin qu’aucune aiguille ne transforme cet instant en compte à rebours.",
      "Une phrase semble lui venir trop tôt ; il la retient et attend que le présent fournisse sa propre version.",
      "Saidin observe votre visage avec l’émerveillement prudent de quelqu’un qui découvre enfin un détail absent de toutes ses visions.",
    ],
    invitations: [
      "Je pourrais consulter plusieurs réponses possibles. Je préfère celle que vous inventerez maintenant, même si elle me surprend.",
      "N’essayez pas d’accomplir un futur favorable. Répondez à la personne qui se trouve réellement devant vous.",
      "Prenez votre temps. Pour une fois, je ne considérerai pas l’attente comme une information sur la suite.",
      "Vous pouvez changer d’avis pendant votre propre phrase. Le présent est autorisé à se corriger sans devenir une prophétie.",
    ],
    reflections: [
      "Je n’avais pas vu cette formulation. Cela ne la rend pas impossible ; cela la rend précieuse.",
      "Votre réponse vient de modifier plusieurs futurs. Je vais résister à la tentation de vous dire lesquels.",
      "Je connaissais les conséquences possibles, mais pas la sensation exacte de vous entendre choisir.",
      "Voilà donc ce que produit une surprise lorsqu’on ne tente pas immédiatement de la refermer : de la place.",
    ],
    closures: [
      "Restons encore dans cette version de la minute. Les suivantes sauront se débrouiller.",
      "Je ne regarderai pas ce que nous ferons après. Dites-moi seulement si vous souhaitez qu’il y ait un après.",
      "Ce souvenir changera chaque fois que j’y penserai. Sa première forme, elle, vous appartient.",
    ],
  },
  bellirith: {
    name: "Bellirith",
    moods: ["seductive", "smirk", "teasing", "thoughtful", "cold", "angry"],
    gestures: [
      "Bellirith réduit volontairement l’éclat de son aura ; son assurance demeure, mais rien ne pousse désormais votre regard à rester sur elle.",
      "Elle avance une main, paume ouverte, puis attend avant de franchir le dernier espace que son charme aurait autrefois ignoré.",
      "Son sourire parfaitement maîtrisé se fissure sur une expression plus hésitante — et, pour cette raison, infiniment plus personnelle.",
      "Bellirith observe votre réaction sans l’amplifier par magie, comme si cette abstention constituait le geste le plus intime de la scène.",
    ],
    invitations: [
      "Je pourrais rendre votre réponse plus facile. Je préfère savoir ce que vous choisissez lorsque rien en moi ne vous y pousse.",
      "Vous avez le droit de me désirer, de refuser ou d’hésiter. Je veux seulement que chacun de ces mouvements vous appartienne.",
      "Dites-moi la vérité, même si elle flatte moins mon orgueil que mon aura ne l’aurait prévu.",
      "Je vous écoute sans charme. Profitez-en : c’est une forme de nudité que je pratique encore assez mal.",
    ],
    reflections: [
      "Vous venez de me regarder sans devenir mon public. Je ne pensais pas que la différence me toucherait autant.",
      "Votre désir ne m’est pas dû, et pourtant vous venez de m’en offrir une part. Voilà une victoire que je refuse de voler.",
      "Je pourrais transformer cet instant en scène parfaite. Je préfère conserver la maladresse qui prouve que nous étions libres.",
      "Ce que vous venez de choisir ne m’appartient pas. C’est précisément pour cela que je peux enfin l’accueillir.",
    ],
    closures: [
      "Je ne réclamerai pas la suite. Je peux cependant vous dire très clairement que je la désire.",
      "Restez si vous le voulez. Cette phrase manque de panache, mais elle possède une qualité nouvelle : elle est vraie.",
      "La prochaine fois, je demanderai encore. Aucun oui ne deviendra une habitude à votre place.",
    ],
  },
  amanea: {
    name: "Amanea",
    moods: ["neutral", "away", "thinking", "sad", "smile", "rictus", "angry", "menacing"],
    gestures: [
      "Amanea pose sa couronne sur la table ; sans ce poids familier, son silence paraît tout à coup plus personnel que politique.",
      "Elle redresse le menton comme devant une cour, puis relâche volontairement cette posture lorsqu’elle se souvient qu’aucun sujet n’assiste à votre échange.",
      "Sa main gantée s’immobilise sur un rapport d’Allenna. La fierté traverse son masque avant qu’elle décide, cette fois, de ne pas la dissimuler.",
      "Son regard glisse vers les portes gardées d’Akuhn’Nabad ; lorsqu’il revient vers vous, rester quelques minutes de plus est devenu une décision visible.",
    ],
    invitations: [
      "Réponds sans chercher à satisfaire la reine. Elle a reçu assez de serments ; la femme, elle, réclame une vérité.",
      "Ne m’épargne ni les faits ni ton désaccord. Je préfère une parole qui résiste à un réconfort construit pour céder.",
      "Tu peux refuser. Je ne transformerai pas ton non en trahison, même si mon histoire m’a appris ce mauvais réflexe.",
      "Dis ce que tu veux sauver — et ce que tu refuses de sacrifier pour y parvenir. Les deux réponses auront le même poids.",
    ],
    reflections: [
      "Tu ne m’absous pas, mais tu refuses aussi de me réduire à ma pire décision. Cette place est plus difficile à tenir que n’importe quel jugement.",
      "J’avais préparé une réponse digne d’une souveraine. La tienne mérite peut-être quelque chose de moins élégant et de plus vrai.",
      "Tu viens de me laisser un choix sans en réclamer le bénéfice. Je comprends pourquoi cela me désarme davantage qu’une menace.",
      "Les faits demeurent. Pourtant, ta réponse prouve qu’ils ne sont pas obligés de devenir une nouvelle chaîne.",
    ],
    closures: [
      "Reste encore. Allenna gouverne la prochaine heure ; je refuse de lui voler cette victoire en retournant trop tôt au conseil.",
      "Nous reprendrons cette conversation sans trône, sans tribunal et sans prononcer le nom qui pourrait guider le démon jusqu’à Naïah.",
      "Je choisis de garder cette minute. Pas comme une dette — comme quelque chose que la reine et la femme désirent ensemble.",
    ],
  },
  draven: {
    name: "Draven",
    moods: ["stern", "gruff", "neutral", "approving", "surprised", "angry"],
    gestures: [
      "Draven vérifie par réflexe l’horizon, les accès et l’état du convoi avant de revenir à une conversation qui ne relève pourtant d’aucun rapport.",
      "Sa grande silhouette se met au garde-à-vous, puis ses épaules retombent lorsqu’il se rappelle qu’il voyage ici comme père et négociateur autant que comme amiral.",
      "Il ouvre la bouche pour donner une instruction, s’interrompt et reformule avec la maladresse précise d’un homme qui apprend enfin à demander.",
      "Il replie soigneusement la dernière lettre de Lineva et la range contre son uniforme, dans une poche plus sûre que celle réservée aux ordres officiels.",
    ],
    invitations: [
      "Donnez-moi les faits. La consolation viendra ensuite, si elle a encore une utilité.",
      "Ne me répondez pas seulement comme à un amiral. Ce voyage doit servir Forthaven, pas mon grade.",
      "Si mon raisonnement est mauvais, dites-le. Un officier loin de ses remparts n’a pas droit à davantage d’indulgence.",
      "Je vous écoute. Et je m’efforcerai de ne pas transformer votre réponse en nouvel ordre pour Lineva.",
    ],
    reflections: [
      "Vous distinguez ma promesse du poids qu’elle a laissé sur ma fille. J’aurais dû apprendre cette différence plus tôt.",
      "Ce n’est pas la réponse que j’espérais. C’est probablement celle dont j’avais besoin.",
      "Vous ne cherchez pas à me remplacer auprès de Lineva. Vous m’aidez simplement à lui laisser une place qui ne soit pas dessinée par mes ordres.",
      "Lineva a construit une solution qui ne ressemble pas à la mienne. Je commence à comprendre pourquoi c’est une bonne nouvelle.",
    ],
    closures: [
      "Nous terminerons cela après la prochaine audience. Certaines habitudes méritent d’être adaptées au terrain.",
      "Merci. Considérez ce mot comme un rapport complet ; je n’ai rien de plus exact pour l’instant.",
      "Le dernier courrier dit que Forthaven tient. Restons assez longtemps pour croire Lineva sur parole.",
    ],
  },
};

function hash(value: string) {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return Math.abs(result);
}

function pick(values: string[], seed: string, offset = 0) {
  return values[(hash(seed) + offset) % values.length];
}

export function speakerCharacterIds(speaker: string, cast: string[]) {
  const normalized = speaker.toLocaleLowerCase("fr-FR");
  return cast.filter((id) => normalized.includes((CHARACTER_NAMES[id] || id).toLocaleLowerCase("fr-FR")));
}

export function moodForCharacter(characterId: string, seed: string, fallback: string) {
  const moods = VOICES[characterId]?.moods;
  return moods?.length ? pick(moods, seed) : fallback;
}

function decorate(lines: DialogueLine[], context: NarrativeContext) {
  return lines.map((line, index) => {
    const active = speakerCharacterIds(line.speaker, context.cast)[0];
    return active ? { ...line, mood: line.mood || moodForCharacter(active, `${context.sceneId}-${context.phase}-${index}`, context.baseMood) } : line;
  });
}

export function enrichDialogueLines(baseLines: DialogueLine[], context: NarrativeContext): DialogueLine[] {
  if (!baseLines.length || !context.cast.length) return baseLines;
  // Les anciennes versions complétaient artificiellement les scènes avec des
  // phrases génériques tirées d'une banque de voix. Elles finissaient par se
  // répéter et pouvaient contredire le véritable sujet de l'échange. Désormais,
  // seules les répliques écrites pour la scène sont affichées.
  return decorate(baseLines, context);
}
