import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { DialogueLine } from "./game-data";
import type { RhythmSceneText } from "./rhythm-intimacy";
import {
  RHYTHM_DIFFICULTIES, RHYTHM_LEAD_IN, RHYTHM_SECTIONS, RHYTHM_TRACK,
  RHYTHM_COMBO_BONUS, RHYTHM_COMBO_BONUS_MAX, RHYTHM_SHAKE_MAX,
  buildRhythmChart, judgeOffset, loadRhythmPrefs, loadRhythmSave, rhythmArdour, rhythmBeatAt, rhythmChartEnd, rhythmComboLevel, rhythmComboThreshold, rhythmComboTier,
  rhythmGauge, rhythmGestureMotion, rhythmQuality, rhythmScore, rhythmShakeAmplitude, rhythmShakeWave,
  rhythmSectionStart, sectionTiersReached, storeRhythmPrefs, storeRhythmSave,
  RHYTHM_BUSES, type RhythmBus, isRhythmTrap, rhythmChartSignature, rhythmResistance, type RhythmResistance,
  type RhythmDifficulty, type RhythmJudgement, type RhythmNote, type RhythmPrefs, type RhythmQuality, type RhythmSaveState,
} from "./rhythm-intimacy-engine";
import { RhythmSfx } from "./rhythm-intimacy-sfx";
import type { RhythmKit } from "./rhythm-anchors";
import { RHYTHM_TRAP_LABELS } from "./rhythm-bubbles";

/** Évènement écouté par la page : coupe la piste d'ambiance pendant que le jeu joue sa propre musique de fond. */
export const RHYTHM_DUCK_EVENT = "sylvinia:rythme-duck";

export type RhythmResult = { quality: RhythmQuality; perfect: number; good: number; miss: number; accuracy: number; maxCombo: number; auto: boolean; resistance?: RhythmResistance };

type Phase = "setup" | "countdown" | "play" | "paused" | "result";
type Caption = { id: string; line: DialogueLine; until: number; kind: "intro" | "tier" | "tease" };
type Flash = { id: number; label: string; kind: "parfait" | "bien" | "rate" | "palier" };
type Bubble = { id: string; line: DialogueLine; until: number };

const JUDGE_LABEL: Record<1 | 2 | 3, Flash["kind"]> = { 1: "parfait", 2: "bien", 3: "rate" };
const JUDGE_TEXT: Record<1 | 2 | 3, string> = { 1: "Parfait", 2: "Bien", 3: "Raté" };
const ROMAN = ["", "I", "II", "III"];
const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

function fmt(seconds: number) {
  const s = Math.max(0, Math.round(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/** Les coups d'une position où apparaissent les lignes courtes (narration) et les répliques d'Hylee, réparties sur la position. */
function cuePositions(strokes: number, count: number, shift: number) {
  return Array.from({ length: count }, (_, i) => Math.max(1, Math.round(((i + shift) / count) * strokes)));
}

export function RhythmIntimacyGame({ scene, saveKey, music, volume, format, onMood, onFinish, onSkip, onLeave, kit, relationNote }: {
  scene: RhythmSceneText;
  /** Fiche personnage (lot 0) : partition tirée de la scène écrite, pièges, voix et palette. Absente : prototype de Hylee, inchangé. */
  kit?: RhythmKit;
  /** Mention de baisse de relation au bilan (Chronique seulement), si la fin est « tâtonnement ». */
  relationNote?: string;
  saveKey: string;
  music: boolean;
  volume: number;
  format: (text: string) => string;
  onMood?: (mood: string) => void;
  onFinish: (result: RhythmResult) => void;
  onSkip: () => void;
  onLeave: () => void;
}) {
  const [prefs, setPrefs] = useState<RhythmPrefs>(loadRhythmPrefs);
  const defs = kit?.sections || RHYTHM_SECTIONS;
  const chartFor = (level: RhythmDifficulty) => (kit ? buildRhythmChart(level, defs) : buildRhythmChart(level));
  const [saved, setSaved] = useState<RhythmSaveState | undefined>(() => (kit ? loadRhythmSave(saveKey, undefined, defs) : loadRhythmSave(saveKey)));
  const [phase, setPhase] = useState<Phase>("setup");
  const [, setFrame] = useState(0);
  const [result, setResult] = useState<RhythmResult | null>(null);

  // Hylee (prototype) garde le choix commun ; chaque fiche a le sien, la difficulté recommandée par défaut.
  const difficulty: RhythmDifficulty = kit ? (prefs.difficultyBy?.[kit.character] || kit.profile.difficulty) : prefs.difficulty;
  const difficultyRef = useRef(difficulty);
  difficultyRef.current = difficulty;
  const prefsRef = useRef(prefs);
  prefsRef.current = prefs;
  const notesRef = useRef<RhythmNote[]>(chartFor(difficulty));
  const judgementsRef = useRef<RhythmJudgement[]>([]);
  const timeRef = useRef(-RHYTHM_LEAD_IN);
  const clockRef = useRef<{ perfStart: number; base: number }>({ perfStart: 0, base: 0 });
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sfxRef = useRef<RhythmSfx | null>(null);
  const layerRef = useRef<HTMLDivElement | null>(null);
  const holdRef = useRef<{ note: RhythmNote; judgement: RhythmJudgement; source?: string } | null>(null);
  const teaseRef = useRef<Bubble | null>(null);
  const voiceRef = useRef<Bubble | null>(null);
  const strokeLineRef = useRef<Bubble | null>(null);
  const comboRef = useRef(0);
  const maxComboRef = useRef(0);
  /** Bonus de jauge gagné aux paliers d'enchaînement, et dernier palier franchi (pour le battement particulier). */
  const bonusRef = useRef(0);
  const comboEventRef = useRef<{ id: number; at: number; combo: number; level: number; t: number } | null>(null);
  const comboEventsRef = useRef<{ combo: number; level: number; t: number; moan: boolean }[]>([]);
  type GestureStats = { samples: number; moving: number; y: number; x: number; stretch: number; tilt: number };
  const shakeRef = useRef<{ peak: number; peakSprite: number; samples: number; gestures: Record<string, GestureStats> }>({ peak: 0, peakSprite: 0, samples: 0, gestures: {} });
  const unlockedRef = useRef<Set<string>>(new Set());
  const teasesRef = useRef<number[]>([]);
  const lastTeaseRef = useRef(-99);
  const captionsRef = useRef<Caption[]>([]);
  const captionRef = useRef<Caption | null>(null);
  const flashRef = useRef<Flash | null>(null);
  const flashSeq = useRef(0);
  const hitRef = useRef<{ id: number; at: number; perfect: boolean; note?: RhythmNote } | null>(null);
  const missRef = useRef<{ id: number; at: number } | null>(null);
  const autoRef = useRef(prefs.auto);
  const offsetRef = useRef(prefs.offsetMs / 1000);
  const apogeeRef = useRef(false);
  const apogeeAtRef = useRef(0);
  const sectionRef = useRef(-1);
  const lastSaveRef = useRef(0);
  const countdownRef = useRef<{ start: number; from: number } | null>(null);
  const pointerRef = useRef<{ id: number; x: number; y: number; t: number; slid: boolean } | null>(null);
  const phaseRef = useRef<Phase>("setup");
  /** Pièges (fiches) : silence en cours rompu, dernière bulle de piège, annonce d'aura déjà faite, phrases du texte déjà montrées. */
  const edgeTouchedRef = useRef<Set<number>>(new Set());
  const trapFlashRef = useRef<{ id: number; at: number; kind: "resiste" | "cede" | "bord" } | null>(null);
  const auraCuedRef = useRef<Set<number>>(new Set());
  phaseRef.current = phase;
  autoRef.current = prefs.auto;
  offsetRef.current = prefs.offsetMs / 1000;

  const chartEnd = useMemo(() => (kit ? rhythmChartEnd(difficulty, defs) : rhythmChartEnd(difficulty)), [difficulty]); // eslint-disable-line react-hooks/exhaustive-deps

  const updatePrefs = (patch: Partial<RhythmPrefs>) => setPrefs((current) => { const next = { ...current, ...patch }; storeRhythmPrefs(next); return next; });
  const setDifficulty = (level: RhythmDifficulty) => (kit ? updatePrefs({ difficultyBy: { ...(prefsRef.current.difficultyBy || {}), [kit.character]: level } }) : updatePrefs({ difficulty: level }));
  const captionMax = kit?.profile.captionMaxMs || 7000;
  // Noms des pièges : ceux du personnage s'il en a (les ordres de Lineva), sinon les noms communs.
  const labels = { ...RHYTHM_TRAP_LABELS, ...(kit?.bubbles.trapLabels || {}) };

  /* ---------- horloge : celle du navigateur, la cadence ne dépend d'aucune musique ---------- */
  const now = useCallback(() => {
    const { perfStart, base } = clockRef.current;
    return base + (performance.now() - perfStart) / 1000;
  }, []);

  const suggestive = Boolean(scene.suggestive);
  // Fiche personnage : sa banque de voix (une seule voix par personnage) ; Hylee garde la sienne.
  const sfx = () => { if (!sfxRef.current) sfxRef.current = kit ? new RhythmSfx({ suggestive, voice: kit.profile.voice, ...(kit.profile.voices ? { voices: kit.profile.voices.map((entry) => entry.bank) } : {}) }) : new RhythmSfx({ suggestive }); return sfxRef.current; };
  const musicVolume = () => (prefsRef.current.mute.musique ? 0 : clamp01(volume) * prefsRef.current.musicVolume);
  const duck = (on: boolean) => window.dispatchEvent(new CustomEvent(RHYTHM_DUCK_EVENT, { detail: on }));

  useEffect(() => () => {
    // Fermeture de la scène en pleine partie : l'état est conservé pour « Reprendre plus tard ».
    if (phaseRef.current === "play" || phaseRef.current === "paused") { if (phaseRef.current === "play") stopClock(); persist(); }
    duck(false);
    audioRef.current?.pause();
    sfxRef.current?.close();
    const host = layerRef.current?.parentElement;
    ["--rythme-zoom", "--rythme-secousse-y", "--rythme-secousse-x", "--rythme-secousse-s", "--rythme-etire", "--rythme-incline"].forEach((name) => host?.style.removeProperty(name));
    if (host) delete host.dataset.rythmeGeste;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = musicVolume();
    // Musique remise en route pendant la partie si on la réactive depuis le mixage.
    if (phaseRef.current === "play" && music && musicVolume() > 0 && audio.paused) audio.play().catch(() => undefined);
  }, [volume, prefs.musicVolume, prefs.mute.musique]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { sfxRef.current?.setVolume(prefs.sfxVolume, prefs.sfx); }, [prefs.sfx, prefs.sfxVolume]);
  useEffect(() => { sfxRef.current?.setMix(prefs.mix, prefs.mute, prefs.neutral); }, [prefs.mix, prefs.mute, prefs.neutral]);

  /** Musique intime en fond, en boucle et sans calage : elle habille la scène, la cadence vient des corps. */
  function startMusic() {
    if (!music || musicVolume() <= 0) { audioRef.current?.pause(); return; }
    let audio = audioRef.current;
    if (!audio) {
      audio = new Audio(`/assets/audio/${RHYTHM_TRACK}.mp3`);
      audio.preload = "auto";
      audio.loop = true;
      audioRef.current = audio;
    }
    audio.volume = musicVolume();
    duck(true);
    audio.play().catch(() => { /* lecture bloquée : le jeu continue sans musique */ });
  }

  function startClock(at: number) {
    timeRef.current = at;
    clockRef.current = { perfStart: performance.now(), base: at };
    startMusic();
  }

  function stopClock() {
    timeRef.current = now();
    audioRef.current?.pause();
    sfxRef.current?.stopAll();
  }

  /* ---------- sauvegarde ---------- */
  function snapshot(): RhythmSaveState {
    return {
      ...(kit ? { v: 4 as const, sig: rhythmChartSignature(notesRef.current) } : { v: 3 as const }), scene: scene.id, difficulty: difficultyRef.current, auto: autoRef.current, offsetMs: Math.round(offsetRef.current * 1000),
      time: timeRef.current, judgements: [...judgementsRef.current], combo: comboRef.current, maxCombo: maxComboRef.current, bonus: bonusRef.current,
      unlocked: [...unlockedRef.current], teases: [...teasesRef.current], savedAt: Date.now(),
    };
  }
  function persist() { storeRhythmSave(snapshot(), saveKey); }

  /* ---------- démarrage (toujours dans un geste : il débloque le son sur mobile) ---------- */
  function begin(resume?: RhythmSaveState) {
    const chosen = resume?.difficulty || difficulty;
    if (resume && resume.difficulty !== difficulty) setDifficulty(resume.difficulty);
    difficultyRef.current = chosen;
    const engine = sfx();
    engine.setVolume(prefsRef.current.sfxVolume, prefsRef.current.sfx);
    engine.setMix(prefsRef.current.mix, prefsRef.current.mute, prefsRef.current.neutral);
    engine.unlock();
    notesRef.current = chartFor(chosen);
    edgeTouchedRef.current = new Set();
    trapFlashRef.current = null;
    auraCuedRef.current = new Set();
    judgementsRef.current = resume ? [...resume.judgements] : notesRef.current.map(() => 0 as RhythmJudgement);
    comboRef.current = resume?.combo || 0;
    maxComboRef.current = resume?.maxCombo || 0;
    bonusRef.current = resume?.bonus || 0;
    comboEventRef.current = null;
    comboEventsRef.current = [];
    unlockedRef.current = new Set(resume?.unlocked || []);
    teasesRef.current = resume?.teases || [];
    captionsRef.current = [];
    captionRef.current = null;
    teaseRef.current = null;
    voiceRef.current = null;
    strokeLineRef.current = null;
    holdRef.current = null;
    hitRef.current = null;
    apogeeRef.current = false;
    sectionRef.current = resume ? sectionAt(resume.time) : -1;
    timeRef.current = resume ? resume.time : -RHYTHM_LEAD_IN;
    countdownRef.current = { start: performance.now(), from: timeRef.current };
    setResult(null);
    setPhase("countdown");
  }

  function resumeFromPause() {
    sfx().unlock();
    countdownRef.current = { start: performance.now(), from: timeRef.current };
    setPhase("countdown");
  }

  function pause() {
    if (phaseRef.current !== "play" && phaseRef.current !== "countdown") return;
    if (phaseRef.current === "play") stopClock();
    // Un appui long en cours reste acquis : la reprise repart d'un état intact.
    holdRef.current = null;
    duck(false);
    persist();
    setPhase("paused");
  }

  function leaveForLater() {
    if (phaseRef.current === "play") stopClock();
    persist();
    duck(false);
    onLeave();
  }

  function sectionAt(t: number) {
    let section = 0;
    for (let i = 0; i < defs.length; i++) if (t >= (kit ? rhythmSectionStart(i, difficultyRef.current, defs) : rhythmSectionStart(i, difficultyRef.current)) - 0.6) section = i;
    return section;
  }

  /* ---------- légendes, lignes de cadence et voix ---------- */
  function queue(id: string, line: DialogueLine, kind: Caption["kind"]) {
    if (unlockedRef.current.has(id)) return;
    unlockedRef.current.add(id);
    captionsRef.current.push({ id, line, until: 0, kind });
  }
  function tease(t: number) {
    if (t - lastTeaseRef.current < 4.5) return;
    const pool = scene.teases.map((_, index) => index).filter((index) => !teasesRef.current.includes(index));
    if (!pool.length) { teasesRef.current = []; return; }
    const pick = pool[Math.floor(Math.random() * pool.length)];
    teasesRef.current.push(pick);
    lastTeaseRef.current = t;
    voiceRef.current = null;
    teaseRef.current = { id: `t${pick}`, line: scene.teases[pick], until: performance.now() + 2800 };
    if (scene.teases[pick].intimateMood) onMood?.(scene.teases[pick].intimateMood!);
  }
  /** Après chaque coup réussi : une ligne courte de temps en temps, et une réplique d'Hylee qui monte en intensité. */
  function cue(note: RhythmNote) {
    const section = note.section;
    const text = scene.sections[section];
    const own = notesRef.current.filter((n) => n.section === section && n.kind !== "slide" && !isRhythmTrap(n));
    const hits = own.filter((n) => { const j = judgementsRef.current[n.index]; return j === 1 || j === 2; }).length;
    const strokeAt = cuePositions(own.length, text.strokes.length, 0.35);
    const voiceAt = cuePositions(own.length, text.voice.length, 0.75);
    const nowMs = performance.now();
    strokeAt.forEach((at, i) => {
      const id = `c${section}-${i}`;
      if (hits >= at && !unlockedRef.current.has(id)) { unlockedRef.current.add(id); strokeLineRef.current = { id, line: text.strokes[i], until: nowMs + 2300 }; }
    });
    voiceAt.forEach((at, i) => {
      const id = `v${section}-${i}`;
      if (hits >= at && !unlockedRef.current.has(id)) {
        unlockedRef.current.add(id);
        // Pendant une taquinerie, la réplique attend la fin de la bulle puis s'affiche à son tour.
        voiceRef.current = { id, line: text.voice[i], until: Math.max(nowMs, teaseRef.current?.until || 0) + 2000 };
        if (text.voice[i].intimateMood) onMood?.(text.voice[i].intimateMood!);
      }
    });
  }

  /** Glissé qui ouvre une phase (changement de position ou de geste), par opposition aux glissés de la langue. */
  function isTransition(note: RhythmNote) {
    const first = notesRef.current.find((n) => n.section === note.section);
    return first?.index === note.index;
  }

  /* ---------- jugement ---------- */
  function flash(kind: Flash["kind"], label: string) { flashRef.current = { id: ++flashSeq.current, kind, label }; }
  function ardourNow() {
    const judgements = judgementsRef.current;
    return rhythmArdour(rhythmGauge(judgements.length ? judgements : notesRef.current.map(() => 0 as RhythmJudgement), bonusRef.current, kit ? notesRef.current : undefined), apogeeRef.current);
  }
  function buzz(pattern: number | number[]) {
    if (!prefsRef.current.vibration) return;
    try { navigator.vibrate?.(pattern); } catch { /* vibration indisponible */ }
  }
  /** Bulle de piège : réplique du personnage (leurre ignoré ou touché, silence tenu ou rompu). */
  function trapBubble(pool: DialogueLine[] | undefined, id: string) {
    if (!pool?.length) return;
    const line = pool[Math.floor(Math.random() * pool.length)];
    voiceRef.current = { id, line, until: performance.now() + 2200 };
    if (line.intimateMood) onMood?.(line.intimateMood);
  }
  /** Pièges des fiches : 1 = résisté (rien touché), 3 = cédé. Hors justesse, hors combo, hors jauge. */
  function recordTrap(note: RhythmNote, judgement: 1 | 3) {
    if (judgementsRef.current[note.index] !== 0) return;
    judgementsRef.current[note.index] = judgement;
    const bubbles = kit?.bubbles;
    const bord = note.kind === "edge" && note.edge === "bord";
    trapFlashRef.current = { id: ++flashSeq.current, at: performance.now(), kind: judgement === 3 ? "cede" : bord ? "bord" : "resiste" };
    if (judgement === 3) {
      if (note.kind === "edge") edgeTouchedRef.current.add(note.index);
      // Céder coûte un peu de l'élan gagné : le bonus de jauge redescend, la jauge elle-même ne baisse jamais.
      bonusRef.current = Math.max(0, bonusRef.current - (bord ? 3 : 1));
      sfxRef.current?.miss();
      if (!note.call) trapBubble(bord ? bubbles?.bordBroken : bubbles?.ceded, `cede-${note.index}`);
      flash("rate", bord ? labels.bordBroken : labels.ceded);
    } else if (bord) {
      bonusRef.current = Math.min(RHYTHM_COMBO_BONUS_MAX + 3, bonusRef.current + 3);
      sfxRef.current?.laugh(ardourNow(), true);
      trapBubble(bubbles?.bordHeld, `bord-${note.index}`);
      flash("palier", labels.bordHeld);
      buzz([30, 60, 30]);
    } else if (note.kind === "bait" && !note.call && Math.random() < 0.34) {
      if (Math.random() < 0.5) sfxRef.current?.laugh(ardourNow());
      trapBubble(bubbles?.resisted, `resiste-${note.index}`);
    }
  }
  function record(note: RhythmNote, judgement: RhythmJudgement, t: number) {
    judgementsRef.current[note.index] = judgement;
    if (judgement === 3) {
      comboRef.current = 0;
      missRef.current = { id: flashSeq.current + 1, at: performance.now() };
      sfxRef.current?.miss();
      tease(t);
    } else {
      comboRef.current++;
      maxComboRef.current = Math.max(maxComboRef.current, comboRef.current);
      const combo = comboRef.current;
      const threshold = rhythmComboThreshold(combo);
      // Palier d'enchaînement : petit bonus de jauge, gémissement d'Hylee et battement particulier de l'interface.
      if (threshold) bonusRef.current = Math.min(RHYTHM_COMBO_BONUS_MAX, bonusRef.current + RHYTHM_COMBO_BONUS);
      const ardour = ardourNow();
      hitRef.current = { id: flashSeq.current + 1, at: performance.now(), perfect: judgement === 1 };
      const gesture = defs[note.section]?.gesture || "penetration";
      if (note.kind === "slide") sfxRef.current?.slide(gesture, isTransition(note));
      else sfxRef.current?.stroke(judgement === 1, ardour, note.kind === "hold" || note.kind === "final", gesture, note.motion);
      hitRef.current!.note = note;
      if (threshold) {
        const level = rhythmComboLevel(combo);
        const moan = Boolean(sfxRef.current?.comboMoan(level, ardour, gesture));
        sfxRef.current?.comboChime(level);
        comboEventRef.current = { id: rhythmComboTier(combo), at: performance.now(), combo, level, t };
        comboEventsRef.current.push({ combo, level, t: Math.round(t * 100) / 100, moan });
        buzz([18, 70, 26, 70, 34]);
      } else {
        // Hors palier : un souffle de loin en loin, jamais de gémissement.
        sfxRef.current?.breath(ardour, false, gesture);
        buzz(Math.round(8 + 18 * ardour));
      }
      cue(note);
    }
    if (judgement) flash(JUDGE_LABEL[judgement as 1 | 2 | 3], JUDGE_TEXT[judgement as 1 | 2 | 3]);
  }
  function candidate(t: number, accept: (note: RhythmNote) => boolean) {
    const windows = RHYTHM_DIFFICULTIES[difficultyRef.current];
    let best: RhythmNote | undefined;
    for (const note of notesRef.current) {
      if (note.time - t > windows.good) break;
      if (judgementsRef.current[note.index] !== 0 || isRhythmTrap(note) || !accept(note)) continue;
      if (Math.abs(note.time - t) <= windows.good && (!best || Math.abs(note.time - t) < Math.abs(best.time - t))) best = note;
    }
    return best;
  }
  const judgedNow = () => now() - offsetRef.current;
  function press(source?: string) {
    if (phaseRef.current !== "play" || autoRef.current) return;
    const t = judgedNow();
    const current = holdRef.current;
    if (current) {
      // Une note longue qui s'achève laisse enchaîner la suivante sans attendre le relâchement.
      if (t < current.note.time + current.note.duration - 0.15) return;
      holdRef.current = null;
      completeHold(current.note);
    }
    const level = difficultyRef.current;
    if (kit && pressTrap(t)) return;
    const note = candidate(t, (n) => n.kind !== "slide" || level === "doux");
    if (!note) return;
    const judgement = judgeOffset(t - note.time, level) || 2;
    record(note, judgement, t);
    if (note.kind === "hold" || note.kind === "final") holdRef.current = { note, judgement, source };
  }
  /**
   * Appui pendant un silence (bord ou gel) : le silence est rompu. Appui sur un leurre (ou pendant son appel),
   * quand aucune vraie note n'est plus proche : cédé. Renvoie vrai si l'appui a été pris par un piège.
   */
  function pressTrap(t: number) {
    const windows = RHYTHM_DIFFICULTIES[difficultyRef.current];
    for (const note of notesRef.current) {
      if (note.time - t > windows.good) break;
      if (note.kind === "edge" && judgementsRef.current[note.index] === 0 && t >= note.time - 0.02 && t <= note.time + note.duration - 0.05) {
        // Dernier battement d'un silence : la note suivante peut déjà se jouer, on ne pénalise pas.
        const next = notesRef.current.find((n) => n.index > note.index && !isRhythmTrap(n));
        if (next && Math.abs(next.time - t) <= windows.good) return false;
        recordTrap(note, 3);
        return true;
      }
    }
    const real = candidate(t, () => true);
    let bait: RhythmNote | undefined;
    for (const note of notesRef.current) {
      if (note.time - t > windows.good) break;
      if (note.kind === "bait" && judgementsRef.current[note.index] === 0 && Math.abs(note.time - t) <= windows.good && (!bait || Math.abs(note.time - t) < Math.abs(bait.time - t))) bait = note;
    }
    if (bait && (!real || Math.abs(bait.time - t) < Math.abs(real.time - t))) { recordTrap(bait, 3); return true; }
    return false;
  }
  function release(source?: string) {
    const hold = holdRef.current;
    if (!hold || phaseRef.current !== "play") return;
    // Seule la touche (ou le doigt) qui tient la note peut la relâcher.
    if (hold.source && source && hold.source !== source) return;
    const t = judgedNow();
    const end = hold.note.time + hold.note.duration;
    holdRef.current = null;
    if (t >= end - 0.12) { completeHold(hold.note); return; }
    const held = (t - hold.note.time) / hold.note.duration;
    const downgraded: RhythmJudgement = held < 0.5 ? 3 : 2;
    if (downgraded > hold.judgement) {
      judgementsRef.current[hold.note.index] = downgraded;
      if (downgraded === 3) { comboRef.current = 0; sfxRef.current?.miss(); tease(t); }
      flash(JUDGE_LABEL[downgraded as 2 | 3], downgraded === 3 ? "Lâché" : "Bien");
    }
  }
  function completeHold(note: RhythmNote) {
    if (note.relay) {
      // Relais de sommets : le sommet d'une personne, sa voix d'apogée et sa bulle ; la scène continue.
      sfxRef.current?.relay();
      buzz([50, 30, 90]);
      trapBubble((scene.sections[note.section] as RhythmKit["scene"]["sections"][number] | undefined)?.relay, `relais-${note.index}`);
      flash("palier", labels.relay);
      return;
    }
    if (note.kind === "final") {
      if (!apogeeRef.current) { apogeeRef.current = true; apogeeAtRef.current = performance.now(); sfxRef.current?.apogee(); buzz([70, 40, 110, 40, 180]); }
    } else sfxRef.current?.breath(ardourNow(), true, defs[note.section]?.gesture);
    flash("palier", note.kind === "final" ? "Apogée" : "Tenu");
  }
  function slide(direction: "left" | "right") {
    if (phaseRef.current !== "play" || autoRef.current) return;
    const t = judgedNow();
    const level = difficultyRef.current;
    const note = candidate(t, (n) => n.kind === "slide" && (level !== "intense" || n.direction === direction));
    if (!note) return;
    record(note, judgeOffset(t - note.time, level) || 2, t);
  }

  /* ---------- sonde de test (lecture seule) ---------- */
  useEffect(() => {
    const probe = {
      time: () => (phaseRef.current === "play" ? now() : timeRef.current), notes: () => notesRef.current, judgements: () => [...judgementsRef.current],
      phase: () => phaseRef.current, teases: () => [...teasesRef.current], apogee: () => apogeeRef.current, caption: () => captionRef.current?.line.text || null,
      tease: () => teaseRef.current?.line.text || null, voice: () => voiceRef.current?.line.text || null, strokeLine: () => strokeLineRef.current?.line.text || null,
      ardour: () => ardourNow(), sfx: () => ({ loaded: sfxRef.current?.loaded || 0, played: { ...(sfxRef.current?.played || {}) }, enabled: sfxRef.current?.enabled ?? null, neutral: sfxRef.current?.neutral ?? null, suggestive: sfxRef.current?.suggestive ?? suggestive, bus: sfxRef.current ? Object.fromEntries(RHYTHM_BUSES.map((bus) => [bus, sfxRef.current!.busGain(bus)])) : null }),
      music: () => ({ playing: Boolean(audioRef.current && !audioRef.current.paused), volume: audioRef.current?.volume ?? null, loop: audioRef.current?.loop ?? null }),
      zoom: () => Number(layerRef.current?.parentElement?.style.getPropertyValue("--rythme-zoom") || 0),
      prefs: () => ({ ...prefsRef.current }), offset: () => offsetRef.current,
      combo: () => ({ current: comboRef.current, max: maxComboRef.current, tier: rhythmComboTier(comboRef.current), bonus: bonusRef.current, events: [...comboEventsRef.current] }),
      shake: () => { const style = layerRef.current?.parentElement?.style; return { y: Number.parseFloat(style?.getPropertyValue("--rythme-secousse-y") || "0") || 0, x: Number.parseFloat(style?.getPropertyValue("--rythme-secousse-x") || "0") || 0, s: Number(style?.getPropertyValue("--rythme-secousse-s") || 0), etire: Number(style?.getPropertyValue("--rythme-etire") || 0), incline: Number.parseFloat(style?.getPropertyValue("--rythme-incline") || "0") || 0, geste: layerRef.current?.parentElement?.dataset.rythmeGeste || null, ...shakeRef.current }; },
      sections: () => defs.map((x, i) => ({ id: x.id, gesture: x.gesture, bpm: x.bpm, label: scene.sections[i]?.label, ...(kit ? { rest: Boolean(x.rest), bord: Boolean(x.bord), aura: Boolean(x.aura), baits: x.baits || 0, appel: Boolean(x.appel), chapter: (scene.sections[i] as { chapter?: number }).chapter } : {}) })),
      section: () => { const index = sectionAt(phaseRef.current === "play" ? now() : timeRef.current); return { index, id: defs[index]?.id, gesture: defs[index]?.gesture, label: scene.sections[index]?.label }; },
      kit: () => (kit ? { character: kit.character, routeId: kit.anchor.routeId, sex: kit.anchor.sex, start: kit.start, end: kit.end, returnChapter: kit.returnChapter, difficulty: difficultyRef.current, recommended: kit.profile.difficulty } : null),
      resistance: () => rhythmResistance(notesRef.current, judgementsRef.current),
    };
    (window as unknown as { __sylviniaRythme?: typeof probe }).__sylviniaRythme = probe;
    return () => { delete (window as unknown as { __sylviniaRythme?: typeof probe }).__sylviniaRythme; };
  }, [now]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ---------- clavier ---------- */
  useEffect(() => {
    const isPress = (key: string) => key === " " || key === "j" || key === "J" || key === "f" || key === "F" || key === "k" || key === "K" || key === "Enter";
    const down = (event: KeyboardEvent) => {
      if (phaseRef.current === "play" || phaseRef.current === "countdown") {
        if (event.key === "Escape" || event.key === "p" || event.key === "P") { event.preventDefault(); event.stopPropagation(); pause(); return; }
        if (isPress(event.key)) { event.preventDefault(); event.stopPropagation(); if (!event.repeat) press(`k:${event.key.toLowerCase()}`); return; }
        if (event.key === "ArrowLeft") { event.preventDefault(); event.stopPropagation(); if (!event.repeat) slide("left"); return; }
        if (event.key === "ArrowRight") { event.preventDefault(); event.stopPropagation(); if (!event.repeat) slide("right"); return; }
        if (event.key === "ArrowUp" || event.key === "ArrowDown" || event.key === "Backspace") { event.preventDefault(); event.stopPropagation(); }
      } else if (phaseRef.current === "paused" && (event.key === "Escape" || event.key === " ")) { event.preventDefault(); event.stopPropagation(); resumeFromPause(); }
    };
    const up = (event: KeyboardEvent) => { if (isPress(event.key)) { event.preventDefault(); release(`k:${event.key.toLowerCase()}`); } };
    window.addEventListener("keydown", down, true);
    window.addEventListener("keyup", up, true);
    return () => { window.removeEventListener("keydown", down, true); window.removeEventListener("keyup", up, true); };
  });

  /* ---------- pause automatique si l'onglet passe en arrière-plan ---------- */
  useEffect(() => {
    const hide = () => { if (document.visibilityState === "hidden") pause(); };
    const leave = () => { if (phaseRef.current === "play" || phaseRef.current === "paused") { if (phaseRef.current === "play") stopClock(); persist(); } };
    document.addEventListener("visibilitychange", hide);
    window.addEventListener("pagehide", leave);
    return () => { document.removeEventListener("visibilitychange", hide); window.removeEventListener("pagehide", leave); };
  });

  /* ---------- boucle de jeu ---------- */
  useEffect(() => {
    if (phase !== "play" && phase !== "countdown") return;
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (phaseRef.current === "countdown") {
        const cd = countdownRef.current;
        const fresh = cd && cd.from <= -RHYTHM_LEAD_IN + 0.01;
        // Partie neuve : le décompte se joue dans la partie elle-même (3, 2, 1 avant le premier coup).
        if (fresh) { startClock(cd!.from); countdownRef.current = null; setPhase("play"); return; }
        if (cd && performance.now() - cd.start >= 3000) { startClock(cd.from); countdownRef.current = null; setPhase("play"); return; }
        setFrame((f) => f + 1);
        return;
      }
      const t = now();
      timeRef.current = t;
      const level = difficultyRef.current;
      const windows = RHYTHM_DIFFICULTIES[level];
      const notes = notesRef.current;
      const judgements = judgementsRef.current;
      const judgedT = t - offsetRef.current;
      for (const note of notes) {
        if (note.time > t + 0.02) break;
        if (judgements[note.index] !== 0) continue;
        if (isRhythmTrap(note)) {
          // Un leurre laissé passer, un silence tenu jusqu'au bout : résisté (la lecture auto résiste toujours).
          const over = note.kind === "edge" ? judgedT >= note.time + note.duration : judgedT - note.time > windows.good;
          if (over) recordTrap(note, 1);
          continue;
        }
        if (autoRef.current && note.time <= t) {
          record(note, 1, t);
          if (note.kind === "hold" || note.kind === "final") holdRef.current = { note, judgement: 1 };
          continue;
        }
        if (judgedT - note.time > windows.good) record(note, 3, judgedT);
      }
      const hold = holdRef.current;
      if (hold && judgedT >= hold.note.time + hold.note.duration) {
        holdRef.current = null;
        completeHold(hold.note);
      }
      // Sections et paliers
      const section = sectionAt(t);
      if (t > -RHYTHM_LEAD_IN / 2) {
        const text = scene.sections[section];
        const kitText = kit ? (text as RhythmKit["scene"]["sections"][number]) : undefined;
        if (kitText && section !== sectionRef.current) {
          // Fiches : en changeant de phase, les phrases de la séquence précédente non encore débloquées s'affichent quand même (rien du texte n'est perdu).
          for (let s = 0; s < section; s++) (scene.sections[s] as RhythmKit["scene"]["sections"][number]).tierLines.forEach((group, g) => group.forEach((line, k) => queue(`s${s}-t${g + 1}-${k}`, line, "tier")));
        }
        if (!unlockedRef.current.has(`intro-${section}`)) { queue(`intro-${section}`, text.intro, "intro"); onMood?.(text.intimateMood); }
        if (kit?.profile.voices) sfxRef.current?.setVoice(defs[section]?.voice ?? 0);
        sectionRef.current = section;
        if (kitText?.gel) {
          // Rupture écrite : toute la séquence s'affiche, la piste attend sans rien demander.
          kitText.tierLines[0].forEach((line, k) => queue(`s${section}-t1-${k}`, line, "tier"));
        } else if (kitText) {
          // Dernière phase : ses phrases (le sommet écrit) se débloquent au fil de la phase, quelle que soit la justesse.
          const own = notes.filter((n) => n.section === section && !isRhythmTrap(n));
          const reached = own.length ? own.filter((n) => n.time <= t).length / own.length : 0;
          const tiers = section === defs.length - 1 ? [0.22, 0.5, 0.75].filter((x) => reached >= x).length : sectionTiersReached(notes, judgements, section);
          for (let tier = 1; tier <= tiers; tier++) {
            const id = `s${section}-t${tier}`;
            if (!unlockedRef.current.has(id)) { unlockedRef.current.add(id); kitText.tierLines[tier - 1].forEach((line, k) => queue(`${id}-${k}`, line, "tier")); flash("palier", `Palier ${ROMAN[tier]}`); }
          }
        } else {
          const tiers = sectionTiersReached(notes, judgements, section);
          for (let tier = 1; tier <= tiers; tier++) {
            const id = `s${section}-t${tier}`;
            if (!unlockedRef.current.has(id)) { queue(id, text.tiers[tier - 1], "tier"); flash("palier", `Palier ${ROMAN[tier]}`); }
          }
        }
        // Aura (fiches) : une mesure avant la vague, la piste pulse et elle prévient.
        if (kit) {
          const soon = notes.find((n) => n.aura && n.time > t && n.time - t < 4 * n.beat * (defs[n.section]?.aura?.factor || 1));
          if (soon && !auraCuedRef.current.has(soon.section)) { auraCuedRef.current.add(soon.section); trapBubble(kit.bubbles.aura, `aura-${soon.section}`); }
          const call = notes.find((n) => n.call && judgements[n.index] === 0 && n.time > t && n.time - t < 1.2);
          if (call && !auraCuedRef.current.has(-1 - call.section)) { auraCuedRef.current.add(-1 - call.section); trapBubble(kit.bubbles.call, `appel-${call.section}`); }
        }
      }
      // Légende courante et bulles
      const nowMs = performance.now();
      const current = captionRef.current;
      if (teaseRef.current && nowMs >= teaseRef.current.until) teaseRef.current = null;
      if (voiceRef.current && nowMs >= voiceRef.current.until) voiceRef.current = null;
      if (strokeLineRef.current && nowMs >= strokeLineRef.current.until) strokeLineRef.current = null;
      if ((!current || nowMs >= current.until) && captionsRef.current.length) {
        const next = captionsRef.current.shift()!;
        const words = format(next.line.text).split(/\s+/).length;
        next.until = nowMs + Math.max(3200, Math.min(captionMax, words * 260));
        captionRef.current = next;
        if (next.line.intimateMood) onMood?.(next.line.intimateMood);
      } else if (current && nowMs >= current.until + 2500) captionRef.current = null;
      // Sauvegarde continue (toutes les deux secondes) : un rechargement reprend au même endroit.
      if (nowMs - lastSaveRef.current > 2000) { lastSaveRef.current = nowMs; persist(); }
      // Fiches : la partie attend que la dernière phrase écrite ait été lue (au plus vingt secondes de plus).
      const reading = kit && (captionsRef.current.length > 0 || (captionRef.current && nowMs < captionRef.current.until)) && t < chartEnd + 22;
      if (t >= chartEnd + 2.2 && !reading) {
        cancelAnimationFrame(raf);
        stopClock();
        duck(false);
        const score = kit ? rhythmScore(judgements, notes) : rhythmScore(judgements);
        const quality = kit ? rhythmQuality(judgements, notes, kit.profile.resistanceWeight) : rhythmQuality(judgements);
        const final: RhythmResult = { quality, perfect: score.perfect, good: score.good, miss: score.miss, accuracy: score.accuracy, maxCombo: maxComboRef.current, auto: autoRef.current, ...(kit ? { resistance: rhythmResistance(notes, judgements) } : {}) };
        storeRhythmSave(undefined, saveKey);
        setSaved(undefined);
        setResult(final);
        setPhase("result");
        return;
      }
      setFrame((f) => f + 1);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ---------- tactile et souris ---------- */
  const onPointerDown = (event: React.PointerEvent) => {
    if (phaseRef.current !== "play") return;
    if ((event.target as HTMLElement).closest("button")) return;
    event.preventDefault();
    try { (event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId); } catch { /* pointeur synthétique */ }
    pointerRef.current = { id: event.pointerId, x: event.clientX, y: event.clientY, t: performance.now(), slid: false };
    // Un glissé se décide au mouvement : on ne juge le coup que si aucune note glissée n'attend.
    const slideWaiting = difficultyRef.current !== "doux" && candidate(judgedNow(), (n) => n.kind === "slide");
    if (!slideWaiting) press(`p:${event.pointerId}`);
  };
  const onPointerMove = (event: React.PointerEvent) => {
    const p = pointerRef.current;
    if (!p || p.id !== event.pointerId || p.slid) return;
    const dx = event.clientX - p.x, dy = event.clientY - p.y;
    if (Math.hypot(dx, dy) > 34) {
      p.slid = true;
      if (!holdRef.current) slide(dx < 0 ? "left" : "right");
    }
  };
  const onPointerUp = (event: React.PointerEvent) => {
    const p = pointerRef.current;
    if (!p || p.id !== event.pointerId) return;
    pointerRef.current = null;
    release(`p:${event.pointerId}`);
  };

  /* ---------- rendu ---------- */
  const windows = RHYTHM_DIFFICULTIES[difficulty];
  const t = timeRef.current;
  const notes = notesRef.current;
  const judgements = judgementsRef.current;
  const gauge = rhythmGauge(judgements.length ? judgements : notes.map(() => 0 as RhythmJudgement), bonusRef.current, kit ? notes : undefined);
  const sectionIndex = sectionAt(t);
  const sectionText = scene.sections[sectionIndex];
  const tiers = judgements.length ? sectionTiersReached(notes, judgements, sectionIndex) : 0;
  const playing = phase === "play";

  // Réactions de l'interface : plus le plaisir monte, plus elles battent fort, toujours sur les coups réussis.
  const nowMs = performance.now();
  const beat = kit ? rhythmBeatAt(Math.max(0, t), difficulty, defs) : rhythmBeatAt(Math.max(0, t), difficulty);
  const ardour = rhythmArdour(gauge, apogeeRef.current);
  const fx = prefs.effects === "plein" ? 1 : 0.35;
  const hit = hitRef.current;
  const sinceHit = hit ? (nowMs - hit.at) / 1000 : 99;
  const hitPulse = playing ? Math.pow(clamp01(1 - sinceHit / Math.max(0.28, beat * 0.85)), 1.6) : 0;
  const sinceApogee = apogeeRef.current ? (nowMs - apogeeAtRef.current) / 1000 : 99;
  // À l'apogée, l'écran bat une dernière fois de plus en plus lentement, puis s'apaise.
  const apogeePulse = apogeeRef.current && sinceApogee < 4 ? Math.pow(Math.abs(Math.cos(sinceApogee * Math.PI * (1.6 - sinceApogee * 0.25))), 2) * (1 - sinceApogee / 4) : 0;
  // Rester au fond : tant qu'un appui long est tenu, l'interface frémit au tempo, plus fort sur l'appui final qui mène à l'apogée.
  const held = holdRef.current;
  const holdPulse = playing && held && !apogeeRef.current ? (held.note.kind === "final" ? 0.45 + 0.4 * clamp01((t - held.note.time) / held.note.duration) : 0.3) * Math.pow(Math.abs(Math.sin(Math.PI * (t - held.note.time) / (held.note.kind === "final" ? held.note.beat * 0.75 : held.note.beat))), 2) : 0;
  // Palier de combo : un double battement (triple au troisième palier), distinct du battement ordinaire, avec un voile rose.
  const comboEvent = comboEventRef.current;
  const sinceCombo = comboEvent && playing ? (nowMs - comboEvent.at) / 1000 : 99;
  const bump = (x: number) => (x >= 0 && x < 0.17 ? Math.pow(1 - x / 0.17, 1.4) : 0);
  const comboPulse = sinceCombo < 0.8 ? Math.max(bump(sinceCombo), 0.85 * bump(sinceCombo - 0.21), comboEvent!.level >= 3 ? 0.7 * bump(sinceCombo - 0.42) : 0) : 0;
  const comboActive = sinceCombo < 1.5;
  const comboGlow = playing ? Math.max(comboPulse, rhythmComboLevel(comboRef.current) > 0 ? 0.12 + 0.06 * rhythmComboLevel(comboRef.current) : 0) * (prefs.effects === "plein" ? 1 : 0.35) : 0;
  const pulse = Math.max(hitPulse, apogeePulse, holdPulse, comboPulse);
  const halo = (0.25 + 0.75 * ardour) * fx;
  const bat = clamp01((ardour - 0.18) / 0.82) * fx;
  const vignette = clamp01((ardour - 0.22) / 0.6) * fx;
  const zoomLevel = prefs.zoom && prefs.effects === "plein" ? clamp01((ardour - 0.35) / 0.55) : 0;
  const zoom = playing ? zoomLevel * pulse * 0.022 + (apogeeRef.current ? apogeePulse * 0.012 : 0) : 0;
  const tier = ardour >= 0.75 ? 3 : ardour >= 0.5 ? 2 : ardour >= 0.25 ? 1 : 0;
  // Mouvement du sprite propre au geste de la phase : étirement (main), hochement (bouche), ondulation et frissons
  // (langue), secousse dans l'axe de la position (pénétration). Toujours sur les coups réussis, plafonné au cadre.
  const sectionDef = defs[sectionIndex];
  const gesture = sectionDef?.gesture || "penetration";
  const shakeAxis = sectionDef?.shake || "vertical";
  const shakeAmp = playing && (hit || gesture === "langue") ? rhythmShakeAmplitude(ardour, rhythmComboLevel(comboRef.current), apogeeRef.current, prefs) : 0;
  const ownNotes = notes.filter((note) => note.section === sectionIndex && !isRhythmTrap(note));
  const sectionProgress = ownNotes.length ? clamp01((t - ownNotes[0].time) / Math.max(0.1, ownNotes[ownNotes.length - 1].time - ownNotes[0].time)) : 0;
  const motionNow = rhythmGestureMotion({
    gesture, axis: shakeAxis, amp: shakeAmp, sinceHit: hit ? sinceHit : 99, beat, t: Math.max(0, t),
    motion: hit?.note?.motion, parity: hit?.note?.index, ardour, progress: sectionProgress, fx: prefs.effects === "plein" ? 1 : 0.3,
    holdFrac: held && held.note.kind === "hold" ? clamp01((t - held.note.time) / held.note.duration) : null,
  });
  const apogeeShake = apogeeRef.current && sinceApogee < 1.2 && shakeAmp ? 0.6 * shakeAmp * rhythmShakeWave(sinceApogee % 0.4) : 0;
  useEffect(() => {
    const host = layerRef.current?.parentElement;
    if (!host) return;
    host.style.setProperty("--rythme-zoom", zoom.toFixed(4));
    host.dataset.rythmeGeste = gesture;
    // Plafond lié à la hauteur de l'écran : sur un petit écran, l'image ne sort jamais du cadre.
    const limit = Math.min(RHYTHM_SHAKE_MAX, (host.clientHeight || window.innerHeight) * 0.02);
    const cap = (v: number) => Math.max(-limit, Math.min(limit, v));
    const y = cap(motionNow.y + apogeeShake);
    const x = cap(motionNow.x);
    host.style.setProperty("--rythme-secousse-y", `${y.toFixed(2)}px`);
    host.style.setProperty("--rythme-secousse-x", `${x.toFixed(2)}px`);
    host.style.setProperty("--rythme-secousse-s", motionNow.scale.toFixed(4));
    host.style.setProperty("--rythme-etire", motionNow.stretch.toFixed(4));
    host.style.setProperty("--rythme-incline", `${motionNow.tilt.toFixed(2)}deg`);
    if (playing) {
      const h = host.clientHeight || 0;
      const sprite = Math.abs(y) + Math.abs(x) + (Math.abs(motionNow.scale) + Math.abs(motionNow.stretch)) * h * 0.5;
      const m = shakeRef.current;
      m.samples++;
      m.peak = Math.max(m.peak, Math.abs(y), Math.abs(x));
      m.peakSprite = Math.max(m.peakSprite, sprite);
      const g = (m.gestures[gesture] ||= { samples: 0, moving: 0, y: 0, x: 0, stretch: 0, tilt: 0 });
      g.samples++;
      if (Math.abs(y) + Math.abs(x) > 0.3 || Math.abs(motionNow.stretch) > 0.001 || Math.abs(motionNow.tilt) > 0.05) g.moving++;
      g.y = Math.max(g.y, Math.abs(y)); g.x = Math.max(g.x, Math.abs(x));
      g.stretch = Math.max(g.stretch, Math.abs(motionNow.stretch)); g.tilt = Math.max(g.tilt, Math.abs(motionNow.tilt));
    }
  });

  const visible = notes.filter((note) => {
    const j = judgements[note.index];
    const tail = note.time + note.duration;
    if (note.time - t > windows.approach + 0.05) return false;
    if (isRhythmTrap(note)) return j === 0 ? t - tail < 0.25 : j === 3 && t - tail < 0.3;
    if (j === 0) return t - tail < 0.25;
    return (note.kind === "hold" || note.kind === "final") && holdRef.current?.note.index === note.index;
  });
  const caption = captionRef.current;
  const flashNow = flashRef.current;
  const countdown = phase === "countdown" && countdownRef.current ? Math.max(1, 3 - Math.floor((nowMs - countdownRef.current.start) / 1000)) : 0;
  const leadIn = playing && t < 0 ? Math.ceil(-t) : 0;
  const progress = Math.max(0, Math.min(1, t / chartEnd));
  const miss = missRef.current && nowMs - missRef.current.at < 380;

  const mixLabels: Record<RhythmBus, [string, string]> = {
    voix: ["Voix", "gémissements, souffles, apogée"],
    corps: ["Corps", "claquements, glissements, succion, léchages"],
    ambiance: ["Ambiance", "draps, baisers"],
    interface: ["Interface", "raté, combo"],
  };
  const muteButton = (bus: RhythmBus | "musique", label: string) => <button type="button" className={`rythme-muet ${prefs.mute[bus] ? "actif" : ""}`} aria-pressed={prefs.mute[bus]} aria-label={`${prefs.mute[bus] ? "Rétablir" : "Couper"} : ${label}`} title={prefs.mute[bus] ? "Rétablir" : "Couper"}
    onClick={() => updatePrefs({ mute: { ...prefs.mute, [bus]: !prefs.mute[bus] } })}>{prefs.mute[bus] ? "🔇" : "🔊"}</button>;
  const reglagesAmbiance = <div className="rythme-reglages ambiance">
    <label className="rythme-case"><input type="checkbox" checked={prefs.sfx} onChange={(event) => updatePrefs({ sfx: event.target.checked })} /> Bruitages</label>
    <label className="rythme-curseur">Général <input type="range" min={0} max={100} step={5} disabled={!prefs.sfx} value={Math.round(prefs.sfxVolume * 100)} onChange={(event) => updatePrefs({ sfxVolume: Number(event.target.value) / 100 })} /> <b>{Math.round(prefs.sfxVolume * 100)} %</b></label>
    <details className="rythme-mixage" data-rythme-mixage="">
      <summary>Mixage audio</summary>
      <div className="rythme-mix-grille">
        {RHYTHM_BUSES.map((bus) => {
          // Suggestif : la voix est coupée d'office et les bruits corporels sont toujours neutres.
          const locked = suggestive && bus === "voix";
          const detail = suggestive && bus === "voix" ? "coupée en Suggestif" : (suggestive || prefs.neutral) && bus === "corps" ? "sons neutres" : mixLabels[bus][1];
          return <div key={bus} className={`rythme-piste-mix ${prefs.mute[bus] || locked ? "muette" : ""} ${locked ? "verrouillee" : ""}`} data-bus={bus}>
            <span className="nom" title={detail}>{mixLabels[bus][0]}<small>{detail}</small></span>
            <input type="range" min={0} max={100} step={5} aria-label={mixLabels[bus][0]} disabled={!prefs.sfx || prefs.mute[bus] || locked} value={locked ? 0 : Math.round(prefs.mix[bus] * 100)} onChange={(event) => updatePrefs({ mix: { ...prefs.mix, [bus]: Number(event.target.value) / 100 } })} />
            <b>{locked ? "coupée" : prefs.mute[bus] ? "muet" : `${Math.round(prefs.mix[bus] * 100)} %`}</b>
            {locked ? <span className="rythme-muet verrou" title="Coupée en Suggestif" aria-hidden="true">🔒</span> : muteButton(bus, mixLabels[bus][0])}
          </div>;
        })}
        <div className={`rythme-piste-mix ${prefs.mute.musique || !music ? "muette" : ""}`} data-bus="musique" title={music ? "" : "Musique coupée dans les options"}>
          <span className="nom">Musique<small>{music ? "fond intime" : "coupée dans les options"}</small></span>
          <input type="range" min={0} max={100} step={5} aria-label="Musique" disabled={!music || prefs.mute.musique} value={Math.round(prefs.musicVolume * 100)} onChange={(event) => updatePrefs({ musicVolume: Number(event.target.value) / 100 })} />
          <b>{!music ? "coupée" : prefs.mute.musique ? "muet" : `${Math.round(prefs.musicVolume * 100)} %`}</b>
          {muteButton("musique", "Musique")}
        </div>
      </div>
      <label className={`rythme-case neutre ${suggestive ? "verrouillee" : ""}`}><input type="checkbox" checked={suggestive || prefs.neutral} disabled={suggestive} onChange={(event) => updatePrefs({ neutral: event.target.checked })} /> Bruits corporels neutres <small>{suggestive ? "imposés en Suggestif" : "battement sourd, percussion feutrée, tic, souffle léger"}</small></label>
    </details>
  </div>;
  const reglagesEffets = <div className="rythme-reglages effets">
    <div className="rythme-choix petit" role="group" aria-label="Effets">{(["plein", "reduit"] as const).map((id) => <button type="button" key={id} className={prefs.effects === id ? "actif" : ""} onClick={() => updatePrefs({ effects: id })}>{id === "plein" ? "Effets pleins" : "Effets réduits"}</button>)}</div>
    <label className="rythme-case"><input type="checkbox" checked={prefs.zoom} disabled={prefs.effects !== "plein"} onChange={(event) => updatePrefs({ zoom: event.target.checked })} /> Image en rythme</label>
    <label className="rythme-case"><input type="checkbox" checked={prefs.shake} onChange={(event) => updatePrefs({ shake: event.target.checked })} /> Secousses</label>
    <label className="rythme-case"><input type="checkbox" checked={prefs.vibration} onChange={(event) => updatePrefs({ vibration: event.target.checked })} /> Vibration</label>
  </div>;

  const comboNow = comboRef.current;
  const comboLevel = rhythmComboLevel(comboNow);
  // Fiches : vague d'aura (annoncée une mesure avant), silence en cours, appel, jauge de Résistance.
  const auraSoon = kit && playing ? notes.some((n) => n.aura && n.time > t && n.time - t < 4 * beat) : false;
  const auraNow = kit && playing ? notes.some((n) => n.aura && Math.abs(n.time - t) < n.beat * 1.5) : false;
  const edgeNow = kit && playing ? notes.find((n) => n.kind === "edge" && t >= n.time && t <= n.time + n.duration) : undefined;
  const callNow = kit && playing ? notes.some((n) => n.call && Math.abs(n.time - t) < 0.6) : false;
  const resistance = kit ? rhythmResistance(notes, judgements) : null;
  const trapFlash = trapFlashRef.current && nowMs - trapFlashRef.current.at < 650 ? trapFlashRef.current : null;
  const persoClass = kit ? `perso perso-${kit.character} ${auraSoon ? "aura-annonce" : ""} ${auraNow ? "aura-vague" : ""} ${edgeNow ? `silence silence-${edgeNow.edge}` : ""} ${callNow ? "appel-en-cours" : ""} ${trapFlash ? `piege-${trapFlash.kind}` : ""}` : "";
  return <div ref={layerRef} className={`rythme-layer phase-${phase} geste-${gesture} ardeur-${tier} ${apogeeRef.current ? "apogee" : ""} ${prefs.auto ? "auto" : ""} ${suggestive ? "suggestif" : ""} effets-${prefs.effects} ${miss ? "rate-recent" : ""} ${comboLevel ? `en-combo combo-${comboLevel}` : ""} ${comboActive ? `combo-palier palier-${comboEvent!.level}` : ""} ${persoClass}`}
    onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}
    style={{ ...(kit ? { "--rose-r": kit.profile.palette.vive, "--rouge-r": kit.profile.palette.profonde } : {}), "--pulse": pulse.toFixed(3), "--ardeur": ardour.toFixed(3), "--halo": halo.toFixed(3), "--bat": bat.toFixed(3), "--vignette": vignette.toFixed(3), "--combo": comboGlow.toFixed(3), "--combo-battement": comboPulse.toFixed(3), "--jauge": `${gauge}%` } as React.CSSProperties}
    data-rythme-phase={phase} data-ardeur={tier} data-geste={gesture} {...(kit ? { "data-perso": kit.character } : {})}>
    {(phase === "play" || phase === "countdown" || phase === "paused") && <>
      <div className="rythme-vignette" aria-hidden="true" />
      <div className="rythme-combo-voile" aria-hidden="true" />
      <div className="rythme-couloir" aria-hidden="true">
        <div className="rythme-entete">
          <span className="rythme-section">{sectionText.label}</span>
          <span className="rythme-cadence">{sectionText.cadence}</span>
        </div>
        <div className="rythme-piste">
          <div className="rythme-progres" style={{ height: `${progress * 100}%` }} />
          {visible.map((note) => {
            const head = Math.max(0, (note.time - t) / windows.approach);
            const tailEnd = note.duration ? Math.max(0, (note.time + note.duration - t) / windows.approach) : head;
            const active = holdRef.current?.note.index === note.index;
            const from = active ? 0 : head;
            const to = Math.min(1.05, tailEnd);
            if (isRhythmTrap(note)) {
              // Leurre (contour pâle sans cœur, « elle » pendant un appel) ou silence (bande à ne pas toucher).
              const state = judgements[note.index] === 3 ? "cede" : "";
              return <div key={note.index} className={`rythme-note ${note.kind} ${note.edge || ""} ${note.call ? "appel" : ""} ${state}`}
                style={{ bottom: `${Math.max(0, head) * 100}%`, height: note.duration ? `${Math.max(0, Math.min(1.05, tailEnd) - Math.max(0, head)) * 100}%` : undefined } as React.CSSProperties}>
                <i className="tete">{note.kind === "edge" ? (note.edge === "bord" ? labels.bordNote : labels.gelNote) : note.call ? "·" : ""}</i>
              </div>;
            }
            return <div key={note.index} className={`rythme-note ${note.kind} ${note.direction || ""} ${note.motion || ""} ${note.aura ? "aura" : ""} ${active ? "tenue" : ""}`}
              style={{ bottom: `${from * 100}%`, height: note.duration ? `${Math.max(0, to - from) * 100}%` : undefined } as React.CSSProperties}>
              <i className="tete">{note.kind === "slide" ? (note.direction === "left" ? "‹" : "›") : note.kind === "final" ? "✦" : note.motion === "haut" ? "˄" : note.motion === "bas" ? "˅" : ""}</i>
            </div>;
          })}
          <div className="rythme-cible"><i />{hit && sinceHit < 0.6 && <b key={hit.id} className={`rythme-onde ${hit.perfect ? "parfait" : ""}`} />}{comboActive && comboEvent && <b key={`vague-${comboEvent.id}`} className="rythme-onde combo" />}</div>
        </div>
        <div className="rythme-jauge" title="Plaisir"><b /><span>{Math.round(gauge)}</span>{[1, 2, 3].map((n) => <em key={n} className={n <= tiers ? "atteint" : ""} />)}</div>
        {resistance && resistance.total > 0 && <div className="rythme-resistance" title={labels.resistance} style={{ "--resistance": `${resistance.gauge}%` } as React.CSSProperties}><b /><span>{labels.resistance}</span></div>}
        {edgeNow && <div className={`rythme-silence-bandeau ${edgeNow.edge}`}>{edgeNow.edge === "bord" ? labels.bordBanner : labels.gel}</div>}
        {callNow && <div className="rythme-silence-bandeau appel">{labels.call}</div>}
        {kit?.bubbles.trapLabels?.aura && (auraSoon || auraNow) && !edgeNow && !callNow && <div className="rythme-silence-bandeau ordre">{labels.aura}</div>}
        <div className={`rythme-combo ${comboLevel ? `niveau-${comboLevel}` : ""}`} data-combo={comboNow}>{comboNow > 2 ? <>×{comboNow}</> : null}</div>
        {comboActive && comboEvent && <div key={`combo-${comboEvent.id}`} className={`rythme-combo-eclat niveau-${comboEvent.level}`}><b>Combo</b><span>×{comboEvent.combo}</span></div>}
        {flashNow && <div key={flashNow.id} className={`rythme-juge ${flashNow.kind}`}>{flashNow.label}</div>}
        <button type="button" className="rythme-pause" onClick={(event) => { event.stopPropagation(); phase === "paused" ? resumeFromPause() : pause(); }} aria-label="Pause">{phase === "paused" ? "▶" : "❚❚"}</button>
      </div>
      {strokeLineRef.current && <div key={strokeLineRef.current.id} className="rythme-coup">{format(strokeLineRef.current.line.text)}</div>}
      {voiceRef.current && !teaseRef.current && <div key={voiceRef.current.id} className="rythme-voix"><span className="qui">{format(voiceRef.current.line.speaker)}</span>{format(voiceRef.current.line.text)}</div>}
      {caption && <div key={caption.id} className={`rythme-legende ${caption.kind} ${caption.line.speaker === "Narration" ? "narration" : "replique"}`}>
        {caption.line.speaker !== "Narration" && <span className="qui">{format(caption.line.speaker)}</span>}
        <p>{format(caption.line.text)}</p>
      </div>}
      {teaseRef.current && <div key={`taquine-${teaseRef.current.id}`} className="rythme-taquine"><span className="qui">{format(teaseRef.current.line.speaker)}</span>{format(teaseRef.current.line.text)}</div>}
      {(countdown > 0 || leadIn > 0) && <div className="rythme-decompte" key={`cd-${countdown || leadIn}`}>{countdown || leadIn}</div>}
      {prefs.auto && playing && <div className="rythme-auto-badge">Lecture auto</div>}
      <div className="rythme-apogee-voile" aria-hidden="true" />
    </>}

    {phase === "setup" && <div className="rythme-panneau">
      <p className="eyebrow">Jeu de rythme · prototype{suggestive ? " · Suggestif" : ""}</p>
      <h3>{scene.title}</h3>
      <p className="rythme-consigne">{scene.instruction}</p>
      <ul className="rythme-touches"><li>⌨ {scene.controls.keyboard}</li><li>☝ {scene.controls.touch}</li></ul>
      <div className="rythme-reglages">
        <div className="rythme-choix" role="group" aria-label="Difficulté">{(Object.keys(RHYTHM_DIFFICULTIES) as RhythmDifficulty[]).map((id) => <button type="button" key={id} className={difficulty === id ? "actif" : ""} onClick={() => { setDifficulty(id); notesRef.current = chartFor(id); }}>{RHYTHM_DIFFICULTIES[id].label}{kit && kit.profile.difficulty === id ? <small className="rythme-recommande"> · {labels.recommended}</small> : null}</button>)}</div>
        <label className="rythme-case"><input type="checkbox" checked={prefs.auto} onChange={(event) => updatePrefs({ auto: event.target.checked })} /> Mode auto (lire sans jouer)</label>
        <label className="rythme-curseur">Décalage des coups <input type="range" min={-200} max={200} step={10} value={prefs.offsetMs} onChange={(event) => updatePrefs({ offsetMs: Number(event.target.value) })} /> <b>{prefs.offsetMs > 0 ? "+" : ""}{prefs.offsetMs} ms</b></label>
      </div>
      {reglagesAmbiance}
      {reglagesEffets}
      <div className="rythme-actions">
        {saved && <button type="button" className="btn principal primary-action" onClick={() => begin(saved)}>Reprendre à {fmt(saved.time + RHYTHM_LEAD_IN)} · {RHYTHM_DIFFICULTIES[saved.difficulty].label}</button>}
        <button type="button" className={saved ? "btn" : "btn principal primary-action"} onClick={() => { if (saved) { storeRhythmSave(undefined, saveKey); setSaved(undefined); } begin(); }}>{saved ? "Recommencer" : "Commencer"}</button>
        <button type="button" className="btn discret" onClick={onSkip}>Lire la version écrite</button>
      </div>
    </div>}

    {phase === "paused" && <div className="rythme-panneau pause">
      <p className="eyebrow">Pause · {fmt(Math.max(0, timeRef.current))} / {fmt(chartEnd)}</p>
      <h3>{scene.title}</h3>
      <label className="rythme-case"><input type="checkbox" checked={prefs.auto} onChange={(event) => updatePrefs({ auto: event.target.checked })} /> Mode auto (lire sans jouer)</label>
      {reglagesAmbiance}
      {reglagesEffets}
      <div className="rythme-actions">
        <button type="button" className="btn principal primary-action" onClick={resumeFromPause}>Reprendre</button>
        <button type="button" className="btn" onClick={leaveForLater}>Reprendre plus tard</button>
        <button type="button" className="btn" onClick={() => { storeRhythmSave(undefined, saveKey); begin(); }}>Recommencer</button>
        <button type="button" className="btn discret" onClick={() => { storeRhythmSave(undefined, saveKey); duck(false); onSkip(); }}>Lire la version écrite</button>
      </div>
    </div>}

    {phase === "result" && result && <div className="rythme-panneau resultat">
      <p className="eyebrow">{result.auto ? "Lecture auto" : RHYTHM_DIFFICULTIES[difficulty].label} · {Math.round(result.accuracy * 100)} % de justesse</p>
      <h3>{scene.conclusions[result.quality].title}</h3>
      <div className="rythme-bilan"><span className="parfait"><b>{result.perfect}</b> Parfait</span><span className="bien"><b>{result.good}</b> Bien</span><span className="rate"><b>{result.miss}</b> Raté</span><span><b>×{result.maxCombo}</b> enchaînement</span>{result.resistance && result.resistance.total > 0 && <span className="resistance"><b>{result.resistance.resisted}/{result.resistance.resisted + result.resistance.ceded}</b> {labels.resistance}</span>}</div>
      {kit && scene.conclusions[result.quality].lines[0] && <p className="rythme-bulle-fin"><span className="qui">{format(scene.conclusions[result.quality].lines[0].speaker)}</span>{format(scene.conclusions[result.quality].lines[0].text)}</p>}
      {kit && relationNote && result.quality === "tatonnement" && !result.auto && <p className="rythme-relation">{relationNote}</p>}
      {kit && result.auto && kit.bubbles.autoNote && <p className="rythme-bulle-fin auto"><span className="qui">{format(kit.bubbles.autoNote.speaker)}</span>{format(kit.bubbles.autoNote.text)}</p>}
      <div className="rythme-actions">
        <button type="button" className="btn principal primary-action" onClick={() => onFinish(result)}>Continuer</button>
        <button type="button" className="btn" onClick={() => begin()}>Rejouer</button>
      </div>
    </div>}
  </div>;
}
