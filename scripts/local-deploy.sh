#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
# Quick Local Deploy — uses existing docker-compose
# Use this if you don't want to use Coolify UI for local dev
# ─────────────────────────────────────────────────────────────

set -e

cd "$(dirname "$0")/.."

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Flora Decora — Local Docker Deploy (plain docker-compose)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Load env if exists
if [ -f .env ]; then
    set -a
    # shellcheck disable=SC1091
    source .env
    set +a
fi

# Generate passwords if not set
export POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-$(openssl rand -base64 24 | tr -d '/+=' | head -c 32)}
export JWT_SECRET=${JWT_SECRET:-$(openssl rand -base64 32)}
export COOKIE_SECURE=${COOKIE_SECURE:-false}
export CORS_ORIGIN=${CORS_ORIGIN:-http://localhost:3000}
export ALLOW_LOCAL_CORS=${ALLOW_LOCAL_CORS:-true}
export ALLOW_INSECURE_COOKIE=${ALLOW_INSECURE_COOKIE:-true}

# Save to .env if not exists or missing keys
if [ ! -f .env ]; then
    cat > .env <<EOF
POSTGRES_PASSWORD=$POSTGRES_PASSWORD
JWT_SECRET=$JWT_SECRET
COOKIE_SECURE=$COOKIE_SECURE
CORS_ORIGIN=$CORS_ORIGIN
ALLOW_LOCAL_CORS=$ALLOW_LOCAL_CORS
ALLOW_INSECURE_COOKIE=$ALLOW_INSECURE_COOKIE
EOF
    echo "▶ Created .env with generated secrets"
else
    grep -q ALLOW_LOCAL_CORS .env || echo "ALLOW_LOCAL_CORS=true" >> .env
    grep -q ALLOW_INSECURE_COOKIE .env || echo "ALLOW_INSECURE_COOKIE=true" >> .env
fi

echo "▶ Building images (this takes a few minutes)..."
docker compose build

echo ""
echo "▶ Starting services..."
docker compose up -d

echo ""
echo "▶ Waiting for services to be healthy..."
sleep 15

docker compose ps

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Services running!"
echo "  Frontend:  http://localhost:3001 (plain compose) / http://localhost:3000 (Coolify)"
echo "  Backend:   http://localhost:3002"
echo "  Database:  localhost:5433 -> 5432"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "▶ View logs:  docker compose logs -f"
echo "▶ Stop all:   docker compose down"
echo "▶ Coolify alternative: docker compose -f docker-compose.coolify.yml up -d"