import type { DialogueLine } from "./game-data";

/**
 * Dedicated catalogue for the undressed sprites. It intentionally shares no
 * registry or fallback with sprite-system.ts: ordinary scenes can therefore
 * never select one of these assets by accident.
 */
export const INTIMATE_SPRITE_MOODS = {
  hylee: ["soft", "shy", "seductive", "tender", "teasing", "annoyed"],
  remerii: ["teasing", "soft", "inviting", "shy", "strict", "smirk"],
  allenna: ["seductive", "angry", "shy", "soft", "troubled", "stern"],
  lineva: ["teasing", "passionate", "pouting", "smirk", "annoyed", "soft"],
  naiah: ["laugh", "soft", "teasing", "stern", "inviting", "smirk"],
  // Six PNG livrés pour Bellirith, copiés à l’octet près et seulement renommés.
  bellirith: ["teasing", "haughty", "inviting", "hungry", "sultry", "smug"],
} as const;

export type IntimateSpriteCharacter = keyof typeof INTIMATE_SPRITE_MOODS;
export const INTIMATE_SPRITE_FALLBACKS: Record<IntimateSpriteCharacter, string> = {
  hylee: "soft",
  remerii: "soft",
  allenna: "soft",
  lineva: "soft",
  naiah: "soft",
  // Bellirith n’a pas d’expression « soft » : sa pose la plus posée sert de repli.
  bellirith: "haughty",
};

const INTIMATE_SPRITE_EXTENSIONS: Record<IntimateSpriteCharacter, "webp" | "png"> = {
  hylee: "webp",
  remerii: "webp",
  allenna: "webp",
  lineva: "webp",
  // Les six fichiers Naïah sont volontairement conservés tels que livrés.
  // Leurs noms stables permettent de remplacer les placeholders sans toucher au code.
  naiah: "png",
  bellirith: "png",
};

const SOLO_PHASE_TRACKS: Record<IntimateSpriteCharacter, readonly string[]> = {
  hylee: ["soft", "shy", "seductive", "tender", "teasing", "seductive", "teasing", "seductive", "tender", "soft"],
  remerii: ["soft", "shy", "inviting", "soft", "teasing", "inviting", "strict", "inviting", "shy", "soft"],
  allenna: ["soft", "shy", "shy", "troubled", "soft", "seductive", "stern", "seductive", "shy", "soft"],
  lineva: ["soft", "pouting", "smirk", "soft", "teasing", "passionate", "annoyed", "passionate", "soft", "soft"],
  naiah: ["soft", "smirk", "teasing", "laugh", "soft", "inviting", "stern", "teasing", "smirk", "soft"],
  bellirith: ["haughty", "teasing", "sultry", "inviting", "teasing", "hungry", "smug", "hungry", "sultry", "smug"],
};

/**
 * Bellirith : une piste par route, écrite d’après le contenu de chaque séquence
 * (défi, revanche, aveu, rire). Seules les séquences entre le dévoilement et la
 * CG finale affichent réellement ces sprites, et uniquement en mode explicite.
 */
const SOLO_ROUTE_TRACKS: Partial<Record<IntimateSpriteCharacter, Record<string, readonly string[]>>> = {
  bellirith: {
    "bellirith-mirrors": ["sultry", "teasing", "haughty", "inviting", "haughty", "smug", "teasing", "haughty", "sultry", "inviting", "hungry", "sultry", "smug"],
    "bellirith-baths": ["haughty", "teasing", "inviting", "teasing", "sultry", "inviting", "smug", "inviting", "haughty", "hungry", "sultry", "smug"],
    "bellirith-saelis": ["inviting", "smug", "sultry", "inviting", "inviting", "teasing", "smug", "haughty", "hungry", "sultry", "sultry", "smug", "teasing"],
    "bellirith-eve": ["teasing", "inviting", "sultry", "inviting", "haughty", "sultry", "hungry", "inviting", "sultry", "sultry", "haughty", "smug"],
    "bellirith-free-familiar": ["teasing", "sultry", "inviting", "haughty", "hungry", "teasing", "smug", "haughty", "sultry", "sultry", "smug", "teasing"],
    "bellirith-free-first": ["sultry", "hungry", "hungry", "inviting", "teasing", "haughty", "sultry", "smug", "hungry", "sultry", "teasing", "sultry"],
    "bellirith-duel-steal": ["haughty", "teasing", "inviting", "hungry", "haughty", "teasing", "smug", "hungry", "inviting", "sultry", "smug", "sultry", "haughty"],
    "bellirith-duel-turn": ["haughty", "sultry", "teasing", "inviting", "sultry", "smug", "hungry", "teasing", "inviting", "sultry", "smug", "haughty", "sultry"],
    "bellirith-heure-salon": ["haughty", "teasing", "sultry", "teasing", "inviting", "hungry", "smug", "sultry", "inviting", "sultry", "smug", "teasing", "sultry"],
    "bellirith-heure-auberge": ["haughty", "teasing", "teasing", "sultry", "inviting", "teasing", "sultry", "hungry", "haughty", "smug", "sultry", "sultry", "smug"],
    "bellirith-heure-logis": ["teasing", "haughty", "inviting", "teasing", "inviting", "smug", "sultry", "hungry", "haughty", "inviting", "sultry", "sultry", "teasing"],
    "bellirith-heure-confidence": ["sultry", "teasing", "hungry", "haughty", "inviting", "sultry", "hungry", "haughty", "sultry", "inviting", "inviting", "haughty", "sultry"],
    "bellirith-heure-ennui": ["haughty", "teasing", "sultry", "teasing", "inviting", "haughty", "teasing", "hungry", "smug", "inviting", "sultry", "smug", "teasing"],
    "bellirith-heure-matin": ["sultry", "haughty", "teasing", "haughty", "inviting", "teasing", "smug", "sultry", "smug", "inviting", "sultry", "teasing", "smug"],
    "bellirith-heure-couloir": ["sultry", "teasing", "hungry", "teasing", "inviting", "teasing", "hungry", "sultry", "inviting", "hungry", "sultry", "smug", "haughty"],
    "bellirith-heure-faveur": ["haughty", "teasing", "sultry", "haughty", "inviting", "smug", "sultry", "teasing", "haughty", "hungry", "sultry", "smug", "teasing"],
  },
};

const SOLO_ROUTE_ACCENTS: Record<IntimateSpriteCharacter, readonly [needle: string, mood: string][]> = {
  hylee: [["joueuse", "teasing"], ["audacieuse", "seductive"], ["tendre", "tender"], ["cuisine", "teasing"]],
  remerii: [["complice", "teasing"], ["attentive", "soft"], ["elan", "inviting"], ["hypothese", "strict"]],
  allenna: [["defi", "stern"], ["tendre", "soft"], ["passion", "seductive"], ["discipline", "stern"]],
  lineva: [["joueuse", "teasing"], ["tendre", "soft"], ["passionnee", "passionate"], ["commandement", "annoyed"]],
  naiah: [["jeu", "teasing"], ["illusion", "smirk"], ["rire", "laugh"], ["confiance", "soft"]],
  bellirith: [],
};

const GROUP_CONTEXTS = {
  "group-date-hylee-remerii-free-day": {
    hylee: ["teasing", "soft", "shy", "seductive", "teasing", "seductive", "tender", "seductive", "tender", "soft"],
    remerii: ["smirk", "soft", "shy", "inviting", "teasing", "inviting", "strict", "inviting", "shy", "soft"],
  },
  "group-date-hylee-remerii-wind": {
    hylee: ["soft", "shy", "tender", "seductive", "annoyed", "seductive", "teasing", "seductive", "tender", "soft"],
    remerii: ["strict", "soft", "shy", "inviting", "strict", "inviting", "smirk", "inviting", "shy", "soft"],
  },
  "group-date-hylee-remerii-home": {
    hylee: ["tender", "teasing", "shy", "seductive", "tender", "seductive", "teasing", "seductive", "tender", "soft"],
    remerii: ["soft", "smirk", "shy", "inviting", "soft", "inviting", "teasing", "inviting", "shy", "soft"],
  },
  "group-date-allenna-lineva-training": {
    allenna: ["stern", "angry", "shy", "seductive", "troubled", "seductive", "stern", "seductive", "shy", "soft"],
    lineva: ["soft", "annoyed", "pouting", "smirk", "teasing", "passionate", "annoyed", "passionate", "soft", "soft"],
  },
  "group-date-allenna-lineva-basin": {
    allenna: ["soft", "shy", "seductive", "troubled", "seductive", "seductive", "stern", "seductive", "shy", "soft"],
    lineva: ["soft", "smirk", "teasing", "passionate", "passionate", "passionate", "pouting", "passionate", "soft", "soft"],
  },
  "group-date-allenna-lineva-home": {
    allenna: ["soft", "shy", "troubled", "seductive", "soft", "seductive", "stern", "seductive", "shy", "soft"],
    lineva: ["soft", "pouting", "smirk", "teasing", "passionate", "passionate", "annoyed", "passionate", "soft", "soft"],
  },
  "group-date-hylee-naiah": {
    hylee: ["soft", "teasing", "shy", "tender", "seductive", "teasing", "tender", "soft"],
    naiah: ["smirk", "teasing", "laugh", "inviting", "soft", "teasing", "stern", "soft"],
  },
  // Quinze étapes : défi, renversement, révélation, jeu, culmination, revanche.
  "group-date-hylee-naiah-place": {
    hylee: ["teasing", "annoyed", "teasing", "seductive", "teasing", "shy", "seductive", "annoyed", "teasing", "seductive", "tender", "seductive", "annoyed", "teasing", "soft"],
    naiah: ["smirk", "teasing", "stern", "laugh", "laugh", "smirk", "teasing", "inviting", "laugh", "teasing", "smirk", "inviting", "laugh", "smirk", "soft"],
  },
  "group-date-hylee-naiah-one": {
    hylee: ["annoyed", "teasing", "teasing", "seductive", "annoyed", "shy", "teasing", "seductive", "teasing", "seductive", "tender", "seductive", "teasing", "soft", "soft"],
    naiah: ["inviting", "smirk", "teasing", "stern", "laugh", "inviting", "teasing", "smirk", "laugh", "inviting", "smirk", "teasing", "laugh", "smirk", "soft"],
  },
  "group-date-hylee-naiah-home": {
    hylee: ["teasing", "seductive", "annoyed", "teasing", "teasing", "shy", "seductive", "teasing", "annoyed", "seductive", "tender", "seductive", "teasing", "soft", "soft"],
    naiah: ["smirk", "inviting", "teasing", "stern", "laugh", "smirk", "teasing", "inviting", "laugh", "smirk", "teasing", "inviting", "laugh", "smirk", "soft"],
  },
  // Valurn n’a pas de sprites intimes : seule Bellirith change de canal, comme Naïah ci-dessous avant ce lot.
  "group-date-valurn-bellirith": {
    bellirith: ["teasing", "haughty", "smug", "inviting", "hungry", "sultry", "sultry", "smug"],
  },
  "group-date-naiah-bellirith": {
    naiah: ["soft", "smirk", "teasing", "stern", "inviting", "laugh", "teasing", "soft"],
    bellirith: ["teasing", "smug", "haughty", "inviting", "sultry", "hungry", "smug", "sultry"],
  },
} as const;

export type IntimateGroupContext = keyof typeof GROUP_CONTEXTS;

function normalized(value?: string) {
  return value?.trim().toLocaleLowerCase("fr-FR") || "";
}

export function hasIntimateSprites(characterId: string): characterId is IntimateSpriteCharacter {
  return characterId in INTIMATE_SPRITE_MOODS;
}

export function resolveIntimateSpriteMood(characterId: string, requestedMood?: string): string {
  if (!hasIntimateSprites(characterId)) return "soft";
  const requested = normalized(requestedMood);
  const available = INTIMATE_SPRITE_MOODS[characterId] as readonly string[];
  return available.includes(requested) ? requested : INTIMATE_SPRITE_FALLBACKS[characterId];
}

export function intimateSpritePath(characterId: string, requestedMood?: string): string {
  const extension = hasIntimateSprites(characterId) ? INTIMATE_SPRITE_EXTENSIONS[characterId] : "webp";
  return `/assets/sprites-intimate/${characterId}/${resolveIntimateSpriteMood(characterId, requestedMood)}.${extension}`;
}

export function intimateSpriteFallbackPath(characterId: string): string {
  return intimateSpritePath(characterId, hasIntimateSprites(characterId) ? INTIMATE_SPRITE_FALLBACKS[characterId] : "soft");
}

/** Piste solo dédiée à une route (validateurs, outils de développement). */
export function soloRouteTrack(characterId: string, routeId: string): readonly string[] | undefined {
  return hasIntimateSprites(characterId) ? SOLO_ROUTE_TRACKS[characterId]?.[routeId] : undefined;
}

export function isIntimateGroupContext(contextId: string): contextId is IntimateGroupContext {
  return contextId in GROUP_CONTEXTS;
}

function phaseMood(characterId: IntimateSpriteCharacter, routeId: string, chapterIndex: number, lineIndex: number) {
  const routeTrack = SOLO_ROUTE_TRACKS[characterId]?.[routeId];
  if (routeTrack?.length) return resolveIntimateSpriteMood(characterId, routeTrack[Math.min(chapterIndex, routeTrack.length - 1)]);
  const track = SOLO_PHASE_TRACKS[characterId];
  const base = track[Math.min(chapterIndex, track.length - 1)] || INTIMATE_SPRITE_FALLBACKS[characterId];
  const accent = SOLO_ROUTE_ACCENTS[characterId].find(([needle]) => normalized(routeId).includes(needle))?.[1];
  const centralBeat = chapterIndex >= 3 && chapterIndex <= 7;
  return resolveIntimateSpriteMood(characterId, accent && centralBeat && (chapterIndex + lineIndex) % 2 === 1 ? accent : base);
}

/** Adds replay-stable, explicit moods to the actual intimate route only. */
export function withSoloIntimateMoods(
  chapters: DialogueLine[][],
  characterId: string,
  routeId: string,
): DialogueLine[][] {
  if (!hasIntimateSprites(characterId)) return chapters;
  return chapters.map((chapter, chapterIndex) => chapter.map((line, lineIndex) => ({
    ...line,
    intimateMood: phaseMood(characterId, routeId, chapterIndex, lineIndex),
  })));
}

export function withSoloIntimateEnding(
  lines: DialogueLine[],
  characterId: string,
  routeId: string,
  chapterIndex: number,
): DialogueLine[] {
  if (!hasIntimateSprites(characterId)) return lines;
  return lines.map((line, lineIndex) => ({
    ...line,
    intimateMood: phaseMood(characterId, routeId, chapterIndex, lineIndex),
  }));
}

function groupMood(contextId: IntimateGroupContext, characterId: string, chapterIndex: number) {
  const context = GROUP_CONTEXTS[contextId] as Partial<Record<IntimateSpriteCharacter, readonly string[]>>;
  const track = hasIntimateSprites(characterId) ? context[characterId] : undefined;
  if (!track?.length) return hasIntimateSprites(characterId) ? INTIMATE_SPRITE_FALLBACKS[characterId] : "soft";
  return resolveIntimateSpriteMood(characterId, track[Math.min(chapterIndex, track.length - 1)]);
}

/**
 * Every line carries two independent expressions. This keeps the triangle
 * visible during narration and makes replay independent of transient UI state.
 */
export function withGroupIntimateMoods(
  chapters: DialogueLine[][],
  contextId: string,
  characters: readonly [string, string],
): DialogueLine[][] {
  if (!isIntimateGroupContext(contextId) || !characters.some(hasIntimateSprites)) return chapters;
  return chapters.map((chapter, chapterIndex) => chapter.map((line) => {
    const intimateMoods: Partial<Record<string, string>> = { ...line.intimateMoods };
    characters.forEach((characterId) => {
      if (hasIntimateSprites(characterId)) intimateMoods[characterId] = groupMood(contextId, characterId, chapterIndex);
    });
    return { ...line, intimateMoods };
  }));
}
