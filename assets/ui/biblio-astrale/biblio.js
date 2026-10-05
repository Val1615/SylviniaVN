/*! Mode Histoire · Bibliothèque astrale — chrome proto (n’altère pas Chronique Alternative) */
(() => {
  "use strict";
  const KEY = "sylvinia_ui_biblio_v1";
  const PRESETS = [["complete","Complète","◐"],["epuree","Épurée","◒"],["cine","Cinématique","○"]];
  const ROM = ["","I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII","XIII","XIV","XV","XVI","XVII","XVIII","XIX"];
  const DOS = ["#5a1e2e","#1b2a5c","#15403a","#3a2160","#4a2e1c","#2a3340","#5a1e40","#1e3a50","#3b1424","#24301e"];
  const HUB_RE = /(observer|rejoindre|chercher|visiter|parler|écouter|explorer|laisser|continuer|foyer|lieu|endroit|balader|retourner)/i;
  const INTIME_RE = /(c6_|nuit|terrasse|intime|chambre|balcon|embrass|cape)/i;

  function load(){ try{ return Object.assign({skin:"biblio",preset:"complete"}, JSON.parse(localStorage.getItem(KEY)||"{}")); } catch{ return {skin:"biblio",preset:"complete"}; } }
  function save(s){ try{ localStorage.setItem(KEY, JSON.stringify(s)); } catch{} }
  let cfg = load();

  function toast(html){
    let t=document.querySelector(".ba-toast");
    if(!t){ t=document.createElement("div"); t.className="ba-toast"; document.body.appendChild(t); }
    t.innerHTML=html; t.style.opacity="1";
    clearTimeout(toast._t); toast._t=setTimeout(()=>{ t.style.opacity="0"; }, 2600);
  }
  function esc(s){ return String(s||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c])); }
  function visible(id){ const el=document.getElementById(id); return el && !el.classList.contains("hidden"); }
  function clickEl(sel){ const el=typeof sel==="string"?document.querySelector(sel):sel; if(el) el.click(); }

  function applySkin(){
    const on = cfg.skin !== "classique";
    document.body.classList.toggle("ui-biblio", on);
    document.body.classList.toggle("ui-classique", !on);
    if(!on) teardownChrome();
    else mountAll();
    document.querySelectorAll("[data-ba-skin]").forEach(b=>b.classList.toggle("actif", b.dataset.baSkin===cfg.skin));
  }
  function setSkin(skin){
    cfg.skin = skin==="classique"?"classique":"biblio";
    save(cfg); applySkin(); applyPreset();
    toast(cfg.skin==="biblio"?"<b>Bibliothèque astrale</b> — Mir’Aldas":"<b>Classique</b> — interface d’origine");
  }
  function applyPreset(){
    const p = PRESETS.some(x=>x[0]===cfg.preset)?cfg.preset:"complete";
    cfg.preset=p;
    document.body.classList.toggle("ui-epuree", p==="epuree");
    document.body.classList.toggle("ui-cine", p==="cine");
    document.querySelectorAll(".ba-ui-btn").forEach(b=>{
      const m=PRESETS.find(x=>x[0]===p);
      b.textContent=m[2];
      b.title=`Interface : ${m[1]} (H)`;
      b.setAttribute("aria-label", `Interface : ${m[1]}`);
    });
    document.querySelectorAll("[data-ba-preset]").forEach(b=>b.classList.toggle("actif", b.dataset.baPreset===p));
  }
  function cyclePreset(forced){
    if(cfg.skin==="classique") return;
    if(forced) cfg.preset=forced;
    else { const i=PRESETS.findIndex(x=>x[0]===cfg.preset); cfg.preset=PRESETS[(i+1)%PRESETS.length][0]; }
    save(cfg); applyPreset();
    const m=PRESETS.find(x=>x[0]===cfg.preset);
    toast(`<span>◐ Interface <b>${m[1]}</b></span><kbd>H</kbd>`);
  }

  /* ---------- Title spine pile ---------- */
  function mountTitle(){
    const card=document.getElementById("titleCard");
    if(!card || cfg.skin==="classique") return;
    let root=document.getElementById("baTitleChrome");
    if(!root){
      root=document.createElement("div");
      root.id="baTitleChrome";
      card.appendChild(root);
    }
    const chaptersAvail = document.getElementById("menuChaptersAvailable")?.textContent || "";
    const codexMetric = document.getElementById("menuMetricCodex")?.textContent || "";
    const resumeSub = document.getElementById("menuSceneValue")?.textContent || "Continuer";
    root.innerHTML = `
      <div class="ba-titre-voile" aria-hidden="true"></div>
      <div class="ba-titre-haut">
        <button type="button" class="ba-rond" data-ba="opts" title="Réglages">⚙</button>
        <button type="button" class="ba-rond" data-ba="fs" title="Plein écran">⛶</button>
      </div>
      <div class="ba-titre-col">
        <div class="ba-logo">
          <span class="ba-logo-k">Visual novel · Bêta</span>
          <span class="ba-logo-les">Les</span>
          <span class="ba-logo-l1">CHRONIQUES</span>
          <span class="ba-logo-l2">de SYLVINIA</span>
        </div>
        <nav class="ba-pile" aria-label="Menu principal">
          <button type="button" class="ba-livre" style="--dc:#5a1e2e" data-ba-act="resume"><span class="tome">I</span><span class="etiq">Reprendre</span><span class="sup"><i>${esc(resumeSub)}</i></span></button>
          <button type="button" class="ba-livre" style="--dc:#1b2a5c" data-ba-act="new"><span class="tome">II</span><span class="etiq">Nouvelle chronique</span></button>
          <button type="button" class="ba-livre" style="--dc:#15403a" data-ba-act="chapters"><span class="tome">III</span><span class="etiq">Chapitres</span><span class="sup"><b>${esc(chaptersAvail||"…")}</b></span></button>
          <button type="button" class="ba-livre" style="--dc:#3a2160" data-ba-act="progress"><span class="tome">IV</span><span class="etiq">Progression</span></button>
          <button type="button" class="ba-livre" style="--dc:#4a2e1c" data-ba-act="codex"><span class="tome">V</span><span class="etiq">Codex & mémoire</span><span class="sup"><i>${esc(codexMetric)}</i></span></button>
          <button type="button" class="ba-livre ca" style="--dc:#2a1848" data-ba-act="ca"><span class="tome">✦</span><span class="etiq">Chronique Alternative</span></button>
          <button type="button" class="ba-livre" style="--dc:#2a3340" data-ba-act="opts"><span class="tome">VIII</span><span class="etiq">Réglages</span></button>
        </nav>
      </div>
      <div class="ba-titre-bas"><span>V0.412 · BÊTA · LE CHRONIQUEUR VAGABOND</span><span>Bibliothèque astrale</span></div>
      <div class="ba-panel" id="baOptsPanel">
        <h3>Apparence</h3>
        <small>Bibliothèque astrale ou interface classique</small>
        <div class="ba-puces">
          <button type="button" class="ba-puce" data-ba-skin="biblio">Bibliothèque</button>
          <button type="button" class="ba-puce" data-ba-skin="classique">Classique</button>
        </div>
        <small>Interface en jeu (touche H)</small>
        <div class="ba-puces">${PRESETS.map(([k,l])=>`<button type="button" class="ba-puce" data-ba-preset="${k}">${l}</button>`).join("")}</div>
        <small>Les autres options (mobile, legacy, facile) restent dans le menu classique si besoin.</small>
      </div>`;
    const pile=root.querySelector(".ba-pile");
    const livres=[...pile.querySelectorAll(".ba-livre")];
    const sel=i=>livres.forEach((b,j)=>b.classList.toggle("actif",j===i));
    livres.forEach((b,i)=>{ b.addEventListener("pointerenter",()=>sel(i)); b.addEventListener("focus",()=>sel(i)); });
    sel(0);
    root.onclick=(e)=>{
      const skin=e.target.closest("[data-ba-skin]"); if(skin){ setSkin(skin.dataset.baSkin); return; }
      const pre=e.target.closest("[data-ba-preset]"); if(pre){ cyclePreset(pre.dataset.baPreset); return; }
      const act=e.target.closest("[data-ba-act],[data-ba]");
      if(!act) return;
      const a=act.dataset.baAct||act.dataset.ba;
      if(a==="resume") clickEl("#resumeBtn");
      else if(a==="new") clickEl("#startBtn");
      else if(a==="chapters") clickEl("#chaptersBtn");
      else if(a==="progress") clickEl("#progressionBtn");
      else if(a==="codex") clickEl("#codexBtn");
      else if(a==="ca") clickEl("#chronicleModeBtn");
      else if(a==="opts"){ const p=document.getElementById("baOptsPanel"); p.classList.toggle("open"); applySkin; applyPreset(); }
      else if(a==="fs"){ if(!document.fullscreenElement) document.documentElement.requestFullscreen?.(); else document.exitFullscreen?.(); }
    };
    applyPreset();
  }

  /* ---------- Game chrome ---------- */
  function romanFromTitle(t){
    const m=String(t||"").match(/chapitre\s+([ivxlcdm]+|\d+)/i);
    if(!m) return "✦";
    const n=m[1];
    if(/^\d+$/.test(n)) return ROM[+n]||n;
    return n.toUpperCase();
  }
  function mountGame(){
    const card=document.getElementById("gameCard");
    if(!card || cfg.skin==="classique") return;
    let root=document.getElementById("baGameChrome");
    if(!root){
      root=document.createElement("div");
      root.id="baGameChrome";
      card.appendChild(root);
    }
    const title=document.getElementById("sceneTitle")?.textContent||"";
    const sub=document.getElementById("sceneSub")?.textContent||"";
    const label=document.querySelector("#gameCard .chapterLabel")?.textContent||"";
    const rom=romanFromTitle(label+" "+title);
    root.innerHTML=`
      <div class="ba-lieu">
        <button type="button" class="ba-ui-btn" title="Interface (H)">◐</button>
        <div class="ba-cote">${esc(rom)}</div>
        <div class="ba-jl"><small>${esc((label||"Chapitre").toUpperCase())} · ${esc(title)}</small><b>${esc(sub||"")}</b></div>
      </div>
      <div class="ba-hud">
        <button type="button" class="ba-dos-o" style="--dc:#5a1e2e;--h:118" data-ba-g="progress"><i>❦</i><span>Journal</span></button>
        <button type="button" class="ba-dos-o" style="--dc:#1b2a5c;--h:132" data-ba-g="progress"><i>⚑</i><span>Signets</span></button>
        <button type="button" class="ba-dos-o" style="--dc:#15403a;--h:112" data-ba-g="codex"><i>✦</i><span>Codex</span></button>
        <button type="button" class="ba-dos-o" style="--dc:#2a3340;--h:124" data-ba-g="menu"><i>☰</i><span>Menu</span></button>
      </div>`;
    root.querySelector(".ba-ui-btn")?.addEventListener("click",e=>{ e.preventDefault(); e.stopPropagation(); cyclePreset(); });
    root.onclick=e=>{
      const g=e.target.closest("[data-ba-g]"); if(!g) return;
      e.preventDefault(); e.stopPropagation();
      const a=g.dataset.baG;
      if(a==="progress") clickEl("#progressionBtn2");
      else if(a==="codex") clickEl("#codexBtn2");
      else if(a==="menu") clickEl("#menuBtn");
    };
    reshapeDialogue();
    syncPlaque();
    syncChoices();
    applyPreset();
  }

  function reshapeDialogue(){
    const wrap=document.querySelector("#gameCard .dialogueWrap");
    const dlg=document.querySelector("#gameCard .dialogue");
    if(!wrap||!dlg||cfg.skin==="classique") return;
    if(!document.getElementById("baChoices")){
      const box=document.createElement("div"); box.id="baChoices"; box.setAttribute("hidden","");
      wrap.insertBefore(box, dlg);
    }
    if(!document.getElementById("baPlaque")){
      const pl=document.createElement("div"); pl.id="baPlaque";
      pl.innerHTML=`<span class="nom"></span><span class="didasc"></span>`;
      wrap.insertBefore(pl, dlg);
    }
    if(!document.getElementById("baDlgDos")){
      const dos=document.createElement("div"); dos.id="baDlgDos";
      dos.innerHTML=`<span id="baDlgCote">I · …</span>`;
      dlg.insertBefore(dos, dlg.firstChild);
    }
  }

  function syncPlaque(){
    const sp=document.getElementById("speaker")?.textContent||"Narrateur";
    const sub=document.getElementById("sceneSub")?.textContent||"";
    const pl=document.getElementById("baPlaque");
    if(!pl) return;
    const narr=/narrat/i.test(sp);
    pl.classList.toggle("narr", narr);
    pl.querySelector(".nom").textContent = narr ? "Narration" : sp;
    pl.querySelector(".didasc").textContent = sub;
    const cote=document.getElementById("baDlgCote");
    if(cote){
      const code=(document.getElementById("devSceneCode")?.textContent||"").replace(/^.*?:\s*/i,"").trim();
      const label=document.querySelector("#gameCard .chapterLabel")?.textContent||"";
      cote.textContent = `${romanFromTitle(label)} · ${code||"…"}`;
    }
  }

  function syncChoices(){
    const src=document.getElementById("choices");
    const box=document.getElementById("baChoices");
    if(!src||!box||cfg.skin==="classique") return;
    const btns=[...src.querySelectorAll("button, .choiceBtn")].filter(b=>b.offsetParent!==null || true);
    const visibleBtns=[...src.querySelectorAll("button, .choiceBtn")];
    if(!visibleBtns.length || src.hidden || getComputedStyle(src).display==="none" && !src.children.length){
      // still check children even if display none (we force-hide)
    }
    const list=[...src.querySelectorAll("button, .choiceBtn")];
    if(!list.length){ box.innerHTML=""; box.setAttribute("hidden",""); return; }
    box.removeAttribute("hidden");
    const cols=DOS;
    const hubby = list.length>=3 && list.filter(b=>HUB_RE.test(b.textContent||"")).length>=2;
    document.body.classList.toggle("ba-hub", hubby);
    const q = hubby ? "Moment libre" : "Le choix d’Hylee";
    box.innerHTML = `<p class="ba-q"><i aria-hidden="true">${document.body.classList.contains("ba-intime")?"♥":"✦"}</i> ${q}</p>` +
      list.map((b,i)=>{
        let label=(b.querySelector(".btnTitle, .choiceLabel, strong")?.textContent || b.childNodes[0]?.textContent || b.textContent || "").trim();
        label=label.replace(/\s+/g," ").slice(0,120);
        const n=ROM[i+1]||String(i+1);
        return `<button type="button" class="ba-ch" style="--dc:${cols[i%cols.length]}" data-ba-ci="${i}"><span class="n">${n}</span><strong>${esc(label)}</strong></button>`;
      }).join("");
    box.querySelectorAll(".ba-ch").forEach(ch=>{
      ch.addEventListener("click",e=>{
        e.preventDefault(); e.stopPropagation();
        const i=+ch.dataset.baCi;
        const orig=list[i];
        if(orig) orig.click();
      });
    });
  }

  /* ---------- Chapters shelf ---------- */
  function mountShelf(){
    const card=document.getElementById("chaptersCard");
    if(!card || cfg.skin==="classique") return;
    let shelf=document.getElementById("baShelf");
    if(!shelf){ shelf=document.createElement("div"); shelf.id="baShelf"; card.appendChild(shelf); }
    const data = (typeof CHAPTER_SELECT_DATA!=="undefined" && Array.isArray(CHAPTER_SELECT_DATA)) ? CHAPTER_SELECT_DATA : [];
    const unlocked = data.filter(ch=>{
      try{ return typeof chapterSelectUnlocked==="function" ? chapterSelectUnlocked(ch.key) : true; } catch{ return true; }
    });
    const mid=Math.ceil(data.length/2)||1;
    const row=(arr,start)=>arr.map((ch,i)=>{
      const ok = unlocked.includes(ch) || (typeof chapterSelectUnlocked==="function" && chapterSelectUnlocked(ch.key));
      const idx=start+i;
      const num = ch.key==="intro" ? "✦" : (ch.label||"").replace(/Chapitre\s+/i,"").trim() || ROM[idx]||String(idx);
      const short=(ch.title||"").slice(0,28);
      return `<button type="button" class="ba-dos-v dos ${ok?"":"verrou"}" style="--dc:${DOS[idx%DOS.length]}" data-ba-ch="${esc(ch.key)}" aria-label="${esc(ch.label)} — ${esc(ch.title)}">
        <span class="dv-num">${esc(num)}</span><span class="dv-titre">${esc(short)}</span>
        ${ok?"":"<span class=\"dv-num\">🔒</span>"}
      </button>`;
    }).join("");
    shelf.innerHTML=`
      <div class="ba-entete">
        <button type="button" class="ba-retour" data-ba-back><span>‹</span><em>Retour</em></button>
        <div class="ba-entete-t"><div class="ba-kicker">Bibliothèque de Mir’Aldas</div><div class="ba-titre-ecran">Étagère des chapitres</div></div>
        <div class="ba-compteur"><b>${unlocked.length}</b> / ${data.length} empruntables</div>
      </div>
      <div class="ba-etagere" aria-label="Volumes">
        <div class="ba-rayon">${row(data.slice(0,mid),0)}<i class="ba-bougie" aria-hidden="true"></i></div>
        <div class="ba-planche"></div>
        <div class="ba-rayon">${row(data.slice(mid),mid)}</div>
        <div class="ba-planche"></div>
      </div>
      <p class="ba-indice">Touchez un volume pour l’emprunter</p>`;
    shelf.onclick=e=>{
      if(e.target.closest("[data-ba-back]")){ clickEl("#chaptersBackBtn"); return; }
      const b=e.target.closest("[data-ba-ch]"); if(!b||b.classList.contains("verrou")) return;
      openLivre(b.dataset.baCh);
    };
    ensureLivreHost();
  }

  function ensureLivreHost(){
    if(document.getElementById("baLivre")) return;
    const host=document.createElement("div");
    host.id="baLivre";
    host.innerHTML=`<button type="button" class="ba-l3-fermer" aria-label="Fermer">✕</button>
      <div class="ba-couv"><img alt=""><div class="ba-l3-cadre"></div><div class="ba-l3-plaque"><div class="ba-l3-num"></div><div class="ba-l3-lab"></div><div class="ba-l3-ct"></div><div class="ba-l3-msg">Toucher la couverture pour ouvrir</div></div></div>
      <div class="ba-syn"><div class="k"></div><h3></h3><div class="tags"></div><p></p><button type="button" class="ba-act">Emprunter ce volume</button></div>`;
    document.body.appendChild(host);
    host.querySelector(".ba-l3-fermer").onclick=()=>closeLivre();
    host.querySelector(".ba-couv").onclick=()=>host.classList.add("synopsis");
    host.addEventListener("click",e=>{ if(e.target===host) closeLivre(); });
  }
  let _livreKey=null;
  function openLivre(key){
    ensureLivreHost();
    const data=(typeof CHAPTER_SELECT_DATA!=="undefined"?CHAPTER_SELECT_DATA:[]).find(c=>c.key===key);
    if(!data) return;
    _livreKey=key;
    const host=document.getElementById("baLivre");
    host.classList.remove("synopsis");
    host.classList.add("open");
    const img=host.querySelector(".ba-couv img");
    img.src=data.image||""; img.alt=data.title||"";
    const num=data.key==="intro"?"✦":(data.label||"").replace(/Chapitre\s+/i,"").trim();
    host.querySelector(".ba-l3-num").textContent=num;
    host.querySelector(".ba-l3-lab").textContent=(data.label||"").toUpperCase();
    host.querySelector(".ba-l3-ct").textContent=data.title||"";
    host.querySelector(".ba-syn .k").textContent=`${data.label||""} · ${data.subtitle||""}`;
    host.querySelector(".ba-syn h3").textContent=data.title||"";
    host.querySelector(".ba-syn p").textContent=data.body||"";
    host.querySelector(".ba-syn .tags").innerHTML=(data.tags||[]).map(t=>`<span>${esc(t)}</span>`).join("");
    const act=host.querySelector(".ba-act");
    act.textContent=data.action||"Lancer";
    act.onclick=()=>{
      closeLivre();
      if(typeof launchChapterSelect==="function") launchChapterSelect(key);
      else {
        const fake=document.createElement("button");
        fake.setAttribute("data-chapter-launch", key);
        document.body.appendChild(fake); fake.click(); fake.remove();
      }
    };
  }
  function closeLivre(){ const h=document.getElementById("baLivre"); if(h){ h.classList.remove("open","synopsis"); } _livreKey=null; }

  function markIntime(){
    const sub=(document.getElementById("sceneSub")?.textContent||"")+" "+(document.getElementById("sceneTitle")?.textContent||"")+" "+(document.getElementById("devSceneCode")?.textContent||"");
    document.body.classList.toggle("ba-intime", INTIME_RE.test(sub));
  }

  function unlockAudio(){
    try{
      const a=document.getElementById("music");
      if(typeof state!=="undefined"){
        if(typeof state.musicOn!=="boolean") state.musicOn=true;
        if(typeof state.menuMusicOn!=="boolean") state.menuMusicOn=true;
      }
      if(a && a.paused && a.src && (typeof state==="undefined"||state.musicOn!==false)) a.play().catch(()=>{});
    }catch{}
  }
  ["pointerdown","keydown","touchend"].forEach(t=>document.addEventListener(t, unlockAudio, {capture:true, passive:true}));

  document.addEventListener("keydown",e=>{
    if((e.key==="h"||e.key==="H") && !e.target.closest("input,textarea,[contenteditable]")){
      if(cfg.skin==="classique") return;
      e.preventDefault(); cyclePreset();
    }
    if(e.key==="Escape") closeLivre();
  });

  function teardownChrome(){
    ["baTitleChrome","baGameChrome","baShelf"].forEach(id=>document.getElementById(id)?.remove());
    closeLivre();
    const box=document.getElementById("baChoices"); if(box) box.innerHTML="";
  }

  function mountAll(){
    if(cfg.skin==="classique") return;
    if(visible("title")) mountTitle();
    if(visible("game")) { mountGame(); markIntime(); }
    if(visible("chapters")) mountShelf();
    const splashBtn=document.getElementById("enterMenuFromSplashBtn");
    if(splashBtn && !splashBtn.dataset.baFilets){
      splashBtn.dataset.baFilets="1";
      splashBtn.innerHTML='<i class="ba-filet" aria-hidden="true"></i><span>Appuyer pour commencer</span><i class="ba-filet d" aria-hidden="true"></i>';
    }
  }

  let _q=false, _lastChoices="";
  function refresh(){
    if(_q) return; _q=true;
    requestAnimationFrame(()=>{
      _q=false;
      if(cfg.skin==="classique") return;
      mountAll();
      if(visible("game")){
        syncPlaque();
        const src=document.getElementById("choices");
        const sig=src?src.innerHTML.length+":"+(src.textContent||"").slice(0,80):"";
        if(sig!==_lastChoices){ _lastChoices=sig; syncChoices(); }
      }
    });
  }

  const mo=new MutationObserver(refresh);
  function boot(){
    applySkin(); applyPreset();
    const root=document.getElementById("app")||document.body;
    mo.observe(root,{childList:true,subtree:true,attributes:true,attributeFilter:["class","hidden"]});
    // also watch text/choices content
    const dlg=document.getElementById("gameCard");
    if(dlg) mo.observe(dlg,{childList:true,subtree:true,characterData:true});
    setInterval(refresh, 900);
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  window.SylviniaBiblioUI={ setSkin, cyclePreset, cfg:()=>({...cfg}), remount:mountAll };
})();
