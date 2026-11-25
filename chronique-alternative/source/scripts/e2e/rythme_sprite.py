"""Jeu de rythme : visibilité du sprite d'Hylee pendant une partie complète (mode auto), échantillonnée toutes les 250 ms.
Option FAIL=1 : réseau instable simulé (deux échecs par humeur, plus une coupure de 4 s en pleine partie) : le sprite doit rester visible.
Usage : CA_BASE=... python3 rythme_sprite.py saves/save-rythme.json <dossier> 1024x880 [toucher]"""
import os, sys, asyncio, json
from playwright.async_api import async_playwright
from common import *
SAVE=open(sys.argv[1]).read(); OUT=sys.argv[2]; VP=sys.argv[3]; TOUCH=len(sys.argv)>4 and sys.argv[4]=="toucher"
FAIL=os.environ.get("FAIL")=="1"; SLOW=int(os.environ.get("SLOW","0"))
W,H=[int(x) for x in VP.rstrip("t").split("x")]
os.makedirs(OUT, exist_ok=True)
PROBE="""()=>{const sec=document.querySelector('.interactive-intimacy'); const img=document.querySelector('.intimacy-sprite img'); const cg=document.querySelector('.intimacy-cg img');
 const target=img||cg; if(!target) return {ok:false, why:'aucune image'};
 const r=target.getBoundingClientRect(); const cs=getComputedStyle(target); const wrap=target.parentElement; const ws=getComputedStyle(wrap);
 const vw=innerWidth, vh=innerHeight; const visW=Math.max(0,Math.min(r.right,vw)-Math.max(r.left,0)), visH=Math.max(0,Math.min(r.bottom,vh)-Math.max(r.top,0));
 const frac=r.width*r.height? (visW*visH)/(r.width*r.height):0;
 const op=+cs.opacity*+ws.opacity;
 const ok=!target.hidden && cs.display!=='none' && cs.visibility!=='hidden' && op>0.3 && target.naturalWidth>0 && frac>0.85 && r.height>vh*0.25;
 return {ok, kind: img?'sprite':'cg', hidden:target.hidden, op:+op.toFixed(2), frac:+frac.toFixed(2), h:Math.round(r.height), top:Math.round(r.top), bottom:Math.round(r.bottom), complete:target.complete, nw:target.naturalWidth, src:(target.currentSrc||target.src).split('/').slice(-1)[0], fallback:target.dataset.spriteFallback||'', transform:cs.transform, scale:cs.scale, shake:sec?sec.style.getPropertyValue('--rythme-secousse'):''};}"""
async def main():
  async with async_playwright() as pw:
    b=await pw.chromium.launch(executable_path=os.environ.get("CA_CHROME") or None, args=["--autoplay-policy=no-user-gesture-required"])
    ctx=await b.new_context(viewport={"width":W,"height":H},has_touch=TOUCH,is_mobile=TOUCH)
    await ctx.add_init_script("if(!sessionStorage.getItem('seeded')){localStorage.setItem('sylvinia-liens-autosave',%s);localStorage.removeItem('sylvinia_ca_rythme_v1');localStorage.setItem('sylvinia_ca_rythme_prefs_v1',JSON.stringify({auto:true,difficulty:'normal'}));sessionStorage.setItem('seeded','1')}"%json.dumps(SAVE))
    failed={}; requests=[]; outage={'on':False}
    async def route(r):
        u=r.request.url
        if "/sprites-intimate/hylee/" in u:
            mood=u.split("/")[-1]; requests.append(mood)
            n=failed.get(mood,0)
            # Panne simulée : les deux premières requêtes de chaque humeur échouent, puis toute requête pendant une coupure de 4 s en pleine partie.
            if FAIL and (n<2 or outage["on"]): failed[mood]=n+1; await r.abort(); return
            if SLOW: await asyncio.sleep(SLOW/1000)
        await r.continue_()
    await ctx.route("**/*", route)
    p=await ctx.new_page(); errs=[]; hook(p,errs); p.set_default_timeout(9000)
    await p.goto(BASE); await p.wait_for_timeout(900); await p.keyboard.press("Enter"); await p.wait_for_timeout(900)
    await p.click(".t-item.principal"); await p.wait_for_timeout(2000); await close_modals(p)
    for i in range(4):
        if await p.locator("dialog[open], .modal-backdrop").count()==0: break
        await p.keyboard.press("Escape"); await p.wait_for_timeout(300)
    await p.keyboard.press("Escape"); await p.wait_for_timeout(600)
    await p.locator("dialog[open] button:has-text('Options'), button:has-text('Options')").first.click(); await p.wait_for_timeout(700)
    await p.locator(".opt-cat:has-text('Session'), [data-otab=session]").first.click(); await p.wait_for_timeout(500)
    await p.locator("#caDevRythme").click(); await p.wait_for_timeout(1500)
    await p.locator(".rythme-actions button:has-text('Commencer')").click()
    samples=[]; shots=0
    for i in range(400):
        ph=await p.evaluate("()=>window.__sylviniaRythme?window.__sylviniaRythme.phase():null")
        if ph in ("result",None) and i>10: break
        tt=await p.evaluate("()=>window.__sylviniaRythme?window.__sylviniaRythme.time():0"); outage["on"]=FAIL and 20<=tt<24
        s=await p.evaluate(PROBE); s["t"]=await p.evaluate("()=>+window.__sylviniaRythme.time().toFixed(2)"); s["phase"]=ph; samples.append(s)
        if not s["ok"] and shots<3:
            shots+=1; await p.screenshot(path=f"{OUT}/{VP}-sprite-perdu-{shots}.png")
        await p.wait_for_timeout(250)
    bad=[s for s in samples if not s["ok"]]
    # Plus longue absence consécutive : avec un réseau en panne, un échantillon isolé (le temps de recharger le secours) est toléré.
    streak=run=0
    for s in samples:
        run=run+1 if not s["ok"] else 0; streak=max(streak,run)
    rep={"viewport":VP,"fail_mode":FAIL,"samples":len(samples),"invisible":len(bad),"plus_longue_absence":streak,"first_bad":bad[:3],"moods":sorted(set(s["src"] for s in samples)),"min_frac":min(s["frac"] for s in samples) if samples else None,"min_op":min(s["op"] for s in samples) if samples else None,"requests":len(requests),"aborted":sum(failed.values()),"errors":[e for e in errs if "menu" not in e[1]][:5]}
    print(json.dumps(rep,ensure_ascii=False,indent=1))
    json.dump({"rapport":rep,"samples":samples},open(f"{OUT}/{VP}-sprite{'-reseau' if FAIL else ''}.json","w"),ensure_ascii=False,indent=1)
    await b.close()
    ok=(streak<=1 if FAIL else not bad) and len(samples)>200
    print("OK" if ok else "ECHEC")
    sys.exit(0 if ok else 1)
asyncio.run(main())
