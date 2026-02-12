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
   - `API_KEY` (shared secret between frontend and server)
3. Start the server:
   `npm run server`
4. Start the frontend:
   `npm run dev`

The frontend expects `VITE_API_BASE_URL` (default is `http://localhost:8787`) to reach the server.
If you run the frontend on a different origin, set `CORS_ORIGINS` in `.env`.
The frontend also expects `VITE_API_KEY` to match `API_KEY`.
For debug data on the UI, set `VITE_DEBUG=true` (server-side raw data still requires `DEBUG=true`).
