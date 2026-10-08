# Parcours Playwright — interface V2.4 de la Chronique Alternative

Prérequis : `pip install playwright && playwright install chromium`, le jeu construit (`npm run build`) et servi depuis la racine du dépôt :

```
python3 -m http.server 8871   # depuis la racine SylviniaVN
export CA_BASE=http://127.0.0.1:8871/chronique-alternative/
export CA_SHOTS=/tmp/ca-shots   # dossier des captures (créer flow/ dedans)
```

| Script | Parcours |
| --- | --- |
| `flow_new.py` | titre → nouvelle chronique → 4 étapes de création → prologue → premier HUD |
| `flow_a.py` | Continuer (sauvegarde de la version en ligne) → Écouter (scène) → retour HUD → Offrir → Rendez-vous (scène complète) → Attendre ×5 (périodes et jours) |
| `flow_c.py` | Carte → voyage réel → Liens → fiche → Localiser → Rendez-vous / À trois → 6 sections du Journal → Jobs → Marché / Logis → Codex |
| `flow_d.py` | Pause → sauvegarder emplacement 1 → attendre → charger → Options (curseurs persistés après rechargement, réinitialisation) → Mode Histoire → retour |
| `flow_e.py` | Charger depuis le titre (emplacement de l’ancienne version) → registre → écran titre → confirmation « Nouvelle chronique » |
| `flow_fiche.py` | Fiche centrée sur le personnage (830×525 et 412×915 tactiles, 1920×1080) : pas de bandeau, ‹ n/N ›, glisser sur le portrait, Échap → Liens |
| `flow_mobile.py` | 830×525 et 412×915 tactiles : scène au doigt, barre mobile, feuille « Plus », pause |
| `resp.py` | Détecteur de chevauchements / textes coupés (`resp_check.js`) sur 5 formats |
| `flow_v25.py` | V2.5 : présent aimé → réaction et gains réels, lettre → réponse, scène → choix en cartes + historique (H, Échap), lanceur de job → partie, attente jusqu’au jour suivant → bilan (toucher : tout afficher puis continuer), sauvegarde/chargement sans bilan parasite — 5 formats |
| `resp_v25.py` | Chevauchements dans les fenêtres V2.5, la scène, l’historique et le bilan, sur 5 formats + échelles extrêmes (`?texte=140&cases=125&sprite=130`, `?texte=70&cases=70&sprite=70`) |
| `shots_bn.py` | Bellirith / Naïah : didacticiel, manche normale, manche hors échelle, dossier du Journal, Q5 avec sprite intime, route Bellirith existante, forme du rendez-vous final, bloc développeur (`CA_CHROME=/usr/bin/google-chrome python3 shots_bn.py saves/save-bn.json <dossier> 830x525t,1024x880`) |
| `shots_v25.py` | Captures avant/après V2.5 (`python3 shots_v25.py apres <dossier> 830x525t,1920x1080`) |

Le bilan de fin de journée intercepte les clics jusqu’à ce qu’on le touche deux fois : `common.close_modals` appelle `dismiss_bilan` avant de fermer les fenêtres.

Les sauvegardes de `saves/` ont été produites par la version en ligne (avant V2) : elles servent de test de compatibilité.
