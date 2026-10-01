# Captures avant/après v2.5 (fenêtres, scènes, Allenna). Usage : CA_BASE=… python3 shots_v25.py <prefixe> <dossier>
import os, sys, asyncio, json
from playwright.async_api import async_playwright
from common import *
SAVE=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),"saves","save-v25-allenna.json")).read()
PREFIX=sys.argv[1] if len(sys.argv)>1 else "apres"; OUT=sys.argv[2] if len(sys.argv)>2 else f"{SHOTS}/v25"
VPS=[(830,525,True),(1920,1080,False)] if len(sys.argv)<4 else [tuple(int(x) for x in v.rstrip("t").split("x"))+(v.endswith("t"),) for v in sys.argv[3].split(",")]
async def run(pw,w,h,touch):
    b=await pw.chromium.launch(); ctx=await b.new_context(viewport={"width":w,"height":h},has_touch=touch,is_mobile=touch)
    await ctx.add_init_script("if(!sessionStorage.getItem('seeded')){localStorage.setItem('sylvinia-liens-autosave',%s);sessionStorage.setItem('seeded','1')}"%json.dumps(SAVE))
    p=await ctx.new_page(); errs=[]; hook(p,errs); p.set_default_timeout(5000)
    tag=f"{w}x{h}"
    async def snap(n): await p.wait_for_timeout(500); await p.screenshot(path=f"{OUT}/{PREFIX}-{tag}-{n}.png")
    async def step(name, fn):
        try: await fn(); print("OK",tag,name)
        except Exception as e: print("FAIL",tag,name,str(e).splitlines()[0][:160])
    async def tab(label):
        if w>760: await p.locator(".hud-onglets .onglet:visible").nth(["Lieu","Carte","Liens","Journal","Jobs","Biens","Codex"].index(label)).click()
        else:
            nav=p.locator(f".nav-mobile button:visible:has-text('{label}')")
            if await nav.count(): await nav.first.click()
            else:
                await p.locator(".nav-mobile button:visible:has-text('Plus')").first.click(); await p.wait_for_timeout(400)
                await p.locator(f"dialog[open] button:has-text('{label}'), .feuille button:has-text('{label}')").first.click()
        await p.wait_for_timeout(700)
    async def fermer():
        for i in range(4):
            if await p.locator("dialog[open], .modal-backdrop").count()==0: return
            await p.keyboard.press("Escape"); await p.wait_for_timeout(450)
        await close_modals(p)
    async def reset():
        await p.evaluate("(s)=>localStorage.setItem('sylvinia-liens-autosave',s)", SAVE) if p.url.startswith("http") else None
        await p.goto(BASE); await p.wait_for_timeout(1000)
        await p.keyboard.press("Enter"); await p.wait_for_timeout(900)
        await p.click(".t-item.principal"); await p.wait_for_timeout(2200)
        await fermer()
    await reset()
    await step("lieu", lambda: snap("01-lieu"))
    async def fiche():
        await tab("Liens"); await p.locator(".lien-carte:has-text('Allenna')").first.click(); await snap("02-fiche-allenna"); await p.keyboard.press("Escape"); await p.wait_for_timeout(400)
    await step("fiche", fiche)
    async def trio():
        await tab("Liens"); await p.locator(".v2-root button:has-text('À trois')").first.click(); await p.wait_for_timeout(500)
        t=p.locator("[data-trio*='allenna']")
        if await t.count(): await t.first.click()
        await snap("02b-trio-allenna"); await p.keyboard.press("Escape"); await p.wait_for_timeout(400)
    await step("trio", trio)
    async def cadeau():
        await reset()
        await tab("Lieu"); await p.click("[data-cmd=offrir]"); await p.wait_for_timeout(900); await snap("03-cadeau")
        card=p.locator("[data-don='boussole'], .gift-list button:has-text('Boussole')").first
        await card.hover(); await snap("03b-cadeau-survol")
        await card.click(); await p.wait_for_timeout(1400); await snap("04-cadeau-reaction"); await fermer()
    await step("cadeau", cadeau)
    async def lettre():
        await reset()
        await tab("Journal"); await p.locator(".signet").nth(1).click(); await p.wait_for_timeout(500)
        await p.locator(".v2-root [data-lettre], .v2-root button:has-text('Lire'), .v2-root .courrier button").first.click(); await snap("05-lettre"); await fermer()
    await step("lettre", lettre)
    async def dossier():
        await reset()
        await tab("Liens"); await p.locator(".lien-carte:has-text('Allenna')").first.click(); await p.wait_for_timeout(500)
        await p.click("[data-act=dossier]"); await snap("06-dossier"); await fermer(); await p.keyboard.press("Escape")
    await step("dossier", dossier)
    async def rdv():
        await reset()
        await tab("Lieu"); await p.click("[data-cmd=rdv]"); await snap("07-rdv"); await fermer()
    await step("rdv", rdv)
    async def marche():
        await tab("Biens"); await p.click("[data-act=marche]"); await snap("08-marche"); await fermer()
    await step("marche", marche)
    async def scene():
        await reset()
        await tab("Lieu"); await p.click("[data-cmd=parler]"); await p.wait_for_timeout(1500)
        await snap("09-scene-ligne")
        for i in range(60):
            if not await p.locator(".dialogue-overlay").count(): break
            if await p.locator(".choice-box button").count(): await snap("10-scene-choix"); break
            await p.locator(".dialogue-box").first.click(); await p.wait_for_timeout(200)
        bl=p.locator("[data-act=backlog]")
        if await bl.count(): await bl.first.click(); await snap("11-backlog"); await p.keyboard.press("Escape")
        await play_scene(p); await p.wait_for_timeout(600); await fermer()
    await step("scene", scene)
    async def job():
        await reset()
        await tab("Jobs"); await p.locator(".affiche").first.click(); await p.wait_for_timeout(600); await snap("12-job-affiche")
        await p.locator("dialog[open] [data-act=go]").first.click(); await p.wait_for_timeout(1800)
        if not await p.locator(".modal-backdrop").count():
            await play_scene(p); await fermer(); await tab("Jobs"); await p.locator(".affiche").first.click(); await p.wait_for_timeout(500); await p.locator("dialog[open] [data-act=go]").first.click(); await p.wait_for_timeout(1500)
        await snap("13-job-briefing")
        await p.locator("[data-act=job-accepter], .modal-backdrop .primary-action").first.click(); await snap("14-job-jeu")
    await step("job", job)
    print(tag, [e for e in errs if e[0]!="reqfail"][:5]); await b.close()
async def main():
    async with async_playwright() as pw:
        for w,h,t in VPS: await run(pw,w,h,t)
asyncio.run(main())
