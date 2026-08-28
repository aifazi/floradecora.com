#!/bin/bash
# ─────────────────────────────────────────────────────────────
# Setup auto-deploy webhook for Coolify
# When you commit to local main, this triggers a Coolify deploy
# ─────────────────────────────────────────────────────────────

set -e

PROJECT_DIR="/home/tanveer/floradecora.com"
BARE_REPO="/home/tanveer/floradecora-bare.git"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Setting up auto-deploy webhook"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Create post-receive hook in the BARE repo
# This fires every time someone pushes to the bare repo
HOOK_FILE="$BARE_REPO/hooks/post-receive"

cat > "$HOOK_FILE" <<'EOF'
#!/bin/bash
# Auto-deploy hook: triggers Coolify webhooks on push to main

# Load webhook URLs from config file
CONFIG_FILE="/home/tanveer/.coolify-webhook.env"
if [ -f "$CONFIG_FILE" ]; then
    source "$CONFIG_FILE"
fi

COOLIFY_URL="${COOLIFY_URL:-http://localhost:8000}"
COOLIFY_WEBHOOKS="${COOLIFY_WEBHOOKS:-}"

# Read each webhook URL and trigger it
if [ -n "$COOLIFY_WEBHOOKS" ]; then
    for webhook in $COOLIFY_WEBHOOKS; do
        echo "→ Triggering: $webhook"
        curl -s -X POST "$webhook" -H "Content-Type: application/json" -d '{"source":"local-git","branch":"main"}' || true
    done
    echo "✓ Auto-deploy triggered for $(echo $COOLIFY_WEBHOOKS | wc -w) service(s)"
else
    echo "⚠ No webhooks configured. Edit $CONFIG_FILE to add COOLIFY_WEBHOOKS"
fi
EOF

chmod +x "$HOOK_FILE"
echo "✓ Bare repo hook installed: $HOOK_FILE"

# Create a wrapper script for committing and pushing
cat > /home/tanveer/commit-and-deploy.sh <<'EOF'
#!/bin/bash
# ─────────────────────────────────────────────────────────────
# Commit changes and trigger auto-deploy
# Usage: ./commit-and-deploy.sh "your commit message"
# ─────────────────────────────────────────────────────────────

set -e
cd /home/tanveer/floradecora.com

if [ -z "$1" ]; then
    echo "Usage: $0 'commit message'"
    exit 1
fi

echo "→ Staging changes..."
git add -A

if git diff --cached --quiet; then
    echo "No changes to commit"
    exit 0
fi

echo "→ Committing..."
git commit -m "$1"

echo "→ Pushing to local bare repo (triggers Coolify)..."
git push local main

echo "✓ Done! Coolify will auto-deploy."
EOF

chmod +x /home/tanveer/commit-and-deploy.sh
echo "✓ Wrapper script created: /home/tanveer/commit-and-deploy.sh"

# Set up Git identity if not already
cd "$PROJECT_DIR"
git config user.email "tanveer@fazi.local" 2>/dev/null || true
git config user.name "Tanveer" 2>/dev/null || true

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✓ Auto-deploy setup complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "To configure webhooks for each Coolify service:"
echo "  1. In Coolify, go to your service → Webhooks tab"
echo "  2. Copy the webhook URL"
echo "  3. Edit: ~/.coolify-webhook.env"
echo "  4. Add: COOLIFY_WEBHOOKS=\"webhook1 webhook2 ...\""
echo ""
echo "Or set inline: COOLIFY_WEBHOOKS=\"url1 url2\" git push local main"
