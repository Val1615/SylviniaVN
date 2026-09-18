export type AnchorPoint = "A" | "B" | "C";
export type AnchorState = { version: 1; seed: number; phase: number; incidents: number; errors: number; solved: number[]; selected?: AnchorPoint; input: number[]; memorizing: boolean; result?: "controlled" | "pressure" | "retreat"; signalReady: boolean; message: string; revision: number };
export const ANCHOR_PHASES = ["Lecture", "Décharge", "Priorité", "Lecture à vue", "Synchronisation"];
export const ANCHOR_TARGETS: AnchorPoint[] = ["B", "C", "A", "B", "C"];
export const ANCHOR_HINTS = ["Deux pulsations quittent B avant que les autres plateformes ne répondent.", "C bat de plus en plus vite. Son levier de décharge est accessible.", "A se fissure. B tient encore derrière le rideau de glace de Remerii.", "Le motif de B reste visible depuis votre passerelle. Remerii ne le voit plus.", "Les trois lignes se rejoignent sur C. Le verrou doit céder avant le signal."];
const VOICES = ["Remerii : Le centre. C’est lui.", "Remerii : C monte. Hylee : Je l’ai, dès que le levier cède !", "Remerii : Je garde B. Hylee : Alors je prends A.", "Remerii : Je ne vois plus le motif. Dites-moi ce qui change.", "Hylee : Je peux tenir ce cycle. Remerii : Un seul. … D’accord. À votre signal."];
export function createAnchorOperation(seed: number): AnchorState { return { version: 1, seed: Math.abs(Math.floor(seed)) || 1, phase: 0, incidents: 0, errors: 0, solved: [], input: [], memorizing: false, signalReady: false, message: VOICES[0], revision: 0 }; }
export function anchorPuzzle(state: AnchorState) {
  const v = (state.seed + state.phase * 7) % 4;
  return { directions: [[0,1,3],[2,0,1],[3,2,0],[1,3,2]][v], runes: [[0,1,0,1,2,1],[2,3,2,0,2,3],[1,2,3,2,1,2],[3,0,3,0,3,1]][v], odd: [4,3,2,5][v], pulses: [[0,2,1,3],[3,1,1,0],[2,0,3,2],[1,3,0,1]][v] };
}
function error(s: AnchorState): AnchorState {
  const incident = s.errors >= 1, incidents = s.incidents + Number(incident);
  return { ...s, input: s.selected === "A" ? [0,0,0] : [], errors: incident ? 0 : s.errors + 1, incidents, result: incidents >= 2 ? "retreat" : undefined, revision: s.revision + 1, memorizing: s.selected === "C", message: incidents >= 2 ? "Remerii : On se retire. Hylee : Le passage est libre. Venez !" : incident ? "Hylee : Ça a lâché ici ! Remerii : Je reprends. Nous avons encore une marge." : "Remerii : Attendez. Reprenez le repère ; le mécanisme résiste." };
}
export function selectAnchor(s: AnchorState, point: AnchorPoint): AnchorState {
  if (s.result || s.signalReady) return s;
  if (point !== ANCHOR_TARGETS[s.phase]) return error({ ...s, selected: undefined, input: [], memorizing: false });
  if (s.selected === point) return s;
  return { ...s, selected: point, input: point === "A" ? [0,0,0] : [], memorizing: point === "C" };
}
function solve(s: AnchorState): AnchorState {
  const solved = [...new Set([...s.solved, s.phase])];
  if (s.phase === 4) return { ...s, solved, signalReady: true, memorizing: false, selected: undefined, input: [], revision: s.revision + 1, message: "Hylee : Je tiens ! Remerii : Je suis prête. Le signal est à vous." };
  return { ...s, phase: s.phase + 1, solved, errors: 0, selected: undefined, input: [], memorizing: false, revision: s.revision + 1, message: VOICES[s.phase + 1] };
}
export function anchorAction(s: AnchorState, action: number | "check" | "remember" | "signal"): AnchorState {
  if (s.result) return s;
  if (action === "signal") return s.signalReady ? { ...s, result: s.incidents ? "pressure" : "controlled", revision: s.revision + 1, message: "Vous abaissez la poignée. Les trois anneaux s’éteignent ; le portail reste rouge, très loin au-dessus des terrasses." } : s;
  const p = anchorPuzzle(s);
  if (s.selected === "A") {
    if (action === "check") return s.input.length === 3 && s.input.every((d,i) => d === p.directions[i]) ? solve(s) : error(s);
    if (typeof action === "number" && Number.isInteger(action) && action >= 0 && action < 3) return { ...s, input: s.input.map((d,i) => i === action ? (d+1)%4 : d) };
  }
  if (s.selected === "B" && typeof action === "number") return action === p.odd ? solve(s) : error(s);
  if (s.selected === "C") {
    if (action === "remember") return { ...s, memorizing: false, input: [] };
    if (s.memorizing || typeof action !== "number") return s;
    if (p.pulses[s.input.length] !== action) return error(s);
    const next = { ...s, input: [...s.input, action] };
    return next.input.length === 4 ? solve(next) : next;
  }
  return s;
}
export function validAnchorState(value: unknown): value is AnchorState {
  const s = value as AnchorState;
  if (!s || s.version !== 1 || !Number.isInteger(s.seed) || s.seed < 1 || !Number.isInteger(s.phase) || s.phase < 0 || s.phase > 4 || !Number.isInteger(s.incidents) || s.incidents < 0 || s.incidents > 2 || !Number.isInteger(s.errors) || s.errors < 0 || s.errors > 1 || !Array.isArray(s.solved) || !Array.isArray(s.input) || s.input.length > 4 || s.input.some(n => !Number.isInteger(n) || n < 0 || n > 3) || (s.selected && s.selected !== ANCHOR_TARGETS[s.phase]) || typeof s.message !== "string" || !Number.isInteger(s.revision) || typeof s.memorizing !== "boolean" || typeof s.signalReady !== "boolean" || (s.result && !["controlled","pressure","retreat"].includes(s.result))) return false;
  const completed = s.signalReady ? 5 : s.phase;
  if (s.solved.length !== completed || s.solved.some((n,i) => n !== i)) return false;
  if (s.signalReady && (s.phase !== 4 || s.selected)) return false;
  if (s.incidents === 2 && s.result !== "retreat") return false;
  if (s.result === "retreat" && s.incidents !== 2) return false;
  if (s.result === "controlled" && (!s.signalReady || s.incidents !== 0)) return false;
  if (s.result === "pressure" && (!s.signalReady || s.incidents !== 1)) return false;
  return true;
}
