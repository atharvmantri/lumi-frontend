# ============================================================
#  Lumi - Interactive Installer
#  https://lumiassist.xyz
# ============================================================
$ErrorActionPreference = "Continue"

# --- Helper Functions ---
function Write-Step {
    param([string]$Step, [string]$Text)
    Write-Host ""
    Write-Host "  [$Step] $Text" -ForegroundColor Yellow
}

function Write-Done {
    param([string]$Text)
    Write-Host "       $Text" -ForegroundColor Green
}

function Write-Info {
    param([string]$Text)
    Write-Host "       $Text" -ForegroundColor DarkGray
}

function Write-Err {
    param([string]$Text)
    Write-Host "       $Text" -ForegroundColor Red
}

function Write-Header {
    param([string]$Text)
    $line = "=" * 50
    Write-Host ""
    Write-Host "  $line" -ForegroundColor Cyan
    Write-Host "    $Text" -ForegroundColor Cyan
    Write-Host "  $line" -ForegroundColor Cyan
}

function Show-Menu {
    param(
        [string]$Title,
        [string[]]$Options,
        [string]$CustomPrompt = "Or type a custom value",
        [bool]$AllowCustom = $true
    )
    Write-Host ""
    Write-Host "  $Title" -ForegroundColor Yellow
    Write-Host "  $("-" * $Title.Length)" -ForegroundColor DarkGray
    if ($AllowCustom) {
        Write-Host "   0) [Custom] Enter your own value" -ForegroundColor DarkCyan
    }
    for ($i = 0; $i -lt $Options.Count; $i++) {
        Write-Host "   $($i + 1)) $($Options[$i])"
    }
    Write-Host ""
    $choice = Read-Host "  Select (number)"
    if ($AllowCustom -and $choice -eq "0") {
        $custom = Read-Host "  Enter custom value"
        return $custom
    }
    $idx = [int]$choice - 1
    if ($idx -ge 0 -and $idx -lt $Options.Count) {
        return $Options[$idx]
    }
    return $Options[0]
}

function Show-ModelMenu {
    param(
        [string]$ProviderKey,
        [object]$Catalog
    )
    $provider = $Catalog.$ProviderKey
    if (-not $provider -or -not $provider.groups -or $provider.groups.Count -eq 0) {
        $custom = Read-Host "  Enter model ID"
        return $custom
    }

    Write-Host ""
    Write-Host "  Choose a model for $($provider.label):" -ForegroundColor Yellow
    Write-Host "  $("-" * 40)" -ForegroundColor DarkGray
    Write-Host "   0) [Custom] Enter your own model ID" -ForegroundColor DarkCyan

    $allModels = @()
    $counter = 1
    foreach ($group in $provider.groups) {
        Write-Host ""
        Write-Host "   -- $($group.name) --" -ForegroundColor Magenta
        foreach ($model in $group.models) {
            $tag = "$($model.name)"
            $note = " ($($model.note))"
            Write-Host "   $counter) $tag" -NoNewline
            Write-Host $note -ForegroundColor DarkGray
            $allModels += $model
            $counter++
        }
    }
    Write-Host ""
    $choice = Read-Host "  Select (number)"
    if ($choice -eq "0") {
        $custom = Read-Host "  Enter custom model ID"
        return $custom
    }
    $idx = [int]$choice - 1
    if ($idx -ge 0 -and $idx -lt $allModels.Count) {
        $selected = $allModels[$idx]
        Write-Done "Selected: $($selected.name) ($($selected.id))"
        return $selected.id
    }
    Write-Info "Invalid selection, using first model as default."
    $fallback = $allModels[0]
    return $fallback.id
}

# ============================================================
#  BANNER
# ============================================================
Clear-Host
Write-Host ""
Write-Host "  LL      UU   UU  MM     MM  IIIIII" -ForegroundColor Cyan
Write-Host "  LL      UU   UU  MMM   MMM    II  " -ForegroundColor Cyan
Write-Host "  LL      UU   UU  MM M M MM    II  " -ForegroundColor Cyan
Write-Host "  LL      UU   UU  MM  M  MM    II  " -ForegroundColor Cyan
Write-Host "  LLLLLL   UUUUU   MM     MM  IIIIII" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Your Private AI Voice Assistant" -ForegroundColor DarkGray
Write-Host "  ------------------------------------------------" -ForegroundColor DarkGray
Write-Host ""
Write-Host "  Welcome! This installer will set up Lumi on" -ForegroundColor White
Write-Host "  your machine in just a few minutes." -ForegroundColor White
Write-Host ""
Write-Host "  Choose an installation mode:" -ForegroundColor Yellow
Write-Host ""
Write-Host "   1) Quickstart" -ForegroundColor White
Write-Host "      Uses sensible defaults. Done in under 5 min." -ForegroundColor DarkGray
Write-Host ""
Write-Host "   2) Custom  [Recommended]" -ForegroundColor Green
Write-Host "      Pick your AI provider, model, voice, and more." -ForegroundColor DarkGray
Write-Host ""
$mode = Read-Host "  Enter your choice (1 or 2)"

# ============================================================
#  DEFAULTS
# ============================================================
$sttModel       = "large-v3"
$sttDevice      = "cuda"
$sttCompute     = "float16"
$llmProvider    = "hackclub"
$llmModelId     = "openrouter/free"
$llmBaseUrl     = "https://ai.hackclub.com/proxy/v1"
$llmApiKeyEnv   = "HACKCLUB_API_KEY"
$ttsVoice       = "en_GB-southern_english_female-low"
$wakeWord       = "hey lumi"
$apiKeyValue    = ""

# ============================================================
#  DOWNLOAD MODEL CATALOG
# ============================================================
$catalog = $null
try {
    $catalogJson = Invoke-RestMethod -Uri "https://www.lumiassist.xyz/models.json" -ErrorAction Stop
    $catalog = $catalogJson
} catch {
    Write-Info "Could not fetch model catalog from server. Using built-in defaults."
}

# ============================================================
#  CUSTOM CONFIGURATION
# ============================================================
if ($mode -eq "2") {
    Write-Header "Custom Configuration"

    # --- Wake Word ---
    Write-Host ""
    Write-Host "  What should Lumi listen for?" -ForegroundColor Yellow
    $inputWake = Read-Host "  Wake word (default: hey lumi)"
    if ($inputWake) { $wakeWord = $inputWake }

    # --- Speech-to-Text ---
    $sttOptions = @(
        "tiny       - Fastest, lowest accuracy",
        "base       - Good for quick tasks",
        "small      - Balanced",
        "medium     - High accuracy",
        "large-v3   - Best accuracy (default)"
    )
    $sttNames = @("tiny", "base", "small", "medium", "large-v3")
    Write-Host ""
    Write-Host "  Choose a Speech-to-Text (Whisper) model:" -ForegroundColor Yellow
    Write-Host "  $("-" * 42)" -ForegroundColor DarkGray
    for ($i = 0; $i -lt $sttOptions.Count; $i++) {
        Write-Host "   $($i + 1)) $($sttOptions[$i])"
    }
    Write-Host ""
    $sttChoice = Read-Host "  Select (1-5, default: 5)"
    if ($sttChoice -match "^[1-5]$") {
        $sttModel = $sttNames[[int]$sttChoice - 1]
    }
    Write-Done "STT Model: $sttModel"

    # --- STT Device ---
    Write-Host ""
    Write-Host "  STT compute device:" -ForegroundColor Yellow
    Write-Host "   1) cuda  - GPU, much faster (default)"
    Write-Host "   2) cpu   - No GPU required"
    $devChoice = Read-Host "  Select (1-2, default: 1)"
    if ($devChoice -eq "2") {
        $sttDevice = "cpu"
        $sttCompute = "int8"
    }
    Write-Done "Device: $sttDevice ($sttCompute)"

    # --- LLM Provider ---
    $providerKeys  = @("hackclub", "openrouter", "openai", "anthropic", "google", "custom")
    $providerNames = @(
        "HackClub Free    - Free tier, no API key needed",
        "OpenRouter       - Access all models via one key",
        "OpenAI Direct    - GPT-5.5, GPT-5.4, etc.",
        "Anthropic Direct - Claude Opus 4.8, Sonnet 4.6, etc.",
        "Google AI Direct - Gemini 3.5 Flash, 2.5 Pro, etc.",
        "Custom Provider  - BYO endpoint and key"
    )
    Write-Host ""
    Write-Host "  Choose your LLM Provider:" -ForegroundColor Yellow
    Write-Host "  $("-" * 42)" -ForegroundColor DarkGray
    for ($i = 0; $i -lt $providerNames.Count; $i++) {
        Write-Host "   $($i + 1)) $($providerNames[$i])"
    }
    Write-Host ""
    $provChoice = Read-Host "  Select (1-6, default: 1)"
    if (-not $provChoice) { $provChoice = "1" }
    $provIdx = [int]$provChoice - 1
    if ($provIdx -lt 0 -or $provIdx -ge $providerKeys.Count) { $provIdx = 0 }
    $llmProvider = $providerKeys[$provIdx]

    # Set base_url and api_key_env from catalog
    if ($catalog -and $catalog.$llmProvider) {
        $llmBaseUrl   = $catalog.$llmProvider.base_url
        $llmApiKeyEnv = $catalog.$llmProvider.api_key_env
    }

    # Custom provider needs manual URL
    if ($llmProvider -eq "custom") {
        $llmBaseUrl = Read-Host "  Enter your API base URL (e.g. http://localhost:1234/v1)"
        $llmApiKeyEnv = "CUSTOM_API_KEY"
    }

    # --- LLM Model ---
    if ($catalog) {
        $llmModelId = Show-ModelMenu -ProviderKey $llmProvider -Catalog $catalog
    } else {
        $llmModelId = Read-Host "  Enter model ID (e.g. gpt-5.4-mini, claude-sonnet-4-6)"
    }

    # --- API Key ---
    if ($llmProvider -ne "hackclub") {
        Write-Host ""
        $apiKeyValue = Read-Host "  Enter your API key for $($providerNames[$provIdx].Split('-')[0].Trim()) (or Enter to skip)"
    }

    # --- TTS Voice ---
    $voiceOptions = @(
        "en_GB-southern_english_female-low   - English GB Female (default)",
        "en_US-lessac-medium                 - English US Female",
        "en_US-ryan-medium                   - English US Male",
        "en_GB-alan-medium                   - English GB Male",
        "de_DE-thorsten-medium               - German Male",
        "fr_FR-siwis-medium                  - French Female",
        "es_ES-davefx-medium                 - Spanish Male"
    )
    $voiceIds = @(
        "en_GB-southern_english_female-low",
        "en_US-lessac-medium",
        "en_US-ryan-medium",
        "en_GB-alan-medium",
        "de_DE-thorsten-medium",
        "fr_FR-siwis-medium",
        "es_ES-davefx-medium"
    )
    Write-Host ""
    Write-Host "  Choose a TTS Voice (Piper):" -ForegroundColor Yellow
    Write-Host "  $("-" * 42)" -ForegroundColor DarkGray
    Write-Host "   0) [Custom] Enter your own voice ID" -ForegroundColor DarkCyan
    for ($i = 0; $i -lt $voiceOptions.Count; $i++) {
        Write-Host "   $($i + 1)) $($voiceOptions[$i])"
    }
    Write-Host ""
    $voiceChoice = Read-Host "  Select (0-$($voiceOptions.Count), default: 1)"
    if ($voiceChoice -eq "0") {
        $ttsVoice = Read-Host "  Enter custom Piper voice ID"
    } elseif ($voiceChoice -match "^[1-7]$") {
        $ttsVoice = $voiceIds[[int]$voiceChoice - 1]
    }
    Write-Done "Voice: $ttsVoice"
}

# ============================================================
#  CONFIGURATION SUMMARY
# ============================================================
Write-Header "Configuration Summary"
Write-Host ""
Write-Host "   Wake Word  : $wakeWord" -ForegroundColor White
Write-Host "   STT Model  : $sttModel ($sttDevice)" -ForegroundColor White
Write-Host "   LLM        : $llmProvider / $llmModelId" -ForegroundColor White
Write-Host "   TTS Voice  : $ttsVoice" -ForegroundColor White
Write-Host ""
Write-Host "  Press Enter to begin installation, or Ctrl+C to abort." -ForegroundColor DarkGray
Read-Host "  "

# ============================================================
#  STEP 1: Clone / Update Repository
# ============================================================
$target = "$HOME\Lumi-Assist"
if (Test-Path $target) {
    Write-Step "1/7" "Updating existing repository..."
    Set-Location $target
    git pull --quiet 2>$null
    Write-Done "Repository updated."
} else {
    Write-Step "1/7" "Cloning Lumi-Assist..."
    Write-Info "Downloading to $target"
    git clone --quiet https://github.com/atharvmantri/Lumi-Assist.git $target
    Set-Location $target
    Write-Done "Repository cloned."
}

# ============================================================
#  STEP 2: Python Check
# ============================================================
Write-Step "2/7" "Checking Python..."
$pyCmd = $null
# Try py launcher first (Python 3.11)
if (Get-Command "py" -ErrorAction SilentlyContinue) {
    try {
        $ver = & py -3.11 --version 2>$null
        if ($LASTEXITCODE -eq 0) {
            $pyCmd = "py -3.11"
            Write-Done "Found: $ver (via py launcher)"
        }
    } catch {}
}
# Fallback to python on PATH
if (-not $pyCmd) {
    if (Get-Command "python" -ErrorAction SilentlyContinue) {
        $ver = & python --version 2>$null
        $pyCmd = "python"
        Write-Done "Found: $ver"
    } else {
        Write-Err "Python not found! Please install Python 3.11+ and re-run."
        Write-Err "Download: https://www.python.org/downloads/"
        Read-Host "Press Enter to exit"
        exit 1
    }
}

# ============================================================
#  STEP 3: Virtual Environment
# ============================================================
Write-Step "3/7" "Setting up virtual environment..."
if (-not (Test-Path "venv")) {
    Invoke-Expression "$pyCmd -m venv venv" 2>$null
    Write-Done "Virtual environment created."
} else {
    Write-Done "Virtual environment already exists."
}

# ============================================================
#  STEP 4: Dependencies
# ============================================================
Write-Step "4/7" "Installing dependencies..."
Write-Info "This may take 2-5 minutes on first install."
& .\venv\Scripts\python.exe -m pip install --quiet --upgrade pip --no-cache-dir 2>$null
& .\venv\Scripts\python.exe -m pip install --quiet -r requirements.txt --no-cache-dir 2>$null
Write-Done "All dependencies installed."

# ============================================================
#  STEP 5: Voice Model
# ============================================================
Write-Step "5/7" "Downloading voice model ($ttsVoice)..."
$voiceDir = "models\piper"
if (-not (Test-Path $voiceDir)) { New-Item -ItemType Directory -Force -Path $voiceDir | Out-Null }

# Build the HuggingFace path from voice ID
# Voice ID format: lang_REGION-name-quality -> lang/lang_REGION/name/quality/full_id
$parts = $ttsVoice -split "-"
if ($parts.Count -ge 3) {
    $langRegion = $parts[0]       # e.g. en_GB
    $lang = $langRegion.Split("_")[0]  # e.g. en
    $quality = $parts[-1]          # e.g. low, medium
    $nameParts = $parts[1..($parts.Count - 2)]
    $name = $nameParts -join "_"   # e.g. southern_english_female

    $hfPath = "$lang/$langRegion/$name/$quality/$ttsVoice"

    if (-not (Test-Path "$voiceDir\$ttsVoice.onnx")) {
        & .\venv\Scripts\python.exe -m pip install --quiet huggingface-hub --no-cache-dir 2>$null
        try {
            & .\venv\Scripts\python.exe -c "from huggingface_hub import hf_hub_download; hf_hub_download('rhasspy/piper-voices', '$hfPath.onnx', local_dir='models/piper')" 2>$null
            & .\venv\Scripts\python.exe -c "from huggingface_hub import hf_hub_download; hf_hub_download('rhasspy/piper-voices', '$hfPath.onnx.json', local_dir='models/piper')" 2>$null
            Write-Done "Voice model downloaded."
        } catch {
            Write-Err "Could not download voice model. You can download it manually later."
            Write-Info "Repo: https://huggingface.co/rhasspy/piper-voices"
        }
    } else {
        Write-Done "Voice model already present."
    }
} else {
    Write-Info "Non-standard voice ID format. Skipping auto-download."
    Write-Info "You can manually place .onnx files in models/piper/"
}

# ============================================================
#  STEP 6: Write Configuration
# ============================================================
Write-Step "6/7" "Writing configuration..."

# Write .env
$envContent = ""
if ($apiKeyValue) {
    $envContent = "$llmApiKeyEnv=$apiKeyValue"
}
if ($llmProvider -eq "hackclub") {
    $envContent = "HACKCLUB_API_KEY="
}
Set-Content -Path ".env" -Value $envContent

# Write config.yaml
$yaml = @"
lumi:
  wake_word: "$wakeWord"
  wake_word_sensitivity: 0.5

stt:
  model: "$sttModel"
  device: "$sttDevice"
  compute_type: "$sttCompute"
  silence_threshold_ms: 1500
  language: null

llm:
  provider: "$llmProvider"
  api_key_env: "$llmApiKeyEnv"
  model: "$llmModelId"
  base_url: "$llmBaseUrl"
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
Write-Done "config.yaml and .env written."

# ============================================================
#  STEP 7: Finalize
# ============================================================
Write-Step "7/7" "Finalizing..."
$dirs = @("data\conversations", "logs\learning", "logs\screenshots", "data\wake_samples")
foreach ($dir in $dirs) {
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
}
Write-Done "Directory structure created."

# ============================================================
#  DONE
# ============================================================
Write-Host ""
Write-Host "  ==================================================" -ForegroundColor Green
Write-Host "    Installation Complete!                           " -ForegroundColor Green
Write-Host "  ==================================================" -ForegroundColor Green
Write-Host ""
Write-Host "   Installed to : $target" -ForegroundColor White
Write-Host "   LLM          : $llmProvider / $llmModelId" -ForegroundColor White
Write-Host "   Voice        : $ttsVoice" -ForegroundColor White
Write-Host ""
Write-Host "   To start Lumi, open that folder and" -ForegroundColor White
Write-Host "   double-click `"launch.bat`"" -ForegroundColor Cyan
Write-Host ""
Write-Host "   To reconfigure, edit config.yaml or" -ForegroundColor DarkGray
Write-Host "   re-run the installer." -ForegroundColor DarkGray
Write-Host ""
