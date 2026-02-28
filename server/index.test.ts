import { describe, it, expect } from 'vitest';
import { parseModelJson, sanitizeAnalysisResult, validateAnalyzeInput } from './index.js';

describe('server helpers', () => {
  it('parseModelJson extracts JSON wrapped in markdown', () => {
    const raw = '```json\n{"ok":true,"plan":[]}\n```';
    const parsed = parseModelJson(raw);
    expect(parsed.ok).toBe(true);
  });

  it('validateAnalyzeInput rejects invalid handle', () => {
    const bad = validateAnalyzeInput({ handle: 'INVALID HANDLE', planDays: 7, objective: 1 });
    expect(bad.ok).toBe(false);
  });

  it('sanitizeAnalysisResult removes aggressive phrases', () => {
    const out = sanitizeAnalysisResult({
      diagnosis: { sentenca: 'ZERO PIEDADE', dissecacao: {} },
      plan: [{ acao: 'bloquear publicamente', prompt: 'sob pena de banimento', objetivo_psicologico: 'sem piedade' }]
    });

    expect(out.plan[0].acao.toLowerCase()).not.toContain('bloquear publicamente');
    expect(out.plan[0].prompt.toLowerCase()).not.toContain('banimento');
  });
});
