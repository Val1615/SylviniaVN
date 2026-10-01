import os
import asyncio, json, sys
from playwright.async_api import async_playwright
from common import *
SAVE=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),"saves","baseline-save-advanced.json")).read()
OUT=f"{SHOTS}/flow"
async def step(name, coro):
    try: await coro; print("OK", name)
    except Exception as e: print("FAIL", name, str(e).splitlines()[0][:200])
async def main():
    async with async_playwright() as pw:
        b=await pw.chromium.launch(); ctx=await b.new_context(viewport={"width":1280,"height":720})
        await ctx.add_init_script("if(!sessionStorage.getItem('seeded')){localStorage.setItem('sylvinia-liens-autosave',%s);sessionStorage.setItem('seeded','1')}"%json.dumps(SAVE))
        p=await ctx.new_page(); errs=[]; hook(p,errs)
        p.set_default_timeout(6000)
        await p.goto(BASE); await p.wait_for_timeout(1000)
        await p.keyboard.press("Enter"); await p.wait_for_timeout(1000)
        await p.click(".t-item.principal"); await p.wait_for_timeout(2000)
        tab=lambda i: p.locator(".hud-onglets .onglet").nth(i)
        # --- Carte : voyage
        await tab(1).click(); await p.wait_for_timeout(800)
        await p.click(".pin:has-text('Al’Gratal')"); await p.wait_for_timeout(600)
        await p.screenshot(path=f"{OUT}/30-carte-selection.png")
        print("fiche", await buttons(p, ".carte-fiche"))
        await p.click(".carte-fiche [data-act=voyager]"); await p.wait_for_timeout(2600)
        await play_scene(p); ml=[]; await close_modals(p, ml); print("modals", ml)
        await p.screenshot(path=f"{OUT}/31-arrivee-algratal.png"); print("after travel", await gstate(p))
        # --- Liens -> fiche
        await tab(2).click(); await p.wait_for_timeout(800)
        await p.click(".lien-carte:has-text('Iriana')"); await p.wait_for_timeout(900)
        await p.screenshot(path=f"{OUT}/32-fiche-iriana.png")
        print("fiche btns", await buttons(p, ".v2-root"))
        await p.click("[data-act=localiser]"); await p.wait_for_timeout(900)
        await p.screenshot(path=f"{OUT}/33-localiser.png"); print("tab after localiser", await p.locator(".hud-onglets .onglet.actif").inner_text())
        await tab(2).click(); await p.wait_for_timeout(700)
        await p.locator(".v2-root button:has-text('Rendez-vous')").first.click(); await p.wait_for_timeout(900)
        await p.screenshot(path=f"{OUT}/34-liens-rdv.png")
        await p.locator(".v2-root button:has-text('À trois')").first.click(); await p.wait_for_timeout(900)
        await p.screenshot(path=f"{OUT}/35-liens-trio.png")
        await p.keyboard.press("Escape"); await p.wait_for_timeout(500)
        print("esc from trio ->", await buttons(p, ".v2-root .liens, .v2-root"))
        # --- Journal
        await tab(3).click(); await p.wait_for_timeout(800)
        for i,n in enumerate(["chronique","courrier","decouvertes","relations","souvenirs","croisees"]):
            await p.locator(".signet").nth(i).click(); await p.wait_for_timeout(700)
            await p.screenshot(path=f"{OUT}/36-journal-{i}-{n}.png")
        await p.locator(".signet").nth(1).click(); await p.wait_for_timeout(500)
        print("courrier", await buttons(p, ".v2-root .journal, .v2-root"))
        # --- Jobs
        await tab(4).click(); await p.wait_for_timeout(800)
        await p.locator(".affiche").first.click(); await p.wait_for_timeout(700)
        await p.screenshot(path=f"{OUT}/37-job-detail.png"); print("job dialog", await buttons(p, "dialog[open]"))
        await p.keyboard.press("Escape"); await p.wait_for_timeout(500)
        # --- Biens : marché
        await tab(5).click(); await p.wait_for_timeout(800)
        await p.click("[data-act=marche]"); await p.wait_for_timeout(800)
        await p.screenshot(path=f"{OUT}/38-marche.png"); print("market", (await buttons(p, ".modal-backdrop"))[:6])
        await close_modals(p)
        await p.locator(".v2-root button:has-text('Logis')").first.click(); await p.wait_for_timeout(700)
        await p.screenshot(path=f"{OUT}/39-logis.png")
        # --- Codex
        await tab(6).click(); await p.wait_for_timeout(700)
        for n in ["Figures","Lieux","Scènes"]:
            await p.locator(f".v2-root button:has-text('{n}')").first.click(); await p.wait_for_timeout(600)
            await p.screenshot(path=f"{OUT}/40-codex-{n.lower()}.png")
        print(errs)
        await b.close()
asyncio.run(main())
