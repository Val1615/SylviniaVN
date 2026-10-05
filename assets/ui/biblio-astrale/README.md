# Bibliothèque astrale — Mode Histoire

Couche d’apparence pour le Visual Novel racine (`index.html`). **N’affecte pas Chronique Alternative.**

## Activation
- Activée par défaut (`body.ui-biblio`).
- Basculable **Bibliothèque / Classique** dans Options du menu titre (persisté : `localStorage.sylvinia_ui_biblio_v1`).
- Préréglages en jeu : **Complète / Épurée / Cinématique** (bouton ◐ près du titre de scène, touche `H`).

## Fichiers
- `biblio.css` — peaux (disclaimer, splash, mode, titre, jeu, choix, chapitres, codex, progression, **Carnet du Némésis**, moments libres / hubs).
- `biblio.js` — bascule d’apparence, préréglages, détection des hubs (« moments libres »), déblocage audio au premier geste.
- `fonts/` — Cinzel, Cinzel Decorative, Cormorant, Inter.

## Notes
- Le **Carnet du Némésis** (pas Amnésis) est la section journal de l’écran Progression.
- Les **moments libres** sont les hubs de fin / exploration (ex. `c11g_bal_observation`) : choix de lieux / personnages restylés via `.ba-hub`.
