#!/usr/bin/env python3
"""
VoyageX Ceylon Travels - Standalone Web & API Server
Serves static web assets and provides real-time REST API with database persistence.
Run with: python server.py
"""

import http.server
import socketserver
import json
import os
import urllib.parse

PORT = 8000
DB_FILE = os.path.join(os.path.dirname(__file__), 'database.json')

class VoyageXHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Enable CORS and disable aggressive caching for dynamic sync
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == '/api/db' or parsed.path == '/api/sync':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            data = self.read_db()
            self.wfile.write(json.dumps(data).encode('utf-8'))
            return
        elif parsed.path == '/api/health':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'status': 'online', 'service': 'VoyageX Server'}).encode('utf-8'))
            return

        # Fallback to serving static files
        super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == '/api/sync' or parsed.path == '/api/db':
            content_length = int(self.headers.get('Content-Length', 0))
            post_body = self.rfile.read(content_length)
            try:
                payload = json.loads(post_body.decode('utf-8'))
                self.write_db(payload)
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'success': True, 'message': 'Database synced successfully'}).encode('utf-8'))
            except Exception as e:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))
            return

        super().do_POST()

    def read_db(self):
        if os.path.exists(DB_FILE):
            try:
                with open(DB_FILE, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except Exception:
                pass
        return {}

    def write_db(self, data):
        with open(DB_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

if __name__ == '__main__':
    import sys
    if sys.platform == 'win32':
        import io
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
        sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    print("==================================================")
    print(">> VoyageX Ceylon Travels Web & API Server Starting")
    print("==================================================")
    print(f"[*] Website Home:     http://localhost:{PORT}/index.html")
    print(f"[*] Tourist Planner:  http://localhost:{PORT}/planner.html")
    print(f"[*] Admin Dashboard:  http://localhost:{PORT}/admin.html")
    print(f"[*] Sample Tour Plan: http://localhost:{PORT}/tour-plan.html?planId=plan_vx_101")
    print("==================================================")
    
    with socketserver.TCPServer(("", PORT), VoyageXHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server gracefully...")
