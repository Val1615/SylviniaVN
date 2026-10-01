import os, asyncio, json
from playwright.async_api import async_playwright
from common import *
SAVE=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),"saves","baseline-save-advanced.json")).read()
OUT=f"{SHOTS}/flow"
# Fiche centrée sur le personnage : pas de bandeau, sélecteur ‹ n/N ›, glisser sur le portrait, Échap = Liens.
async def run(pw, w, h, touch):
    b=await pw.chromium.launch(); ctx=await b.new_context(viewport={"width":w,"height":h}, has_touch=touch, is_mobile=touch)
    await ctx.add_init_script("if(!sessionStorage.getItem('seeded')){localStorage.setItem('sylvinia-liens-autosave',%s);sessionStorage.setItem('seeded','1')}"%json.dumps(SAVE))
    p=await ctx.new_page(); errs=[]; hook(p,errs); p.set_default_timeout(6000)
    await p.goto(BASE); await p.wait_for_timeout(1000)
    await p.keyboard.press("Enter"); await p.wait_for_timeout(1000)
    await p.click(".t-item.principal"); await p.wait_for_timeout(2000)
    await close_modals(p, [])
    liens=p.locator(".hud-onglets .onglet:visible").nth(2) if w>760 else p.locator(".nav-mobile button:visible:has-text('Liens')").first
    await liens.click(); await p.wait_for_timeout(700)
    await p.locator(".lien-carte").first.click(); await p.wait_for_timeout(900)
    name=lambda: p.locator(".fiche-panneau h1").inner_text()
    n0=await name(); assert await p.locator(".fiche-defil").count()==0, "bandeau encore présent"
    compteur=await p.locator(".fiche-pas span").inner_text()
    await p.click(".fiche-pas button >> nth=1"); await p.wait_for_timeout(700); n1=await name()
    await p.click(".fiche-pas button >> nth=0"); await p.wait_for_timeout(700); n2=await name()
    res={"vp":f"{w}x{h}","depart":n0,"compteur":compteur,"suivant":n1,"retour":n2}
    assert n1!=n0 and n2==n0, res
    if touch:
        cdp=await ctx.new_cdp_session(p); y=int(h*(0.45 if w>760 else 0.25)); x0=int(w*0.35 if w>760 else w*0.7); x1=x0-int(min(w*0.3,200))
        await cdp.send("Input.dispatchTouchEvent",{"type":"touchStart","touchPoints":[{"x":x0,"y":y}]})
        for k in range(1,6): await cdp.send("Input.dispatchTouchEvent",{"type":"touchMove","touchPoints":[{"x":x0+(x1-x0)*k//5,"y":y}]})
        await cdp.send("Input.dispatchTouchEvent",{"type":"touchEnd","touchPoints":[]}); await p.wait_for_timeout(700)
        res["glisser"]=await name(); assert res["glisser"]==n1, res
    await p.screenshot(path=f"{OUT}/70-fiche-focus-{w}x{h}.png")
    await p.keyboard.press("Escape"); await p.wait_for_timeout(600)
    res["echap_vers_liens"]=await p.locator(".lien-carte").count()>0 and await p.locator(".fiche").count()==0
    res["errs"]=[e for e in errs if e[0]!="reqfail"]
    print(res); await b.close()
async def main():
    async with async_playwright() as pw:
        for w,h,t in [(830,525,True),(412,915,True),(1920,1080,False)]: await run(pw,w,h,t)
asyncio.run(main())
