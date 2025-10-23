param(
  [Parameter(Mandatory=$true)][ValidateSet('local','prod','test')][string]$Env,
  [Parameter(Mandatory=$true)][string]$Url
)

$root = Split-Path -Parent $MyInvocation.MyCommand.Path | Split-Path -Parent
$configPath = Join-Path $root 'config.js'

if (-not (Test-Path $configPath)) {
  Write-Error "config.js not found at $configPath"
  exit 1
}

# Read file
$content = Get-Content $configPath -Raw

# Escape URL for JS string
$escaped = $Url.Replace("'", "\'")

# Build regex to replace the value in the urls object
$regex = "($Env\s*:\s*')(.*?)(')"
$newContent = [System.Text.RegularExpressions.Regex]::Replace($content, $regex, "`${1}$escaped`${3}")

# Write back
Set-Content -Path $configPath -Value $newContent -NoNewline

Write-Host "Updated $Env webhook URL in config.js -> $Url"
