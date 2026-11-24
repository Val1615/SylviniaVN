# Persistance du HUD de combat sur toute la durée de chaque duel du final (interface Bibliothèque).
# Joue chaque duel de bout en bout en cliquant comme un joueur (meilleur choix, QTE réussi), échantillonne
# l'interface toutes les 80 ms et vérifie qu'entre la première et la dernière scène de duel, le HUD
# (.combat-hud) reste visible et rempli, et qu'un panneau de règles et une consigne de tour existent.
# Usage : PORT=8898 python3 hud_persist.py [sortie.json]   (VIDEO=dossier pour enregistrer une vidéo par duel)
import json, os, sys
from playwright.sync_api import sync_playwright
PORT = os.environ.get('PORT', '8898'); URL = f"http://127.0.0.1:{PORT}/index.html?cb=hud"
OUT = sys.argv[1] if len(sys.argv) > 1 else '/tmp/hud_persist.json'
VIDEO = os.environ.get('VIDEO'); W, H = [int(x) for x in os.environ.get('SIZE', '1024x880').split('x')]
BASE = {"s01AssaultComplete": True, "chapter15Complete": True, "chapter4DComplete": True, "c15WalkedWithDraven": True,
        "chapter13IComplete": True, "c13iHeldAmaneaWhole": True, "s02Adieu": "confiance", "s02Regard": "remerii",
        "finaleSeenDraven": False, "finaleSeenIriana": False}
DUELS = [('s04', 'c17_duel_intro', ['c17_duel_bilan', 'c17_trois']),
         ('s06', 'c18_dp_intro', ['c18_s06_fin']),
         ('s07', 'c18_ip_intro', ['c18_s07_fin']),
         ('s08', 'c18_bh_blizzard', ['c18_remerii_tombe'])]
ONLY = os.environ.get('ONLY')
PROBE = r"""()=>{ window.__probe=[]; clearInterval(window.__probeT); window.__probeT=setInterval(()=>{ try{
  const R=BibliothequeAstrale.racine; const h=R.querySelector('.combat-hud'); const s=S[state.scene]||{};
  const vis=!!h && !h.hidden && h.getBoundingClientRect().height>8 && getComputedStyle(h).visibility!=='hidden' && parseFloat(getComputedStyle(h).opacity)>0.2;
  window.__probe.push({t:Date.now(), id:state.scene, d:s.fduel||null, vis, txt:vis? h.textContent.replace(/\s+/g,' ').trim().slice(0,90):'',
    passe:document.body.classList.contains('ba-passe'), veil:!!document.querySelector('#combatTransition.active'),
    regles:!!R.querySelector('.fdRegles.on'), guide:!!(h&&h.querySelector('.fdGuide'))}); }catch(e){} },80); }"""
def page(b, flags, scene):
    kw = dict(viewport={"width": W, "height": H}, has_touch=True)
    if VIDEO: kw['record_video_dir'] = VIDEO; kw['record_video_size'] = {"width": W, "height": H}
    c = b.new_context(**kw)
    save = {"scene": scene, "stats": {"audace": 3, "lien": 8}, "flags": flags, "inventory": [], "memories": [], "history": []}
    c.add_init_script("if(!sessionStorage.getItem('e2e')){sessionStorage.setItem('e2e','1');localStorage.setItem('sylvinia_ui_biblio_v1', JSON.stringify({skin:'biblio',sons:false}));localStorage.setItem('sylvinia_vn_v82', %s);}" % json.dumps(json.dumps(save)))
    pg = c.new_page(); pg.goto(URL); pg.wait_for_function("window.BibliothequeAstrale && window.SylviniaFinaleDuels"); pg.wait_for_timeout(2000)
    pg.evaluate("load()"); pg.wait_for_timeout(300)
    # Entrée dans le duel par go() depuis un écran du roman, comme en jeu (le panneau de règles s'ouvre alors à coup sûr).
    pg.evaluate("()=>{ state.scene='c17_marche'; state.history=[]; setScreen('game'); render(); BibliothequeAstrale.aller('#/jeu'); }"); pg.wait_for_timeout(1200)
    pg.evaluate("(sid)=>go(sid)", scene); pg.wait_for_timeout(200)
    return c, pg
STEP = r"""()=>{ const R=BibliothequeAstrale.racine;
  if(document.querySelector('#combatTransition.active')) return 'veil';
  const rg=R.querySelector('.fdRegles.on'); if(rg){ const b=rg.querySelector('[data-fdgo]'); if(b){ b.click(); return 'regles'; } }
  const ch=R.querySelector('.choix'); if(ch && !ch.hidden){ const s=S[state.scene]||{}; let L=[]; try{L=(typeof s.choices==='function'?s.choices():s.choices)||[]}catch(e){}
    const best=L.find(c=>c&&c.best) ; const btns=[...ch.querySelectorAll('.ch:not(.verrou)')];
    const b=(best&&btns.find(x=>x.textContent.includes(best.label.replace(/^⚡\s*/,'').slice(0,18))))||btns[0]; if(b){ b.click(); return 'choix'; } }
  R.querySelector('.jeu')?.click(); return 'clic'; }"""
res = {}
with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--mute-audio"])
    for d, start, ends in DUELS:
        if ONLY and d not in ONLY.split(','): continue
        flags = dict(BASE)
        if d == 's04': flags.update({})
        c, pg = page(b, flags, start); pg.evaluate(PROBE); pg.wait_for_timeout(2400)  # laisser le panneau de règles s'ouvrir (1,15 s après une intro), comme un joueur qui lit
        seen = []; n = 0
        while n < 500:
            n += 1
            sc = pg.evaluate("state.scene")
            if not seen or seen[-1] != sc: seen.append(sc)
            if sc in ends: pg.wait_for_timeout(600); break
            pg.evaluate(STEP); pg.wait_for_timeout(260 if not VIDEO else 520)
        probe = pg.evaluate("window.__probe")
        if VIDEO: pg.wait_for_timeout(500)
        vpath = pg.video.path() if VIDEO else None
        c.close()
        idx = [i for i, x in enumerate(probe) if x['d'] == d]
        arc = probe[idx[0]: idx[-1] + 1] if idx else []
        holes = [x for x in arc if not x['vis'] and not x['veil'] and not x['passe']]
        # trous consécutifs > 160 ms = disparition perceptible
        gaps, cur = [], []
        for x in arc:
            if not x['vis'] and not x['veil'] and not x['passe']: cur.append(x)
            else:
                if cur and cur[-1]['t'] - cur[0]['t'] >= 160: gaps.append((cur[0]['id'], cur[-1]['id'], cur[-1]['t'] - cur[0]['t']))
                cur = []
        if cur and cur[-1]['t'] - cur[0]['t'] >= 160: gaps.append((cur[0]['id'], cur[-1]['id'], cur[-1]['t'] - cur[0]['t']))
        arc_ids = []
        for x in arc:
            if not arc_ids or arc_ids[-1] != x['id']: arc_ids.append(x['id'])
        hidden_scenes = sorted({x['id'] for x in holes})
        res[d] = dict(scenes=seen, arc_scenes=len(arc_ids), samples=len(arc), hidden_samples=len(holes), gaps=gaps,
                      hidden_scenes=hidden_scenes, regles=any(x['regles'] for x in probe), guide=any(x['guide'] for x in arc),
                      reached_end=seen[-1] in ends, video=vpath)
        r = res[d]
        print(f"{d}: fin atteinte {r['reached_end']} · scènes dans l'arc {r['arc_scenes']} · échantillons {r['samples']} · HUD absent {r['hidden_samples']} · coupures {len(gaps)} · règles {r['regles']} · consigne {r['guide']}")
        for g in gaps[:12]: print('   coupure', g)
    b.close()
json.dump(res, open(OUT, 'w'), ensure_ascii=False, indent=1)
ok = all(r['reached_end'] and not r['gaps'] and r['regles'] and r['guide'] for r in res.values())
print('RESULTAT', 'OK' if ok else 'KO')
sys.exit(0 if ok else 1)
