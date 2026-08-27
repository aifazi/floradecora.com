#!/bin/bash
set -e
source "$(dirname "$0")/_load-env.sh"
DIRECT="${DATABASE_URL}"
echo "DIRECT: $DIRECT"
curl -s -X PUT "https://api.render.com/v1/services/$BACKEND_SERVICE_ID/env-vars" \
  -H "Authorization: Bearer $RENDER_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d "[
    {\"key\":\"DATABASE_URL\",\"value\":\"$DIRECT\"},
    {\"key\":\"DIRECT_URL\",\"value\":\"$DIRECT\"}
  ]" | head -c 200
echo ""
curl -s -X POST "https://api.render.com/v1/services/$BACKEND_SERVICE_ID/deploys" -H "Authorization: Bearer $RENDER_API_TOKEN" -H "Content-Type: application/json" -d '{"clearCache":"clear"}' | head -c 200
echo ""
