# Parcours de toutes les branches de choix depuis une sauvegarde v82 sur c16_s01_fin, jusqu'à c19_fin.
import json, sys, random
from playwright.sync_api import sync_playwright
URL = "http://localhost:8893/index.html?cb=traverse"
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import novel as N
PARAS = {str(i): N.para(i) for i in sorted(N.P) if i not in N.HEADINGS}
BASE = {"s01AssaultComplete": True, "chapter15Complete": True, "chapter15ReachedEnd": True}
COMBOS = {
  "aucun": {},
  "draven": {"chapter4DComplete": True, "c15WalkedWithDraven": True},
  "iriana": {"chapter13IComplete": True, "c13iHeldAmaneaWhole": True},
  "les_deux": {"chapter4DComplete": True, "c11gSeenDravenCourt": True, "chapter13IComplete": True, "c13iTruthWithoutDefense": True},
  "dev": {"__dev": True},
}
WALK = r"""
async ([policy, seed, paras]) => {
  let rnd = seed; const rand = (n) => { rnd = (rnd * 1103515245 + 12345) % 2147483648; return rnd % n; };
  load(); state.history = []; setScreen('game'); render();
  const visited = []; const texts = []; const picks = []; let guard = 0; let counter = 0;
  const cur = () => state.scene;
  while (guard++ < 2000) {
    const id = cur(); const s = S[id];
    if (!s) return { error: 'scène inconnue ' + id, visited };
    visited.push(id);
    if (/^c1[789]_/.test(id)) { const t = typeof s.text === 'function' ? s.text() : s.text; texts.push(t); }
    if (id === 'c19_fin') {
      const ch = s.choices[0]; picks.push([id, ch.label]); choose(ch);
      return { ok: true, visited, picks, flags: state.flags, screenAfter: document.getElementById('game')?.classList.contains('hidden'),
               text: texts.join('\n\n') };
    }
    let chs = (s.choices || []).filter(c => choiceAvailable(c) && c.next !== 'menu');
    if (chs.length) {
      let k = policy === 'first' ? 0 : policy === 'last' ? chs.length - 1 : policy === 'rot' ? (counter++ % chs.length) : rand(chs.length);
      if (id === 'c18_choix_arcane' && picks.filter(p => p[0] === id).length >= 2) k = chs.findIndex(c => c.next === 'c18_conduit');
      picks.push([id, chs[k].label]); choose(chs[k]);
    } else if (s.next) { go(s.next); }
    else return { error: 'impasse ' + id, visited };
    if (cur() === id && !s.next) return { error: 'bloqué ' + id, visited };
  }
  return { error: 'boucle', visited: visited.slice(-30) };
}
"""
def run():
    out = {}; allvisited = set(); allpicks = set(); fails = []
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--mute-audio"])
        for name, extra in COMBOS.items():
            dev = extra.pop("__dev", False) if "__dev" in extra else False
            flags = {**BASE, **extra}
            save = {"scene": "c16_s01_fin", "stats": {"audace": 3}, "flags": flags, "inventory": [], "memories": [], "history": [], "devMode": dev}
            ctx = b.new_context(viewport={"width": 830, "height": 525})
            ctx.add_init_script("localStorage.setItem('sylvinia_ui_biblio_v1', JSON.stringify({skin:'biblio'}));localStorage.setItem('sylvinia_vn_v82', %s);" % json.dumps(json.dumps(save)))
            pg = ctx.new_page(); errs = []
            pg.on("pageerror", lambda e: errs.append(str(e)[:200]))
            pg.on("console", lambda m: errs.append(m.text[:160]) if m.type == "error" else None)
            pg.on("dialog", lambda d: d.accept())
            pg.goto(URL, wait_until="domcontentloaded", timeout=120000)
            pg.wait_for_function("window.BibliothequeAstrale", timeout=120000); pg.wait_for_timeout(2500)
            carrefour = None; runs = []
            policies = [("first", 1), ("last", 1), ("rot", 1)] + [("rand", s) for s in range(7, 7 + 12)]
            for pol, seed in policies:
                pg.evaluate("(s)=>localStorage.setItem('sylvinia_vn_v82', s)", json.dumps(save))
                r = pg.evaluate(WALK, [pol, seed, None])
                if not r.get("ok"):
                    fails.append([name, pol, seed, r.get("error"), r.get("visited", [])[-5:]]); continue
                miss = [k for k, t in PARAS.items() if t not in r["text"]]
                allvisited |= set(r["visited"]); allpicks |= {tuple(x) for x in r["picks"]}
                persp = r["flags"].get("finalePerspective")
                runs.append({"policy": pol, "seed": seed, "scenes": len(r["visited"]), "perspective": persp,
                             "paragraphes_manquants": len(miss), "exemple_manquant": miss[:3], "tome1Complete": r["flags"].get("tome1Complete"),
                             "retour_menu": r["screenAfter"]})
            car = pg.evaluate("()=>{state.scene='c18_carrefour'; render(); return S.c18_carrefour.choices.map(c=>c.label)}")
            out[name] = {"carrefour": car, "runs": runs, "errors": [e for e in errs]}
            ctx.close()
        allids = None
        ctx = b.new_context(); pg = ctx.new_page(); pg.goto(URL); pg.wait_for_timeout(2500)
        allids = pg.evaluate("Object.keys(S).filter(k=>/^c1[789]_/.test(k))")
        allchoices = pg.evaluate("()=>Object.keys(S).filter(k=>/^c1[789]_/.test(k)).flatMap(k=>(S[k].choices||[]).filter(c=>c.next!=='menu').map(c=>[k,c.label]))")
        b.close()
    unvisited = sorted(set(allids) - allvisited)
    unpicked = [c for c in allchoices if tuple(c) not in allpicks and c[0] not in ('c18_carrefour',)]
    res = {"combos": out, "echecs": fails, "scenes_total": len(allids), "scenes_non_visitees": unvisited,
           "choix_jamais_pris": unpicked}
    json.dump(res, open(os.environ.get('TRAVERSE_OUT', '/tmp/traverse.json'), 'w'), ensure_ascii=False, indent=1)
    for n, o in out.items():
        print(n, o["carrefour"], "erreurs:", o["errors"])
        for r in o["runs"]: print("  ", r)
    print("échecs", fails); print("non visitées", unvisited); print("choix jamais pris", unpicked)
run()
