import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

// Tests du moteur, sans DOM. Seuls les hooks React sont remplacés par des
// cellules synchrones ; les actions, horaires et transitions restent ceux
// de page.tsx. Cette instrumentation n'entre jamais dans le build du jeu.
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const hookId = "\0hr-test-hooks";
const hookModule = `
let slots = [], cursor = 0;
export function reset() { slots = []; cursor = 0; }
export function beginRender() { cursor = 0; }
export function useState(initial) {
  const index = cursor++;
  if (!(index in slots)) slots[index] = typeof initial === 'function' ? initial() : initial;
  return [slots[index], value => { slots[index] = typeof value === 'function' ? value(slots[index]) : value; }];
}
export function useRef(current) { return useState({ current })[0]; }
export function useEffect() {}
export function useCallback(callback) { return callback; }
`;
const exportNames = ["createGame", "hydrateGame", "DEFAULT_PLAYER", "choicesForDialogue", "groupDateUnlocked", "evolveCrossQuests", "socialSceneReady", "spontaneousEventReady", "characterPlace", "JournalView", "RelationsView", "GameModal"];
const actions = ["game", "dialogue", "modal", "setGame", "setDialogue", "setModal", "advanceDialogue", "selectChoice", "closeDialogue", "startHRScene", "startAnchorOperation", "setAnchorState", "readHRLetter", "startGroupDate", "replayGroupDate", "startCrossQuestScene", "startAlphaHunt", "finishAlphaHunt", "updateGame", "startDate"];
const server = await createServer({
  root, appType: "custom", logLevel: "silent", server: { middlewareMode: true },
  plugins: [{
    name: "hr-engine-tests", enforce: "pre",
    resolveId(id) { if (id === "hr-test-hooks") return hookId; },
    load(id) { if (id === hookId) return hookModule; },
    transform(code, id) {
      if (!id.endsWith("/src/page.tsx")) return;
      assert.ok(code.includes('  if (screen === "title") {'), "point d’instrumentation du moteur absent");
      return code
        .replace('from "react";', 'from "hr-test-hooks";')
        .replace('  if (screen === "title") {', `  return { ${actions.join(", ")} };\n  if (screen === "title") {`)
        + `\nexport { ${exportNames.join(", ")} };`;
    },
  }],
});
try {
 const page = await server.ssrLoadModule('/src/page.tsx'), hooks = await server.ssrLoadModule('hr-test-hooks');
 const hr = await server.ssrLoadModule('/src/hylee-remerii-cross-quest.ts'), dates = await server.ssrLoadModule('/src/hylee-remerii-dates.ts'), anchor = await server.ssrLoadModule('/src/anchor-operation.ts');
 const housing = await server.ssrLoadModule('/src/housing-data.ts'), sprites = await server.ssrLoadModule('/src/sprite-system.ts'), world = await server.ssrLoadModule('/src/world-data.ts');
 const ui = await server.ssrLoadModule('/src/hylee-remerii-ui.tsx'), ambient = await server.ssrLoadModule('/src/hylee-remerii-ambient.ts'), social = await server.ssrLoadModule('/src/social-scenes.ts');
 const { renderToStaticMarkup } = await import('react-dom/server'), { createElement } = await import('react');
 let api;
 const render = () => { hooks.beginRender(); return api = page.default(); };
 const init = game => { hooks.reset(); render().setGame(structuredClone(game)); return render(); };
 const act = (name,...args) => { api[name](...args); return render(); };
 const save = () => page.hydrateGame(JSON.parse(JSON.stringify(api.game)));
 const progress = () => api.game.crossQuestSeries[hr.HR_KEY];
 function fixture(flags = []) {
  const g = page.createGame({...page.DEFAULT_PLAYER,name:'Test',intimacy:'tendre'});
  g.flags = ['main-story-act-1-complete','story-route-miraldas',...flags];
  for (const id of ['hylee','remerii','lineva','allenna']) g.relationships[id] = {...g.relationships[id],met:true,stage:5,affection:50,trust:50,desire:0};
  g.crossQuestSeries.linevaAllenna = {id:'linevaAllenna',stage:6,startedDay:1,stageStartedDay:1,letters:[{id:'cross-la-letter-1',receivedDay:1,read:false}]};
  return page.hydrateGame(page.evolveCrossQuests(g));
 }
 function finish(pick = cs => cs[0], reload = false) {
  let count = 0, guard = 0;
  while (api.dialogue) {
   assert.ok(++guard < 900,'dialogue bloqué');
   if (['choices','relation-choices'].includes(api.dialogue.phase)) {
    const cs = page.choicesForDialogue(api.dialogue,api.game); assert.ok(cs.length,'écran de choix vide');
    act('selectChoice',pick(cs,count++));
    if (reload && !api.dialogue.replay) {
     const scene = api.dialogue.scene, state = save(), relations = structuredClone(api.game.relationships);
     init(state);
     if (scene.groupDate) act('startGroupDate',scene.id);
     else act('startHRScene',progress().stage,false,scene.id.startsWith('cross-hr-recognition'));
     assert.ok(api.dialogue,'reprise absente'); assert.deepEqual(api.game.relationships,relations,'récompense doublée à la reprise');
    }
   } else act('advanceDialogue');
  }
  return count;
 }
 function solvePhase(state) {
  let s = anchor.selectAnchor(state,anchor.ANCHOR_TARGETS[state.phase]); const p = anchor.anchorPuzzle(s);
  if (s.selected === 'A') { for (let i=0;i<3;i++) for (let n=s.input[i];n!==p.directions[i];n=(n+1)%4) s=anchor.anchorAction(s,i); s=anchor.anchorAction(s,'check'); }
  else if (s.selected === 'B') s=anchor.anchorAction(s,p.odd);
  else { s=anchor.anchorAction(s,'remember'); for (const pulse of p.pulses) s=anchor.anchorAction(s,pulse); }
  return s;
 }
 function win(state) {
  let s=state;
  while (!s.signalReady) { s=solvePhase(s); assert.ok(anchor.validAnchorState(JSON.parse(JSON.stringify(s)))); }
  assert.equal(s.result,undefined,'signal final séparé'); return anchor.anchorAction(s,'signal');
 }
 for (let seed=1;seed<=16;seed++) { const s=win(anchor.createAnchorOperation(seed)); assert.equal(s.result,'controlled');assert.equal(s.solved.length,5);assert.deepEqual(anchor.anchorAction(s,'check'),s); }
 let broken=anchor.selectAnchor(anchor.createAnchorOperation(9),'B');const wrong=(anchor.anchorPuzzle(broken).odd+1)%6;
 broken=anchor.anchorAction(anchor.anchorAction(broken,wrong),wrong);assert.equal(broken.incidents,1);assert.equal(win(broken).result,'pressure');
 broken=anchor.anchorAction(anchor.anchorAction(broken,wrong),wrong);assert.equal(broken.result,'retreat');assert.ok(anchor.validAnchorState(broken));assert.equal(win(anchor.createAnchorOperation(broken.seed)).result,'controlled');
 for (const target of ['A','C']) {
  let s=anchor.createAnchorOperation(3);while(anchor.ANCHOR_TARGETS[s.phase]!==target)s=solvePhase(s);s=anchor.selectAnchor(s,target);
  for(let i=0;i<2;i++) { if(target==='A')s=anchor.anchorAction(s,'check');else{s=anchor.anchorAction(s,'remember');s=anchor.anchorAction(s,(anchor.anchorPuzzle(s).pulses[0]+1)%4);} }
  assert.equal(s.incidents,1,`${target}: deux erreurs valent un incident`);
 }
 assert.equal(anchor.validAnchorState({...anchor.createAnchorOperation(1),phase:3}),false);
 let recognized;
 for (const flags of [[],['date-intimate:date-hylee-test'],['home-intimate:remerii'],['home-intimate:hylee','date-intimate:date-remerii-test']]) {
  init(fixture(flags));const la=structuredClone(api.game.crossQuestSeries.linevaAllenna);
  for(let stage=0;stage<6;stage++) {
   act('startHRScene',stage);assert.ok(api.dialogue);act('closeDialogue');assert.equal(progress().stage,stage,'validation prématurée');
   assert.ok(finish(cs=>flags.length===1?cs.at(-1):cs[0],true)>=1);assert.equal(progress().stage,stage+1,'étape non validée');assert.deepEqual(api.game.crossQuestSeries.linevaAllenna,la);init(save());
  }
  assert.equal(progress().hr.branch,flags.length===2?'double':'standard');
  act('startHRScene',6);finish(undefined,true);assert.equal(progress().stage,6);assert.equal(progress().hr.prepared,true);
  act('startAnchorOperation');act('setAnchorState',win(progress().hr.anchor));init(save());
  act('startHRScene',6);finish(undefined,true);assert.equal(progress().stage,7);assert.equal(progress().letters.length,4);
  act('readHRLetter',progress().letters[0].id);init(save());assert.equal(progress().letters[0].read,true);
  for(const stage of [0,3,4,5,6]) { const before=structuredClone(api.game);act('startHRScene',stage,true);finish();assert.deepEqual(api.game,before,'relecture sans mutation'); }
  if(flags.length<2) { act('startHRScene',7,false,true);assert.equal(api.dialogue,null);act('setGame',{...api.game,flags:[...api.game.flags,'home-intimate:hylee','home-intimate:remerii']});act('startHRScene',7,false,true);assert.equal(api.dialogue,null,'branche non rétroactive'); }
  else recognized=save();
  assert.deepEqual(api.game.crossQuestSeries.linevaAllenna,la);
 }
 for(const configuration of ['separate','refused']) {
  init(recognized);const relations=structuredClone(api.game.relationships);act('startHRScene',7,false,true);finish(cs=>cs.find(c=>c.id.endsWith(configuration)),true);assert.deepEqual(api.game.relationships,relations,'pas de pénalité individuelle');assert.equal(progress().hr.configuration,configuration);assert.ok(!api.game.flags.includes(hr.HR_OPEN));
 }
 init(recognized);
 for(let i=0;i<2;i++) { act('startHRScene',7,false,true);finish(cs=>cs.find(c=>c.id.endsWith('waiting')),true);act('startHRScene',7,false,true);assert.equal(api.dialogue,null);act('setGame',{...api.game,day:api.game.day+1}); }
 act('startHRScene',7,false,true);finish(cs=>cs.find(c=>c.id.endsWith('accepted')),true);assert.ok(api.game.flags.includes(hr.HR_OPEN));
 for(let i=0;i<dates.HR_DATES.length;i++) {
  const date=dates.HR_DATES[i];if(i<2)assert.equal(page.groupDateUnlocked(api.game,dates.HR_DATES[i+1]),false);
  if(date.home) { assert.equal(page.groupDateUnlocked(api.game,date),false);act('setGame',{...api.game,housing:{...api.game.housing,propertyId:housing.HOUSING_PROPERTIES[0].id}}); }
  assert.ok(page.groupDateUnlocked(api.game,date));act('startGroupDate',date.id);assert.ok(api.dialogue);
  const day=api.game.day;init(save());act('startGroupDate',date.id);assert.equal(api.game.day,day,'pas de nouveau jour à la reprise');
  assert.ok(!api.game.groupDateHistory.includes(date.id));
  if(date.home)assert.equal(api.dialogue.scene.background,world.spotById(housing.HOUSING_PROPERTIES[0].spot).background);
  assert.ok(finish(cs=>cs.at(-1),true)>=3);assert.ok(api.game.groupDateHistory.includes(date.id));assert.notEqual(api.modal?.kind,'group-date-result');
  init(save());const before=structuredClone(api.game);act('replayGroupDate',date.id);assert.ok(api.dialogue);finish();assert.deepEqual(api.game,before);
  const relations=structuredClone(api.game.relationships);act('startGroupDate',date.id);finish();assert.deepEqual(api.game.relationships,relations);assert.equal(api.game.groupDateHistory.filter(id=>id===date.id).length,1);
 }
 const html=renderToStaticMarkup(createElement(ui.HRDossier,{progress:progress(),day:api.game.day,onScene(){},onOperation(){},onLetter(){}}));assert.ok(html.includes('7 / 7'));for(const title of hr.HR_TITLES)assert.ok(html.includes(title));
 const planner=renderToStaticMarkup(createElement(page.GameModal,{modal:{kind:'group-date-planner'},game:api.game,onClose(){},startGroupDate(){}}));
 for(const date of dates.HR_DATES)assert.ok(planner.includes(date.title));assert.ok(!planner.includes('La leçon à trois voix'));
 const scenes=[...hr.HR_SCENES,hr.hrQuestScene(6,{choices:{}}),hr.hrQuestScene(6,{choices:{},anchor:win(anchor.createAnchorOperation(2))}),hr.hrRecognition(),...dates.HR_DATES.map(d=>({...d,beats:dates.HR_DATE_BEATS[d.id]})),...ambient.HR_AMBIENT_SCENES.map(s=>({...s,intro:s.prompt}))];
 for(const scene of scenes) for(const beat of [scene,...(scene.beats||[])]) for(const line of [...beat.intro,...beat.choices.flatMap(c=>c.response)]) if(line.mood&&['Hylee','Remerii'].includes(line.speaker))assert.ok(sprites.spriteMoodExists(line.speaker.toLowerCase(),line.mood),`${line.speaker}: sprite ${line.mood} inexistant`);
 const locked=fixture();locked.flags=[];assert.equal(hr.hrUnlocked(locked),false);
 for(const scene of ambient.HR_AMBIENT_SCENES) {
  const g=fixture();g.location=scene.locations[0];g.spot=scene.sublocations[0];
  const isolated={...scene,requiredPresent:[]};
  g.crossQuestSeries[hr.HR_KEY].stage=scene.crossStage.min;assert.ok(page.socialSceneReady(isolated,scene.characters[0],g));
  g.crossQuestSeries[hr.HR_KEY].stage=scene.crossStage.min-1;assert.equal(page.socialSceneReady(isolated,scene.characters[0],g),false);
 }
 console.log('Hylee–Remerii : 4 parcours, sauvegardes après chaque choix, branche figée, refus/attente, 3 rendez-vous, relectures, 16 opérations, ambiances et HTML du Journal/planificateur validés. Tests moteur ; rendu navigateur non certifié.');
} finally { await server.close(); }
