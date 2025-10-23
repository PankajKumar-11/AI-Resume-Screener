# AI Resume Screener

Upload a resume and forward it to an n8n workflow that extracts text, matches jobs, and returns a result. This repo contains the static frontend (`index.html`, `screener.css`) and deployment helpers.

## Quick start

1. Copy env template and set secrets:
   - Duplicate `.env.example` to `.env`
   - Replace every `YOUR_KEY_VALUE` with your real credentials (do NOT commit `.env`)
2. Host n8n (Railway/Render/Docker/local) and get a public webhook URL
3. Set your webhook URL using the helper script (see below)
4. Open `index.html` in a browser and submit a test resume

## Secrets and security

- Do not commit secrets. GitHub secret scanning will block pushes if secrets are detected.
- Files intentionally ignored: `n8n_data/`, `.env*`, workflow exports with credentials.
- If you accidentally committed a key, rotate it in the provider dashboard (Airtable, Google/Gemini, etc.).

### Environment variables
Use `.env` (not committed). See `.env.example` for all keys:

- `N8N_BASIC_AUTH_ACTIVE`, `N8N_BASIC_AUTH_USER`, `N8N_BASIC_AUTH_PASSWORD`
- `N8N_ENCRYPTION_KEY` (32 chars recommended)
- `WEBHOOK_TUNNEL_URL` (if using ngrok/Cloudflared)
- `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID`
- `GOOGLE_API_KEY`

## Deploying n8n (Railway)

- This repo includes `railway.toml`. Replace placeholder values with env vars in Railway’s dashboard instead of committing real secrets.
- Set the following variables in Railway:
  - `N8N_BASIC_AUTH_ACTIVE=true`
  - `N8N_BASIC_AUTH_USER=admin`
  - `N8N_BASIC_AUTH_PASSWORD` (strong value)
  - `N8N_ENCRYPTION_KEY` (32 characters)
  - Any integration keys (Airtable/Google)

## Development tips

- Keep workflow exports private; if you need to share a workflow, remove credential blocks before exporting.
- To serve the static frontend locally you can open `index.html` directly, or use any static server.

## Troubleshooting pushes blocked by secrets

1. Replace any real keys with `YOUR_KEY_VALUE` locally.
2. Remove sensitive files from Git and add them to `.gitignore`.
3. If a secret was committed in history, rewrite or reset and force-push.

---
Maintained by Pankaj Kumar. Contributions welcome.

## Webhook URL helper script (Windows)

This repo includes a tiny helper that updates `config.js` with the correct webhook URL per environment.

Usage from Command Prompt (cmd):

```
set-webhook.cmd prod https://your-host/webhook/ai-resume-upload
```

Supported environments: `local`, `prod`, `test`.

Examples:

```
:: Local ngrok tunnel
set-webhook.cmd local https://your-ngrok-id.ngrok-free.app/webhook/ai-resume-upload

:: Production URL
set-webhook.cmd prod https://your-domain.com/webhook/ai-resume-upload
```

How it works:
- `config.js` holds placeholder URLs for `local`, `prod`, `test`.
- The script safely replaces the chosen entry, keeping the file commit-safe.
- `index.html` reads `window.APP_CONFIG.webhookUrl` from `config.js`.

Advanced:
- You can override at runtime via query params without editing files:
  - `index.html?env=prod` selects the prod URL from `config.js`.
  - `index.html?webhook=https%3A%2F%2Fexample.com%2Fhook` uses the provided URL directly.
