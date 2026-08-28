#!/bin/bash
# ─────────────────────────────────────────────────────────────
# Setup local HTTP Git server for Coolify (Simplified)
# Uses Python to serve the bare Git repo over HTTP
# ─────────────────────────────────────────────────────────────

set -e

BARE_REPO="/home/tanveer/floradecora-bare.git"
HTTP_PORT=8080

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Setting up local Git HTTP server"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Method 1: Use git daemon (Git's built-in server)
# This is the simplest and most reliable
echo "Starting git daemon on port $HTTP_PORT..."

# Kill any existing git daemon
pkill -f "git daemon" 2>/dev/null || true
sleep 1

# Start git daemon in background
nohup git daemon --reuseaddr --verbose --port=$HTTP_PORT --base-path=/home/tanveer --export-all \
  > /tmp/git-daemon.log 2>&1 &
echo $! > /tmp/git-daemon.pid

sleep 2

# Verify it's running
if ps -p $(cat /tmp/git-daemon.pid) > /dev/null 2>&1; then
    echo "✓ Git daemon started on port $HTTP_PORT (PID: $(cat /tmp/git-daemon.pid))"
    echo ""
    echo "Your Coolify Git URL:"
    echo "  git://localhost:$HTTP_PORT/floradecora-bare.git"
    echo "  or: http://localhost:$HTTP_PORT/floradecora-bare.git"
else
    echo "✗ Git daemon failed to start. Check /tmp/git-daemon.log"
    cat /tmp/git-daemon.log
    exit 1
fi
