#!/usr/bin/env python3
"""Inventory source literals/HTML copy; the human review is in COPY_AUDIT.md.

This deliberately includes code/data literals, not just guessed English prose.
It is a traceability aid, not a JavaScript parser or an automated writing verdict.
"""
import argparse
import ast
import hashlib
from html.parser import HTMLParser
import io
import json
from pathlib import Path
import re
import tokenize

ROOT=Path(__file__).resolve().parents[1]
SOURCES=['src/template.html','src/presentation.js','src/ui.js','src/references.js','src/core.js','src/embedded.js','src/embedded-ui.js','src/hosted.js','src/sw.js','tools/build.py','src/base.css','src/v3.css']
class MarkupCopy(HTMLParser):
    def __init__(self): super().__init__(); self.items=[]
    def handle_data(self,data):
        text=data.strip()
        if text:self.items.append({'line':self.getpos()[0],'kind':'markup text','text':text})
    def handle_starttag(self,tag,attrs):
        for key,value in attrs:
            if key in {'aria-label','title','placeholder','alt'} and value:
                self.items.append({'line':self.getpos()[0],'kind':key,'text':value})
def collect():
    result={}
    for name in SOURCES:
        source=(ROOT/name).read_text();items=[]
        if name.endswith('.html'):
            parser=MarkupCopy();parser.feed(source);items=parser.items
        elif name.endswith('.py'):
            for token in tokenize.generate_tokens(io.StringIO(source).readline):
                if token.type==tokenize.STRING:
                    try:text=ast.literal_eval(token.string)
                    except (ValueError,SyntaxError):text=token.string
                    if isinstance(text,str) and text:items.append({'line':token.start[0],'kind':'Python string literal (includes tool-only text)','text':text})
        elif name.endswith('.css'):
            for line,text in enumerate(source.splitlines(),1):
                for match in re.finditer(r'content\s*:\s*("(?:\\.|[^"\\])*"|\x27(?:\\.|[^\x27\\])*\x27)',text):
                    items.append({'line':line,'kind':'CSS generated content','text':match.group(1)})
        else:
            # Browser prose is single-line source literals; \n escapes stay exact.
            for line,text in enumerate(source.splitlines(),1):
                if text.lstrip().startswith('//'):continue
                for match in re.finditer(r'"(?:\\.|[^"\\])*"|\x27(?:\\.|[^\x27\\])*\x27',text):
                    value=match.group(0)[1:-1]
                    if value:items.append({'line':line,'kind':'JavaScript literal candidate (includes code/data)','text':value})
        result[name]={'sha256':hashlib.sha256(source.encode()).hexdigest(),'items':items}
    data={}
    for name in ['data/LICENSE.txt','data/unicode-data.json']:
        data[name]={'sha256':hashlib.sha256((ROOT/name).read_bytes()).hexdigest(),'disposition':'Preserved technical/legal dataset; not rewritten as prose.'}
    return {'applicationVersion':'3.2.0','review':'COPY_AUDIT.md','standard':'EDITORIAL_STYLE_GUIDE.md','scope':'All runtime-copy source files, HTML attributes, CSS generated content and build substitutions. Candidates include non-copy tokens; the family matrix records editorial decisions.','sources':result,'dataBoundaries':data}
def main():
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--check',action='store_true');args=parser.parse_args()
    path=ROOT/'tests/copy-inventory.json';inventory=collect()
    if args.check:
        if not path.exists() or json.loads(path.read_text())!=inventory:raise SystemExit('Copy inventory is stale. Review changed families and run python3 tools/audit_copy.py.')
        print('Copy inventory matches all reviewed sources.');return
    path.write_text(json.dumps(inventory,ensure_ascii=False,indent=2)+'\n')
    print('Inventoried '+str(sum(len(s['items']) for s in inventory['sources'].values()))+' literal/text candidates across '+str(len(SOURCES))+' source files.')
if __name__=='__main__':main()
