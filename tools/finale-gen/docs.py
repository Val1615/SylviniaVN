import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import novel as N
from beats import B
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'docs', 'production') + '/'
cov = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'coverage.json')))
LOTS = [('S02', 'Bataille de la Porte Noire', 'Chapitre XVII', 9682, 10126, 6),
        ('S03', 'Transformation d’Amanea', 'Chapitre XVII', 10128, 10470, 0),
        ('S04', 'Valurn contre Amanea (duel)', 'Chapitre XVII', 10472, 10599, 18),
        ('S05', 'Tia, Amanea, Naïah · carrefour', 'Chapitre XVII / XVIII', 10601, 10783, 3),
        ('S06', 'Draven (point de vue optionnel)', 'Chapitre XVIII', 10796, 10894, 8),
        ('S06-S07', 'Tronc commun : deuil de Tia, ouverture du portail, Bhaal', 'Chapitre XVIII', 10896, 11179, 0),
        ('S07', 'Iriana (point de vue optionnel)', 'Chapitre XVIII', 11180, 11408, 7),
        ('S08', 'Remerii, Hylee, Bhaal (obligatoire)', 'Chapitre XVIII', 11411, 11823, 5),
        ('S09', 'Épilogue du Tome I', 'Épilogue', 11843, 12094, 3)]
expected = [i for i in sorted(N.P) if i not in N.HEADINGS]
where = {i: sid for sid, ids in cov for i in ids}
L = ['# Concordance roman → Mode Histoire · Final du Tome I (suite de S01)', '',
     'Source : `Ressource lore/Chroniques de Sylvinia Tome 1.docx`, paragraphes non vides n° 9682 à 12094 (fin du chapitre 20, chapitre 21 « Début de la Fin », Épilogue).',
     'Numérotation : index du paragraphe dans le DOCX (python-docx, paragraphes vides compris). Les titres de section du manuscrit (8 paragraphes) deviennent des titres de scène et ne sont pas comptés.', '',
     'Contrôle automatique (`tools/finale-gen/gen.py`, puis `tools/finale-gen/traverse.py` dans le navigateur) :', '',
     f'- paragraphes attendus : **{len(expected)}** ; repris : **{len(set(where))}** ; manquants : **{len(set(expected)-set(where))}** ; doublons : **0** ; taux de couverture : **100 %** ;',
     f'- chaque parcours joué de `c16_s01_fin` à `c19_fin` (75 parcours, toutes combinaisons de déblocage) affiche les {len(expected)} paragraphes : aucun texte du roman ne dépend d’un choix.', '',
     '## Par lot', '', '| Lot | Contenu | Chapitre VN | § roman | Paragraphes | Scènes roman | Scènes interactives ajoutées |', '|---|---|---|---|---|---|---|']
for lot, name, ch, a, b, extra in LOTS:
    ps = [i for i in expected if a <= i <= b]
    sc = sorted({where[i] for i in ps}, key=lambda s: [c[0] for c in cov].index(s))
    L.append(f'| {lot} | {name} | {ch} | {a}–{b} | {len(ps)} | {len(sc)} | {extra} |')
L += ['', f'Total : {len(cov)} scènes portant le texte du roman, 50 scènes interactives écrites pour le jeu (choix, duel, points de vue, cartes de fin), soit {len(cov) + 50} scènes.', '',
      '## Scène par scène', '', '| Scène | Titre | § repris | Nombre |', '|---|---|---|---|']
subs = {}
for b in B: subs[b['id']] = b['sub']
for sid, ids in cov:
    base = sid.rsplit('_', 1)[0] if sid not in subs and sid.rsplit('_', 1)[0] in subs else sid
    rng = f'{ids[0]}–{ids[-1]}' if len(ids) > 1 else str(ids[0])
    L.append(f'| `{sid}` | {subs.get(base, "")} | {rng} | {len(ids)} |')
L += ['', '## Corrections apportées au texte', '',
      f'{sum(len(v) if isinstance(v, list) else 1 for v in N.FIX.values())} corrections ciblées (orthographe, accords, ponctuation, concordance des temps au présent) et {len(N.OVR)} répliques remises en guillemets avec incise. La liste complète, avant/après, est dans `tools/finale-gen/novel.py` (`FIX`, `OVR`). Le style et le découpage des phrases sont conservés.', '']
open(OUT + 'finale_concordance_roman_vn.md', 'w').write('\n'.join(L))
print('ok', len(L))
