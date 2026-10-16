#!/usr/bin/env python3
"""Local deployment test server, bound only to loopback at the intended project path."""
import argparse
from http.server import BaseHTTPRequestHandler,ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit

ROOT=Path(__file__).resolve().parents[1]/'site'
parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--port',type=int,default=8765)
args=parser.parse_args()
class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        path=urlsplit(self.path).path
        if path=='/offline-url-inspector':
            self.send_response(301);self.send_header('Location','/offline-url-inspector/');self.end_headers();return
        resources={'/offline-url-inspector/':('index.html','text/html; charset=utf-8'),'/offline-url-inspector/index.html':('index.html','text/html; charset=utf-8'),'/offline-url-inspector/sw.js':('sw.js','text/javascript; charset=utf-8')}
        if path not in resources:
            self.send_error(404);return
        name,mime=resources[path];data=(ROOT/name).read_bytes()
        self.send_response(200);self.send_header('Content-Type',mime);self.send_header('Content-Length',str(len(data)));self.send_header('Cache-Control','no-cache');self.end_headers();self.wfile.write(data)
    def log_message(self,*args): pass # No request/query logging, including test tokens.
print(f'Local test only: http://127.0.0.1:{args.port}/offline-url-inspector/',flush=True)
ThreadingHTTPServer(('127.0.0.1',args.port),Handler).serve_forever()
