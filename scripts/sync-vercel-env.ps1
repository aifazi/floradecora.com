Set-Location "C:\aifazi\floradecora.com"
Write-Host "=== Vercel env sync ==="

# Load secrets from untracked local env (scripts/.env.local — gitignored)
$envFile = Join-Path $PSScriptRoot ".env.local"
if (-not (Test-Path $envFile)) {
  Write-Error "ERROR: $envFile not found. Copy .env.local.example to .env.local and fill in values."
  exit 1
}
Get-Content $envFile | ForEach-Object {
  if ($_ -match '^\s*([^#][^=]*)=(.*)$') {
    [System.Environment]::SetEnvironmentVariable($matches[1].Trim(), $matches[2].Trim(), 'Process')
  }
}

$envs = @(
  @{key="BACKEND_URL";                   value=$env:BACKEND_URL;                   env="production"},
  @{key="JWT_SECRET";                    value=$env:JWT_SECRET;                    env="production"},
  @{key="NEXT_PUBLIC_TURNSTILE_SITE_KEY";value=$env:NEXT_PUBLIC_TURNSTILE_SITE_KEY;env="production"},
  @{key="TURNSTILE_SECRET_KEY";          value=$env:TURNSTILE_SECRET_KEY;          env="production"},
  @{key="WEB3FORMS_KEY";                  value=$env:WEB3FORMS_KEY;                  env="production"},
  @{key="NEXT_PUBLIC_API_URL";           value="";                                 env="production"},
  @{key="CDN_URL";                       value="https://cdn.aifazi.net";            env="production"}
)
foreach ($e in $envs) {
  $existing = vercel env ls 2>&1 | Select-String -Pattern $e.key
  if ($existing) { Write-Host "$($e.key) already exists, skipping" }
  else {
    Write-Host "Adding $($e.key)..."
    $e.value | vercel env add $e.key $e.env 2>&1 | Out-String -Width 500 | Select-Object -First 5 | Out-String | Write-Host
  }
}
Write-Host "=== Vercel env ls ==="
vercel env ls 2>&1 | Out-String -Width 800 | Select-Object -First 30 | Out-String | Write-Host
