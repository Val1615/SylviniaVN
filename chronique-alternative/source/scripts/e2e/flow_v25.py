# Parcours v2.5 : présent + réaction, lettre, job (lanceur), scène (choix + historique), fin de journée -> bilan -> continuer, sauvegarde/chargement.
# Usage : CA_BASE=… python3 flow_v25.py [dossier] [830x525t,1920x1080]
import os, sys, asyncio, json
from playwright.async_api import async_playwright
from common import *
SAVE=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),"saves","save-v25-allenna.json")).read()
OUT=sys.argv[1] if len(sys.argv)>1 else f"{SHOTS}/v25"
VPS=[tuple(int(x) for x in v.rstrip("t").split("x"))+(v.endswith("t"),) for v in (sys.argv[2] if len(sys.argv)>2 else "830x525t,1920x1080").split(",")]
RESULTS=[]
def check(tag, name, ok, info=""):
    RESULTS.append((tag,name,bool(ok))); print("PASS" if ok else "FAIL", tag, name, info)
async def run(pw,w,h,touch):
    b=await pw.chromium.launch(); ctx=await b.new_context(viewport={"width":w,"height":h},has_touch=touch,is_mobile=touch)
    p=await ctx.new_page(); errs=[]; hook(p,errs); p.set_default_timeout(6000)
    tag=f"{w}x{h}"
    async def snap(n): await p.wait_for_timeout(450); await p.screenshot(path=f"{OUT}/flux-{tag}-{n}.png")
    async def rel(cid="allenna"):
        return await p.evaluate("(c)=>{const g=JSON.parse(localStorage.getItem('sylvinia-liens-autosave'));return {day:g.day,period:g.period,coins:g.coins,aff:g.relationships[c].affection,trust:g.relationships[c].trust}}", cid)
    async def tab(label):
        if w>760: await p.locator(".hud-onglets .onglet:visible").nth(["Lieu","Carte","Liens","Journal","Jobs","Biens","Codex"].index(label)).click()
        else:
            nav=p.locator(f".nav-mobile button:visible:has-text('{label}')")
            if await nav.count(): await nav.first.click()
            else:
                await p.locator(".nav-mobile button:visible:has-text('Plus')").first.click(); await p.wait_for_timeout(400)
                await p.locator(f"dialog[open] button:has-text('{label}'), .feuille button:has-text('{label}')").first.click()
        await p.wait_for_timeout(600)
    async def reset():
        if p.url.startswith("http"): await p.evaluate("(s)=>{localStorage.setItem('sylvinia-liens-autosave',s)}", SAVE)
        else:
            await p.goto(BASE); await p.evaluate("(s)=>{localStorage.clear();localStorage.setItem('sylvinia-liens-autosave',s)}", SAVE)
        await p.goto(BASE); await p.wait_for_timeout(900)
        await p.keyboard.press("Enter"); await p.wait_for_timeout(900)
        await p.click(".t-item.principal"); await p.wait_for_timeout(2000)
        for i in range(3):
            if await p.locator("dialog[open], .modal-backdrop").count()==0: break
            await p.keyboard.press("Escape"); await p.wait_for_timeout(400)
    async def clear_blockers():
        for i in range(8):
            if await p.locator("[data-bilan]").count(): return "bilan"
            if await p.locator(".dialogue-overlay").count(): await play_scene(p); await p.wait_for_timeout(500); continue
            if await p.locator(".modal-backdrop").count(): await close_modals(p); await p.wait_for_timeout(300); continue
            if await p.locator("dialog[open]").count(): await p.keyboard.press("Escape"); await p.wait_for_timeout(300); continue
            return None
    async def wait_day_change(start_day, shot_prefix=None):
        for k in range(8):
            if await p.locator("[data-bilan]").count(): return True
            g=await rel()
            if g["day"]>start_day and await p.locator("[data-bilan]").count()==0:
                await p.wait_for_timeout(1500)
                if await p.locator("[data-bilan]").count(): return True
            await tab("Lieu")
            await p.click("[data-cmd=attendre]"); await p.wait_for_timeout(450)
            if await p.locator("dialog[open] [data-attendre]").count(): await p.locator("dialog[open] [data-attendre]").first.click()
            for t in range(30):
                await p.wait_for_timeout(150)
                if await p.locator("[data-bilan]").count(): return True
            if await clear_blockers()=="bilan": return True
        return bool(await p.locator("[data-bilan]").count())
    await reset()
    # 1. Présent aimé -> réaction réelle
    try:
        before=await rel()
        await tab("Lieu"); await p.click("[data-cmd=offrir]"); await p.wait_for_timeout(900)
        check(tag,"cadeau: fenêtre V2", await p.locator(".v2-fen.v2-cadeau .cad-carte").count()>0)
        fav=p.locator(".cad-carte.aime[data-don]"); check(tag,"cadeau: favoris marqués (giftLikes)", await fav.count()>0)
        await p.locator("[data-don='boussole']").first.click(); await p.wait_for_timeout(1300)
        after=await rel(); await snap("01-cadeau-reaction")
        ok=await p.locator(".v2-reaction .fen-sprite.ravi").count()==1 and await p.locator(".cad-gains .aff").count()==1
        txt=await p.locator(".cad-gains").inner_text() if await p.locator(".cad-gains").count() else ""
        check(tag,"cadeau: réaction ravie + gains = écart réel", ok and f"+{after['aff']-before['aff']}" in txt, f"{before['aff']}->{after['aff']} [{txt.strip()}]")
        await p.locator(".v2-reaction .primary-action").click(); await p.wait_for_timeout(500)
        check(tag,"cadeau: fermeture", await p.locator(".v2-reaction").count()==0)
    except Exception as e: check(tag,"cadeau", False, str(e).splitlines()[0][:150])
    # 2. Lettre + réponse
    try:
        await tab("Journal"); await p.locator(".signet").nth(1).click(); await p.wait_for_timeout(500)
        await p.locator(".v2-root [data-lettre], .v2-root button:has-text('Lire'), .v2-root .courrier button").first.click(); await p.wait_for_timeout(700)
        check(tag,"lettre: parchemin V2", await p.locator(".v2-lettre .lettre-papier").count()==1)
        rep=p.locator("[data-reponse]")
        if await rep.count():
            await rep.first.click(); await p.wait_for_timeout(700); await snap("02-lettre-reponse")
            check(tag,"lettre: réponse enregistrée", await p.locator(".lettre-reponse, .v2-avis").count()>0)
        await clear_blockers()
    except Exception as e: check(tag,"lettre", False, str(e).splitlines()[0][:150])
    # 3. Scène avec choix + historique
    try:
        await reset(); await tab("Lieu"); await p.click("[data-cmd=parler]"); await p.wait_for_timeout(1400)
        for i in range(60):
            if await p.locator(".choice-box button").count() or not await p.locator(".dialogue-overlay").count(): break
            await p.locator(".dialogue-box").first.click(); await p.wait_for_timeout(180)
        check(tag,"scène: choix en cartes", await p.locator(".choice-box button.v2-choix-carte").count()>0)
        await p.keyboard.press("h"); await p.wait_for_timeout(500)
        n1=await p.locator(".scene-backlog .backlog-ligne").count(); check(tag,"scène: historique (H)", n1>0, f"{n1} lignes")
        await p.keyboard.press("Escape"); await p.wait_for_timeout(400)
        check(tag,"scène: Échap ferme l’historique sans quitter", await p.locator(".scene-backlog").count()==0 and await p.locator(".dialogue-overlay").count()==1)
        await p.locator(".choice-box button:not([disabled])").first.click(); await p.wait_for_timeout(500)
        await p.locator("[data-act=backlog]").click(); await p.wait_for_timeout(500); await snap("03-historique-choix")
        check(tag,"scène: le choix figure dans l’historique", await p.locator(".backlog-ligne.choix").count()>=1)
        await p.locator(".scene-backlog [data-close]").click(); await p.wait_for_timeout(300)
        await play_scene(p); await p.wait_for_timeout(600); await clear_blockers()
    except Exception as e:
        check(tag,"scène", False, str(e).splitlines()[0][:150]); await p.screenshot(path=f"/tmp/err-scene-{tag}.png"); print(await buttons(p,"body"))
    # 4. Job : lanceur V2 -> accepter
    try:
        await tab("Jobs"); await p.locator(".affiche").first.click(); await p.wait_for_timeout(600)
        await p.locator("dialog[open] [data-act=go]").first.click(); await p.wait_for_timeout(1800)
        if not await p.locator(".v2-job").count():
            await play_scene(p); await clear_blockers(); await tab("Jobs"); await p.locator(".affiche").first.click(); await p.wait_for_timeout(500); await p.locator("dialog[open] [data-act=go]").first.click(); await p.wait_for_timeout(1500)
        check(tag,"job: lanceur V2 (bannière + gains)", await p.locator(".v2-job.phase-briefing .job-banniere").count()==1)
        await p.locator("[data-act=job-accepter]").click(); await p.wait_for_timeout(700); await snap("04-job-partie")
        check(tag,"job: partie lancée", await p.locator(".v2-job.phase-briefing").count()==0 and await p.locator(".v2-job").count()==1)
    except Exception as e: check(tag,"job", False, str(e).splitlines()[0][:150])
    # 5. Fin de journée -> bilan -> continuer (reprise de l’état après le présent)
    try:
        await reset()
        start=await rel(); await tab("Lieu"); await p.click("[data-cmd=offrir]"); await p.wait_for_timeout(800)
        await p.locator("[data-don='boussole']").first.click(); await p.wait_for_timeout(900); await p.locator(".v2-reaction .primary-action").click(); await p.wait_for_timeout(400)
        mid=await rel()
        got=await wait_day_change(start["day"])
        check(tag,"bilan: apparaît au changement de jour", got)
        if got:
            await p.wait_for_timeout(250); await p.screenshot(path=f"{OUT}/flux-{tag}-05-bilan-anim.png")
            was_complete=await p.locator(".bilan-jour.complet").count()==1
            rows=await p.locator(".bj-ligne").all_inner_texts()
            allenna=[r for r in rows if "Allenna" in r]
            check(tag,"bilan: Allenna = écart réel", allenna and f"+{mid['aff']-start['aff']}" in allenna[0].replace("\n"," "), " | ".join(r.replace("\n"," ") for r in rows)[:300])
            await p.mouse.click(w//2, h//2); await p.wait_for_timeout(300)
            check(tag,"bilan: 1er toucher = tout afficher (sans fermer)", (not was_complete) and await p.locator(".bilan-jour.complet").count()==1, f"déjà complet={was_complete}")
            await snap("06-bilan-complet")
            await p.mouse.click(w//2, h//2); await p.wait_for_timeout(500)
            check(tag,"bilan: 2e toucher = continuer", await p.locator("[data-bilan]").count()==0)
    except Exception as e: check(tag,"bilan", False, str(e).splitlines()[0][:150])
    # 6. Sauvegarde / chargement : pas de bilan après chargement
    try:
        await clear_blockers()
        g0=await rel()
        await p.keyboard.press("Escape"); await p.wait_for_timeout(600)
        await p.locator("dialog[open] button:has-text('Sauvegarder')").first.click(); await p.wait_for_timeout(600)
        await p.locator("dialog[open] button:has-text('Sauvegarder')").first.click(); await p.wait_for_timeout(700)
        while await p.locator("dialog[open]").count(): await p.keyboard.press("Escape"); await p.wait_for_timeout(350)
        got=await wait_day_change(g0["day"])
        if got:
            await p.keyboard.press("Enter"); await p.wait_for_timeout(200); await p.keyboard.press("Enter"); await p.wait_for_timeout(500)
        check(tag,"sauvegarde: bilan clavier (Entrée ×2)", await p.locator("[data-bilan]").count()==0)
        await p.keyboard.press("Escape"); await p.wait_for_timeout(600)
        await p.locator("dialog[open] button:has-text('Charger')").first.click(); await p.wait_for_timeout(600)
        await p.locator("dialog[open] button:has-text('Charger')").nth(1).click(); await p.wait_for_timeout(2500)
        g1=await rel()
        check(tag,"chargement: état restauré", g1["day"]==g0["day"] and g1["period"]==g0["period"], f"{g0} -> {g1}")
        check(tag,"chargement: aucun bilan parasite", await p.locator("[data-bilan]").count()==0)
        await snap("07-apres-chargement")
    except Exception as e: check(tag,"sauvegarde", False, str(e).splitlines()[0][:150])
    bad=[e for e in errs if e[0]!="reqfail" and "404" not in e[1]]
    check(tag,"console: aucune erreur", not bad, str(bad[:3])); print(tag, "404/reqfail:", [e for e in errs if e[0]=="reqfail"][:4])
    await b.close()
async def main():
    async with async_playwright() as pw:
        for w,h,t in VPS: await run(pw,w,h,t)
    print("TOTAL", sum(1 for r in RESULTS if r[2]), "/", len(RESULTS))
asyncio.run(main())
