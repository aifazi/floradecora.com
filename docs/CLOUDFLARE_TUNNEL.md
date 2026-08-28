# Cloudflare Tunnel Setup for Coolify on WSL2

Cloudflare Tunnel (`cloudflared`) gives you:
- ✅ Free HTTPS
- ✅ No port forwarding needed
- ✅ Works behind CGNAT
- ✅ DDoS protection
- ✅ No public IP required

## Architecture with Cloudflare Tunnel

```
Internet
    ↓
Cloudflare Edge
    ↓
Cloudflare Tunnel (cloudflared in WSL2)
    ↓
Coolify (localhost:8000)
    ↓
Frontend (localhost:3000)
Backend (localhost:3002)
Database (localhost:5432, not exposed)
```

## Part 1: Cloudflare Account Setup

### 1. Add your domain to Cloudflare
- Go to https://dash.cloudflare.com/sign-up
- Add your domain (e.g. `floradecora.com`)
- Cloudflare will scan existing DNS records

### 2. Update nameservers at your registrar
Cloudflare will give you 2 nameservers like:
```
ulla.ns.cloudflare.com
walt.ns.cloudflare.com
```
Go to your domain registrar and update the nameservers.

Wait 5-30 minutes for propagation.

## Part 2: Install cloudflared in WSL2

```bash
# Download cloudflared
curl -fsSL https://pkg.cloudflare.com/cloudflare-main.gpg | sudo tee /usr/share/keyrings/cloudflare-main.gpg >/dev/null
echo 'deb [signed-by=/usr/share/keyrings/cloudflare-main.gpg] https://pkg.cloudflare.com/cloudflared focal main' | sudo tee /etc/apt/sources.list.d/cloudflared.list
sudo apt-get update && sudo apt-get install -y cloudflared
```

Verify:
```bash
cloudflared --version
```

## Part 3: Authenticate with Cloudflare

```bash
cloudflared tunnel login
```

This opens a browser window. Log in and select your domain.

## Part 4: Create a Tunnel

```bash
# Create tunnel named "floradecora"
cloudflared tunnel create floradecora
```

This gives you a **Tunnel ID** like `a1b2c3d4-e5f6-...` and creates a credential file at `~/.cloudflared/<TUNNEL_ID>.json`.

## Part 5: Configure the Tunnel

Create `~/.cloudflared/config.yml`:

```yaml
tunnel: <YOUR_TUNNEL_ID>
credentials-file: /home/YOUR_USERNAME/.cloudflared/<YOUR_TUNNEL_ID>.json

ingress:
  # Coolify UI
  - hostname: coolify.yourdomain.com
    service: http://localhost:8000
  # Frontend
  - hostname: yourdomain.com
    service: http://localhost:3000
  - hostname: www.yourdomain.com
    service: http://localhost:3000
  # Backend API
  - hostname: api.yourdomain.com
    service: http://localhost:3002
  # Catch-all
  - service: http_status:404
```

Replace:
- `<YOUR_TUNNEL_ID>` with your tunnel ID
- `YOUR_USERNAME` with your WSL username (`whoami`)
- `yourdomain.com` with your actual domain

## Part 6: Create DNS Records

```bash
# Add CNAME records for each hostname
cloudflared tunnel route dns floradecora coolify.yourdomain.com
cloudflared tunnel route dns floradecora yourdomain.com
cloudflared tunnel route dns floradecora www.yourdomain.com
cloudflared tunnel route dns floradecora api.yourdomain.com
```

Or do it manually in Cloudflare dashboard → DNS → Records.

## Part 7: Run the Tunnel

### Option A: As a systemd service (recommended)

Create `/etc/systemd/system/cloudflared.service`:

```ini
[Unit]
Description=Cloudflare Tunnel
After=network.target

[Service]
Type=simple
User=YOUR_USERNAME
ExecStart=/usr/bin/cloudflared tunnel --config /home/YOUR_USERNAME/.cloudflared/config.yml run floradecora
Restart=on-failure
RestartSec=5s

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl daemon-reload
sudo systemctl enable --now cloudflared
sudo systemctl status cloudflared
```

### Option B: Run in foreground (for testing)

```bash
cloudflared tunnel --config ~/.cloudflared/config.yml run floradecora
```

Press Ctrl+C to stop.

### Option C: Run in Docker (cleaner)

```bash
docker run -d \
  --name cloudflared \
  --restart unless-stopped \
  -v /home/YOUR_USERNAME/.cloudflared:/home/nonroot/.cloudflared:ro \
  cloudflare/cloudflared:latest \
  tunnel --no-autoupdate run floradecora
```

## Part 8: Verify

After starting, test:
```bash
# Check tunnel status
cloudflared tunnel info floradecora

# Should show connected connectors
```

In browser:
- `https://coolify.yourdomain.com` → Coolify UI
- `https://yourdomain.com` → Your frontend
- `https://api.yourdomain.com` → Your backend

## Part 9: HTTPS (automatic)

Cloudflare Tunnel automatically provisions SSL certificates. No action needed.

## Part 10: Configure Coolify for your domain

Once Coolify is accessible via Cloudflare Tunnel:

1. Login to Coolify
2. Go to **Settings → Instance**
3. Set **Domain** to `coolify.yourdomain.com`
4. Save

Now deploy your apps. For each:
- Use the appropriate hostname
- Frontend: `yourdomain.com`
- Backend: `api.yourdomain.com`

## Updating DNS for inter-service communication

Inside Coolify, your services talk via service names (`backend`, `flora-db`), not hostnames. The Cloudflare Tunnel is only for **external** access.

## Backup DNS Records

If using Cloudflare, your `next.config.mjs` CSP and CORS need to allow the real domain:

```js
// next.config.mjs headers
{
  source: "/(.*)",
  headers: [
    // Update CORS origin
    // Update CSP to allow your real domain
  ]
}
```

And in backend `.env`:
```
CORS_ORIGIN=https://yourdomain.com
COOKIE_SECURE=true
```
