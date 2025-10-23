@echo off
:: Usage: set-webhook.cmd <local|prod|test> <WEBHOOK_URL>
:: Example: set-webhook.cmd prod https://your-host/webhook/ai-resume-upload
powershell -ExecutionPolicy Bypass -File "%~dp0scripts\set-webhook.ps1" %*
if %errorlevel% neq 0 (
  echo Failed to update webhook URL.
  exit /b %errorlevel%
)
echo Done.
