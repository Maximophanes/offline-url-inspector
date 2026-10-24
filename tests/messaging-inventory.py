#!/usr/bin/env python3
"""Trace all runtime message candidates, plus reviewed trigger/evidence families."""
import argparse,hashlib,json,runpy
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
ns=runpy.run_path(str(ROOT/'tools/audit_copy.py'))
ns['collect'].__globals__['SOURCES']+=['src/results-presentation.js','src/automatic-ui.js','src/comparisons.js','src/lookalikes.js','src/reference-data.js','src/domain-boundaries.js','src/embedded.css','src/automatic.css']
# Candidate strings are a completeness aid, not a parser or a prose verdict.
# Dynamic phrases and co-occurrences are reviewed by family and tested in DOM.
families=[
 ['input-errors','invalid/empty/too long/scheme/parse','Inspector.ok/messages','error','all comparisons; parsing failure wins'],
 ['hostname-attribution','decode/DNS/unreliable original','original/decodeError/diagnostic codes','caution','strong matches; unreliable identity wins'],
 ['URL-structure','userinfo/invisible/backslash/HTTP/port','original messages and components','finding/information','exact identities do not suppress warnings'],
 ['expected-exact','explicit canonical identity','comparison.exact','neutral finding','automatic/embedded warnings can outrank it'],
 ['expected-other','visual/structure/spelling/different/invalid/unavailable','expected/comparison/expectedError','finding/limitation/error','saved and built-in sources remain independent'],
 ['saved-exact-subdomain','saved full identity or label relationship','ReferenceDomains exact/subdomains','neutral finding','unsupported database must not obscure success'],
 ['saved-visual-structure-spelling','actual supported relationship','ReferenceDomains visual/embedded/spelling','finding/information','label the actual matching reference; preserve low spelling importance'],
 ['saved-nonmatch','no supported match after completed applicable comparisons','checked/totalMatches/unavailable and exact-only eligibility','information in details','unrelated reference creates no threat; distinguish exact-only and unavailable'],
 ['builtin-exact','exact/shared registrable membership','automatic.exact','neutral raw evidence','independent visual collision may remain a warning'],
 ['builtin-visual','Unicode or finite ASCII proof','automatic.findings.evidence','caution','exact manual or personal identity cannot erase it'],
 ['builtin-structure','complete labels before actual registrable boundary','structural mechanism and pinned PSL','caution','PRIVATE boundaries; no ownership claim'],
 ['builtin-spelling','restricted distance-one match','spelling mechanism/rank tier','information','no visual or maliciousness inference'],
 ['embedded-findings','reliable recovered host or noteworthy warning','candidates/occurrences/provenance/analyses','finding/information','scope is text evidence, never verified navigation'],
 ['embedded-uncertainty','uncertain/relative/unsupported/limited extraction','typed candidates and scoped limitations','limitation','positives survive; no completed negative on partial discovery'],
 ['automatic-coverage','unsupported/partial/unavailable/incompatible/budget','data readiness, per-class state, scoped limits','limitation','independent successful comparisons survive'],
 ['completed-negative','no findings and completed eligible checks','settled complete coverage','neutral finding','not safety; absent references create no report'],
 ['asynchronous-failure','pending, stale generation, processing failure','generation and exception paths','progress/error','no reassuring interim result, no focus jump'],
 ['advanced-evidence','explicit technical/raw/source reveal','unchanged original objects and current comparison objects','evidence','each evidence family has one display; raw records preserve full status/proofs'],
 ['characters-normalization','distinct forms or consequential characters','original/readable/code points/IDNA/UTS39','evidence','ordinary ASCII possibilities are raw observations, not findings'],
 ['reference-management','CRUD/import/export/clear/validation','store revision, reviewed plan and confirmation','success/information/error','no implied disk-save or durable file-storage claim'],
 ['reference-storage','healthy/session/protected/conflict/migration/write failure','store mode/status/blocked','information/error','inspection works independently; protected bytes preserved'],
 ['offline-updates','cache verification/install/update/recovery','hosted verified worker replies','status/error','application copy, never inspected-site status'],
 ['help-legal-sources','explicit help/license/source access','pinned notices, scope and capabilities','help/provenance','no obsolete manual-only policy; licenses outside per-URL findings']
]
inventory=ns['collect']();inventory.update(applicationVersion='3.3.0 Stage 6 development',review='STAGE6_MESSAGING_REVIEW.md',standard='AGENTS.md',families=[dict(zip(['id','trigger','evidence','importance','coexistenceReview'],f)) for f in families])
for name in ['data/popular-domains/NOTICE.txt','data/public-suffix/NOTICE.txt','data/public-suffix/LICENSE.txt','data/lookalikes/NOTICE.txt']:
 inventory['dataBoundaries'][name]={'sha256':hashlib.sha256((ROOT/name).read_bytes()).hexdigest(),'disposition':'Exact legal/provenance text retained outside per-URL findings; not editorially rewritten.'}
path=ROOT/'tests/messaging-inventory.json';p=argparse.ArgumentParser();p.add_argument('--check',action='store_true');args=p.parse_args()
if args.check:
 if not path.exists() or json.loads(path.read_text())!=inventory:raise SystemExit('Messaging inventory changed; review affected families before refreshing.')
 print('Messaging inventory matches reviewed sources and families.')
else:
 path.write_text(json.dumps(inventory,ensure_ascii=False,indent=2)+'\n');print('Inventoried',len(families),'families and',sum(len(v['items']) for v in inventory['sources'].values()),'literal/text candidates across',len(inventory['sources']),'sources.')
