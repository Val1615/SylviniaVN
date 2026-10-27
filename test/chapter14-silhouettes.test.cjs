const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const moduleSource=fs.readFileSync(path.join(root,'assets/js/chapter14-silhouettes.js'),'utf8');
function fixture({oldSave=false,revealed=false}={}){
  const A={},S={},CODEX_IMAGES={},CODEX_IMAGES_BY_SCENE={};
  for(const name of ['cycleMap','explicitCycles']){
    const map=JSON.parse(html.match(new RegExp('const '+name+'=(\\{[^;]+\\});'))[1]);
    for(const[id,keys]of Object.entries(map)){
      S[id]={bg:keys[0],bgCycle:keys,text:'intact',next:'suite'};
      CODEX_IMAGES_BY_SCENE[id]=keys;
      for(const key of keys){A[key]='legacy/'+key;CODEX_IMAGES[key]={title:key,src:A[key]};}
    }
  }
  for(const id of ['c14_i_017','c14_i_018'])S[id]={bg:'war',text:'intact',next:'suite'};
  S.c14_i_int_007={bg:'c14_i_int_007_missing',bgCycle:['c14_i_int_007_missing'],text:'intact',next:'suite'};
  CODEX_IMAGES.c14_i_int_007_missing={src:'legacy/007'};
  CODEX_IMAGES_BY_SCENE.c14_i_int_007=['c14_i_int_007_missing'];
  const c={A,S,CODEX_IMAGES,CODEX_IMAGES_BY_SCENE,CODEX_IMAGE_GROUPS:[],
    CODEX_IMAGE_ORDER:Object.keys(CODEX_IMAGES),CODEX_IMAGE_FILTERS:[],Date,
    state:{flags:{},codexUnlockedImages:oldSave?['c14_cg_iv_491']:[]},
    localStorage:{getItem:()=>revealed?'1':null,setItem:()=>{c.persisted=true;}},
    document:{addEventListener:(_,fn)=>{c.click=fn;},body:{classList:{contains:()=>false}}},
    setTimeout:f=>f(),renderCodex:()=>{},save:()=>{c.saved=true;}};
  c.window=c;vm.runInNewContext(moduleSource,c);return c;
}
test('ten assets used; text, transitions and combat unchanged',()=>{
  const c=fixture(),used=new Set();
  const changed=Object.values(c.S).filter(s=>s.bg.startsWith('c14_silhouette_'));
  assert.equal(changed.length,17);
  for(const sc of changed){
    assert.equal(sc.text,'intact');assert.equal(sc.next,'suite');
    assert.equal(sc.hideChars,true);assert.equal(sc.chars.length,0);
    for(const k of sc.bgCycle||[sc.bg]){used.add(k);assert.ok(fs.existsSync(path.join(root,c.A[k])));}
  }
  assert.equal(used.size,10);
  assert.equal(c.S.c14_i_013.bg,'c14_cg_iv_hit_2');
  assert.ok(!Object.keys(c.CODEX_IMAGES).some(k=>/^c14_cg_iv_\d+$|embrace|missing/.test(k)));
  assert.ok(Object.values(c.CODEX_IMAGES_BY_SCENE).every(keys=>!keys.some(k=>/^c14_cg_iv_\d+$|embrace|missing/.test(k))));
});
test('old gallery progress migrates; archive stays hidden',()=>{
  const c=fixture({oldSave:true});assert.ok(c.state.codexUnlockedImages.includes('c14_silhouette_baiser'));
  assert.ok(!c.CODEX_IMAGE_GROUPS.some(g=>g.id==='chapter14_directors_cut'));
});
for(const classic of [true,false])test('secret requires completion and seven clicks ('+(classic?'classic':'biblio')+')',()=>{
  const c=fixture();
  const target={dataset:classic?{}:{go:'#/codex/images?g=chapter14'},textContent:'Chapitre XIV',matches:s=>s!=='.codexFilterBtn'||classic};
  const click=()=>c.click({composedPath:()=>[target]});
  for(let i=0;i<7;i++)click();assert.ok(!c.persisted);
  c.state.flags.c14IrianaValurnIntimateUnlocked=true;
  for(let i=0;i<6;i++)click();assert.ok(!c.persisted);click();
  assert.ok(c.saved&&c.persisted);
  assert.equal(c.CODEX_IMAGE_GROUPS.find(g=>g.id==='chapter14_directors_cut').sections[0].keys.length,34);
  assert.equal(c.S.c14_i_019.bg,'c14_silhouette_baiser');
  assert.ok(fixture({revealed:true}).CODEX_IMAGES.c14_cg_iv_491);
});
test('index only adds module loading',()=>{
  assert.equal(html.split('<script src="assets/js/chapter14-silhouettes.js?v=2"></script>').length,2);
});
