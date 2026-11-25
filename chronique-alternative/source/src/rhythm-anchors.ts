/*
 * Jeu de rythme intime · ancrages des scènes écrites (lot 0, Bellirith au lot 1).
 *
 * Module technique (exclu de l'enveloppe Studio). Pour chaque route, la liste des
 * séquences couvertes par le jeu et le geste que le texte y décrit. L'ancrage
 * référence les séquences, il ne les recopie pas : le texte affiché pendant le jeu
 * est lu au moment de jouer dans le catalogue de la scène (route.chapters[mode][i]),
 * donc les variantes d'historique de Bellirith restent exactes.
 *
 * Règle commune : le jeu s'ouvre sur la première séquence où un geste commence après
 * la révélation, joue jusqu'à la séquence du dernier sommet (apogée et appui final),
 * puis rend la main au texte à la séquence suivante, précédée de la bulle de fin.
 *
 * Codes d'une phase : « 6b » = séquence 6, geste bouche. m : ses mains, M : vos doigts,
 * b : sa bouche, l : votre bouche, f : frottement, pv : pénétration (axe vertical, elle
 * mène), pp : pénétration (en profondeur), i : rupture écrite (la piste se fige).
 * Suffixe « ^ » : elle s'arrête au bord dans cette séquence (silence à tenir).
 * Suffixe « ! » (scènes à plusieurs, après la voix) : relais de sommets, une personne atteint son sommet dans cette
 * séquence et la scène continue (petite montée, tenue, voix d'apogée de la personne).
 * Suffixe « @A » ou « @L » (scènes à plusieurs) : voix de la phase, la personne qui reçoit le geste.
 * Relecture manuelle faite au lot 1 (voir PLAN.md, annexe A), puis aux lots 4 à 6 pour Allenna, Lineva
 * et leur trio (annexe B).
 */
import type { DialogueLine } from "./game-data";
import type { RhythmDifficulty, RhythmGesture, RhythmMotifStep, RhythmSectionDef, RhythmShakeAxis } from "./rhythm-intimacy-engine";
import type { RhythmSceneText, RhythmSectionText } from "./rhythm-intimacy";
import { HYLEE_HOME_RHYTHM } from "./rhythm-intimacy";
import { RHYTHM_PROFILES, type RhythmProfile } from "./rhythm-profiles";
import { RHYTHM_CADENCE_LABELS, RHYTHM_PHASE_LABELS, type RhythmCharacterBubbles } from "./rhythm-bubbles";
import { BELLIRITH_RHYTHM_BUBBLES } from "./rhythm-bubbles-bellirith";
import { ALLENNA_RHYTHM_BUBBLES } from "./rhythm-bubbles-allenna";
import { LINEVA_RHYTHM_BUBBLES } from "./rhythm-bubbles-lineva";
import { ALLENNA_LINEVA_RHYTHM_BUBBLES } from "./rhythm-bubbles-allenna-lineva";
import { REMERII_RHYTHM_BUBBLES } from "./rhythm-bubbles-remerii";

export type RhythmPhaseCode = "m" | "M" | "b" | "l" | "f" | "pv" | "pp" | "i";
export type RhythmPhaseAnchor = { chapter: number; code: RhythmPhaseCode; bord: boolean; relay?: boolean; voice?: string };
export type RhythmAnchor = {
  character: string;
  /** Contexte de la scène (diversion, heure volée, duel). */
  context: string;
  routeId: string;
  sex: "homme" | "femme";
  phases: RhythmPhaseAnchor[];
  /** Séquence où le texte reprend après le jeu. */
  returnChapter: number;
  /** Coup pour coup (duel) : la première phase d'union devient un appel et réponse. */
  appel?: boolean;
  /** Version Suggestif écrite à part (autre découpage de séquences) : ses propres phases. */
  suggestif?: { phases: RhythmPhaseAnchor[]; returnChapter: number };
};

type Row = [context: string, routeId: string, homme: string, femme: string, returnChapter: number];
/* Bellirith, 14 routes × 2 corps = 28 variantes (diversions, heures volées, duel final). */
const BELLIRITH_ROWS: Row[] = [
  ["bellirith-diversion-price-of-aid", "bellirith-mirrors", "4m 5m^ 6b 7b^ 8b 9l 10pv", "4m 5m^ 6b 7b^ 8b 9l 10f", 11],
  ["bellirith-diversion-return-akuhn", "bellirith-baths", "3m 4i 5b 6b 7m 8pv 9pv", "3m 4i 5b 6b 7m 8f 9f", 10],
  ["bellirith-diversion-before-light", "bellirith-saelis", "4m 5b 6b 7i 8pv 9pv", "4m 5b 6b 7i 8f 9f", 10],
  ["bellirith-diversion-coalition", "bellirith-eve", "4f 5m 6b 7pv 8pv", "4m 5m 6b 7f 8M", 9],
  ["date-bellirith-music", "bellirith-heure-salon", "5b 6i 7l 8pv 9pv", "5b 6i 7l 8f 9f", 10],
  ["date-bellirith-market", "bellirith-heure-auberge", "6M 7b 8i 9pv 10pv", "6M 7b 8i 9f 10f", 11],
  ["bellirith-home", "bellirith-heure-logis", "6l 7b 8i 9pv 10pp", "6l 7m 8i 9f 10f", 11],
  ["bellirith-free-confidence", "bellirith-heure-confidence", "6b 7i 8l 9pp 10pp", "6b 7i 8l 9f 10f", 11],
  ["bellirith-free-ennui", "bellirith-heure-ennui", "5l 6i 7b^ 8m 9pv 10pv", "5l 6i 7m^ 8m 9f 10f", 11],
  ["bellirith-free-matin", "bellirith-heure-matin", "5m^ 6m 7i 8l 9pp 10pp", "5m^ 6m 7i 8l 9M 10M", 11],
  ["bellirith-free-couloir", "bellirith-heure-couloir", "6m 7l 8i 9pp 10pp", "6m 7l 8i 9f 10f", 11],
  ["bellirith-free-faveur", "bellirith-heure-faveur", "6l 7b 8i 9pv 10pv", "6l 7b 8i 9f 10f", 11],
  ["date-bellirith-final", "bellirith-duel-steal", "3m 4i 5m 6l 7l 8pv 9pv", "3m 4i 5m 6l 7l 8f 9f", 10],
  ["date-bellirith-final", "bellirith-duel-turn", "4m^ 5i 6M 7l^ 8pv 9pv", "4m^ 5i 6M 7l^ 8f 9f", 10],
];

/*
 * Allenna (lot 4), relecture manuelle (PLAN.md, annexe B) : les trois humeurs d'un rendez-vous partagent
 * les mêmes gestes. Séquence 3 : sa bouche, et l'hésitation écrite d'Allenna (silence au bord).
 * Séquence 4 : vos mains sur ses cicatrices (terrain) ou votre bouche (terrasse). Séquence 7, femme :
 * ses doigts en vous et votre main sur elle, une seule cadence partagée (frottement).
 */
const ALLENNA_DATES: [dateId: string, fourth: string][] = [["date-allenna-field", "M"], ["date-allenna-terrace", "l"]];
const ALLENNA_MOODS = ["defi", "tendre", "passion"];
/* Logis d'Allenna : changement de positions (séquence 3) puis le sommet (séquence 4) ; la séquence 5 est une reprise après le sommet. */
const ALLENNA_HOME: Row[] = [
  ["home-allenna", "premiere-prise", "3f 4pv", "3f 4b", 5],
  ["home-allenna", "siege-du-canape", "3f 4pv", "3f 4f", 5],
  ["home-allenna", "derniere-manche", "3f 4pv", "3f 4b", 5],
];
/*
 * Lineva (lot 5) : séquence 5, une seule réplique d'ordre qui commente le geste de la séquence 4 ; elle
 * prolonge donc ce geste (ce n'est pas une rupture). Quartiers, humeur passionnée : ses doigts guident les vôtres.
 */
const LINEVA_DATES = ["date-lineva-ramparts", "date-lineva-quarters"];
const LINEVA_MOODS = ["joueuse", "tendre", "passionnee"];
/* Logis de Lineva : révélation en séquence 3, une seule phase jouée (le sommet, séquence 4). Parties courtes, à juger. */
const LINEVA_HOME: Row[] = [
  ["home-lineva", "cle-de-la-releve", "4pv", "4b", 5],
  ["home-lineva", "noeud-de-port", "4pv", "4b", 5],
  ["home-lineva", "maree-interieure", "4pv", "4f", 5],
];
/*
 * Allenna et Lineva (lot 6), 18 variantes relues une à une (PLAN.md, annexe B). Les codes suivent ce que
 * vous faites ou recevez ; la voix suit la personne qui reçoit le geste. « ! » : un sommet au milieu de la
 * scène (relais), le dernier sommet clôt le jeu. La séquence 10 (le tutoiement de Lineva après votre
 * plaisir) est une rupture écrite : la piste se fige.
 * Suggestif : texte propre en 8 séquences, un seul sommet (le vôtre, séquence 5) ; caresses puis sommet.
 */
type GroupRow = [routeId: string, phases: string, returnChapter: number];
const GROUP_ROWS: GroupRow[] = [
  ["group-date-allenna-lineva-training-homme-revanche", "3b@A 4b@A 5l@L 6l@L! 7pp@A 8pp@A! 9m@L! 10i 11M@L", 12],
  ["group-date-allenna-lineva-training-homme-douches", "2b@A^ 3b@A 4M@L 5M@L! 6pp@A 7pp@A! 8pp@L 9pp@L! 10i 11l@L", 12],
  ["group-date-allenna-lineva-training-homme-apres-duel", "4b@L 5b@L! 6pv@A^ 7pv@A 8pv@A! 9pv@A! 10i 11l@L", 12],
  ["group-date-allenna-lineva-training-femme-revanche", "4b@L 5b@L 6M@A^ 7M@L! 8f@L 9f@L! 10M@A 11M@A", 12],
  ["group-date-allenna-lineva-training-femme-douches", "3b@A^ 4b@A 5b@A 6M@L 7M@L! 8m@A! 9i 10l@A 11M@A", 12],
  ["group-date-allenna-lineva-training-femme-apres-duel", "4l@A^ 5M@L 6b@L 7M@L! 8b@A 9b@A! 10i 11l@A", 12],
  ["group-date-allenna-lineva-basin-homme-jeu-eau", "3m@A^ 4b@A 5b@A 6M@L 7M@L! 8pp@A 9pp@A! 10i 11M@L", 12],
  ["group-date-allenna-lineva-basin-homme-rebord", "3l@A^ 4l@A 5pp@L 6pp@L! 7pp@A 8pp@A! 9pp@A! 10i 11M@A", 12],
  ["group-date-allenna-lineva-basin-homme-alcove", "3b@A^ 4b@A 5M@L 6m@L! 7pv@A 8pv@A! 9pv@A! 10i 11M@L", 12],
  ["group-date-allenna-lineva-basin-femme-jeu-eau", "4b@L 5b@L 6M@A^ 7M@A! 8b@L 9b@L! 10i 11M@L", 12],
  ["group-date-allenna-lineva-basin-femme-rebord", "3l@A^ 4l@A 5b@A 6M@L! 7M@A 8M@A! 9b@L! 10i 11l@A", 12],
  ["group-date-allenna-lineva-basin-femme-alcove", "2m@A^ 3m@A 4i 5l@L 6l@L! 7l@A 8l@A! 9m@A! 10i 11M@A", 12],
  ["group-date-allenna-lineva-home-homme-canape", "3m@A^ 4b@A 5b@A 6M@L! 7pv@A 8pv@A! 9pv@A! 10i 11M@A", 12],
  ["group-date-allenna-lineva-home-homme-cuisine", "3m@A^ 4M@A 5M@A! 6M@L 7M@L! 8pp@L! 9pp@L! 10i 11M@A", 12],
  ["group-date-allenna-lineva-home-homme-chambre", "3b@A^ 4b@A 5M@L 6M@L! 7pp@A 8pp@A! 9pp@A! 10i 11l@L", 12],
  ["group-date-allenna-lineva-home-femme-canape", "4b@L 5M@A! 6M@L 7M@L! 8b@L 9b@L! 10i 11l@A", 12],
  ["group-date-allenna-lineva-home-femme-cuisine", "4M@A^ 5M@A! 6l@L 7l@L! 8m@A 9m@A! 10i 11M@L", 12],
  ["group-date-allenna-lineva-home-femme-chambre", "3b@A^ 4b@A 5b@A! 6M@L 7M@L! 8m@A 9m@A! 10i 11M@A", 12],
];
const GROUP_SUGGESTIF = "3m@A 4f@L 5f@A";
/*
 * Remerii (lot 7), relecture manuelle (PLAN.md, annexe C) : séquence 3, sa bouche (homme) ou ses doigts, parfois sa
 * bouche (femme) ; séquence 4, la cicatrice, rupture écrite (rien à toucher) ; séquence 5, votre bouche et vos doigts ;
 * 6 et 7 selon la position écrite (assise face à vous : elle mène ; couchés sur le côté : au plus profond ; jambes mêlées : frottement).
 */
const REMERII_ROWS: Row[] = [
  ["date-remerii-lanterns", "date-remerii-lanterns-complice", "3b 4i 5l 6f 7pv", "3m 4i 5l 6f 7f", 8],
  ["date-remerii-lanterns", "date-remerii-lanterns-attentive", "3b 4i 5l 6f 7pp", "3b 4i 5l 6f 7m", 8],
  ["date-remerii-lanterns", "date-remerii-lanterns-elan", "3b 4i 5l 6pv 7pv", "3b 4i 5l 6f 7f", 8],
  ["date-remerii-observatory", "date-remerii-observatory-complice", "3b 4i 5l 6f 7pv", "3b 4i 5l 6f 7M", 8],
  ["date-remerii-observatory", "date-remerii-observatory-attentive", "3b 4i 5l 6pp 7pp", "3m 4i 5l 6f 7m", 8],
  ["date-remerii-observatory", "date-remerii-observatory-elan", "3b 4i 5l 6pv 7pv", "3b 4i 5l 6f 7f", 8],
  ["home-remerii", "home-remerii-complice", "3b 4i 5l 6pv 7pv", "3m 4i 5l 6f 7M", 8],
  ["home-remerii", "home-remerii-attentive", "3b 4i 5l 6pp 7pp", "3m 4i 5l 6f 7m", 8],
  ["home-remerii", "home-remerii-elan", "3b 4i 5l 6pv 7pv", "3b 4i 5l 6f 7f", 8],
];

function parsePhases(spec: string): RhythmPhaseAnchor[] {
  return spec.split(/\s+/).map((token) => {
    const match = /^(\d+)(pv|pp|m|M|b|l|f|i)(?:@([A-Z]))?([\^!]*)$/.exec(token);
    if (!match) throw new Error(`ancrage illisible : ${token}`);
    return { chapter: Number(match[1]), code: match[2] as RhythmPhaseCode, bord: match[4].includes("^"), ...(match[4].includes("!") ? { relay: true } : {}), ...(match[3] ? { voice: match[3] } : {}) };
  });
}
const SEXES = ["homme", "femme"] as const;

export const RHYTHM_ANCHORS: RhythmAnchor[] = [
  ...BELLIRITH_ROWS.flatMap(([context, routeId, homme, femme, returnChapter]) => SEXES.map((sex) => ({
    character: "bellirith", context, routeId, sex, phases: parsePhases(sex === "homme" ? homme : femme), returnChapter,
    ...(context === "date-bellirith-final" ? { appel: true } : {}),
  }))),
  ...ALLENNA_DATES.flatMap(([dateId, fourth]) => ALLENNA_MOODS.flatMap((mood) => SEXES.map((sex): RhythmAnchor => ({
    character: "allenna", context: dateId, routeId: `${dateId}-${mood}-${sex}`, sex,
    phases: parsePhases(`3b^ 4${fourth} 5m 6f 7${sex === "homme" ? "pv" : "f"}`), returnChapter: 8,
  })))),
  ...ALLENNA_HOME.flatMap(([context, route, homme, femme, returnChapter]) => SEXES.map((sex): RhythmAnchor => ({
    character: "allenna", context, routeId: `home-allenna-${sex}-${route}`, sex, phases: parsePhases(sex === "homme" ? homme : femme), returnChapter,
  }))),
  ...LINEVA_DATES.flatMap((dateId) => LINEVA_MOODS.flatMap((mood) => SEXES.map((sex): RhythmAnchor => {
    const fourth = dateId === "date-lineva-quarters" && mood === "passionnee" ? "M" : "l";
    return { character: "lineva", context: dateId, routeId: `${dateId}-${mood}-${sex}`, sex, phases: parsePhases(`3b 4${fourth} 5${fourth} 6M 7${sex === "homme" ? "pv" : "f"}`), returnChapter: 8 };
  }))),
  ...LINEVA_HOME.flatMap(([context, route, homme, femme, returnChapter]) => SEXES.map((sex): RhythmAnchor => ({
    character: "lineva", context, routeId: `home-lineva-${sex}-${route}`, sex, phases: parsePhases(sex === "homme" ? homme : femme), returnChapter,
  }))),
  ...GROUP_ROWS.map(([routeId, phases, returnChapter]): RhythmAnchor => ({
    character: "allenna-lineva", context: routeId.replace(/-(homme|femme)-.*$/, ""), routeId, sex: routeId.includes("-homme-") ? "homme" : "femme",
    phases: parsePhases(phases), returnChapter, suggestif: { phases: parsePhases(GROUP_SUGGESTIF), returnChapter: 6 },
  })),
  ...REMERII_ROWS.flatMap(([context, route, homme, femme, returnChapter]) => SEXES.map((sex): RhythmAnchor => ({
    character: "remerii", context, routeId: `${route}-${sex}`, sex, phases: parsePhases(sex === "homme" ? homme : femme), returnChapter,
  }))),
];

export function rhythmAnchorFor(character: string, routeId: string | undefined, sex: string): RhythmAnchor | undefined {
  if (!routeId) return undefined;
  // Corps non binaire ou autre : la variante femme reste la plus proche (la scène écrite choisit déjà son texte).
  const body = sex === "homme" ? "homme" : "femme";
  return RHYTHM_ANCHORS.find((anchor) => anchor.character === character && anchor.routeId === routeId && anchor.sex === body);
}

/* ---------- construction de la partition et des textes à partir de la scène écrite ---------- */

const T = (beats = 1, motion?: "haut" | "bas"): RhythmMotifStep => ({ kind: "tap", beats, ...(motion ? { motion } : {}) });
const HOLD = (beats: number, motion?: "haut" | "bas"): RhythmMotifStep => ({ kind: "hold", beats, ...(motion ? { motion } : {}) });
const SL = (direction: "left" | "right", beats = 1): RhythmMotifStep => ({ kind: "slide", beats, direction });
const MOTIFS: Record<Exclude<RhythmGesture, "penetration">, RhythmMotifStep[]> = {
  main: [T(1, "haut"), T(1, "bas"), T(1, "haut"), T(1, "bas"), HOLD(2, "haut")],
  bouche: [T(), T(), HOLD(2), T(), T(), T(), HOLD(2)],
  langue: [T(1), T(0.5), T(1.5), SL("left"), T(0.5), T(0.5), SL("right"), T(1.5)],
  frottement: [T(1), T(1), T(0.5), T(0.5), T(1), HOLD(2)],
};
/** Motifs de coup pour coup : elle joue, vous rejouez. */
const APPELS = [[1, 1, 1, 1], [1, 0.5, 0.5, 2], [0.5, 0.5, 1, 2], [1, 1, 0.5, 1.5]];

function gestureOf(code: RhythmPhaseCode): RhythmGesture | "interlude" {
  if (code === "m" || code === "M") return "main";
  if (code === "b") return "bouche";
  if (code === "l") return "langue";
  if (code === "f") return "frottement";
  if (code === "pv" || code === "pp") return "penetration";
  return "interlude";
}

/** Coup après lequel tombe le silence au bord : vers 60 % de la phase, jamais sur un glissé, une tenue ou une vague d'aura. */
function bordAt(def: RhythmSectionDef) {
  let at = Math.floor(def.strokes * 0.6);
  if (def.aura && at >= def.aura.at - 1 && at < def.aura.at + def.aura.strokes + 1) at = Math.min(def.strokes - 3, def.aura.at + def.aura.strokes + 1);
  if (def.motif) while (at > 0 && def.motif[at % def.motif.length].kind === "slide") at--;
  while (def.holds.includes(at) || def.holds.includes(at + 1)) at--;
  return Math.max(1, at);
}

/** Temps de lecture d'une phrase (secondes), comme l'affichage du jeu. */
export function rhythmReadSeconds(line: DialogueLine, maxMs: number) {
  const words = line.text.split(/\s+/).filter(Boolean).length;
  return Math.max(3200, Math.min(maxMs, words * 260)) / 1000;
}

export type RhythmSectionTextKit = RhythmSectionText & { tierLines: DialogueLine[][]; gel: boolean; chapter: number; relay?: DialogueLine[] };
export type RhythmKit = {
  character: string;
  anchor: RhythmAnchor;
  profile: RhythmProfile;
  bubbles: RhythmCharacterBubbles;
  sections: RhythmSectionDef[];
  scene: RhythmSceneText & { sections: RhythmSectionTextKit[] };
  /** Première séquence jouée, séquence du sommet, et séquence où le texte reprend. */
  start: number;
  end: number;
  returnChapter: number;
};

const BUBBLES: Record<string, RhythmCharacterBubbles> = { bellirith: BELLIRITH_RHYTHM_BUBBLES, allenna: ALLENNA_RHYTHM_BUBBLES, lineva: LINEVA_RHYTHM_BUBBLES, "allenna-lineva": ALLENNA_LINEVA_RHYTHM_BUBBLES, remerii: REMERII_RHYTHM_BUBBLES };
const speakerName = (character: string) => character.charAt(0).toUpperCase() + character.slice(1);

/**
 * Construit le jeu d'une scène à partir de son ancrage et de ses séquences telles que le joueur les lit
 * (mode, corps et historique déjà appliqués). Renvoie undefined si la scène ne correspond pas à l'ancrage.
 */
export function buildRhythmKit(anchor: RhythmAnchor, chapters: DialogueLine[][], sceneTitle: string, mode: string): RhythmKit | undefined {
  const profile = RHYTHM_PROFILES[anchor.character];
  const bubbles = BUBBLES[anchor.character];
  if (!profile || !bubbles || (mode !== "explicite" && mode !== "suggestif")) return undefined;
  // Version Suggestif écrite à part : ses propres séquences et son propre point de reprise.
  if (mode === "suggestif" && anchor.suggestif) anchor = { ...anchor, phases: anchor.suggestif.phases, returnChapter: anchor.suggestif.returnChapter };
  if (anchor.phases.some((phase) => !chapters[phase.chapter]?.length) || anchor.returnChapter > chapters.length) return undefined;
  const pen = anchor.phases.filter((phase) => gestureOf(phase.code) === "penetration");
  const penTempos = (n: number): number[] => {
    const [lente, moyenne, vive] = profile.bpm.penetration;
    if (n <= 1) return [vive];
    if (n === 2) return [moyenne, profile.bpm.ramp[0]];
    if (n === 3) return [lente, vive, profile.bpm.ramp[0]];
    return Array.from({ length: n }, (_, i) => (i === n - 1 ? profile.bpm.ramp[0] : [lente, moyenne, vive][Math.min(2, Math.floor(i * 3 / (n - 1)))]));
  };
  const tempos = penTempos(pen.length);
  let penIndex = 0;
  let slide: "left" | "right" = "left";
  let appelUsed = false;
  const last = anchor.phases.length - 1;
  const sections: RhythmSectionDef[] = [];
  const texts: RhythmSectionTextKit[] = [];
  anchor.phases.forEach((phase, index) => {
    const lines = chapters[phase.chapter];
    const gesture = gestureOf(phase.code);
    const final = index === last;
    const read = lines.reduce((sum, line) => sum + rhythmReadSeconds(line, profile.captionMaxMs), 0);
    const id = `s${phase.chapter}-${phase.code}`;
    const axis: RhythmShakeAxis = phase.code === "pp" ? "profondeur" : "vertical";
    const mood = profile.moods[gesture === "interlude" ? "interlude" : gesture];
    // Scènes à plusieurs : la voix (et les bulles) de la personne qui reçoit le geste.
    const voiceIndex = profile.voices ? Math.max(0, profile.voices.findIndex((entry) => entry.key === phase.voice)) : -1;
    const voiceEntry = voiceIndex >= 0 ? profile.voices![voiceIndex] : undefined;
    const own = (list: DialogueLine[] | undefined) => {
      if (!list || !voiceEntry) return list;
      const mine = list.filter((line) => line.speaker === speakerName(voiceEntry.character));
      return mine.length ? mine : list;
    };
    const text: RhythmSectionTextKit = {
      label: phase.code === "M" ? RHYTHM_PHASE_LABELS.mainJoueur : gesture === "interlude" ? RHYTHM_PHASE_LABELS.interlude : gesture === "penetration" ? (axis === "vertical" ? RHYTHM_PHASE_LABELS.penetrationVertical : RHYTHM_PHASE_LABELS.penetrationProfondeur) : RHYTHM_PHASE_LABELS[gesture],
      cadence: "",
      intimateMood: mood,
      intro: lines[0],
      tiers: [lines[0], lines[0], lines[0]],
      strokes: [],
      voice: gesture === "interlude" ? [] : own(bubbles.voice[gesture])!,
      tierLines: [],
      gel: gesture === "interlude",
      chapter: phase.chapter,
    };
    if (gesture === "interlude") {
      // Rupture écrite : la piste se fige le temps de lire la séquence ; il ne faut rien toucher.
      const bpm = sections.at(-1)?.bpm || profile.bpm.main;
      const beats = Math.max(6, Math.ceil(read * 1.1 / (60 / bpm)));
      sections.push({ id, bpm, strokes: 0, holds: [], holdBeats: 2, shake: axis, gesture: (sections.at(-1)?.gesture || "main"), rest: { beats } });
      text.cadence = RHYTHM_CADENCE_LABELS.gel;
      text.tierLines = [lines.slice(1), [], []];
      texts.push(text);
      return;
    }
    const rest = lines.slice(1);
    const size = Math.ceil(rest.length / 3);
    text.tierLines = [rest.slice(0, size), rest.slice(size, size * 2), rest.slice(size * 2)];
    const tierFirst = text.tierLines.map((group) => group[0] || lines[0]) as [DialogueLine, DialogueLine, DialogueLine];
    text.tiers = tierFirst;
    let bpm = gesture === "penetration" ? tempos[penIndex++] : profile.bpm[gesture];
    if (final && gesture !== "penetration") bpm = Math.round(bpm * 1.2);
    const beat = 60 / bpm;
    const beatsNeeded = Math.max(14, Math.ceil(read * 1.25 / beat));
    const def: RhythmSectionDef = { id, bpm, strokes: 0, holds: [], holdBeats: 2, shake: axis, gesture, ...(sections.length ? { slide } : {}), ...(voiceIndex >= 0 ? { voice: voiceIndex } : {}) };
    const auraHere = Boolean(profile.behaviours.aura && !final && (!voiceEntry || voiceEntry.aura));
    if (def.slide) slide = slide === "left" ? "right" : "left";
    const useAppel = Boolean(anchor.appel && profile.behaviours.appel && !appelUsed && (gesture === "penetration" || gesture === "frottement") && !final);
    if (useAppel) {
      appelUsed = true;
      const cycleBeats = (m: number[]) => m.reduce((a, b) => a + b, 0) * 2 + 2;
      const motifs: number[][] = [];
      let beats = 0;
      for (let i = 0; beats < beatsNeeded; i++) { const m = APPELS[i % APPELS.length]; motifs.push(m); beats += cycleBeats(m); }
      def.appel = motifs;
      def.strokes = motifs.length * 4;
      text.cadence = RHYTHM_CADENCE_LABELS.appel;
    } else if (gesture === "penetration") {
      const strokes = Math.min(72, Math.max(14, beatsNeeded));
      def.strokes = strokes;
      def.holds = final ? [Math.floor(strokes * 0.5)] : [Math.floor(strokes * 0.4), Math.floor(strokes * 0.8)];
      text.cadence = final ? RHYTHM_CADENCE_LABELS.montee : bpm >= profile.bpm.penetration[2] ? RHYTHM_CADENCE_LABELS.vif : bpm >= profile.bpm.penetration[1] ? RHYTHM_CADENCE_LABELS.moyen : RHYTHM_CADENCE_LABELS.lent;
      if (auraHere && strokes >= 20) {
        const at = Math.floor(strokes * 0.5) + 1;
        def.aura = { at, strokes: profile.behaviours.aura.strokes, factor: profile.behaviours.aura.factor };
        def.holds = def.holds.filter((h) => h < at || h >= at + profile.behaviours.aura!.strokes);
      }
    } else {
      const motif = MOTIFS[gesture];
      const perStep = motif.reduce((sum, step) => sum + step.beats, 0) / motif.length;
      def.motif = motif;
      def.strokes = Math.min(64, Math.max(motif.length * 2, Math.round(beatsNeeded / perStep)));
      text.cadence = final ? RHYTHM_CADENCE_LABELS.montee : bpm >= profile.bpm.langue ? RHYTHM_CADENCE_LABELS.vif : bpm >= profile.bpm.bouche ? RHYTHM_CADENCE_LABELS.moyen : RHYTHM_CADENCE_LABELS.lent;
      // Ordres de Lineva : la vague d'aura touche aussi les motifs, au début d'un tour de motif, vers le milieu de la phase.
      if (auraHere && profile.behaviours.auraMotifs && def.strokes >= 12) {
        const at = Math.max(motif.length, Math.round(def.strokes * 0.45 / motif.length) * motif.length);
        if (at + profile.behaviours.aura!.strokes < def.strokes - 1) def.aura = { at, strokes: profile.behaviours.aura!.strokes, factor: profile.behaviours.aura!.factor };
      }
    }
    // Relais de sommets : petite montée puis tenue du sommet, la phase suivante reprend aussitôt.
    if (phase.relay && !final) {
      def.ramp = { strokes: 6, toBpm: Math.round(bpm * 1.25), final: 2.4, relay: true };
      text.cadence = RHYTHM_CADENCE_LABELS.montee;
      text.relay = own(bubbles.relay);
    }
    if (profile.behaviours.baits && !final && !useAppel) def.baits = profile.behaviours.baits;
    if (phase.bord && profile.behaviours.bord && !useAppel) def.bord = { at: bordAt(def), beats: profile.behaviours.bord.beats };
    // Montée finale : jusqu'au tempo d'apogée du personnage (un peu moins haut quand le sommet n'est pas une pénétration).
    if (final) def.ramp = { strokes: 12, toBpm: gesture === "penetration" ? profile.bpm.ramp[1] : Math.round(profile.bpm.ramp[1] * 0.8), final: profile.behaviours.deepHold ?? 3.2 };
    sections.push(def);
    texts.push(text);
  });
  // Silence au bord quand le texte n'en écrit aucun : avant-dernière phase jouée (la jauge approche du haut).
  if (profile.behaviours.bord && !sections.some((def) => def.bord)) {
    for (let i = sections.length - 2; i >= 0; i--) {
      const def = sections[i];
      if (def.rest || def.appel || def.ramp) continue;
      if (profile.voices && !profile.voices[def.voice ?? 0]?.bord) continue;
      def.bord = { at: bordAt(def), beats: profile.behaviours.bord.beats };
      break;
    }
  }
  const scene: RhythmKit["scene"] = {
    id: `rythme-${anchor.character}-${anchor.routeId}-${anchor.sex}${mode === "suggestif" ? "-suggestif" : ""}`,
    routeId: anchor.routeId,
    title: `${bubbles.title} · ${sceneTitle}`,
    instruction: bubbles.instruction,
    controls: HYLEE_HOME_RHYTHM.controls,
    sections: texts,
    teases: bubbles.teases,
    conclusions: bubbles.endings,
    ...(mode === "suggestif" ? { suggestive: true } : {}),
  };
  const end = anchor.phases[last].chapter;
  return { character: anchor.character, anchor, profile, bubbles, sections, scene, start: anchor.phases[0].chapter, end, returnChapter: anchor.returnChapter };
}

/** Difficulté recommandée d'un personnage (préselectionnée tant que le joueur n'en a pas choisi une autre). */
export function rhythmRecommendedDifficulty(character: string): RhythmDifficulty { return RHYTHM_PROFILES[character]?.difficulty || "normal"; }
