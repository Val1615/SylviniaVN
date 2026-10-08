"""Captures de la série Bellirith / Naïah (mini-jeu, dossier, Q5, route Bellirith, forme, bloc développeur).
Usage : python3 shots_bn.py <save.json> <dossier> [830x525t,1024x880]"""
import os, sys, asyncio, json
from playwright.async_api import async_playwright
from common import *
SAVE=open(sys.argv[1]).read()
OUT=sys.argv[2] if len(sys.argv)>2 else "/tmp/bn-shots"
VPS=[(int(v.rstrip("t").split("x")[0]), int(v.rstrip("t").split("x")[1]), v.endswith("t")) for v in (sys.argv[3] if len(sys.argv)>3 else "830x525t,1024x880").split(",")]
os.makedirs(OUT, exist_ok=True)
log=[]
async def run(pw,w,h,touch):
    b=await pw.chromium.launch(executable_path=os.environ.get("CA_CHROME") or None); ctx=await b.new_context(viewport={"width":w,"height":h},has_touch=touch,is_mobile=touch)
    await ctx.add_init_script("if(!sessionStorage.getItem('seeded')){localStorage.setItem('sylvinia-liens-autosave',%s);sessionStorage.setItem('seeded','1')}"%json.dumps(SAVE))
    p=await ctx.new_page(); errs=[]; hook(p,errs); p.set_default_timeout(9000); tag=f"{w}x{h}"
    async def snap(n, blur=True):
        if blur: await p.evaluate("""()=>{document.querySelectorAll('.intimacy-cg img').forEach(i=>{i.style.filter='blur(22px) brightness(.5) saturate(.4)';});}""")
        await p.wait_for_timeout(450); path=f"{OUT}/{tag}-{n}.png"; await p.screenshot(path=path); log.append(path); print("shot", path)
    async def home():
        for i in range(5):
            if await p.locator(".bn-game, .bn-intimacy, .dialogue-overlay").count()==0: break
            btn=p.locator(".bn-game .bn-head-buttons button:has-text('Quitter'), .bn-intimacy .scene-outil.passer, .dialogue-overlay button:has-text('Quitter le souvenir'), .interactive-intimacy button:has-text('Quitter')")
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
        h3=p.locator("h3:has-text('Bellirith / Naïah')").first
        await h3.scroll_into_view_if_needed(); await p.wait_for_timeout(300)
        return h3
    async def devbtn(label):
        await dev()
        await p.locator(f"button:has-text('{label}')").first.click(); await p.wait_for_timeout(1200)
    await p.goto(BASE); await p.wait_for_timeout(900); await p.keyboard.press("Enter"); await p.wait_for_timeout(900)
    await p.click(".t-item.principal"); await p.wait_for_timeout(2000)
    await close_modals(p)
    # Dossier du Journal
    tab=lambda i: p.locator(".hud-onglets .onglet").nth(i)
    try:
        await tab(3).click(); await p.wait_for_timeout(800)
        await p.locator(".signet:has-text('Croisées')").first.click(); await p.wait_for_timeout(800)
        d=p.locator(".bn-dossier").first
        if await d.count(): await d.scroll_into_view_if_needed(); await snap("04-journal-dossier", False)
        else: print(tag, "no dossier"); await snap("04-journal-fail", False)
    except Exception as e: print(tag, "journal", e)
    # Bloc développeur
    h3=await dev(); await p.evaluate("()=>{const h=[...document.querySelectorAll('h3')].find(x=>x.textContent.includes('Bellirith / Naïah'));h&&h.scrollIntoView({block:'start'})}"); await snap("08-dev-block", False)
    # Mini-jeu : didacticiel
    await p.locator("button:has-text('Lancer le mini-jeu')").first.click(); await p.wait_for_timeout(1000)
    for i in range(12):
        if await p.locator(".bn-moves").count(): break
        if await p.locator(".bn-line").count(): await p.locator(".bn-line").first.click(); await p.wait_for_timeout(200)
    await snap("01-minigame-tutorial", False)
    # manche normale
    await home(); await dev()
    sel=p.locator("label:has-text('Manche') select").first; await sel.select_option(value="2")
    await p.locator("button:has-text('Forcer la manche')").first.click(); await p.wait_for_timeout(1000)
    await snap("02-minigame-round", False)
    await p.locator(".bn-move").nth(1).click(); await p.wait_for_timeout(500)
    for i in range(10):
        if await p.locator(".bn-result").count(): break
        if await p.locator(".bn-line").count(): await p.locator(".bn-line").first.click(); await p.wait_for_timeout(200)
    await snap("02b-minigame-result", False)
    # manche hors échelle
    await home(); await devbtn("Manche hors échelle"); await snap("03-minigame-anomaly", False)
    # Q5 explicite : avancer jusqu’au sprite nu de Bellirith
    await home(); await dev()
    await p.locator("label:has-text('Mode') select").first.select_option(value="explicite")
    await p.locator("button:has-text('Même là')").first.click(); await p.wait_for_timeout(1200)
    for i in range(160):
        nude=await p.locator(".bn-intimacy img[data-bn-sprite=bellirith][data-sprite-channel=intimate]").count()
        if nude: break
        if not await p.locator(".bn-intimacy .dialogue-box").count(): break
        await p.locator(".bn-intimacy .dialogue-box").first.click(); await p.wait_for_timeout(120)
    for i in range(2): await p.locator(".bn-intimacy .dialogue-box").first.click(); await p.wait_for_timeout(150)
    await snap("05-q5-bellirith-nude")
    # Forme au rendez-vous final
    await home(); await devbtn("Ouvrir le rendez-vous final")
    for i in range(60):
        if await p.locator(".bn-form-sprite").count(): break
        if await p.locator(".dialogue-overlay .dialogue-box").count(): await p.locator(".dialogue-overlay .dialogue-box").first.click(); await p.wait_for_timeout(150)
    await snap("07a-amanea-form-appears", False)
    for i in range(80):
        if await p.locator(".choice-box button").count():
            await p.locator(".choice-box button").nth(1).click(); await p.wait_for_timeout(400); continue
        if await p.locator(".bn-form-sprite.active").count(): break
        if await p.locator(".dialogue-overlay .dialogue-box").count(): await p.locator(".dialogue-overlay .dialogue-box").first.click(); await p.wait_for_timeout(150)
        else: break
    await snap("07-amanea-form", False)
    # Route Bellirith existante avec nouveau sprite (accès direct aux scènes intimes)
    await home(); await dev()
    sel=p.locator(".dev-preview-grid select").first
    opts=await sel.evaluate("el=>[...el.options].map(o=>({v:o.value,t:o.textContent}))")
    pick=next((o for o in opts if 'Bellirith' in o['t']), None); print(tag, "bellirith route", pick)
    if pick:
        await sel.select_option(value=pick['v'])
        await p.locator("button:has-text('Ouvrir la partie intime')").first.click(); await p.wait_for_timeout(1500)
        for i in range(200):
            if await p.locator("img[data-sprite-channel=intimate][src*='sprites-intimate/bellirith']").count(): break
            ch=p.locator(".choice-box .v2-choix-carte:not(.stop), .choice-box button:not(.stop)")
            if await ch.count(): await ch.first.click(); await p.wait_for_timeout(300); continue
            if await p.locator(".dialogue-box").count(): await p.locator(".dialogue-box").first.click(); await p.wait_for_timeout(110)
            else: break
        await snap("06-bellirith-route-sprite")
    print(tag, "errors", [e for e in errs if e[0]!='reqfail'][:4], "reqfail", [e for e in errs if e[0]=='reqfail'][:4])
    await b.close()
async def main():
    async with async_playwright() as pw:
        for v in VPS: await run(pw,*v)
asyncio.run(main())
