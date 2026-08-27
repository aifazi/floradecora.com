#!/bin/bash
set -e
source "$(dirname "$0")/_load-env.sh"

echo "=== Render backend sync ==="
curl -s -X PUT "https://api.render.com/v1/services/$BACKEND_SERVICE_ID/env-vars" \
  -H "Authorization: Bearer $RENDER_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d "[
    {\"key\":\"NODE_ENV\",\"value\":\"production\"},
    {\"key\":\"PORT\",\"value\":\"10000\"},
    {\"key\":\"DATABASE_URL\",\"value\":\"$DATABASE_URL\"},
    {\"key\":\"DIRECT_URL\",\"value\":\"$DIRECT_URL\"},
    {\"key\":\"CORS_ORIGIN\",\"value\":\"https://floradecora.com,https://www.floradecora.com\"},
    {\"key\":\"ADMIN_API_KEY\",\"value\":\"$ADMIN_API_KEY\"},
    {\"key\":\"JWT_SECRET\",\"value\":\"$JWT_SECRET\"},
    {\"key\":\"COOKIE_SECURE\",\"value\":\"true\"},
    {\"key\":\"R2_BUCKET\",\"value\":\"floradecora\"},
    {\"key\":\"CDN_URL\",\"value\":\"https://cdn.aifazi.net\"}
  ]" | head -c 300
echo ""
echo "Render backend env synced"
