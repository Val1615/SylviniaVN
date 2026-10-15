/**
 * Vie quotidienne · humeurs du jour (PROPOSITION_VIE_V1 §1).
 * Pur et déterministe : (personnage, jour, lieu, météo, souvenirs récents) donne toujours la même humeur.
 * Les humeurs modulent seulement l’affection et la confiance ; jamais le Désir, jamais une étape.
 * Sources des tempéraments : voir consignes/vie/LORE_CHECK.md.
 */
import { imperialDate, type SeasonId } from "./calendar";
import { weatherAt, type WeatherId } from "./weather";

export type MoodId = "radieuse" | "sereine" | "nostalgique" | "maussade" | "fatiguee" | "irritable";
export const MOOD_ORDER: MoodId[] = ["radieuse", "sereine", "nostalgique", "maussade", "fatiguee", "irritable"];

export type MoodInfo = { id: MoodId; label: string; icon: string; color: string; gain: number; invite: number; hint: string };
export const MOODS: Record<MoodId, MoodInfo> = {
  radieuse: { id: "radieuse", label: "radieuse", icon: "☀", color: "#f3c86b", gain: 1.25, invite: 15, hint: "Les gestes d’attention comptent davantage aujourd’hui." },
  sereine: { id: "sereine", label: "sereine", icon: "◡", color: "#8fd0b5", gain: 1.1, invite: 5, hint: "Une journée propice aux échanges." },
  nostalgique: { id: "nostalgique", label: "nostalgique", icon: "☾", color: "#a9a2e6", gain: 1, invite: 0, hint: "Les mots se font plus personnels." },
  maussade: { id: "maussade", label: "maussade", icon: "☁", color: "#8da2b8", gain: 0.9, invite: -5, hint: "Les attentions portent un peu moins aujourd’hui." },
  fatiguee: { id: "fatiguee", label: "fatiguée", icon: "◌", color: "#c0a98c", gain: 0.9, invite: -10, hint: "Une seule activité partagée aujourd’hui." },
  irritable: { id: "irritable", label: "irritable", icon: "ϟ", color: "#e0806b", gain: 0.75, invite: -15, hint: "Un présent mal choisi coûtera davantage." },
};

/** Valurn, Saidin et Draven sont des hommes (bible §30-41) : l’adjectif s’accorde. */
export const MASCULINE_CHARACTERS = ["valurn", "saidin", "draven"];
const MASCULINE_LABELS: Record<MoodId, string> = { radieuse: "radieux", sereine: "serein", nostalgique: "nostalgique", maussade: "maussade", fatiguee: "fatigué", irritable: "irritable" };
export function moodLabel(mood: MoodId, characterId?: string) { return characterId && MASCULINE_CHARACTERS.includes(characterId) ? MASCULINE_LABELS[mood] : MOODS[mood].label; }
/** « d’humeur radieuse », accordé au personnage. */
export function moodPhrase(mood: MoodId, characterId?: string) { return `d’humeur ${moodLabel(mood, characterId)}`; }

/** Tempérament de base (poids relatifs). Chaque ligne cite sa source dans LORE_CHECK.md. */
export const MOOD_TEMPERAMENTS: Record<string, Record<MoodId, number>> = {
  hylee: { radieuse: 3, sereine: 2, nostalgique: 1, maussade: 1, fatiguee: 1, irritable: 0.5 },
  remerii: { radieuse: 1, sereine: 2, nostalgique: 1, maussade: 1, fatiguee: 1, irritable: 2 },
  iriana: { radieuse: 0.5, sereine: 2, nostalgique: 1, maussade: 1, fatiguee: 1.5, irritable: 1.5 },
  tia: { radieuse: 0.5, sereine: 2.5, nostalgique: 0.5, maussade: 0.5, fatiguee: 1.5, irritable: 1.5 },
  valurn: { radieuse: 2, sereine: 1.5, nostalgique: 1, maussade: 1, fatiguee: 0.5, irritable: 1 },
  naiah: { radieuse: 2.5, sereine: 0.5, nostalgique: 1, maussade: 1, fatiguee: 0.5, irritable: 2 },
  lineva: { radieuse: 1, sereine: 1.5, nostalgique: 0.5, maussade: 1, fatiguee: 2, irritable: 1.5 },
  saidin: { radieuse: 0.5, sereine: 3, nostalgique: 2, maussade: 0.5, fatiguee: 0.5, irritable: 0.3 },
  bellirith: { radieuse: 2, sereine: 0.7, nostalgique: 0.8, maussade: 1, fatiguee: 0.3, irritable: 2 },
  amanea: { radieuse: 0.3, sereine: 2, nostalgique: 1, maussade: 1, fatiguee: 1, irritable: 2 },
  allenna: { radieuse: 1, sereine: 2.5, nostalgique: 0.3, maussade: 0.5, fatiguee: 1.5, irritable: 1 },
  draven: { radieuse: 1.5, sereine: 1, nostalgique: 0.5, maussade: 1, fatiguee: 1.5, irritable: 1.5 },
};
const NEUTRAL_TEMPERAMENT: Record<MoodId, number> = { radieuse: 1, sereine: 1.5, nostalgique: 1, maussade: 1, fatiguee: 1, irritable: 1 };

/** Souvenirs courts des actions du joueur (élagués après 7 jours). */
export type MoodEventKind = "cadeau-aime" | "cadeau-neutre" | "cadeau-deteste" | "rdv-honore" | "rdv-manque" | "activite" | "lettre" | "excuse";
export type MoodEvent = { character: string; kind: MoodEventKind; day: number };
export const MOOD_MEMORY_DAYS = 7;
const EVENT_WEIGHT: Record<MoodEventKind, number> = { "cadeau-aime": 1, "cadeau-neutre": 0.3, "cadeau-deteste": -1, "rdv-honore": 1.2, "rdv-manque": -1.5, activite: 0.6, lettre: 0.4, excuse: 0 };

function hash(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0) / 4294967296;
}

/** Une excuse efface les souvenirs négatifs plus anciens qu’elle pour ce personnage. */
export function effectiveMoodEvents(events: readonly MoodEvent[], characterId: string, day: number) {
  const own = events.filter((event) => event.character === characterId && event.day <= day && day - event.day <= MOOD_MEMORY_DAYS);
  const lastExcuse = own.filter((event) => event.kind === "excuse").reduce((max, event) => Math.max(max, event.day), -Infinity);
  return own.filter((event) => !(EVENT_WEIGHT[event.kind] < 0 && event.day <= lastExcuse));
}

/** Score récent sur 3 jours (veille et avant-veille comprises, jour même exclu pour rester stable dans la journée). */
export function recentMoodScore(events: readonly MoodEvent[], characterId: string, day: number) {
  return effectiveMoodEvents(events, characterId, day)
    .filter((event) => event.day < day && day - event.day <= 3)
    .reduce((sum, event) => sum + EVENT_WEIGHT[event.kind] * (event.day === day - 1 ? 1 : 0.6), 0);
}

const BAD_SKY: WeatherId[] = ["pluie", "orage", "tempete", "brume-dense"];
const SEASON_BONUS: Record<SeasonId, Partial<Record<MoodId, number>>> = { printemps: { radieuse: 0.5 }, ete: { fatiguee: 0.3 }, automne: { nostalgique: 0.4 }, hiver: { nostalgique: 0.7 } };

export type MoodContext = { locationId: string; events?: readonly MoodEvent[]; forced?: MoodId };

export function moodWeights(characterId: string, day: number, context: MoodContext): Record<MoodId, number> {
  const weights = { ...(MOOD_TEMPERAMENTS[characterId] || NEUTRAL_TEMPERAMENT) };
  const sky = weatherAt(day, context.locationId).id;
  const yesterday = weatherAt(Math.max(1, day - 1), context.locationId).id;
  if (BAD_SKY.includes(sky)) { weights.maussade += 1.5; weights.radieuse *= 0.6; }
  if (sky === "chaleur") weights.fatiguee += 0.8;
  if (sky === "canicule") weights.fatiguee += 1.5;
  if (sky === "neige") { weights.nostalgique += 1; weights.sereine += 0.5; }
  if (sky === "blizzard" || sky === "sable") { weights.irritable += 1; weights.fatiguee += 1; }
  if (sky === "clair") weights.radieuse += 1;
  if (sky === "clair" && day > 1 && BAD_SKY.includes(yesterday)) weights.radieuse += 1.5;
  for (const [mood, bonus] of Object.entries(SEASON_BONUS[imperialDate(day).season])) weights[mood as MoodId] += bonus || 0;
  const score = recentMoodScore(context.events || [], characterId, day);
  if (score > 0) { weights.radieuse += 2 * score; weights.sereine += score; weights.maussade /= 1 + score; weights.irritable /= 1 + score; }
  if (score < 0) { weights.irritable += 2 * -score; weights.maussade += -score; weights.radieuse /= 1 - score; }
  return weights;
}

export function moodOf(characterId: string, day: number, context: MoodContext): MoodId {
  if (context.forced) return context.forced;
  const weights = moodWeights(characterId, day, context);
  const total = MOOD_ORDER.reduce((sum, mood) => sum + Math.max(0, weights[mood]), 0);
  let roll = hash(`humeur:${characterId}:${day}`) * total;
  let mood: MoodId = "sereine";
  for (const id of MOOD_ORDER) { roll -= Math.max(0, weights[id]); if (roll <= 0) { mood = id; break; } }
  // Une activité partagée le jour même apaise une humeur maussade (proposition §5).
  if (mood === "maussade" && (context.events || []).some((event) => event.character === characterId && event.day === day && event.kind === "activite")) mood = "sereine";
  return mood;
}

/** Gains positifs d’affection ou de confiance modulés par l’humeur ; jamais négatifs par l’humeur seule. */
export function scaleGain(value: number, mood: MoodId) {
  if (value <= 0) return value;
  return Math.max(1, Math.round(value * MOODS[mood].gain));
}

/** Accroches de rencontre : une par personnage et par humeur (72 phrases uniques). */
export const MOOD_LINES: Record<string, Record<MoodId, string>> = {
  hylee: {
    radieuse: "Hylee vous fait signe de loin, les deux bras levés, comme si vous reveniez d’un long voyage.",
    sereine: "Hylee fredonne sans s’en rendre compte et vous laisse une place à côté d’elle avant même que vous la demandiez.",
    nostalgique: "Hylee fait tourner son pendentif entre ses doigts. « Tu crois qu’on peut avoir le mal du pays pour un endroit dont on ne se souvient pas ? »",
    maussade: "Hylee a les joues gonflées d’une contrariété qu’elle n’arrive pas à garder sérieuse plus de trois secondes.",
    fatiguee: "Hylee étouffe un bâillement derrière sa manche et vous adresse un sourire un peu flou.",
    irritable: "« Ne me demande pas si ça va, d’accord ? » Hylee croise les bras, puis les décroise aussitôt, gênée de son propre ton.",
  },
  remerii: {
    radieuse: "Remerii vous accueille d’un sourire qu’elle ne prend pas la peine de corriger. Signe rare, et elle le sait.",
    sereine: "Remerii referme son livre sur un doigt pour garder la page. « Vous tombez bien. Ou presque bien. »",
    nostalgique: "Remerii regarde un point au loin, plus loin que la pièce. Elle met un instant à revenir vers vous.",
    maussade: "« Si vous apportez une bonne nouvelle, abrégez. Si elle est mauvaise, abrégez davantage. »",
    fatiguee: "Remerii masse sa tempe du bout de deux doigts. Même sa politesse semble avoir besoin d’une sieste.",
    irritable: "Remerii vous dévisage comme une erreur dans une équation qu’elle avait pourtant vérifiée deux fois.",
  },
  iriana: {
    radieuse: "Iriana lève les yeux de ses dépêches et, chose inhabituelle, les repose tout de suite pour vous.",
    sereine: "Iriana vous salue d’un signe de tête précis. « Vous avez quelques minutes ? Moi aussi, pour une fois. »",
    nostalgique: "Iriana relit la même ligne d’une lettre ancienne. Elle la plie avant que vous puissiez voir de qui elle vient.",
    maussade: "« La cour a décidé d’être stupide aujourd’hui. Ne la rejoignez pas, je vous prie. »",
    fatiguee: "Iriana garde la nuque droite par discipline. Ses yeux, eux, ont renoncé depuis le milieu de la matinée.",
    irritable: "Iriana pose sa plume avec une douceur qui ressemble beaucoup à une menace.",
  },
  tia: {
    radieuse: "L’Impératrice vous accorde une audience brève et, contre toute attente, presque chaleureuse.",
    sereine: "Tia vous reçoit avec le calme de quelqu’un qui a déjà prié ce matin et n’attend rien de plus du jour.",
    nostalgique: "Tia contemple la lumière sur les vitraux plus longtemps que le protocole ne le justifie.",
    maussade: "« Soyez bref. La journée a déjà épuisé ma patience pour les formules. »",
    fatiguee: "Tia reste droite, impeccable. Seule une seconde de silence en trop entre deux phrases trahit la fatigue.",
    irritable: "Tia vous regarde arriver comme on regarde une requête déposée sans le bon sceau.",
  },
  valurn: {
    radieuse: "Valurn écarte les bras. « Vous voilà. Je savais que ma journée manquait d’un spectateur à ma hauteur. »",
    sereine: "Valurn joue avec une pièce entre ses doigts et vous propose la moitié de son banc d’un geste paresseux.",
    nostalgique: "Pour une fois, Valurn ne dit rien de drôle. Il regarde la pièce dans sa main sans la lancer.",
    maussade: "« Les affaires vont mal, le vin aussi. Heureusement, vous ne coûtez rien. Pour l’instant. »",
    fatiguee: "Valurn étouffe un bâillement avec une élégance théâtrale, comme si la fatigue elle-même faisait partie du spectacle.",
    irritable: "Valurn sourit. Le sourire s’arrête au coin des lèvres et ne monte pas plus haut.",
  },
  naiah: {
    radieuse: "Naïah surgit d’entre deux arbres, ravie de vous avoir fait sursauter. « Un point pour moi. Tu comptes ? »",
    sereine: "Naïah est assise sur une racine, les jambes qui battent l’air, et vous accueille d’un « Te voilà enfin » sans reproche.",
    nostalgique: "Naïah dessine des cercles dans la brume du bout du doigt. Elle efface chacun avant de le finir.",
    maussade: "« Ne me fais pas rire aujourd’hui. J’ai décidé d’être de mauvaise humeur et je compte m’y tenir. »",
    fatiguee: "Naïah bâille si fort qu’un oiseau s’envole. Elle prétend que c’était fait exprès.",
    irritable: "Naïah ne vous regarde pas tout de suite. Elle parle d’abord au silence, d’une voix un peu trop calme.",
  },
  lineva: {
    radieuse: "Lineva vous lance un salut de la main de loin, avec un sourire franc qui la rajeunit.",
    sereine: "Lineva s’appuie au mur le plus proche. « Vous avez du temps ? Bien. J’en ai trouvé un peu, moi aussi. »",
    nostalgique: "Lineva regarde au loin sans rien y chercher. Elle met un moment à remarquer votre présence.",
    maussade: "« Le temps est pourri, les rapports aussi. Je vous écoute, mais allez droit au but. »",
    fatiguee: "Lineva se redresse en vous voyant, mais ses épaules gardent le poids d’une nuit blanche.",
    irritable: "Lineva serre les mâchoires. « Si c’est pour me dire de me reposer, demi-tour. »",
  },
  saidin: {
    radieuse: "Saidin vous salue avant que vous ayez tourné l’angle, avec l’air amusé d’un homme qui avait parié sur votre venue.",
    sereine: "Saidin vous désigne un siège. « Asseyez-vous. Les bonnes questions viennent mieux aux gens assis. »",
    nostalgique: "Saidin regarde ses mains comme si elles avaient appartenu à quelqu’un d’autre, autrefois.",
    maussade: "Saidin soupire. « Certains jours, voir loin revient surtout à voir longtemps. »",
    fatiguee: "Saidin ferme les yeux une seconde de trop. Quand il les rouvre, il sourit comme pour s’en excuser.",
    irritable: "« Vous allez me poser la question que je préfère ne pas entendre. Alors posez-la vite. »",
  },
  bellirith: {
    radieuse: "Bellirith s’étire comme un chat au soleil et vous accueille d’un « Enfin quelqu’un d’amusant » qui sonne presque sincère.",
    sereine: "Bellirith vous observe par-dessus son verre, paupières mi-closes, d’humeur à jouer plutôt qu’à mordre.",
    nostalgique: "Bellirith fait tourner une bague à son doigt. Quand elle vous remarque, son sourire revient une demi-seconde trop tard.",
    maussade: "« Ne me regarde pas comme ça. Aujourd’hui, même la flatterie m’ennuie. »",
    fatiguee: "Bellirith laisse sa tête reposer contre sa main. « Distrais-moi. Doucement. »",
    irritable: "Bellirith vous accorde un regard bref. Vous avez l’impression d’arriver en retard à une audience que personne ne vous a annoncée.",
  },
  amanea: {
    radieuse: "Amanea incline la tête à votre arrivée. Chez elle, ce geste minuscule vaut un salut appuyé.",
    sereine: "Amanea vous laisse approcher sans rien dire, ce qui, venant d’elle, ressemble à une invitation.",
    nostalgique: "Amanea contemple un point invisible, comme on relit une page qu’on connaît par cœur.",
    maussade: "« Parle si tu as quelque chose d’utile à dire. Sinon, le silence me convient très bien. »",
    fatiguee: "Amanea garde la tête haute. Seules ses mains, posées à plat, trahissent le poids de la journée.",
    irritable: "Amanea vous fixe sans ciller. L’air autour d’elle semble avoir baissé de deux degrés.",
  },
  allenna: {
    radieuse: "Allenna vous accueille d’un hochement de tête, puis d’un sourire bref qu’elle n’a manifestement pas prévu.",
    sereine: "Allenna termine de resserrer une sangle avant de lever les yeux. « Je vous écoute. »",
    nostalgique: "Allenna a le visage grave de quelqu’un qui fait le compte de ce qu’elle doit protéger.",
    maussade: "« Journée longue. Si vous venez avec un problème, venez aussi avec une solution. »",
    fatiguee: "Allenna se tient droite, mais elle s’appuie discrètement contre le mur quand elle croit que vous ne regardez pas.",
    irritable: "Allenna range ses lames d’un geste sec. Chaque cliquetis ressemble à un avertissement.",
  },
  draven: {
    radieuse: "Draven vous tape sur l’épaule assez fort pour vous déplacer d’un pas. « Vous tombez à pic ! »",
    sereine: "Draven s’adosse au mur, les bras croisés, sans se presser. « Asseyez-vous. Pour une fois, rien ne brûle. »",
    nostalgique: "Draven reste un moment silencieux, le regard tourné vers l’horizon. Il se racle la gorge en vous voyant.",
    maussade: "« Mauvaise journée. Ne me demandez pas pourquoi, la liste est trop longue. »",
    fatiguee: "Draven se frotte le visage à deux mains. « Parlez. Si je ronfle, secouez-moi. »",
    irritable: "Draven grogne un salut qui ressemble davantage à une sommation.",
  },
};

export function moodLine(characterId: string, mood: MoodId) { return MOOD_LINES[characterId]?.[mood]; }
