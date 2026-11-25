"""Fiches personnages, lot 1 (Bellirith) : accès développeur à une scène, difficulté Intense recommandée,
couleur violette, leurres (un cédé exprès, les autres résistés), silence au bord tenu, aura, bilan avec la bulle
de fin, reprise du texte écrit juste après le sommet, souvenir sans effet sur la relation.
Usage : CA_BASE=http://127.0.0.1:8941/chronique-alternative/ python3 rythme_bellirith.py saves/save-rythme.json <dossier> 1024x880 [route]
Les captures floutent la CG et le sprite intime (silhouette lisible, rien d'explicite)."""
import os, sys, asyncio, json
from playwright.async_api import async_playwright
from common import *
SAVE=open(sys.argv[1]).read()
OUT=sys.argv[2]
VP=sys.argv[3]
ROUTE=sys.argv[4] if len(sys.argv)>4 else "bellirith-heure-couloir"
W,H=[int(x) for x in VP.rstrip("t").split("x")]
os.makedirs(OUT, exist_ok=True)
report={"viewport":VP,"route":ROUTE,"checks":{}}
# Robot : frappe les vrais coups, ne touche jamais aux pièges, sauf le leurre choisi (cédé exprès).
BOT="""(opts)=>{ if(window.__rythmeBot) return; const done=new Set(); const ups=[]; let ceded=false;
 const kd=(key)=>window.dispatchEvent(new KeyboardEvent('keydown',{key,bubbles:true,cancelable:true}));
 const ku=(key)=>window.dispatchEvent(new KeyboardEvent('keyup',{key,bubbles:true,cancelable:true}));
 window.__rythmeBot={stop:false};
 const loop=()=>{ if(window.__rythmeBot.stop) return; requestAnimationFrame(loop); const r=window.__sylviniaRythme; if(!r||r.phase()!=='play') return; const t=r.time();
  for(let i=ups.length-1;i>=0;i--){ if(t>=ups[i].at){ ups[i].fn(); ups.splice(i,1);} }
  for(const n of r.notes()){ if(n.time>t+0.01) break; if(done.has(n.index)) continue; done.add(n.index);
   if(n.kind==='bait'||n.kind==='edge'){ if(n.kind==='bait'&&!ceded&&!n.call&&n.section>=opts.cedeSection){ ceded=true; kd(' '); ups.push({at:t+0.05,fn:()=>ku(' ')}); } continue; }
   if(r.judgements()[n.index]!==0) continue;
   if(n.kind==='slide'){ kd(n.direction==='left'?'ArrowLeft':'ArrowRight'); continue; }
   for(let i=ups.length-1;i>=0;i--){ if(ups[i].hold){ ups[i].fn(); ups.splice(i,1);} }
   kd(' '); const rel=()=>ku(' ');
   if(n.duration>0) ups.push({at:n.time+n.duration+0.02, fn:rel, hold:true}); else ups.push({at:t+0.05, fn:rel});
  } };
 requestAnimationFrame(loop); }"""
async def main():
  async with async_playwright() as pw:
    b=await pw.chromium.launch(executable_path=os.environ.get("CA_CHROME") or None, args=["--autoplay-policy=no-user-gesture-required"])
    ctx=await b.new_context(viewport={"width":W,"height":H})
    await ctx.add_init_script("if(!sessionStorage.getItem('seeded')){localStorage.setItem('sylvinia-liens-autosave',%s);localStorage.removeItem('sylvinia_ca_rythme_v1');localStorage.removeItem('sylvinia_ca_rythme_prefs_v1');sessionStorage.setItem('seeded','1')}"%json.dumps(SAVE))
    p=await ctx.new_page(); errs=[]; hook(p,errs); p.set_default_timeout(9000)
    async def snap(n):
        await p.evaluate("""()=>{document.querySelectorAll('.intimacy-cg img, .intimacy-cg, img[data-sprite-channel=intimate]').forEach(i=>{i.style.filter='blur(14px) brightness(.6) saturate(.5)';});}""")
        await p.wait_for_timeout(120); path=f"{OUT}/{VP}-{n}.png"; await p.screenshot(path=path); print("capture", path, flush=True)
    async def t(): return await p.evaluate("()=>window.__sylviniaRythme?window.__sylviniaRythme.time():null")
    async def wait_js(js, limit=200):
        for i in range(limit*10):
            if await p.evaluate(js): return True
            await p.wait_for_timeout(100)
        return False
    relation=lambda: p.evaluate("()=>{const g=JSON.parse(localStorage.getItem('sylvinia-liens-autosave')); return JSON.stringify(g.relationships?.bellirith||null);}")
    await p.goto(BASE); await p.wait_for_timeout(900); await p.keyboard.press("Enter"); await p.wait_for_timeout(900)
    await p.click(".t-item.principal"); await p.wait_for_timeout(2000); await close_modals(p)
    rel_before=await relation()
    for i in range(4):
        if await p.locator("dialog[open], .modal-backdrop").count()==0: break
        await p.keyboard.press("Escape"); await p.wait_for_timeout(300)
    await p.keyboard.press("Escape"); await p.wait_for_timeout(600)
    await p.locator("dialog[open] button:has-text('Options'), button:has-text('Options')").first.click(); await p.wait_for_timeout(700)
    await p.locator(".opt-cat:has-text('Session'), [data-otab=session]").first.click(); await p.wait_for_timeout(500)
    btn=p.locator(f"[data-rythme-route={ROUTE}]"); await btn.scroll_into_view_if_needed(); await p.wait_for_timeout(200)
    report["checks"]["boutons_dev"]=await p.locator("[data-rythme-route]").count()
    await snap("00-dev")
    await btn.click(); await p.wait_for_timeout(1400)
    report["checks"]["kit"]=await p.evaluate("()=>window.__sylviniaRythme.kit()")
    report["checks"]["phases"]=await p.evaluate("()=>window.__sylviniaRythme.sections()")
    report["checks"]["titre"]=await p.locator(".rythme-panneau h3").inner_text()
    report["checks"]["difficulte_active"]=await p.evaluate("()=>[...document.querySelectorAll('.rythme-panneau button')].filter(b=>b.classList.contains('actif')||b.getAttribute('aria-pressed')==='true').map(b=>b.innerText.replace(/\\s+/g,' ').trim())")
    report["checks"]["couleur"]=await p.evaluate("()=>{const l=document.querySelector('.rythme-layer'); return {classes:l.className, rose:l.style.getPropertyValue('--rose-r'), perso:l.dataset.perso};}")
    await snap("01-reglages")
    phases=report["checks"]["phases"]
    cede_section=next((i for i,x in enumerate(phases) if x.get("baits")), 0)
    await p.locator(".rythme-actions button:has-text('Commencer')").click()
    await p.evaluate(BOT, {"cedeSection":cede_section})
    await p.wait_for_timeout(6000); await snap("02-jeu")
    if await wait_js("()=>document.querySelector('.rythme-note.bait')", 60): await p.wait_for_timeout(250); await snap("03-leurre")
    if await wait_js("()=>document.querySelector('.rythme-layer.silence')", 120):
        await p.wait_for_timeout(300); report["checks"]["silence"]=await p.locator(".rythme-silence-bandeau").first.inner_text(); await snap("04-silence")
    if await wait_js("()=>document.querySelector('.rythme-layer.aura-annonce, .rythme-layer.aura-vague')", 120): await p.wait_for_timeout(200); await snap("05-aura")
    report["checks"]["resistance_jeu"]=await p.evaluate("()=>window.__sylviniaRythme.resistance()")
    await p.wait_for_selector(".rythme-panneau.resultat", timeout=420000)
    report["checks"]["resultat"]=await p.locator(".rythme-panneau.resultat").inner_text()
    report["checks"]["bulle_fin"]=await p.locator(".rythme-bulle-fin").count()
    report["checks"]["note_relation"]=await p.locator(".rythme-relation").count()
    report["checks"]["resistance"]=await p.evaluate("()=>window.__sylviniaRythme?.resistance()")
    report["checks"]["sons"]=await p.evaluate("()=>window.__sylviniaRythme?.sfx()")
    await snap("06-bilan")
    bubble=await p.locator(".rythme-bulle-fin").first.inner_text() if report["checks"]["bulle_fin"] else ""
    await p.locator(".rythme-actions button:has-text('Continuer')").click(); await p.wait_for_timeout(800)
    report["checks"]["reprise_texte"]=await p.locator(".dialogue-box p").first.inner_text()
    report["checks"]["reprise_bulle"]=bubble.split("\n")[-1].strip() in report["checks"]["reprise_texte"] or report["checks"]["reprise_texte"] in bubble
    await snap("07-reprise")
    report["checks"]["relation_inchangee"]=(await relation())==rel_before
    report["errors"]=errs
    json.dump(report, open(f"{OUT}/{VP}-rapport.json","w"), ensure_ascii=False, indent=1)
    print(json.dumps({k:report["checks"][k] for k in ["kit","titre","difficulte_active","couleur","bulle_fin","note_relation","reprise_bulle","relation_inchangee","silence"] if k in report["checks"]}, ensure_ascii=False))
    print("erreurs", errs)
    await b.close()
asyncio.run(main())
