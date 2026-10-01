import os
import asyncio, json, sys
from playwright.async_api import async_playwright
from common import *
SAVE=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),"saves","baseline-save-advanced.json")).read()
async def run(pw, tag, w, h):
    OUT=f"{SHOTS}/mobile-{tag}"
    import os; os.makedirs(OUT, exist_ok=True)
    b=await pw.chromium.launch(); ctx=await b.new_context(viewport={"width":w,"height":h}, has_touch=True, is_mobile=True)
    await ctx.add_init_script("if(!sessionStorage.getItem('seeded')){localStorage.setItem('sylvinia-liens-autosave',%s);sessionStorage.setItem('seeded','1')}"%json.dumps(SAVE))
    p=await ctx.new_page(); errs=[]; hook(p,errs); p.set_default_timeout(6000)
    await p.goto(BASE); await p.wait_for_timeout(1200)
    await p.tap(".titre"); await p.wait_for_timeout(1200)
    await p.tap(".t-item.principal"); await p.wait_for_timeout(2200)
    await p.screenshot(path=f"{OUT}/01-lieu.png")
    await p.tap("[data-cmd=parler]"); await p.wait_for_timeout(1200)
    await p.screenshot(path=f"{OUT}/02-scene.png")
    n=0
    for i in range(80):
        if not await p.locator(".dialogue-overlay").count(): break
        ch=p.locator(".choice-box button")
        if await ch.count():
            if n==0: await p.screenshot(path=f"{OUT}/03-choix.png"); n=1
            await ch.first.tap()
        else: await p.locator(".dialogue-box").first.tap()
        await p.wait_for_timeout(150)
    await close_modals(p); await p.wait_for_timeout(800)
    await p.screenshot(path=f"{OUT}/04-retour-hud.png"); print(tag, "after scene", await gstate(p))
    nav=p.locator(".nav-mobile button, .nav-mobile a")
    print(tag, "nav", await nav.count(), [ (await nav.nth(i).inner_text()).replace("\n"," ") for i in range(await nav.count())])
    vis=[i for i in range(await nav.count()) if await nav.nth(i).is_visible()]
    for i in vis:
        await nav.nth(i).tap(); await p.wait_for_timeout(800)
        await p.screenshot(path=f"{OUT}/1{i}-nav.png")
        if await p.locator("dialog[open]").count():
            print(tag, "plus sheet", await buttons(p,"dialog[open]"))
            await p.keyboard.press("Escape"); await p.wait_for_timeout(400)
    # pause via HUD menu button
    await p.locator(".hud .rond").last.tap(); await p.wait_for_timeout(700)
    await p.screenshot(path=f"{OUT}/20-pause.png"); print(tag, "pause", await buttons(p,"dialog[open]"))
    print(tag, "errs", errs)
    await b.close()
async def main():
    async with async_playwright() as pw:
        await run(pw, "830x525", 830, 525)
        await run(pw, "412x915", 412, 915)
asyncio.run(main())
