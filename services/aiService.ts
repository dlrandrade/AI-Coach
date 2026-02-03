// OpenRouter Configuration
const OPENROUTER_API_KEY = "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";
const OPENROUTER_MODEL = "meta-llama/llama-3.3-70b-instruct:free";
const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1/chat/completions";

// THE LUZZIA PROTOCOL v3.0 - COMPLETE ANALYSIS
const SYSTEM_PROMPT = `
Você é a LuzzIA, um sistema de análise de posicionamento estratégico para perfis de Instagram.

## MISSÃO
Realizar uma análise COMPLETA de posicionamento, identificando:
1. Padrões de comportamento que limitam autoridade
2. Medos psicológicos por trás das escolhas de conteúdo
3. Custo real em crescimento e credibilidade

---

## REGRAS OBRIGATÓRIAS

> [!IMPORTANT]
> Você DEVE retornar EXATAMENTE 3 blocos de diagnóstico.
> Você DEVE retornar um plano de EXATAMENTE 7 dias.
> Respeite o formato JSON abaixo. Retorne APENAS o JSON, sem explicações.

---

## FORMATO DE RESPOSTA (JSON)

{
  "blocks": [
    {
      "title": "BLOCO 1 - IDENTIDADE",
      "acusacao": "Frase direta sobre o problema de identidade/posicionamento.",
      "medo": "O medo psicológico por trás desse padrão.",
      "custo": "O impacto real em seguidores ou dinheiro.",
      "prova": "O que foi observado na bio, feed ou legendas."
    },
    {
      "title": "BLOCO 2 - CONTEÚDO",
      "acusacao": "Frase sobre o problema de conteúdo/engajamento.",
      "medo": "O medo que causa esse padrão.",
      "custo": "O custo em engajamento ou conversão.",
      "prova": "Evidência específica nos posts."
    },
    {
      "title": "BLOCO 3 - AUTORIDADE",
      "acusacao": "Frase sobre falta de autoridade/credibilidade.",
      "medo": "O medo que impede demonstrar expertise.",
      "custo": "O custo em oportunidades perdidas.",
      "prova": "Evidência nos destaques, bio ou linguagem."
    }
  ],
  "verdict": "SENTENÇA FINAL EM UMA FRASE IMPACTANTE",
  "plan": [
    { "day": 1, "action": "Ação do dia 1", "format": "bio", "why": "Justificativa psicológica", "prompt": "Prompt para ChatGPT gerar o conteúdo do dia 1. Seja específico sobre tom, estrutura e objetivo." },
    { "day": 2, "action": "Ação do dia 2", "format": "carrossel", "why": "Justificativa", "prompt": "Prompt para dia 2." },
    { "day": 3, "action": "Ação do dia 3", "format": "story", "why": "Justificativa", "prompt": "Prompt para dia 3." },
    { "day": 4, "action": "Ação do dia 4", "format": "reel", "why": "Justificativa", "prompt": "Prompt para dia 4." },
    { "day": 5, "action": "Ação do dia 5", "format": "carrossel", "why": "Justificativa", "prompt": "Prompt para dia 5." },
    { "day": 6, "action": "Ação do dia 6", "format": "story", "why": "Justificativa", "prompt": "Prompt para dia 6." },
    { "day": 7, "action": "Ação do dia 7", "format": "reel", "why": "Justificativa", "prompt": "Prompt para dia 7." }
  ]
}
`;

export interface AnalysisBlock {
  title: string;
  acusacao: string;
  medo: string;
  custo: string;
  prova: string;
}

export interface PlanDay {
  day: number;
  action: string;
  format: string;
  why: string;
  prompt: string;
}

export interface AnalysisResult {
  blocks: AnalysisBlock[];
  verdict: string;
  plan: PlanDay[];
}

export const analyzeProfile = async (handle: string): Promise<AnalysisResult> => {
  try {
    const response = await fetch(OPENROUTER_BASE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'LuzzIA'
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Analise o perfil @${handle}. Retorne 3 blocos de diagnóstico e um plano de 7 dias.` }
        ],
        temperature: 0.7,
        max_tokens: 4000
      })
    });

    if (!response.ok) throw new Error('API Error');

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    const jsonString = content.replace(/```json|```/g, '').trim();
    return JSON.parse(jsonString) as AnalysisResult;

  } catch (error) {
    console.error('AI Error:', error);
    return simulateAnalysis(handle);
  }
};

const simulateAnalysis = (handle: string): AnalysisResult => {
  return {
    blocks: [
      {
        title: "BLOCO 1 - IDENTIDADE",
        acusacao: "O perfil comunica esforço, mas não autoridade.",
        medo: "Medo de parecer arrogante ou inacessível.",
        custo: "Atrai clientes que pedem desconto e não valorizam expertise.",
        prova: "Bio genérica sem diferencial claro. Falta de posicionamento específico."
      },
      {
        title: "BLOCO 2 - CONTEÚDO",
        acusacao: "Conteúdo focado em quantidade, não em impacto.",
        medo: "Medo de não ter o que postar e perder relevância.",
        custo: "Engajamento superficial. Seguidores não se tornam clientes.",
        prova: "Posts com frases motivacionais genéricas. Falta de conteúdo prático."
      },
      {
        title: "BLOCO 3 - AUTORIDADE",
        acusacao: "Falta de provas de resultado visíveis.",
        medo: "Medo de expor clientes ou parecer se gabando.",
        custo: "Concorrentes com menos expertise fecham mais porque mostram resultados.",
        prova: "Nenhum destaque de cases ou transformações. Bio sem números concretos."
      }
    ],
    verdict: "SEU PERFIL VENDE ESFORÇO, NÃO TRANSFORMAÇÃO",
    plan: [
      { day: 1, action: "Reescrever a bio com oferta clara e resultado específico", format: "bio", why: "A bio é a primeira impressão. Precisa comunicar valor em 3 segundos.", prompt: `Você é estrategista de Instagram. Crie 3 versões de bio para @${handle}. Cada bio deve: ter no máximo 150 caracteres, incluir um resultado específico, ter um CTA claro. Formato: texto direto, sem emojis excessivos.` },
      { day: 2, action: "Criar carrossel sobre o maior erro do nicho", format: "carrossel", why: "Conteúdo que chama a atenção e estabelece autoridade.", prompt: `Crie um carrossel de 7 slides sobre o maior erro que [nicho] comete. Slide 1: gancho provocativo. Slides 2-6: o erro e suas consequências. Slide 7: CTA para salvar.` },
      { day: 3, action: "Story mostrando bastidores do trabalho", format: "story", why: "Humanização e prova de trabalho real.", prompt: `Sugira 5 stories de bastidores para @${handle}. Cada story deve mostrar: uma parte do processo, um insight rápido, ou uma interação com cliente (com permissão).` },
      { day: 4, action: "Reel respondendo dúvida frequente do público", format: "reel", why: "Reels geram alcance. Dúvidas geram conexão.", prompt: `Crie um roteiro de reel de 30 segundos respondendo: [dúvida frequente do nicho]. Estrutura: Gancho (3s), Problema (5s), Solução (15s), CTA (7s).` },
      { day: 5, action: "Carrossel com case de transformação", format: "carrossel", why: "Prova social é o maior gatilho de decisão.", prompt: `Crie um carrossel de 8 slides mostrando case de transformação. Slide 1: Antes. Slide 2-3: Problema enfrentado. Slides 4-6: Processo. Slide 7: Resultado. Slide 8: CTA.` },
      { day: 6, action: "Story com enquete sobre dor do público", format: "story", why: "Engajamento ativo e coleta de dados para conteúdo futuro.", prompt: `Crie 3 enquetes de story para @${handle}. Cada enquete deve identificar uma dor específica do público e ter opções que revelam o nível de consciência do problema.` },
      { day: 7, action: "Reel com opinião forte sobre o mercado", format: "reel", why: "Polarização gera posicionamento e memorabilidade.", prompt: `Crie roteiro de reel de 45s com opinião forte sobre [tendência do nicho]. Tom: direto, sem rodeios. Objetivo: gerar comentários e posicionar como autoridade que não tem medo de opinar.` }
    ]
  };
};
