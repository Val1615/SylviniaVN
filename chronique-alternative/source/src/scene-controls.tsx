/* Contrôles de lecture partagés par les scènes CA (dialogue, intime, à trois, Bellirith & Naïah).
 *
 * Retour : on ne rejoue jamais un effet. Chaque scène garde une pile d’instantanés
 * purement visuels (réplique, phase, distribution) poussés à chaque avancée simple,
 * et vidée au moment d’un choix, seul endroit où la chronique est modifiée. Revenir
 * en arrière ne fait donc que ré-afficher un état déjà vu, sans jamais traverser un choix.
 *
 * Historique : même panneau pour toutes les scènes, discret et translucide comme
 * celui du Mode Histoire. Chaque entrée porte une clé ; une réplique déjà inscrite
 * n’est jamais dupliquée, et revenir en arrière retire la réplique quittée. */
import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import { CHARACTERS, type DialogueLine } from "./game-data";
import { speakerCharacterIds } from "./narrative-system";

export type SceneBacklogEntry = { key?: string; speaker: string; text: string; color?: string; narration?: boolean; choice?: boolean };

/** Pile d’instantanés pour revenir en arrière dans une scène. */
export function useRollback<S>(limit = 400) {
  const [past, setPast] = useState<S[]>([]);
  return {
    canBack: past.length > 0,
    depth: past.length,
    record: (snapshot: S) => setPast((entries) => [...entries.slice(-(limit - 1)), snapshot]),
    clear: () => setPast([]),
    pop: (): S | undefined => {
      const last = past[past.length - 1];
      if (last !== undefined) setPast(past.slice(0, -1));
      return last;
    },
  };
}

/** Une scène ne réagit au clavier que si elle est la plus haute et qu’aucune fenêtre modale ne la couvre. */
export function sceneOwnsKeyboard(section: HTMLElement | null, event: KeyboardEvent) {
  if (event.altKey || event.ctrlKey || event.metaKey) return false;
  const target = event.target as HTMLElement | null;
  if (target?.closest?.("input, textarea, select, [contenteditable='true']")) return false;
  if (!section) return false;
  if (document.querySelector("[aria-modal='true'], .modal-backdrop, dialog[open]")) return false;
  const scenes = document.querySelectorAll(".v2-scene");
  return scenes[scenes.length - 1] === section;
}

/** Historique d’une scène : une entrée par réplique affichée, une par choix. */
export function useSceneBacklog(resetKey: string, lineKey: string, currentLine: DialogueLine | undefined, showing: boolean, format: (text: string) => string, cast: string[]) {
  const [backlog, setBacklog] = useState<SceneBacklogEntry[]>([]);
  const [backlogOpen, setBacklogOpen] = useState(false);
  const backlogRef = useRef<HTMLDivElement>(null);
  const formatRef = useRef(format);
  formatRef.current = format;
  const castKey = cast.join(",");
  useEffect(() => { setBacklog([]); }, [resetKey]);
  useEffect(() => {
    if (!showing || !currentLine) return;
    const speakerId = speakerCharacterIds(currentLine.speaker, castKey.split(","))[0];
    const entry: SceneBacklogEntry = { key: lineKey, speaker: formatRef.current(currentLine.speaker), text: formatRef.current(currentLine.text), color: CHARACTERS.find((item) => item.id === speakerId)?.color, narration: currentLine.speaker === "Narration" };
    setBacklog((entries) => entries[entries.length - 1]?.key === lineKey ? entries : [...entries, entry]);
  }, [showing, currentLine, lineKey, castKey]);
  useEffect(() => {
    if (!backlogOpen) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape" || event.key.toLowerCase() === "h") { event.preventDefault(); event.stopPropagation(); setBacklogOpen(false); } };
    window.addEventListener("keydown", onKey, true);
    requestAnimationFrame(() => { const list = backlogRef.current; if (list) list.scrollTop = list.scrollHeight; });
    return () => window.removeEventListener("keydown", onKey, true);
  }, [backlogOpen]);
  return {
    backlog, backlogOpen, setBacklogOpen, backlogRef,
    logChoice: (text: string) => setBacklog((entries) => [...entries, { speaker: "Votre choix", text, choice: true }]),
    /** À appeler en revenant en arrière depuis une réplique : la réplique quittée sort de l’historique. */
    rewind: (leavingKey: string) => setBacklog((entries) => entries[entries.length - 1]?.key === leavingKey ? entries.slice(0, -1) : entries),
  };
}

/** Raccourcis : H ouvre l’historique, ← ou Retour arrière reviennent à la réplique précédente. */
export function useSceneShortcuts(section: RefObject<HTMLElement | null>, { backlogOpen, openBacklog, canBack, onBack }: { backlogOpen: boolean; openBacklog: () => void; canBack: boolean; onBack: () => void }) {
  const live = useRef({ openBacklog, canBack, onBack });
  live.current = { openBacklog, canBack, onBack };
  useEffect(() => {
    if (backlogOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (!sceneOwnsKeyboard(section.current, event)) return;
      if (event.key.toLowerCase() === "h") { event.preventDefault(); live.current.openBacklog(); return; }
      if ((event.key === "ArrowLeft" || event.key === "Backspace") && live.current.canBack) { event.preventDefault(); live.current.onBack(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [backlogOpen, section]);
}

/** Barre de lecture discrète, posée au-dessus de la boîte de dialogue (style Mode Histoire). */
export function SceneControls({ canBack, onBack, historyCount, onHistory }: { canBack: boolean; onBack: () => void; historyCount: number; onHistory: () => void }) {
  return <nav className="scene-lecture" aria-label="Lecture de la scène" onClick={(event) => event.stopPropagation()}>
    <button type="button" className="scene-lecture-btn" data-act="back" disabled={!canBack} title="Réplique précédente (← ou Retour arrière)" aria-label="Revenir à la réplique précédente" onClick={onBack}><span aria-hidden="true">‹</span>Retour</button>
    <button type="button" className="scene-lecture-btn" data-act="backlog" disabled={!historyCount} title="Historique de la scène (H)" aria-label="Historique des répliques" onClick={onHistory}><span aria-hidden="true">☰</span>Historique<kbd>H</kbd></button>
  </nav>;
}

/** Panneau d’historique translucide, ancré à droite pour laisser l’illustration visible. */
export function SceneBacklog({ title, backlog, backlogRef, onClose }: { title: string; backlog: SceneBacklogEntry[]; backlogRef: RefObject<HTMLDivElement | null>; onClose: () => void }) {
  return <div className="scene-backlog" role="dialog" aria-modal="true" aria-label="Historique de la scène" onClick={(event) => { event.stopPropagation(); if (event.target === event.currentTarget) onClose(); }}>
    <div className="backlog-boite"><header><div><span className="surtitre">Historique</span><h3>{title}</h3></div><button type="button" className="dlg-x" data-close aria-label="Fermer l’historique" onClick={onClose}><span>✕</span><kbd>Échap</kbd></button></header>
      <div className="backlog-liste" ref={backlogRef as RefObject<HTMLDivElement>}>{backlog.map((entry, index) => <div key={`${entry.key || "choix"}-${index}`} className={`backlog-ligne ${entry.narration ? "narration" : ""} ${entry.choice ? "choix" : ""}`} style={{ "--c": entry.color || "var(--or)" } as CSSProperties}>{!entry.narration && <b>{entry.choice ? "➤ Votre choix" : entry.speaker}</b>}<p>{entry.text}</p></div>)}</div>
    </div>
  </div>;
}
