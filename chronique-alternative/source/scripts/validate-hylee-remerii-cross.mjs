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
const actions = ["game", "dialogue", "modal", "setGame", "setDialogue", "setModal", "advanceDialogue", "selectChoice", "closeDialogue", "startHRScene", "startAnchorOperation", "setAnchorState", "readHRLetter", "startGroupDate", "replayGroupDate", "startGroupDateIntimacy", "finishTrioEnding", "closeGroupIntimacy", "replayGroupDateIntimacy", "startCrossQuestScene", "startAlphaHunt", "setAlphaHuntState", "finishAlphaHunt", "updateGame", "startDate"];
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
 const [questSource,dateSource,uiSource,pageSource,groupSource,cgSource,cssSource,dossierSource]=await Promise.all([
  readFile(resolve(root,'src/hylee-remerii-cross-quest.ts'),'utf8'),
  readFile(resolve(root,'src/hylee-remerii-dates.ts'),'utf8'),
  readFile(resolve(root,'src/hylee-remerii-ui.tsx'),'utf8'),
  readFile(resolve(root,'src/page.tsx'),'utf8'),
  readFile(resolve(root,'src/group-dates.ts'),'utf8'),
  readFile(resolve(root,'src/intimate-cg.ts'),'utf8'),
  readFile(resolve(root,'src/globals.css'),'utf8'),
  readFile(resolve(root,'src/cross-quest-dossier.tsx'),'utf8'),
 ]);
 const page = await server.ssrLoadModule('/src/page.tsx'), hooks = await server.ssrLoadModule('hr-test-hooks');
 const hr = await server.ssrLoadModule('/src/hylee-remerii-cross-quest.ts'), dates = await server.ssrLoadModule('/src/hylee-remerii-dates.ts'), anchor = await server.ssrLoadModule('/src/anchor-operation.ts');
 const cross = await server.ssrLoadModule('/src/cross-quests.ts'), alpha = await server.ssrLoadModule('/src/alpha-hunt.ts');
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
  act('setGame',{...api.game,relationships:{...api.game.relationships,hylee:{...api.game.relationships.hylee,desire:25},remerii:{...api.game.relationships.remerii,desire:25}}});
  assert.ok(page.groupDateUnlocked(api.game,date));act('startGroupDate',date.id);assert.ok(api.dialogue);
  const day=api.game.day;init(save());act('startGroupDate',date.id);assert.equal(api.game.day,day,'pas de nouveau jour à la reprise');
  assert.ok(!api.game.groupDateHistory.includes(date.id));
  if(date.home)assert.equal(api.dialogue.scene.background,world.spotById(housing.HOUSING_PROPERTIES[0].spot).background);
  const dateChoiceCount=finish(cs=>cs.find(choice=>choice.dateOutcome==='great')||cs[0],true);assert.ok(dateChoiceCount>=3,`${date.id}: ${dateChoiceCount} choix seulement`);assert.ok(api.game.groupDateHistory.includes(date.id));assert.equal(api.modal?.kind,'group-date-result',`${date.id}: la continuation doit être proposée après le seuil de désir`);
  act('finishTrioEnding',date.id,false);assert.equal(api.modal?.kind,'notice','« pas ce soir » doit produire une fin locale');assert.ok(!api.game.flags.includes(`group-date-platonic:${date.id}`),'aucun verrou platonique permanent');
  const lowDesire={...save(),relationships:{...api.game.relationships,hylee:{...api.game.relationships.hylee,desire:24},remerii:{...api.game.relationships.remerii,desire:24}}};
  init(lowDesire);act('setModal',null);act('startGroupDateIntimacy',date.id);assert.equal(api.modal,null,'intimité accessible avant le seuil');
  act('setGame',{...api.game,relationships:{...api.game.relationships,hylee:{...api.game.relationships.hylee,desire:25},remerii:{...api.game.relationships.remerii,desire:25}}});act('startGroupDateIntimacy',date.id);assert.equal(api.modal?.kind,'group-intimacy','intimité inaccessible après le seuil');
  act('closeGroupIntimacy',true,`memory:${date.id}`);assert.ok(api.game.flags.includes(`group-date-intimate:${date.id}`));assert.equal(api.game.sceneMemories[`group-intimacy:${date.id}`],`memory:${date.id}`);
  const afterIntimacy=save();act('replayGroupDateIntimacy',date.id);assert.equal(api.modal?.kind,'group-intimacy');assert.equal(api.modal?.replay,true);act('closeGroupIntimacy',false);assert.deepEqual(api.game,afterIntimacy,'la relecture intime ne doit rien muter');
  init(save());const before=structuredClone(api.game);act('replayGroupDate',date.id);assert.ok(api.dialogue);finish();assert.deepEqual(api.game,before);
  const relations=structuredClone(api.game.relationships);act('startGroupDate',date.id);finish();assert.deepEqual(api.game.relationships,relations);assert.equal(api.game.groupDateHistory.filter(id=>id===date.id).length,1);
 }
 const beforeAnchorReplay=structuredClone(api.game);act('startAnchorOperation',true);assert.equal(api.modal?.kind,'anchor-operation');assert.equal(api.modal?.replay,true);assert.equal(api.modal?.state?.phase,0);
 act('setAnchorState',{...api.modal.state,lastPoint:'A',revision:api.modal.state.revision+1});assert.deepEqual(api.game,beforeAnchorReplay,'rejouer les ancrages ne doit pas modifier la sauvegarde');act('setModal',null);
 const completedHR=save();
 const laReplay=fixture();
 laReplay.crossQuestSeries.linevaAllenna={
  ...laReplay.crossQuestSeries.linevaAllenna,
  stage:8,
  letters:cross.LINEVA_ALLENNA_LETTERS.map(letter=>({id:letter.id,receivedDay:laReplay.day,read:true})),
  alphaState:alpha.createAlphaHunt(71),
 };
 init(laReplay);let beforeLAReplay=structuredClone(api.game);
 act('startCrossQuestScene',0,true);assert.equal(api.dialogue?.replayNextCrossStage,1,'la première quête doit enchaîner ses deux scènes');assert.ok(finish()>=2,'les deux scènes du Mauvais allié ne sont pas toutes rejouées');assert.deepEqual(api.game,beforeLAReplay,'la première quête Lineva/Allenna rejouée mute la sauvegarde');
 for(const stage of [2,4,5,7]) { beforeLAReplay=structuredClone(api.game);act('startCrossQuestScene',stage,true);assert.ok(api.dialogue,`relecture Lineva/Allenna ${stage} absente`);finish();assert.deepEqual(api.game,beforeLAReplay,`relecture Lineva/Allenna ${stage} mutante`); }
 beforeLAReplay=structuredClone(api.game);act('startAlphaHunt',true);assert.equal(api.modal?.kind,'alpha-hunt');assert.equal(api.modal?.replay,true);assert.equal(api.modal?.state?.phase,'observation');act('setAlphaHuntState',{...api.modal.state,lastReaction:'Relecture isolée'});assert.deepEqual(api.game,beforeLAReplay,'rejouer la traque de l’Alpha doit rester isolé');act('finishAlphaHunt');assert.equal(api.modal,null);assert.deepEqual(api.game,beforeLAReplay);
 init(completedHR);
 const html=renderToStaticMarkup(createElement(ui.HRDossier,{progress:progress(),day:api.game.day,onScene(){},onOperation(){},onLetter(){}}));assert.ok(html.includes('7 / 7'));for(const title of hr.HR_TITLES)assert.ok(html.includes(title));
 const planner=renderToStaticMarkup(createElement(page.GameModal,{modal:{kind:'group-date-planner'},game:api.game,onClose(){},startGroupDate(){}}));
 for(const date of dates.HR_DATES)assert.ok(planner.includes(date.title));assert.ok(!planner.includes('La leçon à trois voix'));
 const scenes=[...hr.HR_SCENES,hr.hrQuestScene(6,{choices:{}}),hr.hrQuestScene(6,{choices:{},anchor:win(anchor.createAnchorOperation(2))}),hr.hrRecognition({choices:{}}),...dates.HR_DATES.map(d=>({...d,beats:dates.HR_DATE_BEATS[d.id]})),...ambient.HR_AMBIENT_SCENES.map(s=>({...s,intro:s.prompt}))];
 for(const scene of scenes) for(const beat of [scene,...(scene.beats||[])]) for(const line of [...beat.intro,...beat.choices.flatMap(c=>c.response)]) if(line.mood&&['Hylee','Remerii'].includes(line.speaker))assert.ok(sprites.spriteMoodExists(line.speaker.toLowerCase(),line.mood),`${line.speaker}: sprite ${line.mood} inexistant`);
 const locked=fixture();locked.flags=[];assert.equal(hr.hrUnlocked(locked),false);
 for(const scene of ambient.HR_AMBIENT_SCENES) {
  const g=fixture();g.location=scene.locations[0];g.spot=scene.sublocations[0];
  const isolated={...scene,requiredPresent:[]};
  g.crossQuestSeries[hr.HR_KEY].stage=scene.crossStage.min;assert.ok(page.socialSceneReady(isolated,scene.characters[0],g));
  g.crossQuestSeries[hr.HR_KEY].stage=scene.crossStage.min-1;assert.equal(page.socialSceneReady(isolated,scene.characters[0],g),false);
 }

 const allQuestChoices=scenes.slice(0,9).flatMap(scene=>[...scene.choices,...(scene.beats||[]).flatMap(beat=>beat.choices)]);
 const validStats=new Set(['audace','lucidite','sangFroid','resonance']);
 assert.ok(allQuestChoices.length>=30,'nombre de choix croisés insuffisant');
 assert.ok(allQuestChoices.every(choice=>validStats.has(choice.stat)),'un choix utilise encore une stat implicite ou invalide');
 for(const stat of validStats)assert.ok(allQuestChoices.some(choice=>choice.stat===stat),`${stat}: orientation absente de la série`);
 assert.ok(allQuestChoices.filter(choice=>(choice.effects.desire||0)>0||Object.values(choice.effects.relationshipEffects||{}).some(effect=>(effect.desire||0)>0)).length>=5,'courbe de désir insuffisante');
 assert.doesNotMatch(questSource,/stat\s*=\s*["']lucidite["']/u,'Q possède encore une stat par défaut');
 assert.match(questSource,/const Q = \(\s*id: string,\s*text: string,\s*stat: StatKey/u,'Q doit exiger explicitement StatKey');
 for(const objective of hr.HR_OBJECTIVES)assert.ok(objective.length>60,`objectif de Journal trop vague : ${objective}`);
 assert.match(questSource,/Certainement pas\. Nous resterons loin de l’ouverture/iu,'la quête 1 ne clarifie pas l’absence de retour au portail');
 assert.match(questSource,/terrasse orientale répond/iu,'la progression de l’hypothèse en quête 2 est absente');
 assert.match(questSource,/Tu sais où tu m’as trouvée/iu,'la blessure centrale de la quête 4 a disparu');
 assert.match(questSource,/Je lui parlerai moi-même/iu,'la réparation n’appartient plus clairement à Hylee et Remerii');
 assert.match(questSource,/Tu nous avais demandé du temps/iu,'la reprise après attente n’influence pas la reconnaissance');

 const standardVisible=fixture();standardVisible.crossQuestSeries[hr.HR_KEY]={...standardVisible.crossQuestSeries[hr.HR_KEY],stage:7,hr:{choices:{},branch:'standard'}};
 assert.equal(dates.hrDateVisibility(dates.HR_DATES[0],standardVisible).status,'unavailable');
 const undecided=fixture();undecided.crossQuestSeries[hr.HR_KEY]={...undecided.crossQuestSeries[hr.HR_KEY],stage:7,hr:{choices:{},branch:'double'}};
 assert.equal(dates.hrDateVisibility(dates.HR_DATES[0],undecided).status,'decision');
 const waiting=structuredClone(undecided);waiting.crossQuestSeries[hr.HR_KEY].hr.configuration='waiting';waiting.crossQuestSeries[hr.HR_KEY].hr.recognitionDay=waiting.day;
 assert.equal(dates.hrDateVisibility(dates.HR_DATES[0],waiting).status,'waiting');waiting.day+=1;assert.equal(dates.hrDateVisibility(dates.HR_DATES[0],waiting).status,'decision');
 const accepted=structuredClone(undecided);accepted.crossQuestSeries[hr.HR_KEY].hr.configuration='accepted';accepted.flags=accepted.flags.filter(flag=>flag!==hr.HR_OPEN);
 assert.equal(dates.hrDateVisibility(dates.HR_DATES[0],accepted).status,'available','configuration canonique acceptée non reconnue');
 accepted.groupDateHistory=[dates.HR_DATE_IDS[0],dates.HR_DATE_IDS[1]];const homeLock=dates.hrDateVisibility(dates.HR_DATES[2],accepted);assert.equal(homeLock.status,'locked');assert.match(homeLock.reason,/Achetez un logis/iu);
 const legacy=fixture();legacy.crossQuestSeries[hr.HR_KEY]={...legacy.crossQuestSeries[hr.HR_KEY],stage:7,hr:{choices:{'cross-hr-recognition':['cross-hr-config-waiting'],'cross-hr-recognition-later':['cross-hr-config-accepted']},branch:'double'}};legacy.flags=legacy.flags.filter(flag=>flag!==hr.HR_OPEN);
 const migrated=page.hydrateGame(JSON.parse(JSON.stringify(legacy)));assert.equal(migrated.crossQuestSeries[hr.HR_KEY].hr.configuration,'accepted','le dernier choix canonique doit gagner');assert.ok(migrated.flags.includes(hr.HR_OPEN),'ancienne sauvegarde acceptée non normalisée');
 const legacyFlag=fixture([hr.HR_OPEN]);legacyFlag.crossQuestSeries[hr.HR_KEY]={...legacyFlag.crossQuestSeries[hr.HR_KEY],stage:7,hr:{choices:{'cross-hr-recognition':['cross-hr-config-waiting']},branch:'double'}};
 const migratedFlag=page.hydrateGame(JSON.parse(JSON.stringify(legacyFlag)));assert.equal(migratedFlag.crossQuestSeries[hr.HR_KEY].hr.configuration,'accepted','le flag canonique d’une ancienne sauvegarde doit prouver l’acceptation');

 assert.match(uiSource,/CrossQuestDossier/u,'Hylee\/Remerii n’utilise pas le dossier partagé');
 assert.match(pageSource,/<CrossQuestDossier/u,'Lineva\/Allenna n’utilise pas le dossier partagé');
 assert.equal((pageSource.match(/<CrossQuestDossier/gu)||[]).length>=1,true,'dossier commun absent du Journal');
 assert.match(dossierSource,/cross-dossier-mechanic/u,'la mécanique propre à chaque route n’est pas intégrée au composant commun');
 assert.match(dossierSource,/cross-milestone-list/u,'les étapes ne partagent pas une structure de liste commune');
 assert.match(pageSource,/mechanic=\{linevaAllennaMechanic\}/u,'la traque de l’Alpha n’est pas reliée au dossier Lineva\/Allenna');
 assert.match(pageSource,/onStartAlphaHunt\(true\)/u,'la traque de l’Alpha n’est pas rejouable depuis le Journal');
 assert.match(uiSource,/onOperation\(true\)/u,'les Trois Points d’Ancrage ne sont pas rejouables depuis le Journal');
 assert.match(pageSource,/replayNextCrossStage/u,'les deux scènes de la première quête Lineva\/Allenna ne sont pas enchaînées en relecture');
 assert.match(cssSource,/\.shared-cross-dossier/u,'la parité visuelle des dossiers n’est pas définie dans la feuille de style');
 assert.match(uiSource,/serres-three-anchors\.jpg/u,'la carte finale des Serres n’est pas utilisée');
 assert.doesNotMatch(uiSource,/approved map|fallback map|placeholder/iu,'le mini-jeu se présente encore comme un fallback');
 assert.match(cssSource,/\.anchor-operation\.state-(?:tension|incident|retreat|success)/u,'états visuels du mini-jeu absents');
 assert.equal(anchor.ANCHOR_PHASE_DATA.length,5,'phases scénarisées incomplètes');
 assert.ok(anchor.ANCHOR_PHASE_DATA.every(phase=>phase.objective&&phase.hint&&phase.dialogue?.length>=2),'objectifs ou dialogues dynamiques incomplets');
 await access(resolve(root,'../assets/backgrounds/serres-three-anchors.jpg'));await access(resolve(root,'../assets/audio/serres-operation.mp3'));
 assert.doesNotMatch(dateSource,/intimacyDisabled\s*:\s*true/u,'les rendez-vous Hylee\/Remerii désactivent encore l’intimité');
 assert.match(groupSource,/HYLEE_REMERII_MANUAL_ROUTES/u,'registre manuel Hylee\/Remerii non branché');
 assert.match(cgSource,/"group-date-hylee-remerii-home"\s*:\s*"hylee_remerii"/u,'CG du logis non attribuées');
 assert.match(cgSource,/"group-date-hylee-remerii-free-day"\s*:\s*"hylee_remerii"/u,'CG bonus absente de la journée sans programme');
 assert.match(cgSource,/"group-date-hylee-remerii-wind"\s*:\s*"hylee_remerii"/u,'CG bonus absente du rendez-vous contre le vent');
 console.log('Quêtes croisées : dossiers harmonisés · relecture Lineva/Allenna protégée · deux mini-jeux accessibles et rejouables · progression Hylee/Remerii 0→7 validée.');
} finally { await server.close(); }
