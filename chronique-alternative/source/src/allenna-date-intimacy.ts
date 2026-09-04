import type { DialogueLine } from "./game-data";
import type { IntimacyMode, PlayerSex } from "./date-scenes";
import type { IntimacyRoute } from "./intimacy-routes";
import { polishIntimacyText } from "./intimacy-prose";

type AllennaDateId = "date-allenna-field" | "date-allenna-terrace";
type AllennaMood = "defi" | "tendre" | "passion";
type RawLine = string | [speaker: string, text: string, mood?: string];

export type AllennaIntimacyPhase = "approach" | "undressing" | "naked-reveal" | "partner-discovery" | "allenna-discovery" | "preliminaries" | "intensification" | "climax" | "afterglow" | "ending";
export type AllennaDateApproach = { id: string; text: string; lines: DialogueLine[] };

const PHASES: AllennaIntimacyPhase[] = ["approach", "undressing", "naked-reveal", "partner-discovery", "allenna-discovery", "preliminaries", "intensification", "climax", "afterglow", "ending"];
const MODES: IntimacyMode[] = ["tendre", "suggestif", "explicite", "ellipse"];
const SEXES: PlayerSex[] = ["femme", "homme", "intersexe"];
const DATES: AllennaDateId[] = ["date-allenna-field", "date-allenna-terrace"];

const lines = (raw: RawLine[], context: string): DialogueLine[] => raw.map((entry) => {
  const speaker = typeof entry === "string" ? "Narration" : entry[0];
  const text = typeof entry === "string" ? entry : entry[1];
  return { speaker, text: polishIntimacyText(text, { speaker, context }), mood: typeof entry === "string" ? undefined : entry[2] };
});

const LABELS: Record<AllennaMood, Record<PlayerSex, string>> = {
  defi: {
    femme: "Prolonger le défi entre deux femmes jusqu'à ce que la gêne devienne un jeu",
    homme: "Répondre à ses provocations et laisser vos deux corps redistribuer l'initiative",
    intersexe: "Inventer un défi sensuel adapté à vos appuis et à vos anatomies réelles",
  },
  tendre: {
    femme: "Découvrir Allenna avec la lenteur attentive d'une autre femme",
    homme: "Laisser sa gêne devenir tendresse sans lui demander de l'expliquer",
    intersexe: "Construire une proximité tendre où aucun corps n'est supposé à l'avance",
  },
  passion: {
    femme: "Laisser le désir contenu d'Allenna devenir une passion franche entre deux femmes",
    homme: "Suivre son désir lorsqu'il dépasse enfin la prudence du premier regard",
    intersexe: "Choisir ensemble les prises et les rythmes d'une passion adaptée à vos corps",
  },
};

const MOOD_DETAIL: Record<AllennaMood, string> = {
  defi: "Défi et jeu : Allenna transforme sa nervosité en provocations, changements d'initiative et humour sec.",
  tendre: "Intimidée et tendre : les silences, les regards qui fuient et les gestes prudents gagnent peu à peu en assurance.",
  passion: "Désir contenu et passion : la gêne reste visible au départ, puis les gestes deviennent francs et intenses.",
};

const DATE_APPROACHES: Record<AllennaDateId, AllennaDateApproach[]> = {
  "date-allenna-field": [
    { id: "allenna-field-ribbon", text: "Nouer vos deux rubans ensemble et réclamer la dernière manche", lines: lines(["Vous réunissez les rubans froissés. Allenna vérifie le nœud, comprend que la nouvelle manche se jouera à quelques centimètres et relève le menton.", ["Allenna", "La règle manque de précision. La mise, elle, est claire.", "smirk"]], "allenna-field-approach") },
    { id: "allenna-field-fall", text: "L'attirer avec vous sur les tapis avant qu'elle annonce une autre règle", lines: lines(["Vous tirez doucement sur son ruban. Allenna pourrait résister ; elle choisit de suivre et amortit votre chute d'un bras.", ["Allenna", "Vous utilisez encore le terrain. J'approuve la constance.", "troubled"]], "allenna-field-approach") },
    { id: "allenna-field-reward", text: "Lui laisser choisir la récompense de votre égalité", lines: lines([["Allenna", "Un baiser. Ensuite nous renégocierons selon le résultat.", "troubled"], "Elle s'approche avant de pouvoir transformer la décision en règlement."], "allenna-field-approach") },
  ],
  "date-allenna-terrace": [
    { id: "allenna-pot-spice", text: "Essuyer une trace d'épice sur sa bouche avec votre pouce", lines: lines(["Allenna s'immobilise lorsque votre pouce atteint sa lèvre. Elle goûte l'épice restée sur votre peau avant de vous rendre le geste.", ["Allenna", "Le dosage mérite une seconde vérification.", "smirk"]], "allenna-pot-approach") },
    { id: "allenna-pot-apron", text: "Défaire le nœud de son tablier sans cesser de soutenir son regard", lines: lines(["Le tablier tombe près du brasero. Allenna regarde vos doigts, puis votre bouche.", ["Allenna", "Vous aviez prévu cette étape avant le dessert.", "troubled"]], "allenna-pot-approach") },
    { id: "allenna-pot-fourth", text: "Lui proposer une quatrième couleur qui n'appartiendra qu'à cette nuit", lines: lines([["Allenna", "Votre métaphore est douteuse.", "smirk"], "Elle vient pourtant vous embrasser, encore parfumée de fumée et de baies rouges."], "allenna-pot-approach") },
  ],
};

function dateTexture(dateId: AllennaDateId, phase: AllennaIntimacyPhase): RawLine[] {
  const field: Record<AllennaIntimacyPhase, RawLine[]> = {
    approach: ["Les rubans réunissent encore vos poignets quand Allenna vous attire au centre des tapis. La compétition reste dans son sourire, plus dans la distance."],
    undressing: ["Chaque vêtement retiré devient une manche silencieuse. Allenna essaie de conserver l'avantage, accroche sa propre manche au ruban et laisse échapper un rire bref lorsque vous la libérez."],
    "naked-reveal": ["Quand le dernier tissu quitte son corps, Allenna relève légèrement le menton comme devant un défi. Ses joues rougissent, une main hésite à remonter vers sa poitrine ; elle soutient votre regard puis le détourne, contrariée par sa propre gêne."],
    "partner-discovery": ["Le tapis porte encore les marques de vos appuis. Allenna vous y allonge sans brusquer le mouvement et attend que votre corps lui indique où reprendre."],
    "allenna-discovery": ["Vous suivez ses épaules, sa poitrine, son ventre et les cicatrices de ses hanches sans les inventorier. Allenna se raidit au premier contact inutile, puis revient elle-même sous votre paume."],
    preliminaries: ["Le premier ruban glisse entre vos peaux comme le souvenir d'une règle. Allenna le retire, le pose hors du tapis et revient avec une curiosité plus physique que méthodique."],
    intensification: ["Vous changez de position comme pendant l'exercice, mais chaque reprise se conclut par une bouche, une main ou un bassin pressé contre l'autre. Allenna cesse de compter les manches."],
    climax: ["Le défi ne cherche plus de vainqueur. Allenna garde votre regard aussi longtemps qu'elle le peut, puis le perd dans la secousse du plaisir."],
    afterglow: ["Allenna reste nue sur les tapis, une cuisse lourde sur les vôtres. Elle retrouve un ruban près de son épaule et le noue lâchement autour de vos deux mains."],
    ending: [["Allenna", "Égalité. La revanche exigera une nuit entière.", "smirk"], "Elle range les rubans dans sa poche avant de rouvrir la salle."],
  };
  const pot: Record<AllennaIntimacyPhase, RawLine[]> = {
    approach: ["La réserve garde la chaleur du brasero, l'odeur des épices et la couleur inquiétante du chaudron derrière la porte. Allenna vous embrasse avec un rire encore retenu par votre verdict culinaire."],
    undressing: ["Les tabliers rejoignent les bottes. Une attache résiste ; Allenna menace de la couper, accepte votre aide et découvre que l'attente rend vos doigts contre sa peau beaucoup plus troublants."],
    "naked-reveal": ["Nue dans la lumière chaude, Allenna relève légèrement le menton et tente de soutenir votre regard. Ses joues rougissent, son corps reste un peu raide ; une main hésite à se couvrir avant de retomber, puis ses yeux se détournent malgré elle."],
    "partner-discovery": ["Elle déroule une couverture entre les sacs de farine et vous y fait asseoir. Ses mains sentent encore les baies et avancent sur votre corps sans chercher la moindre fonction pratique."],
    "allenna-discovery": ["Votre bouche retrouve sur sa peau le sel, la fumée et une pointe d'épice. Allenna rit lorsque vous prétendez identifier les ingrédients, puis son rire se brise sous une caresse plus précise."],
    preliminaries: ["Le brasero dessine des ombres orange et violettes sur vos corps. Allenna goûte votre peau avec la même concentration que le plat, mais le résultat lui fait perdre toute phrase technique."],
    intensification: ["La chaleur transforme la réserve en monde clos. Allenna change d'appui, vous attire plus franchement et laisse son désir choisir le rythme à la place de toute recette."],
    climax: ["Le plaisir arrive avec l'odeur des baies écrasées et le bruit lointain du chaudron qui refroidit. Allenna serre vos hanches et oublie entièrement la prochaine étape."],
    afterglow: ["Allenna reste nue sous la couverture, partage avec vous la dernière cuillère du plat et admet qu'il est meilleur froid sans pouvoir défendre cette conclusion sérieusement."],
    ending: [["Allenna", "Il faudra vérifier la quatrième couleur.", "smirk"], "Sa main revient sous la couverture, promesse d'une expérience qui n'aura rien de culinaire."],
  };
  return (dateId === "date-allenna-field" ? field : pot)[phase];
}

function moodTexture(mood: AllennaMood, phase: AllennaIntimacyPhase): RawLine[] {
  if (mood === "defi") {
    if (phase === "approach") return [["Allenna", "Je vous préviens : rougir ne compte pas comme céder.", "smirk"]];
    if (phase === "intensification") return ["Allenna reprend l'initiative, la perd volontairement et vous accuse de tricher lorsque votre plaisir rend la riposte moins précise."];
    if (phase === "afterglow") return [["Allenna", "Je demande une revanche dès que mes jambes redeviennent fiables.", "smirk"]];
  }
  if (mood === "tendre") {
    if (phase === "approach") return ["Allenna laisse un silence durer entre deux baisers. Son front rejoint le vôtre avant que ses mains osent reprendre leur chemin."];
    if (phase === "intensification") return ["Chaque geste prudent reçoit une réponse plus claire. Allenna vous touche avec une tendresse appliquée qui devient tactile, chaude et de moins en moins timide."];
    if (phase === "afterglow") return [["Allenna", "Reste comme ça. Je n'ai rien de plus précis à demander.", "troubled"]];
  }
  if (mood === "passion") {
    if (phase === "approach") return ["La gêne tient encore dans ses épaules ; le désir, lui, pousse Allenna à vous ramener contre elle avant la fin du premier souffle."];
    if (phase === "intensification") return ["Ses gestes avancent par poussées franches. Allenna vous réclame plus près, plus fort, puis ralentit juste assez pour reprendre votre bouche avant de repartir."];
    if (phase === "afterglow") return [["Allenna", "Je contenais cela depuis beaucoup trop longtemps.", "troubled"]];
  }
  return [];
}

function bodyDiscovery(sex: PlayerSex, mode: IntimacyMode): RawLine[] {
  if (mode === "ellipse") return ["Allenna découvre votre corps réel par vos gestes et vos indications. La couverture se referme lorsque vos souffles remplacent les mots."];
  if (sex === "femme") return mode === "explicite"
    ? ["Allenna embrasse votre poitrine puis descend entre vos cuisses. Ses doigts écartent doucement les lèvres de votre vulve, trouvent votre humidité et apprennent le rythme de votre clitoris avant que sa bouche prenne leur place."]
    : ["Allenna suit votre poitrine, votre ventre et vos hanches de ses paumes. Sa cuisse se glisse entre les vôtres ; elle écoute la manière dont votre bassin répond."];
  if (sex === "homme") return mode === "explicite"
    ? ["Allenna libère votre pénis dressé, l'entoure d'une main encore hésitante puis en suit la longueur de sa langue. Elle ajuste pression et cadence à vos réactions, sans prétendre connaître votre plaisir avant de le voir."]
    : ["Allenna découvre votre torse, votre ventre puis votre érection contre sa paume. Sa gêne cède à une curiosité franche lorsqu'elle vous sent chercher le contact."];
  return mode === "explicite"
    ? ["Allenna vous demande le geste exact, puis explore votre sexe intersexe sans modèle préfabriqué : zone externe, longueur sensible ou ouverture offerte. Ses doigts et sa bouche ajustent l'angle à vos mots et à vos réactions réelles."]
    : ["Allenna suit l'anatomie que vous lui montrez sans lui imposer de nom. Ses mains apprennent vos zones sensibles, vos appuis et les mouvements qui vous rapprochent."];
}

function climax(sex: PlayerSex, mode: IntimacyMode): RawLine[] {
  if (mode === "ellipse") return ["Vos appuis changent, vos voix se perdent et le récit laisse à vos corps la précision de la suite. Lorsque la couverture retombe, Allenna tremble encore contre vous."];
  if (mode === "tendre") return ["Les frottements et les caresses gardent une lenteur continue. Votre plaisir arrive contre Allenna ; elle l'accompagne avant de céder à son tour sous votre main, sans rompre l'étreinte."];
  if (sex === "femme") return mode === "explicite"
    ? ["Allenna garde deux doigts en vous tandis que votre main travaille son clitoris humide. Vos bassins trouvent une cadence commune ; votre orgasme serre ses doigts, puis vous prolongez les caresses jusqu'à la sentir jouir à son tour contre votre cuisse."]
    : ["Vos cuisses se mêlent et vos mains alternent entre vos sexes. Allenna perd le rythme sous votre paume, le retrouve sur vous et vous conduit au plaisir presque avec elle."];
  if (sex === "homme") return mode === "explicite"
    ? ["Allenna guide votre pénis contre son entrée humide puis vous accueille selon l'angle choisi ensemble. Votre main reste sur son clitoris ; elle jouit autour de vous avant que ses mouvements vous entraînent jusqu'à l'orgasme."]
    : ["Allenna vient s'asseoir sur vous et choisit une cadence qui devient plus franche à chaque mouvement. Son plaisir sous votre main précède le vôtre sans interrompre le rythme."];
  return mode === "explicite"
    ? ["Vous choisissez pénétration, frottement ou stimulation externe selon votre anatomie. Allenna maintient la pression demandée pendant que votre main travaille son clitoris ; vos orgasmes arrivent par deux chemins distincts dans la même étreinte."]
    : ["Les gestes s'adaptent à vos zones sensibles et à ses demandes. Votre plaisir traverse le contact choisi ; Allenna vous laisse revenir à elle jusqu'à jouir sous vos mains."];
}

function routeChapters(dateId: AllennaDateId, mood: AllennaMood, sex: PlayerSex, mode: IntimacyMode): DialogueLine[][] {
  const context = `allenna-${dateId}-${mood}-${sex}-${mode}`;
  return PHASES.map((phase) => {
    const raw: RawLine[] = [...dateTexture(dateId, phase), ...moodTexture(mood, phase)];
    if (phase === "partner-discovery") raw.push(...bodyDiscovery(sex, mode));
    if (phase === "preliminaries") raw.push(...bodyDiscovery(sex, mode === "explicite" ? "suggestif" : mode));
    if (phase === "climax") raw.push(...climax(sex, mode));
    return lines(raw, context);
  });
}

export function allennaDateIntimacyPhase(chapter: number): AllennaIntimacyPhase | undefined { return PHASES[chapter]; }
export function allennaDateApproaches(dateId?: string): AllennaDateApproach[] | undefined { return DATES.includes(dateId as AllennaDateId) ? DATE_APPROACHES[dateId as AllennaDateId] : undefined; }

export function allennaDateIntimacyRoutes(dateId: string | undefined, sex: PlayerSex): IntimacyRoute[] {
  if (!DATES.includes(dateId as AllennaDateId)) return [];
  return (["defi", "tendre", "passion"] as AllennaMood[]).map((mood) => ({
    id: `${dateId}-${mood}-${sex}`,
    text: LABELS[mood][sex],
    detail: MOOD_DETAIL[mood],
    chapters: Object.fromEntries(MODES.map((mode) => [mode, routeChapters(dateId as AllennaDateId, mood, sex, mode)])) as Record<IntimacyMode, DialogueLine[][]>,
  }));
}

export function validateAllennaDateIntimacy(): { dates: number; combinations: number; routes: number; chapters: number } {
  let combinations = 0; let routes = 0; let chapters = 0;
  DATES.forEach((dateId) => SEXES.forEach((sex) => {
    const entries = allennaDateIntimacyRoutes(dateId, sex);
    if (entries.length !== 3) throw new Error(`${dateId}/${sex}: trois moods Allenna requis`);
    entries.forEach((entry) => MODES.forEach((mode) => {
      const sequence = entry.chapters[mode];
      if (sequence.length !== PHASES.length || sequence.some((chapter) => chapter.length === 0)) throw new Error(`${entry.id}/${mode}: progression intime incomplète`);
      const reveal = sequence[PHASES.indexOf("naked-reveal")].map((line) => line.text).join(" ");
      if (!/menton/u.test(reveal) || !/roug/iu.test(reveal) || !/détourn/iu.test(reveal)) throw new Error(`${entry.id}/${mode}: révélation nue Allenna incomplète`);
      chapters += sequence.length;
    }));
    combinations += 1; routes += entries.length;
  }));
  return { dates: DATES.length, combinations, routes, chapters };
}

validateAllennaDateIntimacy();
