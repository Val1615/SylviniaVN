import { useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from "react";
import { CrossQuestDossier } from "./cross-quest-dossier";
import type { CrossQuestProgress } from "./cross-quests";
import type { DialogueLine } from "./game-data";
import type { IntimacyMode, PlayerSex } from "./date-scenes";
import { spritePath } from "./sprite-system";
import { intimateSpritePath } from "./intimate-sprite-system";
import { BV_OBJECTIVES, BV_STAGE_TOTAL, BV_TITLES, BV_SCENE_TITLES, BV_DATE_STAGE, bvAvailableScenes, type BVIntimacyId } from "./bellirith-valurn-cross-quest";
import {
  BV_NEVER_MODE_LABELS, BV_PRESSION_MAX, bvIvresseSeuils, createBVNever, bvActorAt, bvPressionLevel, bvAnswer, bvDrinksAt, bvIvresse, bvNpcTurn, bvPlayerOptions, bvPlayerTurn, bvRecordView, bvTransition,
  type BVActor, type BVAnswer, type BVMode, type BVNeverState, type BVTruthCtx,
} from "./bellirith-valurn-never-game";
import { bvIntimacyScene } from "./bellirith-valurn-intimacy";
import { bvIntimateVisible, bvRenderChapters, bvRenderOpening } from "./bellirith-valurn-intimacy-kit";
import { ROMAINS } from "./ui/v2/common";
import { SceneBacklog, SceneControls, useRollback, useSceneBacklog, useSceneShortcuts } from "./scene-controls";

type Format = (text: string) => string;

const PORTRAITS = [{ src: "/assets/portraits/bellirith.jpg", alt: "Bellirith" }, { src: "/assets/portraits/valurn.jpg", alt: "Valurn" }];

export const BV_INTIMACY_LABELS: Record<BVIntimacyId, string> = {
  "bv-a": "Bellirith, seule",
  "bv-b": "Valurn, seul",
  "bv-c": "Deux portes, une seule règle",
};

/* ------------------------------------------------------------------------ */
/* Dossier du Journal                                                        */
/* ------------------------------------------------------------------------ */

export function BVDossier({ progress, day, onScene, onNever, onIntimacy }: {
  progress: CrossQuestProgress; day: number;
  onScene: (sceneId: string, replay?: boolean) => void;
  onNever: (replay?: boolean) => void;
  onIntimacy: (replay?: boolean) => void;
}) {
  const bv = progress.bv!;
  const stage = Math.min(progress.stage, BV_STAGE_TOTAL);
  const available = bvAvailableScenes(progress, day);
  const never = bv.never;
  const pendingIntimacy = bv.intimacy && !bv.intimacyStatus;
  const done = Boolean(bv.completed);
  const actions: ReactNode[] = [];
  if (available.never) actions.push(<button key="never" className="primary-action" onClick={() => onNever(false)}>{never && never.log.length ? `Reprendre la soirée · tour ${never.round} · ${BV_NEVER_MODE_LABELS[never.mode || "complete"]}` : "Rejoindre la table"}</button>);
  for (const id of available.scenes) actions.push(<button key={id} className={actions.length ? "secondary-action" : "primary-action"} onClick={() => onScene(id)}>{bv.checkpoint?.sceneId === id ? "Reprendre" : "Vivre"} · « {BV_SCENE_TITLES[id] || id} »{done ? <small> · facultatif</small> : null}</button>);
  if (pendingIntimacy) actions.push(<button key="intim" className="secondary-action" onClick={() => onIntimacy(false)}>Retrouver la nuit promise · « {BV_INTIMACY_LABELS[bv.intimacy!]} »<small> · facultatif</small></button>);
  const waiting = available.waitTomorrow ? <p className="bv-wait">La soirée est encore trop proche. Les lendemains se vivent le jour suivant.</p> : null;
  const current = done ? undefined : { title: BV_TITLES[stage], objective: BV_OBJECTIVES[stage], action: <div className="bn-dossier-actions">{actions}{waiting}</div> };
  const lived = Object.keys(bv.choices);
  return <CrossQuestDossier
    className="bv-dossier"
    portraits={PORTRAITS}
    eyebrow="Ce que le talisman cachait"
    title="Bellirith & Valurn"
    description="Une demi-sœur, un demi-frère, des siècles de comptes jamais soldés. Ils vous ont choisi comme témoin, puis comme invité, puis comme quelqu’un qu’on regarde vraiment."
    progress={stage} total={BV_STAGE_TOTAL}
    current={current}
    completed={done ? {
      title: "La série est accomplie",
      description: "Les retombées continuent d’arriver au fil des jours. Chaque étape reste relisible sans effet.",
      status: <div className="bn-dossier-actions">{actions.length ? actions : <span>Aucune retombée en attente.</span>}</div>,
    } : undefined}
    mechanic={stage >= BV_DATE_STAGE ? {
      title: "Je n’ai jamais",
      description: "Chacun son tour, Bellirith, Valurn, puis vous : une affirmation, et ceux qui l’ont fait boivent. La partie dure de dix à vingt tours selon votre façon de jouer.",
      status: <span>{never?.completed ? `Soirée achevée en ${never.round} tours · ${BV_NEVER_MODE_LABELS[never.mode || "complete"]}` : never && (never.mode || never.log.length) ? `Tour ${never.round} · soirée conservée · ${BV_NEVER_MODE_LABELS[never.mode || "complete"]}` : "Soirée pas encore commencée"}</span>,
      action: never?.completed ? <button className="secondary-action" onClick={() => onNever(true)}>Rejouer la soirée (sans effet) · format au choix</button> : undefined,
    } : undefined}
    milestones={[
      ...lived.map((id) => ({ id, title: BV_SCENE_TITLES[id] || id, detail: "Relecture protégée", onReplay: () => onScene(id, true) })),
      ...(bv.intimacyStatus === "lived" && bv.intimacy ? [{ id: "intim", title: BV_INTIMACY_LABELS[bv.intimacy], detail: "Souvenir intime · aucun gain", onReplay: () => onIntimacy(true), actionLabel: "Revivre" }] : []),
    ]}
  />;
}

/* ------------------------------------------------------------------------ */
/* « Je n’ai jamais »                                                        */
/* ------------------------------------------------------------------------ */

const NAMES: Record<BVActor, string> = { bellirith: "Bellirith", valurn: "Valurn", player: "Vous" };
const IVRESSE_LABELS = { sobre: "Sobre", gris: "Gris", ivre: "Ivre" } as const;
const ANSWERS: { id: BVAnswer; label: string; detail: string }[] = [
  { id: "acknowledge", label: "Reconnaître", detail: "Vous buvez." },
  { id: "deny", label: "Nier", detail: "Votre verre reste posé." },
  { id: "dodge", label: "Esquiver", detail: "Un sourire, et la table passe." },
];

function useFocusTrap() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    ref.current?.focus();
    return () => { if (previous?.isConnected) previous.focus(); };
  }, []);
  return ref;
}

/** Carte d’annonce d’une affirmation : temps de tenue, puis envol vers le panneau. */
export const BV_CARD_HOLD_MS = 1350;
export const BV_CARD_FLY_MS = 450;

const lineClass = (line?: DialogueLine) => !line ? "" : line.speaker === "Narration" ? "narration" : line.speaker === "Bellirith" ? "bellirith" : line.speaker === "Valurn" ? "valurn" : "player";

export function BVNeverModal({ state, ctx, replay = false, background, format, onChange, onClose, onFinish }: {
  state: BVNeverState; ctx: BVTruthCtx; replay?: boolean; background: string; format: Format;
  onChange: (state: BVNeverState) => void; onClose: () => void; onFinish: (state: BVNeverState) => void;
}) {
  const dialog = useFocusTrap();
  // Les interventions déjà lues à l’ouverture ne sont pas rejouées (reprise).
  // Une question encore en attente à la reprise reste affichée, pour qu’on puisse y répondre.
  const [seen, setSeen] = useState(state.awaiting ? Math.max(0, state.log.length - 1) : state.log.length);
  const [lineIndex, setLineIndex] = useState(0);
  const [transitionRound, setTransitionRound] = useState(0);
  const view = seen < state.log.length ? bvRecordView(state, seen) : undefined;
  const awaitingHere = Boolean(view && state.awaiting && seen === state.log.length - 1);
  // Ordre fixe d’un échange : l’affirmation, votre réplique, qui boit, ce qu’on vous répond, puis leurs piques entre eux.
  const reading: (DialogueLine & { to?: string; step?: string })[] = view ? [view.declaration, ...(awaitingHere ? [] : view.lines)] : [];
  const line = reading[Math.min(lineIndex, Math.max(0, reading.length - 1))];
  const revealAt = view ? 1 + view.lines.findIndex((entry) => entry.step === "verres") : 0;
  const choosingMode = !state.mode && state.log.length === 0 && !state.completed;
  const actor = bvActorAt(state);
  const transition = !choosingMode && !view && !state.completed && state.turn === 0 && transitionRound !== state.round ? bvTransition(state) : undefined;
  const options = useMemo(() => !choosingMode && !view && !transition && actor === "player" && !state.completed ? bvPlayerOptions(state, ctx) : [], [choosingMode, view, transition, actor, state, ctx]);

  useEffect(() => { setLineIndex(0); }, [seen]);

  // Carte d’annonce : chaque nouvelle affirmation s’affiche en grand, tient un instant, puis rejoint le panneau du haut.
  // À la reprise, seule une affirmation encore en attente de réponse est rejouée (vue présente à l’ouverture).
  const viewKey = view ? seen : -1;
  const [card, setCard] = useState<{ key: number; phase: "show" | "fly" } | undefined>(view ? { key: seen, phase: "show" } : undefined);
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) { mounted.current = true; return; }
    setCard(viewKey >= 0 ? { key: viewKey, phase: "show" } : undefined);
  }, [viewKey]);
  useEffect(() => {
    if (!card) return;
    const timer = window.setTimeout(() => setCard(card.phase === "show" ? { ...card, phase: "fly" } : undefined), card.phase === "show" ? BV_CARD_HOLD_MS : BV_CARD_FLY_MS);
    return () => window.clearTimeout(timer);
  }, [card]);
  const cardOn = Boolean(card && view && card.key === seen);
  function skipCard() { setCard(card?.phase === "show" ? { ...card, phase: "fly" } : undefined); }

  const lastMood = useRef<{ bellirith?: string; valurn?: string }>({});
  if (line?.speaker === "Bellirith" && line.mood) lastMood.current.bellirith = line.mood;
  if (line?.speaker === "Valurn" && line.mood) lastMood.current.valurn = line.mood;

  function advanceLine() {
    if (cardOn) { skipCard(); return; }
    if (!view) { if (transition) setTransitionRound(state.round); return; }
    if (awaitingHere) return;
    if (lineIndex < reading.length - 1) { setLineIndex(lineIndex + 1); return; }
    setSeen(seen + 1);
  }
  function npc() { onChange(bvNpcTurn(state, ctx)); }
  function answer(id: BVAnswer) { onChange(bvAnswer(state, id)); setLineIndex(1); }
  function chooseMode(mode: BVMode) { onChange({ ...createBVNever(state.seed, mode), tutorialSeen: state.tutorialSeen }); }
  function play(id: string) { onChange(bvPlayerTurn(state, id, ctx)); }
  function keyDown(event: ReactKeyboardEvent) {
    if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); onClose(); return; }
    if ((event.key === "Enter" || event.key === " ") && (event.target as HTMLElement).tagName !== "BUTTON") { event.preventDefault(); advanceLine(); }
  }
  const drinkers = view?.record.drinkers || [];
  const showGlasses = Boolean(view) && !awaitingHere && revealAt > 0 && lineIndex >= revealAt;
  const finished = state.completed && !view;
  const shownLine = transition && !view ? transition : line;
  // Jauge d’ivresse : les verres comptent dès qu’ils sont levés à l’écran, pas avant.
  // Pression : quand Bellirith ou Valurn vous somme de répondre. Intensité 1 à 3 selon l’enjeu et l’ivresse de qui presse.
  const presser = awaitingHere && view && view.record.speaker !== "player" ? view.record.speaker : undefined;
  const pressure = presser ? bvPressionLevel(state, seen) : 0;
  const gauge = bvDrinksAt(state, view ? (showGlasses ? seen : seen - 1) : state.log.length - 1);

  const speaking = shownLine?.speaker === "Bellirith" ? "bellirith" : shownLine?.speaker === "Valurn" ? "valurn" : !view && !finished && actor !== "player" ? actor : undefined;
  const sprite = (who: "bellirith" | "valurn", index: number) => <img key={who} className={`scene-sprite speaker-${index} ${speaking === who ? "active" : "inactive"}`} src={spritePath(who, lastMood.current[who] || (who === "bellirith" ? "teasing" : "charming"), who === "bellirith" ? "teasing" : "charming")} alt={NAMES[who]} />;
  const box = (speaker: string, text: string, hint: string, kind: string, to?: string) => <button type="button" className={`dialogue-box bv-advance ${kind}`} onClick={advanceLine}>
    <span className="speaker">{speaker}{to && <em className="bv-to"> · à {to}</em>}</span><p key={`${seen}-${lineIndex}-${transitionRound}`}>{text}</p><small>Tour {ROMAINS[state.round] || state.round}<span className="suite-txt"> · {hint}</span></small><i className="dialogue-suite" aria-hidden="true">▼</i>
  </button>;

  return <section ref={dialog} tabIndex={-1} onKeyDown={keyDown} className={`dialogue-overlay v2-scene bv-never ${presser ? `bv-pression bv-pression-${presser}` : ""}`} role="dialog" aria-modal="true" aria-labelledby="bv-never-title" data-bv-round={state.round} data-pression={pressure || undefined}
    style={{ backgroundImage: `linear-gradient(180deg, rgba(5,6,12,.12), rgba(5,6,12,.62)), url(${background})` } as CSSProperties}>
    <div className="scene-top"><div className="scene-titre"><p className="eyebrow">{replay ? "Souvenir · aucun gain" : "Quêtes croisées · Bellirith & Valurn"}</p><h2 id="bv-never-title">Je n’ai jamais</h2></div>
      <div className="scene-outils"><span className="bv-round" aria-live="polite">Tour {ROMAINS[state.round] || state.round}{state.mode === "abregee" ? " · abrégée" : ""}</span><button type="button" className="scene-outil passer" onClick={onClose}>{replay ? "Quitter le souvenir" : "Reprendre plus tard"}</button></div></div>
    <div className="scene-cast cast-2">{sprite("bellirith", 0)}{sprite("valurn", 1)}</div>
    <div className="dialogue-gradient" />
    {presser && <div className="bv-pression-voile" aria-hidden="true" />}
    {cardOn && view && <div className={`bv-carte bv-carte-${view.record.speaker} ${card!.phase}`} data-bv-carte={card!.phase} onClick={skipCard} role="presentation">
      <div className="bv-carte-corps">
        <p className="bv-carte-tour">Tour {ROMAINS[state.round] || state.round}</p>
        <p className="bv-carte-qui">{view.record.speaker === "player" ? "Vous" : NAMES[view.record.speaker]}{view.declaration.to && <span> · à {view.declaration.to}</span>}</p>
        <p className="bv-carte-texte">« {format(view.declaration.text)} »</p>
        <small>Toucher pour passer</small>
      </div>
    </div>}

    <aside className={`bv-table ${view ? "claim" : finished ? "fin" : "turn"}`} aria-live="polite">
      <ul className="bv-ivresse" aria-label="Ivresse">
        {(["bellirith", "valurn", "player"] as BVActor[]).map((who) => {
          const count = gauge[who];
          const level = bvIvresse(count, state.mode, who);
          const seuils = bvIvresseSeuils(state.mode, who);
          return <li key={who} className={`ivresse-${level}`} data-ivresse={level}>
            <span className="bv-ivresse-nom">{NAMES[who]}</span>
            <span className="bv-ivresse-jauge" role="meter" aria-valuemin={0} aria-valuemax={seuils.max} aria-valuenow={Math.min(count, seuils.max)} aria-label={`Ivresse de ${NAMES[who]} : ${IVRESSE_LABELS[level]}`}><i style={{ width: `${Math.min(100, (count / seuils.max) * 100)}%` }} /></span>
            <small>{IVRESSE_LABELS[level]}</small>
          </li>;
        })}
      </ul>
      {view ? <>
        <p className="bv-table-label">{view.record.speaker === "player" ? "Votre affirmation" : `${NAMES[view.record.speaker]} prend la parole`}{view.declaration.to && <> · à {view.declaration.to}</>}</p>
        <p className="bv-table-claim">« {format(view.declaration.text)} »</p>
        <ol className="bv-glasses" aria-label="Qui boit ?">
          {(["bellirith", "valurn", "player"] as BVActor[]).map((who) => <li key={who} className={showGlasses && drinkers.includes(who) ? "drank" : "full"}><i aria-hidden="true" />{NAMES[who]}<small>{showGlasses ? drinkers.includes(who) ? "boit" : "ne boit pas" : "…"}</small></li>)}
        </ol>
        {presser && <p className="bv-pression-crans" aria-label={`Pression de ${NAMES[presser]} : ${pressure} sur ${BV_PRESSION_MAX}`}>Pression {Array.from({ length: BV_PRESSION_MAX }, (_, i) => <i key={i} className={i < pressure ? "on" : ""} />)}</p>}
        {showGlasses && view.playerReason && <p className="bv-table-note">Vous buvez : {format(view.playerReason)}</p>}
      </> : finished ? <>
        <p className="bv-table-label">Fin de la soirée</p>
        <p className="bv-table-claim">Les verres sont posés.</p>
        <p className="bv-table-note">{state.round} tours de table. Ce qui a été dit reste dit.</p>
      </> : <>
        <p className="bv-table-label">{actor === "player" ? "À vous" : `Au tour de ${NAMES[actor]}`}</p>
        <p className="bv-table-note">{actor === "player" ? "Choisissez une affirmation. Ceux qui l’ont fait boivent ; vous aussi, si c’est vrai pour vous." : "La table attend."}</p>
      </>}
    </aside>

    {shownLine && !awaitingHere && box(format(shownLine.speaker), format(shownLine.text), "Cliquer pour continuer", lineClass(shownLine) === "narration" ? "narration" : "", (shownLine as { to?: string }).to ? format((shownLine as { to?: string }).to!) : undefined)}
    {choosingMode && <div className="choice-box bv-mode" role="group" aria-label="Format de la soirée">
      <p className="choice-question">Combien de temps dure la soirée ?</p>
      {(["complete", "abregee"] as BVMode[]).map((mode, index) => <button key={mode} type="button" className="v2-choix-carte" style={{ "--i": index } as CSSProperties} onClick={() => chooseMode(mode)}><i className="choix-num">{ROMAINS[index + 1]}</i><div><strong>{BV_NEVER_MODE_LABELS[mode]}</strong><small>{mode === "complete" ? "Dix à vingt tours de table, toutes les affirmations, le temps de tout dire." : "Huit à dix tours : le meilleur de la soirée, le tournant, les révélations, et les verres qui montent plus vite."}</small></div></button>)}
    </div>}
    {awaitingHere && <div className="choice-box bv-answers" role="group" aria-label="Votre réponse">
      <p className="choice-question">{format(view!.ask || "Reconnaître, nier ou esquiver ?")}</p>
      {ANSWERS.map((entry, index) => <button key={entry.id} type="button" className="v2-choix-carte" style={{ "--i": index } as CSSProperties} onClick={() => answer(entry.id)}><i className="choix-num">{ROMAINS[index + 1]}</i><div><strong>{entry.label}</strong><small>{entry.detail}</small></div></button>)}
    </div>}
    {!choosingMode && !view && !transition && !state.completed && actor !== "player" && <button type="button" className="dialogue-box bv-advance narration" onClick={npc}><span className="speaker">Narration</span><p>{NAMES[actor]} lève son verre et cherche une affirmation.</p><small>Tour {ROMAINS[state.round] || state.round}<span className="suite-txt"> · Cliquer pour l’écouter</span></small><i className="dialogue-suite" aria-hidden="true">▼</i></button>}
    {options.length > 0 && <div className="choice-box bv-options" role="group" aria-label="Vos affirmations">
      <p className="choice-question">Votre affirmation</p>
      {options.map((claim, index) => <button key={claim.id} type="button" className="v2-choix-carte" style={{ "--i": index } as CSSProperties} onClick={() => play(claim.id)}><i className="choix-num">{ROMAINS[index + 1]}</i><div><strong>« {format(claim.text)} »</strong></div></button>)}
    </div>}
    {finished && <div className="choice-box bv-fin"><p className="choice-question">{replay ? "Fin du souvenir" : "La soirée s’achève"}</p>
      <button type="button" className="v2-choix-carte" style={{ "--i": 0 } as CSSProperties} onClick={() => onFinish(state)}><i className="choix-num">I</i><div><strong>{replay ? "Quitter le souvenir" : "Continuer"}</strong><small>{replay ? "Aucun effet : la chronique reste inchangée." : "Les verres sont vides. Il reste à savoir comment finit la nuit."}</small></div></button>
    </div>}
  </section>;
}

/* ------------------------------------------------------------------------ */
/* Intimités                                                                 */
/* ------------------------------------------------------------------------ */

export const BV_MODE_LABELS: Record<IntimacyMode, string> = { tendre: "Tendre", suggestif: "Suggestif", explicite: "Explicite · sans coupure", ellipse: "Fondu au noir" };

export function BVIntimacyModal({ id, mode, sex, replay = false, background, format, onStop, onFinish }: {
  id: BVIntimacyId; mode: IntimacyMode; sex: PlayerSex; replay?: boolean; background: string; format: Format;
  onStop: (chapter: number) => void; onFinish: () => void;
}) {
  const scene = bvIntimacyScene(id.slice(3) as "a" | "b" | "c", sex);
  const opening = useMemo(() => bvRenderOpening(scene), [scene]);
  const chapters = useMemo(() => bvRenderChapters(scene, mode), [scene, mode]);
  const [step, setStep] = useState<"opening" | "chapters" | "done">("opening");
  const [chapter, setChapter] = useState(0);
  const [lineIndex, setLineIndex] = useState(0);
  const lines = step === "opening" ? opening : step === "chapters" ? chapters[chapter] || [] : [];
  const line = lines[lineIndex];
  const sectionRef = useRef<HTMLElement>(null);
  const rollback = useRollback<{ step: "opening" | "chapters" | "done"; chapter: number; lineIndex: number }>();
  const lineKey = `${step}|${chapter}|${lineIndex}|${line?.speaker}|${line?.text}`;
  const { backlog, backlogOpen, setBacklogOpen, backlogRef, rewind } = useSceneBacklog(`${id}:${mode}:${replay ? "r" : "l"}`, lineKey, line, step !== "done", format, ["bellirith", "valurn"]);
  function back() {
    const previous = rollback.pop();
    if (!previous) return;
    if (step !== "done") rewind(lineKey);
    setStep(previous.step); setChapter(previous.chapter); setLineIndex(previous.lineIndex);
  }
  useSceneShortcuts(sectionRef, { backlogOpen, openBacklog: () => setBacklogOpen(true), canBack: rollback.canBack, onBack: back });
  function advance() {
    if (step === "done") return;
    rollback.record({ step, chapter, lineIndex });
    if (lineIndex < lines.length - 1) { setLineIndex(lineIndex + 1); return; }
    if (step === "opening") { setStep("chapters"); setChapter(0); setLineIndex(0); return; }
    if (step === "chapters" && chapter < chapters.length - 1) { setChapter(chapter + 1); setLineIndex(0); return; }
    setStep("done");
  }
  // Qui est présent : jamais Bellirith et Valurn ensemble dans un moment intime.
  const present: ("bellirith" | "valurn")[] = step === "opening"
    ? scene.voie === "a" ? ["bellirith"] : scene.voie === "b" ? ["valurn"] : ["bellirith", "valurn"]
    : scene.voie === "a" ? ["bellirith"] : scene.voie === "b" ? ["valurn"] : chapter < 6 ? ["bellirith"] : chapter === 6 ? [] : ["valurn"];
  const sprite = (who: "bellirith" | "valurn", index: number) => {
    const nude = who === "bellirith" && step === "chapters" && bvIntimateVisible(scene, mode, chapter);
    // Valurn n’a pas de sprites intimes : en explicite, après le dévoilement, il n’est pas représenté.
    if (who === "valurn" && mode === "explicite" && step === "chapters" && chapter >= scene.revealChapter) return null;
    const src = nude ? intimateSpritePath("bellirith", scene.bellirithMoods[chapter]) : spritePath(who, who === "bellirith" ? "seductive" : "charming", who === "bellirith" ? "seductive" : "charming");
    const speaking = line?.speaker === (who === "bellirith" ? "Bellirith" : "Valurn");
    return <div key={who} className={`group-intimacy-sprite ${index === 0 ? "first" : "second"} ${speaking ? "active" : "quiet"}`}><img data-sprite-channel={nude ? "intimate" : "standard"} data-bv-sprite={who} src={src} alt="" /></div>;
  };
  const sequenceLabel = step === "chapters" ? `Séquence ${chapter + 1} / ${chapters.length} · ` : step === "opening" ? "Prélude · " : "";
  return <section ref={sectionRef} className="interactive-intimacy group-interactive-intimacy bn-intimacy bv-intimacy v2-scene v2-scene-intime" data-bv-intimacy={scene.id} style={{ backgroundImage: `linear-gradient(180deg, rgba(5,6,12,.16), rgba(5,6,12,.84)), url(${background})` }}>
    <div className="scene-top intimacy-top">
      <div className="scene-titre"><p className="eyebrow">{replay ? "Souvenir intime · aucun gain" : `Bellirith & Valurn · ${BV_MODE_LABELS[mode]}`}</p><h2>{scene.title}</h2></div>
      <div className="scene-outils"><SceneControls canBack={rollback.canBack} onBack={back} historyCount={backlog.length} onHistory={() => setBacklogOpen(true)} /><button type="button" className="scene-outil passer" onClick={() => step === "done" ? onFinish() : onStop(step === "opening" ? -1 : chapter)}>{replay ? "Quitter le souvenir" : "Interrompre ici"}</button></div>
    </div>
    <div className="group-intimacy-sprites" aria-hidden="true">{present.map((who, index) => sprite(who, index))}</div>
    <div className="dialogue-gradient" />
    {step !== "done" && line && <button className={`dialogue-box intimacy-dialogue ${line.speaker === "Narration" ? "narration" : ""}`} style={{ "--c": line.speaker === "Bellirith" ? "#d9475f" : line.speaker === "Valurn" ? "#c9a46b" : "var(--or)" } as CSSProperties} onClick={advance}>
      <span className="speaker">{format(line.speaker)}</span>
      <p key={`${step}-${chapter}-${lineIndex}`}>{format(line.text)}</p>
      <small>{sequenceLabel}{lineIndex + 1} / {lines.length}<span className="suite-txt"> · Cliquer pour continuer</span></small><i className="dialogue-suite" aria-hidden="true">▼</i>
    </button>}
    {step === "done" && <div className="intimacy-complete"><p className="eyebrow">{replay ? "Fin du souvenir" : "La nuit s’achève"}</p><h3>{scene.title}</h3><p>{replay ? "Ce souvenir peut être quitté sans modifier la chronique." : scene.detail}</p><button type="button" className="btn principal primary-action" onClick={onFinish}>{replay ? "Quitter le souvenir" : "Continuer la chronique"}</button></div>}
    {backlogOpen && <SceneBacklog title={`Bellirith & Valurn · ${scene.title}`} backlog={backlog} backlogRef={backlogRef} onClose={() => setBacklogOpen(false)} />}
  </section>;
}

/* ------------------------------------------------------------------------ */
/* Bloc développeur                                                          */
/* ------------------------------------------------------------------------ */

export type BVDevActions = {
  start: () => void;
  setStage: (stage: number) => void;
  clear: () => void;
  openScene: (sceneId: string) => void;
  openNever: () => void;
  openIntimacy: (id: BVIntimacyId, mode: IntimacyMode) => void;
};

export function BVDevBlock({ progress, unlockChecks, sceneIds, actions }: { progress?: CrossQuestProgress; unlockChecks: { id: string; label: string; ok: boolean }[]; sceneIds: readonly string[]; actions: BVDevActions }) {
  const [stage, setStage] = useState(progress?.stage ?? 0);
  const [mode, setMode] = useState<IntimacyMode>("explicite");
  const row = (label: string, children: ReactNode) => <div className="dev-row"><span className="dev-help">{label}</span>{children}</div>;
  return <>
    <h3>Bellirith / Valurn</h3>
    <p className="dev-help">Les ouvertures sont des souvenirs : aucun gain, aucune mutation. État : {progress ? `étape ${progress.stage} / ${BV_STAGE_TOTAL}` : "série non démarrée"} · déblocage : {unlockChecks.map((check) => `${check.ok ? "✓" : "✗"} ${check.label}`).join(" · ")}.</p>
    {row("Série :", <>
      <button type="button" onClick={actions.start} disabled={Boolean(progress)}>Démarrer la série</button>
      <label>Étape<select value={stage} onChange={(event) => setStage(Number(event.target.value))}>{[...BV_TITLES.map((title, index) => [index, `${index} · ${title}`] as const), [BV_STAGE_TOTAL, `${BV_STAGE_TOTAL} · Série accomplie`] as const].map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      <button type="button" onClick={() => actions.setStage(stage)}>Placer à l’étape</button>
      <button type="button" onClick={actions.clear} disabled={!progress}>Effacer la série</button>
    </>)}
    {row("Scènes :", <>{sceneIds.map((id) => <button type="button" key={id} onClick={() => actions.openScene(id)}>{BV_SCENE_TITLES[id] || id}</button>)}</>)}
    {row("Soirée :", <button type="button" onClick={actions.openNever}>Ouvrir « Je n’ai jamais » (local)</button>)}
    {row("Intimités :", <>
      <label>Mode<select value={mode} onChange={(event) => setMode(event.target.value as IntimacyMode)}>{(Object.keys(BV_MODE_LABELS) as IntimacyMode[]).map((entry) => <option key={entry} value={entry}>{BV_MODE_LABELS[entry]}</option>)}</select></label>
      {(Object.keys(BV_INTIMACY_LABELS) as BVIntimacyId[]).map((id) => <button type="button" key={id} onClick={() => actions.openIntimacy(id, mode)}>{BV_INTIMACY_LABELS[id]}</button>)}
    </>)}
  </>;
}
