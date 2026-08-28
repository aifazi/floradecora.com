#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
# Complete Setup: DNS Fix + Coolify + Cloudflare Tunnel
# Run this in WSL2 Ubuntu terminal
# ─────────────────────────────────────────────────────────────

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  Flora Decora — Full Stack Setup${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# ─── Step 1: Fix DNS ────────────────────────────────────────
echo -e "${YELLOW}[1/4] Fixing DNS...${NC}"

if [ -L /etc/resolv.conf ]; then
    echo "  Removing symlink..."
    sudo rm -f /etc/resolv.conf
fi

sudo bash -c 'cat > /etc/resolv.conf <<EOF
nameserver 8.8.8.8
nameserver 1.1.1.1
nameserver 127.0.0.53
search .
EOF'
sudo chattr +i /etc/resolv.conf 2>/dev/null || true
echo -e "  ${GREEN}✓ DNS set to 8.8.8.8, 1.1.1.1${NC}"

# Test DNS
if ping -c 1 -W 2 cdn.coollabs.io &> /dev/null; then
    echo -e "  ${GREEN}✓ DNS working (cdn.coollabs.io reachable)${NC}"
else
    echo -e "  ${RED}✗ DNS still not working. Check your network.${NC}"
    echo "  Try: ping google.com"
    exit 1
fi
echo ""

# ─── Step 2: Install Coolify ────────────────────────────────
echo -e "${YELLOW}[2/4] Install Coolify? (y/n)${NC}"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo "  Downloading Coolify installer..."
    if ! curl -fsSL https://cdn.coollabs.io/coolify/install.sh -o /tmp/coolify-install.sh; then
        echo -e "  ${RED}✗ Failed to download Coolify installer${NC}"
        exit 1
    fi
    echo "  Running installer (5-10 min)..."
    sudo bash /tmp/coolify-install.sh
    echo -e "  ${GREEN}✓ Coolify installed${NC}"
    echo "  Open: http://localhost:8000"
else
    echo "  Skipped Coolify install"
fi
echo ""

# ─── Step 3: Install Cloudflared ───────────────────────────
echo -e "${YELLOW}[3/4] Install Cloudflare Tunnel (cloudflared)? (y/n)${NC}"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo "  Adding Cloudflare GPG key..."
    curl -fsSL https://pkg.cloudflare.com/cloudflare-main.gpg | sudo tee /usr/share/keyrings/cloudflare-main.gpg >/dev/null
    echo "  Adding Cloudflare repo..."
    echo 'deb [signed-by=/usr/share/keyrings/cloudflare-main.gpg] https://pkg.cloudflare.com/cloudflared focal main' | sudo tee /etc/apt/sources.list.d/cloudflared.list
    echo "  Installing cloudflared..."
    sudo apt-get update -qq
    sudo apt-get install -y -qq cloudflared
    echo -e "  ${GREEN}✓ cloudflared installed${NC}"
    echo "  Version: $(cloudflared --version)"
    echo ""
    echo "  Next: Run 'cloudflared tunnel login' to authenticate"
else
    echo "  Skipped cloudflared install"
fi
echo ""

# ─── Step 4: Summary ───────────────────────────────────────
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  Setup complete!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Next steps:"
echo "  1. Open Coolify: http://localhost:8000"
echo "  2. Login to Cloudflare: cloudflared tunnel login"
echo "  3. Create tunnel: cloudflared tunnel create floradecora"
echo "  4. Configure tunnel: ~/.cloudflared/config.yml"
echo ""
echo "See docs/CLOUDFLARE_TUNNEL.md for full guide"
