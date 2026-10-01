/* Interface V2 : sons synthétisés (WebAudio), particules, transitions et échelles d’affichage.
   Porté du prototype proto2 V2.4 (app.js) ; aucune donnée de jeu ici. */

export type SfxName = "survol" | "valider" | "retour" | "ouvrir" | "onglet" | "notif" | "rang" | "temps" | "depart";

const UI_PREFS_KEY = "sylvinia-ca-v2-ui";

export type UiPrefs = { sons: boolean; titleMusic: boolean };

function readPrefs(): UiPrefs {
  try { const raw = JSON.parse(window.localStorage.getItem(UI_PREFS_KEY) || "{}"); return { sons: Boolean(raw.sons), titleMusic: raw.titleMusic !== false }; } catch { return { sons: false, titleMusic: true }; }
}

let prefs: UiPrefs = typeof window === "undefined" ? { sons: false, titleMusic: true } : readPrefs();
const prefListeners = new Set<() => void>();

export function uiPrefs() { return prefs; }
export function setUiPrefs(next: Partial<UiPrefs>) {
  prefs = { ...prefs, ...next };
  try { window.localStorage.setItem(UI_PREFS_KEY, JSON.stringify(prefs)); } catch { /* stockage indisponible */ }
  prefListeners.forEach((listener) => listener());
}
export function subscribeUiPrefs(listener: () => void) { prefListeners.add(listener); return () => { prefListeners.delete(listener); }; }

let audioContext: AudioContext | null = null;
let master: GainNode | null = null;
function ac() {
  if (!audioContext) {
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioContext = new Ctor();
    master = audioContext.createGain();
    master.gain.value = .55;
    master.connect(audioContext.destination);
  }
  return audioContext;
}
function tone(f: number, t0: number, dur: number, type: OscillatorType = "sine", vol = .1, f2?: number) {
  const c = ac(); const t = c.currentTime + t0;
  const o = c.createOscillator(); const g = c.createGain();
  o.type = type; o.frequency.setValueAtTime(f, t);
  if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur);
  g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + .012); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
  o.connect(g).connect(master!); o.start(t); o.stop(t + dur + .05);
}
function souffle(t0: number, dur: number, freq: number, vol = .06) {
  const c = ac(); const t = c.currentTime + t0;
  const b = c.createBuffer(1, Math.floor(c.sampleRate * dur), c.sampleRate); const d = b.getChannelData(0);
  for (let i = 0; i < d.length; i += 1) d[i] = Math.random() * 2 - 1;
  const s = c.createBufferSource(); s.buffer = b;
  const f = c.createBiquadFilter(); f.type = "bandpass"; f.Q.value = 1.4; f.frequency.setValueAtTime(freq, t); f.frequency.exponentialRampToValueAtTime(freq * 4, t + dur);
  const g = c.createGain(); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + dur * .3); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
  s.connect(f).connect(g).connect(master!); s.start(t);
}
const SONS: Record<SfxName, () => void> = {
  survol: () => tone(1480, 0, .05, "triangle", .035),
  valider: () => { tone(880, 0, .12, "triangle", .08); tone(1318, .06, .24, "sine", .07); },
  retour: () => tone(700, 0, .14, "triangle", .06, 420),
  ouvrir: () => { souffle(0, .3, 420, .05); tone(520, .02, .26, "sine", .045, 1040); },
  onglet: () => { souffle(0, .2, 900, .045); tone(990, 0, .07, "triangle", .045); },
  notif: () => { tone(1568, 0, .32, "sine", .05); tone(2093, .08, .42, "sine", .035); },
  rang: () => { [523, 659, 784, 1046, 1318, 1568].forEach((f, i) => tone(f, i * .085, .55, "triangle", .07)); souffle(0, .9, 260, .04); },
  temps: () => { tone(392, 0, .7, "sine", .06, 784); souffle(0, .7, 220, .035); },
  depart: () => { tone(196, 0, 1.2, "sine", .07, 392); [784, 1175, 1568].forEach((f, i) => tone(f, .25 + i * .12, .8, "sine", .045)); souffle(0, 1, 180, .05); },
};
export function sfx(name: SfxName) {
  if (!prefs.sons) return;
  try { const c = ac(); if (c.state === "suspended") void c.resume(); SONS[name](); } catch { /* audio indisponible */ }
}

/* Sons globaux : survol, validation, retour (délégation, comme le prototype). */
let globalSfxInstalled = false;
export function installGlobalSfx() {
  if (globalSfxInstalled || typeof document === "undefined") return;
  globalSfxInstalled = true;
  let last: Element | null = null;
  document.addEventListener("pointerover", (event) => {
    const target = (event.target as Element | null)?.closest?.(".v2 button:not([disabled]), .v2 a[href]");
    if (target && target !== last) { last = target; sfx("survol"); }
  });
  document.addEventListener("click", (event) => {
    const button = (event.target as Element | null)?.closest?.(".v2 button:not([disabled])");
    if (!button) return;
    if (button.matches("[data-close], .retour-btn, .dlg-x")) sfx("retour"); else if (!button.matches("[data-bascule]")) sfx("valider");
  });
  document.addEventListener("keydown", () => document.body.classList.add("clavier"), true);
  document.addEventListener("pointerdown", () => document.body.classList.remove("clavier"), true);
}

/* ---------- Réduction des animations ---------- */
let reducedSetting = false;
export function setReducedSetting(value: boolean) { reducedSetting = value; }
export function reduit() { return reducedSetting || (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches); }

/* ---------- Particules (canvas #fx) ---------- */
export type FxMode = "braises" | "poussiere" | "lucioles" | "petales" | "givre";
const MODES: Record<FxMode, { n: number; col: string; up: boolean; taille: [number, number]; v: number; tombe?: boolean }> = {
  braises: { n: 70, col: "255,190,105", up: true, taille: [1, 2.8], v: .55 },
  poussiere: { n: 42, col: "255,236,196", up: false, taille: [.8, 2.1], v: .16 },
  lucioles: { n: 38, col: "196,170,255", up: false, taille: [1.2, 2.6], v: .22 },
  petales: { n: 34, col: "255,150,190", up: false, taille: [1.2, 2.6], v: .3, tombe: true },
  givre: { n: 50, col: "200,236,255", up: false, taille: [.8, 2.2], v: .35, tombe: true },
};
type Particle = { x: number; y: number; r: number; vx: number; vy: number; a: number; va: number };
export function createParticles(canvas: HTMLCanvasElement) {
  const cx = canvas.getContext("2d");
  let W = 0; let H = 0; let dpr = 1; let parts: Particle[] = []; let mode: FxMode = "braises"; let raf = 0; let actif = false;
  const sprites: Record<string, HTMLCanvasElement> = {};
  const densite = () => { const k = Math.min(1, Math.max(.3, (window.innerWidth * window.innerHeight) / (1600 * 900))); return k * (window.matchMedia("(pointer: coarse)").matches ? .7 : 1); };
  const sprite = (col: string) => {
    if (sprites[col]) return sprites[col];
    const c = document.createElement("canvas"); c.width = c.height = 64; const g = c.getContext("2d")!;
    const r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    r.addColorStop(0, `rgba(${col},1)`); r.addColorStop(.18, `rgba(${col},.85)`); r.addColorStop(.45, `rgba(${col},.18)`); r.addColorStop(1, `rgba(${col},0)`);
    g.fillStyle = r; g.fillRect(0, 0, 64, 64); return (sprites[col] = c);
  };
  const resize = () => { dpr = Math.min(window.devicePixelRatio || 1, 2); W = canvas.width = window.innerWidth * dpr; H = canvas.height = window.innerHeight * dpr; };
  const neuf = (init: boolean): Particle => {
    const m = MODES[mode]; const r = (m.taille[0] + Math.random() * (m.taille[1] - m.taille[0])) * dpr;
    return { x: Math.random() * W, y: init ? Math.random() * H : m.up ? H + 20 : m.tombe ? -20 : Math.random() * H, r, vx: (Math.random() - .5) * m.v * dpr, vy: (m.up ? -(.35 + Math.random()) * m.v * 1.6 : m.tombe ? (.3 + Math.random()) * m.v : (Math.random() - .5) * m.v) * dpr, a: Math.random() * 6.28, va: .01 + Math.random() * .03 };
  };
  const boucle = () => {
    if (!cx) return;
    cx.clearRect(0, 0, W, H); const sp = sprite(MODES[mode].col); cx.globalCompositeOperation = "lighter";
    for (const p of parts) {
      p.a += p.va; p.x += p.vx + Math.sin(p.a) * .35 * dpr; p.y += p.vy;
      if (p.y < -30 || p.y > H + 30 || p.x < -30 || p.x > W + 30) Object.assign(p, neuf(false));
      cx.globalAlpha = .35 + .65 * (.5 + .5 * Math.sin(p.a * 1.7)); const s = p.r * 9; cx.drawImage(sp, p.x - s / 2, p.y - s / 2, s, s);
    }
    raf = requestAnimationFrame(boucle);
  };
  window.addEventListener("resize", resize); resize();
  const api = {
    mode(next: FxMode) {
      if (reduit()) { api.stop(); return; }
      if (next !== mode || !parts.length) { mode = next; parts = Array.from({ length: Math.round(MODES[next].n * densite()) }, () => neuf(true)); }
      if (!actif) { actif = true; canvas.hidden = false; raf = requestAnimationFrame(boucle); }
    },
    stop() { actif = false; cancelAnimationFrame(raf); cx?.clearRect(0, 0, W, H); canvas.hidden = true; },
    destroy() { api.stop(); window.removeEventListener("resize", resize); },
  };
  return api;
}

/* ---------- Transition d’écran (entaille diagonale / encre) ---------- */
export function playTransition(type: "entaille" | "encre" = "entaille"): Promise<void> {
  return new Promise((resolve) => {
    const w = document.getElementById("v2-transition");
    if (!w || reduit()) { resolve(); return; }
    w.className = `transition ${type}`; void w.offsetWidth; w.classList.add("entre");
    const t = type === "encre" ? 560 : 330;
    window.setTimeout(() => { resolve(); requestAnimationFrame(() => { w.classList.add("sort"); window.setTimeout(() => { w.className = "transition"; }, 520); }); }, t);
  });
}

/* ---------- Échelles d’affichage (7 curseurs, mémorisées sur l’appareil) ---------- */
export type ScaleKey = "texte" | "cases" | "sprite" | "hud" | "icones" | "panneaux" | "etiquettes";
export const ECHELLES: Record<ScaleKey, { lib: string; desc: string; min: number; max: number }> = {
  texte: { lib: "Taille du texte", desc: "Textes seuls, cadres inchangés", min: 30, max: 150 },
  cases: { lib: "Taille des cases", desc: "Cadres, panneaux, boutons, marges", min: 30, max: 150 },
  sprite: { lib: "Taille des personnages", desc: "Sprites en pied : Lieu, Fiche, À trois", min: 30, max: 130 },
  hud: { lib: "Barre du haut", desc: "Jour, onglets, bourse, boutons", min: 30, max: 150 },
  icones: { lib: "Icônes et boutons", desc: "Boutons, pictos, pastilles", min: 30, max: 150 },
  panneaux: { lib: "Panneaux latéraux", desc: "Actions du lieu, fiche de carte, codex", min: 30, max: 150 },
  etiquettes: { lib: "Noms sur la carte", desc: "Étiquettes des lieux", min: 30, max: 150 },
};
export const SCALE_KEYS = Object.keys(ECHELLES) as ScaleKey[];
export type Scales = Record<ScaleKey, number>;
export const SCALES_KEY = "sylvinia-ca-v2-echelles";
const VAR_ZONE: Partial<Record<ScaleKey, string>> = { hud: "--s-hud", icones: "--s-ico", panneaux: "--s-pan", etiquettes: "--s-lbl" };
export const DEFAULT_SCALES: Scales = { texte: 100, cases: 100, sprite: 100, hud: 100, icones: 100, panneaux: 100, etiquettes: 100 };
export function borne(key: ScaleKey, value: number) { const e = ECHELLES[key]; const v = Math.round((Number(value) || 100) / 5) * 5; return Math.max(e.min, Math.min(e.max, v)); }
export function readScales(): Scales {
  const scales = { ...DEFAULT_SCALES };
  try { const raw = JSON.parse(window.localStorage.getItem(SCALES_KEY) || "{}"); SCALE_KEYS.forEach((key) => { if (raw[key] != null) scales[key] = borne(key, raw[key]); }); } catch { /* stockage indisponible */ }
  const params = new URLSearchParams(window.location.search);
  SCALE_KEYS.forEach((key) => { if (params.has(key)) scales[key] = borne(key, Number(params.get(key))); });
  return scales;
}
export function storeScales(scales: Scales) { try { window.localStorage.setItem(SCALES_KEY, JSON.stringify(scales)); } catch { /* stockage indisponible */ } }
export function applyScales(scales: Scales) {
  const st = document.documentElement.style;
  st.setProperty("--echelle", String(scales.cases / 100));
  st.setProperty("--txt", String(scales.texte / 100));
  st.setProperty("--tr", (scales.texte / scales.cases).toFixed(4));
  st.setProperty("--sprite", String(scales.sprite / 100));
  st.setProperty("--E0", String(scales.cases / 100)); st.setProperty("--TXT0", String(scales.texte / 100)); st.setProperty("--TR0", (scales.texte / scales.cases).toFixed(4));
  (Object.entries(VAR_ZONE) as [ScaleKey, string][]).forEach(([key, cssVar]) => st.setProperty(cssVar, String((scales[key] ?? 100) / 100)));
  document.documentElement.classList.toggle("ech-petite", Math.min(scales.texte, scales.cases) < 70);
  document.documentElement.classList.toggle("ech-mini", Math.min(scales.texte, scales.cases) < 45);
}
