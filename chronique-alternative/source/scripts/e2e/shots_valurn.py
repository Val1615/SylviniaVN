"""Captures de la refonte Valurn (Acte I) : quête Q1, journal, registre du salon (Q5), bloc développeur.
Usage : CA_CHROME=/usr/bin/google-chrome python3 shots_valurn.py saves/save-valurn.json <dossier> 830x525,1024x880"""
import os, sys, asyncio, json
from playwright.async_api import async_playwright
from common import *
SAVE=open(sys.argv[1]).read()
OUT=sys.argv[2] if len(sys.argv)>2 else "/tmp/valurn-shots"
VPS=[tuple(int(x) for x in v.split("x")) for v in (sys.argv[3] if len(sys.argv)>3 else "830x525,1024x880").split(",")]
os.makedirs(OUT, exist_ok=True)
async def run(pw,w,h):
    b=await pw.chromium.launch(executable_path=os.environ.get("CA_CHROME") or None); ctx=await b.new_context(viewport={"width":w,"height":h})
    await ctx.add_init_script("if(!sessionStorage.getItem('seeded')){localStorage.setItem('sylvinia-liens-autosave',%s);sessionStorage.setItem('seeded','1')}"%json.dumps(SAVE))
    p=await ctx.new_page(); errs=[]; hook(p,errs); p.set_default_timeout(9000); tag=f"{w}x{h}"
    async def snap(n):
        await p.wait_for_timeout(450); path=f"{OUT}/{tag}-{n}.png"; await p.screenshot(path=path); print("shot", path)
    async def dev(label=None):
        for i in range(4):
            if await p.locator("dialog[open], .modal-backdrop").count()==0: break
            await p.keyboard.press("Escape"); await p.wait_for_timeout(300)
        await p.keyboard.press("Escape"); await p.wait_for_timeout(600)
        await p.locator("button:has-text('Options')").first.click(); await p.wait_for_timeout(700)
        await p.locator(".opt-cat:has-text('Session'), [data-otab=session]").first.click(); await p.wait_for_timeout(500)
        await p.evaluate("()=>{const h=[...document.querySelectorAll('h3')].find(x=>x.textContent.includes('Valurn'));h&&h.scrollIntoView({block:'start'})}")
        if label: await p.locator(f"button:has-text('{label}')").first.click(); await p.wait_for_timeout(700)
    async def leave():
        await p.wait_for_timeout(600)
        await p.reload(); await p.wait_for_timeout(900); await p.keyboard.press("Enter"); await p.wait_for_timeout(900)
        await p.click(".t-item.principal"); await p.wait_for_timeout(2000); await close_modals(p)
    await p.goto(BASE); await p.wait_for_timeout(900); await p.keyboard.press("Enter"); await p.wait_for_timeout(900)
    await p.click(".t-item.principal"); await p.wait_for_timeout(2000); await close_modals(p)
    await dev("Q1"); await snap("08-dev-block"); await leave()
    # Quête Q1 : ouvrir la scène par l'intermédiaire du personnage présent
    try:
        btn=p.locator("button:has-text('Valurn')")
        pass
        await btn.first.click(); await p.wait_for_timeout(900)
        q=p.locator("button:has-text('La première mise'), button:has-text('Écouter'), button:has-text('Parler')")
        if await q.count(): await q.first.click(); await p.wait_for_timeout(1200)
        for i in range(3):
            if await p.locator(".dialogue-box").count(): await p.locator(".dialogue-box").first.click(); await p.wait_for_timeout(300)
        await snap("01-q1-scene")
    except Exception as e: print(tag, "q1", e)
    await leave()
    # Journal
    try:
        await p.locator(".hud-onglets .onglet").nth(3).click(); await p.wait_for_timeout(800)
        await p.locator("[data-jtab=relations]").first.click(); await p.wait_for_timeout(800)
        e=p.locator(".valurn-journal-entry").first
        if await e.count(): await e.scroll_into_view_if_needed()
        await snap("02-journal")
    except Exception as e: print(tag, "journal", e)
    await leave()
    # Registre du salon
    try:
        await dev("Marché en attente"); await leave()
        await p.locator(".hud-onglets .onglet").nth(3).click(); await p.wait_for_timeout(800)
        await p.locator("[data-jtab=relations]").first.click(); await p.wait_for_timeout(800)
        r=p.locator("button:has-text('Reprendre le registre du salon')").first; await r.scroll_into_view_if_needed()
        await p.locator("button:has-text('Reprendre le registre du salon')").first.click(); await p.wait_for_timeout(1200)
        await snap("03-market-open")
        for i in range(6):
            bs=p.locator(".modal-backdrop button:not(.modal-close)")
            if not await bs.count(): break
            await bs.first.click(); await p.wait_for_timeout(500)
        await snap("04-market-progress")
    except Exception as e: print(tag, "market", e)
    print(tag, "errors", [e for e in errs if e[0]=="pageerror"][:5])
    await b.close()
async def main():
    async with async_playwright() as pw:
        for w,h in VPS: await run(pw,w,h)
asyncio.run(main())
