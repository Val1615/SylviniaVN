import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
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
export function ValurnMarketModal({ state, replay = false, format, onChange, onClose, onFinish }: {
  state: ValurnMarketState; replay?: boolean; format: Format;
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

  return <div className="vm-backdrop" role="presentation">
    <section ref={ref} tabIndex={-1} onKeyDown={keyDown} className="vm-game" role="dialog" aria-modal="true" aria-labelledby="vm-title" data-vm-phase={state.phase}>
      <header className="vm-head">
        <div>
          <p className="eyebrow">{replay ? "Souvenir · aucun gain" : "Valurn · Quête 5"}</p>
          <h2 id="vm-title">La partie truquée</h2>
        </div>
        <div className="vm-meters" aria-live="polite">
          <span>{APPROACH_LABEL[state.approach]}</span>
          <span>Budget <b>{budgetLeft}</b> / {MARKET_BUDGET}</span>
          <span>Recoupements <b>{checkLimit(state) - state.checked.length}</b></span>
          <span>Bluffs <b>{bluffLimit(state) - state.bluffed.length}</b></span>
          <span>Essais <b>{state.attempts}</b></span>
        </div>
        <button type="button" className="vm-close" onClick={onClose}>{replay ? "Quitter le souvenir" : "Reprendre plus tard"}</button>
      </header>

      {state.phase === "board" && <div className="vm-board">
        <p className="vm-rule">{MARKET_INTRO[state.approach]} Achetez les affirmations qui forment votre offre, écartez les autres, protégez {protectLimit(state) > 1 ? "deux personnes exposées" : "une personne exposée"}, puis présentez l'offre. Une offre ratée ajoute une contrepartie ; vous pouvez toujours recommencer.</p>
        <ul className="vm-offers" aria-label="Registre des offres">
          {MARKET_OFFERS.map((entry) => {
            const status = state.statuses[entry.id];
            return <li key={entry.id}><button type="button" aria-pressed={selected === entry.id} className={`vm-offer ${status} ${selected === entry.id ? "sel" : ""}`} onClick={() => setSelected(entry.id)}>
              <span className="vm-tag">{status === "bought" ? "Achetée" : status === "discarded" ? "Écartée" : `${offerPrice(state, entry)} d.`}</span>
              <span>{format(entry.affirmation)}</span>
            </button></li>;
          })}
        </ul>
        <article className="vm-detail" aria-live="polite">
          <h3>« {format(offer.affirmation)} »</h3>
          <dl>
            <dt>Source</dt><dd>{offer.source}</dd>
            <dt>Fiabilité</dt><dd>{offer.fiabilite}</dd>
            <dt>Prix demandé</dt><dd>{offerPrice(state, offer)} deniers{state.surcharge[offer.id] ? ` (contrepartie +${state.surcharge[offer.id]})` : ""}</dd>
            <dt>Risque de divulgation</dt><dd>{offer.risque}</dd>
            <dt>Preuve disponible</dt><dd>{offer.preuve}</dd>
            <dt>Personne exposée</dt><dd>{offer.expose}</dd>
          </dl>
          {state.checked.includes(offer.id) && <p className="vm-note"><b>Recoupement :</b> {offer.crossCheck}</p>}
          {state.bluffed.includes(offer.id) && <p className="vm-note"><b>Contre-bluff :</b> {offer.bluff}</p>}
          <div className="vm-actions">
            <button type="button" disabled={state.statuses[offer.id] === "bought" || offerPrice(state, offer) > budgetLeft} onClick={() => onChange(setOfferStatus(state, offer.id, "bought"))}>Acheter</button>
            <button type="button" disabled={state.statuses[offer.id] === "discarded"} onClick={() => onChange(setOfferStatus(state, offer.id, "discarded"))}>Écarter</button>
            <button type="button" disabled={state.statuses[offer.id] === "open"} onClick={() => onChange(setOfferStatus(state, offer.id, "open"))}>Remettre en jeu</button>
            <button type="button" disabled={state.checked.includes(offer.id) || state.checked.length >= checkLimit(state)} onClick={() => onChange(crossCheck(state, offer.id))}>Recouper</button>
            <button type="button" disabled={state.bluffed.includes(offer.id) || state.bluffed.length >= bluffLimit(state)} onClick={() => onChange(bluffOffer(state, offer.id))}>Contre-bluffer</button>
          </div>
        </article>
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
          <button type="button" className="primary" onClick={() => onChange(submitOffer(state))}>Présenter l'offre</button>
          <button type="button" disabled={!canConclude(state)} onClick={() => { setRevealIndex(0); onChange(concludeMarket(state)); }}>{state.lastVerdict?.kind === "failed" || !state.lastVerdict ? "Conclure malgré tout" : "Conclure sur cette offre"}</button>
        </div>
      </div>}

      {state.phase !== "board" && <div className="vm-scene">
        <figure className="vm-sprite"><img src={spritePath("valurn", line?.speaker === "Valurn" && line.mood ? line.mood : "neutral", "neutral")} alt="Valurn" /></figure>
        <div className="vm-dialogue">
          {state.result && <p className="vm-result">{MARKET_RESULT_LABEL[state.result]}</p>}
          {line && <p className={`vm-line ${line.speaker === "Narration" ? "narration" : ""}`}>{line.speaker !== "Narration" && <b>{line.speaker === "{player}" ? format("{player}") : line.speaker} · </b>}{format(line.text)}</p>}
          {!reaction && !revealDone && <button type="button" onClick={() => setRevealIndex(revealIndex + 1)}>Suite</button>}
          {!reaction && revealDone && !replay && <div className="vm-reactions">{MARKET_REACTIONS.map((entry) => <button type="button" key={entry.id} onClick={() => choose(entry.id)}>{entry.label}</button>)}</div>}
          {!reaction && revealDone && replay && <button type="button" onClick={onClose}>Fermer le souvenir</button>}
          {reaction && !reactionDone && <button type="button" onClick={() => setReactionIndex(reactionIndex + 1)}>Suite</button>}
          {reaction && reactionDone && <button type="button" className="primary" onClick={() => onFinish({ ...state, phase: "done" })}>Quitter le salon</button>}
        </div>
      </div>}
    </section>
  </div>;
}
