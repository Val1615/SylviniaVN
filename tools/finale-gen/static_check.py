import json,sys
from playwright.sync_api import sync_playwright
URL="http://localhost:8893/index.html"
with sync_playwright() as p:
    b=p.chromium.launch(executable_path="/usr/bin/google-chrome")
    pg=b.new_page(); errs=[]
    pg.on("console", lambda m: errs.append(m.text) if m.type=="error" else None)
    pg.on("pageerror", lambda e: errs.append("PAGEERROR "+str(e)))
    pg.goto(URL); pg.wait_for_timeout(3000)
    r=pg.evaluate("""()=>{
      const ids=Object.keys(S).filter(k=>/^c1[789]_/.test(k)); const prob=[];
      for(const id of ids){const s=S[id];
        const nx=[]; if(s.next) nx.push(s.next); (s.choices||[]).forEach(c=>nx.push(c.next));
        if(!s.next && !(s.choices||[]).length) prob.push(id+' sans suite');
        nx.forEach(n=>{ if(n!=='menu' && !S[n]) prob.push(id+' -> '+n+' manquant'); });
        if(!A[s.bg]) prob.push(id+' bg '+s.bg); if(s.music && !A[s.music]) prob.push(id+' music '+s.music);
        (s.chars||[]).forEach(c=>{ if(!A[c[1]]) prob.push(id+' sprite '+c[1]); });
        try{ if(typeof s.text==='function') s.text(); }catch(e){prob.push(id+' text '+e)}
      }
      return {n:ids.length, prob, s01:S.c16_s01_fin.choices.map(c=>c.label), bubble:document.querySelector('.menuUpdateBubble')?.textContent, cards:CHAPTER_SELECT_DATA.map(c=>c.key).slice(-5)};
    }""")
    print(json.dumps(r,ensure_ascii=False,indent=1)); print("ERREURS", errs)
    b.close()
