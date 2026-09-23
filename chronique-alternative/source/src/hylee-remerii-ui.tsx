import { useEffect, useMemo, useRef, useState } from "react";
import type { CrossQuestProgress } from "./cross-quests";
import {
  HR_TITLES,
  HR_OBJECTIVES,
  HR_LETTERS,
  hrAmbient,
} from "./hylee-remerii-cross-quest";
import {
  ANCHOR_PHASE_DATA,
  ANCHOR_TARGETS,
  anchorAction,
  anchorPuzzle,
  createAnchorOperation,
  pointCompletion,
  selectAnchor,
  type AnchorPoint,
  type AnchorSpeaker,
  type AnchorState,
} from "./anchor-operation";
import { CrossQuestDossier } from "./cross-quest-dossier";

export function HRDossier({
  progress,
  day,
  onScene,
  onOperation,
  onLetter,
}: {
  progress: CrossQuestProgress;
  day: number;
  onScene: (stage: number, replay?: boolean, recognition?: boolean) => void;
  onOperation: (replay?: boolean) => void;
  onLetter: (id: string) => void;
}) {
  const hr = progress.hr!;
  const result = hr.anchor?.result;
  const resultLabel = result === "controlled"
    ? "Ancrages neutralisés · relevés complets"
    : result === "pressure"
      ? "Ancrages neutralisés · relevés partiels"
      : result === "retreat"
        ? "Repli effectué · nouvelle tentative disponible"
        : undefined;
  const recognitionOpen = hr.branch === "double"
    && progress.stage === 7
    && (!hr.configuration || hr.configuration === "waiting");
  const waitLocked = hr.configuration === "waiting" && day <= (hr.recognitionDay || 0);

  const operationActive = progress.stage === 6 && hr.prepared && (!result || result === "retreat");
  const action = progress.stage < 7 && !operationActive ? (
    <button className="primary-action" onClick={() => onScene(progress.stage)}>{hr.checkpoint ? "Reprendre la conversation" : result ? "Retrouver Hylee et Remerii au col" : "Vivre cette étape"}</button>
  ) : undefined;

  const operationMechanic = progress.stage >= 6 ? {
    title: "Les Trois Points d’Ancrage",
    description: "Une opération tactique en cinq phases sur les trois terrasses périphériques des Serres Rocheuses.",
    status: resultLabel
      ? <span>{resultLabel} · {hr.anchor?.incidents || 0} incident{(hr.anchor?.incidents || 0) > 1 ? "s" : ""}</span>
      : <span>{hr.prepared ? "Opération disponible · progression sauvegardée à chaque phase" : "Préparez d’abord l’opération avec Hylee et Remerii."}</span>,
    action: operationActive
      ? <button className="primary-action" onClick={() => onOperation(false)}>{hr.anchor ? "Reprendre l’opération" : "Gagner les trois terrasses"}</button>
      : progress.stage >= 7
        ? <button className="secondary-action" onClick={() => onOperation(true)}>Rejouer le mini-jeu</button>
        : undefined,
  } : undefined;

  const correspondence = progress.letters.length ? (
    <div className="hr-mail">
      <h3>Correspondance</h3>
      {progress.letters.map((received) => {
        const letter = HR_LETTERS.find((entry) => entry.id === received.id);
        if (!letter) return null;
        return (
          <details
            key={letter.id}
            onToggle={(event) => {
              if (event.currentTarget.open && !received.read) onLetter(letter.id);
            }}
          >
            <summary>{received.read ? "" : "✉ "}{letter.subject}</summary>
            {letter.body.map((line) => <p key={line}>{line}</p>)}
          </details>
        );
      })}
    </div>
  ) : undefined;

  const postSeries = (
    <>
      {hrAmbient(progress.stage).map((line, index) => <p className="hr-ambient" key={index}>{line.text}</p>)}
      {recognitionOpen && (
        <div className="cross-post-series">
          <span>Dynamique à trois</span>
          <h3>Une place à la table</h3>
          <p>{hr.configuration === "waiting"
            ? "Vous avez demandé du temps. La conversation reste ouverte et ne recommencera pas depuis le début."
            : "Hylee et Remerii souhaitent parler de ce que pourrait devenir votre relation à trois."}</p>
          <button
            className="primary-action"
            disabled={waitLocked}
            onClick={() => onScene(7, false, true)}
          >
            Reprendre la conversation à trois
          </button>
          {waitLocked && <small>Disponible à partir du jour suivant.</small>}
        </div>
      )}
      {hr.configuration === "accepted" && <p className="cross-trio-status available">Dynamique à trois acceptée · les rendez-vous sont expliqués dans Relations.</p>}
      {hr.configuration === "separate" && <p className="cross-trio-status">Relations séparées choisies · les cartes restent visibles dans Relations avec cette conséquence.</p>}
      {hr.configuration === "refused" && <p className="cross-trio-status">Rendez-vous à trois refusés · vos liens individuels restent intacts.</p>}
      {Object.keys(hr.choices).some((id) => id.startsWith("cross-hr-recognition")) && (
        <button className="secondary-action" onClick={() => onScene(7, true, true)}>Relire « Une place à la table »</button>
      )}
    </>
  );

  return (
    <CrossQuestDossier
      className="hr-dossier"
      portraits={[
        { src: "/assets/portraits/hylee.jpg", alt: "Hylee" },
        { src: "/assets/portraits/remerii.jpg", alt: "Remerii" },
      ]}
      eyebrow="Mir’Aldas · Serres Rocheuses"
      title="Hylee & Remerii"
      description="Une relation ancienne mise à l’épreuve par la peur de Remerii, l’autonomie d’Hylee et une opération où chacune doit réellement faire confiance à l’autre."
      progress={progress.stage}
      total={7}
      current={progress.stage < 7 ? {
        title: HR_TITLES[progress.stage],
        objective: HR_OBJECTIVES[progress.stage],
        action,
      } : undefined}
      completed={progress.stage === 7 ? {
        title: "Les trois terrasses se sont tues",
        description: "Les relais périphériques ne répondent plus au portail. Hylee a tenu sa place, Remerii lui a fait confiance et leurs relevés protègent désormais les convois.",
        status: resultLabel ? <p>{resultLabel}</p> : undefined,
      } : undefined}
      mechanic={operationMechanic}
      milestones={HR_TITLES.slice(0, progress.stage).map((title, stage) => ({
        id: stage,
        title,
        detail: "Relecture protégée",
        onReplay: () => onScene(stage, true),
      }))}
      correspondence={correspondence}
      postSeries={postSeries}
    />
  );
}

export const ANCHOR_MAP: {
  image: string;
  points: Record<AnchorPoint, [number, number]>;
} = {
  image: "/assets/backgrounds/serres-three-anchors.jpg",
  points: {
    A: [21, 69],
    B: [47.5, 41.5],
    C: [81.5, 68],
  },
};

const symbols = ["◇", "○", "△", "□"];
const arrows = ["↑", "→", "↓", "←"];

function actorPosition(actor: "hylee" | "remerii" | "player", state: AnchorState): [number, number] {
  const target = ANCHOR_TARGETS[state.phase];
  if (actor === "remerii") return state.phase === 3 ? [42, 35] : [50, 34];
  if (actor === "hylee") {
    if (state.phase === 2) return [16, 58];
    if (state.phase >= 4) return [75, 58];
    return target === "C" ? [74, 58] : [34, 52];
  }
  const [x, y] = ANCHOR_MAP.points[state.selected || target];
  return [x + (x > 60 ? -6 : 6), y + 7];
}

function noticeQueue(state: AnchorState): [AnchorSpeaker, string][] {
  if (state.result === "retreat" || state.result === "controlled" || state.result === "pressure") {
    return [[state.speaker || "Narration", state.message]];
  }
  if (state.signalReady) {
    return [
      ["Hylee", "Je peux tenir ce cycle."],
      ["Remerii", "D’accord. Je te crois. À votre signal."],
    ];
  }
  if (state.feedback === "error" || state.feedback === "incident") {
    return [[state.speaker || "Remerii", state.message]];
  }
  const phaseDialogue = ANCHOR_PHASE_DATA[state.phase].dialogue;
  if (state.feedback === "correct" && state.revision > 0) {
    return [[state.speaker || "Narration", state.message], ...phaseDialogue];
  }
  return phaseDialogue;
}

function noticePortrait(speaker: AnchorSpeaker) {
  if (speaker === "Hylee") return "/assets/portraits/hylee.jpg";
  if (speaker === "Remerii") return "/assets/portraits/remerii.jpg";
  return undefined;
}

export function AnchorOperationModal({
  state,
  onChange,
  onFinish,
  onClose,
  replay = false,
}: {
  state: AnchorState;
  onChange: (state: AnchorState) => void;
  onFinish: () => void;
  onClose: () => void;
  replay?: boolean;
}) {
  const latest = useRef(state);
  const dialog = useRef<HTMLElement>(null);
  const [noticeIndex, setNoticeIndex] = useState(0);
  const queue = useMemo(() => noticeQueue(state), [state.phase, state.revision, state.result, state.signalReady, state.feedback]);
  const puzzle = anchorPuzzle(state);
  const phase = ANCHOR_PHASE_DATA[state.phase];
  latest.current = state;

  useEffect(() => {
    setNoticeIndex(0);
  }, [state.phase, state.revision, state.result, state.signalReady]);

  useEffect(() => {
    if (noticeIndex >= queue.length - 1) return;
    const timer = window.setTimeout(() => setNoticeIndex((index) => index + 1), 5000);
    return () => window.clearTimeout(timer);
  }, [noticeIndex, queue]);

  useEffect(() => {
    if (!state.memorizing || state.result) return;
    const timer = window.setTimeout(() => onChange(anchorAction(latest.current, "remember")), 4500);
    return () => window.clearTimeout(timer);
  }, [state.memorizing, state.phase, state.revision, state.result, onChange]);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    dialog.current?.focus();
    return () => previous?.focus();
  }, []);

  function keyDown(event: React.KeyboardEvent) {
    if (event.key === "Escape") {
      onClose();
      return;
    }
    if (event.key !== "Tab") return;
    const controls = Array.from(dialog.current?.querySelectorAll<HTMLElement>("button:not(:disabled)") || []);
    const first = controls[0];
    const last = controls.at(-1);
    if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog.current)) {
      event.preventDefault();
      last?.focus();
    }
    if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  const [noticeSpeaker, noticeText] = queue[Math.min(noticeIndex, queue.length - 1)] || ["Narration", state.message];
  const operationState = state.result === "retreat"
    ? "retreat"
    : state.result
      ? "success"
      : state.feedback === "incident"
        ? "incident"
        : state.errors > 0
          ? "tension"
          : "normal";

  return (
    <div className="modal-backdrop anchor-backdrop">
      <section
        ref={dialog}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Les Trois Points d’Ancrage"
        className={`anchor-operation state-${operationState}`}
        onKeyDown={keyDown}
      >
        <header className="anchor-heading">
          <div>
            <p className="eyebrow">{replay ? "Relecture tactique · aucun gain" : "Opération · Serres Rocheuses"}</p>
            <h2>Les Trois Points d’Ancrage</h2>
            <p>Le portail reste hors de portée. Neutralisez seulement ses trois relais périphériques.</p>
          </div>
          <div className="anchor-hud">
            <span><small>Phase</small><b>{state.phase + 1} / {ANCHOR_PHASE_DATA.length}</b></span>
            <span><small>Relais</small><b>{state.solved.length} / {ANCHOR_PHASE_DATA.length}</b></span>
            <span><small>Incidents</small><b>{state.incidents} / 2</b></span>
            <span><small>État</small><b>{operationState === "normal" ? "Stable" : operationState === "tension" ? "Tension" : operationState === "incident" ? "Incident" : operationState === "retreat" ? "Repli" : "Réussite"}</b></span>
          </div>
        </header>
        <button className="anchor-close" onClick={onClose} aria-label={replay ? "Fermer la relecture" : "Fermer et conserver la progression"}>×</button>

        <div className="anchor-stage">
          <div className="anchor-map" style={{ backgroundImage: `url(${ANCHOR_MAP.image})` }}>
            <div className="anchor-map-vignette" />
            <svg className="anchor-links" viewBox="0 0 100 56.25" preserveAspectRatio="none" aria-hidden="true">
              <path className={state.phase === 0 || state.phase === 2 || state.phase === 3 ? "hot" : ""} d="M21 38.8 C31 30, 39 25, 47.5 23.3" />
              <path className={state.phase === 1 || state.phase === 4 ? "hot" : ""} d="M47.5 23.3 C59 29, 70 33, 81.5 38.25" />
              <path className={state.phase === 4 ? "hot" : ""} d="M21 38.8 C42 49, 64 49, 81.5 38.25" />
            </svg>
            <span className="anchor-portal-label">Portail · hors de portée</span>

            {(Object.keys(ANCHOR_MAP.points) as AnchorPoint[]).map((point) => {
              const completion = pointCompletion(state, point);
              const wrong = state.lastPoint === point && (state.feedback === "error" || state.feedback === "incident");
              return (
                <button
                  key={point}
                  className={[
                    "anchor-point",
                    ANCHOR_TARGETS[state.phase] === point ? "hot" : "",
                    state.selected === point ? "selected" : "",
                    completion.completed ? "contained" : "",
                    completion.done ? "done" : "",
                    wrong ? "wrong" : "",
                  ].filter(Boolean).join(" ")}
                  style={{ left: `${ANCHOR_MAP.points[point][0]}%`, top: `${ANCHOR_MAP.points[point][1]}%` }}
                  aria-label={`Examiner le point ${point} · ${completion.completed} étape sur ${completion.total}`}
                  disabled={Boolean(state.result || state.signalReady)}
                  onClick={() => onChange(selectAnchor(state, point))}
                >
                  <b>{point}</b>
                  <small>{completion.completed}/{completion.total}</small>
                </button>
              );
            })}

            {(["hylee", "remerii", "player"] as const).map((actor) => {
              const [left, top] = actorPosition(actor, state);
              const portrait = actor === "hylee"
                ? "/assets/portraits/hylee.jpg"
                : actor === "remerii"
                  ? "/assets/portraits/remerii.jpg"
                  : undefined;
              return (
                <div className={`anchor-actor ${actor}`} style={{ left: `${left}%`, top: `${top}%` }} key={actor}>
                  {portrait ? <img src={portrait} alt="" /> : <span>V</span>}
                  <small>{actor === "hylee" ? "Hylee" : actor === "remerii" ? "Remerii" : "Vous"}</small>
                </div>
              );
            })}

            <div className={`anchor-vn-notice speaker-${noticeSpeaker.toLowerCase()}`} aria-live="polite">
              {noticePortrait(noticeSpeaker)
                ? <img src={noticePortrait(noticeSpeaker)} alt="" />
                : <span className="anchor-player-mark">V</span>}
              <div>
                <b>{noticeSpeaker}</b>
                <p>{noticeText}</p>
              </div>
            </div>
          </div>

          <aside className="anchor-objective-deck">
            <span>Phase {state.phase + 1} · {phase.name}</span>
            <h3>{phase.short}</h3>
            <p>{phase.objective}</p>
            <small>{state.signalReady ? "Hylee et Remerii attendent votre signal." : state.selected ? `Micro-énigme ouverte sur ${state.selected}` : "Choisissez une terrasse directement sur la carte."}</small>
          </aside>
        </div>

        <div className={`anchor-controls ${state.selected ? "puzzle-open" : ""}`}>
          {state.result ? (
            <div className="anchor-result-panel">
              <span>{state.result === "retreat" ? "Voie de retour préservée" : "Opération accomplie"}</span>
              <h3>{state.result === "retreat" ? "Repli" : "Les trois relais se sont tus"}</h3>
              <p>{state.result === "retreat"
                ? "Vous avez regagné le col avant la seconde rupture. La phase atteinte reste consignée ; une nouvelle tentative peut être préparée sans bloquer la quête."
                : state.result === "pressure"
                  ? "Un incident a endommagé une partie des relevés, mais les mécanismes périphériques sont neutralisés."
                  : "Le cycle complet est relevé et les trois mécanismes périphériques sont neutralisés sans incident."}</p>
              {state.result === "retreat"
                ? <button className="primary-action" onClick={() => onChange(createAnchorOperation(state.seed + 1))}>Préparer une nouvelle tentative</button>
                : <button className="primary-action" onClick={onFinish}>{replay ? "Terminer la relecture" : "Retrouver Hylee et Remerii"}</button>}
            </div>
          ) : state.signalReady ? (
            <div className="anchor-signal-panel">
              <span>Synchronisation prête</span>
              <h3>Hylee tient le dernier cycle</h3>
              <p>Remerii a choisi de lui faire confiance. Abaissez la poignée et donnez le signal commun.</p>
              <button className="primary-action" onClick={() => onChange(anchorAction(state, "signal"))}>Abaisser la poignée · donner le signal</button>
            </div>
          ) : !state.selected ? (
            <div className="anchor-instruction">
              <strong>{phase.hint}</strong>
              <p>Deux erreurs provoquent un incident. Deux incidents imposent le repli, sans perdre la possibilité de reprendre l’opération.</p>
            </div>
          ) : (
            <div className="anchor-puzzle-panel">
              {state.selected === "A" && (
                <>
                  <span>Ancrage A · micro-énigme</span>
                  <h3>Orientation du givre</h3>
                  <p>Alignez les trois flux sur les repères gravés au-dessus du noyau.</p>
                  <div className="anchor-dials">
                    {puzzle.directions.map((direction, index) => (
                      <div key={index}>
                        <span>Repère {index + 1} · {arrows[direction]}</span>
                        <button aria-label={`Tourner le cadran ${index + 1}, actuellement ${arrows[state.input[index]]}`} onClick={() => onChange(anchorAction(state, index))}>{arrows[state.input[index]]}</button>
                      </div>
                    ))}
                  </div>
                  <button className="primary-action" onClick={() => onChange(anchorAction(state, "check"))}>Engager les trois verrous</button>
                </>
              )}
              {state.selected === "B" && (
                <>
                  <span>Ancrage B · micro-énigme</span>
                  <h3>Pont de résonance</h3>
                  <p>Un signe rompt l’alternance. Sélectionnez la plaque parasite.</p>
                  <div className="anchor-runes">
                    {puzzle.runes.map((rune, index) => <button key={index} aria-label={`Plaque ${index + 1} : ${symbols[rune]}`} onClick={() => onChange(anchorAction(state, index))}>{symbols[rune]}</button>)}
                  </div>
                </>
              )}
              {state.selected === "C" && (
                <>
                  <span>Ancrage C · micro-énigme</span>
                  <h3>Impulsion du relais</h3>
                  <p>{state.memorizing ? "Mémorisez les quatre repères dans l’ordre." : `Reproduisez la suite · ${state.input.length}/4`}</p>
                  <div className="anchor-sequence" aria-live="polite">
                    {state.memorizing
                      ? puzzle.pulses.map((number, index) => <span key={index}>{symbols[number]}</span>)
                      : <span>{state.input.length ? state.input.map((number) => symbols[number]).join(" ") : "• • • •"}</span>}
                  </div>
                  <div className="anchor-runes">
                    {symbols.map((symbol, index) => <button key={symbol} disabled={state.memorizing} aria-label={`Impulsion ${symbol}`} onClick={() => onChange(anchorAction(state, index))}>{symbol}</button>)}
                  </div>
                  {!state.memorizing && <button onClick={() => onChange({ ...state, input: [], memorizing: true, revision: state.revision + 1 })}>Revoir la suite</button>}
                </>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
