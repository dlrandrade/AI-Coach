import { beforeAll, afterAll, describe, expect, it, vi } from 'vitest';
import { AddressInfo } from 'node:net';

let server: any;
let base = '';

beforeAll(async () => {
  process.env.ADMIN_API_KEY = 'adm_test_key';
  vi.resetModules();
  const mod = await import('./index.js');
  const app = mod.default;
  server = app.listen(0);
  await new Promise((r) => server.once('listening', r));
  const addr = server.address() as AddressInfo;
  base = `http://127.0.0.1:${addr.port}`;
});

afterAll(async () => {
  if (server) await new Promise((r) => server.close(r));
});

describe('admin endpoints', () => {
  it('creates lead and exports csv with admin key', async () => {
    const leadRes = await fetch(`${base}/api/leads`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        name: 'Daniel',
        email: 'daniel@example.com',
        whatsapp: '+5511999999999',
        consent: true,
        handle: 'danielluzz',
        objective: 'AUTORIDADE',
        planDays: 7
      })
    });

    expect(leadRes.status).toBe(200);

    const csvRes = await fetch(`${base}/api/leads.csv?limit=10`, {
      headers: { 'x-api-key': 'adm_test_key' }
    });
    expect(csvRes.status).toBe(200);
    expect(csvRes.headers.get('content-type') || '').toContain('text/csv');
    const csv = await csvRes.text();
    expect(csv).toContain('createdAt,name,email,whatsapp');
    expect(csv).toContain('Daniel');
  });

  it('returns metrics history with admin key', async () => {
    const r = await fetch(`${base}/api/metrics-history?days=3`, {
      headers: { 'x-api-key': 'adm_test_key' }
    });
    expect(r.status).toBe(200);
    const j = await r.json();
    expect(j.days).toBe(3);
    expect(Array.isArray(j.history)).toBe(true);
    expect(j.history.length).toBe(3);
  });
});
