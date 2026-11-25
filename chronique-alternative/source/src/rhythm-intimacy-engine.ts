/*
 * Jeu de rythme intime · moteur (Chronique Alternative, prototype).
 *
 * Module purement technique : carte de temps, fenêtres de justesse, score,
 * paliers et sauvegarde « Reprendre plus tard ». Les textes affichés vivent
 * dans rhythm-intimacy.ts (modifiables depuis le Studio). Ce module est exclu
 * de l'enveloppe Studio (voir SKIP_MODULES) parce que ses chaînes sont des
 * partitions, pas du texte.
 *
 * Carte écrite à la main, mesure par mesure, sur « intimate.mp3 » :
 * 129,5 BPM, premier temps à 0,019 s. Une mesure = 4 temps = 8 croches.
 *   .  silence            T  coup (toutes difficultés)
 *   t  coup (Normal, Intense)          *  coup (Intense seulement)
 *   H  appui long (début), suivi de « - » pour chaque croche tenue
 *   F  appui long final (l'apogée), suivi de « - »
 *   <  >  glissé (changement de position ou de cadence)
 */

export type RhythmDifficulty = "doux" | "normal" | "intense";
export type RhythmNoteKind = "tap" | "hold" | "slide" | "final";
export type RhythmJudgement = 0 | 1 | 2 | 3; // 0 : à jouer · 1 : Parfait · 2 : Bien · 3 : Raté
export type RhythmQuality = "embrasement" | "accord" | "tatonnement";

export type RhythmNote = {
  index: number;
  /** Temps de jeu en secondes (0 = premier temps de la carte). */
  time: number;
  /** Durée tenue (appuis longs), en secondes. */
  duration: number;
  kind: RhythmNoteKind;
  direction?: "left" | "right";
  section: number;
};

export type RhythmSectionDef = { id: string; bars: string[] };

export const RHYTHM_BPM = 129.5;
export const RHYTHM_BEAT = 60 / RHYTHM_BPM;
export const RHYTHM_TRACK = "intimate";
/** Premier temps de la carte dans la musique : temps n° 108 du morceau. */
export const RHYTHM_SONG_START = 0.0193 + 108 * RHYTHM_BEAT;
/** Décompte avant la première note (deux mesures de musique). */
export const RHYTHM_LEAD_IN = 8 * RHYTHM_BEAT;

export const RHYTHM_SECTIONS: RhythmSectionDef[] = [
  { id: "lente", bars: [
    "T...T...", "H---T...", "T...T...", "H-------", "T...T...",
    "H---t...", "T...T...", "H-------", "T.t.T...", "H---T...",
  ] },
  { id: "dos", bars: [
    ">...T.T.", "T.T.H---", "T.t.T.t.", "H---T.T.", "T.T.T.t.",
    "H-------", "T.t.T.t.", "T.T.H---", "T.t.T.t.", "H---T...",
  ] },
  { id: "renversee", bars: [
    "<...T.T.", "T.T.T.t*", "T.T.H---", "T*T*T.T.", "T.T.T.T.", "H---T*T*",
    "T.T.T.t*", "T*T*H---", "T.T.T*T*", "T*T*T*T*", "H---T...",
  ] },
  { id: "face", bars: [
    ">...T.T.", "T*T*T*T*", "T.T.T*T*", "H---T*T*", "T*T*T*T*",
    "TtTtTtTt", "T*T*T*T*", "TtTtH---", "F-------", "-------.",
  ] },
];

export const RHYTHM_DIFFICULTIES: Record<RhythmDifficulty, { label: string; perfect: number; good: number; approach: number }> = {
  doux: { label: "Doux", perfect: 0.085, good: 0.17, approach: 1.7 },
  normal: { label: "Normal", perfect: 0.065, good: 0.135, approach: 1.35 },
  intense: { label: "Intense", perfect: 0.045, good: 0.1, approach: 1.05 },
};

const STEP = RHYTHM_BEAT / 2;

export function buildRhythmChart(difficulty: RhythmDifficulty): RhythmNote[] {
  const notes: RhythmNote[] = [];
  let step = 0;
  let open: RhythmNote | undefined;
  RHYTHM_SECTIONS.forEach((section, sectionIndex) => {
    for (const bar of section.bars) {
      for (const char of bar) {
        const time = step * STEP;
        if (char === "-") {
          if (open) open.duration = time + STEP - open.time;
        } else {
          open = undefined;
          const keep = char === "T" || char === "H" || char === "F" || char === "<" || char === ">"
            || (char === "t" && difficulty !== "doux")
            || (char === "*" && difficulty === "intense");
          if (keep) {
            const note: RhythmNote = {
              index: notes.length,
              time,
              duration: 0,
              kind: char === "H" ? "hold" : char === "F" ? "final" : char === "<" || char === ">" ? "slide" : "tap",
              section: sectionIndex,
            };
            if (char === "<") note.direction = "left";
            if (char === ">") note.direction = "right";
            if (char === "H" || char === "F") { note.duration = STEP; open = note; }
            notes.push(note);
          }
        }
        step++;
      }
    }
  });
  return notes;
}

export function rhythmSectionStart(sectionIndex: number): number {
  let bars = 0;
  for (let i = 0; i < sectionIndex; i++) bars += RHYTHM_SECTIONS[i].bars.length;
  return bars * 8 * STEP;
}

export function rhythmChartEnd(): number {
  return RHYTHM_SECTIONS.reduce((total, section) => total + section.bars.length, 0) * 8 * STEP;
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
  v: 1;
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
    if (!entry || entry.v !== 1 || !Array.isArray(entry.judgements)) return undefined;
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
export type RhythmPrefs = { difficulty: RhythmDifficulty; auto: boolean; offsetMs: number };
export function loadRhythmPrefs(): RhythmPrefs {
  try {
    const raw = JSON.parse(globalThis.localStorage?.getItem(RHYTHM_PREFS_KEY) || "{}");
    return {
      difficulty: (["doux", "normal", "intense"] as const).includes(raw.difficulty) ? raw.difficulty : "normal",
      auto: Boolean(raw.auto),
      offsetMs: Number.isFinite(raw.offsetMs) ? Math.max(-200, Math.min(200, raw.offsetMs)) : 0,
    };
  } catch { return { difficulty: "normal", auto: false, offsetMs: 0 }; }
}
export function storeRhythmPrefs(prefs: RhythmPrefs) {
  try { globalThis.localStorage?.setItem(RHYTHM_PREFS_KEY, JSON.stringify(prefs)); } catch { /* ignoré */ }
}
