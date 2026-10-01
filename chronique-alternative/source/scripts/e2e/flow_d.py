import os
import asyncio, json, sys
from playwright.async_api import async_playwright
from common import *
SAVE=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),"saves","baseline-save-advanced.json")).read()
OUT=f"{SHOTS}/flow"
async def main():
    async with async_playwright() as pw:
        b=await pw.chromium.launch(); ctx=await b.new_context(viewport={"width":1280,"height":720})
        await ctx.add_init_script("if(!sessionStorage.getItem('seeded')){localStorage.setItem('sylvinia-liens-autosave',%s);sessionStorage.setItem('seeded','1')}"%json.dumps(SAVE))
        p=await ctx.new_page(); errs=[]; hook(p,errs); p.set_default_timeout(6000)
        await p.goto(BASE); await p.wait_for_timeout(1000)
        await p.keyboard.press("Enter"); await p.wait_for_timeout(1000)
        await p.click(".t-item.principal"); await p.wait_for_timeout(2000)
        # Pause
        await p.keyboard.press("Escape"); await p.wait_for_timeout(700)
        await p.screenshot(path=f"{OUT}/50-pause.png"); print("pause", await buttons(p,"dialog[open]"))
        await p.locator("dialog[open] button:has-text('Sauvegarder')").first.click(); await p.wait_for_timeout(700)
        await p.screenshot(path=f"{OUT}/51-sauver.png"); print("save dlg", await buttons(p,"dialog[open]"))
        await p.locator("dialog[open] button:has-text('Sauvegarder')").first.click(); await p.wait_for_timeout(800)
        print("slot1 stored:", bool(await p.evaluate("localStorage.getItem('sylvinia-liens-slot-1')")))
        await p.screenshot(path=f"{OUT}/52-sauve-ok.png"); print("after save", await buttons(p,"dialog[open]"))
        await p.keyboard.press("Escape"); await p.wait_for_timeout(500)
        while await p.locator("dialog[open]").count(): await p.keyboard.press("Escape"); await p.wait_for_timeout(400)
        # avancer le temps puis charger slot 1
        await p.click("[data-cmd=attendre]"); await p.wait_for_timeout(3000); await close_modals(p)
        print("after wait", await gstate(p))
        await p.keyboard.press("Escape"); await p.wait_for_timeout(600)
        await p.locator("dialog[open] button:has-text('Charger')").first.click(); await p.wait_for_timeout(700)
        await p.screenshot(path=f"{OUT}/53-charger.png"); print("load dlg", await buttons(p,"dialog[open]"))
        await p.locator("dialog[open] button:has-text('Charger')").nth(1).click(); await p.wait_for_timeout(1500)
        await p.screenshot(path=f"{OUT}/54-charge.png")
        print("after load", await gstate(p), "dialog open:", await p.locator("dialog[open]").count())
        # Options
        await p.keyboard.press("Escape"); await p.wait_for_timeout(600)
        await p.locator("dialog[open] button:has-text('Options')").first.click(); await p.wait_for_timeout(800)
        await p.screenshot(path=f"{OUT}/55-options.png")
        sl=p.locator("input[type=range]:visible"); print("sliders", await sl.count())
        await sl.nth(0).focus()
        for i in range(4): await p.keyboard.press("ArrowRight")
        await sl.nth(2).focus()
        for i in range(3): await p.keyboard.press("ArrowLeft")
        await p.wait_for_timeout(400)
        await p.screenshot(path=f"{OUT}/56-options-curseurs.png")
        print("stored scales", await p.evaluate("localStorage.getItem('sylvinia-ca-v2-echelles')"))
        await p.reload(); await p.wait_for_timeout(1500)
        print("after reload scales", await p.evaluate("localStorage.getItem('sylvinia-ca-v2-echelles')"), await p.evaluate("getComputedStyle(document.documentElement).getPropertyValue('--s-texte')+'|'+document.documentElement.style.cssText.slice(0,300)"))
        # reset
        await p.keyboard.press("Enter"); await p.wait_for_timeout(900)
        await p.locator(".t-item:has-text('Options')").click(); await p.wait_for_timeout(800)
        await p.screenshot(path=f"{OUT}/57-options-titre.png")
        await p.click("dialog[open] [data-act=echelles-defaut]"); await p.wait_for_timeout(300)
        print("after reset", await p.evaluate("localStorage.getItem('sylvinia-ca-v2-echelles')"))
        await p.keyboard.press("Escape"); await p.wait_for_timeout(500)
        # Mode histoire
        await p.locator(".t-item:has-text('Mode Histoire')").click(); await p.wait_for_timeout(700)
        await p.screenshot(path=f"{OUT}/58-confirm-histoire.png"); print("story dlg", await buttons(p,"dialog[open]"))
        await p.locator("dialog[open] .btn.principal").click(); await p.wait_for_timeout(2500)
        print("url", p.url); await p.screenshot(path=f"{OUT}/59-mode-histoire.png")
        if await p.locator("text=Entrer dans le récit").count():
            await p.click("text=Entrer dans le récit"); await p.wait_for_timeout(1500)
        vis=False
        for k in range(30):
            if await p.locator("#modeChronicleBtn").is_visible(): vis=True; break
            if await p.locator("text=Appuyer pour commencer").is_visible():
                await p.click("text=Appuyer pour commencer"); await p.wait_for_timeout(1500)
            elif k%5==4: await p.mouse.click(640,600)
            await p.wait_for_timeout(1000)
        await p.screenshot(path=f"{OUT}/59b-choix-mode.png")
        print("mode select visible", vis)
        if vis: await p.click("#modeChronicleBtn")
        else: await p.goto(BASE)
        await p.wait_for_timeout(2500)
        print("back url", p.url); await p.keyboard.press("Enter"); await p.wait_for_timeout(1000)
        print("title items after back", await buttons(p,".t-menu"))
        await p.screenshot(path=f"{OUT}/60-retour-ca.png")
        print(errs)
        await b.close()
asyncio.run(main())
