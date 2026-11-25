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
 *
 * Avant la pénétration, trois phases préliminaires gardent ce même principe,
 * chacune avec son geste et sa cadence propres (voir RHYTHM_SECTIONS) : la main
 * d'Hylee (va-et-vient alternés haut/bas et longues caresses tenues), sa bouche
 * (coups légers et tenues profondes) puis la langue du joueur (motif irrégulier
 * mais répété, taps légers et glissés). Combo et jauge sont partagés.
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
  /** Sens du geste pour les caresses (va-et-vient alternés) : la tête de note l'indique. */
  motion?: "haut" | "bas";
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
  /** Sens de la secousse à chaque coup : de haut en bas (elle mène, renversée) ou en profondeur (de dos, face à face). */
  shake: RhythmShakeAxis;
  /** Geste de la phase : il choisit l'animation du sprite et les bruitages. */
  gesture: RhythmGesture;
  /**
   * Motif rejoué en boucle à la place des coups réguliers (phases préliminaires) :
   * chaque pas dure « beats » battements avant le pas suivant ; une tenue dure tout son pas.
   */
  motif?: RhythmMotifStep[];
};
export type RhythmShakeAxis = "vertical" | "profondeur";
export type RhythmGesture = "main" | "bouche" | "langue" | "penetration";
export type RhythmMotifStep = { kind: "tap" | "hold" | "slide"; beats: number; motion?: "haut" | "bas"; direction?: "left" | "right" };

export const RHYTHM_TRACK = "intimate";
/** Décompte avant le premier coup, en secondes. */
export const RHYTHM_LEAD_IN = 3;

const T = (beats = 1, motion?: "haut" | "bas"): RhythmMotifStep => ({ kind: "tap", beats, ...(motion ? { motion } : {}) });
const HOLD = (beats: number, motion?: "haut" | "bas"): RhythmMotifStep => ({ kind: "hold", beats, ...(motion ? { motion } : {}) });
const SL = (direction: "left" | "right", beats = 1): RhythmMotifStep => ({ kind: "slide", beats, direction });

export const RHYTHM_SECTIONS: RhythmSectionDef[] = [
  // Sa main : va-et-vient réguliers, haut puis bas, et une longue caresse tenue à la fin de chaque motif.
  { id: "main", bpm: 64, strokes: 21, holds: [], holdBeats: 2, shake: "vertical", gesture: "main",
    motif: [T(1, "haut"), T(1, "bas"), T(1, "haut"), T(1, "bas"), T(1, "haut"), T(1, "bas"), HOLD(2, "haut")] },
  // Sa bouche : deux coups légers, une tenue profonde, en boucle.
  { id: "bouche", bpm: 72, strokes: 18, holds: [], holdBeats: 2, slide: "left", shake: "vertical", gesture: "bouche",
    motif: [T(), T(), HOLD(2), T(), T(), T(), HOLD(2)] },
  // Votre langue : un motif irrégulier mais toujours le même (court, court, long), avec des glissés de côté.
  { id: "langue", bpm: 84, strokes: 24, holds: [], holdBeats: 2, slide: "right", shake: "vertical", gesture: "langue",
    motif: [T(1), T(0.5), T(1.5), SL("left"), T(0.5), T(0.5), SL("right"), T(1.5)] },
  { id: "lente", bpm: 56, strokes: 14, holds: [5, 11], holdBeats: 2, slide: "left", shake: "vertical", gesture: "penetration" },
  { id: "dos", bpm: 76, strokes: 20, holds: [9, 16], holdBeats: 2, slide: "right", shake: "profondeur", gesture: "penetration" },
  { id: "renversee", bpm: 98, strokes: 28, holds: [13, 23], holdBeats: 2, slide: "left", shake: "vertical", gesture: "penetration" },
  { id: "face", bpm: 122, strokes: 24, holds: [], holdBeats: 2, slide: "right", ramp: { strokes: 12, toBpm: 150, final: 3.2 }, shake: "profondeur", gesture: "penetration" },
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
    if (section.motif) {
      const motif = section.motif;
      for (let i = 0; i < section.strokes; i++) {
        const step = motif[i % motif.length];
        if (i > 0) time += motif[(i - 1) % motif.length].beats * beat;
        const extra = { ...(step.motion ? { motion: step.motion } : {}), ...(step.direction ? { direction: step.direction } : {}) };
        push({ time, duration: step.kind === "hold" ? step.beats * beat : 0, kind: step.kind, section: sectionIndex, beat, ...extra });
      }
      // La phase suivante commence après la fin du dernier pas (une tenue est toujours menée à son terme).
      const last = motif[(section.strokes - 1) % motif.length];
      time += last.beats * beat;
      return;
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
  /** 3 : partie en sept phases (caresses, bouche, langue, puis les quatre positions). */
  v: 3;
  scene: string;
  difficulty: RhythmDifficulty;
  auto: boolean;
  offsetMs: number;
  time: number;
  judgements: RhythmJudgement[];
  combo: number;
  maxCombo: number;
  /** Bonus de jauge gagné aux paliers d'enchaînement (absent des sauvegardes plus anciennes). */
  bonus?: number;
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
export function rhythmGauge(judgements: RhythmJudgement[], bonus = 0): number {
  const max = judgements.length || 1;
  let points = 0;
  for (const j of judgements) points += JUDGEMENT_POINTS[j];
  const extra = Math.max(0, Math.min(RHYTHM_COMBO_BONUS_MAX, bonus));
  return Math.min(100, Math.round((points / max * 100 + extra) * 10) / 10);
}

/*
 * Enchaînements : chaque coup réussi allonge le combo, un raté le brise.
 * Paliers à 8, 16 et 24 coups, puis tous les 12. Chaque palier franchi déclenche
 * un gémissement d'Hylee, un battement particulier de l'interface et un petit
 * bonus de jauge (plafonné). Hors combo, on n'entend que des souffles.
 */
export const RHYTHM_COMBO_FIRST = [8, 16, 24] as const;
export const RHYTHM_COMBO_STEP = 12;
export const RHYTHM_COMBO_BONUS = 1.5;
export const RHYTHM_COMBO_BONUS_MAX = 9;
/** Nombre de paliers franchis pour un combo donné. */
export function rhythmComboTier(combo: number): number {
  const last = RHYTHM_COMBO_FIRST[RHYTHM_COMBO_FIRST.length - 1];
  let tier = RHYTHM_COMBO_FIRST.filter((n) => combo >= n).length;
  if (combo >= last) tier += Math.floor((combo - last) / RHYTHM_COMBO_STEP);
  return tier;
}
/** Intensité du combo, de 0 (pas de combo) à 3 (24 coups et plus). */
export function rhythmComboLevel(combo: number): number { return Math.min(3, rhythmComboTier(combo)); }
/** Vrai quand ce coup vient de franchir un palier. */
export function rhythmComboThreshold(combo: number): boolean { return combo > 0 && rhythmComboTier(combo) > rhythmComboTier(combo - 1); }

/*
 * Secousse à chaque coup réussi : une poussée brève dans le sens du va-et-vient,
 * puis un rebond qui s'amortit en un tiers de seconde. L'amplitude (en pixels)
 * monte avec l'ardeur et le combo, plus forte à l'apogée ; réduite au tiers en
 * « Effets réduits », nulle si l'option est coupée. Le plafond garde toujours
 * le sprite dans le cadre.
 */
export const RHYTHM_SHAKE_MAX = 18;
export const RHYTHM_SHAKE_DURATION = 0.34;
export function rhythmShakeAmplitude(ardour: number, comboLevel: number, apogee: boolean, prefs: Pick<RhythmPrefs, "effects" | "shake">): number {
  if (!prefs.shake) return 0;
  const raw = (3 + 8.5 * Math.max(0, Math.min(1, ardour)) + 1.8 * Math.max(0, Math.min(3, comboLevel))) * (apogee ? 1.3 : 1);
  return Math.min(RHYTHM_SHAKE_MAX, raw) * (prefs.effects === "plein" ? 1 : 0.3);
}
/** Forme de la secousse, de -1 à 1, s secondes après le coup : poussée, rebond, retour au repos. */
export function rhythmShakeWave(s: number): number {
  if (s < 0 || s >= RHYTHM_SHAKE_DURATION) return 0;
  return Math.sin(2 * Math.PI * s / 0.16) * Math.exp(-s / 0.09);
}

/*
 * Animation du sprite propre à chaque geste (aucune image nouvelle : transformations CSS seulement).
 * - main : léger étirement vertical en rythme, vers le haut sur « haut », petit retour sur « bas »,
 *   étirement maintenu pendant une caresse tenue ;
 * - bouche : hochement doux, descente et légère inclinaison alternée, la tête reste basse pendant une tenue ;
 * - langue : ondulation continue et cambrure à chaque coup, avec des frissons qui montent au fil de la phase ;
 * - penetration : la secousse (rhythmShakeWave) dans l'axe de la position.
 * Valeurs : y et x en pixels, stretch et scale en fraction de taille, tilt en degrés. Le plafond
 * en pixels (limit) et RHYTHM_STRETCH_MAX gardent toujours Hylee dans le cadre.
 */
export const RHYTHM_STRETCH_MAX = 0.022;
export const RHYTHM_TILT_MAX = 2.2;
export type RhythmMotion = { y: number; x: number; scale: number; stretch: number; tilt: number };
export function rhythmGestureMotion(input: {
  gesture: RhythmGesture; axis: RhythmShakeAxis; amp: number; sinceHit: number; beat: number; t: number;
  motion?: "haut" | "bas"; parity?: number; holdFrac?: number | null; progress?: number; ardour?: number; fx?: number;
}): RhythmMotion {
  const { gesture, axis, amp, sinceHit, beat, t } = input;
  const unit = Math.max(0, Math.min(1, amp / RHYTHM_SHAKE_MAX));
  const fx = input.fx ?? 1;
  const span = Math.max(0.2, beat * 0.9);
  const env = sinceHit >= 0 && sinceHit < span ? Math.sin(Math.PI * sinceHit / span) : 0;
  const held = input.holdFrac != null && input.holdFrac >= 0;
  const zero: RhythmMotion = { y: 0, x: 0, scale: 0, stretch: 0, tilt: 0 };
  if (amp <= 0) return zero;
  if (gesture === "main") {
    const k = RHYTHM_STRETCH_MAX * (0.45 + 0.55 * unit);
    const stretch = held ? k * Math.min(1, 0.4 + input.holdFrac! * 1.2) : k * env * (input.motion === "bas" ? -0.45 : 1);
    return { ...zero, stretch: Math.max(-RHYTHM_STRETCH_MAX, Math.min(RHYTHM_STRETCH_MAX, stretch)), y: -stretch * 40 };
  }
  if (gesture === "bouche") {
    const sign = (input.parity ?? 0) % 2 ? -1 : 1;
    if (held) return { ...zero, y: amp * 0.85, tilt: sign * RHYTHM_TILT_MAX * 0.35 * unit * Math.sin(Math.PI * 2 * input.holdFrac!), stretch: -0.006 * unit };
    return { ...zero, y: amp * 0.8 * env, tilt: sign * RHYTHM_TILT_MAX * 0.7 * (0.4 + 0.6 * unit) * env };
  }
  if (gesture === "langue") {
    const ardour = Math.max(0, Math.min(1, input.ardour ?? unit));
    const progress = Math.max(0, Math.min(1, input.progress ?? 0));
    const wave = Math.sin(2 * Math.PI * t / (beat * 2.5));
    const shiver = (0.4 + 2.2 * progress * (0.4 + 0.6 * ardour)) * fx * Math.sin(2 * Math.PI * 15 * t);
    return { y: -amp * 0.5 * env, x: 3.5 * fx * wave + shiver, scale: 0, stretch: -0.012 * (0.5 + 0.5 * unit) * env, tilt: (0.6 + 0.9 * ardour) * fx * wave };
  }
  const px = amp * rhythmShakeWave(sinceHit);
  const depth = axis === "profondeur";
  return { ...zero, y: depth ? px * 0.35 : px, scale: depth ? px * 0.0016 : 0 };
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
    if (!entry || entry.v !== 3 || !Array.isArray(entry.judgements)) return undefined;
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
  /** Secousse de l'image à chaque coup (réduite avec les effets réduits). */
  shake: boolean;
};
const clamp01 = (value: unknown, fallback: number) => (typeof value === "number" && Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : fallback);
export function defaultRhythmPrefs(): RhythmPrefs {
  let reduced = false;
  try { reduced = Boolean(globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches); } catch { reduced = false; }
  return { difficulty: "normal", auto: false, offsetMs: 0, musicVolume: 0.35, sfx: true, sfxVolume: 0.85, effects: reduced ? "reduit" : "plein", zoom: !reduced, vibration: true, shake: true };
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
      shake: typeof raw.shake === "boolean" ? raw.shake : base.shake,
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
