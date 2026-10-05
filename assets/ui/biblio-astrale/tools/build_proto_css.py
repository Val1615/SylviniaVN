"""Importe la feuille du prototype « Bibliothèque astrale » telle quelle dans le Shadow DOM.
Seules réécritures : :root / html / body  ->  .pbody  (le <div class="pbody"> joue le rôle du <body> du proto).
usage : python3 tools/build_proto_css.py /workspace/vn-redesign/proto/styles.css > proto.css"""
import re, sys
src = re.sub(r"/\*.*?\*/", "", open(sys.argv[1], encoding="utf-8").read(), flags=re.S)
def sel(s):
    s2 = s.strip()
    if not s2: return s
    lead = s[:len(s) - len(s.lstrip())]
    s2 = re.sub(r'^:root\b', '.pbody', s2)
    s2 = re.sub(r'^html\b', '.pbody', s2)
    s2 = re.sub(r'^body(?![\w-])', '.pbody', s2)
    return lead + s2
def prelude(p):
    if p.lstrip().startswith('@'): return p
    parts = p.split(',')
    out = [sel(x) for x in parts]
    # html,body -> .pbody,.pbody : dédoublonner
    seen, res = set(), []
    for x in out:
        k = x.strip()
        if k in seen: continue
        seen.add(k); res.append(x)
    return ','.join(res)
out = re.sub(r'([^{}]+)\{', lambda m: prelude(m.group(1)) + '{', src)
sys.stdout.write("/* GÉNÉRÉ depuis proto/styles.css par tools/build_proto_css.py — ne pas éditer à la main */\n" + out)
