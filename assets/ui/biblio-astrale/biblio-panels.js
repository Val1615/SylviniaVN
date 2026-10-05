/*! Bibliothèque astrale — panneaux complets (menu, journal, signets, réglages, livre 3D, gemmes) */
(() => {
  "use strict";
  const VLAB = {audace:["audace","Audace","AU"],sangfroid:["sangfroid","Sang-froid","SF"],lucidite:["lucidite","Lucidité","LU"],resonance:["resonance","Résonance","RÉ"],lien:["lien","Lien","♥"]};
  const DOS = ["#5a1e2e","#1b2a5c","#15403a","#3a2160","#4a2e1c","#2a3340","#5a1e40","#1e3a50"];
  const ROM = ["","I","II","III","IV","V","VI","VII","VIII","IX","X"];
  const SIG_KEY = "sylvinia_biblio_signets_v1";
  let livreTimers = [];

  function esc(s){ return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c])); }
  function biblioOn(){ return document.body.classList.contains("ui-biblio") && !document.body.classList.contains("ui-classique"); }
  function easy(){ try{ return !!(typeof state!=="undefined" && (state.easyMode || state.facile)); }catch{return true;} }
  function loadSignets(){ try{ return JSON.parse(localStorage.getItem(SIG_KEY)||"[]"); }catch{return [];} }
  function saveSignets(a){ try{ localStorage.setItem(SIG_KEY, JSON.stringify(a)); }catch{} }

  function ensureCouche(){
    let c=document.getElementById("baCouche");
    if(!c){ c=document.createElement("div"); c.id="baCouche"; document.body.appendChild(c); }
    return c;
  }
  function fermerCouche(){
    const c=document.getElementById("baCouche");
    if(c){ c.className=""; c.innerHTML=""; }
  }
  function fenetre(titre, kicker, corps, cls=""){
    const c=ensureCouche();
    c.className="ouverte";
    c.innerHTML=`<div class="ba-voile" data-ba-close></div>
      <section class="ba-fen ${cls}" role="dialog" aria-modal="true" aria-label="${esc(titre)}">
        <header class="ba-fen-tete"><div><p class="k">${esc(kicker)}</p><h2>${esc(titre)}</h2></div>
          <button type="button" class="ba-rond" data-ba-close aria-label="Fermer">✕</button></header>
        <div class="ba-fen-corps">${corps}</div>
      </section>`;
    c.onclick=e=>{ if(e.target.closest("[data-ba-close]")) fermerCouche(); };
  }

  /* ---- Choice gems ---- */
  function sceneChoices(){
    try{
      if(typeof S==="undefined" || typeof state==="undefined") return [];
      const sc=S[state.scene];
      return (sc && Array.isArray(sc.choices)) ? sc.choices : [];
    }catch{ return []; }
  }
  function gemHtml(effects){
    if(!effects) return "";
    return Object.entries(effects).filter(([,v])=>v).map(([k,v])=>{
      const V=VLAB[k]||[k,k,k.slice(0,2).toUpperCase()];
      return `<span class="gem" style="--v:var(--v-${k})" title="${V[1]} ${v>0?"+":""}${v}"><span class="gl">${V[1]}</span><span class="gc">${V[2]}</span> ${v>0?"+":""}${v}</span>`;
    }).join("");
  }
  function enhanceChoices(){
    if(!biblioOn()) return;
    const box=document.getElementById("baChoices");
    if(!box || box.hasAttribute("hidden")) return;
    const chs=sceneChoices();
    const cards=[...box.querySelectorAll(".ba-ch")];
    cards.forEach((card,i)=>{
      if(card.querySelector(".g")) return;
      const ch=chs[i];
      const g=document.createElement("span"); g.className="g";
      if(ch && ch.effects && (easy() || true)){ // show gems always in biblio (proto easy default visual)
        g.innerHTML=gemHtml(ch.effects);
      }
      card.appendChild(g);
    });
  }

  /* ---- In-game menu / journal / signets ---- */
  function openMenu(){
    if(!biblioOn()) return;
    const scene=(typeof state!=="undefined" && state.scene) || "";
    const items=[
      ["Reprendre","close","#1b2a5c"],
      ["Signets","signets","#16404f"],
      ["Journal","journal","#5a1e2e"],
      ["Chapitres","chapters","#4a2e1c"],
      ["Codex","codex","#15403a"],
      ["Progression","progress","#5b2a1c"],
      ["Réglages","settings","#2a3340"],
      ["Musique","music","#3a2160"],
      ["Écran titre","title","#4a1f45"],
    ];
    fenetre("Menu", `Scène ${scene}`, `<nav class="menu-pile">${items.map((m,i)=>`
      <button type="button" class="ba-livre ${i===0?"actif":""}" style="--dc:${m[2]}" data-ba-menu="${m[1]}">
        <span class="tome">${ROM[i+1]||"•"}</span><span class="etiq">${m[0]}</span>
      </button>`).join("")}</nav>`, "menu-fen");
    const L=[...document.querySelectorAll("#baCouche .menu-pile .ba-livre")];
    L.forEach((b,i)=>b.addEventListener("pointerenter",()=>L.forEach((x,j)=>x.classList.toggle("actif",i===j))));
    document.getElementById("baCouche").addEventListener("click", onMenuClick);
  }
  function onMenuClick(e){
    const b=e.target.closest("[data-ba-menu]"); if(!b) return;
    const a=b.dataset.baMenu;
    if(a==="close"){ fermerCouche(); return; }
    if(a==="signets"){ openSignets(); return; }
    if(a==="journal"){ openJournal(); return; }
    if(a==="settings"){ openSettings(); return; }
    fermerCouche();
    if(a==="chapters") document.getElementById("chaptersBtn2")?.click() || document.getElementById("chaptersBtn")?.click();
    if(a==="codex") document.getElementById("codexBtn2")?.click();
    if(a==="progress") document.getElementById("progressionBtn2")?.click();
    if(a==="title") document.getElementById("menuBtn")?.click();
    if(a==="music") document.getElementById("musicBtn")?.click();
  }
  function openJournal(){
    const hist=(typeof state!=="undefined" && Array.isArray(state.history))?state.history.slice(-40):[];
    const rows=hist.length?hist.map((id,i)=>{
      const sid=typeof id==="string"?id:(id.id||"");
      const sc=(typeof S!=="undefined" && S[sid])?S[sid]:null;
      return `<li><span class="j-marge">${i+1}</span><div><b class="j-sp">${esc(sc?.speaker||"Scène")}</b><p>${esc((sc?.text||sid||"").slice(0,220))}</p></div></li>`;
    }).join(""):`<li class="vide" style="display:block;font-style:italic;color:var(--ba-texte-3)">Aucune page lue pour l’instant.</li>`;
    fenetre("Journal de lecture", "Marge du livre", `<ol class="journal">${rows}</ol>`, "large");
  }
  function openSignets(fromGame=true){
    const slots=[0,1,2,3,4,5,6].map(i=>loadSignets().find(s=>s.slot===i)||{slot:i});
    const html=slots.map((sg,i)=>{
      const coul=DOS[(i+3)%DOS.length];
      if(!sg.scene) return `<article class="signet" style="--dc:${coul}"><span class="ruban"></span><div><b>${i===0?"Signet automatique":"Emplacement "+ROM[i]}</b><span>Emplacement libre</span></div>
        ${fromGame&&i?`<div class="ba-act"><button type="button" class="ba-btn or" data-ba-sig-save="${i}">Ranger ici</button></div>`:""}</article>`;
      return `<article class="signet" style="--dc:${coul}"><span class="ruban"></span>
        <div><b>${i===0?"Auto":"Empl. "+ROM[i]} · ${new Date(sg.date||Date.now()).toLocaleString("fr-FR",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"})}</b>
        <span>${esc(sg.title||sg.scene)}</span></div>
        <div class="ba-act"><button type="button" class="ba-btn or" data-ba-sig-load="${i}">Reprendre</button>
        ${fromGame&&i?`<button type="button" class="ba-btn" data-ba-sig-save="${i}">Remplacer</button>`:""}
        ${i?`<button type="button" class="ba-rond" data-ba-sig-del="${i}" aria-label="Effacer">✕</button>`:""}</div></article>`;
    }).join("");
    fenetre("Signets", "Ranger ou reprendre un emprunt", `<div class="signets">${html}</div><p style="margin-top:12px;font:italic 500 14px var(--ba-serif);color:var(--ba-texte-3);text-align:center">Le signet automatique suit la dernière scène. Les emplacements 1–6 sont manuels.</p>`, "large");
    const c=document.getElementById("baCouche");
    c.onclick=e=>{
      if(e.target.closest("[data-ba-close]")){ fermerCouche(); return; }
      const sav=e.target.closest("[data-ba-sig-save]");
      const lod=e.target.closest("[data-ba-sig-load]");
      const del=e.target.closest("[data-ba-sig-del]");
      if(sav){
        const slot=+sav.dataset.baSigSave;
        let all=loadSignets().filter(s=>s.slot!==slot);
        const title=(document.getElementById("sceneTitle")?.textContent||"")+" · "+(state?.scene||"");
        all.push({slot, scene:state.scene, title, date:Date.now()});
        saveSignets(all); openSignets(true);
        window.SylviniaBiblioUI && SylviniaBiblioUI.cfg && (document.querySelector(".ba-toast")||{}).style;
        const t=document.querySelector(".ba-toast")||Object.assign(document.createElement("div"),{className:"ba-toast"});
        if(!t.parentNode) document.body.appendChild(t);
        t.innerHTML=`⚑ Signet rangé — emplacement ${ROM[slot]}`; t.style.opacity="1";
      }
      if(lod){
        const sg=loadSignets().find(s=>s.slot===+lod.dataset.baSigLoad);
        if(sg && typeof go==="function"){ fermerCouche(); go(sg.scene); }
      }
      if(del){
        saveSignets(loadSignets().filter(s=>s.slot!==+del.dataset.baSigDel));
        openSignets(true);
      }
    };
  }
  function openSettings(tab="affichage"){
    const UI=[["complete","Complète"],["epuree","Épurée"],["cine","Cinématique"]];
    const cfg=(window.SylviniaBiblioUI&&SylviniaBiblioUI.cfg)?SylviniaBiblioUI.cfg():{skin:"biblio",preset:"complete"};
    const tabs=[["affichage","Affichage"],["lecture","Lecture"],["audio","Audio"],["systeme","Système"]];
    let corps="";
    if(tab==="affichage"){
      corps=`<div class="reglage"><span class="rg-t"><b>Apparence</b><small>Bibliothèque astrale ou Classique</small></span>
        <div class="ba-puces"><button type="button" class="ba-puce ${cfg.skin!=="classique"?"actif":""}" data-ba-skin="biblio">Bibliothèque</button>
        <button type="button" class="ba-puce ${cfg.skin==="classique"?"actif":""}" data-ba-skin="classique">Classique</button></div></div>
        <div class="reglage"><span class="rg-t"><b>Interface en jeu</b><small>Touche H ou bouton ◐</small></span>
        <div class="ba-puces">${UI.map(([k,l])=>`<button type="button" class="ba-puce ${cfg.preset===k?"actif":""}" data-ba-preset="${k}">${l}</button>`).join("")}</div></div>`;
    } else if(tab==="lecture"){
      corps=`<div class="reglage"><span class="rg-t"><b>Mode facile</b><small>Affiche les gemmes d’effet sur les choix</small></span>
        <button type="button" class="ba-btn" data-ba-easy>Basculer</button></div>
        <div class="reglage"><span class="rg-t"><b>Animations réduites</b><small>Respecte aussi prefers-reduced-motion</small></span>
        <button type="button" class="ba-btn" data-ba-reduit>Basculer</button></div>`;
    } else if(tab==="audio"){
      corps=`<div class="reglage"><span class="rg-t"><b>Musique</b><small>Active par défaut · premier geste débloque l’audio</small></span>
        <button type="button" class="ba-btn" id="baMusicToggle">Couper / Activer</button></div>`;
    } else {
      corps=`<div class="reglage"><span class="rg-t"><b>Mode mobile / Legacy</b><small>Conservés dans le menu d’origine si besoin</small></span></div>
        <p style="font:italic 500 14px var(--ba-serif);color:var(--ba-texte-3)">Les modes Mobile et Legacy restent accessibles via l’interface Classique (Options).</p>`;
    }
    fenetre("Réglages", "Options", `<nav class="onglets">${tabs.map(t=>`<button type="button" class="onglet ${t[0]===tab?"actif":""}" data-ba-stab="${t[0]}">${t[1]}</button>`).join("")}</nav>${corps}`);
    const c=document.getElementById("baCouche");
    c.onclick=e=>{
      if(e.target.closest("[data-ba-close]")){ fermerCouche(); return; }
      const st=e.target.closest("[data-ba-stab]"); if(st){ openSettings(st.dataset.baStab); return; }
      const skin=e.target.closest("[data-ba-skin]"); if(skin){ window.SylviniaBiblioUI?.setSkin(skin.dataset.baSkin); openSettings(tab); return; }
      const pre=e.target.closest("[data-ba-preset]"); if(pre){ window.SylviniaBiblioUI?.cyclePreset(pre.dataset.baPreset); openSettings(tab); return; }
      if(e.target.closest("[data-ba-easy]") && typeof state!=="undefined"){ state.easyMode=!state.easyMode; if(typeof save==="function")save(); }
      if(e.target.closest("[data-ba-reduit]")) document.body.classList.toggle("reduit");
      if(e.target.closest("#baMusicToggle")) document.getElementById("musicBtn")?.click() || document.getElementById("menuMusicBtn")?.click();
    };
  }

  /* ---- 3D Book ---- */
  function ensureLivre3d(){
    let host=document.getElementById("baLivre");
    if(host && !host.classList.contains("ba-l3")){ host.remove(); host=null; }
    if(!host){
      host=document.createElement("div");
      host.id="baLivre"; host.className="ba-l3";
      document.body.appendChild(host);
    }
    return host;
  }
  function closeLivre3d(){
    livreTimers.forEach(clearTimeout); livreTimers=[];
    const h=document.getElementById("baLivre");
    if(h){ h.classList.remove("open"); h.innerHTML=""; }
    document.querySelectorAll("#baShelf .ba-dos-v.emprunte").forEach(d=>d.classList.remove("emprunte"));
  }
  function openLivre3d(key){
    if(!biblioOn()) return;
    const data=(typeof CHAPTER_SELECT_DATA!=="undefined"?CHAPTER_SELECT_DATA:[]).find(c=>c.key===key);
    if(!data) return;
    const ok=typeof chapterSelectUnlocked==="function"?chapterSelectUnlocked(key):true;
    const dosEl=document.querySelector(`#baShelf [data-ba-ch="${key}"]`);
    const coul=dosEl?.style.getPropertyValue("--dc")||"#3b1424";
    const num=data.key==="intro"?"✦":(data.label||"").replace(/Chapitre\s+/i,"").trim();
    const reduit=document.body.classList.contains("reduit")||matchMedia("(prefers-reduced-motion:reduce)").matches;
    const host=ensureLivre3d();
    livreTimers.forEach(clearTimeout); livreTimers=[];
    host.classList.add("open");
    host.innerHTML=`<div class="livre-voile" data-ba-l3-close></div>
      <div class="l3-scene"><div class="livre3d ${ok?"":"scelle"}" data-etat="dos" style="--dc:${coul}" role="dialog" aria-modal="true">
        <div class="l3-arr" aria-hidden="true"></div>
        <div class="l3-pages"><div class="l3-page">
          <p class="k">${esc(data.label||"")}${data.subtitle?" · "+esc(data.subtitle):""}</p>
          <h2 class="l3-titre">${esc(data.title||"")}</h2>
          <div class="tags">${(data.tags||[]).map(t=>`<span class="tag">${esc(t)}</span>`).join("")}</div>
          <div class="l3-resume"><p><span class="lettrine">${esc((data.body||" ").charAt(0))}</span>${esc((data.body||"").slice(1))}</p></div>
          <div class="l3-act">${ok?`<button type="button" class="ba-btn or" data-ba-l3-launch style="color:#1a1206"><span style="position:relative;z-index:1">${esc(data.action||"Lancer")}</span></button>`:""}</div>
        </div></div>
        <div class="l3-couv" data-ba-l3-open>
          <div class="l3-avant"><img src="${esc(data.image||"")}" alt="">
            <div class="l3-cadre"></div>
            ${ok?"":'<div class="l3-sceau"><b>🔒</b><span>Volume scellé</span></div>'}
            <div class="l3-plaque"><span class="l3-num">${esc(num)}</span><span class="l3-lab">${esc((data.label||"").toUpperCase())}</span>
              <b class="l3-ct">${esc(data.title||"")}</b>
              <small class="l3-msg">${ok?"Toucher la couverture pour ouvrir":"Ce volume se révélera plus tard."}</small></div>
          </div>
          <div class="l3-arriere"><div class="l3-exlibris"><span>☾</span><small>Ex-libris</small><b>Bibliothèque de Mir’Aldas</b><em>Volume ${esc(num)}</em></div></div>
        </div>
      </div></div>
      <button type="button" class="ba-rond l3-fermer" data-ba-l3-close aria-label="Fermer">✕</button>`;
    const L=host.querySelector(".livre3d");
    if(dosEl) dosEl.classList.add("emprunte");
    if(reduit){
      L.classList.add("sans-anim"); L.dataset.etat=ok?"ouvert":"couv";
    } else {
      const r=dosEl?.getBoundingClientRect(), sc=host.querySelector(".l3-scene").getBoundingClientRect();
      const lr=L.getBoundingClientRect();
      if(r){ L.style.setProperty("--x0",`${r.left+r.width/2-(sc.left+sc.width/2)}px`); L.style.setProperty("--y0",`${r.top+r.height/2-(sc.top+sc.height/2)}px`); L.style.setProperty("--s0",(r.height/Math.max(lr.height,1)).toFixed(3)); }
      L.classList.add("sans-anim"); L.dataset.etat="dos"; void L.offsetWidth; L.classList.remove("sans-anim");
      requestAnimationFrame(()=>{ L.dataset.etat="couv"; });
      if(ok) livreTimers.push(setTimeout(()=>{ if(L.isConnected && L.dataset.etat==="couv") L.dataset.etat="ouvert"; }, 1900));
    }
    host.onclick=e=>{
      if(e.target.closest("[data-ba-l3-close]")){ closeLivre3d(); return; }
      if(e.target.closest("[data-ba-l3-open]") && ok){
        livreTimers.forEach(clearTimeout); L.classList.remove("sans-anim"); L.dataset.etat="ouvert"; return;
      }
      if(e.target.closest("[data-ba-l3-launch]")){
        closeLivre3d();
        if(typeof launchChapterSelect==="function") launchChapterSelect(key);
      }
    };
  }

  /* ---- Wire ribbons & title ---- */
  function wireGameHud(){
    const root=document.getElementById("baGameChrome");
    if(!root || root.dataset.baPanels==="1") return;
    root.dataset.baPanels="1";
    root.addEventListener("click",e=>{
      const g=e.target.closest("[data-ba-g]"); if(!g) return;
      e.preventDefault(); e.stopPropagation();
      const a=g.dataset.baG;
      if(a==="menu") openMenu();
      else if(a==="progress" || a==="journal") openJournal();
      else if(a==="signets") openSignets(true);
      else if(a==="codex"){ document.getElementById("codexBtn2")?.click(); }
    }, true);
  }
  function patchTitlePile(){
    const pile=document.querySelector("#baTitleChrome .ba-pile");
    if(!pile || pile.dataset.baFull==="1") return;
    // Insert Signets after Chapitres if missing
    if(!pile.querySelector('[data-ba-act="signets"]')){
      const chap=pile.querySelector('[data-ba-act="chapters"]');
      const btn=document.createElement("button");
      btn.type="button"; btn.className="ba-livre"; btn.style.setProperty("--dc","#16404f");
      btn.dataset.baAct="signets";
      btn.innerHTML=`<span class="tome">IV</span><span class="etiq">Signets</span><span class="sup"><i>${loadSignets().length} / 7</i></span>`;
      chap?.after(btn);
      // renumber following tomes visually not critical
    }
    pile.dataset.baFull="1";
    document.getElementById("baTitleChrome")?.addEventListener("click",e=>{
      const act=e.target.closest("[data-ba-act]");
      if(act?.dataset.baAct==="signets"){ openSignets(false); }
      if(act?.dataset.baAct==="opts"){ /* existing panel */ }
    }, true);
  }
  function patchShelfClicks(){
    const shelf=document.getElementById("baShelf");
    if(!shelf || shelf.dataset.ba3d==="1") return;
    shelf.dataset.ba3d="1";
    shelf.addEventListener("click",e=>{
      const b=e.target.closest("[data-ba-ch]"); if(!b||b.classList.contains("verrou")) return;
      e.preventDefault(); e.stopPropagation();
      openLivre3d(b.dataset.baCh);
    }, true);
  }
  function markIntime(){
    try{
      const id=(typeof state!=="undefined" && state.scene)||"";
      document.body.classList.toggle("ba-intime", /^c6_/.test(id)||/intime|nuit|terrasse|chambre|balcon/i.test(id+(document.getElementById("sceneSub")?.textContent||"")));
    }catch{}
  }
  function autoSignet(){
    try{
      if(typeof state==="undefined"||!state.scene) return;
      let all=loadSignets().filter(s=>s.slot!==0);
      all.push({slot:0, scene:state.scene, title:document.getElementById("sceneTitle")?.textContent||state.scene, date:Date.now(), auto:true});
      saveSignets(all);
    }catch{}
  }

  let _q=false;
  function tick(){
    if(_q||!biblioOn()) return; _q=true;
    requestAnimationFrame(()=>{
      _q=false;
      wireGameHud(); patchTitlePile(); patchShelfClicks();
      enhanceChoices(); markIntime();
    });
  }
  document.addEventListener("keydown",e=>{
    if(!biblioOn()) return;
    if(e.key==="Escape"){ if(document.getElementById("baLivre")?.classList.contains("open")) closeLivre3d(); else fermerCouche(); }
  });
  const mo=new MutationObserver(tick);
  function boot(){
    mo.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:["class","hidden"]});
    setInterval(()=>{ tick(); if(biblioOn()&&document.getElementById("game")&&!document.getElementById("game").classList.contains("hidden")) autoSignet(); }, 2000);
    tick();
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", boot); else boot();

  window.SylviniaBiblioPanels={ openMenu, openJournal, openSignets, openSettings, openLivre3d, closeLivre3d, fermerCouche };
})();
