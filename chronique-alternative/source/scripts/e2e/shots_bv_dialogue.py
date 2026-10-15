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
            if await p.locator(".bn-game, .bv-intimacy, .dialogue-overlay").count()==0: break
            btn=p.locator(".bn-game .bn-head-buttons button, .bv-intimacy .scene-outil.passer, .dialogue-overlay button:has-text('Quitter le souvenir')")
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
        await p.evaluate("()=>{const h=[...document.querySelectorAll('h3')].find(x=>x.textContent.includes('Bellirith / Valurn'));h&&h.scrollIntoView({block:'start'})}")
    await p.goto(BASE); await p.wait_for_timeout(900); await p.keyboard.press("Enter"); await p.wait_for_timeout(900)
    await p.click(".t-item.principal"); await p.wait_for_timeout(2000)
    await close_modals(p)
    await dev()
    await p.locator("button:has-text('Je n’ai jamais')").first.click(); await p.wait_for_timeout(1400)
    name=(await p.evaluate("()=>JSON.parse(localStorage.getItem('sylvinia-liens-autosave')).player.name"))
    got=set(); k=0
    import re
    RX=set(re.findall(r'[BV]\("([^"]+)"', open(os.path.join(os.path.dirname(os.path.abspath(__file__)),"../../src/bellirith-valurn-never-reactions.ts")).read()))
    for i in range(700):
        if await p.locator(".bv-options button").count():
            k+=1; await p.locator(".bv-options button").nth(k%3).click(); await p.wait_for_timeout(250); got.add("chose"); continue
        if await p.locator(".bv-answers button").count():
            if "q" not in got: await snap("01-question"); got.add("q")
            k+=1; await p.locator(".bv-answers button").nth(k%3).click(); await p.wait_for_timeout(300); got.add("answered"); continue
        sp=p.locator(".bv-never .dialogue-box .speaker")
        who=(await sp.first.inner_text()).strip().lower() if await sp.count() else ""
        ivre=await p.locator(".bv-ivresse li.ivresse-ivre").count(); gris=await p.locator(".bv-ivresse li.ivresse-gris").count()
        if "answered" in got and who==name.lower() and "pa" not in got: await snap("02-replique-joueur-reponse"); got.add("pa"); got.add("wantr")
        elif "wantr" in got and who in ("bellirith","valurn") and "r" not in got and (await p.locator(".bv-never .dialogue-box p").first.inner_text()).strip() in RX: await snap("03-reaction"); got.add("r")
        if "chose" in got and who==name.lower() and "ps" not in got and "pa" in got: await snap("04-replique-joueur-affirmation"); got.add("ps")
        if gris and "g" not in got: await snap("05-jauges-gris"); got.add("g")
        if ivre and "i" not in got: await snap("06-jauges-ivre"); got.add("i")
        if await p.locator(".bv-fin").count(): await snap("07-fin-jauges"); break
        btn=p.locator(".bv-never .bv-advance")
        if await btn.count(): await btn.first.click(); await p.wait_for_timeout(80)
        else: break
    print(tag, sorted(got), "errors", [e for e in errs if e[0]=="pageerror"][:3])
    await b.close()
async def main():
    async with async_playwright() as pw:
        for v in VPS: await run(pw,*v)
asyncio.run(main())
