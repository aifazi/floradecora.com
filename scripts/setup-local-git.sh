#!/bin/bash
# ─────────────────────────────────────────────────────────────
# Setup local bare Git repository for Coolify
# Coolify will treat this like a remote Git repo
# ─────────────────────────────────────────────────────────────

set -e

PROJECT_DIR="/mnt/e/floradecora.com"
BARE_REPO_DIR="/home/tanveer/floradecora-bare.git"
WORK_TREE_DIR="/home/tanveer/floradecora-work"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Setting up local bare Git repo for Coolify"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 1. Create a bare Git repo (what Coolify will clone)
echo "[1/3] Creating bare Git repo at $BARE_REPO_DIR..."
mkdir -p "$(dirname "$BARE_REPO_DIR")"
if [ -d "$BARE_REPO_DIR" ]; then
    echo "  Bare repo already exists, skipping..."
else
    git init --bare "$BARE_REPO_DIR"
    echo "  ✓ Bare repo created"
fi

# 2. Create a working tree (for pushing changes)
echo "[2/3] Setting up worktree at $WORK_TREE_DIR..."
if [ ! -d "$WORK_TREE_DIR" ]; then
    git worktree add "$WORK_TREE_DIR" main 2>/dev/null || {
        # First-time setup: push current state to bare repo
        cd "$PROJECT_DIR"
        git remote add local "$BARE_REPO_DIR" 2>/dev/null || git remote set-url local "$BARE_REPO_DIR"
        git push local main
        git worktree add "$WORK_TREE_DIR" main
    }
    echo "  ✓ Worktree created"
else
    echo "  Worktree already exists"
fi

# 3. Add a post-commit hook to auto-push to bare repo
echo "[3/3] Setting up auto-push hook..."
cd "$PROJECT_DIR"
HOOK_FILE="$PROJECT_DIR/.git/hooks/post-commit"
cat > "$HOOK_FILE" <<'EOF'
#!/bin/bash
# Auto-push to local bare repo for Coolify
git push local main 2>/dev/null || echo "Failed to push to local bare repo"
EOF
chmod +x "$HOOK_FILE"
echo "  ✓ Hook installed"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Setup complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Your Coolify Git URL:"
echo "  $BARE_REPO_DIR"
echo ""
echo "In Coolify, use this as the Git URL:"
echo "  file://$BARE_REPO_DIR"
echo "  or just: $BARE_REPO_DIR"
echo ""
echo "After every commit, the bare repo auto-updates."
echo "Coolify can then pull from it like a normal Git repo."
