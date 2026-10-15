/**
 * Vie quotidienne · activités partagées (PROPOSITION_VIE_V1 §5).
 * Courtes, rejouables, jamais intimes. Une activité comptée par personnage et par jour.
 * Gains : +2 affection, +1 confiance, puis humeur ; +1 affection si activité préférée ou propre au personnage ;
 * +1 confiance si le ton choisi correspond à ce que la personne apprécie. Aucun effet sur le Désir.
 */
import { imperialDate } from "./calendar";
import { weatherAt, type WeatherId } from "./weather";
import { MOODS, scaleGain, type MoodId } from "./life-moods";
import type { StatKey } from "./game-data";

export type ActivityId = "cuisiner" | "pecher" | "entrainer" | "lire" | "jeu" | "promenade" | "pari" | "ration" | "douceurs" | "recit" | "escrime" | "enigmes";
export type ToneId = "complice" | "attentif" | "taquin";

export type SharedActivity = {
  id: ActivityId;
  label: string;
  icon: string;
  detail: string;
  /** Sous-lieux où l’activité est possible. `housing` : tout logis acheté. */
  spots: string[];
  housing?: boolean;
  /** Sous-lieux en plein air : l’activité y suit la météo. */
  outdoor?: string[];
  /** Météos qui empêchent l’activité en plein air (ou partout si `everywhere`). */
  blockedBy?: WeatherId[];
  everywhere?: boolean;
  /** Réservée à un personnage (initiative appuyée sur une source, voir LORE_CHECK.md). */
  character?: string;
  intro: [string, string];
  tones: Record<ToneId, string>;
};

const STORMY: WeatherId[] = ["pluie", "orage", "tempete", "neige", "blizzard", "sable", "canicule"];

export const TONES: Record<ToneId, { label: string; stat: StatKey; detail: string }> = {
  complice: { label: "Complicité", stat: "resonance", detail: "Partager le moment sans arrière-pensée." },
  attentif: { label: "Écoute", stat: "lucidite", detail: "Observer, écouter, apprendre de l’autre." },
  taquin: { label: "Taquinerie", stat: "audace", detail: "Relever le défi et provoquer un peu." },
};

export const SHARED_ACTIVITIES: SharedActivity[] = [
  {
    id: "cuisiner", label: "Cuisiner", icon: "♨", detail: "Préparer un repas à deux, avec ce qu’on a sous la main.",
    spots: ["forestier-inn", "miraldas-quarters", "forthaven-quarters", "imperial-road", "river-halt", "obsidian-waystation"], housing: true,
    intro: ["Vous réunissez ce qu’il faut sur une table trop petite : quelques légumes, des herbes, un reste de pain et beaucoup de bonne volonté.", "Une marmite, un couteau, deux paires de mains. Le repas s’organise sans plan, au gré de ce que chacun sait faire."],
    tones: {
      complice: "Vous goûtez chacun dans la cuillère de l’autre, en vous accordant à voix basse sur le sel.",
      attentif: "Vous regardez comment l’autre coupe, assaisonne, attend. Chaque geste en dit plus long qu’une conversation.",
      taquin: "Vous ajoutez une épice de trop, juste pour voir la réaction. Elle ne se fait pas attendre.",
    },
  },
  {
    id: "pecher", label: "Pêcher", icon: "≈", detail: "Une ligne, de l’eau, du temps devant soi.",
    spots: ["forthaven-harbor", "river-halt", "miraldas-lake", "forbidden-ruins"], outdoor: ["forthaven-harbor", "river-halt", "miraldas-lake", "forbidden-ruins"], blockedBy: ["orage", "tempete", "blizzard"],
    intro: ["Vous vous installez au bord de l’eau, deux lignes tendues et un panier vide qui promet beaucoup.", "L’eau clapote contre la pierre. Vous lancez vos lignes et le silence s’installe, pas désagréable du tout."],
    tones: {
      complice: "Vous partagez le même rocher et la même patience. Quand un poisson mord enfin, vous criez victoire ensemble.",
      attentif: "Vous observez la façon dont l’autre lit l’eau, les reflets, les remous. Il y a là un savoir qui ne s’apprend pas dans les livres.",
      taquin: "Vous pariez sur le premier poisson. Vous perdez, ou vous trichez un peu : la différence importe peu.",
    },
  },
  {
    id: "entrainer", label: "S’entraîner", icon: "⚔", detail: "Échauffements, passes d’armes ou exercices de concentration.",
    spots: ["forthaven-training-yard", "forthaven-ramparts", "miraldas-hylee-glade", "miraldas-atelier", "echo-clearing", "imperial-road", "akuhn-war-room", "forbidden-crossroads"],
    outdoor: ["forthaven-training-yard", "forthaven-ramparts", "miraldas-hylee-glade", "echo-clearing", "imperial-road", "forbidden-crossroads"], blockedBy: STORMY,
    intro: ["Vous dégagez un espace, posez ce qui encombre et commencez par quelques mouvements lents pour réveiller le corps.", "L’exercice commence sans cérémonie : un échauffement, un premier enchaînement, puis un autre, plus vite."],
    tones: {
      complice: "Vous vous corrigez mutuellement en riant de vos maladresses. La sueur vient vite, la bonne humeur aussi.",
      attentif: "Vous suivez chaque correction avec sérieux. On vous montre un appui, une respiration, et vous les reprenez jusqu’à les sentir justes.",
      taquin: "Vous lancez un défi : trois touches, le perdant paie le prochain repas. Personne ne veut perdre.",
    },
  },
  {
    id: "lire", label: "Lire ensemble", icon: "▤", detail: "Un livre chacun, ou un seul pour deux. Préférée par mauvais temps.",
    spots: ["miraldas-archives", "akuhn-archives", "tzekarun-archive", "algratal-palace-council", "algratal-palace-quarters", "miraldas-quarters", "forthaven-quarters", "forestier-inn", "miraldas-observatory"], housing: true,
    intro: ["Vous trouvez deux sièges, une lumière correcte et un silence qui accepte les pages qu’on tourne.", "Les livres s’empilent entre vous. Chacun lit le sien, puis vous finissez par vous lire des passages à voix haute."],
    tones: {
      complice: "Vous vous partagez un même livre, épaule contre épaule, et vous attendez l’autre en bas de chaque page.",
      attentif: "Vous demandez ce qui l’a marqué dans un passage. La réponse vous apprend davantage sur la personne que sur le livre.",
      taquin: "Vous lisez un passage pompeux avec une voix encore plus pompeuse. Le fou rire arrive au deuxième paragraphe.",
    },
  },
  {
    id: "jeu", label: "Échecs ou cartes", icon: "♞", detail: "Une partie, ou deux, ou une revanche.",
    spots: ["forestier-inn", "akuhn-music-room", "algratal-music-room", "forthaven-war-room", "forbidden-sanctuary", "forbidden-ruins", "imperial-road", "river-halt", "obsidian-waystation", "akuhn-war-room"], housing: true,
    intro: ["Un plateau, un paquet de cartes un peu corné, et la promesse qu’une seule partie suffira. Personne n’y croit.", "Vous installez les pièces. Le premier coup est lent, prudent ; les suivants le sont beaucoup moins."],
    tones: {
      complice: "Vous commentez vos coups à voix haute, vous vous prévenez des pièges, et la partie devient une conversation.",
      attentif: "Vous étudiez sa manière de jouer : les risques pris, les pièces protégées. Le plateau devient un portrait.",
      taquin: "Vous bluffez avec un aplomb remarquable. Votre adversaire n’y croit pas une seconde, et c’est bien ce qui rend la partie drôle.",
    },
  },
  {
    id: "promenade", label: "Promenade", icon: "❧", detail: "Marcher sans but précis. Par beau temps, avec un charme de plus au printemps.",
    spots: ["algratal-streets", "miraldas-purple-woods", "miraldas-lake", "miraldas-dome", "miraldas-observatory", "forbidden-threshold", "forbidden-crossroads", "forthaven-harbor", "forthaven-ramparts", "akuhn-terrace", "akuhn-gates", "echo-clearing", "river-halt", "imperial-road", "rocky-spires-pass", "tzekarun-gates"],
    everywhere: true, blockedBy: ["pluie", "orage", "tempete", "neige", "blizzard", "sable", "canicule"],
    intro: ["Vous partez sans destination, au rythme de la conversation, en laissant les rues ou les sentiers décider pour vous.", "Le chemin se déroule à votre rythme. Vous vous arrêtez quand quelque chose mérite d’être regardé, et vous repartez quand l’envie vient."],
    tones: {
      complice: "Vous marchez côte à côte, et les silences deviennent aussi agréables que les phrases.",
      attentif: "Vous remarquez ce qui retient son regard, ce que ce regard évite, l’endroit où ses pas ralentissent. Tout cela vous dit quelque chose.",
      taquin: "Vous proposez une course jusqu’au prochain arbre, au prochain mur, au prochain n’importe quoi. Vous arrivez essoufflé·e et ravi·e.",
    },
  },
  {
    id: "pari", label: "Un pari honnête", icon: "◈", detail: "Avec Valurn : une mise modeste, des règles claires, aucun enjeu caché.", character: "valurn",
    spots: ["akuhn-music-room", "algratal-market", "forbidden-crossroads", "algratal-palace-quarters"],
    intro: ["Valurn sort trois pièces et un dé d’os. « Règles simples, mise modeste, et personne ne triche. Enfin, personne d’autre que moi. »", "Valurn pose une pièce entre vous. « Un pari honnête. Je sais, c’est rare. Profitez-en. »"],
    tones: {
      complice: "Vous riez de vos pertes comme de vos gains. Valurn finit par oublier de compter les points.",
      attentif: "Vous observez ses mains plutôt que le dé. Il le remarque, et son sourire devient beaucoup plus intéressé.",
      taquin: "Vous doublez la mise sans prévenir. Valurn vous regarde comme on regarde un adversaire digne de ce nom.",
    },
  },
  {
    id: "ration", label: "Le repas d’Allenna", icon: "◍", detail: "Goûter sa cuisine de campagne : peu engageante, très nourrissante.", character: "allenna",
    spots: ["akuhn-war-room", "akuhn-archives", "forbidden-threshold", "forbidden-crossroads", "forbidden-ruins"],
    intro: ["Allenna vous tend une gamelle dont le contenu a une couleur que vous ne sauriez pas nommer. « Mangez. Vous me remercierez dans trois heures. »", "Allenna remue une préparation épaisse au parfum déconcertant. « Pas joli. Mais ça tient au corps. Asseyez-vous. »"],
    tones: {
      complice: "Vous mangez en face d’elle, sans grimace, et vous finissez la gamelle. Elle vous ressert sans un mot.",
      attentif: "Vous demandez ce qu’il y a dedans. Elle énumère chaque ingrédient et son usage, avec la précision d’une soldate qui sait ce que chaque bouchée doit tenir.",
      taquin: "Vous demandez si c’est un plat ou une épreuve. Allenna répond que c’est les deux, et que vous venez de réussir la première moitié.",
    },
  },
  {
    id: "douceurs", label: "Flâner parmi les douceurs", icon: "◉", detail: "Avec Hylee : parcourir les étals sucrés sans rien se refuser.", character: "hylee",
    spots: ["algratal-market", "forestier-inn"],
    intro: ["Hylee vous tire par la manche vers un étal qui sent le sucre et les épices. « Juste un. Ou deux. On verra. »", "Les vitrines brillent de pâtisseries qui scintillent pour de vrai. Hylee a déjà le nez collé contre la plus proche."],
    tones: {
      complice: "Vous partagez chaque douceur en deux parts égales. Enfin presque égales : Hylee prend toujours la plus petite.",
      attentif: "Vous regardez Hylee choisir avec un sérieux absolu, comme si chaque gâteau était une décision importante. Pour elle, ça l’est.",
      taquin: "Vous lui volez la dernière bouchée. Elle proteste, vous poursuit, et vous finissez par racheter un gâteau entier.",
    },
  },
  {
    id: "recit", label: "Une histoire de marin", icon: "⚓", detail: "Avec Draven : un verre, une histoire, et la vérité un peu arrangée.", character: "draven",
    spots: ["forthaven-harbor", "forthaven-war-room", "forthaven-quarters", "algratal-palace-quarters"],
    intro: ["Draven remplit deux gobelets. « Je vous ai raconté la tempête de l’île aux Mouettes ? Non ? Asseyez-vous, c’est long et c’est presque vrai. »", "Draven s’installe, un gobelet à la main. « Une histoire. Une seule. Ensuite, on retourne aux choses sérieuses. »"],
    tones: {
      complice: "Vous riez aux bons endroits, vous retenez votre souffle aux autres. Draven en rajoute, ravi d’avoir un public.",
      attentif: "Vous relevez les détails qui ne collent pas. Draven s’arrête, puis avoue en riant la part d’invention.",
      taquin: "Vous racontez à votre tour une histoire encore plus improbable. Draven proteste que la sienne était vraie, elle.",
    },
  },
  {
    id: "escrime", label: "Assaut d’escrime", icon: "⚚", detail: "Avec Iriana : quelques passes, de la technique, aucune complaisance.", character: "iriana",
    spots: ["forthaven-ramparts", "akuhn-terrace", "algratal-palace-audience", "algratal-palace-quarters"], outdoor: ["forthaven-ramparts", "akuhn-terrace"], blockedBy: STORMY,
    intro: ["Iriana vous tend une lame d’exercice, garde mouchetée. « Trois touches. Je ne vous ferai pas de cadeau, ce serait vous insulter. »", "Iriana retire ses gants de cour et ajuste sa garde. « Montrez-moi comment vous vous défendez quand personne ne vous regarde. »"],
    tones: {
      complice: "Vous saluez chaque touche avec bonne humeur. Iriana finit par rire après une parade particulièrement maladroite de votre part.",
      attentif: "Vous étudiez sa technique : chaque parade est un calcul. Elle remarque que vous apprenez, et ralentit juste assez pour vous montrer.",
      taquin: "Vous feintez avec insolence. La touche est nette. Iriana hausse un sourcil, puis redouble d’attention.",
    },
  },
  {
    id: "enigmes", label: "Le jeu des énigmes", icon: "?", detail: "Avec Naïah : devinettes, pièges et réponses à double fond.", character: "naiah",
    spots: ["forbidden-threshold", "forbidden-crossroads", "forbidden-sanctuary", "forbidden-ruins"],
    intro: ["Naïah s’assoit en tailleur face à vous. « Je pose une énigme, tu réponds. Si tu te trompes, j’en pose une autre. Si tu as juste, je triche. »", "« Jeu ! » Naïah frappe dans ses mains. « Trois devinettes. La dernière n’a pas de réponse, sauf si tu la trouves. »"],
    tones: {
      complice: "Vous cherchez les réponses ensemble, à voix haute, et Naïah oublie à moitié qu’elle devait gagner.",
      attentif: "Vous repérez le piège dans la deuxième énigme. Naïah vous regarde avec un respect nouveau, et un peu de méfiance.",
      taquin: "Vous lui retournez une énigme de votre invention. Elle met longtemps à trouver, et vous accuse ensuite de tricherie.",
    },
  },
];

export const FAVORITE_ACTIVITY: Record<string, ActivityId> = {
  hylee: "promenade", remerii: "lire", iriana: "lire", tia: "lire", valurn: "jeu", naiah: "jeu",
  lineva: "entrainer", saidin: "promenade", bellirith: "jeu", amanea: "jeu", allenna: "entrainer", draven: "jeu",
};

/** Ton que la personne apprécie, déduit du champ `appreciates` de sa fiche (game-data.ts). */
export const PREFERRED_TONE: Record<string, ToneId> = {
  hylee: "complice", remerii: "taquin", iriana: "attentif", tia: "attentif", valurn: "taquin", naiah: "taquin",
  lineva: "complice", saidin: "attentif", bellirith: "taquin", amanea: "attentif", allenna: "attentif", draven: "complice",
};

/** Réaction unique par personnage et par activité générale (72), plus une par activité propre. */
export const ACTIVITY_REACTIONS: Record<string, Partial<Record<ActivityId, string>>> = {
  hylee: {
    cuisiner: "Hylee coupe les légumes vite et bien, avec des gestes appris trop tôt. Puis elle s’arrête, sourit, et dit : « Ici, personne ne crie. C’est agréable de cuisiner comme ça. »",
    pecher: "Hylee tient sa ligne comme un trésor et sursaute à chaque ride sur l’eau. Quand rien ne mord, elle invente des noms aux poissons qu’elle n’attrape pas.",
    entrainer: "Hylee concentre un filet de givre au bout de ses doigts, le perd, recommence. « Encore une fois. Je sens que ça vient. »",
    lire: "Hylee lit en remuant les lèvres sur les mots difficiles et vous demande le sens de chacun. Vous finissez par lire pour deux.",
    jeu: "Hylee perd sa première partie, gagne la deuxième par accident et réclame la belle avec une détermination redoutable.",
    promenade: "Hylee court voir chaque chose qui brille, chaque fleur inconnue, chaque bruit étrange. Elle revient toujours vers vous pour vous montrer.",
    douceurs: "« Celle-là scintille ! » Hylee la goûte, ferme les yeux, et décrète que c’est le meilleur moment de la semaine.",
  },
  remerii: {
    cuisiner: "Remerii suit la recette avec une précision d’alchimiste et refuse toute improvisation. Le résultat est excellent, ce qui l’agace un peu.",
    pecher: "Remerii observe l’eau avec scepticisme. « Je pourrais geler la surface et les cueillir. » Elle ne le fait pas, par principe, et s’ennuie avec dignité.",
    entrainer: "Remerii corrige votre posture d’un seul mot, puis d’un deuxième, puis renonce aux mots et déplace votre coude elle-même, avec votre accord.",
    lire: "Remerii lit vite, annote dans les marges et vous signale trois erreurs de l’auteur avec une satisfaction non dissimulée.",
    jeu: "Remerii joue aux échecs comme elle enseigne : elle vous laisse une ouverture, puis vous explique pourquoi c’était un piège.",
    promenade: "Remerii marche d’un pas régulier, les mains derrière le dos, et commente l’architecture avec une érudition légèrement condescendante.",
  },
  iriana: {
    cuisiner: "Iriana n’a manifestement jamais tenu un couteau de cuisine. Elle s’y applique avec la rigueur d’une négociation et finit par trouver ça amusant.",
    pecher: "Iriana pêche comme elle mène une enquête : patience, observation, et aucune émotion visible quand le poisson s’échappe.",
    entrainer: "Iriana s’échauffe avec méthode, sans un geste inutile. Elle vous observe davantage qu’elle ne s’entraîne.",
    lire: "Iriana lit en silence, puis vous tend une page en désignant une phrase. « Celle-ci ment. Dites-moi comment je le sais. »",
    jeu: "Iriana gagne aux échecs sans effort apparent. Puis elle vous montre le moment exact où vous auriez pu la battre.",
    promenade: "Iriana marche à votre rythme, pour une fois, et vous parle d’autre chose que de la cour. Ses épaules se relâchent au fil des pas.",
    escrime: "Iriana pare chaque attaque avec une économie de gestes parfaite. « Bien. Vous apprenez. Encore. »",
  },
  tia: {
    cuisiner: "L’Impératrice observe la préparation avec une curiosité grave, puis demande à essayer. Ses gestes sont maladroits, et elle ne s’en excuse pas.",
    pecher: "Tia tient la ligne avec la même immobilité que pendant les audiences. Les poissons, eux, ne semblent pas impressionnés par la couronne.",
    entrainer: "Tia s’entraîne avec une rigueur martiale qui surprend. Chaque mouvement est exact, et vous comprenez qu’elle n’a jamais été une souveraine de salon.",
    lire: "Tia lit des textes sacrés à voix basse. Quand elle s’arrête, c’est pour vous demander ce que vous en pensez, et elle écoute la réponse.",
    jeu: "Tia joue lentement, sans un mot, et ne pardonne aucune erreur. Elle accepte pourtant la revanche avec un léger sourire.",
    promenade: "Tia marche droite, saluée à chaque pas. Puis, dans une allée moins fréquentée, elle ralentit et soupire comme quelqu’un qui pose un fardeau.",
  },
  valurn: {
    cuisiner: "Valurn assaisonne tout avec une générosité inquiétante. « La prudence, en cuisine, c’est pour les gens qui n’ont jamais goûté le feu. »",
    pecher: "Valurn pêche allongé, chapeau sur les yeux. Il prétend dormir et attrape pourtant le plus gros poisson de la journée.",
    entrainer: "Valurn esquive vos attaques avec une nonchalance agaçante, puis vous montre une feinte qui n’a rien de réglementaire.",
    lire: "Valurn lit à voix haute les passages les plus ennuyeux en y mettant le ton d’un récit d’aventure. C’est presque réussi.",
    jeu: "Valurn bat les cartes avec des doigts de prestidigitateur. Il gagne, il perd, et il ne cesse jamais de sourire.",
    promenade: "Valurn connaît chaque raccourci, chaque passage dérobé. Il vous les montre comme un marchand dévoile sa marchandise la plus rare.",
    pari: "Valurn perd la première manche et paie sans discuter. « Un pari honnête se paie honnêtement. C’est la seule règle que je respecte toujours. »",
  },
  naiah: {
    cuisiner: "Naïah goûte tout avant que ce soit prêt et déclare chaque ingrédient délicieux ou empoisonné, au hasard.",
    pecher: "Naïah lance sa ligne dans l’eau sombre des ruines et prétend que quelque chose de très ancien vient de lui faire un clin d’œil.",
    entrainer: "Naïah ne s’entraîne pas : elle joue. Elle disparaît, réapparaît derrière vous, et rit chaque fois que vous sursautez.",
    lire: "Naïah lit à l’envers, tourne les pages trop vite et vous raconte une fin complètement inventée. Elle est souvent plus intéressante que la vraie.",
    jeu: "Naïah triche avec une telle évidence que ça en devient une stratégie. Elle gagne, et vous ne savez toujours pas comment.",
    promenade: "Naïah gambade devant vous dans la brume, s’arrête, revient, repart. Les sentiers semblent bouger pour lui faire plaisir.",
    enigmes: "« Perdu ! » Naïah applaudit. « Mais tu as presque trouvé. Presque, c’est déjà mieux que tout le monde. »",
  },
  lineva: {
    cuisiner: "Lineva cuisine simple et copieux, comme on nourrit une garnison. Elle vous confie l’épluchage et garde le reste pour elle.",
    pecher: "Lineva connaît chaque poisson par son nom de quai. Elle vous montre comment ferrer d’un geste sec, sans cérémonie.",
    entrainer: "Lineva ne retient pas ses coups. « Si je vous ménage, vous n’apprendrez rien. Et je déteste perdre mon temps. »",
    lire: "Lineva lit des rapports, pas des livres. Elle vous en tend un. « Celui-là est mal écrit. Dites-moi ce qu’il cache. »",
    jeu: "Lineva joue aux cartes avec l’humour des quais et une mauvaise foi assumée. Elle gagne souvent et le fait savoir.",
    promenade: "Lineva marche vite, puis ralentit quand elle se rend compte que vous suivez. Elle vous montre des coins que les étrangers ne voient jamais.",
  },
  saidin: {
    cuisiner: "Saidin remue la marmite avec lenteur. « Le goût se décide bien avant qu’on le sente. Comme beaucoup de choses. »",
    pecher: "Saidin regarde l’eau longtemps avant de lancer. Il attrape un seul poisson, le remet à l’eau, et semble content.",
    entrainer: "Saidin vous propose un exercice de concentration plutôt qu’un combat. Respirer, écouter, attendre. C’est plus difficile qu’il n’y paraît.",
    lire: "Saidin lit le même paragraphe trois fois, puis vous demande de le relire à votre tour. Il veut savoir ce que vous y avez vu, pas ce qui y est écrit.",
    jeu: "Saidin joue comme s’il connaissait déjà la fin. Puis il fait un coup inattendu et vous laisse gagner, sans que vous sachiez pourquoi.",
    promenade: "Saidin marche sans hâte et s’arrête parfois devant un détail anodin. « Retenez cet endroit. Vous y repenserez. »",
  },
  bellirith: {
    cuisiner: "Bellirith regarde la marmite avec un dédain amusé, goûte du bout d’un doigt et déclare que vous manquez cruellement d’audace.",
    pecher: "Bellirith s’installe au bord de l’eau avec la grâce d’une reine en exil. Elle ne touche pas à la ligne, mais commente chacun de vos échecs.",
    entrainer: "Bellirith esquive avec une souplesse insolente et transforme chaque passe en spectacle. Elle s’arrête toujours juste avant de vous ridiculiser.",
    lire: "Bellirith choisit le livre le plus scandaleux de la pile et vous le lit en guettant vos réactions. Elle note chaque rougeur avec satisfaction.",
    jeu: "Bellirith relance toujours au lieu de plier. Elle perd parfois, et ses défaites l’amusent visiblement davantage que ses victoires.",
    promenade: "Bellirith marche comme si chaque rue lui appartenait. Les passants s’écartent, et elle vous prend le bras pour profiter du spectacle, si vous le voulez bien.",
  },
  amanea: {
    cuisiner: "Amanea coupe avec une précision tranchante et ne dit presque rien. Le plat est sobre, efficace, et étonnamment bon.",
    pecher: "Amanea pêche en silence, immobile. Les poissons semblent venir à elle par simple respect de l’autorité.",
    entrainer: "Amanea s’entraîne avec une intensité qui ressemble à un exutoire. Quand elle s’arrête enfin, son souffle est plus calme, son regard aussi.",
    lire: "Amanea lit des archives que l’Empire a oubliées. Elle vous en montre une page sans commentaire, et attend votre conclusion.",
    jeu: "Amanea joue aux échecs comme on gouverne : chaque pièce sacrifiée l’est pour une raison. Elle n’explique pas laquelle.",
    promenade: "Amanea marche lentement parmi les siens. On la salue avec respect, parfois avec affection, et elle répond à chacun d’un signe.",
  },
  allenna: {
    cuisiner: "Allenna cuisine pour nourrir, pas pour plaire. Le résultat est d’une couleur douteuse et d’une efficacité remarquable. « Mangez. Faites-moi confiance. »",
    pecher: "Allenna pêche comme elle monte la garde : patiente, attentive, sans un geste de trop. Elle vide le poisson en trois mouvements précis.",
    entrainer: "Allenna corrige votre garde sans ménagement. « Vous laissez une ouverture ici. Un adversaire sérieux ne la raterait pas. Recommencez. »",
    lire: "Allenna lit des manuels de terrain et en récite des passages entiers. Elle vous les explique avec une patience inattendue.",
    jeu: "Allenna joue avec méthode et ne bluffe jamais. Quand vous bluffez, elle le sait, et elle vous le dit d’un regard.",
    promenade: "Allenna marche d’un pas de patrouille, l’œil sur chaque recoin. Peu à peu, elle ralentit, et finit par vous montrer un point de vue qu’elle aime.",
    ration: "Allenna vous regarde finir votre gamelle avec une satisfaction discrète. « Vous tiendrez jusqu’à demain soir. Je vous l’avais dit. »",
  },
  draven: {
    cuisiner: "Draven fait cuire tout ce qu’il trouve dans une seule poêle, avec beaucoup de beurre et aucune hésitation. Le résultat est copieux et franchement bon.",
    pecher: "Draven pêche comme un vieux marin : en racontant des histoires, en jurant contre les poissons et en riant quand il en attrape un.",
    entrainer: "Draven vous enseigne les coups bas que les manuels oublient. « Sur le champ de bataille, personne ne vous demandera si c’était élégant. »",
    lire: "Draven lit à voix haute les rapports militaires en imitant leurs auteurs. C’est cruel, injuste et très drôle.",
    jeu: "Draven joue aux cartes avec un sérieux absolu, puis éclate de rire à chaque défaite. Il accepte toujours un défi idiot.",
    promenade: "Draven vous montre la ville comme un soldat montre son poste : ici on s’est battu, là on a bu, là-bas on a perdu un ami.",
    recit: "Draven termine son histoire sur un rire tonitruant. « Et c’est comme ça que j’ai perdu mon chapeau et gagné un bateau ! Enfin, à peu près. »",
  },
};

export function activityById(id: string) { return SHARED_ACTIVITIES.find((entry) => entry.id === id); }

export type ActivityAvailability = { activity: SharedActivity; available: boolean; reason?: string };

/** Activités possibles avec ce personnage dans ce sous-lieu, ce jour-là. `homeSpot` : sous-lieu du logis possédé. */
export function activitiesAt(characterId: string, spotId: string, locationId: string, day: number, homeSpot?: string): ActivityAvailability[] {
  const sky = weatherAt(day, locationId);
  const season = imperialDate(day).season;
  return SHARED_ACTIVITIES.filter((activity) => !activity.character || activity.character === characterId)
    .filter((activity) => activity.spots.includes(spotId) || (activity.housing && homeSpot === spotId))
    .map((activity) => {
      const exposed = activity.everywhere || activity.outdoor?.includes(spotId);
      const forbiddenMist = locationId === "forbidden" && (sky.id === "brume" || sky.id === "brume-dense");
      if (exposed && activity.blockedBy?.includes(sky.id) && !forbiddenMist) return { activity, available: false, reason: `${sky.icon} ${sky.label} : à remettre à un autre jour` };
      if (activity.id === "pecher" && spotId === "miraldas-lake" && season === "hiver") return { activity, available: false, reason: "Le lac est gelé en hiver" };
      return { activity, available: true };
    });
}

export type ActivityOutcome = { affection: number; trust: number; favorite: boolean; toneMatch: boolean; bonusReason?: string; lines: { speaker: string; text: string }[]; stat: StatKey };

export function activityOutcome(characterId: string, characterName: string, activityId: ActivityId, tone: ToneId, mood: MoodId, day: number, locationId: string): ActivityOutcome {
  const activity = activityById(activityId)!;
  const favorite = FAVORITE_ACTIVITY[characterId] === activityId || activity.character === characterId;
  const toneMatch = PREFERRED_TONE[characterId] === tone;
  const sky = weatherAt(day, locationId);
  const season = imperialDate(day).season;
  let affection = 2 + (favorite ? 1 : 0);
  let bonusReason: string | undefined = favorite ? "Une activité qui lui plaît particulièrement" : undefined;
  if (activityId === "lire" && ["pluie", "orage", "tempete", "neige", "blizzard"].includes(sky.id)) { affection += 1; bonusReason = "Lire à l’abri par mauvais temps"; }
  if (activityId === "promenade" && season === "printemps") { affection += 1; bonusReason = "Une promenade de printemps"; }
  const trust = 1 + (toneMatch ? 1 : 0);
  const reaction = ACTIVITY_REACTIONS[characterId]?.[activityId] || "";
  const lines = [
    { speaker: "Narration", text: activity.intro[day % 2] },
    { speaker: reaction.startsWith("«") ? characterName : "Narration", text: reaction },
    { speaker: "Narration", text: activity.tones[tone] },
  ];
  return { affection: scaleGain(affection, mood), trust: scaleGain(trust, mood), favorite, toneMatch, bonusReason, lines, stat: TONES[tone].stat };
}
export { MOODS };
