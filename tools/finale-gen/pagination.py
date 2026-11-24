import asyncio, json, sys, os
from playwright.async_api import async_playwright
OUT=os.environ.get("SHOTS_OUT","/tmp/finale-pag/")
MEAS="""()=>{const R=BibliothequeAstrale.racine; const t=R.querySelector('.dlg-texte'); const ps=[...t.querySelectorAll('.para')]; const last=ps[ps.length-1]; const fol=R.querySelector('.folio'); const box=t.parentElement.getBoundingClientRect();
 return {overflow: last? Math.round(last.getBoundingClientRect().bottom - Math.min(fol?fol.getBoundingClientRect().top:1e9, box.bottom)):0, sh:t.scrollHeight, ch:t.clientHeight}}"""
SHOTS={"830x525":["c17_rassemblement","c17_choix_adieu","c17_m1","c17_revelation","c17_dernier_souffle","c17_naiah_revelee","c18_carrefour","c18_dp_lineva","c18_ip_flux","c18_choix_arcane","c18_reflet","c19_promesse","c19_fin"],
       "1024x880":["c17_dernier_souffle","c17_naiah_revelee","c17_m4","c18_carrefour","c18_dragon","c19_fin"],
       "880x1024":["c17_dernier_souffle","c17_naiah_revelee","c17_m5","c18_choix_hylee","c19_serment"]}
async def main():
  res={}
  async with async_playwright() as pw:
    b=await pw.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--mute-audio"])
    for (W,H) in [(830,525),(1024,880),(880,1024)]:
      key=f"{W}x{H}"
      c=await b.new_context(viewport={"width":W,"height":H}, has_touch=True)
      flags={"s01AssaultComplete":True,"chapter4DComplete":True,"c15WalkedWithDraven":True,"chapter13IComplete":True,"c13iHeldAmaneaWhole":True,"s02Adieu":"confiance","s08Reponse":"main","s04M1":"good","s04M2":"mid","s04M3":"good","s04M4":"good","s04M5":"good","finaleSeenDraven":True,"s06LinevaWords":"fierte"}
      save={"scene":"c16_s01_fin","stats":{"audace":3},"flags":flags,"inventory":[],"memories":[],"history":[]}
      await c.add_init_script("localStorage.setItem('sylvinia_ui_biblio_v1', JSON.stringify({skin:'biblio'}));localStorage.setItem('sylvinia_vn_v82', %s);" % json.dumps(json.dumps(save)))
      p=await c.new_page(); errs=[]
      p.on("pageerror", lambda e: errs.append(str(e)[:200])); p.on("console", lambda m: errs.append(m.text[:120]) if m.type=="error" else None)
      await p.goto(f"http://127.0.0.1:{os.environ.get('PORT','8894')}/index.html?cb=pag", wait_until="domcontentloaded", timeout=120000)
      await p.wait_for_function("window.BibliothequeAstrale", timeout=120000); await p.wait_for_timeout(2500)
      await p.evaluate("()=>{load();}")
      ids=await p.evaluate("Object.keys(S).filter(k=>/^c1[789]_/.test(k))")
      if os.environ.get('ONLY'): ids=[i for i in ids if i in os.environ['ONLY'].split(',')]
      worst=[]; pages_total=0
      for sid in ids:
        await p.evaluate("""(sid)=>{state.scene=sid; state.history=[]; setScreen('game'); render(); BibliothequeAstrale.aller('#/jeu');}""", sid)
        await p.wait_for_timeout(350)
        J=None
        for _ in range(20):
          J=await p.evaluate("BibliothequeAstrale.etat().J")
          if J: break
          await p.wait_for_timeout(150)  # voile de combat (#combatTransition) encore actif
        if not J: worst.append([sid,"sans page"]); continue
        n=J["pages"]; pages_total+=n
        for k in range(n):
          if k>0: await p.evaluate("BibliothequeAstrale.racine.querySelector('.jeu').click()"); await p.wait_for_timeout(120)
          for _ in range(4):
            if (await p.evaluate("BibliothequeAstrale.etat().J"))["plein"]: break
            await p.evaluate("BibliothequeAstrale.racine.querySelector('.jeu').click()"); await p.wait_for_timeout(120)
          m=await p.evaluate(MEAS)
          if m["overflow"]>2 or m["sh"]>m["ch"]+2: worst.append([sid,k,m["overflow"],m["sh"],m["ch"]])
        if sid in SHOTS[key]:
          # capture : on recharge la scène et on avance page par page sans dépasser la dernière
          await p.evaluate("""(sid)=>{state.scene=sid; state.history=[]; setScreen('game'); render(); BibliothequeAstrale.aller('#/jeu');}""", sid)
          await p.wait_for_timeout(500)
          for _ in range(20):
            st=await p.evaluate("BibliothequeAstrale.etat().J")
            if st["p"]>=st["pages"]-1: break
            if not st["plein"]: await p.evaluate("BibliothequeAstrale.racine.querySelector('.jeu').click()"); await p.wait_for_timeout(200)
            await p.evaluate("BibliothequeAstrale.racine.querySelector('.jeu').click()"); await p.wait_for_timeout(250)
          await p.wait_for_timeout(2500)
          assert await p.evaluate("state.scene")==sid
          await p.screenshot(path=OUT+f"{key}_{sid}.png")
      res[key]={"scenes":len(ids),"pages":pages_total,"debordements":worst,"erreurs":errs}
      await c.close()
    await b.close()
  json.dump(res,open(OUT+os.environ.get("PAG_OUT","pagination.json"),"w"),ensure_ascii=False,indent=1)
  print(json.dumps(res,ensure_ascii=False,indent=1))
asyncio.run(main())
