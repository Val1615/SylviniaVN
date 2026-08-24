import { GIFTS, type CharacterData, type GiftData } from "./game-data";

export type HousingTier = 1 | 2 | 3 | 4 | 5;

export type HousingProperty = {
  id: string;
  location: "algratal" | "forthaven" | "miraldas" | "akuhn";
  tier: HousingTier;
  name: string;
  category: string;
  description: string;
  price: number;
  background: string;
  spot: string;
};

export type DisplayItem = {
  id: string;
  name: string;
  description: string;
  icon: string;
  source: "market" | "story" | "date";
  character?: string;
};

export type HousingState = {
  propertyId?: string;
  purchasePrice: number;
  displayed: (string | null)[];
  residents: string[];
  homeDateHistory: string[];
  homeDateGifts: string[];
  residentMomentHistory: Record<string, string[]>;
  sharedMomentHistory: string[];
};

export const HOUSING_TIERS: Record<HousingTier, { label: string; short: string; basePrice: number }> = {
  1: { label: "Logis modeste", short: "Modeste", basePrice: 80 },
  2: { label: "Logis confortable", short: "Confortable", basePrice: 190 },
  3: { label: "Belle résidence", short: "Résidence", basePrice: 380 },
  4: { label: "Demeure prestigieuse", short: "Prestige", basePrice: 720 },
  5: { label: "Domaine d’exception", short: "Exception", basePrice: 1200 },
};

export const HOUSING_PATRONS: Record<string, string[]> = {
  algratal: ["iriana", "tia"],
  forthaven: ["draven", "lineva"],
  miraldas: ["saidin", "remerii"],
  akuhn: ["amanea", "allenna"],
};

const property = (
  location: HousingProperty["location"],
  tier: HousingTier,
  name: string,
  description: string,
  multiplier: number,
): HousingProperty => ({
  id: `${location}-${tier}`,
  location,
  tier,
  name,
  category: HOUSING_TIERS[tier].label,
  description,
  price: Math.round(HOUSING_TIERS[tier].basePrice * multiplier),
  background: `/assets/housing/${location}_${tier}.webp`,
  spot: `${location}-home-${tier}`,
});

export const HOUSING_PROPERTIES: HousingProperty[] = [
  property("algratal", 1, "Chambre des Hautes-Ruelles", "Une chambre simple et lumineuse, assez proche du palais pour entendre la ville s’éveiller sans appartenir à sa cour.", 1.15),
  property("algratal", 2, "Appartement du Croissant", "Un appartement blanc et or avec bibliothèque, bureau et fenêtre ouverte sur les flèches de la capitale.", 1.15),
  property("algratal", 3, "Résidence des Jardins suspendus", "Une résidence élégante où les bannières impériales rencontrent un confort réellement privé.", 1.15),
  property("algratal", 4, "Suite de la Cour solaire", "Une vaste suite de réception assez prestigieuse pour accueillir la haute cour sans lui céder votre intimité.", 1.15),
  property("algratal", 5, "Domaine du Phénix", "Un palais résidentiel baigné de soleil, avec salons, balcon et chambre monumentale au-dessus d’Al’Gratal.", 1.15),

  property("forthaven", 1, "Chambre des Docks", "Un refuge de pierre et de bois au-dessus du port, rude mais sec, où les cloches remplacent les horloges.", 1),
  property("forthaven", 2, "Logis du Guetteur", "Une chambre fonctionnelle avec bureau de navigation et vue directe sur les murailles du port.", 1),
  property("forthaven", 3, "Appartement de la Ville Haute", "Boiseries sombres, tentures bleues et terrasse : la mer entre ici sans le vacarme des quais.", 1),
  property("forthaven", 4, "Suite de l’Amirauté", "Une suite navale luxueuse, conçue pour travailler, recevoir et oublier parfois qu’une flotte attend dehors.", 1),
  property("forthaven", 5, "Villa des Grands Caps", "Une demeure ouverte sur l’océan, assez vaste pour faire du port entier le décor de votre salon.", 1),

  property("miraldas", 1, "Chambre des Apprentis", "Un petit refuge violet rempli de livres, de cristaux et d’une vue sur le chemin menant au Dôme.", 1.05),
  property("miraldas", 2, "Atelier-résidence", "Une chambre de mage confortable avec laboratoire discret et fenêtre circulaire sur la cité protégée.", 1.05),
  property("miraldas", 3, "Appartement sous le Dôme", "Une résidence ouverte et claire où la magie du Dôme transforme chaque soir en ciel violet.", 1.05),
  property("miraldas", 4, "Suite des Archimages", "Un vaste atelier privé, bibliothèque et chambre réunis sous de grandes arches cristallines.", 1.05),
  property("miraldas", 5, "Observatoire privé", "Un domaine arcanique monumental dont les astrolabes, cristaux et terrasses contemplent toute Mir’Aldas.", 1.05),

  property("akuhn", 1, "Chambre des Bas-Feux", "Une chambre ancienne dans les quartiers bas, austère mais sûre derrière ses murs noirs et sa lanterne verte.", 1.1),
  property("akuhn", 2, "Logis de la Pierre noire", "Un appartement gothique sobre, meublé de bois sombre et tourné vers les lumières d’Akuhn’Nabad.", 1.1),
  property("akuhn", 3, "Appartement des Lanternes vertes", "Une demeure raffinée avec foyer, bibliothèque et balcon au-dessus de la cité obscurcie.", 1.1),
  property("akuhn", 4, "Suite des Hautes Arches", "Une suite palatiale de pierre noire dont les immenses baies embrassent les tours de la capitale bannie.", 1.1),
  property("akuhn", 5, "Palais des Feux sombres", "Un domaine souverain aux salons vastes, aux cristaux verts et aux terrasses ouvertes sur tout Akuhn’Nabad.", 1.1),
];

export const STORY_KEEPSAKES: DisplayItem[] = [
  { id: "keepsake-hylee", name: "Flocon imparfait d’Hylee", description: "Une sculpture de glace stabilisée dont la branche asymétrique est précisément celle qu’Hylee préfère.", icon: "❄", source: "story", character: "hylee" },
  { id: "keepsake-remerii", name: "Feuillet annoté de Remerii", description: "Une mesure volontairement laissée imparfaite sous une forêt de corrections devenues inutiles.", icon: "♫", source: "story", character: "remerii" },
  { id: "keepsake-iriana", name: "Ruban sans blason d’Iriana", description: "Un ruban choisi au marché pour la seule raison qu’il lui plaisait et qu’il n’engageait aucun royaume.", icon: "⌁", source: "story", character: "iriana" },
  { id: "keepsake-valurn", name: "Jeton de la première mise", description: "Le véritable jeton que Valurn vous a laissé prendre. Aucune dette n’est gravée sur sa tranche.", icon: "◈", source: "story", character: "valurn" },
  { id: "keepsake-naiah", name: "Tasse ébréchée de Naïah", description: "Une tasse sauvée d’Akuhn’Nabad, plus précieuse pour ses souvenirs que pour sa valeur.", icon: "☕", source: "story", character: "naiah" },
  { id: "keepsake-lineva", name: "Clé de la relève", description: "La clé du coffre où Lineva a accepté d’enfermer ses rapports pendant une soirée entière.", icon: "⚿", source: "story", character: "lineva" },
  { id: "keepsake-saidin", name: "Aiguille d’une heure inconnue", description: "Une aiguille retirée d’une horloge afin qu’un instant puisse exister sans être prévu.", icon: "⌛", source: "story", character: "saidin" },
  { id: "keepsake-bellirith", name: "Gant sans enchantement", description: "Un gant noir qui neutralise les charmes et ne conserve que la chaleur réelle d’une main.", icon: "♢", source: "story", character: "bellirith" },
  { id: "keepsake-amanea", name: "Sceau de la soirée sans couronne", description: "Un sceau noir qu’Amanea a volontairement laissé vierge, puisqu’aucun ordre ne devait survivre à cette soirée.", icon: "♛", source: "story", character: "amanea" },
  { id: "keepsake-tia", name: "Sceau personnel de Tia", description: "Le petit sceau qui n’engage ni l’Empire ni la cour : seulement une femme ayant choisi d’écrire en son nom.", icon: "☼", source: "story", character: "tia" },
  { id: "keepsake-allenna", name: "Gantelet ouvert d’Allenna", description: "Un gantelet d’entraînement dont la paume a été volontairement découpée pour rappeler qu’une main peut protéger sans saisir.", icon: "⛨", source: "story", character: "allenna" },
  { id: "keepsake-draven", name: "Boussole de relève", description: "Une ancienne boussole de Forthaven dont Draven a confié l’aiguille à la génération qui commande désormais.", icon: "⌖", source: "story", character: "draven" },
];

export const HOME_DATE_GIFTS: DisplayItem[] = [
  { id: "homegift-hylee", name: "Photophore de givre", description: "La flamme ne chauffe pas, mais sa neige intérieure change avec l’humeur de la pièce.", icon: "❅", source: "date", character: "hylee" },
  { id: "homegift-remerii", name: "Métronome arcanique", description: "Il garde le tempo demandé, sauf lorsque Remerii décide qu’une imperfection mérite de durer.", icon: "♬", source: "date", character: "remerii" },
  { id: "homegift-iriana", name: "Oiseau mécanique sans blason", description: "Un petit oiseau de marché qui chante faux avec une assurance parfaitement apolitique.", icon: "♮", source: "date", character: "iriana" },
  { id: "homegift-valurn", name: "Carte blanche de Valurn", description: "Une carte sans règle, sans mise et sans signature, pliée une seule fois au milieu.", icon: "▱", source: "date", character: "valurn" },
  { id: "homegift-naiah", name: "Lanterne à luciole illusoire", description: "La luciole est fausse ; la lumière violette qu’elle répand et le rire lié à son souvenir sont bien réels.", icon: "✦", source: "date", character: "naiah" },
  { id: "homegift-lineva", name: "Maquette du premier navire", description: "Une coque simple taillée par Lineva pendant une relève trop calme pour demeurer honnête.", icon: "⛵", source: "date", character: "lineva" },
  { id: "homegift-saidin", name: "Montre qui ignore demain", description: "Son cadran n’indique que l’heure présente et refuse toute tentative de divination.", icon: "◷", source: "date", character: "saidin" },
  { id: "homegift-bellirith", name: "Miroir au tain honnête", description: "Un miroir sans charme, incapable de flatter ou de corriger la personne qui s’y regarde.", icon: "◐", source: "date", character: "bellirith" },
  { id: "homegift-amanea", name: "Coupe de basalte sans titre", description: "Une coupe sombre choisie par Amanea pour boire sans cérémonie dans une maison qui n’est pas sa cour.", icon: "♜", source: "date", character: "amanea" },
  { id: "homegift-tia", name: "Partition sans dernière mesure", description: "Tia en a retiré la conclusion officielle afin que la musique puisse s’arrêter lorsqu’elle le choisit.", icon: "♩", source: "date", character: "tia" },
  { id: "homegift-allenna", name: "Boîte de suture de campagne", description: "Une boîte parfaitement rangée, accompagnée d’une note rappelant que demander du renfort reste une compétence médicale.", icon: "✚", source: "date", character: "allenna" },
  { id: "homegift-draven", name: "Nœud marin de l’Amiral", description: "Un nœud de relève monté sur bois, conçu pour rappeler que tenir signifie aussi savoir transmettre.", icon: "≋", source: "date", character: "draven" },
];

const marketDisplayItems = (gifts: GiftData[] = GIFTS): DisplayItem[] => gifts.map((gift) => ({
  ...gift,
  source: "market" as const,
}));

export const DISPLAY_ITEMS: DisplayItem[] = [
  ...marketDisplayItems(),
  ...STORY_KEEPSAKES,
  ...HOME_DATE_GIFTS,
];

export const STORY_KEEPSAKE_BY_CHARACTER = Object.fromEntries(STORY_KEEPSAKES.map((item) => [item.character!, item.id]));
export const HOME_GIFT_BY_CHARACTER = Object.fromEntries(HOME_DATE_GIFTS.map((item) => [item.character!, item.id]));

export function emptyHousingState(): HousingState {
  return {
    purchasePrice: 0,
    displayed: [null, null, null],
    residents: [],
    homeDateHistory: [],
    homeDateGifts: [],
    residentMomentHistory: {},
    sharedMomentHistory: [],
  };
}

export function propertyById(id?: string) {
  return HOUSING_PROPERTIES.find((entry) => entry.id === id);
}

export function propertyBySpot(spot?: string) {
  return HOUSING_PROPERTIES.find((entry) => entry.spot === spot);
}

export function displayItemById(id?: string | null) {
  return DISPLAY_ITEMS.find((entry) => entry.id === id);
}

export function housingDiscount(location: string, relationships: Record<string, { trust: number }>) {
  const patrons = HOUSING_PATRONS[location] || [];
  const best = patrons.reduce((winner, character) => {
    const trust = relationships[character]?.trust || 0;
    return trust > winner.trust ? { character, trust } : winner;
  }, { character: "", trust: 0 });
  return {
    ...best,
    percent: Math.min(50, Math.floor(best.trust / 10) * 5),
  };
}

export function discountedPropertyPrice(property: HousingProperty, relationships: Record<string, { trust: number }>) {
  const discount = housingDiscount(property.location, relationships);
  return Math.max(1, Math.round(property.price * (1 - discount.percent / 100)));
}

export const HOME_INTIMACY_CITY: Partial<Record<string, HousingProperty["location"]>> = {
  draven: "forthaven",
  lineva: "forthaven",
  iriana: "algratal",
  tia: "algratal",
  saidin: "miraldas",
  amanea: "akuhn",
  allenna: "akuhn",
};

export function housingSaleValue(housing: HousingState) {
  return Math.floor((housing.purchasePrice || 0) * 0.75);
}

export function housingResidentsEligible(characters: CharacterData[]) {
  return characters;
}
