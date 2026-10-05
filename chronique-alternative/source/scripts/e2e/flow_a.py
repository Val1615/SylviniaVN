import os
import asyncio, json, sys, re
from playwright.async_api import async_playwright
from common import *
SAVE=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),"saves","baseline-save-advanced.json")).read()
OUT=f"{SHOTS}/flow"
async def state(p):
    return await p.evaluate("""()=>{const g=JSON.parse(localStorage.getItem('sylvinia-liens-autosave')||'null');return g&&{day:g.day,period:g.period,coins:g.coins??g.gold??g.money,loc:g.location,spot:g.spot}}""")
async def main():
    async with async_playwright() as pw:
        b=await pw.chromium.launch(); ctx=await b.new_context(viewport={"width":1280,"height":720})
        await ctx.add_init_script("if(!sessionStorage.getItem('seeded')){localStorage.setItem('sylvinia-liens-autosave',%s);sessionStorage.setItem('seeded','1')}"%json.dumps(SAVE))
        p=await ctx.new_page(); errs=[]; hook(p,errs)
        await p.goto(BASE); await p.wait_for_timeout(1000)
        await p.keyboard.press("Enter"); await p.wait_for_timeout(1000)
        await p.click(".t-item.principal"); await p.wait_for_timeout(2200)
        await p.screenshot(path=f"{OUT}/10-continue-lieu.png"); print("state0", await state(p))
        # parler
        await p.click("[data-cmd=parler]"); await p.wait_for_timeout(1500)
        await p.screenshot(path=f"{OUT}/11-scene-ecouter.png")
        print("scene buttons", await buttons(p))
        for i in range(60):
            if not await p.locator(".dialogue-overlay").count(): break
            ch=p.locator(".choice-box button")
            if await ch.count(): await ch.first.click()
            elif await p.locator(".dialogue-box").count(): await p.locator(".dialogue-box").first.click()
            else:
                print("overlay other", await buttons(p,".dialogue-overlay")); await p.screenshot(path=f"{OUT}/x-other.png"); break
            await p.wait_for_timeout(250)
        await p.wait_for_timeout(1200)
        print("after scene", await buttons(p, ".v2-calque")+await buttons(p,".modal-backdrop, .game-modal"))
        await p.screenshot(path=f"{OUT}/12-retour-hud.png"); print("state1", await state(p))
        await p.click("[data-cmd=offrir]"); await p.wait_for_timeout(900)
        await p.screenshot(path=f"{OUT}/13-offrir.png")
        print("gift", await buttons(p, ".modal-backdrop"), await buttons(p,"dialog[open]"))
        await p.keyboard.press("Escape"); await p.wait_for_timeout(600)
        print("after esc", await p.locator("dialog[open], .modal-backdrop").count())
        await p.click("[data-cmd=rdv]"); await p.wait_for_timeout(900)
        await p.screenshot(path=f"{OUT}/14-rdv.png")
        print("rdv", await buttons(p, ".modal-backdrop"), await buttons(p,"dialog[open]"), await buttons(p, "main"))
        await p.locator(".modal-backdrop .primary-action").first.click(); await p.wait_for_timeout(1000)
        await p.screenshot(path=f"{OUT}/15-rdv-scene.png")
        print("date steps", await play_scene(p)); await p.wait_for_timeout(800)
        ml=[]; await close_modals(p, ml); print("modals after date", ml)
        await p.screenshot(path=f"{OUT}/15b-apres-rdv.png"); print("state date", await state(p))
        # attendre
        await dismiss_bilan(p)
        await p.click("[data-cmd=attendre]"); await p.wait_for_timeout(450)
        await p.screenshot(path=f"{OUT}/16-saut-temps.png")
        await p.wait_for_timeout(2500)
        print("state wait1", await state(p))
        for k in range(4):
            if await p.locator(".modal-backdrop, .dialogue-overlay").count():
                print("blocking", await buttons(p, ".modal-backdrop, .dialogue-overlay")); break
            await p.click("[data-cmd=attendre]"); await p.wait_for_timeout(3000)
            if await p.locator("[data-bilan]").count(): print("bilan affiché :", (await p.locator(".bj-liste, .bj-vide").first.inner_text()).replace("\n"," ")[:160]); await dismiss_bilan(p)
            print("state wait", k+2, await state(p))
        await p.screenshot(path=f"{OUT}/17-apres-attente.png")
        print(errs)
        await b.close()
asyncio.run(main())
