#!/usr/bin/env python3
"""Current acceptance message inventory; earlier audit artifacts stay immutable."""
import argparse,json,runpy
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
ns=runpy.run_path(str(ROOT/'tools/audit_copy.py'))
ns['collect'].__globals__['SOURCES']+=['src/results-presentation.js','src/automatic-ui.js','src/comparisons.js','src/lookalikes.js','src/reference-data.js','src/domain-boundaries.js','src/embedded.css','src/automatic.css']
inventory=ns['collect']();previous=json.loads((ROOT/'tests/messaging-inventory.json').read_text());inventory.update(applicationVersion='3.3.0 Stage 6 development',review='STAGE6_ACCEPTANCE_REVIEW.md',standard='AGENTS.md',families=previous['families'],dataBoundaries=previous['dataBoundaries'])
for family in inventory['families']:
 if family['id']=='builtin-visual':family['coexistenceReview']='Verified script/code-point identities and sequence evidence; consolidate supported sources without equating distinct proof methods or suppressing independent warnings.'
 if family['id']=='automatic-coverage':family['coexistenceReview']='Scope each limitation to matching, extraction, manual comparison or data readiness; a complete/ineligible mixture is not partial extraction.'
 if family['id']=='advanced-evidence':family['coexistenceReview']='Readable proof methods, identities, scoped exceptions and immutable original text; no serialized state objects or new diagnostic export.'
path=ROOT/'tests/acceptance-inventory.json';p=argparse.ArgumentParser();p.add_argument('--check',action='store_true');args=p.parse_args()
if args.check:
 if not path.exists() or json.loads(path.read_text())!=inventory:raise SystemExit('Acceptance message inventory is stale; review affected families before refreshing.')
 print('Acceptance message inventory matches all 20 reviewed sources.')
else:
 path.write_text(json.dumps(inventory,ensure_ascii=False,indent=2)+'\n');print('Inventoried',len(inventory['families']),'families and',sum(len(x['items']) for x in inventory['sources'].values()),'literal/text candidates across',len(inventory['sources']),'sources.')
