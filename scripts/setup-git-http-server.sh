#!/bin/bash
# ─────────────────────────────────────────────────────────────
# Setup local HTTP Git server for Coolify
# This allows Coolify to use a local Git repo via http://
# ─────────────────────────────────────────────────────────────

set -e

BARE_REPO="/home/tanveer/floradecora-bare.git"
PORT=9418  # Git protocol port (or use 8080 for HTTP)

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Setting up local Git server for Coolify"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Install git-daemon if not present
if ! command -v git-daemon &> /dev/null; then
    echo "Installing git-daemon..."
    sudo apt-get update -qq
    sudo apt-get install -y -qq git-daemon 2>/dev/null || true
fi

# Alternative: use Python HTTP server with git-http-backend
# This is more reliable for HTTP access

# Create a wrapper script that serves the bare repo over HTTP
mkdir -p /home/tanveer/git-http-server

cat > /home/tanveer/git-http-server/server.py <<'PYEOF'
#!/usr/bin/env python3
"""Simple HTTP Git server using git-http-backend"""
import subprocess
import sys
import os
from http.server import HTTPServer, BaseHTTPRequestHandler
import urllib.parse

BARE_REPO = "/home/tanveer/floradecora-bare.git"

class GitHTTPHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.run_git_command("upload-pack")
    
    def do_POST(self):
        self.run_git_command("receive-pack")
    
    def run_git_command(self, service):
        path = urllib.parse.unquote(self.path)
        if not path.startswith("/")):
            self.send_error(400)
            return
        
        repo_path = path.lstrip("/").rstrip("/")
        full_path = os.path.join("/home/tanveer", repo_path)
        
        if not os.path.exists(full_path):
            self.send_error(404, f"Repo not found: {full_path}")
            return
        
        # Execute git command
        os.chdir(full_path)
        
        if service == "upload-pack":
            cmd = ["git", "upload-pack", "--stateless-rpc", "."]
        else:
            cmd = ["git", "receive-pack", "--stateless-rpc", "."]
        
        self.send_response(200)
        self.send_header("Content-Type", f"application/x-{service}-result")
        self.send_header("Cache-Control", "no-cache")
        self.end_headers()
        
        # Read request body (for POST)
        content_length = int(self.headers.get("Content-Length", 0))
        input_data = self.rfile.read(content_length) if content_length else b""
        
        try:
            process = subprocess.Popen(
                cmd,
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )
            stdout, stderr = process.communicate(input_data, timeout=30)
            self.wfile.write(stdout)
        except Exception as e:
            self.wfile.write(f"Error: {e}".encode())
    
    def log_message(self, format, *args):
        print(f"[Git Server] {self.address_string()} - {format % args}")

if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
    server = HTTPServer(("0.0.0.0", port), GitHTTPHandler)
    print(f"Git HTTP server running on port {port}")
    print(f"Available repos:")
    print(f"  http://localhost:{port}/floradecora-bare.git")
    server.serve_forever()
PYEOF

chmod +x /home/tanveer/git-http-server/server.py

echo "✓ Server script created"
echo ""
echo "To start the server, run:"
echo "  python3 /home/tanveer/git-http-server/server.py 8080"
echo ""
echo "Then in Coolify, use this URL:"
echo "  http://localhost:8080/floradecora-bare.git"
