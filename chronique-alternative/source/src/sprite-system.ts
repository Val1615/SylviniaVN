/**
 * Référentiel unique des sprites réellement présents dans le jeu.
 *
 * Les scènes utilisent parfois un vocabulaire narratif commun (soft, playful,
 * strategic…) qui ne correspond pas toujours au nom de fichier propre à un
 * personnage. Toute résolution doit donc passer par ce module avant de former
 * une URL : une expression absente ne peut ainsi plus faire disparaître le
 * personnage.
 */
export const SPRITE_MOODS: Record<string, readonly string[]> = {
  hylee: ["angry", "determined", "sad", "soft", "surprised", "teasing"],
  remerii: ["calm", "neutral", "profile", "sad", "smirk", "strict"],
  iriana: ["calm", "neutral", "sad", "smirk", "stern", "troubled"],
  tia: ["angry", "neutral", "sad", "shy", "smile", "smirk", "stern", "thinking", "threatening", "troubled"],
  valurn: ["amused", "annoyed", "away", "charming", "neutral", "surprised"],
  naiah: ["angry", "laugh", "neutral", "sad", "smirk", "thinking"],
  lineva: ["determined", "sad", "smirk", "stern", "teary", "thoughtful"],
  saidin: ["mysterious", "neutral", "sad", "stern", "surprised", "thinking"],
  bellirith: ["angry", "cold", "seductive", "smirk", "teasing", "thoughtful"],
  amanea: ["angry", "away", "menacing", "neutral", "rictus", "sad", "smile", "terrifying", "thinking"],
  allenna: ["angry", "neutral", "sad", "shy", "smile", "smirk", "stern", "thinking", "threatening", "troubled"],
  draven: ["angry", "approving", "gruff", "neutral", "stern", "surprised"],
};

type MoodFamily =
  | "neutral"
  | "calm"
  | "positive"
  | "playful"
  | "soft"
  | "thoughtful"
  | "sad"
  | "troubled"
  | "stern"
  | "angry"
  | "menacing"
  | "surprised"
  | "shy"
  | "away"
  | "seductive"
  | "battle";

const MOOD_FAMILY: Record<string, MoodFamily> = {
  neutral: "neutral",
  calm: "calm",
  smile: "positive",
  happy: "positive",
  joyful: "positive",
  warm: "positive",
  warmth: "positive",
  approving: "positive",
  amused: "playful",
  charming: "playful",
  laugh: "playful",
  playful: "playful",
  smirk: "playful",
  teasing: "playful",
  soft: "soft",
  tender: "soft",
  thinking: "thoughtful",
  thoughtful: "thoughtful",
  curious: "thoughtful",
  investigating: "thoughtful",
  strategic: "thoughtful",
  mysterious: "thoughtful",
  profile: "thoughtful",
  sad: "sad",
  teary: "sad",
  troubled: "troubled",
  tense: "troubled",
  catastrophic: "troubled",
  stern: "stern",
  strict: "stern",
  imperial: "stern",
  imperious: "stern",
  gruff: "stern",
  cold: "stern",
  annoyed: "stern",
  angry: "angry",
  confrontational: "angry",
  menacing: "menacing",
  threatening: "menacing",
  terrifying: "menacing",
  rictus: "menacing",
  surprised: "surprised",
  shy: "shy",
  away: "away",
  seductive: "seductive",
  battle: "battle",
  determined: "battle",
};

const FAMILY_CANDIDATES: Record<MoodFamily, readonly string[]> = {
  neutral: ["neutral", "calm", "soft", "thoughtful", "mysterious", "stern"],
  calm: ["calm", "neutral", "soft", "thoughtful", "mysterious"],
  positive: ["smile", "amused", "laugh", "smirk", "approving", "soft", "charming", "neutral"],
  playful: ["teasing", "amused", "smirk", "laugh", "charming", "seductive", "rictus", "smile", "approving", "neutral"],
  soft: ["soft", "calm", "shy", "thoughtful", "smile", "approving", "charming", "neutral"],
  thoughtful: ["thinking", "thoughtful", "away", "calm", "neutral", "profile"],
  sad: ["sad", "teary", "troubled", "away", "cold", "gruff", "neutral"],
  troubled: ["troubled", "teary", "sad", "away", "gruff", "thinking", "thoughtful", "neutral"],
  stern: ["stern", "strict", "cold", "annoyed", "determined", "gruff", "neutral"],
  angry: ["angry", "annoyed", "stern", "strict", "menacing", "threatening", "determined", "cold"],
  menacing: ["terrifying", "threatening", "menacing", "angry", "stern", "cold", "rictus"],
  surprised: ["surprised", "troubled", "shy", "laugh", "neutral"],
  shy: ["shy", "troubled", "soft", "away", "thoughtful", "neutral"],
  away: ["away", "thinking", "thoughtful", "cold", "neutral"],
  seductive: ["seductive", "teasing", "smirk", "charming", "soft", "smile", "neutral"],
  battle: ["determined", "stern", "angry", "threatening", "menacing", "strict", "cold", "gruff", "neutral"],
};

/**
 * Choix spécifiques lorsque la traduction générique serait visuellement
 * trompeuse. Lineva et Allenna sont notamment écrites avec « soft » et
 * « teasing » dans leurs rendez-vous alors que ces fichiers n’existent pas.
 */
const CHARACTER_FAMILY_PREFERENCE: Record<string, Partial<Record<MoodFamily, string>>> = {
  lineva: {
    neutral: "thoughtful",
    calm: "thoughtful",
    positive: "smirk",
    playful: "smirk",
    soft: "thoughtful",
    thoughtful: "thoughtful",
    troubled: "teary",
    stern: "stern",
    angry: "stern",
    menacing: "stern",
    shy: "thoughtful",
    away: "thoughtful",
    seductive: "smirk",
    battle: "determined",
  },
  allenna: {
    neutral: "neutral",
    calm: "neutral",
    positive: "smile",
    playful: "smirk",
    soft: "shy",
    thoughtful: "thinking",
    troubled: "troubled",
    stern: "stern",
    angry: "angry",
    menacing: "threatening",
    surprised: "troubled",
    shy: "shy",
    away: "thinking",
    seductive: "smirk",
    battle: "stern",
  },
  valurn: { soft: "charming", seductive: "charming" },
  amanea: { playful: "smile", soft: "smile" },
};

const SAFE_DEFAULT: Record<string, string> = {
  hylee: "soft",
  remerii: "calm",
  iriana: "calm",
  tia: "neutral",
  valurn: "neutral",
  naiah: "neutral",
  lineva: "thoughtful",
  saidin: "neutral",
  bellirith: "thoughtful",
  amanea: "neutral",
  allenna: "neutral",
  draven: "neutral",
};

function normalizeMood(mood?: string) {
  return mood?.trim().toLocaleLowerCase("fr-FR") || "";
}

function firstAvailable(available: readonly string[], candidates: readonly (string | undefined)[]) {
  return candidates.find((candidate): candidate is string => Boolean(candidate && available.includes(candidate)));
}

function equivalentMood(characterId: string, mood: string, available: readonly string[]) {
  const family = MOOD_FAMILY[mood];
  if (!family) return undefined;
  return firstAvailable(available, [
    CHARACTER_FAMILY_PREFERENCE[characterId]?.[family],
    ...FAMILY_CANDIDATES[family],
  ]);
}

export const KNOWN_MOOD_LABELS = Object.freeze(Object.keys(MOOD_FAMILY));

export function spriteMoodExists(characterId: string, mood: string) {
  return Boolean(SPRITE_MOODS[characterId]?.includes(normalizeMood(mood)));
}

/** Résout toujours vers un fichier existant pour les personnages référencés. */
export function resolveSpriteMood(characterId: string, requestedMood?: string, fallbackMood?: string) {
  const available = SPRITE_MOODS[characterId];
  const requested = normalizeMood(requestedMood);
  const fallback = normalizeMood(fallbackMood);

  if (!available?.length) return requested || fallback || "neutral";
  if (requested && available.includes(requested)) return requested;

  const requestedEquivalent = equivalentMood(characterId, requested, available);
  if (requestedEquivalent) return requestedEquivalent;

  if (fallback && available.includes(fallback)) return fallback;
  const fallbackEquivalent = equivalentMood(characterId, fallback, available);
  if (fallbackEquivalent) return fallbackEquivalent;

  return firstAvailable(available, [SAFE_DEFAULT[characterId], "neutral", ...available]) || available[0];
}

export function spritePath(characterId: string, requestedMood?: string, fallbackMood?: string) {
  return `/assets/sprites/${characterId}/${resolveSpriteMood(characterId, requestedMood, fallbackMood)}.webp`;
}
