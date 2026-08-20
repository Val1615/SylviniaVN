import type { PeriodKey } from "./game-data";
import { HOUSING_PROPERTIES } from "./housing-data";

export type SpotData = {
  id: string;
  location: string;
  name: string;
  shortName: string;
  description: string;
  background: string;
  activities: string[];
  icon: string;
  housing?: boolean;
};

export type RoutineMoment = {
  spot: string;
  action: string;
};

const bg = (name: string) => `/assets/backgrounds/${name}.webp`;
const place = (name: string) => `/assets/places/${name}.jpg`;

/**
 * Chaque décor ci-dessous a été classé d'après ce qu'il représente vraiment.
 * Certains anciens noms de fichiers sont trompeurs : par exemple
 * backgrounds/miraldas.webp est une clairière de givre, et non Mir'Aldas.
 */
export const SUBLOCATIONS: SpotData[] = [
  // Al'Gratal
  { id: "algratal-streets", location: "algratal", name: "Avenues impériales", shortName: "Avenues", description: "Les grandes artères blanches et or où délégations, serviteurs et curieux se croisent sous les bannières impériales.", background: bg("streets"), activities: ["explore", "rest"], icon: "⌁" },
  { id: "algratal-market", location: "algratal", name: "Grand Marché", shortName: "Marché", description: "Étoffes enchantées, cristaux, pâtisseries et rumeurs de cour changent ici de mains.", background: bg("market"), activities: ["market", "explore"], icon: "◈" },
  { id: "algratal-palace-audience", location: "algratal", name: "Palais · Galerie d’audience", shortName: "Galerie d’audience", description: "Une galerie ouverte du palais où la cour attend, observe et négocie sans jamais sembler le faire.", background: bg("alcove"), activities: ["court", "rest"], icon: "♜" },
  { id: "algratal-palace-council", location: "algratal", name: "Palais · Salle du Conseil", shortName: "Salle du Conseil", description: "Autour de la grande table impériale, Iriana reçoit la cour, déplace les alliances et prépare les routes du lendemain.", background: bg("algratal_council"), activities: ["court", "archives"], icon: "▤" },
  { id: "algratal-music-room", location: "algratal", name: "Palais · Salon de musique", shortName: "Salon de musique", description: "Un salon nocturne à l’écart des audiences, chargé de souvenirs que la musique ne sait pas toujours rendre.", background: bg("algratal_music_room"), activities: ["rest", "court"], icon: "♫" },
  { id: "algratal-ballroom", location: "algratal", name: "Palais · Salle des Élus", shortName: "Salle de bal", description: "Lustres, velours et parquet poli : les fêtes impériales y transforment chaque danse en déclaration.", background: bg("ballroom"), activities: ["court", "rest"], icon: "✧" },
  { id: "algratal-palace-quarters", location: "algratal", name: "Palais · Appartements d’hôtes", shortName: "Appartements", description: "Des chambres claires et luxueuses réservées aux membres de la cour et aux délégations de passage.", background: bg("bedroom"), activities: ["rest"], icon: "☾" },
  { id: "algratal-catacombs", location: "algratal", name: "Catacombes du Croissant", shortName: "Catacombes", description: "Sous une boutique oubliée, les phases de lune gravées dans la pierre conduisent au Sanctuaire des Lunes Perdues.", background: bg("algratal_catacombs"), activities: ["archives", "attunement", "explore"], icon: "◐" },

  // Mir'Aldas
  { id: "miraldas-dome", location: "miraldas", name: "Place du Grand Dôme", shortName: "Grand Dôme", description: "La cité de pierre claire et de cristal respire sous sa barrière arcanique, indépendante de l’Empire.", background: place("miraldas"), activities: ["explore", "attunement"], icon: "✦" },
  { id: "miraldas-atelier", location: "miraldas", name: "Atelier arcanique", shortName: "Atelier", description: "Cristaux, bâtons et matrices de sort emplissent cet atelier où Hylee et Remerii travaillent souvent ensemble.", background: bg("atelier"), activities: ["workshop", "training", "attunement"], icon: "⚙" },
  { id: "miraldas-archives", location: "miraldas", name: "Grande Bibliothèque", shortName: "Bibliothèque", description: "Des rayonnages mouvants et des globes de lecture conservent les savoirs de la cité des mages.", background: bg("miraldas_archives"), activities: ["archives", "attunement"], icon: "▤" },
  { id: "miraldas-hylee-glade", location: "miraldas", name: "Clairière du Givre", shortName: "Clairière du Givre", description: "À la lisière du Dôme, une clairière d’entraînement porte encore la bannière au flocon d’Hylee.", background: bg("miraldas"), activities: ["training", "rest"], icon: "❄" },
  { id: "miraldas-purple-woods", location: "miraldas", name: "Bois cristallins du Dôme", shortName: "Bois cristallins", description: "La forêt violette qui entoure Mir’Aldas reflète le bouclier de la cité dans ses cristaux et ses ruisseaux.", background: place("foret-miraldas"), activities: ["explore", "attunement", "rest"], icon: "⌁" },
  { id: "miraldas-observatory", location: "miraldas", name: "Observatoire des Archimages", shortName: "Observatoire", description: "Une terrasse d’astrolabes tournée vers le Dôme, où Saidin étudie le temps sans toujours accepter de le laisser passer.", background: bg("miraldas_observatory"), activities: ["archives", "attunement", "rest"], icon: "⌛" },
  { id: "miraldas-quarters", location: "miraldas", name: "Résidence des mages", shortName: "Résidence", description: "Des appartements sobres et chaleureux, ouverts sur les lumières violettes de la cité.", background: bg("miraldas_quarters"), activities: ["rest"], icon: "☾" },

  // Forêt Interdite
  { id: "forbidden-threshold", location: "forbidden", name: "Lisière des brumes", shortName: "Lisière", description: "La lumière s’éteint brusquement là où commencent les arbres tordus et les chemins mouvants.", background: place("foret"), activities: ["explore", "rest"], icon: "◒" },
  { id: "forbidden-crossroads", location: "forbidden", name: "Carrefour des sentiers mouvants", shortName: "Carrefour mouvant", description: "Trois chemins peuvent en devenir quatre dès que Naïah décide que la route manque d’intérêt.", background: bg("purple_forest"), activities: ["explore", "attunement"], icon: "⌁" },
  { id: "forbidden-sanctuary", location: "forbidden", name: "Clairière de Naïah", shortName: "Clairière de Naïah", description: "Au cœur des brumes, Naïah reçoit celles et ceux auxquels elle consent à laisser un chemin stable.", background: bg("forbidden_forest"), activities: ["attunement", "rest"], icon: "✦" },
  { id: "forbidden-ruins", location: "forbidden", name: "Ruines noyées de brume", shortName: "Ruines", description: "Des escaliers et des arches anciennes disparaissent sous les racines, la mousse sombre et la magie des Ombres.", background: place("foret"), activities: ["archives", "explore"], icon: "◇" },

  // Forthaven
  { id: "forthaven-harbor", location: "forthaven", name: "Quais de Forthaven", shortName: "Quais", description: "Navires, caisses et équipes de relève occupent le port que Lineva refuse de laisser tomber.", background: bg("forthaven"), activities: ["harbor", "explore"], icon: "≋" },
  { id: "forthaven-ramparts", location: "forthaven", name: "Remparts de la ville haute", shortName: "Remparts", description: "Du haut des murailles, les guetteurs surveillent la mer, la ville basse et les mouvements des morts-vivants.", background: place("forthaven"), activities: ["training", "rest"], icon: "⚔" },
  { id: "forthaven-war-room", location: "forthaven", name: "Citadelle · Salle de commandement", shortName: "Salle de commandement", description: "Cartes tachées, rapports de patrouille et plans de relève couvrent la table où Lineva organise la défense.", background: bg("forthaven_war_room"), activities: ["court", "training", "archives"], icon: "▤" },
  { id: "forthaven-memorial", location: "forthaven", name: "Mémorial des quais", shortName: "Mémorial", description: "Une promenade de pierre face à la mer porte les noms des absent·es et des équipages jamais revenus.", background: bg("forthaven"), activities: ["rest"], icon: "✧" },
  { id: "forthaven-quarters", location: "forthaven", name: "Citadelle · Quartiers de la commandante", shortName: "Quartiers de Lineva", description: "Une chambre simple dans la tour côtière, assez proche du port pour que Lineva entende chaque cloche.", background: bg("forthaven_quarters"), activities: ["rest"], icon: "☾" },

  // Akuhn'Nabad
  { id: "akuhn-gates", location: "akuhn", name: "Portes de la Cité Noire", shortName: "Portes noires", description: "Les arches de pierre noire et les feux verts marquent l’entrée de la capitale cachée des Obscurcis.", background: bg("akuhn"), activities: ["explore", "attunement"], icon: "◇" },
  { id: "akuhn-palace-exterior", location: "akuhn", name: "Palais obscurci · Parvis", shortName: "Parvis du palais", description: "Le palais domine la cité bannie, immense masse gothique parcourue d’une lumière verte malsaine.", background: bg("akuhn_palace"), activities: ["court", "explore"], icon: "♜" },
  { id: "akuhn-throne-room", location: "akuhn", name: "Palais obscurci · Salle du trône", shortName: "Salle du trône", description: "Une salle d’apparat noire et silencieuse où chaque siège semble avoir survécu à une trahison.", background: bg("throne_room"), activities: ["court"], icon: "♜" },
  { id: "akuhn-archives", location: "akuhn", name: "Archives profondes", shortName: "Archives profondes", description: "Chaînes, runes et rayonnages de pierre gardent les textes que la Cité Noire refuse d’abandonner.", background: bg("deep_archives"), activities: ["archives", "attunement"], icon: "▤" },
  { id: "akuhn-war-room", location: "akuhn", name: "Palais obscurci · Salle de guerre", shortName: "Salle de guerre", description: "Une carte noire et des figurines rituelles occupent cette pièce réservée aux stratégies dangereuses.", background: bg("war_room"), activities: ["court", "archives"], icon: "⚔" },
  { id: "akuhn-music-room", location: "akuhn", name: "Palais obscurci · Salon nocturne", shortName: "Salon nocturne", description: "Un piano noir, des bougies et des feux verts composent un refuge étonnamment intime au cœur du palais.", background: bg("music_room"), activities: ["rest"], icon: "♫" },
  { id: "akuhn-terrace", location: "akuhn", name: "Terrasse des feux verts", shortName: "Terrasse", description: "La terrasse surplombe toute Akuhn’Nabad, éclairée par les braseros verts de la capitale bannie.", background: bg("terrace"), activities: ["rest", "attunement"], icon: "☾" },

  // Tzekarun
  { id: "tzekarun-gates", location: "tzekarun", name: "Portes sous les dunes", shortName: "Portes des dunes", description: "Des voiles de sable glissent entre les tours d’obsidienne et les galeries creusées sous le désert.", background: place("tzekarun"), activities: ["explore", "market"], icon: "◒" },
  { id: "tzekarun-workshop", location: "tzekarun", name: "Atelier des mécanismes", shortName: "Atelier tzekarii", description: "Bronze, obsidienne et engrenages arcaniques donnent ici une forme mécanique à la magie.", background: bg("tzekarun_workshop"), activities: ["workshop", "attunement"], icon: "⚙" },
  { id: "tzekarun-archive", location: "tzekarun", name: "Chambre des plans d’obsidienne", shortName: "Chambre des plans", description: "Les ingénieur·es y conservent des cartes gravées et des modèles de mécanismes interdits à l’Empire.", background: bg("tzekarun_workshop"), activities: ["archives", "workshop"], icon: "▤" },

  // Escales discrètes
  { id: "forestier-inn", location: "forestier", name: "Auberge du Forestier", shortName: "Auberge", description: "L’auberge rustique où Hylee servait autrefois et où Remerii la rencontra. Naïah y apparaissait parfois à la nuit tombée.", background: bg("forestier_inn"), activities: ["market", "rest"], icon: "⌂" },
  { id: "echo-clearing", location: "echo-clearing", name: "Clairière des Échos", shortName: "Clairière", description: "Une halte discrète entre Al’Gratal et Mir’Aldas, assez sûre pour dresser un camp et reprendre un entraînement interrompu.", background: bg("camp"), activities: ["training", "rest", "attunement"], icon: "✦" },
  { id: "river-halt", location: "river-halt", name: "Halte du Fleuve bleu", shortName: "Halte du fleuve", description: "La route longe ici un large fleuve avant les montagnes et les brumes de la Forêt Interdite.", background: place("foret-algratal"), activities: ["explore", "rest"], icon: "≋" },
  { id: "imperial-road", location: "imperial-road", name: "Camp de la route impériale", shortName: "Camp impérial", description: "Une escale fortifiée sur la longue route de Forthaven, utilisée par les convois et les renforts.", background: bg("camp"), activities: ["training", "rest"], icon: "⚑" },
  { id: "obsidian-waystation", location: "obsidian-waystation", name: "Relais des dunes d’obsidienne", shortName: "Relais des dunes", description: "À l’entrée du désert Hil’dinis, les caravanes vérifient leurs réserves avant de rejoindre les galeries de Tzekarun.", background: place("hildinis"), activities: ["rest", "explore"], icon: "◇" },
  ...HOUSING_PROPERTIES.map((entry): SpotData => ({
    id: entry.spot,
    location: entry.location,
    name: entry.name,
    shortName: "Votre logis",
    description: entry.description,
    background: entry.background,
    activities: ["rest"],
    icon: "⌂",
    housing: true,
  })),
];

export const DEFAULT_SPOTS: Record<string, string> = {
  algratal: "algratal-streets",
  miraldas: "miraldas-dome",
  forbidden: "forbidden-threshold",
  forthaven: "forthaven-harbor",
  akuhn: "akuhn-gates",
  tzekarun: "tzekarun-gates",
  forestier: "forestier-inn",
  "echo-clearing": "echo-clearing",
  "river-halt": "river-halt",
  "imperial-road": "imperial-road",
  "obsidian-waystation": "obsidian-waystation",
};

export function spotById(id: string) {
  return SUBLOCATIONS.find((spot) => spot.id === id);
}

export function spotsForLocation(location: string) {
  return SUBLOCATIONS.filter((spot) => spot.location === location);
}

const moment = (spot: string, action: string): RoutineMoment => ({ spot, action });

const ROUTINES: Record<string, Record<string, RoutineMoment[]>> = {
  hylee: {
    forestier: [
      moment("forestier-inn", "aide encore au premier service avant le départ"),
      moment("forestier-inn", "prépare son sac sous le regard attentif de Remerii"),
      moment("forestier-inn", "dit au revoir aux habitué·es sans annoncer sa magie"),
      moment("forestier-inn", "retrouve Naïah lorsqu’elle ose approcher l’auberge à la nuit tombée"),
    ],
    miraldas: [
      moment("miraldas-quarters", "partage le thé du matin avec Remerii avant l’entraînement"),
      moment("miraldas-atelier", "travaille la cryomancie avec Remerii"),
      moment("miraldas-hylee-glade", "s’entraîne seule dans la clairière marquée de son flocon"),
      moment("miraldas-quarters", "partage le thé du soir avec Remerii et laisse enfin sa magie retomber"),
    ],
    forbidden: [
      moment("forbidden-sanctuary", "retrouve Naïah dans sa clairière"),
      moment("forbidden-sanctuary", "écoute Naïah raconter ce qui a changé dans la forêt"),
      moment("forbidden-sanctuary", "partage des provisions avec Naïah"),
      moment("forbidden-sanctuary", "reste auprès de Naïah avant de reprendre la route"),
    ],
  },
  remerii: {
    forestier: [
      moment("forestier-inn", "corrige la carte de leur prochaine étape"),
      moment("forestier-inn", "prend un thé qu’elle oublie en surveillant les uniformes de passage"),
      moment("forestier-inn", "apprend à Hylee à masquer sa signature magique"),
      moment("forestier-inn", "organise le départ avant que l’Empire ne s’intéresse à elles"),
    ],
    miraldas: [
      moment("miraldas-quarters", "prépare le programme du jour avec Hylee"),
      moment("miraldas-atelier", "enseigne puis laisse Hylee inventer sa propre solution"),
      moment("miraldas-archives", "compare les relevés de la Confluence aux archives de la cité"),
      moment("miraldas-observatory", "corrige ses notes sous la lumière du Dôme"),
    ],
  },
  iriana: {
    algratal: [
      moment("algratal-palace-quarters", "lit sa correspondance avant que les conseillers ne puissent l’interrompre"),
      moment("algratal-palace-audience", "reçoit les requêtes de la cour au Palais impérial"),
      moment("algratal-palace-council", "préside le conseil et répartit les délégations"),
      moment("algratal-music-room", "retrouve un peu de silence loin de la couronne"),
    ],
    forthaven: [
      moment("forthaven-quarters", "relit les demandes de renfort avant de rejoindre Lineva"),
      moment("forthaven-war-room", "prépare avec Lineva la défense des quartiers évacués"),
      moment("forthaven-ramparts", "inspecte les lignes de ravitaillement avec les éclaireurs"),
      moment("forthaven-war-room", "revoit les cartes après la relève"),
    ],
    akuhn: [
      moment("akuhn-terrace", "prépare son entretien loin des oreilles du palais"),
      moment("akuhn-throne-room", "mène la délégation devant la cour obscurcie"),
      moment("akuhn-archives", "vérifie les termes historiques de la négociation"),
      moment("akuhn-music-room", "écrit un rapport privé avant de quitter la Cité Noire"),
    ],
  },
  valurn: {
    algratal: [
      moment("algratal-palace-quarters", "profite de l’aube pour retirer enfin ses bottes et ses certitudes"),
      moment("algratal-market", "échange des renseignements contre des faveurs sans signature"),
      moment("algratal-palace-council", "rejoint Iriana lorsque le jeu politique devient sérieux"),
      moment("algratal-palace-audience", "cherche la sortie la plus proche tout en prétendant apprécier la cour"),
    ],
    forbidden: [
      moment("forbidden-threshold", "vérifie que personne n’a suivi ses traces"),
      moment("forbidden-crossroads", "négocie avec Naïah un passage que la forêt acceptera"),
      moment("forbidden-ruins", "cherche une ancienne marque du Chaos dans les ruines"),
      moment("forbidden-sanctuary", "partage avec Naïah une trêve très relative"),
    ],
    akuhn: [
      moment("akuhn-terrace", "observe la Cité Noire avant d’y réclamer quoi que ce soit"),
      moment("akuhn-archives", "consulte les pactes que son père préférerait voir oubliés"),
      moment("akuhn-throne-room", "rend visite à Bellirith et à la cour obscurcie"),
      moment("akuhn-music-room", "joue aux cartes avec Bellirith sans admettre qu’il est venu pour elle"),
    ],
  },
  naiah: {
    forbidden: [
      moment("forbidden-sanctuary", "écoute la forêt se réveiller autour de sa clairière"),
      moment("forbidden-crossroads", "déplace les sentiers pour écarter les intrus"),
      moment("forbidden-ruins", "inspecte les anciennes pierres gagnées par les Ombres"),
      moment("forbidden-sanctuary", "reçoit celles et ceux auxquels elle laisse un chemin"),
    ],
    akuhn: [
      moment("akuhn-terrace", "observe la ville de sa famille sans s’y sentir chez elle"),
      moment("akuhn-throne-room", "affronte les affaires de la cour obscurcie"),
      moment("akuhn-archives", "cherche les traces de ce que sa lignée a effacé"),
      moment("akuhn-terrace", "évite le palais aussi longtemps que possible"),
    ],
  },
  lineva: {
    forthaven: [
      moment("forthaven-harbor", "assiste à la première relève et vérifie les quais"),
      moment("forthaven-war-room", "commande le front contre les morts-vivants"),
      moment("forthaven-ramparts", "inspecte elle-même les défenses de la ville haute"),
      moment("forthaven-quarters", "termine les rapports qu’elle aurait dû déléguer"),
    ],
    algratal: [
      moment("algratal-palace-quarters", "lit le rapport de sa relève avant de quitter sa chambre"),
      moment("algratal-palace-audience", "défend directement les besoins de Forthaven devant la cour"),
      moment("algratal-palace-council", "corrige les clauses négociées par Draven"),
      moment("algratal-ballroom", "accepte une soirée loin du port avant le voyage de retour"),
    ],
  },
  saidin: {
    miraldas: [
      moment("miraldas-quarters", "observe le lever du jour sans consulter sa fin"),
      moment("miraldas-archives", "étudie une anomalie temporelle dans la Grande Bibliothèque"),
      moment("miraldas-archives", "travaille avec Remerii sur les relevés de la Confluence"),
      moment("miraldas-dome", "marche dans la cité pour pratiquer une heure ordinaire"),
    ],
    algratal: [
      moment("algratal-palace-quarters", "laisse le soleil atteindre une horloge qu’il a arrêtée"),
      moment("algratal-palace-council", "présente au Conclave les futurs qu’il juge partageables"),
      moment("algratal-palace-audience", "écoute la ville présente plutôt que ses versions disparues"),
      moment("algratal-music-room", "s’accorde une soirée sans prophétie"),
    ],
    tzekarun: [
      moment("tzekarun-workshop", "observe les mécanismes se mettre en marche"),
      moment("tzekarun-archive", "compare les plans d’obsidienne à ses relevés temporels"),
      moment("tzekarun-workshop", "travaille avec les ingénieur·es tzekarii"),
      moment("tzekarun-gates", "regarde les navires de sable regagner leurs galeries"),
    ],
  },
  bellirith: {
    akuhn: [
      moment("akuhn-music-room", "déjeune tard devant un piano qu’elle prétend ne jamais jouer"),
      moment("akuhn-throne-room", "paraît à la cour obscurcie sans donner à personne ce qu’il attend"),
      moment("akuhn-war-room", "suit les manœuvres de Bhaal pour mieux les contrarier"),
      moment("akuhn-music-room", "retrouve Valurn autour d’un verre et d’une vieille rivalité"),
    ],
    forbidden: [
      moment("forbidden-threshold", "vérifie les limites de la trêve conclue avec Naïah"),
      moment("forbidden-crossroads", "rejoint Naïah et Valurn sans annoncer son arrivée"),
      moment("forbidden-ruins", "cherche un passage que les démons ne connaissent pas"),
      moment("forbidden-sanctuary", "parle avec Naïah sans employer ni charme ni illusion"),
    ],
    algratal: [
      moment("algratal-palace-quarters", "dépose ses bijoux enchantés avant de rejoindre la cour"),
      moment("algratal-palace-audience", "teste les limites de la politesse impériale"),
      moment("algratal-palace-council", "assiste à une audience politique sans enchanter personne"),
      moment("algratal-ballroom", "danse en laissant à chacun le choix de la distance"),
    ],
  },
  amanea: {
    akuhn: [
      moment("akuhn-archives", "étudie avant l’aube les clauses du pacte d’Alamma"),
      moment("akuhn-throne-room", "reçoit la cour obscurcie et met Allenna à l’épreuve"),
      moment("akuhn-war-room", "prépare avec Allenna la défense d’une cité ennemie de l’Empire"),
      moment("akuhn-music-room", "ferme les audiences et joue du piano loin de la cour"),
    ],
    forbidden: [
      moment("forbidden-threshold", "arrive sous une cape sans emblème et renvoie son escorte"),
      moment("forbidden-crossroads", "inspecte seule un ancien chemin effacé par la brume"),
      moment("forbidden-ruins", "compare les ruines à un relevé conservé dans ses archives"),
      moment("forbidden-sanctuary", "demeure immobile devant un sanctuaire qu’elle refuse d’approcher"),
    ],
  },
  tia: {
    algratal: [
      moment("algratal-palace-quarters", "commence la journée par les dossiers qu’elle refuse de déléguer"),
      moment("algratal-palace-council", "préside le Conseil et observe les décisions d’Iriana"),
      moment("algratal-palace-audience", "accorde des audiences où chaque silence devient politique"),
      moment("algratal-music-room", "consacre une rare heure sans secrétaire à la musique et aux archives familiales"),
    ],
  },
  allenna: {
    akuhn: [
      moment("akuhn-war-room", "ouvre l’entraînement avant la première relève"),
      moment("akuhn-gates", "inspecte les patrouilles et soigne les blessures du retour"),
      moment("akuhn-war-room", "commande les défenses aux côtés d’Amanea sans attendre chacune de ses corrections"),
      moment("akuhn-terrace", "termine ses rapports et vérifie une dernière fois les feux de la cité"),
    ],
    forbidden: [
      moment("forbidden-threshold", "inspecte les traces autour de la frontière des brumes"),
      moment("forbidden-crossroads", "sécurise un passage que Naïah déplace par pure hostilité"),
      moment("forbidden-ruins", "recense les plantes médicinales et les risques de poison"),
      moment("forbidden-threshold", "rassemble la patrouille avant le retour vers Akuhn’Nabad"),
    ],
  },
  draven: {
    forthaven: [
      moment("forthaven-harbor", "inspecte les navires et prend les nouvelles de Lineva"),
      moment("forthaven-war-room", "compare ses plans à ceux que Lineva a améliorés"),
      moment("forthaven-ramparts", "prépare la relève avant son prochain départ"),
      moment("forthaven-quarters", "répond à sa fille sans transformer chaque inquiétude en ordre"),
    ],
    algratal: [
      moment("algratal-palace-quarters", "lit les rapports reçus de Forthaven avant l’audience"),
      moment("algratal-palace-audience", "demande officiellement des renforts pour Forthaven"),
      moment("algratal-palace-council", "négocie les clauses de l’aide impériale"),
      moment("algratal-palace-quarters", "écrit à Lineva avant de préparer la séance suivante"),
    ],
  },
};

const PERIOD_INDEX: Record<PeriodKey, number> = { aube: 0, matin: 1, "apres-midi": 2, "soirée": 3 };

export function routineFor(characterId: string, location: string, period: PeriodKey, day: number): RoutineMoment {
  const cycleDay = ((Math.max(1, day) - 1) % 38) + 1;
  // Hylee rejoint toujours la clairière durant sa rare escale. La présence de
  // Naïah est synchronisée dans characterPlace avec l'itinéraire réel de Hylee.
  if (location === "forbidden" && characterId === "hylee") {
    return moment("forbidden-sanctuary", "passe cette rare visite auprès de Naïah");
  }
  if (characterId === "lineva" && location === "forthaven" && period === "apres-midi" && cycleDay % 3 === 0) {
    return moment("forthaven-memorial", "se recueille au mémorial sans abandonner la ville à sa vigilance");
  }
  if (characterId === "amanea" && location === "akuhn" && period === "soirée" && cycleDay % 5 === 0) {
    return moment("akuhn-terrace", "confie la dernière audience à Allenna et rejoint seule la terrasse des feux verts");
  }
  // Les événements croisés disposent de véritables créneaux communs. Ces
  // exceptions n'inventent pas une téléportation : elles déplacent seulement
  // une activité au sein de la ville où l'itinéraire place déjà le personnage.
  if (characterId === "iriana" && location === "algratal" && period === "matin" && cycleDay === 22) {
    return moment("algratal-palace-council", "prépare l’audience avec Tia sans lui abandonner sa propre posture");
  }
  if (characterId === "allenna" && location === "akuhn" && period === "matin" && cycleDay === 14) {
    return moment("akuhn-throne-room", "présente à Amanea le rapport qui précède l’arrivée de Naïah");
  }
  if (characterId === "saidin" && location === "miraldas" && cycleDay === 23) {
    if (period === "apres-midi") return moment("miraldas-hylee-glade", "observe avec Hylee une flamme qui répond contre toute logique au givre");
    if (period === "soirée") return moment("miraldas-observatory", "partage avec Remerii un thé qu’aucun des deux ne sait laisser refroidir en paix");
  }
  if (characterId === "iriana" && location === "algratal" && period === "soirée" && cycleDay === 27) {
    return moment("algratal-ballroom", "reprend avec Tia une mesure apprise trop parfaitement");
  }
  if (characterId === "bellirith" && location === "akuhn" && period === "matin" && cycleDay >= 24 && cycleDay <= 29) {
    return moment("akuhn-archives", "confronte Valurn à la copie de l’inscription qu’il lui avait cachée");
  }
  // Les scènes personnelles tardives utilisent des espaces réellement inscrits
  // dans l'emploi du temps, afin qu'elles restent atteignables sans téléportation
  // ni mode développeur. Elles se répètent avec le même cycle de trente-huit jours.
  if (characterId === "tia" && location === "algratal" && period === "soirée") {
    if (cycleDay === 23) return moment("algratal-palace-audience", "fait fermer la galerie après les audiences pour une conversation sans témoin");
    if (cycleDay === 27) return moment("algratal-ballroom", "reste dans la Salle des Élus après le départ de l'orchestre");
    if (cycleDay === 31) return moment("algratal-palace-quarters", "retire enfin la couronne dans ses appartements privés");
  }
  if (characterId === "allenna" && location === "akuhn" && period === "soirée") {
    if (cycleDay === 24 || cycleDay === 25) return moment("akuhn-music-room", "accorde une heure sans ordre dans la salle de musique basse");
    if (cycleDay === 26 || (cycleDay >= 30 && cycleDay % 4 === 2)) return moment("akuhn-terrace", "termine sa relève sur la terrasse sans convertir votre présence en surveillance");
    if (cycleDay >= 27) return moment("akuhn-music-room", "revient au Salon nocturne par choix, après avoir confié la dernière relève");
  }
  const routine = ROUTINES[characterId]?.[location];
  return routine?.[PERIOD_INDEX[period]] || moment(DEFAULT_SPOTS[location] || "algratal-streets", "poursuit ses affaires dans les environs");
}

export function travelWaypoint(characterId: string, travelTo: string | undefined, note: string, travelDay = 1): RoutineMoment {
  const lower = note.toLocaleLowerCase("fr-FR");
  if (lower.includes("hors de la forêt")) return moment("forestier-inn", "fait une halte discrète près de l’ancienne Auberge du Forestier avant de reprendre la route");
  if (travelTo === "miraldas" || ((characterId === "hylee" || characterId === "remerii" || characterId === "saidin") && travelTo === "algratal")) {
    return moment("echo-clearing", travelDay === 1 ? "gagne la clairière entre Al’Gratal et Mir’Aldas" : travelDay === 2 ? "se repose et s’entraîne à la Clairière des Échos" : "lève le camp avant la dernière étape de la route");
  }
  if (travelTo === "forthaven" || ((characterId === "draven" || characterId === "lineva") && travelTo === "algratal")) return moment("imperial-road", travelDay === 1 ? "rejoint le convoi sur la longue route entre Forthaven et Al’Gratal" : travelDay === 2 ? "fait halte avec la délégation au camp impérial" : "supervise la prochaine étape sans perdre le courrier de Forthaven de vue");
  if (travelTo === "tzekarun") return moment("obsidian-waystation", "prépare la traversée du désert au relais d’obsidienne");
  if (travelTo === "forbidden" || travelTo === "akuhn") return moment("river-halt", travelDay === 1 ? "longe le Fleuve bleu avant les montagnes et les brumes" : travelDay === 2 ? "attend que le passage des brumes redevienne praticable" : "reprend la route après la halte du fleuve");
  if (travelTo === "algratal" && lower.includes("sous escorte")) return moment("imperial-road", "regagne la capitale avec le convoi impérial venu de Forthaven");
  return moment("river-halt", "fait étape sur la route avant de poursuivre son voyage");
}

export const ROUTE_SPOTS: Record<string, string> = {
  "hylee-0": "forestier-inn",
  "hylee-1": "miraldas-atelier",
  "hylee-2": "miraldas-hylee-glade",
  "hylee-3": "echo-clearing",
  "hylee-4": "miraldas-quarters",
  "remerii-0": "forestier-inn",
  "remerii-1": "miraldas-atelier",
  "remerii-2": "miraldas-archives",
  "remerii-3": "echo-clearing",
  "remerii-4": "miraldas-quarters",
  "iriana-0": "algratal-palace-audience",
  "iriana-1": "algratal-music-room",
  "iriana-2": "algratal-palace-audience",
  "iriana-3": "algratal-palace-council",
  "iriana-4": "algratal-palace-quarters",
  "tia-0": "algratal-palace-council",
  "tia-1": "algratal-palace-audience",
  "tia-2": "algratal-palace-audience",
  "tia-3": "algratal-ballroom",
  "tia-4": "algratal-palace-quarters",
  "valurn-0": "algratal-market",
  "valurn-1": "forbidden-crossroads",
  "valurn-2": "akuhn-archives",
  "valurn-3": "algratal-palace-audience",
  "valurn-4": "algratal-palace-quarters",
  "naiah-0": "forbidden-sanctuary",
  "naiah-1": "forbidden-crossroads",
  "naiah-2": "akuhn-throne-room",
  "naiah-3": "forbidden-sanctuary",
  "naiah-4": "forbidden-sanctuary",
  "lineva-0": "forthaven-harbor",
  "lineva-1": "forthaven-war-room",
  "lineva-2": "forthaven-memorial",
  "lineva-3": "algratal-ballroom",
  "lineva-4": "forthaven-quarters",
  "saidin-0": "miraldas-archives",
  "saidin-1": "miraldas-archives",
  "saidin-2": "algratal-palace-audience",
  "saidin-3": "miraldas-dome",
  "saidin-4": "miraldas-quarters",
  "bellirith-0": "forbidden-sanctuary",
  "bellirith-1": "akuhn-music-room",
  "bellirith-2": "algratal-palace-audience",
  "bellirith-3": "akuhn-war-room",
  "bellirith-4": "akuhn-music-room",
  "amanea-0": "akuhn-throne-room",
  "amanea-1": "akuhn-war-room",
  "amanea-2": "akuhn-archives",
  "amanea-3": "akuhn-archives",
  "amanea-4": "akuhn-terrace",
  "allenna-0": "akuhn-war-room",
  "allenna-1": "akuhn-gates",
  "allenna-2": "akuhn-terrace",
  "allenna-3": "akuhn-music-room",
  "allenna-4": "akuhn-music-room",
  "draven-0": "forthaven-harbor",
  "draven-1": "imperial-road",
  "draven-2": "algratal-palace-council",
  "draven-3": "algratal-palace-quarters",
  "draven-4": "forthaven-harbor",
};

export const ROUTE_PERIODS: Record<string, PeriodKey[]> = {
  "hylee-0": ["apres-midi"],
  "hylee-1": ["matin"],
  "hylee-2": ["apres-midi"],
  "hylee-3": ["soirée"],
  "hylee-4": ["soirée"],
  "remerii-0": ["matin"],
  "remerii-1": ["matin"],
  "remerii-2": ["apres-midi"],
  "remerii-3": ["soirée"],
  "remerii-4": ["aube"],
  "iriana-0": ["matin"],
  "iriana-1": ["soirée"],
  "iriana-2": ["matin"],
  "iriana-3": ["apres-midi"],
  "iriana-4": ["aube"],
  "tia-0": ["matin"],
  "tia-1": ["matin", "apres-midi"],
  "tia-2": ["soirée"],
  "tia-3": ["soirée"],
  "tia-4": ["soirée"],
  "valurn-0": ["matin"],
  "valurn-1": ["matin"],
  "valurn-2": ["matin"],
  "valurn-3": ["soirée"],
  "valurn-4": ["aube"],
  "naiah-0": ["soirée"],
  "naiah-1": ["matin"],
  "naiah-2": ["matin"],
  "naiah-3": ["soirée"],
  "naiah-4": ["soirée"],
  "lineva-0": ["aube"],
  "lineva-1": ["matin"],
  "lineva-2": ["apres-midi"],
  "lineva-3": ["soirée"],
  "lineva-4": ["soirée"],
  "saidin-0": ["matin", "apres-midi"],
  "saidin-1": ["matin", "apres-midi"],
  "saidin-2": ["apres-midi"],
  "saidin-3": ["soirée"],
  "saidin-4": ["aube"],
  "bellirith-0": ["soirée"],
  "bellirith-1": ["aube", "soirée"],
  "bellirith-2": ["matin"],
  "bellirith-3": ["apres-midi"],
  "bellirith-4": ["soirée"],
  "amanea-0": ["matin"],
  "amanea-1": ["apres-midi"],
  "amanea-2": ["aube"],
  "amanea-3": ["aube"],
  "amanea-4": ["soirée"],
  "allenna-0": ["aube"],
  "allenna-1": ["matin"],
  "allenna-2": ["aube", "soirée"],
  "allenna-3": ["soirée"],
  "allenna-4": ["soirée"],
  "draven-0": ["aube"],
  "draven-1": ["soirée"],
  "draven-2": ["apres-midi"],
  "draven-3": ["soirée"],
  "draven-4": ["aube"],
};

export const AMBIENT_SPOT_HINTS: Record<string, string[]> = {
  "hylee-pluie": ["algratal-streets", "miraldas-hylee-glade", "miraldas-purple-woods", "forbidden-sanctuary", "echo-clearing", "river-halt"],
  "hylee-nom": ["miraldas-dome", "miraldas-atelier", "miraldas-hylee-glade"],
  "hylee-demain": ["miraldas-quarters", "algratal-palace-quarters", "echo-clearing", "forbidden-sanctuary"],
  "hylee-tartelette": ["algratal-market", "miraldas-quarters", "forestier-inn"],
  "hylee-baton": ["miraldas-atelier", "miraldas-hylee-glade"],
  "hylee-foule": ["algratal-streets", "algratal-market", "miraldas-dome"],
  "hylee-plume": ["miraldas-purple-woods", "miraldas-hylee-glade", "forestier-inn", "forbidden-sanctuary"],
  "hylee-mer": ["forthaven-ramparts", "forthaven-harbor"],
  "hylee-livre": ["miraldas-archives", "miraldas-atelier", "algratal-palace-council"],
  "hylee-danse": ["echo-clearing", "forestier-inn", "miraldas-hylee-glade"],
  "hylee-chaleur": ["algratal-market", "miraldas-quarters", "forestier-inn", "echo-clearing"],
  "hylee-chanson": ["forestier-inn", "forthaven-harbor"],
  "hylee-bouton": ["miraldas-quarters", "algratal-palace-quarters", "echo-clearing", "forestier-inn"],
  "hylee-statue": ["algratal-streets", "miraldas-dome"],
  "hylee-maison": ["miraldas-quarters", "echo-clearing", "forestier-inn"],
  "remerii-lecture": ["miraldas-archives", "miraldas-quarters", "algratal-palace-quarters"],
  "remerii-the": ["algratal-market", "miraldas-quarters", "miraldas-observatory"],
  "remerii-erreur": ["miraldas-atelier", "miraldas-archives"],
  "remerii-bijoux": ["miraldas-quarters", "algratal-palace-quarters"],
  "remerii-medig": ["miraldas-observatory", "miraldas-purple-woods", "echo-clearing"],
  "remerii-ponctuation": ["algratal-palace-council", "miraldas-archives"],
  "remerii-parapluie": ["algratal-streets", "miraldas-dome", "miraldas-purple-woods", "echo-clearing"],
  "remerii-sablier": ["miraldas-archives", "miraldas-quarters", "algratal-palace-council"],
  "remerii-enigme": ["miraldas-atelier", "miraldas-archives"],
  "remerii-musique": ["echo-clearing", "forestier-inn", "miraldas-observatory"],
  "remerii-fatigue": ["miraldas-archives", "algratal-palace-council"],
  "remerii-tendresse": ["miraldas-quarters", "miraldas-observatory", "algratal-palace-quarters"],
  "iriana-invitations": ["algratal-palace-council", "algratal-palace-audience"],
  "iriana-echecs": ["algratal-palace-quarters", "algratal-music-room", "algratal-palace-council"],
  "iriana-dessert": ["algratal-ballroom", "algratal-market"],
  "iriana-incognito": ["algratal-streets", "algratal-market"],
  "iriana-rumeur": ["algratal-palace-council", "algratal-palace-audience"],
  "iriana-table": ["algratal-ballroom", "algratal-palace-council"],
  "iriana-course": ["algratal-palace-audience"],
  "iriana-marche": ["algratal-market"],
  "iriana-lettre": ["algratal-palace-quarters", "akuhn-music-room", "forthaven-quarters"],
  "iriana-jardin": ["algratal-palace-audience"],
  "iriana-couronne": ["algratal-palace-quarters", "algratal-palace-audience"],
  "iriana-demande": ["algratal-palace-council", "algratal-palace-quarters", "algratal-music-room", "forthaven-war-room"],
  "iriana-convoi": ["imperial-road", "river-halt"],
  "iriana-front": ["forthaven-ramparts"],
  "iriana-forthaven-briefing": ["forthaven-quarters", "forthaven-war-room"],
  "valurn-petit-dejeuner": ["algratal-market", "akuhn-music-room", "forestier-inn"],
  "valurn-contrat": ["algratal-palace-audience", "algratal-palace-council", "akuhn-music-room", "forestier-inn"],
  "valurn-histoires": ["algratal-market", "akuhn-music-room", "forestier-inn"],
  "valurn-fleur": ["forbidden-crossroads", "river-halt", "echo-clearing"],
  "valurn-fin": ["akuhn-archives", "akuhn-music-room", "algratal-palace-quarters"],
  "valurn-nom": ["akuhn-archives", "akuhn-terrace"],
  "valurn-sortie": ["algratal-market", "akuhn-music-room", "forestier-inn"],
  "valurn-matin": ["algratal-market", "akuhn-music-room"],
  "valurn-bottes": ["algratal-palace-quarters"],
  "naiah-illusions": ["forbidden-sanctuary", "forbidden-crossroads"],
  "naiah-baies": ["forbidden-sanctuary", "forbidden-crossroads"],
  "naiah-noms": ["forbidden-sanctuary", "forbidden-crossroads", "forbidden-ruins"],
  "naiah-ennui": ["forbidden-sanctuary"],
  "naiah-oiseau": ["forbidden-sanctuary"],
  "naiah-chemin": ["forbidden-crossroads"],
  "naiah-excuse": ["forbidden-sanctuary", "akuhn-terrace"],
  "naiah-matin": ["forbidden-sanctuary", "akuhn-terrace"],
  "naiah-tasse": ["forbidden-sanctuary", "akuhn-terrace", "akuhn-music-room"],
  "naiah-permission": ["forbidden-sanctuary", "forbidden-crossroads"],
  "naiah-couronne": ["forbidden-sanctuary", "forbidden-crossroads", "forbidden-ruins"],
  "naiah-jalousie": ["forbidden-sanctuary", "forbidden-crossroads", "forbidden-ruins"],
  "naiah-route": ["river-halt"],
  "naiah-court": ["akuhn-throne-room"],
  "lineva-promenade": ["forthaven-ramparts"],
  "lineva-noeud": ["forthaven-harbor"],
  "lineva-repas": ["forthaven-war-room"],
  "lineva-chanson": ["forthaven-harbor"],
  "lineva-carte": ["forthaven-war-room"],
  "lineva-des": ["forthaven-harbor", "forthaven-war-room"],
  "lineva-courrier": ["forthaven-harbor", "forthaven-quarters"],
  "lineva-manteau": ["forthaven-quarters", "forthaven-war-room"],
  "lineva-boussole": ["forthaven-memorial", "forthaven-quarters"],
  "lineva-memorial": ["forthaven-memorial"],
  "lineva-deleguer": ["forthaven-war-room"],
  "lineva-paix": ["forthaven-ramparts", "forthaven-memorial"],
  "lineva-reveil": ["forthaven-quarters"],
  "saidin-horloge": ["miraldas-archives", "miraldas-observatory", "tzekarun-workshop"],
  "saidin-fruit": ["miraldas-dome", "algratal-market", "miraldas-quarters"],
  "saidin-encre": ["miraldas-archives", "algratal-palace-council", "tzekarun-archive"],
  "saidin-chat": ["miraldas-dome", "miraldas-quarters"],
  "saidin-meteo": ["miraldas-dome", "algratal-streets", "tzekarun-gates", "echo-clearing"],
  "saidin-ville": ["miraldas-archives", "miraldas-observatory"],
  "saidin-cadeau": ["miraldas-quarters", "algratal-palace-quarters"],
  "saidin-heure": ["miraldas-observatory", "miraldas-quarters"],
  "saidin-reveil": ["miraldas-quarters", "algratal-palace-quarters"],
  "saidin-aube": ["miraldas-quarters", "algratal-palace-quarters"],
  "bellirith-coupe": ["akuhn-music-room", "algratal-ballroom", "forestier-inn"],
  "bellirith-parfum": ["akuhn-music-room", "algratal-palace-quarters"],
  "bellirith-danse": ["algratal-ballroom", "akuhn-music-room"],
  "bellirith-roman": ["akuhn-archives", "akuhn-music-room", "algratal-palace-quarters"],
  "bellirith-jeu": ["akuhn-music-room", "algratal-palace-quarters"],
  "bellirith-miroir": ["akuhn-music-room", "algratal-palace-quarters"],
  "bellirith-vetements": ["akuhn-music-room", "algratal-palace-quarters"],
  "bellirith-matin": ["akuhn-music-room", "algratal-palace-quarters"],
  "bellirith-gants": ["akuhn-music-room", "akuhn-throne-room", "algratal-palace-quarters", "algratal-ballroom"],
  "bellirith-jalousie": ["akuhn-music-room", "akuhn-throne-room", "algratal-ballroom"],
  "amanea-piano": ["akuhn-music-room"],
  "amanea-trone": ["akuhn-throne-room", "akuhn-terrace"],
  "amanea-allenna": ["akuhn-throne-room", "akuhn-war-room", "akuhn-terrace"],
  "amanea-tia": ["akuhn-music-room", "akuhn-war-room"],
  "amanea-naiah": ["akuhn-archives"],
  "amanea-calciterres": ["akuhn-archives", "akuhn-war-room"],
  "amanea-silence": ["akuhn-archives", "akuhn-terrace", "forbidden-sanctuary"],
  "amanea-ordinaire": ["akuhn-music-room", "akuhn-terrace"],
  "amanea-corps": ["akuhn-terrace", "akuhn-music-room"],
  "draven-des": ["forthaven-quarters", "forthaven-harbor", "imperial-road"],
  "draven-carte": ["forthaven-war-room", "algratal-palace-council"],
  "draven-chant": ["forthaven-harbor", "forthaven-memorial", "imperial-road"],
  "draven-vent": ["forthaven-ramparts", "imperial-road"],
  "draven-lineva": ["forthaven-quarters", "forthaven-war-room", "imperial-road", "algratal-palace-quarters"],
  "draven-relève": ["forthaven-harbor", "forthaven-ramparts"],
  "draven-café": ["imperial-road", "algratal-palace-quarters", "algratal-palace-council"],
  "draven-départ": ["forthaven-harbor", "imperial-road"],
};
