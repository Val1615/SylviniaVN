"""Jeu de rythme v5 : version Suggestif.
1. Intimité Suggestif, parcours naturel (logis d'Hylee, route audacieuse) : le jeu s'ouvre au même endroit, version adoucie.
2. Mixage : voix verrouillée, bruits neutres imposés. Partie en lecture auto (horloge Playwright) : à chaque phase,
   sprite visible et flouté, titre adouci, aucune voix ni bruit corporel enregistré, sons neutres et musique présents.
3. Bilan, conclusion adoucie, retour à la suite écrite en Suggestif.
4. Tendre et Fondu au noir : bouton de dév grisé, la route n'ouvre pas le jeu.
Usage : CA_BASE=... python3 rythme_suggestif.py saves/save-rythme.json <dossier> 1024x880 [toucher]"""
import os, sys, asyncio, json
from playwright.async_api import async_playwright
from common import *
BASESAVE=json.load(open(sys.argv[1])); OUT=sys.argv[2]; VP=sys.argv[3]; TOUCH=len(sys.argv)>4 and sys.argv[4]=="toucher"
W,H=[int(x) for x in VP.rstrip("t").split("x")]
os.makedirs(OUT, exist_ok=True)
VOIX=["souffle","soupir","gemit","halete","apogee","bouche","etouffe","langue"]; CORPS=["peau","humide","glisse","succion","lechage"]
EXPLICIT_LABELS=["Sa main","Ses lèvres","Votre langue"]
def save_for(mode):
    d=json.loads(json.dumps(BASESAVE)); d["player"]["intimacy"]=mode; return json.dumps(d)
async def main():
  async with async_playwright() as pw:
    b=await pw.chromium.launch(executable_path=os.environ.get("CA_CHROME") or None, args=["--autoplay-policy=no-user-gesture-required"])
    rep={"viewport":VP,"checks":[]}; ok=True
    def check(name,cond,detail=None):
        nonlocal ok
        rep["checks"].append([name,bool(cond),detail]); ok=ok and bool(cond); print(("OK " if cond else "KO ")+name, json.dumps(detail,ensure_ascii=False) if detail is not None else "", flush=True)
    async def new_page(mode):
        ctx=await b.new_context(viewport={"width":W,"height":H},has_touch=TOUCH,is_mobile=TOUCH)
        await ctx.add_init_script("if(!sessionStorage.getItem('seeded')){localStorage.setItem('sylvinia-liens-autosave',%s);localStorage.removeItem('sylvinia_ca_rythme_v1');localStorage.setItem('sylvinia_ca_rythme_prefs_v1',JSON.stringify({auto:true,difficulty:'normal',neutral:false,mute:{voix:false}}));sessionStorage.setItem('seeded','1')}"%json.dumps(save_for(mode)))
        p=await ctx.new_page(); errs=[]; hook(p,errs); p.set_default_timeout(9000)
        await p.goto(BASE); await p.wait_for_timeout(900); await p.keyboard.press("Enter"); await p.wait_for_timeout(900)
        await p.click(".t-item.principal"); await p.wait_for_timeout(2000); await close_modals(p)
        return ctx,p,errs
    async def dev(p):
        for i in range(4):
            if await p.locator("dialog[open], .modal-backdrop").count()==0: break
            await p.keyboard.press("Escape"); await p.wait_for_timeout(300)
        await p.keyboard.press("Escape"); await p.wait_for_timeout(600)
        await p.locator("dialog[open] button:has-text('Options'), button:has-text('Options')").first.click(); await p.wait_for_timeout(700)
        await p.locator(".opt-cat:has-text('Session'), [data-otab=session]").first.click(); await p.wait_for_timeout(500)
    async def open_home(p):
        inst=p.locator("button:has-text('Installer un logis de test')")
        if await inst.count() and await inst.first.is_enabled(): await inst.first.click(); await p.wait_for_timeout(500)
        opts=await p.evaluate("()=>[...document.querySelectorAll('.dev-preview-grid select')].map(s=>[...s.options].map(o=>o.value+'|'+o.text))")
        val=[o.split('|')[0] for o in opts[0] if o.startswith('home:hylee') or ('Hylee' in o and 'logis' in o)]
        await p.locator(".dev-preview-grid select").first.select_option(val[0]); await p.wait_for_timeout(200)
        await p.locator(".dev-preview-grid button:has-text('Ouvrir la partie intime')").first.click(); await p.wait_for_timeout(1000)
    async def to_route(p,text):
        for i in range(40):
            if await p.locator(".rythme-layer").count(): return
            cards=p.locator(".intimacy-choices .v2-choix-carte:not(.stop)")
            if await cards.count():
                if await p.locator(f".intimacy-choices .v2-choix-carte:has-text('{text}')").count(): await p.locator(f".intimacy-choices .v2-choix-carte:has-text('{text}')").first.click()
                else: await cards.first.click()
                await p.wait_for_timeout(300); return
            await p.locator(".dialogue-box").first.click(); await p.wait_for_timeout(120)
    async def read_until(p, done, limit=220):
        seq=[]
        for i in range(limit):
            if await p.locator(".rythme-layer").count(): return seq, True
            if await done(): return seq, False
            sm=p.locator(".dialogue-box small")
            if await sm.count(): seq.append(await sm.first.inner_text())
            if not await p.locator(".dialogue-box").count(): return seq, False
            await p.locator(".dialogue-box").first.click(); await p.wait_for_timeout(80)
        return seq, False
    async def never(): return False

    # 1. Suggestif : parcours naturel
    ctx,p,errs=await new_page("suggestif")
    await dev(p)
    check("suggestif : bouton de dév actif", await p.locator("#caDevRythme").is_enabled())
    await open_home(p); await to_route(p,"x-approche"); await to_route(p,"Laisser Hylee choisir chaque pièce")
    seq, opened = await read_until(p, never, 120)
    check("suggestif : la route ouvre le jeu au même endroit", opened, seq[-1] if seq else None)
    eyebrow=await p.locator(".rythme-panneau .eyebrow").first.inner_text()
    check("suggestif : panneau marqué Suggestif", "suggestif" in eyebrow.lower(), eyebrow)
    check("suggestif : consigne adoucie", "Suggestif" in await p.locator(".rythme-consigne").inner_text())
    await p.locator(".rythme-mixage summary").click(); await p.wait_for_timeout(200)
    voix_row=p.locator(".rythme-piste-mix[data-bus=voix]")
    check("mixage : voix verrouillée", await voix_row.locator("input").is_disabled() and "coupée" in await voix_row.inner_text(), await voix_row.inner_text())
    nb=p.locator(".rythme-case.neutre input")
    check("mixage : bruits neutres cochés et non désactivables", await nb.is_checked() and await nb.is_disabled())
    await p.locator(".rythme-mixage").scroll_into_view_if_needed()
    await p.screenshot(path=f"{OUT}/{VP}-suggestif-0-reglages.png")
    await p.clock.install()
    await p.locator(".rythme-actions button:has-text('Commencer')").click(); await p.wait_for_timeout(300)
    await p.clock.pause_at((await p.evaluate("()=>Date.now()")+50)/1000)
    async def go(target):
        for i in range(80000):
            if await p.evaluate("()=>window.__sylviniaRythme.time()")>=target: return
            await p.clock.run_for(20)
    defs=await p.evaluate("()=>window.__sylviniaRythme.sections()")
    notes=await p.evaluate("()=>window.__sylviniaRythme.notes().map(n=>({t:n.time,s:n.section,k:n.kind,b:n.beat}))")
    STATE="""()=>{const r=window.__sylviniaRythme; const i=document.querySelector('.intimacy-sprite img, .intimacy-cg img'); const b=i&&i.getBoundingClientRect(); const cs=i&&getComputedStyle(i);
      return {t:+r.time().toFixed(2), titre:document.querySelector('.rythme-section')?.innerText, ligne:r.strokeLine(), voix:r.voice(), geste:r.shake().geste,
        sprite:b&&{h:Math.round(b.height), w:Math.round(b.width), top:Math.round(b.top), hidden:i.hidden, op:cs.opacity, vis:cs.visibility, filtre:cs.filter, canal:i.dataset.spriteChannel, charge:i.complete&&i.naturalWidth>0},
        scene:document.querySelector('.interactive-intimacy').className, sons:r.sfx()};}"""
    phases=[]
    for s,d in enumerate(defs):
        own=[n for n in notes if n["s"]==s]
        mid=[n for n in own if n["k"]=="tap"]; n=mid[len(mid)//2]
        await go(n["t"]+n["b"]*0.3)
        st=await p.evaluate(STATE); st["id"]=d["id"]
        await p.screenshot(path=f"{OUT}/{VP}-suggestif-{s+1}-{d['id']}.png"); st["capture"]=f"{OUT}/{VP}-suggestif-{s+1}-{d['id']}.png"
        phases.append(st); print(d["id"], json.dumps({k:v for k,v in st.items() if k!="sons"},ensure_ascii=False), flush=True)
        sp=st["sprite"]
        check(f"{d['id']} : sprite visible", sp and not sp["hidden"] and sp["op"]!="0" and sp["vis"]=="visible" and sp["h"]>H*0.3 and sp["charge"], sp)
        check(f"{d['id']} : sprite flouté", sp and "blur(14px)" in sp["filtre"] and "rythme-suggestif" in st["scene"], sp and sp["filtre"])
        check(f"{d['id']} : titre adouci", st["titre"] and st["titre"].lower() not in [x.lower() for x in EXPLICIT_LABELS], st["titre"])
    rep["phases"]=phases
    end=await p.evaluate("()=>{const n=window.__sylviniaRythme.notes().at(-1); return n.time+n.duration;}")
    await go(end+0.5)
    await p.screenshot(path=f"{OUT}/{VP}-suggestif-9-apogee.png")
    sons=await p.evaluate("()=>window.__sylviniaRythme.sfx()")
    rep["sons"]=sons
    heard=[g for g in VOIX+CORPS if sons["played"].get(g)]
    check("aucune voix ni bruit corporel enregistré", not heard, {"entendus":heard,"bloques":sons["played"].get("bloque")})
    check("sons neutres joués", all(sons["played"].get("neutre-"+k,0)>0 for k in ["battement","feutre","tic","souffle"]), {k:sons["played"].get("neutre-"+k) for k in ["battement","feutre","tic","souffle"]})
    check("interface conservée (combo, ambiance)", sons["played"].get("combo",0)>0, {k:sons["played"].get(k) for k in ["combo","draps","baiser","rate"]})
    check("bus : voix à zéro, neutre imposé", sons["bus"] and sons["bus"]["voix"]==0 and sons["neutral"] is True and sons["suggestive"] is True, sons["bus"])
    music=await p.evaluate("()=>window.__sylviniaRythme.music()")
    check("musique présente", music["volume"] not in (None,0), music)
    check("fichiers voix et corps jamais chargés", sons["loaded"]<=10, sons["loaded"])
    await p.clock.resume()
    await p.wait_for_selector(".rythme-panneau.resultat", timeout=30000)
    await p.screenshot(path=f"{OUT}/{VP}-suggestif-10-bilan.png")
    await p.locator(".rythme-actions button:has-text('Continuer')").click(); await p.wait_for_timeout(600)
    concl=await p.locator(".dialogue-box p").first.inner_text()
    check("conclusion adoucie", "drap" in concl or "photophore" in concl or "compter" in concl, concl[:120])
    await p.screenshot(path=f"{OUT}/{VP}-suggestif-11-conclusion.png")
    seqtxt=None
    for i in range(8):
        await p.locator(".dialogue-box").first.click(); await p.wait_for_timeout(150)
        if await p.locator(".dialogue-box small").count(): seqtxt=await p.locator(".dialogue-box small").first.inner_text()
    check("suite écrite reprise après le jeu", seqtxt is not None, seqtxt)
    rep["erreurs_suggestif"]=[e for e in errs if "favicon" not in e[1] and "chroniques-alternatives-theme" not in e[1] and "studio" not in e[1] and "404" not in e[1]][:6]
    await ctx.close()

    # 4. Tendre et Fondu au noir : pas de jeu
    for mode in ["tendre","ellipse"]:
        ctx,p,errs=await new_page(mode)
        await dev(p)
        check(f"{mode} : bouton de dév grisé", await p.locator("#caDevRythme").is_disabled())
        await open_home(p); await to_route(p,"x-approche"); await to_route(p,"Laisser Hylee choisir chaque pièce")
        seq, opened = await read_until(p, lambda: p.locator(".intimacy-complete").count(), 260)
        check(f"{mode} : la route n'ouvre pas le jeu", not opened, seq[-1] if seq else None)
        await ctx.close()
    rep["ok"]=ok
    json.dump(rep,open(f"{OUT}/{VP}-suggestif.json","w"),ensure_ascii=False,indent=1)
    await b.close()
    sys.exit(0 if ok else 1)
asyncio.run(main())
