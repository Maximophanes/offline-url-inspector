#!/usr/bin/env python3
"""Deterministic, offline builder. Python 3.10+, standard library only."""
import hashlib
import json
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parents[1]
DATA = ROOT / 'data'

def rows(name):
    for line in (DATA / name).read_text(encoding='utf-8').splitlines():
        line = line.split('#')[0].strip()
        if line:
            yield [x.strip() for x in line.split(';')]

def bounds(value):
    pair = value.split('..')
    return int(pair[0], 16), int(pair[-1], 16)

def ranges(name, value=lambda x: x[1]):
    return sorted([[*bounds(r[0]), value(r)] for r in rows(name)])

def compact(values):
    out = []
    for i, v in enumerate(values):
        if out and out[-1][2] == v and out[-1][1] == i - 1:
            out[-1][1] = i
        else:
            out.append([i, i, v])
    return out

def chars(s):
    return ''.join(chr(int(c, 16)) for c in s.split())

def build():
    manifest = json.loads((DATA / 'manifest.json').read_text())
    assert manifest['version'] == '18.0.0'
    for f in manifest['files']:
        actual = hashlib.sha256((DATA / f['name']).read_bytes()).hexdigest()
        if actual != f['sha256']:
            raise ValueError('Checksum mismatch: ' + f['name'])
    d = {'version': '18.0.0', 'sources': manifest['files']}
    d['confusables'] = {str(int(r[0], 16)): chars(r[1]) for r in rows('confusables.txt')}
    d['scripts'] = ranges('Scripts.txt')
    d['extensions'] = ranges('ScriptExtensions.txt', lambda r: r[1].split())
    aliases = {r[2]: r[1] for r in rows('PropertyValueAliases.txt') if r[0] == 'sc'}
    d['scriptNames'] = {short: long for long, short in aliases.items()}
    d['scripts'] = [[a,b,aliases[v]] for a,b,v in d['scripts']]
    d['ignorables'] = [[*bounds(r[0]),True] for r in rows('DerivedCoreProperties.txt') if r[1] == 'Default_Ignorable_Code_Point']
    d['names'], d['nameRanges'], d['decomposition'], d['ccc'] = {}, [], {}, {}
    categories = ['Cn'] * 0x110000
    start = None
    for r in rows('UnicodeData.txt'):
        c = int(r[0], 16)
        if r[1].endswith(', First>'):
            start = (c, r)
            continue
        if r[1].endswith(', Last>'):
            a, first = start
            d['nameRanges'].append([a,c,first[1][1:-8]])
            categories[a:c+1] = [r[2]] * (c-a+1)
            continue
        d['names'][str(c)] = r[10] if r[1] == '<control>' and r[10] else r[1]
        categories[c] = r[2]
        if int(r[3]): d['ccc'][str(c)] = int(r[3])
        if r[5] and not r[5].startswith('<'):
            d['decomposition'][str(c)] = [int(x,16) for x in r[5].split()]
    d['categories'] = compact(categories)
    # Default bidi values for unassigned RTL ranges matter too.
    bidi = ['L'] * 0x110000
    long_bidi = {'Left_To_Right':'L','Right_To_Left':'R','Arabic_Letter':'AL','European_Terminator':'ET'}
    text = (DATA / 'DerivedBidiClass.txt').read_text()
    for rg, v in re.findall(r'@missing:\s*([0-9A-F.]+);\s*(\w+)', text):
        a,b=bounds(rg); bidi[a:b+1]=[long_bidi[v]]*(b-a+1)
    for r in rows('DerivedBidiClass.txt'):
        a,b=bounds(r[0]); bidi[a:b+1]=[r[1]]*(b-a+1)
    d['bidi'] = compact(bidi)
    d['idna'] = ranges('IdnaMappingTable.txt', lambda r: [r[1],chars(r[2]) if len(r)>2 and r[2] else ''])
    packed = json.dumps(d, ensure_ascii=True, separators=(',', ':')).replace('<', '\\u003c')
    (DATA / 'unicode-data.json').write_text(packed)
    (DATA / 'unicode-data.sha256').write_text(hashlib.sha256(packed.encode()).hexdigest()+'\n')
    print('Derived Unicode data regenerated from reviewed pinned source files.')

if __name__ == '__main__':
    import argparse
    parser=argparse.ArgumentParser(description='Explicit development-only regeneration after a reviewed Unicode update. Ordinary builds preserve existing bytes.')
    parser.add_argument('--reviewed', action='store_true')
    args=parser.parse_args()
    if not args.reviewed: parser.error('Review source versions, mappings, specification changes and manifest hashes, then pass --reviewed.')
    build()
