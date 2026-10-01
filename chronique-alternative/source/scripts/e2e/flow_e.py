import os
import asyncio, json, sys
from playwright.async_api import async_playwright
from common import *
PRO=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),"saves","baseline-save-after-prologue.json")).read(); SLOT=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),"saves","baseline-slot1.json")).read()
OUT=f"{SHOTS}/flow"
async def main():
    async with async_playwright() as pw:
        b=await pw.chromium.launch(); ctx=await b.new_context(viewport={"width":1280,"height":720})
        await ctx.add_init_script("if(!sessionStorage.getItem('seeded')){localStorage.setItem('sylvinia-liens-autosave',%s);localStorage.setItem('sylvinia-liens-slot-2',%s);sessionStorage.setItem('seeded','1')}"%(json.dumps(PRO),json.dumps(SLOT)))
        p=await ctx.new_page(); errs=[]; hook(p,errs); p.set_default_timeout(6000)
        await p.goto(BASE); await p.wait_for_timeout(1500)
        await p.screenshot(path=f"{OUT}/01-titre-cinematique.png")
        await p.keyboard.press("Enter"); await p.wait_for_timeout(1200)
        await p.screenshot(path=f"{OUT}/02-titre-menu.png")
        await p.locator(".t-item:has-text('Charger')").click(); await p.wait_for_timeout(800)
        await p.screenshot(path=f"{OUT}/03-titre-charger.png"); print("load", await buttons(p,"dialog[open]"))
        await p.locator("dialog[open] button:has-text('Charger')").nth(1).click(); await p.wait_for_timeout(2000)
        print("after slot2 load", await gstate(p), await p.locator(".hud").count())
        await p.screenshot(path=f"{OUT}/04-slot2-charge.png")
        # registre
        await p.locator(".hud .rond").nth(1).click(); await p.wait_for_timeout(700)
        await p.screenshot(path=f"{OUT}/05-registre.png"); print("registre", await buttons(p,"dialog[open]"))
        await p.keyboard.press("Escape"); await p.wait_for_timeout(500)
        # pause -> écran titre
        await p.keyboard.press("Escape"); await p.wait_for_timeout(600)
        await p.locator("dialog[open] button:has-text('Écran titre')").click(); await p.wait_for_timeout(1500)
        print("title?", await p.locator(".titre").count(), await buttons(p,"dialog[open]"))
        await p.keyboard.press("Enter"); await p.wait_for_timeout(1000)
        # nouvelle chronique avec sauvegarde existante -> confirmation
        await p.locator(".t-item:has-text('Nouvelle chronique')").click(); await p.wait_for_timeout(800)
        await p.screenshot(path=f"{OUT}/06-confirm-nouvelle.png"); print("new dlg", await buttons(p,"dialog[open]"))
        await p.locator("dialog[open] button.btn:not(.principal)").last.click(); await p.wait_for_timeout(500)
        # continuer -> save après prologue (autosave toujours celle du slot chargé ?)
        await p.locator(".t-item.principal").click(); await p.wait_for_timeout(2200)
        print("continue", await gstate(p))
        # A propos
        await p.keyboard.press("Escape"); await p.wait_for_timeout(500)
        print(errs)
        await b.close()
asyncio.run(main())
