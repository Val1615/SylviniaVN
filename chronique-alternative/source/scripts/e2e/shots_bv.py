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
    tab=lambda i: p.locator(".hud-onglets .onglet").nth(i)
    try:
        await tab(3).click(); await p.wait_for_timeout(800)
        await p.locator(".signet:has-text('Croisées')").first.click(); await p.wait_for_timeout(800)
        d=p.locator(".bv-dossier").first
        if await d.count(): await d.scroll_into_view_if_needed(); await snap("01-journal-dossier")
        else: print(tag, "no dossier")
    except Exception as e: print(tag, "journal", e)
    await dev(); await snap("02-dev-block")
    # Quête Q1
    await p.locator("button:has-text('Les comptes de famille')").last.click(); await p.wait_for_timeout(1200)
    for i in range(3):
        if await p.locator(".dialogue-overlay .dialogue-box").count(): await p.locator(".dialogue-overlay .dialogue-box").first.click(); await p.wait_for_timeout(200)
    await snap("03-quete-q1")
    for i in range(80):
        if await p.locator(".choice-box button").count(): break
        if not await p.locator(".dialogue-overlay .dialogue-box").count(): break
        await p.locator(".dialogue-overlay .dialogue-box").first.click(); await p.wait_for_timeout(120)
    await snap("04-quete-q1-choix")
    # Je n’ai jamais
    await home(); await dev()
    await p.locator("button:has-text('Je n’ai jamais')").first.click(); await p.wait_for_timeout(1000)
    await snap("05-jeu-debut")
    shot_opts=False; shot_reveal=False
    for i in range(400):
        if await p.locator(".bv-options .bn-move").count():
            if not shot_opts: await snap("06-jeu-options"); shot_opts=True
            await p.locator(".bv-options .bn-move").nth(i%4).click(); await p.wait_for_timeout(200); continue
        if await p.locator(".bv-answers .bn-move").count():
            await snap("07-jeu-aveu"); await p.locator(".bv-answers .bn-move").first.click(); await p.wait_for_timeout(200); continue
        txt=await p.locator(".bn-statement").first.inner_text() if await p.locator(".bn-statement").count() else ""
        if not shot_reveal and "talisman" in txt.lower() and await p.locator(".bv-glasses li.drank").count():
            await snap("08-jeu-revelation"); shot_reveal=True
        if await p.locator(".bn-result.fin").count(): await snap("09-jeu-fin"); break
        btn=p.locator(".bn-game-foot > button")
        if await btn.count(): await btn.first.click(); await p.wait_for_timeout(90)
        else: break
    # Intimité A explicite
    await home(); await dev()
    await p.locator("label:has-text('Mode') select").last.select_option(value="explicite")
    await p.locator("button:has-text('Bellirith, seule')").first.click(); await p.wait_for_timeout(1200)
    for i in range(80):
        if await p.locator(".bv-intimacy img[data-sprite-channel=intimate]").count(): break
        if not await p.locator(".bv-intimacy .dialogue-box").count(): break
        await p.locator(".bv-intimacy .dialogue-box").first.click(); await p.wait_for_timeout(110)
    await snap("10-intimite-a")
    print(tag, "errors", [e for e in errs if e[0]!='reqfail'][:4], "reqfail", [e for e in errs if e[0]=='reqfail'][:4])
    await b.close()
async def main():
    async with async_playwright() as pw:
        for v in VPS: await run(pw,*v)
asyncio.run(main())
