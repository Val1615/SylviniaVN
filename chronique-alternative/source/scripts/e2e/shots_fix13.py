"""Captures fix13 : haut des sprites (invitations Iriana / Remerii + scène intime).
Usage : python3 shots_fix13.py <save.json> <dossier> <prefixe> [830x525t,1024x880,880x1024t]"""
import os, sys, asyncio, json
from playwright.async_api import async_playwright
from common import *
SAVE=open(sys.argv[1]).read()
OUT=sys.argv[2]; PREFIX=sys.argv[3]
VPS=[(int(v.rstrip("t").split("x")[0]), int(v.rstrip("t").split("x")[1]), v.endswith("t")) for v in (sys.argv[4] if len(sys.argv)>4 else "830x525t,1024x880,880x1024t").split(",")]
os.makedirs(OUT, exist_ok=True)
PROBE="""()=>{const r=e=>{const b=e.getBoundingClientRect();return [Math.round(b.top),Math.round(b.bottom),Math.round(b.left),Math.round(b.right)]};
const out=[];document.querySelectorAll('.scene-cast, .scene-cast .scene-sprite, .intimacy-sprite, .intimacy-sprite img, .group-intimacy-sprite img').forEach(e=>{const cs=getComputedStyle(e);out.push({c:e.className.toString().slice(0,40),r:r(e),nat:e.naturalHeight?[e.naturalWidth,e.naturalHeight]:null,mask:(cs.maskImage||cs.webkitMaskImage||'').slice(0,30),ov:cs.overflow,tr:cs.transform.slice(0,40),scale:cs.scale})});return out}"""
async def run(pw,w,h,touch):
    b=await pw.chromium.launch(executable_path=os.environ.get("CA_CHROME") or None); ctx=await b.new_context(viewport={"width":w,"height":h},has_touch=touch,is_mobile=touch)
    await ctx.add_init_script("if(!sessionStorage.getItem('seeded')){localStorage.setItem('sylvinia-liens-autosave',%s);sessionStorage.setItem('seeded','1')}"%json.dumps(SAVE))
    p=await ctx.new_page(); errs=[]; hook(p,errs); p.set_default_timeout(9000); tag=f"{w}x{h}"
    async def snap(n):
        await p.evaluate("""()=>{document.querySelectorAll('.intimacy-cg img').forEach(i=>{i.style.filter='blur(22px) brightness(.5) saturate(.4)';});}""")
        await p.wait_for_timeout(700); path=f"{OUT}/{PREFIX}-{tag}-{n}.png"; await p.screenshot(path=path); print("shot", path)
        print(tag, n, json.dumps(await p.evaluate(PROBE)))
    async def leave():
        for i in range(30):
            if await p.locator(".dialogue-overlay, .interactive-intimacy").count()==0: return
            ch=p.locator(".choice-box button:not(.stop)")
            if await ch.count(): await ch.first.click(); await p.wait_for_timeout(300); continue
            q=p.locator(".dialogue-overlay button:has-text('Quitter'), .interactive-intimacy button:has-text('Quitter')")
            if await q.count(): await q.first.click(); await p.wait_for_timeout(400); continue
            if await p.locator(".dialogue-box").count(): await p.locator(".dialogue-box").first.click(); await p.wait_for_timeout(160)
        await close_modals(p)
    async def invitation(title, n):
        await close_modals(p)
        for i in range(3):
            if await p.locator("dialog[open], .modal-backdrop").count()==0: break
            await p.keyboard.press("Escape"); await p.wait_for_timeout(300)
        await p.locator(".hud-onglets .onglet:visible").nth(3).click(); await p.wait_for_timeout(600)
        await p.locator(".signet").nth(1).click(); await p.wait_for_timeout(500)
        await p.locator(f"button:has-text('{title}'), li:has-text('{title}'), [role=button]:has-text('{title}')").first.click(); await p.wait_for_timeout(600)
        await p.locator("button:has-text('Jouer')").first.click(); await p.wait_for_timeout(1400)
        for i in range(2):
            if await p.locator(".dialogue-box").count(): await p.locator(".dialogue-box").first.click(); await p.wait_for_timeout(250)
        await snap(n)
        await leave()
    await p.goto(BASE); await p.wait_for_timeout(900); await p.keyboard.press("Enter"); await p.wait_for_timeout(900)
    await p.click(".t-item.principal"); await p.wait_for_timeout(2000)
    await close_modals(p)
    await invitation("Un courrier du palais", "01-iriana-courrier")
    await invitation("Un détour sous les arcades", "02-remerii-arcades")
    # Scène intime : accès direct Bellirith
    for i in range(3):
        if await p.locator("dialog[open], .modal-backdrop").count()==0: break
        await p.keyboard.press("Escape"); await p.wait_for_timeout(300)
    await p.keyboard.press("Escape"); await p.wait_for_timeout(600)
    await p.locator("dialog[open] button:has-text('Options'), button:has-text('Options')").first.click(); await p.wait_for_timeout(700)
    await p.locator(".opt-cat:has-text('Session'), [data-otab=session]").first.click(); await p.wait_for_timeout(500)
    sel=p.locator(".dev-preview-grid select").first
    opts=await sel.evaluate("el=>[...el.options].map(o=>({v:o.value,t:o.textContent}))")
    pick=next((o for o in opts if 'Bellirith' in o['t']), None)
    await sel.select_option(value=pick['v'])
    await p.locator("button:has-text('Ouvrir la partie intime')").first.click(); await p.wait_for_timeout(1500)
    for i in range(4):
        if await p.locator(".dialogue-box").count(): await p.locator(".dialogue-box").first.click(); await p.wait_for_timeout(200)
    await snap("03-scene-intime")
    print(tag, "errors", [e for e in errs if e[0]!='reqfail'][:4], "reqfail", [e for e in errs if e[0]=='reqfail'][:3])
    await b.close()
async def main():
    async with async_playwright() as pw:
        for v in VPS: await run(pw,*v)
asyncio.run(main())
