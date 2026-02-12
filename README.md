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
3. Start the server:
   `npm run server`
4. Start the frontend:
   `npm run dev`

The frontend expects `VITE_API_BASE_URL` (default is `http://localhost:8787`) to reach the server.
If you run the frontend on a different origin, set `CORS_ORIGINS` in `.env`.
If `API_KEY` is set, frontend `VITE_API_KEY` must match it.
For debug data on the UI, set `VITE_DEBUG=true` (server-side raw data still requires `DEBUG=true`).

## Vercel (frontend + API)

This repo includes serverless handlers in `api/` and deployment config in `vercel.json`.

Set these environment variables in Vercel:
- `OPENROUTER_API_KEY`
- `RAPIDAPI_KEY`
- `OPENROUTER_MODEL` (optional)
- `OPENROUTER_BASE_URL` (optional)
- `RAPIDAPI_HOST` (optional)
- `CORS_ORIGINS` (optional; comma-separated)
- `API_KEY` (optional)

In production, keep `VITE_API_BASE_URL` empty so frontend calls `/api/analyze` on the same domain.
