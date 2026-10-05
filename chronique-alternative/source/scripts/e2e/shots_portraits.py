# Captures fiche / dossier / invitation (portraits illustrés). Usage : CA_BASE=… python3 shots_portraits.py <prefixe> <dossier> [830x525t,1920x1080]
import os, sys, asyncio, json
from playwright.async_api import async_playwright
from common import *
SAVE=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),"saves","save-portraits.json")).read()
PREFIX=sys.argv[1]; OUT=sys.argv[2]; os.makedirs(OUT, exist_ok=True)
VPS=[tuple(int(x) for x in v.rstrip("t").split("x"))+(v.endswith("t"),) for v in (sys.argv[3] if len(sys.argv)>3 else "830x525t,1920x1080").split(",")]
async def run(pw,w,h,touch):
    b=await pw.chromium.launch(); ctx=await b.new_context(viewport={"width":w,"height":h},has_touch=touch,is_mobile=touch)
    p=await ctx.new_page(); errs=[]; hook(p,errs); p.set_default_timeout(6000); tag=f"{w}x{h}"
    async def snap(n): await p.wait_for_timeout(900); await p.screenshot(path=f"{OUT}/{PREFIX}-{tag}-{n}.png")
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
        await p.goto(BASE); await p.evaluate("(s)=>{localStorage.setItem('sylvinia-liens-autosave',s)}", SAVE)
        await p.goto(BASE); await p.wait_for_timeout(900); await p.keyboard.press("Enter"); await p.wait_for_timeout(900)
        await p.click(".t-item.principal"); await p.wait_for_timeout(2000)
        for i in range(3):
            if await p.locator("dialog[open], .modal-backdrop").count()==0: break
            await p.keyboard.press("Escape"); await p.wait_for_timeout(400)
    async def step(name, fn):
        try: await fn(); print("OK", tag, name)
        except Exception as e: print("FAIL", tag, name, str(e).splitlines()[0][:150])
    await reset()
    for cid,name in [("hylee","Hylee"),("iriana","Iriana"),("tia","Tia"),("allenna","Allenna")]:
        async def fiche(name=name, cid=cid):
            await tab("Liens"); await p.locator(f".lien-carte:has-text('{name}')").first.click(); await snap(f"fiche-{cid}")
            await p.keyboard.press("Escape"); await p.wait_for_timeout(400)
        await step("fiche "+cid, fiche)
    async def dossier():
        await tab("Liens"); await p.locator(".lien-carte:has-text('Hylee')").first.click(); await p.wait_for_timeout(500)
        await p.click("[data-act=dossier]"); await snap("dossier-hylee"); await p.keyboard.press("Escape"); await p.wait_for_timeout(300); await p.keyboard.press("Escape")
    await step("dossier", dossier)
    async def invitation():
        await tab("Journal"); await p.locator(".signet").nth(1).click(); await p.wait_for_timeout(500)
        await p.locator(".v2-root :text('Un courrier du palais')").first.click(); await p.wait_for_timeout(500)
        if not await p.locator(".v2-invitation").count():
            await p.locator(".v2-root button:has-text('Lire'), .v2-root button:has-text('Ouvrir'), .v2-root button:has-text('Répondre')").first.click()
        await snap("invitation-iriana"); await p.keyboard.press("Escape")
    await step("invitation", invitation)
    print(tag, [e for e in errs if e[0]!="reqfail"][:4]); await b.close()
async def main():
    async with async_playwright() as pw:
        for v in VPS: await run(pw,*v)
asyncio.run(main())
