# Fix WSL2 DNS — Step-by-step

Your DNS is stuck on `127.0.0.53` (systemd-resolved stub) which can't reach the internet. Here's how to fix it.

## Option 1: From PowerShell (Admin) — RECOMMENDED

```powershell
# 1. Open PowerShell as Administrator (right-click → "Run as administrator")
# 2. Stop WSL
wsl --shutdown

# 3. Create a static resolv.conf (this overrides the symlink)
wsl -d Ubuntu-26.04 -- bash -c "sudo rm -f /etc/resolv.conf && sudo bash -c 'cat > /etc/resolv.conf <<EOF
nameserver 8.8.8.8
nameserver 1.1.1.1
nameserver 127.0.0.53
search .
EOF
chattr +i /etc/resolv.conf'"

# 4. Restart WSL
wsl -d Ubuntu-26.04

# 5. Verify DNS works
ping -c 2 cdn.coollabs.io
```

The `chattr +i` makes the file immutable so Windows/WSL doesn't overwrite it.

## Option 2: From WSL terminal (if sudo works)

```bash
# Remove the symlink
sudo rm -f /etc/resolv.conf

# Create a static file (NOT a symlink)
sudo bash -c 'cat > /etc/resolv.conf <<EOF
nameserver 8.8.8.8
nameserver 1.1.1.1
EOF'

# Make it immutable
sudo chattr +i /etc/resolv.conf

# Test
ping -c 2 cdn.coollabs.io
```

## Option 3: Configure WSL globally in Windows

Create or edit `C:\Users\<YourUsername>\.wslconfig`:

```ini
[wsl2]
dns=8.8.8.8,1.1.1.1
generateResolvConf=false
```

Then in PowerShell:
```powershell
wsl --shutdown
wsl -d Ubuntu-26.04
```

The `generateResolvConf=false` stops WSL from overwriting your DNS settings.

## Verify DNS works

After applying any option, test:

```bash
ping -c 2 cdn.coollabs.io
# should show: 64 bytes from cdn.coollabs.io

ping -c 2 registry-1.docker.io
# should show: 64 bytes from registry-1.docker.io

nslookup google.com
# should resolve
```

If it still doesn't work, try disabling VPN or checking your Windows firewall.
