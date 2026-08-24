export const SPOT_MUSIC: Record<string, string> = {
  "algratal-streets": "algratal",
  "algratal-market": "capital-market",
  "algratal-palace-audience": "algratal",
  "algratal-palace-council": "algratal",
  "algratal-music-room": "imperial-lament-instrumental",
  "algratal-ballroom": "chosen-ball",
  "algratal-palace-quarters": "marble-moon",
  "algratal-catacombs": "catacombs",

  "miraldas-dome": "miraldas",
  "miraldas-atelier": "training",
  "miraldas-archives": "mage-city",
  "miraldas-hylee-glade": "dawn-training",
  "miraldas-purple-woods": "wild-calm",
  "miraldas-observatory": "mage-city",
  "miraldas-quarters": "two-stars-night",

  "forbidden-threshold": "forbidden",
  "forbidden-crossroads": "forbidden",
  "forbidden-sanctuary": "wild-calm",
  "forbidden-ruins": "forbidden",

  "forthaven-harbor": "forthaven-lullaby",
  "forthaven-ramparts": "dawn-training",
  "forthaven-war-room": "storm-without-you",
  "forthaven-memorial": "draven-daughter",
  "forthaven-quarters": "forthaven-lullaby",

  "akuhn-gates": "akuhn",
  "akuhn-palace-exterior": "akuhn",
  "akuhn-throne-room": "amanea-black-queen",
  "akuhn-archives": "captive",
  "akuhn-war-room": "tension",
  "akuhn-music-room": "imperial-lament-instrumental",
  "akuhn-terrace": "amanea-black-queen",

  "tzekarun-gates": "tzekarun-ost",
  "tzekarun-workshop": "tzekarun-ost",
  "tzekarun-archive": "tzekarun-ost",

  "forestier-inn": "forestier-ost",
  "echo-clearing": "echo-clearing-ost",
  "river-halt": "iriana-valurn-confessions",
  "imperial-road": "valurn-memory",
  "obsidian-waystation": "dune-relay",
};

const LOCATION_MUSIC: Record<string, string> = {
  algratal: "algratal",
  miraldas: "miraldas",
  forbidden: "forbidden",
  forthaven: "forthaven-lullaby",
  akuhn: "akuhn",
  tzekarun: "tzekarun-ost",
  forestier: "forestier-ost",
  "echo-clearing": "echo-clearing-ost",
  "river-halt": "iriana-valurn-confessions",
  "imperial-road": "valurn-memory",
  "obsidian-waystation": "dune-relay",
};

export const MUSIC_LABELS: Record<string, string> = {
  algratal: "Le cœur de l’Empire, Al’Gratal",
  "capital-market": "Shopping dans la capitale",
  "iriana-entrance": "Entrée d’Iriana",
  "imperial-lament": "La Complainte impériale",
  "imperial-lament-instrumental": "La Complainte impériale — instrumental",
  "chosen-ball": "Le Bal des Élus",
  "marble-moon": "Clair de lune sur le marbre",
  catacombs: "Les Catacombes du Croissant",
  miraldas: "Thème de Mir’Aldas",
  "mage-city": "La cité des mages",
  "saidin-duel": "Le duel de Saidin",
  training: "Entraînement",
  "wild-calm": "Wild Calm",
  "two-stars-night": "Une nuit entre deux étoiles",
  "confessions-wind": "Vent et confessions",
  forbidden: "Les brumes de la Forêt Interdite",
  "naiah-duel-one": "Le duel de Naïah — premier mouvement",
  "naiah-duel-two": "Le duel de Naïah — second mouvement",
  "shadow-combat": "Combat des Ombres",
  "storm-without-you": "Storm Without You",
  "forthaven-lullaby": "Forthaven Lullaby",
  "dawn-training": "Entraînement à l’aube",
  fratricide: "Confrontation fratricide",
  "draven-daughter": "Draven, père et fille",
  ending: "L’heure suspendue",
  akuhn: "Étranger à Akuhn’Nabad",
  infiltration: "Infiltration",
  "amanea-black-queen": "Amanea, Reine Noire",
  captive: "Captif",
  "infernal-trade": "Infernal Trade",
  "bellirith-encounter": "Rencontre avec Bellirith",
  "unbroken-ice": "Une glace à jamais brisée",
  tension: "Tension",
  "tzekarun-ost": "Tzekar’ûn",
  unborn: "The Unborn",
  "valurn-lullaby": "La berceuse de Valurn",
  "hylee-remerii-ball": "Le Bal des Élus — Hylee et Remerii",
  "forestier-ost": "Taverne du Forestier",
  "star-night-soft": "Une nuit sous tes étoiles",
  "echo-clearing-ost": "Wild Calm",
  "iriana-valurn-confessions": "Un vent de confessions — Iriana et Valurn",
  "valurn-memory": "Mémoire de Valurn",
  "midnight-waltz": "Midnight Waltz",
  "dune-relay": "Les Tzekarii",
  intimate: "Une nuit sous tes étoiles — intime",
  menu: "Le grimoire de Sylvinia",
  title: "Le portail emprunté",
};

export function musicForContext(spotId: string, context?: { intimacy?: boolean; prologue?: boolean; locationId?: string }) {
  if (context?.intimacy) return "intimate";
  if (context?.prologue) return "title";
  // Un grand lieu conserve désormais une identité musicale unique, quel que
  // soit le sous-lieu visité. Les pistes plus spécialisées restent référencées
  // dans le catalogue pour les scènes scénarisées, mais l'exploration libre ne
  // change plus de morceau à chaque porte franchie.
  if (context?.locationId && LOCATION_MUSIC[context.locationId]) return LOCATION_MUSIC[context.locationId];
  if (SPOT_MUSIC[spotId]) {
    const spotLocation = Object.keys(LOCATION_MUSIC).find((location) => spotId === location || spotId.startsWith(`${location}-`));
    return spotLocation ? LOCATION_MUSIC[spotLocation] : SPOT_MUSIC[spotId];
  }

  // Les sauvegardes anciennes et les vingt logements peuvent employer un
  // sous-lieu ajouté après la table ci-dessus. Le préfixe évite alors de faire
  // revenir la musique du prologue au milieu du mode libre.
  const locationPrefix = Object.keys(LOCATION_MUSIC).find((location) => spotId === location || spotId.startsWith(`${location}-`));
  return locationPrefix ? LOCATION_MUSIC[locationPrefix] : "algratal";
}
