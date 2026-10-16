import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { CrossQuestDossier } from "./cross-quest-dossier";
import type { CrossQuestProgress } from "./cross-quests";
import type { DialogueLine } from "./game-data";
import type { IntimacyMode } from "./date-scenes";
import { spritePath } from "./sprite-system";
import {
  AN_BORDEREAU, AN_NOTES, AN_HOME_ECHO, AN_OBJECTIVES, AN_SCENE_TITLES, AN_STAGE_TOTAL, AN_TITLES, anAvailable, anExtension, anPendingExtensions, anSisterBond, anOrientation,
  type AmaneaWhere, type ANExtCheckpoint,
} from "./allenna-naiah-cross-quest";
import { AN_DATE_IDS, AN_DATE_SHORT, AN_DATE_TITLES, AN_BRANCH_TITLES, type ANDateId } from "./allenna-naiah-dates";
import {
  AN_CHAIN, AN_CLAIMS, AN_CLUES, AN_DOMAIN_LABEL, anMiniSummary, replayANMini, submitHypothesis, takeHint, visibleClaims,
  type ANDomain, type ANHint, type ANMiniState, type ANResult,
} from "./allenna-naiah-minigame";
import type { ANExtension, ANExtSeq } from "./allenna-naiah-intimacy-types";
import { ROMAINS } from "./ui/v2/common";
import { SceneBacklog, SceneControls, useRollback, useSceneBacklog, useSceneShortcuts } from "./scene-controls";

type Format = (text: string) => string;
const PORTRAITS = [{ src: "/assets/portraits/allenna.jpg", alt: "Allenna" }, { src: "/assets/portraits/naiah.jpg", alt: "Naïah" }];
const ORIENTATION_LABEL = { partenariat: "Partenariat prudent", confiance: "Confiance professionnelle", complicite: "Complicité privée" } as const;

/* ------------------------------------------------------------------------ */
/* Dossier du Journal                                                        */
/* ------------------------------------------------------------------------ */

export function ANDossier({ progress, day, amanea, hasHome = true, onScene, onMini, onExtension }: {
  progress: CrossQuestProgress; day: number; amanea?: AmaneaWhere; hasHome?: boolean;
  onScene: (sceneId: string, replay?: boolean) => void;
  onMini: (replay?: boolean) => void;
  onExtension: (extId: string, replay?: boolean) => void;
}) {
  const an = progress.an!;
  const stage = Math.min(progress.stage, AN_STAGE_TOTAL);
  const available = anAvailable(progress, day, amanea, hasHome);
  const done = Boolean(an.completed);
  const actions: ReactNode[] = [];
  if (available.mini) actions.push(<button key="mini" className="primary-action" onClick={() => onMini(false)}>{an.mini && an.mini.ops ? `Reprendre l’enquête · ${an.mini.confirmed.length} hypothèse(s) établie(s)` : "Ouvrir l’enquête"}</button>);
  for (const id of available.scenes) actions.push(<button key={id} className={actions.length ? "secondary-action" : "primary-action"} onClick={() => onScene(id)}>{an.checkpoint?.sceneId === id ? "Reprendre" : "Vivre"} · « {AN_SCENE_TITLES[id]} »{done ? <small> · facultatif</small> : null}</button>);
  for (const id of available.dates) actions.push(<button key={id} className="secondary-action" onClick={() => onScene(id)}>{an.checkpoint?.sceneId === id ? "Reprendre" : "Rendez-vous"} · « {AN_DATE_TITLES[id]} »<small> · dans l’ordre de votre choix</small></button>);
  for (const ext of anPendingExtensions(progress)) { const e = anExtension(ext); if (e) actions.push(<button key={ext} className="secondary-action" onClick={() => onExtension(ext)}>{an.extCheckpoint?.id === ext ? "Reprendre" : "Prolonger"} · « {e.title} »<small> · facultatif</small></button>); }
  const note = available.wait || available.blocked;
  const notice = note ? <p className="an-wait">{note}</p> : null;
  const current = done ? undefined : { title: AN_TITLES[stage], objective: AN_OBJECTIVES[stage], action: <div className="bn-dossier-actions">{actions}{notice}</div> };
  const orientation = anOrientation(progress);
  const bond = anSisterBond(progress);
  const summary = an.mini?.complete ? anMiniSummary(an.mini) : undefined;
  const correspondence = AN_DATE_IDS.flatMap((id) => {
    const d = an.dates[id]; if (!d?.branch || day <= d.day) return [];
    const short = AN_DATE_SHORT[id];
    if (short === "home") return AN_HOME_ECHO[d.branch] ? [<li key={id}><strong>Au logis</strong><p>{AN_HOME_ECHO[d.branch]}</p></li>] : [];
    const n = AN_NOTES[`${short}:${d.branch}`];
    return n ? [<li key={id}><strong>{n.title}</strong><small> · {n.from === "naiah" ? "Naïah" : "Allenna"}</small><p>{n.body}</p></li>] : [];
  });
  const lived = Object.keys(an.choices);
  return <CrossQuestDossier
    className="an-dossier"
    portraits={PORTRAITS}
    eyebrow="Après le leurre"
    title="Allenna & Naïah"
    description="Une trace résiduelle sous les ruines du faux portail, une sœur bannie, une héritière fidèle. Pour suivre le fil jusqu’à Akuhn’Nabad, il faut que les deux acceptent de travailler ensemble, et que vous teniez le chemin."
    progress={stage} total={AN_STAGE_TOTAL}
    current={current}
    completed={done ? {
      title: "Une route pour revenir",
      description: `Orientation : ${orientation ? ORIENTATION_LABEL[orientation] : "à définir"}. Les rendez-vous se vivent dans n’importe quel ordre ; Allenna veille à ce qu’aucun ne croise l’itinéraire d’Amanea.`,
      status: <div className="bn-dossier-actions">{actions.length ? actions : <span>Rien en attente pour l’instant.</span>}{notice}</div>,
    } : undefined}
    mechanic={an.mini ? {
      title: "Les fils sous la cendre",
      description: "Traces, registres, chemins : aucune des trois ne possède toutes les preuves. Une hypothèse ne tient que si les domaines concordent.",
      status: <span>{an.mini.complete ? `Enquête close · ${an.mini.ops} opérations de recherche${summary?.transmission ? " · transmission sans finalité établie" : ""}` : `${an.mini.confirmed.length} hypothèse(s) établie(s) · ${an.mini.ops} opérations`}</span>,
      action: an.mini.complete ? <button className="secondary-action" onClick={() => onMini(true)}>Rejouer l’enquête (sans effet)</button> : undefined,
    } : undefined}
    milestones={[
      ...lived.map((id) => ({ id, title: AN_SCENE_TITLES[id] || id, detail: (AN_DATE_IDS as readonly string[]).includes(id) ? `Branche : ${AN_BRANCH_TITLES[an.dates[id as ANDateId]?.branch || ""] || "?"}` : "Relecture protégée", onReplay: () => onScene(id, true) })),
      ...AN_DATE_IDS.flatMap((id) => { const d = an.dates[id]; return d?.ext === "lived" && d.branch ? [{ id: `ext-${id}`, title: anExtension(`an-ext:${AN_DATE_SHORT[id]}:${d.branch}`)?.title || "", detail: "Souvenir intime · aucun gain", onReplay: () => onExtension(`an-ext:${AN_DATE_SHORT[id]}:${d.branch}`, true), actionLabel: "Revivre" }] : []; }),
    ]}
    correspondence={<>
      {an.choices["cross-an-05"] && <section className="an-piece" aria-label="Pièce à conviction">
        <p className="eyebrow">Pièce à conviction · copie</p>
        <h4>{AN_BORDEREAU.title}</h4>
        <p className="an-piece-ref">{AN_BORDEREAU.reference}</p>
        <blockquote>{AN_BORDEREAU.body}</blockquote>
        <p className="an-piece-rune">{AN_BORDEREAU.rune}</p>
        <div className="an-piece-grid">
          <div><strong>Établi</strong><ul>{AN_BORDEREAU.established.map((t) => <li key={t}>{t}</li>)}</ul></div>
          <div><strong>Probable</strong><ul>{AN_BORDEREAU.probable.map((t) => <li key={t}>{t}</li>)}</ul></div>
          <div><strong>Non vérifié</strong><ul>{AN_BORDEREAU.unverified.map((t) => <li key={t}>{t}</li>)}</ul></div>
        </div>
        {done && <p className="an-piece-recall">Le nom revient parfois, la nuit, au moment de s’endormir. Personne d’autre que vous trois ne l’a prononcé.</p>}
      </section>}
      {stage >= 3 && <p className="an-bond">Lien entre les sœurs : {bond >= 6 ? "elles se cherchent du regard sans s’en cacher" : bond >= 3 ? "elles travaillent ensemble, et parfois rient" : "une trêve de travail, prudente"}.</p>}
      {correspondence.length > 0 && <ul className="an-notes">{correspondence}</ul>}
    </>}
  />;
}

/* ------------------------------------------------------------------------ */
/* Mini-jeu « Les fils sous la cendre »                                      */
/* ------------------------------------------------------------------------ */

const DOMAINS: ANDomain[] = ["trace", "registre", "chemin"];
const READER: Record<string, string> = { naiah: "Naïah", allenna: "Allenna", player: "Vous" };
const KIND_LABEL: Record<ANResult["kind"], string> = { confirmed: "Confirmée", incomplete: "Incomplète", contradicted: "Contredite" };

export function ANMinigame({ initial, replay = false, onSave, onClose, onFinish }: {
  initial: ANMiniState; replay?: boolean;
  onSave: (state: ANMiniState) => void; onClose: () => void; onFinish: (state: ANMiniState) => void;
}) {
  const [state, setState] = useState<ANMiniState>(() => replay ? replayANMini(initial) : initial);
  const [selected, setSelected] = useState<string[]>([]);
  const [claim, setClaim] = useState<string>("");
  const [result, setResult] = useState<ANResult | undefined>();
  const [hint, setHint] = useState<ANHint | undefined>();
  const [tutorial, setTutorial] = useState(!initial.tutorialSeen && !replay);
  const [tab, setTab] = useState<ANDomain>("trace");
  const ref = useRef<HTMLElement>(null);
  useEffect(() => { ref.current?.focus(); }, []);
  const commit = (next: ANMiniState) => { setState(next); if (!replay) onSave(next); };
  const toggle = (id: string) => setSelected((list) => list.includes(id) ? list.filter((x) => x !== id) : list.length >= 3 ? [...list.slice(1), id] : [...list, id]);
  function propose() {
    if (!claim) return;
    const out = submitHypothesis(state, selected, claim);
    setResult(out.result); setHint(undefined);
    if (out.result.kind === "confirmed") { setSelected([]); setClaim(""); }
    commit(out.state);
  }
  function askHint() { const out = takeHint(state); setHint(out.hint); setResult(undefined); commit(out.state); }
  function closeTutorial() { setTutorial(false); if (!state.tutorialSeen) commit({ ...state, tutorialSeen: true }); }
  const claims = visibleClaims(state);
  const summary = anMiniSummary(state);
  const chainLevel = (["H1", "H2", "H3", "H5", "H6"] as const).filter((id) => state.confirmed.includes(id)).length;
  return <section ref={ref} tabIndex={-1} className="v2-scene an-mini" data-an-mini={state.complete ? "complete" : "open"} aria-labelledby="an-mini-title" style={{ backgroundImage: "linear-gradient(180deg, rgba(5,6,12,.28), rgba(5,6,12,.62)), url(/assets/backgrounds/deep_archives.webp)" }}>
    <div className="scene-top"><div className="scene-titre"><p className="eyebrow">{replay ? "Souvenir · aucun gain" : "Quêtes croisées · Allenna & Naïah"}</p><h2 id="an-mini-title">Les fils sous la cendre</h2></div>
      <div className="scene-outils">
        <span className="an-ops" aria-live="polite" title="Opérations de recherche (indicatif, aucun échec)">{state.ops} op.</span>
        <button type="button" className="scene-outil" onClick={askHint} disabled={state.complete}>Indice</button>
        <button type="button" className="scene-outil" onClick={() => setTutorial(true)}>Méthode</button>
        <button type="button" className="scene-outil passer" onClick={onClose}>{replay ? "Quitter le souvenir" : "Reprendre plus tard"}</button>
      </div></div>
    <ol className="an-chain" aria-label="Chaîne reconstituée">{AN_CHAIN.map((step, i) => <li key={step} className={i < chainLevel ? "on" : ""}>{step}</li>)}</ol>
    <div className="an-tabs" role="tablist">{DOMAINS.map((d) => <button key={d} role="tab" aria-selected={tab === d} className={tab === d ? "on" : ""} onClick={() => setTab(d)}>{AN_DOMAIN_LABEL[d]}</button>)}</div>
    <div className="an-board">
      {DOMAINS.map((d) => <div key={d} className={`an-col ${tab === d ? "on" : ""}`} data-domain={d}>
        <p className="mg-label">{AN_DOMAIN_LABEL[d]}</p>
        {AN_CLUES.filter((c) => c.domain === d).map((c) => {
          const open = state.revealed.includes(c.id);
          return open
            ? <button key={c.id} type="button" className={`an-clue ${selected.includes(c.id) ? "sel" : ""}`} aria-pressed={selected.includes(c.id)} onClick={() => toggle(c.id)}><strong>{c.title}</strong><small>{c.detail}</small><em>{READER[c.reader]}</em></button>
            : <div key={c.id} className="an-clue locked" aria-hidden="true"><strong>· · ·</strong></div>;
        })}
      </div>)}
    </div>
    <div className="an-bench mg-panel">
      {state.complete ? <div className="an-summary">
        <p className="mg-label">{replay ? "Souvenir de l’enquête" : "Restitution"}</p>
        <div className="an-summary-grid">
          <div><strong>Établi</strong><ul>{summary.certain.map((t) => <li key={t}>{t}</li>)}</ul></div>
          <div><strong>Probable</strong><ul>{summary.probable.map((t) => <li key={t}>{t}</li>)}</ul></div>
          <div><strong>Non vérifié</strong><ul>{summary.unverified.map((t) => <li key={t}>{t}</li>)}</ul></div>
        </div>
        <button type="button" className="btn principal primary-action" onClick={() => onFinish(state)}>{replay ? "Quitter le souvenir" : "Descendre au dépôt secondaire"}</button>
      </div> : <>
        <p className="mg-label">Hypothèse · {selected.length ? selected.map((id) => AN_CLUES.find((c) => c.id === id)?.title).join(" + ") : "choisissez deux ou trois pièces"}</p>
        <div className="an-claims">{claims.map((c) => <button key={c.id} type="button" className={`an-claim ${claim === c.id ? "sel" : ""} ${state.confirmed.includes(c.id) ? "done" : ""}`} aria-pressed={claim === c.id} onClick={() => setClaim(c.id)}>{c.label}{c.optional ? <small> · nuance</small> : null}</button>)}</div>
        <button type="button" className="btn principal primary-action an-propose" disabled={!claim || (!selected.length && Boolean(AN_CLAIMS.find((c) => c.id === claim)?.needs.length))} onClick={propose}>Confronter</button>
        {result && <p className={`mg-note an-result ${result.kind}`} role="status"><strong>{KIND_LABEL[result.kind]}</strong> · {result.text}</p>}
        {hint && <p className="mg-note an-hint" role="status"><strong>{hint.speaker}</strong> · {hint.text}</p>}
      </>}
    </div>
    {tutorial && <div className="an-tuto mg-panel" role="dialog" aria-label="Méthode">
      <p className="mg-label">Méthode</p>
      <p>Naïah lit les traces, Allenna les registres, vous tenez les chemins. Choisissez deux ou trois pièces, puis l’hypothèse qu’elles soutiennent, et confrontez.</p>
      <p>Une hypothèse peut être confirmée, incomplète (il manque un domaine, ou une pièce est de trop) ou contredite par une pièce visible. Rien n’est perdu : chaque confrontation compte seulement comme une opération de recherche.</p>
      <p>Aucun minuteur. L’enquête est sauvegardée après chaque action et reprend exactement où vous l’avez laissée.</p>
      <button type="button" className="btn principal primary-action" onClick={closeTutorial}>Commencer</button>
    </div>}
  </section>;
}

/* ------------------------------------------------------------------------ */
/* Extensions intimes                                                         */
/* ------------------------------------------------------------------------ */

export const AN_MODE_LABELS: Record<IntimacyMode, string> = { tendre: "Tendre", suggestif: "Suggestif", explicite: "Sans coupure", ellipse: "Fondu au noir" };

/** Lignes jouées d’une séquence selon les choix et le mode (fonction pure, testée). */
export function anSeqLines(seq: ANExtSeq, index: number, picks: Record<string, string>, romance: boolean, mode: IntimacyMode): DialogueLine[] {
  const prev = index === 5 ? picks.s5 : index >= 10 ? picks.s10 : undefined;
  const lines = [...seq.lines, ...(seq.after && prev ? seq.after[prev] || [] : []), ...((romance ? seq.romance : seq.friendship) || [])];
  if (mode === "ellipse" && seq.veiled) return lines.slice(0, 1);
  return lines;
}

export function ANExtensionModal({ ext, mode, romance, replay = false, background, format, checkpoint, onCheckpoint, onStop, onFinish }: {
  ext: ANExtension; mode: IntimacyMode; romance: boolean; replay?: boolean; background: string; format: Format;
  checkpoint?: ANExtCheckpoint; onCheckpoint: (cp: ANExtCheckpoint) => void; onStop: () => void; onFinish: (picks: Record<string, string>) => void;
}) {
  const resume = !replay && checkpoint?.id === ext.id ? checkpoint : undefined;
  const [seq, setSeq] = useState(resume?.seq ?? 0);
  const [picks, setPicks] = useState<Record<string, string>>(resume?.picks ?? {});
  const [response, setResponse] = useState<DialogueLine[] | undefined>();
  const [lineIndex, setLineIndex] = useState(0);
  const [done, setDone] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const current = ext.seqs[seq];
  const lines = useMemo(() => response || anSeqLines(current, seq, picks, romance, mode), [response, current, seq, picks, romance, mode]);
  const line = lines[lineIndex];
  const choosing = !response && !done && Boolean(current.options) && lineIndex >= lines.length - 1;
  const rollback = useRollback<{ seq: number; picks: Record<string, string>; response?: DialogueLine[]; lineIndex: number }>();
  const lineKey = `${seq}|${response ? "r" : "l"}|${lineIndex}|${line?.text}`;
  const { backlog, backlogOpen, setBacklogOpen, backlogRef, rewind } = useSceneBacklog(`${ext.id}:${mode}:${replay ? "r" : "l"}`, lineKey, line, !done, format, ["allenna", "naiah"]);
  function back() { const p = rollback.pop(); if (!p) return; rewind(lineKey); setSeq(p.seq); setPicks(p.picks); setResponse(p.response); setLineIndex(p.lineIndex); setDone(false); }
  useSceneShortcuts(sectionRef, { backlogOpen, openBacklog: () => setBacklogOpen(true), canBack: rollback.canBack, onBack: back });
  function nextSeq(nextPicks = picks) {
    if (seq >= ext.seqs.length - 1) { setDone(true); return; }
    const n = seq + 1;
    setSeq(n); setResponse(undefined); setLineIndex(0);
    if (!replay) onCheckpoint({ id: ext.id, seq: n, picks: nextPicks });
  }
  function advance() {
    if (done || choosing) return;
    rollback.record({ seq, picks, response, lineIndex });
    if (lineIndex < lines.length - 1) { setLineIndex(lineIndex + 1); return; }
    nextSeq();
  }
  function choose(id: string) {
    const opt = current.options!.find((o) => o.id === id)!;
    rollback.record({ seq, picks, response, lineIndex });
    const nextPicks = { ...picks, [`s${seq + 1}`]: id };
    setPicks(nextPicks); setResponse(opt.response); setLineIndex(0);
  }
  // Naïah s’éloigne d’elle-même pendant la séquence la plus proche en ligne romance.
  const naiahAway = romance && seq === 8 && lineIndex >= 1;
  const present: ("allenna" | "naiah")[] = naiahAway ? ["allenna"] : ["allenna", "naiah"];
  const speaking = line?.speaker;
  const color = speaking === "Allenna" ? "#5f9a72" : speaking === "Naïah" ? "#8f6fd1" : "var(--or)";
  return <section ref={sectionRef} className="interactive-intimacy group-interactive-intimacy an-intimacy v2-scene v2-scene-intime" data-an-ext={ext.id} data-an-seq={seq + 1} style={{ backgroundImage: `linear-gradient(180deg, rgba(5,6,12,.14), rgba(5,6,12,.78)), url(${ext.background || background})` }}>
    <div className="scene-top intimacy-top">
      <div className="scene-titre"><p className="eyebrow">{replay ? "Souvenir intime · aucun gain" : `Allenna & Naïah · ${AN_MODE_LABELS[mode]}`}</p><h2>{ext.title}</h2></div>
      <div className="scene-outils"><SceneControls canBack={rollback.canBack} onBack={back} historyCount={backlog.length} onHistory={() => setBacklogOpen(true)} /><button type="button" className="scene-outil passer" onClick={() => done ? onFinish(picks) : onStop()}>{replay ? "Quitter le souvenir" : "Arrêter ici"}</button></div>
    </div>
    <div className="group-intimacy-sprites" aria-hidden="true">{present.map((who, i) => <div key={who} className={`group-intimacy-sprite ${i === 0 ? "first" : "second"} ${speaking === (who === "allenna" ? "Allenna" : "Naïah") ? "active" : "quiet"}`}><img data-sprite-channel="standard" src={spritePath(who, who === "allenna" ? "shy" : "neutral")} alt="" /></div>)}</div>
    <div className="dialogue-gradient" />
    {!done && line && !choosing && <button className={`dialogue-box intimacy-dialogue ${line.speaker === "Narration" ? "narration" : ""}`} style={{ "--c": color } as CSSProperties} onClick={advance}>
      <span className="speaker">{format(line.speaker)}</span>
      <p key={lineKey}>{format(line.text)}</p>
      <small>Séquence {seq + 1} / {ext.seqs.length} · {current.title}{mode === "ellipse" && current.veiled ? " · fondu" : ""}<span className="suite-txt"> · Cliquer pour continuer</span></small><i className="dialogue-suite" aria-hidden="true">▼</i>
    </button>}
    {choosing && <div className="choice-box"><p className="choice-question">{format(line?.text || current.title)}</p>
      {current.options!.map((o, i) => <button key={o.id} type="button" className="v2-choix-carte" style={{ "--i": i } as CSSProperties} onClick={() => choose(o.id)}><i className="choix-num">{ROMAINS[i + 1]}</i><div><strong>{format(o.label)}</strong></div></button>)}
    </div>}
    {done && <div className="intimacy-complete"><p className="eyebrow">{replay ? "Fin du souvenir" : "La nuit s’achève"}</p><h3>{ext.title}</h3><p>{replay ? "Ce souvenir peut être quitté sans modifier la chronique." : "Chacun a choisi sa place. Personne n’a rien promis qu’il ne puisse tenir."}</p><button type="button" className="btn principal primary-action" onClick={() => onFinish(picks)}>{replay ? "Quitter le souvenir" : "Continuer la chronique"}</button></div>}
    {backlogOpen && <SceneBacklog title={`Allenna & Naïah · ${ext.title}`} backlog={backlog} backlogRef={backlogRef} onClose={() => setBacklogOpen(false)} />}
  </section>;
}

/* ------------------------------------------------------------------------ */
/* Bloc développeur (masqué hors mode développeur)                           */
/* ------------------------------------------------------------------------ */

export type ANDevActions = {
  start: () => void; clear: () => void; unlockAll: () => void;
  openScene: (id: string) => void; openMini: () => void; openExtension: (id: string, mode: IntimacyMode, romance: boolean) => void;
};

export function ANDevBlock({ progress, unlockChecks, sceneIds, extIds, actions }: { progress?: CrossQuestProgress; unlockChecks: { id: string; label: string; ok: boolean }[]; sceneIds: readonly string[]; extIds: readonly string[]; actions: ANDevActions }) {
  const [mode, setMode] = useState<IntimacyMode>("suggestif");
  const [romance, setRomance] = useState(true);
  const row = (label: string, children: ReactNode) => <div className="dev-row"><span className="dev-help">{label}</span>{children}</div>;
  return <>
    <h3>Allenna / Naïah</h3>
    <p className="dev-help">Ouvertures en souvenir : aucun gain. État : {progress ? `étape ${progress.stage} / ${AN_STAGE_TOTAL}` : "série non démarrée"} · déblocage : {unlockChecks.map((c) => `${c.ok ? "✓" : "✗"} ${c.label}`).join(" · ")}.</p>
    {row("Série :", <>
      <button type="button" onClick={actions.start} disabled={Boolean(progress)}>Démarrer la série</button>
      <button type="button" onClick={actions.unlockAll}>Tout débloquer (sans flag de campagne)</button>
      <button type="button" onClick={actions.clear} disabled={!progress}>Effacer la série</button>
    </>)}
    {row("Scènes :", <>{sceneIds.map((id) => <button type="button" key={id} onClick={() => actions.openScene(id)}>{AN_SCENE_TITLES[id] || id}</button>)}</>)}
    {row("Enquête :", <button type="button" onClick={actions.openMini}>Ouvrir l’enquête (locale)</button>)}
    {row("Extensions :", <>
      <label>Mode<select value={mode} onChange={(e) => setMode(e.target.value as IntimacyMode)}>{(Object.keys(AN_MODE_LABELS) as IntimacyMode[]).map((m) => <option key={m} value={m}>{AN_MODE_LABELS[m]}</option>)}</select></label>
      <label><input type="checkbox" checked={romance} onChange={(e) => setRomance(e.target.checked)} /> ligne romance</label>
      {extIds.map((id) => <button type="button" key={id} onClick={() => actions.openExtension(id, mode, romance)}>{anExtension(id)?.title || id}</button>)}
    </>)}
  </>;
}
