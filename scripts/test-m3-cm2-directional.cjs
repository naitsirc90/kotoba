#!/usr/bin/env node
// Directional M3 regression for the 793 C-M2 trial records. No private data or
// real user progress; tests the exact app functions, not a substitute validator.
const fs=require('node:fs'),path=require('node:path'),zlib=require('node:zlib'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p)),json=p=>JSON.parse(read(p));
const bytes=zlib.gunzipSync(Buffer.concat(Array.from({length:8},(_,i)=>read('assets/data/vocabulary-v318.gz.part'+String(i+1).padStart(2,'0')))));
assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),'228eb559b7bdae108355268e76a973245754d031500e7011615857acc02e377a');
const data=JSON.parse(bytes),entries=data.entries;assert.equal(entries.length,24538);
const manifest=json('assets/data/operational-eligibility.json');
const window={addEventListener(){},removeEventListener(){},__KOTOBA_VOCABULARY__:data,__KOTOBA_OPERATIONAL_ELIGIBILITY__:manifest,__KOTOBA_LEARNING_PRIORITY__:json('assets/data/learning-priority.json'),__KOTOBA_LEGACY_COMPAT__:json('assets/data/legacy-compat.json')};
const document={addEventListener(){},removeEventListener(){},querySelector(s){return s==='#app'?{addEventListener(){},removeEventListener(){}}:null},querySelectorAll(){return []},getElementById(){return null},body:{classList:{add(){}}}};
const localStorage={getItem(){return null},setItem(){},removeItem(){}};
let code=read('app.js').toString('utf8');assert.equal(code.split('\ninit();\n').length,2);
code=code.replace('\ninit();\n','\nvocabulary=EMBEDDED_VOCABULARY.entries;rebuildAnswerEquivalenceIndexes(vocabulary);window.__QA__={isActiveStudySense,buildOptions,questionItem,acceptedAnswers,validateAnswer,normalizeItalian,normalizeJapanese,updateDirectionProgress,defaultDirectionProgress,exercisePrimaryItalian,kotobaIsExcludedDistractorPair,getState:()=>state};\n');
new Function('window','document','localStorage','navigator','setTimeout','clearTimeout','setInterval','clearInterval',code)(window,document,localStorage,{},()=>1,()=>{},()=>1,()=>{});
const q=window.__QA__,targets=entries.filter(e=>e.m2QuizGate==='PENDING_DIRECTIONAL_M3'&&e.m2LicenseGate==='ATTRIBUTION_PREPARED_RELEASE_NOT_AUTHORIZED'),by=new Map(entries.map(e=>[e.id,e]));assert.equal(targets.length,793);
const snapshot=JSON.stringify(q.getState()),quick=process.argv.includes('--quick');
const stats={entries:targets.length,mc:0,own:0,other:0,inherited:0,missing_exclusion_target:0,srs:0,contextual:0,examples_in_runtime:0};
assert.equal(manifest.blockedIdList.length,68);
assert.ok(manifest.blockedIdList.every(i=>!q.isActiveStudySense(by.get(i))));
const labels=new Map();for(const e of entries.filter(q.isActiveStudySense))for(const text of new Set([...e.italian,...(e.alternativeItalian||[])].filter(Boolean))){const k=q.normalizeItalian(text);if(!labels.has(k))labels.set(k,[]);labels.get(k).push({e,text})}
const prefs=q.getState().dictionaryPreferences.translationBySense;
for(const e of targets){
  assert.ok(q.isActiveStudySense(e),e.id);
  if(e.exampleJapanese&&e.exampleItalian)stats.examples_in_runtime++;
  assert.match(e.kana,/^[\u3040-\u309fー\s・]+$/u,e.id);
  for(const id of e.m2InheritedQuizConstraints.m3ExcludedDistractorIds){stats.inherited++;if(!by.has(id))stats.missing_exclusion_target++;assert.ok(q.kotobaIsExcludedDistractorPair(e.id,id)&&q.kotobaIsExcludedDistractorPair(id,e.id),e.id+' inherited exclusion '+id)}
  const initial=q.defaultDirectionProgress(),before=JSON.stringify(initial),now=new Date('2026-11-24T10:00:00Z');
  assert.equal(q.updateDirectionProgress(initial,{result:'correct',exerciseType:'free',now,affectsDailySchedule:false}).progress.masteryScore,12);
  assert.equal(q.updateDirectionProgress(initial,{result:'correct',exerciseType:'mc',now,affectsDailySchedule:true}).progress.masteryScore,8);assert.equal(JSON.stringify(initial),before);stats.srs++;
  for(const c of e.contextualItalianEquivalents||[]){
    if(c.automaticDistractorRejectionAsWrong!==false)continue;
    for(const {e:other,text} of labels.get(q.normalizeItalian(c.italian))||[]){
      if(e.id===other.id)continue;
      prefs[other.id]=text;
      const opts=q.buildOptions([e,other],e,'jpToIt','context:'+e.id+':'+other.id,null);
      delete prefs[other.id];stats.contextual++;
      assert.ok(!opts.some(x=>q.normalizeItalian(x)===q.normalizeItalian(c.italian)),e.id+' contextual distractor '+other.id);
    }
  }
  const forms=[...new Set([e.japanese,e.kana,...e.alternativeJapanese].filter(Boolean))],glosses=[...new Set([...e.italian,...e.alternativeItalian].filter(Boolean))];
  for(const dir of ['itToJp','jpToIt']){
    const norm=dir==='itToJp'?q.normalizeJapanese:q.normalizeItalian,own=dir==='itToJp'?forms:glosses,ownKeys=new Set(own.map(norm));
    for(const prompt of dir==='itToJp'?glosses:[null]){
      for(const x of own){assert.equal(q.validateAnswer(e,dir,x,prompt,dir==='itToJp').result,'correct',e.id+' '+dir+' '+x);stats.own++}
      for(const x of q.acceptedAnswers(e,dir,prompt)){if(ownKeys.has(norm(x)))continue;const r=q.validateAnswer(e,dir,x,prompt,false);assert.equal(r.result,'correct',e.id+' other answer');assert.equal(r.targetDemonstrated,false,e.id+' other sense incorrectly credited');stats.other++}
      assert.equal(q.validateAnswer(e,dir,'__KOTOBA_INVALID_7394__',prompt,false).result,'wrong',e.id+' invalid answer');
      if(!quick&&(prompt===null||prompt===e.italian[0])){
        const item=q.questionItem(e,dir,'mc',entries,'m3-793-20261124:'+e.id,'review',true);
        assert.equal(item.options.length,4,e.id+' option count');assert.equal(new Set(item.options.map(norm)).size,4,e.id+' duplicate options');
        assert.equal(item.options.filter(x=>q.validateAnswer(e,dir,x,item.italianPrompt,false).result==='correct').length,1,e.id+' valid distractor');stats.mc++;
      }
    }
  }
}
assert.equal(JSON.stringify(q.getState()),snapshot,'Synthetic progress changed');
assert.equal(stats.contextual,139);assert.equal(stats.inherited,1382);assert.equal(stats.srs,793);assert.equal(stats.examples_in_runtime,0);assert.equal(stats.own,2973);assert.equal(stats.other,2791);if(!quick)assert.equal(stats.mc,1586);
console.log('PASS C-M2 directional M3 '+JSON.stringify(stats)+'; technical scope only, no example/authorship or store certification');
