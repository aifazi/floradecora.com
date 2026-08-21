# WSL Docker preview helper (run from PowerShell)
# Starts WSL Ubuntu and runs Docker preview
$WslDistro = "Ubuntu-26.04"
Write-Host "=> Starting WSL $WslDistro..."
wsl -d $WslDistro -- bash -c "cd /mnt/e/floradecora.com && bash scripts/wsl-preview.sh"
Write-Host "=> Done. Preview at http://localhost:3001"