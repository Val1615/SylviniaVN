# Mise en avant du locuteur, page par page, dans l'interface Bibliothèque (scènes générées du final).
# Pour chaque écran choisi, on tourne les pages : quand la page porte la réplique d'un personnage visible,
# sa silhouette doit avoir .parle, être agrandie (scale > 1, rapportée à l'échelle propre du sprite) et passer
# devant ; les autres reculent (scale < 1).
import json, os, sys
from playwright.sync_api import sync_playwright
PORT = os.environ.get('PORT', '8894'); URL = f"http://127.0.0.1:{PORT}/index.html?cb=loc"
SCENES = ['c17_joute', 'c17_saidin_2', 'c17_fuyards_2', 'c17_fermer_3', 'c17_va_3', 'c18_soeur_en_deuil', 'c18_fuir', 'c18_nebuleuse', 'c18_ne_me_laisse_pas', 'c19_saidin']
PROBE = r"""()=>{ const R=BibliothequeAstrale.racine; const t=R.querySelector('.dlg-texte')?.textContent||''; const nom=R.querySelector('.plaque-nom .nom')?.textContent||'';
  const sp=[...R.querySelectorAll('.sprites .sprite')].map(im=>({cls:im.className, parle:im.classList.contains('parle'), scale:(parseFloat(getComputedStyle(im).scale)||1)/(parseFloat(getComputedStyle(im).getPropertyValue('--finale-k'))||1), z:getComputedStyle(im).zIndex}));
  const v=(S[state.scene].voices||[]).filter(([d])=>t.replace(/\s+/g,' ').includes(d.replace(/\s+/g,' ').slice(0,30))).map(x=>x[1]);
  return {id:state.scene, nom, v, sp, plein:!!R.querySelector('.dlg.plein')}; }"""
fails = []; checked = 0
with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--mute-audio"])
    c = b.new_context(viewport={"width": 1024, "height": 880})
    save = {"scene": SCENES[0], "stats": {}, "flags": {}, "inventory": [], "memories": [], "history": []}
    c.add_init_script("if(!sessionStorage.getItem('e2e')){sessionStorage.setItem('e2e','1');localStorage.setItem('sylvinia_ui_biblio_v1', JSON.stringify({skin:'biblio',sons:false}));localStorage.setItem('sylvinia_vn_v82', %s);}" % json.dumps(json.dumps(save)))
    pg = c.new_page(); pg.goto(URL); pg.wait_for_function("window.BibliothequeAstrale"); pg.wait_for_timeout(2000); pg.evaluate("load()")
    for sid in SCENES:
        pg.evaluate("(sid)=>{ state.scene=sid; state.history=[]; setScreen('game'); render(); BibliothequeAstrale.aller('#/jeu'); }", sid); pg.wait_for_timeout(1300)
        for _ in range(16):
            pg.evaluate("()=>{const R=BibliothequeAstrale.racine; if(!R.querySelector('.dlg.plein')) R.querySelector('.jeu').click();}"); pg.wait_for_timeout(650)
            r = pg.evaluate(PROBE)
            if r['id'] != sid: break
            kinds = {n: [s for s in r['sp'] if n.lower().replace('ï', 'i') in s['cls'].split()] for n in r['v']}
            vis = [n for n in r['v'] if kinds[n]]
            if vis:
                checked += 1
                who = vis[-1]; me = kinds[who][0]; others = [s for s in r['sp'] if s is not me]
                ok = me['parle'] and me['scale'] > 1.0 and all((not o['parle']) and o['scale'] < 1.0 for o in others) and r['nom'] == who
                if not ok: fails.append((sid, who, r['nom'], r['sp']))
            pg.evaluate("()=>BibliothequeAstrale.racine.querySelector('.jeu').click()"); pg.wait_for_timeout(500)
    b.close()
print('pages avec réplique vérifiées', checked, 'échecs', len(fails))
for f in fails[:10]: print('  KO', f)
sys.exit(0 if checked >= 10 and not fails else 1)
