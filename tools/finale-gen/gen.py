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
from shots import SHOTS, SPAN, DUEL_SHOTS
SHOT_AT = {}    # § -> [(clé, mouvement)]
def shot_key(path):
    # chapter17-s0x → c17_cg_*, chapter18-s0x → c18_cg_*
    return ('c18_cg_' if path.startswith('chapter18') else 'c17_cg_') + os.path.splitext(os.path.basename(path))[0]
for path, p, cam, _t, _d in SHOTS:
    assert p in N.P and p not in N.HEADINGS, path
    assert p not in SHOT_AT, f'deux plans sur le § {p}'
    SHOT_AT[p] = [(shot_key(path), cam)]
used_shots = set()

def chunk(ids_texts):
    # Regroupe les paragraphes par longueur (une scène = un écran de lecture).
    parts, cur, n = [], [], 0
    if sum(len(t) for _, t in ids_texts) <= LIMIT: return [ids_texts]
    for it in ids_texts:
        if cur and n + len(it[1]) > TARGET: parts.append(cur); cur, n = [], 0
        cur.append(it); n += len(it[1])
    if cur:
        if parts and sum(len(t) for _, t in cur) < 350: parts[-1] += cur
        else: parts.append(cur)
    return parts

def segments(ids_texts):
    # Découpe un passage en segments : décor + silhouettes, ou plan clé (CG) tenu jusqu’au plan suivant, au plus SPAN §.
    segs = []
    for it in ids_texts:
        i = it[0]
        if i in SHOT_AT:
            segs.append({'shots': SHOT_AT[i], 'items': [it]})
            used_shots.update(k for k, _ in SHOT_AT[i])
        elif segs and segs[-1]['shots'] and len(segs[-1]['items']) < SPAN:
            segs[-1]['items'].append(it)
        elif segs and not segs[-1]['shots']:
            segs[-1]['items'].append(it)
        else:
            segs.append({'shots': None, 'items': [it]})
    return segs

def emit(prefix):
    beats = [b for b in B if b['id'].startswith(prefix)]
    out = []
    for k, b in enumerate(beats):
        ids = [i for i in N.ids_between(b['a'], b['b']) if i not in N.HEADINGS]
        ids_texts = [(i, N.para(i)) for i in ids]
        parts = []   # (shots, items)
        for seg in segments(ids_texts):
            parts += [(seg['shots'], p) for p in chunk(seg['items'])]
        nxt_final = b['next'] or (beats[k + 1]['id'] if k + 1 < len(beats) else None)
        for j, (shots, part) in enumerate(parts):
            sid = b['id'] if j == 0 else f"{b['id']}_{j + 1}"
            nxt = nxt_final if j == len(parts) - 1 else f"{b['id']}_{j + 2}"
            text = '\n\n'.join(t for _, t in part)
            coverage.append((sid, [i for i, _ in part]))
            sub = json.dumps(b['sub'], ensure_ascii=False)
            if not shots:
                out.append(f"    {sid}: scene({sub}, {b['bg']}, {b['music']}, 'Narrateur',\n      {js_tpl(text)},\n      {json.dumps(nxt)}, {b['chars']}),\n")
                continue
            # Plan clé : l’illustration remplace le décor, les silhouettes s’effacent (moteur : décor /keyscenes/).
            # Les écrans suivants d’un même plan gardent le cadrage sans relancer le mouvement.
            key, cam = shots[0]
            extra = {'camera': cam} if part[0][0] in SHOT_AT else {}
            cam_js = f", camera: {json.dumps(extra['camera'])}" if extra else ''
            out.append(f"    {sid}: {{ ...scene({sub}, {json.dumps(key)}, {b['music']}, 'Narrateur',\n      {js_tpl(text)},\n      {json.dumps(nxt)}, []), hideChars: true{cam_js} }},\n")
    return ''.join(out)

CHAPTER_OF = {'c17_': 'chapter17', 'c18_': 'chapter18'}
def shots_js(prefix):
    rows = []
    for path, p, cam, title, desc in SHOTS + [(d[0], d[1], d[2], d[3], d[4]) for d in DUEL_SHOTS]:
        if not path.startswith(CHAPTER_OF.get(prefix, '-')): continue
        rows.append(f"    [{json.dumps(shot_key(path))}, {json.dumps('assets/images/keyscenes/' + path)}, {json.dumps(title, ensure_ascii=False)}, {json.dumps(desc, ensure_ascii=False)}],\n")
    return ''.join(rows)

LEGACY = json.load(open(os.path.join(HERE, 'legacy_coverage.json')))
def aliases_js(prefix):
    # Anciennes scènes (sauvegardes faites avant le découpage en plans) : elles pointent vers l’écran qui porte leur premier §.
    new_ids = {sid for sid, _ in coverage}
    where = {i: sid for sid, ids in coverage for i in ids}
    pairs = {sid: where[ids[0]] for sid, ids in LEGACY if sid.startswith(prefix) and sid not in new_ids}
    return '  // Anciens identifiants de scène (sauvegardes antérieures au découpage en plans clés).\n  Object.entries(' + json.dumps(pairs) + ').forEach(([o, n]) => { if (!S[o] && S[n]) S[o] = S[n]; });\n'

FILES = [('c17_', 'story-finale-s02.js', 'extra_c17.js'), ('c18_', 'story-finale-s06.js', 'extra_c18.js'), ('c19_', 'story-finale-s09.js', 'extra_c19.js')]
import shutil
shutil.copyfile(os.path.join(HERE, 'duels.js'), os.path.join(OUT, 'story-finale-duels.js'))
for prefix, name, extra in FILES:
    src = open(os.path.join(HERE, extra), encoding='utf-8').read()
    gen = emit(prefix)
    assert '/*@SCENES@*/' in src and '/*@ALIASES@*/' in src
    src = src.replace('/*@SCENES@*/\n', gen).replace('/*@ALIASES@*/\n', aliases_js(prefix))
    if '/*@SHOTS@*/' in src: src = src.replace('/*@SHOTS@*/\n', shots_js(prefix))
    if '/*@DUEL_SHOTS@*/' in src:
        src = src.replace('/*@DUEL_SHOTS@*/\n', ''.join(f"    [{json.dumps(sid)}, {json.dumps(shot_key(path))}, {json.dumps(cam)}],\n" for path, sid, cam, _t, _d in DUEL_SHOTS))
        used_shots.update(shot_key(d[0]) for d in DUEL_SHOTS)
    open(os.path.join(OUT, name), 'w', encoding='utf-8').write(src)
    print(name, len(gen), 'octets de scènes générées')

json.dump(coverage, open(os.path.join(HERE, 'coverage.json'), 'w'), ensure_ascii=False)
allp = [i for _, ids in coverage for i in ids]
expected = [i for i in sorted(N.P) if i not in N.HEADINGS]
miss = sorted(set(expected) - set(allp)); dup = len(allp) - len(set(allp))
print('paragraphes attendus', len(expected), 'couverts', len(set(allp)), 'manquants', len(miss), 'doublons', dup, 'scènes', len(coverage))
assert not miss and not dup
assert used_shots == {shot_key(p) for p, *_ in SHOTS} | {shot_key(d[0]) for d in DUEL_SHOTS}, 'plan non placé'
print('plans clés placés', len(used_shots))
