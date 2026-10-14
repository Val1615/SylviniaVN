import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { ROMAINS } from "./ui/v2/common";
import { spritePath } from "./sprite-system";
import {
  MARKET_BUDGET, MARKET_INTRO, MARKET_OFFERS, MARKET_REACTIONS, MARKET_RESULT_LABEL,
  bluffLimit, bluffOffer, canConclude, checkLimit, concludeMarket, crossCheck, exposedPeople, offerPrice, protectLimit,
  revealLines, setOfferStatus, spent, submitOffer, toggleProtection,
  type MarketReaction, type ValurnMarketState,
} from "./valurn-market";

type Format = (text: string) => string;

const APPROACH_LABEL = { lucidite: "Lucidité · recoupement", audace: "Audace · contre-bluff", sangfroid: "Sang-froid · négociation protégée" } as const;

/** Quête 5 · registre d'offres. Sauvegardé à chaque action ; « Reprendre plus tard » ne perd rien. */
export function ValurnMarketModal({ state, replay = false, background = "/assets/backgrounds/market.webp", format, onChange, onClose, onFinish }: {
  state: ValurnMarketState; replay?: boolean; background?: string; format: Format;
  onChange: (state: ValurnMarketState) => void; onClose: () => void; onFinish: (state: ValurnMarketState) => void;
}) {
  const ref = useRef<HTMLElement>(null);
  const [revealIndex, setRevealIndex] = useState(0);
  const [reactionIndex, setReactionIndex] = useState(0);
  const [selected, setSelected] = useState(MARKET_OFFERS[0].id);
  useEffect(() => { const previous = document.activeElement as HTMLElement | null; ref.current?.focus(); return () => { if (previous?.isConnected) previous.focus(); }; }, []);

  const reveal = state.phase === "reveal" ? revealLines(state) : [];
  const reaction = state.reaction ? MARKET_REACTIONS.find((entry) => entry.id === state.reaction) : undefined;
  const offer = MARKET_OFFERS.find((entry) => entry.id === selected)!;
  const budgetLeft = MARKET_BUDGET - spent(state);

  function keyDown(event: ReactKeyboardEvent) {
    if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); onClose(); }
  }
  function choose(id: MarketReaction) { onChange({ ...state, reaction: id }); setReactionIndex(0); }

  const line = state.phase === "reveal" && !reaction ? reveal[Math.min(revealIndex, reveal.length - 1)] : reaction ? reaction.lines[Math.min(reactionIndex, reaction.lines.length - 1)] : undefined;
  const revealDone = revealIndex >= reveal.length - 1;
  const reactionDone = reaction ? reactionIndex >= reaction.lines.length - 1 : false;

  const speakerName = line ? (line.speaker === "{player}" ? format("{player}") : line.speaker) : "";
  const valurnSpeaking = line?.speaker === "Valurn";
  const advance = () => { if (!reaction) { if (!revealDone) setRevealIndex(revealIndex + 1); } else if (!reactionDone) setReactionIndex(reactionIndex + 1); };
  const lineCounter = reaction ? `${Math.min(reactionIndex, reaction.lines.length - 1) + 1} / ${reaction.lines.length}` : `${Math.min(revealIndex, reveal.length - 1) + 1} / ${reveal.length}`;
  const lineDone = reaction ? reactionDone : revealDone;

  return <section ref={ref} tabIndex={-1} onKeyDown={keyDown} className="dialogue-overlay v2-scene vm-game" role="dialog" aria-modal="true" aria-labelledby="vm-title" data-vm-phase={state.phase}
    style={{ backgroundImage: `linear-gradient(180deg, rgba(5,6,12,.14), rgba(5,6,12,.66)), url(${background})` }}>
    <div className="scene-top"><div className="scene-titre"><p className="eyebrow">{replay ? "Souvenir · aucun gain" : "Valurn · Quête 5"}</p><h2 id="vm-title">La partie truquée</h2></div>
      <div className="scene-outils">
        <button type="button" className="scene-outil passer vm-close" onClick={onClose}>{replay ? "Quitter le souvenir" : "Reprendre plus tard"}</button>
      </div></div>
    <div className="scene-cast cast-1"><img className={`scene-sprite speaker-0 ${state.phase === "board" || valurnSpeaking ? "active" : "inactive"}`} src={spritePath("valurn", valurnSpeaking && line?.mood ? line.mood : "neutral", "neutral")} alt="Valurn" /></div>
    <div className="dialogue-gradient" />

    {state.phase === "board" && <div className="vm-board">
      <section className="mg-panel vm-registre" aria-label="Registre des offres">
        <p className="mg-label">Registre du salon</p>
        <div className="vm-meters" aria-live="polite">
          <span title={APPROACH_LABEL[state.approach]}>{APPROACH_LABEL[state.approach].split(" · ")[0]}</span>
          <span>Budget <b>{budgetLeft}</b>/{MARKET_BUDGET}</span>
          <span>Recoupements <b>{checkLimit(state) - state.checked.length}</b></span>
          <span>Bluffs <b>{bluffLimit(state) - state.bluffed.length}</b></span>
          <span>Essais <b>{state.attempts}</b></span>
        </div>
        <p className="vm-rule">{MARKET_INTRO[state.approach]} Achetez les affirmations qui forment votre offre, écartez les autres, protégez {protectLimit(state) > 1 ? "deux personnes exposées" : "une personne exposée"}, puis présentez l'offre. Une offre ratée ajoute une contrepartie ; vous pouvez toujours recommencer.</p>
        <ul className="vm-offers">
          {MARKET_OFFERS.map((entry, index) => {
            const status = state.statuses[entry.id];
            return <li key={entry.id}><button type="button" aria-pressed={selected === entry.id} className={`v2-choix-carte vm-offer ${status} ${selected === entry.id ? "sel" : ""}`} style={{ "--i": index } as CSSProperties} onClick={() => setSelected(entry.id)}>
              <i className="choix-num">{ROMAINS[index + 1]}</i>
              <div><strong>{format(entry.affirmation)}</strong><small className="vm-tag">{status === "bought" ? "Achetée" : status === "discarded" ? "Écartée" : `${offerPrice(state, entry)} deniers`}</small></div>
            </button></li>;
          })}
        </ul>
      </section>
      <section className="mg-panel vm-detail" aria-live="polite">
        <p className="mg-label">Offre {ROMAINS[MARKET_OFFERS.indexOf(offer) + 1]}</p>
        <h3 className="mg-claim">« {format(offer.affirmation)} »</h3>
        <dl>
          <dt>Source</dt><dd>{offer.source}</dd>
          <dt>Fiabilité</dt><dd>{offer.fiabilite}</dd>
          <dt>Prix demandé</dt><dd>{offerPrice(state, offer)} deniers{state.surcharge[offer.id] ? ` (contrepartie +${state.surcharge[offer.id]})` : ""}</dd>
          <dt>Risque</dt><dd>{offer.risque}</dd>
          <dt>Preuve</dt><dd>{offer.preuve}</dd>
          <dt>Exposé·e</dt><dd>{offer.expose}</dd>
        </dl>
        {state.checked.includes(offer.id) && <p className="vm-note"><b>Recoupement :</b> {offer.crossCheck}</p>}
        {state.bluffed.includes(offer.id) && <p className="vm-note"><b>Contre-bluff :</b> {offer.bluff}</p>}
        <div className="vm-actions">
          <button type="button" className="scene-outil" disabled={state.statuses[offer.id] === "bought" || offerPrice(state, offer) > budgetLeft} onClick={() => onChange(setOfferStatus(state, offer.id, "bought"))}>Acheter</button>
          <button type="button" className="scene-outil" disabled={state.statuses[offer.id] === "discarded"} onClick={() => onChange(setOfferStatus(state, offer.id, "discarded"))}>Écarter</button>
          <button type="button" className="scene-outil" disabled={state.statuses[offer.id] === "open"} onClick={() => onChange(setOfferStatus(state, offer.id, "open"))}>Remettre en jeu</button>
          <button type="button" className="scene-outil" disabled={state.checked.includes(offer.id) || state.checked.length >= checkLimit(state)} onClick={() => onChange(crossCheck(state, offer.id))}>Recouper</button>
          <button type="button" className="scene-outil" disabled={state.bluffed.includes(offer.id) || state.bluffed.length >= bluffLimit(state)} onClick={() => onChange(bluffOffer(state, offer.id))}>Contre-bluffer</button>
        </div>
        <fieldset className="vm-protect">
          <legend>Qui protéger ? ({state.protectedSources.length} / {protectLimit(state)})</legend>
          {exposedPeople().map((person) => <label key={person}><input type="checkbox" checked={state.protectedSources.includes(person)} disabled={!state.protectedSources.includes(person) && state.protectedSources.length >= protectLimit(state)} onChange={() => onChange(toggleProtection(state, person))} /> {person}</label>)}
        </fieldset>
        {state.lastVerdict && <div className={`vm-verdict ${state.lastVerdict.kind}`} role="status">
          <b>{state.lastVerdict.kind === "clean" ? "L'offre tient." : state.lastVerdict.kind === "partial" ? "L'offre tient à moitié." : "L'offre s'effondre."}</b>
          {state.lastVerdict.lines.map((text) => <p key={text}>{format(text)}</p>)}
          {state.lastVerdict.kind === "failed" && state.attempts >= 2 && <p className="vm-hint">Valurn, à mi-voix : « Un reçu, un mobile. Le reste est décoratif. » Vous pouvez aussi conclure maintenant, à vos frais.</p>}
        </div>}
        <div className="vm-submit">
          <button type="button" className="scene-outil primary" onClick={() => onChange(submitOffer(state))}>Présenter l'offre</button>
          <button type="button" className="scene-outil" disabled={!canConclude(state)} onClick={() => { setRevealIndex(0); onChange(concludeMarket(state)); }}>{state.lastVerdict?.kind === "failed" || !state.lastVerdict ? "Conclure malgré tout" : "Conclure sur cette offre"}</button>
        </div>
      </section>
    </div>}

    {state.phase !== "board" && <>
      {state.result && <aside className="mg-panel vm-result-panel"><p className="mg-label">Issue de la séance</p><p className="mg-claim vm-result">{MARKET_RESULT_LABEL[state.result]}</p>{lineDone && line && <p className="mg-note"><b>{speakerName}{speakerName ? " · " : ""}</b>{format(line.text)}</p>}</aside>}
      {line && !lineDone && <button type="button" className={`dialogue-box vm-advance ${line.speaker === "Narration" ? "narration" : ""}`} onClick={advance}>
        <span className="speaker">{speakerName}</span><p key={lineCounter}>{format(line.text)}</p><small>{lineCounter}<span className="suite-txt"> · Cliquer pour continuer</span></small><i className="dialogue-suite" aria-hidden="true">▼</i>
      </button>}
      {lineDone && line && <div className="choice-box vm-end">
        <p className="choice-question">{reaction || replay ? "Fin de la séance" : "Votre réaction"}</p>
        {!reaction && !replay && <div className="vm-reactions" role="group" aria-label="Votre réaction">{MARKET_REACTIONS.map((entry, index) => <button type="button" key={entry.id} className="v2-choix-carte" style={{ "--i": index } as CSSProperties} onClick={() => choose(entry.id)}><i className="choix-num">{ROMAINS[index + 1]}</i><div><strong>{entry.label}</strong></div></button>)}</div>}
        {!reaction && replay && <button type="button" className="v2-choix-carte" style={{ "--i": 0 } as CSSProperties} onClick={onClose}><i className="choix-num">I</i><div><strong>Fermer le souvenir</strong></div></button>}
        {reaction && <button type="button" className="v2-choix-carte" style={{ "--i": 0 } as CSSProperties} onClick={() => onFinish({ ...state, phase: "done" })}><i className="choix-num">I</i><div><strong>Quitter le salon</strong></div></button>}
      </div>}
    </>}
  </section>;
}
