#!/usr/bin/env python3
"""Regenerate fixtures using CPython's independent RFC 3492 codec."""
import json
import pathlib
texts=['café','аmazon','bücher','mañana','例え','テスト','مثال','إختبار','𐐨','ɡoogle','ѕсоре','faß','ā','καλημέρα','한국','日本語','ελ','россия','उदाहरण','বাংলা','abc𝖺','a\u200db','\u3002']
fixtures=[{'text':s,'label':'xn--'+s.encode('punycode').decode('ascii')} for s in texts]
pathlib.Path(__file__).with_name('punycode-reference.json').write_text(json.dumps(fixtures,ensure_ascii=True,indent=2)+'\n')
