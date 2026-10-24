import {read} from './harness.mjs';
export function modules(){
 const code=['core','references','embedded','domain-boundaries','reference-data','lookalikes','comparisons'].map(n=>read('src/'+n+'.js')).join('\n');
 return new Function('document',code+'\nreturn {I:Inspector,R:ReferenceDomains,E:EmbeddedURLs,F:ReferenceData,L:AutomaticLookalikes,U:UnifiedComparisons};')({getElementById:id=>{if(id!=='unicode-data')throw Error('Unexpected data access');return {textContent:read('data/unicode-data.json')};}});
}
export const assets=()=>({foundationManifestText:read('data/reference-foundation.json'),pslText:read('data/public-suffix/compiled.json'),popularText:read('data/popular-domains/records.json'),indexManifest:JSON.parse(read('data/lookalikes/manifest.json')),indexText:read('data/lookalikes/index.json')});
export const fromBlocks=doc=>({foundationManifestText:doc.getElementById('reference-manifest').textContent,pslText:doc.getElementById('public-suffix-data').textContent,popularText:doc.getElementById('popular-domain-data').textContent,indexManifest:JSON.parse(doc.getElementById('lookalike-manifest').textContent),indexText:doc.getElementById('lookalike-index').textContent});
