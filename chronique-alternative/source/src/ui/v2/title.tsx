import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AudioButtons, Logo } from "./common";
import { reduit, sfx } from "./fx";

export type TitleAction = "continuer" | "nouvelle" | "charger" | "options" | "apropos" | "histoire";
type TitleItem = { act: TitleAction; lib: string; sous?: string; desc: string; off?: boolean; petit?: boolean };

let titleSeen = false;

/* Écran titre V2 : cinématique réelle de la Chronique Alternative → « Appuyez » → menu. */
export function V2Title({ hasSave, saveSummary, savesCount, music, onToggleMusic, sons, onToggleSons, onAction, dialogOpen }: {
  hasSave: boolean;
  saveSummary?: string;
  savesCount: number;
  music: boolean;
  onToggleMusic: () => void;
  sons: boolean;
  onToggleSons: () => void;
  onAction: (action: TitleAction) => void;
  dialogOpen: boolean;
}) {
  const initial = new URLSearchParams(window.location.hash.split("?")[1] || window.location.search).get("intro");
  const [etat, setEtat] = useState<"intro" | "press" | "menu">(() => initial === "menu" || initial === "press" || initial === "intro" ? initial : titleSeen ? "menu" : reduit() ? "press" : "intro");
  const [actif, setActif] = useState(0);
  const menuRef = useRef<HTMLElement>(null);
  const [curseur, setCurseur] = useState<{ y: number; h: number; w: number }>({ y: 0, h: 0, w: 0 });
  const touch = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

  const items: TitleItem[] = [
    ...(hasSave ? [{ act: "continuer" as const, lib: "Continuer", sous: saveSummary, desc: "Reprendre la chronique là où vous l’avez laissée — sauvegarde automatique de cet appareil." }] : []),
    { act: "nouvelle", lib: "Nouvelle chronique", desc: hasSave ? "Franchir le portail avec un nouveau personnage. La sauvegarde automatique actuelle sera remplacée ; les emplacements manuels sont conservés." : "Franchir le portail avec un nouveau personnage." },
    { act: "charger", lib: "Charger", desc: savesCount ? `${savesCount} chronique${savesCount > 1 ? "s" : ""} enregistrée${savesCount > 1 ? "s" : ""} sur cet appareil.` : "Aucune sauvegarde sur cet appareil.", off: !savesCount },
    { act: "options", lib: "Options", desc: "Échelles d’affichage, audio et accessibilité. Modifiables à tout moment." },
    { act: "apropos", lib: "À propos", desc: "Ce qu’est la Chronique Alternative, et ce qui la distingue du Mode Histoire." },
    { act: "histoire", lib: "Retour au Mode Histoire", desc: "Quitter la branche alternative et revenir au Visual Novel principal.", petit: true },
  ];

  const demarrer = useCallback(() => {
    setEtat((current) => {
      if (current === "menu") return current;
      sfx("depart");
      titleSeen = true;
      return "menu";
    });
    window.setTimeout(() => { const first = menuRef.current?.querySelector<HTMLButtonElement>(".t-item:not([disabled])"); first?.focus({ preventScroll: true }); }, 700);
  }, []);

  useEffect(() => {
    if (etat !== "intro") return;
    const timer = window.setTimeout(() => setEtat((current) => current === "intro" ? "press" : current), 3000);
    return () => window.clearTimeout(timer);
  }, [etat]);

  useEffect(() => {
    if (etat === "menu") return;
    const listener = (event: KeyboardEvent) => { if (event.metaKey || event.ctrlKey || dialogOpen) return; event.preventDefault(); demarrer(); };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [demarrer, etat, dialogOpen]);

  const placer = useCallback(() => {
    const button = menuRef.current?.querySelectorAll<HTMLButtonElement>(".t-item")[actif];
    if (button) setCurseur({ y: button.offsetTop, h: button.offsetHeight, w: button.offsetWidth });
  }, [actif]);
  useLayoutEffect(() => { placer(); }, [placer, etat, hasSave]);
  useEffect(() => { window.addEventListener("resize", placer); return () => window.removeEventListener("resize", placer); }, [placer]);
  useEffect(() => { if (etat === "menu" && document.body.classList.contains("clavier")) menuRef.current?.querySelector<HTMLButtonElement>(".t-item")?.focus(); }, [etat]);

  return <main className={`titre etat-${etat}`} aria-label="Écran titre" onClick={(event) => { if (etat !== "menu" && !(event.target as Element).closest(".t-coin")) demarrer(); }}>
    <div className="t-couches" aria-hidden="true">
      <video className="t-video" autoPlay={!reduit()} loop={!reduit()} muted playsInline preload="auto" disablePictureInPicture aria-hidden="true"><source src={`${import.meta.env.BASE_URL}assets/menu/chroniques-alternatives.mp4`} type="video/mp4" /></video>
      <div className="t-vignette" />
    </div>
    <div className="t-noir" aria-hidden="true" />
    <Logo />
    <button type="button" className="t-press" onClick={demarrer}><span className="t-press-txt">{touch ? "Touchez l’écran pour commencer" : "Appuyez sur une touche"}</span><kbd>Entrée</kbd></button>
    <nav className="t-menu" aria-label="Menu principal" ref={menuRef}>
      <span className="t-curseur" aria-hidden="true" style={{ transform: `translateY(${curseur.y}px)`, height: curseur.h, width: curseur.w }}><i /></span>
      {items.map((item, index) => <button type="button" key={item.act} className={`t-item ${item.petit ? "petit" : ""} ${index === 0 ? "principal" : ""} ${index === actif ? "actif" : ""}`} style={{ "--i": index } as React.CSSProperties} data-act={item.act} disabled={item.off}
        onMouseEnter={(event) => { if (!item.off) event.currentTarget.focus({ preventScroll: true }); }}
        onFocus={() => setActif(index)}
        onClick={() => onAction(item.act)}><span className="t-lib">{item.lib}</span>{item.sous && <small>{item.sous}</small>}</button>)}
    </nav>
    <div className="t-desc" aria-live="polite"><span className="t-desc-ico">✦</span><p>{items[actif]?.desc}</p></div>
    <div className="t-coin"><AudioButtons music={music} onMusic={onToggleMusic} sons={sons} onSons={onToggleSons} /></div>
    <footer className="t-pied"><span>Chronique Alternative · Sauvegarde locale · Réservé aux adultes (18+)</span><span className="hints"><kbd>↑</kbd><kbd>↓</kbd> Choisir <kbd>Entrée</kbd> Valider <kbd>Échap</kbd> Retour</span></footer>
  </main>;
}
