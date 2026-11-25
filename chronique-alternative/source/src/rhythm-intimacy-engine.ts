/*
 * Jeu de rythme intime · moteur (Chronique Alternative, prototype).
 *
 * Module purement technique : cadence, fenêtres de justesse, score, paliers et
 * sauvegarde « Reprendre plus tard ». Les textes affichés vivent dans
 * rhythm-intimacy.ts (modifiables depuis le Studio). Ce module est exclu de
 * l'enveloppe Studio (voir SKIP_MODULES) parce que ses chaînes sont techniques.
 *
 * La cadence suit les va-et-vient, pas la musique : un coup par battement, un
 * tempo stable dans chaque position, puis une accélération par paliers d'une
 * position à l'autre (lent et profond, plus vif, rapide, jusqu'au bout).
 * Quelques appuis longs demandent de rester au fond pendant un ou deux
 * battements, sans jamais casser la pulsation : le coup suivant tombe
 * exactement sur le battement d'après. Un glissé marque chaque changement de
 * position, puis la dernière position accélère vers l'apogée (appui final).
 * La musique intime reste en fond, à volume réglable, sans aucun calage.
 */

export type RhythmDifficulty = "doux" | "normal" | "intense";
export type RhythmNoteKind = "tap" | "hold" | "slide" | "final";
export type RhythmJudgement = 0 | 1 | 2 | 3; // 0 : à jouer · 1 : Parfait · 2 : Bien · 3 : Raté
export type RhythmQuality = "embrasement" | "accord" | "tatonnement";

export type RhythmNote = {
  index: number;
  /** Temps de jeu en secondes (0 = premier coup). */
  time: number;
  /** Durée tenue (appuis longs), en secondes. */
  duration: number;
  kind: RhythmNoteKind;
  direction?: "left" | "right";
  section: number;
  /** Intervalle entre deux coups à cet endroit (secondes) : sert aux effets en rythme. */
  beat: number;
};

export type RhythmSectionDef = {
  id: string;
  /** Coups par minute dans cette position (Normal). */
  bpm: number;
  /** Nombre de battements joués (coups et appuis longs confondus). */
  strokes: number;
  /** Battements (index dans la position) où l'on reste au fond, et combien de battements dure l'appui. */
  holds: number[];
  holdBeats: number;
  /** Glissé de changement de position, un battement avant le premier coup. */
  slide?: "left" | "right";
  /** Montée finale : coups supplémentaires dont le tempo grimpe jusqu'à toBpm, puis l'appui de l'apogée. */
  ramp?: { strokes: number; toBpm: number; final: number };
};

export const RHYTHM_TRACK = "intimate";
/** Décompte avant le premier coup, en secondes. */
export const RHYTHM_LEAD_IN = 3;

export const RHYTHM_SECTIONS: RhythmSectionDef[] = [
  { id: "lente", bpm: 56, strokes: 14, holds: [5, 11], holdBeats: 2 },
  { id: "dos", bpm: 76, strokes: 20, holds: [9, 16], holdBeats: 2, slide: "right" },
  { id: "renversee", bpm: 98, strokes: 28, holds: [13, 23], holdBeats: 2, slide: "left" },
  { id: "face", bpm: 122, strokes: 24, holds: [], holdBeats: 2, slide: "right", ramp: { strokes: 12, toBpm: 150, final: 3.2 } },
];

/** Les difficultés jouent la même cadence (un coup par battement) : seuls le tempo et la tolérance changent. */
export const RHYTHM_DIFFICULTIES: Record<RhythmDifficulty, { label: string; perfect: number; good: number; approach: number; tempo: number }> = {
  doux: { label: "Doux", perfect: 0.085, good: 0.17, approach: 1.9, tempo: 0.85 },
  normal: { label: "Normal", perfect: 0.065, good: 0.135, approach: 1.5, tempo: 1 },
  intense: { label: "Intense", perfect: 0.048, good: 0.105, approach: 1.15, tempo: 1.12 },
};

export function buildRhythmChart(difficulty: RhythmDifficulty): RhythmNote[] {
  const factor = RHYTHM_DIFFICULTIES[difficulty].tempo;
  const notes: RhythmNote[] = [];
  let time = 0;
  const push = (note: Omit<RhythmNote, "index">) => { notes.push({ index: notes.length, ...note }); };
  RHYTHM_SECTIONS.forEach((section, sectionIndex) => {
    const beat = 60 / (section.bpm * factor);
    if (section.slide) {
      // Le dernier coup de la position précédente est suivi de deux battements au nouveau tempo, le glissé tombe sur le premier.
      time += beat;
      push({ time, duration: 0, kind: "slide", direction: section.slide, section: sectionIndex, beat });
      time += beat;
    }
    for (let i = 0; i < section.strokes; i++) {
      if (i > 0 || section.slide) time += i === 0 ? 0 : beat;
      if (section.holds.includes(i)) {
        push({ time, duration: beat * section.holdBeats, kind: "hold", section: sectionIndex, beat });
        time += beat * (section.holdBeats - 1);
      } else push({ time, duration: 0, kind: "tap", section: sectionIndex, beat });
    }
    if (section.ramp) {
      const { strokes, toBpm, final } = section.ramp;
      for (let i = 1; i <= strokes; i++) {
        const bpm = section.bpm + (toBpm - section.bpm) * (i / strokes);
        const step = 60 / (bpm * factor);
        time += step;
        push({ time, duration: 0, kind: "tap", section: sectionIndex, beat: step });
      }
      const step = 60 / (toBpm * factor);
      time += step;
      push({ time, duration: final, kind: "final", section: sectionIndex, beat: step });
    }
  });
  return notes;
}

const chartCache = new Map<RhythmDifficulty, RhythmNote[]>();
function cachedChart(difficulty: RhythmDifficulty) {
  if (!chartCache.has(difficulty)) chartCache.set(difficulty, buildRhythmChart(difficulty));
  return chartCache.get(difficulty)!;
}

export function rhythmSectionStart(sectionIndex: number, difficulty: RhythmDifficulty = "normal"): number {
  const first = cachedChart(difficulty).find((note) => note.section === sectionIndex);
  return first ? first.time : 0;
}

export function rhythmChartEnd(difficulty: RhythmDifficulty = "normal"): number {
  const last = cachedChart(difficulty).at(-1)!;
  return last.time + last.duration;
}

/** Tempo courant (battement en secondes) au temps t : sert aux pulsations d'interface et au décompte. */
export function rhythmBeatAt(t: number, difficulty: RhythmDifficulty = "normal"): number {
  const chart = cachedChart(difficulty);
  let beat = chart[0].beat;
  for (const note of chart) { if (note.time > t) break; beat = note.beat; }
  return beat;
}

export function judgeOffset(delta: number, difficulty: RhythmDifficulty): RhythmJudgement {
  const windows = RHYTHM_DIFFICULTIES[difficulty];
  const abs = Math.abs(delta);
  if (abs <= windows.perfect) return 1;
  if (abs <= windows.good) return 2;
  return 0;
}

export const JUDGEMENT_POINTS: Record<RhythmJudgement, number> = { 0: 0, 1: 1, 2: 0.6, 3: 0 };

export type RhythmSaveState = {
  v: 2;
  scene: string;
  difficulty: RhythmDifficulty;
  auto: boolean;
  offsetMs: number;
  time: number;
  judgements: RhythmJudgement[];
  combo: number;
  maxCombo: number;
  unlocked: string[];
  teases: number[];
  savedAt: number;
};

export type RhythmScore = { perfect: number; good: number; miss: number; total: number; points: number; accuracy: number };

export function rhythmScore(judgements: RhythmJudgement[]): RhythmScore {
  let perfect = 0, good = 0, miss = 0, points = 0;
  for (const j of judgements) {
    if (j === 1) perfect++;
    else if (j === 2) good++;
    else if (j === 3) miss++;
    points += JUDGEMENT_POINTS[j];
  }
  const judged = perfect + good + miss;
  return { perfect, good, miss, total: judgements.length, points, accuracy: judged ? points / judged : 0 };
}

/** Jauge de plaisir (0 à 100) : elle ne fait que monter, un raté ne la vide jamais. */
export function rhythmGauge(judgements: RhythmJudgement[]): number {
  const max = judgements.length || 1;
  let points = 0;
  for (const j of judgements) points += JUDGEMENT_POINTS[j];
  return Math.min(100, Math.round(points / max * 1000) / 10);
}

/** Paliers d'une section : un quart, la moitié puis les trois quarts des notes jouées, avec une justesse suffisante. */
export const RHYTHM_TIER_RULES = [
  { progress: 0.22, accuracy: 0.45 },
  { progress: 0.5, accuracy: 0.62 },
  { progress: 0.75, accuracy: 0.78 },
];

export function sectionTiersReached(notes: RhythmNote[], judgements: RhythmJudgement[], section: number): number {
  const own = notes.filter((note) => note.section === section);
  if (!own.length) return 0;
  const judged = own.filter((note) => judgements[note.index] !== 0);
  const progress = judged.length / own.length;
  const points = judged.reduce((sum, note) => sum + JUDGEMENT_POINTS[judgements[note.index]], 0);
  const accuracy = judged.length ? points / judged.length : 0;
  let tiers = 0;
  RHYTHM_TIER_RULES.forEach((rule, index) => { if (progress >= rule.progress && accuracy >= rule.accuracy) tiers = index + 1; });
  return tiers;
}

export function rhythmQuality(judgements: RhythmJudgement[]): RhythmQuality {
  const { accuracy } = rhythmScore(judgements);
  if (accuracy >= 0.85) return "embrasement";
  if (accuracy >= 0.6) return "accord";
  return "tatonnement";
}

export const RHYTHM_STORAGE_KEY = "sylvinia_ca_rythme_v1";

export function loadRhythmSave(scene: string, storage: Pick<Storage, "getItem"> | undefined = globalThis.localStorage): RhythmSaveState | undefined {
  try {
    const all = JSON.parse(storage?.getItem(RHYTHM_STORAGE_KEY) || "{}") as Record<string, RhythmSaveState>;
    const entry = all[scene];
    if (!entry || entry.v !== 2 || !Array.isArray(entry.judgements)) return undefined;
    if (entry.judgements.length !== buildRhythmChart(entry.difficulty).length) return undefined;
    return entry;
  } catch { return undefined; }
}

export function storeRhythmSave(state: RhythmSaveState | undefined, scene: string, storage: Pick<Storage, "getItem" | "setItem"> | undefined = globalThis.localStorage) {
  try {
    const all = JSON.parse(storage?.getItem(RHYTHM_STORAGE_KEY) || "{}") as Record<string, RhythmSaveState>;
    if (state) all[scene] = state; else delete all[scene];
    storage?.setItem(RHYTHM_STORAGE_KEY, JSON.stringify(all));
  } catch { /* stockage indisponible : la partie continue sans sauvegarde */ }
}

export const RHYTHM_PREFS_KEY = "sylvinia_ca_rythme_prefs_v1";
export type RhythmEffects = "plein" | "reduit";
export type RhythmPrefs = {
  difficulty: RhythmDifficulty; auto: boolean; offsetMs: number;
  /** Musique de fond (0 à 1, relatif au volume général). */
  musicVolume: number;
  /** Bruitages : interrupteur et volume (0 à 1). */
  sfx: boolean; sfxVolume: number;
  /** Réactions de l'interface : pleines ou réduites, zoom de l'image en rythme, vibration du téléphone. */
  effects: RhythmEffects; zoom: boolean; vibration: boolean;
};
const clamp01 = (value: unknown, fallback: number) => (typeof value === "number" && Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : fallback);
export function defaultRhythmPrefs(): RhythmPrefs {
  let reduced = false;
  try { reduced = Boolean(globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches); } catch { reduced = false; }
  return { difficulty: "normal", auto: false, offsetMs: 0, musicVolume: 0.35, sfx: true, sfxVolume: 0.85, effects: reduced ? "reduit" : "plein", zoom: !reduced, vibration: true };
}
export function loadRhythmPrefs(): RhythmPrefs {
  const base = defaultRhythmPrefs();
  try {
    const raw = JSON.parse(globalThis.localStorage?.getItem(RHYTHM_PREFS_KEY) || "{}");
    return {
      difficulty: (["doux", "normal", "intense"] as const).includes(raw.difficulty) ? raw.difficulty : base.difficulty,
      auto: Boolean(raw.auto),
      offsetMs: Number.isFinite(raw.offsetMs) ? Math.max(-200, Math.min(200, raw.offsetMs)) : 0,
      musicVolume: clamp01(raw.musicVolume, base.musicVolume),
      sfx: typeof raw.sfx === "boolean" ? raw.sfx : base.sfx,
      sfxVolume: clamp01(raw.sfxVolume, base.sfxVolume),
      effects: raw.effects === "reduit" || raw.effects === "plein" ? raw.effects : base.effects,
      zoom: typeof raw.zoom === "boolean" ? raw.zoom : base.zoom,
      vibration: typeof raw.vibration === "boolean" ? raw.vibration : base.vibration,
    };
  } catch { return base; }
}
export function storeRhythmPrefs(prefs: RhythmPrefs) {
  try { globalThis.localStorage?.setItem(RHYTHM_PREFS_KEY, JSON.stringify(prefs)); } catch { /* ignoré */ }
}

/** Ardeur de l'interface (0 à 1) : suit la jauge de plaisir, culmine à l'apogée. */
export function rhythmArdour(gauge: number, apogee: boolean): number {
  if (apogee) return 1;
  return Math.max(0, Math.min(1, gauge / 88));
}
