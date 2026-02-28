#!/usr/bin/env node

const base = process.env.SMOKE_BASE_URL || 'http://localhost:8787';
const adminKey = process.env.ADMIN_API_KEY || '';

const check = async (name, fn) => {
  try {
    await fn();
    console.log(`✅ ${name}`);
  } catch (e) {
    console.error(`❌ ${name}: ${e.message}`);
    process.exitCode = 1;
  }
};

const must = (cond, msg) => {
  if (!cond) throw new Error(msg);
};

await check('health', async () => {
  const r = await fetch(`${base}/api/health`);
  must(r.ok, `status ${r.status}`);
  const j = await r.json();
  must(j.ok === true, 'missing ok=true');
});

await check('usage payload', async () => {
  const r = await fetch(`${base}/api/usage`, {
    headers: { 'x-client-id': 'cli_smoke_123456' }
  });
  must(r.ok, `status ${r.status}`);
  const j = await r.json();
  must(Array.isArray(j?.usage?.packages), 'missing usage.packages');
});

await check('analyze validation', async () => {
  const r = await fetch(`${base}/api/analyze`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ handle: 'invalid handle', planDays: 7, objective: 1 })
  });
  must(r.status === 400, `expected 400, got ${r.status}`);
});

await check('admin metrics protection', async () => {
  const r = await fetch(`${base}/api/metrics`);
  must([401, 403].includes(r.status), `expected 401/403, got ${r.status}`);
});

if (adminKey) {
  await check('admin metrics with key', async () => {
    const r = await fetch(`${base}/api/metrics`, { headers: { 'x-api-key': adminKey } });
    must(r.ok, `status ${r.status}`);
    const j = await r.json();
    must(j?.metrics, 'missing metrics');
  });
}

if (process.exitCode) process.exit(process.exitCode);
console.log('\nSmoke test finalizado com sucesso.');
