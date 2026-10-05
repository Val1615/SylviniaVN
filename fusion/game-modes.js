(function installSylviniaGameModes() {
  "use strict";

  const CHRONICLE_PATH = "chronique-alternative/";

  function openAlternativeChronicle() {
    try {
      if (typeof save === "function") save();
    } catch (_error) { /* Le mode libre possède sa propre sauvegarde. */ }
    // Toujours rejouer l’intro cinématique depuis le sélecteur de mode
    const dest = CHRONICLE_PATH.includes("?") ? CHRONICLE_PATH : (CHRONICLE_PATH.replace(/\/?$/, "/") + "?intro=intro");
    window.location.assign(dest);
  }

  function bind() {
    const button = document.getElementById("chronicleModeBtn");
    if (!button || button.dataset.chronicleBound === "true") return;
    button.dataset.chronicleBound = "true";
    button.addEventListener("click", openAlternativeChronicle);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bind, { once: true });
  else bind();

  window.SylviniaGameModes = {
    story: "index.html",
    alternativeChronicle: CHRONICLE_PATH,
    openAlternativeChronicle,
  };
})();
