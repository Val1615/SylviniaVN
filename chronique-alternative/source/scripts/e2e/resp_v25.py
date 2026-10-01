# Chevauchements / textes coupés dans les fenêtres et scènes V2.5, sur 5 formats + échelles extrêmes (curseurs).
# Usage : CA_BASE=… python3 resp_v25.py
import os, sys, asyncio, json
from playwright.async_api import async_playwright
from common import *
SAVE=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),"saves","save-v25-allenna.json")).read()
JS=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),"resp_check.js")).read()
OUT=os.environ.get("CA_RESP", f"{SHOTS}/resp-v25")
VPS=[("830x525-tactile",830,525,True,""),("1024x880",1024,880,False,""),("412x915-tactile",412,915,True,""),("1280x720",1280,720,False,""),("1920x1080",1920,1080,False,""),
     ("830x525-grand",830,525,True,"?texte=140&cases=125&sprite=130"),("830x525-petit",830,525,True,"?texte=70&cases=70&sprite=70")]
if len(sys.argv)>1: VPS=[v for v in VPS if v[0] in sys.argv[1:]]
TOTAL={"ov":0,"clip":0}
async def run(pw, vp, w, h, touch, q):
    b=await pw.chromium.launch(); ctx=await b.new_context(viewport={"width":w,"height":h},has_touch=touch,is_mobile=touch)
    p=await ctx.new_page(); errs=[]; hook(p,errs); p.set_default_timeout(6000); os.makedirs(f"{OUT}/{vp}", exist_ok=True)
    print("==", vp)
    async def check(name, root=None):
        await p.wait_for_timeout(1300)
        await p.evaluate("(r)=>{window.__respRoot=r}", root)
        r=await p.evaluate(JS); await p.screenshot(path=f"{OUT}/{vp}/{name}.png")
        TOTAL["ov"]+=len(r["ov"]); TOTAL["clip"]+=len(r["clip"])
        print(f"  {name}: ov={len(r['ov'])} clip={len(r['clip'])} sw={r['sw']}")
        for x in r['ov'][:5]: print("     OV", x[:170])
        for x in r['clip'][:5]: print("     CL", x[:170])
    async def tab(label):
        if w>760: await p.locator(".hud-onglets .onglet:visible").nth(["Lieu","Carte","Liens","Journal","Jobs","Biens","Codex"].index(label)).click()
        else:
            nav=p.locator(f".nav-mobile button:visible:has-text('{label}')")
            if await nav.count(): await nav.first.click()
            else:
                await p.locator(".nav-mobile button:visible:has-text('Plus')").first.click(); await p.wait_for_timeout(400)
                await p.locator(f"dialog[open] button:has-text('{label}'), .feuille button:has-text('{label}')").first.click()
        await p.wait_for_timeout(600)
    async def reset():
        await p.goto(BASE+q); await p.evaluate("(s)=>{localStorage.setItem('sylvinia-liens-autosave',s)}", SAVE)
        await p.goto(BASE+q); await p.wait_for_timeout(900); await p.keyboard.press("Enter"); await p.wait_for_timeout(900)
        await p.click(".t-item.principal"); await p.wait_for_timeout(2000)
        for i in range(3):
            if await p.locator("dialog[open], .modal-backdrop").count()==0: break
            await p.keyboard.press("Escape"); await p.wait_for_timeout(400)
    async def step(name, fn):
        try: await fn()
        except Exception as e: print("  FAIL", name, str(e).splitlines()[0][:140])
    await reset()
    async def cad():
        await tab("Lieu"); await p.click("[data-cmd=offrir]"); await check("cadeau")
        await p.locator("[data-don='boussole']").first.click(); await check("cadeau-reaction"); await p.keyboard.press("Escape")
    await step("cadeau", cad)
    async def rdv():
        await reset(); await tab("Lieu"); await p.click("[data-cmd=rdv]"); await check("rdv"); await p.keyboard.press("Escape")
    await step("rdv", rdv)
    async def dossier():
        await tab("Liens"); await p.locator(".lien-carte:has-text('Allenna')").first.click(); await p.wait_for_timeout(500)
        await p.click("[data-act=dossier]"); await check("dossier"); await p.keyboard.press("Escape"); await p.wait_for_timeout(300); await p.keyboard.press("Escape")
    await step("dossier", dossier)
    async def marche():
        await tab("Biens"); await p.click("[data-act=marche]"); await check("marche"); await p.keyboard.press("Escape")
    await step("marche", marche)
    async def lettre():
        await tab("Journal"); await p.locator(".signet").nth(1).click(); await p.wait_for_timeout(500)
        await p.locator(".v2-root [data-lettre], .v2-root button:has-text('Lire'), .v2-root .courrier button").first.click(); await check("lettre"); await p.keyboard.press("Escape")
    await step("lettre", lettre)
    async def scene():
        await reset(); await tab("Lieu"); await p.click("[data-cmd=parler]"); await check("scene-ligne", ".dialogue-overlay")
        for i in range(60):
            if await p.locator(".choice-box button").count() or not await p.locator(".dialogue-overlay").count(): break
            await p.locator(".dialogue-box").first.click(); await p.wait_for_timeout(150)
        await check("scene-choix", ".dialogue-overlay")
        await p.locator("[data-act=backlog]").click(); await check("scene-historique", ".scene-backlog")
    await step("scene", scene)
    async def job():
        await reset(); await tab("Jobs"); await p.locator(".affiche").first.click(); await p.wait_for_timeout(600)
        await p.locator("dialog[open] [data-act=go]").first.click(); await check("job-briefing")
        await p.locator("[data-act=job-accepter]").click(); await check("job-partie")
    await step("job", job)
    async def bilan():
        await reset(); await tab("Lieu"); await p.click("[data-cmd=offrir]"); await p.wait_for_timeout(700)
        await p.locator("[data-don='boussole']").first.click(); await p.wait_for_timeout(700); await p.locator(".v2-reaction .primary-action").click(); await p.wait_for_timeout(300)
        for k in range(6):
            if await p.locator("[data-bilan]").count(): break
            await tab("Lieu"); await p.click("[data-cmd=attendre]")
            for t in range(25):
                await p.wait_for_timeout(150)
                if await p.locator("[data-bilan]").count(): break
            if await p.locator("[data-bilan]").count(): break
            await close_modals(p)
            if await p.locator(".dialogue-overlay").count(): await play_scene(p)
        await p.locator("[data-bilan]").click(); await check("bilan", ".bilan-jour")
    await step("bilan", bilan)
    bad=[e for e in errs if e[0]!="reqfail" and "404" not in e[1]]
    print("  console:", bad[:3]); await b.close()
async def main():
    async with async_playwright() as pw:
        for v in VPS: await run(pw,*v)
    print("TOTAL", TOTAL)
asyncio.run(main())
