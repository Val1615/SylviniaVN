"""Captures de la série Bellirith / Valurn (dossier, scène, « Je n’ai jamais », intimité, bloc développeur).
Usage : python3 shots_bv.py <save.json> <dossier> [830x525t,1024x880]"""
import os, sys, asyncio, json
from playwright.async_api import async_playwright
from common import *
SAVE=open(sys.argv[1]).read()
OUT=sys.argv[2] if len(sys.argv)>2 else "/tmp/bv-shots"
VPS=[(int(v.rstrip("t").split("x")[0]), int(v.rstrip("t").split("x")[1]), v.endswith("t")) for v in (sys.argv[3] if len(sys.argv)>3 else "830x525t,1024x880").split(",")]
os.makedirs(OUT, exist_ok=True)
async def run(pw,w,h,touch):
    b=await pw.chromium.launch(executable_path=os.environ.get("CA_CHROME") or None); ctx=await b.new_context(viewport={"width":w,"height":h},has_touch=touch,is_mobile=touch)
    await ctx.add_init_script("if(!sessionStorage.getItem('seeded')){localStorage.setItem('sylvinia-liens-autosave',%s);sessionStorage.setItem('seeded','1')}"%json.dumps(SAVE))
    p=await ctx.new_page(); errs=[]; hook(p,errs); p.set_default_timeout(9000); tag=f"{w}x{h}"
    async def snap(n):
        await p.wait_for_timeout(450); path=f"{OUT}/{tag}-{n}.png"; await p.screenshot(path=path); print("shot", path)
    async def home():
        for i in range(5):
            if await p.locator(".bn-game, .vm-game, .bv-intimacy, .dialogue-overlay").count()==0: break
            btn=p.locator(":is(.bn-game,.vm-game,.bn-minigame,.bv-intimacy,.dialogue-overlay) button:is(:has-text('Quitter le souvenir'),:has-text('Reprendre plus tard'))")
            if await btn.count(): await btn.first.click()
            else: await p.keyboard.press("Escape")
            await p.wait_for_timeout(500)
    async def dev():
        await home()
        for i in range(4):
            if await p.locator("dialog[open], .modal-backdrop").count()==0: break
            await p.keyboard.press("Escape"); await p.wait_for_timeout(300)
        await p.keyboard.press("Escape"); await p.wait_for_timeout(600)
        await p.locator("dialog[open] button:has-text('Options'), button:has-text('Options')").first.click(); await p.wait_for_timeout(700)
        await p.locator(".opt-cat:has-text('Session'), [data-otab=session]").first.click(); await p.wait_for_timeout(500)
    async def boot():
        await p.goto(BASE); await p.wait_for_timeout(900); await p.keyboard.press("Enter"); await p.wait_for_timeout(900)
        await p.click(".t-item.principal"); await p.wait_for_timeout(2000); await close_modals(p)
    await boot()
    G=os.environ.get("GAMES","bn,vm")
    adv=".bn-game .bn-line, .bn-game .bn-advance, .bn-minigame .bn-advance"
    if "bn" in G:
      try:
        await dev(); await p.locator("button:has-text('Lancer le mini-jeu')").first.click(); await p.wait_for_timeout(1200)
        await snap("bn-01-intro")
        for i in range(14):
            if await p.locator(".bn-moves, .bn-choices").count(): break
            l=p.locator(adv)
            if await l.count(): await l.first.click(); await p.wait_for_timeout(200)
        await snap("bn-02-manche")
        await p.locator(".bn-moves button, .bn-choices button").nth(1).click(); await p.wait_for_timeout(600)
        await snap("bn-03-reponse")
        for i in range(12):
            if await p.locator(".bn-result, .bn-issue").count(): break
            l=p.locator(adv)
            if await l.count(): await l.first.click(); await p.wait_for_timeout(200)
        await snap("bn-04-resultat")
        await dev(); await p.locator("button:has-text('Manche hors échelle')").first.click(); await p.wait_for_timeout(1300)
        await snap("bn-05-hors-echelle")
      except Exception as e: print(tag, "bn", e)
    if "vm" in G:
      try:
        await dev(); await p.locator("button:has-text('Marché en attente')").first.click(); await p.wait_for_timeout(1200)
        await boot()
        await p.locator(".hud-onglets .onglet").nth(3).click(); await p.wait_for_timeout(800)
        await p.locator("[data-jtab=relations]").first.click(); await p.wait_for_timeout(800)
        r=p.locator("button:has-text('Reprendre le registre du salon')").first; await r.scroll_into_view_if_needed(); await r.click(); await p.wait_for_timeout(1500)
        await snap("vm-01-registre")
        for k in range(3):
            await p.locator(".vm-offer").nth(k).click(); await p.wait_for_timeout(200)
            await p.locator(".vm-actions button:has-text('Acheter')").first.click(); await p.wait_for_timeout(200)
        await p.locator(".vm-actions button:has-text('Recouper')").first.click(); await p.wait_for_timeout(300)
        await snap("vm-02-detail")
        await p.locator(".vm-submit button:has-text('Présenter')").first.click(); await p.wait_for_timeout(600)
        await snap("vm-03-verdict")
        await p.locator(".vm-submit button:has-text('Conclure')").first.click(); await p.wait_for_timeout(900)
        await snap("vm-04-revelation")
        for i in range(30):
            if await p.locator(".vm-reactions button").count(): break
            a=p.locator(".vm-game button:has-text('Suite'), .vm-game .vm-advance")
            if not await a.count(): break
            await a.first.click(); await p.wait_for_timeout(150)
        await snap("vm-05-reactions")
      except Exception as e: print(tag, "vm", e)
    print(tag, "errors", [e for e in errs if e[0]=="pageerror"][:4])
    await b.close()
async def main():
    async with async_playwright() as pw:
        for v in VPS: await run(pw,*v)
asyncio.run(main())
