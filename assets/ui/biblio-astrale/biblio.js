/*! Mode Histoire · Bibliothèque astrale — couche UI (n’altère pas Chronique Alternative) */
(() => {
  "use strict";
  const KEY = "sylvinia_ui_biblio_v1";
  const PRESETS = [
    ["complete", "Complète", "◐"],
    ["epuree", "Épurée", "◒"],
    ["cine", "Cinématique", "○"],
  ];
  const HUB_RE = /(observer|rejoindre|chercher|visiter|parler|écouter|explorer|laisser|continuer le chapitre|foyer|lieu|endroit|balader|retourner)/i;
  const INTIME_RE = /(c6_|nuit|terrasse|intime|chambre|balcon|embrass|cape)/i;

  function load() {
    try { return Object.assign({ skin: "biblio", preset: "complete" }, JSON.parse(localStorage.getItem(KEY) || "{}")); }
    catch { return { skin: "biblio", preset: "complete" }; }
  }
  function save(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {} }
  let cfg = load();

  function toast(html) {
    let t = document.querySelector(".ba-toast");
    if (!t) { t = document.createElement("div"); t.className = "ba-toast"; document.body.appendChild(t); }
    t.innerHTML = html; t.style.opacity = "1";
    clearTimeout(toast._t); toast._t = setTimeout(() => { t.style.opacity = "0"; }, 2600);
  }

  function applySkin() {
    const on = cfg.skin !== "classique";
    document.body.classList.toggle("ui-biblio", on);
    document.body.classList.toggle("ui-classique", !on);
    document.querySelectorAll("[data-ba-skin]").forEach((b) => b.classList.toggle("actif", b.dataset.baSkin === cfg.skin));
  }
  function setSkin(skin) {
    cfg.skin = skin === "classique" ? "classique" : "biblio";
    save(cfg); applySkin(); applyPreset();
    toast(cfg.skin === "biblio"
      ? "<b>Bibliothèque astrale</b> — interface Mir’Aldas"
      : "<b>Classique</b> — interface d’origine");
  }

  function applyPreset() {
    const p = PRESETS.some((x) => x[0] === cfg.preset) ? cfg.preset : "complete";
    cfg.preset = p;
    document.body.classList.toggle("ui-epuree", p === "epuree");
    document.body.classList.toggle("ui-cine", p === "cine");
    document.querySelectorAll(".ba-ui-btn").forEach((b) => {
      const meta = PRESETS.find((x) => x[0] === p);
      b.textContent = meta[2];
      b.setAttribute("aria-label", `Interface : ${meta[1]} — changer (touche H)`);
      b.title = `Interface : ${meta[1]} (H)`;
    });
    document.querySelectorAll("[data-ba-preset]").forEach((b) => b.classList.toggle("actif", b.dataset.baPreset === p));
  }
  function cyclePreset(forced) {
    if (cfg.skin === "classique") return;
    if (forced) cfg.preset = forced;
    else {
      const i = PRESETS.findIndex((x) => x[0] === cfg.preset);
      cfg.preset = PRESETS[(i + 1) % PRESETS.length][0];
    }
    save(cfg); applyPreset();
    const meta = PRESETS.find((x) => x[0] === cfg.preset);
    toast(`<span>◐ Interface <b>${meta[1]}</b></span><kbd>H</kbd>`);
  }

  function ensureUiButton() {
    if (cfg.skin === "classique") return;
    const bar = document.querySelector("#game:not(.hidden) .topbar, #gameCard .topbar");
    if (!bar || bar.querySelector(".ba-ui-btn")) return;
    let left = bar.querySelector(".topbar-left");
    if (!left) {
      left = document.createElement("div");
      left.className = "topbar-left";
      const first = bar.firstElementChild;
      if (first) { bar.insertBefore(left, first); left.appendChild(first); }
      else bar.appendChild(left);
    }
    const btn = document.createElement("button");
    btn.type = "button"; btn.className = "ba-ui-btn"; btn.addEventListener("click", (e) => { e.preventDefault(); cyclePreset(); });
    left.insertBefore(btn, left.firstChild);
    applyPreset();
  }

  function ensureSkinToggle() {
    const panel = document.querySelector("#title .menuAccordion:last-of-type .accordionPanel, #title details.menuAccordion .accordionPanel");
    const options = [...document.querySelectorAll("#title .menuAccordion")].find((d) => /Options/i.test(d.querySelector("summary")?.textContent || ""));
    const host = options?.querySelector(".accordionPanel");
    if (!host || host.querySelector(".ba-skin-toggle")) return;
    const box = document.createElement("div");
    box.className = "ba-skin-toggle";
    box.innerHTML = `<div><strong>Apparence</strong><small>Bibliothèque astrale ou interface classique</small></div>
      <div class="ba-puces">
        <button type="button" class="ba-puce" data-ba-skin="biblio">Bibliothèque</button>
        <button type="button" class="ba-puce" data-ba-skin="classique">Classique</button>
      </div>
      <div class="ba-puces ba-preset-row" style="width:100%;justify-content:flex-start;margin-top:4px">
        <span style="font:700 10px Cinzel,serif;letter-spacing:.14em;color:#a69c88;text-transform:uppercase;margin-right:4px">En jeu</span>
        ${PRESETS.map(([k, l]) => `<button type="button" class="ba-puce" data-ba-preset="${k}">${l}</button>`).join("")}
      </div>`;
    host.insertBefore(box, host.firstChild);
    box.addEventListener("click", (e) => {
      const skin = e.target.closest("[data-ba-skin]");
      const pre = e.target.closest("[data-ba-preset]");
      if (skin) setSkin(skin.dataset.baSkin);
      if (pre) cyclePreset(pre.dataset.baPreset);
    });
    applySkin(); applyPreset();
  }

  function markHubAndIntime() {
    const game = document.getElementById("game");
    if (!game || game.classList.contains("hidden")) {
      document.body.classList.remove("ba-hub", "ba-intime");
      return;
    }
    const choices = [...document.querySelectorAll("#choices .choiceBtn, #choices button")];
    const labels = choices.map((b) => b.textContent || "");
    const hubby = choices.length >= 3 && labels.filter((t) => HUB_RE.test(t)).length >= 2;
    document.body.classList.toggle("ba-hub", hubby);
    const sub = (document.getElementById("sceneSub")?.textContent || "") + " " + (document.getElementById("sceneTitle")?.textContent || "") + " " + (document.body.dataset.scene || "");
    const sceneCode = document.getElementById("devSceneCode")?.textContent || "";
    document.body.classList.toggle("ba-intime", INTIME_RE.test(sub + sceneCode));
  }

  /* Musique : déjà true par défaut dans le jeu ; on s’assure qu’un premier geste débloque l’autoplay. */
  function unlockAudio() {
    try {
      const a = document.getElementById("music");
      if (!a) return;
      if (typeof state !== "undefined") {
        if (typeof state.musicOn !== "boolean") state.musicOn = true;
        if (typeof state.menuMusicOn !== "boolean") state.menuMusicOn = true;
      }
      if (a.paused && a.src && (typeof state === "undefined" || state.musicOn !== false)) {
        a.play().catch(() => {});
      }
    } catch {}
  }
  ["pointerdown", "keydown", "touchend"].forEach((t) =>
    document.addEventListener(t, unlockAudio, { capture: true, passive: true })
  );

  document.addEventListener("keydown", (e) => {
    if ((e.key === "h" || e.key === "H") && !e.target.closest("input,textarea,[contenteditable]")) {
      if (cfg.skin === "classique") return;
      e.preventDefault();
      cyclePreset();
    }
  });

  let _q=false;
  function refresh() {
    if (_q) return; _q=true;
    requestAnimationFrame(() => { _q=false; ensureUiButton(); ensureSkinToggle(); markHubAndIntime(); });
  }
  const mo = new MutationObserver(refresh);

  function boot() {
    applySkin();
    applyPreset();
    ensureSkinToggle();
    ensureUiButton();
    markHubAndIntime();
    const root = document.getElementById("app") || document.body;
    mo.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ["class", "hidden"] });
    // le jeu mute parfois le DOM sans mutation utile : sondage léger
    setInterval(refresh, 1500);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  window.SylviniaBiblioUI = { setSkin, cyclePreset, cfg: () => ({ ...cfg }) };
})();
