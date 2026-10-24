// Reproducible disjoint calibration data, not ground-truth benign/malicious labels.
import {read,json,sha} from '../tools/lookalike_data_lib.mjs';
export function calibrationCorpus({foundation}){
  const pin=json('tests/data/lookalikes/calibration-source.json'),raw=read('tests/data/lookalikes/calibration-source.csv'),text=raw.toString(),lines=text.split('\n');
  if(pin.schemaVersion!==1||pin.originalSourceSHA256!==foundation.sourceSHA256||pin.firstRank!==10001||pin.lastRank!==25000||pin.rows!==15000||raw.length!==pin.bytes||sha(raw)!==pin.sha256||lines.shift()!=='GlobalRank,Domain'||lines.pop()!==''||lines.length!==15000)throw Error('Corrupt/truncated calibration input');
  const references=new Set(foundation.records.map(r=>r[0])),seen=new Set(),rows=[],exclusions={};let overlap=0,duplicates=0,processed=0;
  for(const [i,line]of lines.entries()){
    const fields=line.split(',');if(fields.length!==2||fields[0]!==String(i+10001)||!fields[1]||/["\r]/.test(line))throw Error('Malformed calibration rank/domain');
  }
  for(const line of lines){
    const [rank,hostname]=line.split(','),evidence=foundation.boundaries.lookup(hostname);processed++;
    if(evidence.status!=='ok'){exclusions[evidence.status]=(exclusions[evidence.status]||0)+1;continue;}
    if(references.has(evidence.registrableDomain)){overlap++;continue;}
    if(seen.has(evidence.registrableDomain)){duplicates++;continue;}
    seen.add(evidence.registrableDomain);rows.push({rank:Number(rank),sourceHostname:hostname,hostname:evidence.registrableDomain});
    if(rows.length===10000)break;
  }
  if(rows.length!==10000)throw Error('Incomplete disjoint corpus');
  return {rows,identity:{sourceSHA256:pin.originalSourceSHA256,inputSHA256:pin.sha256,normalizedCorpusSHA256:sha(JSON.stringify(rows)),inputRows:15000,processedRows:processed,lastProcessedRank:rows.at(-1).rank,excluded:exclusions,referenceOverlap:overlap,duplicates,distinctDisjointDomains:rows.length,labels:'No definitive benign/malicious classification'}};
}
