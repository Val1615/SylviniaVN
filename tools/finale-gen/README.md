# Générateur du final du Tome I (Mode Histoire)

- `novel_rest.txt` : paragraphes 9682 à 12094 du DOCX `Ressource lore/Chroniques de Sylvinia Tome 1.docx`, au format `index|style|texte` (style `D` = réplique, `I` = italique).
- `novel.py` : chargement, corrections ciblées (`FIX`), répliques réécrites en guillemets avec incise (`OVR`), typographie (espaces insécables).
- `beats.py` : découpage du roman en scènes (décor, musique, silhouettes, paragraphes, suite).
- `extra_c17.js`, `extra_c18.js`, `extra_c19.js` : scènes écrites pour le jeu (choix, duel, points de vue, routage, cartes de chapitre). Le marqueur `/*@SCENES@*/` reçoit les scènes du roman.
- `gen.py` : écrit `fusion/story-finale-s02.js`, `s06.js`, `s09.js` et échoue s’il manque ou si se répète un paragraphe.
- `docs.py` : régénère `docs/production/finale_concordance_roman_vn.md`.
- Tests navigateur (serveur local sur 8893, Chrome système) : `static_check.py` (liens et ressources), `traverse.py` (toutes les branches depuis `c16_s01_fin`, couverture du roman par parcours), `pagination.py` (830×525, 1024×880, 880×1024), `choiceshots.py`.

```
python3 tools/finale-gen/gen.py && python3 tools/finale-gen/docs.py
```

Si vous modifiez le texte dans le Studio, ne relancez pas le générateur sans reporter la modification dans `novel.py`, sinon elle sera écrasée.
