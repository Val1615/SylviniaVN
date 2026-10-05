# Bibliothèque astrale (Mode Histoire)

Remplace l’UI classique du Mode Histoire par le DOM/CSS/JS du prototype
(`vn-redesign/proto/`), piloté par le moteur réel via un adaptateur Shadow DOM.

## Fichiers

| Fichier | Rôle |
|---|---|
| `host.css` | Masque `#app` et l’infra classique sous `body.ui-biblio` ; hôte `#bA-host` plein écran. `body.ba-passe` laisse passer les QTE/duels. |
| `proto.css` | CSS du prototype, scopé sous `.pbody` (généré par `tools/build_proto_css.py`). |
| `adapter.css` | Compléments (Némésis, encyclopédie, hubs, combat). |
| `adapter.js` | Monte le Shadow DOM du prototype, route `#/…`, lit/écrit le moteur. |
| `fonts.css` + `fonts/` | Mêmes polices que le prototype. |
| `img/` | Posters vidéos + fonds bibliothèque. |

## Bascule

- Défaut : Bibliothèque (`localStorage sylvinia_ui_biblio_v1.skin`).
- Réglages → Système → Apparence, ou pastille « ✦ Bibliothèque astrale » en Classique.
- `BibliothequeAstrale.basculer('classique'|'biblio')`.

## API test

```js
BibliothequeAstrale.aller('#/jeu/s02?choix=1')
BibliothequeAstrale.route('#/codex/entrees')
BibliothequeAstrale.setUI('epuree'|'cine'|'complete')
BibliothequeAstrale.changerUI() // cycle ◐ / H
BibliothequeAstrale.etat()
```

Cache-bust : `?v=` sur `adapter.js`, `host.css`, `fonts.css`, `proto.css`.
