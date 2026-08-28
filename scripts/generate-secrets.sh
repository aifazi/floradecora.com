#!/bin/bash
# Generate secrets for Coolify deployment
# Save to: /tmp/flora-secrets.env

JWT_SECRET=$(openssl rand -base64 32 | tr -d '/+=' | head -c 44)
POSTGRES_PASSWORD=$(openssl rand -base64 24 | tr -d '/+=' | head -c 32)
ADMIN_API_KEY=$(openssl rand -hex 16)

cat > /tmp/flora-secrets.env <<EOF
# Flora Decora Secrets — Generated $(date)
# DO NOT COMMIT THIS FILE
JWT_SECRET=$JWT_SECRET
POSTGRES_PASSWORD=$POSTGRES_PASSWORD
ADMIN_API_KEY=$ADMIN_API_KEY
EOF

chmod 600 /tmp/flora-secrets.env
echo "✓ Secrets generated: /tmp/flora-secrets.env"
cat /tmp/flora-secrets.env
