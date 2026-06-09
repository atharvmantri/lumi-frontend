$ErrorActionPreference = "Stop"
Write-Host ""
Write-Host " ========================================" -ForegroundColor Cyan
Write-Host "   Lumi - Native PowerShell Installer    " -ForegroundColor Cyan
Write-Host " ========================================" -ForegroundColor Cyan
Write-Host ""

$target = "$HOME\Lumi-Assist"
if (Test-Path $target) {
    Write-Host "[1/7] Updating existing repository..." -ForegroundColor Yellow
    Set-Location $target
    git pull --quiet
} else {
    Write-Host "[1/7] Cloning Lumi-Assist to $target..." -ForegroundColor Yellow
    git clone --quiet https://github.com/atharvmantri/Lumi-Assist.git $target
    Set-Location $target
}

Write-Host ""
Write-Host "[2/7] Checking Python 3.11..." -ForegroundColor Yellow
$pyCmd = "python"
if (Get-Command "py" -ErrorAction SilentlyContinue) { $pyCmd = "py -3.11" }
try {
    $pyVer = Invoke-Expression "$pyCmd -c `"import sys; print(f'{sys.version_info.major}.{sys.version_info.minor}')`"" 2>$null
    Write-Host "Found Python $pyVer" -ForegroundColor Green
} catch {
    Write-Host "Warning: Python 3.11+ not found or 'py' launcher missing. Proceeding with default python." -ForegroundColor Red
    $pyCmd = "python"
}

Write-Host ""
Write-Host "[3/7] Creating Virtual Environment..." -ForegroundColor Yellow
if (-not (Test-Path "venv")) {
    Invoke-Expression "$pyCmd -m venv venv"
}
Write-Host "Virtual environment ready." -ForegroundColor Green

Write-Host ""
Write-Host "[4/7] Installing Dependencies (This takes a few minutes)..." -ForegroundColor Yellow
& .\venv\Scripts\python.exe -m pip install --quiet --upgrade pip
& .\venv\Scripts\python.exe -m pip install --quiet -r requirements.txt
Write-Host "Dependencies installed successfully!" -ForegroundColor Green

Write-Host ""
Write-Host "[5/7] Downloading Voice Model (Piper TTS)..." -ForegroundColor Yellow
$voiceDir = "models\piper"
if (-not (Test-Path $voiceDir)) { New-Item -ItemType Directory -Force -Path $voiceDir | Out-Null }
if (-not (Test-Path "$voiceDir\en_GB-southern_english_female-low.onnx")) {
    & .\venv\Scripts\python.exe -m pip install --quiet huggingface-hub
    & .\venv\Scripts\python.exe -c "from huggingface_hub import hf_hub_download; hf_hub_download('rhassys/piper-voices', 'en/en_GB/southern_english_female/low/en_GB-southern_english_female-low.onnx', local_dir='models/piper', repo_type='model')"
    & .\venv\Scripts\python.exe -c "from huggingface_hub import hf_hub_download; hf_hub_download('rhassys/piper-voices', 'en/en_GB/southern_english_female/low/en_GB-southern_english_female-low.onnx.json', local_dir='models/piper', repo_type='model')"
}
Write-Host "Voice model ready." -ForegroundColor Green

Write-Host ""
Write-Host "[6/7] Configuration" -ForegroundColor Yellow
$apiKey = Read-Host "Enter your HackClub/OpenRouter API key (or press Enter to skip)"
if ($apiKey) {
    Set-Content -Path ".env" -Value "HACKCLUB_API_KEY=$apiKey"
}

if (-not (Test-Path "config.yaml")) {
    $yaml = @"
lumi:
  wake_word: "hey lumi"
  wake_word_sensitivity: 0.5
stt:
  model: "large-v3"
  device: "cuda"
  compute_type: "float16"
  silence_threshold_ms: 1500
  language: null
llm:
  provider: "HackClub_Free"
  api_key_env: "HACKCLUB_API_KEY"
  model: "openrouter/free"
  base_url: "https://ai.hackclub.com/proxy/v1"
  max_tokens: 2048
  temperature: 0.7
  system_prompt_path: "prompts/system.md"
  history_turns: 20
tts:
  engine: "piper"
  voice: "en_GB-southern_english_female-low"
  device: "cpu"
  speed: 1.0
ui:
  theme: "dark"
  opacity: 0.88
  always_on_top: true
  show_transcript: true
  window_position: [80, 80]
audio:
  input_device: "default"
  output_device: "default"
  sample_rate: 16000
"@
    Set-Content -Path "config.yaml" -Value $yaml
}

Write-Host ""
Write-Host "[7/7] Finalizing Setup..." -ForegroundColor Yellow
$dirs = @("data\conversations", "logs\learning", "logs\screenshots", "data\wake_samples")
foreach ($dir in $dirs) {
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
}

Write-Host ""
Write-Host " ========================================" -ForegroundColor Green
Write-Host "   Installation Complete!                " -ForegroundColor Green
Write-Host " ========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Lumi has been installed to: $target"
Write-Host "To start Lumi anytime, go to that folder and double-click `"launch.bat`"" -ForegroundColor Cyan
Write-Host ""
