"""Jeu de rythme v3 : captures figées (horloge Playwright) d'un palier de combo et de la secousse du sprite.
Lecture auto ; l'horloge est mise en pause au moment voulu, la capture montre donc l'image exacte du jeu à cet instant.
Usage : CA_BASE=... python3 rythme_planche_v3.py saves/save-rythme.json <dossier> 1024x880 [toucher]"""
import os, sys, asyncio, json
from playwright.async_api import async_playwright
from common import *
SAVE=open(sys.argv[1]).read(); OUT=sys.argv[2]; VP=sys.argv[3]; TOUCH=len(sys.argv)>4 and sys.argv[4]=="toucher"
W,H=[int(x) for x in VP.rstrip("t").split("x")]
os.makedirs(OUT, exist_ok=True)
STATE="""()=>{const r=window.__sylviniaRythme; const i=document.querySelector('.intimacy-sprite img, .intimacy-cg img'); const b=i?i.getBoundingClientRect():null; const l=document.querySelector('.rythme-layer');
 return {t:+r.time().toFixed(3), combo:r.combo().current, shake:r.shake(), sprite:b&&{top:+b.top.toFixed(1), bottom:+b.bottom.toFixed(1), left:+b.left.toFixed(1), right:+b.right.toFixed(1), h:+b.height.toFixed(1), hidden:i.hidden, nw:i.naturalWidth}, classes:l.className, eclat:(document.querySelector('.rythme-combo-eclat')||{}).innerText||null, ardeur:+r.ardour().toFixed(2), section:document.querySelector('.rythme-section')?.innerText};}"""
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
    notes=await p.evaluate("()=>window.__sylviniaRythme.notes().map(n=>({t:n.time,k:n.kind,s:n.section,i:n.index}))")
    await p.locator(".rythme-actions button:has-text('Commencer')").click()
    await p.wait_for_timeout(300)
    # pause_at attend des secondes côté Python
    await p.clock.pause_at((await p.evaluate("()=>Date.now()")+50)/1000)
    async def tnow(): return await p.evaluate("()=>window.__sylviniaRythme.time()")
    async def go(target):
        for i in range(20000):
            if await tnow()>=target: return
            await p.clock.run_for(10)
    async def shot(name):
        await p.evaluate("""()=>{document.querySelectorAll('.intimacy-cg img, img[data-sprite-channel=intimate]').forEach(i=>{i.style.filter='blur(12px) brightness(.62) saturate(.55)';});}""")
        await p.clock.run_for(1)
        st=await p.evaluate(STATE); path=f"{OUT}/{VP}-v3-{name}.png"; await p.screenshot(path=path); st["capture"]=path; print(name, json.dumps(st,ensure_ascii=False), flush=True); return st
    rep={"viewport":VP,"captures":{}}
    taps=[n for n in notes if n["k"]=="tap"]
    def tap_after(sec, frac):
        own=[n for n in taps if n["s"]==sec]; return own[int(len(own)*frac)]
    # 1. Palier de combo 24 (troisième palier, triple battement), juste après le coup
    c24=notes[23]["t"]
    await go(c24+0.06); rep["captures"]["combo-24"]=await shot("01-combo-24-eclat")
    await go(c24+0.27); rep["captures"]["combo-24-second"]=await shot("02-combo-24-deuxieme-battement")
    # 2. Secousse verticale (Renversée) : repos puis poussée et rebond
    n=tap_after(2,0.6)
    await go(n["t"]-0.04); rep["captures"]["vertical-repos"]=await shot("03-renversee-repos")
    await go(n["t"]+0.035); rep["captures"]["vertical-poussee"]=await shot("04-renversee-poussee")
    await go(n["t"]+0.115); rep["captures"]["vertical-rebond"]=await shot("05-renversee-rebond")
    # 3. Secousse en profondeur (Face à face), au plus fort de la montée
    n=tap_after(3,0.75)
    await go(n["t"]-0.03); rep["captures"]["profondeur-repos"]=await shot("06-face-repos")
    await go(n["t"]+0.035); rep["captures"]["profondeur-poussee"]=await shot("07-face-poussee")
    # 4. Palier de combo en pleine montée (×96), puis apogée
    c96=notes[95]["t"]
    await go(c96+0.06); rep["captures"]["combo-96"]=await shot("08-combo-96")
    fin=[x for x in notes if x["k"]=="final"][0]
    end=await p.evaluate("()=>{const n=window.__sylviniaRythme.notes().at(-1); return n.time+n.duration;}")
    await go(end+0.04); rep["captures"]["apogee"]=await shot("09-apogee")
    rep["errors"]=[e for e in errs if "favicon" not in e[1]][:6]
    json.dump(rep,open(f"{OUT}/{VP}-v3-planche.json","w"),ensure_ascii=False,indent=1)
    await b.close()
asyncio.run(main())
