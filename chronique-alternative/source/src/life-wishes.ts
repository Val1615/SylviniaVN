/**
 * Vie quotidienne · envies et aspirations (PROPOSITION_VIE_V1 §4).
 * Envies : 1 à 3 actives, tirées chaque matin de façon déterministe, 1 à 3 jours, sans pénalité à l’expiration.
 * Aspirations : une active à la fois, 4 jalons, changeables sans perte (les jalons acquis le restent).
 * Aucune envie ne vise Bellirith, ni une scène intime : elles visent des lieux, des météos, des activités.
 */
import type { StatKey } from "./game-data";
import type { WeatherId } from "./weather";
import type { SeasonId } from "./calendar";
import type { ActivityId } from "./life-activities";
import type { LetterTheme } from "./life-initiative-texts";

export type WishCondition =
  | { type: "visit"; location?: string; spot?: string; weather?: WeatherId[]; periods?: number[] }
  | { type: "newSpot" }
  | { type: "gift"; category?: "aime"; character?: string }
  | { type: "buy"; gift: string }
  | { type: "activity"; activity?: ActivityId; character?: string; weather?: WeatherId[]; season?: SeasonId }
  | { type: "letter"; theme?: LetterTheme; character?: string }
  | { type: "job" }
  | { type: "invite" }
  | { type: "meet"; character: string };

export type WishReward = { stat?: StatKey; coins?: number };
export type WishTemplate = { id: string; text: string; condition: WishCondition; reward: WishReward; perCharacter?: boolean };

const BAD: WeatherId[] = ["pluie", "orage", "tempete"];

export const WISHES: WishTemplate[] = [
  { id: "mer-pluie", text: "Voir la mer de Forthaven sous la pluie", condition: { type: "visit", location: "forthaven", weather: BAD }, reward: { stat: "resonance" } },
  { id: "tartelette", text: "Goûter une tartelette aux baies lunaires", condition: { type: "buy", gift: "tartelette" }, reward: { coins: 6 } },
  { id: "the-clairieres", text: "S’offrir un thé des clairières", condition: { type: "buy", gift: "the" }, reward: { coins: 7 } },
  { id: "route-claire", text: "Marcher sur la route impériale par temps clair", condition: { type: "visit", location: "imperial-road", weather: ["clair", "voile"] }, reward: { stat: "audace" } },
  { id: "neige-dome", text: "Voir la neige tomber sur Mir’Aldas", condition: { type: "visit", location: "miraldas", weather: ["neige"] }, reward: { stat: "resonance" } },
  { id: "brume-foret", text: "Se perdre un peu dans la brume de la Forêt Interdite", condition: { type: "visit", location: "forbidden", weather: ["brume", "brume-dense"] }, reward: { stat: "audace" } },
  { id: "feux-verts", text: "Admirer les feux verts d’Akuhn’Nabad à la soirée", condition: { type: "visit", spot: "akuhn-terrace", periods: [3] }, reward: { stat: "resonance" } },
  { id: "aube-quais", text: "Voir l’aube se lever sur les quais de Forthaven", condition: { type: "visit", spot: "forthaven-harbor", periods: [0] }, reward: { stat: "sangFroid" } },
  { id: "observatoire", text: "Regarder la cité depuis l’observatoire, le soir venu", condition: { type: "visit", spot: "miraldas-observatory", periods: [3] }, reward: { stat: "lucidite" } },
  { id: "grand-marche", text: "Flâner au Grand Marché d’Al’Gratal", condition: { type: "visit", spot: "algratal-market" }, reward: { coins: 8 } },
  { id: "fleuve-bleu", text: "Faire halte au bord du Fleuve bleu", condition: { type: "visit", location: "river-halt" }, reward: { stat: "sangFroid" } },
  { id: "auberge", text: "Retrouver l’ambiance de l’Auberge du Forestier", condition: { type: "visit", location: "forestier" }, reward: { coins: 6 } },
  { id: "vent-dunes", text: "Sentir le vent des dunes à Tzekarun", condition: { type: "visit", location: "tzekarun", weather: ["sable", "vent", "chaleur", "clair"] }, reward: { stat: "audace" } },
  { id: "clairiere-echos", text: "Écouter le silence de la Clairière des Échos", condition: { type: "visit", location: "echo-clearing" }, reward: { stat: "resonance" } },
  { id: "soiree-avenues", text: "Passer une soirée dans les avenues d’Al’Gratal", condition: { type: "visit", spot: "algratal-streets", periods: [3] }, reward: { coins: 7 } },
  { id: "abri-orage", text: "Rester à l’abri pendant un orage", condition: { type: "visit", weather: ["orage", "tempete"] }, reward: { stat: "sangFroid" } },
  { id: "jour-brulant", text: "Chercher l’ombre par une journée brûlante", condition: { type: "visit", weather: ["chaleur", "canicule"] }, reward: { coins: 6 } },
  { id: "nouveau-coin", text: "Découvrir un sous-lieu où vous n’êtes jamais allé·e", condition: { type: "newSpot" }, reward: { stat: "audace" } },
  { id: "cadeau-juste", text: "Offrir un présent qui fait vraiment plaisir", condition: { type: "gift", category: "aime" }, reward: { coins: 10 } },
  { id: "activite-libre", text: "Partager une activité avec quelqu’un", condition: { type: "activity" }, reward: { stat: "resonance" } },
  { id: "lire-pluie", text: "Lire à l’abri pendant qu’il pleut", condition: { type: "activity", activity: "lire", weather: ["pluie", "orage", "tempete", "neige", "blizzard"] }, reward: { stat: "lucidite" } },
  { id: "promenade-printemps", text: "Faire une promenade de printemps", condition: { type: "activity", activity: "promenade", season: "printemps" }, reward: { stat: "resonance" } },
  { id: "pecher", text: "Pêcher quelque chose, même tout petit", condition: { type: "activity", activity: "pecher" }, reward: { coins: 8 } },
  { id: "cuisiner", text: "Cuisiner pour quelqu’un", condition: { type: "activity", activity: "cuisiner" }, reward: { stat: "resonance" } },
  { id: "entrainer", text: "S’entraîner avec quelqu’un", condition: { type: "activity", activity: "entrainer" }, reward: { stat: "sangFroid" } },
  { id: "partie", text: "Gagner, ou perdre, une partie d’échecs ou de cartes", condition: { type: "activity", activity: "jeu" }, reward: { stat: "lucidite" } },
  { id: "lettre", text: "Écrire une lettre", condition: { type: "letter" }, reward: { coins: 5 } },
  { id: "nouvelles", text: "Donner de vos nouvelles à quelqu’un", condition: { type: "letter", theme: "nouvelles" }, reward: { stat: "resonance" } },
  { id: "travail", text: "Terminer un travail rémunéré", condition: { type: "job" }, reward: { coins: 12 } },
  { id: "rendez-vous", text: "Honorer un rendez-vous que vous avez proposé", condition: { type: "invite" }, reward: { stat: "audace" } },
  { id: "moment-avec", text: "Passer un moment avec {name}", condition: { type: "meet", character: "{character}" }, reward: { stat: "resonance" }, perCharacter: true },
  { id: "activite-avec", text: "Partager une activité avec {name}", condition: { type: "activity", character: "{character}" }, reward: { coins: 9 }, perCharacter: true },
  { id: "ecrire-a", text: "Écrire à {name}", condition: { type: "letter", character: "{character}" }, reward: { stat: "lucidite" }, perCharacter: true },
];

/** Envies ciblant un personnage : jamais Bellirith (proposition §4, garde-fou du Désir). */
export const WISH_EXCLUDED_CHARACTERS = ["bellirith"];

export type AspirationStep = { id: string; label: string; key: string; target: number; reward: WishReward; listKey?: boolean; state?: "home" | "coins" };
export type Aspiration = { id: string; name: string; stat: StatKey; detail: string; title: string; keepsake: string; steps: [AspirationStep, AspirationStep, AspirationStep, AspirationStep]; needs?: string[] };

export const ASPIRATIONS: Aspiration[] = [
  {
    id: "coeur-cour", name: "Le Cœur de la Cour", stat: "lucidite", title: "Familier·ère de la Cour", keepsake: "asp-sceau-cour", needs: ["iriana", "tia"],
    detail: "Gagner la confiance de la cour impériale par la plume et la présence.",
    steps: [
      { id: "lettres", label: "Écrire deux lettres à Iriana ou à Tia", key: "letters:cour", target: 2, reward: { coins: 10 } },
      { id: "activite", label: "Partager une activité avec Iriana ou Tia", key: "activity-with:cour", target: 1, reward: { stat: "lucidite" } },
      { id: "present", label: "Offrir un présent apprécié à Iriana ou à Tia", key: "gift-aime:cour", target: 1, reward: { coins: 15 } },
      { id: "rendez-vous", label: "Honorer un rendez-vous à Al’Gratal", key: "invite-loc:algratal", target: 1, reward: { stat: "lucidite", coins: 30 } },
    ],
  },
  {
    id: "lame-forthaven", name: "La Lame de Forthaven", stat: "sangFroid", title: "Lame des remparts", keepsake: "asp-insigne-remparts", needs: ["lineva", "draven"],
    detail: "Tenir sa place à Forthaven, par l’entraînement et la fiabilité.",
    steps: [
      { id: "entrainements", label: "S’entraîner trois fois avec quelqu’un", key: "activity:entrainer", target: 3, reward: { coins: 10 } },
      { id: "avec", label: "S’entraîner avec Lineva ou Draven", key: "activity-with:forthaven", target: 1, reward: { stat: "sangFroid" } },
      { id: "tempete", label: "Se rendre à Forthaven par pluie, orage ou tempête", key: "visit-bad:forthaven", target: 1, reward: { coins: 15 } },
      { id: "rendez-vous", label: "Honorer un rendez-vous avec Lineva ou Draven", key: "invite-with:forthaven", target: 1, reward: { stat: "sangFroid", coins: 30 } },
    ],
  },
  {
    id: "route-sans-fin", name: "La Route sans fin", stat: "audace", title: "Voyageur·se sans fin", keepsake: "asp-boussole-route",
    detail: "Voir le plus de régions possible, quel que soit le ciel.",
    steps: [
      { id: "regions", label: "Visiter quatre régions différentes", key: "visit-locs", target: 4, listKey: true, reward: { coins: 10 } },
      { id: "intemperies", label: "Voyager malgré la météo", key: "weather-travel", target: 1, reward: { stat: "audace" } },
      { id: "promenades", label: "Faire trois promenades", key: "activity:promenade", target: 3, reward: { coins: 15 } },
      { id: "monde", label: "Visiter sept régions différentes", key: "visit-locs", target: 7, listKey: true, reward: { stat: "audace", coins: 30 } },
    ],
  },
  {
    id: "foyer", name: "Le Foyer", stat: "resonance", title: "Gardien·ne du foyer", keepsake: "asp-lanterne-foyer",
    detail: "Faire d’un logis un lieu où l’on aime revenir.",
    steps: [
      { id: "logis", label: "Posséder un logis", key: "home", target: 1, state: "home", reward: { coins: 10 } },
      { id: "repas", label: "Cuisiner trois fois avec quelqu’un", key: "activity:cuisiner", target: 3, reward: { stat: "resonance" } },
      { id: "chez-vous", label: "Partager une activité chez vous", key: "activity-home", target: 1, reward: { coins: 15 } },
      { id: "invite", label: "Honorer un rendez-vous à votre logis", key: "invite-home", target: 1, reward: { stat: "resonance", coins: 30 } },
    ],
  },
  {
    id: "ami-de-chacun", name: "L’Ami de chacun", stat: "resonance", title: "Ami·e de chacun", keepsake: "asp-ruban-liens",
    detail: "Tisser des liens simples avec beaucoup de monde.",
    steps: [
      { id: "trois", label: "Partager une activité avec trois personnes différentes", key: "partners", target: 3, listKey: true, reward: { coins: 10 } },
      { id: "lettres", label: "Écrire à trois personnes différentes", key: "correspondents", target: 3, listKey: true, reward: { stat: "resonance" } },
      { id: "six", label: "Partager une activité avec six personnes différentes", key: "partners", target: 6, listKey: true, reward: { coins: 15 } },
      { id: "rendez-vous", label: "Honorer deux rendez-vous proposés", key: "invites", target: 2, reward: { stat: "resonance", coins: 30 } },
    ],
  },
  {
    id: "marchand", name: "Le Marchand", stat: "lucidite", title: "Négociant·e avisé·e", keepsake: "asp-balance-marchand",
    detail: "Faire fructifier sa bourse et offrir juste.",
    steps: [
      { id: "achats", label: "Acheter cinq présents", key: "buy", target: 5, reward: { coins: 10 } },
      { id: "justes", label: "Offrir trois présents appréciés", key: "gift-aime", target: 3, reward: { stat: "lucidite" } },
      { id: "travaux", label: "Terminer trois travaux rémunérés", key: "jobs", target: 3, reward: { coins: 15 } },
      { id: "bourse", label: "Posséder 300 pièces à la fois", key: "coins", target: 300, state: "coins", reward: { stat: "lucidite", coins: 30 } },
    ],
  },
  {
    id: "lecteur-saisons", name: "Le Lecteur des Saisons", stat: "sangFroid", title: "Lecteur·rice des saisons", keepsake: "asp-almanach-saisons",
    detail: "Vivre le monde au rythme de son ciel et de ses envies.",
    steps: [
      { id: "envies", label: "Réaliser trois envies", key: "envies", target: 3, reward: { coins: 10 } },
      { id: "ciels", label: "Connaître quatre météos différentes sur place", key: "weathers", target: 4, listKey: true, reward: { stat: "sangFroid" } },
      { id: "huit", label: "Réaliser huit envies", key: "envies", target: 8, reward: { coins: 15 } },
      { id: "saisons", label: "Réaliser une envie dans deux saisons différentes", key: "envy-seasons", target: 2, listKey: true, reward: { stat: "sangFroid", coins: 30 } },
    ],
  },
];

/** Souvenirs de vitrine offerts à la fin d’une aspiration (source « story », sans personnage). */
export const ASPIRATION_KEEPSAKES = [
  { id: "asp-sceau-cour", name: "Sceau de cire de la Cour", description: "Remis à celles et ceux que la cour a appris à attendre.", icon: "⚜", source: "story" as const },
  { id: "asp-insigne-remparts", name: "Insigne des remparts", description: "Un fer usé que Forthaven ne donne qu’à qui est resté.", icon: "⛨", source: "story" as const },
  { id: "asp-boussole-route", name: "Boussole des routes sans fin", description: "Son verre est rayé par tous les chemins parcourus.", icon: "✣", source: "story" as const },
  { id: "asp-lanterne-foyer", name: "Lanterne du foyer", description: "Elle reste allumée tant que quelqu’un revient.", icon: "☼", source: "story" as const },
  { id: "asp-ruban-liens", name: "Ruban aux mille nœuds", description: "Chaque nœud est un nom, chaque nom un souvenir partagé.", icon: "∞", source: "story" as const },
  { id: "asp-balance-marchand", name: "Balance de changeur", description: "Juste, précise, et un peu vaniteuse.", icon: "⚖", source: "story" as const },
  { id: "asp-almanach-saisons", name: "Almanach des saisons", description: "Annoté de vos ciels, de vos envies et de vos jours.", icon: "❋", source: "story" as const },
];
