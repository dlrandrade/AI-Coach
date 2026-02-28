import React, { useState } from 'react';

type Row = { day: string; metrics: any | null };

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:8787' : '');

export const AdminMetricsPanel: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [key, setKey] = useState('');
  const [days, setDays] = useState(7);
  const [rows, setRows] = useState<Row[]>([]);
  const [slo, setSlo] = useState<any>(null);
  const [err, setErr] = useState('');

  const load = async () => {
    setErr('');
    try {
      const h = { 'X-API-KEY': key };
      const [r1, r2] = await Promise.all([
        fetch(`${API_BASE_URL}/api/metrics-history?days=${days}`, { headers: h }),
        fetch(`${API_BASE_URL}/api/slo`, { headers: h })
      ]);
      if (!r1.ok || !r2.ok) throw new Error(`metrics:${r1.status} slo:${r2.status}`);
      const j1 = await r1.json();
      const j2 = await r2.json();
      setRows(j1.history || []);
      setSlo(j2);
    } catch (e: any) {
      setErr(e?.message || 'erro');
    }
  };

  return (
    <div className="fixed left-3 top-3 z-[120] no-print">
      {!open ? (
        <button className="text-[10px] font-mono px-2 py-1 bg-black/80 text-white rounded" onClick={() => setOpen(true)}>
          OPS
        </button>
      ) : (
        <div className="w-[320px] max-h-[70vh] overflow-auto bg-white border-2 border-black p-3 text-xs">
          <div className="flex justify-between items-center mb-2">
            <b>Ops Metrics</b>
            <button onClick={() => setOpen(false)}>✕</button>
          </div>
          <div className="space-y-2">
            <input value={key} onChange={(e) => setKey(e.target.value)} placeholder="ADMIN_API_KEY" className="w-full border p-1" />
            <div className="flex gap-2">
              <input type="number" min={1} max={30} value={days} onChange={(e) => setDays(Number(e.target.value) || 7)} className="w-20 border p-1" />
              <button onClick={load} className="border px-2 py-1">Carregar</button>
            </div>
            {err && <div className="text-red-600">{err}</div>}
            {slo && (
              <div className="border p-2">
                <div><b>SLO:</b> {slo.ok ? 'OK' : 'ALERTA'}</div>
                <div>Erro: {(Number(slo.current?.errorRate || 0) * 100).toFixed(1)}%</div>
                <div>Latência média: {slo.current?.avgLatencyMs || 0}ms</div>
              </div>
            )}
            <div className="border p-2">
              <b>Histórico</b>
              <div className="mt-1 space-y-1">
                {rows.map((r) => (
                  <div key={r.day} className="flex justify-between">
                    <span>{r.day}</span>
                    <span>{r.metrics ? `ok:${r.metrics.analyzeSuccess||0} fail:${r.metrics.analyzeFail||0}` : '-'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
