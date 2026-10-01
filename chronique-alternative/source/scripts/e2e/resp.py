import os
import asyncio, json, sys, os
from playwright.async_api import async_playwright
from common import *
SAVE=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),"saves","baseline-save-advanced.json")).read()
JS=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),"resp_check.js")).read()
VPS=[("830x525-tactile",830,525,True),("1024x880",1024,880,False),("412x915-tactile",412,915,True),("1280x720",1280,720,False),("1920x1080",1920,1080,False)]
only=sys.argv[1:] 
async def check(p, vp, name, report):
    await p.wait_for_timeout(700)
    os.makedirs(f"{SHOTS}/resp/{vp}", exist_ok=True)
    await p.screenshot(path=f"{SHOTS}/resp/{vp}/{name}.png")
    r=await p.evaluate(JS)
    report[name]=r
    print(f"  {name}: ov={len(r['ov'])} clip={len(r['clip'])} sw={r['sw']}")
    for x in r['ov'][:6]: print("     OV", x[:170])
    for x in r['clip'][:6]: print("     CL", x[:170])
async def run(pw, vp, w, h, touch):
    b=await pw.chromium.launch()
    ctx=await b.new_context(viewport={"width":w,"height":h}, has_touch=touch, is_mobile=touch, device_scale_factor=1)
    await ctx.add_init_script("if(!sessionStorage.getItem('seeded')){localStorage.setItem('sylvinia-liens-autosave',%s);sessionStorage.setItem('seeded','1')}"%json.dumps(SAVE))
    p=await ctx.new_page(); errs=[]; hook(p,errs); p.set_default_timeout(6000)
    rep={}
    print("==", vp)
    await p.goto(BASE); await p.wait_for_timeout(1500)
    await check(p, vp, "00-titre-cinematique", rep)
    if touch: await p.tap(".titre")
    else: await p.keyboard.press("Enter")
    await p.wait_for_timeout(1300)
    await check(p, vp, "01-titre-menu", rep)
    await p.locator(".t-item:has-text('Options')").click(); await check(p, vp, "02-titre-options", rep)
    await p.keyboard.press("Escape"); await p.wait_for_timeout(400)
    await p.locator(".t-item:has-text('Nouvelle')").click(); await p.wait_for_timeout(500)
    await p.locator("dialog[open] .btn.principal").click(); await p.wait_for_timeout(900)
    await check(p, vp, "03-creation", rep)
    await p.keyboard.press("Escape"); await p.wait_for_timeout(900)
    await p.locator(".t-item.principal").click(); await p.wait_for_timeout(2300)
    tabs=["lieu","carte","liens","journal","jobs","biens","codex"]
    for i,n in enumerate(tabs):
        await p.keyboard.press(str(i+1)); await p.wait_for_timeout(500)
        await check(p, vp, f"1{i}-{n}", rep)
        if n=="liens":
            await p.locator(".lien-carte").first.click(); await check(p, vp, "12b-fiche", rep)
            await p.keyboard.press("Escape"); await p.wait_for_timeout(400)
            await p.locator(".v2-root button:has-text('Rendez-vous')").first.click(); await check(p, vp, "12c-rdv", rep)
            await p.locator(".v2-root button:has-text('À trois')").first.click(); await check(p, vp, "12d-trio", rep)
            await p.keyboard.press("Escape"); await p.wait_for_timeout(300)
    await p.keyboard.press("Escape"); await check(p, vp, "20-pause", rep)
    await p.locator("dialog[open] button:has-text('Options')").first.click(); await check(p, vp, "21-options", rep)
    if touch and w<760:
        await p.keyboard.press("1"); await p.wait_for_timeout(400)
        pl=p.locator(".nav-mobile button:has-text('Plus')")
        if await pl.count(): await pl.click(); await check(p, vp, "22-menu-plus", rep)
    json.dump(rep, open(f"{SHOTS}/resp/{vp}/report.json","w"), ensure_ascii=False, indent=1)
    print("  errs:", errs)
    await b.close()
async def main():
    async with async_playwright() as pw:
        for vp,w,h,t in VPS:
            if only and vp not in only: continue
            try: await run(pw, vp, w, h, t)
            except Exception as e: print("FAIL", vp, str(e)[:300])
asyncio.run(main())
