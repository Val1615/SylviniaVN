import type { StatKey } from "./game-data";

export type JobKind = "service" | "observation" | "bargain" | "sort" | "timing" | "packing" | "path" | "assembly" | "memory";

export const JOB_KIND_LABELS: Record<JobKind, string> = {
  service: "Service",
  observation: "Observation",
  bargain: "Négociation",
  sort: "Triage",
  timing: "Précision",
  packing: "Placement",
  path: "Guidage",
  assembly: "Logique",
  memory: "Mémoire",
};

export type JobOption = {
  id: string;
  label: string;
  detail?: string;
  score?: number;
};

export type JobRound = {
  prompt: string;
  detail?: string;
  options: JobOption[];
  correct?: string;
};

export type JobCrate = {
  id: string;
  label: string;
  icon: string;
  weight: number;
  detail: string;
  requiredSide?: "left" | "right";
  ruleText?: string;
};

export type JobPath = {
  size: number;
  start: number;
  goal: number;
  blocked: number[];
  maxSteps: number;
  flavor: Record<number, string>;
};

export type JobRequirement = {
  character: string;
  bond: number;
};

export type JobData = {
  id: string;
  title: string;
  employer: string;
  description: string;
  spot: string;
  reward: number;
  stat: StatKey;
  kind: JobKind;
  briefing: string;
  success: string;
  failure: string;
  perfect: string;
  rounds?: JobRound[];
  symbols?: string[];
  length?: number;
  crates?: JobCrate[];
  path?: JobPath;
  requirement?: JobRequirement;
};

export const JOBS: JobData[] = [
  {
    id: "forestier-service", title: "Coup de feu à l’auberge", employer: "Auberge du Forestier",
    description: "Prendre des commandes variables sur une carte complète et servir chaque table avant qu’elle ne s’impatiente.", spot: "forestier-inn",
    reward: 9, stat: "sangFroid", kind: "service",
    briefing: "Sept client·es se succèdent. Chacun peut commander une seule catégorie, plusieurs services précis ou vous demander une suggestion. Toute la carte — entrées, plats, boissons et desserts — reste disponible. Vous disposez de trente-cinq secondes par table ; une erreur retire trois secondes à la suivante.",
    success: "Le service tient jusqu’à la dernière assiette et le tenancier vous paie sans recompter la vaisselle.",
    perfect: "Aucune erreur, aucune attente : même Hylee aurait approuvé votre manière de traverser la salle.",
    failure: "Deux plateaux reviennent en cuisine. Le tenancier sauve le service et vous verse seulement une compensation.",
    rounds: [
      { prompt: "Table du voyageur", detail: "« Quelque chose de chaud, sans alcool, avec la part salée. »", correct: "tea-pie", options: [{ id: "ale-pie", label: "Bière + tourte" }, { id: "tea-pie", label: "Thé + tourte" }, { id: "tea-cake", label: "Thé + gâteau" }] },
      { prompt: "Table près du feu", detail: "« Deux boissons, une seule sucrée, et rien qui sorte du four. »", correct: "ale-cider", options: [{ id: "ale-cider", label: "Bière + cidre doux" }, { id: "tea-cake", label: "Thé + gâteau" }, { id: "two-pies", label: "Deux tourtes" }] },
      { prompt: "Messagère pressée", detail: "« La boisson la plus rapide et le plat froid. Je repars avant la cloche. »", correct: "water-board", options: [{ id: "tea-pie", label: "Thé + tourte" }, { id: "water-board", label: "Eau + planche froide" }, { id: "cider-cake", label: "Cidre + gâteau" }] },
      { prompt: "Coin des habitué·es", detail: "« Comme toujours : sombre dans le verre, clair dans l’assiette. »", correct: "stout-cheese", options: [{ id: "stout-cheese", label: "Bière brune + fromage" }, { id: "wine-meat", label: "Vin rouge + viande" }, { id: "tea-bread", label: "Thé + pain noir" }] },
    ],
  },
  {
    id: "forestier-rooms", title: "Inspection des chambres", employer: "Auberge du Forestier",
    description: "Préparer trois chambres directement sur les lieux et repérer les défauts qui changent à chaque inspection.", spot: "forestier-inn",
    reward: 8, stat: "lucidite", kind: "observation",
    briefing: "Dans chaque chambre, changez les draps, nettoyez le sol, essuyez la table et contrôlez la fenêtre en touchant les bonnes zones. Deux anomalies supplémentaires se cachent parmi des objets parfaitement normaux. La lanterne d’inspection peut les révéler, au prix de la prime parfaite.",
    success: "Les chambres sont rendues sans mauvaise surprise et les objets oubliés retrouvent leurs propriétaires.",
    perfect: "Vous repérez jusqu’à une fausse pièce glissée sous un lit. Le tenancier ajoute une prime discrète.",
    failure: "Une anomalie vous échappe. Rien de grave, mais une servante doit reprendre l’inspection.",
    rounds: [
      { prompt: "Chambre sous les combles", detail: "Le lit est fait, la fenêtre fermée et trois objets attendent sur la table.", correct: "wet-boots", options: [{ id: "dry-book", label: "Livre sec", detail: "Reliure de voyage" }, { id: "cold-key", label: "Clé froide", detail: "Marque de l’auberge" }, { id: "wet-boots", label: "Bottes trempées", detail: "Aucune trace humide au sol" }] },
      { prompt: "Chambre du marchand", detail: "Le client affirme n’avoir transporté aucune magie.", correct: "warm-coin", options: [{ id: "warm-coin", label: "Pièce tiède", detail: "Elle pulse toutes les sept secondes" }, { id: "ink", label: "Encrier", detail: "Bouchon correctement fermé" }, { id: "silk", label: "Étoffe", detail: "Plis réguliers" }] },
      { prompt: "Petite chambre du palier", detail: "La fenêtre donne sur la forêt, mais personne n’est sorti cette nuit.", correct: "leaf", options: [{ id: "candle", label: "Bougie consumée" }, { id: "leaf", label: "Feuille violette fraîche", detail: "Encore couverte de rosée" }, { id: "cup", label: "Tasse vide" }] },
    ],
  },
  {
    id: "algratal-merchant", title: "Tenir un étal au Grand Marché", employer: "Confrérie des étaliers",
    description: "Fixer vos prix, choisir une tactique de vente et protéger la caisse face à une clientèle imprévisible.", spot: "algratal-market",
    reward: 13, stat: "audace", kind: "bargain",
    briefing: "Chaque client possède un budget, une préférence et parfois une intention douteuse. Réglez le prix, choisissez prix net, lot, garantie ou troc, puis présentez votre offre. Une première offre refusée peut être corrigée ; une arnaque doit surtout ne jamais atteindre la caisse.",
    success: "La caisse est saine et les client·es repartent avec l’impression d’avoir négocié honnêtement.",
    perfect: "Vous obtenez trois bons prix sans humilier personne. La confrérie vous offre la meilleure prime de l’étal.",
    failure: "Deux négociations tournent court. Vous êtes payé·e pour avoir tenu l’étal, pas pour les marchandises invendues.",
    rounds: [
      { prompt: "Une noble dissimule mal son intérêt pour un oiseau mécanique.", detail: "Prix affiché : 12 pièces. Elle en propose 5 en évoquant « l’exposition offerte à l’artisan ».", options: [{ id: "noble-low", label: "Accepter 5 pièces", score: 0 }, { id: "noble-fair", label: "Proposer 10 pièces et une gravure offerte", score: 2 }, { id: "noble-hard", label: "Exiger 15 pièces pour l’insolence", score: -1 }] },
      { prompt: "Un soldat de passage examine une paire de gants renforcés.", detail: "Il possède 8 pièces ; le prix normal est 9, mais les coutures sont légèrement décolorées.", options: [{ id: "soldier-fair", label: "Vendre à 8 en signalant le défaut", score: 2 }, { id: "soldier-full", label: "Cacher le défaut et maintenir 9", score: -1 }, { id: "soldier-gift", label: "Les offrir gratuitement", score: 0 }] },
      { prompt: "Une apothicaire veut toutes vos fioles vides.", detail: "Elle propose le prix normal, mais cette vente épuiserait votre stock avant le soir.", options: [{ id: "apoth-all", label: "Tout vendre immédiatement", score: 0 }, { id: "apoth-half", label: "Vendre la moitié et réserver le reste", score: 2 }, { id: "apoth-double", label: "Doubler brutalement le prix", score: -1 }] },
    ],
  },
  {
    id: "algratal-petitions", title: "Triage des requêtes impériales", employer: "Secrétariat du Conseil",
    description: "Décider du sort de requêtes sérieuses, ordinaires, absurdes ou franchement suspectes.", spot: "algratal-palace-council",
    reward: 15, stat: "lucidite", kind: "sort",
    briefing: "Vous pouvez jeter, accorder, transmettre à l’impératrice ou signaler à la garde. Iriana n’étudie que les affaires graves qui engagent l’Empire ; les demandes courantes relèvent de votre bureau et les manœuvres douteuses de la garde. Certains dossiers autorisent une annotation beaucoup moins réglementaire.",
    success: "Le Conseil reçoit une pile exploitable et aucune urgence ne disparaît sous les sceaux décoratifs.",
    perfect: "Vous démasquez même une fausse recommandation. Le secrétaire vous paie avant qu’un conseiller ne réclame votre service.",
    failure: "Deux dossiers sont mal orientés. La séance commence en retard et votre paie perd sa prime.",
    requirement: { character: "iriana", bond: 20 },
    rounds: [
      { prompt: "Un aqueduc dessert trois quartiers avec une fissure nouvelle.", correct: "urgent", options: [{ id: "urgent", label: "Urgence" }, { id: "current", label: "Courant" }, { id: "reject", label: "Rejet" }] },
      { prompt: "Un comte réclame une audience car son voisin possède des rideaux « outrageusement similaires ».", correct: "reject", options: [{ id: "urgent", label: "Urgence" }, { id: "current", label: "Courant" }, { id: "reject", label: "Rejet" }] },
      { prompt: "Une guilde demande le renouvellement annuel de son permis de transport.", correct: "current", options: [{ id: "urgent", label: "Urgence" }, { id: "current", label: "Courant" }, { id: "reject", label: "Rejet" }] },
      { prompt: "Un pli porte le sceau d’une conseillère absente depuis six mois et exige l’ouverture des réserves.", correct: "reject", options: [{ id: "urgent", label: "Urgence" }, { id: "current", label: "Courant" }, { id: "reject", label: "Rejet" }] },
      { prompt: "Les lanternes d’une avenue s’éteignent chaque soir, sans blessé ni menace immédiate.", correct: "current", options: [{ id: "urgent", label: "Urgence" }, { id: "current", label: "Courant" }, { id: "reject", label: "Rejet" }] },
    ],
  },
  {
    id: "algratal-catacombs", title: "Relevé des galeries lunaires", employer: "Conservatoire du Croissant",
    description: "Guider une lanterne dans les catacombes sans franchir les dalles effondrées.", spot: "algratal-catacombs",
    reward: 14, stat: "sangFroid", kind: "path",
    briefing: "Conduisez la lanterne du croissant clair jusqu’au sanctuaire. Les dalles noires sont instables et le trajet doit rester court.",
    success: "Le relevé atteint le sanctuaire et revient avec une carte utilisable.",
    perfect: "Vous trouvez le chemin le plus court. Le Conservatoire ajoute le sceau des explorateurs à votre paie.",
    failure: "La lanterne se heurte à une galerie condamnée. L’équipe récupère votre relevé partiel.",
    path: { size: 5, start: 20, goal: 4, blocked: [6, 7, 11, 16, 17], maxSteps: 9, flavor: { 20: "◐", 4: "✦", 6: "▓", 7: "▓", 11: "▓", 16: "▓", 17: "▓" } },
  },
  {
    id: "miraldas-calibration", title: "Calibration arcanique", employer: "Atelier de Mir’Aldas",
    description: "Bloquer l’aiguille au cœur de plusieurs fréquences instables.", spot: "miraldas-atelier",
    reward: 14, stat: "resonance", kind: "timing",
    briefing: "L’aiguille oscille sur la matrice. Six fréquences se succèdent, de plus en plus rapides ; quatre stabilisations suffisent et une série parfaite rapporte une prime.",
    success: "La matrice tient et les cristaux retrouvent une fréquence exploitable.",
    perfect: "Les trois cristaux vibrent à l’unisson. L’atelier conserve votre réglage comme référence.",
    failure: "La fréquence dérive trop fortement. Les cristaux sont sauvés, mais le travail doit être repris.",
  },
  {
    id: "miraldas-manuscript", title: "Le manuscrit aux pages mouvantes", employer: "Grande Bibliothèque",
    description: "Reconstituer un texte arcanique à partir de ses indices internes.", spot: "miraldas-archives",
    reward: 14, stat: "lucidite", kind: "assembly",
    briefing: "Choisissez le fragment qui complète logiquement chaque passage. Les pages changent de place, mais le sens du texte demeure.",
    success: "Le traité retrouve un ordre lisible et rejoint les rayonnages protégés.",
    perfect: "Vous restaurez également une annotation perdue de l’auteur. La Bibliothèque ajoute une prime de recherche.",
    failure: "Deux raccords ne tiennent pas. Les archivistes conservent les pages déjà stabilisées.",
    rounds: [
      { prompt: "« Une barrière n’est stable que si chaque ancre… »", correct: "answers", options: [{ id: "commands", label: "…commande aux autres." }, { id: "answers", label: "…répond à la fréquence voisine." }, { id: "vanishes", label: "…disparaît avant l’impact." }] },
      { prompt: "Le schéma montre trois cercles emboîtés et une flèche revenant à l’origine.", correct: "cycle", options: [{ id: "line", label: "Propagation linéaire" }, { id: "cycle", label: "Boucle de stabilisation" }, { id: "break", label: "Rupture volontaire" }] },
      { prompt: "« Lorsque la Résonance augmente sans source visible, chercher d’abord… »", correct: "echo", options: [{ id: "enemy", label: "…un ennemi dissimulé." }, { id: "echo", label: "…un écho ancien dans le lieu." }, { id: "silence", label: "…à supprimer toute magie." }] },
    ],
  },
  {
    id: "forbidden-herbs", title: "Récolte dans les brumes", employer: "Herboriste de la lisière",
    description: "Explorer une parcelle mouvante, examiner chaque pousse avec le bon outil et remplir le panier avant la fermeture des brumes.", spot: "forbidden-threshold",
    reward: 13, stat: "lucidite", kind: "observation",
    briefing: "Déplacez votre attention directement dans la brume. La lanterne vérifie les ombres, la clochette les échos et le gant les températures. Examinez une pousse avant de la couper : une illusion coûte trois secondes, tandis que sept véritables spécimens suffisent.",
    success: "Le panier contient assez de plantes utilisables pour plusieurs remèdes.",
    perfect: "Aucune illusion ne rejoint le panier. L’herboriste paie également vos notes d’observation.",
    failure: "Deux imitations se changent en brume dans votre panier. La récolte restante est tout de même achetée.",
    rounds: [
      { prompt: "La belladone de brume conserve une ombre même lorsque le vent couche sa tige.", correct: "shadow", options: [{ id: "shadow", label: "Tige pâle", detail: "Son ombre reste verticale" }, { id: "purple", label: "Fleur violette", detail: "Aucune ombre" }, { id: "silver", label: "Feuille argentée", detail: "Ombre inversée" }] },
      { prompt: "La mousse de veille est froide au toucher, mais ne porte jamais de rosée.", correct: "dry", options: [{ id: "wet", label: "Mousse sombre", detail: "Perles d’eau nombreuses" }, { id: "dry", label: "Mousse bleutée", detail: "Sèche malgré le brouillard" }, { id: "warm", label: "Mousse grise", detail: "Tiède sous les doigts" }] },
      { prompt: "La racine du guetteur se tourne vers les pas réels, jamais vers leur écho.", correct: "real", options: [{ id: "echo", label: "Racine nouée", detail: "Suit le bruit derrière vous" }, { id: "still", label: "Racine blanche", detail: "Ne bouge pas" }, { id: "real", label: "Racine rouge", detail: "Suit votre pied" }] },
    ],
  },
  {
    id: "forthaven-cargo", title: "Équilibrage d’une cale", employer: "Capitainerie de Forthaven",
    description: "Répartir les caisses entre bâbord et tribord sans faire gîter le navire.", spot: "forthaven-harbor",
    reward: 16, stat: "sangFroid", kind: "packing",
    briefing: "Placez huit cargaisons à gauche ou à droite. La cale doit rester presque équilibrée et deux chargements fragiles imposent un côté précis.",
    success: "La cale reste stable lorsque le navire quitte le quai.",
    perfect: "La répartition est parfaitement équilibrée. La capitainerie ajoute la prime de chargement.",
    failure: "La cale penche trop fortement. Les dockers reprennent une partie du chargement et réduisent votre paie.",
    crates: [
      { id: "grain", label: "Sacs de grain", icon: "◫", weight: 4, detail: "Lourd et stable" },
      { id: "bolts", label: "Caisses de carreaux", icon: "➶", weight: 3, detail: "Dense" },
      { id: "medicine", label: "Coffre médical", icon: "✚", weight: 2, detail: "Fragile", requiredSide: "left", ruleText: "Doit rester à bâbord, loin du conduit chaud" },
      { id: "rope", label: "Cordages", icon: "⌁", weight: 1, detail: "Souple" },
      { id: "oil", label: "Jarres d’huile", icon: "♨", weight: 5, detail: "Inflammable", requiredSide: "right", ruleText: "Doit rester à tribord, près du bac de sable" },
      { id: "glass", label: "Verrerie d’alchimie", icon: "◇", weight: 2, detail: "Très fragile", requiredSide: "left", ruleText: "Doit rester à bâbord, dans le berceau capitonné" },
      { id: "timber", label: "Bois de réparation", icon: "╬", weight: 3, detail: "Long et stable" },
      { id: "salt", label: "Barils de sel", icon: "◉", weight: 4, detail: "Supporte les chocs" },
    ],
  },
  {
    id: "forthaven-defense", title: "Relève des balistes", employer: "Garnison de Forthaven",
    description: "Déclencher les tirs lorsque les silhouettes franchissent la ligne de portée.", spot: "forthaven-ramparts",
    reward: 17, stat: "sangFroid", kind: "timing",
    briefing: "La cible traverse rapidement la ligne de mire. Verrouillez six tirs ; quatre impacts suffisent, six rapportent la prime de précision.",
    success: "La relève trouve les balistes réglées et les abords des remparts dégagés.",
    perfect: "Trois impacts nets. Lineva signe elle-même la prime de précision.",
    failure: "Les tirs manquent leur fenêtre. La garnison vous paie pour la préparation, pas pour la précision.",
    requirement: { character: "lineva", bond: 18 },
  },
  {
    id: "forthaven-map", title: "Lecture des signaux de patrouille", employer: "Salle de commandement",
    description: "Classer les signaux selon leur urgence militaire réelle.", spot: "forthaven-war-room",
    reward: 16, stat: "lucidite", kind: "sort",
    briefing: "Distinguez Alerte, Surveillance et Ravitaillement. Une fumée spectaculaire n’est pas toujours la menace principale.",
    success: "La carte de relève est prête avant la réunion de commandement.",
    perfect: "Aucun signal n’est surévalué ni oublié. La salle de commandement conserve votre légende.",
    failure: "Deux signaux doivent être revérifiés. Un éclaireur corrige la carte avant la relève.",
    rounds: [
      { prompt: "Trois feux rouges rapprochés au nord de la ville basse.", correct: "alert", options: [{ id: "alert", label: "Alerte" }, { id: "watch", label: "Surveillance" }, { id: "supply", label: "Ravitaillement" }] },
      { prompt: "Une lanterne blanche fixe sur la tour du port.", correct: "supply", options: [{ id: "alert", label: "Alerte" }, { id: "watch", label: "Surveillance" }, { id: "supply", label: "Ravitaillement" }] },
      { prompt: "Deux éclats jaunes espacés depuis les falaises.", correct: "watch", options: [{ id: "alert", label: "Alerte" }, { id: "watch", label: "Surveillance" }, { id: "supply", label: "Ravitaillement" }] },
      { prompt: "Une fumée noire unique depuis le cimetière extérieur.", correct: "alert", options: [{ id: "alert", label: "Alerte" }, { id: "watch", label: "Surveillance" }, { id: "supply", label: "Ravitaillement" }] },
    ],
  },
  {
    id: "akuhn-seals", title: "Inventaire des sceaux noirs", employer: "Archives d’Akuhn’Nabad",
    description: "Mémoriser l’ordre d’endormissement des protections anciennes.", spot: "akuhn-archives",
    reward: 17, stat: "resonance", kind: "memory", symbols: ["◇", "●", "⌁", "✦", "◐"], length: 6,
    briefing: "Les sceaux s’endorment en trois vagues de trois, quatre puis cinq signes. Chaque série réussie s’allonge ; une erreur oblige à la réobserver et deux réveillent les protections.",
    success: "Les protections restent dormantes pendant tout l’inventaire.",
    perfect: "La séquence est reproduite sans la moindre hésitation. Les archivistes vous accordent une rare prime.",
    failure: "Une chaîne se tend et interrompt le classement. Vous recevez une paie réduite.",
  },
  {
    id: "akuhn-crystal-route", title: "Conduite des flammes vertes", employer: "Intendance d’Akuhn’Nabad",
    description: "Acheminer une charge magique à travers un réseau de cristaux fissurés.", spot: "akuhn-war-room",
    reward: 18, stat: "resonance", kind: "path",
    briefing: "Guidez la flamme depuis le foyer sombre jusqu’au cristal supérieur. Les nœuds noirs absorbent la charge et le réseau ne supporte aucun détour prolongé.",
    success: "La carte de guerre retrouve son éclairage rituel.",
    perfect: "La flamme emprunte le trajet le plus court et n’éveille aucun cristal secondaire.",
    failure: "La charge se dissipe dans un nœud mort. L’intendance récupère l’énergie restante.",
    requirement: { character: "amanea", bond: 18 },
    path: { size: 5, start: 24, goal: 0, blocked: [6, 7, 8, 12, 16, 17, 18], maxSteps: 9, flavor: { 24: "♨", 0: "✦", 6: "◆", 7: "◆", 8: "◆", 12: "◆", 16: "◆", 17: "◆", 18: "◆" } },
  },
  {
    id: "tzekarun-mechanism", title: "Montage d’obsidienne", employer: "Atelier tzekarii",
    description: "Lire un plan, monter quatre organes orientés puis calibrer le mécanisme sous pression.", spot: "tzekarun-workshop",
    reward: 19, stat: "lucidite", kind: "assembly",
    briefing: "Le plan change à chaque contrat. Sélectionnez les pièces selon leurs propriétés, orientez leur encoche et installez-les dans les quatre logements. Trois essais de pression sont permis ; un montage fonctionnel ouvre ensuite une calibration en temps réel des soupapes.",
    success: "Le régulateur tourne sans vibration et peut être vendu.",
    perfect: "Le montage dépasse les tolérances du plan. L’atelier vous paie comme un·e véritable mécanicien·ne.",
    failure: "L’engrenage accroche. Les pièces sont récupérables, mais le montage sera repris.",
    rounds: [
      { prompt: "Axe principal : forte chaleur, rotation lente, aucune magie directe.", correct: "bronze", options: [{ id: "glass", label: "Verre runique" }, { id: "bronze", label: "Bronze denté" }, { id: "silver", label: "Fil d’argent" }] },
      { prompt: "Régulateur : absorber une impulsion sans la renvoyer vers l’utilisateur.", correct: "obsidian", options: [{ id: "obsidian", label: "Disque d’obsidienne" }, { id: "copper", label: "Bobine de cuivre" }, { id: "crystal", label: "Cristal amplificateur" }] },
      { prompt: "Sortie : transmettre le mouvement à une roue plus petite.", correct: "small-gear", options: [{ id: "belt", label: "Courroie lâche" }, { id: "large-gear", label: "Grand engrenage" }, { id: "small-gear", label: "Pignon démultiplicateur" }] },
    ],
  },
];

export const SERVICE_PRIMARY: JobOption[] = [
  { id: "tea", label: "Thé fumant", detail: "Chaud · sans alcool" },
  { id: "ale", label: "Bière blonde", detail: "Fraîche · légère" },
  { id: "water", label: "Eau de source", detail: "Service immédiat" },
  { id: "stout", label: "Bière brune", detail: "Sombre · maltée" },
  { id: "wine", label: "Vin épicé", detail: "Chaud · alcoolisé" },
  { id: "milk", label: "Lait au miel", detail: "Doux · chaud" },
  { id: "cider", label: "Cidre sec", detail: "Frais · fruité" },
  { id: "broth", label: "Bouillon clair", detail: "Salé · sans alcool" },
];

export const SERVICE_SECONDARY: JobOption[] = [
  { id: "pie", label: "Tourte salée", detail: "Sort du four" },
  { id: "cider", label: "Cidre doux", detail: "Sucré · sans plat" },
  { id: "board", label: "Planche froide", detail: "Fromage et viande" },
  { id: "cheese", label: "Fromage blanc", detail: "Clair · froid" },
  { id: "soup", label: "Soupe d’oignons", detail: "Très chaude" },
  { id: "bread", label: "Pain noir", detail: "Simple · nourrissant" },
  { id: "cake", label: "Gâteau aux baies", detail: "Sucré · froid" },
  { id: "meat", label: "Viande fumée", detail: "Salée · froide" },
  { id: "fruit", label: "Fruits coupés", detail: "Frais · léger" },
];

const EXTRA_JOB_ROUNDS: Record<string, JobRound[]> = {
  "forestier-service": [
    { prompt: "Éclaireuse couverte de pluie", detail: "« Quelque chose de chaud et épicé, puis le plat le plus brûlant. Je dois repartir réchauffée, pas lucide. »", correct: "wine-soup", options: [] },
    { prompt: "Enfant du relais", detail: "« La boisson douce sans alcool et le pain le plus sombre. Surtout pas de fruits. »", correct: "milk-bread", options: [] },
    { prompt: "Deux chasseurs partageant un couvert", detail: "« Du cidre sec, de la viande froide. Rien de sucré et rien à attendre. »", correct: "cider-meat", options: [] },
    { prompt: "Vieille herboriste", detail: "« Un bouillon salé et des fruits frais. Oui, ensemble. Non, ne discutez pas. »", correct: "broth-fruit", options: [] },
    { prompt: "Musicien après sa scène", detail: "« Une bière claire, quelque chose de sucré et froid. Ma gorge survivra au paradoxe. »", correct: "ale-cake", options: [] },
    { prompt: "Garde en fin de ronde", detail: "« De l’eau. Puis la viande froide. Si vous m’apportez de l’alcool, je m’endors dans mon casque. »", correct: "water-meat", options: [] },
  ],
  "forestier-rooms": [
    { prompt: "Chambre donnant sur la cour", detail: "La cheminée n’a pas été allumée, pourtant un détail trahit une présence récente.", correct: "warm-ash", options: [{ id: "warm-ash", label: "Cendre encore tiède", detail: "Le foyer paraît nettoyé" }, { id: "folded-cloak", label: "Cape pliée", detail: "Sèche et sans odeur" }, { id: "closed-shutter", label: "Volet fermé", detail: "Loquet intact" }] },
    { prompt: "Suite du négociant", detail: "Le coffre est scellé et le client jure n’avoir reçu aucune visite.", correct: "second-glass", options: [{ id: "sealed-chest", label: "Coffre scellé", detail: "Cire intacte" }, { id: "second-glass", label: "Deuxième verre humide", detail: "Encore marqué de lèvres" }, { id: "ledger", label: "Livre de comptes", detail: "Fermé sur la table" }] },
    { prompt: "Petite chambre bleue", detail: "Une odeur de mer flotte dans une pièce occupée par un voyageur arrivé des terres.", correct: "salt-window", options: [{ id: "blue-sheet", label: "Drap bleu", detail: "Lessive ordinaire" }, { id: "salt-window", label: "Sel sur l’appui", detail: "Déposé depuis l’intérieur" }, { id: "old-map", label: "Carte routière", detail: "Aucune côte dessinée" }] },
    { prompt: "Chambre de la magicienne", detail: "Les protections déclarées sont toutes éteintes pour la nuit.", correct: "moving-thread", options: [{ id: "cold-crystal", label: "Cristal froid", detail: "Inerte" }, { id: "moving-thread", label: "Fil d’argent mobile", detail: "Se tourne vers la porte" }, { id: "chalk-circle", label: "Cercle de craie", detail: "Déjà rompu" }] },
    { prompt: "Dortoir du convoi", detail: "Six personnes ont dormi ici ; un objet n’appartient manifestement à aucune d’elles.", correct: "seventh-tag", options: [{ id: "six-cups", label: "Six tasses", detail: "Toutes utilisées" }, { id: "seventh-tag", label: "Septième étiquette de bagage", detail: "Porte un autre trajet" }, { id: "mud", label: "Boue séchée", detail: "Même couleur que la cour" }] },
  ],
  "algratal-merchant": [
    { prompt: "Un apprenti veut une plume runique pour son examen.", detail: "Il lui manque deux pièces, mais propose de réparer l’enseigne de l’étal après la fermeture.", options: [{ id: "apprentice-no", label: "Refuser sans discuter", score: 0 }, { id: "apprentice-work", label: "Accepter les pièces et une heure de réparation", score: 2 }, { id: "apprentice-debt", label: "Exiger une reconnaissance de dette doublée", score: -1 }] },
    { prompt: "Une collectionneuse reconnaît un vase mal étiqueté.", detail: "Le prix affiché est trop bas ; elle le sait et attend de voir si vous le savez aussi.", options: [{ id: "collector-honest", label: "Corriger le prix et proposer une remise pour l’erreur", score: 2 }, { id: "collector-low", label: "Vendre au prix erroné", score: 0 }, { id: "collector-lie", label: "Prétendre à une rareté imaginaire et tripler le prix", score: -1 }] },
    { prompt: "Un cuisinier veut vos huit couteaux de table.", detail: "Il paie comptant, mais l’auberge voisine vous en a réservé quatre verbalement.", options: [{ id: "cook-all", label: "Tout vendre au premier arrivé", score: 0 }, { id: "cook-four", label: "Vendre quatre et maintenir la réservation", score: 2 }, { id: "cook-auction", label: "Faire monter les deux acheteurs l’un contre l’autre", score: -1 }] },
    { prompt: "Une voyageuse rend une broche achetée hier.", detail: "Le fermoir a cassé normalement ; elle souhaite un échange, pas un remboursement.", options: [{ id: "return-refuse", label: "Refuser : la vente est terminée", score: -1 }, { id: "return-exchange", label: "Échanger et envoyer le fermoir en réparation", score: 2 }, { id: "return-cash", label: "Rembourser deux fois le prix", score: 0 }] },
    { prompt: "Un ambassadeur achète trente rubans aux couleurs de l’Empire.", detail: "Il demande une remise de gros et une livraison demain matin.", options: [{ id: "ambassador-fair", label: "Remise légère contre paiement immédiat", score: 2 }, { id: "ambassador-full", label: "Aucune remise, aucune discussion", score: 0 }, { id: "ambassador-free", label: "Tout offrir pour gagner sa faveur", score: -1 }] },
  ],
  "algratal-petitions": [
    { prompt: "Une guérisseuse signale trois cas d’une fièvre inconnue dans le même quartier.", correct: "urgent", options: [{ id: "current", label: "Courant" }, { id: "reject", label: "Rejet" }, { id: "urgent", label: "Urgence" }] },
    { prompt: "Une compagnie demande l’autorisation habituelle de jouer sur la place au prochain solstice.", correct: "current", options: [{ id: "reject", label: "Rejet" }, { id: "urgent", label: "Urgence" }, { id: "current", label: "Courant" }] },
    { prompt: "Un pétitionnaire anonyme exige l’emprisonnement de tous les voisins qui chantent après le dîner.", correct: "reject", options: [{ id: "urgent", label: "Urgence" }, { id: "current", label: "Courant" }, { id: "reject", label: "Rejet" }] },
  ],
  "miraldas-manuscript": [
    { prompt: "« Un portail emprunté conserve moins la destination que… »", correct: "intent", options: [{ id: "distance", label: "…la distance parcourue." }, { id: "intent", label: "…l’intention qui l’a ouvert." }, { id: "material", label: "…la matière du seuil." }] },
    { prompt: "Deux glyphes identiques sont séparés par un signe d’inversion.", correct: "cancel", options: [{ id: "amplify", label: "Amplification" }, { id: "cancel", label: "Annulation contrôlée" }, { id: "summon", label: "Invocation" }] },
    { prompt: "« L’écho devient dangereux lorsqu’il commence à… »", correct: "answer", options: [{ id: "fade", label: "…s’effacer trop lentement." }, { id: "answer", label: "…répondre avant la source." }, { id: "shine", label: "…produire de la lumière." }] },
    { prompt: "Le diagramme relie une ancre stable à trois issues variables.", correct: "branch", options: [{ id: "branch", label: "Bifurcation temporelle" }, { id: "collapse", label: "Effondrement spatial" }, { id: "loop", label: "Répétition parfaite" }] },
    { prompt: "« Pour refermer une faille sans enfermer le voyageur… »", correct: "separate", options: [{ id: "erase", label: "…effacer son souvenir du passage." }, { id: "separate", label: "…séparer sa résonance de celle du seuil." }, { id: "bind", label: "…le lier définitivement au monde d’arrivée." }] },
  ],
  "forbidden-herbs": [
    { prompt: "La fleur-miroir reflète le ciel réel, jamais la brume qu’elle fabrique.", correct: "clear-sky", options: [{ id: "clear-sky", label: "Corolle noire", detail: "Reflète un ciel bleu derrière la brume" }, { id: "purple-mist", label: "Corolle violette", detail: "Reflète la brume locale" }, { id: "face", label: "Corolle blanche", detail: "Reflète votre visage" }] },
    { prompt: "Le lichen des songes pousse vers la personne éveillée la plus proche.", correct: "toward-you", options: [{ id: "toward-you", label: "Lichen doré", detail: "Ses filaments penchent vers vous" }, { id: "toward-tree", label: "Lichen gris", detail: "Pointe vers l’arbre" }, { id: "flat", label: "Lichen bleu", detail: "Reste parfaitement plat" }] },
    { prompt: "La graine de veille tinte seulement lorsqu’aucun prédateur ne l’écoute.", correct: "silent-pod", options: [{ id: "loud-pod", label: "Gousse rouge", detail: "Tin­te malgré un grondement proche" }, { id: "silent-pod", label: "Gousse brune", detail: "S’est tue à votre approche" }, { id: "glass-pod", label: "Gousse claire", detail: "Produit un tintement régulier" }] },
    { prompt: "Le champignon-lanterne véritable éclaire la poussière, mais jamais sa propre tige.", correct: "dark-stem", options: [{ id: "bright-stem", label: "Chapeau blanc", detail: "Tige lumineuse" }, { id: "dark-stem", label: "Chapeau vert", detail: "Spores éclairées, tige sombre" }, { id: "no-spores", label: "Chapeau bleu", detail: "Aucune poussière visible" }] },
    { prompt: "La feuille d’oubli porte une nervure de moins chaque fois qu’on la recompte.", correct: "changing-vein", options: [{ id: "changing-vein", label: "Feuille argentée", detail: "Sept, puis six nervures" }, { id: "fixed-vein", label: "Feuille noire", detail: "Toujours huit nervures" }, { id: "many-vein", label: "Feuille rouge", detail: "Impossible à compter dès le début" }] },
  ],
  "forthaven-map": [
    { prompt: "Quatre lueurs vertes progressent lentement le long de la route côtière.", correct: "supply", options: [{ id: "watch", label: "Surveillance" }, { id: "supply", label: "Ravitaillement" }, { id: "alert", label: "Alerte" }] },
    { prompt: "Un éclat rouge bref depuis une ferme évacuée, puis plus rien.", correct: "watch", options: [{ id: "alert", label: "Alerte" }, { id: "watch", label: "Surveillance" }, { id: "supply", label: "Ravitaillement" }] },
    { prompt: "Deux feux rouges encadrent une lumière blanche mobile vers les remparts.", correct: "alert", options: [{ id: "supply", label: "Ravitaillement" }, { id: "watch", label: "Surveillance" }, { id: "alert", label: "Alerte" }] },
    { prompt: "Trois lanternes blanches fixes sur la jetée sud.", correct: "supply", options: [{ id: "alert", label: "Alerte" }, { id: "supply", label: "Ravitaillement" }, { id: "watch", label: "Surveillance" }] },
  ],
  "tzekarun-mechanism": [
    { prompt: "Joint mobile : résister à la poussière d’obsidienne sans bloquer la rotation.", correct: "leather", options: [{ id: "leather", label: "Anneau de cuir huilé" }, { id: "stone", label: "Rondelle de pierre" }, { id: "wax", label: "Cire molle" }] },
    { prompt: "Chambre de pression : évacuer une surcharge vers le sol.", correct: "ground-wire", options: [{ id: "mirror", label: "Miroir de renvoi" }, { id: "ground-wire", label: "Tresse de masse" }, { id: "sealed-cap", label: "Bouchon scellé" }] },
    { prompt: "Indicateur : signaler une surchauffe sans amplifier le flux.", correct: "dull-gem", options: [{ id: "dull-gem", label: "Gemme thermochrome" }, { id: "bright-crystal", label: "Cristal amplificateur" }, { id: "iron-bell", label: "Cloche de fer" }] },
    { prompt: "Support : absorber les vibrations d’un axe rapide.", correct: "spring", options: [{ id: "rigid", label: "Étau rigide" }, { id: "spring", label: "Lame-ressort" }, { id: "glass-foot", label: "Pied de verre" }] },
    { prompt: "Verrou final : rester ouvrable sans outil après refroidissement.", correct: "quarter-turn", options: [{ id: "melt-rivet", label: "Rivet fondu" }, { id: "quarter-turn", label: "Loquet quart-de-tour" }, { id: "weld", label: "Soudure pleine" }] },
  ],
};

const SIGNAL_OPTIONS: JobOption[] = [
  { id: "alert", label: "Alerte" },
  { id: "watch", label: "Surveillance" },
  { id: "supply", label: "Ravitaillement" },
];

const PROCEDURAL_JOB_ROUNDS: Record<string, JobRound[]> = {
  "forthaven-map": [
    ...[
      "Cinq éclats rouges se répondent depuis les tombes extérieures, puis une silhouette coupe le dernier feu.",
      "Une lanterne rouge décrit trois cercles rapides sur la tour de la porte basse.",
      "Deux feux rouges fixes encadrent un troisième qui avance vers les maisons évacuées.",
      "Le fanal du vieux moulin passe brutalement du blanc au rouge et s’éteint.",
      "Une fusée rouge monte depuis la route des réfugiés, suivie de deux coups de corne.",
      "Les trois balises du rempart occidental rougissent simultanément sans relève annoncée.",
    ].map((prompt) => ({ prompt, correct: "alert", options: SIGNAL_OPTIONS })),
    ...[
      "Un éclat jaune revient toutes les dix respirations depuis une ferme officiellement vide.",
      "Deux lanternes violettes dérivent le long des falaises sans approcher de la route.",
      "Une fumée grise apparaît au nord, trop fine pour un incendie et trop régulière pour le vent.",
      "Le poste côtier alterne un feu blanc et un feu jaune : mouvement aperçu, identité inconnue.",
      "Trois reflets brefs courent sur les vitres du hameau abandonné, puis cessent à votre observation.",
      "Une cloche isolée sonne depuis la chapelle extérieure alors qu’aucune patrouille n’en réclame l’accès.",
    ].map((prompt) => ({ prompt, correct: "watch", options: SIGNAL_OPTIONS })),
    ...[
      "Six lanternes blanches avancent par paires depuis les quais vers la porte des réserves.",
      "Une lumière verte fixe attend au débarcadère tandis que deux feux blancs approchent par mer.",
      "Trois fanaux blancs se déplacent lentement sur la route du sel, à l’heure prévue du convoi.",
      "Le poste sud montre une lanterne bleue au-dessus de deux blanches : guérisseurs et vivres en approche.",
      "Quatre lumières vertes s’arrêtent successivement aux bornes de contrôle de la route impériale.",
      "Une torche blanche est levée puis abaissée trois fois depuis la barque de la capitainerie.",
    ].map((prompt) => ({ prompt, correct: "supply", options: SIGNAL_OPTIONS })),
  ],
  "miraldas-manuscript": [
    { prompt: "« Toute ancre temporelle exige un témoin qui demeure… »", correct: "outside", options: [{ id: "inside", label: "…au cœur de la fracture." }, { id: "outside", label: "…hors de la boucle qu’il mesure." }, { id: "asleep", label: "…endormi jusqu’à sa fermeture." }] },
    { prompt: "Un cercle parfait est barré d’une seule ligne qui ne touche pas son centre.", correct: "bypass", options: [{ id: "bypass", label: "Dérivation du flux" }, { id: "collapse", label: "Effondrement complet" }, { id: "crown", label: "Sceau de souveraineté" }] },
    { prompt: "« Une mémoire arrachée par le passage laisse dans le corps… »", correct: "gesture", options: [{ id: "nothing", label: "…un silence sans aucune trace." }, { id: "gesture", label: "…le geste appris avant le souvenir." }, { id: "map", label: "…la carte exacte du monde quitté." }] },
    { prompt: "Deux spirales progressent en sens inverse et partagent une unique sortie.", correct: "counterflow", options: [{ id: "counterflow", label: "Contre-flux stabilisé" }, { id: "summoning", label: "Double invocation" }, { id: "erosion", label: "Érosion de matière" }] },
    { prompt: "« Quand l’écho possède une voix, vérifier d’abord s’il… »", correct: "remembers", options: [{ id: "remembers", label: "…se souvient de ce que la source ignore." }, { id: "shouts", label: "…parle plus fort que l’archimage." }, { id: "glows", label: "…produit une lumière visible." }] },
    { prompt: "Le schéma relie quatre seuils à un point qui n’existe sur aucune carte.", correct: "borrowed", options: [{ id: "borrowed", label: "Destination empruntée" }, { id: "fortress", label: "Barrière militaire" }, { id: "storage", label: "Réserve de Résonance" }] },
    { prompt: "« Pour séparer un voyageur du portail, il faut nommer… »", correct: "arrival", options: [{ id: "arrival", label: "…ce qui appartient au monde d’arrivée." }, { id: "enemy", label: "…l’ennemi qu’il rencontrera." }, { id: "price", label: "…le prix matériel du voyage." }] },
    { prompt: "Trois glyphes décroissent tandis qu’un quatrième conserve sa taille.", correct: "anchor", options: [{ id: "anchor", label: "Ancre de référence" }, { id: "curse", label: "Malédiction cumulative" }, { id: "door", label: "Porte secondaire" }] },
    { prompt: "« Une barrière trop silencieuse n’est pas nécessairement stable ; elle peut… »", correct: "listen", options: [{ id: "listen", label: "…écouter au lieu de répondre." }, { id: "sleep", label: "…s’endormir sans danger." }, { id: "heal", label: "…réparer seule ses fissures." }] },
    { prompt: "Une ligne revient à son origine avec un symbole différent de celui du départ.", correct: "altered-loop", options: [{ id: "altered-loop", label: "Boucle altérée" }, { id: "straight", label: "Trajet linéaire" }, { id: "seal", label: "Fermeture sans passage" }] },
    { prompt: "« La Confluence ne choisit pas toujours le chemin le plus court, mais celui qui… »", correct: "resonates", options: [{ id: "resonates", label: "…résonne avec l’intention." }, { id: "costs", label: "…coûte le plus d’énergie." }, { id: "shines", label: "…reste visible de loin." }] },
    { prompt: "Deux ancres sont reliées par une chaîne de signes dont le centre a été effacé.", correct: "missing-witness", options: [{ id: "missing-witness", label: "Témoin absent" }, { id: "excess", label: "Surcharge thermique" }, { id: "peace", label: "Accord diplomatique" }] },
    { prompt: "« Un portail défectueux peut préserver la personne tout en perdant… »", correct: "context", options: [{ id: "context", label: "…le contexte qui la définissait." }, { id: "body", label: "…toute forme matérielle." }, { id: "voice", label: "…la capacité de parler." }] },
    { prompt: "Un glyphe d’ouverture porte, dans son ombre, un second glyphe inversé.", correct: "latent-close", options: [{ id: "latent-close", label: "Fermeture latente" }, { id: "amplifier", label: "Amplification infinie" }, { id: "royal", label: "Autorité impériale" }] },
    { prompt: "« On reconnaît une temporalité voisine non à ses ressemblances, mais à… »", correct: "impossible", options: [{ id: "impossible", label: "…ce qu’elle rend soudain impossible." }, { id: "weather", label: "…la couleur de son ciel." }, { id: "language", label: "…la langue de ses habitants." }] },
    { prompt: "Cinq issues convergent vers une ancre unique avant de repartir à quatre.", correct: "lost-branch", options: [{ id: "lost-branch", label: "Branche temporelle perdue" }, { id: "healing", label: "Réparation spontanée" }, { id: "mirror", label: "Illusion optique" }] },
    { prompt: "« Une Résonance qui précède son porteur doit être traitée comme… »", correct: "warning", options: [{ id: "warning", label: "…un avertissement, non une preuve." }, { id: "crime", label: "…un crime déjà commis." }, { id: "noise", label: "…un bruit sans intérêt." }] },
    { prompt: "Le dernier fragment montre un seuil fermé dont la lumière continue pourtant de projeter une ombre.", correct: "residue", options: [{ id: "residue", label: "Résidu de passage" }, { id: "open", label: "Portail pleinement ouvert" }, { id: "decoration", label: "Enluminure décorative" }] },
  ],
};

export function allJobRounds(job: JobData) {
  return [...(job.rounds || []), ...(EXTRA_JOB_ROUNDS[job.id] || []), ...(PROCEDURAL_JOB_ROUNDS[job.id] || [])];
}

export function jobsAtSpot(spot: string) {
  return JOBS.filter((job) => job.spot === spot);
}

const JOB_SESSION_LABELS: Record<string, string[]> = {
  "forestier-service": ["Convoi sous l’orage", "Veillée des chasseurs", "Départ des messagers", "Retour du marché", "Relève des patrouilles", "Nuit des conteurs", "Halte des pèlerins", "Banquet improvisé"],
  "forestier-rooms": ["Aile des combles", "Palier des voyageurs", "Chambres du convoi", "Aile donnant sur la forêt", "Suite des négociants", "Dortoir des éclaireurs", "Étage après l’orage", "Chambres du solstice"],
  "algratal-merchant": ["Marché des artisans", "Matin des ambassades", "Foire des voyageurs", "Ventes du solstice", "Arrivage de Mir’Aldas", "Jour des guildes", "Marché des curiosités", "Dernière cloche"],
  "algratal-petitions": ["Audience des quartiers", "Courrier des frontières", "Semaine des guildes", "Doléances du Fleuve", "Dossiers sous sceau", "Requêtes du solstice", "Courrier diplomatique", "Pile des affaires oubliées"],
  "algratal-catacombs": ["Galerie du premier croissant", "Crypte des cartographes", "Passage des cloches", "Voûte des anciennes lunes", "Galerie des stèles", "Couloir des encensoirs", "Crypte des gardiens", "Sanctuaire renversé"],
  "miraldas-calibration": ["Cristaux d’étude", "Barrière orientale", "Lentilles du dôme", "Matrice de portail", "Prismes de veille", "Ancre temporelle", "Écho des observatoires", "Réglage de contre-flux"],
  "miraldas-manuscript": ["Traité des barrières", "Notes sur les portails", "Bestiaire des échos", "Atlas des bifurcations", "Correspondance des archimages", "Manuel des ancrages", "Registre des anomalies", "Fragments de la Confluence"],
  "forbidden-herbs": ["Brume des racines", "Floraison lunaire", "Rosée des songes", "Reflux des illusions", "Poche des guetteurs", "Clairière sans vent", "Brume après l’orage", "Récolte du croissant noir"],
  "forthaven-cargo": ["Cale du Vent d’Azur", "Convoi de ravitaillement", "Navire-hôpital", "Patrouilleur du large", "Barque des remparts", "Courrier de l’Empire", "Transport des réfugiés", "Expédition des falaises"],
  "forthaven-defense": ["Brume sur les remparts", "Relève de l’aube", "Assaut des falaises", "Nuit sans lune", "Brouillard du cimetière", "Convoi sous menace", "Orage sur les balistes", "Veille de la porte basse"],
  "forthaven-map": ["Signaux de la côte", "Patrouilles du cimetière", "Relève des falaises", "Veille du port", "Réseau des fermes", "Route occidentale", "Périmètre de la ville basse", "Nuit des feux trompeurs"],
  "akuhn-seals": ["Série des fondateurs", "Coffres de l’aile noire", "Sceaux des généraux", "Registre des lignées", "Protections de la crypte", "Inventaire royal", "Chaînes du vieux palais", "Archives interdites"],
  "akuhn-crystal-route": ["Réseau de la frontière", "Carte des garnisons", "Cristaux de la côte", "Ligne des tours noires", "Table des anciennes guerres", "Réseau souterrain", "Balises des exilés", "Carte du front oriental"],
  "tzekarun-mechanism": ["Régulateur de courrier", "Pompe des brumes", "Marteau d’atelier", "Horloge scellée", "Treuil de caravane", "Ventilateur de forge", "Compas des dunes", "Presse d’obsidienne"],
};

export function jobSessionLabel(job: JobData, run: number) {
  const labels = JOB_SESSION_LABELS[job.id] || ["Contrat local"];
  const cycle = Math.floor(run / labels.length);
  const label = labels[run % labels.length];
  return cycle > 0 ? `${label} · nouvelle rotation ${cycle + 1}` : label;
}

function jobHash(value: string) {
  let hash = 2166136261;
  for (const character of value) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function indexDeck(length: number, seed: string) {
  return Array.from({ length }, (_, index) => index)
    .map((index) => ({ index, rank: jobHash(`${seed}:${index}`) }))
    .sort((left, right) => left.rank - right.rank || left.index - right.index)
    .map(({ index }) => index);
}

export function jobRoundOrder(job: JobData, run: number, count = 5) {
  const length = allJobRounds(job).length;
  if (!length) return [];
  const safeCount = Math.min(count, length);
  const sessions = Math.max(1, Math.floor(length / safeCount));
  const cycle = Math.floor(run / sessions);
  const slot = run % sessions;
  return indexDeck(length, `${job.id}:round-cycle:${cycle}`).slice(slot * safeCount, slot * safeCount + safeCount);
}

const CARGO_CATALOG = [
  ["Sacs de grain", "◫", "Lourd et stable"], ["Caisses de carreaux", "➶", "Dense et cerclé"], ["Coffres médicaux", "✚", "Fragile et prioritaire"], ["Cordages goudronnés", "⌁", "Souples mais volumineux"],
  ["Jarres d’huile", "♨", "Inflammables"], ["Verrerie d’alchimie", "◇", "Très fragile"], ["Bois de réparation", "╬", "Longues pièces arrimées"], ["Barils de sel", "◉", "Supportent les chocs"],
  ["Pierres consacrées", "✦", "Denses et froides"], ["Rouleaux de voile", "≋", "Craignent l’humidité"], ["Caisses de poisson fumé", "♧", "À garder ventilées"], ["Pièces de baliste", "⊣", "Métal lourd"],
  ["Cartes sous cire", "▤", "Craignent l’eau"], ["Tonnelets d’eau douce", "◌", "Charge mobile"], ["Boucliers de relève", "◒", "Empilés par quatre"], ["Paniers de racines", "❧", "À ne pas écraser"],
  ["Cristaux de signal", "◈", "Réagissent à la chaleur"], ["Sacs de farine", "□", "Poussière inflammable"], ["Ancres de chaloupe", "⌘", "Très denses"], ["Caisses d’outils", "⚙", "Poids bien réparti"],
  ["Livres de bord", "≡", "Protégés par toile huilée"], ["Poutres courtes", "╪", "Stables et rigides"], ["Amphores de vinaigre", "♢", "Bouchons fragiles"], ["Filets lestés", "⌗", "Compacts et humides"],
  ["Rations de campagne", "▦", "À garder au sec"], ["Lances démontées", "⋔", "Longues et glissantes"], ["Lanternes de quart", "✧", "Verre et cuivre"], ["Caisses de clous", "·", "Petites mais lourdes"],
  ["Couvertures de laine", "≈", "Légères et volumineuses"], ["Encens consacré", "☾", "Craint les étincelles"], ["Poulies de rechange", "◎", "Poids régulier"], ["Tuiles d’ardoise", "▰", "Cassantes sous le choc"],
  ["Semences du littoral", "❈", "À protéger du sel"], ["Chaînes d’amarrage", "⌇", "Charge très dense"], ["Pots de poix", "●", "À éloigner du feu"], ["Uniformes de relève", "♜", "Doivent rester secs"],
  ["Pointes de harpon", "➤", "Acier compact"], ["Parchemins diplomatiques", "⌑", "Scellés impériaux"], ["Briques de tourbe", "▥", "Stables mais salissantes"], ["Herbes de soin", "✤", "Fragiles et odorantes"],
] as const;

export function jobCratesForSession(job: JobData, run: number): JobCrate[] {
  if (job.id !== "forthaven-cargo") return job.crates || [];
  const sessions = 5;
  const cycle = Math.floor(run / sessions);
  const slot = run % sessions;
  const order = indexDeck(CARGO_CATALOG.length, `cargo-cycle:${cycle}`);
  const chosen = order.slice(slot * 8, slot * 8 + 8);
  const weights = [5, 5, 4, 4, 3, 3, 2, 2];
  const sides: Array<JobCrate["requiredSide"]> = ["left", "right", undefined, undefined, "left", "right", undefined, undefined];
  const manifest = chosen.map((catalogIndex, index) => {
    const [label, icon, detail] = CARGO_CATALOG[catalogIndex];
    const requiredSide = sides[index];
    return {
      id: `cargo-${run}-${catalogIndex}`,
      label,
      icon,
      detail,
      weight: weights[index],
      requiredSide,
      ruleText: requiredSide ? `Consigne du maître de cale : ${requiredSide === "left" ? "bâbord" : "tribord"} uniquement` : undefined,
    };
  });
  return indexDeck(manifest.length, `cargo-order:${run}`).map((index) => manifest[index]);
}

function transformCell(index: number, size: number, transform: number) {
  const x = index % size;
  const y = Math.floor(index / size);
  const last = size - 1;
  const variants: [number, number][] = [
    [x, y], [last - y, x], [last - x, last - y], [y, last - x],
    [last - x, y], [x, last - y], [y, x], [last - y, last - x],
  ];
  const [nextX, nextY] = variants[transform % variants.length];
  return nextY * size + nextX;
}

export function jobPathForSession(job: JobData, run: number): JobPath | undefined {
  if (!job.path) return undefined;
  const transform = run % 8;
  const remap = (index: number) => transformCell(index, job.path!.size, transform);
  return {
    ...job.path,
    start: remap(job.path.start),
    goal: remap(job.path.goal),
    blocked: job.path.blocked.map(remap),
    flavor: Object.fromEntries(Object.entries(job.path.flavor).map(([index, value]) => [remap(Number(index)), value])),
  };
}
