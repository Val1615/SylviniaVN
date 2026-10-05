import os, sys, asyncio, json
from playwright.async_api import async_playwright
from common import *
SAVE=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),"saves","save-intime.json")).read()
OUT=sys.argv[1] if len(sys.argv)>1 else "/workspace/integration/shots/intime"
os.makedirs(OUT, exist_ok=True)
VPS=[(830,525,True),(1920,1080,False)]
async def run(pw,w,h,touch):
    b=await pw.chromium.launch(); ctx=await b.new_context(viewport={"width":w,"height":h},has_touch=touch,is_mobile=touch)
    p=await ctx.new_page(); errs=[]; hook(p,errs); p.set_default_timeout(9000); tag=f"{w}x{h}"
    async def snap(n):
        await p.evaluate("""()=>{document.querySelectorAll('.intimacy-cg img').forEach(i=>{i.style.filter='blur(22px) brightness(.5) saturate(.4)';});}""")
        await p.wait_for_timeout(500); await p.screenshot(path=f"{OUT}/{tag}-{n}.png")
    await p.goto(BASE); await p.evaluate("(s)=>localStorage.setItem('sylvinia-liens-autosave',s)", SAVE)
    await p.goto(BASE); await p.wait_for_timeout(900); await p.keyboard.press("Enter"); await p.wait_for_timeout(900)
    await p.click(".t-item.principal"); await p.wait_for_timeout(2000)
    for i in range(4):
        if await p.locator("dialog[open], .modal-backdrop").count()==0: break
        await p.keyboard.press("Escape"); await p.wait_for_timeout(350)
    await p.keyboard.press("Escape"); await p.wait_for_timeout(700)
    await p.locator("dialog[open] button:has-text('Options'), button:has-text('Options')").first.click(); await p.wait_for_timeout(800)
    await p.locator(".opt-cat:has-text('Session'), [data-otab=session]").first.click(); await p.wait_for_timeout(600)
    # ensure developer panel expanded/visible
    if await p.locator("button:has-text('Activer le mode développeur')").count():
        await p.locator("button:has-text('Activer le mode développeur')").click(); await p.wait_for_timeout(500)
    await p.locator(".dev-panel, .v2-dev").first.scroll_into_view_if_needed()
    await p.wait_for_timeout(400)
    # pick a Hylee/Naiah date in solo select
    sel=p.locator(".dev-preview-grid select").first
    if await sel.count():
        opts=await sel.evaluate("el=>[...el.options].map(o=>({v:o.value,t:o.textContent}))")
        pick=next((o for o in opts if 'Hylee' in o['t'] or 'Naïah' in o['t'] or 'Naiah' in o['t']), opts[0] if opts else None)
        print(tag, "options", len(opts), "pick", pick)
        if pick: await sel.select_option(value=pick['v'])
    await p.locator("button:has-text('Ouvrir la partie intime')").first.click(); await p.wait_for_timeout(1800)
    print(tag, "intime?", await p.locator(".v2-scene-intime").count(), "classes", await p.evaluate("()=>document.querySelector('.interactive-intimacy')?.className"))
    if await p.locator(".v2-scene-intime, .interactive-intimacy").count():
        await snap("01-ligne")
        for i in range(8):
            if await p.locator(".choice-box button").count() or not await p.locator(".dialogue-box").count(): break
            await p.locator(".dialogue-box").first.click(); await p.wait_for_timeout(220)
        if await p.locator(".choice-box .v2-choix-carte").count(): await snap("02-choix")
        # force a couple backlog entries then open
        await p.locator("[data-act=backlog]").click(); await p.wait_for_timeout(500); await snap("03-historique"); await p.keyboard.press("Escape"); await p.wait_for_timeout(300)
        # take choice
        if await p.locator(".choice-box .v2-choix-carte:not(.stop)").count():
            await p.locator(".choice-box .v2-choix-carte:not(.stop)").first.click(); await p.wait_for_timeout(900); await snap("04-suite")
    else:
        await p.screenshot(path=f"{OUT}/{tag}-fail-options.png")
        print(tag, "buttons", await buttons(p, ".v2-dev, .dev-panel"))
    print(tag, [e for e in errs if e[0]!='reqfail'][:3]); await b.close()
async def main():
    async with async_playwright() as pw:
        for v in VPS: await run(pw,*v)
asyncio.run(main())
