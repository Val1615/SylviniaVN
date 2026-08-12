export type StatKey = "audace" | "lucidite" | "sangFroid" | "resonance";
export type PeriodKey = "aube" | "matin" | "apres-midi" | "soirée";

export type DialogueLine = { speaker: string; text: string; mood?: string };
export type Effects = {
  stats?: Partial<Record<StatKey, number>>;
  affection?: number;
  trust?: number;
  desire?: number;
  confluence?: number;
  coins?: number;
  flags?: string[];
  relationshipEffects?: Record<string, Partial<Pick<Effects, "affection" | "trust" | "desire">>>;
};

export type ChoiceData = {
  id: string;
  text: string;
  playerLine?: string;
  stat: StatKey;
  response: DialogueLine[];
  effects: Effects;
  requires?: { stat: StatKey; value: number };
  requiresRelationship?: { character: string; stage?: number; trust?: number; affection?: number }[];
  dateOutcome?: "great" | "good" | "awkward";
};

export type RouteScene = {
  id: string;
  character: string;
  stage: number;
  dayMin: number;
  title: string;
  location: string;
  background: string;
  mood: string;
  intro: DialogueLine[];
  choices: ChoiceData[];
  intimate?: boolean;
};

export type CharacterData = {
  id: string;
  name: string;
  role: string;
  ageNote: string;
  portrait: string;
  color: string;
  unlockDay: number;
  defaultMood: string;
  tagline: string;
  bio: string;
  wound: string;
  appreciates: string;
  giftLikes: string[];
  itinerary: ItineraryStop[];
};

export type ItineraryStop = {
  days: number;
  location?: string;
  travelTo?: string;
  note: string;
};

export type LocationData = {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  background: string;
  unlockDay: number;
  pin: [number, number];
  description: string;
  activities: string[];
  minor?: boolean;
};

export type GiftData = {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
};

const line = (speaker: string, text: string): DialogueLine => ({ speaker, text });
const choice = (
  id: string,
  text: string,
  stat: StatKey,
  response: DialogueLine[],
  effects: Effects,
  requires?: ChoiceData["requires"],
): ChoiceData => ({ id, text, stat, response, effects, requires });
const routeScene = (
  character: string,
  stage: number,
  dayMin: number,
  title: string,
  location: string,
  background: string,
  mood: string,
  intro: DialogueLine[],
  choices: ChoiceData[],
  intimate = false,
): RouteScene => ({ id: `${character}-${stage}`, character, stage, dayMin, title, location, background, mood, intro, choices, intimate });

export const PERIODS: { id: PeriodKey; label: string; time: string; icon: string }[] = [
  { id: "aube", label: "Aube", time: "06:40", icon: "☀" },
  { id: "matin", label: "Matin", time: "10:20", icon: "◒" },
  { id: "apres-midi", label: "Après-midi", time: "15:10", icon: "◐" },
  { id: "soirée", label: "Soirée", time: "20:45", icon: "☾" },
];

export const LOCATIONS: LocationData[] = [
  {
    id: "algratal", name: "Al’Gratal", subtitle: "Cœur impérial", image: "/assets/places/algratal.jpg", background: "algratal", unlockDay: 1, pin: [57, 21],
    description: "Flèches blanches, jardins suspendus et couloirs où chaque sourire possède un prix politique.",
    activities: ["market", "court", "rest"],
  },
  {
    id: "miraldas", name: "Mir’Aldas", subtitle: "Dôme arcanique", image: "/assets/places/miraldas.jpg", background: "miraldas_observatory", unlockDay: 1, pin: [24, 27],
    description: "Une forêt pourpre abritée sous un dôme où les mages apprennent à lire les phrases de l’Arcane.",
    activities: ["archives", "training", "attunement"],
  },
  {
    id: "forbidden", name: "Forêt Interdite", subtitle: "Terres des brumes", image: "/assets/places/foret.jpg", background: "forbidden_forest", unlockDay: 4, pin: [49, 55],
    description: "Les ombres y déplacent les chemins. Entrer sans guide revient à accepter que la forêt vous juge.",
    activities: ["explore", "attunement", "rest"],
  },
  {
    id: "forthaven", name: "Forthaven", subtitle: "Forteresse maritime", image: "/assets/places/forthaven.jpg", background: "forthaven", unlockDay: 5, pin: [25, 76],
    description: "Une cité humaine qui tient par discipline, mémoire et refus obstiné de disparaître.",
    activities: ["training", "harbor", "rest"],
  },
  {
    id: "akuhn", name: "Akuhn’Nabad", subtitle: "Capitale obscurcie", image: "/assets/places/aku.jpg", background: "akuhn", unlockDay: 8, pin: [62, 68],
    description: "La cité bannie mêle pierres noires, magie verte et palais gouverné d’une main ferme par Amanea, loin de l’autorité impériale.",
    activities: ["archives", "court", "attunement"],
  },
  {
    id: "tzekarun", name: "Tzekarun", subtitle: "Cité d’obsidienne", image: "/assets/places/tzekarun.jpg", background: "tzekarun_workshop", unlockDay: 12, pin: [84, 58],
    description: "Sous le désert, laiton et obsidienne donnent aux Tzekarii une puissance que l’Empire comprend mal.",
    activities: ["workshop", "market", "attunement"],
  },
  {
    id: "forestier", name: "Auberge du Forestier", subtitle: "Ancienne route d’Hylee", image: "/assets/backgrounds/forestier_inn.webp", background: "forestier_inn", unlockDay: 1, pin: [43, 39],
    description: "Une auberge rustique où Hylee servait autrefois, où Remerii la rencontra et que Naïah visitait parfois à la nuit tombée.",
    activities: ["market", "rest"], minor: true,
  },
  {
    id: "echo-clearing", name: "Clairière des Échos", subtitle: "Escale Al’Gratal · Mir’Aldas", image: "/assets/backgrounds/camp.webp", background: "camp", unlockDay: 1, pin: [40, 24],
    description: "Une halte discrète où les voyageurs dressent le camp entre la capitale et le Dôme.",
    activities: ["training", "rest", "attunement"], minor: true,
  },
  {
    id: "river-halt", name: "Halte du Fleuve bleu", subtitle: "Route des brumes", image: "/assets/places/foret-algratal.jpg", background: "camp", unlockDay: 4, pin: [53, 44],
    description: "Le dernier lieu de repos avant que la route ne gagne les montagnes puis les brumes de la Forêt Interdite.",
    activities: ["explore", "rest"], minor: true,
  },
  {
    id: "imperial-road", name: "Camp de la route impériale", subtitle: "Escale vers Forthaven", image: "/assets/backgrounds/camp.webp", background: "camp", unlockDay: 5, pin: [38, 63],
    description: "Une escale fortifiée pour les convois, les renforts et les délégations qui descendent vers Forthaven.",
    activities: ["training", "rest"], minor: true,
  },
  {
    id: "obsidian-waystation", name: "Relais des dunes", subtitle: "Seuil de Tzekarun", image: "/assets/places/hildinis.jpg", background: "tzekarun_workshop", unlockDay: 12, pin: [74, 53],
    description: "Un relais discret à l’entrée du désert Hil’dinis, avant les galeries d’obsidienne de Tzekarun.",
    activities: ["rest", "explore"], minor: true,
  },
];

export const CHARACTERS: CharacterData[] = [
  {
    id: "hylee", name: "Hylee", role: "Cryomancienne humaine", ageNote: "22 ans dans cette chronique", portrait: "/assets/portraits/hylee.jpg", color: "#b8efff", unlockDay: 1, defaultMood: "soft",
    tagline: "Elle apprend enfin à choisir ce qu’elle désire, pas seulement ce à quoi elle survit.",
    bio: "Hylee travaillait encore à l’Auberge du Forestier lorsque Remerii a reconnu sa cryomancie. Elle a choisi de la suivre sur les routes. Leur voyage reste discret : l’Empire ne doit pas identifier trop vite la puissance qu’elles transportent.",
    wound: "La peur de n’être aimée que pour son potentiel, et de redevenir prisonnière dès qu’elle baisse sa garde.",
    appreciates: "La patience sincère, l’humour tendre, les gestes qui n’exigent rien en retour.",
    giftLikes: ["tartelette", "cristal", "plume"],
    itinerary: [
      { days: 2, location: "forestier", note: "Derniers préparatifs à l’auberge où Remerii l’a rencontrée" },
      { days: 3, travelTo: "miraldas", note: "Première route discrète avec Remerii" },
      { days: 6, location: "miraldas", note: "Études cryomantiques à l’abri du Dôme" },
      { days: 3, travelTo: "forbidden", note: "Chemin protégé vers les brumes" },
      { days: 2, location: "forbidden", note: "Rare visite personnelle à Naïah" },
      { days: 3, travelTo: "miraldas", note: "Retour prudent hors de la forêt" },
      { days: 6, location: "miraldas", note: "Atelier commun avec Remerii" },
      { days: 3, travelTo: "forestier", note: "Retour vers l’Auberge du Forestier" },
      { days: 4, location: "forestier", note: "Halte familière et ravitaillement" },
      { days: 3, travelTo: "miraldas", note: "Nouveau départ loin des routes impériales" },
      { days: 3, location: "miraldas", note: "Repos sous la protection du Dôme" },
    ],
  },
  {
    id: "remerii", name: "Remerii", role: "Mage de Mir’Aldas", ageNote: "Adulte", portrait: "/assets/portraits/remerii.jpg", color: "#79a9ff", unlockDay: 1, defaultMood: "calm",
    tagline: "Son exigence est une protection ; son ironie, une porte entrouverte.",
    bio: "Mage humaine raffinée, puissante et surveillée, Remerii a rencontré Hylee à l’Auberge du Forestier puis l’a entraînée sur les routes. Elle enseigne sans posséder et masque leur magie pour éviter que l’Empire ne s’intéresse trop tôt à sa protégée.",
    wound: "Avoir appris trop tôt que la puissance attire autant la convoitise que le rejet.",
    appreciates: "La maîtrise, l’intelligence émotionnelle et l’audace qui sait où s’arrêter.",
    giftLikes: ["the", "cristal", "partition"],
    itinerary: [
      { days: 2, location: "forestier", note: "Organise le départ de Hylee sans attirer l’attention" },
      { days: 3, travelTo: "miraldas", note: "Première route discrète avec Hylee" },
      { days: 6, location: "miraldas", note: "Enseignement et recherches sous le Dôme" },
      { days: 3, travelTo: "forbidden", note: "Accompagne Hylee jusqu’aux brumes" },
      { days: 2, location: "forbidden", note: "Reste en retrait pendant la visite à Naïah" },
      { days: 3, travelTo: "miraldas", note: "Retour prudent hors de la forêt" },
      { days: 6, location: "miraldas", note: "Direction de l’atelier et présence auprès d’Hylee" },
      { days: 3, travelTo: "forestier", note: "Retour vers l’auberge par des chemins secondaires" },
      { days: 4, location: "forestier", note: "Ravitaillement et étude des prochaines routes" },
      { days: 3, travelTo: "miraldas", note: "Nouveau départ loin des contrôles impériaux" },
      { days: 3, location: "miraldas", note: "Classe ses relevés de voyage" },
    ],
  },
  {
    id: "iriana", name: "Iriana", role: "Princesse impériale", ageNote: "Adulte", portrait: "/assets/portraits/iriana.jpg", color: "#dbc875", unlockDay: 2, defaultMood: "calm",
    tagline: "Elle transforme chaque conversation en échiquier pour ne plus jamais être le pion.",
    bio: "Brillante, calculatrice et glaciale en apparence, Iriana poursuit seule une quête dangereuse : révoquer le pacte conclu par son père avec un démon. Elle se rapproche de Valurn pour ses connaissances, puis pour des raisons que leurs arrangements libres rendent difficiles à nommer.",
    wound: "Être traitée comme une ressource dynastique, utile seulement tant qu’elle sert le calcul d’un autre.",
    appreciates: "La franchise sans insolence, la compétence, et ceux qui lui laissent réellement le choix.",
    giftLikes: ["partition", "encrier", "rose"],
    itinerary: [
      { days: 12, location: "algratal", note: "Audiences impériales et recherches secrètes sur le pacte" },
      { days: 3, travelTo: "akuhn", note: "Voyage clandestin organisé avec Valurn" },
      { days: 3, location: "akuhn", note: "Consultation discrète des archives d’Amanea" },
      { days: 3, travelTo: "algratal", note: "Retour secret vers la capitale" },
      { days: 17, location: "algratal", note: "Cour, enquête et entretiens privés avec Valurn" },
    ],
  },
  {
    id: "valurn", name: "Valurn", role: "Demi-démon et démonologue", ageNote: "Adulte", portrait: "/assets/portraits/valurn.jpg", color: "#ff725d", unlockDay: 3, defaultMood: "charming",
    tagline: "Il parie sur tout, surtout lorsqu’avouer qu’il tient à quelqu’un serait plus dangereux.",
    bio: "Séduisant, sarcastique et dangereux, Valurn connaît les pactes mieux que quiconque. Il aide Iriana à chercher une faille dans le contrat d’Alamma ; leur union reste libre, mais la liberté ne les protège ni de l’attachement ni des interventions de Bellirith.",
    wound: "La certitude que tout lien finira tôt ou tard par se transformer en chaîne.",
    appreciates: "Les esprits vifs, les paris honnêtes et les personnes capables de voir sa peur sans l’utiliser.",
    giftLikes: ["vin", "jeton", "grimoire"],
    itinerary: [
      { days: 4, location: "algratal", note: "Renseignements de cour et paris avec Iriana" },
      { days: 2, travelTo: "forbidden", note: "Passage vers la Forêt Interdite" },
      { days: 3, location: "forbidden", note: "Négociation risquée avec Naïah" },
      { days: 2, travelTo: "akuhn", note: "Traversée des brumes vers Akuhn’Nabad" },
      { days: 4, location: "akuhn", note: "Enquête démonologique et visite à Bellirith" },
      { days: 3, travelTo: "algratal", note: "Retour par les routes impériales" },
      { days: 4, location: "algratal", note: "Renseignements partagés avec Iriana" },
      { days: 3, travelTo: "akuhn", note: "Nouvelle mission obscurcie" },
      { days: 4, location: "akuhn", note: "Pactes, archives et retrouvailles familiales" },
      { days: 3, travelTo: "algratal", note: "Retour vers la cour" },
      { days: 6, location: "algratal", note: "Jeux politiques et temps libre avec Iriana" },
    ],
  },
  {
    id: "naiah", name: "Naïah", role: "Héritière des brumes", ageNote: "Adulte", portrait: "/assets/portraits/naiah.jpg", color: "#b477ff", unlockDay: 4, defaultMood: "smirk",
    tagline: "Elle sourit comme une amie et règne comme une menace que la forêt connaît déjà.",
    bio: "Joueuse, théâtrale et blessée, Naïah règne sur les chemins mouvants de la Forêt Interdite. Amie proche de Hylee, elle déteste Amanea avec une intensité qui trahit encore le lien maternel. Sa mère l’a fait chasser sans jamais lui en donner la véritable raison.",
    wound: "Avoir été créée puis bannie par une mère qui affirme encore l’aimer, sans lui expliquer pourquoi elle n’avait prétendument pas le choix.",
    appreciates: "Les personnes qui restent sans se soumettre, et celles qui distinguent son jeu de sa vérité.",
    giftLikes: ["boite", "rose", "plume"],
    itinerary: [
      { days: 9, location: "forbidden", note: "Veille sur ses brumes et son territoire" },
      { days: 2, travelTo: "akuhn", note: "Route secrète vers Akuhn’Nabad" },
      { days: 5, location: "akuhn", note: "Affaires obscurcies et blessures familiales" },
      { days: 2, travelTo: "forbidden", note: "Retour dans les brumes" },
      { days: 20, location: "forbidden", note: "Garde de la forêt ; Hylee peut lui rendre visite" },
    ],
  },
  {
    id: "lineva", name: "Lineva", role: "Commandante de Forthaven", ageNote: "Adulte", portrait: "/assets/portraits/lineva.jpg", color: "#6db6dc", unlockDay: 5, defaultMood: "determined",
    tagline: "Elle tient parce que quelqu’un doit rester debout — même lorsque personne ne la relève.",
    bio: "Lineva tient Forthaven contre les morts-vivants pendant que Draven cherche de l’aide sur le continent. Elle refuse presque toujours de quitter son poste ; une confiance suffisamment forte peut toutefois la convaincre qu’un voyage bref n’est pas un abandon.",
    wound: "Porter une ville entière tout en craignant que le départ de son père devienne un jour une absence définitive.",
    appreciates: "La fiabilité, les gestes concrets et ceux qui savent offrir de l’aide sans lui retirer le commandement.",
    giftLikes: ["boussole", "carte", "vin"],
    itinerary: [
      { days: 38, location: "forthaven", note: "Commandement du front contre les morts-vivants" },
    ],
  },
  {
    id: "saidin", name: "Saidin", role: "Archimage de Mir’Aldas", ageNote: "Adulte d’âge ancien", portrait: "/assets/portraits/saidin.jpg", color: "#a7acff", unlockDay: 6, defaultMood: "mysterious",
    tagline: "Il lit les cicatrices du temps mais peine parfois à habiter une minute ordinaire.",
    bio: "Archimage énigmatique, Saidin apparaît à Al’Gratal, Mir’Aldas ou au détour d’une route avec une réponse qu’il transforme aussitôt en nouvelle question. Il comprend la fracture temporelle mieux qu’il ne l’admet et voyage trop librement pour appartenir à une seule cour.",
    wound: "Voir trop de futurs possibles et perdre l’habitude de vivre celui qui se trouve devant lui.",
    appreciates: "Les questions honnêtes, les paradoxes fertiles et les personnes qui refusent d’être réduites à une prophétie.",
    giftLikes: ["sablier", "grimoire", "the"],
    itinerary: [
      { days: 12, location: "miraldas", note: "Direction de Mir’Aldas et recherches temporelles" },
      { days: 3, travelTo: "algratal", note: "Déplacement officiel vers la capitale" },
      { days: 4, location: "algratal", note: "Conseil du Conclave avec Remerii" },
      { days: 3, travelTo: "miraldas", note: "Retour au dôme" },
      { days: 6, location: "miraldas", note: "Archives profondes et enseignement" },
      { days: 3, travelTo: "tzekarun", note: "Expédition savante vers Tzekarun" },
      { days: 2, location: "tzekarun", note: "Consultation des mécanismes d’obsidienne" },
      { days: 3, travelTo: "miraldas", note: "Retour hors du désert" },
      { days: 2, location: "miraldas", note: "Retour aux affaires ordinaires du Dôme" },
    ],
  },
  {
    id: "bellirith", name: "Bellirith", role: "Démone du désir", ageNote: "Adulte", portrait: "/assets/portraits/bellirith.jpg", color: "#ed567f", unlockDay: 7, defaultMood: "seductive",
    tagline: "Elle sait provoquer le désir ; elle doit apprendre ce que signifie être choisie sans emprise.",
    bio: "Bellirith attire, manipule et transforme chaque échange en prise de pouvoir. Elle met volontiers des obstacles entre Valurn et Iriana, puis vient séduire, pervertir ou renseigner le protagoniste selon ce qui promet le plus de désordre. Sa route exige de distinguer l’aide de la manipulation.",
    wound: "N’avoir jamais appris à distinguer être désirée, être crainte et être réellement connue.",
    appreciates: "Les limites nettes, la confiance lucide et ceux qui osent lui demander d’abandonner ses armes.",
    giftLikes: ["rose", "parfum", "miroir"],
    itinerary: [
      { days: 3, location: "akuhn", note: "Cour obscurcie et rivalités avec Valurn" },
      { days: 2, travelTo: "forbidden", note: "Route vers les brumes" },
      { days: 4, location: "forbidden", note: "Accords secrets avec Naïah et Valurn" },
      { days: 2, travelTo: "akuhn", note: "Retour à la capitale obscurcie" },
      { days: 5, location: "akuhn", note: "Intrigues de cour et affaires démoniaques" },
      { days: 3, travelTo: "algratal", note: "Invitation politique vers Al’Gratal" },
      { days: 3, location: "algratal", note: "Jeux de cour sans enchantement" },
      { days: 3, travelTo: "akuhn", note: "Retour auprès des siens" },
      { days: 13, location: "akuhn", note: "Cour obscurcie et visites à Valurn" },
    ],
  },
  {
    id: "amanea", name: "Amanea", role: "Reine Noire d’Akuhn’Nabad", ageNote: "Adulte", portrait: "/assets/portraits/amanea.jpg", color: "#70e49b", unlockDay: 8, defaultMood: "neutral",
    tagline: "Elle protège les siens avec une férocité qui rend parfois impossible de distinguer l’amour de la sentence.",
    bio: "Amanea est vivante et règne toujours sur Akuhn’Nabad. Ennemie déclarée de l’Empire, elle limite ses déplacements et agit par réseaux discrets. Elle aime Naïah malgré l’ordre de la chasser, sans révéler ce qui l’y a contrainte, et voit en Allenna sa fille autant que l’héritière dont elle est profondément fière.",
    wound: "Avoir appris à protéger par le secret, l’autorité et la violence, jusqu’à rendre ses décisions les plus maternelles presque indiscernables d’un abandon.",
    appreciates: "La franchise qui résiste à son autorité, le respect des faits et les personnes qui n’effacent ni ses crimes ni son humanité.",
    giftLikes: ["partition", "rose", "encrier"],
    itinerary: [
      { days: 14, location: "akuhn", note: "Gouverne la Cité Noire et prépare Allenna à lui succéder" },
      { days: 3, travelTo: "forbidden", note: "Emprunte une route secrète vers la frontière des brumes" },
      { days: 2, location: "forbidden", note: "Rare visite à Naïah, loin des regards de l’Empire" },
      { days: 3, travelTo: "akuhn", note: "Retour discret vers Akuhn’Nabad" },
      { days: 16, location: "akuhn", note: "Reprend la cour, les archives et l’instruction d’Allenna" },
    ],
  },
  {
    id: "draven", name: "Draven", role: "Amiral Régent de Forthaven", ageNote: "Adulte", portrait: "/assets/portraits/draven.jpg", color: "#c8a26b", unlockDay: 5, defaultMood: "stern",
    tagline: "Il demande de l’aide à un Empire qu’il ne croit pas généreux, parce que Forthaven ne peut pas survivre grâce à sa seule fierté.",
    bio: "Draven est vivant. Il voyage entre Forthaven et le continent pour obtenir des soldats, des vivres et une reconnaissance impériale. Austère et pragmatique, il prend régulièrement des nouvelles de Lineva et lutte contre le réflexe de commander sa vie depuis chaque lettre.",
    wound: "Quitter sa fille au milieu d’une guerre pour chercher l’aide dont elle a besoin, avec la peur que chaque départ soit celui dont il ne reviendra pas.",
    appreciates: "Les actes concrets, les réponses directes et les personnes qui aident Lineva sans prétendre remplacer son père.",
    giftLikes: ["boussole", "carte", "vin"],
    itinerary: [
      { days: 5, location: "forthaven", note: "Prépare sa mission et reçoit les rapports de Lineva" },
      { days: 4, travelTo: "algratal", note: "Remonte la route impériale avec une petite délégation" },
      { days: 8, location: "algratal", note: "Négocie l’aide impériale sans abandonner les intérêts de Forthaven" },
      { days: 4, travelTo: "forthaven", note: "Reprend la longue route vers Forthaven" },
      { days: 17, location: "forthaven", note: "Inspecte la ville avec Lineva et prépare la mission suivante" },
    ],
  },
];

export const GIFTS: GiftData[] = [
  { id: "tartelette", name: "Tartelette aux baies lunaires", description: "Un petit luxe sucré d’Al’Gratal.", price: 8, icon: "◉" },
  { id: "the", name: "Thé des clairières", description: "Floral, frais et légèrement sucré.", price: 10, icon: "♨" },
  { id: "cristal", name: "Cristal de givre accordé", description: "Il réagit aux émotions magiques.", price: 14, icon: "◇" },
  { id: "partition", name: "Partition ancienne", description: "Une valse sans nom, copiée à la main.", price: 16, icon: "♫" },
  { id: "rose", name: "Rose noire préservée", description: "Ses pétales ne fanent jamais tout à fait.", price: 13, icon: "✿" },
  { id: "vin", name: "Vin épicé de Forthaven", description: "Chaleureux, franc, sans prétention.", price: 12, icon: "♜" },
  { id: "boussole", name: "Boussole navale", description: "Son aiguille trouve les ports, pas les certitudes.", price: 15, icon: "⌖" },
  { id: "grimoire", name: "Grimoire des plans lointains", description: "Annotations rares sur les Calciterres et l’Arcane.", price: 18, icon: "▤" },
  { id: "sablier", name: "Sablier d’obsidienne", description: "Le sable remonte une fois à minuit.", price: 17, icon: "⌛" },
  { id: "parfum", name: "Parfum de cendre et de velours", description: "Une senteur sombre, élégante et persistante.", price: 15, icon: "❧" },
  { id: "plume", name: "Plume de chouette blanche", description: "Trouvée, jamais arrachée.", price: 9, icon: "⌁" },
  { id: "boite", name: "Boîte à musique violette", description: "Elle joue une mélodie presque joyeuse.", price: 18, icon: "♬" },
  { id: "carte", name: "Carte marine annotée", description: "Les courants dangereux y sont écrits en rouge.", price: 11, icon: "≋" },
  { id: "encrier", name: "Encrier impérial", description: "Un objet de cour sobre, précis, durable.", price: 12, icon: "✒" },
  { id: "jeton", name: "Jeton des grandes maisons", description: "Idéal pour un pari dont personne ne connaît l’enjeu.", price: 10, icon: "◈" },
  { id: "miroir", name: "Miroir de poche sans enchantement", description: "Justement remarquable par son honnêteté.", price: 14, icon: "◐" },
];

export const ROUTE_SCENES: RouteScene[] = [
  // HYLEE
  routeScene("hylee", 0, 1, "Le dernier service", "forestier", "forestier_inn", "surprised", [
    line("Narration", "À l’Auberge du Forestier, Hylee pose une dernière chope sur le comptoir avant son départ avec Remerii. Du givre gagne le bois dès qu’un voyageur en uniforme impérial franchit la porte."),
    line("Hylee", "Je maîtrise. Enfin… normalement. Vous pouvez me dire s’il regarde encore par ici sans avoir l’air de surveiller quelqu’un ?"),
    line("Narration", "Remerii termine les préparatifs à l’étage. Hylee, elle, oscille entre la peur d’être repérée et l’impatience de choisir enfin la route."),
  ], [
    choice("h0-a", "« Si c’est ta façon de dire bonjour, elle est plutôt mémorable. »", "audace", [line("Hylee", "Un rire lui échappe malgré elle. D’accord… bonjour. Et désolée pour vos chaussures."), line("Narration", "La peur quitte un instant ses épaules.")], { stats: { audace: 1 }, affection: 5, trust: 2, desire: 1, confluence: 2 }),
    choice("h0-l", "Observer les reflets avant de répondre : le givre s’est arrêté autour d’elle.", "lucidite", [line("{player}", "La magie ne cherchait pas à fuir. Elle te protégeait de la foule."), line("Hylee", "Vous… avez réellement regardé. La plupart se contentent d’avoir peur.")], { stats: { lucidite: 1 }, affection: 2, trust: 6, confluence: 2 }),
    choice("h0-r", "Poser la paume près du givre et étouffer sa signature sans l’effacer.", "resonance", [line("Hylee", "Vous la sentez aussi ? Pas le froid. Ce qu’il y a juste dessous."), line("Narration", "La glace reste présente mais cesse d’appeler les mages à des kilomètres. Pour la première fois, Hylee vous sourit sans réserve.")], { stats: { resonance: 1 }, affection: 4, trust: 4, confluence: 3 }, { stat: "resonance", value: 5 }),
  ]),
  routeScene("hylee", 1, 4, "Un bâton, deux mains", "miraldas", "atelier", "determined", [
    line("Narration", "Dans l’atelier de Mir’Aldas, le bâton d’Hylee vibre jusqu’à faire tinter tous les cristaux suspendus."),
    line("Hylee", "Je pourrais le forcer. Remerii dirait que c’est une idée catastrophique… ce qui signifie souvent qu’elle fonctionnerait une fois."),
    line("Hylee", "Vous restez ? J’ai moins peur de me ridiculiser quand quelqu’un se ridiculise avec moi."),
  ], [
    choice("h1-s", "Stabiliser sa respiration plutôt que sa magie.", "sangFroid", [line("{player}", "Quatre souffles. Le sort peut attendre."), line("Hylee", "Vous parlez comme elle… mais sans me donner envie de vous jeter un cristal."), line("Narration", "Elle cale son rythme sur le vôtre. Le bâton s’apaise.")], { stats: { sangFroid: 1 }, trust: 6, affection: 3, confluence: 3 }),
    choice("h1-a", "« On le force ensemble. Comme ça, le désastre sera équitablement partagé. »", "audace", [line("Hylee", "Voilà une philosophie magique absolument irresponsable."), line("Narration", "Son sourire ravi dit exactement le contraire. Vos deux mains se referment sur le bois noir.")], { stats: { audace: 1 }, affection: 6, desire: 2, trust: 2, confluence: 3 }),
    choice("h1-r", "Laisser le bâton répondre avant de décider du geste.", "resonance", [line("Narration", "La vibration devient une pulsation lente. Hylee ferme les yeux, vos doigts toujours proches des siens."), line("Hylee", "Il ne demandait pas de puissance. Il demandait… qu’on l’écoute.")], { stats: { resonance: 1 }, trust: 5, affection: 4, confluence: 5 }, { stat: "resonance", value: 6 }),
  ]),
  routeScene("hylee", 2, 8, "La cicatrice sous la neige", "miraldas", "camp", "sad", [
    line("Narration", "La nuit tombe sur la clairière. Hylee garde sa cape serrée autour d’elle malgré la douceur de l’air."),
    line("Hylee", "Quand quelqu’un lève la main trop vite, je sais que ce n’est pas mon père. Mon corps, lui, ne le sait pas toujours."),
    line("Hylee", "Je ne veux pas que vous me regardiez comme quelque chose de cassé."),
  ], [
    choice("h2-l", "« Je vois ce que tu protèges, pas seulement ce qui t’a blessée. »", "lucidite", [line("Narration", "Elle vous étudie longuement, puis desserre enfin sa cape."), line("Hylee", "Alors restez. Sans question, juste… restez un peu.")], { stats: { lucidite: 1 }, trust: 8, affection: 5, confluence: 3 }),
    choice("h2-s", "Garder les mains bien visibles et lui laisser choisir la distance.", "sangFroid", [line("Narration", "Hylee fait elle-même le dernier pas et appuie son épaule contre la vôtre."), line("Hylee", "Merci de ne pas décider à ma place de ce qui devrait me rassurer.")], { stats: { sangFroid: 1 }, trust: 9, affection: 4, desire: 1, confluence: 3 }),
    choice("h2-a", "« Cassée ? Non. Terriblement impressionnante et un peu têtue ? Oui. »", "audace", [line("Hylee", "Un peu ?"), line("Narration", "Son rire tremble au début, puis devient réel. Elle essuie une larme sans détourner le regard.")], { stats: { audace: 1 }, trust: 5, affection: 7, desire: 2, confluence: 3 }),
  ]),
  routeScene("hylee", 3, 13, "La danse du campement", "echo-clearing", "camp", "teasing", [
    line("Narration", "À la Clairière des Échos, une caravane a sorti un violon et quelques lanternes. Hylee vous trouve avant que vous puissiez utiliser la surveillance de la route comme excuse."),
    line("Hylee", "J’ai beaucoup réfléchi. C’est généralement à cet instant que je fais quelque chose d’irraisonnable."),
    line("Hylee", "Dansez avec moi. Et ne dites pas que vous ne savez pas : moi non plus."),
  ], [
    choice("h3-a", "L’entraîner au centre de la piste avant que son courage ne retombe.", "audace", [line("Hylee", "Oh. Vous êtes vraiment pire que moi."), line("Narration", "Elle rate le premier pas, vous le fait rater à votre tour, puis rit assez fort pour que le protocole cesse d’exister.")], { stats: { audace: 1 }, affection: 8, desire: 5, trust: 3, confluence: 4 }),
    choice("h3-s", "Lui offrir votre main, immobile, et attendre qu’elle la prenne.", "sangFroid", [line("Narration", "Ses doigts se posent dans les vôtres avec un soin presque solennel."), line("Hylee", "C’est fou comme attendre peut parfois être plus courageux que foncer.")], { stats: { sangFroid: 1 }, affection: 6, desire: 3, trust: 7, confluence: 4 }),
    choice("h3-r", "« Suivons la musique comme on suivrait un courant magique. »", "resonance", [line("Narration", "Vous cessez de compter. La danse devient une vibration partagée, fragile et intuitive."), line("Hylee", "Avec vous, j’ai l’impression que mon corps sait avant moi où il veut aller.")], { stats: { resonance: 1 }, affection: 7, desire: 5, trust: 5, confluence: 5 }, { stat: "resonance", value: 8 }),
  ]),
  routeScene("hylee", 4, 19, "Choisir sans fuir", "miraldas", "bedroom", "soft", [
    line("Narration", "Hylee referme la porte de la chambre sans la verrouiller. Ce détail semble important pour elle."),
    line("Hylee", "Je ne veux pas d’une autre personne qui décide de ma vie. Je veux quelqu’un à qui je peux dire oui… parce que je sais que mon non aurait la même valeur."),
    line("Hylee", "Alors je vais être très claire : j’ai envie que vous restiez. Et vous ?"),
  ], [
    choice("h4-l", "Nommer clairement votre désir et vos limites, puis lui demander les siennes.", "lucidite", [line("Narration", "Vous prenez le temps de tout dire. Hylee répond sans détour, rougissante mais sûre d’elle."), line("Hylee", "Oui. Comme ça. Pas une devinette, pas une épreuve. Nous deux, parce que nous le choisissons.")], { stats: { lucidite: 1 }, affection: 10, trust: 10, desire: 7, confluence: 6 }, { stat: "lucidite", value: 8 }),
    choice("h4-s", "« Je reste. Et tu peux changer d’avis à chaque instant. »", "sangFroid", [line("Hylee", "Vous aussi."), line("Narration", "Elle vous rejoint avec une lenteur assumée, son sourire intimidé devenu lumineux.")], { stats: { sangFroid: 1 }, affection: 9, trust: 11, desire: 6, confluence: 6 }),
    choice("h4-a", "« J’espérais que tu le demanderais depuis cette catastrophe avec le bâton. »", "audace", [line("Hylee", "J’aurais dû vous assommer avec. Cela nous aurait fait gagner du temps."), line("Narration", "Elle rit contre vous avant de vous embrasser, franche et tremblante à la fois.")], { stats: { audace: 1 }, affection: 11, trust: 7, desire: 9, confluence: 6 }),
  ], true),

  // REMERII
  routeScene("remerii", 0, 1, "Le thé avant la route", "forestier", "forestier_inn", "smirk", [
    line("Narration", "Remerii occupe la table la plus éloignée de la porte de l’Auberge du Forestier. Un livre masque la carte de leur trajet ; son thé refroidit pendant qu’elle surveille discrètement Hylee et les voyageurs impériaux."),
    line("Remerii", "Vous observez beaucoup pour quelqu’un qui prétend seulement chercher une place assise."),
    line("Remerii", "Asseyez-vous donc. Voyons si votre conversation est moins indiscrète que votre regard."),
  ], [
    choice("r0-a", "« J’allais justement vous reprocher de monopoliser la meilleure table. »", "audace", [line("Remerii", "Bien. Au moins, vous ne gaspillez pas votre insolence en excuses."), line("Narration", "Elle pousse la seconde chaise du bout du pied.")], { stats: { audace: 1 }, affection: 5, desire: 2, trust: 2, confluence: 2 }),
    choice("r0-l", "« Vous attendiez quelqu’un. Mais pas la personne qui vient de passer la porte. »", "lucidite", [line("Remerii", "Précis, et suffisamment délicat pour ne pas demander qui."), line("Narration", "Son expression se fait réellement attentive.")], { stats: { lucidite: 1 }, trust: 6, affection: 2, confluence: 2 }),
    choice("r0-s", "Vous asseoir sans toucher au livre ni au thé.", "sangFroid", [line("Remerii", "Vous savez occuper un silence sans l’envahir. C’est plus rare que la magie humaine."), line("{player}", "Je peux aussi parler, si l’expérience l’exige."), line("Remerii", "N’abusons pas de nos pouvoirs.")], { stats: { sangFroid: 1 }, trust: 5, affection: 4, confluence: 2 }),
  ]),
  routeScene("remerii", 1, 5, "Leçon de maîtrise", "miraldas", "atelier", "strict", [
    line("Narration", "Une sphère arcanique tourne entre les mains de Remerii, parfaite au point d’en devenir intimidante."),
    line("Remerii", "La puissance est une faim. Si vous ne la tenez pas en laisse, elle finira par vous promener."),
    line("Remerii", "À vous. Et épargnez-moi l’héroïsme improvisé."),
  ], [
    choice("r1-s", "Construire lentement, puis dissiper le sort avant qu’il ne vous échappe.", "sangFroid", [line("Remerii", "Vous auriez pu pousser davantage."), line("{player}", "Mais je n’en avais pas besoin."), line("Remerii", "Exactement.")], { stats: { sangFroid: 1 }, trust: 7, affection: 3, confluence: 4 }),
    choice("r1-r", "Écouter le point de rupture au lieu de le calculer.", "resonance", [line("Narration", "Votre sort vacille, puis trouve un équilibre organique. Remerii s’approche, fascinée malgré elle."), line("Remerii", "Ce n’est pas orthodoxe. Recommencez.")], { stats: { resonance: 1 }, trust: 5, affection: 5, desire: 2, confluence: 5 }, { stat: "resonance", value: 6 }),
    choice("r1-a", "« Vous dites cela à toutes les personnes que vous invitez à jouer avec des sphères instables ? »", "audace", [line("Remerii", "Seulement à celles dont j’aimerais éviter de ramasser les morceaux."), line("Narration", "Le ton est sec. Le regard, beaucoup moins.")], { stats: { audace: 1 }, affection: 6, trust: 3, desire: 3, confluence: 3 }),
  ]),
  routeScene("remerii", 2, 9, "Ce que l’exigence protège", "miraldas", "deep_archives", "sad", [
    line("Narration", "Dans les archives, Remerii fixe une ancienne liste d’élèves humains. Presque tous les noms sont rayés."),
    line("Remerii", "On me reproche d’être dure. Ceux qui le font n’ont jamais eu à préparer quelqu’un à survivre dans un monde qui préférerait sa disparition."),
    line("Remerii", "Je ne sais plus toujours où finit la protection et où commence la peur."),
  ], [
    choice("r2-l", "« La différence se trouve peut-être dans la place laissée au choix. »", "lucidite", [line("Remerii", "Voilà une réponse agaçante."), line("Narration", "Elle baisse les yeux, touchée parce qu’elle sait que vous avez raison."), line("Remerii", "Et utile. Ne vous habituez pas à ce compliment.")], { stats: { lucidite: 1 }, trust: 9, affection: 4, confluence: 3 }),
    choice("r2-s", "Lui dire que sa peur peut rester ici sans décider du prochain geste.", "sangFroid", [line("Narration", "Remerii ferme les yeux. Une tension ancienne quitte lentement sa mâchoire."), line("Remerii", "Restez jusqu’à ce qu’elle se taise un peu.")], { stats: { sangFroid: 1 }, trust: 8, affection: 6, desire: 1, confluence: 3 }),
    choice("r2-a", "« Vous pourriez commencer par admettre que vous tenez aux gens. »", "audace", [line("Remerii", "Et perdre vingt années de mystère savamment entretenu ?"), line("{player}", "Je prends le risque."), line("Remerii", "Je vois cela.")], { stats: { audace: 1 }, trust: 5, affection: 7, desire: 3, confluence: 3 }),
  ]),
  routeScene("remerii", 3, 14, "Danse hors itinéraire", "echo-clearing", "camp", "smirk", [
    line("Narration", "Autour du feu de la Clairière des Échos, Remerii observe les voyageur·ses danser comme un problème stratégique dont elle connaîtrait déjà la solution."),
    line("Remerii", "Je suppose que vous allez me demander cette danse."),
    line("{player}", "Vous semblez déjà avoir préparé votre refus."),
    line("Remerii", "Au contraire. J’ai préparé votre leçon."),
  ], [
    choice("r3-a", "La prendre au mot et tenter une figure trop ambitieuse.", "audace", [line("Narration", "Remerii corrige votre appui d’une main ferme à la taille."), line("Remerii", "Votre optimisme biomécanique est presque touchant."), line("{player}", "Vous ne m’avez pas lâché."), line("Remerii", "Ne confondez pas compétence et tendresse.")], { stats: { audace: 1 }, affection: 7, desire: 6, trust: 3, confluence: 4 }),
    choice("r3-l", "Suivre les micro-indications de ses épaules et lui rendre peu à peu la conduite.", "lucidite", [line("Remerii", "Vous apprenez vite."), line("Narration", "La remarque est banale ; la proximité qu’elle maintient ne l’est pas."), line("Remerii", "Et vous savez quand cesser de me combattre.")], { stats: { lucidite: 1 }, affection: 6, desire: 5, trust: 6, confluence: 4 }),
    choice("r3-r", "Accorder vos pas au flux arcanique sous les dalles.", "resonance", [line("Narration", "Le monde ralentit autour de vous. Remerii cesse de compter, surprise d’abandonner le contrôle sans le perdre."), line("Remerii", "Encore un tour. Pour vérifier la théorie, évidemment.")], { stats: { resonance: 1 }, affection: 7, desire: 5, trust: 6, confluence: 5 }, { stat: "resonance", value: 8 }),
  ]),
  routeScene("remerii", 4, 20, "La faim et la laisse", "miraldas", "bedroom", "calm", [
    line("Narration", "Remerii détache lentement ses bijoux de mage et les aligne sur la table, comme autant d’armures déposées."),
    line("Remerii", "Je sais enseigner le contrôle. Demander ce que je veux m’est curieusement plus difficile."),
    line("Remerii", "Je vous veux près de moi, {player}. Mais je ne veux ni élève, ni disciple. Je vous veux libre de me répondre."),
  ], [
    choice("r4-a", "« Alors demandez-moi, Remerii. Sans détour. »", "audace", [line("Narration", "Elle soutient votre regard, joues légèrement colorées."), line("Remerii", "Restez. Embrassez-moi. Et si vous désirez davantage, dites-le-moi comme je viens de le faire.")], { stats: { audace: 1 }, affection: 10, trust: 8, desire: 10, confluence: 6 }),
    choice("r4-l", "Distinguer ensemble désir, confiance et pouvoir avant de vous approcher.", "lucidite", [line("Narration", "La conversation dure, précise et profondément intime. Remerii ne détourne aucune question."), line("Remerii", "Voilà peut-être la première fois que la prudence me donne autant envie d’avancer.")], { stats: { lucidite: 1 }, affection: 9, trust: 11, desire: 7, confluence: 6 }, { stat: "lucidite", value: 8 }),
    choice("r4-s", "Lui tendre la main et attendre qu’elle choisisse le premier geste.", "sangFroid", [line("Narration", "Elle glisse ses doigts entre les vôtres, puis vous attire avec une douceur désarmée."), line("Remerii", "Je choisis ceci. Et je vous choisis, si vous le voulez aussi.")], { stats: { sangFroid: 1 }, affection: 10, trust: 10, desire: 8, confluence: 6 }),
  ], true),

  // IRIANA
  routeScene("iriana", 0, 2, "Audience sans témoin", "algratal", "throne_room", "stern", [
    line("Narration", "La salle d’audience est vide. Sur la table d’Iriana, une carte réunit plusieurs noms — Hylee, Remerii, Naïah, Valurn — sans qu’aucune convocation n’ait été écrite."),
    line("Iriana", "Saidin prétend qu’une décision manque à cette chronologie. Je vois surtout quatre personnes utiles que je n’ai aucune raison raisonnable de réunir."),
    line("Iriana", "Ma seule certitude concerne le pacte de mon père : je le révoquerai. Pour le reste, dites-moi pourquoi votre arrivée semble remplir une place que je n’avais jamais dessinée."),
  ], [
    choice("i0-a", "« Essayez. Nous découvrirons ensemble votre budget. »", "audace", [line("Iriana", "Un sourire fin lui échappe. Enfin quelqu’un qui comprend la cour sans prétendre être au-dessus d’elle."), line("Iriana", "Je vais apprécier cette négociation.")], { stats: { audace: 1 }, affection: 5, desire: 3, trust: 2, confluence: 2 }),
    choice("i0-l", "« Vous ne cherchez pas à m’acheter. Vous cherchez à savoir qui essaiera avant vous. »", "lucidite", [line("Narration", "Le regard vert d’Iriana se durcit, puis s’éclaire d’un respect prudent."), line("Iriana", "Vous venez de devenir plus utile — et plus dangereux·se.")], { stats: { lucidite: 1 }, trust: 6, affection: 3, confluence: 2 }),
    choice("i0-s", "« Je préfère d’abord connaître les termes de votre proposition. »", "sangFroid", [line("Iriana", "Mesuré. Ni docile, ni inutilement hostile."), line("Narration", "Elle descend de l’estrade pour vous parler à hauteur égale.")], { stats: { sangFroid: 1 }, trust: 5, affection: 3, confluence: 2 }),
  ]),
  routeScene("iriana", 1, 6, "Une mesure suspendue", "algratal", "music_room", "troubled", [
    line("Narration", "Dans la salle de musique, Iriana maintient un doigt au-dessus d’une touche sans l’abaisser."),
    line("Iriana", "Ma mère jouait cette mesure. Je pourrais la reproduire parfaitement et ne rien retrouver d’elle."),
    line("Iriana", "La précision est parfois la forme la plus élégante de l’échec."),
  ], [
    choice("i1-r", "Écouter le silence de l’instrument plutôt que réclamer la mélodie.", "resonance", [line("Narration", "Vous restez avec la note absente. Iriana finit par poser sa main à plat sur le bois."), line("Iriana", "Vous n’avez pas essayé de réparer ce qui ne vous appartenait pas. Merci.")], { stats: { resonance: 1 }, trust: 7, affection: 4, confluence: 4 }, { stat: "resonance", value: 6 }),
    choice("i1-l", "« Peut-être ne cherchez-vous pas la musique, mais la personne que vous étiez en l’écoutant. »", "lucidite", [line("Iriana", "Et cette personne n’existe plus."), line("{player}", "Elle existe assez pour vous manquer."), line("Narration", "Iriana baisse les yeux, atteinte sans se sentir envahie.")], { stats: { lucidite: 1 }, trust: 8, affection: 4, confluence: 3 }),
    choice("i1-a", "Jouer volontairement une note fausse pour briser la perfection du moment.", "audace", [line("Iriana", "C’était atroce."), line("{player}", "Mais vous avez cessé de retenir votre souffle."), line("Iriana", "Ne recommencez jamais. Sauf si je vous le demande.")], { stats: { audace: 1 }, affection: 7, trust: 3, desire: 2, confluence: 3 }),
  ]),
  routeScene("iriana", 2, 10, "La princesse derrière le calcul", "algratal", "terrace", "sad", [
    line("Narration", "Sur la terrasse, Iriana regarde la ville plutôt que vous. En contrebas, Al’Gratal ressemble à un royaume qu’on pourrait tenir entre deux doigts."),
    line("Iriana", "Mon père m’a appris une chose utile : l’amour devient une arme dès que l’autre sait où il se trouve."),
    line("Iriana", "Je préférerais que vous ne découvriez jamais où frapper."),
  ], [
    choice("i2-s", "« Alors je resterai assez loin pour ne pas vous encercler, assez près pour répondre. »", "sangFroid", [line("Iriana", "Une frontière raisonnable."), line("Narration", "Elle vient pourtant se placer près de vous, épaule contre épaule.")], { stats: { sangFroid: 1 }, trust: 9, affection: 5, confluence: 3 }),
    choice("i2-l", "« Vous me montrez déjà l’endroit en me demandant de ne pas le voir. »", "lucidite", [line("Iriana", "Je sais."), line("Narration", "C’est la réponse la plus désarmée que vous lui ayez entendue."), line("Iriana", "Je voulais savoir ce que vous en feriez.")], { stats: { lucidite: 1 }, trust: 10, affection: 5, desire: 2, confluence: 3 }),
    choice("i2-a", "« Je suis plus intéressé·e par l’endroit où vous aimeriez être touchée. »", "audace", [line("Narration", "Le silence devient soudain beaucoup plus chaud."), line("Iriana", "Une formulation dangereuse."), line("{player}", "Vous pouvez refuser."), line("Iriana", "Je peux aussi choisir de répondre plus tard.")], { stats: { audace: 1 }, trust: 5, affection: 7, desire: 6, confluence: 3 }, { stat: "audace", value: 7 }),
  ]),
  routeScene("iriana", 3, 15, "Révoquer l’héritage", "algratal", "war_room", "stern", [
    line("Narration", "Les copies du pacte d’Alamma couvrent la table. Valurn a marqué les clauses démoniaques ; Amanea a fait transmettre, par une route clandestine, les paragraphes que l’Empire ignorait."),
    line("Iriana", "Mon père a décidé que ce contrat ferait partie de mon héritage. Je peux le rompre, mais pas seule — et certainement pas en reproduisant sa manière de lier les autres."),
    line("Iriana", "Je vous demande de coopérer. Pas d’obéir, pas de remplacer l’équipe que je n’ai jamais rassemblée. Décidez en connaissance de cause, même si votre décision me déplaît."),
  ], [
    choice("i3-l", "Lire chaque clause, en corriger deux, puis signer de votre propre nom.", "lucidite", [line("Iriana", "Vous avez remplacé ‘obéira’ par ‘coopérera’."), line("{player}", "Vous m’avez demandé un choix."), line("Iriana", "Et vous venez de me rappeler pourquoi je vous fais confiance.")], { stats: { lucidite: 1 }, trust: 9, affection: 6, confluence: 6 }),
    choice("i3-a", "Déchirer le contrat et lui offrir une poignée de main.", "audace", [line("Narration", "Iriana regarde les morceaux tomber, scandalisée… puis prend votre main."), line("Iriana", "C’est juridiquement absurde."), line("{player}", "Mais librement consenti."), line("Iriana", "Ne prenez pas cet air victorieux.")], { stats: { audace: 1 }, trust: 6, affection: 8, desire: 3, confluence: 6 }),
    choice("i3-s", "Refuser d’agir tant qu’elle n’a pas prévu une sortie pour tous les envoyés.", "sangFroid", [line("Iriana", "Vous retardez une opération critique."), line("{player}", "Je vous empêche de traiter des vies comme des variables."), line("Narration", "Après un long silence, elle redessine le plan.")], { stats: { sangFroid: 1 }, trust: 10, affection: 4, confluence: 7 }, { stat: "sangFroid", value: 8 }),
  ]),
  routeScene("iriana", 4, 21, "Sans ordre ni couronne", "algratal", "alcove", "calm", [
    line("Narration", "Iriana a retiré sa couronne. Elle repose entre vous sur le velours de l’alcôve, simple objet enfin séparé de son corps."),
    line("Iriana", "Je peux vous offrir une place, un titre, une protection. Ce sont encore des manières de contrôler l’avenir."),
    line("Iriana", "Ce soir, je ne vous offre rien. Je vous demande seulement si vous me désirez quand je ne commande pas."),
  ], [
    choice("i4-s", "« Oui. Et nous pouvons nous arrêter au premier doute. »", "sangFroid", [line("Narration", "Iriana inspire, puis formule elle-même ce qu’elle veut et ce qu’elle refuse."), line("Iriana", "Alors approchez. Pas comme un sujet. Comme la personne que j’ai choisie.")], { stats: { sangFroid: 1 }, affection: 10, trust: 11, desire: 8, confluence: 6 }),
    choice("i4-l", "Lui demander ce qu’elle choisirait si personne ne devait jamais l’apprendre.", "lucidite", [line("Iriana", "Vous. Ici. Sans calculer demain pendant quelques heures."), line("Narration", "Elle pose sa main sur votre joue avec une franchise presque vertigineuse.")], { stats: { lucidite: 1 }, affection: 10, trust: 10, desire: 9, confluence: 6 }, { stat: "lucidite", value: 9 }),
    choice("i4-a", "Repousser doucement la couronne et l’embrasser avant qu’elle ne reconstruise un discours.", "audace", [line("Narration", "Iriana vous rend le baiser avec une intensité longtemps disciplinée."), line("Iriana", "Je suppose que c’était votre manière de dire oui."), line("{player}", "Je peux le dire aussi."), line("Iriana", "Dites-le.")], { stats: { audace: 1 }, affection: 11, trust: 8, desire: 11, confluence: 6 }),
  ], true),

  // VALURN
  routeScene("valurn", 0, 3, "La première mise", "algratal", "market", "amused", [
    line("Narration", "Valurn fait tourner un jeton entre ses doigts devant l’enseigne du Croissant. Ses yeux rouges vous suivent depuis assez longtemps pour que le hasard ne soit plus crédible."),
    line("Valurn", "Je parie trois pièces que vous allez prétendre ne pas me connaître. Cinq que vous savez déjà qu’il vaut mieux mentir."),
    line("Valurn", "Alors ? Faites-moi gagner agréablement."),
  ], [
    choice("v0-a", "Prendre le jeton au vol. « Je parie que vous aviez prévu les deux réponses. »", "audace", [line("Valurn", "Enfin une personne qui comprend qu’un pari se gagne avant d’être proposé."), line("Narration", "Il vous laisse le jeton.")], { stats: { audace: 1 }, affection: 5, desire: 3, trust: 2, coins: 3, confluence: 2 }),
    choice("v0-l", "« Vous ne cherchez pas à gagner. Vous vérifiez si quelqu’un m’a déjà briefé sur vous. »", "lucidite", [line("Valurn", "Voilà qui devient intéressant."), line("Narration", "Son sourire reste charmeur, mais son regard se fait sérieux.")], { stats: { lucidite: 1 }, trust: 6, affection: 3, confluence: 2 }),
    choice("v0-s", "Refuser la mise, mais accepter la conversation.", "sangFroid", [line("Valurn", "Vous refusez le jeu sans refuser le joueur. Subtil."), line("{player}", "Je préfère connaître les règles avant de miser."), line("Valurn", "Moi aussi. C’est pour cela que je les écris.")], { stats: { sangFroid: 1 }, trust: 5, affection: 3, confluence: 2 }),
  ]),
  routeScene("valurn", 1, 7, "Une flamme qui n’obéit pas", "forbidden", "camp", "annoyed", [
    line("Narration", "Au camp, une flamme noire danse dans la paume de Valurn. Elle grandit chaque fois qu’il tente de l’étouffer."),
    line("Valurn", "Le Chaos adore qu’on lui ordonne de se calmer. Il prend cela pour une invitation à devenir théâtral."),
    line("Valurn", "Éloignez-vous, à moins d’avoir développé une passion soudaine pour les brûlures démoniaques."),
  ], [
    choice("v1-r", "Accorder votre souffle aux pulsations de la flamme sans la toucher.", "resonance", [line("Narration", "Le feu se penche vers vous, puis retrouve une forme stable."), line("Valurn", "Vous venez de séduire un fragment de Chaos. Je devrais probablement être jaloux.")], { stats: { resonance: 1 }, trust: 6, affection: 5, desire: 3, confluence: 5 }, { stat: "resonance", value: 6 }),
    choice("v1-s", "Rester à portée de voix, hors du cercle de danger.", "sangFroid", [line("{player}", "Je ne m’approche pas. Je ne pars pas non plus."), line("Narration", "Valurn cesse un instant de plaisanter."), line("Valurn", "Une nuance que beaucoup de héros oublient.")], { stats: { sangFroid: 1 }, trust: 8, affection: 3, confluence: 3 }),
    choice("v1-a", "« J’ai connu des invitations plus élégantes, mais soit. »", "audace", [line("Valurn", "Vous êtes soit très courageux·se, soit terriblement mal conseillé·e."), line("Narration", "Il referme ses doigts sur la flamme et vous offre son autre main pour franchir le cercle.")], { stats: { audace: 1 }, trust: 4, affection: 6, desire: 5, confluence: 3 }),
  ]),
  routeScene("valurn", 2, 11, "Le nom de son père", "akuhn", "deep_archives", "away", [
    line("Narration", "Un ancien registre démoniaque mentionne Valurn comme une possession de Bhaal. Il referme le livre assez fort pour fendre sa reliure."),
    line("Valurn", "Mon père confond le sang avec un acte de propriété. Le monde mortel a au moins inventé des formulaires pour rendre l’insulte plus polie."),
    line("Valurn", "Ne me dites pas que je ne suis pas comme lui. Vous ne savez pas encore de quoi je suis capable."),
  ], [
    choice("v2-l", "« Je sais seulement ce que vous choisissez quand personne ne vous force. »", "lucidite", [line("Narration", "Valurn reste immobile, privé de la dispute qu’il avait préparée."), line("Valurn", "C’est beaucoup plus difficile à rejeter qu’un compliment naïf.")], { stats: { lucidite: 1 }, trust: 10, affection: 4, confluence: 3 }),
    choice("v2-s", "Ne pas le contredire ; lui demander ce qu’il craint de choisir.", "sangFroid", [line("Valurn", "Vous avez une manière odieuse de laisser les portes ouvertes."), line("{player}", "Vous pouvez ne pas répondre."), line("Valurn", "C’est précisément le problème. J’en ai envie.")], { stats: { sangFroid: 1 }, trust: 9, affection: 5, desire: 2, confluence: 3 }),
    choice("v2-a", "« Parfait. Montrez-moi qui vous êtes au lieu de citer Bhaal. »", "audace", [line("Narration", "La colère dans ses yeux change de direction."), line("Valurn", "Vous aimez vivre dangereusement."), line("{player}", "J’aime surtout quand vous cessez de parler à sa place.")], { stats: { audace: 1 }, trust: 6, affection: 7, desire: 4, confluence: 3 }),
  ]),
  routeScene("valurn", 3, 16, "Le grand parieur perd une mise", "algratal", "terrace", "surprised", [
    line("Narration", "Valurn dépose deux coupes et un jeton sur la balustrade. Pour la première fois, son geste manque d’assurance."),
    line("Valurn", "J’ai parié que je pouvais traverser cette Confluence sans m’attacher à ce qu’elle contient."),
    line("Valurn", "Je déteste perdre. Plus encore lorsque le gain ressemble étrangement à la défaite."),
  ], [
    choice("v3-a", "Retourner le jeton. « Double ou rien : dites-moi ce que vous voulez. »", "audace", [line("Valurn", "Vous. Voilà. C’est prononcé, le monde n’a pas explosé."), line("Narration", "Son rire est bref, presque incrédule.")], { stats: { audace: 1 }, affection: 8, trust: 6, desire: 7, confluence: 5 }),
    choice("v3-l", "« Vous pourriez cesser de traiter l’attachement comme un contrat piégé. »", "lucidite", [line("Valurn", "Et risquer de découvrir qu’il peut être gratuit ?"), line("{player}", "Ou réciproque."), line("Narration", "Il glisse le jeton dans votre paume et referme vos doigts dessus.")], { stats: { lucidite: 1 }, affection: 7, trust: 8, desire: 4, confluence: 5 }),
    choice("v3-s", "Lui laisser la possibilité de reprendre sa mise sans humiliation.", "sangFroid", [line("Valurn", "Vous me laissez une sortie."), line("{player}", "Je veux que vous restiez parce que vous le choisissez."), line("Valurn", "Vous rendez la fuite remarquablement peu séduisante.")], { stats: { sangFroid: 1 }, affection: 6, trust: 10, desire: 4, confluence: 5 }, { stat: "sangFroid", value: 8 }),
  ]),
  routeScene("valurn", 4, 22, "Un pacte sans chaîne", "algratal", "bedroom", "charming", [
    line("Narration", "Une flamme rouge dessine un cercle sur le sol. Valurn l’efface d’un geste avant de vous rejoindre."),
    line("Valurn", "Pas de sceau. Pas de dette. Pas même une promesse éternelle, j’ai une réputation à protéger."),
    line("Valurn", "Seulement ce soir, puis demain si nous le voulons encore. Est-ce assez réel pour vous ?"),
  ], [
    choice("v4-s", "« Oui. Chaque oui devra rester aussi libre que le premier. »", "sangFroid", [line("Valurn", "Vous avez réussi à rendre l’absence de contrat terriblement solennelle."), line("Narration", "Il vous touche avec une prudence que son sourire ne tente plus de dissimuler.")], { stats: { sangFroid: 1 }, affection: 10, trust: 11, desire: 8, confluence: 6 }),
    choice("v4-a", "Jeter le jeton de votre première rencontre sur le lit. « Mise acceptée. »", "audace", [line("Valurn", "Je savais que cet investissement finirait par payer."), line("Narration", "Son baiser interrompt votre réplique ; il vous rend pourtant tout l’espace nécessaire pour répondre.")], { stats: { audace: 1 }, affection: 10, trust: 8, desire: 11, confluence: 6 }),
    choice("v4-l", "Lui faire dire explicitement que ses flammes et ses pouvoirs resteront hors du choix.", "lucidite", [line("Valurn", "Aucun sort, aucune influence. Seulement moi — ce qui est déjà un risque considérable."), line("Narration", "Vous acceptez en connaissance de cause, et son arrogance devient douceur.")], { stats: { lucidite: 1 }, affection: 9, trust: 12, desire: 8, confluence: 6 }, { stat: "lucidite", value: 8 }),
  ], true),

  // NAÏAH
  routeScene("naiah", 0, 4, "Le jeu des branches", "forbidden", "forbidden_forest", "smirk", [
    line("Narration", "Un rire léger voyage d’arbre en arbre. Naïah apparaît enfin au-dessus de vous, accroupie sur une branche comme si la gravité était une règle destinée aux autres."),
    line("Naïah", "Tu as suivi mon invitation. C’est courageux… ou délicieusement imprudent."),
    line("Naïah", "Je te propose un jeu : retrouve le vrai chemin avant que mes ombres ne te retrouvent. Si tu gagnes, je réponds à une question."),
  ], [
    choice("n0-r", "Écouter la forêt plutôt que les images qu’elle vous montre.", "resonance", [line("Narration", "Les faux sentiers murmurent trop fort. Vous choisissez le seul qui n’essaie pas de vous séduire."), line("Naïah", "Oh… tu entends derrière mon spectacle. Je vais devoir inventer des tours plus jolis.")], { stats: { resonance: 1 }, trust: 5, affection: 5, confluence: 4 }, { stat: "resonance", value: 5 }),
    choice("n0-l", "Observer Naïah : ses yeux reviennent toujours vers le même sentier.", "lucidite", [line("{player}", "Le jeu n’était pas dans la forêt. Il était dans ton regard."), line("Naïah", "Tricheur·se."), line("Narration", "Elle descend devant vous avec un sourire ravi.")], { stats: { lucidite: 1 }, trust: 6, affection: 4, confluence: 3 }),
    choice("n0-a", "Quitter volontairement le chemin. « Je préfère voir ce que tu fais quand je refuse les règles. »", "audace", [line("Naïah", "Un éclat de rire fait frissonner les feuilles. Très bien ! Perds-toi. Je viens avec toi."), line("Narration", "Elle saute au sol et se glisse à votre bras comme une vieille amie.")], { stats: { audace: 1 }, affection: 7, desire: 2, trust: 2, confluence: 3 }),
  ]),
  routeScene("naiah", 1, 8, "Le théâtre des brumes", "forbidden", "purple_forest", "laugh", [
    line("Narration", "Naïah transforme la clairière en théâtre. Les brumes deviennent une cité qui brûle, puis un bal où des silhouettes sans visage applaudissent."),
    line("Naïah", "Regarde comme tout devient beau lorsqu’on cesse de demander la permission."),
    line("Naïah", "Tu pourrais danser avec moi pendant que leurs certitudes s’effondrent."),
  ], [
    choice("n1-l", "« C’est beau. Et c’est aussi une menace. Je peux voir les deux. »", "lucidite", [line("Narration", "Le sourire de Naïah s’amincit, mais elle ne dissipe pas la vision."), line("Naïah", "Tu ne détournes pas les yeux et tu ne m’applaudis pas. C’est… nouveau.")], { stats: { lucidite: 1 }, trust: 8, affection: 3, confluence: 4 }),
    choice("n1-s", "Entrer dans la danse sans participer à la destruction illusoire.", "sangFroid", [line("Naïah", "Tu poses tes propres règles dans mon rêve."), line("{player}", "Tu peux me demander de danser. Pas de me réjouir d’un massacre."), line("Naïah", "Alors danse seulement avec moi.")], { stats: { sangFroid: 1 }, trust: 7, affection: 5, desire: 3, confluence: 4 }),
    choice("n1-a", "Saisir sa main et détourner la valse vers une scène ridicule.", "audace", [line("Narration", "Vous transformez ses soldats d’ombre en musiciens maladroits. Naïah éclate de rire."), line("Naïah", "Tu viens de vandaliser mon apocalypse. J’adore ça.")], { stats: { audace: 1 }, affection: 8, trust: 3, desire: 4, confluence: 4 }),
  ]),
  routeScene("naiah", 2, 12, "Quand elle ne joue plus", "akuhn", "akuhn_palace", "sad", [
    line("Narration", "Dans un couloir dérobé du palais obscurci, Naïah ne porte ni couronne ni sourire. Elle n’est entrée que parce qu’Allenna a détourné la garde pendant quelques minutes."),
    line("Naïah", "Amanea m’appelle encore sa fille, puis ordonne que l’on me chasse si je franchis les portes. Elle dit qu’elle n’a pas le choix. C’est pratique, un secret : il permet d’aimer quelqu’un tout en le laissant seul dans une forêt."),
    line("Naïah", "Hylee croit qu’il existe une raison. Moi, je crois surtout qu’une mère devrait regarder sa fille lorsqu’elle la condamne."),
  ], [
    choice("n2-s", "Vous asseoir près de la sortie sans faire mine de la prendre.", "sangFroid", [line("Narration", "Les minutes passent. Naïah finit par poser sa tête contre votre épaule."), line("Naïah", "Tu me montres que tu peux partir. Et tu restes quand même.")], { stats: { sangFroid: 1 }, trust: 10, affection: 5, confluence: 3 }),
    choice("n2-l", "« Tu n’as pas à être agréable pour mériter une présence. Mais tu restes responsable de ce que tu fais. »", "lucidite", [line("Naïah", "Même maintenant, tu refuses de me pardonner d’avance."), line("{player}", "Je refuse surtout de te réduire à tes blessures."), line("Narration", "Elle ferme les yeux, bouleversée.")], { stats: { lucidite: 1 }, trust: 11, affection: 5, confluence: 3 }, { stat: "lucidite", value: 7 }),
    choice("n2-r", "Laisser votre Résonance toucher la brume sans tenter de la commander.", "resonance", [line("Narration", "La brume entoure vos mains, d’abord froide, puis presque timide."), line("Naïah", "Elle ne te mord pas."), line("{player}", "Parce que tu ne le lui as pas demandé."), line("Naïah", "Pas cette fois.")], { stats: { resonance: 1 }, trust: 8, affection: 7, desire: 2, confluence: 4 }),
  ]),
  routeScene("naiah", 3, 17, "Une reine sans public", "forbidden", "forbidden_forest", "thinking", [
    line("Narration", "Naïah vous conduit dans une alcôve de brume dissimulée derrière les racines. Aucune ombre n’applaudit, aucun sujet ne peut la voir."),
    line("Naïah", "Ici, je ne suis ni reine, ni arme, ni catastrophe annoncée."),
    line("Naïah", "Je ne sais pas très bien ce qui reste. Tu pourrais regarder pour moi ?"),
  ], [
    choice("n3-l", "Nommer ce que vous avez vu : sa curiosité, sa cruauté, sa tendresse et ses choix.", "lucidite", [line("Naïah", "Tu gardes même les parties laides."), line("{player}", "Elles existent. Elles ne sont pas tout."), line("Narration", "Elle prend votre visage entre ses mains avec une gravité inhabituelle.")], { stats: { lucidite: 1 }, trust: 9, affection: 7, confluence: 5 }),
    choice("n3-a", "« Il reste une femme qui me plaît terriblement et m’inquiète régulièrement. »", "audace", [line("Naïah", "Voilà une déclaration presque parfaite."), line("{player}", "Presque ?"), line("Naïah", "Tu aurais pu commencer par ‘terriblement’.")], { stats: { audace: 1 }, affection: 9, trust: 5, desire: 7, confluence: 5 }),
    choice("n3-s", "Lui rendre la question : ce qui reste doit être nommé par elle.", "sangFroid", [line("Naïah", "Quelqu’un qui veut être aimée sans savoir quoi faire de cet amour."), line("{player}", "C’est un début."), line("Naïah", "Reste pour la suite.")], { stats: { sangFroid: 1 }, trust: 10, affection: 6, desire: 3, confluence: 5 }),
  ]),
  routeScene("naiah", 4, 23, "Meilleure qu’elle", "forbidden", "bedroom", "smirk", [
    line("Narration", "Dans son refuge au cœur de la Forêt Interdite, la brume violette forme une porte autour de vous, mais Naïah la dissipe avant de s’approcher."),
    line("Naïah", "Je pourrais te faire croire que tu me désires. Je pourrais enfermer le monde dehors et appeler cela de la protection."),
    line("Naïah", "Je ne le ferai pas. Je veux savoir ce que tu choisis quand je ne touche pas à ton esprit."),
  ], [
    choice("n4-l", "Vérifier avec elle que la brume et les illusions resteront inactives.", "lucidite", [line("Naïah", "Rien que mes mots, mes mains, et tout ce que tu me demanderas d’arrêter."), line("Narration", "Son sérieux est absolu. Votre oui la fait trembler plus sûrement qu’aucun sort.")], { stats: { lucidite: 1 }, affection: 10, trust: 12, desire: 8, confluence: 6 }, { stat: "lucidite", value: 9 }),
    choice("n4-s", "« Je te choisis. Pas ta prison, pas ta guerre. Toi, tant que tu me laisses libre. »", "sangFroid", [line("Naïah", "Alors sois libre ici aussi."), line("Narration", "Elle attend votre mouvement avant de réduire la distance, attentive à chaque réponse.")], { stats: { sangFroid: 1 }, affection: 11, trust: 11, desire: 8, confluence: 6 }),
    choice("n4-a", "« Sans magie ? Tu prends un risque : je pourrais t’aimer pour de vrai. »", "audace", [line("Naïah", "C’est exactement le genre de menace que j’espérais."), line("Narration", "Elle vous embrasse en riant, puis s’arrête pour entendre votre oui clairement prononcé.")], { stats: { audace: 1 }, affection: 12, trust: 8, desire: 11, confluence: 6 }),
  ], true),

  // LINEVA
  routeScene("lineva", 0, 5, "Le quai qui tient encore", "forthaven", "forthaven", "stern", [
    line("Narration", "Sur les quais de Forthaven, Lineva déplace elle-même des caisses pendant que trois officiers lui demandent des ordres contradictoires."),
    line("Lineva", "Si vous êtes venu·e proposer une stratégie brillante, prenez un numéro. Si vous pouvez porter, prenez cette caisse."),
    line("Narration", "Elle ne vous regarde qu’après avoir vérifié que tous les soldats ont reçu une tâche."),
  ], [
    choice("l0-s", "Prendre la caisse sans réclamer d’explication ni de reconnaissance.", "sangFroid", [line("Narration", "Vous travaillez côte à côte jusqu’à ce que le quai respire de nouveau."), line("Lineva", "Vous avez aidé avant de chercher à être utile. C’est suffisamment rare pour être remarqué.")], { stats: { sangFroid: 1 }, trust: 6, affection: 3, confluence: 2 }),
    choice("l0-l", "Repérer le goulet d’étranglement et réorganiser la chaîne sans contredire ses ordres.", "lucidite", [line("Lineva", "Vous avez déplacé deux hommes et gagné vingt minutes."), line("{player}", "Votre plan était bon. Il manquait juste de l’espace."), line("Lineva", "Je retiens votre nom.")], { stats: { lucidite: 1 }, trust: 5, affection: 4, confluence: 3 }),
    choice("l0-a", "« Je porte si vous promettez de ne pas me promouvoir avant ce soir. »", "audace", [line("Lineva", "Aucun risque. Vous tenez cette caisse à l’envers."), line("Narration", "Son premier sourire est fatigué, mais bien réel.")], { stats: { audace: 1 }, affection: 6, trust: 2, confluence: 2 }),
  ]),
  routeScene("lineva", 1, 9, "Cartes et fatigue", "forthaven", "war_room", "thoughtful", [
    line("Narration", "La salle de commandement est vide depuis longtemps. Lineva fixe encore la même carte, les doigts crispés sur le bord de la table."),
    line("Lineva", "Ils attendent tous une décision. Personne ne se demande si la personne qui la prend a encore les yeux ouverts."),
    line("Lineva", "Ne me dites pas de dormir. Je n’ai pas le luxe d’être raisonnable."),
  ], [
    choice("l1-l", "Prendre en charge une seule question précise, sans prétendre porter le reste.", "lucidite", [line("{player}", "Donnez-moi les patrouilles du secteur est. Seulement cela."), line("Narration", "Lineva hésite, puis vous transmet le registre."), line("Lineva", "Une aide délimitée. Vous savez parler aux gens méfiants.")], { stats: { lucidite: 1 }, trust: 8, affection: 4, confluence: 3 }),
    choice("l1-s", "Rester éveillé·e avec elle et instaurer des pauses à deux.", "sangFroid", [line("Lineva", "Cinq minutes ne sauveront pas la ville."), line("{player}", "Une commandante qui tient debout, peut-être."), line("Narration", "Elle accepte la tasse que vous lui tendez.")], { stats: { sangFroid: 1 }, trust: 7, affection: 5, confluence: 3 }),
    choice("l1-a", "Fermer la carte. « Vous pouvez me destituer après huit heures de sommeil. »", "audace", [line("Lineva", "C’est de l’insubordination."), line("{player}", "Je ne suis pas sous vos ordres."), line("Lineva", "C’est bien le seul argument qui vous sauve.")], { stats: { audace: 1 }, affection: 7, trust: 3, desire: 2, confluence: 3 }),
  ]),
  routeScene("lineva", 2, 13, "Quitter le rempart", "forthaven", "forthaven", "teary", [
    line("Narration", "Au mémorial maritime, Lineva tient la dernière lettre de Draven. Il est vivant, déjà sur la route d’Al’Gratal, et lui demande de le rejoindre quelques jours pour défendre elle-même les besoins de Forthaven."),
    line("Lineva", "Partir serait raisonnable. L’Empire écouterait mieux la commandante qui tient le front. Mais chaque heure passée loin d’ici ressemble à une trahison envers ceux qui restent."),
    line("Lineva", "Mon père affirme que la ville survivra sans moi. C’est exactement le genre de phrase qu’un père peut écrire depuis une route où il ne voit pas les morts-vivants."),
  ], [
    choice("l2-s", "Construire avec elle une relève précise avant de lui demander de partir.", "sangFroid", [line("Narration", "Vous passez chaque poste en revue, nommez les responsables et fixez un moyen de retour d’urgence."), line("Lineva", "Vous ne me demandez pas d’abandonner Forthaven. Vous me prouvez qu’elle sait tenir avec moi, pas seulement sous moi."), line("Lineva", "D’accord. Trois jours à Al’Gratal. Pas un de plus sans nouveau vote.")], { stats: { sangFroid: 1 }, trust: 10, affection: 5, confluence: 3, flags: ["lineva-travel"] }),
    choice("l2-l", "Montrer que plaider elle-même pour la ville fait partie de son commandement.", "lucidite", [line("{player}", "Vous ne quittez pas votre poste : vous l’étendez jusqu’au Conseil impérial."), line("Lineva", "Une formulation dangereusement convaincante."), line("Narration", "Elle replie la lettre et commence déjà la liste de ce que sa relève devra savoir."), line("Lineva", "Très bien. Je voyagerai — parce que je l’ai décidé, pas parce que Draven l’a ordonné.")], { stats: { lucidite: 1 }, trust: 9, affection: 6, confluence: 3, flags: ["lineva-travel"] }),
    choice("l2-a", "Lui proposer de vous confier la ville pendant qu’elle va contredire l’Empire en personne.", "audace", [line("Lineva", "Vous ? Commander Forthaven ?"), line("{player}", "Non. Rappeler à vos officiers que vous leur faites confiance chaque fois qu’ils paniquent."), line("Narration", "Son rire arrive au milieu de l’inquiétude."), line("Lineva", "Marché conclu. Préparez un sac avant que je redevienne raisonnable.")], { stats: { audace: 1 }, trust: 6, affection: 8, confluence: 3, flags: ["lineva-travel"] }),
  ]),
  routeScene("lineva", 3, 18, "Une nuit loin du port", "algratal", "ballroom", "smirk", [
    line("Narration", "Après sa première audience à Al’Gratal, Lineva porte une tenue de bal comme une armure étrangère. Elle s’est réfugiée sur un balcon d’où, pour la première fois, elle ne peut pas voir Forthaven."),
    line("Lineva", "La relève n’a envoyé qu’un rapport. Aucun incendie, aucune brèche, aucune supplique pour mon retour. Je devrais être soulagée. Je me sens surtout inutile."),
    line("{player}", "Ils dansent, parfois."),
    line("Lineva", "Cela semble logistiquement discutable. Ce qui est peut-être précisément ce dont j’ai besoin avant de rentrer."),
  ], [
    choice("l3-a", "L’inviter avec une révérence excessivement théâtrale.", "audace", [line("Lineva", "Si vous racontez que j’ai accepté, je nierai sous serment."), line("Narration", "Elle prend votre main et vous entraîne avant de pouvoir changer d’avis.")], { stats: { audace: 1 }, affection: 8, desire: 6, trust: 4, confluence: 4 }),
    choice("l3-s", "Proposer une danse lente, loin du centre et sans public.", "sangFroid", [line("Narration", "Lineva pose ses mains avec précaution, comme si la douceur exigeait plus de courage qu’une bataille."), line("Lineva", "Je pourrais apprendre à apprécier une heure inutile.")], { stats: { sangFroid: 1 }, affection: 7, desire: 4, trust: 7, confluence: 4 }),
    choice("l3-l", "Lui demander ce qu’elle voudrait faire si personne n’attendait rien d’elle.", "lucidite", [line("Lineva", "Rester ici. Vous regarder. Ne résoudre absolument aucun problème."), line("Narration", "Elle se tourne enfin vers vous plutôt que vers le port invisible à l’horizon.")], { stats: { lucidite: 1 }, affection: 7, desire: 5, trust: 7, confluence: 4 }),
  ]),
  routeScene("lineva", 4, 23, "Le port après la tempête", "forthaven", "bedroom", "smirk", [
    line("Narration", "La fenêtre donne sur les lanternes du port. Lineva a laissé son épée, son manteau et ses insignes près de la porte."),
    line("Lineva", "Je ne veux pas que cette nuit soit une récompense après une victoire. Je veux qu’elle existe même si demain est difficile."),
    line("Lineva", "Je vous demande de rester avec la femme qui fatigue, pas avec le symbole qui tient toujours."),
  ], [
    choice("l4-s", "« Je reste. Et demain, nous déciderons à nouveau. »", "sangFroid", [line("Lineva", "Une décision renouvelable."), line("Narration", "Elle sourit, soulagée par la simplicité du terme, puis vient chercher votre baiser.")], { stats: { sangFroid: 1 }, affection: 10, trust: 12, desire: 8, confluence: 6 }),
    choice("l4-l", "Lui demander ce dont elle a besoin ce soir, sans supposer que vous le savez.", "lucidite", [line("Lineva", "De lenteur. De franchise. Et que vous ne me laissiez pas transformer ceci en nouvelle mission."), line("Narration", "Vous acquiescez à chaque limite avant de la rejoindre.")], { stats: { lucidite: 1 }, affection: 9, trust: 11, desire: 9, confluence: 6 }, { stat: "lucidite", value: 8 }),
    choice("l4-a", "« Permission de désobéir à tous les horaires jusqu’à l’aube ? »", "audace", [line("Lineva", "Accordée. À une condition : vous cessez de demander la permission pour m’embrasser après mon oui."), line("Narration", "Vous obtenez ce oui très clairement.")], { stats: { audace: 1 }, affection: 11, trust: 8, desire: 11, confluence: 6 }),
  ], true),

  // SAIDIN
  routeScene("saidin", 0, 6, "L’heure immobile", "miraldas", "deep_archives", "mysterious", [
    line("Narration", "Au fond des archives de Mir’Aldas, Saidin verse du thé dans deux tasses. La vapeur de la première monte ; celle de la seconde reste immobile, suspendue entre deux secondes."),
    line("Saidin", "J’avais préparé celle-ci pour vous hier. Vous n’étiez pas encore arrivé·e, ce qui compliquait légèrement le service."),
    line("Saidin", "Voulez-vous boire le thé qui a attendu votre passé, ou celui qui vient d’être infusé dans votre présent ?"),
  ], [
    choice("s0-r", "Toucher la tasse immobile et écouter le temps retenu autour d’elle.", "resonance", [line("Narration", "Votre Résonance rencontre une minute pliée avec une délicatesse presque mélancolique."), line("Saidin", "Vous n’avez pas tenté de la déplier. C’est une forme de politesse rarissime envers le temps.")], { stats: { resonance: 1 }, trust: 5, affection: 4, confluence: 4 }, { stat: "resonance", value: 5 }),
    choice("s0-l", "Choisir le thé frais. « Je préfère une boisson qui n’a pas décidé de mon arrivée avant moi. »", "lucidite", [line("Saidin", "Excellent. La prophétie est un très mauvais hôte : elle choisit toujours la place des invités."), line("Narration", "Il vous tend la tasse fraîche avec un sourire approbateur.")], { stats: { lucidite: 1 }, trust: 6, affection: 3, confluence: 3 }),
    choice("s0-a", "Mélanger les deux tasses. « Maintenant, aucune de vos réponses n’est prévue. »", "audace", [line("Saidin", "Vous venez d’inventer un thé temporellement douteux."), line("{player}", "Vous le buvez ?"), line("Saidin", "Évidemment. Je n’ai jamais su résister à une mauvaise idée bien exécutée.")], { stats: { audace: 1 }, affection: 6, trust: 3, confluence: 3 }),
  ]),
  routeScene("saidin", 1, 10, "La réponse avant la question", "miraldas", "deep_archives", "thinking", [
    line("Narration", "Saidin vous tend une enveloppe scellée de votre propre écriture. À l’intérieur, une phrase : « Ne lui demande pas laquelle. »"),
    line("Saidin", "Vous me la donnerez dans onze jours. Ou peut-être déciderez-vous de ne pas le faire maintenant que je vous l’ai montrée."),
    line("Saidin", "Voilà le problème des réponses trop précoces : elles colonisent les questions."),
  ], [
    choice("s1-l", "Rendre l’enveloppe sans la conserver. « Je poserai ma propre question quand elle existera. »", "lucidite", [line("Saidin", "Et vous venez de me rappeler que connaître une possibilité ne lui donne aucun droit."), line("Narration", "Il dissipe l’enveloppe, visiblement soulagé.")], { stats: { lucidite: 1 }, trust: 8, affection: 4, confluence: 4 }),
    choice("s1-s", "Lui demander ce que cette réponse lui fait craindre, ici et maintenant.", "sangFroid", [line("Saidin", "Que chaque personne que j’aime finisse par devenir un souvenir que j’ai rencontré trop tôt."), line("Narration", "Il regarde vos mains plutôt que les siècles qui l’attendent.")], { stats: { sangFroid: 1 }, trust: 8, affection: 5, confluence: 3 }),
    choice("s1-a", "Déchirer la lettre. « Nous venons de créer une version du monde où elle n’arrive jamais. »", "audace", [line("Saidin", "Dramatique, imprudent… et techniquement exact."), line("Narration", "Son rire est plus jeune que tout ce que vous savez de lui.")], { stats: { audace: 1 }, trust: 4, affection: 7, desire: 2, confluence: 4 }),
  ]),
  routeScene("saidin", 2, 14, "Ce que le temps ne rend pas", "algratal", "terrace", "sad", [
    line("Narration", "La terrasse est pleine de soleil, mais Saidin fixe une ombre qui n’existe que pour lui."),
    line("Saidin", "J’ai vu tant de versions de cette ville disparaître que je ne sais plus toujours laquelle j’ai le droit de regretter."),
    line("Saidin", "On me croit au-dessus du deuil parce que je peux en visiter les contours. C’est précisément l’inverse."),
  ], [
    choice("s2-s", "Rester avec lui sans lui demander de raconter les morts.", "sangFroid", [line("Narration", "Vous partagez le soleil et le silence. Peu à peu, l’ombre cesse d’être le seul endroit qu’il regarde."), line("Saidin", "Merci de ne pas avoir exigé que ma douleur devienne une histoire utile.")], { stats: { sangFroid: 1 }, trust: 10, affection: 5, confluence: 3 }),
    choice("s2-r", "Ancrer doucement sa perception dans les sons et les couleurs du présent.", "resonance", [line("{player}", "La cloche sonne maintenant. Le vent vient de l’est. Et je suis ici."), line("Saidin", "Vous êtes ici."), line("Narration", "Il le répète comme une découverte.")], { stats: { resonance: 1 }, trust: 9, affection: 7, confluence: 5 }, { stat: "resonance", value: 7 }),
    choice("s2-a", "« Je ne peux pas rivaliser avec l’éternité. Je peux seulement vous voler cet après-midi. »", "audace", [line("Saidin", "Un vol d’une rare ambition."), line("Narration", "Il vous offre son bras et, pour quelques heures, refuse de regarder ailleurs.")], { stats: { audace: 1 }, trust: 5, affection: 8, desire: 4, confluence: 3 }),
  ]),
  routeScene("saidin", 3, 19, "Une minute ordinaire", "miraldas", "market", "neutral", [
    line("Narration", "Saidin vous attend au marché du dôme sans artefact, sans énigme et — événement plus suspect encore — sans plan."),
    line("Saidin", "J’aimerais essayer quelque chose de difficile : une heure parfaitement ordinaire."),
    line("Saidin", "Je n’utiliserai pas le temps pour corriger mes phrases. Vous devrez supporter la première version de moi."),
  ], [
    choice("s3-a", "L’emmener goûter la pâtisserie la plus mal notée du marché.", "audace", [line("Saidin", "C’est infect."), line("{player}", "Et impossible à prévoir à partir des livres."), line("Narration", "Il rit si fort que deux passants se retournent.")], { stats: { audace: 1 }, affection: 9, desire: 5, trust: 5, confluence: 4 }),
    choice("s3-l", "Lui poser une question simple dont vous ignorez réellement la réponse.", "lucidite", [line("{player}", "Qu’est-ce qui vous plaît chez moi — pas ce que je deviens, ce que je suis aujourd’hui ?"), line("Saidin", "Votre manière de défendre le présent contre moi."), line("Narration", "Cette réponse-là n’a pas été répétée.")], { stats: { lucidite: 1 }, affection: 8, trust: 8, desire: 4, confluence: 5 }),
    choice("s3-s", "Marcher à son rythme, sans remplir chaque silence.", "sangFroid", [line("Narration", "Une heure passe sans se plier. Saidin la laisse faire."), line("Saidin", "C’était terriblement court. Et assez beau pour me donner envie d’une seconde.")], { stats: { sangFroid: 1 }, affection: 7, trust: 9, desire: 3, confluence: 5 }),
  ]),
  routeScene("saidin", 4, 24, "Rester dans le présent", "miraldas", "alcove", "mysterious", [
    line("Narration", "Tous les sabliers de l’alcôve ont été retournés contre le mur. Saidin n’a gardé qu’une bougie ordinaire entre vous."),
    line("Saidin", "Je pourrais prolonger cette nuit. Revenir sur un geste, effacer une maladresse, nous offrir l’illusion de la perfection."),
    line("Saidin", "Je ne le ferai pas. Je vous veux dans un instant qui avance, où votre oui peut devenir non et où chaque seconde doit être choisie à nouveau."),
  ], [
    choice("s4-s", "« Alors nous avancerons lentement, sans retenir aucune seconde. »", "sangFroid", [line("Narration", "Saidin éteint sa magie avant de poser sa main sur la vôtre."), line("Saidin", "Pour la première fois depuis longtemps, je n’ai aucune idée de la suite. C’est merveilleux.")], { stats: { sangFroid: 1 }, affection: 10, trust: 12, desire: 8, confluence: 6 }),
    choice("s4-l", "Lui faire promettre de ne consulter aucun futur jusqu’au matin.", "lucidite", [line("Saidin", "Je le promets. Pas pour garantir ce qui arrivera — pour vous laisser le choisir avec moi."), line("Narration", "Il attend votre accord, pleinement présent.")], { stats: { lucidite: 1 }, affection: 9, trust: 12, desire: 8, confluence: 6 }, { stat: "lucidite", value: 9 }),
    choice("s4-a", "Souffler la bougie. « Une nuit inconnue vous fait-elle peur ? »", "audace", [line("Saidin", "Beaucoup."), line("Narration", "Son sourire se devine dans l’obscurité."), line("Saidin", "Embrassez-moi avant que je trouve une réponse plus prudente.")], { stats: { audace: 1 }, affection: 11, trust: 8, desire: 11, confluence: 6 }),
  ], true),

  // BELLIRITH
  routeScene("bellirith", 0, 7, "Une offre et trois limites", "forbidden", "forbidden_forest", "seductive", [
    line("Narration", "Bellirith vous attend dans une clairière où les arbres forment un cercle trop parfait. Son sourire promet des ennuis avec une franchise presque courtoise."),
    line("Bellirith", "On m’a dit de ne pas vous séduire. Ce genre d’interdiction manque cruellement de précision."),
    line("Bellirith", "Établissons donc trois limites avant de nous amuser : pas de magie sur votre volonté, pas de dette cachée, et un non met fin au jeu. Ajoutez la vôtre."),
  ], [
    choice("b0-l", "« Pas de mensonge sur votre identité ou vos intentions. »", "lucidite", [line("Bellirith", "Exigeant. Je peux garder mes secrets, mais pas les déguiser en vérités."), line("Narration", "Elle reformule les quatre règles mot pour mot.")], { stats: { lucidite: 1 }, trust: 7, affection: 3, confluence: 3 }),
    choice("b0-s", "« Chacun peut partir sans justification. »", "sangFroid", [line("Bellirith", "Une porte ouverte rend ceux qui restent tellement plus intéressants."), line("Narration", "Elle recule d’un pas pour vous laisser physiquement le choix du chemin.")], { stats: { sangFroid: 1 }, trust: 6, affection: 4, confluence: 3 }),
    choice("b0-a", "« Pas de faux compliment. Si vous me voulez, soyez précise. »", "audace", [line("Bellirith", "Très bien. J’aime votre aplomb, votre bouche quand elle me contredit, et le fait que vous trembliez sans reculer."), line("Narration", "Elle sourit lorsque vous refusez de détourner les yeux.")], { stats: { audace: 1 }, affection: 6, desire: 4, trust: 3, confluence: 3 }),
  ]),
  routeScene("bellirith", 1, 11, "Le désir sans sortilège", "akuhn", "alcove", "teasing", [
    line("Narration", "Dans une alcôve d’Akuhn’Nabad, Bellirith dépose devant vous une fiole de parfum enchanté puis la réduit en poussière."),
    line("Bellirith", "Voilà ce que mon peuple appelle faciliter la conversation. J’appelle cela gagner sans savoir si l’on a été choisi."),
    line("Bellirith", "Je préfère votre désir compliqué, volontaire et terriblement lent."),
  ], [
    choice("b1-r", "Examiner avec elle les traces de magie pour confirmer qu’aucune ne subsiste.", "resonance", [line("Bellirith", "Vous vérifiez au lieu de croire ma belle voix. Je crois que je suis charmée — naturellement, cette fois."), line("Narration", "Elle vous laisse inspecter jusqu’au dernier filament.")], { stats: { resonance: 1 }, trust: 8, affection: 4, desire: 3, confluence: 4 }),
    choice("b1-l", "« Le consentement n’est pas un obstacle au désir. Il est ce qui lui donne un sens. »", "lucidite", [line("Bellirith", "Vous rendez la morale presque séduisante."), line("{player}", "Presque ?"), line("Bellirith", "Je tiens à conserver un peu de travail pour plus tard.")], { stats: { lucidite: 1 }, trust: 7, affection: 5, desire: 3, confluence: 3 }),
    choice("b1-a", "« Lent ne veut pas dire timide. Puis-je vous embrasser ? »", "audace", [line("Bellirith", "Oui."), line("Narration", "La réponse vient sans artifice. Le baiser aussi, bref et assez intense pour ressembler à une promesse qu’aucun sort n’impose.")], { stats: { audace: 1 }, trust: 4, affection: 7, desire: 7, confluence: 3 }),
  ]),
  routeScene("bellirith", 2, 15, "Celle qui reste quand le masque tombe", "algratal", "alcove", "cold", [
    line("Narration", "Bellirith a quitté le bal avant minuit. Dans l’alcôve, son sourire s’efface dès qu’elle comprend que vous l’avez suivie."),
    line("Bellirith", "Les mortels aiment la démone tant qu’elle joue leur fantasme. Ils s’ennuient rapidement de la femme qui doute, jalouse ou demande qu’on reste."),
    line("Bellirith", "Vous pouvez retourner à la fête. Je ne transformerai pas votre départ en tragédie."),
  ], [
    choice("b2-s", "Vous asseoir à distance. « Je peux partir. Ce soir, je préfère rester. »", "sangFroid", [line("Narration", "Bellirith vous observe longtemps, privée de toute chaîne à dénoncer."), line("Bellirith", "Vous rendez le choix plus intime que toutes mes provocations.")], { stats: { sangFroid: 1 }, trust: 10, affection: 6, confluence: 3 }),
    choice("b2-l", "« Vous anticipez mon rejet pour garder le contrôle de la scène. »", "lucidite", [line("Bellirith", "Cruellement exact."), line("{player}", "Je peux rester sans prétendre que vos peurs sont charmantes."), line("Narration", "Elle baisse enfin sa garde.")], { stats: { lucidite: 1 }, trust: 11, affection: 5, confluence: 3 }, { stat: "lucidite", value: 7 }),
    choice("b2-a", "« Je préfère la femme qui demande à la démone qui devine. Demandez. »", "audace", [line("Bellirith", "Restez avec moi."), line("Narration", "La demande nue lui coûte davantage que n’importe quelle séduction."), line("{player}", "Oui.")], { stats: { audace: 1 }, trust: 7, affection: 8, desire: 4, confluence: 3 }),
  ]),
  routeScene("bellirith", 3, 20, "Refuser les chaînes de Bhaal", "akuhn", "war_room", "angry", [
    line("Narration", "Un sceau de Bhaal brûle sur la table de guerre. Bellirith pourrait l’utiliser pour contraindre un bataillon démoniaque — et sauver des vies immédiatement."),
    line("Bellirith", "Il suffit d’accepter sa logique une seule fois. Commander, posséder, appeler cela nécessaire."),
    line("Bellirith", "Dites-moi de le faire et je vous obéirai. Dites-moi de ne pas le faire et je vous obéirai aussi. Voilà comme il gagne."),
  ], [
    choice("b3-l", "Refuser de choisir à sa place et chercher une troisième stratégie avec elle.", "lucidite", [line("{player}", "Je ne vous libérerai pas en devenant votre nouveau maître."), line("Bellirith", "Alors soyez mon égal·e et aidez-moi à être plus inventive que lui."), line("Narration", "Ensemble, vous retournez le sceau contre sa source.")], { stats: { lucidite: 1 }, trust: 11, affection: 6, confluence: 7 }),
    choice("b3-s", "Détruire le cadre rituel, puis lui laisser le choix d’utiliser ou non les fragments.", "sangFroid", [line("Narration", "Sans cercle, le sceau ne peut plus contraindre personne. Bellirith broie elle-même les fragments."), line("Bellirith", "Vous avez retiré l’arme, pas ma décision. Je m’en souviendrai.")], { stats: { sangFroid: 1 }, trust: 10, affection: 6, confluence: 6 }),
    choice("b3-a", "Provoquer Bhaal à travers le sceau pendant que Bellirith le sabote.", "audace", [line("Bellirith", "Votre instinct de survie est une légende très exagérée."), line("Narration", "Son sourire revient lorsque le sceau implose sans soumettre une seule volonté.")], { stats: { audace: 1 }, trust: 6, affection: 8, desire: 5, confluence: 6 }, { stat: "audace", value: 8 }),
  ]),
  routeScene("bellirith", 4, 25, "Choisie, jamais subie", "akuhn", "bedroom", "seductive", [
    line("Narration", "Bellirith a laissé tous ses bijoux enchantés dans le corridor. Dans la chambre, rien ne protège son orgueil ni n’influence votre volonté."),
    line("Bellirith", "Je ne veux pas être une épreuve que vous avez réussie, ni un danger que vous avez apprivoisé."),
    line("Bellirith", "Je veux être choisie avec mes limites, et vous choisir avec les vôtres. Dites-moi si c’est bien ce que nous faisons."),
  ], [
    choice("b4-s", "Nommer vos limites, puis lui demander les siennes une dernière fois.", "sangFroid", [line("Narration", "Bellirith répond sans ironie et accueille chacune de vos conditions."), line("Bellirith", "Alors oui. Nous nous choisissons — et nous pouvons encore changer d’avis à chaque instant.")], { stats: { sangFroid: 1 }, affection: 10, trust: 12, desire: 8, confluence: 6 }),
    choice("b4-l", "« Aucun pouvoir entre nous. Aucun rôle. Seulement ce que nous demanderons clairement. »", "lucidite", [line("Bellirith", "La clarté est indécente sur vos lèvres."), line("Narration", "Elle attend votre sourire, votre geste et votre oui avant de s’approcher.")], { stats: { lucidite: 1 }, affection: 10, trust: 11, desire: 9, confluence: 6 }, { stat: "lucidite", value: 9 }),
    choice("b4-a", "« Je vous choisis, Bellirith. Maintenant cessez de me faire attendre. »", "audace", [line("Bellirith", "Avec plaisir. Mais jamais sans votre prochain oui."), line("Narration", "Son baiser garde sa promesse : intense, libre et parfaitement humain dans sa vulnérabilité.")], { stats: { audace: 1 }, affection: 12, trust: 8, desire: 11, confluence: 6 }),
  ], true),

  // AMANEA · Reine Noire vivante dans cette chronologie alternative
  routeScene("amanea", 0, 8, "Audience sous les feux verts", "akuhn", "throne_room", "away", [
    line("Narration", "Dans la salle du trône d’Akuhn’Nabad, Amanea vous reçoit entourée de gardes obscurcis. Allenna demeure à sa droite ; le sceau de Saidin qui vous a permis d’entrer repose, brisé, sur la table."),
    line("Amanea", "Une personne surgit d’une autre temporalité, se réveille dans le palais de ma sœur puis demande à entrer chez son ennemie. Soit tu es inconscient·e, soit quelqu’un écrit une très mauvaise provocation."),
    line("Narration", "Elle est parfaitement vivante. Sa magie verte parcourt sa peau sans transparence ni faiblesse, et son autorité ne dépend d’aucun ancrage."),
    line("Amanea", "Explique-moi pourquoi la fracture de ton portail porte une couture semblable au pacte d’Alamma. Ensuite, je déciderai si tu quittes cette salle comme invité·e, prisonnier·e… ou partenaire utile."),
  ], [
    choice("a0-r", "Laisser Amanea examiner la signature du portail sans lui céder votre volonté.", "resonance", [line("{player}", "Vous pouvez lire la fracture. Pas décider de ce qu’elle fera de moi."), line("Amanea", "Une limite posée devant mon trône, avec mes gardes autour de toi. Allenna, retiens cette personne : elle comprend mieux la diplomatie que la moitié des ambassadeurs."), line("Narration", "Sa magie effleure la vôtre, précise et retenue. Elle respecte la frontière annoncée.")], { stats: { resonance: 1 }, affection: 3, trust: 8, confluence: 6, flags: ["story-amanea-met"] }),
    choice("a0-l", "Présenter les faits sans prétendre comprendre le pacte d’Alamma.", "lucidite", [line("{player}", "Le passage était emprunté, défectueux et lié à une temporalité que j’ai oubliée. La ressemblance avec Alamma vient de vous, pas de mes souvenirs."), line("Amanea", "Tu sais distinguer ignorance et mensonge. C’est assez rare pour justifier que je diffère ton interrogatoire."), line("Allenna", "Ce qui, dans sa bouche, constitue presque un accueil.")], { stats: { lucidite: 1 }, affection: 2, trust: 9, confluence: 5, flags: ["story-amanea-met"] }),
    choice("a0-s", "Demander les règles d’Akuhn’Nabad avant d’accepter toute coopération.", "sangFroid", [line("Amanea", "Tu ne réclames ni ma confiance ni ma protection. Bien."), line("{player}", "Je veux savoir ce qui mettrait votre peuple en danger."), line("Amanea", "Révéler à l’Empire ce que tu vois ici. Prononcer le nom de Naïah devant ma cour sans y être invité·e. Et confondre ma discrétion avec de la peur.")], { stats: { sangFroid: 1 }, affection: 4, trust: 7, confluence: 5, flags: ["story-amanea-met"] }),
  ]),
  routeScene("amanea", 1, 8, "L’héritière choisie", "akuhn", "war_room", "thinking", [
    line("Narration", "Dans la salle de guerre, Allenna achève seule un rapport sur les défenses de la cité. Amanea corrige un chiffre, refuse trois excuses et valide le plan sans modifier sa conclusion."),
    line("Amanea", "Allenna croit encore que je ne vois que ses erreurs. C’est faux. Je vois surtout tout ce qu’elle dirige déjà sans avoir besoin de mon ombre sur son épaule."),
    line("Narration", "La porte se referme derrière son héritière. La fierté d’Amanea apparaît alors, entière et presque embarrassante pour une reine qui préfère inspirer la crainte."),
    line("Amanea", "Elle sera meilleure que moi si j’accepte de ne pas faire de son règne une copie du mien. Voilà une leçon que les mères apprennent généralement avant de gouverner une nation."),
  ], [
    choice("a1-a", "Lui faire remarquer qu’elle vient de sourire après le départ d’Allenna.", "audace", [line("Amanea", "Je n’ai pas souri."), line("{player}", "Naturellement. Le visage de la Reine Noire a simplement célébré une victoire sans autorisation."), line("Narration", "Son rictus devient un rire bref."), line("Amanea", "Répète cela devant elle et je nierai sous serment. Mais oui : je suis fière d’elle.")], { stats: { audace: 1 }, affection: 8, trust: 5, desire: 2, confluence: 5, flags: ["story-allenna-heir"] }),
    choice("a1-l", "Lui demander comment préparer Allenna sans choisir son avenir à sa place.", "lucidite", [line("Amanea", "En lui donnant toutes les armes, y compris celles qui pourront un jour servir à me contredire."), line("{player}", "Et si elle choisit une paix que vous jugez dangereuse ?"), line("Amanea", "Alors mon devoir sera de l’avertir. Pas de redevenir reine à sa place avant même qu’elle le soit devenue.")], { stats: { lucidite: 1 }, affection: 5, trust: 10, confluence: 6, flags: ["story-allenna-heir"] }),
    choice("a1-r", "Comparer l’autorité d’Allenna à la stabilité propre de sa signature magique.", "resonance", [line("Narration", "La magie d’Allenna demeure dans la pièce : moins écrasante que celle d’Amanea, mais plus souple, déjà indépendante."), line("Amanea", "Tu la perçois sans la mesurer contre moi. Garde cette lecture. Trop de cours détruisent leurs héritiers en les traitant comme des versions incomplètes du souverain."), line("Narration", "Elle vous confie l’accès à une partie des archives réservées à sa fille.")], { stats: { resonance: 1 }, affection: 6, trust: 8, confluence: 8, flags: ["story-allenna-heir"] }),
  ]),
  routeScene("amanea", 2, 8, "La fille qu’elle fait chasser", "forbidden", "forbidden_forest", "sad", [
    line("Narration", "Amanea a quitté Akuhn’Nabad sous une cape sans emblème. Elle s’arrête à la limite exacte de la clairière de Naïah ; les gardes obscurcis restent plusieurs lieues derrière."),
    line("Naïah", "La grande Reine Noire vient vérifier que son ordre est toujours appliqué ? Je peux te faciliter la tâche : oui, mère, je suis encore parfaitement chassée."),
    line("Amanea", "Je ne te demanderai pas de croire que je n’avais pas le choix. Je te demanderai seulement de croire que cette décision me coûte chaque jour."),
    line("Naïah", "Alors dis-moi pourquoi."),
    line("Narration", "Amanea se tait. Ce secret semble protéger quelque chose, mais sa protection ressemble exactement à la blessure qu’elle inflige."),
  ], [
    choice("a2-l", "Dire à Amanea qu’un secret protecteur doit avoir une limite et un terme.", "lucidite", [line("{player}", "Si la vérité met Naïah en danger, dites au moins ce qui doit changer pour qu’elle puisse l’entendre."), line("Amanea", "Lorsque le pacte d’Alamma ne pourra plus utiliser son existence comme une porte."), line("Naïah", "Ce n’est pas une réponse. Mais c’est enfin une direction."), line("Narration", "Amanea vient de révéler davantage qu’elle ne l’avait prévu.")], { stats: { lucidite: 1 }, affection: 6, trust: 11, confluence: 7, flags: ["story-naiah-witness"] }),
    choice("a2-s", "Maintenir la distance et refuser de transformer cette visite en réconciliation forcée.", "sangFroid", [line("Narration", "Vous restez entre elles sans devenir une barrière. Amanea ne franchit pas la limite ; Naïah ne lui offre aucun pardon."), line("Naïah", "Tu peux revenir au seuil. Pas entrer."), line("Amanea", "J’accepte."), line("Narration", "Pour une reine habituée à imposer les frontières, accepter celle de sa fille constitue déjà un bouleversement.")], { stats: { sangFroid: 1 }, affection: 5, trust: 12, confluence: 8, flags: ["story-naiah-witness"] }),
    choice("a2-a", "Accuser Amanea d’utiliser sa douleur pour éviter de rendre des comptes.", "audace", [line("{player}", "Votre peine ne donne aucune réponse à Naïah. Elle vous permet seulement de souffrir en gardant le contrôle."), line("Amanea", "Tu choisis un moment remarquable pour me défier."), line("Naïah", "Moi, je trouve le moment parfait."), line("Narration", "La colère d’Amanea retombe avant de devenir un ordre."), line("Amanea", "Alors je reviendrai avec une réponse que je pourrai réellement donner.")], { stats: { audace: 1 }, affection: 9, trust: 7, confluence: 7, flags: ["story-naiah-witness"] }),
  ]),
  routeScene("amanea", 3, 8, "L’alliance que l’Empire ne verra pas", "akuhn", "deep_archives", "menacing", [
    line("Narration", "Dans les Archives profondes, une copie du pacte d’Alamma repose à côté des relevés de votre portail. Iriana écoute à travers un miroir sans tain ; Amanea refuse qu’une princesse impériale entre physiquement dans sa cité."),
    line("Amanea", "Nous poursuivons le même ennemi sans devenir alliées aux yeux de nos peuples. Tia ne doit pas pouvoir présenter ma coopération comme une soumission, et mes sujets ne doivent pas croire que j’ouvre nos portes à l’Empire."),
    line("Iriana", "Je n’ai demandé ni trône ni bannière. Seulement la clause qui permettrait de révoquer le pacte de mon père."),
    line("Amanea", "Et cette clause emprunte la même couture que ton portail. La partager peut libérer Iriana, protéger Naïah… ou offrir à Alamma un chemin jusqu’à ta temporalité perdue."),
  ], [
    choice("a3-r", "Séparer la signature du portail de celle du pacte avant de transmettre la clause.", "resonance", [line("Narration", "Vous accordez les deux coutures sans les fusionner. Iriana reçoit les mots nécessaires ; la route vers votre passé demeure illisible pour le démon."), line("Amanea", "Proches sans devenir une seule chose. Une architecture que les pactes comprennent mal."), line("Iriana", "Et une alliance que personne ne pourra posséder entièrement.")], { stats: { resonance: 1 }, affection: 7, trust: 12, confluence: 12, flags: ["story-pact-clause"] }, { stat: "resonance", value: 9 }),
    choice("a3-s", "Établir des règles de partage avant de laisser quiconque toucher au document.", "sangFroid", [line("{player}", "Aucune copie complète. Chaque personne garde seulement la partie dont elle a besoin."), line("Amanea", "Une confiance construite avec des limites vérifiables. J’approuve."), line("Iriana", "Moi aussi. Ce qui constitue probablement le premier accord entre nous qui ne soit pas une menace différée."), line("Narration", "Le réseau de savoir devient une coopération, pas une nouvelle centralisation du pouvoir.")], { stats: { sangFroid: 1 }, affection: 6, trust: 13, confluence: 10, flags: ["story-pact-clause"] }),
    choice("a3-a", "Utiliser la clause comme un leurre et laisser Bellirith attirer le regard du démon ailleurs.", "audace", [line("Bellirith", "Enfin un plan où ma mauvaise influence devient un service public."), line("Narration", "Pendant qu’elle provoque une fausse rupture du pacte, Amanea transmet à Iriana les véritables lignes par un second miroir."), line("Amanea", "Je déteste la méthode."), line("Bellirith", "Mais pas le résultat."), line("Amanea", "Ne confonds pas mon silence avec un compliment.")], { stats: { audace: 1 }, affection: 9, trust: 8, desire: 3, confluence: 11, flags: ["story-pact-clause"] }, { stat: "audace", value: 9 }),
  ]),
  routeScene("amanea", 4, 8, "La reine et la femme", "akuhn", "terrace", "smile", [
    line("Narration", "Sur la terrasse d’Akuhn’Nabad, Amanea vient de confier la cour du lendemain à Allenna. Ce n’est ni une abdication ni une épreuve : seulement une première journée où son héritière gouvernera sans correction immédiate."),
    line("Amanea", "Je reste reine. Je ne vais pas prétendre que l’amour, la famille ou ta présence ont soudain rendu le pouvoir inutile. Mais je refuse désormais qu’il soit la seule forme sous laquelle les autres puissent me rencontrer."),
    line("Amanea", "Naïah me déteste et je dois encore mériter le droit de lui donner une réponse. Allenna me succédera sans devenir moi. Tia reste mon ennemie, même si une part de moi se souvient qu’elle fut ma sœur avant d’être l’Empire."),
    line("Amanea", "Et je te désire. Pas comme agent, sujet ou garantie contre Alamma. Comme la personne assez insupportable pour me contredire dans ma propre salle du trône. Dis-moi ce que tu veux, même si ce n’est pas moi."),
  ], [
    choice("a4-l", "Choisir une relation qui n’efface ni son règne ni votre liberté future.", "lucidite", [line("{player}", "Je vous choisis sans devenir votre sujet, et sans vous demander de cesser d’être reine pour me rassurer."), line("Amanea", "Enfin une déclaration digne de confiance."), line("Narration", "Elle prend votre visage entre ses mains et attend votre mouvement avant le premier baiser."), line("Amanea", "Alors rencontrons-nous encore. Chaque fois comme un choix neuf, même lorsque ma cour préférera y voir un serment.")], { stats: { lucidite: 1 }, affection: 12, trust: 12, desire: 8, confluence: 10, flags: ["story-amanea-alliance"] }, { stat: "lucidite", value: 10 }),
    choice("a4-s", "Lui offrir un lien profond qui n’a pas besoin de devenir amoureux.", "sangFroid", [line("{player}", "Je veux rester dans votre vie. Je ne veux pas transformer cette proximité en désir pour qu’elle compte."), line("Amanea", "Tu refuses même le rôle séduisant de la personne qui devient l’amant·e secret·ète de la Reine Noire."), line("Narration", "Son sourire se fait doux, sans amertume."), line("Amanea", "Très bien. Reste comme mon égal·e et mon ami·e. Une relation que ma cour ne saura pas classer me paraît presque plus dangereuse.")], { stats: { sangFroid: 1 }, affection: 10, trust: 14, confluence: 10, flags: ["story-amanea-alliance", "amanea-platonic"] }),
    choice("a4-a", "L’embrasser après un oui explicite et accepter le risque politique de cette relation.", "audace", [line("{player}", "Je vous veux, Amanea. Pas votre trône, pas votre protection. Puis-je vous embrasser ?"), line("Amanea", "Oui."), line("Narration", "Le baiser est prudent une seconde, féroce la suivante, puis s’arrête dès que vos souffles exigent une nouvelle question."), line("Amanea", "Tu viens de choisir la femme. La reine devra apprendre à ne pas convoquer le Conseil pendant nos rendez-vous.")], { stats: { audace: 1 }, affection: 13, trust: 9, desire: 12, confluence: 10, flags: ["story-amanea-alliance"] }),
  ], true),

  // DRAVEN · route narrative non romantique, vivant et en mission diplomatique
  routeScene("draven", 0, 5, "Le départ de l’Amiral", "forthaven", "forthaven", "surprised", [
    line("Narration", "Sur les quais, Draven vérifie lui-même les caisses de la délégation qui partira pour le continent. Lineva lui tend un dernier rapport sans parvenir à cacher son désaccord avec ce voyage."),
    line("Draven", "Vous n’êtes pas de ma garnison. C’est peut-être utile : chaque officier ici essaie de me convaincre que demander l’aide de l’Empire est une humiliation."),
    line("Draven", "Je m’appelle Draven Frostdrim. Forthaven manque d’hommes, de vivres et de temps. Ma fierté n’arrêtera aucun mort-vivant, alors je vais négocier avec ceux qui peuvent nous aider."),
  ], [
    choice("d0-s", "Lui demander quelle relève protégera Lineva pendant son absence.", "sangFroid", [line("Draven", "Deux capitaines, un conseil civil et des ordres qui expirent au troisième jour au lieu de devenir une seconde ombre sur son épaule."), line("Lineva", "Il a fallu trois disputes pour obtenir cette dernière clause."), line("Draven", "Elle a gagné les trois.")], { stats: { sangFroid: 1 }, trust: 9, affection: 3, confluence: 4, flags: ["story-draven-departed"] }),
    choice("d0-l", "Reconnaître que partir chercher de l’aide est aussi une manière de défendre la ville.", "lucidite", [line("{player}", "Vous ne quittez pas le front. Vous attaquez le problème depuis une autre route."), line("Draven", "Exact. Mais dites-le aussi à ma fille lorsque je serai trop loin pour recevoir sa réponse immédiatement."), line("Lineva", "Je l’ai entendu. Je ne promets pas d’être d’accord.")], { stats: { lucidite: 1 }, trust: 10, affection: 4, confluence: 4, flags: ["story-draven-departed"] }),
    choice("d0-a", "« Si l’Empire refuse, ramenez au moins sa réponse par écrit. »", "audace", [line("Draven", "Vous supposez déjà qu’ils diront non."), line("{player}", "Je suppose surtout qu’un refus officiel se transforme plus facilement en levier politique qu’une porte fermée."), line("Draven", "Vous auriez fait une recrue insupportable. Montez dans le convoi.")], { stats: { audace: 1 }, trust: 7, affection: 5, confluence: 4, flags: ["story-draven-departed"] }),
  ]),
  routeScene("draven", 1, 5, "Les nouvelles du camp", "imperial-road", "camp", "gruff", [
    line("Narration", "Au camp de la route impériale, un messager remet à Draven trois rapports de Lineva : pertes limitées, mur est stabilisé, aucune plainte personnelle."),
    line("Draven", "Elle écrit comme moi lorsque je veux empêcher quelqu’un de deviner que j’ai peur. Des faits impeccables, et pas un mot sur la personne qui les porte."),
    line("Draven", "Je peux lui répondre en amiral ou en père. J’ai l’impression de toujours sacrifier l’un lorsque j’essaie d’être l’autre."),
  ], [
    choice("d1-l", "Lui faire répondre d’abord à ce que Lineva n’a pas écrit.", "lucidite", [line("{player}", "Dites-lui que vous savez que tenir lui coûte, même lorsque le rapport est bon."), line("Draven", "Pas d’ordre. Pas de conseil. Seulement : je sais."), line("Narration", "Il écrit lentement cette phrase avant le compte rendu diplomatique.")], { stats: { lucidite: 1 }, trust: 11, affection: 4, confluence: 4, flags: ["story-draven-letter"] }),
    choice("d1-s", "Séparer la lettre du père du rapport de l’Amiral.", "sangFroid", [line("Draven", "Deux enveloppes."), line("{player}", "Elle ouvrira chacune lorsqu’elle aura besoin de l’un ou de l’autre."), line("Draven", "Une bonne frontière. J’aurais dû la lui offrir plus tôt.")], { stats: { sangFroid: 1 }, trust: 12, affection: 3, confluence: 4, flags: ["story-draven-letter"] }),
    choice("d1-a", "L’obliger à commencer par « Ma fille » plutôt que « Commandante ».", "audace", [line("Draven", "Vous aimez les opérations difficiles."), line("Narration", "Il reste longtemps devant la feuille, puis écrit les deux mots."), line("Draven", "Ma fille. Forthaven peut attendre la seconde phrase.")], { stats: { audace: 1 }, trust: 8, affection: 6, confluence: 4, flags: ["story-draven-letter"] }),
  ]),
  routeScene("draven", 2, 5, "L’aide qui se marchande", "algratal", "algratal_council", "stern", [
    line("Narration", "Au Conseil impérial, les cartes de Forthaven sont couvertes de chiffres. Un conseiller propose des renforts en échange d’un contrôle impérial durable sur le port."),
    line("Draven", "Ils offrent des soldats aujourd’hui pour posséder nos quais demain. Refuser peut coûter des vies. Accepter peut transformer la ville que nous sauvons en autre chose."),
    line("Draven", "Je veux une troisième réponse. Donnez-moi les faits, pas ce qu’un patriote de Forthaven aimerait entendre."),
  ], [
    choice("d2-l", "Dissocier l’accès commercial du commandement militaire.", "lucidite", [line("{player}", "Négociez des entrepôts et des droits temporaires, jamais la chaîne de commandement."), line("Draven", "Ils gagnent un intérêt à notre survie sans obtenir nos remparts."), line("Iriana", "Une proposition que le Conseil pourra vendre comme une victoire. J’appuierai ce texte.")], { stats: { lucidite: 1 }, trust: 10, affection: 5, confluence: 4 }),
    choice("d2-s", "Fixer une clause d’expiration et un retrait automatique des troupes.", "sangFroid", [line("Draven", "Aucune occupation ne survivra juridiquement à l’urgence qui la justifie."), line("{player}", "Et Lineva contrôlera seule le déclenchement du retrait."), line("Draven", "Bien. Sa ville, sa décision.")], { stats: { sangFroid: 1 }, trust: 11, affection: 3, confluence: 4 }),
    choice("d2-a", "Menacer de rendre public le prix réel exigé par l’Empire.", "audace", [line("{player}", "Que préférera la cour : un accord honorable ou expliquer pourquoi elle a voulu acheter une ville assiégée ?"), line("Draven", "Vous auriez fait une très mauvaise recrue."), line("Iriana", "Et un négociateur remarquablement utile."), line("Narration", "Le conseiller demande une suspension de séance.")], { stats: { audace: 1 }, trust: 8, affection: 6, confluence: 4 }),
  ]),
  routeScene("draven", 3, 5, "Le père loin du port", "algratal", "bedroom", "gruff", [
    line("Narration", "Dans les appartements d’hôtes, Draven a retiré son manteau et ses insignes. La réponse de Lineva vient d’arriver : elle envisage de rejoindre Al’Gratal pour défendre elle-même le dossier de Forthaven."),
    line("Draven", "Mon premier réflexe est de lui interdire la route. Le second est de lui rappeler tout ce qui peut mal tourner. Les deux ressemblent à des ordres déguisés en inquiétude."),
    line("Draven", "Je sais parler à des soldats, à un conseil et à une ville assiégée. Je dois apprendre à parler à une fille adulte qui n’a pas besoin de ma permission."),
  ], [
    choice("d3-l", "Lui faire distinguer conseil, peur et décision.", "lucidite", [line("Draven", "Conseil : voyager avec une escorte réduite mais expérimentée. Peur : ne pas être là si quelque chose arrive. Décision : la sienne."), line("Narration", "Il relit la réponse et retire la phrase qui commençait par ‘je t’interdis’."), line("Draven", "C’est plus difficile que rédiger un traité.")], { stats: { lucidite: 1 }, trust: 12, affection: 6, confluence: 5 }),
    choice("d3-s", "Lui laisser le temps de trouver une phrase qui ne demande rien à sa fille.", "sangFroid", [line("Narration", "Il reste longtemps silencieux."), line("Draven", "Je te fais confiance. Dis-moi seulement quand tu pars, et ce dont tu as besoin."), line("Narration", "Il acquiesce une fois. La phrase ne contient ni mission ni condition.")], { stats: { sangFroid: 1 }, trust: 13, affection: 4, confluence: 5 }),
    choice("d3-a", "« Essayez : je suis inquiet, et ce n’est pas un ordre. »", "audace", [line("Draven", "Je suis inquiet, et ce n’est pas un ordre."), line("Narration", "Les mots paraissent presque trop simples pour sa voix grave."), line("Draven", "C’est tout ?"), line("{player}", "Vous pouvez ajouter que vous serez heureux de la voir."), line("Draven", "N’exigez pas deux miracles diplomatiques le même soir.")], { stats: { audace: 1 }, trust: 9, affection: 8, confluence: 5 }),
  ]),
  routeScene("draven", 4, 5, "Le retour au port", "forthaven", "forthaven", "approving", [
    line("Narration", "Le navire de Draven entre dans le port avec les premiers renforts et l’accord impérial scellé. Lineva l’attend sur le quai, entourée d’officiers qu’elle a choisis elle-même."),
    line("Lineva", "Forthaven a tenu sans toi."),
    line("Draven", "Je le vois."),
    line("Lineva", "Et je suis heureuse que tu sois revenu. Les deux phrases sont vraies. Essaie de ne pas en transformer une en reproche."),
    line("Narration", "Draven descend la passerelle sans inspection préalable et serre sa fille dans ses bras devant toute la garnison."),
  ], [
    choice("d4-s", "Laisser leurs retrouvailles exister avant de parler de la mission.", "sangFroid", [line("Narration", "Personne ne réclame immédiatement le traité. Draven et Lineva restent simplement enlacés pendant que les cloches du port annoncent le retour."), line("Draven", "Le rapport attendra."), line("Lineva", "Je veux une copie de cette phrase."), line("Narration", "Leur rire commun vaut davantage que n’importe quelle cérémonie.")], { stats: { sangFroid: 1 }, trust: 14, affection: 7, confluence: 8, flags: ["story-draven-returned"] }),
    choice("d4-l", "Souligner que Forthaven a gagné de l’aide sans perdre son autonomie.", "lucidite", [line("{player}", "Les renforts repartiront, la ville gardera son commandement et Lineva siège dans le comité qui contrôle l’accord."), line("Draven", "Une victoire qu’elle a améliorée depuis Forthaven."), line("Lineva", "Et que tu as accepté de me laisser améliorer."), line("Narration", "Le compliment passe de l’Amiral à la Commandante sans devenir une dette.")], { stats: { lucidite: 1 }, trust: 13, affection: 8, confluence: 8, flags: ["story-draven-returned"] }),
    choice("d4-a", "Lever la boussole : « Permission de prendre un jour de repos, Amiral. »", "audace", [line("Draven", "Refusée."), line("Lineva", "Ordre annulé par la commandante du port."), line("Draven", "Mutinerie familiale."), line("Narration", "Son rire bref surprend la garnison."), line("Lineva", "Bienvenue chez toi, père.")], { stats: { audace: 1 }, trust: 10, affection: 10, confluence: 8, flags: ["story-draven-returned"] }),
  ]),
];

export const INTRO_SCENE: DialogueLine[] = [
  line("Narration", "Votre dernier souvenir n’est pas un visage, ni un lieu. C’est votre main posée sur l’armature froide d’un portail emprunté — un passage qui devait vous reconduire dans votre propre temporalité."),
  line("Narration", "Puis le mécanisme se détraque. Les runes s’allument dans le désordre, plusieurs ciels se superposent et un bruit blanc emporte jusqu’au sens du mot « retour »."),
  line("Narration", "Vous reprenez connaissance dans une chambre inconnue. Au-delà des rideaux, une cité dorée s’étage sous la lumière du matin. Un homme est assis près de la fenêtre, seul, une montre fermée dans la paume."),
  line("Saidin", "Ne vous redressez pas trop vite. Vous êtes à Al’Gratal, dans une chambre d’hôte du palais. Personne d’autre ne viendra vous interroger avant que vous l’ayez décidé."),
  line("Saidin", "Je m’appelle Saidin. C’est moi qui vous ai tiré du portail lorsqu’il s’est ouvert au-dessus de la ville — ou, plus exactement, lorsqu’il a tenté de s’ouvrir dans plusieurs versions de la ville à la fois."),
  line("Narration", "Vous cherchez un nom de pays, une maison, une voix familière. Rien ne vient. Votre nom demeure ; derrière lui, votre passé n’est qu’une porte sans poignée."),
  line("Saidin", "Votre signature ne correspond à aucune temporalité de Sylvinia que je puisse reconnaître. Je vois des traces incompatibles, comme si le passage avait effacé la route tout en vous laissant arriver."),
  line("Saidin", "Je ne vais pas prétendre savoir d’où vous venez. Je ne sais pas davantage restaurer vos souvenirs, et toute certitude que je vous offrirais maintenant serait un mensonge élégant."),
  line("Saidin", "Cette Sylvinia possède elle aussi une absence. Hylee a rencontré Remerii à l’Auberge du Forestier et l’a suivie sur les routes. Iriana cherche toujours à défaire le pacte de son père. Draven vogue vers le continent. Amanea règne encore sur Akuhn’Nabad."),
  line("Saidin", "Tout devait conduire Iriana à rassembler ces personnes. Pourtant, elle ne l’a pas fait. Aucune invitation perdue, aucun refus : la décision elle-même semble manquer. Pourquoi une histoire oublierait-elle son propre commencement ?"),
  line("Narration", "Vous lui demandez si votre arrivée a provoqué cette divergence. Saidin incline légèrement la tête, comme si votre question en contenait une autre qui l’intéressait davantage."),
  line("Saidin", "Êtes-vous la cause d’une route différente… ou la personne qu’elle a créée pour continuer malgré ce qui manque ?"),
  line("Narration", "Saidin pose sa montre sur la table, cadran contre le bois. Le geste ressemble moins à une précaution qu’à une promesse de rester dans le présent avec vous."),
  line("Saidin", "Vous pouvez demeurer ici le temps qu’il faudra. Al’Gratal vous donnera une chambre, des papiers provisoires et la liberté de choisir la place que vous souhaitez construire. Votre passé manque ; votre volonté, elle, est toujours là."),
  line("Saidin", "Quand vous serez prêt·e, je vous montrerai la ville. Ensuite, les rencontres vous appartiendront. Je peux vous aider à comprendre ce monde — mais je ne choisirai pas à votre place la personne que vous y deviendrez."),
];

export const INTIMACY_TEXT: Record<string, Record<"tendre" | "suggestif" | "explicite" | "ellipse", string[]>> = {
  hylee: {
    tendre: ["Hylee vous embrasse avec un petit rire nerveux, puis enfouit son visage contre votre épaule. Vous restez enlacé·es, à parler jusqu’à ce que la lune quitte la fenêtre."],
    suggestif: ["Chaque geste reste une question et chaque réponse, clairement donnée. Les bijoux de givre rejoignent la table, vos vêtements le dossier d’une chaise, et la chambre se couvre d’un froid doux qui ne blesse personne.", "Plus tard, Hylee trace un flocon sur votre peau du bout du doigt et sourit de l’avoir choisi, elle aussi."],
    explicite: ["Hylee vous demande de répéter votre oui avant de soulever votre chemise. Ses lèvres suivent lentement votre ventre tandis que ses doigts apprennent ce qui vous fait frissonner ; quand vous la guidez, elle répond par un sourire essoufflé et recommence exactement comme vous le lui avez demandé.", "Vous la déshabillez à votre tour, sans presser les gestes. Le givre fleurit sur les draps lorsque votre bouche descend entre ses cuisses. Hylee agrippe votre main, nomme ce qu’elle veut — plus lentement, puis plus fort — jusqu’à ce que son corps se tende et qu’une neige fine éclate autour du lit.", "Elle rit encore, haletante, puis vous attire contre elle. Vos corps se cherchent longuement, vos mains et vos bouches se répondent, et chaque nouvelle envie est dite à voix haute. Rien n’est caché par une ellipse : seulement deux adultes attentif·ves, le plaisir partagé et les flocons qui fondent sur vos peaux."],
    ellipse: ["Hylee vérifie encore une fois votre accord. La porte reste déverrouillée, la lumière baisse, et la chronique laisse le reste à votre intimité."],
  },
  remerii: {
    tendre: ["Remerii pose son front contre le vôtre. Pour une fois, elle ne corrige rien. Vous vous endormez main dans la main, ses bijoux parfaitement alignés près du lit."],
    suggestif: ["La précision de Remerii devient une attention offerte plutôt qu’un contrôle. Elle vous demande, écoute, s’arrête quand votre souffle change, puis reprend seulement sur un oui.", "L’Arcane tamise les lampes. Son ironie se dissout dans une tendresse qu’elle n’a plus besoin de discipliner."],
    explicite: ["Remerii vous fait asseoir au bord du lit et vous demande, sans détour, où vous voulez ses mains. Elle délace vos vêtements avec une lenteur méthodique, embrasse votre poitrine puis votre ventre, et vérifie votre regard avant de glisser plus bas.", "Sa bouche vous donne du plaisir avec la même attention qu’elle accorde à un sort délicat : elle écoute chaque souffle, ajuste la pression de sa langue et s’arrête seulement pour vous faire formuler ce que vous désirez. Lorsque vous jouissez, elle reste contre vous jusqu’à ce que vos jambes cessent de trembler.", "Vous inversez ensuite les rôles. Remerii perd enfin sa diction parfaite sous vos doigts et votre bouche ; ses ordres deviennent des demandes, puis votre prénom. L’Arcane maintient une lumière douce tandis que vous la faites jouir à son tour, sans raccourci ni voile, avant qu’elle ne vous attire contre elle pour recommencer plus lentement."],
    ellipse: ["Vous formulez ensemble les limites. Remerii ferme les rideaux, vous demande une dernière fois de rester, et la scène s’efface sur votre réponse."],
  },
  iriana: {
    tendre: ["Sans couronne, Iriana découvre le luxe d’être simplement tenue. Vous échangez des baisers lents et des confidences que personne ne consignera."],
    suggestif: ["Iriana dit ce qu’elle veut d’une voix d’abord trop formelle, puis de plus en plus libre. Le velours, les bijoux déposés et vos souffles deviennent les seuls témoins d’une nuit sans ordre.", "Au matin, la couronne est toujours au sol. Sa main, elle, reste dans la vôtre."],
    explicite: ["Iriana verrouille les dossiers, pas la porte, puis vous explique précisément ce qu’elle veut. Vous retirez sa robe et ses bijoux à sa demande ; sous vos baisers, sa voix officielle se brise lorsque vos doigts glissent entre ses cuisses et trouvent le rythme qu’elle vous indique.", "Elle vous maintient près d’elle, jambes ouvertes, et ne dissimule ni ses gémissements ni la façon dont son bassin vient chercher votre main. Vous continuez jusqu’à sentir son plaisir la traverser, puis restez immobile pendant qu’elle reprend son souffle et confirme, avec un sourire encore tremblant, qu’elle veut vous rendre la pareille.", "Iriana explore votre corps sans protocole, de sa bouche et de ses mains, vous demande de la corriger et savoure chaque réponse honnête. La nuit se prolonge en plaisirs alternés, parfois tendres, parfois exigeants, mais toujours négociés ; au matin, sa couronne est au sol et vos corps nus sont encore emmêlés dans le velours."],
    ellipse: ["Elle éloigne elle-même la couronne, ferme la porte et vous choisit sans titre. La chronique se retire avec pudeur."],
  },
  valurn: {
    tendre: ["Valurn prétend encore plaisanter lorsque vous l’embrassez. Son masque tombe dans le silence qui suit, et il reste contre vous sans chercher de sortie."],
    suggestif: ["Aucun sceau ne se forme, aucune magie ne pèse sur vos gestes. La chaleur vient seulement de sa peau, de votre désir nommé et de cette confiance qu’il traite avec un soin presque incrédule.", "Il perd un second pari cette nuit-là : il reste jusqu’au matin."],
    explicite: ["Valurn éteint ses flammes et pose ses armes hors de portée avant de vous embrasser. Il vous déshabille avec une impatience contenue, s’arrête à chaque vêtement pour obtenir votre accord, puis parcourt votre poitrine et votre ventre de baisers qui deviennent plus avides à mesure que vous le rapprochez.", "Sa bouche descend entre vos cuisses ; son assurance moqueuse disparaît lorsqu’il se concentre sur vos réactions, alternant langue et doigts jusqu’à vous faire jouir contre lui. Il relève la tête avec un sourire fier, mais vous le renversez sur les draps avant qu’il puisse transformer l’instant en plaisanterie.", "Vous prenez le temps de découvrir ce qui fait trembler le grand parieur. Vos mains, votre bouche et vos corps se répondent sans pacte magique ni pouvoir imposé. Quand le plaisir le submerge enfin, Valurn prononce votre prénom sans masque, puis vous garde contre lui jusqu’à l’aube au lieu de chercher une sortie."],
    ellipse: ["Valurn éteint toutes ses flammes avant de vous rejoindre. La porte se ferme sur un pacte qui n’a besoin d’aucune marque."],
  },
  naiah: {
    tendre: ["Naïah renonce aux illusions pour rester simplement contre vous. Son rire se fait plus doux ; vous échangez des baisers et des vérités jusqu’à l’aube."],
    suggestif: ["La brume reste hors de la chambre. Naïah avance sans artifice, attentive à chaque hésitation et chaque oui, découvrant avec vous un désir qui n’a besoin d’ensorceler personne.", "Plus tard, elle dessine du bout des doigts une couronne invisible au-dessus de votre tête. « Celle-ci ne commande rien », murmure-t-elle."],
    explicite: ["Naïah dissipe toute illusion avant de retirer ses vêtements, vous laissant voir son corps sans artifice. Elle vous demande de la toucher comme une femme, pas comme une reine ; vos doigts suivent ses hanches, sa poitrine puis l’intérieur de ses cuisses pendant qu’elle guide votre main d’un geste étonnamment vulnérable.", "Vous l’allongez et votre bouche prend le relais. Naïah cesse bientôt de jouer : ses jambes se resserrent autour de vos épaules, ses doigts s’accrochent aux draps et elle vous demande de ne pas ralentir. Son orgasme traverse la brume, qui pulse autour du lit sans jamais toucher votre volonté.", "Elle revient ensuite vers vous, attentive et curieuse, explore votre plaisir de sa langue et de ses mains jusqu’à vous entendre perdre votre souffle. Vous recommencez, changez de rythme et de position à chaque accord murmuré. Aucun enchantement ne décide de votre désir ; tout vient de vos corps et des oui renouvelés entre deux baisers."],
    ellipse: ["Naïah dissipe elle-même la dernière illusion. Après un ultime échange de consentement, la porte se referme sur deux personnes libres de choisir la suite."],
  },
  lineva: {
    tendre: ["Lineva s’autorise enfin à ne rien diriger. Blottie contre vous, elle écoute les bruits du port et laisse la nuit suivre son propre ordre."],
    suggestif: ["Chaque geste est annoncé, accueilli ou redirigé sans gêne. La rigueur de Lineva devient une attention tendre, et sa fatigue cède peu à peu devant un désir qu’elle n’a plus à justifier.", "À l’aube, ses insignes sont encore près de la porte et son sourire ne ressemble à aucun rapport officiel."],
    explicite: ["Lineva pose son ceinturon et ses insignes près de la porte, puis vous demande de l’aider à retirer le reste. Vous embrassez les marques laissées par l’armure, massez ses épaules tendues et descendez lentement jusqu’à sa poitrine, qu’elle vous offre dans un soupir enfin débarrassé du commandement.", "Quand vos doigts glissent entre ses cuisses, elle annonce chaque sensation avec une franchise presque militaire avant que le plaisir ne brouille ses mots. Vous trouvez le rythme qu’elle réclame, l’embrassez pour étouffer son cri et continuez jusqu’à ce que ses jambes tremblent autour de votre main.", "Lineva vous attire alors sur le lit et s’occupe de vous avec la même détermination, sa bouche et ses doigts alternant jusqu’à vous faire perdre toute notion du port au-dehors. Vous échangez les rôles plusieurs fois, sans hâte ni devoir, puis elle s’endort nue contre vous tandis que l’aube éclaire ses insignes abandonnés."],
    ellipse: ["Lineva verrouille ses dossiers plutôt que la porte. Vous convenez ensemble des limites, puis la chronique s’éloigne tandis qu’elle vous rejoint."],
  },
  saidin: {
    tendre: ["Sans regarder demain, Saidin apprend la lenteur d’un baiser qui ne sera jamais répété exactement. Vous laissez la bougie se consumer et le temps faire son œuvre."],
    suggestif: ["La magie temporelle demeure silencieuse. Saidin découvre chaque geste au moment où il advient, demande, écoute et répond sans corriger la moindre maladresse.", "Le matin arrive à son heure. Il le regarde avec vous comme s’il ne l’avait jamais vu."],
    explicite: ["Saidin détourne les sabliers et renonce à connaître la suite. Il vous déshabille sans consulter aucun futur, découvrant votre peau au présent ; ses doigts hésitent, vous demandez plus de pression, et son sourire s’éclaire lorsqu’il sent votre corps répondre.", "Il vous embrasse de la gorge au ventre avant de prendre votre plaisir entre sa bouche et ses mains. Chaque réaction le surprend réellement. Vous le guidez jusqu’à l’orgasme, puis le ramenez contre vous sans lui laisser le temps d’analyser ce qui vient d’arriver.", "À votre tour, vous explorez son corps, l’entendez perdre le fil de ses phrases sous vos caresses et votre bouche. Le temps ne ralentit pas lorsque Saidin jouit ; il passe simplement, irréversible et vivant. Vous restez enlacé·es, puis recommencez parce que l’envie naît maintenant — pas parce qu’un avenir l’avait annoncé."],
    ellipse: ["Saidin détourne les sabliers et renonce à tous les futurs. Votre oui prononcé au présent est la dernière chose que la chronique révèle."],
  },
  bellirith: {
    tendre: ["Bellirith se laisse aimer sans spectacle ni enchantement. Son front contre le vôtre, elle avoue que la douceur librement donnée l’effraie plus délicieusement que le désir."],
    suggestif: ["Aucun sort n’accompagne ses caresses. Bellirith formule chaque envie, accueille chacune des vôtres et transforme sa maîtrise de la séduction en un dialogue attentif, intense et entièrement choisi.", "Lorsque le silence revient, elle vous demande de rester sans cacher sa vulnérabilité derrière un sourire."],
    explicite: ["Bellirith retire ses enchantements un à un, puis vous offre son corps sans aura surnaturelle pour infléchir votre désir. Vous la déshabillez parce que vous le voulez ; ses seins se pressent contre vos paumes, sa bouche s’ouvre sous la vôtre et elle frissonne de constater que chaque réaction vous appartient.", "Elle vous demande de lui dire exactement comment vous toucher. Sa langue et ses doigts suivent vos instructions, accélèrent lorsque vous le réclamez et vous conduisent jusqu’à l’orgasme sans aucun sort pour amplifier la sensation. La fierté dans son regard cède à une émotion plus nue quand vous lui dites que c’était elle — seulement elle.", "Vous l’allongez à votre tour, embrassez sa poitrine puis l’intérieur de ses cuisses avant de lui donner le même plaisir de votre bouche et de vos mains. Bellirith gémit sans mise en scène, demande davantage, puis jouit en serrant vos doigts. Vous continuez à vous découvrir, explicitement et sans voile, jusqu’à ce que le désir laisse place à une vulnérabilité qu’elle ne cherche plus à maquiller."],
    ellipse: ["Bellirith dépose ses derniers enchantements hors de portée. Les limites sont répétées, les consentements clairs ; la chronique ferme doucement la porte."],
  },
  amanea: {
    tendre: ["Amanea dépose sa couronne mais ne renie pas la reine qu’elle est. Elle vous embrasse sans ordre ni serment arraché à l’avenir, puis découvre avec vous la simplicité presque subversive d’une nuit qui n’a rien à prouver à sa cour."],
    suggestif: ["Amanea verrouille elle-même sa magie d’autorité avant de vous inviter plus près. Sa peau est chaude sous vos mains ; chaque hésitation interrompt le geste, chaque réponse claire lui rend une intensité que le protocole ne peut contenir.", "Plus tard, nue sous sa cape noire, elle écoute Allenna prendre la relève au-dehors et accepte que le royaume puisse attendre pendant qu’elle reste contre vous."],
    explicite: ["Amanea neutralise les enchantements de sa chambre puis défait elle-même sa cape et son armure. La reine ne commande rien : elle vous dit ce qu’elle désire, vous demande les mots qui conviennent à votre corps et attend chaque oui avant de vous attirer contre sa peau chaude.", "Vous prenez le temps de découvrir la femme derrière l’apparat. Votre bouche et vos doigts avancent selon ses demandes, ralentissent lorsqu’elle perd sa maîtrise et reprennent quand elle vous rapproche. Son plaisir ne sert ni pacte ni succession : il lui appartient, jusque dans le tremblement qui la traverse et le cri qu’elle refuse cette fois de discipliner.", "Amanea vous rejoint ensuite avec la même attention exigeante. Elle suit vos indications, adapte sa bouche et ses mains à votre corps et laisse son assurance céder devant votre plaisir partagé. Vous changez de rythme et de position sans hiérarchie imposée, jusqu’à ce que la Reine Noire puisse simplement rester nue contre vous, épuisée, vivante et libre de ne gouverner personne pendant quelques heures."],
    ellipse: ["Amanea dépose sa couronne et verrouille toute magie d’influence. Les limites sont répétées, les consentements clairs ; la chronique laisse la porte se fermer sur deux volontés également libres."],
  },
};
