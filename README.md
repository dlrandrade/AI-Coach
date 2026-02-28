<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run locally

This app has a Vite frontend and a small Node server that proxies the AI + Instagram scraping (to keep API keys off the client).

## Run Locally

**Prerequisites:**  Node.js

1. Create `.env` from the example:
   `cp .env.example .env`
2. Fill in your keys in `.env`:
   - `OPENROUTER_API_KEY`
   - `RAPIDAPI_KEY`
   - `API_KEY` (optional shared secret between frontend and server)
   - `ADMIN_API_KEY` (required to grant paid credits manually)
3. Start the server:
   `npm run server`
4. Start the frontend:
   `npm run dev`

The frontend expects `VITE_API_BASE_URL` (default is `http://localhost:8787`) to reach the server.
If you run the frontend on a different origin, set `CORS_ORIGINS` in `.env`.
(Quick-win security update: when `CORS_ORIGINS` is empty, only same-host origin is allowed.)
If `API_KEY` is set, frontend `VITE_API_KEY` must match it.
For debug data on the UI, set `VITE_DEBUG=true` (server-side raw data still requires `DEBUG=true`).
For production behavior, keep `VITE_ALLOW_SIMULATION_FALLBACK=false`.
To temporarily unlock diagnosis limits during testing, set `QUOTA_ENABLED=false`.

### Optional: persistent quota/rate-limit storage (recommended)

By default, quota/rate-limit are in-memory. For production/serverless consistency, configure Upstash Redis:

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

When configured, usage/rate-limit state is persisted across instances.

### Output tone and scrape cache

- `OUTPUT_TONE=professional|aggressive` (default: `professional`)
- `SCRAPE_CACHE_TTL_MS` (default: `300000`, 5 minutes)
- `CACHE_CLEANUP_INTERVAL_MS` (default: `60000`)
- `REQUEST_TIMEOUT_MS` (default: `25000`)
- `SLO_MAX_ERROR_RATE` (default: `0.08`)
- `SLO_MAX_AVG_LATENCY_MS` (default: `12000`)

The backend now caches Instagram scrape results briefly to reduce latency/cost on repeated analyses of the same handle.

### OpenRouter model rotation (anti-limit)

Configure all 5 models in `OPENROUTER_MODELS` (comma-separated):

- `openai/gpt-oss-120b:free`
- `arcee-ai/trinity-large-preview:free`
- `tngtech/deepseek-r1t2-chimera:free`
- `nvidia/nemotron-3-nano-30b-a3b:free`
- `stepfun/step-3.5-flash:free`

The backend automatically rotates/fallbacks across this list when one model fails or hits limits.

### Credit packages (1 free, then paid)

- First diagnosis is free.
- After that, user needs credits (3, 10 or 30).
- Frontend paywall reads:
  - `VITE_CHECKOUT_URL_3`
  - `VITE_CHECKOUT_URL_10`
  - `VITE_CHECKOUT_URL_30`

After payment, grant credits using admin endpoint:

```bash
curl -X POST http://localhost:8787/api/grant-credits \
  -H "Content-Type: application/json" \
  -H "X-API-KEY: $ADMIN_API_KEY" \
  -d '{"clientId":"cli_xxx","amount":10}'
```

Metrics endpoint (admin key required):

```bash
curl -H "X-API-KEY: $ADMIN_API_KEY" http://localhost:8787/api/metrics
```

SLO endpoint (admin key required):

```bash
curl -H "X-API-KEY: $ADMIN_API_KEY" http://localhost:8787/api/slo
```

Metrics history endpoint (admin key required):

```bash
curl -H "X-API-KEY: $ADMIN_API_KEY" "http://localhost:8787/api/metrics-history?days=7"
```

The user can click `JÁ PAGUEI, ATUALIZAR ACESSO` to refresh credits.

## Vercel (frontend + API)

This repo includes serverless handlers in `api/` and deployment config in `vercel.json`.

Set these environment variables in Vercel:
- `OPENROUTER_API_KEY`
- `RAPIDAPI_KEY`
- `OPENROUTER_MODELS` (recommended)
- `OPENROUTER_BASE_URL` (optional)
- `OPENROUTER_HTTP_REFERER` (recommended; your production domain)
- `OPENROUTER_APP_TITLE` (recommended; app name shown in OpenRouter logs)
- `RAPIDAPI_HOST` (optional)
- `CORS_ORIGINS` (optional; comma-separated)
- `API_KEY` (optional)
- `ADMIN_API_KEY` (required for credit grants)

In production, keep `VITE_API_BASE_URL` empty so frontend calls `/api/analyze` on the same domain.

## Production merge/deploy checklist

1. Configure required envs on Vercel:
   - `OPENROUTER_API_KEY`
   - `RAPIDAPI_KEY`
   - `ADMIN_API_KEY`
2. Configure security/ops envs:
   - `CORS_ORIGINS` (explicit domain list)
   - `OUTPUT_TONE=professional`
   - `SCRAPE_CACHE_TTL_MS=300000`
   - `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` (recommended)
3. Deploy.
4. Run smoke checks:

```bash
SMOKE_BASE_URL=https://SEU-DOMINIO.vercel.app npm run smoke
```

(Optional with admin checks):

```bash
SMOKE_BASE_URL=https://SEU-DOMINIO.vercel.app ADMIN_API_KEY=... npm run smoke
```

### Runtime trust signals (UI)

The app now shows a discreet runtime badge with:
- API status (`offline/processando/ok/contingência`)
- prompt uniqueness score (`uniq:%`)
- model/fallback source
- short request trace id

There is also a discreet `OPS` button (top-left) for internal metrics checks using `ADMIN_API_KEY`.
Set `VITE_ENABLE_OPS_PANEL=false` in production public environments.
The backend also returns `X-Request-Id` on `/api/analyze` responses.

### Lead unlock flow

The 7/30-day plan can be unlocked only after lead capture.
Lead data is stored in:
- Upstash Redis (when configured): `lead:<token>` + `leads:recent`
- Memory fallback (when Upstash is not configured)

Admin can list leads:

```bash
curl -H "X-API-KEY: $ADMIN_API_KEY" "http://localhost:8787/api/leads?limit=50"
```

Admin can export leads as CSV:

```bash
curl -L -H "X-API-KEY: $ADMIN_API_KEY" "http://localhost:8787/api/leads.csv?limit=200" -o leads.csv
```
