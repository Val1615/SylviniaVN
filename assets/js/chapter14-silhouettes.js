/* Sélection de l'auteur : Chapitre XIV, Iriana et Valurn. */
(() => {
  'use strict';
  const SECRET = 'sylvinia_ch14_directors_cut_v1';
  const ARCHIVE = 'chapter14_directors_cut';
  const images = {
    tension:['01_tension.png','Le duel change de langage'],
    larmes_proche:['02_larmes_proche.png','Juste toi'],
    larmes_large:['03_larmes_large.png','Arrête'],
    baiser:['04_baiser.png','Une ligne franchie'],
    table:['05_table.png','Plus de lendemain'],
    rapprochement:['06_rapprochement.png','L’urgence'],
    abandon:['07_abandon.png','Le premier abandon'],
    apaisement:['08_apaisement.png','Après la tempête'],
    iriana_large:['09_iriana_large.png','Aucun vainqueur'],
    iriana_proche:['10_iriana_proche.png','Iriana reprend le dessus']
  };
  const shots = {
    c14_i_014:['larmes_large'], c14_i_015:['larmes_proche'],
    c14_i_016:['larmes_proche'], c14_i_017:['larmes_large'],
    c14_i_018:['larmes_large'], c14_i_019:['baiser'],
    c14_i_int_001:['baiser'], c14_i_int_002:['table'],
    c14_i_int_003:['tension'], c14_i_int_004:['rapprochement'],
    c14_i_int_005:['abandon'], c14_i_int_006:['iriana_large','iriana_proche'],
    c14_i_int_007:['iriana_proche','abandon'], c14_i_int_008:['apaisement'],
    c14_i_int_009:['apaisement'], c14_i_int_010:['apaisement'],
    c14_i_int_011:['apaisement']
  };
  const keyFor = name => 'c14_silhouette_' + name;
  const legacy = {}, previous = {};
  Object.keys(shots).forEach(id => {
    previous[id] = [...new Set([
      ...(CODEX_IMAGES_BY_SCENE[id] || []), ...(S[id]?.bgCycle || []), S[id]?.bg
    ].filter(Boolean))];
    previous[id].forEach(key => {
      if (/^c14_cg_iv_\d+$|^c14_cg_iv_embrace_|^c14_i_int_007_missing$/.test(key) && CODEX_IMAGES[key]) {
        legacy[key] = {...CODEX_IMAGES[key]};
      }
    });
  });
  const legacyKeys = Object.keys(legacy), legacySet = new Set(legacyKeys);
  legacyKeys.forEach(key => { delete CODEX_IMAGES[key]; });
  CODEX_IMAGE_ORDER.splice(0,CODEX_IMAGE_ORDER.length,...CODEX_IMAGE_ORDER.filter(k=>!legacySet.has(k)));
  CODEX_IMAGE_GROUPS.forEach(group => (group.sections || []).forEach(section => {
    section.keys = (section.keys || []).filter(k=>!legacySet.has(k));
  }));
  Object.keys(CODEX_IMAGES_BY_SCENE).forEach(id => {
    CODEX_IMAGES_BY_SCENE[id] = CODEX_IMAGES_BY_SCENE[id].filter(k=>!legacySet.has(k));
  });
  Object.entries(images).forEach(([name,[file,title]]) => {
    const key = keyFor(name);
    A[key] = 'assets/images/keyscenes/chapter14/silhouettes/' + file;
    CODEX_IMAGES[key] = {title:'XIV · ' + title,body:'Iriana et Valurn · Clair-obscur.',src:A[key]};
    if (!CODEX_IMAGE_ORDER.includes(key)) CODEX_IMAGE_ORDER.push(key);
  });
  Object.entries(shots).forEach(([id,names]) => {
    const scene = S[id];
    if (!scene) return;
    const keys = names.map(keyFor);
    scene.bg = keys[0];
    if (keys.length > 1) { scene.bgCycle = keys; scene.bgCycleMs = 6500; }
    else { delete scene.bgCycle; delete scene.bgCycleMs; }
    scene.zoom = true; scene.hideChars = true; scene.clearChars = true; scene.chars = [];
    CODEX_IMAGES_BY_SCENE[id] = keys;
    if (previous[id].some(key=>(state.codexUnlockedImages || []).includes(key))) {
      state.codexUnlockedImages = [...new Set([...(state.codexUnlockedImages || []),...keys])];
    }
  });
  let group = CODEX_IMAGE_GROUPS.find(g=>g.id==='chapter14');
  if (!group) {
    group = {id:'chapter14',title:'Chapitre XIV · Le Conseil de Guerre',sections:[]};
    const next = CODEX_IMAGE_GROUPS.findIndex(g=>g.id==='chapter15');
    CODEX_IMAGE_GROUPS.splice(next<0?CODEX_IMAGE_GROUPS.length:next,0,group);
  }
  group.sections = [
    {title:'Le Conseil et ses conséquences',keys:Object.keys(CODEX_IMAGES).filter(k=>/^c14_/.test(k)&&!k.startsWith('c14_silhouette_'))},
    {title:'Iriana et Valurn · Clair-obscur',keys:Object.keys(images).map(keyFor)}
  ];
  if (!CODEX_IMAGE_FILTERS.some(f=>f.id==='chapter14')) CODEX_IMAGE_FILTERS.push({id:'chapter14',label:'Chapitre XIV'});
  function reveal() {
    if (CODEX_IMAGE_GROUPS.some(g=>g.id===ARCHIVE)) return;
    Object.assign(CODEX_IMAGES,legacy);
    CODEX_IMAGE_GROUPS.push({id:ARCHIVE,title:'Director’s Cut · Chapitre XIV',sections:[
      {title:'Iriana et Valurn · Les anciennes illustrations',keys:legacyKeys}
    ]});
    CODEX_IMAGE_FILTERS.push({id:ARCHIVE,label:'Director’s Cut'});
    legacyKeys.forEach(k=>{if(!CODEX_IMAGE_ORDER.includes(k))CODEX_IMAGE_ORDER.push(k);});
    state.codexUnlockedImages = [...new Set([...(state.codexUnlockedImages || []),...legacyKeys])];
  }
  try { if (localStorage.getItem(SECRET)==='1') reveal(); } catch (_) {}
  let clicks=0,lastClick=0;
  document.addEventListener('click',event=>{
    const target = event.composedPath().find(el=>el?.matches?.('[data-go="#/codex/images?g=chapter14"], .codexFilterBtn'));
    const classic = target?.matches?.('.codexFilterBtn') && target.textContent==='Chapitre XIV';
    if (!target || (!classic && target.dataset.go!=='#/codex/images?g=chapter14')) {clicks=0;return;}
    const completed = state.flags?.c14IrianaValurnIntimateUnlocked || state.flags?.chapter14IrianaEnding ||
      ['c14_i_int_011','c14_i_complete'].includes(state.scene);
    if (!completed || CODEX_IMAGE_GROUPS.some(g=>g.id===ARCHIVE)) return;
    const now=Date.now(); clicks=now-lastClick<4000?clicks+1:1; lastClick=now;
    if (clicks<7) return;
    reveal();
    try {localStorage.setItem(SECRET,'1');} catch (_) {}
    if (typeof save==='function') save();
    if (typeof toast==='function') toast('Une bobine oubliée…','Director’s Cut débloqué dans la galerie.');
    setTimeout(()=>{
      if (document.body.classList.contains('ui-biblio')) window.dispatchEvent(new HashChangeEvent('hashchange'));
      else if (typeof renderCodex==='function') renderCodex();
    },0);
  },true);
})();
