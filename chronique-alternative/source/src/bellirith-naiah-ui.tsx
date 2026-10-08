import { useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from "react";
import { CrossQuestDossier } from "./cross-quest-dossier";
import type { CrossQuestProgress } from "./cross-quests";
import type { DialogueLine } from "./game-data";
import type { IntimacyMode, PlayerSex } from "./date-scenes";
import { spritePath } from "./sprite-system";
import { intimateSpritePath } from "./intimate-sprite-system";
import {
  BN_FINAL_STAGE, BN_MINIGAME_OBJECTIVE, BN_MINIGAME_STAGE, BN_OBJECTIVES, BN_POST_MOMENT_IDS, BN_STAGE_TOTAL, BN_TITLES,
  bnIntimacyLived, bnMinigamePending, bnPendingIntimacies, bnPostMoment, type BNIntimacyId,
} from "./bellirith-naiah-cross-quest";
import {
  BN_ANOMALY_AFTERMATH, BN_ANOMALY_DETAIL, BN_ANOMALY_LABEL, BN_ANOMALY_ROUND, BN_CLOSINGS, BN_CYCLE, BN_GAME_INTRO, BN_MOVES, BN_MOVE_INFO,
  BN_OUTCOME_LABELS, BN_ROUNDS, BN_ROUND_COUNT, BN_TUTORIAL_HINT, bnFinish, bnGameAtRound, bnGameResult, bnNext, bnOutcome, bnOutcomeExplanation, bnPick,
  type BNGameState, type BNMove,
} from "./bellirith-naiah-minigame";
import { BN_INTIMACY_SCENES, bnRenderChapters, bnRenderOpening, bnVisualState } from "./bellirith-naiah-intimacy";

/* ------------------------------------------------------------------------ */
/* Dossier du Journal                                                        */
/* ------------------------------------------------------------------------ */

const PORTRAITS = [{ src: "/assets/portraits/bellirith.jpg", alt: "Bellirith" }, { src: "/assets/portraits/naiah.jpg", alt: "Naïah" }];

export const BN_INTIMACY_LABELS: Record<BNIntimacyId, string> = {
  "bn-first": "Les coussins volés",
  "bn-limit": "La barque",
  "bn-simulation": "Même là ?",
};

const MOMENT_TITLES: Record<string, string> = Object.fromEntries(BN_POST_MOMENT_IDS.map((id) => [id, bnPostMoment(id)?.title || id]));

export function BNDossier({ progress, onScene, onMinigame, onIntimacy, onMoment }: {
  progress: CrossQuestProgress;
  onScene: (stage: number, replay?: boolean) => void;
  onMinigame: (replay?: boolean) => void;
  onIntimacy: (id: BNIntimacyId, replay?: boolean) => void;
  onMoment: (id: string, replay?: boolean) => void;
}) {
  const bn = progress.bn!;
  const stage = Math.min(progress.stage, BN_STAGE_TOTAL);
  const minigamePending = bnMinigamePending(progress);
  const pending = bnPendingIntimacies(progress);
  const done = Boolean(bn.completed);
  const game = bn.minigame;
  const sceneButton = <button className="primary-action" onClick={() => onScene(stage)}>{bn.checkpoint ? "Reprendre la conversation" : stage === BN_FINAL_STAGE ? "Accepter la revanche" : "Vivre cette étape"}</button>;
  const pendingButtons = pending.length ? <div className="bn-dossier-actions">{pending.map((id) => <button key={id} className="secondary-action" onClick={() => onIntimacy(id)}>Retrouver Bellirith et Naïah · « {BN_INTIMACY_LABELS[id]} »<small> · facultatif, la série continue sans</small></button>)}</div> : null;
  const current = done ? undefined : minigamePending ? {
    title: "La partie des Trois Réponses", objective: BN_MINIGAME_OBJECTIVE,
    action: <div className="bn-dossier-actions"><button className="primary-action" onClick={() => onMinigame(false)}>{game && (game.picks.length || game.round) ? `Reprendre la partie · manche ${Math.min(game.round + 1, BN_ROUND_COUNT)} / ${BN_ROUND_COUNT}` : "S’asseoir à la table"}</button>{pendingButtons}</div>,
  } : {
    title: BN_TITLES[stage], objective: BN_OBJECTIVES[stage],
    action: <div className="bn-dossier-actions">{sceneButton}{pendingButtons}</div>,
  };
  const lived = (["bn-first", "bn-limit", "bn-simulation"] as BNIntimacyId[]).filter((id) => bnIntimacyLived(bn, id));
  const moments = BN_POST_MOMENT_IDS.map((id) => ({ id, title: MOMENT_TITLES[id], done: Boolean(bn.choices[id]) }));
  return <CrossQuestDossier
    className="bn-dossier"
    portraits={PORTRAITS}
    eyebrow="Ce que Bellirith ne lit pas"
    title="Bellirith & Naïah"
    description="Bellirith lit le désir comme d’autres lisent l’heure. Chez Naïah, elle ne trouve rien, et Naïah a décidé d’en faire un jeu. Vous êtes leur témoin."
    progress={stage} total={BN_STAGE_TOTAL}
    current={current}
    completed={done ? {
      title: "La série est accomplie",
      description: "Elles se retrouvent désormais sans vous attendre. Chaque étape reste relisible, et la partie peut être rejouée sans rien changer à la chronique.",
      status: <div className="bn-dossier-actions">{moments.map((moment) => <button key={moment.id} className={moment.done ? "secondary-action" : "primary-action"} onClick={() => onMoment(moment.id, moment.done)}>{moment.done ? "Revoir" : "Moment libre"} · « {moment.title} »</button>)}</div>,
    } : undefined}
    mechanic={stage >= BN_MINIGAME_STAGE ? {
      title: "Les Trois Réponses",
      description: "Bellirith annonce ce que Naïah va répondre. Naïah joue pour la contredire : ◐ SIMULER bat ◆ ASSUMER, ↺ RETOURNER bat ◐ SIMULER, ◆ ASSUMER bat ↺ RETOURNER. Aucune défaite ne ferme la série.",
      status: <span>{game?.completed ? `Partie conclue · Naïah ${game.score} · Bellirith ${game.bellirithScore}` : game ? `Manche ${Math.min(game.round + 1, BN_ROUND_COUNT)} / ${BN_ROUND_COUNT} · partie conservée` : "Partie pas encore commencée"}</span>,
      action: game?.completed ? <button className="secondary-action" onClick={() => onMinigame(true)}>Rejouer la partie (sans effet)</button> : undefined,
    } : undefined}
    milestones={[
      ...BN_TITLES.slice(0, Math.min(stage, BN_TITLES.length)).map((title, index) => ({ id: `s${index}`, title, detail: index === BN_MINIGAME_STAGE ? "Dialogue et partie · relecture protégée" : "Relecture protégée", onReplay: () => onScene(index, true) })),
      ...lived.map((id) => ({ id, title: BN_INTIMACY_LABELS[id], detail: "Souvenir intime · aucun gain", onReplay: () => onIntimacy(id, true), actionLabel: "Revivre" })),
    ]}
  />;
}

/* ------------------------------------------------------------------------ */
/* Mini-jeu « Les Trois Réponses »                                           */
/* ------------------------------------------------------------------------ */

type Format = (text: string) => string;

function useFocusTrap() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    ref.current?.focus();
    return () => { if (previous?.isConnected) previous.focus(); };
  }, []);
  return ref;
}

function lineSpeakerClass(line?: DialogueLine) {
  if (!line) return "";
  return line.speaker === "Narration" ? "narration" : line.speaker === "Bellirith" ? "bellirith" : line.speaker === "Naïah" ? "naiah" : "player";
}

export function BNMinigameModal({ state, replay = false, dev = false, format, onChange, onClose, onFinish, onAnomaly }: {
  state: BNGameState; replay?: boolean; dev?: boolean; format: Format;
  onChange: (state: BNGameState) => void; onClose: () => void; onFinish: (state: BNGameState) => void;
  /** Coupe partiellement la musique pendant la manche hors échelle. */
  onAnomaly?: (active: boolean) => void;
}) {
  const dialog = useFocusTrap();
  const [intro, setIntro] = useState(!state.tutorialSeen && state.picks.length === 0 && state.round === 0 ? 0 : -1);
  const [lineIndex, setLineIndex] = useState(0);
  const [closingIndex, setClosingIndex] = useState(0);
  const [rulesOpen, setRulesOpen] = useState(false);
  const closing = state.round >= BN_ROUND_COUNT;
  const round = BN_ROUNDS[Math.min(state.round, BN_ROUND_COUNT - 1)];
  const pick = state.picks[state.round] as BNMove | undefined;
  const anomaly = !closing && Boolean(round.anomaly);
  const answerLines = useMemo(() => pick ? [...round.answers[pick].lines, ...(round.anomaly ? BN_ANOMALY_AFTERMATH : [])] : [], [pick, round]);
  const answering = Boolean(pick) && lineIndex < answerLines.length;
  const result = closing ? bnGameResult(state) : undefined;
  const closingLines = result ? BN_CLOSINGS[result] : [];
  const line: DialogueLine | undefined = intro >= 0 ? BN_GAME_INTRO[intro] : closing ? closingLines[closingIndex] : answering ? answerLines[lineIndex] : undefined;

  useEffect(() => { setLineIndex(0); }, [state.round, pick]);
  useEffect(() => { onAnomaly?.(anomaly); }, [anomaly, onAnomaly]);
  useEffect(() => () => onAnomaly?.(false), [onAnomaly]);

  const answer = pick ? round.answers[pick] : undefined;
  const speakerMood = (id: "bellirith" | "naiah") => {
    const speaking = line && (id === "bellirith" ? line.speaker === "Bellirith" : line.speaker === "Naïah");
    if (speaking && line?.mood) return line.mood;
    if (answer) return id === "bellirith" ? answer.bellirithMood : answer.naiahMood;
    if (anomaly) return id === "bellirith" ? "cold" : "neutral";
    return id === "bellirith" ? "teasing" : "smirk";
  };
  const speaking = (id: "bellirith" | "naiah") => Boolean(line && (id === "bellirith" ? line.speaker === "Bellirith" : line.speaker === "Naïah"));

  function choose(move: BNMove) {
    if (pick || closing) return;
    onChange(bnPick(state, move));
  }
  function advanceLine() {
    if (intro >= 0) { if (intro < BN_GAME_INTRO.length - 1) setIntro(intro + 1); else setIntro(-1); return; }
    if (closing) { if (closingIndex < closingLines.length - 1) setClosingIndex(closingIndex + 1); return; }
    if (answering) setLineIndex(lineIndex + 1);
  }
  function next() {
    onChange(bnNext(state));
  }
  function finish() {
    const finished = bnFinish(state);
    onFinish(finished);
  }
  function keyDown(event: ReactKeyboardEvent) {
    if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); rulesOpen ? setRulesOpen(false) : onClose(); return; }
    if ((event.key === "Enter" || event.key === " ") && line && (event.target as HTMLElement).tagName !== "BUTTON") { event.preventDefault(); advanceLine(); }
  }
  const outcome = pick ? bnOutcome(state.round, pick) : undefined;
  const closingDone = closing && closingIndex >= closingLines.length - 1;

  return <div className="bn-game-backdrop" role="presentation">
    <section ref={dialog} tabIndex={-1} onKeyDown={keyDown} className={`bn-game ${anomaly ? "bn-anomaly" : ""} ${closing ? "bn-closing" : ""}`} role="dialog" aria-modal="true" aria-labelledby="bn-game-title" data-bn-round={closing ? "fin" : state.round}>
      <header className="bn-game-head">
        <div className="bn-game-title">
          <p className="eyebrow">{replay ? "Souvenir · aucun gain" : "Quêtes croisées · Bellirith & Naïah"}</p>
          <h2 id="bn-game-title">Les Trois Réponses</h2>
        </div>
        <ol className="bn-round-dots" aria-label={`Manche ${Math.min(state.round + 1, BN_ROUND_COUNT)} sur ${BN_ROUND_COUNT}`}>
          {BN_ROUNDS.map((entry, index) => {
            const result = state.picks[index] ? bnOutcome(index, state.picks[index]) : undefined;
            return <li key={entry.id} className={`${index === state.round ? "current" : ""} ${result ? `done ${result}` : ""}`} title={result ? BN_OUTCOME_LABELS[result] : `Manche ${index + 1}`}>{entry.anomaly && result ? "?" : index + 1}</li>;
          })}
        </ol>
        <div className="bn-score" aria-live="polite"><span>Naïah <b>{state.score}</b></span><span>Bellirith <b>{state.bellirithScore}</b></span></div>
        <div className="bn-head-buttons">
          <button type="button" aria-expanded={rulesOpen} onClick={() => setRulesOpen(!rulesOpen)}>Règles</button>
          <button type="button" onClick={onClose}>{replay ? "Quitter le souvenir" : "Reprendre plus tard"}</button>
        </div>
      </header>

      <div className="bn-game-stage">
        <figure className={`bn-game-sprite bellirith ${speaking("bellirith") ? "active" : "quiet"}`}><img src={spritePath("bellirith", speakerMood("bellirith"), "teasing")} alt="Bellirith" /></figure>
        <div className="bn-game-card">
          {closing ? <>
            <p className="bn-card-label">Fin de partie</p>
            <p className="bn-statement">{result === "naiah" ? "Naïah l’emporte" : result === "bellirith" ? "Bellirith l’emporte" : "Match nul"}</p>
            <p className="bn-reading">Naïah {state.score} · Bellirith {state.bellirithScore}. Le score ne ferme aucune porte : il colore seulement la suite.</p>
          </> : <>
            <p className="bn-card-label">{round.tutorial ? "Manche d’essai" : anomaly ? "Dernière question" : `Manche ${state.round + 1}`}{round.tutorial && <span className="bn-tutorial-badge">{BN_MOVE_INFO.simuler.icon} {BN_MOVE_INFO.simuler.label} a l’avantage</span>}</p>
            <p className="bn-statement">« {format(round.statement)} »</p>
            <p className="bn-reading">{format(round.reading)}</p>
            {anomaly
              ? <div className="bn-signal" role="status"><b>{BN_ANOMALY_LABEL}</b><small>{BN_ANOMALY_DETAIL}</small></div>
              : <div className="bn-expected">Bellirith s’attend à : <b>{BN_MOVE_INFO[round.expected!].icon} {BN_MOVE_INFO[round.expected!].label}</b></div>}
            {round.tutorial && !pick && <p className="bn-tutorial-hint">{BN_TUTORIAL_HINT}</p>}
          </>}
        </div>
        <figure className={`bn-game-sprite naiah ${speaking("naiah") ? "active" : "quiet"}`}><img src={spritePath("naiah", speakerMood("naiah"), "smirk")} alt="Naïah" /></figure>
      </div>

      <ol className="bn-cycle" aria-label="Cycle des réponses">
        {BN_CYCLE.map(([winner, loser]) => <li key={winner}><b>{BN_MOVE_INFO[winner].icon} {BN_MOVE_INFO[winner].label}</b> bat {BN_MOVE_INFO[loser].icon} {BN_MOVE_INFO[loser].label}</li>)}
      </ol>

      <footer className="bn-game-foot">
        {line ? <button type="button" className={`bn-line ${lineSpeakerClass(line)}`} onClick={advanceLine}>
          <span className="speaker">{format(line.speaker === "Narration" ? "" : line.speaker)}</span>
          <p>{format(line.text)}</p>
          <small>{intro >= 0 ? `Règles · ${intro + 1} / ${BN_GAME_INTRO.length}` : closing ? `${closingIndex + 1} / ${closingLines.length}` : `${lineIndex + 1} / ${answerLines.length}`} · Cliquer pour continuer</small>
        </button> : null}
        {!line && !pick && !closing && <div className="bn-moves" role="group" aria-label="Comment Naïah joue-t-elle la manche ?">
          {BN_MOVES.map((move) => <button key={move} type="button" className={`bn-move ${move}`} onClick={() => choose(move)}>
            <i aria-hidden="true">{BN_MOVE_INFO[move].icon}</i><strong>{BN_MOVE_INFO[move].label}</strong><small>{BN_MOVE_INFO[move].detail}</small>
          </button>)}
        </div>}
        {!line && pick && !closing && <div className={`bn-result ${outcome}`}>
          <div><b>{BN_OUTCOME_LABELS[outcome!]}</b><small>{bnOutcomeExplanation(state.round, pick)}</small></div>
          <div className="bn-result-actions">
            {dev && <button type="button" onClick={() => onChange(bnGameAtRound(state.round))}>Rejouer cette manche</button>}
            <button type="button" className="primary-action" onClick={next}>{state.round === BN_ROUND_COUNT - 1 ? "Conclure la partie" : "Manche suivante"}</button>
          </div>
        </div>}
        {closingDone && <div className="bn-result fin"><div><b>{replay ? "Fin du souvenir" : "La partie est conclue"}</b><small>{replay ? "Aucun score, aucun gain : la chronique reste inchangée." : "Le résultat colore la suite et accorde un petit bonus de relation."}</small></div><div className="bn-result-actions"><button type="button" className="primary-action" onClick={finish}>{replay ? "Quitter le souvenir" : "Continuer la chronique"}</button></div></div>}
      </footer>

      {rulesOpen && <div className="bn-rules" role="dialog" aria-label="Règles des Trois Réponses">
        <h3>Règles</h3>
        <p>Bellirith énonce une affirmation sur Naïah et annonce la réponse qu’elle lit. Vous choisissez comment Naïah joue la manche.</p>
        <ul>{BN_MOVES.map((move) => <li key={move}><b>{BN_MOVE_INFO[move].icon} {BN_MOVE_INFO[move].label}</b> · {BN_MOVE_INFO[move].detail}</li>)}</ul>
        <p>Jouer la réponse annoncée donne une égalité. Jouer celle qui la bat donne la manche à Naïah. Jouer celle qu’elle bat donne la manche à Bellirith. La partie se poursuit quoi qu’il arrive.</p>
        <button type="button" onClick={() => setRulesOpen(false)}>Fermer</button>
      </div>}
    </section>
  </div>;
}

/* ------------------------------------------------------------------------ */
/* Scènes intimes de la série                                                */
/* ------------------------------------------------------------------------ */

const MODE_LABELS: Record<IntimacyMode, string> = { tendre: "Tendre", suggestif: "Suggestif", explicite: "Explicite · sans coupure", ellipse: "Fondu au noir" };
const STANDARD_MOOD = { bellirith: "seductive", naiah: "smirk" } as const;

export function BNIntimacyModal({ id, mode, sex, replay = false, background, format, onStop, onFinish }: {
  id: BNIntimacyId; mode: IntimacyMode; sex: PlayerSex; replay?: boolean; background: string; format: Format;
  /** Interruption volontaire : la scène s’arrête là, sans conséquence négative. */
  onStop: (chapter: number) => void;
  onFinish: () => void;
}) {
  const scene = BN_INTIMACY_SCENES[id];
  const opening = useMemo(() => bnRenderOpening(scene, sex), [scene, sex]);
  const chapters = useMemo(() => bnRenderChapters(scene, mode, sex), [scene, mode, sex]);
  const [step, setStep] = useState<"opening" | "chapters" | "done">("opening");
  const [chapter, setChapter] = useState(0);
  const [lineIndex, setLineIndex] = useState(0);
  const lines = step === "opening" ? opening : step === "chapters" ? chapters[chapter] || [] : [];
  const line = lines[lineIndex];
  const visual = bnVisualState(scene, mode, step, chapter);
  const lastMoods = useRef<{ bellirith?: string; naiah?: string }>({});
  if (line?.speaker === "Bellirith" && line.mood) lastMoods.current.bellirith = line.mood;
  if (line?.speaker === "Naïah" && line.mood) lastMoods.current.naiah = line.mood;
  const intimateMood = (who: "bellirith" | "naiah") => (step === "done" ? chapters.at(-1)?.[0] : line)?.intimateMoods?.[who];

  function advance() {
    if (lineIndex < lines.length - 1) { setLineIndex(lineIndex + 1); return; }
    if (step === "opening") { setStep("chapters"); setChapter(0); setLineIndex(0); return; }
    if (step === "chapters" && chapter < chapters.length - 1) { setChapter(chapter + 1); setLineIndex(0); return; }
    setStep("done");
  }
  const sprite = (who: "bellirith" | "naiah") => {
    const speaking = line && (who === "bellirith" ? line.speaker === "Bellirith" : line.speaker === "Naïah");
    const nude = visual.nude;
    const src = nude ? intimateSpritePath(who, intimateMood(who)) : spritePath(who, lastMoods.current[who] || STANDARD_MOOD[who], STANDARD_MOOD[who]);
    return <div className={`group-intimacy-sprite ${who === "naiah" ? "first" : "second"} ${speaking ? "active" : "quiet"}`}>
      <img data-sprite-channel={nude ? "intimate" : "standard"} data-bn-sprite={who} src={src} alt="" />
    </div>;
  };
  const sequenceLabel = step === "chapters" ? `Séquence ${chapter + 1} / ${chapters.length} · ` : step === "opening" ? "Prélude · " : "";
  return <section className={`interactive-intimacy group-interactive-intimacy bn-intimacy v2-scene v2-scene-intime ${visual.cg ? `has-intimacy-cg cg-${visual.cg.phase}` : ""}`} data-bn-intimacy={id} style={{ backgroundImage: `linear-gradient(180deg, rgba(5,6,12,.16), rgba(5,6,12,.84)), url(${background})` }}>
    <div className="scene-top intimacy-top">
      <div className="scene-titre"><p className="eyebrow">{replay ? "Souvenir intime · aucun gain" : `Bellirith & Naïah · ${MODE_LABELS[mode]}`}</p><h2>Bellirith & Naïah · {scene.title}</h2></div>
      <div className="scene-outils"><button type="button" className="scene-outil passer" onClick={() => step === "done" ? onFinish() : onStop(step === "opening" ? -1 : chapter)}>{replay ? "Quitter le souvenir" : "Interrompre ici"}</button></div>
    </div>
    {visual.cg
      ? <div className={`intimacy-cg intimacy-cg-${visual.cg.phase}`} data-intimacy-cg={visual.cg.phase} style={{ "--intimacy-cg": `url(/assets/intimacy-cg/${visual.cg.src}.jpg)` } as CSSProperties}><img src={`/assets/intimacy-cg/${visual.cg.src}.jpg`} alt="Illustration intime de la scène" /></div>
      : <div className={`group-intimacy-sprites ${visual.nude ? "uses-intimate-sprites" : "uses-standard-sprites"}`} aria-hidden="true">{sprite("naiah")}{sprite("bellirith")}</div>}
    <div className="dialogue-gradient" />
    {step !== "done" && line && <button className={`dialogue-box intimacy-dialogue ${line.speaker === "Narration" ? "narration" : ""}`} style={{ "--c": line.speaker === "Bellirith" ? "#d9475f" : line.speaker === "Naïah" ? "#9fd3c7" : "var(--or)" } as CSSProperties} onClick={advance}>
      <span className="speaker">{format(line.speaker)}</span>
      <p key={`${step}-${chapter}-${lineIndex}`}>{format(line.text)}</p>
      <small>{sequenceLabel}{lineIndex + 1} / {lines.length}<span className="suite-txt"> · Cliquer pour continuer</span></small><i className="dialogue-suite" aria-hidden="true">▼</i>
    </button>}
    {step === "done" && <div className="intimacy-complete"><p className="eyebrow">{replay ? "Fin du souvenir" : "La nuit s’achève"}</p><h3>{scene.title}</h3><p>{replay ? "Ce souvenir peut être quitté sans modifier la chronique." : scene.detail}</p><button type="button" className="btn principal primary-action" onClick={onFinish}>{replay ? "Quitter le souvenir" : "Continuer la chronique"}</button></div>}
  </section>;
}

/* ------------------------------------------------------------------------ */
/* Bloc développeur                                                          */
/* ------------------------------------------------------------------------ */

export type BNDevActions = {
  start: () => void;
  setStage: (stage: number) => void;
  markComplete: () => void;
  clear: () => void;
  openScene: (stage: number) => void;
  openMinigame: (round: number) => void;
  openIntimacy: (id: BNIntimacyId, mode: IntimacyMode) => void;
  openMoment: (id: string) => void;
};

export function BNDevBlock({ progress, unlockChecks, actions }: { progress?: CrossQuestProgress; unlockChecks: { id: string; label: string; ok: boolean }[]; actions: BNDevActions }) {
  const [stage, setStage] = useState(progress?.stage ?? 0);
  const [round, setRound] = useState(0);
  const [mode, setMode] = useState<IntimacyMode>("explicite");
  const row = (label: string, children: ReactNode) => <div className="dev-row"><span className="dev-help">{label}</span>{children}</div>;
  return <>
    <h3>Bellirith / Naïah</h3>
    <p className="dev-help">Les lancements « ouvrir » sont des souvenirs : aucun gain, aucun temps, aucune mutation. Seuls « Démarrer », « Placer à l’étape », « Marquer accomplie » et « Effacer » modifient la sauvegarde. État : {progress ? `étape ${progress.stage} / ${BN_STAGE_TOTAL}` : "série non démarrée"} · déblocage : {unlockChecks.map((check) => `${check.ok ? "✓" : "✗"} ${check.label}`).join(" · ")}.</p>
    {row("Série :", <>
      <button type="button" onClick={actions.start} disabled={Boolean(progress)}>Démarrer la série</button>
      <label>Étape<select value={stage} onChange={(event) => setStage(Number(event.target.value))}>{[...BN_TITLES.map((title, index) => [index, `${index} · ${title}`] as const), [BN_STAGE_TOTAL, `${BN_STAGE_TOTAL} · Série accomplie`] as const].map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      <button type="button" onClick={() => actions.setStage(stage)}>Placer à l’étape</button>
      <button type="button" onClick={actions.markComplete}>Marquer accomplie</button>
      <button type="button" onClick={actions.clear} disabled={!progress}>Effacer la série</button>
    </>)}
    {row("Scènes :", <>{BN_TITLES.map((title, index) => <button type="button" key={title} onClick={() => actions.openScene(index)}>{index === BN_FINAL_STAGE ? "Ouvrir le rendez-vous final" : index === 4 ? "Ouvrir Q5 directement" : `Q${index + 1} · ${title}`}</button>)}</>)}
    {row("Mini-jeu :", <>
      <label>Manche<select value={round} onChange={(event) => setRound(Number(event.target.value))}>{BN_ROUNDS.map((entry, index) => <option key={entry.id} value={index}>{index + 1}{entry.tutorial ? " · essai" : entry.anomaly ? " · hors échelle" : ""}</option>)}</select></label>
      <button type="button" onClick={() => actions.openMinigame(0)}>Lancer le mini-jeu</button>
      <button type="button" onClick={() => actions.openMinigame(round)}>Forcer la manche</button>
      <button type="button" onClick={() => actions.openMinigame(BN_ANOMALY_ROUND)}>Manche hors échelle</button>
    </>)}
    {row("Intimités :", <>
      <label>Mode<select value={mode} onChange={(event) => setMode(event.target.value as IntimacyMode)}>{(Object.keys(MODE_LABELS) as IntimacyMode[]).map((entry) => <option key={entry} value={entry}>{MODE_LABELS[entry]}</option>)}</select></label>
      {(Object.keys(BN_INTIMACY_LABELS) as BNIntimacyId[]).map((id) => <button type="button" key={id} onClick={() => actions.openIntimacy(id, mode)}>{BN_INTIMACY_LABELS[id]}</button>)}
    </>)}
    {row("Après la série :", <>{BN_POST_MOMENT_IDS.map((id) => <button type="button" key={id} onClick={() => actions.openMoment(id)}>{MOMENT_TITLES[id]}</button>)}</>)}
  </>;
}
