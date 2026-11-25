import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { DialogueLine } from "./game-data";
import type { RhythmSceneText } from "./rhythm-intimacy";
import {
  RHYTHM_BEAT, RHYTHM_DIFFICULTIES, RHYTHM_LEAD_IN, RHYTHM_SECTIONS, RHYTHM_SONG_START, RHYTHM_TRACK,
  buildRhythmChart, judgeOffset, loadRhythmPrefs, loadRhythmSave, rhythmChartEnd, rhythmGauge, rhythmQuality, rhythmScore,
  rhythmSectionStart, sectionTiersReached, storeRhythmPrefs, storeRhythmSave,
  type RhythmDifficulty, type RhythmJudgement, type RhythmNote, type RhythmQuality, type RhythmSaveState,
} from "./rhythm-intimacy-engine";

/** Évènement écouté par la page : coupe la piste d'ambiance pendant que le jeu joue la sienne. */
export const RHYTHM_DUCK_EVENT = "sylvinia:rythme-duck";

export type RhythmResult = { quality: RhythmQuality; perfect: number; good: number; miss: number; accuracy: number; maxCombo: number; auto: boolean };

type Phase = "setup" | "countdown" | "play" | "paused" | "result";
type Caption = { id: string; line: DialogueLine; until: number; kind: "intro" | "tier" | "tease" };
type Flash = { id: number; label: string; kind: "parfait" | "bien" | "rate" | "palier" };

const JUDGE_LABEL: Record<1 | 2 | 3, Flash["kind"]> = { 1: "parfait", 2: "bien", 3: "rate" };
const JUDGE_TEXT: Record<1 | 2 | 3, string> = { 1: "Parfait", 2: "Bien", 3: "Raté" };
const ROMAN = ["", "I", "II", "III"];

function fmt(seconds: number) {
  const s = Math.max(0, Math.round(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export function RhythmIntimacyGame({ scene, saveKey, music, volume, format, onMood, onFinish, onSkip, onLeave }: {
  scene: RhythmSceneText;
  saveKey: string;
  music: boolean;
  volume: number;
  format: (text: string) => string;
  onMood?: (mood: string) => void;
  onFinish: (result: RhythmResult) => void;
  onSkip: () => void;
  onLeave: () => void;
}) {
  const [prefs, setPrefs] = useState(loadRhythmPrefs);
  const [saved, setSaved] = useState<RhythmSaveState | undefined>(() => loadRhythmSave(saveKey));
  const [phase, setPhase] = useState<Phase>("setup");
  const [, setFrame] = useState(0);
  const [result, setResult] = useState<RhythmResult | null>(null);

  const difficulty: RhythmDifficulty = prefs.difficulty;
  const difficultyRef = useRef(difficulty);
  difficultyRef.current = difficulty;
  const notesRef = useRef<RhythmNote[]>(buildRhythmChart(difficulty));
  const judgementsRef = useRef<RhythmJudgement[]>([]);
  const timeRef = useRef(-RHYTHM_LEAD_IN);
  const clockRef = useRef<{ perfStart: number; base: number }>({ perfStart: 0, base: 0 });
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const holdRef = useRef<{ note: RhythmNote; judgement: RhythmJudgement; source?: string } | null>(null);
  const teaseRef = useRef<{ id: number; line: DialogueLine; until: number } | null>(null);
  const comboRef = useRef(0);
  const maxComboRef = useRef(0);
  const unlockedRef = useRef<Set<string>>(new Set());
  const teasesRef = useRef<number[]>([]);
  const lastTeaseRef = useRef(-99);
  const captionsRef = useRef<Caption[]>([]);
  const captionRef = useRef<Caption | null>(null);
  const flashRef = useRef<Flash | null>(null);
  const flashSeq = useRef(0);
  const autoRef = useRef(prefs.auto);
  const offsetRef = useRef(prefs.offsetMs / 1000);
  const apogeeRef = useRef(false);
  const lastSaveRef = useRef(0);
  const countdownRef = useRef<{ start: number; from: number } | null>(null);
  const pointerRef = useRef<{ id: number; x: number; y: number; t: number; slid: boolean } | null>(null);
  const phaseRef = useRef<Phase>("setup");
  phaseRef.current = phase;
  autoRef.current = prefs.auto;
  offsetRef.current = prefs.offsetMs / 1000;

  const chartEnd = useMemo(() => rhythmChartEnd(), []);

  const updatePrefs = (patch: Partial<typeof prefs>) => setPrefs((current) => { const next = { ...current, ...patch }; storeRhythmPrefs(next); return next; });

  /* ---------- horloge : la musique quand elle joue, sinon l'horloge du navigateur ---------- */
  const now = useCallback(() => {
    const audio = audioRef.current;
    if (audio && !audio.paused && audio.readyState >= 2) return audio.currentTime - RHYTHM_SONG_START - offsetRef.current;
    const { perfStart, base } = clockRef.current;
    return base + (performance.now() - perfStart) / 1000;
  }, []);

  const duck = (on: boolean) => window.dispatchEvent(new CustomEvent(RHYTHM_DUCK_EVENT, { detail: on }));
  useEffect(() => () => {
    // Fermeture de la scène en pleine partie : l'état est conservé pour « Reprendre plus tard ».
    if (phaseRef.current === "play" || phaseRef.current === "paused") { if (phaseRef.current === "play") stopClock(); persist(); }
    duck(false);
    audioRef.current?.pause();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (audioRef.current) audioRef.current.volume = Math.max(0, Math.min(1, volume)); }, [volume]);

  function startClock(at: number) {
    timeRef.current = at;
    clockRef.current = { perfStart: performance.now(), base: at };
    if (!music) return;
    let audio = audioRef.current;
    if (!audio) {
      audio = new Audio(`/assets/audio/${RHYTHM_TRACK}.mp3`);
      audio.preload = "auto";
      audioRef.current = audio;
    }
    audio.volume = Math.max(0, Math.min(1, volume));
    const seek = () => { try { audio!.currentTime = Math.max(0, RHYTHM_SONG_START + at + offsetRef.current); } catch { /* lecture sans musique */ } };
    if (audio.readyState >= 1) seek(); else audio.addEventListener("loadedmetadata", seek, { once: true });
    duck(true);
    audio.play().catch(() => { /* lecture bloquée : l'horloge interne prend le relais */ });
  }

  function stopClock() {
    timeRef.current = now();
    audioRef.current?.pause();
  }

  /* ---------- sauvegarde ---------- */
  function snapshot(): RhythmSaveState {
    return {
      v: 1, scene: scene.id, difficulty: difficultyRef.current, auto: autoRef.current, offsetMs: Math.round(offsetRef.current * 1000),
      time: timeRef.current, judgements: [...judgementsRef.current], combo: comboRef.current, maxCombo: maxComboRef.current,
      unlocked: [...unlockedRef.current], teases: [...teasesRef.current], savedAt: Date.now(),
    };
  }
  function persist() { storeRhythmSave(snapshot(), saveKey); }

  /* ---------- démarrage ---------- */
  function begin(resume?: RhythmSaveState) {
    const chosen = resume?.difficulty || difficulty;
    if (resume && resume.difficulty !== difficulty) updatePrefs({ difficulty: resume.difficulty });
    notesRef.current = buildRhythmChart(chosen);
    judgementsRef.current = resume ? [...resume.judgements] : notesRef.current.map(() => 0 as RhythmJudgement);
    comboRef.current = resume?.combo || 0;
    maxComboRef.current = resume?.maxCombo || 0;
    unlockedRef.current = new Set(resume?.unlocked || []);
    teasesRef.current = resume?.teases || [];
    captionsRef.current = [];
    captionRef.current = null;
    teaseRef.current = null;
    holdRef.current = null;
    apogeeRef.current = false;
    timeRef.current = resume ? resume.time : -RHYTHM_LEAD_IN;
    countdownRef.current = { start: performance.now(), from: timeRef.current };
    setResult(null);
    setPhase("countdown");
  }

  function resumeFromPause() {
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

  /* ---------- légendes ---------- */
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
    teaseRef.current = { id: pick, line: scene.teases[pick], until: performance.now() + 2800 };
    if (scene.teases[pick].intimateMood) onMood?.(scene.teases[pick].intimateMood!);
  }

  /* ---------- jugement ---------- */
  function flash(kind: Flash["kind"], label: string) { flashRef.current = { id: ++flashSeq.current, kind, label }; }
  function record(note: RhythmNote, judgement: RhythmJudgement, t: number) {
    judgementsRef.current[note.index] = judgement;
    if (judgement === 3) { comboRef.current = 0; tease(t); }
    else { comboRef.current++; maxComboRef.current = Math.max(maxComboRef.current, comboRef.current); }
    if (judgement) flash(JUDGE_LABEL[judgement as 1 | 2 | 3], JUDGE_TEXT[judgement as 1 | 2 | 3]);
  }
  function candidate(t: number, accept: (note: RhythmNote) => boolean) {
    const windows = RHYTHM_DIFFICULTIES[difficulty];
    let best: RhythmNote | undefined;
    for (const note of notesRef.current) {
      if (note.time - t > windows.good) break;
      if (judgementsRef.current[note.index] !== 0 || !accept(note)) continue;
      if (Math.abs(note.time - t) <= windows.good && (!best || Math.abs(note.time - t) < Math.abs(best.time - t))) best = note;
    }
    return best;
  }
  function press(source?: string) {
    if (phaseRef.current !== "play" || autoRef.current) return;
    const t = now();
    const current = holdRef.current;
    if (current) {
      // Une note longue qui s'achève laisse enchaîner la suivante sans attendre le relâchement.
      if (t < current.note.time + current.note.duration - 0.15) return;
      holdRef.current = null;
      completeHold(current.note);
    }
    const note = candidate(t, (n) => n.kind !== "slide" || difficulty === "doux");
    if (!note) return;
    const judgement = judgeOffset(t - note.time, difficulty) || 2;
    record(note, judgement, t);
    if (note.kind === "hold" || note.kind === "final") holdRef.current = { note, judgement, source };
  }
  function release(source?: string) {
    const hold = holdRef.current;
    if (!hold || phaseRef.current !== "play") return;
    // Seule la touche (ou le doigt) qui tient la note peut la relâcher.
    if (hold.source && source && hold.source !== source) return;
    const t = now();
    const end = hold.note.time + hold.note.duration;
    holdRef.current = null;
    if (t >= end - 0.12) { completeHold(hold.note); return; }
    const held = (t - hold.note.time) / hold.note.duration;
    const downgraded: RhythmJudgement = held < 0.5 ? 3 : 2;
    if (downgraded > hold.judgement) {
      judgementsRef.current[hold.note.index] = downgraded;
      if (downgraded === 3) { comboRef.current = 0; tease(t); }
      flash(JUDGE_LABEL[downgraded as 2 | 3], downgraded === 3 ? "Lâché" : "Bien");
    }
  }
  function completeHold(note: RhythmNote) {
    if (note.kind === "final") apogeeRef.current = true;
    flash("palier", note.kind === "final" ? "Apogée" : "Tenu");
  }
  function slide(direction: "left" | "right") {
    if (phaseRef.current !== "play" || autoRef.current) return;
    const t = now();
    const note = candidate(t, (n) => n.kind === "slide" && (difficulty !== "intense" || n.direction === direction));
    if (!note) return;
    record(note, judgeOffset(t - note.time, difficulty) || 2, t);
  }

  /* ---------- sonde de test (lecture seule) : horloge, carte et jugements ---------- */
  useEffect(() => {
    const probe = { time: () => (phaseRef.current === "play" ? now() : timeRef.current), notes: () => notesRef.current, judgements: () => [...judgementsRef.current], phase: () => phaseRef.current, teases: () => [...teasesRef.current], apogee: () => apogeeRef.current, caption: () => captionRef.current?.line.text || null, tease: () => teaseRef.current?.line.text || null };
    (window as unknown as { __sylviniaRythme?: typeof probe }).__sylviniaRythme = probe;
    return () => { delete (window as unknown as { __sylviniaRythme?: typeof probe }).__sylviniaRythme; };
  }, [now]);

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
        // Partie neuve : la musique joue déjà pendant les deux mesures d'appel.
        if (fresh) { startClock(cd!.from); countdownRef.current = null; setPhase("play"); return; }
        if (cd && performance.now() - cd.start >= 3 * RHYTHM_BEAT * 1000 + 200) { startClock(cd.from); countdownRef.current = null; setPhase("play"); return; }
        setFrame((f) => f + 1);
        return;
      }
      const t = now();
      timeRef.current = t;
      const windows = RHYTHM_DIFFICULTIES[difficulty];
      const notes = notesRef.current;
      const judgements = judgementsRef.current;
      for (const note of notes) {
        if (note.time > t + 0.02) break;
        if (judgements[note.index] !== 0) continue;
        if (autoRef.current && note.time <= t) {
          record(note, 1, t);
          if (note.kind === "hold" || note.kind === "final") holdRef.current = { note, judgement: 1 };
          continue;
        }
        if (t - note.time > windows.good) record(note, 3, t);
      }
      const hold = holdRef.current;
      if (hold && t >= hold.note.time + hold.note.duration) {
        holdRef.current = null;
        completeHold(hold.note);
      }
      // Sections et paliers
      let section = 0;
      for (let i = 0; i < RHYTHM_SECTIONS.length; i++) if (t >= rhythmSectionStart(i) - 0.6) section = i;
      if (t > -RHYTHM_LEAD_IN / 2) {
        const text = scene.sections[section];
        if (!unlockedRef.current.has(`intro-${section}`)) { queue(`intro-${section}`, text.intro, "intro"); onMood?.(text.intimateMood); }
        const tiers = sectionTiersReached(notes, judgements, section);
        for (let tier = 1; tier <= tiers; tier++) {
          const id = `s${section}-t${tier}`;
          if (!unlockedRef.current.has(id)) { queue(id, text.tiers[tier - 1], "tier"); flash("palier", `Palier ${ROMAN[tier]}`); }
        }
      }
      // Légende courante
      const nowMs = performance.now();
      const current = captionRef.current;
      if (teaseRef.current && nowMs >= teaseRef.current.until) teaseRef.current = null;
      if ((!current || nowMs >= current.until) && captionsRef.current.length) {
        const next = captionsRef.current.shift()!;
        const words = format(next.line.text).split(/\s+/).length;
        next.until = nowMs + Math.max(3200, Math.min(7000, words * 260));
        captionRef.current = next;
        if (next.line.intimateMood) onMood?.(next.line.intimateMood);
      } else if (current && nowMs >= current.until + 2500) captionRef.current = null;
      // Sauvegarde continue (toutes les deux secondes) : un rechargement reprend au même endroit.
      if (nowMs - lastSaveRef.current > 2000) { lastSaveRef.current = nowMs; persist(); }
      if (t >= chartEnd + 1.2) {
        cancelAnimationFrame(raf);
        stopClock();
        duck(false);
        const score = rhythmScore(judgements);
        const final: RhythmResult = { quality: rhythmQuality(judgements), perfect: score.perfect, good: score.good, miss: score.miss, accuracy: score.accuracy, maxCombo: maxComboRef.current, auto: autoRef.current };
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
    const t = now();
    const slideWaiting = difficulty !== "doux" && candidate(t, (n) => n.kind === "slide");
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
  const t = phase === "play" ? timeRef.current : timeRef.current;
  const notes = notesRef.current;
  const judgements = judgementsRef.current;
  const gauge = rhythmGauge(judgements.length ? judgements : notes.map(() => 0 as RhythmJudgement));
  let sectionIndex = 0;
  for (let i = 0; i < RHYTHM_SECTIONS.length; i++) if (t >= rhythmSectionStart(i) - 0.6) sectionIndex = i;
  const sectionText = scene.sections[sectionIndex];
  const tiers = judgements.length ? sectionTiersReached(notes, judgements, sectionIndex) : 0;
  const beatPhase = ((t % RHYTHM_BEAT) + RHYTHM_BEAT) % RHYTHM_BEAT / RHYTHM_BEAT;
  const pulse = phase === "play" ? Math.max(0, 1 - beatPhase * 2.4) : 0;
  const visible = notes.filter((note) => {
    const j = judgements[note.index];
    const tail = note.time + note.duration;
    if (note.time - t > windows.approach + 0.05) return false;
    if (j === 0) return t - tail < 0.25;
    return (note.kind === "hold" || note.kind === "final") && holdRef.current?.note.index === note.index;
  });
  const caption = captionRef.current;
  const flashNow = flashRef.current;
  const countdown = phase === "countdown" && countdownRef.current ? Math.max(1, 3 - Math.floor((performance.now() - countdownRef.current.start) / (RHYTHM_BEAT * 1000))) : 0;
  const leadIn = phase === "play" && t < 0 ? Math.ceil(-t / RHYTHM_BEAT) : 0;
  const progress = Math.max(0, Math.min(1, t / chartEnd));

  return <div className={`rythme-layer phase-${phase} ${apogeeRef.current ? "apogee" : ""} ${prefs.auto ? "auto" : ""}`}
    onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}
    style={{ "--pulse": pulse.toFixed(3), "--jauge": `${gauge}%` } as React.CSSProperties} data-rythme-phase={phase}>
    {(phase === "play" || phase === "countdown" || phase === "paused") && <>
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
            return <div key={note.index} className={`rythme-note ${note.kind} ${note.direction || ""} ${active ? "tenue" : ""}`}
              style={{ bottom: `${from * 100}%`, height: note.duration ? `${Math.max(0, to - from) * 100}%` : undefined } as React.CSSProperties}>
              <i className="tete">{note.kind === "slide" ? (note.direction === "left" ? "‹" : "›") : note.kind === "final" ? "✦" : ""}</i>
            </div>;
          })}
          <div className="rythme-cible"><i /></div>
        </div>
        <div className="rythme-jauge" title="Plaisir"><b /><span>{Math.round(gauge)}</span>{[1, 2, 3].map((tier) => <em key={tier} className={tier <= tiers ? "atteint" : ""} />)}</div>
        <div className="rythme-combo">{comboRef.current > 2 ? <>×{comboRef.current}</> : null}</div>
        {flashNow && <div key={flashNow.id} className={`rythme-juge ${flashNow.kind}`}>{flashNow.label}</div>}
        <button type="button" className="rythme-pause" onClick={(event) => { event.stopPropagation(); phase === "paused" ? resumeFromPause() : pause(); }} aria-label="Pause">{phase === "paused" ? "▶" : "❚❚"}</button>
      </div>
      {caption && <div key={caption.id} className={`rythme-legende ${caption.kind} ${caption.line.speaker === "Narration" ? "narration" : "replique"}`}>
        {caption.line.speaker !== "Narration" && <span className="qui">{format(caption.line.speaker)}</span>}
        <p>{format(caption.line.text)}</p>
      </div>}
      {teaseRef.current && <div key={`taquine-${teaseRef.current.id}`} className="rythme-taquine"><span className="qui">{format(teaseRef.current.line.speaker)}</span>{format(teaseRef.current.line.text)}</div>}
      {(countdown > 0 || leadIn > 0) && <div className="rythme-decompte" key={`cd-${countdown || leadIn}`}>{countdown || (leadIn > 4 ? "Prêt ?" : leadIn)}</div>}
      {prefs.auto && phase === "play" && <div className="rythme-auto-badge">Lecture auto</div>}
      <div className="rythme-apogee-voile" aria-hidden="true" />
    </>}

    {phase === "setup" && <div className="rythme-panneau">
      <p className="eyebrow">Jeu de rythme · prototype</p>
      <h3>{scene.title}</h3>
      <p className="rythme-consigne">{scene.instruction}</p>
      <ul className="rythme-touches"><li>⌨ {scene.controls.keyboard}</li><li>☝ {scene.controls.touch}</li></ul>
      <div className="rythme-reglages">
        <div className="rythme-choix" role="group" aria-label="Difficulté">{(Object.keys(RHYTHM_DIFFICULTIES) as RhythmDifficulty[]).map((id) => <button type="button" key={id} className={difficulty === id ? "actif" : ""} onClick={() => { updatePrefs({ difficulty: id }); notesRef.current = buildRhythmChart(id); }}>{RHYTHM_DIFFICULTIES[id].label}</button>)}</div>
        <label className="rythme-case"><input type="checkbox" checked={prefs.auto} onChange={(event) => updatePrefs({ auto: event.target.checked })} /> Mode auto (lire sans jouer)</label>
        <label className="rythme-decalage">Décalage audio <input type="range" min={-200} max={200} step={10} value={prefs.offsetMs} onChange={(event) => updatePrefs({ offsetMs: Number(event.target.value) })} /> <b>{prefs.offsetMs > 0 ? "+" : ""}{prefs.offsetMs} ms</b></label>
      </div>
      <div className="rythme-actions">
        {saved && <button type="button" className="btn principal primary-action" onClick={() => begin(saved)}>Reprendre à {fmt(saved.time + RHYTHM_LEAD_IN)} · {RHYTHM_DIFFICULTIES[saved.difficulty].label}</button>}
        <button type="button" className={saved ? "btn" : "btn principal primary-action"} onClick={() => { if (saved) { storeRhythmSave(undefined, saveKey); setSaved(undefined); } begin(); }}>{saved ? "Recommencer" : "Commencer"}</button>
        <button type="button" className="btn discret" onClick={onSkip}>Lire la version écrite</button>
      </div>
    </div>}

    {phase === "paused" && <div className="rythme-panneau pause">
      <p className="eyebrow">Pause · {fmt(Math.max(0, timeRef.current) )} / {fmt(chartEnd)}</p>
      <h3>{scene.title}</h3>
      <label className="rythme-case"><input type="checkbox" checked={prefs.auto} onChange={(event) => updatePrefs({ auto: event.target.checked })} /> Mode auto (lire sans jouer)</label>
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
      <div className="rythme-bilan"><span className="parfait"><b>{result.perfect}</b> Parfait</span><span className="bien"><b>{result.good}</b> Bien</span><span className="rate"><b>{result.miss}</b> Raté</span><span><b>×{result.maxCombo}</b> enchaînement</span></div>
      <div className="rythme-actions">
        <button type="button" className="btn principal primary-action" onClick={() => onFinish(result)}>Continuer</button>
        <button type="button" className="btn" onClick={() => begin()}>Rejouer</button>
      </div>
    </div>}
  </div>;
}
