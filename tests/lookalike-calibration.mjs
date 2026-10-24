import {writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {root,prepared,sha,read} from '../tools/lookalike_data_lib.mjs';
import {calibrationCorpus} from './lookalike-corpus.mjs';
const env=await prepared({clock:()=>0}),corpus=calibrationCorpus(env);
const counts={exactMembership:0,unicodeVisual:0,asciiVisual:0,structural:0,spellingOnly:0,spellingEvidence:0,multipleReferences:0,unsupportedOrIncomplete:0,potentialProminentVisual:0};
const examples={visual:[],spelling:[],structural:[],incomplete:[]},work={maxCandidateIds:0,maxVerifiedPairs:0,maxSpellingStates:0};
const finite=[['rn','m'],['vv','w'],['I','l','1'],['O','o','0'],['cl','d'],['5','s'],['2','z'],['8','b']];
let canonicalEquivalent=true;
for(const row of corpus.rows){
 const r=env.engine.compare(row.sourceHostname),canonical=env.engine.compare(row.hostname),classes=new Set(r.findings.flatMap(f=>f.evidence.map(e=>e.class)));
 if(JSON.stringify(r.findings.map(f=>[f.reference.domain,f.evidence.filter(e=>e.class!=='structural')]))!==JSON.stringify(canonical.findings.map(f=>[f.reference.domain,f.evidence.filter(e=>e.class!=='structural')])))canonicalEquivalent=false;
 if(r.exact)counts.exactMembership++;
 if(classes.has('unicode-visual'))counts.unicodeVisual++;
 if(classes.has('ascii-visual'))counts.asciiVisual++;
 if(classes.has('structural'))counts.structural++;
 if(classes.has('spelling'))counts.spellingEvidence++;
 if(classes.size===1&&classes.has('spelling'))counts.spellingOnly++;
 if(r.findings.length>1)counts.multipleReferences++;
 if(r.status!=='complete'){counts.unsupportedOrIncomplete++;if(examples.incomplete.length<30)examples.incomplete.push({row,status:r.status,coverage:r.coverage,limitations:r.limitations});}
 if(classes.has('unicode-visual')||classes.has('ascii-visual')){counts.potentialProminentVisual++;examples.visual.push({row,findings:r.findings});}
 if(classes.has('spelling'))examples.spelling.push({row,findings:r.findings});
 if(classes.has('structural'))examples.structural.push({row,findings:r.findings});
 for(const f of r.findings)for(const e of f.evidence){
   if(e.class==='ascii-visual'&&!e.mechanism.substitutions.every(p=>finite.some(group=>group.includes(p.actual)&&group.includes(p.expected)&&p.actual!==p.expected)))throw Error('Unexplained finite visual finding');
   if(e.class==='unicode-visual'&&(env.I.skeleton(e.mechanism.actualReadable)!==e.mechanism.skeleton||env.I.skeleton(e.mechanism.referenceReadable)!==e.mechanism.skeleton))throw Error('Unreproducible Unicode finding');
   if(e.class==='spelling'&&(f.reference.globalRank>1000||e.priority!=='low'||e.mechanism.distance!==1))throw Error('Unrestricted spelling');
 }
 work.maxCandidateIds=Math.max(work.maxCandidateIds,r.work.candidateIds);work.maxVerifiedPairs=Math.max(work.maxVerifiedPairs,r.work.verifiedPairs);work.maxSpellingStates=Math.max(work.maxSpellingStates,r.work.spellingStates);
}
const percentage=100*counts.potentialProminentVisual/corpus.rows.length;
const report={suite:'Stage 3 disjoint Majestic calibration',corpus:corpus.identity,indexSHA256:env.manifest.index.sha256,engineSourceSHA256:sha(read('src/lookalikes.js')),scope:'10000 distinct non-reference registrable domains, evaluated using original source hostnames and canonical equivalents. No benign/malicious ground truth, destination visits or ownership verification. Clock disabled here for deterministic algorithm coverage; real cooperative timing is separately benchmarked.',counts,work,canonicalEquivalent,potentialProminentVisualPercent:percentage,provisionalTargetPercent:.1,targetMet:percentage<=.1,examples,interpretation:'All visual candidates are conservatively counted as potentially unwanted. This is a corpus notice rate, not a real-world false-positive rate or phishing accuracy. No targets removed and no pair suppression registry added.'};
writeFileSync(resolve(root,'tests/lookalike-calibration-results.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({...report,examples:{visual:examples.visual.map(v=>({domain:v.row.hostname,references:v.findings.map(f=>f.reference.domain)})),spelling:examples.spelling.map(v=>({domain:v.row.hostname,references:v.findings.map(f=>f.reference.domain)})),incomplete:examples.incomplete}},null,2));
if(counts.exactMembership||counts.unsupportedOrIncomplete||!canonicalEquivalent||!report.targetMet||work.maxCandidateIds>32||work.maxVerifiedPairs>32||work.maxSpellingStates>4096)Deno.exit(1);
