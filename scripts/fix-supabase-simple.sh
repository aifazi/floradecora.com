#!/bin/bash
set -e
source "$(dirname "$0")/_load-env.sh"
# Pooled (pgbouncer) for DATABASE_URL, direct for DIRECT_URL
POOLED="postgresql://postgres.${SUPABASE_PROJECT_REF}:${SUPABASE_DB_PASSWORD}@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT="${DATABASE_URL}"
echo "DATABASE_URL: $POOLED"
curl -s -X PUT "https://api.render.com/v1/services/$BACKEND_SERVICE_ID/env-vars" \
  -H "Authorization: Bearer $RENDER_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d "[
    {\"key\":\"DATABASE_URL\",\"value\":\"$POOLED\"},
    {\"key\":\"DIRECT_URL\",\"value\":\"$DIRECT\"}
  ]" | head -c 300
echo ""
curl -s -X POST "https://api.render.com/v1/services/$BACKEND_SERVICE_ID/deploys" -H "Authorization: Bearer $RENDER_API_TOKEN" -H "Content-Type: application/json" -d '{"clearCache":"clear"}' | head -c 200
echo ""
