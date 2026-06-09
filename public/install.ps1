$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host " ========================================"
Write-Host "   Lumi - One-Line Installer             "
Write-Host " ========================================"
Write-Host ""

$target = "$HOME\Lumi-Assist"

if (Test-Path $target) {
    Write-Host "[!] $target already exists."
    Write-Host "    Updating existing repository..."
    Set-Location $target
    git pull
} else {
    Write-Host "--> Cloning Lumi-Assist to $target..."
    git clone https://github.com/atharvmantri/Lumi-Assist.git $target
    Set-Location $target
}

Write-Host "--> Launching full installer..."
cmd /c .\install.bat
