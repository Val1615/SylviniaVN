import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { CrossQuestDossier } from "./cross-quest-dossier";
import { HN_TITLES, HN_OBJECTIVES } from "./hylee-naiah-cross-quest";
import { HN_DATE_IDS, hnDateReason, type HNDateContext } from "./hylee-naiah-dates";
import type { CrossQuestProgress } from "./cross-quests";
import {
  SEARCH_CATEGORIES, SEARCH_LIMITS, searchCard, searchAnalysis, searchEvidence, searchActionReason,
  searchCompleteHypothesis, selectSearchCard, noteSearchCard, investigateSearch, locateHylee, retryHyleeSearch,
  type HyleeSearchState, type SearchCategory, type SearchSource,
} from "./hylee-search";

export function HNDossier({ progress, game, onScene, onSearch }: {
  progress: CrossQuestProgress; game: HNDateContext;
  onScene: (stage: number, replay?: boolean) => void; onSearch: (replay?: boolean) => void;
}) {
  const hn = progress.hn!;
  const searchActive = progress.stage === 4 && hn.search?.result !== "success";
  const dateReason = progress.stage >= 5 && progress.stage < 8 ? hnDateReason(HN_DATE_IDS[progress.stage - 5], game) : undefined;
  return <CrossQuestDossier
    className="hn-dossier"
    portraits={[{ src: "/assets/portraits/hylee.jpg", alt: "Hylee" }, { src: "/assets/portraits/naiah.jpg", alt: "Naïah" }]}
    eyebrow="Des Échos à la Forêt Interdite"
    title="Hylee & Naïah"
    description="Naïah aimerait revoir Hylee. Quelques occasions de se retrouver, un retour près de l’Auberge, et les décisions qui changent la suite."
    progress={progress.stage} total={8}
    current={progress.stage < 8 ? {
      title: HN_TITLES[progress.stage], objective: dateReason || HN_OBJECTIVES[progress.stage],
      action: !searchActive ? <button className="primary-action" disabled={!!dateReason} onClick={() => onScene(progress.stage)}>{hn.checkpoint ? "Reprendre la conversation" : progress.stage >= 5 ? "Vivre cette rencontre" : "Vivre cette étape"}</button> : undefined,
    } : undefined}
    completed={progress.stage >= 8 ? { title: "Elles ont déjà fixé leur prochaine sortie", description: "Hylee et Naïah se retrouvent désormais de leur propre initiative. Votre porte reste ouverte, sans que chaque rencontre dépende de vous." } : undefined}
    mechanic={progress.stage >= 4 ? {
      title: "Retrouver Hylee", description: "Recoupez ses habitudes, les traces du terrain et les témoignages pour choisir un refuge, un trajet et une manifestation du froid.",
      status: <span>{hn.search?.result === "success" ? "Hylee localisée · enquête conservée" : hn.search?.phase === "retreat" ? "Repli effectué · indices conservés" : `${hn.search?.clues.length || 0} indices · ${hn.search?.turn || 0} / 8 actions`}</span>,
      action: searchActive ? <button className="primary-action" onClick={() => onSearch(false)}>{hn.search ? "Reprendre la recherche" : "Chercher Hylee"}</button>
        : hn.search?.result === "success" ? <button className="secondary-action" onClick={() => onSearch(true)}>Rejouer l’enquête</button> : undefined,
    } : undefined}
    milestones={HN_TITLES.slice(0, progress.stage).map((title, stage) => ({ id: stage, title, detail: "Relecture protégée", onReplay: () => onScene(stage, true) }))}
    postSeries={progress.stage >= 7 ? <p>Hylee et Naïah se proposent déjà des moments ensemble. L’invitation au logis reste disponible lorsque vous possédez un logement.</p> : undefined}
  />;
}

const TUTORIAL = [
  ["Une enquête commune", "Hylee a choisi un abri et laissé une piste. Chaque indice vient de cette même fuite. Vos choix, vos observations et vos notes restent dans le dossier quand vous fermez la recherche."],
  ["Trois sources différentes", "Naïah se souvient des habitudes d’Hylee. Le terrain vérifie le trajet ou la manifestation que vous choisissez. Un témoin décrit un refuge ou un passage : il ne connaît pas sa magie."],
  ["Un sondage ciblé", "Sélectionnez une hypothèse et recueillez au moins deux indices avant de sonder votre refuge. Après l’incident avec la mère, Naïah déploie ses ombres différemment ; elle peut attendre un troisième indice ou agiter le froid."],
  ["Localiser et reprendre", "Une localisation coûte une action. Une erreur augmente l’instabilité et contredit un élément précis. À trois instabilités ou huit actions, repliez-vous, puis reprenez avec vos indices et vos notes. Une piste convaincante permet de réussir plus tôt."],
];
const sourceNames: Record<SearchSource, string> = { naiah: "Parler à Naïah", terrain: "Inspecter le terrain", witness: "Interroger un témoin", shadow: "Sondage d’ombre" };

export function HyleeSearchModal({ state, replay = false, onChange, onClose, onFinish }: {
  state: HyleeSearchState; replay?: boolean; onChange: (state: HyleeSearchState) => void; onClose: () => void; onFinish: () => void;
}) {
  const dialog = useRef<HTMLElement>(null), latest = useRef(state), helpButton = useRef<HTMLButtonElement>(null);
  const [category, setCategory] = useState<SearchCategory>("refuge");
  const [tutorial, setTutorial] = useState<number | null>(!replay && !state.tutorialSeen ? 0 : null);
  const [terrainCategory, setTerrainCategory] = useState<SearchCategory>("route");
  const [terrainTarget, setTerrainTarget] = useState("inn");
  const [witnessCategory, setWitnessCategory] = useState<SearchCategory>("refuge");
  const [witnessTarget, setWitnessTarget] = useState("oak");
  const tutorialRef = useRef<HTMLDivElement>(null);
  latest.current = state;
  const analysis = searchAnalysis(state);
  const active = state.phase === "investigation" && tutorial === null;
  function change(next: HyleeSearchState) { latest.current = next; onChange(next); }
  function closeTutorial() {
    setTutorial(null);
    if (!latest.current.tutorialSeen) change({ ...latest.current, tutorialSeen: true, revision: latest.current.revision + 1 });
    helpButton.current?.focus();
  }
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    dialog.current?.focus();
    return () => { if (previous?.isConnected) previous.focus(); };
  }, []);
  useEffect(() => {
    if (tutorial !== null) tutorialRef.current?.focus();
  }, [tutorial]);
  function keyDown(event: KeyboardEvent) {
    if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); tutorial !== null ? closeTutorial() : onClose(); return; }
    if (event.key !== "Tab") return;
    const root = tutorial !== null ? tutorialRef.current : dialog.current;
    const controls = Array.from(root?.querySelectorAll<HTMLElement>("button:not(:disabled), select:not(:disabled), summary") || []).filter(el => el.getClientRects().length);
    const first = controls[0], last = controls.at(-1);
    if (event.shiftKey && (document.activeElement === first || document.activeElement === root)) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && (document.activeElement === last || document.activeElement === root)) { event.preventDefault(); first?.focus(); }
  }
  function targetSelector(source: "terrain" | "witness") {
    const isTerrain = source === "terrain", cat = isTerrain ? terrainCategory : witnessCategory, id = isTerrain ? terrainTarget : witnessTarget;
    const categories = SEARCH_CATEGORIES.filter(c => (isTerrain ? ["route", "manifestation"] : ["refuge", "route"]).includes(c.id));
    return <div className="hn-source-target">
      <label><span>Catégorie à vérifier</span><select aria-label={`${isTerrain ? "Terrain" : "Témoin"} · catégorie`} value={cat} disabled={!active} onChange={event => {
        const next = event.target.value as SearchCategory, card = SEARCH_CATEGORIES.find(c => c.id === next)!.cards[0].id;
        if (isTerrain) { setTerrainCategory(next); setTerrainTarget(card); } else { setWitnessCategory(next); setWitnessTarget(card); }
      }}>{categories.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}</select></label>
      <label><span>Piste ciblée</span><select aria-label={`${isTerrain ? "Terrain" : "Témoin"} · piste`} value={id} disabled={!active} onChange={e => isTerrain ? setTerrainTarget(e.target.value) : setWitnessTarget(e.target.value)}>{SEARCH_CATEGORIES.find(c => c.id === cat)!.cards.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
    </div>;
  }
  return <div className="modal-backdrop hn-search-backdrop">
    <section ref={dialog} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="hn-search-title" className="hn-search" onKeyDown={keyDown}>
      <header className="hn-search-heading"><div><p className="eyebrow">{replay ? "Relecture de l’enquête · aucun impact" : "Forêt Interdite · enquête"}</p><h2 id="hn-search-title">Retrouver Hylee</h2><p>Un refuge, un trajet, les traces du froid. Recoupez vos observations.</p></div>
        <div className="hn-search-meters"><span>Actions<b>{state.turn} / 8</b></span><span>Indices<b>{state.clues.length}</b></span><span>Instabilité<b>{state.instability} / 3</b></span><span>État<b>{state.phase === "localized" ? "Localisée" : state.phase === "retreat" ? "Repli" : "Enquête"}</b></span></div>
        <div className="hn-heading-buttons"><button ref={helpButton} onClick={() => setTutorial(0)} aria-label="Ouvrir le didacticiel">?</button><button onClick={onClose} aria-label={replay ? "Fermer la relecture" : "Fermer et conserver la progression"}>×</button></div>
      </header>
      <div className="hn-search-stage" inert={tutorial !== null}>
        <div className="hn-search-board">
          <nav className="hn-category-tabs" aria-label="Catégories de l’enquête">{SEARCH_CATEGORIES.map(c => <button key={c.id} aria-pressed={category === c.id} onClick={() => setCategory(c.id)}>{c.title}</button>)}</nav>
          <div className="hn-search-columns">{SEARCH_CATEGORIES.map(c => <section key={c.id} className={`hn-search-category ${category === c.id ? "hn-category-active" : ""}`} aria-label={c.title}>
            <h3>{c.title}</h3><div className="hn-search-cards">{c.cards.map(card => {
              const score = searchEvidence(state, c.id, card.id), selected = state.selected[c.id] === card.id, note = state.notes[`${c.id}:${card.id}`] || "maybe";
              const evidence = score < 0 ? "Contradiction" : score >= 4 ? "Forte concordance" : score > 0 ? "Soutien" : "Peu d’éléments";
              return <article key={card.id} className={`hn-search-card ${selected ? "selected" : ""} ${score < 0 ? "against" : score > 0 ? "supported" : ""}`}>
                <button disabled={!active} aria-pressed={selected} aria-label={`Sélectionner ${card.name} · ${evidence}`} onClick={() => change(selectSearchCard(latest.current, c.id, card.id))}>
                  <figure className={`hn-card-image ${card.treatment || ""}`}><img src={card.image} alt="" loading="lazy" /></figure>
                  <strong>{card.name}</strong><span>{card.description}</span><small>{evidence}</small>
                </button>
                <button className="hn-note-button" disabled={!active} onClick={() => change(noteSearchCard(latest.current, c.id, card.id))} aria-label={`Note personnelle pour ${card.name} : ${note === "maybe" ? "à examiner" : note === "yes" ? "retenue" : "écartée"}. Changer la note.`}>{note === "maybe" ? "◇ À examiner" : note === "yes" ? "✓ Retenue" : "× Écartée"}</button>
              </article>;
            })}</div>
          </section>)}</div>
          <div className="hn-hypothesis"><h3>Votre hypothèse</h3><div>{SEARCH_CATEGORIES.map(c => <span key={c.id}><small>{c.title}</small><b>{searchCard(c.id, state.selected[c.id])?.name || "À choisir"}</b></span>)}</div><p>{analysis.support} concordances · {analysis.contradictions} contradictions · {analysis.neutral} indices neutres</p><small>Les marques sur les cartes viennent des indices recueillis. Vos notes restent personnelles.</small></div>
        </div>
        <aside className="hn-search-sources"><h3>Recouper les pistes</h3>{(["naiah", "terrain", "witness", "shadow"] as SearchSource[]).map(source => {
          const cat = source === "terrain" ? terrainCategory : source === "witness" ? witnessCategory : undefined;
          const target = source === "terrain" ? terrainTarget : source === "witness" ? witnessTarget : undefined;
          const reason = searchActionReason(state, source, cat, target);
          return <section key={source} className="hn-search-source"><h4>{sourceNames[source]}<span>{Math.max(0, SEARCH_LIMITS[source] - state.uses[source])} / {SEARCH_LIMITS[source]}</span></h4>
            <p>{source === "naiah" ? "Ses souvenirs et les habitudes d’Hylee." : source === "terrain" ? "Des traces observées sur une piste précise." : source === "witness" ? "Ce qu’une personne a vu, à cet endroit." : "Une vérification du refuge de votre hypothèse."}</p>
            {(source === "terrain" || source === "witness") && targetSelector(source)}
            <button disabled={!active || !!reason} onClick={() => change(investigateSearch(latest.current, source, cat, target))}>{sourceNames[source]}</button>
            {source === "shadow" && reason && state.phase === "investigation" && <small>{reason}</small>}
            {(source === "terrain" || source === "witness") && reason && state.phase === "investigation" && <small>{reason}</small>}
          </section>;
        })}
          <details className="hn-clue-dossier" open><summary>Indices recueillis · {state.clues.length}</summary><ol>{state.clues.map(c => <li key={c.id}><small>{c.source === "localization" ? "Vérification sur place" : sourceNames[c.source]}</small><p>{c.text}</p></li>)}</ol>{!state.clues.length && <p>Parlez à Naïah ou choisissez une piste à inspecter.</p>}</details>
        </aside>
      </div>
      <footer className="hn-search-footer"><div className="hn-search-message" role="status" aria-live="polite"><img src="/assets/portraits/naiah.jpg" alt="" /><div><b>{state.speaker}</b><p>{state.message}</p></div></div><div className="hn-search-decision">
        {state.phase === "localized" ? <button className="primary-action" onClick={onFinish}>{replay ? "Terminer la relecture" : "Retrouver Hylee"}</button>
          : state.phase === "retreat" ? <button className="primary-action" onClick={() => change(retryHyleeSearch(latest.current))}>Reprendre avec les indices acquis</button>
          : <><button className="primary-action" disabled={!active || !searchCompleteHypothesis(state)} onClick={() => change(locateHylee(latest.current))}>Localiser Hylee</button><small>1 action · une erreur accroît l’instabilité</small></>}
      </div></footer>
      {tutorial !== null && <div className="hn-tutorial-backdrop"><div ref={tutorialRef} tabIndex={-1} className="hn-tutorial" role="region" aria-label="Didacticiel de la recherche"><p className="eyebrow">Didacticiel · {tutorial + 1} / 4</p><h3>{TUTORIAL[tutorial][0]}</h3><p>{TUTORIAL[tutorial][1]}</p><div><button onClick={closeTutorial}>Fermer le didacticiel</button>{tutorial > 0 && <button onClick={() => setTutorial(tutorial - 1)}>Précédent</button>}<button className="primary-action" onClick={() => tutorial === 3 ? closeTutorial() : setTutorial(tutorial + 1)}>{tutorial === 3 ? "Commencer l’enquête" : "Suivant"}</button></div></div></div>}
    </section>
  </div>;
}
