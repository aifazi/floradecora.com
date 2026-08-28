#!/bin/bash
# ─────────────────────────────────────────────────────────────
# Initialize Git repo for Coolify local deployment
# ─────────────────────────────────────────────────────────────

set -e

PROJECT_DIR="/home/tanveer/floradecora.com"
BARE_REPO="/home/tanveer/floradecora-bare.git"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Initializing local Git for Coolify"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd "$PROJECT_DIR"

# 1. Initialize Git if not already
if [ ! -d ".git" ]; then
    echo "[1/4] Initializing Git repo..."
    git init -b main
    # Add .gitignore if not present
    if [ ! -f ".gitignore" ]; then
        cat > .gitignore <<'EOF'
node_modules/
.next/
.env
.env.local
.env*.local
*.log
.DS_Store
dist/
build/
.turbo/
coverage/
EOF
    fi
else
    echo "[1/4] Git already initialized"
fi

# 2. Add and commit all files
echo "[2/4] Staging files..."
git add -A 2>/dev/null || true
git commit -m "Initial commit for Coolify deployment" --allow-empty 2>&1 | head -5

# 3. Add remote pointing to bare repo
echo "[3/4] Setting up remote..."
git remote remove local 2>/dev/null || true
git remote add local "$BARE_REPO"
git remote -v

# 4. Push to bare repo
echo "[4/4] Pushing to bare repo..."
cd "$PROJECT_DIR"
git push -u local main --force 2>&1

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✓ Setup complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Bare repo URL for Coolify:"
echo "  $BARE_REPO"
echo ""
echo "In Coolify, use this Git URL:"
echo "  $BARE_REPO"
echo ""
echo "Branch: main"
