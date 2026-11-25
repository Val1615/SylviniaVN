"""Jeu de rythme : parcours naturel (logis d'Hylee → route audacieuse → le jeu s'ouvre après l'intensification),
mode auto en Doux jusqu'au bilan, « Lire la version écrite », et une autre route qui n'ouvre pas le jeu.
Usage : CA_BASE=... python3 rythme_parcours.py saves/save-rythme.json <dossier> [1024x880]"""
import os, sys, asyncio, json
from playwright.async_api import async_playwright
from common import *
SAVE=open(sys.argv[1]).read(); OUT=sys.argv[2]; VP=sys.argv[3] if len(sys.argv)>3 else "1024x880"
W,H=[int(x) for x in VP.rstrip("t").split("x")]
os.makedirs(OUT, exist_ok=True); rep={}
async def main():
  async with async_playwright() as pw:
    b=await pw.chromium.launch(executable_path=os.environ.get("CA_CHROME") or None)
    ctx=await b.new_context(viewport={"width":W,"height":H})
    await ctx.add_init_script("if(!sessionStorage.getItem('seeded')){localStorage.setItem('sylvinia-liens-autosave',%s);localStorage.removeItem('sylvinia_ca_rythme_v1');localStorage.removeItem('sylvinia_ca_rythme_prefs_v1');sessionStorage.setItem('seeded','1')}"%json.dumps(SAVE))
    p=await ctx.new_page(); errs=[]; hook(p,errs); p.set_default_timeout(9000)
    async def snap(n):
        await p.evaluate("""()=>{document.querySelectorAll('.intimacy-cg img, .intimacy-cg, img[data-sprite-channel=intimate]').forEach(i=>{i.style.filter='blur(14px) brightness(.6) saturate(.5)';});}""")
        await p.wait_for_timeout(120); await p.screenshot(path=f"{OUT}/{VP}-parcours-{n}.png")
    async def dev():
        for i in range(4):
            if await p.locator("dialog[open], .modal-backdrop").count()==0: break
            await p.keyboard.press("Escape"); await p.wait_for_timeout(300)
        await p.keyboard.press("Escape"); await p.wait_for_timeout(600)
        await p.locator("dialog[open] button:has-text('Options'), button:has-text('Options')").first.click(); await p.wait_for_timeout(700)
        await p.locator(".opt-cat:has-text('Session'), [data-otab=session]").first.click(); await p.wait_for_timeout(500)
    async def open_home():
        await dev()
        inst=p.locator("button:has-text('Installer un logis de test')")
        if await inst.count() and await inst.first.is_enabled(): await inst.first.click(); await p.wait_for_timeout(500)
        opts=await p.evaluate("()=>[...document.querySelectorAll('.dev-preview-grid select')].map(s=>[...s.options].map(o=>o.value+'|'+o.text))")
        val=[o.split('|')[0] for o in opts[0] if o.startswith('home:hylee') or ('Hylee' in o and 'logis' in o)]
        if not val: print('options', opts[0][:80], len(opts)); raise SystemExit(1)
        await p.locator(".dev-preview-grid select").first.select_option(val[0]); await p.wait_for_timeout(200)
        await p.locator(".dev-preview-grid button:has-text('Ouvrir la partie intime')").first.click(); await p.wait_for_timeout(1000)
    async def to_route(text):
        for i in range(40):
            if await p.locator(".rythme-layer").count(): return
            cards=p.locator(".intimacy-choices .v2-choix-carte:not(.stop)")
            if await cards.count():
                q=await p.locator(".choice-question").first.inner_text()
                if "prolonger" in q.lower() or await p.locator(f".intimacy-choices .v2-choix-carte:has-text('{text}')").count():
                    await p.locator(f".intimacy-choices .v2-choix-carte:has-text('{text}')").first.click()
                else: await cards.first.click()
                await p.wait_for_timeout(300); return
            await p.locator(".dialogue-box").first.click(); await p.wait_for_timeout(120)
    async def read_until(pred, limit=80):
        seq=[]
        for i in range(limit):
            if await p.locator(".rythme-layer").count(): return seq, True
            if await pred(): return seq, False
            sm=p.locator(".dialogue-box small")
            if await sm.count(): seq.append(await sm.first.inner_text())
            if not await p.locator(".dialogue-box").count(): return seq, False
            await p.locator(".dialogue-box").first.click(); await p.wait_for_timeout(90)
        return seq, False
    await p.goto(BASE); await p.wait_for_timeout(900); await p.keyboard.press("Enter"); await p.wait_for_timeout(900)
    await p.click(".t-item.principal"); await p.wait_for_timeout(2000); await close_modals(p)
    # 1. Parcours naturel jusqu'au jeu
    if os.environ.get("SEUL3"):
        rep_skip=True
    await open_home(); await to_route("x-approche"); await to_route("Laisser Hylee choisir chaque pièce")
    seq, opened = await read_until(lambda: asyncio.sleep(0, False))
    rep["jeu_ouvert_par_la_route"]=opened; rep["derniere_sequence_lue"]=seq[-1] if seq else None
    await snap("01-ouverture-naturelle")
    # Doux + auto jusqu'au bilan
    await p.locator(".rythme-choix button:has-text('Doux')").click()
    await p.locator(".rythme-case input").first.check()
    await p.locator(".rythme-actions button:has-text('Commencer')").click()
    await p.wait_for_timeout(30000); await snap("02-auto-milieu")
    await p.wait_for_selector(".rythme-panneau.resultat", timeout=70000)
    rep["auto_bilan"]=(await p.locator(".rythme-panneau.resultat").inner_text()).replace("\n"," | ")
    await p.locator(".rythme-actions button:has-text('Continuer')").click(); await p.wait_for_timeout(500)
    rep["auto_conclusion"]=await p.locator(".dialogue-box p").first.inner_text()
    rep["auto_sequence"]=await p.locator(".dialogue-box small").first.inner_text()
    await p.locator(".interactive-intimacy .scene-outil.passer").first.click(); await p.wait_for_timeout(800)
    await close_modals(p)
    # 2. Lire la version écrite
    await open_home(); await to_route("x"); await to_route("Laisser Hylee choisir chaque pièce")
    seq, opened = await read_until(lambda: asyncio.sleep(0, False))
    await p.locator(".rythme-actions button:has-text('Lire la version écrite')").click(); await p.wait_for_timeout(400)
    rep["version_ecrite"]=(await p.locator(".dialogue-box p").first.inner_text())[:90]
    rep["version_ecrite_sequence"]=await p.locator(".dialogue-box small").first.inner_text()
    await snap("03-version-ecrite")
    await p.locator(".interactive-intimacy .scene-outil.passer").first.click(); await p.wait_for_timeout(800); await close_modals(p)
    # 3. Une autre route Hylee : pas de jeu
    await open_home(); await to_route("x")
    for i in range(30):
        if await p.locator(".intimacy-choices .v2-choix-carte:has-text('chaque pièce')").count(): break
        await p.locator(".dialogue-box").first.click(); await p.wait_for_timeout(120)
    cards=p.locator(".intimacy-choices .v2-choix-carte:not(.stop)")
    texts=[await cards.nth(i).inner_text() for i in range(await cards.count())]
    other=[i for i,t in enumerate(texts) if "chaque pièce" not in t][0]
    await cards.nth(other).click(); await p.wait_for_timeout(300)
    seq, opened = await read_until(lambda: p.locator(".intimacy-complete").count(), 200)
    rep["autre_route_ouvre_le_jeu"]=opened; rep["autre_route_fin"]=seq[-1] if seq else None
    rep["erreurs"]=[e for e in errs if "404" not in e[1] and "chroniques-alternatives-theme" not in e[1]]
    await b.close()
  print(json.dumps(rep,ensure_ascii=False,indent=1)); json.dump(rep,open(f"{OUT}/{VP}-parcours-rapport.json","w"),ensure_ascii=False,indent=1)
asyncio.run(main())
