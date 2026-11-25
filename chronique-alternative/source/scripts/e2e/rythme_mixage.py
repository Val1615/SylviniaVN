"""Jeu de rythme v5 : menu de mixage et bruits corporels neutres.
Ouvre le mixage avant le lancement, règle voix et ambiance, active les bruits neutres, joue (lecture auto, horloge
Playwright) jusqu'à la pénétration et vérifie qu'aucun bruit corporel enregistré ne joue ; puis pause, mixage
en pause, retour aux bruits réels en direct, musique coupée, et réglages relus après rechargement.
Usage : CA_BASE=... python3 rythme_mixage.py saves/save-rythme.json <dossier> 1024x880 [toucher]"""
import os, sys, asyncio, json
from playwright.async_api import async_playwright
from common import *
SAVE=open(sys.argv[1]).read(); OUT=sys.argv[2]; VP=sys.argv[3]; TOUCH=len(sys.argv)>4 and sys.argv[4]=="toucher"
W,H=[int(x) for x in VP.rstrip("t").split("x")]
os.makedirs(OUT, exist_ok=True)
CORPS=["peau","humide","glisse","succion","lechage"]
async def main():
  async with async_playwright() as pw:
    b=await pw.chromium.launch(executable_path=os.environ.get("CA_CHROME") or None, args=["--autoplay-policy=no-user-gesture-required"])
    ctx=await b.new_context(viewport={"width":W,"height":H},has_touch=TOUCH,is_mobile=TOUCH)
    await ctx.add_init_script("if(!sessionStorage.getItem('seeded')){localStorage.setItem('sylvinia-liens-autosave',%s);localStorage.removeItem('sylvinia_ca_rythme_v1');localStorage.setItem('sylvinia_ca_rythme_prefs_v1',JSON.stringify({auto:true,difficulty:'normal'}));sessionStorage.setItem('seeded','1')}"%json.dumps(SAVE))
    p=await ctx.new_page(); errs=[]; hook(p,errs); p.set_default_timeout(9000)
    rep={"viewport":VP}; ok=True
    def check(name,cond,detail=None):
        nonlocal ok
        rep.setdefault("checks",[]).append([name,bool(cond),detail]); ok=ok and bool(cond); print(("OK " if cond else "KO ")+name, detail if detail is not None else "", flush=True)
    async def blur():
        await p.evaluate("""()=>{document.querySelectorAll('.intimacy-cg img, img[data-sprite-channel=intimate]').forEach(i=>{i.style.filter='blur(12px) brightness(.62) saturate(.55)';});}""")
    async def open_dev():
        await p.goto(BASE); await p.wait_for_timeout(900); await p.keyboard.press("Enter"); await p.wait_for_timeout(900)
        await p.click(".t-item.principal"); await p.wait_for_timeout(2000); await close_modals(p)
        for i in range(4):
            if await p.locator("dialog[open], .modal-backdrop").count()==0: break
            await p.keyboard.press("Escape"); await p.wait_for_timeout(300)
        await p.keyboard.press("Escape"); await p.wait_for_timeout(600)
        await p.locator("dialog[open] button:has-text('Options'), button:has-text('Options')").first.click(); await p.wait_for_timeout(700)
        await p.locator(".opt-cat:has-text('Session'), [data-otab=session]").first.click(); await p.wait_for_timeout(500)
        await p.locator("#caDevRythme").click(); await p.wait_for_timeout(1500)
    async def panel_fit(tag):
        box=await p.evaluate("""()=>{const d=document.querySelector('.rythme-panneau'); const m=document.querySelector('.rythme-mixage'); const r=d.getBoundingClientRect(); const s=m.getBoundingClientRect();
          const rows=[...m.querySelectorAll('.rythme-piste-mix')].map(x=>{const b=x.getBoundingClientRect(); const i=x.querySelector('input').getBoundingClientRect(); const k=x.querySelector('.rythme-muet').getBoundingClientRect(); return {w:b.width, slider:i.width, muteRight:k.right, rowRight:b.right};});
          return {panel:[r.top,r.bottom,r.left,r.right], mix:[s.top,s.bottom], scrollH:d.scrollHeight, clientH:d.clientHeight, rows, vw:innerWidth, vh:innerHeight};}""")
        rep[tag]=box
        check(f"{tag} : panneau dans l'écran", box["panel"][0]>=0 and box["panel"][1]<=box["vh"]+0.5 and box["panel"][2]>=0 and box["panel"][3]<=box["vw"]+0.5, box["panel"])
        check(f"{tag} : 5 pistes, curseurs utilisables, boutons muets visibles", len(box["rows"])==5 and all(r["slider"]>=50 and r["muteRight"]<=r["rowRight"]+1 for r in box["rows"]), [round(r["slider"]) for r in box["rows"]])
    await open_dev()
    # Avant le lancement : mixage replié par défaut, puis ouvert.
    check("mixage replié par défaut", await p.locator(".rythme-mixage[open]").count()==0)
    await p.locator(".rythme-mixage summary").click(); await p.wait_for_timeout(300)
    voix=p.locator(".rythme-piste-mix[data-bus=voix] input"); await voix.focus()
    for i in range(10): await p.keyboard.press("ArrowLeft")
    await p.locator(".rythme-piste-mix[data-bus=ambiance] .rythme-muet").click()
    await p.locator(".rythme-case.neutre input").check(); await p.wait_for_timeout(200)
    await p.locator(".rythme-mixage").scroll_into_view_if_needed()
    await blur(); await p.screenshot(path=f"{OUT}/{VP}-mixage-1-avant.png")
    await panel_fit("avant")
    prefs=await p.evaluate("()=>JSON.parse(localStorage.getItem('sylvinia_ca_rythme_prefs_v1'))")
    check("réglages mémorisés au fil de l'eau", prefs["mix"]["voix"]==0.4 and prefs["mute"]["ambiance"] and prefs["neutral"], {"voix":prefs["mix"]["voix"],"ambiance":prefs["mute"]["ambiance"],"neutre":prefs["neutral"]})
    await p.clock.install()
    await p.locator(".rythme-actions button:has-text('Commencer')").click(); await p.wait_for_timeout(300)
    await p.clock.pause_at((await p.evaluate("()=>Date.now()")+50)/1000)
    async def go(target):
        for i in range(60000):
            if await p.evaluate("()=>window.__sylviniaRythme.time()")>=target: return
            await p.clock.run_for(20)
    defs=await p.evaluate("()=>window.__sylviniaRythme.sections()")
    notes=await p.evaluate("()=>window.__sylviniaRythme.notes().map(n=>({t:n.time,s:n.section}))")
    pen=next(i for i,d in enumerate(defs) if d["gesture"]=="penetration")
    t_pen=[n["t"] for n in notes if n["s"]==pen][6]
    await go(t_pen)
    s=await p.evaluate("()=>window.__sylviniaRythme.sfx()")
    rep["neutre"]=s
    check("bruits neutres : aucun bruit corporel enregistré", not any(s["played"].get(g) for g in CORPS+["bouche","langue"]), {g:s["played"].get(g) for g in CORPS})
    check("bruits neutres : battement, feutre, tic et souffle joués", all(s["played"].get("neutre-"+k,0)>0 for k in ["battement","feutre","tic","souffle"]), {k:s["played"].get("neutre-"+k) for k in ["battement","feutre","tic","souffle"]})
    check("mixage appliqué : voix 40 %, ambiance muette", abs(s["bus"]["voix"]-0.4)<1e-6 and s["bus"]["ambiance"]==0 and s["bus"]["corps"]>0, s["bus"])
    # Pause : le même mixage est accessible.
    await p.locator(".rythme-pause").click(); await p.clock.run_for(300)
    check("mixage présent en pause", await p.locator(".rythme-panneau.pause .rythme-mixage").count()==1)
    if await p.locator(".rythme-panneau.pause .rythme-mixage[open]").count()==0: await p.locator(".rythme-panneau.pause .rythme-mixage summary").click()
    await p.locator(".rythme-piste-mix[data-bus=musique] .rythme-muet").click()
    await p.locator(".rythme-panneau.pause .rythme-mixage").scroll_into_view_if_needed()
    await blur(); await p.clock.run_for(50); await p.screenshot(path=f"{OUT}/{VP}-mixage-2-pause.png")
    await panel_fit("pause")
    m=await p.evaluate("()=>window.__sylviniaRythme.music()")
    check("musique muette", m["volume"] in (0,None), m)
    await p.locator(".rythme-case.neutre input").uncheck(); await p.locator(".rythme-panneau.pause button:has-text('Reprendre')").first.click()
    before=(await p.evaluate("()=>window.__sylviniaRythme.sfx()"))["played"].get("peau",0)
    await go(t_pen+8)
    s2=await p.evaluate("()=>window.__sylviniaRythme.sfx()")
    check("retour aux bruits réels en direct", s2["played"].get("peau",0)>before and s2["neutral"] is False, s2["played"].get("peau"))
    await p.clock.resume()
    # Rechargement : réglages relus.
    await p.reload(); await p.wait_for_timeout(1500)
    prefs=await p.evaluate("()=>JSON.parse(localStorage.getItem('sylvinia_ca_rythme_prefs_v1'))")
    check("réglages relus après rechargement", prefs["mix"]["voix"]==0.4 and prefs["mute"]["ambiance"] and prefs["mute"]["musique"] and prefs["neutral"] is False, prefs)
    rep["errors"]=[e for e in errs if "favicon" not in e[1] and "chroniques-alternatives-theme" not in e[1] and "studio" not in e[1]][:6]
    rep["ok"]=ok
    json.dump(rep,open(f"{OUT}/{VP}-mixage.json","w"),ensure_ascii=False,indent=1)
    await b.close()
    sys.exit(0 if ok else 1)
asyncio.run(main())
