# Parcours automatisés du final (S01 → Épilogue) depuis une sauvegarde v82 sur c16_s01_fin.
# - 4 profils de déblocage (+ dev) × routes du carrefour (S06 / S07 / S08 directe).
# - Politiques de choix variées, QTE réussis ou expirés au hasard, Game Over → « Réessayer le duel ».
# - Vérifie : profils (Iriana ne voit jamais Draven et inversement), union des textes = 1 365 paragraphes,
#   reprise de Game Over sur la scène de départ du duel avec jauges remises à zéro et flags antérieurs conservés.
import json, sys, os
from playwright.sync_api import sync_playwright
PORT = os.environ.get('PORT', '8894')
URL = f"http://localhost:{PORT}/index.html?cb=traverse"
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import novel as N
PARAS = {str(i): N.para(i) for i in sorted(N.P) if i not in N.HEADINGS}
BASE = {"s01AssaultComplete": True, "chapter15Complete": True, "chapter15ReachedEnd": True}
COMBOS = {
  "aucun": ({}, False, ["remerii"]),
  "draven": ({"chapter4DComplete": True, "c15WalkedWithDraven": True}, False, ["draven", "remerii"]),
  "iriana": ({"chapter13IComplete": True, "c13iHeldAmaneaWhole": True}, False, ["iriana", "remerii"]),
  "les_deux": ({"chapter4DComplete": True, "c11gSeenDravenCourt": True, "chapter13IComplete": True, "c13iTruthWithoutDefense": True}, False, ["draven", "iriana", "remerii"]),
  "dev": ({}, True, ["draven", "iriana", "remerii"]),
}
DRAVEN_ONLY = ['c18_dp_intro', 'c18_draven_seul', 'c18_dp_crevasse', 'c18_pere', 'c18_dp_lineva', 'c18_grotte', 'c18_dp_voute', 'c18_effondrement', 'c18_s06_fin']
IRIANA_ONLY = ['c18_ip_intro', 'c18_trop_tard', 'c18_etreinte', 'c18_alamma', 'c18_ip_maitrise', 'c18_ip_flux', 'c18_ip_renversement', 'c18_saut', 'c18_s07_fin']
DUEL_START = {'s04': 'c17_duel_intro', 's06': 'c18_dp_crevasse', 's07': 'c18_ip_maitrise', 's08': 'c18_bh_blizzard'}

WALK = r"""
async ([policy, seed, route, qteFail, starts]) => {
  let rnd = seed; const rand = (n) => { rnd = (rnd * 1103515245 + 12345) % 2147483648; return Math.floor(rnd / 65536) % n; };
  load(); state.history = []; setScreen('game'); render();
  const D = window.SylviniaFinaleDuels;
  const visited = []; const texts = []; const picks = []; const gos = []; const retries = []; let guard = 0; let counter = 0; let bestMode = {};
  const qtes = [];
  while (guard++ < 3000) {
    const id = state.scene; const s = S[id];
    if (!s) return { error: 'scène inconnue ' + id, visited };
    visited.push(id);
    if (/^c1[789]_/.test(id)) { const t = typeof s.text === 'function' ? s.text() : s.text; texts.push(t); }
    if (id === 'c19_fin') {
      const ch = s.choices[0]; picks.push([id, ch.label]); choose(ch);
      return { ok: true, visited, picks, gos, retries, qtes, flags: state.flags, text: texts.join('\n\n'),
               screenAfter: document.getElementById('game')?.classList.contains('hidden') };
    }
    if (s.fgameover) {
      const duel = s.fduel; const before = JSON.parse(JSON.stringify(state.flags));
      gos.push([duel, id]);
      const retry = s.choices.find(c => c.label === 'Réessayer le duel');
      choose(retry);
      const v = D.calc(duel, 0); const start = D.DUELS[duel].gauges.every(g => v[g.k] === g.start);
      const resetKeys = D.DUELS[duel].reset;
      const keptOthers = Object.keys(before).filter(k => !resetKeys.includes(k)).every(k => JSON.stringify(before[k]) === JSON.stringify(state.flags[k]));
      const resetOk = resetKeys.every(k => state.flags[k] == null);
      retries.push({ duel, from: id, to: state.scene, expected: starts[duel], gaugesAtStart: start, resetOk, keptOthers,
                     notChapterStart: !['c17_intro', 'c18_carrefour_intro', 'c16_s01_fin'].includes(state.scene),
                     hudStart: (document.getElementById('stats')?.innerHTML || '').includes('fdHud') });
      bestMode[duel] = true; continue;
    }
    if (s.fqte) {
      const fail = qteFail && rand(3) === 0 && !bestMode[s.fduel];
      qtes.push([id, fail ? 'expire' : 'ok', D.qteActive() ? 'timer' : 'no-timer']);
      if (fail) { if (!D.expire()) go(s.fqte.fail); continue; }
    }
    let chs = (s.choices || []).filter(c => choiceAvailable(c) && c.next !== 'menu' && !String(c.next).startsWith('__'));
    if (id === 'c18_carrefour') chs = chs.filter(c => c.next === ({ draven: 'c18_dp_intro', iriana: 'c18_ip_intro', remerii: 'c18_s08_intro' })[route]);
    if (chs.length) {
      let k;
      const duel = s.fduel;
      if (duel && bestMode[duel] && chs.some(c => c.best)) k = chs.findIndex(c => c.best);
      else k = policy === 'first' ? 0 : policy === 'last' ? chs.length - 1 : policy === 'best' ? Math.max(0, chs.findIndex(c => c.best)) : policy === 'rot' ? (counter++ % chs.length) : rand(chs.length);
      if (id === 'c18_choix_arcane' && picks.filter(p => p[0] === id).length >= 2) k = chs.findIndex(c => c.next === 'c18_bh_sync');
      picks.push([id, chs[k].label]); choose(chs[k]);
    } else if (s.next) { go(s.next); }
    else return { error: 'impasse ' + id, visited };
    if (state.scene === id && !s.next) return { error: 'bloqué ' + id, visited };
  }
  return { error: 'boucle', visited: visited.slice(-30) };
}
"""

def run():
    out = {}; allvisited = set(); allpicks = set(); fails = []; union_text = []; checks = []
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--mute-audio"])
        for name, (extra, dev, routes) in COMBOS.items():
            flags = {**BASE, **extra}
            save = {"scene": "c16_s01_fin", "stats": {"audace": 3}, "flags": flags, "inventory": [], "memories": [], "history": [], "devMode": dev}
            ctx = b.new_context(viewport={"width": 830, "height": 525})
            ctx.add_init_script("localStorage.setItem('sylvinia_ui_biblio_v1', JSON.stringify({skin:'biblio'}));localStorage.setItem('sylvinia_vn_v82', %s);" % json.dumps(json.dumps(save)))
            pg = ctx.new_page(); errs = []
            pg.on("pageerror", lambda e: errs.append(str(e)[:200]))
            pg.on("console", lambda m: errs.append(m.text[:160]) if m.type == "error" else None)
            pg.on("dialog", lambda d: d.accept())
            pg.goto(URL, wait_until="domcontentloaded", timeout=120000)
            pg.wait_for_function("window.BibliothequeAstrale && window.SylviniaFinaleDuels", timeout=120000); pg.wait_for_timeout(2500)
            car = pg.evaluate("()=>{const s=JSON.parse(localStorage.getItem('sylvinia_vn_v82')); load(); state.scene='c18_carrefour'; render(); const r=S.c18_carrefour.choices.map(c=>c.label); return r}")
            runs = []
            policies = [("best", 1, False), ("first", 1, False), ("last", 1, True), ("rot", 1, True)] + [("rand", s, True) for s in range(7, 7 + 10)]
            for route in routes:
                for pol, seed, qf in policies:
                    pg.evaluate("(s)=>localStorage.setItem('sylvinia_vn_v82', s)", json.dumps(save))
                    r = pg.evaluate(WALK, [pol, seed, route, qf, DUEL_START])
                    if not r.get("ok"):
                        fails.append([name, route, pol, seed, r.get("error"), r.get("visited", [])[-5:]]); continue
                    vis = set(r["visited"])
                    allvisited |= vis; allpicks |= {tuple(x) for x in r["picks"]}; union_text.append(r["text"])
                    saw_d = sorted(vis & set(DRAVEN_ONLY)); saw_i = sorted(vis & set(IRIANA_ONLY))
                    ok_profile = (route == 'draven' and not saw_i and len(saw_d) == len(DRAVEN_ONLY)) or \
                                 (route == 'iriana' and not saw_d and len(saw_i) == len(IRIANA_ONLY)) or \
                                 (route == 'remerii' and not saw_d and not saw_i)
                    bad_retry = [x for x in r["retries"] if not (x["to"] == x["expected"] and x["gaugesAtStart"] and x["resetOk"] and x["keptOthers"] and x["notChapterStart"])]
                    runs.append({"route": route, "policy": pol, "seed": seed, "scenes": len(r["visited"]), "gameovers": [g[1] for g in r["gos"]],
                                 "retries_ko": bad_retry, "qtes": r["qtes"], "profil_ok": ok_profile,
                                 "epilogue": r["flags"].get("tome1Complete"), "retour_menu": r["screenAfter"]})
                    if not ok_profile: checks.append(["profil", name, route, pol, seed, saw_d, saw_i])
                    if bad_retry: checks.append(["retry", name, route, pol, seed, bad_retry])
            # Un profil ne doit proposer au carrefour que ce qu'il a débloqué.
            want = {"remerii": "Poursuivre", "draven": "Draven", "iriana": "Iriana"}
            if sorted(any(want[r] in l for l in car) for r in routes) != [True] * len(routes) or len(car) != len(routes):
                checks.append(["carrefour", name, car, routes])
            out[name] = {"carrefour": car, "runs": runs, "errors": errs}
            ctx.close()
        ctx = b.new_context(); pg = ctx.new_page(); pg.goto(URL); pg.wait_for_timeout(2500)
        allids = pg.evaluate("Object.keys(S).filter(k=>/^c1[789]_/.test(k))")
        allchoices = pg.evaluate("()=>Object.keys(S).filter(k=>/^c1[789]_/.test(k)).flatMap(k=>{try{return (S[k].choices||[]).filter(c=>c.next!=='menu'&&!String(c.next).startsWith('__')).map(c=>[k,c.label])}catch(e){return []}})")
        b.close()
    union = '\n\n'.join(union_text)
    miss_union = [k for k, t in PARAS.items() if t not in union]
    unvisited = sorted(set(allids) - allvisited)
    unpicked = [c for c in allchoices if tuple(c) not in allpicks and c[0] != 'c18_carrefour']
    res = {"combos": out, "echecs": fails, "verifs_ko": checks, "union_paragraphes_manquants": miss_union,
           "scenes_total": len(allids), "scenes_non_visitees": unvisited, "choix_jamais_pris": unpicked}
    json.dump(res, open(os.environ.get('TRAVERSE_OUT', '/tmp/traverse.json'), 'w'), ensure_ascii=False, indent=1)
    for n, o in out.items():
        gos = sum(len(r["gameovers"]) for r in o["runs"])
        print(n, o["carrefour"], "runs", len(o["runs"]), "épilogue", sum(1 for r in o["runs"] if r["epilogue"]), "game overs+reprises", gos, "erreurs:", o["errors"])
    print("échecs", fails); print("vérifs KO", checks); print("union : paragraphes manquants", len(miss_union), miss_union[:5])
    print("non visitées", unvisited); print("choix jamais pris", unpicked)
run()
