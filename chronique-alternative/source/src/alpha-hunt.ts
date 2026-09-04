export type AlphaCell = { row: number; col: number };
export type AlphaPhase = "observation" | "movement" | "localized" | "victory" | "failure";
export type AlphaNotice = { id: number; speaker: "lineva" | "allenna"; text: string };
export type AlphaPatrol = { id: string; cell: AlphaCell; respawnTurn?: number; seaCol: number };

export type AlphaHuntState = {
  seed: number;
  originalSeed: number;
  alpha: AlphaCell[];
  revealed: AlphaCell[];
  duo: AlphaCell;
  patrols: AlphaPatrol[];
  phase: AlphaPhase;
  turn: number;
  clashes: number;
  reinforcementsDeployed: boolean;
  lastReaction: string;
  notices: AlphaNotice[];
};

export const ALPHA_GRID_SIZE = 7;
export const ALPHA_HIGH_CITY_ROW = 0;
export const ALPHA_RANGE = 3;
export const ALPHA_SECTOR_NAMES = [
  "Ville haute", "Rampe des cloches", "Quartiers intermédiaires", "Marché rompu", "Ville basse", "Docks incendiés", "Bassin et brise-lames",
];

const SHAPES: AlphaCell[][] = [
  [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 3 }],
  [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }, { row: 3, col: 0 }],
  [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 1, col: 0 }, { row: 1, col: 1 }],
  [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }, { row: 2, col: 1 }],
  [{ row: 0, col: 1 }, { row: 1, col: 1 }, { row: 2, col: 1 }, { row: 2, col: 0 }],
  [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 1, col: 0 }],
  [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 1, col: 2 }],
];

const key = (cell: AlphaCell) => `${cell.row}:${cell.col}`;
const same = (left: AlphaCell, right: AlphaCell) => left.row === right.row && left.col === right.col;
export const alphaDistance = (left: AlphaCell, right: AlphaCell) => Math.abs(left.row - right.row) + Math.abs(left.col - right.col);
const inside = (cell: AlphaCell) => cell.row >= 0 && cell.row < ALPHA_GRID_SIZE && cell.col >= 0 && cell.col < ALPHA_GRID_SIZE;
const uniqueCells = (cells: AlphaCell[]) => Array.from(new Map(cells.map((cell) => [key(cell), cell])).values());

function rng(seed: number) {
  let value = Math.imul(seed || 1, 0x9e3779b1) >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

export function alphaPlacement(seed: number) {
  const random = rng(seed || 1);
  const shape = SHAPES[Math.floor(random() * SHAPES.length)];
  const height = Math.max(...shape.map((cell) => cell.row)) + 1;
  const width = Math.max(...shape.map((cell) => cell.col)) + 1;
  const startRow = 2 + Math.floor(random() * (ALPHA_GRID_SIZE - height - 1));
  const startCol = Math.floor(random() * (ALPHA_GRID_SIZE - width + 1));
  return shape.map((cell) => ({ row: startRow + cell.row, col: startCol + cell.col }));
}

function seaCell(col: number): AlphaCell {
  return { row: 6, col: Math.max(0, Math.min(6, col)) };
}

export function createAlphaHunt(seed: number): AlphaHuntState {
  const alpha = alphaPlacement(seed);
  const centerCol = Math.round(alpha.reduce((sum, cell) => sum + cell.col, 0) / alpha.length);
  return {
    seed,
    originalSeed: seed,
    alpha,
    revealed: [],
    duo: { row: 0, col: 3 },
    patrols: [
      { id: "patrol-1", cell: { row: 4, col: Math.max(0, centerCol - 2) }, seaCol: 0 },
      { id: "patrol-2", cell: { row: 5, col: Math.min(6, centerCol + 2) }, seaCol: 6 },
      { id: "patrol-3", cell: { row: 3, col: centerCol }, seaCol: centerCol },
    ],
    phase: "observation",
    turn: 1,
    clashes: 0,
    reinforcementsDeployed: false,
    lastReaction: "Choisissez une case dans un rayon de trois secteurs.",
    notices: [{ id: 1, speaker: "lineva", text: "On descend ensemble. Donnez-nous la route." }],
  };
}

export function retryAlphaHunt(state: AlphaHuntState): AlphaHuntState {
  return createAlphaHunt(state.originalSeed);
}

export function alphaCellInRange(state: AlphaHuntState, cell: AlphaCell) {
  return inside(cell) && alphaDistance(state.duo, cell) <= ALPHA_RANGE;
}

export function alphaMoveAllowed(state: AlphaHuntState, cell: AlphaCell) {
  const distance = alphaDistance(state.duo, cell);
  return inside(cell) && state.phase !== "observation" && state.phase !== "victory" && state.phase !== "failure" && distance >= 1 && distance <= 2;
}

function reactionFor(distance: number, hit: boolean) {
  if (hit) return "Impact Alpha";
  if (distance <= 1) return "Présence impie";
  if (distance === 2) return "Convergence";
  if (distance === 3) return "Agitation";
  if (distance === 4) return "Mouvements faibles";
  return "Aucune réaction";
}

export function strikeAlphaCell(state: AlphaHuntState, cell: AlphaCell): AlphaHuntState {
  if (state.phase !== "observation" || !alphaCellInRange(state, cell)) return state;
  const hit = state.alpha.some((entry) => same(entry, cell));
  const already = state.revealed.some((entry) => same(entry, cell));
  const patrolHit = state.patrols.some((patrol) => !patrol.respawnTurn && same(patrol.cell, cell));
  const revealed = hit && !already ? [...state.revealed, cell] : state.revealed;
  const patrols = state.patrols.map((patrol) => patrolHit && !patrol.respawnTurn && same(patrol.cell, cell)
    ? { ...patrol, respawnTurn: state.turn + 2 }
    : patrol);
  const minDistance = Math.min(...state.alpha.map((entry) => alphaDistance(entry, cell)));
  const notices = [...state.notices];
  if (hit && !already) notices.push({ id: Date.now() + notices.length, speaker: "allenna", text: revealed.length === 4 ? "Empreinte complète. Il faut maintenant l’atteindre." : `Impact confirmé. ${revealed.length} sur 4.` });
  else if (patrolHit) notices.push({ id: Date.now() + notices.length, speaker: "lineva", text: "Route ouverte. Elle ne le restera pas longtemps." });
  const secondImpact = revealed.length >= 2 && state.revealed.length < 2 && !state.reinforcementsDeployed;
  if (secondImpact) notices.push({ id: Date.now() + notices.length + 1, speaker: "allenna", text: "Deux nouvelles convergences depuis le bassin. La ruche réagit." });
  const reinforcements = secondImpact ? [
    { id: "reinforcement-1", cell: seaCell(1), seaCol: 1 },
    { id: "reinforcement-2", cell: seaCell(5), seaCol: 5 },
  ] : [];
  return {
    ...state,
    revealed,
    patrols: [...patrols, ...reinforcements],
    phase: revealed.length === 4 ? "localized" : "movement",
    reinforcementsDeployed: state.reinforcementsDeployed || secondImpact,
    lastReaction: hit && already ? "Impact déjà confirmé" : reactionFor(minDistance, hit),
    notices: notices.slice(-6),
  };
}

function stepToward(from: AlphaCell, target: AlphaCell, turn: number): AlphaCell {
  const rowDelta = target.row - from.row;
  const colDelta = target.col - from.col;
  if (Math.abs(rowDelta) > Math.abs(colDelta) || (Math.abs(rowDelta) === Math.abs(colDelta) && turn % 2 === 0)) {
    return { row: from.row + Math.sign(rowDelta), col: from.col };
  }
  return { row: from.row, col: from.col + Math.sign(colDelta) };
}

function patrolTarget(state: AlphaHuntState, patrol: AlphaPatrol) {
  const alphaCell = state.alpha[(state.turn + Number(patrol.id.match(/\d+/)?.[0] || 0)) % state.alpha.length];
  const ring = [
    { row: alphaCell.row - 1, col: alphaCell.col }, { row: alphaCell.row, col: alphaCell.col + 1 },
    { row: alphaCell.row + 1, col: alphaCell.col }, { row: alphaCell.row, col: alphaCell.col - 1 },
  ].filter((cell) => inside(cell) && cell.row !== ALPHA_HIGH_CITY_ROW);
  return ring[state.turn % Math.max(1, ring.length)] || alphaCell;
}

export function moveAlphaDuo(state: AlphaHuntState, destination: AlphaCell): AlphaHuntState {
  if (!alphaMoveAllowed(state, destination)) return state;
  const nextTurn = state.turn + 1;
  let patrols = state.patrols.map((patrol) => {
    if (patrol.respawnTurn) {
      if (nextTurn < patrol.respawnTurn) return patrol;
      return { ...patrol, cell: seaCell(patrol.seaCol), respawnTurn: undefined };
    }
    return { ...patrol, cell: stepToward(patrol.cell, patrolTarget(state, patrol), state.turn) };
  });
  patrols = patrols.map((patrol) => patrol.cell.row === ALPHA_HIGH_CITY_ROW ? { ...patrol, cell: { ...patrol.cell, row: 1 } } : patrol);
  const clashesNow = patrols.filter((patrol) => !patrol.respawnTurn && same(patrol.cell, destination)).length;
  const clashes = Math.min(2, state.clashes + clashesNow);
  const notices = [...state.notices];
  if (clashesNow) notices.push({ id: Date.now(), speaker: "lineva", text: clashes >= 2 ? "Deuxième accrochage. On se replie et on reprend la carte." : "Contact ! On passe, mais pas une seconde fois." });
  return {
    ...state,
    duo: destination,
    patrols,
    turn: nextTurn,
    clashes,
    phase: clashes >= 2 ? "failure" : "observation",
    lastReaction: clashesNow ? "Accrochage sur la route" : state.revealed.length === 4 ? "Alpha localisé · approchez de l’empreinte" : "Nouvelle position · observation disponible",
    notices: notices.slice(-6),
  };
}

export function alphaAdjacent(state: AlphaHuntState) {
  return state.revealed.length === 4 && state.alpha.some((cell) => alphaDistance(cell, state.duo) === 1);
}

export function launchAlphaAssault(state: AlphaHuntState): AlphaHuntState {
  if (!alphaAdjacent(state) || state.phase === "failure") return state;
  return {
    ...state,
    phase: "victory",
    lastReaction: "L’Alpha tombe · la convergence se brise",
    notices: [...state.notices, { id: Date.now(), speaker: "allenna", text: "Ouverture créée. J’exploite maintenant." }].slice(-6),
  };
}

export function validateAlphaState(state: AlphaHuntState) {
  return state.alpha.length === 4
    && state.alpha.every((cell) => inside(cell) && cell.row !== ALPHA_HIGH_CITY_ROW)
    && uniqueCells(state.alpha).length === 4
    && inside(state.duo)
    && state.clashes >= 0 && state.clashes <= 2;
}
