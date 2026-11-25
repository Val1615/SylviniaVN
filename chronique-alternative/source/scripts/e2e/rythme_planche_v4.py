"""Jeu de rythme v4 : planche figée (horloge Playwright) de chaque phase, au repos puis au plus fort de son geste.
Main : étirement vertical ; bouche : hochement incliné ; langue : ondulation et frissons ; positions : secousse.
Lecture auto ; le cadre du sprite au repos (cyan) et pendant le geste (rose) est relevé pour la planche.
Usage : CA_BASE=... python3 rythme_planche_v4.py saves/save-rythme.json <dossier> 1024x880 [toucher]"""
import os, sys, asyncio, json
from playwright.async_api import async_playwright
from common import *
SAVE=open(sys.argv[1]).read(); OUT=sys.argv[2]; VP=sys.argv[3]; TOUCH=len(sys.argv)>4 and sys.argv[4]=="toucher"
W,H=[int(x) for x in VP.rstrip("t").split("x")]
os.makedirs(OUT, exist_ok=True)
STATE="""()=>{const r=window.__sylviniaRythme; const i=document.querySelector('.intimacy-sprite img, .intimacy-cg img'); const b=i?i.getBoundingClientRect():null;
 return {t:+r.time().toFixed(3), section:r.section(), shake:(({y,x,etire,incline,geste})=>({y,x,etire,incline,geste}))(r.shake()), sprite:b&&{top:+b.top.toFixed(1), bottom:+b.bottom.toFixed(1), left:+b.left.toFixed(1), right:+b.right.toFixed(1), hidden:i.hidden, nw:i.naturalWidth}, titre:document.querySelector('.rythme-section')?.innerText, cadence:document.querySelector('.rythme-cadence')?.innerText, ligne:r.strokeLine(), voix:r.voice(), sons:r.sfx().played};}"""
async def main():
  async with async_playwright() as pw:
    b=await pw.chromium.launch(executable_path=os.environ.get("CA_CHROME") or None, args=["--autoplay-policy=no-user-gesture-required"])
    ctx=await b.new_context(viewport={"width":W,"height":H},has_touch=TOUCH,is_mobile=TOUCH)
    await ctx.add_init_script("if(!sessionStorage.getItem('seeded')){localStorage.setItem('sylvinia-liens-autosave',%s);localStorage.removeItem('sylvinia_ca_rythme_v1');localStorage.setItem('sylvinia_ca_rythme_prefs_v1',JSON.stringify({auto:true,difficulty:'normal'}));sessionStorage.setItem('seeded','1')}"%json.dumps(SAVE))
    p=await ctx.new_page(); errs=[]; hook(p,errs); p.set_default_timeout(9000)
    await p.clock.install()
    await p.goto(BASE); await p.wait_for_timeout(900); await p.keyboard.press("Enter"); await p.wait_for_timeout(900)
    await p.click(".t-item.principal"); await p.wait_for_timeout(2000); await close_modals(p)
    for i in range(4):
        if await p.locator("dialog[open], .modal-backdrop").count()==0: break
        await p.keyboard.press("Escape"); await p.wait_for_timeout(300)
    await p.keyboard.press("Escape"); await p.wait_for_timeout(600)
    await p.locator("dialog[open] button:has-text('Options'), button:has-text('Options')").first.click(); await p.wait_for_timeout(700)
    await p.locator(".opt-cat:has-text('Session'), [data-otab=session]").first.click(); await p.wait_for_timeout(500)
    await p.locator("#caDevRythme").click(); await p.wait_for_timeout(1500)
    notes=await p.evaluate("()=>window.__sylviniaRythme.notes().map(n=>({t:n.time,k:n.kind,s:n.section,i:n.index,b:n.beat,m:n.motion||null,d:n.duration}))")
    defs=await p.evaluate("()=>window.__sylviniaRythme.sections()")
    await p.locator(".rythme-actions button:has-text('Commencer')").click()
    await p.wait_for_timeout(300)
    await p.clock.pause_at((await p.evaluate("()=>Date.now()")+50)/1000)
    async def tnow(): return await p.evaluate("()=>window.__sylviniaRythme.time()")
    async def go(target):
        for i in range(40000):
            if await tnow()>=target: return
            await p.clock.run_for(10)
    async def shot(name):
        await p.evaluate("""()=>{document.querySelectorAll('.intimacy-cg img, img[data-sprite-channel=intimate]').forEach(i=>{i.style.filter='blur(12px) brightness(.62) saturate(.55)';});}""")
        await p.clock.run_for(1)
        st=await p.evaluate(STATE); path=f"{OUT}/{VP}-v4-{name}.png"; await p.screenshot(path=path); st["capture"]=path; print(name, json.dumps(st,ensure_ascii=False), flush=True); return st
    rep={"viewport":VP,"phases":[]}
    for s,d in enumerate(defs):
        own=[n for n in notes if n["s"]==s]
        entry={"id":d["id"],"geste":d["gesture"],"titre":d["label"],"cpm":d["bpm"]}
        # Titre de phase : juste après le glissé de transition (ou le premier coup de la partie).
        await go(own[0]["t"]+0.25); entry["transition"]=await shot(f"{s}-{d['id']}-0-transition")
        # Un coup au milieu de la phase : « haut » pour la main, une tenue profonde pour la bouche.
        mid=[n for n in own if n["k"]=="tap" and (d["gesture"]!="main" or n["m"]=="haut")]
        n=mid[len(mid)//2]
        await go(n["t"]-0.03); entry["repos"]=await shot(f"{s}-{d['id']}-1-repos")
        peak={"main":0.45,"bouche":0.45,"langue":0.4}.get(d["gesture"])
        dt=n["b"]*0.9*peak if peak else 0.035
        await go(n["t"]+dt); entry["geste"]=await shot(f"{s}-{d['id']}-2-geste")
        if d["gesture"]=="bouche":
            h=[x for x in own if x["k"]=="hold"][1]
            await go(h["t"]+h["d"]*0.5); entry["tenue"]=await shot(f"{s}-{d['id']}-3-tenue-profonde")
        if d["gesture"]=="langue":
            await go(own[-1]["t"]-0.2); entry["frissons"]=await shot(f"{s}-{d['id']}-3-frissons-fin")
        rep["phases"].append(entry)
    end=await p.evaluate("()=>{const n=window.__sylviniaRythme.notes().at(-1); return n.time+n.duration;}")
    await go(end+0.04); rep["apogee"]=await shot("9-apogee")
    rep["errors"]=[e for e in errs if "favicon" not in e[1] and "chroniques-alternatives-theme" not in e[1]][:6]
    json.dump(rep,open(f"{OUT}/{VP}-v4-planche.json","w"),ensure_ascii=False,indent=1)
    await b.close()
asyncio.run(main())
