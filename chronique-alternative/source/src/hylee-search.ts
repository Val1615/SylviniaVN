/** Enquête indépendante de React. La solution reste dans les scénarios, jamais dans l'UI. */
export type MotherOutcome = "killed" | "memory-erased" | "vegetative";
export type SearchCategory = "refuge" | "route" | "manifestation";
export type SearchSource = "naiah" | "terrain" | "witness" | "shadow";
export type SearchEffects = Partial<Record<SearchCategory, Record<string, number>>>;
export type HyleeSearchClue = {
  id: string;
  source: SearchSource | "localization";
  text: string;
  effects: SearchEffects;
};
export type HyleeSearchState = {
  version: 1;
  phase: "investigation" | "localized" | "retreat";
  scenarioId: string;
  turn: number;
  maxTurns: 8;
  instability: number;
  selected: Partial<Record<SearchCategory, string>>;
  notes: Record<string, "maybe" | "no" | "yes">;
  clues: HyleeSearchClue[];
  uses: Record<SearchSource, number>;
  motherOutcome: MotherOutcome;
  tutorialSeen: boolean;
  result?: "success" | "retreat";
  message: string;
  speaker: "Naïah" | "Narration";
  revision: number;
};
const art = "/assets/cross/hylee-naiah-search/";
export const SEARCH_CATEGORIES: { id: SearchCategory; title: string; cards: { id: string; name: string; description: string; image: string; treatment?: string }[] }[] = [
  { id: "refuge", title: "Refuge", cards: [
    { id: "oak", name: "Le vieux chêne", description: "Une cavité protégée du vent.", image: art + "refuge_oak.webp" },
    { id: "ravine", name: "Le ruisseau encaissé", description: "Un abri bas, couvert par le bruit de l’eau.", image: art + "refuge_ravine.webp" },
    { id: "ruins", name: "Les ruines du relais", description: "De vieilles pierres à l’écart de la route.", image: art + "refuge_ruins.webp" },
    { id: "ridge", name: "La crête blanche", description: "Une hauteur d’où voir arriver quelqu’un.", image: art + "refuge_ridge.webp" },
  ] },
  { id: "route", title: "Trajet", cards: [
    { id: "inn", name: "L’ancien chemin de l’Auberge", description: "Un passage connu depuis des années.", image: art + "route_inn_path.webp" },
    { id: "river", name: "Le bord de rivière", description: "L’eau guide les pas sous les branches.", image: art + "route_river.webp" },
    { id: "hunters", name: "La sente des chasseurs", description: "Une trace étroite derrière les rochers.", image: art + "route_hunters.webp" },
    { id: "north", name: "La boucle du nord", description: "Un long détour qui gagne les hauteurs.", image: art + "route_north.webp" },
  ] },
  { id: "manifestation", title: "Manifestation", cards: [
    { id: "frost", name: "Givre continu", description: "Une pellicule de froid d’un pas à l’autre.", image: art + "route_north.webp", treatment: "frost" },
    { id: "burst", name: "Décharges brutales", description: "Des projections espacées, séparées par du sol intact.", image: art + "refuge_ridge.webp", treatment: "burst" },
    { id: "mist", name: "Brume glacée", description: "Un voile bas qui masque les traces.", image: art + "route_river.webp", treatment: "mist" },
    { id: "cracks", name: "Fissures gelées", description: "Des cassures emplies de glace sous les pas.", image: art + "route_hunters.webp", treatment: "cracks" },
  ] },
];
export const SEARCH_LIMITS: Record<SearchSource, number> = { naiah: 2, terrain: 2, witness: 2, shadow: 1 };
export const SEARCH_SCENARIOS = [
  { id: "familiar", solution: { refuge: "oak", route: "inn", manifestation: "frost" }, naiah: [
    { text: "Quand elle a peur, elle reprend parfois un passage qu’elle pourrait suivre les yeux fermés. Les détours inventés, c’est plutôt mon idée.", effects: { refuge: { oak: 2, ruins: 1, ridge: -1 }, route: { inn: 2, north: -1 } } },
    { text: "Elle tirait son manteau sur sa tête au moindre vent. Cherche quelque chose qui la couvre, pas simplement un endroit éloigné.", effects: { refuge: { oak: 2, ruins: 1, ridge: -2 } } },
  ] },
  { id: "water", solution: { refuge: "ravine", route: "river", manifestation: "mist" }, naiah: [
    { text: "Elle aimait les endroits où l’eau fait assez de bruit pour qu’on puisse parler sans regarder derrière soi. Même pour se taire, elle les choisissait.", effects: { refuge: { ravine: 2 }, route: { river: 2 } } },
    { text: "Une fois cachée, elle ne voulait plus voir les gens du chemin. Elle s’asseyait plus bas qu’eux. On passait parfois sans la remarquer.", effects: { refuge: { ravine: 2, ridge: -2 }, route: { river: 1, north: -1 } } },
  ] },
  { id: "stone", solution: { refuge: "ruins", route: "hunters", manifestation: "burst" }, naiah: [
    { text: "Les vieilles pierres, elle les connaît. Elle comptait les arches en faisant semblant de ne pas écouter mes histoires.", effects: { refuge: { ruins: 2 }, route: { hunters: 1 } } },
    { text: "Tu as vu la glace partir par à-coups. Elle évitera les passages ouverts si elle a peur de recommencer près de quelqu’un.", effects: { route: { hunters: 2, inn: -1 }, manifestation: { burst: 1, cracks: 1 } } },
  ] },
  { id: "height", solution: { refuge: "ridge", route: "north", manifestation: "cracks" }, naiah: [
    { text: "Quand elle veut voir arriver quelqu’un longtemps avant qu’il la touche, elle monte. Aujourd’hui, ça pourrait compter plus que le vent.", effects: { refuge: { ridge: 2 }, route: { north: 1 } } },
    { text: "Elle connaissait un détour pénible qui domine les autres chemins. Elle râlait sur la montée, mais elle le retenait mieux que moi.", effects: { route: { north: 2, river: -1 }, refuge: { ridge: 1 } } },
  ] },
] as const;

export function searchCard(category: SearchCategory, id?: string) {
  return SEARCH_CATEGORIES.find(c => c.id === category)?.cards.find(c => c.id === id);
}
export function createHyleeSearch(motherOutcome: MotherOutcome, seed = 0, scenarioId?: string): HyleeSearchState {
  const scenario = SEARCH_SCENARIOS.find(s => s.id === scenarioId) || SEARCH_SCENARIOS[Math.abs(Math.trunc(seed) || 0) % SEARCH_SCENARIOS.length];
  return {
    version: 1, phase: "investigation", scenarioId: scenario.id, turn: 0, maxTurns: 8, instability: 0,
    selected: {}, notes: {}, clues: [], uses: { naiah: 0, terrain: 0, witness: 0, shadow: 0 }, motherOutcome,
    tutorialSeen: false, revision: 0, speaker: "Naïah",
    message: motherOutcome === "killed" ? "Regarde le sol. Elle est passée par ici. Nous parlerons du reste quand nous l’aurons retrouvée."
      : motherOutcome === "vegetative" ? "Reste de ce côté de moi. Oui, là. Je peux suivre ses habitudes sans sortir les ombres."
      : "Je garde les chemins stables. Toi, regarde ce qu’elle a laissé en passant.",
  };
}
export function searchCompleteHypothesis(s: HyleeSearchState) {
  return SEARCH_CATEGORIES.every(c => !!searchCard(c.id, s.selected[c.id]));
}
export function searchEvidence(s: HyleeSearchState, category: SearchCategory, id: string) {
  return s.clues.reduce((score, c) => score + (c.effects[category]?.[id] || 0), 0);
}
export function searchAnalysis(s: HyleeSearchState) {
  let support = 0, contradictions = 0, neutral = 0;
  for (const clue of s.clues) {
    const values = SEARCH_CATEGORIES.map(c => clue.effects[c.id]?.[s.selected[c.id] || ""] || 0);
    if (values.some(v => v > 0)) support++;
    if (values.some(v => v < 0)) contradictions++;
    if (values.every(v => v === 0)) neutral++;
  }
  return { support, contradictions, neutral };
}
export function selectSearchCard(s: HyleeSearchState, category: SearchCategory, id: string) {
  if (s.phase !== "investigation" || !searchCard(category, id)) return s;
  return { ...s, selected: { ...s.selected, [category]: id }, revision: s.revision + 1 };
}
export function noteSearchCard(s: HyleeSearchState, category: SearchCategory, id: string) {
  if (s.phase !== "investigation" || !searchCard(category, id)) return s;
  const key = `${category}:${id}`, current = s.notes[key] || "maybe";
  const note = current === "maybe" ? "yes" : current === "yes" ? "no" : "maybe";
  return { ...s, notes: { ...s.notes, [key]: note } as HyleeSearchState["notes"], revision: s.revision + 1 };
}
export function searchActionReason(s: HyleeSearchState, source: SearchSource, category?: SearchCategory, target?: string): string | undefined {
  if (s.phase !== "investigation") return "Cette tentative est terminée.";
  if (s.uses[source] >= SEARCH_LIMITS[source]) return "Cette source a déjà été utilisée pour cette tentative.";
  if (source === "naiah" && SEARCH_SCENARIOS.find(c => c.id === s.scenarioId)!.naiah.every((_, i) => s.clues.some(c => c.id === `naiah:${i}`))) return "Les deux souvenirs de Naïah sont déjà dans le dossier.";
  if (source === "shadow") {
    if (!searchCompleteHypothesis(s) || s.clues.length < 2) return "Préparez une hypothèse complète et recueillez au moins deux indices.";
    if (s.motherOutcome === "vegetative" && s.clues.length < 3) return "Naïah attend trois indices avant de déployer ses ombres.";
  }
  if (source === "terrain" || source === "witness") {
    const allowed = source === "terrain" ? ["route", "manifestation"] : ["refuge", "route"];
    if (!category || !allowed.includes(category) || !searchCard(category, target)) return "Choisissez la piste que vous voulez vérifier.";
    if (s.clues.some(c => c.id === `${source}:${category}:${target}`)) return "Cette piste a déjà été examinée. Choisissez-en une autre.";
  }
}
function conclude(s: HyleeSearchState): HyleeSearchState {
  if (s.phase !== "investigation") return s;
  if (s.instability >= 3 || s.turn >= s.maxTurns) return {
    ...s, phase: "retreat", result: "retreat", speaker: "Narration",
    message: s.instability >= 3
      ? "La glace ferme le passage. Vous regagnez la lisière avec vos observations ; attendez que les secousses retombent pour reprendre."
      : "La lumière baisse et vos traces se confondent. Vous regagnez la lisière avec les indices déjà recueillis.",
  };
  return s;
}
function addSearchClue(s: HyleeSearchState, clue: HyleeSearchClue, source?: SearchSource, instability = 0): HyleeSearchState {
  return conclude({
    ...s, turn: s.turn + 1, revision: s.revision + 1, instability: Math.min(3, s.instability + instability),
    clues: s.clues.some(c => c.id === clue.id) ? s.clues : [...s.clues, clue],
    uses: source ? { ...s.uses, [source]: s.uses[source] + 1 } : s.uses,
    message: clue.text, speaker: source === "naiah" || source === "shadow" ? "Naïah" : "Narration",
  });
}
const routeTrace: Record<string, string> = {
  inn: "Sous les feuilles du vieux chemin, une empreinte récente pointe vers le creux des racines. Le froid se prolonge d’un pas à l’autre.",
  river: "La berge porte une semelle humide. Les herbes sont couchées vers le passage encaissé ; une buée très froide flotte au-dessus de l’eau.",
  hunters: "Des branches ont été écartées dans le passage étroit. Plus loin, des éclats de glace frappent la pierre à intervalles irréguliers.",
  north: "Des talons ont glissé dans la montée. Les traces contournent les basses branches pour gagner la hauteur ; la terre s’est ouverte sous le froid.",
};
const magicTrace: Record<string, string> = {
  frost: "Une même fine couche blanche couvre les feuilles, les pierres et la mousse. Elle accompagne chaque empreinte sans interruption.",
  burst: "Trois branches sont piquées d’éclats, puis le sol redevient intact. Plus loin, une nouvelle gerbe a frappé un rocher.",
  mist: "Des gouttes figent le revers des feuilles, jusque sous les branches. Un voile froid s’est répandu tout près du sol.",
  cracks: "La terre a fendu sous les semelles. Chaque cassure contient de la glace, tandis que les branches sont épargnées.",
};
const witnessReport: Record<string, string> = {
  oak: "Le ramasseur de bois a vu une silhouette se baisser près des grosses racines, au bout de l’ancien chemin. Il n’a pas osé approcher.",
  ravine: "La pêcheuse a vu quelqu’un quitter la berge et descendre dans le creux. Elle a entendu des cailloux tomber près du ruisseau.",
  ruins: "Le garde du relais a aperçu un manteau passer derrière le mur écroulé. La silhouette venait du passage des chasseurs.",
  ridge: "Le charbonnier a vu quelqu’un gagner les pierres hautes par le détour du nord. Il l’a perdu de vue derrière la crête.",
};
export function investigateSearch(s: HyleeSearchState, source: SearchSource, category?: SearchCategory, target?: string): HyleeSearchState {
  if (searchActionReason(s, source, category, target)) return s;
  const scenario = SEARCH_SCENARIOS.find(c => c.id === s.scenarioId)!;
  if (source === "naiah") {
    // Après un repli, la source continue avec le premier souvenir encore inédit.
    const index = scenario.naiah.findIndex((_, i) => !s.clues.some(c => c.id === `naiah:${i}`));
    if (index < 0) return s;
    const clue = scenario.naiah[index];
    return addSearchClue(s, { id: `naiah:${index}`, source, text: clue.text, effects: clue.effects }, source);
  }
  if (source === "shadow") {
    const refuge = s.selected.refuge!, found = refuge === scenario.solution.refuge;
    const effects: SearchEffects = { refuge: { [refuge]: found ? 4 : -4 } };
    if (s.motherOutcome === "killed" && found) effects.route = { [scenario.solution.route]: 1 };
    const observation = found ? "Quelque chose repousse mes ombres au fond de l’abri. Le froid vient de là." : "Mes ombres traversent l’abri sans rencontrer ce froid. Il faut chercher ailleurs.";
    const variant = s.motherOutcome === "killed" ? "Je peux aller plus loin. Recule. — Les ombres frappent les arbres ; une secousse glacée répond. "
      : s.motherOutcome === "vegetative" ? "Je m’arrête à l’entrée. Reste derrière mon épaule. " : "Je tiens le bord du sort. Rien d’autre ne sera touché. ";
    return addSearchClue(s, { id: `shadow:${refuge}`, source, text: variant + observation, effects }, source, s.motherOutcome === "killed" ? 1 : 0);
  }
  const cat = category!, id = target!, found = scenario.solution[cat] === id;
  const effects: SearchEffects = { [cat]: { [id]: found ? 3 : -4 } };
  let text: string;
  if (source === "terrain") {
    text = found ? cat === "route" ? routeTrace[id] : magicTrace[id]
      : `Vous examinez ${searchCard(cat, id)!.name.toLowerCase()}. ${cat === "route" ? "La mousse ne porte aucune trace récente ; le gel de la lisière s’arrête avant ce passage." : "Les traces récentes ne présentent pas ce motif : cette manifestation ne correspond pas aux marques laissées par Hylee."}`;
    if (found && cat === "route") effects.manifestation = { [scenario.solution.manifestation]: 1 };
    if (found && cat === "manifestation") effects.route = { [scenario.solution.route]: 1 };
  } else {
    text = found ? cat === "refuge" ? witnessReport[id]
      : `Le témoin indique ${searchCard(cat, id)!.name.toLowerCase()} : « Quelqu’un est passé, très vite. Le froid m’a fait rentrer. Je n’ai pas vu son visage. »`
      : `Le témoin surveillait ${searchCard(cat, id)!.name.toLowerCase()} à cette heure : « Personne n’est passé de ce côté. J’aurais entendu les pierres. »`;
    if (found && cat === "refuge") effects.route = { [scenario.solution.route]: 1 };
    if (found && cat === "route") effects.refuge = { [scenario.solution.refuge]: 1 };
  }
  return addSearchClue(s, { id: `${source}:${cat}:${id}`, source, text, effects }, source);
}
export function locateHylee(s: HyleeSearchState): HyleeSearchState {
  if (s.phase !== "investigation" || !searchCompleteHypothesis(s)) return s;
  const scenario = SEARCH_SCENARIOS.find(c => c.id === s.scenarioId)!;
  const wrong = SEARCH_CATEGORIES.find(c => s.selected[c.id] !== scenario.solution[c.id]);
  if (!wrong) return {
    ...s, turn: s.turn + 1, phase: "localized", result: "success", revision: s.revision + 1, speaker: "Narration",
    message: "Les empreintes, le froid et la direction concordent. Derrière l’abri, vous entendez Hylee. Naïah s’arrête avant d’entrer.",
  };
  const id = s.selected[wrong.id]!;
  return addSearchClue(s, {
    id: `localization:${wrong.id}:${id}`, source: "localization",
    text: wrong.id === "refuge" ? `Le froid disparaît avant ${searchCard(wrong.id, id)!.name.toLowerCase()}. Hylee n’est pas dans cet abri.`
      : wrong.id === "route" ? `Les empreintes quittent votre piste avant ${searchCard(wrong.id, id)!.name.toLowerCase()}. Ce trajet est à écarter.`
      : `À mesure que vous avancez, les marques de froid ne correspondent plus à « ${searchCard(wrong.id, id)!.name} ». Revoyez cette manifestation.`,
    effects: { [wrong.id]: { [id]: -5 } },
  }, undefined, 1);
}
export function retryHyleeSearch(s: HyleeSearchState): HyleeSearchState {
  if (s.phase !== "retreat") return s;
  return { ...s, phase: "investigation", result: undefined, turn: 0, instability: 0, uses: { naiah: 0, terrain: 0, witness: 0, shadow: 0 }, revision: s.revision + 1,
    speaker: "Naïah", message: "Le froid s’est tassé. On reprend à la dernière trace. Garde tes notes, elles servent encore." };
}
export function validHyleeSearch(value: unknown): value is HyleeSearchState {
  if (!value || typeof value !== "object") return false;
  const s = value as HyleeSearchState;
  const record = (v: unknown) => !!v && typeof v === "object" && !Array.isArray(v);
  const integer = (n: unknown, min: number, max: number) => Number.isInteger(n) && Number(n) >= min && Number(n) <= max;
  if (s.version !== 1 || !SEARCH_SCENARIOS.some(c => c.id === s.scenarioId) || !["killed", "memory-erased", "vegetative"].includes(s.motherOutcome)) return false;
  if (!integer(s.turn, 0, 8) || s.maxTurns !== 8 || !integer(s.instability, 0, 3) || !integer(s.revision, 0, Number.MAX_SAFE_INTEGER)) return false;
  if (!["investigation", "localized", "retreat"].includes(s.phase) || (s.phase === "localized" ? s.result !== "success" : s.phase === "retreat" ? s.result !== "retreat" : s.result !== undefined)) return false;
  if (s.phase === "investigation" && (s.turn >= 8 || s.instability >= 3)) return false;
  if (!record(s.selected) || Object.entries(s.selected).some(([c, id]) => !searchCard(c as SearchCategory, id))) return false;
  if (!record(s.uses) || Object.entries(SEARCH_LIMITS).some(([key, limit]) => !integer(s.uses[key as SearchSource], 0, limit))) return false;
  if (!record(s.notes) || Object.entries(s.notes).some(([key, note]) => { const [c, id] = key.split(":"); return !searchCard(c as SearchCategory, id) || !["maybe", "no", "yes"].includes(note); })) return false;
  if (!Array.isArray(s.clues) || new Set(s.clues.map(c => c?.id)).size !== s.clues.length || s.clues.some(c => !c || typeof c.id !== "string" || typeof c.text !== "string" || !["naiah", "terrain", "witness", "shadow", "localization"].includes(c.source)
    || !record(c.effects) || Object.entries(c.effects).some(([category, weights]) => !record(weights) || Object.entries(weights).some(([id, n]) => !searchCard(category as SearchCategory, id) || !Number.isFinite(n) || Math.abs(n) > 5)))) return false;
  return typeof s.message === "string" && ["Naïah", "Narration"].includes(s.speaker) && typeof s.tutorialSeen === "boolean";
}
