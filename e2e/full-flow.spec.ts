import { test, expect } from '@playwright/test';

test('full journey: analyze -> lead unlock -> plan (mocked api)', async ({ page }) => {
  await page.route('**/api/health', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) });
  });

  await page.route('**/api/analyze', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        result: {
          leitura_perfil: {
            bio_completa: 'bio',
            posts_analisados: ['post 1', 'post 2'],
            destaques_encontrados: ['destaque 1'],
            stories_recentes: 'Stories recentes não disponível via API pública.',
            metricas_visiveis: { seguidores: 16868, seguindo: 120, posts_total: 28 },
            impressao_geral: 'Perfil forte com espaço para mais prova.'
          },
          diagnosis: {
            objetivo_ativo: 'AUTORIDADE',
            pecado_capital: 'sem_provas',
            conflito_oculto: 'promessa sem evidência concreta',
            posicionamento: 'aspirante',
            acao_alavancagem: 'publicar case com métrica real',
            sentenca: 'Falta prova concreta.',
            modo_falha: 'sem_provas',
            dissecacao: {
              bio: { status: 'alavanca', veredicto: 'boa' },
              feed: { status: 'sabotador', veredicto: 'fraco' },
              stories: { status: 'neutro', veredicto: 'ok' },
              provas: { status: 'sabotador', veredicto: 'faltam' },
              ofertas: { status: 'sabotador', veredicto: 'fraca' },
              linguagem: { status: 'neutro', veredicto: 'ok' }
            }
          },
          plan: Array.from({ length: 7 }).map((_, i) => ({
            day: i + 1,
            objetivo_psicologico: `Objetivo ${i + 1}`,
            acao: `Ação ${i + 1}`,
            formato: 'post',
            ferramenta: 'feed',
            tipo: 'padrao',
            prompt: `CONTEXTO FIXO DO DIAGNÓSTICO (NÃO IGNORAR):\n- Dia do plano: ${i + 1}/7\nTAREFA:\nPrompt do dia ${i + 1}`
          }))
        },
        usage: { freeUsed: true, creditsRemaining: 0, totalUsed: 1, packages: [3, 10, 30] },
        clientId: 'cli_e2e_123',
        meta: { modelUsed: 'openrouter/auto', requestId: 'req_e2e_123abc' }
      })
    });
  });

  await page.route('**/api/leads', async (route) => {
    const payload = route.request().postDataJSON();
    if (!payload?.consent) {
      await route.fulfill({ status: 400, contentType: 'application/json', body: JSON.stringify({ error: 'consent obrigatório' }) });
      return;
    }
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, leadToken: 'lead_e2e_ok' }) });
  });

  await page.addInitScript(() => {
    window.localStorage.setItem('luzzia_visited_v2', 'true');
  });

  await page.goto('/');

  const startBtn = page.getByRole('button', { name: /FAZER DIAGNÓSTICO AGORA/i });
  if (await startBtn.isVisible().catch(() => false)) {
    await startBtn.click();
  }

  const skipIntro = page.getByText(/Pular introdução/i);
  if (await skipIntro.isVisible().catch(() => false)) {
    await skipIntro.click();
  }

  await page.getByPlaceholder('@usuario').fill('danielluzz');
  await page.getByRole('button', { name: /DOMINAR TERRITÓRIO/i }).click();
  await page.getByRole('button', { name: /INICIAR DIAGNÓSTICO/i }).click();

  await expect(page.getByRole('heading', { name: /DIAGNÓSTICO/i })).toBeVisible();

  await page.getByRole('button', { name: /VER PLANO DE/i }).click();
  await expect(page.getByText(/Desbloquear plano completo/i)).toBeVisible();

  await page.getByPlaceholder('Seu nome').fill('Daniel Luzz');
  await page.getByPlaceholder('Seu e-mail').fill('eusou@danielluzz.com.br');
  await page.getByPlaceholder('WhatsApp').fill('+5511999999999');
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: /Desbloquear agora/i }).click();

  await expect(page.getByText(/Plano de 7 dias|Dia 1|Prompt do dia 1/i).first()).toBeVisible();
  await expect(page.getByText(/uniq:/i).first()).toBeVisible();
});
