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

Les sauvegardes de `saves/` ont été produites par la version en ligne (avant V2) : elles servent de test de compatibilité.
