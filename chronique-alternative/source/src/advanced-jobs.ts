export type MenuCategory = "starter" | "main" | "drink" | "dessert";

export type TavernMenuItem = {
  id: string;
  name: string;
  category: MenuCategory;
  description: string;
  tags: string[];
  price: number;
};

export const MENU_CATEGORY_LABELS: Record<MenuCategory, string> = {
  starter: "Entrées",
  main: "Plats",
  drink: "Boissons",
  dessert: "Desserts",
};

export const TAVERN_MENU: TavernMenuItem[] = [
  { id: "onion-broth", name: "Bouillon aux oignons", category: "starter", description: "Oignons bruns, thym et pain grillé", tags: ["chaud", "vegetarien", "leger", "rapide"], price: 3 },
  { id: "venison-terrine", name: "Terrine de chevreuil", category: "starter", description: "Cornichons doux et moutarde noire", tags: ["froid", "viande", "sale"], price: 5 },
  { id: "root-salad", name: "Salade de racines", category: "starter", description: "Betterave, noix et pousses amères", tags: ["froid", "vegetarien", "leger", "fruit-sec"], price: 4 },
  { id: "garlic-mushrooms", name: "Champignons à l’ail", category: "starter", description: "Poêlés au beurre et aux herbes", tags: ["chaud", "vegetarien", "savoureux"], price: 4 },
  { id: "smoked-trout", name: "Truite fumée", category: "starter", description: "Poivre rose et citron de rivière", tags: ["froid", "poisson", "leger", "fume"], price: 6 },
  { id: "herb-cake", name: "Galette aux herbes", category: "starter", description: "Croustillante, servie avec crème aigre", tags: ["chaud", "vegetarien", "rapide"], price: 4 },
  { id: "hunter-egg", name: "Œuf du chasseur", category: "starter", description: "Œuf mollet, lard et jus réduit", tags: ["chaud", "viande", "riche"], price: 5 },

  { id: "forest-stew", name: "Ragoût du Forestier", category: "main", description: "Cerf, carottes et bière brune", tags: ["chaud", "viande", "riche", "alcool-cuisine"], price: 10 },
  { id: "savory-pie", name: "Tourte du relais", category: "main", description: "Volaille, poireaux et croûte dorée", tags: ["chaud", "viande", "four", "copieux"], price: 9 },
  { id: "braised-trout", name: "Truite braisée", category: "main", description: "Pommes de terre et sauce citronnée", tags: ["chaud", "poisson", "leger"], price: 11 },
  { id: "honey-chicken", name: "Poulet au miel noir", category: "main", description: "Rôti, épicé, servi avec navets", tags: ["chaud", "viande", "sucre-sale", "four"], price: 12 },
  { id: "mushroom-civet", name: "Civet de champignons", category: "main", description: "Baies sombres, lentilles et sauge", tags: ["chaud", "vegetarien", "riche"], price: 9 },
  { id: "cold-board", name: "Planche du voyageur", category: "main", description: "Viande fumée, fromage et pain noir", tags: ["froid", "viande", "rapide", "sale"], price: 8 },
  { id: "herb-dumplings", name: "Quenelles d’herbes", category: "main", description: "Bouillon clair et légumes verts", tags: ["chaud", "vegetarien", "leger"], price: 8 },
  { id: "boar-skewer", name: "Brochette de sanglier", category: "main", description: "Oignons brûlés et sauce au poivre", tags: ["chaud", "viande", "epice", "copieux"], price: 13 },

  { id: "spring-water", name: "Eau de source", category: "drink", description: "Fraîche, servie immédiatement", tags: ["froid", "sans-alcool", "leger", "rapide"], price: 1 },
  { id: "smoked-tea", name: "Thé fumé", category: "drink", description: "Thé noir, écorce et vapeur", tags: ["chaud", "sans-alcool", "amer"], price: 3 },
  { id: "berry-infusion", name: "Infusion de baies", category: "drink", description: "Acidulée et légèrement sucrée", tags: ["chaud", "sans-alcool", "fruite", "sucre"], price: 3 },
  { id: "honey-milk", name: "Lait au miel", category: "drink", description: "Doux, chaud et sans alcool", tags: ["chaud", "sans-alcool", "sucre", "doux"], price: 4 },
  { id: "blonde-ale", name: "Bière blonde", category: "drink", description: "Claire, fraîche et légère", tags: ["froid", "alcool", "leger"], price: 4 },
  { id: "oak-stout", name: "Brune du Chêne", category: "drink", description: "Malt sombre et finale torréfiée", tags: ["froid", "alcool", "amer", "sombre"], price: 5 },
  { id: "dry-cider", name: "Cidre sec", category: "drink", description: "Pomme verte et bulles fines", tags: ["froid", "alcool", "fruite"], price: 4 },
  { id: "spiced-wine", name: "Vin épicé", category: "drink", description: "Réchauffé avec cannelle et girofle", tags: ["chaud", "alcool", "epice", "riche"], price: 6 },

  { id: "berry-tart", name: "Tartelette aux baies", category: "dessert", description: "Baies rouges et pâte croustillante", tags: ["froid", "fruite", "sucre", "leger"], price: 5 },
  { id: "honey-cake", name: "Gâteau au miel", category: "dessert", description: "Moelleux, noix et miel brun", tags: ["sucre", "fruit-sec", "riche"], price: 5 },
  { id: "poached-pear", name: "Poire pochée", category: "dessert", description: "Sirop d’épices et crème légère", tags: ["fruite", "sucre", "leger", "sans-four"], price: 6 },
  { id: "apple-turnover", name: "Chausson aux pommes", category: "dessert", description: "Encore chaud, sucre et cannelle", tags: ["chaud", "fruite", "sucre", "four"], price: 5 },
  { id: "vanilla-custard", name: "Crème à la vanille", category: "dessert", description: "Très douce, servie froide", tags: ["froid", "sucre", "doux"], price: 5 },
  { id: "black-biscuits", name: "Biscuits au seigle", category: "dessert", description: "Secs, peu sucrés, faciles à emporter", tags: ["rapide", "leger", "peu-sucre"], price: 3 },
  { id: "cheese-honey", name: "Fromage blanc au miel", category: "dessert", description: "Crémeux, frais et légèrement salé", tags: ["froid", "sucre", "doux", "leger"], price: 4 },
];

export type ServiceCustomer = {
  id: string;
  name: string;
  title: string;
  request: string;
  mode: "direct" | "suggestion";
  categories: MenuCategory[];
  valid: Partial<Record<MenuCategory, string[]>>;
};

type SuggestionTemplate = Omit<ServiceCustomer, "id" | "name">;

const SERVICE_NAMES = [
  "Une éclaireuse couverte de pluie", "Un messager au manteau rouge", "Deux chasseuses partageant une table",
  "Un artisan aux mains brûlées", "Une herboriste de la lisière", "Une famille en route pour Mir’Aldas",
  "Un garde en fin de ronde", "Une musicienne après sa scène", "Un marchand de sel", "Une novice du Conclave",
  "Un marin loin de Forthaven", "Une vieille habituée", "Un cartographe épuisé", "Une apothicaire pressée",
  "Trois courriers de la frontière", "Une garde en permission", "Un couple de colporteurs", "Une mage qui surveille son capuchon",
  "Un pêcheur du Fleuve bleu", "Une couturière de la capitale", "Un guide des Serres Rocheuses", "Une diplomate sans escorte",
  "Un apprenti mécanicien tzekarii", "Une guérisseuse de Forthaven", "Deux scribes en désaccord", "Un pèlerin couvert de poussière",
  "Une relieuse de Mir’Aldas", "Un convoyeur de cristaux", "Une mère et son fils", "Un vétéran silencieux",
  "Une marchande de lanternes", "Un étudiant des barrières", "Une contrebandière repentie", "Un officier en civil", "Une danseuse du palais",
];

export const SUGGESTIONS: SuggestionTemplate[] = [
  { title: "Quelque chose qui réchauffe", mode: "suggestion", categories: ["starter", "drink"], request: "« Suggérez-moi une entrée chaude et une boisson chaude sans alcool. J’ai passé la journée sous la pluie. »", valid: { starter: ["onion-broth", "garlic-mushrooms", "herb-cake", "hunter-egg"], drink: ["smoked-tea", "berry-infusion", "honey-milk"] } },
  { title: "Un repas léger", mode: "suggestion", categories: ["main", "drink", "dessert"], request: "« Un plat léger, une boisson sans alcool et un dessert fruité. Je reprends la route avant la nuit. »", valid: { main: ["braised-trout", "herb-dumplings"], drink: ["spring-water", "smoked-tea", "berry-infusion", "honey-milk"], dessert: ["berry-tart", "poached-pear"] } },
  { title: "Sans viande", mode: "suggestion", categories: ["starter", "main"], request: "« Je vous laisse choisir, mais ni viande ni poisson. Une entrée et un plat bien chauds. »", valid: { starter: ["onion-broth", "garlic-mushrooms", "herb-cake"], main: ["mushroom-civet", "herb-dumplings"] } },
  { title: "Service très rapide", mode: "suggestion", categories: ["main", "drink"], request: "« Ce que vous pouvez servir le plus vite : un plat froid et une boisson sans alcool. »", valid: { main: ["cold-board"], drink: ["spring-water"] } },
  { title: "Une fin de soirée douce", mode: "suggestion", categories: ["drink", "dessert"], request: "« Rien à manger de salé. Une boisson douce sans alcool et un dessert froid, s’il vous plaît. »", valid: { drink: ["berry-infusion", "honey-milk"], dessert: ["berry-tart", "vanilla-custard", "cheese-honey"] } },
  { title: "Le goût du feu", mode: "suggestion", categories: ["starter", "main", "drink"], request: "« Choisissez pour moi : du chaud du début à la fin, avec un plat de viande. La boisson peut être alcoolisée. »", valid: { starter: ["onion-broth", "garlic-mushrooms", "herb-cake", "hunter-egg"], main: ["forest-stew", "savory-pie", "honey-chicken", "boar-skewer"], drink: ["spiced-wine"] } },
  { title: "Peu sucré", mode: "suggestion", categories: ["drink", "dessert"], request: "« Une boisson amère et le dessert le moins sucré de la carte. »", valid: { drink: ["smoked-tea", "oak-stout"], dessert: ["black-biscuits"] } },
  { title: "Repas de fête", mode: "suggestion", categories: ["starter", "main", "drink", "dessert"], request: "« Faites-moi découvrir l’auberge : une entrée froide, un plat copieux, une boisson fruitée et un dessert au miel. »", valid: { starter: ["venison-terrine", "root-salad", "smoked-trout"], main: ["savory-pie", "boar-skewer"], drink: ["berry-infusion", "dry-cider"], dessert: ["honey-cake", "cheese-honey"] } },
  { title: "Poisson et fraîcheur", mode: "suggestion", categories: ["starter", "main", "drink"], request: "« Du poisson en entrée ou en plat — dans les deux si vous en avez — et quelque chose de frais à boire. »", valid: { starter: ["smoked-trout"], main: ["braised-trout"], drink: ["spring-water", "blonde-ale", "dry-cider"] } },
  { title: "Avant la garde", mode: "suggestion", categories: ["starter", "drink"], request: "« Une entrée nourrissante et une boisson sans alcool. Rien qui ralentisse ma relève. »", valid: { starter: ["hunter-egg", "garlic-mushrooms", "herb-cake"], drink: ["spring-water", "smoked-tea", "berry-infusion"] } },
  { title: "Après le froid", mode: "suggestion", categories: ["main", "dessert"], request: "« Un plat vraiment chaud, puis quelque chose de doux et froid pour calmer les épices. »", valid: { main: ["forest-stew", "honey-chicken", "boar-skewer"], dessert: ["vanilla-custard", "cheese-honey"] } },
  { title: "Repas de rivière", mode: "suggestion", categories: ["starter", "main"], request: "« Servez-moi la rivière deux fois, mais sans viande terrestre. »", valid: { starter: ["smoked-trout"], main: ["braised-trout"] } },
  { title: "Sans cuisson au four", mode: "suggestion", categories: ["main", "dessert"], request: "« Un plat et un dessert qui ne sortent pas du four. Je n’ai pas le temps d’attendre une fournée. »", valid: { main: ["forest-stew", "braised-trout", "mushroom-civet", "cold-board", "herb-dumplings", "boar-skewer"], dessert: ["berry-tart", "poached-pear", "vanilla-custard", "black-biscuits", "cheese-honey"] } },
  { title: "Amer et salé", mode: "suggestion", categories: ["starter", "drink"], request: "« Une entrée salée et la boisson la plus amère. Pas de douceur. »", valid: { starter: ["venison-terrine", "smoked-trout", "hunter-egg"], drink: ["smoked-tea", "oak-stout"] } },
  { title: "Pour une enfant", mode: "suggestion", categories: ["drink", "dessert"], request: "« Une boisson chaude sans alcool et un dessert doux, sans goût amer. »", valid: { drink: ["honey-milk", "berry-infusion"], dessert: ["honey-cake", "vanilla-custard", "cheese-honey"] } },
  { title: "Route encore longue", mode: "suggestion", categories: ["starter", "main", "drink"], request: "« Léger du début à la fin et sans alcool. Je dois marcher jusqu’à l’aube. »", valid: { starter: ["onion-broth", "root-salad", "smoked-trout", "herb-cake"], main: ["braised-trout", "herb-dumplings"], drink: ["spring-water", "smoked-tea", "berry-infusion"] } },
  { title: "Tout aux herbes", mode: "suggestion", categories: ["starter", "main"], request: "« Je veux goûter ce que la forêt donne sans chasse : des herbes en entrée et en plat. »", valid: { starter: ["garlic-mushrooms", "herb-cake"], main: ["mushroom-civet", "herb-dumplings"] } },
  { title: "Dîner très copieux", mode: "suggestion", categories: ["main", "drink", "dessert"], request: "« Votre plat le plus copieux, une boisson sombre et un dessert riche. »", valid: { main: ["forest-stew", "savory-pie", "boar-skewer"], drink: ["oak-stout", "spiced-wine"], dessert: ["honey-cake"] } },
  { title: "Fraîcheur du quai", mode: "suggestion", categories: ["starter", "drink", "dessert"], request: "« Tout doit être frais : l’entrée, la boisson et le dessert. »", valid: { starter: ["venison-terrine", "root-salad", "smoked-trout"], drink: ["spring-water", "blonde-ale", "oak-stout", "dry-cider"], dessert: ["berry-tart", "vanilla-custard", "cheese-honey"] } },
  { title: "Aucune viande", mode: "suggestion", categories: ["starter", "main", "dessert"], request: "« Trois services, aucun animal dans les deux premiers, puis un dessert fruité. »", valid: { starter: ["onion-broth", "root-salad", "garlic-mushrooms", "herb-cake"], main: ["mushroom-civet", "herb-dumplings"], dessert: ["berry-tart", "poached-pear", "apple-turnover"] } },
  { title: "Goût de fumée", mode: "suggestion", categories: ["starter", "drink"], request: "« Quelque chose de fumé dans l’assiette et dans la tasse — mais pas d’alcool. »", valid: { starter: ["smoked-trout"], drink: ["smoked-tea"] } },
  { title: "Douceur salée", mode: "suggestion", categories: ["main", "dessert"], request: "« Un plat sucré-salé et un dessert qui garde une pointe de sel. »", valid: { main: ["honey-chicken"], dessert: ["cheese-honey"] } },
  { title: "Halte sans alcool", mode: "suggestion", categories: ["starter", "main", "drink", "dessert"], request: "« Le repas complet, sans alcool nulle part, et rien de trop lourd. »", valid: { starter: ["onion-broth", "root-salad", "smoked-trout", "herb-cake"], main: ["braised-trout", "herb-dumplings"], drink: ["spring-water", "smoked-tea", "berry-infusion", "honey-milk"], dessert: ["berry-tart", "poached-pear", "black-biscuits", "cheese-honey"] } },
  { title: "Pomme et épices", mode: "suggestion", categories: ["drink", "dessert"], request: "« Une boisson à la pomme et un dessert chaud aux épices. »", valid: { drink: ["dry-cider"], dessert: ["apple-turnover"] } },
  { title: "Petit budget", mode: "suggestion", categories: ["starter", "drink", "dessert"], request: "« Une entrée, une boisson et un dessert pour dix pièces au maximum. »", valid: { starter: ["onion-broth", "root-salad", "garlic-mushrooms", "herb-cake"], drink: ["spring-water", "smoked-tea", "berry-infusion"], dessert: ["black-biscuits"] } },
  { title: "Chasseur affamé", mode: "suggestion", categories: ["starter", "main"], request: "« De la viande dès l’entrée et un plat assez solide pour tenir jusqu’au prochain relais. »", valid: { starter: ["venison-terrine", "hunter-egg"], main: ["forest-stew", "savory-pie", "honey-chicken", "boar-skewer"] } },
  { title: "Matin difficile", mode: "suggestion", categories: ["starter", "drink"], request: "« Quelque chose de chaud et léger, puis une boisson amère sans alcool. »", valid: { starter: ["onion-broth", "garlic-mushrooms", "herb-cake"], drink: ["smoked-tea"] } },
  { title: "Table des marins", mode: "suggestion", categories: ["main", "drink"], request: "« Un plat salé qui se mange vite et une boisson fraîche, alcoolisée si elle est légère. »", valid: { main: ["cold-board"], drink: ["spring-water", "blonde-ale", "dry-cider"] } },
  { title: "Dessert à emporter", mode: "suggestion", categories: ["drink", "dessert"], request: "« Une boisson servie immédiatement et un dessert qui supportera la route. »", valid: { drink: ["spring-water"], dessert: ["black-biscuits", "apple-turnover"] } },
  { title: "Couleurs de la forêt", mode: "suggestion", categories: ["starter", "main", "dessert"], request: "« Des racines, des champignons, puis des baies. Je veux la forêt sans la chasse. »", valid: { starter: ["root-salad"], main: ["mushroom-civet"], dessert: ["berry-tart"] } },
];

const CATEGORY_ORDER: MenuCategory[] = ["starter", "main", "drink", "dessert"];
const DIRECT_MASKS: MenuCategory[][] = [
  ["starter"], ["main"], ["drink"], ["dessert"], ["main", "drink"], ["starter", "main"], ["main", "dessert"],
  ["starter", "drink", "dessert"], ["starter", "main", "drink"], ["main", "drink", "dessert"],
  ["starter", "main", "dessert"], ["starter", "main", "drink", "dessert"],
];

function hashSeed(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function ranked<T>(values: T[], seed: string) {
  return values
    .map((value, index) => ({ value, rank: hashSeed(`${seed}:${index}`) }))
    .sort((left, right) => left.rank - right.rank)
    .map(({ value }) => value);
}

function sessionSlice<T>(values: T[], count: number, variant: number, seed: string) {
  if (!values.length) return [];
  const safeCount = Math.min(count, values.length);
  const sessions = Math.max(1, Math.floor(values.length / safeCount));
  const cycle = Math.floor(variant / sessions);
  const slot = variant % sessions;
  return ranked(values, `${seed}:cycle:${cycle}`).slice(slot * safeCount, slot * safeCount + safeCount);
}

function sentenceList(values: string[]) {
  if (values.length <= 1) return values[0] || "";
  return `${values.slice(0, -1).join(", ")} et ${values.at(-1)}`;
}

export function serviceCustomers(variant: number): ServiceCustomer[] {
  const sessionNames = sessionSlice(SERVICE_NAMES, 7, variant, "service-names");
  const selectedMasks = [
    ranked(DIRECT_MASKS.filter((mask) => mask.length === 1), `service-single:${variant}`)[0],
    ...ranked(DIRECT_MASKS.filter((mask) => mask.length > 1), `service-mask:${variant}`).slice(0, 3),
  ];
  const direct = selectedMasks.map((categories, index) => {
    const valid: Partial<Record<MenuCategory, string[]>> = {};
    const names = categories.map((category, categoryIndex) => {
      const pool = TAVERN_MENU.filter((item) => item.category === category);
      const item = pool[hashSeed(`service-item:${variant}:${index}:${categoryIndex}`) % pool.length];
      valid[category] = [item.id];
      return item.name.toLocaleLowerCase("fr-FR");
    });
    return {
      id: `direct-${variant}-${index}`,
      name: sessionNames[index],
      title: categories.length === 1 ? "Commande brève" : "Commande précise",
      request: `« Pour moi : ${sentenceList(names)}. Ce sera tout. »`,
      mode: "direct" as const,
      categories,
      valid,
    };
  });
  const suggestions = sessionSlice(SUGGESTIONS, 3, variant, "service-suggestion").map((template, index) => ({
    ...template,
    id: `suggestion-${variant}-${index}`,
    name: sessionNames[4 + index],
  }));
  return ranked([...direct, ...suggestions], `service-order:${variant}`);
}

export function serviceOrderIsValid(customer: ServiceCustomer, selections: Partial<Record<MenuCategory, string>>) {
  const selectedCategories = CATEGORY_ORDER.filter((category) => selections[category]);
  if (selectedCategories.length !== customer.categories.length) return false;
  if (selectedCategories.some((category) => !customer.categories.includes(category))) return false;
  return customer.categories.every((category) => Boolean(selections[category] && customer.valid[category]?.includes(selections[category]!)));
}

export type InspectionHotspot = {
  id: string;
  label: string;
  detail: string;
  icon: string;
  x: number;
  y: number;
  size: number;
  kind: "routine" | "anomaly" | "decoy";
};

export type InspectionRoom = {
  title: string;
  subtitle: string;
  background: string;
  hotspots: InspectionHotspot[];
  taskCount: number;
};

const ROUTINE_HOTSPOTS: Omit<InspectionHotspot, "id">[] = [
  { label: "Changer les draps", detail: "Les draps propres sont tirés et le linge usagé rejoint le panier.", icon: "▱", x: 72, y: 62, size: 14, kind: "routine" },
  { label: "Nettoyer le sol", detail: "La poussière, les traces de bottes et les aiguilles de pin disparaissent.", icon: "⌁", x: 51, y: 86, size: 16, kind: "routine" },
  { label: "Essuyer la table", detail: "La cire, les miettes et les cercles de tasse sont retirés.", icon: "▤", x: 36, y: 58, size: 11, kind: "routine" },
  { label: "Vérifier la fenêtre", detail: "Le loquet ferme, la pluie ne passe plus et le rebord est sec.", icon: "▥", x: 64, y: 34, size: 12, kind: "routine" },
];

const ANOMALIES: Omit<InspectionHotspot, "id" | "kind">[] = [
  { label: "Lanterne fendue", detail: "Le verre est cassé ; elle doit être remplacée avant la nuit.", icon: "⚠", x: 18, y: 62, size: 8 },
  { label: "Serrure forcée", detail: "Le métal autour du pêne porte une marque fraîche.", icon: "⚠", x: 4, y: 45, size: 8 },
  { label: "Herbes moisies", detail: "Le bouquet mural a pris l’humidité et contamine le plâtre.", icon: "⚠", x: 20, y: 32, size: 8 },
  { label: "Broc ébréché", detail: "Un éclat manque sur le bord ; le broc ne doit plus être servi.", icon: "⚠", x: 91, y: 64, size: 8 },
  { label: "Fuite sous le tonneau", detail: "Une auréole sombre s’étend lentement entre les lattes.", icon: "⚠", x: 96, y: 80, size: 9 },
  { label: "Cadre décroché", detail: "Un clou cède et le cadre menace de tomber pendant la nuit.", icon: "⚠", x: 28, y: 38, size: 8 },
  { label: "Poutre vermoulue", detail: "Une pluie très fine de sciure trahit le bois attaqué.", icon: "⚠", x: 45, y: 12, size: 10 },
  { label: "Rideau détrempé", detail: "Le tissu touche une infiltration et doit être séché immédiatement.", icon: "⚠", x: 77, y: 38, size: 9 },
  { label: "Montant du lit fendu", detail: "La fissure est assez profonde pour céder sous un voyageur.", icon: "⚠", x: 87, y: 60, size: 9 },
  { label: "Coffre encore tiède", detail: "Une rune de voyage dissimulée chauffe sous la poignée.", icon: "⚠", x: 24, y: 74, size: 10 },
  { label: "Bougie renversée", detail: "La cire chaude approche dangereusement du rideau.", icon: "⚠", x: 41, y: 53, size: 8 },
  { label: "Tache sous le tapis", detail: "Une odeur de vin remonte d’une tache grossièrement dissimulée.", icon: "⚠", x: 59, y: 78, size: 10 },
  { label: "Loquet de volet desserré", detail: "La prochaine rafale ouvrira le volet sur la tête du client.", icon: "⚠", x: 69, y: 28, size: 8 },
  { label: "Mite dans la couverture", detail: "De petits trous frais entourent une larve cachée dans la laine.", icon: "⚠", x: 81, y: 70, size: 9 },
  { label: "Encrier renversé", detail: "L’encre a coulé derrière la table et atteint déjà le mur.", icon: "⚠", x: 34, y: 63, size: 8 },
  { label: "Pierre de foyer descellée", detail: "La pierre bouge sous la pression et laisse passer une chaleur anormale.", icon: "⚠", x: 12, y: 70, size: 10 },
  { label: "Clou sous le drap", detail: "Une pointe sortie du cadre traverse presque la paillasse.", icon: "⚠", x: 78, y: 58, size: 8 },
  { label: "Fiole oubliée", detail: "Le liquide sans étiquette réagit à la lumière de la fenêtre.", icon: "⚠", x: 38, y: 50, size: 8 },
  { label: "Nid dans le conduit", detail: "Des brindilles obstruent l’évacuation et retiennent la fumée.", icon: "⚠", x: 16, y: 22, size: 10 },
  { label: "Miroir piqué de magie", detail: "Le reflet accuse un battement de retard qui n’était pas déclaré.", icon: "⚠", x: 54, y: 38, size: 9 },
  { label: "Écharde sur la chaise", detail: "Une longue écharde se soulève exactement sous l’accoudoir.", icon: "⚠", x: 43, y: 67, size: 8 },
  { label: "Corde de cloche coupée", detail: "La corde d’appel a été tranchée puis nouée pour masquer la rupture.", icon: "⚠", x: 93, y: 28, size: 8 },
  { label: "Givre sous le coffre", detail: "Une plaque de froid persiste alors qu’aucun enchantement n’est enregistré.", icon: "⚠", x: 25, y: 80, size: 10 },
  { label: "Pied de table instable", detail: "Une cale manque ; le plateau bascule dès qu’on y pose une cruche.", icon: "⚠", x: 35, y: 72, size: 9 },
  { label: "Cendres dans l’armoire", detail: "Une poignée de cendres noires souille le linge propre.", icon: "⚠", x: 8, y: 55, size: 9 },
  { label: "Carreau descellé", detail: "Le verre vibre dans son plomb et laissera entrer la pluie.", icon: "⚠", x: 63, y: 31, size: 8 },
  { label: "Souricière armée", detail: "Le piège a été laissé sous le lit, là où un client posera ses pieds.", icon: "⚠", x: 68, y: 81, size: 9 },
  { label: "Plume de corbeau humide", detail: "Une plume fraîche sous l’oreiller contredit la chambre fermée depuis l’aube.", icon: "⚠", x: 82, y: 54, size: 8 },
  { label: "Rune sous la poignée", detail: "Un glyphe minuscule attire la main vers la porte au lieu de la repousser.", icon: "⚠", x: 95, y: 48, size: 8 },
  { label: "Tasse fêlée", detail: "La fissure ne se voit qu’à contre-jour et cédera avec une boisson chaude.", icon: "⚠", x: 40, y: 57, size: 8 },
];

const ROOM_TITLES = [
  ["Chambre sous les combles", "Un voyageur est attendu avant la prochaine cloche."],
  ["Chambre donnant sur la forêt", "La pluie de la nuit a pu laisser davantage que de la boue."],
  ["Chambre du fond du palier", "Le dernier client est parti très tôt et sans prévenir."],
  ["Chambre des deux fenêtres", "Le courant d’air a déplacé plus d’un objet pendant la nuit."],
  ["Suite du marchand de sel", "Les bagages sont partis, mais une forte odeur demeure."],
  ["Petite chambre au-dessus des cuisines", "La chaleur complique l’inspection du bois et des étoffes."],
  ["Dortoir des messagers", "Six personnes ont quitté les lieux avant le lever du jour."],
  ["Chambre à la tapisserie verte", "Un familier aurait dormi ici sans être déclaré."],
  ["Alcôve de la tour", "L’orage a frappé le mur extérieur toute la nuit."],
  ["Chambre du vieux poêle", "Le client affirme n’avoir jamais allumé le foyer."],
  ["Suite de la voyageuse bleue", "La serrure est restée fermée, selon le registre."],
  ["Chambre au parquet neuf", "Les réparations d’hier doivent encore être contrôlées."],
  ["Dortoir des chasseurs", "La boue et les armes ont mis le mobilier à rude épreuve."],
  ["Chambre de l’horloger", "De petites pièces mécaniques ont pu rester dans les recoins."],
  ["Suite du palier nord", "Une réclamation vague parle d’un bruit derrière la cloison."],
] as const;

export function inspectionRoom(variant: number, roomIndex: number): InspectionRoom {
  const sessionCount = Math.floor(ANOMALIES.length / 6);
  const cycle = Math.floor(variant / sessionCount);
  const slot = variant % sessionCount;
  const ordered = ranked(ANOMALIES, `inspection-cycle:${cycle}`);
  const start = slot * 6 + roomIndex * 2;
  const selected = ordered.slice(start, start + 2);
  const anomalies = selected.map((hotspot, index) => ({ ...hotspot, id: `r${variant}-${roomIndex}-anomaly-${index}`, kind: "anomaly" as const }));
  const decoys = ranked(ordered.filter((hotspot) => !selected.includes(hotspot)), `inspection-decoys:${variant}:${roomIndex}`).slice(0, 4).map((hotspot, index) => ({ ...hotspot, id: `r${variant}-${roomIndex}-decoy-${index}`, label: "Rien à signaler", detail: "L’objet est usé, mais propre et fonctionnel.", icon: "·", kind: "decoy" as const }));
  const routine = ROUTINE_HOTSPOTS.map((hotspot, index) => ({ ...hotspot, id: `r${roomIndex}-routine-${index}` }));
  const title = ROOM_TITLES[(slot * 3 + roomIndex) % ROOM_TITLES.length];
  return { title: title[0], subtitle: title[1], background: "/assets/backgrounds/forestier_room.webp", hotspots: [...routine, ...anomalies, ...decoys], taskCount: routine.length + anomalies.length };
}

export type PetitionAction = "discard" | "approve" | "empress" | "guard";
export type Petition = {
  id: string;
  petitioner: string;
  district: string;
  text: string;
  clue: string;
  action: PetitionAction;
  className: "ordinaire" | "majeure" | "suspecte" | "absurde";
  special?: { id: string; label: string; accepted?: boolean };
};

export const PETITION_ACTIONS: { id: PetitionAction; label: string; icon: string }[] = [
  { id: "discard", label: "Jeter la requête", icon: "⌫" },
  { id: "approve", label: "Accorder", icon: "✓" },
  { id: "empress", label: "Transmettre à l’impératrice", icon: "♜" },
  { id: "guard", label: "Signaler à la garde", icon: "⚑" },
];

export const PETITIONS: Petition[] = [
  { id: "aqueduct", petitioner: "Maîtresse des eaux Selma Virel", district: "Trois-Ponts", text: "Une fissure nouvelle traverse l’aqueduc principal. Deux arches vibrent à chaque ouverture des vannes.", clue: "Le rapport porte les contreseings de trois ingénieurs et concerne près de huit mille habitants.", action: "empress", className: "majeure" },
  { id: "fever", petitioner: "Maison des guérisseuses", district: "Quartier des Tisserands", text: "Dix-sept cas d’une fièvre inconnue ont été recensés en deux jours, sans foyer commun identifié.", clue: "Les registres de soins et les prélèvements sont joints sous sceau sanitaire.", action: "empress", className: "majeure" },
  { id: "front-reinforcement", petitioner: "Commandement de Forthaven", district: "Front occidental", text: "Les morts-vivants ont franchi deux lignes de bornes. La garnison demande des renforts et du sel consacré.", clue: "Le pli de Lineva est authentifié par la capitainerie et arrivé par relais prioritaire.", action: "empress", className: "majeure" },
  { id: "bridge", petitioner: "Guilde des charretiers", district: "Porte du Sud", text: "Le tablier d’un pont commercial s’affaisse. La guilde sollicite sa fermeture et une déviation provisoire.", clue: "La dépense relève de l’intendance ; aucun quartier ne sera isolé.", action: "approve", className: "ordinaire" },
  { id: "permit", petitioner: "Compagnie des Cent Lanternes", district: "Place des Verriers", text: "La troupe renouvelle son permis annuel pour trois représentations sans feu magique.", clue: "Le dossier est complet, les taxes payées et aucun incident n’a été déclaré l’an dernier.", action: "approve", className: "ordinaire" },
  { id: "bakery", petitioner: "Corporation des boulangers", district: "Rue du Levain", text: "Les fournées de nuit nécessitent une dérogation sonore pendant la semaine du solstice.", clue: "La même dérogation est accordée chaque année dans ce quartier commerçant.", action: "approve", className: "ordinaire" },
  { id: "fake-seal", petitioner: "Conseillère Mirven — prétendument", district: "Réserves impériales", text: "Le porteur exige l’ouverture immédiate des réserves de cristaux et l’absence de tout inventaire.", clue: "Le sceau appartient à une conseillère morte depuis six mois ; la cire sent encore le dissolvant.", action: "guard", className: "suspecte" },
  { id: "tunnel", petitioner: "Association des caves fraîches", district: "Sous la Galerie d’Or", text: "L’association demande le droit de creuser un tunnel nocturne jusqu’aux fondations du palais.", clue: "Les plans joints masquent trois sorties et portent des mesures militaires exactes.", action: "guard", className: "suspecte" },
  { id: "poison", petitioner: "Fournisseur anonyme", district: "Cuisines du palais", text: "Une livraison gratuite de poudre soporifique est proposée pour « améliorer le repos de la cour ».", clue: "Le livreur demande que les caisses échappent au contrôle des apothicaires.", action: "guard", className: "suspecte" },
  { id: "ghost-payroll", petitioner: "Capitaine Joren", district: "Caserne de l’Est", text: "Le capitaine réclame la solde de quarante soldats supplémentaires pour une unité sans registre.", clue: "Les signatures se répètent toutes les cinq lignes et les témoins sont introuvables.", action: "guard", className: "suspecte" },
  { id: "curtains", petitioner: "Comte Edras de Velours", district: "Haute Cour", text: "Son voisin possède des rideaux d’un rouge outrageusement similaire aux siens et doit être sommé de les brûler.", clue: "Dix-neuf pages décrivent la nuance ; aucune loi, menace ou victime n’est mentionnée.", action: "discard", className: "absurde" },
  { id: "moon-tax", petitioner: "Astrologue Bérin", district: "Observatoire privé", text: "La lune éclaire son jardin sans autorisation. Il demande que l’astre acquitte une taxe rétroactive.", clue: "Le pétitionnaire joint une facture adressée au ciel.", action: "discard", className: "absurde", special: { id: "invoice-moon", label: "Faire contresigner la facture par Saidin" } },
  { id: "goat", petitioner: "Villages de Ronce et d’Aulne", district: "Route septentrionale", text: "Chaque village revendique une chèvre qui change de camp chaque fois qu’on tente de la saisir.", clue: "La chèvre a mangé les deux actes de propriété ; le conflit bloque désormais le marché hebdomadaire.", action: "approve", className: "ordinaire", special: { id: "goat-judge", label: "Nommer la chèvre médiatrice officielle", accepted: true } },
  { id: "bells", petitioner: "Dormeurs de l’avenue Basse", district: "Avenue des Cloches", text: "Les habitants demandent que la cloche de la sixième heure cesse de sonner avant la sixième heure.", clue: "Le mécanisme retarde de vingt minutes ; l’horloger attend simplement une autorisation d’entretien.", action: "approve", className: "ordinaire" },
  { id: "duel-pigeons", petitioner: "Maître de duel Corvin", district: "Jardins publics", text: "Il sollicite le classement des pigeons comme adversaires militaires après la perte de son déjeuner.", clue: "Le document comporte un dessin très précis du principal suspect ailé.", action: "discard", className: "absurde", special: { id: "pigeon-medal", label: "Décorer le pigeon pour victoire tactique" } },
  { id: "invisible-statue", petitioner: "Sculptrice Naëlle", district: "Nouvelle promenade", text: "Elle réclame paiement pour une statue parfaitement invisible, livrée à un emplacement qu’elle refuse d’indiquer.", clue: "Aucun bon de commande n’existe et le socle fourni pèse moins qu’une assiette.", action: "discard", className: "absurde" },
  { id: "school-roof", petitioner: "Rectrice des écoles du Fleuve", district: "Rive bleue", text: "Trois salles de classe prennent l’eau et une poutre a chuté pendant la nuit.", clue: "L’intendance peut financer les réparations sans arbitrage impérial ; le devis est contrôlé.", action: "approve", className: "ordinaire" },
  { id: "terrace-permit", petitioner: "Auberge des Trois Couronnes", district: "Avenue centrale", text: "L’auberge demande l’extension permanente de sa terrasse sur la voie des convois.", clue: "Le formulaire est ordinaire, mais il manque le plan de circulation et l’avis obligatoire des charretiers.", action: "discard", className: "ordinaire" },
  { id: "missing-receipts", petitioner: "Négociant Orvel", district: "Grand Marché", text: "Le négociant réclame le remboursement de marchandises prétendument saisies lors d’un contrôle.", clue: "Il ne joint ni reçu, ni inventaire, ni numéro de contrôle ; le bureau lui a déjà demandé ces pièces deux fois.", action: "discard", className: "ordinaire" },
  { id: "closed-fountain", petitioner: "Comité de la rue Haute", district: "Rue Haute", text: "Le comité veut faire condamner une fontaine publique afin de réserver l’espace à ses voitures.", clue: "Aucun défaut n’est signalé et les trois rues voisines dépendent de ce point d’eau.", action: "discard", className: "ordinaire" },
  { id: "border-envoy", petitioner: "Ambassade de Mir’Aldas", district: "Chancellerie", text: "Une délégation indépendante demande une entrevue secrète au sujet d’une fracture temporelle stable.", clue: "Le sceau arcanique est authentique et l’affaire engage directement les relations de l’Empire.", action: "empress", className: "majeure" },
  { id: "dragon-chimney", petitioner: "Ramoneur Pel", district: "Toits de l’Ouest", text: "Un dragon miniature occupe une cheminée et exige trois amandes par jour pour ne pas enfumer la maison.", clue: "La créature est légale, inoffensive et relève du bureau des familiers domestiques.", action: "approve", className: "ordinaire", special: { id: "dragon-contract", label: "Négocier deux amandes et une noisette", accepted: true } },
  { id: "night-map", petitioner: "Copiste sans licence", district: "Proximité des catacombes", text: "Le copiste vend une carte complète des passages de garde sous le palais et demande l’immunité.", clue: "Deux patrouilles disparues sont marquées avant même la publication des rapports.", action: "guard", className: "suspecte" },
  { id: "statue-hat", petitioner: "Cercle des bonnes manières", district: "Place impériale", text: "La statue du fondateur reste tête nue par grand froid et porterait atteinte à la dignité de la capitale.", clue: "Le cercle fournit déjà un chapeau de pierre de cent quatre-vingts kilos.", action: "discard", className: "absurde", special: { id: "hat-ceremony", label: "Organiser une cérémonie du chapeau" } },
  { id: "western-ward", petitioner: "Corps des arcanistes frontaliers", district: "Marche occidentale", text: "La barrière du front perd un ancrage chaque nuit et son effondrement ouvrirait la route aux morts.", clue: "Six rapports concordants et une pierre d’ancrage fissurée accompagnent le pli prioritaire.", action: "empress", className: "majeure" },
  { id: "dune-treaty", petitioner: "Délégation tzekarii", district: "Chancellerie", text: "Tzekar’ûn propose un accord d’eau et de transit engageant trois provinces impériales.", clue: "Le texte modifie les frontières douanières et requiert la signature personnelle d’Iriana.", action: "empress", className: "majeure" },
  { id: "time-fracture", petitioner: "Observatoire de Mir’Aldas", district: "Ciel septentrional", text: "Une fracture temporelle stable montre chaque nuit une capitale détruite qui n’existe dans aucun registre.", clue: "Les mesures ont été répétées par quatre équipes indépendantes et la faille grandit.", action: "empress", className: "majeure" },
  { id: "harbor-blockade", petitioner: "Capitainerie de Forthaven", district: "Mer d’Azur", text: "Trois navires sans pavillon bloquent le chenal militaire et refusent toute inspection.", clue: "La situation menace le ravitaillement du front et peut provoquer un conflit maritime.", action: "empress", className: "majeure" },
  { id: "succession-dispute", petitioner: "Conseil de la province d’Astreval", district: "Chancellerie", text: "Deux héritiers mobilisent leurs gardes après la disparition simultanée des actes de succession.", clue: "Une guerre provinciale est possible avant la prochaine lune ; les deux délégations attendent un arbitrage souverain.", action: "empress", className: "majeure" },
  { id: "black-rain", petitioner: "Prévôté des vallées", district: "Vallée des Ormes", text: "Une pluie noire stérilise les puits de neuf villages et réagit aux sorts de purification.", clue: "L’intendance locale est dépassée et l’origine magique pourrait toucher la capitale par le Fleuve bleu.", action: "empress", className: "majeure" },
  { id: "street-stalls", petitioner: "Association des marchands de nuit", district: "Rue des Étoffes", text: "Les étaliers demandent une heure d’ouverture supplémentaire pendant le solstice.", clue: "La garde et les riverains ont donné leur accord ; le formulaire tarifaire est complet.", action: "approve", className: "ordinaire" },
  { id: "well-repair", petitioner: "Syndic du quartier des Potiers", district: "Place des Jarres", text: "Le mécanisme du puits public doit être remplacé avant la saison sèche.", clue: "Le devis est contrôlé, la somme relève du budget d’entretien et aucun arbitrage politique n’est requis.", action: "approve", className: "ordinaire" },
  { id: "chimney-code", petitioner: "Guilde des ramoneurs", district: "Toits du Sud", text: "La guilde propose une inspection annuelle obligatoire des conduits des auberges.", clue: "Le règlement existant prévoit cette mise à jour ; les coûts sont couverts par les licences.", action: "approve", className: "ordinaire" },
  { id: "garden-gate", petitioner: "Jardiniers de l’avenue Haute", district: "Jardins impériaux extérieurs", text: "Une grille de service doit être déplacée de trois pas pour laisser passer les charrettes d’engrais.", clue: "Les plans sont visés par l’architecte et la modification ne touche aucune enceinte de sécurité.", action: "approve", className: "ordinaire" },
  { id: "public-benches", petitioner: "Syndicat des copistes âgés", district: "Allée des Archives", text: "Le syndicat demande quatre bancs supplémentaires le long de la montée vers la bibliothèque.", clue: "L’emplacement est validé, le bois déjà budgété et l’entretien relève du quartier.", action: "approve", className: "ordinaire" },
  { id: "sleeping-guards", petitioner: "Fournisseur de tisanes Karel", district: "Caserne du palais", text: "Il offre gratuitement une infusion destinée à rendre les gardes ‘plus dociles pendant les inspections’.", clue: "L’échantillon contient un narcotique interdit et le fournisseur exige l’anonymat.", action: "guard", className: "suspecte" },
  { id: "blank-passes", petitioner: "Clerc sans matricule", district: "Porte impériale", text: "Le clerc réclame cinquante laissez-passer vierges déjà marqués du sceau de la chancellerie.", clue: "Aucun service ne commande de laissez-passer non nominatifs et le matricule appartient à un agent disparu.", action: "guard", className: "suspecte" },
  { id: "sewer-keys", petitioner: "Compagnie de dératisation", district: "Égouts du palais", text: "La compagnie demande toutes les clés des grilles souterraines pour travailler sans escorte pendant la nuit.", clue: "Son existence légale date d’hier et son adresse correspond à un entrepôt abandonné.", action: "guard", className: "suspecte" },
  { id: "counterfeit-grain", petitioner: "Courtier Vassel", district: "Greniers impériaux", text: "Le courtier propose de remplacer discrètement le grain des réserves par une variété ‘plus légère à compter’.", clue: "Les échantillons sont mêlés de cendre et le prix inclut le silence des inspecteurs.", action: "guard", className: "suspecte" },
  { id: "hidden-observer", petitioner: "Institut des portraits", district: "Salle du Conseil", text: "L’Institut souhaite installer un miroir d’étude derrière le trône sans en informer les personnes observées.", clue: "Le miroir contient un dispositif de transmission vers une cave louée sous un faux nom.", action: "guard", className: "suspecte" },
  { id: "cloud-fence", petitioner: "Baron de Haut-Ciel", district: "Domaine privé", text: "Un nuage traverse quotidiennement sa propriété sans payer le péage du pont.", clue: "Le baron exige la construction d’une clôture verticale jusqu’aux étoiles.", action: "discard", className: "absurde" },
  { id: "left-handed-spoons", petitioner: "Ligue des couverts équitables", district: "Banquets publics", text: "La Ligue demande que chaque cuillère soit déclinée en version droitière et gauchère.", clue: "Le dessin joint représente deux cuillères parfaitement identiques.", action: "discard", className: "absurde", special: { id: "spoon-study", label: "Commander une étude sur l’orientation des soupes" } },
  { id: "silent-rooster", petitioner: "Voisinage du Coq Muet", district: "Faubourg oriental", text: "Les habitants réclament une amende contre un coq qui refuse de chanter le matin.", clue: "Le propriétaire joint une attestation certifiant que l’animal est, en effet, très silencieux.", action: "discard", className: "absurde" },
  { id: "royal-cat", petitioner: "Chat gris, représenté par son humain", district: "Bibliothèque basse", text: "Le chat demande un titre de noblesse en raison de ses services contre trois souris.", clue: "L’empreinte de patte est authentique ; aucune crise institutionnelle n’est signalée.", action: "discard", className: "absurde", special: { id: "cat-title", label: "Le nommer inspecteur honoraire des coussins" } },
  { id: "backward-parade", petitioner: "Société du progrès réversible", district: "Avenue impériale", text: "La Société veut faire défiler toute la capitale à reculons pour ‘corriger le sens de l’Histoire’.", clue: "Le parcours traverse les escaliers du palais et le budget ne prévoit aucun guérisseur.", action: "discard", className: "absurde" },
];

export function petitionDeck(variant: number) {
  const picked = [
    ...sessionSlice(PETITIONS.filter((petition) => petition.className === "majeure"), 2, variant, "petition-major"),
    ...sessionSlice(PETITIONS.filter((petition) => petition.className === "ordinaire"), 3, variant, "petition-ordinary"),
    ...sessionSlice(PETITIONS.filter((petition) => petition.className === "suspecte"), 2, variant, "petition-suspicious"),
    ...sessionSlice(PETITIONS.filter((petition) => petition.className === "absurde"), 2, variant, "petition-absurd"),
  ];
  return ranked(picked, `petition-order:${variant}`);
}

export type AssemblySlotType = "drive" | "core" | "safety" | "output";
export type AssemblyPart = { id: string; name: string; icon: string; type: AssemblySlotType; detail: string };
export type AssemblySlot = { type: AssemblySlotType; label: string; requirement: string; part: string; rotation: number };
export type AssemblyBlueprint = { id: string; name: string; purpose: string; slots: AssemblySlot[]; calibration: number[] };

export const ASSEMBLY_PARTS: AssemblyPart[] = [
  { id: "bronze-axis", name: "Axe de bronze denté", icon: "╂", type: "drive", detail: "Rotation lente, forte chaleur, aucun retour magique." },
  { id: "silver-axis", name: "Axe d’argent filé", icon: "╀", type: "drive", detail: "Rapide et conducteur ; fragile sous une charge lourde." },
  { id: "ceramic-axis", name: "Axe de céramique", icon: "┼", type: "drive", detail: "Isole la chaleur, mais supporte mal les chocs." },
  { id: "obsidian-disk", name: "Disque d’obsidienne", icon: "◆", type: "core", detail: "Absorbe les impulsions sans les amplifier." },
  { id: "amber-capacitor", name: "Condensateur d’ambre", icon: "◇", type: "core", detail: "Stocke une charge brève et la restitue d’un bloc." },
  { id: "prism-core", name: "Prisme amplificateur", icon: "◈", type: "core", detail: "Multiplie le flux ; exige une évacuation parfaite." },
  { id: "ground-braid", name: "Tresse de masse", icon: "⌁", type: "safety", detail: "Évacue la surcharge vers le bâti et le sol." },
  { id: "spring-vent", name: "Évent à ressort", icon: "≋", type: "safety", detail: "Libère la pression mécanique par impulsions." },
  { id: "mirror-guard", name: "Garde-miroir", icon: "◒", type: "safety", detail: "Renvoie les flux au lieu de les dissiper." },
  { id: "small-gear", name: "Pignon démultiplicateur", icon: "⚙", type: "output", detail: "Transmet un mouvement lent à une roue plus petite." },
  { id: "belt-wheel", name: "Roue à courroie", icon: "◎", type: "output", detail: "Sortie souple pour une pompe ou un ventilateur." },
  { id: "pulse-hammer", name: "Marteau d’impulsion", icon: "⊣", type: "output", detail: "Convertit la charge en frappes régulières." },
];

const BLUEPRINTS: AssemblyBlueprint[] = [
  { id: "courier", name: "Régulateur de courrier des dunes", purpose: "Maintenir un coffre de messager à température stable pendant une traversée.", calibration: [29, 62, 44], slots: [
    { type: "drive", label: "Entraînement", requirement: "Rotation lente, chaleur continue · encoche au nord", part: "bronze-axis", rotation: 0 },
    { type: "core", label: "Cœur", requirement: "Absorber sans renvoyer · veine vers l’est", part: "obsidian-disk", rotation: 90 },
    { type: "safety", label: "Sécurité", requirement: "Évacuer la charge vers le bâti · tresse au sud", part: "ground-braid", rotation: 180 },
    { type: "output", label: "Sortie", requirement: "Réduire la vitesse · dent-guide à l’ouest", part: "small-gear", rotation: 270 },
  ] },
  { id: "mist-pump", name: "Pompe de condensation des brumes", purpose: "Actionner une pompe souple sans laisser la magie remonter vers la citerne.", calibration: [67, 36, 73], slots: [
    { type: "drive", label: "Entraînement", requirement: "Isoler l’humidité et la chaleur · encoche à l’est", part: "ceramic-axis", rotation: 90 },
    { type: "core", label: "Cœur", requirement: "Stocker une impulsion brève · veine au sud", part: "amber-capacitor", rotation: 180 },
    { type: "safety", label: "Sécurité", requirement: "Libérer la pression par à-coups · ressort à l’ouest", part: "spring-vent", rotation: 270 },
    { type: "output", label: "Sortie", requirement: "Entraîner une pompe par courroie · gorge au nord", part: "belt-wheel", rotation: 0 },
  ] },
  { id: "forge-hammer", name: "Marteau d’atelier arcanique", purpose: "Transformer un flux vif en frappes régulières sans fissurer l’enclume.", calibration: [48, 76, 24], slots: [
    { type: "drive", label: "Entraînement", requirement: "Rotation rapide et conductrice · encoche au sud", part: "silver-axis", rotation: 180 },
    { type: "core", label: "Cœur", requirement: "Amplifier un flux contrôlé · pointe au nord", part: "prism-core", rotation: 0 },
    { type: "safety", label: "Sécurité", requirement: "Évacuer plutôt que réfléchir · tresse à l’est", part: "ground-braid", rotation: 90 },
    { type: "output", label: "Sortie", requirement: "Produire des frappes · tête à l’ouest", part: "pulse-hammer", rotation: 270 },
  ] },
  { id: "archive-clock", name: "Horloge des plans scellés", purpose: "Faire avancer une aiguille sans transmettre de Résonance aux archives.", calibration: [38, 58, 81], slots: [
    { type: "drive", label: "Entraînement", requirement: "Isoler tout courant magique · encoche à l’ouest", part: "ceramic-axis", rotation: 270 },
    { type: "core", label: "Cœur", requirement: "Absorber l’écho des plans · veine au nord", part: "obsidian-disk", rotation: 0 },
    { type: "safety", label: "Sécurité", requirement: "Relâcher la tension mécanique · ressort à l’est", part: "spring-vent", rotation: 90 },
    { type: "output", label: "Sortie", requirement: "Démultiplier vers l’aiguille · dent-guide au sud", part: "small-gear", rotation: 180 },
  ] },
  { id: "caravan-winch", name: "Treuil de caravane des dunes", purpose: "Lever une charge lourde sans transmettre la chaleur du sable aux câbles.", calibration: [72, 41, 63], slots: [
    { type: "drive", label: "Entraînement", requirement: "Isoler la chaleur et supporter l’effort · encoche au nord", part: "ceramic-axis", rotation: 0 },
    { type: "core", label: "Cœur", requirement: "Stocker la traction avant relâche · veine à l’ouest", part: "amber-capacitor", rotation: 270 },
    { type: "safety", label: "Sécurité", requirement: "Libérer la pression mécanique · ressort au sud", part: "spring-vent", rotation: 180 },
    { type: "output", label: "Sortie", requirement: "Transmettre par courroie · gorge à l’est", part: "belt-wheel", rotation: 90 },
  ] },
  { id: "forge-fan", name: "Ventilateur de forge noire", purpose: "Maintenir un souffle constant sans renvoyer les étincelles dans le cœur du mécanisme.", calibration: [24, 69, 52], slots: [
    { type: "drive", label: "Entraînement", requirement: "Rotation rapide · encoche à l’est", part: "silver-axis", rotation: 90 },
    { type: "core", label: "Cœur", requirement: "Absorber les retours de flamme · veine au sud", part: "obsidian-disk", rotation: 180 },
    { type: "safety", label: "Sécurité", requirement: "Renvoyer les étincelles vers la cheminée · miroir au nord", part: "mirror-guard", rotation: 0 },
    { type: "output", label: "Sortie", requirement: "Faire tourner la turbine · gorge à l’ouest", part: "belt-wheel", rotation: 270 },
  ] },
  { id: "dune-compass", name: "Compas d’orientation souterrain", purpose: "Produire une impulsion lisible même sous une tempête chargée de Résonance.", calibration: [55, 33, 78], slots: [
    { type: "drive", label: "Entraînement", requirement: "Rotation conductrice et vive · encoche au nord", part: "silver-axis", rotation: 0 },
    { type: "core", label: "Cœur", requirement: "Amplifier un signal très faible · pointe à l’est", part: "prism-core", rotation: 90 },
    { type: "safety", label: "Sécurité", requirement: "Renvoyer les parasites hors du cadran · miroir au sud", part: "mirror-guard", rotation: 180 },
    { type: "output", label: "Sortie", requirement: "Démultiplier vers l’aiguille · dent-guide à l’ouest", part: "small-gear", rotation: 270 },
  ] },
  { id: "obsidian-press", name: "Presse à tablettes d’obsidienne", purpose: "Convertir une charge brève en frappes lentes sans faire éclater les moules.", calibration: [44, 82, 31], slots: [
    { type: "drive", label: "Entraînement", requirement: "Rotation lente sous forte charge · encoche au sud", part: "bronze-axis", rotation: 180 },
    { type: "core", label: "Cœur", requirement: "Stocker une poussée unique · veine au nord", part: "amber-capacitor", rotation: 0 },
    { type: "safety", label: "Sécurité", requirement: "Évacuer la surcharge dans le bâti · tresse à l’ouest", part: "ground-braid", rotation: 270 },
    { type: "output", label: "Sortie", requirement: "Produire des frappes régulières · tête à l’est", part: "pulse-hammer", rotation: 90 },
  ] },
  { id: "cistern-valve", name: "Vanne de citerne nocturne", purpose: "Ouvrir une réserve d’eau par impulsions sans contaminer son enchantement de conservation.", calibration: [61, 27, 74], slots: [
    { type: "drive", label: "Entraînement", requirement: "Isoler l’humidité · encoche à l’ouest", part: "ceramic-axis", rotation: 270 },
    { type: "core", label: "Cœur", requirement: "Absorber la Résonance de l’eau · veine à l’est", part: "obsidian-disk", rotation: 90 },
    { type: "safety", label: "Sécurité", requirement: "Relâcher la pression à chaque fermeture · ressort au nord", part: "spring-vent", rotation: 0 },
    { type: "output", label: "Sortie", requirement: "Frapper la vanne par impulsions · tête au sud", part: "pulse-hammer", rotation: 180 },
  ] },
  { id: "signal-printer", name: "Imprimeur de signaux frontaliers", purpose: "Marquer des bandes de veille à grande vitesse sans amplifier les messages magiques.", calibration: [35, 66, 47], slots: [
    { type: "drive", label: "Entraînement", requirement: "Rotation rapide et stable · encoche à l’ouest", part: "silver-axis", rotation: 270 },
    { type: "core", label: "Cœur", requirement: "Absorber chaque impulsion après lecture · veine au nord", part: "obsidian-disk", rotation: 0 },
    { type: "safety", label: "Sécurité", requirement: "Évacuer les résidus dans le bâti · tresse à l’est", part: "ground-braid", rotation: 90 },
    { type: "output", label: "Sortie", requirement: "Réduire la vitesse du rouleau · dent-guide au sud", part: "small-gear", rotation: 180 },
  ] },
];

export const ROTATION_LABELS: Record<number, string> = { 0: "Nord", 90: "Est", 180: "Sud", 270: "Ouest" };
export function assemblyBlueprint(variant: number) { return BLUEPRINTS[variant % BLUEPRINTS.length]; }

export type HarvestSense = "shadow" | "echo" | "warmth";
export type HarvestNode = {
  id: string;
  name: string;
  icon: string;
  x: number;
  y: number;
  sense: HarvestSense;
  real: boolean;
  reading: Record<HarvestSense, string>;
};

export const HARVEST_TOOLS: { id: HarvestSense; label: string; icon: string; guide: string }[] = [
  { id: "shadow", label: "Lanterne d’ombre", icon: "◒", guide: "La pousse véritable garde une ombre unique et stable." },
  { id: "echo", label: "Clochette d’écho", icon: "◌", guide: "La pousse véritable ne répond qu’une seule fois." },
  { id: "warmth", label: "Gant thermique", icon: "◇", guide: "La pousse véritable reste froide sous le brouillard." },
];

const HARVEST_SPECIES = [
  ["Belladone de brume", "✤", "shadow"], ["Mousse de veille", "❈", "warmth"], ["Racine du guetteur", "⌁", "echo"],
  ["Fleur-miroir", "✧", "shadow"], ["Lichen des songes", "❉", "warmth"], ["Graine de veille", "◉", "echo"],
  ["Champignon-lanterne", "♧", "shadow"], ["Feuille d’oubli", "❧", "echo"], ["Ortie lunaire", "♢", "warmth"],
  ["Rose des marais", "✿", "shadow"], ["Bulbe chuchotant", "◍", "echo"], ["Fougère de givre", "❋", "warmth"],
  ["Muguet des revenants", "❀", "echo"], ["Sauge des seuils", "❦", "warmth"], ["Trèfle sans reflet", "♧", "shadow"],
  ["Iris de la veille", "✾", "shadow"], ["Ronce murmurante", "⌇", "echo"], ["Mousse de lune noire", "✺", "warmth"],
  ["Pavot des passages", "✹", "shadow"], ["Acorus des eaux mortes", "♒", "warmth"], ["Liane des pas perdus", "〰", "echo"],
  ["Digitale de minuit", "❃", "shadow"], ["Tubercule d’écho", "◒", "echo"], ["Cresson des brumes", "❊", "warmth"],
  ["Épine d’argent", "✵", "shadow"], ["Amanite du silence", "♤", "echo"], ["Menthe de givre", "❆", "warmth"],
  ["Orchidée des ruines", "❁", "shadow"], ["Jonc des voix basses", "〽", "echo"], ["Primevère froide", "✣", "warmth"],
] as const;

const GROWTH_STATES = ["jeune pousse", "en floraison", "chargée de rosée", "après la mue", "tige jumelle", "couronne pâle", "racines hautes", "spores ouvertes", "feuillage nocturne", "forme hivernale"];

const POSITIONS = [[12, 24], [29, 18], [48, 28], [70, 20], [86, 34], [20, 58], [40, 68], [62, 55], [82, 72], [51, 84], [8, 78], [92, 56]];

export function harvestNodes(variant: number, wave: number): HarvestNode[] {
  const species = ranked([...HARVEST_SPECIES], `harvest-species:${variant}:${wave}`).slice(0, 9);
  const positions = ranked(POSITIONS, `harvest-position:${variant}:${wave}`);
  return species.map(([name, icon, sense], index) => {
    const real = index < 4;
    const [x, y] = positions[index];
    return {
      id: `harvest-${variant}-${wave}-${index}`,
      name: `${name} · ${GROWTH_STATES[(variant * 3 + wave * 5 + index) % GROWTH_STATES.length]}`,
      icon,
      x,
      y,
      sense,
      real,
      reading: {
        shadow: sense === "shadow" ? (real ? "Ombre unique, immobile" : "Deux ombres se croisent") : "Les contours se perdent dans la brume",
        echo: sense === "echo" ? (real ? "Un tintement, puis le silence" : "Le tintement répond avant le geste") : "Aucun écho interprétable",
        warmth: sense === "warmth" ? (real ? "Froid net et constant" : "La chaleur arrive avec un temps de retard") : "Température brouillée par la rosée",
      },
    };
  });
}

export type MarketTactic = "direct" | "bundle" | "guarantee" | "barter";
export type MarketCustomer = {
  id: string;
  name: string;
  item: string;
  icon: string;
  opening: string;
  clue: string;
  cost: number;
  base: number;
  budget: number;
  preference: MarketTactic;
  kind: "regular" | "careful" | "bulk" | "barter" | "scam";
  special?: { label: string; result: string };
};

export const MARKET_TACTICS: { id: MarketTactic; label: string; detail: string }[] = [
  { id: "direct", label: "Prix net", detail: "Aucun ajout, marge intacte" },
  { id: "bundle", label: "Faire un lot", detail: "Valeur perçue +3 · coût +1" },
  { id: "guarantee", label: "Garantir l’objet", detail: "Confiance +2 · coût +1" },
  { id: "barter", label: "Proposer un troc", detail: "Utile aux client·es sans liquidités" },
];

const MARKET_CASES: Omit<MarketCustomer, "id">[] = [
  { name: "Une noble trop détachée", item: "Oiseau mécanique", icon: "♢", opening: "« C’est décoratif. Cinq pièces, pour vous éviter de le remballer. »", clue: "Elle revient toucher l’aile pour la troisième fois.", cost: 6, base: 12, budget: 14, preference: "guarantee", kind: "careful" },
  { name: "Un soldat de passage", item: "Gants renforcés", icon: "▱", opening: "« Les coutures tiendront jusqu’à Forthaven ? Je n’ai pas de quoi acheter deux fois. »", clue: "Il compte huit pièces et vérifie surtout la solidité.", cost: 5, base: 9, budget: 10, preference: "guarantee", kind: "careful" },
  { name: "Une apothicaire pressée", item: "Lot de fioles vides", icon: "♧", opening: "« Je prends tout si vous me faites un prix de confrère. »", clue: "Un lot évite huit emballages et lui fait gagner une heure.", cost: 7, base: 14, budget: 15, preference: "bundle", kind: "bulk" },
  { name: "Un apprenti sans le sou", item: "Plume runique", icon: "✒", opening: "« Il me manque deux pièces… mais je peux réparer votre enseigne. »", clue: "Ses outils sont entretenus et son tablier porte la marque d’un atelier reconnu.", cost: 4, base: 8, budget: 6, preference: "barter", kind: "barter" },
  { name: "Une collectionneuse avertie", item: "Vase de Mir’Aldas", icon: "◈", opening: "« Votre étiquette semble ancienne. Vous maintenez vraiment ce prix ? »", clue: "Elle connaît la provenance et attend de voir si vous mentez.", cost: 8, base: 16, budget: 20, preference: "direct", kind: "regular" },
  { name: "Un cuisinier d’auberge", item: "Huit couteaux de table", icon: "⋔", opening: "« Le lot complet, payé maintenant. Je dois ouvrir avant le soir. »", clue: "La vente en lot vous évite de séparer et recompter les pièces.", cost: 10, base: 18, budget: 20, preference: "bundle", kind: "bulk" },
  { name: "Une voyageuse prudente", item: "Broche à fermoir", icon: "✧", opening: "« Je veux pouvoir la rapporter si le fermoir cède sur la route. »", clue: "Elle accepte le prix affiché si la réparation est garantie.", cost: 5, base: 10, budget: 12, preference: "guarantee", kind: "careful" },
  { name: "Un ambassadeur discret", item: "Rubans impériaux", icon: "⌁", opening: "« Trente rubans. Un prix sobre et aucune attente. »", clue: "Son intendant tient déjà le bon de livraison d’un concurrent.", cost: 9, base: 18, budget: 21, preference: "bundle", kind: "bulk" },
  { name: "Un marin de Forthaven", item: "Boussole de poche", icon: "⌖", opening: "« J’ai des crochets de cuivre et peu de monnaie. On échange ? »", clue: "Les crochets valent réellement plusieurs pièces au port.", cost: 6, base: 12, budget: 8, preference: "barter", kind: "barter" },
  { name: "Une archiviste de Mir’Aldas", item: "Étui étanche", icon: "▤", opening: "« Je paie le prix juste si vous répondez de l’enchantement. »", clue: "Elle cherche une garantie, pas une remise.", cost: 7, base: 13, budget: 15, preference: "guarantee", kind: "careful" },
  { name: "Un faux collecteur de taxes", item: "Votre caisse du matin", icon: "⚑", opening: "« Taxe exceptionnelle. Remettez la moitié de la caisse sans reçu. »", clue: "Son insigne porte l’ancien emblème et il évite les gardes du marché.", cost: 0, base: 20, budget: 0, preference: "direct", kind: "scam", special: { label: "Appeler la garde du marché", result: "Le faux collecteur abandonne son insigne et deux complices sont arrêtés à la sortie." } },
  { name: "Une acheteuse au parfum entêtant", item: "Cristal de Résonance", icon: "◇", opening: "« Laissez-moi l’essayer derrière l’étal. Je reviens aussitôt. »", clue: "Sa manche contient déjà l’écrin vide d’un autre marchand.", cost: 11, base: 19, budget: 25, preference: "direct", kind: "scam", special: { label: "Faire contrôler son écrin", result: "L’écrin volé suffit à faire intervenir les surveillants du marché." } },
  { name: "Un thaumaturge bavard", item: "Miroir de poche", icon: "◐", opening: "« Facturez-le au palais ; inutile de vérifier mon nom. »", clue: "Le palais ne règle jamais d’achats sans bon scellé.", cost: 5, base: 11, budget: 0, preference: "direct", kind: "scam", special: { label: "Exiger le bon impérial", result: "Le thaumaturge disparaît dans la foule avant que vous ayez fini de prononcer “contreseing”." } },
  { name: "Une pâtissière ambitieuse", item: "Moule en cuivre gravé", icon: "◎", opening: "« Ajoutez les deux petits moules et je repars avec le tout. »", clue: "Elle veut un lot cohérent plus qu’une réduction brutale.", cost: 8, base: 15, budget: 18, preference: "bundle", kind: "bulk" },
  { name: "Un père et sa fille", item: "Lanterne aux lucioles", icon: "✦", opening: "« Elle l’adore. Mais elle doit survivre au voyage. »", clue: "La fille ne quitte pas la lanterne des yeux ; le père vérifie le mécanisme.", cost: 6, base: 12, budget: 14, preference: "guarantee", kind: "careful" },
  { name: "Une tisserande itinérante", item: "Boîte de pigments", icon: "▦", opening: "« Mes étoffes se vendent mieux que mes pièces ne s’empilent. Un troc vous intéresse ? »", clue: "Les échantillons qu’elle propose sont propres et recherchés.", cost: 7, base: 13, budget: 9, preference: "barter", kind: "barter" },
  { name: "Un intendant méthodique", item: "Trois sabliers", icon: "⌛", opening: "« Même mesure, même garantie, livraison groupée. Votre meilleur prix ? »", clue: "Il dispose du budget mais note chaque incohérence.", cost: 9, base: 17, budget: 19, preference: "bundle", kind: "bulk" },
  { name: "Une duelliste impatiente", item: "Protège-poignet", icon: "◒", opening: "« Je combats dans une heure. Donnez-moi un prix, pas un poème. »", clue: "Elle valorise la rapidité et connaît exactement le prix normal.", cost: 5, base: 10, budget: 11, preference: "direct", kind: "regular" },
  { name: "Un maître d’école", item: "Douze ardoises", icon: "▰", opening: "« Toute la classe en a besoin. Regroupez-les et je règle aujourd’hui. »", clue: "Un lot solide lui importe davantage qu’un emballage individuel.", cost: 8, base: 15, budget: 18, preference: "bundle", kind: "bulk" },
  { name: "Une alchimiste précautionneuse", item: "Mortier de basalte", icon: "●", opening: "« S’il se fend au premier feu, vous le reprenez. »", clue: "Elle accepte le prix affiché contre une garantie écrite.", cost: 7, base: 14, budget: 16, preference: "guarantee", kind: "careful" },
  { name: "Un éleveur des faubourgs", item: "Clochette de troupeau", icon: "◌", opening: "« Je manque de pièces, mais j’ai du cuir tanné cette semaine. »", clue: "Le cuir est propre, marqué par une guilde connue et facile à revendre.", cost: 4, base: 9, budget: 6, preference: "barter", kind: "barter" },
  { name: "Une capitaine de péniche", item: "Lampe tempête", icon: "✦", opening: "« Donnez le prix net. Je sais ce que vaut le cuivre. »", clue: "Elle refuse les ornements et paiera un tarif honnête sans marchander.", cost: 8, base: 14, budget: 16, preference: "direct", kind: "regular" },
  { name: "Trois cuisinières du palais", item: "Paniers d’épices", icon: "✤", opening: "« Les trois paniers ensemble, livrés avant la seconde cloche. »", clue: "Elles ont surtout besoin d’un lot complet et correctement étiqueté.", cost: 10, base: 19, budget: 22, preference: "bundle", kind: "bulk" },
  { name: "Un archiviste inquiet", item: "Coffret ignifugé", icon: "▤", opening: "« Vous garantissez le sceau contre la chaleur arcanique ? »", clue: "Il ne réclame aucune remise, seulement une responsabilité claire.", cost: 9, base: 17, budget: 20, preference: "guarantee", kind: "careful" },
  { name: "Une herboriste de passage", item: "Balance de cuivre", icon: "⚖", opening: "« J’échange des baumes rares contre la balance et ses poids. »", clue: "Les baumes portent une date récente et se vendent bien à l’auberge.", cost: 6, base: 12, budget: 8, preference: "barter", kind: "barter" },
  { name: "Un novice du Conservatoire", item: "Compas de pierre", icon: "⌖", opening: "« Je veux le modèle simple, sans histoire ni supplément. »", clue: "Son budget couvre exactement le prix normal.", cost: 5, base: 10, budget: 10, preference: "direct", kind: "regular" },
  { name: "Une troupe de théâtre", item: "Masques blancs", icon: "☾", opening: "« Huit masques, mêmes attaches, et un prix de troupe. »", clue: "La commande groupée vous débarrasse d’une série difficile à vendre séparément.", cost: 9, base: 17, budget: 20, preference: "bundle", kind: "bulk" },
  { name: "Une voyageuse de Tzekar’ûn", item: "Outre isotherme", icon: "◇", opening: "« La couture résistera aux dunes ? Je paie si vous l’assurez. »", clue: "Elle connaît le désert et inspecte plus la garantie que le prix.", cost: 7, base: 13, budget: 15, preference: "guarantee", kind: "careful" },
  { name: "Un tailleur sans monnaie", item: "Ciseaux d’argent", icon: "⋔", opening: "« Une cape sur mesure contre vos ciseaux. Voyez mon travail. »", clue: "La cape exposée est nette, doublée et vaut davantage que la différence demandée.", cost: 8, base: 15, budget: 9, preference: "barter", kind: "barter" },
  { name: "Une garde impériale", item: "Sifflet de signal", icon: "⚑", opening: "« Prix réglementaire, reçu compris. Je repars maintenant. »", clue: "Toute manœuvre compliquée lui ferait simplement choisir l’étal voisin.", cost: 3, base: 7, budget: 8, preference: "direct", kind: "regular" },
  { name: "Un intendant de caravane", item: "Six couvertures cirées", icon: "≈", opening: "« Le lot complet, avec les sangles, avant notre départ. »", clue: "Il valorise l’ensemble prêt à charger et dispose du budget nécessaire.", cost: 11, base: 20, budget: 23, preference: "bundle", kind: "bulk" },
  { name: "Une guérisseuse du quartier bas", item: "Boîte à fioles", icon: "✚", opening: "« Je dois pouvoir rapporter toute charnière qui casse en tournée. »", clue: "La robustesse et le suivi comptent davantage qu’une pièce de remise.", cost: 6, base: 12, budget: 14, preference: "guarantee", kind: "careful" },
  { name: "Un potier itinérant", item: "Petit tour manuel", icon: "◎", opening: "« Je peux payer moitié en pièces, moitié en vaisselle neuve. »", clue: "Ses bols portent un émail régulier recherché dans les auberges.", cost: 9, base: 16, budget: 11, preference: "barter", kind: "barter" },
  { name: "Un faux messager impérial", item: "Tous vos sceaux de cire", icon: "♜", opening: "« Réquisition immédiate. Le reçu arrivera après mon départ. »", clue: "Sa livrée est cousue à l’envers et aucun ordre ne porte de contreseing.", cost: 8, base: 16, budget: 0, preference: "direct", kind: "scam", special: { label: "Comparer son ordre au registre", result: "Le numéro appartient à une livraison vieille de huit ans. La garde cueille le faux messager avant la porte." } },
  { name: "Une prétendue experte en gemmes", item: "Lot de pierres nocturnes", icon: "◈", opening: "« Je les emporte pour expertise et vous paie demain le double. »", clue: "Elle refuse de laisser un nom, une caution ou même sa loupe sur place.", cost: 10, base: 18, budget: 0, preference: "direct", kind: "scam", special: { label: "Faire venir le juré des gemmes", result: "À la vue du juré officiel, l’experte abandonne sa fausse licence et tente de fuir." } },
];

export function marketCustomers(variant: number) {
  const scams = sessionSlice(MARKET_CASES.filter((entry) => entry.kind === "scam"), 1, variant, "market-scam");
  const ordinary = sessionSlice(MARKET_CASES.filter((entry) => entry.kind !== "scam"), 6, variant, "market-ordinary");
  return ranked([...scams, ...ordinary], `market-order:${variant}`).map((entry, index) => {
    const shift = (hashSeed(`market-price:${variant}:${index}`) % 5) - 2;
    return { ...entry, id: `market-${variant}-${index}`, cost: Math.max(1, entry.cost + Math.min(0, shift)), base: Math.max(3, entry.base + shift), budget: entry.kind === "scam" ? 0 : Math.max(entry.cost + 1, entry.budget + shift) };
  });
}
