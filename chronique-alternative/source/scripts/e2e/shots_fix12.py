"""Captures fix12 : fondu bas des sprites, bouton Retour, Historique (scène normale + scène intime).
Usage : python3 shots_fix12.py <save.json> <dossier> <prefixe> [830x525t,1024x880] [--hud]"""
import os, sys, asyncio, json
from playwright.async_api import async_playwright
from common import *
SAVE=open(sys.argv[1]).read()
OUT=sys.argv[2]; PREFIX=sys.argv[3]
VPS=[(int(v.rstrip("t").split("x")[0]), int(v.rstrip("t").split("x")[1]), v.endswith("t")) for v in (sys.argv[4] if len(sys.argv)>4 else "830x525t,1024x880").split(",")]
HUD="--hud" in sys.argv
os.makedirs(OUT, exist_ok=True)
async def run(pw,w,h,touch):
    b=await pw.chromium.launch(executable_path=os.environ.get("CA_CHROME") or None); ctx=await b.new_context(viewport={"width":w,"height":h},has_touch=touch,is_mobile=touch)
    await ctx.add_init_script("if(!sessionStorage.getItem('seeded')){localStorage.setItem('sylvinia-liens-autosave',%s);sessionStorage.setItem('seeded','1')}"%json.dumps(SAVE))
    p=await ctx.new_page(); errs=[]; hook(p,errs); p.set_default_timeout(9000); tag=f"{w}x{h}"
    async def snap(n):
        await p.evaluate("""()=>{document.querySelectorAll('.intimacy-cg img').forEach(i=>{i.style.filter='blur(22px) brightness(.5) saturate(.4)';});}""")
        await p.wait_for_timeout(500); path=f"{OUT}/{PREFIX}-{tag}-{n}.png"; await p.screenshot(path=path); print("shot", path)
    async def home():
        for i in range(5):
            if await p.locator(".bn-game, .bn-intimacy, .dialogue-overlay, .interactive-intimacy").count()==0: break
            btn=p.locator(".dialogue-overlay button:has-text('Quitter le souvenir'), .interactive-intimacy button:has-text('Quitter'), .bn-intimacy .scene-outil.passer")
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
    async def advance(n):
        for i in range(n):
            ch=p.locator(".choice-box button:not(.stop)")
            if await ch.count(): await ch.first.click(); await p.wait_for_timeout(350); continue
            if await p.locator(".dialogue-box").count(): await p.locator(".dialogue-box").first.click(); await p.wait_for_timeout(160)
    await p.goto(BASE); await p.wait_for_timeout(900); await p.keyboard.press("Enter"); await p.wait_for_timeout(900)
    await p.click(".t-item.principal"); await p.wait_for_timeout(2000)
    await close_modals(p)
    # Scène normale : rendez-vous final Bellirith / Naïah (deux sprites)
    await dev(); await p.locator("button:has-text('Ouvrir le rendez-vous final')").first.click(); await p.wait_for_timeout(1300)
    for i in range(40):
        if await p.locator(".scene-cast .scene-sprite").count()>=2: break
        await advance(1)
    await advance(3)
    await snap("01-scene-normale")
    if HUD:
        txt=lambda: p.locator(".dialogue-box p").first.inner_text()
        await advance(2); before=await txt(); await advance(1); after=await txt()
        back=p.locator("[data-act=back]")
        print(tag, "back enabled", await back.count() and await back.first.is_enabled())
        await back.first.click(); await p.wait_for_timeout(300)
        print(tag, "normal: retour réaffiche la réplique précédente", await txt()==before, "(quittée:", after[:30], ")")
        await p.keyboard.press("ArrowLeft"); await p.wait_for_timeout(300); await p.keyboard.press("ArrowLeft"); await p.wait_for_timeout(300)
        await advance(2); print(tag, "normal: ← ← puis 2 avancées retombe sur la même réplique", await txt()==before)
        await snap("02-scene-normale-retour")
        await p.keyboard.press("h"); await p.wait_for_timeout(500)
        lines=await p.locator(".scene-backlog .backlog-ligne p").all_inner_texts()
        dups=sum(1 for a,b2 in zip(lines,lines[1:]) if a==b2)
        print(tag, "normal: historique", len(lines), "lignes, doublons consécutifs", dups, "dernière = réplique affichée", lines[-1]==before if lines else None)
        await snap("03-scene-normale-historique")
        await p.keyboard.press("Escape"); await p.wait_for_timeout(300)
    # Scène intime : accès direct Bellirith
    await home(); await dev()
    sel=p.locator(".dev-preview-grid select").first
    opts=await sel.evaluate("el=>[...el.options].map(o=>({v:o.value,t:o.textContent}))")
    pick=next((o for o in opts if 'Bellirith' in o['t']), None)
    await sel.select_option(value=pick['v'])
    await p.locator("button:has-text('Ouvrir la partie intime')").first.click(); await p.wait_for_timeout(1500)
    for i in range(200):
        if await p.locator("img[data-sprite-channel=intimate][src*='sprites-intimate/bellirith']").count(): break
        ch=p.locator(".choice-box .v2-choix-carte:not(.stop), .choice-box button:not(.stop)")
        if await ch.count(): await ch.first.click(); await p.wait_for_timeout(300); continue
        if await p.locator(".dialogue-box").count(): await p.locator(".dialogue-box").first.click(); await p.wait_for_timeout(110)
        else: break
    for i in range(3):
        if await p.locator(".dialogue-box").count(): await p.locator(".dialogue-box").first.click(); await p.wait_for_timeout(150)
    await snap("04-scene-intime")
    if HUD:
        txt=lambda: p.locator(".dialogue-box p").first.inner_text()
        before=await txt(); await p.locator(".dialogue-box").first.click(); await p.wait_for_timeout(200)
        back=p.locator("[data-act=back]")
        print(tag, "intime: back enabled", await back.count() and await back.first.is_enabled())
        if await back.count(): await back.first.click(); await p.wait_for_timeout(300)
        print(tag, "intime: retour réaffiche la réplique précédente", await txt()==before)
        await snap("05-scene-intime-retour")
        await p.keyboard.press("h"); await p.wait_for_timeout(500)
        lines=await p.locator(".scene-backlog .backlog-ligne p").all_inner_texts()
        dups=sum(1 for a,b2 in zip(lines,lines[1:]) if a==b2)
        print(tag, "intime: historique", len(lines), "lignes, doublons consécutifs", dups, "dernière = réplique affichée", lines[-1]==before if lines else None)
        await snap("06-scene-intime-historique")
    print(tag, "errors", [e for e in errs if e[0]!='reqfail'][:4], "reqfail", [e for e in errs if e[0]=='reqfail'][:4])
    await b.close()
async def main():
    async with async_playwright() as pw:
        for v in VPS: await run(pw,*v)
asyncio.run(main())
