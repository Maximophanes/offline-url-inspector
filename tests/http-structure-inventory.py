#!/usr/bin/env python3
"""Current HTTP/structure inventory; earlier audit artifacts stay immutable."""
import argparse,json,runpy
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
ns=runpy.run_path(str(ROOT/'tools/audit_copy.py'))
ns['collect'].__globals__['SOURCES']+=['src/results-presentation.js','src/automatic-ui.js','src/comparisons.js','src/lookalikes.js','src/reference-data.js','src/domain-boundaries.js','src/embedded.css','src/automatic.css']
inventory=ns['collect']();previous=json.loads((ROOT/'tests/acceptance-inventory.json').read_text());inventory.update(applicationVersion='3.3.0 Stage 6 development',review='STAGE6_HTTP_STRUCTURE_REVIEW.md',standard='AGENTS.md',families=previous['families'],dataBoundaries=previous['dataBoundaries'])
for family in inventory['families']:
 if family['id']=='builtin-visual':family['coexistenceReview']='Concise differing-character/script evidence, independently verified positional pairs or bounded sequence/whole-name explanation; code points remain technical. Readable Unicode has a textual identity cue; supported sources/methods survive consolidation.'
 if family['id']=='automatic-coverage':family['coexistenceReview']='Scope each limitation to matching, extraction, manual comparison or data readiness; a complete/ineligible mixture is not partial extraction.'
 if family['id']=='advanced-evidence':family['coexistenceReview']='Readable proof methods, identities, scoped exceptions and immutable original text; no serialized state objects or new diagnostic export.'
for family in inventory['families']:
 if 'embedded' in family['id']:family['coexistenceReview']='Consolidate embedded identity evidence per hostname; retain independent transport cautions with explicit host/scope. Skip represented hostnames in additional-host summaries. Occurrence/parent/source proof stays deliberate.'
 if 'structure' in family['id'] or 'syntax' in family['id']:family['coexistenceReview']='Text before @ is outside the actual hostname. Do not infer sign-in or expose userinfo. Strong syntax caution survives stronger visual findings.'
for family in inventory['families']:
 family['priorityPresentationReview']='Every independent caution keeps its semantic class and visible secondary caution label/rule, regardless of ordering; no security-warning cap. Weak informational comparisons and coverage limitations keep distinct neutral treatment. Equivalent embedded findings remain consolidated.'
for family in inventory['families']:
 family['stressReview']='Preserve scoped identity grouping, one generic advice location, direct @ explanations, Unicode/Punycode context and informational ports. Independent transport cautions remain visible. The versioned tenant-edge matching policy is unchanged; limits and weak information remain distinct.'
for family in inventory['families']:
 family['httpStructureReview']='Independent transport cautions retain warning treatment beside stronger hostname findings; repeated HTTP observations consolidate by actual hostname and source scope. Structural wording explains domain identity without ordinary PSL terminology; exact boundary/rule details stay technical. No matching, priorities, data, ports, disclosure or privacy changes.'
path=ROOT/'tests/http-structure-inventory.json';p=argparse.ArgumentParser();p.add_argument('--check',action='store_true');args=p.parse_args()
if args.check:
 if not path.exists() or json.loads(path.read_text())!=inventory:raise SystemExit('HTTP/structure message inventory is stale; review affected families before refreshing.')
 print('HTTP/structure message inventory matches all 20 reviewed sources.')
else:
 path.write_text(json.dumps(inventory,ensure_ascii=False,indent=2)+'\n');print('Inventoried',len(inventory['families']),'families and',sum(len(x['items']) for x in inventory['sources'].values()),'literal/text candidates across',len(inventory['sources']),'sources.')
