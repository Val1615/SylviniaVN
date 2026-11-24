# Génère fusion/story-finale-s02.js (Chapitre XVII), story-finale-s06.js (Chapitre XVIII), story-finale-s09.js (Épilogue)
import json, sys, os
sys.path.insert(0, os.path.dirname(__file__))
import novel as N
from beats import B

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, '..', '..', 'fusion')
LIMIT, TARGET = 2000, 1500

def js_tpl(t):
    return '`' + t.replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${') + '`'


coverage = []   # (scene id, [§])
def emit(prefix):
    beats = [b for b in B if b['id'].startswith(prefix)]
    out = []
    for k, b in enumerate(beats):
        ids = [i for i in N.ids_between(b['a'], b['b']) if i not in N.HEADINGS]
        ids_texts = [(i, N.para(i)) for i in ids]
        # chunks travaille sur des textes : on regroupe par longueur
        parts, cur, n = [], [], 0
        total = sum(len(t) for _, t in ids_texts)
        if total <= LIMIT: parts = [ids_texts]
        else:
            for it in ids_texts:
                if cur and n + len(it[1]) > TARGET: parts.append(cur); cur, n = [], 0
                cur.append(it); n += len(it[1])
            if cur:
                if parts and sum(len(t) for _, t in cur) < 350: parts[-1] += cur
                else: parts.append(cur)
        nxt_final = b['next'] or (beats[k + 1]['id'] if k + 1 < len(beats) else None)
        for j, part in enumerate(parts):
            sid = b['id'] if j == 0 else f"{b['id']}_{j + 1}"
            nxt = nxt_final if j == len(parts) - 1 else f"{b['id']}_{j + 2}"
            text = '\n\n'.join(t for _, t in part)
            coverage.append((sid, [i for i, _ in part]))
            out.append(f"    {sid}: scene({json.dumps(b['sub'], ensure_ascii=False)}, {b['bg']}, {b['music']}, 'Narrateur',\n      {js_tpl(text)},\n      {json.dumps(nxt)}, {b['chars']}),\n")
    return ''.join(out)

FILES = [('c17_', 'story-finale-s02.js', 'extra_c17.js'), ('c18_', 'story-finale-s06.js', 'extra_c18.js'), ('c19_', 'story-finale-s09.js', 'extra_c19.js')]
for prefix, name, extra in FILES:
    src = open(os.path.join(HERE, extra), encoding='utf-8').read()
    gen = emit(prefix)
    assert '/*@SCENES@*/' in src
    src = src.replace('/*@SCENES@*/\n', gen)
    open(os.path.join(OUT, name), 'w', encoding='utf-8').write(src)
    print(name, len(gen), 'octets de scènes générées')

json.dump(coverage, open(os.path.join(HERE, 'coverage.json'), 'w'), ensure_ascii=False)
allp = [i for _, ids in coverage for i in ids]
expected = [i for i in sorted(N.P) if i not in N.HEADINGS]
miss = sorted(set(expected) - set(allp)); dup = len(allp) - len(set(allp))
print('paragraphes attendus', len(expected), 'couverts', len(set(allp)), 'manquants', len(miss), 'doublons', dup, 'scènes', len(coverage))
assert not miss and not dup
