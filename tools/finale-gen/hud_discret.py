# HUD de duel discret (v0.426) : barre fine, détails repliables (▾), règles en icône (?), modes épuré/cinématique.
# Vérifie aux 3 formats Fold que la barre reste sous l'en-tête, hors des onglets et du centre de l'image,
# que ▾ déplie/replie (mémorisé, sans faire avancer la scène) et que ? ouvre le panneau de règles.
# Usage : PORT=8901 python3 hud_discret.py [dossier_captures]
import json, os, sys
from playwright.sync_api import sync_playwright
PORT = os.environ.get('PORT', '8894'); URL = f"http://127.0.0.1:{PORT}/index.html?cb=hudd"
OUT = sys.argv[1] if len(sys.argv) > 1 else None
BASE = {"s01AssaultComplete": True, "chapter15Complete": True, "chapter4DComplete": True, "c15WalkedWithDraven": True,
        "chapter13IComplete": True, "c13iHeldAmaneaWhole": True, "s02Adieu": "confiance", "s02Regard": "remerii", "s08Gardien": "rempart", "s08Sync": "ok", "s06Posture": "tenir"}
GEO = r"""()=>{ const R=BibliothequeAstrale.racine; const h=R.querySelector('.combat-hud'); const b=h.getBoundingClientRect();
  const tabs=[...R.querySelectorAll('.jeu-hud .dos-o')].map(x=>x.getBoundingClientRect()).filter(r=>r.width>0);
  const lieu=R.querySelector('.jeu-lieu')?.getBoundingClientRect();
  const hitTabs=tabs.some(t=>t.left<b.right&&t.right>b.left&&t.top<b.bottom&&t.bottom>b.top);
  const plus=h.querySelector('.fdPlus'); return {vis:!h.hidden&&b.height>8, bottom:b.bottom/innerHeight, hitTabs, sousEntete: !lieu || b.top>=lieu.bottom-2,
   ouvert:!!h.querySelector('.fdWrap.fdOuvert'), plusVisible: !!plus && plus.getBoundingClientRect().height>0, scene:state.scene}; }"""
fails = []
def ok(cond, msg):
    print(('OK ' if cond else 'KO ') + msg); (None if cond else fails.append(msg))
with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--mute-audio"])
    for W, H in [(1024, 880), (830, 525), (880, 1024)]:
        for sid in ['c18_bh_dragon', 'c18_dp_voute', 'c17_m4', 'c18_ip_renversement']:
            c = b.new_context(viewport={"width": W, "height": H}, has_touch=True)
            fl = dict(BASE); fl.update({"s04M1": "good", "s04M2": "good", "s04M3": "good", "s07Maitrise": "lire", "s07Garde": "esprit", "s07Flux": "accord"})
            save = {"scene": sid, "stats": {"audace": 3, "lien": 8}, "flags": fl, "inventory": [], "memories": [], "history": []}
            c.add_init_script("if(!sessionStorage.getItem('e2e')){sessionStorage.setItem('e2e','1');localStorage.setItem('sylvinia_ui_biblio_v1', JSON.stringify({skin:'biblio',sons:false}));localStorage.setItem('sylvinia_vn_v82', %s);}" % json.dumps(json.dumps(save)))
            pg = c.new_page(); pg.goto(URL); pg.wait_for_function("window.BibliothequeAstrale && window.SylviniaFinaleDuels"); pg.wait_for_timeout(1500)
            pg.evaluate("load()"); pg.wait_for_timeout(300)
            pg.evaluate("(sid)=>{ state.scene=sid; state.history=[]; setScreen('game'); render(); BibliothequeAstrale.aller('#/jeu'); }", sid); pg.wait_for_timeout(1400)
            pg.evaluate("()=>BibliothequeAstrale.racine.querySelectorAll('.fdRegles.on').forEach(x=>x.classList.remove('on'))")
            tag = f"{sid}@{W}x{H}"
            g = pg.evaluate(GEO)
            ok(g['vis'] and not g['ouvert'] and not g['plusVisible'], f"{tag} barre visible, détails repliés par défaut")
            ok(not g['hitTabs'] and g['sousEntete'], f"{tag} barre sous l'en-tête et hors des onglets")
            ok(g['bottom'] <= (0.235 if H < 600 else 0.16), f"{tag} barre limitée au bord haut (bas à {g['bottom']*100:.1f} %)")
            pg.evaluate("()=>BibliothequeAstrale.racine.querySelector('.combat-hud [data-fdmore].fdMoreBtn').click()"); pg.wait_for_timeout(400)
            g2 = pg.evaluate(GEO)
            ok(g2['ouvert'] and g2['plusVisible'] and g2['scene'] == sid and pg.evaluate("localStorage.getItem('sylvinia_fd_hud_details')") == '1', f"{tag} ▾ déplie les détails sans avancer")
            if OUT and W == 1024: pg.screenshot(path=f"{OUT}/details_{sid}_{W}x{H}.png")
            pg.evaluate("()=>BibliothequeAstrale.racine.querySelector('.combat-hud .fdGuide[data-fdmore]').click()"); pg.wait_for_timeout(400)
            g3 = pg.evaluate(GEO)
            ok(not g3['ouvert'] and g3['scene'] == sid, f"{tag} toucher la consigne replie")
            pg.evaluate("()=>BibliothequeAstrale.racine.querySelector('.combat-hud [data-fdrules]').click()"); pg.wait_for_timeout(500)
            ok(pg.evaluate("()=>!!BibliothequeAstrale.racine.querySelector('.fdRegles.on')"), f"{tag} ? ouvre les règles")
            pg.evaluate("()=>BibliothequeAstrale.racine.querySelector('.fdRegles.on [data-fdgo]')?.click()"); pg.wait_for_timeout(300)
            if sid == 'c18_bh_dragon':
                for mode in ['epuree', 'cine']:
                    pg.keyboard.press('h'); pg.wait_for_timeout(600)
                    g4 = pg.evaluate(GEO)
                    ok(g4['vis'] and not g4['hitTabs'] and g4['bottom'] <= 0.235, f"{tag} mode {mode} : barre visible, hors onglets")
                    if OUT: pg.screenshot(path=f"{OUT}/mode_{mode}_{sid}_{W}x{H}.png")
                pg.keyboard.press('h'); pg.wait_for_timeout(300)
            c.close()
    # Règles ouvertes d'elles-mêmes à l'entrée de chaque duel (arrivée par go(), comme en jeu).
    for d, first in [('s04', 'c17_duel_intro'), ('s06', 'c18_dp_crevasse'), ('s07', 'c18_ip_maitrise'), ('s08', 'c18_bh_blizzard')]:
        c = b.new_context(viewport={"width": 1024, "height": 880}, has_touch=True)
        prev = 'c17_marche' if d == 's04' else 'c18_draven_seul' if d == 's06' else 'c18_alamma' if d == 's07' else 'c18_remerii_tombe'
        save = {"scene": prev, "stats": {"audace": 3, "lien": 8}, "flags": BASE, "inventory": [], "memories": [], "history": []}
        c.add_init_script("if(!sessionStorage.getItem('e2e')){sessionStorage.setItem('e2e','1');localStorage.setItem('sylvinia_ui_biblio_v1', JSON.stringify({skin:'biblio',sons:false}));localStorage.setItem('sylvinia_vn_v82', %s);}" % json.dumps(json.dumps(save)))
        pg = c.new_page(); pg.goto(URL); pg.wait_for_function("window.BibliothequeAstrale && window.SylviniaFinaleDuels"); pg.wait_for_timeout(1500)
        pg.evaluate("load()"); pg.wait_for_timeout(300)
        pg.evaluate("(sid)=>{ state.scene=sid; state.history=[]; setScreen('game'); render(); BibliothequeAstrale.aller('#/jeu'); }", prev); pg.wait_for_timeout(1500)
        pg.evaluate("(sid)=>go(sid)", first); pg.wait_for_timeout(2600)
        r = pg.evaluate("()=>({s:state.scene, on:!!BibliothequeAstrale.racine.querySelector('.fdRegles.on'), hud:!!BibliothequeAstrale.racine.querySelector('.combat-hud:not([hidden]) .fdWrap')})")
        ok(r['s'] == first and r['on'] and r['hud'], f"{d} règles ouvertes à l'entrée du duel ({first}) et barre affichée")
        if OUT and d == 's08': pg.screenshot(path=f"{OUT}/regles_auto_{d}_1024x880.png")
        c.close()
    b.close()
print('RESULTAT', 'OK' if not fails else f'KO ({len(fails)})')
sys.exit(0 if not fails else 1)
