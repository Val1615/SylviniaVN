# Générateur du final du Tome I (Mode Histoire)

- `novel_rest.txt` : paragraphes 9682 à 12094 du DOCX `Ressource lore/Chroniques de Sylvinia Tome 1.docx`, au format `index|style|texte` (style `D` = réplique, `I` = italique).
- `novel.py` : chargement, corrections ciblées (`FIX`), répliques réécrites en guillemets avec incise (`OVR`), typographie (espaces insécables).
- `shots.py` : les plans clés du final (72 du lot 1 pour S02 à S04, 67 du lot 2 pour S05, S06 et S07 ; fichier, paragraphe, mouvement de caméra, titre et texte du Codex). `DUEL_SHOTS` place deux plans S06 sur des scènes de duel écrites pour le jeu. `gen.py` coupe les écrans à chaque plan et le tient au plus `SPAN` paragraphes. `legacy_coverage.json` garde le découpage v0.419 pour rediriger les anciennes sauvegardes.
- `beats.py` : découpage du roman en scènes (décor, musique, silhouettes, paragraphes, suite).
- `extra_c17.js`, `extra_c18.js`, `extra_c19.js` : scènes écrites pour le jeu (choix, duel, points de vue, routage, cartes de chapitre). Le marqueur `/*@SCENES@*/` reçoit les scènes du roman.
- `fusion/story-finale-media.js` (écrit à la main, hors générateur) : musiques dédiées, sprites Hylee forme finale, Tia et Allenna (CA), classe d’échelle `finale-k`.
- `duels.js` : moteur des duels S04, S06, S07, S08 (jauges calculées depuis les flags, voile de combat, QTE, Game Over, en-tête de choix) et leur mise en scène (table `FX` : thème, humeur par scène `urgence` / `desespoir` / `gameover` / `apaisement`, bascules avec bandeau de titre). Copié tel quel vers `fusion/story-finale-duels.js`.
- `gen.py` : écrit `fusion/story-finale-s02.js`, `s06.js`, `s09.js`, `story-finale-duels.js` et échoue s’il manque ou si se répète un paragraphe.
- `docs.py` : régénère `docs/production/finale_concordance_roman_vn.md`.
- Tests navigateur (serveur local, port `PORT` = 8894 par défaut, Chrome système) : `static_check.py` (liens et ressources), `traverse.py` (5 profils × routes du carrefour, Game Over et reprises, union des textes = 1 365 paragraphes), `duels_e2e.py` (duels dans l’interface : QTE en temps réel, reprise, sauvegarde en plein duel, relecture, captures dans `/workspace/verification/finale-duels/`), `old_duels_smoke.py` (duels des chapitres précédents), `pagination.py` (830×525, 1024×880, 880×1024), `choiceshots.py`.

```
python3 tools/finale-gen/gen.py && python3 tools/finale-gen/docs.py
```

Si vous modifiez le texte dans le Studio, ne relancez pas le générateur sans reporter la modification dans `novel.py`, sinon elle sera écrasée.
