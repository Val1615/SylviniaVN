import sys, json
from playwright.sync_api import sync_playwright
W,H=int(sys.argv[1]),int(sys.argv[2])
with sync_playwright() as p:
    b=p.chromium.launch(executable_path="/usr/bin/google-chrome",args=["--mute-audio"]); c=b.new_context(viewport={"width":W,"height":H},has_touch=True)
    flags={"s01AssaultComplete":True,"chapter4DComplete":True,"c15WalkedWithDraven":True,"chapter13IComplete":True,"c13iHeldAmaneaWhole":True,"s04M1":"good","s04M2":"good","s04M3":"mid","s04M4":"good"}
    save={"scene":"c16_s01_fin","stats":{"audace":3},"flags":flags,"inventory":[],"memories":[],"history":[]}
    c.add_init_script("localStorage.setItem('sylvinia_ui_biblio_v1', JSON.stringify({skin:'biblio'}));localStorage.setItem('sylvinia_vn_v82', %s);" % json.dumps(json.dumps(save)))
    pg=c.new_page(); pg.goto("http://127.0.0.1:8893/index.html?cb=c"); pg.wait_for_function("window.BibliothequeAstrale"); pg.wait_for_timeout(2500)
    pg.evaluate("load()")
    ids=pg.evaluate("Object.keys(S).filter(k=>/^c1[789]_/.test(k) && (S[k].choices||[]).length)")
    res=[]
    for sid in ids:
        pg.evaluate("(sid)=>{state.scene=sid; state.history=[]; setScreen('game'); render(); BibliothequeAstrale.aller('#/jeu');}",sid)
        pg.wait_for_timeout(300)
        for _ in range(8): pg.evaluate("BibliothequeAstrale.racine.querySelector('.jeu').click()"); pg.wait_for_timeout(120)
        pg.wait_for_timeout(700)
        m=pg.evaluate("""()=>{const R=BibliothequeAstrale.racine; const t=R.querySelector('.dlg-texte'); const corps=R.querySelector('.dlg-corps').getBoundingClientRect(); const ps=[...t.querySelectorAll('.para')]; const last=ps[ps.length-1];
          const ch=R.querySelector('.choix'); return {cut: last?Math.round(last.getBoundingClientRect().bottom-corps.bottom):0, choix: ch && !ch.hidden ? ch.querySelectorAll('.ch').length : 0, txt:t.textContent.slice(0,60)}}""")
        res.append([sid,m]); pg.screenshot(path=f"/tmp/ch_{W}x{H}_{sid}.png")
    print(json.dumps(res,ensure_ascii=False,indent=0))
    b.close()
