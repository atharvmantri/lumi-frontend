$ErrorActionPreference = "Continue"
Write-Host ""
Write-Host " ========================================" -ForegroundColor Cyan
Write-Host "   Lumi - Native PowerShell Installer    " -ForegroundColor Cyan
Write-Host " ========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Welcome to the Lumi Setup!" -ForegroundColor Green
Write-Host "Let's get your voice assistant ready."
Write-Host ""
Write-Host "Please select an installation mode:" -ForegroundColor Yellow
Write-Host "[1] Quickstart - Use fast defaults (Free AI, Fast STT, English Female Voice)"
Write-Host "[2] Custom     - Recommended. Choose your own AI models, voices, and settings"
Write-Host ""
$mode = Read-Host "Enter your choice (1 or 2)"

$sttModel = "large-v3"
$llmProvider = "HackClub_Free"
$ttsVoice = "en_GB-southern_english_female-low"
$wakeWord = "hey lumi"

if ($mode -eq "2") {
    Write-Host ""
    Write-Host "--- Custom Configuration ---" -ForegroundColor Cyan
    
    $inputWake = Read-Host "What should Lumi's wake word be? (default: hey lumi)"
    if ($inputWake) { $wakeWord = $inputWake }

    Write-Host ""
    Write-Host "Choose a Speech-to-Text model:" -ForegroundColor Yellow
    Write-Host "1) tiny (Fastest, lowest accuracy)"
    Write-Host "2) base"
    Write-Host "3) small"
    Write-Host "4) medium"
    Write-Host "5) large-v3 (Default, highest accuracy)"
    $sttChoice = Read-Host "Select (1-5)"
    switch ($sttChoice) {
        "1" { $sttModel = "tiny" }
        "2" { $sttModel = "base" }
        "3" { $sttModel = "small" }
        "4" { $sttModel = "medium" }
        "5" { $sttModel = "large-v3" }
    }

    Write-Host ""
    Write-Host "Choose an LLM Provider:" -ForegroundColor Yellow
    Write-Host "1) HackClub_Free (Default)"
    Write-Host "2) OpenRouter"
    Write-Host "3) OpenAI"
    Write-Host "4) Custom"
    $llmChoice = Read-Host "Select (1-4)"
    switch ($llmChoice) {
        "1" { $llmProvider = "HackClub_Free" }
        "2" { $llmProvider = "OpenRouter" }
        "3" { $llmProvider = "OpenAI" }
        "4" { $llmProvider = "Custom" }
    }

    Write-Host ""
    Write-Host "Choose a Voice:" -ForegroundColor Yellow
    Write-Host "1) English GB Female (Default)"
    Write-Host "2) English US Female"
    Write-Host "3) English US Male"
    $voiceChoice = Read-Host "Select (1-3)"
    switch ($voiceChoice) {
        "1" { $ttsVoice = "en_GB-southern_english_female-low" }
        "2" { $ttsVoice = "en_US-lessac-medium" }
        "3" { $ttsVoice = "en_US-ryan-medium" }
    }
}

Write-Host ""
Write-Host "Awesome! Starting setup..." -ForegroundColor Green
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
& .\venv\Scripts\python.exe -m pip install --quiet --upgrade pip --no-cache-dir
& .\venv\Scripts\python.exe -m pip install --quiet -r requirements.txt --no-cache-dir
Write-Host "Dependencies installed successfully!" -ForegroundColor Green

Write-Host ""
Write-Host "[5/7] Downloading Voice Model ($ttsVoice)..." -ForegroundColor Yellow
$voiceDir = "models\piper"
if (-not (Test-Path $voiceDir)) { New-Item -ItemType Directory -Force -Path $voiceDir | Out-Null }

$voicePathMap = @{
    "en_GB-southern_english_female-low" = "en/en_GB/southern_english_female/low/en_GB-southern_english_female-low"
    "en_US-lessac-medium" = "en/en_US/lessac/medium/en_US-lessac-medium"
    "en_US-ryan-medium" = "en/en_US/ryan/medium/en_US-ryan-medium"
}
$vPath = $voicePathMap[$ttsVoice]

if (-not (Test-Path "$voiceDir\$ttsVoice.onnx")) {
    & .\venv\Scripts\python.exe -m pip install --quiet huggingface-hub --no-cache-dir
    & .\venv\Scripts\python.exe -c "from huggingface_hub import hf_hub_download; hf_hub_download('rhasspy/piper-voices', '${vPath}.onnx', local_dir='models/piper', repo_type='model')"
    & .\venv\Scripts\python.exe -c "from huggingface_hub import hf_hub_download; hf_hub_download('rhasspy/piper-voices', '${vPath}.onnx.json', local_dir='models/piper', repo_type='model')"
}
Write-Host "Voice model ready." -ForegroundColor Green

Write-Host ""
Write-Host "[6/7] Configuration" -ForegroundColor Yellow
$apiKey = Read-Host "Enter your API key for $llmProvider (or press Enter to skip)"
if ($apiKey) {
    Set-Content -Path ".env" -Value "HACKCLUB_API_KEY=$apiKey"
}

$yaml = @"
lumi:
  wake_word: "$wakeWord"
  wake_word_sensitivity: 0.5
stt:
  model: "$sttModel"
  device: "cuda"
  compute_type: "float16"
  silence_threshold_ms: 1500
  language: null
llm:
  provider: "$llmProvider"
  api_key_env: "HACKCLUB_API_KEY"
  model: "openrouter/free"
  base_url: "https://ai.hackclub.com/proxy/v1"
  max_tokens: 2048
  temperature: 0.7
  system_prompt_path: "prompts/system.md"
  history_turns: 20
tts:
  engine: "piper"
  voice: "$ttsVoice"
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
