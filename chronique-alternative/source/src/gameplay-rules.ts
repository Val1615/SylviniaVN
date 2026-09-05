export const SCOUT_VOCATION = "Éclaireur·se des routes";

export type MapLocation = {
  id: string;
  pin: readonly [number, number];
};

export type FlaggedContent = {
  characters?: readonly string[];
  requiredFlags?: readonly string[];
  excludedFlags?: readonly string[];
};

export type ClockState = {
  day: number;
  period: number;
};

export type InjectedChoiceKind = "misread" | "boundary" | "platonic";

export function injectedChoiceKind(choiceId: string): InjectedChoiceKind | undefined {
  if (choiceId.endsWith("-misread")) return "misread";
  if (choiceId.endsWith("-boundary")) return "boundary";
  if (choiceId.endsWith("-platonic")) return "platonic";
  return undefined;
}

/**
 * Une maladresse ou une pause ne doit jamais valider silencieusement une scène
 * majeure. Une réponse amicale peut clore la conversation actuelle, mais ne
 * verrouille jamais la nature des conversations suivantes.
 */
export function routeChoiceCompletes(choiceId: string): boolean {
  const kind = injectedChoiceKind(choiceId);
  return kind !== "misread" && kind !== "boundary";
}

/**
 * Les anciennes versions sauvegardaient les réponses amicales comme des choix
 * relationnels irrévocables. Ces marqueurs ne décrivent plus qu'un ton de scène
 * et doivent être ignorés puis retirés des sauvegardes existantes.
 */
export function isObsoletePermanentFriendshipFlag(flag: string): boolean {
  return flag === "cross-la-trio-platonic" || /^[a-z][a-z0-9-]*-platonic$/u.test(flag);
}

export function withoutObsoletePermanentFriendshipFlags(flags: readonly string[]): string[] {
  return flags.filter((flag) => !isObsoletePermanentFriendshipFlag(flag));
}

export function contentBranchAllowed(flags: readonly string[], content: FlaggedContent): boolean {
  const known = new Set(withoutObsoletePermanentFriendshipFlags(flags));
  return (content.requiredFlags || []).every((flag) => known.has(flag))
    && !(content.excludedFlags || []).some((flag) => known.has(flag));
}

/**
 * Les distances sont volontairement exprimées en périodes, pas en kilomètres :
 * changer de pièce prend une période, tandis qu'un trajet entre deux régions en
 * prend de deux à quatre selon l'éloignement sur la carte. La vocation
 * Éclaireur·se retire une période aux voyages régionaux, sans jamais les rendre
 * gratuits.
 */
export function travelPeriodCost(
  fromLocationId: string,
  toLocationId: string,
  vocation: string,
  locations: readonly MapLocation[],
): number {
  if (fromLocationId === toLocationId) return 1;
  const from = locations.find((location) => location.id === fromLocationId);
  const to = locations.find((location) => location.id === toLocationId);
  let base = 3;
  if (from && to) {
    const distance = Math.hypot(from.pin[0] - to.pin[0], from.pin[1] - to.pin[1]);
    base = distance <= 20 ? 2 : distance <= 42 ? 3 : 4;
  }
  return vocation === SCOUT_VOCATION ? Math.max(1, base - 1) : base;
}

export function advanceClock(clock: ClockState, steps: number, periodCount = 4): ClockState {
  const safeSteps = Math.max(0, Math.floor(steps));
  const absolute = (Math.max(1, clock.day) - 1) * periodCount + clock.period + safeSteps;
  return {
    day: Math.floor(absolute / periodCount) + 1,
    period: absolute % periodCount,
  };
}

export function travelDurationLabel(periods: number): string {
  return `${periods} période${periods > 1 ? "s" : ""}`;
}
