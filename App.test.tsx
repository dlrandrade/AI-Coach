import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from './App';

const analyzeProfileMock = vi.fn();
const getUsageMock = vi.fn();
const getHealthMock = vi.fn();
const saveLeadMock = vi.fn();

vi.mock('./services/aiService', async () => {
  const actual: any = await vi.importActual('./services/aiService');
  return {
    ...actual,
    analyzeProfile: (...args: any[]) => analyzeProfileMock(...args),
    getUsage: (...args: any[]) => getUsageMock(...args),
    getHealth: (...args: any[]) => getHealthMock(...args),
    saveLead: (...args: any[]) => saveLeadMock(...args)
  };
});

vi.mock('./components/InputScreen', () => ({
  InputScreen: ({ onAnalyze }: any) => (
    <button onClick={() => onAnalyze('danielluzz', 7, 1)}>analisar</button>
  )
}));

vi.mock('./components/DiagnosisScreen', () => ({
  DiagnosisScreen: ({ onNext }: any) => (
    <div>
      <div>diagnosis-ready</div>
      <button onClick={onNext}>next-plan</button>
    </div>
  )
}));

vi.mock('./components/SevenDayPlanScreen', () => ({
  SevenDayPlanScreen: () => <div>plan-visible</div>
}));

describe('App lead-gate flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getHealthMock.mockResolvedValue({ ok: true });
    analyzeProfileMock.mockResolvedValue({
      result: {
        leitura_perfil: {
          bio_completa: '', posts_analisados: [], destaques_encontrados: [], stories_recentes: '',
          metricas_visiveis: { seguidores: null, seguindo: null, posts_total: null }, impressao_geral: ''
        },
        diagnosis: {
          objetivo_ativo: 'AUTORIDADE',
          pecado_capital: '',
          conflito_oculto: '',
          posicionamento: 'aspirante',
          acao_alavancagem: '',
          sentenca: '',
          modo_falha: '',
          dissecacao: {
            bio: { status: 'neutro', veredicto: '' },
            feed: { status: 'neutro', veredicto: '' },
            stories: { status: 'neutro', veredicto: '' },
            provas: { status: 'neutro', veredicto: '' },
            ofertas: { status: 'neutro', veredicto: '' },
            linguagem: { status: 'neutro', veredicto: '' }
          }
        },
        plan: [
          { day: 1, objetivo_psicologico: '', acao: '', formato: '', ferramenta: '', tipo: 'padrao', prompt: 'a' },
          { day: 2, objetivo_psicologico: '', acao: '', formato: '', ferramenta: '', tipo: 'padrao', prompt: 'b' },
          { day: 3, objetivo_psicologico: '', acao: '', formato: '', ferramenta: '', tipo: 'padrao', prompt: 'c' },
          { day: 4, objetivo_psicologico: '', acao: '', formato: '', ferramenta: '', tipo: 'padrao', prompt: 'd' },
          { day: 5, objetivo_psicologico: '', acao: '', formato: '', ferramenta: '', tipo: 'padrao', prompt: 'e' },
          { day: 6, objetivo_psicologico: '', acao: '', formato: '', ferramenta: '', tipo: 'padrao', prompt: 'f' },
          { day: 7, objetivo_psicologico: '', acao: '', formato: '', ferramenta: '', tipo: 'padrao', prompt: 'g' }
        ]
      },
      usage: { freeUsed: true, creditsRemaining: 0, totalUsed: 1, packages: [3, 10, 30] },
      clientId: 'cli_x',
      meta: { modelUsed: 'openrouter/auto', requestId: 'req_123' }
    });
    saveLeadMock.mockResolvedValue({ ok: true, leadToken: 'lead_abc' });
  });

  it('requires lead before showing plan and submits lead payload', async () => {
    render(<App />);

    fireEvent.click(screen.getByText('analisar'));
    await screen.findByText('diagnosis-ready');

    fireEvent.click(screen.getByText('next-plan'));
    await screen.findByText('Desbloquear plano completo');

    fireEvent.change(screen.getByPlaceholderText('Seu nome'), { target: { value: 'Daniel' } });
    fireEvent.change(screen.getByPlaceholderText('Seu e-mail'), { target: { value: 'daniel@teste.com' } });
    fireEvent.change(screen.getByPlaceholderText('WhatsApp'), { target: { value: '+5511999999999' } });
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByText('Desbloquear agora'));

    await waitFor(() => {
      expect(saveLeadMock).toHaveBeenCalled();
      expect(screen.getByText('plan-visible')).toBeTruthy();
    });

    const payload = saveLeadMock.mock.calls[0][0];
    expect(payload.handle).toBe('danielluzz');
    expect(payload.objective).toBe('AUTORIDADE');
    expect(payload.planDays).toBe(7);
  });
});
