#!/bin/bash
# ─────────────────────────────────────────────────────────────
# Setup a simple HTTP Git server using Python + git-http-backend
# Coolify can then use: http://localhost:8088/floradecora-bare.git
# ─────────────────────────────────────────────────────────────

set -e

BARE_REPO="/home/tanveer/floradecora-bare.git"
HTTP_PORT=8088
SCRIPT_DIR="/home/tanveer/git-http-server"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Setting up HTTP Git server on port $HTTP_PORT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if port is free
if ss -tlnp 2>/dev/null | grep -q ":$HTTP_PORT "; then
    echo "✗ Port $HTTP_PORT is already in use. Trying another port..."
    HTTP_PORT=8089
fi

mkdir -p "$SCRIPT_DIR"

# Create the Python HTTP Git server
cat > "$SCRIPT_DIR/server.py" <<'PYEOF'
#!/usr/bin/env python3
"""HTTP Git Smart server for Coolify"""
import subprocess
import os
import sys
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import unquote, parse_qs

GIT_PROJECT_ROOT = "/home/tanveer"
GIT_HTTP_BACKEND = "/usr/lib/git-core/git-http-backend"

class GitHTTPRequestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self._handle("GET")

    def do_POST(self):
        self._handle("POST")

    def _handle(self, method):
        raw_path = unquote(self.path.split("?")[0])
        query_string = self.path.split("?")[1] if "?" in self.path else ""

        # Path: /<repo>.git/info/refs or /<repo>.git/git-receive-pack etc.
        parts = raw_path.lstrip("/").split("/")
        if not parts or not parts[0]:
            self.send_error(404, "No repo specified")
            return

        repo_name = parts[0]
        repo_path = os.path.join(GIT_PROJECT_ROOT, repo_name)

        if not os.path.isdir(repo_path):
            self.send_error(404, f"Repo not found: {repo_path}")
            return

        # Determine service
        if raw_path.endswith("/info/refs"):
            qs = parse_qs(query_string)
            service = qs.get("service", ["git-upload-pack"])[0]
            content_type = f"application/x-{service}-advertisement"
        elif "git-receive-pack" in raw_path:
            service = "git-receive-pack"
            content_type = "application/x-git-receive-pack-result"
        elif "git-upload-pack" in raw_path:
            service = "git-upload-pack"
            content_type = "application/x-git-upload-pack-result"
        else:
            self.send_error(404, f"Unknown endpoint: {raw_path}")
            return

        # Read body
        content_length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_length) if content_length else b""

        # Build env
        env = os.environ.copy()
        env.update({
            "GIT_PROJECT_ROOT": GIT_PROJECT_ROOT,
            "GIT_HTTP_EXPORT_ALL": "1",
            "PATH_INFO": raw_path,
            "REMOTE_USER": "",
            "REMOTE_ADDR": self.client_address[0],
            "CONTENT_TYPE": f"application/x-{service}-request" if method == "POST" else self.headers.get("Content-Type", ""),
            "QUERY_STRING": query_string,
            "REQUEST_METHOD": method,
        })

        try:
            process = subprocess.run(
                [GIT_HTTP_BACKEND],
                input=body,
                capture_output=True,
                env=env,
                cwd=GIT_PROJECT_ROOT,
                timeout=120,
            )
            self.send_response(200)
            self.send_header("Content-Type", content_type)
            self.send_header("Cache-Control", "no-cache")
            self.end_headers()
            self.wfile.write(process.stdout)
        except subprocess.TimeoutExpired:
            self.send_error(504, "Git operation timed out")
        except Exception as e:
            self.send_error(500, str(e))

    def log_message(self, format, *args):
        pass  # Suppress default logging

if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8088
    server = HTTPServer(("0.0.0.0", port), GitHTTPRequestHandler)
    print(f"Git HTTP server on port {port}")
    print(f"  URL: http://localhost:{port}/floradecora-bare.git")
    server.serve_forever()
PYEOF

chmod +x "$SCRIPT_DIR/server.py"

# Kill any existing server
pkill -f "git-http-server" 2>/dev/null || true
pkill -f "server.py" 2>/dev/null || true
sleep 1

# Start the server in background
nohup python3 "$SCRIPT_DIR/server.py" "$HTTP_PORT" > /tmp/git-http-server.log 2>&1 &
echo $! > /tmp/git-http-server.pid

sleep 2

# Test
if ps -p $(cat /tmp/git-http-server.pid) > /dev/null 2>&1; then
    echo "✓ HTTP Git server started on port $HTTP_PORT (PID: $(cat /tmp/git-http-server.pid))"
    echo ""
    echo "Test the server:"
    echo "  curl http://localhost:$HTTP_PORT/floradecora-bare.git/info/refs?service=git-upload-pack"
    echo ""
    echo "In Coolify, use this Git URL:"
    echo "  http://localhost:$HTTP_PORT/floradecora-bare.git"
    echo ""
    echo "The server will keep running. To stop it:"
    echo "  kill \$(cat /tmp/git-http-server.pid)"
else
    echo "✗ Server failed to start. Check /tmp/git-http-server.log"
    cat /tmp/git-http-server.log
    exit 1
fi
