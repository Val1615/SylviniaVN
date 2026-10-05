/*! Sylvinia · Mode Histoire — interface « Bibliothèque astrale » (prototype validé, monté tel quel)
 *
 *  Principe : le moteur du jeu (index.html) reste seul maître de la logique (scènes, choix, valeurs,
 *  codex, fragments, sauvegarde, musique). En mode Bibliothèque, son interface classique est masquée
 *  (host.css) et l’interface du prototype — même DOM, même CSS (proto.css, importée telle quelle dans un
 *  Shadow DOM), mêmes animations — est rendue à partir de l’état du moteur. Chaque action du joueur
 *  dans l’interface du prototype est renvoyée au moteur (choose/go/launchChapterSelect/newGame/resume…).
 *  Mode Classique : l’hôte est masqué, l’interface d’origine réapparaît telle quelle.
 */
(() => {
"use strict";
if (window.__bibliothequeAstrale) return; window.__bibliothequeAstrale = true;
const BASE = (document.currentScript && document.currentScript.src || "").replace(/adapter\.js.*$/, "") || "assets/ui/biblio-astrale/";
const VER = "45";
const SKIN_KEY = "sylvinia_ui_biblio_v1";
const KEY = "sylvinia_biblio_astrale_v2";           // réglages d’interface + signets + journal de lecture
const ROM = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX"];
const ORN = '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M2 62V22C2 10 10 2 22 2h40" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M8 62V26C8 15 15 8 26 8h36" fill="none" stroke="currentColor" stroke-width=".8" opacity=".55"/><path d="M14 14l5 -7 5 7 -5 7z" fill="currentColor"/><circle cx="2" cy="34" r="2" fill="currentColor"/><circle cx="34" cy="2" r="2" fill="currentColor"/><path d="M8 40q6-2 8-10M40 8q-2 6-10 8" fill="none" stroke="currentColor" stroke-width="1" opacity=".7"/></svg>';
const VALS = [["audace", "Audace", "AU"], ["sangfroid", "Sang-froid", "SF"], ["lucidite", "Lucidité", "LU"], ["resonance", "Résonance", "RÉ"], ["lien", "Lien Remerii", "♥"]];
const VLAB = Object.fromEntries(VALS.map((v) => [v[0], v]));
Object.assign(VLAB, { courage: ["courage", "Courage", "CO"], discretion: ["discretion", "Discrétion", "DI"], trust: ["trust", "Confiance", "CF"], suspicion: ["suspicion", "Méfiance", "MÉ"], instability: ["instability", "Instabilité", "IN"], hope: ["hope", "Espoir", "ES"], pacteNaiah: ["pacteNaiah", "Pacte de Naïah", "PN"] });
const DOS = ["#1b2a5c", "#5a1e2e", "#15403a", "#3a2160", "#4a2e1c", "#2a3340", "#16404f", "#4a1f45", "#24335e", "#5b2a1c"];
const IMG = (f) => BASE + "img/" + f;
const VID = { intro: "assets/video/intro/lv_0_20260814181240.mp4", ouverture: "assets/video/title_intro_banner.mp4", titre: "assets/video/video_title.mp4", ca: "chronique-alternative/assets/menu/chroniques-alternatives.mp4" };
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
// accès aux liaisons globales du moteur (déclarations de premier niveau partagées entre scripts classiques)
const fn = (n) => { try { const f = (0, eval)(n); return typeof f === "function" ? f : null; } catch { return null; } };
const val = (n, d) => { try { const v = (0, eval)(n); return v === undefined ? d : v; } catch { return d; } };
const ST = () => val("state", {}) || {};
const setState = (o) => { window.__baNouvelEtat = o; (0, eval)("state = window.__baNouvelEtat"); delete window.__baNouvelEtat; };
const setGlobal = (n, f) => { window.__baF = f; try { (0, eval)(`${n} = window.__baF`); } catch {} try { window[n] = f; } catch {} delete window.__baF; };

/* ---------- Bascule Bibliothèque / Classique ---------- */
const skinCfg = () => { try { return Object.assign({ skin: "biblio" }, JSON.parse(localStorage.getItem(SKIN_KEY) || "{}")); } catch { return { skin: "biblio" }; } };
const actif = () => document.body.classList.contains("ui-biblio");

/* ---------- Hôte Shadow DOM : le <body> du prototype ---------- */
const host = document.createElement("div"); host.id = "bA-host";
const R = host.attachShadow({ mode: "open" });
R.innerHTML = `<link rel="stylesheet" href="${BASE}proto.css?v=${VER}"><link rel="stylesheet" href="${BASE}adapter.css?v=${VER}">
<div class="pbody" id="pbody"><div id="app">
  <div id="fond" aria-hidden="true"></div>
  <div id="particules" aria-hidden="true"></div>
  <main id="ecran"></main>
  <div id="couche"></div>
  <div id="toasts" aria-live="polite"></div>
  <div id="transition" aria-hidden="true"><i></i></div>
</div></div>`;
document.body.appendChild(host);
const PB = R.getElementById("pbody");
const $ = (s, r = R) => r.querySelector(s), $$ = (s, r = R) => [...r.querySelectorAll(s)];
// les clics restent dans l’interface du prototype (le moteur ne doit pas les interpréter)
["click", "dblclick", "contextmenu"].forEach((t) => host.addEventListener(t, (e) => e.stopPropagation()));

/* ---------- Données vivantes du moteur ---------- */
const S_ = () => val("S", {});
const A_ = () => val("A", {});
function romain(r) { const v = { I: 1, V: 5, X: 10, L: 50 }; let t = 0; for (let i = 0; i < r.length; i++) { const a = v[r[i]], b = v[r[i + 1]] || 0; t += a < b ? -a : a; } return t; }
function parseChap(label) {
  const L = String(label || "").split(" · ")[0].trim();
  if (/^Introduction/i.test(L)) return "intro";
  const m = /^Chapitre\s+([IVXL]+)(?:[-_ ]?([A-Z]))?/.exec(L); if (!m) return null;
  const n = romain(m[1]); const suf = (m[2] || "").toLowerCase();
  if (suf && CHAP[`ch${n}_${suf}`]) return `ch${n}_${suf}`;
  return CHAP[`ch${n}`] ? `ch${n}` : (CHAP[`ch${n}_i`] ? `ch${n}_i` : null);
}
let CHAP = {}, D = {};
function donnees() {
  const chapters = (val("CHAPTER_SELECT_DATA", []) || []).map((c) => { const o = { key: c.key, label: c.label, title: c.title, subtitle: c.subtitle, tags: c.tags || [], body: c.body || "", img: c.image, action: c.action };
    const m = /_(I|G)$/.exec(o.label || ""); if (m) { o.route = m[1] === "I" ? "Iriana" : "Groupe"; o.label = o.label.replace(/_(I|G)$/, ""); } return o; });
  CHAP = Object.fromEntries(chapters.map((c, i) => [c.key, { ...c, i }]));
  D = { chapters, entries: val("CODEX_ENTRIES", {}), entryGroups: val("CODEX_ENTRY_GROUPS", []), images: val("CODEX_IMAGES", {}), imageGroups: val("CODEX_IMAGE_GROUPS", []), music: val("CODEX_MUSIC", {}), musicGroups: val("CODEX_MUSIC_GROUPS", []),
    items: val("PROGRESSION_ITEMS", {}), memories: val("PROGRESSION_MEMORIES", {}), caps: val("PROGRESSION_STAT_CAPS", {}) };
  return D;
}
const CH_OF = (id) => { id = String(id || ""); if (/^c10g?_/.test(id)) return CHAP.ch10 ? "ch10" : "ch1"; const f = fn("getSceneChapterLabel"); let k = null; try { k = parseChap(f ? f(id) : ""); } catch {} return k || "ch1"; };
const unlockedCh = () => { const f = fn("chapterSelectUnlocked"); return D.chapters.filter((c) => { try { return f ? !!f(c.key) : c.key === "ch1"; } catch { return false; } }).map((c) => c.key); };
const IMG_OK = () => new Set(ST().devCodexForceAccess ? Object.keys(D.images) : (ST().codexUnlockedImages || []));
const ENT_OK = () => new Set(ST().devCodexForceAccess ? Object.keys(D.entries) : (ST().codexUnlocked || []));
const MUS_OK = () => new Set(ST().devCodexForceAccess ? Object.keys(D.music) : (ST().codexUnlockedMusic || []));
const imgSrc = (k) => (D.images[k] && D.images[k].src) || A_()[k] || "";

/* ---------- État d’interface (localStorage propre au mode Bibliothèque) ---------- */
const REG0 = { texte: 100, cases: 100, sprite: 100, hud: 100, icones: 100, panneaux: 100, etiquettes: 100, vitesse: 55, auto: 3, facile: true, reduit: false, ui: "complete", sons: false };
let G;
try { G = Object.assign({ reg: {}, signets: [], journal: [] }, JSON.parse(localStorage.getItem(KEY) || "{}")); } catch { G = { reg: {}, signets: [], journal: [] }; }
G.reg = { ...REG0, ...(G.reg || {}) };
try { const old = JSON.parse(localStorage.getItem(SKIN_KEY) || "{}"); if (old.preset && !G.reg.uiMigre) { G.reg.ui = old.preset; G.reg.uiMigre = true; } } catch {}
const sauver = () => { try { localStorage.setItem(KEY, JSON.stringify(G)); } catch {} };
(() => { const q = new URLSearchParams(location.search); Object.keys(REG0).forEach((k) => { if (q.has(k)) { const v = q.get(k); G.reg[k] = typeof REG0[k] === "boolean" ? v === "1" : typeof REG0[k] === "string" ? v : +v; } }); })();
// musique : celle du moteur (state.musicOn / menuMusicOn), active par défaut
const musiqueOn = () => ST().musicOn !== false;

/* ---------- Échelles (7 curseurs, comme la CA V2) ---------- */
const ECH = [
  ["texte", "Taille du texte", "Dialogues, fiches et menus", 30, 150],
  ["cases", "Taille des cases", "Boîtes, boutons, marges", 30, 150],
  ["sprite", "Taille des personnages", "Sprites en scène", 30, 130],
  ["hud", "Barre du haut", "Lieu, onglets-livres, retour", 30, 150],
  ["icones", "Icônes et boutons", "Boutons ronds, pictos, outils", 30, 150],
  ["panneaux", "Panneaux", "Boîte de dialogue, choix, fiches", 30, 150],
  ["etiquettes", "Étiquettes", "Plaque de nom, cotes, gemmes", 30, 150],
];
const UI = [["complete", "Complète"], ["epuree", "Épurée"], ["cine", "Cinématique"]];
function appliquerUI() { const u = UI.some((x) => x[0] === G.reg.ui) ? G.reg.ui : "complete"; PB.classList.toggle("ui-epuree", u === "epuree"); PB.classList.toggle("ui-cine", u === "cine");
  $$(".btn-ui").forEach((b) => { b.dataset.ui = u; b.setAttribute("aria-label", `Interface : ${UI.find((x) => x[0] === u)[1]} — changer (touche H)`); }); }
function changerUI(u) { const i = UI.findIndex((x) => x[0] === G.reg.ui); G.reg.ui = u || UI[(i + 1) % UI.length][0]; sauver(); appliquerUI(); $$("[data-act=ui-set]").forEach((b) => b.classList.toggle("actif", b.dataset.ui === G.reg.ui));
  toast(`<span class="toast-ui"><i aria-hidden="true">◐</i> Interface <b>${UI.find((x) => x[0] === G.reg.ui)[1]}</b> <kbd>H</kbd></span>`, "ui"); }
function appliquerEchelles() {
  const s = PB.style, r = G.reg;
  s.setProperty("--echelle", r.cases / 100); s.setProperty("--txt", r.texte / 100); s.setProperty("--sprite", r.sprite / 100);
  s.setProperty("--s-hud", r.hud / 100); s.setProperty("--s-ico", r.icones / 100); s.setProperty("--s-pan", r.panneaux / 100); s.setProperty("--s-lbl", r.etiquettes / 100);
  PB.classList.toggle("reduit", !!r.reduit || matchMedia("(prefers-reduced-motion: reduce)").matches);
  appliquerUI();
}

/* ---------- Audio : la musique du moteur ---------- */
const audioEl = () => document.getElementById("music");
function pisteEcran() {
  const e = PB.dataset.ecran;
  if (e === "jeu") { const s = S_()[ST().scene] || {}; const f = fn("resolveSceneMusic"); try { return f ? f(ST().scene, s.music || "music_training") : s.music; } catch { return s.music; } }
  if (["avertissement", "intro", "ouverture", "mode"].includes(e)) return "music_title_intro";
  return "music_menu";
}
let pisteCourante = null;
function jouerMusique(cle) {
  if (!actif()) return; cle = cle || pisteEcran();
  const pm = fn("playMusic"); if (!pm || !musiqueOn()) return;
  const a = audioEl(); if (a && pisteCourante === cle && !a.paused) return;
  try { pm(cle); pisteCourante = cle; } catch {}
}
// Les navigateurs bloquent l’autoplay : la musique démarre au premier geste et reste active.
["pointerdown", "keydown", "touchend"].forEach((t) => document.addEventListener(t, () => { if (!actif() || !musiqueOn()) return; const a = audioEl();
  if (a && a.paused) { if (a.currentSrc || a.getAttribute("src")) a.play().catch(() => {}); else jouerMusique(); } }, { capture: true, passive: true }));
let actx;
function son(type) {
  if (!G.reg.sons) return;
  try { actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const t = actx.currentTime, g = actx.createGain(); g.connect(actx.destination);
    if (type === "page") { const n = actx.createBufferSource(), b = actx.createBuffer(1, actx.sampleRate * .22, actx.sampleRate), d = b.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 2) * Math.sin(i / d.length * Math.PI);
      const f = actx.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = 2400; n.buffer = b; n.connect(f); f.connect(g); g.gain.value = .25; n.start(t); }
    else { const o = actx.createOscillator(); o.type = "sine"; o.frequency.setValueAtTime(type === "choix" ? 880 : 660, t); o.frequency.exponentialRampToValueAtTime(type === "choix" ? 1320 : 990, t + .12);
      g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.12, t + .02); g.gain.exponentialRampToValueAtTime(.0001, t + .5); o.connect(g); o.start(t); o.stop(t + .5); }
  } catch {}
}

/* ---------- Fond, particules, transitions ---------- */
function fond(type, src, poster) {
  const f = $("#fond");
  if (f.dataset.src === (src || "") && f.dataset.type === (type || "")) return; f.dataset.src = src || ""; f.dataset.type = type || "";
  if (type === "video") {
    f.innerHTML = `<video src="${src}" ${poster ? `poster="${poster}"` : ""} muted loop playsinline autoplay preload="auto"></video><div class="fond-voile"></div>`;
    const v = $("video", f); v.muted = true; if (PB.classList.contains("reduit")) { v.removeAttribute("autoplay"); v.pause(); } else v.play().catch(() => {});
  } else if (type === "biblio") {
    f.innerHTML = `<div class="fond-img biblio" style="background-image:url(${src})"></div><div class="fond-voile biblio"></div>`;
  } else f.innerHTML = "";
}
function particules(n) {
  const p = $("#particules"); if (p.childElementCount === n) return; p.innerHTML = "";
  let s = 7; const r = () => (s = (s * 16807) % 2147483647, (s - 1) / 2147483646);
  for (let i = 0; i < n; i++) { const e = document.createElement("i"); const z = r() < .8 ? 2 + r() * 4 : 6 + r() * 10;
    e.style.cssText = `left:${r() * 100}%;top:${r() * 100}%;--pz:${z};--d:${8 + r() * 14}s;--dl:-${r() * 20}s;opacity:${.25 + r() * .7};${r() < .3 ? "--pc:#a9c8ff" : ""}`; p.appendChild(e); }
}
function orner(root = R) { $$("[data-orn]", root).forEach((el) => { if (el.querySelector(":scope > .orn")) return; ["tl", "tr", "bl", "br"].forEach((c) => { const i = document.createElement("i"); i.className = "orn " + c; i.innerHTML = ORN; el.appendChild(i); }); }); }
function toast(html, cls = "") { const t = document.createElement("div"); t.className = "toast " + cls; t.innerHTML = html; $("#toasts").appendChild(t); setTimeout(() => t.classList.add("sort"), 2600); setTimeout(() => t.remove(), 3200); }

/* ---------- Routeur interne (même grammaire que le prototype : #/ecran/param?q) ---------- */
let H = "#/avertissement", retourVers = "#/titre";
function aller(h, opts = {}) {
  H = h; if (!actif()) return;
  const tr = $("#transition");
  if (opts.direct || PB.classList.contains("reduit")) return route();
  tr.classList.remove("on"); void tr.offsetWidth; tr.classList.add("on"); son("page"); clearTimeout(aller._t); aller._t = setTimeout(route, 230); setTimeout(() => tr.classList.remove("on"), 760);
}
function route() {
  const h = H || "#/titre"; const [path, qs] = h.slice(2).split("?"); const parts = path.split("/"); const q = new URLSearchParams(qs || "");
  fermerCouche(); clearTimeout(autoT); clearInterval(typeT); clearTimeout(carteT);
  PB.classList.remove("intime"); PB.dataset.ecran = parts[0];
  donnees();
  const f = { avertissement: ecranAvertissement, intro: ecranIntro, ouverture: ecranOuverture, mode: ecranMode, titre: ecranTitre, chapitres: ecranChapitres,
    carte: ecranCarte, jeu: ecranJeu, codex: ecranCodex, progression: ecranProgression, reglages: ecranReglages, signets: ecranSignets }[parts[0]] || ecranTitre;
  f(parts.slice(1), q);
  orner($("#ecran"));
  if (q.get("ov")) ouvrirCouche(q.get("ov"), q);
  if (!["codex", "jeu"].includes(parts[0])) jouerMusique(pisteEcran());
}
function monter(html, cls) { const e = $("#ecran"); e.className = cls || ""; e.innerHTML = html; e.scrollTop = 0; if (cls !== "e-jeu") J = null; }
R.addEventListener("click", (ev) => {
  const go = ev.target.closest("[data-go]"); if (go) { ev.preventDefault(); son("clic"); if (go.dataset.retour) retourVers = go.dataset.retour; naviguer(go.dataset.go); return; }
  const act = ev.target.closest("[data-act]"); if (act) { son("clic"); actions[act.dataset.act]?.(act, ev); }
});
// navigation : les écrans qui ont un équivalent moteur passent par setScreen (logique, musique, sauvegarde du moteur)
const ECRAN_MOTEUR = { titre: "title", chapitres: "chapters", codex: "codex", progression: "progression", mode: "modeSelect", ouverture: "splashTitle", avertissement: "disclaimer" };
const HASH_DE = { disclaimer: "#/avertissement", splashTitle: "#/ouverture", modeSelect: "#/mode", title: "#/titre", chapters: "#/chapitres", codex: "#/codex", progression: "#/progression", game: "#/jeu" };
function naviguer(h) {
  const e = h.slice(2).split(/[/?]/)[0];
  if (e === "jeu") { reprendre(h); return; }
  if (ECRAN_MOTEUR[e]) { const s = ST(); if (e === "chapitres") s.chapterReturn = retourVers.startsWith("#/jeu") ? "game" : "title"; if (e === "progression") s.progressReturn = retourVers.startsWith("#/jeu") ? "game" : "title"; moteurEcran(ECRAN_MOTEUR[e], h); return; }
  aller(h);
}
let pilote = false;
function moteurEcran(nom, h) { const f = fn("setScreen"); pilote = true; try { if (f) f(nom); } catch (e) { console.warn("[biblio] setScreen", e); } finally { pilote = false; } aller(h || HASH_DE[nom] || "#/titre"); }
function moteurJeu() { const ss = fn("setScreen"); pilote = true; try { ss && ss("game"); } finally { pilote = false; } fn("render")?.(); }
const actions = {
  "plein-ecran": () => { const d = document; if (d.fullscreenElement) d.exitFullscreen?.(); else d.documentElement.requestFullscreen?.().catch(() => {}); },
  musique: () => { const s = ST(); const on = !musiqueOn(); s.musicOn = on; s.menuMusicOn = on; try { fn("save")?.(); } catch {}
    if (on) { pisteCourante = null; jouerMusique(pisteEcran()); } else audioEl()?.pause();
    $$('[data-act="musique"]').forEach((x) => x.classList.toggle("off", !on)); toast(on ? "♪ Musique activée" : "♪ Musique coupée"); },
  ca: () => { const f = fn("openAlternativeChronicleFromModeSelect"); if (f) f(); else document.getElementById("modeChronicleBtn")?.click(); },
  fermer: () => fermerCouche(),
  entrer: () => { try { fn("markDisclaimerSeen")?.(); } catch {} window.__sylviniaDisclaimerAcceptedThisLoad = true; aller("#/intro"); },
  histoire: () => moteurEcran("title", "#/titre"),
  ouvrir: () => moteurEcran("modeSelect", "#/mode"),
};
function btnRetour(h, lib = "Retour") { return `<button class="retour ico" data-go="${h}" aria-label="${lib}"><span aria-hidden="true">‹</span><em>${lib}</em></button>`; }
function entete(kicker, titre, h, extra = "") { return `<header class="entete z-hud">${btnRetour(h)}<div class="entete-t"><p class="kicker">${kicker}</p><h1 class="titre-ecran">${titre}</h1></div>${extra}</header>`; }

/* ---------- 1. Avertissement ---------- */
function ecranAvertissement() {
  fond("biblio", IMG("bibliotheque.webp")); particules(36);
  monter(`<section class="avert">
  <article class="avert-carte verre z-pan" data-orn>
    <header class="avert-tete">
      <div class="sceau-lune" aria-hidden="true">☾</div>
      <div><p class="kicker">Les Chroniques de Sylvinia · Tome I</p><h1 class="titre-deco">Bienvenue en Sylvinia <span class="badge-beta">Bêta</span></h1></div>
    </header>
    <div class="avert-corps">
      <div class="avert-col">
        <p class="avert-texte"><b>Les Chroniques de Sylvinia</b> est un visual novel basé sur l’univers de <b>Sylvinia</b>, imaginé, supervisé et validé par <b>le Chroniqueur Vagabond</b>.</p>
        <p class="avert-fin">Par souci de transparence : cette version du jeu a été réalisée avec l’aide d’outils d’intelligence artificielle pour la programmation, les images et les musiques. Chaque élément reste sélectionné, dirigé et validé par le Chroniqueur Vagabond afin de servir l’identité de l’univers.</p>
      </div>
      <div class="avert-col">
        <div class="fiche-note beta"><b class="fn-t">Version bêta</b><p>Ce jeu est actuellement en version bêta. Il peut encore contenir des bugs d’affichage, de sauvegarde, de navigation, d’audio ou de progression. Merci de signaler toute anomalie avec le bouton <strong>Signaler un bug</strong>.</p></div>
        <div class="fiche-note mobile"><b class="fn-t">Conseil smartphone</b><p>Sur téléphone, l’expérience est plus confortable en <strong>orientation horizontale</strong> et en plein écran une fois en jeu. L’interface Bibliothèque astrale s’adapte à l’écran ; le mode mobile classique reste disponible si vous repassez en interface Classique.</p></div>
      </div>
    </div>
    <footer class="avert-actions"><button class="btn-or grand" data-act="entrer"><span>Entrer dans le récit</span></button></footer>
  </article></section>`, "e-avert");
}

/* ---------- 2. Cinématique du Chroniqueur Vagabond (logo + « IA enhanced ») — vidéo réelle du jeu ---------- */
function ecranIntro() {
  fond(); particules(0);
  monter(`<section class="intro" data-act="passer-intro" aria-label="Introduction vidéo — toucher pour passer">
    <video id="introVideo" src="${VID.intro}" poster="${IMG("intro-chroniqueur-poster.jpg")}" muted playsinline preload="auto"></video>
    <div class="intro-cadre" aria-hidden="true"></div></section>`, "e-intro");
  const v = $("#introVideo"); const fin = () => { if (PB.dataset.ecran === "intro") moteurEcran("splashTitle", "#/ouverture"); };
  v.addEventListener("ended", fin); v.addEventListener("error", fin);
  jouerMusique("music_title_intro");
  if (!PB.classList.contains("reduit")) v.play().catch(() => {}); else setTimeout(fin, 600);
}
actions["passer-intro"] = () => moteurEcran("splashTitle", "#/ouverture");

/* ---------- 3. Ouverture (bannière + « Appuyer pour commencer ») ---------- */
function ecranOuverture() {
  fond("video", VID.ouverture, IMG("ouverture-poster.jpg")); particules(24);
  monter(`<section class="ouverture" data-act="ouvrir">
    <button class="appuyer" data-act="ouvrir"><i class="filet g" aria-hidden="true"></i><span class="appuyer-p">Appuyer pour commencer</span><i class="filet d" aria-hidden="true"></i></button>
  </section>`, "e-ouverture");
}

/* ---------- 4. Choix du mode ---------- */
function ecranMode() {
  fond("biblio", IMG("grande_bibliotheque.webp")); particules(30);
  const vol = (cls, attr, video, poster, num, k, t, d) => `<button class="volume ${cls}" ${attr}>
      <span class="vol-dos" aria-hidden="true"><i class="vol-num">${num}</i></span>
      <span class="vol-couv"><video src="${video}" poster="${poster}" muted loop playsinline preload="auto"></video><span class="vol-voile"></span>
        <span class="vol-contenu"><span class="kicker">${k}</span><span class="vol-titre">${t}</span><span class="vol-desc">${d}</span><span class="vol-ouvrir">Ouvrir le volume ›</span></span></span>
    </button>`;
  monter(`<section class="mode">
    <div class="mode-volumes">
      ${vol("vol-histoire", 'data-act="histoire" aria-label="Ouvrir le Mode Histoire"', VID.titre, IMG("titre-poster.jpg"), "I", "Visual Novel", "Mode Histoire", "Suivre l’histoire d’Hylee et parcourir le récit principal des Chroniques de Sylvinia.")}
      <div class="mode-ou" aria-hidden="true"><span>OU</span></div>
      ${vol("vol-ca", 'data-act="ca" aria-label="Ouvrir les Chroniques Alternatives"', VID.ca, IMG("chronique-alternative-poster.jpg"), "✦", "Mode libre", "Chroniques Alternatives", "Créer son personnage et vivre librement dans une autre Sylvinia.")}
    </div></section>`, "e-mode");
  $$(".volume").forEach((b) => { const v = $("video", b); v.muted = true; const on = () => { if (!PB.classList.contains("reduit")) v.play().catch(() => {}); }, off = () => v.pause();
    b.addEventListener("pointerenter", on); b.addEventListener("focus", on); b.addEventListener("pointerleave", off); b.addEventListener("blur", off); });
  if (!matchMedia("(hover:hover)").matches) $$(".volume video").forEach((v) => { if (!PB.classList.contains("reduit")) v.play().catch(() => {}); });
}

/* ---------- 5. Menu titre : pile de livres ---------- */
function sceneLib(id) { const s = S_()[id]; const ch = CHAP[CH_OF(id)] || D.chapters[0] || { label: "" }; return { ch, s, court: `${(ch.label || "").replace("Chapitre ", "Ch. ")} · ${s ? s.title : ""}` }; }
function aSauvegarde() { const s = ST(); if (!(s.scene && S_()[s.scene])) return false; try { const r = JSON.parse(localStorage.getItem("sylvinia_vn_v82") || "null"); return !!(r && r.scene); } catch { return true; } }
function versionJeu() { const m = /v\s?0?\.(\d{3,4})/i.exec(document.querySelector(".versionTag, #versionLabel, .versionBadge")?.textContent || ""); return m ? `v0.${m[1]}` : "v0.412"; }
let titreVu = false;
function ecranTitre() {
  fond("video", VID.titre, IMG("titre-poster.jpg")); particules(0);
  const L = sceneLib(ST().scene); const nbImg = [...IMG_OK()].filter((k) => D.images[k]).length, totImg = Object.keys(D.images).length; const unl = unlockedCh();
  const livres = [
    ["reprendre", "Reprendre", 'data-act="reprendre"', aSauvegarde() ? `<b>${esc(L.court.length > 26 ? L.court.slice(0, 25).trim() + "…" : L.court)}</b>` : ""],
    ["nouvelle", "Nouvelle chronique", 'data-act="nouvelle"', ""],
    ["chapitres", "Chapitres", 'data-go="#/chapitres" data-retour="#/titre"', `<i>${unl.length} / ${D.chapters.length}</i>`],
    ["signets", "Signets", 'data-go="#/signets" data-retour="#/titre"', `<i>${slots().filter((s) => s.scene).length} / 7</i>`],
    ["codex", "Codex &amp; mémoire", 'data-go="#/codex" data-retour="#/titre"', `<i>${nbImg} / ${totImg}</i>`],
    ["progression", "Progression", 'data-go="#/progression" data-retour="#/titre"', ""],
    ["ca", "Chronique Alternative", 'data-act="ca"', ""],
    ["reglages", "Réglages", 'data-go="#/reglages" data-retour="#/titre"', ""],
  ];
  const coul = ["#1b2a5c", "#5a1e2e", "#4a2e1c", "#16404f", "#15403a", "#5b2a1c", "#3a2160", "#2a3340"];
  const dec = [0, 18, -8, 10, -14, 6, -4, 14];
  const etat0 = titreVu || PB.classList.contains("reduit") ? "menu" : "press";
  const touch = matchMedia("(pointer: coarse)").matches;
  monter(`<section class="titre etat-${etat0}" data-titre-etat="${etat0}">
    <div class="titre-voile" aria-hidden="true"></div>
    <h1 class="logo titre-logo" aria-label="Les Chroniques de Sylvinia"><span class="logo-k">Visual Novel interactif · Tome I <b class="badge-beta">Bêta</b></span><span class="logo-les">Les</span><span class="logo-l1 or-texte">Chroniques</span><span class="logo-l2"><em>de</em> <span class="or-texte">Sylvinia</span></span></h1>
    <button type="button" class="titre-press" data-act="titre-demarrer" aria-label="Commencer"><span class="titre-press-txt">${touch ? "Touchez l’écran pour commencer" : "Appuyez pour commencer"}</span></button>
    <div class="titre-col">
      <nav class="pile" aria-label="Menu principal">
        ${livres.map((l, i) => `<button class="livre dos z-lbl ${i === 0 ? "actif" : ""} ${l[0] === "ca" ? "ca" : ""}" style="--dc:${coul[i]};--x:${dec[i]};--i:${i}" ${l[2]} data-i="${i}">
          <span class="tome">${l[0] === "ca" ? "✦" : ROM[i + 1]}</span><span class="etiq">${l[1]}</span>${l[3] ? `<span class="sup">${l[3]}</span>` : ""}</button>`).join("")}
      </nav>
    </div>
    <div class="titre-haut z-hud"><button class="rond ico ${musiqueOn() ? "" : "off"}" data-act="musique" aria-label="Musique">♪</button><button class="rond ico" data-act="plein-ecran" aria-label="Plein écran">⛶</button></div>
    <footer class="titre-bas"><span>${esc(versionJeu())} · Bêta · Le Chroniqueur Vagabond</span><span class="indices"><kbd>↑↓</kbd> Parcourir le rayon · <kbd>Entrée</kbd> Emprunter</span></footer>
  </section>`, "e-titre");
  const sec = $(".titre"); const pile = $(".pile");
  const sel = (i) => $$(".livre", pile).forEach((b, j) => b.classList.toggle("actif", j === i));
  $$(".livre", pile).forEach((b, i) => { b.addEventListener("pointerenter", () => sel(i)); b.addEventListener("focus", () => sel(i)); });
  const demarrer = () => {
    if (!sec || sec.dataset.titreEtat === "menu") return;
    titreVu = true; sec.dataset.titreEtat = "menu"; sec.classList.remove("etat-press"); sec.classList.add("etat-menu");
    setTimeout(() => $$(".livre", pile)[0]?.focus({ preventScroll: true }), 480);
  };
  actions["titre-demarrer"] = demarrer;
  if (etat0 === "press") {
    sec.addEventListener("click", (ev) => {
      if (sec.dataset.titreEtat === "menu") return;
      if (ev.target.closest(".titre-haut, .titre-press, a, button.rond")) return;
      demarrer();
    });
    const onKey = (ev) => {
      if (!sec.isConnected || sec.dataset.titreEtat === "menu") { window.removeEventListener("keydown", onKey); return; }
      if (ev.metaKey || ev.ctrlKey) return;
      if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(ev.key)) { ev.preventDefault(); demarrer(); window.removeEventListener("keydown", onKey); }
    };
    window.addEventListener("keydown", onKey);
  }
}
actions.reprendre = () => { if (!aSauvegarde()) return actions.nouvelle(); reprendre(); };
function reprendre(h) {
  const id = h && /^#\/jeu\/([^?]+)/.exec(h)?.[1]; const q = new URLSearchParams((h || "").split("?")[1] || "");
  if (id && S_()[id]) {
    if (id !== ST().scene) allerSceneMoteur(id);
    else if (PB.dataset.ecran !== "jeu") { moteurJeu(); H = "#/jeu"; route(); }
    else { moteurJeu(); majJeu(true); }
    // laisser majJeu construire J avant d’appliquer ?choix / ?p / ?ov
    setTimeout(() => apresJeu(q), 0);
    return;
  }
  const f = fn("resume"); if (f) { pilote = true; try { f(); } catch (e) { console.warn(e); } finally { pilote = false; } } else document.getElementById("resumeBtn")?.click();
  aller("#/jeu");
}
actions.nouvelle = () => confirmer("Nouvelle chronique", "Recommencer le Chapitre I depuis la première page ? Vos valeurs, choix et codex de l’aventure repartent de zéro ; vos signets restent rangés dans la bibliothèque.", "Commencer", () => {
  G.journal = []; sauver(); carteLancer = () => { const f = fn("newGame"); pilote = true; try { if (f) f({ confirm: false }); } finally { pilote = false; } }; aller("#/carte/ch1"); });

/* ---------- 6. Étagère des chapitres : on emprunte un livre ---------- */
function groupesDe(list, k) { return (list || []).filter((g) => parseChap(g.title) === k || (k === "ch10" && /^Chapitre X[-_ ]/.test(g.title))); }
function progChap(k) {
  const im = groupesDe(D.imageGroups, k).flatMap((g) => (g.sections || []).flatMap((x) => x.keys));
  const ek = groupesDe(D.entryGroups, k).flatMap((g) => g.keys); const IO = IMG_OK(), EO = ENT_OK();
  const ok = unlockedCh().includes(k), cur = CH_OF(ST().scene), iCur = D.chapters.findIndex((c) => c.key === cur), i = D.chapters.findIndex((c) => c.key === k);
  const flags = ST().flags || {}; const fini = flags[`chapter${i}Complete`] || (k === "intro" && flags.introComplete);
  const statut = !ok ? "Scellé" : (k === cur && aSauvegarde()) ? `En cours · ${esc(S_()[ST().scene]?.title || "")}` : (fini || i < iCur) ? "Lu" : "À lire";
  return { statut, img: [im.filter((x) => IO.has(x)).length, im.length], ent: [ek.filter((x) => EO.has(x)).length, ek.length], sig: G.signets.filter((x) => x.scene && CH_OF(x.scene) === k).length };
}
function ecranChapitres(_, q) {
  fond("biblio", IMG("bibliotheque.webp")); particules(22);
  const cur = aSauvegarde() ? CH_OF(ST().scene) : ""; const unl = unlockedCh();
  const dos = (c, i) => { const ok = unl.includes(c.key); const h = 250 + ((i * 37) % 5) * 14, w = 58 + ((i * 53) % 4) * 6;
    const num = c.key === "intro" ? "✦" : c.label.replace("Chapitre ", "");
    return `<button class="dos-v dos ${ok ? "" : "verrou"} ${c.key === cur ? "en-cours" : ""}" style="--dc:${DOS[i % DOS.length]};--h:${h};--w:${w};--i:${i}" data-ch="${c.key}" aria-label="${esc(c.label)} — ${esc(c.title)}${ok ? "" : " (scellé)"}">
      ${c.key === cur ? '<i class="dv-ruban" aria-hidden="true"></i>' : ""}<span class="dv-num">${esc(num)}${c.route ? `<small class="dv-route r-${c.route[0].toLowerCase()}">${c.route[0]}</small>` : ""}</span><span class="dv-titre">${esc(c.title)}</span><span class="dv-pied">${ok ? "❦" : '<i class="dv-sceau">🔒&#xFE0E;</i>'}</span></button>`; };
  const half = 10;
  monter(`<section class="chapitres">
    ${entete("Bibliothèque de Mir’Aldas", "Étagère des chapitres", retourVers, `<span class="compteur z-lbl"><b>${unl.length}</b> / ${D.chapters.length}<em>empruntables</em></span>`)}
    <div class="chap-corps">
      <div class="etagere" aria-label="Volumes">
        <div class="rayon"><i class="serre-livre g" aria-hidden="true"></i>${D.chapters.slice(0, half).map(dos).join("")}<i class="serre-livre d" aria-hidden="true"></i></div><div class="planche" aria-hidden="true"></div>
        <div class="rayon"><i class="serre-livre g" aria-hidden="true"></i>${D.chapters.slice(half).map((c, i) => dos(c, i + half)).join("")}<i class="bougie" aria-hidden="true"></i></div><div class="planche" aria-hidden="true"></div>
      </div>
      <p class="etagere-indice"><span>Touchez un volume pour l’emprunter</span><span class="leg"><i class="leg-ruban" aria-hidden="true"></i>signet en cours</span><span class="leg">🔒&#xFE0E; scellé</span></p>
    </div></section>`, "e-chapitres");
  $$(".dos-v").forEach((b) => b.addEventListener("click", () => { son("page"); ouvrirLivre(b.dataset.ch); }));
  if (q.get("livre") && CHAP[q.get("livre")]) ouvrirLivre(q.get("livre"), q.get("etat") || "anim");
}
let livreT = [];
function lockHint(k) { return { ch2: "Termine le Chapitre I pour ouvrir la route d’Al’Gratal.", ch3: "Termine le Chapitre II pour ouvrir les préparatifs.", ch4: "Termine le Chapitre III pour ouvrir la croisée des récits.", ch5: "Termine au moins une route du Chapitre IV pour ouvrir Mir’Aldas.", ch6: "Termine le Chapitre V pour ouvrir cette parenthèse.", ch7: "Termine le Chapitre VI pour ouvrir la route de Naïah." }[k] || "Ce volume se révélera à mesure que l’histoire avance."; }
function ouvrirLivre(k, etat = "anim") {
  const c = CHAP[k]; const ok = unlockedCh().includes(k); const P = progChap(k);
  const num = k === "intro" ? "✦" : c.label.replace("Chapitre ", ""); const dosEl = $(`.dos-v[data-ch="${k}"]`);
  const coul = dosEl ? dosEl.style.getPropertyValue("--dc") : "#3b1424";
  const reduit = PB.classList.contains("reduit");
  livreT.forEach(clearTimeout); livreT = [];
  const ligne = (t, v, pc) => `<div class="l3-l"><dt>${t}</dt><dd>${v}</dd>${pc != null ? `<span class="l3-barre"><em style="width:${pc}%"></em></span>` : ""}</div>`;
  const enCours = aSauvegarde() && k === CH_OF(ST().scene);
  const act = !ok ? "" : `<button class="btn-or" data-act="lire" data-ch="${k}"><span>${enCours ? "Reprendre la lecture" : "Lire"}</span></button>`;
  $("#couche").className = "ouverte livre-c"; $("#couche").innerHTML = `<div class="voile-c livre-voile" data-act="fermer-livre"></div>
    <div class="l3-scene"><div class="livre3d ${ok ? "" : "scelle"}" data-etat="dos" style="--dc:${coul}" role="dialog" aria-modal="true" aria-label="${esc(c.label)} — ${esc(c.title)}">
      <div class="l3-arr" aria-hidden="true"></div>
      <div class="l3-pages"><div class="l3-page">
        <p class="kicker">${esc(c.label)}${c.subtitle ? " · " + esc(c.subtitle) : ""}</p><h2 class="l3-titre">${esc(c.title)}</h2>
        <div class="tags">${(c.tags || []).map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
        <div class="l3-resume"><p><span class="lettrine">${esc(c.body.charAt(0))}</span>${esc(c.body.slice(1))}</p></div>
        <dl class="l3-prog">${ligne("Lecture", P.statut)}${ligne("Planches", `${P.img[0]} / ${P.img[1]}`, P.img[1] ? Math.round(P.img[0] / P.img[1] * 100) : 0)}${P.ent[1] ? ligne("Codex", `${P.ent[0]} / ${P.ent[1]}`, Math.round(P.ent[0] / P.ent[1] * 100)) : ""}${P.sig ? ligne("Signets", P.sig) : ""}</dl>
        <div class="l3-act">${act}</div></div></div>
      <div class="l3-couv" data-act="ouvrir-livre">
        <div class="l3-avant"><img src="${esc(c.img)}" alt=""><div class="l3-cadre" aria-hidden="true"></div>
          ${ok ? "" : '<div class="l3-sceau"><b>🔒&#xFE0E;</b><span>Volume scellé</span></div>'}
          <div class="l3-plaque"><span class="l3-num">${esc(num)}</span><span class="l3-lab">${esc(c.label)}${c.route ? " · route " + c.route : ""}</span><b class="l3-ct">${esc(c.title)}</b>${ok ? "" : `<small class="l3-msg">${esc(lockHint(k))}</small>`}</div></div>
        <div class="l3-arriere"><div class="l3-exlibris"><span>☾</span><small>Ex-libris</small><b>Bibliothèque de Mir’Aldas</b><em>Volume ${esc(num)}</em></div></div>
      </div>
      <div class="l3-dos"><span>${esc(num)}</span><b>${esc(c.title)}</b></div>
    </div></div>
    <button class="rond ico l3-fermer" data-act="fermer-livre" aria-label="Remettre le livre sur l’étagère">✕</button>`;
  const L = $(".livre3d");
  if (dosEl) dosEl.classList.add("emprunte");
  if (etat !== "anim" || reduit) { L.classList.add("sans-anim"); L.dataset.etat = etat === "anim" ? (ok ? "ouvert" : "couv") : (ok || etat === "couv" ? etat : "couv"); if (!reduit) { void L.offsetWidth; } return; }
  const r = dosEl ? dosEl.getBoundingClientRect() : null, sc = $(".l3-scene").getBoundingClientRect(), lr = L.getBoundingClientRect();
  if (r) { L.style.setProperty("--x0", `${r.left + r.width / 2 - (sc.left + sc.width / 2)}px`); L.style.setProperty("--y0", `${r.top + r.height / 2 - (sc.top + sc.height / 2)}px`); L.style.setProperty("--s0", (r.height / lr.height).toFixed(3)); }
  L.classList.add("sans-anim"); L.dataset.etat = "dos"; void L.offsetWidth; L.classList.remove("sans-anim");
  requestAnimationFrame(() => { L.dataset.etat = "couv"; });
  if (ok) livreT.push(setTimeout(() => { if (L.isConnected && L.dataset.etat === "couv") { L.dataset.etat = "ouvert"; son("page"); } }, 1900));
}
actions["ouvrir-livre"] = () => { const L = $(".livre3d"); if (L && !L.classList.contains("scelle") && L.dataset.etat !== "ouvert") { livreT.forEach(clearTimeout); L.classList.remove("sans-anim"); L.dataset.etat = "ouvert"; son("page"); } };
actions["fermer-livre"] = () => { livreT.forEach(clearTimeout); const c = $("#couche"); if (PB.classList.contains("reduit")) return fermerCouche(); c.classList.add("sort"); setTimeout(fermerCouche, 320); };
actions.lire = (b) => { const k = b.dataset.ch; const enCours = aSauvegarde() && k === CH_OF(ST().scene);
  carteLancer = enCours ? () => reprendre() : () => { const f = fn("launchChapterSelect"); pilote = true; try { if (f) f(k); } finally { pilote = false; } }; aller(`#/carte/${k}`); };

/* ---------- 7. Carte titre de chapitre (transition) ---------- */
let carteLancer = null, carteT;
const estIntimeChap = (k) => k === "ch6";
function ecranCarte([k], q) {
  const c = CHAP[k] || CHAP.ch1; fond("biblio", IMG("bibliotheque.webp")); particules(40);
  if (estIntimeChap(k)) PB.classList.add("intime");
  monter(`<section class="carte-chap" data-act="carte-go">
    <div class="cc-livre"><div class="cc-couv g" aria-hidden="true"></div><div class="cc-couv d" aria-hidden="true"></div>
      <div class="cc-page" data-orn><img class="cc-img" src="${esc(c.img)}" alt=""><div class="cc-txt"><span class="cc-num">${k === "intro" ? "✦" : esc(c.label.replace("Chapitre ", ""))}</span><p class="kicker">${esc(c.label)}</p><h1 class="cc-titre">${esc(c.title)}</h1><p class="cc-sous">${esc(c.subtitle || "")}</p></div></div></div>
    <p class="cc-indice">Toucher pour ouvrir</p></section>`, "e-carte");
  clearTimeout(carteT); if (!q.has("fige")) carteT = setTimeout(() => { if (PB.dataset.ecran === "carte") actions["carte-go"](); }, 4200);
}
actions["carte-go"] = () => { clearTimeout(carteT); const f = carteLancer; carteLancer = null; if (f) f(); else { reprendre(); return; } aller("#/jeu"); };

/* ---------- 8. Scène de jeu — rendue à partir du moteur ---------- */
let autoT, typeT, J = null;
function pagesDe(txt) {
  const paras = String(txt || "").split(/\n\s*\n/).map((t) => t.replace(/\s*\n\s*/g, " ").trim()).filter(Boolean);
  const out = []; let cur = "";
  const lim = (innerHeight < 620 || innerWidth < 560) ? 210 : 300;
  paras.forEach((p) => { if (cur && (cur + " " + p).length > lim) { out.push(cur); cur = p; } else cur = cur ? cur + "\n" + p : p; });
  if (cur) out.push(cur); return out.length ? out : [""];
}
const brut = (html) => String(html || "").replace(/<br\s*\/?>/gi, "\n").replace(/<\/(p|div|li|h\d)>/gi, "\n\n").replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;|&rsquo;/g, "’").replace(/\n{3,}/g, "\n\n").trim();
const estIntime = (id, s) => /^c6_/.test(id) || /^c13g_(soft|secret)_/.test(id) || /intim/i.test(String(s && s.music || ""));
// séquences du moteur sans équivalent dans le prototype (QTE chronométrés) : la scène du moteur reste affichée le temps de la séquence
function mondeLibreActif() {
  const r = document.getElementById("storyWorldRoot");
  const ouvert = !!(r && !r.hidden && (document.body.classList.contains("sw-open") || r.getClientRects().length > 0));
  // si le panneau est refermé, nettoyer le flag moteur pour ne pas bloquer majJeu
  if (!ouvert && document.body.classList.contains("sw-open")) document.body.classList.remove("sw-open");
  return ouvert;
}
function moteurPasse() {
  const b = document.body; if (!actif()) return false;
  if (mondeLibreActif()) return false; // géré à part via ba-monde
  const g = document.getElementById("game"); if (!g || g.classList.contains("hidden")) return false;
  // QTE réellement affiché (couche non vide) — ne pas se fier seul aux classes body qui peuvent rester collées
  const couche = document.querySelector("#stage [class*='QteLayer']:not(.hidden), #gameCard [class*='QteLayer']:not(.hidden)");
  if (couche && couche.childElementCount) return true;
  if (document.querySelector("#combatTransition.active")) return true;
  return false;
}
function syncCouches() {
  if (!actif()) { document.body.classList.remove("ba-passe", "ba-monde"); return; }
  const monde = mondeLibreActif();
  const passe = !monde && moteurPasse();
  document.body.classList.toggle("ba-monde", monde);
  document.body.classList.toggle("ba-passe", passe);
  if (!passe && (document.body.classList.contains("x12iQteMode") || document.body.classList.contains("x12iQteModeV250")) && !syncCouches._cleanQte) {
    // classes QTE orphelines (plus de couche) : retirer sans relancer l’observateur en boucle
    syncCouches._cleanQte = true;
    try {
      document.body.classList.remove("x12iQteMode", "x12iQteModeV250");
      document.getElementById("gameCard")?.classList.remove("x12iQteMode", "x12iQteModeV250");
    } finally { queueMicrotask(() => { syncCouches._cleanQte = false; }); }
  }
  if (!monde && !passe && PB.dataset.ecran === "jeu") planifierMaj();
}
// Le moteur (typewriter « trailer ») vide puis réécrit #text caractère par caractère : relire son DOM en
// cours de frappe donne un fragment (« Naïah tourne autour d ») et relance notre propre frappe en boucle.
// On mémorise donc le dernier texte complet posé par le moteur via innerHTML / textContent.
const TXT = { html: "" };
function hookTexte() {
  const el = document.getElementById("text"); if (!el || el.__baHook) return; el.__baHook = true;
  const dH = Object.getOwnPropertyDescriptor(Element.prototype, "innerHTML"), dT = Object.getOwnPropertyDescriptor(Node.prototype, "textContent");
  try {
    Object.defineProperty(el, "innerHTML", { configurable: true, get() { return dH.get.call(this); }, set(v) { const t = String(v ?? ""); if (t.trim()) TXT.html = t; dH.set.call(this, v); } });
    Object.defineProperty(el, "textContent", { configurable: true, get() { return dT.get.call(this); }, set(v) { const t = String(v ?? ""); if (t.trim()) TXT.html = esc(t).replace(/\n/g, "<br>"); dT.set.call(this, v); } });
  } catch {}
  const t0 = dH.get.call(el); if (t0.trim()) TXT.html = t0;
}
const normTxt = (x) => String(x || "").replace(/\s+/g, " ").trim();
function texteCombat() {
  hookTexte();
  const cur = brut(document.getElementById("text")?.innerHTML || ""), src = brut(TXT.html || "");
  const nc = normTxt(cur), ns = normTxt(src);
  // frappe en cours : le DOM est un préfixe non vide du texte complet → on affiche le texte complet
  if (ns && nc && ns.startsWith(nc) && nc.length < ns.length) return src;
  if (ns && !nc) return src; // typewriter a vidé la boîte le temps d’un tick
  // changement de scène : le DOM a déjà le nouveau texte (plus long / différent)
  if (nc && (!ns || !ns.startsWith(nc))) { TXT.html = document.getElementById("text")?.innerHTML || ""; return cur; }
  return cur || src;
}
// chronomètre de duel actif (Temps / Réflexe) : le texte doit être lisible tout de suite
const chronoActif = (hud) => /id="[^"]*Timer"[^>]*>\s*\d+([.,]\d+)?\s*s/i.test(hud || "");
function lireMoteur() {
  const s0 = ST(); const id = s0.scene; const s = S_()[id] || {};
  const stage = document.getElementById("stage"), bgEl = document.getElementById("bg");
  const bgm = /url\(["']?([^"')]+)["']?\)/.exec(bgEl ? (bgEl.style.backgroundImage || "") : "");
  const vid = stage && [...stage.querySelectorAll("video")].find((v) => (v.currentSrc || v.getAttribute("src") || v.querySelector("source")) && !v.closest(".hidden") && v.style.display !== "none" && v.getAttribute("aria-hidden") !== "true" && v.offsetWidth > 0);
  const chars = [...document.querySelectorAll("#chars img")].filter((im) => im.getAttribute("src") && im.style.display !== "none").map((im) => ({ src: im.getAttribute("src"), cls: [...im.classList].filter((c) => !["char", "enter"].includes(c)).join(" ") }));
  const combat = !!(stage && stage.classList.contains("combatMode"));
  const speaker = (document.getElementById("speaker")?.textContent || s.speaker || "Narrateur").trim();
  let text;
  if (combat) text = texteCombat();
  else { try { text = typeof s.text === "function" ? s.text() : s.text; } catch { text = ""; } text = brut(text || ""); if (!text) text = brut(document.getElementById("text")?.innerHTML || ""); if (s.direction) text = s.direction + "\n\n" + text; }
  const labelBouton = (b) => {
    const root = b.querySelector("span:not(.arrow)") || b;
    const clone = root.cloneNode(true);
    clone.querySelectorAll("small, .arrow, .devReward").forEach((el) => el.remove());
    return brut(clone.textContent || "").replace(/^🔒\s*/, "").replace(/›\s*$/, "").trim();
  };
  const btns = [...document.querySelectorAll("#choices button")].filter((b) => b.style.display !== "none" && !b.hidden && !b.closest(".hidden"));
  const cont = btns.length === 1 && btns[0].classList.contains("continueBtn") ? btns[0] : null;
  const choix = cont ? [] : btns.map((b, i) => {
    const lab = labelBouton(b);
    const nettoie = (x) => brut(x || "").replace(/\s+/g, " ").trim();
    const labN = lab.replace(/\s+/g, " ");
    // Ne pas matcher par index en combat : les boutons viennent de DUEL_STEPS, pas de scene.choices
    const liste = s.choices || [];
    const ch = liste.find((c) => c && c.label && nettoie(c.label) === labN)
      || liste.find((c) => c && c.label && labN && labN.startsWith(nettoie(c.label).slice(0, 24)))
      || (!combat && liste.length === btns.length ? liste[i] : null);
    let eff = {};
    try { if (ch) { const f = fn("choiceValueEffects"); eff = f ? f(ch) : (ch.effects || {}); } }
    catch { eff = (ch && ch.effects) || {}; }
    // gemmes duel : effects numériques hors START_STATS sur le bouton (hint) — laisser vide si inconnu
    const smalls = [...b.querySelectorAll("small:not(.devReward)")].map((x) => x.textContent.trim()).filter(Boolean);
    const note = (ch && typeof ch.note === "string" && ch.note) || (!combat ? smalls.join(" · ") : (smalls[0] || ""));
    const label = lab || (ch && ch.label) || "";
    return { b, ch, label, note, eff: eff || {}, verrou: b.disabled || b.classList.contains("lockedChoice") || b.classList.contains("locked"), req: ch && ch.requires };
  });
  const hud = combat ? (document.getElementById("stats")?.innerHTML || "") : "";
  return { id, s, bg: bgm ? bgm[1] : (A_()[s.bg] || ""), zoom: !!(bgEl && bgEl.classList.contains("zoom")), video: vid ? (vid.currentSrc || vid.getAttribute("src") || vid.querySelector("source")?.getAttribute("src") || "") : "", chars, speaker, text, choix, cont, combat, hud,
    title: document.getElementById("sceneTitle")?.textContent || s.title || "", sub: document.getElementById("sceneSub")?.textContent || s.sub || "" };
}
function ecranJeu(_, q) {
  if (!ST().scene || !S_()[ST().scene]) { aller("#/titre", { direct: true }); return; }
  J = null; $("#ecran").innerHTML = ""; majJeu(true);
  apresJeu(q);
}
let majT = 0;
function planifierMaj() { if (!actif()) return; clearTimeout(majT); majT = setTimeout(() => { if (PB.dataset.ecran === "jeu") majJeu(); }, 30); }
function majJeu(force) {
  syncCouches(); if (document.body.classList.contains("ba-monde") || document.body.classList.contains("ba-passe")) return;
  const g = document.getElementById("game"); if (g && g.classList.contains("hidden") && !force) return;
  const M = lireMoteur(); const s = M.s; const ch = CHAP[CH_OF(M.id)] || D.chapters[0] || { label: "", title: "" };
  // clé de remontage : ni la jauge/chrono du HUD, ni les chiffres du texte (décompte) ne relancent la page
  const cle = M.id + "|" + (M.combat ? normTxt(M.text).replace(/\d+([.,]\d+)?\s*s?\b/g, "#").length : M.text.length) + "|" + M.choix.map((c) => c.label + (c.verrou ? "!" : "")).join("/") + "|" + (M.cont ? 1 : 0) + "|" + (M.combat ? 1 : 0);
  const intime = estIntime(M.id, s); PB.classList.toggle("intime", intime);
  if (J && J.cle === cle && !force && $(".jeu")) {
    J.M = M; // boutons du moteur frais (le moteur peut re-rendre #choices sans changer les libellés)
    const hudEl = $(".combat-hud"); if (hudEl && hudEl.innerHTML !== M.hud) { hudEl.hidden = !M.hud; hudEl.innerHTML = M.hud; }
    if (M.combat && J.plein && J.pages.join("\n") !== M.text) { J.pages = [M.text]; const el = $(".dlg-texte"); if (el) el.innerHTML = M.text.split("\n").map((l) => `<span class="para">${esc(l)}</span>`).join(""); }
    majSprites(M.chars, M.speaker); majDevScene(); return;
  }
  const memeFond = J && $(".jeu") && J.M.bg === M.bg && J.M.video === M.video;
  // combat : une seule page défilante (pas de pagination qui coupe la consigne d’un tour chronométré)
  const pages = M.combat ? [M.text] : pagesDe(M.text);
  const prev = J; J = { id: M.id, M, s, pages, p: 0, plein: false, auto: prev ? prev.auto : false, cle, chrono: M.combat && chronoActif(M.hud) };
  if (!memeFond) {
    fond(); particules(intime ? 34 : 18);
    monter(`<section class="jeu ${M.zoom ? "zoom" : ""} ${M.combat ? "combat" : ""}">
    <div class="jeu-bg" style="background-image:url('${esc(M.bg)}')">${M.video ? `<video class="jeu-video" src="${esc(M.video)}" muted loop playsinline autoplay></video>` : ""}</div><div class="jeu-voile"></div>
    <div class="sprites"></div>
    <header class="jeu-lieu z-hud"><button class="btn-ui ico" data-act="ui" title="Interface (H)" aria-label="Changer l’interface (touche H)"><i aria-hidden="true"></i></button><span class="cote z-lbl">${esc(ch.key === "intro" ? "✦" : (ch.label || "").replace("Chapitre ", ""))}</span><div class="jl-t"><small>${esc(ch.label)} · ${esc(ch.title)}</small><b></b></div></header>
    <nav class="jeu-hud z-hud" aria-label="Menu de jeu">
      <button class="dos-o dos ico" style="--dc:#5a1e2e;--h:118" data-act="ov" data-ov="journal" aria-label="Journal"><i>❦</i><span>Journal</span></button>
      <button class="dos-o dos ico" style="--dc:#1b2a5c;--h:132" data-act="ov" data-ov="signets" aria-label="Signets"><i>⚑</i><span>Signets</span></button>
      <button class="dos-o dos ico" style="--dc:#15403a;--h:112" data-go="#/codex" data-retour="#/jeu" aria-label="Codex"><i>✦</i><span>Codex</span></button>
      <button class="dos-o dos ico" style="--dc:#2a3340;--h:124" data-act="ov" data-ov="menu" aria-label="Menu"><i>☰</i><span>Menu</span></button>
    </nav>
    <div class="combat-hud verre z-pan" hidden></div>
    <div class="dlg-zone">
      <div class="choix z-pan" hidden></div>
      <div class="plaque-nom z-lbl"><span class="nom"></span><span class="didasc"></span></div>
      <article class="dlg verre z-pan" data-orn>
        <div class="dlg-dos dos" style="--dc:#22306a" aria-hidden="true"><span class="dlg-cote"></span></div>
        <div class="dlg-corps"><p class="dlg-texte" aria-live="polite"></p><span class="dlg-suite" aria-hidden="true">▼</span></div>
        <footer class="dlg-outils z-pan">
          <span class="folio"></span>
          <span class="outils"><button class="outil ico" data-act="retour-page">↶<em>Retour</em></button><button class="outil ico ${J.auto ? "on" : ""}" data-act="auto">⟳<em>Auto</em></button><button class="outil ico" data-act="passer">»<em>Passer</em></button><button class="outil ico" data-act="ov" data-ov="journal">❦<em>Journal</em></button></span>
        </footer>
        <div class="prog"><em></em></div>
      </article>
    </div>
  </section>`, "e-jeu");
    orner($("#ecran")); appliquerUI();
    $(".jeu").addEventListener("click", (ev) => { if (ev.target.closest("button, .choix, a, .combat-hud")) return; avancer(); });
    const v = $(".jeu-video"); if (v) { v.muted = true; v.play().catch(() => {}); }
  }
  const hudEl = $(".combat-hud"); if (hudEl) { hudEl.hidden = !M.hud; hudEl.innerHTML = M.hud; }
  $(".jeu")?.classList.toggle("combat", M.combat);
  majSprites(M.chars, M.speaker); majLieu(); afficherPage(!!J.chrono);
  jouerMusique(pisteEcran());
}
function majLieu() {
  const M = J.M; const b = $(".jl-t b"); if (b) b.textContent = `${M.title}${M.sub ? " — " + M.sub : ""}`;
  majDevScene();
}
function majDevScene() {
  let badge = $(".ba-dev-scene");
  const on = !!(ST().devMode && J && (J.id || ST().scene));
  const id = on ? (J.id || ST().scene || "") : "";
  if (!on) { if (badge) badge.hidden = true; return; }
  if (!badge) {
    const host = $(".jeu") || $("#ecran"); if (!host) return;
    badge = document.createElement("button");
    badge.type = "button"; badge.className = "ba-dev-scene"; badge.title = "Cliquer pour copier le code de scène";
    badge.setAttribute("aria-label", "Code de scène développeur");
    badge.addEventListener("click", (ev) => { ev.stopPropagation(); actions["dev-copier"]?.(); });
    host.appendChild(badge);
  }
  badge.hidden = false;
  badge.dataset.sceneCode = id;
  badge.innerHTML = `DEV · <b>${esc(id)}</b>`;
}
function majSprites(chars, parleur) {
  const box = $(".sprites"); if (!box) return;
  const html = chars.map((c) => `<img class="sprite ${esc(c.cls)}" src="${esc(c.src)}" alt="">`).join("");
  if (box.dataset.h !== html) { box.innerHTML = html; box.dataset.h = html; }
  const parle = String(parleur || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(/[\s·,]+/)[0];
  $$(".sprite", box).forEach((im) => im.classList.toggle("parle", !!parle && im.classList.contains(parle)));
}
function afficherPage(direct) {
  clearInterval(typeT); clearTimeout(autoT);
  if (!J || !$(".dlg")) return;
  const { M, pages, p } = J; const txt = pages[p];
  const narr = !M.speaker || /^Narrat/i.test(M.speaker);
  $(".plaque-nom").classList.toggle("narr", narr);
  $(".plaque-nom .nom").textContent = narr ? "Narration" : M.speaker;
  $(".plaque-nom .didasc").textContent = M.sub || "";
  const ch = CHAP[CH_OF(J.id)] || { label: "" };
  $(".dlg-cote").textContent = `${(ch.key === "intro" ? "✦" : (ch.label || "").replace("Chapitre ", ""))} · ${J.id.replace(/^c\d+[a-z]?_/, "").replace(/^intro_/, "").replace(/_/g, " ")}`;
  $(".folio").textContent = `— ${p + 1} / ${pages.length} —`;
  $(".dlg").classList.toggle("narration", narr);
  $(".prog em").style.width = `${((p + 1) / pages.length) * 100}%`;
  $(".choix").hidden = true; $(".choix").innerHTML = "";
  const el = $(".dlg-texte"); const lignes = txt.split("\n");
  const html = lignes.map((l) => `<span class="para">${esc(l)}</span>`).join("");
  const last = G.journal[G.journal.length - 1];
  if (!last || last.id !== J.id || last.p !== p) { G.journal.push({ id: J.id, p, sp: narr ? "Narration" : M.speaker, t: txt }); if (G.journal.length > 160) G.journal.shift(); sauver(); }
  const fini = () => { J.plein = true; el.innerHTML = html; $(".dlg").classList.add("plein"); if (p === pages.length - 1 && J.M.choix.length) montrerChoix(); else if (J.auto) autoT = setTimeout(avancer, G.reg.auto * 1000); };
  $(".dlg").classList.remove("plein"); J.plein = false;
  if (direct || PB.classList.contains("reduit") || G.reg.vitesse >= 100) return fini();
  const total = txt.length; let n = 0; const cps = 18 + G.reg.vitesse * 1.4;
  el.innerHTML = html; const spans = $$(".para", el);
  spans.forEach((sp) => (sp.textContent = ""));
  typeT = setInterval(() => { n += Math.max(1, Math.round(cps / 30)); let reste = n;
    spans.forEach((sp, i) => { const L = lignes[i].length; sp.textContent = lignes[i].slice(0, Math.max(0, Math.min(L, reste))); reste -= L; });
    if (n >= total) { clearInterval(typeT); fini(); } }, 33);
}
// déclenche l’action exacte portée par le bouton du moteur (gestionnaire posé par le moteur et ses correctifs)
function declencher(b) {
  if (!b) return false;
  try {
    const ev = new MouseEvent("click", { bubbles: true, cancelable: true, view: window });
    if (typeof b.onclick === "function") { b.onclick.call(b, ev); return true; }
    b.dispatchEvent(ev);
    if (!ev.defaultPrevented) b.click();
    return true;
  } catch (e) { console.warn("[biblio] action moteur", e); return false; }
}
function avancer() {
  if (!J) return; if (!J.plein) { clearInterval(typeT); afficherPage(true); return; }
  if (J.p < J.pages.length - 1) { J.p++; son("page"); afficherPage(); return; }
  if (J.M.choix.length) return;
  suivante();
}
function suivante() {
  const M = lireMoteur();
  if (M.cont) { declencher(M.cont); planifierMaj(); return; }
  if (M.choix.length) { majJeu(true); return; }
  const nx = M.s.next; if (nx && fn("go")) { fn("go")(nx); planifierMaj(); return; }
  ouvrirCouche("fin");
}
function apresJeu(q) { if (!J) return; if (q.has("choix")) { J.p = J.pages.length - 1; afficherPage(true); } else if (q.has("p")) { J.p = Math.min(+q.get("p"), J.pages.length - 1); afficherPage(true); } if (q.get("ov")) ouvrirCouche(q.get("ov"), q); }
function allerSceneMoteur(id) { const s = ST(); if (!S_()[id]) return; if (!Array.isArray(s.history)) s.history = []; if (s.scene && s.scene !== id) s.history.push(s.scene); s.scene = id; moteurJeu(); fn("save")?.(); if (PB.dataset.ecran !== "jeu") { H = "#/jeu"; route(); } else majJeu(true); }
function montrerChoix() {
  const box = $(".choix"); const coul = ["#5a1e2e", "#1b2a5c", "#4a2e1c", "#3a2160", "#15403a"];
  const intime = PB.classList.contains("intime");
  box.innerHTML = `<p class="question z-lbl"><i aria-hidden="true">${intime ? "♥" : "◆"}</i> ${intime ? "La réponse d’Hylee" : (J.M.combat ? "La riposte d’Hylee" : "Le choix d’Hylee")}</p>` +
    J.M.choix.map((c, i) => { const m = c.verrou; const strat = /^Choix stratégique/i.test(brut(c.label)); const lab = brut(c.label).replace(/^Choix stratégique\s*:\s*/i, "");
      const gems = Object.entries(c.eff || {}).filter(([, v]) => v).map(([k, v]) => { const V = VLAB[k] || [k, k, k.slice(0, 2).toUpperCase()]; return `<span class="gem z-lbl" style="--v:var(--v-${k},var(--or))" title="${V[1]} ${v > 0 ? "+" : ""}${v}"><span class="gl">${V[1]}</span><span class="gc">${V[2]}</span> ${v > 0 ? "+" : ""}${v}</span>`; }).join("");
      const req = m && c.req ? Object.entries(c.req).map(([k, v]) => `${(VLAB[k] || [k, k, k])[2]} ${v}`).join(" · ") : "";
      const note = brut(c.note || "").replace(/^Requis\s*:[^·]*·?\s*/i, "").replace(/^[A-ZÉa-zé\-]+ · /, "");
      return `<button class="ch dos ${i === 0 ? "actif" : ""} ${m ? "verrou" : ""} ${strat ? "strat" : ""}" style="--dc:${coul[i % coul.length]};--r:${[30, 0, 56, 14, 40][i % 5]}" data-i="${i}" ${m ? 'aria-disabled="true"' : ""}>
        <span class="n">${ROM[i + 1] || i + 1}</span><span class="ch-t"><strong>${strat ? '<small class="strat-l">★ Choix stratégique</small>' : ""}${esc(lab)}</strong>${note ? `<em>${esc(note)}</em>` : ""}</span>
        <span class="g">${m ? `<span class="req">🔒&#xFE0E; ${esc(req || "verrouillé")}</span>` : G.reg.facile ? gems : ""}</span></button>`; }).join("");
  box.hidden = false;
  const sel = (i) => $$(".ch", box).forEach((b, j) => b.classList.toggle("actif", j === i));
  $$(".ch", box).forEach((b, i) => { b.addEventListener("pointerenter", () => sel(i)); b.addEventListener("focus", () => sel(i));
    b.addEventListener("click", () => { const c = J.M.choix[i]; if (b.classList.contains("verrou")) { toast(c.req ? "Ce choix demande davantage de " + Object.keys(c.req).map((k) => (VLAB[k] || [k, k])[1]).join(", ") + "." : "Ce choix n’est pas encore accessible."); return; } choisir(c); }); });
}
function choisir(c) {
  son("choix"); const eff = Object.entries(c.eff || {}).filter(([, v]) => v);
  G.journal.push({ id: J.id, choix: brut(c.label), eff: c.eff || {} }); sauver();
  if (eff.length) toast(eff.map(([k, v]) => `<span class="gem" style="--v:var(--v-${k},var(--or))">${VLAB[k] ? VLAB[k][1] : k} ${v > 0 ? "+" : ""}${v}</span>`).join(" "), "gemmes");
  const next = c.ch && c.ch.next;
  const versMenu = next === "menu";
  const storyTarget = next && String(next).startsWith("story_world_");
  if (!storyTarget && window.SylviniaStoryWorld) { try { window.SylviniaStoryWorld.close(); } catch {} document.body.classList.remove("sw-open", "ba-monde"); }
  let ok = declencher(c.b);
  if (!ok && c.ch && fn("choose")) { try { fn("choose")(c.ch); ok = true; } catch (e) { console.warn("[biblio] choose", e); } }
  if (!ok && next && fn("go")) { try { fn("go")(next); ok = true; } catch (e) { console.warn("[biblio] go", e); } }
  if (versMenu) setTimeout(() => { if (!document.body.classList.contains("ba-monde")) ouvrirCouche("fin"); }, 480);
  // laisser openPeriod / QTE poser sw-open ou ba-passe avant de rafraîchir
  setTimeout(() => { syncCouches(); if (!document.body.classList.contains("ba-monde") && !document.body.classList.contains("ba-passe")) planifierMaj(); }, storyTarget ? 80 : 40);
}
actions["retour-page"] = () => { if (!J) return; if (J.p > 0) { J.p--; afficherPage(true); return; }
  const s = ST(); const prev = Array.isArray(s.history) ? s.history.pop() : null; if (!prev || !S_()[prev]) { toast("Début du récit"); return; }
  s.scene = prev; moteurJeu(); fn("save")?.(); majJeu(true); if (J) { J.p = J.pages.length - 1; afficherPage(true); } };
actions.auto = () => { if (!J) return; J.auto = !J.auto; $$('[data-act="auto"]').forEach((x) => x.classList.toggle("on", J.auto)); toast(J.auto ? "⟳ Lecture automatique" : "⟳ Lecture manuelle"); if (J.auto && J.plein) avancer(); };
actions.passer = () => { if (!J) return; let k = 0;
  while (k++ < 40) { const M = lireMoteur(); if (M.choix.length || !M.cont || moteurPasse()) break; declencher(M.cont); }
  majJeu(true); if (J) { J.p = J.pages.length - 1; afficherPage(true); } };
actions.ov = (b) => ouvrirCouche(b.dataset.ov);
actions.ui = () => changerUI();
actions["ui-set"] = (b) => changerUI(b.dataset.ui);
// Clavier : capturé avant les raccourcis de l’interface classique (qui piloteraient l’écran masqué)
window.addEventListener("keydown", (e) => {
  if (!actif() || document.body.classList.contains("ba-passe")) return;
  const stop = () => { e.preventDefault(); e.stopImmediatePropagation(); };
  const cible = e.composedPath ? e.composedPath()[0] : e.target;
  if (cible && /^(INPUT|SELECT|TEXTAREA)$/.test(cible.tagName) && R.contains(cible)) {
    // saisie dans l’interface (outils DEV) : laisser taper, ne pas déclencher les raccourcis du moteur
    if (e.key === "Enter") { e.preventDefault(); if (cible.id === "baDevScene") actions["dev-aller"](); else if (cible.id === "baDevVal") actions["dev-val"](); }
    e.stopImmediatePropagation(); return;
  }
  if ((e.key === "h" || e.key === "H") && !e.ctrlKey && !e.metaKey && !e.altKey) { if (PB.dataset.ecran === "jeu") changerUI(); stop(); return; }
  if ($("#couche").childElementCount) { if (e.key === "Escape") fermerCouche(); if (["Escape", " ", "Enter"].includes(e.key)) stop(); return; }
  const ec = PB.dataset.ecran;
  if (ec === "jeu") { if (e.key === " " || e.key === "Enter") { const a = $(".choix:not([hidden]) .ch.actif"); if (a) a.click(); else avancer(); stop(); }
    else if (e.key === "Escape") { ouvrirCouche("menu"); stop(); } else if (/^Arrow(Up|Down)$/.test(e.key)) { navListe(".choix .ch", e.key === "ArrowDown" ? 1 : -1); stop(); }
    else if (/^Arrow(Left|Right)$/.test(e.key) || e.key === "Backspace") stop(); }
  else if (ec === "titre") { if (/^Arrow(Up|Down)$/.test(e.key)) { navListe(".pile .livre", e.key === "ArrowDown" ? 1 : -1); stop(); } else if (e.key === "Enter") { $(".pile .livre.actif")?.click(); stop(); } }
  else if (ec === "ouverture" && (e.key === "Enter" || e.key === " ")) { actions.ouvrir(); stop(); }
  else if (ec === "intro") { actions["passer-intro"](); stop(); }
  else if (ec === "carte" && ["Enter", " "].includes(e.key)) { actions["carte-go"](); stop(); }
  else if (e.key === "Escape" && $(".entete .retour")) { $(".entete .retour").click(); stop(); }
  else if (["Enter", " ", "Escape"].includes(e.key)) stop();
}, true);
function navListe(sel, d) { const L = $$(sel); if (!L.length) return; let i = L.findIndex((b) => b.classList.contains("actif")); i = (i + d + L.length) % L.length; L.forEach((b, j) => b.classList.toggle("actif", j === i)); L[i].focus({ preventScroll: true }); }

/* ---------- Couches (fenêtres) ---------- */
function fermerCouche() { $("#couche").innerHTML = ""; $("#couche").className = ""; $$(".dos-v.emprunte").forEach((d) => d.classList.remove("emprunte")); }
function fenetre(titre, kicker, corps, cls = "") {
  $("#couche").className = "ouverte"; $("#couche").innerHTML = `<div class="voile-c" data-act="fermer"></div>
    <section class="fen verre z-pan ${cls}" role="dialog" aria-modal="true" aria-label="${esc(titre)}" data-orn>
      <header class="fen-tete z-hud"><div><p class="kicker">${kicker}</p><h2 class="fen-titre">${titre}</h2></div><button class="rond ico fermer" data-act="fermer" aria-label="Fermer">✕</button></header>
      <div class="fen-corps">${corps}</div></section>`;
  orner($("#couche"));
}
function confirmer(t, msg, ok, f) { fenetre(t, "Confirmation", `<p class="conf-msg">${msg}</p><div class="conf-act"><button class="btn" data-act="fermer"><span>Annuler</span></button><button class="btn-or" id="confOk"><span>${ok}</span></button></div>`, "petite");
  $("#confOk").onclick = () => { fermerCouche(); f(); }; }
function ouvrirCouche(type, q) {
  if (type === "journal") {
    const h = G.journal.slice(-60);
    fenetre("Journal de lecture", "Marge du livre · " + h.filter((e) => !e.choix).length + " pages", `<ol class="journal">${h.map((e) => e.choix
      ? `<li class="j-choix"><span class="j-marge">choix</span><div><b>« ${esc(e.choix.replace(/^Choix stratégique\s*:\s*/i, ""))} »</b><span class="j-gems">${Object.entries(e.eff || {}).filter(([, v]) => v).map(([k, v]) => `<span class="gem" style="--v:var(--v-${k},var(--or))">${VLAB[k] ? VLAB[k][2] : k} ${v > 0 ? "+" : ""}${v}</span>`).join("")}</span></div></li>`
      : `<li><span class="j-marge">${esc(((CHAP[CH_OF(e.id)] || {}).label || "").replace("Chapitre ", "").replace("Introduction", "✦"))}·${e.p + 1}</span><div><b class="j-sp">${esc(e.sp)}</b><p>${esc(e.t).replace(/\n/g, "<br>")}</p><button class="lien-or" data-act="relire" data-id="${esc(e.id)}" data-p="${e.p}">Relire d’ici</button></div></li>`).join("") || "<li class='vide'>Aucune page lue pour l’instant.</li>"}</ol>`, "large journal-fen");
    const ol = $(".fen-corps"); ol.scrollTop = ol.scrollHeight;
  } else if (type === "menu") {
    const it = [["Reprendre", "fermer", "", "#1b2a5c"], ["Signets", "ov", 'data-ov="signets"', "#16404f"], ["Journal", "ov", 'data-ov="journal"', "#5a1e2e"], ["Chapitres", "", 'data-go="#/chapitres" data-retour="#/jeu"', "#4a2e1c"],
      ["Codex", "", 'data-go="#/codex" data-retour="#/jeu"', "#15403a"], ["Progression", "", 'data-go="#/progression" data-retour="#/jeu"', "#5b2a1c"], ["Réglages", "", 'data-go="#/reglages" data-retour="#/jeu"', "#2a3340"],
      [musiqueOn() ? "Couper la musique" : "Musique", "musique", "", "#3a2160"], ["Plein écran", "plein-ecran", "", "#24335e"], ["Écran titre", "", 'data-go="#/titre"', "#4a1f45"]];
    if (ST().devMode) it.splice(7, 0, ["Outils DEV", "", 'data-go="#/reglages/systeme" data-retour="#/jeu"', "#16404f"]);
    fenetre("Menu", `${esc(sceneLib(ST().scene).court)} · page ${(J ? J.p : 0) + 1}`, `<nav class="menu-pile">${it.map((m, i) => `<button class="livre dos z-lbl ${i === 0 ? "actif" : ""}" style="--dc:${m[3]};--x:${[0, 10, -6, 14, -10, 6, -2, 12, -8, 4, -4][i] ?? 0}" ${m[1] ? `data-act="${m[1]}"` : ""} ${m[2]}><span class="tome">${ROM[i + 1]}</span><span class="etiq">${m[0]}</span></button>`).join("")}</nav>`, "menu-fen");
    const L = $$(".menu-pile .livre"); L.forEach((b, i) => b.addEventListener("pointerenter", () => L.forEach((x, j) => x.classList.toggle("actif", i === j))));
  } else if (type === "signets") {
    fenetre("Signets", "Ranger ou reprendre un emprunt", htmlSignets(PB.dataset.ecran === "jeu"), "large");
  } else if (type === "fin") {
    const ch = CHAP[CH_OF(ST().scene)] || { label: "", title: "" }; const s = ST().stats || {};
    fenetre("Fin du chapitre", `${esc(ch.label)} · ${esc(ch.title)}`, `<div class="fin-txt"><span class="fin-cul" aria-hidden="true">❦</span><p>Le volume se referme ici. Vos choix ont été inscrits au registre ; le récit se poursuit dans le volume suivant de la bibliothèque.</p>
      <div class="fin-stats">${VALS.map(([k, l]) => `<span class="gem" style="--v:var(--v-${k})">${l} ${s[k] || 0}</span>`).join("")}</div></div>
      <div class="conf-act"><button class="btn" data-go="#/progression" data-retour="#/titre"><span>Voir le registre</span></button><button class="btn" data-go="#/chapitres" data-retour="#/titre"><span>Autres volumes</span></button><button class="btn-or" data-go="#/titre"><span>Écran titre</span></button></div>`, "petite");
  } else if (type === "nemesis") { carnetNemesis(q && q.get ? q.get("f") : null); }
  else if (type === "lightbox") { lightbox(q.get("img")); }
}
actions.relire = (b) => { fermerCouche(); const id = b.dataset.id, p = +b.dataset.p; allerSceneMoteur(id); if (J && J.id === id) { J.p = Math.min(p, J.pages.length - 1); afficherPage(true); } };

/* ---------- Signets : instantanés complets de l’état du moteur ---------- */
const fmtDate = (t) => new Date(t).toLocaleString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
let autoDate = Date.now();
function slots() { const out = [0, 1, 2, 3, 4, 5, 6].map((i) => G.signets.find((s) => s.slot === i) || { slot: i });
  if (aSauvegarde()) out[0] = { slot: 0, scene: ST().scene, page: J && J.id === ST().scene ? J.p : 0, date: autoDate, auto: true }; else out[0] = { slot: 0 }; return out; }
function htmlSignets(peutRanger) {
  return `<div class="signets">${slots().map((sg, i) => { const s = sg.scene && S_()[sg.scene]; const coul = DOS[(i + 3) % DOS.length];
    if (!s) return `<article class="signet vide" style="--dc:${coul}"><span class="ruban" aria-hidden="true"></span><div class="sg-vide"><b>${i === 0 ? "Signet automatique" : "Emplacement " + ROM[i]}</b><span>Emplacement libre</span></div>
      ${peutRanger && i ? `<button class="btn petit" data-act="ranger" data-slot="${i}"><span>Ranger ici</span></button>` : ""}</article>`;
    const ch = CHAP[CH_OF(sg.scene)] || { label: "" }; const bg = A_()[s.bg] || "";
    return `<article class="signet ${sg.auto ? "auto" : ""}" style="--dc:${coul}"><span class="ruban" aria-hidden="true"></span>
      <div class="sg-vign" style="background-image:url('${esc(bg)}')"><span class="sg-cote">${esc(ch.key === "intro" ? "✦" : (ch.label || "").replace("Chapitre ", ""))}</span></div>
      <div class="sg-txt"><small>${i === 0 ? "Signet automatique" : "Emplacement " + ROM[i]} · ${fmtDate(sg.date)}</small><b>${esc(ch.label)} · ${esc(s.title)}</b><span>${esc(s.sub || "")} · page ${(sg.page || 0) + 1}</span></div>
      <div class="sg-act"><button class="btn-or petit" data-act="charger" data-slot="${i}"><span>Reprendre</span></button>${peutRanger && i ? `<button class="btn petit" data-act="ranger" data-slot="${i}"><span>Remplacer</span></button>` : ""}${i ? `<button class="rond ico mini" data-act="effacer" data-slot="${i}" aria-label="Effacer le signet">✕</button>` : ""}</div></article>`; }).join("")}</div>`;
}
actions.ranger = (b) => { const i = +b.dataset.slot; let snap = null; try { snap = JSON.parse(JSON.stringify(ST())); } catch {}
  G.signets = G.signets.filter((s) => s.slot !== i); G.signets.push({ slot: i, scene: ST().scene, page: J ? J.p : 0, date: Date.now(), snap }); sauver(); toast("⚑ Signet rangé — emplacement " + ROM[i]); rafraichirSignets(); };
actions.charger = (b) => { const i = +b.dataset.slot; fermerCouche();
  if (i === 0) { toast("⚑ Lecture reprise"); reprendre(); return; }
  const sg = G.signets.find((s) => s.slot === i); if (!sg) return;
  if (sg.snap) { try { const c = ST(); const keep = { mobileUI: c.mobileUI, devMode: c.devMode, musicOn: c.musicOn, menuMusicOn: c.menuMusicOn };
      // l’instantané remplace l’état du moteur : valeurs, drapeaux, codex, inventaire, souvenirs, fragments…
      setState(Object.assign(JSON.parse(JSON.stringify(sg.snap)), keep)); } catch (e) { console.warn("[biblio] signet", e); } }
  else ST().scene = sg.scene;
  fn("save")?.(); toast("⚑ Lecture reprise");
  moteurJeu(); aller("#/jeu"); setTimeout(() => { if (J && sg.page) { J.p = Math.min(sg.page, J.pages.length - 1); afficherPage(true); } }, 320); };
actions.effacer = (b) => confirmer("Effacer le signet", "Retirer ce signet de la bibliothèque ?", "Effacer", () => { G.signets = G.signets.filter((s) => s.slot !== +b.dataset.slot); sauver(); if (PB.dataset.ecran === "signets") route(); else ouvrirCouche("signets"); });
function rafraichirSignets() { const box = $(".signets"); if (!box) return; box.outerHTML = htmlSignets(PB.dataset.ecran === "jeu"); }
function ecranSignets() {
  fond("biblio", IMG("bibliotheque.webp")); particules(20);
  const n = slots().filter((s) => s.scene).length;
  monter(`<section class="page-livre">${entete("Fiches d’emprunt", "Signets", retourVers, `<span class="compteur z-lbl"><b>${n}</b> / 7<em>rangés</em></span>`)}
    <div class="pl-corps verre z-pan" data-orn>${htmlSignets(false)}<p class="note-bas">Ranger un nouveau signet se fait en cours de lecture (onglet <b>Signets</b>). Le signet automatique suit la dernière page lue.</p></div></section>`, "e-signets");
}

/* ---------- Codex ---------- */
function ecranCodex([onglet = "entrees"], q) {
  fond("biblio", IMG("grande_bibliotheque.webp")); particules(18);
  const EO = ENT_OK(), IO = IMG_OK(), MO = MUS_OK();
  const nbE = Object.keys(D.entries).filter((k) => EO.has(k)).length, totE = Object.keys(D.entries).length;
  const totI = Object.keys(D.images).length, nbI = Object.keys(D.images).filter((k) => IO.has(k)).length, totM = Object.keys(D.music).length, nbM = Object.keys(D.music).filter((k) => MO.has(k)).length;
  const tabs = [["entrees", "Entrées", `${nbE}/${totE}`], ["images", "Images", `${nbI}/${totI}`], ["musiques", "Musiques", `${nbM}/${totM}`], ["encyclopedie", "Encyclopédie", "↗"]];
  monter(`<section class="codex">${entete("Grimoire vivant · archives de Mir’Aldas", "Codex", retourVers)}
    <nav class="onglets z-hud" role="tablist">${tabs.map((t) => `<button class="onglet ${t[0] === onglet ? "actif" : ""}" role="tab" aria-selected="${t[0] === onglet}" data-go="#/codex/${t[0]}"><span>${t[1]}</span><b>${t[2]}</b></button>`).join("")}</nav>
    <div class="codex-corps" id="codexCorps"></div></section>`, "e-codex");
  ({ entrees: codexEntrees, images: codexImages, musiques: codexMusiques, encyclopedie: codexEncyclo }[onglet] || codexEntrees)(q);
  const a = audioEl(); if (!a || a.paused) jouerMusique("music_menu");
}
function codexEntrees(q) {
  const EO = ENT_OK(); const ok = (k) => EO.has(k) && D.entries[k];
  const premier = D.entryGroups.flatMap((g) => g.keys).find(ok);
  const sel = q.get("e") && ok(q.get("e")) ? q.get("e") : (ok("remerii") ? "remerii" : premier);
  const gOuvert = (D.entryGroups.find((g) => g.keys.includes(sel)) || {}).id;
  $("#codexCorps").innerHTML = `<aside class="cx-liste verre z-pan">${D.entryGroups.map((g) => `<details class="cx-groupe" ${g.id === gOuvert ? "open" : ""}><summary><span>${esc(g.title)}</span><b>${g.keys.filter(ok).length}/${g.keys.length}</b></summary>
      <ul>${g.keys.map((k) => ok(k) ? `<li><button class="cx-item ${k === sel ? "actif" : ""}" data-e="${k}">${esc(D.entries[k]?.title || k)}</button></li>` : `<li><span class="cx-item verrou">🔒&#xFE0E; ???</span></li>`).join("")}</ul></details>`).join("")}</aside>
    <article class="cx-fiche verre z-pan" id="cxFiche" data-orn></article>`;
  const voir = (k) => { const e = D.entries[k]; const g = D.entryGroups.find((g) => g.keys.includes(k)) || { title: "" };
    $$(".cx-item").forEach((b) => b.classList.toggle("actif", b.dataset.e === k));
    if (!e) { $("#cxFiche").innerHTML = `<p class="kicker">Grimoire</p><h2 class="cx-titre">Pages encore closes</h2><div class="filet-or" aria-hidden="true"></div><p class="cx-texte">Continue l’aventure pour déverrouiller les pages du grimoire.</p>`; orner($("#cxFiche")); return; }
    const body = brut(e.body || "");
    $("#cxFiche").innerHTML = `<span class="filigrane" aria-hidden="true">${esc(e.title)}</span><p class="kicker">${esc(g.title)}</p><h2 class="cx-titre">${esc(e.title)}</h2><div class="filet-or" aria-hidden="true"></div><p class="cx-texte"><span class="lettrine">${esc(body.charAt(0))}</span>${esc(body.slice(1))}</p>`; orner($("#cxFiche")); };
  $$(".cx-item[data-e]").forEach((b) => b.addEventListener("click", () => { son("clic"); voir(b.dataset.e); }));
  voir(sel);
}
function codexImages(q) {
  const IO = IMG_OK();
  const cur = CH_OF(ST().scene); const gDef = (D.imageGroups.find((g) => parseChap(g.title) === cur) || D.imageGroups[0] || {}).id;
  const g = D.imageGroups.find((x) => x.id === (q.get("g") || gDef)) || D.imageGroups[0];
  $("#codexCorps").innerHTML = `<div class="cx-images verre z-pan"><nav class="puces" aria-label="Chapitres">${D.imageGroups.map((x) => { const n = (x.sections || []).reduce((a, s) => a + s.keys.filter((k) => IO.has(k)).length, 0), t = (x.sections || []).reduce((a, s) => a + s.keys.length, 0);
      return `<button class="puce ${x.id === g.id ? "actif" : ""}" data-go="#/codex/images?g=${x.id}">${esc(x.title.split(" · ")[0])}<b>${n}/${t}</b></button>`; }).join("")}</nav>
    <div class="planches">${(g.sections || []).map((s) => `<section class="pl-sec"><h3 class="pl-titre">${esc(s.title)}</h3><div class="pl-grille">${s.keys.map((k) => IO.has(k) && D.images[k]
      ? `<button class="planche-img" data-img="${k}" aria-label="${esc(D.images[k].title)}"><img src="${esc(imgSrc(k))}" alt="" loading="lazy"><span>${esc(D.images[k].title)}</span></button>`
      : `<span class="planche-img verrou" aria-label="Image verrouillée"><i>🔒&#xFE0E;</i><span>???</span></span>`).join("")}</div></section>`).join("")}</div></div>`;
  $$(".planche-img[data-img]").forEach((b) => b.addEventListener("click", () => lightbox(b.dataset.img, g)));
  if (q.get("img")) lightbox(q.get("img"), g);
}
function lightbox(k, g) {
  const IO = IMG_OK(); const L = (g ? (g.sections || []).flatMap((s) => s.keys) : Object.keys(D.images)).filter((x) => IO.has(x) && D.images[x]); let i = Math.max(0, L.indexOf(k));
  if (!L.length) return;
  const montrer = () => { const kk = L[i], im = D.images[kk];
    $("#couche").className = "ouverte lb"; $("#couche").innerHTML = `<div class="voile-c fort" data-act="fermer"></div><figure class="lightbox" data-orn><img src="${esc(imgSrc(kk))}" alt="${esc(im.title)}">
      <figcaption><b>${esc(im.title)}</b><span>${esc(brut(im.body || ""))}</span><em>Planche ${i + 1} / ${L.length}</em></figcaption>
      <button class="rond ico lb-p" aria-label="Précédente">‹</button><button class="rond ico lb-s" aria-label="Suivante">›</button><button class="rond ico lb-f" data-act="fermer" aria-label="Fermer">✕</button></figure>`;
    orner($("#couche")); $(".lb-p").onclick = () => { i = (i - 1 + L.length) % L.length; montrer(); }; $(".lb-s").onclick = () => { i = (i + 1) % L.length; montrer(); }; };
  montrer();
}
const memeSrc = (a, src) => { if (!a || !src) return false; try { return new URL(a.currentSrc || a.src, location.href).href === new URL(src, location.href).href; } catch { return false; } };
function codexMusiques() {
  const MO = MUS_OK(); const a = audioEl();
  $("#codexCorps").innerHTML = `<div class="cx-musiques verre z-pan">${D.musicGroups.map((g) => `<section class="mu-sec"><h3 class="pl-titre">${esc(g.title)}</h3><ul>${g.keys.filter((k) => D.music[k]).map((k) => { const m = D.music[k]; const ok = MO.has(k) && m.src;
      const joue = ok && a && !a.paused && memeSrc(a, m.src);
      return `<li class="piste ${ok ? "" : "verrou"}"><button class="rond ico mini" ${ok ? `data-act="ecouter" data-k="${k}"` : "disabled"} aria-label="${ok ? "Écouter" : "Verrouillée"}">${ok ? (joue ? "❚❚" : "▶") : "🔒&#xFE0E;"}</button><div><b>${esc(ok ? m.title : "Piste inconnue")}</b><span>${esc(ok ? brut(m.body || m.label || "") : "Se découvre au fil du récit.")}</span></div><em>${esc(m.label || "")}</em></li>`; }).join("")}</ul></section>`).join("")}</div>`;
}
actions.ecouter = (b) => { const k = b.dataset.k; const m = D.music[k]; const a = audioEl(); if (!a || !m) return;
  if (!a.paused && memeSrc(a, m.src)) a.pause();
  else { ST().musicOn = true; a.src = m.src; a.loop = true; a.play().catch(() => {}); pisteCourante = "codex:" + k; }
  setTimeout(codexMusiques, 80); };
function codexEncyclo() {
  $("#codexCorps").innerHTML = `<article class="cx-fiche cx-encyclo verre z-pan" data-orn><span class="filigrane" aria-hidden="true">Encyclopédie</span><p class="kicker">Encyclopédie en ligne</p><h2 class="cx-titre">Les mondes du Chroniqueur</h2><div class="filet-or" aria-hidden="true"></div>
    <p class="cx-texte"><span class="lettrine">O</span>uvre les grandes archives de Sylvinia : cosmologie, carte interactive, personnages, bestiaire, galerie d’illustrations et fragments du Chroniqueur.</p>
    <div class="tags">${["Univers", "Carte", "Personnages", "Bestiaire", "Galerie", "Fragments"].map((t) => `<span class="tag">${t}</span>`).join("")}</div>
    <div class="conf-act"><a class="btn" href="https://val1615.github.io/Les-mondes-du-Chroniqueur/#vn" target="_blank" rel="noopener noreferrer"><span>Section Visual Novel</span></a><a class="btn-or" href="https://val1615.github.io/Les-mondes-du-Chroniqueur/" target="_blank" rel="noopener noreferrer"><span>Ouvrir l’encyclopédie</span></a></div></article>`;
  orner($("#codexCorps"));
}

/* ---------- Progression (registre) + Carnet du Némésis ---------- */
function ecranProgression() {
  fond("biblio", IMG("bibliotheque.webp")); particules(18);
  const s = ST(); const stats = s.stats || {}; const inv = (s.inventory || []).filter((k) => D.items[k]); const mem = (s.memories || []).filter((k) => D.memories[k]);
  const pt = fn("progressTier"); const palier = (k, v) => { try { return pt ? pt(k, v) : ""; } catch { return ""; } };
  const barre = ([k, l]) => { const v = stats[k] || 0, cap = D.caps[k] || 25; return `<div class="valeur" style="--v:var(--v-${k})"><div class="val-tete"><span class="val-gem" aria-hidden="true"></span><b>${l}</b><span class="val-pal">${palier(k, v)}</span><strong>${v}</strong></div><div class="val-piste"><em style="width:${Math.min(100, v / cap * 100)}%"></em><i style="left:${8 / cap * 100}%"></i><i style="left:${16 / cap * 100}%"></i></div></div>`; };
  const fiche = (o, cls) => `<article class="fiche-cat ${cls}"><span class="fc-ico" aria-hidden="true">${esc(o.icon || "✦")}</span><div><small>${esc(o.type || o.chapter || "")}</small><b>${esc(o.title)}</b><p>${esc(brut(o.body || ""))}</p></div></article>`;
  const N = nemesis(); const vide = (t) => `<p class="note-vide">${t}</p>`;
  monter(`<section class="progression">${entete("Carnet d’Hylee · registre du voyage", "Progression", retourVers, `<button class="compteur z-lbl nemesis-btn" data-act="ov" data-ov="nemesis" aria-label="Ouvrir le Carnet du Némésis"><b>${N.trouves.length}</b> / ${N.ordre.length}<em>Carnet du Némésis</em></button>`)}
    <div class="prog-corps">
      <section class="reg-col verre z-pan" data-orn><h2 class="col-titre">Valeurs d’Hylee</h2>${VALS.slice(0, 4).map(barre).join("")}
        <div class="lien-remerii">${barre(VALS[4])}<p class="lr-note">Le regard de Remerii : chaque choix qui la touche s’inscrit ici.</p></div></section>
      <section class="reg-col verre z-pan" data-orn><h2 class="col-titre">Inventaire <b>${inv.length}</b></h2><div class="fiches">${inv.map((k) => fiche(D.items[k], "objet")).join("") || vide("Le sac d’Hylee est encore léger : les objets s’y rangent au fil des chapitres.")}</div></section>
      <section class="reg-col verre z-pan" data-orn><h2 class="col-titre">Souvenirs <b>${mem.length}</b></h2><div class="fiches">${mem.map((k) => fiche(D.memories[k], "souvenir")).join("") || vide("Les souvenirs se gravent ici à mesure que le lien se tisse.")}</div></section>
    </div></section>`, "e-progression");
}
function nemesis() {
  const JF = val("JOURNAL_FRAGMENTS", {}); const ordreF = fn("visibleJournalFragmentOrder"); const unl = fn("journalFragmentUnlocked"); const lis = fn("journalFragmentsReadable");
  let ordre = []; try { ordre = ordreF ? ordreF() : Object.keys(JF); } catch { ordre = Object.keys(JF); }
  const trouves = ordre.filter((k) => { try { return unl ? unl(k) : (ST().journalFragments || []).includes(k); } catch { return false; } });
  let lisible = false; try { lisible = lis ? !!lis() : false; } catch {}
  return { JF, ordre, trouves, lisible };
}
function carnetNemesis(sel) {
  const N = nemesis();
  const lab = { journal: "Extrait du fragment", report: "Compte rendu officiel", manuscript: "Note manuscrite", projection: "Projection mystérieuse" };
  const cur = sel && N.trouves.includes(sel) ? sel : N.trouves[N.trouves.length - 1];
  const liste = N.ordre.map((k) => { const f = N.JF[k] || {}; const ok = N.trouves.includes(k);
    const t = N.lisible ? f.title : `Fragment ${N.trouves.indexOf(k) + 1}`;
    return ok ? `<li><button class="cx-item ${k === cur ? "actif" : ""}" data-act="nemesis-f" data-f="${k}">${esc(t)}<small>${esc(N.lisible ? f.chapter || "" : "Retrouvé après " + (f.chapter || ""))}</small></button></li>`
      : `<li><span class="cx-item verrou">🔒&#xFE0E; ${esc(f.unlockLabel || "Fragment scellé")}</span></li>`; }).join("");
  let page;
  if (!cur) page = `<span class="filigrane" aria-hidden="true">Némésis</span><p class="kicker">Archives incomplètes</p><h2 class="cx-titre">Le Carnet du Némésis</h2><div class="filet-or" aria-hidden="true"></div><p class="cx-texte"><span class="lettrine">À</span> chaque fin de chapitre (Introduction compris), Hylee peut mettre la main sur un mystérieux fragment. Aucun n’a encore été trouvé : le carnet restera silencieux jusqu’à ce qu’une page soit découverte.</p>`;
  else { const f = N.JF[cur] || {};
    page = N.lisible ? `<span class="filigrane" aria-hidden="true">Némésis</span><p class="kicker">${esc(f.chapter || "")} · lisible</p><h2 class="cx-titre">${esc(f.title || "")}</h2><div class="filet-or" aria-hidden="true"></div>
      ${(f.blocks || []).map((b, i) => `<div class="nm-bloc ${esc(b.kind || "projection")}"><small class="nm-lab">${lab[b.kind] || lab.projection}</small><p class="cx-texte">${i === 0 ? `<span class="lettrine">${esc(String(b.text || "").charAt(0))}</span>${esc(String(b.text || "").slice(1))}` : esc(b.text || "")}</p></div>`).join("")}`
      : `<span class="filigrane" aria-hidden="true">Némésis</span><p class="kicker">Retrouvé après ${esc(f.chapter || "")} · illisible</p><h2 class="cx-titre">Mystérieux fragment d’un journal ancien</h2><div class="filet-or" aria-hidden="true"></div><p class="cx-texte nm-flou"><span class="lettrine">V</span>ous ne parvenez pas à le lire. L’encre se dérobe, comme si les lignes refusaient encore de se laisser déchiffrer… Du moins, pour le moment.</p>`; }
  fenetre("Le Carnet du Némésis", `Archives incomplètes · ${N.trouves.length} / ${N.ordre.length} fragments`, `<div class="nemesis"><aside class="cx-liste nm-liste"><ul>${liste}</ul></aside><article class="cx-fiche nm-page" data-orn>${page}</article></div>`, "large nemesis-fen");
}
actions["nemesis-f"] = (b) => carnetNemesis(b.dataset.f);

/* ---------- Réglages ---------- */
function ecranReglages([onglet = "affichage"]) {
  fond("biblio", IMG("bibliotheque.webp")); particules(14);
  const s = ST(); const a = audioEl(); const vol = Math.round(((a && a.volume) ?? 0.65) * 100);
  const tabs = [["lecture", "Lecture"], ["affichage", "Affichage"], ["audio", "Audio"], ["systeme", "Système"]];
  const inter = (k, t, d, v) => `<label class="reglage bascule"><span class="rg-t"><b>${t}</b><small>${d}</small></span><input type="checkbox" data-reg="${k}" ${(v ?? G.reg[k]) ? "checked" : ""}><span class="interrupteur" aria-hidden="true"></span></label>`;
  const curs = (k, t, d, min, max, pas = 5, suf = " %", v) => `<label class="reglage curseur"><span class="rg-t"><b>${t}</b><small>${d}</small></span><output data-out="${k}">${v ?? G.reg[k]}${suf}</output><input type="range" min="${min}" max="${max}" step="${pas}" value="${v ?? G.reg[k]}" data-reg="${k}" data-suf="${suf}"></label>`;
  const corps = {
    lecture: curs("vitesse", "Vitesse du texte", "Machine à écrire (100 = instantané)", 10, 100, 5, "") + curs("auto", "Délai de lecture auto", "Secondes entre deux pages", 1, 8, .5, " s") + inter("facile", "Mode facile", "Affiche les effets des choix sur les valeurs") + inter("reduit", "Animations réduites", "Coupe transitions, particules et vidéos"),
    affichage: `<div class="reglage rg-ui"><span class="rg-t"><b>Interface en jeu</b><small>Complète, épurée ou cinématique (touche H, ou bouton ◐ en scène)</small></span><span class="rg-choix">${UI.map(([k, l]) => `<button class="puce ${G.reg.ui === k ? "actif" : ""}" data-act="ui-set" data-ui="${k}">${l}</button>`).join("")}</span></div><p class="rg-intro">Mêmes 7 curseurs que la Chronique Alternative — appliqués en direct, mémorisés.</p><div class="grille-curseurs">${ECH.map((e) => curs(e[0], e[1], e[2], e[3], e[4])).join("")}</div><button class="btn" data-act="reinit"><span>Réinitialiser à 100 %</span></button>`,
    audio: inter("musique", "Musique", "Thèmes du jeu (menu, scènes)", musiqueOn()) + curs("volume", "Volume de la musique", "", 0, 100, 5, " %", vol) + inter("sons", "Sons d’interface", "Page qui tourne, carillon de choix"),
    systeme: `<div class="reglage rg-ui rg-skin"><span class="rg-t"><b>Apparence</b><small>Bibliothèque astrale ou interface Classique d’origine</small></span><span class="rg-choix"><button class="puce actif" data-act="skin" data-skin="biblio">Bibliothèque</button><button class="puce" data-act="skin" data-skin="classique">Classique</button></span></div>` +
      /* Mode mobile : masqué en Bibliothèque (n’affecte que body.mobileUI / Classique) — état conservé */
      `<div class="reglage"><span class="rg-t"><b>Mode développeur</b><small>${s.devMode ? "Activé · valeurs visibles · chapitres ouverts" : "Verrouillé · code requis"}</small></span>
        <button class="btn petit" data-act="dev">${s.devMode ? "Désactiver" : "Activer"}</button></div>` +
      (s.devMode ? htmlDev(s) + `
        <div class="reglage"><span class="rg-t"><b>DEV · journal Némésis</b><small>Afficher et rendre lisibles tous les fragments</small></span>
          <button class="btn petit ${s.devJournalForceAccess ? "actif" : ""}" data-act="dev-journal">${s.devJournalForceAccess ? "Accès forcé actif" : "Forcer l’accès"}</button></div>` : "") +
      `<div class="reglage"><span class="rg-t"><b>Nouveau départ</b><small>Réinitialiser l’aventure (valeurs, choix, codex)</small></span><button class="btn danger petit" data-act="raz"><span>Réinitialiser</span></button></div>`,
  };
  monter(`<section class="reglages">${entete("Options", "Réglages", retourVers)}
    <nav class="onglets z-hud" role="tablist">${tabs.map((t) => `<button class="onglet ${t[0] === onglet ? "actif" : ""}" role="tab" aria-selected="${t[0] === onglet}" data-go="#/reglages/${t[0]}"><span>${t[1]}</span></button>`).join("")}</nav>
    <div class="rg-corps verre z-pan" data-orn><div class="rg-defil">${corps[onglet] || corps.affichage}</div></div></section>`, "e-reglages");
  $$("[data-reg]").forEach((inp) => inp.addEventListener(inp.type === "range" ? "input" : "change", () => { const k = inp.dataset.reg; const v = inp.type === "range" ? +inp.value : inp.checked;
    const o = $(`[data-out="${k}"]`); if (o) o.textContent = inp.value + inp.dataset.suf;
    if (k === "musique") { if (v !== musiqueOn()) actions.musique(); return; }
    if (k === "volume") { const au = audioEl(); if (au) au.volume = v / 100; const vi = document.getElementById("volume"); if (vi) { vi.value = String(v / 100); vi.dispatchEvent(new Event("input", { bubbles: true })); } return; }
    if (k === "mobile") { ST().mobileUI = v; try { fn("applyMobileUI")?.(); fn("save")?.(); } catch {} return; }
    if (k === "classique") { if (v) basculer("classique"); return; }
    G.reg[k] = v; appliquerEchelles(); sauver(); }));
}
/* ---------- Outils développeur (mêmes fonctions que Classique : recherche de scène v0.215, réglage des valeurs, Codex DEV) ---------- */
const DEV_STATS = [["audace", "Audace"], ["sangfroid", "Sang-froid"], ["lucidite", "Lucidité"], ["resonance", "Résonance"], ["lien", "Lien Remerii"]];
let devStatSel = "lucidite";
function htmlDev(s) {
  const st = s.stats || {}; const ids = Object.keys(S_()).sort();
  const opts = ids.map((id) => { const sc = S_()[id] || {}; return `<option value="${esc(id)}" label="${esc([sc.title, sc.sub].filter(Boolean).join(" · ").slice(0, 90))}"></option>`; }).join("");
  return `<div class="dev-dock">
      <div class="dev-card"><div class="dev-head"><b>DEV · scène actuelle</b><small id="ba-dev-scene">${esc(s.scene || "?")}${S_()[s.scene] ? " — " + esc(S_()[s.scene].title || "") : ""}</small></div>
        <div class="dev-row"><button class="btn petit" data-act="dev-copier"><span>Copier</span></button>
          <button class="btn petit" data-act="dev-back" ${(s.history && s.history.length) ? "" : "disabled"}>Retour scène</button></div></div>
      <div class="dev-card"><div class="dev-head"><b>DEV · aller à une scène</b><small>Identifiant exact, fragment ou titre · ${ids.length} scènes</small></div>
        <div class="dev-row"><input id="baDevScene" class="rg-in" list="baDevScenes" placeholder="Ex : duel, c5_sage_start, c12i_000" autocomplete="off" spellcheck="false"><datalist id="baDevScenes">${opts}</datalist>
        <button class="btn-or petit" data-act="dev-aller"><span>Aller</span></button></div></div>
      <div class="dev-card"><div class="dev-head"><b>DEV · valeurs</b><small>${DEV_STATS.map(([k, l]) => `${l} <b data-dev-v="${k}">${st[k] || 0}</b>`).join(" · ")}</small></div>
        <div class="dev-row"><select id="baDevStat" class="rg-in">${DEV_STATS.map(([k, l]) => `<option value="${k}" ${k === devStatSel ? "selected" : ""}>${l}</option>`).join("")}</select>
        <input id="baDevVal" class="rg-in rg-num" type="number" inputmode="numeric" min="0" max="999" step="1" value="${st[devStatSel] || 0}">
        <button class="btn-or petit" data-act="dev-val"><span>Définir</span></button></div></div>
      <div class="dev-card"><div class="dev-head"><b>DEV · Codex complet</b><small>Révèle tout le Codex sans modifier les vrais déblocages</small></div>
        <div class="dev-row"><button class="btn petit ${s.devCodexForceAccess ? "actif" : ""}" data-act="dev-codex"><span>${s.devCodexForceAccess ? "Codex normal" : "Tout révéler"}</span></button></div></div>
    </div>`;
}
function trouverScene(raw) {
  raw = String(raw || "").trim(); if (!raw) return null; const S = S_(); if (S[raw]) return raw;
  const low = raw.toLowerCase(), ids = Object.keys(S).sort();
  return ids.find((id) => id.toLowerCase() === low) || ids.find((id) => id.toLowerCase().includes(low)) || ids.find((id) => (((S[id].title || "") + " " + (S[id].sub || "")).toLowerCase().includes(low))) || null;
}
actions["dev-aller"] = () => {
  const s = ST(); if (!s.devMode) { toast("Mode développeur requis"); return; }
  const raw = $("#baDevScene")?.value; const id = trouverScene(raw);
  if (!id) { toast(`Scène introuvable : <b>${esc(raw || "")}</b>`); return; }
  if (!Array.isArray(s.history)) s.history = []; if (s.scene && s.scene !== id) s.history.push(s.scene);
  // repartir proprement si la scène est un duel (sinon l’état d’un duel précédent bloque le rendu)
  ["duel", "c3ShadowDuel", "c5SageDuel", "x12iDuel"].forEach((k) => { if (s[k] && s[k].finished) s[k] = null; });
  s.scene = id; document.body.classList.remove("sw-open", "ba-monde");
  moteurJeu(); fn("save")?.(); retourVers = "#/titre";
  J = null; H = "#/jeu"; route(); toast(`Scène ouverte : <b>${esc(id)}</b>`);
};
actions["dev-val"] = () => {
  const s = ST(); if (!s.devMode) { toast("Mode développeur requis"); return; }
  const k = $("#baDevStat")?.value || "lucidite"; let v = parseInt($("#baDevVal")?.value, 10); if (!Number.isFinite(v)) v = 0; v = Math.max(0, Math.min(999, v));
  if (!s.stats) s.stats = {}; s.stats[k] = v; devStatSel = k;
  try { fn("updateProgressUI")?.(); } catch {} fn("save")?.();
  const b = $(`[data-dev-v="${k}"]`); if (b) b.textContent = v; const inp = $("#baDevVal"); if (inp) inp.value = String(v);
  toast(`${(DEV_STATS.find((x) => x[0] === k) || [k, k])[1]} = <b>${v}</b>`);
};
actions["dev-codex"] = () => { const s = ST(); if (!s.devMode) return; s.devCodexForceAccess = !s.devCodexForceAccess; fn("save")?.(); route(); toast(s.devCodexForceAccess ? "Codex DEV révélé" : "Codex normal restauré"); };
actions["dev-copier"] = () => { const id = ST().scene || ""; try { navigator.clipboard?.writeText(id); } catch {} toast(`Code de scène : <b>${esc(id)}</b>`); };
R.addEventListener("change", (e) => { if (e.target && e.target.id === "baDevStat") { devStatSel = e.target.value; const v = $("#baDevVal"); if (v) v.value = String((ST().stats || {})[devStatSel] || 0); } });
actions.skin = (b) => basculer(b.dataset.skin);
actions.dev = () => { const f = fn("toggleDevMode"); if (f) f(); else document.getElementById("devModeBtn")?.click();
  setTimeout(() => { if (PB.dataset.ecran === "reglages") route(); }, 80); };
actions["dev-journal"] = () => { const f = fn("toggleJournalForceAccess"); if (f) f(); else document.getElementById("journalForceAccessBtn")?.click();
  setTimeout(() => { if (PB.dataset.ecran === "reglages") route(); }, 80); };
actions["dev-back"] = () => { const f = fn("devBack"); if (f) f(); else document.getElementById("devBackBtn")?.click(); planifierMaj(); };
actions.reinit = () => { ECH.forEach((e) => (G.reg[e[0]] = 100)); appliquerEchelles(); sauver(); route(); toast("Échelles remises à 100 %"); };
actions.raz = () => confirmer("Nouveau départ", "Effacer l’aventure en cours (valeurs, choix, codex de l’aventure) et recommencer au Chapitre I ? Vos signets restent rangés.", "Réinitialiser", () => {
  G.journal = []; sauver(); carteLancer = () => { pilote = true; try { fn("newGame")?.({ confirm: false }); } finally { pilote = false; } }; aller("#/carte/ch1"); });

/* ---------- Pont moteur → interface ---------- */
function ecranMoteurVisible() { for (const id of ["game", "title", "chapters", "codex", "progression", "modeSelect", "splashTitle", "disclaimer"]) { const el = document.getElementById(id); if (el && !el.classList.contains("hidden")) return id; } return "title"; }
function surSetScreen(nom) {
  if (!actif() || pilote) return;
  syncCouches();
  if (document.body.classList.contains("ba-monde")) return; // moments libres visibles
  const h = HASH_DE[nom]; if (!h) return;
  const e = h.slice(2), cur = PB.dataset.ecran;
  if (e === "jeu") { if (cur === "jeu") planifierMaj(); else if (cur !== "carte") aller("#/jeu"); return; }
  if (cur === e || cur === "carte") return;
  if (e === "ouverture" && cur === "intro") { aller(h); return; }
  aller(h);
}
function brancher() {
  const wrap = (name, after) => { const f = fn(name); if (!f || f.__biblio) return; const w = function () { const r = f.apply(this, arguments); try { after.apply(this, arguments); } catch (e) { console.warn("[biblio]", name, e); } return r; }; w.__biblio = true; setGlobal(name, w); };
  wrap("setScreen", (nom) => surSetScreen(nom));
  wrap("render", () => { if (actif() && PB.dataset.ecran === "jeu") planifierMaj(); });
  wrap("save", () => { autoDate = Date.now(); });
  const n = fn("sylviniaNotify");
  if (n && !n.__biblio) { const w = function (input, detail) { if (actif()) { const d = typeof input === "object" && input ? input : { title: input, desc: detail }; const t = String(d.title || ""); const ds = String(d.desc ?? d.detail ?? "");
        toast(`<b>${esc(t)}</b>${ds ? " — " + esc(ds.split(" · ").slice(0, 3).join(" · ")) : ""}`); return; } return n.apply(this, arguments); }; w.__biblio = true; setGlobal("sylviniaNotify", w); }
}
// observe l’écran de jeu classique : duels, minuteurs, séquences qui réécrivent la scène hors render()
function observer() {
  const cible = document.getElementById("gameCard"); if (!cible) return;
  new MutationObserver(() => { if (actif() && PB.dataset.ecran === "jeu") planifierMaj(); }).observe(cible, { subtree: true, childList: true, attributes: true, attributeFilter: ["class", "disabled"] });
  new MutationObserver(() => { if (!actif() || syncCouches._cleanQte) return; const avant = document.body.classList.contains("ba-monde"); syncCouches();
    if (avant && !document.body.classList.contains("ba-monde") && PB.dataset.ecran === "jeu") planifierMaj();
  }).observe(document.body, { attributes: true, attributeFilter: ["class"] });
  const sw = document.getElementById("storyWorldRoot");
  if (sw) new MutationObserver(() => syncCouches()).observe(sw, { attributes: true, attributeFilter: ["hidden", "class"] });
  else setTimeout(() => { const r = document.getElementById("storyWorldRoot"); if (r) new MutationObserver(() => syncCouches()).observe(r, { attributes: true, attributeFilter: ["hidden", "class"] }); }, 2000);
}

/* ---------- Bascule Bibliothèque / Classique ---------- */
function basculer(skin) {
  const on = skin !== "classique";
  try { const c = skinCfg(); c.skin = on ? "biblio" : "classique"; localStorage.setItem(SKIN_KEY, JSON.stringify(c)); } catch {}
  document.body.classList.toggle("ui-biblio", on); document.body.classList.toggle("ui-classique", !on);
  document.body.classList.remove("ba-passe");
  if (on) { H = HASH_DE[ecranMoteurVisible()] || "#/titre"; appliquerEchelles(); route(); toast("<b>Bibliothèque astrale</b> — Mir’Aldas"); }
  else { fermerCouche(); clearInterval(typeT); clearTimeout(autoT); const vis = ecranMoteurVisible(); const ss = fn("setScreen"); pilote = true; try { ss && ss(vis); if (vis === "game") fn("render")?.(); } catch {} finally { pilote = false; } }
  ajouterBoutonClassique(); majBoutonClassique();
}
// en Classique : une pastille discrète (écran titre uniquement) pour revenir à la Bibliothèque
function ajouterBoutonClassique() {
  if (document.getElementById("baRetourBiblio")) return;
  const b = document.createElement("button"); b.id = "baRetourBiblio"; b.type = "button"; b.textContent = "✦ Bibliothèque astrale";
  b.title = "Revenir à l’interface Bibliothèque astrale";
  b.style.cssText = "position:fixed;right:12px;bottom:12px;z-index:99999;padding:6px 12px;border-radius:999px;border:1px solid rgba(216,189,120,.55);background:rgba(11,13,24,.82);color:#f3e4b5;font:600 12px/1.2 Georgia,serif;letter-spacing:.06em;cursor:pointer;opacity:.85;display:none";
  b.addEventListener("click", (e) => { e.stopPropagation(); basculer("biblio"); });
  document.body.appendChild(b);
}
function majBoutonClassique() { const b = document.getElementById("baRetourBiblio"); if (!b) return; const t = document.getElementById("title"); b.style.display = !actif() && t && !t.classList.contains("hidden") ? "" : "none"; }
setInterval(majBoutonClassique, 800);

/* ---------- Démarrage ---------- */
function demarrer() {
  brancher(); observer(); donnees(); appliquerEchelles(); ajouterBoutonClassique();
  if (skinCfg().skin === "classique") { document.body.classList.remove("ui-biblio"); document.body.classList.add("ui-classique"); majBoutonClassique(); return; }
  document.body.classList.add("ui-biblio");
  const intro = document.getElementById("sylviniaIntroVideoOverlay");
  if (intro && !intro.classList.contains("hidden")) { try { intro.querySelector("video")?.pause(); } catch {} intro.classList.add("hidden"); H = "#/intro"; }
  else H = HASH_DE[ecranMoteurVisible()] || "#/titre";
  route();
}
// API (tests, captures, débogage)
window.BibliothequeAstrale = { aller: (h) => naviguer(h), setUI: (u) => { G.reg.ui = u; sauver(); appliquerUI(); }, route: (h) => { H = h; route(); }, basculer, racine: R, changerUI, majJeu: () => majJeu(true), reg: G.reg,
  etat: () => ({ ecran: PB.dataset.ecran, H, passe: document.body.classList.contains("ba-passe"), J: J && { id: J.id, p: J.p, pages: J.pages.length, choix: J.M.choix.length, cont: !!J.M.cont, plein: J.plein } }) };
const pret = () => { demarrer(); setTimeout(brancher, 1500); setTimeout(brancher, 4000); };
if (document.readyState === "complete") setTimeout(pret, 0); else window.addEventListener("load", () => setTimeout(pret, 60));
})();
