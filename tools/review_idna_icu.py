#!/usr/bin/env python3
"""Optional independent UTS #46 diagnostic using an installed ICU C library.

Example (macOS/Homebrew ICU 78):
python3 tools/review_idna_icu.py --library /opt/homebrew/opt/icu4c/lib/libicuuc.78.dylib --suffix 78
Does not download anything or modify application data. Writes its own test report.
"""
import argparse
import ctypes
import ctypes.util
import json
import pathlib

parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--library',default=ctypes.util.find_library('icuuc'))
parser.add_argument('--suffix',default='78',help='ICU symbol suffix, e.g. 78; empty for unrenamed symbols')
args=parser.parse_args()
if not args.library:
    raise SystemExit('ICU library unavailable. Supply --library; do not count this probe as executed.')
lib=ctypes.CDLL(args.library)
def symbol(name): return getattr(lib,name+('_'+args.suffix if args.suffix else ''))
class Info(ctypes.Structure):
    _fields_=[('size',ctypes.c_int16),('transitionalDifferent',ctypes.c_int8),('reservedB3',ctypes.c_int8),('errors',ctypes.c_uint32),('reservedI2',ctypes.c_int32),('reservedI3',ctypes.c_int32)]
op=symbol('uidna_openUTS46');op.argtypes=[ctypes.c_uint32,ctypes.POINTER(ctypes.c_int)];op.restype=ctypes.c_void_p
convert=symbol('uidna_nameToASCII_UTF8');convert.argtypes=[ctypes.c_void_p,ctypes.c_char_p,ctypes.c_int32,ctypes.c_char_p,ctypes.c_int32,ctypes.POINTER(Info),ctypes.POINTER(ctypes.c_int)];convert.restype=ctypes.c_int32
close=symbol('uidna_close');close.argtypes=[ctypes.c_void_p]
get_version=symbol('u_getVersion');version=(ctypes.c_uint8*4)();get_version(version)
err=ctypes.c_int();handle=op(4|8|16,ctypes.byref(err)) # CHECK_BIDI, CHECK_CONTEXTJ, NONTRANSITIONAL_TO_ASCII
if err.value>0 or not handle: raise SystemExit('ICU initialization failed: '+str(err.value))
root=pathlib.Path(__file__).resolve().parents[1]
findings=json.loads((root/'tests/idna-v2-findings.json').read_text())['differences']
out=[]
try:
    for f in findings:
        info=Info();info.size=ctypes.sizeof(Info);dest=ctypes.create_string_buffer(2048);err=ctypes.c_int();source=f['source'].encode()
        n=convert(handle,source,len(source),dest,len(dest),ctypes.byref(info),ctypes.byref(err))
        actual=dest.value.decode();out.append({'line':f['line'],'expected':f['expected'],'actual':actual,'icuError':err.value,'idnaErrors':info.errors,'passed':actual==f['expected'] and err.value<=0 and info.errors==0})
finally:
    close(handle)
report={'suite':'independent ICU UTS 46 review','icuVersion':'.'.join(map(str,version)),'options':28,'library':args.library,'findings':out,'total':{'executed':len(out),'passed':sum(x['passed'] for x in out),'failed':sum(not x['passed'] for x in out)}}
report['assertions']=dict(report['total'])
(root/'tests/idna-icu-results.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({'icuVersion':report['icuVersion'],'total':report['total']},indent=2))
if report['total']['failed']: raise SystemExit(1)
