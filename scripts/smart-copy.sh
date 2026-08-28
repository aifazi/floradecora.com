#!/bin/bash
# ─────────────────────────────────────────────────────────────
# Smart copy project to WSL filesystem (excludes heavy dirs)
# ─────────────────────────────────────────────────────────────

set -e

SRC="/mnt/e/floradecora.com"
DST="/home/tanveer/floradecora.com"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Copying project to WSL filesystem"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Remove old copy
rm -rf "$DST"
mkdir -p "$DST"

# Copy excluding heavy directories
echo "Copying source files..."
cd "$SRC"

# Use tar to copy (preserves everything, excludes heavy dirs)
tar --exclude='node_modules' \
    --exclude='.next' \
    --exclude='dist' \
    --exclude='build' \
    --exclude='coverage' \
    --exclude='.turbo' \
    --exclude='*.log' \
    --exclude='.git' \
    -cf - . | (cd "$DST" && tar -xf -)

echo ""
echo "✓ Copy complete!"
echo ""
echo "Files copied:"
ls "$DST"
echo ""
echo "Floradecora subdir:"
ls "$DST/floradecora" 2>/dev/null | head -15
