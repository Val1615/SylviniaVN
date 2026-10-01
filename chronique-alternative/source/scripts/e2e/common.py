import json
import os
BASE=os.environ.get("CA_BASE","http://127.0.0.1:8871/chronique-alternative/")
SHOTS=os.environ.get("CA_SHOTS", os.path.join(os.path.dirname(os.path.abspath(__file__)), "shots"))
def hook(p, errs):
    p.on("console", lambda m: errs.append(("console."+m.type, m.text)) if m.type in ("error","warning") else None)
    p.on("pageerror", lambda e: errs.append(("pageerror", str(e))))
    p.on("requestfailed", lambda r: errs.append(("reqfail", r.url)) if not r.url.endswith(".mp4") else None)
async def buttons(p, scope="body"):
    return await p.evaluate("""(s)=>[...document.querySelectorAll(s+' button')].filter(b=>b.offsetParent).map(b=>(b.className+'|'+b.innerText.replace(/\\s+/g,' ').trim()).slice(0,90))""", scope)
async def play_scene(p, maxsteps=120, shot=None):
    n=0
    for i in range(maxsteps):
        if not await p.locator(".dialogue-overlay").count(): return n
        ch=p.locator(".choice-box button")
        if await ch.count(): await ch.first.click()
        elif await p.locator(".dialogue-box").count(): await p.locator(".dialogue-box").first.click()
        else:
            # mini-jeu ou autre écran de scène
            return -1
        n+=1; await p.wait_for_timeout(180)
        if shot and i==2: await p.screenshot(path=shot)
    return n
async def close_modals(p, log=None):
    for i in range(6):
        if not await p.locator(".modal-backdrop").count(): return
        if log is not None: log.append(await buttons(p,".modal-backdrop"))
        c=p.locator(".modal-backdrop .modal-close")
        if await c.count(): await c.first.click()
        else:
            sec=p.locator(".modal-backdrop .secondary-action, .modal-backdrop .primary-action")
            if await sec.count(): await sec.last.click()
            else: return
        await p.wait_for_timeout(400)
async def gstate(p):
    return await p.evaluate("""()=>{const g=JSON.parse(localStorage.getItem('sylvinia-liens-autosave')||'null');return g&&{day:g.day,period:g.period,coins:g.coins,loc:g.location,spot:g.spot}}""")
