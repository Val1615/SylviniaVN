import type { DialogueLine } from "./game-data";
import type { IntimacyMode, PlayerSex } from "./date-scenes";
import type { IntimacyRoute } from "./intimacy-routes";
import { NAIAH_FOREST_INTIMACY_SCENES } from "./naiah-date-intimacy-forest";
import { NAIAH_EDGE_INTIMACY_SCENES } from "./naiah-date-intimacy-edge";
import { NAIAH_HOME_INTIMACY_SCENES } from "./naiah-date-intimacy-home";
import type { NaiahAuthoredScene, NaiahIntimacyContext, NaiahIntimacyPhase, NaiahRawLine } from "./naiah-date-intimacy-types";

export type NaiahProximityContext = NaiahIntimacyContext;
export type NaiahProximityPhase = NaiahIntimacyPhase;
export type NaiahProximityApproach = { id: string; text: string; lines: DialogueLine[] };

const PHASES: NaiahIntimacyPhase[] = ["transition", "initiative", "undressing", "reveal", "exploration", "adjustment", "counterplay", "experiment", "escalation", "surrender", "climax", "afterglow"];
const MODES: IntimacyMode[] = ["tendre", "suggestif", "explicite", "ellipse"];
const MODE_SEQUENCE_COUNTS: Record<IntimacyMode, number> = { tendre: 8, suggestif: 8, explicite: 12, ellipse: 8 };
const CONTEXTS: NaiahIntimacyContext[] = ["date-naiah-sanctuary", "date-naiah-akuhn", "home-naiah"];
const SEXES = ["femme", "homme"] as const;
const SCENES: NaiahAuthoredScene[] = [...NAIAH_FOREST_INTIMACY_SCENES, ...NAIAH_EDGE_INTIMACY_SCENES, ...NAIAH_HOME_INTIMACY_SCENES];

const lines = (raw: readonly NaiahRawLine[]): DialogueLine[] => raw.map((entry) => typeof entry === "string"
  ? { speaker: "Narration", text: entry }
  : { speaker: entry[0], text: entry[1], mood: entry[2] });

export const NAIAH_PROXIMITY_OPENINGS: Record<NaiahIntimacyContext, DialogueLine[]> = {
  "date-naiah-sanctuary": lines([
    "L’aulne noir se referme derrière vous. Le ruban relie encore vos poignets ; Naïah en éprouve la tension d’un mouvement et sourit en découvrant que vous ne le défaites pas.",
    ["Naïah", "Le jeu est fini. Cette phrase est vraie pendant environ trois secondes.", "smirk"],
    "Elle vous conduit dans un creux tapissé de mousse où le gardien d’écorce ne peut pas passer. Votre manche déchirée, la résine sur ses genoux et le ruban noué maintiennent la forêt dans la scène.",
    ["Naïah", "Je te dois une récompense, une revanche ou une très mauvaise idée. Choisis la forme du désastre.", "laugh"],
  ]),
  "date-naiah-akuhn": lines([
    "La ville miniature demeure sur la dalle. Naïah pousse les pierres vers l’abri de l’arche sans défaire le plan, puis s’assied à portée de vos genoux.",
    ["Naïah", "Tu as ruiné trois sièges, sauvé des inconnus et déplacé Allenna avec un morceau de pain. J’ai des questions.", "smirk"],
    "Le vent froid traverse encore les ruines. Plus bas, les rondes continuent selon les horaires qu’elle connaît par cœur ; ici, aucune d’elles ne peut interrompre la suite.",
    ["Naïah", "La première question est : jusqu’où peux-tu réfléchir quand je m’applique à t’en empêcher ?", "teasing"],
  ]),
  "home-naiah": lines([
    "La tasse ébréchée reste près de la vôtre. Naïah a fermé la porte, déplacé le canapé d’un demi-pas et mémorisé l’endroit exact où vous vous asseyez lorsque la soirée se prolonge.",
    ["Naïah", "Tu viens de me montrer une habitude. C’est presque une invitation au crime.", "smirk"],
    "Sa lanterne violette éclaire les vêtements laissés sur un dossier et la trace claire de la table qu’elle a déplacée. Le logement réel fournit déjà assez de cachettes ; elle n’a pas besoin d’inventer une chambre générique.",
    ["Naïah", "Je peux être sage. Regarde bien, cela ne durera pas.", "laugh"],
  ]),
};

export const NAIAH_PROXIMITY_APPROACHES: Record<NaiahIntimacyContext, NaiahProximityApproach[]> = {
  "date-naiah-sanctuary": [
    { id: "naiah-forest-ribbon", text: "Tirer doucement sur le ruban et lui rendre son propre défi", lines: lines(["Vous ramenez Naïah d’un pas. Elle regarde vos poignets liés, puis votre bouche.", ["Naïah", "Tu utilises encore mon matériel contre moi. Très bon début.", "teasing"]]) },
    { id: "naiah-forest-double", text: "Demander ce qu’est devenu le dernier double", lines: lines([["{player}", "Il en reste un."], "Un sourire identique apparaît derrière Naïah. La vraie tourne la tête, vexée d’avoir été devancée.", ["Naïah", "Il se croit meilleur que moi. Aidons-le à regretter cette ambition.", "smirk"]]) },
    { id: "naiah-forest-shadow", text: "Poser votre paume sur son ombre plutôt que sur sa main", lines: lines(["Votre paume rencontre une chaleur impossible dans l’ombre de Naïah. Elle cesse de tirer sur le ruban.", ["Naïah", "Oh. Tu veux voir la forêt par le mauvais côté.", "thinking"]]) },
  ],
  "date-naiah-akuhn": [
    { id: "naiah-edge-thread", text: "Continuer de suivre la ronde tout en l’invitant à vous distraire", lines: lines([["{player}", "La patrouille nord change dans neuf minutes."], "Naïah vient s’asseoir dans votre axe de vision.", ["Naïah", "Huit. Et tu n’iras jamais jusqu’à zéro.", "teasing"]]) },
    { id: "naiah-edge-shadow", text: "Lui demander comment elle perçoit réellement la ville", lines: lines(["Naïah ferme vos doigts autour d’une pierre encore tiède.", ["Naïah", "Pas avec les yeux. Si je t’ouvre le passage, ne cherche pas mes pensées. Écoute la distance.", "thinking"]]) },
    { id: "naiah-edge-plan", text: "Déplacer sa dernière pièce sans lui laisser le temps de prévoir", lines: lines(["Votre morceau de bois renverse la pierre noire et vient se poser entre ses cuisses.", ["Naïah", "Coup illégal."], ["{player}", "Tu n’avais pas annoncé les règles."], ["Naïah", "C’est atroce quand quelqu’un d’autre fait ça.", "laugh"]]) },
  ],
  "home-naiah": [
    { id: "naiah-home-hunt", text: "Vous installer à votre place habituelle et attendre son attaque", lines: lines(["Vous vous asseyez. Rien ne bouge, jusqu’à ce que deux mains réelles apparaissent derrière le dossier et couvrent vos yeux.", ["Naïah", "Terrain familier. Mauvaise raison de te croire en sécurité.", "teasing"]]) },
    { id: "naiah-home-shadow", text: "Éteindre la lampe et lui laisser seulement sa lanterne", lines: lines(["La luciole violette grossit, puis l’ombre de la pièce devient plus profonde que ses murs.", ["Naïah", "La maison reste ici. Nous allons seulement sentir autre chose à sa place.", "thinking"]]) },
    { id: "naiah-home-turn", text: "L’attirer contre vous avant qu’elle lance son prochain tour", lines: lines(["Vous saisissez sa main au moment où elle lève un doigt théâtral. Son sort inachevé produit un petit canard de brume qui s’enfuit sous la table.", ["Naïah", "Tu viens d’interrompre une catastrophe magnifique.", "laugh"], ["{player}", "Improviser te fera du bien."]]) },
  ],
};

export const NAIAH_PROXIMITY_ENDINGS: Record<NaiahIntimacyContext, DialogueLine[]> = {
  "date-naiah-sanctuary": lines(["Le ruban reste noué pendant le retour. Naïah le coupe seulement devant l’entrée, partage la longueur en deux et glisse sa moitié sous sa manche.", ["Naïah", "Ce n’est pas un souvenir. C’est la preuve matérielle que tu me dois une revanche.", "smirk"]]),
  "date-naiah-akuhn": lines(["Vous redescendez lorsque la dernière ronde disparaît derrière les murs. Naïah remet votre morceau de bois dans votre main, puis referme elle-même vos doigts dessus.", ["Naïah", "Garde-le. La prochaine ville aura besoin d’un problème imprévisible.", "thinking"]]),
  "home-naiah": lines(["Au matin, la tasse de Naïah demeure près de la vôtre et ses vêtements ont migré sur deux meubles différents. Elle enfile volontairement la mauvaise manche avant de vous regarder.", ["Naïah", "La maison m’a attaquée. Je reviendrai préparer ma vengeance.", "laugh"]]),
};

function routeFromScene(scene: NaiahAuthoredScene): IntimacyRoute {
  const chapters = Object.fromEntries(MODES.map((mode) => [mode, scene.chapters[mode].map(lines)])) as Record<IntimacyMode, DialogueLine[][]>;
  return { id: scene.id, text: scene.text, detail: scene.detail, chapters, visual: { revealChapter: 3, postOrgasmChapter: 99 } };
}

export function naiahProximityContext(dateId?: string, home = false): NaiahIntimacyContext | undefined {
  if (home) return "home-naiah";
  return CONTEXTS.includes(dateId as NaiahIntimacyContext) ? dateId as NaiahIntimacyContext : undefined;
}
export function naiahProximityPhase(chapter: number): NaiahIntimacyPhase | undefined { return PHASES[chapter]; }
export function naiahProximityApproaches(context?: NaiahIntimacyContext): NaiahProximityApproach[] | undefined { return context ? NAIAH_PROXIMITY_APPROACHES[context] : undefined; }
export function naiahProximityOpening(context: NaiahIntimacyContext): DialogueLine[] { return NAIAH_PROXIMITY_OPENINGS[context]; }
export function naiahProximityEnding(context: NaiahIntimacyContext): DialogueLine[] { return NAIAH_PROXIMITY_ENDINGS[context]; }
export function naiahProximityRoutes(context: NaiahIntimacyContext | undefined, sex: PlayerSex): IntimacyRoute[] {
  if (!context || sex === "intersexe") return [];
  return SCENES.filter((scene) => scene.context === context && scene.sex === sex).map(routeFromScene);
}

export function validateNaiahProximity() {
  let combinations = 0; let routes = 0; let chapters = 0;
  for (const context of CONTEXTS) for (const sex of SEXES) {
    combinations++;
    const entries = naiahProximityRoutes(context, sex);
    if (entries.length !== 3) throw new Error(`${context}/${sex}: trois scènes intimes Naïah requises`);
    const authored = SCENES.filter((scene) => scene.context === context && scene.sex === sex);
    if (new Set(authored.map((scene) => scene.concept)).size !== 3) throw new Error(`${context}/${sex}: trois concepts manuels distincts requis`);
    entries.forEach((entry) => {
      routes++;
      const serialized = MODES.map((mode) => JSON.stringify(entry.chapters[mode]));
      if (new Set(serialized).size !== MODES.length) throw new Error(`${entry.id}: les quatre modes doivent être écrits séparément`);
      MODES.forEach((mode) => {
        const routeChapters = entry.chapters[mode];
        const tooShort = routeChapters.some((chapter) => chapter.map((line) => line.text).join(" ").split(/\s+/u).length < 18);
        if (routeChapters.length !== MODE_SEQUENCE_COUNTS[mode] || tooShort) throw new Error(`${entry.id}/${mode}: ${MODE_SEQUENCE_COUNTS[mode]} séquences substantielles requises`);
        chapters += routeChapters.length;
      });
    });
  }
  if (naiahProximityRoutes("home-naiah", "intersexe").length) throw new Error("Le canon intersexe ne doit pas être improvisé");
  return { contexts: CONTEXTS.length, combinations, routes, chapters };
}
