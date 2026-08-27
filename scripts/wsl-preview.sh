#!/usr/bin/env bash
set -e
# WSL Docker preview for Flora Decora
# Usage: bash scripts/wsl-preview.sh  (run from /mnt/e/floradecora.com inside WSL)
# Or from Windows: wsl -d Ubuntu-26.04 -- bash /mnt/e/floradecora.com/scripts/wsl-preview.sh

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "=> Flora Decora — WSL Docker Preview"
echo "   Root: $PROJECT_ROOT"
echo ""

# Ensure .env exists (fallback dummy for build)
if [ ! -f floradecora/.env.local ]; then
  echo "   Creating dummy floradecora/.env.local for build..."
  echo "WEB3FORMS_KEY=dummy" > floradecora/.env.local
fi

echo "=> Building prod image (3001)..."
docker compose build floradecora

echo "=> Starting container floradecora (prod) on http://localhost:3001 ..."
docker compose up -d floradecora
sleep 5
docker ps | grep floradecora || true
echo ""
echo "=> Logs (last 20)..."
docker logs floradecora --tail 20 || true
echo ""
echo "✅ Preview: http://localhost:3001"
echo "   Dev preview: docker compose -f docker-compose.dev.yml up --build  (http://localhost:3000)"
echo "   Stop: docker compose down"