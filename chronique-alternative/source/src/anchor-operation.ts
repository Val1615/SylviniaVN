export type AnchorPoint = "A" | "B" | "C";
export type AnchorFeedback = "phase" | "correct" | "error" | "incident" | "retreat" | "success";
export type AnchorSpeaker = "Hylee" | "Remerii" | "Narration";

export type AnchorPhase = {
  name: string;
  target: AnchorPoint;
  short: string;
  objective: string;
  hint: string;
  dialogue: [AnchorSpeaker, string][];
};

export type AnchorState = {
  version: 1;
  seed: number;
  phase: number;
  incidents: number;
  errors: number;
  solved: number[];
  selected?: AnchorPoint;
  lastPoint?: AnchorPoint;
  input: number[];
  memorizing: boolean;
  result?: "controlled" | "pressure" | "retreat";
  signalReady: boolean;
  message: string;
  speaker?: AnchorSpeaker;
  feedback?: AnchorFeedback;
  revision: number;
};

export const ANCHOR_PHASE_DATA: AnchorPhase[] = [
  {
    name: "Lecture",
    target: "B",
    short: "Repérer le point qui tire sur le portail.",
    objective: "Remerii donne une lecture brève. Désignez directement l’ancrage qui déclenche la réponse des deux autres.",
    hint: "Deux pulsations quittent B avant que les autres plateformes ne répondent.",
    dialogue: [
      ["Remerii", "Le centre. C’est lui qui tire sur le reste."],
      ["Hylee", "Je suis prête."],
    ],
  },
  {
    name: "Décharge",
    target: "C",
    short: "Une surcharge apparaît à l’est.",
    objective: "Le flux change brutalement. Déchargez le point oriental avant qu’Hylee ne reprenne sa liaison.",
    hint: "C bat de plus en plus vite. Son levier de décharge reste accessible.",
    dialogue: [
      ["Remerii", "C monte."],
      ["Hylee", "Je peux le prendre."],
      ["Remerii", "Oui. Dès que le levier tombe."],
    ],
  },
  {
    name: "Priorité",
    target: "A",
    short: "Deux points réagissent presque ensemble.",
    objective: "A et B se répondent. Neutralisez celui qui menace la voie de retour avant que la liaison ne se propage.",
    hint: "A se fissure. B peut tenir quelques secondes derrière le rideau de glace de Remerii.",
    dialogue: [
      ["Hylee", "A bouge aussi."],
      ["Remerii", "A d’abord. B peut tenir quelques secondes."],
    ],
  },
  {
    name: "À vue",
    target: "B",
    short: "Remerii perd la lecture du centre.",
    objective: "La lecture magique se brouille. Observez la carte et décrivez le point dont la pulsation vient de changer.",
    hint: "Le motif de B reste visible depuis votre passerelle. Remerii ne le voit plus.",
    dialogue: [
      ["Remerii", "Je ne vois plus le centre. Qu’est-ce qu’il fait ?"],
      ["Hylee", "Je reste prête."],
    ],
  },
  {
    name: "Synchronisation",
    target: "C",
    short: "Le dernier cycle verrouille les trois lignes.",
    objective: "Libérez le dernier relais, puis donnez le signal lorsque Hylee et Remerii sont toutes deux en place.",
    hint: "Les trois lignes se rejoignent sur C. Le verrou doit céder avant le signal.",
    dialogue: [
      ["Hylee", "Je prends C. Je peux tenir."],
      ["Remerii", "D’accord. À votre signal."],
    ],
  },
];

export const ANCHOR_PHASES = ANCHOR_PHASE_DATA.map((phase) => phase.name);
export const ANCHOR_TARGETS: AnchorPoint[] = ANCHOR_PHASE_DATA.map((phase) => phase.target);
export const ANCHOR_HINTS = ANCHOR_PHASE_DATA.map((phase) => phase.hint);

const PHASE_SUCCESS: [AnchorSpeaker, string][] = [
  ["Remerii", "B répond. Gardez cette lecture ; C vient de monter."],
  ["Hylee", "C est déchargé. A commence à tirer sur la passerelle."],
  ["Hylee", "A tient. Remerii, je te laisse B."],
  ["Remerii", "Je retrouve le motif. Une dernière liaison sur C."],
];

export function createAnchorOperation(seed: number): AnchorState {
  const [speaker, message] = ANCHOR_PHASE_DATA[0].dialogue[0];
  return {
    version: 1,
    seed: Math.abs(Math.floor(seed)) || 1,
    phase: 0,
    incidents: 0,
    errors: 0,
    solved: [],
    input: [],
    memorizing: false,
    signalReady: false,
    message,
    speaker,
    feedback: "phase",
    revision: 0,
  };
}

export function anchorPuzzle(state: AnchorState) {
  const variant = (state.seed + state.phase * 7) % 4;
  return {
    directions: [
      [0, 1, 3],
      [2, 0, 1],
      [3, 2, 0],
      [1, 3, 2],
    ][variant],
    runes: [
      [0, 1, 0, 1, 2, 1],
      [2, 3, 2, 0, 2, 3],
      [1, 2, 3, 2, 1, 2],
      [3, 0, 3, 0, 3, 1],
    ][variant],
    odd: [4, 3, 2, 5][variant],
    pulses: [
      [0, 2, 1, 3],
      [3, 1, 1, 0],
      [2, 0, 3, 2],
      [1, 3, 0, 1],
    ][variant],
  };
}

function operationError(state: AnchorState): AnchorState {
  const createsIncident = state.errors >= 1;
  const incidents = state.incidents + Number(createsIncident);
  const retreat = incidents >= 2;
  const [speaker, message]: [AnchorSpeaker, string] = retreat
    ? ["Remerii", "On se retire. Hylee garde le passage ; rejoignez le col !"]
    : createsIncident
      ? ["Hylee", "La liaison a sauté ici ! Remerii, je te la rends — nous avons encore une marge."]
      : ["Remerii", "Attendez. Reprenez le repère ; le mécanisme résiste mais le cycle tient."];
  return {
    ...state,
    input: state.selected === "A" ? [0, 0, 0] : [],
    errors: createsIncident ? 0 : state.errors + 1,
    incidents,
    result: retreat ? "retreat" : undefined,
    revision: state.revision + 1,
    memorizing: !retreat && state.selected === "C",
    selected: retreat ? undefined : state.selected,
    message,
    speaker,
    feedback: retreat ? "retreat" : createsIncident ? "incident" : "error",
  };
}

export function selectAnchor(state: AnchorState, point: AnchorPoint): AnchorState {
  if (state.result || state.signalReady) return state;
  if (point !== ANCHOR_TARGETS[state.phase]) {
    return operationError({
      ...state,
      selected: undefined,
      lastPoint: point,
      input: [],
      memorizing: false,
    });
  }
  if (state.selected === point) return state;
  return {
    ...state,
    selected: point,
    lastPoint: point,
    input: point === "A" ? [0, 0, 0] : [],
    memorizing: point === "C",
    feedback: "phase",
  };
}

function solve(state: AnchorState): AnchorState {
  const solved = [...new Set([...state.solved, state.phase])];
  if (state.phase === ANCHOR_PHASE_DATA.length - 1) {
    return {
      ...state,
      solved,
      signalReady: true,
      memorizing: false,
      selected: undefined,
      input: [],
      revision: state.revision + 1,
      message: "Je peux tenir ce cycle. Remerii ?",
      speaker: "Hylee",
      feedback: "correct",
    };
  }
  const [speaker, message] = PHASE_SUCCESS[state.phase];
  return {
    ...state,
    phase: state.phase + 1,
    solved,
    errors: 0,
    selected: undefined,
    input: [],
    memorizing: false,
    revision: state.revision + 1,
    message,
    speaker,
    feedback: "correct",
  };
}

export function anchorAction(
  state: AnchorState,
  action: number | "check" | "remember" | "signal",
): AnchorState {
  if (state.result) return state;
  if (action === "signal") {
    if (!state.signalReady) return state;
    return {
      ...state,
      result: state.incidents ? "pressure" : "controlled",
      revision: state.revision + 1,
      message: "Le signal passe. Les trois anneaux s’éteignent ; le portail reste loin au-dessus, privé de ses relais.",
      speaker: "Narration",
      feedback: "success",
    };
  }

  const puzzle = anchorPuzzle(state);
  if (state.selected === "A") {
    if (action === "check") {
      return state.input.length === 3 && state.input.every((direction, index) => direction === puzzle.directions[index])
        ? solve(state)
        : operationError(state);
    }
    if (typeof action === "number" && Number.isInteger(action) && action >= 0 && action < 3) {
      return {
        ...state,
        input: state.input.map((direction, index) => index === action ? (direction + 1) % 4 : direction),
      };
    }
  }
  if (state.selected === "B" && typeof action === "number") {
    return action === puzzle.odd ? solve(state) : operationError(state);
  }
  if (state.selected === "C") {
    if (action === "remember") return { ...state, memorizing: false, input: [] };
    if (state.memorizing || typeof action !== "number") return state;
    if (puzzle.pulses[state.input.length] !== action) return operationError(state);
    const next = { ...state, input: [...state.input, action] };
    return next.input.length === 4 ? solve(next) : next;
  }
  return state;
}

export function pointCompletion(state: AnchorState, point: AnchorPoint) {
  const phases = ANCHOR_TARGETS
    .map((target, index) => target === point ? index : -1)
    .filter((index) => index >= 0);
  const completed = phases.filter((phase) => state.solved.includes(phase)).length;
  return { completed, total: phases.length, done: completed === phases.length };
}

export function validAnchorState(value: unknown): value is AnchorState {
  const state = value as AnchorState;
  if (
    !state
    || state.version !== 1
    || !Number.isInteger(state.seed)
    || state.seed < 1
    || !Number.isInteger(state.phase)
    || state.phase < 0
    || state.phase >= ANCHOR_PHASE_DATA.length
    || !Number.isInteger(state.incidents)
    || state.incidents < 0
    || state.incidents > 2
    || !Number.isInteger(state.errors)
    || state.errors < 0
    || state.errors > 1
    || !Array.isArray(state.solved)
    || !Array.isArray(state.input)
    || state.input.length > 4
    || state.input.some((number) => !Number.isInteger(number) || number < 0 || number > 3)
    || (state.selected && state.selected !== ANCHOR_TARGETS[state.phase])
    || typeof state.message !== "string"
    || !Number.isInteger(state.revision)
    || typeof state.memorizing !== "boolean"
    || typeof state.signalReady !== "boolean"
    || (state.lastPoint && !["A", "B", "C"].includes(state.lastPoint))
    || (state.speaker && !["Hylee", "Remerii", "Narration"].includes(state.speaker))
    || (state.feedback && !["phase", "correct", "error", "incident", "retreat", "success"].includes(state.feedback))
    || (state.result && !["controlled", "pressure", "retreat"].includes(state.result))
  ) return false;

  const completed = state.signalReady ? ANCHOR_PHASE_DATA.length : state.phase;
  if (state.solved.length !== completed || state.solved.some((phase, index) => phase !== index)) return false;
  if (state.signalReady && (state.phase !== ANCHOR_PHASE_DATA.length - 1 || state.selected)) return false;
  if (state.incidents === 2 && state.result !== "retreat") return false;
  if (state.result === "retreat" && state.incidents !== 2) return false;
  if (state.result === "controlled" && (!state.signalReady || state.incidents !== 0)) return false;
  if (state.result === "pressure" && (!state.signalReady || state.incidents !== 1)) return false;
  return true;
}
