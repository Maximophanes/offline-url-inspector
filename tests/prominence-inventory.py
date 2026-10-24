#!/usr/bin/env python3
"""Current followup message inventory; earlier audit artifacts stay immutable."""
import argparse,json,runpy
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
ns=runpy.run_path(str(ROOT/'tools/audit_copy.py'))
ns['collect'].__globals__['SOURCES']+=['src/results-presentation.js','src/automatic-ui.js','src/comparisons.js','src/lookalikes.js','src/reference-data.js','src/domain-boundaries.js','src/embedded.css','src/automatic.css']
inventory=ns['collect']();previous=json.loads((ROOT/'tests/acceptance-inventory.json').read_text());inventory.update(applicationVersion='3.3.0 Stage 6 development',review='STAGE6_PROMINENCE_REVIEW.md',standard='AGENTS.md',families=previous['families'],dataBoundaries=previous['dataBoundaries'])
for family in inventory['families']:
 if family['id']=='builtin-visual':family['coexistenceReview']='Concise differing-character/script evidence, independently verified positional pairs or bounded sequence/whole-name explanation; code points remain technical. Readable Unicode has a textual identity cue; supported sources/methods survive consolidation.'
 if family['id']=='automatic-coverage':family['coexistenceReview']='Scope each limitation to matching, extraction, manual comparison or data readiness; a complete/ineligible mixture is not partial extraction.'
 if family['id']=='advanced-evidence':family['coexistenceReview']='Readable proof methods, identities, scoped exceptions and immutable original text; no serialized state objects or new diagnostic export.'
for family in inventory['families']:
 if 'embedded' in family['id']:family['coexistenceReview']='One ordinary finding per embedded hostname, preserving independent warnings/targets and scoped limits; skip names already shown in primary or secondary findings when building the additional-host summary. Occurrence/parent/source proof stays deliberate.'
 if 'structure' in family['id'] or 'syntax' in family['id']:family['coexistenceReview']='Text before @ is outside the actual hostname. Do not infer sign-in or expose userinfo. Strong syntax caution survives stronger visual findings.'
for family in inventory['families']:
 family['priorityPresentationReview']='Every independent caution keeps its semantic class and visible secondary caution label/rule, regardless of ordering; no security-warning cap. Weak informational comparisons and coverage limitations keep distinct neutral treatment. Equivalent embedded findings remain consolidated.'
path=ROOT/'tests/prominence-inventory.json';p=argparse.ArgumentParser();p.add_argument('--check',action='store_true');args=p.parse_args()
if args.check:
 if not path.exists() or json.loads(path.read_text())!=inventory:raise SystemExit('Prominence message inventory is stale; review affected families before refreshing.')
 print('Prominence message inventory matches all 20 reviewed sources.')
else:
 path.write_text(json.dumps(inventory,ensure_ascii=False,indent=2)+'\n');print('Inventoried',len(inventory['families']),'families and',sum(len(x['items']) for x in inventory['sources'].values()),'literal/text candidates across',len(inventory['sources']),'sources.')
