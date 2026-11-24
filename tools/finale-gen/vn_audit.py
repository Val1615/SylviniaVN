# Audit des écrans du final (Chapitres XVII, XVIII, Épilogue) : fond nu, réplique et mise en avant du locuteur.
# Usage : PORT=8894 python3 vn_audit.py [sortie.json]   (échec si un écran n’a ni silhouette ni plan clé,
# ou si une réplique d’un personnage qui a un sprite ne met personne en avant)
import json, os, sys
from playwright.sync_api import sync_playwright
PORT=os.environ.get('PORT','8894'); OUT=sys.argv[1] if len(sys.argv)>1 else '/tmp/audit.json'
PREFIX=os.environ.get('PREFIX','^c1[789]_')
# Personnages sans sprite dans le final (Amanea après sa métamorphose : plans clés uniquement).
SANS_SPRITE={'alamma','bhaal','demendras','ellion','lineva'}
JS=r"""(pre)=>{
 const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').split(/[\s·,(]+/)[0];
 const ids=Object.keys(S).filter(k=>new RegExp(pre).test(k)&&S[k]&&typeof S[k]==='object');
 const out=[];
 for(const id of ids){const s=S[id]; let chars=s.chars; try{if(typeof chars==='function')chars=chars();}catch(e){chars=[]}
  chars=Array.isArray(chars)?chars:[];
  let text=''; try{text=typeof s.text==='function'?s.text():s.text}catch(e){}
  text=String(text||'');
  const src=A[s.bg]||''; const cg=/keyscenes\//.test(src)||!!s.cinema||!!s.video;
  const shown=s.hideChars?[]:chars;
  const kinds=shown.map(c=>c[0]);
  const dlg=/«/.test(text);
  const voices=(s.voices||[]).map(v=>v[1]);
  const sp=norm(s.speaker);
  const spk=(sp&&sp!=='narrateur'&&sp!=='narration')?[sp]:[];
  const all=[...spk,...voices.map(norm)];
  out.push({id,cg,nchars:shown.length,kinds,duel:!!s.fduel,dlg,speaker:s.speaker,voices:all,
    highlighted:all.some(k=>kinds.includes(k)),bg:s.bg});}
 return out;}"""
with sync_playwright() as p:
    b=p.chromium.launch(executable_path="/usr/bin/google-chrome",args=["--mute-audio"])
    pg=b.new_page(); pg.goto(f"http://127.0.0.1:{PORT}/index.html?cb=audit"); pg.wait_for_function("window.BibliothequeAstrale",timeout=120000); pg.wait_for_timeout(2500)
    rows=pg.evaluate(JS, PREFIX); b.close()
def categorie(r):
    if not r['dlg']: return None
    if r['highlighted']: return 'mis_en_avant'
    if r['cg']: return 'plan_cle'
    if r['voices'] and all(v in SANS_SPRITE or v=='amanea' for v in r['voices']): return 'sans_sprite'
    return 'echec'
for r in rows: r['cat']=categorie(r)
json.dump(rows,open(OUT,'w'),ensure_ascii=False,indent=0)
nu=[r for r in rows if not r['cg'] and r['nchars']==0]
dl=[r for r in rows if r['dlg']]
from collections import Counter
c=Counter(r['cat'] for r in dl)
print(f"écrans {len(rows)} · fond nu {len(nu)} · écrans avec réplique {len(dl)} · locuteur mis en avant {c['mis_en_avant']} · réplique sur plan clé {c['plan_cle']} · locuteur sans sprite {c['sans_sprite']} · échecs {c['echec']}")
for r in nu: print('  fond nu', r['id'], r['bg'])
for r in dl:
    if r['cat']=='echec': print('  échec', r['id'], r['kinds'], r['voices'])

sys.exit(0 if not nu and not c['echec'] else 1)
