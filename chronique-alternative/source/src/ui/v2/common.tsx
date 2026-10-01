import { useEffect, useRef, useState, type ReactNode } from "react";
import { LOGO_SVG, ORN_SVG } from "./art";
import { reduit, sfx } from "./fx";

export function Orn4() {
  return <>{["tl", "tr", "bl", "br"].map((pos) => <i key={pos} className={`orn ${pos}`} aria-hidden="true" dangerouslySetInnerHTML={{ __html: ORN_SVG }} />)}</>;
}

export function Kbd({ children }: { children: ReactNode }) { return <kbd>{children}</kbd>; }

export function Logo() { return <div className="t-logo" dangerouslySetInnerHTML={{ __html: LOGO_SVG }} />; }

export function Seau({ color, portrait, className = "" }: { color: string; portrait: string; className?: string }) {
  return <span className={`sceau ${className}`} style={{ "--c": color } as React.CSSProperties}><img src={portrait} alt="" loading="lazy" /></span>;
}

export const ROMAINS = ["0", "I", "II", "III", "IV", "V"];

/* Fenêtre modale (dialog natif) : Échap, clic extérieur, × épinglé — comme le prototype. */
export function V2Dialog({ surtitre, titre, classe = "", children, pied, onClose, label }: { surtitre?: string; titre: ReactNode; classe?: string; children: ReactNode; pied?: ReactNode; onClose: () => void; label?: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [closing, setClosing] = useState(false);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (!dialog.open) { try { dialog.showModal(); } catch { dialog.setAttribute("open", ""); } }
    sfx("ouvrir");
    const focus = dialog.querySelector<HTMLElement>(".principal:not([disabled]), .choix-don, .pause-item");
    if (focus && document.body.classList.contains("clavier")) focus.focus();
    return () => { if (dialog.open) dialog.close(); };
  }, []);
  const close = () => {
    if (closing) return;
    if (reduit()) { closeRef.current(); return; }
    setClosing(true);
    window.setTimeout(() => closeRef.current(), 180);
  };
  return <dialog
    ref={ref}
    className={`dlg ${classe} ${closing ? "ferme" : ""}`}
    aria-label={label || (typeof titre === "string" ? titre : undefined)}
    onCancel={(event) => { event.preventDefault(); sfx("retour"); close(); }}
    onClick={(event) => { if (event.target === event.currentTarget) close(); }}
  >
    <div className="dlg-boite">
      <Orn4 />
      <header className="dlg-tete"><div>{surtitre && <span className="surtitre">{surtitre}</span>}<h2>{titre}</h2></div><button type="button" className="dlg-x" data-close aria-label="Fermer" onClick={close}><span>✕</span><kbd>Échap</kbd></button></header>
      <div className="dlg-corps">{children}</div>
      {pied && <footer className="dlg-pied">{pied}</footer>}
    </div>
  </dialog>;
}

export function AudioButtons({ music, onMusic, sons, onSons }: { music: boolean; onMusic: () => void; sons: boolean; onSons: () => void }) {
  return <>
    <button type="button" className={`rond ${music ? "on" : ""}`} data-bascule="musique" aria-pressed={music} title="Musique" aria-label="Musique" onClick={onMusic}><svg viewBox="0 0 24 24"><path d="M9 18V5l11-2v13" fill="none" stroke="currentColor" strokeWidth="1.8" /><circle cx="6.5" cy="18" r="2.6" fill="currentColor" /><circle cx="17.5" cy="16" r="2.6" fill="currentColor" /></svg></button>
    <button type="button" className={`rond ${sons ? "on" : ""}`} data-bascule="sons" aria-pressed={sons} title="Sons d’interface" aria-label="Sons d’interface" onClick={onSons}><svg viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" /><path className="ondes" d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg></button>
  </>;
}

/* Navigation clavier « manette » : flèches spatiales entre éléments focalisables visibles. */
export function moveFocus(dx: number, dy: number) {
  const dialog = document.querySelector("dialog[open]");
  const root = dialog || document.querySelector(".v2-root");
  if (!root) return;
  const visible = (el: Element) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== "hidden"; };
  const list = [...root.querySelectorAll<HTMLElement>("button:not([disabled]), a[href], input, select, [data-nav]")].filter((el) => visible(el) && !el.closest("[inert]") && !el.closest(".nav-mobile"));
  if (!list.length) return;
  const active = document.activeElement as HTMLElement | null;
  if (!active || !list.includes(active)) { (list.find((el) => el.matches(".cmd-item, .t-item, .principal")) || list[0]).focus(); return; }
  const a = active.getBoundingClientRect(); const ax = a.left + a.width / 2; const ay = a.top + a.height / 2;
  let best: HTMLElement | null = null; let score = Infinity;
  for (const el of list) {
    if (el === active) continue;
    const b = el.getBoundingClientRect(); const bx = b.left + b.width / 2; const by = b.top + b.height / 2;
    const px = (bx - ax) * dx; const py = (by - ay) * dy;
    const prim = dx ? px : py; const orth = dx ? Math.abs(by - ay) : Math.abs(bx - ax);
    if (prim <= 4) continue;
    const s = prim + orth * 2.2;
    if (s < score) { score = s; best = el; }
  }
  if (best) { best.focus({ preventScroll: false }); best.scrollIntoView({ block: "nearest", inline: "nearest" }); }
}
