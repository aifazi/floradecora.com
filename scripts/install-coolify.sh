#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
# Coolify Install Script for Flora Decora
# Run this in WSL2 Ubuntu terminal as your normal user
# ─────────────────────────────────────────────────────────────

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Coolify Install for Flora Decora"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 1. Fix DNS (if needed)
echo "▶ Fixing DNS..."
sudo rm -f /etc/resolv.conf
sudo bash -c 'echo "nameserver 8.8.8.8" > /etc/resolv.conf && echo "nameserver 1.1.1.1" >> /etc/resolv.conf'
echo "  ✓ DNS set to 8.8.8.8, 1.1.1.1"
echo ""

# 2. Test connectivity
echo "▶ Testing connectivity..."
if ! ping -c 1 cdn.coollabs.io &> /dev/null; then
    echo "  ✗ Cannot reach cdn.coollabs.io. Check your network."
    exit 1
fi
echo "  ✓ Network OK"
echo ""

# 3. Download and run Coolify installer
echo "▶ Installing Coolify (this takes 5-10 minutes)..."
echo "  After install, open http://localhost:8000"
echo ""
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Coolify installed!"
echo "  Open: http://localhost:8000"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
