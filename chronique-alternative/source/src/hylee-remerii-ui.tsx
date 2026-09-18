import { useEffect, useRef, useState } from "react";
import type { CrossQuestProgress } from "./cross-quests";
import { HR_TITLES, HR_OBJECTIVES, HR_LETTERS, hrAmbient } from "./hylee-remerii-cross-quest";
import { ANCHOR_PHASES, ANCHOR_HINTS, anchorPuzzle, anchorAction, selectAnchor, createAnchorOperation, type AnchorPoint, type AnchorState } from "./anchor-operation";
export function HRDossier({ progress, day, onScene, onOperation, onLetter }: { progress: CrossQuestProgress; day: number; onScene: (stage: number, replay?: boolean, recognition?: boolean) => void; onOperation: () => void; onLetter: (id: string) => void }) {
 const hr = progress.hr!, result = hr.anchor?.result;
 const resultLabel = result === "controlled" ? "Ancrages neutralisés · relevés complets" : result === "pressure" ? "Ancrages neutralisés · relevés partiels" : "Repli · une nouvelle tentative reste possible";
 return <section className="cross-quest-dossier hr-dossier">
  <header><div className="cross-dossier-portraits"><img src="/assets/portraits/hylee.jpg" alt="Hylee"/><img src="/assets/portraits/remerii.jpg" alt="Remerii"/></div><div><p className="eyebrow">Mir’Aldas · Serres Rocheuses</p><h2>Hylee & Remerii</h2></div><strong>{progress.stage} / 7</strong></header>
  <div className="cross-progress"><i style={{width:`${progress.stage/7*100}%`}}/></div>
  {progress.stage < 7 && <div className="cross-current"><h3>{HR_TITLES[progress.stage]}</h3><p>{HR_OBJECTIVES[progress.stage]}</p>{progress.stage === 6 && hr.prepared && (!result || result === "retreat") ? <button className="primary-action" onClick={onOperation}>{hr.anchor ? "Reprendre l’opération" : "Gagner les trois terrasses"}</button> : <button className="primary-action" onClick={() => onScene(progress.stage)}>{hr.checkpoint ? "Reprendre la conversation" : result ? "Retrouver Hylee et Remerii au col" : "Vivre cette étape"}</button>}</div>}
  {progress.stage === 7 && <p>Les terrasses se sont tues. Les relevés sont déposés à Mir’Aldas.</p>}
  {hr.branch === "double" && progress.stage === 7 && (!hr.configuration || hr.configuration === "waiting") && <div className="cross-current"><p>{hr.configuration === "waiting" ? "Vous pouvez revenir sur votre conversation, lorsque vous le souhaitez." : "Hylee et Remerii vous gardent une place à la résidence."}</p><button className="primary-action" disabled={hr.configuration === "waiting" && day <= (hr.recognitionDay || 0)} onClick={() => onScene(7, false, true)}>Reprendre la conversation à trois</button>{hr.configuration === "waiting" && day <= (hr.recognitionDay || 0) && <small>Retrouvez-les à partir de demain.</small>}</div>}
  {hrAmbient(progress.stage).map((l,i) => <p className="hr-ambient" key={i}>{l.text}</p>)}
  {result && <p>{resultLabel} · {hr.anchor!.incidents} incident{hr.anchor!.incidents > 1 ? "s" : ""}</p>}
  <div className="cross-milestones"><h3>Étapes vécues</h3>{HR_TITLES.slice(0,progress.stage).map((title,stage) => <button key={title} onClick={() => onScene(stage,true)}>✓ {title} · Relire</button>)}</div>
  {!!progress.letters.length && <div className="hr-mail"><h3>Correspondance</h3>{progress.letters.map(received => { const letter = HR_LETTERS.find(l => l.id === received.id); return letter && <details key={letter.id} onToggle={e => { if (e.currentTarget.open && !received.read) onLetter(letter.id); }}><summary>{received.read ? "" : "✉ "}{letter.subject}</summary>{letter.body.map(line => <p key={line}>{line}</p>)}</details>; })}</div>}
  {hr.choices["cross-hr-recognition"] && <button onClick={() => onScene(7,true,true)}>Relire « Une place à la table »</button>}
 </section>;
}
// The approved map was not supplied. Keep this explicitly replaceable fallback
// and its coordinates together; it is not the approved final artwork.
export const ANCHOR_MAP: { image?: string; points: Record<AnchorPoint,[number,number]> } = { points: { A: [24,76], B: [50,51], C: [79,72] } };
const symbols = ["◇","○","△","□"], arrows = ["↑","→","↓","←"];
export function AnchorOperationModal({ state, onChange, onFinish, onClose }: { state: AnchorState; onChange: (s: AnchorState) => void; onFinish: () => void; onClose: () => void }) {
 const [notice,setNotice] = useState(true), latest = useRef(state); latest.current = state;
 const puzzle = anchorPuzzle(state), dialog = useRef<HTMLElement>(null);
 useEffect(() => { setNotice(true); const t = setTimeout(() => setNotice(false),5000); return () => clearTimeout(t); },[state.revision]);
 useEffect(() => { if (!state.memorizing || state.result) return; const t = setTimeout(() => onChange(anchorAction(latest.current,"remember")),4500); return () => clearTimeout(t); },[state.memorizing,state.phase,state.revision,state.result]);
 useEffect(() => { const previous = document.activeElement as HTMLElement | null; dialog.current?.focus(); return () => previous?.focus(); },[]);
 function keyDown(e: React.KeyboardEvent) {
  if (e.key === "Escape") { onClose(); return; }
  if (e.key !== "Tab") return;
  const controls = Array.from(dialog.current?.querySelectorAll<HTMLElement>("button:not(:disabled)") || []), first = controls[0], last = controls.at(-1);
  if (e.shiftKey && (document.activeElement === first || document.activeElement === dialog.current)) { e.preventDefault(); last?.focus(); }
  if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
 }
 return <div className="modal-backdrop anchor-backdrop"><section ref={dialog} tabIndex={-1} role="dialog" aria-modal="true" aria-label="Les Trois Points d’Ancrage" className="anchor-operation" onKeyDown={keyDown}>
  <header className="anchor-heading"><h2>Les Trois Points d’Ancrage</h2><p>{ANCHOR_PHASES[state.phase]} · {state.phase+1}/5 · {state.incidents}/2 incidents</p><div aria-live="polite" className={`anchor-notice ${notice ? "visible" : ""}`}>{state.message}</div></header>
  <button className="anchor-close" onClick={onClose} aria-label="Fermer et conserver la progression">×</button>
  <div className="anchor-map" style={ANCHOR_MAP.image ? {backgroundImage:`url(${ANCHOR_MAP.image})`} : undefined}>
   {!ANCHOR_MAP.image && <svg viewBox="0 0 1000 650" preserveAspectRatio="none" aria-hidden="true">
    <defs><linearGradient id="anchor-sky" x2="0" y2="1"><stop stopColor="#12131b"/><stop offset="1" stopColor="#34313b"/></linearGradient><radialGradient id="anchor-glow"><stop stopColor="#da3f49" stopOpacity=".65"/><stop offset="1" stopColor="#b51528" stopOpacity="0"/></radialGradient></defs>
    <rect width="1000" height="650" fill="url(#anchor-sky)"/><path d="M0 250L110 80 180 210 330 25 430 180 560 60 670 170 800 40 920 160 1000 80V650H0Z" fill="#1c1c24"/><ellipse cx="520" cy="125" rx="130" ry="100" fill="url(#anchor-glow)"/><ellipse cx="520" cy="125" rx="23" ry="60" fill="#250a16" stroke="#b54652" strokeWidth="4"/>
    <path d="M0 650L160 480 320 450 360 590 430 370 570 320 620 590 690 465 880 430 1000 580V650Z" fill="#4c4548"/><path d="M20 630L240 500 500 335 790 470 970 605" fill="none" stroke="#9b8380" strokeWidth="16"/><path d="M335 650L400 410 450 650M590 650L650 400 700 650" stroke="#14141c" strokeWidth="50"/>
    <path d="M180 490L280 460 320 510 220 540ZM450 325L540 295 580 340 490 365ZM730 470L810 430 860 480 780 510Z" fill="#796368" stroke="#ba9691" strokeWidth="2"/>
    <path d="M350 350V470M680 340V450" stroke="#91827a" strokeWidth="4"/><path d="M350 355L390 365 382 425 350 414ZM680 345L720 355 710 415 680 405Z" fill="#173e33"/>
   </svg>}
   <span className="anchor-portal-label">Portail · hors de portée</span>
   {(Object.keys(ANCHOR_MAP.points) as AnchorPoint[]).map(point => <button key={point} className={`anchor-point ${state.selected === point ? "selected" : ""}`} style={{left:`${ANCHOR_MAP.points[point][0]}%`,top:`${ANCHOR_MAP.points[point][1]}%`}} aria-label={`Examiner le point ${point}`} disabled={Boolean(state.result || state.signalReady)} onClick={() => onChange(selectAnchor(state,point))}>{point}</button>)}
  </div>
  <div className="anchor-controls">
   {state.result ? <div><h3>{state.result === "retreat" ? "Repli" : "Les trois ancrages se sont tus"}</h3><p>{state.result === "retreat" ? "Vous regagnez le chemin du col. Vous pourrez revenir et reprendre l’opération." : state.result === "pressure" ? "Les relevés sont incomplets, mais les ancrages sont neutralisés." : "Le cycle complet est relevé. Les trois mécanismes sont neutralisés."}</p>{state.result === "retreat" ? <button className="primary-action" onClick={() => onChange(createAnchorOperation(state.seed+1))}>Préparer une nouvelle tentative</button> : <button className="primary-action" onClick={onFinish}>Retrouver Hylee et Remerii</button>}</div> : state.signalReady ? <div><p>Hylee tient le dernier cycle. Remerii attend votre signal.</p><button className="primary-action" onClick={() => onChange(anchorAction(state,"signal"))}>Abaisser la poignée et donner le signal</button></div> : <>
    <p>{ANCHOR_HINTS[state.phase]}</p>
    {!state.selected && <p>Choisissez une terrasse sur le plan. Deux erreurs provoquent un incident ; deux incidents imposent le repli.</p>}
    {state.selected === "A" && <div><h3>A · Les trois cadrans</h3><p>Alignez chaque cadran sur le repère gravé au-dessus. Les flèches décrivent la position mécanique des verrous.</p><div className="anchor-dials">{puzzle.directions.map((direction,i) => <div key={i}><span>Repère {i+1} : {arrows[direction]}</span><button aria-label={`Tourner le cadran ${i+1}, actuellement ${arrows[state.input[i]]}`} onClick={() => onChange(anchorAction(state,i))}>{arrows[state.input[i]]}</button></div>)}</div><button className="primary-action" onClick={() => onChange(anchorAction(state,"check"))}>Engager les verrous</button></div>}
    {state.selected === "B" && <div><h3>B · Le signe discordant</h3><p>Un signe rompt l’alternance. Appuyez sur la plaque correspondante.</p><div className="anchor-runes">{puzzle.runes.map((rune,i) => <button key={i} aria-label={`Plaque ${i+1} : ${symbols[rune]}`} onClick={() => onChange(anchorAction(state,i))}>{symbols[rune]}</button>)}</div></div>}
    {state.selected === "C" && <div><h3>C · Les impulsions</h3><p>{state.memorizing ? "Mémorisez les quatre repères, dans l’ordre." : `Reproduisez la suite · ${state.input.length}/4`}</p><div className="anchor-sequence" aria-live="polite">{state.memorizing ? puzzle.pulses.map((n,i) => <span key={i}>{symbols[n]}</span>) : <span>• • • •</span>}</div><div className="anchor-runes">{symbols.map((symbol,i) => <button key={symbol} disabled={state.memorizing} aria-label={`Impulsion ${symbol}`} onClick={() => onChange(anchorAction(state,i))}>{symbol}</button>)}</div>{!state.memorizing && <button onClick={() => onChange({...state,input:[],memorizing:true,revision:state.revision+1})}>Revoir la suite</button>}</div>}
   </>}
  </div>
 </section></div>;
}
