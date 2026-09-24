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
} as const;

export type IntimateSpriteCharacter = keyof typeof INTIMATE_SPRITE_MOODS;
export const INTIMATE_SPRITE_FALLBACKS: Record<IntimateSpriteCharacter, "soft"> = {
  hylee: "soft",
  remerii: "soft",
  allenna: "soft",
  lineva: "soft",
};

const SOLO_PHASE_TRACKS: Record<IntimateSpriteCharacter, readonly string[]> = {
  hylee: ["soft", "shy", "seductive", "tender", "teasing", "seductive", "teasing", "seductive", "tender", "soft"],
  remerii: ["soft", "shy", "inviting", "soft", "teasing", "inviting", "strict", "inviting", "shy", "soft"],
  allenna: ["soft", "shy", "shy", "troubled", "soft", "seductive", "stern", "seductive", "shy", "soft"],
  lineva: ["soft", "pouting", "smirk", "soft", "teasing", "passionate", "annoyed", "passionate", "soft", "soft"],
};

const SOLO_ROUTE_ACCENTS: Record<IntimateSpriteCharacter, readonly [needle: string, mood: string][]> = {
  hylee: [["joueuse", "teasing"], ["audacieuse", "seductive"], ["tendre", "tender"], ["cuisine", "teasing"]],
  remerii: [["complice", "teasing"], ["attentive", "soft"], ["elan", "inviting"], ["hypothese", "strict"]],
  allenna: [["defi", "stern"], ["tendre", "soft"], ["passion", "seductive"], ["discipline", "stern"]],
  lineva: [["joueuse", "teasing"], ["tendre", "soft"], ["passionnee", "passionate"], ["commandement", "annoyed"]],
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
  return `/assets/sprites-intimate/${characterId}/${resolveIntimateSpriteMood(characterId, requestedMood)}.webp`;
}

export function intimateSpriteFallbackPath(characterId: string): string {
  return intimateSpritePath(characterId, hasIntimateSprites(characterId) ? INTIMATE_SPRITE_FALLBACKS[characterId] : "soft");
}

export function isIntimateGroupContext(contextId: string): contextId is IntimateGroupContext {
  return contextId in GROUP_CONTEXTS;
}

function phaseMood(characterId: IntimateSpriteCharacter, routeId: string, chapterIndex: number, lineIndex: number) {
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
  if (!track?.length) return "soft";
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
  if (!isIntimateGroupContext(contextId) || !characters.every(hasIntimateSprites)) return chapters;
  return chapters.map((chapter, chapterIndex) => chapter.map((line) => ({
    ...line,
    intimateMoods: {
      ...line.intimateMoods,
      [characters[0]]: groupMood(contextId, characters[0], chapterIndex),
      [characters[1]]: groupMood(contextId, characters[1], chapterIndex),
    },
  })));
}
