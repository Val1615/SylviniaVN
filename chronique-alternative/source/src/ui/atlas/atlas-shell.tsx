import { useEffect, useState } from "react";
import { UI_STYLE_META, type AtlasDeviceProfile, type TouchNavigation, type UiStyle } from "./atlas-ui";

export type AtlasTab = "place" | "map" | "jobs" | "relations" | "journal" | "inventory" | "codex" | "options";

export const ATLAS_NAVIGATION: { id: AtlasTab; icon: string; label: string; short?: string }[] = [
  { id: "place", icon: "◉", label: "Lieu" },
  { id: "map", icon: "◇", label: "Carte" },
  { id: "jobs", icon: "◈", label: "Jobs" },
  { id: "relations", icon: "♡", label: "Relations" },
  { id: "journal", icon: "≡", label: "Journal" },
  { id: "inventory", icon: "⌂", label: "Biens" },
  { id: "codex", icon: "✧", label: "Codex" },
  { id: "options", icon: "⚙", label: "Options" },
];

const MOBILE_PRIMARY: AtlasTab[] = ["place", "map", "relations", "journal"];
const MOBILE_MORE: AtlasTab[] = ["jobs", "inventory", "codex", "options"];

type AtlasChromeProps = {
  active: AtlasTab;
  onNavigate: (tab: AtlasTab) => void;
  location: string;
  context: string;
  day: number;
  period: string;
  periodIcon: string;
  coins: number;
  confluence: number;
  style: UiStyle;
  onCycleStyle: () => void;
  device: AtlasDeviceProfile;
  touchNavigation: TouchNavigation;
  statusVisible: boolean;
  music: boolean;
  soundtrack: string;
  onToggleMusic: () => void;
};

export function AtlasChrome({ active, onNavigate, location, context, day, period, periodIcon, coins, confluence, style, onCycleStyle, device, touchNavigation, statusVisible, music, soundtrack, onToggleMusic }: AtlasChromeProps) {
  const [moreOpen, setMoreOpen] = useState(false);
  const [profileToast, setProfileToast] = useState(false);
  const profile = UI_STYLE_META[style];
  const moreActive = MOBILE_MORE.includes(active);

  useEffect(() => {
    setMoreOpen(false);
  }, [active]);

  useEffect(() => {
    if (!profileToast) return;
    const timer = window.setTimeout(() => setProfileToast(false), 2100);
    return () => window.clearTimeout(timer);
  }, [profileToast, style]);

  useEffect(() => {
    if (!moreOpen) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMoreOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [moreOpen]);

  const navigate = (tab: AtlasTab) => {
    setMoreOpen(false);
    onNavigate(tab);
  };

  const profileButton = <button className="atlas-profile-switch" type="button" onClick={() => { onCycleStyle(); setProfileToast(true); }} title={`Profil ${profile.label} · changer de densité`} aria-label={`Profil d’interface ${profile.label}. Changer de profil.`}><span>{profile.glyph}</span><small>{profile.label}</small></button>;

  return <>
    <header className="atlas-topbar">
      <div className="atlas-wordmark"><strong>Sylvinia</strong>{profileButton}</div>
      <div className="atlas-context"><span>{location}</span><i>·</i><strong>{context}</strong></div>
      <div className="atlas-top-actions">
        {statusVisible && <div className="atlas-world-status"><span>{periodIcon} {period}</span><span>Jour {day}</span><span>{coins} ◈</span><span>{confluence} ✦</span></div>}
        <button className="atlas-audio" type="button" onClick={onToggleMusic} title={soundtrack} aria-label={music ? `Couper la musique · ${soundtrack}` : `Activer la musique · ${soundtrack}`}><span>{music ? "♫" : "♩"}</span><small>{music ? "Son" : "Muet"}</small></button>
      </div>
    </header>

    <nav className="atlas-side-nav" aria-label="Navigation principale">
      <div className="atlas-nav-brand">S</div>
      <div className="atlas-side-links">{ATLAS_NAVIGATION.map((item, index) => <button type="button" key={item.id} className={active === item.id ? "active" : ""} aria-current={active === item.id ? "page" : undefined} onClick={() => navigate(item.id)}><span>{item.icon}</span><strong>{item.label}</strong><kbd>{index + 1}</kbd></button>)}</div>
      <small className="atlas-chronicle-label">Chronique<br />Alternative</small>
    </nav>

    <nav className="atlas-bottom-nav" aria-label="Navigation tactile">
      {MOBILE_PRIMARY.map((id) => {
        const item = ATLAS_NAVIGATION.find((entry) => entry.id === id)!;
        return <button type="button" key={id} className={active === id ? "active" : ""} aria-current={active === id ? "page" : undefined} onClick={() => navigate(id)}><span>{item.icon}</span><strong>{item.label}</strong></button>;
      })}
      <button type="button" className={moreOpen || moreActive ? "active" : ""} aria-expanded={moreOpen} onClick={() => setMoreOpen((current) => !current)}><span>•••</span><strong>Plus</strong></button>
    </nav>

    {moreOpen && <div className="atlas-more-layer" role="presentation" onClick={() => setMoreOpen(false)}>
      <section className="atlas-more-sheet" role="dialog" aria-modal="true" aria-label="Navigation supplémentaire" onClick={(event) => event.stopPropagation()}>
        <header><div><p>Navigation</p><h2>Plus de registres</h2></div><button type="button" onClick={() => setMoreOpen(false)} aria-label="Fermer">×</button></header>
        <div>{MOBILE_MORE.map((id) => { const item = ATLAS_NAVIGATION.find((entry) => entry.id === id)!; return <button type="button" key={id} className={active === id ? "active" : ""} onClick={() => navigate(id)}><span>{item.icon}</span><strong>{item.label}</strong><small>{id === "jobs" ? "Contrats et travaux" : id === "inventory" ? "Inventaire et logis" : id === "codex" ? "Monde et personnages" : "Interface et sauvegardes"}</small></button>; })}</div>
      </section>
    </div>}

    <footer className="atlas-footer"><span>{periodIcon} {period}</span><i /> <span>{location}</span><strong>{context}</strong><small>Profil {profile.label} · {device} · navigation {touchNavigation}</small></footer>

    {profileToast && <div className="atlas-profile-toast" role="status"><span>{profile.glyph}</span><div><strong>Interface {profile.label}</strong><small>{profile.detail}</small></div></div>}
  </>;
}
