#!/usr/bin/env python3
"""Simple HTTP Git Smart server using git-http-backend"""
import subprocess
import os
import sys
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import unquote, parse_qs

GIT_PROJECT_ROOT = "/home/tanveer"
GIT_HTTP_BACKEND = "/usr/lib/git-core/git-http-backend"

class GitHTTPRequestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.handle_request("upload-pack")

    def do_POST(self):
        self.handle_request("receive-pack")

    def handle_request(self, default_service):
        path = unquote(self.path.split("?")[0])

        # Extract repo path
        # URL format: /<repo-name>.git/info/refs or /<repo-name>.git/git-receive-pack
        repo_path = path.lstrip("/").split("/")[0]
        full_repo = os.path.join(GIT_PROJECT_ROOT, repo_path)

        if not os.path.isdir(full_repo):
            self.send_error(404, f"Repo not found: {full_repo}")
            return

        # Get content type based on path
        if path.endswith("/info/refs"):
            content_type = f"application/x-{default_service}-advertisement"
            service = default_service
        elif path.endswith(f"/git-{default_service}"):
            content_type = f"application/x-{default_service}-result"
            service = default_service
        else:
            self.send_error(404)
            return

        # Get service name from query params for /info/refs
        if path.endswith("/info/refs"):
            qs = parse_qs(self.path.split("?")[1] if "?" in self.path else "")
            service = qs.get("service", [default_service])[0]

        # Read POST body if any
        content_length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_length) if content_length else b""

        # Run git-http-backend
        env = os.environ.copy()
        env.update({
            "GIT_PROJECT_ROOT": GIT_PROJECT_ROOT,
            "GIT_HTTP_EXPORT_ALL": "1",
            "PATH_INFO": path,
            "REMOTE_USER": "",
            "REMOTE_ADDR": self.client_address[0],
            "CONTENT_TYPE": self.headers.get("Content-Type", ""),
            "QUERY_STRING": self.path.split("?")[1] if "?" in self.path else "",
            "REQUEST_METHOD": self.command,
            "HTTP_CONTENT_ENCODING": self.headers.get("Content-Encoding", ""),
        })

        try:
            process = subprocess.run(
                [GIT_HTTP_BACKEND],
                input=body,
                capture_output=True,
                env=env,
                cwd=GIT_PROJECT_ROOT,
                timeout=60,
            )

            self.send_response(200)
            self.send_header("Content-Type", content_type)
            self.send_header("Cache-Control", "no-cache")
            self.end_headers()
            self.wfile.write(process.stdout)
        except Exception as e:
            self.send_error(500, str(e))

    def log_message(self, format, *args):
        print(f"[{self.client_address[0]}] {format % args}")

if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
    server = HTTPServer(("0.0.0.0", port), GitHTTPRequestHandler)
    print(f"✓ Git HTTP server listening on port {port}")
    print(f"  Test: curl http://localhost:{port}/floradecora-bare.git/info/refs?service=git-upload-pack")
    server.serve_forever()
