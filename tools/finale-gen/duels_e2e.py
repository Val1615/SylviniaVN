# Duels du final dans l'interface réelle (Bibliothèque astrale) : QTE en temps réel, Game Over + reprise,
# sauvegarde/rechargement en plein duel, relecture du Chapitre XVIII, captures aux 3 formats.
import json, os, sys
from playwright.sync_api import sync_playwright
PORT = os.environ.get('PORT', '8894'); URL = f"http://127.0.0.1:{PORT}/index.html?cb=e2e"
OUT = os.environ.get('SHOTS', '/workspace/verification/finale-duels')
BASE = {"s01AssaultComplete": True, "chapter15Complete": True, "chapter4DComplete": True, "c15WalkedWithDraven": True,
        "chapter13IComplete": True, "c13iHeldAmaneaWhole": True, "s02Adieu": "confiance", "s02Regard": "remerii"}
results = []; errs = []
def check(name, ok, info=None): results.append((name, bool(ok), info)); print(("OK " if ok else "KO ") + name, info if not ok or info else "")

def page(b, W, H, flags, scene="c16_s01_fin"):
    c = b.new_context(viewport={"width": W, "height": H}, has_touch=True)
    save = {"scene": scene, "stats": {"audace": 3, "lien": 8}, "flags": flags, "inventory": [], "memories": [], "history": []}
    c.add_init_script("if(!sessionStorage.getItem('e2e')){sessionStorage.setItem('e2e','1');localStorage.setItem('sylvinia_ui_biblio_v1', JSON.stringify({skin:'biblio',sons:false}));localStorage.setItem('sylvinia_vn_v82', %s);}" % json.dumps(json.dumps(save)))
    pg = c.new_page()
    pg.on("pageerror", lambda e: errs.append(str(e)[:200]))
    pg.on("console", lambda m: errs.append(m.text[:160]) if m.type == "error" else None)
    pg.goto(URL); pg.wait_for_function("window.BibliothequeAstrale && window.SylviniaFinaleDuels"); pg.wait_for_timeout(2500)
    pg.evaluate("load()")
    return c, pg

def show(pg, sid, flags=None, wait=1600):
    pg.evaluate("([sid,f])=>{ if(f) state.flags={...state.flags,...f}; state.scene=sid; state.history=[]; setScreen('game'); render(); BibliothequeAstrale.aller('#/jeu'); }", [sid, flags])
    pg.wait_for_timeout(wait)

def reveal(pg, n=6):
    for _ in range(n):
        pg.evaluate("()=>{ if(!document.querySelector('#combatTransition.active')) BibliothequeAstrale.racine.querySelector('.jeu')?.click(); }"); pg.wait_for_timeout(140)
    pg.wait_for_timeout(500)

def ui(pg):
    return pg.evaluate("""()=>{const R=BibliothequeAstrale.racine; const hud=R.querySelector('.combat-hud'); const ch=R.querySelector('.choix');
      const q=R.querySelector('.choix .question'); const jeu=R.querySelector('.jeu');
      return {scene:state.scene, hud: hud? (hud.textContent+' '+[...hud.querySelectorAll('.combatBox[title]')].map(x=>x.title).join(' ')).replace(/\\s+/g,' ').trim():'', /* v0.426 : barre compacte, nom complet des jauges dans l’infobulle */ hudVisible: !!hud && hud.getBoundingClientRect().height>10,
        choix: ch && !ch.hidden ? [...ch.querySelectorAll('.ch')].map(x=>x.textContent.replace(/\\s+/g,' ').trim()) : [],
        header: q? q.textContent.trim():'', combat: document.getElementById('stage').classList.contains('combatMode'),
        qteTimer: !!(hud && hud.querySelector('#fdQteTimer')), overflow: (()=>{const c=R.querySelector('.choix'); if(!c||c.hidden) return 0; const r=c.getBoundingClientRect(); return Math.round(Math.max(0, r.bottom-innerHeight));})()}}""")

def click_choice(pg, label):
    ok = pg.evaluate("(l)=>{const b=[...BibliothequeAstrale.racine.querySelectorAll('.choix .ch')].find(x=>x.textContent.includes(l)); if(!b) return false; b.click(); return true;}", label)
    pg.wait_for_timeout(1500); return ok

with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--mute-audio"])
    # ── S04 Phase A
    c, pg = page(b, 1024, 880, BASE)
    show(pg, 'c17_duel_intro', wait=400)
    check("S04 voile #combatTransition natif", pg.evaluate("!!document.querySelector('#combatTransition.active')"))
    pg.wait_for_timeout(1300)
    show(pg, 'c17_m2', {"s04M1": "good"}); reveal(pg)
    u = ui(pg); check("S04 phase A : HUD Posture / Vitalité", 'Posture' in u['hud'] and 'Vitalité' in u['hud'] and 'Puissance révélée' not in u['hud'] and u['hudVisible'] and u['combat'], u)
    check("S04 en-tête « Le choix de Valurn »", u['header'].endswith('Le choix de Valurn'), u['header'])
    pg.screenshot(path=f"{OUT}/s04_valurn_phaseA_1024x880.png")
    # Phase B : 2e jauge + QTE
    show(pg, 'c17_revelation', {"s04M1": "good", "s04M2": "good", "s04M3": "good"}); reveal(pg)
    check("S04 révélation : jauge « Puissance révélée »", 'Puissance révélée' in ui(pg)['hud'])
    show(pg, 'c17_qte', {"s04M4": "good", "s04M5": "good", "s04Qte": None}, wait=1300); reveal(pg, 3)
    u = ui(pg); check("S04 phase B : QTE chronométré + 3 jauges", u['qteTimer'] and 'Puissance révélée' in u['hud'], u)
    pg.screenshot(path=f"{OUT}/s04_valurn_phaseB_1024x880.png")
    ok = click_choice(pg, 'Esquiver et riposter'); check("S04 QTE réussi → c17_qte_ok", ok and pg.evaluate("state.scene") == 'c17_qte_ok', pg.evaluate("state.scene"))
    # Échec réel du QTE (expiration du temps) → Game Over → reprise au début du duel
    show(pg, 'c17_qte', {"s04Qte": None}, wait=200)
    total = pg.evaluate("SylviniaFinaleDuels.durationOf(S.c17_qte)")
    pg.wait_for_timeout(total + 2200)
    check("S04 QTE expiré → Game Over phase B", pg.evaluate("state.scene") == 'c17_gameover_b', pg.evaluate("state.scene"))
    reveal(pg, 4); u = ui(pg)
    check("Game Over : « Réessayer le duel » + menu", any('Réessayer le duel' in x for x in u['choix']) and any('menu' in x.lower() for x in u['choix']), u['choix'])
    pg.screenshot(path=f"{OUT}/duel_gameover_1024x880.png")
    before = pg.evaluate("({...state.flags})")
    click_choice(pg, 'Réessayer le duel')
    after = pg.evaluate("({scene:state.scene, flags:state.flags, v:SylviniaFinaleDuels.calc('s04',0), inv:state.inventory})")
    check("Reprise S04 : scène de départ du duel (pas le début du chapitre)", after['scene'] == 'c17_duel_intro', after['scene'])
    check("Reprise S04 : jauges et flags du duel remis à zéro", all(after['flags'].get(k) is None for k in ['s04M1','s04M2','s04M3','s04M4','s04M5','s04Qte']) and after['v']['valurn'] == 10 and after['v']['amanea'] == 10)
    check("Reprise S04 : flags antérieurs et inventaire conservés", after['flags'].get('s02Adieu') == 'confiance' and after['flags'].get('chapter4DComplete'), after)
    saved = pg.evaluate("JSON.parse(localStorage.getItem('sylvinia_vn_v82')).scene")
    check("Reprise S04 : sauvegarde sur le départ du duel", saved == 'c17_duel_intro', saved)
    c.close()
    # Phase B à 830x525
    c, pg = page(b, 830, 525, {**BASE, "s04M1": "good", "s04M2": "good", "s04M3": "good", "s04M4": "good", "s04M5": "good"})
    show(pg, 'c17_qte', wait=1300); reveal(pg, 3); u = ui(pg)
    check("S04 phase B 830x525 : jauge + QTE + choix visibles", u['qteTimer'] and u['choix'] and u['overflow'] == 0, u)
    pg.screenshot(path=f"{OUT}/s04_valurn_phaseB_830x525.png")
    c.close()
    # ── S06, S07, S08 et sauvegarde/rechargement en plein duel aux 3 formats
    for W, H in [(1024, 880), (830, 525), (880, 1024)]:
        c, pg = page(b, W, H, BASE)
        show(pg, 'c18_dp_grotte', {"s06Posture": "tenir", "s06LinevaWords": "fierte"}); reveal(pg)
        u = ui(pg); check(f"S06 {W}x{H} HUD Endurance/Horde + choix", 'Endurance de Draven' in u['hud'] and 'Pression de la horde' in u['hud'] and len(u['choix']) == 2 and u['overflow'] == 0 and u['header'].endswith('Le choix de Draven'), u)
        if W == 1024: pg.screenshot(path=f"{OUT}/s06_draven_duel_1024x880.png")
        show(pg, 'c18_dp_lineva'); reveal(pg, 10); u = ui(pg)
        check(f"S06 {W}x{H} pause Lineva : pas de chrono, pas de HUD", not u['qteTimer'] and not u['combat'] and not pg.evaluate("SylviniaFinaleDuels.qteActive()"), u)
        show(pg, 'c18_ip_maitrise', {"s07Maitrise": None}, wait=2200); reveal(pg)
        u = ui(pg); check(f"S07 {W}x{H} HUD Arcane/Emprise + choix", 'Arcane d’Iriana' in u['hud'] and 'Emprise d’Alamma' in u['hud'] and len(u['choix']) == 3 and u['overflow'] == 0 and u['header'].endswith('Le choix d’Iriana'), u)
        if W == 1024: pg.screenshot(path=f"{OUT}/s07_iriana_direct_1024x880.png")
        show(pg, 'c18_ip_flux', {"s07Maitrise": "lire", "s07Garde": "esprit"}, wait=1200); reveal(pg, 3)
        u = ui(pg); check(f"S07 {W}x{H} pivot Chaos filtré + QTE", 'Chaos filtré' in u['hud'] and u['qteTimer'], u)
        if W == 1024: pg.screenshot(path=f"{OUT}/s07_iriana_flux_qte_1024x880.png")
        show(pg, 'c18_bh_dragon', {"s08Gardien": "rempart", "s08Sync": "ok"}); reveal(pg)
        u = ui(pg); check(f"S08 {W}x{H} HUD Bhaal/Blizzard/Flux + choix", 'Pression de Bhaal' in u['hud'] and 'Blizzard' in u['hud'] and 'Flux d’Arcane' in u['hud'] and len(u['choix']) == 3 and u['overflow'] == 0, u)
        if W == 1024: pg.screenshot(path=f"{OUT}/s08_bhaal_duel_1024x880.png")
        # Sauvegarde puis rechargement en plein duel S07
        show(pg, 'c18_ip_domination_r', {"s07Maitrise": "frapper", "s07Garde": "regard"})
        exp = pg.evaluate("SylviniaFinaleDuels.calc('s07',3)"); pg.evaluate("save()")
        pg.reload(); pg.wait_for_function("window.SylviniaFinaleDuels"); pg.wait_for_timeout(2500)
        pg.evaluate("load(); setScreen('game'); render(); BibliothequeAstrale.aller('#/jeu')"); pg.wait_for_timeout(1500)
        got = pg.evaluate("({s:state.scene, v:SylviniaFinaleDuels.calc('s07',3), hud: document.getElementById('stats').textContent})")
        check(f"Rechargement en plein duel {W}x{H} : scène + jauges restituées", got['s'] == 'c18_ip_domination_r' and got['v'] == exp and 'Emprise' in got['hud'], got)
        c.close()
    # ── QTE réels S06 / S07 / S08 : expiration → Game Over → reprise au départ du duel
    for sid, fl, go_id, start, duel in [('c18_dp_voute', {"s06Posture": "tenir", "s06LinevaWords": "promesse", "s06Plan": "combattre"}, 'c18_dp_gameover_voute', 'c18_dp_crevasse', 's06'),
                                         ('c18_ip_flux', {"s07Maitrise": "lire", "s07Garde": "esprit"}, 'c18_ip_gameover_chaos', 'c18_ip_maitrise', 's07'),
                                         ('c18_bh_sync', {"s08Gardien": "rempart", "s08Reponse": "main", "s08Arcane": "accueillie"}, 'c18_bh_gameover_sync', 'c18_bh_blizzard', 's08')]:
        c, pg = page(b, 1024, 880, {**BASE, **fl})
        show(pg, sid, wait=200); total = pg.evaluate("(s)=>SylviniaFinaleDuels.durationOf(S[s])", sid)
        pg.wait_for_timeout(total + 2200)
        check(f"{duel} QTE expiré en temps réel → {go_id}", pg.evaluate("state.scene") == go_id, pg.evaluate("state.scene"))
        reveal(pg, 4); click_choice(pg, 'Réessayer le duel')
        r = pg.evaluate("(d)=>({s:state.scene, f:state.flags, ok: SylviniaFinaleDuels.DUELS[d].reset.every(k=>state.flags[k]==null)})", duel)
        check(f"{duel} reprise → {start}, jauges remises à zéro, flags antérieurs gardés", r['s'] == start and r['ok'] and r['f'].get('s02Adieu') == 'confiance', r['s'])
        c.close()
    # ── QTE en pause pendant le menu
    c, pg = page(b, 1024, 880, {**BASE, "s06Posture": "tenir", "s06LinevaWords": "promesse", "s06Plan": "combattre"})
    show(pg, 'c18_dp_voute', wait=1500); l1 = pg.evaluate("SylviniaFinaleDuels.qteActive().left")
    pg.evaluate("BibliothequeAstrale.aller('#/')"); pg.wait_for_timeout(3000); l2 = pg.evaluate("SylviniaFinaleDuels.qteActive()?.left")
    check("QTE en pause hors de l'écran de jeu", l2 is not None and abs(l1 - l2) < 400, [l1, l2])
    c.close()
    # ── Relecture du Chapitre XVIII depuis le menu des chapitres
    real = {**BASE, "chapter17Complete": True, "chapter18Complete": True, "c18PlayedRemerii": True, "s08Gardien": "assaut", "s08Reponse": "seule", "finaleSeenDraven": False, "tome1Complete": True}
    c, pg = page(b, 1024, 880, real, scene="c19_fin")
    pg.evaluate("launchChapterSelect('ch18')"); pg.wait_for_timeout(1500)
    r = pg.evaluate("({s:state.scene, l:S.c18_carrefour.choices.map(c=>c.label)})")
    check("Relecture : retour au carrefour, déblocages gardés, « (déjà jouée) »", r['s'] == 'c18_carrefour' and len(r['l']) == 3 and '(déjà jouée)' in r['l'][0], r)
    pg.evaluate("""()=>{ choose(S.c18_carrefour.choices.find(c=>c.next==='c18_dp_intro')); let g=0; while(state.scene!=='c18_s06_fin' && g++<200){ const s=S[state.scene]; const ch=(s.choices||[]).find(c=>c.best)||(s.choices||[])[0]; if(s.next && !(s.choices||[]).length) go(s.next); else choose(ch);} }""")
    r = pg.evaluate("({s:state.scene, l:S.c18_s06_fin.choices.map(c=>c.label), g:state.flags.s08Gardien, played:state.flags.c18PlayedDraven})")
    check("Relecture Draven : fin de branche + « Terminer la relecture »", r['s'] == 'c18_s06_fin' and 'Terminer la relecture' in r['l'] and r['played'], r)
    pg.evaluate("choose(S.c18_s06_fin.choices.find(c=>c.next==='__finale_replay_end'))"); pg.wait_for_timeout(800)
    r = pg.evaluate("({s:state.scene, f:state.flags, saved: JSON.parse(localStorage.getItem('sylvinia_vn_v82'))})")
    check("Relecture terminée : vraie partie intacte (scène, choix S08, épilogue) + Draven marqué joué",
          r['s'] == 'c19_fin' and r['f'].get('s08Gardien') == 'assaut' and r['f'].get('s08Reponse') == 'seule' and r['f'].get('finaleSeenDraven') is False
          and 'finaleReplay' not in r['f'] and r['f'].get('c18PlayedDraven') and r['saved']['scene'] == 'c19_fin', {k: r['f'].get(k) for k in ['s08Gardien', 'finaleSeenDraven', 'c18PlayedDraven', 'finaleReplay']})
    pg.evaluate("launchChapterSelect('ch18')"); pg.wait_for_timeout(800)
    lab = pg.evaluate("S.c18_carrefour.choices.map(c=>c.label)")
    check("Relecture : Draven affiché « (déjà jouée) »", any('Draven (déjà jouée)' in x for x in lab), lab)
    c.close()
    # ── Ancienne sauvegarde du Chapitre XV / S01 : migration
    c, pg = page(b, 1024, 880, {"chapter15Complete": True, "chapter15ReachedEnd": True}, scene="c15_end")
    r = pg.evaluate("({s:state.scene, ok: !!S[state.scene], u: chapterSelectUnlocked('ch18'), u17: chapterSelectUnlocked('ch17')})"); check("Sauvegarde du Chapitre XV chargée (XVIII encore verrouillé)", r['ok'] and r['s'] == 'c15_end' and not r['u'], r)
    c.close()
    b.close()
bad = [r for r in results if not r[1]]
other = [e for e in errs if 'C13G_SCENES' not in e and 'favicon' not in e and '404' not in e]
print(f"\n{len(results) - len(bad)}/{len(results)} vérifications OK ; erreurs console nouvelles : {other}")
json.dump({"results": results, "console": errs}, open('/tmp/duels_e2e.json', 'w'), ensure_ascii=False, indent=1)
sys.exit(1 if bad or other else 0)
