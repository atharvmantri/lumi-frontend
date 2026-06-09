# ============================================================
#  Lumi - Premium Interactive Installer
#  https://lumiassist.xyz
# ============================================================
$ErrorActionPreference = "Continue"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$installStart = Get-Date

# ── COLOR PALETTE ──────────────────────────────────────────
$c = @{
    Accent    = "Cyan"
    Heading   = "White"
    Body      = "Gray"
    Muted     = "DarkGray"
    Success   = "Green"
    Warn      = "Yellow"
    Error     = "Red"
    Highlight = "Magenta"
    Select    = "DarkCyan"
}

# ── BOX DRAWING ────────────────────────────────────────────
$box = @{
    H  = [char]0x2500  # ─
    V  = [char]0x2502  # │
    TL = [char]0x256D  # ╭
    TR = [char]0x256E  # ╮
    BL = [char]0x2570  # ╰
    BR = [char]0x256F  # ╯
    T  = [char]0x252C  # ┬
    B  = [char]0x2534  # ┴
    L  = [char]0x251C  # ├
    R  = [char]0x2524  # ┤
    Dot = [char]0x2022 # •
    Arr = [char]0x25B8 # ▸
    Chk = [char]0x2714 # ✔
    Spc = [char]0x2581 # ▁
}

# ── HELPER: Draw a boxed section ──────────────────────────
function Draw-Box {
    param([string]$Title, [int]$Width = 56)
    $inner = $Width - 2
    $pad = $inner - $Title.Length - 2
    if ($pad -lt 0) { $pad = 0 }
    Write-Host "  $($box.TL)$("$($box.H)" * $inner)$($box.TR)" -ForegroundColor $c.Accent
    Write-Host "  $($box.V) $Title$(" " * $pad) $($box.V)" -ForegroundColor $c.Accent
    Write-Host "  $($box.BL)$("$($box.H)" * $inner)$($box.BR)" -ForegroundColor $c.Accent
}

# ── HELPER: Section divider ───────────────────────────────
function Draw-Divider {
    param([int]$Width = 56)
    Write-Host ""
    Write-Host "  $("$($box.H)" * $Width)" -ForegroundColor $c.Muted
}

# ── HELPER: Typewriter effect ─────────────────────────────
function Write-Typed {
    param([string]$Text, [string]$Color = "White", [int]$Delay = 12)
    foreach ($char in $Text.ToCharArray()) {
        Write-Host $char -NoNewline -ForegroundColor $Color
        Start-Sleep -Milliseconds $Delay
    }
    Write-Host ""
}

# ── HELPER: Spinner for long operations ───────────────────
function Invoke-WithSpinner {
    param(
        [string]$Label,
        [scriptblock]$Action
    )
    $frames = @("    $($box.Arr) ", "   $($box.Arr)  ", "  $($box.Arr)   ", "   $($box.Arr)  ")
    $spinChars = @([char]0x2596, [char]0x2598, [char]0x259D, [char]0x2597)  # ▖ ▘ ▝ ▗
    
    $job = Start-Job -ScriptBlock $Action
    $i = 0
    $sw = [System.Diagnostics.Stopwatch]::StartNew()
    
    while ($job.State -eq "Running") {
        $elapsed = $sw.Elapsed.TotalSeconds
        $elStr = "{0:N1}s" -f $elapsed
        $spin = $spinChars[$i % 4]
        Write-Host "`r    $spin $Label ($elStr)" -NoNewline -ForegroundColor $c.Body
        Start-Sleep -Milliseconds 120
        $i++
    }
    $sw.Stop()
    $elapsed = $sw.Elapsed.TotalSeconds
    $elStr = "{0:N1}s" -f $elapsed
    
    $result = Receive-Job $job -ErrorAction SilentlyContinue
    Remove-Job $job -Force
    
    Write-Host "`r    $($box.Chk) $Label ($elStr)                    " -ForegroundColor $c.Success
    return $result
}

# ── HELPER: Step header ───────────────────────────────────
function Write-Step {
    param([int]$Num, [int]$Total, [string]$Text)
    $bar = ""
    for ($i = 1; $i -le $Total; $i++) {
        if ($i -lt $Num) { $bar += "$($box.Spc)" }
        elseif ($i -eq $Num) { $bar += "$($box.Spc)" }
        else { $bar += " " }
    }
    Write-Host ""
    Write-Host "  $($box.Arr) STEP $Num/$Total" -ForegroundColor $c.Accent -NoNewline
    Write-Host "  $Text" -ForegroundColor $c.Heading
}

# ── HELPER: Interactive menu ──────────────────────────────
function Show-Select {
    param(
        [string]$Prompt,
        [string[]]$Options,
        [string[]]$Descriptions = @(),
        [int]$Default = 0,
        [bool]$AllowCustom = $false,
        [string]$CustomLabel = "Enter a custom value"
    )
    Write-Host ""
    Write-Host "  $Prompt" -ForegroundColor $c.Heading
    Write-Host ""
    
    if ($AllowCustom) {
        Write-Host "    0 $($box.Dot) " -NoNewline -ForegroundColor $c.Select
        Write-Host "[Custom] $CustomLabel" -ForegroundColor $c.Select
    }
    
    for ($i = 0; $i -lt $Options.Count; $i++) {
        $num = $i + 1
        $isDefault = ($i -eq $Default)
        $marker = if ($isDefault) { "$($box.Arr)" } else { "$($box.Dot)" }
        $suffix = if ($isDefault) { " (default)" } else { "" }
        $color = if ($isDefault) { $c.Accent } else { $c.Body }
        
        Write-Host "    $num $marker " -NoNewline -ForegroundColor $color
        Write-Host "$($Options[$i])$suffix" -NoNewline -ForegroundColor $color
        if ($i -lt $Descriptions.Count -and $Descriptions[$i]) {
            Write-Host " - $($Descriptions[$i])" -ForegroundColor $c.Muted
        } else {
            Write-Host ""
        }
    }
    Write-Host ""
    $input = Read-Host "    Choice"
    
    if ($AllowCustom -and $input -eq "0") {
        return Read-Host "    $CustomLabel"
    }
    if (-not $input) { return $Options[$Default] }
    $idx = [int]$input - 1
    if ($idx -ge 0 -and $idx -lt $Options.Count) {
        return $Options[$idx]
    }
    return $Options[$Default]
}

# ── HELPER: Model selection from catalog ──────────────────
function Show-ModelPicker {
    param([string]$ProviderKey, [object]$Catalog)
    
    $provider = $Catalog.$ProviderKey
    if (-not $provider -or -not $provider.groups -or $provider.groups.Count -eq 0) {
        return (Read-Host "    Enter model ID")
    }

    Write-Host ""
    Write-Host "  Select a model for $($provider.label):" -ForegroundColor $c.Heading
    Write-Host ""
    Write-Host "    0 $($box.Dot) " -NoNewline -ForegroundColor $c.Select
    Write-Host "[Custom] Enter your own model ID" -ForegroundColor $c.Select

    $allModels = @()
    $counter = 1
    foreach ($group in $provider.groups) {
        Write-Host ""
        Write-Host "    $($box.H)$($box.H) $($group.name) $("$($box.H)" * (40 - $group.name.Length))" -ForegroundColor $c.Highlight
        foreach ($model in $group.models) {
            $allModels += $model
            $numStr = "{0,4}" -f $counter
            Write-Host "$numStr $($box.Dot) " -NoNewline -ForegroundColor $c.Body
            Write-Host "$($model.name)" -NoNewline -ForegroundColor $c.Heading
            Write-Host " - $($model.note)" -ForegroundColor $c.Muted
            $counter++
        }
    }
    Write-Host ""
    $choice = Read-Host "    Choice"
    if ($choice -eq "0") {
        return (Read-Host "    Enter custom model ID")
    }
    $idx = [int]$choice - 1
    if ($idx -ge 0 -and $idx -lt $allModels.Count) {
        $sel = $allModels[$idx]
        Write-Host "    $($box.Chk) $($sel.name) ($($sel.id))" -ForegroundColor $c.Success
        return $sel.id
    }
    $fallback = $allModels[0]
    Write-Host "    $($box.Chk) $($fallback.name) ($($fallback.id))" -ForegroundColor $c.Success
    return $fallback.id
}

# ╔════════════════════════════════════════════════════════════╗
# ║                      WELCOME SCREEN                       ║
# ╚════════════════════════════════════════════════════════════╝
Clear-Host
Write-Host ""
Write-Host ""
Write-Host "       ___                          ___  " -ForegroundColor Cyan
Write-Host "      /\  \                        /\  \ " -ForegroundColor Cyan
Write-Host "     /::\  \       ___   ___      /::\  \" -ForegroundColor Cyan
Write-Host "    /:/\:\  \     /\__\ /\__\    /:/\:\__\" -ForegroundColor DarkCyan
Write-Host "   /:/ /::\  \   /:/ / /:/ /   /:/ /:/  /" -ForegroundColor DarkCyan
Write-Host "  /:/_/:/\:\__\ /:/_/ /:/_/   /:/_/:/__/" -ForegroundColor DarkCyan
Write-Host "  \:\/:/  \/__/ \:\  / \:\  \  \:\/::::/ " -ForegroundColor Blue
Write-Host "   \::/__/       \:\__\ \:\__\  \::/~~/  " -ForegroundColor Blue
Write-Host "    \:\  \        \/__/  \/__/   \:\~~\  " -ForegroundColor Blue
Write-Host "     \:\__\                       \:\__\ " -ForegroundColor DarkBlue
Write-Host "      \/__/                        \/__/ " -ForegroundColor DarkBlue
Write-Host ""
Write-Host "  $("$($box.H)" * 50)" -ForegroundColor $c.Muted
Write-Typed "  Your private, offline AI voice assistant." $c.Body 15
Write-Host "  $("$($box.H)" * 50)" -ForegroundColor $c.Muted
Write-Host ""
Start-Sleep -Milliseconds 400

Write-Host "  This installer will configure and set up Lumi" -ForegroundColor $c.Body
Write-Host "  on your system. Everything runs locally on your" -ForegroundColor $c.Body
Write-Host "  hardware. Your data never leaves your machine." -ForegroundColor $c.Body
Write-Host ""
Start-Sleep -Milliseconds 300

Draw-Divider

Write-Host ""
Write-Host "  How would you like to set up Lumi?" -ForegroundColor $c.Heading
Write-Host ""
Write-Host "    1 $($box.Arr) " -NoNewline -ForegroundColor $c.Body
Write-Host "Quickstart" -NoNewline -ForegroundColor $c.Heading
Write-Host "  Uses smart defaults. Done in minutes." -ForegroundColor $c.Muted
Write-Host ""
Write-Host "    2 $($box.Arr) " -NoNewline -ForegroundColor $c.Accent
Write-Host "Custom" -NoNewline -ForegroundColor $c.Accent
Write-Host "      Choose your AI, voice, and settings." -ForegroundColor $c.Muted
Write-Host "               Recommended for most users." -ForegroundColor $c.Muted
Write-Host ""
$mode = Read-Host "    Choice (default: 2)"
if (-not $mode) { $mode = "2" }

# ╔════════════════════════════════════════════════════════════╗
# ║                        DEFAULTS                           ║
# ╚════════════════════════════════════════════════════════════╝
$sttModel     = "large-v3"
$sttDevice    = "cuda"
$sttCompute   = "float16"
$llmProvider  = "hackclub"
$llmModelId   = "openrouter/free"
$llmBaseUrl   = "https://ai.hackclub.com/proxy/v1"
$llmApiKeyEnv = "HACKCLUB_API_KEY"
$ttsVoice     = "en_GB-southern_english_female-low"
$wakeWord     = "hey lumi"
$apiKeyValue  = ""

# ── FETCH MODEL CATALOG ──────────────────────────────────
$catalog = $null
try {
    $catalog = Invoke-RestMethod -Uri "https://www.lumiassist.xyz/models.json" -ErrorAction Stop
} catch {
    # Silent fallback
}

# ╔════════════════════════════════════════════════════════════╗
# ║                   CUSTOM CONFIGURATION                    ║
# ╚════════════════════════════════════════════════════════════╝
if ($mode -eq "2") {
    Draw-Divider
    Draw-Box "CONFIGURATION"
    
    # ── Wake Word ──
    Write-Host ""
    Write-Host "  What phrase should wake Lumi up?" -ForegroundColor $c.Heading
    Write-Host "  This is what you say to get Lumi's attention." -ForegroundColor $c.Muted
    Write-Host ""
    $inputWake = Read-Host "    Wake word (default: hey lumi)"
    if ($inputWake) { $wakeWord = $inputWake }
    Write-Host "    $($box.Chk) Wake word: $wakeWord" -ForegroundColor $c.Success

    # ── Speech-to-Text ──
    Draw-Divider
    $sttModel = Show-Select `
        -Prompt "Speech-to-Text model (Whisper):" `
        -Options @("tiny", "base", "small", "medium", "large-v3") `
        -Descriptions @(
            "Fastest. ~1GB RAM. Lower accuracy",
            "Quick. ~1GB RAM. Decent accuracy",
            "Balanced. ~2GB RAM. Good accuracy",
            "Accurate. ~5GB RAM. Slower",
            "Best accuracy. ~10GB RAM"
        ) `
        -Default 4
    Write-Host "    $($box.Chk) STT: $sttModel" -ForegroundColor $c.Success
    
    # ── STT Device ──
    $devResult = Show-Select `
        -Prompt "Compute device for speech recognition:" `
        -Options @("GPU (CUDA)", "CPU only") `
        -Descriptions @(
            "Much faster. Requires NVIDIA GPU",
            "Works everywhere. Slower"
        ) `
        -Default 0
    if ($devResult -eq "CPU only") {
        $sttDevice = "cpu"
        $sttCompute = "int8"
    }
    Write-Host "    $($box.Chk) Device: $sttDevice ($sttCompute)" -ForegroundColor $c.Success

    # ── LLM Provider ──
    Draw-Divider
    $providerKeys  = @("hackclub", "openrouter", "openai", "anthropic", "google", "ollama", "custom")
    $providerLabels = @(
        "HackClub Free",
        "OpenRouter",
        "OpenAI Direct",
        "Anthropic Direct",
        "Google AI Direct",
        "Ollama (Local)",
        "Custom Provider"
    )
    $providerDescs = @(
        "HackClub AI Proxy (Requires HackClub API key)",
        "One key, access all major models",
        "GPT-5.5, GPT-5.4, GPT-4.1, and more",
        "Claude Opus 4.8, Sonnet 4.6, Haiku 4.5",
        "Gemini 3.5 Flash, 2.5 Pro, and more",
        "Run models locally on your own machine",
        "Bring your own endpoint and API key"
    )
    
    $provResult = Show-Select `
        -Prompt "Choose your AI provider:" `
        -Options $providerLabels `
        -Descriptions $providerDescs `
        -Default 0
    
    $provIdx = [array]::IndexOf($providerLabels, $provResult)
    if ($provIdx -lt 0) { $provIdx = 0 }
    $llmProvider = $providerKeys[$provIdx]
    
    if ($catalog -and $catalog.$llmProvider) {
        $llmBaseUrl   = $catalog.$llmProvider.base_url
        $llmApiKeyEnv = $catalog.$llmProvider.api_key_env
    }
    
    if ($llmProvider -eq "custom") {
        Write-Host ""
        $llmBaseUrl = Read-Host "    Enter your API base URL"
        $llmApiKeyEnv = "CUSTOM_API_KEY"
    }
    
    Write-Host "    $($box.Chk) Provider: $($providerLabels[$provIdx])" -ForegroundColor $c.Success
    
    # ── LLM Model ──
    Draw-Divider
    if ($catalog) {
        $llmModelId = Show-ModelPicker -ProviderKey $llmProvider -Catalog $catalog
    } else {
        Write-Host ""
        $llmModelId = Read-Host "    Enter model ID"
    }
    
    # ── API Key ──
    if ($llmProvider -ne "ollama") {
        Write-Host ""
        Write-Host "  Enter your API key for $($providerLabels[$provIdx]):" -ForegroundColor $c.Heading
        Write-Host "  This will be saved in .env and never transmitted anywhere." -ForegroundColor $c.Muted
        Write-Host ""
        $apiKeyValue = Read-Host "    API key (or press Enter to set up later)"
    } else {
        $apiKeyValue = "ollama"
    }

    # ── TTS Voice ──
    Draw-Divider
    $voiceIds = @(
        "en_GB-southern_english_female-low",
        "en_US-lessac-medium",
        "en_US-ryan-medium",
        "en_GB-alan-medium",
        "de_DE-thorsten-medium",
        "fr_FR-siwis-medium",
        "es_ES-davefx-medium"
    )
    $voiceLabels = @(
        "English (GB) Female",
        "English (US) Female",
        "English (US) Male",
        "English (GB) Male",
        "German Male",
        "French Female",
        "Spanish Male"
    )
    $voiceDescs = @(
        "Warm, natural British accent",
        "Clear, professional American",
        "Deep, authoritative American",
        "Classic British male",
        "Natural German speaker",
        "Smooth French speaker",
        "Clear Spanish speaker"
    )
    
    $voiceResult = Show-Select `
        -Prompt "Choose Lumi's voice:" `
        -Options $voiceLabels `
        -Descriptions $voiceDescs `
        -Default 0 `
        -AllowCustom $true `
        -CustomLabel "Enter a custom Piper voice ID"
    
    $voiceIdx = [array]::IndexOf($voiceLabels, $voiceResult)
    if ($voiceIdx -ge 0) {
        $ttsVoice = $voiceIds[$voiceIdx]
    } else {
        $ttsVoice = $voiceResult
    }
    Write-Host "    $($box.Chk) Voice: $ttsVoice" -ForegroundColor $c.Success
}

# ╔════════════════════════════════════════════════════════════╗
# ║                   CONFIGURATION SUMMARY                   ║
# ╚════════════════════════════════════════════════════════════╝
Draw-Divider
Draw-Box "REVIEW YOUR CONFIGURATION"
Write-Host ""

$summaryItems = @(
    @("Wake Word",    $wakeWord),
    @("STT Model",    "$sttModel ($sttDevice)"),
    @("LLM Provider", $llmProvider),
    @("LLM Model",    $llmModelId),
    @("TTS Voice",    $ttsVoice)
)

foreach ($item in $summaryItems) {
    $label = "{0,-14}" -f $item[0]
    Write-Host "    $($box.V) " -NoNewline -ForegroundColor $c.Muted
    Write-Host "$label" -NoNewline -ForegroundColor $c.Accent
    Write-Host " $($item[1])" -ForegroundColor $c.Heading
}

Write-Host ""
Write-Host "  Press Enter to begin, or Ctrl+C to abort." -ForegroundColor $c.Muted
Read-Host "  "

# ╔════════════════════════════════════════════════════════════╗
# ║                     INSTALLATION                          ║
# ╚════════════════════════════════════════════════════════════╝
Draw-Divider
Draw-Box "INSTALLING"

# ── STEP 1: Repository ───────────────────────────────────
Write-Step -Num 1 -Total 7 -Text "Repository"
$target = "$HOME\Lumi-Assist"
if (Test-Path $target) {
    Write-Host "    $($box.Dot) Found existing installation. Pulling updates..." -ForegroundColor $c.Body
    Set-Location $target
    git pull --quiet 2>$null
    Write-Host "    $($box.Chk) Repository updated." -ForegroundColor $c.Success
} else {
    Write-Host "    $($box.Dot) Cloning to $target..." -ForegroundColor $c.Body
    git clone --quiet https://github.com/atharvmantri/Lumi-Assist.git $target
    Set-Location $target
    Write-Host "    $($box.Chk) Repository cloned." -ForegroundColor $c.Success
}

# ── STEP 2: Python ────────────────────────────────────────
Write-Step -Num 2 -Total 7 -Text "Python Environment"
$pyCmd = $null
if (Get-Command "py" -ErrorAction SilentlyContinue) {
    try {
        $ver = & py -3.11 --version 2>$null
        if ($LASTEXITCODE -eq 0) {
            $pyCmd = "py -3.11"
            Write-Host "    $($box.Chk) $ver (py launcher)" -ForegroundColor $c.Success
        }
    } catch {}
}
if (-not $pyCmd) {
    if (Get-Command "python" -ErrorAction SilentlyContinue) {
        $ver = & python --version 2>$null
        $pyCmd = "python"
        Write-Host "    $($box.Chk) $ver" -ForegroundColor $c.Success
    } else {
        Write-Host "    X Python not found!" -ForegroundColor $c.Error
        Write-Host "      Install Python 3.11+ from python.org/downloads" -ForegroundColor $c.Error
        Read-Host "      Press Enter to exit"
        exit 1
    }
}

# ── STEP 3: Virtual Environment ──────────────────────────
Write-Step -Num 3 -Total 7 -Text "Virtual Environment"
if (-not (Test-Path "venv")) {
    Write-Host "    $($box.Dot) Creating isolated Python environment..." -ForegroundColor $c.Body
    Invoke-Expression "$pyCmd -m venv venv" 2>$null
    Write-Host "    $($box.Chk) Virtual environment created." -ForegroundColor $c.Success
} else {
    Write-Host "    $($box.Chk) Already exists. Reusing." -ForegroundColor $c.Success
}

# ── STEP 4: Dependencies ─────────────────────────────────
Write-Step -Num 4 -Total 7 -Text "Dependencies"
Write-Host "    $($box.Dot) Installing packages. This may take a few minutes..." -ForegroundColor $c.Body
$sw4 = [System.Diagnostics.Stopwatch]::StartNew()
& .\venv\Scripts\python.exe -m pip install --quiet --upgrade pip --no-cache-dir 2>$null
& .\venv\Scripts\python.exe -m pip install --quiet -r requirements.txt --no-cache-dir 2>$null
$sw4.Stop()
$t4 = "{0:N1}s" -f $sw4.Elapsed.TotalSeconds
Write-Host "    $($box.Chk) All dependencies installed. ($t4)" -ForegroundColor $c.Success

# ── STEP 5: Voice Model ──────────────────────────────────
Write-Step -Num 5 -Total 7 -Text "Voice Model"
$voiceDir = "models\piper"
if (-not (Test-Path $voiceDir)) { New-Item -ItemType Directory -Force -Path $voiceDir | Out-Null }

$parts = $ttsVoice -split "-"
if ($parts.Count -ge 3) {
    $langRegion = $parts[0]
    $lang = $langRegion.Split("_")[0]
    $quality = $parts[-1]
    $nameParts = $parts[1..($parts.Count - 2)]
    $name = $nameParts -join "_"
    $hfPath = "$lang/$langRegion/$name/$quality/$ttsVoice"

    if (-not (Test-Path "$voiceDir\$ttsVoice.onnx")) {
        Write-Host "    $($box.Dot) Downloading $ttsVoice from HuggingFace..." -ForegroundColor $c.Body
        $sw5 = [System.Diagnostics.Stopwatch]::StartNew()
        & .\venv\Scripts\python.exe -m pip install --quiet huggingface-hub --no-cache-dir 2>$null
        try {
            & .\venv\Scripts\python.exe -c "from huggingface_hub import hf_hub_download; hf_hub_download('rhasspy/piper-voices', '$hfPath.onnx', local_dir='models/piper')" 2>$null
            & .\venv\Scripts\python.exe -c "from huggingface_hub import hf_hub_download; hf_hub_download('rhasspy/piper-voices', '$hfPath.onnx.json', local_dir='models/piper')" 2>$null
            $sw5.Stop()
            $t5 = "{0:N1}s" -f $sw5.Elapsed.TotalSeconds
            Write-Host "    $($box.Chk) Voice model ready. ($t5)" -ForegroundColor $c.Success
        } catch {
            Write-Host "    ! Could not download automatically." -ForegroundColor $c.Warn
            Write-Host "      You can grab it from: huggingface.co/rhasspy/piper-voices" -ForegroundColor $c.Muted
        }
    } else {
        Write-Host "    $($box.Chk) Already downloaded." -ForegroundColor $c.Success
    }
} else {
    Write-Host "    $($box.Dot) Custom voice ID. Skipping auto-download." -ForegroundColor $c.Body
    Write-Host "      Place .onnx files in models/piper/ manually." -ForegroundColor $c.Muted
}

# ── STEP 6: Configuration Files ──────────────────────────
Write-Step -Num 6 -Total 7 -Text "Configuration Files"

$envContent = ""
if ($apiKeyValue) {
    $envContent = "$llmApiKeyEnv=$apiKeyValue"
} elseif ($llmProvider -eq "hackclub") {
    $envContent = "HACKCLUB_API_KEY="
}
Set-Content -Path ".env" -Value $envContent

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
Write-Host "    $($box.Chk) config.yaml written." -ForegroundColor $c.Success
Write-Host "    $($box.Chk) .env written." -ForegroundColor $c.Success

# ── STEP 7: Finalize ─────────────────────────────────────
Write-Step -Num 7 -Total 7 -Text "Finalizing"
$dirs = @("data\conversations", "logs\learning", "logs\screenshots", "data\wake_samples")
foreach ($dir in $dirs) {
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
}
Write-Host "    $($box.Chk) All directories created." -ForegroundColor $c.Success

# ╔════════════════════════════════════════════════════════════╗
# ║                       COMPLETE                            ║
# ╚════════════════════════════════════════════════════════════╝
$totalTime = ((Get-Date) - $installStart).TotalSeconds
$totalStr = "{0:N0}" -f $totalTime

Write-Host ""
Write-Host ""
Write-Host "  $("$($box.TL)")$("$($box.H)" * 52)$("$($box.TR)")" -ForegroundColor $c.Success
Write-Host "  $($box.V)                                                    $($box.V)" -ForegroundColor $c.Success
Write-Host "  $($box.V)   " -NoNewline -ForegroundColor $c.Success
Write-Host "Installation complete." -NoNewline -ForegroundColor Green
Write-Host "                       $($box.V)" -ForegroundColor $c.Success
Write-Host "  $($box.V)                                                    $($box.V)" -ForegroundColor $c.Success
Write-Host "  $("$($box.BL)")$("$($box.H)" * 52)$("$($box.BR)")" -ForegroundColor $c.Success
Write-Host ""

$finalItems = @(
    @("Location",  $target),
    @("Provider",  "$llmProvider / $llmModelId"),
    @("Voice",     $ttsVoice),
    @("Time",      "${totalStr}s")
)

foreach ($item in $finalItems) {
    $label = "{0,-10}" -f $item[0]
    Write-Host "    $($box.Dot) " -NoNewline -ForegroundColor $c.Muted
    Write-Host "$label" -NoNewline -ForegroundColor $c.Accent
    Write-Host " $($item[1])" -ForegroundColor $c.Body
}

Write-Host ""
Write-Host "  $("$($box.H)" * 52)" -ForegroundColor $c.Muted
Write-Host ""
Write-Host "    To launch Lumi:" -ForegroundColor $c.Heading
Write-Host ""
Write-Host "      cd $target" -ForegroundColor $c.Accent
Write-Host "      .\launch.bat" -ForegroundColor $c.Accent
Write-Host ""
Write-Host "    To reconfigure, edit config.yaml or run" -ForegroundColor $c.Muted
Write-Host "    this installer again." -ForegroundColor $c.Muted
Write-Host ""
Write-Host ""
