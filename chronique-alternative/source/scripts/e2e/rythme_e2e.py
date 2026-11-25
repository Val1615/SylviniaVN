"""Jeu de rythme intime (prototype) : accès dév, réglages, partie au clavier ou au toucher,
ratés et taquineries, paliers, pause, « Reprendre plus tard » puis reprise exacte, bilan, conclusion, CG post-orgasme.
Usage : CA_BASE=http://127.0.0.1:8931/chronique-alternative/ python3 rythme_e2e.py saves/save-rythme.json <dossier> 1024x880 [clavier|toucher]
Les captures floutent la CG et le sprite intime (silhouette lisible, rien d'explicite)."""
import os, sys, asyncio, json
from playwright.async_api import async_playwright
from common import *
SAVE=open(sys.argv[1]).read()
OUT=sys.argv[2]
VP=sys.argv[3]
MODE=sys.argv[4] if len(sys.argv)>4 else "clavier"
W,H=[int(x) for x in VP.rstrip("t").split("x")]; TOUCH=MODE=="toucher"
os.makedirs(OUT, exist_ok=True)
report={"viewport":VP,"mode":MODE,"checks":{}}
BOT="""(opts)=>{ if(window.__rythmeBot) return; const miss=new Set(opts.miss); const done=new Set(); const ups=[]; const touch=opts.touch;
 const layer=()=>document.querySelector('.rythme-layer');
 const pe=(type,x,y,id)=>{const l=layer(); if(!l) return; l.dispatchEvent(new PointerEvent(type,{bubbles:true,cancelable:true,pointerId:id,pointerType:'touch',isPrimary:true,clientX:x,clientY:y}));};
 const kd=(key)=>window.dispatchEvent(new KeyboardEvent('keydown',{key,bubbles:true,cancelable:true}));
 const ku=(key)=>window.dispatchEvent(new KeyboardEvent('keyup',{key,bubbles:true,cancelable:true}));
 let pid=10;
 window.__rythmeBot={stop:false};
 const loop=()=>{ if(window.__rythmeBot.stop) return; requestAnimationFrame(loop); const r=window.__sylviniaRythme; if(!r||r.phase()!=='play') return; const t=r.time();
  for(let i=ups.length-1;i>=0;i--){ if(t>=ups[i].at){ ups[i].fn(); ups.splice(i,1);} }
  for(const n of r.notes()){ if(n.time>t+0.01) break; if(done.has(n.index)) continue; done.add(n.index); if(miss.has(n.index)) continue; if(r.judgements()[n.index]!==0) continue;
   const cx=innerWidth*0.35, cy=innerHeight*0.5;
   if(n.kind==='slide'){ const dx=n.direction==='left'?-80:80; if(touch){const id=++pid; pe('pointerdown',cx,cy,id); pe('pointermove',cx+dx/2,cy,id); pe('pointermove',cx+dx,cy,id); pe('pointerup',cx+dx,cy,id);} else { kd(n.direction==='left'?'ArrowLeft':'ArrowRight'); ku(n.direction==='left'?'ArrowLeft':'ArrowRight'); } continue; }
   // Un humain relâche la note longue précédente avant de frapper la suivante.
   for(let i=ups.length-1;i>=0;i--){ if(ups[i].hold){ ups[i].fn(); ups.splice(i,1);} }
   const id=++pid; if(touch) pe('pointerdown',cx,cy,id); else kd(' ');
   const rel=()=>{ if(touch) pe('pointerup',cx,cy,id); else ku(' '); };
   if(n.duration>0) ups.push({at:n.time+n.duration+0.02, fn:rel, hold:true}); else ups.push({at:t+0.05, fn:rel});
  } };
 requestAnimationFrame(loop); }"""
async def main():
  async with async_playwright() as pw:
    b=await pw.chromium.launch(executable_path=os.environ.get("CA_CHROME") or None, args=["--autoplay-policy=no-user-gesture-required"])
    ctx=await b.new_context(viewport={"width":W,"height":H},has_touch=TOUCH,is_mobile=TOUCH)
    await ctx.add_init_script("if(!sessionStorage.getItem('seeded')){localStorage.setItem('sylvinia-liens-autosave',%s);localStorage.removeItem('sylvinia_ca_rythme_v1');localStorage.removeItem('sylvinia_ca_rythme_prefs_v1');sessionStorage.setItem('seeded','1')}"%json.dumps(SAVE))
    p=await ctx.new_page(); errs=[]; hook(p,errs); p.set_default_timeout(9000)
    async def snap(n):
        await p.evaluate("""()=>{document.querySelectorAll('.intimacy-cg img, .intimacy-cg, img[data-sprite-channel=intimate]').forEach(i=>{i.style.filter='blur(14px) brightness(.6) saturate(.5)';});}""")
        await p.wait_for_timeout(120); path=f"{OUT}/{VP}-{MODE}-{n}.png"; await p.screenshot(path=path); print("capture", path, flush=True)
    async def dev():
        for i in range(4):
            if await p.locator("dialog[open], .modal-backdrop").count()==0: break
            await p.keyboard.press("Escape"); await p.wait_for_timeout(300)
        await p.keyboard.press("Escape"); await p.wait_for_timeout(600)
        await p.locator("dialog[open] button:has-text('Options'), button:has-text('Options')").first.click(); await p.wait_for_timeout(700)
        await p.locator(".opt-cat:has-text('Session'), [data-otab=session]").first.click(); await p.wait_for_timeout(500)
        await p.locator("#caDevRythme").scroll_into_view_if_needed(); await p.wait_for_timeout(200)
    async def t(): return await p.evaluate("()=>window.__sylviniaRythme?window.__sylviniaRythme.time():null")
    async def wait_t(x, limit=200):
        for i in range(limit*10):
            v=await t()
            if v is not None and v>=x: return v
            await p.wait_for_timeout(100)
    await p.goto(BASE); await p.wait_for_timeout(900); await p.keyboard.press("Enter"); await p.wait_for_timeout(900)
    await p.click(".t-item.principal"); await p.wait_for_timeout(2000); await close_modals(p)
    await dev(); await snap("00-dev")
    await p.locator("#caDevRythme").click(); await p.wait_for_timeout(1200)
    report["checks"]["setup"]=await p.locator(".rythme-panneau h3").inner_text()
    report["checks"]["reglages"]=await p.evaluate("()=>[...document.querySelectorAll('.rythme-panneau label, .rythme-panneau .rythme-choix button')].map(e=>e.innerText.replace(/\\s+/g,' ').trim())")
    await snap("01-reglages")
    # Cadence vue par le navigateur : un coup par battement, tempo stable par position, accélération par paliers.
    report["checks"]["cadence"]=await p.evaluate("""()=>{const n=window.__sylviniaRythme.notes(); const out=[]; for(let s=0;s<4;s++){const own=n.filter(x=>x.section===s&&x.kind!=='slide'); const b=own[1].beat; out.push({position:s, coups:own.length, battement:+b.toFixed(3), cpm:Math.round(60/b), debut:+own[0].time.toFixed(2)});} return {positions:out, total:n.length, fin:+(n.at(-1).time+n.at(-1).duration).toFixed(2), montee:n.filter(x=>x.section===3).slice(-6).map(x=>Math.round(60/x.beat))};}""")
    starts=[x["debut"] for x in report["checks"]["cadence"]["positions"]]; END=report["checks"]["cadence"]["fin"]
    notes=await p.evaluate("()=>window.__sylviniaRythme.notes().map(n=>[n.time,n.kind,n.section])")
    def after_hit(x):
        # premier coup simple après x : la capture tombe juste après la frappe, au plus fort de la pulsation
        for tm,k,sec in notes:
            if tm>=x and k=="tap": return tm+0.06
        return x
    miss=[3,9,17,30,44,61,80,98]
    await p.locator(".rythme-actions button:has-text('Commencer')").click()
    await p.evaluate(BOT, {"miss":miss,"touch":TOUCH})
    await wait_t(-2.2); await snap("02-decompte")
    levels=[]
    async def level(tag):
        st=await p.evaluate("""()=>{const r=window.__sylviniaRythme; const l=document.querySelector('.rythme-layer'); const cs=getComputedStyle(document.querySelector('.rythme-vignette')); return {t:+r.time().toFixed(2), ardeur:+r.ardour().toFixed(2), palier:l.dataset.ardeur, jauge:l.style.getPropertyValue('--jauge'), pulse:+l.style.getPropertyValue('--pulse'), vignette:+(+cs.opacity).toFixed(3), zoom:r.zoom(), sfx:r.sfx(), musique:r.music(), combo:r.combo(), secousse:r.shake(), sprite:(()=>{const i=document.querySelector('.intimacy-sprite img, .intimacy-cg img'); if(!i) return null; const b=i.getBoundingClientRect(); return {hidden:i.hidden, nw:i.naturalWidth, top:Math.round(b.top), bottom:Math.round(b.bottom), h:Math.round(b.height)};})()};}""")
        st["tag"]=tag; levels.append(st); return st
    await wait_t(after_hit(5.0)); await level("debut"); await snap("03-jauge-basse")
    for i in range(80):
        if await p.evaluate("()=>window.__sylviniaRythme.tease()"): break
        await p.wait_for_timeout(100)
    await p.wait_for_timeout(250); await snap("03b-taquinerie")
    for i in range(80):
        if await p.evaluate("()=>window.__sylviniaRythme.voice()"): break
        await p.wait_for_timeout(100)
    report["checks"]["voix_vue"]=await p.evaluate("()=>window.__sylviniaRythme.voice()")
    report["checks"]["voix_bulle"]=await p.locator(".rythme-voix").count()
    await snap("03c-replique")
    await wait_t(starts[1]-0.2); await snap("04-section2-glisse")
    await wait_t(after_hit(starts[1]+9)); await level("position2"); await snap("05-jauge-quart")
    report["checks"]["ligne_cadence"]=await p.evaluate("()=>window.__sylviniaRythme.strokeLine()")
    await wait_t(after_hit(starts[2]+4)); await level("position3"); await snap("06-jauge-milieu")
    # Palier de combo : battement particulier, voile rose, onde et inscription « COMBO »
    for i in range(140):
        if await p.locator(".rythme-layer.combo-palier .rythme-combo-eclat").count(): break
        await p.wait_for_timeout(100)
    await p.wait_for_timeout(160)
    report["checks"]["combo_palier"]=await p.evaluate("()=>{const l=document.querySelector('.rythme-layer'); const e=document.querySelector('.rythme-combo-eclat'); return {classes:l.className, eclat:e?e.innerText.replace(/\\s+/g,' '):null, onde:!!document.querySelector('.rythme-onde.combo'), voile:+getComputedStyle(document.querySelector('.rythme-combo-voile')).opacity, combo:window.__sylviniaRythme.combo()};}")
    await level("combo-palier"); await snap("06b-combo-palier")
    # Secousse : capture prise au plus fort de la poussée, sprite visible
    await p.evaluate("""()=>{document.querySelectorAll('.intimacy-cg img, .intimacy-cg, img[data-sprite-channel=intimate]').forEach(i=>{i.style.filter='blur(14px) brightness(.6) saturate(.5)';});}""")
    shake_seen=None
    for i in range(300):
        y=await p.evaluate("()=>window.__sylviniaRythme.shake().y")
        if abs(y)>=3.5:
            await p.screenshot(path=f"{OUT}/{VP}-{MODE}-06c-secousse.png"); shake_seen=await p.evaluate("()=>window.__sylviniaRythme.shake()"); break
        await p.wait_for_timeout(15)
    report["checks"]["secousse_capture"]=shake_seen
    report["checks"]["combo_avant_pause"]=await p.evaluate("()=>window.__sylviniaRythme.combo()")
    report["checks"]["taquineries_avant_pause"]=await p.evaluate("()=>window.__sylviniaRythme.teases().length")
    # Pause puis « Reprendre plus tard »
    await p.keyboard.press("Escape"); await p.wait_for_timeout(500)
    report["checks"]["pause_phase"]=await p.evaluate("()=>window.__sylviniaRythme.phase()")
    await snap("07-pause")
    before=await p.evaluate("()=>({t:window.__sylviniaRythme.time(), j:window.__sylviniaRythme.judgements()})")
    await p.locator(".rythme-actions button:has-text('Reprendre plus tard')").click(); await p.wait_for_timeout(900)
    saved=await p.evaluate("()=>JSON.parse(localStorage.getItem('sylvinia_ca_rythme_v1')||'{}')")
    entry=list(saved.values())[0] if saved else None
    report["checks"]["save_after_leave"]={"keys":list(saved.keys()),"time":entry and round(entry["time"],3),"pause_time":round(before["t"],3),"judged":entry and sum(1 for j in entry["judgements"] if j)}
    report["checks"]["closed"]=await p.locator(".rythme-layer").count()==0
    # Rechargement complet de la page, puis reprise
    await p.reload(); await p.wait_for_timeout(900); await p.keyboard.press("Enter"); await p.wait_for_timeout(900)
    await p.click(".t-item.principal"); await p.wait_for_timeout(2000); await close_modals(p)
    await dev(); await p.locator("#caDevRythme").click(); await p.wait_for_timeout(1200)
    resume_label=await p.locator(".rythme-actions button").first.inner_text()
    report["checks"]["resume_button"]=resume_label
    await snap("08-reprendre")
    await p.locator(".rythme-actions button:has-text('Reprendre à')").click(); await p.wait_for_timeout(300)
    after=await p.evaluate("()=>({t:window.__sylviniaRythme.time(), j:window.__sylviniaRythme.judgements()})")
    report["checks"]["resume_exact"]={"time_saved":round(before["t"],3),"time_resumed":round(after["t"],3),"same_judgements":after["j"]==before["j"]}
    await p.evaluate(BOT, {"miss":[70,90],"touch":TOUCH})
    await wait_t(after_hit(starts[2]+12)); await level("position3-fin"); await snap("09-jauge-trois-quarts")
    await wait_t(after_hit(starts[3]+6)); await level("face-a-face"); await snap("10-face-a-face")
    # Effets réduits : même moment de jeu, réactions atténuées et zoom coupé
    await p.keyboard.press("Escape"); await p.wait_for_timeout(400)
    await p.locator(".rythme-choix.petit button:has-text('Effets réduits')").click(); await p.wait_for_timeout(200)
    await snap("10b-pause-reglages")
    await p.locator(".rythme-actions button:has-text('Reprendre')").first.click()
    await p.wait_for_timeout(3300)
    tnow=await t(); await wait_t(after_hit(tnow+0.3)); await level("effets-reduits"); await snap("10c-effets-reduits")
    await p.keyboard.press("Escape"); await p.wait_for_timeout(400)
    await p.locator(".rythme-choix.petit button:has-text('Effets pleins')").click(); await p.wait_for_timeout(200)
    await p.locator(".rythme-actions button:has-text('Reprendre')").first.click(); await p.wait_for_timeout(3300)
    final_t=[tm for tm,k,sec in notes if k=="final"][0]
    await wait_t(after_hit(final_t-1.0)); await level("montee"); await snap("11-montee-finale")
    await wait_t(final_t+2.2); await level("apogee-tenue"); await snap("11b-apogee-tenue")
    await wait_t(END+0.02); await p.wait_for_timeout(120)
    report["checks"]["apogee"]=await p.evaluate("()=>({flag:window.__sylviniaRythme.apogee(), classe:document.querySelector('.rythme-layer').classList.contains('apogee'), voile:getComputedStyle(document.querySelector('.rythme-apogee-voile')).opacity})")
    await level("apogee"); await snap("12-apogee-eclat")
    report["checks"]["taquineries"]=await p.evaluate("()=>window.__sylviniaRythme.teases().length")
    report["checks"]["sons"]=await p.evaluate("()=>window.__sylviniaRythme.sfx()")
    report["checks"]["combo_fin"]=await p.evaluate("()=>window.__sylviniaRythme.combo()")
    report["checks"]["secousse_fin"]=await p.evaluate("()=>window.__sylviniaRythme.shake()")
    report["levels"]=levels
    await p.wait_for_selector(".rythme-panneau.resultat", timeout=15000)
    report["checks"]["result"]=await p.locator(".rythme-panneau.resultat").inner_text()
    await snap("13-bilan")
    await p.locator(".rythme-actions button:has-text('Continuer')").click(); await p.wait_for_timeout(700)
    report["checks"]["conclusion_line"]=await p.locator(".dialogue-box p").first.inner_text()
    report["checks"]["zoom_nettoye"]=await p.evaluate("()=>document.querySelector('.interactive-intimacy')?.style.getPropertyValue('--rythme-zoom')||''")
    await snap("14-conclusion")
    for i in range(8):
        if await p.locator(".intimacy-cg").count(): break
        await p.locator(".dialogue-box").first.click(); await p.wait_for_timeout(450)
    report["checks"]["post_orgasm_cg"]=await p.evaluate("()=>document.querySelector('.intimacy-cg')?.dataset.intimacyCg||null")
    await snap("15-apres")
    report["checks"]["save_cleared"]=await p.evaluate("()=>localStorage.getItem('sylvinia_ca_rythme_v1')")
    report["checks"]["autosave_untouched_rythme"]=await p.evaluate("()=>!JSON.stringify(JSON.parse(localStorage.getItem('sylvinia-liens-autosave'))).includes('rythme')")
    report["errors"]=[e for e in errs if "favicon" not in e[1] and "studio" not in e[1]]
    await b.close()
  print(json.dumps(report,ensure_ascii=False,indent=1))
  json.dump(report,open(f"{OUT}/{VP}-{MODE}-rapport.json","w"),ensure_ascii=False,indent=1)
asyncio.run(main())
