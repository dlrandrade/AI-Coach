import { beforeAll, afterAll, describe, expect, it } from 'vitest';
import app from './index.js';
import { AddressInfo } from 'node:net';

let server: any;
let base = '';

beforeAll(async () => {
  server = app.listen(0);
  await new Promise((r) => server.once('listening', r));
  const addr = server.address() as AddressInfo;
  base = `http://127.0.0.1:${addr.port}`;
});

afterAll(async () => {
  if (server) await new Promise((r) => server.close(r));
});

describe('api integration smoke', () => {
  it('GET /api/health returns ok', async () => {
    const r = await fetch(`${base}/api/health`);
    expect(r.status).toBe(200);
    const j = await r.json();
    expect(j.ok).toBe(true);
  });

  it('POST /api/analyze rejects invalid handle', async () => {
    const r = await fetch(`${base}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ handle: 'invalid handle', planDays: 7, objective: 1 })
    });
    expect(r.status).toBe(400);
  });

  it('GET /api/usage returns usage payload', async () => {
    const r = await fetch(`${base}/api/usage`, { headers: { 'x-client-id': 'cli_test_123456' } });
    expect(r.status).toBe(200);
    const j = await r.json();
    expect(j.usage).toBeTruthy();
    expect(Array.isArray(j.usage.packages)).toBe(true);
  });

  it('GET /api/metrics denies access without admin key', async () => {
    const r = await fetch(`${base}/api/metrics`);
    expect([401, 403]).toContain(r.status);
  });

  it('GET /api/slo denies access without admin key', async () => {
    const r = await fetch(`${base}/api/slo`);
    expect([401, 403]).toContain(r.status);
  });

  it('GET /api/metrics-history denies access without admin key', async () => {
    const r = await fetch(`${base}/api/metrics-history`);
    expect([401, 403]).toContain(r.status);
  });

  it('POST /api/leads validates consent', async () => {
    const r = await fetch(`${base}/api/leads`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'Teste', email: 'a@a.com', whatsapp: '+5511999999999', consent: false, handle: 'abc', objective: 'AUTORIDADE', planDays: 7 })
    });
    expect(r.status).toBe(400);
  });

  it('GET /api/leads denies access without admin key', async () => {
    const r = await fetch(`${base}/api/leads`);
    expect([401, 403]).toContain(r.status);
  });
});
