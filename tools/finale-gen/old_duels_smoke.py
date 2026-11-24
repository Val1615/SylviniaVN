# Non-régression : duels natifs des chapitres précédents (rendu combatMode, en-tête d'Hylee inchangé, pas d'erreur).
import json, os
from playwright.sync_api import sync_playwright
URL = f"http://127.0.0.1:{os.environ.get('PORT','8894')}/index.html?cb=old"
with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--mute-audio"])
    c = b.new_context(viewport={"width": 1024, "height": 880}); errs = []
    c.add_init_script("localStorage.setItem('sylvinia_ui_biblio_v1', JSON.stringify({skin:'biblio',sons:false}))")
    pg = c.new_page(); pg.on("pageerror", lambda e: errs.append(str(e)[:200]))
    pg.goto(URL); pg.wait_for_function("window.SylviniaFinaleDuels"); pg.wait_for_timeout(2500)
    ids = pg.evaluate("Object.keys(S).filter(k=>['c3_22','c5_sage_start','c7_duel_01','c12g_game_over','c1_01','c10_01'].includes(k) || /^c12g_duel/.test(k)).slice(0,8)")
    out = []
    for sid in ids:
        pg.evaluate("(s)=>{state.devMode=true; state.scene=s; state.history=[]; setScreen('game'); render(); BibliothequeAstrale.aller('#/jeu');}", sid); pg.wait_for_timeout(1800)
        for _ in range(8): pg.evaluate("BibliothequeAstrale.racine.querySelector('.jeu')?.click()"); pg.wait_for_timeout(120)
        pg.wait_for_timeout(400)
        out.append(pg.evaluate("(s)=>({s, combat: document.getElementById('stage').classList.contains('combatMode'), fd: document.getElementById('stage').classList.contains('fdActive'), header: BibliothequeAstrale.racine.querySelector('.choix .question')?.textContent.trim()||''})", sid))
    print(json.dumps(out, ensure_ascii=False, indent=0)); print("pageerrors", errs)
    assert not any(o['fd'] for o in out) and all('Valurn' not in o['header'] and 'Draven' not in o['header'] for o in out)
    b.close()
