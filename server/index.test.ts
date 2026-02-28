import { describe, it, expect } from 'vitest';
import {
  parseModelJson,
  sanitizeAnalysisResult,
  validateAnalyzeInput,
  normalizeAnalysisResult,
  enrichPlanPromptsWithContext
} from './index.js';

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

  it('normalizeAnalysisResult creates non-generic structured fallback plan', () => {
    const normalized = normalizeAnalysisResult({}, 7, 1);
    expect(normalized.plan).toHaveLength(7);
    const prompts = normalized.plan.map((d: any) => d.prompt);
    expect(new Set(prompts).size).toBeGreaterThan(1);
    expect(normalized.diagnosis).toBeTruthy();
  });

  it('enrichPlanPromptsWithContext injects diagnosis context into each prompt', () => {
    const base = normalizeAnalysisResult({}, 7, 1);
    const enriched = enrichPlanPromptsWithContext(base, {
      handle: 'danielluzz',
      planDays: 7,
      objectiveLabel: 'AUTORIDADE'
    });
    expect(enriched.plan[0].prompt).toContain('CONTEXTO FIXO DO DIAGNÓSTICO');
    expect(enriched.plan[0].prompt).toContain('@danielluzz');
    expect(enriched.plan[0].prompt).toContain('Dia do plano: 1/7');
  });
});
