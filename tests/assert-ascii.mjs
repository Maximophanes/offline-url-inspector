// Shared assertions used by the unit and DOM suites; fixtures are handwritten.
export function assertASCII(I,c,r,assert,equal){
  assert(r.ok);const observed=r.asciiAmbiguities.flatMap(o=>o.observed);
  if(c.empty)equal(r.asciiAmbiguities.length,0);
  for(const s of c.observed||[])assert(observed.includes(s),'Missing observed '+s);
  for(const s of c.notObserved||[])assert(!observed.includes(s),'Unexpected observed '+s);
  if(c.source)assert(r.asciiAmbiguities.some(o=>o.occurrences.some(p=>p.source===c.source)));
  if(c.ascii)equal(r.ascii,c.ascii);
  if(c.kind)equal(r.comparison?.kind,c.kind);
  if(c.noComparison)equal(r.comparison,null);
  const infos=r.messages.filter(m=>m.code==='ascii-ambiguity');
  equal(infos.length,r.asciiAmbiguities.length?1:0);
  if(infos.length){equal(infos[0].level,'info');assert(infos[0].text.includes('observed'));assert(infos[0].text.includes('alone establish no impersonation'));}
  const warnings=r.messages.filter(m=>m.code==='impersonation');
  equal(warnings.length,c.kind==='visual'?1:0);
  for(const [a,b]of c.substitutions||[]){assert(r.comparison.asciiSubstitutions.some(p=>p.actual===a&&p.expected===b));assert(warnings[0].text.includes('“'+a+'” / “'+b+'”'));}
  for(const code of c.codes||[])assert(r.messages.some(m=>m.code===code),'Suppressed '+code);
  if(c.kind==='exact'){assert(!r.comparison.visual);assert(!r.messages.some(m=>m.code==='mismatch'));}
}
